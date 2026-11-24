// Page transition between the website and the demo console (dashboard.html).
// Browsers with cross-document view transitions: the hero's dashboard tile grows into the console and shrinks back.
// Others: a short fade out and in. Only when crossing between the site and the console; off with reduced motion.
(function () {
  "use strict";
  var still = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  function isDash(u) { try { return /\/dashboard\.html$/.test(new URL(u, location.href).pathname); } catch (e) { return false; } }
  var here = isDash(location.href), cross = "onpagereveal" in window, KEY = "n2-vt";
  function mark(el) { if (el) el.style.viewTransitionName = "n2-console"; return el; }
  function tile() { var t = document.querySelector(".hb-tile"); if (!t || !t.offsetParent) return null; var r = t.getBoundingClientRect(); return r.bottom > 0 && r.top < innerHeight ? t : null; }
  var from = null;
  document.addEventListener("click", function (e) {
    var a = e.target.closest && e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || (a.target && a.target !== "_self")) return;
    if (isDash(a.href) === here || a.origin !== location.origin) return;
    from = a.closest(".hb") ? document.querySelector(".hb-tile") : null;
    if (cross || still) return;
    e.preventDefault(); try { sessionStorage.setItem(KEY, "1"); } catch (x) {}
    document.documentElement.classList.add("n2-leave"); setTimeout(function () { location.href = a.href; }, 360);
  }, true);
  if (cross) {
    window.addEventListener("pageswap", function (e) {
      if (!e.viewTransition) return;
      var to = e.activation && e.activation.entry && e.activation.entry.url;
      if (still || !to || isDash(to) === here) { e.viewTransition.skipTransition(); return; }
      mark(here ? document.querySelector(".cx") : from);
      e.viewTransition.types.add(here ? "to-site" : "to-dash");
    });
    window.addEventListener("pagereveal", function (e) {
      if (!e.viewTransition) return;
      var act = window.navigation && navigation.activation, prev = act && act.from && act.from.url;
      if (still || !prev || isDash(prev) === here) { e.viewTransition.skipTransition(); return; }
      if (!here) document.documentElement.classList.add("n2-back");
      var el = mark(here ? document.querySelector(".cx") : tile());
      e.viewTransition.types.add(here ? "to-dash" : "to-site");
      e.viewTransition.finished.then(function () { if (el) el.style.viewTransitionName = ""; });
    });
  } else {
    var flag = null; try { flag = sessionStorage.getItem(KEY); sessionStorage.removeItem(KEY); } catch (x) {}
    if (flag && !still) { document.documentElement.classList.add("n2-enter"); setTimeout(function () { document.documentElement.classList.remove("n2-enter"); }, 700); }
    window.addEventListener("pageshow", function (e) { if (e.persisted) document.documentElement.classList.remove("n2-leave"); });
  }
})();
