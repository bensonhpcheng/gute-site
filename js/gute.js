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

// ─── EMAIL CAPTURE POPUP ─────────────────
// Shows once per visitor after ~12s of browsing OR on exit-intent
// (cursor leaving the top of the window), whichever comes first.
// Submits to the same Google Sheet as the waitlist, tagged source
// "Email Popup". Suppressed after it's shown, via localStorage.
(function initPopup() {
  const overlay = document.getElementById("gmOverlay");
  if (!overlay) return;

  const SHEETS_URL =
    "https://script.google.com/macros/s/AKfycbwgTJzFmntUlEjXPv_T_JbAdCuCw-LJnR31Wqsx35fXEX9x4aoEBQuzh-Mlhkzn8c9-/exec";
  const SEEN_KEY = "gute_popup_seen";
  const DELAY_MS = 12000;

  // Respect prior visits (localStorage may throw in some contexts — guard it).
  let seen = false;
  try {
    seen = localStorage.getItem(SEEN_KEY) === "1";
  } catch (e) {}
  if (seen) return;

  const modal = overlay.querySelector(".gm-modal");
  const form = document.getElementById("gmForm");
  const input = document.getElementById("gmEmail");
  const btn = document.getElementById("gmBtn");
  const closeBtn = document.getElementById("gmClose");

  let opened = false;
  let delayTimer = null;

  function markSeen() {
    try {
      localStorage.setItem(SEEN_KEY, "1");
    } catch (e) {}
  }

  function open() {
    if (opened) return;
    opened = true;
    markSeen(); // once per visitor, whether or not they subscribe
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    cleanupTriggers();
    setTimeout(() => input && input.focus(), 420);
  }

  function close() {
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
  }

  // ── Triggers ──
  function onExitIntent(e) {
    // Cursor leaving through the top edge of the viewport.
    if (e.clientY <= 0) open();
  }
  function cleanupTriggers() {
    if (delayTimer) clearTimeout(delayTimer);
    document.removeEventListener("mouseout", onExitIntent);
  }
  delayTimer = setTimeout(open, DELAY_MS);
  document.addEventListener("mouseout", onExitIntent);

  // ── Dismissal ──
  closeBtn && closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay.classList.contains("is-open")) close();
  });

  // ── Submit ──
  form &&
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const email = (input.value || "").trim();
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!valid) {
        input.classList.add("gm-invalid");
        input.focus();
        return;
      }
      input.classList.remove("gm-invalid");
      btn.textContent = "Joining...";
      btn.disabled = true;

      const payload = {
        timestamp: new Date().toISOString(),
        firstName: "",
        email: email,
        zip: "",
        variant: "",
        flavors: "",
        merch: "",
        preorder: "",
        source: "Email Popup",
      };

      try {
        await fetch(SHEETS_URL, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } catch (err) {
        console.error("Popup submission error:", err);
      }
      markSeen();
      modal.classList.add("is-done"); // swap to success state
    });
})();
