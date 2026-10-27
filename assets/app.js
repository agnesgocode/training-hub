/* App logic — membangun tampilan dari data/resources.js.
   Tidak perlu diubah saat menambah materi. */

const TYPE_LABEL = {
  gslides: "Google Slides",
  gdrive:  "Google Drive",
  pdf:     "PDF",
  ppt:     "PowerPoint",
  link:    "Link",
  page:    "Halaman Web",
};

/* Cegah teks data merusak markup */
function esc(s) {
  return String(s || "").replace(/[&<>"']/g, c => (
    { "&":"&amp;", "<":"&lt;", ">":"&gt;", '"':"&quot;", "'":"&#39;" }[c]
  ));
}

/* Ubah URL Google Slides/Drive biasa menjadi URL yang bisa di-embed */
function toEmbedUrl(type, src) {
  if (!src) return "";
  if (type === "gslides") {
    const m = src.match(/presentation\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://docs.google.com/presentation/d/${m[1]}/embed?start=false&loop=false`;
  }
  if (type === "gdrive") {
    const m = src.match(/\/d\/([a-zA-Z0-9_-]+)/);
    if (m) return `https://drive.google.com/file/d/${m[1]}/preview`;
  }
  return src; // pdf / ppt lokal, atau fallback
}

function hasContent(r) {
  return r.type === "page" || !!(r.src && r.src.trim());
}

/* Bangun satu kartu materi */
function cardHtml(r) {
  const typeTag = `<span class="type-tag">${esc(TYPE_LABEL[r.type] || r.type)}</span>`;
  const meta = r.updated ? `<div class="meta">Terakhir diperbarui: ${esc(r.updated)}</div>` : "";
  const body = hasContent(r) ? "" :
    `<div class="pending">⏳ ${esc(r.placeholder || "Menunggu file dari pusat.")}</div>`;

  let actions = "";
  if (hasContent(r)) {
    if (r.type === "page") {
      actions += `<a class="btn primary" href="${esc(r.src)}.html">Buka materi</a>`;
    } else if (r.type === "link") {
      actions += `<a class="btn primary" href="${esc(r.src)}" target="_blank" rel="noopener">Buka di sumber</a>`;
    } else if (r.type === "ppt") {
      actions += `<a class="btn primary" href="${esc(r.src)}" download>Unduh PowerPoint</a>`;
    } else {
      actions += `<a class="btn primary" href="viewer.html?id=${encodeURIComponent(r.id)}">Buka materi</a>`;
    }
    if (Array.isArray(r.links)) {
      r.links.forEach(l => {
        actions += `<a class="btn ghost" href="${esc(l.url)}" target="_blank" rel="noopener">${esc(l.label)}</a>`;
      });
    }
  }

  return `
    <article class="card">
      ${typeTag}
      <h3>${esc(r.title)}</h3>
      <p>${esc(r.desc || "")}</p>
      ${body}
      ${meta}
      <div class="actions">${actions}</div>
    </article>`;
}

/* State render helper (R-27) */
function stateHtml(kind, msg) {
  const icon = kind === "error" ? "⚠️" : "🔍";
  return `<div class="state ${kind === "error" ? "error" : ""}">
            <div class="big">${icon}</div><div>${esc(msg)}</div>
          </div>`;
}

/* Render halaman utama, dikelompokkan per kategori. filter = kata pencarian */
function renderHome(containerId, filter) {
  const el = document.getElementById(containerId);
  if (!el) return;

  // Error state: data resource tidak termuat (R-27)
  if (typeof RESOURCES === "undefined" || !Array.isArray(RESOURCES)) {
    el.innerHTML = stateHtml("error", "Daftar materi gagal dimuat. Periksa file data/resources.js.");
    return;
  }

  const q = (filter || "").trim().toLowerCase();
  const match = r => !q ||
    (r.title && r.title.toLowerCase().includes(q)) ||
    (r.desc && r.desc.toLowerCase().includes(q));

  let html = "";
  let shown = 0;
  CATEGORIES.forEach(cat => {
    const items = RESOURCES.filter(r => r.category === cat.id && match(r));
    if (!items.length) return;
    shown += items.length;
    html += `<h2 class="section-title" id="${cat.id}">
               <span class="badge ${cat.id}">${esc(cat.label)}</span>
             </h2>
             <div class="grid">${items.map(cardHtml).join("")}</div>`;
  });

  // Empty state (R-27)
  if (!shown) {
    html = q
      ? stateHtml("empty", `Tidak ada materi yang cocok dengan "${q}".`)
      : stateHtml("empty", "Belum ada materi. Tambahkan lewat halaman Kelola Resource.");
  }
  el.innerHTML = html;
}

/* Sambungkan kotak pencarian ke filter (pencarian NYATA, R-26) */
function wireSearch(inputId, containerId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  input.addEventListener("input", () => renderHome(containerId, input.value));
}

/* Render viewer.html — menampilkan slide/PDF di dalam web */
function renderViewer() {
  const id = new URLSearchParams(location.search).get("id");
  const r = (typeof RESOURCES !== "undefined") ? RESOURCES.find(x => x.id === id) : null;
  const bar = document.getElementById("viewer-title");
  const frameWrap = document.getElementById("viewer-frame");
  const openExt = document.getElementById("open-external");

  if (!r || !hasContent(r)) {
    if (bar) bar.textContent = "Materi belum tersedia";
    if (openExt) openExt.style.display = "none";
    if (frameWrap) frameWrap.innerHTML = stateHtml("empty",
      "Materi ini belum diunggah. Hubungi admin atau lihat halaman Kelola Resource.");
    return;
  }
  if (bar) bar.textContent = r.title;
  const embed = toEmbedUrl(r.type, r.src);
  if (frameWrap) {
    frameWrap.innerHTML = stateHtml("empty", "Memuat materi…");
    const f = document.createElement("iframe");
    f.src = embed; f.setAttribute("allowfullscreen", "");
    f.setAttribute("title", r.title);
    f.onload = () => { frameWrap.innerHTML = ""; frameWrap.appendChild(f); };
    f.onerror = () => { frameWrap.innerHTML = stateHtml("error", "Materi gagal dimuat. Coba buka di tab baru."); };
    // fallback: kalau onload tak terpicu (mis. cross-origin), tetap tampilkan setelah jeda
    setTimeout(() => { if (!frameWrap.querySelector("iframe")) { frameWrap.innerHTML = ""; frameWrap.appendChild(f); } }, 1200);
  }
  if (openExt) {
    openExt.href = r.src;
    openExt.style.display = (r.type === "pdf" || r.type === "ppt") ? "none" : "inline-block";
  }
}
