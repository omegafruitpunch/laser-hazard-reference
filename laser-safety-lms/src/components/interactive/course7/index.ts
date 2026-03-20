// Course 7: Event Safety & Operations - Interactive Components
// 6 modules total

// ============================================================================
// Re-export existing interactive components
// ============================================================================
export { SafetyPlanningTimeline } from "./SafetyPlanningTimeline";
export { VenueAssessmentTool } from "./VenueAssessmentTool";
export { FireSafetyInspector } from "./FireSafetyInspector";
export { CrowdDensityCalculator } from "./CrowdDensityCalculator";
export { EmergencyEgressPlanner } from "./EmergencyEgressPlanner";
export { EmergencyResponseSimulator as EventEmergencyResponseSimulator } from "./EmergencyResponseSimulator";
export { NIMSICSRoleExplorer } from "./NIMSICSRoleExplorer";
export { WeatherDecisionMatrix } from "./WeatherDecisionMatrix";

// ============================================================================
// Module Components (6 modules)
// ============================================================================

// Module 7.1: Event Safety Planning
export { default as Module1_EventPlanning } from "./SafetyPlanningTimeline";

// Module 7.2: Crowd Safety & Dynamics
export { default as Module2_CrowdSafety } from "./CrowdDensityCalculator";

// Module 7.3: Weather Protocols for Outdoor Events
export { default as Module3_WeatherProtocols } from "./WeatherDecisionMatrix";

// Module 7.4: Venue Assessment Checklist
export { default as Module4_VenueAssessment } from "./VenueAssessmentTool";

// Module 7.5: Emergency Response Procedures
export { default as Module5_EmergencyResponse } from "./EmergencyResponseSimulator";

// Module 7.6: Insurance & Liability
// Placeholder - uses NIMSICSRoleExplorer for incident command structure related to liability
export { default as Module6_Insurance } from "./NIMSICSRoleExplorer";

// ============================================================================
// Module metadata for course structure
// ============================================================================
export const course7Metadata = {
  courseId: 'course-7',
  courseName: 'Event Safety & Operations',
  description: 'Comprehensive event safety management',
  totalModules: 6,
  modules: [
    { id: 'c7-m1', title: 'Event Safety Planning', component: 'Module1_EventPlanning' },
    { id: 'c7-m2', title: 'Crowd Safety & Dynamics', component: 'Module2_CrowdSafety' },
    { id: 'c7-m3', title: 'Weather Protocols', component: 'Module3_WeatherProtocols' },
    { id: 'c7-m4', title: 'Venue Assessment', component: 'Module4_VenueAssessment' },
    { id: 'c7-m5', title: 'Emergency Response', component: 'Module5_EmergencyResponse' },
    { id: 'c7-m6', title: 'Insurance & Liability', component: 'Module6_Insurance' },
  ]
};
