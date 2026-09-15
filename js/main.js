/* ============================================
   main.js
   - Nav sticky + link attivo su scroll
   - Menu mobile
   - Filtri progetti
   - Modal dettaglio progetto
   - Validazione form contatti
============================================ */
(function () {
  "use strict";

  /* ---------- NAV SCROLLED STATE ---------- */
  function initNavScroll() {
    var nav = document.getElementById("nav");
    if (!nav) return;
    function onScroll() {
      if (window.scrollY > 40) nav.classList.add("is-scrolled");
      else nav.classList.remove("is-scrolled");
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- ACTIVE LINK ON SCROLL ---------- */
  function initActiveLink() {
    var sections = document.querySelectorAll("main section[id]");
    var links = document.querySelectorAll(".nav__link");
    if (!sections.length || !links.length || !("IntersectionObserver" in window)) return;

    var map = {};
    links.forEach(function (l) {
      map[l.getAttribute("href").replace("#", "")] = l;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.id;
        if (entry.isIntersecting && map[id]) {
          links.forEach(function (l) { l.classList.remove("is-current"); });
          map[id].classList.add("is-current");
        }
      });
    }, { threshold: 0.4, rootMargin: "-20% 0px -60% 0px" });

    sections.forEach(function (s) { observer.observe(s); });
  }

  /* ---------- MOBILE MENU ---------- */
  function initMobileMenu() {
    var burger = document.getElementById("navBurger");
    var menu = document.getElementById("mobileMenu");
    if (!burger || !menu) return;

    function close() {
      menu.classList.remove("is-open");
      burger.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
    function open() {
      menu.classList.add("is-open");
      burger.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
    }

    burger.addEventListener("click", function () {
      var isOpen = menu.classList.contains("is-open");
      if (isOpen) close(); else open();
    });

    menu.querySelectorAll(".mobile-menu__link").forEach(function (link) {
      link.addEventListener("click", close);
    });

    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape") close();
    });
  }

  /* ---------- SMOOTH SCROLL WITH HEADER OFFSET ---------- */
  function initSmoothAnchors() {
    var links = document.querySelectorAll('a[href^="#"]');
    var navHeight = 90;

    links.forEach(function (link) {
      link.addEventListener("click", function (e) {
        var targetId = link.getAttribute("href");
        if (targetId.length < 2) return;
        var target = document.querySelector(targetId);
        if (!target) return;
        e.preventDefault();
        var top = target.getBoundingClientRect().top + window.pageYOffset - navHeight;
        window.scrollTo({ top: top, behavior: "smooth" });
      });
    });
  }

  /* ---------- PROJECT FILTERS ---------- */
  function initFilters() {
    var filters = document.querySelectorAll(".filter");
    var cards = document.querySelectorAll(".card");
    if (!filters.length || !cards.length) return;

    filters.forEach(function (btn) {
      btn.addEventListener("click", function () {
        filters.forEach(function (f) { f.classList.remove("is-active"); });
        btn.classList.add("is-active");
        var filter = btn.getAttribute("data-filter");

        cards.forEach(function (card) {
          var match = filter === "all" || card.getAttribute("data-cat") === filter;
          card.classList.add("is-filtering");
          setTimeout(function () {
            card.hidden = !match;
            requestAnimationFrame(function () {
              card.classList.remove("is-filtering");
            });
          }, match ? 0 : 180);
        });
      });
    });
  }

  /* ---------- PROJECT MODAL ---------- */
  function initModal() {
    var modal = document.getElementById("projectModal");
    var overlay = document.getElementById("modalOverlay");
    var closeBtn = document.getElementById("modalClose");
    var cards = document.querySelectorAll(".card[data-title]");
    if (!modal || !cards.length) return;

    var titleEl = document.getElementById("modalTitle");
    var catEl = document.getElementById("modalCat");
    var descEl = document.getElementById("modalDesc");
    var yearEl = document.getElementById("modalYear");
    var toolsEl = document.getElementById("modalTools");
    var mediaEl = document.getElementById("modalMedia");
    var letterEl = document.getElementById("modalLetter");

    var lastFocused = null;

    function openModal(card) {
      lastFocused = document.activeElement;
      titleEl.textContent = card.getAttribute("data-title");
      catEl.textContent = card.getAttribute("data-cat-label");
      descEl.textContent = card.getAttribute("data-desc");
      yearEl.textContent = card.getAttribute("data-year");
      toolsEl.textContent = card.getAttribute("data-tools");
      letterEl.textContent = card.querySelector(".card__letter").textContent;

      // copy the gradient class from the card media for visual continuity
      mediaEl.className = "modal__media";
      var mediaClasses = card.querySelector(".card__media").className.split(" ");
      mediaClasses.forEach(function (c) {
        if (c.indexOf("card__media--") === 0) mediaEl.classList.add(c.replace("card__media", "modal__media"));
      });

      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      closeBtn.focus();
    }

    function closeModal() {
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
      if (lastFocused) lastFocused.focus();
    }

    cards.forEach(function (card) {
      card.addEventListener("click", function () { openModal(card); });
      card.setAttribute("tabindex", "0");
      card.setAttribute("role", "button");
      card.addEventListener("keydown", function (e) {
        if (e.key === "Enter" || e.key === " ") { e.preventDefault(); openModal(card); }
      });
    });

    overlay.addEventListener("click", closeModal);
    closeBtn.addEventListener("click", closeModal);
    window.addEventListener("keydown", function (e) {
      if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
    });
  }

  /* ---------- CONTACT FORM VALIDATION ---------- */
  function initForm() {
    var form = document.getElementById("contactForm");
    var success = document.getElementById("formSuccess");
    if (!form) return;

    function validEmail(value) {
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
    }

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      // honeypot anti-spam: se compilato, ignora silenziosamente
      var honeypot = form.querySelector('[name="website"]');
      if (honeypot && honeypot.value) return;

      var required = form.querySelectorAll("[required]");
      var valid = true;

      required.forEach(function (field) {
        var wrapper = field.closest(".form-field");
        var isEmpty = !field.value.trim();
        var isBadEmail = field.type === "email" && field.value.trim() && !validEmail(field.value.trim());

        if (isEmpty || isBadEmail) {
          valid = false;
          if (wrapper) wrapper.classList.add("has-error");
        } else if (wrapper) {
          wrapper.classList.remove("has-error");
        }
      });

      if (!valid) {
        success.classList.remove("is-shown");
        var firstError = form.querySelector(".has-error input, .has-error textarea");
        if (firstError) firstError.focus();
        return;
      }

      // In produzione: invio via fetch() a un endpoint o servizio email.
      success.classList.add("is-shown");
      form.reset();
      setTimeout(function () { success.classList.remove("is-shown"); }, 5000);
    });

    // rimuove l'errore mentre l'utente digita
    form.querySelectorAll("input, textarea").forEach(function (field) {
      field.addEventListener("input", function () {
        var wrapper = field.closest(".form-field");
        if (wrapper) wrapper.classList.remove("has-error");
      });
    });
  }

  /* ---------- BACK TO TOP ---------- */
  function initToTop() {
    var btn = document.getElementById("toTop");
    if (!btn) return;
    btn.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initNavScroll();
    initActiveLink();
    initMobileMenu();
    initSmoothAnchors();
    initFilters();
    initModal();
    initForm();
    initToTop();
  });
})();
