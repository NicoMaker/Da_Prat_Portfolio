/* ==========================================================
   CURSOR — anello che segue il mouse (nessun puntino centrale)
   ========================================================== */

const CursorModule = (() => {
  function init() {
    if (!window.matchMedia("(hover: hover)").matches) return;

    const ring = document.getElementById("cursorRing");
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    function loop() {
      ringX += (mouseX - ringX) * 0.2;
      ringY += (mouseY - ringY) * 0.2;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      requestAnimationFrame(loop);
    }
    loop();

    document.addEventListener("mouseover", (e) => {
      if (e.target.closest("[data-cursor-link]")) ring.classList.add("is-hover");
    });
    document.addEventListener("mouseout", (e) => {
      if (e.target.closest("[data-cursor-link]")) ring.classList.remove("is-hover");
    });
  }

  return { init };
})();
