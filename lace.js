/* =========================================================
   Scalloped lace trim for the answer buttons.

   Draws an SVG around every .answer-btn that follows its
   rounded corners, in a simple line-art style:
     - a thin line hugging the button (a double outline)
     - a row of small scallops along the edge
     - inside each scallop, a smaller echo arc and a zigzag
       of tiny triangles, like a little fan
   The lace redraws itself whenever a button changes size.
   ========================================================= */
(function () {
  const SVG_NS = "http://www.w3.org/2000/svg";

  // Sizes in pixels, measured outward from the button's edge
  const MARGIN = 14;        // room around the button for the lace
  const HUG = 2.5;          // thin line just outside the button border
  const SCALLOP_BASE = 4.5; // where the scallops start
  const SCALLOP_DEPTH = 5;   // how far each scallop bulges out (lower = rounder, flatter scallops)
  const SCALLOP_WIDTH = 11; // roughly how wide each scallop is
  const STEPS = 12;         // points per scallop (smoothness)

  const THREAD = "#7fa58a"; // lighter shade of the forest-green background

  // A point on a rounded rectangle (the button's outline pushed out by
  // `offset`). t goes 0 -> 1 once around. Returns the point and the
  // outward direction at that point.
  function makeOutline(w, h, r, offset) {
    const R = r + offset;
    const sw = w - 2 * r;
    const sh = h - 2 * r;
    const arc = (Math.PI / 2) * R;
    const total = 2 * sw + 2 * sh + 4 * arc;

    function corner(cx, cy, startAngle, s) {
      const a = startAngle + s / R;
      const nx = Math.cos(a), ny = Math.sin(a);
      return { x: cx + R * nx, y: cy + R * ny, nx, ny };
    }

    function at(t) {
      let s = (((t % 1) + 1) % 1) * total;
      if (s < sw) return { x: r + s, y: -offset, nx: 0, ny: -1 };
      s -= sw;
      if (s < arc) return corner(w - r, r, -Math.PI / 2, s);
      s -= arc;
      if (s < sh) return { x: w + offset, y: r + s, nx: 1, ny: 0 };
      s -= sh;
      if (s < arc) return corner(w - r, h - r, 0, s);
      s -= arc;
      if (s < sw) return { x: w - r - s, y: h + offset, nx: 0, ny: 1 };
      s -= sw;
      if (s < arc) return corner(r, h - r, Math.PI / 2, s);
      s -= arc;
      if (s < sh) return { x: -offset, y: h - r - s, nx: -1, ny: 0 };
      s -= sh;
      return corner(r, r, Math.PI, s);
    }

    return { at, total };
  }

  const f = (n) => n.toFixed(2);

  function drawLace(button) {
    const w = button.offsetWidth;
    const h = button.offsetHeight;
    if (!w || !h) return;

    const radius = Math.min(parseFloat(getComputedStyle(button).borderTopLeftRadius) || 0, w / 2, h / 2);
    const edge = makeOutline(w, h, radius, SCALLOP_BASE);
    const count = Math.max(8, Math.round(edge.total / SCALLOP_WIDTH));

    // Point at parameter t, `off` pixels from the button edge
    // (moved along the outward direction, so every line stays parallel)
    function pt(t, off) {
      const p = edge.at(t);
      const d = off - SCALLOP_BASE;
      return { x: p.x + p.nx * d + MARGIN, y: p.y + p.ny * d + MARGIN };
    }
    const xy = (p) => f(p.x) + "," + f(p.y);

    // Closed path all the way around at a varying offset
    function ring(offsetFn) {
      let d = "";
      for (let i = 0; i < count; i++) {
        for (let k = 0; k < STEPS; k++) {
          const u = k / STEPS;
          d += (d ? "L" : "M") + xy(pt((i + u) / count, offsetFn(u)));
        }
      }
      return d + "Z";
    }

    const bump = (u) => Math.sin(Math.PI * u);
    const outer = ring((u) => SCALLOP_BASE + SCALLOP_DEPTH * bump(u));
    const base = ring(() => SCALLOP_BASE);
    const hug = ring(() => HUG);

    // Inside each scallop: a smaller echo arc, and a zigzag of
    // tiny triangles between the base line and that arc
    const ARC_DEPTH = SCALLOP_DEPTH * 0.6;
    let arcs = "";
    let zigzag = "";
    for (let i = 0; i < count; i++) {
      for (let k = 0; k <= STEPS; k++) {
        const u = k / STEPS;
        arcs += (k ? "L" : "M") + xy(pt((i + u) / count, SCALLOP_BASE + ARC_DEPTH * bump(u)));
      }
      [0, 0.25, 0.5, 0.75, 1].forEach((u, k) => {
        const off = k % 2 ? SCALLOP_BASE + ARC_DEPTH * bump(u) : SCALLOP_BASE;
        zigzag += (k ? "L" : "M") + xy(pt((i + u) / count, off));
      });
    }

    const line = (d, width) =>
      '<path d="' + d + '" fill="none" stroke="' + THREAD + '" stroke-width="' + width +
      '" stroke-linejoin="round" stroke-linecap="round"/>';

    let parts = "";
    parts += '<path d="' + outer + base + '" fill="' + THREAD + '" fill-opacity="0.08" fill-rule="evenodd"/>';
    parts += line(hug, 0.9);     // thin line hugging the button (double outline)
    parts += line(base, 0.8);    // base of the scallops
    parts += line(outer, 1);     // scalloped edge
    parts += line(arcs, 0.6);    // inner echo arcs
    parts += line(zigzag, 0.5);  // tiny triangles

    let svg = button.querySelector(":scope > .lace");
    if (!svg) {
      svg = document.createElementNS(SVG_NS, "svg");
      svg.setAttribute("class", "lace");
      svg.setAttribute("aria-hidden", "true");
      button.appendChild(svg);
    }
    const border = parseFloat(getComputedStyle(button).borderTopWidth) || 0;
    svg.setAttribute("width", w + 2 * MARGIN);
    svg.setAttribute("height", h + 2 * MARGIN);
    svg.style.left = -(MARGIN + border) + "px";
    svg.style.top = -(MARGIN + border) + "px";
    svg.innerHTML = parts;
  }

  function init() {
    const buttons = document.querySelectorAll(".answer-btn");
    // Older in-app browsers have no ResizeObserver: redraw on resize and
    // after each tap (that's when a new quiz page appears) instead.
    if (!window.ResizeObserver) {
      const drawAll = () => buttons.forEach(drawLace);
      drawAll();
      window.addEventListener("resize", drawAll);
      document.addEventListener("click", () => setTimeout(drawAll, 0));
      return;
    }
    const observer = new ResizeObserver((entries) => {
      entries.forEach((entry) => drawLace(entry.target));
    });
    buttons.forEach((button) => observer.observe(button));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
