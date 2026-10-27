/* App logic — builds the pages from data/resources.js.
   You do not need to change this file when adding materials. */

const TYPE_LABEL = {
  gslides: "Google Slides",
  gdoc:    "Google Docs",
  gdrive:  "Google Drive",
  pdf:     "PDF",
  ppt:     "PowerPoint",
  link:    "Link",
  page:    "Web Page",
};

/* ---------- Icons (inline SVG, inherit the text colour) ---------- */
const ICONS = {
  home:           '<path d="M3 11.5 12 4l9 7.5"/><path d="M5 10v9a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1v-9"/>',
  academic:       '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5"/>',
  marketing:      '<path d="M3 11v2a1 1 0 0 0 1 1h2l5 4V6L6 10H4a1 1 0 0 0-1 1z"/><path d="M15 9a4 4 0 0 1 0 6"/><path d="M18 6.5a8 8 0 0 1 0 11"/>',
  administration: '<path d="M3 7a2 2 0 0 1 2-2h4l2 2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>',
  assistant:      '<path d="M12 3l1.8 4.7L18.5 9.5l-4.7 1.8L12 16l-1.8-4.7L5.5 9.5l4.7-1.8z"/><path d="M19 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8z"/>',
  diagnostic:     '<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4h6v3H9z"/><path d="M8.5 12h7M8.5 16h5"/>',
  settings:       '<path d="M4 6h10M18 6h2M4 12h4M12 12h8M4 18h12M20 18h0"/><circle cx="16" cy="6" r="2"/><circle cx="10" cy="12" r="2"/><circle cx="18" cy="18" r="2"/>',
  chevron:        '<path d="M9 6l6 6-6 6"/>',
  calendar:       '<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/>',
  search:         '<circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/>',
  slides:         '<rect x="3" y="4" width="18" height="12" rx="2"/><path d="M8 20h8M12 16v4"/>',
  file:           '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5M9 13h6M9 17h4"/>',
  link:           '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
  page:           '<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>',
  check:          '<path d="M5 12l5 5 9-10"/>',
  clock:          '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  layers:         '<path d="M12 3l9 5-9 5-9-5z"/><path d="M3 13l9 5 9-5"/>',
  lock:           '<rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  learning:       '<path d="M2 5.5C4.5 4 8 4 12 6c4-2 7.5-2 10-.5V19c-2.5-1.5-6-1.5-10 .5-4-2-7.5-2-10-.5z"/><path d="M12 6v13.5"/>',
  quiz:           '<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8.5 9.5l1.5 1.5 3-3"/><path d="M8.5 16h7"/>',
  results:        '<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
  plus:           '<path d="M12 5v14M5 12h14"/>',
  trash:          '<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>',
  trophy:         '<path d="M8 4h8v5a4 4 0 0 1-8 0z"/><path d="M8 6H4v1a3 3 0 0 0 4 2.8M16 6h4v1a3 3 0 0 1-4 2.8M12 13v4M8 20h8M10 17h4"/>',
  target:         '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1.2"/>',
  user:           '<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 3.5-7 8-7s8 3 8 7"/>',
  pencil:         '<path d="M4 20l1-4L16.5 4.5a2 2 0 0 1 3 3L8 19z"/><path d="M14 7l3 3"/>',
  copy:           '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a2 2 0 0 1 2-2h8"/>',
  external:       '<path d="M14 4h6v6M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  play:           '<path d="M8 5l11 7-11 7z"/>',
};
function svg(name, size) {
  const s = size || 20;
  return `<svg class="svg" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[name] || ""}</svg>`;
}
const TYPE_ICON = { gslides: "slides", gdoc: "file", gdrive: "file", pdf: "file", ppt: "slides", link: "link", page: "page" };

/* Switch features on/off. The AI assistant is paused for now: set it to true
   (and load assets/assistant.js on the pages) to bring it back. */
const FEATURES = { assistant: false };

/* ---------- Roles (the people who use this hub) ---------- */
const ROLES = [
  { id: "mt",  label: "MT Mitra" },
  { id: "mtc", label: "MT Coach" },
];
const roleLabel = id => (ROLES.find(r => r.id === id) || {}).label || "";

/* ---------- Learner data ----------
   Everything a learner does (profile, learned materials, quiz attempts, goals,
   personal links) is saved in THIS browser only. That works without a server,
   but it means: a different device or browser starts empty, clearing browser
   data erases it, and the academic team cannot see anyone's progress yet.
   All access goes through this object, so it can later be swapped for Supabase
   without touching the pages. */
const Store = (() => {
  const KEY = "hub.v1";
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };
  const mut = fn => { const d = load(); fn(d); save(d); };
  const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  return {
    profile: () => load().profile || null,
    setProfile: p => mut(d => { d.profile = { ...(d.profile || {}), ...p }; }),
    status: id => { const d = load(); return (d.learned || {})[id] ? "learned" : ((d.started || {})[id] ? "started" : "new"); },
    learnedAt: id => (load().learned || {})[id] || "",
    setLearned: (id, on) => mut(d => {
      d.learned = d.learned || {};
      if (on) d.learned[id] = new Date().toISOString(); else delete d.learned[id];
    }),
    markStarted: id => mut(d => { d.started = d.started || {}; if (!d.started[id]) d.started[id] = new Date().toISOString(); }),
    attempts: () => load().attempts || [],
    attempt: id => (load().attempts || []).find(a => a.id === id),
    addAttempt: a => { const at = { id: uid(), at: new Date().toISOString(), ...a }; mut(d => { (d.attempts = d.attempts || []).push(at); }); return at; },
    goals: () => load().goals || [],
    addGoal: (text, due) => mut(d => { (d.goals = d.goals || []).push({ id: uid(), text, due: due || "", done: false }); }),
    toggleGoal: id => mut(d => { const g = (d.goals || []).find(x => x.id === id); if (g) g.done = !g.done; }),
    removeGoal: id => mut(d => { d.goals = (d.goals || []).filter(x => x.id !== id); }),
    links: () => load().links || [],
    addLink: l => mut(d => { (d.links = d.links || []).push({ id: uid(), ...l }); }),
    removeLink: id => mut(d => { d.links = (d.links || []).filter(x => x.id !== id); }),
    cache: (k, v) => v === undefined ? (load().cache || {})[k] : mut(d => { (d.cache = d.cache || {})[k] = v; }),
    reset: () => { try { localStorage.removeItem(KEY); } catch (e) {} },
  };
})();

/* Materials a role is expected to learn: made for them, or for every teacher. */
function requiredFor(role) {
  return RESOURCES.filter(r => (r.audience || []).some(a => a === role || a === "teacher"));
}
/* Quizzes assigned to a role. */
function quizzesFor(role) {
  return (typeof QUIZZES === "undefined" ? [] : QUIZZES).filter(q => (q.audience || []).some(a => a === role || a === "teacher"));
}
const quizReady = q => !!(q.questions && q.questions.length);
function bestAttempt(quizId) {
  return Store.attempts().filter(a => a.quizId === quizId).sort((a, b) => b.score - a.score)[0] || null;
}

/* Remember that a material was opened. */
document.addEventListener("click", e => {
  const a = e.target.closest("[data-mid]");
  if (a) Store.markStarted(a.dataset.mid);
});

/* Keep data text from breaking the markup */
function esc(s) {
  return String(s || "").replace(/[&<>"']/g, c => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]
  ));
}

/* Turn a normal Google Slides/Drive URL into one that can be embedded */
function toEmbedUrl(type, src) {
  if (!src) return "";
  if (type === "gslides") {
    const m = src.match(/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://docs.google.com/presentation/d/${m[1]}/embed?start=false&loop=false`;
  }
  if (type === "gdoc") {
    const m = src.match(/document\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://docs.google.com/document/d/${m[1]}/preview`;
  }
  if (type === "gdrive") {
    const m = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  }
  return src; // local pdf / ppt, or fallback
}

function hasContent(r) {
  return r.type === "page" || !!(r.src && r.src.trim());
}

/* ---------- Data helpers ---------- */
const catOf   = id => (typeof CATEGORIES !== "undefined" ? CATEGORIES : []).find(c => c.id === id);
const topicOf = id => (typeof TOPICS !== "undefined" ? TOPICS : []).find(t => t.id === id);
const audOf   = id => (typeof AUDIENCES !== "undefined" ? AUDIENCES : []).find(a => a.id === id);

function dataReady() {
  return typeof RESOURCES !== "undefined" && Array.isArray(RESOURCES) && typeof CATEGORIES !== "undefined";
}

/* Main button link & label of a material */
function actionFor(r) {
  if (r.type === "page")  return { href: `${r.src}.html`, label: "Open material" };
  if (r.type === "link")  return { href: r.src, label: "Open source", ext: true };
  if (r.type === "ppt")   return { href: r.src, label: "Download PowerPoint", download: true };
  return { href: `viewer.html?id=${encodeURIComponent(r.id)}`, label: "Open material" };
}

const fmtDate = (iso, opts) => {
  const d = new Date(iso + "T00:00:00");
  return isNaN(d) ? iso : d.toLocaleDateString("en-US", opts || { day: "numeric", month: "short", year: "numeric" });
};

/* ---------- Search ---------- */
function haystack(r) {
  const parts = [r.title, r.desc, (r.tags || []).join(" ")];
  const c = catOf(r.category), t = topicOf(r.topic);
  if (c) parts.push(c.label);
  if (t) parts.push(t.label);
  (r.audience || []).forEach(a => { const o = audOf(a); if (o) parts.push(o.label); });
  return parts.join(" ").toLowerCase();
}

function tokenize(s) {
  return String(s || "").toLowerCase().split(/[^a-z0-9]+/).filter(w => w.length >= 2);
}

const STOPWORDS = new Set((
  "the a an is are was were be been am do does did can could should would will shall may might " +
  "what which who whom whose when where why how to of in on at for from by with about into over " +
  "and or but if then so than too very just also not no yes it its this that these those there here " +
  "i me my we us our you your he she they them their please tell show give explain need want know " +
  "any some more most much many etc get got make made"
).split(" "));

/* ---------- Page state (kept in the URL so it can be shared) ----------
   Every menu is its own page:
     - Home        (cat=all)          -> overview, no long list
     - Category    (cat=academic ...) -> topic tabs, only the chosen topic
     - Search      (q=...)            -> results from every category
*/
const VIEWS = ["dashboard", "learning", "quizzes", "results", "resources"];
const HOME_DEFAULT = { q: "", view: "dashboard", cat: "all", topic: "all", aud: "all", type: "all", ready: false, sort: "new" };
let homeState = { ...HOME_DEFAULT };
let homeView = (() => { try { return localStorage.getItem("hub.view") || "grid"; } catch (e) { return "grid"; } })();

const topicsOf = cat => (typeof TOPICS !== "undefined" ? TOPICS : []).filter(t => t.category === cat);
function firstTopic(cat) { const t = topicsOf(cat)[0]; return t ? t.id : "all"; }

/* Make sure the category/topic combination is valid. */
function normalizeState(s) {
  if (!VIEWS.includes(s.view)) s.view = "dashboard";
  if (s.cat !== "all" && !catOf(s.cat)) s.cat = "all";
  if (s.cat === "all") s.topic = "all";
  else if (s.topic !== "all" && !topicsOf(s.cat).some(t => t.id === s.topic)) s.topic = firstTopic(s.cat);
  return s;
}

function readStateFromUrl() {
  const p = new URLSearchParams(location.search);
  const s = { ...HOME_DEFAULT };
  s.q     = p.get("q") || "";
  s.view  = p.get("view") || "dashboard";
  s.cat   = p.get("cat") || "all";
  s.aud   = p.get("aud") || "all";
  s.type  = p.get("type") || "all";
  s.ready = p.get("ready") === "1";
  s.sort  = p.get("sort") || "new";
  const h = location.hash.replace("#", "");   // e.g. index.html#academic
  if (h && catOf(h) && s.cat === "all") s.cat = h;
  s.topic = p.get("topic") || (s.cat !== "all" ? firstTopic(s.cat) : "all");
  return normalizeState(s);
}

function stateToQuery(s) {
  const p = new URLSearchParams();
  if (s.q) p.set("q", s.q);
  if (s.cat !== "all") { p.set("cat", s.cat); p.set("topic", s.topic); }
  else if (s.view !== "dashboard") p.set("view", s.view);
  if (s.aud !== "all") p.set("aud", s.aud);
  if (s.type !== "all") p.set("type", s.type);
  if (s.ready) p.set("ready", "1");
  if (s.sort !== "new") p.set("sort", s.sort);
  return p.toString();
}

/* Which page is showing: search, a category of the library, or one of the learner views */
const modeOf = s => (s.q.trim() ? "search" : (s.cat !== "all" ? "category" : s.view));
function hasExtraFilter(s) { return s.aud !== "all" || s.type !== "all" || s.ready; }

function applyFilters(s) {
  const toks = tokenize(s.q);
  const searching = modeOf(s) === "search";   // search always covers every category
  return RESOURCES.filter(r => {
    if (!searching) {
      if (s.cat   !== "all" && r.category !== s.cat) return false;
      if (s.topic !== "all" && r.topic !== s.topic) return false;
    }
    if (s.aud  !== "all" && !(r.audience || []).includes(s.aud)) return false;
    if (s.type !== "all" && r.type !== s.type) return false;
    if (s.ready && !hasContent(r)) return false;
    if (toks.length) { const h = haystack(r); if (!toks.every(t => h.includes(t))) return false; }
    return true;
  });
}

function sortItems(items, mode) {
  const arr = items.slice();
  arr.sort((a, b) => {
    const ra = hasContent(a), rb = hasContent(b);
    if (ra !== rb) return ra ? -1 : 1;                    // available ones first
    if (mode === "az") return a.title.localeCompare(b.title, "en");
    return (b.updated || "").localeCompare(a.updated || "") || a.title.localeCompare(b.title, "en");
  });
  return arr;
}

/* ---------- Components ---------- */
function audChips(r) {
  return (r.audience || []).map(a => {
    const o = audOf(a);
    return o ? `<span class="aud-chip">${esc(o.label)}</span>` : "";
  }).join("");
}

function cardHtml(r, showCat) {
  const ready = hasContent(r);
  const c = catOf(r.category);
  const catTag = showCat && c ? `<span class="badge ${esc(r.category)} mini">${esc(c.label)}</span>` : "";
  const typeTag = `<span class="type-tag">${esc(TYPE_LABEL[r.type] || r.type)}</span>`;
  const soon = ready ? "" : `<span class="soon-tag">Coming soon</span>`;
  const meta = r.updated ? `<span class="meta">Updated ${esc(fmtDate(r.updated))}</span>` : "";
  let actions = "";
  if (ready) {
    const a = actionFor(r);
    const extra = a.ext ? ' target="_blank" rel="noopener"' : (a.download ? " download" : "");
    actions += `<a class="btn primary" data-mid="${esc(r.id)}" href="${esc(a.href)}"${extra}>${esc(a.label)}</a>`;
    (Array.isArray(r.links) ? r.links : []).forEach(l => {
      actions += `<a class="btn ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`;
    });
  }
  const pendingNote = ready ? "" : `<p class="pending-note">${esc(r.placeholder || "Waiting for the file from head office.")}</p>`;
  return `
    <article class="card${ready ? "" : " is-soon"} ${esc(r.category)}">
      <div class="card-top"><span class="card-ic">${svg(TYPE_ICON[r.type] || "file", 18)}</span>${catTag}${typeTag}${soon}</div>
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.desc || "")}</p>
      ${pendingNote}
      <div class="card-foot">
        <div class="aud-row">${audChips(r)}</div>
        ${meta}
      </div>
      ${actions ? `<div class="actions">${actions}</div>` : ""}
    </article>`;
}

/* Empty / error state */
function stateHtml(kind, msg, extra) {
  const icon = kind === "error" ? "⚠️" : "🔍";
  return `<div class="state ${kind === "error" ? "error" : ""}">
            <div class="big">${icon}</div><div>${esc(msg)}</div>${extra || ""}
          </div>`;
}

/* Tools row: audience, format, sort, available only, view */
function toolsHtml(s) {
  const types = [...new Set(RESOURCES.map(r => r.type))];
  const opt = (v, label, cur) => `<option value="${esc(v)}"${cur === v ? " selected" : ""}>${esc(label)}</option>`;
  const reset = (hasExtraFilter(s) || s.sort !== "new")
    ? `<button type="button" class="btn ghost small" id="f-reset">Reset filters</button>` : "";
  return `<div class="tools">
    <select id="f-aud" aria-label="Audience">${opt("all", "All roles", s.aud)}${AUDIENCES.map(a => opt(a.id, a.label, s.aud)).join("")}</select>
    <select id="f-type" aria-label="Format">${opt("all", "All formats", s.type)}${types.map(t => opt(t, TYPE_LABEL[t] || t, s.type)).join("")}</select>
    <select id="f-sort" aria-label="Sort">${opt("new", "Newest first", s.sort)}${opt("az", "A → Z", s.sort)}</select>
    <label class="check"><input type="checkbox" id="f-ready"${s.ready ? " checked" : ""}> Available only</label>
    <span class="spacer"></span>
    ${reset}
    <div class="seg" role="group" aria-label="View">
      <button type="button" class="${homeView === "grid" ? "on" : ""}" data-view="grid" aria-pressed="${homeView === "grid"}">Cards</button>
      <button type="button" class="${homeView === "list" ? "on" : ""}" data-view="list" aria-pressed="${homeView === "list"}">List</button>
    </div>
  </div>`;
}

function itemsBodyHtml(items, showCat) {
  const s = homeState;
  if (!items.length) {
    const q = s.q.trim();
    return `<div class="view-body">` + stateHtml("empty",
      q ? `No materials match "${q}"${hasExtraFilter(s) ? " with the current filters" : ""}.`
        : (hasExtraFilter(s) ? "No materials match these filters." : "There are no materials in this section yet."),
      `<div class="state-actions">${hasExtraFilter(s) ? `<button type="button" class="btn ghost small" id="f-reset">Reset filters</button>` : ""}
       ${FEATURES.assistant ? `<button type="button" class="btn primary small" data-ask="${esc(q)}">Ask the Assistant</button>` : ""}</div>`) + `</div>`;
  }
  return `<div class="view-body"><div class="grid ${homeView === "list" ? "list" : ""}">
    ${sortItems(items, s.sort).map(r => cardHtml(r, showCat)).join("")}</div></div>`;
}

/* ===== Page: one category (a tab per topic) ===== */
function categoryHtml() {
  const s = homeState, c = catOf(s.cat);
  const inCat = RESOURCES.filter(r => r.category === s.cat);
  const ready = inCat.filter(hasContent).length;
  const topics = topicsOf(s.cat);
  const tab = (id, label, n) =>
    `<button type="button" class="tab${s.topic === id ? " on" : ""}" data-topic="${esc(id)}" role="tab" aria-selected="${s.topic === id}">
       ${esc(label)}<span class="tab-n">${n}</span></button>`;
  const tabs = `<div class="tabs" role="tablist" aria-label="${esc(c.label)} topics">
    ${topics.map(t => tab(t.id, t.label, inCat.filter(r => r.topic === t.id).length)).join("")}
    ${topics.length > 1 ? tab("all", "All", inCat.length) : ""}
  </div>`;
  return `
    <div class="page-head head-row">
      <span class="head-ic ${esc(c.id)}" aria-hidden="true">${svg(c.id, 26)}</span>
      <div class="head-txt"><h1>${esc(c.label)}</h1><p>${esc(c.desc || "")}</p></div>
      <span class="date-chip plain"><b>${inCat.length}</b> materials${ready < inCat.length ? ` · ${ready} available` : ""}</span>
    </div>
    ${tabs}
    ${toolsHtml(s)}
    ${itemsBodyHtml(applyFilters(s), false)}`;
}

/* ===== Page: search results (all categories) ===== */
function searchHtml() {
  const s = homeState, items = applyFilters(s);
  return `
    <div class="page-head head-row">
      <span class="head-ic" aria-hidden="true">${svg("search", 26)}</span>
      <div class="head-txt"><h1>Search results</h1><p>“${esc(s.q.trim())}” across all categories · ${items.length} of ${RESOURCES.length} materials</p></div>
      <button type="button" class="btn ghost small" id="f-clear">Close search</button>
    </div>
    ${toolsHtml(s)}
    ${itemsBodyHtml(items, true)}`;
}

/* Render the page that matches the active menu */
function renderHome() {
  const el = document.getElementById("home");
  if (!el) return;
  if (!dataReady()) {
    el.innerHTML = stateHtml("error", "The materials list failed to load. Check data/resources.js.");
    return;
  }
  const mode = modeOf(homeState);
  if (mode === "search") el.innerHTML = searchHtml();
  else if (mode === "category") el.innerHTML = categoryHtml();
  else if (window.Learner) { el.innerHTML = window.Learner.render(mode, homeState); window.Learner.after(mode, el); }
  else el.innerHTML = stateHtml("error", "The learner pages failed to load (assets/learner.js).");
  if (typeof window.renderSidebar === "function") window.renderSidebar();
}

function setHomeState(patch) {
  const next = { ...homeState, ...patch };
  // switching category from a menu closes the search and starts at the first topic
  if (patch.view !== undefined && patch.cat === undefined) next.cat = "all";
  if (patch.cat !== undefined) {
    if (patch.q === undefined) next.q = "";
    if (patch.topic === undefined) next.topic = patch.cat === "all" ? "all" : firstTopic(patch.cat);
  }
  homeState = normalizeState(next);
  const qs = stateToQuery(homeState);
  history.replaceState(null, "", location.pathname + (qs ? "?" + qs : ""));
  const input = document.getElementById("q");
  if (input && input.value !== homeState.q) input.value = homeState.q;
  renderHome();
}

function initHome(containerId, inputId) {
  homeState = readStateFromUrl();
  const input = document.getElementById(inputId);
  if (input) {
    input.value = homeState.q;
    input.addEventListener("input", () => setHomeState({ q: input.value }));
    input.addEventListener("keydown", e => { if (e.key === "Escape" && input.value) setHomeState({ q: "" }); });
  }
  document.addEventListener("keydown", e => {
    const tag = (e.target.tagName || "").toLowerCase();
    if (e.key === "/" && !["input", "textarea", "select"].includes(tag)) {
      e.preventDefault(); if (input) input.focus();
    }
  });

  const root = document.getElementById(containerId);
  root.addEventListener("click", e => {
    const t = e.target.closest("[data-goto],[data-cat],[data-topic],[data-view],[data-ask],#f-reset,#f-clear");
    if (!t) return;
    if (t.dataset.goto !== undefined) return setHomeState({ view: t.dataset.goto, cat: "all" });
    if (t.dataset.cat !== undefined || t.dataset.topic !== undefined) {
      const patch = {};
      if (t.dataset.cat !== undefined) patch.cat = t.dataset.cat;
      if (t.dataset.topic !== undefined) patch.topic = t.dataset.topic;
      return setHomeState(patch);
    }
    if (t.dataset.view !== undefined) {
      homeView = t.dataset.view;
      try { localStorage.setItem("hub.view", homeView); } catch (err) {}
      return renderHome();
    }
    if (t.dataset.ask !== undefined) { if (FEATURES.assistant && window.HubAssistant) window.HubAssistant.open(t.dataset.ask); return; }
    if (t.id === "f-clear") return setHomeState({ q: "" });
    if (t.id === "f-reset") return setHomeState({ aud: "all", type: "all", ready: false, sort: "new" });
  });
  root.addEventListener("change", e => {
    if (e.target.id === "f-aud")   setHomeState({ aud: e.target.value });
    if (e.target.id === "f-type")  setHomeState({ type: e.target.value });
    if (e.target.id === "f-sort")  setHomeState({ sort: e.target.value });
    if (e.target.id === "f-ready") setHomeState({ ready: e.target.checked });
  });

  // navigation from the sidebar without reloading the page
  window.hubNavigate = params => {
    const p = new URLSearchParams(params);
    const cat = p.get("cat") || "all";
    setHomeState({ q: "", aud: "all", type: "all", ready: false, cat, view: p.get("view") || "dashboard",
      topic: p.get("topic") || (cat === "all" ? "all" : firstTopic(cat)) });
  };
  window.rerender = renderHome;
  window.getHomeState = () => homeState;
  renderHome();
}

/* Render viewer.html — shows slides/PDF inside the site.
   A Google file that is not shared as "Anyone with the link" cannot be shown
   inside the site (Google refuses or asks for a login, which looks like
   flickering). So by default it is NOT loaded automatically: the user first
   sees an access panel and can open it in Google, download the PDF, or try to
   show it here. For files that are already public, set `public: true` in the data. */
function renderViewer() {
  const id = new URLSearchParams(location.search).get("id");
  const r = (typeof RESOURCES !== "undefined") ? RESOURCES.find(x => x.id === id) : null;
  const bar = document.getElementById("viewer-title");
  const frameWrap = document.getElementById("viewer-frame");
  const openExt = document.getElementById("open-external");

  if (!r || !hasContent(r)) {
    if (bar) bar.textContent = "Material not available yet";
    if (openExt) openExt.style.display = "none";
    if (frameWrap) frameWrap.innerHTML = stateHtml("empty",
      "This material has not been uploaded yet. Contact the admin or check the Manage Materials page.");
    return;
  }
  if (bar) bar.textContent = r.title;
  document.title = r.title + " — Training Hub EAC";

  // opening a material counts as started; the learner can mark it as learned right here
  Store.markStarted(r.id);
  const learnBtn = document.getElementById("mark-learned");
  if (learnBtn) {
    const paint = () => {
      const done = Store.status(r.id) === "learned";
      learnBtn.hidden = false;
      learnBtn.className = "btn small " + (done ? "primary" : "ghost");
      learnBtn.textContent = done ? "✓ Learned" : "Mark as learned";
      learnBtn.title = done ? "Click to undo" : "Mark this material as learned";
    };
    learnBtn.onclick = () => { Store.setLearned(r.id, Store.status(r.id) !== "learned"); paint(); };
    paint();
  }

  const isGoogle = r.type === "gslides" || r.type === "gdoc" || r.type === "gdrive";
  const idMatch = (r.src.match(/\/d\/([a-zA-Z0-9_-]+)/) || [])[1];
  const googleName = r.type === "gslides" ? "Google Slides" : r.type === "gdoc" ? "Google Docs" : "Google Drive";
  const pdfUrl = !idMatch ? "" : (r.type === "gslides"
    ? `https://docs.google.com/presentation/d/${idMatch}/export/pdf`
    : r.type === "gdoc" ? `https://docs.google.com/document/d/${idMatch}/export?format=pdf`
    : `https://drive.google.com/uc?export=download&id=${idMatch}`);

  if (openExt) {
    openExt.href = r.src;
    openExt.textContent = isGoogle ? `Open in ${googleName}` : "Open in new tab";
    openExt.style.display = (r.type === "pdf" || r.type === "ppt") ? "none" : "inline-block";
  }
  if (!frameWrap) return;

  const showEmbed = () => {
    const f = document.createElement("iframe");
    f.src = toEmbedUrl(r.type, r.src);
    f.setAttribute("allowfullscreen", "");
    f.setAttribute("title", r.title);
    frameWrap.innerHTML = "";
    if (isGoogle) {
      const note = document.createElement("div");
      note.className = "embed-note";
      note.innerHTML = `<span>Seeing a login screen or "You need access"? Request access from the file owner in ${esc(googleName)}.</span>
        <a class="btn ghost small" target="_blank" rel="noopener" href="${esc(r.src)}">Open in ${esc(googleName)}</a>
        ${pdfUrl ? `<a class="btn ghost small" target="_blank" rel="noopener" href="${esc(pdfUrl)}">Download PDF</a>` : ""}`;
      frameWrap.appendChild(note);
    }
    frameWrap.appendChild(f);   // attached once, no swapping of views
  };

  // Local PDF, or a Google file that is already public: show straight away
  if (!isGoogle || r.public) return showEmbed();

  frameWrap.innerHTML = `
    <div class="access-panel">
      <div class="access-ic" aria-hidden="true">${svg("lock", 34)}</div>
      <h3>This material lives in ${esc(googleName)}</h3>
      <p>Some Google files need special access. Open it in ${esc(googleName)} first — if asked, click
         <b>Request access</b> to reach the file owner. Once approved you can read the slides there or download them as a PDF.</p>
      <div class="actions">
        <a class="btn primary" target="_blank" rel="noopener" href="${esc(r.src)}">Open in ${esc(googleName)}</a>
        ${pdfUrl ? `<a class="btn" target="_blank" rel="noopener" href="${esc(pdfUrl)}">Download PDF</a>` : ""}
        <button type="button" class="btn ghost" id="show-embed">Try showing it here</button>
      </div>
      <p class="access-hint">"Try showing it here" only works when the file is shared with anyone who has the link.</p>
    </div>`;
  document.getElementById("show-embed").addEventListener("click", showEmbed);
}
