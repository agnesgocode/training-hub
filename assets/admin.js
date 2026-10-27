/* Admin page: one place to track materials, links, categories and topics.
   Read-only tracking + helpers that generate the snippet to paste into data/resources.js.
   (Teachers' progress is stored in their own browsers, so it cannot be listed here yet.) */
(function () {
  const root = document.getElementById("admin");
  try { localStorage.setItem("hub.admin", "1"); } catch (e) {}   // shows the Admin item in the sidebar on this device

  const TABS = [["overview", "Overview"], ["materials", "Materials"], ["links", "Links"], ["categories", "Categories"], ["add", "Add / update"]];
  let tab = TABS.some(t => t[0] === location.hash.slice(1)) ? location.hash.slice(1) : "overview";
  const mf = { q: "", cat: "all", status: "all", sort: "title" };
  const lf = { q: "", cat: "all", origin: "all", issue: "all" };
  const firstCat = (CATEGORIES[0] || {}).id || "";
  const form = { title: "", category: firstCat, topic: "", audience: ["teacher"], type: "gslides", src: "", desc: "", pub: false };
  const catForm = { id: "", label: "", desc: "", icon: "📁" };
  const topicForm = { category: firstCat, id: "", label: "" };

  const quizzes = typeof QUIZZES === "undefined" ? [] : QUIZZES;
  const J = v => JSON.stringify(v);
  const slug = s => String(s || "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  const hostOf = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return ""; } };
  const normUrl = u => String(u || "").trim().toLowerCase().replace(/\/+$/, "");
  const today = () => new Date().toISOString().slice(0, 10);
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;
  const sheetConfigured = () => typeof LINKS_SHEET !== "undefined" && !!LINKS_SHEET.id;

  /* ----------------------------- checks ----------------------------- */
  function matStatus(r) {
    if (!hasContent(r)) return { id: "waiting", label: "Waiting for file", cls: "soon" };
    if ((r.type === "gslides" || r.type === "gdrive") && !r.public) return { id: "access", label: "Check access", cls: "started" };
    return { id: "live", label: "Live", cls: "learned" };
  }
  const srcCounts = (() => {
    const m = {};
    RESOURCES.forEach(r => { const k = normUrl(r.src); if (k) m[k] = (m[k] || 0) + 1; });
    return m;
  })();
  const hasReadyQuiz = r => quizzes.some(q => q.material === r.id && quizReady(q));
  function matIssues(r) {
    const out = [], st = matStatus(r);
    if (st.id === "waiting") out.push({ lv: "bad", t: "No file yet" });
    if (st.id === "access") out.push({ lv: "warn", t: "Not marked public" });
    if (hasContent(r) && r.type !== "page" && !r.updated) out.push({ lv: "warn", t: "No updated date" });
    if (!(r.audience || []).length) out.push({ lv: "warn", t: "No audience" });
    const c = catOf(r.category), tp = topicOf(r.topic);
    if (!c) out.push({ lv: "bad", t: "Unknown category" });
    else if (!tp || tp.category !== r.category) out.push({ lv: "bad", t: "Topic doesn't match category" });
    if (srcCounts[normUrl(r.src)] > 1) out.push({ lv: "warn", t: "Duplicate source" });
    if (hasContent(r) && !hasReadyQuiz(r)) out.push({ lv: "info", t: "No quiz yet" });
    return out;
  }
  const linkCounts = links => { const m = {}; links.forEach(l => { const k = normUrl(l.url); m[k] = (m[k] || 0) + 1; }); return m; };
  function linkIssues(l, counts) {
    const out = [];
    try { new URL(l.url); } catch (e) { out.push({ lv: "bad", t: "Invalid URL" }); }
    if (l.category === "Other") out.push({ lv: "warn", t: "No category" });
    if (counts[normUrl(l.url)] > 1) out.push({ lv: "warn", t: "Duplicate" });
    if (l.origin === "device") out.push({ lv: "info", t: "Only on this device" });
    return out;
  }
  const chips = list => list.map(i => `<span class="ichip ${i.lv}">${esc(i.t)}</span>`).join("");
  const worst = list => list.some(i => i.lv === "bad") ? "bad" : list.some(i => i.lv === "warn") ? "warn" : "ok";

  /* ----------------------------- data snapshot ----------------------------- */
  function snapshot() {
    const links = Learner.rawLinks(), counts = linkCounts(links);
    const mats = RESOURCES.map(r => ({ r, st: matStatus(r), issues: matIssues(r) }));
    const lks = links.map(l => ({ l, issues: linkIssues(l, counts) }));
    return { mats, lks };
  }

  /* ----------------------------- views ----------------------------- */
  function head(sub, actions) {
    return `<div class="page-head head-row">
      <span class="head-ic" aria-hidden="true">${svg("settings", 26)}</span>
      <div class="head-txt"><h1>Admin</h1><p>${sub}</p></div>${actions || ""}</div>
      <div class="tabs" role="tablist" aria-label="Admin sections">
        ${TABS.map(([id, l]) => `<button type="button" class="tab${tab === id ? " on" : ""}" data-atab="${id}" role="tab" aria-selected="${tab === id}">${l}</button>`).join("")}
      </div>`;
  }

  function overview(S) {
    const live = S.mats.filter(m => m.st.id === "live").length;
    const attention = S.mats.filter(m => m.issues.some(i => i.lv !== "info")).length;
    const topics = TOPICS.length;
    const qReady = quizzes.filter(quizReady).length;
    const cnt = (f) => S.mats.filter(f).length, lc = f => S.lks.filter(f).length;
    const items = [
      { lv: "bad",  n: cnt(m => m.st.id === "waiting"), t: "materials waiting for a file", go: ["materials", { status: "waiting" }] },
      { lv: "warn", n: cnt(m => m.st.id === "access"),  t: "Google files not marked public (viewers see the access panel)", go: ["materials", { status: "access" }] },
      { lv: "bad",  n: cnt(m => m.issues.some(i => /Unknown|Topic/.test(i.t))), t: "materials with a wrong category or topic", go: ["materials", { status: "issues" }] },
      { lv: "warn", n: cnt(m => m.issues.some(i => /updated date|audience|Duplicate/.test(i.t))), t: "materials missing a date or audience, or duplicated", go: ["materials", { status: "issues" }] },
      { lv: "info", n: cnt(m => m.issues.some(i => i.t === "No quiz yet")), t: "live materials without a quiz", go: ["materials", { status: "noquiz" }] },
      { lv: "bad",  n: lc(x => x.issues.some(i => i.t === "Invalid URL")), t: "links with an invalid URL", go: ["links", { issue: "bad" }] },
      { lv: "warn", n: lc(x => x.issues.some(i => i.t === "Duplicate" || i.t === "No category")), t: "links that are duplicated or have no category", go: ["links", { issue: "warn" }] },
      { lv: "info", n: lc(x => x.l.origin === "device"), t: "links that exist only on this device (not shared)", go: ["links", { origin: "device" }] },
    ].filter(i => i.n > 0);
    const attn = items.length ? items.map(i => `
      <li><span class="dot ${i.lv}"></span><span class="a-tx"><b>${i.n}</b> ${esc(i.t)}</span>
        <button type="button" class="link-btn" data-review='${esc(J(i.go))}'>Review</button></li>`).join("")
      : `<li class="all-good">${svg("check", 18)} Everything looks good.</li>`;
    const bars = CATEGORIES.map(c => {
      const ms = S.mats.filter(m => m.r.category === c.id), lv = ms.filter(m => m.st.id === "live").length, wt = ms.filter(m => m.st.id === "waiting").length;
      return `<div class="bar-row"><span>${esc(c.label)}</span>
        <div class="bar ${esc(c.id)}"><i style="width:${ms.length ? lv / ms.length * 100 : 0}%"></i></div><b>${lv}<small>/${ms.length}${wt ? ` · ${wt} waiting` : ""}</small></b></div>`;
    }).join("");
    const sheetLine = !sheetConfigured() ? "Shared links sheet: not connected" : (() => {
      const s = Learner.sheetState();
      return s.state === "ok" ? `Shared links sheet: connected · ${plural(s.rows.length, "link")}` : s.state === "error" ? `Shared links sheet: couldn't be read (${esc(s.error)})` : "Shared links sheet: loading…";
    })();
    return `<div class="view-body">
      <div class="kpi-row six">
        <section class="tile-card kpi"><span class="ms-ic a">${svg("file", 20)}</span><span><small>Materials</small><b>${S.mats.length}</b></span></section>
        <section class="tile-card kpi"><span class="ms-ic c">${svg("check", 20)}</span><span><small>Live</small><b>${live}<i>/${S.mats.length}</i></b></span></section>
        <section class="tile-card kpi"><span class="ms-ic b">${svg("clock", 20)}</span><span><small>Need attention</small><b>${attention}</b></span></section>
        <section class="tile-card kpi"><span class="ms-ic d">${svg("link", 20)}</span><span><small>Resource links</small><b>${S.lks.length}</b></span></section>
        <section class="tile-card kpi"><span class="ms-ic a">${svg("layers", 20)}</span><span><small>Categories · topics</small><b>${CATEGORIES.length}<i> · ${topics}</i></b></span></section>
        <section class="tile-card kpi"><span class="ms-ic c">${svg("quiz", 20)}</span><span><small>Quizzes ready</small><b>${qReady}<i>/${quizzes.length}</i></b></span></section>
      </div>
      <div class="two-col">
        <section class="tile-card"><h3>${svg("clock", 18)} Needs attention</h3><ul class="attn">${attn}</ul></section>
        <section class="tile-card"><h3>${svg("layers", 18)} Materials by category</h3>${bars}<p class="legend"><i></i> live <i class="rest"></i> not live yet</p>
          <p class="res-status">${sheetLine}</p></section>
      </div>
    </div>`;
  }

  /* ---- materials ---- */
  function filteredMats(S) {
    const q = mf.q.trim().toLowerCase();
    let list = S.mats.filter(m => {
      if (mf.cat !== "all" && m.r.category !== mf.cat) return false;
      if (mf.status === "live" && m.st.id !== "live") return false;
      if (mf.status === "waiting" && m.st.id !== "waiting") return false;
      if (mf.status === "access" && m.st.id !== "access") return false;
      if (mf.status === "issues" && !m.issues.some(i => i.lv !== "info")) return false;
      if (mf.status === "noquiz" && !m.issues.some(i => i.t === "No quiz yet")) return false;
      if (q && !(m.r.title + " " + m.r.id + " " + (m.r.desc || "") + " " + (m.r.tags || []).join(" ")).toLowerCase().includes(q)) return false;
      return true;
    });
    const key = { title: m => m.r.title.toLowerCase(), category: m => m.r.category + (m.r.topic || ""), status: m => m.st.id, updated: m => m.r.updated || "" }[mf.sort] || (m => m.r.title);
    list.sort((a, b) => (mf.sort === "updated" ? key(b).localeCompare(key(a)) : key(a).localeCompare(key(b))));
    return list;
  }
  function matTable(S) {
    const list = filteredMats(S);
    if (!list.length) return `<div class="state"><div class="big">🔍</div><div>No materials match these filters.</div></div>`;
    const th = (k, l) => `<th><button type="button" class="th-sort${mf.sort === k ? " on" : ""}" data-asort="${k}">${l}${mf.sort === k ? " ↓" : ""}</button></th>`;
    return `<div class="data-card"><table class="res-table adm-table"><thead><tr>${th("status", "Status")}${th("title", "Material")}${th("category", "Category · topic")}<th>For</th><th>Source</th>${th("updated", "Updated")}<th>Quiz</th><th>Flags</th></tr></thead><tbody>
      ${list.map(({ r, st, issues }) => {
        const c = catOf(r.category), t = topicOf(r.topic), a = actionFor(r);
        const src = hasContent(r) ? `<a href="${esc(r.type === "page" ? r.src + ".html" : r.src)}" target="_blank" rel="noopener" title="${esc(r.src)}">${esc(r.type === "page" ? "page: " + r.src : (hostOf(r.src) || r.src))}</a>` : `<span class="muted">—</span>`;
        const qz = quizzes.filter(q => q.material === r.id);
        return `<tr class="r-${worst(issues)}">
          <td><span class="lchip ${st.cls}">${esc(st.label)}</span></td>
          <td><b>${esc(r.title)}</b><small class="id">${esc(r.id)} · ${esc(TYPE_LABEL[r.type] || r.type)}</small></td>
          <td>${esc(c ? c.label : r.category)}<small class="id">${esc(t ? t.label : r.topic)}</small></td>
          <td>${(r.audience || []).map(x => `<span class="aud-chip">${esc((audOf(x) || {}).label || x)}</span>`).join(" ") || '<span class="muted">—</span>'}</td>
          <td>${src}</td>
          <td>${r.updated ? esc(fmtDate(r.updated)) : '<span class="muted">—</span>'}</td>
          <td>${qz.length ? qz.map(q => `<span class="lchip ${quizReady(q) ? "learned" : "soon"}">${quizReady(q) ? "Ready" : "Soon"}</span>`).join(" ") : '<span class="muted">none</span>'}</td>
          <td class="flags">${chips(issues.filter(i => i.lv !== "info")) || '<span class="ok-tx">✓</span>'}</td></tr>`;
      }).join("")}</tbody></table></div>`;
  }
  function materialsView(S) {
    const opt = (v, l, cur) => `<option value="${esc(v)}"${cur === v ? " selected" : ""}>${esc(l)}</option>`;
    return `<div class="tools">
        <label class="res-filter">${svg("search", 16)}<input id="a-mq" type="search" placeholder="Search title, id, tag…" value="${esc(mf.q)}" autocomplete="off"></label>
        <select id="a-mcat" aria-label="Category">${opt("all", "All categories", mf.cat)}${CATEGORIES.map(c => opt(c.id, c.label, mf.cat)).join("")}</select>
        <select id="a-mstatus" aria-label="Status">${opt("all", "All statuses", mf.status)}${opt("live", "Live", mf.status)}${opt("waiting", "Waiting for file", mf.status)}${opt("access", "Check access", mf.status)}${opt("issues", "Has issues", mf.status)}${opt("noquiz", "No quiz yet", mf.status)}</select>
        <span class="spacer"></span><button type="button" class="btn ghost small" data-csv="materials">${svg("file", 14)} Download CSV</button>
      </div><div class="view-body" id="a-mtable">${matTable(S)}</div>`;
  }

  /* ---- links ---- */
  function filteredLinks(S) {
    const q = lf.q.trim().toLowerCase();
    return S.lks.filter(({ l, issues }) => {
      if (lf.cat !== "all" && l.category !== lf.cat) return false;
      if (lf.origin !== "all" && l.origin !== lf.origin) return false;
      if (lf.issue === "bad" && !issues.some(i => i.lv === "bad")) return false;
      if (lf.issue === "warn" && !issues.some(i => i.lv === "warn")) return false;
      if (q && !(l.title + " " + l.url + " " + (l.desc || "") + " " + l.category).toLowerCase().includes(q)) return false;
      return true;
    }).sort((a, b) => a.l.category.localeCompare(b.l.category) || a.l.title.localeCompare(b.l.title));
  }
  const ORIGIN = { "built-in": ["Built-in", "new"], shared: ["Shared sheet", "learned"], device: ["This device", "started"] };
  function linkTable(S) {
    const list = filteredLinks(S);
    if (!list.length) return `<div class="state"><div class="big">🔗</div><div>No links match these filters.</div></div>`;
    return `<div class="data-card"><table class="res-table adm-table"><thead><tr><th>Link</th><th>Category</th><th>For</th><th>Where it lives</th><th>Flags</th><th></th></tr></thead><tbody>
      ${list.map(({ l, issues }) => `<tr class="r-${worst(issues.filter(i => i.lv !== "info"))}">
        <td><b>${esc(l.title)}</b><small class="id">${esc(hostOf(l.url) || l.url)}</small></td>
        <td>${esc(l.category)}</td>
        <td>${(l.audience || []).map(x => `<span class="aud-chip">${esc((audOf(x) || {}).label || x)}</span>`).join(" ") || '<span class="muted">everyone</span>'}</td>
        <td><span class="lchip ${ORIGIN[l.origin][1]}">${ORIGIN[l.origin][0]}</span></td>
        <td class="flags">${chips(issues.filter(i => i.t !== "Only on this device")) || '<span class="ok-tx">✓</span>'}</td>
        <td><a class="btn ghost small" href="${esc(l.url)}" target="_blank" rel="noopener">${svg("external", 13)} Open</a></td></tr>`).join("")}</tbody></table></div>`;
  }
  function linksView(S) {
    const cats = [...new Set(S.lks.map(x => x.l.category))].sort();
    const opt = (v, l, cur) => `<option value="${esc(v)}"${cur === v ? " selected" : ""}>${esc(l)}</option>`;
    const sh = Learner.sheetState();
    const status = !sheetConfigured() ? `Shared sheet not connected — see <b>Add / update</b> for setup.` :
      sh.state === "ok" ? `Shared sheet connected · ${plural(sh.rows.length, "link")} · checked ${esc(sh.at)}` :
      sh.state === "error" ? `Couldn't read the shared sheet (${esc(sh.error)})` : "Loading the shared sheet…";
    const sheetUrl = sheetConfigured() ? `https://docs.google.com/spreadsheets/d/${LINKS_SHEET.id}/edit#gid=${LINKS_SHEET.gid || 0}` : "";
    return `<div class="tools">
        <label class="res-filter">${svg("search", 16)}<input id="a-lq" type="search" placeholder="Search links…" value="${esc(lf.q)}" autocomplete="off"></label>
        <select id="a-lcat" aria-label="Link category">${opt("all", "All categories", lf.cat)}${cats.map(c => opt(c, c, lf.cat)).join("")}</select>
        <select id="a-lorigin" aria-label="Where it lives">${opt("all", "Anywhere", lf.origin)}${opt("built-in", "Built-in", lf.origin)}${opt("shared", "Shared sheet", lf.origin)}${opt("device", "This device", lf.origin)}</select>
        <select id="a-lissue" aria-label="Flags">${opt("all", "All flags", lf.issue)}${opt("bad", "Errors", lf.issue)}${opt("warn", "Warnings", lf.issue)}</select>
        <span class="spacer"></span><span class="res-status">${status}</span>
        ${sheetUrl ? `<a class="btn ghost small" href="${esc(sheetUrl)}" target="_blank" rel="noopener">${svg("external", 13)} Open sheet</a>` : ""}
        <button type="button" class="btn ghost small" data-csv="links">${svg("file", 14)} Download CSV</button>
      </div><div class="view-body" id="a-ltable">${linkTable(S)}</div>`;
  }

  /* ---- categories ---- */
  function categoriesView(S) {
    const cards = CATEGORIES.map(c => {
      const ms = S.mats.filter(m => m.r.category === c.id);
      const rows = TOPICS.filter(t => t.category === c.id).map(t => {
        const tm = ms.filter(m => m.r.topic === t.id), lv = tm.filter(m => m.st.id === "live").length;
        return `<tr><td>${esc(t.label)}<small class="id">${esc(t.id)}</small></td><td>${tm.length}</td><td>${lv}</td><td>${tm.length - lv}</td>
          <td>${tm.length === 0 ? '<span class="ichip warn">Empty topic</span>' : ""}</td></tr>`;
      }).join("");
      return `<section class="tile-card cat-admin ${esc(c.id)}">
        <h3><span class="cat-ic">${svg(c.id, 18)}</span> ${esc(c.label)} <em>${ms.length} materials</em></h3>
        <p class="muted">${esc(c.desc || "")} <small class="id">id: ${esc(c.id)}</small></p>
        <table class="res-table mini"><thead><tr><th>Topic</th><th>Materials</th><th>Live</th><th>Waiting</th><th></th></tr></thead><tbody>${rows || '<tr><td colspan="5" class="muted">No topics yet.</td></tr>'}</tbody></table>
      </section>`;
    }).join("");
    const lcats = {};
    S.lks.forEach(x => { lcats[x.l.category] = (lcats[x.l.category] || 0) + 1; });
    const lrows = Object.keys(lcats).sort().map(k => `<tr><td>${esc(k)}</td><td>${lcats[k]}</td></tr>`).join("");
    return `<div class="view-body"><div class="cat-admin-grid">${cards}
      <section class="tile-card"><h3>${svg("link", 18)} Link categories <em>free text</em></h3>
        <p class="muted">Resource links use their own free-text categories (set in the shared sheet or when adding a link).</p>
        <table class="res-table mini"><thead><tr><th>Category</th><th>Links</th></tr></thead><tbody>${lrows || '<tr><td colspan="2" class="muted">No links yet.</td></tr>'}</tbody></table></section>
    </div></div>`;
  }

  /* ---- add / update helpers ---- */
  function materialSnippet() {
    const f = form, id = slug(f.title) || "new-material";
    const lines = ["  {", `    id: ${J(id)},`, `    category: ${J(f.category)},`, `    topic: ${J(f.topic)},`, `    audience: ${J(f.audience)},`, "    tags: [],",
      `    title: ${J(f.title.trim())},`, `    desc: ${J(f.desc.trim())},`, `    type: ${J(f.type)},`, `    src: ${J(f.src.trim())},`];
    if (f.pub) lines.push("    public: true,");
    lines.push(`    updated: ${J(f.src.trim() ? today() : "")},`, "  },");
    return lines.join("\n");
  }
  const catSnippet = () => `  { id: ${J(slug(catForm.id || catForm.label) || "new-category")}, label: ${J(catForm.label.trim())}, icon: ${J(catForm.icon || "📁")}, desc: ${J(catForm.desc.trim())} },`;
  const topicSnippet = () => `  { id: ${J(slug(topicForm.id || topicForm.label) || "new-topic")}, category: ${J(topicForm.category)}, label: ${J(topicForm.label.trim())} },`;

  function addView() {
    const topics = TOPICS.filter(t => t.category === form.category);
    if (!topics.some(t => t.id === form.topic)) form.topic = (topics[0] || {}).id || "";
    const idTaken = RESOURCES.some(r => r.id === slug(form.title));
    const opt = (v, l, cur) => `<option value="${esc(v)}"${cur === v ? " selected" : ""}>${esc(l)}</option>`;
    return `<div class="view-body"><div class="add-grid">
      <section class="tile-card">
        <h3>${svg("plus", 18)} Add a material</h3>
        <form id="f-mat" class="a-form" autocomplete="off" onsubmit="return false">
          <label>Title<input data-f="title" type="text" value="${esc(form.title)}" placeholder="e.g. SmartApp for MT Coach"></label>
          <div class="a-row">
            <label>Category<select data-fc="category">${CATEGORIES.map(c => opt(c.id, c.label, form.category)).join("")}</select></label>
            <label>Topic<select data-fc="topic">${topics.map(t => opt(t.id, t.label, form.topic)).join("") || '<option value="">(add a topic first)</option>'}</select></label>
          </div>
          <div class="a-row">
            <label>Type<select data-fc="type">${Object.keys(TYPE_LABEL).map(k => opt(k, TYPE_LABEL[k], form.type)).join("")}</select></label>
            <label class="grow">Link or file<input data-f="src" type="text" value="${esc(form.src)}" placeholder="https://… or files/name.pdf (empty = coming soon)"></label>
          </div>
          <label>Description<input data-f="desc" type="text" value="${esc(form.desc)}" placeholder="One or two sentences"></label>
          <fieldset><legend>For</legend>${AUDIENCES.map(a => `<label class="ck"><input type="checkbox" data-aud="${esc(a.id)}"${form.audience.includes(a.id) ? " checked" : ""}> ${esc(a.label)}</label>`).join("")}</fieldset>
          <label class="ck"><input type="checkbox" data-fc="pub"${form.pub ? " checked" : ""}> The Google file is shared as “Anyone with the link” (show slides directly)</label>
        </form>
        ${idTaken ? '<p class="m-err">A material with this id already exists — change the title or edit the existing one.</p>' : ""}
        <div class="snip-head"><b>Paste inside <code>RESOURCES</code> in <code>data/resources.js</code></b><button type="button" class="btn small" data-copy-el="snip-mat">${svg("copy", 13)} Copy</button></div>
        <pre class="snippet" id="snip-mat">${esc(materialSnippet())}</pre>
      </section>
      <div class="add-side">
        <section class="tile-card">
          <h3>${svg("layers", 18)} Add a category or topic</h3>
          <form id="f-cat" class="a-form" autocomplete="off" onsubmit="return false">
            <b class="sub">New category</b>
            <div class="a-row"><label class="grow">Name<input data-cf="label" type="text" value="${esc(catForm.label)}" placeholder="e.g. Quality"></label><label class="narrow">Icon<input data-cf="icon" type="text" value="${esc(catForm.icon)}" maxlength="4"></label></div>
            <label>Description<input data-cf="desc" type="text" value="${esc(catForm.desc)}" placeholder="One line"></label>
          </form>
          <div class="snip-head"><b>Add to <code>CATEGORIES</code></b><button type="button" class="btn small" data-copy-el="snip-cat">${svg("copy", 13)} Copy</button></div>
          <pre class="snippet" id="snip-cat">${esc(catSnippet())}</pre>
          <form id="f-topic" class="a-form" autocomplete="off" onsubmit="return false">
            <b class="sub">New topic</b>
            <div class="a-row"><label>In category<select data-tc="category">${CATEGORIES.map(c => opt(c.id, c.label, topicForm.category)).join("")}</select></label>
              <label class="grow">Topic name<input data-tf="label" type="text" value="${esc(topicForm.label)}" placeholder="e.g. Classroom tools"></label></div>
          </form>
          <div class="snip-head"><b>Add to <code>TOPICS</code></b><button type="button" class="btn small" data-copy-el="snip-topic">${svg("copy", 13)} Copy</button></div>
          <pre class="snippet" id="snip-topic">${esc(topicSnippet())}</pre>
        </section>
        <section class="tile-card help">
          <h3>${svg("learning", 18)} How updates reach teachers</h3>
          <ol><li>Paste the snippet into <code>data/resources.js</code> (keep the comma at the end).</li>
              <li>Save the file, then publish the site the way you normally do. Teachers see it on their next refresh.</li>
              <li><b>Links</b> don't need this: add a row to the shared Google Sheet (see <code>data/links.js</code>) and they appear for everyone.</li></ol>
        </section>
      </div>
    </div></div>`;
  }

  /* ----------------------------- exports ----------------------------- */
  const csvCell = v => '"' + String(v == null ? "" : v).replace(/"/g, '""') + '"';
  const toCsv = (hdr, rows) => "\ufeff" + [hdr, ...rows].map(r => r.map(csvCell).join(",")).join("\r\n");
  function csvFor(kind) {
    const S = snapshot();
    if (kind === "materials") return ["materials.csv", toCsv(["id", "title", "category", "topic", "audience", "type", "source", "status", "updated", "quiz", "flags"],
      S.mats.map(({ r, st, issues }) => [r.id, r.title, (catOf(r.category) || {}).label || r.category, (topicOf(r.topic) || {}).label || r.topic, (r.audience || []).join("; "), r.type, r.src, st.label, r.updated || "",
        quizzes.filter(q => q.material === r.id).map(q => q.title + (quizReady(q) ? "" : " (soon)")).join("; "), issues.filter(i => i.lv !== "info").map(i => i.t).join("; ")]))];
    return ["links.csv", toCsv(["title", "url", "category", "description", "audience", "where", "flags"],
      S.lks.map(({ l, issues }) => [l.title, l.url, l.category, l.desc || "", (l.audience || []).join("; "), ORIGIN[l.origin][0], issues.map(i => i.t).join("; ")]))];
  }
  function download(name, text) {
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([text], { type: "text/csv;charset=utf-8" }));
    a.download = name; document.body.appendChild(a); a.click(); a.remove();
  }

  /* ----------------------------- render + events ----------------------------- */
  function render() {
    const S = snapshot();
    const sub = {
      overview: "Track materials, links and categories in one place.",
      materials: `${plural(RESOURCES.length, "material")} across ${plural(CATEGORIES.length, "category")}.`,
      links: "Every resource link: built-in, from the shared sheet, or added on this device.",
      categories: "Categories and topics, and how many materials sit in each.",
      add: "Generate the code to add a material, category or topic — no guessing the format.",
    }[tab];
    const body = { overview, materials: materialsView, links: linksView, categories: categoriesView, add: addView }[tab](S);
    const off = `<button type="button" class="btn ghost small" data-admin-off title="Hide the Admin menu item on this device">Turn off admin mode</button>`;
    root.innerHTML = head(sub, off) + body;
  }
  function setTab(t) { tab = t; history.replaceState(null, "", "#" + t); render(); }

  root.addEventListener("click", e => {
    let x;
    if ((x = e.target.closest("[data-atab]"))) return setTab(x.dataset.atab);
    if ((x = e.target.closest("[data-review]"))) {
      const [t, f] = JSON.parse(x.dataset.review);
      if (t === "materials") Object.assign(mf, { q: "", cat: "all", status: "all", sort: "title" }, f);
      else Object.assign(lf, { q: "", cat: "all", origin: "all", issue: "all" }, f);
      return setTab(t);
    }
    if ((x = e.target.closest("[data-asort]"))) { mf.sort = x.dataset.asort; return render(); }
    if ((x = e.target.closest("[data-csv]"))) { const [n, t] = csvFor(x.dataset.csv); return download(n, t); }
    if ((x = e.target.closest("[data-copy-el]"))) {
      const txt = document.getElementById(x.dataset.copyEl).textContent;
      (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => { x.innerHTML = "Copied ✓"; setTimeout(render, 900); }, () => { x.textContent = "Select & copy manually"; });
      return;
    }
    if (e.target.closest("[data-admin-off]")) { try { localStorage.removeItem("hub.admin"); } catch (err) {} location.href = "index.html"; }
  });
  const refreshSnip = () => {
    const set = (id, t) => { const el = document.getElementById(id); if (el) el.textContent = t; };
    set("snip-mat", materialSnippet()); set("snip-cat", catSnippet()); set("snip-topic", topicSnippet());
  };
  root.addEventListener("input", e => {
    const t = e.target;
    if (t.id === "a-mq") { mf.q = t.value; document.getElementById("a-mtable").innerHTML = matTable(snapshot()); }
    else if (t.id === "a-lq") { lf.q = t.value; document.getElementById("a-ltable").innerHTML = linkTable(snapshot()); }
    else if (t.dataset.f) { form[t.dataset.f] = t.value; refreshSnip(); }
    else if (t.dataset.cf) { catForm[t.dataset.cf] = t.value; refreshSnip(); }
    else if (t.dataset.tf) { topicForm[t.dataset.tf] = t.value; refreshSnip(); }
  });
  root.addEventListener("change", e => {
    const t = e.target;
    if (t.id === "a-mcat") { mf.cat = t.value; return render(); }
    if (t.id === "a-mstatus") { mf.status = t.value; return render(); }
    if (t.id === "a-lcat") { lf.cat = t.value; return render(); }
    if (t.id === "a-lorigin") { lf.origin = t.value; return render(); }
    if (t.id === "a-lissue") { lf.issue = t.value; return render(); }
    if (t.dataset.fc) { form[t.dataset.fc] = t.type === "checkbox" ? t.checked : t.value; return render(); }
    if (t.dataset.aud) { form.audience = t.checked ? [...new Set([...form.audience, t.dataset.aud])] : form.audience.filter(a => a !== t.dataset.aud); return refreshSnip(); }
    if (t.dataset.tc) { topicForm.category = t.value; return refreshSnip(); }
  });

  window.AdminPage = { csvFor, materialSnippet, snapshot, matIssues, linkIssues };
  if (sheetConfigured()) { Learner.onSheet(() => { if (tab === "overview" || tab === "links") render(); }); Learner.loadSheet(false); }
  render();
})();
