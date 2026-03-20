// Module 5.5: IEC 60825-1 & ISO Harmonization
// Interactive educational module with IEC Edition Comparator

import IECEditionComparator from './components/IECEditionComparator';

export { IECEditionComparator };

export const moduleConfig = {
  id: 'c5-m5',
  title: 'IEC 60825-1 & ISO Harmonization',
  description: 'International laser safety standards evolution, edition comparisons, and global harmonization efforts.',
  learningObjectives: [
    'Compare key differences between IEC 60825-1 editions',
    'Understand the relationship between IEC and ISO standards',
    'Identify national deviations from international standards',
    'Apply edition-specific requirements for international trade'
  ],
  interactiveComponents: [
    {
      name: 'IECEditionComparator',
      title: 'IEC 60825-1 Edition Comparator',
      description: 'Compare Edition 2 and Edition 3 changes with impact assessment and timeline'
    }
  ]
};
