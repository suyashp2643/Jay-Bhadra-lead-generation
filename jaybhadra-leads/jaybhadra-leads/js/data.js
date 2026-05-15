// ═══════════════════════════════════════
// js/data.js — Shared Data Store
// All projects & leads live here.
// Add new projects to PROJECTS array.
// ═══════════════════════════════════════

// ── PROJECTS CONFIG ──
// To add a new project, copy a block and fill in details.
const PROJECTS = [
  {
    id: 'golden-city',
    name: 'Golden City',
    location: 'Sangamner',
    units: 66,
    shops: 12,
    status: 'Ongoing',
    color: '#C9922A',
    page: 'projects/golden-city/index.html'
  }
  // ── ADD MORE PROJECTS BELOW ──
  // {
  //   id: 'silver-heights',
  //   name: 'Silver Heights',
  //   location: 'Sangamner',
  //   units: 48,
  //   shops: 0,
  //   status: 'Upcoming',
  //   color: '#7F8C8D',
  //   page: 'projects/silver-heights/index.html'
  // },
];

// ── LEAD SOURCES ──
const SOURCES = [
  { name: 'Website',   color: '#6C3483', icon: '🌐' },
  { name: 'Instagram', color: '#E1306C', icon: '📸' },
  { name: 'Facebook',  color: '#1877F2', icon: '👍' },
  { name: 'WhatsApp',  color: '#25D366', icon: '💬' },
  { name: 'Walk-in',   color: '#C9922A', icon: '🚶' },
];

// ── SCORING ALGORITHM ──
function calcLeadScore(d) {
  let s = 0;
  if      (d.budget === 'Above ₹50L')   s += 35;
  else if (d.budget === '₹35L – ₹50L') s += 35;
  else if (d.budget === '₹20L – ₹35L') s += 25;
  else                                   s += 10;
  if      (d.timeline === 'Within 1 month') s += 40;
  else if (d.timeline === '1–3 months')     s += 30;
  else if (d.timeline === '3–6 months')     s += 15;
  else                                       s += 5;
  s += (d.loan === 'No, self-funded') ? 20 : 10;
  return Math.min(s, 100);
}

function getTier(score) {
  return score >= 75 ? 'Hot' : score >= 45 ? 'Warm' : 'Cold';
}

// ── DEMO LEADS (replace with real backend later) ──
const DEMO_LEADS = [
  { id:1, name:'Rajesh Patil',    phone:'9876543210', project:'golden-city', unit:'2BHK Flat',       budget:'₹35L – ₹50L', timeline:'Within 1 month', loan:'No, self-funded',       source:'Website',   score:95, tier:'Hot',  date:'2025-05-10', notes:'' },
  { id:2, name:'Sunita Deshmukh', phone:'9765432109', project:'golden-city', unit:'3BHK Flat',       budget:'₹35L – ₹50L', timeline:'1–3 months',     loan:'Yes, I need loan help', source:'Instagram', score:70, tier:'Warm', date:'2025-05-11', notes:'' },
  { id:3, name:'Amit Thorat',     phone:'9654321098', project:'golden-city', unit:'Commercial Shop', budget:'Above ₹50L',   timeline:'Within 1 month', loan:'No, self-funded',       source:'Facebook',  score:95, tier:'Hot',  date:'2025-05-12', notes:'' },
  { id:4, name:'Priya Shinde',    phone:'9543210987', project:'golden-city', unit:'2BHK Flat',       budget:'₹20L – ₹35L', timeline:'3–6 months',     loan:'Yes, I need loan help', source:'Website',   score:50, tier:'Warm', date:'2025-05-13', notes:'' },
  { id:5, name:'Vijay Kulkarni',  phone:'9432109876', project:'golden-city', unit:'1BHK Flat',       budget:'Under ₹20L',   timeline:'Just exploring', loan:'Yes, I need loan help', source:'WhatsApp',  score:25, tier:'Cold', date:'2025-05-13', notes:'' },
  { id:6, name:'Meena Jadhav',    phone:'9321098765', project:'golden-city', unit:'2BHK Flat',       budget:'₹35L – ₹50L', timeline:'Within 1 month', loan:'No, self-funded',       source:'Instagram', score:95, tier:'Hot',  date:'2025-05-14', notes:'' },
  { id:7, name:'Santosh Kale',    phone:'9210987654', project:'golden-city', unit:'3BHK Flat',       budget:'Above ₹50L',   timeline:'1–3 months',     loan:'No, self-funded',       source:'Facebook',  score:85, tier:'Hot',  date:'2025-05-14', notes:'' },
];

// ── LEAD STORE (persists to localStorage) ──
const LeadStore = {
  _key: 'jb_leads_v2',
  _pKey: 'jb_projects_v1',

  getLeads() {
    try {
      const saved = localStorage.getItem(this._key);
      return saved ? JSON.parse(saved) : [...DEMO_LEADS];
    } catch(e) { return [...DEMO_LEADS]; }
  },

  saveLeads(leads) {
    try { localStorage.setItem(this._key, JSON.stringify(leads)); } catch(e) {}
  },

  addLead(lead) {
    const leads = this.getLeads();
    const newLead = {
      ...lead,
      id: Date.now(),
      date: new Date().toISOString().split('T')[0],
      score: calcLeadScore(lead),
      tier: getTier(calcLeadScore(lead))
    };
    leads.unshift(newLead);
    this.saveLeads(leads);
    return newLead;
  },

  getProjects() {
    try {
      const saved = localStorage.getItem(this._pKey);
      return saved ? JSON.parse(saved) : [...PROJECTS];
    } catch(e) { return [...PROJECTS]; }
  },

  addProject(project) {
    const projects = this.getProjects();
    projects.push({ ...project, id: project.name.toLowerCase().replace(/\s+/g,'-'), color: '#C9922A' });
    try { localStorage.setItem(this._pKey, JSON.stringify(projects)); } catch(e) {}
  }
};
