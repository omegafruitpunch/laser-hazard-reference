// Type definitions for Module 7.4: Emergency Response Procedures

export interface EmergencyScenario {
  id: string;
  title: string;
  description: string;
  initialSituation: string;
  phases: ScenarioPhase[];
  learningObjectives: string[];
}

export interface ScenarioPhase {
  id: string;
  title: string;
  description: string;
  decisions: DecisionPoint[];
}

export interface DecisionPoint {
  id: string;
  situation: string;
  options: DecisionOption[];
  timeLimit?: number; // seconds for decision
  feedbackDelay?: boolean; // Whether to delay feedback for realism
}

export interface DecisionOption {
  id: string;
  label: string;
  consequence: string;
  isCorrect: boolean;
  nextPhaseId?: string;
  impact: 'positive' | 'neutral' | 'negative' | 'critical';
}

export interface ICSRole {
  id: string;
  title: string;
  shortTitle: string;
  section: 'command' | 'operations' | 'planning' | 'logistics' | 'finance';
  description: string;
  responsibilities: string[];
  authorityLevel: 'full' | 'significant' | 'limited' | 'advisory';
  reportsTo: string;
  keyDecisions: string[];
  icon: string;
}

export interface ICSChainOfCommand {
  level: number;
  role: string;
  responsibilities: string[];
}

export interface EmergencyContact {
  agency: string;
  role: string;
  primaryResponsibility: string;
  triggerForContact: string;
  contactMethod: string;
}

export interface TriageCategory {
  category: 'immediate' | 'delayed' | 'minor' | 'deceased';
  label: string;
  color: string;
  description: string;
  criteria: string[];
  treatmentPriority: number;
}

export interface CommunicationProtocol {
  protocol: string;
  code: string;
  meaning: string;
  action: string;
  urgency: 'critical' | 'urgent' | 'routine';
}

export interface IncidentDocument {
  id: string;
  title: string;
  description: string;
  requiredFields: DocumentField[];
  sampleTemplate: string;
}

export interface DocumentField {
  name: string;
  type: 'text' | 'datetime' | 'select' | 'textarea' | 'checkbox';
  required: boolean;
  placeholder?: string;
  options?: string[];
  hint?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'nims' | 'ics' | 'procedures' | 'coordination';
}

export interface ModulePhase {
  id: string;
  title: string;
  duration: number;
  type: 'warmup' | 'core' | 'practice' | 'challenge';
}
