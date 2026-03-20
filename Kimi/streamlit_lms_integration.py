"""
Streamlit ↔ Next.js LMS Integration Helpers

This module provides helper functions for integrating the Next.js LMS
with the existing Streamlit application using link-based navigation.

Usage:
    from streamlit_lms_integration import render_lms_navigation
    
    # In your Streamlit page:
    render_lms_navigation()
"""
import streamlit as st
from typing import Optional

# Default URL configuration
DEFAULT_LMS_URL = "http://localhost:3000"


def get_lms_url() -> str:
    """Get the LMS URL from session state or use default."""
    return st.session_state.get("lms_url", DEFAULT_LMS_URL).rstrip("/")


def render_lms_navigation(
    title: str = "🎓 Interactive LMS",
    show_config: bool = False,
    lms_url: Optional[str] = None,
) -> None:
    """
    Render a navigation section to the Next.js Interactive LMS.
    
    Args:
        title: The title to display for the navigation section
        show_config: Whether to show URL configuration options
        lms_url: Override the LMS URL (uses session state or default if not provided)
    """
    url = lms_url or get_lms_url()
    
    with st.sidebar:
        st.divider()
        st.markdown(f"## {title}")
        
        if show_config:
            new_url = st.text_input(
                "LMS URL",
                value=url,
                key="lms_url_input",
                help="URL where the Next.js LMS is running",
            )
            if new_url != url:
                st.session_state["lms_url"] = new_url
                url = new_url.rstrip("/")
        
        # Quick links to LMS sections
        st.markdown("### Quick Links")
        
        if st.button("🏠 LMS Dashboard", use_container_width=True, key="nav_lms_home"):
            st.markdown(f'<script>window.open("{url}/", "_blank");</script>', unsafe_allow_html=True)
        
        if st.button("📚 Course Catalog", use_container_width=True, key="nav_lms_courses"):
            st.markdown(f'<script>window.open("{url}/courses", "_blank");</script>', unsafe_allow_html=True)
        
        if st.button("🎯 Quiz Practice", use_container_width=True, key="nav_lms_quiz"):
            st.markdown(f'<script>window.open("{url}/quiz-example", "_blank");</script>', unsafe_allow_html=True)
        
        if st.button("🏆 Certificates", use_container_width=True, key="nav_lms_cert"):
            st.markdown(f'<script>window.open("{url}/certificate", "_blank");</script>', unsafe_allow_html=True)
        
        st.link_button(
            "🔗 Open Full LMS →",
            url,
            type="primary",
            use_container_width=True,
        )


def render_lms_card(
    title: str = "🎓 Interactive Learning Modules",
    description: str = "Access the full-featured Next.js LMS with interactive components, simulations, and enhanced UI.",
    lms_url: Optional[str] = None,
) -> None:
    """
    Render a card promoting the Interactive LMS with a CTA button.
    
    Args:
        title: The card title
        description: Description text for the card
        lms_url: Override the LMS URL
    """
    url = lms_url or get_lms_url()
    
    with st.container(border=True):
        st.markdown(f"### {title}")
        st.write(description)
        
        col1, col2 = st.columns([1, 2])
        with col1:
            st.link_button(
                "🚀 Launch Interactive LMS",
                url,
                type="primary",
                use_container_width=True,
            )
        with col2:
            st.caption("Opens in a new tab. Requires the Next.js app to be running.")


def render_lms_banner(
    message: str = "✨ **New:** Try our interactive Next.js LMS with simulations, visualizations, and enhanced learning!",
    lms_url: Optional[str] = None,
) -> None:
    """
    Render a banner promoting the Interactive LMS.
    
    Args:
        message: The banner message (supports markdown)
        lms_url: Override the LMS URL
    """
    url = lms_url or get_lms_url()
    
    st.info(message)
    
    cols = st.columns([1, 1, 3])
    with cols[0]:
        st.link_button("Launch LMS →", url, type="primary", use_container_width=True)
    with cols[1]:
        if st.button("Learn More", use_container_width=True, key="lms_banner_learn"):
            st.switch_page("pages/6_Interactive_LMS.py")


def add_lms_to_main_sidebar() -> None:
    """
    Add LMS navigation to the main app's sidebar.
    Call this function in the main app or pages to add consistent navigation.
    """
    # Store current page for potential return navigation
    if "previous_page" not in st.session_state:
        st.session_state["previous_page"] = "laser_hazard_app.py"
    
    render_lms_navigation()
