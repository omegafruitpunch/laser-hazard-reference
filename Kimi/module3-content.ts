/**
 * Module 3: LSO Role Content
 * Based on "Safety of Display Lasers" (1st Edition - April 2016)
 * Source: UK Health & Safety Executive guidance
 */

export const module3Content = {
  /**
   * LSO Definition
   */
  lsoDefinition: "The Laser Safety Officer (LSO) is responsible for evaluating and managing laser risks, and implementing the laser safety precautions specified by the supplier or venue. The LSO should have executive rather than advisory responsibility for the day-to-day management, operation and maintenance of laser installations.",

  /**
   * Authority and Decision-Making Power
   */
  authority: {
    description: "The LSO holds executive responsibility for laser safety, meaning they have the authority to make binding decisions about laser operations, including the power to halt operations when safety is compromised. This differs from a Laser Safety Adviser (LSA) who only provides advisory input without executive mandate.",
    canHaltOperations: true,
    decisionPowers: [
      "Approve or reject laser installation changes",
      "Authorize laser alignment and programming modifications",
      "Halt laser operations immediately when unsafe conditions are detected",
      "Require additional safety measures before operations proceed",
      "Sign off on pre-show safety checks and hand-over documentation"
    ],
    caseStudies: [
      {
        title: "Outdoor Music Festival - Misaligned Laser Disconnection",
        scenario: "During setup at an outdoor festival, one of four 10W laser projectors was accidentally moved and could not be safely realigned before the audience arrived.",
        lsoAction: "The LSO made the decision to disconnect the affected laser projector rather than risk unsafe operation.",
        outcome: "The show proceeded safely with three projectors, demonstrating that safety takes precedence over the full planned display."
      },
      {
        title: "Indoor Arena - Last-Minute Changes",
        scenario: "An indoor corporate event had last-minute additions including performers on stage and a DJ riser that weren't communicated during planning.",
        lsoAction: "The LSO had to assess the changed conditions and adapt safety measures accordingly, including modifying beam paths and scanning zones.",
        outcome: "The event proceeded with modified laser programming after safety verification, highlighting the importance of LSO adaptability."
      },
      {
        title: "Nightclub Installation - Design Safety Override",
        scenario: "A nightclub owner wanted lasers scanning directly onto the dance floor and bar area.",
        lsoAction: "The LSO overruled this request, requiring beams to be terminated away from public areas due to the enhanced safety requirements of audience scanning.",
        outcome: "An alternative design was implemented with beams projected above head height, maintaining safety while still providing visual effects."
      }
    ]
  },

  /**
   * LSO Responsibilities by Category
   */
  responsibilities: {
    categories: [
      {
        name: "Hazard Evaluation",
        tasks: [
          "Evaluate laser risks appropriate to the complexity of the display",
          "Calculate Maximum Permissible Exposure (MPE) values for all exposure scenarios",
          "Assess personal exposure risks from reasonably foreseeable fault conditions",
          "Identify potential target materials and their reflective properties",
          "Evaluate specular vs. diffuse reflection hazards",
          "Assess outdoor display risks including aircraft and motorist distraction",
          "Verify on-site measurements against calculated exposure values"
        ],
        frequency: "Per installation / As needed"
      },
      {
        name: "Installation Safety",
        tasks: [
          "Ensure laser products are securely mounted and tamper-proof",
          "Verify separation distances: 3m vertical/2.5m lateral (supervised), 6m vertical (unsupervised)",
          "Confirm warning signs designate laser hazard areas",
          "Verify access restrictions to authorized personnel only",
          "Ensure external optical components are fail-safe and tamper-proof",
          "Confirm masking materials are rigidly mounted (black-painted steel/aluminum)",
          "Review and approve any changes to existing installations"
        ],
        frequency: "Per installation"
      },
      {
        name: "Training and Competency",
        tasks: [
          "Ensure all operators possess detailed knowledge of laser systems being used",
          "Verify operators understand laser type, model, radiant power, and beam divergence",
          "Confirm operators know beam wavelengths and exposure hazards by effect",
          "Train operators on emergency shutdown procedures",
          "Ensure understanding of restricted areas and audience positioning",
          "Maintain records of operator competency and training requirements"
        ],
        frequency: "Initial + Annual refresher"
      },
      {
        name: "Pre-Show Safety Checks",
        tasks: [
          "Perform visual checks of all external optical components",
          "Complete daily alignment checks according to specified procedures",
          "Test emergency stop (E-stop) controls before each performance",
          "Verify scan-failure safety systems are functioning",
          "Confirm beam alignment using mirrors or target references",
          "Ensure control console security (key control or password)",
          "Complete and sign pre-show check documentation"
        ],
        frequency: "Daily / Before each performance"
      },
      {
        name: "Documentation Review",
        tasks: [
          "Review hand-over documentation from installer to venue",
          "Verify operating and maintenance procedures are documented",
          "Confirm permissible display effects and their safety implications",
          "Ensure emergency shutdown and monitoring requirements are specified",
          "Maintain logs of daily/weekly alignment checks",
          "Record details of any adverse incidents"
        ],
        frequency: "Ongoing"
      },
      {
        name: "Emergency Response",
        tasks: [
          "Establish emergency shutdown procedures for equipment failure",
          "Define response for audience unruliness or safety management issues",
          "Coordinate with emergency services for outdoor displays",
          "Implement eye injury response protocol (Amsler Grid testing)",
          "Ensure operators understand their role in emergency situations"
        ],
        frequency: "As needed / Pre-event planning"
      }
    ]
  },

  /**
   * LSO Qualifications and Certifications
   */
  qualifications: {
    education: "The LSO should have sufficient skills, knowledge and experience in the evaluation and management of laser risks. While formal qualifications are beneficial, practical experience with laser systems and demonstrated competency in laser safety management are essential.",
    experience: "Practical experience with display laser installations, including knowledge of laser types (OPSL, DPSS, Diode), scanning systems, control software, and safety-related control systems (SRCS). Experience with MPE calculations and irradiance measurements is required.",
    requiredKnowledge: [
      "Detailed knowledge of laser systems (type, model, radiant power, beam divergence)",
      "Understanding of beam wavelengths and colors",
      "Knowledge of effect capabilities and accessible beam levels",
      "Scanner models, speeds, and modes",
      "Operating control systems and safety control systems",
      "MPE calculation and measurement techniques",
      "Applicable regulations (Control of Artificial Optical Radiation at Work Regulations 2010)"
    ],
    certifications: [
      {
        name: "CLSO",
        provider: "Laser Institute of America (LIA) / Board of Laser Safety",
        requirements: "Certified Laser Safety Officer - Requires examination covering laser fundamentals, bioeffects, hazard analysis, safety standards, and laser safety program management. Requires renewal through continuing education.",
        relevance: "Internationally recognized certification for laser safety officers"
      },
      {
        name: "CMLSO",
        provider: "Laser Institute of America (LIA) / Board of Laser Safety",
        requirements: "Certified Medical Laser Safety Officer - Medical-specific certification covering medical laser applications, operating room protocols, and healthcare laser safety. Requires prior healthcare experience and examination.",
        relevance: "Primarily for medical laser applications; CLSO more relevant for display/entertainment lasers"
      },
      {
        name: "PLASA Laser Safety Qualification",
        provider: "PLASA (Professional Lighting and Sound Association)",
        requirements: "UK-specific qualification covering display laser safety, regulations, and practical safety management for entertainment applications.",
        relevance: "Directly relevant for UK display laser work"
      }
    ]
  },

  /**
   * LSO vs LSA Comparison
   */
  lsaComparison: {
    lso: [
      "Has EXECUTIVE responsibility for laser safety",
      "Can make binding decisions and halt operations",
      "Responsible for day-to-day management of installations",
      "Implements laser safety precautions",
      "Has authority to approve/reject installation changes",
      "Required for permanent and complex temporary installations",
      "Directly responsible for operator training and competency"
    ],
    lsa: [
      "Has ADVISORY role only",
      "Provides recommendations but cannot mandate actions",
      "Consulted for complex hazard evaluations",
      "May assist with risk assessment and safety planning",
      "No executive mandate for operational decisions",
      "Optional consultant for specialized expertise",
      "Cannot override LSO decisions"
    ],
    summary: "The LSO holds executive authority with responsibility for implementing safety measures and making operational decisions. The LSA provides expert advice and consultation but has no authority to enforce recommendations. For display laser installations, an LSO is required; an LSA may be consulted for additional expertise but cannot replace the LSO role."
  },

  /**
   * Documentation Requirements
   */
  documentation: {
    requiredRecords: [
      "Daily/weekly alignment check logs",
      "Pre-show safety check sign-off sheets",
      "E-stop and safety system test records",
      "Incident reports and near-miss documentation",
      "MPE calculation and measurement verification records",
      "Operator competency and training records",
      "Hand-over documentation between installer and venue"
    ],
    sops: [
      "Laser alignment procedures",
      "Emergency shutdown procedures",
      "Scan-failure system testing protocol",
      "Eye injury response protocol (including Amsler Grid test)",
      "Equipment modification approval process",
      "Daily pre-show check procedures",
      "Permissible display effects and constraints",
      "Routine servicing and maintenance procedures",
      "External optical component inspection procedures"
    ],
    handoverRequirements: [
      "Clear instructions on display controls and their effects",
      "Details of all permissible display effects and safety implications",
      "Information on manual shutdown and monitoring requirements",
      "Details of automatic emergency shutdown systems and maintenance",
      "Routine servicing procedures and frequency",
      "Routine adjustment and alignment checks with corrective actions",
      "Operator competency and training requirements",
      "Supplier contact information for technical support"
    ]
  },

  /**
   * MPE Selection Guidelines (LSO Responsibility)
   */
  mpeGuidelines: {
    audience: {
      timeBase: "10 seconds minimum (continuous exposure)",
      simplifiedValue: "10 W/m² (equivalent to 1 mW/cm²) for 400-700nm",
      notes: "For intentional exposures, minimum time base is 10 seconds. Children's MPE should be reduced by factor of 10 for wavelengths below 500nm."
    },
    employees: {
      timeBase: "0.25 seconds (aversion response) with specific safety training",
      conditions: "Only applicable during setting up procedures with trained personnel",
      standard: "10 seconds for standard operations without specific training"
    },
    performers: {
      timeBase: "0.25 seconds with specialized training including stage choreography",
      additionalRequirements: "Training must include use of stage choreography to assure ocular exposure risk is negligible"
    },
    keyValues: [
      { timeBase: "0.25 seconds", eyeMPE: "2.54 mW/cm²", application: "Trained employees during setup" },
      { timeBase: "1 second", eyeMPE: "1.80 mW/cm²", application: "Fault conditions with safety system response" },
      { timeBase: "3 seconds", eyeMPE: "1.37 mW/cm²", application: "Intermediate fault scenarios" },
      { timeBase: "10 seconds", eyeMPE: "1.01 mW/cm²", application: "Audience exposure (minimum)" },
      { timeBase: "Continuous", skinMPE: "200 mW/cm²", application: "Skin exposure limit" }
    ]
  },

  /**
   * Emergency Procedures
   */
  emergencyProcedures: {
    eyeInjuryResponse: [
      "Treat actual eye injuries as medical emergencies",
      "Take casualty to A&E (Accident & Emergency) immediately",
      "Provide laser beam details (wavelength, power, exposure duration)",
      "If perceived injury, wait 5 minutes and ask if symptoms persist",
      "Use Amsler Grid test to check for retinal disturbances",
      "If irregularities detected, instruct immediate optometrist visit",
      "Record full incident details including timing and circumstances"
    ],
    equipmentFailure: [
      "E-stop activation immediately stops all laser outputs",
      "After E-stop use, laser cannot be automatically restarted",
      "Deliberate action by trained person required for restart",
      "Full safety system verification required before resuming operations",
      "Document failure and corrective actions taken"
    ],
    audienceUnruliness: [
      "Stop display/effect if audience behavior creates unsafe conditions",
      "Monitor for climbing on furniture or introducing reflective objects",
      "Be prepared to activate E-stop if audience enters restricted areas"
    ]
  },

  /**
   * Quiz Questions (30 total)
   */
  quizQuestions: [
    {
      id: "lso_q1",
      type: "multiple_choice",
      pageRef: 5,
      difficulty: "beginner",
      question: "What are the four main laser beam hazards listed in the guidance?",
      options: [
        "Eye damage, hearing loss, fire, chemical exposure",
        "Permanent eye damage, skin burns, source of ignition, distraction/dazzle/glare",
        "Radiation, heat, electricity, noise",
        "Cancer, blindness, burns, explosion"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. The four main hazards are: permanent eye damage, skin burns, source of ignition, and distraction/dazzle/glare.",
      explanationIncorrect: "Incorrect. The four main hazards are permanent eye damage, skin burns, source of ignition, and distraction/dazzle/glare.",
      topic: "Hazard Identification"
    },
    {
      id: "lso_q2",
      type: "multiple_choice",
      pageRef: 6,
      difficulty: "intermediate",
      question: "What power range do entertainment industry lasers typically have?",
      options: [
        "1mW to 10mW",
        "10mW to 100mW",
        "200mW to 40W+",
        "100W to 1000W"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. Entertainment lasers typically range from 200mW to 40W+, i.e., Class 3B and 4.",
      explanationIncorrect: "Incorrect. Entertainment lasers typically range from 200mW to 40W+ (Class 3B and 4).",
      topic: "Laser Classification"
    },
    {
      id: "lso_q3",
      type: "true_false",
      pageRef: 6,
      difficulty: "intermediate",
      question: "Non-visible wavelengths in laser beams (less than 400nm or more than 700nm) are less hazardous than visible wavelengths.",
      correctAnswer: false,
      explanationCorrect: "Correct. Non-visible wavelengths are potentially far MORE hazardous because the eye cannot react to wavelengths it cannot see.",
      explanationIncorrect: "Incorrect. Non-visible wavelengths are MORE hazardous because the eye cannot react to them.",
      topic: "Optical Hazards"
    },
    {
      id: "lso_q4",
      type: "scenario",
      pageRef: 7,
      difficulty: "advanced",
      question: "A laser show designer wants to create audience scanning effects using a Q-switched laser. What should the LSO advise?",
      options: [
        "Proceed with standard safety measures",
        "Use lower power settings only",
        "Q-switched lasers should not be used where people may be exposed",
        "Add extra scanning failure systems"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. Q-switched and pulsed lasers should not be used where exposure of people is intended or likely.",
      explanationIncorrect: "Incorrect. The guidance states Q-switched lasers should not be used where people may be exposed.",
      topic: "Pulsed Lasers"
    },
    {
      id: "lso_q5",
      type: "multiple_choice",
      pageRef: 7,
      difficulty: "intermediate",
      question: "At what power level do skin burn and fire risks become significant?",
      options: [
        "100mW",
        "500mW",
        "1W",
        "5W"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. Skin burn and fire risks become significant above 500mW.",
      explanationIncorrect: "Incorrect. Skin burn and fire risks become significant above 500mW.",
      topic: "Fire and Skin Hazards"
    },
    {
      id: "lso_q6",
      type: "multiple_choice",
      pageRef: 8,
      difficulty: "intermediate",
      question: "For outdoor displays, which authority must be notified?",
      options: [
        "Local Police",
        "Fire Department",
        "Civil Aviation Authority (CAA)",
        "Environmental Health"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. The CAA (Civil Aviation Authority) must be notified for outdoor laser displays.",
      explanationIncorrect: "Incorrect. The Civil Aviation Authority (CAA) must be notified for outdoor displays.",
      topic: "Outdoor Displays"
    },
    {
      id: "lso_q7",
      type: "multiple_choice",
      pageRef: 9,
      difficulty: "intermediate",
      question: "What is the difference between an LSO and an LSA?",
      options: [
        "LSO is paid more than LSA",
        "LSO has executive responsibility; LSA is advisory only",
        "LSA requires more training than LSO",
        "There is no difference"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. The LSO has executive responsibility, while the LSA (Laser Safety Adviser) is an advisory role without executive mandate.",
      explanationIncorrect: "Incorrect. The key difference is that LSO has executive responsibility while LSA is advisory only.",
      topic: "Roles and Responsibilities"
    },
    {
      id: "lso_q8",
      type: "multiple_choice",
      pageRef: 9,
      difficulty: "beginner",
      question: "Who is responsible for ensuring laser installation is safe at a venue?",
      options: [
        "Only the laser operator",
        "Only the client",
        "Venue management",
        "Local authorities"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. Venue management is responsible for ensuring installation and operation are safe.",
      explanationIncorrect: "Incorrect. Venue management has responsibility for ensuring safe installation and operation.",
      topic: "Roles and Responsibilities"
    },
    {
      id: "lso_q9",
      type: "true_false",
      pageRef: 10,
      difficulty: "intermediate",
      question: "Operators should complete daily or weekly alignment checks for temporary installations.",
      correctAnswer: true,
      explanationCorrect: "Correct. Operators should maintain logs of daily/weekly alignment checks.",
      explanationIncorrect: "Incorrect. The guidance requires operators to complete daily/weekly alignment check logs.",
      topic: "Maintenance"
    },
    {
      id: "lso_q10",
      type: "scenario",
      pageRef: 11,
      difficulty: "advanced",
      question: "During a show, an audience member reports a suspected eye injury from laser exposure. What is the FIRST action?",
      options: [
        "Give them eye drops and continue the show",
        "Treat as medical emergency and take to A&E with laser details",
        "Ask them to wait until after the show",
        "Tell them it's probably just temporary dazzle"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. Actual eye injuries should be treated as medical emergencies with casualty taken to A&E with laser beam details.",
      explanationIncorrect: "Incorrect. Actual eye injuries must be treated as medical emergencies and the casualty taken to A&E.",
      topic: "Emergency Procedures"
    },
    {
      id: "lso_q11",
      type: "multiple_choice",
      pageRef: 12,
      difficulty: "advanced",
      question: "What is the most important factor in determining the safety of scanned laser effects?",
      options: [
        "Laser color",
        "Scanner manufacturer",
        "Scanning frequency and speed",
        "Room temperature"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. The speed and frequency that beams pass over the eye is the most important safety factor.",
      explanationIncorrect: "Incorrect. Scanning frequency is the key determinant of injury threshold for scanned effects.",
      topic: "Scanning Safety"
    },
    {
      id: "lso_q12",
      type: "true_false",
      pageRef: 12,
      difficulty: "intermediate",
      question: "Installations intended to expose audiences may be left unattended if scan-failure systems are in place.",
      correctAnswer: false,
      explanationCorrect: "Correct. Audience exposure installations should NEVER be left unattended, even with safety systems.",
      explanationIncorrect: "Incorrect. These installations should NEVER be left unattended.",
      topic: "Scanning Safety"
    },
    {
      id: "lso_q13",
      type: "multiple_choice",
      pageRef: 15,
      difficulty: "advanced",
      question: "What is the minimum exposure time base for deliberate audience exposure?",
      options: [
        "0.25 seconds",
        "1 second",
        "3 seconds",
        "10 seconds"
      ],
      correctAnswer: 3,
      explanationCorrect: "Correct. For audience exposure, an exposure duration of 10 seconds minimum should be assumed.",
      explanationIncorrect: "Incorrect. 10 seconds is the minimum time base for deliberate audience exposure.",
      topic: "MPE Calculations"
    },
    {
      id: "lso_q14",
      type: "multiple_choice",
      pageRef: 15,
      difficulty: "advanced",
      question: "For trained employees during setup, what aversion response time can be assumed?",
      options: [
        "0.1 seconds",
        "0.25 seconds",
        "0.5 seconds",
        "1 second"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. For trained employees, the eye aversion response time of 0.25 seconds may be used.",
      explanationIncorrect: "Incorrect. The aversion response time of 0.25 seconds applies to trained employees.",
      topic: "MPE Calculations"
    },
    {
      id: "lso_q15",
      type: "multiple_choice",
      pageRef: 16,
      difficulty: "intermediate",
      question: "What are the minimum separation distances for a SUPERVISED laser installation?",
      options: [
        "1m vertical, 1m lateral",
        "2m vertical, 2m lateral",
        "3m vertical, 2.5m lateral",
        "6m vertical, 5m lateral"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. For supervised installations: 3m vertical and 2.5m lateral separation.",
      explanationIncorrect: "Incorrect. Supervised installations require 3m vertical and 2.5m lateral separation.",
      topic: "Separation Distances"
    },
    {
      id: "lso_q16",
      type: "multiple_choice",
      pageRef: 16,
      difficulty: "intermediate",
      question: "What is the vertical separation distance for UNSUPERVISED installations?",
      options: [
        "3m",
        "4m",
        "6m",
        "10m"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. For unsupervised installations, the vertical separation should be 6m.",
      explanationIncorrect: "Incorrect. Unsupervised installations require 6m vertical separation.",
      topic: "Separation Distances"
    },
    {
      id: "lso_q17",
      type: "true_false",
      pageRef: 18,
      difficulty: "intermediate",
      question: "Changes to laser system installation can be made by the operator without consulting the LSO.",
      correctAnswer: false,
      explanationCorrect: "Correct. Changes to installation should only be carried out with LSO agreement.",
      explanationIncorrect: "Incorrect. Changes require agreement from the LSO.",
      topic: "Installation Changes"
    },
    {
      id: "lso_q18",
      type: "multiple_choice",
      pageRef: 19,
      difficulty: "intermediate",
      question: "How often should E-stop controls be tested?",
      options: [
        "Monthly",
        "Weekly",
        "Before each performance",
        "Annually"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. E-stop(s) should ideally be tested before each performance.",
      explanationIncorrect: "Incorrect. E-stops should be tested before each performance.",
      topic: "Pre-show Checks"
    },
    {
      id: "lso_q19",
      type: "true_false",
      pageRef: 19,
      difficulty: "intermediate",
      question: "After using an E-stop, the laser can be automatically restarted.",
      correctAnswer: false,
      explanationCorrect: "Correct. After E-stop use, the laser must be restarted by deliberate action of a trained person.",
      explanationIncorrect: "Incorrect. The laser must be deliberately restarted by an operator or trained person.",
      topic: "Emergency Systems"
    },
    {
      id: "lso_q20",
      type: "multiple_choice",
      pageRef: 22,
      difficulty: "advanced",
      question: "What is the simplified MPE value for wavelengths 400-700nm?",
      options: [
        "1 W/m²",
        "10 W/m² (equivalent to 1 mW/cm²)",
        "100 W/m²",
        "1000 W/m²"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. The simplified MPE is 10 W/m² (1 mW/cm²) for 400-700nm.",
      explanationIncorrect: "Incorrect. The simplified MPE is 10 W/m² or 1 mW/cm² for visible wavelengths.",
      topic: "MPE Values"
    },
    {
      id: "lso_q21",
      type: "multiple_choice",
      pageRef: 22,
      difficulty: "intermediate",
      question: "What is the skin MPE value?",
      options: [
        "10 mW/cm²",
        "100 mW/cm²",
        "200 mW/cm²",
        "500 mW/cm²"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. The skin MPE is 200 mW/cm².",
      explanationIncorrect: "Incorrect. The skin MPE value is 200 mW/cm².",
      topic: "MPE Values"
    },
    {
      id: "lso_q22",
      type: "multiple_choice",
      pageRef: 28,
      difficulty: "intermediate",
      question: "What is the Accessible Emission Limit for Class 3B continuous wave lasers?",
      options: [
        "1mW",
        "5mW",
        "500mW",
        "5W"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. Class 3B has an AEL of 500mW for continuous wave lasers.",
      explanationIncorrect: "Incorrect. Class 3B AEL is 500mW for continuous wave lasers.",
      topic: "Laser Classification"
    },
    {
      id: "lso_q23",
      type: "multiple_choice",
      pageRef: 28,
      difficulty: "beginner",
      question: "Which laser class is described as HIGH POWER with eye, skin and fire hazard?",
      options: [
        "Class 2",
        "Class 3R",
        "Class 3B",
        "Class 4"
      ],
      correctAnswer: 3,
      explanationCorrect: "Correct. Class 4 is HIGH POWER with hazards to eye, skin and fire risk.",
      explanationIncorrect: "Incorrect. Class 4 is the high power class with eye, skin and fire hazards.",
      topic: "Laser Classification"
    },
    {
      id: "lso_q24",
      type: "true_false",
      pageRef: 28,
      difficulty: "beginner",
      question: "Class 2 lasers are inherently eye-safe.",
      correctAnswer: false,
      explanationCorrect: "Correct. Class 2 lasers are NOT inherently safe - protection is provided by the blink reflex (0.25 sec).",
      explanationIncorrect: "Incorrect. Class 2 lasers are NOT inherently safe; protection comes from the natural aversion response.",
      topic: "Laser Classification"
    },
    {
      id: "lso_q25",
      type: "calculation",
      pageRef: 22,
      difficulty: "advanced",
      question: "Using the MPE table, what is the eye MPE for a 3-second exposure?",
      options: [
        "2.54 mW/cm²",
        "1.80 mW/cm²",
        "1.37 mW/cm²",
        "1.01 mW/cm²"
      ],
      correctAnswer: 2,
      explanationCorrect: "Correct. The eye MPE for 3 seconds is 1.37 mW/cm².",
      explanationIncorrect: "Incorrect. Per the table: 0.25s=2.54, 1s=1.80, 3s=1.37, 10s=1.01 mW/cm².",
      topic: "MPE Calculations"
    },
    {
      id: "lso_q26",
      type: "scenario",
      pageRef: 29,
      difficulty: "advanced",
      question: "In Case Study 1, why was one laser projector disconnected before the show?",
      options: [
        "It was broken",
        "It had been accidentally moved and couldn't be safely realigned in time",
        "The power was too high",
        "The CAA didn't approve it"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. The laser had been accidentally moved, and there wasn't time to safely realign it before the audience arrived.",
      explanationIncorrect: "Incorrect. The laser was moved accidentally and couldn't be safely realigned before the audience arrived.",
      topic: "Case Study Analysis"
    },
    {
      id: "lso_q27",
      type: "multiple_choice",
      pageRef: 32,
      difficulty: "beginner",
      question: "According to Case Study 4, what should a mobile DJ do if asked to shine lasers on the dance floor?",
      options: [
        "Do it if the client insists",
        "Refuse as it may be unsafe",
        "Only do it for special dances",
        "Reduce the power first"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. The DJ should refuse as it may be unsafe for guests to stare into laser beams.",
      explanationIncorrect: "Incorrect. The guidance shows the DJ refused the request due to safety concerns.",
      topic: "Case Study Analysis"
    },
    {
      id: "lso_q28",
      type: "multiple_choice",
      pageRef: 27,
      difficulty: "intermediate",
      question: "What does OPSL stand for?",
      options: [
        "Optical Power Safety Level",
        "Optically Pumped Semiconductor Laser",
        "Output Power Scanning Limit",
        "Optical Protection Safety Layer"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. OPSL = Optically Pumped Semiconductor Laser.",
      explanationIncorrect: "Incorrect. OPSL stands for Optically Pumped Semiconductor Laser.",
      topic: "Laser Types"
    },
    {
      id: "lso_q29",
      type: "multiple_choice",
      pageRef: 26,
      difficulty: "intermediate",
      question: "What is the Zero Diffracted Order?",
      options: [
        "The lowest power beam from a diffraction grating",
        "The reflected beam following the path of a mirror reflection",
        "A safety system for diffracted beams",
        "The first beam that exits the laser"
      ],
      correctAnswer: 1,
      explanationCorrect: "Correct. It's the reflected beam from a diffraction grating following the mirror path, typically with highest power.",
      explanationIncorrect: "Incorrect. It's the reflected beam following the path a beam would take if the grating were a mirror.",
      topic: "Optics Terminology"
    },
    {
      id: "lso_q30",
      type: "true_false",
      pageRef: 22,
      difficulty: "intermediate",
      question: "When performing for children, the MPE level should be reduced by a factor of 10 for wavelengths below 500nm.",
      correctAnswer: true,
      explanationCorrect: "Correct. Children's eyes are more sensitive; the MPE should be reduced by 10x for wavelengths below 500nm.",
      explanationIncorrect: "Incorrect. The guidance specifically states this reduction for child audiences.",
      topic: "Special Populations"
    }
  ]
};

export default module3Content;
