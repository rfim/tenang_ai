// N2CIAS institution console (mock data). A 30-day wheel like a plasmid map: the ring is the month,
// coloured arcs are periods when a topic was elevated, outer labels are calendar events, and a
// draggable wedge selects days. The right panel shows the same days as linear tracks.
(function () {
  "use strict";
  var app = document.getElementById("cx");
  if (!app) return;
  var NS = "http://www.w3.org/2000/svg";
  function lang() { return document.documentElement.lang === "en" ? "en" : "id"; }
  function el(tag, a, p) { var e = document.createElementNS(NS, tag); for (var k in a) e.setAttribute(k, a[k]); if (p) p.appendChild(e); return e; }
  function h(tag, cls, html) { var e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; }

  var TOPICS = [
    { k: "stress", c: "#c9ec4a", id: "Stres akademik", en: "Study stress", dId: "Tekanan tugas, ujian, dan tenggat. Biasanya naik menjelang ujian dan turun setelah libur.", dEn: "Pressure from coursework, exams and deadlines. Usually rises before exams and eases after breaks." },
    { k: "burnout", c: "#f6b3d9", id: "Burnout", en: "Burnout", dId: "Kelelahan yang menumpuk: sulit fokus, merasa kosong, menunda. Sering muncul setelah beberapa minggu beban tinggi.", dEn: "Built-up exhaustion: trouble focusing, feeling empty, putting things off. Often follows weeks of heavy load." },
    { k: "anx", c: "#a9dbf5", id: "Kecemasan", en: "Anxiety", dId: "Rasa cemas dan khawatir berlebih, sering disertai jantung berdebar dan sulit tenang.", dEn: "Excessive worry, often with a racing heart and trouble calming down." },
    { k: "sleep", c: "#c7b8f0", id: "Gangguan tidur", en: "Sleep problems", dId: "Sulit tidur atau sering terbangun. Terlihat dari check-in larut malam yang meningkat.", dEn: "Trouble falling or staying asleep, visible as more late-night check-ins." },
    { k: "rel", c: "#f7a27a", id: "Tekanan relasi", en: "Relationship strain", dId: "Masalah dengan keluarga, pasangan, atau teman.", dEn: "Problems with family, partners or friends." },
    { k: "lonely", c: "#9ee6d8", id: "Kesepian", en: "Loneliness", dId: "Merasa sendiri atau jauh dari orang lain, sering pada akhir pekan dan masa libur.", dEn: "Feeling alone or far from others, often at weekends and over breaks." },
    { k: "ref", c: "#f5e15a", id: "Rujukan psikolog", en: "Psychologist referral", dId: "Periode ketika Nesya lebih sering mengarahkan ke psikolog atau konselor kampus.", dEn: "Periods when Nesya more often pointed people to a psychologist or campus counsellor." }
  ];
  var TABS = [
    { key: "itb", logo: "assets/logos/itb.svg", kind: "agg", title: "ITB", sub: { id: "Agregat", en: "Aggregate" }, name: "Institut Teknologi Bandung", seed: 3, n: 1420, units: ["FTI", "FMIPA", "SBM", "FSRD", "STEI"],
      events: [[4, { id: "Awal kuliah", en: "Term starts" }], [11, { id: "Tenggat tugas besar", en: "Project deadline" }], [15, { id: "UTS mulai", en: "Midterms start" }], [19, { id: "UTS selesai", en: "Midterms end" }], [23, { id: "Libur nasional", en: "Public holiday" }], [28, { id: "Pengumuman nilai", en: "Grades released" }]] },
    { key: "gold", logo: "assets/logos/goldsmiths-mark.png", kind: "agg", title: "Goldsmiths", sub: { id: "Agregat", en: "Aggregate" }, name: "Goldsmiths, University of London", seed: 7, n: 610, units: ["Psychology", "Media & Comms", "Computing", "Art", "Music"],
      events: [[3, { id: "Minggu orientasi", en: "Welcome week" }], [9, { id: "Reading week", en: "Reading week" }], [14, { id: "Tenggat esai", en: "Essay deadline" }], [21, { id: "Pameran karya", en: "Degree show" }], [26, { id: "Ujian", en: "Exams" }]] },
    { key: "p0427", logo: "assets/nesya/happy.png", kind: "ind", title: "P-0427", sub: { id: "Individu · atas izin", en: "Individual · consented" }, name: "P-0427", seed: 11, n: 1, units: [],
      events: [[5, { id: "Check-in pertama", en: "First check-in" }], [12, { id: "Latihan napas", en: "Breathing exercise" }], [17, { id: "Rujukan dibuat", en: "Referral made" }], [20, { id: "Sesi psikolog 1", en: "Psychologist session 1" }], [27, { id: "Sesi psikolog 2", en: "Psychologist session 2" }]] }
  ];
  var T = {
    id: { nav: ["Peta", "Analitik", "Tren", "Unit", "Laporan", "Pengaturan"], user: "Admin demo", sel: "Pilihan", days: "hari", day: "Hari", load: "beban", ci: "check-in",
      props: "Properti", source: "Sumber", agg: "Agregat anonim", ind: "Satu pengguna, atas izin", kmin: "Ambang privasi", kv: "≥ 10 orang per sel", consent: "Izin", cv: "Diberikan 5 Nov 2026",
      trend: "Tren", up: "naik", down: "turun", flat: "stabil", peak: "Puncak", legend: "Legenda", map: "Peta 30 hari", h24: "Pola 24 jam", range: "Rentang",
      indNote: "Tampilan individu hanya untuk psikolog yang ditunjuk, atas izin pengguna. Institusi tidak pernah melihat tampilan ini.",
      aggNote: "Agregat dan anonim. Institusi tidak pernah melihat percakapan pribadi.", mock: "Data contoh", tools: ["Pilih", "Rentang", "Perbesar", "Perkecil", "Label", "Atur ulang", "Ekspor"] ,
      avg: "beban rata-rata", sum: "check-in", of: "dari", load: "Beban", ci: "Check-in", keyNote: "Angka di kotak = beban emosional hari itu (0–100). Di bawahnya: jumlah check-in. Batang berwarna = topik yang sedang tinggi.", sideTitle: "Hari per hari", lvN: ["", "Ringan", "Sedang", "Berat"], pdf: "Unduh PDF", report: "Laporan N2CIAS", back: "← Kembali ke situs" },
    en: { nav: ["Map", "Analytics", "Trends", "Units", "Reports", "Settings"], user: "Demo admin", sel: "Selection", days: "days", day: "Day", load: "load", ci: "check-ins",
      props: "Properties", source: "Source", agg: "Anonymous aggregate", ind: "One user, with consent", kmin: "Privacy threshold", kv: "≥ 10 people per cell", consent: "Consent", cv: "Given 5 Nov 2026",
      trend: "Trend", up: "up", down: "down", flat: "steady", peak: "Peak", legend: "Legend", map: "30-day map", h24: "24-hour pattern", range: "Range",
      indNote: "The individual view is only for the assigned psychologist, with the user's consent. Institutions never see this view.",
      aggNote: "Aggregated and anonymous. Institutions never see private conversations.", mock: "Sample data", tools: ["Select", "Range", "Zoom in", "Zoom out", "Labels", "Reset", "Export"],
      avg: "average load", sum: "check-ins", of: "of", load: "Load", ci: "Check-ins", keyNote: "Number in the box = that day's emotional load (0–100). Below it: number of check-ins. Coloured bars = topics running high.", sideTitle: "Day by day", lvN: ["", "Light", "Moderate", "Heavy"], pdf: "Download PDF", report: "N2CIAS report", back: "← Back to site" }
  };
  function L() { return T[lang()]; }
  function nm(t) { return t[lang()]; }

  // ---------- mock data ----------
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  function build(tab) {
    var r = rng(4242 + tab.seed * 977), ind = tab.kind === "ind", days = [];
    for (var d = 1; d <= 30; d++) {
      var ev = tab.events.some(function (e) { return Math.abs(e[0] - d) <= 1; }) ? 12 : 0;
      var load = Math.round(Math.max(12, Math.min(94, 40 + 18 * Math.exp(-Math.pow((d - 16) / 4.5, 2)) + ev + (r() - .5) * 14)));
      var ci = ind ? (r() < .7 ? 1 + Math.round(r() * 2) : 0) : Math.round(tab.n * (0.05 + load / 900) * (0.85 + r() * .3));
      days.push({ d: d, load: load, ci: ci });
    }
    var feats = [], pool = ind ? [0, 2, 3, 5, 6] : [0, 1, 2, 3, 4, 5, 6];
    pool.forEach(function (ti) {
      for (var c = 0; c < 1; c++) {
        var start = 1 + Math.floor(r() * 24), len = 3 + Math.floor(r() * (ind ? 6 : 9));
        if (ti === 0) { start = ind ? 8 : 9 + Math.floor(r() * 3); len = ind ? 9 : 11; }
        if (ti === 6) { start = ind ? 16 : 14 + Math.floor(r() * 3); len = ind ? 13 : 7; }
        feats.push({ t: ti, a: start, b: Math.min(30, start + len), share: ind ? null : Math.round(18 + r() * 50) });
      }
    });
    // lanes: greedy, so arcs in one ring never overlap
    feats.sort(function (x, y) { return x.a - y.a; });
    var order = pool.slice(); feats.forEach(function (f) { f.lane = order.indexOf(f.t); }); var lanes = order;
    var hours = []; for (var hh = 0; hh < 24; hh++) hours.push(6 + 30 * Math.exp(-Math.pow((hh - 21.5) / 2.6, 2)) + 16 * Math.exp(-Math.pow((hh - 12.5) / 2.2, 2)) + r() * 4 - (hh >= 3 && hh <= 6 ? 6 : 0));
    return { days: days, feats: feats, lanes: lanes.length, hours: hours };
  }

  var state = { tab: 0, sel: [12, 18], feat: null, zoom: 1, labels: true, view: 0 };
  var FULL = document.body.classList.contains("cx-full");
  var data = build(TABS[0]);

  // ---------- geometry ----------
  var CX = 400, CY = 340, R = 226, W = 800, H = 690;
  function ang(day) { return (-90 + (day - 1) / 30 * 360) * Math.PI / 180; }
  function pt(a, r) { return [CX + Math.cos(a) * r, CY + Math.sin(a) * r]; }
  function arcPath(a1, a2, r1, r2, arrow) {
    var big = a2 - a1 > Math.PI ? 1 : 0, p1 = pt(a1, r2), p2 = pt(a2, r2), p3 = pt(a2, r1), p4 = pt(a1, r1);
    var tip = arrow ? pt(a2 + 0.045, (r1 + r2) / 2) : null;
    return "M" + p1 + "A" + r2 + " " + r2 + " 0 " + big + " 1 " + p2 + (tip ? "L" + tip : "") + "L" + p3 + "A" + r1 + " " + r1 + " 0 " + big + " 0 " + p4 + "Z";
  }

  // ---------- render ----------
  var C = window.N2C, quiet = false;
  function ech(cls, ratio, opt, ready) { var d = h("div", "cx-ec " + cls); d.style.aspectRatio = ratio; if (C) C.chart(d, function () { var o = opt(); o.animation = !quiet && !C.still; return o; }, { ready: ready }); return d; }
  function render(q) {
    quiet = !!q;
    var t = L(), tab = TABS[state.tab], ind = tab.kind === "ind";
    if (C) C.sweep(app);
    app.innerHTML = "";
    app.classList.toggle("is-ind", ind);
    // app bar + tabs
    var bar = h("div", "cx-bar", '<span class="cx-logo"><img src="assets/nesya/happy.png" alt=""></span><b class="cx-name">N2CIAS</b><span class="cx-navs">' +
      t.nav.map(function (n, i) { return '<button type="button" class="cx-nav' + (i === state.view ? " on" : "") + '" data-v="' + i + '">' + n + "</button>"; }).join("") + "</span>" +
      '<span class="cx-user">' + (FULL ? '<span class="cx-lang"><button type="button" data-l="id"' + (lang() === "id" ? ' class="on"' : "") + '>ID</button><button type="button" data-l="en"' + (lang() === "en" ? ' class="on"' : "") + '>EN</button></span><a class="cx-back" href="index.html">' + t.back + "</a>" : "") + '<button type="button" class="cx-pdf"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M8 2v8M4.5 7L8 10.5 11.5 7M3 13h10" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>' + t.pdf + '</button><span class="cx-mock">' + t.mock + '</span><img src="assets/nesya/happy.png" alt="">' + t.user + "</span>");
    app.appendChild(bar);
    bar.querySelectorAll(".cx-nav").forEach(function (b) { b.addEventListener("click", function () { state.view = +b.dataset.v; render(); }); });
    bar.querySelectorAll(".cx-lang button").forEach(function (b) { b.addEventListener("click", function () { document.documentElement.lang = b.dataset.l; try { localStorage.setItem("lang", b.dataset.l); } catch (e) {} document.dispatchEvent(new Event("langchange")); }); });
    bar.querySelector(".cx-pdf").addEventListener("click", function () {
      var old = document.title; document.title = t.report + " - " + tab.name + " - " + new Date().toISOString().slice(0, 10);
      document.body.classList.add("cx-printing"); window.print();
      setTimeout(function () { document.title = old; document.body.classList.remove("cx-printing"); }, 500);
    });
    var tabs = h("div", "cx-tabs");
    TABS.forEach(function (tb, i) {
      var b = h("button", "cx-tab" + (i === state.tab ? " on" : ""), '<img class="cx-tlogo" src="' + tb.logo + '" alt="">' + tb.title + "<small>" + nm(tb.sub) + "</small>");
      b.type = "button"; b.addEventListener("click", function () { state.tab = i; state.feat = null; data = build(TABS[i]); render(); });
      tabs.appendChild(b);
    });
    tabs.appendChild(h("span", "cx-plus", "+"));
    app.appendChild(tabs);

    if (state.view !== 0) { app.appendChild(VIEWS[state.view](tab, ind, t)); app.appendChild(h("p", "cx-note", ind ? t.indNote : t.aggNote)); return; }
    var body = h("div", "cx-body");
    // tool rail
    var rail = h("div", "cx-rail");
    var icons = ["M3 2l9 5-4 1-2 4z", "M2 8h12M5 5L2 8l3 3M11 5l3 3-3 3", "M7 3v8M3 7h8", "M3 7h8", "M3 4h10M3 8h7M3 12h4", "M3 8a5 5 0 1 0 2-4M3 2v3h3", "M8 2v8M4 7l4 4 4-4M3 14h10"];
    icons.forEach(function (d, i) {
      var b = h("button", "cx-tool" + ((i === 4 && state.labels) ? " on" : ""), '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
      b.type = "button"; b.title = t.tools[i]; b.setAttribute("aria-label", t.tools[i]);
      b.addEventListener("click", function () {
        if (i === 2) state.zoom = Math.min(1.5, state.zoom + .15); if (i === 3) state.zoom = Math.max(.8, state.zoom - .15);
        if (i === 4) state.labels = !state.labels; if (i === 5) { state.sel = [12, 18]; state.feat = null; state.zoom = 1; } if (i === 6) { app.querySelector('.cx-pdf').click(); return; }
        render(true);
      });
      rail.appendChild(b);
    });
    body.appendChild(rail);

    // ---------- the wheel (Apache ECharts custom series) ----------
    var mapBox = h("div", "cx-map");
    var lane0 = R - 30, lw = 15, gap = 3, inner = lane0 - data.lanes * (lw + gap) + gap - 4, en0 = lang() === "en";
    function fit(api, zoom) { var w = api.getWidth(), hh = api.getHeight(), k = Math.min(w / W, hh / H), ox = (w - W * k) / 2, oy = (hh - H * k) / 2, z = zoom ? state.zoom : 1;
      return { k: k * z, P: function (x, y) { return [ox + (CX + (x - CX) * z) * k, oy + (CY + (y - CY) * z) * k]; }, c: [ox + CX * k, oy + CY * k], ox: ox, oy: oy, k0: k }; }
    function arcPts(g, a1, a2, r1, r2, arrow) { var o = [], n = Math.max(6, Math.ceil((a2 - a1) * 18)), j;
      for (j = 0; j <= n; j++) { var a = a1 + (a2 - a1) * j / n; o.push([g.c[0] + Math.cos(a) * r2 * g.k, g.c[1] + Math.sin(a) * r2 * g.k]); }
      if (arrow) { var m = (r1 + r2) / 2, at = a2 + .045; o.push([g.c[0] + Math.cos(at) * m * g.k, g.c[1] + Math.sin(at) * m * g.k]); }
      for (j = n; j >= 0; j--) { var b2 = a1 + (a2 - a1) * j / n; o.push([g.c[0] + Math.cos(b2) * r1 * g.k, g.c[1] + Math.sin(b2) * r1 * g.k]); }
      return o; }
    var wheelEl = ech("cx-svg", W + " / " + H, function () {
      var ink = C.ink(), ink2 = C.ink2(), ink3 = C.ink3(), mxh = Math.max.apply(0, data.hours);
      return {
        tooltip: C.tooltip({ trigger: "item" }),
        series: [
          { id: "base", type: "custom", coordinateSystem: "none", silent: true, data: [0], z: 1, renderItem: function (p, api) {
            var g = fit(api, true), kids = [], c = g.c, R2 = R * g.k;
            kids.push({ type: "circle", shape: { cx: c[0], cy: c[1], r: R2 }, style: { fill: "none", stroke: ink, lineWidth: 1.4 } });
            for (var d = 1; d <= 30; d++) { var a = ang(d), l = (d % 5 === 1 ? 10 : 5) * g.k;
              kids.push({ type: "line", shape: { x1: c[0] + Math.cos(a) * R2, y1: c[1] + Math.sin(a) * R2, x2: c[0] + Math.cos(a) * (R2 + l), y2: c[1] + Math.sin(a) * (R2 + l) }, style: { stroke: ink, lineWidth: 1.2 } });
              if (d % 5 === 1 || d === 30) kids.push({ type: "text", style: { text: String(d), x: c[0] + Math.cos(a) * (R2 - 16 * g.k), y: c[1] + Math.sin(a) * (R2 - 16 * g.k), align: "center", verticalAlign: "middle", fill: ink2, font: "500 " + Math.max(9, 12 * g.k) + "px " + C.font } }); }
            if (state.labels) tab.events.forEach(function (e, i) { var a = ang(e[0]), p1 = [c[0] + Math.cos(a) * (R2 + 4 * g.k), c[1] + Math.sin(a) * (R2 + 4 * g.k)], rr = (R + 40 + (i % 2) * 26) * g.k, p2 = [c[0] + Math.cos(a) * rr, c[1] + Math.sin(a) * rr], right = Math.cos(a) >= 0, p3 = [p2[0] + (right ? 14 : -14) * g.k, p2[1]];
              kids.push({ type: "polyline", shape: { points: [p1, p2, p3] }, style: { fill: "none", stroke: ink3, lineWidth: 1 } });
              kids.push({ type: "text", style: { text: nm(e[1]), x: p3[0] + (right ? 4 : -4) * g.k, y: p3[1], align: right ? "left" : "right", verticalAlign: "middle", fill: ink2, font: "500 " + Math.max(9.5, 12 * g.k) + "px " + C.font } }); });
            kids.push({ type: "circle", shape: { cx: c[0], cy: c[1] - 34 * g.k, r: 25 * g.k }, style: { fill: C.surface(), stroke: C.line(), lineWidth: 1 } });
            kids.push({ type: "image", style: { image: tab.logo, x: c[0] - 20 * g.k, y: c[1] - 54 * g.k, width: 40 * g.k, height: 40 * g.k } });
            kids.push({ type: "text", style: { text: ind ? tab.name : tab.title, x: c[0], y: c[1] + 12 * g.k, align: "center", verticalAlign: "middle", fill: ink, font: "400 " + 26 * g.k + "px Marcellus, serif" } });
            kids.push({ type: "text", style: { text: ind ? nm(tab.sub) : tab.n.toLocaleString("id-ID") + " " + (en0 ? "users · 30 days" : "pengguna · 30 hari"), x: c[0], y: c[1] + 34 * g.k, align: "center", verticalAlign: "middle", fill: ink3, font: "500 " + Math.max(9, 12 * g.k) + "px " + C.font } });
            // 24-hour pattern, top right (not zoomed)
            var g0 = fit(api, false), mc = g0.P(W - 86, 78);
            data.hours.forEach(function (v, hh) { var a1 = (-90 + hh * 15) * Math.PI / 180, a2 = (-90 + (hh + 1) * 15 - 2) * Math.PI / 180;
              kids.push({ type: "sector", shape: { cx: mc[0], cy: mc[1], r0: 26 * g0.k0, r: (30 + v / mxh * 22) * g0.k0, startAngle: a1, endAngle: a2 }, style: { fill: C.mint, opacity: .35 + .65 * v / mxh } }); });
            kids.push({ type: "text", style: { text: "24h", x: mc[0], y: mc[1], align: "center", verticalAlign: "middle", fill: ink, font: "600 " + 11 * g0.k0 + "px " + C.font } });
            kids.push({ type: "text", style: { text: t.h24, x: mc[0], y: mc[1] + 70 * g0.k0, align: "center", verticalAlign: "middle", fill: ink3, font: "500 " + Math.max(9, 11 * g0.k0) + "px " + C.font } });
            return { type: "group", children: kids };
          } },
          { id: "arcs", type: "custom", coordinateSystem: "none", z: 2, cursor: "pointer",
            data: data.feats.map(function (f, i) { var tp = TOPICS[f.t]; return { value: [f.lane, f.a, f.b, i], name: nm(tp), itemStyle: { color: tp.c } }; }),
            tooltip: { formatter: function (p) { var f = data.feats[p.dataIndex]; return "<b>" + p.name + "</b><br>" + t.day + " " + f.a + "–" + f.b + (f.share ? "<br>" + (en0 ? "Share of check-ins " : "Porsi check-in ") + f.share + "%" : ""); } },
            renderItem: function (p, api) {
              var g = fit(api, true), f = data.feats[p.dataIndex], tp = TOPICS[f.t], r2 = lane0 - f.lane * (lw + gap), r1 = r2 - lw, a1 = ang(f.a), a2 = ang(f.b), on = state.feat === p.dataIndex, dim = state.feat !== null && !on;
              var kids = [{ type: "polygon", shape: { points: arcPts(g, a1, a2, r1, r2, true) }, style: { fill: tp.c, opacity: dim ? .35 : 1, stroke: on ? C.ink() : "none", lineWidth: 1.5 },
                enterFrom: { style: { opacity: 0 }, scaleX: .9, scaleY: .9, originX: g.c[0], originY: g.c[1] }, enterAnimation: { delay: 120 + p.dataIndex * 90, duration: 900, easing: "cubicOut" } }];
              var mid = (r1 + r2) / 2, label = nm(tp);
              if ((a2 - a1) * mid > 9 * label.length) { var am = (a1 + a2) / 2, th = am + Math.PI / 2; if (Math.cos(th) < 0) th += Math.PI;
                kids.push({ type: "text", silent: true, x: g.c[0] + Math.cos(am) * mid * g.k, y: g.c[1] + Math.sin(am) * mid * g.k, rotation: -th, style: { text: label, align: "center", verticalAlign: "middle", fill: "#1d2626", font: "600 " + Math.max(8, 11 * g.k) + "px " + C.font, opacity: dim ? .5 : 1 } }); }
              return { type: "group", children: kids };
            } },
          { id: "sel", type: "custom", coordinateSystem: "none", silent: true, z: 3, data: [[state.sel[0], state.sel[1]]], renderItem: function (p, api) {
            var g = fit(api, true), s1 = ang(api.value(0)), s2 = ang(api.value(1) + .999), kids = [];
            kids.push({ type: "sector", shape: { cx: g.c[0], cy: g.c[1], r0: inner * g.k, r: R * g.k, startAngle: s1, endAngle: s2 }, style: { fill: "rgba(42,157,143,.12)", stroke: "#2a9d8f", lineWidth: 1.6 } });
            [[api.value(0), s1], [api.value(1), s2]].forEach(function (q) { kids.push({ type: "circle", shape: { cx: g.c[0] + Math.cos(q[1]) * (R + 2) * g.k, cy: g.c[1] + Math.sin(q[1]) * (R + 2) * g.k, r: 4 * g.k + 1 }, style: { fill: "#2a9d8f" } });
              kids.push({ type: "text", style: { text: String(q[0]), x: g.c[0] + Math.cos(q[1]) * (R - 34) * g.k, y: g.c[1] + Math.sin(q[1]) * (R - 34) * g.k, align: "center", verticalAlign: "middle", fill: "#2a9d8f", font: "700 " + Math.max(9, 12 * g.k) + "px " + C.font } }); });
            return { type: "group", children: kids };
          } }
        ]
      };
    }, function (chart) {
      chart.on("click", { seriesId: "arcs" }, function (p) { state.feat = state.feat === p.dataIndex ? null : p.dataIndex; render(true); });
      // drag round the ring to choose days (not when starting on a topic arc)
      var zr = chart.getZr(), dragging = null;
      function polar(e) { var w = chart.getWidth(), hh = chart.getHeight(), k = Math.min(w / W, hh / H), ox = (w - W * k) / 2, oy = (hh - H * k) / 2;
        var x = CX + ((e.offsetX - ox) / k - CX) / state.zoom, y = CY + ((e.offsetY - oy) / k - CY) / state.zoom, a = Math.atan2(y - CY, x - CX) * 180 / Math.PI + 90; if (a < 0) a += 360;
        return { r: Math.hypot(x - CX, y - CY), day: Math.min(30, 1 + Math.floor(a / 12)) }; }
      function onArc(q) { return data.feats.some(function (f) { var r2 = lane0 - f.lane * (lw + gap); return q.r >= r2 - lw && q.r <= r2 && q.day >= f.a && q.day <= f.b; }); }
      function setSel() { chart.setOption({ series: [{ id: "sel", data: [[state.sel[0], state.sel[1]]] }] }, { lazyUpdate: true }); }
      zr.on("mousedown", function (e) { var q = polar(e); if (q.r > R + 12 || onArc(q)) return; dragging = q.day; state.sel = [q.day, q.day]; setSel(); });
      zr.on("mousemove", function (e) { if (dragging === null) return; var d2 = polar(e).day; state.sel = [Math.min(dragging, d2), Math.max(dragging, d2)]; setSel(); });
      zr.on("mouseup", function () { if (dragging !== null) { dragging = null; render(true); } });
      zr.on("globalout", function () { if (dragging !== null) { dragging = null; render(true); } });
    });
    mapBox.appendChild(wheelEl);

    // ---------- bottom panels ----------
    var sd = data.days.slice(state.sel[0] - 1, state.sel[1]), avg = Math.round(sd.reduce(function (s, x) { return s + x.load; }, 0) / sd.length), sum = sd.reduce(function (s, x) { return s + x.ci; }, 0);
    var inSel = data.feats.filter(function (f) { return f.b >= state.sel[0] && f.a <= state.sel[1]; });
    var focus = state.feat !== null ? data.feats[state.feat] : inSel[0] || data.feats[0], ftp = TOPICS[focus.t];
    var first = sd[0].load, last = sd[sd.length - 1].load, tr = last - first > 4 ? t.up : first - last > 4 ? t.down : t.flat;
    var bot = h("div", "cx-bottom");
    var p1el = h("div", "cx-panel cx-desc", '<div class="cx-chips">' + inSel.map(function (f) { var i = data.feats.indexOf(f); return '<button type="button" class="cx-chip' + (f === focus ? " on" : "") + '" data-f="' + i + '" style="--c:' + TOPICS[f.t].c + '">' + nm(TOPICS[f.t]) + "</button>"; }).join("") + "</div>" +
      "<p><b>" + nm(ftp) + "</b> – " + (lang() === "en" ? ftp.dEn : ftp.dId) + "</p>");
    p1el.querySelectorAll(".cx-chip").forEach(function (b) { b.addEventListener("click", function () { state.feat = +b.dataset.f; render(true); }); });
    var p2el = h("div", "cx-panel cx-props", "<header><b>" + nm(ftp) + "</b><span>" + t.day + " " + focus.a + "–" + focus.b + "</span></header><dl>" +
      "<dt>" + t.source + "</dt><dd>" + (ind ? t.ind : t.agg) + "</dd>" +
      (ind ? "<dt>" + t.consent + "</dt><dd>" + t.cv + "</dd>" : "<dt>" + t.kmin + "</dt><dd>" + t.kv + "</dd>") +
      "<dt>" + t.trend + "</dt><dd>" + tr + "</dd>" +
      (focus.share ? "<dt>" + (lang() === "en" ? "Share of check-ins" : "Porsi check-in") + "</dt><dd>" + focus.share + "%</dd>" : "") + "</dl>");
    var p3el = h("div", "cx-panel cx-range", t.day + " " + state.sel[0] + "–" + state.sel[1] + " (" + sd.length + " " + t.days + "), " + t.avg + ": " + avg + ", " + t.sum + ": " + sum.toLocaleString("id-ID"));
    var p4el = h("div", "cx-panel cx-legend", "<header><b>" + t.legend + "</b></header><ul>" + TOPICS.filter(function (tp, i) { return data.feats.some(function (f) { return f.t === i; }); }).map(function (tp) { return '<li><i style="--c:' + tp.c + '"></i>' + nm(tp) + "</li>"; }).join("") + "</ul>");
    var mid = h("div", "cx-midcol"); mid.appendChild(p2el); mid.appendChild(p3el);
    bot.appendChild(p1el); bot.appendChild(mid); bot.appendChild(p4el);
    mapBox.appendChild(bot);
    body.appendChild(mapBox);

    // ---------- right: linear tracks in blocks of 10 days (ECharts custom series) ----------
    var side = h("div", "cx-side");
    [[1, 10], [11, 20], [21, 30]].forEach(function (blk) {
      var ML = 104, BW = 704, cw = (BW - ML) / 10, inBlk = data.feats.filter(function (f) { return !(f.b < blk[0] || f.a > blk[1]); }), rows = Math.max(1, inBlk.length), BH = 64 + rows * 26 + 30, ay = 50 + rows * 26 + 6, TOPY = 20;
      var lvC = { 1: ["#d8efe4", "#2b6b56"], 2: ["#f8e2b5", "#8a5a12"], 3: ["#f5c0b0", "#9a3b26"] };
      function S(api) { var k = api.getWidth() / BW; return { k: k, X: function (x) { return x * k; }, Y: function (y) { return (y + TOPY) * k; } }; }
      var blkEl = ech("cx-lin", BW + " / " + (BH + TOPY), function () {
        var ink2 = C.ink2(), ink3 = C.ink3(), line = C.line();
        return {
          tooltip: C.tooltip({ trigger: "item" }),
          series: [
            { id: "frame", type: "custom", coordinateSystem: "none", silent: true, data: [0], renderItem: function (p, api) {
              var g = S(api), kids = [], fs = Math.max(9, 12 * g.k) + "px " + C.font;
              [[18, t.load, 600, ink2], [40, t.ci, 500, ink3], [ay + 20, t.day, 500, ink3]].forEach(function (q) { kids.push({ type: "text", style: { text: q[1], x: 0, y: g.Y(q[0]), verticalAlign: "bottom", fill: q[3], font: q[2] + " " + fs } }); });
              kids.push({ type: "line", shape: { x1: g.X(ML), x2: g.X(BW), y1: g.Y(ay), y2: g.Y(ay) }, style: { stroke: line, lineWidth: 1 } });
              for (var de = blk[0]; de <= blk[1]; de += 2) { var xx = g.X(ML + (de - blk[0]) * cw + cw / 2);
                kids.push({ type: "line", shape: { x1: xx, x2: xx, y1: g.Y(ay), y2: g.Y(ay + 5) }, style: { stroke: line } });
                kids.push({ type: "text", style: { text: String(de), x: xx, y: g.Y(ay + 20), align: "center", verticalAlign: "bottom", fill: ink3, font: fs } }); }
              var o1 = Math.max(state.sel[0], blk[0]), o2 = Math.min(state.sel[1], blk[1]);
              if (o1 <= o2) { var rx1 = g.X(ML + (o1 - blk[0]) * cw), rx2 = g.X(ML + (o2 - blk[0] + 1) * cw);
                kids.push({ type: "rect", shape: { x: rx1, y: g.Y(2), width: rx2 - rx1, height: g.Y(ay) - g.Y(2) }, style: { fill: "rgba(42,157,143,.08)", stroke: "#2a9d8f", lineWidth: 1.2 } });
                if (o1 === state.sel[0]) kids.push({ type: "rect", shape: { x: rx1, y: g.Y(-16), width: 26 * g.k, height: 16 * g.k, r: 3 }, style: { fill: "#2a9d8f" }, textContent: { style: { text: String(state.sel[0]), fill: "#fff", font: "700 " + Math.max(8, 11 * g.k) + "px " + C.font } }, textConfig: { position: "inside" } });
                if (o2 === state.sel[1]) kids.push({ type: "rect", shape: { x: rx2 - 26 * g.k, y: g.Y(-16), width: 26 * g.k, height: 16 * g.k, r: 3 }, style: { fill: "#2a9d8f" }, textContent: { style: { text: String(state.sel[1]), fill: "#fff", font: "700 " + Math.max(8, 11 * g.k) + "px " + C.font } }, textConfig: { position: "inside" } }); }
              return { type: "group", children: kids };
            } },
            { id: "days", type: "custom", coordinateSystem: "none",
              data: data.days.slice(blk[0] - 1, blk[1]).map(function (dy) { return { value: [dy.d, dy.load, dy.ci] }; }),
              tooltip: { formatter: function (p) { var lv = p.value[1] >= 65 ? 3 : p.value[1] >= 40 ? 2 : 1; return "<b>" + t.day + " " + p.value[0] + "</b><br>" + t.load + " " + p.value[1] + " (" + t.lvN[lv] + ")<br>" + p.value[2] + " " + t.ci.toLowerCase(); } },
              renderItem: function (p, api) {
                var g = S(api), dd = api.value(0), load = api.value(1), ci = api.value(2), lv = load >= 65 ? 3 : load >= 40 ? 2 : 1, x = ML + (dd - blk[0]) * cw + cw / 2;
                return { type: "group", children: [
                  { type: "rect", shape: { x: g.X(x - cw / 2 + 4), y: g.Y(2), width: (cw - 8) * g.k, height: 22 * g.k, r: 5 * g.k }, style: { fill: lvC[lv][0] },
                    enterFrom: { style: { opacity: 0 } }, enterAnimation: { delay: (dd - blk[0]) * 40, duration: 500 } },
                  { type: "text", silent: true, style: { text: String(load), x: g.X(x), y: g.Y(13), align: "center", verticalAlign: "middle", fill: lvC[lv][1], font: "700 " + Math.max(9, 12 * g.k) + "px " + C.font } },
                  { type: "text", silent: true, style: { text: ind ? (ci ? "●".repeat(ci) : "–") : String(ci), x: g.X(x), y: g.Y(36), align: "center", verticalAlign: "middle", fill: C.ink3(), font: "500 " + Math.max(8.5, 11 * g.k) + "px " + C.font } }
                ] };
              } },
            { id: "bars", type: "custom", coordinateSystem: "none",
              data: inBlk.map(function (f) { return { value: [f.a, f.b], name: nm(TOPICS[f.t]), itemStyle: { color: TOPICS[f.t].c } }; }),
              tooltip: { formatter: function (p) { return "<b>" + p.name + "</b><br>" + t.day + " " + p.value[0] + "–" + p.value[1]; } },
              renderItem: function (p, api) {
                var g = S(api), f = inBlk[p.dataIndex], a = Math.max(f.a, blk[0]), b2 = Math.min(f.b, blk[1]), x1 = ML + (a - blk[0]) * cw + 2, x2 = ML + (b2 - blk[0] + 1) * cw - 2, y = 50 + p.dataIndex * 26, end = f.b <= blk[1];
                var pts = end ? [[x1, y], [x2 - 10, y], [x2, y + 10], [x2 - 10, y + 20], [x1, y + 20]] : [[x1, y], [x2, y], [x2, y + 20], [x1, y + 20]];
                var kids = [{ type: "polygon", shape: { points: pts.map(function (q) { return [g.X(q[0]), g.Y(q[1])]; }) }, style: { fill: api.visual("color"), opacity: .9 },
                  enterFrom: { scaleX: 0, originX: g.X(x1) }, enterAnimation: { delay: 200 + p.dataIndex * 80, duration: 700, easing: "cubicOut" } }];
                if (x2 - x1 > 70) kids.push({ type: "text", silent: true, style: { text: p.name || nm(TOPICS[f.t]), x: g.X((x1 + x2) / 2), y: g.Y(y + 10), align: "center", verticalAlign: "middle", fill: "#1d2626", font: "600 " + Math.max(8.5, 11 * g.k) + "px " + C.font } });
                return { type: "group", children: kids };
              } }
          ]
        };
      });
      var wrap = h("div", "cx-blk"); wrap.appendChild(blkEl); side.appendChild(wrap);
    });
    side.insertBefore(h("div", "cx-sidehead", "<b>" + t.sideTitle + "</b><span>" + t.keyNote + "</span><ul><li><i class='cx-lv1'></i>" + t.lvN[1] + " &lt; 40</li><li><i class='cx-lv2'></i>" + t.lvN[2] + " 40–64</li><li><i class='cx-lv3'></i>" + t.lvN[3] + " ≥ 65</li></ul>"), side.firstChild);
    body.appendChild(side);
    app.appendChild(body);
    if (!ind) app.appendChild(attention(tab));
    app.appendChild(insights(tab, ind));
    app.appendChild(h("p", "cx-note", ind ? t.indNote : t.aggNote));
  }

  // ---------- analytics: the home page's Tableau-style dashboard, fed with this institution's units ----------
  function viewDash(tab, ind) {
    var en = lang() === "en", wrap = h("div", "cx-view cx-dv dv-dash");
    if (ind || !window.N2Dash) { wrap.appendChild(h("section", "cx-card", "<p>" + (en ? "Analytics are only shown for aggregate views." : "Analitik hanya ditampilkan pada tampilan agregat.") + "</p>")); return wrap; }
    var base = [0.3, 0.24, 0.19, 0.15, 0.12].slice(0, tab.units.length), sum = base.reduce(function (a, b) { return a + b; }, 0);
    var root = h("div", "dv"); wrap.appendChild(root);
    window.N2Dash.mount(root, { seed: tab.seed, users: tab.n, units: tab.units, weights: base.map(function (w) { return w / sum; }),
      unitLabel: { id: "Unit", en: "Unit" }, allLabel: { id: "Semua unit", en: "All units" }, riskTitle: { id: "Dukungan per unit", en: "Support by unit" }, riskSub: { id: "% check-in per unit", en: "% of check-ins per unit" }, mascot: false });
    return wrap;
  }
  // ---------- other views: trends, units, reports, settings ----------
  function linechart(vals, avg, events, w, hgt, cls) {
    var small = cls === "cx-small", n = vals.length, pk = vals.indexOf(Math.max.apply(0, vals)), en = lang() === "en";
    return ech(cls || "cx-big", w + " / " + hgt, function () {
      var ink3 = C.ink3(), line = C.line();
      return {
        grid: small ? { left: 26, right: 8, top: 10, bottom: 20 } : { left: 36, right: 18, top: events ? 52 : 26, bottom: 26 },
        tooltip: C.tooltip({ trigger: "axis", axisPointer: { type: "line", lineStyle: { color: ink3, type: [3, 3] } },
          formatter: function (ps) { var i = ps[0].dataIndex; return "<b>" + L().day + " " + (i + 1) + "</b><br>" + (en ? "Load " : "Beban ") + Math.round(vals[i]) + (avg ? "<br>" + (en ? "7-day average " : "Rata-rata 7 hari ") + Math.round(avg[i]) : ""); } }),
        xAxis: { type: "category", boundaryGap: false, data: vals.map(function (v, i) { return i + 1; }), axisLine: { lineStyle: { color: line } }, axisTick: { show: false }, axisLabel: { color: ink3, fontSize: small ? 9 : 11, interval: 4 } },
        yAxis: { type: "value", min: 0, max: 100, interval: small ? 50 : 25, axisLabel: { color: ink3, fontSize: small ? 9 : 11 }, splitLine: { lineStyle: { color: line } } },
        series: [
          { type: "line", data: vals.map(function (v) { return Math.round(v * 10) / 10; }), smooth: .25, symbol: "none", lineStyle: { color: "#2a9d8f", width: small ? 1.6 : 2.2 },
            areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(42,157,143,.22)" }, { offset: 1, color: "rgba(42,157,143,0)" }] } },
            // story: calendar events as labelled lines, and the peak marked, so the cause sits next to the effect
            markLine: events ? { silent: true, symbol: "none", lineStyle: { color: ink3, type: [4, 4], width: 1 }, label: { formatter: "{b}", position: "end", color: C.ink2(), fontSize: 10.5, fontWeight: 600 },
              data: events.map(function (e, i) { return { xAxis: e[0] - 1, name: nm(e[1]), label: { distance: i % 2 ? 18 : 4 } }; }) } : undefined,
            markPoint: small ? undefined : { symbol: "circle", symbolSize: 9, itemStyle: { color: "#2a9d8f", borderColor: C.surface(), borderWidth: 2 }, label: { show: true, position: "top", distance: 8, color: C.ink(), fontWeight: 600, fontSize: 11, formatter: (en ? "peak " : "puncak ") + Math.round(vals[pk]) }, data: [{ coord: [pk, vals[pk]] }] },
            animationDuration: 1500, animationEasing: "cubicInOut" }
        ].concat(avg ? [{ type: "line", data: avg.map(function (v) { return Math.round(v * 10) / 10; }), smooth: .3, symbol: "none", lineStyle: { color: ink3, width: 1.6 }, animationDuration: 1500, animationDelay: 250 }] : [])
      };
    });
  }
  function viewTrend(tab, ind, t) {
    var en = lang() === "en", wrap = h("div", "cx-view"), loads = data.days.map(function (d) { return d.load; });
    var avg = loads.map(function (v, i) { var a = loads.slice(Math.max(0, i - 6), i + 1); return a.reduce(function (s, x) { return s + x; }, 0) / a.length; });
    var c = h("section", "cx-card", "<header><b>" + (en ? "Daily emotional load" : "Beban emosional harian") + "</b><span>" + (en ? "0 = light, 100 = heavy · grey line = 7-day average · dashed = calendar events" : "0 = ringan, 100 = berat · garis abu = rata-rata 7 hari · garis putus = acara kalender") + "</span></header>");
    c.appendChild(linechart(loads, avg, tab.events, 1000, 300)); wrap.appendChild(c);
    var grid = h("div", "cx-sm");
    TOPICS.forEach(function (tp, ti) {
      var f = data.feats.filter(function (q) { return q.t === ti; })[0]; if (!f) return;
      var vals = data.days.map(function (d) { var inside = d.d >= f.a && d.d <= f.b; return Math.max(5, Math.min(95, (inside ? 55 + (d.load - 50) * .6 : 18 + (d.load - 50) * .2))); });
      var card = h("section", "cx-card", "<header><b><i class='cx-dot' style='background:" + tp.c + "'></i>" + nm(tp) + "</b><span>" + (en ? "high on days " : "tinggi pada hari ") + f.a + "–" + f.b + "</span></header>");
      card.appendChild(linechart(vals, null, null, 320, 130, "cx-small")); grid.appendChild(card);
    });
    wrap.appendChild(grid); return wrap;
  }
  function viewUnit(tab, ind, t) {
    var en = lang() === "en", wrap = h("div", "cx-view");
    if (ind) { wrap.appendChild(h("section", "cx-card", "<p>" + (en ? "Units are only shown for aggregate views." : "Unit hanya ditampilkan pada tampilan agregat.") + "</p>")); return wrap; }
    var r = rng(91 + tab.seed), rows = tab.units.map(function (u) { var load = Math.round(40 + r() * 35); return { u: u, users: Math.round(tab.n / tab.units.length * (.6 + r() * .8)), load: load, high: (1.5 + r() * 4).toFixed(1).replace(".", ","), top: TOPICS[Math.floor(r() * 5)] }; });
    var c = h("section", "cx-card", "<header><b>" + (en ? "Units" : "Unit") + "</b><span>" + (en ? "Only units with at least 10 people are shown" : "Hanya unit dengan minimal 10 orang yang ditampilkan") + "</span></header><table class='cx-tbl'><thead><tr><th>" + (en ? "Unit" : "Unit") + "</th><th>" + (en ? "Active users" : "Pengguna aktif") + "</th><th>" + (en ? "Average load" : "Beban rata-rata") + "</th><th>" + (en ? "High-need signals" : "Sinyal kebutuhan tinggi") + "</th><th>" + (en ? "Top topic" : "Topik teratas") + "</th></tr></thead><tbody>" +
      rows.map(function (x) { var lv = x.load >= 65 ? 3 : x.load >= 40 ? 2 : 1; return "<tr><td><b>" + x.u + "</b></td><td>" + x.users.toLocaleString("id-ID") + "</td><td><span class='cx-lbar'><i class='cx-lv" + lv + "' style='width:" + x.load + "%'></i></span>" + x.load + "</td><td>" + x.high + "%</td><td><span class='cx-chip on' style='--c:" + x.top.c + "'>" + nm(x.top) + "</span></td></tr>"; }).join("") + "</tbody></table>");
    wrap.appendChild(c); wrap.appendChild(insights(tab, ind)); return wrap;
  }
  function viewReport(tab, ind, t) {
    var en = lang() === "en", wrap = h("div", "cx-view cx-rep"), loads = data.days.map(function (d) { return d.load; }), avg = Math.round(loads.reduce(function (s, x) { return s + x; }, 0) / 30), pk = loads.indexOf(Math.max.apply(0, loads)) + 1, ci = data.days.reduce(function (s, d) { return s + d.ci; }, 0);
    var top = data.feats.slice().sort(function (a, b) { return (b.share || 0) - (a.share || 0); })[0];
    var doc = h("section", "cx-card cx-doc", "<header><b>" + t.report + " · " + tab.name + "</b><span>" + (en ? "1–30 Nov 2026 · sample data" : "1–30 Nov 2026 · data contoh") + "</span></header>" +
      "<div class='cx-kpis'><div><small>" + (en ? "Check-ins" : "Check-in") + "</small><b>" + ci.toLocaleString("id-ID") + "</b></div><div><small>" + (en ? "Average load" : "Beban rata-rata") + "</small><b>" + avg + "</b></div><div><small>" + (en ? "Peak day" : "Hari puncak") + "</small><b>" + pk + "</b></div><div><small>" + (en ? "Main topic" : "Topik utama") + "</small><b>" + nm(TOPICS[top.t]) + "</b></div></div>" +
      "<h4>" + (en ? "Highlights" : "Sorotan") + "</h4><ul><li>" + (en ? "Load peaked on day " + pk + ", around " + nm(tab.events[2][1]).toLowerCase() + "." : "Beban memuncak pada hari " + pk + ", sekitar " + nm(tab.events[2][1]).toLowerCase() + ".") + "</li><li>" + (en ? nm(TOPICS[top.t]) + " was the most common topic." : nm(TOPICS[top.t]) + " menjadi topik paling sering.") + "</li><li>" + (en ? "Most check-ins happen between 21:00 and 01:00." : "Check-in paling banyak terjadi pukul 21.00–01.00.") + "</li></ul>" +
      "<h4>" + (en ? "Recommended actions" : "Saran tindakan") + "</h4><ol><li>" + (en ? "Add counsellor slots in the two weeks before exams." : "Tambah slot konselor dua minggu sebelum ujian.") + "</li><li>" + (en ? "Offer an evening session once a week." : "Buka satu sesi malam setiap minggu.") + "</li><li>" + (en ? "Run a short campaign on sleep and stress." : "Kampanye singkat tentang tidur dan stres.") + "</li></ol>");
    doc.appendChild(linechart(loads, null, tab.events, 1000, 220));
    var dl = h("button", "pbtn pbtn-light cx-dl", "<span class='pbtn-t'>" + t.pdf + "</span>"); dl.type = "button"; dl.addEventListener("click", function () { app.querySelector(".cx-pdf").click(); }); doc.appendChild(dl);
    var past = h("section", "cx-card cx-past", "<header><b>" + (en ? "Earlier reports" : "Laporan sebelumnya") + "</b></header><ul>" + ["Okt 2026", "Sep 2026", "Agu 2026", "Jul 2026"].map(function (m) { return "<li><span>" + t.report + " · " + (en ? m.replace("Okt", "Oct").replace("Agu", "Aug") : m) + "</span><button type='button'>PDF</button></li>"; }).join("") + "</ul>");
    past.querySelectorAll("button").forEach(function (b) { b.addEventListener("click", function () { app.querySelector(".cx-pdf").click(); }); });
    wrap.appendChild(doc); wrap.appendChild(past); return wrap;
  }
  function viewSettings(tab, ind, t) {
    var en = lang() === "en", wrap = h("div", "cx-view");
    function row(lab, sub, ctl) { return "<div class='cx-set'><div><b>" + lab + "</b><span>" + sub + "</span></div>" + ctl + "</div>"; }
    function tog(on, lock) { return "<label class='cx-tog'><input type='checkbox'" + (on ? " checked" : "") + (lock ? " disabled" : "") + "><i></i></label>"; }
    var c = h("section", "cx-card cx-settings", "<header><b>" + (en ? "Settings · " : "Pengaturan · ") + tab.name + "</b><span>" + (en ? "Demo: changes are not saved" : "Demo: perubahan tidak disimpan") + "</span></header>" +
      row(en ? "Privacy threshold" : "Ambang privasi", en ? "Hide any group smaller than this" : "Sembunyikan kelompok yang lebih kecil dari ini", "<select><option>5</option><option selected>10</option><option>20</option></select>") +
      row(en ? "Consent before a profile opens" : "Izin sebelum profil dibuka", en ? "Always required, except life-threatening emergencies" : "Selalu wajib, kecuali darurat yang mengancam nyawa", tog(true, true)) +
      row(en ? "Clinical attention list" : "Daftar perhatian klinis", en ? "Visible to the assigned clinical team only" : "Hanya terlihat oleh tim klinis yang ditunjuk", "<select><option>" + (en ? "Clinical team" : "Tim klinis") + "</option><option>" + (en ? "Off" : "Nonaktif") + "</option></select>") +
      row(en ? "Weekly summary email" : "Ringkasan mingguan via email", en ? "Every Monday, aggregate numbers only" : "Setiap Senin, hanya angka agregat", tog(true)) +
      row(en ? "Alert on urgent signals" : "Notifikasi sinyal mendesak", en ? "Sent to the on-call psychologist" : "Dikirim ke psikolog jaga", tog(true)) +
      row(en ? "Data retention" : "Penyimpanan data", en ? "Aggregates kept, raw conversations deleted after" : "Agregat disimpan, percakapan mentah dihapus setelah", "<select><option>30 " + (en ? "days" : "hari") + "</option><option selected>90 " + (en ? "days" : "hari") + "</option></select>") +
      "<p class='cx-saved' hidden>" + (en ? "Saved (demo)" : "Tersimpan (demo)") + "</p><button type='button' class='pbtn pbtn-light cx-save'><span class='pbtn-t'>" + (en ? "Save" : "Simpan") + "</span></button>");
    c.querySelector(".cx-save").addEventListener("click", function () { var m = c.querySelector(".cx-saved"); m.hidden = false; setTimeout(function () { m.hidden = true; }, 1800); });
    wrap.appendChild(c); return wrap;
  }
  var VIEWS = [null, viewDash, viewTrend, viewUnit, viewReport, viewSettings];
  // ---------- clinical attention list: masked people whose conversations show serious risk signals ----------
  function attention(tab) {
    var en = lang() === "en", r = rng(500 + tab.seed * 17);
    var SIG = [
      { id: "Tanda psikosis (mis. mendengar suara)", en: "Possible psychosis signs (e.g. hearing voices)", lv: 3 },
      { id: "Pikiran menyakiti diri sendiri", en: "Thoughts of self-harm", lv: 3 },
      { id: "Gejala depresi berat, 2 minggu", en: "Severe depression symptoms, 2 weeks", lv: 2 },
      { id: "Serangan panik berulang", en: "Repeated panic attacks", lv: 2 },
      { id: "Pola makan sangat terganggu", en: "Severely disrupted eating", lv: 2 },
      { id: "Tidak tidur 3 malam berturut-turut", en: "No sleep for 3 nights", lv: 1 }];
    var ST = [{ id: "Dihubungi psikolog", en: "Contacted by psychologist" }, { id: "Rujukan dikirim", en: "Referral sent" }, { id: "Menunggu psikolog", en: "Waiting for psychologist" }, { id: "Sesi terjadwal", en: "Session booked" }];
    var first = ["Rizky", "Ayu", "Bima", "Sekar", "Dimas", "Nadia", "James", "Chloe", "Priya", "Oliver"], last = ["Pratama", "Lestari", "Wijaya", "Hall", "Patel", "Nguyen", "Smith"];
    function mask(w) { return w[0] + "•••" + w[w.length - 1]; }
    var rows = [];
    for (var i = 0; i < 6; i++) {
      var sg = SIG[i], fn = first[Math.floor(r() * first.length)], ln = last[Math.floor(r() * last.length)];
      rows.push({ pid: "P-0" + (300 + Math.floor(r() * 600)), name: mask(fn) + " " + ln[0] + ".", unit: tab.units[Math.floor(r() * tab.units.length)], sg: sg, seen: 1 + Math.floor(r() * 20), st: ST[sg.lv === 3 ? (i % 2) : 2 + (i % 2)], consent: sg.lv === 3 || r() > .3 });
    }
    rows.sort(function (a, b) { return b.sg.lv - a.sg.lv; });
    var lvName = { 3: en ? "Urgent" : "Segera", 2: en ? "High" : "Tinggi", 1: en ? "Watch" : "Pantau" };
    var card = h("section", "cx-card cx-att", "<header class='cx-atth'><div><b>" + (en ? "Needs clinical attention" : "Perlu perhatian klinis") + "</b><span>" + (en ? "People whose conversations show serious risk signals. Names are masked." : "Orang yang percakapannya menunjukkan sinyal risiko serius. Nama disamarkan.") + "</span></div>" +
      "<em class='cx-lock'><svg viewBox='0 0 16 16'><path d='M4 7V5a4 4 0 0 1 8 0v2M3 7h10v7H3z' fill='none' stroke='currentColor' stroke-width='1.5'/></svg>" + (en ? "Clinical team only · not visible to institution admins" : "Hanya tim klinis · tidak terlihat oleh admin institusi") + "</em></header>" +
      "<table><thead><tr><th>ID</th><th>" + (en ? "Name" : "Nama") + "</th><th>" + (en ? "Unit" : "Unit") + "</th><th>" + (en ? "Signal" : "Sinyal") + "</th><th>" + (en ? "Level" : "Tingkat") + "</th><th>" + (en ? "Last check-in" : "Check-in terakhir") + "</th><th>Status</th><th></th></tr></thead><tbody>" +
      rows.map(function (x) { return "<tr><td class='mono'>" + x.pid + "</td><td><span class='cx-mask'>" + x.name + "</span>" + (x.consent ? "" : "<small>" + (en ? "no consent to share" : "belum izin berbagi") + "</small>") + "</td><td>" + x.unit + "</td><td>" + x.sg[lang()] + "</td>" +
        "<td><span class='cx-lv l" + x.sg.lv + "'><svg viewBox='0 0 10 10'><path d='" + (x.sg.lv === 3 ? "M5 1L9.5 9H.5Z" : x.sg.lv === 2 ? "M1 1h8v8H1z" : "M5 1a4 4 0 1 0 .01 0") + "'/></svg>" + lvName[x.sg.lv] + "</span></td><td>" + x.seen + " " + (en ? "Nov" : "Nov") + "</td><td>" + x.st[lang()] + "</td>" +
        "<td><button type='button' class='cx-open'" + (x.consent ? "" : " disabled") + ">" + (en ? "Open" : "Buka") + "</button></td></tr>"; }).join("") + "</tbody></table>" +
      "<p class='cx-attnote'>" + (en ? "Signals, not diagnoses: a psychologist assesses every case. A profile opens only with the person's consent, except when life is at risk (emergency protocol)." : "Sinyal, bukan diagnosis: setiap kasus dinilai psikolog. Profil hanya bisa dibuka atas izin orangnya, kecuali saat nyawa terancam (protokol darurat).") + "</p>");
    card.querySelectorAll(".cx-open").forEach(function (b) { b.addEventListener("click", function () { state.tab = 2; state.feat = null; data = build(TABS[2]); render(); window.scrollTo({ top: app.getBoundingClientRect().top + scrollY - 110, behavior: "smooth" }); }); });
    return card;
  }
  // ---------- insight row: petal profile, support journey, unit domes ----------
  function insights(tab, ind) {
    var en = lang() === "en", r = rng(77 + tab.seed * 31), row = h("div", "cx-ins");
    // 1. petal wheel
    var dims = [["Tidur", "Sleep", "#5b4ff5", "M4 9h8M4 9V6h8v3M5 6V4h6v2"], ["Stres", "Stress", "#ff5a1f", "M8 2a5 5 0 0 1 0 10M8 2a5 5 0 0 0 0 10M6 7h4"], ["Relasi", "Relationships", "#ff2d55", "M8 13S2 9.5 2 6a3 3 0 0 1 6-1 3 3 0 0 1 6 1c0 3.5-6 7-6 7z"],
      ["Energi", "Energy", "#c32ee6", "M9 1L4 9h4l-1 6 5-8H8z"], ["Fokus", "Focus", "#0a84ff", "M8 3a5 5 0 1 0 .01 0M8 6a2 2 0 1 0 .01 0"], ["Dukungan sosial", "Social support", "#00b8a9", "M5 6a2 2 0 1 0 .01 0M11 6a2 2 0 1 0 .01 0M2 13c0-2 2-3 3-3s3 1 3 3M8 13c0-2 2-3 3-3s3 1 3 3"]];
    var vals = dims.map(function (d, i) { return ind ? [.35, .7, .5, .4, .55, .8][i] : .3 + r() * .6; });
    var c1 = h("section", "cx-card", "<header><b>" + (en ? "Wellbeing profile" : "Profil kesejahteraan") + "</b><span>" + (en ? "share reporting things are okay, per area" : "porsi yang melaporkan baik-baik saja, per area") + "</span></header>");
    // story: the wellbeing profile as a rose; the weakest area is pulled out so it reads first
    var low = vals.indexOf(Math.min.apply(0, vals));
    c1.appendChild(ech("cx-petals", "1 / 1", function () {
      return {
        tooltip: C.tooltip({ trigger: "item", formatter: function (p) { return "<b>" + p.name + "</b><br>" + p.value + "%"; } }),
        series: [
          { type: "pie", roseType: false, radius: ["14%", "94%"], silent: true, startAngle: 90 + 360 / dims.length / 2, label: { show: false }, data: dims.map(function (d) { return { value: 1, itemStyle: { color: "rgba(0,0,0,0)", borderColor: d[2], borderWidth: 1.2, opacity: .55 } }; }) },
          { type: "pie", roseType: "radius", radius: ["14%", "86%"], startAngle: 90 + 360 / dims.length / 2, itemStyle: { borderRadius: 8, borderColor: C.surface(), borderWidth: 3 },
            label: { show: true, position: "inside", formatter: "{c}%", color: "#fff", fontWeight: 700, fontSize: 11 },
            data: dims.map(function (d, i) { return { name: d[en ? 1 : 0], value: Math.round(vals[i] * 100), selected: i === low, itemStyle: { color: d[2] } }; }), selectedOffset: 8,
            animationType: "scale", animationEasing: "elasticOut", animationDuration: 1400, animationDelay: function (i) { return i * 120; } }
        ]
      };
    }));
    c1.appendChild(h("ul", "cx-plg", dims.map(function (d, i) { return '<li><i style="background:' + d[2] + '"></i>' + d[en ? 1 : 0] + " <b>" + Math.round(vals[i] * 100) + "%</b></li>"; }).join("")));
    row.appendChild(c1);
    // 2. support journey (lifecycle)
    var steps = ind ? [[en ? "First check-in" : "Check-in pertama", 1], [en ? "Self-guided" : "Latihan mandiri", 1], [en ? "With Nesya" : "Bersama Nesya", 1], [en ? "Referral" : "Rujukan", 1], [en ? "Psychologist" : "Psikolog", 1], [en ? "Steady" : "Stabil", 0]].map(function (x) { return [x[0], x[1] ? .45 : .15]; })
      : [[en ? "First check-in" : "Check-in pertama", 1], [en ? "Self-guided" : "Latihan mandiri", .54], [en ? "With Nesya" : "Bersama Nesya", .31], [en ? "Referral" : "Rujukan", .12], [en ? "Psychologist" : "Psikolog", .09], [en ? "Steady" : "Stabil", .71]];
    var c2 = h("section", "cx-card cx-wide", "<header><b>" + (en ? "Support journey" : "Perjalanan dukungan") + "</b><span>" + (ind ? (en ? "this person's path, with consent" : "jalur orang ini, atas izin") : (en ? "share of users reaching each step" : "porsi pengguna yang mencapai tiap tahap")) + "</span></header>");
    var pos = [[70, 150], [210, 70], [210, 200], [360, 200], [480, 130], [585, 70]], cols = ["#f5b44a", "#9bd36a", "#a9dbf5", "#f5e15a", "#7fd1c7", "#2a9d8f"];
    var links = [[0, 1], [0, 2], [1, 5], [2, 3], [3, 4], [4, 5], [2, 5]];
    // story: one path from first check-in to steady, circle size = share of people who get there
    var js = ech("cx-journey", "640 / 260", function () {
      var box = { left: 70, right: 70, top: 46, bottom: 52 }, nodes = function (lab) { return steps.map(function (st, i) { return Object.assign({ name: st[0], x: pos[i][0], y: pos[i][1], symbolSize: (18 + 30 * st[1]) * 2 }, lab(st, i)); }); };
      return {
        tooltip: C.tooltip({ trigger: "item", formatter: function (p) { return p.dataType === "node" ? "<b>" + p.name + "</b>" + (ind ? "" : "<br>" + Math.round(steps[p.dataIndex][1] * 100) + "%") : ""; } }),
        series: [
          Object.assign({ type: "graph", layout: "none", roam: false, edgeSymbol: ["none", "arrow"], edgeSymbolSize: 8, z: 2,
            data: nodes(function (st, i) { return { itemStyle: { color: cols[i], opacity: .92 }, label: { show: !ind, position: "inside", formatter: Math.round(st[1] * 100) + "%", color: "#1d2626", fontSize: 12, fontWeight: 700 } }; }),
            links: links.map(function (l, i) { return { source: l[0], target: l[1], lineStyle: { color: "#7fb9c9", width: 2, opacity: .9, type: i === 6 ? [5, 5] : "solid" } }; }),
            animationDuration: 1100, animationEasing: "cubicOut", animationDelay: function (i) { return i * 140; } }, box),
          Object.assign({ type: "graph", layout: "none", roam: false, silent: true, z: 1,
            data: nodes(function () { return { itemStyle: { color: "rgba(0,0,0,0)" }, label: { show: true, position: "bottom", distance: 6, formatter: "{b}", color: C.ink(), fontSize: 11.5, fontWeight: 600 } }; }), links: [] }, box)
        ],
        graphic: [{ type: "text", left: 12, top: 8, style: { text: en ? "Newcomer → steady" : "Baru → stabil", fill: C.ink3(), font: "600 11px " + C.font } }]
      };
    });
    c2.appendChild(js); row.appendChild(c2);
    // 3. unit domes (geosocial)
    if (!ind) {
      var c3 = h("section", "cx-card", "<header><b>" + (en ? "Units at a glance" : "Unit sekilas") + "</b><span>" + (en ? "dome size = active users · colour = load" : "besar kubah = pengguna aktif · warna = beban") + "</span></header>");
      var dc = ["#f26b4f", "#1fb6e8", "#e2559d", "#c7d93b", "#f0a33a", "#7fd1c7"];
      var units = tab.units.map(function (u, i) { var a = (-200 + i * 360 / tab.units.length) * Math.PI / 180; return { u: u, i: i, x: 180 + Math.cos(a) * 118, y: 150 + Math.sin(a) * 58, w: 22 + Math.round(r() * 30), load: Math.round(40 + r() * 40) }; })
        .sort(function (a, b) { return a.y - b.y; });
      var ds = ech("cx-domes", "360 / 250", function () {
        return {
          tooltip: C.tooltip({ trigger: "item", formatter: function (p) { var d = units[p.dataIndex]; return "<b>" + d.u + "</b><br>" + (en ? "Average load " : "Beban rata-rata ") + d.load; } }),
          series: [{ type: "custom", coordinateSystem: "none", data: units.map(function (d) { return d.load; }), renderItem: function (p, api) {
            var k = Math.min(api.getWidth() / 360, api.getHeight() / 250), ox = (api.getWidth() - 360 * k) / 2, oy = (api.getHeight() - 250 * k) / 2, d = units[p.dataIndex], col = dc[d.i % dc.length], kids = [];
            var X = function (x) { return ox + x * k; }, Y = function (y) { return oy + y * k; }, pts = [];
            if (p.dataIndex === 0) kids.push({ type: "ellipse", silent: true, shape: { cx: X(180), cy: Y(150), rx: 118 * k, ry: 58 * k }, style: { fill: "none", stroke: "#8a96a8", lineWidth: 1 } });
            for (var j = 0; j <= 24; j++) { var a = Math.PI + Math.PI * j / 24; pts.push([X(d.x + Math.cos(a) * d.w), Y(d.y + Math.sin(a) * d.w * .82)]); }
            for (j = 24; j >= 0; j--) { var b2 = Math.PI * j / 24; pts.push([X(d.x + Math.cos(b2) * d.w), Y(d.y + Math.sin(b2) * d.w * .22)]); }
            kids.push({ type: "polygon", shape: { points: pts }, style: { fill: col, opacity: .85 }, enterFrom: { scaleY: 0, originY: Y(d.y) }, enterAnimation: { delay: 150 + p.dataIndex * 120, duration: 900, easing: "backOut" } });
            kids.push({ type: "text", silent: true, style: { text: d.u, x: X(d.x), y: Y(d.y - d.w * .82 - 8), align: "center", verticalAlign: "bottom", fill: C.ink(), font: "600 " + Math.max(9, 11 * k) + "px " + C.font } });
            kids.push({ type: "rect", silent: true, shape: { x: X(d.x - 22), y: Y(d.y + d.w * .22 + 4), width: 44 * k, height: 16 * k, r: 8 * k }, style: { fill: "#fff", stroke: col },
              textContent: { style: { text: String(d.load), fill: "#1d2626", font: "700 " + Math.max(9, 11 * k) + "px " + C.font } }, textConfig: { position: "inside" } });
            return { type: "group", children: kids };
          } }]
        };
      });
      c3.appendChild(ds); row.appendChild(c3);
    }
    return row;
  }
  render();
  document.addEventListener("langchange", function () { render(); });
})();
