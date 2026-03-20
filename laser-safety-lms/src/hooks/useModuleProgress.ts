'use client';

import { useState, useEffect, useCallback } from 'react';
import { ModuleProgress, ModuleStatus } from '@/types/lms';
import { getModuleProgress, saveModuleProgress, markModuleComplete as saveModuleComplete } from '@/lib/data/progressStorage';

interface UseModuleProgressReturn {
  progress: ModuleProgress | null;
  isLoading: boolean;
  error: Error | null;
  markComplete: () => Promise<void>;
  markPhaseComplete: (phaseId: string) => Promise<void>;
  markComponentComplete: (componentId: string) => Promise<void>;
  updateTimeSpent: (minutes: number) => Promise<void>;
  saveNotes: (notes: string) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for tracking progress within a specific module
 * 
 * @param courseId - The ID of the course containing the module
 * @param moduleId - The ID of the module to track
 * @returns Module progress state and control functions
 * 
 * @example
 * ```tsx
 * function ModuleViewer({ courseId, moduleId }: { courseId: string; moduleId: string }) {
 *   const { progress, markComplete, markPhaseComplete } = useModuleProgress(courseId, moduleId);
 *   
 *   return (
 *     <div>
 *       <h1>Module Progress</h1>
 *       <p>Status: {progress?.status}</p>
 *       <button onClick={markComplete}>Mark Complete</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useModuleProgress(courseId: string, moduleId: string): UseModuleProgressReturn {
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getModuleProgress(courseId, moduleId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load module progress'));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, moduleId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const markComplete = useCallback(async () => {
    try {
      await saveModuleComplete(courseId, moduleId);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark module complete'));
    }
  }, [courseId, moduleId, loadProgress]);

  const markPhaseComplete = useCallback(async (phaseId: string) => {
    try {
      const current = progress || {
        moduleId,
        status: 'in-progress' as ModuleStatus,
        phasesCompleted: [],
        componentsCompleted: [],
        timeSpent: 0,
      };
      
      if (!current.phasesCompleted.includes(phaseId)) {
        const updated: ModuleProgress = {
          ...current,
          phasesCompleted: [...current.phasesCompleted, phaseId],
          status: 'in-progress',
        };
        await saveModuleProgress(courseId, updated);
        await loadProgress();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark phase complete'));
    }
  }, [courseId, moduleId, progress, loadProgress]);

  const markComponentComplete = useCallback(async (componentId: string) => {
    try {
      const current = progress || {
        moduleId,
        status: 'in-progress' as ModuleStatus,
        phasesCompleted: [],
        componentsCompleted: [],
        timeSpent: 0,
      };
      
      if (!current.componentsCompleted.includes(componentId)) {
        const updated: ModuleProgress = {
          ...current,
          componentsCompleted: [...current.componentsCompleted, componentId],
          status: 'in-progress',
        };
        await saveModuleProgress(courseId, updated);
        await loadProgress();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark component complete'));
    }
  }, [courseId, moduleId, progress, loadProgress]);

  const updateTimeSpent = useCallback(async (minutes: number) => {
    try {
      const current = progress || {
        moduleId,
        status: 'in-progress' as ModuleStatus,
        phasesCompleted: [],
        componentsCompleted: [],
        timeSpent: 0,
      };
      
      const updated: ModuleProgress = {
        ...current,
        timeSpent: current.timeSpent + minutes,
        status: current.status === 'not-started' ? 'in-progress' : current.status,
      };
      
      await saveModuleProgress(courseId, updated);
      setProgress(updated);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update time spent'));
    }
  }, [courseId, moduleId, progress]);

  const saveNotes = useCallback(async (notes: string) => {
    try {
      const current = progress || {
        moduleId,
        status: 'not-started' as ModuleStatus,
        phasesCompleted: [],
        componentsCompleted: [],
        timeSpent: 0,
      };
      
      const updated: ModuleProgress = {
        ...current,
        notes,
      };
      
      await saveModuleProgress(courseId, updated);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save notes'));
    }
  }, [courseId, moduleId, progress, loadProgress]);

  return {
    progress,
    isLoading,
    error,
    markComplete,
    markPhaseComplete,
    markComponentComplete,
    updateTimeSpent,
    saveNotes,
    refresh: loadProgress,
  };
}
