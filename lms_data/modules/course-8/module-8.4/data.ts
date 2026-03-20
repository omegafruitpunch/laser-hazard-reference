// Data and content for Module 8.4: Compliance Documentation

import {
  ChecklistItem,
  OperationType,
  SOPTemplate,
  AuditScenario,
  DocumentationPackage,
  CompliancePhase
} from './types';

export const moduleInfo = {
  id: 'module-8.4',
  title: 'Compliance Documentation',
  courseId: 'course-8',
  courseName: 'Industry Standards',
  description: 'Master the documentation requirements for laser entertainment operations including checklists, SOPs, and audit preparation.',
  duration: 25,
  learningObjectives: [
    'Generate operation-specific compliance checklists',
    'Create comprehensive Standard Operating Procedures (SOPs)',
    'Prepare for regulatory audits and inspections',
    'Understand documentation retention requirements',
    'Apply FDA, FAA, and state notification procedures'
  ],
  prerequisites: ['module-8.1', 'module-8.2', 'module-8.3'],
  nextModule: 'module-8.5',
};

export const phases: CompliancePhase[] = [
  {
    id: 'warmup',
    title: 'Documentation Overview',
    duration: 3,
    type: 'warmup',
  },
  {
    id: 'core',
    title: 'Checklist Generator',
    duration: 8,
    type: 'core',
  },
  {
    id: 'practice',
    title: 'SOP Template Builder',
    duration: 8,
    type: 'practice',
  },
  {
    id: 'challenge',
    title: 'Audit Simulator',
    duration: 6,
    type: 'challenge',
  },
];

export const operationTypes: OperationType[] = [
  {
    id: 'indoor-audience-scanning',
    name: 'Indoor Audience Scanning',
    description: 'Indoor laser shows with intentional audience exposure',
    applicableChecklists: ['pre-show', 'safety-systems', 'documentation', 'emergency'],
    specificRequirements: [
      'FDA variance required for Class IIIb/IV',
      'MPE measurements mandatory',
      'Scan failure detection testing',
      'Audience separation verification'
    ],
    notificationRequirements: [
      {
        authority: 'FDA CDRH',
        timing: '30 days advance',
        method: 'Written notification',
        requiredInfo: ['Show locations', 'Dates and times', 'Equipment list', 'LSO identification'],
        frequency: 'Per show or tour'
      },
      {
        authority: 'State Radiation Control',
        timing: 'Varies by state',
        method: 'Varies by jurisdiction',
        requiredInfo: ['Variance number', 'Operator credentials', 'Venue information'],
        frequency: 'As required by state'
      }
    ]
  },
  {
    id: 'indoor-beam-only',
    name: 'Indoor Beam Effects (No Audience Exposure)',
    description: 'Indoor laser shows without audience scanning',
    applicableChecklists: ['pre-show', 'safety-systems', 'documentation'],
    specificRequirements: [
      'Separation distances maintained',
      'Beam termination verification',
      'Operator control confirmed'
    ],
    notificationRequirements: [
      {
        authority: 'FDA CDRH',
        timing: '30 days advance',
        method: 'Written notification',
        requiredInfo: ['Show locations', 'Equipment classification'],
        frequency: 'Per show or tour'
      }
    ]
  },
  {
    id: 'outdoor-show',
    name: 'Outdoor Laser Display',
    description: 'Open-air laser operations',
    applicableChecklists: ['pre-show', 'safety-systems', 'documentation', 'aviation', 'emergency'],
    specificRequirements: [
      'FAA coordination required',
      'Airspace clearance verification',
      'Weather monitoring procedures',
      'Public access control'
    ],
    notificationRequirements: [
      {
        authority: 'FAA',
        timing: '2-4 weeks advance',
        method: 'Written to regional Airspace office',
        requiredInfo: ['GPS coordinates', 'Beam paths', 'Power levels', 'Date/time'],
        frequency: 'Per outdoor event'
      },
      {
        authority: 'FDA CDRH',
        timing: '30 days advance',
        method: 'Written notification',
        requiredInfo: ['Show locations', 'Dates and times', 'Equipment list'],
        frequency: 'Per show'
      }
    ]
  },
  {
    id: 'touring-production',
    name: 'Touring Production',
    description: 'Multi-venue traveling laser shows',
    applicableChecklists: ['pre-show', 'safety-systems', 'documentation', 'travel', 'emergency'],
    specificRequirements: [
      'Multi-jurisdiction compliance',
      'Portable installation safety',
      'Venue assessment per location',
      'Documentation portability'
    ],
    notificationRequirements: [
      {
        authority: 'FDA CDRH',
        timing: '30 days advance for itinerary',
        method: 'Written notification',
        requiredInfo: ['Tour schedule', 'Equipment list', 'LSO identification'],
        frequency: 'Per tour or update'
      },
      {
        authority: 'State/Local',
        timing: 'Varies by venue',
        method: 'Per jurisdiction requirements',
        requiredInfo: ['Variance', 'Local permits', 'Insurance'],
        frequency: 'Per venue'
      }
    ]
  },
  {
    id: 'permanent-installation',
    name: 'Permanent Venue Installation',
    description: 'Fixed laser systems in entertainment venues',
    applicableChecklists: ['pre-show', 'safety-systems', 'documentation', 'maintenance', 'emergency'],
    specificRequirements: [
      'Building code compliance',
      'Fire marshal approval',
      'Long-term maintenance procedures',
      'Staff training programs'
    ],
    notificationRequirements: [
      {
        authority: 'Local Building/Fire',
        timing: 'During installation planning',
        method: 'Permit application',
        requiredInfo: ['Installation plans', 'Safety features', 'Emergency procedures'],
        frequency: 'Installation/modification'
      }
    ]
  }
];

export const checklistItems: ChecklistItem[] = [
  // Pre-Show Checklist Items
  {
    id: 'CHK-001',
    category: 'pre-show',
    description: 'Verify FDA variance approval (if required for Class IIIb/IV)',
    required: true,
    regulation: '21 CFR 1040.11',
    verificationMethod: 'Visual check of variance certificate',
    frequency: 'Per show',
    documentationType: 'Variance certificate copy'
  },
  {
    id: 'CHK-002',
    category: 'pre-show',
    description: 'Confirm all required notifications sent (FDA, FAA, State)',
    required: true,
    regulation: '21 CFR 1002.30',
    verificationMethod: 'Review notification records',
    frequency: 'Per show',
    documentationType: 'Notification log'
  },
  {
    id: 'CHK-003',
    category: 'pre-show',
    description: 'Verify Laser Safety Officer on-site with executive authority',
    required: true,
    regulation: 'ANSI Z136.1 Section 5.3',
    verificationMethod: 'LSO presence confirmation',
    frequency: 'Per show',
    documentationType: 'Personnel assignment record'
  },
  {
    id: 'CHK-004',
    category: 'pre-show',
    description: 'Review emergency procedures with all personnel',
    required: true,
    regulation: 'ANSI E1.46 Section 6.2',
    verificationMethod: 'Briefing attendance sign-off',
    frequency: 'Per show/day',
    documentationType: 'Training attendance sheet'
  },
  // Safety Systems Checklist Items
  {
    id: 'CHK-101',
    category: 'safety-systems',
    description: 'Test scan failure detection system',
    required: true,
    regulation: '21 CFR 1040.11(f)(8)',
    verificationMethod: 'Simulate scanner fault, verify shutdown',
    frequency: 'Before each performance',
    documentationType: 'Safety test log'
  },
  {
    id: 'CHK-102',
    category: 'safety-systems',
    description: 'Test emergency stop (E-stop) functionality',
    required: true,
    regulation: 'ANSI Z136.1 Section 4.3.8',
    verificationMethod: 'Press E-stop, verify immediate shutdown',
    frequency: 'Before each performance',
    documentationType: 'Safety test log'
  },
  {
    id: 'CHK-103',
    category: 'safety-systems',
    description: 'Verify beam attenuator/key control operational',
    required: true,
    regulation: '21 CFR 1040.11(f)(2)',
    verificationMethod: 'Test key removal stops emission',
    frequency: 'Before each performance',
    documentationType: 'Safety test log'
  },
  {
    id: 'CHK-104',
    category: 'safety-systems',
    description: 'Confirm separation distances (3m vertical attended/6m unattended, 2.5m horizontal)',
    required: true,
    regulation: '21 CFR 1040.11(f)(9)',
    verificationMethod: 'Physical measurement',
    frequency: 'Per installation',
    documentationType: 'Site survey diagram'
  },
  {
    id: 'CHK-105',
    category: 'safety-systems',
    description: 'Verify all required labels present and legible',
    required: true,
    regulation: '21 CFR 1040.11(g)',
    verificationMethod: 'Visual inspection',
    frequency: 'Before each performance',
    documentationType: 'Inspection checklist'
  },
  // Documentation Checklist Items
  {
    id: 'CHK-201',
    category: 'documentation',
    description: 'Risk assessment completed and on-site',
    required: true,
    regulation: 'ANSI Z136.1 Section 5.1',
    verificationMethod: 'Document review',
    frequency: 'Per installation',
    documentationType: 'Risk assessment report'
  },
  {
    id: 'CHK-202',
    category: 'documentation',
    description: 'MPE calculations and measurement records available',
    required: true,
    regulation: 'ANSI Z136.1 Section 8.2',
    verificationMethod: 'Calculation review',
    frequency: 'Per installation',
    documentationType: 'MPE calculation sheet'
  },
  {
    id: 'CHK-203',
    category: 'documentation',
    description: 'Hand-over documentation complete',
    required: true,
    regulation: 'ANSI E1.46 Section 4.4',
    verificationMethod: 'Checklist completion',
    frequency: 'Per installation',
    documentationType: 'Hand-over package'
  },
  {
    id: 'CHK-204',
    category: 'documentation',
    description: 'Operator training records current',
    required: true,
    regulation: '21 CFR 1040.11 Condition D',
    verificationMethod: 'Record review',
    frequency: 'Ongoing',
    documentationType: 'Training records'
  },
  // Emergency Checklist Items
  {
    id: 'CHK-301',
    category: 'emergency',
    description: 'First aid kit accessible and stocked',
    required: true,
    regulation: 'OSHA 29 CFR 1910.151',
    verificationMethod: 'Physical check',
    frequency: 'Before each performance',
    documentationType: 'Equipment checklist'
  },
  {
    id: 'CHK-302',
    category: 'emergency',
    description: 'Emergency contact numbers posted',
    required: true,
    regulation: 'ANSI E1.46 Section 6.2',
    verificationMethod: 'Visual check',
    frequency: 'Per venue',
    documentationType: 'Emergency procedure card'
  },
  {
    id: 'CHK-303',
    category: 'emergency',
    description: 'Evacuation routes identified and clear',
    required: true,
    regulation: 'NFPA 101 Life Safety Code',
    verificationMethod: 'Walk-through inspection',
    frequency: 'Per venue setup',
    documentationType: 'Site safety plan'
  },
  // Aviation Checklist Items (Outdoor)
  {
    id: 'CHK-401',
    category: 'aviation',
    description: 'FAA notification confirmed and documented',
    required: true,
    regulation: 'FAA Order 7400.2',
    verificationMethod: 'Review FAA response',
    frequency: 'Per outdoor show',
    documentationType: 'FAA correspondence'
  },
  {
    id: 'CHK-402',
    category: 'aviation',
    description: 'Critical Flight Zone assessment completed',
    required: true,
    regulation: 'FAA Advisory Circular 70-1',
    verificationMethod: 'Airspace review',
    frequency: 'Per outdoor location',
    documentationType: 'Airspace analysis'
  },
  {
    id: 'CHK-403',
    category: 'aviation',
    description: 'Weather conditions acceptable for safe operation',
    required: true,
    regulation: 'ANSI E1.46 Section 5.3',
    verificationMethod: 'Weather monitoring',
    frequency: 'Before/during show',
    documentationType: 'Weather log'
  },
  // Maintenance Checklist Items (Permanent)
  {
    id: 'CHK-501',
    category: 'maintenance',
    description: 'Alignment check log current',
    required: true,
    regulation: 'ANSI Z136.1 Section 5.3.4',
    verificationMethod: 'Log review',
    frequency: 'Weekly/monthly',
    documentationType: 'Maintenance log'
  },
  {
    id: 'CHK-502',
    category: 'maintenance',
    description: 'Safety system maintenance up to date',
    required: true,
    regulation: '21 CFR 1040.11',
    verificationMethod: 'Service records',
    frequency: 'Per manufacturer schedule',
    documentationType: 'Service records'
  },
  // Travel Checklist Items (Touring)
  {
    id: 'CHK-601',
    category: 'travel',
    description: 'Equipment transport documentation complete',
    required: true,
    regulation: 'DOT Hazmat regulations',
    verificationMethod: 'Shipping papers',
    frequency: 'Per transport',
    documentationType: 'Shipping documents'
  },
  {
    id: 'CHK-602',
    category: 'travel',
    description: 'Venue-specific risk assessments completed',
    required: true,
    regulation: 'ANSI E1.46 Section 4.2',
    verificationMethod: 'Document review',
    frequency: 'Per venue',
    documentationType: 'Venue assessment'
  }
];

export const sopTemplates: SOPTemplate[] = [
  {
    id: 'sop-setup',
    name: 'Laser System Setup and Alignment',
    category: 'operations',
    description: 'Standard procedure for safe installation and alignment of laser projection equipment',
    sections: [
      {
        id: 'pre-installation',
        title: 'Pre-Installation Preparation',
        description: 'Tasks to complete before arriving at venue',
        responsibleParty: 'Lead Technician / LSO',
        references: ['Variance documentation', 'Venue drawings', 'Equipment manuals'],
        steps: [
          {
            id: 'step-001',
            order: 1,
            action: 'Review venue specifications and drawings',
            details: 'Confirm beam paths, mounting points, power availability, and audience layout',
            verification: 'Signed venue assessment form'
          },
          {
            id: 'step-002',
            order: 2,
            action: 'Prepare equipment manifest',
            details: 'List all laser projectors, control systems, safety equipment, and cabling',
            verification: 'Complete equipment checklist'
          },
          {
            id: 'step-003',
            order: 3,
            action: 'Verify all certifications and permits',
            details: 'Confirm FDA variance, insurance, and any required local permits',
            verification: 'Documentation package complete'
          }
        ]
      },
      {
        id: 'physical-installation',
        title: 'Physical Installation',
        description: 'Mounting and securing laser equipment',
        responsibleParty: 'Installation Technician',
        references: ['Equipment mounting guidelines', 'Venue safety rules'],
        steps: [
          {
            id: 'step-101',
            order: 1,
            action: 'Secure laser projectors to stable mounts',
            details: 'Use appropriate rigging hardware rated for dynamic loads',
            hazards: ['Working at height', 'Heavy lifting'],
            ppe: ['Hard hat', 'Safety harness', 'Work gloves'],
            verification: 'Mount shake test passed'
          },
          {
            id: 'step-102',
            order: 2,
            action: 'Route and secure all cabling',
            details: 'Prevent trip hazards and protect cables from damage',
            verification: 'Cable management inspection'
          },
          {
            id: 'step-103',
            order: 3,
            action: 'Install beam blocks and termination points',
            details: 'Ensure all beam paths terminate on non-reflective, non-combustible surfaces',
            verification: 'Beam path diagram marked'
          }
        ]
      },
      {
        id: 'alignment-procedure',
        title: 'Laser Alignment Procedure',
        description: 'Safe alignment of laser beams',
        responsibleParty: 'LSO or Designated Operator',
        references: ['ANSI Z136.1 Section 4.4', 'Manufacturer alignment guide'],
        steps: [
          {
            id: 'step-201',
            order: 1,
            action: 'Evacuate non-essential personnel',
            details: 'Only authorized personnel in controlled area during alignment',
            hazards: ['Direct beam exposure', 'Specular reflections'],
            ppe: ['Laser protective eyewear (appropriate OD)', 'Long sleeves'],
            verification: 'Personnel count confirmed'
          },
          {
            id: 'step-202',
            order: 2,
            action: 'Set laser to minimum power for alignment',
            details: 'Use lowest possible output for safe beam visualization',
            verification: 'Power meter reading recorded'
          },
          {
            id: 'step-203',
            order: 3,
            action: 'Perform initial beam alignment',
            details: 'Align primary beam path using low-power visible alignment aid if available',
            verification: 'Beam hits intended targets'
          },
          {
            id: 'step-204',
            order: 4,
            action: 'Verify all beam paths and terminations',
            details: 'Check for unintended reflections or escapes',
            verification: 'Complete beam path survey'
          }
        ]
      },
      {
        id: 'safety-verification',
        title: 'Safety System Verification',
        description: 'Testing all safety interlocks and controls',
        responsibleParty: 'LSO',
        references: ['21 CFR 1040.11', 'Safety system manuals'],
        steps: [
          {
            id: 'step-301',
            order: 1,
            action: 'Test emergency stop (E-stop)',
            details: 'Press E-stop button and verify immediate laser shutdown',
            verification: 'E-stop test log entry'
          },
          {
            id: 'step-302',
            order: 2,
            action: 'Verify key control functionality',
            details: 'Confirm key removal disables laser emission',
            verification: 'Key control test passed'
          },
          {
            id: 'step-303',
            order: 3,
            action: 'Test scan failure detection',
            details: 'Simulate scanner fault and verify auto-shutdown within milliseconds',
            verification: 'Scan failure test log entry'
          },
          {
            id: 'step-304',
            order: 4,
            action: 'Measure and verify separation distances',
            details: 'Confirm 3m vertical (attended) or 6m (unattended), 2.5m horizontal',
            verification: 'Distance measurements recorded'
          }
        ]
      }
    ],
    applicableOperations: ['indoor-audience-scanning', 'indoor-beam-only', 'outdoor-show', 'touring-production', 'permanent-installation'],
    approvalRequired: true,
    reviewFrequency: 'Annual or after significant changes'
  },
  {
    id: 'sop-operations',
    name: 'Show Operations',
    category: 'operations',
    description: 'Procedures for safe laser show operation during performance',
    sections: [
      {
        id: 'pre-show',
        title: 'Pre-Show Procedures',
        description: 'Tasks before audience admission',
        responsibleParty: 'Operator / LSO',
        references: ['Pre-show checklist', 'Emergency procedures'],
        steps: [
          {
            id: 'step-401',
            order: 1,
            action: 'Complete pre-show safety checklist',
            details: 'All checklist items verified and signed off',
            verification: 'Signed checklist on file'
          },
          {
            id: 'step-402',
            order: 2,
            action: 'Brief all operators and spotters',
            details: 'Review show plan, emergency procedures, and communication signals',
            verification: 'Briefing attendance recorded'
          },
          {
            id: 'step-403',
            order: 3,
            action: 'Verify emergency communication systems',
            details: 'Test radios, E-stop functionality, and emergency contacts',
            verification: 'Communication check completed'
          }
        ]
      },
      {
        id: 'during-show',
        title: 'During Show',
        description: 'Active show operation procedures',
        responsibleParty: 'Primary Operator',
        references: ['Show programming documentation'],
        steps: [
          {
            id: 'step-501',
            order: 1,
            action: 'Maintain continuous visual surveillance',
            details: 'Operator must maintain line of sight to all beam paths and audience',
            verification: 'Position verification'
          },
          {
            id: 'step-502',
            order: 2,
            action: 'Monitor for unsafe conditions',
            details: 'Watch for audience members climbing, throwing objects, or equipment malfunction',
            verification: 'Continuous monitoring log'
          },
          {
            id: 'step-503',
            order: 3,
            action: 'Execute emergency shutdown if required',
            details: 'Immediately activate E-stop if unsafe condition detected',
            hazards: ['Audience safety breach', 'Equipment malfunction'],
            verification: 'Emergency response log'
          }
        ]
      }
    ],
    applicableOperations: ['indoor-audience-scanning', 'indoor-beam-only', 'outdoor-show', 'touring-production'],
    approvalRequired: true,
    reviewFrequency: 'Annual'
  },
  {
    id: 'sop-emergency',
    name: 'Emergency Response',
    category: 'emergency',
    description: 'Procedures for responding to laser-related emergencies',
    sections: [
      {
        id: 'immediate-response',
        title: 'Immediate Response',
        description: 'Actions in first minutes of emergency',
        responsibleParty: 'LSO / Designated Responder',
        references: ['Emergency action plan', 'First aid procedures'],
        steps: [
          {
            id: 'step-601',
            order: 1,
            action: 'Activate emergency stop',
            details: 'Immediately terminate all laser emissions',
            verification: 'Confirm all lasers off'
          },
          {
            id: 'step-602',
            order: 2,
            action: 'Assess situation and provide first aid',
            details: 'Evaluate injuries and provide appropriate first aid',
            ppe: ['Nitrile gloves', 'Face shield if splash hazard'],
            verification: 'First aid log entry'
          },
          {
            id: 'step-603',
            order: 3,
            action: 'Contact emergency services if needed',
            details: 'Call 911 for serious injuries; have laser specifications ready',
            verification: 'Emergency services notified'
          }
        ]
      },
      {
        id: 'eye-injury',
        title: 'Suspected Eye Injury Response',
        description: 'Specific procedures for laser eye exposure',
        responsibleParty: 'LSO',
        references: ['ANSI Z136.1 Appendix C', 'Amsler grid instructions'],
        steps: [
          {
            id: 'step-701',
            order: 1,
            action: 'Obtain laser exposure details',
            details: 'Record wavelength, power, exposure duration, and beam path',
            verification: 'Exposure documentation form'
          },
          {
            id: 'step-702',
            order: 2,
            action: 'Transport to eye specialist',
            details: 'Take exposed person to ophthalmologist WITHIN 24 HOURS',
            verification: 'Medical transport arranged'
          },
          {
            id: 'step-703',
            order: 3,
            action: 'Complete incident report',
            details: 'Document all details while fresh in memory',
            verification: 'Incident report filed'
          }
        ]
      }
    ],
    applicableOperations: ['indoor-audience-scanning', 'indoor-beam-only', 'outdoor-show', 'touring-production', 'permanent-installation'],
    approvalRequired: true,
    reviewFrequency: 'Annual'
  }
];

export const auditScenarios: AuditScenario[] = [
  {
    id: 'audit-indoor-scanning',
    name: 'Indoor Audience Scanning Audit',
    description: 'Comprehensive audit of indoor laser show with audience exposure',
    operationType: 'indoor-audience-scanning',
    venue: 'Concert Arena',
    passingScore: 85,
    timeLimit: 60,
    questions: [
      {
        id: 'AUD-001',
        category: 'Regulatory Compliance',
        question: 'Is the FDA variance for Class IIIb/IV entertainment use current and on-site?',
        regulation: '21 CFR 1040.11',
        evidenceRequired: ['Variance certificate', 'Approval letter'],
        complianceCriteria: 'Valid variance number visible on equipment and documentation available',
        severity: 'critical',
        points: 10
      },
      {
        id: 'AUD-002',
        category: 'Regulatory Compliance',
        question: 'Have all required notifications been sent to FDA and state authorities?',
        regulation: '21 CFR 1002.30',
        evidenceRequired: ['Notification records', 'Confirmation receipts'],
        complianceCriteria: '30-day advance notification documented',
        severity: 'critical',
        points: 10
      },
      {
        id: 'AUD-003',
        category: 'Personnel',
        question: 'Is a qualified Laser Safety Officer with executive authority designated and present?',
        regulation: 'ANSI Z136.1 Section 5.3',
        evidenceRequired: ['LSO designation letter', 'Qualifications'],
        complianceCriteria: 'LSO identified with clear authority to stop operations',
        severity: 'critical',
        points: 10
      },
      {
        id: 'AUD-004',
        category: 'Safety Systems',
        question: 'Is scan failure detection operational and tested?',
        regulation: '21 CFR 1040.11(f)(8)',
        evidenceRequired: ['Test log', 'System demonstration'],
        complianceCriteria: 'Auto-shutdown within milliseconds of fault',
        severity: 'critical',
        points: 10
      },
      {
        id: 'AUD-005',
        category: 'Safety Systems',
        question: 'Are separation distances maintained (3m vertical attended, 2.5m horizontal)?',
        regulation: '21 CFR 1040.11(f)(9)',
        evidenceRequired: ['Measurement records', 'Site survey'],
        complianceCriteria: 'Physical measurements confirm compliance',
        severity: 'major',
        points: 8
      },
      {
        id: 'AUD-006',
        category: 'Safety Systems',
        question: 'Is the emergency stop functional and accessible to the LSO?',
        regulation: 'ANSI Z136.1 Section 4.3.8',
        evidenceRequired: ['Test log', 'Physical verification'],
        complianceCriteria: 'Immediate shutdown upon activation',
        severity: 'critical',
        points: 10
      },
      {
        id: 'AUD-007',
        category: 'Documentation',
        question: 'Are MPE calculations and measurement records available?',
        regulation: 'ANSI Z136.1 Section 8.2',
        evidenceRequired: ['Calculation worksheets', 'Measurement data'],
        complianceCriteria: 'Documented MPE compliance for all exposure scenarios',
        severity: 'major',
        points: 8
      },
      {
        id: 'AUD-008',
        category: 'Documentation',
        question: 'Is a complete hand-over documentation package available?',
        regulation: 'ANSI E1.46 Section 4.4',
        evidenceRequired: ['Hand-over documents'],
        complianceCriteria: 'All required elements present per E1.46',
        severity: 'major',
        points: 6
      },
      {
        id: 'AUD-009',
        category: 'Training',
        question: 'Are operator training records current?',
        regulation: '21 CFR 1040.11 Condition D',
        evidenceRequired: ['Training certificates', 'Records'],
        complianceCriteria: 'Training documented and within validity period',
        severity: 'minor',
        points: 4
      },
      {
        id: 'AUD-010',
        category: 'Equipment',
        question: 'Are all required labels present and legible on laser equipment?',
        regulation: '21 CFR 1040.11(g)',
        evidenceRequired: ['Visual inspection'],
        complianceCriteria: 'Class label, aperture, certification labels visible',
        severity: 'major',
        points: 6
      }
    ]
  },
  {
    id: 'audit-outdoor',
    name: 'Outdoor Laser Display Audit',
    description: 'Audit of outdoor laser show compliance',
    operationType: 'outdoor-show',
    venue: 'Outdoor Festival Site',
    passingScore: 85,
    timeLimit: 60,
    questions: [
      {
        id: 'AUD-101',
        category: 'Aviation Compliance',
        question: 'Has FAA been notified 2-4 weeks in advance?',
        regulation: 'FAA Order 7400.2',
        evidenceRequired: ['FAA correspondence', 'Determination letter'],
        complianceCriteria: 'FAA notification confirmed with no objections',
        severity: 'critical',
        points: 10
      },
      {
        id: 'AUD-102',
        category: 'Aviation Compliance',
        question: 'Is airspace clear of Critical Flight Zones?',
        regulation: 'FAA Advisory Circular 70-1',
        evidenceRequired: ['Airspace analysis', 'Beam plot'],
        complianceCriteria: 'No beams entering restricted airspace',
        severity: 'critical',
        points: 10
      },
      {
        id: 'AUD-103',
        category: 'Public Safety',
        question: 'Are public access controls adequate?',
        regulation: 'ANSI E1.46 Section 5.4',
        evidenceRequired: ['Site plan', 'Barriers'],
        complianceCriteria: 'Unauthorized persons cannot access beam areas',
        severity: 'major',
        points: 8
      },
      {
        id: 'AUD-104',
        category: 'Weather',
        question: 'Are weather monitoring procedures established?',
        regulation: 'ANSI E1.46 Section 5.3',
        evidenceRequired: ['Weather monitoring log', 'Procedures'],
        complianceCriteria: 'Conditions monitored and documented',
        severity: 'minor',
        points: 4
      }
    ]
  }
];

export const documentationPackages: DocumentationPackage[] = [
  {
    id: 'pkg-basic',
    name: 'Basic Documentation Package',
    description: 'Minimum documentation for simple indoor beam effects',
    operationTypes: ['indoor-beam-only'],
    documents: [
      {
        id: 'doc-risk',
        name: 'Risk Assessment',
        description: 'Hazard identification and risk evaluation',
        required: true,
        retentionPeriod: 'Duration of installation + 3 years'
      },
      {
        id: 'doc-notification',
        name: 'FDA Notification Records',
        description: 'Documentation of FDA notification',
        required: true,
        retentionPeriod: '3 years'
      },
      {
        id: 'doc-checklist',
        name: 'Pre-Show Checklists',
        description: 'Completed safety checklists',
        required: true,
        retentionPeriod: '1 year'
      }
    ]
  },
  {
    id: 'pkg-full',
    name: 'Complete Entertainment Package',
    description: 'Full documentation for audience scanning shows',
    operationTypes: ['indoor-audience-scanning', 'outdoor-show', 'touring-production'],
    documents: [
      {
        id: 'doc-variance',
        name: 'FDA Variance Documentation',
        description: 'Approved variance and conditions',
        required: true,
        retentionPeriod: 'Duration of variance + 3 years'
      },
      {
        id: 'doc-mpe',
        name: 'MPE Calculations',
        description: 'Maximum Permissible Exposure calculations and measurements',
        required: true,
        retentionPeriod: 'Duration of show + 5 years'
      },
      {
        id: 'doc-handover',
        name: 'Hand-Over Documentation',
        description: 'Complete hand-over package per ANSI E1.46',
        required: true,
        retentionPeriod: 'Duration of installation + 3 years'
      },
      {
        id: 'doc-sop',
        name: 'Standard Operating Procedures',
        description: 'Written SOPs for all operations',
        required: true,
        retentionPeriod: 'Current + 3 previous versions'
      },
      {
        id: 'doc-training',
        name: 'Training Records',
        description: 'Operator and personnel training documentation',
        required: true,
        retentionPeriod: 'Duration of employment + 3 years'
      },
      {
        id: 'doc-emergency',
        name: 'Emergency Procedures',
        description: 'Written emergency response procedures',
        required: true,
        retentionPeriod: 'Current + 3 previous versions'
      },
      {
        id: 'doc-test',
        name: 'Safety Test Records',
        description: 'Scan failure, E-stop, and safety system tests',
        required: true,
        retentionPeriod: '1 year'
      },
      {
        id: 'doc-maintenance',
        name: 'Maintenance Logs',
        description: 'Equipment maintenance and alignment records',
        required: true,
        retentionPeriod: 'Life of equipment'
      }
    ]
  }
];

export const quizQuestions = [
  {
    id: 'q1',
    question: 'How far in advance must FDA be notified of a laser light show using Class IIIb or IV lasers?',
    options: ['1 week', '2 weeks', '30 days', '90 days'],
    correctAnswer: 2,
    explanation: 'FDA requires 30 days advance written notification for all Class IIIb and IV laser shows, per 21 CFR 1002.30.',
    difficulty: 'easy'
  },
  {
    id: 'q2',
    question: 'Which document must be completed and signed before each laser performance?',
    options: ['FDA variance application', 'Pre-show checklist', 'Annual report', 'Product report'],
    correctAnswer: 1,
    explanation: 'A pre-show checklist must be completed and signed before each performance to verify all safety systems are operational.',
    difficulty: 'easy'
  },
  {
    id: 'q3',
    question: 'What is the minimum retention period for MPE calculation records?',
    options: ['6 months', '1 year', '3 years', 'Duration of show + 5 years'],
    correctAnswer: 3,
    explanation: 'MPE calculation records should be retained for the duration of the show plus 5 years to support potential regulatory review.',
    difficulty: 'medium'
  }
];
