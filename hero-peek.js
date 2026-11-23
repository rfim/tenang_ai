// Hero preview of the institution console: steps through its four tabs, Peta, Analitik, Tren and Unit, both cards at once.
(function () {
  "use strict";
  var card = document.querySelector(".hb"); if (!card) return;
  var body = card.querySelector(".hb-wheel"), days = card.querySelector(".hb-days"); if (!body || !days) return;
  var NS = "http://www.w3.org/2000/svg";
  var TOP = {
    stress: ["#c9ec4a", "Stres akademik", "Study stress"], burnout: ["#f6b3d9", "Burnout", "Burnout"], anx: ["#a9dbf5", "Kecemasan", "Anxiety"],
    sleep: ["#c7b8f0", "Gangguan tidur", "Sleep problems"], rel: ["#f7a27a", "Tekanan relasi", "Relationship strain"],
    lonely: ["#9ee6d8", "Kesepian", "Loneliness"], ref: ["#f5e15a", "Rujukan psikolog", "Psychologist referral"]
  };
  // sample data only: arcs are [topic, lane, first day, last day]
  var INST = [
    { name: "ITB", fac: "FTI", sel: 12, loads: [67, 46, 73, 70, 66, 53, 65],
      arcs: [["stress", 0, 10, 24], ["burnout", 0, 25, 30], ["lonely", 1, 3, 13], ["anx", 1, 16, 25], ["rel", 2, 6, 11], ["sleep", 2, 13, 22], ["ref", 3, 14, 19]] },
    { name: "UGM", fac: "Psikologi", sel: 5, loads: [38, 44, 52, 61, 47, 36, 41],
      arcs: [["lonely", 0, 2, 14], ["sleep", 0, 18, 27], ["rel", 1, 4, 10], ["stress", 1, 13, 22], ["anx", 2, 6, 12], ["burnout", 2, 21, 28], ["ref", 3, 8, 11]] },
    { name: "UI", fac: "FIB", sel: 20, loads: [55, 68, 72, 49, 43, 39, 58],
      arcs: [["anx", 0, 15, 29], ["stress", 0, 2, 9], ["burnout", 1, 18, 26], ["sleep", 1, 5, 14], ["lonely", 2, 9, 17], ["rel", 2, 21, 27], ["ref", 3, 20, 24]] }
  ];
  var C = 70, R = 62, LANE0 = 55, LW = 5, GAP = 2, idx = 0, timer = null;
  function en() { return document.documentElement.lang === "en"; }
  function ang(d) { return ((d - 1) / 30 * 360 - 90) * Math.PI / 180; }
  function pt(a, r) { return [C + r * Math.cos(a), C + r * Math.sin(a)]; }
  function f(n) { return n.toFixed(1); }
  function arc(a1, a2, r1, r2) {
    var l = a2 - a1 > Math.PI ? 1 : 0, p1 = pt(a1, r2), p2 = pt(a2, r2), p3 = pt(a2, r1), p4 = pt(a1, r1);
    return "M" + f(p1[0]) + "," + f(p1[1]) + "A" + r2 + "," + r2 + " 0 " + l + " 1 " + f(p2[0]) + "," + f(p2[1]) + "L" + f(p3[0]) + "," + f(p3[1]) + "A" + r1 + "," + r1 + " 0 " + l + " 0 " + f(p4[0]) + "," + f(p4[1]) + "Z";
  }
  function wheel(it) {
    var o = ['<circle cx="70" cy="70" r="' + R + '" class="mw-ring"/>'];
    for (var d = 1; d <= 30; d++) { var a = ang(d), p1 = pt(a, R), p2 = pt(a, R + (d % 5 === 1 ? 6 : 3)); o.push('<line x1="' + f(p1[0]) + '" y1="' + f(p1[1]) + '" x2="' + f(p2[0]) + '" y2="' + f(p2[1]) + '" class="mw-tick"/>'); }
    it.arcs.forEach(function (q, i) { var r2 = LANE0 - q[1] * (LW + GAP); o.push('<path d="' + arc(ang(q[2]), ang(q[3] + .9), r2 - LW, r2) + '" fill="' + TOP[q[0]][0] + '" class="mw-arc" style="--i:' + i + '"/>'); });
    var inner = LANE0 - 4 * (LW + GAP) + GAP - 3;
    o.push('<path d="' + arc(ang(it.sel), ang(it.sel + 6.999), inner, R) + '" class="mw-wedge"/>');
    [it.sel, it.sel + 7].forEach(function (d) { var p = pt(ang(d), R); o.push('<circle cx="' + f(p[0]) + '" cy="' + f(p[1]) + '" r="2.6" class="mw-wdot"/>'); });
    o.push('<text x="70" y="70" text-anchor="middle" class="mw-f' + (it.fac.length > 4 ? " sm" : "") + '">' + it.fac + '</text><text x="70" y="82" text-anchor="middle" class="mw-n">' + it.name + "</text>");
    return '<svg class="pk-map" viewBox="-4 -4 148 148" aria-hidden="true">' + o.join("") + "</svg>";
  }
  // sample data only (FTI · ITB)
  var IT = INST[0];
  var TREND = [44, 46, 49, 51, 50, 43, 42, 41, 44, 40, 45, 41, 38, 39, 52, 63, 66, 69, 68, 52, 52, 49, 44, 47, 41, 38, 36, 42, 46, 44];
  var HEAT = [[1,0,0,0,0,1,2,2,1,2,3,4],[2,0,0,0,0,1,2,2,1,2,4,4],[2,0,0,0,0,1,2,1,2,2,3,4],[2,1,0,0,0,1,2,2,1,3,4,4],[1,0,0,0,0,1,2,2,2,2,4,3],[1,0,0,0,0,0,1,2,2,2,3,3],[1,0,0,0,0,0,1,2,1,2,3,4]];
  var UNITS = [["FTI", 36, 35, 23], ["FMIPA", 47, 34, 15], ["SBM", 38, 35, 21], ["FSRD", 34, 32, 27], ["STEI", 45, 33, 18]];
  function tabs(v) { var n = en() ? ["Map", "Analytics", "Trends", "Units"] : ["Peta", "Analitik", "Tren", "Unit"];
    return '<span class="pk-tabs">' + n.map(function (x, i) { return '<i class="' + (i === v ? "on" : "") + '">' + x + "</i>"; }).join("") + "</span>"; }
  function heat() {
    var o = [], dn = en() ? "MTWTFSS" : "SSRKJSM";
    HEAT.forEach(function (r, y) { o.push('<text x="0" y="' + (y * 15 + 11) + '" class="hm-l">' + dn[y] + "</text>");
      r.forEach(function (v, x) { o.push('<rect x="' + (12 + x * 13.5) + '" y="' + (y * 15) + '" width="12" height="13" rx="2.5" class="hm' + v + '" style="--i:' + (x + y) + '"/>'); }); });
    ["00", "12", "22"].forEach(function (t, i) { o.push('<text x="' + [12, 93, 160][i] + '" y="118" class="hm-l">' + t + "</text>"); });
    return '<svg class="pk-map pk-heat" viewBox="0 0 176 122" aria-hidden="true">' + o.join("") + "</svg>";
  }
  function line(W, H, lo, hi, avg) {
    var n = TREND.length, x = function (i) { return i * W / (n - 1); }, y = function (v) { return H - 4 - (v - lo) / (hi - lo) * (H - 12); };
    var p = function (a) { return a.map(function (v, i) { return (i ? "L" : "M") + f(x(i)) + " " + f(y(v)); }).join(""); }, d = p(TREND), pk = TREND.indexOf(Math.max.apply(0, TREND));
    var s = '<path d="' + d + "L" + W + " " + H + "L0 " + H + 'Z" class="tr-a"/>';
    if (avg) { var m = TREND.map(function (v, i) { var q = TREND.slice(Math.max(0, i - 6), i + 1); return q.reduce(function (a, b) { return a + b; }, 0) / q.length; }); s += '<path d="' + p(m) + '" class="tr-m"/>'; }
    return s + '<path d="' + d + '" class="tr-l" pathLength="1"/><circle cx="' + f(x(pk)) + '" cy="' + f(y(TREND[pk])) + '" r="3.5" class="tr-d"/>';
  }
  function trendTile() {
    var g = [25, 50, 75].map(function (v) { var yy = 110 - 4 - (v - 20) / 70 * 98; return '<line x1="0" x2="190" y1="' + f(yy) + '" y2="' + f(yy) + '" class="tr-g"/>'; }).join("");
    return '<svg class="pk-map pk-tr" viewBox="0 -10 190 124" aria-hidden="true">' + g + line(190, 110, 20, 90, true) + '<text x="122" y="2" class="hm-l">' + (en() ? "peak 69" : "puncak 69") + "</text></svg>";
  }
  function unitTile() {
    return '<svg class="pk-map pk-un" viewBox="0 0 190 118" aria-hidden="true">' + UNITS.map(function (u, i) { var y = i * 23, x = 40, w = 150, o = '<text x="0" y="' + (y + 12) + '" class="hm-l un-l">' + u[0] + "</text>", acc = 0;
      [u[1], u[2], u[3], 100 - u[1] - u[2] - u[3]].forEach(function (v, k) { o += '<rect x="' + f(x + acc / 100 * w) + '" y="' + y + '" width="' + f(Math.max(0, v / 100 * w - 1.5)) + '" height="15" rx="2" class="un' + k + '" style="--i:' + (i * 4 + k) + '"/>'; acc += v; });
      return o; }).join("") + "</svg>";
  }
  function render(v) {
    var E = en(), seen = {}, top = [], it = IT, tag = '<span>' + it.fac + " · " + it.name + "</span>";
    it.arcs.forEach(function (q) { if (!seen[q[0]] && top.length < 4) { seen[q[0]] = 1; top.push(q[0]); } });
    var lv = function (n) { return n < 40 ? "lv1" : n < 65 ? "lv2" : "lv3"; };
    var foot = function (h) { return '<span class="pk-tops">' + h + "</span>"; };
    var tiles = [wheel(it), heat(), trendTile(), unitTile()];
    body.innerHTML = '<span class="hb-view">' + tiles[v] + "</span>" + tabs(v);
    var label, mid, ft;
    if (v === 0) {
      label = E ? "Daily load · days 12–18" : "Beban harian · hari 12–18";
      mid = '<span class="pk-chips">' + it.loads.map(function (n, i) { return '<span class="' + lv(n) + '" style="--i:' + i + '"><b>' + n + "</b><i>" + (it.sel + i) + "</i></span>"; }).join("") + "</span>";
      ft = top.map(function (k) { return '<span><i style="background:' + TOP[k][0] + '"></i>' + TOP[k][E ? 2 : 1] + "</span>"; }).join("");
    } else if (v === 1) {
      label = E ? "When people talk · 30 days" : "Kapan orang bercerita · 30 hari";
      var k = E ? [["Active users", "1,420"], ["Check-ins", "2,407"], ["Completed", "82%"], ["High need", "3.0%"]] : [["Pengguna aktif", "1.420"], ["Check-in", "2.407"], ["Selesai", "82%"], ["Kebutuhan tinggi", "3,0%"]];
      mid = '<span class="pk-kpis">' + k.map(function (q, i) { return '<span style="--i:' + i + '"><b>' + q[1] + "</b><i>" + q[0] + "</i></span>"; }).join("") + "</span>";
      ft = "<span>" + (E ? "Peak 21:00–01:00 · anonymous, groups of 10 or more" : "Puncak 21.00–01.00 · anonim, kelompok ≥ 10 orang") + "</span>";
    } else if (v === 2) {
      label = E ? "Emotional load · 30 days" : "Beban emosional · 30 hari";
      mid = '<svg class="pk-trend" viewBox="0 -6 400 62" preserveAspectRatio="none" aria-hidden="true">' + line(400, 52, 30, 75, false) + "</svg>";
      ft = E ? "<span>Check-ins +22%</span><span>Completed +3%</span><span>High need −0.4 pp</span>" : "<span>Check-in +22%</span><span>Selesai +3%</span><span>Kebutuhan tinggi −0,4 pp</span>";
    } else {
      label = E ? "Psychologist referrals · by unit" : "Disarankan ke psikolog · per unit";
      mid = '<span class="pk-units2">' + UNITS.map(function (u, i) { return '<span style="--i:' + i + '"><b>' + u[3] + '%</b><i>' + u[0] + "</i></span>"; }).join("") + "</span>";
      ft = (E ? ["Light", "Guided", "Psychologist", "Urgent"] : ["Ringan", "Terpandu", "Psikolog", "Segera"]).map(function (t, i) { return '<span><i class="un' + i + '"></i>' + t + "</span>"; }).join("");
    }
    days.innerHTML = '<span class="pk-days"><small><span>' + label + "</span>" + tag + "</small>" + mid + foot(ft) + "</span>";
  }
  function next() {
    idx = (idx + 1) % 4;
    body.classList.add("pk-out"); days.classList.add("pk-out");
    setTimeout(function () { render(idx); body.classList.remove("pk-out"); days.classList.remove("pk-out"); }, 900);
  }
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function start() { if (!still && !timer) timer = setInterval(next, 7000); }
  function stop() { clearInterval(timer); timer = null; }
  card.addEventListener("mouseenter", stop); card.addEventListener("mouseleave", start);
  card.addEventListener("focus", stop); card.addEventListener("blur", start);
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
  document.addEventListener("langchange", function () { render(idx); });
  window.N2Peek = { show: function (v) { stop(); idx = v; render(v); body.classList.remove("pk-out"); days.classList.remove("pk-out"); } }; // used by the video capture
  render(0); start();
})();
