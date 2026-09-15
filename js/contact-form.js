/* ==========================================================
   CONTACT FORM — validazione e feedback (invio demo lato client)
   Per un invio reale, collegare a un servizio come Formspree,
   EmailJS o un endpoint backend proprio.
   ========================================================== */

const ContactFormModule = (() => {
  function init() {
    const form = document.getElementById("contactForm");
    const note = document.getElementById("formNote");
    if (!form) return;

    form.addEventListener("submit", (e) => {
      e.preventDefault();
      note.textContent = "Grazie! Il tuo messaggio è pronto per essere inviato — ricordati di collegare il form a un servizio email.";
      note.classList.add("is-success");
      form.reset();
    });
  }

  return { init };
})();
