"""
Interactive LMS Integration Page — Approach 1: iframe Embed

This page embeds the Next.js laser-safety-lms application using an iframe.
For this to work, the Next.js app must be running separately (default: http://localhost:3000).

Usage:
1. Start the Next.js app: cd laser-safety-lms && npm run dev
2. Start the Streamlit app: streamlit run laser_hazard_app.py
3. Navigate to this page from the sidebar
"""
import streamlit as st
import streamlit.components.v1 as components
import urllib.request
import socket
import urllib.parse

st.set_page_config(
    page_title="Interactive LMS — Laser Safety",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ──────────────────────────────────────────────────────────────────────────────
# CONFIGURATION
# ──────────────────────────────────────────────────────────────────────────────

# Default URL for the Next.js LMS app
LMS_DEFAULT_URL = "http://localhost:3000"
LMS_PATH_OPTIONS = {
    "Dashboard (Home)": "/",
    "Course Catalog": "/courses",
    "Course 1: Fundamentals": "/courses/course-1",
    "Course 2: FDA Regulations": "/courses/course-2",
    "Course 3: Bioeffects": "/courses/course-3",
    "Course 4: US State Regulations": "/courses/course-4",
    "Course 5: International": "/courses/course-5",
    "Course 6: Outdoor Aviation": "/courses/course-6",
    "Course 7: Event Safety": "/courses/course-7",
    "Course 8: Standards": "/courses/course-8",
    "Quiz Example": "/quiz-example",
    "Certificate": "/certificate",
}

# ──────────────────────────────────────────────────────────────────────────────
# SIDEBAR
# ──────────────────────────────────────────────────────────────────────────────

with st.sidebar:
    st.markdown("## 🔴 Laser Safety LMS")
    st.divider()
    
    # URL Configuration
    st.markdown("### 🔧 LMS Connection")
    lms_url = st.text_input(
        "LMS URL",
        value=st.session_state.get("lms_url", LMS_DEFAULT_URL),
        help="The URL where the Next.js LMS is running",
    )
    st.session_state["lms_url"] = lms_url
    
    selected_path = st.selectbox(
        "Start Page",
        options=list(LMS_PATH_OPTIONS.keys()),
        index=0,
        help="Select which page to display in the embedded LMS",
    )
    
    full_lms_url = lms_url.rstrip("/") + LMS_PATH_OPTIONS[selected_path]
    
    st.divider()
    
    # Quick Actions
    st.markdown("### ⚡ Quick Actions")
    if st.button("🔄 Refresh LMS", use_container_width=True):
        st.rerun()
    
    st.link_button(
        "🔗 Open in New Tab",
        full_lms_url,
        use_container_width=True,
    )
    
    st.divider()
    st.caption("💡 Tip: If the LMS doesn't load, make sure it's running with `npm run dev` in the laser-safety-lms directory.")

# ──────────────────────────────────────────────────────────────────────────────
# HELPERS
# ──────────────────────────────────────────────────────────────────────────────

@st.cache_data(ttl=5)
def check_lms_availability(url: str, timeout: int = 3) -> tuple[bool, str]:
    """Check if the LMS is available at the given URL."""
    try:
        # Parse URL to get host and port
        parsed = urllib.parse.urlparse(url)
        host = parsed.hostname or "localhost"
        port = parsed.port or 3000
        
        # Try socket connection first (fast)
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.settimeout(timeout)
        result = sock.connect_ex((host, port))
        sock.close()
        
        if result != 0:
            return False, f"Cannot connect to {host}:{port}"
        
        # Try HTTP request
        req = urllib.request.Request(
            url,
            method="HEAD",
            headers={"User-Agent": "Streamlit-LMS-Integration"},
        )
        with urllib.request.urlopen(req, timeout=timeout) as response:
            if response.status in (200, 301, 302, 304):
                return True, "LMS is running"
            return False, f"HTTP {response.status}"
    except urllib.error.HTTPError as e:
        # Some servers return 404 for HEAD requests but are still running
        if e.code == 404:
            return True, "LMS is running (404 on HEAD request)"
        return False, f"HTTP Error {e.code}"
    except Exception as e:
        return False, str(e)


# ──────────────────────────────────────────────────────────────────────────────
# MAIN CONTENT
# ──────────────────────────────────────────────────────────────────────────────

st.title("🎓 Interactive Laser Safety LMS")
st.caption("Next.js-powered learning management system with interactive modules")

# Check LMS availability
is_available, status_msg = check_lms_availability(lms_url)

if not is_available:
    # ── FALLBACK CONTENT ──────────────────────────────────────────────────────
    st.error("⚠️ LMS Not Available")
    
    st.markdown(f"""
    ### Status: {status_msg}
    
    The Next.js LMS doesn't appear to be running at `{lms_url}`. 
    
    ### To start the LMS:
    
    1. **Open a terminal/command prompt**
    2. **Navigate to the laser-safety-lms directory:**
       ```bash
       cd laser-safety-lms
       ```
    3. **Install dependencies (first time only):**
       ```bash
       npm install
       ```
    4. **Start the development server:**
       ```bash
       npm run dev
       ```
    5. **Wait for the server to start** (you'll see "Ready" in the terminal)
    6. **Refresh this page** or click the refresh button in the sidebar
    
    ### Alternative: Use Link-Based Navigation
    
    If you prefer to run the LMS separately, click below to open in a new tab:
    """)
    
    col1, col2 = st.columns([1, 3])
    with col1:
        st.link_button("🚀 Open LMS in New Tab", full_lms_url, type="primary")
    with col2:
        if st.button("🔄 Check Again"):
            st.cache_data.clear()
            st.rerun()
    
    st.divider()
    
    # Show what features are available in the LMS
    st.markdown("""
    ### 🎯 Features Available in the Interactive LMS
    
    The Next.js LMS includes these interactive learning modules:
    
    | Course | Interactive Components |
    |--------|----------------------|
    | **Course 1: Fundamentals** | Classification Pyramid, Beam Visualizer, NOHD Calculator, AEL Explorer |
    | **Course 2: FDA Regulations** | Form Selection Wizard, Jurisdiction Mapper, Variance Simulator |
    | **Course 3: Bioeffects** | Eye Anatomy Explorer, MPE Calculator, Eyewear Selection Wizard |
    | **Course 4: US State Regs** | State Matrix, Permit Wizard, Notification Calculator |
    | **Course 5: International** | EU Country Map, IEC Edition Comparator, Permit Calculator |
    | **Course 6: Outdoor/Aviation** | Flight Zone Visualizer, NOTAM Simulator, Safety Calculator |
    | **Course 7: Event Safety** | Venue Assessment Tool, Crowd Calculator, Emergency Simulator |
    | **Course 8: Standards** | Compliance Checker, Audit Simulator, Study Plan Generator |
    
    ### 📚 Continue with Streamlit LMS
    
    You can also use the existing Streamlit-based LMS pages:
    """)
    
    cols = st.columns(4)
    with cols[0]:
        if st.button("📚 Course Catalog", use_container_width=True):
            st.switch_page("pages/1_Courses.py")
    with cols[1]:
        if st.button("📖 Module Viewer", use_container_width=True):
            st.switch_page("pages/2_Module_Viewer.py")
    with cols[2]:
        if st.button("🎯 Take Quiz", use_container_width=True):
            st.switch_page("pages/3_Quiz.py")
    with cols[3]:
        if st.button("🏆 Certificates", use_container_width=True):
            st.switch_page("pages/4_Certificate.py")

else:
    # ── IFRAME EMBED ──────────────────────────────────────────────────────────
    st.success(f"✅ {status_msg}")
    
    # Show current URL
    st.info(f"📍 Loading: **{selected_path}** — `{full_lms_url}`")
    
    # Embed the LMS using iframe
    # Using a reasonable height for the iframe
    iframe_height = 800
    
    components.iframe(
        src=full_lms_url,
        height=iframe_height,
        scrolling=True,
    )
    
    st.divider()
    
    # Navigation hint
    st.caption("""
    💡 **Navigation Tips:**
    - Use the LMS interface above to navigate between courses and modules
    - The embedded LMS maintains its own state (progress, quiz answers, etc.)
    - If you experience display issues, try opening the LMS in a new tab using the sidebar button
    """)
