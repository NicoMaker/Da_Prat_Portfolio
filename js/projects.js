/* ==========================================================
   PROJECTS — filtri categoria + modale dettaglio progetto
   ========================================================== */

const ProjectsModule = (() => {
  function initFilters() {
    const filters = document.querySelectorAll(".filter");
    const cards = document.querySelectorAll(".card");

    filters.forEach((btn) => {
      btn.addEventListener("click", () => {
        filters.forEach((b) => b.classList.remove("is-active"));
        btn.classList.add("is-active");
        const value = btn.getAttribute("data-filter");

        cards.forEach((card) => {
          const match = value === "all" || card.getAttribute("data-cat") === value;
          card.classList.toggle("is-hidden", !match);
        });
      });
    });
  }

  function initModal() {
    const modal = document.getElementById("projectModal");
    const backdrop = document.getElementById("modalBackdrop");
    const closeBtn = document.getElementById("modalClose");
    const cards = document.querySelectorAll(".card");

    function open(card) {
      document.getElementById("modalCat").textContent = card.getAttribute("data-cat-label");
      document.getElementById("modalTitle").textContent = card.getAttribute("data-title");
      document.getElementById("modalYear").textContent = card.getAttribute("data-year");
      document.getElementById("modalDesc").textContent = card.getAttribute("data-desc");
      document.getElementById("modalTools").textContent = card.getAttribute("data-tools");
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    }
    function close() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => open(card));
      card.addEventListener("keypress", (e) => { if (e.key === "Enter") open(card); });
    });
    backdrop.addEventListener("click", close);
    closeBtn.addEventListener("click", close);
    window.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });
  }

  function init() {
    initFilters();
    initModal();
  }

  return { init };
})();
