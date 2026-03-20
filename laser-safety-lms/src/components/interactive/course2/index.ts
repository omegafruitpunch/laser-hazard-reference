// Course 2: FDA Compliance & Reporting - Interactive Components
// 6 modules total

// Re-export existing interactive components
export { default as RegulatoryTimeline } from './RegulatoryTimeline';
export { default as ClassificationFlowchart } from './ClassificationFlowchart';
export { default as FormSelectionWizard } from './FormSelectionWizard';
export { default as HarmonizationComparison } from './HarmonizationComparison';
export { default as ReportTypeSelector } from './ReportTypeSelector';
export { default as JurisdictionMapper } from './JurisdictionMapper';
export { default as VarianceApplicationSimulator } from './VarianceApplicationSimulator';

// Module 2.1: FDA Regulatory Framework
export { default as Module1_FDAFramework } from './Module1_FDAFramework';

// Module 2.2: Variance Applications
export { default as Module2_VarianceApplications } from './Module2_VarianceApplications';

// Module 2.3: Laser Notice 50
export { default as Module3_LaserNotice50 } from './Module3_LaserNotice50';

// Module 2.4: Mandatory Incident Reporting
// Placeholder - uses ReportTypeSelector as base
export { default as Module4_IncidentReporting } from './ReportTypeSelector';

// Module 2.5: FDA Forms & Documentation
// Placeholder - uses FormSelectionWizard as base
export { default as Module5_FDAForms } from './FormSelectionWizard';

// Module 2.6: State vs. Federal Jurisdiction
// Placeholder - uses JurisdictionMapper as base
export { default as Module6_Jurisdiction } from './JurisdictionMapper';
