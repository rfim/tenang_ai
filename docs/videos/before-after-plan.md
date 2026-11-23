# Rembug rasa: tenang.ai before and after (30 s, 1920×1080, 30 fps)

**What it is:** a short film that puts the old tenang.ai next to the new N2CIAS site and shows what was missing.
**Theme:** *Rembug rasa*: a place to talk feelings through, together.
**Mission line:** wellbeing is not one person's burden. Nesya keeps people company and shows the way; people and institutions stay responsible. (The theme of responsibility comes from Oktifani Winarti's PhD research, which is a working draft: the film does not quote or cite it.)
**Music:** 120 BPM (beat 0.5 s, bar 2 s), D major, D–Bm–G–A: soft pad, plucked arpeggio, root bass, a soft kick and shaker under the comparisons, a two-note chime on every scene change, and the final D chord under the outro. Made in `source/music.py`, no samples.
**Real screens:** the old site captured from tenang.ai on 23 Nov 2026; the new site from this repo.

| # | Time | On screen | Words |
|---|---|---|---|
| 1 Hook | 0–3 s | Dark green; the words land on beats 2 and 3 | Rembug rasa. · Ruang untuk membicarakan perasaan, bersama. |
| 2 Before | 3–7 s | The old tenang.ai home page scrolls in a browser frame | Sebelum · tenang.ai, sebelumnya. · Informasinya ada. Rasanya belum: templat biru, banyak teks, tanpa wajah dan tanpa cerita. |
| 3 Wajah | 7–11 s | Old Nesya icon card next to the new Nesya chat | Nesya hanya sebuah ikon → Nesya punya wajah dan suara |
| 4 Bukti | 11–15 s | Old partner fine print next to the new partner strip | Mitra hanya di teks kecil → Mitra terlihat di layar pertama |
| 5 Riset | 15–19 s | No research page next to the new reading list | Tidak ada halaman riset → Bacaan riset, lengkap dengan jurnalnya |
| 6 Cerita | 19–23 s | Old template section next to the ELIZA room of the gallery | Tanpa cerita, tanpa arti nama → Dari ELIZA ke N2CIAS, dan arti namanya |
| 7 Mission | 23–27 s | Cream page | Misi kami · Kesejahteraan bukan beban satu orang saja. · Nesya menemani dan menunjukkan jalan. Manusia dan institusi tetap bertanggung jawab. |
| 8 Outro | 27–30 s | by Tenang AI, N2CIAS, the meaning of the name, the link, Nesya | rfim.github.io/tenang_ai |

**To render again:** put the screenshots in `old/` and `new/` next to `source/stage.html`, call `render(t)` for t = 0 … 29.97 in steps of 1/30 and save each frame, run `python3 source/music.py`, then
`ffmpeg -framerate 30 -i frames/f%04d.jpg -i music.wav -c:v libx264 -crf 20 -pix_fmt yuv420p -c:a aac -b:a 160k -movflags +faststart -shortest tenang-before-after.mp4`.
