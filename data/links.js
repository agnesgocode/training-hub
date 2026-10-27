/* =========================================================================
   RESOURCE LINKS (the "Resources" menu)
   -------------------------------------------------------------------------
   Links come from three places and are merged on the Resources page:

   1. LINKS below            -> built-in links, shared with everyone.
   2. The shared Google Sheet -> anyone with edit access to the sheet adds a
                                 row and the link appears for EVERYONE, no
                                 server needed. Set LINKS_SHEET below.
   3. "Add link" button       -> saved only in the browser of the person who
                                 added it (marked "This device").

   SET UP THE SHARED SHEET (one time, ~2 minutes):
     a. In Google Sheets create a sheet and import data/links-sheet-template.csv
        (File → Import → Upload). Keep the header row exactly as it is.
     b. Share → General access → "Anyone with the link: Viewer".
     c. Copy the sheet ID from its URL (the long text between /d/ and /edit)
        and the gid number at the end of the URL (#gid=...), and paste them below.
     d. Add a row for every link. Columns are matched by their HEADER NAME,
        so you may re-order or insert columns later without breaking anything.

   Sheet columns:  Title | URL | Category | Description | Audience | Added by
     Category    free text (e.g. "Training decks", "Tools", "Forms") — becomes a tab
     Audience    optional: mt, mtc, teacher, staff (comma separated). Empty = everyone
   ========================================================================= */

const LINKS_SHEET = {
  id:  "",   // <-- paste the Google Sheet ID here
  gid: "0",  // <-- paste the gid of the tab here
};

const LINKS = [
  {
    title: "SCMS (Super CMS)",
    url: "https://super-cms.ruangguru.com/englishacademy",
    category: "Tools",
    desc: "English Academy on Super CMS.",
    audience: [],
  },
  {
    title: "CEFR Guide",
    url: "https://cefr-eac-banten.netlify.app/",
    category: "Tools",
    desc: "Helps explain current level, starting point, learning journey and target level.",
    audience: [],
  },
  {
    title: "Teacher Code of Conduct slides",
    url: "https://tinyurl.com/slidecompliancetraining",
    category: "Training decks",
    desc: "Compliance and code of conduct slides for teachers.",
    audience: ["teacher", "mt", "mtc"],
  },

  /* ---- SmartApp: links taken from the EA SmartApp manual book and the troubleshooting deck ---- */
  { title: "Tutorial EA Interactive SmartApp", url: "https://tinyurl.com/Tutorial-EA-Smart-App", category: "SmartApp",
    desc: "Deck: how to use the EA Interactive SmartApp.", audience: ["teacher"] },
  { title: "Technical & Pedagogical Feature Training to Teacher", url: "https://tinyurl.com/Pedagogical-Feature-Training", category: "SmartApp",
    desc: "Deck: the technical and pedagogical features of SmartApp.", audience: ["teacher"] },
  { title: "SCMS Login: how to choose the book on SCMS", url: "https://tinyurl.com/Book-Choosing-on-SCMS", category: "SmartApp",
    desc: "Deck: logging in to SCMS and choosing the book.", audience: ["teacher"] },
  { title: "EA App Variant (SmartApp activity types)", url: "https://tinyurl.com/EA-App-Variant", category: "SmartApp",
    desc: "Deck: the types of SmartApp activity.", audience: ["teacher"] },
  { title: "Tutorial for teachers (video, step by step)", url: "https://tinyurl.com/Tutorial-for-teachers", category: "SmartApp",
    desc: "Step-by-step video tutorial for teachers.", audience: ["teacher"] },
  { title: "Video: Technical & Pedagogical Feature Training to Teacher", url: "https://tinyurl.com/Pedagogical-Feature-Video", category: "SmartApp",
    desc: "Recording of the feature training.", audience: ["teacher"] },
  { title: "Video: TFT EA Interactive with TV and Tabs (11 Sep 2025)", url: "https://drive.google.com/file/d/1DaDevXAgoarwfWfYyFkT9hZeP1gsQ_5D/view?usp=sharing", category: "SmartApp",
    desc: "Recording of the TFT session on EA Interactive with TV and tablets.", audience: ["teacher"] },
  { title: "Video: SmartApp tablet set-up (Redmi Pad SE 8.7)", url: "https://drive.google.com/file/d/1acuWsmmJDOJDdrbN6b-dKjHg2PPpj7I4/view?usp=sharing", category: "SmartApp",
    desc: "How to set up the Redmi Pad SE 8.7 tablet for SmartApp.", audience: ["teacher"] },
  { title: "Video: Remote error / Permission Denied fix", url: "https://docs.google.com/file/d/1vxizA-QPjbMJvsRDslSKli0ghZVDgNZ9/preview", category: "SmartApp",
    desc: "Step-by-step video from the troubleshooting deck.", audience: ["teacher"] },
  { title: "Book & EA SmartApp material error report", url: "https://tinyurl.com/Book-SmartApp-Report", category: "SmartApp",
    desc: "Report an error in a book or SmartApp material.", audience: ["teacher"] },
  { title: "EA study site (SLMS login)", url: "https://study.english-academy.id/", category: "Tools",
    desc: "The site students and EAC tablets log in to for SmartApp sessions.", audience: ["teacher"] },
];
