// ══════════════════════════════════════════
//  PNCNS — RENDU DES PAGES
// ══════════════════════════════════════════

let chartsInitialized = {};
let currentYear = 2025;

function getYear() { return parseInt(document.getElementById('year-filter')?.value || 2025); }
function updateYear() { currentYear = getYear(); renderCurrentPage(); }

let currentPage = 'dashboard';
function renderCurrentPage() { renderPage(currentPage); }

// ── STATUS HELPERS ──
function statusPill(s) {
  const map = { 'validé': 'pill-green', 'en cours': 'pill-amber', 'à vérifier': 'pill-red' };
  return `<span class="status-pill ${map[s]||'pill-blue'}">${s}</span>`;
}

function progBar(pct, color) {
  return `<div class="prog-wrap"><div class="prog-bg"><div class="prog-fill" style="width:${pct}%;background:${color};"></div></div></div>`;
}

function fmt(n) { return n >= 1000 ? (n/1000).toFixed(1) + ' Md' : n + ' M'; }

// ══════════════════════════════════════════
//  PAGE: DASHBOARD
// ══════════════════════════════════════════
function renderDashboard() {
  const yr = getYear();
  const d = DATA.years[yr];
  const prev = DATA.years[yr-1] || d;
  const diffTotal = (((d.total - prev.total)/prev.total)*100).toFixed(1);
  const diffSrm   = (((d.srmnea - prev.srmnea)/prev.srmnea)*100).toFixed(1);
  const diffNut   = (((d.nutrition - prev.nutrition)/prev.nutrition)*100).toFixed(1);

  const badgeTotal = diffTotal >= 0 ? `<span class="metric-badge badge-up">▲ +${diffTotal}% vs ${yr-1}</span>` : `<span class="metric-badge badge-down">▼ ${diffTotal}% vs ${yr-1}</span>`;
  const badgeSrm   = diffSrm >= 0 ? `<span class="metric-badge badge-up">▲ +${diffSrm}%</span>` : `<span class="metric-badge badge-down">▼ ${diffSrm}%</span>`;
  const badgeNut   = diffNut >= 0 ? `<span class="metric-badge badge-up">▲ +${diffNut}%</span>` : `<span class="metric-badge badge-down">▼ ${diffNut}%</span>`;

  const rows = DATA.saisies_recentes.slice(0,5).map(r => `
    <tr>
      <td><code style="font-size:11px;color:#185FA5;">${r.id}</code></td>
      <td><strong>${r.source}</strong></td>
      <td>${r.programme}</td>
      <td>${r.province}</td>
      <td><strong>$${r.montant} M</strong></td>
      <td>${statusPill(r.statut)}</td>
    </tr>`).join('');

  const provRows = DATA.provinces.slice(0,6).map(p => {
    const pct = Math.round((p.total/DATA.provinces[0].total)*100);
    const color = pct > 70 ? '#185FA5' : pct > 40 ? '#1D9E75' : '#BA7517';
    return `<tr>
      <td><strong>${p.name}</strong></td>
      <td>$${p.srmnea} M</td>
      <td>$${p.nutrition} M</td>
      <td>${progBar(pct, color)}<span style="font-size:11px;color:#8892A0;">$${p.total} M</span></td>
    </tr>`;
  }).join('');

  document.getElementById('page-dashboard').innerHTML = `
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">Dépenses totales santé</div>
        <div class="metric-value">$${fmt(d.total)}</div>
        <div class="metric-sub">USD · exercice ${yr}</div>
        ${badgeTotal}
      </div>
      <div class="metric-card">
        <div class="metric-label">Financement SRMNEA</div>
        <div class="metric-value">$${d.srmnea} M</div>
        <div class="metric-sub">${((d.srmnea/d.total)*100).toFixed(1)}% des dépenses totales</div>
        ${badgeSrm}
      </div>
      <div class="metric-card">
        <div class="metric-label">Financement Nutrition</div>
        <div class="metric-value">$${d.nutrition} M</div>
        <div class="metric-sub">${((d.nutrition/d.total)*100).toFixed(1)}% des dépenses totales</div>
        ${badgeNut}
      </div>
      <div class="metric-card">
        <div class="metric-label">Sources actives</div>
        <div class="metric-value">${d.sources}</div>
        <div class="metric-sub">État · PTF · ONG · Ménages</div>
        <span class="metric-badge badge-blue">SHA2011 conforme</span>
      </div>
    </div>

    <div class="panels-row cols-2">
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title">Évolution des dépenses par source (2020–2025)</div>
          <div class="panel-sub">Classification SHA2011 — en millions USD</div>
        </div>
        <div class="chart-legend">
          <div class="legend-item"><div class="legend-dot" style="background:#185FA5;"></div>État</div>
          <div class="legend-item"><div class="legend-dot" style="background:#1D9E75;"></div>Partenaires techniques</div>
          <div class="legend-item"><div class="legend-dot" style="background:#BA7517;"></div>Ménages</div>
          <div class="legend-item"><div class="legend-dot" style="background:#D4537E;"></div>ONG</div>
        </div>
        <div class="chart-wrap" style="height:220px;"><canvas id="chart-evolution"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title">Répartition par source</div>
          <div class="panel-sub">Exercice ${yr}</div>
        </div>
        <div class="chart-wrap" style="height:170px;"><canvas id="chart-donut"></canvas></div>
        <div style="margin-top:12px;">
          ${[['État',d.sources_breakdown.etat,'#185FA5'],['Partenaires',d.sources_breakdown.ptf,'#1D9E75'],['Ménages',d.sources_breakdown.menages,'#BA7517'],['ONG',d.sources_breakdown.ong,'#D4537E']].map(([l,v,c])=>`
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
            <div style="width:8px;height:8px;border-radius:2px;background:${c};flex-shrink:0;"></div>
            <span style="font-size:12px;color:#4B5563;flex:1;">${l}</span>
            <span style="font-size:12px;font-weight:600;">$${v} M</span>
            <span style="font-size:11px;color:#8892A0;">${((v/d.total)*100).toFixed(0)}%</span>
          </div>`).join('')}
        </div>
      </div>
    </div>

    <div class="panels-row cols-2">
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title">Flux financiers par province (top 6)</div>
          <div class="panel-sub">SRMNEA + Nutrition — ${yr}</div>
        </div>
        <table class="data-table">
          <thead><tr><th>Province</th><th>SRMNEA</th><th>Nutrition</th><th>Total</th></tr></thead>
          <tbody>${provRows}</tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head">
          <div class="panel-title">Dernières saisies</div>
          <div class="panel-sub">Données en attente de traitement</div>
        </div>
        <table class="data-table">
          <thead><tr><th>ID</th><th>Source</th><th>Programme</th><th>Province</th><th>Montant</th><th>Statut</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;

  // Charts — setTimeout pour laisser le DOM se stabiliser
  setTimeout(() => {
    const evo = DATA.evolution;
    new Chart(document.getElementById('chart-evolution'), {
      type: 'line',
      data: {
        labels: evo.labels,
        datasets: [
          { label: 'État', data: evo.etat, borderColor:'#185FA5', backgroundColor:'rgba(24,95,165,.06)', tension:.4, fill:true, pointRadius:3 },
          { label: 'PTF', data: evo.ptf, borderColor:'#1D9E75', backgroundColor:'rgba(29,158,117,.06)', tension:.4, fill:true, pointRadius:3 },
          { label: 'Ménages', data: evo.menages, borderColor:'#BA7517', tension:.4, fill:false, pointRadius:3 },
          { label: 'ONG', data: evo.ong, borderColor:'#D4537E', tension:.4, fill:false, pointRadius:3 }
        ]
      },
      options: { responsive:true, maintainAspectRatio:false, plugins:{legend:{display:false}},
        scales:{y:{ticks:{callback:v=>'$'+v+'M',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},x:{ticks:{font:{size:10}},grid:{display:false}}} }
    });

    const canvas = document.getElementById('chart-donut');
    if (canvas) {
      new Chart(canvas, {
        type:'doughnut',
        data:{
          labels:['État','PTF','Ménages','ONG'],
          datasets:[{data:[d.sources_breakdown.etat,d.sources_breakdown.ptf,d.sources_breakdown.menages,d.sources_breakdown.ong],backgroundColor:['#185FA5','#1D9E75','#BA7517','#D4537E'],borderWidth:0,hoverOffset:4}]
        },
        options:{responsive:true,maintainAspectRatio:false,cutout:'65%',plugins:{legend:{display:false}}}
      });
    }
  }, 50);
}

// ══════════════════════════════════════════
//  PAGE: CARTOGRAPHIE
// ══════════════════════════════════════════
function renderCartographie() {
  document.getElementById('page-cartographie').innerHTML = `
    <div class="panels-row cols-1" style="margin-bottom:16px;">
      <div class="panel">
        <div class="panel-head" style="display:flex;align-items:center;justify-content:space-between;">
          <div>
            <div class="panel-title">Cartographie des dépenses par province</div>
            <div class="panel-sub">Intensité des dépenses SRMNEA + Nutrition — RDC 2025</div>
          </div>
          <div style="display:flex;gap:8px;">
            <button class="btn-secondary" onclick="mapView('srmnea')" id="btn-map-srmnea">SRMNEA</button>
            <button class="btn-primary" onclick="mapView('total')" id="btn-map-total">Total</button>
          </div>
        </div>
        <div id="map-container"></div>
        <div style="display:flex;align-items:center;gap:12px;margin-top:12px;font-size:12px;color:#8892A0;">
          <span>Faible</span>
          <div style="display:flex;gap:2px;">
            ${['#D6E8F5','#B5D4F4','#85B7EB','#378ADD','#185FA5','#0C447C'].map(c=>`<div style="width:24px;height:12px;background:${c};border-radius:2px;"></div>`).join('')}
          </div>
          <span>Élevé</span>
        </div>
      </div>
    </div>

    <div class="panels-row cols-2">
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Classement des provinces</div><div class="panel-sub">Dépenses totales SRMNEA + Nutrition</div></div>
        <table class="data-table">
          <thead><tr><th>#</th><th>Province</th><th>SRMNEA</th><th>Nutrition</th><th>Total</th></tr></thead>
          <tbody>
            ${DATA.provinces.map((p,i)=>`<tr>
              <td style="color:#8892A0;font-size:12px;">${i+1}</td>
              <td><strong>${p.name}</strong></td>
              <td>$${p.srmnea} M</td>
              <td>$${p.nutrition} M</td>
              <td><strong>$${p.total} M</strong></td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Distribution géographique</div><div class="panel-sub">Part de chaque province dans le total national</div></div>
        <div class="chart-wrap" style="height:300px;"><canvas id="chart-provinces"></canvas></div>
      </div>
    </div>
  `;

  // Init Leaflet map — always destroy and recreate to fix blank on revisit
  if (window.leafletMap) {
    window.leafletMap.remove();
    window.leafletMap = null;
  }
  const map = L.map('map-container').setView([-4.0, 24.0], 5);
  window.leafletMap = map;
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '© OpenStreetMap',
    maxZoom: 10
  }).addTo(map);

  const maxTotal = Math.max(...DATA.provinces.map(p=>p.total));
  DATA.provinces.forEach(p => {
    const pct = p.total / maxTotal;
    const size = 20 + pct * 40;
    const opacity = 0.4 + pct * 0.5;
    L.circleMarker([p.lat, p.lng], {
      radius: size/2,
      fillColor: '#185FA5',
      color: '#0C447C',
      weight: 1,
      opacity: 1,
      fillOpacity: opacity
    }).addTo(map).bindPopup(`
      <div style="font-family:'IBM Plex Sans',sans-serif;min-width:200px;">
        <div style="font-weight:600;font-size:14px;color:#1F2937;border-bottom:1px solid #E2E6EC;padding-bottom:6px;margin-bottom:8px;">${p.name}</div>
        <div style="font-size:13px;margin-bottom:4px;">SRMNEA : <strong>$${p.srmnea} M</strong></div>
        <div style="font-size:13px;margin-bottom:4px;">Nutrition : <strong>$${p.nutrition} M</strong></div>
        <div style="font-size:13px;font-weight:600;color:#185FA5;">Total : $${p.total} M</div>
      </div>
    `);
  });
  setTimeout(() => map.invalidateSize(), 100);

  setTimeout(() => {
    const canvasProv = document.getElementById('chart-provinces');
    if (canvasProv) {
      new Chart(canvasProv, {
        type: 'bar',
        data: {
          labels: DATA.provinces.map(p=>p.name),
          datasets: [{
            label: 'Total ($M)',
            data: DATA.provinces.map(p=>p.total),
            backgroundColor: DATA.provinces.map((_,i)=> i===0?'#185FA5':i===1?'#378ADD':i===2?'#85B7EB':'#B5D4F4'),
            borderRadius: 4
          }]
        },
        options: {
          indexAxis: 'y',
          responsive: true, maintainAspectRatio: false,
          plugins: { legend: { display: false } },
          scales: {
            x: { ticks: { callback: v=>'$'+v+'M', font:{size:10} }, grid:{color:'rgba(0,0,0,.04)'} },
            y: { ticks: { font:{size:11} }, grid:{display:false} }
          }
        }
      });
    }
  }, 50);
}

// ══════════════════════════════════════════
//  PAGE: SRMNEA & NUTRITION
// ══════════════════════════════════════════
function renderSrmnea() {
  const yr = getYear();
  const s = DATA.srmnea;

  document.getElementById('page-srmnea').innerHTML = `
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-label">SRMNEA total</div>
        <div class="metric-value">$${DATA.years[yr].srmnea} M</div>
        <div class="metric-sub">Exercice ${yr}</div>
        <span class="metric-badge badge-up">▲ +12.1% vs ${yr-1}</span>
      </div>
      <div class="metric-card">
        <div class="metric-label">Nutrition total</div>
        <div class="metric-value">$${DATA.years[yr].nutrition} M</div>
        <div class="metric-sub">Exercice ${yr}</div>
        <span class="metric-badge badge-down">▼ -2.4% vs ${yr-1}</span>
      </div>
      <div class="metric-card">
        <div class="metric-label">% budget santé SRMNEA</div>
        <div class="metric-value">${((DATA.years[yr].srmnea/DATA.years[yr].total)*100).toFixed(1)}%</div>
        <div class="metric-sub">Cible nationale : 25%</div>
        <span class="metric-badge badge-neutral">En progression</span>
      </div>
      <div class="metric-card">
        <div class="metric-label">Couverture provinces</div>
        <div class="metric-value">26 / 26</div>
        <div class="metric-sub">Provinces couvertes</div>
        <span class="metric-badge badge-blue">100%</span>
      </div>
    </div>

    <div class="panels-row cols-2">
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Dépenses SRMNEA par catégorie</div><div class="panel-sub">Comparaison ${yr} vs ${yr-1}</div></div>
        <div class="chart-legend">
          <div class="legend-item"><div class="legend-dot" style="background:#185FA5;"></div>${yr}</div>
          <div class="legend-item"><div class="legend-dot" style="background:#B5D4F4;"></div>${yr-1}</div>
        </div>
        <div class="chart-wrap" style="height:250px;"><canvas id="chart-srmnea-cat"></canvas></div>
      </div>
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Financement SRMNEA par source</div><div class="panel-sub">Exercice ${yr}</div></div>
        <div class="chart-wrap" style="height:250px;"><canvas id="chart-srmnea-src"></canvas></div>
      </div>
    </div>

    <div class="panels-row cols-1">
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Dépenses Nutrition par programme</div><div class="panel-sub">Comparaison ${yr} vs ${yr-1}</div></div>
        <div class="chart-wrap" style="height:200px;"><canvas id="chart-nutrition"></canvas></div>
      </div>
    </div>
  `;

  setTimeout(() => {
    new Chart(document.getElementById('chart-srmnea-cat'), {
      type:'bar',
      data:{labels:s.categories, datasets:[
        {label: String(yr), data:s.values_2025, backgroundColor:'#185FA5', borderRadius:4},
        {label: String(yr-1), data:s.values_2024, backgroundColor:'#D6E8F5', borderRadius:4}
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{display:false}},
        scales:{y:{ticks:{callback:v=>'$'+v+'M',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},x:{ticks:{font:{size:10}},grid:{display:false}}}}
    });
    new Chart(document.getElementById('chart-srmnea-src'), {
      type:'pie',
      data:{labels:s.financement.labels, datasets:[{data:s.financement.values, backgroundColor:['#185FA5','#378ADD','#1D9E75','#D4537E','#BA7517'], borderWidth:0, hoverOffset:4}]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'right',labels:{font:{size:11},padding:10}}}}
    });
    new Chart(document.getElementById('chart-nutrition'), {
      type:'bar',
      data:{labels:DATA.nutrition.categories, datasets:[
        {label: String(yr), data:DATA.nutrition.values_2025, backgroundColor:'#1D9E75', borderRadius:4},
        {label: String(yr-1), data:DATA.nutrition.values_2024, backgroundColor:'#9FE1CB', borderRadius:4}
      ]},
      options:{responsive:true,maintainAspectRatio:false,plugins:{legend:{position:'top',labels:{font:{size:11}}}},
        scales:{y:{ticks:{callback:v=>'$'+v+'M',font:{size:10}},grid:{color:'rgba(0,0,0,.04)'}},x:{ticks:{font:{size:10}},grid:{display:false}}}}
    });
  }, 50);
}

// ══════════════════════════════════════════
//  PAGE: SAISIE DES DONNÉES
// ══════════════════════════════════════════
function renderSaisie() {
  if (currentUser && !currentUser.canEdit) {
    document.getElementById('page-saisie').innerHTML = `
      <div class="alert alert-info">Votre profil (Analyste) ne dispose pas des droits de saisie. Contactez l'administrateur.</div>`;
    return;
  }

  document.getElementById('page-saisie').innerHTML = `
    <div class="panels-row cols-1">
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Nouvelle saisie — Données financières SHA2011</div><div class="panel-sub">Formulaire de collecte standardisé</div></div>
        <div id="saisie-alert"></div>

        <div class="form-section">
          <div class="form-section-title">1. Identification de la source</div>
          <div class="form-grid">
            <div class="form-field">
              <label>Source de financement *</label>
              <select id="f-source">
                <option value="">-- Sélectionner --</option>
                <option>État RDC (Trésor Public)</option>
                <option>USAID</option>
                <option>Banque mondiale / IDA</option>
                <option>Fonds mondial (GFATM)</option>
                <option>UNICEF</option>
                <option>OMS / WHO</option>
                <option>GAVI Alliance</option>
                <option>Ménages (out-of-pocket)</option>
                <option>ONG nationale</option>
                <option>Autre</option>
              </select>
            </div>
            <div class="form-field">
              <label>Type de financement (SHA2011) *</label>
              <select id="f-type">
                <option value="">-- Sélectionner --</option>
                <option value="HF.1">HF.1 — Transferts gouvernementaux</option>
                <option value="HF.2">HF.2 — Transferts à la sécurité sociale</option>
                <option value="HF.3">HF.3 — Transferts volontaires (ONG/NPO)</option>
                <option value="HF.4">HF.4 — Entreprises</option>
                <option value="HF.5">HF.5 — Ménages</option>
                <option value="HF.6">HF.6 — Reste du monde</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-title">2. Affectation programmatique</div>
          <div class="form-grid">
            <div class="form-field">
              <label>Programme de santé *</label>
              <select id="f-programme">
                <option value="">-- Sélectionner --</option>
                <option>SRMNEA</option>
                <option>Nutrition</option>
                <option>VIH/SIDA</option>
                <option>Paludisme</option>
                <option>Tuberculose</option>
                <option>Santé générale</option>
                <option>Administration sanitaire</option>
              </select>
            </div>
            <div class="form-field">
              <label>Province *</label>
              <select id="f-province">
                <option value="">-- Sélectionner --</option>
                ${DATA.provinces.map(p=>`<option>${p.name}</option>`).join('')}
                <option>Haut-Lomami</option><option>Lualaba</option><option>Kwango</option>
                <option>Mai-Ndombe</option><option>Sankuru</option><option>Sud-Ubangi</option>
                <option>Nord-Ubangi</option><option>Mongala</option><option>Tshuapa</option>
                <option>Sud-Kivu</option><option>Haut-Katanga</option><option>Kwilu</option>
                <option>Kasaï</option><option>Kasaï Central</option><option>Tshopo</option>
                <option>Bas-Uele</option><option>Haut-Uele</option>
              </select>
            </div>
            <div class="form-field">
              <label>Période (année) *</label>
              <select id="f-annee">
                <option>2025</option><option>2024</option><option>2023</option>
              </select>
            </div>
            <div class="form-field">
              <label>Trimestre</label>
              <select id="f-trimestre">
                <option value="">Annuel (tous)</option>
                <option>T1 (Jan–Mar)</option><option>T2 (Avr–Jun)</option>
                <option>T3 (Jul–Sep)</option><option>T4 (Oct–Déc)</option>
              </select>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-title">3. Données financières</div>
          <div class="form-grid">
            <div class="form-field">
              <label>Montant (USD) *</label>
              <input type="number" id="f-montant" placeholder="Ex: 1250000" min="0" step="1000"/>
            </div>
            <div class="form-field">
              <label>Devise originale</label>
              <select id="f-devise">
                <option>USD</option><option>CDF (Franc congolais)</option><option>EUR</option>
              </select>
            </div>
            <div class="form-field">
              <label>Type de dépense</label>
              <select id="f-type-dep">
                <option>Dépense réelle (exécutée)</option>
                <option>Engagement (budgété)</option>
                <option>Prévision</option>
              </select>
            </div>
            <div class="form-field">
              <label>Source du document justificatif</label>
              <input type="text" id="f-justif" placeholder="Ex: Rapport financier Q1 2025"/>
            </div>
          </div>
          <div class="form-field" style="margin-top:12px;">
            <label>Observations / Notes</label>
            <textarea id="f-notes" placeholder="Informations complémentaires, méthodologie de collecte, ajustements..."></textarea>
          </div>
        </div>

        <div class="form-actions">
          <button class="btn-primary" onclick="submitSaisie()">Enregistrer la saisie</button>
          <button class="btn-secondary" onclick="resetForm()">Réinitialiser</button>
        </div>
      </div>
    </div>

    <div class="panels-row cols-1">
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Historique des saisies récentes</div></div>
        <table class="data-table">
          <thead><tr><th>ID</th><th>Date</th><th>Source</th><th>Programme</th><th>Province</th><th>Montant</th><th>Statut</th><th>Agent</th></tr></thead>
          <tbody>
            ${DATA.saisies_recentes.map(r=>`<tr>
              <td><code style="font-size:11px;color:#185FA5;">${r.id}</code></td>
              <td style="color:#8892A0;">${r.date}</td>
              <td>${r.source}</td>
              <td>${r.programme}</td>
              <td>${r.province}</td>
              <td><strong>$${r.montant} M</strong></td>
              <td>${statusPill(r.statut)}</td>
              <td style="color:#8892A0;">${r.agent}</td>
            </tr>`).join('')}
          </tbody>
        </table>
      </div>
    </div>
  `;
}

function submitSaisie() {
  const source = document.getElementById('f-source').value;
  const programme = document.getElementById('f-programme').value;
  const province = document.getElementById('f-province').value;
  const montant = document.getElementById('f-montant').value;

  if (!source || !programme || !province || !montant) {
    document.getElementById('saisie-alert').innerHTML = `<div class="alert" style="background:#FCEBEB;border-color:#F7C1C1;color:#A32D2D;">Veuillez remplir tous les champs obligatoires (*).</div>`;
    return;
  }
  const id = 'SAI-2025-' + (Math.floor(Math.random()*900)+100);
  document.getElementById('saisie-alert').innerHTML = `<div class="alert alert-success">Saisie ${id} enregistrée avec succès. En attente de validation par le superviseur.</div>`;
  resetForm();
}

function resetForm() {
  ['f-source','f-type','f-programme','f-province','f-annee','f-trimestre','f-montant','f-devise','f-type-dep','f-justif','f-notes'].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = el.tagName === 'SELECT' ? el.options[0]?.value || '' : '';
  });
}

// ══════════════════════════════════════════
//  PAGE: SOURCES & FLUX
// ══════════════════════════════════════════
function renderSources() {
  const rows = DATA.sources_list.map(s=>`<tr>
    <td><strong>${s.nom}</strong></td>
    <td><span class="status-pill pill-blue">${s.type}</span></td>
    <td><strong>$${s.montant} M</strong></td>
    <td>${progBar(Math.round((s.montant/DATA.sources_list.reduce((a,x)=>a+x.montant,0))*100*3),'#185FA5')}</td>
    <td>${s.actif ? '<span class="status-pill pill-green">Actif</span>' : '<span class="status-pill pill-amber">Inactif</span>'}</td>
  </tr>`).join('');

  document.getElementById('page-sources').innerHTML = `
    <div class="metrics-grid">
      <div class="metric-card"><div class="metric-label">Sources gouvernementales</div><div class="metric-value">1</div><div class="metric-sub">État RDC</div></div>
      <div class="metric-card"><div class="metric-label">Partenaires techniques</div><div class="metric-value">6</div><div class="metric-sub">Bilatéraux & multilatéraux</div></div>
      <div class="metric-card"><div class="metric-label">ONG & secteur privé</div><div class="metric-value">2</div><div class="metric-sub">Locales & internationales</div></div>
      <div class="metric-card"><div class="metric-label">Ménages (enquêtes)</div><div class="metric-value">1</div><div class="metric-sub">Out-of-pocket</div></div>
    </div>
    <div class="panels-row cols-1">
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Registre des sources de financement</div><div class="panel-sub">Toutes sources actives et inactives — SHA2011</div></div>
        <table class="data-table">
          <thead><tr><th>Source</th><th>Type</th><th>Montant 2025</th><th>Part relative</th><th>Statut</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
}

// ══════════════════════════════════════════
//  PAGE: RAPPORTS SHA2011
// ══════════════════════════════════════════
function renderSha2011() {
  const yr = getYear();
  const rows = DATA.sha2011.map(s=>`<tr>
    <td><span class="sha-label sha-hf">${s.code}</span></td>
    <td>${s.label}</td>
    <td><strong>$${s.montant} M</strong></td>
    <td>${s.pct}%</td>
    <td>${progBar(s.pct*2.5,'#185FA5')}</td>
  </tr>`).join('');

  document.getElementById('page-sha2011').innerHTML = `
    <div class="alert alert-info">Rapport SHA2011 généré automatiquement à partir des données saisies — Exercice ${yr}. Classification internationale du Système des Comptes de la Santé.</div>

    <div class="panels-row cols-2">
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Dépenses par prestataire (HF)</div><div class="panel-sub">Health Financing Schemes — SHA2011</div></div>
        <table class="data-table">
          <thead><tr><th>Code</th><th>Prestataire</th><th>Montant</th><th>%</th><th>Part</th></tr></thead>
          <tbody>${rows}</tbody>
          <tfoot><tr style="background:#F0F2F5;">
            <td colspan="2"><strong>TOTAL</strong></td>
            <td><strong>$${DATA.years[yr].total} M</strong></td>
            <td><strong>100%</strong></td>
            <td></td>
          </tr></tfoot>
        </table>
      </div>
      <div class="panel">
        <div class="panel-head"><div class="panel-title">Répartition par prestataire</div><div class="panel-sub">SHA2011 — Exercice ${yr}</div></div>
        <div class="chart-wrap" style="height:300px;"><canvas id="chart-sha"></canvas></div>
      </div>
    </div>

    <div class="panels-row cols-1">
      <div class="panel">
        <div class="panel-head" style="display:flex;align-items:center;justify-content:space-between;">
          <div><div class="panel-title">Exporter le rapport SHA2011</div><div class="panel-sub">Formats standardisés OMS/WHO</div></div>
        </div>
        <div style="display:flex;gap:12px;flex-wrap:wrap;">
          <button class="btn-primary" onclick="exportPDF()">⬇ PDF Rapport complet</button>
          <button class="btn-secondary" onclick="exportCSV()">⬇ CSV SHA2011</button>
          <button class="btn-secondary" onclick="exportJSON()">⬇ JSON DHIS2</button>
          <button class="btn-secondary" onclick="exportSaisies()">⬇ CSV Saisies</button>
          <button class="btn-secondary" onclick="exportProvinces()">⬇ CSV Provinces</button>
        </div>
      </div>
    </div>
  `;

  setTimeout(() => {
    const canvasSha = document.getElementById('chart-sha');
    if (canvasSha) {
      new Chart(canvasSha, {
        type:'doughnut',
        data:{
          labels: DATA.sha2011.map(s=>s.code+' '+s.label),
          datasets:[{data: DATA.sha2011.map(s=>s.montant), backgroundColor:['#185FA5','#378ADD','#85B7EB','#1D9E75','#5DCAA5','#BA7517','#D4537E','#8892A0'], borderWidth:0, hoverOffset:4}]
        },
        options:{responsive:true,maintainAspectRatio:false,cutout:'55%',plugins:{legend:{position:'right',labels:{font:{size:10},padding:6,boxWidth:12}}}}
      });
    }
  }, 50);
}

// ══════════════════════════════════════════
//  EXPORTS — FONCTIONS RÉELLES
// ══════════════════════════════════════════

function downloadFile(content, filename, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = filename;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function exportCSV() {
  const yr = getYear();
  const bom = '\uFEFF';
  const header = 'Code SHA2011,Prestataire,Montant (USD M),Pourcentage,Exercice\n';
  const rows = DATA.sha2011.map(s =>
    `${s.code},"${s.label}",${s.montant},${s.pct}%,${yr}`
  ).join('\n');
  const total = `TOTAL,"Total dépenses santé",${DATA.years[yr].total},100%,${yr}`;
  downloadFile(bom + header + rows + '\n' + total, `SHA2011_RDC_${yr}.csv`, 'text/csv;charset=utf-8;');
}

function exportJSON() {
  const yr = getYear();
  const d = DATA.years[yr];
  const payload = {
    metadata: {
      title: "Comptes Nationaux de la Santé — RDC",
      standard: "SHA2011",
      exercice: yr,
      generatedAt: new Date().toISOString(),
      source: "PNCNS — Plateforme pilote",
      generatedBy: "DIAKITE BADRA Ali"
    },
    totals: {
      depensesTotales_USD_M: d.total,
      srmnea_USD_M: d.srmnea,
      nutrition_USD_M: d.nutrition,
      sourcesActives: d.sources
    },
    sourcesFinancement: {
      etat_USD_M: d.sources_breakdown.etat,
      partenaires_USD_M: d.sources_breakdown.ptf,
      menages_USD_M: d.sources_breakdown.menages,
      ong_USD_M: d.sources_breakdown.ong
    },
    classificationHF: DATA.sha2011.map(s => ({
      code: s.code, label: s.label,
      montant_USD_M: s.montant, part_pct: s.pct
    })),
    provinces: DATA.provinces.map(p => ({
      nom: p.name, srmnea_USD_M: p.srmnea,
      nutrition_USD_M: p.nutrition, total_USD_M: p.total
    }))
  };
  downloadFile(JSON.stringify(payload, null, 2), `PNCNS_DHIS2_${yr}.json`, 'application/json');
}

function exportSaisies() {
  const bom = '\uFEFF';
  const header = 'ID,Source,Programme,Province,Montant (USD M),Date,Statut,Agent\n';
  const rows = DATA.saisies_recentes.map(r =>
    `${r.id},"${r.source}",${r.programme},${r.province},${r.montant},${r.date},${r.statut},${r.agent}`
  ).join('\n');
  downloadFile(bom + header + rows, `PNCNS_Saisies_${new Date().toISOString().slice(0,10)}.csv`, 'text/csv;charset=utf-8;');
}

function exportProvinces() {
  const bom = '\uFEFF';
  const header = 'Province,SRMNEA (USD M),Nutrition (USD M),Total (USD M),Latitude,Longitude\n';
  const rows = DATA.provinces.map(p =>
    `${p.name},${p.srmnea},${p.nutrition},${p.total},${p.lat},${p.lng}`
  ).join('\n');
  downloadFile(bom + header + rows, `PNCNS_Provinces_2025.csv`, 'text/csv;charset=utf-8;');
}

// Export général depuis la topbar
function exportGeneral() {
  exportPDF();
}

function exportPDF() {
  const yr = getYear();
  const d = DATA.years[yr];

  // Load jsPDF dynamically
  if (!window.jspdf) {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => generatePDF(yr, d);
    document.head.appendChild(script);
  } else {
    generatePDF(yr, d);
  }
}

function generatePDF(yr, d) {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const W = 210; const margin = 18;
  const contentW = W - margin * 2;
  let y = 0;

  // Header band
  doc.setFillColor(24, 95, 165);
  doc.rect(0, 0, W, 38, 'F');
  doc.setFillColor(29, 158, 117);
  doc.rect(0, 35, W, 3, 'F');

  doc.setTextColor(255,255,255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(16);
  doc.text('PNCNS — Comptes Nationaux de la Santé', margin, 14);
  doc.setFontSize(10);
  doc.setFont('helvetica','normal');
  doc.text('République Démocratique du Congo', margin, 21);
  doc.text(`Rapport SHA2011 — Exercice ${yr}`, margin, 27);
  doc.setFontSize(8);
  doc.text(`Généré le ${new Date().toLocaleDateString('fr-FR')} par DIAKITE BADRA Ali`, margin, 33);

  y = 50;

  // Title
  doc.setTextColor(24,95,165);
  doc.setFont('helvetica','bold');
  doc.setFontSize(13);
  doc.text('Rapport de Dépenses de Santé', margin, y);
  y += 10;

  // KPI boxes
  const kpis = [
    ['Dépenses totales', `$${d.total} M`],
    ['SRMNEA', `$${d.srmnea} M`],
    ['Nutrition', `$${d.nutrition} M`],
    ['Sources actives', `${d.sources}`]
  ];
  const boxW = contentW / 4 - 2;
  kpis.forEach(([label, val], i) => {
    const x = margin + i * (boxW + 2.7);
    doc.setFillColor(240, 246, 252);
    doc.roundedRect(x, y, boxW, 20, 2, 2, 'F');
    doc.setTextColor(100,116,139);
    doc.setFont('helvetica','normal');
    doc.setFontSize(7);
    doc.text(label, x + 3, y + 7);
    doc.setTextColor(24,95,165);
    doc.setFont('helvetica','bold');
    doc.setFontSize(12);
    doc.text(val, x + 3, y + 16);
  });
  y += 28;

  // Section: Sources
  doc.setFillColor(24,95,165);
  doc.rect(margin, y, contentW, 7, 'F');
  doc.setTextColor(255,255,255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.text('Répartition par source de financement', margin + 3, y + 5);
  y += 11;

  const sources = [
    ['État RDC', d.sources_breakdown.etat, `${((d.sources_breakdown.etat/d.total)*100).toFixed(1)}%`],
    ['Partenaires techniques & financiers', d.sources_breakdown.ptf, `${((d.sources_breakdown.ptf/d.total)*100).toFixed(1)}%`],
    ['Ménages (out-of-pocket)', d.sources_breakdown.menages, `${((d.sources_breakdown.menages/d.total)*100).toFixed(1)}%`],
    ['ONG & Fondations', d.sources_breakdown.ong, `${((d.sources_breakdown.ong/d.total)*100).toFixed(1)}%`]
  ];
  sources.forEach(([label, val, pct], i) => {
    doc.setFillColor(i%2===0?248:255, i%2===0?249:255, i%2===0?251:255);
    doc.rect(margin, y, contentW, 7, 'F');
    doc.setTextColor(50,50,50);
    doc.setFont('helvetica','normal');
    doc.setFontSize(9);
    doc.text(label, margin+3, y+5);
    doc.setFont('helvetica','bold');
    doc.text(`$${val} M`, margin+contentW-40, y+5);
    doc.setTextColor(24,95,165);
    doc.text(pct, margin+contentW-10, y+5, {align:'right'});
    y += 7;
  });
  y += 8;

  // Section: SHA2011 classification
  doc.setFillColor(24,95,165);
  doc.rect(margin, y, contentW, 7, 'F');
  doc.setTextColor(255,255,255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.text('Classification SHA2011 — Dépenses par prestataire (HF)', margin+3, y+5);
  y += 11;

  // Table header
  doc.setFillColor(230,240,250);
  doc.rect(margin, y, contentW, 6, 'F');
  doc.setTextColor(24,95,165);
  doc.setFontSize(8);
  doc.text('Code', margin+2, y+4);
  doc.text('Prestataire', margin+20, y+4);
  doc.text('Montant', margin+contentW-35, y+4);
  doc.text('%', margin+contentW-8, y+4, {align:'right'});
  y += 6;

  DATA.sha2011.forEach((s,i) => {
    doc.setFillColor(i%2===0?248:255, i%2===0?249:255, i%2===0?251:255);
    doc.rect(margin, y, contentW, 6, 'F');
    doc.setTextColor(24,95,165);
    doc.setFont('helvetica','bold');
    doc.setFontSize(8);
    doc.text(s.code, margin+2, y+4);
    doc.setTextColor(50,50,50);
    doc.setFont('helvetica','normal');
    doc.text(s.label, margin+20, y+4);
    doc.setFont('helvetica','bold');
    doc.text(`$${s.montant} M`, margin+contentW-35, y+4);
    doc.setTextColor(24,95,165);
    doc.text(`${s.pct}%`, margin+contentW-8, y+4, {align:'right'});
    y += 6;
  });

  // Total row
  doc.setFillColor(24,95,165);
  doc.rect(margin, y, contentW, 7, 'F');
  doc.setTextColor(255,255,255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.text('TOTAL', margin+2, y+5);
  doc.text(`$${d.total} M`, margin+contentW-35, y+5);
  doc.text('100%', margin+contentW-8, y+5, {align:'right'});
  y += 15;

  // Section: Provinces
  doc.setFillColor(29,158,117);
  doc.rect(margin, y, contentW, 7, 'F');
  doc.setTextColor(255,255,255);
  doc.setFont('helvetica','bold');
  doc.setFontSize(9);
  doc.text('Flux par province (Top 6)', margin+3, y+5);
  y += 11;

  DATA.provinces.slice(0,6).forEach((p,i) => {
    doc.setFillColor(i%2===0?248:255, i%2===0?249:255, i%2===0?251:255);
    doc.rect(margin, y, contentW, 6, 'F');
    doc.setTextColor(50,50,50);
    doc.setFont('helvetica','normal');
    doc.setFontSize(8);
    doc.text(`${i+1}. ${p.name}`, margin+3, y+4);
    doc.text(`SRMNEA: $${p.srmnea}M`, margin+70, y+4);
    doc.text(`Nutrition: $${p.nutrition}M`, margin+105, y+4);
    doc.setFont('helvetica','bold');
    doc.setTextColor(24,95,165);
    doc.text(`Total: $${p.total}M`, margin+contentW-25, y+4);
    y += 6;
  });
  y += 10;

  // Footer
  doc.setFillColor(240,242,245);
  doc.rect(0, 282, W, 15, 'F');
  doc.setFillColor(24,95,165);
  doc.rect(0, 282, W, 1, 'F');
  doc.setTextColor(100,116,139);
  doc.setFont('helvetica','normal');
  doc.setFontSize(7);
  doc.text('PNCNS — Programme National des Comptes Nationaux de la Santé · République Démocratique du Congo', margin, 289);
  doc.text(`DIAKITE BADRA Ali · ali@diakite.be · Version pilote ${yr}`, margin, 293);
  doc.setFont('helvetica','bold');
  doc.setTextColor(24,95,165);
  doc.text('Page 1 / 1', W-margin, 289, {align:'right'});

  doc.save(`PNCNS_Rapport_SHA2011_${yr}.pdf`);
}

