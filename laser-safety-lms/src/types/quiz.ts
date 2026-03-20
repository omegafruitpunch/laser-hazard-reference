/**
 * Comprehensive Quiz Types for Laser Safety LMS
 * Supports all question types and assessment flows
 */

export type QuestionType = 
  | 'multiple_choice'
  | 'multi_select'
  | 'true_false'
  | 'matching'
  | 'fill_blank'
  | 'scenario'
  | 'calculation';

export type AssessmentType = 
  | 'module_quiz'
  | 'course_exam'
  | 'certification_practice'
  | 'knowledge_check'
  | 'spaced_repetition';

export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type CompetencyArea = 
  | 'fundamentals'
  | 'bioeffects'
  | 'hazard_evaluation'
  | 'hazard_controls'
  | 'program_administration'
  | 'medical_surveillance'
  | 'non_beam_hazards'
  | 'standards_regulations'
  | 'hazard_calculations';

export interface Hint {
  level: 1 | 2 | 3;
  text: string;
  penalty: number; // Points deducted for using this hint
}

export interface BaseQuestion {
  id: string;
  type: QuestionType;
  text: string;
  explanation: string;
  points: number;
  difficulty: DifficultyLevel;
  competencyArea: CompetencyArea;
  tags: string[];
  hints: Hint[];
  references?: {
    standard?: string;
    section?: string;
    url?: string;
  }[];
  imageUrl?: string;
  timeLimitSeconds?: number;
}

export interface MultipleChoiceQuestion extends BaseQuestion {
  type: 'multiple_choice';
  options: string[];
  correctIndex: number;
}

export interface MultiSelectQuestion extends BaseQuestion {
  type: 'multi_select';
  options: string[];
  correctIndices: number[];
  requireAllCorrect: boolean; // If true, all correct must be selected; if false, partial credit
}

export interface TrueFalseQuestion extends BaseQuestion {
  type: 'true_false';
  correctAnswer: boolean;
}

export interface MatchingPair {
  left: string;
  right: string;
  leftId: string;
  rightId: string;
}

export interface MatchingQuestion extends BaseQuestion {
  type: 'matching';
  pairs: MatchingPair[];
  leftLabel?: string;
  rightLabel?: string;
}

export interface FillBlankQuestion extends BaseQuestion {
  type: 'fill_blank';
  textWithBlanks: string; // Use [blank] placeholders
  blanks: {
    id: string;
    correctAnswer: string;
    acceptableAnswers?: string[]; // Alternative correct answers
    caseSensitive: boolean;
    tolerance?: number; // For numeric answers (percentage tolerance)
  }[];
}

export interface ScenarioBranch {
  id: string;
  text: string;
  nextQuestionId?: string;
  feedback: string;
  isCorrect: boolean;
  points: number;
}

export interface ScenarioQuestion extends BaseQuestion {
  type: 'scenario';
  context: string;
  branches: ScenarioBranch[];
}

export interface CalculationQuestion extends BaseQuestion {
  type: 'calculation';
  formula: string;
  variables: {
    name: string;
    value: number;
    unit: string;
    displayValue: string; // Formatted for display
  }[];
  correctAnswer: number;
  tolerance: number; // Percentage tolerance
  unit: string;
  showFormula: boolean;
  steps: {
    description: string;
    formula: string;
  }[];
}

export type Question = 
  | MultipleChoiceQuestion
  | MultiSelectQuestion
  | TrueFalseQuestion
  | MatchingQuestion
  | FillBlankQuestion
  | ScenarioQuestion
  | CalculationQuestion;

export interface QuizBank {
  id: string;
  title: string;
  description: string;
  courseId: string;
  moduleIds?: string[];
  assessmentType: AssessmentType;
  totalQuestions: number;
  passingScore: number; // Percentage
  timeLimitMinutes?: number;
  categories: {
    [key: string]: {
      weight: number;
      questions: string[];
    };
  };
  questions: Question[];
  retakePolicy: {
    allowed: boolean;
    maxAttempts: number;
    cooldownHours: number;
  };
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export interface UserAnswer {
  questionId: string;
  answer: number | number[] | boolean | { [key: string]: string } | string | null;
  timeSpentSeconds: number;
  hintsUsed: number[];
  attempts: number;
  isCorrect: boolean;
  pointsEarned: number;
}

export interface AssessmentSession {
  id: string;
  quizBankId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  answers: UserAnswer[];
  questionOrder: string[];
  flaggedQuestions: string[];
  currentQuestionIndex: number;
  timeRemainingSeconds?: number;
}

export interface AssessmentResult {
  sessionId: string;
  quizBankId: string;
  score: number; // Percentage
  totalPoints: number;
  pointsEarned: number;
  passed: boolean;
  timeSpentMinutes: number;
  questionResults: {
    questionId: string;
    isCorrect: boolean;
    correctAnswer: unknown;
    userAnswer: unknown;
    explanation: string;
    timeSpentSeconds: number;
    hintsUsed: number;
  }[];
  categoryBreakdown: {
    [key: string]: {
      total: number;
      correct: number;
      percentage: number;
    };
  };
  competencyAnalysis: {
    [key in CompetencyArea]?: {
      total: number;
      correct: number;
      percentage: number;
    };
  };
  recommendations: string[];
  weakAreas: string[];
  strongAreas: string[];
  certificateEligible: boolean;
  generatedAt: string;
}

export interface SpacedRepetitionItem {
  questionId: string;
  quizBankId: string;
  userId: string;
  intervalDays: number;
  easeFactor: number;
  repetitions: number;
  nextReviewDate: string;
  lastReviewDate?: string;
  performanceHistory: ('again' | 'hard' | 'good' | 'easy')[];
}

export interface QuizAnalytics {
  userId: string;
  quizBankId: string;
  attempts: number;
  bestScore: number;
  averageScore: number;
  averageTimeMinutes: number;
  totalTimeMinutes: number;
  improvementRate: number; // Positive = improving
  hintUsageRate: number;
  lastAttemptDate: string;
  streakDays: number;
  questionAccuracy: {
    [questionId: string]: {
      attempts: number;
      correct: number;
      lastAttempt: string;
    };
  };
}

export interface AssessmentConfig {
  allowNavigation: boolean;
  allowFlagging: boolean;
  showTimer: boolean;
  showProgress: boolean;
  immediateFeedback: boolean;
  allowHints: boolean;
  reviewMode: boolean;
  randomizeQuestions: boolean;
  randomizeOptions: boolean;
}

export const DEFAULT_ASSESSMENT_CONFIG: AssessmentConfig = {
  allowNavigation: true,
  allowFlagging: true,
  showTimer: true,
  showProgress: true,
  immediateFeedback: true,
  allowHints: true,
  reviewMode: false,
  randomizeQuestions: false,
  randomizeOptions: false,
};
