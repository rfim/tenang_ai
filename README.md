# N2CIAS by TenangAI: website

Static site for N2CIAS and Nesya, the AI companion. Bilingual (Bahasa Indonesia by default, English toggle). No build step.

- `index.html`: page and Bahasa Indonesia copy. Section anchors match the old tenang.ai site: `#platform`, `#how-it-works`, `#use-cases`, `#dashboard`, `#safety`, `#pilot`, `#demo`.
- `i18n.js`: English copy (keys match `data-i18n` attributes) and Indonesian strings used only from JavaScript.
- `app.js`: language switch, chat animation, tabs, coverage planner with the 5-question capacity quiz, contact form (opens an email to hai@tenangaja.co.id).
- `styles.css`: storybook / paper-collage style. The home page uses an editorial layout modelled on the Bija site's structure (floating pill menu, full-bleed hero, split sections, bordered partner strip); see the "Layout v3" block.
- `research.html` and the organisation pages (`universitas.html`, `perusahaan.html`, `rumah-sakit.html`, `kesehatan-masyarakat.html`) are generated: edit `tools/build_pages.py`, then run `python3 tools/build_pages.py`. It copies the header and footer from `index.html`, so rerun it after changing those.
- `data.js`: clinical studies, team publications, team members and the reading list. Empty lists show a "coming soon" note. `research.js` renders them.
- `assets/`: SVG illustrations (kites, plants, mushrooms, Nesya, paper edges, grain).
- `assets/logos/`: university logos. Binus has no logo file yet (shown as a wordmark); drop `binus.svg` or `binus.png` in and swap the `.wordmark` item in `index.html`. If `ugm.svg` is missing, UGM also shows as a wordmark.

Pricing in the planner (IDR per person per month) is in `app.js` under `TIERS`.

Run locally: `python3 -m http.server` and open http://localhost:8000.

Deploy: GitHub Pages, Settings → Pages → Deploy from a branch → `main` / root.

## Art

- `docs/art-prompts.md`: prompt pack for painted scenes (style block, palette, per-page prompts, motion loops).
- `tools/mega_mendung.py`: generates the mega mendung batik clouds (`assets/mm-*.svg`, day and night colours). Run it after changing shapes or colours.
- Partner logos for the moving carousel are in `assets/logos/` (official files from each institution or Wikimedia Commons).

## Gallery

`galeri.html` ("Dari ELIZA ke Nesya") is generated from `tools/gallery.py`: eleven rooms from Turing (1950) and ELIZA (1966) to Therabot (2025), each with an artefact, a placard and a lesson for Nesya. Sources are listed at the bottom of the page. Edit the `ROOMS` list, then run `python3 tools/build_pages.py`.

## Painted hero scene

Put the illustration (watermark-free) at `assets/art/hero-scene.webp` (square, at least 1600 px). When the file exists, the home hero switches to text on the left and the painting on the right; without it the film hero stays. Preview locally with `?scene=preview` using `assets/art/_preview/hero-scene.webp` (ignored by git).
