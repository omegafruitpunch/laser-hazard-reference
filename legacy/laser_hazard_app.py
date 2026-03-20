"""
Laser Biological Hazard Reference Tool
Built from: ANSI/IEC Laser Classification, OSHA Laser Hazards,
            USAF Aerospace Ophthalmology, and Laser Biological Hazards docs.
Run with: streamlit run laser_hazard_app.py
"""
import os

import streamlit as st
import pandas as pd

st.set_page_config(
    page_title="Laser Biological Hazard Reference",
    page_icon="🔴",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ──────────────────────────────────────────────────────────────────────────────
# DATA
# ──────────────────────────────────────────────────────────────────────────────

WAVELENGTH_EFFECTS = [
    {
        "band": "UV-C",
        "range_nm": "200 – 280",
        "nm_low": 200, "nm_high": 280,
        "color": "#c084fc",
        "eye_effects": "Photokeratitis (arc-eye / welder's flash), conjunctivitis",
        "skin_effects": "Erythema (sunburn), potential skin cancer",
        "primary_tissue": "Cornea, conjunctiva",
        "mechanism": "Photochemical",
        "onset": "Hours after exposure",
        "reversible": "Yes (usually)",
        "notes": "Absorbed in outer 0.1 mm of eye. Does not reach retina. Snow blindness falls here.",
    },
    {
        "band": "UV-B",
        "range_nm": "280 – 315",
        "nm_low": 280, "nm_high": 315,
        "color": "#818cf8",
        "eye_effects": "Photokeratitis, cataract formation (long-term)",
        "skin_effects": "Most injurious to skin — accelerated aging, erythema, DNA damage",
        "primary_tissue": "Cornea, lens (chronic)",
        "mechanism": "Photochemical",
        "onset": "Hours (acute); years (chronic)",
        "reversible": "Acute: Yes. Cataract: No.",
        "notes": "Most hazardous UV band for skin. Absorbed by ozone layer — significant above 125,000 ft.",
    },
    {
        "band": "UV-A",
        "range_nm": "315 – 400",
        "nm_low": 315, "nm_high": 400,
        "color": "#6366f1",
        "eye_effects": "Photochemical and thermal cataract, retinal injury (high irradiance)",
        "skin_effects": "Hyperpigmentation, erythema, skin aging",
        "primary_tissue": "Lens, retina",
        "mechanism": "Photochemical / Thermal",
        "onset": "Chronic exposure for cataract; acute high-power retinal injury",
        "reversible": "Cataract: No. Erythema: Yes.",
        "notes": "Penetrates to lens. Long-term UV-A and blue light exposure linked to cataracts and retinal degeneration.",
    },
    {
        "band": "Visible",
        "range_nm": "400 – 780",
        "nm_low": 400, "nm_high": 780,
        "color": "#22c55e",
        "eye_effects": "Photochemical retinopathy (blue light), thermal retinopathy, macular damage — MOST DANGEROUS ZONE",
        "skin_effects": "Photosensitization reactions, pigmentation",
        "primary_tissue": "Retina (fovea/macula)",
        "mechanism": "Photochemical (400–550 nm) / Thermal (all)",
        "onset": "Immediate (thermal); hours (photochemical)",
        "reversible": "Often NO — permanent macular damage",
        "notes": "Eye focuses this band to a 10–20 µm spot on retina. Radiance amplified ~100,000×. "
                 "Even milliwatt-class visible lasers can cause permanent blindness. "
                 "Blue light (400–550 nm) most photochemically hazardous.",
    },
    {
        "band": "Near IR",
        "range_nm": "780 – 1,400",
        "nm_low": 780, "nm_high": 1400,
        "color": "#f97316",
        "eye_effects": "Thermal retinopathy, thermal cataract — INVISIBLE BEAM, no blink reflex",
        "skin_effects": "Burns (deep thermal)",
        "primary_tissue": "Retina, lens",
        "mechanism": "Thermal",
        "onset": "Immediate",
        "reversible": "No — thermal retinal burns are permanent",
        "notes": "Critically dangerous because beam is invisible — no blink/aversion reflex. "
                 "Nd:YAG (1064 nm) and diode lasers fall here. "
                 "Eye still focuses this band on retina. Nd:YAG can punch through the eye.",
    },
    {
        "band": "Mid IR",
        "range_nm": "1,400 – 3,000",
        "nm_low": 1400, "nm_high": 3000,
        "color": "#ef4444",
        "eye_effects": "Thermal corneal and lens burns (absorbed before reaching retina)",
        "skin_effects": "Thermal burns",
        "primary_tissue": "Cornea, aqueous humor, lens",
        "mechanism": "Thermal",
        "onset": "Immediate",
        "reversible": "Severe burns: No",
        "notes": "Water in eye absorbs strongly. Retina is protected but cornea/lens at direct risk.",
    },
    {
        "band": "Far IR",
        "range_nm": "3,000 – 1,000,000",
        "nm_low": 3000, "nm_high": 1_000_000,
        "color": "#dc2626",
        "eye_effects": "Severe corneal burns, thermal damage",
        "skin_effects": "Deep thermal burns",
        "primary_tissue": "Cornea",
        "mechanism": "Thermal",
        "onset": "Immediate",
        "reversible": "No",
        "notes": "CO₂ laser (10,600 nm) falls here. Fully absorbed by cornea — extreme surface burn risk.",
    },
]

LASER_TYPES = [
    {"name": "Argon Fluoride (ArF)",   "type": "Excimer",      "wavelength_nm": 193,   "band": "UV-C",    "common_use": "Ophthalmology (LASIK), lithography"},
    {"name": "Krypton Chloride (KrCl)","type": "Excimer",      "wavelength_nm": 222,   "band": "UV-C",    "common_use": "Research, disinfection"},
    {"name": "Krypton Fluoride (KrF)", "type": "Excimer",      "wavelength_nm": 248,   "band": "UV-C",    "common_use": "Semiconductor lithography"},
    {"name": "Xenon Chloride (XeCl)",  "type": "Excimer",      "wavelength_nm": 308,   "band": "UV-B",    "common_use": "Dermatology, angioplasty"},
    {"name": "Xenon Fluoride (XeF)",   "type": "Excimer",      "wavelength_nm": 351,   "band": "UV-A",    "common_use": "Research"},
    {"name": "Helium-Cadmium (HeCd)",  "type": "Gas",          "wavelength_nm": 442,   "band": "Visible", "common_use": "Holography, spectroscopy"},
    {"name": "Argon (blue)",           "type": "Gas",          "wavelength_nm": 488,   "band": "Visible", "common_use": "Ophthalmology, printing, pumping"},
    {"name": "Argon (green)",          "type": "Gas",          "wavelength_nm": 515,   "band": "Visible", "common_use": "Ophthalmology, entertainment"},
    {"name": "Copper Vapor",           "type": "Metal vapor",  "wavelength_nm": 570,   "band": "Visible", "common_use": "Dermatology, photography"},
    {"name": "Helium-Neon (HeNe) yellow","type": "Gas",        "wavelength_nm": 594,   "band": "Visible", "common_use": "Research, alignment"},
    {"name": "Helium-Neon (HeNe) red", "type": "Gas",          "wavelength_nm": 633,   "band": "Visible", "common_use": "Barcode scanners, alignment, interferometry"},
    {"name": "Rhodamine 6G Dye",       "type": "Dye (tunable)","wavelength_nm": 590,   "band": "Visible", "common_use": "Research (560–640 nm tunable)"},
    {"name": "GaAlAs Diode",           "type": "Semiconductor","wavelength_nm": 780,   "band": "Visible/Near IR", "common_use": "CD players, laser pointers, communication"},
    {"name": "GaAs Diode",             "type": "Semiconductor","wavelength_nm": 840,   "band": "Near IR", "common_use": "Remote controls, laser pointers, range finders"},
    {"name": "Nd:YAG",                 "type": "Solid state",  "wavelength_nm": 1064,  "band": "Near IR", "common_use": "Cutting, welding, range finding, surgery — MOST DANGEROUS"},
    {"name": "Nd:YAG (frequency doubled)","type": "Solid state","wavelength_nm": 532,  "band": "Visible", "common_use": "Green laser pointers, medical"},
    {"name": "Er:YAG",                 "type": "Solid state",  "wavelength_nm": 2940,  "band": "Mid IR",  "common_use": "Dentistry, dermatology"},
    {"name": "Ho:YAG",                 "type": "Solid state",  "wavelength_nm": 2100,  "band": "Mid IR",  "common_use": "Urology, orthopedics"},
    {"name": "CO₂",                    "type": "Gas",          "wavelength_nm": 10600, "band": "Far IR",  "common_use": "Metal cutting/welding, surgery, materials processing"},
]

LASER_CLASSES = [
    {
        "class": "Class 1",
        "standard": "ANSI Z136.1 / IEC 60825-1",
        "power_limit": "< 0.39 µW (visible, CW)",
        "risk": "Safe",
        "color": "🟢",
        "description": "Safe under all conditions of normal use. Output too low to cause injury even with long-term direct viewing.",
        "examples": "CD/DVD players, laser printers (internally), some barcode scanners",
        "ppe": "No special PPE required",
        "controls": "No special controls required",
    },
    {
        "class": "Class 1M",
        "standard": "IEC 60825-1",
        "power_limit": "< 0.39 µW divergent or < 500 µW large beam",
        "risk": "Safe without optics",
        "color": "🟢",
        "description": "Safe for naked-eye viewing but hazardous if optical instruments (magnifiers, binoculars) are used to collect or focus the beam.",
        "examples": "Some fiber-optic communications, certain surveying equipment",
        "ppe": "No PPE for naked-eye viewing",
        "controls": "Warn against use of optical instruments in beam path",
    },
    {
        "class": "Class 2",
        "standard": "ANSI Z136.1 / IEC 60825-1",
        "power_limit": "≤ 1 mW (visible, 400–700 nm)",
        "risk": "Low — blink reflex protects",
        "color": "🟡",
        "description": "Visible lasers only. Natural aversion response (blink reflex, ~0.25 s) provides adequate eye protection for momentary exposure. Staring into beam is hazardous.",
        "examples": "Low-power laser pointers, some barcode scanners",
        "ppe": "Avoid staring into beam",
        "controls": "Warning label required. Do not stare into beam.",
    },
    {
        "class": "Class 2M",
        "standard": "IEC 60825-1",
        "power_limit": "≤ 1 mW visible, divergent/large beam",
        "risk": "Low without optics",
        "color": "🟡",
        "description": "As Class 2 but beam is divergent or large — hazardous if optical instruments are used.",
        "examples": "Some surveying lasers, alignment tools",
        "ppe": "No staring; avoid optics in beam",
        "controls": "Warning label. Restrict optical instrument use.",
    },
    {
        "class": "Class 3R",
        "standard": "IEC 60825-1 (≈ Class IIIa ANSI)",
        "power_limit": "1–5 mW (visible); 5× Class 1 limit (other wavelengths)",
        "risk": "Low-moderate",
        "color": "🟠",
        "description": "Direct intrabeam viewing is potentially hazardous; risk is low for momentary accidental exposure. Blink reflex may NOT be sufficient.",
        "examples": "Laser pointers (>1 mW), some range finders",
        "ppe": "Avoid direct beam viewing. Consider laser eyewear for extended work.",
        "controls": "Warning label. Controlled beam access. Avoid specular reflections.",
    },
    {
        "class": "Class 3B",
        "standard": "ANSI Z136.1 / IEC 60825-1",
        "power_limit": "5 mW – 500 mW",
        "risk": "Moderate-High — direct viewing HAZARDOUS",
        "color": "🔴",
        "description": "Direct intrabeam viewing is always hazardous. Diffuse reflections generally safe. Skin hazard only at high end. Can ignite some materials.",
        "examples": "Research lasers, some medical lasers, higher-power laser pointers",
        "ppe": "Appropriate laser safety eyewear (OD rated for wavelength) REQUIRED",
        "controls": "Controlled access area. Interlock systems. Beam stops. Posted warnings. Designated LSO.",
    },
    {
        "class": "Class 4",
        "standard": "ANSI Z136.1 / IEC 60825-1",
        "power_limit": "> 500 mW",
        "risk": "SEVERE — eye, skin, and fire hazard",
        "color": "⛔",
        "description": "Direct beam AND diffuse reflections are hazardous. Significant skin burn risk. Can ignite materials and create hazardous fumes during material processing.",
        "examples": "Industrial cutting/welding lasers, surgical lasers, research lasers",
        "ppe": "Certified laser safety eyewear (appropriate OD & wavelength). Skin protection. Fire suppression.",
        "controls": "Restricted area with interlocks. Beam enclosures. Fire-resistant materials. "
                    "Key switch. LSO required. Medical surveillance may be needed.",
    },
]

EYE_COMPONENTS = [
    {
        "component": "Cornea",
        "function": "Primary refracting surface (~70% of eye's refractive power). Living tissue, protected by tear film.",
        "metabolism": "Very high — regenerates in 24–48 hours",
        "hazard_wavelengths": "UV-C (200–280 nm), UV-B (280–315 nm), Far IR (>3,000 nm)",
        "damage_type": "Photokeratitis (UV), thermal burns (Far IR)",
        "reversible": "Usually yes (high metabolism), but severe burns are permanent",
        "notes": "Index of refraction: 1.376. Tear layer 6–10 µm thick. Outer 0.1 mm absorbs all UV.",
    },
    {
        "component": "Iris / Pupil",
        "function": "Adjustable aperture controlling light entry. 7 mm (dim) to 2 mm (bright) diameter.",
        "metabolism": "Moderate",
        "hazard_wavelengths": "Visible, Near IR",
        "damage_type": "Thermal damage to pigmented iris tissue",
        "reversible": "No",
        "notes": "For hazard calculations, 7 mm pupil diameter is used. Pupil diameter decreases with age.",
    },
    {
        "component": "Lens",
        "function": "Fine-tuning focus (~30% of refractive power). Layered like an onion.",
        "metabolism": "Slow — damage effects are delayed (cataracts develop over years)",
        "hazard_wavelengths": "UV-A (315–400 nm), Near IR (780–1,400 nm)",
        "damage_type": "Cataract formation (thermal and photochemical)",
        "reversible": "No — cataracts require surgical replacement",
        "notes": "Hardens and yellows with age. Supported by ciliary muscles (accommodation). Accumulates damage over lifetime.",
    },
    {
        "component": "Retina",
        "function": "Image sensor of the eye — extension of the brain. Rods (night/peripheral) and cones (color/detail).",
        "metabolism": "Moderate, but neurons do NOT regenerate",
        "hazard_wavelengths": "Visible (400–780 nm) and Near IR (780–1,400 nm)",
        "damage_type": "Thermal coagulation (burns), photochemical damage (blue light)",
        "reversible": "NO — retinal neurons are permanent and irreplaceable",
        "notes": "Optical system of eye focuses visible/NIR to a 10–20 µm spot, amplifying irradiance ~100,000×. "
                 "Even a 1 mW visible laser can produce dangerous retinal irradiance.",
    },
    {
        "component": "Macula / Fovea",
        "function": "Highest visual resolution. Fovea contains densest concentration of cones.",
        "metabolism": "High demand, no regeneration",
        "hazard_wavelengths": "Visible, Near IR",
        "damage_type": "Macular hole, central scotoma, foveo-macular scar",
        "reversible": "NO — central vision loss is permanent",
        "notes": "Macula has yellowish pigment filtering blue light. Fovea damage → immediate central vision loss. "
                 "Eclipse blindness produces foveo-macular scar.",
    },
    {
        "component": "Vitreous Humor",
        "function": "Gel filling the eye's interior. Transmits light.",
        "metabolism": "Very low — does not regenerate",
        "hazard_wavelengths": "Near IR (transmits to retina)",
        "damage_type": "Not directly damaged but transmits hazardous NIR to retina",
        "reversible": "N/A",
        "notes": "Transparent to visible and near-IR. Opaque to far-IR. Key to why NIR is so dangerous.",
    },
]

DAMAGE_MECHANISMS = [
    {
        "mechanism": "Thermal",
        "wavelengths": "Near UV to Far IR (0.315 µm – 1 mm)",
        "exposure_time": "> 10 microseconds",
        "description": "Tissue absorbs laser energy → temperature rise → protein denaturation (coagulation/burns). "
                       "Damage is proportional to temperature and duration. Repetitive pulses are additive.",
        "key_factors": "Absorption coefficient, irradiance, exposure duration, blood flow, irradiated area",
        "analogy": "Burning glass effect — eye concentrates beam 100,000× on retina",
    },
    {
        "mechanism": "Photochemical",
        "wavelengths": "UV (0.200–0.400 µm) and Blue visible (0.400–0.550 µm)",
        "exposure_time": "> 10 seconds for blue light; any duration for UV",
        "description": "High-energy photons drive chemical reactions in tissue. Does not require high power — "
                       "low irradiance over long time causes cumulative damage. Affects DNA directly.",
        "key_factors": "Wavelength (shorter = more energetic), total dose (irradiance × time)",
        "analogy": "Sunburn — slow, cumulative, may not be felt until hours later",
    },
    {
        "mechanism": "Thermoacoustic / Photoacoustic",
        "wavelengths": "Any (pulsed lasers)",
        "exposure_time": "< 1 microsecond (nanosecond to picosecond pulses)",
        "description": "Ultrashort pulses deposit energy so rapidly that thermoacoustic shock waves are generated. "
                       "Mechanical disruption of tissue occurs even at low total energy.",
        "key_factors": "Pulse duration, peak power, pulse repetition frequency",
        "analogy": "Sonic boom — the shockwave does more damage than the heat",
    },
]

OSHA_CONTROLS = [
    {"category": "Engineering Controls", "measures": [
        "Beam enclosures and housings for Class IV beams",
        "Interlocking shutters on enclosure doors",
        "Beam stops at end of beam path",
        "Non-reflective, flat-black surfaces in beam area",
        "Remote firing and viewing (cameras instead of direct observation)",
        "Optical density filters and attenuators",
    ]},
    {"category": "Administrative Controls", "measures": [
        "Designated Laser Safety Officer (LSO) — required for Class 3B and 4",
        "Controlled laser use area with posted warning signs",
        "Standard Operating Procedures (SOPs) for each laser",
        "Training and authorization for all laser operators",
        "Laser safety audit and inspection program",
        "Medical surveillance for Class 3B/4 workers (baseline eye exam)",
        "Incident reporting and investigation procedures",
    ]},
    {"category": "PPE — Eye Protection", "measures": [
        "Optical Density (OD) rated eyewear specific to laser wavelength",
        "OD = log₁₀(incident irradiance / MPE) — must exceed this for full protection",
        "Eyewear must be labeled with wavelength range and OD rating",
        "Inspect eyewear for scratches, crazing before each use",
        "Eyewear does NOT protect against direct Class 4 beam at close range",
        "USAF: sunvisors block UV-A/B and visible for aviation applications",
    ]},
    {"category": "Warning & Signage", "measures": [
        "DANGER sign for Class 4 laser areas",
        "CAUTION sign for Class 3 laser areas",
        "NOTICE sign for Class 1 and 2",
        "Signs must include wavelength, class, and output power",
        "Door interlocks or 'Laser On' indicator lights",
    ]},
    {"category": "Non-Beam Hazards (OSHA)", "measures": [
        "Compressed gas safety (cryogenics, high pressure)",
        "Electrical hazards — high voltage power supplies for excimer lasers",
        "Toxic fumes from laser welding/cutting — adequate ventilation required",
        "Fire hazard — beam enclosures rated for irradiances > 10 W/cm²",
        "RF energy from plasma tubes — shield per ANSI C95.1",
        "X-ray emission from high-voltage excimer laser power supplies",
        "Noise from Q-switched or pulsed laser systems",
    ]},
]

RESEARCH_PAPERS = [
    {"year": 2013, "authors": "Löfgren, Thaung, Lopes", "title": "Laser pointers and eye injuries: An analysis of reported cases", "type": "Survey", "notes": "Systematic survey of reported laser pointer injuries"},
    {"year": 2015, "authors": "Thaung, Lopes, Löfgren", "title": "Retinal injuries from handheld lasers: An updated report", "type": "Survey", "notes": "Updated epidemiological report"},
    {"year": 2017, "authors": "Birtel J et al.", "title": "Retinal injury following laser pointer exposure — a systematic review", "type": "Survey", "notes": "Systematic review of laser pointer retinal injuries"},
    {"year": 2019, "authors": "Linton E et al.", "title": "Retinal burns from laser pointers: a risk in children with behavioural problems", "type": "Survey", "notes": "Focus on pediatric risk"},
    {"year": 2007, "authors": "Ajudua S, Mello MJ", "title": "Shedding some light on laser pointer eye injuries", "type": "Case", "notes": ""},
    {"year": 2015, "authors": "Alsulaiman SM et al.", "title": "Full-thickness macular hole secondary to high-power handheld blue laser", "type": "Case", "notes": "Blue laser maculopathy"},
    {"year": 2014, "authors": "Alsulaiman SM et al.", "title": "High-power handheld blue laser-induced maculopathy: the results", "type": "Case", "notes": "Macular damage from blue laser pointers"},
    {"year": 2000, "authors": "ANSI", "title": "American National Standard for Safe Use of Lasers (ANSI Z136.1)", "type": "Standard", "notes": "Primary US laser safety standard"},
    {"year": 1953, "authors": "Amsler M", "title": "Earliest Symptoms of Diseases of the Macula", "type": "Reference", "notes": "Classic reference for macular examination"},
]

# ──────────────────────────────────────────────────────────────────────────────
# SIDEBAR
# ──────────────────────────────────────────────────────────────────────────────

st.sidebar.title("🔴 Laser Hazard Reference")
st.sidebar.markdown("**Sources:**")
st.sidebar.markdown(
    "- OSHA Technical Manual — Laser Hazards\n"
    "- ANSI Z136.1 / IEC 60825-1 Classification\n"
    "- USAF Aerospace Ophthalmology (Ch. 8)\n"
    "- Laser Biological Hazards Documentation\n"
    "- LaserPointerSafety.com Papers Database"
)
st.sidebar.divider()
st.sidebar.warning(
    "⚠️ **For reference only.**\n\nConsult a certified Laser Safety Officer (LSO) "
    "and applicable ANSI/OSHA standards for regulatory compliance."
)

# ──────────────────────────────────────────────────────────────────────────────
# NEW INTERACTIVE LMS NAVIGATION
# ──────────────────────────────────────────────────────────────────────────────
st.sidebar.divider()
st.sidebar.markdown("### 🎓 Learning Management System")

# Visual distinction with emoji and custom styling
st.sidebar.markdown("""
<div style="
    background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
    border: 2px solid #e94560;
    border-radius: 10px;
    padding: 12px;
    margin: 8px 0;
">
    <p style="color: #fff; margin: 0; font-size: 0.9rem;">
        <span style="font-size: 1.2rem;">⚡</span> <strong>NEW: Next.js Interactive LMS</strong>
    </p>
    <p style="color: #aaa; margin: 4px 0 0 0; font-size: 0.75rem;">
        Modern React-based training platform with interactive modules, quizzes, and simulations
    </p>
</div>
""", unsafe_allow_html=True)

# LMS URL configuration - can be set via environment variable or defaults to localhost
LMS_URL = os.environ.get("LASER_LMS_URL", "http://localhost:3000")

# Quick action buttons for the Next.js LMS
st.sidebar.link_button(
    label="🚀 Launch LMS →",
    url=LMS_URL,
    type="primary",
    use_container_width=True,
    help="Opens the new Next.js-based interactive learning platform in a new tab"
)

# Add link to the iframe integration page
if st.sidebar.button("🖼️ Embed View", use_container_width=True, key="sidebar_embed_lms"):
    st.switch_page("pages/6_Interactive_LMS.py")

st.sidebar.markdown("""
<div style="margin-top: 8px; display: flex; gap: 8px;">
    <a href="./1_Courses" target="_self" style="
        flex: 1;
        text-align: center;
        padding: 6px 12px;
        background: #2d2d3a;
        color: #888;
        text-decoration: none;
        border-radius: 6px;
        font-size: 0.8rem;
        border: 1px solid #444;
    ">📚 Streamlit LMS</a>
    <a href="./6_Interactive_LMS" target="_self" style="
        flex: 1;
        text-align: center;
        padding: 6px 12px;
        background: #2d1f1f;
        color: #e94560;
        text-decoration: none;
        border-radius: 6px;
        font-size: 0.8rem;
        border: 1px solid #e94560;
    ">🎓 Interactive</a>
</div>
""", unsafe_allow_html=True)

st.sidebar.caption("💡 Interactive LMS: 8 courses • Simulations • Knowledge graph • Certificates")

# ──────────────────────────────────────────────────────────────────────────────
# TABS
# ──────────────────────────────────────────────────────────────────────────────

tab1, tab2, tab3, tab4, tab5, tab6 = st.tabs([
    "🔍 Wavelength Lookup",
    "📊 Classification (ANSI/IEC)",
    "👁️ Eye Anatomy & Tissue Risk",
    "⚡ Damage Mechanisms",
    "🦺 OSHA Safety Controls",
    "📄 Research Papers",
])

# ── TAB 1: Wavelength Lookup ──────────────────────────────────────────────────
with tab1:
    st.header("Wavelength → Biological Hazard Lookup")
    st.markdown(
        "Enter a laser wavelength to identify biological hazards to the eye and skin."
    )

    col1, col2 = st.columns([1, 2])
    with col1:
        nm_input = st.number_input(
            "Laser Wavelength (nm)",
            min_value=100,
            max_value=1_000_000,
            value=532,
            step=1,
            help="Enter wavelength in nanometers. Example: 532 nm = green Nd:YAG doubled",
        )
        unit = st.radio("Or enter in µm:", ["nm (nanometers)", "µm (micrometers)"])
        if "µm" in unit:
            nm_input = st.number_input("Wavelength (µm)", value=1.064, format="%.4f") * 1000

    # Find matching band
    matched = None
    for band in WAVELENGTH_EFFECTS:
        if band["nm_low"] <= nm_input <= band["nm_high"]:
            matched = band
            break

    # Find matching laser type
    laser_match = None
    for laser in LASER_TYPES:
        if abs(laser["wavelength_nm"] - nm_input) < 15:
            laser_match = laser

    with col2:
        if matched:
            st.subheader(f"Band: {matched['band']} ({matched['range_nm']} nm)")
            danger_color = {"UV-C": "violet", "UV-B": "violet", "UV-A": "blue",
                            "Visible": "green", "Near IR": "orange",
                            "Mid IR": "red", "Far IR": "red"}.get(matched["band"], "gray")

            c1, c2 = st.columns(2)
            with c1:
                st.error(f"👁️ **Eye Effects**\n\n{matched['eye_effects']}")
                st.warning(f"🧴 **Skin Effects**\n\n{matched['skin_effects']}")
            with c2:
                st.info(f"🎯 **Primary Tissue at Risk**\n\n{matched['primary_tissue']}")
                st.info(f"⚡ **Damage Mechanism**\n\n{matched['mechanism']}")

            col3, col4, col5 = st.columns(3)
            col3.metric("Onset", matched["onset"])
            col4.metric("Reversible?", matched["reversible"])
            col5.metric("Spectral Band", matched["band"])

            st.info(f"📝 **Notes:** {matched['notes']}")

            if laser_match:
                st.success(
                    f"🔦 **Common laser at this wavelength:** {laser_match['name']} "
                    f"({laser_match['type']}) — {laser_match['common_use']}"
                )
        else:
            st.error("Wavelength out of documented range (200 nm – 1,000,000 nm)")

    st.divider()
    st.subheader("Full Wavelength Hazard Table")
    df_wave = pd.DataFrame([{
        "Band": b["band"],
        "Range (nm)": b["range_nm"],
        "Primary Tissue": b["primary_tissue"],
        "Mechanism": b["mechanism"],
        "Eye Effects": b["eye_effects"][:60] + "...",
        "Reversible?": b["reversible"],
    } for b in WAVELENGTH_EFFECTS])
    st.dataframe(df_wave, use_container_width=True, hide_index=True)

    st.divider()
    st.subheader("Common Laser Types & Wavelengths")
    df_lasers = pd.DataFrame(LASER_TYPES)
    df_lasers = df_lasers.rename(columns={
        "name": "Laser", "type": "Type", "wavelength_nm": "Wavelength (nm)",
        "band": "Spectral Band", "common_use": "Common Use"
    })
    st.dataframe(df_lasers, use_container_width=True, hide_index=True)


# ── TAB 2: Laser Classification ───────────────────────────────────────────────
with tab2:
    st.header("Laser Classification — ANSI Z136.1 / IEC 60825-1")
    st.markdown(
        "Lasers are classified by their potential to cause biological damage. "
        "Class is determined by wavelength, power/energy, pulse duration, and beam geometry."
    )

    for cls in LASER_CLASSES:
        with st.expander(f"{cls['color']} **{cls['class']}** — {cls['risk']}", expanded=cls["class"] in ["Class 3B", "Class 4"]):
            c1, c2 = st.columns([1, 1])
            with c1:
                st.markdown(f"**Standard:** {cls['standard']}")
                st.markdown(f"**Power/Energy Limit:** {cls['power_limit']}")
                st.markdown(f"**Description:** {cls['description']}")
                st.markdown(f"**Examples:** {cls['examples']}")
            with c2:
                st.markdown(f"**PPE Required:** {cls['ppe']}")
                st.markdown(f"**Engineering/Admin Controls:** {cls['controls']}")


# ── TAB 3: Eye Anatomy & Tissue Risk ─────────────────────────────────────────
with tab3:
    st.header("👁️ Eye Anatomy & Laser Vulnerability")
    st.markdown(
        "The eye's optical system makes it uniquely vulnerable to laser damage. "
        "The cornea, lens, and vitreous focus visible/NIR light to a ~10–20 µm spot on the retina, "
        "amplifying irradiance by approximately **100,000×**."
    )

    col_img, col_info = st.columns([1, 2])
    with col_img:
        try:
            st.image(
                r"C:\Users\total\Documents\Business docs\Lasers\Laser Biological Hazards\eye.bmp",
                caption="Cross-section of the human eye",
                use_container_width=True,
            )
        except Exception:
            st.info("📷 Eye diagram: see eye.bmp in source folder")

    with col_info:
        st.markdown("### Key Optical Components")
        st.markdown(
            "| Component | Refractive Role | Laser Risk |\n"
            "|-----------|----------------|------------|\n"
            "| **Cornea** | 70% of focusing power | UV, Far IR burns |\n"
            "| **Lens** | 30% of focusing power | UV-A cataract, NIR cataract |\n"
            "| **Retina** | Image sensor (neurons) | Visible & NIR — permanent damage |\n"
            "| **Fovea** | Highest resolution center | Loss = central vision blindness |"
        )
        st.error(
            "⚠️ **Retinal damage is permanent.** The retina is an extension of the brain — "
            "its neurons do not regenerate. A single pulse from a Class 3B or 4 laser "
            "can cause irreversible blindness."
        )

    st.divider()
    st.subheader("Component-by-Component Risk Analysis")
    for comp in EYE_COMPONENTS:
        with st.expander(f"**{comp['component']}**", expanded=comp["component"] == "Retina"):
            c1, c2 = st.columns(2)
            with c1:
                st.markdown(f"**Function:** {comp['function']}")
                st.markdown(f"**Metabolism:** {comp['metabolism']}")
                st.markdown(f"**Hazardous Wavelengths:** `{comp['hazard_wavelengths']}`")
            with c2:
                st.markdown(f"**Damage Type:** {comp['damage_type']}")
                rev = comp["reversible"]
                if "NO" in rev.upper():
                    st.error(f"**Reversible:** {rev}")
                else:
                    st.success(f"**Reversible:** {rev}")
                st.markdown(f"**Notes:** {comp['notes']}")

    st.divider()
    st.subheader("Wavelength Penetration Depth in the Eye")
    penetration_data = {
        "Wavelength Band": ["UV-C (200–280)", "UV-B (280–315)", "UV-A (315–400)",
                            "Visible (400–780)", "Near IR (780–1400)", "Mid IR (1400–3000)", "Far IR (>3000)"],
        "Absorbed By": ["Cornea (outer 0.1 mm)", "Cornea + Conjunctiva", "Cornea + Lens",
                        "Retina (via full transmission)", "Retina (via full transmission)", "Cornea + Aqueous", "Cornea"],
        "Reaches Retina?": ["No", "No", "Minimal", "YES ⚠️", "YES ⚠️", "No", "No"],
    }
    st.dataframe(pd.DataFrame(penetration_data), use_container_width=True, hide_index=True)


# ── TAB 4: Damage Mechanisms ──────────────────────────────────────────────────
with tab4:
    st.header("⚡ Biological Damage Mechanisms")
    st.markdown(
        "Laser damage occurs through three primary mechanisms depending on wavelength, "
        "pulse duration, and irradiance."
    )

    for mech in DAMAGE_MECHANISMS:
        with st.expander(f"**{mech['mechanism']}**", expanded=True):
            c1, c2 = st.columns([2, 1])
            with c1:
                st.markdown(f"**Description:** {mech['description']}")
                st.markdown(f"**Key Factors:** {mech['key_factors']}")
                st.info(f"💡 **Analogy:** {mech['analogy']}")
            with c2:
                st.markdown(f"**Wavelengths:** `{mech['wavelengths']}`")
                st.markdown(f"**Exposure Time:** {mech['exposure_time']}")

    st.divider()
    st.subheader("OSHA Biological Effects Summary by Spectral Region")
    bio_effects = {
        "Region": ["UV-C (200–280 nm)", "UV-B (280–315 nm)", "UV-A (315–400 nm)",
                   "Visible (400–780 nm)", "Near IR (780–1400 nm)", "Far IR (>1400 nm)"],
        "Eye": ["Photokeratitis", "Photokeratitis, cataract (chronic)", "Photochem/thermal cataract",
                "Photochem/thermal retinopathy", "Thermal retinopathy, cataract", "Corneal burns"],
        "Skin": ["Erythema, skin cancer", "Most injurious — aging, erythema, DNA", "Hyperpigmentation, erythema",
                 "Pigmentation, photosensitization", "Skin burns", "Deep burns"],
    }
    st.dataframe(pd.DataFrame(bio_effects), use_container_width=True, hide_index=True)

    st.divider()
    st.subheader("USAF Aerospace Considerations")
    st.info(
        "**Altitude Effects on Laser Hazard:**\n"
        "- Above 125,000 ft: UV-B (200–300 nm) no longer filtered by ozone — significant UV-B risk\n"
        "- Above 100,000 ft: Solar irradiance ~13,600 foot-candles (vs ~10,000 at sea level)\n"
        "- Most abiotic (damaging) UV wavelength: **270 nm** — requires protective visor in space\n"
        "- USAF aviators: primary concern is 300–2,100 nm band\n"
        "- Canopies and windscreens block most UV and some IR — critical protection layer\n"
        "- Eclipse blindness (foveo-macular scar): central scotoma, 20/70 or worse VA — permanent"
    )


# ── TAB 5: OSHA Safety Controls ───────────────────────────────────────────────
with tab5:
    st.header("🦺 OSHA Laser Safety Controls")
    st.markdown(
        "Based on OSHA Technical Manual Section III:6 — Laser Hazards. "
        "Controls are applied in a hierarchy: Engineering → Administrative → PPE."
    )

    for ctrl in OSHA_CONTROLS:
        with st.expander(f"**{ctrl['category']}**", expanded=True):
            for measure in ctrl["measures"]:
                st.markdown(f"- {measure}")

    st.divider()
    st.subheader("Quick Class → Required Controls Reference")
    controls_table = {
        "Class": ["1", "1M", "2", "2M", "3R", "3B", "4"],
        "LSO Required": ["No", "No", "No", "No", "Recommended", "YES", "YES"],
        "Eyewear Required": ["No", "No", "No", "No", "Recommended", "YES", "YES"],
        "Controlled Area": ["No", "No", "No", "No", "Recommended", "YES", "YES"],
        "Interlocks": ["No", "No", "No", "No", "No", "Recommended", "YES"],
        "Medical Surveillance": ["No", "No", "No", "No", "No", "Recommended", "YES"],
        "Warning Signs": ["No", "No", "CAUTION", "CAUTION", "CAUTION", "DANGER", "DANGER"],
    }
    st.dataframe(pd.DataFrame(controls_table), use_container_width=True, hide_index=True)

    st.divider()
    st.subheader("Maximum Permissible Exposure (MPE) Concept")
    st.markdown(
        "The **MPE** is the maximum laser irradiance or radiant exposure that the eye or skin "
        "can tolerate without sustaining injury.\n\n"
        "- MPEs are defined in **ANSI Z136.1** for specific wavelengths and exposure durations\n"
        "- MPE for the eye is typically 10–1000× lower than for skin (eye is more sensitive)\n"
        "- **Optical Density (OD)** of eyewear must satisfy: `OD ≥ log₁₀(beam irradiance / MPE)`\n"
        "- MPE is lowest in the **visible and near-IR** range due to retinal focusing effect\n"
        "- For pulsed lasers, both single-pulse and repetitive-pulse MPEs must be evaluated"
    )


# ── TAB 6: Research Papers ───────────────────────────────────────────────────
with tab6:
    st.header("📄 Referenced Research Papers & Standards")
    st.markdown(
        "Selected entries from the Laser Biological Hazards research database "
        "(Spreadsheet-of-papers-surveys-cases-etc.xlsx)."
    )

    filter_type = st.multiselect(
        "Filter by type:",
        options=list(set(p["type"] for p in RESEARCH_PAPERS)),
        default=list(set(p["type"] for p in RESEARCH_PAPERS)),
    )

    filtered = [p for p in RESEARCH_PAPERS if p["type"] in filter_type]
    df_papers = pd.DataFrame(filtered)
    df_papers = df_papers.rename(columns={
        "year": "Year", "authors": "Author(s)", "title": "Title",
        "type": "Type", "notes": "Notes"
    })
    st.dataframe(df_papers, use_container_width=True, hide_index=True)

    st.divider()
    st.subheader("Key Standards Referenced")
    standards = [
        ("ANSI Z136.1", "American National Standard for Safe Use of Lasers — primary US laser safety standard"),
        ("IEC 60825-1", "International standard for laser product safety — used globally, defines classes 1–4"),
        ("OSHA 29 CFR 1910.97", "Nonionizing radiation standard (referenced for laser electrical safety)"),
        ("ACGIH TLVs", "Threshold Limit Values for laser radiation — used for occupational exposure limits"),
        ("AFOSH 127-31", "Air Force Occupational Safety & Health Standard — occupational vision in industrial settings"),
        ("ANSI C95.1", "Safety levels for human exposure to RF electromagnetic fields — for laser plasma tubes"),
    ]
    for std, desc in standards:
        st.markdown(f"- **{std}**: {desc}")


# ──────────────────────────────────────────────────────────────────────────────
# FOOTER
# ──────────────────────────────────────────────────────────────────────────────
st.divider()
st.caption(
    "Built from: OSHA Laser Hazards Technical Manual | ANSI/IEC Laser Classification | "
    "USAF Aerospace Ophthalmology Chapter 8 | Laser Biological Hazards Documentation | "
    "LaserPointerSafety.com Research Database · For reference only — not a substitute for LSO guidance."
)
