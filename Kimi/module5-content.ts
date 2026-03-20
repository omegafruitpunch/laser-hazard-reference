/**
 * Module 5: Engineering & Administrative Controls
 * Course 1: Laser Safety Fundamentals
 * 
 * This module covers the hierarchy of controls, engineering controls,
 * administrative controls, and PPE requirements for laser safety.
 */

export const module5Content = {
  hierarchy: {
    title: "Hierarchy of Controls",
    description: "Controls should be applied in order of reliability, from most effective to least effective. PPE is always the last resort.",
    concept: "The control hierarchy prioritizes elimination and engineering solutions over administrative procedures and personal protective equipment.",
    levels: [
      {
        level: 1,
        name: "Elimination",
        description: "Remove the hazard entirely by eliminating the laser operation or using a non-laser alternative.",
        examples: [
          "Use Class 1 enclosed system instead of Class 4 open beam",
          "Substitute less hazardous wavelength (visible vs. IR)",
          "Replace with non-laser technology (LED, conventional lighting)",
          "Remove unnecessary laser operations from process"
        ],
        effectiveness: "Most effective - 100% hazard elimination",
        color: "#4CAF50",
        icon: "✓"
      },
      {
        level: 2,
        name: "Substitution",
        description: "Replace the hazardous laser with a less hazardous alternative that achieves similar results.",
        examples: [
          "Use lower power laser for alignment tasks",
          "Change beam path away from occupied areas",
          "Substitute CW laser for pulsed laser when possible",
          "Use multiple lower-power lasers instead of single high-power unit"
        ],
        effectiveness: "Highly effective - significant risk reduction",
        color: "#66BB6A",
        icon: "↔"
      },
      {
        level: 3,
        name: "Engineering",
        description: "Isolate the hazard through physical means and built-in safety systems.",
        examples: [
          "Install safety interlocks on doors and panels",
          "Use enclosures to contain laser radiation",
          "Implement scan-failure detection systems",
          "Install beam stops/shutters at beam termination points",
          "Use remote interlock connections"
        ],
        effectiveness: "Highly effective - doesn't depend on human behavior",
        color: "#8BC34A",
        icon: "⚙"
      },
      {
        level: 4,
        name: "Administrative",
        description: "Change how people work through procedures, training, and warning systems.",
        examples: [
          "Develop Standard Operating Procedures (SOPs)",
          "Provide comprehensive safety training",
          "Post warning signs and labels",
          "Implement maintenance schedules",
          "Establish access control protocols",
          "Create emergency response procedures"
        ],
        effectiveness: "Moderately effective - relies on human compliance",
        color: "#FFC107",
        icon: "📋"
      },
      {
        level: 5,
        name: "PPE",
        description: "Personal Protective Equipment - protect the individual as a last resort.",
        examples: [
          "Laser safety eyewear with appropriate OD rating",
          "Protective clothing for skin protection",
          "Face shields for high-power applications",
          "UV-blocking garments for ultraviolet lasers"
        ],
        effectiveness: "Least effective - last resort only",
        color: "#FF5722",
        icon: "🥽"
      }
    ]
  },

  engineeringControls: {
    title: "Engineering Controls",
    description: "Physical systems and devices that prevent or reduce exposure to laser hazards.",
    
    enclosures: [
      {
        name: "Protective Housing",
        purpose: "Prevents access to laser radiation during normal operation",
        requirements: [
          "Must withstand reasonably foreseeable misuse",
          "Prevent human access to laser radiation under normal conditions",
          "Maintain integrity during equipment operation"
        ],
        appliesTo: ["All laser classes"],
        standardReference: "21 CFR 1040.10, ANSI Z136.1 Section 4.3"
      },
      {
        name: "Interlocked Enclosure",
        purpose: "Automatically disables laser when opened or accessed",
        requirements: [
          "Fail-safe design - laser disabled when interlock opens",
          "Cannot be easily bypassed without tools",
          "Visible status indication of interlock state",
          "Manual reset required after interlock activation"
        ],
        appliesTo: ["Class 3B", "Class 4"],
        standardReference: "ANSI Z136.1 Section 4.3.2"
      },
      {
        name: "Controlled Area",
        purpose: "Restricts access to authorized personnel only",
        requirements: [
          "Physical barriers (walls, curtains, barriers)",
          "Access control system (key cards, locks)",
          "Warning signs at all entry points",
          "Emergency egress capability maintained"
        ],
        appliesTo: ["Class 3B", "Class 4"],
        standardReference: "ANSI Z136.1 Section 4.3.5"
      }
    ],

    beamControl: [
      {
        name: "Beam Stops/Blocks",
        purpose: "Safely terminate beam at end of intended path",
        requirements: [
          "Must handle beam power without damage",
          "Prevent hazardous reflections",
          "Securely mounted to prevent displacement",
          "Made of appropriate material for wavelength/power"
        ],
        appliesTo: ["All classes where beam path must be terminated"],
        materials: ["Anodized aluminum", "Carbon composite", "Ceramic", "Beam dumps with cooling"],
        standardReference: "ANSI Z136.1 Section 4.3.3"
      },
      {
        name: "Beam Shutters",
        purpose: "Control beam transmission on/off state",
        requirements: [
          "Positive action - clearly on or off",
          "Status indication (lights, flags)",
          "Fail-safe to closed position",
          "Compatible with interlock systems"
        ],
        appliesTo: ["Class 3B", "Class 4"],
        types: ["Manual", "Solenoid-actuated", "Pneumatic"]
      },
      {
        name: "Attenuators",
        purpose: "Reduce beam power for alignment and setup",
        requirements: [
          "Known attenuation factor (OD or transmission %)",
          "Secure mounting to prevent movement",
          "Wavelength-appropriate materials",
          "Marked with attenuation level"
        ],
        appliesTo: ["All classes during alignment"],
        types: ["Neutral density filters", "Polarizing attenuators", "Aperture stops"]
      }
    ],

    interlocks: [
      {
        name: "Door Interlocks",
        description: "Disable laser when access door is opened",
        requirements: [
          "Fail-safe design (opens circuit to disable)",
          "Tamper-resistant mounting",
          "Visible bypass indicator if applicable",
          "Cannot be defeated from inside controlled area"
        ],
        installationNotes: "Install on all access doors to controlled areas"
      },
      {
        name: "Panel Interlocks",
        description: "Disable laser when protective panels are removed",
        requirements: [
          "Positive-break contacts",
          "Hardwired to laser power supply",
          "Manual reset after closure"
        ],
        installationNotes: "Required on all removable panels covering Class 3B/4 beams"
      },
      {
        name: "Remote Interlock",
        description: "External connection for area monitoring systems",
        requirements: [
          "Compatible with facility safety systems",
          "Clearly labeled connector",
          "Documented interface specifications"
        ],
        installationNotes: "Required for Class 4 lasers; recommended for Class 3B"
      }
    ],

    keyControls: [
      {
        name: "Key Switch",
        purpose: "Prevent unauthorized operation",
        requirements: [
          "Removable key in OFF position only",
          "Only one key supplied per system",
          "Controlled access to key",
          "Key removable only when laser is disabled"
        ],
        appliesTo: ["Class 3B", "Class 4"],
        standardReference: "21 CFR 1040.10(f)(2), ANSI Z136.1 Section 4.3.4"
      },
      {
        name: "Emergency Stop (E-stop)",
        purpose: "Immediate system shutdown from accessible locations",
        requirements: [
          "Easily accessible and clearly marked",
          "Manual reset required to restart",
          "Latching mechanism (maintains stop state)",
          "Tested before each performance/shift",
          "Hardwired - not software-dependent"
        ],
        appliesTo: ["Class 3B", "Class 4"],
        testing: "Test E-stop before each performance; document test results"
      },
      {
        name: "Scan-Failure Detection",
        purpose: "Detect scanner failure in audience scanning applications",
        requirements: [
          "Response time < 1ms",
          "Automatic beam blanking on failure",
          "Failsafe design",
          "Regular testing and calibration"
        ],
        appliesTo: ["Entertainment lasers with audience exposure"],
        standardReference: "ILDA Safety Guidelines, ANSI Z136.10"
      }
    ],

    controlMatrix: {
      description: "Required engineering controls by laser class",
      matrix: {
        "Class 1": ["Protective housing"],
        "Class 2": ["Protective housing", "Warning label"],
        "Class 3R": ["Protective housing", "Warning label"],
        "Class 3B": [
          "Protective housing",
          "Interlocked enclosure OR remote interlock",
          "Key switch",
          "Beam shutter (recommended)",
          "E-stop (recommended)"
        ],
        "Class 4": [
          "Protective housing",
          "Interlocked enclosure",
          "Key switch",
          "Beam shutter",
          "E-stop",
          "Scan-failure detection (if scanned)",
          "Beam stops for all beam paths",
          "Remote interlock connector"
        ]
      }
    }
  },

  administrativeControls: {
    title: "Administrative Controls",
    description: "Procedures, documentation, and management practices to ensure laser safety.",

    sops: {
      title: "Standard Operating Procedures",
      description: "Written procedures for all laser operations",
      requiredElements: [
        "Purpose and scope of the procedure",
        "Personnel authorized to perform the work",
        "Required training and qualifications",
        "Step-by-step operating instructions",
        "Required PPE and engineering controls",
        "Emergency procedures and contacts",
        "Date of creation and review schedule",
        "Approval signatures (LSO, management)"
      ],
      laserSpecificSOPs: [
        {
          type: "Laser startup and shutdown procedures",
          content: "Sequence of operations for safe power-up and power-down"
        },
        {
          type: "Alignment procedures",
          content: "Step-by-step alignment with reduced power, required eyewear, personnel restrictions"
        },
        {
          type: "Maintenance procedures",
          content: "Scheduled maintenance, lockout/tagout, service precautions"
        },
        {
          type: "Emergency response procedures",
          content: "Response to eye injuries, equipment failures, fires"
        },
        {
          type: "Service and repair procedures",
          content: "Authorized service personnel, documentation requirements"
        }
      ],
      template: `STANDARD OPERATING PROCEDURE

1. PURPOSE: [Describe the purpose of this procedure]

2. SCOPE: [Define when this procedure applies]

3. RESPONSIBILITY: [Who is authorized to perform this procedure]
   - Required training: [List required training]
   - Authorization: [LSO approval required?]

4. EQUIPMENT: [List laser equipment covered]
   - Laser type: 
   - Wavelength(s):
   - Power output:
   - Classification:

5. SAFETY REQUIREMENTS:
   - Required PPE:
   - Engineering controls:
   - Personnel restrictions:

6. PROCEDURE:
   [Step-by-step instructions]

7. EMERGENCY PROCEDURES:
   [Emergency contacts and response]

8. DOCUMENTATION:
   - Date created:
   - Review date:
   - Approved by: LSO _____________ Date _______`
    },

    training: {
      title: "Training and Authorization",
      requirements: [
        "Initial safety training before first work assignment",
        "Refresher training annually or after incidents/near-misses",
        "Written authorization before independent work",
        "Documentation of all training (records retention: duration of employment + 3 years)",
        "Competency verification through testing or demonstration"
      ],
      trainingTopics: [
        {
          topic: "Laser fundamentals and bioeffects",
          content: "Basic laser physics, tissue interactions, injury mechanisms"
        },
        {
          topic: "Classification and hazard categories",
          content: "Laser classes, hazard classification, AEL and MPE concepts"
        },
        {
          topic: "Control measures and their use",
          content: "Engineering controls, administrative controls, PPE selection and use"
        },
        {
          topic: "MPE and exposure limits",
          content: "Understanding exposure limits, time-base considerations"
        },
        {
          topic: "Emergency procedures",
          content: "E-stop locations, eye injury response, evacuation procedures"
        },
        {
          topic: "Incident reporting",
          content: "When and how to report incidents and near-misses"
        },
        {
          topic: "Specific equipment operation",
          content: "Hands-on training for specific laser systems used"
        }
      ],
      frequency: {
        initial: "Before first assignment with lasers",
        refresher: "Annually minimum; also after incidents or changes in procedures",
        newEquipment: "When new laser systems or significant modifications are introduced",
        documentation: "Training records maintained for duration of employment plus 3 years"
      }
    },

    warningSigns: [
      {
        type: "Door Signs",
        text: "Laser in Use - Do Not Enter When Light is Illuminated",
        requirements: "Posted at all entrances to controlled areas",
        laserClass: ["Class 3B", "Class 4"]
      },
      {
        type: "Aperture Labels",
        text: "Laser Aperture - Avoid Eye or Skin Exposure",
        requirements: "Posted at all beam exit points",
        laserClass: ["Class 3B", "Class 4"]
      },
      {
        type: "Area Signs",
        text: "Controlled Area - Authorized Personnel Only",
        requirements: "Posted at boundaries of controlled areas",
        laserClass: ["Class 3B", "Class 4"]
      },
      {
        type: "Eyewear Reminder",
        text: "Laser Safety Eyewear Required in This Area",
        requirements: "Posted at entry points where eyewear is required",
        laserClass: ["Class 3B", "Class 4"]
      },
      {
        type: "Class 2 Warning",
        text: "CAUTION - Laser Radiation - Do Not Stare into Beam",
        requirements: "Required on Class 2 laser products",
        laserClass: ["Class 2", "Class 3R"]
      },
      {
        type: "Class 3B/4 Warning",
        text: "DANGER - Laser Radiation - Avoid Eye or Skin Exposure to Direct or Scattered Radiation",
        requirements: "Required on Class 3B and Class 4 laser products",
        laserClass: ["Class 3B", "Class 4"]
      }
    ],

    lca: {
      title: "Laser Controlled Area (LCA)",
      description: "Designated area where laser hazards exist and access is controlled",
      requirements: [
        "Defined physical boundaries (walls, barriers, markings)",
        "Access control system (locks, key cards, personnel screening)",
        "Warning signs at all entry points",
        "Emergency egress capability maintained at all times",
        "List of authorized personnel posted or maintained",
        "Supervision requirements defined (supervised vs. unsupervised)",
        "Written justification for controlled area designation"
      ],
      separationDistances: {
        description: "Minimum separation distances from audience/occupied areas",
        supervised: {
          vertical: "3 meters (10 feet)",
          lateral: "2.5 meters (8 feet)",
          note: "For supervised installations where operator present"
        },
        unsupervised: {
          vertical: "6 meters (20 feet)",
          lateral: "5 meters (16 feet)",
          note: "For unattended or unsupervised installations"
        }
      },
      specialRequirements: [
        "Outdoor displays require CAA notification",
        "Audience scanning installations must never be left unattended",
        "Changes to installation require LSO agreement",
        "Alignment at full power requires restricted access"
      ]
    }
  },

  ppe: {
    title: "Personal Protective Equipment",
    description: "Last line of defense when engineering and administrative controls cannot fully eliminate exposure risk.",

    eyewear: {
      title: "Laser Safety Eyewear",
      description: "Primary PPE for laser eye protection",
      
      selection: [
        {
          factor: "Wavelength Coverage",
          description: "Eyewear must attenuate the specific laser wavelength(s) used",
          requirement: "Check spectral transmission curve for your wavelength"
        },
        {
          factor: "Optical Density (OD)",
          description: "Sufficient attenuation to reduce exposure below MPE",
          requirement: "OD = log10(incident power / transmitted power)"
        },
        {
          factor: "Visible Light Transmission (VLT)",
          description: "Ability to see while wearing eyewear",
          requirement: "Higher VLT preferred; minimum 20% for most applications"
        },
        {
          factor: "Damage Threshold",
          description: "Maximum power/energy eyewear can withstand",
          requirement: "Must exceed expected direct beam exposure"
        },
        {
          factor: "Comfort and Fit",
          description: "Proper fit ensures consistent use",
          requirement: "Adjustable, compatible with other PPE, ventilated"
        }
      ],

      odRatings: [
        {
          od: "OD 1",
          attenuation: "10x",
          transmitted: "10%",
          useCase: "Low-power alignment assistance"
        },
        {
          od: "OD 2",
          attenuation: "100x",
          transmitted: "1%",
          useCase: "Class 3R and low-power Class 3B"
        },
        {
          od: "OD 3",
          attenuation: "1,000x",
          transmitted: "0.1%",
          useCase: "Medium-power Class 3B"
        },
        {
          od: "OD 4",
          attenuation: "10,000x",
          transmitted: "0.01%",
          useCase: "High-power Class 3B and low-power Class 4"
        },
        {
          od: "OD 5",
          attenuation: "100,000x",
          transmitted: "0.001%",
          useCase: "Class 4 lasers"
        },
        {
          od: "OD 6+",
          attenuation: "1,000,000x+",
          transmitted: "0.0001%+",
          useCase: "High-power Class 4, industrial applications"
        }
      ],

      inspection: [
        "Inspect before each use for cracks, pits, or deep scratches",
        "Check for proper fit and secure adjustment",
        "Verify markings are legible (OD rating, wavelength, manufacturer)",
        "Clean with mild soap and water only - no harsh chemicals",
        "Store in protective case away from direct sunlight and heat",
        "Replace immediately after any suspected direct beam exposure",
        "Maintain inspection log for shared/laboratory eyewear"
      ],

      markings: {
        required: [
          "Optical Density (OD) at specified wavelength(s)",
          "Wavelength range of protection",
          "Manufacturer identification",
          "Model number",
          "Certification mark (CE, ANSI Z136 approved)"
        ],
        example: "OD 7+ @ 1064nm, OD 5+ @ 532nm, CE EN 207"
      }
    },

    skinProtection: {
      title: "Skin Protection",
      description: "Protection against skin burns from high-power lasers",
      
      whenRequired: [
        "Class 4 lasers with beams above 500mW",
        "UV lasers (skin burns and carcinogenic risk)",
        "High-power IR lasers",
        "Applications with potential for direct skin exposure"
      ],

      types: [
        {
          type: "Lab coats",
          material: "Tightly woven fabric, fire-resistant preferred",
          protection: "Diffuse reflection, minor scatter"
        },
        {
          type: "UV-blocking garments",
          material: "Specialized UV-opaque fabrics",
          protection: "UV-A, UV-B, UV-C wavelengths"
        },
        {
          type: "Face shields",
          material: "Tinted polycarbonate with appropriate OD",
          protection: "Full face protection for high-power applications"
        },
        {
          type: "Gloves",
          material: "Leather or specialized laser-resistant materials",
          protection: "Hand protection during alignment and beam manipulation"
        }
      ]
    }
  },

  quizQuestions: [
    {
      id: "M5-Q1",
      type: "multiple_choice",
      difficulty: "beginner",
      question: "According to the hierarchy of controls, which control measure is MOST effective?",
      options: [
        "Personal Protective Equipment (PPE)",
        "Administrative controls (training, SOPs)",
        "Engineering controls (interlocks, enclosures)",
        "Elimination or substitution of the hazard"
      ],
      correctAnswer: 3,
      explanation: "Elimination or substitution is the most effective control because it removes the hazard entirely rather than just managing exposure to it.",
      topic: "Hierarchy of Controls"
    },
    {
      id: "M5-Q2",
      type: "multiple_choice",
      difficulty: "intermediate",
      question: "What is the minimum separation distance for a SUPERVISED Class 4 laser installation above audience level?",
      options: [
        "1.5 meters vertical",
        "2.5 meters vertical",
        "3 meters vertical",
        "6 meters vertical"
      ],
      correctAnswer: 2,
      explanation: "For supervised installations, the minimum vertical separation is 3 meters (10 feet). For unsupervised installations, it increases to 6 meters (20 feet).",
      topic: "Separation Distances"
    },
    {
      id: "M5-Q3",
      type: "true_false",
      difficulty: "beginner",
      question: "Personal Protective Equipment should be used as the first line of defense against laser hazards.",
      correctAnswer: false,
      explanation: "False. PPE is the LAST resort in the hierarchy of controls. Engineering and administrative controls should be implemented first.",
      topic: "Hierarchy of Controls"
    },
    {
      id: "M5-Q4",
      type: "multiple_select",
      difficulty: "intermediate",
      question: "Which of the following are required engineering controls for Class 4 lasers? (Select all that apply)",
      options: [
        "Protective housing",
        "Interlocked enclosure",
        "Key switch",
        "Warning signs only (no interlock needed)"
      ],
      correctAnswer: [0, 1, 2],
      explanation: "Class 4 lasers require protective housing, interlocked enclosures, and key switches. Warning signs alone are administrative controls, not engineering controls.",
      topic: "Engineering Controls"
    },
    {
      id: "M5-Q5",
      type: "multiple_choice",
      difficulty: "intermediate",
      question: "What does an OD (Optical Density) of 6 mean for laser safety eyewear?",
      options: [
        "Blocks 6% of the laser light",
        "Reduces power by a factor of 100,000 (10^6)",
        "Allows transmission of 6% of incident power",
        "Rated for 6 watts of laser power"
      ],
      correctAnswer: 1,
      explanation: "OD 6 means the eyewear attenuates the laser by a factor of 10^6 (1,000,000), transmitting only 0.0001% of the incident power.",
      topic: "PPE - Eyewear"
    },
    {
      id: "M5-Q6",
      type: "scenario",
      difficulty: "advanced",
      question: "A university lab has a Class 4 laser for research. The PI wants to implement the following controls: (1) Install door interlock, (2) Provide safety eyewear, (3) Write SOP, (4) Install beam shutter. In what priority order should these be implemented according to the hierarchy of controls?",
      options: [
        "Eyewear, SOP, Beam shutter, Door interlock",
        "Door interlock, Beam shutter, SOP, Eyewear",
        "SOP, Eyewear, Door interlock, Beam shutter",
        "Beam shutter, Eyewear, Door interlock, SOP"
      ],
      correctAnswer: 1,
      explanation: "Engineering controls (door interlock, beam shutter) take priority over administrative (SOP) and PPE (eyewear). Door interlocks prevent entry entirely, while beam shutters control the beam itself.",
      topic: "Control Prioritization"
    },
    {
      id: "M5-Q7",
      type: "multiple_choice",
      difficulty: "beginner",
      question: "How often should E-stop controls be tested?",
      options: [
        "Monthly",
        "Weekly",
        "Before each performance or shift",
        "Annually"
      ],
      correctAnswer: 2,
      explanation: "E-stops should ideally be tested before each performance or shift to ensure they are functioning properly when needed.",
      topic: "Engineering Controls - E-stop"
    },
    {
      id: "M5-Q8",
      type: "true_false",
      difficulty: "intermediate",
      question: "After using an E-stop, the laser can be automatically restarted by resetting the E-stop button.",
      correctAnswer: false,
      explanation: "False. After E-stop activation, the laser must be restarted by deliberate action of a trained person, not automatically.",
      topic: "Emergency Systems"
    },
    {
      id: "M5-Q9",
      type: "multiple_choice",
      difficulty: "intermediate",
      question: "Which of the following is NOT a required element of a Standard Operating Procedure (SOP)?",
      options: [
        "Step-by-step operating instructions",
        "Equipment purchase receipts",
        "Emergency procedures",
        "Required training and qualifications"
      ],
      correctAnswer: 1,
      explanation: "Equipment purchase receipts are not required in an SOP. Required elements include step-by-step instructions, emergency procedures, and training requirements.",
      topic: "Administrative Controls - SOPs"
    },
    {
      id: "M5-Q10",
      type: "multiple_select",
      difficulty: "intermediate",
      question: "Which elements should be included in initial laser safety training? (Select all that apply)",
      options: [
        "Laser fundamentals and bioeffects",
        "Company financial policies",
        "Control measures and their use",
        "Emergency procedures"
      ],
      correctAnswer: [0, 2, 3],
      explanation: "Laser safety training should cover fundamentals, bioeffects, control measures, and emergency procedures. Company financial policies are not part of safety training.",
      topic: "Training Requirements"
    },
    {
      id: "M5-Q11",
      type: "multiple_choice",
      difficulty: "advanced",
      question: "For audience scanning laser effects, what is the required response time for scan-failure detection systems?",
      options: [
        "Less than 10 milliseconds",
        "Less than 1 millisecond",
        "Less than 100 microseconds",
        "Less than 1 second"
      ],
      correctAnswer: 1,
      explanation: "Scan-failure detection systems must have a response time of less than 1 millisecond to prevent eye injuries during audience scanning.",
      topic: "Engineering Controls - Scan-fail"
    },
    {
      id: "M5-Q12",
      type: "scenario",
      difficulty: "advanced",
      question: "A venue plans to install lasers that may expose the audience. Which statement is TRUE about supervision requirements?",
      options: [
        "Audience exposure installations may be left unattended if scan-failure systems are installed",
        "Installations with intended audience exposure must never be left unattended",
        "Supervision is only required during the first hour of operation",
        "Automated monitoring cameras can replace human supervision"
      ],
      correctAnswer: 1,
      explanation: "Audience exposure installations must NEVER be left unattended, even with scan-failure detection systems in place. Continuous human supervision is required.",
      topic: "Supervision Requirements"
    },
    {
      id: "M5-Q13",
      type: "multiple_choice",
      difficulty: "beginner",
      question: "What must be done if a change is needed to a laser installation after setup?",
      options: [
        "The operator can make the change if it improves safety",
        "Changes require agreement from the Laser Safety Officer (LSO)",
        "Changes can be made by the venue manager",
        "Any trained technician can authorize changes"
      ],
      correctAnswer: 1,
      explanation: "Changes to laser installations should only be carried out with LSO agreement to ensure safety is maintained.",
      topic: "Installation Changes"
    },
    {
      id: "M5-Q14",
      type: "multiple_choice",
      difficulty: "intermediate",
      question: "Which wavelength range requires a 10x reduction in MPE when performing for children?",
      options: [
        "All wavelengths",
        "Wavelengths above 700nm (infrared)",
        "Wavelengths below 500nm (blue-green)",
        "Only ultraviolet wavelengths"
      ],
      correctAnswer: 2,
      explanation: "For children's performances, the MPE should be reduced by a factor of 10 for wavelengths below 500nm (blue-green region) due to children's higher sensitivity.",
      topic: "Special Populations"
    },
    {
      id: "M5-Q15",
      type: "multiple_select",
      difficulty: "advanced",
      question: "When selecting laser safety eyewear, which factors must be considered? (Select all that apply)",
      options: [
        "Laser wavelength(s)",
        "Required Optical Density (OD)",
        "Visible Light Transmission (VLT)",
        "Laser purchase price"
      ],
      correctAnswer: [0, 1, 2],
      explanation: "Eyewear selection requires matching wavelength coverage, sufficient OD for protection, and adequate VLT for visibility. Purchase price is not a safety factor.",
      topic: "PPE Selection"
    }
  ],

  interactiveExercises: [
    {
      id: "hierarchy_sorting",
      title: "Sort the Controls",
      type: "drag_drop_hierarchy",
      instruction: "Drag each control measure to its correct position in the hierarchy",
      items: [
        { id: 1, text: "Install door interlocks", correctLevel: 3 },
        { id: 2, text: "Require safety eyewear", correctLevel: 5 },
        { id: 3, text: "Post warning signs", correctLevel: 4 },
        { id: 4, text: "Use enclosed Class 1 system", correctLevel: 1 },
        { id: 5, text: "Write SOPs", correctLevel: 4 },
        { id: 6, text: "Install beam blocks", correctLevel: 3 },
        { id: 7, text: "Provide training", correctLevel: 4 },
        { id: 8, text: "Substitute lower power laser", correctLevel: 2 }
      ],
      feedback: {
        correct: "Excellent! You understand the control hierarchy.",
        incorrect: "Remember: Always try elimination first, then substitution, then engineering, then administrative, and PPE last."
      }
    },
    {
      id: "virtual_lab",
      title: "Design a Safe Laser Lab",
      type: "virtual_simulation",
      scenario: "You need to set up a 10W Nd:YAG laser (1064nm) for materials processing. Arrange the required controls on the optical table.",
      availableItems: [
        { id: "laser", name: "10W Nd:YAG Laser", type: "source", required: true },
        { id: "interlock_door", name: "Door Interlock", type: "engineering", required: true },
        { id: "beam_block", name: "Beam Block/Dump", type: "engineering", required: true },
        { id: "eyewear_1064", name: "OD 6+ @ 1064nm Eyewear", type: "ppe", required: true },
        { id: "warning_sign", name: "Class 4 Warning Sign", type: "administrative", required: true },
        { id: "e_stop", name: "Emergency Stop", type: "engineering", required: true },
        { id: "key_switch", name: "Key Switch", type: "engineering", required: true },
        { id: "curtain", name: "Laser Safety Curtain", type: "engineering", required: false },
        { id: "power_meter", name: "Power Meter", type: "equipment", required: false },
        { id: "sop_binder", name: "SOP Binder", type: "administrative", required: true }
      ],
      validationRules: [
        { rule: "Door interlock must be present", check: "interlock_door" },
        { rule: "Beam termination required", check: "beam_block" },
        { rule: "Appropriate eyewear for wavelength", check: "eyewear_1064" },
        { rule: "Warning signage required", check: "warning_sign" },
        { rule: "E-stop must be accessible", check: "e_stop" },
        { rule: "Key control for Class 4", check: "key_switch" },
        { rule: "SOPs must be available", check: "sop_binder" }
      ],
      feedback: {
        complete: "Excellent! You've implemented all required controls for a Class 4 laser installation.",
        incomplete: "You're missing some critical controls. Review the requirements for Class 4 lasers.",
        warning: "Consider adding optional controls like laser safety curtains for enhanced protection."
      }
    }
  ],

  standardsReferences: [
    {
      standard: "ANSI Z136.1",
      section: "Section 4.3",
      title: "Engineering Controls",
      description: "Requirements for protective housings, interlocks, and safety systems"
    },
    {
      standard: "ANSI Z136.1",
      section: "Section 4.4",
      title: "Administrative Controls",
      description: "SOPs, training, and warning sign requirements"
    },
    {
      standard: "21 CFR 1040.10",
      section: "(f)",
      title: "Performance Standards for Light-Emitting Products",
      description: "FDA requirements for laser product safety features"
    },
    {
      standard: "ANSI Z136.10",
      section: "Section 5",
      title: "Entertainment Laser Safety",
      description: "Specific controls for audience scanning and entertainment applications"
    }
  ],

  learningObjectives: [
    "Apply the hierarchy of controls to laser safety scenarios",
    "Select appropriate engineering controls for each laser class",
    "Design effective administrative control programs including SOPs",
    "Implement proper signage and labeling requirements",
    "Select appropriate PPE with correct OD ratings",
    "Evaluate control effectiveness and maintenance requirements",
    "Understand separation distance requirements for installations",
    "Apply control prioritization in real-world scenarios"
  ]
};

export default module5Content;
