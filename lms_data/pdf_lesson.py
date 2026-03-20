"""
PDF text extraction and lesson formatting for Laser Safety LMS.
Extracts text, cleans it, detects links, and structures content for display.
Falls back to pre-digested JSON/markdown content when available.
"""
import re
import os
import json
import streamlit as st


@st.cache_data(show_spinner="Reading lesson content...")
def extract_lesson(pdf_path: str) -> dict:
    """
    Extract structured text content from a PDF.
    Returns dict with: pages, links, word_count, total_pages, status
    status: 'ok' | 'scanned' | 'corrupt' | 'missing'
    """
    if not pdf_path or not os.path.exists(pdf_path):
        return {"status": "missing", "pages": [], "links": [], "word_count": 0, "total_pages": 0}

    try:
        import fitz
    except ImportError:
        return {"status": "corrupt", "pages": [], "links": [], "word_count": 0, "total_pages": 0}

    try:
        doc = fitz.open(pdf_path)
    except Exception:
        return {"status": "corrupt", "pages": [], "links": [], "word_count": 0, "total_pages": 0}

    total_pages = len(doc)
    all_links = []
    pages = []
    total_words = 0

    for page_num in range(total_pages):
        page = doc[page_num]

        # Extract links (annotations)
        for link in page.get_links():
            uri = link.get("uri", "")
            if uri and uri.startswith("http"):
                all_links.append(uri)

        raw_text = page.get_text("text")
        cleaned = clean_text(raw_text)
        words = len(cleaned.split())
        total_words += words

        if cleaned.strip():
            pages.append({"page": page_num + 1, "text": cleaned, "words": words})

    doc.close()

    # Deduplicate links
    seen = set()
    unique_links = [l for l in all_links if not (l in seen or seen.add(l))]

    # Also scan text for URLs
    full_text = "\n".join(p["text"] for p in pages)
    text_urls = re.findall(r'https?://[^\s\)\]\>,\"\']+', full_text)
    for url in text_urls:
        url = url.rstrip(".")
        if url not in seen:
            unique_links.append(url)
            seen.add(url)

    if total_words < 50 and total_pages > 0:
        status = "scanned"
    else:
        status = "ok"

    return {
        "status": status,
        "pages": pages,
        "links": unique_links,
        "word_count": total_words,
        "total_pages": total_pages,
    }


def clean_text(raw: str) -> str:
    """Clean raw PDF-extracted text into readable prose."""
    if not raw:
        return ""

    lines = raw.splitlines()
    cleaned_lines = []

    for line in lines:
        line = line.strip()
        if not line:
            cleaned_lines.append("")
            continue

        # Fix common PDF extraction artifacts
        line = re.sub(r'\s{3,}', '  ', line)           # collapse excessive spaces
        line = re.sub(r'([a-z])-\n([a-z])', r'\1\2', line)  # fix hyphenation

        # Replace non-breaking spaces and other oddities
        line = line.replace('\xa0', ' ').replace('\uf0b7', '•').replace('\x0c', '')
        line = line.replace('\u2019', "'").replace('\u2018', "'")
        line = line.replace('\u201c', '"').replace('\u201d', '"')
        line = line.replace('\u2013', '–').replace('\u2014', '—')
        line = line.replace('\ufffd', '').replace('\u00ef\u00bf\u00bd', '')

        cleaned_lines.append(line)

    # Collapse multiple blank lines into one
    text = "\n".join(cleaned_lines)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def _find_digest(pdf_path: str) -> dict | None:
    """Find a pre-digested JSON or markdown file matching this PDF, if any."""
    if not pdf_path:
        return None
    stem = os.path.splitext(os.path.basename(pdf_path))[0]
    digest_dir = os.path.join(os.path.dirname(__file__), "digested_content")
    if not os.path.isdir(digest_dir):
        return None
    for course_folder in os.listdir(digest_dir):
        folder = os.path.join(digest_dir, course_folder)
        if not os.path.isdir(folder):
            continue
        for fname in os.listdir(folder):
            name_stem = fname.replace("_digested", "").replace("_digest", "")
            name_stem = os.path.splitext(name_stem)[0]
            if name_stem == stem:
                full = os.path.join(folder, fname)
                ext = os.path.splitext(fname)[1]
                if ext == ".json":
                    try:
                        with open(full, encoding="utf-8") as f:
                            return {"kind": "json", "data": json.load(f)}
                    except Exception:
                        pass
                elif ext == ".md":
                    try:
                        with open(full, encoding="utf-8") as f:
                            return {"kind": "md", "content": f.read()}
                    except Exception:
                        pass
    return None


def _render_digest(digest: dict) -> None:
    """Render pre-digested content (JSON or markdown) in the UI."""
    if digest["kind"] == "md":
        st.markdown(digest["content"])
        return

    data = digest["data"]
    # Handle course-8-style nested quiz_bank wrapper
    if "quiz_bank" in data:
        data = data  # not a lesson digest

    title = data.get("title") or data.get("document", "")
    source = data.get("source") or data.get("edition", "")
    if title:
        st.markdown(f"**{title}**" + (f"  \n*{source}*" if source else ""))
        st.markdown("")

    # key_concepts_summary block (classification digest style)
    kcs = data.get("key_concepts_summary")
    if kcs:
        crit = kcs.get("critical_values", [])
        formulas = kcs.get("formula_relationships", [])
        if crit:
            with st.expander("📐 Critical Values & Parameters", expanded=True):
                rows = [(c["parameter"], c["value"], c.get("significance", "")) for c in crit]
                col1, col2, col3 = st.columns([2, 1, 3])
                col1.markdown("**Parameter**")
                col2.markdown("**Value**")
                col3.markdown("**Significance**")
                for param, val, sig in rows:
                    col1.markdown(param)
                    col2.markdown(f"`{val}`")
                    col3.markdown(sig)
        if formulas:
            with st.expander("🔢 Key Formulas"):
                for f in formulas:
                    st.markdown(f"- `{f['formula']}` — {f['description']}")

    # Pages analysis (intro-laser-hazards / classification style)
    pages_analysis = data.get("pages_analysis", [])
    if pages_analysis:
        shown = 0
        for pg in pages_analysis:
            summary = pg.get("summary", "")
            concepts = pg.get("core_concepts", [])
            terms = pg.get("key_terms", [])
            objectives = pg.get("learning_objectives", [])
            section = pg.get("section", "").replace("_", " ").title()
            if not (summary or concepts):
                continue
            label = f"Page {pg['page_num']}" + (f" — {section}" if section else "")
            expanded = shown < 3
            with st.expander(label, expanded=expanded):
                if summary:
                    st.markdown(summary)
                if concepts:
                    st.markdown("**Core Concepts:** " + " · ".join(f"`{c}`" for c in concepts))
                if terms:
                    if isinstance(terms, dict):
                        for term, defn in list(terms.items())[:4]:
                            st.markdown(f"- **{term}**: {defn}")
                    else:
                        st.markdown("**Key Terms:** " + ", ".join(terms[:8]))
                if objectives:
                    for obj in objectives[:3]:
                        st.markdown(f"✓ {obj}")
            shown += 1
        return

    # Pages list (beam-hazard / lso-role style)
    pages = data.get("pages", [])
    if pages:
        for pg in pages[:8]:
            pg_num = pg.get("page_num", "")
            concepts = pg.get("core_concepts", [])
            terms = pg.get("key_terms", {})
            summary = pg.get("summary", "")
            label = f"Page {pg_num}" if pg_num else "Content"
            with st.expander(label):
                if summary:
                    st.markdown(summary)
                if concepts:
                    for c in concepts[:5]:
                        st.markdown(f"- {c}")
                if isinstance(terms, dict):
                    for term, defn in list(terms.items())[:3]:
                        st.markdown(f"**{term}**: {defn}")
        return

    # Chapters (lso-role digest style — chapter titles only)
    chapters = data.get("chapters", [])
    if chapters:
        for ch in chapters:
            title_ch = ch.get("title", f"Chapter {ch.get('chapter', '')}")
            pages_ref = ch.get("pages", [])
            label = f"Chapter {ch.get('chapter', '')}: {title_ch}"
            if pages_ref:
                label += f" (pp. {pages_ref[0]}–{pages_ref[-1]})"
            st.markdown(f"**{label}**")


def render_lesson(pdf_path: str, key_takeaways: list = None):
    """
    Render the full interactive lesson for a module.
    Falls back gracefully for scanned/corrupt PDFs.
    """
    lesson = extract_lesson(pdf_path)

    # ── Download button always shown ──────────────────────────────────────────
    if os.path.exists(pdf_path):
        with open(pdf_path, "rb") as f:
            pdf_bytes = f.read()
        st.download_button(
            "⬇️ Download Source PDF",
            data=pdf_bytes,
            file_name=os.path.basename(pdf_path),
            mime="application/pdf",
        )

    # ── Key Takeaways callout ─────────────────────────────────────────────────
    if key_takeaways:
        with st.container(border=True):
            st.markdown("### 💡 Key Takeaways")
            for point in key_takeaways:
                st.markdown(f"- {point}")

    st.divider()

    # ── Handle each status ────────────────────────────────────────────────────
    if lesson["status"] == "missing":
        st.warning("📄 PDF file not found for this module.")
        st.info("Run `bash laser-safety-lms/scripts/copy-docs.sh` to populate docs.")
        return

    if lesson["status"] == "corrupt":
        st.warning("⚠️ This file could not be read. Showing key takeaways only.")
        return

    if lesson["status"] == "scanned":
        st.info("📷 This document is a scanned image PDF — showing page viewer.")
        render_image_viewer(pdf_path)
        return

    # ── Extracted text lesson ─────────────────────────────────────────────────
    pages = lesson["pages"]
    links = lesson["links"]
    total_pages = lesson["total_pages"]

    digest = _find_digest(pdf_path)

    # Tabs: structured digest (if available) + raw source text
    if digest:
        tab_structured, tab_source = st.tabs(["📚 Structured Content", "📄 Source Text"])
        with tab_structured:
            _render_digest(digest)
        with tab_source:
            _render_source_pages(pages, links, total_pages, lesson["word_count"])
    else:
        _render_source_pages(pages, links, total_pages, lesson["word_count"])


def _render_source_pages(pages, links, total_pages, word_count):
    """Render raw extracted PDF pages with link section."""
    st.caption(f"📄 {total_pages} pages · {word_count:,} words")
    if links:
        with st.expander(f"🔗 {len(links)} Reference Link{'s' if len(links) != 1 else ''}", expanded=False):
            for url in links:
                st.markdown(f"- [{url}]({url})")
    if total_pages <= 10:
        for p in pages:
            render_page(p)
    else:
        if pages:
            render_page(pages[0])
        for p in pages[1:]:
            with st.expander(f"Page {p['page']}", expanded=False):
                st.markdown(format_page_text(p["text"]))


def render_page(page_data: dict):
    """Render a single page's content."""
    text = page_data["text"]
    if not text.strip():
        return

    st.markdown(f"<p style='color:#555; font-size:0.75rem; margin-bottom:4px;'>— Page {page_data['page']} —</p>",
                unsafe_allow_html=True)
    st.markdown(format_page_text(text))
    st.markdown("")  # spacer


def format_page_text(text: str) -> str:
    """
    Convert extracted PDF text into clean markdown.
    Detects headers, bullets, numbered lists, and URLs.
    """
    lines = text.splitlines()
    output = []

    for i, line in enumerate(lines):
        stripped = line.strip()
        if not stripped:
            output.append("")
            continue

        # Detect headers: short ALL-CAPS or Title Case lines under 80 chars
        is_short = len(stripped) < 80
        is_allcaps = stripped.isupper() and len(stripped) > 3
        is_title = (stripped[0].isupper() and stripped.count(' ') < 8
                    and not stripped.endswith('.') and is_short
                    and i < len(lines) - 1 and not lines[i+1].strip())

        if is_allcaps and is_short:
            output.append(f"\n### {stripped.title()}\n")
        elif is_title and len(stripped) > 6:
            output.append(f"\n**{stripped}**\n")

        # Bullet points
        elif re.match(r'^[•\-\*]\s', stripped):
            content = re.sub(r'^[•\-\*]\s+', '', stripped)
            output.append(f"- {linkify(content)}")

        # Numbered lists
        elif re.match(r'^\d+[\.\)]\s', stripped):
            content = re.sub(r'^\d+[\.\)]\s+', '', stripped)
            num = re.match(r'^(\d+)', stripped).group(1)
            output.append(f"{num}. {linkify(content)}")

        else:
            output.append(linkify(stripped))

    return "\n".join(output)


def linkify(text: str) -> str:
    """Make bare URLs in text into clickable markdown links."""
    return re.sub(
        r'(https?://[^\s\)\]\>,\"\']+)',
        lambda m: f"[{m.group(1)}]({m.group(1).rstrip('.')})",
        text
    )


def render_image_viewer(pdf_path: str):
    """Fallback image viewer for scanned PDFs."""
    try:
        import fitz
        page_key = f"pdf_page_{hash(pdf_path)}"
        if page_key not in st.session_state:
            st.session_state[page_key] = 0

        doc = fitz.open(pdf_path)
        total_pages = len(doc)
        current_page = st.session_state[page_key]

        nav_l, nav_info, nav_r = st.columns([1, 2, 1])
        with nav_l:
            if st.button("◀ Prev", disabled=current_page == 0,
                          use_container_width=True, key=f"img_prev_{hash(pdf_path)}"):
                st.session_state[page_key] -= 1
                st.rerun()
        with nav_info:
            st.markdown(f"<p style='text-align:center;padding-top:8px;'>Page {current_page+1} of {total_pages}</p>",
                        unsafe_allow_html=True)
        with nav_r:
            if st.button("Next ▶", disabled=current_page >= total_pages - 1,
                          use_container_width=True, key=f"img_next_{hash(pdf_path)}"):
                st.session_state[page_key] += 1
                st.rerun()

        page = doc[current_page]
        pix = page.get_pixmap(matrix=fitz.Matrix(2.0, 2.0))
        st.image(pix.tobytes("png"), use_container_width=True)
        doc.close()
    except Exception as e:
        st.error(f"Could not render page: {e}")
