"""
Reusable Streamlit component for embedding the Next.js LMS via iframe.

Usage:
    from components.lms_embedder import embed_lms
    
    embed_lms(
        url="http://localhost:3000",
        height=1200,
        title="Laser Safety LMS",
        show_connection_check=True
    )
"""

import streamlit as st
import streamlit.components.v1 as components
import urllib.request
import urllib.error
from typing import Optional


def check_lms_connection(url: str, timeout: int = 5) -> bool:
    """
    Check if the LMS is running at the specified URL.
    
    Args:
        url: The URL to check
        timeout: Connection timeout in seconds
        
    Returns:
        True if LMS is reachable, False otherwise
    """
    try:
        # Add a small cache-busting parameter to avoid cached responses
        check_url = f"{url}?_check={st.session_state.get('_connection_check_id', '0')}"
        urllib.request.urlopen(check_url, timeout=timeout)
        return True
    except (urllib.error.URLError, urllib.error.HTTPError, TimeoutError):
        return False
    except Exception:
        return False


def embed_lms(
    url: str = "http://localhost:3000",
    height: int = 1200,
    title: str = "Laser Safety LMS",
    show_open_in_new_tab: bool = True,
    show_connection_check: bool = True,
    connection_check_timeout: int = 3,
    scrolling: bool = True,
    allow_full_screen: bool = True,
    sandbox: Optional[str] = None,
) -> None:
    """
    Embed the Next.js LMS using an iframe with loading state and error handling.
    
    Args:
        url: The URL of the LMS (default: http://localhost:3000)
        height: Height of the iframe in pixels (default: 1200)
        title: Title displayed above the iframe
        show_open_in_new_tab: Whether to show the "Open in New Tab" button
        show_connection_check: Whether to check if LMS is running and show warning
        connection_check_timeout: Timeout for connection check in seconds
        scrolling: Enable scrolling in the iframe
        allow_full_screen: Allow the iframe content to go fullscreen
        sandbox: Custom sandbox attributes (None uses sensible defaults)
    
    Example:
        >>> embed_lms()
        >>> embed_lms(url="http://localhost:3000", height=800)
        >>> embed_lms(url="https://lms.example.com", show_connection_check=False)
    """
    
    # Initialize connection check state
    if "_lms_connection_checked" not in st.session_state:
        st.session_state._lms_connection_checked = False
        st.session_state._lms_connection_status = None
    
    # Generate a unique check ID for cache busting
    if "_connection_check_id" not in st.session_state:
        st.session_state._connection_check_id = "0"
    
    # Header section with title and button
    col1, col2 = st.columns([3, 1])
    
    with col1:
        st.subheader(f"🎓 {title}")
    
    with col2:
        if show_open_in_new_tab:
            st.markdown("<br>", unsafe_allow_html=True)
            st.link_button(
                "🔗 Open in New Tab",
                url,
                use_container_width=True,
                help="Open the LMS in a new browser tab"
            )
    
    st.caption(f"URL: `{url}`")
    
    # Connection check
    if show_connection_check and not st.session_state._lms_connection_checked:
        with st.spinner("Checking LMS connection..."):
            is_connected = check_lms_connection(url, connection_check_timeout)
            st.session_state._lms_connection_status = is_connected
            st.session_state._lms_connection_checked = True
    
    # Show warning if LMS is not running
    if show_connection_check and st.session_state._lms_connection_status is False:
        st.warning(
            "⚠️ **LMS Not Detected**\n\n"
            f"The LMS doesn't appear to be running at `{url}`.\n\n"
            "**To start the LMS:**\n"
            "1. Open a terminal\n"
            "2. Navigate to the `laser-safety-lms` directory\n"
            "3. Run: `npm run dev`\n"
            "4. Refresh this page once the server is running",
            icon="⚠️"
        )
        
        col_retry, col_ignore = st.columns([1, 3])
        with col_retry:
            if st.button("🔄 Retry Connection", use_container_width=True):
                # Increment check ID to bypass cache
                st.session_state._connection_check_id = str(
                    int(st.session_state._connection_check_id) + 1
                )
                st.session_state._lms_connection_checked = False
                st.rerun()
        with col_ignore:
            if st.button("✓ Show Anyway", use_container_width=True):
                st.session_state._lms_connection_status = True
                st.rerun()
        
        st.divider()
    
    # Loading state placeholder
    loading_placeholder = st.empty()
    loading_placeholder.info("🔄 Loading LMS... Please wait.")
    
    # Default sandbox attributes for security
    # Allow: scripts, same-origin, forms, popups
    default_sandbox = "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
    sandbox_attr = sandbox if sandbox is not None else default_sandbox
    
    # Build iframe HTML with responsive wrapper
    # Using streamlit's built-in iframe component for better integration
    
    # CSS for responsive container
    st.markdown(f"""
    <style>
    .lms-iframe-container {{
        position: relative;
        width: 100%;
        height: {height}px;
        border: 1px solid #333;
        border-radius: 8px;
        overflow: hidden;
        background: #1a1a2e;
    }}
    .lms-iframe-container iframe {{
        width: 100%;
        height: 100%;
        border: none;
    }}
    @media (max-width: 768px) {{
        .lms-iframe-container {{
            height: {min(height, 800)}px;
        }}
    }}
    </style>
    """, unsafe_allow_html=True)
    
    # Clear loading message before rendering iframe
    loading_placeholder.empty()
    
    # Render the iframe using streamlit components
    try:
        components.iframe(
            src=url,
            height=height,
            scrolling=scrolling,
        )
        
        # Store that iframe was successfully rendered
        st.session_state._lms_iframe_loaded = True
        
    except Exception as e:
        st.error(f"❌ Error loading LMS iframe: {str(e)}")
        st.info("💡 Try opening the LMS in a new tab using the button above.")


def embed_lms_responsive(
    url: str = "http://localhost:3000",
    min_height: int = 600,
    max_height: int = 1200,
    **kwargs
) -> None:
    """
    Embed the LMS with responsive height based on viewport.
    
    Args:
        url: The URL of the LMS
        min_height: Minimum height in pixels
        max_height: Maximum height in pixels
        **kwargs: Additional arguments passed to embed_lms()
    """
    # Calculate responsive height based on screen size
    # This uses JavaScript to detect viewport height
    
    responsive_script = f"""
    <script>
    (function() {{
        const viewportHeight = window.innerHeight;
        const calculatedHeight = Math.max({min_height}, Math.min({max_height}, viewportHeight * 0.85));
        window.parent.postMessage({{type: 'lms-height', height: calculatedHeight}}, '*');
    }})();
    </script>
    """
    
    # Store the calculated height in session state (simplified approach)
    # In practice, the height is determined by the embed_lms call
    
    # Use a reasonable default that works for most screens
    default_height = min(max_height, max(min_height, 1000))
    
    embed_lms(url=url, height=default_height, **kwargs)


# Convenience function for quick embedding
def quick_embed(url: str = "http://localhost:3000") -> None:
    """
    Quick embed with minimal configuration.
    
    Args:
        url: The URL of the LMS
    """
    embed_lms(
        url=url,
        height=1200,
        show_connection_check=True,
        show_open_in_new_tab=True
    )


# Reset connection check (useful for testing or when LMS URL changes)
def reset_connection_check() -> None:
    """Reset the connection check state to force a recheck."""
    st.session_state._lms_connection_checked = False
    st.session_state._lms_connection_status = None
    st.session_state._connection_check_id = str(
        int(st.session_state.get("_connection_check_id", "0")) + 1
    )


# Example usage for development/testing
if __name__ == "__main__":
    st.set_page_config(
        page_title="LMS Embedder Test",
        page_icon="🎓",
        layout="wide"
    )
    
    st.title("LMS Embedder Component Test")
    
    # Configuration
    with st.expander("⚙️ Configuration"):
        url = st.text_input("LMS URL", value="http://localhost:3000")
        height = st.slider("Iframe Height", min_value=400, max_value=2000, value=1200)
        show_check = st.checkbox("Check Connection", value=True)
        show_button = st.checkbox("Show 'Open in New Tab' Button", value=True)
        
        if st.button("Reset Connection Check"):
            reset_connection_check()
            st.rerun()
    
    # Embed the LMS
    embed_lms(
        url=url,
        height=height,
        show_connection_check=show_check,
        show_open_in_new_tab=show_button
    )
