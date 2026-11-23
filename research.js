// Renders the lists in data.js into the research page and the home page teasers.
(function () {
  "use strict";
  var D = window.TENANG_DATA || {};
  var UI = {
    view: { id: "Baca di jurnal", en: "Read in the journal" },
    pdf: { id: "Unduh PDF", en: "Download PDF" },
    soonStudies: { id: "Studi klinis N2CIAS sedang disiapkan. Hasilnya akan kami tampilkan di sini.", en: "Clinical studies of N2CIAS are being prepared. Results will appear here." },
    soonPubs: { id: "Publikasi tim TenangAI akan ditampilkan di sini.", en: "Publications by the TenangAI team will appear here." },
    soonTeam: { id: "Profil tim klinis akan segera ditampilkan.", en: "Clinical team profiles are coming soon." },
    partner: { id: "Mitra klinis", en: "Clinical partner" }
  };
  function lang() { return document.documentElement.lang === "en" ? "en" : "id"; }
  function L(v) { return v && typeof v === "object" ? (v[lang()] || v.id || "") : (v || ""); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
  function soon(key) { return '<p class="soon note stitched">' + esc(L(UI[key])) + "</p>"; }

  function journalOf(p) { return p.venue.split(",")[0]; }
  function volOf(p) { var m = p.venue.split(",").slice(1).join(",").trim(); return m; }
  function doiOf(p) { return (p.url || "").replace(/^https?:\/\/(dx\.)?doi\.org\//, "doi:"); }
  function paperCard(p) {
    var j = journalOf(p);
    var cover =
      '<div class="pc" aria-hidden="true">' +
        '<div class="pc-mast"><span class="pc-j">' + esc(j) + '</span><span class="pc-v">' + esc(volOf(p)) + "</span></div>" +
        '<div class="pc-type">' + esc(L(p.type) || "Article") + "</div>" +
        '<div class="pc-title">' + esc(p.title) + "</div>" +
        '<div class="pc-auth">' + esc(p.authors) + "</div>" +
        '<div class="pc-abs"><b>Abstract</b> ' + esc(L(p.summary)) + "</div>" +
        '<div class="pc-foot"><span>' + esc(doiOf(p)) + "</span><span>" + p.year + "</span></div>" +
      "</div>";
    return '<article class="paper-card">' + cover +
      '<div class="paper-body">' +
      (p.type ? '<p class="pt-type">' + esc(L(p.type)) + "</p>" : "") +
      '<h3 class="paper-title">' + esc(p.title) + "</h3>" +
      '<p class="paper-authors">' + esc(p.authors) + '<span class="pt-dot">·</span><em>' + esc(p.venue) + "</em></p>" +
      '<p class="paper-sum">' + esc(L(p.summary)) + "</p>" +
      '<div class="paper-actions">' +
      (p.url ? '<a class="pt-link" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(L(UI.view)) + ' <span aria-hidden="true">\u2197</span></a>' : "") +
      (p.pdf ? '<a class="pt-link" href="' + esc(p.pdf) + '" download>' + esc(L(UI.pdf)) + "</a>" : "") +
      "</div></div></article>";
  }

  function studyCard(s) {
    return '<article class="study-card note stitched">' +
      (s.logo ? '<img class="study-logo" src="' + esc(s.logo) + '" alt="">' : "") +
      '<div><p class="kicker">' + esc(L(UI.partner)) + (s.status ? " · " + esc(L(s.status)) : "") + "</p>" +
      '<h3 class="script-sm">' + esc(L(s.title)) + "</h3>" +
      '<p class="study-partner">' + esc(L(s.partner)) + "</p>" +
      "<p>" + esc(L(s.summary)) + "</p>" +
      (s.url ? '<a class="link-u" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(L(UI.view)) + "</a>" : "") +
      "</div></article>";
  }

  function teamCard(m) {
    return '<article class="team-card">' +
      (m.photo ? '<img src="' + esc(m.photo) + '" alt="">' : '<img src="assets/nesya.svg" alt="" class="ph">') +
      "<h3>" + esc(m.name) + "</h3><p>" + esc(L(m.role)) + "</p></article>";
  }

  function fill(id, html) { var el = document.getElementById(id); if (el) el.innerHTML = html; }

  function render() {
    var reading = D.READING || [], pubs = D.PUBLICATIONS || [], studies = D.STUDIES || [], team = D.TEAM || [];
    fill("reading-list", reading.map(paperCard).join(""));
    fill("reading-teaser", reading.slice(0, 3).map(paperCard).join(""));
    fill("pubs-list", pubs.length ? pubs.map(paperCard).join("") : soon("soonPubs"));
    fill("studies-list", studies.length ? studies.map(studyCard).join("") : soon("soonStudies"));
    fill("team-list", team.length ? team.map(teamCard).join("") : soon("soonTeam"));
    var count = document.getElementById("reading-count");
    if (count) count.textContent = reading.length;
  }

  render();
  document.addEventListener("langchange", render);
})();
