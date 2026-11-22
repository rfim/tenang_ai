(function () {
  "use strict";

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
      ? "TenangAI · 24/7 mental health support for institutions"
      : "TenangAI · Dukungan kesehatan mental 24/7 untuk institusi";
    store("lang", lang);
    renderPlanner();
  }
  document.querySelectorAll(".lang button").forEach(function (b) {
    b.addEventListener("click", function () { setLang(b.dataset.lang); });
  });

  // ---------- Nav ----------
  var nav = document.querySelector(".nav");
  var links = document.querySelector(".nav-links");
  var menuBtn = document.querySelector(".menu-btn");
  menuBtn.addEventListener("click", function () {
    var open = links.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", String(open));
  });
  links.addEventListener("click", function (e) {
    if (e.target.tagName === "A") { links.classList.remove("open"); menuBtn.setAttribute("aria-expanded", "false"); }
  });
  function onScroll() { nav.classList.toggle("scrolled", window.scrollY > 8); }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // ---------- Hero chat ----------
  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var chatItems = document.querySelectorAll("#chat .msg, #chat .quick");
  chatItems.forEach(function (el, i) {
    if (reduce) { el.classList.add("show"); return; }
    setTimeout(function () { el.classList.add("show"); }, 500 + i * 1100);
  });

  // ---------- Reveal on scroll ----------
  var revealEls = document.querySelectorAll(".section-head, .card, .steps li, .pathway li, .dash");
  if ("IntersectionObserver" in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      });
    }, { rootMargin: "0px 0px -60px 0px" });
    revealEls.forEach(function (el) { el.classList.add("reveal"); io.observe(el); });
  }

  // ---------- Tabs ----------
  var tabs = document.querySelectorAll('[role="tab"]');
  tabs.forEach(function (tab) {
    tab.addEventListener("click", function () {
      tabs.forEach(function (x) { x.setAttribute("aria-selected", String(x === tab)); });
      document.querySelectorAll(".tab-panel").forEach(function (p) {
        p.hidden = p.dataset.panel !== tab.dataset.tab;
      });
    });
  });

  // ---------- Coverage planner ----------
  // Rates in IDR per person per month; capacity = shared sessions as a share of headcount.
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

  var typeEl = document.getElementById("p-type");
  var popEl = document.getElementById("p-pop");
  var popLabel = document.getElementById("p-pop-label");
  var tiersEl = document.getElementById("p-tiers");
  var resultEl = document.getElementById("p-result");
  var tierId = "standard";

  function rupiah(n) { return "Rp" + new Intl.NumberFormat("id-ID").format(Math.round(n)); }
  function num(n) { return new Intl.NumberFormat(lang === "en" ? "en-US" : "id-ID").format(n); }

  function renderPlanner() {
    if (!typeEl) return;
    var type = typeEl.value;
    var band = BAND[type];
    popLabel.setAttribute("data-i18n", POP_LABEL[type]);
    popLabel.textContent = t(POP_LABEL[type]);

    var list = band ? TIERS[band] : [];
    if (!list.some(function (x) { return x.id === tierId; })) tierId = list.length ? "standard" : tierId;

    tiersEl.innerHTML = "";
    tiersEl.parentElement.hidden = !band;
    list.forEach(function (tier) {
      var wrap = document.createElement("div");
      wrap.className = "tier";
      var id = "tier-" + tier.id;
      wrap.innerHTML =
        '<input type="radio" name="tier" id="' + id + '" value="' + tier.id + '"' + (tier.id === tierId ? " checked" : "") + ">" +
        '<label for="' + id + '"><b>' + tier.name + "</b><small>" + Math.round(tier.cap * 100) + "% · " + t("tier." + tier.id) + "</small></label>";
      wrap.querySelector("input").addEventListener("change", function () { tierId = tier.id; renderPlanner(); });
      tiersEl.appendChild(wrap);
    });

    var pop = Math.max(0, Math.floor(Number(popEl.value) || 0));
    if (!band) {
      resultEl.innerHTML = "<p>" + t("plan.custom") + '</p><a href="#kontak">' + t("plan.customcta") + " →</a>";
      return;
    }
    var tier = list.find(function (x) { return x.id === tierId; }) || list[0];
    var monthly = pop * tier.rate;
    resultEl.innerHTML =
      "<small>" + t("plan.monthly") + "</small>" +
      '<span class="big">' + rupiah(monthly) + "</span>" +
      "<dl>" +
      "<dt>" + t("plan.people") + "</dt><dd>" + num(pop) + "</dd>" +
      "<dt>" + t("plan.sessions") + "</dt><dd>" + num(Math.round(pop * tier.cap)) + "</dd>" +
      "<dt>" + t("plan.rate") + "</dt><dd>" + rupiah(tier.rate) + "</dd>" +
      "<dt>" + t("plan.annual") + "</dt><dd>" + rupiah(monthly * 12) + "</dd>" +
      "</dl>";
  }
  if (typeEl) {
    typeEl.addEventListener("change", renderPlanner);
    popEl.addEventListener("input", renderPlanner);
  }

  // ---------- Contact form → email ----------
  var form = document.getElementById("contact");
  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!form.reportValidity()) return;
    var d = new FormData(form);
    var lines = [
      t("f.name") + ": " + d.get("name"),
      t("f.email") + ": " + d.get("email"),
      t("f.org") + ": " + d.get("org"),
      t("f.role") + ": " + (d.get("role") || "-"),
      t("f.type") + ": " + d.get("type"),
      t("f.size") + ": " + (d.get("size") || "-"),
      "WhatsApp: " + (d.get("wa") || "-"),
      "",
      d.get("msg") || ""
    ];
    var subject = t("f.subject") + " · " + d.get("org");
    window.location.href = "mailto:hai@tenangaja.co.id?subject=" + encodeURIComponent(subject) + "&body=" + encodeURIComponent(lines.join("\n"));
  });

  document.getElementById("year").textContent = new Date().getFullYear();

  var saved = load("lang");
  setLang(saved || "id");
})();
