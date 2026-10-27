/* Academic Assistant — a chat that answers from the EAC training materials.

   How it works:
     1. Sources (PDF/PPTX/MD) are turned into text chunks: `npm run knowledge`
        -> data/knowledge.js (loaded the first time the assistant is opened).
     2. For every question the browser finds the most relevant chunks.
     3. Those chunks + the question go to an AI server (Supabase Edge Function,
        see supabase/README.md). The AI may ONLY answer from those chunks and
        must cite them as [1], [2].
     4. If the AI server is not set up or fails, the assistant shows quotes from
        the most relevant materials (it does not compose an answer by itself).

   Loaded after data/resources.js, assets/app.js and assets/shell.js. */

const ASSISTANT_CONFIG = {
  /* URL of the AI server, e.g. "https://<project>.supabase.co/functions/v1/ask".
     Empty = search mode (no AI). The LLM API key must NEVER be put here —
     keep it on the server. */
  endpoint: "",
  /* Optional: Supabase publishable/anon key (safe to publish), sent as the
     Authorization header when set. */
  key: "",
  topK: 8,            // number of material chunks sent to the AI (the server accepts at most 8)
  historyTurns: 6,    // number of recent messages sent as context
  timeoutMs: 45000,
};

(function () {
  const STORE = "hub.chat";
  let root, panel, fab, log, input, sendBtn, modeEl;
  let busy = false, wide = false;
  let transcript = [];          // [{role:"user"|"bot", text, sources:[{n,title,loc,url}]}]
  let kbPromise = null, index = null;

  /* =============================== KNOWLEDGE =============================== */
  function loadKnowledge() {
    if (kbPromise) return kbPromise;
    kbPromise = new Promise(resolve => {
      if (typeof KNOWLEDGE !== "undefined") return resolve(KNOWLEDGE);
      const s = document.createElement("script");
      s.src = "data/knowledge.js?v=" + Date.now();
      s.onload = () => resolve(typeof KNOWLEDGE !== "undefined" ? KNOWLEDGE : null);
      s.onerror = () => resolve(null);
      document.head.appendChild(s);
    }).then(kb => { index = kb ? buildIndex(kb) : null; return kb; });
    return kbPromise;
  }

  /* Light English stemmer, applied to documents AND questions so
     "digging", "dig" and "digs" meet at the same root. */
  function stem(w) {
    if (w.length < 4) return w;
    let s = w;
    if (/ies$/.test(s) && s.length > 4) s = s.slice(0, -3) + "y";
    else if (/(ing|ed)$/.test(s) && s.length > 5) {
      s = s.replace(/(ing|ed)$/, "");
      if (/([^aeiou])\1$/.test(s)) s = s.slice(0, -1);
    } else if (/s$/.test(s) && !/(ss|us|is)$/.test(s)) s = s.slice(0, -1);
    return s;
  }
  function tok(s) {
    return String(s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/).filter(w => w.length >= 2 && !STOPWORDS.has(w)).map(stem);
  }

  /* Simple BM25 index in the browser — plenty for hundreds of chunks.
     The source title is NOT mixed into every chunk (it would drown out the
     words that tell chunks apart); it only gives a small bonus below. */
  function buildIndex(kb) {
    const docs = kb.chunks.map(c => {
      const terms = tok(c.loc + " " + c.text);
      const tf = new Map();
      terms.forEach(t => tf.set(t, (tf.get(t) || 0) + 1));
      return { c, tf, len: terms.length || 1 };
    });
    const df = new Map();
    docs.forEach(d => d.tf.forEach((_, t) => df.set(t, (df.get(t) || 0) + 1)));
    const avg = docs.reduce((a, d) => a + d.len, 0) / (docs.length || 1);
    const titles = kb.sources.map(s => new Set(tok(s.title)));
    return { kb, docs, df, avg, titles, vocab: [...df.keys()] };
  }

  function search(query, k) {
    if (!index) return [];
    const { docs, df, avg, vocab, titles } = index, N = docs.length;
    const weights = new Map();                 // term -> weight
    const qTerms = new Set(tok(query));
    qTerms.forEach(t => {
      weights.set(t, Math.max(weights.get(t) || 0, 1));
      if (t.length >= 4) vocab.filter(v => v !== t && v.startsWith(t)).slice(0, 5)
        .forEach(v => weights.set(v, Math.max(weights.get(v) || 0, 0.5)));
    });
    if (!weights.size) return [];
    const k1 = 1.4, b = 0.75;
    const scored = docs.map(d => {
      let score = 0;
      weights.forEach((w, t) => {
        const f = d.tf.get(t);
        if (!f) return;
        const idf = Math.log(1 + (N - df.get(t) + 0.5) / (df.get(t) + 0.5));
        score += w * idf * (f * (k1 + 1)) / (f + k1 * (1 - b + b * d.len / avg));
      });
      if (score > 0) qTerms.forEach(t => { if (titles[d.c.s].has(t)) score += 0.4; });
      return { c: d.c, score };
    }).filter(x => x.score > 0).sort((a, b2) => b2.score - a.score);
    if (!scored.length) return [];
    const cut = scored[0].score * 0.3;         // drop chunks far weaker than the best
    return scored.filter(x => x.score >= cut).slice(0, k).map(x => x.c);
  }

  function sourceOf(c) {
    const s = index.kb.sources[c.s];
    let url = "";
    if (s.res && typeof RESOURCES !== "undefined") {
      const r = RESOURCES.find(x => x.id === s.res);
      if (r && hasContent(r)) url = actionFor(r).href;
    }
    return { title: s.title, loc: c.loc, url };
  }

  /* =============================== UI =============================== */
  function md(src) {
    const inline = t => t
      .replace(/\*\*(.+?)\*\*/g, "<b>$1</b>")
      .replace(/`([^`]+)`/g, "<code>$1</code>")
      .replace(/\[(\d{1,2})\]/g, '<sup class="cite" data-cite="$1">$1</sup>');
    const out = []; let list = null;
    const close = () => { if (list) { out.push(`</${list}>`); list = null; } };
    esc(src).split("\n").forEach(line => {
      let m;
      if ((m = line.match(/^\s*[-*•]\s+(.*)/))) {
        if (list !== "ul") { close(); out.push("<ul>"); list = "ul"; }
        out.push(`<li>${inline(m[1])}</li>`);
      } else if ((m = line.match(/^\s*\d+[.)]\s+(.*)/))) {
        if (list !== "ol") { close(); out.push("<ol>"); list = "ol"; }
        out.push(`<li>${inline(m[1])}</li>`);
      } else if (!line.trim()) {
        close();
      } else {
        close();
        const h = line.match(/^#{1,4}\s+(.*)/);
        out.push(`<p>${inline(h ? `**${h[1]}**` : line)}</p>`);
      }
    });
    close();
    return out.join("");
  }

  const linkAttrs = url => /^https?:/.test(url) ? ' target="_blank" rel="noopener"' : "";

  function sourcesHtml(list) {
    if (!list || !list.length) return "";
    return `<div class="as-src"><span class="as-src-l">Sources</span>` + list.map(s => {
      const label = `<b>[${s.n}]</b> ${esc(s.title)}<small> · ${esc(s.loc)}</small>`;
      return s.url ? `<a class="as-chip" href="${esc(s.url)}"${linkAttrs(s.url)}>${label}</a>`
                   : `<span class="as-chip">${label}</span>`;
    }).join("") + `</div>`;
  }

  function addMsg(role, html, extra) {
    const d = document.createElement("div");
    d.className = "as-msg " + role + (extra ? " " + extra : "");
    d.innerHTML = html;
    log.appendChild(d);
    log.scrollTop = log.scrollHeight;
    return d;
  }

  function renderBot(m) { return `<div class="as-text">${md(m.text)}</div>${sourcesHtml(m.sources)}`; }

  function save() { try { sessionStorage.setItem(STORE, JSON.stringify(transcript.slice(-40))); } catch (e) {} }
  function restore() {
    try { transcript = JSON.parse(sessionStorage.getItem(STORE) || "[]"); } catch (e) { transcript = []; }
  }

  function welcome() {
    const kb = typeof KNOWLEDGE !== "undefined" ? KNOWLEDGE : null;
    const ideas = kb && kb.sources.length
      ? kb.sources.slice(0, 3).map(s => `Summarize "${s.title}"`)
      : [];
    ideas.push("What can you help me with?");
    const noAi = !ASSISTANT_CONFIG.endpoint;
    addMsg("bot", `<div class="as-text"><p>Hi! I'm the EAC Academic Assistant. Ask me anything about the training materials — I answer
      <b>only from what is in the Training Hub</b> and tell you which source I used.</p>
      ${kb ? `<p class="as-note">What I know right now: ${kb.sources.length} ${kb.sources.length === 1 ? "material" : "materials"} (${kb.chunks.length} passages), updated ${esc(kb.built)}.</p>`
           : `<p class="as-note">I haven't read any materials yet. Run <code>npm run knowledge</code> after putting files in the <code>knowledge/</code> folder.</p>`}
      ${noAi ? `<p class="as-note">⚠️ Right now I'm in <b>search mode</b>: I show the most relevant quotes. Chat-style answers switch on once the assistant is connected to the AI server.</p>` : ""}
      </div><div class="as-sugg">${ideas.map(s => `<button type="button" data-q="${esc(s)}">${esc(s)}</button>`).join("")}</div>`, "welcome");
  }

  function paint() {
    log.innerHTML = "";
    welcome();
    transcript.forEach(m => addMsg(m.role, m.role === "user" ? `<div class="as-text"><p>${esc(m.text)}</p></div>` : renderBot(m)));
    log.scrollTop = log.scrollHeight;
  }

  function setMode() {
    if (!modeEl) return;
    const ai = !!ASSISTANT_CONFIG.endpoint;
    modeEl.textContent = ai ? "AI on" : "Search mode";
    modeEl.className = "as-mode " + (ai ? "ai" : "search");
    modeEl.title = ai ? "Answers are composed by AI from the training materials"
                      : "Not connected to the AI server yet — showing quotes from the materials";
  }

  function build() {
    root = document.createElement("div");
    root.className = "assistant no-print";
    root.innerHTML = `
      <button type="button" class="assistant-fab" id="as-fab" aria-expanded="false" aria-controls="as-panel">
        <span aria-hidden="true">✦</span> Ask the Assistant
      </button>
      <section class="assistant-panel" id="as-panel" role="dialog" aria-label="Academic Assistant" hidden>
        <header class="as-head">
          <div class="as-title"><strong>Academic Assistant</strong><span id="as-mode" class="as-mode"></span></div>
          <div class="as-tools">
            <button type="button" id="as-new" title="Start a new conversation" aria-label="New conversation">New</button>
            <button type="button" id="as-wide" title="Enlarge" aria-label="Enlarge or shrink">⤢</button>
            <button type="button" id="as-close" title="Close" aria-label="Close assistant">✕</button>
          </div>
        </header>
        <div class="as-log" id="as-log" aria-live="polite"></div>
        <form class="as-form" id="as-form" autocomplete="off">
          <textarea id="as-input" rows="1" maxlength="600" placeholder="Ask something about the training materials…" aria-label="Question for the assistant"></textarea>
          <button type="submit" class="as-send" id="as-send" aria-label="Send">➤</button>
        </form>
        <div class="as-foot">Answers come from the EAC training materials. For anything important, double-check the original material.</div>
      </section>`;
    document.body.appendChild(root);
    panel = root.querySelector("#as-panel"); fab = root.querySelector("#as-fab");
    log = root.querySelector("#as-log"); input = root.querySelector("#as-input");
    sendBtn = root.querySelector("#as-send"); modeEl = root.querySelector("#as-mode");
    setMode();

    fab.addEventListener("click", () => (panel.hidden ? open() : close()));
    root.querySelector("#as-close").addEventListener("click", close);
    root.querySelector("#as-new").addEventListener("click", () => { transcript = []; save(); paint(); input.focus(); });
    root.querySelector("#as-wide").addEventListener("click", () => {
      wide = !wide; panel.classList.toggle("wide", wide);
    });
    root.querySelector("#as-form").addEventListener("submit", ev => { ev.preventDefault(); submit(); });
    input.addEventListener("keydown", ev => {
      if (ev.key === "Enter" && !ev.shiftKey && !ev.isComposing) { ev.preventDefault(); submit(); }
    });
    input.addEventListener("input", () => { input.style.height = "auto"; input.style.height = Math.min(input.scrollHeight, 120) + "px"; });
    root.addEventListener("click", ev => {
      const b = ev.target.closest("[data-q]");
      if (b) return ask(b.dataset.q);
      const c = ev.target.closest(".cite");
      if (c) {
        const msg = c.closest(".as-msg"), chip = msg && [...msg.querySelectorAll(".as-chip")].find(x => x.textContent.trim().startsWith(`[${c.dataset.cite}]`));
        if (chip) { chip.classList.add("flash"); setTimeout(() => chip.classList.remove("flash"), 1200); }
      }
    });
    document.addEventListener("keydown", ev => { if (ev.key === "Escape" && !panel.hidden) close(); });
  }

  function submit() {
    const q = input.value.trim();
    if (!q || busy) return;
    input.value = ""; input.style.height = "auto";
    ask(q);
  }

  /* =============================== QUESTIONS =============================== */
  const SMALLTALK = /^(hi|hello|hey|good (morning|afternoon|evening)|thanks|thank you|thx)\b/i;

  function quoteHtml(c) {
    const s = sourceOf(c);
    const t = c.text.length > 360 ? c.text.slice(0, 360).replace(/\s+\S*$/, "") + "…" : c.text;
    return `<blockquote class="as-quote"><div class="as-quote-h">${esc(s.title)} · ${esc(s.loc)}</div>${esc(t).replace(/\n/g, "<br>")}</blockquote>`;
  }

  async function callAI(question, passages) {
    const history = transcript.slice(0, -1).slice(-ASSISTANT_CONFIG.historyTurns)
      .map(m => ({ role: m.role === "user" ? "user" : "assistant", content: m.text.slice(0, 1500) }));
    const ctl = new AbortController();
    const timer = setTimeout(() => ctl.abort(), ASSISTANT_CONFIG.timeoutMs);
    try {
      const headers = { "Content-Type": "application/json" };
      if (ASSISTANT_CONFIG.key) headers.Authorization = "Bearer " + ASSISTANT_CONFIG.key;
      const res = await fetch(ASSISTANT_CONFIG.endpoint, {
        method: "POST", headers, signal: ctl.signal,
        body: JSON.stringify({
          question, history,
          passages: passages.map((c, i) => { const s = sourceOf(c); return { n: i + 1, title: s.title, loc: s.loc, text: c.text }; }),
        }),
      });
      if (!res.ok) throw new Error("HTTP " + res.status);
      const data = await res.json();
      const answer = String(data.answer || "").trim();
      if (!answer) throw new Error("empty answer");
      return answer;
    } finally { clearTimeout(timer); }
  }

  async function ask(q) {
    if (busy) return;
    busy = true; sendBtn.disabled = true;
    transcript.push({ role: "user", text: q });
    addMsg("user", `<div class="as-text"><p>${esc(q)}</p></div>`);
    const wait = addMsg("bot", `<span class="as-typing" aria-label="Typing"><i></i><i></i><i></i></span>`);
    let bot;
    try {
      await loadKnowledge();
      if (!index) {
        bot = { role: "bot", text: "I don't have any materials to read yet. Ask an admin to run `npm run knowledge` after putting files in the `knowledge/` folder.", sources: [] };
      } else if (SMALLTALK.test(q) && tok(q).length <= 2) {
        bot = { role: "bot", text: "You're welcome! Ask me anything about the EAC training materials.", sources: [] };
      } else {
        // a short follow-up ("what about staff?") is combined with the previous question
        const prev = transcript.slice(0, -1).reverse().find(m => m.role === "user");
        const query = tok(q).length < 3 && prev ? prev.text + " " + q : q;
        const found = search(query, ASSISTANT_CONFIG.topK);
        if (!found.length) {
          bot = { role: "bot", text: "I couldn't find that in the materials, so I won't guess. Try different keywords, or contact the Academic Operations team.", sources: [] };
        } else if (ASSISTANT_CONFIG.endpoint) {
          try {
            const answer = await callAI(q, found);
            const cited = new Set([...answer.matchAll(/\[(\d{1,2})\]/g)].map(m => +m[1]));
            let list = found.map((c, i) => ({ n: i + 1, ...sourceOf(c) }));
            list = cited.size ? list.filter(s => cited.has(s.n)) : list.slice(0, 3);
            bot = { role: "bot", text: answer, sources: list };
          } catch (err) {
            console.warn("AI assistant failed:", err);
            bot = { role: "bot", text: "The AI server can't be reached right now, so here are the most relevant quotes from the materials:", sources: [], quotes: found.slice(0, 3) };
          }
        } else {
          bot = { role: "bot", text: "Here are the passages that best match your question:", sources: [], quotes: found.slice(0, 3) };
        }
      }
    } catch (err) {
      console.error(err);
      bot = { role: "bot", text: "Sorry, something went wrong while handling your question. Please try again in a moment.", sources: [] };
    }
    let html = renderBot(bot);
    if (bot.quotes) {
      html += bot.quotes.map(c => {
        const s = sourceOf(c);
        return quoteHtml(c) + (s.url ? `<a class="btn primary small as-open" href="${esc(s.url)}"${linkAttrs(s.url)}>Open material</a>` : "");
      }).join("");
    }
    wait.innerHTML = html;
    transcript.push({ role: "bot", text: bot.text, sources: bot.sources || [] });
    save();
    busy = false; sendBtn.disabled = false;
    log.scrollTop = log.scrollHeight;
    input.focus();
  }

  function open(prefill) {
    if (!root) build();
    restore();
    panel.hidden = false;
    fab.setAttribute("aria-expanded", "true");
    root.classList.add("is-open");
    if (!log.childElementCount) {
      // wait for the knowledge to load so the welcome and the answer don't overwrite each other
      loadKnowledge().then(() => { paint(); if (prefill) ask(prefill); else input.focus(); });
    } else if (prefill) ask(prefill);
    else input.focus();
  }
  function close() {
    panel.hidden = true;
    fab.setAttribute("aria-expanded", "false");
    root.classList.remove("is-open");
    fab.focus();
  }

  window.HubAssistant = { open, close };
  document.addEventListener("DOMContentLoaded", () => { if (!root) build(); });
})();
