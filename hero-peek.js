// Hero preview of the institution console: a small Peta wheel that rotates through sample institutions.
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
  function render(it) {
    var E = en(), seen = {}, top = [];
    it.arcs.forEach(function (q) { if (!seen[q[0]] && top.length < 4) { seen[q[0]] = 1; top.push(q[0]); } });
    var lv = function (v) { return v < 40 ? "lv1" : v < 65 ? "lv2" : "lv3"; };
    var dots = '<span class="pk-dots">' + INST.map(function (x) { return '<i class="' + (x === it ? "on" : "") + '"></i>'; }).join("") + "</span>";
    body.innerHTML = wheel(it) + '<span class="hb-cap"><span>' + (E ? "30-day map" : "Peta 30 hari") + "</span>" + dots + "</span>";
    days.innerHTML = '<span class="pk-days"><small><span>' + (E ? "Daily load · days " : "Beban harian · hari ") + it.sel + "–" + (it.sel + 6) + '</span><span>' + it.fac + " · " + it.name + '</span></small><span class="pk-chips">' +
      it.loads.map(function (v, i) { return '<span class="' + lv(v) + '" style="--i:' + i + '"><b>' + v + "</b><i>" + (it.sel + i) + "</i></span>"; }).join("") + '</span><span class="pk-tops">' +
      top.map(function (k) { return '<span><i style="background:' + TOP[k][0] + '"></i>' + TOP[k][E ? 2 : 1] + "</span>"; }).join("") + "</span></span>";
  }
  function next() {
    idx = (idx + 1) % INST.length;
    body.classList.add("pk-out"); days.classList.add("pk-out");
    setTimeout(function () { render(INST[idx]); body.classList.remove("pk-out"); days.classList.remove("pk-out"); }, 900);
  }
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function start() { if (!still && !timer) timer = setInterval(next, 8500); }
  function stop() { clearInterval(timer); timer = null; }
  card.addEventListener("mouseenter", stop); card.addEventListener("mouseleave", start);
  card.addEventListener("focus", stop); card.addEventListener("blur", start);
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
  document.addEventListener("langchange", function () { render(INST[idx]); });
  render(INST[0]); start();
})();
