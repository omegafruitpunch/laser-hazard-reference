"""Presentation Mode — full-screen slide deck using course module content."""
import streamlit as st
from lms_data.courses import COURSES, get_course
from lms_data.progress import init_progress

st.set_page_config(
    page_title="Presentation — Laser Safety LMS",
    page_icon="🎭",
    layout="wide",
    initial_sidebar_state="collapsed",
)
init_progress()

# Inject full-screen CSS
st.markdown("""
<style>
[data-testid="stAppViewContainer"] > .main {
    background: #000 !important;
}
.slide-container {
    background: linear-gradient(135deg, #0a0a0a 0%, #111827 100%);
    border: 1px solid #1f2937;
    border-radius: 16px;
    padding: 3rem;
    min-height: 70vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
}
.slide-category {
    color: #dc2626;
    font-size: 0.8rem;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    margin-bottom: 0.5rem;
}
.slide-title {
    color: #fff;
    font-size: 2.5rem;
    font-weight: 800;
    line-height: 1.2;
    margin-bottom: 0.5rem;
}
.slide-desc {
    color: #9ca3af;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
}
.takeaway-item {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.06);
    border-radius: 10px;
    padding: 0.8rem 1rem;
    margin-bottom: 0.5rem;
    color: #e5e7eb;
    font-size: 1rem;
}
.slide-number {
    color: #374151;
    font-size: 0.8rem;
    text-align: center;
    margin-top: 1rem;
}
</style>
""", unsafe_allow_html=True)

# Controls bar at top
ctrl_col, course_col, lms_col = st.columns([1, 2, 1])
with ctrl_col:
    if st.button("← Exit Presentation", use_container_width=True):
        st.switch_page("pages/1_Courses.py")

with lms_col:
    # Next.js LMS link
    lms_url = st.session_state.get("lms_url", "http://localhost:3000").rstrip("/")
    course_id = st.session_state.get("selected_course", "course-1")
    st.link_button(
        "🎓 Open in LMS →",
        f"{lms_url}/present/{course_id}",
        use_container_width=True,
    )

with course_col:
    course_options = {c["title"]: c["id"] for c in COURSES}
    preselect = st.session_state.get("selected_course", COURSES[0]["id"])
    preselect_title = next((c["title"] for c in COURSES if c["id"] == preselect), COURSES[0]["title"])
    selected_title = st.selectbox(
        "Course", list(course_options.keys()),
        index=list(course_options.keys()).index(preselect_title),
        label_visibility="collapsed",
    )
    course_id = course_options[selected_title]
    st.session_state["selected_course"] = course_id

course = get_course(course_id)
modules = course["modules"]
total_slides = len(modules)

# Slide index state
slide_key = f"pres_slide_{course_id}"
if slide_key not in st.session_state:
    st.session_state[slide_key] = 0

current_idx = st.session_state[slide_key]
module = modules[current_idx]

# Slide content
st.markdown(f"""
<div class="slide-container">
    <div class="slide-category">{course['icon']} &nbsp; {course['category']} &nbsp;·&nbsp; {course['title']}</div>
    <div class="slide-title">{module['title']}</div>
    <div class="slide-desc">{module['description']}</div>
    {"".join(f'<div class="takeaway-item"><strong style="color:#dc2626">{i+1:02d}</strong> &nbsp; {pt}</div>' for i, pt in enumerate(module["key_takeaways"]))}
    <div class="slide-number">Slide {current_idx + 1} of {total_slides}</div>
</div>
""", unsafe_allow_html=True)

# Navigation
st.markdown("<br>", unsafe_allow_html=True)
nav_left, nav_dots, nav_right = st.columns([1, 3, 1])

with nav_left:
    if current_idx > 0:
        if st.button("◀  Previous", use_container_width=True):
            st.session_state[slide_key] -= 1
            st.rerun()

with nav_dots:
    # Dot indicators
    dots = ""
    for i in range(total_slides):
        if i == current_idx:
            dots += "⬤ "
        else:
            dots += "○ "
    st.markdown(f"<p style='text-align:center; color:#555; font-size:1.1rem;'>{dots}</p>", unsafe_allow_html=True)

with nav_right:
    if current_idx < total_slides - 1:
        if st.button("Next  ▶", use_container_width=True, type="primary"):
            st.session_state[slide_key] += 1
            st.rerun()

# Keyboard nav hint
st.caption("💡 Use the buttons above to navigate slides. Click 'Exit Presentation' to return.")
