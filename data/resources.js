/* =========================================================================
   TRAINING HUB DATA CENTER
   -------------------------------------------------------------------------
   THIS IS THE ONLY FILE you need to edit when a material is added or updated.
   You never need to touch the design files (HTML/CSS).

   How to add / change a material:
   1. Copy one { ... } block below, paste it, and change its contents.
   2. Fields for each material:
        id        -> unique name without spaces, e.g. "smartapp-teachers"
        category  -> "marketing" | "academic" | "administration"
        topic     -> group inside the category (see TOPICS below)
        audience  -> who needs this material, one or more of:
                     ["teacher", "mt", "mtc", "staff"]
        tags      -> extra keywords so it is easy to find, e.g. ["payroll", "attendance"]
        title     -> material title
        desc      -> short description (1-2 sentences)
        type      -> how the material is shown:
                       "gslides" -> Google Slides presentation (shown on the site)
                       "gdrive"  -> file on Google Drive (PDF, etc.)
                       "pdf"     -> PDF placed in the files/ folder
                       "ppt"     -> PowerPoint placed in the files/ folder
                       "link"    -> plain link to another website
                       "page"    -> a dedicated page on this site
        src       -> for gslides/gdrive/link: the URL
                     for pdf/ppt: the file name, e.g. "files/payroll-mt.pdf"
                     for page: the page name, e.g. "diagnostic"
                     (leave empty if the file is not ready -> shows "Coming soon")
        updated   -> date of the last change, format YYYY-MM-DD (used by the
                     "Recently updated" list)
        public    -> (optional, gslides/gdrive only) set true ONLY when the Google
                     file is shared as "Anyone with the link can view". With true the
                     slides open directly on the site. Without it, users first see
                     an "Open in Google / Download PDF" panel, so no flickering
                     error screen appears.

   Already have the PDF (e.g. after requesting access and downloading it)? Put it
   in the files/ folder, then set type to "pdf" and src to "files/name.pdf".
   A local PDF always opens directly on the site, no Google access needed.

   To add a new GROUP: add one line to TOPICS.
   To add a new CATEGORY: add one line to CATEGORIES (the badge colour for a
   new category is set in assets/style.css).
   ========================================================================= */

const CATEGORIES = [
  { id: "academic",       label: "Academic",       icon: "🎓", desc: "Onboarding, SmartApp and the teacher code of conduct" },
  { id: "marketing",      label: "Marketing",      icon: "📈", desc: "Sales guide and customer consultation tools" },
  { id: "administration", label: "Administration", icon: "🗂️", desc: "Payroll, attendance and tracking" },
];

/* Groups inside a category. Order here = display order. */
const TOPICS = [
  { id: "onboarding", category: "academic",       label: "Onboarding" },
  { id: "smartapp",   category: "academic",       label: "SmartApp" },
  { id: "compliance", category: "academic",       label: "Compliance & Code of Conduct" },
  { id: "sales",      category: "marketing",      label: "Sales & Consultation" },
  { id: "payroll",    category: "administration", label: "Payroll & Attendance" },
  { id: "tracking",   category: "administration", label: "Tracking & Productivity" },
];

/* Who the material is for. */
const AUDIENCES = [
  { id: "teacher", label: "Teacher" },
  { id: "mt",      label: "MT Mitra" },
  { id: "mtc",     label: "MT Coach" },
  { id: "staff",   label: "Staff" },
];

const RESOURCES = [

  /* ---------------- MARKETING ---------------- */
  {
    id: "sales-guide",
    category: "marketing",
    topic: "sales",
    audience: ["staff"],
    tags: ["consultation", "customer", "walk-in", "ask listen dig deeper"],
    title: "Sales Guides and Tools",
    desc: "A guide to uncovering customer needs (ASK → LISTEN → DIG DEEPER): an 8-point consultation flow for Walk-In / Phone / Chat, plus Sales Tools. All content is built into this site.",
    type: "page",
    src: "sales-guide",
    updated: "2026-09-17",
  },
  {
    id: "diagnostic-sheet",
    category: "marketing",
    topic: "sales",
    audience: ["staff"],
    tags: ["worksheet", "print", "my english success journey"],
    title: "Diagnostic Sheet (fill in & print)",
    desc: "The 'My English Success Journey' worksheet as a web version. Fill it in on screen and print it.",
    type: "page",
    src: "diagnostic",
    updated: "2026-09-17",
  },

  /* ---------------- ACADEMIC ---------------- */
  {
    id: "onboarding-mt",
    category: "academic",
    topic: "onboarding",
    audience: ["mt"],
    tags: ["master teacher", "onboarding"],
    title: "MT Mitra Onboarding",
    desc: "Onboarding material for MT Mitra. (The payroll and SCMS part has moved to the Administration menu.)",
    type: "gslides",
    src: "", // <-- PASTE the Google Slides link for MT Mitra here, or upload a PDF to files/
    updated: "",
    placeholder: "Waiting for the file from head office. Please send the slides/PDF for MT Mitra.",
  },
  {
    id: "onboarding-mtc",
    category: "academic",
    topic: "onboarding",
    audience: ["mtc"],
    tags: ["coach", "onboarding"],
    title: "MT Coach Onboarding",
    desc: "Onboarding material for MT Coaches.",
    type: "gslides",
    src: "", // <-- PASTE the Google Slides link for MT Coaches here, or upload a PDF
    updated: "",
    placeholder: "Waiting for the file from head office. Please send the slides/PDF for MT Coaches.",
  },
  {
    id: "smartapp-teachers",
    category: "academic",
    topic: "smartapp",
    audience: ["teacher"],
    tags: ["smartapp", "app", "guide"],
    title: "How to use SmartApp for Teachers",
    desc: "A guide to using SmartApp for teachers.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1zbK6JVv0bzix7nVML-a1TVtWFfIIvenPpxuZvu-lIB8/edit?usp=sharing",
    updated: "2026-09-17",
  },
  {
    id: "smartapp-staff",
    category: "academic",
    topic: "smartapp",
    audience: ["staff"],
    tags: ["smartapp", "app", "guide"],
    title: "How to use SmartApp for Staff",
    desc: "A guide to using SmartApp for staff.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1ZHqN9Yo-dlN3gJ29FkcwqOdM1me2hLQO/edit",
    updated: "2026-09-17",
  },
  {
    id: "code-of-conduct",
    category: "academic",
    topic: "compliance",
    audience: ["teacher", "mt", "mtc"],
    tags: ["compliance", "ethics", "rules"],
    title: "Teacher Code of Conduct",
    desc: "Compliance and code of conduct slides for teachers.",
    type: "link",
    src: "https://tinyurl.com/slidecompliancetraining",
    updated: "2026-09-17",
  },

  /* ---------------- ADMINISTRATION ---------------- */
  {
    id: "payroll-mt",
    category: "administration",
    topic: "payroll",
    audience: ["mt"],
    tags: ["payroll", "attendance", "scms", "salary"],
    title: "MT Mitra Payroll — Manual Attendance & SCMS",
    desc: "The manual attendance record and SCMS section (taken from the MT Mitra Onboarding material).",
    type: "gslides",
    src: "", // <-- PASTE the link to the attendance & SCMS slides here, or upload a PDF
    updated: "",
    placeholder: "Waiting for the file from head office. Please send the Manual Attendance & SCMS section.",
  },
  {
    id: "mtc-tracker",
    category: "administration",
    topic: "tracking",
    audience: ["mtc"],
    tags: ["productivity", "tracker"],
    title: "MTC Productivity Tracker",
    desc: "A guide to the MTC Productivity Tracker (taken from the MT Mitra Onboarding material).",
    type: "gslides",
    src: "", // <-- PASTE the link to the MTC Productivity Tracker slides here, or upload a PDF
    updated: "",
    placeholder: "Waiting for the file from head office. Please send the MTC Productivity Tracker section.",
  },

];
