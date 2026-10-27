/* Render EAC Sales Digging Guide di dalam web sendiri. Channel switcher berfungsi nyata. */

function sgEsc(s){ return String(s||"").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])); }

let SG_CURRENT = "walkin";

function pointHtml(p, ch) {
  const c = p.ch[ch] || {};
  const qLabel = p.promptLabel || "Example Questions";
  const dLabel = p.deeperLabel || "Dig Deeper";
  const questions = (c.questions || []).map(q => `<li>${sgEsc(q)}</li>`).join("");
  const resource = p.resource
    ? `<a class="sg-res" href="${sgEsc(p.resource.url)}" target="_blank" rel="noopener">🔗 ${sgEsc(p.resource.label)} — ${sgEsc(p.resource.note)}</a>`
    : "";
  const notes = p.notesTitle
    ? `<div class="sg-notes">
         <strong>${sgEsc(p.notesTitle)}</strong>
         <p>${sgEsc(p.notesSub)}</p>
         <textarea rows="4" placeholder="${sgEsc(p.notesPlaceholder)}"></textarea>
       </div>` : "";

  return `
  <details class="sg-point" id="point-${p.id}" ${p.id === "01" ? "open" : ""}>
    <summary><span class="sg-num">${sgEsc(p.id)}</span> <span class="sg-head">${sgEsc(p.headline)}</span></summary>
    <div class="sg-body">
      <div class="sg-field"><h4>What Do We Need To Know?</h4><p>${sgEsc(p.need)}</p></div>
      <div class="sg-field"><h4>Why Does It Matter?</h4><p>${sgEsc(p.why)}</p></div>
      <div class="sg-field sg-strategy"><h4>Strategy</h4><p>${sgEsc(c.strategy)}</p></div>
      <div class="sg-field"><h4>${sgEsc(qLabel)}</h4><ol>${questions}</ol></div>
      <div class="sg-field sg-deeper"><h4>${sgEsc(dLabel)}</h4><p>${sgEsc(c.deeper)}</p></div>
      <div class="sg-two">
        <div class="sg-field sg-listen"><h4>Listen For</h4><p>${sgEsc(p.signals)}</p></div>
        <div class="sg-field sg-avoid"><h4>Don't Do This</h4><p>${sgEsc(p.avoid)}</p></div>
      </div>
      ${resource}
      ${notes}
    </div>
  </details>`;
}

function renderPoints() {
  const el = document.getElementById("sg-points");
  if (el) el.innerHTML = SG_POINTS.map(p => pointHtml(p, SG_CURRENT)).join("");
}

function setChannel(id) {
  SG_CURRENT = id;
  const ch = SG_CHANNELS.find(c => c.id === id);
  document.getElementById("sg-active-label").textContent = ch ? ch.label : "";
  document.querySelectorAll(".sg-channel-btns button").forEach(b => {
    const on = b.dataset.ch === id;
    b.classList.toggle("active", on);
    b.setAttribute("aria-selected", on ? "true" : "false");
  });
  renderPoints();
}

function renderSalesGuide() {
  if (typeof SG_POINTS === "undefined") {
    document.getElementById("sg-points").innerHTML =
      `<div class="state error"><div class="big">⚠️</div>Sales guide content failed to load (data/sales-guide-data.js).</div>`;
    return;
  }
  document.getElementById("sg-eyebrow").textContent = SG_INTRO.eyebrow;
  document.getElementById("sg-title").textContent = SG_INTRO.title;
  document.getElementById("sg-desc").textContent = SG_INTRO.desc;
  document.getElementById("sg-flow").textContent = SG_INTRO.flow;
  document.getElementById("sg-principle").textContent = SG_INTRO.principle;
  document.getElementById("sg-reminder").textContent = SG_REMINDER;
  document.getElementById("sg-footer").textContent = SG_FOOTER;

  // channel buttons
  document.getElementById("sg-channels").innerHTML = SG_CHANNELS.map(c =>
    `<button type="button" role="tab" data-ch="${c.id}">${sgEsc(c.label)}</button>`
  ).join("");
  document.querySelectorAll(".sg-channel-btns button").forEach(b => {
    b.addEventListener("click", () => setChannel(b.dataset.ch));
  });

  // tools
  document.getElementById("sg-tools").innerHTML = SG_TOOLS.map(t => `
    <article class="card">
      <span class="type-tag">Sales Tool</span>
      <h3>${sgEsc(t.name)}</h3>
      <p>${sgEsc(t.desc)}</p>
      <div class="actions">
        <a class="btn primary" href="${sgEsc(t.url)}" ${t.internal ? "" : 'target="_blank" rel="noopener"'}>
          ${t.internal ? "Open in this web" : "Open at source"}
        </a>
      </div>
    </article>`).join("");

  setChannel(SG_CURRENT);
}
