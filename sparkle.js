/* =========================================================
   Wand sparkle dust.
   As the mouse moves, the star on the wand drops a few tiny
   glowing specks that drift a little and vanish in under
   half a second. Kept sparse on purpose so it isn't distracting.
   ========================================================= */
(function () {
  // People who've asked their phone/computer for less motion still get
  // the sparkle, just a calmer one that twinkles in place.
  const calm = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // Touch screens: no cursor to follow, so instead every tap
  // (anywhere, including answers and the back button) sets off a
  // little firework of sparkle. It's big enough to peek out from under
  // a fingertip, and fades in about half a second.
  // Pointer events cover modern browsers; older in-app browsers
  // (KakaoTalk, Instagram, etc. on older phones) only have touch events.
  if (window.PointerEvent) {
    document.addEventListener(
      "pointerdown",
      function (e) {
        if (e.pointerType === "mouse") return;
        tapBurst(e.clientX, e.clientY);
      },
      { capture: true, passive: true }
    );
  } else {
    document.addEventListener(
      "touchstart",
      function (e) {
        const t = e.changedTouches && e.changedTouches[0];
        if (t) tapBurst(t.clientX, t.clientY);
      },
      { capture: true, passive: true }
    );
  }

  function tapBurst(x, y) {
    const flash = document.createElement("span");
    flash.className = "tap-flash";
    flash.style.left = x + "px";
    flash.style.top = y + "px";
    flash.addEventListener("animationend", function () { flash.remove(); });
    document.body.appendChild(flash);

    const COUNT = 12;
    const offset = Math.random() * Math.PI * 2;
    for (let i = 0; i < COUNT; i++) {
      const angle = offset + (i / COUNT) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
      // Alternate long and short rays so it reads as a firework, reaching
      // well past the edge of a fingertip so it can actually be seen.
      const dist = calm ? 22 + Math.random() * 8 : (i % 2 ? 32 : 50) + Math.random() * 14;
      const dx = Math.cos(angle) * dist;
      const dy = Math.sin(angle) * dist;
      const spark = document.createElement("span");
      spark.className = i % 3 === 0 ? "tap-spark tap-star" : "tap-spark";
      // Calm mode: sparks appear around the tap and fade without flying
      spark.style.left = x + (calm ? dx : 0) + "px";
      spark.style.top = y + (calm ? dy : 0) + "px";
      spark.style.setProperty("--dx", calm ? "0px" : dx + "px");
      spark.style.setProperty("--dy", calm ? "0px" : dy + 6 + "px"); // slight droop, like real fireworks
      const size = i % 3 === 0 ? 10 + Math.random() * 3 : 4 + Math.random() * 2.5;
      spark.style.width = spark.style.height = size + "px";
      spark.style.margin = -size / 2 + "px 0 0 " + -size / 2 + "px";
      spark.style.animationDuration = 480 + Math.random() * 160 + "ms";
      spark.addEventListener("animationend", function () { spark.remove(); });
      document.body.appendChild(spark);
    }
  }

  // The wand dust trail below is mouse-only, and skipped for reduced motion.
  if (calm || window.matchMedia("(hover: none)").matches) return;

  const SPACING = 14; // pixels the mouse must travel before the next speck
  let lastX = null;
  let lastY = null;

  document.addEventListener("mousemove", function (e) {
    if (lastX !== null && Math.hypot(e.clientX - lastX, e.clientY - lastY) < SPACING) return;
    lastX = e.clientX;
    lastY = e.clientY;

    const dust = document.createElement("span");
    dust.className = "wand-dust";
    // Small random offset around the star, then a short drift downward
    dust.style.left = e.clientX + (Math.random() * 6 - 3) + "px";
    dust.style.top = e.clientY + (Math.random() * 6 - 3) + "px";
    dust.style.setProperty("--dx", Math.random() * 8 - 4 + "px");
    dust.style.setProperty("--dy", 4 + Math.random() * 6 + "px");
    const size = 2 + Math.random() * 2.5;
    dust.style.width = dust.style.height = size + "px";
    dust.style.margin = -size / 2 + "px 0 0 " + -size / 2 + "px";

    dust.addEventListener("animationend", function () {
      dust.remove();
    });
    document.body.appendChild(dust);
  });
})();
