"""Course Catalog page."""
import streamlit as st
from lms_data.courses import COURSES
from lms_data.progress import init_progress, get_course_progress

st.set_page_config(page_title="Courses — Laser Safety LMS", page_icon="📚", layout="wide")
init_progress()

with st.sidebar:
    st.markdown("## 🔴 Laser Safety LMS")

st.title("📚 Course Catalog")
total_modules = sum(len(c["modules"]) for c in COURSES)
total_min = sum(c["total_minutes"] for c in COURSES)
st.caption(f"{len(COURSES)} courses · {total_modules} modules · {total_min} minutes of content")

# Filters
col_search, col_cat, col_diff = st.columns([3, 2, 2])
with col_search:
    search = st.text_input("🔍 Search courses", placeholder="Search by title or description...")
with col_cat:
    categories = ["All"] + sorted(set(c["category"] for c in COURSES))
    cat_filter = st.selectbox("Category", categories)
with col_diff:
    diffs = ["All", "Beginner", "Intermediate", "Advanced"]
    diff_filter = st.selectbox("Difficulty", diffs)

# Filter courses
filtered = [
    c for c in COURSES
    if (not search or search.lower() in c["title"].lower() or search.lower() in c["description"].lower())
    and (cat_filter == "All" or c["category"] == cat_filter)
    and (diff_filter == "All" or c["difficulty"] == diff_filter)
]

if not filtered:
    st.info("No courses match your filters.")
else:
    cols = st.columns(3)
    for i, course in enumerate(filtered):
        prog = get_course_progress(course["id"])
        completed = len(prog.get("completed_modules", []))
        total = len(course["modules"])
        pct = int(completed / total * 100) if total else 0
        passed = prog.get("quiz_passed", False)

        diff_colors = {"Beginner": "🟢", "Intermediate": "🟡", "Advanced": "🔴"}
        diff_icon = diff_colors.get(course["difficulty"], "⚪")

        with cols[i % 3]:
            with st.container(border=True):
                st.markdown(f"### {course['icon']} {course['title']}")
                st.caption(f"{course['category']} · {diff_icon} {course['difficulty']}")
                st.write(course["description"])

                st.progress(pct / 100, text=f"{pct}% complete ({completed}/{total} modules)")

                status_parts = []
                if passed:
                    status_parts.append("✅ Quiz Passed")
                elif pct == 100:
                    status_parts.append("📝 Ready for Quiz")
                elif pct > 0:
                    status_parts.append("🔄 In Progress")
                else:
                    status_parts.append("⭕ Not Started")

                col_a, col_b = st.columns(2)
                with col_a:
                    if st.button("📖 Start Learning", key=f"learn_{course['id']}", use_container_width=True):
                        st.session_state["selected_course"] = course["id"]
                        st.session_state["selected_module"] = course["modules"][0]["id"]
                        st.switch_page("pages/2_Module_Viewer.py")
                with col_b:
                    if st.button("🎯 Take Quiz", key=f"quiz_{course['id']}", use_container_width=True):
                        st.session_state["quiz_course"] = course["id"]
                        st.switch_page("pages/3_Quiz.py")
