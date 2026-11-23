// node hold.js <dir> <page> <lang> <outdir> <from> <to> '<holds json [[sceneTime, seconds], ...]>'
// Renders frames at normal speed, but freezes the scene at each hold point so the text can be read.
const { chromium } = require('playwright');
(async () => { const [dir, page, lang, out, from, to, hj] = process.argv.slice(2); const H = JSON.parse(hj).sort((a, b) => a[0] - b[0]);
  const remap = o => { let acc = 0; for (const [h, d] of H) { if (o < h + acc) return o - acc; if (o < h + acc + d) return h; acc += d; } return o - acc; };
  require('fs').mkdirSync(`${dir}/${out}`, { recursive: true });
  const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1920, height: 1080 } });
  await p.goto(`file://${dir}/${page}?lang=${lang}`, { waitUntil: 'networkidle' }); await p.evaluate(() => document.fonts.ready);
  await p.evaluate(async () => { const s = [...document.images].map(i => i.src); await Promise.all(s.map(u => new Promise(r => { const i = new Image(); i.onload = i.onerror = r; i.src = u; }))); });
  for (let f = +from; f < +to; f++) { await p.evaluate(([t, rt]) => render(t, rt), [remap(f / 30), f / 30]); await p.screenshot({ path: `${dir}/${out}/f${String(f).padStart(4, '0')}.jpg`, type: 'jpeg', quality: 90 }); }
  await b.close(); console.log('done', page, lang, from, to); })();
