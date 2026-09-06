# Instagram carousel images

Drop your Instagram photos in **this folder** and they'll appear in the
"Follow along" carousel on the home page automatically.

## How to add posts

1. **Drop image files here.** Straight from your iPhone is fine — `.heic`
   files are converted to web-friendly `.jpg` automatically on build.
   `.jpg`, `.jpeg`, `.png`, and `.webp` also work as-is.
   Square images (~800×800) look best; the carousel crops to a square anyway.

2. **Control the order** by prefixing filenames with numbers:
   `01-batch-day.jpg`, `02-market.jpg`, `03-new-flavor.jpg` …
   (They're listed in filename order.)

3. **(Optional) Link each photo to its real post.** Create a file named
   `links.json` in this folder mapping filename → permalink + alt text:

   ```json
   {
     "01-batch-day.jpg": {
       "link": "https://www.instagram.com/p/ABC123/",
       "alt": "Fresh batch cooling on the rack"
     },
     "02-market.jpg": {
       "link": "https://www.instagram.com/p/DEF456/",
       "alt": "Saturday farmers market booth"
     }
   }
   ```

   To get a permalink: open the post on Instagram → ⋯ menu → **Copy link**.
   Any photo without an entry just links to the @gutefoods profile.

## Notes

- The carousel updates whenever you rebuild (`npm run dev` / `npm run build`).
- Until you add photos here, the carousel falls back to existing brand images.
- Keep files reasonably sized (a few hundred KB each) so the page stays fast.
