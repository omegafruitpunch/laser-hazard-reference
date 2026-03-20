// Data and content for Module 8.5: Electrical Safety Standards

import {
  ElectricalHazard,
  InspectionChecklist,
  EquipmentCategory,
  SafetyDevice,
  ElectricalScenario,
  InteractiveScenario,
  ModulePhase
} from './types';

export const moduleInfo = {
  id: 'module-8.5',
  title: 'Electrical Safety Standards',
  courseId: 'course-8',
  courseName: 'Industry Standards',
  description: 'Electrical safety requirements for laser equipment including interlocks, grounding, and inspection procedures per OSHA, NFPA, and ANSI standards.',
  duration: 25,
  learningObjectives: [
    'Understand electrical hazards associated with laser systems',
    'Apply proper grounding and bonding techniques',
    'Inspect electrical safety interlocks and devices',
    'Identify common electrical faults and failures',
    'Complete electrical safety inspection reports'
  ],
  prerequisites: ['module-8.4'],
  nextModule: 'module-8.6',
};

export const phases: ModulePhase[] = [
  {
    id: 'warmup',
    title: 'Electrical Safety Fundamentals',
    duration: 3,
    type: 'warmup',
  },
  {
    id: 'core',
    title: 'Safety Interlocks and Devices',
    duration: 8,
    type: 'core',
  },
  {
    id: 'practice',
    title: 'Interactive Inspection Tool',
    duration: 8,
    type: 'practice',
  },
  {
    id: 'challenge',
    title: 'Electrical Safety Assessment',
    duration: 6,
    type: 'challenge',
  },
];

export const electricalHazards: ElectricalHazard[] = [
  {
    id: 'haz-shock',
    name: 'Electric Shock',
    description: 'Contact with energized electrical components causing current flow through the body',
    severity: 'critical',
    commonSources: [
      'Exposed wiring',
      'Damaged insulation',
      'Improper grounding',
      'Wet conditions near electrical equipment',
      'Capacitor discharge'
    ],
    mitigationStrategies: [
      'Proper equipment grounding',
      'GFCI protection',
      'Insulation integrity checks',
      'Lockout/tagout procedures',
      'Personnel training'
    ],
    relevantStandards: ['OSHA 29 CFR 1910.333', 'NFPA 70E', 'ANSI Z136.1 Section 4.3.7']
  },
  {
    id: 'haz-arc',
    name: 'Arc Flash',
    description: 'Sudden release of electrical energy through the air due to fault conditions',
    severity: 'critical',
    commonSources: [
      'Short circuits',
      'Loose connections',
      'Insulation failure',
      'Improper switching operations',
      'Dust/contamination buildup'
    ],
    mitigationStrategies: [
      'Arc flash hazard analysis',
      'Proper PPE for electrical work',
      'Equipment maintenance',
      'Arc flash boundary establishment',
      'Safety interlocks'
    ],
    relevantStandards: ['NFPA 70E', 'IEEE 1584', 'OSHA 29 CFR 1910.333']
  },
  {
    id: 'haz-fire',
    name: 'Electrical Fire',
    description: 'Fire initiated by electrical faults, overheating, or arc discharge',
    severity: 'critical',
    commonSources: [
      'Overloaded circuits',
      'Faulty wiring',
      'Poor connections',
      'Improper cable routing',
      'Inadequate circuit protection'
    ],
    mitigationStrategies: [
      'Proper circuit sizing',
      'Circuit breaker coordination',
      'Temperature monitoring',
      'Fire detection systems',
      'Emergency power cutoff'
    ],
    relevantStandards: ['NFPA 70', 'NFPA 72', 'OSHA 29 CFR 1910.307']
  },
  {
    id: 'haz-interlock',
    name: 'Safety Interlock Failure',
    description: 'Failure of safety interlock systems to prevent access to energized/hazardous components',
    severity: 'high',
    commonSources: [
      'Mechanical wear',
      'Electrical contact degradation',
      'Improper maintenance',
      'Bypassing of interlocks',
      'Software/firmware errors'
    ],
    mitigationStrategies: [
      'Regular interlock testing',
      'Redundant interlock systems',
      'Anti-tamper designs',
      'Hardwired interlocks (vs software)',
      'Documentation and training'
    ],
    relevantStandards: ['21 CFR 1040.11(f)(1)', 'ANSI Z136.1 Section 4.3.1', 'IEC 60825-1']
  },
  {
    id: 'haz-emf',
    name: 'Electromagnetic Interference',
    description: 'EMI/RFI affecting laser control systems or other sensitive equipment',
    severity: 'medium',
    commonSources: [
      'High current switching',
      'Improper cable shielding',
      'Ground loops',
      'Radio transmitters',
      'Motor drives/VFDs'
    ],
    mitigationStrategies: [
      'Proper shielding and grounding',
      'Fiber optic control signals',
      'Isolation transformers',
      'EMI filters',
      'Physical separation'
    ],
    relevantStandards: ['FCC Part 15', 'IEC 61000', 'ANSI C63']
  }
];

export const equipmentCategories: EquipmentCategory[] = [
  {
    id: 'cat-laser-projector',
    name: 'Laser Projector Units',
    description: 'Main laser projection equipment including laser sources, scanning systems, and control electronics',
    inspectionItems: [
      'Power cord condition',
      'Enclosure interlocks',
      'Ground connection integrity',
      'Cooling system electrical components',
      'Emergency stop functionality',
      'Remote interlock connector',
      'Internal wiring condition'
    ],
    commonFailures: [
      'Interlock switch wear',
      'Cooling fan bearing failure',
      'Power supply capacitor degradation',
      'Connection loosening from vibration'
    ]
  },
  {
    id: 'cat-control-system',
    name: 'Control Systems',
    description: 'Laser show controllers, DMX/ACN interfaces, and computer systems',
    inspectionItems: [
      'Power supply ratings',
      'Surge protection devices',
      'Cable management',
      'Grounding of equipment racks',
      'UPS/battery backup status',
      'Network cabling isolation'
    ],
    commonFailures: [
      'Power supply failure',
      'Surge protector degradation',
      'Network switch failure',
      'Ground loop issues'
    ]
  },
  {
    id: 'cat-power-distribution',
    name: 'Power Distribution',
    description: 'Power distribution units, extension cords, and temporary power systems',
    inspectionItems: [
      'Cable capacity vs load',
      'GFCI protection',
      'Connection integrity',
      'Cable routing and protection',
      'Overcurrent protection sizing',
      'Phase balance (3-phase systems)'
    ],
    commonFailures: [
      'Overloaded circuits',
      'GFCI nuisance tripping',
      'Connection overheating',
      'Cable damage from traffic'
    ]
  },
  {
    id: 'cat-accessories',
    name: 'Accessories and Peripherals',
    description: 'Effects devices, mirrors, fog machines, and other auxiliary equipment',
    inspectionItems: [
      'Power requirements vs available',
      'Cord and plug condition',
      'Proper grounding',
      'Wet location suitability',
      'Mounting hardware electrical isolation'
    ],
    commonFailures: [
      'Water ingress in outdoor equipment',
      'Vibration damage to wiring',
      'Improper voltage selection'
    ]
  }
];

export const inspectionChecklist: InspectionChecklist[] = [
  // Visual Inspection Items
  {
    id: 'ELEC-001',
    category: 'Visual Inspection',
    item: 'Power cord condition - no cuts, abrasions, or exposed conductors',
    inspectionMethod: 'Visual inspection, gentle flex test',
    passCriteria: 'No visible damage, insulation intact',
    frequency: 'Before each use',
    hazardLevel: 'high'
  },
  {
    id: 'ELEC-002',
    category: 'Visual Inspection',
    item: 'Plug condition - blades not bent, housing intact',
    inspectionMethod: 'Visual inspection',
    passCriteria: 'Plug in good condition, proper polarity markings visible',
    frequency: 'Before each use',
    hazardLevel: 'medium'
  },
  {
    id: 'ELEC-003',
    category: 'Visual Inspection',
    item: 'Enclosure integrity - no cracks, all screws present',
    inspectionMethod: 'Visual and tactile inspection',
    passCriteria: 'Enclosure secure, no unauthorized access possible',
    frequency: 'Weekly',
    hazardLevel: 'high'
  },
  // Interlock Testing
  {
    id: 'ELEC-101',
    category: 'Safety Interlocks',
    item: 'Protective housing interlock - opens circuit when accessed',
    inspectionMethod: 'Open enclosure while powered, verify laser shutdown',
    passCriteria: 'Immediate laser shutdown upon interlock activation',
    frequency: 'Before each performance',
    hazardLevel: 'critical'
  },
  {
    id: 'ELEC-102',
    category: 'Safety Interlocks',
    item: 'Remote interlock connector functional',
    inspectionMethod: 'Disconnect remote interlock loop, verify shutdown',
    passCriteria: 'Laser cannot operate with interlock open',
    frequency: 'Before each performance',
    hazardLevel: 'critical'
  },
  {
    id: 'ELEC-103',
    category: 'Safety Interlocks',
    item: 'Key control - removable key disables operation',
    inspectionMethod: 'Remove key during operation',
    passCriteria: 'Laser emission terminates when key removed',
    frequency: 'Weekly',
    hazardLevel: 'critical'
  },
  // Grounding
  {
    id: 'ELEC-201',
    category: 'Grounding',
    item: 'Equipment grounding conductor continuity',
    inspectionMethod: 'Continuity test or ground impedance test',
    passCriteria: 'Less than 1 ohm resistance to ground',
    frequency: 'Monthly',
    hazardLevel: 'critical'
  },
  {
    id: 'ELEC-202',
    category: 'Grounding',
    item: 'Ground pin present on plugs',
    inspectionMethod: 'Visual inspection',
    passCriteria: 'Ground pin not bypassed or removed',
    frequency: 'Before each use',
    hazardLevel: 'critical'
  },
  // GFCI Protection
  {
    id: 'ELEC-301',
    category: 'GFCI Protection',
    item: 'GFCI functionality - test and reset buttons operate',
    inspectionMethod: 'Press TEST button, verify trip; press RESET',
    passCriteria: 'GFCI trips on test and resets properly',
    frequency: 'Before each use (portable), Monthly (fixed)',
    hazardLevel: 'critical'
  },
  {
    id: 'ELEC-302',
    category: 'GFCI Protection',
    item: 'GFCI provided for outdoor/temporary power',
    inspectionMethod: 'Visual identification of GFCI protection',
    passCriteria: 'GFCI protection confirmed present',
    frequency: 'Before each use',
    hazardLevel: 'high'
  },
  // Emergency Systems
  {
    id: 'ELEC-401',
    category: 'Emergency Systems',
    item: 'Emergency stop (E-stop) functionality',
    inspectionMethod: 'Activate E-stop, verify immediate shutdown',
    passCriteria: 'All laser emission terminates immediately',
    frequency: 'Before each performance',
    hazardLevel: 'critical'
  },
  {
    id: 'ELEC-402',
    category: 'Emergency Systems',
    item: 'E-stop reset requires deliberate action',
    inspectionMethod: 'Attempt to restart without resetting E-stop',
    passCriteria: 'System cannot restart without explicit reset',
    frequency: 'Monthly',
    hazardLevel: 'high'
  },
  // Circuit Protection
  {
    id: 'ELEC-501',
    category: 'Circuit Protection',
    item: 'Overcurrent protection properly sized',
    inspectionMethod: 'Compare protection rating to load and conductor ampacity',
    passCriteria: 'Protection rating appropriate for circuit',
    frequency: 'At installation, after changes',
    hazardLevel: 'high'
  },
  {
    id: 'ELEC-502',
    category: 'Circuit Protection',
    item: 'No evidence of overheating at connections',
    inspectionMethod: 'Visual inspection for discoloration, infrared if available',
    passCriteria: 'No signs of overheating',
    frequency: 'Weekly',
    hazardLevel: 'high'
  }
];

export const safetyDevices: SafetyDevice[] = [
  {
    id: 'dev-housing-interlock',
    name: 'Protective Housing Interlock',
    type: 'interlock',
    purpose: 'Prevent laser emission when protective housing is opened',
    testMethod: 'Open housing while powered, verify laser shuts down',
    testFrequency: 'Before each performance',
    applicableEquipment: ['laser-projector', 'laser-source']
  },
  {
    id: 'dev-remote-interlock',
    name: 'Remote Interlock Connector',
    type: 'interlock',
    purpose: 'Allow connection of external safety devices (door switches, mats)',
    testMethod: 'Disconnect interlock loop, verify laser cannot operate',
    testFrequency: 'Before each performance',
    applicableEquipment: ['laser-projector']
  },
  {
    id: 'dev-estop',
    name: 'Emergency Stop (E-stop)',
    type: 'emergency_stop',
    purpose: 'Immediate manual shutdown of laser emission',
    testMethod: 'Press E-stop, verify immediate shutdown and need for deliberate reset',
    testFrequency: 'Before each performance',
    applicableEquipment: ['laser-projector', 'control-system']
  },
  {
    id: 'dev-gfci',
    name: 'Ground Fault Circuit Interrupter (GFCI)',
    type: 'ground_fault',
    purpose: 'Protect against electric shock from ground faults',
    testMethod: 'Press TEST button, verify trip; press RESET',
    testFrequency: 'Before each use (portable), Monthly (fixed)',
    applicableEquipment: ['power-distribution', 'outdoor-equipment']
  },
  {
    id: 'dev-key-switch',
    name: 'Key Control Switch',
    type: 'interlock',
    purpose: 'Prevent unauthorized operation, ensure deliberate restart',
    testMethod: 'Verify key removal stops laser, restart requires key',
    testFrequency: 'Weekly',
    applicableEquipment: ['laser-projector']
  },
  {
    id: 'dev-circuit-breaker',
    name: 'Circuit Breaker / Fuse',
    type: 'circuit_breaker',
    purpose: 'Overcurrent protection for conductors and equipment',
    testMethod: 'Visual inspection for proper rating, no nuisance tripping',
    testFrequency: 'At installation, after changes',
    applicableEquipment: ['all-equipment']
  },
  {
    id: 'dev-surge-protector',
    name: 'Surge Protective Device (SPD)',
    type: 'surge_protection',
    purpose: 'Protect equipment from voltage transients',
    testMethod: 'Visual inspection of status indicator, replace if failed',
    testFrequency: 'Monthly',
    applicableEquipment: ['control-system', 'sensitive-electronics']
  }
];

export const electricalScenarios: ElectricalScenario[] = [
  {
    id: 'scenario-1',
    title: 'Laser Projector Pre-Show Inspection',
    description: 'You are preparing for a laser show. The projector has been transported and set up. Conduct a complete electrical safety inspection.',
    equipment: '10W RGB Laser Projector, 208V 3-phase power',
    hazards: ['Electric shock', 'Interlock failure', 'Ground fault'],
    inspectionPoints: [
      {
        id: 'ip-1',
        description: 'Main power cord condition',
        category: 'Visual',
        correctCondition: 'No cuts, nicks, or exposed conductors',
        commonDefects: ['Cord crushed by road case', 'Insulation worn at strain relief'],
        severity: 'critical'
      },
      {
        id: 'ip-2',
        description: 'Housing interlock functionality',
        category: 'Functional Test',
        correctCondition: 'Laser shuts down immediately when housing opened',
        commonDefects: ['Interlock bypassed', 'Switch contacts worn', 'Mechanical damage'],
        severity: 'critical'
      },
      {
        id: 'ip-3',
        description: 'Remote interlock connector',
        category: 'Functional Test',
        correctCondition: 'Open circuit prevents laser operation',
        commonDefects: ['Connector shorted at factory', 'Wiring fault'],
        severity: 'critical'
      },
      {
        id: 'ip-4',
        description: 'Emergency stop function',
        category: 'Functional Test',
        correctCondition: 'Immediate shutdown, requires deliberate reset',
        commonDefects: ['E-stop not wired', 'Contact failure', 'Software-only implementation'],
        severity: 'critical'
      }
    ],
    correctActions: [
      'Visually inspect all power cords and plugs',
      'Test housing interlock with power on',
      'Test remote interlock loop',
      'Verify E-stop functionality',
      'Confirm proper grounding',
      'Document all test results'
    ],
    incorrectActions: [
      'Skip interlock testing due to time constraints',
      'Assume interlocks work because they did last time',
      'Bypass interlock for testing purposes',
      'Test E-stop only with laser in standby',
      'Ignore minor cord damage'
    ]
  }
];

export const interactiveScenarios: InteractiveScenario[] = [
  {
    id: 'interactive-1',
    title: 'Electrical Safety Inspection - Indoor Venue',
    setup: 'You are the LSO for an indoor laser show at a theater. The installation crew has completed setup. You need to perform the electrical safety portion of the pre-show inspection.',
    equipment: [
      {
        id: 'eq-1',
        name: 'Main Laser Projector',
        type: 'RGB Laser',
        voltage: '208V 3-phase',
        powerRating: '5kW',
        safetyFeatures: ['Housing interlock', 'Remote interlock', 'E-stop', 'Key control']
      },
      {
        id: 'eq-2',
        name: 'Power Distribution',
        type: 'PDUnit',
        voltage: '208V',
        powerRating: '20A per phase',
        safetyFeatures: ['Circuit breakers', 'GFCI on outlets']
      },
      {
        id: 'eq-3',
        name: 'Show Controller',
        type: 'Laser Control PC',
        voltage: '120V',
        powerRating: '500W',
        safetyFeatures: ['UPS backup', 'Surge protection']
      }
    ],
    steps: [
      {
        id: 'step-1',
        order: 1,
        description: 'You approach the main laser projector. The power cord is run across a high-traffic area where crew members are walking. What is your first action?',
        options: [
          {
            id: 'opt-1a',
            text: 'Reroute the power cord away from traffic or provide physical protection',
            correct: true,
            feedback: 'Correct! Cords in traffic areas are at risk of damage and create trip hazards. Always route cords safely or use cord covers.'
          },
          {
            id: 'opt-1b',
            text: 'Proceed with interlock testing; cord damage will be apparent if it occurs',
            correct: false,
            feedback: 'Incorrect! Do not wait for damage to occur. Proactively address the hazard by rerouting or protecting the cord.'
          },
          {
            id: 'opt-1c',
            text: 'Have a crew member monitor the cord during the show',
            correct: false,
            feedback: 'Incorrect! While monitoring helps, it does not eliminate the hazard. Physical protection or rerouting is required.'
          }
        ],
        explanation: 'OSHA requires that flexible cords be protected from damage. Cords in traffic areas are subject to abrasion and crushing.'
      },
      {
        id: 'step-2',
        order: 2,
        description: 'You begin testing the housing interlock. With the laser powered on and keyswitch in ON position, you open the protective housing. The laser continues to emit. What do you do?',
        options: [
          {
            id: 'opt-2a',
            text: 'Immediately place the system out of service and investigate the interlock failure',
            correct: true,
            feedback: 'Correct! A failed housing interlock is a critical safety defect. The system cannot be used until repaired.'
          },
          {
            id: 'opt-2b',
            text: 'Document the failure but continue with the show if the laser can be operated safely',
            correct: false,
            feedback: 'Incorrect! Never operate a laser system with defeated safety interlocks. This violates FDA regulations and ANSI standards.'
          },
          {
            id: 'opt-2c',
            text: 'Close the housing and try the test again - it may have been a momentary glitch',
            correct: false,
            feedback: 'Incorrect! Interlock failures are serious safety issues, not glitches. The system must be taken out of service.'
          }
        ],
        explanation: '21 CFR 1040.11(f)(1) requires a protective housing interlock. Operation with a defeated interlock violates federal regulations.'
      },
      {
        id: 'step-3',
        order: 3,
        description: 'After verifying interlocks are functional, you test the E-stop. When pressed, the laser takes approximately 2 seconds to shut down. Is this acceptable?',
        options: [
          {
            id: 'opt-3a',
            text: 'No - E-stop must cause immediate shutdown, within milliseconds',
            correct: true,
            feedback: 'Correct! E-stop activation must result in immediate laser termination. A 2-second delay indicates a serious fault.'
          },
          {
            id: 'opt-3b',
            text: 'Yes - 2 seconds is fast enough to prevent exposure',
            correct: false,
            feedback: 'Incorrect! Laser eye injuries occur in fractions of a second. E-stop must be immediate, not delayed.'
          },
          {
            id: 'opt-3c',
            text: 'It depends on the laser power and exposure conditions',
            correct: false,
            feedback: 'Incorrect! There is no condition where a 2-second E-stop delay is acceptable for laser systems.'
          }
        ],
        explanation: 'ANSI Z136.1 requires E-stop systems to terminate laser emission immediately. Delays indicate system malfunction or improper design.'
      }
    ],
    objectives: [
      'Identify electrical hazards in laser installations',
      'Properly test safety interlocks',
      'Recognize critical safety defects',
      'Take appropriate corrective actions'
    ],
    passingScore: 100
  }
];

export const quizQuestions = [
  {
    id: 'q1',
    question: 'How often should GFCI protection be tested for portable equipment?',
    options: ['Daily', 'Before each use', 'Weekly', 'Monthly'],
    correctAnswer: 1,
    explanation: 'GFCI protection for portable equipment should be tested before each use according to OSHA and manufacturer guidelines.',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'What is the maximum acceptable ground resistance for equipment grounding?',
    options: ['0.1 ohm', '0.5 ohm', '1 ohm', '5 ohms'],
    correctAnswer: 2,
    explanation: 'Equipment grounding conductor continuity should measure less than 1 ohm resistance to ground.',
    difficulty: 'medium'
  },
  {
    id: 'q3',
    question: 'Which of the following is a CRITICAL finding in an electrical safety inspection?',
    options: [
      'Minor cord abrasion on a 120V accessory',
      'Defeated housing interlock on a Class 4 laser',
      'Missing surge protector on control PC',
      'Loose screw on equipment enclosure'
    ],
    correctAnswer: 1,
    explanation: 'A defeated housing interlock on a Class 4 laser is a critical safety defect that prevents safe operation and violates federal regulations.',
    difficulty: 'easy'
  }
];
