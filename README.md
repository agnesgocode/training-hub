# Training Hub

A static training website (HTML/CSS/JS) — no server, ready to host on **GitHub Pages**.

## Structure
- `index.html` — dashboard: category cards, filters (audience / topic / format), search, Card or List view, and "Recently updated".
- `viewer.html` — displays slides/PDFs inside the web page.
- `diagnostic.html` — a Diagnostic Sheet you can fill in and print.
- `resources.html` — the **Manage Resources** page (status of each material + update guide).
- `data/resources.js` — the **DATA HUB**. This is the only file you need to change when there's new material / an update.
- `files/` — where you put the PDF / PPT files.
- `assets/shell.js` — shared sidebar + the **Academic Assistant** (chat). The AI server settings are at the top of this file (`ASSISTANT_ENDPOINT`).
- `assets/` — other styles & logic (no need to touch).

## How to update material (no coding)
Open `data/resources.js`, find the material, then:
- **Link / Google Slides / Drive** → paste the URL into `src`. In Google, set: *Anyone with the link can view*.
- **PDF/PPT file** → put the file in `files/`, fill in `src` (e.g. `files/payroll-mt.pdf`) and `type` (`"pdf"` / `"ppt"`).
- Fill in `topic` (group), `audience` (who needs it), `tags` (keywords), and `updated` (format `YYYY-MM-DD`).
- New group: add one line to `TOPICS` in the same file.

## How to host on GitHub Pages
1. Create a new repository on GitHub and upload everything in this folder.
2. Open **Settings → Pages**.
3. Under *Source*: choose branch `main`, folder `/ (root)`, then **Save**.
4. Wait 1–2 minutes and GitHub gives you a public URL (e.g. `https://yourname.github.io/training-hub/`).


## Learner dashboard, quizzes and resource links

- **Who it is for:** MT Mitra and MT Coach. On first visit a learner enters a name and role; the dashboard then shows the materials, quizzes and goals meant for that role.
- **Quizzes:** written in `data/quizzes.js` (`questions: []` = "Coming soon"). Passing a quiz marks its material as learned. A sample quiz built from the Sales Guide is included to try the flow.
- **Resources menu:** links come from `data/links.js`, an optional shared Google Sheet (`LINKS_SHEET`, template in `data/links-sheet-template.csv`) and the "Add link" button (this device only).
- **Where progress is stored:** in each learner's browser (`localStorage`). No server is needed, but a different device starts empty and the academic team cannot see progress yet. All access goes through `Store` in `assets/app.js`, so it can later be swapped for Supabase.
- **AI assistant:** paused. `FEATURES.assistant` in `assets/app.js` is `false`; the code is kept in `assets/assistant.js`.
- **Admin page (`admin.html`):** tracks every material (status, category, topic, audience, source, quiz, flags), every resource link, and the categories/topics with counts, plus CSV downloads and generators for the snippets to paste into `data/resources.js`. Open `admin.html` once and the Admin item appears in the sidebar of that browser. This only hides the menu item; it is not security (the page lists nothing that isn't already public).
