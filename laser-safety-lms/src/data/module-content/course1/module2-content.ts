/**
 * Module 2: Laser Classification System - Content Data
 * Course 1: Laser Safety Fundamentals
 * 
 * Source: ANSI Z136.1-2000 Laser Definitions & IEC 60825-1 Classification
 * Extracted from: laser-classification.pdf (10 pages)
 */

// ============================================================================
// TYPES
// ============================================================================

export interface LaserClass {
  id: string;
  name: string;
  classNumber: number;
  subtitle: string;
  description: string;
  ael: string;
  aelDetails: string;
  hazards: string[];
  examples: string[];
  controls: {
    engineering: string[];
    administrative: string[];
    ppe: string[];
  };
  color: string;
  icon: string;
}

export interface AELTable {
  wavelength: string;
  wavelengthRange: string;
  class1: string;
  class2: string;
  class3r: string;
  class3b: string;
  class4: string;
  notes?: string;
}

export interface AELFormula {
  name: string;
  formula: string;
  variables: { symbol: string; meaning: string }[];
  appliesTo: string;
}

export interface ClassificationDevice {
  name: string;
  class: string;
  wavelength: string;
  power: string;
  reasoning: string;
  category: string;
}

export interface ControlMatrixItem {
  control: string;
  class1: boolean;
  class1m: boolean;
  class2: boolean;
  class2m: boolean;
  class3r: boolean;
  class3b: boolean;
  class4: boolean;
  category: 'engineering' | 'administrative' | 'ppe';
}

export interface WarningLabel {
  class: string;
  labelText: string;
  colorScheme: string;
  requiredElements: string[];
  warningStatement: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
}

// ============================================================================
// SECTION 1: THE 7 LASER CLASSES
// ============================================================================

export const laserClasses: LaserClass[] = [
  {
    id: 'class1',
    name: 'Class 1',
    classNumber: 1,
    subtitle: 'Inherently Safe',
    description: 'Safe under reasonably foreseeable conditions of operation. Class 1 lasers are incapable of producing damaging radiation levels during normal operation, including long-term direct beam viewing. May contain embedded higher-class lasers that are fully enclosed.',
    ael: 'AEL ≤ MPE for all exposure durations (≤ 0.39 μW for visible CW)',
    aelDetails: 'Maximum Accessible Emission Limit is below the Maximum Permissible Exposure for all possible exposure conditions, including accidental long-term viewing.',
    hazards: [
      'No eye hazard under normal operation',
      'No skin hazard under normal operation',
      'Potential hazard if enclosure is damaged or removed (embedded lasers)',
      'Safe for use without control measures or training'
    ],
    examples: [
      'CD/DVD/Blu-ray players',
      'Laser printers',
      'Barcode scanners (enclosed)',
      'Optical fiber communication systems (fully enclosed)',
      'Laser surveying equipment (Class 1 variant)'
    ],
    controls: {
      engineering: [
        'Protective housing prevents access to laser radiation',
        'Interlocks on removable panels (if embedded Class 3B/4)',
        'Failsafe design for enclosure integrity'
      ],
      administrative: [
        'Warning label if contains embedded Class 3B/4 laser',
        'Service procedures for embedded lasers',
        'Do not remove protective housing'
      ],
      ppe: [
        'None required for normal operation',
        'Appropriate eyewear required during service of embedded lasers'
      ]
    },
    color: '#10B981',
    icon: '✓'
  },
  {
    id: 'class1m',
    name: 'Class 1M',
    classNumber: 1,
    subtitle: 'Safe Without Magnification',
    description: 'Safe for the naked eye but potentially hazardous when viewed with magnifying optics. Large divergent beams or highly diverging sources make naked-eye exposure safe.',
    ael: 'AEL > Class 1 but safe for naked eye viewing',
    aelDetails: 'Accessible emission exceeds Class 1 limits, but beam divergence ensures that naked-eye exposure remains below MPE. Collecting optics can concentrate beam to hazardous levels.',
    hazards: [
      'Safe for naked eye viewing under all conditions',
      'Hazardous when viewed with collecting optics (telescopes, microscopes)',
      'Fiber inspection scopes can concentrate beam',
      'Invisible beams provide no aversion response warning'
    ],
    examples: [
      'Fiber optic test equipment (high divergence)',
      'LED communication systems',
      'Expanded beam fiber couplers',
      'Free-space optical communication (divergent beams)',
      'Some laser levels with expanded beams'
    ],
    controls: {
      engineering: [
        'Protective housing',
        'Aperture label warning about optical viewing',
        'Beam expansion to maintain safe divergence'
      ],
      administrative: [
        'Warning against viewing with optical instruments',
        'Training on magnified viewing hazards',
        'Do not use telescopes or microscopes'
      ],
      ppe: [
        'None required for naked eye use',
        'Appropriate eyewear if optical viewing is necessary'
      ]
    },
    color: '#34D399',
    icon: '👁️'
  },
  {
    id: 'class2',
    name: 'Class 2',
    classNumber: 2,
    subtitle: 'Blink Reflex Protection',
    description: 'Safe for accidental brief exposure due to natural aversion response (blink reflex). Hazardous only with intentional staring into the beam. Visible lasers only (400-700 nm).',
    ael: 'AEL = 1 mW for visible CW lasers (400-700 nm)',
    aelDetails: 'Maximum 1 mW continuous wave for visible wavelengths. The 0.25 second blink reflex (aversion response) provides adequate protection for accidental exposure.',
    hazards: [
      'Blink reflex (0.25s) provides natural protection',
      'Hazardous with deliberate staring > 0.25 seconds',
      'Visible light only - no hazard for IR/UV versions',
      'Safe for momentary accidental exposure'
    ],
    examples: [
      'Standard laser pointers (< 1 mW)',
      'Laser alignment tools (low power)',
      'Some barcode scanners (open beam)',
      'Laser spirit levels (Class 2 variant)',
      'Presentation pointers'
    ],
    controls: {
      engineering: [
        'CAUTION label required',
        'Emission indicator (LED)',
        'Visible warning when laser is active'
      ],
      administrative: [
        'Do not stare into beam',
        'Avoid intentional direct viewing',
        'Basic safety awareness'
      ],
      ppe: [
        'Not required for normal use',
        'Eyewear optional for extended exposure scenarios'
      ]
    },
    color: '#F59E0B',
    icon: '👁️'
  },
  {
    id: 'class2m',
    name: 'Class 2M',
    classNumber: 2,
    subtitle: 'Blink Reflex + No Magnification',
    description: 'Safe with blink reflex for naked eye viewing of visible lasers, but hazardous when viewed with magnifying optics. Combines Class 2 limits with Class 1M beam characteristics.',
    ael: 'Similar to Class 2, expanded beam (> 1.5 mrad divergence)',
    aelDetails: 'Visible light AEL same as Class 2 (1 mW), but beam divergence exceeds αmin (1.5 mrad). Blink reflex protects naked eye; optics can concentrate beam.',
    hazards: [
      'Visible light only - blink reflex protection for naked eye',
      'Hazardous with optical instruments (telescopes, binoculars)',
      'Large or divergent beam profile',
      'Scanning beams may have different exposure characteristics'
    ],
    examples: [
      'Rotating laser levels with expanded beams',
      'Line generators for construction',
      'Scanning barcode readers',
      'Laser show projectors (scanning, low power)',
      'Some alignment lasers with beam expanders'
    ],
    controls: {
      engineering: [
        'CAUTION label required',
        'Optical viewing warning on aperture',
        'Beam expansion indicators'
      ],
      administrative: [
        'Do not view with telescopes or binoculars',
        'Do not stare into beam',
        'Training on expanded beam hazards'
      ],
      ppe: [
        'None for normal naked-eye use',
        'Eyewear if optical aids are used'
      ]
    },
    color: '#FBBF24',
    icon: '👁️+'
  },
  {
    id: 'class3r',
    name: 'Class 3R',
    classNumber: 3,
    subtitle: 'Reduced Risk',
    description: 'Low risk normally, but potentially hazardous with intentional direct viewing. Marginally exceeds Class 2 AEL (5x for CW visible). Formerly called Class IIIa.',
    ael: 'AEL = 5 × Class 2 AEL (5 mW visible) or 5 × Class 1 AEL (invisible)',
    aelDetails: 'Maximum 5 mW for visible CW lasers. Low risk in normal use but may exceed MPE with intentional viewing. Risk is reduced compared to Class 3B.',
    hazards: [
      'Slightly exceeds Class 2 AEL (5x margin)',
      'Low risk in normal accidental exposure',
      'May exceed MPE with intentional beam viewing',
      'Normally safe for brief accidental exposure'
    ],
    examples: [
      'Higher power laser pointers (1-5 mW)',
      'Laser pointers for outdoor use',
      'Some laser alignment tools',
      'Low-power laser modules',
      'Laser sights (airsoft, training)'
    ],
    controls: {
      engineering: [
        'DANGER label (or CAUTION for lowest power)',
        'Key switch for higher power units',
        'Emission indicator'
      ],
      administrative: [
        'Avoid eye exposure',
        'Training recommended',
        'Do not point at people',
        'Do not view beam directly'
      ],
      ppe: [
        'Usually not required for normal use',
        'Recommended for intentional viewing scenarios'
      ]
    },
    color: '#F97316',
    icon: '⚠️'
  },
  {
    id: 'class3b',
    name: 'Class 3B',
    classNumber: 3,
    subtitle: 'Direct Beam Hazard',
    description: 'Hazardous for direct beam viewing or specular reflection viewing. Diffuse reflections generally safe unless viewed at close range with high power.',
    ael: 'AEL = 500 mW CW or 0.5 J pulsed (visible and invisible)',
    aelDetails: 'Maximum 500 mW for continuous wave lasers, or 0.5 J per pulse. Direct viewing and specular reflections exceed MPE and can cause injury.',
    hazards: [
      'Direct beam causes eye injury',
      'Specular reflections are hazardous',
      'Diffuse reflections generally safe (but not for Class 4)',
      'Skin hazard with high power or long exposure'
    ],
    examples: [
      'Research lasers (low to medium power)',
      'Medical therapy lasers',
      'Industrial alignment lasers',
      'Laser show projectors (medium power)',
      'Spectroscopy lasers',
      'Educational laboratory lasers'
    ],
    controls: {
      engineering: [
        'DANGER label required',
        'Key-operated switch',
        'Emission delay (2-5 seconds)',
        'Remote interlock connector',
        'Beam stops/barriers'
      ],
      administrative: [
        'Restrict access to trained personnel',
        'Written SOPs required',
        'Laser Safety Officer designation',
        'Controlled area designation',
        'Sign-in/sign-out procedures'
      ],
      ppe: [
        'Protective eyewear required with appropriate OD',
        'Skin protection for high-power applications'
      ]
    },
    color: '#EF4444',
    icon: '⚠️⚠️'
  },
  {
    id: 'class4',
    name: 'Class 4',
    classNumber: 4,
    subtitle: 'Maximum Hazard',
    description: 'Eye and skin hazard from direct, reflected (specular and diffuse), and scattered radiation. Fire hazard. Capable of igniting combustible materials.',
    ael: 'AEL > 500 mW CW or > 0.5 J/pulse',
    aelDetails: 'All lasers exceeding Class 3B limits. No upper limit on power/energy. Diffuse reflections can exceed MPE. Skin burns and fire hazards present.',
    hazards: [
      'All exposure routes are hazardous',
      'Diffuse reflections can cause eye injury',
      'Skin burn hazard',
      'Fire hazard - can ignite combustible materials',
      'Plasma radiation hazard from target interactions',
      'Respiratory hazard from vaporized materials'
    ],
    examples: [
      'Industrial cutting and welding lasers (W to kW range)',
      'Medical surgical lasers',
      'Research lasers (high power)',
      'Military/defense lasers',
      'High-power laser show projectors',
      'Laser radar and rangefinders (high power)',
      'Material processing lasers'
    ],
    controls: {
      engineering: [
        'DANGER label required',
        'Key-operated switch',
        'Safety interlocks on enclosure',
        'Remote interlock connector',
        'Beam stops and beam enclosures',
        'Scan-fail safeguard (for scanning applications)',
        'Emergency stop (E-stop) systems'
      ],
      administrative: [
        'Laser Safety Officer REQUIRED',
        'Controlled area with restricted access',
        'Written standard operating procedures',
        'Comprehensive safety training',
        'Medical surveillance (eye exams)',
        'Incident reporting procedures',
        'Maximum beam path enforcement'
      ],
      ppe: [
        'Proper protective eyewear MANDATORY',
        'Protective clothing for skin protection',
        'Flame-resistant materials in beam path'
      ]
    },
    color: '#DC2626',
    icon: '☠️'
  }
];

// ============================================================================
// SECTION 2: ACCESSIBLE EMISSION LIMITS (AEL)
// ============================================================================

export const aelTables: AELTable[] = [
  {
    wavelength: 'Visible',
    wavelengthRange: '400-700 nm',
    class1: '≤ 0.39 μW (CW)',
    class2: '≤ 1 mW (CW)',
    class3r: '≤ 5 mW (CW)',
    class3b: '≤ 500 mW (CW)',
    class4: '> 500 mW (CW)',
    notes: 'Aversion response (0.25s) applies only to visible light'
  },
  {
    wavelength: 'Near-IR',
    wavelengthRange: '700-1400 nm',
    class1: '≤ 0.39 μW (CW)',
    class2: 'N/A (invisible)',
    class3r: '≤ 5 × Class 1 AEL',
    class3b: '≤ 500 mW (CW)',
    class4: '> 500 mW (CW)',
    notes: 'No blink reflex protection for invisible wavelengths'
  },
  {
    wavelength: 'Far-IR',
    wavelengthRange: '1400 nm - 1 mm',
    class1: 'Varies by wavelength',
    class2: 'N/A',
    class3r: '≤ 5 × Class 1 AEL',
    class3b: '≤ 500 mW (CW)',
    class4: '> 500 mW (CW)',
    notes: 'Cornea absorbs radiation; no retinal hazard'
  },
  {
    wavelength: 'UV-A',
    wavelengthRange: '315-400 nm',
    class1: 'Varies by wavelength',
    class2: 'N/A (invisible)',
    class3r: '≤ 5 × Class 1 AEL',
    class3b: '≤ 500 mW (CW)',
    class4: '> 500 mW (CW)',
    notes: 'Photochemical hazard to lens and cornea'
  },
  {
    wavelength: 'UV-B/C',
    wavelengthRange: '180-315 nm',
    class1: 'Varies by wavelength',
    class2: 'N/A',
    class3r: '≤ 5 × Class 1 AEL',
    class3b: '≤ 500 mW (CW)',
    class4: '> 500 mW (CW)',
    notes: 'Corneal absorption; photokeratitis hazard'
  }
];

export const aelFormulas: AELFormula[] = [
  {
    name: 'Class 1 AEL - Small Source',
    formula: 'AEL = MPE × Aperture Area',
    variables: [
      { symbol: 'MPE', meaning: 'Maximum Permissible Exposure (W/cm² or J/cm²)' },
      { symbol: 'Aperture Area', meaning: 'Measurement aperture area (cm²) - typically 7 mm diameter' }
    ],
    appliesTo: 'All wavelengths, small sources (α ≤ αmin = 1.5 mrad)'
  },
  {
    name: 'Class 2 AEL - Visible CW',
    formula: 'AEL = 1 mW (for t ≥ 0.25 s)',
    variables: [
      { symbol: '1 mW', meaning: 'Maximum power for visible continuous wave' },
      { symbol: '0.25 s', meaning: 'Aversion response time (blink reflex)' }
    ],
    appliesTo: 'Visible lasers (400-700 nm), CW or pulse > 0.25s'
  },
  {
    name: 'Class 3R AEL',
    formula: 'AEL = 5 × Class 2 AEL (visible) or 5 × Class 1 AEL (invisible)',
    variables: [
      { symbol: '5×', meaning: 'Five times the applicable Class 1 or 2 AEL' }
    ],
    appliesTo: 'All wavelengths, reduced risk category'
  },
  {
    name: 'Class 3B AEL - CW',
    formula: 'AEL = 500 mW (CW) or 0.5 J (pulsed)',
    variables: [
      { symbol: '500 mW', meaning: 'Maximum continuous wave power' },
      { symbol: '0.5 J', meaning: 'Maximum energy per pulse' }
    ],
    appliesTo: 'All wavelengths, direct beam hazard category'
  },
  {
    name: 'Extended Source Correction',
    formula: 'AEL(extended) = AEL(small) × (α/αmin)²',
    variables: [
      { symbol: 'α', meaning: 'Apparent visual angle of source (mrad)' },
      { symbol: 'αmin', meaning: '1.5 mrad - limiting angular subtense' }
    ],
    appliesTo: 'Large sources (α > 1.5 mrad), Class 1M and 2M'
  },
  {
    name: 'Optical Density',
    formula: 'Dλ = -log₁₀(τλ)',
    variables: [
      { symbol: 'Dλ', meaning: 'Optical density at wavelength λ' },
      { symbol: 'τλ', meaning: 'Transmittance at wavelength λ' },
      { symbol: 'log₁₀', meaning: 'Base-10 logarithm' }
    ],
    appliesTo: 'Protective eyewear specification'
  }
];

// ============================================================================
// SECTION 3: REAL-WORLD CLASSIFICATION EXAMPLES
// ============================================================================

export const classificationDevices: ClassificationDevice[] = [
  {
    name: 'CD/DVD Player',
    class: 'Class 1',
    wavelength: '780 nm (near-IR) / 650 nm (red)',
    power: '0.5-5 mW (internal)',
    reasoning: 'The laser diode is fully enclosed within the player. Users cannot access the beam during normal operation. The enclosure prevents any exposure to laser radiation, making the product Class 1 even though the internal laser may be Class 3B.',
    category: 'Consumer Electronics'
  },
  {
    name: 'Standard Laser Pointer',
    class: 'Class 2',
    wavelength: '630-680 nm (red)',
    power: '< 1 mW',
    reasoning: 'Visible laser below 1 mW. The natural blink reflex (0.25s) provides adequate protection for accidental exposure. Safe for momentary viewing but hazardous with intentional staring.',
    category: 'Presentation Tools'
  },
  {
    name: 'High-Power Laser Pointer',
    class: 'Class 3R',
    wavelength: '532 nm (green) / 450 nm (blue)',
    power: '1-5 mW',
    reasoning: 'Exceeds Class 2 limit of 1 mW but within Class 3R limit of 5 mW. Low risk in normal use but potentially hazardous with intentional direct viewing. The "R" indicates reduced risk compared to Class 3B.',
    category: 'Presentation Tools'
  },
  {
    name: 'Fiber Optic Test Source',
    class: 'Class 1M',
    wavelength: '1310 nm / 1550 nm (near-IR)',
    power: '10 mW',
    reasoning: 'High divergence output (> 100 mrad) makes it safe for naked eye viewing. However, viewing through a fiber inspection microscope or other collecting optics could concentrate the beam and create a hazard.',
    category: 'Telecommunications'
  },
  {
    name: 'Barcode Scanner (Open)',
    class: 'Class 2M',
    wavelength: '650 nm (red)',
    power: '0.8 mW',
    reasoning: 'Visible laser with beam expanded beyond 1.5 mrad. Blink reflex protects naked eye, but viewing through optical instruments could be hazardous. Scanning motion reduces exposure time.',
    category: 'Retail/Industrial'
  },
  {
    name: 'Industrial Alignment Laser',
    class: 'Class 3B',
    wavelength: '635 nm (red) / 532 nm (green)',
    power: '50-300 mW',
    reasoning: 'Direct beam and specular reflections exceed MPE and can cause eye injury. Diffuse reflections are generally safe. Requires control measures and protective eyewear.',
    category: 'Industrial'
  },
  {
    name: 'Research Laser (CW)',
    class: 'Class 3B',
    wavelength: '1064 nm (Nd:YAG)',
    power: '100-500 mW',
    reasoning: 'Near-infrared laser approaching Class 3B limit. Direct and specular reflection hazards. Diffuse reflections safe at normal distances. LSO oversight and eyewear required.',
    category: 'Scientific'
  },
  {
    name: 'Laser Cutting System',
    class: 'Class 4',
    wavelength: '1064 nm (fiber) / 10.6 μm (CO₂)',
    power: '500 W - 10 kW',
    reasoning: 'Far exceeds Class 3B limits. All exposure routes hazardous including diffuse reflections. Fire, skin, and eye hazards present. Requires comprehensive safety program including LSO, interlocks, and protective measures.',
    category: 'Manufacturing'
  },
  {
    name: 'Medical Surgical Laser',
    class: 'Class 4',
    wavelength: '1064 nm / 532 nm / 10.6 μm',
    power: '10-100 W',
    reasoning: 'High power for tissue cutting and coagulation. All beam paths hazardous. Requires surgical team training, protective eyewear, and smoke evacuation. Often delivered via fiber with internal interlocks.',
    category: 'Medical'
  },
  {
    name: 'Laser Show Projector',
    class: 'Class 3B or Class 4',
    wavelength: 'RGB (450 nm, 532 nm, 638 nm)',
    power: '1-50 W total',
    reasoning: 'Show lasers vary by application. Indoor audience-scanning shows may use Class 3B with MPE calculations. Outdoor and high-power shows require Class 4 controls with beam path management and audience exclusion zones.',
    category: 'Entertainment'
  },
  {
    name: 'Laser Level (Rotary)',
    class: 'Class 2 or Class 3R',
    wavelength: '635 nm (red) / 532 nm (green)',
    power: '< 1 mW to < 5 mW',
    reasoning: 'Rotary levels typically Class 2 or 3R. The rotating beam spreads energy over time. Green versions may be higher power for visibility. Safe for brief accidental exposure.',
    category: 'Construction'
  },
  {
    name: 'LiDAR System',
    class: 'Class 1 or Class 1M',
    wavelength: '905 nm / 1550 nm',
    power: 'Variable (pulsed)',
    reasoning: 'Automotive and surveying LiDAR typically Class 1 or 1M. Scanning patterns and short pulses keep average power low. Class 1M versions require warning against optical viewing.',
    category: 'Automotive/Surveying'
  }
];

// ============================================================================
// SECTION 4: REQUIRED CONTROLS BY CLASS (CONTROL MATRIX)
// ============================================================================

export const controlMatrix: ControlMatrixItem[] = [
  {
    control: 'Protective Housing',
    class1: true, class1m: true, class2: true, class2m: true,
    class3r: true, class3b: true, class4: true,
    category: 'engineering'
  },
  {
    control: 'Warning Labels (CAUTION)',
    class1: false, class1m: false, class2: true, class2m: true,
    class3r: true, class3b: false, class4: false,
    category: 'engineering'
  },
  {
    control: 'Warning Labels (DANGER)',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'engineering'
  },
  {
    control: 'Key-Operated Switch',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'engineering'
  },
  {
    control: 'Emission Indicator',
    class1: false, class1m: false, class2: true, class2m: true,
    class3r: true, class3b: true, class4: true,
    category: 'engineering'
  },
  {
    control: 'Emission Delay (2-5s)',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'engineering'
  },
  {
    control: 'Remote Interlock Connector',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'engineering'
  },
  {
    control: 'Door/Panel Interlocks',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: false, class4: true,
    category: 'engineering'
  },
  {
    control: 'Beam Stops/Barriers',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'engineering'
  },
  {
    control: 'Scan-Fail Safeguard',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: false, class4: true,
    category: 'engineering'
  },
  {
    control: 'Emergency Stop (E-stop)',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: false, class4: true,
    category: 'engineering'
  },
  {
    control: 'Laser Safety Officer (LSO)',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'administrative'
  },
  {
    control: 'Standard Operating Procedures',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'administrative'
  },
  {
    control: 'Controlled Access Area',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'administrative'
  },
  {
    control: 'Safety Training',
    class1: false, class1m: true, class2: true, class2m: true,
    class3r: true, class3b: true, class4: true,
    category: 'administrative'
  },
  {
    control: 'Medical Surveillance',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: false, class4: true,
    category: 'administrative'
  },
  {
    control: 'Protective Eyewear',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: true, class4: true,
    category: 'ppe'
  },
  {
    control: 'Skin Protection',
    class1: false, class1m: false, class2: false, class2m: false,
    class3r: false, class3b: false, class4: true,
    category: 'ppe'
  }
];

// ============================================================================
// SECTION 5: WARNING LABELS
// ============================================================================

export const warningLabels: WarningLabel[] = [
  {
    class: 'Class 1',
    labelText: 'CLASS 1 LASER PRODUCT',
    colorScheme: 'No standard label required',
    requiredElements: [
      'No warning label required if inherently Class 1',
      'Explanatory label if embedded Class 3B/4: "Laser radiation - Do Not Open"'
    ],
    warningStatement: 'No hazard statement required for true Class 1 products.'
  },
  {
    class: 'Class 1M',
    labelText: 'CLASS 1M LASER PRODUCT',
    colorScheme: 'White background, black text, sunburst symbol optional',
    requiredElements: [
      'Class designation',
      'Warning about optical viewing',
      'Aperture location indication'
    ],
    warningStatement: 'Laser radiation - Do not view directly with optical instruments.'
  },
  {
    class: 'Class 2',
    labelText: 'CAUTION - CLASS 2 LASER PRODUCT',
    colorScheme: 'Yellow background, black text, sunburst symbol',
    requiredElements: [
      'CAUTION header',
      'Class designation',
      'Sunburst warning symbol',
      'Aperture location'
    ],
    warningStatement: 'Do not stare into beam.'
  },
  {
    class: 'Class 2M',
    labelText: 'CAUTION - CLASS 2M LASER PRODUCT',
    colorScheme: 'Yellow background, black text, sunburst symbol',
    requiredElements: [
      'CAUTION header',
      'Class designation',
      'Sunburst warning symbol',
      'Optical viewing warning'
    ],
    warningStatement: 'Do not stare into beam or view directly with optical instruments.'
  },
  {
    class: 'Class 3R',
    labelText: 'DANGER/CAUTION - CLASS 3R LASER PRODUCT',
    colorScheme: 'Yellow background, black text, sunburst symbol',
    requiredElements: [
      'DANGER or CAUTION header',
      'Class designation',
      'Sunburst warning symbol',
      'Aperture location'
    ],
    warningStatement: 'Avoid direct eye exposure.'
  },
  {
    class: 'Class 3B',
    labelText: 'DANGER - CLASS 3B LASER PRODUCT',
    colorScheme: 'Red background/ border, white/black text, sunburst symbol',
    requiredElements: [
      'DANGER header',
      'Class designation',
      'Sunburst warning symbol',
      'Aperture location',
      'Maximum output specifications'
    ],
    warningStatement: 'Laser radiation - Avoid exposure to beam.'
  },
  {
    class: 'Class 4',
    labelText: 'DANGER - CLASS 4 LASER PRODUCT',
    colorScheme: 'Red background/border, white/black text, sunburst symbol',
    requiredElements: [
      'DANGER header',
      'Class designation',
      'Sunburst warning symbol',
      'Aperture location',
      'Maximum output specifications',
      'Eye and skin hazard warning'
    ],
    warningStatement: 'Laser radiation - Avoid eye or skin exposure to direct or scattered radiation.'
  }
];

// ============================================================================
// QUIZ QUESTIONS
// ============================================================================

export const quizQuestions: QuizQuestion[] = [
  {
    id: 'q1',
    question: 'Which laser class is SAFE for long-term direct viewing under all normal conditions?',
    options: ['Class 1M', 'Class 2', 'Class 1', 'Class 3R'],
    correctAnswer: 2,
    explanation: 'Class 1 lasers are inherently safe under reasonably foreseeable conditions. They may contain embedded high-power lasers, but the enclosure prevents any access to hazardous radiation.',
    difficulty: 'easy',
    category: 'Classification'
  },
  {
    id: 'q2',
    question: 'A 650 nm laser pointer with 4.5 mW output power would be classified as:',
    options: ['Class 2', 'Class 3R', 'Class 3B', 'Class 1'],
    correctAnswer: 1,
    explanation: 'Class 3R (Reduced Risk) lasers have an AEL of 5 mW for visible continuous-wave lasers. At 4.5 mW, this laser exceeds the Class 2 limit of 1 mW but is within the Class 3R limit.',
    difficulty: 'medium',
    category: 'Classification'
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
    category: 'Classification'
  },
  {
    id: 'q4',
    question: 'For which laser classes is a Laser Safety Officer (LSO) required?',
    options: ['Class 2 and above', 'Class 3R and above', 'Class 3B and Class 4 only', 'All laser classes'],
    correctAnswer: 2,
    explanation: 'Per ANSI Z136.1, an LSO is required for Class 3B and Class 4 lasers where the MPE can be exceeded. These pose the greatest risks and require professional safety oversight.',
    difficulty: 'medium',
    category: 'Controls'
  },
  {
    id: 'q5',
    question: 'Which laser class presents hazards from DIFFUSE reflections (not just direct beam)?',
    options: ['Class 3B only', 'Class 3R and above', 'Class 4 only', 'Class 3B and Class 4'],
    correctAnswer: 3,
    explanation: 'Class 3B diffuse reflections are generally safe, but Class 4 diffuse reflections can be hazardous. Class 4 lasers present the highest hazard level with risks from all exposure routes including scattered radiation.',
    difficulty: 'hard',
    category: 'Hazards'
  },
  {
    id: 'q6',
    question: 'A laser product contains a fully enclosed 10W fiber laser. Users cannot access the beam. What is its classification?',
    options: ['Class 4 (because it contains a Class 4 laser)', 'Class 1 (because the enclosure makes it safe)', 'Class 3B (embedded)', 'It cannot be classified'],
    correctAnswer: 1,
    explanation: 'The product is Class 1 because the enclosure prevents access to laser radiation. The embedded laser is Class 4, but the product classification is based on accessible emission, not the internal laser class.',
    difficulty: 'hard',
    category: 'Classification'
  },
  {
    id: 'q7',
    question: 'What is the maximum AEL for a Class 2 visible CW laser?',
    options: ['0.39 μW', '1 mW', '5 mW', '500 mW'],
    correctAnswer: 1,
    explanation: 'Class 2 lasers are limited to 1 mW for visible continuous-wave lasers. The natural blink reflex (0.25 seconds) provides protection for accidental exposure to beams at or below this power level.',
    difficulty: 'easy',
    category: 'AEL'
  },
  {
    id: 'q8',
    question: 'Which control is REQUIRED for Class 4 lasers but NOT for Class 3B?',
    options: [
      'Key-operated switch',
      'Protective eyewear',
      'Door interlocks',
      'Warning labels'
    ],
    correctAnswer: 2,
    explanation: 'Door/panel interlocks that disable the laser when opened are required for Class 4 but not Class 3B. Both classes require key switches, eyewear, and warning labels.',
    difficulty: 'medium',
    category: 'Controls'
  },
  {
    id: 'q9',
    question: 'The "M" in Class 1M and Class 2M stands for:',
    options: [
      'Medium power',
      'Magnification hazard',
      'Multi-mode beam',
      'Medical use'
    ],
    correctAnswer: 1,
    explanation: 'The "M" indicates that the laser is safe for the naked eye but potentially hazardous when viewed with magnifying optics (telescopes, microscopes) that can collect and concentrate the beam.',
    difficulty: 'medium',
    category: 'Classification'
  },
  {
    id: 'q10',
    question: 'What is the aversion response time (blink reflex) used for laser safety calculations?',
    options: ['0.1 seconds', '0.25 seconds', '0.5 seconds', '1.0 seconds'],
    correctAnswer: 1,
    explanation: 'The standard aversion response or blink reflex is assumed to occur within 0.25 seconds. This is the basis for Class 2 AEL calculations, providing protection for accidental exposure to visible lasers.',
    difficulty: 'easy',
    category: 'Fundamentals'
  },
  {
    id: 'q11',
    question: 'Which wavelength range presents the greatest RETINAL hazard?',
    options: ['UV (100-400 nm)', 'Visible (400-700 nm)', 'Near-IR (700-1400 nm)', 'Far-IR (>1400 nm)'],
    correctAnswer: 2,
    explanation: 'The retinal hazard region is 400-1400 nm (visible through near-IR). Near-IR (700-1400 nm) is particularly dangerous because the beam focuses on the retina but is invisible, providing no blink reflex warning.',
    difficulty: 'hard',
    category: 'Hazards'
  },
  {
    id: 'q12',
    question: 'What is the Class 3B AEL for continuous wave lasers?',
    options: ['1 mW', '5 mW', '500 mW', '5 W'],
    correctAnswer: 2,
    explanation: 'Class 3B lasers are limited to 500 mW for continuous wave operation. This applies to all wavelengths. Pulsed Class 3B lasers have an AEL of 0.5 J per pulse.',
    difficulty: 'medium',
    category: 'AEL'
  }
];

// ============================================================================
// KEY DEFINITIONS FROM ANSI Z136.1
// ============================================================================

export const keyDefinitions = {
  ael: {
    term: 'Accessible Emission Limit (AEL)',
    definition: 'The maximum accessible emission level permitted within a particular class.',
    context: 'AEL values are determined based on the MPE and the applicable measurement aperture.'
  },
  mpe: {
    term: 'Maximum Permissible Exposure (MPE)',
    definition: 'The level of laser radiation to which a person may be exposed without hazardous effect or adverse biological changes in the eye or skin.',
    context: 'MPE values depend on wavelength, exposure duration, and whether the exposure is to the eye or skin.'
  },
  aversionResponse: {
    term: 'Aversion Response',
    definition: 'Closure of the eyelid, or movement of the head to avoid an exposure to a noxious stimulant or bright light.',
    context: 'Assumed to occur within 0.25 seconds for visible light, forming the basis of Class 2 protection.'
  },
  alphaMin: {
    term: 'Limiting Angular Subtense (αmin)',
    definition: 'The apparent visual angle which divides small-source viewing from extended-source viewing.',
    value: '1.5 mrad',
    context: 'Sources with α ≤ αmin are treated as small sources; α > αmin as extended sources.'
  },
  alphaMax: {
    term: 'Alpha Max (αmax)',
    definition: 'The angular limit beyond which extended source MPEs for a given exposure duration are expressed as a constant radiance or integrated radiance.',
    value: '100 mrad',
    context: 'Used in extended source MPE calculations for large area sources.'
  },
  opticalDensity: {
    term: 'Optical Density (Dλ)',
    formula: 'Dλ = -log₁₀(τλ)',
    definition: 'Logarithm to the base ten of the reciprocal of the transmittance.',
    context: 'Higher optical density means lower transmittance and greater protection.'
  },
  tMin: {
    term: 'tmin (Thermal Confinement)',
    definition: 'The maximum duration for which the MPE is the same as that for a shorter exposure.',
    values: {
      '400-1050 nm': '18 μs',
      '1050-1400 nm': '50 μs'
    },
    context: 'Used in pulsed laser safety calculations.'
  },
  criticalFrequency: {
    term: 'Critical Frequency',
    definition: 'Pulse repetition frequency above which pulsed output is treated as continuous wave.',
    values: {
      '400-1050 nm': '55 kHz',
      '1050-1400 nm': '20 kHz'
    },
    context: 'Above these frequencies, thermal effects accumulate like CW exposure.'
  }
};

// ============================================================================
// MAIN MODULE CONTENT EXPORT
// ============================================================================

export const module2Content = {
  id: 'module-2',
  courseId: 'course-1',
  courseName: 'Laser Safety Fundamentals',
  title: 'Laser Classification System',
  description: 'Master the IEC 60825-1 and FDA laser classification system to identify hazards and required controls for each of the 7 laser classes.',
  duration: 18,
  learningObjectives: [
    'Identify all 7 laser classes (1, 1M, 2, 2M, 3R, 3B, 4) and their characteristics',
    'Understand Accessible Emission Limits (AEL) for each class',
    'Determine required control measures by laser class',
    'Apply classification criteria to real-world laser products',
    'Recognize when Class 1M/2M conditions apply',
    'Interpret laser warning labels and their requirements'
  ],
  sections: [
    {
      id: 'class-overview',
      title: 'The 7 Laser Classes',
      description: 'Comprehensive overview of all laser classes with hazard characteristics, examples, and control requirements.',
      classes: laserClasses
    },
    {
      id: 'ael-limits',
      title: 'Accessible Emission Limits',
      description: 'Detailed AEL tables and formulas used to determine laser classification based on wavelength and power.',
      tables: aelTables,
      formulas: aelFormulas,
      criticalValues: [
        { parameter: 'Class 2 AEL (visible)', value: '1 mW', note: 'Based on 0.25s blink reflex' },
        { parameter: 'Class 3R AEL (visible)', value: '5 mW', note: '5× Class 2 AEL' },
        { parameter: 'Class 3B AEL (CW)', value: '500 mW', note: 'All wavelengths' },
        { parameter: 'Class 3B AEL (pulsed)', value: '0.5 J/pulse', note: 'All wavelengths' },
        { parameter: 'αmin', value: '1.5 mrad', note: 'Small vs extended source boundary' },
        { parameter: 'αmax', value: '100 mrad', note: 'Extended source limit' }
      ]
    },
    {
      id: 'examples',
      title: 'Real-World Classification',
      description: 'Practical examples of common laser products and their classifications with reasoning.',
      devices: classificationDevices
    },
    {
      id: 'controls',
      title: 'Required Controls by Class',
      description: 'Complete control matrix showing which engineering, administrative, and PPE controls apply to each laser class.',
      controlMatrix: controlMatrix,
      hierarchy: {
        elimination: ['Substitution with lower class laser', 'Enclosure to Class 1'],
        engineering: ['Protective housing', 'Interlocks', 'Key switches', 'Beam stops', 'Warning labels'],
        administrative: ['LSO', 'SOPs', 'Training', 'Controlled areas'],
        ppe: ['Protective eyewear', 'Skin protection']
      }
    },
    {
      id: 'labeling',
      title: 'Warning Labels',
      description: 'Laser warning label requirements by class including colors, text, and placement.',
      labels: warningLabels
    },
    {
      id: 'definitions',
      title: 'Key Definitions',
      description: 'Important terms from ANSI Z136.1 related to laser classification.',
      definitions: keyDefinitions
    }
  ],
  quizQuestions: quizQuestions,
  sourceDocument: {
    title: 'ANSI Z136.1-2000 - Laser Definitions',
    source: 'American National Standard for Safe Use of Lasers',
    pages: 10,
    extractionDate: '2026-03-19'
  }
};

// Default export for module content
export default module2Content;
