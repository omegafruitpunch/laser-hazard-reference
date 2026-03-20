/**
 * Core Types for Laser Safety LMS
 */

// ============ Course Types ============

export interface Module {
  id: string;
  courseId?: string;
  title: string;
  description: string;
  pdfPath: string;
  keyTakeaways: string[];
  estimatedMinutes: number;
  order?: number;
  duration?: number;
  difficulty?: string;
  phases?: Phase[];
  prerequisites?: string[];
  components?: Component[];
  knowledgeNodes?: string[];
}

export interface Component {
  id?: string;
  type?: string;
  title?: string;
  required?: boolean;
  estimatedMinutes?: number;
  content?: string;
}

export interface CompletionCriterion {
  type: 'time' | 'interaction' | 'quiz-pass' | 'manual';
  threshold?: number;
}

export interface Phase {
  id?: string;
  type?: 'warmup' | 'core' | 'practice' | 'challenge';
  title?: string;
  name?: string;
  content?: string;
  description?: string;
  component?: string;
  components?: Component[];
  quizId?: string;
  estimatedMinutes: number;
  completionCriteria?: CompletionCriterion;
}

export interface Resource {
  type: 'pdf' | 'interactive' | 'video' | 'link';
  title: string;
  path?: string;
  component?: string;
  url?: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  coverColor: string;
  icon: string;
  totalMinutes: number;
  modules: Module[];
  prerequisites: string[];
  learningObjectives?: string[];
  estimatedCompletionDays?: number;
  certificationEligible?: boolean;
  version?: string;
  lastUpdated?: string;
}

// ============ Quiz Types ============

export interface QuizQuestion {
  id: string;
  type?: 'multiple_choice' | 'true_false' | 'multiple_select';
  question: string;
  options: string[];
  correctIndex: number;
  correctIndices?: number[]; // For multiple_select
  explanation: string;
}

export interface QuizBank {
  id: string;
  courseId: string;
  title: string;
  description: string;
  passingScore: number;
  timeLimit: number;
  randomizeQuestions: boolean;
  questions: QuizQuestion[];
  metadata: {
    version: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface QuizResult {
  score: number;
  correct: number;
  total: number;
  percentage: number;
  passed: boolean;
  passingScore: number;
  results: Array<{
    questionId: string;
    correct: boolean;
    selectedAnswer: number;
    correctAnswer: number;
  }>;
  timeSpent?: number;
  completedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: Record<string, number>;
  result: QuizResult;
  startedAt: string;
  completedAt?: string;
}

// ============ Progress Types ============

export interface ModuleProgress {
  moduleId: string;
  courseId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number; // 0-100
  completedPhases: string[];
  startedAt?: string;
  completedAt?: string;
  timeSpent: number; // seconds
}

export interface CourseProgress {
  courseId: string;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  progress: number; // 0-100
  completedModules: string[];
  quizScore?: number;
  quizPassed?: boolean;
  quizAttempts: number;
  startedAt?: string;
  completedAt?: string;
  certificateIssued?: boolean;
  certificateUrl?: string;
}

export interface UserProgress {
  userId: string;
  courses: Record<string, CourseProgress>;
  modules: Record<string, ModuleProgress>;
  totalTimeSpent: number;
  streakDays: number;
  lastActivityAt: string;
}

// ============ Knowledge Graph Types ============

export interface KnowledgeEntity {
  global_id: string;
  name: string;
  type: string;
  attributes: Record<string, unknown>;
  course_origins: string[];
  aliases?: string[];
}

export interface KnowledgeRelationship {
  source: string;
  target: string;
  type: string;
  description?: string;
}

export interface KnowledgeGraph {
  version: string;
  generated_at: string;
  total_entities: number;
  total_relationships: number;
  entity_types: string[];
  relationship_types: string[];
  entities: KnowledgeEntity[];
  relationships: KnowledgeRelationship[];
}

export interface SemanticIndex {
  version: string;
  description: string;
  generated_at: string;
  index_type: string;
  terms: Record<string, string[]>;
  synonyms: Record<string, string[]>;
  metadata: {
    total_terms: number;
    total_documents: number;
    language: string;
  };
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  target_audience: string;
  estimated_hours: number;
  prerequisites: string[];
  certification: string;
  courses: Array<{
    course_id: string;
    required: boolean;
    order: number;
  }>;
}

export interface LearningPaths {
  version: string;
  description: string;
  generated_at: string;
  paths: LearningPath[];
  skills_matrix: Record<string, string[]>;
}

// ============ User Types ============

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'learner' | 'instructor' | 'admin';
  preferences: UserPreferences;
  achievements: Achievement[];
  createdAt: string;
  updatedAt: string;
}

export interface UserPreferences {
  emailNotifications: boolean;
  darkMode: boolean;
  language: string;
  accessibilityMode: boolean;
  autoPlayVideos: boolean;
}

export interface Achievement {
  id: string;
  type: 'course_completion' | 'quiz_perfect' | 'streak' | 'milestone';
  title: string;
  description: string;
  icon: string;
  earnedAt: string;
  courseId?: string;
}

// ============ API Response Types ============

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: unknown;
  };
  meta?: {
    timestamp: string;
    requestId: string;
    pagination?: {
      page: number;
      pageSize: number;
      total: number;
      totalPages: number;
    };
  };
}

export interface SearchResult<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
}

// ============ Legacy Types (for backward compatibility) ============

export interface LegacyModule {
  id: string;
  title: string;
  description: string;
  pdfPath: string;
  keyTakeaways: string[];
  estimatedMinutes: number;
}

export interface LegacyCourse {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  modules: LegacyModule[];
  totalMinutes: number;
  coverColor: string;
  icon: string;
}

// Re-export all LMS types for convenience
export * from './lms';
