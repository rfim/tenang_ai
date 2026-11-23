// Institution dashboard (sample data): filters, KPI tiles with sparklines, trend with crosshair,
// hour x day heatmap, topic bars, risk by city (100% stacked), next steps, data-driven actions.
// Every mark has a hover tooltip; every chart can be shown as a table.
(function () {
  "use strict";
  var root = document.getElementById("dash-app");
  if (!root) return;

  var T = {
    id: {
      period: "Periode", d30: "30 hari", d90: "90 hari", loc: "Lokasi", all: "Semua lokasi",
      updated: "Diperbarui 23 Nov 2026", kmin: "Sel < 10 orang disembunyikan",
      k1: "Pengguna aktif", k2: "Check-in", k3: "Tingkat penyelesaian", k4: "Sinyal kebutuhan tinggi",
      vs: "vs periode sebelumnya", up: "naik", down: "turun",
      trend: "Indeks beban emosional harian", trendSub: "0 = ringan, 100 = berat · rata-rata anonim per hari",
      daily: "Harian", avg7: "Rata-rata 7 hari", peak: "Puncak", heat: "Kapan orang bercerita", heatSub: "Jumlah check-in per jam dan hari",
      topics: "Topik keluhan", topicsSub: "% check-in per topik", risk: "Dukungan per lokasi", riskSub: "% check-in per lokasi",
      steps: "Langkah lanjutan", stepsSub: "Dipilih setelah check-in", act: "Saran tindakan", actSub: "Berdasarkan data di atas",
      table: "Tabel", chart: "Grafik", expand: "Perbesar", close: "Tutup", day: "Hari", hour: "Jam", count: "check-in", index: "Indeks",
      days: ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"],
      t: ["Stres akademik / kerja", "Burnout", "Kecemasan", "Gangguan tidur", "Tekanan relasi"],
      r: ["Dukungan ringan", "Dukungan terpandu", "Disarankan ke psikolog", "Butuh dukungan segera"],
      s: ["Latihan mandiri", "Lanjut dengan Nesya", "Rujukan psikolog"],
      a: [
        function (d) { return "Tambah slot konselor di " + d.topCity + ": " + d.topCityHigh + "% check-in butuh rujukan atau dukungan segera."; },
        function (d) { return "Buka sesi malam: " + d.night + "% check-in terjadi pukul 22.00–02.00."; },
        function (d) { return "Kampanye tentang " + d.topTopic.toLowerCase() + ", topik yang disebut " + d.topTopicPct + "% check-in."; },
        function (d) { return "Siapkan dukungan ekstra sekitar tanggal " + d.peakDay + ", saat beban emosional memuncak."; }
      ]
    },
    en: {
      period: "Period", d30: "30 days", d90: "90 days", loc: "Location", all: "All locations",
      updated: "Updated 23 Nov 2026", kmin: "Cells under 10 people are hidden",
      k1: "Active users", k2: "Check-ins", k3: "Completion rate", k4: "High-need signals",
      vs: "vs previous period", up: "up", down: "down",
      trend: "Daily emotional load index", trendSub: "0 = light, 100 = heavy · anonymous daily average",
      daily: "Daily", avg7: "7-day average", peak: "Peak", heat: "When people talk", heatSub: "Check-ins by hour and day",
      topics: "Concern topics", topicsSub: "% of check-ins mentioning the topic", risk: "Support by location", riskSub: "% of check-ins per location",
      steps: "Next steps", stepsSub: "% after a check-in", act: "Suggested actions", actSub: "Based on the data above",
      table: "Table", chart: "Chart", expand: "Expand", close: "Close", day: "Day", hour: "Hour", count: "check-ins", index: "Index",
      days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      t: ["Study / work stress", "Burnout", "Anxiety", "Sleep problems", "Relationship strain"],
      r: ["Light support", "Guided support", "Referred to a psychologist", "Needs urgent support"],
      s: ["Self-guided exercise", "Continue with Nesya", "Psychologist referral"],
      a: [
        function (d) { return "Add counsellor slots in " + d.topCity + ": " + d.topCityHigh + "% of check-ins need a referral or urgent support."; },
        function (d) { return "Open evening sessions: " + d.night + "% of check-ins happen between 22:00 and 02:00."; },
        function (d) { return "Run a campaign on " + d.topTopic.toLowerCase() + ", mentioned in " + d.topTopicPct + "% of check-ins."; },
        function (d) { return "Plan extra support around day " + d.peakDay + ", when emotional load peaks."; }
      ]
    }
  };
  var CITIES = ["Jakarta", "Yogyakarta", "Surabaya"];
  var state = { days: 30, loc: "all" };
  var views = {};
  function L() { return T[document.documentElement.lang === "en" ? "en" : "id"]; }
  function fmt(n) { return Math.round(n).toLocaleString("id-ID"); }

  // ---------- sample data, seeded so the same filters always give the same numbers ----------
  function rng(seed) { return function () { seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
  function data() {
    var key = state.days * 7 + (state.loc === "all" ? 0 : CITIES.indexOf(state.loc) + 1), r = rng(9301 + key * 49297);
    var scale = state.loc === "all" ? 1 : [0.46, 0.31, 0.23][CITIES.indexOf(state.loc)];
    var n = state.days, series = [];
    for (var i = 0; i < n; i++) {
      var exam = Math.exp(-Math.pow((i - n * 0.55) / (n * 0.09), 2)) * 22;
      series.push(Math.max(18, Math.min(92, 44 + exam + Math.sin(i / 2.3) * 4 + (r() - 0.5) * 9 + (i % 7 >= 5 ? -4 : 0))));
    }
    var avg = series.map(function (v, i) { var a = series.slice(Math.max(0, i - 6), i + 1); return a.reduce(function (s, x) { return s + x; }, 0) / a.length; });
    var heat = [];
    for (var d = 0; d < 7; d++) { heat.push([]); for (var h = 0; h < 24; h++) {
      var base = 6 + 30 * Math.exp(-Math.pow((h - 21) / 2.6, 2)) + 18 * Math.exp(-Math.pow((h - 12.5) / 2.2, 2)) + 22 * Math.exp(-Math.pow(((h + 24 - 1) % 24 - 23) / 1.8, 2));
      if (h >= 3 && h <= 6) base *= 0.35; if (d >= 5) base *= 0.8;
      heat[d].push(Math.round(base * (0.8 + r() * 0.4) * scale * state.days / 30)); } }
    var topics = [78, 64, 52, 41, 33].map(function (v) { return Math.round(Math.max(8, Math.min(95, v + (r() - 0.5) * 10))); });
    var risk = CITIES.map(function (c, i) { var a = [48 - i * 4 + (r() - .5) * 6, 34 + (r() - .5) * 5, 14 + i * 3 + (r() - .5) * 3]; var s4 = 3 + i + r(); var t = a[0] + a[1] + a[2] + s4; return [a[0], a[1], a[2], s4].map(function (x) { return Math.round(x / t * 1000) / 10; }); });
    var steps = [54, 31, 15].map(function (v) { return v + Math.round((r() - .5) * 6); }); var st = steps[0] + steps[1] + steps[2]; steps = steps.map(function (v) { return Math.round(v / st * 100); });
    var users = Math.round(860 * scale * Math.sqrt(state.days / 30)), checks = heat.reduce(function (s, row) { return s + row.reduce(function (a, b) { return a + b; }, 0); }, 0);
    var spark = function (b, j, dir) { var o = []; for (var k = 0; k < 12; k++) o.push(b * (1 + (dir || 1) * (k - 11) * 0.018 + (r() - 0.5) * j)); return o; };
    return { series: series, avg: avg, heat: heat, topics: topics, risk: risk, steps: steps,
      kpi: [
        { v: users, f: fmt(users), d: 12 + Math.round(r() * 6), good: true, s: spark(users, 0.08) },
        { v: checks, f: fmt(checks), d: 18 + Math.round(r() * 7), good: true, s: spark(checks, 0.1) },
        { v: 82, f: (79 + Math.round(r() * 6)) + "%", d: 3, good: true, s: spark(80, 0.05) },
        { v: 3, f: (2.6 + r()).toFixed(1).replace(".", ",") + "%", d: -(Math.round(r() * 4) / 10 + 0.3), good: false, s: spark(3, 0.06, -1), pp: true }
      ] };
  }

  // ---------- small helpers ----------
  var NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; }
  var tip = document.createElement("div"); tip.className = "dv-tip"; tip.setAttribute("role", "status"); document.body.appendChild(tip);
  function showTip(html, x, y) { tip.innerHTML = html; tip.style.opacity = 1; var w = tip.offsetWidth, h = tip.offsetHeight; tip.style.left = Math.min(innerWidth - w - 8, Math.max(8, x - w / 2)) + "px"; tip.style.top = Math.max(8, y - h - 14) + "px"; }
  function hideTip() { tip.style.opacity = 0; }
  function card(id, title, sub, wide) {
    var c = document.createElement("section"); c.className = "dv-card" + (wide ? " " + wide : ""); c.id = id;
    c.innerHTML = '<header><div><h4>' + title + '</h4><p>' + sub + '</p></div><span class="dv-tools"><button type="button" class="dv-toggle" aria-pressed="false" aria-label="' + L().table + '" title="' + L().table + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 3h12v10H2zM2 6.5h12M2 10h12M6.5 3v10" fill="none" stroke="currentColor" stroke-width="1.4"/></svg></button><button type="button" class="dv-max" aria-label="' + L().expand + '" title="' + L().expand + '"><svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg></button></span></header><div class="dv-body"></div><div class="dv-table" hidden></div>';
    c.querySelector(".dv-toggle").addEventListener("click", function (e) {
      var on = e.currentTarget.getAttribute("aria-pressed") !== "true"; views[id] = on; e.currentTarget.setAttribute("aria-pressed", String(on));
      e.currentTarget.title = on ? L().chart : L().table; e.currentTarget.classList.toggle("on", on); c.querySelector(".dv-body").hidden = on; c.querySelector(".dv-table").hidden = !on;
    });
    c.querySelector(".dv-max").addEventListener("click", function () { toggleMax(c); });
    c.addEventListener("click", function (e) { if (!c.classList.contains("is-max") && !e.target.closest("button, select, a, li, .dv-srow i, rect, .dv-table") ) toggleMax(c); });
    return c;
  }
  // Focus view: one chart large, centred, with the page dimmed behind it
  var scrim = document.createElement("div"); scrim.className = "dv-scrim"; document.body.appendChild(scrim);
  function toggleMax(c, force) {
    var on = force === undefined ? !c.classList.contains("is-max") : force;
    document.querySelectorAll(".dv-card.is-max").forEach(function (o) { if (o !== c) o.classList.remove("is-max"); });
    c.classList.toggle("is-max", on); scrim.classList.toggle("on", on); document.body.classList.toggle("dv-lock", on);
    var b = c.querySelector(".dv-max"); if (b) { b.setAttribute("aria-label", on ? L().close : L().expand); b.title = on ? L().close : L().expand;
      b.innerHTML = on ? '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 3l10 10M13 3L3 13" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>' : '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M2 6V2h4M10 2h4v4M14 10v4h-4M6 14H2v-4" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>'; if (on) b.focus(); }
    hideTip();
  }
  scrim.addEventListener("click", function () { var c = document.querySelector(".dv-card.is-max"); if (c) toggleMax(c, false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") { var c = document.querySelector(".dv-card.is-max"); if (c) toggleMax(c, false); } });
  function table(rows) { return "<table><tbody>" + rows.map(function (r, i) { return "<tr>" + r.map(function (c) { return (i ? "<td>" : "<th>") + c + (i ? "</td>" : "</th>"); }).join("") + "</tr>"; }).join("") + "</tbody></table>"; }

  // ---------- charts ----------
  function sparkline(svg, vals) {
    var w = 96, h = 28, mn = Math.min.apply(0, vals), mx = Math.max.apply(0, vals);
    var pts = vals.map(function (v, i) { return [i * w / (vals.length - 1), h - 3 - (v - mn) / (mx - mn || 1) * (h - 6)]; });
    el("polyline", { points: pts.map(function (p) { return p.join(","); }).join(" "), class: "dv-spark" }, svg);
    var p = pts[pts.length - 1]; el("circle", { cx: p[0], cy: p[1], r: 3, class: "dv-spark-end" }, svg);
  }
  function lineChart(box, d, t) {
    var W = 640, H = 165, m = { l: 34, r: 12, t: 16, b: 24 }, iw = W - m.l - m.r, ih = H - m.t - m.b, n = d.series.length;
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "dv-svg", role: "img", "aria-label": t.trend }, box);
    var x = function (i) { return m.l + i * iw / (n - 1); }, y = function (v) { return m.t + ih - v / 100 * ih; };
    [0, 25, 50, 75, 100].forEach(function (g) { el("line", { x1: m.l, x2: W - m.r, y1: y(g), y2: y(g), class: "dv-grid" }, svg); var tx = el("text", { x: m.l - 6, y: y(g) + 4, class: "dv-ax", "text-anchor": "end" }, svg); tx.textContent = g; });
    var step = n > 40 ? 15 : 5; for (var i = 0; i < n; i += step) { var tx = el("text", { x: x(i), y: H - 6, class: "dv-ax", "text-anchor": "middle" }, svg); tx.textContent = i + 1; }
    var path = function (arr) { return arr.map(function (v, i) { return (i ? "L" : "M") + x(i).toFixed(1) + " " + y(v).toFixed(1); }).join(""); };
    el("path", { d: path(d.series) + "L" + x(n - 1) + " " + y(0) + "L" + x(0) + " " + y(0) + "Z", class: "dv-area" }, svg);
    el("path", { d: path(d.avg), class: "dv-line2" }, svg);
    el("path", { d: path(d.series), class: "dv-line1" }, svg);
    var pk = d.series.indexOf(Math.max.apply(0, d.series));
    el("circle", { cx: x(pk), cy: y(d.series[pk]), r: 4.5, class: "dv-dot" }, svg);
    var pl = el("text", { x: x(pk), y: y(d.series[pk]) - 10, class: "dv-lab", "text-anchor": "middle" }, svg); pl.textContent = t.peak + " " + Math.round(d.series[pk]);
    var cross = el("line", { y1: m.t, y2: m.t + ih, class: "dv-cross", opacity: 0 }, svg), hd = el("circle", { r: 4.5, class: "dv-dot", opacity: 0 }, svg);
    var hit = el("rect", { x: m.l, y: m.t, width: iw, height: ih, fill: "transparent" }, svg);
    hit.addEventListener("pointermove", function (e) { var b = svg.getBoundingClientRect(), px = (e.clientX - b.left) / b.width * W, i = Math.max(0, Math.min(n - 1, Math.round((px - m.l) / iw * (n - 1))));
      cross.setAttribute("x1", x(i)); cross.setAttribute("x2", x(i)); cross.setAttribute("opacity", 1); hd.setAttribute("cx", x(i)); hd.setAttribute("cy", y(d.series[i])); hd.setAttribute("opacity", 1);
      showTip("<b>" + t.day + " " + (i + 1) + "</b><span><i class='k1'></i>" + t.daily + " " + Math.round(d.series[i]) + "</span><span><i class='k2'></i>" + t.avg7 + " " + Math.round(d.avg[i]) + "</span>", b.left + x(i) / W * b.width, b.top + y(d.series[i]) / H * b.height); });
    hit.addEventListener("pointerleave", function () { cross.setAttribute("opacity", 0); hd.setAttribute("opacity", 0); hideTip(); });
    var lg = document.createElement("div"); lg.className = "dv-legend"; lg.innerHTML = '<span><i class="k1"></i>' + t.daily + '</span><span><i class="k2"></i>' + t.avg7 + "</span>"; box.appendChild(lg);
  }
  function heatmap(box, d, t) {
    var cw = 16, ch = 26, ml = 34, mt = 4, W = ml + 24 * cw + 4, H = mt + 7 * ch + 20, mx = Math.max.apply(0, d.heat.map(function (r) { return Math.max.apply(0, r); }));
    var svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "dv-svg", role: "img", "aria-label": t.heat }, box);
    d.heat.forEach(function (row, di) {
      var lab = el("text", { x: ml - 6, y: mt + di * ch + ch / 2 + 4, class: "dv-ax", "text-anchor": "end" }, svg); lab.textContent = t.days[di];
      row.forEach(function (v, h) {
        var k = Math.min(5, Math.floor(v / mx * 6)), c = el("rect", { x: ml + h * cw + 1, y: mt + di * ch + 1, width: cw - 2, height: ch - 2, rx: 2, class: "dv-h" + k }, svg);
        c.addEventListener("pointerenter", function () { var b = c.getBoundingClientRect(); showTip("<b>" + t.days[di] + " · " + String(h).padStart(2, "0") + ":00</b><span>" + fmt(v) + " " + t.count + "</span>", b.left + b.width / 2, b.top); });
        c.addEventListener("pointerleave", hideTip);
      });
    });
    [0, 6, 12, 18, 23].forEach(function (h) { var tx = el("text", { x: ml + h * cw + cw / 2, y: H - 4, class: "dv-ax", "text-anchor": "middle" }, svg); tx.textContent = String(h).padStart(2, "0"); });
    var lg = document.createElement("div"); lg.className = "dv-scale"; lg.innerHTML = "<span>0</span>" + [0, 1, 2, 3, 4, 5].map(function (k) { return '<i class="dv-h' + k + '"></i>'; }).join("") + "<span>" + fmt(mx) + "</span>"; box.appendChild(lg);
  }
  function hbars(box, labels, vals, t, unit) {
    var ul = document.createElement("ul"); ul.className = "dv-bars";
    labels.forEach(function (lab, i) {
      var li = document.createElement("li"); li.innerHTML = "<span>" + lab + "</span><div><i style='width:" + vals[i] + "%'></i></div><b>" + vals[i] + "%</b>";
      li.addEventListener("pointerenter", function () { var b = li.querySelector("i").getBoundingClientRect(); showTip("<b>" + lab + "</b><span>" + vals[i] + "% " + unit + "</span>", b.right, b.top); });
      li.addEventListener("pointerleave", hideTip); ul.appendChild(li);
    });
    box.appendChild(ul);
  }
  function stacked(box, d, t) {
    var wrap = document.createElement("div"); wrap.className = "dv-stack";
    CITIES.forEach(function (c, ci) {
      var row = document.createElement("div"); row.className = "dv-srow"; row.innerHTML = "<span>" + c + "</span><div></div>";
      d.risk[ci].forEach(function (v, k) {
        var seg = document.createElement("i"); seg.className = "dv-r" + k; seg.style.width = v + "%";
        if (v >= 12) seg.textContent = Math.round(v) + "%";
        seg.addEventListener("pointerenter", function () { var b = seg.getBoundingClientRect(); showTip("<b>" + c + "</b><span><i class='dv-r" + k + "'></i>" + t.r[k] + " " + String(v).replace(".", ",") + "%</span>", b.left + b.width / 2, b.top); });
        seg.addEventListener("pointerleave", hideTip); row.querySelector("div").appendChild(seg);
      });
      wrap.appendChild(row);
    });
    box.appendChild(wrap);
    var lg = document.createElement("div"); lg.className = "dv-legend"; lg.innerHTML = t.r.map(function (r, k) { return '<span><i class="sw dv-r' + k + '"></i>' + r + "</span>"; }).join(""); box.appendChild(lg);
  }

  // ---------- render ----------
  function render() {
    var t = L(), d = data();
    root.innerHTML = "";
    var bar = document.createElement("div"); bar.className = "dv-filters";
    bar.innerHTML = '<div class="dv-f"><span>' + t.period + '</span><div class="dv-seg" role="group">' +
      [30, 90].map(function (n) { return '<button type="button" data-days="' + n + '" aria-pressed="' + (state.days === n) + '">' + t["d" + n] + "</button>"; }).join("") + "</div></div>" +
      '<label class="dv-f"><span>' + t.loc + '</span><select>' + ['<option value="all">' + t.all + "</option>"].concat(CITIES.map(function (c) { return '<option value="' + c + '"' + (state.loc === c ? " selected" : "") + ">" + c + "</option>"; })).join("") + "</select></label>" +
      '<p class="dv-meta" title="' + t.kmin + '">' + t.updated + "</p>";
    bar.querySelectorAll("[data-days]").forEach(function (b) { b.addEventListener("click", function () { state.days = +b.dataset.days; render(); }); });
    bar.querySelector("select").addEventListener("change", function (e) { state.loc = e.target.value; render(); });
    var head = root.parentNode.querySelector('.dash-head'); if (head) { head.classList.add('dv-head'); bar.insertBefore(head, bar.firstChild); }
    root.appendChild(bar);

    var k = document.createElement("div"); k.className = "dv-kpis";
    d.kpi.forEach(function (q, i) {
      var good = (q.d > 0) === q.good, s = document.createElement("div"); s.className = "dv-kpi";
      s.innerHTML = "<small>" + t["k" + (i + 1)] + "</small><b>" + q.f + "</b><span class='dv-delta " + (good ? "good" : "bad") + "'><svg viewBox='0 0 10 10' aria-hidden='true'><path d='" + (q.d > 0 ? "M5 1 L9 7 H1Z" : "M5 9 L9 3 H1Z") + "'/></svg>" +
        (q.d > 0 ? "+" : "−") + String(Math.abs(q.d)).replace(".", ",") + (q.pp ? " pp" : "%") + " <em>" + t.vs + "</em></span>";
      var sv = el("svg", { viewBox: "0 0 96 28", class: "dv-sparksvg", "aria-hidden": "true" }); s.appendChild(sv); sparkline(sv, q.s); k.appendChild(s);
    });
    root.appendChild(k);

    var g = document.createElement("div"); g.className = "dv-grid";
    var c1 = card("dv-trend", t.trend, t.trendSub, "w2"); lineChart(c1.querySelector(".dv-body"), d, t);
    c1.querySelector(".dv-table").innerHTML = table([[t.day, t.daily, t.avg7]].concat(d.series.map(function (v, i) { return [i + 1, Math.round(v), Math.round(d.avg[i])]; })));
    var c2 = card("dv-heat", t.heat, t.heatSub, "w1"); heatmap(c2.querySelector(".dv-body"), d, t);
    c2.querySelector(".dv-table").innerHTML = table([[t.day].concat(["00–05", "06–11", "12–17", "18–23"])].concat(d.heat.map(function (r, i) { return [t.days[i]].concat([0, 6, 12, 18].map(function (s) { return fmt(r.slice(s, s + 6).reduce(function (a, b) { return a + b; }, 0)); })); })));
    var c3 = card("dv-topics", t.topics, t.topicsSub, "w1"); hbars(c3.querySelector(".dv-body"), t.t, d.topics, t, t.count);
    c3.querySelector(".dv-table").innerHTML = table([["", "%"]].concat(t.t.map(function (x, i) { return [x, d.topics[i] + "%"]; })));
    var c4 = card("dv-risk", t.risk, t.riskSub, "w1"); stacked(c4.querySelector(".dv-body"), d, t);
    c4.querySelector(".dv-table").innerHTML = table([[t.loc].concat(t.r)].concat(CITIES.map(function (c, i) { return [c].concat(d.risk[i].map(function (v) { return String(v).replace(".", ",") + "%"; })); })));
    var c5 = card("dv-steps", t.steps, t.stepsSub, "w1"); hbars(c5.querySelector(".dv-body"), t.s, d.steps, t, "");
    c5.querySelector(".dv-table").innerHTML = table([["", "%"]].concat(t.s.map(function (x, i) { return [x, d.steps[i] + "%"]; })));
    // actions computed from the numbers on screen
    var high = d.risk.map(function (r) { return Math.round(r[2] + r[3]); }), ci = high.indexOf(Math.max.apply(0, high));
    var tot = 0, night = 0; d.heat.forEach(function (r) { r.forEach(function (v, h) { tot += v; if (h >= 22 || h < 2) night += v; }); });
    var ti = d.topics.indexOf(Math.max.apply(0, d.topics)), info = { topCity: CITIES[ci], topCityHigh: high[ci], night: Math.round(night / tot * 100), topTopic: t.t[ti], topTopicPct: d.topics[ti], peakDay: d.series.indexOf(Math.max.apply(0, d.series)) + 1 };
    var c6 = document.createElement("section"); c6.className = "dv-card w2 dv-actions";
    c6.innerHTML = "<header><div><h4>" + t.act + "</h4><p>" + t.actSub + "</p></div></header><ol>" + t.a.map(function (f) { return "<li>" + f(info) + "</li>"; }).join("") + "</ol>";
    [c1, c2, c3, c4, c5, c6].forEach(function (c) { g.appendChild(c); });
    root.appendChild(g);
    Object.keys(views).forEach(function (id) { if (views[id]) { var b = document.querySelector("#" + id + " .dv-toggle"); if (b) b.click(); views[id] = true; } });
  }
  render();
  document.addEventListener("langchange", render);
})();
