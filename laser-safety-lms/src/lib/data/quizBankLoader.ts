/**
 * Quiz Bank Loader
 * 
 * Handles loading quiz questions, saving attempts, and managing
 * spaced repetition for review sessions.
 */

import { 
  Quiz, 
  QuizQuestion, 
  QuizAttempt, 
  QuizSettings,
  SpacedRepetitionItem,
  ReviewSession,
  ReviewItem
} from '@/types/lms';
import { quizzes as quizBank } from '@/data/quizzes';

const ATTEMPTS_STORAGE_KEY = 'laser-lms-quiz-attempts';
const SR_ITEMS_STORAGE_KEY = 'laser-lms-spaced-repetition';
const REVIEW_SESSIONS_STORAGE_KEY = 'laser-lms-review-sessions';

// Default quiz settings
const DEFAULT_QUIZ_SETTINGS: QuizSettings = {
  passingScore: 70,
  shuffleQuestions: false,
  shuffleOptions: false,
  showCorrectAnswers: true,
  allowRetake: true,
  maxAttempts: undefined,
  requireAllCorrect: false,
};

/**
 * Get quiz by module ID
 */
export async function getQuizByModuleId(moduleId: string): Promise<Quiz> {
  // Extract course ID from module ID (e.g., 'c1-m1' -> 'course-1')
  const courseMatch = moduleId.match(/^c(\d+)-m/);
  const courseId = courseMatch ? `course-${courseMatch[1]}` : '';
  
  const questions = quizBank[courseId] || [];
  
  return {
    id: `quiz-${moduleId}`,
    moduleId,
    title: 'Knowledge Check',
    description: 'Test your understanding of this module',
    questions: questions.map((q, index) => ({
      ...q,
      type: 'multiple-choice',
      difficulty: index < 3 ? 'easy' : index < 6 ? 'medium' : 'hard',
      tags: [courseId, moduleId],
    })),
    settings: DEFAULT_QUIZ_SETTINGS,
  };
}

/**
 * Get quiz by course ID
 */
export async function getQuizByCourseId(courseId: string): Promise<Quiz> {
  const questions = quizBank[courseId] || [];
  
  return {
    id: `quiz-${courseId}`,
    moduleId: courseId,
    title: 'Course Assessment',
    description: 'Comprehensive assessment of course material',
    questions: questions.map((q, index) => ({
      ...q,
      type: 'multiple-choice',
      difficulty: index < questions.length / 3 ? 'easy' : index < (2 * questions.length) / 3 ? 'medium' : 'hard',
      tags: [courseId],
    })),
    settings: {
      ...DEFAULT_QUIZ_SETTINGS,
      passingScore: 80, // Higher passing score for final assessment
    },
  };
}

/**
 * Get specific question by ID
 */
export async function getQuestionById(questionId: string): Promise<QuizQuestion | null> {
  for (const courseQuizzes of Object.values(quizBank)) {
    const question = courseQuizzes.find(q => q.id === questionId);
    if (question) {
      return {
        ...question,
        type: 'multiple-choice',
        difficulty: 'medium',
        tags: [],
      };
    }
  }
  return null;
}

/**
 * Get questions by tags
 */
export async function getQuestionsByTags(tags: string[]): Promise<QuizQuestion[]> {
  const allQuestions: QuizQuestion[] = [];
  
  Object.entries(quizBank).forEach(([courseId, questions]) => {
    questions.forEach(q => {
      if (tags.some(tag => q.id.includes(tag) || courseId.includes(tag))) {
        allQuestions.push({
          ...q,
          type: 'multiple-choice',
          difficulty: 'medium',
          tags: [courseId],
        });
      }
    });
  });
  
  return allQuestions;
}

/**
 * Save quiz attempt
 */
export async function saveQuizAttempt(attempt: QuizAttempt): Promise<void> {
  try {
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    const attempts: QuizAttempt[] = stored ? JSON.parse(stored) : [];
    
    attempts.push(attempt);
    localStorage.setItem(ATTEMPTS_STORAGE_KEY, JSON.stringify(attempts));
    
    // Update spaced repetition items for incorrect answers
    await updateSpacedRepetitionFromAttempt(attempt);
  } catch (error) {
    console.error('Failed to save quiz attempt:', error);
  }
}

/**
 * Get assessment history
 */
export async function getAssessmentHistory(): Promise<QuizAttempt[]> {
  try {
    const stored = localStorage.getItem(ATTEMPTS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load assessment history:', error);
    return [];
  }
}

/**
 * Get quiz statistics
 */
export async function getQuizStats(): Promise<{
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  bestScore: number;
  totalTimeSpent: number;
  recentTrend: 'improving' | 'declining' | 'stable';
}> {
  const attempts = await getAssessmentHistory();
  
  if (attempts.length === 0) {
    return {
      totalAttempts: 0,
      averageScore: 0,
      passRate: 0,
      bestScore: 0,
      totalTimeSpent: 0,
      recentTrend: 'stable',
    };
  }
  
  const scores = attempts.map(a => a.score);
  const passedCount = attempts.filter(a => a.passed).length;
  
  // Calculate trend
  let recentTrend: 'improving' | 'declining' | 'stable' = 'stable';
  if (attempts.length >= 3) {
    const recent = attempts.slice(-3);
    const recentAvg = recent.reduce((a, b) => a + b.score, 0) / 3;
    const previous = attempts.slice(-6, -3);
    if (previous.length > 0) {
      const previousAvg = previous.reduce((a, b) => a + b.score, 0) / previous.length;
      const diff = recentAvg - previousAvg;
      if (diff > 5) recentTrend = 'improving';
      else if (diff < -5) recentTrend = 'declining';
    }
  }
  
  return {
    totalAttempts: attempts.length,
    averageScore: Math.round(scores.reduce((a, b) => a + b, 0) / scores.length),
    passRate: Math.round((passedCount / attempts.length) * 100),
    bestScore: Math.max(...scores),
    totalTimeSpent: attempts.reduce((a, b) => a + b.timeSpent, 0),
    recentTrend,
  };
}

/**
 * Get attempts for a specific quiz
 */
export async function getAttemptsByQuiz(quizId: string): Promise<QuizAttempt[]> {
  const attempts = await getAssessmentHistory();
  return attempts.filter(a => a.quizId === quizId);
}

/**
 * Get best attempt for a quiz
 */
export async function getBestAttempt(quizId: string): Promise<QuizAttempt | null> {
  const attempts = await getAttemptsByQuiz(quizId);
  if (attempts.length === 0) return null;
  
  return attempts.reduce((best, current) => 
    current.score > best.score ? current : best
  );
}

// ============================================================================
// Spaced Repetition
// ============================================================================

/**
 * Get all spaced repetition items
 */
export async function getSpacedRepetitionItems(): Promise<SpacedRepetitionItem[]> {
  try {
    const stored = localStorage.getItem(SR_ITEMS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to load SR items:', error);
    return [];
  }
}

/**
 * Get items due for review
 */
export async function getDueItems(): Promise<SpacedRepetitionItem[]> {
  const items = await getSpacedRepetitionItems();
  const now = new Date().toISOString();
  
  return items.filter(item => item.nextReviewDate <= now);
}

/**
 * Update spaced repetition item
 */
export async function updateSpacedRepetitionItem(item: SpacedRepetitionItem): Promise<void> {
  try {
    const stored = localStorage.getItem(SR_ITEMS_STORAGE_KEY);
    const items: SpacedRepetitionItem[] = stored ? JSON.parse(stored) : [];
    
    const index = items.findIndex(i => i.id === item.id);
    if (index >= 0) {
      items[index] = item;
    } else {
      items.push(item);
    }
    
    localStorage.setItem(SR_ITEMS_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error('Failed to update SR item:', error);
  }
}

/**
 * Create review session from due items
 */
export async function createReviewSession(dueItems: SpacedRepetitionItem[]): Promise<ReviewSession> {
  const reviewItems: ReviewItem[] = await Promise.all(
    dueItems.map(async (item): Promise<ReviewItem> => {
      const question = await getQuestionById(item.questionId);
      return {
        srItemId: item.id,
        question: question!,
      };
    })
  );
  
  return {
    id: `session-${Date.now()}`,
    userId: 'anonymous',
    items: reviewItems.filter(item => item.question),
    startedAt: new Date().toISOString(),
    totalItems: reviewItems.length,
    completedItems: 0,
    correctAnswers: 0,
  };
}

/**
 * Save review session
 */
export async function saveReviewSession(session: ReviewSession): Promise<void> {
  try {
    const stored = localStorage.getItem(REVIEW_SESSIONS_STORAGE_KEY);
    const sessions: ReviewSession[] = stored ? JSON.parse(stored) : [];
    
    sessions.push(session);
    localStorage.setItem(REVIEW_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error('Failed to save review session:', error);
  }
  
}

/**
 * Update spaced repetition from quiz attempt
 */
async function updateSpacedRepetitionFromAttempt(attempt: QuizAttempt): Promise<void> {
  const existingItems = await getSpacedRepetitionItems();
  
  for (const answer of attempt.answers) {
    const existingItem = existingItems.find(item => item.questionId === answer.questionId);
    
    if (existingItem) {
      // Update existing item
      const quality = answer.correct ? 4 : 1; // 0-5 scale
      const newRepetitionCount = answer.correct ? existingItem.repetitionCount + 1 : 0;
      
      let newEaseFactor = existingItem.easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
      newEaseFactor = Math.max(1.3, newEaseFactor);
      
      let interval: number;
      if (quality < 3) {
        interval = 1;
      } else if (newRepetitionCount === 1) {
        interval = 1;
      } else if (newRepetitionCount === 2) {
        interval = 6;
      } else {
        interval = Math.round(existingItem.interval * existingItem.easeFactor);
      }
      
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);
      
      await updateSpacedRepetitionItem({
        ...existingItem,
        interval,
        repetitionCount: newRepetitionCount,
        easeFactor: newEaseFactor,
        nextReviewDate: nextReviewDate.toISOString(),
        lastReviewDate: new Date().toISOString(),
        status: newRepetitionCount >= 5 ? 'mastered' : answer.correct ? 'review' : 'learning',
      });
    } else if (!answer.correct) {
      // Create new item for incorrect answers
      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + 1);
      
      const newItem: SpacedRepetitionItem = {
        id: `sr-${Date.now()}-${answer.questionId}`,
        userId: attempt.userId,
        questionId: answer.questionId,
        knowledgeNodeId: '', // Would need to map questions to knowledge nodes
        interval: 1,
        repetitionCount: 0,
        easeFactor: 2.5,
        nextReviewDate: nextReviewDate.toISOString(),
        status: 'new',
      };
      
      await updateSpacedRepetitionItem(newItem);
    }
  }
}

/**
 * Clear all quiz data
 */
export function clearQuizData(): void {
  localStorage.removeItem(ATTEMPTS_STORAGE_KEY);
  localStorage.removeItem(SR_ITEMS_STORAGE_KEY);
  localStorage.removeItem(REVIEW_SESSIONS_STORAGE_KEY);
}
