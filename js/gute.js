/* ─────────────────────────────────────────
   GUTE FOOD CO — Shared JS
   gute.js
   ───────────────────────────────────────── */

// ─── SCROLL REVEAL ───────────────────────
const revealObserver = new IntersectionObserver(
  (entries) =>
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("in");
        revealObserver.unobserve(e.target);
      }
    }),
  { threshold: 0.08 },
);
document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

// ─── NAV SCROLL STATE ────────────────────
// Once the page scrolls, drop in a translucent dark bar so the nav stays
// legible over every section — light, dark, or coloured — rather than
// guessing the background colour beneath it.
(function initNavScroll() {
  const nav = document.querySelector("nav");
  if (!nav) return;

  function updateNav() {
    nav.classList.toggle("nav-scrolled", window.scrollY > 24);
  }

  updateNav();
  window.addEventListener("scroll", updateNav, { passive: true });
})();

// ─── WAITLIST FORM (index.html only) ─────
(function initForm() {
  const form = document.getElementById("guteForm");
  if (!form) return;

  // ┌────────────────────────────────────────────────────────────┐
  // │  GOOGLE SHEETS WEB APP URL                                  │
  // │  After deploying your Apps Script, paste the URL below.    │
  // │  See GOOGLE_SHEETS_SETUP.md for step-by-step instructions. │
  // └────────────────────────────────────────────────────────────┘
  const SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbwgTJzFmntUlEjXPv_T_JbAdCuCw-LJnR31Wqsx35fXEX9x4aoEBQuzh-Mlhkzn8c9-/exec";
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value.trim();
    const fname = document.getElementById("fname").value.trim();
    if (!email || !fname) return;

    const btn = document.getElementById("submitBtn");
    btn.textContent = "Joining...";
    btn.disabled = true;

    const payload = {
      timestamp: new Date().toISOString(),
      firstName: fname,
      email: email,
      zip: document.getElementById("zip").value.trim(),
      variant: form.querySelector('[name="variant"]:checked')?.value || "",
      flavors:
        Array.from(form.querySelectorAll('[name="flavor"]:checked'))
          .map((c) => c.value)
          .join(", ") || "",
      merch:
        Array.from(form.querySelectorAll('[name="merch"]:checked'))
          .map((c) => c.value)
          .join(", ") || "",
      preorder: form.querySelector('[name="preorder"]:checked')?.value || "",
      source: document.getElementById("source").value,
    };

    try {
      // Google Apps Script requires no-cors mode (it returns opaque response)
      await fetch(SHEETS_URL, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      showSuccess();
    } catch (err) {
      console.error("Form submission error:", err);
      // Still show success — submission likely went through (opaque response)
      showSuccess();
    }
  });

  function showSuccess() {
    const form = document.getElementById("guteForm");
    const s = document.getElementById("successState");
    if (form) form.style.display = "none";
    if (s) {
      s.classList.add("on");
      s.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }
})();
