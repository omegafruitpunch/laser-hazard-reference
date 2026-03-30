// Data and content for Module 8.6: Integration & Certification Prep

import {
  CertificationExam,
  KnowledgeDomain,
  CourseIntegration,
  ExamQuestion
} from './types';

export const moduleInfo = {
  id: 'module-8.6',
  title: 'Integration & Certification Prep',
  courseId: 'course-8',
  courseName: 'Industry Standards',
  description: 'Comprehensive integration of all laser safety courses with certification exam preparation, knowledge gap analysis, and personalized study planning.',
  duration: 45,
  learningObjectives: [
    'Integrate knowledge from all laser safety courses',
    'Prepare for CLSO/CMLSO certification exams',
    'Identify and address knowledge gaps',
    'Create a personalized study plan',
    'Master cross-domain problem solving'
  ],
  prerequisites: ['module-8.1', 'module-8.2', 'module-8.3', 'module-8.4', 'module-8.5'],
  nextModule: null,
  isFinalModule: true
};

export const phases = [
  {
    id: 'warmup',
    title: 'Course Integration Overview',
    duration: 5,
    type: 'warmup' as const,
  },
  {
    id: 'core',
    title: 'Knowledge Gap Identifier',
    duration: 10,
    type: 'core' as const,
  },
  {
    id: 'practice',
    title: 'Certification Practice Exam',
    duration: 20,
    type: 'practice' as const,
  },
  {
    id: 'challenge',
    title: 'Study Plan & Final Review',
    duration: 10,
    type: 'challenge' as const,
  },
];

// Knowledge Domains for CLSO/CMLSO
export const knowledgeDomains: KnowledgeDomain[] = [
  {
    id: 'domain-1',
    name: 'Laser Fundamentals and Optics',
    description: 'Basic laser physics, properties of laser light, and optical principles',
    courses: ['course-1'],
    weight: 10,
    competencies: [
      { id: 'c1-1', statement: 'Explain the nature of electromagnetic radiation', level: 'basic', assessed: true },
      { id: 'c1-2', statement: 'Describe the unique properties of laser light', level: 'basic', assessed: true },
      { id: 'c1-3', statement: 'Understand laser classification system', level: 'basic', assessed: true },
      { id: 'c1-4', statement: 'Identify common laser types and wavelengths', level: 'basic', assessed: true },
      { id: 'c1-5', statement: 'Calculate basic laser parameters', level: 'intermediate', assessed: true }
    ]
  },
  {
    id: 'domain-2',
    name: 'Bioeffects and Hazard Analysis',
    description: 'Biological effects of laser exposure, bioeffects, and hazard evaluation',
    courses: ['course-1', 'course-2', 'course-3'],
    weight: 20,
    competencies: [
      { id: 'c2-1', statement: 'Identify structures of the eye and their vulnerability', level: 'basic', assessed: true },
      { id: 'c2-2', statement: 'Explain retinal vs corneal hazard regions', level: 'basic', assessed: true },
      { id: 'c2-3', statement: 'Calculate Maximum Permissible Exposure (MPE)', level: 'intermediate', assessed: true },
      { id: 'c2-4', statement: 'Determine Nominal Ocular Hazard Distance (NOHD)', level: 'intermediate', assessed: true },
      { id: 'c2-5', statement: 'Assess skin exposure hazards', level: 'intermediate', assessed: true },
      { id: 'c2-6', statement: 'Evaluate fire and other non-beam hazards', level: 'intermediate', assessed: true }
    ]
  },
  {
    id: 'domain-3',
    name: 'Protective Equipment',
    description: 'Laser protective eyewear, barriers, and other protective measures',
    courses: ['course-2', 'course-3'],
    weight: 15,
    competencies: [
      { id: 'c3-1', statement: 'Select appropriate laser protective eyewear', level: 'intermediate', assessed: true },
      { id: 'c3-2', statement: 'Calculate required optical density', level: 'intermediate', assessed: true },
      { id: 'c3-3', statement: 'Inspect and maintain protective equipment', level: 'basic', assessed: true },
      { id: 'c3-4', statement: 'Specify protective barriers and enclosures', level: 'intermediate', assessed: true },
      { id: 'c3-5', statement: 'Understand PPE program requirements', level: 'intermediate', assessed: true }
    ]
  },
  {
    id: 'domain-4',
    name: 'Standards and Regulations',
    description: 'ANSI Z136 series, FDA regulations, and other applicable standards',
    courses: ['course-4', 'course-8'],
    weight: 20,
    competencies: [
      { id: 'c4-1', statement: 'Navigate ANSI Z136.1 standard content', level: 'intermediate', assessed: true },
      { id: 'c4-2', statement: 'Apply FDA 21 CFR 1040 requirements', level: 'intermediate', assessed: true },
      { id: 'c4-3', statement: 'Understand state and local regulations', level: 'intermediate', assessed: true },
      { id: 'c4-4', statement: 'Identify applicable subsidiary standards', level: 'intermediate', assessed: true },
      { id: 'c4-5', statement: 'Apply international standards (IEC 60825)', level: 'advanced', assessed: true }
    ]
  },
  {
    id: 'domain-5',
    name: 'Safety Program Management',
    description: 'LSO responsibilities, training, audits, and safety program elements',
    courses: ['course-5', 'course-6', 'course-7', 'course-8'],
    weight: 20,
    competencies: [
      { id: 'c5-1', statement: 'Define LSO responsibilities and authority', level: 'intermediate', assessed: true },
      { id: 'c5-2', statement: 'Develop laser safety training programs', level: 'advanced', assessed: true },
      { id: 'c5-3', statement: 'Conduct safety audits and inspections', level: 'advanced', assessed: true },
      { id: 'c5-4', statement: 'Manage medical surveillance programs', level: 'intermediate', assessed: true },
      { id: 'c5-5', statement: 'Establish emergency response procedures', level: 'advanced', assessed: true },
      { id: 'c5-6', statement: 'Maintain required documentation', level: 'intermediate', assessed: true }
    ]
  },
  {
    id: 'domain-6',
    name: 'Application-Specific Requirements',
    description: 'Specialized requirements for specific laser applications',
    courses: ['course-6', 'course-7', 'course-8'],
    weight: 15,
    competencies: [
      { id: 'c6-1', statement: 'Apply entertainment laser safety requirements', level: 'advanced', assessed: true },
      { id: 'c6-2', statement: 'Understand audience scanning safety', level: 'advanced', assessed: true },
      { id: 'c6-3', statement: 'Coordinate with regulatory authorities', level: 'advanced', assessed: true },
      { id: 'c6-4', statement: 'Manage outdoor laser operations', level: 'advanced', assessed: true },
      { id: 'c6-5', statement: 'Apply research laboratory safety requirements', level: 'intermediate', assessed: true }
    ]
  }
];

// Certification Exams
export const certificationExams: CertificationExam[] = [
  {
    id: 'exam-clso',
    name: 'CLSO Certification Practice',
    description: 'Certified Laser Safety Officer - Comprehensive professional certification',
    type: 'CLSO',
    duration: 180,
    questionCount: 100,
    passingScore: 70,
    categories: [
      {
        id: 'cat-fundamentals',
        name: 'Laser Fundamentals',
        weight: 10,
        questions: []
      },
      {
        id: 'cat-bioeffects',
        name: 'Bioeffects and Hazards',
        weight: 20,
        questions: []
      },
      {
        id: 'cat-protection',
        name: 'Protective Measures',
        weight: 15,
        questions: []
      },
      {
        id: 'cat-standards',
        name: 'Standards and Regulations',
        weight: 20,
        questions: []
      },
      {
        id: 'cat-management',
        name: 'Safety Program Management',
        weight: 20,
        questions: []
      },
      {
        id: 'cat-applications',
        name: 'Application-Specific',
        weight: 15,
        questions: []
      }
    ]
  },
  {
    id: 'exam-cmlso',
    name: 'CMLSO Certification Practice',
    description: 'Certified Medical Laser Safety Officer - Healthcare-specific certification',
    type: 'CMLSO',
    duration: 120,
    questionCount: 75,
    passingScore: 70,
    categories: [
      {
        id: 'cat-medical-bio',
        name: 'Medical Bioeffects',
        weight: 25,
        questions: []
      },
      {
        id: 'cat-medical-standards',
        name: 'Medical Standards',
        weight: 20,
        questions: []
      },
      {
        id: 'cat-medical-mgmt',
        name: 'Healthcare Safety Management',
        weight: 30,
        questions: []
      },
      {
        id: 'cat-medical-equip',
        name: 'Medical Laser Equipment',
        weight: 25,
        questions: []
      }
    ]
  }
];

// Practice Exam Questions
export const practiceQuestions: ExamQuestion[] = [
  // Domain 1: Laser Fundamentals
  {
    id: 'PQ-001',
    type: 'multiple_choice',
    category: 'Laser Fundamentals',
    question: 'Which property of laser light is primarily responsible for its ability to maintain high intensity over long distances?',
    options: ['Coherence', 'Monochromaticity', 'Low divergence', 'Polarization'],
    correctAnswer: 2,
    explanation: 'Low divergence (minimal beam spreading) allows laser light to maintain its intensity over long distances, unlike conventional light sources that spread rapidly.',
    reference: 'ANSI Z136.1 Section 2.2',
    difficulty: 'easy',
    points: 1
  },
  {
    id: 'PQ-002',
    type: 'true_false',
    category: 'Laser Fundamentals',
    question: 'Laser light is a form of ionizing radiation that can cause DNA damage.',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'Laser light is non-ionizing optical radiation. Unlike X-rays or gamma rays, laser light (visible and infrared) does not have sufficient photon energy to ionize atoms or damage DNA directly.',
    reference: 'ANSI Z136.1 Section 2.1',
    difficulty: 'easy',
    points: 1
  },
  // Domain 2: Bioeffects
  {
    id: 'PQ-003',
    type: 'multiple_choice',
    category: 'Bioeffects and Hazards',
    question: 'The eye focuses visible and near-infrared laser light onto the retina, concentrating the power by approximately what factor?',
    options: ['10x', '100x', '1,000x', '10,000x or more'],
    correctAnswer: 3,
    explanation: 'The eye\'s lens focuses light onto the retina, concentrating laser energy by a factor of 10,000 or more, making even brief exposures potentially catastrophic.',
    reference: 'ANSI Z136.1 Section 3.1',
    difficulty: 'easy',
    points: 1
  },
  {
    id: 'PQ-004',
    type: 'multiple_choice',
    category: 'Bioeffects and Hazards',
    question: 'What is the appropriate MPE time base for intentional audience exposure to scanned laser beams?',
    options: ['0.25 seconds', '1 second', '10 seconds', '100 seconds'],
    correctAnswer: 2,
    explanation: 'For intentional audience exposure, the MPE should be based on continuous, direct ocular exposure for at least 10 seconds per ANSI Z136.10.',
    reference: 'ANSI Z136.10 Section 5.2',
    difficulty: 'medium',
    points: 1
  },
  // Domain 3: Protection
  {
    id: 'PQ-005',
    type: 'multiple_choice',
    category: 'Protective Measures',
    question: 'What is the minimum optical density (OD) required for laser protective eyewear used with a 10.6 µm CO2 laser emitting 100W?',
    options: ['OD 1', 'OD 2', 'OD 3', 'OD 4'],
    correctAnswer: 2,
    explanation: 'OD 3 would provide sufficient attenuation for a 100W CO2 laser, reducing the transmitted power to safe levels. The exact calculation depends on the beam diameter and exposure conditions.',
    reference: 'ANSI Z136.1 Section 6.2',
    difficulty: 'hard',
    points: 1
  },
  {
    id: 'PQ-006',
    type: 'true_false',
    category: 'Protective Measures',
    question: 'Laser protective eyewear with higher optical density always provides better protection than lower OD eyewear.',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'False. Proper protection depends on matching the eyewear\'s wavelength coverage and OD to the specific laser being used. Higher OD at wrong wavelengths provides no protection.',
    reference: 'ANSI Z136.1 Section 6.2',
    difficulty: 'medium',
    points: 1
  },
  // Domain 4: Standards
  {
    id: 'PQ-007',
    type: 'multiple_choice',
    category: 'Standards and Regulations',
    question: 'Which FDA regulation specifies performance standards for laser products?',
    options: ['21 CFR 1000', '21 CFR 1010', '21 CFR 1040.10', '21 CFR 1040.11'],
    correctAnswer: 2,
    explanation: '21 CFR 1040.10 specifies performance standards for laser products including classification, labeling, and safety features.',
    reference: '21 CFR 1040.10',
    difficulty: 'easy',
    points: 1
  },
  {
    id: 'PQ-008',
    type: 'multiple_select',
    category: 'Standards and Regulations',
    question: 'Which of the following are required for FDA variance approval for Class IIIb/IV entertainment laser use? (Select all that apply)',
    options: [
      'Class I limits at audience locations',
      'Scanning safeguards for reflected beams',
      'Designated Laser Safety Officer',
      'ISO 9001 certification'
    ],
    correctAnswer: [0, 1, 2],
    explanation: 'FDA variance requirements include Class I limits at audience, scanning safeguards, and designated LSO. ISO 9001 certification is not an FDA requirement.',
    reference: '21 CFR 1040.11(f)',
    difficulty: 'medium',
    points: 1
  },
  // Domain 5: Management
  {
    id: 'PQ-009',
    type: 'multiple_choice',
    category: 'Safety Program Management',
    question: 'The Laser Safety Officer should have:',
    options: [
      'Only advisory responsibility',
      'Executive authority to implement and enforce safety measures',
      'No authority over operators',
      'Responsibility only for training'
    ],
    correctAnswer: 1,
    explanation: 'The LSO must have executive authority, not just advisory responsibility, to effectively implement and enforce laser safety measures.',
    reference: 'ANSI Z136.1 Section 5.3',
    difficulty: 'easy',
    points: 1
  },
  {
    id: 'PQ-010',
    type: 'scenario',
    category: 'Safety Program Management',
    question: 'An employee reports a possible laser eye exposure during alignment. The LSO should:',
    options: [
      'Reassure the employee and send them back to work',
      'Document the incident and arrange for immediate medical evaluation',
      'Wait to see if symptoms develop',
      'Handle it internally without documentation'
    ],
    correctAnswer: 1,
    explanation: 'All suspected laser eye exposures must be documented and medically evaluated, ideally within 24 hours by an ophthalmologist familiar with laser injuries.',
    reference: 'ANSI Z136.1 Section 7.3',
    difficulty: 'medium',
    points: 1
  },
  // Domain 6: Applications
  {
    id: 'PQ-011',
    type: 'multiple_choice',
    category: 'Application-Specific',
    question: 'For outdoor laser shows, how far in advance must the FAA be notified?',
    options: ['24 hours', '1 week', '2-4 weeks', '3 months'],
    correctAnswer: 2,
    explanation: 'The FAA requires 2-4 weeks advance notification for outdoor laser operations to assess aviation safety impacts.',
    reference: 'FAA Order 7400.2',
    difficulty: 'medium',
    points: 1
  },
  {
    id: 'PQ-012',
    type: 'true_false',
    category: 'Application-Specific',
    question: 'Scan failure detection systems alone are sufficient as the only safety measure for audience scanning applications.',
    options: ['True', 'False'],
    correctAnswer: 1,
    explanation: 'False. Scan failure detection should not be the sole safety measure. Multiple redundant safety systems are required for audience scanning.',
    reference: 'ANSI Z136.10 Section 4.3',
    difficulty: 'medium',
    points: 1
  },
  {
    id: 'PQ-013',
    type: 'multiple_choice',
    category: 'Application-Specific',
    question: 'What is the minimum vertical separation distance for supervised indoor laser installations?',
    options: ['1.5m', '2.5m', '3m', '6m'],
    correctAnswer: 2,
    explanation: 'For supervised installations, laser beams exceeding Class I must be at least 3 meters vertically and 2.5 meters horizontally from audience areas.',
    reference: '21 CFR 1040.11(f)(9)',
    difficulty: 'easy',
    points: 1
  },
  {
    id: 'PQ-014',
    type: 'multiple_choice',
    category: 'Bioeffects and Hazards',
    question: 'The Maximum Permissible Exposure (MPE) for a 532 nm laser for a 0.25 second exposure is approximately:',
    options: ['0.1 mW/cm²', '1.0 mW/cm²', '10 mW/cm²', '100 mW/cm²'],
    correctAnswer: 1,
    explanation: 'The MPE for visible lasers with 0.25s exposure (blink reflex) is approximately 1.0 mW/cm², though exact values should be calculated using ANSI Z136.1 tables.',
    reference: 'ANSI Z136.1 Table 5a',
    difficulty: 'hard',
    points: 1
  },
  {
    id: 'PQ-015',
    type: 'scenario',
    category: 'Safety Program Management',
    question: 'During a routine audit, you find that a laser operator has bypassed a safety interlock. The appropriate response is to:',
    options: [
      'Ignore it if no one was hurt',
      'Verbally warn the operator',
      'Immediately remove the equipment from service and retrain the operator',
      'Document it for the next scheduled review'
    ],
    correctAnswer: 2,
    explanation: 'Bypassed interlocks create immediate danger. Equipment must be removed from service, the interlock restored, and personnel retrained before operations resume.',
    reference: 'ANSI Z136.1 Section 4.3.1',
    difficulty: 'medium',
    points: 1
  }
];

// Course Integration Map
export const courseIntegrations: CourseIntegration[] = [
  {
    courseId: 'course-1',
    courseName: 'Laser Safety Fundamentals',
    keyConcepts: [
      'Properties of laser light (coherence, monochromaticity, divergence)',
      'Biological effects on eyes and skin',
      'Laser classification system',
      'Basic hazard identification'
    ],
    relationshipToCompliance: 'Foundation knowledge required for all laser safety decisions',
    practicalApplications: [
      'Initial hazard assessment',
      'Understanding warning labels',
      'Basic safety zone determination',
      'Communication with operators'
    ]
  },
  {
    courseId: 'course-2',
    courseName: 'Protective Measures',
    keyConcepts: [
      'Laser protective eyewear selection',
      'Optical density calculations',
      'Administrative controls (SOPs, signage)',
      'Engineering controls (barriers, interlocks)'
    ],
    relationshipToCompliance: 'Direct implementation of ANSI Z136.1 control measures',
    practicalApplications: [
      'Eyewear specification and procurement',
      'Control area setup',
      'Safety signage placement',
      'PPE program management'
    ]
  },
  {
    courseId: 'course-3',
    courseName: 'MPE and Hazard Analysis',
    keyConcepts: [
      'Maximum Permissible Exposure calculations',
      'Nominal Ocular Hazard Distance (NOHD)',
      'Nominal Hazard Zone (NHZ)',
      'Diffuse reflection hazards'
    ],
    relationshipToCompliance: 'Technical basis for control measures and safety zones',
    practicalApplications: [
      'Hazard distance calculations',
      'Controlled area boundaries',
      'Eyewear OD determination',
      'Safety documentation'
    ]
  },
  {
    courseId: 'course-4',
    courseName: 'Regulatory Framework',
    keyConcepts: [
      'FDA 21 CFR 1040 requirements',
      'ANSI Z136.1 structure and content',
      'State and local regulations',
      'International standards (IEC 60825)'
    ],
    relationshipToCompliance: 'Legal and standards compliance framework',
    practicalApplications: [
      'Regulatory compliance verification',
      'Documentation requirements',
      'Reporting obligations',
      'Audit preparation'
    ]
  },
  {
    courseId: 'course-5',
    courseName: 'LSO Responsibilities',
    keyConcepts: [
      'LSO duties and authority',
      'Hazard evaluation procedures',
      'Safety program elements',
      'Training requirements'
    ],
    relationshipToCompliance: 'Implementation of comprehensive safety program',
    practicalApplications: [
      'Safety program development',
      'Personnel training delivery',
      'Incident investigation',
      'Management reporting'
    ]
  },
  {
    courseId: 'course-8',
    courseName: 'Industry Standards',
    keyConcepts: [
      'Entertainment-specific requirements',
      'Audience scanning safety',
      'FDA variance procedures',
      'Electrical safety integration'
    ],
    relationshipToCompliance: 'Application-specific compliance for entertainment',
    practicalApplications: [
      'Entertainment laser setup',
      'Audience scanning safety',
      'Regulatory coordination',
      'Touring production safety'
    ]
  }
];

// Integration Map showing how standards apply across courses
export const integrationMap = {
  standards: [
    {
      standardId: 'ansi-z136-1',
      standardName: 'ANSI Z136.1 Safe Use of Lasers',
      applicableCourses: ['course-1', 'course-2', 'course-3', 'course-5'],
      keyRequirements: [
        'LSO appointment and authority',
        'Hazard evaluation requirements',
        'Control measures hierarchy',
        'Training requirements',
        'Medical surveillance'
      ]
    },
    {
      standardId: 'ansi-z136-10',
      standardName: 'ANSI Z136.10 Entertainment',
      applicableCourses: ['course-8'],
      keyRequirements: [
        'Audience scanning MPE criteria',
        'Scan failure detection',
        'Performance safety procedures',
        'Operator qualifications'
      ]
    },
    {
      standardId: 'fda-21cfr1040',
      standardName: 'FDA Laser Product Performance Standard',
      applicableCourses: ['course-4', 'course-8'],
      keyRequirements: [
        'Product classification',
        'Safety features',
        'Labeling requirements',
        'Variance procedures',
        'Reporting requirements'
      ]
    }
  ],
  procedures: [
    {
      procedureId: 'proc-hazard-eval',
      procedureName: 'Hazard Evaluation',
      applicableCourses: ['course-3', 'course-5', 'course-8'],
      steps: [
        'Identify laser parameters',
        'Determine MPE and hazard distances',
        'Assess exposure scenarios',
        'Document findings',
        'Specify control measures'
      ]
    },
    {
      procedureId: 'proc-training',
      procedureName: 'Safety Training',
      applicableCourses: ['course-1', 'course-2', 'course-5'],
      steps: [
        'Assess training needs',
        'Develop training content',
        'Deliver training',
        'Assess comprehension',
        'Document completion'
      ]
    }
  ],
  documentation: [
    {
      documentType: 'Standard Operating Procedure (SOP)',
      requiredCourses: ['course-2', 'course-5', 'course-8'],
      elements: [
        'Purpose and scope',
        'Responsibilities',
        'Procedure steps',
        'Required PPE',
        'Emergency procedures',
        'References'
      ]
    },
    {
      documentType: 'Hazard Assessment',
      requiredCourses: ['course-3', 'course-5', 'course-8'],
      elements: [
        'Laser specifications',
        'MPE calculations',
        'Hazard zone determination',
        'Exposure scenarios',
        'Control measures',
        'Sign-off'
      ]
    }
  ]
};
