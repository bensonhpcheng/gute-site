/* ─────────────────────────────────────────────────────────────
   _data/instagram.js
   Auto-builds the home-page Instagram carousel from whatever
   image files live in images/instagram/.
   - Renderable files (.jpg/.jpeg/.png/.webp) are listed in
     filename order — prefix names with 01-, 02-, ... to control it.
   - .heic files are ignored here (they get converted to .jpg first
     by scripts/convert-heic.js, and the .jpg is what gets listed).
   - Optional images/instagram/links.json maps a filename to its
     post permalink + alt text, e.g.:
       {
         "01-batch-day.jpg": {
           "link": "https://www.instagram.com/p/ABC123/",
           "alt": "Fresh batch cooling on the rack"
         }
       }
     Anything without an entry defaults to the @gutefoods profile.
   Available in templates as the `instagram` global.
   ───────────────────────────────────────────────────────────── */
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "images", "instagram");
const WEB_EXT = new Set([".jpg", ".jpeg", ".png", ".webp"]);
const PROFILE = "https://www.instagram.com/gutefoods";

module.exports = function () {
  if (!fs.existsSync(DIR)) return [];

  let links = {};
  const linksPath = path.join(DIR, "links.json");
  if (fs.existsSync(linksPath)) {
    try {
      links = JSON.parse(fs.readFileSync(linksPath, "utf8"));
    } catch (e) {
      console.warn("[instagram] links.json is not valid JSON — ignoring it.");
    }
  }

  return fs
    .readdirSync(DIR)
    .filter((f) => WEB_EXT.has(path.extname(f).toLowerCase()))
    .sort()
    .map((f) => {
      const meta = links[f] || {};
      return {
        img: `/images/instagram/${f}`,
        link: meta.link || PROFILE,
        alt: meta.alt || "GÜTE on Instagram",
      };
    });
};
