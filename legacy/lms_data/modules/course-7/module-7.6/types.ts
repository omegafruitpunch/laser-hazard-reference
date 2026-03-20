// Type definitions for Module 7.6: Insurance & Liability

export interface LiabilityScenario {
  id: string;
  title: string;
  description: string;
  incidentType: string;
  parties: InvolvedParty[];
  facts: string[];
  evidence: EvidenceItem[];
  questions: LiabilityQuestion[];
}

export interface InvolvedParty {
  name: string;
  role: string;
  potentialLiability: 'high' | 'medium' | 'low' | 'none';
  insuranceTypes: string[];
  actions: string[];
}

export interface EvidenceItem {
  type: string;
  description: string;
  relevance: string;
  admissibility: 'high' | 'medium' | 'low';
}

export interface LiabilityQuestion {
  id: string;
  question: string;
  options: LiabilityOption[];
  correctRationale: string;
  legalBasis: string;
}

export interface LiabilityOption {
  id: string;
  label: string;
  isCorrect: boolean;
  explanation: string;
}

export interface InsuranceCoverage {
  type: string;
  description: string;
  typicalLimits: string;
  coveredEvents: string[];
  exclusions: string[];
  premiumFactors: string[];
  importance: 'essential' | 'recommended' | 'optional';
}

export interface RiskAssessment {
  id: string;
  category: string;
  risk: string;
  probability: 'high' | 'medium' | 'low';
  severity: 'catastrophic' | 'serious' | 'moderate' | 'minor';
  mitigationStrategies: string[];
  transferOptions: string[];
  residualRisk: string;
}

export interface ContractClause {
  id: string;
  clauseType: string;
  title: string;
  purpose: string;
  standardLanguage: string;
  redFlags: string[];
  negotiablePoints: string[];
}

export interface IncidentReport {
  id: string;
  title: string;
  description: string;
  sections: ReportSection[];
  timeline: TimelineEvent[];
  attachments: AttachmentType[];
}

export interface ReportSection {
  name: string;
  required: boolean;
  fields: ReportField[];
}

export interface ReportField {
  name: string;
  type: 'text' | 'datetime' | 'select' | 'textarea' | 'checkbox' | 'file';
  required: boolean;
  guidance: string;
}

export interface TimelineEvent {
  timestamp: string;
  event: string;
  source: string;
  verified: boolean;
}

export interface AttachmentType {
  type: string;
  description: string;
  format: string;
  retentionPeriod: string;
}

export interface DocumentationRequirement {
  document: string;
  purpose: string;
  retentionPeriod: string;
  accessibility: string;
  legalSignificance: string;
}

export interface LiabilityAssessmentTool {
  id: string;
  name: string;
  description: string;
  factors: AssessmentFactor[];
  scoringMatrix: ScoreLevel[];
}

export interface AssessmentFactor {
  factor: string;
  weight: number;
  criteria: string[];
}

export interface ScoreLevel {
  range: string;
  riskLevel: string;
  recommendation: string;
  actions: string[];
}

export interface MutualAidAgreement {
  provision: string;
  description: string;
  liabilityImplication: string;
  riskMitigation: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'insurance' | 'liability' | 'contracts' | 'documentation';
}

export interface ModulePhase {
  id: string;
  title: string;
  duration: number;
  type: 'warmup' | 'core' | 'practice' | 'challenge';
}
