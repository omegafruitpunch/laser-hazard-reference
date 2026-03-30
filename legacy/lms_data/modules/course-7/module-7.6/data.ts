// Data and content for Module 7.6: Insurance & Liability

import {
  LiabilityScenario, InsuranceCoverage, RiskAssessment, ContractClause,
  IncidentReport, DocumentationRequirement, LiabilityAssessmentTool,
  QuizQuestion, ModulePhase
} from './types';

export const moduleInfo = {
  id: 'module-7.6',
  title: 'Insurance & Liability',
  courseId: 'course-7',
  courseName: 'Event Safety',
  description: 'Master event liability management with interactive assessment tools, contract analysis, and incident documentation training.',
  duration: 25,
  learningObjectives: [
    'Understand event organizer liability obligations and risk exposures',
    'Identify appropriate insurance coverage types and limits',
    'Apply risk assessment and mitigation strategies',
    'Analyze contract clauses for liability implications',
    'Document incidents for legal protection',
    'Use liability assessment tools to evaluate event risk'
  ],
  prerequisites: ['module-7.5'],
  nextModule: null,
};

export const phases: ModulePhase[] = [
  { id: 'warmup', title: 'Liability Fundamentals', duration: 3, type: 'warmup' },
  { id: 'core', title: 'Insurance & Risk Management', duration: 8, type: 'core' },
  { id: 'practice', title: 'Liability Assessment Tool', duration: 10, type: 'practice' },
  { id: 'challenge', title: 'Contract & Documentation Challenge', duration: 4, type: 'challenge' },
];

// Insurance Coverage Types
export const insuranceCoverages: InsuranceCoverage[] = [
  {
    type: 'General Liability',
    description: 'Primary coverage for bodily injury and property damage to third parties',
    typicalLimits: '$1M per occurrence / $2M aggregate',
    coveredEvents: [
      'Audience member injuries',
      'Property damage to venue',
      'Vendor/contractor injuries (if primary)',
      'Products/completed operations'
    ],
    exclusions: [
      'Professional errors and omissions',
      'Employee injuries (covered by Workers Comp)',
      'Intentional acts',
      'Automobile liability'
    ],
    premiumFactors: [
      'Event type and crowd size',
      'History of claims',
      'Safety protocols in place',
      'Venue location and characteristics'
    ],
    importance: 'essential'
  },
  {
    type: 'Event Cancellation',
    description: 'Covers financial losses if event is cancelled due to covered perils',
    typicalLimits: 'Event budget amount',
    coveredEvents: [
      'Severe weather (hurricane, tornado)',
      'Artist non-appearance',
      'Venue unavailability',
      'Communicable disease (if endorsed)'
    ],
    exclusions: [
      'Lack of ticket sales',
      'Poor planning',
      'Foreseeable circumstances',
      'War or terrorism (unless endorsed)'
    ],
    premiumFactors: [
      'Event budget size',
      'Weather season/location',
      'Artist reliability',
      'Lead time to event'
    ],
    importance: 'recommended'
  },
  {
    type: 'Workers Compensation',
    description: 'Covers employee injuries and occupational illnesses',
    typicalLimits: 'Statutory limits by state',
    coveredEvents: [
      'Employee work-related injuries',
      'Occupational diseases',
      'Rehabilitation costs',
      'Lost wages'
    ],
    exclusions: [
      'Independent contractors (must have own coverage)',
      'Injuries outside scope of employment',
      'Intentional self-harm'
    ],
    premiumFactors: [
      'Payroll amount',
      'Job classification codes',
      'Experience modification rate (EMR)',
      'Safety program effectiveness'
    ],
    importance: 'essential'
  },
  {
    type: 'Professional Liability (E&O)',
    description: 'Covers professional errors, negligence, and failure to perform',
    typicalLimits: '$1M per occurrence / $2M aggregate',
    coveredEvents: [
      'Professional negligence claims',
      'Errors in services provided',
      'Failure to deliver contracted services',
      'Defense costs for frivolous claims'
    ],
    exclusions: [
      'Bodily injury (covered by General Liability)',
      'Property damage (covered by General Liability)',
      'Dishonest acts',
      'Known circumstances prior to policy'
    ],
    premiumFactors: [
      'Professional experience',
      'Scope of services',
      'Claim history',
      'Contractual risk assumed'
    ],
    importance: 'recommended'
  },
  {
    type: 'Commercial Auto',
    description: 'Covers vehicles used for business purposes',
    typicalLimits: '$1M combined single limit',
    coveredEvents: [
      'Accidents in company vehicles',
      'Hired/non-owned auto liability',
      'Equipment transport incidents',
      'Employee driving on company business'
    ],
    exclusions: [
      'Personal use of company vehicles',
      'Unlisted drivers',
      'Racing or illegal activities',
      'Intentional acts'
    ],
    premiumFactors: [
      'Vehicle types and values',
      'Driver records',
      'Annual mileage',
      'Cargo/equipment value'
    ],
    importance: 'essential'
  },
  {
    type: 'Equipment/Floater',
    description: 'Covers owned and rented equipment on and off premises',
    typicalLimits: 'Total equipment value + 20%',
    coveredEvents: [
      'Theft of equipment',
      'Damage during transport',
      'Damage during use',
      'Mysterious disappearance (if endorsed)'
    ],
    exclusions: [
      'Wear and tear',
      'Mechanical breakdown',
      'Unattended equipment in vehicles',
      'War or nuclear hazard'
    ],
    premiumFactors: [
      'Total equipment value',
      'Security measures',
      'Transportation frequency',
      'Geographic scope'
    ],
    importance: 'recommended'
  },
  {
    type: 'Excess/Umbrella',
    description: 'Provides additional liability limits above primary policies',
    typicalLimits: '$1M to $25M',
    coveredEvents: [
      'Catastrophic claims exceeding primary limits',
      'Aggregate limit exhaustion',
      'Multiple claims in same policy period'
    ],
    exclusions: [
      'Claims not covered by underlying',
      'Professional liability (unless specifically included)',
      'Employment practices (unless endorsed)'
    ],
    premiumFactors: [
      'Underlying coverage limits',
      'Umbrella limit requested',
      'Nature of operations',
      'Claims history'
    ],
    importance: 'recommended'
  },
  {
    type: 'Cyber Liability',
    description: 'Covers data breaches and cyber incidents',
    typicalLimits: '$1M to $5M',
    coveredEvents: [
      'Data breach response costs',
      'Customer notification',
      'Credit monitoring',
      'Cyber extortion',
      'Business interruption from cyber events'
    ],
    exclusions: [
      'Prior known breaches',
      'Failure to maintain security standards',
      'Intentional acts by insured',
      'Property damage (physical)'
    ],
    premiumFactors: [
      'Data volume and sensitivity',
      'Security measures in place',
      'Industry sector',
      'Response plan quality'
    ],
    importance: 'optional'
  }
];

// Risk Assessment Framework
export const riskAssessments: RiskAssessment[] = [
  {
    id: 'crowd-safety',
    category: 'Crowd Safety',
    risk: 'Crowd crush or stampede',
    probability: 'medium',
    severity: 'catastrophic',
    mitigationStrategies: [
      'Implement crowd density monitoring',
      'Establish clear egress paths',
      'Deploy trained crowd managers',
      'Use barriers appropriately (not creating choke points)',
      'Coordinate with local law enforcement'
    ],
    transferOptions: [
      'General liability insurance',
      'Contractual indemnification from security vendor',
      'Hold harmless agreements with venue'
    ],
    residualRisk: 'Medium - despite controls, crowd dynamics can be unpredictable'
  },
  {
    id: 'weather',
    category: 'Weather',
    risk: 'Severe weather causing injury or evacuation',
    probability: 'medium',
    severity: 'serious',
    mitigationStrategies: [
      'Implement weather monitoring protocols',
      'Establish clear evacuation procedures',
      'Designate weather decision-maker',
      'Have shelter locations identified',
      'Obtain weather insurance for outdoor events'
    ],
    transferOptions: [
      'Event cancellation insurance',
      'Weather endorsement on general liability',
      'Force majeure contract provisions'
    ],
    residualRisk: 'Low-Medium - with proper monitoring and protocols'
  },
  {
    id: 'stage-structure',
    category: 'Structural',
    risk: 'Stage or structure collapse',
    probability: 'low',
    severity: 'catastrophic',
    mitigationStrategies: [
      'Use certified structural engineers for design',
      'Require load calculations and stamped drawings',
      'Conduct pre-event inspections',
      'Monitor wind and weather conditions',
      'Use reputable, experienced vendors'
    ],
    transferOptions: [
      'General liability insurance',
      'Vendor certificates of insurance',
      'Contractual indemnification from structure vendor',
      'Additional insured status on vendor policies'
    ],
    residualRisk: 'Low - with proper engineering and qualified vendors'
  },
  {
    id: 'laser-exposure',
    category: 'Laser Safety',
    risk: 'Audience or worker laser eye injury',
    probability: 'low',
    severity: 'serious',
    mitigationStrategies: [
      'Employ qualified Laser Safety Officer',
      'Conduct hazard calculations (NOHD)',
      'Use appropriate beam controls',
      'Implement safety zones',
      'FDA variance compliance'
    ],
    transferOptions: [
      'General liability insurance',
      'Professional liability for LSO',
      'Vendor COI with laser operations coverage'
    ],
    residualRisk: 'Low - with proper LSO and safety protocols'
  },
  {
    id: 'property-damage',
    category: 'Property',
    risk: 'Damage to venue or rented equipment',
    probability: 'medium',
    severity: 'moderate',
    mitigationStrategies: [
      'Pre-event site inspection with venue',
      'Document existing conditions',
      'Train crew on proper equipment handling',
      'Use protective materials where needed',
      'Supervise load-in/load-out'
    ],
    transferOptions: [
      'General liability property damage coverage',
      'Equipment floater for rented items',
      'Damage waiver agreements'
    ],
    residualRisk: 'Low - with proper handling and documentation'
  },
  {
    id: 'contractor-injury',
    category: 'Workers',
    risk: 'Contractor or crew member injury',
    probability: 'medium',
    severity: 'serious',
    mitigationStrategies: [
      'Verify contractor insurance (COI)',
      'Conduct safety briefings',
      'Enforce PPE requirements',
      'Document safety training',
      'Implement fall protection for work at height'
    ],
    transferOptions: [
      'Workers compensation (for employees)',
      'Require contractor WC coverage',
      'Contractual indemnification clauses',
      'Additional insured status'
    ],
    residualRisk: 'Low-Medium - injuries may still occur despite precautions'
  }
];

// Contract Clauses
export const contractClauses: ContractClause[] = [
  {
    id: 'indemnification',
    clauseType: 'Indemnification',
    title: 'Hold Harmless and Indemnification',
    purpose: 'Allocates responsibility for claims arising from each party\'s actions',
    standardLanguage: 'Each party shall indemnify, defend, and hold harmless the other party from and against any and all claims, damages, losses, and expenses (including reasonable attorney\'s fees) arising out of or resulting from the indemnifying party\'s negligence or willful misconduct.',
    redFlags: [
      'One-way indemnification (only you indemnify them)',
      'Indemnification for their negligence',
      'No limitation on indemnification scope',
      'Indemnification for claims beyond your control'
    ],
    negotiablePoints: [
      'Mutual vs. one-way indemnification',
      'Limitation to acts of negligence',
      'Cap on indemnification amount',
      'Exclusion for concurrent negligence'
    ]
  },
  {
    id: 'insurance',
    clauseType: 'Insurance Requirements',
    title: 'Certificates of Insurance',
    purpose: 'Ensures adequate insurance coverage is maintained by all parties',
    standardLanguage: 'Each party shall maintain appropriate insurance coverage including General Liability ($1M per occurrence), Workers Compensation (statutory limits), and Automobile Liability ($1M). Certificates of Insurance shall be provided 30 days prior to event.',
    redFlags: [
      'Unreasonably high limits for event size',
      'Requirements for coverage types not applicable',
      'Failure to specify additional insured status',
      'No provision for subrogation waiver'
    ],
    negotiablePoints: [
      'Appropriate limits for event scope',
      'Alternative risk financing arrangements',
      'Timing of COI delivery',
      'Ongoing vs. event-specific coverage'
    ]
  },
  {
    id: 'force-majeure',
    clauseType: 'Force Majeure',
    title: 'Force Majeure / Acts of God',
    purpose: 'Excuses performance for unforeseeable circumstances beyond control',
    standardLanguage: 'Neither party shall be liable for failure to perform due to causes beyond their reasonable control, including but not limited to: acts of God, war, terrorism, government action, natural disasters, pandemic, or other unforeseeable circumstances.',
    redFlags: [
      'Overly broad definition of force majeure',
      'No provision for rescheduling vs. cancellation',
      'Unequal application (only benefits one party)',
      'Failure to address financial consequences'
    ],
    negotiablePoints: [
      'Specific enumerated events',
      'Notice requirements',
      'Mitigation obligations',
      'Refund/rollover provisions'
    ]
  },
  {
    id: 'limitation-liability',
    clauseType: 'Limitation of Liability',
    title: 'Limitation and Exclusion of Liability',
    purpose: 'Caps potential damages and excludes certain types of damages',
    standardLanguage: 'Neither party shall be liable for indirect, incidental, consequential, or punitive damages. Each party\'s total liability shall not exceed the total amount paid or payable under this agreement.',
    redFlags: [
      'Liability cap below contract value',
      'Exclusion of direct damages',
      'No exception for gross negligence or willful misconduct',
      'Cap applies to both parties unequally'
    ],
    negotiablePoints: [
      'Mutual vs. one-sided caps',
      'Exceptions for gross negligence',
      'Carve-outs for IP infringement',
      'Different caps for different types of claims'
    ]
  }
];

// Liability Scenarios
export const liabilityScenarios: LiabilityScenario[] = [
  {
    id: 'scenario-1',
    title: 'Stage Collapse Injury',
    description: 'A temporary stage structure collapses during setup, injuring several workers',
    incidentType: 'Structural Failure',
    parties: [
      {
        name: 'Event Organizer (Your Company)',
        role: 'Event promoter and coordinator',
        potentialLiability: 'medium',
        insuranceTypes: ['General Liability', 'Excess/Umbrella'],
        actions: ['Hired stage vendor', 'Coordinated setup schedule', 'Had safety coordinator on site']
      },
      {
        name: 'Stage Rental Company',
        role: 'Provided and erected stage structure',
        potentialLiability: 'high',
        insuranceTypes: ['General Liability', 'Workers Compensation', 'Equipment'],
        actions: ['Installed structure', 'Provided crew', 'Engineering certification']
      },
      {
        name: 'Venue',
        role: 'Property owner',
        potentialLiability: 'low',
        insuranceTypes: ['Property', 'General Liability'],
        actions: ['Provided site', 'Had no role in stage construction']
      },
      {
        name: 'Injured Workers',
        role: 'Stage company employees',
        potentialLiability: 'none',
        insuranceTypes: ['Workers Compensation (through employer)'],
        actions: ['Working on structure installation']
      }
    ],
    facts: [
      'Wind gusts were 25 MPH at time of collapse',
      'Stage was not fully secured when collapse occurred',
      'Three workers injured, one seriously',
      'Stage company had provided engineering drawings',
      'Event organizer had COI from stage company on file'
    ],
    evidence: [
      { type: 'Weather Data', description: 'Wind readings showing 25 MPH gusts', relevance: 'May show weather was factor', admissibility: 'high' },
      { type: 'Engineering Drawings', description: 'Stage company stamped drawings', relevance: 'Shows design specifications', admissibility: 'high' },
      { type: 'Witness Statements', description: 'Crew members describe sequence', relevance: 'Establish facts of incident', admissibility: 'high' },
      { type: 'Safety Plan', description: 'Documented safety protocols', relevance: 'Shows due diligence', admissibility: 'high' },
      { type: 'COI', description: 'Certificate of Insurance from vendor', relevance: 'Shows vendor had coverage', admissibility: 'high' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'Which party likely has PRIMARY liability for the workers\' injuries?',
        options: [
          { id: 'a', label: 'Event Organizer', isCorrect: false, explanation: 'While the organizer hired the vendor, the stage company\'s workers are their employees.' },
          { id: 'b', label: 'Stage Rental Company', isCorrect: true, explanation: 'The stage company employed the workers and was responsible for safe installation.' },
          { id: 'c', label: 'Venue', isCorrect: false, explanation: 'Venue had no role in stage construction or supervision.' },
          { id: 'd', label: 'All parties equally', isCorrect: false, explanation: 'Liability is apportioned based on degree of fault.' }
        ],
        correctRationale: 'The stage company employed the workers and was responsible for proper installation.',
        legalBasis: 'Employers are generally responsible for worker safety under OSHA and workers compensation law.'
      },
      {
        id: 'q2',
        question: 'What insurance would primarily cover the injured workers\' medical expenses?',
        options: [
          { id: 'a', label: 'Event Organizer General Liability', isCorrect: false, explanation: 'GL typically excludes employee injuries.' },
          { id: 'b', label: 'Stage Company Workers Compensation', isCorrect: true, explanation: 'Workers comp is the exclusive remedy for employee injuries.' },
          { id: 'c', label: 'Venue Property Insurance', isCorrect: false, explanation: 'Property insurance covers property damage, not injuries.' },
          { id: 'd', label: 'Event Cancellation Insurance', isCorrect: false, explanation: 'Cancellation insurance covers financial loss, not injuries.' }
        ],
        correctRationale: 'Workers Compensation is the exclusive remedy for work-related employee injuries.',
        legalBasis: 'Workers compensation statutes provide sole remedy for employee injuries, preventing direct suits against employers.'
      }
    ]
  },
  {
    id: 'scenario-2',
    title: 'Laser Eye Injury Claim',
    description: 'An audience member claims laser eye injury during a performance',
    incidentType: 'Audience Injury',
    parties: [
      {
        name: 'Event Organizer',
        role: 'Event promoter',
        potentialLiability: 'high',
        insuranceTypes: ['General Liability', 'Professional Liability'],
        actions: ['Hired laser vendor', 'Approved show design', 'Provided venue']
      },
      {
        name: 'Laser Show Vendor',
        role: 'Designed and operated laser show',
        potentialLiability: 'high',
        insuranceTypes: ['General Liability', 'Professional Liability'],
        actions: ['Created show programming', 'Operated equipment', 'Had LSO on site']
      },
      {
        name: 'Venue',
        role: 'Facility operator',
        potentialLiability: 'medium',
        insuranceTypes: ['General Liability'],
        actions: ['Approved laser use', 'Controlled venue access']
      },
      {
        name: 'Audience Member',
        role: 'Claimant',
        potentialLiability: 'none',
        insuranceTypes: ['Health Insurance'],
        actions: ['Attended event', 'Claims eye injury from laser exposure']
      }
    ],
    facts: [
      'Audience member claims vision changes after show',
      'Medical exam shows retinal injury consistent with laser exposure',
      'Laser vendor had FDA variance for audience scanning',
      'LSO was present and monitoring during show',
      'Show was conducted per approved plan'
    ],
    evidence: [
      { type: 'Medical Records', description: 'Ophthalmologist report confirming retinal injury', relevance: 'Establishes damages', admissibility: 'high' },
      { type: 'FDA Variance', description: 'FDA approval for audience scanning', relevance: 'Shows compliance effort', admissibility: 'high' },
      { type: 'Show Plans', description: 'Approved laser show documentation', relevance: 'Shows planned operations', admissibility: 'high' },
      { type: 'LSO Logs', description: 'Laser Safety Officer monitoring records', relevance: 'Shows safety measures', admissibility: 'high' },
      { type: 'Witness Statements', description: 'Other audience members', relevance: 'May corroborate or dispute claim', admissibility: 'medium' }
    ],
    questions: [
      {
        id: 'q1',
        question: 'What is the strongest defense against this claim?',
        options: [
          { id: 'a', label: 'The audience member assumed risk by attending', isCorrect: false, explanation: 'Assumption of risk is generally not a complete defense for negligence.' },
          { id: 'b', label: 'FDA variance and compliance with show plan', isCorrect: true, explanation: 'Compliance with regulatory requirements and approved plans shows due diligence.' },
          { id: 'c', label: 'The injury is not serious', isCorrect: false, explanation: 'Severity of injury affects damages, not liability.' },
          { id: 'd', label: 'The venue is responsible, not the organizer', isCorrect: false, explanation: 'Organizer typically retains responsibility for show operations.' }
        ],
        correctRationale: 'Compliance with FDA requirements and approved show plans demonstrates due care.',
        legalBasis: 'Evidence of compliance with industry standards and regulations is strong evidence of due care.'
      }
    ]
  }
];

// Documentation Requirements
export const documentationRequirements: DocumentationRequirement[] = [
  {
    document: 'Event Safety Plan',
    purpose: 'Comprehensive safety protocols and procedures',
    retentionPeriod: '3 years post-event',
    accessibility: 'Safety team, venue, emergency services',
    legalSignificance: 'Demonstrates duty of care and safety planning'
  },
  {
    document: 'Insurance Certificates (COIs)',
    purpose: 'Proof of insurance coverage for all vendors',
    retentionPeriod: '3 years post-event',
    accessibility: 'Event organizer, venue',
    legalSignificance: 'Shows vendor compliance and transfer of risk'
  },
  {
    document: 'Contracts with Vendors',
    purpose: 'Legal agreements including indemnification',
    retentionPeriod: '7 years post-event',
    accessibility: 'Legal counsel, event organizer',
    legalSignificance: 'Establishes contractual obligations and liability allocation'
  },
  {
    document: 'Incident Reports',
    purpose: 'Documentation of any safety incidents',
    retentionPeriod: '7 years post-event (permanent if litigation)',
    accessibility: 'Safety team, legal counsel',
    legalSignificance: ' contemporaneous record of incidents and response'
  },
  {
    document: 'Training Records',
    purpose: 'Documentation of safety training provided',
    retentionPeriod: 'Duration of employment + 3 years',
    accessibility: 'HR, Safety team',
    legalSignificance: 'Shows compliance with training requirements'
  },
  {
    document: 'Weather Monitoring Logs',
    purpose: 'Record of weather conditions and decisions',
    retentionPeriod: '3 years post-event',
    accessibility: 'Safety team, weather officer',
    legalSignificance: 'Documents basis for weather-related decisions'
  },
  {
    document: 'Permits and Approvals',
    purpose: 'Governmental authorizations for event',
    retentionPeriod: '3 years post-event',
    accessibility: 'Event organizer, venue',
    legalSignificance: 'Shows compliance with regulatory requirements'
  }
];

// Incident Report Template
export const incidentReportTemplate: IncidentReport = {
  id: 'standard-incident-report',
  title: 'Event Incident Report',
  description: 'Standard form for documenting incidents during events',
  sections: [
    {
      name: 'Incident Information',
      required: true,
      fields: [
        { name: 'incidentDate', type: 'datetime', required: true, guidance: 'Date and time incident occurred' },
        { name: 'reportDate', type: 'datetime', required: true, guidance: 'Date and time report completed' },
        { name: 'reporterName', type: 'text', required: true, guidance: 'Name of person completing report' },
        { name: 'incidentType', type: 'select', required: true, guidance: 'Select primary category' },
        { name: 'location', type: 'text', required: true, guidance: 'Specific location within venue' },
        { name: 'severity', type: 'select', required: true, guidance: 'Impact level of incident' }
      ]
    },
    {
      name: 'Persons Involved',
      required: true,
      fields: [
        { name: 'injuredParty', type: 'text', required: false, guidance: 'Name of injured person if applicable' },
        { name: 'contactInfo', type: 'text', required: false, guidance: 'Phone/email of injured party' },
        { name: 'employeeInvolved', type: 'checkbox', required: false, guidance: 'Check if injured party was employee' },
        { name: 'vendorCompany', type: 'text', required: false, guidance: 'Vendor company if applicable' }
      ]
    },
    {
      name: 'Incident Description',
      required: true,
      fields: [
        { name: 'description', type: 'textarea', required: true, guidance: 'Detailed description of what happened' },
        { name: 'immediateActions', type: 'textarea', required: true, guidance: 'Actions taken immediately after incident' },
        { name: 'medicalAttention', type: 'select', required: true, guidance: 'Was medical attention provided?' }
      ]
    },
    {
      name: 'Witness Information',
      required: false,
      fields: [
        { name: 'witnessNames', type: 'textarea', required: false, guidance: 'Names of all witnesses' },
        { name: 'witnessContact', type: 'textarea', required: false, guidance: 'Contact information for witnesses' }
      ]
    },
    {
      name: 'Follow-Up',
      required: true,
      fields: [
        { name: 'rootCause', type: 'textarea', required: false, guidance: 'Contributing factors identified' },
        { name: 'correctiveActions', type: 'textarea', required: false, guidance: 'Steps to prevent recurrence' },
        { name: 'photos', type: 'file', required: false, guidance: 'Attach any relevant photos' }
      ]
    }
  ],
  timeline: [],
  attachments: [
    { type: 'Photographs', description: 'Scene photos showing conditions', format: 'JPEG/PNG', retentionPeriod: '7 years' },
    { type: 'Video', description: 'Surveillance or witness video', format: 'MP4/MOV', retentionPeriod: '7 years' },
    { type: 'Medical Records', description: 'If injury involved', format: 'PDF', retentionPeriod: 'Permanent' },
    { type: 'Witness Statements', description: 'Written statements', format: 'PDF', retentionPeriod: '7 years' }
  ]
};

// Liability Assessment Tool
export const liabilityAssessmentTool: LiabilityAssessmentTool = {
  id: 'event-risk-assessment',
  name: 'Event Liability Risk Assessment',
  description: 'Evaluate overall liability exposure for an event based on multiple risk factors',
  factors: [
    {
      factor: 'Event Type',
      weight: 15,
      criteria: ['General admission concert', 'Seated theater', 'Festival with camping', 'Corporate event', 'Private function']
    },
    {
      factor: 'Attendance',
      weight: 15,
      criteria: ['Under 500', '500-2,000', '2,000-10,000', '10,000-50,000', 'Over 50,000']
    },
    {
      factor: 'Venue Type',
      weight: 10,
      criteria: ['Fixed theater', 'Outdoor with permanent structures', 'Temporary outdoor', 'Non-traditional venue']
    },
    {
      factor: 'Activities',
      weight: 15,
      criteria: ['Passive viewing only', 'Seated dining', 'General admission standing', 'Interactive/physical activities', 'High-risk activities (pyro, stunts)']
    },
    {
      factor: 'Alcohol Service',
      weight: 10,
      criteria: ['No alcohol', 'Beer/wine only', 'Full bar service', 'All-inclusive/free alcohol']
    },
    {
      factor: 'Attendee Demographics',
      weight: 10,
      criteria: ['Adults only', 'Family-friendly', 'Youth event', 'Mixed with accessibility needs']
    },
    {
      factor: 'Weather Exposure',
      weight: 15,
      criteria: ['Fully indoor', 'Covered outdoor', 'Open outdoor - mild climate', 'Open outdoor - severe weather season']
    },
    {
      factor: 'Historical Claims',
      weight: 10,
      criteria: ['No history', 'Minor incidents', 'Moderate claims history', 'Significant claims history']
    }
  ],
  scoringMatrix: [
    {
      range: '0-30',
      riskLevel: 'Low',
      recommendation: 'Standard insurance coverage sufficient',
      actions: ['Maintain standard GL coverage', 'Document safety procedures']
    },
    {
      range: '31-50',
      riskLevel: 'Moderate',
      recommendation: 'Enhanced safety measures and standard coverage',
      actions: ['Increase safety staffing', 'Review vendor COIs', 'Consider excess coverage']
    },
    {
      range: '51-70',
      riskLevel: 'Elevated',
      recommendation: 'Enhanced coverage and comprehensive risk management',
      actions: ['Obtain excess/umbrella coverage', 'Implement detailed safety plan', 'Require additional insured status', 'Pre-event safety meetings']
    },
    {
      range: '71-100',
      riskLevel: 'High',
      recommendation: 'Maximum coverage and expert risk management required',
      actions: ['High-limit excess coverage', 'Professional risk assessment', 'Dedicated safety coordinator', 'Emergency response plan', 'Legal review of all contracts']
    }
  ]
};

// Mutual Aid Agreement Provisions
export const mutualAidProvisions = [
  {
    provision: 'Equipment Sharing',
    description: 'Neighboring agencies can borrow specialized equipment',
    liabilityImplication: 'Equipment becomes asset of borrowing agency',
    riskMitigation: 'Ensure borrowing agency has appropriate insurance coverage'
  },
  {
    provision: 'Personnel Assistance',
    description: 'Trained personnel can assist at incidents across jurisdiction',
    liabilityImplication: 'Personnel operate under direction of host agency',
    riskMitigation: 'Document chain of command and operating authority'
  },
  {
    provision: 'Cost Reimbursement',
    description: 'Borrowing agency responsible for costs of borrowed resources',
    liabilityImplication: 'Financial responsibility transfers with resource',
    riskMitigation: 'Clear agreements on cost allocation and documentation'
  },
  {
    provision: 'Insurance Coverage',
    description: 'Borrowed resources covered by borrowing agency\'s insurance',
    liabilityImplication: 'Home agency\'s insurance does not cover during loan',
    riskMitigation: 'Verify COI from borrowing agency before releasing equipment'
  }
];

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which type of insurance would cover a claim for professional negligence in laser safety planning?',
    options: [
      'General Liability',
      'Workers Compensation',
      'Professional Liability (E&O)',
      'Commercial Auto'
    ],
    correctAnswer: 2,
    explanation: 'Professional Liability (Errors & Omissions) insurance specifically covers claims arising from professional services and negligence.',
    difficulty: 'easy',
    category: 'insurance'
  },
  {
    id: 'q2',
    question: 'What is the minimum recommended General Liability coverage for professional event operations?',
    options: [
      '$500,000 per occurrence',
      '$1M per occurrence / $2M aggregate',
      '$5M per occurrence',
      '$10M per occurrence'
    ],
    correctAnswer: 1,
    explanation: 'Industry standard minimum is $1M per occurrence with a $2M aggregate, though higher limits may be required for larger events.',
    difficulty: 'easy',
    category: 'insurance'
  },
  {
    id: 'q3',
    question: 'In a mutual aid agreement, who is responsible for equipment borrowed from a neighboring agency?',
    options: [
      'The home agency always retains responsibility',
      'The borrowing agency assumes responsibility',
      'Both agencies share responsibility equally',
      'The state emergency management agency'
    ],
    correctAnswer: 1,
    explanation: 'Under mutual aid agreements, borrowed equipment becomes an asset of the borrowing agency and is covered by their insurance.',
    difficulty: 'medium',
    category: 'insurance'
  },
  {
    id: 'q4',
    question: 'Which contract clause is MOST important for transferring risk to vendors?',
    options: [
      'Force Majeure',
      'Indemnification',
      'Governing Law',
      'Payment Terms'
    ],
    correctAnswer: 1,
    explanation: 'Indemnification clauses allocate responsibility for claims between parties and are the primary mechanism for risk transfer.',
    difficulty: 'medium',
    category: 'contracts'
  },
  {
    id: 'q5',
    question: 'How long should incident reports typically be retained?',
    options: [
      '1 year',
      '3 years',
      '7 years (or permanently if litigation)',
      '30 days'
    ],
    correctAnswer: 2,
    explanation: 'Incident reports should be retained for 7 years, or permanently if there is actual or anticipated litigation.',
    difficulty: 'medium',
    category: 'documentation'
  },
  {
    id: 'q6',
    question: 'A vendor\'s employee is injured while working at your event. Whose workers compensation insurance should primarily cover this?',
    options: [
      'Your company\'s workers compensation',
      'The vendor\'s workers compensation',
      'Your general liability insurance',
      'The venue\'s insurance'
    ],
    correctAnswer: 1,
    explanation: 'A vendor\'s employees are covered by their employer\'s workers compensation insurance. This is why verifying vendor COIs is essential.',
    difficulty: 'medium',
    category: 'liability'
  },
  {
    id: 'q7',
    question: 'What is a "red flag" in an indemnification clause?',
    options: [
      'Mutual indemnification',
      'Indemnification limited to negligent acts',
      'One-way indemnification where you indemnify them for their negligence',
      'Cap on indemnification amount'
    ],
    correctAnswer: 2,
    explanation: 'One-way indemnification requiring you to cover the other party\'s negligence is a significant red flag and should be negotiated.',
    difficulty: 'hard',
    category: 'contracts'
  },
  {
    id: 'q8',
    question: 'Event cancellation insurance typically does NOT cover:',
    options: [
      'Severe weather preventing the event',
      'Artist illness preventing performance',
      'Poor ticket sales leading to cancellation',
      'Venue becoming unavailable due to fire'
    ],
    correctAnswer: 2,
    explanation: 'Event cancellation insurance covers unforeseen circumstances, not business decisions like poor ticket sales.',
    difficulty: 'easy',
    category: 'insurance'
  }
];

// Documentation Challenge
export const documentationChallenge = {
  id: 'incident-documentation',
  title: 'Incident Documentation Challenge',
  description: 'A worker has fallen from a stage platform and sustained injuries. Properly document this incident.',
  scenario: 'During load-in, a rigger falls from a 12-foot platform while installing lighting fixtures. They are conscious but complaining of back pain and difficulty moving their legs. EMS has been called.',
  tasks: [
    {
      id: 't1',
      question: 'What information should be recorded FIRST?',
      options: [
        { id: 'a', label: 'Your opinion on who was at fault', correct: false },
        { id: 'b', label: 'Date, time, location, and persons involved', correct: true },
        { id: 'c', label: 'Potential insurance implications', correct: false },
        { id: 'd', label: 'Disciplinary actions to take', correct: false }
      ]
    },
    {
      id: 't2',
      question: 'Which of the following should be included in the incident description? (Select all that apply)',
      options: [
        { id: 'a', label: 'Weather conditions at time of incident', correct: true },
        { id: 'b', label: 'Specific location within venue', correct: true },
        { id: 'c', label: 'Names of witnesses', correct: true },
        { id: 'd', label: 'Your personal opinions about the injured worker', correct: false },
        { id: 'e', label: 'Sequence of events leading to fall', correct: true }
      ]
    },
    {
      id: 't3',
      question: 'How long should this incident report be retained?',
      options: [
        { id: 'a', label: '1 year', correct: false },
        { id: 'b', label: '3 years', correct: false },
        { id: 'c', label: '7 years minimum; permanently if litigation', correct: true },
        { id: 'd', label: '30 days', correct: false }
      ]
    }
  ],
  feedback: {
    success: 'Excellent documentation understanding! You know what information is essential and how long to retain it.',
    partial: 'Some correct answers. Remember to focus on factual information and retain records longer than you might expect.',
    retry: 'Review documentation best practices. Facts only, no opinions, and retain for potential litigation timelines.'
  }
};

export const liabilityCalculator = {
  id: 'liability-calc',
  title: 'Liability Exposure Calculator',
  description: 'Calculate recommended insurance limits based on event characteristics.',
  factors: {
    attendance: [
      { range: '0-500', baseLimit: 1000000, multiplier: 1 },
      { range: '501-2000', baseLimit: 1000000, multiplier: 1.5 },
      { range: '2001-10000', baseLimit: 2000000, multiplier: 1 },
      { range: '10001-50000', baseLimit: 3000000, multiplier: 1 },
      { range: '50000+', baseLimit: 5000000, multiplier: 1 }
    ],
    activities: [
      { type: 'Seated theater', factor: 0.8 },
      { type: 'General admission', factor: 1 },
      { type: 'Festival', factor: 1.3 },
      { type: 'High-risk activities', factor: 1.5 }
    ],
    venue: [
      { type: 'Indoor fixed', factor: 0.9 },
      { type: 'Outdoor covered', factor: 1 },
      { type: 'Temporary outdoor', factor: 1.2 }
    ]
  }
};
