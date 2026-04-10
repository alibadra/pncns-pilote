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
  chartsInitialized = {};

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
  navigate(page);
}

// ══════════════════════════════════════════
//  EXPORTS
// ══════════════════════════════════════════

function _download(filename, content, mime) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function _toCSV(rows) {
  return '\uFEFF' + rows.map(r => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\r\n');
}

function exportGeneral() {
  const yr = getYear();
  switch (currentPage) {
    case 'sha2011':  exportSha2011CSV(); break;
    case 'sources':  exportSourcesCSV(); break;
    case 'srmnea':   exportSrmneaCSV(); break;
    case 'saisie':   exportSaisiesCSV(); break;
    default:         exportSaisiesCSV(); break;
  }
}

function exportSaisiesCSV() {
  const headers = ['ID', 'Source', 'Programme', 'Province', 'Montant (M USD)', 'Date', 'Statut', 'Agent'];
  const rows = DATA.saisies_recentes.map(r => [r.id, r.source, r.programme, r.province, r.montant, r.date, r.statut, r.agent]);
  _download(`PNCNS_saisies_${getYear()}.csv`, _toCSV([headers, ...rows]), 'text/csv;charset=utf-8');
}

function exportSha2011CSV() {
  const yr = getYear();
  const headers = ['Code SHA2011', 'Prestataire', 'Montant (M USD)', 'Part (%)'];
  const rows = DATA.sha2011.map(s => [s.code, s.label, s.montant, s.pct]);
  rows.push(['TOTAL', '', DATA.years[yr].total, '100']);
  _download(`PNCNS_SHA2011_${yr}.csv`, _toCSV([headers, ...rows]), 'text/csv;charset=utf-8');
}

function exportSha2011JSON() {
  const yr = getYear();
  const payload = {
    metadata: { programme: 'PNCNS-RDC', exercice: yr, format: 'SHA2011', generated: new Date().toISOString() },
    healthcareProviders: DATA.sha2011.map(s => ({ code: s.code, label: s.label, amount_MUSD: s.montant, share_pct: s.pct })),
    total_MUSD: DATA.years[yr].total
  };
  _download(`PNCNS_SHA2011_${yr}_DHIS2.json`, JSON.stringify(payload, null, 2), 'application/json');
}

function exportSha2011PDF() {
  window.print();
}

function exportSourcesCSV() {
  const yr = getYear();
  const headers = ['Source', 'Type', 'Montant (M USD)', 'Statut'];
  const rows = DATA.sources_list.map(s => [s.nom, s.type, s.montant, s.actif ? 'Actif' : 'Inactif']);
  _download(`PNCNS_sources_${yr}.csv`, _toCSV([headers, ...rows]), 'text/csv;charset=utf-8');
}

function exportSrmneaCSV() {
  const yr = getYear();
  const headers = ['Catégorie', 'Montant 2025 (M USD)', 'Montant 2024 (M USD)'];
  const rows = DATA.srmnea.categories.map((c, i) => [c, DATA.srmnea.values_2025[i], DATA.srmnea.values_2024[i]]);
  _download(`PNCNS_SRMNEA_${yr}.csv`, _toCSV([headers, ...rows]), 'text/csv;charset=utf-8');
}
