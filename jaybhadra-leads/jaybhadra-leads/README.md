# Jaybhadra Builders — Multi-Project Lead System
**Full lead generation across Website, Instagram, Facebook & WhatsApp**

---

## 📁 Project Structure

```
jaybhadra-leads/
├── index.html                          ← Central dashboard (all leads, all projects)
├── css/
│   └── dashboard.css                   ← Dashboard styles
├── js/
│   ├── data.js                         ← Shared data store + scoring algorithm
│   └── dashboard.js                    ← Dashboard logic
├── projects/
│   └── golden-city/                    ← Golden City landing page
│       ├── index.html
│       ├── css/style.css
│       └── js/project-chat.js
└── README.md
```

**Adding a new project later:**
1. Copy `projects/golden-city/` → rename folder (e.g. `projects/silver-heights/`)
2. Edit `index.html` inside that folder
3. Add project entry to `js/data.js` → `PROJECTS` array
4. Done — leads from new project auto-appear in central dashboard

---

## 🚀 GitHub + Vercel Deployment

### Step 1 — GitHub
1. Go to [github.com](https://github.com) → New repository
2. Name: `jaybhadra-leads` → Public → Create
3. Click **"uploading an existing file"**
4. Upload the entire `jaybhadra-leads` folder contents
5. Commit message: `Launch multi-project lead system`

### Step 2 — Vercel
1. Go to [vercel.com](https://vercel.com) → Sign in with GitHub
2. Click **Add New Project** → Import `jaybhadra-leads`
3. Framework: **Other** → Deploy
4. Your URLs will be:
   - Dashboard: `https://jaybhadra-leads.vercel.app`
   - Golden City: `https://jaybhadra-leads.vercel.app/projects/golden-city`

### Step 3 — Future Updates
Edit any file on GitHub → Vercel auto-deploys in ~30 seconds.

---

## 📸 Instagram Lead Ads Setup

**Goal:** When someone fills a lead form on Instagram, it appears in your dashboard.

### Manual method (start here — free):
1. In your Instagram bio, set link to: `https://jaybhadra-leads.vercel.app/projects/golden-city?src=instagram`
   - The `?src=instagram` tag auto-labels leads as "Instagram" in dashboard
2. In posts/reels, add "Link in bio" call-to-action
3. In Stories, use the "Link" sticker pointing to the same URL

### Instagram Lead Ads (advanced — paid):
1. Go to [facebook.com/business/ads](https://business.facebook.com/ads)
2. Create campaign → **Lead generation** objective
3. Ad set → Placements: **Instagram only**
4. Create **Instant Form** with fields: Name, Phone, Interest (dropdown)
5. Connect to dashboard via **Zapier** (see Zapier section below)

---

## 👍 Facebook Lead Ads Setup

### Manual method (free):
- Share your Golden City page link with `?src=facebook`:
  `https://jaybhadra-leads.vercel.app/projects/golden-city?src=facebook`
- Post this in Facebook groups, your page, and Marketplace

### Facebook Lead Ads (advanced — paid):
1. Go to [facebook.com/business/ads](https://business.facebook.com/ads)
2. Campaign → **Lead generation** objective
3. Target: Location = Sangamner + 30km radius, Age 25–55
4. Budget: ₹300–500/day
5. Use same Instant Form as Instagram

---

## 🔗 Zapier Automation (connects Facebook/Instagram Ads → Dashboard)

When you're ready to automate Facebook/Instagram Lead Ads:

1. Go to [zapier.com](https://zapier.com) → Create Zap
2. **Trigger:** Facebook Lead Ads → New Lead
3. **Action:** Google Sheets → Create Row (free alternative to a database)
4. Sheet columns: Name, Phone, Project, Source, Budget, Timeline, Date
5. Your dashboard can then read from Google Sheets via the Sheets API

**Or use Make.com** (formerly Integromat) — same concept, more generous free tier.

---

## 🌐 Embed on jaybhadrabuilders.com

Add this to any page on your existing website:

```html
<!-- Golden City Enquiry Widget -->
<iframe
  src="https://jaybhadra-leads.vercel.app/projects/golden-city?src=website#chatbot"
  width="100%"
  height="700"
  frameborder="0"
  style="border-radius:12px;max-width:700px;display:block;margin:0 auto"
  title="Golden City Enquiry">
</iframe>
```

Or just link to it from your website's project page.

---

## 💬 WhatsApp Business Setup

1. Download **WhatsApp Business** app on 9130711811
2. Settings → Quick Replies → Add these shortcuts:
   - `/hot` → Hot Lead template
   - `/warm` → Warm Lead template
   - `/cold` → Cold Lead template
3. For walk-in leads: use **"+ Add Lead"** button in dashboard to log manually

---

## 📊 How Lead Scoring Works

| Factor | Points |
|--------|--------|
| Budget: Above ₹50L or ₹35-50L | 35 pts |
| Budget: ₹20-35L | 25 pts |
| Budget: Under ₹20L | 10 pts |
| Timeline: Within 1 month | 40 pts |
| Timeline: 1-3 months | 30 pts |
| Timeline: 3-6 months | 15 pts |
| Timeline: Just exploring | 5 pts |
| Self-funded (no loan) | 20 pts |
| Needs loan | 10 pts |

- **Hot** = 75–100 pts → Call immediately
- **Warm** = 45–74 pts → Follow up within 2 hrs
- **Cold** = 0–44 pts → Nurture over time

To change scoring, edit `calcLeadScore()` in `js/data.js`.

---

## ✏️ Quick Customization Reference

| What | Where |
|------|-------|
| Add new project | `js/data.js` → `PROJECTS` array |
| Change phone number | Search `9130711811` in all files |
| Change WhatsApp templates | Dashboard → Templates section |
| Change scoring weights | `js/data.js` → `calcLeadScore()` |
| Add new chat questions | `projects/golden-city/js/project-chat.js` → `QUESTIONS` |
| Colors / fonts | `css/dashboard.css` or `projects/golden-city/css/style.css` |
| Facebook Pixel ID | `projects/golden-city/index.html` → replace `YOUR_PIXEL_ID` |

---

## 📞 Support
Jaybhadra Builders · 9130711811 · jaybhadrabuilders.com
