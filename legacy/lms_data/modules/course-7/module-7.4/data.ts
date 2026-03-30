// Data and content for Module 7.4: Emergency Response Procedures

import {
  EmergencyScenario, ICSRole, TriageCategory, CommunicationProtocol,
  IncidentDocument, QuizQuestion, ModulePhase, EmergencyContact
} from './types';

export const moduleInfo = {
  id: 'module-7.4',
  title: 'Emergency Response Procedures',
  courseId: 'course-7',
  courseName: 'Event Safety',
  description: 'Master emergency response through NIMS/ICS frameworks, major incident planning, and multi-agency coordination with scenario-based training.',
  duration: 25,
  learningObjectives: [
    'Understand NIMS principles and ICS organizational structure',
    'Apply incident command procedures in major event emergencies',
    'Coordinate effectively with emergency services and multiple agencies',
    'Execute proper evacuation and cordon procedures',
    'Document incidents according to professional standards',
    'Make critical decisions under time pressure in emergency scenarios'
  ],
  prerequisites: [],
  nextModule: 'module-7.5',
};

export const phases: ModulePhase[] = [
  { id: 'warmup', title: 'ICS Fundamentals', duration: 3, type: 'warmup' },
  { id: 'core', title: 'NIMS/ICS Deep Dive', duration: 8, type: 'core' },
  { id: 'practice', title: 'Emergency Simulator', duration: 10, type: 'practice' },
  { id: 'challenge', title: 'Major Incident Command', duration: 4, type: 'challenge' },
];

// Interactive ICS Role Explorer Data
export const icsRoles: ICSRole[] = [
  {
    id: 'incident-commander',
    title: 'Incident Commander',
    shortTitle: 'IC',
    section: 'command',
    description: 'Overall responsibility for incident management, strategy, and resource allocation.',
    responsibilities: [
      'Assess situation and establish incident objectives',
      'Approve Incident Action Plan',
      'Establish Command Post location',
      'Coordinate with agency officials',
      'Authorize resource requests',
      'Declare major incident and request mutual aid'
    ],
    authorityLevel: 'full',
    reportsTo: 'Agency Executive / Elected Official',
    keyDecisions: ['Evacuation vs. Shelter-in-Place', 'Resource Priority Allocation', 'Unified Command Structure', 'Public Information Release'],
    icon: 'crown'
  },
  {
    id: 'safety-officer',
    title: 'Safety Officer',
    shortTitle: 'SO',
    section: 'command',
    description: 'Monitors safety conditions and has authority to stop unsafe operations immediately.',
    responsibilities: [
      'Identify and mitigate hazardous situations',
      'Exercise emergency authority to stop unsafe acts',
      'Review Incident Action Plan for safety implications',
      'Conduct safety briefings',
      'Investigate accidents within incident',
      'Coordinate with agency safety programs'
    ],
    authorityLevel: 'significant',
    reportsTo: 'Incident Commander',
    keyDecisions: ['Suspension of Operations', 'Personal Protective Equipment Requirements', 'Safety Zone Establishment'],
    icon: 'shield'
  },
  {
    id: 'public-info-officer',
    title: 'Public Information Officer',
    shortTitle: 'PIO',
    section: 'command',
    description: 'Serves as conduit for information to media and public.',
    responsibilities: [
      'Develop accurate, accessible information',
      'Conduct media briefings',
      'Monitor and correct misinformation',
      'Coordinate with Joint Information Center',
      'Manage social media communications',
      'Prepare public safety announcements'
    ],
    authorityLevel: 'limited',
    reportsTo: 'Incident Commander',
    keyDecisions: ['Message Timing', 'Media Access', 'Information Release Approval'],
    icon: 'megaphone'
  },
  {
    id: 'liaison-officer',
    title: 'Liaison Officer',
    shortTitle: 'LNO',
    section: 'command',
    description: 'Point of contact for assisting and cooperating agencies.',
    responsibilities: [
      'Maintain contact with other agencies',
      'Facilitate coordination between organizations',
      'Respond to agency requests',
      'Attend coordination meetings',
      'Document inter-agency communications'
    ],
    authorityLevel: 'advisory',
    reportsTo: 'Incident Commander',
    keyDecisions: ['Agency Coordination Priority', 'Information Sharing Protocols'],
    icon: 'handshake'
  },
  {
    id: 'operations-chief',
    title: 'Operations Section Chief',
    shortTitle: 'OSC',
    section: 'operations',
    description: 'Directs all tactical operations to carry out the Incident Action Plan.',
    responsibilities: [
      'Manage tactical operations',
      'Direct resources toward incident objectives',
      'Coordinate operations across branches/divisions',
      'Request additional resources as needed',
      'Ensure operational safety',
      'Brief Incident Commander on operations status'
    ],
    authorityLevel: 'significant',
    reportsTo: 'Incident Commander',
    keyDecisions: ['Tactical Resource Deployment', 'Operational Priorities', 'Staging Area Location'],
    icon: 'tools'
  },
  {
    id: 'planning-chief',
    title: 'Planning Section Chief',
    shortTitle: 'PSC',
    section: 'planning',
    description: 'Collects, evaluates, and disseminates information and prepares the Incident Action Plan.',
    responsibilities: [
      'Collect and manage incident information',
      'Track resource status',
      'Prepare Incident Action Plan',
      'Conduct planning meetings',
      'Maintain documentation',
      'Develop incident forecasts'
    ],
    authorityLevel: 'limited',
    reportsTo: 'Incident Commander',
    keyDecisions: ['Information Collection Priority', 'Planning Meeting Schedule', 'Demobilization Planning'],
    icon: 'clipboard-list'
  },
  {
    id: 'logistics-chief',
    title: 'Logistics Section Chief',
    shortTitle: 'LSC',
    section: 'logistics',
    description: 'Provides resources and services to support incident operations.',
    responsibilities: [
      'Order and track resources',
      'Set up and manage facilities',
      'Provide communication support',
      'Coordinate transportation',
      'Manage supplies and equipment',
      'Arrange food and medical services'
    ],
    authorityLevel: 'significant',
    reportsTo: 'Incident Commander',
    keyDecisions: ['Resource Ordering Priority', 'Facility Location', 'Transportation Routes'],
    icon: 'truck'
  },
  {
    id: 'finance-chief',
    title: 'Finance/Admin Section Chief',
    shortTitle: 'FSC',
    section: 'finance',
    description: 'Monitors costs and provides accounting and procurement services.',
    responsibilities: [
      'Track all incident costs',
      'Process procurement requests',
      'Manage contracts',
      'Document compensation claims',
      'Ensure proper time recording',
      'Prepare cost recovery documentation'
    ],
    authorityLevel: 'limited',
    reportsTo: 'Incident Commander',
    keyDecisions: ['Cost Documentation Requirements', 'Contract Authorization', 'Resource Rental Agreements'],
    icon: 'dollar-sign'
  }
];

export const icsSections = [
  { id: 'command', name: 'Command', color: '#dc2626', description: 'Overall incident management and strategy' },
  { id: 'operations', name: 'Operations', color: '#16a34a', description: 'Tactical operations execution' },
  { id: 'planning', name: 'Planning', color: '#2563eb', description: 'Information management and incident action planning' },
  { id: 'logistics', name: 'Logistics', color: '#d97706', description: 'Resources, facilities, and services' },
  { id: 'finance', name: 'Finance/Admin', color: '#7c3aed', description: 'Cost tracking and administrative support' }
];

// Emergency Response Simulator Scenarios
export const emergencyScenarios: EmergencyScenario[] = [
  {
    id: 'scenario-1',
    title: 'Stage Structure Collapse',
    description: 'A severe weather event causes partial collapse of a stage structure during setup. Workers are injured and weather is deteriorating.',
    initialSituation: 'You are the Event Safety Coordinator for an outdoor music festival. Strong winds have caused part of the main stage roof structure to collapse during final setup. Two riggers are injured - one appears seriously hurt, another with minor injuries. Weather radar shows a severe storm approaching within 20 minutes. 50+ crew members are on site.',
    learningObjectives: [
      'Establish incident command quickly',
      'Prioritize life safety over property',
      'Coordinate medical response with on-site and external resources',
      'Manage evacuation with time pressure'
    ],
    phases: [
      {
        id: 'phase-1',
        title: 'Initial Assessment & Command',
        description: 'First 2 minutes - Establish command and assess',
        decisions: [
          {
            id: 'decision-1-1',
            situation: 'You arrive at the scene. The stage structure is partially collapsed with debris scattered. One worker is pinned under rigging, another is walking but dazed. Wind is increasing. What is your FIRST action?',
            options: [
              {
                id: 'opt-a',
                label: 'Immediately attempt to free the pinned worker',
                consequence: 'CRITICAL ERROR: Scene may not be secure. Additional collapse could injure more people including yourself. Always secure the scene first.',
                isCorrect: false,
                impact: 'critical'
              },
              {
                id: 'opt-b',
                label: 'Declare a major incident, establish command, and call for emergency services',
                consequence: 'CORRECT: Establishing command and securing professional help is the priority. This enables coordinated response.',
                isCorrect: true,
                nextPhaseId: 'phase-2',
                impact: 'positive'
              },
              {
                id: 'opt-c',
                label: 'Clear all personnel from the stage area and wait for instructions',
                consequence: 'PARTIAL: Evacuation is important but delay in declaring incident and establishing command slows professional response.',
                isCorrect: false,
                impact: 'neutral'
              },
              {
                id: 'opt-d',
                label: 'Continue the event setup in a different area',
                consequence: 'CRITICAL ERROR: Injured personnel need immediate attention. This response shows disregard for life safety.',
                isCorrect: false,
                impact: 'critical'
              }
            ],
            timeLimit: 60
          }
        ]
      },
      {
        id: 'phase-2',
        title: 'Medical Response Coordination',
        description: 'EMS is 10 minutes out. Weather deteriorating.',
        decisions: [
          {
            id: 'decision-2-1',
            situation: 'You have established command. EMS has been called (ETA 10 minutes). The pinned worker is conscious but in pain. The dazed worker is sitting down. Storm is now 15 minutes away. What is your next priority?',
            options: [
              {
                id: 'opt-a',
                label: 'Wait for EMS to handle all medical issues',
                consequence: 'INCORRECT: Time-critical injuries may worsen. First aid should begin while EMS is en route.',
                isCorrect: false,
                impact: 'negative'
              },
              {
                id: 'opt-b',
                label: 'Begin first aid on the pinned worker while designating others to prepare for storm',
                consequence: 'CORRECT: Parallel action - provide immediate medical care while preparing for the approaching storm.',
                isCorrect: true,
                nextPhaseId: 'phase-3',
                impact: 'positive'
              },
              {
                id: 'opt-c',
                label: 'Focus entirely on evacuating all personnel due to the storm',
                consequence: 'INCORRECT: The injured worker cannot be moved safely without proper equipment. Medical needs are immediate priority.',
                isCorrect: false,
                impact: 'negative'
              },
              {
                id: 'opt-d',
                label: 'Request mutual aid from neighboring fire department for technical rescue',
                consequence: 'PARTIAL: Mutual aid is appropriate but immediate first aid should not be delayed while waiting.',
                isCorrect: false,
                impact: 'neutral'
              }
            ],
            timeLimit: 45
          }
        ]
      },
      {
        id: 'phase-3',
        title: 'Evacuation Decision',
        description: 'EMS arriving, but storm imminent',
        decisions: [
          {
            id: 'decision-3-1',
            situation: 'EMS has arrived and is treating the pinned worker. However, the storm is now 5 minutes away with lightning detected. The entire crew of 50+ is still in the open. What do you order?',
            options: [
              {
                id: 'opt-a',
                label: 'Order immediate evacuation to designated storm shelters',
                consequence: 'CORRECT: Lightning poses immediate threat to all personnel. Life safety requires immediate evacuation to shelter.',
                isCorrect: true,
                impact: 'positive'
              },
              {
                id: 'opt-b',
                label: 'Keep everyone in place until EMS completes treatment',
                consequence: 'CRITICAL ERROR: Lightning strike risk to 50+ people outweighs treatment delay. Evacuation is essential.',
                isCorrect: false,
                impact: 'critical'
              },
              {
                id: 'opt-c',
                label: 'Move only the non-essential personnel',
                consequence: 'PARTIAL: Better than nothing, but ALL personnel in open areas should evacuate for lightning.',
                isCorrect: false,
                impact: 'neutral'
              },
              {
                id: 'opt-d',
                label: 'Continue monitoring weather and decide in 5 more minutes',
                consequence: 'INCORRECT: Delay could be fatal. Decisive action is required with lightning approaching.',
                isCorrect: false,
                impact: 'negative'
              }
            ],
            timeLimit: 30
          }
        ]
      }
    ]
  },
  {
    id: 'scenario-2',
    title: 'Crowd Crush Emergency',
    description: 'A barrier failure at a main stage causes crowd surge with multiple injuries. Communication systems are overwhelmed.',
    initialSituation: 'You are the Safety Coordinator for a major outdoor concert with 15,000 attendees. During the headliner performance, the front barrier fails, causing a crowd surge forward. Multiple people are reporting injuries. Radio channels are congested. Some crowd members are climbing equipment to escape.',
    learningObjectives: [
      'Manage mass casualty incident',
      'Restore communication and coordination',
      'Implement crowd management protocols',
      'Coordinate multi-agency response'
    ],
    phases: [
      {
        id: 'phase-1',
        title: 'Initial Response',
        description: 'Chaos at front barrier, multiple casualties',
        decisions: [
          {
            id: 'decision-1-1',
            situation: 'Radio channels are congested with multiple people talking. You can see people injured at the barrier. The band is still playing. What is your FIRST action?',
            options: [
              {
                id: 'opt-a',
                label: 'Immediately cut power to the stage and stop the show',
                consequence: 'PARTIAL: Stopping the show may be necessary but establishing command and communication is first priority.',
                isCorrect: false,
                impact: 'neutral'
              },
              {
                id: 'opt-b',
                label: 'Establish unified command, clear radio channels, and declare mass casualty incident',
                consequence: 'CORRECT: Command and communication structure must be established before effective action can be taken.',
                isCorrect: true,
                nextPhaseId: 'phase-2',
                impact: 'positive'
              },
              {
                id: 'opt-c',
                label: 'Physically enter the crowd to help injured people',
                consequence: 'CRITICAL ERROR: Individual action without coordination creates more risk. Command structure is essential.',
                isCorrect: false,
                impact: 'critical'
              },
              {
                id: 'opt-d',
                label: 'Wait for police to arrive and take charge',
                consequence: 'INCORRECT: Delay in establishing command allows situation to deteriorate. Take charge now.',
                isCorrect: false,
                impact: 'negative'
              }
            ],
            timeLimit: 60
          }
        ]
      },
      {
        id: 'phase-2',
        title: 'Triage and Treatment',
        description: 'Establish medical response in chaotic environment',
        decisions: [
          {
            id: 'decision-2-1',
            situation: 'You have established command. Police and EMS are arriving. There are approximately 20+ injured people with varying severity. What is your priority for medical response?',
            options: [
              {
                id: 'opt-a',
                label: 'Treat the most visibly injured people first',
                consequence: 'INCORRECT: Triage requires treating based on severity and survivability, not visibility.',
                isCorrect: false,
                impact: 'negative'
              },
              {
                id: 'opt-b',
                label: 'Establish triage area, designate medical branch under Operations, and implement START triage',
                consequence: 'CORRECT: Structured triage system ensures most lives are saved. Organized approach is essential.',
                isCorrect: true,
                nextPhaseId: 'phase-3',
                impact: 'positive'
              },
              {
                id: 'opt-c',
                label: 'Transport the walking wounded first to clear the area',
                consequence: 'INCORRECT: Minor injuries are lowest priority. Critical patients need immediate attention.',
                isCorrect: false,
                impact: 'negative'
              },
              {
                id: 'opt-d',
                label: 'Request all available ambulances and transport everyone to hospital',
                consequence: 'INCORRECT: Random transport overwhelms hospitals and may delay care for critical patients.',
                isCorrect: false,
                impact: 'negative'
              }
            ],
            timeLimit: 45
          }
        ]
      }
    ]
  }
];

// Triage Categories (START System)
export const triageCategories: TriageCategory[] = [
  {
    category: 'immediate',
    label: 'Immediate (Red)',
    color: '#dc2626',
    description: 'Life-threatening injuries requiring immediate intervention',
    criteria: [
      'Respiratory distress or compromise',
      'Uncontrolled bleeding',
      'Altered mental status',
      'Shock signs present'
    ],
    treatmentPriority: 1
  },
  {
    category: 'delayed',
    label: 'Delayed (Yellow)',
    color: '#eab308',
    description: 'Serious injuries that can wait for treatment',
    criteria: [
      'Fractures without circulation compromise',
      'Major soft tissue injuries',
      'Stable abdominal wounds',
      'Spinal precautions needed'
    ],
    treatmentPriority: 2
  },
  {
    category: 'minor',
    label: 'Minor (Green)',
    color: '#16a34a',
    description: 'Walking wounded with minor injuries',
    criteria: [
      'Minor lacerations',
      'Contusions and abrasions',
      'Ambulatory patients',
      'Can self-care or wait'
    ],
    treatmentPriority: 3
  },
  {
    category: 'deceased',
    label: 'Deceased/Expectant (Black)',
    color: '#1f2937',
    description: 'Deceased or injuries incompatible with life',
    criteria: [
      'No spontaneous respirations after airway opened',
      'No pulse with obvious fatal injuries',
      'Cardiac arrest from traumatic causes'
    ],
    treatmentPriority: 4
  }
];

// Emergency Communication Protocols
export const communicationProtocols: CommunicationProtocol[] = [
  { protocol: 'Radio Check', code: 'Radio Check', meaning: 'Testing communication', action: 'Respond with call sign and "Loud and Clear"', urgency: 'routine' },
  { protocol: 'Mayday', code: 'MAYDAY MAYDAY MAYDAY', meaning: 'Life-threatening emergency', action: 'All units clear frequency, respond to Mayday', urgency: 'critical' },
  { protocol: 'Emergency Traffic', code: 'Emergency Traffic', meaning: 'Urgent situation', action: 'Clear frequency for emergency message', urgency: 'urgent' },
  { protocol: 'Standby', code: 'Standby', meaning: 'Wait for further instruction', action: 'Maintain current position/action, await update', urgency: 'routine' },
  { protocol: 'All Clear', code: 'All Clear', meaning: 'Emergency resolved', action: 'Resume normal operations', urgency: 'routine' },
  { protocol: 'Evacuate', code: 'Evacuate [Area]', meaning: 'Immediate evacuation required', action: 'Leave area immediately via designated route', urgency: 'critical' }
];

// Emergency Service Contacts and Roles
export const emergencyContacts: EmergencyContact[] = [
  {
    agency: 'Police Department',
    role: 'Law Enforcement Coordinator',
    primaryResponsibility: 'Scene security, crowd control, criminal investigation',
    triggerForContact: 'Any major incident, security threat, criminal activity',
    contactMethod: 'Direct radio to PD dispatch or 911'
  },
  {
    agency: 'Fire Department',
    role: 'Fire/Rescue Coordinator',
    primaryResponsibility: 'Fire suppression, technical rescue, hazardous materials',
    triggerForContact: 'Fire, entrapment, structural collapse, hazmat release',
    contactMethod: 'Direct radio to FD dispatch or 911'
  },
  {
    agency: 'EMS/Ambulance',
    role: 'Medical Branch Director',
    primaryResponsibility: 'Patient treatment and transport',
    triggerForContact: 'Any injury requiring medical attention, mass casualty',
    contactMethod: 'Direct radio to EMS dispatch or 911'
  },
  {
    agency: 'Emergency Management',
    role: 'Emergency Operations Center',
    primaryResponsibility: 'Regional coordination and resource allocation',
    triggerForContact: 'Incident exceeds local capacity, mutual aid needed',
    contactMethod: 'Emergency Operations Center hotline'
  },
  {
    agency: 'Public Health',
    role: 'Health Department Liaison',
    primaryResponsibility: 'Disease control, food/water safety, mass prophylaxis',
    triggerForContact: 'Illness outbreak, biological hazard, food safety issue',
    contactMethod: 'Health department emergency line'
  }
];

// Incident Documentation Template
export const incidentDocuments: IncidentDocument[] = [
  {
    id: 'initial-report',
    title: 'Initial Incident Report',
    description: 'First documentation of incident occurrence',
    requiredFields: [
      { name: 'incidentDateTime', type: 'datetime', required: true, hint: 'Date and time incident occurred' },
      { name: 'reporterName', type: 'text', required: true, hint: 'Name of person reporting' },
      { name: 'incidentType', type: 'select', required: true, options: ['Injury', 'Illness', 'Property Damage', 'Near Miss', 'Environmental', 'Security'], hint: 'Category of incident' },
      { name: 'location', type: 'text', required: true, hint: 'Exact location of incident' },
      { name: 'description', type: 'textarea', required: true, hint: 'Detailed description of what happened' },
      { name: 'immediateActions', type: 'textarea', required: true, hint: 'Actions taken immediately after incident' },
      { name: 'witnesses', type: 'textarea', required: false, hint: 'Names and contact info of witnesses' }
    ],
    sampleTemplate: 'INCIDENT REPORT #{INCIDENT_NUMBER}\nDate/Time: {incidentDateTime}\nReported By: {reporterName}\nType: {incidentType}\nLocation: {location}\n\nDESCRIPTION:\n{description}\n\nIMMEDIATE ACTIONS TAKEN:\n{immediateActions}\n\nWITNESSES:\n{witnesses}'
  },
  {
    id: 'witness-statement',
    title: 'Witness Statement Form',
    description: 'Formal statement from incident witness',
    requiredFields: [
      { name: 'witnessName', type: 'text', required: true },
      { name: 'contactInfo', type: 'text', required: true },
      { name: 'statementDate', type: 'datetime', required: true },
      { name: 'whatWitnessed', type: 'textarea', required: true, hint: 'What the witness saw or heard' },
      { name: 'sequence', type: 'textarea', required: true, hint: 'Sequence of events as witnessed' },
      { name: 'signature', type: 'text', required: true, hint: 'Electronic or physical signature' }
    ],
    sampleTemplate: 'WITNESS STATEMENT\nName: {witnessName}\nContact: {contactInfo}\nDate: {statementDate}\n\nSTATEMENT:\n{whatWitnessed}\n\nSEQUENCE OF EVENTS:\n{sequence}\n\nSignature: {signature}'
  }
];

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Under NIMS, who has the authority to stop unsafe operations immediately without consulting the Incident Commander?',
    options: [
      'Operations Section Chief',
      'Safety Officer',
      'Public Information Officer',
      'Planning Section Chief'
    ],
    correctAnswer: 1,
    explanation: 'The Safety Officer has specific emergency authority to immediately stop or prevent unsafe acts. This is a unique authority within ICS that does not require prior IC approval.',
    difficulty: 'medium',
    category: 'ics'
  },
  {
    id: 'q2',
    question: 'In the START triage system, a patient who is breathing but has a respiratory rate of 35 breaths per minute should be classified as:',
    options: [
      'Immediate (Red)',
      'Delayed (Yellow)',
      'Minor (Green)',
      'Deceased (Black)'
    ],
    correctAnswer: 0,
    explanation: 'A respiratory rate over 30 indicates respiratory compromise requiring immediate intervention. This patient would be categorized as Immediate (Red).',
    difficulty: 'hard',
    category: 'procedures'
  },
  {
    id: 'q3',
    question: 'Which ICS section is responsible for ordering resources and managing facilities?',
    options: [
      'Operations Section',
      'Planning Section',
      'Logistics Section',
      'Finance/Admin Section'
    ],
    correctAnswer: 2,
    explanation: 'The Logistics Section provides resources and services including ordering, facilities management, communications, transportation, and supplies.',
    difficulty: 'easy',
    category: 'ics'
  },
  {
    id: 'q4',
    question: 'When should Unified Command be established?',
    options: [
      'Only for incidents involving multiple jurisdictions',
      'When multiple agencies have responsibility for the incident',
      'Only when the Incident Commander requests assistance',
      'For all incidents over Type 2 classification'
    ],
    correctAnswer: 1,
    explanation: 'Unified Command is used when multiple agencies have jurisdictional or functional responsibility for an incident, allowing them to establish common objectives and strategies.',
    difficulty: 'medium',
    category: 'coordination'
  },
  {
    id: 'q5',
    question: 'What is the first step in the incident management process when arriving at a major incident scene?',
    options: [
      'Begin treating casualties',
      'Establish command and size up the situation',
      'Request additional resources',
      'Set up a perimeter'
    ],
    correctAnswer: 1,
    explanation: 'The first step is always to establish command and conduct a size-up assessment. This ensures coordinated response and proper resource management.',
    difficulty: 'easy',
    category: 'procedures'
  },
  {
    id: 'q6',
    question: 'In a mass casualty incident, which category of patients should receive treatment FIRST?',
    options: [
      'Patients with minor injuries who can walk',
      'Patients who are unconscious but breathing',
      'Patients who are not breathing after airway is opened',
      'Patients with life-threatening but treatable conditions'
    ],
    correctAnswer: 3,
    explanation: 'Immediate (Red) priority patients have life-threatening conditions that are treatable and survivable. They receive priority over minor injuries (Green) and expectant (Black) patients.',
    difficulty: 'medium',
    category: 'procedures'
  },
  {
    id: 'q7',
    question: 'Which of the following is NOT one of the five major ICS functional sections?',
    options: [
      'Command',
      'Intelligence/Investigations',
      'Operations',
      'External Affairs'
    ],
    correctAnswer: 3,
    explanation: 'The five major ICS functional sections are Command, Operations, Planning, Logistics, and Finance/Administration. External Affairs is not a standard section (though Public Information is part of Command).',
    difficulty: 'medium',
    category: 'ics'
  },
  {
    id: 'q8',
    question: 'When communicating on radio during an emergency, what should you do FIRST if you need to transmit urgent information?',
    options: [
      'Immediately begin speaking your message',
      'Say "Break Break" to interrupt current traffic',
      'Wait for the current transmission to complete',
      'Switch to a different frequency'
    ],
    correctAnswer: 1,
    explanation: 'For urgent information, use "Break Break" to interrupt current traffic, then wait for acknowledgment before transmitting your message.',
    difficulty: 'medium',
    category: 'coordination'
  }
];

// FEMA Recommended Training
export const femaCourses = [
  { code: 'IS-100', title: 'Introduction to Incident Command System', hours: 2 },
  { code: 'IS-200', title: 'ICS for Single Resources and Initial Action Incidents', hours: 4 },
  { code: 'IS-700', title: 'National Incident Management System', hours: 4 },
  { code: 'IS-800', title: 'National Response Framework', hours: 4 },
  { code: 'IS-15.b', title: 'Special Events Contingency Planning', hours: 2 }
];

export const scenarioChallenge = {
  id: 'major-incident-command',
  title: 'Major Incident Command Challenge',
  description: 'You are the Incident Commander for a multi-agency response to a major incident at an outdoor festival. Test your knowledge of ICS structure and decision-making.',
  scenario: 'A severe weather event has caused multiple incidents simultaneously: stage structure damage with entrapment, a crowd surge at another venue causing injuries, and a hazardous materials release from a damaged generator.',
  tasks: [
    {
      id: 'task-1',
      question: 'Which ICS positions should be activated IMMEDIATELY? (Select all that apply)',
      options: [
        { id: 'ops', label: 'Operations Section Chief', correct: true },
        { id: 'safety', label: 'Safety Officer', correct: true },
        { id: 'logistics', label: 'Logistics Section Chief', correct: true },
        { id: 'pio', label: 'Public Information Officer', correct: false },
        { id: 'finance', label: 'Finance/Admin Section Chief', correct: false }
      ]
    },
    {
      id: 'task-2',
      question: 'For the hazmat release, which branch of Operations should handle this?',
      options: [
        { id: 'medical', label: 'Medical Branch', correct: false },
        { id: 'hazmat', label: 'Hazmat Branch (or Technical Rescue)', correct: true },
        { id: 'law', label: 'Law Enforcement Branch', correct: false },
        { id: 'fire', label: 'Fire Suppression Branch', correct: false }
      ]
    },
    {
      id: 'task-3',
      question: 'When should Unified Command be considered?',
      options: [
        { id: 'never', label: 'Never - one IC should maintain control', correct: false },
        { id: 'immediately', label: 'Immediately - multiple agencies involved', correct: true },
        { id: 'later', label: 'Only if the incident escalates', correct: false },
        { id: 'police', label: 'Only if police take over', correct: false }
      ]
    }
  ],
  feedback: {
    success: 'Excellent command decisions! You have correctly identified the immediate ICS positions needed and understand when Unified Command is appropriate.',
    partial: 'You have some correct answers. Remember that Operations, Safety, and Logistics are immediate priorities in a complex incident.',
    retry: 'Consider which functions are essential immediately vs. which can be activated later as the incident develops.'
  }
};
