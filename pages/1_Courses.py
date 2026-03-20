"""Course Catalog — shows all courses with expandable module lists."""
import os
import streamlit as st
from lms_data.courses import COURSES
from lms_data.progress import init_progress, get_course_progress
from lms_data.quizzes import QUIZZES

st.set_page_config(page_title="Courses — Laser Safety LMS", page_icon="📚", layout="wide")
init_progress()

with st.sidebar:
    st.markdown("## 🔴 Laser Safety LMS")
    st.divider()
    
    # Next.js LMS Navigation
    st.markdown("### 🎓 Interactive LMS")
    st.caption("Enhanced learning with simulations & visualizations")
    
    lms_url = st.session_state.get("lms_url", "http://localhost:3000").rstrip("/")
    
    if st.button("🚀 Open Interactive LMS", use_container_width=True, key="courses_lms_main"):
        st.markdown(f'<script>window.open("{lms_url}/courses", "_blank");</script>', unsafe_allow_html=True)
    
    st.link_button(
        "📚 Browse Courses →",
        f"{lms_url}/courses",
        use_container_width=True,
    )
    
    st.divider()


# ── Helpers ───────────────────────────────────────────────────────────────────

def _has_digest(pdf_path: str) -> bool:
    """Return True if a pre-digested content file exists for this PDF."""
    if not pdf_path:
        return False
    stem = os.path.splitext(os.path.basename(pdf_path))[0]
    digest_dir = os.path.join(os.path.dirname(__file__), "..", "lms_data", "digested_content")
    if not os.path.isdir(digest_dir):
        return False
    for folder in os.listdir(digest_dir):
        folder_path = os.path.join(digest_dir, folder)
        if not os.path.isdir(folder_path):
            continue
        for fname in os.listdir(folder_path):
            ns = fname.replace("_digested", "").replace("_digest", "")
            ns = os.path.splitext(ns)[0]
            if ns == stem:
                return True
    return False


# ── Header ────────────────────────────────────────────────────────────────────

st.title("📚 Course Catalog")
total_modules = sum(len(c["modules"]) for c in COURSES)
total_min = sum(c["total_minutes"] for c in COURSES)
total_q = sum(len(QUIZZES.get(c["id"], [])) for c in COURSES)
st.caption(
    f"{len(COURSES)} courses · {total_modules} modules · "
    f"{total_min:,} minutes of content · {total_q} quiz questions"
)

# ── Filters ───────────────────────────────────────────────────────────────────

col_search, col_cat, col_diff = st.columns([3, 2, 2])
with col_search:
    search = st.text_input("Search", placeholder="Search by title or description...")
with col_cat:
    categories = ["All"] + sorted(set(c["category"] for c in COURSES))
    cat_filter = st.selectbox("Category", categories)
with col_diff:
    diff_filter = st.selectbox("Difficulty", ["All", "Beginner", "Intermediate", "Advanced"])

filtered = [
    c for c in COURSES
    if (not search or search.lower() in c["title"].lower() or search.lower() in c["description"].lower())
    and (cat_filter == "All" or c["category"] == cat_filter)
    and (diff_filter == "All" or c["difficulty"] == diff_filter)
]

if not filtered:
    st.info("No courses match your filters.")
    st.stop()

st.divider()

# ── Course cards ──────────────────────────────────────────────────────────────

DIFF_ICON = {"Beginner": "🟢", "Intermediate": "🟡", "Advanced": "🔴"}

for course in filtered:
    cid = course["id"]
    prog = get_course_progress(cid)
    completed_mods = prog.get("completed_modules", [])
    total = len(course["modules"])
    completed = len(completed_mods)
    pct = int(completed / total * 100) if total else 0
    passed = prog.get("quiz_passed", False)
    quiz_count = len(QUIZZES.get(cid, []))
    digest_count = sum(1 for m in course["modules"] if _has_digest(m.get("pdf_path", "")))

    # Status badge
    if passed:
        status = "✅ Quiz Passed"
    elif pct == 100:
        status = "📝 Ready for Quiz"
    elif pct > 0:
        status = f"🔄 In Progress ({pct}%)"
    else:
        status = "⭕ Not Started"

    with st.container(border=True):
        # ── Course header row ──────────────────────────────────────────────
        h_left, h_right = st.columns([5, 2])
        with h_left:
            st.markdown(f"### {course['icon']} {course['title']}")
            st.caption(
                f"{course['category']} · "
                f"{DIFF_ICON.get(course['difficulty'], '')} {course['difficulty']} · "
                f"{total} modules · {course['total_minutes']} min · "
                f"{quiz_count} quiz questions"
                + (f" · {digest_count} structured lessons" if digest_count else "")
            )
            st.write(course["description"])

        with h_right:
            st.markdown(f"**{status}**")
            st.progress(pct / 100)
            col_a, col_b = st.columns(2)
            with col_a:
                if st.button("📖 Open", key=f"learn_{cid}", use_container_width=True, type="primary"):
                    st.session_state["selected_course"] = cid
                    st.session_state["selected_module"] = course["modules"][0]["id"]
                    st.switch_page("pages/2_Module_Viewer.py")
            with col_b:
                if st.button("🎯 Quiz", key=f"quiz_{cid}", use_container_width=True):
                    st.session_state["quiz_course"] = cid
                    st.switch_page("pages/3_Quiz.py")

        # ── Module list (expandable) ───────────────────────────────────────
        with st.expander(f"View all {total} modules", expanded=False):
            for idx, mod in enumerate(course["modules"]):
                mid = mod["id"]
                done = mid in completed_mods
                has_rich = _has_digest(mod.get("pdf_path", ""))

                col_status, col_info, col_go = st.columns([1, 6, 2])
                with col_status:
                    st.markdown("✅" if done else "⭕")
                with col_info:
                    badge = " 📚" if has_rich else ""
                    st.markdown(f"**{idx + 1}. {mod['title']}**{badge}")
                    st.caption(f"{mod['minutes']} min · {mod['description'][:90]}{'...' if len(mod['description']) > 90 else ''}")
                with col_go:
                    if st.button("Open →", key=f"mod_{cid}_{mid}", use_container_width=True):
                        st.session_state["selected_course"] = cid
                        st.session_state["selected_module"] = mid
                        st.switch_page("pages/2_Module_Viewer.py")

        st.markdown("")  # spacer between courses
