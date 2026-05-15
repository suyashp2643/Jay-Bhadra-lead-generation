// ═══════════════════════════════════════
// projects/golden-city/js/project-chat.js
// Chatbot for Golden City landing page.
// Saves lead to shared localStorage store
// so it appears in the central dashboard.
// ═══════════════════════════════════════

const PROJECT_ID = 'golden-city';
const WA_NUMBER  = '919130711811';

const STEPS = ['unit', 'name', 'phone', 'budget', 'timeline', 'loan'];
const QUESTIONS = {
  unit:     { q: 'What are you looking for?',               opts: ['2BHK Flat','3BHK Flat','1BHK Flat','Commercial Shop'] },
  name:     { q: 'Great! May I know your good name?',       opts: [] },
  phone:    { q: 'Thank you! Your WhatsApp number please?', opts: [] },
  budget:   { q: 'What is your approximate budget?',        opts: ['Under ₹20L','₹20L – ₹35L','₹35L – ₹50L','Above ₹50L'] },
  timeline: { q: 'When are you planning to buy?',           opts: ['Within 1 month','1–3 months','3–6 months','Just exploring'] },
  loan:     { q: 'Will you need home loan assistance?',     opts: ['Yes, I need loan help','No, self-funded'] },
};

let step = 0;
let data = {};
// Detect source from URL param (?src=instagram / facebook / website)
const urlSrc = new URLSearchParams(window.location.search).get('src') || 'Website';
const SOURCE  = urlSrc.charAt(0).toUpperCase() + urlSrc.slice(1);

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

function startChat(unit) {
  document.getElementById('chatbot').scrollIntoView({ behavior: 'smooth' });
  if (unit) setTimeout(() => selectOption(null, unit, true), 800);
}

function selectOption(el, val, skipHighlight) {
  if (!skipHighlight && el) {
    document.querySelectorAll('.chat-opt').forEach(b => b.classList.remove('selected'));
    el.classList.add('selected');
  }
  data[STEPS[step]] = val;
  appendMsg('user', val);
  document.getElementById('chatOptions').innerHTML = '';
  step++;

  setTimeout(() => {
    if (step < STEPS.length) {
      const key = STEPS[step];
      showTyping(() => {
        removeTyping();
        appendMsg('bot', QUESTIONS[key].q);
        if (QUESTIONS[key].opts.length) {
          showOptions(QUESTIONS[key].opts);
          document.getElementById('chatInput').placeholder = 'Or type here...';
        } else {
          document.getElementById('chatInput').placeholder =
            key === 'phone' ? 'Enter 10-digit WhatsApp number...' : 'Type your name...';
          document.getElementById('chatInput').focus();
        }
      });
    } else {
      showTyping(() => { removeTyping(); finishChat(); });
    }
  }, 600);
}

function sendMsg() {
  const inp = document.getElementById('chatInput');
  const val = inp.value.trim();
  if (!val) return;
  const key = STEPS[step];
  if (key === 'phone' && !/^[6-9]\d{9}$/.test(val.replace(/\s/g,''))) {
    appendMsg('bot', 'Please enter a valid 10-digit Indian mobile number 📱');
    return;
  }
  inp.value = '';
  selectOption(null, val, true);
}

function showTyping(cb) {
  const msgs = document.getElementById('chatMessages');
  const t = document.createElement('div');
  t.className = 'msg bot'; t.id = 'typingMsg';
  t.innerHTML = '<div class="msg-bubble typing"><span></span><span></span><span></span></div>';
  msgs.appendChild(t); msgs.scrollTop = msgs.scrollHeight;
  setTimeout(cb, 1200);
}
function removeTyping() { document.getElementById('typingMsg')?.remove(); }

function showOptions(opts) {
  const c = document.getElementById('chatOptions');
  c.innerHTML = '';
  opts.forEach(o => {
    const b = document.createElement('button');
    b.className = 'chat-opt'; b.textContent = o;
    b.onclick = () => selectOption(b, o);
    c.appendChild(b);
  });
}

function appendMsg(type, text) {
  const msgs = document.getElementById('chatMessages');
  const d = document.createElement('div');
  d.className = 'msg ' + type;
  const now = new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' });
  d.innerHTML = `<div class="msg-bubble">${text}</div><div class="msg-time">${now}</div>`;
  msgs.appendChild(d); msgs.scrollTop = msgs.scrollHeight;
}

function calcScore(d) {
  let s = 0;
  if      (d.budget === 'Above ₹50L')   s += 35;
  else if (d.budget === '₹35L – ₹50L') s += 35;
  else if (d.budget === '₹20L – ₹35L') s += 25;
  else                                   s += 10;
  if      (d.timeline === 'Within 1 month') s += 40;
  else if (d.timeline === '1–3 months')     s += 30;
  else if (d.timeline === '3–6 months')     s += 15;
  else                                       s += 5;
  s += d.loan === 'No, self-funded' ? 20 : 10;
  return Math.min(s, 100);
}

function saveLead(lead) {
  // Save to shared key — readable by dashboard
  try {
    const key   = 'jb_leads_v2';
    const saved = localStorage.getItem(key);
    const leads = saved ? JSON.parse(saved) : [];
    leads.unshift(lead);
    localStorage.setItem(key, JSON.stringify(leads));
  } catch(e) {}
}

function finishChat() {
  const score = calcScore(data);
  const tier  = score >= 75 ? 'Hot' : score >= 45 ? 'Warm' : 'Cold';
  const tierLabel = score >= 75 ? '🔥 Hot' : score >= 45 ? '🌤 Warm' : '❄ Cold';

  // Save to central dashboard store
  saveLead({
    id:       Date.now(),
    name:     data.name,
    phone:    data.phone,
    project:  PROJECT_ID,
    unit:     data.unit,
    budget:   data.budget,
    timeline: data.timeline,
    loan:     data.loan,
    source:   SOURCE,
    score,
    tier,
    date:     new Date().toISOString().split('T')[0],
    notes:    ''
  });

  // Fire Facebook Pixel Lead event
  if (typeof fbq !== 'undefined') fbq('track', 'Lead');

  const waLink = `https://wa.me/${WA_NUMBER}?text=Hi%2C%20I%20am%20${encodeURIComponent(data.name)}%2C%20interested%20in%20Golden%20City%20Sangamner.%20Looking%20for%3A%20${encodeURIComponent(data.unit)}%2C%20Budget%3A%20${encodeURIComponent(data.budget)}%2C%20Timeline%3A%20${encodeURIComponent(data.timeline)}`;

  appendMsg('bot', `Thank you <b>${data.name} ji</b>! 🙏<br>Your enquiry has been registered as <b>${tierLabel}</b>.<br>Our team will contact you on <b>${data.phone}</b> shortly.`);

  setTimeout(() => {
    appendMsg('bot', `<a href="${waLink}" target="_blank" style="display:inline-block;background:#25D366;color:white;padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600;font-size:0.88rem;margin-top:4px">💬 Connect on WhatsApp Now</a>`);
  }, 800);
}

// Scroll & nav
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1 });
document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
window.addEventListener('scroll', () => {
  const nav = document.getElementById('navbar');
  if (nav) nav.style.boxShadow = window.scrollY > 20 ? '0 2px 20px rgba(0,0,0,0.4)' : 'none';
});
