/* ==========================================================
   CURSOR — cursore personalizzato (solo desktop / hover-capable)
   ========================================================== */

const CursorModule = (() => {
  function init() {
    if (!window.matchMedia("(hover: hover)").matches) return;

    const cursor = document.getElementById("cursor");
    const ring = document.getElementById("cursorRing");
    let ringX = 0, ringY = 0, mouseX = 0, mouseY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX; mouseY = e.clientY;
      cursor.style.left = `${mouseX}px`;
      cursor.style.top = `${mouseY}px`;
    });

    function loop() {
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;
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
