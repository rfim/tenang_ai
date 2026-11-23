# tenang.ai before and after (90 s, 1920×1080, 30 fps, two versions)

- `tenang-before-after-en.mp4`: English
- `tenang-before-after-id.mp4`: Bahasa Indonesia

**What it is:** a film that shows what the old tenang.ai was missing and how the new N2CIAS site solves it. Not side by side: for each gap the old site comes first with the problem spotlighted in coral, then the new site with the fix spotlighted in green.
**How the problem is explained:** four gaps, mutually exclusive and collectively exhaustive (MECE). Each answers one question a visitor has: how it feels (look & feel), who you talk to (character), why trust it (credibility), why it exists (story).
**Mascot:** Nesya, a little Sumatran elephant in a teal polka-dot scarf, is introduced right after the character gap; 24/7, the main selling point, follows her.
**Mission line:** wellbeing is not one person's burden; Nesya keeps people company and shows the way, people and institutions stay responsible. The theme of responsibility comes from Oktifani Winarti's PhD research, a working draft: the film does not quote or cite it.
**Call to action:** Book a pilot demo · rfim.github.io/tenang_ai.
**Credits:** the supporters are shown at the start, in the opener; the end card says only "A film by Rembug Rasa Projects".
**Music:** a soft jazz trio at 120 BPM in swing, D major (Dmaj9 – Bm9 – Em9 – A13): electric piano comping, walking upright bass, ride cymbal and brushes, lighter under Nesya and the mission; a vibraphone note on every scene change, a little vibraphone phrase when Nesya appears and another over the outro, where a Dmaj9 holds to the end. Made in `source/jazz.py`, no samples.
**Real screens:** the old site captured from tenang.ai (in each language) on 23 Nov 2026; the new site from this repo.

**Opener (Rembug Rasa Projects, 0–16 s, computer theme):**

| Time | On screen |
|---|---|
| 0–4.5 s | "> it began with two questions". Ada Lovelace (1843, "wrote the first program for a machine") and Alan Turing (1950, "asked: can machines think?") scan in like CRT screens, tinted teal. "Both born in London." Portraits: A. E. Chalon (c. 1840) and Elliott & Fry (1951), both public domain (Wikimedia Commons). |
| 4.5–9.5 s | A boot log types; a dot-matrix mark lights up: two speech bubbles (London and Jogja) with a heart between them, for *rembug rasa*, talking feelings through together. "REMBUG RASA PROJECTS" types in an aqua digital font. "Talking feelings through, together. Research between London and Yogyakarta." No apps: research first. "Supported by" with CREA Digital Ventures, Claude for Startups, LPDP and Goldsmiths, University of London (white logos, CREA in its own colours); the title holds 1.5 s longer for them. |
| 11–16 s | Two 80s CRT computers, London and Yogyakarta, ping each other; each reply prints a piece of the research (papers, interview notes, conversation drafts, safety rules, Bahasa Indonesia, feedback). "London × Jogja. / Researching AI that listens." A shared log ends with "next: N2CIAS". |

The film below then starts at 16 s (add 16 s to every time in the table). Opener sound: `source/intro_audio.py` (CRT hum, scan sweeps, typing, pixel blips, pings), followed by the jazz.

| # | Time | On screen | English words |
|---|---|---|---|
| 1 Hook | 0–3 s | The words land on beats 2 and 3 | Before. After. · What tenang.ai was missing, and how N2CIAS solves it. |
| 2 Before | 3–8 s | The old home page | tenang.ai, as it was. · The information was there. The feeling wasn't. |
| 3 Gaps | 8–13 s | Four cards land on the beat | Four gaps. No overlaps, nothing left out. |
| 4 Look & feel | 13–17 s problem, 17–21 s solved | Old heading spotlighted, then the new heading over film | A generic blue template → A calm film, its own art and type |
| 5 Character | 21–25 s, 25–29 s | Old Nesya icon card, then the new Nesya chat | Nesya was just an icon → Nesya has a face and a voice |
| 6 Meet Nesya | 29–34 s | Nesya waves; three other poses float in | This is Nesya. A little Sumatran elephant in a teal polka-dot scarf. Elephants never forget, and she listens without judging. |
| 7 24/7 | 34–39 s | A dial turns a full day; Nesya wakes up | 24/7 · Any hour, any day. No queue, no appointment. Nesya is there at 3 a.m. too. |
| 8 Credibility | 39–44 s, 44–50 s | Partner fine print, then the menu with no research; the partner strip, then the reading list | Partners in fine print, no research → Partners up front, research to read |
| 9 Story | 50–54 s, 54–60 s | The unexplained N2CIAS logo; the ELIZA room, then the meaning of the name | No story, a name never explained → A story from ELIZA, and a name that means something |
| 10 Mission | 60–65 s | Cream page | Wellbeing is not one person's burden. Nesya keeps people company and shows the way. People and institutions stay responsible. |
| 11 Outro | 65–69 s | by Tenang AI, N2CIAS and its meaning, the button, the link, Nesya | Book a pilot demo · rfim.github.io/tenang_ai |
| 12 Credits | 69–74 s | Cream page | A film by Rembug Rasa Projects |

**Opener:** `source/intro.html?lang=en|id`, frames 0 … 434 at 30 fps (portraits in `source/pioneers/`), joined before the film frames.

**To render again:** `source/stage.html` reads the screenshots from `en/` and `id/`, the spotlight boxes from `rects.json` (put in place of `__RECTS__`), the stickers from `nesya/` and the logos from `logos/`. Open it with `?lang=en` or `?lang=id`, call `render(t)` for t = 0 … 73.97 in steps of 1/30 and save each frame, run `python3 source/jazz.py` (writes `jazz.wav`), then
`ffmpeg -framerate 30 -i frames/f%04d.jpg -i jazz.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest tenang-before-after-en.mp4`.
