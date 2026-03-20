'use client';

import { useState, useEffect, useCallback } from 'react';
import { CourseProgress, ModuleProgress } from '@/types/lms';
import { getCourseProgress, saveCourseProgress } from '@/lib/data/progressStorage';

interface UseCourseProgressReturn {
  progress: CourseProgress | null;
  isLoading: boolean;
  error: Error | null;
  completionPercentage: number;
  isComplete: boolean;
  markModuleComplete: (moduleId: string) => Promise<void>;
  saveQuizResult: (score: number, passed: boolean) => Promise<void>;
  updateModuleProgress: (moduleProgress: ModuleProgress) => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for tracking progress within a course
 * 
 * @param courseId - The ID of the course to track
 * @returns Course progress state and control functions
 * 
 * @example
 * ```tsx
 * function CourseDashboard({ courseId }: { courseId: string }) {
 *   const { progress, completionPercentage, isComplete } = useCourseProgress(courseId);
 *   
 *   return (
 *     <div>
 *       <ProgressBar value={completionPercentage} />
 *       {isComplete && <CertificateButton courseId={courseId} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCourseProgress(courseId: string): UseCourseProgressReturn {
  const [progress, setProgress] = useState<CourseProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getCourseProgress(courseId);
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load course progress'));
    } finally {
      setIsLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const completionPercentage = progress?.completedModules.length 
    ? Math.round((progress.completedModules.length / Object.keys(progress.moduleProgress || {}).length) * 100)
    : 0;

  const isComplete = Boolean(progress?.status === 'completed' || 
    (progress?.quizPassed && progress?.completedModules && progress?.completedModules.length > 0));

  const markModuleComplete = useCallback(async (moduleId: string) => {
    try {
      const current = progress || {
        courseId,
        userId: 'anonymous',
        status: 'in-progress',
        completedModules: [],
        moduleProgress: {},
        quizAttempts: [],
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        totalTimeSpent: 0,
      };

      if (!current.completedModules.includes(moduleId)) {
        const updated: CourseProgress = {
          ...current,
          completedModules: [...current.completedModules, moduleId],
          lastAccessedAt: new Date().toISOString(),
        };
        await saveCourseProgress(courseId, updated);
        await loadProgress();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to mark module complete'));
    }
  }, [courseId, progress, loadProgress]);

  const saveQuizResult = useCallback(async (score: number, passed: boolean) => {
    try {
      const current = progress || {
        courseId,
        userId: 'anonymous',
        status: 'in-progress',
        completedModules: [],
        moduleProgress: {},
        quizAttempts: [],
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        totalTimeSpent: 0,
      };

      const updated: CourseProgress = {
        ...current,
        quizScore: score,
        quizPassed: passed,
        status: passed ? 'completed' : 'in-progress',
        completedAt: passed ? new Date().toISOString() : undefined,
        lastAccessedAt: new Date().toISOString(),
      };

      await saveCourseProgress(courseId, updated);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to save quiz result'));
    }
  }, [courseId, progress, loadProgress]);

  const updateModuleProgress = useCallback(async (moduleProgress: ModuleProgress) => {
    try {
      const current = progress || {
        courseId,
        userId: 'anonymous',
        status: 'in-progress',
        completedModules: [],
        moduleProgress: {},
        quizAttempts: [],
        startedAt: new Date().toISOString(),
        lastAccessedAt: new Date().toISOString(),
        totalTimeSpent: 0,
      };

      const updated: CourseProgress = {
        ...current,
        moduleProgress: {
          ...current.moduleProgress,
          [moduleProgress.moduleId]: moduleProgress,
        },
        lastAccessedAt: new Date().toISOString(),
      };

      await saveCourseProgress(courseId, updated);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update module progress'));
    }
  }, [courseId, progress, loadProgress]);

  return {
    progress,
    isLoading,
    error,
    completionPercentage,
    isComplete,
    markModuleComplete,
    saveQuizResult,
    updateModuleProgress,
    refresh: loadProgress,
  };
}
