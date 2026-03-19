"""Quiz Engine — per-question feedback, 70% pass threshold."""
import streamlit as st
from lms_data.courses import COURSES, get_course
from lms_data.quizzes import QUIZZES
from lms_data.progress import init_progress, save_quiz_result

st.set_page_config(page_title="Quiz — Laser Safety LMS", page_icon="🎯", layout="wide")
init_progress()

with st.sidebar:
    st.markdown("## 🔴 Laser Safety LMS")
    st.page_link("laser_lms_app.py",          label="🏠 Dashboard")
    st.page_link("pages/1_Courses.py",         label="📚 Courses")
    st.page_link("pages/2_Module_Viewer.py",   label="📖 Module Viewer")
    st.page_link("pages/3_Quiz.py",            label="🎯 Quiz")
    st.page_link("pages/4_Certificate.py",     label="🏆 Certificates")
    st.page_link("pages/5_Presentation.py",    label="🎭 Presentation")
    st.divider()
    course_options = {c["title"]: c["id"] for c in COURSES}
    preselect = st.session_state.get("quiz_course", COURSES[0]["id"])
    preselect_title = next((c["title"] for c in COURSES if c["id"] == preselect), COURSES[0]["title"])
    selected_title = st.selectbox("Select Course", list(course_options.keys()),
                                   index=list(course_options.keys()).index(preselect_title))
    course_id = course_options[selected_title]
    if st.button("🔄 Restart Quiz", use_container_width=True):
        for key in [f"quiz_{course_id}_idx", f"quiz_{course_id}_answers",
                    f"quiz_{course_id}_submitted", f"quiz_{course_id}_done"]:
            st.session_state.pop(key, None)
        st.rerun()

course = get_course(course_id)
questions = QUIZZES.get(course_id, [])

if not questions:
    st.error("No quiz found for this course.")
    st.stop()

# ── Quiz state ────────────────────────────────────────────────────────────────
q_idx_key   = f"quiz_{course_id}_idx"
answers_key = f"quiz_{course_id}_answers"
sub_key     = f"quiz_{course_id}_submitted"
done_key    = f"quiz_{course_id}_done"

if q_idx_key not in st.session_state:
    st.session_state[q_idx_key] = 0
if answers_key not in st.session_state:
    st.session_state[answers_key] = [None] * len(questions)
if sub_key not in st.session_state:
    st.session_state[sub_key] = False

# ── Results screen ────────────────────────────────────────────────────────────
if st.session_state.get(done_key):
    answers = st.session_state[answers_key]
    score = sum(1 for i, q in enumerate(questions) if answers[i] == q["answer"])
    total = len(questions)
    pct = round(score / total * 100)
    passed = pct >= 70

    st.markdown(f"## {course['icon']} {course['title']} — Quiz Results")
    if passed:
        st.success(f"🎉 **Passed!** You scored {score}/{total} ({pct}%)")
    else:
        st.error(f"❌ **Not passed.** You scored {score}/{total} ({pct}%) — need 70% to pass.")

    col_score, col_action = st.columns([1, 1])
    with col_score:
        st.metric("Score", f"{pct}%", f"{score}/{total} correct")
        st.progress(pct / 100)

    with col_action:
        if passed:
            st.info("🏆 Certificate available! Go to the Certificates page.")
            if st.button("Get Certificate →", type="primary", use_container_width=True):
                st.switch_page("pages/4_Certificate.py")
        if st.button("🔄 Retry Quiz", use_container_width=True):
            for key in [q_idx_key, answers_key, sub_key, done_key]:
                st.session_state.pop(key, None)
            st.rerun()

    st.divider()
    st.markdown("### Answer Review")
    for i, q in enumerate(questions):
        user_ans = answers[i]
        correct = q["answer"]
        is_correct = user_ans == correct
        with st.expander(f"{'✅' if is_correct else '❌'} Q{i+1}: {q['q'][:80]}..."):
            for j, opt in enumerate(q["options"]):
                if j == correct and j == user_ans:
                    st.markdown(f"✅ **{opt}** ← Your answer (correct)")
                elif j == correct:
                    st.markdown(f"✅ **{opt}** ← Correct answer")
                elif j == user_ans:
                    st.markdown(f"❌ ~~{opt}~~ ← Your answer")
                else:
                    st.markdown(f"&nbsp;&nbsp;&nbsp;{opt}")
            st.info(f"💡 {q['explanation']}")
    st.stop()

# ── Question screen ───────────────────────────────────────────────────────────
q_idx = st.session_state[q_idx_key]
q = questions[q_idx]
submitted = st.session_state[sub_key]

# Header
st.markdown(f"## {course['icon']} {course['title']} — Quiz")
col_prog, col_score_live = st.columns([3, 1])
with col_prog:
    st.progress((q_idx) / len(questions), text=f"Question {q_idx + 1} of {len(questions)}")
with col_score_live:
    answers_so_far = st.session_state[answers_key]
    correct_so_far = sum(1 for i, qq in enumerate(questions[:q_idx]) if answers_so_far[i] == qq["answer"])
    if q_idx > 0:
        st.metric("Score so far", f"{correct_so_far}/{q_idx}")

st.divider()
st.markdown(f"### Q{q_idx + 1}. {q['q']}")

# Answer options
user_choice = st.session_state[answers_key][q_idx]

for j, opt in enumerate(q["options"]):
    label = f"{chr(65 + j)}. {opt}"
    if submitted:
        if j == q["answer"] and j == user_choice:
            st.success(f"✅ {label} ← Correct!")
        elif j == q["answer"]:
            st.success(f"✅ {label} ← Correct answer")
        elif j == user_choice:
            st.error(f"❌ {label} ← Your answer")
        else:
            st.markdown(f"&nbsp;&nbsp;&nbsp;{label}")
    else:
        if st.button(label, key=f"opt_{q_idx}_{j}", use_container_width=True,
                      type="primary" if j == user_choice else "secondary"):
            st.session_state[answers_key][q_idx] = j
            st.rerun()

# Explanation
if submitted:
    correct = user_choice == q["answer"]
    if correct:
        st.success(f"💡 {q['explanation']}")
    else:
        st.warning(f"💡 {q['explanation']}")

    st.divider()
    if q_idx < len(questions) - 1:
        if st.button("Next Question →", type="primary", use_container_width=True):
            st.session_state[q_idx_key] += 1
            st.session_state[sub_key] = False
            st.rerun()
    else:
        if st.button("See Results →", type="primary", use_container_width=True):
            answers = st.session_state[answers_key]
            score = sum(1 for i, qq in enumerate(questions) if answers[i] == qq["answer"])
            passed = score / len(questions) >= 0.7
            save_quiz_result(course_id, score, len(questions), passed)
            st.session_state[done_key] = True
            st.rerun()
else:
    if user_choice is not None:
        if st.button("Submit Answer", type="primary", use_container_width=True):
            st.session_state[sub_key] = True
            st.rerun()
    else:
        st.caption("Select an answer above to continue.")
