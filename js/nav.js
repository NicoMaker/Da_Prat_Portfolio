/* ==========================================================
   NAV — header, hamburger menu mobile, link attivo
   ========================================================== */

const NavModule = (() => {
  function renderLinks(navData) {
    const desktop = document.getElementById("navLinks");
    const mobile = document.getElementById("mobileMenuLinks");
    const mobileFoot = document.getElementById("mobileMenuFoot");

    desktop.innerHTML = navData.nav
      .map((item) => `<a href="${item.href}" class="nav__link" data-cursor-link data-href="${item.href}">${item.label}</a>`)
      .join("");

    mobile.innerHTML = navData.nav
      .map((item) => `<a href="${item.href}" class="mobile-menu__link" data-href="${item.href}">${item.label}</a>`)
      .join("");

    mobileFoot.innerHTML = `<span>${navData.hero.badge}</span>`;
  }

  function initHamburger() {
    const burger = document.getElementById("navBurger");
    const menu = document.getElementById("mobileMenu");
    const backdrop = document.getElementById("mobileMenuBackdrop");

    function close() {
      burger.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      backdrop.classList.remove("is-open");
      document.body.style.overflow = "";
    }
    function open() {
      burger.setAttribute("aria-expanded", "true");
      menu.classList.add("is-open");
      backdrop.classList.add("is-open");
      document.body.style.overflow = "hidden";
    }

    burger.addEventListener("click", () => {
      const isOpen = burger.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });
    backdrop.addEventListener("click", close);
    menu.addEventListener("click", (e) => {
      if (e.target.tagName === "A") close();
    });
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });
  }

  function initScrollHeader() {
    const nav = document.getElementById("nav");
    const onScroll = () => {
      nav.classList.toggle("is-scrolled", window.scrollY > 20);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  function initActiveLink() {
    const links = document.querySelectorAll(".nav__link");
    const sections = Array.from(links)
      .map((l) => document.querySelector(l.getAttribute("data-href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = `#${entry.target.id}`;
            links.forEach((l) => l.classList.toggle("is-active", l.getAttribute("data-href") === id));
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
  }

  function init(navData) {
    renderLinks(navData);
    initHamburger();
    initScrollHeader();
    initActiveLink();
  }

  return { init };
})();
