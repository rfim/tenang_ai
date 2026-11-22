# N2CIAS by TenangAI: website

Static site for N2CIAS and Nesya, the AI companion. Bilingual (Bahasa Indonesia by default, English toggle). No build step.

- `index.html`: page and Bahasa Indonesia copy. Section anchors match the old tenang.ai site: `#platform`, `#how-it-works`, `#use-cases`, `#dashboard`, `#safety`, `#pilot`, `#demo`.
- `i18n.js`: English copy (keys match `data-i18n` attributes) and Indonesian strings used only from JavaScript.
- `app.js`: language switch, chat animation, tabs, coverage planner with the 5-question capacity quiz, contact form (opens an email to hai@tenangaja.co.id).
- `styles.css`: storybook / paper-collage style.
- `assets/`: SVG illustrations (kites, plants, mushrooms, Nesya, paper edges, grain).
- `assets/logos/`: university logos. Binus has no logo file yet (shown as a wordmark); drop `binus.svg` or `binus.png` in and swap the `.wordmark` item in `index.html`. If `ugm.svg` is missing, UGM also shows as a wordmark.

Pricing in the planner (IDR per person per month) is in `app.js` under `TIERS`.

Run locally: `python3 -m http.server` and open http://localhost:8000.

Deploy: GitHub Pages, Settings → Pages → Deploy from a branch → `main` / root.
