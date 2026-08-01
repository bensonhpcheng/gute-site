# GÜTE Crunch — Site

Marketing site for **GÜTE Crunch**, by **The Gute Company** (DBA Gute Foods). Static site built with [Eleventy (11ty)](https://www.11ty.dev/), auto-deployed to GitHub Pages on every push to `main`, served on the custom domain **thegutecompany.com** over HTTPS.

Tagline: _Good food. No filler._

---

## Pages

| Page | Source | URL | Purpose |
|------|--------|-----|---------|
| Home | `index.njk` | `/` | Hero, product overview, two chocolate tiers (Belgium 72% / Date 70%), waitlist form |
| Our Story | `story.njk` | `/story.html` | Founders, the "why", sustainability ("For a Good Cause"), what we built |
| Ingredients | `ingredients.njk` | `/ingredients.html` | Every ingredient as an expandable card (photo header → benefits + citations), Nutrition Facts |
| Function | `function.njk` | `/function.html` | Expandable panels: GLP-1, Nutrient Density, Keto, Low-FODMAP — each cited |
| — | `sitemap.njk` → `/sitemap.xml`, `robots.njk` → `/robots.txt` | SEO |

---

## Project structure

```
gute-site/
├── _includes/
│   └── base.njk           ← shared layout: <head> (SEO/meta/OG/JSON-LD), nav, footer
├── css/gute.css           ← design tokens, nav, footer, marquee, animations, reveal
├── js/gute.js             ← scroll-reveal, nav scroll state, waitlist form handler
├── index.njk              ← Home  (page-specific <style> + content)
├── story.njk              ← Our Story
├── ingredients.njk        ← Ingredients  (+ inline accordion script)
├── function.njk           ← Function  (+ inline accordion script)
├── sitemap.njk / robots.njk
├── images/
│   ├── ingredients/       ← ingredient card photos (oat-flour.jpg, chia-seeds.jpg, …)
│   ├── pageHeaders/       ← hero backgrounds (gute-seal.jpg, 7435.jpg, claims-sticker.png)
│   ├── Panel/             ← "What We Built" panel art (PNG — note capital P)
│   └── core-grains.jpg    ← home bar-core texture
├── google-apps-script/Code.gs   ← waitlist → Google Sheet backend
├── .github/workflows/deploy.yml ← 11ty build + Pages deploy on push to main
├── .eleventy.js           ← input=".", output="_site", passthrough css/js/images/CNAME
├── .eleventyignore        ← skips legacy *.html + _site + node_modules
├── CNAME                  ← thegutecompany.com
└── package.json
```

> **Note on templating:** each page keeps its page-specific CSS in an inline `{% block styles %}`. Only truly shared styles (nav, footer, tokens, animations) live in `css/gute.css`. The expandable-card system (`.ing-*`) is currently duplicated between `ingredients.njk` and `function.njk` — see **Known tech debt** below.

---

## Commands

```bash
cd ~/Projects/gute-site
npm install        # once
npm run dev        # local server + live reload at http://localhost:8080
npm run build      # one-off build to _site/ (what CI runs)
```

## Deploy

Deployment is automatic — **pushing to `main` is the deploy.** GitHub Actions (`.github/workflows/deploy.yml`) runs `npm ci` → `npm run build` → publishes `_site/` to GitHub Pages.

```bash
git add -A
git commit -m "…"
git push          # → Actions builds & deploys (~60–90s) → thegutecompany.com
```

There is **no `npm run prod`**. HTTPS is handled by GitHub Pages (Settings → Pages → Enforce HTTPS) with a Let's Encrypt cert; DNS lives at GoDaddy (apex A records → GitHub IPs, `www` CNAME → `bensonhpcheng.github.io`).

---

## Waitlist form

Lives on the home page (`index.njk`); handler in `js/gute.js` POSTs JSON to a Google Apps Script Web App (`google-apps-script/Code.gs`), which appends a row to the "Waitlist" sheet.

Fields captured: `timestamp`, `firstName`, `email`, `zip`, `variant` (R — Belgium / D — Premium), `flavors[]` (Lemon/Blueberry/Cranberry), `merch[]` (hats/tee/sticker), `preorder`, `source`.

> ⚠️ If you change form fields, update **both** `js/gute.js` (payload) **and** the `COLUMNS` array in `google-apps-script/Code.gs` so the sheet columns stay aligned.

---

## Editing shared elements

| What | File |
|------|------|
| Nav, footer, `<head>` / SEO meta / JSON-LD | `_includes/base.njk` |
| Design tokens (colors, fonts), nav/footer/marquee styles | `css/gute.css` |
| Scroll reveal, nav scroll state, form handler | `js/gute.js` |
| Per-page layout & copy | the page's `.njk` |
| Sheet columns | `google-apps-script/Code.gs` |

---

## Known tech debt

Tracked for a future refactor (see `docs/ARCHITECTURE.html`):

1. **Duplicated card system** — `.ing-card / .ing-header / .ing-expand / .ing-refs` CSS **and** the accordion `<script>` are copied in both `ingredients.njk` and `function.njk`. Extract to `css/gute.css` + `js/gute.js` (mind the small per-page differences in `max-height` / `.ing-body` padding before merging).
2. **Legacy `.html` files** (`index.html`, `story.html`, `ingredients.html`) are superseded by the `.njk` versions and ignored by 11ty — safe to delete.
3. **Image folder naming** is inconsistent (`ingredients/` lowercase vs `pageHeaders/` camelCase vs `Panel/` capitalized). Pick one convention. Paths are case-sensitive on GitHub Pages.
4. **Content/audit items** live in `GUTE_site_audit.md` (Baxter-2022 citation wording, keto framing, supplier-dependent claims).
