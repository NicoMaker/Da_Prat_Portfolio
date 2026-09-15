/* ==========================================================
   ANIMATIONS — reveal on scroll, contatori
   Nota: le card "stat" (sezione Chi sono) non ricevono alcun
   effetto hover, solo il conteggio iniziale al primo ingresso
   in viewport, come richiesto.
   ========================================================== */

const AnimationsModule = (() => {

  function initRevealObserver() {
    const items = document.querySelectorAll(".reveal-up, .reveal-line");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    items.forEach((el) => observer.observe(el));
  }

  function animateCount(el) {
    const target = parseInt(el.getAttribute("data-count"), 10) || 0;
    const duration = 1400;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target);
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = target;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    const nums = document.querySelectorAll(".stat__num");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    nums.forEach((el) => observer.observe(el));
  }

  function initSkillbars() {
    const bars = document.querySelectorAll(".skillbar__track span");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.style.width = `${entry.target.getAttribute("data-level")}%`;
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    bars.forEach((el) => observer.observe(el));
  }

  function init() {
    initRevealObserver();
    initCounters();
    initSkillbars();
  }

  return { init };
})();
