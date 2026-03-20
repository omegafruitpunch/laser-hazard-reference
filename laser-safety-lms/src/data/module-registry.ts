/**
 * Module Registry
 * Central registry mapping all module IDs to their components and metadata
 */

export interface ModuleRegistryEntry {
  component: string;
  course: string;
  courseName: string;
  moduleNumber: number;
  title: string;
  description: string;
  estimatedMinutes: number;
}

export const moduleRegistry: Record<string, ModuleRegistryEntry> = {
  // ============================================================================
  // COURSE 1: Laser Safety Fundamentals (5 modules)
  // ============================================================================
  'c1-m1': {
    component: 'Module1_IntroHazards',
    course: 'course-1',
    courseName: 'Laser Safety Fundamentals',
    moduleNumber: 1,
    title: 'Introduction to Laser Hazards',
    description: 'Overview of laser technology and fundamental hazards',
    estimatedMinutes: 15,
  },
  'c1-m2': {
    component: 'Module2_ClassificationSystem',
    course: 'course-1',
    courseName: 'Laser Safety Fundamentals',
    moduleNumber: 2,
    title: 'Laser Classification System',
    description: 'Understanding Class 1 through Class 4 laser classifications',
    estimatedMinutes: 15,
  },
  'c1-m3': {
    component: 'Module3_LSORole',
    course: 'course-1',
    courseName: 'Laser Safety Fundamentals',
    moduleNumber: 3,
    title: 'Role of the Laser Safety Officer',
    description: 'Responsibilities and training requirements for LSO',
    estimatedMinutes: 15,
  },
  'c1-m4': {
    component: 'Module4_Calculations',
    course: 'course-1',
    courseName: 'Laser Safety Fundamentals',
    moduleNumber: 4,
    title: 'Beam Hazard Calculations',
    description: 'NOHD and MPE calculations',
    estimatedMinutes: 15,
  },
  'c1-m5': {
    component: 'Module5_Controls',
    course: 'course-1',
    courseName: 'Laser Safety Fundamentals',
    moduleNumber: 5,
    title: 'Engineering & Administrative Controls',
    description: 'Implementation of laser safety controls',
    estimatedMinutes: 15,
  },

  // ============================================================================
  // COURSE 2: FDA Compliance & Reporting (6 modules)
  // ============================================================================
  'c2-m1': {
    component: 'Module1_FDAFramework',
    course: 'course-2',
    courseName: 'FDA Compliance & Reporting',
    moduleNumber: 1,
    title: 'FDA Regulatory Framework',
    description: 'Overview of 21 CFR 1040 federal standards',
    estimatedMinutes: 15,
  },
  'c2-m2': {
    component: 'Module2_VarianceApplications',
    course: 'course-2',
    courseName: 'FDA Compliance & Reporting',
    moduleNumber: 2,
    title: 'Variance Applications',
    description: 'Applying for variances from FDA performance standards',
    estimatedMinutes: 15,
  },
  'c2-m3': {
    component: 'Module3_LaserNotice50',
    course: 'course-2',
    courseName: 'FDA Compliance & Reporting',
    moduleNumber: 3,
    title: 'Laser Notice 50 Requirements',
    description: 'Audience scanning restrictions guidance',
    estimatedMinutes: 15,
  },
  'c2-m4': {
    component: 'Module4_IncidentReporting',
    course: 'course-2',
    courseName: 'FDA Compliance & Reporting',
    moduleNumber: 4,
    title: 'Mandatory Incident Reporting',
    description: 'Legal requirements for reporting laser-related injuries',
    estimatedMinutes: 15,
  },
  'c2-m5': {
    component: 'Module5_FDAForms',
    course: 'course-2',
    courseName: 'FDA Compliance & Reporting',
    moduleNumber: 5,
    title: 'FDA Forms & Documentation',
    description: 'Completing FDA Form 3632 and compliance documents',
    estimatedMinutes: 15,
  },
  'c2-m6': {
    component: 'Module6_Jurisdiction',
    course: 'course-2',
    courseName: 'FDA Compliance & Reporting',
    moduleNumber: 6,
    title: 'State vs. Federal Jurisdiction',
    description: 'How FDA regulations interact with state laws',
    estimatedMinutes: 15,
  },

  // ============================================================================
  // COURSE 3: Biological Hazards & Classification (5 modules)
  // ============================================================================
  'c3-m1': {
    component: 'Module1_OcularHazards',
    course: 'course-3',
    courseName: 'Biological Hazards & Classification',
    moduleNumber: 1,
    title: 'Ocular Hazards & Anatomy',
    description: 'How laser wavelengths affect the eye',
    estimatedMinutes: 15,
  },
  'c3-m2': {
    component: 'Module2_SkinHazards',
    course: 'course-3',
    courseName: 'Biological Hazards & Classification',
    moduleNumber: 2,
    title: 'Skin Hazards & Thermal Effects',
    description: 'Laser-induced skin injuries and thresholds',
    estimatedMinutes: 15,
  },
  'c3-m3': {
    component: 'Module3_IEC60825',
    course: 'course-3',
    courseName: 'Biological Hazards & Classification',
    moduleNumber: 3,
    title: 'IEC 60825-1 Standard',
    description: 'International laser product safety standard',
    estimatedMinutes: 15,
  },
  'c3-m4': {
    component: 'Module4_MPETables',
    course: 'course-3',
    courseName: 'Biological Hazards & Classification',
    moduleNumber: 4,
    title: 'Maximum Permissible Exposure Tables',
    description: 'Using MPE tables for eye and skin',
    estimatedMinutes: 15,
  },
  'c3-m5': {
    component: 'Module5_EyewearSelection',
    course: 'course-3',
    courseName: 'Biological Hazards & Classification',
    moduleNumber: 5,
    title: 'Protective Eyewear Selection',
    description: 'Optical density requirements and selection',
    estimatedMinutes: 15,
  },

  // ============================================================================
  // COURSE 4: US State & Local Regulations (10 modules)
  // ============================================================================
  'c4-m1': {
    component: 'Module1_California',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 1,
    title: 'California Laser Regulations',
    description: 'CDPH laser use permits and compliance',
    estimatedMinutes: 10,
  },
  'c4-m2': {
    component: 'Module2_Florida',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 2,
    title: 'Florida Laser Regulations',
    description: 'Florida DOH radiation control program',
    estimatedMinutes: 10,
  },
  'c4-m3': {
    component: 'Module3_NewYork',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 3,
    title: 'New York Laser Regulations',
    description: 'NYS DOH requirements and NYC permits',
    estimatedMinutes: 10,
  },
  'c4-m4': {
    component: 'Module4_Texas',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 4,
    title: 'Texas Laser Regulations',
    description: 'Texas DSHS laser safety requirements',
    estimatedMinutes: 10,
  },
  'c4-m5': {
    component: 'Module5_Nevada',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 5,
    title: 'Nevada Laser Regulations',
    description: 'Nevada radiation control for entertainment',
    estimatedMinutes: 10,
  },
  'c4-m6': {
    component: 'Module6_Illinois',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 6,
    title: 'Illinois Laser Regulations',
    description: 'IEMA radiation safety requirements',
    estimatedMinutes: 10,
  },
  'c4-m7': {
    component: 'Module7_Georgia',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 7,
    title: 'Georgia Laser Regulations',
    description: 'Georgia DNR environmental radiation control',
    estimatedMinutes: 10,
  },
  'c4-m8': {
    component: 'Module8_Washington',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 8,
    title: 'Washington State Regulations',
    description: 'Washington DOH radiation protection',
    estimatedMinutes: 10,
  },
  'c4-m9': {
    component: 'Module9_Massachusetts',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 9,
    title: 'Massachusetts Laser Regulations',
    description: 'Mass DPH Bureau of Environmental Health',
    estimatedMinutes: 10,
  },
  'c4-m10': {
    component: 'Module10_Colorado',
    course: 'course-4',
    courseName: 'US State & Local Regulations',
    moduleNumber: 10,
    title: 'Colorado Laser Regulations',
    description: 'CDPHE radiation management program',
    estimatedMinutes: 10,
  },

  // ============================================================================
  // COURSE 5: International Regulations (6 modules)
  // ============================================================================
  'c5-m1': {
    component: 'Module1_EU_Directives',
    course: 'course-5',
    courseName: 'International Regulations',
    moduleNumber: 1,
    title: 'EU Laser Safety Directives',
    description: 'European Union directives and worker exposure limits',
    estimatedMinutes: 15,
  },
  'c5-m2': {
    component: 'Module2_UK_Regulations',
    course: 'course-5',
    courseName: 'International Regulations',
    moduleNumber: 2,
    title: 'UK Post-Brexit Laser Regulations',
    description: 'UK-specific requirements after Brexit',
    estimatedMinutes: 15,
  },
  'c5-m3': {
    component: 'Module3_Canada',
    course: 'course-5',
    courseName: 'International Regulations',
    moduleNumber: 3,
    title: 'Canadian Laser Regulations',
    description: 'Health Canada REDA regulations',
    estimatedMinutes: 15,
  },
  'c5-m4': {
    component: 'Module4_Australia_NZ',
    course: 'course-5',
    courseName: 'International Regulations',
    moduleNumber: 4,
    title: 'Australia & New Zealand Standards',
    description: 'AS/NZS 2211 and radiation council requirements',
    estimatedMinutes: 15,
  },
  'c5-m5': {
    component: 'Module5_Intl_Shows',
    course: 'course-5',
    courseName: 'International Regulations',
    moduleNumber: 5,
    title: 'International Show Documentation',
    description: 'Documentation for international deployments',
    estimatedMinutes: 15,
  },
  'c5-m6': {
    component: 'Module6_IEC_ISO',
    course: 'course-5',
    courseName: 'International Regulations',
    moduleNumber: 6,
    title: 'IEC & ISO Standards Harmonization',
    description: 'Global laser safety standards harmonization',
    estimatedMinutes: 15,
  },

  // ============================================================================
  // COURSE 6: Outdoor Laser Safety & Airspace (6 modules)
  // ============================================================================
  'c6-m1': {
    component: 'Module1_FAA_Regulations',
    course: 'course-6',
    courseName: 'Outdoor Laser Safety & Airspace',
    moduleNumber: 1,
    title: 'FAA Laser Regulations Overview',
    description: 'FAA regulations on laser illumination of aircraft',
    estimatedMinutes: 15,
  },
  'c6-m2': {
    component: 'Module2_NOTAM',
    course: 'course-6',
    courseName: 'Outdoor Laser Safety & Airspace',
    moduleNumber: 2,
    title: 'NOTAM Procedures',
    description: 'Filing Notices to Air Missions',
    estimatedMinutes: 15,
  },
  'c6-m3': {
    component: 'Module3_Outdoor_Calculations',
    course: 'course-6',
    courseName: 'Outdoor Laser Safety & Airspace',
    moduleNumber: 3,
    title: 'Outdoor Hazard Distance Calculations',
    description: 'Hazard calculations with atmospheric effects',
    estimatedMinutes: 15,
  },
  'c6-m4': {
    component: 'Module4_Securing_Shows',
    course: 'course-6',
    courseName: 'Outdoor Laser Safety & Airspace',
    moduleNumber: 4,
    title: 'Securing Outdoor Laser Shows',
    description: 'Site assessment and perimeter security',
    estimatedMinutes: 15,
  },
  'c6-m5': {
    component: 'Module5_Intl_Outdoor',
    course: 'course-6',
    courseName: 'Outdoor Laser Safety & Airspace',
    moduleNumber: 5,
    title: 'International Outdoor Laser Standards',
    description: 'IEC 60825-3 for laser displays',
    estimatedMinutes: 15,
  },

  // ============================================================================
  // COURSE 7: Event Safety & Operations (6 modules)
  // ============================================================================
  'c7-m1': {
    component: 'Module1_EventPlanning',
    course: 'course-7',
    courseName: 'Event Safety & Operations',
    moduleNumber: 1,
    title: 'Event Safety Planning',
    description: 'Pre-event safety planning frameworks',
    estimatedMinutes: 15,
  },
  'c7-m2': {
    component: 'Module2_CrowdSafety',
    course: 'course-7',
    courseName: 'Event Safety & Operations',
    moduleNumber: 2,
    title: 'Crowd Safety & Dynamics',
    description: 'Crowd behavior and density management',
    estimatedMinutes: 15,
  },
  'c7-m3': {
    component: 'Module3_WeatherProtocols',
    course: 'course-7',
    courseName: 'Event Safety & Operations',
    moduleNumber: 3,
    title: 'Weather Protocols for Outdoor Events',
    description: 'Weather monitoring and evacuation protocols',
    estimatedMinutes: 15,
  },
  'c7-m4': {
    component: 'Module4_VenueAssessment',
    course: 'course-7',
    courseName: 'Event Safety & Operations',
    moduleNumber: 4,
    title: 'Venue Assessment Checklist',
    description: 'Systematic venue evaluation approach',
    estimatedMinutes: 15,
  },
  'c7-m5': {
    component: 'Module5_EmergencyResponse',
    course: 'course-7',
    courseName: 'Event Safety & Operations',
    moduleNumber: 5,
    title: 'Emergency Response Procedures',
    description: 'Laser injury response and documentation',
    estimatedMinutes: 15,
  },
  'c7-m6': {
    component: 'Module6_Insurance',
    course: 'course-7',
    courseName: 'Event Safety & Operations',
    moduleNumber: 6,
    title: 'Insurance & Liability',
    description: 'Insurance requirements and liability management',
    estimatedMinutes: 15,
  },

  // ============================================================================
  // COURSE 8: Entertainment Technology Standards (5 modules)
  // ============================================================================
  'c8-m1': {
    component: 'Module1_ANSIZ136',
    course: 'course-8',
    courseName: 'Entertainment Technology Standards',
    moduleNumber: 1,
    title: 'ANSI Z136 Laser Safety Standards',
    description: 'The complete ANSI Z136 series overview',
    estimatedMinutes: 15,
  },
  'c8-m2': {
    component: 'Module2_ESTAStandards',
    course: 'course-8',
    courseName: 'Entertainment Technology Standards',
    moduleNumber: 2,
    title: 'ESTA Entertainment Standards',
    description: 'ESTA standards for laser show production',
    estimatedMinutes: 15,
  },
  'c8-m3': {
    component: 'Module3_E146Standard',
    course: 'course-8',
    courseName: 'Entertainment Technology Standards',
    moduleNumber: 3,
    title: 'ANSI E1.46 Entertainment Laser Standard',
    description: 'Deep dive into E1.46 standard',
    estimatedMinutes: 15,
  },
  'c8-m4': {
    component: 'Module4_ElectricalSafety',
    course: 'course-8',
    courseName: 'Entertainment Technology Standards',
    moduleNumber: 4,
    title: 'Electrical Safety Standards for Laser Equipment',
    description: 'IEC 60950 and UL 60950 standards',
    estimatedMinutes: 15,
  },
  'c8-m5': {
    component: 'Module5_ComplianceDocs',
    course: 'course-8',
    courseName: 'Entertainment Technology Standards',
    moduleNumber: 5,
    title: 'Standards Compliance Documentation',
    description: 'Documenting compliance for clients and authorities',
    estimatedMinutes: 15,
  },
};

// Total module count
export const TOTAL_MODULES = Object.keys(moduleRegistry).length;

// Helper function to get module by ID
export function getModuleEntry(moduleId: string): ModuleRegistryEntry | undefined {
  return moduleRegistry[moduleId];
}

// Helper function to get all modules for a course
export function getCourseModules(courseId: string): ModuleRegistryEntry[] {
  return Object.values(moduleRegistry).filter(m => m.course === courseId);
}

// Export module IDs array for iteration
export const allModuleIds = Object.keys(moduleRegistry);

// Course summary statistics
export const courseModuleCounts: Record<string, number> = {
  'course-1': 5,
  'course-2': 6,
  'course-3': 5,
  'course-4': 10,
  'course-5': 6,
  'course-6': 5,
  'course-7': 6,
  'course-8': 5,
};
