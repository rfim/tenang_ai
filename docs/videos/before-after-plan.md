# tenang.ai before and after (36 s, 1920×1080, 30 fps, English)

**What it is:** a short film that puts the old tenang.ai next to the new N2CIAS site and shows what was missing.
**Sponsor:** Supported by Rembug Rasa Projects (credit in the outro).
**How the problem is explained:** four gaps, mutually exclusive and collectively exhaustive (MECE). Each answers one question a visitor has: how it feels (look & feel), who you talk to (character), why trust it (credibility), why it exists (story).
**Mission line:** wellbeing is not one person's burden; Nesya keeps people company and shows the way, people and institutions stay responsible. The theme of responsibility comes from Oktifani Winarti's PhD research, a working draft: the film does not quote or cite it.
**Music:** 120 BPM (beat 0.5 s, bar 2 s), D major, D–Bm–G–A: soft pad, plucked arpeggio, root bass, a soft kick and shaker under the gaps, a two-note chime on every scene change, the final D chord under the outro. Made in `source/music.py`, no samples.
**Real screens:** the old site (English version) captured from tenang.ai on 23 Nov 2026; the new site (English) from this repo.

| # | Time | On screen | Words |
|---|---|---|---|
| 1 Hook | 0–3 s | Dark green; the words land on beats 2 and 3 | Before. After. · What tenang.ai was missing, and what N2CIAS has now. |
| 2 Before | 3–7 s | The old home page scrolls in a browser frame | Before · tenang.ai, as it was. · The information was there. The feeling wasn't. |
| 3 Gaps | 7–11 s | Four cards land on the beat | What was missing · Four gaps. No overlaps, nothing left out. |
| 4 Look & feel | 11–15 s | Old blue template next to the new home with film | A blue template, text only → Calm film, its own art and type |
| 5 Character | 15–19 s | Old Nesya icon card next to the new Nesya chat | Nesya was just an icon → Nesya has a face and a voice |
| 6 Credibility | 19–23 s | Old partner fine print next to the partner strip, with the reading list | Partners in fine print, no research → Partner logos up front, a reading list |
| 7 Story | 23–27 s | Old template section next to the ELIZA room | No story, no meaning in the name → From ELIZA to N2CIAS, and the name explained |
| 8 Mission | 27–31 s | Cream page | Our mission · Wellbeing is not one person's burden. · Nesya keeps people company and shows the way. People and institutions stay responsible. |
| 9 Outro | 31–36 s | by Tenang AI, N2CIAS and its meaning, the link, Nesya, the sponsor | rfim.github.io/tenang_ai · Supported by Rembug Rasa Projects |

**To render again:** put the English screenshots in `old_en/` and `new_en/` next to `source/stage.html`, call `render(t)` for t = 0 … 35.97 in steps of 1/30 and save each frame, run `python3 source/music.py`, then
`ffmpeg -framerate 30 -i frames/f%04d.jpg -i music.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest tenang-before-after.mp4`.
