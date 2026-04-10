// ══════════════════════════════════════════
//  PNCNS — CONTRÔLEUR PRINCIPAL
// ══════════════════════════════════════════

const PAGE_CONFIG = {
  dashboard:    { title: "Vue d'ensemble",        breadcrumb: "PNCNS · Données provisoires",    render: renderDashboard },
  cartographie: { title: "Cartographie DRC",       breadcrumb: "PNCNS · 26 provinces",           render: renderCartographie },
  srmnea:       { title: "SRMNEA & Nutrition",     breadcrumb: "PNCNS · Analyse programmatique", render: renderSrmnea },
  saisie:       { title: "Saisie des données",     breadcrumb: "PNCNS · Formulaire SHA2011",      render: renderSaisie },
  sources:      { title: "Sources & Flux",         breadcrumb: "PNCNS · Registre des sources",   render: renderSources },
  sha2011:      { title: "Rapports SHA2011",       breadcrumb: "PNCNS · Classification SHA2011", render: renderSha2011 }
};

let currentPage = null;

// Détruit tous les charts Chart.js sur les canvas visibles
function destroyAllCharts() {
  document.querySelectorAll('canvas').forEach(c => {
    const ch = Chart.getChart(c);
    if (ch) ch.destroy();
  });
}

function navigate(page) {
  if (!PAGE_CONFIG[page]) return;
  currentPage = page;

  // Nav active
  document.querySelectorAll('.nav-item').forEach(el =>
    el.classList.toggle('active', el.dataset.page === page)
  );

  // Topbar
  const cfg = PAGE_CONFIG[page];
  const yr = getYear();
  document.getElementById('page-title').textContent = cfg.title;
  document.getElementById('page-breadcrumb').textContent = cfg.breadcrumb + ' · ' + yr;

  // Affiche la bonne page, cache les autres
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  // Détruit les charts PUIS render dans le prochain tick
  destroyAllCharts();
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      cfg.render();
    });
  });
}

function updateYear() {
  navigate(currentPage);
}

function renderPage(p) { navigate(p); }
