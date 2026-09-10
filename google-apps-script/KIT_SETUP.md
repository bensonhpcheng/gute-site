# Kit (ConvertKit) setup — GÜTE mailing list

This connects your website signups to Kit so every subscriber gets an
automatic welcome email, and you can send occasional broadcasts later.
Your Google Sheet stays as a backup — nothing you already have breaks.

Do these steps in order. Total time: ~20 minutes.

---

## 1. Create your Kit account

1. Go to **kit.com** and sign up (choose the free **Newsletter** plan —
   free up to 10,000 subscribers).
2. Set your **From name** to `GÜTE` (or `Benson at GÜTE`) and your
   **From email** to an address you control.
3. Recommended: authenticate your sending domain (Settings → Email →
   Sending domains) so emails land in inboxes, not spam. If you use
   `thegutecompany.com` email, add the DNS records they give you at GoDaddy.
   (You can skip this to start and add it before your first big send.)

---

## 2. Create custom fields

Settings → **Custom Fields** → add these four (exact lowercase keys):

| Field key | What it stores            |
|-----------|---------------------------|
| `source`  | popup vs. waitlist        |
| `variant` | chocolate variety chosen  |
| `flavors` | flavor interest           |
| `zip`     | ZIP code                  |

The script sends these with every signup so you can segment later
(e.g. "email everyone who wanted Blueberry").

---

## 3. Create the website form

1. Grow → **Landing Pages & Forms** → **Create New** → **Form** →
   pick any inline template (it won't be shown on your site — we only
   need it as the entry point that triggers the welcome).
2. Name it **GÜTE Website**.
3. In the form's settings, set **opt-in** to **single opt-in** (no
   confirmation click — smoother for a pre-launch list). If you prefer
   double opt-in for deliverability, that's fine too — just know the
   welcome fires after they confirm.
4. Save/publish the form.
5. Find the **Form ID**: open the form, look at the URL —
   `app.kit.com/forms/DESIGNERS/1234567/edit` → `1234567` is the ID.
   Write it down.

---

## 4. Build the welcome automation

1. Automate → **Visual Automations** → **New Automation** → start from
   scratch.
2. **Trigger:** "Joins a form" → select **GÜTE Website**.
3. Add a step → **Email** (or a one-email Sequence) → paste the welcome
   email from `WELCOME_EMAIL.md`. Set the subject line from that file.
4. Turn the automation **Live**.

> Free plan note: you get **one** automation — this welcome is it. That's
> all you need for now. Broadcasts (occasional news) are unlimited and
> don't use the automation slot.

---

## 5. Get your API key

Settings → **Advanced** → **API** → under **API v4**, create/copy your
**API Key** (starts with `kit_...`). Keep it secret — treat it like a
password.

---

## 6. Wire the key into Apps Script

1. Open your existing Apps Script project (script.google.com → the
   "GUTE Waitlist" project).
2. Replace the code with the updated `Code.gs` from this folder (already
   done in your repo — copy its contents in).
3. Click the **gear (Project Settings)** → scroll to **Script Properties**
   → **Add script property** twice:

   | Property      | Value                          |
   |---------------|--------------------------------|
   | `KIT_API_KEY` | your `kit_...` key from step 5  |
   | `KIT_FORM_ID` | the form ID from step 3         |

4. Save.

---

## 7. Test it

1. In the Apps Script editor, choose the function **`testKit`** from the
   dropdown → **Run**. (Approve permissions if prompted.)
2. View → **Logs**. You want to see `Kit sync result: ok`.
3. Check Kit → Subscribers: the test subscriber should appear, and the
   welcome automation should show them entering it.
4. Delete the test subscriber in Kit when done.
5. **Re-deploy:** Deploy → **Manage deployments** → edit (pencil) →
   **New version** → **Deploy**. This is required for the live site to use
   the new code. Your Web App URL stays the same, so no website change.

---

## 8. Go live

Do a real signup on thegutecompany.com. You should get:
- a new row in the Sheet with **Kit Sync = ok**,
- the subscriber in Kit,
- the welcome email in your inbox.

If **Kit Sync** shows an error, read the message in that cell — it'll say
what Kit rejected (usually a wrong Form ID or a field key that doesn't
exist yet). Fix and try again.

---

## What happens after this

- Every popup / waitlist signup → Sheet backup **+** Kit subscriber **+**
  instant welcome email.
- You send occasional **broadcasts** from Kit (Broadcasts → New) only when
  there's real news — license approved, first batch, launch day.
- Everything is tagged/fielded so you can send targeted emails later.
