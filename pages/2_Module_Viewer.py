"""Module Viewer — interactive text lesson + key takeaways + progress tracking."""
import os
import streamlit as st
from lms_data.courses import COURSES, get_course, get_module
from lms_data.progress import init_progress, is_module_complete, mark_module_complete, get_course_progress
from lms_data.pdf_lesson import render_lesson

st.set_page_config(page_title="Module Viewer — Laser Safety LMS", page_icon="📖", layout="wide")
init_progress()

# ── Sidebar ───────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🔴 Laser Safety LMS")
    st.divider()

    course_options = {c["title"]: c["id"] for c in COURSES}
    selected_course_title = st.selectbox(
        "Course",
        list(course_options.keys()),
        index=next((i for i, c in enumerate(COURSES)
                    if c["id"] == st.session_state.get("selected_course")), 0),
    )
    course_id = course_options[selected_course_title]
    st.session_state["selected_course"] = course_id

    course = get_course(course_id)
    prog = get_course_progress(course_id)
    completed_mods = prog.get("completed_modules", [])

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

# ── Resolve current module ────────────────────────────────────────────────────
module_id = st.session_state.get("selected_module")
if not module_id:
    module_id = course["modules"][0]["id"]
    st.session_state["selected_module"] = module_id

module = get_module(course_id, module_id)
if not module:
    st.error("Module not found.")
    st.stop()

mod_ids   = [m["id"] for m in course["modules"]]
idx       = mod_ids.index(module_id)
prev_id   = mod_ids[idx - 1] if idx > 0 else None
next_id   = mod_ids[idx + 1] if idx < len(mod_ids) - 1 else None
is_done   = is_module_complete(course_id, module_id)

# ── Module header ─────────────────────────────────────────────────────────────
col_title, col_actions = st.columns([4, 1])
with col_title:
    st.markdown(f"## {course['icon']} {module['title']}")
    st.caption(
        f"{course['title']} · Module {idx + 1} of {len(mod_ids)} "
        f"· ⏱ {module['minutes']} min "
        f"· {'✅ Completed' if is_done else '📖 In Progress'}"
    )
    st.write(module["description"])

with col_actions:
    if not is_done:
        if st.button("✅ Mark Complete", type="primary", use_container_width=True):
            mark_module_complete(course_id, module_id)
            st.rerun()
    else:
        st.success("Complete!")

st.divider()

# ── Lesson content ────────────────────────────────────────────────────────────
render_lesson(
    pdf_path=module.get("pdf_path", ""),
    key_takeaways=module.get("key_takeaways", []),
)

# ── Bottom navigation ─────────────────────────────────────────────────────────
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
