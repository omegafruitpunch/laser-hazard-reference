# Next.js LMS ↔ Streamlit Integration Guide

This guide explains how to integrate the Next.js Interactive Laser Safety LMS with the existing Streamlit application.

## Overview

Two integration approaches are provided:

| Approach | Description | Best For |
|----------|-------------|----------|
| **Approach 1: iframe Embed** | Embed the Next.js app directly within a Streamlit page | Users who want integrated navigation |
| **Approach 2: Link-Based** | Open the Next.js app in a new browser tab | Separate deployment, full-screen experience |

---

## Prerequisites

1. **Node.js** (v18 or higher) and **npm** installed
2. **Python** with Streamlit installed (`pip install streamlit`)
3. The `laser-safety-lms` Next.js app in the project directory

---

## Approach 1: iframe Embed (Integrated View)

### Files Created/Modified

- `pages/6_Interactive_LMS.py` — New Streamlit page with iframe embed
- `laser-safety-lms/next.config.ts` — Updated to allow iframe embedding

### Setup Instructions

1. **Install Next.js dependencies** (first time only):
   ```bash
   cd laser-safety-lms
   npm install
   ```

2. **Start the Next.js development server**:
   ```bash
   cd laser-safety-lms
   npm run dev
   ```
   Wait for "Ready" message. The app runs at `http://localhost:3000` by default.

3. **Start the Streamlit app** (in a new terminal):
   ```bash
   streamlit run laser_hazard_app.py
   ```

4. **Access the integrated LMS**:
   - Open the Streamlit app in your browser
   - Click **"🖼️ Embed View"** in the sidebar, or
   - Navigate to **"Interactive LMS"** from the sidebar pages

### Features

- **Configurable URL**: Change the LMS URL in the sidebar if running on a different port/host
- **Page Selection**: Choose which LMS page to display (Dashboard, Courses, Quiz, etc.)
- **Fallback Content**: Shows helpful instructions if the LMS isn't running
- **Health Check**: Automatically detects if the LMS is available

### iframe Configuration

The Next.js app has been configured with the following headers in `next.config.ts`:

```typescript
headers: [
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'self' http://localhost:* https://localhost:*;",
  },
]
```

For production deployment, update these headers to match your domain.

---

## Approach 2: Link-Based Navigation (Separate Tab)

### Files Created/Modified

- `pages/1_Courses.py` — Added LMS sidebar navigation
- `pages/2_Module_Viewer.py` — Added LMS sidebar navigation  
- `pages/3_Quiz.py` — Added LMS sidebar navigation
- `pages/4_Certificate.py` — Added LMS sidebar navigation
- `pages/5_Presentation.py` — Added LMS link button
- `laser_hazard_app.py` — Added main sidebar LMS section
- `Kimi/streamlit_lms_integration.py` — Reusable integration helpers

### Setup Instructions

1. **Start the Next.js app**:
   ```bash
   cd laser-safety-lms
   npm run dev
   ```

2. **Start the Streamlit app**:
   ```bash
   streamlit run laser_hazard_app.py
   ```

3. **Use the LMS links**:
   - Look for **"🎓 Interactive LMS"** sections in page sidebars
   - Click **"🚀 Launch LMS →"** buttons to open in new tabs
   - Each page has context-aware links (e.g., Course Viewer links to the current course)

### Helper Module Usage

For custom pages, use the helper module:

```python
from streamlit_lms_integration import render_lms_navigation, render_lms_card

# Add sidebar navigation
render_lms_navigation()

# Or add a promotional card in main content
render_lms_card()
```

---

## Environment Configuration

### Custom LMS URL

Set the `LASER_LMS_URL` environment variable to use a different URL:

```bash
# Linux/macOS
export LASER_LMS_URL=http://localhost:3000

# Windows PowerShell
$env:LASER_LMS_URL="http://localhost:3000"

# Windows CMD
set LASER_LMS_URL=http://localhost:3000
```

Or configure per-session in Streamlit:
1. Go to **"Interactive LMS"** page
2. Enter your custom URL in the sidebar

---

## Production Deployment

### Option A: Same Server (iframe approach)

1. Build the Next.js app:
   ```bash
   cd laser-safety-lms
   npm run build
   npm start  # Production server
   ```

2. Update `next.config.ts` with your production domain:
   ```typescript
   value: "frame-ancestors 'self' https://your-domain.com;",
   ```

3. Run Streamlit on the same origin (or use a reverse proxy)

### Option B: Separate Deployment (link approach)

1. Deploy Next.js app to Vercel/Netlify/your server
2. Update `LASER_LMS_URL` environment variable in Streamlit deployment
3. Use link-based navigation only

---

## Troubleshooting

### "LMS Not Available" Error

**Cause**: The Next.js app isn't running or isn't accessible.

**Solution**:
1. Check if the LMS is running: `cd laser-safety-lms && npm run dev`
2. Verify the URL in the sidebar matches where the LMS is running
3. Check for firewall/proxy issues

### iframe Refused to Connect

**Cause**: Content Security Policy blocking the embed.

**Solution**:
1. Ensure `next.config.ts` has the correct `frame-ancestors` directive
2. For local development, use `http://localhost:3000`
3. Check browser console for CSP errors

### Session State Not Shared

**Note**: The Streamlit and Next.js apps maintain separate session states. Progress in one won't reflect in the other. This is expected behavior for this integration approach.

---

## File Structure

```
laser-hazard-reference/
├── laser_hazard_app.py           # Main Streamlit app (updated)
├── laser-safety-lms/             # Next.js LMS app
│   ├── next.config.ts            # Updated for iframe support
│   └── ...
├── pages/
│   ├── 1_Courses.py              # Updated with LMS nav
│   ├── 2_Module_Viewer.py        # Updated with LMS nav
│   ├── 3_Quiz.py                 # Updated with LMS nav
│   ├── 4_Certificate.py          # Updated with LMS nav
│   ├── 5_Presentation.py         # Updated with LMS link
│   └── 6_Interactive_LMS.py      # NEW: iframe embed page
├── Kimi/
│   └── streamlit_lms_integration.py  # NEW: Helper module
└── INTEGRATION_GUIDE.md          # This file
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Start Next.js dev server | `cd laser-safety-lms && npm run dev` |
| Start Streamlit app | `streamlit run laser_hazard_app.py` |
| Build Next.js for production | `cd laser-safety-lms && npm run build` |
| Set custom LMS URL | `export LASER_LMS_URL=http://localhost:3001` |

---

## Support

For issues with:
- **Next.js LMS**: Check the `laser-safety-lms/README.md`
- **Streamlit integration**: Review this guide and the inline code comments
- **iframe/CSP issues**: Verify `next.config.ts` headers match your deployment setup
