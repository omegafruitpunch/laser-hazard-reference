"""Quiz questions for all 8 courses.
Includes hand-written questions supplemented by AI-generated quiz banks.
"""
import os
import json


def _load_bank_questions(path: str, format: str = "auto") -> list:
    """Load and convert quiz bank JSON into the standard {q, options, answer, explanation} format."""
    try:
        with open(path, encoding="utf-8") as f:
            data = json.load(f)
    except Exception:
        return []

    # Unwrap nested quiz_bank key
    if "quiz_bank" in data:
        data = data["quiz_bank"]

    questions = data.get("questions", [])
    result = []
    for q in questions:
        q_type = q.get("type", "multiple_choice")
        # Skip multiple_select (can't render cleanly in current engine)
        if q_type == "multiple_select":
            continue

        # Field name variations
        text = q.get("question") or q.get("text") or q.get("q", "")
        options = q.get("options", [])
        correct = q.get("correct_answer") if "correct_answer" in q else q.get("correct") if "correct" in q else q.get("correctIndex")
        expl_right = q.get("explanation_correct") or q.get("explanation", "")
        expl = expl_right or q.get("explanation_incorrect", "")

        if q_type == "true_false":
            options = ["True", "False"]
            correct = 0 if correct is True else 1

        if not text or not options or correct is None:
            continue
        result.append({"q": text, "options": options, "answer": int(correct), "explanation": expl})
    return result


def _bank(course_folder: str, filename: str) -> list:
    """Shortcut to load a quiz bank relative to lms_data/quiz_banks/."""
    base = os.path.join(os.path.dirname(__file__), "quiz_banks", course_folder, filename)
    return _load_bank_questions(base)


# ── Bank questions (loaded once at import) ────────────────────────────────────
_c1_extra = _bank("course-1", "lso-role_quiz.json")          # 30 q
_c5_extra = _bank("course-5", "modules-4-5-6-quiz.json")     # 18 q
_c8_extra = _bank("course-8", "quiz_bank.json")              # 15 q

QUIZZES = {
    "course-1": [
        {"q": "What is the primary ocular hazard associated with visible and near-infrared laser wavelengths?",
         "options": ["Corneal burns", "Retinal damage", "Lens opacity", "Iris damage"],
         "answer": 1,
         "explanation": "The retina is most vulnerable for visible/near-IR wavelengths. The eye's optics focus the beam to a tiny spot on the retina, concentrating energy enormously."},
        {"q": "Which laser class requires the most stringent safety controls?",
         "options": ["Class 1", "Class 2", "Class 3R", "Class 4"],
         "answer": 3,
         "explanation": "Class 4 lasers are high-power devices that can cause immediate eye and skin injuries, ignite fires, and even make diffuse reflections hazardous."},
        {"q": "What does NOHD stand for?",
         "options": ["Normal Optical Hazard Distance", "Nominal Ocular Hazard Distance", "Non-Optical Hazard Determination", "Nominal Output Hazard Distance"],
         "answer": 1,
         "explanation": "NOHD (Nominal Ocular Hazard Distance) is the distance along the beam axis at which irradiance falls to the MPE level."},
        {"q": "Who is responsible for overseeing the laser safety program?",
         "options": ["The show promoter", "The venue manager", "The Laser Safety Officer (LSO)", "The local fire marshal"],
         "answer": 2,
         "explanation": "The LSO is the designated individual with authority and responsibility to monitor and enforce laser hazard controls, including authority to halt unsafe operations."},
        {"q": "What is the Maximum Permissible Exposure (MPE)?",
         "options": ["The maximum power a laser can legally produce", "The level of laser radiation to which a person may be exposed without harm", "The maximum distance a laser beam can travel safely", "The highest optical density eyewear available"],
         "answer": 1,
         "explanation": "MPE is the level of laser radiation to which an unprotected person may be exposed without adverse biological effects. It is wavelength-, duration-, and tissue-dependent."},
        {"q": "Which type of control measure is preferred in laser safety hierarchy?",
         "options": ["Administrative controls", "Personal Protective Equipment", "Engineering controls", "Training programs"],
         "answer": 2,
         "explanation": "Engineering controls (enclosures, interlocks, beam stops) are preferred because they do not rely on human behavior to be effective."},
        {"q": "Class 2 lasers rely on what natural protective mechanism for safety?",
         "options": ["Skin tanning response", "The blink/aversion reflex", "Pupil constriction", "Tear production"],
         "answer": 1,
         "explanation": "Class 2 lasers emit low-power visible light (≤1mW). The natural blink/aversion reflex (~0.25 sec) provides adequate protection under normal viewing conditions."},
        {"q": "What standard defines LSO qualifications and responsibilities in the US?",
         "options": ["21 CFR 1040", "IEC 60825-1", "ANSI Z136.1", "OSHA 29 CFR 1910"],
         "answer": 2,
         "explanation": "ANSI Z136.1 is the primary US standard that defines LSO duties, laser classification, MPE values, and control measures."},
    ],
    "course-2": [
        {"q": "Which regulation governs laser product performance in the United States?",
         "options": ["ANSI Z136.1", "21 CFR 1040", "IEC 60825-1", "OSHA 29 CFR 1910.97"],
         "answer": 1,
         "explanation": "21 CFR 1040 sets federal performance standards for laser products sold in the US, enforced by FDA's CDRH."},
        {"q": "What must an entertainment laser operator obtain from the FDA for Class IIIb/IV shows?",
         "options": ["A product registration", "A variance", "A safety certification", "A permit from CDRH"],
         "answer": 1,
         "explanation": "Operators must obtain a variance from FDA performance standards to use Class IIIb/IV lasers for entertainment where beams may be directed at or near audiences."},
        {"q": "What does Laser Notice 50 primarily address?",
         "options": ["Laser product labeling requirements", "Audience scanning with high-power lasers", "Laser disposal procedures", "Import/export of laser equipment"],
         "answer": 1,
         "explanation": "Laser Notice 50 provides FDA guidance on using Class IIIb and IV lasers for audience scanning in entertainment, establishing exposure criteria."},
        {"q": "Within how many days must manufacturers report laser product defects that could cause injury?",
         "options": ["7 days", "15 days", "30 days", "60 days"],
         "answer": 2,
         "explanation": "Under 21 CFR 803, manufacturers must submit a mandatory report within 30 days of learning of a malfunction that could cause serious injury if it recurred."},
        {"q": "Which agency enforces 21 CFR 1040?",
         "options": ["OSHA", "EPA", "FDA's Center for Devices and Radiological Health (CDRH)", "FCC"],
         "answer": 2,
         "explanation": "FDA's Center for Devices and Radiological Health (CDRH) enforces 21 CFR 1040 and administers the electronic product radiation control program."},
        {"q": "If a state has stricter laser regulations than federal FDA standards, which applies?",
         "options": ["Federal standards always supersede state standards", "State standards apply — states can be stricter than federal minimums", "Operators can choose which standard to follow", "Neither — the operator must petition for a compromise standard"],
         "answer": 1,
         "explanation": "States can impose requirements stricter than federal minimums. Operators must comply with both federal standards AND any applicable stricter state requirements."},
        {"q": "A variance from FDA is granted to whom?",
         "options": ["The laser manufacturer", "The specific operator for specific show types", "Any licensed laser technician", "The venue where shows are held"],
         "answer": 1,
         "explanation": "FDA variances are granted to specific operators (not equipment or venues) for specific show types described in the application. They are not transferable."},
        {"q": "What is FDA Form 3632 used for?",
         "options": ["Reporting laser injuries", "Applying for a variance", "Reporting laser product introductions by manufacturers", "Requesting an FDA inspection"],
         "answer": 2,
         "explanation": "FDA Form 3632 is used by manufacturers to report the introduction of new laser products to FDA as required under 21 CFR 1040."},
    ],
    "course-3": [
        {"q": "Which part of the eye is most at risk from visible (400-700nm) laser exposure?",
         "options": ["Cornea", "Lens", "Retina", "Iris"],
         "answer": 2,
         "explanation": "The eye's optics focus visible laser light onto the retina, concentrating beam energy enormously. Retinal damage is often immediate, painless, and permanent."},
        {"q": "What type of damage do UV lasers (200-400nm) primarily cause to the eye?",
         "options": ["Retinal burns", "Corneal and lens damage", "Vitreous humor heating", "Optic nerve damage"],
         "answer": 1,
         "explanation": "UV wavelengths are absorbed by anterior eye structures — primarily the cornea and lens. UV exposure can cause photokeratitis and contribute to cataract formation."},
        {"q": "MPE values for eye exposure are generally _____ than for skin exposure.",
         "options": ["Higher", "Lower", "The same", "Not comparable"],
         "answer": 1,
         "explanation": "Eye MPE values are significantly lower (stricter) than skin MPE values for the same conditions, because the eye's focusing optics concentrate the beam to a tiny retinal spot."},
        {"q": "What does Optical Density (OD) measure in laser safety eyewear?",
         "options": ["The thickness of the lens material", "The transmission percentage of the lens", "The attenuation factor (log10) for laser radiation", "The wavelength range covered by the eyewear"],
         "answer": 2,
         "explanation": "OD is the log10 of the ratio of incident to transmitted irradiance. OD 3 means the lens transmits 1/1000 of incident laser radiation."},
        {"q": "For pulsed laser systems, what must be evaluated for MPE compliance?",
         "options": ["Only the peak power", "Only the average power", "Both single-pulse MPE and repetitive-pulse MPE", "Only the total energy per session"],
         "answer": 2,
         "explanation": "Pulsed systems must be evaluated against both single-pulse MPE (individual pulse energy) and the repetitive-pulse MPE (accounts for thermal summation at high rep rates)."},
        {"q": "At what skin temperature does thermal injury typically begin to occur?",
         "options": ["37°C", "40°C", "45°C", "60°C"],
         "answer": 2,
         "explanation": "Thermal injury to skin begins when tissue temperature exceeds approximately 45°C for sustained periods."},
        {"q": "Why is laser retinal damage often described as painless?",
         "options": ["The retina has no blood supply", "The retina lacks pain receptors (nociceptors)", "The damage is too small to trigger pain", "The brain filters out laser-induced pain signals"],
         "answer": 1,
         "explanation": "The retina has no pain receptors. Retinal burns from laser exposure cause no pain, so injury can occur without the victim being immediately aware."},
        {"q": "IEC 60825-1 is best described as:",
         "options": ["A US federal regulation", "The primary international laser product safety standard", "An OSHA workplace safety rule", "A voluntary industry guideline only"],
         "answer": 1,
         "explanation": "IEC 60825-1 is the primary international standard for laser product safety, defining accessible emission limits, classification, and labeling requirements."},
    ],
    "course-4": [
        {"q": "Which California agency requires registration of Class IIIb and IV lasers?",
         "options": ["Cal/OSHA", "California Air Resources Board", "California Department of Public Health (CDPH)", "California PUC"],
         "answer": 2,
         "explanation": "The California Department of Public Health (CDPH) administers the radiation control program and requires registration of Class IIIb/IV lasers used professionally."},
        {"q": "Nevada has specific regulations particularly relevant to which city's laser show industry?",
         "options": ["Reno", "Las Vegas", "Henderson", "Carson City"],
         "answer": 1,
         "explanation": "Nevada's laser regulations are particularly significant for the Las Vegas entertainment market. Clark County has additional requirements beyond state regulations."},
        {"q": "Which state is noted for having one of the most comprehensive state laser regulation programs?",
         "options": ["California", "New York", "Massachusetts", "Florida"],
         "answer": 2,
         "explanation": "Massachusetts requires Laser Radiation Safety Permits for all Class 3B/4 uses, with detailed safety plan submissions and active inspection programs."},
        {"q": "NYC laser show operators must submit safety plans to which local authority?",
         "options": ["NYC Police Department", "NYC Department of Buildings", "NYC Fire Department", "NYC Department of Health"],
         "answer": 2,
         "explanation": "New York City requires laser show operators to submit safety plans to the NYC Fire Department, which has jurisdiction over public assembly occupancy hazards."},
        {"q": "What unique consideration applies to Colorado laser shows at high-altitude venues?",
         "options": ["Lower humidity reduces beam scatter", "Reduced atmospheric absorption affects hazard distances", "Higher UV levels require stricter controls", "Altitude permits relaxed MPE values"],
         "answer": 1,
         "explanation": "At high altitude, reduced atmospheric density means less beam attenuation over distance, potentially extending hazard distances vs sea-level calculations."},
        {"q": "Florida entertainment laser shows require advance notification to which state agency?",
         "options": ["Florida DEP", "Florida Department of Health", "Florida Division of Emergency Management", "Florida Public Service Commission"],
         "answer": 1,
         "explanation": "The Florida Department of Health administers radiation control and requires advance notification for entertainment laser shows."},
        {"q": "What does CRCPD stand for?",
         "options": ["Council for Radiation Control and Public Disclosure", "Conference of Radiation Control Program Directors", "Committee for Regional Compliance and Policy Development", "Center for Radiological and Chemical Products Division"],
         "answer": 1,
         "explanation": "CRCPD (Conference of Radiation Control Program Directors) develops Suggested State Regulations (SSRs) used as a model by many state radiation control programs."},
        {"q": "In Illinois, which agency regulates lasers under its radiation protection program?",
         "options": ["Illinois EPA", "Illinois Emergency Management Agency (IEMA)", "Illinois Department of Labor", "Illinois Department of Commerce"],
         "answer": 1,
         "explanation": "The Illinois Emergency Management Agency (IEMA) administers the state's radiation protection program, including registration requirements."},
        {"q": "Texas entertainment laser operators must comply with which requirements?",
         "options": ["Only federal FDA variance requirements", "Only Texas state radiation control requirements", "Both state requirements AND federal FDA variance requirements", "Only local municipal ordinances"],
         "answer": 2,
         "explanation": "Texas operators must comply with Texas DSHS registration requirements AND federal FDA variance requirements for entertainment use of Class IIIb/IV lasers."},
        {"q": "Washington State requires what type of documentation for laser operators?",
         "options": ["FDA clearance letters", "Safety training documentation", "International standards certifications", "CRCPD membership certificates"],
         "answer": 1,
         "explanation": "Washington State DOH requires documentation of safety training for laser operators as part of its registration requirements."},
    ],
    "course-5": [
        {"q": "Which EU Directive governs worker exposure to artificial optical radiation?",
         "options": ["2006/25/EC", "2004/40/EC", "2014/35/EU", "89/391/EEC"],
         "answer": 0,
         "explanation": "EU Directive 2006/25/EC on minimum health and safety requirements regarding worker exposure to physical agents (artificial optical radiation) applies to laser workers."},
        {"q": "What replaced CE marking in the UK domestic market after Brexit?",
         "options": ["UK Safety Mark", "UKCA marking", "BSI certification", "HSE approval"],
         "answer": 1,
         "explanation": "UKCA (UK Conformity Assessed) marking replaced CE marking for products placed on the UK domestic market after Brexit."},
        {"q": "Canada regulates laser products under which legislation?",
         "options": ["Health Protection Act", "Radiation Emitting Devices Act (REDA)", "Canada Safety Standards Act", "Nuclear Safety and Control Act"],
         "answer": 1,
         "explanation": "Health Canada regulates laser products under the Radiation Emitting Devices Act (REDA), which sets performance standards for laser products sold in Canada."},
        {"q": "Which IEC technical committee is responsible for laser safety standards?",
         "options": ["TC62", "TC76", "TC99", "TC34"],
         "answer": 1,
         "explanation": "IEC Technical Committee 76 (TC76) is responsible for laser safety standards, including the IEC 60825 series."},
        {"q": "AS/NZS 2211 is the laser safety standard for which region?",
         "options": ["Asia Pacific", "Australia and New Zealand", "Southeast Asia", "Africa and South Pacific"],
         "answer": 1,
         "explanation": "AS/NZS 2211 is the joint Australian/New Zealand laser safety standard series, adopting IEC 60825 with Australasian-specific modifications."},
        {"q": "Which edition of IEC 60825-1 is the current international baseline?",
         "options": ["Edition 1 (1993)", "Edition 2 (2007)", "Edition 3 (2014)", "Edition 4 (2021)"],
         "answer": 2,
         "explanation": "IEC 60825-1 Edition 3 (2014) is the current edition forming the basis of international harmonization."},
    ],
    "course-6": [
        {"q": "What is the US federal law that makes pointing a laser at an aircraft a crime?",
         "options": ["FAA Order 7400.2", "14 CFR Part 91", "18 USC 39A", "FAR Part 77"],
         "answer": 2,
         "explanation": "18 USC Section 39A makes it a federal felony to knowingly aim a laser pointer at an aircraft or its flight path. Penalties can include up to 5 years imprisonment."},
        {"q": "How far in advance must a NOTAM typically be filed for outdoor laser operations?",
         "options": ["1 hour", "6 hours", "24-72 hours", "7 days"],
         "answer": 2,
         "explanation": "NOTAMs for outdoor laser operations should generally be filed 24-72 hours in advance to allow proper distribution through the Notice to Air Missions system."},
        {"q": "What does ARTCC stand for in FAA context?",
         "options": ["Aerial Radiation Traffic Control Committee", "Air Route Traffic Control Center", "Aviation Risk and Technology Compliance Center", "Airspace Regulation and Traffic Control Coordination"],
         "answer": 1,
         "explanation": "ARTCC (Air Route Traffic Control Center) manages en route air traffic in designated airspace. Operators with complex outdoor shows should coordinate with their local ARTCC."},
        {"q": "Outdoor NOHD calculations should account for what compared to indoor calculations?",
         "options": ["Higher ambient light levels", "Atmospheric transmission losses and beam degradation", "Stricter MPE values", "Larger audience areas"],
         "answer": 1,
         "explanation": "Outdoor NOHD must account for atmospheric effects — humidity, aerosols, and turbulence attenuate or scatter the beam, affecting hazard distances."},
        {"q": "What does IEC 60825-3 specifically address?",
         "options": ["Industrial laser cutting systems", "Laser pointer products", "Laser displays and entertainment", "Laser communication systems"],
         "answer": 2,
         "explanation": "IEC 60825-3 specifically addresses safety requirements for laser light shows, displays, and entertainment applications."},
    ],
    "course-7": [
        {"q": "At what crowd density does significant crush risk become a concern?",
         "options": ["2 persons/m²", "4 persons/m²", "6 persons/m²", "8 persons/m²"],
         "answer": 1,
         "explanation": "Crowd density above 4 persons/m² creates significant crush risk and limits crowd mobility. At this density, individuals cannot move freely."},
        {"q": "What is the first action when lightning is detected within 10 miles of an outdoor event?",
         "options": ["Alert the audience to seek shelter", "Suspend outdoor operations immediately", "Consult with the promoter", "Check the lightning forecast"],
         "answer": 1,
         "explanation": "Lightning within 10 miles is the threshold for immediate suspension of outdoor operations. The 30/30 rule is commonly used as a guideline."},
        {"q": "What is the first aid priority for a suspected laser eye injury?",
         "options": ["Rinse the eye with water", "Apply antibiotic eye drops", "Do NOT rub the eye — cover with sterile dressing and seek immediate medical care", "Apply cold compress to reduce swelling"],
         "answer": 2,
         "explanation": "For laser eye injury, the eye should NOT be rubbed (which could worsen retinal damage). Cover with sterile dressing and immediately transport to emergency ophthalmology."},
        {"q": "Which document defines chain of command for safety decisions during an event?",
         "options": ["Variance application", "Event Safety Plan", "Insurance certificate", "NOTAM filing"],
         "answer": 1,
         "explanation": "The Event Safety Plan should clearly define the chain of command for all safety decisions, including who has authority to suspend or stop the show."},
        {"q": "What minimum general liability insurance coverage is recommended for professional laser operations?",
         "options": ["$100,000 per occurrence", "$500,000 per occurrence", "$1 million per occurrence", "$5 million per occurrence"],
         "answer": 2,
         "explanation": "Professional laser operations should carry minimum $1 million per occurrence general liability insurance. Most venues require this as a minimum."},
        {"q": "When should event safety planning ideally begin?",
         "options": ["Day before the event", "One week before", "At least one month before", "Months before the event"],
         "answer": 3,
         "explanation": "Safety planning must begin months before the event to allow proper venue assessment, regulatory permit applications, insurance procurement, and staff training."},
    ],
    "course-8": [
        {"q": "Which ANSI Z136 standard is the primary general laser safety standard in the US?",
         "options": ["ANSI Z136.1", "ANSI Z136.2", "ANSI Z136.3", "ANSI Z136.8"],
         "answer": 0,
         "explanation": "ANSI Z136.1 (Safe Use of Lasers) is the primary general US laser safety standard. Other Z136 series standards address specific applications and reference back to Z136.1."},
        {"q": "ANSI E1.46 is specifically developed for which industry?",
         "options": ["Medical laser applications", "Industrial laser processing", "Entertainment laser applications", "Military laser systems"],
         "answer": 2,
         "explanation": "ANSI E1.46 (Entertainment Technology — Laser Safety) was developed by ESTA specifically for entertainment laser show applications."},
        {"q": "What organization develops ESTA entertainment technology standards?",
         "options": ["ANSI", "ESTA (Entertainment Services and Technology Association)", "IATSE", "PLASA"],
         "answer": 1,
         "explanation": "ESTA develops entertainment technology standards through its Technical Standards Program (TSP), an ANSI-accredited standards development organization."},
        {"q": "Which NFPA standard governs electrical installations relevant to laser power supplies?",
         "options": ["NFPA 101", "NFPA 70 (NEC)", "NFPA 72", "NFPA 30"],
         "answer": 1,
         "explanation": "NFPA 70 (National Electrical Code) governs electrical installations in the US. Laser power supplies, temporary event power, and all electrical infrastructure must comply."},
        {"q": "A Standards Compliance Matrix should document what?",
         "options": ["All applicable standards and compliance status", "A list of all standards ever published", "Only standards the company has passed inspections for", "International standards only"],
         "answer": 0,
         "explanation": "A Standards Compliance Matrix lists all applicable standards, the company's compliance status for each, and any documented deviations with risk assessments and mitigations."},
        *_c8_extra,
    ],
}

# Supplement courses with quiz bank questions
QUIZZES["course-1"] = QUIZZES["course-1"] + _c1_extra
QUIZZES["course-5"] = QUIZZES["course-5"] + _c5_extra
