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

    mobileFoot.innerHTML = `<span>${navData.footer.copyright}</span>`;
  }

  function initHamburger() {
    const burger = document.getElementById("navBurger");
    const menu = document.getElementById("mobileMenu");
    const backdrop = document.getElementById("mobileMenuBackdrop");
    const closeBtn = document.getElementById("mobileMenuClose");

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
    closeBtn.addEventListener("click", close);
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
    const sectionLabel = document.getElementById("navSection");
    const root = document.documentElement;
    const baseTitle = navData.meta.title;

    // Elenco delle sezioni (nell'ordine dei link di navigazione), con l'elemento reale in pagina
    const sections = navData.nav
      .map((item) => ({ id: item.href, color: item.color, label: item.label, el: document.querySelector(item.href) }))
      .filter((s) => s.el);

    if (!sections.length) return;

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
        // Mostra automaticamente, nell'header, in quale sezione ci si trova
        if (sectionLabel) sectionLabel.textContent = match.label;
      }
    }

    // Scroll-spy basato sulla posizione di scroll: ad ogni scroll (o resize) calcola
    // qual è l'ultima sezione il cui inizio ha già superato la linea di riferimento
    // (appena sotto l'header fisso). Funziona sia scrollando manualmente tra le
    // sezioni, sia saltando con un click su un link o con un #hash nell'URL —
    // in automatico, senza bisogno di eventi separati per i due casi.
    const HEADER_OFFSET = 140;
    let ticking = false;

    // Posizione reale della sezione rispetto al documento. Non si può usare
    // el.offsetTop: se un antenato ha position:relative/absolute (come le
    // <section>), offsetTop diventa relativo a quell'antenato e non alla pagina
    // — es. #percorso, annidato dentro <section id="competenze"> che è
    // position:relative, altrimenti risulterebbe un valore piccolo e sbagliato.
    function docTop(el) {
      return el.getBoundingClientRect().top + window.scrollY;
    }

    function computeActive() {
      ticking = false;
      const scrollPos = window.scrollY + HEADER_OFFSET;
      const nearBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;

      // Importante: i link in navData.nav NON sono necessariamente nello stesso
      // ordine in cui le sezioni compaiono nella pagina (es. "Chi sono" è nel menu
      // prima di "Progetti" e "Servizi", ma nella pagina viene subito dopo "Home").
      // Va quindi scelta la sezione con la posizione più bassa tra quelle già
      // superate dallo scroll — non semplicemente l'ultima trovata nell'array del menu.
      let current;
      if (nearBottom) {
        // In fondo alla pagina: la sezione più in basso è sempre quella attiva,
        // anche se la sua "linea" non è ancora stata superata.
        current = sections.reduce((best, s) => (docTop(s.el) > docTop(best.el) ? s : best));
      } else {
        current = sections.reduce((best, s) => {
          const top = docTop(s.el);
          if (top > scrollPos) return best;
          if (!best || top > docTop(best.el)) return s;
          return best;
        }, null) || sections[0];
      }
      setActive(current.id);
    }

    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(computeActive);
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // Click su un link o cambio di #hash (avanti/indietro del browser): aggiorna
    // subito lo stato attivo, senza aspettare il prossimo evento di scroll.
    window.addEventListener("hashchange", computeActive);

    // Stato iniziale: tiene conto anche di un #hash già presente nell'URL al caricamento
    computeActive();
  }

  function init(navData) {
    renderLinks(navData);
    initHamburger();
    initScrollHeader();
    initActiveLink(navData);
  }

  return { init };
})();
