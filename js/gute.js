/* ─────────────────────────────────────────
   GUTE FOOD CO — Shared JS
   gute.js
   ───────────────────────────────────────── */

// ─── SCROLL REVEAL ───────────────────────
const revealObserver = new IntersectionObserver(
    entries => entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
    }),
    { threshold: 0.08 }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ─── NAV COLOR SHIFT ON SCROLL ───────────
(function initNavScroll() {
    const logo   = document.getElementById('navLogo');
    const cta    = document.getElementById('navCta');
    const link1  = document.getElementById('navLink1');
    const link2  = document.getElementById('navLink2');

    // Some pages start on a light background — detect hero presence
    const hasHero = !!document.querySelector('.hero, .page-hero');

    function updateNav() {
        // On pages without a dark hero, nav is always light-on-parchment
        const threshold = hasHero ? window.innerHeight * 0.82 : 0;
        const past = window.scrollY > threshold;

        const textColor   = past ? 'var(--dark)'       : 'var(--parchment)';
        const borderColor = past ? 'rgba(22,10,4,0.2)' : 'rgba(240,230,208,0.4)';

        if (logo)  logo.style.color = textColor;
        if (cta)  { cta.style.color = textColor; cta.style.borderColor = borderColor; }
        if (link1) link1.style.color = textColor;
        if (link2) link2.style.color = textColor;
    }

    // Pages without a dark hero start with dark nav text
    if (!hasHero) updateNav();

    window.addEventListener('scroll', updateNav, { passive: true });
})();

// ─── WAITLIST FORM (index.html only) ─────
(function initForm() {
    const form = document.getElementById('guteForm');
    if (!form) return;

    // ┌────────────────────────────────────────────────────────────┐
    // │  GOOGLE SHEETS WEB APP URL                                  │
    // │  After deploying your Apps Script, paste the URL below.    │
    // │  See GOOGLE_SHEETS_SETUP.md for step-by-step instructions. │
    // └────────────────────────────────────────────────────────────┘
    const SHEETS_URL = 'YOUR_APPS_SCRIPT_WEB_APP_URL';

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value.trim();
        const fname = document.getElementById('fname').value.trim();
        if (!email || !fname) return;

        const btn = document.getElementById('submitBtn');
        btn.textContent = 'Joining...';
        btn.disabled = true;

        const payload = {
            timestamp: new Date().toISOString(),
            firstName: fname,
            email:     email,
            zip:       document.getElementById('zip').value.trim(),
            variant:   form.querySelector('[name="variant"]:checked')?.value || '',
            format:    form.querySelector('[name="format"]:checked')?.value || '',
            preorder:  form.querySelector('[name="preorder"]:checked')?.value || '',
            source:    document.getElementById('source').value,
        };

        try {
            // Google Apps Script requires no-cors mode (it returns opaque response)
            await fetch(SHEETS_URL, {
                method: 'POST',
                mode:   'no-cors',
                headers: { 'Content-Type': 'application/json' },
                body:   JSON.stringify(payload),
            });
            showSuccess();
        } catch (err) {
            console.error('Form submission error:', err);
            // Still show success — submission likely went through (opaque response)
            showSuccess();
        }
    });

    function showSuccess() {
        const form = document.getElementById('guteForm');
        const s    = document.getElementById('successState');
        if (form) form.style.display = 'none';
        if (s)  { s.classList.add('on'); s.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
    }
})();
