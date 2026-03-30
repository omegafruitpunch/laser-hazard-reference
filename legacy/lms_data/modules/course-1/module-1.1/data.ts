// Data and content for Module 1.1: Introduction to Laser Hazards

import { QuizQuestion, LaserProperty, HazardInfo, WavelengthRegion } from './types';

export const moduleInfo = {
  id: 'module-1.1',
  title: 'Introduction to Laser Hazards',
  courseId: 'course-1',
  courseName: 'Laser Safety Fundamentals',
  description: 'Understand the unique properties of laser light and the biological hazards they present to eyes and skin.',
  duration: 15, // total minutes
  learningObjectives: [
    'Explain how laser light differs from conventional light sources',
    'Identify the three key properties of laser light: coherence, monochromaticity, and low divergence',
    'Describe how laser light interacts with biological tissue',
    'Recognize retinal vs. corneal hazard regions',
    'Understand why lasers pose unique safety challenges'
  ],
  prerequisites: [],
  nextModule: 'module-1.2',
};

export const phases = [
  {
    id: 'warmup',
    title: 'The Laser Light Challenge',
    duration: 2,
    type: 'warmup' as const,
  },
  {
    id: 'core',
    title: 'Understanding Laser Properties',
    duration: 5,
    type: 'core' as const,
  },
  {
    id: 'practice',
    title: 'Hazard Recognition',
    duration: 5,
    type: 'practice' as const,
  },
  {
    id: 'challenge',
    title: 'Real-World Application',
    duration: 3,
    type: 'challenge' as const,
  },
];

export const laserProperties: LaserProperty[] = [
  {
    id: 'coherence',
    name: 'Coherence',
    description: 'Laser light waves are in phase with each other, traveling in synchronized patterns.',
    icon: 'waves',
    comparison: {
      laser: 'Waves synchronized, all peaks and troughs aligned',
      conventional: 'Waves random and out of phase',
    },
  },
  {
    id: 'monochromaticity',
    name: 'Monochromaticity',
    description: 'Laser light consists of a single wavelength (color), making it extraordinarily pure.',
    icon: 'palette',
    comparison: {
      laser: 'Single wavelength - pure color',
      conventional: 'Mix of all wavelengths - white or broad spectrum',
    },
  },
  {
    id: 'low-divergence',
    name: 'Low Divergence',
    description: 'Laser light travels in a very narrow beam with minimal spreading over distance.',
    icon: 'arrow-right',
    comparison: {
      laser: 'Narrow beam, stays concentrated over miles',
      conventional: 'Spreads out rapidly with distance',
    },
  },
];

export const wavelengthRegions: WavelengthRegion[] = [
  {
    id: 'uv',
    name: 'Ultraviolet (UV)',
    range: '180-400 nm',
    color: '#8B5CF6',
    hazardType: 'Photochemical damage',
    targetStructure: 'Cornea and lens',
    mpeNote: 'MPE very low - high hazard',
  },
  {
    id: 'visible-near-ir',
    name: 'Visible & Near-IR',
    range: '400-1400 nm',
    color: '#EF4444',
    hazardType: 'Retinal burns',
    targetStructure: 'Retina (focused by lens)',
    mpeNote: 'Retinal hazard region - most dangerous',
  },
  {
    id: 'far-ir',
    name: 'Far-IR',
    range: '>1400 nm',
    color: '#F97316',
    hazardType: 'Thermal burns',
    targetStructure: 'Cornea only',
    mpeNote: 'Front of eye only',
  },
];

export const hazards: HazardInfo[] = [
  {
    id: 'retinal-damage',
    type: 'eye',
    title: 'Retinal Damage (400-1400 nm)',
    description: 'Light in this range passes through the cornea and lens, focusing to a tiny spot on the retina. The eye acts as a magnifying glass, concentrating power by 10,000x or more.',
    severity: 'critical',
    wavelengthRange: '400-1400 nm',
    mechanism: 'Thermal burn at focal point on retina',
  },
  {
    id: 'corneal-damage',
    type: 'eye',
    title: 'Corneal Damage (UV & Far-IR)',
    description: 'These wavelengths are absorbed by the cornea before reaching the retina. Can cause photokeratitis ("welder\'s flash") or thermal burns.',
    severity: 'high',
    wavelengthRange: '< 400 nm, > 1400 nm',
    mechanism: 'Photochemical or thermal damage to cornea',
  },
  {
    id: 'skin-burns',
    type: 'skin',
    title: 'Skin Burns',
    description: 'High-power lasers can cause severe skin burns. Class 4 lasers can ignite materials and cause deep tissue damage.',
    severity: 'high',
    mechanism: 'Thermal heating of tissue',
  },
  {
    id: 'fire-hazard',
    type: 'fire',
    title: 'Fire and Material Ignition',
    description: 'Class 4 lasers have sufficient power to ignite combustible materials. A laser that can light a cigarette can cause serious burns.',
    severity: 'critical',
    mechanism: 'Heat accumulation at beam spot',
  },
];

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which property of laser light allows it to remain concentrated over long distances?',
    options: [
      'Coherence',
      'Monochromaticity',
      'Low divergence',
      'High intensity',
    ],
    correctAnswer: 2,
    explanation: 'Low divergence means the laser beam spreads out very little as it travels, maintaining its concentration and power density over long distances.',
    hint: 'Think about which property relates to the beam spreading (or not spreading) over distance.',
    difficulty: 'easy',
  },
  {
    id: 'q2',
    question: 'Why is the retinal hazard region (400-1400 nm) particularly dangerous?',
    options: [
      'These wavelengths are invisible',
      'The eye\'s lens focuses this light onto the retina, concentrating power by 10,000x or more',
      'These wavelengths penetrate through the entire head',
      'These wavelengths are only produced by Class 4 lasers',
    ],
    correctAnswer: 1,
    explanation: 'The eye\'s optical system focuses visible and near-IR light onto the retina. This focusing effect concentrates the laser energy by a factor of 10,000 or more, making even brief exposures potentially catastrophic.',
    hint: 'Consider what happens to light when it passes through the lens of your eye.',
    difficulty: 'medium',
  },
  {
    id: 'q3',
    question: 'When a laser beam reflects off a smooth mirror-like surface, what happens to its hazard potential?',
    options: [
      'It becomes completely safe',
      'It loses all its power',
      'It remains almost as hazardous as the direct beam',
      'It becomes hazardous only to skin',
    ],
    correctAnswer: 2,
    explanation: 'Specular (mirror-like) reflections maintain most of the beam\'s collimation and power. A reflected laser beam can be nearly as dangerous as the direct beam - this is why controlling reflections is critical for laser safety.',
    hint: 'Think about how light behaves when it hits a mirror versus a rough surface.',
    difficulty: 'medium',
  },
  {
    id: 'q4',
    question: 'A researcher is working with a 1064 nm Nd:YAG laser. Which eye structure is most at risk?',
    options: [
      'Cornea only',
      'Lens',
      'Retina',
      'Optic nerve directly',
    ],
    correctAnswer: 2,
    explanation: '1064 nm is in the near-infrared retinal hazard region (700-1400 nm). Although invisible, this wavelength passes through the cornea and lens and focuses on the retina, where it can cause severe damage.',
    hint: 'Check the wavelength range for retinal hazards. 1064 nm falls within 700-1400 nm.',
    difficulty: 'medium',
  },
  {
    id: 'q5',
    question: 'Which statement about laser eye injuries is TRUE?',
    options: [
      'Retinal laser injuries are always immediately painful',
      'The blink reflex provides adequate protection for Class 4 lasers',
      'Retinal laser damage can occur in a fraction of a second without pain',
      'Only visible lasers can cause retinal damage',
    ],
    correctAnswer: 2,
    explanation: 'Retinal laser injuries are typically painless because the retina has no pain receptors. Damage can occur faster than the blink reflex (0.25 seconds), and near-IR lasers are invisible but equally (or more) dangerous than visible lasers.',
    hint: 'Think about whether the retina has pain receptors and how fast laser damage can occur.',
    difficulty: 'hard',
  },
];

export const scenarioChallenge = {
  id: 'lab-setup',
  title: 'The New Laser Setup',
  description: 'Your lab has received a new 532 nm, 5W CW laser for research use. As the technician preparing the lab, you need to identify all potential hazards.',
  laserSpecs: {
    wavelength: '532 nm (green, visible)',
    power: '5W continuous wave',
    classification: 'Class 4',
    beamDiameter: '2 mm',
    divergence: '1.5 mrad',
  },
  questions: [
    {
      id: 'hazard-identification',
      question: 'What are the primary hazards of this laser? (Select all that apply)',
      options: [
        { id: 'retinal', label: 'Retinal damage from direct or reflected beam', correct: true },
        { id: 'skin', label: 'Skin burns from direct exposure', correct: true },
        { id: 'fire', label: 'Fire hazard - can ignite materials', correct: true },
        { id: 'uv', label: 'UV radiation hazard', correct: false },
        { id: 'corneal', label: 'Corneal damage only (no retinal hazard)', correct: false },
      ],
    },
    {
      id: 'reflected-hazard',
      question: 'If the beam accidentally hits a shiny metal surface, the reflected beam is:',
      options: [
        { id: 'safe', label: 'Safe to view from any distance', correct: false },
        { id: 'diffuse', label: 'Only hazardous if viewed from the diffuse reflection', correct: false },
        { id: 'specular', label: 'Nearly as hazardous as the direct beam', correct: true },
        { id: 'harmless', label: 'Completely harmless after reflection', correct: false },
      ],
    },
  ],
  feedback: {
    success: 'Excellent hazard identification! This 532 nm Class 4 laser presents retinal, skin, and fire hazards. The visible wavelength means the blink reflex provides some protection for accidental brief exposures, but intentional viewing or exposure beyond 0.25 seconds can cause permanent damage.',
    partial: 'You\'ve identified some hazards, but remember that Class 4 lasers present multiple hazards including retinal damage (532 nm is in the retinal hazard region), skin burns, and fire hazards.',
    retry: 'Consider all three types of hazards for Class 4 lasers. Also remember that 532 nm is visible light in the retinal hazard region.',
  },
};
