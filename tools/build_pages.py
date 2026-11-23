"""Build the extra pages (research + organisation pages) from index.html's header and footer.

Run from the repo root:  python3 tools/build_pages.py
Writes research.html, universitas.html, perusahaan.html, rumah-sakit.html,
kesehatan-masyarakat.html and i18n-pages.js (English copy for those pages).
Edit the text in this file, then run it again.
"""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
index = (ROOT / "index.html").read_text(encoding="utf-8")

head = index[: index.index("</head>")]
body_start = index[index.index("</head>") : index.index('<main id="main">')]
footer = index[index.index('<footer class="footer') : index.index('<script src="i18n.js">')]

CAROUSEL = index[index.index("<!-- PARTNERS: moving logo carousel -->") : index.index("<!-- /PARTNERS -->")]
ID_TEXT = dict(re.findall(r'data-i18n="([^"]+)"[^>]*>([^<]+)<', index))
# Outcome lines for the organisation pages (Indonesian; English is in i18n.js)
ID_TEXT.update({
 "use.uni.1": "Mahasiswa mencari bantuan lebih awal",
 "use.uni.2": "Antrean konseling berkurang",
 "use.uni.3": "Diarahkan ke langkah yang sesuai",
 "use.uni.4": "Periode puncak kebutuhan terlihat",
 "use.uni.5": "Bahan perencanaan program kemahasiswaan",
 "use.hos.1": "Tersedia di semua shift",
 "use.hos.2": "Tanda burnout terlihat lebih awal",
 "use.hos.3": "Rujukan ke psikolog saat dibutuhkan",
 "use.hos.4": "Gambaran beban per unit",
 "use.com.1": "Tunjangan benar-benar dipakai",
 "use.com.2": "Biaya lebih terukur dari sesi satu-per-satu",
 "use.com.3": "Data untuk program kesejahteraan",
 "use.com.4": "Masalah terlihat sebelum memengaruhi kinerja",
 "use.pub.1": "Akses tanpa antre",
 "use.pub.2": "Gambaran kebutuhan per wilayah",
 "use.pub.3": "Rujukan ke layanan setempat"
})

HOME_ANCHORS = ["story", "toolkit", "platform", "use-cases", "dashboard", "safety", "pilot", "demo", "coverage", "how-it-works", "faq"]


def relink(html):
    html = html.replace('href="#top"', 'href="index.html"')
    for a in HOME_ANCHORS:
        html = html.replace(f'href="#{a}"', f'href="index.html#{a}"')
    return html


EN = {}


def t(key, id_text, en_text, tag="span", cls=None, extra=""):
    EN[key] = en_text
    c = f' class="{cls}"' if cls else ""
    return f'<{tag}{c} data-i18n="{key}"{extra}>{id_text}</{tag}>'


def page(filename, title, desc, main_html, active=None):
    h = re.sub(r"<title>.*?</title>", f"<title>{title}</title>", head, flags=re.S)
    h = re.sub(r'<meta name="description" content=".*?">', f'<meta name="description" content="{desc}">', h)
    h = re.sub(r'<meta property="og:title" content=".*?">', f'<meta property="og:title" content="{title}">', h)
    top = relink(body_start)
    if active:
        top = top.replace(f'<a href="{active}"', f'<a aria-current="page" href="{active}"', 1)
    out = (
        h + top + '<main id="main" class="subpage">\n' + main_html + "\n</main>\n\n" + relink(footer)
        + '<script src="i18n.js"></script>\n<script src="i18n-pages.js"></script>\n<script src="app.js"></script>\n'
        + '<script src="data.js"></script>\n<script src="research.js"></script>\n</body>\n</html>\n'
    )
    (ROOT / filename).write_text(out, encoding="utf-8")


def page_hero(kicker_key, kicker_id, kicker_en, title_key, title_id, title_en, lead_key, lead_id, lead_en, art="hero"):
    film = art
    return f'''<section class="hero2 hero-sub">
  <div class="hero2-bg" aria-hidden="true">
    <video class="hero2-video" autoplay muted loop playsinline preload="auto" poster="assets/film/{film}.jpg"><source src="assets/film/{film}.mp4" type="video/mp4"></video>
    <div class="hero2-shade"></div>
  </div>
  <div class="wrap hero2-grid hero2-center">
    <div class="hero2-copy">
      <p class="eyebrow2"><a href="index.html">N2CIAS</a> · {t(kicker_key, kicker_id, kicker_en)}</p>
      {t(title_key, title_id, title_en, tag="h1", cls="h1")}
      {t(lead_key, lead_id, lead_en, tag="p", cls="hero2-lead")}
      <div class="pbtn-row">
        <a href="index.html#demo" class="pbtn pbtn-light"><span class="pbtn-t" data-i18n="cta.demo">Jadwalkan demo</span><span class="pbtn-i"><svg width="14" height="10"><use href="#arrow"/></svg></span></a>
        <a href="index.html#coverage" class="pbtn pbtn-ghost"><span class="pbtn-t" data-i18n="org.plan">Hitung kebutuhan</span></a>
      </div>
    </div>
  </div>
</section>'''


# ---------------------------------------------------------------- research.html
research_main = page_hero(
    "rp.kicker", "Riset & publikasi", "Research & publications",
    "rp.title", "Riset dan publikasi.", "Research and publications.",
    "rp.lead",
    "Studi tentang N2CIAS, tulisan tim kami, dan penelitian tentang pendamping AI untuk kesehatan mental yang menjadi bahan belajar kami.",
    "Studies of N2CIAS, writing by our team, and research on AI companions for mental health that we learn from.",
    art="safety",
) + f'''

<section class="section paper" id="studies">
  <div class="wrap">
    <p class="kicker">01 / {t("rp.s.kicker", "Studi klinis", "Clinical studies")}</p>
    {t("rp.s.title", "Studi N2CIAS bersama mitra.", "N2CIAS studies with partners.", tag="h2", cls="display")}
    {t("rp.s.sub", "Evaluasi Nesya dan N2CIAS bersama institusi mitra.", "Evaluations of Nesya and N2CIAS with partner institutions.", tag="p", cls="sub")}
    <div class="study-list" id="studies-list"></div>
  </div>
</section>

<section class="section tint torn-top" id="publications">
  <div class="wrap">
    <p class="kicker">02 / {t("rp.p.kicker", "Publikasi tim", "Team publications")}</p>
    {t("rp.p.title", "Tulisan tim TenangAI.", "Writing by the TenangAI team.", tag="h2", cls="display")}
    <div class="paper-list" id="pubs-list"></div>
  </div>
</section>

<section class="section paper torn-top" id="reading">
  <div class="wrap">
    <p class="kicker">03 / {t("rp.r.kicker", "Rujukan", "References")}</p>
    {t("rp.r.title", "Penelitian yang kami pelajari.", "Research we learn from.", tag="h2", cls="display")}
    {t("rp.r.sub", "Studi yang dipublikasikan peneliti lain tentang chatbot dan pendamping AI untuk kesehatan mental. Bukan karya TenangAI.", "Studies published by other researchers on chatbots and AI companions for mental health. Not written by TenangAI.", tag="p", cls="sub")}
    <div class="paper-list" id="reading-list"></div>
  </div>
</section>

<section class="band band-teal edge-both" id="principles">
  <div class="wrap">
    {t("rp.pr.title", "Cara kami memakai bukti", "How we use evidence", tag="h2", cls="script center")}
    <div class="cols-3 principles">
      <article class="note stitched">{t("rp.pr.1.t", "Tidak mendiagnosis", "We don't diagnose", tag="h3", cls="caps")}{t("rp.pr.1.b", "Nesya mengenali tanda dan kebutuhan dukungan. Diagnosis tetap tugas tenaga profesional.", "Nesya recognises signs and support needs. Diagnosis stays with professionals.", tag="p")}</article>
      <article class="note stitched">{t("rp.pr.2.t", "Bersama ahli psikologi", "With psychology experts", tag="h3", cls="caps")}{t("rp.pr.2.b", "Alur percakapan dan jalur rujukan disusun dengan pemahaman psikologi klinis.", "Conversation flows and referral paths are designed with clinical psychology knowledge.", tag="p")}</article>
      <article class="note stitched">{t("rp.pr.3.t", "Jujur soal batasan", "Honest about limits", tag="h3", cls="caps")}{t("rp.pr.3.b", "Bukti untuk chatbot kesehatan mental masih berkembang. Karena itu Nesya melengkapi psikolog, tidak menggantikan.", "Evidence for mental health chatbots is still growing. That's why Nesya complements psychologists rather than replacing them.", tag="p")}</article>
    </div>
  </div>
</section>

<section class="section paper" id="team">
  <div class="wrap">
    <div class="head">
      {t("rp.t.title", "Tim klinis", "Clinical team", tag="h2", cls="script")}
      <img class="divider" src="assets/divider.svg" alt="" width="200" height="18">
      {t("rp.t.lead", "Psikolog dan peninjau yang ikut membangun Nesya.", "The psychologists and reviewers who help build Nesya.", tag="p", cls="lead")}
    </div>
    <div class="team-list" id="team-list"></div>
  </div>
</section>

<section class="section tint torn-top">
  <div class="wrap pilot-card">
    {t("rp.c.title", "Ingin meneliti bersama kami?", "Want to research with us?", tag="h2", cls="script-sm")}
    {t("rp.c.body", "Kami terbuka untuk kolaborasi riset dengan universitas, rumah sakit, dan lembaga kesehatan.", "We welcome research collaborations with universities, hospitals, and health institutions.", tag="p")}
    <a class="btn btn-teal" href="mailto:hai@tenangaja.co.id?subject=Kolaborasi%20riset" data-i18n="rp.c.cta">Hubungi tim riset</a>
  </div>
</section>'''
EN["rp.c.cta"] = "Contact the research team"
page("research.html", "Riset & publikasi · N2CIAS oleh TenangAI",
     "Studi, publikasi, dan rujukan ilmiah di balik Nesya dan N2CIAS.", research_main, active="research.html")

# ---------------------------------------------------------- organisation pages
EN.update({
    "org.challenge": "The challenge",
    "org.helps": "How N2CIAS helps",
    "org.outcomes": "Expected outcomes",
    "org.plan": "Plan your coverage",
    "org.cta.t": "Start with a pilot",
    "org.cta.b": "Pilots usually run 8–12 weeks for one group, with onboarding, agreed goals, and a joint review.",
    "org.research": "See the research we learn from",
})

ORGS = [
    {
        "file": "universitas.html", "key": "uni", "use": "uni", "n": 5, "art": "uni",
        "kicker": ("Universitas", "Universities"),
        "title": ("Dukungan untuk mahasiswa, di luar jam konseling.", "Support for students, beyond counselling hours."),
        "lead": ("Mahasiswa bisa bercerita kapan saja lewat Nesya. Tim kemahasiswaan melihat kapan dan di mana kebutuhan naik, tanpa membaca percakapan siapa pun.",
                 "Students can talk any time through Nesya. Student affairs sees when and where demand rises, without reading anyone's conversations."),
        "campus": True,
        "c": [("Antrean konseling panjang", "Long counselling queues", "Jumlah mahasiswa yang butuh dukungan jauh lebih besar dari kapasitas konselor kampus.", "Far more students need support than campus counsellors can see."),
              ("Masa ujian dan tugas akhir", "Exams and theses", "Kebutuhan naik tajam di periode tertentu, sering tanpa terlihat oleh kampus.", "Demand spikes at certain times of year, often unseen by the university."),
              ("Malu atau ragu mencari bantuan", "Hesitation to seek help", "Banyak mahasiswa belum siap datang ke ruang konseling untuk langkah pertama.", "Many students aren't ready to walk into a counselling office as a first step.")],
        "h": [("Langkah pertama yang mudah", "An easy first step", "Nesya tersedia 24/7 lewat browser, dalam bahasa sehari-hari mahasiswa.", "Nesya is available 24/7 in the browser, in students' everyday language."),
              ("Rujukan ke konselor kampus", "Referral to campus counsellors", "Mahasiswa yang butuh lebih diarahkan ke konselor kampus, dengan ringkasan atas izin mereka.", "Students who need more are directed to campus counsellors, with a summary if they consent."),
              ("Insight per fakultas", "Insight by faculty", "Tren agregat per fakultas dan periode, untuk menambah slot konseling di saat yang tepat.", "Aggregate trends by faculty and period, to add counselling slots at the right time."),
              ("Melengkapi, tidak menggantikan", "Complements, doesn't replace", "N2CIAS memperluas jangkauan tim konseling yang sudah ada.", "N2CIAS extends the reach of your existing counselling team.")],
    },
    {
        "file": "perusahaan.html", "key": "com", "use": "com", "n": 4, "art": "company",
        "kicker": ("Perusahaan", "Companies"),
        "title": ("Bantu karyawan sebelum masalah jadi masalah kerja.", "Help employees before problems become work problems."),
        "lead": ("Tunjangan kesehatan mental yang benar-benar dipakai: tempat bercerita 24/7 untuk karyawan, dan gambaran anonim untuk HR.",
                 "A mental health benefit people actually use: a place to talk 24/7 for employees, and an anonymous picture for HR."),
        "c": [("Tunjangan ada, jarang dipakai", "Benefits exist, rarely used", "Tidak semua karyawan siap langsung menemui psikolog.", "Not every employee is ready to see a psychologist straight away."),
              ("Masalah terlambat terlihat", "Problems show up late", "HR sering baru tahu setelah kinerja, absensi, atau semangat kerja turun.", "HR often only finds out once performance, attendance, or morale drops."),
              ("Biaya sesi satu-per-satu", "The cost of one-to-one sessions", "Menjangkau semua karyawan dengan sesi psikolog saja mahal dan sulit diperluas.", "Reaching every employee with psychologist sessions alone is expensive and hard to scale.")],
        "h": [("Tempat bercerita untuk semua", "Somewhere to talk for everyone", "Seluruh karyawan dalam program mendapat akses ke Nesya.", "Every employee in the programme gets access to Nesya."),
              ("Jalur ke psikolog", "A path to psychologists", "Dukungan lanjutan diarahkan ke psikolog atau EAP yang sudah ada.", "Further support is directed to psychologists or your existing EAP."),
              ("Tren untuk HR", "Trends for HR", "Keluhan terbanyak dan kebutuhan per unit, hanya dalam angka agregat.", "Top concerns and needs by unit, only as aggregate numbers."),
              ("Biaya terukur", "Predictable cost", "Biaya per orang per bulan sesuai kapasitas yang dipilih.", "A per-person monthly cost based on the capacity you choose.")],
    },
    {
        "file": "rumah-sakit.html", "key": "hos", "use": "hos", "n": 4, "art": "rain",
        "kicker": ("Rumah sakit", "Hospitals"),
        "title": ("Dukungan untuk orang-orang yang merawat orang lain.", "Support for the people who care for others."),
        "lead": ("Perawat, dokter, dan staf bisa bercerita sesudah shift malam. Manajemen melihat unit mana yang paling tertekan, tanpa melihat siapa bercerita apa.",
                 "Nurses, doctors, and staff can talk after a night shift. Management sees which units are under most strain, without seeing who said what."),
        "c": [("Shift panjang", "Long shifts", "Jam kerja tenaga kesehatan jarang cocok dengan jam layanan konseling.", "Healthcare working hours rarely match counselling hours."),
              ("Tekanan tinggi terus-menerus", "Sustained pressure", "Beban emosional dari pasien, keluarga, dan kejadian kritis menumpuk.", "Emotional load from patients, families, and critical incidents builds up."),
              ("Burnout terlambat terlihat", "Burnout spotted late", "Tanda kelelahan sering baru terlihat saat sudah memengaruhi layanan.", "Signs of exhaustion often only show once they affect care.")],
        "h": [("Tersedia di semua shift", "Available on every shift", "Nesya bisa diakses kapan saja, termasuk dini hari.", "Nesya is available any time, including the small hours."),
              ("Dukungan setelah kejadian berat", "Support after hard events", "Ruang untuk memproses hari yang berat, dan rujukan bila perlu.", "A space to process a hard day, with referral when needed."),
              ("Peta beban per unit", "Strain by unit", "Tren agregat per unit untuk perencanaan jadwal dan dukungan.", "Aggregate trends by unit for planning rotas and support."),
              ("Terhubung dengan K3 dan psikolog", "Linked to occupational health", "Rujukan ke layanan kesehatan kerja atau psikolog rumah sakit.", "Referral to occupational health or hospital psychologists.")],
    },
    {
        "file": "kesehatan-masyarakat.html", "key": "pub", "use": "pub", "n": 3, "art": "public",
        "kicker": ("Kesehatan masyarakat", "Public health"),
        "title": ("Menjangkau lebih banyak orang, lebih awal.", "Reach more people, earlier."),
        "lead": ("Dari Puskesmas sampai Dinas Kesehatan: langkah pertama yang mudah dijangkau warga, dan data agregat untuk perencanaan program.",
                 "From community health centres to district health offices: an easy first step for residents, and aggregate data for programme planning."),
        "c": [("Tenaga terbatas", "Limited staff", "Jumlah psikolog dan tenaga kesehatan jiwa belum sebanding dengan kebutuhan.", "There aren't enough psychologists and mental health workers for the need."),
              ("Sulit menjangkau", "Hard to reach", "Banyak warga tidak tahu harus mulai dari mana atau enggan datang langsung.", "Many residents don't know where to start or are reluctant to come in person."),
              ("Data kebutuhan minim", "Little data on need", "Program sulit direncanakan tanpa gambaran kebutuhan per wilayah.", "Programmes are hard to plan without a picture of need by area.")],
        "h": [("Akses tanpa antre", "Access without a queue", "Warga bisa mulai bercerita lewat browser di ponsel.", "Residents can start talking in the browser on their phone."),
              ("Rujukan ke layanan setempat", "Referral to local services", "Arah ke Puskesmas, psikolog, atau layanan darurat sesuai kebutuhan.", "Directions to health centres, psychologists, or emergency services as needed."),
              ("Gambaran per wilayah", "A picture by area", "Tren agregat untuk perencanaan program dan kampanye.", "Aggregate trends for programme and campaign planning."),
              ("Dirancang bersama tim Anda", "Designed with your team", "Kapasitas dan pelaporan direncanakan sesuai program.", "Capacity and reporting are planned around your programme.")],
    },
]

for o in ORGS:
    k = o["key"]
    challenges = "\n".join(
        f'      <article class="col">{t(f"org.{k}.c{i}t", c[0], c[1], tag="h3", cls="caps")}{t(f"org.{k}.c{i}b", c[2], c[3], tag="p")}</article>'
        for i, c in enumerate(o["c"], 1))
    helps = "\n".join(
        f'      <li><span class="num">{i}</span>{t(f"org.{k}.h{i}t", h[0], h[1], tag="h3", cls="caps")}{t(f"org.{k}.h{i}b", h[2], h[3], tag="p")}</li>'
        for i, h in enumerate(o["h"], 1))
    outcomes = "\n".join(f'        <li data-i18n="use.{o["use"]}.{i}">{ID_TEXT.get(f"use.{o['use']}.{i}", "")}</li>' for i in range(1, o["n"] + 1))
    campus = ""
    if o["key"] in ("uni", "hos"):
        campus = "\n" + CAROUSEL
    main = page_hero(f"org.{k}.kicker", o["kicker"][0], o["kicker"][1],
                     f"org.{k}.title", o["title"][0], o["title"][1],
                     f"org.{k}.lead", o["lead"][0], o["lead"][1], art=o["art"]) + campus + f'''

<section class="section paper">
  <div class="wrap">
    <div class="head"><h2 class="script" data-i18n="org.challenge">Tantangannya</h2><img class="divider" src="assets/divider.svg" alt="" width="200" height="18"></div>
    <div class="cols-4 cols-3x">
{challenges}
    </div>
  </div>
</section>

<section class="band band-olive edge-both">
  <div class="wrap">
    <h2 class="script center" data-i18n="org.helps">Bagaimana N2CIAS membantu</h2>
    <ol class="org-helps">
{helps}
    </ol>
  </div>
</section>

<section class="section paper">
  <div class="wrap org-out">
    <div class="note stitched">
      <h3 class="caps" data-i18n="org.outcomes">Hasil yang diharapkan</h3>
      <ul class="leafs">
{outcomes}
      </ul>
    </div>
    <div>
      <h2 class="script-sm" data-i18n="org.cta.t">Mulai dengan pilot</h2>
      <p data-i18n="org.cta.b">Pilot biasanya berjalan 8–12 minggu untuk satu kelompok, dengan onboarding, target yang disepakati, dan evaluasi bersama.</p>
      <div class="hero-cta">
        <a href="index.html#demo" class="btn btn-mustard" data-i18n="cta.demo">Jadwalkan demo</a>
        <a href="research.html" class="link-u" data-i18n="org.research">Lihat riset yang kami pelajari</a>
      </div>
    </div>
  </div>
</section>'''
    page(o["file"], f'{o["kicker"][0]} · N2CIAS oleh TenangAI', o["lead"][0], main, active=o["file"])

import sys
sys.path.insert(0, str(Path(__file__).resolve().parent))
import gallery  # noqa: E402
EN.update(gallery.build(t, page))

(ROOT / "i18n-pages.js").write_text(
    "// Generated by tools/build_pages.py: English copy for the extra pages.\n"
    "Object.assign(window.I18N_EN, " + json.dumps(EN, ensure_ascii=False, indent=1) + ");\n",
    encoding="utf-8")
print("built", 1 + len(ORGS), "pages,", len(EN), "strings")
