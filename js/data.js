/* ==========================================================
   DATA — carica tutti i file JSON della cartella /data
   ========================================================== */

const DataStore = (() => {
  const FILES = {
    site: "data/site.json",
    stats: "data/stats.json",
    projects: "data/projects.json",
    filters: "data/filters.json",
    services: "data/services.json",
    skills: "data/skills.json",
    timeline: "data/timeline.json",
    contact: "data/contact.json"
  };

  async function loadAll() {
    const entries = Object.entries(FILES);
    const results = await Promise.all(
      entries.map(([, path]) =>
        fetch(path).then((res) => {
          if (!res.ok) throw new Error(`Impossibile caricare ${path}`);
          return res.json();
        })
      )
    );
    const data = {};
    entries.forEach(([key], i) => { data[key] = results[i]; });
    return data;
  }

  return { loadAll };
})();
