/**
 * Quiz Analytics - Tracks performance and generates insights
 * Provides detailed analytics for learning improvement
 */

import { 
  UserAnswer, 
  Question, 
  QuizAnalytics,
  AssessmentResult,
  CompetencyArea,
  DifficultyLevel
} from '@/types/quiz';

// Storage key for analytics
const ANALYTICS_STORAGE_KEY = 'laser-safety-quiz-analytics';

// In-memory cache
let analyticsCache: Map<string, QuizAnalytics> = new Map();

/**
 * Get user ID (placeholder - integrate with auth system)
 */
function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  // Check for stored user ID or generate one
  let userId = localStorage.getItem('laser-safety-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('laser-safety-user-id', userId);
  }
  return userId;
}

/**
 * Get analytics storage key for a user
 */
function getStorageKey(userId: string): string {
  return `${ANALYTICS_STORAGE_KEY}-${userId}`;
}

/**
 * Load analytics from storage
 */
export function loadAnalytics(userId?: string): Map<string, QuizAnalytics> {
  const id = userId || getUserId();
  
  if (analyticsCache.size > 0 && id === getUserId()) {
    return analyticsCache;
  }
  
  if (typeof window === 'undefined') {
    return new Map();
  }
  
  try {
    const stored = localStorage.getItem(getStorageKey(id));
    if (stored) {
      const parsed = JSON.parse(stored);
      analyticsCache = new Map(Object.entries(parsed));
      return analyticsCache;
    }
  } catch (error) {
    console.error('Error loading analytics:', error);
  }
  
  return new Map();
}

/**
 * Save analytics to storage
 */
function saveAnalytics(userId?: string): void {
  const id = userId || getUserId();
  
  if (typeof window === 'undefined') return;
  
  try {
    const obj = Object.fromEntries(analyticsCache);
    localStorage.setItem(getStorageKey(id), JSON.stringify(obj));
  } catch (error) {
    console.error('Error saving analytics:', error);
  }
}

/**
 * Get or create analytics entry for a quiz bank
 */
function getOrCreateAnalytics(quizBankId: string, userId?: string): QuizAnalytics {
  const id = userId || getUserId();
  const key = `${id}-${quizBankId}`;
  
  const existing = analyticsCache.get(key);
  if (existing) return existing;
  
  const newAnalytics: QuizAnalytics = {
    userId: id,
    quizBankId,
    attempts: 0,
    bestScore: 0,
    averageScore: 0,
    averageTimeMinutes: 0,
    totalTimeMinutes: 0,
    improvementRate: 0,
    hintUsageRate: 0,
    lastAttemptDate: new Date().toISOString(),
    streakDays: 0,
    questionAccuracy: {},
  };
  
  analyticsCache.set(key, newAnalytics);
  return newAnalytics;
}

/**
 * Record an assessment attempt
 */
export function recordAttempt(
  quizBankId: string,
  result: AssessmentResult,
  userId?: string
): QuizAnalytics {
  const analytics = getOrCreateAnalytics(quizBankId, userId);
  
  // Update basic stats
  analytics.attempts++;
  analytics.lastAttemptDate = new Date().toISOString();
  
  // Update best score
  if (result.score > analytics.bestScore) {
    analytics.bestScore = result.score;
  }
  
  // Update average score
  const totalScore = analytics.averageScore * (analytics.attempts - 1) + result.score;
  analytics.averageScore = Math.round(totalScore / analytics.attempts);
  
  // Update time stats
  analytics.totalTimeMinutes += result.timeSpentMinutes;
  analytics.averageTimeMinutes = Math.round(analytics.totalTimeMinutes / analytics.attempts);
  
  // Calculate improvement rate
  if (analytics.attempts >= 2) {
    analytics.improvementRate = result.score - analytics.averageScore;
  }
  
  // Update hint usage rate
  const totalHints = result.questionResults.reduce((sum, qr) => sum + qr.hintsUsed, 0);
  const hintRate = totalHints / (result.questionResults.length * 3); // Max 3 hints per question
  analytics.hintUsageRate = Math.round((analytics.hintUsageRate * (analytics.attempts - 1) + hintRate) / analytics.attempts * 100);
  
  // Update question accuracy
  result.questionResults.forEach(qr => {
    const qa = analytics.questionAccuracy[qr.questionId] || {
      attempts: 0,
      correct: 0,
      lastAttempt: '',
    };
    
    qa.attempts++;
    if (qr.isCorrect) qa.correct++;
    qa.lastAttempt = new Date().toISOString();
    
    analytics.questionAccuracy[qr.questionId] = qa;
  });
  
  // Update streak
  analytics.streakDays = calculateStreak(analytics);
  
  // Save to storage
  saveAnalytics(userId);
  
  return analytics;
}

/**
 * Calculate learning streak
 */
function calculateStreak(analytics: QuizAnalytics): number {
  if (analytics.attempts === 0) return 0;
  
  const lastAttempt = new Date(analytics.lastAttemptDate);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - lastAttempt.getTime()) / (1000 * 60 * 60 * 24));
  
  // If more than 2 days since last attempt, streak is broken
  if (diffDays > 2) return 0;
  
  // Otherwise, increment streak (simplified - would need full history for accuracy)
  return Math.min(analytics.streakDays + 1, diffDays === 0 ? analytics.streakDays : analytics.streakDays + 1);
}

/**
 * Get weak areas based on accuracy
 */
export function getWeakAreas(
  quizBankId: string,
  questions: Question[],
  userId?: string
): string[] {
  const analytics = getOrCreateAnalytics(quizBankId, userId);
  const weakAreas: string[] = [];
  
  // Group by competency area
  const competencyAccuracy: Record<string, { correct: number; total: number }> = {};
  
  questions.forEach(q => {
    const qa = analytics.questionAccuracy[q.id];
    if (!qa || qa.attempts === 0) return;
    
    const area = q.competencyArea;
    if (!competencyAccuracy[area]) {
      competencyAccuracy[area] = { correct: 0, total: 0 };
    }
    
    competencyAccuracy[area].correct += qa.correct;
    competencyAccuracy[area].total += qa.attempts;
  });
  
  // Find areas with < 70% accuracy
  Object.entries(competencyAccuracy).forEach(([area, stats]) => {
    const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    if (accuracy < 70) {
      weakAreas.push(area);
    }
  });
  
  return weakAreas;
}

/**
 * Get strong areas (accuracy >= 80%)
 */
export function getStrongAreas(
  quizBankId: string,
  questions: Question[],
  userId?: string
): string[] {
  const analytics = getOrCreateAnalytics(quizBankId, userId);
  const strongAreas: string[] = [];
  
  // Group by competency area
  const competencyAccuracy: Record<string, { correct: number; total: number }> = {};
  
  questions.forEach(q => {
    const qa = analytics.questionAccuracy[q.id];
    if (!qa || qa.attempts === 0) return;
    
    const area = q.competencyArea;
    if (!competencyAccuracy[area]) {
      competencyAccuracy[area] = { correct: 0, total: 0 };
    }
    
    competencyAccuracy[area].correct += qa.correct;
    competencyAccuracy[area].total += qa.attempts;
  });
  
  // Find areas with >= 80% accuracy
  Object.entries(competencyAccuracy).forEach(([area, stats]) => {
    const accuracy = stats.total > 0 ? (stats.correct / stats.total) * 100 : 0;
    if (accuracy >= 80) {
      strongAreas.push(area);
    }
  });
  
  return strongAreas;
}

/**
 * Get recommendations based on performance
 */
export function getRecommendations(
  quizBankId: string,
  questions: Question[],
  userId?: string
): string[] {
  const analytics = getOrCreateAnalytics(quizBankId, userId);
  const recommendations: string[] = [];
  
  // Check hint usage
  if (analytics.hintUsageRate > 50) {
    recommendations.push('Try answering questions without hints to build stronger recall.');
  }
  
  // Check time spent
  if (analytics.averageTimeMinutes < 2 && analytics.attempts > 0) {
    recommendations.push('Take more time to read questions carefully before answering.');
  }
  
  // Check weak areas
  const weakAreas = getWeakAreas(quizBankId, questions, userId);
  if (weakAreas.length > 0) {
    const areaNames = weakAreas.map(a => a.replace(/_/g, ' ')).join(', ');
    recommendations.push(`Focus on these competency areas: ${areaNames}`);
  }
  
  // Check improvement trend
  if (analytics.improvementRate < 0 && analytics.attempts >= 3) {
    recommendations.push('Review course materials before attempting the quiz again.');
  }
  
  // Default recommendation
  if (recommendations.length === 0) {
    recommendations.push('Great progress! Continue practicing to maintain your knowledge.');
  }
  
  return recommendations;
}

/**
 * Get questions that need review (answered incorrectly recently)
 */
export function getQuestionsForReview(
  quizBankId: string,
  questions: Question[],
  limit: number = 10,
  userId?: string
): Question[] {
  const analytics = getOrCreateAnalytics(quizBankId, userId);
  
  const questionsNeedingReview = questions.filter(q => {
    const qa = analytics.questionAccuracy[q.id];
    if (!qa) return true; // Never attempted
    if (qa.attempts === 0) return true;
    
    const accuracy = qa.correct / qa.attempts;
    return accuracy < 0.7; // Less than 70% accuracy
  });
  
  // Sort by least accurate first
  questionsNeedingReview.sort((a, b) => {
    const qaA = analytics.questionAccuracy[a.id];
    const qaB = analytics.questionAccuracy[b.id];
    
    const accA = qaA ? qaA.correct / qaA.attempts : 0;
    const accB = qaB ? qaB.correct / qaB.attempts : 0;
    
    return accA - accB;
  });
  
  return questionsNeedingReview.slice(0, limit);
}

/**
 * Get detailed question statistics
 */
export function getQuestionStats(
  quizBankId: string,
  questionId: string,
  userId?: string
): {
  attempts: number;
  accuracy: number;
  averageTimeSeconds: number;
  lastAttempt: string | null;
  trend: 'improving' | 'declining' | 'stable' | 'unknown';
} {
  const analytics = getOrCreateAnalytics(quizBankId, userId);
  const qa = analytics.questionAccuracy[questionId];
  
  if (!qa) {
    return {
      attempts: 0,
      accuracy: 0,
      averageTimeSeconds: 0,
      lastAttempt: null,
      trend: 'unknown',
    };
  }
  
  return {
    attempts: qa.attempts,
    accuracy: qa.attempts > 0 ? (qa.correct / qa.attempts) * 100 : 0,
    averageTimeSeconds: 0, // Would need detailed tracking
    lastAttempt: qa.lastAttempt,
    trend: 'stable', // Would need historical data
  };
}

/**
 * Get overall learning statistics
 */
export function getOverallStats(userId?: string): {
  totalAttempts: number;
  uniqueQuizzes: number;
  averageScore: number;
  bestStreak: number;
  totalTimeHours: number;
  masteredCompetencies: number;
} {
  const analytics = loadAnalytics(userId);
  
  let totalAttempts = 0;
  let totalScore = 0;
  let bestStreak = 0;
  let totalTimeHours = 0;
  
  analytics.forEach(a => {
    totalAttempts += a.attempts;
    totalScore += a.averageScore;
    bestStreak = Math.max(bestStreak, a.streakDays);
    totalTimeHours += a.totalTimeMinutes / 60;
  });
  
  const uniqueQuizzes = analytics.size;
  const averageScore = uniqueQuizzes > 0 ? Math.round(totalScore / uniqueQuizzes) : 0;
  
  // Count mastered competencies (simplified)
  const masteredCompetencies = 0; // Would need detailed tracking
  
  return {
    totalAttempts,
    uniqueQuizzes,
    averageScore,
    bestStreak,
    totalTimeHours: Math.round(totalTimeHours * 10) / 10,
    masteredCompetencies,
  };
}

/**
 * Export analytics data
 */
export function exportAnalytics(userId?: string): string {
  const analytics = loadAnalytics(userId);
  const data = Object.fromEntries(analytics);
  return JSON.stringify(data, null, 2);
}

/**
 * Clear all analytics data
 */
export function clearAnalytics(userId?: string): void {
  const id = userId || getUserId();
  analyticsCache.clear();
  
  if (typeof window !== 'undefined') {
    localStorage.removeItem(getStorageKey(id));
  }
}

/**
 * Track time spent on a question
 */
export function trackQuestionTime(
  quizBankId: string,
  questionId: string,
  timeSeconds: number,
  userId?: string
): void {
  // Store in temporary session storage for analysis
  const key = `question-time-${quizBankId}-${questionId}`;
  
  if (typeof window !== 'undefined') {
    const existing = sessionStorage.getItem(key);
    const times: number[] = existing ? JSON.parse(existing) : [];
    times.push(timeSeconds);
    sessionStorage.setItem(key, JSON.stringify(times));
  }
}

/**
 * Get average time for a question
 */
export function getAverageQuestionTime(
  quizBankId: string,
  questionId: string
): number {
  const key = `question-time-${quizBankId}-${questionId}`;
  
  if (typeof window === 'undefined') return 0;
  
  const stored = sessionStorage.getItem(key);
  if (!stored) return 0;
  
  const times: number[] = JSON.parse(stored);
  if (times.length === 0) return 0;
  
  return Math.round(times.reduce((a, b) => a + b, 0) / times.length);
}
