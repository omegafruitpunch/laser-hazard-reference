// Course 5: International Regulations - Module Exports

import { Module1_EU_Directives } from './Module1_EU_Directives';
import { Module2_UK_Regulations } from './Module2_UK_Regulations';
import { Module3_Canada } from './Module3_Canada';
import { Module4_Australia_NZ } from './Module4_Australia_NZ';
import { Module5_Intl_Shows } from './Module5_Intl_Shows';
import { Module6_IEC_ISO } from './Module6_IEC_ISO';

// Re-export as named exports
export { Module1_EU_Directives } from './Module1_EU_Directives';
export { Module2_UK_Regulations } from './Module2_UK_Regulations';
export { Module3_Canada } from './Module3_Canada';
export { Module4_Australia_NZ } from './Module4_Australia_NZ';
export { Module5_Intl_Shows } from './Module5_Intl_Shows';
export { Module6_IEC_ISO } from './Module6_IEC_ISO';

// Default exports for direct imports
export { default as defaultModule1 } from './Module1_EU_Directives';
export { default as defaultModule2 } from './Module2_UK_Regulations';
export { default as defaultModule3 } from './Module3_Canada';
export { default as defaultModule4 } from './Module4_Australia_NZ';
export { default as defaultModule5 } from './Module5_Intl_Shows';
export { default as defaultModule6 } from './Module6_IEC_ISO';

// Module metadata for course structure
export const course5Metadata = {
  courseId: 'course-5',
  courseName: 'International Regulations',
  description: 'Comprehensive modules covering international laser safety regulations',
  modules: [
    {
      id: '5.1',
      component: 'Module1_EU_Directives',
      title: 'EU Directives',
      description: 'EU 2006/25/EC worker protection, EN 60825 standards, Status A-F country classification, CE marking requirements',
      duration: '45 minutes',
      learningObjectives: [
        'Understand EU Directive 2006/25/EC requirements',
        'Navigate EN 60825 standards framework',
        'Identify country-specific compliance requirements',
        'Apply CE marking procedures'
      ]
    },
    {
      id: '5.2',
      component: 'Module2_UK_Regulations',
      title: 'UK Post-Brexit Regulations',
      description: 'UKCA marking system, HSE guidance, post-Brexit changes, UK vs EU comparison',
      duration: '40 minutes',
      learningObjectives: [
        'Understand UKCA marking requirements',
        'Apply HSE Display Lasers guidance',
        'Navigate post-Brexit regulatory changes',
        'Compare UK and EU requirements'
      ]
    },
    {
      id: '5.3',
      component: 'Module3_Canada',
      title: 'Canada Regulations',
      description: 'REDA (Radiation Emitting Devices Act), Health Canada requirements, provincial variations, import procedures',
      duration: '35 minutes',
      learningObjectives: [
        'Understand REDA provisions and penalties',
        'Navigate Health Canada requirements',
        'Identify provincial variations',
        'Apply import procedures'
      ]
    },
    {
      id: '5.4',
      component: 'Module4_Australia_NZ',
      title: 'Australia & New Zealand Regulations',
      description: 'AS/NZS 2211 standards, ARPANSA federal guidance, state regulations, NZ EPA requirements',
      duration: '30 minutes',
      learningObjectives: [
        'Understand Australian state-based regulations',
        'Navigate AS/NZS standards',
        'Identify regulated laser classes by state',
        'Compare AU and NZ requirements'
      ]
    },
    {
      id: '5.5',
      component: 'Module5_Intl_Shows',
      title: 'International Laser Shows',
      description: 'ILDA country categories (A, B, F, G, X), documentation requirements, permit lead times, overseas show planner',
      duration: '50 minutes',
      learningObjectives: [
        'Understand ILDA country categories',
        'Navigate international documentation requirements',
        'Calculate permit lead times',
        'Plan overseas laser shows'
      ]
    },
    {
      id: '5.6',
      component: 'Module6_IEC_ISO',
      title: 'IEC-ISO Harmonization',
      description: 'IEC 60825-1 editions comparison, ISO standards, global harmonization status, Edition 2 vs 3 differences',
      duration: '45 minutes',
      learningObjectives: [
        'Compare IEC 60825-1 editions',
        'Understand ISO related standards',
        'Navigate global harmonization status',
        'Apply Edition 3 requirements'
      ]
    }
  ]
};

// Export all components as named exports
export default {
  Module1_EU_Directives,
  Module2_UK_Regulations,
  Module3_Canada,
  Module4_Australia_NZ,
  Module5_Intl_Shows,
  Module6_IEC_ISO,
  course5Metadata
};
