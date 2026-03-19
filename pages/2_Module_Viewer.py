"""Module Viewer — PDF + key takeaways + progress tracking."""
import io
import os
import streamlit as st
from lms_data.courses import COURSES, get_course, get_module
from lms_data.progress import init_progress, is_module_complete, mark_module_complete, get_course_progress

st.set_page_config(page_title="Module Viewer — Laser Safety LMS", page_icon="📖", layout="wide")
init_progress()


def render_pdf(pdf_path: str):
    """Render PDF pages as images — works in all browsers including Brave."""
    try:
        import fitz  # PyMuPDF
    except ImportError:
        st.error("PyMuPDF not installed. Run: pip install pymupdf")
        return

    page_key = f"pdf_page_{pdf_path}"
    if page_key not in st.session_state:
        st.session_state[page_key] = 0

    doc = fitz.open(pdf_path)
    total_pages = len(doc)
    current_page = st.session_state[page_key]

    # Page navigation controls
    nav_l, nav_info, nav_r, nav_dl = st.columns([1, 2, 1, 1])
    with nav_l:
        if st.button("◀ Prev", disabled=current_page == 0, use_container_width=True, key=f"prev_{pdf_path}"):
            st.session_state[page_key] -= 1
            st.rerun()
    with nav_info:
        st.markdown(f"<p style='text-align:center; padding-top:8px;'>Page {current_page + 1} of {total_pages}</p>",
                    unsafe_allow_html=True)
    with nav_r:
        if st.button("Next ▶", disabled=current_page >= total_pages - 1, use_container_width=True, key=f"next_{pdf_path}"):
            st.session_state[page_key] += 1
            st.rerun()
    with nav_dl:
        with open(pdf_path, "rb") as f:
            st.download_button("⬇ PDF", f.read(), file_name=os.path.basename(pdf_path),
                               mime="application/pdf", use_container_width=True, key=f"dl_{pdf_path}")

    # Render current page as image
    page = doc[current_page]
    mat = fitz.Matrix(2.0, 2.0)  # 2x zoom for crisp rendering
    pix = page.get_pixmap(matrix=mat)
    img_bytes = pix.tobytes("png")
    st.image(img_bytes, use_container_width=True)
    doc.close()

with st.sidebar:
    st.markdown("## 🔴 Laser Safety LMS")
    st.divider()

    # Course selector
    course_options = {c["title"]: c["id"] for c in COURSES}
    selected_course_title = st.selectbox(
        "Course",
        list(course_options.keys()),
        index=next((i for i, c in enumerate(COURSES) if c["id"] == st.session_state.get("selected_course")), 0),
    )
    course_id = course_options[selected_course_title]
    st.session_state["selected_course"] = course_id

    course = get_course(course_id)
    prog = get_course_progress(course_id)
    completed_mods = prog.get("completed_modules", [])

    # Module selector
    st.markdown("**Modules**")
    for mod in course["modules"]:
        done = mod["id"] in completed_mods
        icon = "✅" if done else "⭕"
        if st.button(f"{icon} {mod['title']}", key=f"nav_{mod['id']}", use_container_width=True):
            st.session_state["selected_module"] = mod["id"]
            st.rerun()

    st.divider()
    completed = len(completed_mods)
    total = len(course["modules"])
    st.progress(completed / total if total else 0, text=f"{completed}/{total} complete")

    if completed == total:
        if st.button("🎯 Take Quiz", use_container_width=True, type="primary"):
            st.session_state["quiz_course"] = course_id
            st.switch_page("pages/3_Quiz.py")

# ── Main content ──────────────────────────────────────────────────────────────
module_id = st.session_state.get("selected_module")
if not module_id:
    module_id = course["modules"][0]["id"]
    st.session_state["selected_module"] = module_id

module = get_module(course_id, module_id)
if not module:
    st.error("Module not found.")
    st.stop()

# Find prev/next
mod_ids = [m["id"] for m in course["modules"]]
idx = mod_ids.index(module_id)
prev_id = mod_ids[idx - 1] if idx > 0 else None
next_id = mod_ids[idx + 1] if idx < len(mod_ids) - 1 else None

# Header
is_done = is_module_complete(course_id, module_id)
status_badge = "✅ Completed" if is_done else "📖 In Progress"

col_title, col_badge = st.columns([4, 1])
with col_title:
    st.markdown(f"## {course['icon']} {module['title']}")
    st.caption(f"{course['title']} · Module {idx + 1} of {len(mod_ids)} · ⏱ {module['minutes']} min · {status_badge}")
with col_badge:
    if not is_done:
        if st.button("✅ Mark Complete", type="primary", use_container_width=True):
            mark_module_complete(course_id, module_id)
            st.rerun()
    else:
        st.success("Complete!")

st.write(module["description"])

# ── Two-column layout: PDF | Takeaways ───────────────────────────────────────
pdf_col, side_col = st.columns([3, 1])

with pdf_col:
    pdf_path = module.get("pdf_path", "")
    if pdf_path and os.path.exists(pdf_path):
        render_pdf(pdf_path)
    else:
        st.warning(f"📄 PDF not found at: `{pdf_path}`")
        st.info("Add PDFs to the docs folder by running `bash laser-safety-lms/scripts/copy-docs.sh`")

with side_col:
    st.markdown("### 💡 Key Takeaways")
    for point in module.get("key_takeaways", []):
        st.markdown(f"🔸 {point}")

    st.divider()
    st.markdown("### 📊 Module Progress")
    completed = len(get_course_progress(course_id).get("completed_modules", []))
    total_in_course = len(course["modules"])
    st.progress(completed / total_in_course if total_in_course else 0)
    st.caption(f"{completed}/{total_in_course} modules in this course")

# ── Navigation ────────────────────────────────────────────────────────────────
st.divider()
nav_prev, nav_next = st.columns(2)
with nav_prev:
    if prev_id:
        if st.button("← Previous Module", use_container_width=True):
            st.session_state["selected_module"] = prev_id
            st.rerun()
with nav_next:
    if next_id:
        if st.button("Next Module →", use_container_width=True, type="primary"):
            st.session_state["selected_module"] = next_id
            st.rerun()
    else:
        if st.button("✅ Finish Course & Take Quiz →", use_container_width=True, type="primary"):
            st.session_state["quiz_course"] = course_id
            st.switch_page("pages/3_Quiz.py")
