#!/usr/bin/env python3
"""
Course 1 Content Processing - Digest Generation, Quiz Bank, and Knowledge Graph
"""

import json
import os
from pathlib import Path
from datetime import datetime

OUTPUT_DIR_DIGEST = Path("lms_data/digested_content/course-1")
OUTPUT_DIR_QUIZ = Path("lms_data/quiz_banks/course-1")
OUTPUT_DIR_KG = Path("lms_data/knowledge_graphs/course-1")

# Ensure directories exist
for d in [OUTPUT_DIR_DIGEST, OUTPUT_DIR_QUIZ, OUTPUT_DIR_KG]:
    d.mkdir(parents=True, exist_ok=True)

# ============================================================================
# BEAM HAZARD CALCULATIONS PDF - ANALYSIS
# Note: This PDF is actually a CV/resume for Roberta McHatton, not calculations
# ============================================================================

beam_hazard_digest = {
    "document": "beam-hazard-calculations.pdf",
    "title": "Roberta McHatton - Laser Safety Services",
    "type": "Professional Profile / CV",
    "note": "This document is a CV/resume, not technical beam hazard calculations",
    "total_pages": 4,
    "pages": [
        {
            "page_num": 1,
            "core_concepts": [
                "Introduction to Roberta McHatton and Laser Safety Services (LSS)",
                "Company background and specialization in entertainment/display industries",
                "Clientele including major events and artists"
            ],
            "key_terms": {
                "Laser Safety Services (LSS)": "Company providing laser safety consultation since 1995",
                "ANSI Z136": "American National Standards Institute laser safety standards",
                "FDA/CDRH": "Food and Drug Administration / Center for Devices and Radiological Health"
            },
            "difficulty": "beginner",
            "learning_objectives": ["Understand professional qualifications in laser safety"],
            "prerequisites": []
        },
        {
            "page_num": 2,
            "core_concepts": [
                "Professional background and experience at Laser Fantasy International",
                "Timeline of career from 1995-2004 and 2005-current"
            ],
            "key_terms": {
                "LFI": "Laser Fantasy International - former employer"
            },
            "difficulty": "beginner",
            "learning_objectives": ["Understand career paths in laser safety industry"],
            "prerequisites": []
        },
        {
            "page_num": 3,
            "core_concepts": [
                "Professional organization memberships (ILDA, ESA)",
                "Publications and training program development",
                "Laser Safety Officer (LSO) training requirements per ANSI Z136.1"
            ],
            "key_terms": {
                "ILDA": "International Laser Display Association",
                "ESA": "Event Safety Alliance",
                "LSO": "Laser Safety Officer"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Identify key professional organizations in laser safety",
                "Understand ANSI Z136.1 training requirements"
            ],
            "prerequisites": ["Basic understanding of laser safety standards"]
        },
        {
            "page_num": 4,
            "core_concepts": [
                "Training course components and certification qualifications",
                "Training duration (4 hours) and assessment criteria (80% pass rate)"
            ],
            "key_terms": {
                "MPE": "Maximum Permissible Exposure",
                "NOHD": "Nominal Ocular Hazard Distance",
                "USAF Eye Hazards": "US Air Force document on laser eye injuries"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Understand LSO training curriculum",
                "Know certification requirements"
            ],
            "prerequisites": ["Understanding of basic laser safety concepts"]
        }
    ]
}

# Quiz for beam-hazard-calculations (CV content)
beam_hazard_quiz = {
    "document": "beam-hazard-calculations.pdf",
    "title": "Professional Profile Quiz",
    "total_questions": 6,
    "questions": [
        {
            "id": "bh_q1",
            "type": "multiple_choice",
            "page_ref": 1,
            "question": "What is the primary specialization of Laser Safety Services (LSS)?",
            "options": [
                "Medical laser applications",
                "Entertainment, display and tradeshow industries",
                "Military laser systems",
                "Industrial manufacturing lasers"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. LSS specializes in entertainment, display and tradeshow industries since 1995.",
            "explanation_incorrect": "Incorrect. LSS specializes in entertainment, display and tradeshow industries.",
            "learning_objective": "Identify company specializations in laser safety"
        },
        {
            "id": "bh_q2",
            "type": "true_false",
            "page_ref": 3,
            "question": "ANSI Z136.1 requires laser safety training for all personnel routinely working with lasers.",
            "correct_answer": True,
            "explanation_correct": "Correct. ANSI Z136.1 states training shall be provided to all personnel routinely working with lasers.",
            "explanation_incorrect": "Incorrect. ANSI Z136.1 does require training for personnel working with lasers.",
            "learning_objective": "Understand ANSI Z136.1 training requirements"
        },
        {
            "id": "bh_q3",
            "type": "multiple_choice",
            "page_ref": 4,
            "question": "What is the passing requirement for the LSO training course?",
            "options": [
                "60% of questions correct",
                "70% of questions correct",
                "80% of questions correct",
                "90% of questions correct"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. Participants must answer 80% of test questions correctly.",
            "explanation_incorrect": "Incorrect. The passing requirement is 80% of questions correct.",
            "learning_objective": "Know certification requirements"
        },
        {
            "id": "bh_q4",
            "type": "multiple_choice",
            "page_ref": 4,
            "question": "How long does the LSO training course typically take?",
            "options": [
                "1 hour",
                "2 hours",
                "4 hours",
                "8 hours"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. Training takes approximately 4 hours.",
            "explanation_incorrect": "Incorrect. The training course takes approximately 4 hours to complete.",
            "learning_objective": "Understand training duration"
        },
        {
            "id": "bh_q5",
            "type": "scenario",
            "page_ref": 3,
            "question": "A venue is planning to hire a Laser Safety Officer. Which professional organization should they look for membership in to verify expertise in laser display safety?",
            "options": [
                "IEEE (Institute of Electrical and Electronics Engineers)",
                "ILDA (International Laser Display Association)",
                "AMA (American Medical Association)",
                "OSHA (Occupational Safety and Health Administration)"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. ILDA is the International Laser Display Association, the professional body for laser display safety.",
            "explanation_incorrect": "Incorrect. ILDA (International Laser Display Association) is the relevant professional organization for laser display safety.",
            "learning_objective": "Identify key professional organizations"
        },
        {
            "id": "bh_q6",
            "type": "true_false",
            "page_ref": 1,
            "question": "Laser Safety Services handles FAA notifications for outdoor laser shows.",
            "correct_answer": True,
            "explanation_correct": "Correct. LSS handles Federal Aviation Administration (FAA) notifications for outdoor shows/displays.",
            "explanation_incorrect": "Incorrect. LSS does handle FAA notifications for outdoor laser shows.",
            "learning_objective": "Understand regulatory compliance services"
        }
    ]
}

beam_hazard_kg = {
    "document": "beam-hazard-calculations.pdf",
    "title": "Roberta McHatton Professional Profile",
    "entities": [
        {"id": "person_roberta", "type": "Person", "name": "Roberta McHatton", "attributes": {"role": "Owner - Consultant", "since": 1995}},
        {"id": "org_lss", "type": "Organization", "name": "Laser Safety Services LLC", "attributes": {"location": "Kent, WA", "founded": 1995}},
        {"id": "org_ansi", "type": "Organization", "name": "ANSI Z136", "attributes": {"type": "Standards Committee"}},
        {"id": "org_ilda", "type": "Organization", "name": "ILDA", "attributes": {"full_name": "International Laser Display Association"}},
        {"id": "org_esa", "type": "Organization", "name": "ESA", "attributes": {"full_name": "Event Safety Alliance"}},
        {"id": "std_z1361", "type": "Standard", "name": "ANSI Z136.1", "attributes": {"topic": "Safe Use of Lasers"}},
        {"id": "role_lso", "type": "Role", "name": "Laser Safety Officer", "attributes": {"training_hours": 4, "pass_rate": "80%"}},
        {"id": "agency_faa", "type": "Agency", "name": "FAA", "attributes": {"full_name": "Federal Aviation Administration"}},
        {"id": "agency_fda", "type": "Agency", "name": "FDA/CDRH", "attributes": {"full_name": "Food and Drug Administration / Center for Devices and Radiological Health"}}
    ],
    "relationships": [
        {"source": "person_roberta", "relation": "owns", "target": "org_lss"},
        {"source": "person_roberta", "relation": "member_of", "target": "org_ansi"},
        {"source": "person_roberta", "relation": "member_of", "target": "org_ilda"},
        {"source": "person_roberta", "relation": "member_of", "target": "org_esa"},
        {"source": "org_lss", "relation": "provides", "target": "role_lso"},
        {"source": "role_lso", "relation": "regulated_by", "target": "std_z1361"},
        {"source": "org_lss", "relation": "handles_compliance_for", "target": "agency_faa"},
        {"source": "org_lss", "relation": "handles_compliance_for", "target": "agency_fda"}
    ]
}

# ============================================================================
# LSO ROLE PDF - ANALYSIS (35 pages - comprehensive safety guide)
# ============================================================================

lso_role_digest = {
    "document": "lso-role.pdf",
    "title": "Safety of Display Lasers - Guidance Document",
    "type": "Comprehensive Safety Guide",
    "edition": "1st Edition - April 2016",
    "total_pages": 35,
    "chapters": [
        {"chapter": 1, "title": "Laser Beam Hazards: How to Reduce Their Risk", "pages": [6, 7, 8]},
        {"chapter": 2, "title": "Managing Laser Safety", "pages": [9, 10, 11]},
        {"chapter": 3, "title": "Show Planning and System Design", "pages": [12, 13, 14, 15]},
        {"chapter": 4, "title": "Installation and Alignment", "pages": [16, 17, 18]},
        {"chapter": 5, "title": "Pre Show Checks", "pages": [19, 20]},
        {"chapter": 6, "title": "Operation", "pages": [21]},
        {"chapter": 7, "title": "Post Show", "pages": [21]}
    ],
    "pages": [
        # Pages 1-5: Cover, Foreword, Acknowledgements, Index, Introduction
        {
            "page_num": 1,
            "section": "Cover",
            "core_concepts": ["Document title and edition information"],
            "key_terms": {"Display Lasers": "Lasers used for entertainment and display purposes"},
            "difficulty": "beginner",
            "learning_objectives": ["Identify the document as official UK guidance"]
        },
        {
            "page_num": 2,
            "section": "Foreword - HSE",
            "core_concepts": [
                "Guidance produced by UK trade organizations",
                "Based on HSE HS(G)95 (now withdrawn)"
            ],
            "key_terms": {"HSE": "Health and Safety Executive", "HS(G)95": "Previous radiation safety guidance"},
            "difficulty": "beginner",
            "learning_objectives": ["Understand the regulatory context of the guidance"]
        },
        {
            "page_num": 3,
            "section": "Acknowledgements",
            "core_concepts": ["Contributing organizations to the guidance"],
            "key_terms": {"PLASA": "Professional Lighting and Sound Association"},
            "difficulty": "beginner",
            "learning_objectives": ["Recognize industry stakeholders"]
        },
        {
            "page_num": 4,
            "section": "Index",
            "core_concepts": ["Document structure overview"],
            "key_terms": {},
            "difficulty": "beginner",
            "learning_objectives": ["Navigate the document structure"]
        },
        {
            "page_num": 5,
            "section": "Introduction",
            "core_concepts": [
                "Purpose and scope of the guidance",
                "Target audience: all involved in laser displays",
                "Four main laser beam hazards: eye damage, skin burns, ignition, distraction"
            ],
            "key_terms": {
                "MPE": "Maximum Permissible Exposure",
                "AEL": "Accessible Emission Limit"
            },
            "difficulty": "beginner",
            "learning_objectives": [
                "Identify the four main laser beam hazards",
                "Understand when guidance becomes mandatory"
            ]
        },
        # Chapter 1: Pages 6-8 - Laser Beam Hazards
        {
            "page_num": 6,
            "section": "Chapter 1 - Laser Beam Hazards - Optical",
            "core_concepts": [
                "High radiant powers in entertainment lasers (200mW to 40W+)",
                "MPE levels set by international bodies",
                "Non-visible wavelengths are more hazardous",
                "Scanning failure safety systems required"
            ],
            "key_terms": {
                "Class 3B": "Medium/High power lasers - direct viewing hazardous",
                "Class 4": "High power lasers - eye, skin and fire hazard",
                "MPE": "Maximum Permissible Exposure - maximum safe exposure level"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Understand laser classification system",
                "Identify optical hazards from display lasers"
            ],
            "prerequisites": ["Basic understanding of laser power measurements"]
        },
        {
            "page_num": 7,
            "section": "Chapter 1 - Skin Burns, Fire Risks, Reflected Beams",
            "core_concepts": [
                "Skin burn and fire risks above 500mW",
                "UV radiation additional skin exposure risk",
                "Reflected beams equally hazardous as direct beams",
                "Q-switched/pulsed lasers should not be used for audience exposure"
            ],
            "key_terms": {
                "Specular Reflection": "Mirror-like reflection",
                "Diffuse Reflection": "Scattered reflection from matte surfaces",
                "Q-switched": "Laser producing short, intense pulses"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Identify skin and fire hazards",
                "Understand differences between specular and diffuse reflection"
            ]
        },
        {
            "page_num": 8,
            "section": "Chapter 1 - Other Laser Beam Hazards",
            "core_concepts": [
                "Equipment must be secured against displacement",
                "Outdoor displays risk: distraction to motorists and pilots",
                "CAA notification required for outdoor displays",
                "Air Navigation Order compliance"
            ],
            "key_terms": {
                "CAA": "Civil Aviation Authority",
                "CAP 736": "CAA policy for outdoor laser operations"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Understand outdoor display risks",
                "Know when CAA notification is required"
            ]
        },
        # Chapter 2: Pages 9-11 - Managing Laser Safety
        {
            "page_num": 9,
            "section": "Chapter 2 - Managing Laser Safety - Roles",
            "core_concepts": [
                "Plan-Do-Check-Act methodology",
                "Key roles: Client, Organiser, Venue, Installer, Supplier, LSO",
                "LSO has executive responsibility for laser safety"
            ],
            "key_terms": {
                "LSO": "Laser Safety Officer - executive responsibility",
                "LSA": "Laser Safety Adviser - advisory only, no executive mandate"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Differentiate between LSO and LSA roles",
                "Identify responsibilities of each role"
            ]
        },
        {
            "page_num": 10,
            "section": "Chapter 2 - Operator Responsibilities",
            "core_concepts": [
                "Operators must be competent and understand safety procedures",
                "Daily/weekly alignment checks required",
                "Emergency shutdown procedures must be understood by all"
            ],
            "key_terms": {
                "Competency": "Sufficient skills, knowledge and experience"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Understand operator competency requirements",
                "Know what documentation is required at hand-over"
            ]
        },
        {
            "page_num": 11,
            "section": "Chapter 2 - Liaising, Competency, Emergencies",
            "core_concepts": [
                "Local authority licensing requirements",
                "E-stop testing before each performance",
                "Eye injury response procedures",
                "Amsler Grid for retinal assessment"
            ],
            "key_terms": {
                "E-stop": "Emergency Stop button",
                "SRCS": "Safety Related Control Systems"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Understand emergency procedures",
                "Know eye injury response protocol"
            ]
        },
        # Chapter 3: Pages 12-15 - Show Planning and System Design
        {
            "page_num": 12,
            "section": "Chapter 3 - Show Planning",
            "core_concepts": [
                "Laser displays created by galvanometer-mounted mirrors",
                "Scanning frequency is key determinant of injury threshold",
                "Safe programming techniques required",
                "Installations with audience exposure must never be left unattended"
            ],
            "key_terms": {
                "Galvanometer": "Scanner device with oscillating mirror",
                "Scan-failure detection": "Automatic shutdown on scanner failure"
            },
            "difficulty": "advanced",
            "learning_objectives": [
                "Understand how scanning affects safety",
                "Identify safe programming techniques"
            ]
        },
        {
            "page_num": 13,
            "section": "Chapter 3 - Creative Brief and Location Assessment",
            "core_concepts": [
                "Personal exposure risks from fault conditions",
                "Specular behavior assumed when in doubt",
                "On-site verification of calculations required"
            ],
            "key_terms": {},
            "difficulty": "advanced",
            "learning_objectives": [
                "Assess venue for laser hazards",
                "Understand importance of on-site verification"
            ]
        },
        {
            "page_num": 14,
            "section": "Chapter 3 - How Will It Be Done",
            "core_concepts": [
                "Hazardous accessible beams must be identified",
                "Hand-over documentation requirements",
                "Operator competency and training requirements"
            ],
            "key_terms": {},
            "difficulty": "intermediate",
            "learning_objectives": [
                "Know what must be included in hand-over documentation"
            ]
        },
        {
            "page_num": 15,
            "section": "Chapter 3 - MPE Selection Table",
            "core_concepts": [
                "MPE selection based on audience/employee/performer",
                "10 second minimum exposure for audience",
                "0.25 second aversion response for employees with training"
            ],
            "key_terms": {
                "Aversion Response": "Blink reflex and head movement (0.25 sec)"
            },
            "difficulty": "advanced",
            "learning_objectives": [
                "Apply appropriate MPE values for different exposure situations",
                "Understand time base selection criteria"
            ]
        },
        # Chapter 4: Pages 16-18 - Installation and Alignment
        {
            "page_num": 16,
            "section": "Chapter 4 - Installation",
            "core_concepts": [
                "Control of Artificial Optical Radiation at Work Regulations 2010",
                "Separation distances: 3m vertical, 2.5m lateral for supervised",
                "6m vertical for unsupervised installations"
            ],
            "key_terms": {
                "Separation Distances": "Minimum safe distances from audience"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Apply correct separation distances",
                "Understand Control of Artificial Optical Radiation regulations"
            ]
        },
        {
            "page_num": 17,
            "section": "Chapter 4 - Separation Distance Diagrams",
            "core_concepts": [
                "Visual diagrams of separation distances",
                "Monitored vs unmonitored installation requirements"
            ],
            "key_terms": {},
            "difficulty": "beginner",
            "learning_objectives": [
                "Visualize separation distance requirements"
            ]
        },
        {
            "page_num": 18,
            "section": "Chapter 4 - Alignment and Programming",
            "core_concepts": [
                "Beams reduced below MPE during alignment",
                "Access restricted to alignment personnel only",
                "Changes require LSO agreement",
                "Programming ideally done prior to installation"
            ],
            "key_terms": {},
            "difficulty": "intermediate",
            "learning_objectives": [
                "Follow safe alignment procedures",
                "Understand programming safety requirements"
            ]
        },
        # Chapter 5: Pages 19-20 - Pre Show Checks
        {
            "page_num": 19,
            "section": "Chapter 5 - Pre Show Checks",
            "core_concepts": [
                "Visual and physical checks required",
                "Daily alignment checks",
                "E-stop must be tested before each performance",
                "Scan failure safety systems must be demonstrated"
            ],
            "key_terms": {},
            "difficulty": "intermediate",
            "learning_objectives": [
                "Complete pre-show safety checklist",
                "Test emergency systems"
            ]
        },
        {
            "page_num": 20,
            "section": "Chapter 5 - Sign Off",
            "core_concepts": [
                "Documentation of hand-over stages",
                "Installer confirms installation is safe",
                "Organiser/venue confirms understanding"
            ],
            "key_terms": {},
            "difficulty": "intermediate",
            "learning_objectives": [
                "Understand sign-off responsibilities"
            ]
        },
        # Chapter 6-7: Pages 21 - Operation and Post Show
        {
            "page_num": 21,
            "section": "Chapters 6-7 - Operation and Post Show",
            "core_concepts": [
                "Monitoring during show",
                "Vigilance for equipment failure or audience unruliness",
                "Post-show incident recording",
                "Dismantling safety considerations"
            ],
            "key_terms": {},
            "difficulty": "intermediate",
            "learning_objectives": [
                "Monitor laser shows effectively",
                "Complete post-show documentation"
            ]
        },
        # Appendices: Pages 22-35
        {
            "page_num": 22,
            "section": "Appendix A - Glossary (Part 1)",
            "core_concepts": [
                "MPE values for different time bases",
                "Simplified MPE of 10 W/m2 (1 mW/cm2) for 400-700nm"
            ],
            "key_terms": {
                "MPE 0.25s": "2.54 mW/cm2",
                "MPE 10s": "1.01 mW/cm2",
                "Skin MPE": "200 mW/cm2"
            },
            "difficulty": "advanced",
            "learning_objectives": [
                "Calculate appropriate MPE values",
                "Apply safety factors for children"
            ]
        },
        {
            "page_num": 23,
            "section": "Appendix A - Glossary (Part 2)",
            "core_concepts": [
                "Key laser terminology definitions"
            ],
            "key_terms": {
                "Aversion Response": "0.25 second blink/head movement",
                "Beam Divergence": "Angle of beam spread in radians",
                "Collimated Light": "Parallel light rays"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Define key laser safety terms"
            ]
        },
        {
            "page_num": 24,
            "section": "Appendix A - Glossary (Part 3)",
            "core_concepts": [
                "Display laser product definitions"
            ],
            "key_terms": {
                "Effects Head": "Optical processing components",
                "Scanning": "Time-varying beam direction"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Understand display laser equipment terminology"
            ]
        },
        {
            "page_num": 25,
            "section": "Appendix A - Glossary (Part 4)",
            "core_concepts": [
                "Laser system and safety component definitions"
            ],
            "key_terms": {
                "NOHD": "Nominal Ocular Hazard Distance",
                "Q-Switch": "Device for short intense pulses"
            },
            "difficulty": "advanced",
            "learning_objectives": [
                "Define technical laser components"
            ]
        },
        {
            "page_num": 26,
            "section": "Appendix A - Glossary (Part 5)",
            "core_concepts": [
                "Scanner and safety enclosure definitions"
            ],
            "key_terms": {
                "Scanner": "Galvanometer with oscillating mirror",
                "Zero Diffracted Order": "Highest power reflected beam from grating"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Understand scanning system terminology"
            ]
        },
        {
            "page_num": 27,
            "section": "Appendix B - Types of Lasers",
            "core_concepts": [
                "OPSL: Optically Pumped Semiconductor Laser",
                "DPSS: Diode Pumped Solid State",
                "Gas lasers: Water-cooled, less common now"
            ],
            "key_terms": {
                "OPSL": "1W-12W, good beam profile, 460-639nm",
                "DPSS": "200mW-10W, 532nm green",
                "Diode": "1mW-2W each, arrays up to 30W+"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Identify different laser types used in displays"
            ]
        },
        {
            "page_num": 28,
            "section": "Appendix C - Laser Classification",
            "core_concepts": [
                "Class 1: Safe under normal conditions",
                "Class 2: Low power, blink reflex protection",
                "Class 3R: Low/Medium power, up to 5x Class 1/2 AEL",
                "Class 3B: Direct viewing always hazardous",
                "Class 4: High power, all reflections hazardous"
            ],
            "key_terms": {
                "Class 2 AEL": "1mW continuous wave",
                "Class 3B AEL": "500mW continuous wave"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Classify lasers according to BS EN 60825",
                "Understand Accessible Emission Limits"
            ]
        },
        {
            "page_num": 29,
            "section": "Appendix D - Case Study 1: Outdoor Music Festival",
            "core_concepts": [
                "4x10W laser systems outdoor festival setup",
                "MPE measurement and verification process",
                "Decision to disconnect misaligned laser"
            ],
            "key_terms": {},
            "difficulty": "intermediate",
            "learning_objectives": [
                "Apply safety procedures in real-world scenario",
                "Make go/no-go decisions"
            ]
        },
        {
            "page_num": 30,
            "section": "Appendix D - Case Study 2: Indoor Corporate Event",
            "core_concepts": [
                "Indoor arena with performers",
                "Communication failures between organizer and supplier",
                "Adaptation to last-minute changes"
            ],
            "key_terms": {},
            "difficulty": "intermediate",
            "learning_objectives": [
                "Identify communication importance",
                "Handle changes during events"
            ]
        },
        {
            "page_num": 31,
            "section": "Appendix D - Case Study 3: Nightclub Installation",
            "core_concepts": [
                "Permanent installation design considerations",
                "Beam termination vs audience scanning decision",
                "LSO appointment for permanent installations"
            ],
            "key_terms": {},
            "difficulty": "intermediate",
            "learning_objectives": [
                "Design safe permanent installations"
            ]
        },
        {
            "page_num": 32,
            "section": "Appendix D - Case Study 4: Mobile Disco",
            "core_concepts": [
                "Low power (500mW) mobile DJ setup",
                "Simple safety rules for small venues",
                "Refusing unsafe client requests"
            ],
            "key_terms": {},
            "difficulty": "beginner",
            "learning_objectives": [
                "Apply basic safety for small venues"
            ]
        },
        {
            "page_num": 33,
            "section": "Appendix E - Contacts",
            "core_concepts": [
                "CAA contact information",
                "Local authority finder",
                "BSI standards purchase"
            ],
            "key_terms": {},
            "difficulty": "beginner",
            "learning_objectives": [
                "Know where to find regulatory contacts"
            ]
        },
        {
            "page_num": 34,
            "section": "Appendix F - Amsler Grid",
            "core_concepts": [
                "Self-test for retinal damage",
                "6-step testing procedure"
            ],
            "key_terms": {"Amsler Grid": "Visual field test grid"},
            "difficulty": "beginner",
            "learning_objectives": [
                "Perform Amsler Grid test"
            ]
        },
        {
            "page_num": 35,
            "section": "Appendix G - Bibliography",
            "core_concepts": [
                "Relevant UK legislation and standards",
                "European directives"
            ],
            "key_terms": {
                "Control of Artificial Optical Radiation at Work Regulations 2010": "UK laser worker protection law"
            },
            "difficulty": "intermediate",
            "learning_objectives": [
                "Identify applicable legislation"
            ]
        }
    ]
}

# Quiz bank for LSO Role document
lso_role_quiz = {
    "document": "lso-role.pdf",
    "title": "Safety of Display Lasers - Comprehensive Quiz",
    "total_questions": 30,
    "questions": [
        # Chapter 1 - Hazards
        {
            "id": "lso_q1",
            "type": "multiple_choice",
            "page_ref": 5,
            "difficulty": "beginner",
            "question": "What are the four main laser beam hazards listed in the guidance?",
            "options": [
                "Eye damage, hearing loss, fire, chemical exposure",
                "Permanent eye damage, skin burns, source of ignition, distraction/dazzle/glare",
                "Radiation, heat, electricity, noise",
                "Cancer, blindness, burns, explosion"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. The four main hazards are: permanent eye damage, skin burns, source of ignition, and distraction/dazzle/glare.",
            "explanation_incorrect": "Incorrect. The four main hazards are permanent eye damage, skin burns, source of ignition, and distraction/dazzle/glare.",
            "topic": "Hazard Identification"
        },
        {
            "id": "lso_q2",
            "type": "multiple_choice",
            "page_ref": 6,
            "difficulty": "intermediate",
            "question": "What power range do entertainment industry lasers typically have?",
            "options": [
                "1mW to 10mW",
                "10mW to 100mW",
                "200mW to 40W+",
                "100W to 1000W"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. Entertainment lasers typically range from 200mW to 40W+, i.e., Class 3B and 4.",
            "explanation_incorrect": "Incorrect. Entertainment lasers typically range from 200mW to 40W+ (Class 3B and 4).",
            "topic": "Laser Classification"
        },
        {
            "id": "lso_q3",
            "type": "true_false",
            "page_ref": 6,
            "difficulty": "intermediate",
            "question": "Non-visible wavelengths in laser beams (less than 400nm or more than 700nm) are less hazardous than visible wavelengths.",
            "correct_answer": False,
            "explanation_correct": "Correct. Non-visible wavelengths are potentially far MORE hazardous because the eye cannot react to wavelengths it cannot see.",
            "explanation_incorrect": "Incorrect. Non-visible wavelengths are MORE hazardous because the eye cannot react to them.",
            "topic": "Optical Hazards"
        },
        {
            "id": "lso_q4",
            "type": "scenario",
            "page_ref": 7,
            "difficulty": "advanced",
            "question": "A laser show designer wants to create audience scanning effects using a Q-switched laser. What should the LSO advise?",
            "options": [
                "Proceed with standard safety measures",
                "Use lower power settings only",
                "Q-switched lasers should not be used where people may be exposed",
                "Add extra scanning failure systems"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. Q-switched and pulsed lasers should not be used where exposure of people is intended or likely.",
            "explanation_incorrect": "Incorrect. The guidance states Q-switched lasers should not be used where people may be exposed.",
            "topic": "Pulsed Lasers"
        },
        {
            "id": "lso_q5",
            "type": "multiple_choice",
            "page_ref": 7,
            "difficulty": "intermediate",
            "question": "At what power level do skin burn and fire risks become significant?",
            "options": [
                "100mW",
                "500mW",
                "1W",
                "5W"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. Skin burn and fire risks become significant above 500mW.",
            "explanation_incorrect": "Incorrect. Skin burn and fire risks become significant above 500mW.",
            "topic": "Fire and Skin Hazards"
        },
        {
            "id": "lso_q6",
            "type": "multiple_choice",
            "page_ref": 8,
            "difficulty": "intermediate",
            "question": "For outdoor displays, which authority must be notified?",
            "options": [
                "Local Police",
                "Fire Department",
                "Civil Aviation Authority (CAA)",
                "Environmental Health"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. The CAA (Civil Aviation Authority) must be notified for outdoor laser displays.",
            "explanation_incorrect": "Incorrect. The Civil Aviation Authority (CAA) must be notified for outdoor displays.",
            "topic": "Outdoor Displays"
        },
        # Chapter 2 - Managing Safety
        {
            "id": "lso_q7",
            "type": "multiple_choice",
            "page_ref": 9,
            "difficulty": "intermediate",
            "question": "What is the difference between an LSO and an LSA?",
            "options": [
                "LSO is paid more than LSA",
                "LSO has executive responsibility; LSA is advisory only",
                "LSA requires more training than LSO",
                "There is no difference"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. The LSO has executive responsibility, while the LSA (Laser Safety Adviser) is an advisory role without executive mandate.",
            "explanation_incorrect": "Incorrect. The key difference is that LSO has executive responsibility while LSA is advisory only.",
            "topic": "Roles and Responsibilities"
        },
        {
            "id": "lso_q8",
            "type": "multiple_choice",
            "page_ref": 9,
            "difficulty": "beginner",
            "question": "Who is responsible for ensuring laser installation is safe at a venue?",
            "options": [
                "Only the laser operator",
                "Only the client",
                "Venue management",
                "Local authorities"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. Venue management is responsible for ensuring installation and operation are safe.",
            "explanation_incorrect": "Incorrect. Venue management has responsibility for ensuring safe installation and operation.",
            "topic": "Roles and Responsibilities"
        },
        {
            "id": "lso_q9",
            "type": "true_false",
            "page_ref": 10,
            "difficulty": "intermediate",
            "question": "Operators should complete daily or weekly alignment checks for temporary installations.",
            "correct_answer": True,
            "explanation_correct": "Correct. Operators should maintain logs of daily/weekly alignment checks.",
            "explanation_incorrect": "Incorrect. The guidance requires operators to complete daily/weekly alignment check logs.",
            "topic": "Maintenance"
        },
        {
            "id": "lso_q10",
            "type": "scenario",
            "page_ref": 11,
            "difficulty": "advanced",
            "question": "During a show, an audience member reports a suspected eye injury from laser exposure. What is the FIRST action?",
            "options": [
                "Give them eye drops and continue the show",
                "Treat as medical emergency and take to A&E with laser details",
                "Ask them to wait until after the show",
                "Tell them it's probably just temporary dazzle"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. Actual eye injuries should be treated as medical emergencies with casualty taken to A&E with laser beam details.",
            "explanation_incorrect": "Incorrect. Actual eye injuries must be treated as medical emergencies and the casualty taken to A&E.",
            "topic": "Emergency Procedures"
        },
        # Chapter 3 - Planning
        {
            "id": "lso_q11",
            "type": "multiple_choice",
            "page_ref": 12,
            "difficulty": "advanced",
            "question": "What is the most important factor in determining the safety of scanned laser effects?",
            "options": [
                "Laser color",
                "Scanner manufacturer",
                "Scanning frequency and speed",
                "Room temperature"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. The speed and frequency that beams pass over the eye is the most important safety factor.",
            "explanation_incorrect": "Incorrect. Scanning frequency is the key determinant of injury threshold for scanned effects.",
            "topic": "Scanning Safety"
        },
        {
            "id": "lso_q12",
            "type": "true_false",
            "page_ref": 12,
            "difficulty": "intermediate",
            "question": "Installations intended to expose audiences may be left unattended if scan-failure systems are in place.",
            "correct_answer": False,
            "explanation_correct": "Correct. Audience exposure installations should NEVER be left unattended, even with safety systems.",
            "explanation_incorrect": "Incorrect. These installations should NEVER be left unattended.",
            "topic": "Scanning Safety"
        },
        {
            "id": "lso_q13",
            "type": "multiple_choice",
            "page_ref": 15,
            "difficulty": "advanced",
            "question": "What is the minimum exposure time base for deliberate audience exposure?",
            "options": [
                "0.25 seconds",
                "1 second",
                "3 seconds",
                "10 seconds"
            ],
            "correct_answer": 3,
            "explanation_correct": "Correct. For audience exposure, an exposure duration of 10 seconds minimum should be assumed.",
            "explanation_incorrect": "Incorrect. 10 seconds is the minimum time base for deliberate audience exposure.",
            "topic": "MPE Calculations"
        },
        {
            "id": "lso_q14",
            "type": "multiple_choice",
            "page_ref": 15,
            "difficulty": "advanced",
            "question": "For trained employees during setup, what aversion response time can be assumed?",
            "options": [
                "0.1 seconds",
                "0.25 seconds",
                "0.5 seconds",
                "1 second"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. For trained employees, the eye aversion response time of 0.25 seconds may be used.",
            "explanation_incorrect": "Incorrect. The aversion response time of 0.25 seconds applies to trained employees.",
            "topic": "MPE Calculations"
        },
        # Chapter 4 - Installation
        {
            "id": "lso_q15",
            "type": "multiple_choice",
            "page_ref": 16,
            "difficulty": "intermediate",
            "question": "What are the minimum separation distances for a SUPERVISED laser installation?",
            "options": [
                "1m vertical, 1m lateral",
                "2m vertical, 2m lateral",
                "3m vertical, 2.5m lateral",
                "6m vertical, 5m lateral"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. For supervised installations: 3m vertical and 2.5m lateral separation.",
            "explanation_incorrect": "Incorrect. Supervised installations require 3m vertical and 2.5m lateral separation.",
            "topic": "Separation Distances"
        },
        {
            "id": "lso_q16",
            "type": "multiple_choice",
            "page_ref": 16,
            "difficulty": "intermediate",
            "question": "What is the vertical separation distance for UNSUPERVISED installations?",
            "options": [
                "3m",
                "4m",
                "6m",
                "10m"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. For unsupervised installations, the vertical separation should be 6m.",
            "explanation_incorrect": "Incorrect. Unsupervised installations require 6m vertical separation.",
            "topic": "Separation Distances"
        },
        {
            "id": "lso_q17",
            "type": "true_false",
            "page_ref": 18,
            "difficulty": "intermediate",
            "question": "Changes to laser system installation can be made by the operator without consulting the LSO.",
            "correct_answer": False,
            "explanation_correct": "Correct. Changes to installation should only be carried out with LSO agreement.",
            "explanation_incorrect": "Incorrect. Changes require agreement from the LSO.",
            "topic": "Installation Changes"
        },
        # Chapter 5 - Pre-show
        {
            "id": "lso_q18",
            "type": "multiple_choice",
            "page_ref": 19,
            "difficulty": "intermediate",
            "question": "How often should E-stop controls be tested?",
            "options": [
                "Monthly",
                "Weekly",
                "Before each performance",
                "Annually"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. E-stop(s) should ideally be tested before each performance.",
            "explanation_incorrect": "Incorrect. E-stops should be tested before each performance.",
            "topic": "Pre-show Checks"
        },
        {
            "id": "lso_q19",
            "type": "true_false",
            "page_ref": 19,
            "difficulty": "intermediate",
            "question": "After using an E-stop, the laser can be automatically restarted.",
            "correct_answer": False,
            "explanation_correct": "Correct. After E-stop use, the laser must be restarted by deliberate action of a trained person.",
            "explanation_incorrect": "Incorrect. The laser must be deliberately restarted by an operator or trained person.",
            "topic": "Emergency Systems"
        },
        # Appendices
        {
            "id": "lso_q20",
            "type": "multiple_choice",
            "page_ref": 22,
            "difficulty": "advanced",
            "question": "What is the simplified MPE value for wavelengths 400-700nm?",
            "options": [
                "1 W/m2",
                "10 W/m2 (equivalent to 1 mW/cm2)",
                "100 W/m2",
                "1000 W/m2"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. The simplified MPE is 10 W/m2 (1 mW/cm2) for 400-700nm.",
            "explanation_incorrect": "Incorrect. The simplified MPE is 10 W/m2 or 1 mW/cm2 for visible wavelengths.",
            "topic": "MPE Values"
        },
        {
            "id": "lso_q21",
            "type": "multiple_choice",
            "page_ref": 22,
            "difficulty": "intermediate",
            "question": "What is the skin MPE value?",
            "options": [
                "10 mW/cm2",
                "100 mW/cm2",
                "200 mW/cm2",
                "500 mW/cm2"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. The skin MPE is 200 mW/cm2.",
            "explanation_incorrect": "Incorrect. The skin MPE value is 200 mW/cm2.",
            "topic": "MPE Values"
        },
        {
            "id": "lso_q22",
            "type": "multiple_choice",
            "page_ref": 28,
            "difficulty": "intermediate",
            "question": "What is the Accessible Emission Limit for Class 3B continuous wave lasers?",
            "options": [
                "1mW",
                "5mW",
                "500mW",
                "5W"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. Class 3B has an AEL of 500mW for continuous wave lasers.",
            "explanation_incorrect": "Incorrect. Class 3B AEL is 500mW for continuous wave lasers.",
            "topic": "Laser Classification"
        },
        {
            "id": "lso_q23",
            "type": "multiple_choice",
            "page_ref": 28,
            "difficulty": "beginner",
            "question": "Which laser class is described as HIGH POWER with eye, skin and fire hazard?",
            "options": [
                "Class 2",
                "Class 3R",
                "Class 3B",
                "Class 4"
            ],
            "correct_answer": 3,
            "explanation_correct": "Correct. Class 4 is HIGH POWER with hazards to eye, skin and fire risk.",
            "explanation_incorrect": "Incorrect. Class 4 is the high power class with eye, skin and fire hazards.",
            "topic": "Laser Classification"
        },
        {
            "id": "lso_q24",
            "type": "true_false",
            "page_ref": 28,
            "difficulty": "beginner",
            "question": "Class 2 lasers are inherently eye-safe.",
            "correct_answer": False,
            "explanation_correct": "Correct. Class 2 lasers are NOT inherently safe - protection is provided by the blink reflex (0.25 sec).",
            "explanation_incorrect": "Incorrect. Class 2 lasers are NOT inherently safe; protection comes from the natural aversion response.",
            "topic": "Laser Classification"
        },
        {
            "id": "lso_q25",
            "type": "calculation",
            "page_ref": 22,
            "difficulty": "advanced",
            "question": "Using the MPE table, what is the eye MPE for a 3-second exposure?",
            "options": [
                "2.54 mW/cm2",
                "1.80 mW/cm2",
                "1.37 mW/cm2",
                "1.01 mW/cm2"
            ],
            "correct_answer": 2,
            "explanation_correct": "Correct. The eye MPE for 3 seconds is 1.37 mW/cm2.",
            "explanation_incorrect": "Incorrect. Per the table: 0.25s=2.54, 1s=1.80, 3s=1.37, 10s=1.01 mW/cm2.",
            "topic": "MPE Calculations"
        },
        # Case Study Questions
        {
            "id": "lso_q26",
            "type": "scenario",
            "page_ref": 29,
            "difficulty": "advanced",
            "question": "In Case Study 1, why was one laser projector disconnected before the show?",
            "options": [
                "It was broken",
                "It had been accidentally moved and couldn't be safely realigned in time",
                "The power was too high",
                "The CAA didn't approve it"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. The laser had been accidentally moved, and there wasn't time to safely realign it before the show.",
            "explanation_incorrect": "Incorrect. The laser was moved accidentally and couldn't be safely realigned before the audience arrived.",
            "topic": "Case Study Analysis"
        },
        {
            "id": "lso_q27",
            "type": "multiple_choice",
            "page_ref": 32,
            "difficulty": "beginner",
            "question": "According to Case Study 4, what should a mobile DJ do if asked to shine lasers on the dance floor?",
            "options": [
                "Do it if the client insists",
                "Refuse as it may be unsafe",
                "Only do it for special dances",
                "Reduce the power first"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. The DJ should refuse as it may be unsafe for guests to stare into laser beams.",
            "explanation_incorrect": "Incorrect. The guidance shows the DJ refused the request due to safety concerns.",
            "topic": "Case Study Analysis"
        },
        {
            "id": "lso_q28",
            "type": "multiple_choice",
            "page_ref": 27,
            "difficulty": "intermediate",
            "question": "What does OPSL stand for?",
            "options": [
                "Optical Power Safety Level",
                "Optically Pumped Semiconductor Laser",
                "Output Power Scanning Limit",
                "Optical Protection Safety Layer"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. OPSL = Optically Pumped Semiconductor Laser.",
            "explanation_incorrect": "Incorrect. OPSL stands for Optically Pumped Semiconductor Laser.",
            "topic": "Laser Types"
        },
        {
            "id": "lso_q29",
            "type": "multiple_choice",
            "page_ref": 26,
            "difficulty": "intermediate",
            "question": "What is the Zero Diffracted Order?",
            "options": [
                "The lowest power beam from a diffraction grating",
                "The reflected beam following the path of a mirror reflection",
                "A safety system for diffracted beams",
                "The first beam that exits the laser"
            ],
            "correct_answer": 1,
            "explanation_correct": "Correct. It's the reflected beam from a diffraction grating following the mirror path, typically with highest power.",
            "explanation_incorrect": "Incorrect. It's the reflected beam following the path a beam would take if the grating were a mirror.",
            "topic": "Optics Terminology"
        },
        {
            "id": "lso_q30",
            "type": "true_false",
            "page_ref": 22,
            "difficulty": "intermediate",
            "question": "When performing for children, the MPE level should be reduced by a factor of 10 for wavelengths below 500nm.",
            "correct_answer": True,
            "explanation_correct": "Correct. Children's eyes are more sensitive; the MPE should be reduced by 10x for wavelengths below 500nm.",
            "explanation_incorrect": "Incorrect. The guidance specifically states this reduction for child audiences.",
            "topic": "Special Populations"
        }
    ]
}

# Knowledge Graph for LSO Role document
lso_role_kg = {
    "document": "lso-role.pdf",
    "title": "Safety of Display Lasers",
    "entities": [
        # Hazards
        {"id": "haz_eye", "type": "Hazard", "name": "Permanent Eye Damage", "severity": "Critical"},
        {"id": "haz_skin", "type": "Hazard", "name": "Skin Burns", "severity": "High"},
        {"id": "haz_fire", "type": "Hazard", "name": "Fire/Ignition", "severity": "High"},
        {"id": "haz_distraction", "type": "Hazard", "name": "Distraction/Dazzle/Glare", "severity": "Medium"},
        
        # Laser Classes
        {"id": "class_1", "type": "LaserClass", "name": "Class 1", "ael_cw": "Safe (enclosed)", "hazard": "Safe under normal use"},
        {"id": "class_2", "type": "LaserClass", "name": "Class 2", "ael_cw": "1mW", "hazard": "Blink reflex protection"},
        {"id": "class_3r", "type": "LaserClass", "name": "Class 3R", "ael_cw": "5x Class 1/2", "hazard": "Low/Medium risk"},
        {"id": "class_3b", "type": "LaserClass", "name": "Class 3B", "ael_cw": "500mW", "hazard": "Direct viewing hazardous"},
        {"id": "class_4", "type": "LaserClass", "name": "Class 4", "ael_cw": ">500mW", "hazard": "Eye, skin, fire hazard"},
        
        # Roles
        {"id": "role_lso", "type": "Role", "name": "Laser Safety Officer", "authority": "Executive"},
        {"id": "role_lsa", "type": "Role", "name": "Laser Safety Adviser", "authority": "Advisory only"},
        {"id": "role_operator", "type": "Role", "name": "Operator/Programmer", "authority": "Operation control"},
        {"id": "role_client", "type": "Role", "name": "Client", "authority": "Competency verification"},
        {"id": "role_venue", "type": "Role", "name": "Venue", "authority": "Premises safety"},
        
        # Technical Terms
        {"id": "term_mpe", "type": "TechnicalTerm", "name": "MPE", "definition": "Maximum Permissible Exposure"},
        {"id": "term_nohd", "type": "TechnicalTerm", "name": "NOHD", "definition": "Nominal Ocular Hazard Distance"},
        {"id": "term_ael", "type": "TechnicalTerm", "name": "AEL", "definition": "Accessible Emission Limit"},
        {"id": "term_estop", "type": "TechnicalTerm", "name": "E-stop", "definition": "Emergency Stop"},
        {"id": "term_scanner", "type": "TechnicalTerm", "name": "Scanner", "definition": "Galvanometer with oscillating mirror"},
        
        # Regulations
        {"id": "reg_caa", "type": "Regulation", "name": "CAA CAP 736", "scope": "Outdoor laser operations"},
        {"id": "reg_hse", "type": "Regulation", "name": "HS(G)95", "scope": "Radiation safety (withdrawn)"},
        {"id": "reg_optical", "type": "Regulation", "name": "Control of Artificial Optical Radiation 2010", "scope": "Worker protection"},
        
        # Organizations
        {"id": "org_hse", "type": "Organization", "name": "HSE", "full_name": "Health and Safety Executive"},
        {"id": "org_caa", "type": "Organization", "name": "CAA", "full_name": "Civil Aviation Authority"},
        {"id": "org_plasa", "type": "Organization", "name": "PLASA", "full_name": "Professional Lighting and Sound Association"},
        {"id": "org_bsi", "type": "Organization", "name": "BSI", "full_name": "British Standards Institute"},
        
        # Laser Types
        {"id": "type_opsl", "type": "LaserType", "name": "OPSL", "power": "1W-12W", "wavelength": "460-639nm"},
        {"id": "type_dpss", "type": "LaserType", "name": "DPSS", "power": "200mW-10W", "wavelength": "532nm"},
        {"id": "type_diode", "type": "LaserType", "name": "Diode", "power": "1mW-2W each", "arrays": "Up to 30W+"},
        {"id": "type_gas", "type": "LaserType", "name": "Gas Laser", "cooling": "Water-cooled", "status": "Less common"},
        
        # Safety Systems
        {"id": "sys_scanfail", "type": "SafetySystem", "name": "Scan-failure Detection", "response": "Automatic shutdown"},
        {"id": "sys_blank", "type": "SafetySystem", "name": "Blanking Plates", "purpose": "Masking beams"},
        {"id": "sys_srcs", "type": "SafetySystem", "name": "SRCS", "full_name": "Safety Related Control Systems"}
    ],
    "relationships": [
        # Class hazards
        {"source": "class_3b", "relation": "causes", "target": "haz_eye", "condition": "Direct viewing"},
        {"source": "class_4", "relation": "causes", "target": "haz_eye", "condition": "Direct or reflected"},
        {"source": "class_4", "relation": "causes", "target": "haz_skin", "condition": "High power"},
        {"source": "class_4", "relation": "causes", "target": "haz_fire", "condition": ">500mW"},
        
        # Role responsibilities
        {"source": "role_lso", "relation": "manages", "target": "haz_eye"},
        {"source": "role_lso", "relation": "evaluates", "target": "term_mpe"},
        {"source": "role_lso", "relation": "enforces", "target": "reg_optical"},
        {"source": "role_lsa", "relation": "advises", "target": "role_lso"},
        
        # Technical relationships
        {"source": "term_mpe", "relation": "measured_in", "target": "unit_mwcm2", "value": "mW/cm2"},
        {"source": "sys_scanfail", "relation": "protects_against", "target": "haz_eye"},
        {"source": "sys_estop", "relation": "terminates", "target": "class_4"},
        
        # Regulatory
        {"source": "org_caa", "relation": "regulates", "target": "reg_caa"},
        {"source": "reg_caa", "relation": "applies_to", "target": "haz_distraction", "context": "Outdoor displays"},
        
        # Laser type classifications
        {"source": "type_opsl", "relation": "classified_as", "target": "class_3b", "condition": "Depending on power"},
        {"source": "type_opsl", "relation": "classified_as", "target": "class_4", "condition": "High power arrays"}
    ],
    "safety_thresholds": {
        "mpe_visible_simplified": {"value": 10, "unit": "W/m2", "equivalent": "1 mW/cm2"},
        "mpe_skin": {"value": 200, "unit": "mW/cm2"},
        "separation_supervised": {"vertical": "3m", "lateral": "2.5m"},
        "separation_unsupervised": {"vertical": "6m", "lateral": "2.5m"},
        "aversion_response": {"value": 0.25, "unit": "seconds"},
        "audience_exposure_time": {"value": 10, "unit": "seconds", "note": "Minimum for deliberate exposure"}
    }
}

# ============================================================================
# SAVE ALL OUTPUTS
# ============================================================================

def save_json(data, filepath):
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
    print(f"[OK] Saved: {filepath}")

def main():
    # Save digested content
    save_json(beam_hazard_digest, OUTPUT_DIR_DIGEST / "beam-hazard-calculations_digest.json")
    save_json(lso_role_digest, OUTPUT_DIR_DIGEST / "lso-role_digest.json")
    
    # Save quiz banks
    save_json(beam_hazard_quiz, OUTPUT_DIR_QUIZ / "beam-hazard-calculations_quiz.json")
    save_json(lso_role_quiz, OUTPUT_DIR_QUIZ / "lso-role_quiz.json")
    
    # Save knowledge graphs
    save_json(beam_hazard_kg, OUTPUT_DIR_KG / "beam-hazard-calculations_kg.json")
    save_json(lso_role_kg, OUTPUT_DIR_KG / "lso-role_kg.json")
    
    # Save summary
    summary = {
        "processed_at": datetime.now().isoformat(),
        "agent": "PDF Elite Processor Agent #2",
        "course": "Course 1: Laser Safety Fundamentals",
        "pdfs_processed": [
            {
                "filename": "beam-hazard-calculations.pdf",
                "pages": 4,
                "type": "Professional Profile/CV",
                "note": "Not actually beam calculations - CV of Roberta McHatton"
            },
            {
                "filename": "lso-role.pdf", 
                "pages": 35,
                "type": "Comprehensive Safety Guide",
                "title": "Safety of Display Lasers",
                "chapters": 7
            }
        ],
        "outputs_generated": {
            "digested_summaries": 2,
            "quiz_banks": 2,
            "total_quiz_questions": 6 + 30,
            "knowledge_graphs": 2
        }
    }
    save_json(summary, Path("lms_data") / "course1_processing_summary.json")
    
    print("\n" + "="*60)
    print("COURSE 1 PROCESSING COMPLETE")
    print("="*60)
    print(f"Total pages processed: 39 (4 + 35)")
    print(f"Total quiz questions generated: 36")
    print(f"Knowledge graph entities: {len(beam_hazard_kg['entities']) + len(lso_role_kg['entities'])}")

if __name__ == "__main__":
    main()
