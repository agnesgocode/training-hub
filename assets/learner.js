/* Learner experience: dashboard, My Learning, Quizzes, My Results, Resources.
   Loaded on index.html after assets/app.js (which provides Store, ROLES, helpers).
   Data comes from data/resources.js, data/quizzes.js and data/links.js. */

window.Learner = (function () {
  const PASS_TARGET_AVG = 80;
  let learnTab = "all";
  let resCat = "All";
  let sheet = { state: "idle", rows: [], at: "", error: "" };   // shared Google Sheet links

  const me = () => Store.profile();
  const role = () => (me() && me().role) || "mt";
  const firstName = n => String(n || "").trim().split(/\s+/)[0] || "there";
  const initials = n => String(n || "?").trim().split(/\s+/).slice(0, 2).map(w => w[0]).join("").toUpperCase() || "?";
  const day = iso => { const d = new Date(iso); return isNaN(d) ? "" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }); };
  const host = u => { try { return new URL(u).hostname.replace(/^www\./, ""); } catch (e) { return u; } };
  const plural = (n, w) => `${n} ${w}${n === 1 ? "" : "s"}`;

  /* ----------------------------- numbers ----------------------------- */
  function stats() {
    const r = role();
    const req = requiredFor(r);
    const avail = req.filter(hasContent);
    const learned = avail.filter(x => Store.status(x.id) === "learned");
    const quizzes = quizzesFor(r).filter(quizReady);
    const passed = quizzes.filter(q => (bestAttempt(q.id) || {}).passed);
    const atts = Store.attempts();
    const avg = atts.length ? Math.round(atts.reduce((a, b) => a + b.score, 0) / atts.length) : null;
    const next = avail.filter(x => Store.status(x.id) !== "learned")
      .sort((a, b) => (Store.status(a.id) === "started" ? 0 : 1) - (Store.status(b.id) === "started" ? 0 : 1))[0] || null;
    return { r, req, avail, learned, quizzes, passed, atts, avg, next,
             pct: avail.length ? Math.round(learned.length / avail.length * 100) : 0 };
  }

  const bar = (pct, cls) => `<div class="mbar ${cls || ""}"><i style="width:${Math.max(0, Math.min(100, pct))}%"></i></div>`;

  /* ----------------------------- dashboard ----------------------------- */
  function goalsHtml(s) {
    const auto = [
      { text: `Learn all ${plural(s.avail.length, "required material")}`, done: s.learned.length, total: s.avail.length },
    ];
    if (s.quizzes.length) auto.push({ text: `Pass ${s.quizzes.length === 1 ? "the available quiz" : `all ${s.quizzes.length} available quizzes`}`, done: s.passed.length, total: s.quizzes.length });
    auto.push({ text: `Keep your average quiz score at ${PASS_TARGET_AVG}% or more`, pct: s.avg === null ? 0 : Math.min(100, s.avg / PASS_TARGET_AVG * 100), label: s.avg === null ? "No quiz yet" : s.avg + "%", ok: s.avg !== null && s.avg >= PASS_TARGET_AVG });
    const autoHtml = auto.map(g => {
      const pct = g.pct !== undefined ? g.pct : (g.total ? g.done / g.total * 100 : 0);
      const ok = g.ok !== undefined ? g.ok : (g.total > 0 && g.done >= g.total);
      const lbl = g.label !== undefined ? g.label : `${g.done}/${g.total}`;
      return `<li class="goal auto${ok ? " done" : ""}"><span class="g-ck">${ok ? svg("check", 14) : ""}</span>
        <span class="g-tx"><b>${esc(g.text)}</b>${bar(pct)}</span><em>${esc(lbl)}</em></li>`;
    }).join("");
    const mine = Store.goals().map(g => `
      <li class="goal${g.done ? " done" : ""}">
        <button type="button" class="g-ck btn-reset" data-goal-toggle="${esc(g.id)}" aria-label="${g.done ? "Mark as not done" : "Mark as done"}">${g.done ? svg("check", 14) : ""}</button>
        <span class="g-tx"><b>${esc(g.text)}</b>${g.due ? `<small>${duePhrase(g.due, g.done)}</small>` : ""}</span>
        <button type="button" class="btn-reset g-del" data-goal-del="${esc(g.id)}" aria-label="Delete goal" title="Delete">${svg("trash", 15)}</button>
      </li>`).join("");
    return `<section class="tile-card goals">
      <h3>${svg("target", 18)} My goals</h3>
      <ul class="goal-list">${autoHtml}${mine}</ul>
      <form id="goal-form" class="goal-form" autocomplete="off">
        <input name="text" type="text" maxlength="90" placeholder="Add your own goal…" aria-label="New goal" required>
        <input name="due" type="date" aria-label="Due date (optional)">
        <button type="submit" class="btn primary small">${svg("plus", 14)} Add</button>
      </form>
    </section>`;
  }
  function duePhrase(due, done) {
    if (done) return "Done";
    const d = new Date(due + "T23:59:59"), n = Math.ceil((d - new Date()) / 86400000);
    if (isNaN(n)) return "";
    return n < 0 ? `<span class="late">Overdue · ${esc(day(due + "T00:00:00"))}</span>` : (n === 0 ? "Due today" : `Due ${esc(day(due + "T00:00:00"))} · ${plural(n, "day")} left`);
  }

  function dashboardHtml() {
    const s = stats(), p = me() || {};
    const today = new Date().toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
    const todo = s.req.filter(x => Store.status(x.id) !== "learned")
      .sort((a, b) => (hasContent(b) - hasContent(a)) || ((Store.status(a.id) === "started" ? 0 : 1) - (Store.status(b.id) === "started" ? 0 : 1))).slice(0, 4);
    const todoHtml = todo.length ? todo.map(r => learnRow(r, true)).join("")
      : `<p class="empty-note">${svg("trophy", 18)} You have learned everything assigned to you. Nice work!</p>`;

    const recent = s.atts.slice().sort((a, b) => b.at.localeCompare(a.at)).slice(0, 4);
    const recentHtml = recent.length ? recent.map(a => `
      <a class="rail-item" href="quiz.html?review=${esc(a.id)}">
        <span class="score-pill ${a.passed ? "ok" : "bad"}">${a.score}%</span>
        <span class="rail-tx"><b>${esc(a.quizTitle || "Quiz")}</b><small>${a.passed ? "Passed" : "Not passed"} · ${esc(day(a.at))}</small></span>
        <span class="rail-go">${svg("chevron", 16)}</span></a>`).join("")
      : `<p class="empty-note small">No quiz taken yet. <button type="button" class="link-btn" data-goto="quizzes">Try a quiz</button></p>`;

    const byTopic = {};
    s.req.forEach(r => { (byTopic[r.topic] = byTopic[r.topic] || []).push(r); });
    const topicHtml = Object.keys(byTopic).map(tid => {
      const items = byTopic[tid], done = items.filter(x => Store.status(x.id) === "learned").length;
      return `<div class="topic-row"><span>${esc((topicOf(tid) || {}).label || tid)}</span>${bar(done / items.length * 100)}<b>${done}/${items.length}</b></div>`;
    }).join("");

    const cta = s.next
      ? `<a class="btn white" data-mid="${esc(s.next.id)}" href="${esc(actionFor(s.next).href)}"${actionFor(s.next).ext ? ' target="_blank" rel="noopener"' : ""}>${svg("play", 14)} ${Store.status(s.next.id) === "started" ? "Continue" : "Start"}: ${esc(s.next.title.length > 34 ? s.next.title.slice(0, 32) + "…" : s.next.title)}</a>`
      : `<button type="button" class="btn white" data-goto="quizzes">${svg("quiz", 16)} Take a quiz</button>`;

    return `<div class="view-body"><div class="home-grid">
      <div class="home-main">
        <div class="page-head head-row">
          <div class="head-txt"><h1>Hello, ${esc(firstName(p.name))}</h1><p>${esc(today)}</p></div>
          <span class="date-chip">${svg("user", 16)} ${esc(roleLabel(s.r))}</span>
        </div>

        <section class="hero compact">
          <div class="hero-txt">
            <h2>${s.avail.length ? `<b>${s.learned.length} of ${s.avail.length}</b> required materials learned` : "Your learning plan is on the way"}</h2>
            <p>${s.avail.length
                ? (s.pct === 100 ? "You've covered everything available for your role. Test yourself with a quiz." : "Keep going — finish the materials assigned to you, then check yourself with the quizzes.")
                : "Materials for your role are being prepared. They will show up here as soon as they're ready."}</p>
            <div class="hero-bar">${bar(s.pct, "light")}<span>${s.pct}%</span></div>
            <div class="hero-actions">${cta}<button type="button" class="btn glass" data-goto="learning">See my learning</button></div>
          </div>
          <div class="hero-art ring-art" aria-hidden="true"><div class="donut light" style="--p:${s.pct}"><span>${s.pct}%</span></div></div>
        </section>

        <div class="kpi-row">
          <section class="tile-card kpi"><span class="ms-ic a">${svg("learning", 20)}</span><span><small>Materials learned</small><b>${s.learned.length}<i>/${s.avail.length}</i></b></span></section>
          <section class="tile-card kpi"><span class="ms-ic c">${svg("quiz", 20)}</span><span><small>Quizzes passed</small><b>${s.passed.length}<i>/${s.quizzes.length}</i></b></span></section>
          <section class="tile-card kpi"><span class="ms-ic d">${svg("results", 20)}</span><span><small>Average score</small><b>${s.avg === null ? "—" : s.avg + "%"}</b></span></section>
          <section class="tile-card kpi"><span class="ms-ic b">${svg("clock", 20)}</span><span><small>Quiz attempts</small><b>${s.atts.length}</b></span></section>
        </div>

        <div class="two-col">
          <section class="tile-card"><h3>${svg("learning", 18)} Continue learning <button type="button" class="link-btn" data-goto="learning">View all</button></h3>${todoHtml}</section>
          ${goalsHtml(s)}
        </div>
      </div>

      <aside class="home-rail" aria-label="Your profile and results">
        <section class="profile-card">
          <div class="avatar">${esc(initials(p.name))}</div>
          <strong>${esc(p.name || "Your name")}</strong>
          <span>${esc(roleLabel(s.r))}${p.center ? " · " + esc(p.center) : ""}</span>
          <button type="button" class="btn ghost small" data-profile="edit">${svg("pencil", 14)} Edit profile</button>
        </section>
        <section class="rail-sec"><h3>Recent quiz results <button type="button" class="link-btn" data-goto="results">View all</button></h3>${recentHtml}</section>
        <section class="rail-sec"><h3>Progress by topic</h3>${topicHtml || '<p class="empty-note small">Nothing assigned yet.</p>'}</section>
        <p class="rail-note">Your progress is saved in this browser only.</p>
      </aside>
    </div></div>`;
  }

  /* ----------------------------- My Learning ----------------------------- */
  function learnRow(r, compact) {
    const st = Store.status(r.id), ready = hasContent(r), q = (typeof QUIZZES === "undefined" ? [] : QUIZZES).find(x => x.material === r.id && quizReady(x));
    const label = !ready ? "Coming soon" : { new: "Not started", started: "In progress", learned: "Learned" }[st];
    const icon = !ready ? "clock" : (st === "learned" ? "check" : (st === "started" ? "play" : TYPE_ICON[r.type] || "file"));
    const a = actionFor(r), ext = a.ext ? ' target="_blank" rel="noopener"' : (a.download ? " download" : "");
    const acts = ready ? `
      <a class="btn primary small" data-mid="${esc(r.id)}" href="${esc(a.href)}"${ext}>${st === "new" ? "Open" : "Open again"}</a>
      <button type="button" class="btn ghost small" data-learn="${esc(r.id)}">${st === "learned" ? "Undo" : "Mark learned"}</button>
      ${q && !compact ? `<a class="btn small" href="quiz.html?id=${esc(q.id)}">Quiz</a>` : ""}` : "";
    return `<div class="lrow ${ready ? st : "soon"}">
      <span class="lstat">${svg(icon, 18)}</span>
      <div class="lmain"><b>${esc(r.title)}</b><small>${esc((topicOf(r.topic) || {}).label || "")} · ${esc(TYPE_LABEL[r.type] || r.type)}${st === "learned" && Store.learnedAt(r.id) ? " · learned " + esc(day(Store.learnedAt(r.id))) : ""}</small></div>
      <span class="lchip ${ready ? st : "soon"}">${esc(label)}</span>
      <div class="lact">${acts}</div></div>`;
  }

  function learningHtml() {
    const s = stats();
    const statusOf = r => hasContent(r) ? Store.status(r.id) : "soon";
    const tabs = [["all", "All", s.req.length], ["new", "Not started", s.req.filter(r => statusOf(r) === "new").length],
      ["started", "In progress", s.req.filter(r => statusOf(r) === "started").length],
      ["learned", "Learned", s.req.filter(r => statusOf(r) === "learned").length],
      ["soon", "Coming soon", s.req.filter(r => statusOf(r) === "soon").length]];
    const items = s.req.filter(r => learnTab === "all" || statusOf(r) === learnTab)
      .sort((a, b) => (hasContent(b) - hasContent(a)));
    return `
      <div class="page-head head-row">
        <span class="head-ic" aria-hidden="true">${svg("learning", 26)}</span>
        <div class="head-txt"><h1>My Learning</h1><p>Everything assigned to ${esc(roleLabel(s.r))}. Open a material, then mark it as learned.</p></div>
        <span class="date-chip plain"><b>${s.learned.length}</b> of ${s.avail.length} learned</span>
      </div>
      <div class="tabs" role="tablist" aria-label="Filter by status">
        ${tabs.map(([id, l, n]) => `<button type="button" class="tab${learnTab === id ? " on" : ""}" data-ltab="${id}" role="tab" aria-selected="${learnTab === id}">${l}<span class="tab-n">${n}</span></button>`).join("")}
      </div>
      <div class="view-body"><div class="lrows">${items.length ? items.map(r => learnRow(r)).join("") : `<div class="state"><div class="big">🎉</div><div>Nothing here.</div></div>`}</div></div>`;
  }

  /* ----------------------------- Quizzes ----------------------------- */
  function quizzesHtml() {
    const s = stats(), list = quizzesFor(s.r);
    const cards = list.map(q => {
      const ready = quizReady(q), best = bestAttempt(q.id), n = Store.attempts().filter(a => a.quizId === q.id).length;
      const m = RESOURCES.find(x => x.id === q.material);
      const chip = !ready ? `<span class="lchip soon">Coming soon</span>` : best ? `<span class="lchip ${best.passed ? "learned" : "bad"}">${best.passed ? "Passed" : "Not passed yet"}</span>` : `<span class="lchip new">Not taken</span>`;
      return `<article class="card quiz-card${ready ? "" : " is-soon"}">
        <div class="card-top"><span class="card-ic">${svg("quiz", 18)}</span>${q.sample ? '<span class="type-tag">Sample</span>' : ""}${chip}</div>
        <h3>${esc(q.title)}</h3>
        <p>${esc(q.desc || "")}</p>
        <div class="card-foot"><span class="meta">${ready ? `${plural(q.questions.length, "question")} · pass at ${q.passScore}%` : "Waiting for questions"}${m ? " · " + esc(m.title) : ""}</span>
          ${best ? `<span class="best">Best <b>${best.score}%</b> · ${plural(n, "attempt")}</span>` : ""}</div>
        <div class="actions">${ready ? `<a class="btn primary" href="quiz.html?id=${esc(q.id)}">${best ? "Retake quiz" : "Start quiz"}</a>` : `<span class="soon-tag">Coming soon</span>`}</div>
      </article>`;
    }).join("");
    return `
      <div class="page-head head-row">
        <span class="head-ic" aria-hidden="true">${svg("quiz", 26)}</span>
        <div class="head-txt"><h1>Quizzes</h1><p>Check what you've learned. You can retake any quiz — your best score counts.</p></div>
        <span class="date-chip plain"><b>${s.passed.length}</b> of ${s.quizzes.length} passed</span>
      </div>
      <div class="view-body">${cards ? `<div class="grid">${cards}</div>` : `<div class="state"><div class="big">📝</div><div>No quizzes are assigned to ${esc(roleLabel(s.r))} yet.</div></div>`}</div>`;
  }

  /* ----------------------------- My Results ----------------------------- */
  function resultsHtml() {
    const s = stats(), atts = s.atts.slice().sort((a, b) => b.at.localeCompare(a.at));
    const best = atts.length ? Math.max(...atts.map(a => a.score)) : null;
    const rows = atts.map(a => `<tr>
      <td>${esc(day(a.at))}</td><td><b>${esc(a.quizTitle || "Quiz")}</b></td>
      <td><span class="score-pill ${a.passed ? "ok" : "bad"}">${a.score}%</span></td>
      <td>${a.correct}/${a.total}</td>
      <td><span class="lchip ${a.passed ? "learned" : "bad"}">${a.passed ? "Passed" : "Not passed"}</span></td>
      <td><a class="btn ghost small" href="quiz.html?review=${esc(a.id)}">Review</a></td></tr>`).join("");
    return `
      <div class="page-head head-row">
        <span class="head-ic" aria-hidden="true">${svg("results", 26)}</span>
        <div class="head-txt"><h1>My Results</h1><p>Your quiz history and scores.</p></div>
      </div>
      <div class="kpi-row slim">
        <section class="tile-card kpi"><span class="ms-ic a">${svg("quiz", 20)}</span><span><small>Attempts</small><b>${atts.length}</b></span></section>
        <section class="tile-card kpi"><span class="ms-ic c">${svg("check", 20)}</span><span><small>Quizzes passed</small><b>${s.passed.length}<i>/${s.quizzes.length}</i></b></span></section>
        <section class="tile-card kpi"><span class="ms-ic d">${svg("results", 20)}</span><span><small>Average score</small><b>${s.avg === null ? "—" : s.avg + "%"}</b></span></section>
        <section class="tile-card kpi"><span class="ms-ic b">${svg("trophy", 20)}</span><span><small>Best score</small><b>${best === null ? "—" : best + "%"}</b></span></section>
      </div>
      <div class="view-body">${atts.length ? `<div class="data-card"><table class="res-table"><thead><tr><th>Date</th><th>Quiz</th><th>Score</th><th>Correct</th><th>Result</th><th></th></tr></thead><tbody>${rows}</tbody></table></div>`
        : `<div class="state"><div class="big">📊</div><div>No quiz results yet.</div><div class="state-actions"><button type="button" class="btn primary small" data-goto="quizzes">Go to Quizzes</button></div></div>`}</div>`;
  }

  /* ----------------------------- Resources (links) ----------------------------- */
  function allLinks() {
    const seen = new Set(), out = [];
    const add = (l, origin) => {
      const key = String(l.url || "").trim().toLowerCase().replace(/\/+$/, "");
      if (!key || seen.has(key)) return;
      seen.add(key);
      out.push({ ...l, origin, category: (l.category || "").trim() || "Other" });
    };
    (typeof LINKS === "undefined" ? [] : LINKS).forEach(l => add(l, "built-in"));
    sheet.rows.forEach(l => add(l, "shared"));
    Store.links().forEach(l => add(l, "device"));
    return out;
  }

  function resourcesHtml() {
    const links = allLinks();
    const cats = ["All", ...[...new Set(links.map(l => l.category))].sort((a, b) => a.localeCompare(b))];
    if (!cats.includes(resCat)) resCat = "All";
    const configured = typeof LINKS_SHEET !== "undefined" && LINKS_SHEET.id;
    const sheetUrl = configured ? `https://docs.google.com/spreadsheets/d/${LINKS_SHEET.id}/edit#gid=${LINKS_SHEET.gid || 0}` : "";
    const status = !configured
      ? `The shared sheet isn't connected yet — links you add stay on this device. <button type="button" class="link-btn" data-res-help>How to share links with everyone</button>`
      : sheet.state === "loading" ? "Loading the shared sheet…"
      : sheet.state === "error" ? `Couldn't read the shared sheet (${esc(sheet.error)}). Showing the last saved links.`
      : sheet.state === "ok" ? `Shared sheet connected · ${plural(sheet.rows.length, "link")} · checked ${esc(sheet.at)}` : "";
    const shown = links.filter(l => resCat === "All" || l.category === resCat);
    const cards = shown.sort((a, b) => a.category.localeCompare(b.category) || a.title.localeCompare(b.title)).map(l => `
      <article class="card link-card" data-search="${esc((l.title + " " + (l.desc || "") + " " + l.category + " " + host(l.url)).toLowerCase())}">
        <div class="card-top"><span class="card-ic">${svg("link", 18)}</span><span class="badge academic mini">${esc(l.category)}</span>
          ${l.origin === "device" ? '<span class="soon-tag own">This device</span>' : ""}</div>
        <h3>${esc(l.title)}</h3>
        <p>${esc(l.desc || "")}</p>
        <div class="card-foot"><span class="meta">${esc(host(l.url))}</span>
          <div class="aud-row">${(l.audience || []).map(a => `<span class="aud-chip">${esc((audOf(a) || {}).label || a)}</span>`).join("")}</div></div>
        <div class="actions"><a class="btn primary" href="${esc(l.url)}" target="_blank" rel="noopener">${svg("external", 14)} Open link</a>
          ${l.origin === "device" ? `<button type="button" class="btn ghost" data-link-del="${esc(l.id)}">${svg("trash", 14)} Remove</button>` : ""}</div>
      </article>`).join("");
    return `
      <div class="page-head head-row">
        <span class="head-ic" aria-hidden="true">${svg("link", 26)}</span>
        <div class="head-txt"><h1>Resources</h1><p>Handy links for teaching and training. Add a link and it shows up here.</p></div>
        ${configured ? `<a class="btn ghost small" href="${esc(sheetUrl)}" target="_blank" rel="noopener">${svg("external", 14)} Open shared sheet</a>` : ""}
        <button type="button" class="btn primary" id="res-add">${svg("plus", 16)} Add link</button>
      </div>
      <div class="tabs" role="tablist" aria-label="Link categories">
        ${cats.map(c => `<button type="button" class="tab${resCat === c ? " on" : ""}" data-rcat="${esc(c)}" role="tab" aria-selected="${resCat === c}">${esc(c)}<span class="tab-n">${c === "All" ? links.length : links.filter(l => l.category === c).length}</span></button>`).join("")}
      </div>
      <div class="tools"><label class="res-filter">${svg("search", 16)}<input id="res-filter" type="search" placeholder="Filter links…" aria-label="Filter links" autocomplete="off"></label>
        <span class="spacer"></span><span class="res-status">${status}</span></div>
      <div id="res-help" class="help-box" hidden>
        <b>Share links with everyone — no server needed</b>
        <ol>
          <li>Create a Google Sheet and import <code>data/links-sheet-template.csv</code>. Set sharing to "Anyone with the link: Viewer".</li>
          <li>Paste the sheet ID and gid into <code>data/links.js</code> (<code>LINKS_SHEET</code>).</li>
          <li>From then on, anyone who can edit the sheet adds a row and the link appears here for every teacher.</li>
        </ol>
        <p>Until then, "Add link" saves the link on this device only. The success box offers a one-click <b>Copy row</b> to paste into the sheet later.</p>
      </div>
      <div class="view-body">${cards ? `<div class="grid">${cards}</div>` : `<div class="state"><div class="big">🔗</div><div>No links in this category yet.</div></div>`}</div>`;
  }

  /* Read the shared Google Sheet (matched by header NAME, so column order doesn't matter). */
  async function loadSheet(force) {
    if (typeof LINKS_SHEET === "undefined" || !LINKS_SHEET.id) return;
    if (sheet.state === "loading" || (sheet.state === "ok" && !force)) return;
    const cached = Store.cache("sheet:" + LINKS_SHEET.id);
    if (cached && sheet.state === "idle") sheet = { state: "loading", rows: cached.rows, at: cached.at, error: "" };
    else sheet.state = "loading";
    refreshResources();
    try {
      const url = `https://docs.google.com/spreadsheets/d/${encodeURIComponent(LINKS_SHEET.id)}/gviz/tq?tqx=out:json&headers=1&gid=${encodeURIComponent(LINKS_SHEET.gid || 0)}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error("HTTP " + res.status);
      const txt = await res.text();
      const json = JSON.parse(txt.slice(txt.indexOf("{"), txt.lastIndexOf("}") + 1));
      if (json.status === "error") throw new Error((json.errors && json.errors[0] && json.errors[0].message) || "sheet error");
      const cols = json.table.cols.map(c => String(c.label || "").trim().toLowerCase());
      const idx = name => cols.indexOf(name);
      const cell = (row, name) => { const i = idx(name); const c = i >= 0 ? row.c[i] : null; return c && c.v != null ? String(c.v).trim() : ""; };
      if (idx("title") < 0 || idx("url") < 0) throw new Error('the sheet needs "Title" and "URL" columns');
      const rows = json.table.rows.map(r => ({
        title: cell(r, "title"), url: cell(r, "url"), category: cell(r, "category"), desc: cell(r, "description"),
        audience: cell(r, "audience").split(/[,;]/).map(x => x.trim().toLowerCase()).filter(Boolean),
      })).filter(r => r.title && /^https?:\/\//i.test(r.url));
      const at = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      sheet = { state: "ok", rows, at, error: "" };
      Store.cache("sheet:" + LINKS_SHEET.id, { rows, at });
    } catch (e) {
      sheet = { ...sheet, state: "error", error: e.message || "network error" };
    }
    refreshResources();
  }
  function refreshResources() {
    const s = window.getHomeState && window.getHomeState();
    if (s && !s.q.trim() && s.cat === "all" && s.view === "resources" && window.rerender) window.rerender();
  }

  /* ----------------------------- modals ----------------------------- */
  function modal(html, opts) {
    closeModal();
    const o = document.createElement("div");
    o.className = "modal-back"; o.id = "hub-modal";
    if (opts && opts.locked) o.dataset.locked = "1";
    o.innerHTML = `<div class="modal" role="dialog" aria-modal="true">${html}</div>`;
    document.body.appendChild(o);
    if (!(opts && opts.locked)) {
      o.addEventListener("mousedown", e => { if (e.target === o) closeModal(); });
    }
    const f = o.querySelector("input,select,textarea");
    if (f) f.focus();
    return o;
  }
  function closeModal() { const m = document.getElementById("hub-modal"); if (m) m.remove(); }

  function profileModal(first) {
    const p = me() || {};
    modal(`
      <h2>${first ? "Welcome to the Training Hub" : "Edit profile"}</h2>
      <p class="m-sub">${first ? "Tell us who you are so we can show the materials and quizzes meant for you. This stays in your browser." : "Update how you appear on your dashboard."}</p>
      <form id="profile-form" autocomplete="off">
        <label>Your name<input name="name" type="text" maxlength="60" required value="${esc(p.name || "")}" placeholder="e.g. Agnes"></label>
        <label>Your role<select name="role" required>${ROLES.map(r => `<option value="${r.id}"${p.role === r.id ? " selected" : ""}>${esc(r.label)}</option>`).join("")}</select></label>
        <label>Center / branch <span class="opt">(optional)</span><input name="center" type="text" maxlength="60" value="${esc(p.center || "")}" placeholder="e.g. Makassar - Panakkukang"></label>
        <div class="m-actions">
          ${first ? "" : '<button type="button" class="btn ghost" data-modal-close>Cancel</button>'}
          <button type="submit" class="btn primary">${first ? "Get started" : "Save"}</button>
        </div>
        ${first ? "" : '<button type="button" class="link-btn danger" data-reset-progress>Reset all my progress on this device</button>'}
      </form>`, { locked: first });
  }

  function addLinkModal() {
    const cats = [...new Set(allLinks().map(l => l.category))];
    modal(`
      <h2>Add a link</h2>
      <p class="m-sub">It appears in Resources right away on this device. Share it with everyone by adding it to the shared sheet.</p>
      <form id="link-form" autocomplete="off">
        <label>Title<input name="title" type="text" maxlength="80" required placeholder="e.g. Placement test guide"></label>
        <label>Link (URL)<input name="url" type="text" required placeholder="https://…"></label>
        <label>Category<input name="category" type="text" maxlength="40" list="cat-list" placeholder="e.g. Training decks"><datalist id="cat-list">${cats.map(c => `<option value="${esc(c)}">`).join("")}</datalist></label>
        <label>Description <span class="opt">(optional)</span><input name="desc" type="text" maxlength="140"></label>
        <p class="m-err" id="link-err" hidden></p>
        <div class="m-actions"><button type="button" class="btn ghost" data-modal-close>Cancel</button><button type="submit" class="btn primary">Add link</button></div>
      </form>`);
  }
  function linkSavedModal(l) {
    const row = [l.title, l.url, l.category, l.desc || "", "", (me() || {}).name || ""].join("\t");
    modal(`
      <h2>Link added</h2>
      <p class="m-sub"><b>${esc(l.title)}</b> is now in Resources on this device.</p>
      <div class="help-box"><b>Want everyone to see it?</b>
        <p>Copy this row and paste it at the bottom of the shared Google Sheet. Columns: Title, URL, Category, Description, Audience, Added by.</p></div>
      <div class="m-actions"><button type="button" class="btn ghost" data-copy="${esc(row)}">${svg("copy", 14)} Copy row for the sheet</button><button type="button" class="btn primary" data-modal-close>Done</button></div>`);
  }

  /* ----------------------------- topbar profile chip ----------------------------- */
  function renderChip() {
    const el = document.getElementById("profile-chip");
    if (!el) return;
    const p = me();
    el.innerHTML = p ? `<span class="avatar sm">${esc(initials(p.name))}</span><span class="pc-tx"><b>${esc(firstName(p.name))}</b><small>${esc(roleLabel(p.role))}</small></span>` : `${svg("user", 18)}<span class="pc-tx"><b>Set up profile</b></span>`;
    el.onclick = () => profileModal(!p);
  }

  /* ----------------------------- events ----------------------------- */
  function bind() {
    document.addEventListener("click", e => {
      const t = e.target;
      let x;
      if ((x = t.closest("[data-learn]"))) { Store.setLearned(x.dataset.learn, Store.status(x.dataset.learn) !== "learned"); return window.rerender(); }
      if ((x = t.closest("[data-ltab]"))) { learnTab = x.dataset.ltab; return window.rerender(); }
      if ((x = t.closest("[data-rcat]"))) { resCat = x.dataset.rcat; return window.rerender(); }
      if ((x = t.closest("[data-goal-toggle]"))) { Store.toggleGoal(x.dataset.goalToggle); return window.rerender(); }
      if ((x = t.closest("[data-goal-del]"))) { Store.removeGoal(x.dataset.goalDel); return window.rerender(); }
      if ((x = t.closest("[data-link-del]"))) { if (confirm("Remove this link from this device?")) { Store.removeLink(x.dataset.linkDel); window.rerender(); } return; }
      if (t.closest("#res-add")) return addLinkModal();
      if (t.closest("[data-res-help]")) { const h = document.getElementById("res-help"); if (h) h.hidden = !h.hidden; return; }
      if ((x = t.closest("[data-profile]"))) return profileModal(false);
      if (t.closest("[data-modal-close]")) return closeModal();
      if ((x = t.closest("[data-copy]"))) {
        const txt = x.dataset.copy;
        (navigator.clipboard ? navigator.clipboard.writeText(txt) : Promise.reject()).then(() => { x.textContent = "Copied ✓"; }, () => { x.textContent = "Copy failed — select manually"; });
        return;
      }
      if (t.closest("[data-reset-progress]")) {
        if (confirm("This erases your profile, learned materials, quiz results, goals and links from this device. Continue?")) { Store.reset(); location.href = "index.html"; }
      }
    });
    document.addEventListener("submit", e => {
      const f = e.target;
      if (f.id === "goal-form") {
        e.preventDefault();
        const text = f.elements.text.value.trim();
        if (text) { Store.addGoal(text, f.elements.due.value); window.rerender(); }
      } else if (f.id === "profile-form") {
        e.preventDefault();
        Store.setProfile({ name: f.elements.name.value.trim(), role: f.elements.role.value, center: f.elements.center.value.trim() });
        closeModal(); renderChip(); window.rerender();
      } else if (f.id === "link-form") {
        e.preventDefault();
        let url = f.elements.url.value.trim();
        if (!/^https?:\/\//i.test(url)) url = "https://" + url;
        const err = document.getElementById("link-err");
        try { const u = new URL(url); if (!u.hostname.includes(".")) throw 0; } catch (x) { err.textContent = "That doesn't look like a valid link."; err.hidden = false; return; }
        const l = { title: f.elements.title.value.trim(), url, category: f.elements.category.value.trim() || "Other", desc: f.elements.desc.value.trim(), audience: [] };
        Store.addLink(l);
        resCat = "All";
        window.rerender();
        linkSavedModal(l);
      }
    });
    document.addEventListener("input", e => {
      if (e.target.id !== "res-filter") return;
      const q = e.target.value.trim().toLowerCase();
      document.querySelectorAll(".link-card").forEach(c => { c.hidden = !!q && !c.dataset.search.includes(q); });
    });
    document.addEventListener("keydown", e => {
      if (e.key !== "Escape") return;
      const m = document.getElementById("hub-modal");
      if (m && m.dataset.locked !== "1") closeModal();   // the first-run profile form can't be skipped
    });
  }

  /* ----------------------------- public API ----------------------------- */
  return {
    init() {
      bind(); renderChip();
      if (!me()) profileModal(true);
    },
    render(mode) {
      switch (mode) {
        case "learning":  return learningHtml();
        case "quizzes":   return quizzesHtml();
        case "results":   return resultsHtml();
        case "resources": return resourcesHtml();
        default:          return dashboardHtml();
      }
    },
    after(mode) { if (mode === "resources") loadSheet(false); },
    renderChip,
  };
})();
