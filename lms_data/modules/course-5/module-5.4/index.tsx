// Module 5.4: Australia & New Zealand Standards
// Interactive educational module with ILDA Country Classification and AS/NZS 4173 Navigator

import CountryClassificationSystem from './components/CountryClassificationSystem';
import ASNZS4173Navigator from './components/ASNZS4173Navigator';

export { CountryClassificationSystem, ASNZS4173Navigator };

export const moduleConfig = {
  id: 'c5-m4',
  title: 'Australia & New Zealand Standards',
  description: 'AS/NZS 4173 laser safety standards, Radiation Council requirements, and ILDA country classification system.',
  learningObjectives: [
    'Understand the AS/NZS 4173 standard structure and key requirements',
    'Navigate Australian state/territory radiation protection requirements',
    'Explain New Zealand\'s laser operator licensing system',
    'Apply ILDA country categories for international show planning'
  ],
  interactiveComponents: [
    {
      name: 'CountryClassificationSystem',
      title: 'ILDA Country Classification System',
      description: 'Interactive guide to ILDA categories A, B, F, G, and X with country examples and requirements'
    },
    {
      name: 'ASNZS4173Navigator',
      title: 'AS/NZS 4173 Interactive Navigator',
      description: 'Navigate through all sections of the Australia/New Zealand laser safety standard'
    }
  ]
};
