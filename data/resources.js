/* =========================================================================
   PUSAT DATA TRAINING HUB
   -------------------------------------------------------------------------
   HANYA FILE INI yang perlu Anda ubah kalau ada materi baru / update.
   Anda TIDAK perlu menyentuh file desain (HTML/CSS) lainnya.

   Cara menamb/mengubah materi:
   1. Salin satu blok { ... } di bawah, tempel, lalu ubah isinya.
   2. Field "type" menentukan bagaimana materi ditampilkan:
        "gslides"  -> presentasi Google Slides (di-embed / bisa dibuka)
        "gdrive"   -> file di Google Drive (PDF, dsb.)
        "pdf"      -> file PDF yang Anda taruh di folder files/
        "ppt"      -> file PowerPoint yang Anda taruh di folder files/
        "link"     -> link biasa ke website lain
        "page"     -> halaman khusus di web ini (mis. Diagnostic Sheet form)
   3. "src" diisi:
        - untuk gslides/gdrive/link -> URL-nya
        - untuk pdf/ppt              -> nama file, contoh "files/payroll-mt.pdf"
        - untuk page                 -> nama halaman internal, contoh "diagnostic"
   4. "updated" = tanggal terakhir diubah (untuk info di web). Format bebas.

   CATATAN: agar Google Slides/Drive bisa tampil, di Google-nya set
   "Anyone with the link can view".
   ========================================================================= */

const CATEGORIES = [
  { id: "marketing",      label: "Marketing",      icon: "📈" },
  { id: "akademik",       label: "Akademik",       icon: "🎓" },
  { id: "administration", label: "Administration", icon: "🗂️" },
];

const RESOURCES = [

  /* ---------------- MARKETING ---------------- */
  {
    id: "sales-guide",
    category: "marketing",
    title: "Sales Guides and Tools",
    desc: "Panduan menggali kebutuhan customer (ASK → LISTEN → DIG DEEPER): 8 point consultation flow untuk Walk-In / Phone / Chat, plus Sales Tools. Seluruh isi terintegrasi di web ini.",
    type: "page",
    src: "sales-guide",
    updated: "2026-09-17",
  },
  {
    id: "diagnostic-sheet",
    category: "marketing",
    title: "Diagnostic Sheet (isi & print)",
    desc: "Worksheet 'My English Success Journey' versi web — bisa diisi langsung dan dicetak.",
    type: "page",
    src: "diagnostic",
    updated: "2026-09-17",
  },

  /* ---------------- AKADEMIK ---------------- */
  {
    id: "onboarding-mt",
    category: "akademik",
    title: "Onboarding MT (Master Teacher)",
    desc: "Materi onboarding khusus untuk MT. (Bagian administrasi payroll & SCMS dipindah ke menu Administration.)",
    type: "gslides",
    src: "", // <-- TEMPEL link Google Slides khusus MT di sini, atau upload PDF ke files/
    updated: "",
    placeholder: "Menunggu file dari pusat. Kirimkan slide/PDF untuk MT.",
  },
  {
    id: "onboarding-mtc",
    category: "akademik",
    title: "Onboarding MT Coach",
    desc: "Materi onboarding khusus untuk MT Coach.",
    type: "gslides",
    src: "", // <-- TEMPEL link Google Slides khusus MT Coach di sini, atau upload PDF
    updated: "",
    placeholder: "Menunggu file dari pusat. Kirimkan slide/PDF untuk MT Coach.",
  },
  {
    id: "smartapp-teachers",
    category: "akademik",
    title: "How to use SmartApp for Teachers",
    desc: "Panduan penggunaan SmartApp untuk pengajar.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1zbK6JVv0bzix7nVML-a1TVtWFfIIvenPpxuZvu-lIB8/edit?usp=sharing",
    updated: "2026-09-17",
  },
  {
    id: "smartapp-staff",
    category: "akademik",
    title: "How to use SmartApp for Staff",
    desc: "Panduan penggunaan SmartApp untuk staff.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1ZHqN9Yo-dlN3gJ29FkcwqOdM1me2hLQO/edit",
    updated: "2026-09-17",
  },
  {
    id: "kode-etik",
    category: "akademik",
    title: "Kode Etik Pengajar",
    desc: "Slide compliance & kode etik untuk pengajar.",
    type: "link",
    src: "https://tinyurl.com/slidecompliancetraining",
    updated: "2026-09-17",
  },

  /* ---------------- ADMINISTRATION ---------------- */
  {
    id: "payroll-mt",
    category: "administration",
    title: "Payroll MT — Manual Attendance & SCMS",
    desc: "Bagian manual attendance record dan SCMS (diambil dari materi Onboarding MT).",
    type: "gslides",
    src: "", // <-- TEMPEL link slide bagian attendance & SCMS, atau upload PDF
    updated: "",
    placeholder: "Menunggu file dari pusat. Kirimkan bagian Manual Attendance & SCMS.",
  },
  {
    id: "mtc-tracker",
    category: "administration",
    title: "MTC Productivity Tracker",
    desc: "Panduan MTC Productivity Tracker (diambil dari materi Onboarding MT).",
    type: "gslides",
    src: "", // <-- TEMPEL link slide bagian MTC Productivity Tracker, atau upload PDF
    updated: "",
    placeholder: "Menunggu file dari pusat. Kirimkan bagian MTC Productivity Tracker.",
  },

];
