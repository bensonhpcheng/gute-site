/* ─────────────────────────────────────────────────────────────
   convert-heic.js
   Converts any .heic files dropped into images/instagram/ into
   web-friendly .jpg (browsers can't render HEIC directly).
   Runs automatically before every build/dev via npm scripts.
   Pure-JS (heic-convert) — no native build tools, works on
   Windows + WSL alike. Already-converted files are skipped.
   ───────────────────────────────────────────────────────────── */
const fs = require("fs");
const path = require("path");

const DIR = path.join(__dirname, "..", "images", "instagram");

(async () => {
  if (!fs.existsSync(DIR)) {
    console.log("[heic] No images/instagram/ folder yet — skipping.");
    return;
  }

  let convert;
  try {
    convert = require("heic-convert");
  } catch (e) {
    console.warn("[heic] 'heic-convert' not installed. Run: npm install");
    return;
  }

  const heics = fs.readdirSync(DIR).filter((f) => /\.heic$/i.test(f));
  if (!heics.length) {
    console.log("[heic] No .heic files to convert.");
    return;
  }

  let done = 0;
  for (const file of heics) {
    const outName = file.replace(/\.heic$/i, ".jpg");
    const outPath = path.join(DIR, outName);
    if (fs.existsSync(outPath)) {
      console.log(`[heic] ${outName} already exists — skipping.`);
      continue;
    }
    try {
      const inputBuffer = fs.readFileSync(path.join(DIR, file));
      const outputBuffer = await convert({
        buffer: inputBuffer,
        format: "JPEG",
        quality: 0.9,
      });
      fs.writeFileSync(outPath, Buffer.from(outputBuffer));
      console.log(`[heic] ${file} -> ${outName}`);
      done++;
    } catch (err) {
      console.error(`[heic] Failed on ${file}:`, err.message);
    }
  }
  console.log(`[heic] Done. Converted ${done} file(s).`);
})();
