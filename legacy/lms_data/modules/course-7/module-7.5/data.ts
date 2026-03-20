// Data and content for Module 7.5: Weather Protocols & Evacuation

import {
  WeatherThreshold, WeatherScenario, TriageCategory, DecisionMatrix,
  EvacuationRoute, EvacuationProcedure, AlertSignal, QuizQuestion,
  ModulePhase, WeatherMonitoringTool
} from './types';

export const moduleInfo = {
  id: 'module-7.5',
  title: 'Weather Protocols & Evacuation',
  courseId: 'course-7',
  courseName: 'Event Safety',
  description: 'Master weather decision-making with interactive threshold tools, evacuation planning, and real-world scenario training for severe weather events.',
  duration: 25,
  learningObjectives: [
    'Identify critical weather thresholds and appropriate responses',
    'Execute proper evacuation procedures for different weather scenarios',
    'Understand alert methods and communication protocols',
    'Apply decision matrix tools for weather-related safety decisions',
    'Monitor weather conditions using professional tools and data',
    'Make time-critical evacuation decisions under pressure'
  ],
  prerequisites: ['module-7.4'],
  nextModule: 'module-7.6',
};

export const phases: ModulePhase[] = [
  { id: 'warmup', title: 'Weather Awareness', duration: 3, type: 'warmup' },
  { id: 'core', title: 'Weather Thresholds & Alerts', duration: 8, type: 'core' },
  { id: 'practice', title: 'Weather Decision Simulator', duration: 10, type: 'practice' },
  { id: 'challenge', title: 'Evacuation Commander', duration: 4, type: 'challenge' },
];

// Weather Decision Thresholds
export const weatherThresholds: WeatherThreshold[] = [
  {
    id: 'wind-critical',
    condition: 'Surface Winds / Tornado',
    severity: 'critical',
    threshold: '50+ MPH or tornado warning',
    alertMethod: '2 long air horn blasts + radio',
    actions: [
      { area: 'Festival/Show', action: 'Immediate show delay; audience advised to seek shelter', priority: 1, estimatedTime: '5 min' },
      { area: 'Stage', action: 'Open all walls; full evacuation', priority: 1, estimatedTime: '3 min' },
      { area: 'LED Screens', action: 'Land anchor; message system evacuation', priority: 2, estimatedTime: '5 min' },
      { area: 'Audio/Lights/Spots', action: 'Power off; evacuate to fixed structures', priority: 1, estimatedTime: '5 min' },
      { area: 'FOH/Video/Back Line', action: 'Power off; evacuate to fixed structures', priority: 1, estimatedTime: '5 min' }
    ],
    allClearRequired: true
  },
  {
    id: 'wind-severe',
    condition: 'High Winds',
    severity: 'warning',
    threshold: '40+ MPH',
    alertMethod: '1 long air horn blast + radio',
    actions: [
      { area: 'Festival/Show', action: 'Show delay; audience advised to seek shelter', priority: 1, estimatedTime: '10 min' },
      { area: 'Stage', action: 'Land anchor; message system evacuation', priority: 1, estimatedTime: '5 min' },
      { area: 'LED Screens', action: 'Message system; land PA and delays', priority: 2, estimatedTime: '10 min' },
      { area: 'Audio', action: 'All truss flattened to roof; evacuation', priority: 2, estimatedTime: '10 min' },
      { area: 'Lights', action: 'Secure lights; power off; evacuate', priority: 2, estimatedTime: '5 min' },
      { area: 'Spots/FOH/Video', action: 'Power off; evacuate', priority: 3, estimatedTime: '5 min' }
    ],
    allClearRequired: true
  },
  {
    id: 'lightning-immediate',
    condition: 'Lightning',
    severity: 'critical',
    threshold: 'Within 8 miles',
    alertMethod: 'Radio alert from production',
    actions: [
      { area: 'Festival/Show', action: 'Show delay; audience advised to seek shelter', priority: 1, estimatedTime: '5 min' },
      { area: 'Stage', action: 'Take shelter immediately', priority: 1, estimatedTime: '2 min' },
      { area: 'LED Screens', action: 'Message system: take shelter', priority: 2, estimatedTime: '2 min' },
      { area: 'Audio', action: 'Power off; take shelter', priority: 1, estimatedTime: '3 min' },
      { area: 'Lights', action: 'Secure lights; power off; evacuate', priority: 1, estimatedTime: '3 min' },
      { area: 'All Production Areas', action: 'Power off and take shelter', priority: 1, estimatedTime: '5 min' }
    ],
    allClearRequired: true
  },
  {
    id: 'wind-caution',
    condition: 'Progressive Winds',
    severity: 'caution',
    threshold: 'Nearing 30 MPH',
    alertMethod: 'Radio alert from production',
    actions: [
      { area: 'Stage', action: 'Monitor proximity; increase venting; land anchor', priority: 2, estimatedTime: '15 min' },
      { area: 'LED Screens', action: 'Land PA and delays', priority: 2, estimatedTime: '10 min' },
      { area: 'Audio', action: 'All truss flattened to roof', priority: 2, estimatedTime: '15 min' },
      { area: 'Lights', action: 'Secure lights; power off; evacuate', priority: 2, estimatedTime: '10 min' },
      { area: 'Spots/FOH/Video', action: 'Secure and cover gear; monitor', priority: 3, estimatedTime: '15 min' }
    ],
    allClearRequired: false
  },
  {
    id: 'wind-monitor',
    condition: 'Increasing Winds',
    severity: 'monitor',
    threshold: '20+ MPH',
    alertMethod: 'Radio alert from production',
    actions: [
      { area: 'Stage', action: 'Vent stage; monitor conditions', priority: 3, estimatedTime: 'Ongoing' },
      { area: 'LED Screens', action: 'Land', priority: 3, estimatedTime: '10 min' },
      { area: 'Audio', action: 'Monitor PA swing', priority: 3, estimatedTime: 'Ongoing' },
      { area: 'Lights', action: 'Monitor rig swing', priority: 3, estimatedTime: 'Ongoing' },
      { area: 'Spots', action: 'Monitor sway', priority: 3, estimatedTime: 'Ongoing' },
      { area: 'All Areas', action: 'Secure gear; monitor conditions', priority: 3, estimatedTime: 'Ongoing' }
    ],
    allClearRequired: false
  },
  {
    id: 'storm-approach',
    condition: 'Storm/Lightning Tracking',
    severity: 'monitor',
    threshold: 'Within 20 miles',
    alertMethod: 'Radio alert from production',
    actions: [
      { area: 'Stage', action: 'Monitor proximity', priority: 3, estimatedTime: 'Ongoing' },
      { area: 'LED Screens', action: 'Monitor proximity', priority: 3, estimatedTime: 'Ongoing' },
      { area: 'Audio/Lights/Spots', action: 'Motor controllers at ready', priority: 3, estimatedTime: '5 min' },
      { area: 'FOH/Video/Back Line', action: 'Prepare to secure; cover gear', priority: 3, estimatedTime: '10 min' }
    ],
    allClearRequired: false
  },
  {
    id: 'rain-approach',
    condition: 'Rain Event',
    severity: 'monitor',
    threshold: 'Within 20 miles',
    alertMethod: 'Radio alert from production',
    actions: [
      { area: 'Stage', action: 'Monitor proximity', priority: 3, estimatedTime: 'Ongoing' },
      { area: 'LED Screens', action: 'Monitor proximity', priority: 3, estimatedTime: 'Ongoing' },
      { area: 'Audio/Lights/Spots', action: 'Secure and cover gear', priority: 3, estimatedTime: '15 min' },
      { area: 'FOH/Video/Back Line', action: 'Prepare to secure; cover gear', priority: 3, estimatedTime: '15 min' }
    ],
    allClearRequired: false
  }
];

// Alert Signals
export const alertSignals: AlertSignal[] = [
  { type: 'Immediate Evacuation', pattern: '2 long air horn blasts', meaning: 'Critical danger - evacuate immediately', response: 'Stop work; retreat to designated shelter' },
  { type: 'Show Delay/Shelter', pattern: '1 long air horn blast', meaning: 'Severe weather - prepare for shelter', response: 'Secure equipment; move to shelter areas' },
  { type: 'All Clear', pattern: 'Radio alert only', meaning: 'Weather threat passed', response: 'Normal activities may resume' },
  { type: 'Radio Alert', pattern: 'Radio communication', meaning: 'Monitor conditions', response: 'Increase awareness; prepare for escalation' }
];

// Weather Decision Matrix
export const weatherDecisionMatrix: DecisionMatrix = {
  rows: [
    { id: 'critical', condition: 'CRITICAL', threshold: '50+ MPH / Tornado' },
    { id: 'severe', condition: 'SEVERE', threshold: '40+ MPH' },
    { id: 'lightning', condition: 'LIGHTNING', threshold: 'Within 8 miles' },
    { id: 'caution', condition: 'CAUTION', threshold: 'Nearing 30 MPH' },
    { id: 'monitor', condition: 'MONITOR', threshold: '20+ MPH / 20 miles out' }
  ],
  columns: [
    { id: 'stage', productionArea: 'Stage', responsibilities: ['Structure integrity', 'Personnel safety', 'Equipment security'] },
    { id: 'led', productionArea: 'LED Screens', responsibilities: ['Screen positioning', 'Message display', 'Anchor security'] },
    { id: 'audio', productionArea: 'Audio', responsibilities: ['Truss position', 'Speaker security', 'Power management'] },
    { id: 'lights', productionArea: 'Lights', responsibilities: ['Fixture security', 'Power off', 'Personnel evacuation'] },
    { id: 'audience', productionArea: 'Festival/Show', responsibilities: ['Crowd communication', 'Shelter direction', 'Show status'] }
  ],
  cells: [
    // Critical row
    [
      { action: 'Open walls; Evacuate', timing: 'Immediate', priority: 1, evacuationRequired: true },
      { action: 'Land anchor; Message evac', timing: 'Immediate', priority: 1, evacuationRequired: true },
      { action: 'Power off; Evacuate', timing: 'Immediate', priority: 1, evacuationRequired: true },
      { action: 'Power off; Evacuate', timing: 'Immediate', priority: 1, evacuationRequired: true },
      { action: 'Show delay; Shelter advisory', timing: 'Immediate', priority: 1, evacuationRequired: true }
    ],
    // Severe row
    [
      { action: 'Land anchor; Message evac', timing: '5 min', priority: 1, evacuationRequired: true },
      { action: 'Land; Message delays', timing: '10 min', priority: 2, evacuationRequired: true },
      { action: 'Flatten truss; Evacuate', timing: '10 min', priority: 2, evacuationRequired: true },
      { action: 'Secure; Power off; Evacuate', timing: '5 min', priority: 2, evacuationRequired: true },
      { action: 'Show delay; Shelter advisory', timing: '10 min', priority: 1, evacuationRequired: true }
    ],
    // Lightning row
    [
      { action: 'Take shelter', timing: 'Immediate', priority: 1, evacuationRequired: true },
      { action: 'Message: Take shelter', timing: 'Immediate', priority: 2, evacuationRequired: true },
      { action: 'Power off; Shelter', timing: '3 min', priority: 1, evacuationRequired: true },
      { action: 'Secure; Power off; Evacuate', timing: '3 min', priority: 1, evacuationRequired: true },
      { action: 'Show delay; Shelter advisory', timing: '5 min', priority: 1, evacuationRequired: true }
    ],
    // Caution row
    [
      { action: 'Vent; Land anchor', timing: '15 min', priority: 2, evacuationRequired: false },
      { action: 'Land PA delays', timing: '10 min', priority: 2, evacuationRequired: false },
      { action: 'Flatten truss', timing: '15 min', priority: 2, evacuationRequired: false },
      { action: 'Secure; Power off', timing: '10 min', priority: 2, evacuationRequired: false },
      { action: 'Monitor; Prepare', timing: 'Ongoing', priority: 3, evacuationRequired: false }
    ],
    // Monitor row
    [
      { action: 'Vent stage; Monitor', timing: 'Ongoing', priority: 3, evacuationRequired: false },
      { action: 'Land', timing: '10 min', priority: 3, evacuationRequired: false },
      { action: 'Monitor PA swing', timing: 'Ongoing', priority: 3, evacuationRequired: false },
      { action: 'Monitor rig swing', timing: 'Ongoing', priority: 3, evacuationRequired: false },
      { action: 'Monitor conditions', timing: 'Ongoing', priority: 3, evacuationRequired: false }
    ]
  ]
};

// Weather Scenarios
export const weatherScenarios: WeatherScenario[] = [
  {
    id: 'scenario-1',
    title: 'Approaching Thunderstorm',
    description: 'Monitor and respond to an approaching thunderstorm with changing conditions',
    initialConditions: {
      temperature: 85,
      windSpeed: 8,
      windGusts: 12,
      precipitation: 'None',
      radarStatus: 'Storms 35 miles west, moving east at 25 MPH',
      timeToImpact: '80 minutes'
    },
    progression: [
      {
        id: 'evt-1',
        timeOffset: 15,
        condition: {
          temperature: 83,
          windSpeed: 12,
          windGusts: 18,
          precipitation: 'None',
          radarStatus: 'Storms 25 miles west, intensifying',
          timeToImpact: '60 minutes'
        },
        alertLevel: 'green',
        message: 'Storms approaching. Continue monitoring.'
      },
      {
        id: 'evt-2',
        timeOffset: 30,
        condition: {
          temperature: 80,
          windSpeed: 15,
          windGusts: 22,
          precipitation: 'None',
          lightningDistance: 20,
          radarStatus: 'Lightning detected. Storms 15 miles west.',
          timeToImpact: '35 minutes'
        },
        alertLevel: 'yellow',
        message: 'Lightning within 20 miles. Alert production teams.'
      },
      {
        id: 'evt-3',
        timeOffset: 45,
        condition: {
          temperature: 78,
          windSpeed: 22,
          windGusts: 28,
          precipitation: 'Light rain beginning',
          lightningDistance: 12,
          radarStatus: 'Storm approaching fast. Winds increasing.',
          timeToImpact: '15 minutes'
        },
        alertLevel: 'orange',
        message: 'Winds nearing 30 MPH. Lightning within 12 miles. Prepare for delays.'
      },
      {
        id: 'evt-4',
        timeOffset: 55,
        condition: {
          temperature: 75,
          windSpeed: 32,
          windGusts: 40,
          precipitation: 'Moderate rain',
          lightningDistance: 5,
          radarStatus: 'Storm overhead. Severe winds.',
          timeToImpact: '0 minutes'
        },
        alertLevel: 'red',
        message: 'CRITICAL: Lightning within 8 miles. Winds 40+ MPH. Immediate shelter required.'
      }
    ],
    decisionPoints: [
      {
        id: 'dp-1',
        situation: 'Lightning detected at 20 miles. What is your response?',
        correctTiming: 30,
        options: [
          { id: 'a', label: 'Continue show normally', consequence: 'Too late preparation. Dangerous as storm approaches.', isOptimal: false, safetyImpact: 'low' },
          { id: 'b', label: 'Radio alert to production; prepare for potential delays', consequence: 'Correct early preparation without overreacting.', isOptimal: true, safetyImpact: 'high' },
          { id: 'c', label: 'Immediate evacuation', consequence: 'Premature. 20 miles with 35 MPH movement allows preparation time.', isOptimal: false, safetyImpact: 'medium' }
        ]
      },
      {
        id: 'dp-2',
        situation: 'Winds at 22 MPH gusting 28, lightning at 12 miles. What action?',
        correctTiming: 45,
        options: [
          { id: 'a', label: 'Wait for winds to hit 30 MPH', consequence: 'Delay reduces preparation time. 30 MPH threshold is nearing.', isOptimal: false, safetyImpact: 'low' },
          { id: 'b', label: 'Implement caution protocols; flatten trusses; secure equipment', consequence: 'Correct proactive action before critical thresholds.', isOptimal: true, safetyImpact: 'high' },
          { id: 'c', label: 'Wait for lightning within 8 miles', consequence: 'Wind conditions already require action.', isOptimal: false, safetyImpact: 'medium' }
        ]
      },
      {
        id: 'dp-3',
        situation: 'Lightning at 5 miles, winds gusting 40 MPH. What is your immediate action?',
        correctTiming: 55,
        options: [
          { id: 'a', label: 'Continue monitoring', consequence: 'CRITICAL DELAY. Immediate shelter required.', isOptimal: false, safetyImpact: 'low' },
          { id: 'b', label: 'Delay show and advise shelter', consequence: 'Correct response to severe conditions.', isOptimal: true, safetyImpact: 'high' },
          { id: 'c', label: 'Wait for one more radar update', consequence: 'Unnecessary delay during critical weather.', isOptimal: false, safetyImpact: 'low' }
        ]
      }
    ]
  },
  {
    id: 'scenario-2',
    title: 'Sudden Wind Event',
    description: 'Rapid wind increase with no precipitation requires quick decision-making',
    initialConditions: {
      temperature: 72,
      windSpeed: 10,
      windGusts: 15,
      precipitation: 'None',
      radarStatus: 'Clear',
      timeToImpact: 'N/A'
    },
    progression: [
      {
        id: 'evt-1',
        timeOffset: 10,
        condition: {
          temperature: 72,
          windSpeed: 18,
          windGusts: 25,
          precipitation: 'None',
          radarStatus: 'Clear but local wind advisory issued',
          timeToImpact: 'N/A'
        },
        alertLevel: 'green',
        message: 'Winds increasing. Monitor closely.'
      },
      {
        id: 'evt-2',
        timeOffset: 20,
        condition: {
          temperature: 71,
          windSpeed: 28,
          windGusts: 38,
          precipitation: 'None',
          radarStatus: 'Wind advisory in effect',
          timeToImpact: 'N/A'
        },
        alertLevel: 'orange',
        message: 'Winds approaching 30 MPH with gusts near 40. Alert production.'
      },
      {
        id: 'evt-3',
        timeOffset: 30,
        condition: {
          temperature: 70,
          windSpeed: 42,
          windGusts: 55,
          precipitation: 'Dust/debris',
          radarStatus: 'High wind warning',
          timeToImpact: 'N/A'
        },
        alertLevel: 'red',
        message: 'CRITICAL: Winds 40+ MPH with severe gusts. Immediate action required.'
      }
    ],
    decisionPoints: [
      {
        id: 'dp-1',
        situation: 'Winds at 28 MPH gusting 38. No precipitation. What do you do?',
        correctTiming: 20,
        options: [
          { id: 'a', label: 'Continue show - no lightning threat', consequence: 'Wind threshold is critical. Action needed regardless of lightning.', isOptimal: false, safetyImpact: 'low' },
          { id: 'b', label: 'Implement caution protocols; prepare for delay', consequence: 'Correct response to approaching severe wind threshold.', isOptimal: true, safetyImpact: 'high' },
          { id: 'c', label: 'Full evacuation immediately', consequence: 'Premature at 28 MPH, but acceptable safety margin.', isOptimal: false, safetyImpact: 'medium' }
        ]
      },
      {
        id: 'dp-2',
        situation: 'Sudden increase to 42 MPH with 55 MPH gusts. What is your response?',
        correctTiming: 30,
        options: [
          { id: 'a', label: 'Delay decision for 5 minutes to confirm', consequence: 'CRITICAL ERROR. 40+ MPH requires immediate action.', isOptimal: false, safetyImpact: 'low' },
          { id: 'b', label: 'Immediate show delay; shelter advisory; air horn alert', consequence: 'Correct immediate response to critical wind threshold.', isOptimal: true, safetyImpact: 'high' },
          { id: 'c', label: 'Secure equipment only, continue show', consequence: 'Inadequate. Personnel safety requires shelter.', isOptimal: false, safetyImpact: 'medium' }
        ]
      }
    ]
  }
];

// Evacuation Routes
export const evacuationRoutes: EvacuationRoute[] = [
  {
    id: 'route-1',
    name: 'Main Audience Exit',
    startPoint: 'General Admission Area',
    destination: 'Primary Parking / Assembly Point A',
    capacity: 5000,
    accessibility: true,
    estimatedTime: '8-12 minutes',
    alternativeRoute: 'route-2'
  },
  {
    id: 'route-2',
    name: 'Secondary Audience Exit',
    startPoint: 'VIP / Rear GA Area',
    destination: 'Secondary Parking / Assembly Point B',
    capacity: 3000,
    accessibility: true,
    estimatedTime: '10-15 minutes',
    alternativeRoute: 'route-1'
  },
  {
    id: 'route-3',
    name: 'Crew Emergency Exit',
    startPoint: 'Stage / Production Area',
    destination: 'Production Compound / Shelter',
    capacity: 200,
    accessibility: false,
    estimatedTime: '3-5 minutes'
  },
  {
    id: 'route-4',
    name: 'Artist/VIP Exit',
    startPoint: 'Green Room / Artist Area',
    destination: 'Secure Transport Area',
    capacity: 50,
    accessibility: true,
    estimatedTime: '2-3 minutes'
  }
];

// Evacuation Procedures
export const evacuationProcedures: EvacuationProcedure = {
  trigger: 'Severe weather warning, structural failure, or security threat requiring immediate evacuation',
  phases: [
    {
      order: 1,
      name: 'Alert Phase',
      duration: '1-2 minutes',
      actions: [
        'Activate air horn signals',
        'Radio alert to all production',
        'PA announcement to audience',
        'Stage stops performance'
      ],
      completionCriteria: 'All personnel acknowledge alert'
    },
    {
      order: 2,
      name: 'Evacuation Phase',
      duration: '10-15 minutes',
      actions: [
        'Direct audience to exits',
        'Crew secure critical equipment',
        'Security open all exit paths',
        'Medical stand by at assembly points'
      ],
      completionCriteria: 'Venue cleared of audience'
    },
    {
      order: 3,
      name: 'Shelter Phase',
      duration: 'Variable',
      actions: [
        'Account for all personnel',
        'Continue weather monitoring',
        'Maintain communication',
        'Prepare for re-entry or extended shelter'
      ],
      completionCriteria: 'All clear issued or alternative plan activated'
    }
  ],
  personnelAssignments: [
    {
      role: 'Evacuation Coordinator',
      responsibility: 'Overall evacuation management',
      location: 'Command Post',
      equipment: ['Radio', 'Air horn', 'Manifests']
    },
    {
      role: 'Exit Monitors',
      responsibility: 'Direct flow at exit points',
      location: 'Each exit',
      equipment: ['Reflective vest', 'Flashlight', 'Radio']
    },
    {
      role: 'Area Sweepers',
      responsibility: 'Check all areas for stragglers',
      location: 'Venue interior',
      equipment: ['Radio', 'Flashlight']
    },
    {
      role: 'Assembly Point Leads',
      responsibility: 'Account for personnel at assembly points',
      location: 'Assembly points',
      equipment: ['Radio', 'Personnel lists', 'First aid kit']
    }
  ]
};

// Weather Monitoring Tools
export const weatherMonitoringTools: WeatherMonitoringTool[] = [
  {
    id: 'on-site-wind',
    name: 'On-Site Wind Monitor',
    purpose: 'Real-time local wind speed and gust measurement',
    dataPoints: ['Sustained wind speed', 'Wind gusts', 'Wind direction'],
    thresholdAlerts: [
      { parameter: 'Sustained Wind', warningValue: '20 MPH', criticalValue: '40 MPH', action: 'Alert production / Delay show' },
      { parameter: 'Wind Gusts', warningValue: '30 MPH', criticalValue: '50 MPH', action: 'Alert production / Evacuate' }
    ]
  },
  {
    id: 'lightning-detector',
    name: 'Lightning Detection System',
    purpose: 'Detect lightning strikes within detection radius',
    dataPoints: ['Strike distance', 'Strike intensity', 'Storm approach direction'],
    thresholdAlerts: [
      { parameter: 'Lightning Distance', warningValue: '20 miles', criticalValue: '8 miles', action: 'Prepare for delay / Immediate shelter' }
    ]
  },
  {
    id: 'weather-radar',
    name: 'Weather Radar/App',
    purpose: 'Monitor storm systems and precipitation',
    dataPoints: ['Storm location', 'Storm intensity', 'Movement speed/direction', 'Time to arrival'],
    thresholdAlerts: [
      { parameter: 'Storm Approach', warningValue: '30 minutes out', criticalValue: '10 minutes out', action: 'Alert production / Implement protocols' }
    ]
  },
  {
    id: 'wbgt-meter',
    name: 'WBGT Heat Stress Monitor',
    purpose: 'Monitor heat stress conditions for outdoor workers',
    dataPoints: ['Wet Bulb Globe Temperature', 'Heat index', 'Humidity'],
    thresholdAlerts: [
      { parameter: 'WBGT', warningValue: '82°F', criticalValue: '88°F', action: 'Increase breaks / Limit exposure' }
    ]
  }
];

// Quiz Questions
export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'What is the alert signal for immediate evacuation due to severe weather?',
    options: [
      '1 long air horn blast',
      '2 long air horn blasts',
      '3 short air horn blasts',
      'Continuous air horn'
    ],
    correctAnswer: 1,
    explanation: 'Two long air horn blasts plus radio communication indicates immediate evacuation due to critical conditions (50+ MPH winds or tornado).',
    difficulty: 'easy',
    category: 'alerts'
  },
  {
    id: 'q2',
    question: 'At what wind speed should stages begin landing anchors and preparing for potential evacuation?',
    options: [
      '15 MPH',
      '20 MPH',
      '30 MPH',
      '40 MPH'
    ],
    correctAnswer: 2,
    explanation: 'When winds are nearing 30 MPH (caution level), stages should land anchors and prepare for potential escalation.',
    difficulty: 'medium',
    category: 'thresholds'
  },
  {
    id: 'q3',
    question: 'Lightning is detected 10 miles from the venue. What is the appropriate response?',
    options: [
      'Continue normal operations',
      'Monitor conditions only',
      'Show delay and shelter advisory',
      'Full evacuation to vehicles'
    ],
    correctAnswer: 2,
    explanation: 'Lightning within 8 miles requires show delay and shelter advisory. At 10 miles, preparation should be underway.',
    difficulty: 'medium',
    category: 'thresholds'
  },
  {
    id: 'q4',
    question: 'Which production area is typically responsible for flattening all truss to the roof during high wind preparation?',
    options: [
      'Stage',
      'LED Screens',
      'Audio',
      'Lights'
    ],
    correctAnswer: 2,
    explanation: 'The Audio department is responsible for flattening all truss to the roof during high wind preparation (40+ MPH winds).',
    difficulty: 'hard',
    category: 'protocols'
  },
  {
    id: 'q5',
    question: 'During an evacuation, what is the first priority?',
    options: [
      'Securing equipment',
      'Life safety of personnel',
      'Protecting the stage structure',
      'Documenting the incident'
    ],
    correctAnswer: 1,
    explanation: 'Life safety is always the first priority. Equipment and property are secondary concerns.',
    difficulty: 'easy',
    category: 'evacuation'
  },
  {
    id: 'q6',
    question: 'Who has the authority to issue an "All Clear" after a weather evacuation?',
    options: [
      'The show producer',
      'The headliner artist',
      'The Safety Coordinator or designated weather officer',
      'The venue owner'
    ],
    correctAnswer: 2,
    explanation: 'The Safety Coordinator or designated weather officer has the authority and responsibility to issue the All Clear based on weather data.',
    difficulty: 'medium',
    category: 'protocols'
  },
  {
    id: 'q7',
    question: 'At what lightning distance should production areas power off equipment and take shelter?',
    options: [
      '20 miles',
      '15 miles',
      '8 miles',
      '5 miles'
    ],
    correctAnswer: 2,
    explanation: 'Lightning within 8 miles triggers the shelter protocol - all production areas power off and take shelter.',
    difficulty: 'easy',
    category: 'thresholds'
  },
  {
    id: 'q8',
    question: 'What should FOH (Front of House) personnel do when winds exceed 40 MPH?',
    options: [
      'Continue operating the mixing console',
      'Power off and evacuate to fixed structures',
      'Monitor from under the FOH tent',
      'Move equipment indoors but stay at position'
    ],
    correctAnswer: 1,
    explanation: 'When winds exceed 40 MPH, FOH personnel should power off and evacuate to fixed structures for safety.',
    difficulty: 'medium',
    category: 'evacuation'
  }
];

// Weather Challenge Scenario
export const weatherChallenge = {
  id: 'weather-command-challenge',
  title: 'Weather Command Challenge',
  description: 'You are the Weather Safety Officer for an outdoor festival. Multiple weather factors are converging. Make the right calls to keep everyone safe.',
  scenario: '3:00 PM - Temperature 88°F, winds 12 MPH, clear skies. Festival is at capacity with 20,000 attendees.',
  conditions: [
    { time: '3:30 PM', wind: 18, gusts: 25, lightning: null, radar: 'Storms 40 miles west', action: 'Monitor' },
    { time: '4:00 PM', wind: 22, gusts: 30, lightning: 18, radar: 'Lightning detected', action: 'Alert Production' },
    { time: '4:30 PM', wind: 28, gusts: 38, lightning: 12, radar: 'Storm approaching', action: 'Prepare for Delay' },
    { time: '4:45 PM', wind: 35, gusts: 48, lightning: 8, radar: 'Storm imminent', action: 'Delay & Shelter' },
    { time: '5:00 PM', wind: 45, gusts: 60, lightning: 3, radar: 'Storm overhead', action: 'Evacuate' }
  ],
  decisions: [
    {
      id: 'd1',
      time: '4:00 PM',
      question: 'Lightning detected at 18 miles. What is your action?',
      options: [
        { id: 'a', label: 'Continue show normally', correct: false },
        { id: 'b', label: 'Radio alert to production', correct: true },
        { id: 'c', label: 'Immediate evacuation', correct: false }
      ]
    },
    {
      id: 'd2',
      time: '4:30 PM',
      question: 'Winds gusting 38 MPH, lightning at 12 miles. What do you do?',
      options: [
        { id: 'a', label: 'Wait for 40 MPH winds', correct: false },
        { id: 'b', label: 'Flatten trusses; secure equipment', correct: true },
        { id: 'c', label: 'Full evacuation now', correct: false }
      ]
    },
    {
      id: 'd3',
      time: '4:45 PM',
      question: 'Lightning now at 8 miles. What is required?',
      options: [
        { id: 'a', label: 'Continue monitoring', correct: false },
        { id: 'b', label: 'Show delay and shelter advisory', correct: true },
        { id: 'c', label: 'Wait for 5 miles', correct: false }
      ]
    }
  ],
  feedback: {
    success: 'Excellent weather safety decisions! You properly escalated responses as conditions deteriorated.',
    partial: 'Some good decisions, but timing could be improved. Earlier preparation is key to weather safety.',
    retry: 'Review the weather thresholds. Earlier action at warning levels prevents crisis at critical levels.'
  }
};
