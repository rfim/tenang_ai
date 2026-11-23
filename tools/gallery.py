"""The gallery page: 'Dari ELIZA ke Nesya', a museum-style history of conversational
agents in mental health, and what each one taught us. Called from build_pages.py.

Every room is a well-documented event; sources are listed at the bottom of the page.
Each room: (key, year, title_id, title_en, object_id, object_en, body_id, body_en, lesson_id, lesson_en, artifact_html)
"""


def artifact_paper(title, sub):
    return f'<div class="ga-paper"><small>{sub}</small><b>{title}</b><i></i><i></i><i></i><i></i></div>'


ELIZA_LINES = [
    ("u", "Men are all alike."),
    ("e", "IN WHAT WAY?"),
    ("u", "They're always bugging us about something or other."),
    ("e", "CAN YOU THINK OF A SPECIFIC EXAMPLE?"),
    ("u", "Well, my boyfriend made me come here."),
    ("e", "YOUR BOYFRIEND MADE YOU COME HERE?"),
]

ROOMS = [
    ("r0", "1950",
     "Pertanyaan pertama", "The first question",
     "Makalah · jurnal Mind · Alan Turing", "Paper · Mind journal · Alan Turing",
     "Alan Turing bertanya: dapatkah mesin berpikir? Ia mengusulkan sebuah permainan imitasi: jika lewat percakapan kita tidak bisa membedakan mesin dari manusia, apa artinya? Pertanyaan ini menjadi titik awal semua chatbot.",
     "Alan Turing asked: can machines think? He proposed an imitation game: if, in conversation, we can't tell a machine from a person, what does that mean? The question became the starting point of every chatbot.",
     "Percakapan adalah antarmuka yang paling manusiawi.",
     "Conversation is the most human interface there is.",
     artifact_paper("Computing Machinery and Intelligence", "Mind · Vol. LIX · 1950")),

    ("r1", "1966",
     "ELIZA", "ELIZA",
     "Program komputer · MIT · Joseph Weizenbaum", "Computer program · MIT · Joseph Weizenbaum",
     "Skrip DOCTOR membuat ELIZA meniru gaya terapis Rogerian: memantulkan kata-kata pengguna dengan aturan sederhana. Tidak ada pemahaman sama sekali. Namun orang-orang tetap membuka diri kepadanya. Weizenbaum menulis bahwa sekretarisnya sendiri meminta ia keluar ruangan agar bisa berbicara dengan ELIZA. Fenomena ini kemudian dikenal sebagai efek ELIZA.",
     "The DOCTOR script made ELIZA imitate a Rogerian therapist, reflecting the user's words back with simple rules. It understood nothing. Yet people opened up to it. Weizenbaum wrote that his own secretary asked him to leave the room so she could talk to ELIZA. This became known as the ELIZA effect.",
     "Orang cepat percaya pada mesin yang mendengarkan. Itu tanggung jawab, bukan celah. Nesya selalu jujur bahwa ia adalah AI.",
     "People quickly trust a machine that listens. That is a responsibility, not a loophole. Nesya is always honest that it is an AI.",
     '<div class="ga-crt" data-type><div class="ga-crt-screen">'
     + "".join(f'<p class="{w}" data-line="{line}"></p>' for w, line in ELIZA_LINES)
     + '<span class="ga-caret"></span></div><div class="ga-crt-base"></div></div>'),

    ("r2", "1972",
     "PARRY", "PARRY",
     "Program komputer · Stanford · Kenneth Colby, psikiater", "Computer program · Stanford · Kenneth Colby, psychiatrist",
     "Jika ELIZA berperan sebagai terapis, PARRY berperan sebagai pasien: ia mensimulasikan seseorang dengan skizofrenia paranoid. Dalam uji yang dirancang Colby, psikiater kesulitan membedakan transkrip PARRY dari pasien sungguhan. Pada 1972, PARRY dan ELIZA bahkan bertemu dan bercakap lewat ARPANET.",
     "If ELIZA played the therapist, PARRY played the patient: it simulated a person with paranoid schizophrenia. In tests Colby designed, psychiatrists struggled to tell PARRY's transcripts from real patients'. In 1972 PARRY and ELIZA even met and talked over the ARPANET.",
     "Terdengar meyakinkan tidak sama dengan memahami. Penilaian klinis tetap milik manusia.",
     "Sounding convincing is not the same as understanding. Clinical judgement stays with people.",
     '<div class="ga-net"><span class="ga-node">ELIZA<small>MIT</small></span><span class="ga-wire"><i></i></span><span class="ga-node">PARRY<small>Stanford</small></span><em>ARPANET · 1972</em></div>'),

    ("r3", "1976",
     "Peringatan sang pencipta", "A warning from the maker",
     "Buku · Computer Power and Human Reason", "Book · Computer Power and Human Reason",
     "Terkejut oleh reaksi orang terhadap ELIZA, Weizenbaum menjadi salah satu pengkritik paling tajam dunia komputer. Ia menulis: “What I had not realized is that extremely short exposures to a relatively simple computer program could induce powerful delusional thinking in quite normal people.”",
     "Shocked by how people reacted to ELIZA, Weizenbaum became one of computing's sharpest critics. He wrote: “What I had not realized is that extremely short exposures to a relatively simple computer program could induce powerful delusional thinking in quite normal people.”",
     "Teknologi untuk kesehatan mental harus dibangun dengan batas, bukan hanya kemampuan.",
     "Technology for mental health must be built with limits, not just capabilities.",
     '<div class="ga-book"><span>Computer Power<br>and Human Reason</span><small>Joseph Weizenbaum</small></div>'),

    ("r4", "2000-an", "Terapi lewat layar", "Therapy on a screen",
     "Program CBT terkomputerisasi · MoodGYM, Beating the Blues", "Computerised CBT · MoodGYM, Beating the Blues",
     "Teknik terapi kognitif-perilaku (CBT) yang terstruktur mulai dikemas menjadi program komputer dan diuji secara ilmiah, seperti MoodGYM di Australia dan Beating the Blues di Inggris. Pada 2006, NICE di Inggris merekomendasikan CBT terkomputerisasi untuk depresi ringan hingga sedang.",
     "Structured cognitive behavioural therapy (CBT) began to be packaged as computer programmes and tested scientifically, such as MoodGYM in Australia and Beating the Blues in the UK. In 2006 the UK's NICE recommended computerised CBT for mild to moderate depression.",
     "Metode berbasis bukti bisa bekerja lewat layar, asal terstruktur dan teruji.",
     "Evidence-based methods can work through a screen, if they are structured and tested.",
     '<div class="ga-monitor"><div class="ga-mon-screen"><b>Modul 1</b><span></span><span></span><span class="s"></span><em>Lanjut →</em></div><div class="ga-mon-stand"></div></div>'),

    ("r5", "2017", "Chatbot masuk uji klinis", "Chatbots enter clinical trials",
     "Uji acak terkontrol · Woebot · JMIR Mental Health", "Randomised controlled trial · Woebot · JMIR Mental Health",
     "Untuk pertama kalinya, chatbot berbasis CBT diuji lewat uji acak terkontrol: 70 mahasiswa, dua minggu, dan penurunan gejala depresi yang lebih besar dibanding kelompok pembanding. Wysa dari India menyusul dengan data penggunaan di dunia nyata pada 2018.",
     "For the first time, a CBT-based chatbot was tested in a randomised controlled trial: 70 university students, two weeks, and a larger drop in depression symptoms than the comparison group. Wysa, from India, followed with real-world usage data in 2018.",
     "Ukur dampaknya, jangan hanya mengklaim.",
     "Measure the impact; don't just claim it.",
     '<div class="ga-phone"><span class="b u"></span><span class="b"></span><span class="b u s"></span><div class="ga-bars"><i style="--h:80%"></i><i style="--h:62%"></i><i style="--h:44%"></i></div></div>'),

    ("r6", "2020", "Dunia di dalam rumah", "The world indoors",
     "Laporan ilmiah · WHO, 2022", "Scientific brief · WHO, 2022",
     "WHO mencatat prevalensi kecemasan dan depresi di dunia naik sekitar 25% pada tahun pertama pandemi COVID-19. Banyak layanan pindah ke telepon dan layar. Di Indonesia, layanan psikologi SEJIWA lewat 119 ext. 8 dibuka pada tahun yang sama.",
     "WHO reported that the global prevalence of anxiety and depression rose by about 25% in the first year of the COVID-19 pandemic. Many services moved to phones and screens. In Indonesia, the SEJIWA psychology line on 119 ext. 8 opened the same year.",
     "Dukungan harus bisa dijangkau dari mana saja, kapan saja.",
     "Support has to be reachable from anywhere, at any time.",
     '<div class="ga-big"><b>+25%</b><small>kecemasan & depresi · anxiety & depression</small></div>'),

    ("r7", "2022", "Potret Indonesia", "A portrait of Indonesia",
     "Survei nasional · I-NAMHS", "National survey · I-NAMHS",
     "Survei nasional pertama tentang kesehatan mental remaja Indonesia (I-NAMHS) menemukan sekitar satu dari tiga remaja mengalami masalah kesehatan mental dalam 12 bulan terakhir. Hanya sebagian kecil dari mereka yang pernah mengakses layanan.",
     "The first national survey of adolescent mental health in Indonesia (I-NAMHS) found that about one in three adolescents had a mental health problem in the previous 12 months. Only a small share of them had ever used a service.",
     "Kebutuhannya besar, tetapi jalannya belum terbuka. Di situlah kami ingin membantu.",
     "The need is large, but the path isn't open yet. That's where we want to help.",
     '<div class="ga-three"><span></span><span class="on"></span><span></span><small>1 dari 3 · 1 in 3</small></div>'),

    ("r8", "2022", "Bahasa alami untuk semua", "Natural language for everyone",
     "Model bahasa besar · rilis publik ChatGPT, November 2022", "Large language models · ChatGPT public release, November 2022",
     "Model bahasa besar membuat percakapan dengan mesin terasa alami bagi ratusan juta orang, dalam banyak bahasa, termasuk Bahasa Indonesia sehari-hari. Untuk pertama kalinya, sebuah chatbot bisa mengerti “capek banget” seperti yang dimaksud penuturnya.",
     "Large language models made talking to a machine feel natural for hundreds of millions of people, in many languages, including everyday Bahasa Indonesia. For the first time, a chatbot could understand “capek banget” the way the speaker meant it.",
     "Teknologinya kini siap untuk bahasa kita.",
     "The technology is now ready for our language.",
     '<div class="ga-type"><span>Aku lagi capek banget…</span><i class="ga-caret"></i></div>'),

    ("r9", "2023", "Pelajaran dari Tessa", "The lesson of Tessa",
     "Chatbot · organisasi gangguan makan di AS (NEDA)", "Chatbot · a US eating disorder organisation (NEDA)",
     "Sebuah organisasi gangguan makan di Amerika Serikat menonaktifkan chatbot “Tessa” setelah chatbot itu memberikan saran diet yang berisiko kepada orang-orang yang mencari bantuan.",
     "A US eating disorder organisation took its chatbot “Tessa” offline after it gave risky dieting advice to people who came for help.",
     "Tanpa batas keamanan dan pengawasan klinis, AI bisa menyakiti. Nesya punya batas topik dan jalur eskalasi ke manusia.",
     "Without safety limits and clinical oversight, AI can harm. Nesya has topic limits and an escalation path to people.",
     '<div class="ga-warn"><span>!</span></div>'),

    ("r10", "2025", "AI generatif dalam uji klinis", "Generative AI in a clinical trial",
     "Uji acak terkontrol · Therabot, Dartmouth · NEJM AI", "Randomised controlled trial · Therabot, Dartmouth · NEJM AI",
     "Uji acak pertama untuk chatbot AI generatif dalam terapi menunjukkan penurunan gejala depresi dan kecemasan setelah empat minggu. Sepanjang uji, klinisi memantau percakapan dan siap turun tangan.",
     "The first randomised trial of a generative AI chatbot for treatment showed reduced symptoms of depression and anxiety after four weeks. Throughout the trial, clinicians monitored conversations and were ready to step in.",
     "AI generatif bisa membantu, selama manusia tetap terlibat.",
     "Generative AI can help, as long as people stay involved.",
     '<div class="ga-duo"><span class="ga-person"></span><span class="ga-plus">+</span><img src="assets/nesya.svg" alt=""></div>'),
    ("r11", "Kini", "Nesya", "Nesya",
     "Teman cerita berbasis AI · TenangAI, Jakarta", "AI companion · TenangAI, Jakarta",
     "Semua pelajaran itu kami bawa pulang ke Jakarta, dengan satu pertanyaan: bagaimana jika orang Indonesia punya tempat bercerita yang jujur bahwa ia AI, mengerti bahasa sehari-hari, tetap ada jam dua pagi, dan tahu kapan harus memanggil manusia? Jawabannya adalah Nesya, teman cerita yang dirancang bersama psikolog klinis.",
     "We brought all of those lessons home to Jakarta, with one question: what if people in Indonesia had a place to talk that is honest about being an AI, understands everyday language, is still there at two in the morning, and knows when to call a person? The answer is Nesya, an AI companion designed with clinical psychologists.",
     "Satu teman cerita untuk setiap orang, dengan batas yang jelas.",
     "A companion for every person, with clear limits.",
     '<div class="ga-nesya"><img src="assets/nesya.svg" alt=""><span class="b u">Aku lagi capek banget\u2026</span><span class="b">Aku dengerin. Mau cerita pelan-pelan?</span></div>'),

    ("r12", "Kini", "Lalu menjadi N2CIAS", "Then it became N2CIAS",
     "Layanan untuk institusi · Nesya, jalur dukungan, dashboard anonim", "A service for institutions · Nesya, care pathway, anonymous dashboard",
     "Satu orang yang merasa lebih baik belum cukup bagi sebuah kampus, rumah sakit, atau perusahaan. Institusi perlu tahu kapan dan di mana dukungan dibutuhkan, tanpa membaca percakapan siapa pun. Maka Nesya menjadi bagian dari sesuatu yang lebih besar: N2CIAS. Nesya untuk setiap orang, jalur dukungan sampai ke psikolog, dan dashboard anonim untuk institusi. Setiap institusi mulai lewat pilot, dan hasilnya kembali menjadi riset.",
     "One person feeling better isn't enough for a university, a hospital or a company. Institutions need to know when and where support is needed, without reading anyone's conversations. So Nesya became part of something bigger: N2CIAS. Nesya for every person, a care pathway that reaches psychologists, and an anonymous dashboard for the institution. Every institution starts with a pilot, and the results flow back into research.",
     "Dari riset, menjadi sistem dukungan untuk seluruh institusi.",
     "From research to a support system for a whole institution.",
     '<div class="ga-sys"><span class="ga-s1"><img src="assets/nesya.svg" alt="">Nesya</span><i></i><span class="ga-s2">Psikolog</span><i></i><span class="ga-s3"><b class="bars"><em style="--h:45%"></em><em style="--h:75%"></em><em style="--h:55%"></em></b>Dashboard</span><small>N2CIAS</small></div>')
]

SOURCES = [
    "Turing AM. Computing Machinery and Intelligence. Mind. 1950;59(236):433–460.",
    "Weizenbaum J. ELIZA: a computer program for the study of natural language communication between man and machine. Communications of the ACM. 1966;9(1):36–45.",
    "Colby KM, Weber S, Hilf FD. Artificial paranoia. Artificial Intelligence. 1971;2(1):1–25.",
    "Weizenbaum J. Computer Power and Human Reason: From Judgment to Calculation. W. H. Freeman; 1976.",
    "NICE. Computerised cognitive behaviour therapy for depression and anxiety (TA97). 2006.",
    "Fitzpatrick KK, Darcy A, Vierhile M. Delivering CBT to young adults using a fully automated conversational agent (Woebot): a randomized controlled trial. JMIR Mental Health. 2017;4(2):e19.",
    "Inkster B, Sarda S, Subramanian V. An empathy-driven, conversational AI agent (Wysa) for digital mental well-being. JMIR mHealth and uHealth. 2018;6(11):e12106.",
    "World Health Organization. Mental health and COVID-19: early evidence of the pandemic's impact. Scientific brief, 2 March 2022.",
    "Center for Reproductive Health UGM, University of Queensland, Johns Hopkins Bloomberg School of Public Health. Indonesia National Adolescent Mental Health Survey (I-NAMHS) report. 2022.",
    "Media reports on NEDA's Tessa chatbot being taken offline, June 2023.",
    "Heinz MV, et al. Randomized trial of a generative AI chatbot for mental health treatment. NEJM AI. 2025;2(4).",
]


def build(t, page, page_hero_unused=None):
    rooms = []
    for i, r in enumerate(ROOMS):
        key, year, tid, ten, oid, oen, bid, ben, lid, len_, art = r
        side = "left" if i % 2 == 0 else "right"
        rooms.append(f'''
    <article class="ga-room ga-{side}{' ga-ours' if key in ('r11', 'r12') else ''}" id="{key}" data-year="{year}">
      <div class="ga-frame"><div class="ga-light"></div><div class="ga-art">{art}</div></div>
      <div class="ga-plaque">
        <p class="ga-no">{t("ga.room", "Ruang", "Room")} {i:02d} · <span class="ga-year">{year}</span></p>
        {t(f"ga.{key}.t", tid, ten, tag="h2", cls="ga-title")}
        {t(f"ga.{key}.o", oid, oen, tag="p", cls="ga-obj")}
        {t(f"ga.{key}.b", bid, ben, tag="p", cls="ga-body")}
        <div class="ga-lesson"><span>{t("ga.built", "Yang kami bangun", "What we built") if key in ("r11", "r12") else t("ga.lesson", "Pelajaran untuk Nesya", "Lesson for Nesya")}</span>{t(f"ga.{key}.l", lid, len_, tag="p")}</div>
      </div>
    </article>''')

    lessons = [
        ("ga.f1", "Jujur bahwa ia AI", "Honest that it is an AI", "1966"),
        ("ga.f2", "Penilaian klinis oleh manusia", "Clinical judgement by people", "1972"),
        ("ga.f3", "Batas yang jelas", "Clear limits", "1976 · 2023"),
        ("ga.f4", "Metode berbasis bukti", "Evidence-based methods", "2000-an"),
        ("ga.f5", "Dampak yang diukur", "Measured impact", "2017"),
        ("ga.f6", "Tersedia kapan saja", "Available any time", "2020"),
        ("ga.f7", "Untuk kebutuhan Indonesia", "Built for Indonesia's needs", "2022"),
        ("ga.f8", "Berbahasa Indonesia sehari-hari", "Everyday Bahasa Indonesia", "2022"),
        ("ga.f9", "Manusia tetap terlibat", "People stay involved", "2025"),
    ]
    lesson_html = "".join(f'<li><small>{y}</small>{t(k, a, b)}</li>' for k, a, b, y in lessons)

    main = f'''<section class="ga-hero">
  <div class="ga-hero-light" aria-hidden="true"></div>
  <div class="wrap ga-hero-in">
    <p class="eyebrow2"><a href="index.html">N2CIAS</a> · {t("ga.kicker", "Galeri", "Gallery")}</p>
    {t("ga.title", "Dari ELIZA ke N2CIAS.", "From ELIZA to N2CIAS.", tag="h1", cls="h1")}
    {t("ga.lead", "Sebuah galeri tentang enam puluh tahun percakapan antara manusia dan mesin, dan bagaimana pelajarannya menjadi Nesya, lalu N2CIAS. Berjalanlah perlahan; setiap ruang menyala saat Anda tiba.", "A gallery of sixty years of conversations between people and machines, and how their lessons became Nesya, then N2CIAS. Walk slowly; each room lights up as you arrive.", tag="p", cls="ga-lead")}
    <a href="#r0" class="ga-enter">{t("ga.enter", "Masuk galeri", "Enter the gallery")} <span aria-hidden="true">↓</span></a>
  </div>
</section>

<section class="ga-hall" aria-label="Galeri">
  <div class="ga-rail" aria-hidden="true"><div class="ga-rail-fill"></div></div>
  <div class="ga-now" aria-hidden="true"><span class="ga-now-year">1950</span></div>
  <div class="wrap ga-rooms">{"".join(rooms)}
  </div>
</section>

<section class="ga-final">
  <div class="wrap">
    <div class="ga-final-head">
      <img src="assets/nesya.svg" alt="" class="ga-final-nesya">
      <p class="ga-no">{t("ga.exit", "Pintu keluar", "Exit")}</p>
      {t("ga.final.t", "N2CIAS: enam puluh tahun pelajaran, untuk institusi Indonesia.", "N2CIAS: sixty years of lessons, for Indonesian institutions.", tag="h2", cls="h2 center")}
      {t("ga.final.b", "Kami tidak menciptakan percakapan antara manusia dan mesin. Kami belajar dari enam puluh tahun percobaannya, termasuk kesalahannya, lalu membangun Nesya untuk setiap orang dan N2CIAS untuk institusinya.", "We didn't invent conversations between people and machines. We learned from sixty years of attempts, mistakes included, and built Nesya for each person and N2CIAS for their institution.", tag="p", cls="ed-p center")}
    </div>
    <ol class="ga-lessons">{lesson_html}</ol>
    <div class="pbtn-row center">
      <a href="research.html" class="pbtn pbtn-dark"><span class="pbtn-t" data-i18n="ga.cta1">Lihat rujukan riset</span><span class="pbtn-i"><svg width="14" height="10"><use href="#arrow"/></svg></span></a>
      <a href="index.html#demo" class="pbtn pbtn-soft"><span class="pbtn-t" data-i18n="cta.demo">Jadwalkan demo</span><span class="pbtn-i"><svg width="14" height="10"><use href="#arrow"/></svg></span></a>
    </div>
  </div>
</section>

<section class="ga-sources">
  <div class="wrap narrow">
    <details>
      <summary>{t("ga.src", "Sumber untuk setiap ruang", "Sources for every room")}</summary>
      <ol>{"".join(f"<li>{s}</li>" for s in SOURCES)}</ol>
    </details>
  </div>
</section>'''
    page("galeri.html", "Galeri: dari ELIZA ke N2CIAS · N2CIAS oleh TenangAI",
         "Sejarah percakapan antara manusia dan mesin di kesehatan mental, dari ELIZA (1966) sampai Nesya dan N2CIAS.",
         main, active="galeri.html")
    return {"ga.cta1": "See the research references"}
