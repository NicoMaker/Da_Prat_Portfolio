/* ==========================================================
   NAV — header, hamburger menu mobile, link attivo
   ========================================================== */

const NavModule = (() => {
  function renderLinks(navData) {
    const desktop = document.getElementById("navLinks");
    const mobile = document.getElementById("mobileMenuLinks");
    const mobileFoot = document.getElementById("mobileMenuFoot");

    desktop.innerHTML = navData.nav
      .map((item) => `<a href="${item.href}" class="nav__link" data-cursor-link data-href="${item.href}" data-color="${item.color}">${item.label}</a>`)
      .join("");

    mobile.innerHTML = navData.nav
      .map((item) => `<a href="${item.href}" class="mobile-menu__link" data-href="${item.href}" data-color="${item.color}">${item.label}</a>`)
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

  function initActiveLink(navData) {
    const desktopLinks = document.querySelectorAll(".nav__link");
    const mobileLinks = document.querySelectorAll(".mobile-menu__link");
    const colorBar = document.getElementById("navColorBar");
    const mobileColorBar = document.getElementById("mobileMenuColorBar");
    const root = document.documentElement;
    const baseTitle = navData.meta.title;

    const sections = Array.from(desktopLinks)
      .map((l) => document.querySelector(l.getAttribute("data-href")))
      .filter(Boolean);

    function setActive(id) {
      // Colora sia la nav desktop che il menu mobile in base alla sezione visibile
      [desktopLinks, mobileLinks].forEach((group) => {
        group.forEach((l) => {
          const isActive = l.getAttribute("data-href") === id;
          l.classList.toggle("is-active", isActive);
          l.style.setProperty("--link-color", isActive ? l.getAttribute("data-color") : "");
        });
      });

      const match = navData.nav.find((n) => n.href === id);
      if (match) {
        root.style.setProperty("--section-color", match.color);
        if (colorBar) colorBar.style.background = match.color;
        if (mobileColorBar) mobileColorBar.style.background = match.color;
        // Aggiorna il titolo della pagina/scheda del browser con la sezione corrente
        document.title = `${match.label} · ${baseTitle}`;
      }
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(`#${entry.target.id}`);
          }
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));

    // Stato iniziale: Home
    setActive("#home");
  }

  function init(navData) {
    renderLinks(navData);
    initHamburger();
    initScrollHeader();
    initActiveLink(navData);
  }

  return { init };
})();
