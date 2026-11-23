(function () {
  "use strict";

  // Light / dark toggle (the initial mode is set by a small script in <head>)
  var modeBtns = document.querySelectorAll(".mode-btn");
  function syncModeBtn() {
    var dark = document.documentElement.getAttribute("data-mode") === "dark";
    modeBtns.forEach(function (b) { b.setAttribute("aria-pressed", String(dark)); });
  }
  modeBtns.forEach(function (b) {
    b.addEventListener("click", function () {
      var next = document.documentElement.getAttribute("data-mode") === "dark" ? "light" : "dark";
      document.documentElement.setAttribute("data-mode", next);
      try { localStorage.setItem("mode", next); } catch (e) {}
      syncModeBtn();
    });
  });
  syncModeBtn();

  // Font preview: ?font=jakarta|editorial|friendly|grotesk (default: storybook)
  var FONT_SETS = {
    jakarta: "Plus+Jakarta+Sans:wght@400;500;600;800&family=Kalam:wght@700",
    editorial: "DM+Serif+Display&family=DM+Sans:wght@400;500;600&family=Nanum+Pen+Script",
    friendly: "Young+Serif&family=Nunito:wght@400;600;700&family=Patrick+Hand",
    grotesk: "Bricolage+Grotesque:opsz,wght@12..96,500..800&family=Manrope:wght@400;500;600&family=Caveat+Brush"
  };
  var fontParam = new URLSearchParams(location.search).get("font");
  if (fontParam && FONT_SETS[fontParam]) {
    var fl = document.createElement("link");
    fl.rel = "stylesheet";
    fl.href = "https://fonts.googleapis.com/css2?family=" + FONT_SETS[fontParam] + "&display=swap";
    document.head.appendChild(fl);
    document.documentElement.setAttribute("data-font", fontParam);
  }

  var EN = window.I18N_EN || {};
  var ID_JS = window.I18N_ID_JS || {};
  var original = {};
  var lang = "id";

  function store(key, value) { try { localStorage.setItem(key, value); } catch (e) {} }
  function load(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
  function t(key) {
    if (lang === "en" && EN[key]) return EN[key];
    return ID_JS[key] || original[key] || EN[key] || key;
  }
  function L(pair) { return lang === "en" ? pair.en : pair.id; }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // ---------- Language ----------
  var nodes = document.querySelectorAll("[data-i18n]");
  nodes.forEach(function (el) {
    var k = el.getAttribute("data-i18n");
    if (!(k in original)) original[k] = el.textContent;
  });

  function setLang(next) {
    lang = next === "en" ? "en" : "id";
    document.documentElement.lang = lang;
    nodes.forEach(function (el) {
      var k = el.getAttribute("data-i18n");
      el.textContent = lang === "en" && EN[k] ? EN[k] : (original[k] || ID_JS[k] || k);
    });
    document.querySelectorAll(".lang button").forEach(function (b) {
      b.setAttribute("aria-pressed", String(b.dataset.lang === lang));
    });
    document.title = lang === "en"
      ? "N2CIAS by TenangAI · 24/7 mental health support for institutions"
      : "N2CIAS oleh TenangAI · Dukungan kesehatan mental 24/7 untuk institusi";
    store("lang", lang);
    renderQuiz();
    renderPlanner();
    document.dispatchEvent(new CustomEvent("langchange", { detail: lang }));
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });

  // ---------- Nav ----------
  var header = document.querySelector(".nav2") || document.querySelector(".nav");
  var menuBtn = document.querySelector(".menu-btn");
  function setNavH() { header.style.setProperty("--navh", header.getBoundingClientRect().height + "px"); }
  setNavH();
  window.addEventListener("resize", setNavH);
  function setMenu(open) {
    setNavH();
    header.classList.toggle("menu-open", open);
    document.querySelectorAll(".nav-links").forEach(function (l) { l.classList.toggle("open", open); });
    menuBtn.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
    document.body.classList.toggle("menu-lock", open);
    if (!open) document.querySelectorAll(".dd.open").forEach(function (d) { d.classList.remove("open"); });
  }
  menuBtn.addEventListener("click", function () { setMenu(!header.classList.contains("menu-open")); });
  document.querySelectorAll(".nav-links").forEach(function (l) {
    l.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  });
  document.querySelectorAll(".drawer-foot a").forEach(function (a) {
    a.addEventListener("click", function () { setMenu(false); });
  });
  // Symmetrical centre pill: both sides take the width of the wider one
  function balanceNav() {
    var l = document.querySelector(".nav2 .nav-links-l"), r = document.querySelector(".nav2 .nav-links-r");
    if (!l || !r) return;
    l.style.width = r.style.width = "";
    if (window.innerWidth <= 920) return;
    // every item gets the same slot width, so the halves mirror exactly
    var items = [].slice.call(l.children).concat([].slice.call(r.children));
    items.forEach(function (it) { it.style.width = ""; });
    var slot = Math.ceil(Math.max.apply(null, items.map(function (it) { return it.getBoundingClientRect().width; })));
    var n = Math.max(l.children.length, r.children.length);
    l.style.width = r.style.width = slot * n + "px";
  }
  balanceNav();
  window.addEventListener("resize", balanceNav);
  document.addEventListener("langchange", balanceNav);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(balanceNav);

  // Solid header once the page scrolls past the hero's top
  function onScrollHeader() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();
  if (!document.querySelector(".hero2")) header.classList.add("solid");

  document.querySelectorAll(".dd-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      if (header.classList.contains("menu-open")) return; // in the phone drawer the headings are just labels
      var open = b.parentNode.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
    });
  });

  // ---------- Hero chat ----------
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // ---------- Live chat: messages arrive, Nesya types her replies, then it loops ----------
  // The original .msg elements stay as the (translated) source; a live copy is played beside them.
  document.querySelectorAll(".chat").forEach(function (chat) {
    var src = [].slice.call(chat.querySelectorAll(".msg"));
    var quick = chat.querySelector(".quick");
    if (reduce || !src.length) { src.forEach(function (m) { m.classList.add("show"); }); if (quick) quick.classList.add("show"); return; }
    chat.classList.add("is-live");
    var live = document.createElement("div");
    live.className = "chat-live";
    chat.appendChild(live);
    var running = false, visible = false, timer = null;
    function wait(ms) { return new Promise(function (r) { timer = setTimeout(r, ms); }); }
    function bubble(cls, text) {
      var b = document.createElement("p");
      b.className = "msg show " + cls;
      b.textContent = text || "";
      live.appendChild(b);
      while (live.children.length > 6) live.removeChild(live.firstChild);
      return b;
    }
    async function play() {
      if (running) return; running = true;
      while (visible) {
        live.innerHTML = "";
        await wait(500);
        for (var i = 0; i < src.length && visible; i++) {
          var m = src[i], text = m.textContent, isUser = m.classList.contains("user");
          if (isUser) {
            bubble("user", text);
            await wait(900 + text.length * 12);
          } else {
            var dots = bubble("bot typing", "");
            dots.innerHTML = "<i></i><i></i><i></i>";
            await wait(1100);
            dots.classList.remove("typing"); dots.textContent = "";
            var words = text.split(" ");
            for (var w = 0; w < words.length && visible; w++) { dots.textContent += (w ? " " : "") + words[w]; await wait(70); }
            await wait(1200);
          }
        }
        if (quick && visible) { var q = quick.cloneNode(true); q.classList.add("show"); live.appendChild(q); }
        await wait(5000);
      }
      running = false;
    }
    if ("IntersectionObserver" in window) {
      new IntersectionObserver(function (es) {
        visible = es[0].isIntersecting;
        if (visible) play(); else clearTimeout(timer);
      }, { threshold: 0.4 }).observe(chat);
    }
  });

  // ---------- Parallax: elements with data-parallax move a little as the page scrolls ----------
  var para = [].slice.call(document.querySelectorAll("[data-parallax]"));
  if (para.length && !reduce) {
    var ticking = false;
    function movePara() {
      var y = window.scrollY;
      para.forEach(function (el) { el.style.transform = "translateY(" + (y * parseFloat(el.dataset.parallax)).toFixed(1) + "px)"; });
      ticking = false;
    }
    window.addEventListener("scroll", function () { if (!ticking) { ticking = true; requestAnimationFrame(movePara); } }, { passive: true });
    movePara();
  }

  // ---------- Mobile sticky call to action: after the hero, hidden near the contact form ----------
  var mcta = document.querySelector(".m-cta");
  if (mcta) {
    var demo = document.getElementById("demo");
    var demoVisible = false;
    if (demo && "IntersectionObserver" in window) {
      new IntersectionObserver(function (en) { demoVisible = en[0].isIntersecting; updateCta(); }).observe(demo);
    }
    function updateCta() {
      var show = window.scrollY > window.innerHeight * 0.9 && !demoVisible;
      mcta.classList.toggle("show", show);
      mcta.setAttribute("aria-hidden", String(!show));
      mcta.tabIndex = show ? 0 : -1;
    }
    window.addEventListener("scroll", updateCta, { passive: true });
    updateCta();
  }

  // ---------- Reveal on scroll (after Bija: rise 16px and fade, soft ease-out) ----------
  // Home page marks elements with .reveal / .reveal-split; subpages get the same treatment automatically.
  if (!document.querySelector(".hero2:not(.hero-sub)")) {
    document.querySelectorAll(".head, .note, .col, .collage-3 article, .process li, .journey li, .cols-3 article, .org-helps li, .page-hero h1, .page-hero .lead")
      .forEach(function (el) { el.classList.add("reveal"); });
  }
  var revealEls = [].slice.call(document.querySelectorAll(".reveal, .reveal-split"));
  // stagger siblings in rows (cards, feature grid)
  revealEls.forEach(function (el) {
    var sibs = [].filter.call(el.parentNode.children, function (c) { return c.classList.contains("reveal"); });
    var i = sibs.indexOf(el);
    if (sibs.length > 1 && i > 0) el.style.transitionDelay = Math.min(i, 5) * 90 + "ms";
  });
  function showEl(el) {
    el.classList.add("in");
    // main buttons glow once as they arrive, like Bija's lamp-lit arrows
    el.querySelectorAll(".pbtn-i").forEach(function (ic) { ic.classList.add("glow-once"); });
  }
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) { if (en.isIntersecting) { showEl(en.target); io.unobserve(en.target); } });
    }, { rootMargin: "0px 0px -8% 0px" });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(showEl);
  }

  // ---------- Gallery: rooms light up, ELIZA types, the brass rail fills, the year follows you ----------
  var hall = document.querySelector(".ga-hall");
  if (hall) {
    var rooms = [].slice.call(document.querySelectorAll(".ga-room"));
    var fill = hall.querySelector(".ga-rail-fill");
    var nowYear = hall.querySelector(".ga-now-year");
    function typeLines(box) {
      if (box.dataset.done) return; box.dataset.done = "1";
      var lines = [].slice.call(box.querySelectorAll("[data-line]"));
      var caret = box.querySelector(".ga-caret");
      if (reduce) { lines.forEach(function (l) { l.textContent = l.dataset.line; }); return; }
      var li = 0;
      (function nextLine() {
        if (li >= lines.length) return;
        var el = lines[li], txt = el.dataset.line, ci = 0;
        if (caret) el.appendChild(caret);
        (function nextChar() {
          ci++;
          el.textContent = txt.slice(0, ci);
          if (caret) el.appendChild(caret);
          if (ci < txt.length) setTimeout(nextChar, el.classList.contains("e") ? 38 : 26);
          else { li++; setTimeout(nextLine, el.classList.contains("e") ? 650 : 420); }
        })();
      })();
    }
    function light(room) {
      room.classList.add("lit");
      room.querySelectorAll("[data-type]").forEach(typeLines);
    }
    if ("IntersectionObserver" in window && !reduce) {
      var gio = new IntersectionObserver(function (es) {
        es.forEach(function (e) { if (e.isIntersecting) { light(e.target); gio.unobserve(e.target); } });
      }, { threshold: 0.35 });
      rooms.forEach(function (r) { gio.observe(r); });
    } else { rooms.forEach(light); }
    var gTick = false;
    function onGallery() {
      var r = hall.getBoundingClientRect(), vh = window.innerHeight;
      var p = Math.min(1, Math.max(0, (vh * 0.5 - r.top) / r.height));
      if (fill) fill.parentNode.style.setProperty("--p", p.toFixed(4));
      var mid = vh * 0.5, best = null, bd = 1e9;
      rooms.forEach(function (rm) { var b = rm.getBoundingClientRect(); var d = Math.abs(b.top + b.height / 2 - mid); if (d < bd) { bd = d; best = rm; } });
      if (best && nowYear && nowYear.textContent !== best.dataset.year) nowYear.textContent = best.dataset.year;
      gTick = false;
    }
    window.addEventListener("scroll", function () { if (!gTick) { gTick = true; requestAnimationFrame(onGallery); } }, { passive: true });
    onGallery();
  }

  // ---------- Film clips: play only while on screen (and never with reduced motion or Save-Data) ----------
  var saveData = navigator.connection && navigator.connection.saveData;
  var films = [].slice.call(document.querySelectorAll("video[data-film], .hero2-video"));
  if (reduce || saveData) {
    films.forEach(function (v) { v.removeAttribute("autoplay"); v.pause(); });
  } else if ("IntersectionObserver" in window) {
    var fio = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        var v = e.target;
        if (e.isIntersecting) { if (v.preload === "none") v.preload = "auto"; var pr = v.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else v.pause();
      });
    }, { rootMargin: "120px 0px" });
    films.forEach(function (v) { fio.observe(v); });
  }

  // ---------- Nesya frame player: data-seq="a,b,c" plays sticker frames while on screen ----------
  [].forEach.call(document.querySelectorAll(".nesya[data-seq]"), function (el) {
    var frames = el.getAttribute("data-seq").split(","), img = el.querySelector("img");
    frames.forEach(function (f) { var i = new Image(); i.src = "assets/nesya/" + f + ".png"; });
    if (reduce) return;
    var fps = parseFloat(el.getAttribute("data-fps") || "3"), k = 0, t = null;
    function step() { k = (k + 1) % frames.length; img.src = "assets/nesya/" + frames[k] + ".png"; }
    function start() { if (!t) t = setInterval(step, 1000 / fps); }
    function stop() { clearInterval(t); t = null; }
    if ("IntersectionObserver" in window) new IntersectionObserver(function (es) { es[0].isIntersecting ? start() : stop(); }).observe(el);
    else start();
  });
  // chat avatar: curious while Nesya types, happy after she answers
  var chatAv = document.querySelector("[data-chat-avatar] img");
  if (chatAv) {
    new MutationObserver(function () {
      var typing = document.querySelector(".chat-live .msg.typing");
      chatAv.src = "assets/nesya/" + (typing ? "curious" : "happy") + ".png";
    }).observe(document.body, { subtree: true, childList: true, attributes: true, attributeFilter: ["class"] });
  }
  // ---------- Kenali Nesya: a small easter egg ----------
  // hover: she winks. tap: tiny green and white hearts. every third tap: she hops out and says hello.
  var meet = document.querySelector(".meet-btn"), meetImg = meet && meet.querySelector(".meet-i img");
  if (meet && meetImg) {
    var REST = meetImg.getAttribute("src"), taps = 0, eggOn = false, hovering = false;
    ["wink", "jump-2", "happy", "heart"].forEach(function (f) { var i = new Image(); i.src = "assets/nesya/" + f + ".png"; });
    var HEART = '<svg viewBox="0 0 24 22"><path d="M12 21C5 15.5 1 11.7 1 7.2 1 3.7 3.7 1 7 1c2 0 3.8 1 5 2.6C13.2 2 15 1 17 1c3.3 0 6 2.7 6 6.2 0 4.5-4 8.3-11 13.8z"/></svg>';
    function circle() { return meet.querySelector(".meet-i").getBoundingClientRect(); }
    meet.addEventListener("mouseenter", function () { hovering = true; if (!eggOn) meetImg.src = "assets/nesya/wink.png"; });
    meet.addEventListener("mouseleave", function () { hovering = false; if (!eggOn) meetImg.src = REST; });
    function hearts() {
      var r = circle();
      for (var n = 0; n < 5; n++) {
        var h = document.createElement("span");
        h.className = "meet-burst" + (n % 2 ? " w" : "");
        h.innerHTML = HEART;
        var a = -Math.PI / 2 + (n - 2) * 0.55;
        h.style.left = (r.left + r.width / 2) + "px"; h.style.top = (r.top + r.height / 2) + "px";
        h.style.setProperty("--x", Math.round(Math.cos(a) * 34) + "px");
        h.style.setProperty("--y", Math.round(Math.sin(a) * 26 + 34) + "px");
        h.style.animationDelay = (n * 60) + "ms";
        document.body.appendChild(h);
        (function (el) { setTimeout(function () { el.remove(); }, 1300); })(h);
      }
    }
    function hello() {
      eggOn = true;
      var r = circle(), en = document.documentElement.lang === "en";
      var box = document.createElement("div");
      box.className = "meet-egg";
      box.style.left = (r.left + r.width / 2) + "px"; box.style.top = (r.bottom + 6) + "px";
      box.innerHTML = '<span class="me-bub">' + (en ? "Meow! Nice to meet you" : "Meong! Senang kenal kamu") + '</span><img src="assets/nesya/jump-2.png" alt="">';
      document.body.appendChild(box);
      meetImg.src = "assets/nesya/heart.png";
      var img = box.querySelector("img");
      setTimeout(function () { img.src = "assets/nesya/happy.png"; }, 520);
      setTimeout(function () { img.src = "assets/nesya/wink.png"; }, 1500);
      setTimeout(function () { box.classList.add("out"); }, 2500);
      setTimeout(function () { box.remove(); eggOn = false; meetImg.src = hovering ? "assets/nesya/wink.png" : REST; }, 3000);
    }
    meet.addEventListener("click", function () {
      if (reduce || eggOn) return;
      taps++;
      hearts();
      if (taps % 3 === 0) hello();
    });
    // now and then, when nobody is looking at her, a slow blink
    if (!reduce) setInterval(function () {
      if (eggOn || hovering || document.hidden) return;
      meetImg.src = "assets/nesya/wink.png";
      setTimeout(function () { if (!eggOn && !hovering) meetImg.src = REST; }, 700);
    }, 9000);
  }
  // back to top: appears after the first screen
  var toTop = document.querySelector(".to-top");
  if (toTop) window.addEventListener("scroll", function () { toTop.classList.toggle("show", window.scrollY > window.innerHeight * 1.2); }, { passive: true });

  // ---------- Nesya: a small heart when tapped ----------
  document.querySelectorAll(".nesya").forEach(function (cat) {
    cat.addEventListener("click", function () {
      if (reduce) return;
      var h = document.createElement("span");
      h.className = "nesya-heart";
      h.innerHTML = '<svg viewBox="0 0 24 22"><path d="M12 21C5 15.5 1 11.7 1 7.2 1 3.7 3.7 1 7 1c2 0 3.8 1 5 2.6C13.2 2 15 1 17 1c3.3 0 6 2.7 6 6.2 0 4.5-4 8.3-11 13.8z"/></svg>';
      cat.appendChild(h);
      setTimeout(function () { if (h.parentNode) h.parentNode.removeChild(h); }, 1200);
    });
  });

  // Partner strip: sits at the bottom of the first screen, then pins under the header
  var pinStrip = document.querySelector(".partners-pin");
  var heroEl = document.querySelector(".hero2:not(.hero-sub)");
  if (pinStrip && heroEl) {
    var pq = false;
    function pinCheck() {
      var navh = header.getBoundingClientRect().height;
      header.style.setProperty("--navh", navh + "px");
      pinStrip.style.setProperty("--navh", navh + "px");
      var limit = heroEl.getBoundingClientRect().bottom - pinStrip.offsetHeight;
      pinStrip.classList.toggle("pin-top", limit <= navh);
      pq = false;
    }
    window.addEventListener("scroll", function () { if (!pq) { pq = true; requestAnimationFrame(pinCheck); } }, { passive: true });
    window.addEventListener("resize", pinCheck);
    pinCheck();
  }

  // Hero entrance: copy rises in, scene settles (Bija's 14s "film")
  var hero = document.querySelector(".hero2");
  if (hero) requestAnimationFrame(function () { hero.classList.add("hero-in"); });

  // ---------- Tabs (case studies, dashboard) ----------
  function tabs(btnSel, attr, panelSel, panelAttr) {
    var btns = document.querySelectorAll(btnSel);
    btns.forEach(function (btn) {
      btn.addEventListener("click", function () {
        btns.forEach(function (x) { x.setAttribute("aria-selected", String(x === btn)); });
        document.querySelectorAll(panelSel).forEach(function (p) {
          p.hidden = p.getAttribute(panelAttr) !== btn.getAttribute(attr);
        });
      });
    });
  }
  tabs("#use-cases [data-tab]", "data-tab", "#use-cases [data-panel]", "data-panel");
  tabs("#dash-tabs [data-dtab]", "data-dtab", "#dashboard [data-dpanel]", "data-dpanel");

  // ---------- Coverage planner ----------
  // Rates in IDR per person per month; cap = shared sessions as a share of headcount.
  var TIERS = {
    corporate: [
      { id: "essential", name: "Essential", rate: 10000, cap: 0.2 },
      { id: "standard", name: "Standard", rate: 15000, cap: 0.3 },
      { id: "plus", name: "Plus", rate: 20000, cap: 0.4 },
      { id: "high", name: "High Capacity", rate: 25000, cap: 0.5 }
    ],
    education: [
      { id: "essential", name: "Essential", rate: 7000, cap: 0.2 },
      { id: "standard", name: "Standard", rate: 10500, cap: 0.3 },
      { id: "plus", name: "Plus", rate: 14000, cap: 0.4 }
    ]
  };
  var BAND = { company: "corporate", hospital: "corporate", university: "education", public: null };
  var POP_LABEL = { company: "plan.pop.emp", hospital: "plan.pop.emp", university: "plan.pop.stu", public: "plan.pop.ppl" };

  // Capacity quiz: five questions scored 0-2; the total suggests a capacity range.
  var QUIZ = [
    { id: "existing_demand",
      q: { id: "Seberapa terlihat kebutuhan dukungan kesehatan mental saat ini?", en: "How visible is the current demand for mental health support?" },
      o: [
        { id: "Terbatas atau belum diketahui", en: "Limited or unknown" },
        { id: "Ada beberapa permintaan atau rujukan", en: "Some existing demand" },
        { id: "Kebutuhan rutin dan jelas, misalnya antrean konseling", en: "Clear recurring demand, e.g. counselling queues" }
      ],
      why: { id: "Kebutuhan dukungan sudah terlihat", en: "Demand for support is already visible" } },
    { id: "operating_intensity",
      q: { id: "Apakah populasi Anda bekerja di lingkungan bertekanan tinggi?", en: "Does your population work under high pressure or demand peaks?" },
      o: [
        { id: "Sebagian besar normal", en: "Mostly standard" },
        { id: "Ada periode puncak (ujian, tenggat, rotasi)", en: "Some peak periods (exams, deadlines, rotations)" },
        { id: "24/7, sistem shift, atau tekanan tinggi terus-menerus", en: "24/7, shift-based, or consistently high-pressure" }
      ],
      why: { id: "Ada tekanan atau periode puncak", en: "There is sustained pressure or demand peaks" } },
    { id: "existing_support_usage",
      q: { id: "Apakah sudah ada layanan dukungan kesehatan mental?", en: "Do you already provide mental health support?" },
      o: [
        { id: "Belum ada atau sangat terbatas", en: "Not yet / very limited" },
        { id: "Ada, tapi pemakaiannya belum jelas", en: "Available, but usage is limited or unclear" },
        { id: "Sudah ada dan aktif dipakai", en: "Established and actively used" }
      ],
      why: { id: "Layanan yang ada sudah aktif dipakai", en: "Existing support is actively used" } },
    { id: "adoption_strategy",
      q: { id: "Seberapa aktif N2CIAS akan diperkenalkan?", en: "How actively will you introduce N2CIAS?" },
      o: [
        { id: "Peluncuran ringan", en: "Light launch" },
        { id: "Komunikasi aktif dan onboarding", en: "Active communication and onboarding" },
        { id: "Dipimpin champion, kampanye, dan atasan", en: "Champion-led adoption and campaigns" }
      ],
      why: { id: "Adopsi akan didorong secara aktif", en: "Adoption will be actively driven" } },
    { id: "population_profile",
      q: { id: "Mana yang paling menggambarkan populasi Anda?", en: "Which best describes your population?" },
      o: [
        { id: "Campuran yang luas", en: "Broad mixed population" },
        { id: "Muda dan terbiasa dengan layanan digital", en: "Younger and comfortable with digital services" },
        { id: "Kelompok tertentu dengan kebutuhan lebih tinggi", en: "A defined cohort with higher needs" }
      ],
      why: { id: "Populasinya cenderung aktif memakai", en: "The population is likely to engage" } }
  ];
  var BANDS = [
    { max: 2, tiers: ["essential"], title: { id: "Essential · sekitar 20%", en: "Essential · around 20%" }, copy: { id: "Titik awal yang masuk akal, dengan ruang untuk meninjau pemakaian setelah peluncuran.", en: "A practical starting point, with room to review usage after launch." } },
    { max: 4, tiers: ["essential", "standard"], title: { id: "Essential sampai Standard · 20–30%", en: "Essential to Standard · 20–30%" }, copy: { id: "Mulai luas, dengan ruang untuk tumbuh.", en: "Start broad, with room to grow." } },
    { max: 6, tiers: ["standard", "plus"], title: { id: "Standard sampai Plus · 30–40%", en: "Standard to Plus · 30–40%" }, copy: { id: "Perkiraan kebutuhan sedang sampai aktif.", en: "Moderate to active expected demand." } },
    { max: 8, tiers: ["plus", "high"], title: { id: "Plus sampai High Capacity · 40–50%", en: "Plus to High Capacity · 40–50%" }, copy: { id: "Perkiraan keterlibatan lebih tinggi.", en: "Higher expected engagement." } },
    { max: 10, tiers: ["high"], title: { id: "High Capacity · 50% ke atas", en: "High Capacity · 50%+" }, copy: { id: "Kebutuhan tinggi atau berulang. Kapasitas di atas 50% sebaiknya didiskusikan dengan tim kami.", en: "High or recurring demand. Capacity above 50% is best discussed with our team." } }
  ];
  var answers = {};
  var autoApply = false;

  var typeEl = document.getElementById("p-type");
  var popEl = document.getElementById("p-pop");
  var popLabel = document.getElementById("p-pop-label");
  var tiersEl = document.getElementById("p-tiers");
  var tierWrap = document.getElementById("p-tier-wrap");
  var resultEl = document.getElementById("p-result");
  var quizQs = document.getElementById("quiz-qs");
  var quizOut = document.getElementById("quiz-out");
  var tierId = "standard";
  var recommended = [];

  function rupiah(n) { return "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n)); }
  function num(n) { return new Intl.NumberFormat(lang === "en" ? "en-US" : "id-ID").format(n); }

  function renderQuiz() {
    if (!quizQs) return;
    quizQs.innerHTML = QUIZ.map(function (q, qi) {
      return '<fieldset><legend>' + (qi + 1) + ". " + esc(L(q.q)) + '</legend><div class="opts">' +
        q.o.map(function (o, oi) {
          var id = "q-" + q.id + "-" + oi;
          return '<label class="opt" for="' + id + '"><input type="radio" id="' + id + '" name="' + q.id + '" value="' + oi + '"' +
            (answers[q.id] === oi ? " checked" : "") + "><span>" + esc(L(o)) + "</span></label>";
        }).join("") + "</div></fieldset>";
    }).join("");
    quizQs.querySelectorAll("input").forEach(function (inp) {
      inp.addEventListener("change", function () { answers[inp.name] = Number(inp.value); autoApply = true; scoreQuiz(); });
    });
    scoreQuiz();
  }

  function scoreQuiz() {
    var done = QUIZ.every(function (q) { return q.id in answers; });
    if (!done) { quizOut.innerHTML = '<p class="small">' + esc(t("quiz.answer")) + "</p>"; recommended = []; renderTiersOnly(); return; }
    var total = QUIZ.reduce(function (s, q) { return s + answers[q.id]; }, 0);
    var band = BANDS.find(function (b) { return total <= b.max; });
    var reasons = QUIZ.filter(function (q) { return answers[q.id] > 0; })
      .sort(function (a, b) { return answers[b.id] - answers[a.id]; }).slice(0, 3);
    recommended = band.tiers;
    quizOut.innerHTML = '<div class="rec-box"><b>' + esc(L(band.title)) + "</b>" + esc(L(band.copy)) +
      (reasons.length ? '<ul>' + reasons.map(function (r) { return "<li>" + esc(L(r.why)) + "</li>"; }).join("") + "</ul>" : "") +
      '<p style="margin:10px 0 0"><a href="#p-tier-wrap" id="quiz-apply">' + esc(t("quiz.apply")) + "</a></p></div>";
    function apply() {
      var list = currentList();
      if (!list.length) return;
      var pick = band.tiers.filter(function (id) { return list.some(function (x) { return x.id === id; }); });
      tierId = pick[0] || list[list.length - 1].id;
      renderPlanner();
    }
    document.getElementById("quiz-apply").addEventListener("click", apply);
    if (autoApply) { autoApply = false; apply(); } else { renderTiersOnly(); }
  }

  function currentList() { var b = BAND[typeEl.value]; return b ? TIERS[b] : []; }

  function renderTiersOnly() {
    var list = currentList();
    tiersEl.innerHTML = "";
    list.forEach(function (tier) {
      var wrap = document.createElement("div");
      var rec = recommended.indexOf(tier.id) !== -1 || (recommended.indexOf("high") !== -1 && tier.id === "plus" && !list.some(function (x) { return x.id === "high"; }));
      wrap.className = "tier" + (rec ? " rec" : "");
      var id = "tier-" + tier.id;
      wrap.innerHTML =
        '<input type="radio" name="tier" id="' + id + '" value="' + tier.id + '"' + (tier.id === tierId ? " checked" : "") + ">" +
        '<label for="' + id + '" data-rec="' + esc(t("plan.rec")) + '"><b>' + tier.name + "</b><small>" + Math.round(tier.cap * 100) + "% · " + esc(t("tier." + tier.id)) + "</small></label>";
      wrap.querySelector("input").addEventListener("change", function () { tierId = tier.id; renderPlanner(); });
      tiersEl.appendChild(wrap);
    });
  }

  function renderPlanner() {
    if (!typeEl) return;
    var type = typeEl.value;
    var list = currentList();
    popLabel.setAttribute("data-i18n", POP_LABEL[type]);
    popLabel.textContent = t(POP_LABEL[type]);
    if (list.length && !list.some(function (x) { return x.id === tierId; })) tierId = list[list.length - 1].id;
    tierWrap.hidden = !list.length;
    renderTiersOnly();

    var pop = Math.max(0, Math.floor(Number(popEl.value) || 0));
    if (!list.length) {
      resultEl.innerHTML = "<p>" + esc(t("plan.custom")) + '</p><a href="#demo">' + esc(t("plan.customcta")) + " &rarr;</a>";
      return;
    }
    var tier = list.find(function (x) { return x.id === tierId; }) || list[0];
    var monthly = pop * tier.rate;
    resultEl.innerHTML =
      "<small>" + esc(t("plan.monthly")) + "</small>" +
      '<span class="big">' + rupiah(monthly) + "</span>" +
      "<dl>" +
      "<dt>" + esc(t("plan.people")) + "</dt><dd>" + num(pop) + "</dd>" +
      "<dt>" + esc(t("plan.sessions")) + "</dt><dd>" + num(Math.round(pop * tier.cap)) + "</dd>" +
      "<dt>" + esc(t("plan.rate")) + "</dt><dd>" + rupiah(tier.rate) + "</dd>" +
      "<dt>" + esc(t("plan.annual")) + "</dt><dd>" + rupiah(monthly * 12) + "</dd>" +
      "</dl>";
  }
  if (typeEl) {
    typeEl.addEventListener("change", renderPlanner);
    popEl.addEventListener("input", renderPlanner);
  }

  // ---------- Contact form: opens an email ----------
  var form = document.getElementById("contact");
  if (form) form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var d = new FormData(form);
    var lines = [
      t("f.name") + ": " + d.get("name"),
      t("f.email") + ": " + d.get("email"),
      t("f.wa") + ": " + (d.get("wa") || "-"),
      t("f.org") + ": " + d.get("org"),
      t("f.role") + ": " + (d.get("role") || "-"),
      t("f.type") + ": " + d.get("type"),
      t("f.size") + ": " + (d.get("size") || "-"),
      "",
      d.get("msg") || ""
    ];
    var subject = t("f.subject") + " · " + d.get("org");
    window.location.href = "mailto:hai@tenangaja.co.id?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
  });

  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  setLang(load("lang") || "id");
})();
