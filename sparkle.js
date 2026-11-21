/* =========================================================
   Wand sparkle dust.
   As the mouse moves, the star on the wand drops a few tiny
   glowing specks that drift a little and vanish in under
   half a second. Kept sparse on purpose so it isn't distracting.
   ========================================================= */
(function () {
  // Skip for people who've asked their system for less motion.
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  // Touch screens: no cursor to follow, so instead every tap
  // (anywhere, including answers and the back button) sets off a
  // tiny firework of sparkle that's gone in about a quarter second.
  document.addEventListener(
    "pointerdown",
    function (e) {
      if (e.pointerType === "mouse") return;
      tapBurst(e.clientX, e.clientY);
    },
    { capture: true, passive: true }
  );

  function tapBurst(x, y) {
    const flash = document.createElement("span");
    flash.className = "tap-flash";
    flash.style.left = x + "px";
    flash.style.top = y + "px";
    flash.addEventListener("animationend", function () { flash.remove(); });
    document.body.appendChild(flash);

    const COUNT = 8;
    const offset = Math.random() * Math.PI * 2;
    for (let i = 0; i < COUNT; i++) {
      const angle = offset + (i / COUNT) * Math.PI * 2;
      const dist = 16 + Math.random() * 10;
      const spark = document.createElement("span");
      spark.className = "tap-spark";
      spark.style.left = x + "px";
      spark.style.top = y + "px";
      spark.style.setProperty("--dx", Math.cos(angle) * dist + "px");
      spark.style.setProperty("--dy", Math.sin(angle) * dist + "px");
      const size = 2.5 + Math.random() * 2;
      spark.style.width = spark.style.height = size + "px";
      spark.style.margin = -size / 2 + "px 0 0 " + -size / 2 + "px";
      spark.addEventListener("animationend", function () { spark.remove(); });
      document.body.appendChild(spark);
    }
  }

  // The wand dust trail below is mouse-only.
  if (window.matchMedia("(hover: none)").matches) return;

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
