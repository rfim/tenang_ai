// Content lists for the research page and the home page teasers.
// Each text field is { id: "...", en: "..." }. Empty lists show a "coming soon" note.
//
// STUDIES: clinical studies of Nesya / N2CIAS (partner, design, results). Add real ones only.
// PUBLICATIONS: papers and chapters written by the TenangAI team.
// TEAM: psychologists and reviewers shown on the site.
// READING: published research the team builds on (not written by TenangAI).

window.TENANG_DATA = {
  STUDIES: [
    // {
    //   partner: { id: "Nama institusi mitra", en: "Partner institution" },
    //   logo: "assets/logos/partner.png",
    //   title: { id: "...", en: "..." },
    //   summary: { id: "Desain, jumlah peserta, durasi, alat ukur, hasil.", en: "Design, participants, duration, measures, results." },
    //   status: { id: "Berjalan", en: "Ongoing" },
    //   url: "https://..."
    // }
  ],

  PUBLICATIONS: [
    // {
    //   authors: "Nama Penulis, Nama Penulis",
    //   title: "Judul makalah",
    //   venue: "Nama jurnal / buku, volume(isu), tahun",
    //   year: 2026,
    //   summary: { id: "...", en: "..." },
    //   url: "https://doi.org/...",
    //   pdf: "papers/file.pdf"
    // }
  ],

  TEAM: [
    // { name: "Nama Lengkap, M.Psi., Psikolog", role: { id: "Psikolog klinis", en: "Clinical psychologist" }, photo: "assets/team/nama.jpg" }
  ],

  READING: [
    {
      authors: "Fitzpatrick KK, Darcy A, Vierhile M",
      title: "Delivering Cognitive Behavior Therapy to Young Adults With Symptoms of Depression and Anxiety Using a Fully Automated Conversational Agent (Woebot): A Randomized Controlled Trial",
      venue: "JMIR Mental Health, 4(2), e19",
      year: 2017,
      type: { id: "Uji acak terkontrol", en: "Randomised controlled trial" },
      summary: {
        id: "70 mahasiswa dengan gejala depresi dan kecemasan memakai chatbot berbasis CBT selama dua minggu atau membaca e-book dari NIMH. Kelompok chatbot menunjukkan penurunan gejala depresi (PHQ-9) yang lebih besar.",
        en: "70 university students with symptoms of depression and anxiety used a CBT-based chatbot for two weeks or read an NIMH e-book. The chatbot group showed a larger drop in depression symptoms (PHQ-9)."
      },
      url: "https://doi.org/10.2196/mental.7785"
    },
    {
      authors: "Inkster B, Sarda S, Subramanian V",
      title: "An Empathy-Driven, Conversational Artificial Intelligence Agent (Wysa) for Digital Mental Well-Being: Real-World Data Evaluation Mixed-Methods Study",
      venue: "JMIR mHealth and uHealth, 6(11), e12106",
      year: 2018,
      type: { id: "Studi data dunia nyata", en: "Real-world data study" },
      summary: {
        id: "Data pengguna dengan gejala depresi yang memakai aplikasi percakapan berbasis AI. Pengguna yang lebih aktif menunjukkan perbaikan gejala depresi yang lebih besar dibanding yang jarang memakai.",
        en: "Data from users with depression symptoms who used an AI conversational app. More engaged users showed greater improvement in depression symptoms than less engaged users."
      },
      url: "https://doi.org/10.2196/12106"
    },
    {
      authors: "Abd-Alrazaq AA, Rababeh A, Alajlani M, Bewick BM, Househ M",
      title: "Effectiveness and Safety of Using Chatbots to Improve Mental Health: Systematic Review and Meta-Analysis",
      venue: "Journal of Medical Internet Research, 22(7), e16021",
      year: 2020,
      type: { id: "Tinjauan sistematis dan meta-analisis", en: "Systematic review and meta-analysis" },
      summary: {
        id: "Merangkum studi tentang chatbot kesehatan mental. Ada tanda manfaat untuk depresi dan stres, tetapi kualitas bukti masih rendah dan data keamanan belum cukup. Penulis menyarankan chatbot sebagai pelengkap, bukan pengganti, layanan profesional.",
        en: "Pools studies of mental health chatbots. There are signs of benefit for depression and stress, but evidence quality is low and safety data are limited. The authors suggest chatbots complement, not replace, professional care."
      },
      url: "https://doi.org/10.2196/16021"
    },
    {
      authors: "Li H, Zhang R, Lee YC, Kraut RE, Mohr DC",
      title: "Systematic review and meta-analysis of AI-based conversational agents for promoting mental health and well-being",
      venue: "npj Digital Medicine, 6, 236",
      year: 2023,
      type: { id: "Tinjauan sistematis dan meta-analisis", en: "Systematic review and meta-analysis" },
      summary: {
        id: "Agen percakapan berbasis AI menurunkan gejala depresi dan tekanan psikologis. Efek pada kesejahteraan psikologis secara umum belum terlihat jelas.",
        en: "AI-based conversational agents reduced symptoms of depression and psychological distress. Effects on overall psychological well-being were not clear."
      },
      url: "https://doi.org/10.1038/s41746-023-00979-5"
    },
    {
      authors: "He Y, Yang L, Qian C, et al.",
      title: "Conversational Agent Interventions for Mental Health Problems: Systematic Review and Meta-analysis of Randomized Controlled Trials",
      venue: "Journal of Medical Internet Research, 25, e43862",
      year: 2023,
      type: { id: "Meta-analisis uji acak terkontrol", en: "Meta-analysis of randomised controlled trials" },
      summary: {
        id: "Meta-analisis uji acak terkontrol tentang intervensi agen percakapan untuk masalah kesehatan mental. Menemukan perbaikan gejala jangka pendek, dengan catatan perlunya studi jangka panjang.",
        en: "A meta-analysis of randomised trials of conversational agent interventions for mental health problems. Found short-term symptom improvements, and calls for longer-term studies."
      },
      url: "https://doi.org/10.2196/43862"
    },
    {
      authors: "Heinz MV, Mackin DM, Trudeau BM, et al.",
      title: "Randomized Trial of a Generative AI Chatbot for Mental Health Treatment",
      venue: "NEJM AI, 2(4)",
      year: 2025,
      type: { id: "Uji acak terkontrol", en: "Randomised controlled trial" },
      summary: {
        id: "Uji acak pertama untuk chatbot AI generatif dalam terapi. Orang dewasa dengan depresi, kecemasan, atau risiko gangguan makan yang memakai chatbot selama empat minggu menunjukkan penurunan gejala dibanding kelompok tunggu.",
        en: "The first randomised trial of a generative AI chatbot for treatment. Adults with depression, anxiety, or eating-disorder risk who used the chatbot for four weeks showed reduced symptoms compared with a waitlist group."
      },
      url: "https://doi.org/10.1056/AIoa2400802"
    }
  ]
};
