const { chromium } = require('playwright'); const fs = require('fs');
(async () => { const V = process.argv[2] + '/vid2'; const R = JSON.parse(fs.readFileSync(V + '/rects.json', 'utf8')); const b = await chromium.launch();
  const fr = (p, sel) => p.evaluate(s => { const r = document.querySelector(s).getBoundingClientRect(); return [r.left / 1440, Math.max(0, r.top) / 900, r.right / 1440, Math.min(r.bottom, 900) / 900].map(v => +v.toFixed(4)); }, sel);
  const hide = '.reveal{opacity:1!important;transform:none!important} .to-top,.walker{display:none!important}';
  for (const lang of ['en', 'id']) {
    const p = await b.newPage({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
    // hero with the console card
    await p.goto('http://localhost:8765/', { waitUntil: 'networkidle' }); await p.locator(`button[data-lang=${lang}]:visible`).first().click();
    await p.addStyleTag({ content: hide }); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(5200);
    await p.addStyleTag({ content: '.hb > a,.mw-arc,.pk-chips > span,.pk-heat rect,.tr-l,.pk-kpis > span,.pk-un rect,.pk-units2 > span{animation:none!important}' }); await p.waitForTimeout(300);
    await p.screenshot({ path: `${V}/${lang}/new-hero.png` });
    for (const v of [1, 2, 3]) { await p.evaluate(v => window.N2Peek.show(v), v); await p.waitForTimeout(1200); await p.screenshot({ path: `${V}/${lang}/new-hero-t${v}.png` }); }
    await p.evaluate(() => window.N2Peek.show(0)); await p.waitForTimeout(300);
    R[`${lang}/new-hero`] = { h1: await fr(p, '.hero2 h1'), strip: await fr(p, '.partners-pin .marquee'), peek: await fr(p, '.hb') };
    await p.addStyleTag({ content: '.partners-pin{display:none!important}' });
    // home dashboard: console on Peta, then the Analitik tab
    await p.evaluate(() => { const e = document.getElementById('cx'); scrollTo({ top: e.getBoundingClientRect().top + scrollY - 112, behavior: 'instant' }); }); await p.waitForTimeout(1500);
    await p.screenshot({ path: `${V}/${lang}/new-dash.png` });
    R[`${lang}/new-dash`] = { card: await fr(p, '#cx') };
    await p.click('#cx .cx-nav[data-v="1"]'); await p.waitForTimeout(500);
    await p.evaluate(() => { const e = document.getElementById('cx'); scrollTo({ top: e.getBoundingClientRect().top + scrollY - 112, behavior: 'instant' }); }); await p.waitForTimeout(1200);
    await p.screenshot({ path: `${V}/${lang}/new-an.png` });
    R[`${lang}/new-an`] = { card: await fr(p, '#cx'), heat: await fr(p, '#cx #dv-heat'), act: await fr(p, '#cx .dv-actions'), trend: await fr(p, '#cx #dv-trend') };
    // full console page
    await p.goto('http://localhost:8765/dashboard.html', { waitUntil: 'networkidle' }); await p.locator(`.cx-lang button[data-l=${lang}]`).click(); await p.waitForTimeout(500);
    await p.addStyleTag({ content: '.to-top,.walker{display:none!important}' }); await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(800);
    await p.screenshot({ path: `${V}/${lang}/new-console.png` });
    R[`${lang}/new-console`] = { all: await fr(p, '.cx'), map: await fr(p, '.cx-svg'), side: await fr(p, '.cx-side') };
    await p.evaluate(() => { const e = document.querySelector('.cx-att'); scrollTo({ top: e.getBoundingClientRect().top + scrollY - 140, behavior: 'instant' }); }); await p.waitForTimeout(600);
    await p.screenshot({ path: `${V}/${lang}/new-att.png` });
    R[`${lang}/new-att`] = { list: await fr(p, '.cx-att') };
    await p.close();
  }
  fs.writeFileSync(V + '/rects.json', JSON.stringify(R, null, 1)); console.log(JSON.stringify(R['id/new-hero']), JSON.stringify(R['id/new-an']), JSON.stringify(R['id/new-console'])); await b.close(); })();
