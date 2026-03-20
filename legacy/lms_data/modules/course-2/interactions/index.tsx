/**
 * Course 2: FDA Compliance - Interaction Components Index
 * 
 * This module exports all interactive components for the FDA Compliance course.
 * 
 * Module 2.1: FDA Regulatory Framework
 * - RegulatoryTimeline: Interactive timeline with sequential animations
 * - Form3147Simulator: Variance application form with field validation
 * - CDRHOrganizationalChart: Explorable org chart with details
 * - ReportingDecisionWizard: Decision tree for form selection
 * 
 * Module 2.2: Laser Product Classification
 * - ClassificationPyramid: Interactive pyramid with class details
 * - AELCalculator: Real-time AEL computation tool
 * - ClassificationWizard: Step-by-step classification guide
 * - RequirementsMatrix: Side-by-side comparison table
 * 
 * Module 2.3: Laser Notices & Harmonization
 * - HarmonizationTable: Filterable comparison matrix
 * - CertificationBuilder: Statement generator with copy function
 * - ComplianceChecklist: Progress-tracking checklist with localStorage
 * - HarmonizationTabs: Tabbed navigation component
 */

// Module 2.1 exports
export {
  RegulatoryTimeline,
  Form3147Simulator,
  CDRHOrganizationalChart,
  ReportingDecisionWizard
} from './module-2.1-interactions';

// Module 2.2 exports
export {
  ClassificationPyramid,
  AELCalculator,
  ClassificationWizard,
  RequirementsMatrix
} from './module-2.2-interactions';

// Module 2.3 exports
export {
  HarmonizationTable,
  CertificationBuilder,
  ComplianceChecklist,
  HarmonizationTabs
} from './module-2.3-interactions';

// Default export with all components
export { default as Module21Interactions } from './module-2.1-interactions';
export { default as Module22Interactions } from './module-2.2-interactions';
export { default as Module23Interactions } from './module-2.3-interactions';
