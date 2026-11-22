/* =========================================================
   The tiny fairy.
   About once every three pages after "Let's start" (randomly, so
   it's never on the same pages twice), a 12px fairy darts in,
   flits around leaving fairy dust that vanishes almost instantly,
   ducks behind words in the question and behind answer bubbles,
   and buzzes over the bubbles. After 8 seconds it dives behind one
   answer bubble and is gone.

   "Behind" is a trick: the bubbles are see-through, so the fairy
   just turns invisible while it's inside the word/bubble's box.
   From outside it looks like it slipped behind the edge.

   script.js calls window.fairyOnPage(pageId) every time a page shows.
   ========================================================= */
(function () {
  // Less-motion setting on the phone/computer: no fairy at all.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  const LIFETIME = 8000; // ms before it goes to hide for good
  const rand = (a, b) => a + Math.random() * (b - a);
  const pick = (list) => list[Math.floor(Math.random() * list.length)];

  // First fairy shows up 1–3 pages after the start page, then every
  // 2–4 pages (about every three, never on a fixed schedule).
  let pagesUntil = 1 + Math.floor(Math.random() * 3);
  let current = null;

  window.fairyOnPage = function (pageId) {
    if (current) { current.stop(); current = null; }
    if (pageId === "page1") return;

    const page = document.getElementById(pageId);
    pagesUntil--;
    if (pagesUntil > 0) return;
    // It needs answer bubbles to hide behind at the end. If this page
    // has none (name page, result), it waits for the next page instead.
    if (!page || !page.querySelector(".answer-btn")) { pagesUntil = 1; return; }

    pagesUntil = 2 + Math.floor(Math.random() * 3);
    current = launch(page, rand(500, 3000));
  };

  // Every word (4+ letters) inside the bold text on this page
  function wordRanges(page) {
    const words = [];
    page.querySelectorAll(".question, strong, b").forEach((box) => {
      const walker = document.createTreeWalker(box, NodeFilter.SHOW_TEXT);
      let node;
      while ((node = walker.nextNode())) {
        const re = /\S{4,}/g;
        let m;
        while ((m = re.exec(node.data))) {
          const r = document.createRange();
          r.setStart(node, m.index);
          r.setEnd(node, m.index + m[0].length);
          words.push(r);
        }
      }
    });
    return words;
  }

  function inside(p, r, pad) {
    return p.x > r.left + pad && p.x < r.right - pad && p.y > r.top + pad && p.y < r.bottom - pad;
  }

  function launch(page, delay) {
    const el = document.createElement("div");
    el.className = "fairy";
    el.setAttribute("aria-hidden", "true");
    // Fairy silhouette: two pairs of wings, head, dress, legs and a star wand
    el.innerHTML =
      '<svg viewBox="0 0 20 20">' +
      '<g class="fairy-wing">' +
      '<path d="M10 8.5C7 2.5 1.5 2 1.2 5.6 1 8.6 5.5 9.8 10 9.2Z"/>' +
      '<path d="M10 9.6C6.5 10 3 13 4.4 15.6 5.8 17.4 8.6 13.6 10 10.4Z"/>' +
      "</g>" +
      '<g class="fairy-wing" transform="matrix(-1 0 0 1 20 0)">' +
      '<path d="M10 8.5C7 2.5 1.5 2 1.2 5.6 1 8.6 5.5 9.8 10 9.2Z"/>' +
      '<path d="M10 9.6C6.5 10 3 13 4.4 15.6 5.8 17.4 8.6 13.6 10 10.4Z"/>' +
      "</g>" +
      '<g class="fairy-body">' +
      '<circle cx="10" cy="4.3" r="1.9"/>' +
      '<path d="M9.1 6.4h1.8L13 14.2H7Z"/>' +
      '<path class="fairy-line" d="M9.1 14v4.2M10.9 14v4.2M10.6 7.6l4.2-3.4"/>' +
      '<circle class="fairy-star" cx="15.4" cy="3.6" r="1.3"/>' +
      "</g>" +
      "</svg>";
    let facing = 1;

    const answers = Array.from(page.querySelectorAll(".answer-btn"));
    const words = wordRanges(page);
    const rectOf = (thing) => thing.getBoundingClientRect();

    // Starts just off a random edge of the screen
    const W = () => document.documentElement.clientWidth || window.innerWidth;
    const H = () => window.innerHeight;

    // Phones scroll, so only pick words/bubbles that are on screen right
    // now (otherwise it would vanish behind a bubble you can't see).
    // If none are on screen, fall back to the closest one.
    const onScreen = (thing) => {
      const r = rectOf(thing);
      return r.bottom > 0 && r.top < H() && r.right > 0 && r.left < W();
    };
    const pickOnScreen = (list) => {
      const seen = list.filter(onScreen);
      if (seen.length) return pick(seen);
      const gap = (t) => { const r = rectOf(t); return r.top > H() ? r.top - H() : -r.bottom; };
      return list.slice().sort((a, b) => gap(a) - gap(b))[0];
    };

    // Speeds are tuned for a laptop screen. On a small phone screen the
    // same speed would cross it in a blink, so it flies slower there.
    const S = () => Math.max(0.5, Math.min(1, Math.min(W(), H()) / 700));
    const edge = Math.floor(Math.random() * 4);
    const pos = {
      x: edge === 0 ? -12 : edge === 1 ? W() + 12 : rand(0, W()),
      y: edge === 2 ? -12 : edge === 3 ? H() + 12 : rand(0, H()),
    };
    const vel = { x: 0, y: 0 };
    const seed = Math.random() * 1000;

    let queue = [];
    let step = null;
    let stepTime = 0;
    let elapsed = 0;
    let ending = false;
    let gone = false;
    let last = null;
    let raf = 0;
    let dustTravel = 0;
    let visible = true;

    // ---- the little moves it strings together at random ----
    const go = (point, speed, behind) => ({ point, speed, behind });
    const wait = (ms, behind) => ({ wait: ms, behind });
    const somewhere = () => ({ x: rand(20, W() - 20), y: rand(20, H() - 20) });
    const centerOf = (thing) => () => {
      const r = rectOf(thing);
      return { x: r.left + r.width * rand(0.3, 0.7), y: r.top + r.height * rand(0.3, 0.7) };
    };
    // A spot just outside one side of a box, so it pops out from behind it
    const outside = (thing) => {
      const side = Math.floor(Math.random() * 4);
      const along = Math.random();
      const gap = rand(14, 40);
      return () => {
        const r = rectOf(thing);
        if (side === 0) return { x: r.left - gap, y: r.top + r.height * along };
        if (side === 1) return { x: r.right + gap, y: r.top + r.height * along };
        if (side === 2) return { x: r.left + r.width * along, y: r.top - gap };
        return { x: r.left + r.width * along, y: r.bottom + gap };
      };
    };
    const hideBehind = (thing) => {
      const box = () => rectOf(thing);
      const into = centerOf(thing)();
      return [
        go(() => into, rand(160, 420), box),
        wait(rand(300, 1400), box),
        go(outside(thing), rand(140, 380), box),
      ];
    };

    const moves = [
      () => [go(somewhere(), rand(120, 450))],
      () => [go(somewhere(), rand(300, 600)), wait(rand(80, 500))],
      () => [wait(rand(200, 900))],
      () => (words.length ? hideBehind(pickOnScreen(words)) : []),
      () => hideBehind(pickOnScreen(answers)),
      () => {
        // Buzz over the top of a bubble, hopping between a few spots on it
        const btn = pickOnScreen(answers);
        const hops = [];
        for (let i = 2 + Math.floor(Math.random() * 3); i > 0; i--) {
          const r = rectOf(btn);
          hops.push(go({ x: r.left + rand(0, r.width), y: r.top + rand(0, r.height) }, rand(90, 300)));
          if (Math.random() < 0.4) hops.push(wait(rand(100, 500)));
        }
        return hops;
      },
    ];

    function nextStep() {
      // Mostly flying, with hiding and bubble-buzzing mixed in at random
      while (!queue.length && !ending) {
        queue = moves[pick([0, 0, 1, 2, 3, 3, 4, 4, 5, 5])]();
      }
      step = queue.shift() || null;
      stepTime = 0;
      if (step && step.wait) step.anchor = { x: pos.x, y: pos.y };
    }

    function finish() {
      // Final dive: behind a random answer bubble, then gone for good
      ending = true;
      const btn = pickOnScreen(answers);
      const box = () => rectOf(btn);
      const into = centerOf(btn)();
      queue = [go(() => into, rand(220, 380), box), wait(250, box)];
      nextStep();
    }

    function dust() {
      const d = document.createElement("span");
      d.className = "fairy-dust";
      const size = rand(1, 2.6);
      d.style.width = d.style.height = size + "px";
      d.style.left = pos.x + rand(-2, 2) - size / 2 + "px";
      d.style.top = pos.y + rand(-2, 2) - size / 2 + "px";
      d.style.setProperty("--dx", rand(-5, 5) + "px");
      d.style.setProperty("--dy", rand(2, 9) + "px");
      d.style.background = pick(["#fffbe0", "#ffe9a8", "#ffd6f0", "#d8fff0"]);
      d.style.animationDuration = rand(180, 340) + "ms";
      d.addEventListener("animationend", () => d.remove());
      document.body.appendChild(d);
    }

    function frame(now) {
      if (gone) return;
      // Cap the time step so switching tabs doesn't make it teleport
      const dt = last === null ? 0.016 : Math.min((now - last) / 1000, 0.05);
      last = now;
      elapsed += dt * 1000;
      stepTime += dt * 1000;

      if (!ending && elapsed >= LIFETIME) finish();
      if (!step) nextStep();
      if (!step) { stop(); return; }

      // Where it's heading this frame
      let target;
      let speed;
      if (step.wait) {
        // Hovering: drift around the spot it stopped at
        target = {
          x: step.anchor.x + Math.sin(elapsed * 0.006 + seed) * 6,
          y: step.anchor.y + Math.cos(elapsed * 0.008 + seed) * 4,
        };
        speed = 40;
      } else {
        target = typeof step.point === "function" ? step.point() : step.point;
        speed = step.speed;
      }

      const dx = target.x - pos.x;
      const dy = target.y - pos.y;
      const dist = Math.hypot(dx, dy) || 1;
      const sp = speed * S() * Math.min(1, dist / 50 + 0.2); // eases in on arrival
      const steer = Math.min(1, 7 * dt);
      vel.x += ((dx / dist) * sp - vel.x) * steer;
      vel.y += ((dy / dist) * sp - vel.y) * steer;
      // Wobbly, flighty path, plus the odd sudden dart
      vel.x += Math.sin(elapsed * 0.013 + seed) * 260 * S() * dt;
      vel.y += Math.cos(elapsed * 0.017 + seed * 2) * 260 * S() * dt;
      if (Math.random() < 0.02) {
        vel.x += rand(-160, 160) * S();
        vel.y += rand(-160, 160) * S();
      }
      pos.x += vel.x * dt;
      pos.y += vel.y * dt;

      // Step done? (arrived, finished hovering, or took too long)
      const arrived = step.wait ? stepTime >= step.wait : dist < 8 || stepTime > 2600;
      if (arrived) {
        if (ending && !queue.length) { stop(); return; }
        nextStep();
      }

      // Invisible while tucked behind a word or bubble
      const box = step && step.behind ? step.behind() : null;
      const show = !(box && inside(pos, box, 1));
      if (show !== visible) {
        visible = show;
        el.style.opacity = show ? "" : "0";
      }

      // Fairy dust, only while it's out in the open and moving
      dustTravel += Math.hypot(vel.x, vel.y) * dt;
      if (dustTravel > 7) {
        dustTravel = 0;
        if (visible) dust();
      }

      const bob = Math.sin(elapsed * 0.025) * 1.2;
      // Turn to face the way it's flying (only on a clear change, so it doesn't flicker)
      if (vel.x > 25) facing = 1;
      else if (vel.x < -25) facing = -1;
      el.style.transform = `translate(${pos.x - 6}px, ${pos.y - 6 + bob}px) scaleX(${facing})`;
      raf = requestAnimationFrame(frame);
    }

    function stop() {
      if (gone) return;
      gone = true;
      clearTimeout(startTimer);
      cancelAnimationFrame(raf);
      el.remove();
    }

    // Shows up a moment after the page appears (random wait)
    const startTimer = setTimeout(() => {
      document.body.appendChild(el);
      queue = [go(somewhere(), rand(250, 450))];
      raf = requestAnimationFrame(frame);
    }, delay);

    return { stop };
  }
})();
