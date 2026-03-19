"""Certificate generation using reportlab."""
import io
from datetime import datetime
import streamlit as st
from lms_data.courses import COURSES
from lms_data.progress import init_progress, get_course_progress

st.set_page_config(page_title="Certificates — Laser Safety LMS", page_icon="🏆", layout="wide")
init_progress()

with st.sidebar:
    st.markdown("## 🔴 Laser Safety LMS")
    st.page_link("laser_lms_app.py",          label="🏠 Dashboard")
    st.page_link("pages/1_Courses.py",         label="📚 Courses")
    st.page_link("pages/2_Module_Viewer.py",   label="📖 Module Viewer")
    st.page_link("pages/3_Quiz.py",            label="🎯 Quiz")
    st.page_link("pages/4_Certificate.py",     label="🏆 Certificates")
    st.page_link("pages/5_Presentation.py",    label="🎭 Presentation")

st.title("🏆 Certificates")

# Name setup
if not st.session_state.get("user_name"):
    st.info("Enter your name to generate certificates.")
    name_input = st.text_input("Your Full Name", placeholder="Jane Smith")
    if st.button("Save Name", type="primary") and name_input.strip():
        st.session_state["user_name"] = name_input.strip()
        st.rerun()
    st.stop()

col_name, col_change = st.columns([4, 1])
with col_name:
    st.markdown(f"**Certificates for:** {st.session_state['user_name']}")
with col_change:
    if st.button("Change Name"):
        st.session_state["user_name"] = ""
        st.rerun()

# Find passed courses
passed_courses = [
    c for c in COURSES
    if get_course_progress(c["id"]).get("quiz_passed")
]

if not passed_courses:
    st.warning("No certificates yet. Complete a course and pass the quiz to earn your first certificate!")
    if st.button("Browse Courses →", type="primary"):
        st.switch_page("pages/1_Courses.py")
    st.stop()

st.caption(f"{len(passed_courses)} certificate{'s' if len(passed_courses) != 1 else ''} earned")

# Generate certificate PDF
def make_certificate(name: str, course_title: str, completed_at: str, score: int, total: int) -> bytes:
    try:
        from reportlab.lib.pagesizes import landscape, A4
        from reportlab.lib import colors
        from reportlab.lib.units import inch
        from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, HRFlowable
        from reportlab.lib.styles import ParagraphStyle
        from reportlab.lib.enums import TA_CENTER

        buf = io.BytesIO()
        doc = SimpleDocTemplate(buf, pagesize=landscape(A4),
                                 leftMargin=1*inch, rightMargin=1*inch,
                                 topMargin=0.75*inch, bottomMargin=0.75*inch)

        dark = colors.HexColor("#0f0f1a")
        red  = colors.HexColor("#dc2626")
        light = colors.HexColor("#e5e7eb")
        muted = colors.HexColor("#9ca3af")

        def ps(name, size, color=light, bold=False, spacing=6, alignment=TA_CENTER):
            return ParagraphStyle(name, fontSize=size, textColor=color,
                                   fontName="Helvetica-Bold" if bold else "Helvetica",
                                   spaceAfter=spacing, alignment=alignment, leading=size*1.3)

        date_str = datetime.fromisoformat(completed_at).strftime("%B %d, %Y")
        pct = round(score / total * 100) if total else 0

        story = [
            Spacer(1, 0.2*inch),
            Paragraph("LASER SAFETY SERVICES", ps("co", 11, muted, spacing=2)),
            HRFlowable(width="80%", color=red, thickness=1, spaceAfter=12),
            Paragraph("CERTIFICATE", ps("title", 38, light, bold=True, spacing=2)),
            Paragraph("OF COMPLETION", ps("sub", 14, muted, spacing=20)),
            Paragraph("This certifies that", ps("cert", 12, muted, spacing=8)),
            Paragraph(name, ps("name", 32, red, bold=True, spacing=4)),
            HRFlowable(width="50%", color=red, thickness=0.5, spaceAfter=16),
            Paragraph("has successfully completed the course", ps("comp", 12, muted, spacing=8)),
            Paragraph(course_title, ps("ctitle", 20, light, bold=True, spacing=8)),
            Paragraph(f"Score: {score}/{total} &nbsp;({pct}%)", ps("score", 12, colors.HexColor("#22c55e"), spacing=20)),
            HRFlowable(width="80%", color=colors.HexColor("#374151"), thickness=0.5, spaceAfter=12),
            Paragraph(f"Completed: {date_str}", ps("date", 11, muted, spacing=4)),
            Paragraph("This certificate verifies completion of laser safety training in accordance with ANSI Z136 and applicable regulations.",
                       ps("footer", 9, colors.HexColor("#6b7280"), spacing=0)),
        ]

        doc.build(story)
        return buf.getvalue()
    except ImportError:
        return b""


# Show certificate cards
for course in passed_courses:
    prog = get_course_progress(course["id"])
    completed_at = prog.get("completed_at", datetime.now().isoformat())
    score = prog.get("quiz_score", 0)
    total = prog.get("quiz_total", 8)
    pct = round(score / total * 100) if total else 0
    date_str = datetime.fromisoformat(completed_at).strftime("%B %d, %Y")

    with st.container(border=True):
        col_info, col_dl = st.columns([3, 1])
        with col_info:
            st.markdown(f"### {course['icon']} {course['title']}")
            st.caption(f"{course['category']} · Passed {date_str} · Score: {score}/{total} ({pct}%)")
            st.markdown(f"**Awarded to:** {st.session_state['user_name']}")
        with col_dl:
            cert_bytes = make_certificate(
                st.session_state["user_name"],
                course["title"],
                completed_at,
                score,
                total,
            )
            if cert_bytes:
                fname = f"certificate-{course['id']}-{st.session_state['user_name'].replace(' ', '-').lower()}.pdf"
                st.download_button(
                    "⬇️ Download PDF",
                    data=cert_bytes,
                    file_name=fname,
                    mime="application/pdf",
                    use_container_width=True,
                    type="primary",
                    key=f"dl_{course['id']}",
                )
            else:
                st.warning("Install `reportlab` to enable PDF downloads:\n`pip install reportlab`")
