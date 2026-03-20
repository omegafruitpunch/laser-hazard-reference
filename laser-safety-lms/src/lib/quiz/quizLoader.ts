/**
 * Quiz Loader - Loads quiz data from lms_data/quiz_banks
 * Handles multiple quiz formats and normalization
 */

import { 
  QuizBank, 
  Question, 
  QuestionType,
  DifficultyLevel,
  CompetencyArea,
  AssessmentType,
  Hint
} from '@/types/quiz';

// Quiz data storage - will be populated dynamically
const quizDataStore: Record<string, RawQuizBank> = {};

// Raw quiz data from JSON files
interface RawQuizQuestion {
  id: string;
  type?: string;
  question?: string;
  text?: string;
  options?: string[];
  correct_answer?: number | boolean | number[];
  correctIndex?: number;
  correct?: number;
  explanation?: string;
  explanation_correct?: string;
  explanation_incorrect?: string;
  points?: number;
  page_ref?: number;
  learning_objective?: string;
  moduleId?: string;
}

interface RawQuizBank {
  quiz_bank?: {
    id: string;
    title: string;
    description?: string;
    course_id?: string;
    total_questions: number;
    passing_score?: number;
    time_limit_minutes?: number;
    categories?: Record<string, { weight: number; questions: string[] }>;
    questions: RawQuizQuestion[];
    retake_policy?: {
      allowed: boolean;
      max_attempts: number;
      cooldown_hours: number;
    };
  };
  id?: string;
  document?: string;
  title?: string;
  total_questions?: number;
  questions?: RawQuizQuestion[];
  courseId?: string;
  modules?: string[];
}

// Generate hints based on question difficulty and content
function generateHints(question: RawQuizQuestion, difficulty: DifficultyLevel): Hint[] {
  const basePenalty = difficulty === 'beginner' ? 0.1 : difficulty === 'intermediate' ? 0.15 : 0.2;
  
  const hints: Hint[] = [
    {
      level: 1,
      text: getLevel1Hint(question),
      penalty: basePenalty,
    },
    {
      level: 2,
      text: getLevel2Hint(question),
      penalty: basePenalty * 2,
    },
    {
      level: 3,
      text: getLevel3Hint(question),
      penalty: basePenalty * 3,
    },
  ];
  
  return hints;
}

function getLevel1Hint(question: RawQuizQuestion): string {
  const text = question.question || question.text || '';
  const lowerText = text.toLowerCase();
  
  if (lowerText.includes('mpe') || lowerText.includes('maximum permissible')) {
    return 'Remember: MPE values depend on wavelength and exposure duration.';
  }
  if (lowerText.includes('nohd') || lowerText.includes('nominal ocular')) {
    return 'Consider: Beam divergence and power affect the hazard distance.';
  }
  if (lowerText.includes('class') && lowerText.includes('laser')) {
    return 'Think about: Accessible emission limits and potential hazards.';
  }
  if (lowerText.includes('fda') || lowerText.includes('variance')) {
    return 'Hint: Check the regulatory requirements for the specific laser class.';
  }
  if (lowerText.includes('ansi') || lowerText.includes('z136')) {
    return 'Consider: The ANSI Z136 series provides safety standards for laser use.';
  }
  
  return 'Read the question carefully and consider all options before selecting.';
}

function getLevel2Hint(question: RawQuizQuestion): string {
  const text = question.question || question.text || '';
  const options = question.options || [];
  
  if (question.type === 'true_false' || question.correct_answer === true || question.correct_answer === false) {
    return 'Consider the specific circumstances mentioned in the question.';
  }
  
  if (options.length > 0) {
    const halfIndex = Math.floor(options.length / 2);
    return `Focus on: Options typically involve ${options.slice(0, halfIndex).join(', ')}...`;
  }
  
  return 'Eliminate options that are clearly incorrect first.';
}

function getLevel3Hint(question: RawQuizQuestion): string {
  const text = question.question || question.text || '';
  
  if (question.correct_answer !== undefined) {
    if (Array.isArray(question.correct_answer)) {
      return `There are ${question.correct_answer.length} correct answers to this question.`;
    }
    if (typeof question.correct_answer === 'number') {
      const options = question.options || [];
      if (options[question.correct_answer]) {
        return `The correct answer starts with: "${options[question.correct_answer].substring(0, 15)}..."`;
      }
    }
  }
  
  if (question.correctIndex !== undefined && question.options) {
    return `The correct answer starts with: "${question.options[question.correctIndex].substring(0, 15)}..."`;
  }
  
  return 'Review your course materials for this specific topic.';
}

function determineDifficulty(question: RawQuizQuestion): DifficultyLevel {
  const text = (question.question || question.text || '').toLowerCase();
  
  // Check for calculation keywords
  if (text.includes('calculate') || text.includes('compute') || text.includes('determine the')) {
    return 'advanced';
  }
  
  // Check for scenario complexity
  if (text.includes('scenario') || text.includes('situation') || text.includes('case')) {
    return 'intermediate';
  }
  
  // Check for expert-level content
  if (text.includes('variance') || text.includes('compliance') || text.includes('regulation')) {
    return 'advanced';
  }
  
  // Default based on question type
  switch (question.type) {
    case 'calculation':
      return 'advanced';
    case 'scenario':
    case 'matching':
      return 'intermediate';
    case 'true_false':
      return 'beginner';
    default:
      return 'intermediate';
  }
}

function determineCompetencyArea(question: RawQuizQuestion): CompetencyArea {
  const text = (question.question || question.text || '').toLowerCase();
  const learningObjective = (question.learning_objective || '').toLowerCase();
  const combined = text + ' ' + learningObjective;
  
  if (combined.includes('mpe') || combined.includes('nohd') || combined.includes('od') || combined.includes('calculate')) {
    return 'hazard_calculations';
  }
  if (combined.includes('class') || combined.includes('bioeffect') || combined.includes('eye') || combined.includes('skin')) {
    return 'bioeffects';
  }
  if (combined.includes('control') || combined.includes('eyewear') || combined.includes('interlock')) {
    return 'hazard_controls';
  }
  if (combined.includes('fda') || combined.includes('ansi') || combined.includes('regulation') || combined.includes('variance')) {
    return 'standards_regulations';
  }
  if (combined.includes('administration') || combined.includes('program') || combined.includes('lso')) {
    return 'program_administration';
  }
  if (combined.includes('medical') || combined.includes('surveillance')) {
    return 'medical_surveillance';
  }
  if (combined.includes('electrical') || combined.includes('chemical') || combined.includes('fire')) {
    return 'non_beam_hazards';
  }
  if (combined.includes('evaluation') || combined.includes('assessment') || combined.includes('hazard')) {
    return 'hazard_evaluation';
  }
  
  return 'fundamentals';
}

function determineQuestionType(question: RawQuizQuestion): QuestionType {
  if (question.type) {
    switch (question.type.toLowerCase()) {
      case 'multiple_choice':
      case 'multiplechoice':
        return 'multiple_choice';
      case 'multi_select':
      case 'multiselect':
        return 'multi_select';
      case 'true_false':
      case 'truefalse':
      case 'boolean':
        return 'true_false';
      case 'matching':
        return 'matching';
      case 'fill_blank':
      case 'fillblank':
      case 'fill_in_blank':
        return 'fill_blank';
      case 'scenario':
        return 'scenario';
      case 'calculation':
        return 'calculation';
      default:
        return 'multiple_choice';
    }
  }
  
  // Infer from answer type
  if (typeof question.correct_answer === 'boolean') {
    return 'true_false';
  }
  if (Array.isArray(question.correct_answer) && question.correct_answer.every(n => typeof n === 'number')) {
    return 'multi_select';
  }
  
  return 'multiple_choice';
}

function normalizeQuestion(raw: RawQuizQuestion, courseId: string): Question {
  const type = determineQuestionType(raw);
  const difficulty = determineDifficulty(raw);
  const competencyArea = determineCompetencyArea(raw);
  const hints = generateHints(raw, difficulty);
  
  const baseQuestion = {
    id: raw.id,
    type,
    text: raw.question || raw.text || '',
    explanation: raw.explanation || raw.explanation_correct || '',
    points: raw.points || 5,
    difficulty,
    competencyArea,
    tags: [courseId, raw.learning_objective || 'general', competencyArea],
    hints,
    references: raw.page_ref ? [{ standard: 'Source Document', section: `Page ${raw.page_ref}` }] : undefined,
  };
  
  switch (type) {
    case 'multiple_choice': {
      const correctIndex = typeof raw.correct_answer === 'number' 
        ? raw.correct_answer 
        : (raw.correctIndex !== undefined ? raw.correctIndex : (raw.correct !== undefined ? raw.correct : 0));
      
      return {
        ...baseQuestion,
        type: 'multiple_choice',
        options: raw.options || [],
        correctIndex,
      };
    }
    
    case 'multi_select': {
      const correctIndices = Array.isArray(raw.correct_answer) 
        ? raw.correct_answer 
        : (raw.correctIndex !== undefined ? [raw.correctIndex] : []);
      
      return {
        ...baseQuestion,
        type: 'multi_select',
        options: raw.options || [],
        correctIndices,
        requireAllCorrect: true,
      };
    }
    
    case 'true_false': {
      const correctAnswer = typeof raw.correct_answer === 'boolean' 
        ? raw.correct_answer 
        : (raw.correctIndex === 0 || raw.correct === 0);
      
      return {
        ...baseQuestion,
        type: 'true_false',
        correctAnswer,
      };
    }
    
    case 'matching':
      return {
        ...baseQuestion,
        type: 'matching',
        pairs: [], // Would need specific data
        leftLabel: 'Items',
        rightLabel: 'Definitions',
      };
    
    case 'fill_blank':
      return {
        ...baseQuestion,
        type: 'fill_blank',
        textWithBlanks: baseQuestion.text,
        blanks: [],
      };
    
    case 'scenario':
      return {
        ...baseQuestion,
        type: 'scenario',
        context: baseQuestion.text,
        branches: [],
      };
    
    case 'calculation':
      return {
        ...baseQuestion,
        type: 'calculation',
        formula: '',
        variables: [],
        correctAnswer: 0,
        tolerance: 5,
        unit: '',
        showFormula: true,
        steps: [],
      };
    
    default:
      return {
        ...baseQuestion,
        type: 'multiple_choice',
        options: raw.options || [],
        correctIndex: 0,
      };
  }
}

function normalizeQuizBank(raw: RawQuizBank, defaultCourseId: string): QuizBank {
  // Handle different formats:
  // 1. Nested format: raw.quiz_bank contains snake_case properties
  // 2. Flat format: raw contains camelCase properties (courseId, passingScore, etc.)
  const quizBankData = raw.quiz_bank;
  const questions = quizBankData?.questions || raw.questions || [];
  
  // Use snake_case from nested format or camelCase from flat format
  const courseId = quizBankData?.course_id || raw.courseId || defaultCourseId;
  
  // Normalize questions
  const normalizedQuestions: Question[] = questions.map((q: RawQuizQuestion) => 
    normalizeQuestion(q, courseId)
  );
  
  // Build categories from questions if not provided (only in nested format)
  const categories = quizBankData?.categories || {};
  
  // Determine assessment type based on question count
  const questionCount = normalizedQuestions.length;
  let assessmentType: AssessmentType = 'module_quiz';
  if (questionCount >= 75) {
    assessmentType = 'certification_practice';
  } else if (questionCount >= 20) {
    assessmentType = 'course_exam';
  } else if (questionCount <= 3) {
    assessmentType = 'knowledge_check';
  }
  
  // Get properties from nested format (snake_case) or flat format (camelCase)
  const title = quizBankData?.title || raw.title || 'Untitled Quiz';
  const description = quizBankData?.description || '';
  const id = quizBankData?.id || raw.id || `quiz-${courseId}-${Date.now()}`;
  const passingScore = quizBankData?.passing_score ?? 70;
  const timeLimitMinutes = quizBankData?.time_limit_minutes;
  
  // Transform retake policy from snake_case (nested format) to camelCase
  const retakePolicy = quizBankData?.retake_policy ? {
    allowed: quizBankData.retake_policy.allowed,
    maxAttempts: quizBankData.retake_policy.max_attempts,
    cooldownHours: quizBankData.retake_policy.cooldown_hours,
  } : {
    allowed: true,
    maxAttempts: 3,
    cooldownHours: 24,
  };
  
  return {
    id,
    title,
    description,
    courseId,
    moduleIds: raw.modules,
    assessmentType,
    totalQuestions: normalizedQuestions.length,
    passingScore,
    timeLimitMinutes,
    categories,
    questions: normalizedQuestions,
    retakePolicy,
    randomizeQuestions: true,
    randomizeOptions: true,
  };
}

// Quiz bank registry - populated dynamically
const QUIZ_BANKS: Record<string, RawQuizBank> = quizDataStore;

// Cache for normalized quiz banks
const normalizedCache: Map<string, QuizBank> = new Map();

/**
 * Get all available quiz bank IDs
 */
export function getQuizBankIds(): string[] {
  return Object.keys(QUIZ_BANKS);
}

/**
 * Load and normalize a quiz bank by ID
 */
export function loadQuizBank(quizBankId: string): QuizBank | null {
  // Check cache first
  if (normalizedCache.has(quizBankId)) {
    return normalizedCache.get(quizBankId)!;
  }
  
  const raw = QUIZ_BANKS[quizBankId];
  if (!raw) {
    console.error(`Quiz bank not found: ${quizBankId}`);
    return null;
  }
  
  // Extract course ID from quiz bank ID
  const courseIdMatch = quizBankId.match(/course-\d+/);
  const defaultCourseId = courseIdMatch ? courseIdMatch[0] : 'unknown';
  
  const normalized = normalizeQuizBank(raw, defaultCourseId);
  normalizedCache.set(quizBankId, normalized);
  
  return normalized;
}

/**
 * Get all quiz banks for a specific course
 */
export function getQuizBanksByCourse(courseId: string): QuizBank[] {
  return getQuizBankIds()
    .filter(id => id.includes(courseId))
    .map(id => loadQuizBank(id))
    .filter((bank): bank is QuizBank => bank !== null);
}

/**
 * Get quiz banks by assessment type
 */
export function getQuizBanksByType(type: AssessmentType): QuizBank[] {
  return getQuizBankIds()
    .map(id => loadQuizBank(id))
    .filter((bank): bank is QuizBank => bank !== null && bank.assessmentType === type);
}

/**
 * Load a specific question from a quiz bank
 */
export function loadQuestion(quizBankId: string, questionId: string): Question | null {
  const bank = loadQuizBank(quizBankId);
  if (!bank) return null;
  
  return bank.questions.find(q => q.id === questionId) || null;
}

/**
 * Get questions filtered by competency area
 */
export function getQuestionsByCompetency(
  quizBankId: string, 
  competency: CompetencyArea
): Question[] {
  const bank = loadQuizBank(quizBankId);
  if (!bank) return [];
  
  return bank.questions.filter(q => q.competencyArea === competency);
}

/**
 * Get questions filtered by difficulty
 */
export function getQuestionsByDifficulty(
  quizBankId: string,
  difficulty: DifficultyLevel
): Question[] {
  const bank = loadQuizBank(quizBankId);
  if (!bank) return [];
  
  return bank.questions.filter(q => q.difficulty === difficulty);
}

/**
 * Shuffle questions for randomization
 */
export function shuffleQuestions(questions: Question[], seed?: number): Question[] {
  const shuffled = [...questions];
  
  // Simple seedable random
  let rng = seed !== undefined ? seed : Math.floor(Math.random() * 10000);
  const random = () => {
    rng = (rng * 9301 + 49297) % 233280;
    return rng / 233280;
  };
  
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled;
}

/**
 * Select random subset of questions from a quiz bank
 */
export function selectRandomQuestions(
  quizBankId: string,
  count: number,
  options?: {
    difficulty?: DifficultyLevel;
    competency?: CompetencyArea;
    excludeIds?: string[];
  }
): Question[] {
  const bank = loadQuizBank(quizBankId);
  if (!bank) return [];
  
  let questions = [...bank.questions];
  
  // Apply filters
  if (options?.difficulty) {
    questions = questions.filter(q => q.difficulty === options.difficulty);
  }
  if (options?.competency) {
    questions = questions.filter(q => q.competencyArea === options.competency);
  }
  if (options?.excludeIds) {
    questions = questions.filter(q => !options.excludeIds?.includes(q.id));
  }
  
  // Shuffle and select
  const shuffled = shuffleQuestions(questions);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Clear the quiz bank cache
 */
export function clearQuizCache(): void {
  normalizedCache.clear();
}

/**
 * Get total available questions across all quiz banks
 */
export function getTotalQuestionCount(): number {
  return getQuizBankIds()
    .map(id => loadQuizBank(id))
    .filter((bank): bank is QuizBank => bank !== null)
    .reduce((total, bank) => total + bank.questions.length, 0);
}

/**
 * Search questions across all quiz banks
 */
export function searchQuestions(query: string): { quizBankId: string; question: Question }[] {
  const lowerQuery = query.toLowerCase();
  const results: { quizBankId: string; question: Question }[] = [];
  
  getQuizBankIds().forEach(quizBankId => {
    const bank = loadQuizBank(quizBankId);
    if (!bank) return;
    
    bank.questions.forEach(question => {
      if (
        question.text.toLowerCase().includes(lowerQuery) ||
        question.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        question.competencyArea.toLowerCase().includes(lowerQuery)
      ) {
        results.push({ quizBankId, question });
      }
    });
  });
  
  return results;
}
