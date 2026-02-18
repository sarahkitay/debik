# Deborah Kitay, LMFT - Website (Static Multi-Page)

A calming, modern, professional **multi-page** website for **Deborah Kitay, LMFT (LMFT 105063)** in **El Segundo, CA + Telehealth (California)**.

## Quick start (local)

- **Option A (simplest):** double-click `index.html` to open in your browser.
- **Option B (recommended):** run a tiny local server so links/assets behave like production.

```bash
cd /Users/sarahkitay/Debik
python3 -m http.server 5173
```

Then open `http://localhost:5173`.

## Configure SimplePractice

Update the SimplePractice URLs in:

- `assets/main.js` → `window.SITE_CONFIG.simplePracticeSchedulingUrl`
- `assets/main.js` → `window.SITE_CONFIG.simplePracticeContactUrl` (optional)

The “Make an Appointment” buttons will use the scheduling URL.

## Replace images

This repo includes **SVG placeholders** (fast, privacy-friendly). Replace with your real images by swapping the `assets/images/*.svg` files or updating the `<img src="...">` paths in the HTML.

Recommended real images to add:
- `hero`: pink lotus flower on water
- `about`: professional headshot
- `approach`: ocean/hillside/sunset imagery

## Pages

- `index.html` (Home)
- `approach.html` (Narrative Therapy)
- `services.html`
- `about.html`
- `contact.html`
- `privacy-policy.html`

