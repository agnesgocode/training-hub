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
];
