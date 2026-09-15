/* ============================================
   animations.js
   - Preloader con barra di caricamento
   - Cursore custom (desktop)
   - Reveal-on-scroll (IntersectionObserver)
   - Reveal titolo hero
   - Contatori numerici animati
============================================ */
(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- PRELOADER ---------- */
  function initPreloader() {
    var preloader = document.getElementById("preloader");
    var fill = document.getElementById("preloaderFill");
    var pct = document.getElementById("preloaderPct");
    var hero = document.querySelector(".hero");
    if (!preloader) return;

    var progress = 0;
    var target = 0;
    var interval = setInterval(function () {
      target = Math.min(100, target + Math.random() * 18 + 6);
    }, 180);

    function tick() {
      progress += (target - progress) * 0.18;
      var shown = Math.min(100, Math.round(progress));
      if (fill) fill.style.width = shown + "%";
      if (pct) pct.textContent = shown + "%";

      if (shown >= 99 && target >= 99) {
        clearInterval(interval);
        if (fill) fill.style.width = "100%";
        if (pct) pct.textContent = "100%";
        setTimeout(function () {
          preloader.classList.add("is-hidden");
          if (hero) hero.classList.add("is-loaded");
          document.body.style.overflow = "";
        }, 260);
        return;
      }
      requestAnimationFrame(tick);
    }

    document.body.style.overflow = "hidden";

    window.addEventListener("load", function () {
      target = 100;
    });

    // Safety: never trap the user for more than 2.6s
    setTimeout(function () { target = 100; }, 1800);

    requestAnimationFrame(tick);

    if (reduceMotion) {
      clearInterval(interval);
      preloader.classList.add("is-hidden");
      if (hero) hero.classList.add("is-loaded");
      document.body.style.overflow = "";
    }
  }

  /* ---------- CUSTOM CURSOR ---------- */
  function initCursor() {
    if (window.matchMedia("(hover: none), (pointer: coarse)").matches) return;
    var dot = document.getElementById("cursor");
    var ring = document.getElementById("cursorRing");
    if (!dot || !ring) return;

    var mx = window.innerWidth / 2, my = window.innerHeight / 2;
    var rx = mx, ry = my;

    window.addEventListener("mousemove", function (e) {
      mx = e.clientX; my = e.clientY;
      dot.style.left = mx + "px";
      dot.style.top = my + "px";
    });

    function loop() {
      rx += (mx - rx) * 0.16;
      ry += (my - ry) * 0.16;
      ring.style.left = rx + "px";
      ring.style.top = ry + "px";
      requestAnimationFrame(loop);
    }
    loop();

    var linkTargets = document.querySelectorAll("[data-cursor-link]");
    linkTargets.forEach(function (el) {
      el.addEventListener("mouseenter", function () { ring.classList.add("is-active"); });
      el.addEventListener("mouseleave", function () { ring.classList.remove("is-active"); });
    });

    document.addEventListener("mouseleave", function () {
      dot.style.opacity = "0"; ring.style.opacity = "0";
    });
    document.addEventListener("mouseenter", function () {
      dot.style.opacity = "1"; ring.style.opacity = "1";
    });
  }

  /* ---------- REVEAL ON SCROLL ---------- */
  function initReveal() {
    var items = document.querySelectorAll(".reveal-up");
    if (!items.length) return;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      items.forEach(function (el) { el.classList.add("is-visible"); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15, rootMargin: "0px 0px -8% 0px" });

    items.forEach(function (el) { observer.observe(el); });

    // skillbars fill when visible
    var bars = document.querySelectorAll(".skillbar");
    if (bars.length) {
      var barObserver = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            barObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.4 });
      bars.forEach(function (el) { barObserver.observe(el); });
    }
  }

  /* ---------- ANIMATED COUNTERS ---------- */
  function initCounters() {
    var counters = document.querySelectorAll(".stat__num[data-count]");
    if (!counters.length) return;

    function animateCounter(el) {
      var target = parseInt(el.getAttribute("data-count"), 10) || 0;
      var duration = 1400;
      var start = null;

      function step(ts) {
        if (!start) start = ts;
        var progress = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.round(eased * target);
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = target;
      }
      requestAnimationFrame(step);
    }

    if (reduceMotion || !("IntersectionObserver" in window)) {
      counters.forEach(function (el) {
        el.textContent = el.getAttribute("data-count");
      });
      return;
    }

    var counterObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    counters.forEach(function (el) { counterObserver.observe(el); });
  }

  document.addEventListener("DOMContentLoaded", function () {
    initPreloader();
    initCursor();
    initReveal();
    initCounters();
  });
})();
