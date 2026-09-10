# Welcome email — paste into the Kit automation

**Subject line (pick one):**
- You're in — here's what GÜTE is really about
- Welcome to GÜTE. Good food, no filler.
- Thanks for joining us (here's the honest version)

**Preview text:** A quick hello from the two of us building GÜTE.

---

Hi {{ subscriber.first_name | default: "there" }},

Thanks for joining the GÜTE list — it means a lot this early.

Quick honesty, because that's kind of our whole thing: GÜTE Crunch isn't
on shelves yet. We're a small team getting the details right — a
dark-chocolate snack bar built for your gut, made with ancient grains,
real fruit, and nothing you'd need a chemistry degree to pronounce. Good
food, no filler. We'd rather take the time to do it properly than rush
something we wouldn't eat ourselves.

Here's my promise on email: **I'll only write when there's something real
to share** — when we can finally sell, when the first batch is ready, when
there's a reason to be excited. No spam, no daily "content." A handful of
emails between now and launch, and you'll be the first to know each time.

If you ever have a question, just hit reply — it comes straight to me.

Talk soon,
Benson
Co-founder, The Gute Company

---

*Notes for you (delete before sending):*
- *`{{ subscriber.first_name | default: "there" }}` is Kit's Liquid syntax —
  it inserts the first name, or "there" if we don't have one (popup signups
  only give an email). Confirm the exact tag in Kit's personalization menu.*
- *Kept deliberately pre-launch and honest — no sale dates or "pre-order"
  language while your license is still pending.*
- *Add an unsubscribe link (Kit inserts one automatically) and your mailing
  address in the footer — legally required for marketing email (CAN-SPAM).*
