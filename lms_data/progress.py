"""Session-state based progress tracking for Laser Safety LMS."""
import streamlit as st
from lms_data.courses import COURSES

TOTAL_MODULES = sum(len(c["modules"]) for c in COURSES)
TOTAL_COURSES = len(COURSES)


def init_progress():
    if "progress" not in st.session_state:
        st.session_state.progress = {}
    if "user_name" not in st.session_state:
        st.session_state.user_name = ""


def get_course_progress(course_id: str) -> dict:
    return st.session_state.progress.get(course_id, {"completed_modules": []})


def is_module_complete(course_id: str, module_id: str) -> bool:
    return module_id in get_course_progress(course_id).get("completed_modules", [])


def mark_module_complete(course_id: str, module_id: str):
    if course_id not in st.session_state.progress:
        st.session_state.progress[course_id] = {"completed_modules": []}
    mods = st.session_state.progress[course_id]["completed_modules"]
    if module_id not in mods:
        mods.append(module_id)


def save_quiz_result(course_id: str, score: int, total: int, passed: bool):
    if course_id not in st.session_state.progress:
        st.session_state.progress[course_id] = {"completed_modules": []}
    from datetime import datetime
    st.session_state.progress[course_id]["quiz_score"] = score
    st.session_state.progress[course_id]["quiz_total"] = total
    st.session_state.progress[course_id]["quiz_passed"] = passed
    if passed:
        st.session_state.progress[course_id]["completed_at"] = datetime.now().isoformat()


def get_overall_stats() -> dict:
    completed_modules = 0
    courses_finished = 0
    for course_prog in st.session_state.get("progress", {}).values():
        completed_modules += len(course_prog.get("completed_modules", []))
        if course_prog.get("quiz_passed"):
            courses_finished += 1
    overall_pct = round(completed_modules / TOTAL_MODULES * 100) if TOTAL_MODULES else 0
    return {
        "completed_modules": completed_modules,
        "total_modules": TOTAL_MODULES,
        "courses_finished": courses_finished,
        "total_courses": TOTAL_COURSES,
        "overall_pct": overall_pct,
    }
