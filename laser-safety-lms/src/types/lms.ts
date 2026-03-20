/**
 * Comprehensive Type Definitions for Laser Safety LMS
 * 
 * This file contains all TypeScript interfaces and types used throughout
 * the LMS application for type safety and code clarity.
 */

import type { Course as CourseFromIndex } from './index';

// ============================================================================
// Core Entity Types
// ============================================================================

export type EntityType = 
  | 'concept' 
  | 'regulation' 
  | 'calculation' 
  | 'safety-procedure' 
  | 'equipment' 
  | 'hazard' 
  | 'standard' 
  | 'certification';

export type DifficultyLevel = 'Beginner' | 'Intermediate' | 'Advanced';

export type CourseCategory = 
  | 'Fundamentals' 
  | 'Regulatory' 
  | 'Safety Science' 
  | 'Operations' 
  | 'Standards';

// ============================================================================
// User & Profile Types
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
  lastActive: string;
  certifications: UserCertification[];
  preferences: UserPreferences;
}

export type UserRole = 'learner' | 'instructor' | 'admin' | 'lso';

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  fontSize: 'small' | 'medium' | 'large';
  reducedMotion: boolean;
  highContrast: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  autoPlayVideos: boolean;
  showCaptions: boolean;
  emailNotifications: boolean;
  reminderFrequency: 'daily' | 'weekly' | 'never';
  studySessionLength: number; // minutes
  breakInterval: number; // minutes
}

export interface UserCertification {
  id: string;
  name: string;
  issuedAt: string;
  expiresAt: string | null;
  issuingBody: string;
  credentialUrl?: string;
}

// ============================================================================
// Course & Module Types
// ============================================================================

export interface Course {
  id: string;
  title: string;
  description: string;
  category: CourseCategory;
  difficulty: DifficultyLevel;
  modules: Module[];
  totalMinutes: number;
  coverColor: string;
  icon: string;
  prerequisites: string[]; // Course IDs
  learningObjectives: string[];
  estimatedCompletionDays: number;
  certificationEligible: boolean;
  version: string;
  lastUpdated: string;
}

export interface Module {
  id: string;
  courseId: string;
  title: string;
  description: string;
  pdfPath: string;
  keyTakeaways: string[];
  estimatedMinutes: number;
  order: number;
  phases: Phase[];
  components: Component[];
  knowledgeNodes: string[]; // Knowledge node IDs
  prerequisites: string[]; // Module IDs within the same course
}

export interface Phase {
  id: string;
  name: string;
  description: string;
  estimatedMinutes: number;
  components: Component[];
  completionCriteria: CompletionCriterion;
}

export type Component = 
  | TextComponent 
  | VideoComponent 
  | InteractiveComponent 
  | QuizComponent 
  | SimulationComponent;

export interface BaseComponent {
  id: string;
  type: ComponentType;
  title?: string;
  required: boolean;
  estimatedMinutes: number;
}

export type ComponentType = 
  | 'text' 
  | 'video' 
  | 'interactive' 
  | 'quiz' 
  | 'simulation' 
  | 'calculator' 
  | 'drag-drop';

export interface TextComponent extends BaseComponent {
  type: 'text';
  content: string;
  highlights?: TextHighlight[];
}

export interface TextHighlight {
  start: number;
  end: number;
  type: 'important' | 'warning' | 'definition' | 'reference';
  note?: string;
}

export interface VideoComponent extends BaseComponent {
  type: 'video';
  src: string;
  thumbnail?: string;
  captions?: string;
  transcript?: string;
  chapters?: VideoChapter[];
}

export interface VideoChapter {
  timestamp: number;
  title: string;
}

export interface InteractiveComponent extends BaseComponent {
  type: 'interactive';
  interactiveType: string;
  config: Record<string, unknown>;
}

export interface QuizComponent extends BaseComponent {
  type: 'quiz';
  questionIds: string[];
  passingScore: number;
  allowRetake: boolean;
  maxAttempts?: number;
}

export interface SimulationComponent extends BaseComponent {
  type: 'simulation';
  scenarioId: string;
  parameters: SimulationParameters;
}

export interface SimulationParameters {
  initialState: Record<string, unknown>;
  variables: SimulationVariable[];
  objectives: string[];
}

export interface SimulationVariable {
  name: string;
  min: number;
  max: number;
  step: number;
  default: number;
  unit?: string;
}

export interface CompletionCriterion {
  type: 'time' | 'interaction' | 'quiz-pass' | 'manual';
  threshold?: number;
}

// ============================================================================
// Quiz & Assessment Types
// ============================================================================

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description: string;
  questions: QuizQuestion[];
  settings: QuizSettings;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctIndex?: number;
  correctAnswer?: string | string[];
  explanation: string;
  hint?: string;
  references?: string[];
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  imageUrl?: string;
}

export type QuestionType = 
  | 'multiple-choice' 
  | 'multiple-select' 
  | 'true-false' 
  | 'fill-in-blank' 
  | 'matching' 
  | 'drag-drop' 
  | 'calculator';

export interface QuizSettings {
  timeLimit?: number; // minutes
  passingScore: number;
  shuffleQuestions: boolean;
  shuffleOptions: boolean;
  showCorrectAnswers: boolean;
  allowRetake: boolean;
  maxAttempts?: number;
  requireAllCorrect: boolean;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  startedAt: string;
  completedAt?: string;
  answers: AnswerRecord[];
  score: number;
  passed: boolean;
  timeSpent: number; // seconds
}

export interface AnswerRecord {
  questionId: string;
  answer: string | string[] | number;
  correct: boolean;
  timeSpent: number;
}

/**
 * Summary of a quiz attempt for course progress tracking
 * Contains essential information without full answer details
 */
export interface QuizAttemptSummary {
  id: string;
  quizId: string;
  score: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number; // seconds
}

// ============================================================================
// Progress Types
// ============================================================================

export interface CourseProgress {
  courseId: string;
  userId: string;
  status: CourseStatus;
  completedModules: string[];
  moduleProgress: Record<string, ModuleProgress>;
  quizScore?: number;
  quizPassed?: boolean;
  quizAttempts: QuizAttemptSummary[];
  startedAt: string;
  lastAccessedAt: string;
  completedAt?: string;
  totalTimeSpent: number; // minutes
  certificateIssued?: boolean;
  certificateUrl?: string;
}

export type CourseStatus = 'not-started' | 'in-progress' | 'completed' | 'locked';

export interface ModuleProgress {
  moduleId: string;
  status: ModuleStatus;
  phasesCompleted: string[];
  componentsCompleted: string[];
  quizScore?: number;
  quizPassed?: boolean;
  startedAt?: string;
  completedAt?: string;
  timeSpent: number; // minutes
  notes?: string;
}

export type ModuleStatus = 'not-started' | 'in-progress' | 'completed' | 'locked';

export interface OverallProgress {
  userId: string;
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  totalModules: number;
  completedModules: number;
  totalTimeSpent: number; // minutes
  averageQuizScore: number;
  currentStreak: number; // days
  longestStreak: number;
  lastStudyDate?: string;
  achievements: Achievement[];
  weeklyGoal: WeeklyGoal;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedAt: string;
  category: AchievementCategory;
}

export type AchievementCategory = 
  | 'completion' 
  | 'mastery' 
  | 'streak' 
  | 'speed' 
  | 'accuracy' 
  | 'exploration';

export interface WeeklyGoal {
  targetMinutes: number;
  completedMinutes: number;
  weekStart: string;
}

// ============================================================================
// Knowledge Graph Types
// ============================================================================

export interface KnowledgeNode {
  id: string;
  type: EntityType;
  name: string;
  description: string;
  difficulty: DifficultyLevel;
  courses: string[]; // Course IDs
  modules: string[]; // Module IDs
  prerequisites: string[]; // Knowledge node IDs
  relatedNodes: string[]; // Knowledge node IDs
  learningOutcomes: string[];
  resources: Resource[];
  masteryLevel: MasteryLevel;
  position: NodePosition;
}

export type MasteryLevel = 'unknown' | 'exposure' | 'familiar' | 'proficient' | 'expert';

export interface NodePosition {
  x: number;
  y: number;
  layer: number;
}

export interface Resource {
  id: string;
  type: ResourceType;
  title: string;
  url: string;
  description?: string;
}

export type ResourceType = 'pdf' | 'video' | 'external-link' | 'calculator' | 'reference';

export interface KnowledgeEdge {
  id: string;
  source: string;
  target: string;
  type: EdgeType;
  strength: number; // 0-1
}

export type EdgeType = 'prerequisite' | 'related' | 'builds-on' | 'applies-to';

export interface KnowledgeGraph {
  nodes: KnowledgeNode[];
  edges: KnowledgeEdge[];
  userId: string;
  lastUpdated: string;
}

// ============================================================================
// Learning Path Types
// ============================================================================

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetCertification?: string;
  targetRole?: string;
  difficulty: DifficultyLevel;
  estimatedDays: number;
  courses: PathCourse[];
  milestones: Milestone[];
  prerequisites: string[]; // Course IDs
  recommendedFor: string[]; // User role or skill level
}

export interface PathCourse {
  courseId: string;
  order: number;
  required: boolean;
  unlockCriteria?: UnlockCriterion;
}

export interface UnlockCriterion {
  type: 'course-complete' | 'quiz-score' | 'time-delay' | 'manual';
  threshold?: number;
  courseId?: string;
}

export interface Milestone {
  id: string;
  name: string;
  description: string;
  criteria: MilestoneCriteria;
  reward?: string;
}

export interface MilestoneCriteria {
  type: 'courses-complete' | 'modules-complete' | 'quiz-average' | 'time-spent';
  threshold: number;
}

// ============================================================================
// Gap Analysis Types
// ============================================================================

export interface GapAnalysis {
  userId: string;
  targetCertification: string;
  completedAt: string;
  currentKnowledge: KnowledgeNodeSummary[];
  requiredKnowledge: KnowledgeNodeSummary[];
  gaps: KnowledgeGap[];
  recommendations: GapRecommendation[];
}

export interface KnowledgeNodeSummary {
  nodeId: string;
  name: string;
  masteryLevel: MasteryLevel;
}

export interface KnowledgeGap {
  nodeId: string;
  name: string;
  requiredLevel: MasteryLevel;
  currentLevel: MasteryLevel;
  priority: 'high' | 'medium' | 'low';
  relatedCourses: string[];
}

export interface GapRecommendation {
  type: 'course' | 'module' | 'practice' | 'review' | 'next-course' | 'gap-fill' | 'exploration' | 'trending';
  id: string;
  title: string;
  reason: string;
  estimatedTime: number;
  priority: 'high' | 'medium' | 'low';
  description?: string;
  course?: CourseFromIndex;
  nodes?: KnowledgeNode[];
}

// ============================================================================
// Spaced Repetition Types
// ============================================================================

export interface SpacedRepetitionItem {
  id: string;
  userId: string;
  questionId: string;
  knowledgeNodeId: string;
  interval: number; // days
  repetitionCount: number;
  easeFactor: number;
  nextReviewDate: string;
  lastReviewDate?: string;
  status: 'new' | 'learning' | 'review' | 'mastered' | 'lapsed';
}

export interface ReviewSession {
  id: string;
  userId: string;
  items: ReviewItem[];
  startedAt: string;
  completedAt?: string;
  totalItems: number;
  completedItems: number;
  correctAnswers: number;
}

export interface ReviewItem {
  srItemId: string;
  question: QuizQuestion;
  answered?: boolean;
  correct?: boolean;
  timeSpent?: number;
}

// ============================================================================
// Interactive Component Types
// ============================================================================

export interface CalculatorType {
  id: string;
  name: string;
  description: string;
  category: CalculatorCategory;
  inputs: CalculatorInput[];
  outputs: CalculatorOutput[];
  formula: string;
  notes?: string;
  references?: string[];
}

export type CalculatorCategory = 
  | 'hazard-distance' 
  | 'exposure' 
  | 'optical-density' 
  | 'classification' 
  | 'power-energy';

export interface CalculatorInput {
  name: string;
  label: string;
  type: 'number' | 'select' | 'boolean';
  min?: number;
  max?: number;
  step?: number;
  options?: { value: string; label: string }[];
  default?: number | string | boolean;
  unit?: string;
  required: boolean;
}

export interface CalculatorOutput {
  name: string;
  label: string;
  unit?: string;
  description: string;
  warningThreshold?: number;
  dangerThreshold?: number;
}

export interface SimulationState {
  id: string;
  scenarioId: string;
  userId: string;
  currentStep: number;
  variables: Record<string, number>;
  completedSteps: string[];
  decisions: SimulationDecision[];
  startedAt: string;
  lastActiveAt: string;
  completedAt?: string;
  score?: number;
}

export interface SimulationDecision {
  stepId: string;
  decision: string;
  timestamp: string;
  correct?: boolean;
  feedback?: string;
}

export interface DragDropExercise {
  id: string;
  title: string;
  description: string;
  items: DragDropItem[];
  zones: DropZone[];
  scoring: DragDropScoring;
}

export interface DragDropItem {
  id: string;
  content: string;
  correctZoneId: string;
  hint?: string;
}

export interface DropZone {
  id: string;
  label: string;
  description?: string;
  accepts: string[];
  maxItems?: number;
}

export interface DragDropScoring {
  pointsPerCorrect: number;
  pointsPerIncorrect: number;
  requireAllCorrect: boolean;
  allowRetry: boolean;
}

// ============================================================================
// Accessibility Types
// ============================================================================

export interface AccessibilitySettings {
  fontSize: 'small' | 'medium' | 'large' | 'x-large';
  highContrast: boolean;
  reducedMotion: boolean;
  colorBlindMode: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia' | 'achromatopsia';
  screenReaderOptimized: boolean;
  keyboardNavigation: boolean;
  focusIndicator: 'default' | 'enhanced' | 'custom';
  readingGuide: boolean;
  textSpacing: 'normal' | 'wide' | 'wider';
  lineHeight: 'normal' | 'relaxed' | 'loose';
}

export interface KeyboardShortcut {
  key: string;
  modifiers: ('ctrl' | 'alt' | 'shift' | 'meta')[];
  action: string;
  description: string;
  scope: 'global' | 'course' | 'quiz' | 'simulation';
}

// ============================================================================
// API & Sync Types
// ============================================================================

export interface SyncStatus {
  lastSyncAt: string;
  pendingChanges: number;
  syncInProgress: boolean;
  lastError?: string;
}

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: APIError;
  meta?: APIMeta;
}

export interface APIError {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface APIMeta {
  page?: number;
  limit?: number;
  total?: number;
  hasMore?: boolean;
}

// ============================================================================
// Analytics & Tracking Types
// ============================================================================

export interface LearningEvent {
  id: string;
  userId: string;
  type: LearningEventType;
  courseId?: string;
  moduleId?: string;
  componentId?: string;
  timestamp: string;
  duration?: number;
  metadata?: Record<string, unknown>;
}

export type LearningEventType = 
  | 'course-start' 
  | 'course-complete' 
  | 'module-start' 
  | 'module-complete' 
  | 'component-view' 
  | 'quiz-start' 
  | 'quiz-complete' 
  | 'quiz-answer' 
  | 'simulation-start' 
  | 'simulation-complete' 
  | 'calculator-use' 
  | 'note-add' 
  | 'bookmark-add';

export interface LearningAnalytics {
  userId: string;
  period: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
  metrics: AnalyticsMetrics;
  trends: AnalyticsTrend[];
}

export interface AnalyticsMetrics {
  totalTimeSpent: number;
  coursesStarted: number;
  coursesCompleted: number;
  modulesCompleted: number;
  averageQuizScore: number;
  quizzesTaken: number;
  studySessions: number;
  averageSessionLength: number;
  mostActiveDay: string;
  mostActiveHour: number;
}

export interface AnalyticsTrend {
  metric: string;
  direction: 'up' | 'down' | 'stable';
  changePercent: number;
  comparisonPeriod: string;
}

// ============================================================================
// Certificate Types
// ============================================================================

export interface Certificate {
  id: string;
  userId: string;
  courseId: string;
  courseName: string;
  userName: string;
  issuedAt: string;
  expiresAt?: string;
  credentialId: string;
  verificationUrl: string;
  pdfUrl: string;
  metadata: CertificateMetadata;
}

export interface CertificateMetadata {
  completionTime: number;
  finalQuizScore: number;
  modulesCompleted: number;
  instructorName?: string;
  accreditationBody?: string;
  ceuCredits?: number;
}
