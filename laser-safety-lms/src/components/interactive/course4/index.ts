// Course 4: US State & Local Regulations - Interactive Components
// 10 modules total

// ============================================================================
// Original components (maintained for backward compatibility)
// ============================================================================
export { StateRequirementsComparator } from "./StateRequirementsComparator";
export { PermitRequirementFinder } from "./PermitRequirementFinder";
export { LicensingTimelineVisualizer } from "./LicensingTimelineVisualizer";
export { StateMatrix } from "./StateMatrix";
export { TourPlanner } from "./TourPlanner";
export { NotificationCalculator } from "./NotificationCalculator";
export { ChecklistGenerator } from "./ChecklistGenerator";

// WCAG 2.2 AA Accessible Components (Recommended for new implementations)
export { StateMatrixAccessible } from "./StateMatrixAccessible";
export { PermitWizardAccessible } from "./PermitWizardAccessible";
export { TimelineCalculatorAccessible } from "./TimelineCalculatorAccessible";

// Accessibility Hooks
export {
  useAccessibleStateSelector,
  useAccessibleTable,
  useAccessibleWizard,
} from "./hooks";

// Type exports
export type {
  UseAccessibleStateSelectorOptions,
  UseAccessibleStateSelectorReturn,
  UseAccessibleTableOptions,
  UseAccessibleTableReturn,
  TableColumn,
  UseAccessibleWizardOptions,
  UseAccessibleWizardReturn,
  WizardStep as AccessibleWizardStep,
} from "./hooks";

// ============================================================================
// Module Components (10 state modules)
// ============================================================================

// Module 4.1: California Laser Regulations
export { default as Module1_California } from "./Module1_CA_CO";

// Module 4.2: Florida Laser Regulations
export { default as Module2_Florida } from "./Module2_FL_GA";

// Module 4.3: New York Laser Regulations
export { default as Module3_NewYork } from "./Module3_IL_MA";

// Module 4.4: Texas Laser Regulations
export { default as Module4_Texas } from "./Module4_NV_NY_TX_WA";

// Module 4.5: Nevada Laser Regulations
export { default as Module5_Nevada } from "./Module4_NV_NY_TX_WA";

// Module 4.6: Illinois Laser Regulations
export { default as Module6_Illinois } from "./Module3_IL_MA";

// Module 4.7: Georgia Laser Regulations
export { default as Module7_Georgia } from "./Module2_FL_GA";

// Module 4.8: Washington State Regulations
export { default as Module8_Washington } from "./Module4_NV_NY_TX_WA";

// Module 4.9: Massachusetts Laser Regulations
export { default as Module9_Massachusetts } from "./Module3_IL_MA";

// Module 4.10: Colorado Laser Regulations
export { default as Module10_Colorado } from "./Module1_CA_CO";

// ============================================================================
// Default exports for dynamic imports
// ============================================================================
export { default as StateRequirementsComparatorDefault } from "./StateRequirementsComparator";
export { default as PermitRequirementFinderDefault } from "./PermitRequirementFinder";
export { default as LicensingTimelineVisualizerDefault } from "./LicensingTimelineVisualizer";
export { default as StateMatrixDefault } from "./StateMatrix";
export { default as TourPlannerDefault } from "./TourPlanner";
export { default as NotificationCalculatorDefault } from "./NotificationCalculator";
export { default as ChecklistGeneratorDefault } from "./ChecklistGenerator";

// Accessible component defaults
export { default as StateMatrixAccessibleDefault } from "./StateMatrixAccessible";
export { default as PermitWizardAccessibleDefault } from "./PermitWizardAccessible";
export { default as TimelineCalculatorAccessibleDefault } from "./TimelineCalculatorAccessible";

// ============================================================================
// Module metadata for course structure
// ============================================================================
export const course4Metadata = {
  courseId: 'course-4',
  courseName: 'US State & Local Regulations',
  description: 'State-by-state guide to laser entertainment regulations',
  totalModules: 10,
  modules: [
    { id: 'c4-m1', state: 'California', component: 'Module1_California' },
    { id: 'c4-m2', state: 'Florida', component: 'Module2_Florida' },
    { id: 'c4-m3', state: 'New York', component: 'Module3_NewYork' },
    { id: 'c4-m4', state: 'Texas', component: 'Module4_Texas' },
    { id: 'c4-m5', state: 'Nevada', component: 'Module5_Nevada' },
    { id: 'c4-m6', state: 'Illinois', component: 'Module6_Illinois' },
    { id: 'c4-m7', state: 'Georgia', component: 'Module7_Georgia' },
    { id: 'c4-m8', state: 'Washington', component: 'Module8_Washington' },
    { id: 'c4-m9', state: 'Massachusetts', component: 'Module9_Massachusetts' },
    { id: 'c4-m10', state: 'Colorado', component: 'Module10_Colorado' },
  ]
};
