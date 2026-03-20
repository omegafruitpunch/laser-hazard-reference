// Type definitions for Module 7.5: Weather Protocols & Evacuation

export interface WeatherThreshold {
  id: string;
  condition: string;
  severity: 'monitor' | 'caution' | 'warning' | 'critical';
  threshold: string;
  alertMethod: string;
  actions: AreaAction[];
  allClearRequired: boolean;
}

export interface AreaAction {
  area: string;
  action: string;
  priority: number;
  estimatedTime: string;
}

export interface WeatherScenario {
  id: string;
  title: string;
  description: string;
  initialConditions: WeatherCondition;
  progression: WeatherEvent[];
  decisionPoints: WeatherDecisionPoint[];
}

export interface WeatherCondition {
  temperature: number;
  windSpeed: number;
  windGusts: number;
  precipitation: string;
  lightningDistance?: number;
  radarStatus: string;
  timeToImpact?: string;
}

export interface WeatherEvent {
  id: string;
  timeOffset: number; // minutes from start
  condition: WeatherCondition;
  alertLevel: 'green' | 'yellow' | 'orange' | 'red';
  message: string;
}

export interface WeatherDecisionPoint {
  id: string;
  situation: string;
  options: WeatherDecisionOption[];
  correctTiming: number; // minutes from event start when decision should be made
}

export interface WeatherDecisionOption {
  id: string;
  label: string;
  consequence: string;
  isOptimal: boolean;
  safetyImpact: 'high' | 'medium' | 'low';
}

export interface DecisionMatrix {
  rows: DecisionMatrixRow[];
  columns: DecisionMatrixColumn[];
  cells: DecisionMatrixCell[][];
}

export interface DecisionMatrixRow {
  id: string;
  condition: string;
  threshold: string;
}

export interface DecisionMatrixColumn {
  id: string;
  productionArea: string;
  responsibilities: string[];
}

export interface DecisionMatrixCell {
  action: string;
  timing: string;
  priority: number;
  evacuationRequired: boolean;
}

export interface EvacuationRoute {
  id: string;
  name: string;
  startPoint: string;
  destination: string;
  capacity: number;
  accessibility: boolean;
  estimatedTime: string;
  alternativeRoute?: string;
}

export interface EvacuationProcedure {
  trigger: string;
  phases: EvacuationPhase[];
  personnelAssignments: PersonnelAssignment[];
}

export interface EvacuationPhase {
  order: number;
  name: string;
  duration: string;
  actions: string[];
  completionCriteria: string;
}

export interface PersonnelAssignment {
  role: string;
  responsibility: string;
  location: string;
  equipment: string[];
}

export interface AlertSignal {
  type: string;
  pattern: string;
  meaning: string;
  response: string;
}

export interface WeatherMonitoringTool {
  id: string;
  name: string;
  purpose: string;
  dataPoints: string[];
  thresholdAlerts: ThresholdAlert[];
}

export interface ThresholdAlert {
  parameter: string;
  warningValue: string;
  criticalValue: string;
  action: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'thresholds' | 'protocols' | 'evacuation' | 'alerts';
}

export interface ModulePhase {
  id: string;
  title: string;
  duration: number;
  type: 'warmup' | 'core' | 'practice' | 'challenge';
}
