'use client';

import { useState, useEffect, useCallback } from 'react';
import { SpacedRepetitionItem, ReviewSession, ReviewItem, QuizQuestion } from '@/types/lms';
import { 
  getDueItems, 
  updateSpacedRepetitionItem, 
  createReviewSession,
  saveReviewSession 
} from '@/lib/data/quizBankLoader';

interface UseSpacedRepetitionReturn {
  dueItems: SpacedRepetitionItem[];
  dueCount: number;
  isLoading: boolean;
  error: Error | null;
  reviewSession: ReviewSession | null;
  currentItem: ReviewItem | null;
  currentIndex: number;
  totalItems: number;
  sessionComplete: boolean;
  correctCount: number;
  startReviewSession: () => Promise<void>;
  submitAnswer: (correct: boolean, timeSpent: number) => Promise<void>;
  skipItem: () => void;
  endSession: () => Promise<void>;
  refresh: () => Promise<void>;
}

// SM-2 Algorithm parameters
const DEFAULT_EASE_FACTOR = 2.5;
const MIN_EASE_FACTOR = 1.3;

/**
 * Hook for managing spaced repetition review sessions
 * 
 * Implements the SM-2 algorithm for optimal review scheduling
 * 
 * @returns Spaced repetition state and control functions
 * 
 * @example
 * ```tsx
 * function ReviewPage() {
 *   const { 
 *     dueCount, 
 *     startReviewSession, 
 *     currentItem, 
 *     submitAnswer,
 *     sessionComplete 
 *   } = useSpacedRepetition();
 *   
 *   if (sessionComplete) return <ReviewSummary />;
 *   if (!currentItem) return <StartReviewButton onClick={startReviewSession} dueCount={dueCount} />;
 *   
 *   return (
 *     <ReviewCard
 *       item={currentItem}
 *       onAnswer={(correct) => submitAnswer(correct, timeSpent)}
 *     />
 *   );
 * }
 * ```
 */
export function useSpacedRepetition(): UseSpacedRepetitionReturn {
  const [dueItems, setDueItems] = useState<SpacedRepetitionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [reviewSession, setReviewSession] = useState<ReviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionComplete, setSessionComplete] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);

  const loadDueItems = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const items = await getDueItems();
      setDueItems(items);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load due items'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDueItems();
  }, [loadDueItems]);

  const calculateNextInterval = (
    repetitionCount: number,
    easeFactor: number,
    quality: number
  ): { interval: number; newRepetitionCount: number; newEaseFactor: number } => {
    // Quality: 0-5 scale (0-2 = incorrect, 3-5 = correct)
    let newEaseFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    newEaseFactor = Math.max(MIN_EASE_FACTOR, newEaseFactor);

    let newRepetitionCount = repetitionCount;
    let interval: number;

    if (quality < 3) {
      newRepetitionCount = 0;
      interval = 1;
    } else {
      newRepetitionCount += 1;
      if (newRepetitionCount === 1) {
        interval = 1;
      } else if (newRepetitionCount === 2) {
        interval = 6;
      } else {
        interval = Math.round(repetitionCount * easeFactor);
      }
    }

    return { interval, newRepetitionCount, newEaseFactor };
  };

  const startReviewSession = useCallback(async () => {
    try {
      setIsLoading(true);
      const session = await createReviewSession(dueItems.slice(0, 20)); // Max 20 items per session
      setReviewSession(session);
      setCurrentIndex(0);
      setSessionComplete(false);
      setCorrectCount(0);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to start review session'));
    } finally {
      setIsLoading(false);
    }
  }, [dueItems]);

  const submitAnswer = useCallback(async (correct: boolean, timeSpent: number) => {
    if (!reviewSession) return;

    const currentItem = reviewSession.items[currentIndex];
    if (!currentItem) return;

    // Map correct boolean to quality score (0-5)
    const quality = correct ? 4 : 1;

    // Calculate next review date using SM-2
    const srItem = dueItems.find(item => item.id === currentItem.srItemId);
    if (srItem) {
      const { interval, newRepetitionCount, newEaseFactor } = calculateNextInterval(
        srItem.repetitionCount,
        srItem.easeFactor,
        quality
      );

      const nextReviewDate = new Date();
      nextReviewDate.setDate(nextReviewDate.getDate() + interval);

      await updateSpacedRepetitionItem({
        ...srItem,
        interval,
        repetitionCount: newRepetitionCount,
        easeFactor: newEaseFactor,
        nextReviewDate: nextReviewDate.toISOString(),
        lastReviewDate: new Date().toISOString(),
        status: newRepetitionCount >= 5 ? 'mastered' : correct ? 'review' : 'learning',
      });
    }

    // Update session
    const updatedItems = [...reviewSession.items];
    updatedItems[currentIndex] = {
      ...currentItem,
      answered: true,
      correct,
      timeSpent,
    };

    const newCorrectCount = correct ? correctCount + 1 : correctCount;

    setReviewSession({
      ...reviewSession,
      items: updatedItems,
      completedItems: reviewSession.completedItems + 1,
    });
    setCorrectCount(newCorrectCount);

    // Move to next item or complete
    if (currentIndex < reviewSession.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionComplete(true);
      // Save final session
      await saveReviewSession({
        ...reviewSession,
        items: updatedItems,
        completedAt: new Date().toISOString(),
        correctAnswers: newCorrectCount,
      });
    }
  }, [reviewSession, currentIndex, dueItems, correctCount]);

  const skipItem = useCallback(() => {
    if (!reviewSession) return;
    
    if (currentIndex < reviewSession.items.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setSessionComplete(true);
    }
  }, [reviewSession, currentIndex]);

  const endSession = useCallback(async () => {
    if (reviewSession) {
      await saveReviewSession({
        ...reviewSession,
        completedAt: new Date().toISOString(),
        correctAnswers: correctCount,
      });
    }
    setReviewSession(null);
    setCurrentIndex(0);
    setSessionComplete(false);
    setCorrectCount(0);
    await loadDueItems();
  }, [reviewSession, correctCount, loadDueItems]);

  const currentItem = reviewSession?.items[currentIndex] || null;
  const totalItems = reviewSession?.items.length || 0;

  return {
    dueItems,
    dueCount: dueItems.length,
    isLoading,
    error,
    reviewSession,
    currentItem,
    currentIndex,
    totalItems,
    sessionComplete,
    correctCount,
    startReviewSession,
    submitAnswer,
    skipItem,
    endSession,
    refresh: loadDueItems,
  };
}
