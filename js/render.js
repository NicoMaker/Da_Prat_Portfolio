/* ============================================
   render.js
   Carica js/data.json e popola tutte le sezioni
   del portfolio. Deve essere caricato DOPO
   animations.js e main.js (usa le funzioni che
   quei file espongono su window.PortfolioAnimations
   e window.PortfolioMain).

   NOTA: fetch() di un file locale richiede che la
   pagina sia servita via http (es. `python -m http.server`,
   Live Server, Netlify, GitHub Pages...). Aprendo
   index.html direttamente come file:// il browser
   blocca la richiesta per policy di sicurezza (CORS).
============================================ */
(function () {
  "use strict";

  function el(html) {
    var t = document.createElement("template");
    t.innerHTML = html.trim();
    return t.content;
  }

  function setText(id, text) {
    var node = document.getElementById(id);
    if (node) node.textContent = text;
  }

  function setHtml(id, html) {
    var node = document.getElementById(id);
    if (node) node.innerHTML = html;
  }

  /* ---------- HERO ---------- */
  function renderHero(data) {
    var hero = data.hero;
    setText("heroBadge", hero.badge);
    setText("stampText", hero.stamp);
    setText("stampCenter", hero.stampCenter);
    setHtml("heroDesc", hero.description);

    var titleHtml = hero.titleLines.map(function (line, i) {
      var isLast = i === hero.titleLines.length - 1;
      return (
        '<span class="reveal-line"><span class="reveal-inner">' +
        line +
        (isLast ? '<span class="hero__accent">.</span>' : "") +
        "</span></span>"
      );
    }).join("");
    setHtml("heroTitle", titleHtml);

    var actionsHtml =
      '<a href="' + hero.primaryCta.href + '" class="btn btn--primary" data-cursor-link>' +
        hero.primaryCta.label +
        '<svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
      "</a>" +
      '<a href="' + hero.secondaryCta.href + '" class="btn btn--ghost" data-cursor-link>' +
        hero.secondaryCta.label +
      "</a>";
    setHtml("heroActions", actionsHtml);
  }

  /* ---------- MARQUEE (contenuto duplicato per lo scroll infinito) ---------- */
  function renderMarquee(data) {
    var words = data.marquee;
    var single = words.map(function (w) { return "<span>" + w + "</span><span>—</span>"; }).join("");
    setHtml("marqueeTrack", single + single);
  }

  /* ---------- ABOUT ---------- */
  function renderAbout(data) {
    setText("aboutEyebrow", data.about.eyebrow);
    var paragraphs = data.about.paragraphs.map(function (p) { return "<p>" + p + "</p>"; }).join("");
    var link =
      '<a href="#progetti" class="text-link" data-cursor-link>' +
        data.about.linkLabel + " <span>→</span>" +
      "</a>";
    setHtml("aboutText", paragraphs + link);

    var statsHtml = data.stats.map(function (s) {
      return (
        '<div class="stat reveal-up">' +
          '<span class="stat__num" data-count="' + s.count + '">0</span>' +
          '<span class="stat__plus">+</span>' +
          '<span class="stat__label">' + s.label + "</span>" +
        "</div>"
      );
    }).join("");
    setHtml("aboutStats", statsHtml);
  }

  /* ---------- PROGETTI (filtri + card) ---------- */
  function renderProjects(data) {
    var filtersHtml = data.filters.map(function (f, i) {
      return (
        '<button class="filter' + (i === 0 ? " is-active" : "") + '" data-filter="' +
        f.key + '" data-cursor-link>' + f.label + "</button>"
      );
    }).join("");
    setHtml("filters", filtersHtml);

    var cardsHtml = data.projects.map(function (p) {
      return (
        '<article class="card reveal-up" data-cat="' + p.category + '" data-cursor-link' +
          ' data-title="' + p.title + '"' +
          ' data-year="' + p.year + '"' +
          ' data-cat-label="' + p.categoryLabel + '"' +
          ' data-desc="' + p.desc.replace(/"/g, "&quot;") + '"' +
          ' data-tools="' + p.tools + '">' +
          '<div class="card__media ' + p.mediaClass + '">' +
            '<span class="card__letter">' + p.letter + "</span>" +
          "</div>" +
          '<div class="card__body">' +
            '<span class="card__cat">' + capitalize(p.category) + "</span>" +
            '<h3 class="card__title">' + p.title + "</h3>" +
            '<span class="card__year">' + p.year + "</span>" +
          "</div>" +
        "</article>"
      );
    }).join("");
    setHtml("projectGrid", cardsHtml);
  }

  function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  /* ---------- SERVIZI ---------- */
  function renderServices(data) {
    var html = data.services.map(function (s) {
      var tags = s.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
      return (
        '<div class="service reveal-up">' +
          '<h3 class="service__title">' + s.title + "</h3>" +
          '<p class="service__desc">' + s.desc + "</p>" +
          '<div class="service__tags">' + tags + "</div>" +
        "</div>"
      );
    }).join("");
    setHtml("servicesList", html);
  }

  /* ---------- COMPETENZE ---------- */
  function renderSkills(data) {
    var tools = data.skills.tools.map(function (t) {
      return (
        '<div class="skillbar">' +
          '<div class="skillbar__head"><span>' + t.name + "</span><span>" + t.percent + "%</span></div>" +
          '<div class="skillbar__track"><span style="--w:' + t.percent + '%"></span></div>' +
        "</div>"
      );
    }).join("");
    setHtml("skillBars", tools);

    var tags = data.skills.tags.map(function (t) { return "<span>" + t + "</span>"; }).join("");
    setHtml("skillTags", tags);

    var langs = data.skills.languages.map(function (l) {
      return '<div class="lang"><span>' + l.name + '</span><span class="lang__level">' + l.level + "</span></div>";
    }).join("");
    setHtml("skillLangs", langs);
  }

  /* ---------- TIMELINE: ESPERIENZE, ISTRUZIONE, ATTESTATI ---------- */
  function renderTimelines(data) {
    var exp = data.experience.map(function (e) {
      return (
        '<div class="timeline__item reveal-up">' +
          '<span class="timeline__year">' + e.year + "</span>" +
          '<h3 class="timeline__role">' + e.role + "</h3>" +
          '<span class="timeline__org">' + e.org + "</span>" +
          '<p class="timeline__desc">' + e.desc + "</p>" +
        "</div>"
      );
    }).join("");
    setHtml("experienceTimeline", exp);

    var edu = data.education.map(function (e) {
      return (
        '<div class="timeline__item reveal-up">' +
          '<span class="timeline__year">' + e.year + "</span>" +
          '<h3 class="timeline__role">' + e.role + "</h3>" +
          '<span class="timeline__org">' + e.org + "</span>" +
        "</div>"
      );
    }).join("");
    setHtml("educationTimeline", edu);

    var certs = data.certs.map(function (c) {
      return (
        '<div class="cert reveal-up">' +
          '<span class="cert__badge">✓</span>' +
          "<div>" +
            "<h4>" + c.title + "</h4>" +
            "<span>" + c.meta + "</span>" +
          "</div>" +
        "</div>"
      );
    }).join("");
    setHtml("certsList", certs);
  }

  /* ---------- CONTATTI ---------- */
  function renderContact(data) {
    var c = data.contact;
    setText("contactIntro", c.intro);

    var info =
      '<a href="mailto:' + c.email + '" class="contact__info-item" data-cursor-link>' +
        "<span>Email</span><strong>" + c.email + "</strong>" +
      "</a>" +
      '<div class="contact__info-item"><span>Sede</span><strong>' + c.location + "</strong></div>";
    setHtml("contactInfo", info);

    var socials = c.socials.map(function (s) {
      return '<a href="' + s.url + '" aria-label="' + s.label + '" data-cursor-link>' + s.label + "</a>";
    }).join("");
    setHtml("contactSocials", socials);
  }

  /* ---------- FOOTER ---------- */
  function renderFooter(data) {
    setHtml("footerTitle", data.footer.titleHtml + '<span class="hero__accent">.</span>');
    var cta = document.getElementById("footerCta");
    if (cta) {
      cta.textContent = data.footer.cta.label;
      cta.setAttribute("href", data.footer.cta.href);
    }
    setText("footerCopy", "© " + data.site.year + " " + data.site.name);
  }

  /* ---------- ORCHESTRAZIONE ---------- */
  function renderAll(data) {
    renderHero(data);
    renderMarquee(data);
    renderAbout(data);
    renderProjects(data);
    renderServices(data);
    renderSkills(data);
    renderTimelines(data);
    renderContact(data);
    renderFooter(data);
  }

  function initPostRender() {
    // riattiva le funzionalità che dipendono dagli elementi appena creati
    if (window.PortfolioMain) {
      window.PortfolioMain.initActiveLink();
      window.PortfolioMain.initSmoothAnchors();
      window.PortfolioMain.initFilters();
      window.PortfolioMain.initModal();
    }
    if (window.PortfolioAnimations) {
      window.PortfolioAnimations.initReveal();
      window.PortfolioAnimations.initCounters();
    }
    // segna l'hero come "caricato" per far partire l'animazione del titolo,
    // solo dopo che il testo è stato effettivamente inserito nel DOM
    var hero = document.querySelector(".hero");
    requestAnimationFrame(function () {
      if (hero) hero.classList.add("is-loaded");
    });
  }

  function showLoadError() {
    var main = document.querySelector("main");
    if (!main) return;
    var notice = document.createElement("p");
    notice.style.cssText = "max-width:640px;margin:6rem auto;padding:0 1.5rem;font-family:sans-serif;color:#b33;text-align:center;";
    notice.textContent =
      "Non è stato possibile caricare js/data.json. Se hai aperto il file direttamente " +
      "(file://), avvia un piccolo server locale — ad es. `python -m http.server` nella " +
      "cartella del progetto — oppure carica i file su Netlify/GitHub Pages.";
    main.prepend(notice);
  }

  document.addEventListener("DOMContentLoaded", function () {
    fetch("js/data.json")
      .then(function (res) {
        if (!res.ok) throw new Error("HTTP " + res.status);
        return res.json();
      })
      .then(function (data) {
        renderAll(data);
        initPostRender();
      })
      .catch(function (err) {
        console.error("Errore nel caricamento di data.json:", err);
        showLoadError();
      });
  });
})();
