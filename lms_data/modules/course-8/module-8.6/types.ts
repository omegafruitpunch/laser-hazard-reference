// Type definitions for Module 8.6: Integration & Certification Prep

export interface CertificationExam {
  id: string;
  name: string;
  description: string;
  type: 'CLSO' | 'CMLSO' | 'Custom';
  duration: number; // minutes
  questionCount: number;
  passingScore: number;
  categories: ExamCategory[];
}

export interface ExamCategory {
  id: string;
  name: string;
  weight: number; // percentage of total score
  questions: ExamQuestion[];
}

export interface ExamQuestion {
  id: string;
  type: 'multiple_choice' | 'multiple_select' | 'true_false' | 'scenario';
  category: string;
  question: string;
  options?: string[];
  correctAnswer: number | number[];
  explanation: string;
  reference: string;
  difficulty: 'easy' | 'medium' | 'hard';
  points: number;
  imageUrl?: string;
}

export interface ExamAttempt {
  examId: string;
  startTime: Date;
  endTime?: Date;
  answers: ExamAnswer[];
  score: number;
  passed: boolean;
  timeSpent: number;
}

export interface ExamAnswer {
  questionId: string;
  answer: number | number[];
  correct: boolean;
  timeSpent: number;
}

export interface KnowledgeDomain {
  id: string;
  name: string;
  description: string;
  courses: string[];
  weight: number;
  competencies: Competency[];
}

export interface Competency {
  id: string;
  statement: string;
  level: 'basic' | 'intermediate' | 'advanced';
  assessed: boolean;
}

export interface GapAnalysis {
  domainId: string;
  domainName: string;
  score: number;
  targetScore: number;
  gaps: string[];
  recommendations: string[];
}

export interface StudyPlan {
  id: string;
  userId: string;
  createdAt: Date;
  targetExamDate?: Date;
  weeklyHours: number;
  sections: StudySection[];
  gapAnalysis: GapAnalysis[];
}

export interface StudySection {
  id: string;
  title: string;
  domain: string;
  duration: number; // estimated minutes
  resources: StudyResource[];
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
}

export interface StudyResource {
  id: string;
  type: 'reading' | 'video' | 'practice' | 'assessment';
  title: string;
  url?: string;
  duration: number;
}

export interface CourseIntegration {
  courseId: string;
  courseName: string;
  keyConcepts: string[];
  relationshipToCompliance: string;
  practicalApplications: string[];
}

export interface IntegrationMap {
  standards: StandardIntegration[];
  procedures: ProcedureIntegration[];
  documentation: DocumentationIntegration[];
}

export interface StandardIntegration {
  standardId: string;
  standardName: string;
  applicableCourses: string[];
  keyRequirements: string[];
}

export interface ProcedureIntegration {
  procedureId: string;
  procedureName: string;
  applicableCourses: string[];
  steps: string[];
}

export interface DocumentationIntegration {
  documentType: string;
  requiredCourses: string[];
  elements: string[];
}

export interface ModulePhase {
  id: string;
  title: string;
  duration: number;
  type: 'warmup' | 'core' | 'practice' | 'challenge';
}
