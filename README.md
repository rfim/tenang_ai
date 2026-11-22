# TenangAI website

Static marketing site for N2CIAS by TenangAI and Nesya, the AI companion. Bilingual (Bahasa Indonesia by default, English toggle). No build step.

- `index.html`: page and Bahasa Indonesia copy
- `i18n.js`: English copy (keys match `data-i18n` attributes)
- `app.js`: language switch, chat animation, tabs, cost estimator, contact form (opens an email)
- `styles.css`: styles

Run locally: `python3 -m http.server` and open http://localhost:8000.

Deploy: GitHub Pages, Settings → Pages → Deploy from a branch → `main` / root.

Pricing in the estimator (IDR per person per month) is in `app.js` under `TIERS`.
