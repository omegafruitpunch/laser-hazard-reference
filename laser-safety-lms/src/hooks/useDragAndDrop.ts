'use client';

import { useState, useCallback } from 'react';
import { DragDropExercise, DragDropItem, DropZone } from '@/types/lms';

interface DragItemState {
  itemId: string;
  zoneId: string | null;
  isCorrect: boolean | null;
}

interface UseDragAndDropReturn {
  exercise: DragDropExercise | null;
  itemStates: Record<string, DragItemState>;
  score: number;
  maxScore: number;
  isComplete: boolean;
  allCorrect: boolean;
  attempts: number;
  dragItem: (itemId: string) => void;
  dropItem: (zoneId: string) => void;
  checkAnswers: () => void;
  reset: () => void;
  getItemsInZone: (zoneId: string) => string[];
  getZoneForItem: (itemId: string) => string | null;
}

/**
 * Hook for managing drag-and-drop exercise state
 * 
 * @param exercise - The drag-and-drop exercise configuration
 * @returns Drag-and-drop state and control functions
 * 
 * @example
 * ```tsx
 * function DragDropActivity({ exercise }: { exercise: DragDropExercise }) {
 *   const { 
 *     itemStates, 
 *     score, 
 *     isComplete, 
 *     checkAnswers,
 *     getItemsInZone 
 *   } = useDragAndDrop(exercise);
 *   
 *   return (
 *     <div>
 *       <DragItems items={exercise.items} states={itemStates} />
 *       <DropZones 
 *         zones={exercise.zones}
 *         items={getItemsInZone}
 *       />
 *       {!isComplete && <button onClick={checkAnswers}>Check</button>}
 *       {isComplete && <ScoreDisplay score={score} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useDragAndDrop(exercise: DragDropExercise | null): UseDragAndDropReturn {
  const [itemStates, setItemStates] = useState<Record<string, DragItemState>>({});
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [draggedItemId, setDraggedItemId] = useState<string | null>(null);

  const maxScore = exercise?.scoring?.pointsPerCorrect 
    ? exercise.items.length * exercise.scoring.pointsPerCorrect
    : exercise?.items.length || 0;

  const initializeStates = useCallback(() => {
    if (!exercise) return;
    
    const initialStates: Record<string, DragItemState> = {};
    exercise.items.forEach(item => {
      initialStates[item.id] = {
        itemId: item.id,
        zoneId: null,
        isCorrect: null,
      };
    });
    setItemStates(initialStates);
    setScore(0);
    setIsComplete(false);
    setAttempts(0);
  }, [exercise]);

  useState(() => {
    initializeStates();
  });

  const dragItem = useCallback((itemId: string) => {
    setDraggedItemId(itemId);
  }, []);

  const dropItem = useCallback((zoneId: string) => {
    if (!draggedItemId) return;

    setItemStates(prev => ({
      ...prev,
      [draggedItemId]: {
        ...prev[draggedItemId],
        zoneId,
        isCorrect: null, // Reset correctness when moved
      },
    }));
    setDraggedItemId(null);
  }, [draggedItemId]);

  const checkAnswers = useCallback(() => {
    if (!exercise) return;

    let newScore = 0;
    const newStates = { ...itemStates };
    let allItemsCorrect = true;

    exercise.items.forEach(item => {
      const state = newStates[item.id];
      const isCorrect = state?.zoneId === item.correctZoneId;
      
      newStates[item.id] = {
        ...state,
        isCorrect,
      };

      if (isCorrect) {
        newScore += exercise.scoring?.pointsPerCorrect || 1;
      } else {
        allItemsCorrect = false;
        if (exercise.scoring?.pointsPerIncorrect) {
          newScore -= exercise.scoring.pointsPerIncorrect;
        }
      }
    });

    setItemStates(newStates);
    setScore(Math.max(0, newScore));
    setAttempts(prev => prev + 1);

    const shouldComplete = exercise.scoring?.requireAllCorrect 
      ? allItemsCorrect 
      : true;

    if (shouldComplete) {
      setIsComplete(true);
    }
  }, [exercise, itemStates]);

  const reset = useCallback(() => {
    initializeStates();
  }, [initializeStates]);

  const getItemsInZone = useCallback((zoneId: string): string[] => {
    return Object.values(itemStates)
      .filter(state => state.zoneId === zoneId)
      .map(state => state.itemId);
  }, [itemStates]);

  const getZoneForItem = useCallback((itemId: string): string | null => {
    return itemStates[itemId]?.zoneId || null;
  }, [itemStates]);

  const allCorrect = Object.values(itemStates).every(state => state.isCorrect === true);

  return {
    exercise,
    itemStates,
    score,
    maxScore,
    isComplete,
    allCorrect,
    attempts,
    dragItem,
    dropItem,
    checkAnswers,
    reset,
    getItemsInZone,
    getZoneForItem,
  };
}
