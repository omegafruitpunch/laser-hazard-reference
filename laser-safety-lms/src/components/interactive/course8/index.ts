// ============================================================================
// Course 8: Entertainment Technology Standards - Interactive Components
// 5 modules total
// ============================================================================

// ============================================================================
// Import components for aliasing
// ============================================================================
import { StandardsHierarchyVisualizer } from "./StandardsHierarchyVisualizer";
import { Z136Navigator } from "./Z136Navigator";
import { E146ComplianceChecker } from "./E146ComplianceChecker";
import { ControlMeasurePrioritizer } from "./ControlMeasurePrioritizer";
import { DocumentationTemplateGallery } from "./DocumentationTemplateGallery";
import { ChecklistGenerator as StandardsChecklistGenerator } from "./ChecklistGenerator";
import { AuditSimulator } from "./AuditSimulator";
import { CertificationExamSimulator } from "./CertificationExamSimulator";
import { KnowledgeGapAnalyzer } from "./KnowledgeGapAnalyzer";
import { StudyPlanGenerator } from "./StudyPlanGenerator";

// ============================================================================
// Module 8.1: ANSI Z136 Series Overview
// ============================================================================
export { 
  StandardsHierarchyVisualizer, 
  DEFAULT_Z136_HIERARCHY,
  type StandardNode 
} from "./StandardsHierarchyVisualizer";

export { 
  Z136Navigator, 
  DEFAULT_Z136_SECTIONS,
  type Z136Section,
  type Z136Subsection 
} from "./Z136Navigator";

// ============================================================================
// Module 8.2: ANSI E1.46 - Entertainment Laser Safety
// ============================================================================
export { 
  E146ComplianceChecker,
  DEFAULT_COMPLIANCE_CATEGORIES,
  type ComplianceItem,
  type ComplianceCategory,
  type ComplianceReport 
} from "./E146ComplianceChecker";

// ============================================================================
// Module 8.3: ESTA Standards & Control Measures
// ============================================================================
export { 
  ControlMeasurePrioritizer,
  DEFAULT_SCENARIOS,
  type ControlMeasure,
  type Scenario,
  type ControlLevel 
} from "./ControlMeasurePrioritizer";

export { 
  DocumentationTemplateGallery,
  DEFAULT_TEMPLATES,
  type DocumentTemplate,
  type TemplateField,
  type TemplateSection 
} from "./DocumentationTemplateGallery";

// ============================================================================
// Module 8.4: Electrical Safety Standards
// ============================================================================
export { 
  ChecklistGenerator as StandardsChecklistGenerator,
  DEFAULT_CHECKLIST_TEMPLATES,
  type ChecklistTemplate,
  type ChecklistItem,
  type GeneratedChecklist 
} from "./ChecklistGenerator";

// ============================================================================
// Module 8.5: Certification & Assessment Tools
// ============================================================================
export { 
  AuditSimulator,
  DEFAULT_AUDIT_SCENARIOS,
  type AuditScenario,
  type AuditItem,
  type AuditReport 
} from "./AuditSimulator";

export { 
  CertificationExamSimulator,
  DEFAULT_EXAM_CONFIGS,
  DEFAULT_QUESTION_BANK,
  type ExamConfig,
  type ExamQuestion,
  type ExamResult 
} from "./CertificationExamSimulator";

export { 
  KnowledgeGapAnalyzer,
  DEFAULT_KNOWLEDGE_TOPICS,
  type KnowledgeTopic,
  type KnowledgeAssessment,
  type GapAnalysisResult 
} from "./KnowledgeGapAnalyzer";

export { 
  StudyPlanGenerator,
  type StudyPlan,
  type StudyDay,
  type StudySession,
  type StudySessionType 
} from "./StudyPlanGenerator";

// ============================================================================
// Module Component Aliases (for page.tsx mapping)
// ============================================================================

// Module 8.1: ANSI Z136 Laser Safety Standards
export { StandardsHierarchyVisualizer as Module1_ANSIZ136 };

// Module 8.2: ESTA Entertainment Standards
export { E146ComplianceChecker as Module2_ESTAStandards };

// Module 8.3: ANSI E1.46 Entertainment Laser Standard
export { ControlMeasurePrioritizer as Module3_E146Standard };

// Module 8.4: Electrical Safety Standards for Laser Equipment
export { StandardsChecklistGenerator as Module4_ElectricalSafety };

// Module 8.5: Standards Compliance Documentation
export { DocumentationTemplateGallery as Module5_ComplianceDocs };

// ============================================================================
// Module metadata for course structure
// ============================================================================
export const course8Metadata = {
  courseId: 'course-8',
  courseName: 'Entertainment Technology Standards',
  description: 'ANSI/ESTA standards for entertainment technology',
  totalModules: 5,
  modules: [
    { id: 'c8-m1', title: 'ANSI Z136 Standards', component: 'Module1_ANSIZ136' },
    { id: 'c8-m2', title: 'ESTA Standards', component: 'Module2_ESTAStandards' },
    { id: 'c8-m3', title: 'ANSI E1.46 Standard', component: 'Module3_E146Standard' },
    { id: 'c8-m4', title: 'Electrical Safety Standards', component: 'Module4_ElectricalSafety' },
    { id: 'c8-m5', title: 'Compliance Documentation', component: 'Module5_ComplianceDocs' },
  ]
};
