"""
PDF text extraction and lesson formatting for Laser Safety LMS.
Extracts text, cleans it, detects links, and structures content for display.
"""
import re
import os
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

    st.caption(f"📄 {total_pages} pages · {lesson['word_count']:,} words")

    # Links section
    if links:
        with st.expander(f"🔗 {len(links)} Reference Link{'s' if len(links) != 1 else ''}", expanded=False):
            for url in links:
                st.markdown(f"- [{url}]({url})")

    # Determine display mode based on length
    if total_pages <= 10:
        # Short doc — show all pages expanded
        for p in pages:
            render_page(p)
    else:
        # Long doc — first page expanded, rest collapsed
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
