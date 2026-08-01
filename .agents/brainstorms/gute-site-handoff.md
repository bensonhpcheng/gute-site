# GÜTE Site — Session Handoff

> Dense state snapshot to resume work in a fresh chat with zero context loss. Static marketing site, live + secure.

## Project
- **Product:** GÜTE Crunch — functional dark-chocolate snack bar. Company: **The Gute Company** (DBA Gute Foods). Founders: **Li** & **Benson** (food-safety pros; certs on About page).
- **Stack:** Eleventy (11ty) → GitHub Actions → GitHub Pages. Repo `bensonhpcheng/gute-site`, branch `main`. **Push = deploy.**
- **Live:** `https://thegutecompany.com` (HTTPS live, Let's Encrypt). DNS at GoDaddy (apex A → GitHub IPs, `www` CNAME → `bensonhpcheng.github.io`). `CNAME` = thegutecompany.com. (Old `gutefoodco.com` retired, not redirected.)
- **Source of truth:** `.njk` files (base.njk layout + index/story/ingredients/function + robots/sitemap). Legacy `.html` files are dead (eleventyignored).

## Product facts (canonical — keep consistent)
- Two shells: **Belgium 72% dark (variant R)** and **Premium Date-sweetened 70% "Just Date" (variant D)**. 3 flavors: **Lemon · Blueberry · Cranberry**.
- Per 42g serving: **10g fiber, 6g protein**, ~10–11g net carbs. Belgium NFP: 230 cal, 7g added sugar. Date NFP: 220 cal, **0g added sugar**.
- **5 FDA-recognized fibers:** oat bran (β-glucan), green banana (RS2), **cassava** (resistant dextrin — was "tapioca"), acacia (gum arabic), psyllium. **Removed from formula: inulin, sprouted lentil.**
- 7 ancient grains & seeds: oat, millet, sorghum, quinoa, teff, chia, flax. Dual protein: pea + rice.
- Claims: Gluten-free, Vegan, Low-FODMAP **(Belgium only — dates are high-FODMAP)**, Keto-friendly **(net-carb rationale, cited)**, GLP-1 support, "No sugar added" **(Premium only)**, "Formulated without major allergens" **(Premium)**. Artisanal/small-batch (not "hand-stamped" as focus).

## Decisions locked
- **GÜTE** always carries the umlaut (brand). Legal footer line stays un-umlauted ("The Gute Company, DBA Gute Foods").
- **cassava** everywhere consumer-facing (not tapioca) — EXCEPT the FDA GRN 1045 citation should say "tapioca" (official notice title). ← still to revert.
- Function page = purple hero; Ingredients page = green hero (swapped). Story hero = chocolate + circular GÜTE seal beside the headline.
- GLP-1 content lives on **Function** page (moved off Ingredients). Nutrition Facts panel sits **under the stats strip** on Ingredients, Date variant default.
- Ingredient cards: photo is the **collapsed background**; expands to benefits + citations (JS reads each card's `.ing-photo` src → header bg).

## Images
- `images/pageHeaders/`: gute-seal.jpg, 7435.jpg, claims-sticker.png. `images/Panel/` (capital P, PNG): good-ingredients / good-gut / plant-protein / freeze-dried-fruit. `images/ingredients/*.jpg` (19 ingredient photos). `images/core-grains.jpg` (home bar core).
- **In progress:** user regenerating ingredient photos as **raw whole foods** (not powders) via GPT, one grid image, recommended crop **~3:2 landscape** to fit card headers. Save over existing filenames.
- **Missing:** `images/gute-og.jpg` (1200×630 social/OG + JSON-LD logo), `favicon.ico`, `apple-touch-icon.png`. Referenced but not yet added (graceful, no breakage).

## Open / next
- 🔴 **Audit fixes still pending** (see `GUTE_site_audit.md` in outputs): **Baxter 2022 citation** (function.njk GLP panel + ingredients green-banana card) claims butyrate/Bifido/Akkermansia→GLP-1 the study didn't show — reword or re-source. (Keto now substantiated ✓.)
- 🟠 Revert **GRN 1045** citation wording cassava→tapioca. Legal review of **"no sugar added at all."** Confirm gluten-free/vegan/allergen with supplier specs.
- 🟠 **Apps Script `Code.gs` COLUMNS** must match current form payload (added flavors[]/merch[]).
- Tech debt (see `docs/ARCHITECTURE.html`): duplicated card CSS+JS across ingredients/function → extract to gute.css/gute.js; delete legacy `.html`; unify image-folder casing; `git rm` old image remnants (`images/product`, `images/stickers`, `images/gute-seal.jpg`).
- "17 Total Ingredients" stat on Ingredients likely → 18 (Acacia added).

## Deploy cmd
```bash
cd ~/Projects/gute-site && git add -A && git commit -m "…" && git push
```
