// Renders the lists in data.js into the research page and the home page teasers.
(function () {
  "use strict";
  var D = window.TENANG_DATA || {};
  var UI = {
    view: { id: "Baca", en: "Read" },
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

  function paperCard(p, i) {
    return '<article class="paper-card note">' +
      '<div class="paper-cover" aria-hidden="true"><small>' + esc(p.venue.split(",")[0]) + "</small><b>" + esc(p.title.split(":")[0]) + "</b><i></i><i></i><i></i><span>" + p.year + "</span></div>" +
      '<div class="paper-body">' +
      (p.type ? '<p class="pill-tag">' + esc(L(p.type)) + "</p>" : "") +
      '<p class="paper-authors">' + esc(p.authors) + " · " + p.year + "</p>" +
      '<h3 class="paper-title">' + esc(p.title) + "</h3>" +
      '<p class="paper-venue">' + esc(p.venue) + "</p>" +
      '<p class="paper-sum">' + esc(L(p.summary)) + "</p>" +
      '<div class="paper-actions">' +
      (p.url ? '<a class="btn btn-ghost-sm" href="' + esc(p.url) + '" target="_blank" rel="noopener">' + esc(L(UI.view)) + "</a>" : "") +
      (p.pdf ? '<a class="btn btn-teal btn-sm" href="' + esc(p.pdf) + '" download>' + esc(L(UI.pdf)) + "</a>" : "") +
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
