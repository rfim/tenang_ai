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
  function render() {
    var t = L(), tab = TABS[state.tab], ind = tab.kind === "ind";
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
        render();
      });
      rail.appendChild(b);
    });
    body.appendChild(rail);

    // ---------- the wheel ----------
    var mapBox = h("div", "cx-map");
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "cx-svg", role: "img", "aria-label": t.map });
    var g = el("g", { transform: "translate(" + CX + " " + CY + ") scale(" + state.zoom + ") translate(" + -CX + " " + -CY + ")" }, svg);
    el("circle", { cx: CX, cy: CY, r: R, class: "cx-ring" }, g);
    for (var d = 1; d <= 30; d++) {
      var a = ang(d), p1 = pt(a, R), p2 = pt(a, R + (d % 5 === 1 ? 10 : 5));
      el("line", { x1: p1[0], y1: p1[1], x2: p2[0], y2: p2[1], class: "cx-tick" }, g);
      if (d % 5 === 1 || d === 30) { var lp = pt(a, R - 16), tx = el("text", { x: lp[0], y: lp[1] + 4, class: "cx-num", "text-anchor": "middle" }, g); tx.textContent = d; }
    }
    // events around the outside
    if (state.labels) tab.events.forEach(function (e, i) {
      var a = ang(e[0]), p1 = pt(a, R + 4), p2 = pt(a, R + 40 + (i % 2) * 26), right = Math.cos(a) >= 0;
      el("polyline", { points: p1 + " " + p2 + " " + (p2[0] + (right ? 14 : -14)) + "," + p2[1], class: "cx-lead" }, g);
      var lb = el("text", { x: p2[0] + (right ? 18 : -18), y: p2[1] + 4, class: "cx-ev", "text-anchor": right ? "start" : "end" }, g); lb.textContent = nm(e[1]);
    });
    // feature arcs
    var lane0 = R - 30, lw = 15, gap = 3;
    data.feats.forEach(function (f, i) {
      var r2 = lane0 - f.lane * (lw + gap), r1 = r2 - lw, a1 = ang(f.a), a2 = ang(f.b), tp = TOPICS[f.t];
      var path = el("path", { d: arcPath(a1, a2, r1, r2, true), fill: tp.c, class: "cx-arc" + (state.feat === i ? " on" : "") + (state.feat !== null && state.feat !== i ? " dim" : "") }, g);
      path.addEventListener("click", function (ev) { ev.stopPropagation(); state.feat = state.feat === i ? null : i; render(); });
      var id = "cxp" + i, mid = (r1 + r2) / 2, s = pt(a1 + .03, mid), e2 = pt(a2 - .03, mid);
      el("path", { id: id, d: "M" + s + "A" + mid + " " + mid + " 0 " + (a2 - a1 > Math.PI ? 1 : 0) + " 1 " + e2, fill: "none" }, g);
      if ((a2 - a1) * mid > 9 * nm(tp).length) { var lab = el("text", { class: "cx-arclab" }, g); var tpth = el("textPath", { href: "#" + id, startOffset: "50%", "text-anchor": "middle" }, lab); tpth.textContent = nm(tp); }
    });
    // selection wedge
    var s1 = ang(state.sel[0]), s2 = ang(state.sel[1] + .999), inner = lane0 - data.lanes * (lw + gap) + gap - 4;
    el("path", { d: arcPath(s1, s2, inner, R, false), class: "cx-wedge" }, g);
    [[state.sel[0], s1], [state.sel[1], s2]].forEach(function (q) { var p = pt(q[1], R + 2); el("circle", { cx: p[0], cy: p[1], r: 4, class: "cx-wdot" }, g); var tp2 = pt(q[1], R - 34); var tt = el("text", { x: tp2[0], y: tp2[1] + 4, "text-anchor": "middle", class: "cx-wnum" }, g); tt.textContent = q[0]; });
    // centre
    el("circle", { cx: CX, cy: CY - 34, r: 25, class: "cx-clogo-bg" }, g);
    el("image", { href: tab.logo, x: CX - 20, y: CY - 54, width: 40, height: 40, preserveAspectRatio: "xMidYMid meet" }, g);
    var c1 = el("text", { x: CX, y: CY + 12, "text-anchor": "middle", class: "cx-cname" }, g); c1.textContent = ind ? tab.name : tab.title;
    var c2 = el("text", { x: CX, y: CY + 32, "text-anchor": "middle", class: "cx-csub" }, g); c2.textContent = ind ? nm(tab.sub) : tab.n.toLocaleString("id-ID") + " " + (lang() === "en" ? "users · 30 days" : "pengguna · 30 hari");
    // drag to select days
    var hit = el("circle", { cx: CX, cy: CY, r: R + 12, class: "cx-hit" }, g);
    g.insertBefore(hit, g.firstChild);
    var dragging = null;
    function dayAt(ev) { var b = svg.getBoundingClientRect(), x = (ev.clientX - b.left) / b.width * W, y = (ev.clientY - b.top) / b.height * H;
      var a = Math.atan2(y - CY, x - CX) * 180 / Math.PI + 90; if (a < 0) a += 360; return Math.min(30, 1 + Math.floor(a / 12)); }
    svg.addEventListener("pointerdown", function (ev) { if (ev.target.classList.contains("cx-arc")) return; dragging = dayAt(ev); state.sel = [dragging, dragging]; svg.setPointerCapture(ev.pointerId); render2(); });
    svg.addEventListener("pointermove", function (ev) { if (dragging === null) return; var d2 = dayAt(ev); state.sel = [Math.min(dragging, d2), Math.max(dragging, d2)]; render2(); });
    svg.addEventListener("pointerup", function () { if (dragging !== null) { dragging = null; render(); } });
    function render2() { var w = svg.querySelector(".cx-wedge"); if (w) w.setAttribute("d", arcPath(ang(state.sel[0]), ang(state.sel[1] + .999), inner, R, false)); }
    // 24h mini donut (top right, like the overview thumbnail)
    var mg = el("g", { transform: "translate(" + (W - 86) + " 78)" }, svg), mx = Math.max.apply(0, data.hours);
    data.hours.forEach(function (v, hh) { var a1 = (-90 + hh * 15) * Math.PI / 180, a2 = (-90 + (hh + 1) * 15 - 2) * Math.PI / 180, r2 = 30 + v / mx * 22;
      el("path", { d: "M" + Math.cos(a1) * 26 + " " + Math.sin(a1) * 26 + "L" + Math.cos(a1) * r2 + " " + Math.sin(a1) * r2 + "A" + r2 + " " + r2 + " 0 0 1 " + Math.cos(a2) * r2 + " " + Math.sin(a2) * r2 + "L" + Math.cos(a2) * 26 + " " + Math.sin(a2) * 26 + "Z", class: "cx-hr", opacity: .35 + .65 * v / mx }, mg); });
    var m1 = el("text", { y: 4, "text-anchor": "middle", class: "cx-minit" }, mg); m1.textContent = "24h";
    var m2 = el("text", { y: 74, "text-anchor": "middle", class: "cx-minis" }, mg); m2.textContent = t.h24;
    mapBox.appendChild(svg);

    // ---------- bottom panels ----------
    var sd = data.days.slice(state.sel[0] - 1, state.sel[1]), avg = Math.round(sd.reduce(function (s, x) { return s + x.load; }, 0) / sd.length), sum = sd.reduce(function (s, x) { return s + x.ci; }, 0);
    var inSel = data.feats.filter(function (f) { return f.b >= state.sel[0] && f.a <= state.sel[1]; });
    var focus = state.feat !== null ? data.feats[state.feat] : inSel[0] || data.feats[0], ftp = TOPICS[focus.t];
    var first = sd[0].load, last = sd[sd.length - 1].load, tr = last - first > 4 ? t.up : first - last > 4 ? t.down : t.flat;
    var bot = h("div", "cx-bottom");
    var p1el = h("div", "cx-panel cx-desc", '<div class="cx-chips">' + inSel.map(function (f) { var i = data.feats.indexOf(f); return '<button type="button" class="cx-chip' + (f === focus ? " on" : "") + '" data-f="' + i + '" style="--c:' + TOPICS[f.t].c + '">' + nm(TOPICS[f.t]) + "</button>"; }).join("") + "</div>" +
      "<p><b>" + nm(ftp) + "</b> – " + (lang() === "en" ? ftp.dEn : ftp.dId) + "</p>");
    p1el.querySelectorAll(".cx-chip").forEach(function (b) { b.addEventListener("click", function () { state.feat = +b.dataset.f; render(); }); });
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

    // ---------- right: linear tracks in blocks of 10 days ----------
    var side = h("div", "cx-side");
    [[1, 10], [11, 20], [21, 30]].forEach(function (blk) {
      var ML = 104, BW = 704, cw = (BW - ML) / 10, inBlk = data.feats.filter(function (f) { return !(f.b < blk[0] || f.a > blk[1]); }), rows = Math.max(1, inBlk.length), BH = 64 + rows * 26 + 30;
      var s2v = el("svg", { viewBox: "0 0 " + BW + " " + BH, class: "cx-lin" });
      for (var dd = blk[0]; dd <= blk[1]; dd++) {
        var x = ML + (dd - blk[0]) * cw + cw / 2, dy = data.days[dd - 1];
        var lv = dy.load >= 65 ? 3 : dy.load >= 40 ? 2 : 1;
        el("rect", { x: x - cw / 2 + 4, y: 2, width: cw - 8, height: 22, rx: 5, class: "cx-lv" + lv }, s2v);
        var tl = el("text", { x: x, y: 18, "text-anchor": "middle", class: "cx-seq lv" + lv }, s2v); tl.textContent = dy.load;
        var tc = el("text", { x: x, y: 40, "text-anchor": "middle", class: "cx-seq2" }, s2v); tc.textContent = ind ? (dy.ci ? "●".repeat(dy.ci) : "–") : dy.ci;
        var ttl = el("title", {}, tl); ttl.textContent = t.day + " " + dd + ": " + t.load + " " + dy.load + " (" + t.lvN[lv] + "), " + dy.ci + " " + t.ci.toLowerCase();
      }
      data.feats.forEach(function (f) {
        var row = inBlk.indexOf(f); if (row < 0) return;
        var a = Math.max(f.a, blk[0]), b = Math.min(f.b, blk[1]), x1 = ML + (a - blk[0]) * cw + 2, x2 = ML + (b - blk[0] + 1) * cw - 2, y = 50 + row * 26, end = f.b <= blk[1];
        el("path", { d: "M" + x1 + " " + y + "H" + (x2 - (end ? 10 : 0)) + (end ? "L" + x2 + " " + (y + 10) + "L" + (x2 - 10) + " " + (y + 20) : "V" + (y + 20)) + "H" + x1 + "Z", fill: TOPICS[f.t].c, opacity: .9 }, s2v);
        if (x2 - x1 > 70) { var tt = el("text", { x: (x1 + x2) / 2, y: y + 14, "text-anchor": "middle", class: "cx-barlab" }, s2v); tt.textContent = nm(TOPICS[f.t]); }
      });
      var ay = 50 + rows * 26 + 6;
      el("line", { x1: ML, x2: BW, y1: ay, y2: ay, class: "cx-axis" }, s2v); [[18, t.load, "cx-rl"], [40, t.ci, "cx-rl2"], [ay + 20, t.day, "cx-rl2"]].forEach(function (q) { var tl = el("text", { x: 0, y: q[0], class: q[2] }, s2v); tl.textContent = q[1]; });
      for (var de = blk[0]; de <= blk[1]; de += 2) { var xx = ML + (de - blk[0]) * cw + cw / 2; el("line", { x1: xx, x2: xx, y1: ay, y2: ay + 5, class: "cx-axis" }, s2v); var at = el("text", { x: xx, y: ay + 20, "text-anchor": "middle", class: "cx-ax" }, s2v); at.textContent = de; }
      var o1 = Math.max(state.sel[0], blk[0]), o2 = Math.min(state.sel[1], blk[1]);
      if (o1 <= o2) {
        var rx1 = ML + (o1 - blk[0]) * cw, rx2 = ML + (o2 - blk[0] + 1) * cw;
        el("rect", { x: rx1, y: 2, width: rx2 - rx1, height: ay - 2, class: "cx-linsel" }, s2v);
        if (o1 === state.sel[0]) { el("rect", { x: rx1, y: -16, width: 26, height: 16, class: "cx-tag" }, s2v); var tg = el("text", { x: rx1 + 13, y: -4, "text-anchor": "middle", class: "cx-tagt" }, s2v); tg.textContent = state.sel[0]; }
        if (o2 === state.sel[1]) { el("rect", { x: rx2 - 26, y: -16, width: 26, height: 16, class: "cx-tag" }, s2v); var tg2 = el("text", { x: rx2 - 13, y: -4, "text-anchor": "middle", class: "cx-tagt" }, s2v); tg2.textContent = state.sel[1]; }
      }
      s2v.setAttribute("viewBox", "0 -20 " + BW + " " + (BH + 20));
      var wrap = h("div", "cx-blk"); wrap.appendChild(s2v); side.appendChild(wrap);
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
    var sv = el("svg", { viewBox: "0 0 " + w + " " + hgt, class: cls || "cx-big" }), m = { l: 36, r: 12, t: 14, b: 26 }, iw = w - m.l - m.r, ih = hgt - m.t - m.b, n = vals.length;
    var x = function (i) { return m.l + i * iw / (n - 1); }, y = function (v) { return m.t + ih - v / 100 * ih; };
    [0, 25, 50, 75, 100].forEach(function (g) { el("line", { x1: m.l, x2: w - m.r, y1: y(g), y2: y(g), class: "cx-gl" }, sv); var tx = el("text", { x: m.l - 6, y: y(g) + 4, "text-anchor": "end", class: "cx-ax" }, sv); tx.textContent = g; });
    (events || []).forEach(function (e) { var xx = x(e[0] - 1); el("line", { x1: xx, x2: xx, y1: m.t, y2: m.t + ih, class: "cx-evl" }, sv); var tx = el("text", { x: xx + 4, y: m.t + 10, class: "cx-evt" }, sv); tx.textContent = nm(e[1]); });
    var path = function (a) { return a.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(""); };
    el("path", { d: path(vals) + "L" + x(n - 1) + " " + y(0) + "L" + x(0) + " " + y(0) + "Z", class: "cx-area" }, sv);
    if (avg) el("path", { d: path(avg), class: "cx-l2" }, sv);
    el("path", { d: path(vals), class: "cx-l1" }, sv);
    for (var i = 0; i < n; i += 5) { var tx = el("text", { x: x(i), y: hgt - 6, "text-anchor": "middle", class: "cx-ax" }, sv); tx.textContent = i + 1; }
    return sv;
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
    var sv = el("svg", { viewBox: "-160 -160 320 320", class: "cx-petals" }), n = dims.length;
    dims.forEach(function (d, i) {
      var a0 = (-90 + i * 360 / n) * Math.PI / 180, half = (360 / n / 2 - 4) * Math.PI / 180;
      function petal(rad) { var r0 = 34, p = function (a, rr) { return (Math.cos(a) * rr).toFixed(1) + " " + (Math.sin(a) * rr).toFixed(1); };
        return "M" + p(a0 - half * .55, r0) + "Q" + p(a0 - half, r0 + (rad - r0) * .6) + " " + p(a0 - half * .8, rad) + "Q" + p(a0, rad + 18) + " " + p(a0 + half * .8, rad) + "Q" + p(a0 + half, r0 + (rad - r0) * .6) + " " + p(a0 + half * .55, r0) + "Q" + p(a0, r0 - 8) + " " + p(a0 - half * .55, r0) + "Z"; }
      el("path", { d: petal(140), fill: "none", stroke: d[2], "stroke-width": 1.5, opacity: .7 }, sv);
      var f = el("path", { d: petal(40 + 100 * vals[i]), fill: d[2] }, sv);
      var ic = el("g", { transform: "translate(" + (Math.cos(a0) * 56 - 8) + " " + (Math.sin(a0) * 56 - 8) + ")" }, sv);
      el("path", { d: d[3], fill: "none", stroke: "#fff", "stroke-width": 1.6, "stroke-linecap": "round", "stroke-linejoin": "round" }, ic);
      var tl = el("title", {}, f); tl.textContent = d[en ? 1 : 0] + ": " + Math.round(vals[i] * 100) + "%";
    });
    c1.appendChild(sv);
    c1.appendChild(h("ul", "cx-plg", dims.map(function (d, i) { return '<li><i style="background:' + d[2] + '"></i>' + d[en ? 1 : 0] + " <b>" + Math.round(vals[i] * 100) + "%</b></li>"; }).join("")));
    row.appendChild(c1);
    // 2. support journey (lifecycle)
    var steps = ind ? [[en ? "First check-in" : "Check-in pertama", 1], [en ? "Self-guided" : "Latihan mandiri", 1], [en ? "With Nesya" : "Bersama Nesya", 1], [en ? "Referral" : "Rujukan", 1], [en ? "Psychologist" : "Psikolog", 1], [en ? "Steady" : "Stabil", 0]].map(function (x) { return [x[0], x[1] ? .45 : .15]; })
      : [[en ? "First check-in" : "Check-in pertama", 1], [en ? "Self-guided" : "Latihan mandiri", .54], [en ? "With Nesya" : "Bersama Nesya", .31], [en ? "Referral" : "Rujukan", .12], [en ? "Psychologist" : "Psikolog", .09], [en ? "Steady" : "Stabil", .71]];
    var c2 = h("section", "cx-card cx-wide", "<header><b>" + (en ? "Support journey" : "Perjalanan dukungan") + "</b><span>" + (ind ? (en ? "this person's path, with consent" : "jalur orang ini, atas izin") : (en ? "share of users reaching each step" : "porsi pengguna yang mencapai tiap tahap")) + "</span></header>");
    var js = el("svg", { viewBox: "0 0 640 260", class: "cx-journey" });
    var pos = [[70, 150], [210, 70], [210, 200], [360, 200], [480, 130], [585, 70]], cols = ["#f5b44a", "#9bd36a", "#a9dbf5", "#f5e15a", "#7fd1c7", "#2a9d8f"];
    var links = [[0, 1], [0, 2], [1, 5], [2, 3], [3, 4], [4, 5], [2, 5]];
    var defs = el("defs", {}, js), mk = el("marker", { id: "cxar", viewBox: "0 0 10 10", refX: 9, refY: 5, markerWidth: 7, markerHeight: 7, orient: "auto" }, defs); el("path", { d: "M0 0L10 5L0 10z", fill: "#7fb9c9" }, mk);
    links.forEach(function (l, i) { var a = pos[l[0]], b = pos[l[1]], ra = 18 + 30 * steps[l[0]][1], rb = 18 + 30 * steps[l[1]][1], dx = b[0] - a[0], dy = b[1] - a[1], d = Math.hypot(dx, dy);
      el("path", { d: "M" + (a[0] + dx / d * ra) + " " + (a[1] + dy / d * ra) + "L" + (b[0] - dx / d * (rb + 4)) + " " + (b[1] - dy / d * (rb + 4)), stroke: "#7fb9c9", "stroke-width": 2, fill: "none", "marker-end": "url(#cxar)", "stroke-dasharray": i === 6 ? "5 5" : "none" }, js); });
    steps.forEach(function (st, i) { var rr = 18 + 30 * st[1], p = pos[i]; el("circle", { cx: p[0], cy: p[1], r: rr, fill: cols[i], opacity: .92 }, js); el("circle", { cx: p[0], cy: p[1], r: rr * .62, fill: "#fff", opacity: .18 }, js);
      var tt = el("text", { x: p[0], y: p[1] + rr + 16, "text-anchor": "middle", class: "cx-jl" }, js); tt.textContent = st[0];
      if (!ind) { var tv = el("text", { x: p[0], y: p[1] + 5, "text-anchor": "middle", class: "cx-jv" }, js); tv.textContent = Math.round(st[1] * 100) + "%"; } });
    var tg1 = el("text", { x: 16, y: 26, class: "cx-jstage" }, js); tg1.textContent = en ? "Newcomer" : "Baru";
    var tg2 = el("text", { x: 624, y: 250, "text-anchor": "end", class: "cx-jstage" }, js); tg2.textContent = en ? "Steady" : "Stabil";
    c2.appendChild(js); row.appendChild(c2);
    // 3. unit domes (geosocial)
    if (!ind) {
      var c3 = h("section", "cx-card", "<header><b>" + (en ? "Units at a glance" : "Unit sekilas") + "</b><span>" + (en ? "dome size = active users · colour = load" : "besar kubah = pengguna aktif · warna = beban") + "</span></header>");
      var ds = el("svg", { viewBox: "0 0 360 250", class: "cx-domes" });
      el("ellipse", { cx: 180, cy: 150, rx: 118, ry: 58, fill: "none", stroke: "#8a96a8", "stroke-width": 1 }, ds);
      var dc = ["#f26b4f", "#1fb6e8", "#e2559d", "#c7d93b", "#f0a33a", "#7fd1c7"];
      tab.units.map(function (u, i) { var a = (-200 + i * 360 / tab.units.length) * Math.PI / 180; return { u: u, i: i, x: 180 + Math.cos(a) * 118, y: 150 + Math.sin(a) * 58, w: 22 + Math.round(r() * 30), load: Math.round(40 + r() * 40) }; })
        .sort(function (a, b) { return a.y - b.y; }).forEach(function (d) {
          el("path", { d: "M" + (d.x - d.w) + " " + d.y + "A" + d.w + " " + d.w * .82 + " 0 0 1 " + (d.x + d.w) + " " + d.y + "A" + d.w + " " + d.w * .22 + " 0 0 1 " + (d.x - d.w) + " " + d.y + "Z", fill: dc[d.i % dc.length], opacity: .82 }, ds);
          el("ellipse", { cx: d.x, cy: d.y, rx: d.w, ry: d.w * .22, fill: dc[d.i % dc.length] }, ds);
          var lb = el("text", { x: d.x, y: d.y - d.w * .82 - 8, "text-anchor": "middle", class: "cx-dl" }, ds); lb.textContent = d.u;
          el("rect", { x: d.x - 22, y: d.y + d.w * .22 + 4, width: 44, height: 16, rx: 8, fill: "#fff", stroke: dc[d.i % dc.length] }, ds);
          var lv = el("text", { x: d.x, y: d.y + d.w * .22 + 16, "text-anchor": "middle", class: "cx-dv" }, ds); lv.textContent = d.load; });
      c3.appendChild(ds); row.appendChild(c3);
    }
    return row;
  }
  render();
  document.addEventListener("langchange", render);
})();
