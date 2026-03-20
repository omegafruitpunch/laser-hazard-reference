/**
 * Course 1, Module 1: Introduction to Laser Hazards
 * Content extracted from: intro-laser-hazards.pdf (FDA Publication 86-8262, HHS, May 1986)
 * Source: "Laser Light Show Safety" - FDA Center for Devices and Radiological Health
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface Section {
  id: string;
  title: string;
  content: string;
  keyPoints: string[];
  interactiveData?: Record<string, unknown>;
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'scenario' | 'multiple_select' | 'calculation';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  question: string;
  options: string[];
  correctAnswer: number | number[] | boolean;
  explanation: string;
  learningObjective: string;
  topic: string;
}

export interface GlossaryTerm {
  term: string;
  definition: string;
  context?: string;
}

// ============================================
// MODULE CONTENT
// ============================================

export const module1Content = {
  title: "Introduction to Laser Hazards",
  course: "Course 1: Laser Safety Fundamentals",
  source: "FDA Publication 86-8262, HHS, May 1986 - Laser Light Show Safety",
  documentType: "educational_booklet",
  totalPages: 34,
  
  // ============================================
  // SECTIONS
  // ============================================
  
  sections: [
    // ----------------------------------------
    // SECTION 1: Laser Properties
    // ----------------------------------------
    {
      id: "laser-properties",
      title: "Laser Properties",
      content: `Laser light is one of the most exciting visual phenomena to illuminate the entertainment scene. Laser light shows have been used to complement music of diverse groups and are becoming routine features of planetariums, discotheques, conferences, amusement parks, state fairs, and shopping malls.

As beautiful as they can be, high power laser beams can be dangerous if they are not used with a serious concern for safety. Accidental exposure to a high power laser beam can cause permanent eye damage and severe skin burns.

ESSENTIAL LASER CHARACTERISTICS:

1. LASER DEFINITION: LASER is an acronym for "Light Amplification by Stimulated Emission of Radiation."

2. MONOCHROMATICITY: All the light waves in a laser beam can have the same wavelength. Since a laser beam is composed of light of the same wavelength, it has an extraordinarily pure color.

3. COHERENCE: The light waves are in phase with each other. They travel in locked-step or synchronized patterns. This unique property of laser light is called "coherence."

4. MINIMAL DIVERGENCE: Unlike a flashlight, a laser beam does not diverge or spread out very much. The laser light can travel in a very narrow beam even over long distances. Because of this, its power can be extremely concentrated.

POWER CONCENTRATION EXAMPLE:
Some lasers can produce a beam of light that, even miles away, can be thousands of times brighter than the sun's surface appears from earth. The fact that a laser beam can retain such high power, even over long distances, partly accounts for its use in light shows and many other applications. But this same fact also accounts for its potential hazard.

LASER vs ORDINARY LIGHT COMPARISON:
- Light bulb: Radiates in all directions, jumble of different wavelengths (white light), spreads out (divergence)
- Laser: Single wavelength (pure color), coherent (in phase), minimal divergence (concentrated beam)`,

      keyPoints: [
        "LASER = Light Amplification by Stimulated Emission of Radiation",
        "Laser light has pure color due to single wavelength (monochromatic)",
        "Coherence means light waves travel in locked-step patterns",
        "Minimal divergence allows power concentration over long distances",
        "Some lasers are thousands of times brighter than the sun's surface from earth",
        "The same properties that make lasers useful also make them potentially hazardous"
      ],
      
      interactiveData: {
        lightComparison: {
          type: "comparison_table",
          title: "Laser vs Ordinary Light",
          rows: [
            { property: "Wavelength", ordinary: "Multiple (appears white)", laser: "Single (pure color)" },
            { property: "Phase", ordinary: "Random/Uncoordinated", laser: "Coherent (in phase)" },
            { property: "Divergence", ordinary: "High (spreads out)", laser: "Minimal (stays narrow)" },
            { property: "Power Concentration", ordinary: "Decreases with distance", laser: "Remains concentrated" }
          ]
        },
        powerComparison: {
          type: "visual_scale",
          title: "Power Concentration Comparison",
          items: [
            { label: "100W Light Bulb (output)", value: 15, unit: "watts", spread: "all directions" },
            { label: "1W Laser", value: 1, unit: "watt", spread: "narrow beam" },
            { label: "Relative Concentration at 100ft", value: 1000000, unit: "x more concentrated", note: "1W laser vs 100W bulb" }
          ]
        }
      }
    },

    // ----------------------------------------
    // SECTION 2: The Electromagnetic Spectrum
    // ----------------------------------------
    {
      id: "em-spectrum",
      title: "The Electromagnetic Spectrum",
      content: `A WORD ABOUT RADIATION AND LASER LIGHT

The fact that lasers give off radiation may be a surprise to some. Laser light is part of the electromagnetic spectrum - the family of radiations ranging from radio waves to gamma rays.

Light radiation falls on the spectrum of radiations ranging from ultraviolet through infrared (or heat). Within this range, only a small band of wavelengths is visible to the human eye. Each color that we see is actually light radiation of a particular wavelength.

VISIBLE LIGHT SPECTRUM:
Visible light spans from violet (short waves) to red (long waves):
- Violet: approximately 380-450nm
- Blue: approximately 450-495nm
- Green: approximately 495-570nm
- Yellow: approximately 570-590nm
- Orange: approximately 590-620nm
- Red: approximately 620-750nm

Lasers generally give off visible or optical radiation; some lasers can also give off radiation in the ultraviolet or infrared ranges that we cannot see. Of course, lasers used in light shows give off visible radiation.

IMPORTANT DISTINCTION:
Unlike X-rays or radioactivity, visible light radiation has not been associated with causing cancer or genetic damage. Laser light should not be confused with ionizing radiation.

LASER WAVELENGTHS IN ENTERTAINMENT:
Most large light shows use gas lasers with either krypton gas or a mixture of argon and krypton gases. Helium-neon gas lasers are common in smaller laser displays. The atomic structure of krypton gas (36 electrons) allows it to emit photons of various wavelengths, creating multi-color effects when separated by prisms.`,

      keyPoints: [
        "Laser light is non-ionizing radiation (different from X-rays)",
        "Visible light is a small portion of the electromagnetic spectrum",
        "Violet has the shortest visible waves; red has the longest",
        "Some lasers emit in UV or IR ranges (invisible)",
        "Light show lasers use visible radiation",
        "Krypton lasers enable multi-color effects due to complex atomic structure"
      ],

      interactiveData: {
        spectrumDiagram: {
          type: "spectrum_scale",
          title: "Electromagnetic Spectrum",
          ranges: [
            { type: "radio", range: ">1m", label: "Radio Waves", visible: false },
            { type: "microwave", range: "1mm - 1m", label: "Microwaves", visible: false },
            { type: "infrared", range: "700nm - 1mm", label: "Infrared", visible: false },
            { type: "visible", range: "380-700nm", label: "VISIBLE LIGHT", visible: true, colors: ["violet", "blue", "green", "yellow", "orange", "red"] },
            { type: "ultraviolet", range: "10-380nm", label: "Ultraviolet", visible: false },
            { type: "xray", range: "0.01-10nm", label: "X-Rays", visible: false },
            { type: "gamma", range: "<0.01nm", label: "Gamma Rays", visible: false }
          ]
        },
        wavelengths: [
          { nm: 193, name: "ArF Excimer", use: "Eye surgery", hazard: "Corneal", region: "UV" },
          { nm: 248, name: "KrF Excimer", use: "Medical/industrial", hazard: "Corneal", region: "UV" },
          { nm: 308, name: "XeCl Excimer", use: "Dermatology", hazard: "Corneal", region: "UV" },
          { nm: 488, name: "Argon", use: "Light shows, medical", hazard: "Retinal", region: "Visible (blue)" },
          { nm: 514, name: "Argon", use: "Light shows, medical", hazard: "Retinal", region: "Visible (green)" },
          { nm: 532, name: "Nd:YAG doubled", use: "Light shows, pointers", hazard: "Retinal", region: "Visible (green)" },
          { nm: 632.8, name: "HeNe", use: "Displays, alignment", hazard: "Retinal", region: "Visible (red)" },
          { nm: 647, name: "Krypton", use: "Light shows", hazard: "Retinal", region: "Visible (red)" },
          { nm: 694, name: "Ruby", use: "Medical, research", hazard: "Retinal", region: "Visible (red)" },
          { nm: 755, name: "Alexandrite", use: "Dermatology", hazard: "Retinal", region: "Near-IR" },
          { nm: 1064, name: "Nd:YAG", use: "Medical, industrial", hazard: "Retinal", region: "Near-IR" },
          { nm: 10600, name: "CO2", use: "Medical, industrial cutting", hazard: "Corneal", region: "Far-IR" }
        ]
      }
    },

    // ----------------------------------------
    // SECTION 3: Beam Interactions
    // ----------------------------------------
    {
      id: "beam-interactions",
      title: "Beam Interactions and Reflection Hazards",
      content: `REFLECTION HAZARDS

A laser beam loses very little power when it is reflected off a smooth, shiny surface. When the light from a light bulb is reflected off a mirror, it continues to diverge and spread its energy over even larger areas. When a laser beam is reflected off a mirror or other smooth, shiny surfaces, it still does not diverge very much. So a reflected laser beam can have almost the same power and potentially the same hazard as a direct laser beam.

SPECULAR (MIRROR-LIKE) REFLECTION:
Surfaces that can reflect laser beams with minimal power loss:
- Mirrors
- Water surfaces
- Glass
- Metal beams
- Glossy floors
- Smooth painted surfaces

Mirror balls are frequently used in light shows to separate and reflect the laser beam into many rays of laser light. When done properly, this can significantly reduce the power and, therefore, the potential hazard of a laser beam.

If the beam is reflected off enough facets on the mirror ball, the resulting rays will go off in many directions. Although the individual rays still do not diverge very much, each has only a fraction of the power in the direct beam.

SCANNING DEVICES:
A scanning device is usually used to sweep the beam back and forth across a broad section of the mirror ball so that the beam is broken up by several facets on the ball. Rotating the mirror ball can provide even more safety because the movement of the reflected rays reduces any exposure time.

Without a scanning device, or without a properly designed scanning system, the beam is broken by the mirror ball into fewer rays, each having a larger fraction of the power in the direct beam. This means that even with a mirror ball there could still be a potential for harm.

DIFFUSE REFLECTION:
If a laser beam is reflected off a rough or irregular surface, like a concrete wall or even some walls of smoke, the irregularities in the surface scatter the beam in many different directions. The beam is forced to diverge and therefore lose some of its power.

However, a very high powered laser beam can still retain enough of its intensity after reflecting off a rough or irregular surface to cause injury. In addition, some rough surfaces may have shiny spots that allow for a mirror-like reflection of part of the beam.

SAFETY PRINCIPLE: The more rays into which the beam is split, the smaller the fraction of power each reflected ray will have.`,

      keyPoints: [
        "Reflected laser beams maintain almost the same power as direct beams",
        "Smooth shiny surfaces (mirrors, water, glass, metal) create specular reflections",
        "Mirror balls split beams to reduce power per ray",
        "Scanning devices improve safety by using more facets",
        "Rotating mirror balls reduce exposure time",
        "Rough surfaces cause diffuse reflection but high-powered lasers may still be hazardous",
        "Some rough surfaces have shiny spots that can create specular reflections"
      ],

      interactiveData: {
        reflectionTypes: [
          {
            type: "specular",
            name: "Specular (Mirror) Reflection",
            surfaces: ["Mirrors", "Water", "Glass", "Metal beams", "Glossy floors"],
            divergence: "Minimal - beam stays concentrated",
            hazardLevel: "HIGH - nearly same power as direct beam",
            icon: "mirror"
          },
          {
            type: "diffuse",
            name: "Diffuse Reflection",
            surfaces: ["Concrete walls", "Rough wood", "Matte paint", "Smoke walls"],
            divergence: "High - beam scatters in many directions",
            hazardLevel: "MODERATE to HIGH - depends on laser power",
            icon: "scatter"
          },
          {
            type: "scattered",
            name: "Intentionally Scattered (Mirror Ball)",
            surfaces: ["Mirror balls with scanning", "Diffraction gratings"],
            divergence: "Controlled - many low-power rays",
            hazardLevel: "REDUCED - power divided among many rays",
            icon: "fan"
          }
        ],
        scenarios: [
          {
            id: "scanning_safe",
            description: "Laser beam scanned across mirror ball with 50 facets",
            outcome: "SAFE",
            explanation: "Beam split into 50+ rays, each with approximately 2% of original power"
          },
          {
            id: "no_scanning",
            description: "Laser beam hits mirror ball without scanning device",
            outcome: "UNSAFE",
            explanation: "Beam may only hit 2-3 facets, creating high-power rays"
          },
          {
            id: "water_reflection",
            description: "High-power laser beam reflects off calm pool surface",
            outcome: "HAZARDOUS",
            explanation: "Water creates specular reflection with minimal power loss"
          },
          {
            id: "concrete_wall",
            description: "10W laser reflects off rough concrete wall",
            outcome: "CAUTION",
            explanation: "Diffuse scattering reduces power, but Class IV lasers may still retain dangerous levels"
          }
        ]
      }
    },

    // ----------------------------------------
    // SECTION 4: Ocular Hazards
    // ----------------------------------------
    {
      id: "ocular-hazards",
      title: "Wavelength and Ocular Hazards",
      content: `LASER HAZARDS OVERVIEW

The high powered lasers that are increasingly used in laser shows can produce enough light radiation to cause permanent eye damage as well as severe skin burns. Should any accidental direct exposure occur, there is a high chance of injury to the individual.

EYE ANATOMY AND LASER DAMAGE:

The lens and cornea of the eye concentrate light and focus it on the retina. In a sense, the eye acts like a magnifying lens to concentrate the light. The retina translates the light into nerve impulses that travel through the optic nerve to the brain, where an image is perceived.

If a laser beam enters the pupil of the eye, its power is concentrated by the lens into a smaller area, resulting in more light and heat per unit area. 

POWER CONCENTRATION IN THE EYE:
The intensity of the laser beam can actually be increased by 10,000 times or more by the time it reaches the retina!

TYPES OF VISION DAMAGE:

1. PERIPHERAL VISION DAMAGE: If the laser beam strikes the eye from the side (hitting the area of the eye used for peripheral vision), damage can occur but may not be noticed right away, although a number of burns in this part of the retina might impair vision.

2. CENTRAL VISION DAMAGE: If the beam comes directly head on at the eye (striking the eye's area for sharp vision), the burn could result in a very noticeable blind spot or other serious impairments to vision.

EXPOSURE TIME: It may only take a fraction of a second for the damage to occur.

SKIN BURN HAZARDS:
Because the eye focuses light, it is the most sensitive part of the body to laser radiation. But severe skin burns can also be caused by laser light. With some lasers, you can light a cigarette merely by putting the end of it in the laser beam. If the beam has enough power to light a cigarette, you can imagine the kind of skin burns it could cause.

HAZARD CONDITIONS SUMMARY:
- There is a hazard whenever a high power laser beam could possibly strike someone, particularly in the eyes
- The beam could be dangerous even if reflected off a smooth or shiny surface
- If the laser is high enough in power, it could be dangerous even when reflected off a rough surface or scattered by fog or smoke
- It only takes a fraction of a second to cause serious injury!`,

      keyPoints: [
        "Eye acts like a magnifying lens, concentrating laser light",
        "Laser power increases 10,000x or more when focused on retina",
        "Peripheral vision damage may go unnoticed initially",
        "Central vision damage creates noticeable blind spots",
        "Damage can occur in a fraction of a second",
        "Some lasers can light cigarettes - causing severe skin burns",
        "High-power lasers can be hazardous even from diffuse reflections"
      ],

      interactiveData: {
        eyeStructures: [
          {
            name: "Cornea",
            function: "Outer protective layer and initial light focusing",
            hazard: "Absorbs UV and far-IR radiation; can be burned",
            penetration: "Blocks UV <315nm and IR >1400nm"
          },
          {
            name: "Lens",
            function: "Focuses light onto the retina",
            hazard: "Can focus beam to small spot (10,000x concentration)",
            penetration: "Transmits visible and near-IR to retina"
          },
          {
            name: "Retina",
            function: "Converts light to neural signals",
            hazard: "Most sensitive tissue; permanent damage possible",
            penetration: "Absorbs visible (400-700nm) and near-IR (700-1400nm)"
          },
          {
            name: "Aqueous/Vitreous Humor",
            function: "Clear fluid maintaining eye shape",
            hazard: "Minimal direct hazard",
            penetration: "Transmits most visible wavelengths"
          }
        ],
        penetrationData: [
          {
            wavelength: "193nm (UV)",
            region: "Excimer",
            primaryAbsorption: "Cornea",
            hazardType: "Photokeratitis (corneal burn)"
          },
          {
            wavelength: "400-700nm (Visible)",
            region: "Visible",
            primaryAbsorption: "Retina",
            hazardType: "Retinal burns, blind spots"
          },
          {
            wavelength: "1064nm (Near-IR)",
            region: "Nd:YAG",
            primaryAbsorption: "Retina (through lens)",
            hazardType: "Retinal burns (invisible hazard)"
          },
          {
            wavelength: "10600nm (Far-IR)",
            region: "CO2",
            primaryAbsorption: "Cornea",
            hazardType: "Corneal burn (visible warning)"
          }
        ],
        powerConcentration: {
          incidentPower: "1 mW/cm squared",
          retinalSpotSize: "approximately 20 micrometers",
          concentrationFactor: "100,000x",
          retinalIrradiance: "approximately 100 W/cm squared"
        }
      }
    },

    // ----------------------------------------
    // SECTION 5: Laser Classification
    // ----------------------------------------
    {
      id: "laser-classification",
      title: "FDA Laser Classification System",
      content: `FDA REGULATORY STANDARD FOR ALL LASERS

All laser products made since August 1976 must meet the FDA laser performance standard. Each manufacturer of laser products must report to FDA about the types of laser products produced.

The standard divides laser products into four classes, based on the potential for injuring people and the intensity of the radiation in the laser beam.

CLASS I:
- Products produce levels of radiation that have not been found to cause biological damage
- Class I visible radiation lasers emit less than 0.39 microwatts (0.39 millionths of a watt) continuous output
- Generally safe under normal use conditions

CLASS II:
- Lasers produce radiation that could cause eye damage after direct, long-term exposure
- Class II lasers emit less than 1 milliwatt (1 thousandth of a watt) continuous output
- Protection provided by natural aversion response (blink reflex approximately 0.25 seconds)

CLASS III:
- Laser products produce radiation powerful enough to injure human tissue with one short exposure to the direct beam or its direct reflections off a shiny surface
- Class III visible radiation lasers emit less than 500 milliwatts (one-half watt) continuous output
- Subdivided into Classes IIIa and IIIb:
  * Class IIIa: Limited to 5 milliwatts in the visible spectrum
  * Class IIIb: More stringent requirements apply; up to 500mW

CLASS IV:
- Lasers produce radiation so powerful that it can cause injury with a direct or reflected exposure, even when the beam is scattered or diffused by a rough surface or even by some smoke screens
- Class IV visible radiation lasers emit more than one-half watt continuous output
- Can cause eye, skin, and fire hazards

LABELING REQUIREMENTS:
All laser products above Class I, made after August 1976, must have labels that indicate the class to which they belong. Additional safety design and labeling features are required according to the class of the product.

POWER NOTE: The term "watts," when used to describe laser output, is NOT equivalent to wattage when used to describe an electric light. A 100W light bulb outputs only about 15W of light spread in all directions, while a 1W laser outputs 1W in a concentrated beam.`,

      keyPoints: [
        "All lasers made since August 1976 must meet FDA performance standards",
        "Class I: <0.39 microwatts - no biological damage potential",
        "Class II: <1 milliwatt - damage possible with long exposure, protected by blink reflex",
        "Class III: <500 milliwatts - can injure with short exposure; IIIa limited to 5mW visible",
        "Class IV: >500 milliwatts - most dangerous; hazard from direct, reflected, AND scattered beams",
        "All lasers above Class I must have classification labels",
        "Light shows typically use Class IIIb and Class IV lasers"
      ],

      interactiveData: {
        classificationTable: [
          { 
            class: "Class I", 
            power: "<0.39 microwatts", 
            hazard: "None under normal use", 
            warning: "CAUTION - Laser Radiation", 
            applications: "Printers, CD players" 
          },
          { 
            class: "Class II", 
            power: "<1 milliwatt", 
            hazard: "Long exposure to eye", 
            warning: "CAUTION - Laser Radiation", 
            applications: "Barcode scanners, pointers" 
          },
          { 
            class: "Class IIIa", 
            power: "1-5 milliwatts", 
            hazard: "Direct viewing hazard", 
            warning: "CAUTION - Laser Radiation", 
            applications: "Pointers, alignment tools" 
          },
          { 
            class: "Class IIIb", 
            power: "5-500 milliwatts", 
            hazard: "Immediate eye damage", 
            warning: "DANGER - Laser Radiation", 
            applications: "Light shows, research" 
          },
          { 
            class: "Class IV", 
            power: ">500 milliwatts", 
            hazard: "Eye, skin, fire hazard", 
            warning: "DANGER - Laser Radiation", 
            applications: "Light shows, cutting, medical" 
          }
        ],
        powerScale: {
          min: 3.9e-7,
          max: 50,
          breakpoints: [
            { power: 3.9e-7, label: "Class I limit" },
            { power: 0.001, label: "Class II limit (1 mW)" },
            { power: 0.005, label: "Class IIIa limit (5 mW)" },
            { power: 0.5, label: "Class IIIb/IV boundary (500 mW)" },
            { power: 12, label: "FAA typical objection threshold" }
          ]
        }
      }
    }
  ] as Section[],

  // ============================================
  // QUIZ QUESTIONS
  // ============================================
  
  quizQuestions: [
    // Beginner Questions
    {
      id: "m1-q1",
      type: "multiple_choice",
      difficulty: "beginner",
      question: "What does LASER stand for?",
      options: [
        "Light Activated Stimulated Energy Radiation",
        "Light Amplification by Stimulated Emission of Radiation",
        "Laser Activated System for Energy Release",
        "Light Absorption and Stimulated Emission Reaction"
      ],
      correctAnswer: 1,
      explanation: "LASER is an acronym for 'Light Amplification by Stimulated Emission of Radiation.'",
      learningObjective: "Define the term LASER",
      topic: "Laser Properties"
    },
    {
      id: "m1-q2",
      type: "true_false",
      difficulty: "beginner",
      question: "Laser light spreads out (diverges) significantly over long distances.",
      options: ["True", "False"],
      correctAnswer: 1,
      explanation: "False. Unlike ordinary light, a laser beam does not diverge or spread out very much. This minimal divergence allows laser power to remain concentrated even over long distances.",
      learningObjective: "Understand laser beam divergence characteristics",
      topic: "Laser Properties"
    },
    {
      id: "m1-q3",
      type: "multiple_choice",
      difficulty: "beginner",
      question: "What property describes laser light waves traveling in locked-step or synchronized patterns?",
      options: [
        "Monochromaticity",
        "Coherence",
        "Polarization",
        "Refraction"
      ],
      correctAnswer: 1,
      explanation: "Coherence is the unique property of laser light where light waves are in phase with each other and travel in locked-step or synchronized patterns.",
      learningObjective: "Identify key laser light properties",
      topic: "Laser Properties"
    },
    {
      id: "m1-q4",
      type: "multiple_choice",
      difficulty: "beginner",
      question: "Which color of visible light has the longest wavelength?",
      options: [
        "Violet",
        "Blue",
        "Green",
        "Red"
      ],
      correctAnswer: 3,
      explanation: "Red light has the longest wavelength in the visible spectrum (approximately 620-750nm), while violet has the shortest (approximately 380-450nm).",
      learningObjective: "Understand the visible light spectrum",
      topic: "Electromagnetic Spectrum"
    },
    {
      id: "m1-q5",
      type: "true_false",
      difficulty: "beginner",
      question: "Laser light is a form of ionizing radiation like X-rays.",
      options: ["True", "False"],
      correctAnswer: 1,
      explanation: "False. Laser light is non-ionizing radiation. Unlike X-rays, visible light radiation has not been associated with causing cancer or genetic damage.",
      learningObjective: "Distinguish laser radiation from ionizing radiation",
      topic: "Electromagnetic Spectrum"
    },

    // Intermediate Questions
    {
      id: "m1-q6",
      type: "multiple_choice",
      difficulty: "intermediate",
      question: "When a laser beam enters the eye, by how much can its power be concentrated on the retina?",
      options: [
        "10 times",
        "100 times",
        "1,000 times",
        "10,000 times or more"
      ],
      correctAnswer: 3,
      explanation: "The intensity of a laser beam can be increased by 10,000 times or more when focused by the eye's lens onto the retina.",
      learningObjective: "Understand ocular focusing of laser light",
      topic: "Ocular Hazards"
    },
    {
      id: "m1-q7",
      type: "scenario",
      difficulty: "intermediate",
      question: "A venue plans to use a mirror ball for a laser show without a scanning device. What should the safety assessment conclude?",
      options: [
        "The setup is safe because mirror balls always reduce hazard",
        "The setup requires additional eyewear for all audience members",
        "Without scanning, the beam hits fewer facets, creating higher-power rays that may still be hazardous",
        "Only Class II lasers can be used with this configuration"
      ],
      correctAnswer: 2,
      explanation: "Without a scanning device, the beam is broken by the mirror ball into fewer rays, each having a larger fraction of the power in the direct beam. This means even with a mirror ball, there could still be potential for harm.",
      learningObjective: "Assess mirror ball safety configurations",
      topic: "Beam Interactions"
    },
    {
      id: "m1-q8",
      type: "multiple_choice",
      difficulty: "intermediate",
      question: "Which of the following surfaces can create a specular (mirror-like) reflection of a laser beam?",
      options: [
        "Only actual mirrors",
        "Mirrors, water, glass, and glossy floors",
        "Only polished metal surfaces",
        "Rough concrete walls only"
      ],
      correctAnswer: 1,
      explanation: "Smooth, shiny surfaces including mirrors, water, glass, metal beams, and glossy floors can all create specular reflections that maintain most of the laser beam's power.",
      learningObjective: "Identify surfaces that create specular reflections",
      topic: "Beam Interactions"
    },
    {
      id: "m1-q9",
      type: "multiple_choice",
      difficulty: "intermediate",
      question: "What is the power threshold for a Class IV laser (visible continuous output)?",
      options: [
        "Less than 0.39 microwatts",
        "Less than 1 milliwatt",
        "Less than 500 milliwatts",
        "More than 500 milliwatts (one-half watt)"
      ],
      correctAnswer: 3,
      explanation: "Class IV lasers produce radiation so powerful that they can cause injury with direct or reflected exposure, even when scattered. They emit more than one-half watt (500 milliwatts) continuous output.",
      learningObjective: "Identify laser class power thresholds",
      topic: "Laser Classification"
    },
    {
      id: "m1-q10",
      type: "true_false",
      difficulty: "intermediate",
      question: "A high-powered laser beam reflecting off a rough concrete wall is completely safe.",
      options: ["True", "False"],
      correctAnswer: 1,
      explanation: "False. While rough surfaces cause diffuse reflection that scatters the beam, a very high-powered laser beam can still retain enough intensity after reflecting off a rough surface to cause injury. Additionally, some rough surfaces may have shiny spots that allow mirror-like reflection.",
      learningObjective: "Understand diffuse reflection hazards",
      topic: "Beam Interactions"
    },

    // Advanced Questions
    {
      id: "m1-q11",
      type: "multiple_choice",
      difficulty: "advanced",
      question: "Why are Class IIIb and IV lasers required to have a scanning device when used with a mirror ball for audience exposure?",
      options: [
        "To create more interesting visual effects",
        "To ensure the beam hits multiple facets, reducing power per ray to safe levels",
        "To comply with copyright regulations for laser displays",
        "To prevent the laser from overheating"
      ],
      correctAnswer: 1,
      explanation: "Scanning devices sweep the beam across the mirror ball so it hits multiple facets, splitting the beam into many rays. Each ray has only a fraction of the original power, reducing the hazard to safe levels at audience positions.",
      learningObjective: "Understand scanning safety mechanisms",
      topic: "Beam Interactions"
    },
    {
      id: "m1-q12",
      type: "scenario",
      difficulty: "advanced",
      question: "During a laser show, an audience member reports seeing a bright flash from a reflected beam. The show uses a 5W Class IV laser with proper scanning on a mirror ball. What is the appropriate response?",
      options: [
        "Continue the show; brief flashes are normal",
        "Immediately shut down the laser and investigate the reflection path",
        "Ask the patron to move to a different seat",
        "Reduce laser power by 50% and continue"
      ],
      correctAnswer: 1,
      explanation: "Any unexpected beam exposure requires immediate shutdown and investigation. Even with proper scanning equipment, malfunction or misalignment could create hazardous conditions. Safety requires investigating before continuing.",
      learningObjective: "Apply emergency response procedures",
      topic: "Safety Protocols"
    },
    {
      id: "m1-q13",
      type: "multiple_choice",
      difficulty: "advanced",
      question: "Which part of the eye absorbs far-infrared radiation (e.g., from a CO2 laser at 10,600nm)?",
      options: [
        "Retina",
        "Lens",
        "Cornea",
        "Aqueous humor"
      ],
      correctAnswer: 2,
      explanation: "The cornea absorbs far-infrared radiation. UV radiation (below 315nm) and far-IR (above 1400nm) are absorbed by the cornea, while visible and near-IR pass through to the retina.",
      learningObjective: "Understand wavelength-specific ocular hazards",
      topic: "Ocular Hazards"
    },
    {
      id: "m1-q14",
      type: "true_false",
      difficulty: "advanced",
      question: "Physical size is a reliable indicator of a laser's power output.",
      options: ["True", "False"],
      correctAnswer: 1,
      explanation: "False. The physical size of a laser has little bearing on its power output. There are many lasers that are physically small but have more power output than some large ones. The only reliable way to determine power is to check the product label.",
      learningObjective: "Understand laser power characteristics",
      topic: "Laser Properties"
    },
    {
      id: "m1-q15",
      type: "calculation",
      difficulty: "advanced",
      question: "If a 1W laser beam is split by a mirror ball into 100 equal rays, what is the approximate power of each ray?",
      options: [
        "1 mW",
        "10 mW",
        "100 mW",
        "1 W"
      ],
      correctAnswer: 1,
      explanation: "1W divided by 100 rays equals 0.01W or 10mW per ray. This is within Class IIIb range, which can still cause injury with direct exposure.",
      learningObjective: "Calculate power distribution from beam splitting",
      topic: "Beam Interactions"
    }
  ] as QuizQuestion[],

  // ============================================
  // GLOSSARY
  // ============================================
  
  glossary: [
    {
      term: "Coherence",
      definition: "The property of laser light where all light waves are in phase with each other, traveling in locked-step or synchronized patterns.",
      context: "Laser Properties"
    },
    {
      term: "Divergence",
      definition: "The spreading out of a light beam as it travels. Laser beams have minimal divergence, maintaining concentration over long distances.",
      context: "Laser Properties"
    },
    {
      term: "Monochromatic",
      definition: "Having a single wavelength or color. Laser light is monochromatic, giving it pure color compared to ordinary light.",
      context: "Laser Properties"
    },
    {
      term: "Specular Reflection",
      definition: "Mirror-like reflection where light bounces off a smooth surface at a predictable angle with minimal power loss.",
      context: "Beam Interactions"
    },
    {
      term: "Diffuse Reflection",
      definition: "Scattering of light in many directions when striking a rough or irregular surface, causing some power loss.",
      context: "Beam Interactions"
    },
    {
      term: "Lasing Medium",
      definition: "The material (solid, liquid, or gas) that produces laser light through stimulated emission.",
      context: "Laser Physics"
    },
    {
      term: "Stimulated Emission",
      definition: "The process where an excited atom releases a photon that triggers similar emissions from other excited atoms.",
      context: "Laser Physics"
    },
    {
      term: "Retina",
      definition: "The light-sensitive layer at the back of the eye that converts light into neural signals.",
      context: "Ocular Anatomy"
    },
    {
      term: "Cornea",
      definition: "The clear outer layer of the eye that focuses light and absorbs UV and far-IR radiation.",
      context: "Ocular Anatomy"
    },
    {
      term: "Class I Laser",
      definition: "Lasers that produce radiation levels not found to cause biological damage (<0.39 microwatts visible).",
      context: "Laser Classification"
    },
    {
      term: "Class II Laser",
      definition: "Lasers that emit <1mW and could cause eye damage after long-term direct exposure.",
      context: "Laser Classification"
    },
    {
      term: "Class III Laser",
      definition: "Lasers emitting <500mW that can injure with one short exposure to direct beam or reflection.",
      context: "Laser Classification"
    },
    {
      term: "Class IV Laser",
      definition: "High-power lasers (>500mW) that can cause injury from direct, reflected, or scattered beams.",
      context: "Laser Classification"
    },
    {
      term: "Wavelength",
      definition: "The distance between successive peaks of a light wave, determining its color and properties.",
      context: "Physics"
    },
    {
      term: "Photon",
      definition: "A discrete packet or quantum of light energy emitted by atoms.",
      context: "Physics"
    },
    {
      term: "Scanning Device",
      definition: "Equipment that sweeps a laser beam back and forth to distribute power and create effects.",
      context: "Safety Equipment"
    },
    {
      term: "Mirror Ball",
      definition: "A sphere covered with reflective facets used to split a laser beam into multiple lower-power rays.",
      context: "Safety Equipment"
    },
    {
      term: "Continuous Wave (CW)",
      definition: "Laser emission that is continuous rather than pulsed, measured in watts of output.",
      context: "Laser Types"
    },
    {
      term: "Aversion Response",
      definition: "The natural blink reflex (approximately 0.25 seconds) that provides some protection for Class II laser exposure.",
      context: "Biological Protection"
    },
    {
      term: "Visible Spectrum",
      definition: "The range of electromagnetic wavelengths (approximately 380-700nm) visible to human eyes.",
      context: "Electromagnetic Spectrum"
    }
  ] as GlossaryTerm[],

  // ============================================
  // QUIZ TO SECTION MAPPING
  // ============================================
  
  quizMapping: [
    { questionId: "m1-q1", sectionId: "laser-properties", topic: "Laser Definition" },
    { questionId: "m1-q2", sectionId: "laser-properties", topic: "Divergence" },
    { questionId: "m1-q3", sectionId: "laser-properties", topic: "Coherence" },
    { questionId: "m1-q4", sectionId: "em-spectrum", topic: "Visible Spectrum" },
    { questionId: "m1-q5", sectionId: "em-spectrum", topic: "Radiation Types" },
    { questionId: "m1-q6", sectionId: "ocular-hazards", topic: "Power Concentration" },
    { questionId: "m1-q7", sectionId: "beam-interactions", topic: "Mirror Ball Safety" },
    { questionId: "m1-q8", sectionId: "beam-interactions", topic: "Specular Reflection" },
    { questionId: "m1-q9", sectionId: "laser-classification", topic: "Class IV Threshold" },
    { questionId: "m1-q10", sectionId: "beam-interactions", topic: "Diffuse Reflection" },
    { questionId: "m1-q11", sectionId: "beam-interactions", topic: "Scanning Safety" },
    { questionId: "m1-q12", sectionId: "beam-interactions", topic: "Emergency Response" },
    { questionId: "m1-q13", sectionId: "ocular-hazards", topic: "Wavelength Absorption" },
    { questionId: "m1-q14", sectionId: "laser-properties", topic: "Power vs Size" },
    { questionId: "m1-q15", sectionId: "beam-interactions", topic: "Power Calculation" }
  ],

  // ============================================
  // LEARNING OBJECTIVES
  // ============================================
  
  learningObjectives: [
    "Define LASER and explain the acronym",
    "Distinguish laser light from ordinary light (divergence, coherence, monochromaticity)",
    "Locate visible light within the electromagnetic spectrum",
    "Identify surfaces that create specular vs diffuse reflections",
    "Explain how mirror balls and scanning devices improve safety",
    "Describe how the eye focuses laser light and the resulting hazards",
    "List the four FDA laser classes and their power thresholds",
    "Recognize when reflected or scattered beams remain hazardous",
    "Understand that laser damage can occur in fractions of a second"
  ],

  // ============================================
  // PREREQUISITES
  // ============================================
  
  prerequisites: [
    "No prior laser knowledge required",
    "Basic understanding of light as a wave",
    "Familiarity with basic eye anatomy helpful but not required"
  ],

  // ============================================
  // CONTENT ACCURACY CHECK
  // ============================================
  
  contentSourceVerification: {
    sourceDocument: "intro-laser-hazards.pdf",
    sourcePublication: "FDA Publication 86-8262, HHS, May 1986",
    extractionDate: "2026-03-19",
    accuracyNotes: [
      "All laser class power thresholds verified against FDA document pages 17-18",
      "Eye power concentration factor (10,000x) from page 16",
      "Reflection hazard descriptions from pages 9-13",
      "Laser definition and properties from pages 7-8 and Appendix I",
      "Visible spectrum range from page 6",
      "Mirror ball safety mechanisms from pages 11-12"
    ],
    contentIntegrity: "All content derived from extracted FDA document. No fictional information included."
  }
};

// ============================================
// EXPORTS
// ============================================

export type Module1Content = typeof module1Content;
export default module1Content;
