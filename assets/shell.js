/* Shared shell: the sidebar. (The Academic Assistant lives in assets/assistant.js.)
   Loaded on every page after data/resources.js and assets/app.js.
   A page only needs <aside class="sidebar" id="sidebar"></aside>. */

/* =============================== SIDEBAR =============================== */
function currentPageInfo() {
  const file = (location.pathname.split("/").pop() || "index.html").toLowerCase();
  let category = null, view = null, page = file;
  if (file === "index.html" || file === "") {
    const s = typeof window.getHomeState === "function" ? window.getHomeState() : null;
    const searching = s && s.q && s.q.trim();
    category = s ? (searching ? null : s.cat) : (new URLSearchParams(location.search).get("cat") || "all");
    view = s ? (searching || s.cat !== "all" ? null : s.view) : (new URLSearchParams(location.search).get("view") || "dashboard");
    page = "home";
  } else if (file === "quiz.html") {
    view = "quizzes";
  } else if (file === "viewer.html") {
    const id = new URLSearchParams(location.search).get("id");
    const r = dataReady() ? RESOURCES.find(x => x.id === id) : null;
    category = r ? r.category : null;
  } else if (dataReady()) {
    const r = RESOURCES.find(x => x.type === "page" && (x.src + ".html").toLowerCase() === file);
    category = r ? r.category : null;
  }
  return { file, page, category, view };
}

/* The sidebar can be folded down to icons only (the choice is remembered in the browser). */
function navCollapsed() { try { return localStorage.getItem("hub.nav") === "1"; } catch (e) { return false; } }
function setNavCollapsed(v) { try { localStorage.setItem("hub.nav", v ? "1" : "0"); } catch (e) {} }

function renderSidebar() {
  const el = document.getElementById("sidebar");
  if (!el) return;
  let body;
  try { body = sidebarBody(); }
  catch (err) {
    // Never leave the menu empty: show a basic menu if something goes wrong.
    console.error("Sidebar:", err);
    body = fallbackNav();
  }
  const collapsed = navCollapsed();
  el.classList.toggle("collapsed", collapsed);
  el.innerHTML = `
    <div class="side-top">
      <a class="brand" href="index.html" title="Training Hub — Home">
        <img class="brand-mark" src="assets/logo-ea.png" alt="English Academy Center">
        <span class="brand-name">Training Hub<small>English Academy Center</small></span>
      </a>
      <button type="button" class="side-toggle" id="side-toggle" aria-expanded="${!collapsed}"
              aria-label="${collapsed ? "Expand menu" : "Collapse menu"}" title="${collapsed ? "Expand menu" : "Collapse menu"}">
        <span aria-hidden="true">${collapsed ? "»" : "«"}</span>
      </button>
    </div>
    <nav aria-label="Main menu">${body}</nav>
    <div class="side-foot">EAC internal Training Hub</div>`;
}

function fallbackNav() {
  const l = (href, label) =>
    `<a class="side-link" href="${href}" title="${label}"><span class="side-label">${label}</span></a>`;
  return l("index.html", "Dashboard") + l("index.html?view=learning", "My Learning") + l("index.html?view=quizzes", "Quizzes") +
    l("index.html?view=results", "My Results") + l("index.html?cat=academic", "Academic") +
    l("index.html?cat=marketing", "Marketing") + l("index.html?cat=administration", "Administration") +
    l("index.html?view=resources", "Resources") + l("diagnostic.html", "Diagnostic Sheet") + l("resources.html", "Manage Materials");
}

function sidebarBody() {
  const info = currentPageInfo();
  const s = typeof window.getHomeState === "function" ? window.getHomeState() : { topic: "all" };
  const item = (href, icon, label, active, extra, count) =>
    `<a class="side-link${active ? " active" : ""}" href="${esc(href)}" title="${esc(label)}"${extra || ""}>
       <span class="ic">${svg(icon, 20)}</span><span class="side-label">${esc(label)}</span>${count != null ? `<span class="side-n">${count}</span>` : ""}</a>`;
  const viewItem = (view, icon, label) =>
    item(view === "dashboard" ? "index.html" : `index.html?view=${view}`, icon, label, info.view === view,
         ` data-nav="${view === "dashboard" ? "" : "view=" + view}"`);

  let cats = "";
  if (dataReady()) {
    cats = CATEGORIES.map(c => {
      const n = RESOURCES.filter(r => r.category === c.id).length;
      const isActive = info.category === c.id;
      let html = item(`index.html?cat=${c.id}`, c.id, c.label, isActive, ` data-nav="cat=${esc(c.id)}"`, n);
      if (isActive) {
        html += `<div class="side-sub">` + TOPICS.filter(t => t.category === c.id).map(t => {
          const tn = RESOURCES.filter(r => r.topic === t.id).length;
          const on = info.page === "home" && s.topic === t.id;
          return `<a class="side-sublink${on ? " active" : ""}" href="index.html?cat=${esc(c.id)}&topic=${esc(t.id)}"
                    data-nav="cat=${esc(c.id)}&topic=${esc(t.id)}">${esc(t.label)}<span class="side-n">${tn}</span></a>`;
        }).join("") + `</div>`;
      }
      return html;
    }).join("");
  }

  return `
    <div class="side-group"><span>My space</span></div>
    ${viewItem("dashboard", "home", "Dashboard")}
    ${viewItem("learning", "learning", "My Learning")}
    ${viewItem("quizzes", "quiz", "Quizzes")}
    ${viewItem("results", "results", "My Results")}
    <div class="side-group"><span>Library</span></div>
    ${cats}
    ${viewItem("resources", "link", "Resources")}
    <div class="side-group"><span>Tools</span></div>
    ${FEATURES.assistant ? `<button type="button" class="side-link side-btn" data-assistant="1" title="Academic Assistant">
      <span class="ic">${svg("assistant", 20)}</span><span class="side-label">Academic Assistant</span></button>` : ""}
    ${item("diagnostic.html", "diagnostic", "Diagnostic Sheet", info.file === "diagnostic.html")}
    ${item("resources.html", "settings", "Manage Materials", info.file === "resources.html")}`;
}

document.addEventListener("click", e => {
  if (e.target.closest("#side-toggle")) {
    setNavCollapsed(!navCollapsed());
    renderSidebar();
    const b = document.getElementById("side-toggle");
    if (b) b.focus();
    return;
  }
  const a = e.target.closest("[data-nav]");
  if (a && typeof window.hubNavigate === "function" && !e.metaKey && !e.ctrlKey && !e.shiftKey) {
    e.preventDefault();
    window.hubNavigate(a.getAttribute("data-nav"));
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }
  if (FEATURES.assistant && window.HubAssistant && e.target.closest("[data-assistant]")) window.HubAssistant.open();
});

document.addEventListener("DOMContentLoaded", renderSidebar);
