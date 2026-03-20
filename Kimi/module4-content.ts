/**
 * Module 4: Beam Hazard Calculations
 * Course 1: Laser Safety Fundamentals
 * 
 * This module covers the mathematical calculations for laser hazard analysis
 * including NOHD, MPE tables, and safety zone determinations.
 */

// ============================================================
// TYPES
// ============================================================

export interface Variable {
  symbol: string;
  name: string;
  unit: string;
}

export interface WorkedExample {
  id: string;
  name: string;
  given: {
    P?: number;           // Power in Watts
    divergence?: number;  // Beam divergence in mrad
    wavelength?: number;  // Wavelength in nm
    diameter?: number;    // Beam diameter in mm
    [key: string]: number | undefined;
  };
  steps: string[];
  answer: number;
  answerUnit: string;
}

export interface NOHDContent {
  definition: string;
  extendedDefinition: string;
  formula: string;
  formulaExtended: string;
  variables: Variable[];
  examples: WorkedExample[];
}

export interface MPEEntry {
  wavelengthRange: string;
  wavelengthMin: number;
  wavelengthMax: number;
  exposureDuration: string;
  mpeValue: string;
  mpeUnit: string;
  notes?: string;
}

export interface SafetyZone {
  abbreviation: string;
  name: string;
  fullName: string;
  description: string;
  hazardLevel: 'high' | 'medium' | 'low' | 'none';
  calculationFormula?: string;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'calculation';
  question: string;
  options?: string[];
  correctAnswer: number | boolean;
  explanationCorrect: string;
  explanationIncorrect: string;
  learningObjective: string;
}

// ============================================================
// NOHD CONTENT
// ============================================================

export const nohdContent: NOHDContent = {
  definition: "The Nominal Ocular Hazard Distance (NOHD) is the distance from the laser source at which the beam irradiance or radiant exposure equals the Maximum Permissible Exposure (MPE) for the unaided eye. Beyond this distance, the beam is considered safe for direct viewing under standard conditions.",
  
  extendedDefinition: `The NOHD is a critical safety parameter in laser hazard analysis. It represents:
  
• The minimum safe viewing distance for direct beam exposure
• The distance at which the beam has expanded sufficiently that its irradiance falls below the MPE
• A fundamental parameter for establishing laser controlled areas and safety zones

The NOHD accounts for:
- Laser power output (P)
- Beam divergence (φ)
- Maximum Permissible Exposure (MPE) for the specific wavelength
- Beam diameter at the aperture (for extended NOHD calculations)`,

  formula: "NOHD = (1/φ) × √(4P/(π × MPE))",
  
  formulaExtended: `Standard Formula:
NOHD = (1/φ) × √(4P/(π × MPE))

Where:
• φ (phi) = beam divergence in radians
• P = laser power in watts
• MPE = Maximum Permissible Exposure in W/cm²

For beam diameter at aperture (a₀):
NOHD = (1/φ) × √(4P/(π × MPE) - a₀²)

Note: When a₀ is small relative to the NOHD, it can often be neglected.`,

  variables: [
    { symbol: "φ", name: "beam divergence", unit: "rad or mrad" },
    { symbol: "P", name: "laser power", unit: "W" },
    { symbol: "MPE", name: "Maximum Permissible Exposure", unit: "W/cm²" },
    { symbol: "a₀", name: "beam diameter at aperture", unit: "cm" },
    { symbol: "NOHD", name: "Nominal Ocular Hazard Distance", unit: "cm or m" }
  ],

  examples: [
    {
      id: "nohd-basic-1",
      name: "Example 1: Basic NOHD Calculation (Visible Laser)",
      given: {
        P: 1.0,           // 1 Watt
        divergence: 1.0,  // 1 mrad
        wavelength: 532   // Green laser, MPE = 1.0 mW/cm² = 0.001 W/cm²
      },
      steps: [
        "Step 1: Identify the MPE for 532 nm visible light. For CW visible lasers (400-700 nm), MPE = 1.0 mW/cm² = 0.001 W/cm²",
        "Step 2: Convert divergence from mrad to rad: φ = 1.0 mrad = 0.001 rad",
        "Step 3: Apply the NOHD formula: NOHD = (1/φ) × √(4P/(π × MPE))",
        "Step 4: Calculate the term under the square root: 4P/(π × MPE) = 4×1.0/(π×0.001) = 4/0.00314 ≈ 1273.9",
        "Step 5: Take the square root: √1273.9 ≈ 35.69",
        "Step 6: Divide by divergence: 35.69 / 0.001 = 35,690 cm = 356.9 m"
      ],
      answer: 357,
      answerUnit: "meters"
    },
    {
      id: "nohd-basic-2",
      name: "Example 2: High-Power Entertainment Laser",
      given: {
        P: 10.0,          // 10 Watts
        divergence: 1.5,  // 1.5 mrad
        wavelength: 638   // Red laser
      },
      steps: [
        "Step 1: MPE for 638 nm = 1.0 mW/cm² = 0.001 W/cm² (visible light)",
        "Step 2: Convert divergence: φ = 1.5 mrad = 0.0015 rad",
        "Step 3: Calculate 4P/(π × MPE) = 4×10.0/(π×0.001) = 40/0.00314 ≈ 12,739",
        "Step 4: √12,739 ≈ 112.9",
        "Step 5: NOHD = 112.9 / 0.0015 = 75,267 cm = 753 m"
      ],
      answer: 753,
      answerUnit: "meters"
    },
    {
      id: "nohd-ir-1",
      name: "Example 3: Infrared Laser (1550 nm)",
      given: {
        P: 2.0,           // 2 Watts
        divergence: 2.0,  // 2 mrad
        wavelength: 1550  // Eye-safe infrared
      },
      steps: [
        "Step 1: For 1550 nm (Class 1M/3R boundary region), MPE = 10 mW/cm² = 0.01 W/cm²",
        "Note: 1550 nm lasers have higher MPE limits because the eye absorbs less at this wavelength",
        "Step 2: Convert divergence: φ = 2.0 mrad = 0.002 rad",
        "Step 3: Calculate 4P/(π × MPE) = 4×2.0/(π×0.01) = 8/0.0314 ≈ 254.8",
        "Step 4: √254.8 ≈ 15.96",
        "Step 5: NOHD = 15.96 / 0.002 = 7,980 cm = 80 m"
      ],
      answer: 80,
      answerUnit: "meters"
    },
    {
      id: "nohd-uv-1",
      name: "Example 4: Ultraviolet Laser (355 nm)",
      given: {
        P: 0.5,           // 500 mW
        divergence: 1.0,  // 1 mrad
        wavelength: 355   // UV-A
      },
      steps: [
        "Step 1: For 355 nm UV laser (1-30,000 second exposure), MPE = 1.0 J/cm²",
        "Step 2: For CW or long pulse, convert to irradiance: MPE = 1.0 mW/cm² = 0.001 W/cm²",
        "Step 3: Convert divergence: φ = 1.0 mrad = 0.001 rad",
        "Step 4: Calculate 4P/(π × MPE) = 4×0.5/(π×0.001) = 2/0.00314 ≈ 636.9",
        "Step 5: √636.9 ≈ 25.24",
        "Step 6: NOHD = 25.24 / 0.001 = 25,240 cm = 252 m"
      ],
      answer: 252,
      answerUnit: "meters"
    },
    {
      id: "nohd-with-aperture",
      name: "Example 5: NOHD with Beam Aperture (Extended Formula)",
      given: {
        P: 5.0,           // 5 Watts
        divergence: 1.0,  // 1 mrad
        wavelength: 532,  // Green laser
        diameter: 6.0     // 6 mm beam diameter at aperture
      },
      steps: [
        "Step 1: MPE for 532 nm = 0.001 W/cm²",
        "Step 2: Convert beam diameter to radius: a₀/2 = 0.3 cm, so a₀²/4 = 0.09 cm²",
        "Step 3: Calculate 4P/(π × MPE) = 4×5.0/(π×0.001) = 20/0.00314 ≈ 6,369.4",
        "Step 4: Subtract aperture term: 6,369.4 - 0.09 ≈ 6,369.3 (negligible difference)",
        "Step 5: √6,369.3 ≈ 79.81",
        "Step 6: NOHD = 79.81 / 0.001 = 79,810 cm = 798 m",
        "Note: For small apertures, the standard formula is usually sufficient"
      ],
      answer: 798,
      answerUnit: "meters"
    }
  ]
};

// ============================================================
// MPE TABLES
// ============================================================

export const mpeTables = {
  visible: {
    region: "Visible Light",
    wavelengthRange: "400 - 700 nm",
    description: "Photopic vision region where the eye is most sensitive",
    entries: [
      {
        wavelengthRange: "400 - 700 nm",
        wavelengthMin: 400,
        wavelengthMax: 700,
        exposureDuration: "0.25 seconds (blink reflex)",
        mpeValue: "0.39",
        mpeUnit: "μJ/cm²",
        notes: "Standard accidental exposure limit"
      },
      {
        wavelengthRange: "400 - 700 nm",
        wavelengthMin: 400,
        wavelengthMax: 700,
        exposureDuration: "0.25 - 10 seconds",
        mpeValue: "1.0",
        mpeUnit: "mW/cm²",
        notes: "Thermal limit for longer exposures"
      },
      {
        wavelengthRange: "400 - 700 nm",
        wavelengthMin: 400,
        wavelengthMax: 700,
        exposureDuration: "10 - 30,000 seconds",
        mpeValue: "0.1",
        mpeUnit: "mW/cm²",
        notes: "Photochemical limit"
      },
      {
        wavelengthRange: "400 - 550 nm",
        wavelengthMin: 400,
        wavelengthMax: 550,
        exposureDuration: "> 30,000 seconds",
        mpeValue: "1.0",
        mpeUnit: "μW/cm²",
        notes: "Retinal photochemical hazard"
      },
      {
        wavelengthRange: "550 - 700 nm",
        wavelengthMin: 550,
        wavelengthMax: 700,
        exposureDuration: "> 30,000 seconds",
        mpeValue: "10.0",
        mpeUnit: "μW/cm²",
        notes: "Reduced photochemical sensitivity"
      }
    ]
  },
  
  nearInfrared: {
    region: "Near Infrared (NIR)",
    wavelengthRange: "700 - 1400 nm",
    description: "Retinal hazard region - invisible but eye focuses these wavelengths",
    entries: [
      {
        wavelengthRange: "700 - 1050 nm",
        wavelengthMin: 700,
        wavelengthMax: 1050,
        exposureDuration: "0.25 seconds",
        mpeValue: "0.39 × C₄",
        mpeUnit: "μJ/cm²",
        notes: "C₄ = 10^((λ-700)/500), correction factor for reduced absorption"
      },
      {
        wavelengthRange: "700 - 1050 nm",
        wavelengthMin: 700,
        wavelengthMax: 1050,
        exposureDuration: "10 seconds",
        mpeValue: "1.0 × C₄",
        mpeUnit: "mW/cm²",
        notes: "Thermal hazard limit with correction"
      },
      {
        wavelengthRange: "1050 - 1400 nm",
        wavelengthMin: 1050,
        wavelengthMax: 1400,
        exposureDuration: "0.25 - 10 seconds",
        mpeValue: "0.5",
        mpeUnit: "mW/cm²",
        notes: "Reduced retinal sensitivity, 50% of visible MPE"
      },
      {
        wavelengthRange: "1050 - 1400 nm",
        wavelengthMin: 1050,
        wavelengthMax: 1400,
        exposureDuration: "10 - 30,000 seconds",
        mpeValue: "0.05",
        mpeUnit: "mW/cm²",
        notes: "50% of visible photochemical limit"
      }
    ]
  },
  
  eyeSafeInfrared: {
    region: "Eye-Safe Infrared",
    wavelengthRange: "1400 nm - 3 μm",
    description: "Corneal hazard only - eye does not focus these wavelengths on retina",
    entries: [
      {
        wavelengthRange: "1400 nm - 3 μm",
        wavelengthMin: 1400,
        wavelengthMax: 3000,
        exposureDuration: "10 seconds",
        mpeValue: "0.56",
        mpeUnit: "W/cm²",
        notes: "Corneal thermal limit"
      },
      {
        wavelengthRange: "1400 - 1500 nm",
        wavelengthMin: 1400,
        wavelengthMax: 1500,
        exposureDuration: "> 10 seconds",
        mpeValue: "100",
        mpeUnit: "mW/cm²",
        notes: "Common telecom wavelength range"
      },
      {
        wavelengthRange: "1540 nm",
        wavelengthMin: 1540,
        wavelengthMax: 1540,
        exposureDuration: "CW",
        mpeValue: "10",
        mpeUnit: "mW/cm²",
        notes: "Er:Glass laser line - commonly called 'eye-safe'"
      }
    ]
  },
  
  farInfrared: {
    region: "Far Infrared",
    wavelengthRange: "3 μm - 1 mm",
    description: "Corneal and skin hazard - absorbed at surface",
    entries: [
      {
        wavelengthRange: "3 μm - 1 mm",
        wavelengthMin: 3000,
        wavelengthMax: 1000000,
        exposureDuration: "10 seconds",
        mpeValue: "0.1",
        mpeUnit: "W/cm²",
        notes: "CO₂ laser (10.6 μm): MPE = 0.1 W/cm² for 10 s"
      },
      {
        wavelengthRange: "10.6 μm (CO₂)",
        wavelengthMin: 10600,
        wavelengthMax: 10600,
        exposureDuration: "CW",
        mpeValue: "0.1",
        mpeUnit: "W/cm²",
        notes: "Most common far-IR laser wavelength"
      }
    ]
  },
  
  ultraviolet: {
    region: "Ultraviolet",
    wavelengthRange: "180 - 400 nm",
    description: "Corneal and skin hazard - photochemical damage to cornea (welder's flash)",
    entries: [
      {
        wavelengthRange: "UV-C (180 - 280 nm)",
        wavelengthMin: 180,
        wavelengthMax: 280,
        exposureDuration: "8 hours",
        mpeValue: "3.0",
        mpeUnit: "mJ/cm²",
        notes: "Germicidal lamps, excimer lasers"
      },
      {
        wavelengthRange: "UV-B (280 - 315 nm)",
        wavelengthMin: 280,
        wavelengthMax: 315,
        exposureDuration: "8 hours",
        mpeValue: "0.003",
        mpeUnit: "J/cm²",
        notes: "Wavelength-dependent MPE increases with λ"
      },
      {
        wavelengthRange: "UV-A (315 - 400 nm)",
        wavelengthMin: 315,
        wavelengthMax: 400,
        exposureDuration: "8 hours",
        mpeValue: "1.0",
        mpeUnit: "J/cm²",
        notes: "Near-UV, some transmission to lens"
      },
      {
        wavelengthRange: "UV-A (315 - 400 nm)",
        wavelengthMin: 315,
        wavelengthMax: 400,
        exposureDuration: "> 1000 seconds",
        mPEValue: "1.0",
        mpeUnit: "mW/cm²",
        notes: "CW equivalent for long exposures"
      }
    ]
  }
};

// ============================================================
// SAFETY ZONES
// ============================================================

export const safetyZones: SafetyZone[] = [
  {
    abbreviation: "NHZ",
    name: "Nominal Hazard Zone",
    fullName: "Nominal Hazard Zone",
    description: `The NHZ is the space within which the level of direct, reflected, or scattered radiation during normal operation exceeds the applicable MPE. 
    
Characteristics:
• Represents the region of potentially hazardous exposure
• May be larger than the NOHD if considering reflected beams
• Forms the basis for defining controlled access areas
• Must be clearly delineated in laser safety plans`,
    hazardLevel: "high",
    calculationFormula: "NHZ ≥ NOHD (for direct beam)"
  },
  {
    abbreviation: "NOHD",
    name: "Nominal Ocular Hazard Distance",
    fullName: "Nominal Ocular Hazard Distance",
    description: `The distance from the laser source at which the beam irradiance or radiant exposure equals the MPE for unaided viewing.
    
Characteristics:
• Specific distance calculation based on laser parameters
• Standard reference point for hazard classification
• Used to determine minimum safe viewing distances
• Extended NOHD accounts for optical aids`,
    hazardLevel: "high",
    calculationFormula: "NOHD = (1/φ) × √(4P/(π × MPE))"
  },
  {
    abbreviation: "ED/NHZ",
    name: "Exposure Distance",
    fullName: "Exposure Distance for Nominal Hazard Zone",
    description: `Alternative term sometimes used interchangeably with NOHD in some documentation. Represents the distance at which the beam is no longer considered an eye hazard for unaided viewing.`,
    hazardLevel: "high"
  },
  {
    abbreviation: "SZED",
    name: "Sensitive Zone Exposure Distance",
    fullName: "Sensitive Zone Exposure Distance",
    description: `The distance from the laser source at which the beam irradiance or radiant exposure equals the MPE for viewing with optical aids (telescopes, binoculars).
    
Characteristics:
• Accounts for magnification from optical instruments
• Always greater than or equal to NOHD
• Critical for outdoor laser shows and aviation safety
• Typical collecting optics: 50mm diameter, 5x magnification`,
    hazardLevel: "high",
    calculationFormula: "SZED = NOHD × √(optical gain factor)"
  },
  {
    abbreviation: "CZED",
    name: "Critical Zone Exposure Distance",
    fullName: "Critical Zone Exposure Distance",
    description: `The distance from the laser source at which the beam irradiance or radiant exposure equals the MPE for the most sensitive exposure condition.
    
Characteristics:
• May consider worst-case exposure scenarios
• Used for high-risk applications
• Accounts for unintended exposure durations
• Conservative safety margin built in`,
    hazardLevel: "high"
  },
  {
    abbreviation: "LFED",
    name: "Laser Free Exposure Distance",
    fullName: "Laser Free Exposure Distance",
    description: `The distance beyond which the laser radiation levels are below the MPE for all exposure conditions, including optical viewing aids.
    
Characteristics:
• Maximum safety distance for complete assurance
• Accounts for all viewing conditions
• Used to establish laser-free zones
• Ultimate safety boundary for public protection`,
    hazardLevel: "none",
    calculationFormula: "LFED ≥ Extended NOHD with optical aids"
  }
];

// ============================================================
// ADDITIONAL CALCULATIONS
// ============================================================

export const additionalCalculations = {
  beamIrradiance: {
    name: "Beam Irradiance (E)",
    formula: "E = P / A",
    description: "Power per unit area at a given distance",
    variables: [
      { symbol: "E", name: "irradiance", unit: "W/cm²" },
      { symbol: "P", name: "power", unit: "W" },
      { symbol: "A", name: "beam area", unit: "cm²" }
    ]
  },
  
  beamArea: {
    name: "Beam Area at Distance",
    formula: "A = π × (a₀/2 + r × tan(φ/2))²",
    description: "Cross-sectional area of the beam at distance r from source",
    variables: [
      { symbol: "A", name: "beam area", unit: "cm²" },
      { symbol: "a₀", name: "initial beam diameter", unit: "cm" },
      { symbol: "r", name: "distance from source", unit: "cm" },
      { symbol: "φ", name: "full angle divergence", unit: "rad" }
    ]
  },
  
  extendedNOHD: {
    name: "Extended NOHD (with optical aids)",
    formula: "NOHD_extended = NOHD × √(D_optical / 7mm)",
    description: "NOHD adjusted for viewing through optical instruments",
    variables: [
      { symbol: "NOHD_ext", name: "extended NOHD", unit: "m" },
      { symbol: "NOHD", name: "standard NOHD", unit: "m" },
      { symbol: "D_optical", name: "optical aperture diameter", unit: "mm" }
    ]
  },
  
  opticalDensity: {
    name: "Required Optical Density (OD)",
    formula: "OD = log₁₀(E_actual / MPE)",
    description: "Filter density required to reduce beam to safe levels",
    variables: [
      { symbol: "OD", name: "optical density", unit: "dimensionless" },
      { symbol: "E", name: "actual irradiance", unit: "W/cm²" },
      { symbol: "MPE", name: "maximum permissible exposure", unit: "W/cm²" }
    ]
  }
};

// ============================================================
// QUIZ QUESTIONS
// ============================================================

export const quizQuestions: QuizQuestion[] = [
  // NOHD Calculation Questions
  {
    id: "m4_q1",
    type: "multiple_choice",
    question: "What does NOHD stand for?",
    options: [
      "Nominal Optical Hazard Distance",
      "Nominal Ocular Hazard Distance",
      "Normal Operating Hazard Distance",
      "Non-Observable Hazard Distance"
    ],
    correctAnswer: 1,
    explanationCorrect: "Correct! NOHD stands for Nominal Ocular Hazard Distance - the distance at which beam irradiance equals the MPE for unaided eye viewing.",
    explanationIncorrect: "Incorrect. NOHD stands for Nominal Ocular Hazard Distance.",
    learningObjective: "Understand laser safety terminology"
  },
  {
    id: "m4_q2",
    type: "multiple_choice",
    question: "A 2W laser with 1 mrad divergence and 532 nm wavelength has what approximate NOHD? (MPE = 0.001 W/cm²)",
    options: [
      "178 meters",
      "356 meters",
      "505 meters",
      "712 meters"
    ],
    correctAnswer: 2,
    explanationCorrect: "Correct! NOHD = (1/0.001) × √(4×2/(π×0.001)) ≈ 505 meters. The formula is NOHD = (1/φ) × √(4P/(π×MPE))",
    explanationIncorrect: "Incorrect. Using NOHD = (1/φ) × √(4P/(π×MPE)) with P=2W, φ=0.001 rad, MPE=0.001 W/cm² gives approximately 505 meters.",
    learningObjective: "Calculate NOHD from given parameters"
  },
  {
    id: "m4_q3",
    type: "calculation",
    question: "Calculate the NOHD for a 5W, 638 nm laser with 2 mrad beam divergence. (MPE for visible = 0.001 W/cm²)",
    options: [
      "398 meters",
      "563 meters",
      "796 meters",
      "1125 meters"
    ],
    correctAnswer: 2,
    explanationCorrect: "Correct! NOHD = (1/0.002) × √(4×5/(π×0.001)) = 500 × √6366 = 500 × 79.8 = 39,900 cm = 796 m",
    explanationIncorrect: "Incorrect. NOHD = (1/φ) × √(4P/(π×MPE)) = (1/0.002) × √(20/0.00314) = 500 × 79.8 = 796 meters.",
    learningObjective: "Apply NOHD formula to real-world scenarios"
  },
  
  // MPE Questions
  {
    id: "m4_q4",
    type: "multiple_choice",
    question: "What is the MPE for visible light (400-700 nm) for exposure durations between 0.25 and 10 seconds?",
    options: [
      "0.1 mW/cm²",
      "0.39 μJ/cm²",
      "1.0 mW/cm²",
      "10 mW/cm²"
    ],
    correctAnswer: 2,
    explanationCorrect: "Correct! For visible light with exposure between 0.25-10 seconds, the MPE is 1.0 mW/cm² (thermal limit).",
    explanationIncorrect: "Incorrect. The MPE for visible light (0.25-10 sec exposure) is 1.0 mW/cm². 0.39 μJ/cm² is for 0.25 sec, and 0.1 mW/cm² is for >10 sec (photochemical).",
    learningObjective: "Recall MPE values for visible wavelengths"
  },
  {
    id: "m4_q5",
    type: "true_false",
    question: "The eye is more sensitive to damage from 1550 nm infrared radiation than from 1064 nm infrared radiation.",
    correctAnswer: false,
    explanationCorrect: "Correct! 1064 nm is more hazardous because it is focused on the retina. 1550 nm is absorbed in the cornea (eye-safe region) and has a higher MPE.",
    explanationIncorrect: "Incorrect. 1550 nm is in the 'eye-safe' region - it is absorbed by the cornea and aqueous humor before reaching the retina. 1064 nm transmits to and focuses on the retina.",
    learningObjective: "Understand wavelength-dependent hazards"
  },
  
  // Safety Zone Questions
  {
    id: "m4_q6",
    type: "multiple_choice",
    question: "Which safety zone distance is ALWAYS greater than or equal to the NOHD?",
    options: [
      "NHZ (Nominal Hazard Zone)",
      "SZED (Sensitive Zone Exposure Distance)",
      "CZED (Critical Zone Exposure Distance)",
      "LFED (Laser Free Exposure Distance)"
    ],
    correctAnswer: 1,
    explanationCorrect: "Correct! SZED (Sensitive Zone Exposure Distance) accounts for optical aids and is always ≥ NOHD. It represents the hazard distance when viewing through binoculars or telescopes.",
    explanationIncorrect: "Incorrect. SZED is specifically defined as the distance at which the MPE is reached when viewing through optical aids, making it always equal to or greater than NOHD.",
    learningObjective: "Differentiate between safety zone definitions"
  },
  {
    id: "m4_q7",
    type: "multiple_choice",
    question: "What does the NHZ (Nominal Hazard Zone) represent?",
    options: [
      "The distance where laser power drops to zero",
      "The space where radiation exceeds the MPE",
      "The area where lasers cannot be used",
      "The zone requiring only warning labels"
    ],
    correctAnswer: 1,
    explanationCorrect: "Correct! The NHZ is the space within which direct, reflected, or scattered radiation exceeds the applicable MPE during normal operation.",
    explanationIncorrect: "Incorrect. The NHZ (Nominal Hazard Zone) is defined as the space where radiation levels exceed the Maximum Permissible Exposure.",
    learningObjective: "Understand the concept of Nominal Hazard Zone"
  },
  
  // Formula Questions
  {
    id: "m4_q8",
    type: "multiple_choice",
    question: "In the NOHD formula, what happens to the NOHD if the laser power is doubled?",
    options: [
      "NOHD doubles",
      "NOHD increases by √2 (about 1.4×)",
      "NOHD is halved",
      "NOHD remains the same"
    ],
    correctAnswer: 1,
    explanationCorrect: "Correct! Since P is under the square root in the NOHD formula, doubling P increases NOHD by √2 ≈ 1.414.",
    explanationIncorrect: "Incorrect. In NOHD = (1/φ) × √(4P/(π×MPE)), power P is under the square root. Therefore, doubling P multiplies NOHD by √2 ≈ 1.414.",
    learningObjective: "Understand mathematical relationships in NOHD formula"
  },
  {
    id: "m4_q9",
    type: "calculation",
    question: "If a laser has a NOHD of 500m with 1 mrad divergence, what would be the NOHD if the divergence were reduced to 0.5 mrad (same power)?",
    options: [
      "250 meters",
      "500 meters",
      "707 meters",
      "1000 meters"
    ],
    correctAnswer: 3,
    explanationCorrect: "Correct! NOHD is inversely proportional to divergence. Halving the divergence doubles the NOHD: 500m × (1.0/0.5) = 1000m.",
    explanationIncorrect: "Incorrect. NOHD ∝ 1/φ. If φ is halved, NOHD doubles: 500m × 2 = 1000 meters.",
    learningObjective: "Understand relationship between divergence and NOHD"
  },
  
  // UV and IR Questions
  {
    id: "m4_q10",
    type: "multiple_choice",
    question: "Why are lasers operating at 10.6 μm (CO₂ lasers) considered primarily a skin and corneal hazard rather than a retinal hazard?",
    options: [
      "They are too weak to damage the retina",
      "The eye's fluids absorb the radiation before it reaches the retina",
      "The beam is too large to focus on the retina",
      "CO₂ lasers are pulsed, not continuous"
    ],
    correctAnswer: 1,
    explanationCorrect: "Correct! Far-infrared wavelengths (like 10.6 μm) are strongly absorbed by water in the cornea and aqueous humor, preventing them from reaching the retina.",
    explanationIncorrect: "Incorrect. Far-IR radiation is absorbed by the water content of the cornea and anterior chamber, making it a corneal/skin hazard only.",
    learningObjective: "Understand wavelength-dependent biological effects"
  },
  {
    id: "m4_q11",
    type: "true_false",
    question: "For ultraviolet lasers, the primary hazard is photochemical damage to the cornea, commonly known as 'welder's flash' or 'snow blindness'.",
    correctAnswer: true,
    explanationCorrect: "Correct! UV radiation causes photochemical damage to the cornea (photokeratitis), which is the same mechanism as welder's flash.",
    explanationIncorrect: "Incorrect. UV lasers primarily cause photochemical damage to the cornea, commonly called welder's flash or photokeratitis.",
    learningObjective: "Understand UV laser hazards"
  },
  
  // Optical Density
  {
    id: "m4_q12",
    type: "calculation",
    question: "What optical density (OD) is required for eyewear if the laser irradiance is 10 W/cm² and the MPE is 0.001 W/cm²?",
    options: [
      "OD 2",
      "OD 3",
      "OD 4",
      "OD 5"
    ],
    correctAnswer: 2,
    explanationCorrect: "Correct! OD = log₁₀(10/0.001) = log₁₀(10000) = 4. The eyewear needs OD 4.",
    explanationIncorrect: "Incorrect. OD = log₁₀(E/MPE) = log₁₀(10/0.001) = log₁₀(10,000) = 4.",
    learningObjective: "Calculate required optical density for laser eyewear"
  }
];

// ============================================================
// MAIN EXPORT
// ============================================================

export const module4Content = {
  title: "Module 4: Beam Hazard Calculations",
  description: "Mathematical foundations for laser hazard analysis including NOHD calculations, MPE determinations, and safety zone classifications.",
  learningObjectives: [
    "Calculate Nominal Ocular Hazard Distance (NOHD) for various laser configurations",
    "Identify and apply appropriate MPE values from ANSI Z136.1 tables",
    "Differentiate between safety zones (NHZ, SZED, CZED, LFED)",
    "Calculate required optical density for protective eyewear",
    "Understand wavelength-dependent hazard classification"
  ],
  nohd: nohdContent,
  mpeTables,
  safetyZones,
  additionalCalculations,
  quizQuestions
};

export default module4Content;
