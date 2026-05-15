// ═══════════════════════════════════════
// js/dashboard.js — Dashboard Logic
// ═══════════════════════════════════════

let activeProject = 'all';
let leads = [];
let projects = [];

function init() {
  leads    = LeadStore.getLeads();
  projects = LeadStore.getProjects();
  renderSidebar();
  renderMetrics();
  renderCharts();
  renderTable();
  populateFilters();
}

// ── SIDEBAR ──
function renderSidebar() {
  const nav = document.getElementById('projectNav');
  if (!nav) return;
  nav.innerHTML = `
    <div class="project-nav-item ${activeProject==='all'?'active':''}" onclick="setProject('all')">
      <div class="dot" style="background:#aaa"></div> All Projects
    </div>` +
    projects.map(p => `
    <div class="project-nav-item ${activeProject===p.id?'active':''}" onclick="setProject('${p.id}')">
      <div class="dot" style="background:${p.color}"></div> ${p.name}
    </div>`).join('');

  const src = document.getElementById('sourceNav');
  if (src) {
    src.innerHTML = SOURCES.map(s => `
      <div class="source-item" onclick="setSource('${s.name}')">
        <div class="source-dot" style="background:${s.color}"></div>
        ${s.icon} ${s.name}
        <span style="margin-left:auto;font-size:0.75rem;color:rgba(255,255,255,0.4)">
          ${leads.filter(l=>l.source===s.name).length}
        </span>
      </div>`).join('');
  }
}

function setProject(id) {
  activeProject = id;
  document.getElementById('filterProject').value = id;
  applyFilters();
  renderSidebar();
}

function setSource(src) {
  document.getElementById('filterSource').value = src;
  applyFilters();
}

// ── METRICS ──
function renderMetrics() {
  const row = document.getElementById('metricsRow');
  if (!row) return;
  const filtered = getFiltered();
  const hot  = filtered.filter(l=>l.tier==='Hot').length;
  const warm = filtered.filter(l=>l.tier==='Warm').length;
  const cold = filtered.filter(l=>l.tier==='Cold').length;
  const ig   = filtered.filter(l=>l.source==='Instagram').length;
  const fb   = filtered.filter(l=>l.source==='Facebook').length;
  const web  = filtered.filter(l=>l.source==='Website').length;
  row.innerHTML = `
    <div class="metric-card"><div class="mn">${filtered.length}</div><div class="ml">Total Leads</div><div class="mt">All sources</div></div>
    <div class="metric-card hot-card"><div class="mn">${hot}</div><div class="ml">🔥 Hot Leads</div><div class="mt">Ready to buy</div></div>
    <div class="metric-card warm-card"><div class="mn">${warm}</div><div class="ml">🌤 Warm Leads</div><div class="mt">Follow-up needed</div></div>
    <div class="metric-card cold-card"><div class="mn">${cold}</div><div class="ml">❄ Cold Leads</div><div class="mt">Nurture later</div></div>
    <div class="metric-card"><div class="mn" style="color:var(--ig)">${ig}</div><div class="ml">📸 Instagram</div><div class="mt">Leads captured</div></div>
    <div class="metric-card"><div class="mn" style="color:var(--fb)">${fb}</div><div class="ml">👍 Facebook</div><div class="mt">Leads captured</div></div>
    <div class="metric-card"><div class="mn" style="color:var(--web)">${web}</div><div class="ml">🌐 Website</div><div class="mt">Leads captured</div></div>`;
}

// ── CHARTS ──
function renderCharts() {
  const filtered = getFiltered();
  // Source bars
  const srcEl = document.getElementById('sourceBars');
  if (srcEl) {
    const max = Math.max(1, ...SOURCES.map(s => filtered.filter(l=>l.source===s.name).length));
    srcEl.innerHTML = SOURCES.map(s => {
      const count = filtered.filter(l=>l.source===s.name).length;
      return `<div class="bar-row">
        <div class="bar-label">${s.icon} ${s.name}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(count/max)*100}%;background:${s.color}"></div></div>
        <div class="bar-count">${count}</div>
      </div>`;
    }).join('');
  }

  // Project bars
  const prjEl = document.getElementById('projectBars');
  if (prjEl) {
    const maxP = Math.max(1, ...projects.map(p => filtered.filter(l=>l.project===p.id).length));
    prjEl.innerHTML = projects.map(p => {
      const count = filtered.filter(l=>l.project===p.id).length;
      return `<div class="bar-row">
        <div class="bar-label">🏙 ${p.name}</div>
        <div class="bar-track"><div class="bar-fill" style="width:${(count/maxP)*100}%;background:${p.color}"></div></div>
        <div class="bar-count">${count}</div>
      </div>`;
    }).join('');
  }

  // Score dist
  const distEl = document.getElementById('scoreDist');
  if (distEl) {
    const total = filtered.length || 1;
    const hot  = filtered.filter(l=>l.tier==='Hot').length;
    const warm = filtered.filter(l=>l.tier==='Warm').length;
    const cold = filtered.filter(l=>l.tier==='Cold').length;
    distEl.innerHTML = `
      <div class="dist-row"><div class="dist-label"><span style="color:var(--hot)">🔥</span> Hot</div><div class="dist-pct">${hot} (${Math.round(hot/total*100)}%)</div></div>
      <div class="dist-row"><div class="dist-label"><span style="color:var(--warm)">🌤</span> Warm</div><div class="dist-pct">${warm} (${Math.round(warm/total*100)}%)</div></div>
      <div class="dist-row"><div class="dist-label"><span style="color:var(--cold)">❄</span> Cold</div><div class="dist-pct">${cold} (${Math.round(cold/total*100)}%)</div></div>
      <div style="margin-top:0.8rem;height:10px;border-radius:5px;overflow:hidden;display:flex">
        <div style="width:${hot/total*100}%;background:var(--hot)"></div>
        <div style="width:${warm/total*100}%;background:var(--warm)"></div>
        <div style="width:${cold/total*100}%;background:var(--cold)"></div>
      </div>`;
  }
}

// ── TABLE ──
function renderTable() {
  const body = document.getElementById('leadsBody');
  if (!body) return;
  const list = getFiltered();
  if (!list.length) {
    body.innerHTML = `<tr><td colspan="11" style="text-align:center;padding:2rem;color:var(--muted)">No leads found</td></tr>`;
    return;
  }
  const pMap = Object.fromEntries(projects.map(p=>[p.id, p.name]));
  body.innerHTML = list.map(l => {
    const waLink = `https://wa.me/91${l.phone.replace(/\D/g,'')}?text=Namaste%20${encodeURIComponent(l.name)}%20ji!%20Regarding%20Golden%20City%20Sangamner.`;
    return `<tr>
      <td style="font-weight:500">${l.name}</td>
      <td>${l.phone}</td>
      <td><span style="font-size:0.8rem;color:var(--mid)">${pMap[l.project]||l.project}</span></td>
      <td>${l.unit}</td>
      <td>${l.budget}</td>
      <td>${l.timeline}</td>
      <td><span class="source-badge ${l.source}">${l.source}</span></td>
      <td><div class="score-bar"><div class="score-track"><div class="score-fill" style="width:${l.score}%"></div></div><span class="score-num">${l.score}</span></div></td>
      <td><span class="badge ${l.tier.toLowerCase()}">${l.tier}</span></td>
      <td style="color:var(--muted)">${l.date}</td>
      <td><button class="action-btn" onclick="window.open('${waLink}','_blank')">WhatsApp</button></td>
    </tr>`;
  }).join('');
}

function getFiltered() {
  const proj = document.getElementById('filterProject')?.value || 'all';
  const src  = document.getElementById('filterSource')?.value  || 'all';
  const tier = document.getElementById('filterTier')?.value    || 'all';
  return leads.filter(l =>
    (proj === 'all' || l.project === proj) &&
    (src  === 'all' || l.source  === src)  &&
    (tier === 'all' || l.tier    === tier)
  );
}

function applyFilters() {
  renderMetrics();
  renderCharts();
  renderTable();
}

function populateFilters() {
  const sel = document.getElementById('filterProject');
  if (!sel) return;
  projects.forEach(p => {
    const o = document.createElement('option');
    o.value = p.id; o.textContent = p.name;
    sel.appendChild(o);
  });
  if (activeProject !== 'all') sel.value = activeProject;

  const ml = document.getElementById('ml_project');
  if (ml) {
    projects.forEach(p => {
      const o = document.createElement('option');
      o.value = p.id; o.textContent = p.name;
      ml.appendChild(o);
    });
  }
}

// ── MODALS ──
function showAddLead()    { openModal('addLeadModal'); }
function showAddProject() { openModal('addProjectModal'); }
function showEmbedCode()  {
  const code = `<!-- Jaybhadra Builders — Golden City Enquiry Widget -->
<iframe
  src="https://YOUR-VERCEL-URL/projects/golden-city/index.html#chatbot"
  width="100%"
  height="700"
  frameborder="0"
  style="border-radius:12px;max-width:700px;display:block;margin:0 auto"
  title="Golden City Enquiry">
</iframe>`;
  document.getElementById('embedCodeBlock').textContent = code;
  openModal('embedModal');
}

function openModal(id)  { document.getElementById(id)?.classList.add('open'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('open'); }

function copyEmbedCode() {
  const code = document.getElementById('embedCodeBlock').textContent;
  navigator.clipboard.writeText(code).then(() => {
    const btn = document.querySelector('#embedModal .modal-save');
    if (btn) { btn.textContent = '✓ Copied!'; setTimeout(() => btn.textContent = 'Copy Code', 1800); }
  });
}

function saveManualLead() {
  const name  = document.getElementById('ml_name').value.trim();
  const phone = document.getElementById('ml_phone').value.trim();
  if (!name || !phone) { alert('Name and phone are required.'); return; }
  const lead = {
    name, phone,
    project:  document.getElementById('ml_project').value,
    source:   document.getElementById('ml_source').value,
    unit:     document.getElementById('ml_unit').value,
    budget:   document.getElementById('ml_budget').value,
    timeline: document.getElementById('ml_timeline').value,
    loan:     document.getElementById('ml_loan').value,
    notes:    document.getElementById('ml_notes').value,
  };
  LeadStore.addLead(lead);
  leads = LeadStore.getLeads();
  closeModal('addLeadModal');
  renderSidebar(); renderMetrics(); renderCharts(); renderTable();
  // Reset form
  ['ml_name','ml_phone','ml_notes'].forEach(id => document.getElementById(id).value = '');
}

function saveNewProject() {
  const name     = document.getElementById('np_name').value.trim();
  const location = document.getElementById('np_location').value.trim();
  if (!name) { alert('Project name is required.'); return; }
  LeadStore.addProject({
    name, location,
    units:  parseInt(document.getElementById('np_units').value) || 0,
    status: document.getElementById('np_status').value,
    page:   `projects/${name.toLowerCase().replace(/\s+/g,'-')}/index.html`
  });
  projects = LeadStore.getProjects();
  closeModal('addProjectModal');
  renderSidebar(); populateFilters();
  ['np_name','np_location','np_units'].forEach(id => document.getElementById(id).value = '');
}

// ── EXPORT CSV ──
function exportCSV() {
  const list = getFiltered();
  const headers = ['Name','Phone','Project','Interest','Budget','Timeline','Source','Score','Status','Date','Notes'];
  const rows = list.map(l => [
    l.name, l.phone, l.project, l.unit, l.budget,
    l.timeline, l.source, l.score, l.tier, l.date, l.notes||''
  ].map(v => `"${v}"`).join(','));
  const csv = [headers.join(','), ...rows].join('\n');
  const a = document.createElement('a');
  a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
  a.download = `jaybhadra-leads-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
}

// ── INIT ──
document.addEventListener('DOMContentLoaded', init);
