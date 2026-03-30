// Data and content for Module 1.2: Laser Classification System

import { LaserClass, ClassificationScenario, ControlMeasure, QuizQuestion, SortingItem } from './types';

export const moduleInfo = {
  id: 'module-1.2',
  title: 'Laser Classification System',
  courseId: 'course-1',
  courseName: 'Laser Safety Fundamentals',
  description: 'Master the IEC 60825-1 and FDA laser classification system to identify hazards and required controls for each class.',
  duration: 18,
  learningObjectives: [
    'Identify all 7 laser classes (1, 1M, 2, 2M, 3R, 3B, 4) and their characteristics',
    'Understand Accessible Emission Limits (AEL) for each class',
    'Determine required control measures by laser class',
    'Apply classification criteria to real-world laser products',
    'Recognize when Class 1/2M conditions apply'
  ],
  prerequisites: ['module-1.1'],
  nextModule: 'module-2.1',
};

export const phases = [
  {
    id: 'warmup',
    title: 'Classification Challenge',
    duration: 3,
    type: 'warmup' as const,
  },
  {
    id: 'core',
    title: 'Understanding Classes',
    duration: 6,
    type: 'core' as const,
  },
  {
    id: 'practice',
    title: 'Classification Practice',
    duration: 5,
    type: 'practice' as const,
  },
  {
    id: 'challenge',
    title: 'Expert Challenge',
    duration: 4,
    type: 'challenge' as const,
  },
];

export const laserClasses: LaserClass[] = [
  {
    id: 'class1',
    name: 'Class 1',
    classNumber: 1,
    subtitle: 'Inherently Safe',
    maxPowerCW: 'Varies by wavelength (safe under all conditions)',
    hazardDescription: 'Safe under reasonably foreseeable conditions of operation. May contain embedded Class 4 lasers that are fully enclosed.',
    keyCharacteristics: [
      'Safe for long-term viewing',
      'No eye protection required',
      'May contain high-power embedded lasers',
      'Safety relies on enclosure integrity'
    ],
    requirements: {
      engineering: ['Protective housing prevents access to laser radiation'],
      administrative: ['Warning label if embedded Class 3B/4 laser'],
      ppe: ['None required under normal operation'],
    },
    aelNote: 'AEL ≤ MPE for all exposure durations',
    color: '#10B981', // green
    icon: '✓',
  },
  {
    id: 'class1m',
    name: 'Class 1M',
    classNumber: 1,
    subtitle: 'Safe Without Magnification',
    maxPowerCW: 'Similar to Class 3R with expanded beams',
    hazardDescription: 'Safe for naked eye but potentially hazardous when viewed with magnifying optics. Large divergent beams.',
    keyCharacteristics: [
      'Safe for naked eye viewing',
      'Hazardous with collecting optics (telescope, microscope)',
      'Large beam or highly divergent',
      'Common in fiber communication systems'
    ],
    requirements: {
      engineering: ['Protective housing', 'Aperture label warning about optics'],
      administrative: ['Warning against optical viewing'],
      ppe: ['None for naked eye use'],
    },
    aelNote: 'AEL > Class 1 but safe for naked eye',
    color: '#34D399', // light green
    icon: '👁️',
  },
  {
    id: 'class2',
    name: 'Class 2',
    classNumber: 2,
    subtitle: 'Blink Reflex Protection',
    maxPowerCW: '< 1 mW (visible only, 400-700 nm)',
    hazardDescription: 'Blink reflex (0.25s) provides adequate protection. Hazardous only with intentional staring.',
    keyCharacteristics: [
      'Only for visible lasers (400-700 nm)',
      'Blink reflex provides natural protection',
      'Safe for accidental brief exposure',
      'Hazardous with deliberate staring > 0.25s'
    ],
    requirements: {
      engineering: ['CAUTION label required', 'Emission indicator (LED)'],
      administrative: ['Do not stare into beam'],
      ppe: ['Not required for normal use'],
    },
    aelNote: 'AEL = 1 mW for visible CW lasers',
    color: '#F59E0B', // amber
    icon: '👁️',
  },
  {
    id: 'class2m',
    name: 'Class 2M',
    classNumber: 2,
    subtitle: 'Blink Reflex + No Magnification',
    maxPowerCW: '< 1 mW visible, with expanded beam',
    hazardDescription: 'Safe with blink reflex for naked eye, but hazardous with magnifying optics.',
    keyCharacteristics: [
      'Visible light only (400-700 nm)',
      'Blink reflex protection for naked eye',
      'Hazardous with optical instruments',
      'Large or divergent beam'
    ],
    requirements: {
      engineering: ['CAUTION label', 'Optical viewing warning'],
      administrative: ['Do not view with telescopes'],
      ppe: ['None for normal use'],
    },
    aelNote: 'Similar to Class 2, expanded beam',
    color: '#FBBF24', // light amber
    icon: '👁️+',
  },
  {
    id: 'class3r',
    name: 'Class 3R',
    classNumber: 3,
    subtitle: 'Reduced Risk',
    maxPowerCW: '< 5 mW (visible)',
    hazardDescription: 'Low risk normally, but potentially hazardous with intentional viewing. Marginally exceeds Class 2 AEL.',
    keyCharacteristics: [
      'Slightly exceeds Class 2 AEL (5x for CW)',
      'Low risk in normal use',
      'May exceed MPE with intentional viewing',
      'Formerly called "Class IIIa"'
    ],
    requirements: {
      engineering: ['DANGER label', 'Key switch (for high power 3R)'],
      administrative: ['Avoid eye exposure', 'Training recommended'],
      ppe: ['Usually not required'],
    },
    aelNote: 'AEL = 5 × Class 2 AEL (or 5 × Class 1 for invisible)',
    color: '#F97316', // orange
    icon: '⚠️',
  },
  {
    id: 'class3b',
    name: 'Class 3B',
    classNumber: 3,
    subtitle: 'Direct Beam Hazard',
    maxPowerCW: '< 500 mW',
    hazardDescription: 'Hazardous for direct beam or specular reflection viewing. Diffuse reflections usually safe.',
    keyCharacteristics: [
      'Direct beam causes injury',
      'Specular reflections are hazardous',
      'Diffuse reflections generally safe',
      'Skin hazard with high power'
    ],
    requirements: {
      engineering: ['DANGER label', 'Key switch', 'Emission delay (2-5s)'],
      administrative: ['Restrict access to trained personnel', 'Written SOPs required'],
      ppe: ['Protective eyewear required'],
    },
    aelNote: 'AEL = 500 mW CW or 0.5 J pulsed',
    color: '#EF4444', // red
    icon: '⚠️⚠️',
  },
  {
    id: 'class4',
    name: 'Class 4',
    classNumber: 4,
    subtitle: 'Maximum Hazard',
    maxPowerCW: '> 500 mW',
    hazardDescription: 'Eye and skin hazard from direct, reflected, and diffuse reflections. Fire hazard. Capable of igniting materials.',
    keyCharacteristics: [
      'All exposure routes are hazardous',
      'Diffuse reflections can cause injury',
      'Fire and skin burn hazard',
      'Can ignite combustible materials'
    ],
    requirements: {
      engineering: ['DANGER label', 'Key switch', 'Interlocks', 'Beam stops'],
      administrative: ['Laser Safety Officer required', 'Controlled area', 'Written procedures'],
      ppe: ['Proper protective eyewear mandatory', 'Protective clothing if needed'],
    },
    aelNote: 'AEL > 500 mW CW or 0.5 J/pulse',
    color: '#DC2626', // dark red
    icon: '☠️',
  },
];

export const classificationScenarios: ClassificationScenario[] = [
  {
    id: 'scenario1',
    laserName: 'CD Player Laser',
    wavelength: '780 nm (near-IR)',
    power: '0.5 mW',
    intendedUse: 'Reading optical discs in consumer equipment',
    correctClass: 'Class 1',
    hints: [
      'Consider the power level relative to Class 2 limits',
      'Is it fully enclosed within a consumer product?',
      'Can users access the beam during normal operation?'
    ],
    explanation: 'This is a Class 1 laser product. The low-power 780 nm laser is fully enclosed in the CD player, and users cannot access the beam during normal operation. The enclosure makes it inherently safe.',
  },
  {
    id: 'scenario2',
    laserName: 'Presentation Pointer',
    wavelength: '650 nm (red)',
    power: '4.9 mW',
    intendedUse: 'Pointing during presentations',
    correctClass: 'Class 3R',
    hints: [
      'Check the power against Class 2 limits',
      'Class 2 is limited to < 1 mW for visible lasers',
      'Class 3R allows up to 5 mW'
    ],
    explanation: 'This is a Class 3R laser. At 4.9 mW, it exceeds the Class 2 limit of 1 mW but is within the Class 3R limit of 5 mW. The "R" stands for "reduced risk" - it\'s safe for brief accidental exposure but should not be intentionally viewed.',
  },
  {
    id: 'scenario3',
    laserName: 'Fiber Optic Test Source',
    wavelength: '1550 nm (near-IR)',
    power: '10 mW',
    divergence: 'High divergence (>100 mrad)',
    intendedUse: 'Testing fiber optic communication lines',
    correctClass: 'Class 1M',
    hints: [
      'The beam is highly divergent',
      'Consider what happens with collecting optics',
      '1550 nm is invisible - blink reflex doesn\'t help'
    ],
    explanation: 'This is a Class 1M laser. The high divergence makes it safe for the naked eye, but viewing through a microscope or fiber inspection scope (collecting optics) could concentrate the beam and create a hazard.',
  },
  {
    id: 'scenario4',
    laserName: 'Industrial Cutting Laser',
    wavelength: '1064 nm (Nd:YAG)',
    power: '2000 W',
    intendedUse: 'Metal cutting in manufacturing',
    correctClass: 'Class 4',
    hints: [
      '2000 W is far above any Class 3 limit',
      'Consider all hazard types',
      'What control measures would be required?'
    ],
    explanation: 'This is clearly a Class 4 laser. The 2000 W power far exceeds the 500 mW Class 3B limit. It presents hazards to eyes (direct and diffuse reflection) and skin, plus fire hazards. Full engineering controls, LSO oversight, and protective eyewear are required.',
  },
  {
    id: 'scenario5',
    laserName: 'Green Laser Pointer',
    wavelength: '532 nm (green)',
    power: '0.8 mW',
    intendedUse: 'Astronomy pointing',
    correctClass: 'Class 2',
    hints: [
      '532 nm is visible light',
      'Check the power against Class 2 limits',
      'Blink reflex provides protection'
    ],
    explanation: 'This is a Class 2 laser. At 0.8 mW, it\'s below the 1 mW Class 2 limit for visible lasers. The natural blink reflex (0.25s) provides adequate protection for accidental exposure.',
  },
];

export const controlMeasures: ControlMeasure[] = [
  {
    id: 'protective-housing',
    name: 'Protective Housing',
    description: 'Enclosure that prevents access to laser radiation above MPE',
    applicableClasses: ['Class 1', 'Class 1M', 'Class 2', 'Class 2M', 'Class 3R', 'Class 3B', 'Class 4'],
    category: 'engineering',
    icon: '📦',
  },
  {
    id: 'interlocks',
    name: 'Safety Interlocks',
    description: 'Disables laser when enclosure is opened',
    applicableClasses: ['Class 3B', 'Class 4'],
    category: 'engineering',
    icon: '🔒',
  },
  {
    id: 'key-switch',
    name: 'Key-Operated Switch',
    description: 'Prevents unauthorized use',
    applicableClasses: ['Class 3B', 'Class 4'],
    category: 'engineering',
    icon: '🔑',
  },
  {
    id: 'beam-stop',
    name: 'Beam Stops/Barriers',
    description: 'Prevents beam from exiting controlled area',
    applicableClasses: ['Class 3B', 'Class 4'],
    category: 'engineering',
    icon: '🛑',
  },
  {
    id: 'warning-labels',
    name: 'Warning Labels',
    description: 'Required classification labels and hazard warnings',
    applicableClasses: ['Class 2', 'Class 2M', 'Class 3R', 'Class 3B', 'Class 4'],
    category: 'engineering',
    icon: '🏷️',
  },
  {
    id: 'lso',
    name: 'Laser Safety Officer',
    description: 'Trained individual responsible for laser safety program',
    applicableClasses: ['Class 3B', 'Class 4'],
    category: 'administrative',
    icon: '👨‍🔬',
  },
  {
    id: 'sop',
    name: 'Standard Operating Procedures',
    description: 'Written procedures for safe operation',
    applicableClasses: ['Class 3B', 'Class 4'],
    category: 'administrative',
    icon: '📋',
  },
  {
    id: 'training',
    name: 'Safety Training',
    description: 'Personnel training on hazards and controls',
    applicableClasses: ['Class 3R', 'Class 3B', 'Class 4'],
    category: 'administrative',
    icon: '🎓',
  },
  {
    id: 'controlled-area',
    name: 'Controlled Access Area',
    description: 'Restricts access to authorized personnel',
    applicableClasses: ['Class 3B', 'Class 4'],
    category: 'administrative',
    icon: '🚧',
  },
  {
    id: 'eyewear',
    name: 'Protective Eyewear',
    description: 'Laser safety glasses with appropriate OD rating',
    applicableClasses: ['Class 3B', 'Class 4'],
    category: 'ppe',
    icon: '🥽',
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which laser class is SAFE for long-term direct viewing under all normal conditions?',
    options: ['Class 1M', 'Class 2', 'Class 1', 'Class 3R'],
    correctAnswer: 2,
    explanation: 'Class 1 lasers are inherently safe under reasonably foreseeable conditions. They may contain embedded high-power lasers, but the enclosure prevents any access to hazardous radiation.',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    question: 'A 650 nm laser pointer with 4.5 mW output power would be classified as:',
    options: ['Class 2', 'Class 3R', 'Class 3B', 'Class 1'],
    correctAnswer: 1,
    explanation: 'Class 3R (Reduced Risk) lasers have an AEL of 5 mW for visible continuous-wave lasers. At 4.5 mW, this laser exceeds the Class 2 limit of 1 mW but is within the Class 3R limit.',
    difficulty: 'medium',
  },
  {
    id: 'q3',
    question: 'Which statement about Class 1M lasers is CORRECT?',
    options: [
      'They are completely safe under all conditions',
      'They are safe for naked eye but hazardous with collecting optics',
      'They only emit invisible laser radiation',
      'They are limited to 1 mW output power'
    ],
    correctAnswer: 1,
    explanation: 'Class 1M lasers are safe for the naked eye because of large beam divergence, but can be hazardous when viewed with telescopes, microscopes, or other collecting optics that focus the beam.',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    question: 'For which laser classes is a Laser Safety Officer (LSO) required?',
    options: ['Class 2 and above', 'Class 3R and above', 'Class 3B and Class 4 only', 'All laser classes'],
    correctAnswer: 2,
    explanation: 'Per ANSI Z136.1, an LSO is required for Class 3B and Class 4 lasers where the MPE can be exceeded. These pose the greatest risks and require professional safety oversight.',
    difficulty: 'medium',
  },
  {
    id: 'q5',
    question: 'Which laser class presents hazards from DIFFUSE reflections (not just direct beam)?',
    options: ['Class 3B only', 'Class 3R and above', 'Class 4 only', 'Class 3B and Class 4'],
    correctAnswer: 3,
    explanation: 'Only Class 3B and Class 4 lasers present diffuse reflection hazards. Class 3B diffuse reflections are generally safe, but Class 4 diffuse reflections can be hazardous. The key distinction is that Class 4 lasers can cause injury from scattered light in almost any scenario.',
    difficulty: 'hard',
  },
  {
    id: 'q6',
    question: 'A laser product contains a fully enclosed 10W fiber laser. Users cannot access the beam. What is its classification?',
    options: ['Class 4 (because it contains a Class 4 laser)', 'Class 1 (because the enclosure makes it safe)', 'Class 3B (embedded)', 'It cannot be classified'],
    correctAnswer: 1,
    explanation: 'The product is Class 1 because the enclosure prevents access to laser radiation. The embedded laser is Class 4, but the product classification is based on accessible emission, not the internal laser class.',
    difficulty: 'hard',
  },
];

export const sortingItems: SortingItem[] = [
  { id: 'item1', name: '5 mW Green Pointer', description: 'Visible, handheld pointer', correctClass: 'Class 3R' },
  { id: 'item2', name: 'CD Player', description: 'Fully enclosed IR laser', correctClass: 'Class 1' },
  { id: 'item3', name: 'Fiber Test Source', description: 'Divergent IR beam', correctClass: 'Class 1M' },
  { id: 'item4', name: '0.5 mW Red Pointer', description: 'Standard presentation pointer', correctClass: 'Class 2' },
  { id: 'item5', name: 'Research Laser', description: '10W CW Nd:YAG', correctClass: 'Class 4' },
  { id: 'item6', name: 'Barcode Scanner', description: 'Rotating mirror, divergent', correctClass: 'Class 2M' },
  { id: 'item7', name: 'Medical Therapy', description: '300 mW therapeutic laser', correctClass: 'Class 3B' },
  { id: 'item8', name: 'Laser Level', description: 'Line generator, 2 mW', correctClass: 'Class 2' },
];

export const aelReference = {
  visibleCW: {
    class1: '< 0.39 μW',
    class2: '< 1 mW',
    class3r: '< 5 mW',
    class3b: '< 500 mW',
    class4: '> 500 mW',
  },
  notes: [
    'Actual AELs depend on wavelength and exposure duration',
    'Invisible lasers (IR/UV) have different AEL tables',
    'Pulsed lasers measured in energy per pulse (Joules)',
    'Refer to IEC 60825-1 or ANSI Z136.1 for complete tables'
  ],
};
