#!/usr/bin/env python3
"""Build the Academic Assistant knowledge base from the knowledge/ folder.

How to use:
  1. Put sources in the knowledge/ folder  (.pdf  .pptx  .md  .txt)
     Name each file THE SAME as the material id in data/resources.js
     (e.g. smartapp-teachers.pdf) so the assistant's answers can link
     to that material. Other names still work, just without a link.
  2. Run:  npm run knowledge
  3. The result is data/knowledge.js (loaded by the assistant when opened).

Uses only Python's standard library, except PDFs which need `pypdf`
(pip install pypdf) or the `pdftotext` command.
"""
import datetime
import json
import os
import re
import shutil
import subprocess
import sys
import zipfile
from html import unescape

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC_DIR = os.path.join(ROOT, "knowledge")
OUT = os.path.join(ROOT, "data", "knowledge.js")
CHUNK_MAX = 1100   # characters per chunk
CHUNK_MIN = 250    # shorter chunks are merged with their neighbors


def load_resources():
    """Get {id: title} from data/resources.js via node (if available)."""
    if not shutil.which("node"):
        return {}
    js = (
        "const fs=require('fs'),vm=require('vm');const c={};vm.createContext(c);"
        "vm.runInContext(fs.readFileSync('data/resources.js','utf8')+';this.R=RESOURCES;',c);"
        "console.log(JSON.stringify(c.R.map(r=>({id:r.id,title:r.title}))));"
    )
    try:
        out = subprocess.run(["node", "-e", js], cwd=ROOT, capture_output=True, text=True, timeout=20, check=True).stdout
        return {r["id"]: r["title"] for r in json.loads(out)}
    except Exception as e:  # noqa: BLE001
        print(f"  ! couldn't read resources.js ({e}); skipping material links")
        return {}


# ---------- Extraction: each function returns [(label, text), ...] ----------
def read_pdf(path):
    pages = []
    try:
        import pypdf  # type: ignore
        for i, pg in enumerate(pypdf.PdfReader(path).pages, 1):
            pages.append((f"p. {i}", pg.extract_text() or ""))
        return pages
    except ImportError:
        pass
    if shutil.which("pdftotext"):
        txt = subprocess.run(["pdftotext", "-layout", path, "-"], capture_output=True, text=True).stdout
        return [(f"p. {i}", t) for i, t in enumerate(txt.split("\f"), 1) if t.strip()]
    raise RuntimeError("need `pip install pypdf` or pdftotext to read PDFs")


def read_pptx(path):
    out = []
    with zipfile.ZipFile(path) as z:
        def num(n):
            return int(re.search(r"(\d+)\.xml$", n).group(1))
        slides = sorted([n for n in z.namelist() if re.match(r"ppt/slides/slide\d+\.xml$", n)], key=num)
        notes = {num(n): n for n in z.namelist() if re.match(r"ppt/notesSlides/notesSlide\d+\.xml$", n)}

        def text_of(xml):
            paras = re.findall(r"<a:p[ >].*?</a:p>", xml, flags=re.S)
            lines = ["".join(unescape(t) for t in re.findall(r"<a:t[^>]*>(.*?)</a:t>", p, flags=re.S)) for p in paras]
            return "\n".join(l for l in lines if l.strip())

        for n in slides:
            body = text_of(z.read(n).decode("utf8", "ignore"))
            nt = notes.get(num(n))
            if nt:
                note = text_of(z.read(nt).decode("utf8", "ignore"))
                if note.strip():
                    body += "\n\nSpeaker notes: " + note
            out.append((f"slide {num(n)}", body))
    return out


def read_text(path):
    """Markdown/text: one unit per paragraph, label = nearest heading."""
    out, heading = [], "start"
    with open(path, encoding="utf8") as f:
        for block in re.split(r"\n\s*\n", f.read()):
            block = block.strip()
            if not block:
                continue
            m = re.match(r"#{1,6}\s+(.*)", block)
            if m:
                heading = m.group(1).strip()
            out.append((heading, block))
    return out


READERS = {".pdf": read_pdf, ".pptx": read_pptx, ".md": read_text, ".txt": read_text}


# ---------- Split into chunks ----------
def clean(t):
    t = t.replace("\u00a0", " ")
    t = re.sub(r"[ \t]+", " ", t)
    return re.sub(r"\n{3,}", "\n\n", t).strip()


def split_long(text):
    """Split text > CHUNK_MAX at paragraph/sentence boundaries."""
    if len(text) <= CHUNK_MAX:
        return [text]
    parts, cur = [], ""
    for piece in re.split(r"(?<=[.!?])\s+|\n", text):
        if cur and len(cur) + len(piece) + 1 > CHUNK_MAX:
            parts.append(cur.strip())
            cur = ""
        cur += piece + "\n"
    if cur.strip():
        parts.append(cur.strip())
    return parts


def pack(units):
    """Merge consecutive short units, split long ones. -> [(loc, text)]"""
    flat = []
    for label, text in units:
        text = clean(text)
        if len(text) < 20:
            continue
        for part in split_long(text):
            flat.append((label, part))
    chunks, buf, labels = [], "", []

    def flush():
        nonlocal buf, labels
        if buf.strip():
            uniq = list(dict.fromkeys(labels))
            loc = uniq[0] if len(uniq) == 1 else f"{uniq[0]} – {uniq[-1]}"
            if len(loc) > 70:
                loc = uniq[0][:67] + "…"
            chunks.append((loc, buf.strip()))
        buf, labels = "", []

    for label, part in flat:
        if buf and len(buf) + len(part) + 2 > CHUNK_MAX and len(buf) >= CHUNK_MIN:
            flush()
        if not buf and label != "start" and not re.match(r"(p\.|slide) \d+", label) and label not in part[:len(label) + 8]:
            # a chunk that starts mid-section keeps its section heading, so it is findable by that heading
            part = f"[{label}]\n{part}"
        buf += ("\n\n" if buf else "") + part
        labels.append(label)
    flush()
    return chunks


def main():
    os.makedirs(SRC_DIR, exist_ok=True)
    files = sorted(f for f in os.listdir(SRC_DIR) if os.path.splitext(f)[1].lower() in READERS and not f.startswith("."))
    if not files:
        print("The knowledge/ folder is empty. Put .pdf / .pptx / .md / .txt in it, then run again.")
        return 1
    resources = load_resources()
    sources, chunks = [], []
    for fn in files:
        stem, ext = os.path.splitext(fn)
        try:
            units = READERS[ext.lower()](os.path.join(SRC_DIR, fn))
            packed = pack(units)
        except Exception as e:  # noqa: BLE001
            print(f"  ✗ {fn}: {e}")
            continue
        if not packed:
            print(f"  ✗ {fn}: no text (scanned/image PDF? needs OCR)")
            continue
        res_id = stem if stem in resources else ""
        title = resources.get(stem) or stem.replace("-", " ").replace("_", " ").title()
        si = len(sources)
        sources.append({"file": fn, "title": title, "res": res_id})
        for i, (loc, text) in enumerate(packed, 1):
            chunks.append({"id": f"{fn}#{i}", "s": si, "loc": loc, "text": text})
        print(f"  ✓ {fn}: {len(packed)} chunks" + (f"  → material '{res_id}'" if res_id else "  (no material link)"))

    data = {"built": datetime.date.today().isoformat(), "sources": sources, "chunks": chunks}
    with open(OUT, "w", encoding="utf8") as f:
        f.write("/* AUTO-GENERATED by scripts/build-knowledge.py — do not edit manually.\n"
                "   Sources live in the knowledge/ folder. Run `npm run knowledge` after adding/changing sources. */\n")
        f.write("const KNOWLEDGE = " + json.dumps(data, ensure_ascii=False, indent=1) + ";\n")
    kb = os.path.getsize(OUT) / 1024
    print(f"\nDone: {len(sources)} sources, {len(chunks)} chunks → data/knowledge.js ({kb:.0f} KB)")
    return 0


if __name__ == "__main__":
    sys.exit(main())