// Hero preview of the institution console, drawn with Apache ECharts (charts.js).
// It steps through the console's four tabs, Peta, Analitik, Tren and Unit, both cards at once. Each tab tells one thing
// in one sentence (the story line on the wide card) and the chart under it is the evidence. Sample data only (FTI · ITB).
(function () {
  "use strict";
  var card = document.querySelector(".hb"); if (!card) return;
  var body = card.querySelector(".hb-wheel"), days = card.querySelector(".hb-days"); if (!body || !days) return;
  var C = window.N2C; if (!C) return;
  var TOP = {
    stress: ["#c9ec4a", "Stres akademik", "Study stress"], burnout: ["#f6b3d9", "Burnout", "Burnout"], anx: ["#a9dbf5", "Kecemasan", "Anxiety"],
    sleep: ["#c7b8f0", "Gangguan tidur", "Sleep problems"], rel: ["#f7a27a", "Tekanan relasi", "Relationship strain"],
    lonely: ["#9ee6d8", "Kesepian", "Loneliness"], ref: ["#f5e15a", "Rujukan psikolog", "Psychologist referral"]
  };
  // arcs are [topic, lane, first day, last day]
  var IT = { name: "ITB", fac: "FTI", sel: 12, loads: [67, 46, 73, 70, 66, 53, 65],
    arcs: [["stress", 0, 10, 24], ["burnout", 0, 25, 30], ["lonely", 1, 3, 13], ["anx", 1, 16, 25], ["rel", 2, 6, 11], ["sleep", 2, 13, 22], ["ref", 3, 14, 19]] };
  var TREND = [44, 46, 49, 51, 50, 43, 42, 41, 44, 40, 45, 41, 38, 39, 52, 63, 66, 69, 68, 52, 52, 49, 44, 47, 41, 38, 36, 42, 46, 44];
  var AVG = TREND.map(function (v, i) { var q = TREND.slice(Math.max(0, i - 6), i + 1); return Math.round(q.reduce(function (a, b) { return a + b; }, 0) / q.length * 10) / 10; });
  var HEAT = [[1,0,0,0,0,1,2,2,1,2,3,4],[2,0,0,0,0,1,2,2,1,2,4,4],[2,0,0,0,0,1,2,1,2,2,3,4],[2,1,0,0,0,1,2,2,1,3,4,4],[1,0,0,0,0,1,2,2,2,2,4,3],[1,0,0,0,0,0,1,2,2,2,3,3],[1,0,0,0,0,0,1,2,1,2,3,4]];
  var UNITS = [["FTI", 36, 35, 23], ["FMIPA", 47, 34, 15], ["SBM", 38, 35, 21], ["FSRD", 34, 32, 27], ["STEI", 45, 33, 18]];
  var INK = "rgba(245,236,217,.62)", GRID = "rgba(255,255,255,.08)";
  var idx = 0, timer = null;
  function en() { return document.documentElement.lang === "en"; }
  function ang(d) { return ((d - 1) / 30 * 360 - 90) * Math.PI / 180; }

  // ---- the four tile charts ----
  function wheel() {
    var E = en();
    return {
      animationDuration: 1300, animationEasing: "cubicOut",
      series: [
        { type: "custom", coordinateSystem: "none", silent: true, data: [0], z: 1, renderItem: function (p, api) {
          var w = api.getWidth(), h = api.getHeight(), cx = w / 2, cy = h / 2, R = Math.min(w, h) / 2 - 7, s = R / 62, kids = [];
          kids.push({ type: "circle", shape: { cx: cx, cy: cy, r: R }, style: { fill: "none", stroke: "rgba(255,255,255,.5)", lineWidth: .8 } });
          for (var d = 1; d <= 30; d++) { var a = ang(d), l = (d % 5 === 1 ? 6 : 3) * s;
            kids.push({ type: "line", shape: { x1: cx + Math.cos(a) * R, y1: cy + Math.sin(a) * R, x2: cx + Math.cos(a) * (R + l), y2: cy + Math.sin(a) * (R + l) }, style: { stroke: "rgba(255,255,255,.5)", lineWidth: .8 } }); }
          var inner = (55 - 4 * 7 + 2 - 3) * s, a1 = ang(IT.sel), a2 = ang(IT.sel + 6.999);
          kids.push({ type: "sector", shape: { cx: cx, cy: cy, r0: inner, r: R, startAngle: a1, endAngle: a2 }, style: { fill: "rgba(158,230,216,.14)", stroke: "rgba(158,230,216,.8)", lineWidth: .9 },
            enterFrom: { style: { opacity: 0 } }, enterAnimation: { delay: 900, duration: 700 } });
          [a1, a2].forEach(function (a) { kids.push({ type: "circle", shape: { cx: cx + Math.cos(a) * R, cy: cy + Math.sin(a) * R, r: 2.6 }, style: { fill: C.mint } }); });
          kids.push({ type: "text", style: { text: IT.fac, x: cx, y: cy - 2, align: "center", verticalAlign: "middle", fill: "#fff", font: "600 12px " + C.font } });
          kids.push({ type: "text", style: { text: IT.name, x: cx, y: cy + 11, align: "center", verticalAlign: "middle", fill: "rgba(245,236,217,.7)", font: "600 8px " + C.font } });
          return { type: "group", children: kids };
        } },
        { type: "custom", coordinateSystem: "none", silent: true, z: 2,
          data: IT.arcs.map(function (q) { return { value: [q[1], q[2], q[3]], name: TOP[q[0]][E ? 2 : 1], itemStyle: { color: TOP[q[0]][0] } }; }),
          renderItem: function (p, api) {
            var w = api.getWidth(), h = api.getHeight(), R = Math.min(w, h) / 2 - 7, s = R / 62, r2 = (55 - api.value(0) * 7) * s, sa = ang(api.value(1));
            return { type: "sector", shape: { cx: w / 2, cy: h / 2, r0: r2 - 5 * s, r: r2, startAngle: sa, endAngle: ang(api.value(2) + .9), cornerRadius: 1.5 * s },
              style: { fill: api.visual("color"), opacity: .93 }, transition: ["shape"], enterFrom: { shape: { endAngle: sa } }, enterAnimation: { delay: 150 + p.dataIndex * 140, duration: 1100 } };
          } }
      ]
    };
  }
  function heat() {
    var dn = en() ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"] : ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"], data = [];
    HEAT.forEach(function (r, y) { r.forEach(function (v, x) { data.push([x, y, v]); }); });
    return {
      grid: { left: 26, right: 2, top: 2, bottom: 14 },
      xAxis: { type: "category", data: ["00", "02", "04", "06", "08", "10", "12", "14", "16", "18", "20", "22"], axisLine: { show: false }, axisTick: { show: false },
        axisLabel: { color: INK, fontSize: 8, interval: 5, margin: 4 } },
      yAxis: { type: "category", data: dn, inverse: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: INK, fontSize: 8, margin: 4 } },
      visualMap: { show: false, type: "piecewise", dimension: 2, pieces: [{ value: 0, color: "rgba(255,255,255,.06)" }, { value: 1, color: "rgba(158,230,216,.22)" }, { value: 2, color: "rgba(158,230,216,.42)" }, { value: 3, color: "rgba(111,207,179,.7)" }, { value: 4, color: "#6fcfb3" }] },
      series: [{ type: "heatmap", data: data, silent: true, itemStyle: { borderRadius: 2.5, borderColor: "rgba(0,0,0,0)", borderWidth: 1.5 },
        animationDuration: 900, animationDelay: function (i) { return (i % 12 + Math.floor(i / 12)) * 35; } }]
    };
  }
  function trend(tile) {
    var E = en(), pk = TREND.indexOf(Math.max.apply(0, TREND));
    return {
      grid: tile ? { left: 2, right: 6, top: 18, bottom: 4 } : { left: 0, right: 0, top: 6, bottom: 2 },
      xAxis: { type: "category", data: TREND.map(function (v, i) { return i + 1; }), boundaryGap: false, show: false },
      yAxis: { type: "value", min: tile ? 20 : 30, max: tile ? 90 : 75, show: !!tile, axisLabel: { show: false }, axisLine: { show: false }, axisTick: { show: false }, splitNumber: 3, splitLine: { lineStyle: { color: GRID } } },
      series: [
        { type: "line", data: TREND, smooth: .35, symbol: "none", lineStyle: { color: C.mint2, width: 2 },
          areaStyle: { color: { type: "linear", x: 0, y: 0, x2: 0, y2: 1, colorStops: [{ offset: 0, color: "rgba(158,230,216,.32)" }, { offset: 1, color: "rgba(158,230,216,0)" }] } },
          markPoint: { symbol: "circle", symbolSize: 7, itemStyle: { color: "#fff", borderColor: C.teal, borderWidth: 2 }, data: [{ coord: [pk, TREND[pk]], value: TREND[pk] }],
            label: tile ? { show: true, position: "top", distance: 6, color: "rgba(245,236,217,.85)", fontSize: 9, formatter: (E ? "peak " : "puncak ") + TREND[pk] } : { show: false } },
          animationDuration: 1800, animationEasing: "cubicInOut" }
      ].concat(tile ? [{ type: "line", data: AVG, smooth: .4, symbol: "none", lineStyle: { color: "rgba(245,236,217,.45)", width: 1.3, type: [4, 3] }, animationDuration: 1800, animationDelay: 400 }] : [])
    };
  }
  function units() {
    return {
      grid: { left: 36, right: 2, top: 2, bottom: 2 },
      xAxis: { type: "value", max: 100, show: false },
      yAxis: { type: "category", data: UNITS.map(function (u) { return u[0]; }), inverse: true, axisLine: { show: false }, axisTick: { show: false }, axisLabel: { color: INK, fontSize: 8.5, margin: 6 } },
      series: [0, 1, 2, 3].map(function (k) {
        return { type: "bar", stack: "s", barWidth: 13, silent: true, data: UNITS.map(function (u) { return k < 3 ? u[k + 1] : 100 - u[1] - u[2] - u[3]; }),
          itemStyle: { color: C.risk[k], borderRadius: k === 0 ? [3, 0, 0, 3] : k === 3 ? [0, 3, 3, 0] : 0, borderColor: "rgba(0,0,0,0)", borderWidth: 0 },
          animationDuration: 1000, animationDelay: function (i) { return 150 + i * 90 + k * 140; } };
      })
    };
  }

  // ---- the story per tab ----
  function tabs(v) { var n = en() ? ["Map", "Analytics", "Trends", "Units"] : ["Peta", "Analitik", "Tren", "Unit"];
    return '<span class="pk-tabs">' + n.map(function (x, i) { return '<i class="' + (i === v ? "on" : "") + '">' + x + "</i>"; }).join("") + "</span>"; }
  var STORY = {
    id: ["Stres akademik memuncak menjelang UTS", "Paling ramai pukul 21.00–01.00", "Beban memuncak di hari 18, lalu turun", "FSRD paling banyak dirujuk ke psikolog"],
    en: ["Study stress peaks before midterms", "Busiest between 21:00 and 01:00", "Load peaks on day 18, then eases", "FSRD has the most psychologist referrals"]
  };
  function render(v) {
    var E = en(), seen = {}, top = [], tag = '<span class="pk-tag">' + IT.fac + " · " + IT.name + "</span>";
    IT.arcs.forEach(function (q) { if (!seen[q[0]] && top.length < 4) { seen[q[0]] = 1; top.push(q[0]); } });
    var lv = function (n) { return n < 40 ? "lv1" : n < 65 ? "lv2" : "lv3"; };
    C.sweep(body); C.sweep(days);
    body.innerHTML = '<span class="hb-view"><span class="hb-ch" aria-hidden="true"></span></span>' + tabs(v);
    C.chart(body.querySelector(".hb-ch"), [wheel, heat, function () { return trend(true); }, units][v]());
    var mid, ft;
    if (v === 0) {
      mid = '<span class="pk-chips">' + IT.loads.map(function (n, i) { return '<span class="' + lv(n) + '" style="--i:' + i + '"><b>' + n + "</b><i>" + (IT.sel + i) + "</i></span>"; }).join("") + "</span>";
      ft = top.map(function (k) { return '<span><i style="background:' + TOP[k][0] + '"></i>' + TOP[k][E ? 2 : 1] + "</span>"; }).join("");
    } else if (v === 1) {
      var k = E ? [["Active users", "1,420"], ["Check-ins", "2,407"], ["Completed", "82%"], ["High need", "3.0%"]] : [["Pengguna aktif", "1.420"], ["Check-in", "2.407"], ["Selesai", "82%"], ["Kebutuhan tinggi", "3,0%"]];
      mid = '<span class="pk-kpis">' + k.map(function (q, i) { return '<span style="--i:' + i + '"><b>' + q[1] + "</b><i>" + q[0] + "</i></span>"; }).join("") + "</span>";
      ft = "<span>" + (E ? "Anonymous · groups of 10 or more" : "Anonim · kelompok ≥ 10 orang") + "</span>";
    } else if (v === 2) {
      mid = '<span class="pk-trend" aria-hidden="true"></span>';
      ft = E ? "<span>Check-ins +22%</span><span>Completed +3%</span><span>High need −0.4 pp</span>" : "<span>Check-in +22%</span><span>Selesai +3%</span><span>Kebutuhan tinggi −0,4 pp</span>";
    } else {
      mid = '<span class="pk-units2">' + UNITS.map(function (u, i) { return '<span style="--i:' + i + '"' + (u[0] === "FSRD" ? ' class="hi"' : "") + "><b>" + u[3] + '%</b><i>' + u[0] + "</i></span>"; }).join("") + "</span>";
      ft = (E ? ["Light", "Guided", "Psychologist", "Urgent"] : ["Ringan", "Terpandu", "Psikolog", "Segera"]).map(function (t, i) { return '<span><i class="un' + i + '"></i>' + t + "</span>"; }).join("");
    }
    days.innerHTML = '<span class="pk-days"><small><span class="pk-story">' + STORY[E ? "en" : "id"][v] + "</span>" + tag + "</small>" + mid + '<span class="pk-tops">' + ft + "</span></span>";
    if (v === 2) C.chart(days.querySelector(".pk-trend"), trend(false));
  }
  function next() {
    idx = (idx + 1) % 4;
    body.classList.add("pk-out"); days.classList.add("pk-out");
    setTimeout(function () { render(idx); body.classList.remove("pk-out"); days.classList.remove("pk-out"); }, 700);
  }
  function start() { if (!C.still && !timer) timer = setInterval(next, 7000); }
  function stop() { clearInterval(timer); timer = null; }
  card.addEventListener("mouseenter", stop); card.addEventListener("mouseleave", start);
  card.addEventListener("focusin", stop); card.addEventListener("focusout", start);
  document.addEventListener("visibilitychange", function () { if (document.hidden) stop(); else start(); });
  document.addEventListener("langchange", function () { render(idx); });
  window.N2Peek = { show: function (v) { stop(); idx = v; render(v); body.classList.remove("pk-out"); days.classList.remove("pk-out"); } }; // used by the video capture
  render(0); start();
})();
