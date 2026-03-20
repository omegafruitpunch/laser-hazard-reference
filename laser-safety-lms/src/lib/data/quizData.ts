/**
 * Quiz Data Loader
 * 
 * Provides utilities for loading and managing quiz data from JSON files.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { QuizBank, QuizQuestion } from '@/types';

const QUIZ_BANKS_DIR = path.join(process.cwd(), 'src/data/quiz-banks');

/**
 * Get all quiz bank IDs
 */
export async function getAllQuizBankIds(): Promise<string[]> {
  try {
    const files = await fs.readdir(QUIZ_BANKS_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading quiz banks directory:', error);
    return [];
  }
}

/**
 * Load a quiz bank by ID
 */
export async function getQuizBankById(id: string): Promise<QuizBank | null> {
  try {
    const filePath = path.join(QUIZ_BANKS_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as QuizBank;
  } catch (error) {
    console.error(`Error loading quiz bank ${id}:`, error);
    return null;
  }
}

/**
 * Get quiz bank by course ID
 */
export async function getQuizByCourseId(courseId: string): Promise<QuizBank | null> {
  const quizId = `${courseId}-quiz`;
  return getQuizBankById(quizId);
}

/**
 * Get quiz bank by module ID
 */
export async function getQuizByModuleId(moduleId: string): Promise<QuizBank | null> {
  const courseId = moduleId.split('-').slice(0, 2).join('-');
  const quizBank = await getQuizByCourseId(courseId);
  
  if (!quizBank) return null;
  
  // Filter questions related to this module if specific quiz exists
  // For now, return the full course quiz
  return quizBank;
}

/**
 * Get a specific question by ID
 */
export async function getQuestionById(
  quizId: string, 
  questionId: string
): Promise<QuizQuestion | null> {
  const quizBank = await getQuizBankById(quizId);
  
  if (!quizBank) return null;
  
  return quizBank.questions.find(q => q.id === questionId) || null;
}

/**
 * Get random questions from a quiz bank
 */
export async function getRandomQuestions(
  quizId: string, 
  count: number
): Promise<QuizQuestion[]> {
  const quizBank = await getQuizBankById(quizId);
  
  if (!quizBank) return [];
  
  const shuffled = [...quizBank.questions].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Calculate quiz score
 */
export function calculateScore(
  questions: QuizQuestion[],
  answers: Record<string, number>
): {
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
} {
  let correct = 0;
  const results = questions.map(question => {
    const selectedAnswer = answers[question.id];
    const isCorrect = selectedAnswer === question.correctIndex;
    if (isCorrect) correct++;
    
    return {
      questionId: question.id,
      correct: isCorrect,
      selectedAnswer,
      correctAnswer: question.correctIndex,
    };
  });
  
  const total = questions.length;
  const percentage = Math.round((correct / total) * 100);
  const passingScore = 80; // Default passing score
  const passed = percentage >= passingScore;
  
  return {
    score: correct,
    correct,
    total,
    percentage,
    passed,
    passingScore,
    results,
  };
}

/**
 * Get quiz statistics
 */
export async function getQuizStats() {
  const quizIds = await getAllQuizBankIds();
  const quizzes = await Promise.all(
    quizIds.map(id => getQuizBankById(id))
  );
  
  const validQuizzes = quizzes.filter((q): q is QuizBank => q !== null);
  
  return {
    totalQuizzes: validQuizzes.length,
    totalQuestions: validQuizzes.reduce((sum, q) => sum + q.questions.length, 0),
    byCourse: validQuizzes.map(q => ({
      courseId: q.courseId,
      questionCount: q.questions.length,
      passingScore: q.passingScore,
      timeLimit: q.timeLimit,
    })),
    averageQuestionsPerQuiz: Math.round(
      validQuizzes.reduce((sum, q) => sum + q.questions.length, 0) / validQuizzes.length
    ),
  };
}

/**
 * Validate quiz answers format
 */
export function validateQuizAnswers(
  quizBank: QuizBank,
  answers: Record<string, number>
): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  const questionIds = quizBank.questions.map(q => q.id);
  
  // Check for missing answers
  questionIds.forEach(id => {
    if (answers[id] === undefined) {
      errors.push(`Missing answer for question ${id}`);
    }
  });
  
  // Check for invalid answer indices
  Object.entries(answers).forEach(([questionId, answerIndex]) => {
    const question = quizBank.questions.find(q => q.id === questionId);
    if (question) {
      if (answerIndex < 0 || answerIndex >= question.options.length) {
        errors.push(`Invalid answer index for question ${questionId}`);
      }
    }
  });
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

// Re-export types
export type { QuizBank, QuizQuestion };
