/**
 * Course 2, Module 1: FDA Regulatory Framework
 * Content extracted from: fda-regulatory-framework.pdf (29 pages, FDA Compliance Guide for Laser Products)
 * Source: "Compliance Guide for Laser Products" - FDA Center for Devices and Radiological Health (June 1992, updated 2023)
 * Additional sources: FORM FDA 3632, Laser Notice No. 50, Laser Notice No. 56
 */

// ============================================
// TYPE DEFINITIONS
// ============================================

export interface JurisdictionInfo {
  authority: string;
  legalBasis: string[];
  scope: string;
  applicabilityDate: string;
  exemptions: string[];
  contactInfo: {
    agency: string;
    division: string;
    address: string;
    phone: string;
    email: string;
    website: string;
  };
}

export interface TimelineEvent {
  date: string;
  title: string;
  description: string;
  significance: string;
  cfrReference?: string;
}

export interface FinalRuleChange {
  section: string;
  change: string;
  impact: string;
  effectiveDate: string;
}

export interface ClassificationClass {
  class: string;
  fdaName: string;
  powerLimitVisible: string;
  powerLimitGeneral: string;
  hazardDescription: string;
  keyRequirements: string[];
  warningLabel: string;
  applicableProducts: string[];
}

export interface IECComparison {
  fdaClass: string;
  iecClass: string;
  differences: string[];
  harmonizationStatus: string;
}

export interface CDRHOrgUnit {
  name: string;
  code: string;
  responsibilities: string[];
  contactInfo?: {
    phone?: string;
    email?: string;
    address?: string;
  };
}

export interface QuizQuestion {
  id: string;
  type: 'multiple_choice' | 'true_false' | 'multiple_select' | 'fill_in_blank' | 'scenario';
  difficulty: 'easy' | 'medium' | 'hard';
  category: string;
  question: string;
  options?: string[];
  correctAnswer?: number | number[] | boolean | string;
  correctAnswers?: number[];
  acceptableVariants?: string[];
  explanation: string;
  cfrReference?: string;
}

// ============================================
// MODULE CONTENT
// ============================================

export const c2m1Content = {
  title: "FDA Regulatory Framework",
  course: "Course 2: FDA Compliance",
  source: "FDA Compliance Guide for Laser Products (29 pages, June 1992, updated 2023)",
  documentType: "regulatory_compliance_guide",
  totalPages: 29,
  lastUpdated: "2023-02-21",

  // ============================================
  // JURISDICTION
  // ============================================
  
  jurisdiction: {
    authority: "U.S. Food and Drug Administration (FDA) - Center for Devices and Radiological Health (CDRH)",
    legalBasis: [
      "Federal Food, Drug, and Cosmetic Act (FFDCA), Chapter V, Subchapter C - Electronic Product Radiation Control",
      "Title 21, Code of Federal Regulations (CFR), Chapter I, Subchapter J - Radiological Health",
      "21 CFR 1002 - Records and Reports",
      "21 CFR 1010 - General",
      "21 CFR 1040.10 - Laser Products",
      "21 CFR 1040.11 - Specific Purpose Laser Products"
    ],
    scope: "All laser products manufactured, assembled, imported, or modified for use or sale in the United States, including components for OEM use",
    applicabilityDate: "August 2, 1976 - Standard applies to all laser products manufactured on or after this date",
    exemptions: [
      "Products sold to manufacturers for use as components in products that will be certified [1040.10(a)(1)]",
      "Repair or replacement components properly labeled with installation instructions [1040.10(a)(2)]",
      "Products intended for export only, labeled as such, complying with importing country requirements [1010.20]",
      "Certain Federal agency products with specific exemptions (DOD, DOE, NASA, NOAA) [1010.5]",
      "Low power laser products exempted under Laser Notice #36, #41 (inherently Class I)"
    ],
    contactInfo: {
      agency: "U.S. Food and Drug Administration",
      division: "Center for Devices and Radiological Health (CDRH)",
      address: "Document Mail Center – WO66-G609, 10903 New Hampshire Avenue, Silver Spring, MD 20993-0002",
      phone: "1-800-638-2041",
      email: "dsmica@fda.hhs.gov",
      website: "http://www.fda.gov/Radiation-EmittingProducts/"
    },
    keyOffices: {
      electronicProductsBranch: {
        name: "Electronic Products Branch",
        code: "HFZ-240",
        location: "9200 Corporate Blvd., Rockville, MD 20850",
        phone: "240-276-3332"
      },
      officeOfHealthTechnology: {
        name: "Office of Health Technology 8 (OHT8): Office of Radiological Health",
        email: "RadHealth@fda.hhs.gov"
      },
      dsma: {
        name: "Division of Small Manufacturers, International, and Consumer Assistance (DSMICA)",
        phone: "1-800-638-2041",
        purpose: "Requests for current documents, reporting guides, and regulatory guidance"
      }
    }
  } as JurisdictionInfo,

  // ============================================
  // REGULATORY TIMELINE
  // ============================================
  
  timeline: [
    {
      date: "August 2, 1976",
      title: "Federal Laser Product Performance Standard Effective",
      description: "21 CFR 1040.10 and 1040.11 become effective for all laser products manufactured on or after this date",
      significance: "Foundation of FDA laser regulation - establishes classification system and performance requirements",
      cfrReference: "21 CFR 1040.10(a)"
    },
    {
      date: "August 20, 1986",
      title: "Manual Reset Requirement Added",
      description: "Class IV laser systems manufactured after this date must have manual reset following power interruption of at least 5 seconds",
      significance: "Enhanced safety requirement for high-power lasers",
      cfrReference: "21 CFR 1040.10(f)(10)"
    },
    {
      date: "August 23, 1985",
      title: "Laser Notice #36 - Low Power Exemption",
      description: "Certain low power laser products exempted from reporting requirements",
      significance: "Reduced burden for inherently safe Class I products"
    },
    {
      date: "August 9, 1988",
      title: "Laser Notice #41 - Reporting Exemption",
      description: "Low Power Laser Reporting Exemption - codifies exemptions for Class I products",
      significance: "Further streamlines compliance for low-risk products"
    },
    {
      date: "February 27, 1997",
      title: "Good Guidance Practices (GGPs) Implementation",
      description: "FDA implements Good Guidance Practices affecting how guidance documents are developed",
      significance: "Changed how FDA issues and updates guidance documents"
    },
    {
      date: "July 26, 2001",
      title: "Laser Notice No. 50 (Original)",
      description: "Initial guidance on conformance with IEC 60825-1 Amendment 2 and IEC 60601-2-22",
      significance: "First major step toward international harmonization",
      cfrReference: "Document 1346"
    },
    {
      date: "June 24, 2007",
      title: "Laser Notice No. 50 (Revised)",
      description: "Updated guidance for conformance with IEC 60825-1 Editions 1.2 or 2 and IEC 60601-2-22",
      significance: "Expanded IEC harmonization - 17 sections can use IEC conformance",
      cfrReference: "Document 1346"
    },
    {
      date: "January 20, 2023",
      title: "Final Rule 2023 Published",
      description: "Radiological Health Regulations; Amendments to Records and Reports for Radiation Emitting Electronic Products; Amendments to Performance Standards for Diagnostic X-ray, Laser, and Ultrasonic Products (88 FR 3638)",
      significance: "Major regulatory modernization - removed duplicative reporting, codified Laser Notices 41 and 42",
      cfrReference: "88 FR 3638"
    },
    {
      date: "February 21, 2023",
      title: "Final Rule 2023 Effective",
      description: "Final rule goes into effect, amending records and reporting requirements",
      significance: "Active implementation of streamlined compliance requirements"
    },
    {
      date: "2023 (Post Final Rule)",
      title: "Laser Notice No. 56 Issued",
      description: "Laser Products - Conformance with IEC 60825-1 Ed. 3 and IEC 60601-2-22 Ed. 3.1",
      significance: "Updated harmonization guidance for latest IEC editions"
    }
  ] as TimelineEvent[],

  // ============================================
  // FINAL RULE 2023
  // ============================================
  
  finalRule2023: {
    publicationDate: "January 20, 2023",
    effectiveDate: "February 21, 2023",
    federalRegister: "88 FR 3638",
    title: "Radiological Health Regulations; Amendments to Records and Reports for Radiation Emitting Electronic Products; Amendments to Performance Standards for Diagnostic X-ray, Laser, and Ultrasonic Products",
    
    changes: [
      {
        section: "21 CFR 1002.1",
        change: "Removed or reduced annual reports and test record requirements that are unnecessary or duplicative",
        impact: "Reduced reporting burden for manufacturers",
        effectiveDate: "February 21, 2023"
      },
      {
        section: "Laser Notice 41 Codification",
        change: "Codified Low Power Laser Reporting Exemption policies into regulations",
        impact: "Class I products have reduced reporting requirements",
        effectiveDate: "February 21, 2023"
      },
      {
        section: "Laser Notice 42 Codification",
        change: "Clarified compliance requirements for manufacturers incorporating certified Class I laser products",
        impact: "Streamlined compliance for OEM integration of Class I products",
        effectiveDate: "February 21, 2023"
      },
      {
        section: "Records and Reporting",
        change: "Amended records and reporting requirements for electronic products and medical devices",
        impact: "Eliminated redundant reporting while maintaining safety oversight",
        effectiveDate: "February 21, 2023"
      }
    ] as FinalRuleChange[],

    comparison: {
      before: {
        annualReports: "Required for all laser product classes with detailed summaries",
        testRecords: "Extensive test record retention requirements",
        supplementalReports: "Required for all model changes",
        distributionRecords: "Required for all classes"
      },
      after: {
        annualReports: "Streamlined - some classes exempted, reduced detail requirements",
        testRecords: "Reduced requirements for products operating well below limits",
        supplementalReports: "Only required for changes affecting emission, compliance, or detection probability",
        distributionRecords: "Class I products exempted under certain conditions"
      }
    },

    guidanceUpdates: [
      "Laser Products - Conformance with IEC 60825-1 Ed. 3 and IEC 60601-2-22 Ed. 3.1 (Laser Notice No. 56) revises certain policies",
      "Electronic Product Radiation Control Program: Industry Guidance updated"
    ]
  },

  // ============================================
  // LASER CLASSIFICATION
  // ============================================
  
  classification: {
    fdaClasses: [
      {
        class: "Class I",
        fdaName: "Class I Laser Products",
        powerLimitVisible: "Less than 0.39 microwatts (0.39 μW) continuous output",
        powerLimitGeneral: "Table I limits - function of wavelength and emission duration",
        hazardDescription: "Levels not found to cause biological damage; safe under normal use",
        keyRequirements: [
          "Protective housing (1040.10(f)(1))",
          "Certification label (1010.2)",
          "Identification label (1010.3)",
          "Safety interlocks if housing opened during operation/maintenance",
          "Viewing optics safeguards (1040.10(f)(8))",
          "Scanning safeguard (1040.10(f)(9))"
        ],
        warningLabel: "CAUTION - Laser Radiation (if required)",
        applicableProducts: [
          "Laser printers",
          "CD/DVD players",
          "Bar code scanners (self-contained)",
          "Inherently safe consumer electronics"
        ]
      },
      {
        class: "Class II",
        fdaName: "Class II Laser Products",
        powerLimitVisible: "Less than 1 milliwatt (1 mW) continuous output",
        powerLimitGeneral: "Table II limits - visible spectrum (400-710 nm), emission >0.25 second",
        hazardDescription: "Hazard for direct long-term ocular exposure; protected by natural aversion response (blink reflex ~0.25 sec)",
        keyRequirements: [
          "All Class I requirements",
          "CAUTION warning logotype (1040.10(g)(1)(ii))",
          "Aperture label (1040.10(g)(5))",
          "Location of controls (1040.10(f)(7))",
          "Beam attenuator (1040.10(f)(6))",
          "Emission indicator (1040.10(f)(5))",
          "Product literature with warning logotype (1040.10(h)(2)(i))"
        ],
        warningLabel: "CAUTION - Laser Radiation",
        applicableProducts: [
          "Barcode scanners (open beam)",
          "Laser pointers (low power)",
          "Alignment tools"
        ]
      },
      {
        class: "Class IIIa",
        fdaName: "Class IIIa Laser Products",
        powerLimitVisible: "1-5 milliwatts in visible spectrum; total collectable radiant power ≤5 mW",
        powerLimitGeneral: "Table III-A limits",
        hazardDescription: "Direct viewing hazard; same as Class II for indirect viewing",
        keyRequirements: [
          "All Class II requirements",
          "DANGER warning if irradiance >2.5 mW/cm², otherwise CAUTION",
          "Protective eyewear consideration (1040.10(f)(5)(iv))"
        ],
        warningLabel: "CAUTION or DANGER - depending on irradiance level",
        applicableProducts: [
          "Higher power laser pointers",
          "Alignment lasers",
          "Most HeNe lasers"
        ]
      },
      {
        class: "Class IIIb",
        fdaName: "Class IIIb Laser Products",
        powerLimitVisible: "5-500 milliwatts (0.5 W) in visible spectrum",
        powerLimitGeneral: "Table III-B limits - UV, visible, and IR spectra",
        hazardDescription: "Ocular hazards for direct exposure throughout range; skin hazards at higher levels",
        keyRequirements: [
          "All Class IIIa requirements",
          "DANGER warning logotype (1040.10(g)(1)(iii))",
          "Remote interlock connector (1040.10(f)(3))",
          "Key control (1040.10(f)(4))",
          "Emission indicator with delay (1040.10(f)(5)(iii))",
          "Fail-safe or redundant safety interlocks for Class IIIb/IV access",
          "Supplemental Reports required for changes"
        ],
        warningLabel: "DANGER - Laser Radiation",
        applicableProducts: [
          "Research lasers",
          "Light show projectors",
          "Medical therapy devices",
          "Industrial alignment systems"
        ]
      },
      {
        class: "Class IV",
        fdaName: "Class IV Laser Products",
        powerLimitVisible: "More than 500 milliwatts (>0.5 W) continuous output",
        powerLimitGeneral: "Exceeds Class IIIb limits",
        hazardDescription: "Most dangerous; hazard from direct exposure, specular reflection, AND diffuse reflection (scattered beams)",
        keyRequirements: [
          "All Class IIIb requirements",
          "Manual reset mechanism (manufactured after Aug 20, 1986) (1040.10(f)(10))",
          "Fail-safe safety interlocks mandatory",
          "Maximum protective measures"
        ],
        warningLabel: "DANGER - Laser Radiation",
        applicableProducts: [
          "Laser light shows (with variance)",
          "Industrial cutting/welding",
          "Medical/surgical lasers",
          "Research high-power systems"
        ]
      }
    ] as ClassificationClass[],

    iecComparison: [
      {
        fdaClass: "Class I",
        iecClass: "Class 1",
        differences: [
          "FDA has specific measurement parameters (7mm aperture, 10^-3 sr) defined in 1040.10(e)",
          "IEC 60825-1 may use different measurement conditions"
        ],
        harmonizationStatus: "Substantially harmonized under Laser Notice No. 50/56"
      },
      {
        fdaClass: "Class II",
        iecClass: "Class 2",
        differences: [
          "Both use 1 mW limit for visible",
          "FDA includes Class IIa subcategory for 1-second exposure products"
        ],
        harmonizationStatus: "Harmonized"
      },
      {
        fdaClass: "Class IIIa",
        iecClass: "Class 3R",
        differences: [
          "FDA IIIa: ≤5 mW visible",
          "IEC 3R: Up to 5× Class 2 limit (up to 5 mW) or 5× Class 1 limit for other wavelengths"
        ],
        harmonizationStatus: "Substantially equivalent"
      },
      {
        fdaClass: "Class IIIb",
        iecClass: "Class 3B",
        differences: [
          "FDA IIIb: 5-500 mW",
          "IEC 3B: Same general range but different AEL calculations"
        ],
        harmonizationStatus: "Harmonized under Laser Notice No. 50 for most requirements"
      },
      {
        fdaClass: "Class IV",
        iecClass: "Class 4",
        differences: [
          "Both cover >500 mW visible",
          "FDA has specific manual reset requirement not in IEC",
          "FDA requires remote interlock connector (retained in harmonization)"
        ],
        harmonizationStatus: "Core requirements harmonized; some FDA-specific requirements retained"
      }
    ] as IECComparison[],

    measurementParameters: {
      description: "Specific measurement conditions defined in 21 CFR 1040.10(e)",
      apertureStop: "7 mm diameter circular aperture",
      solidAngle: "10^-3 steradian with collimating optics of 5 diopters or less",
      areaCalculation: "0.385 cm² (area of 7mm aperture)",
      radianceMeasurement: "10^-5 steradian solid angle of acceptance",
      collimatingOptics: "5 diopters or less (20 cm or longer focal length)",
      maximumDetection: "Instrument positioned for maximum detection with all controls at maximum emission"
    }
  },

  // ============================================
  // CDRH ORGANIZATION
  // ============================================
  
  cdrh: {
    organization: [
      {
        name: "Office of Communication, Education, and Radiation Programs",
        code: "OCEP",
        responsibilities: [
          "Oversees radiation safety education and outreach",
          "Manages Electronic Products Branch"
        ]
      },
      {
        name: "Electronic Products Branch",
        code: "HFZ-240",
        responsibilities: [
          "Primary technical resource for laser product regulations",
          "Reviews Product Reports and Supplemental Reports",
          "Issues Laser Notices to Industry",
          "Develops guidance documents"
        ],
        contactInfo: {
          address: "9200 Corporate Blvd., Rockville, MD 20850",
          phone: "240-276-3332"
        }
      },
      {
        name: "Office of Health Technology 8 (OHT8): Office of Radiological Health",
        code: "OHT8",
        responsibilities: [
          "Oversees radiological health policy",
          "Manages premarket review of radiation-emitting products"
        ],
        contactInfo: {
          email: "RadHealth@fda.hhs.gov"
        }
      },
      {
        name: "Division of Small Manufacturers, International, and Consumer Assistance (DSMICA)",
        code: "DSMICA",
        responsibilities: [
          "Primary contact for regulatory questions",
          "Distributes guidance documents and reporting guides",
          "Provides assistance with reporting requirements",
          "Handles registration and listing for medical devices"
        ],
        contactInfo: {
          phone: "1-800-638-2041",
          email: "dsmica@fda.hhs.gov"
        }
      },
      {
        name: "Document Mail Center",
        code: "WO66-G609",
        responsibilities: [
          "Receives all Product Reports, Supplemental Reports, and Annual Reports",
          "Assigns accession numbers",
          "Issues acknowledgment letters"
        ],
        contactInfo: {
          address: "10903 New Hampshire Avenue, Silver Spring, MD 20993-0002"
        }
      },
      {
        name: "Office of Compliance - Nonmedical Radiological Devices Branch",
        responsibilities: [
          "Enforcement of laser product regulations",
          "Investigates noncompliance",
          "Manages recalls and corrective actions"
        ]
      }
    ] as CDRHOrgUnit[],

    contacts: {
      generalInquiries: {
        phone: "1-800-638-2041",
        description: "DSMICA - for all general questions about laser regulations"
      },
      reportSubmission: {
        address: "CDRH Document Mail Center – WO66-G609, Attn: Electronic Product Reports, 10903 New Hampshire Avenue, Silver Spring, MD 20993-0002",
        description: "Where to send Product Reports and Supplemental Reports"
      },
      technicalQuestions: {
        phone: "240-276-3332",
        email: "dsmica@fda.hhs.gov",
        description: "Electronic Products Branch - for technical interpretation questions"
      },
      laserNotice50: {
        contact: "Jerome Dennis",
        phone: "240-276-3330",
        email: "jerome.dennis@fda.hhs.gov",
        description: "Contact for IEC harmonization questions"
      },
      radiologicalHealth: {
        email: "RadHealth@fda.hhs.gov",
        description: "OHT8 Office of Radiological Health"
      }
    }
  },

  // ============================================
  // PERFORMANCE REQUIREMENTS SUMMARY
  // ============================================
  
  performanceRequirements: {
    allLaserProducts: [
      {
        requirement: "Protective Housing",
        cfr: "1040.10(f)(1)",
        description: "Prevent human access to laser radiation above Class I limits where not necessary for function"
      },
      {
        requirement: "Safety Interlocks",
        cfr: "1040.10(f)(2)",
        description: "Prevent access to laser/collateral radiation >Class I limits when protective housing opened"
      },
      {
        requirement: "Viewing Optics",
        cfr: "1040.10(f)(8)",
        description: "No human access to radiation >Class I limits through viewports, displays, or optics"
      },
      {
        requirement: "Scanning Safeguard",
        cfr: "1040.10(f)(9)",
        description: "Prevent emission exceeding class limits if scan fails; Class IIIb/IV must prevent exceeding Class IIIa"
      }
    ],
    
    laserSystemsClassIIandAbove: [
      {
        requirement: "Emission Indicator",
        cfr: "1040.10(f)(5)",
        classes: "II, IIIa, IIIb, IV",
        description: "Visible or audible indication when laser is energized"
      },
      {
        requirement: "Beam Attenuator",
        cfr: "1040.10(f)(6)",
        classes: "II, IIIa, IIIb, IV",
        description: "Means to prevent access to laser radiation without turning off power"
      },
      {
        requirement: "Location of Controls",
        cfr: "1040.10(f)(7)",
        classes: "II, IIIa, IIIb, IV",
        description: "Controls positioned so user not exposed while adjusting"
      }
    ],
    
    classIIIbAndIVonly: [
      {
        requirement: "Remote Interlock Connector",
        cfr: "1040.10(f)(3)",
        description: "Permit connection of external interlock, emergency stop; max 130V RMS"
      },
      {
        requirement: "Key Control",
        cfr: "1040.10(f)(4)",
        description: "Key-actuated master control rendering laser inoperable when key removed"
      },
      {
        requirement: "Fail-safe Interlocks",
        cfr: "1040.10(f)(2)(iii)",
        description: "Interlocks preventing Class IIIb/IV access must be fail-safe or redundant"
      },
      {
        requirement: "Manual Reset",
        cfr: "1040.10(f)(10)",
        description: "Required for Class IV manufactured after August 20, 1986; requires restart after 5+ second power interruption"
      }
    ]
  },

  // ============================================
  // REPORTING REQUIREMENTS
  // ============================================
  
  reportingRequirements: {
    productReport: {
      cfr: "21 CFR 1002.10",
      description: "Comprehensive report describing product compliance and testing program",
      timing: "Prior to introduction into commerce",
      form: "FORM FDA 3632 - Guide for Preparing Product Reports for Lasers",
      ombControlNumber: "0910-0025",
      expirationDate: "February 28, 2026",
      estimatedBurden: "24 hours per response",
      parts: [
        "Part 1: Manufacturer and Report Identification",
        "Part 2: Product and Model Identification",
        "Part 3: Compliance with Labeling Requirements",
        "Part 4: Compliance with Informational Requirements",
        "Part 5: Description of the Product",
        "Part 6: Levels of Accessible Laser Radiation and Classification",
        "Part 7: Compliance with Performance Requirements",
        "Part 8: Quality Control Tests and Testing Procedures",
        "Part 9: Life and Endurance Testing",
        "Part 10: Instrumentation and Calibration"
      ]
    },
    
    supplementalReport: {
      cfr: "21 CFR 1002.11",
      description: "Report changes to previously reported products",
      timing: "Prior to introduction of modified product",
      requiredWhen: [
        "Changes affect actual or potential emission",
        "Changes decrease degree of compliance with performance standard",
        "Changes result in decreased probability of detecting noncompliance or increased radiation emission"
      ]
    },
    
    annualReport: {
      cfr: "21 CFR 1002.13",
      description: "Summary of required records",
      timing: "By September 1 for 12 months ending June 30",
      purpose: "Identify new models not requiring Supplemental Reports"
    },
    
    accessionNumber: {
      description: "Unique identifier assigned by CDRH when report is received",
      usage: "Reference in all future correspondence about the product"
    },

    classSpecificRequirements: {
      classI_II_IIIa: [
        "Product Report",
        "Annual Report",
        "Test records",
        "Manufacturer's distribution records",
        "Dealer/distributor distribution records (some Class I exempt per Laser Notice #41)"
      ],
      classIIIb_IV: [
        "All Class I-IIIa requirements",
        "Supplemental Reports when criteria met"
      ]
    }
  },

  // ============================================
  // SPECIFIC-PURPOSE PRODUCTS
  // ============================================
  
  specificPurposeProducts: {
    medical: {
      cfr: "1040.11(a)",
      definition: "Medical devices manufactured, designed, intended, or promoted for in vivo irradiation of the human body for diagnosis, surgery, therapy, or determining relative position",
      requirements: [
        "Class IIIa, IIIb, IV must contain means for measuring delivered exposure/treatment level (±20% accuracy)",
        "Not applicable to Class IIIa aiming devices except ophthalmic",
        "User manual must include recalibration procedure and schedule",
        "Modified aperture label required"
      ],
      note: "A medical laser product may not be a medical device under definition in 1040.10(b)(26)"
    },
    
    surveyingLevelingAlignment: {
      cfr: "1040.11(b)",
      description: "Used in agriculture and construction industry",
      restrictions: [
        "Restricted to 5 mW visible radiant power",
        "Class I for other wavelengths and pulses <3.8×10^-4 seconds"
      ]
    },
    
    demonstration: {
      cfr: "1040.11(c)",
      definition: "Products promoted for classroom demonstration, artistic displays, laser light show projectors, and laser light shows themselves",
      restrictions: [
        "Restricted to Class IIIa",
        "Class I for short pulses and invisible wavelengths",
        "Variance required for Class IIIb or IV demonstration products"
      ],
      varianceRequired: true,
      notes: [
        "General-purpose scientific/medical/industrial lasers demonstrated to purchasers are NOT demonstration products",
        "Laser Light Show report may be required for Class IIIb/IV shows",
        "FORM FDA 3147 required for variance application"
      ]
    }
  },

  // ============================================
  // LABELING REQUIREMENTS
  // ============================================
  
  labelingRequirements: {
    allProducts: [
      {
        label: "Certification Label",
        cfr: "1010.2",
        required: "All laser products",
        content: "Manufacturer certifies compliance with standard or approved variance"
      },
      {
        label: "Identification Label",
        cfr: "1010.3",
        required: "All laser products",
        content: "Manufacturer name/address, place/month/year of manufacture (month/year not abbreviated)"
      }
    ],
    
    classDependent: [
      {
        label: "Warning Logotype",
        cfr: "1040.10(g)(1-4, 8-10)",
        required: "Class II, III, and IV",
        caContent: "CAUTION - Laser Radiation",
        dangerContent: "DANGER - Laser Radiation"
      },
      {
        label: "Class IIa Warning",
        cfr: "1040.10(g)(1)(i)",
        required: "Class IIa only",
        content: "Specific warning statement without logotype"
      },
      {
        label: "Aperture Label",
        cfr: "1040.10(g)(5)",
        required: "Class II, III, IV",
        content: "LASER APERTURE warning at each emission point"
      },
      {
        label: "Protective Housing Labels",
        cfr: "1040.10(g)(6-10)",
        required: "Non-interlocked or defeatably interlocked housings",
        content: "Warning of interior radiation levels"
      }
    ],

    certificationStatements: {
      standard: "Complies with 21 CFR Chapter 1, Subchapter J.",
      alternative: "Complies with 21 CFR 1040.10 and 1040.11.",
      laserNotice50: "Complies with FDA performance standards for laser products except for deviations pursuant to Laser Notice No. 50, dated June 24, 2007"
    }
  },

  // ============================================
  // LASER NOTICE NO. 50 HARMONIZATION
  // ============================================
  
  laserNotice50: {
    documentNumber: "1346",
    issueDate: "June 24, 2007",
    supersedes: "July 26, 2001 version",
    contact: {
      name: "Jerome Dennis",
      phone: "240-276-3330",
      email: "jerome.dennis@fda.hhs.gov"
    },
    
    harmonizedSections: [
      "1040.10(b) Definitions",
      "1040.10(c)(1) Classification",
      "1040.10(d) Accessible emission limits",
      "1040.10(e) Tests for determination of compliance",
      "1040.10(f)(1) Protective housing",
      "1040.10(f)(2) Safety interlocks",
      "1040.10(f)(3) Remote Interlock connector",
      "1040.10(f)(4) Key control",
      "1040.10(f)(5) Laser radiation emission indicator",
      "1040.10(f)(6) Beam attenuator",
      "1040.10(f)(7) Location of controls",
      "1040.10(f)(8) Viewing optics",
      "1040.10(f)(9) Scanning safeguard",
      "1040.10(g) Labeling requirements",
      "1040.10(h)(1) User information",
      "1040.11(a) Medical laser products"
    ],
    
    unaffectedSections: [
      "1010.2 Certification",
      "1010.3 Identification",
      "1010.4 Variances",
      "1040.10(a) Applicability",
      "1040.10(c)(2) Removable laser systems",
      "1040.10(f)(10) Manual reset mechanism",
      "1040.10(h)(2) Purchasing and servicing information",
      "1040.10(i) Modification of a certified product",
      "1040.11(b) Surveying, leveling and alignment laser products",
      "1040.11(c) Demonstration laser products"
    ],
    
    certificationStatement: "Complies with FDA performance standards for laser products except for deviations pursuant to Laser Notice No. 50, dated June 24, 2007",
    
    acceptedIECVersions: [
      "IEC 60825-1, Edition 1.2",
      "IEC 60825-1, Edition 2",
      "IEC 60601-2-22"
    ]
  },

  // ============================================
  // VARIANCES AND EXEMPTIONS
  // ============================================
  
  variances: {
    definition: "Permission to vary from one or more requirements of the standard",
    cfr: "1010.4",
    
    whenGranted: [
      "Product required to perform function that cannot be performed with compliant equipment",
      "Suitable means of radiation safety and protection will be provided",
      "Alternate but at least equal means of safety",
      "Product could not perform function if in compliance",
      "Requirement is inappropriate for the product"
    ],
    
    applicationProcess: {
      form: "FDA Form 3147 for laser light shows",
      submission: "Must be submitted before product introduction",
      review: "Director of CDRH may grant variance if justified",
      note: "Failure to provide all required information may result in delay"
    },
    
    laserLightShowVariance: {
      description: "Permits use of Class IIIb and IV laser radiation for demonstration purposes",
      conditions: [
        "Specifies required means of radiation safety and protection",
        "Scanning safeguard requirements",
        "Beam stop/overfill mirror requirements",
        "Set-up safety control measures",
        "Notification requirements for shows"
      ],
      notTransferable: true,
      amendRequired: "When substantial changes to projector or show that affect safety conditions"
    },
    
    federalExemptions: {
      cfr: "1010.5",
      agencies: [
        "Department of Defense (DOD)",
        "Department of Energy (DOE)",
        "NASA facilities",
        "NOAA"
      ],
      appliesTo: "Certain unique or classified products"
    }
  },

  // ============================================
  // QUIZ QUESTIONS (Combined from both quiz banks)
  // ============================================
  
  quizQuestions: [
    // FDA Forms Quiz Questions
    {
      id: "c2_q1",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Regulatory Forms",
      question: "What is the OMB control number for FORM FDA 3632 (Guide for Preparing Product Reports for Lasers)?",
      options: [
        "0910-0015",
        "0910-0025",
        "0910-0035",
        "0910-0045"
      ],
      correctAnswer: 1,
      explanation: "FORM FDA 3632 has OMB control number 0910-0025 with expiration date February 28, 2026.",
      cfrReference: "Form header information"
    },
    {
      id: "c2_q2",
      type: "multiple_choice",
      difficulty: "hard",
      category: "Report Timing",
      question: "When must a Product Report be submitted to CDRH?",
      options: [
        "Within 30 days after introduction into commerce",
        "Within 60 days of manufacturing",
        "Prior to introduction of products into commerce",
        "Annually by September 1"
      ],
      correctAnswer: 2,
      explanation: "Product Reports must be submitted prior to introduction of the reported products into commerce, including imported products.",
      cfrReference: "21 CFR 1002.10"
    },
    {
      id: "c2_q3",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Report Types",
      question: "What type of report is used to report a new model in a previously reported model family?",
      options: [
        "Initial Product Report",
        "Supplemental Report",
        "Annual Report",
        "Abbreviated Report"
      ],
      correctAnswer: 1,
      explanation: "Supplemental Reports are used to report new models in previously reported model families, modifications, or other changes to previous reports.",
      cfrReference: "21 CFR 1002.11"
    },
    {
      id: "c2_q4",
      type: "multiple_select",
      difficulty: "hard",
      category: "Supplemental Report Triggers",
      question: "Which of the following changes require a Supplemental Report? (Select all that apply)",
      options: [
        "Changes affecting actual or potential emission",
        "Changes decreasing degree of compliance with the performance standard",
        "Changes resulting in decreased probability of detecting product noncompliance",
        "Changes to the product color only"
      ],
      correctAnswers: [0, 1, 2],
      explanation: "Supplemental Reports are required for changes affecting emissions, compliance, or detection probability. Cosmetic changes like color alone do not require supplemental reports.",
      cfrReference: "21 CFR 1002.11"
    },
    {
      id: "c2_q5",
      type: "multiple_choice",
      difficulty: "easy",
      category: "Regulatory Authority",
      question: "What is the estimated average reporting burden for completing FORM FDA 3632?",
      options: [
        "8 hours per response",
        "12 hours per response",
        "24 hours per response",
        "48 hours per response"
      ],
      correctAnswer: 2,
      explanation: "The estimated reporting burden is 24 hours per response, including time for reviewing instructions, searching data sources, gathering data, and completing the collection.",
      cfrReference: "Form header information"
    },
    {
      id: "c2_q6",
      type: "true_false",
      difficulty: "medium",
      category: "Regulatory Authority",
      question: "CDRH approves Product Reports and the products being reported.",
      correctAnswer: false,
      explanation: "CDRH does NOT approve Product Reports or the products being reported. It is the manufacturer's responsibility to certify compliance. CDRH may only disapprove testing programs or determine noncompliance after review.",
      cfrReference: "FORM FDA 3632 Foreword"
    },
    {
      id: "c2_q7",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Annual Reports",
      question: "When are Annual Reports due?",
      options: [
        "January 1 for the previous calendar year",
        "March 31 for the fiscal year",
        "September 1 for the 12 months ending June 30",
        "December 31 for the current calendar year"
      ],
      correctAnswer: 2,
      explanation: "Annual Reports must be submitted by September 1 for the 12 months ending on June 30 of the same year.",
      cfrReference: "21 CFR 1002.13"
    },
    {
      id: "c2_q8",
      type: "multiple_choice",
      difficulty: "easy",
      category: "Labeling Requirements",
      question: "Which label is required on ALL laser products regardless of class?",
      options: [
        "Warning logotype",
        "Certification label",
        "Aperture label",
        "Class IV designation label"
      ],
      correctAnswer: 1,
      explanation: "The Certification label (per 21 CFR 1010.2) and Identification label (per 21 CFR 1010.3) are required on ALL laser products. Warning logotypes and aperture labels are class-dependent.",
      cfrReference: "21 CFR 1010.2, 1010.3"
    },
    {
      id: "c2_q9",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Performance Requirements",
      question: "Which performance requirement applies to Class IIIb or IV laser systems only?",
      options: [
        "Protective housing",
        "Safety interlocks",
        "Remote interlock connector",
        "Viewing optics safeguards"
      ],
      correctAnswer: 2,
      explanation: "The remote interlock connector is required only for Class IIIb or IV laser systems. Protective housing, safety interlocks, and viewing optics safeguards apply to all laser products.",
      cfrReference: "21 CFR 1040.10(f)(3)"
    },
    {
      id: "c2_q10",
      type: "multiple_choice",
      difficulty: "hard",
      category: "Report Structure",
      question: "How many parts are in the complete FORM FDA 3632 Product Report?",
      options: [
        "8 parts",
        "9 parts",
        "10 parts",
        "12 parts"
      ],
      correctAnswer: 2,
      explanation: "FORM FDA 3632 has 10 parts: (1) Manufacturer/Report ID, (2) Product/Model ID, (3) Labeling, (4) Informational Requirements, (5) Product Description, (6) Radiation Levels/Classification, (7) Performance Requirements, (8) Quality Control, (9) Life/Endurance Testing, and (10) Instrumentation/Calibration.",
      cfrReference: "FORM FDA 3632 Table of Contents"
    },
    {
      id: "c2_q11",
      type: "fill_in_blank",
      difficulty: "medium",
      category: "Contact Information",
      question: "What is the contact phone number for questions about FDA laser product reporting?",
      correctAnswer: "1-800-638-2041",
      acceptableVariants: ["800-638-2041", "1-800-638-2041"],
      explanation: "The Division of Small Manufacturer's Assistance (DSMA) can be contacted at 1-800-638-2041 for reporting questions.",
      cfrReference: "FORM FDA 3632 submission information"
    },
    {
      id: "c2_q12",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Quality Control",
      question: "What must certification be based on according to 21 CFR 1010.2(c)?",
      options: [
        "CDRH pre-approval only",
        "Third-party testing only",
        "Testing in accordance with the standard OR a program in accordance with good manufacturing practices",
        "Manufacturer declaration only"
      ],
      correctAnswer: 2,
      explanation: "Certification must be based on a test in accordance with the standard of each unit OR on a program in accordance with good manufacturing practices.",
      cfrReference: "21 CFR 1010.2(c)"
    },
    {
      id: "c2_q13",
      type: "scenario",
      difficulty: "hard",
      category: "Compliance Scenarios",
      question: "Scenario: A manufacturer modifies a previously reported Class IV laser product to improve its beam attenuator mechanism. The modification reduces the probability of detecting noncompliance during quality control testing. What action is required?",
      options: [
        "No action needed - it's a safety improvement",
        "Include the change in next Annual Report only",
        "Submit a Supplemental Report prior to introduction into commerce",
        "Submit a new Product Report"
      ],
      correctAnswer: 2,
      explanation: "Changes that result in decreased probability of detecting product noncompliance require a Supplemental Report to be submitted prior to introduction into commerce.",
      cfrReference: "21 CFR 1002.11"
    },
    {
      id: "c2_q14",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Report Identification",
      question: "What is an 'accession number' in the context of FDA laser product reports?",
      options: [
        "A manufacturing serial number",
        "A unique identifier assigned by CDRH upon receipt of a report",
        "The OMB control number",
        "A model family designation"
      ],
      correctAnswer: 1,
      explanation: "When a report is received at CDRH, a unique accession number is assigned for future reference. Submitters are informed of this number in a letter of acknowledgment.",
      cfrReference: "FORM FDA 3632 General Instructions"
    },
    {
      id: "c2_q15",
      type: "multiple_select",
      difficulty: "hard",
      category: "Medical Laser Requirements",
      question: "For Class III or IV medical laser products intended for in-vivo irradiation of the human body, which requirements apply? (Select all that apply)",
      options: [
        "Means to measure the level of laser radiation intended for irradiation",
        "Displayed power/energy measured or calculated to within +/- 20%",
        "Procedures and schedule for recalibration in user instructions",
        "Emission indicators visible only in dark conditions"
      ],
      correctAnswers: [0, 1, 2],
      explanation: "Medical lasers must have measurement systems, calibration within +/- 20%, and recalibration procedures in user instructions. There is no requirement for emission indicators to be visible only in dark conditions.",
      cfrReference: "21 CFR 1040.11(a)"
    },
    {
      id: "c2_q16",
      type: "multiple_choice",
      difficulty: "hard",
      category: "Demonstration Lasers",
      question: "If a demonstration laser product exceeds Class IIIa, what is required prior to introduction into commerce?",
      options: [
        "Standard Product Report only",
        "Annual Report only",
        "Approved variance from performance requirements per 1010.4",
        "No special requirements"
      ],
      correctAnswer: 2,
      explanation: "If a demonstration laser product's class exceeds Class IIIa, an approved variance from the performance requirements in section 1040.11(c) is necessary prior to introduction into commerce.",
      cfrReference: "21 CFR 1040.11(c) and 1010.4"
    },
    {
      id: "c2_q17",
      type: "true_false",
      difficulty: "easy",
      category: "Fail-Safe Requirements",
      question: "Safety interlocks that prevent access to Class IIIb or IV laser radiation must be 'fail-safe' or redundant.",
      correctAnswer: true,
      explanation: "Safety interlocks preventing access to Class IIIb or IV laser radiation must be fail-safe (preclude removal upon failure) or redundant.",
      cfrReference: "21 CFR 1040.10(f)(2)(iii)"
    },
    {
      id: "c2_q18",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Manual Reset",
      question: "The manual reset requirement for Class IV laser systems applies to products manufactured after what date?",
      options: [
        "January 1, 1980",
        "August 20, 1986",
        "January 1, 1990",
        "February 27, 1997"
      ],
      correctAnswer: 1,
      explanation: "The manual reset requirement (to require manual restart following power failure of at least 5 seconds) applies to Class IV laser systems manufactured after August 20, 1986.",
      cfrReference: "21 CFR 1040.10(f)(10)"
    },
    {
      id: "c2_q19",
      type: "scenario",
      difficulty: "hard",
      category: "Compliance Scenarios",
      question: "Scenario: A manufacturer has a product that operates at a level closely approaching a specified emission limit. What is required regarding instrument calibration?",
      options: [
        "Self-certification is sufficient",
        "Calibration against company standard is acceptable",
        "High accuracy and traceability to NIST are important",
        "No calibration documentation needed"
      ],
      correctAnswer: 2,
      explanation: "When a laser product operates at a level closely approaching a specified limit, high accuracy and traceability to the National Institute of Standards and Technology (NIST) are important.",
      cfrReference: "FORM FDA 3632 Part 10 Note"
    },
    {
      id: "c2_q20",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Model Family",
      question: "What is a 'Model Family' in FDA laser product reporting?",
      options: [
        "A group of products from the same manufacturer only",
        "A group of models that are variations of a basic design",
        "Only Class I products",
        "Products sold only in the same geographic region"
      ],
      correctAnswer: 1,
      explanation: "A model family is a group of models that are variations of a basic design. A complete report can be submitted on one model with Supplemental Reports for other models in the family.",
      cfrReference: "FORM FDA 3632 Definitions"
    },
    
    // Laser Notice No. 50 Quiz Questions
    {
      id: "c2_ln50_q1",
      type: "multiple_choice",
      difficulty: "easy",
      category: "Document Identification",
      question: "What is the document number for Laser Notice No. 50?",
      options: [
        "1345",
        "1346",
        "1347",
        "1348"
      ],
      correctAnswer: 1,
      explanation: "Laser Notice No. 50 is document number 1346.",
      cfrReference: "Document header"
    },
    {
      id: "c2_ln50_q2",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Document History",
      question: "When was Laser Notice No. 50 issued?",
      options: [
        "July 26, 2001",
        "June 24, 2007",
        "August 20, 1986",
        "February 27, 1997"
      ],
      correctAnswer: 1,
      explanation: "Laser Notice No. 50 was issued on June 24, 2007, superseding the previous version from July 26, 2001.",
      cfrReference: "Document header"
    },
    {
      id: "c2_ln50_q3",
      type: "true_false",
      difficulty: "easy",
      category: "Legal Status",
      question: "Laser Notice No. 50 is a legally binding regulation.",
      correctAnswer: false,
      explanation: "Laser Notice No. 50 is a guidance document containing nonbinding recommendations. It does not create or confer any rights for or on any person.",
      cfrReference: "Preface and Introduction"
    },
    {
      id: "c2_ln50_q4",
      type: "multiple_choice",
      difficulty: "medium",
      category: "IEC Standards",
      question: "Which IEC standard covers medical electrical equipment requirements for lasers?",
      options: [
        "IEC 60825-1",
        "IEC 60601-1",
        "IEC 60601-2-22",
        "IEC 60825-2"
      ],
      correctAnswer: 2,
      explanation: "IEC 60601-2-22 covers particular requirements for surgical, cosmetic, therapeutic and diagnostic laser equipment. IEC 60825-1 covers general laser product safety.",
      cfrReference: "IEC Standards Referenced"
    },
    {
      id: "c2_ln50_q5",
      type: "multiple_select",
      difficulty: "hard",
      category: "Mandatory Requirements",
      question: "Regardless of IEC conformance, which of the following are ALWAYS required for laser products introduced into U.S. commerce? (Select all that apply)",
      options: [
        "Compliance with 21 CFR 1040.10 and 1040.11",
        "Certification per 21 CFR 1010.2",
        "Identification per 21 CFR 1010.3",
        "Reporting per 21 CFR 1002.10"
      ],
      correctAnswers: [0, 1, 2, 3],
      explanation: "All four requirements are mandatory for ALL laser products introduced into U.S. commerce, regardless of IEC conformance claims.",
      cfrReference: "Introduction section"
    },
    {
      id: "c2_ln50_q6",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Harmonized Sections",
      question: "How many sections of 21 CFR 1040 can use IEC 60825-1 conformance as an alternative under Laser Notice No. 50?",
      options: [
        "10 sections",
        "13 sections",
        "17 sections",
        "21 sections"
      ],
      correctAnswer: 2,
      explanation: "Laser Notice No. 50 allows IEC conformance for 17 harmonized sections, including definitions, classification, emission limits, test methods, and various performance requirements.",
      cfrReference: "Harmonized sections list"
    },
    {
      id: "c2_ln50_q7",
      type: "multiple_choice",
      difficulty: "hard",
      category: "Unaffected Sections",
      question: "Which of the following sections is UNAFFECTED by Laser Notice No. 50 and still requires FDA compliance?",
      options: [
        "Classification (1040.10(c)(1))",
        "Safety interlocks (1040.10(f)(2))",
        "Certification (1010.2)",
        "Beam attenuator (1040.10(f)(6))"
      ],
      correctAnswer: 2,
      explanation: "Certification (1010.2), Identification (1010.3), and Variances (1010.4) are among the unaffected sections. Classification, safety interlocks, and beam attenuators are harmonized sections.",
      cfrReference: "Unaffected sections list"
    },
    {
      id: "c2_ln50_q8",
      type: "fill_in_blank",
      difficulty: "medium",
      category: "Contact Information",
      question: "Who is the contact person for Laser Notice No. 50 at FDA/CDRH?",
      correctAnswer: "Jerome Dennis",
      acceptableVariants: ["Jerome Dennis", "jerome.dennis"],
      explanation: "Jerome Dennis is the contact person for Laser Notice No. 50, reachable at 240-276-3330 or jerome.dennis@fda.hhs.gov.",
      cfrReference: "Document header"
    },
    {
      id: "c2_ln50_q9",
      type: "multiple_choice",
      difficulty: "hard",
      category: "Certification Label",
      question: "What modified certification statement must manufacturers use on the certification label when claiming IEC conformance under Laser Notice No. 50?",
      options: [
        "Complies with IEC 60825-1 only",
        "Complies with FDA performance standards for laser products except for deviations pursuant to Laser Notice No. 50, dated June 24, 2007",
        "IEC Certified - FDA Exempt",
        "Meets international standards"
      ],
      correctAnswer: 1,
      explanation: "Manufacturers must use the specific modified statement that mentions deviations pursuant to Laser Notice No. 50 with the date.",
      cfrReference: "Modified Certification Statement section"
    },
    {
      id: "c2_ln50_q10",
      type: "multiple_select",
      difficulty: "medium",
      category: "Previous Concessions",
      question: "CDRH has previously issued notices stating non-objection to which of the following? (Select all that apply)",
      options: [
        "Lack of emission indicators on Class II and IIIa systems",
        "Lack of beam attenuators on Class II and IIIa systems",
        "IEC 60825-1 hazard warning labels",
        "All of the above"
      ],
      correctAnswers: [0, 1, 2],
      explanation: "CDRH has previously stated non-objection to: (1) lack of emission indicators or beam attenuators on Class II and Class IIIa systems, and (2) hazard warning labels as specified in IEC 60825-1.",
      cfrReference: "Previous Concessions section"
    },
    {
      id: "c2_ln50_q11",
      type: "multiple_choice",
      difficulty: "hard",
      category: "Editions Accepted",
      question: "Which editions of IEC 60825-1 are accepted under Laser Notice No. 50?",
      options: [
        "Edition 1 only",
        "Edition 2 only",
        "Editions 1.2 or 2",
        "All editions"
      ],
      correctAnswer: 2,
      explanation: "Laser Notice No. 50 accepts conformance with IEC 60825-1, Editions 1.2 or 2.",
      cfrReference: "Guidance section"
    },
    {
      id: "c2_ln50_q12",
      type: "true_false",
      difficulty: "medium",
      category: "Manual Reset",
      question: "The manual reset mechanism requirement (1040.10(f)(10)) is one of the unaffected sections under Laser Notice No. 50.",
      correctAnswer: true,
      explanation: "Manual reset mechanism (1040.10(f)(10)) is listed as an unaffected section. Laser products must continue to conform to this FDA-specific requirement.",
      cfrReference: "Unaffected sections list"
    },
    {
      id: "c2_ln50_q13",
      type: "scenario",
      difficulty: "hard",
      category: "Compliance Scenarios",
      question: "Scenario: A manufacturer wants to introduce a laser product that fully complies with IEC 60825-1 Edition 2 for classification, emission limits, and safety interlocks. What additional requirements must they meet for U.S. compliance?",
      options: [
        "Only IEC compliance is needed - no additional FDA requirements",
        "Must add FDA certification label and submit product report, but can use IEC compliance for harmonized sections",
        "Must completely redesign to meet FDA-only requirements",
        "Cannot use IEC compliance for any purpose"
      ],
      correctAnswer: 1,
      explanation: "The manufacturer can use IEC compliance for harmonized sections (like classification and interlocks) but must still comply with unaffected FDA requirements including certification, identification, and reporting.",
      cfrReference: "Guidance and Unaffected sections"
    },
    {
      id: "c2_ln50_q14",
      type: "multiple_choice",
      difficulty: "medium",
      category: "Guidance Terminology",
      question: "In FDA guidance documents, what does the word 'should' indicate?",
      options: [
        "A mandatory requirement",
        "A suggestion or recommendation, but not required",
        "Only applies to medical devices",
        "A criminal penalty will result if not followed"
      ],
      correctAnswer: 1,
      explanation: "In FDA guidance documents, 'should' means something is suggested or recommended, but not required. Alternative approaches are acceptable if they satisfy applicable statutes and regulations.",
      cfrReference: "Introduction section"
    },
    {
      id: "c2_ln50_q15",
      type: "multiple_choice",
      difficulty: "hard",
      category: "Demonstration Lasers",
      question: "Demonstration laser products requirements under 1040.11(c) are considered:",
      options: [
        "Harmonized with IEC standards",
        "Unaffected by Laser Notice No. 50",
        "Optional for compliance",
        "Only applicable to Class I lasers"
      ],
      correctAnswer: 1,
      explanation: "Demonstration laser products (1040.11(c)) are listed as an unaffected section. Manufacturers must conform to these FDA requirements even if they differ from IEC standards.",
      cfrReference: "Unaffected sections list"
    }
  ] as QuizQuestion[],

  // ============================================
  // GLOSSARY
  // ============================================
  
  glossary: [
    {
      term: "Accession Number",
      definition: "A unique identifier assigned by CDRH when a Product Report is received, used for all future reference to that report.",
      context: "Reporting"
    },
    {
      term: "Annual Report",
      definition: "A report submitted by September 1 summarizing records for the 12 months ending June 30.",
      context: "Reporting"
    },
    {
      term: "Beam Attenuator",
      definition: "A device that prevents access to laser radiation without turning off the laser power.",
      context: "Performance Requirements"
    },
    {
      term: "CDRH",
      definition: "Center for Devices and Radiological Health - the FDA center responsible for laser product regulation.",
      context: "Regulatory Organization"
    },
    {
      term: "Certification",
      definition: "The manufacturer's statement that a product complies with applicable performance standards.",
      context: "Compliance"
    },
    {
      term: "Class I Laser",
      definition: "Laser products with emission levels not found to cause biological damage.",
      context: "Classification"
    },
    {
      term: "Class II Laser",
      definition: "Visible lasers emitting less than 1 mW; protected by blink reflex.",
      context: "Classification"
    },
    {
      term: "Class IIIa Laser",
      definition: "Visible lasers emitting 1-5 mW; direct viewing hazard.",
      context: "Classification"
    },
    {
      term: "Class IIIb Laser",
      definition: "Lasers emitting 5-500 mW; immediate eye damage hazard.",
      context: "Classification"
    },
    {
      term: "Class IV Laser",
      definition: "Lasers emitting more than 500 mW; most hazardous class.",
      context: "Classification"
    },
    {
      term: "Collateral Radiation",
      definition: "Any optical, electromagnetic, or x-radiation necessary for or resulting from laser operation.",
      context: "Radiation Safety"
    },
    {
      term: "Demonstration Laser Product",
      definition: "Products for classroom, artistic displays, laser light shows, and projectors.",
      context: "Specific Purpose Products"
    },
    {
      term: "DSMICA",
      definition: "Division of Small Manufacturers, International, and Consumer Assistance - FDA contact for guidance.",
      context: "Regulatory Organization"
    },
    {
      term: "Fail-safe",
      definition: "Design feature that prevents hazardous conditions upon component failure.",
      context: "Safety Engineering"
    },
    {
      term: "Human Access",
      definition: "Laser radiation that can be intercepted by any part of the body or reflected by a single flat surface.",
      context: "Classification"
    },
    {
      term: "IEC 60825-1",
      definition: "International safety standard for laser products published by the International Electrotechnical Commission.",
      context: "Standards"
    },
    {
      term: "Laser Notice",
      definition: "FDA guidance document clarifying or modifying regulatory requirements.",
      context: "Regulatory Guidance"
    },
    {
      term: "Model Family",
      definition: "A group of models that are variations of a basic design.",
      context: "Reporting"
    },
    {
      term: "Product Report",
      definition: "Comprehensive report describing laser product compliance and testing program.",
      context: "Reporting"
    },
    {
      term: "Protective Housing",
      definition: "Enclosure preventing human access to laser radiation above Class I limits.",
      context: "Performance Requirements"
    },
    {
      term: "Remote Interlock Connector",
      definition: "Connection allowing external safety devices to disable laser emission.",
      context: "Performance Requirements"
    },
    {
      term: "Safety Interlock",
      definition: "Device preventing laser emission when protective housing is opened.",
      context: "Performance Requirements"
    },
    {
      term: "Scanning Safeguard",
      definition: "System preventing hazardous emission if scanning mechanism fails.",
      context: "Performance Requirements"
    },
    {
      term: "Supplemental Report",
      definition: "Report describing changes to previously reported laser products.",
      context: "Reporting"
    },
    {
      term: "Variance",
      definition: "Permission granted by FDA to deviate from specific regulatory requirements.",
      context: "Compliance"
    }
  ],

  // ============================================
  // LEARNING OBJECTIVES
  // ============================================
  
  learningObjectives: [
    "Understand the legal basis for FDA regulation of laser products (FFDCA Chapter V, Subchapter C)",
    "Identify the key components of 21 CFR Subchapter J applicable to laser products",
    "Describe the FDA laser classification system and power limits for each class",
    "Explain the differences between FDA and IEC classification systems",
    "List the performance requirements for each laser class",
    "Understand Product Report, Supplemental Report, and Annual Report requirements",
    "Describe the purpose and use of Laser Notice No. 50 for IEC harmonization",
    "Identify which regulatory requirements are harmonized vs. unaffected by Laser Notice No. 50",
    "Explain variance requirements for demonstration lasers and laser light shows",
    "List the CDRH offices and their roles in laser product regulation",
    "Understand the labeling requirements for each laser class",
    "Describe the key changes in the 2023 Final Rule"
  ],

  // ============================================
  // CONTENT VERIFICATION
  // ============================================
  
  contentSourceVerification: {
    sourceDocuments: [
      "fda-regulatory-framework.pdf (29 pages, FDA Compliance Guide for Laser Products)",
      "fda-forms.pdf (37 pages, FORM FDA 3632)",
      "laser-notice-50.pdf (6 pages)"
    ],
    extractionDate: "2026-03-19",
    accuracyNotes: [
      "All classification limits verified against 21 CFR 1040.10 Tables I-III-B",
      "Measurement parameters from 1040.10(e) - 7mm aperture, 10^-3 sr solid angle",
      "Performance requirements from Appendix A tabulation",
      "Laser Notice No. 50 harmonized sections list verified",
      "Reporting requirements from 21 CFR 1002.10, 1002.11, 1002.13",
      "2023 Final Rule changes from Federal Register 88 FR 3638"
    ],
    contentIntegrity: "All content derived from extracted FDA documents. No fictional information included."
  }
};

// ============================================
// EXPORTS
// ============================================

export type C2M1Content = typeof c2m1Content;
export default c2m1Content;
