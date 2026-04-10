// ══════════════════════════════════════════
//  PNCNS — CONTRÔLEUR PRINCIPAL
// ══════════════════════════════════════════

const PAGE_CONFIG = {
  dashboard:    { title: 'Vue d\'ensemble', breadcrumb: 'PNCNS · Données provisoires 2025', render: renderDashboard },
  cartographie: { title: 'Cartographie DRC', breadcrumb: 'PNCNS · 26 provinces · 2025', render: renderCartographie },
  srmnea:       { title: 'SRMNEA & Nutrition', breadcrumb: 'PNCNS · Analyse programmatique · 2025', render: renderSrmnea },
  saisie:       { title: 'Saisie des données', breadcrumb: 'PNCNS · Formulaire SHA2011', render: renderSaisie },
  sources:      { title: 'Sources & Flux financiers', breadcrumb: 'PNCNS · Registre des sources', render: renderSources },
  sha2011:      { title: 'Rapports SHA2011', breadcrumb: 'PNCNS · Classification internationale · 2025', render: renderSha2011 }
};

function navigate(page) {
  if (!PAGE_CONFIG[page]) return;
  currentPage = page;

  // Update nav
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === page);
  });

  // Update topbar
  const cfg = PAGE_CONFIG[page];
  const yr = getYear();
  document.getElementById('page-title').textContent = cfg.title;
  document.getElementById('page-breadcrumb').textContent = cfg.breadcrumb.replace('2025', yr);

  // Show/hide pages
  document.querySelectorAll('.page').forEach(el => el.classList.remove('active'));
  document.getElementById('page-' + page).classList.add('active');

  // Render
  cfg.render();
}

function renderPage(page) {
  chartsInitialized = {};
  navigate(page);
}
