"""
Laser Safety LMS — Home / Dashboard
Run with: python -m streamlit run laser_lms_app.py
"""
import streamlit as st
from lms_data.courses import COURSES
from lms_data.progress import init_progress, get_overall_stats

st.set_page_config(
    page_title="Laser Safety LMS",
    page_icon="🔴",
    layout="wide",
    initial_sidebar_state="expanded",
)

init_progress()

# ──────────────────────────────────────────────────────────────────────────────
# SIDEBAR NAV
# ──────────────────────────────────────────────────────────────────────────────
with st.sidebar:
    st.markdown("## 🔴 Laser Safety LMS")
    st.caption("Professional Laser Safety Training")
    st.divider()
    st.page_link("laser_lms_app.py",          label="🏠 Dashboard")
    st.page_link("pages/1_Courses.py",         label="📚 Courses")
    st.page_link("pages/2_Module_Viewer.py",   label="📖 Module Viewer")
    st.page_link("pages/3_Quiz.py",            label="🎯 Quiz")
    st.page_link("pages/4_Certificate.py",     label="🏆 Certificates")
    st.page_link("pages/5_Presentation.py",    label="🎭 Presentation")
    st.divider()
    stats = get_overall_stats()
    st.metric("Overall Progress", f"{stats['overall_pct']}%")
    st.progress(stats["overall_pct"] / 100)
    st.caption(f"{stats['completed_modules']}/{stats['total_modules']} modules · {stats['courses_finished']}/{stats['total_courses']} courses passed")

# ──────────────────────────────────────────────────────────────────────────────
# MAIN CONTENT
# ──────────────────────────────────────────────────────────────────────────────
st.markdown("""
<style>
.hero-box {
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
    border: 1px solid #e94560;
    border-radius: 16px;
    padding: 2rem;
    margin-bottom: 1.5rem;
}
.course-tile {
    background: #1e1e2e;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1rem;
    text-align: center;
    transition: border-color 0.2s;
}
.stat-box {
    background: #1e1e2e;
    border: 1px solid #333;
    border-radius: 12px;
    padding: 1.2rem;
    text-align: center;
}
</style>
""", unsafe_allow_html=True)

# Hero
st.markdown("""
<div class="hero-box">
<h1 style="color:#fff; margin:0 0 0.5rem 0;">🔴 Laser Safety LMS</h1>
<p style="color:#aaa; font-size:1.1rem; margin:0 0 1rem 0;">
    Master FDA compliance, ANSI standards, state regulations, and laser safety protocols across 8 comprehensive courses.
</p>
<p style="color:#e94560; margin:0;">
    ⚡ Professional Laser Safety Training Platform
</p>
</div>
""", unsafe_allow_html=True)

# Stats row
stats = get_overall_stats()
c1, c2, c3, c4 = st.columns(4)
c1.metric("Overall Progress", f"{stats['overall_pct']}%")
c2.metric("Modules Completed", f"{stats['completed_modules']}/{stats['total_modules']}")
c3.metric("Courses Passed", f"{stats['courses_finished']}/{stats['total_courses']}")
c4.metric("Certificates Earned", stats["courses_finished"])

st.divider()

# Course tiles
st.subheader("📚 All Courses")
cols = st.columns(4)
for i, course in enumerate(COURSES):
    prog = st.session_state.progress.get(course["id"], {})
    completed = len(prog.get("completed_modules", []))
    total = len(course["modules"])
    pct = int(completed / total * 100) if total else 0
    passed = prog.get("quiz_passed", False)

    with cols[i % 4]:
        status = "✅" if passed else ("🔄" if completed > 0 else "⭕")
        st.markdown(f"""
        <div class="course-tile">
            <div style="font-size:2rem;">{course['icon']}</div>
            <div style="color:#aaa; font-size:0.7rem; text-transform:uppercase; letter-spacing:1px;">{course['category']}</div>
            <div style="color:#fff; font-weight:600; font-size:0.85rem; margin:0.3rem 0;">{course['title']}</div>
            <div style="color:#888; font-size:0.75rem;">{status} {pct}% · {total} modules</div>
        </div>
        """, unsafe_allow_html=True)
        if st.button("Open →", key=f"open_{course['id']}"):
            st.session_state["selected_course"] = course["id"]
            st.switch_page("pages/1_Courses.py")

st.divider()
st.caption("Progress is saved for this browser session. Use the Courses page to start learning.")
