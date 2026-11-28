// Shared Apache ECharts setup for every chart on the site: one look, SVG rendering (sharp, prints to PDF),
// resize with their box, and clean disposal when a view is redrawn. Sample data only.
(function () {
  "use strict";
  if (!window.echarts) return;
  var FONT = 'Inter, ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif';
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function dark() { return document.documentElement.getAttribute("data-mode") === "dark"; }
  var N = {
    font: FONT, still: still,
    // palette shared with the CSS
    teal: "#2c6a65", mint: "#6fcfb3", mint2: "#9ee6d8",
    lv: ["#d8efe4", "#f8e2b5", "#f5c0b0"], lvInk: ["#2b6b56", "#8a5a12", "#9a3b26"],
    risk: ["#f2b98a", "#e0855a", "#b8573a", "#7a2f22"],
    ink: function () { return dark() ? "#e8eef0" : "#1c2b2a"; },
    ink2: function () { return dark() ? "#b4c0c3" : "#4f5f5d"; },
    ink3: function () { return dark() ? "#85959a" : "#7d8b89"; },
    line: function () { return dark() ? "#26363c" : "#e3e8e7"; },
    surface: function () { return dark() ? "#121d22" : "#ffffff"; },
    tooltip: function (extra) {
      return Object.assign({ confine: true, backgroundColor: dark() ? "#0f191c" : "#1c2b2a", borderWidth: 0, padding: [8, 11],
        textStyle: { color: "#f5ecd9", fontFamily: FONT, fontSize: 12 }, extraCssText: "border-radius:8px;box-shadow:0 10px 30px rgba(0,0,0,.25);" }, extra || {});
    },
    // one chart in one box; re-using the box re-uses the chart so updates animate
    chart: function (el, option, opts) {
      if (!el) return null;
      var c = echarts.getInstanceByDom(el) || echarts.init(el, null, { renderer: "svg" });
      var base = { backgroundColor: "transparent", textStyle: { fontFamily: FONT }, animation: !still };
      c.setOption(Object.assign(base, option), opts && opts.merge ? false : true);
      if (!el.__n2ro && window.ResizeObserver) { el.__n2ro = new ResizeObserver(function () { if (!c.isDisposed()) c.resize(); }); el.__n2ro.observe(el); }
      return c;
    },
    // dispose every chart inside a box before its HTML is replaced
    sweep: function (root) {
      if (!root) return;
      root.querySelectorAll("[_echarts_instance_]").forEach(function (e) { var c = echarts.getInstanceByDom(e); if (c) c.dispose(); if (e.__n2ro) { e.__n2ro.disconnect(); e.__n2ro = null; } });
    }
  };
  window.N2C = N;
})();
