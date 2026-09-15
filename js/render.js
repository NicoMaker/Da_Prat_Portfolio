/* ==========================================================
   RENDER — popola le sezioni della pagina a partire dai JSON
   ========================================================== */

const RenderModule = (() => {

  function renderMeta(site) {
    document.title = site.meta.title;
    document.querySelector('meta[name="description"]').setAttribute("content", site.meta.description);
    document.querySelector('meta[name="theme-color"]').setAttribute("content", site.meta.themeColor);
    document.getElementById("navLogo").innerHTML = `${site.brand.mark}<span class="dot">.</span>`;
    document.getElementById("footerLogo").innerHTML = `${site.brand.mark}<span class="dot">.</span>`;
    document.getElementById("preloaderLabel").textContent = `${site.brand.mark}.`;
    document.getElementById("stampCenter").textContent = site.brand.mark;
    document.getElementById("stampText").textContent = site.hero.stampText;
  }

  function renderHero(site) {
    document.getElementById("heroBadge").innerHTML =
      `<span class="badge__dot"></span>${site.hero.badge}`;

    document.getElementById("heroTitle").innerHTML = site.hero.titleLines
      .map((line) => `<span class="reveal-line"><span class="reveal-inner">${line}</span></span>`)
      .join("");

    document.getElementById("heroDesc").innerHTML = site.hero.description;

    document.getElementById("heroActions").innerHTML = `
      <a href="${site.hero.ctaPrimary.href}" class="btn btn--primary" data-cursor-link>
        ${site.hero.ctaPrimary.label}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"><path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </a>
      <a href="${site.hero.ctaSecondary.href}" class="btn btn--ghost" data-cursor-link>${site.hero.ctaSecondary.label}</a>
    `;

    document.getElementById("heroScrollLabel").textContent = site.hero.scrollLabel;
  }

  function renderMarquee(site) {
    const items = site.marquee.concat(site.marquee); // duplica per loop continuo
    document.getElementById("marqueeTrack").innerHTML = items
      .map((label) => `<span>${label}</span><span>—</span>`)
      .join("");
  }

  function renderAbout(site, stats) {
    document.getElementById("aboutEyebrow").textContent = site.about.eyebrow;

    document.getElementById("aboutText").innerHTML = site.about.paragraphs
      .map((p) => `<p>${p}</p>`)
      .join("") +
      `<a href="${site.about.linkHref}" class="text-link" data-cursor-link>${site.about.linkLabel} <span>→</span></a>`;

    /* Le card statistiche sono volutamente statiche: nessuna animazione hover */
    document.getElementById("aboutStats").innerHTML = stats
      .map(
        (s) => `
        <div class="stat">
          <span class="stat__num" data-count="${s.count}">0</span><span class="stat__plus">${s.suffix}</span>
          <span class="stat__label">${s.label}</span>
        </div>`
      )
      .join("");
  }

  function renderFilters(filters) {
    document.getElementById("filters").innerHTML = filters
      .map(
        (f, i) =>
          `<button class="filter${i === 0 ? " is-active" : ""}" data-filter="${f.value}" data-cursor-link>${f.label}</button>`
      )
      .join("");
  }

  function renderProjects(projects) {
    document.getElementById("projectGrid").innerHTML = projects
      .map(
        (p, i) => `
        <article class="card reveal-up" data-cat="${p.category}" data-cursor-link tabindex="0"
          data-id="${p.id}" data-title="${p.title}" data-year="${p.year}"
          data-cat-label="${p.catLabel}" data-desc="${p.desc}" data-tools="${p.tools}">
          <div class="card__media card__media--${(i % 6) + 1}">
            <span class="card__letter">${p.letter}</span>
          </div>
          <div class="card__body">
            <span class="card__cat">${p.catLabel.split(" · ")[0]}</span>
            <h3 class="card__title">${p.title}</h3>
            <span class="card__year">${p.year}</span>
          </div>
        </article>`
      )
      .join("");
  }

  function renderServices(services) {
    document.getElementById("servicesList").innerHTML = services
      .map(
        (s) => `
        <div class="service reveal-up">
          <h3 class="service__title">${s.title}</h3>
          <p class="service__desc">${s.desc}</p>
          <div class="service__tags">${s.tags.map((t) => `<span>${t}</span>`).join("")}</div>
        </div>`
      )
      .join("");
  }

  function renderSkills(skills) {
    document.getElementById("skillbars").innerHTML = skills
      .map(
        (s) => `
        <div class="skillbar">
          <div class="skillbar__head"><span>${s.name}</span><span>${s.level}%</span></div>
          <div class="skillbar__track"><span style="--w:${s.level}%" data-level="${s.level}"></span></div>
        </div>`
      )
      .join("");
  }

  function renderTimeline(timeline) {
    document.getElementById("timeline").innerHTML = timeline
      .map(
        (t) => `
        <div class="timeline__item reveal-up">
          <span class="timeline__year">${t.year}</span>
          <h3 class="timeline__title">${t.title}</h3>
          <p class="timeline__desc">${t.desc}</p>
        </div>`
      )
      .join("");
  }

  function renderContact(site, contact) {
    document.getElementById("contactIntro").textContent =
      `${site.footer.ctaSub} Oppure compila il modulo qui accanto.`;

    document.getElementById("contactInfo").innerHTML = `
      <a href="mailto:${contact.email}">${contact.email}</a>
      <a href="tel:${contact.phone.replace(/\s/g, "")}">${contact.phone}</a>
      <span>${contact.location}</span>
    `;
  }

  function renderFooter(site, contact) {
    document.getElementById("footerCta").textContent = site.footer.cta;
    document.getElementById("footerCtaSub").textContent = site.footer.ctaSub;
    document.getElementById("footerCopy").textContent = site.footer.copyright;

    document.getElementById("footerLinks").innerHTML = site.nav
      .map((item) => `<a href="${item.href}">${item.label}</a>`)
      .join("");

    /* Email e cellulare richiesti in footer */
    document.getElementById("footerContact").innerHTML = `
      <div class="footer__contact-item">
        <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M3 6h18v12H3z"/><path d="m3 7 9 6 9-6"/></svg>
        <a href="mailto:${contact.email}">${contact.email}</a>
      </div>
      <div class="footer__contact-item">
        <svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M4 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L14 13l5 2v4a2 2 0 0 1-2 2C9.4 21 3 14.6 3 6a2 2 0 0 1 2-2z"/></svg>
        <a href="tel:${contact.phone.replace(/\s/g, "")}">${contact.phone}</a>
      </div>
    `;

    document.getElementById("footerSocial").innerHTML = contact.social
      .map((s) => `<a href="${s.href}" target="_blank" rel="noopener">${s.label}</a>`)
      .join("");
  }

  function renderAll(data) {
    renderMeta(data.site);
    renderHero(data.site);
    renderMarquee(data.site);
    renderAbout(data.site, data.stats);
    renderFilters(data.filters);
    renderProjects(data.projects);
    renderServices(data.services);
    renderSkills(data.skills);
    renderTimeline(data.timeline);
    renderContact(data.site, data.contact);
    renderFooter(data.site, data.contact);
  }

  return { renderAll };
})();
