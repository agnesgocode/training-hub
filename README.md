# Training Hub

Website training statis (HTML/CSS/JS) — tanpa server, siap dipasang di **GitHub Pages**.

## Struktur
- `index.html` — beranda, menampilkan semua materi per kategori (Marketing / Akademik / Administration).
- `viewer.html` — menampilkan slide/PDF di dalam web.
- `diagnostic.html` — Diagnostic Sheet yang bisa diisi & di-print.
- `resources.html` — halaman **Kelola Resource** (status tiap materi + panduan update).
- `data/resources.js` — **PUSAT DATA**. Hanya file ini yang perlu diubah saat ada materi baru / update.
- `files/` — tempat menaruh file PDF / PPT.
- `assets/` — style & logika (tidak perlu disentuh).

## Cara update materi (tanpa coding)
Buka `data/resources.js`, temukan materinya, lalu:
- **Link / Google Slides / Drive** → tempel URL pada `src`. Set di Google: *Anyone with the link can view*.
- **File PDF/PPT** → taruh file di `files/`, isi `src` (contoh `files/payroll-mt.pdf`) dan `type` (`"pdf"` / `"ppt"`).
- Isi `updated` dengan tanggal.

## Cara pasang di GitHub Pages
1. Buat repository baru di GitHub, upload semua isi folder ini.
2. Buka **Settings → Pages**.
3. Bagian *Source*: pilih branch `main`, folder `/ (root)`, lalu **Save**.
4. Tunggu 1–2 menit, GitHub memberi URL publik (mis. `https://namaanda.github.io/training-hub/`).
