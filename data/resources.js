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
                       "gdoc"    -> Google Docs document
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
  { id: "academic",       label: "Academic",       icon: "🎓", desc: "Onboarding, SmartApp, teaching standards and the teacher code of conduct" },
  { id: "marketing",      label: "Marketing",      icon: "📈", desc: "Sales guide and customer consultation tools" },
  { id: "administration", label: "Administration", icon: "🗂️", desc: "Payroll, attendance and tracking" },
];

/* Groups inside a category. Order here = display order. */
const TOPICS = [
  { id: "onboarding", category: "academic",       label: "Onboarding" },
  { id: "smartapp",   category: "academic",       label: "SmartApp" },
  { id: "teaching",   category: "academic",       label: "Teaching Standards" },
  { id: "observation", category: "academic",      label: "Observation Training" },
  { id: "product",    category: "academic",       label: "Product Knowledge" },
  { id: "meetings",   category: "academic",       label: "PTM / STM & Graduation" },
  { id: "compliance", category: "academic",       label: "Compliance & Code of Conduct" },
  { id: "sales",      category: "marketing",      label: "Sales & Consultation" },
  { id: "payroll",    category: "administration", label: "Payroll & Attendance" },
  { id: "scms",       category: "administration", label: "SCMS" },
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
    desc: "Onboarding guide for Master Teacher Coaches: structure, your role, OKR MTC, session types, teaching reference, class levels and duration, administration, support and a glossary.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1w1E6ecxu_o1dXM_pqrJg9fx9isw_zmejhFQhwigz4Kk/edit?usp=sharing",
    public: true,
    updated: "2026-10-27",
  },
  {
    id: "smartapp-teachers",
    category: "academic",
    topic: "smartapp",
    audience: ["teacher"],
    tags: ["smartapp", "app", "guide", "manual", "tablet", "scms", "tv"],
    title: "EA SmartApp for Teachers",
    desc: "The EA Interactive SmartApp manual book: tutorial decks, tablet rules, the pre-class SCMS session check, the TV app, the issue report format and useful links.",
    type: "pdf",
    src: "files/smartapp-teachers.pdf",
    updated: "2026-10-27",
  },
  {
    id: "smartapp-troubleshooting",
    category: "academic",
    topic: "smartapp",
    audience: ["teacher"],
    tags: ["smartapp", "troubleshooting", "tv", "qr code", "attendance", "apk", "error"],
    title: "EA SmartApp Troubleshooting",
    desc: "Fixes for common SmartApp problems: attendance not showing, QR code and login errors, TV app install and connection failures, remote errors and multiplayer launch.",
    type: "pdf",
    src: "files/smartapp-troubleshooting.pdf",
    updated: "2026-10-27",
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
    id: "teaching-flow",
    category: "academic",
    topic: "teaching",
    audience: ["teacher"],
    tags: ["teaching flow", "lesson", "class"],
    title: "Teaching Flow",
    desc: "EA Teaching Standardization: fun, student-centered, interactive lessons and the standard EA lesson flow (Greeting, Rules, Warmer, Presentation, Practice, Production, Consolidation).",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1pop52FHQTlYW4QUBks9iH2ADuuEKj0IJ/edit?usp=sharing&ouid=116359078300919657349&rtpof=true&sd=true",
    public: true,
    updated: "2026-10-27",
  },
  {
    id: "classroom-standard",
    category: "academic",
    topic: "teaching",
    audience: ["teacher"],
    tags: ["classroom", "standard"],
    title: "Classroom Standard",
    desc: "Classroom standards beyond the lesson flow: language policy (100% English), student vs teacher talking time, U-shaped seating and teacher practices.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1pwTMQDWtRospoS_r2CbVjYC9pYITWZ6Ijxkg5BXHGG0/edit?usp=sharing",
    public: true,
    updated: "2026-10-27",
  },
  {
    id: "whiteboard-management",
    category: "academic",
    topic: "teaching",
    audience: ["teacher"],
    tags: ["whiteboard", "board", "classroom"],
    title: "Whiteboard Management",
    desc: "Whiteboard Management 2.0: using visuals, teaching tools, colour coding, the mandatory board aspects and TV placement.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1XBmCrDiEZMZH9yE59mWq5fhgcSpkW54CGPA94DFrrco/edit?usp=sharing",
    public: true,
    updated: "2026-10-27",
  },
  {
    id: "teaching-materials",
    category: "academic",
    topic: "teaching",
    audience: ["teacher"],
    tags: ["teaching materials", "drive", "folder"],
    title: "Teaching Materials (Drive folder)",
    desc: "Shared Google Drive folder with the teaching materials.",
    type: "link",
    src: "https://drive.google.com/drive/folders/1jApKIDRqKs6KE4q5PMQR1E62FHm5ePMi",
    updated: "2026-10-27",
  },
  {
    id: "teacher-observation-training",
    category: "academic",
    topic: "observation",
    audience: ["teacher"],
    tags: ["observation", "training", "teacher"],
    title: "Teacher Observation Training",
    desc: "Training deck on teacher observation.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1GwbKAHqnNO4XPPgrBtNQ_L6pZ2YjsmqUErNgghHMwFY/edit?slide=id.p1#slide=id.p1",
    updated: "2026-10-27",
  },
  {
    id: "product-knowledge",
    category: "academic",
    topic: "product",
    audience: ["teacher"],
    tags: ["product knowledge", "program"],
    title: "Product Knowledge",
    desc: "Why English Academy: qualified native and local teachers, a tech-integrated classroom and a localised curriculum.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1einN-yjlzkKa4wCSeozxI1MCC4GrYGncXnKkPhNa4zU/edit?usp=sharing",
    public: true,
    updated: "2026-10-27",
  },
  {
    id: "sop-ptm-stm",
    category: "academic",
    topic: "meetings",
    audience: ["teacher"],
    tags: ["ptm", "stm", "parent", "student", "meeting", "sop", "feedback"],
    title: "SOP PTM/STM",
    desc: "How to run PTM/STM, the scheduled meetings between teacher and parents (PTM) or students (STM): share progress, celebrate achievements, discuss areas to improve and agree on an action plan.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/108fOmd-8WO9AkI1Hbk6Kdos5-1WaqGV5ZFfpgv0oYyE/edit?usp=sharing",
    public: true,
    updated: "2026-10-27",
  },
  {
    id: "ptm-stm-graduation-guideline",
    category: "academic",
    topic: "meetings",
    audience: ["teacher"],
    tags: ["ptm", "stm", "graduation", "feedback", "nps", "learning report", "exam prep"],
    title: "PTM/STM/Graduation Guideline",
    desc: "EAC Academic Update: the feedback cycle and NPS, the SOPs for PTM/STM and Graduation, and the learning report.",
    type: "gslides",
    src: "https://docs.google.com/presentation/d/1iemKRbrXeqzK9m75DykJOUjx3dOMynthOOYljN6OoM0/edit?usp=sharing",
    public: true,
    updated: "2026-10-27",
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
    tags: ["payroll", "attendance", "manual attendance", "salary"],
    title: "MT Mitra Payroll: Manual Attendance",
    desc: "How MT Mitra record manual attendance for payroll.",
    type: "gdoc",
    src: "https://docs.google.com/document/d/1nvyYqOiAOo4_GxMvRPhIUlw6iu2GAnXgajj_Up4G590/edit?usp=sharing",
    updated: "2026-10-27",
  },
  {
    id: "scms-tutorial",
    category: "administration",
    topic: "scms",
    audience: ["mt", "mtc"],
    tags: ["scms", "tutorial", "super cms"],
    title: "SCMS Tutorial",
    desc: "A step-by-step tutorial for using SCMS.",
    type: "gslides",
    src: "", // <-- PASTE the SCMS tutorial link here once it has been made
    updated: "",
    placeholder: "The SCMS tutorial hasn't been made yet.",
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
