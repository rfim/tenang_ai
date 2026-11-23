(function () {
  "use strict";

  // Light / dark toggle (the initial mode is set by a small script in <head>)
  var modeBtn = document.querySelector(".mode-btn");
  function syncModeBtn() { if (modeBtn) modeBtn.setAttribute("aria-pressed", String(document.documentElement.getAttribute("data-mode") === "dark")); }
  if (modeBtn) modeBtn.addEventListener("click", function () {
    var next = document.documentElement.getAttribute("data-mode") === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-mode", next);
    try { localStorage.setItem("mode", next); } catch (e) {}
    syncModeBtn();
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
  function setMenu(open) {
    header.classList.toggle("menu-open", open);
    document.querySelectorAll(".nav-links").forEach(function (l) { l.classList.toggle("open", open); });
    menuBtn.setAttribute("aria-expanded", String(open));
  }
  menuBtn.addEventListener("click", function () { setMenu(!header.classList.contains("menu-open")); });
  document.querySelectorAll(".nav-links").forEach(function (l) {
    l.addEventListener("click", function (e) { if (e.target.closest("a")) setMenu(false); });
  });
  // Solid header once the page scrolls past the hero's top
  function onScrollHeader() { header.classList.toggle("scrolled", window.scrollY > 40); }
  window.addEventListener("scroll", onScrollHeader, { passive: true });
  onScrollHeader();
  if (!document.querySelector(".hero2")) header.classList.add("solid");

  document.querySelectorAll(".dd-btn").forEach(function (b) {
    b.addEventListener("click", function () {
      var open = b.parentNode.classList.toggle("open");
      b.setAttribute("aria-expanded", String(open));
    });
  });

  // ---------- Hero chat ----------
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll("#chat .msg, #chat .quick").forEach(function (el, i) {
    if (reduce) { el.classList.add("show"); return; }
    setTimeout(function () { el.classList.add("show"); }, 500 + i * 1100);
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

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll(".head, .note, .col, .collage-3 article, .process li, .journey li, .cols-3 article");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }

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
