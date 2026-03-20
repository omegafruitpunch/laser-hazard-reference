// Module 5.6: International Show Documentation
// Interactive educational module with overseas show planner and documentation tools

import OverseasShowPlanner from './components/OverseasShowPlanner';
import DocumentationChecklistGenerator from './components/DocumentationChecklistGenerator';
import PermitCalculator from './components/PermitCalculator';

export { OverseasShowPlanner, DocumentationChecklistGenerator, PermitCalculator };

export const moduleConfig = {
  id: 'c5-m6',
  title: 'International Show Documentation',
  description: 'Comprehensive guide to preparing documentation packages for international laser show deployments.',
  learningObjectives: [
    'Prepare comprehensive documentation packages for international shows',
    'Navigate temporary equipment import procedures',
    'Calculate permit requirements by destination country',
    'Plan international show timelines with regulatory considerations'
  ],
  interactiveComponents: [
    {
      name: 'OverseasShowPlanner',
      title: '"I\'m Taking My Show Overseas" Planner',
      description: 'Step-by-step planning guide with timeline and task tracking for international shows'
    },
    {
      name: 'DocumentationChecklistGenerator',
      title: 'Documentation Checklist Generator',
      description: 'Generate customized checklists based on destination country category'
    },
    {
      name: 'PermitCalculator',
      title: 'Permit Requirement Calculator',
      description: 'Calculate permits, costs, and lead times by destination country'
    }
  ]
};
