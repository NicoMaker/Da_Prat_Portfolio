/* ==========================================================
   MAIN — entry point: carica dati e inizializza i moduli
   ========================================================== */

document.addEventListener("DOMContentLoaded", async () => {
  try {
    const data = await DataStore.loadAll();

    RenderModule.renderAll(data);
    NavModule.init(data.site);
    ProjectsModule.init();
    ContactFormModule.init();
    AnimationsModule.init();
  } catch (err) {
    console.error("Errore nel caricamento dei dati del portfolio:", err);
  }
});
