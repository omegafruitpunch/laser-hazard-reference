// Type definitions for Module 8.5: Electrical Safety Standards

export interface ElectricalHazard {
  id: string;
  name: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  commonSources: string[];
  mitigationStrategies: string[];
  relevantStandards: string[];
}

export interface InspectionChecklist {
  id: string;
  category: string;
  item: string;
  inspectionMethod: string;
  passCriteria: string;
  frequency: string;
  hazardLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface EquipmentCategory {
  id: string;
  name: string;
  description: string;
  inspectionItems: string[];
  commonFailures: string[];
}

export interface SafetyDevice {
  id: string;
  name: string;
  type: 'interlock' | 'ground_fault' | 'surge_protection' | 'emergency_stop' | 'circuit_breaker';
  purpose: string;
  testMethod: string;
  testFrequency: string;
  applicableEquipment: string[];
}

export interface InspectionResult {
  checklistId: string;
  passed: boolean;
  notes: string;
  inspectedBy: string;
  inspectedAt: Date;
  photos?: string[];
}

export interface InspectionReport {
  id: string;
  equipmentId: string;
  equipmentType: string;
  location: string;
  inspectionDate: Date;
  nextInspectionDate: Date;
  overallStatus: 'pass' | 'conditional' | 'fail';
  findings: InspectionResult[];
  recommendations: string[];
  inspectorName: string;
  inspectorCertification?: string;
}

export interface ElectricalScenario {
  id: string;
  title: string;
  description: string;
  equipment: string;
  hazards: string[];
  inspectionPoints: InspectionPoint[];
  correctActions: string[];
  incorrectActions: string[];
}

export interface InspectionPoint {
  id: string;
  description: string;
  category: string;
  correctCondition: string;
  commonDefects: string[];
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export interface InteractiveScenario {
  id: string;
  title: string;
  setup: string;
  equipment: EquipmentSpec[];
  steps: ScenarioStep[];
  objectives: string[];
  passingScore: number;
}

export interface EquipmentSpec {
  id: string;
  name: string;
  type: string;
  voltage: string;
  powerRating: string;
  safetyFeatures: string[];
}

export interface ScenarioStep {
  id: string;
  order: number;
  description: string;
  options: ScenarioOption[];
  explanation: string;
}

export interface ScenarioOption {
  id: string;
  text: string;
  correct: boolean;
  feedback: string;
}

export interface ModulePhase {
  id: string;
  title: string;
  duration: number;
  type: 'warmup' | 'core' | 'practice' | 'challenge';
}
