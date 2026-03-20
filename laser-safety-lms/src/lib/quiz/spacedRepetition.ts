/**
 * Spaced Repetition System (SRS)
 * Implements the SM-2 algorithm for optimal review scheduling
 * Adapted for laser safety quiz questions
 */

import { SpacedRepetitionItem, Question } from '@/types/quiz';

// Storage key
const SRS_STORAGE_KEY = 'laser-safety-srs';

// SM-2 Algorithm constants
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;
const DEFAULT_INTERVAL = 1; // days

// Performance ratings
export type PerformanceRating = 'again' | 'hard' | 'good' | 'easy';

interface RatingValue {
  intervalMultiplier: number;
  easeDelta: number;
}

const RATING_VALUES: Record<PerformanceRating, RatingValue> = {
  again: { intervalMultiplier: 0, easeDelta: -0.2 },    // Complete failure
  hard: { intervalMultiplier: 1.2, easeDelta: -0.15 },  // Correct with difficulty
  good: { intervalMultiplier: 1.0, easeDelta: 0 },      // Correct
  easy: { intervalMultiplier: 0.8, easeDelta: 0.15 },   // Easy (applied after normal calc)
};

// In-memory cache
let srsCache: Map<string, SpacedRepetitionItem> = new Map();

/**
 * Get user ID
 */
function getUserId(): string {
  if (typeof window === 'undefined') return 'anonymous';
  
  let userId = localStorage.getItem('laser-safety-user-id');
  if (!userId) {
    userId = `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('laser-safety-user-id', userId);
  }
  return userId;
}

/**
 * Get storage key
 */
function getStorageKey(userId: string): string {
  return `${SRS_STORAGE_KEY}-${userId}`;
}

/**
 * Load SRS data from storage
 */
export function loadSRS(userId?: string): Map<string, SpacedRepetitionItem> {
  const id = userId || getUserId();
  
  if (srsCache.size > 0 && id === getUserId()) {
    return srsCache;
  }
  
  if (typeof window === 'undefined') {
    return new Map();
  }
  
  try {
    const stored = localStorage.getItem(getStorageKey(id));
    if (stored) {
      const parsed = JSON.parse(stored);
      srsCache = new Map(Object.entries(parsed));
      return srsCache;
    }
  } catch (error) {
    console.error('Error loading SRS:', error);
  }
  
  return new Map();
}

/**
 * Save SRS data to storage
 */
function saveSRS(userId?: string): void {
  const id = userId || getUserId();
  
  if (typeof window === 'undefined') return;
  
  try {
    const obj = Object.fromEntries(srsCache);
    localStorage.setItem(getStorageKey(id), JSON.stringify(obj));
  } catch (error) {
    console.error('Error saving SRS:', error);
  }
}

/**
 * Get or create SRS item for a question
 */
function getOrCreateItem(
  questionId: string,
  quizBankId: string,
  userId?: string
): SpacedRepetitionItem {
  const id = userId || getUserId();
  const key = `${id}-${quizBankId}-${questionId}`;
  
  const existing = srsCache.get(key);
  if (existing) return existing;
  
  const newItem: SpacedRepetitionItem = {
    questionId,
    quizBankId,
    userId: id,
    intervalDays: 0,
    easeFactor: DEFAULT_EASE_FACTOR,
    repetitions: 0,
    nextReviewDate: new Date().toISOString(),
    performanceHistory: [],
  };
  
  srsCache.set(key, newItem);
  return newItem;
}

/**
 * Calculate next interval using SM-2 algorithm
 */
function calculateNextInterval(
  item: SpacedRepetitionItem,
  rating: PerformanceRating
): number {
  const { intervalMultiplier, easeDelta } = RATING_VALUES[rating];
  
  let newInterval: number;
  let newRepetitions = item.repetitions;
  let newEaseFactor = Math.max(MIN_EASE_FACTOR, item.easeFactor + easeDelta);
  
  if (rating === 'again') {
    // Reset on failure
    newRepetitions = 0;
    newInterval = 1;
  } else {
    newRepetitions++;
    
    if (newRepetitions === 1) {
      newInterval = 1;
    } else if (newRepetitions === 2) {
      newInterval = 6;
    } else {
      newInterval = Math.round(item.intervalDays * newEaseFactor);
    }
    
    // Apply rating multiplier
    if (rating === 'hard') {
      newInterval = Math.round(newInterval * intervalMultiplier);
    } else if (rating === 'easy') {
      // Easy gets a boost
      newInterval = Math.round(newInterval * (1 + easeDelta));
    }
  }
  
  return newInterval;
}

/**
 * Process a review and update SRS data
 */
export function processReview(
  questionId: string,
  quizBankId: string,
  rating: PerformanceRating,
  userId?: string
): SpacedRepetitionItem {
  const item = getOrCreateItem(questionId, quizBankId, userId);
  
  // Update performance history
  item.performanceHistory.push(rating);
  if (item.performanceHistory.length > 10) {
    item.performanceHistory.shift(); // Keep last 10
  }
  
  // Calculate new interval
  const newInterval = calculateNextInterval(item, rating);
  
  // Update item
  item.intervalDays = newInterval;
  item.lastReviewDate = new Date().toISOString();
  
  // Update ease factor
  if (rating !== 'again') {
    const easeDelta = RATING_VALUES[rating].easeDelta;
    item.easeFactor = Math.max(MIN_EASE_FACTOR, item.easeFactor + easeDelta);
  } else {
    item.easeFactor = Math.max(MIN_EASE_FACTOR, item.easeFactor - 0.2);
  }
  
  // Update repetitions
  if (rating === 'again') {
    item.repetitions = 0;
  } else {
    item.repetitions++;
  }
  
  // Calculate next review date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + newInterval);
  item.nextReviewDate = nextDate.toISOString();
  
  // Save
  saveSRS(userId);
  
  return item;
}

/**
 * Get questions due for review
 */
export function getDueQuestions(
  questions: Question[],
  quizBankId: string,
  limit: number = 20,
  userId?: string
): Question[] {
  const srs = loadSRS(userId);
  const id = userId || getUserId();
  const now = new Date();
  
  // Get all items that are due
  const dueItems: SpacedRepetitionItem[] = [];
  
  questions.forEach(q => {
    const key = `${id}-${quizBankId}-${q.id}`;
    const item = srs.get(key);
    
    if (!item) {
      // New question, add to review
      dueItems.push(getOrCreateItem(q.id, quizBankId, userId));
    } else {
      const nextReview = new Date(item.nextReviewDate);
      if (nextReview <= now) {
        dueItems.push(item);
      }
    }
  });
  
  // Sort by interval (shortest first = most urgent)
  dueItems.sort((a, b) => a.intervalDays - b.intervalDays);
  
  // Get question objects
  const dueQuestionIds = dueItems.slice(0, limit).map(i => i.questionId);
  return questions.filter(q => dueQuestionIds.includes(q.id));
}

/**
 * Get new questions (never reviewed)
 */
export function getNewQuestions(
  questions: Question[],
  quizBankId: string,
  limit: number = 5,
  userId?: string
): Question[] {
  const srs = loadSRS(userId);
  const id = userId || getUserId();
  
  return questions.filter(q => {
    const key = `${id}-${quizBankId}-${q.id}`;
    return !srs.has(key);
  }).slice(0, limit);
}

/**
 * Get learning statistics for SRS
 */
export function getSRSStats(
  questions: Question[],
  quizBankId: string,
  userId?: string
): {
  newCards: number;
  learning: number;
  review: number;
  mastered: number;
  total: number;
  dueToday: number;
} {
  const srs = loadSRS(userId);
  const id = userId || getUserId();
  const now = new Date();
  
  let newCards = 0;
  let learning = 0;
  let review = 0;
  let mastered = 0;
  let dueToday = 0;
  
  questions.forEach(q => {
    const key = `${id}-${quizBankId}-${q.id}`;
    const item = srs.get(key);
    
    if (!item) {
      newCards++;
    } else if (item.repetitions === 0) {
      learning++;
    } else if (item.repetitions >= 3 && item.easeFactor >= 2.0) {
      mastered++;
    } else {
      review++;
    }
    
    if (item) {
      const nextReview = new Date(item.nextReviewDate);
      if (nextReview <= now) {
        dueToday++;
      }
    }
  });
  
  return {
    newCards,
    learning,
    review,
    mastered,
    total: questions.length,
    dueToday,
  };
}

/**
 * Get review forecast for next N days
 */
export function getReviewForecast(
  quizBankId: string,
  days: number = 30,
  userId?: string
): { date: string; count: number }[] {
  const srs = loadSRS(userId);
  const id = userId || getUserId();
  const forecast: { date: string; count: number }[] = [];
  
  // Initialize forecast
  for (let i = 0; i < days; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    forecast.push({
      date: date.toISOString().split('T')[0],
      count: 0,
    });
  }
  
  // Count reviews for each day
  srs.forEach((item, key) => {
    if (!key.includes(quizBankId)) return;
    
    const nextReview = new Date(item.nextReviewDate);
    const today = new Date();
    const diffDays = Math.floor((nextReview.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays >= 0 && diffDays < days) {
      forecast[diffDays].count++;
    }
  });
  
  return forecast;
}

/**
 * Reset SRS data for a question
 */
export function resetQuestion(
  questionId: string,
  quizBankId: string,
  userId?: string
): void {
  const id = userId || getUserId();
  const key = `${id}-${quizBankId}-${questionId}`;
  
  srsCache.delete(key);
  saveSRS(userId);
}

/**
 * Reset all SRS data
 */
export function resetAllSRS(userId?: string): void {
  const id = userId || getUserId();
  
  // Remove all items for this user
  srsCache.forEach((_, key) => {
    if (key.startsWith(id)) {
      srsCache.delete(key);
    }
  });
  
  saveSRS(userId);
}

/**
 * Get next review date for a question
 */
export function getNextReviewDate(
  questionId: string,
  quizBankId: string,
  userId?: string
): string | null {
  const id = userId || getUserId();
  const key = `${id}-${quizBankId}-${questionId}`;
  const item = srsCache.get(key);
  
  return item ? item.nextReviewDate : null;
}

/**
 * Format interval for display
 */
export function formatInterval(days: number): string {
  if (days === 0) return 'Now';
  if (days === 1) return '1 day';
  if (days < 7) return `${days} days`;
  if (days < 30) return `${Math.floor(days / 7)} weeks`;
  if (days < 365) return `${Math.floor(days / 30)} months`;
  return `${Math.floor(days / 365)} years`;
}

/**
 * Get recommended daily review count
 */
export function getRecommendedDailyCount(
  questions: Question[],
  quizBankId: string,
  targetMinutes: number = 15,
  userId?: string
): {
  newCards: number;
  reviews: number;
  estimatedMinutes: number;
} {
  const stats = getSRSStats(questions, quizBankId, userId);
  
  // Estimate: new cards take 1.5 min, reviews take 0.5 min
  const timePerNew = 1.5;
  const timePerReview = 0.5;
  
  // Max 10 new cards per day
  const maxNew = Math.min(10, stats.newCards);
  
  // Calculate how many reviews fit in remaining time
  const timeForNew = maxNew * timePerNew;
  const remainingTime = targetMinutes - timeForNew;
  const maxReviews = Math.max(0, Math.floor(remainingTime / timePerReview));
  
  // Take available reviews or max
  const reviews = Math.min(maxReviews, stats.dueToday);
  
  const estimatedMinutes = (maxNew * timePerNew) + (reviews * timePerReview);
  
  return {
    newCards: maxNew,
    reviews,
    estimatedMinutes: Math.round(estimatedMinutes),
  };
}

/**
 * Export SRS data
 */
export function exportSRS(userId?: string): string {
  const srs = loadSRS(userId);
  const data = Object.fromEntries(srs);
  return JSON.stringify(data, null, 2);
}

/**
 * Import SRS data
 */
export function importSRS(jsonData: string, userId?: string): boolean {
  try {
    const data = JSON.parse(jsonData);
    srsCache = new Map(Object.entries(data));
    saveSRS(userId);
    return true;
  } catch (error) {
    console.error('Error importing SRS data:', error);
    return false;
  }
}
