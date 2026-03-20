"""
Laser Show Operations & Compliance Dashboard
Built from: FDA/CDRH forms & guidance, FAA notification requirements,
            State registration requirements, LSO training materials,
            ANSI Z136.1 definitions, pre-show safety checklists, operation logs.
Run with: python -m streamlit run laser_operations_app.py
"""
import streamlit as st
import pandas as pd
from datetime import date, datetime

st.set_page_config(
    page_title="Laser Show Operations & Compliance",
    page_icon="🎯",
    layout="wide",
    initial_sidebar_state="expanded",
)

# ──────────────────────────────────────────────────────────────────────────────
# DATA
# ──────────────────────────────────────────────────────────────────────────────

FDA_FORMS = [
    {
        "form": "FDA-3147",
        "name": "Variance Application (Laser Light Show)",
        "purpose": "Permission to perform laser light shows using Class IIIb or IV lasers in the USA. Required BEFORE any performance.",
        "submit_to": "CDRH Document Control Center",
        "email": "RadHealthCustomerService@fda.hhs.gov",
        "frequency": "Per show type (not per show). One variance covers a type of show.",
        "notes": "Submit as PDF attachment. Include CDRH variance cover sheet. Can be Original, Renewal, or Amendment.",
        "deadline": "At least 1 month before first performance. Notify by phone ASAP if last-minute, then confirm in writing.",
        "also_required": "Laser Light Show Product Report (FDA-3632) must also be submitted to CDRH",
    },
    {
        "form": "FDA-3632",
        "name": "Laser Show Product Report",
        "purpose": "Certifies that laser shows and/or projectors are compliant with FDA performance standards.",
        "submit_to": "CDRH (NOT to Dockets Management Staff)",
        "email": "RadHealthCustomerService@fda.hhs.gov",
        "frequency": "Per product type / show type",
        "notes": "Required alongside variance application. Submit separately from variance to CDRH.",
        "deadline": "With or before variance application",
        "also_required": "May require separate Laser Projector Product Report if projectors are used",
    },
    {
        "form": "FDA-3636",
        "name": "Annual Report",
        "purpose": "Required annual report of ALL laser activity (shows and projectors used) from July 1 to June 30. Filing this auto-renews a basic variance.",
        "submit_to": "CDRH",
        "email": "RadHealthCustomerService@fda.hhs.gov",
        "frequency": "Annual — due September 1 each year",
        "notes": "Covers July 1–June 30 reporting period. Must summarize all testing and records maintained.",
        "deadline": "September 1 each year",
        "also_required": "None — this is the standalone annual compliance report",
    },
    {
        "form": "FDA-3649",
        "name": "Accidental Radiation Occurrence Report",
        "purpose": "Report any accident, incident, or accidental exposure to a Class III or IV laser beam — even if no injury occurred.",
        "submit_to": "FDA (local authority AND FDA)",
        "email": "RadHealthCustomerService@fda.hhs.gov",
        "frequency": "As needed — report immediately after incident",
        "notes": "MANDATORY if anyone is hurt OR if accidental exposure to Class III/IV beam occurs. Report regardless of whether actual injuries occurred.",
        "deadline": "Immediately / as soon as possible",
        "also_required": "Also notify state/local authority",
    },
    {
        "form": "FDA-3640 / Laser Notice 56",
        "name": "Variance Application Cover Sheet & Supporting Materials",
        "purpose": "Standardized cover sheet for all variance applications submitted to CDRH. Includes checklist for complete submission package.",
        "submit_to": "CDRH Document Control Center",
        "email": "RadHealthCustomerService@fda.hhs.gov",
        "frequency": "With each variance submission",
        "notes": "Implemented September 1, 2020. Submit as separate PDF attachment with your variance application.",
        "deadline": "With variance application",
        "also_required": "FDA-3147 (variance application), FDA-3632 (product report)",
    },
    {
        "form": "CDRH Show Notification",
        "name": "Single-Page Show Notification",
        "purpose": "Notify FDA of upcoming laser show performances. Required at least 1 month in advance.",
        "submit_to": "CDRH",
        "email": "RadHealthCustomerService@fda.hhs.gov",
        "frequency": "Per show (or full tour schedule for traveling shows)",
        "notes": "Can send full tour schedule at once for traveling shows. If last-minute, call first then send written confirmation.",
        "deadline": "At least 1 month in advance (phone if less notice)",
        "also_required": "Also notify state/local radiation control authority",
    },
    {
        "form": "FDA-2877",
        "name": "Declaration for Imported Electronic Products",
        "purpose": "Required for importing laser equipment into the USA. Declares compliance with radiation performance standards (21 CFR 1010 and 1020-1050).",
        "submit_to": "Local FDA district office / U.S. Customs",
        "email": "Local FDA district office",
        "frequency": "Per import shipment",
        "notes": "Select Declaration A (not subject), B (compliant), C (non-compliant research), or D (non-compliant, will be brought into compliance). Class IIIb and IV lasers cannot operate at trade shows under Declaration C.",
        "deadline": "Prior to entry into the United States",
        "also_required": "US Customs entry forms",
    },
    {
        "form": "FAA Form 7140",
        "name": "Notice of Proposed Outdoor Laser Operations",
        "purpose": "Required FAA notification for ANY outdoor unterminated laser show. Must be submitted to the appropriate FAA regional office.",
        "submit_to": "FAA regional office for the show location",
        "email": "Eastern: 9-ATO-ESA-OSG-Lasers-Searchlights@faa.gov | Central: 9-ASW-Operations-Support-Lasers@faa.gov | Western: 9-ATO-WSA-OSG-Lasers@faa.gov",
        "frequency": "Per outdoor show",
        "notes": "FAA will not object: ≤0.5W (Class I-III), or 0.5W–12W if FAA can restrict air traffic. FAA will typically object: >12W. FAA can usually respond within 7 days.",
        "deadline": "At least 2 weeks in advance (4 weeks preferred)",
        "also_required": "FDA show notification also required",
    },
]

STATE_REQUIREMENTS = [
    {"state": "Arizona", "requirement": "Registration required", "agency": "AZ Dept. of Health Services — Radiation Regulatory", "notes": "Specific registration/notification required prior to operating"},
    {"state": "Florida", "requirement": "Specific requirements", "agency": "FL Dept. of Health", "notes": "Contact prior to operating for most recent requirements"},
    {"state": "Illinois", "requirement": "Specific requirements", "agency": "IL Emergency Management Agency — Nuclear/Radiation Safety", "notes": "Contact prior to operating"},
    {"state": "New York", "requirement": "Specific requirements", "agency": "NY Dept. of Labor — Worker Protection", "notes": "Contact prior to operating"},
    {"state": "Massachusetts", "requirement": "Device registration required", "agency": "MA Dept. of Public Health", "notes": "Must register laser device"},
    {"state": "Texas", "requirement": "Registration required", "agency": "TX Dept. of State Health Services — Radiation Control", "notes": "Laser registration required"},
    {"state": "All Other States", "requirement": "General authority", "agency": "State Radiation Control Office", "notes": "All states have authority to act if laser show endangers public health/safety. Notify state radiation control office in writing before operating."},
]

CITY_FIRE_REQUIREMENTS = [
    {"city": "Orlando, FL", "agency": "Orlando Fire Dept. / Orange County Fire", "notes": "Fire department notification/permit required"},
    {"city": "Cleveland, OH", "agency": "Cleveland Fire Dept.", "notes": "Fire department notification/permit required"},
    {"city": "Las Vegas, NV", "agency": "Clark County Fire", "notes": "Fire department notification/permit required"},
    {"city": "Portland, OR", "agency": "Portland Fire & Rescue", "notes": "Fire department notification/permit required"},
    {"city": "Palm Springs, CA", "agency": "Palm Springs Fire Dept.", "notes": "Fire department notification/permit required"},
]

FAA_THRESHOLDS = [
    {"power": "≤ 0.5 W (Class I, II, III)", "faa_stance": "✅ No objection", "condition": "As long as aircraft fly no closer than 1,000 ft over congested areas or outdoor assembly"},
    {"power": "0.5 W – 12 W (Class IV)", "faa_stance": "⚠️ No objection IF notified", "condition": "Must inform FAA of location, time, and laser output. FAA must be able to restrict air traffic in the area."},
    {"power": "> 12 W", "faa_stance": "❌ FAA will typically object", "condition": "Rarely needed for effective show. Could require extensive air traffic restrictions."},
]

FAA_REGIONS = [
    {"region": "Eastern", "states": "CT, DE, DC, ME, MD, MA, NH, NJ, NY, PA, RI, VA, VT, WV", "email": "9-ATO-ESA-OSG-Lasers-Searchlights@faa.gov"},
    {"region": "Central (Southwest)", "states": "AR, CO, KS, LA, MO, NE, NM, OK, TX", "email": "9-ASW-Operations-Support-Lasers@faa.gov"},
    {"region": "Western", "states": "AK, AZ, CA, GU, HI, ID, MT, NV, OR, UT, WA, WY", "email": "9-ATO-WSA-OSG-Lasers@faa.gov"},
    {"region": "Southern", "states": "AL, FL, GA, KY, MS, NC, SC, TN", "email": "Contact Southern Regional FAA Office"},
    {"region": "Great Lakes / Central", "states": "IL, IN, IA, MI, MN, ND, OH, SD, WI", "email": "Contact Great Lakes Regional FAA Office"},
]

PRESHOW_CHECKLIST = {
    "Initial Startup": [
        "Turn on control computer, start laser software, power up laser control electronics",
        "Turn on main power to lasers (if applicable)",
        "Remove any spectators from the area; caution all qualified technicians near the projector",
        "Check that all shrouds and masking are in place",
        "Verify laser projector is secure",
        "Check key switch for proper operation (try to start with key in OFF position, then turn to ON)",
        "Push 'Laser On' button on each laser controller display — record time on",
        "Observe that emission indicator lights (on laser head) come on",
        "Confirm E-STOP button operation",
        "Verify proper interlock/laser shutter operation",
    ],
    "Laser Alignment": [
        "Keep spectators and all non-essential personnel away from projector and termination area",
        "Verify visual control of entire projection space from the operation location",
        "Verify physical masking is in place to prevent laser emissions from reaching public areas",
        "Alert personnel that laser alignment is about to take place",
        "Check each scanner set for proper operation and adjust offset as needed for alignment",
        "Ensure all surfaces on which beams terminate are free from specular reflection",
        "Ensure that front of projector is properly masked — mask off any unnecessary openings",
    ],
    "Final Setup Check": [
        "All beams must be minimum 8'3\" lateral distance AND 9'10\" vertical distance from floor to lowest beam over audience",
        "Ensure markings and barrier are in place to prevent access to the projector",
        "Check and verify communication with all laser spotter personnel",
        "Check setup grids on the projection surface and adjust offset for differences",
        "Eliminate sources of any stray light at high power",
        "Record operating beam power at each projector on the Safety Survey Record",
    ],
    "During Performance": [
        "Be constantly alert for audience unruliness during the performance",
        "If any beam misalignment or stray light develops — turn that beam position OFF",
        "If a laser spotter makes a call — immediately respond",
        "If any equipment malfunction develops affecting safe performance — terminate immediately until resolved",
    ],
    "Post Performance": [
        "Turn off the laser power supply and remove keys to the lock box",
        "Turn off laser projectors first, then control electronics, then computers",
        "Record Time Off",
        "Note any equipment malfunction that developed during the show",
        "All reasonable efforts should be made to repair any malfunction before next show",
    ],
}

OUTDOOR_ADDITIONAL = [
    "Make FAA calls 2 hours prior to show time (for outdoor unterminated shows)",
    "Verify communication with all outdoor observers/spotters",
    "Check beam alignment for outdoor conditions (wind, atmospheric effects)",
    "Verify interlocks and connections are secure for outdoor environment",
    "Record FAA confirmation / notification number",
]

NOTIFICATION_CHECKLIST = [
    ("FDA/CDRH", "Show notification at least 1 month in advance", "RadHealthCustomerService@fda.hhs.gov"),
    ("FDA/CDRH", "Variance approval on file (Class IIIb or IV)", "RadHealthCustomerService@fda.hhs.gov"),
    ("State Radiation Control", "Written notification to state in advance", "See state-specific agency"),
    ("Local Authority", "Facility manager informed of laser class and variance status", "Venue contact"),
    ("FAA", "FAA Form 7140 submitted if outdoor unterminated show", "Regional FAA office email"),
    ("City Fire Dept.", "Fire department permit/notification if in required city", "Local fire dept."),
    ("LSO Designated", "Laser Safety Officer assigned and present for all operations", "Internal"),
    ("Variance Documents", "Accession number and variance number available on-site", "Internal records"),
]

ANSI_DEFINITIONS = [
    ("Accessible Emission Limit (AEL)", "The maximum accessible emission level permitted within a particular laser class."),
    ("Aversion Response / Blink Reflex", "Closure of the eyelid or movement of the head to avoid bright light. Assumed to occur within 0.25 seconds. The basis for Class 2 laser safety."),
    ("Beam Diameter", "Distance between diametrically opposed points where power per unit area is 1/e (0.368) times peak power per unit area."),
    ("Coherent", "A light beam where the electric vector at any point is related to that at any other point by a definite, continuous function. Laser light is coherent — ordinary light is not."),
    ("Controlled Area", "An area where occupancy and activity of those within is subject to control and supervision for radiation hazard protection."),
    ("Diffuse Reflection", "Change of spatial distribution of a beam when reflected in many directions by a surface. Less hazardous than specular reflection for high-power lasers."),
    ("Divergence (φ)", "The plane angle projection of the cone including 63.2% of the total radiant energy. Laser beams have very low divergence — this is what makes them dangerous over distance."),
    ("Embedded Laser", "An enclosed laser with an assigned class higher than the system it's incorporated into, where engineering features limit accessible emission."),
    ("Fail-Safe Interlock", "An interlock where failure of a single mechanical or electrical component causes the system to go into or remain in a safe mode."),
    ("Intrabeam Viewing", "The viewing condition where the eye is exposed to all or part of a laser beam. The most hazardous exposure condition."),
    ("Irradiance", "Radiant power incident per unit area upon a surface, expressed in W/cm². Also called power density."),
    ("Laser Safety Officer (LSO)", "One who has authority to monitor and enforce control of laser hazards and effect the knowledgeable evaluation and control of laser hazards."),
    ("Laser Pointer", "A Class II or Class IIIa laser product, usually handheld, emitting a low-divergence visible beam of less than 5 mW."),
    ("Limiting Aperture (Df)", "The maximum diameter of a circle over which radiance and radiant exposure are averaged for hazard evaluation and classification."),
    ("Macula", "The small, uniquely pigmented specialized area of the retina used for acute central vision (best visual acuity). Damage = loss of central vision."),
    ("Maximum Permissible Exposure (MPE)", "The level of laser radiation to which a person may be exposed without hazardous effect or adverse biological changes in the eye or skin."),
    ("Nominal Hazard Zone (NHZ)", "The space within which the level of direct, reflected, or scattered radiation during normal operation exceeds the applicable MPE."),
    ("Nominal Ocular Hazard Distance (NOHD)", "The distance beyond which the beam irradiance/radiant exposure is not expected to exceed the MPE. Laser is 'safe' beyond this distance."),
    ("Optical Density (OD)", "Logarithm base 10 of the reciprocal of transmittance: OD = -log₁₀(τ). Higher OD = more protection. OD 3 = 0.1% transmission."),
    ("Q-Switched Laser", "A laser emitting very short (~10–250 ns), high-power pulses. Extremely hazardous due to peak power."),
    ("Retinal Hazard Region", "Optical radiation with wavelengths between 0.4 and 1.4 µm, where the principal hazard is to the retina."),
    ("Scanning Laser", "A laser with a time-varying direction, origin, or pattern of propagation. Scanning reduces exposure time and is a key safety technique."),
    ("Specular Reflection", "A mirror-like reflection. A specularly reflected laser beam can be nearly as hazardous as the direct beam."),
    ("Standard Operating Procedure (SOP)", "Formal written description of safety and administrative procedures for performing a specific task. Required for FDA variance."),
    ("Variance", "Permission from FDA to deviate from one or more requirements of a laser performance standard when alternate steps are taken to assure safety. Required for Class IIIb and IV laser shows."),
]

# ──────────────────────────────────────────────────────────────────────────────
# SIDEBAR
# ──────────────────────────────────────────────────────────────────────────────
st.sidebar.title("🎯 Laser Show Ops")
st.sidebar.markdown("**Compliance & Operations Dashboard**")
st.sidebar.divider()
st.sidebar.markdown("**Key Contacts:**")
st.sidebar.markdown("📧 **FDA/CDRH:** RadHealthCustomerService@fda.hhs.gov")
st.sidebar.markdown("📞 **FDA Dockets:** 240-402-7500")
st.sidebar.markdown("📞 **Regulations.gov Help:** 1-877-378-5457")
st.sidebar.divider()
st.sidebar.markdown("**Key Deadlines:**")
st.sidebar.markdown("- FDA Show Notification: **1 month prior**")
st.sidebar.markdown("- FAA Notification: **2–4 weeks prior**")
st.sidebar.markdown("- FAA Outdoor Call: **2 hours prior**")
st.sidebar.markdown("- Annual Report: **September 1**")
st.sidebar.divider()
st.sidebar.warning("⚠️ For reference only. Verify current requirements with FDA/CDRH and applicable state agencies.")

# ──────────────────────────────────────────────────────────────────────────────
# TABS
# ──────────────────────────────────────────────────────────────────────────────
tab1, tab2, tab3, tab4, tab5, tab6, tab7 = st.tabs([
    "✅ Pre-Show Checklist",
    "📋 FDA Forms Guide",
    "🗺️ State & Local Requirements",
    "✈️ FAA Notifications",
    "📊 Operation Log",
    "📅 Compliance Calendar",
    "📖 Terminology (ANSI Z136.1)",
])

# ── TAB 1: Pre-Show Checklist ─────────────────────────────────────────────────
with tab1:
    st.header("Pre-Show Safety & Compliance Checklist")

    col1, col2, col3 = st.columns(3)
    with col1:
        show_name = st.text_input("Show Name / Location")
    with col2:
        show_date = st.date_input("Show Date", value=date.today())
    with col3:
        operator = st.text_input("Operator Name")
    show_type = st.radio("Show Type:", ["Indoor", "Outdoor (Unterminated)"], horizontal=True)

    st.divider()

    # Notification checklist
    st.subheader("📬 Pre-Show Notification Requirements")
    notif_results = {}
    for agency, req, contact in NOTIFICATION_CHECKLIST:
        col_a, col_b = st.columns([3, 1])
        with col_a:
            st.markdown(f"**{agency}** — {req}")
            st.caption(f"Contact: {contact}")
        with col_b:
            notif_results[req] = st.checkbox("Done", key=f"notif_{req}")

    if show_type == "Outdoor (Unterminated)":
        st.info("🛩️ **Outdoor Show Additional Requirements:** FAA Form 7140 must be submitted. Make FAA call 2 hours before show time.")

    st.divider()

    # Safety checklist
    st.subheader("🔦 Safety Setup Checklist")
    all_checked = {}
    for phase, items in PRESHOW_CHECKLIST.items():
        with st.expander(f"**{phase}**", expanded=(phase == "Initial Startup")):
            for item in items:
                all_checked[item] = st.checkbox(item, key=f"check_{item}")

    if show_type == "Outdoor (Unterminated)":
        with st.expander("**Outdoor Additional Steps**", expanded=True):
            for item in OUTDOOR_ADDITIONAL:
                all_checked[item] = st.checkbox(item, key=f"out_{item}")

    total = len(all_checked)
    checked = sum(all_checked.values())
    progress = checked / total if total > 0 else 0
    st.divider()
    st.progress(progress, text=f"Checklist Progress: {checked}/{total} items complete")
    if checked == total:
        st.success("✅ All checklist items complete — show is cleared to proceed!")
    elif checked >= total * 0.8:
        st.warning(f"⚠️ {total - checked} items remaining before show is cleared.")
    else:
        st.error(f"🚫 {total - checked} items incomplete. Do not start show until checklist is complete.")

    st.divider()
    if show_name and operator:
        st.markdown(f"**Operator Signature:** {operator} &nbsp;&nbsp;&nbsp; **Show:** {show_name} &nbsp;&nbsp;&nbsp; **Date:** {show_date}")


# ── TAB 2: FDA Forms Guide ────────────────────────────────────────────────────
with tab2:
    st.header("FDA/CDRH Forms & Submission Guide")
    st.markdown(
        "All forms are submitted by email to **RadHealthCustomerService@fda.hhs.gov** as separate PDF attachments. "
        "You no longer need to separately mail applications to Dockets Management Staff."
    )

    for form in FDA_FORMS:
        with st.expander(f"**{form['form']}** — {form['name']}", expanded=False):
            col1, col2 = st.columns(2)
            with col1:
                st.markdown(f"**Purpose:** {form['purpose']}")
                st.markdown(f"**Submit To:** {form['submit_to']}")
                st.markdown(f"**Email:** `{form['email']}`")
                st.markdown(f"**Frequency:** {form['frequency']}")
            with col2:
                st.warning(f"⏰ **Deadline:** {form['deadline']}")
                st.info(f"📝 **Notes:** {form['notes']}")
                if form['also_required']:
                    st.markdown(f"**Also Required:** {form['also_required']}")

    st.divider()
    st.subheader("📦 Complete Variance Application Package")
    st.markdown("""
A complete FDA variance application package requires **three separate PDF attachments**:

| # | Document | Form |
|---|---------|------|
| 1 | CDRH Variance Cover Sheet | FDA-3640 |
| 2 | Variance Application / Justification Letter | FDA-3147 (for laser light shows) |
| 3 | Supporting Materials | Product reports, NHZ diagrams, SOPs, show notifications, QC checklists |

**Submit all to:** RadHealthCustomerService@fda.hhs.gov

Once submitted, CDRH Document Control Center will:
- Issue acknowledgement letters with **Accession numbers**
- Forward to FDA's Dockets Management Staff, who will issue a **Docket number**

Both numbers should be kept on file and available at all performances.
""")

    st.divider()
    st.subheader("🔄 Variance Types")
    var_types = {
        "Original": "First-time variance application for a new type of show or laser product",
        "Renewal": "Renewal of an existing variance. Basic variances auto-renew when Annual Report (FDA-3636) is filed by September 1.",
        "Amendment": "Changes to an existing variance (new equipment, new show type, new location type)",
    }
    for vtype, desc in var_types.items():
        st.markdown(f"- **{vtype}:** {desc}")

    st.divider()
    st.subheader("⚠️ Penalties for Non-Compliance")
    st.error(
        "Operating laser light shows without an approved FDA variance or in violation of the FDA laser safety standard may result in:\n"
        "- **Court injunction** to halt operations\n"
        "- **Civil penalties up to $300,000** (Section 360C of the Radiation Control for Health and Safety Act)\n"
        "- **State/local authority action** — states have closed down non-compliant shows\n"
        "- **FDA inspection** — FDA representatives must be allowed to inspect equipment and safety procedures"
    )


# ── TAB 3: State & Local Requirements ────────────────────────────────────────
with tab3:
    st.header("🗺️ State & Local Laser Show Requirements")
    st.markdown(
        "Beyond FDA and FAA requirements, individual states and cities have their own registration, "
        "notification, or licensing requirements. **Contact each jurisdiction BEFORE operating.**"
    )

    st.subheader("States with Specific Requirements")
    df_states = pd.DataFrame(STATE_REQUIREMENTS)
    df_states.columns = ["State", "Requirement", "Agency", "Notes"]
    st.dataframe(df_states, use_container_width=True, hide_index=True)

    st.divider()
    st.subheader("Cities Requiring Fire Department Notification/Permit")
    df_cities = pd.DataFrame(CITY_FIRE_REQUIREMENTS)
    df_cities.columns = ["City", "Agency", "Notes"]
    st.dataframe(df_cities, use_container_width=True, hide_index=True)

    st.divider()
    st.subheader("What to Provide to State Radiation Control Offices")
    st.markdown("""
When notifying state authorities, provide the following **in writing** from the Laser Safety Officer:

1. Name, address, and phone number of **Laser Safety Officer(s) / operator(s)**
2. Name, address, and phone number of **auditorium/facility and manager**
3. **Type of laser show**
4. **Date(s) and time** of performance
5. **Length of time** laser will be in operation
6. **Expected attendance**
7. **Class of laser** and name of manufacturer
8. **Sketches** describing the design/layout of the show
9. If Class IIIb or IV: **FDA variance accession number and date of approval**
""")

    st.divider()
    st.subheader("Facility Manager Responsibilities")
    st.info("""
**Facility managers** hosting laser shows must:
- Verify the laser operator has an **approved FDA variance** (accession + variance number) for Class IIIb/IV lasers
- Ensure a **Laser Safety Officer** is designated and present during all laser operation
- Allow laser groups **setup time without public present** (may take several hours + up to 2 additional hours for FDA inspection)
- **Report any accident** to the state authority and FDA
- Verify the laser product has a **class label** affixed
""")


# ── TAB 4: FAA Notifications ──────────────────────────────────────────────────
with tab4:
    st.header("✈️ FAA Notification Requirements")
    st.markdown(
        "The **Federal Aviation Administration must be notified** before any outdoor unterminated laser show. "
        "Even low risk shows require notification so FAA can restrict air traffic if needed."
    )

    st.subheader("Power Thresholds & FAA Response")
    for t in FAA_THRESHOLDS:
        col1, col2 = st.columns([1, 2])
        with col1:
            st.markdown(f"**{t['power']}**")
            st.markdown(t['faa_stance'])
        with col2:
            st.markdown(t['condition'])
        st.divider()

    st.subheader("FAA Regional Offices")
    df_faa = pd.DataFrame(FAA_REGIONS)
    df_faa.columns = ["Region", "States Covered", "Email"]
    st.dataframe(df_faa, use_container_width=True, hide_index=True)

    st.divider()
    st.subheader("FAA Notification Process")
    st.markdown("""
1. **Identify** which FAA regional office has jurisdiction over your show location (see table above)
2. **Submit** FAA Form 7140 (Notice of Proposed Outdoor Operations) in writing
3. **Timeline:** At least **2 weeks** in advance — **4 weeks preferred**
4. FAA can usually respond with a determination within **7 days**
5. For **outdoor shows within the notification window**, call FAA **2 hours prior** to the show
6. Keep FAA acknowledgement/confirmation number in your operation log

**If near an airport:** FAA may object even at low power levels due to landing/takeoff risk.

**Form 7140 Download:** [faa.gov/documentLibrary/media/form/faa7140-1.pdf](https://www.faa.gov/documentLibrary/media/form/faa7140-1.pdf)
""")


# ── TAB 5: Operation Log ──────────────────────────────────────────────────────
with tab5:
    st.header("📊 Operation Log")
    log_type = st.radio("Log Type:", ["Indoor Projector Log", "Outdoor Laser Log"], horizontal=True)
    st.caption("Fill in the fields below. Export by copying the table or taking a screenshot.")

    period_start = st.date_input("Period Start", value=date.today())
    period_end = st.date_input("Period End", value=date.today())

    st.divider()

    if log_type == "Indoor Projector Log":
        st.subheader("Indoor Projector Operation Log")
        num_rows = st.number_input("Number of entries", min_value=1, max_value=20, value=3)
        indoor_data = []
        for i in range(num_rows):
            with st.expander(f"Entry {i+1}", expanded=(i==0)):
                c1, c2, c3 = st.columns(3)
                entry_date = c1.date_input("Date", value=date.today(), key=f"idate_{i}")
                entry_op = c2.text_input("Operator", key=f"iop_{i}")
                entry_loc = c3.text_input("Location", key=f"iloc_{i}")
                c4, c5, c6 = st.columns(3)
                time_on = c4.text_input("Time Laser On", key=f"iton_{i}")
                time_off = c5.text_input("Time Laser Off", key=f"itoff_{i}")
                power = c6.text_input("Output Power (W)", key=f"ipow_{i}")
                c7, c8, c9, c10 = st.columns(4)
                shutter = c7.selectbox("Shutter OK?", ["✅ Yes", "❌ No", "N/A"], key=f"ishu_{i}")
                scanner = c8.selectbox("Scanner OK?", ["✅ Yes", "❌ No", "N/A"], key=f"iscan_{i}")
                beam_term = c9.selectbox("Beam Term Safe?", ["✅ Yes", "❌ No", "N/A"], key=f"ibt_{i}")
                beam_block = c10.selectbox("Beam Blocks OK?", ["✅ Yes", "❌ No", "N/A"], key=f"ibb_{i}")
                notes = st.text_area("Notes/Comments", key=f"inotes_{i}", height=60)
                indoor_data.append({
                    "Date": entry_date, "Operator": entry_op, "Location": entry_loc,
                    "On": time_on, "Off": time_off, "Power(W)": power,
                    "Shutter": shutter, "Scanner": scanner, "Beam Term": beam_term,
                    "Beam Blocks": beam_block, "Notes": notes
                })
        if indoor_data:
            st.dataframe(pd.DataFrame(indoor_data), use_container_width=True, hide_index=True)

    else:
        st.subheader("Outdoor Laser Operation Log")
        num_rows = st.number_input("Number of entries", min_value=1, max_value=20, value=3)
        outdoor_data = []
        for i in range(num_rows):
            with st.expander(f"Entry {i+1}", expanded=(i==0)):
                c1, c2 = st.columns(2)
                entry_date = c1.date_input("Date", value=date.today(), key=f"odate_{i}")
                entry_op = c2.text_input("Operator", key=f"oop_{i}")
                c3, c4, c5 = st.columns(3)
                faa_call = c3.selectbox("FAA Call Made 2hrs Prior?", ["✅ Yes", "❌ No", "N/A"], key=f"ofaa_{i}")
                time_on = c4.text_input("Time Laser On", key=f"oton_{i}")
                time_off = c5.text_input("Time Laser Off", key=f"otoff_{i}")
                c6, c7, c8, c9 = st.columns(4)
                beam_block = c6.selectbox("Beam Blocks OK?", ["✅ Yes", "❌ No"], key=f"obb_{i}")
                shutter = c7.selectbox("Shutter OK?", ["✅ Yes", "❌ No"], key=f"oshu_{i}")
                scanner = c8.selectbox("Scanner OK?", ["✅ Yes", "❌ No"], key=f"oscan_{i}")
                beam_align = c9.selectbox("Beam Align Safe?", ["✅ Yes", "❌ No"], key=f"oba_{i}")
                c10, c11 = st.columns(2)
                interlocks = c10.selectbox("Interlocks Secure?", ["✅ Yes", "❌ No"], key=f"oint_{i}")
                comms = c11.selectbox("Comms w/ Observers?", ["✅ Yes", "❌ No"], key=f"ocom_{i}")
                power = st.text_input("Output Power (W)", key=f"opow_{i}")
                notes = st.text_area("Comments/Concerns", key=f"onotes_{i}", height=60)
                outdoor_data.append({
                    "Date": entry_date, "Operator": entry_op, "FAA Call": faa_call,
                    "On": time_on, "Off": time_off, "Power(W)": power,
                    "Beam Blocks": beam_block, "Shutter": shutter, "Scanner": scanner,
                    "Beam Align": beam_align, "Interlocks": interlocks, "Comms": comms, "Notes": notes
                })
        if outdoor_data:
            st.dataframe(pd.DataFrame(outdoor_data), use_container_width=True, hide_index=True)


# ── TAB 6: Compliance Calendar ────────────────────────────────────────────────
with tab6:
    st.header("📅 Annual Compliance Calendar")
    st.markdown("Key deadlines for laser show operators to maintain FDA variance and compliance.")

    current_year = date.today().year
    next_year = current_year + 1

    calendar_items = [
        {"deadline": f"September 1, {current_year}", "item": "FDA Annual Report Due (FDA-3636)", "description": f"Report covers July 1, {current_year-1} – June 30, {current_year}. Filing auto-renews basic variance.", "priority": "🔴 CRITICAL"},
        {"deadline": "At least 1 month before each show", "item": "FDA Show Notification", "description": "Written notification to CDRH before each new show/tour. Phone if last-minute, then confirm in writing.", "priority": "🔴 CRITICAL"},
        {"deadline": "At least 2–4 weeks before outdoor show", "item": "FAA Form 7140 Submission", "description": "Submit to appropriate FAA regional office for any outdoor unterminated laser show.", "priority": "🔴 CRITICAL"},
        {"deadline": "2 hours before outdoor show", "item": "FAA Pre-Show Call", "description": "Call FAA 2 hours prior to outdoor show time to confirm notification.", "priority": "🟠 IMPORTANT"},
        {"deadline": "Before each show in a new state", "item": "State Radiation Control Notification", "description": "Written notification to state radiation control office. AZ, FL, IL, NY, MA, TX have specific registration requirements.", "priority": "🔴 CRITICAL"},
        {"deadline": "Before each show in a regulated city", "item": "City Fire Department Permit", "description": "Required in: Orlando FL, Cleveland OH, Las Vegas NV, Portland OR, Palm Springs CA.", "priority": "🔴 CRITICAL"},
        {"deadline": "Before any new show type", "item": "FDA Variance Application / Amendment", "description": "If launching a new type of show or modifying existing show type. Variance must be approved BEFORE performance.", "priority": "🔴 CRITICAL"},
        {"deadline": "Before importing laser equipment", "item": "FDA Form 2877 (Import Declaration)", "description": "Required for all laser equipment imported into the USA.", "priority": "🟠 IMPORTANT"},
        {"deadline": "After any incident", "item": "Accidental Radiation Occurrence Report (FDA-3649)", "description": "Report ANY accidental exposure to Class III/IV laser — even if no injury. Report to FDA AND local authority.", "priority": "🔴 CRITICAL"},
        {"deadline": "Ongoing", "item": "Operation Logs", "description": "Maintain indoor and outdoor operation logs for all shows. Required for FDA compliance.", "priority": "🟡 ONGOING"},
        {"deadline": "Ongoing", "item": "QC Safety Checklists", "description": "Complete safety checklist at time of each laser activity. Keep records.", "priority": "🟡 ONGOING"},
        {"deadline": "Ongoing", "item": "LSO Present at All Shows", "description": "A designated Laser Safety Officer must be present and responsible for shutting down laser if unsafe conditions occur.", "priority": "🟡 ONGOING"},
    ]

    for item in calendar_items:
        with st.expander(f"{item['priority']} {item['item']} — {item['deadline']}"):
            st.markdown(item['description'])

    st.divider()
    st.subheader("Annual Report Period")
    st.info("""
**FDA Annual Report (FDA-3636):**
- **Reporting Period:** July 1 – June 30
- **Due Date:** September 1 each year
- **Covers:** All laser shows performed AND all laser projectors used during the period
- **Effect:** Filing this report **automatically renews** your basic variance for another year
- **Submit to:** RadHealthCustomerService@fda.hhs.gov
""")


# ── TAB 7: Terminology ────────────────────────────────────────────────────────
with tab7:
    st.header("📖 Laser Terminology Reference (ANSI Z136.1-2000)")
    st.caption("Definitions from the American National Standard for Safe Use of Lasers — used in FDA variance applications and compliance documents.")

    search = st.text_input("🔍 Search terms", placeholder="e.g. MPE, NHZ, variance, LSO...")

    filtered = [(term, defn) for term, defn in ANSI_DEFINITIONS
                if not search or search.lower() in term.lower() or search.lower() in defn.lower()]

    if not filtered:
        st.warning("No matching terms found.")
    else:
        for term, defn in filtered:
            with st.expander(f"**{term}**"):
                st.markdown(defn)

    st.divider()
    st.subheader("Quick Reference: Key Units")
    units = {
        "Watt (W)": "Unit of power (radiant flux). 1 W = 1 joule/second. Used to rate laser output.",
        "Milliwatt (mW)": "1/1000 of a watt. Class 2 limit = 1 mW. Class 3R = 5 mW. Class 3B = 500 mW.",
        "Joule (J)": "Unit of energy. 1 J = 1 W × 1 second. Used for pulsed laser characterization.",
        "Nanometer (nm)": "1 billionth of a meter. Unit for wavelength. Visible light: 400–700 nm.",
        "Micrometer (µm)": "1 millionth of a meter. Nd:YAG = 1.064 µm. CO₂ = 10.6 µm.",
        "W/cm²": "Irradiance (power density). Used to express MPE limits.",
        "J/cm²": "Radiant exposure. Used to express MPE limits for pulsed lasers.",
        "Optical Density (OD)": "Eyewear protection rating. OD 1 = 10% transmission. OD 3 = 0.1% transmission. OD 5 = 0.001% transmission.",
        "mrad": "Milliradians. Unit for beam divergence. 1 mrad = 1 mm spread per meter of distance.",
    }
    for unit, desc in units.items():
        st.markdown(f"- **{unit}:** {desc}")


# ──────────────────────────────────────────────────────────────────────────────
# FOOTER
# ──────────────────────────────────────────────────────────────────────────────
st.divider()
st.caption(
    "Built from: FDA/CDRH Forms & Guidance · FAA Form 7140 · ANSI Z136.1-2000 Definitions · "
    "LSO Training Materials · Pre-Show Safety Checklists · USA Instructions for FDA-FAA-States · "
    "Laser Light Show Safety 'Who's Responsible?' (FDA HHS Publication 86-8262) · "
    "For reference only — verify current requirements with FDA/CDRH and applicable state agencies."
)
