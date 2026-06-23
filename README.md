# GUTE Food Co. — Site

Static marketing site for GUTE 001. Built with [11ty](https://www.11ty.dev/), deployed via GitHub Actions → GitHub Pages, with a custom domain on GoDaddy.

---

## Project Structure

```
gute-site/
├── _includes/
│   └── base.njk          ← shared layout (nav + head + footer) — edit once, applies everywhere
├── _site/                ← build output (auto-generated, never edit directly)
├── css/
│   └── gute.css          ← shared design tokens, nav, footer, animations
├── js/
│   └── gute.js           ← shared scroll reveal, nav behavior, form handler
├── google-apps-script/
│   └── Code.gs           ← paste into script.google.com to capture form submissions
├── .github/
│   └── workflows/
│       └── deploy.yml    ← auto-builds + deploys on every push to main
├── index.njk             ← Home page
├── story.njk             ← Our Story page
├── ingredients.njk       ← Ingredients page
├── .eleventy.js          ← 11ty config (input/output dirs, passthrough assets)
├── .eleventyignore       ← tells 11ty to skip old .html files and node_modules
├── CNAME                 ← custom domain for GitHub Pages (gutefoodco.com)
├── package.json          ← npm scripts + dependencies
└── setup.sh              ← one-time git + GitHub repo + Pages setup script
```

---

## CLI Commands

All commands run from inside the project folder in your Ubuntu terminal:

```bash
cd ~/Projects/gute-site
```

### Install dependencies (run once)

```bash
npm install
```

Installs `@11ty/eleventy` into `node_modules/`. You only need to run this once after cloning, or whenever `package.json` changes.

---

### Local development server

```bash
npm run dev
```

- Starts a local server at **http://localhost:8080**
- Watches for file changes and **live-reloads** the browser automatically
- Use this whenever you're editing content or styles

---

### Build for production

```bash
npm run build
```

- Runs 11ty once and outputs the finished site to `_site/`
- This is what GitHub Actions runs automatically on every push
- Run locally to verify the build is clean before pushing

---

### One-time GitHub + Pages setup

```bash
bash setup.sh
```

- Initializes git (if not already done)
- Creates the GitHub repo via the `gh` CLI
- Pushes all files to `main`
- Enables GitHub Pages (via GitHub Actions)

Requires the GitHub CLI: `sudo apt install gh && gh auth login`

---

### Push changes after editing

```bash
git add -A
git commit -m "your message"
git push
```

GitHub Actions picks up the push, builds with 11ty, and deploys to Pages automatically. Takes ~60–90 seconds to go live.

---

## Adding a New Page

1. Create `yourpage.njk` in the project root
2. Add front matter at the top:

```njk
---
title: Page Title — GUTE Food Co.
activePage: yourpage
permalink: /yourpage.html
---
{% extends "base.njk" %}

{% block styles %}
<style>
  /* page-specific CSS here */
</style>
{% endblock %}

{% block content %}
<!-- your HTML here -->
{% endblock %}
```

3. Add a nav link in `_includes/base.njk` if needed
4. `npm run dev` to preview, then `git push` to deploy

---

## Waitlist Form — Field Reference

The form on the homepage (`index.njk`) captures 7 fields. Here's what each one does and where it goes.

### Fields

| Field | Type | Captures | Sheet Column |
|-------|------|----------|-------------|
| First Name | Text input | First name only | First Name |
| Zip Code | Text input (numeric) | 5-digit zip | Zip Code |
| Email | Email input | Email address | Email |
| Which would you try first? | Radio (2 options) | `R&BB — Dark Chocolate` or `D&BB — Date Chocolate` | Variant |
| Format interest? | Radio (3 options) | `The Bar`, `Mix Powder`, or `Both` | Format |
| Would you pre-order? | Radio (3 options) | `Yes`, `Maybe`, or `Just browsing` | Pre-Order Intent |
| How'd you find us? | Dropdown | Farmers Market / Social Media / Friend / Web Search / Other | How They Found Us |

A `Timestamp` (ISO 8601) is added automatically by the form handler.

### How submissions flow

```
User fills form → js/gute.js collects all fields → POST to Google Apps Script URL
→ Code.gs receives JSON → appends a row to the "Waitlist" Google Sheet
```

### Wiring it up (one-time setup)

1. Go to [script.google.com](https://script.google.com) → **New project**
2. Paste the contents of `google-apps-script/Code.gs` (replacing the default code)
3. Save → **Deploy → New Deployment**
   - Type: **Web App**
   - Execute as: **Me**
   - Who has access: **Anyone**
4. Click **Deploy** → copy the Web App URL
5. Open `js/gute.js` and replace `YOUR_APPS_SCRIPT_WEB_APP_URL` with that URL
6. Commit and push:
   ```bash
   git add js/gute.js
   git commit -m "wire up form to Google Sheets"
   git push
   ```

The first submission will auto-create the "Waitlist" sheet with formatted headers.

---

## Deployment — GitHub Pages

The site auto-deploys on every push to `main` via `.github/workflows/deploy.yml`.

### How it works

```
git push → GitHub Actions triggers → npm ci → npm run build
→ _site/ uploaded as artifact → deployed to GitHub Pages
```

### Temporary URL (before custom domain)

```
https://<your-github-username>.github.io/gute-site/
```

> **Note:** Internal nav links use root-relative paths (`/story.html`, `/#reserve`).
> These work correctly on the custom domain. On the subdirectory GitHub Pages URL
> they'll break — connect your GoDaddy domain first (see below) for clean browsing.

---

## Custom Domain — GoDaddy → GitHub Pages

When you're ready to point `gutefoodco.com` at GitHub Pages:

### Step 1 — Add DNS records in GoDaddy

Log in to GoDaddy → DNS → add these records:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | @ | 185.199.108.153 | 600 |
| A | @ | 185.199.109.153 | 600 |
| A | @ | 185.199.110.153 | 600 |
| A | @ | 185.199.111.153 | 600 |
| CNAME | www | `<your-github-username>.github.io` | 3600 |

These are GitHub's Pages IP addresses (confirmed current as of 2026).

### Step 2 — Confirm CNAME file

The `CNAME` file in the repo root already contains `gutefoodco.com`. This tells GitHub Pages what custom domain to serve on. It gets copied to `_site/` automatically on every build.

### Step 3 — Set custom domain in GitHub

Go to your repo on GitHub → **Settings → Pages → Custom domain** → enter `gutefoodco.com` → Save.

Check "**Enforce HTTPS**" once the certificate is issued (usually within 10 minutes of DNS propagation).

### Step 4 — Wait for DNS propagation

DNS changes take anywhere from a few minutes to 48 hours. You can check with:

```bash
dig gutefoodco.com +short
# Should return GitHub's IPs when propagated
```

Once live, `https://gutefoodco.com` serves your site — all root-relative links (`/story.html`, `/#reserve`, etc.) resolve correctly.

---

## Editing Shared Elements

| What | File |
|------|------|
| Nav links / logo | `_includes/base.njk` |
| Footer text / domain | `_includes/base.njk` |
| Design tokens (colors, fonts) | `css/gute.css` |
| Scroll reveal / nav scroll behavior | `js/gute.js` |
| Form fields or submission logic | `index.njk` (HTML) + `js/gute.js` (handler) |
| Google Sheets columns | `google-apps-script/Code.gs` (update `COLUMNS` array) |
| GitHub Actions build | `.github/workflows/deploy.yml` |
