// Type definitions for Module 8.4: Compliance Documentation

export interface ChecklistItem {
  id: string;
  category: string;
  description: string;
  required: boolean;
  regulation: string;
  verificationMethod: string;
  frequency: string;
  documentationType: string;
}

export interface OperationType {
  id: string;
  name: string;
  description: string;
  applicableChecklists: string[];
  specificRequirements: string[];
  notificationRequirements: NotificationRequirement[];
}

export interface NotificationRequirement {
  authority: string;
  timing: string;
  method: string;
  requiredInfo: string[];
  frequency: string;
}

export interface SOPSection {
  id: string;
  title: string;
  description: string;
  steps: SOPStep[];
  responsibleParty: string;
  references: string[];
}

export interface SOPStep {
  id: string;
  order: number;
  action: string;
  details: string;
  verification?: string;
  hazards?: string[];
  ppe?: string[];
}

export interface SOPTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  sections: SOPSection[];
  applicableOperations: string[];
  approvalRequired: boolean;
  reviewFrequency: string;
}

export interface AuditQuestion {
  id: string;
  category: string;
  question: string;
  regulation: string;
  evidenceRequired: string[];
  complianceCriteria: string;
  severity: 'critical' | 'major' | 'minor';
  points: number;
}

export interface AuditScenario {
  id: string;
  name: string;
  description: string;
  operationType: string;
  venue: string;
  questions: AuditQuestion[];
  passingScore: number;
  timeLimit: number;
}

export interface DocumentationPackage {
  id: string;
  name: string;
  description: string;
  documents: RequiredDocument[];
  operationTypes: string[];
}

export interface RequiredDocument {
  id: string;
  name: string;
  description: string;
  template?: string;
  required: boolean;
  retentionPeriod: string;
}

export interface CompliancePhase {
  id: string;
  title: string;
  duration: number;
  type: 'warmup' | 'core' | 'practice' | 'challenge';
}
