'use client';

import { useState, useEffect, useCallback } from 'react';
import { OverallProgress, Achievement, WeeklyGoal } from '@/types/lms';
import { getOverallProgress, saveOverallProgress } from '@/lib/data/progressStorage';
import { courses } from '@/data/courses';

interface UseOverallProgressReturn {
  progress: OverallProgress | null;
  isLoading: boolean;
  error: Error | null;
  overallPercentage: number;
  updateWeeklyGoal: (minutes: number) => Promise<void>;
  recordStudySession: (minutes: number) => Promise<void>;
  checkAndUpdateStreak: () => Promise<void>;
  refresh: () => Promise<void>;
}

/**
 * Hook for tracking overall learning progress across all courses
 * 
 * @returns Overall progress state and control functions
 * 
 * @example
 * ```tsx
 * function Dashboard() {
 *   const { progress, overallPercentage, recordStudySession } = useOverallProgress();
 *   
 *   return (
 *     <div>
 *       <h1>Your Progress</h1>
 *       <ProgressRing value={overallPercentage} />
 *       <p>Current Streak: {progress?.currentStreak} days</p>
 *       <p>Courses Completed: {progress?.completedCourses}</p>
 *     </div>
 *   );
 * }
 * ```
 */
export function useOverallProgress(): UseOverallProgressReturn {
  const [progress, setProgress] = useState<OverallProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getOverallProgress();
      setProgress(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load overall progress'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const totalModules = courses.reduce((acc, course) => acc + course.modules.length, 0);
  
  const overallPercentage = progress?.totalModules 
    ? Math.round((progress.completedModules / totalModules) * 100)
    : 0;

  const updateWeeklyGoal = useCallback(async (targetMinutes: number) => {
    try {
      const current = progress || {
        userId: 'anonymous',
        totalCourses: courses.length,
        completedCourses: 0,
        inProgressCourses: 0,
        totalModules,
        completedModules: 0,
        totalTimeSpent: 0,
        averageQuizScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        achievements: [],
        weeklyGoal: {
          targetMinutes,
          completedMinutes: 0,
          weekStart: new Date().toISOString(),
        },
      };

      const updated: OverallProgress = {
        ...current,
        weeklyGoal: {
          ...current.weeklyGoal,
          targetMinutes,
        },
      };

      await saveOverallProgress(updated);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update weekly goal'));
    }
  }, [progress, totalModules, loadProgress]);

  const recordStudySession = useCallback(async (minutes: number) => {
    try {
      const current = progress || {
        userId: 'anonymous',
        totalCourses: courses.length,
        completedCourses: 0,
        inProgressCourses: 0,
        totalModules,
        completedModules: 0,
        totalTimeSpent: 0,
        averageQuizScore: 0,
        currentStreak: 0,
        longestStreak: 0,
        achievements: [],
        weeklyGoal: {
          targetMinutes: 120,
          completedMinutes: 0,
          weekStart: new Date().toISOString(),
        },
      };

      const today = new Date().toISOString().split('T')[0];
      const lastStudy = current.lastStudyDate;

      // Update streak logic
      let newStreak = current.currentStreak;
      if (lastStudy) {
        const lastDate = new Date(lastStudy);
        const todayDate = new Date(today);
        const diffDays = Math.floor((todayDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));
        
        if (diffDays === 1) {
          newStreak += 1;
        } else if (diffDays > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      const updated: OverallProgress = {
        ...current,
        totalTimeSpent: current.totalTimeSpent + minutes,
        currentStreak: newStreak,
        longestStreak: Math.max(current.longestStreak, newStreak),
        lastStudyDate: today,
        weeklyGoal: {
          ...current.weeklyGoal,
          completedMinutes: current.weeklyGoal.completedMinutes + minutes,
        },
      };

      await saveOverallProgress(updated);
      await loadProgress();
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to record study session'));
    }
  }, [progress, totalModules, loadProgress]);

  const checkAndUpdateStreak = useCallback(async () => {
    try {
      if (!progress?.lastStudyDate) return;

      const today = new Date();
      const lastStudy = new Date(progress.lastStudyDate);
      const diffDays = Math.floor((today.getTime() - lastStudy.getTime()) / (1000 * 60 * 60 * 24));

      if (diffDays > 1) {
        // Streak broken
        const updated: OverallProgress = {
          ...progress,
          currentStreak: 0,
        };
        await saveOverallProgress(updated);
        await loadProgress();
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to check streak'));
    }
  }, [progress, loadProgress]);

  return {
    progress,
    isLoading,
    error,
    overallPercentage,
    updateWeeklyGoal,
    recordStudySession,
    checkAndUpdateStreak,
    refresh: loadProgress,
  };
}
