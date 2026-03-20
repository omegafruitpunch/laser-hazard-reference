'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { CourseProgress, ModuleProgress, OverallProgress } from '@/types/lms';
import { 
  getCourseProgress, 
  saveCourseProgress, 
  getOverallProgress, 
  saveOverallProgress 
} from '@/lib/data/progressStorage';
import { courses } from '@/data/courses';

interface ProgressContextState {
  // Course progress
  courseProgress: Record<string, CourseProgress>;
  getCourseProgress: (courseId: string) => CourseProgress | null;
  updateCourseProgress: (courseId: string, progress: Partial<CourseProgress>) => void;
  markModuleComplete: (courseId: string, moduleId: string) => void;
  
  // Module progress
  moduleProgress: Record<string, ModuleProgress>;
  getModuleProgress: (courseId: string, moduleId: string) => ModuleProgress | null;
  updateModuleProgress: (courseId: string, moduleId: string, progress: Partial<ModuleProgress>) => void;
  
  // Overall progress
  overallProgress: OverallProgress | null;
  updateOverallProgress: (updates: Partial<OverallProgress>) => void;
  recordStudySession: (minutes: number) => void;
  
  // Loading state
  isLoading: boolean;
  error: Error | null;
  
  // Refresh
  refresh: () => Promise<void>;
}

const ProgressContext = createContext<ProgressContextState | undefined>(undefined);

interface ProgressProviderProps {
  children: ReactNode;
}

/**
 * Progress Context Provider
 * 
 * Provides global progress state management for the LMS.
 * Tracks course progress, module progress, and overall learning statistics.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <ProgressProvider>
 *       <YourApp />
 *     </ProgressProvider>
 *   );
 * }
 * 
 * function CoursePage({ courseId }: { courseId: string }) {
 *   const { getCourseProgress, markModuleComplete } = useProgress();
 *   const progress = getCourseProgress(courseId);
 *   
 *   return (
 *     <div>
 *       <ProgressBar value={progress?.completedModules.length} />
 *       <ModuleList onComplete={(moduleId) => markModuleComplete(courseId, moduleId)} />
 *     </div>
 *   );
 * }
 * ```
 */
export function ProgressProvider({ children }: ProgressProviderProps) {
  const [courseProgress, setCourseProgress] = useState<Record<string, CourseProgress>>({});
  const [moduleProgress, setModuleProgress] = useState<Record<string, ModuleProgress>>({});
  const [overallProgress, setOverallProgress] = useState<OverallProgress | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const totalModules = courses.reduce((acc, course) => acc + course.modules.length, 0);

  const loadProgress = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      // Load overall progress
      const overall = await getOverallProgress();
      setOverallProgress(overall);

      // Load progress for all courses
      const courseProgressMap: Record<string, CourseProgress> = {};
      const moduleProgressMap: Record<string, ModuleProgress> = {};

      for (const course of courses) {
        const progress = await getCourseProgress(course.id);
        if (progress) {
          courseProgressMap[course.id] = progress;
          
          // Also populate module progress
          Object.entries(progress.moduleProgress || {}).forEach(([moduleId, modProgress]) => {
            moduleProgressMap[`${course.id}-${moduleId}`] = modProgress;
          });
        }
      }

      setCourseProgress(courseProgressMap);
      setModuleProgress(moduleProgressMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load progress'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadProgress();
  }, [loadProgress]);

  const getCourseProgressById = useCallback((courseId: string): CourseProgress | null => {
    return courseProgress[courseId] || null;
  }, [courseProgress]);

  const updateCourseProgress = useCallback((courseId: string, updates: Partial<CourseProgress>) => {
    setCourseProgress(prev => {
      const current = prev[courseId] || {
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
        ...updates,
        lastAccessedAt: new Date().toISOString(),
      };

      // Save to storage
      saveCourseProgress(courseId, updated);

      return {
        ...prev,
        [courseId]: updated,
      };
    });
  }, []);

  const markModuleComplete = useCallback((courseId: string, moduleId: string) => {
    updateCourseProgress(courseId, {
      completedModules: [...(courseProgress[courseId]?.completedModules || []), moduleId],
    });
  }, [courseProgress, updateCourseProgress]);

  const getModuleProgressById = useCallback((courseId: string, moduleId: string): ModuleProgress | null => {
    return moduleProgress[`${courseId}-${moduleId}`] || null;
  }, [moduleProgress]);

  const updateModuleProgress = useCallback((courseId: string, moduleId: string, updates: Partial<ModuleProgress>) => {
    setModuleProgress(prev => {
      const key = `${courseId}-${moduleId}`;
      const current = prev[key] || {
        moduleId,
        status: 'in-progress',
        phasesCompleted: [],
        componentsCompleted: [],
        timeSpent: 0,
      };

      const updated: ModuleProgress = {
        ...current,
        ...updates,
      };

      // Also update in course progress
      const courseProg = courseProgress[courseId];
      if (courseProg) {
        const updatedCourseProgress: CourseProgress = {
          ...courseProg,
          moduleProgress: {
            ...courseProg.moduleProgress,
            [moduleId]: updated,
          },
        };
        saveCourseProgress(courseId, updatedCourseProgress);
      }

      return {
        ...prev,
        [key]: updated,
      };
    });
  }, [courseProgress]);

  const updateOverallProgress = useCallback((updates: Partial<OverallProgress>) => {
    setOverallProgress(prev => {
      const current = prev || {
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

      const updated: OverallProgress = {
        ...current,
        ...updates,
      };

      saveOverallProgress(updated);
      return updated;
    });
  }, [totalModules]);

  const recordStudySession = useCallback((minutes: number) => {
    setOverallProgress(prev => {
      const current = prev || {
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

      saveOverallProgress(updated);
      return updated;
    });
  }, [totalModules]);

  const value: ProgressContextState = {
    courseProgress,
    getCourseProgress: getCourseProgressById,
    updateCourseProgress,
    markModuleComplete,
    moduleProgress,
    getModuleProgress: getModuleProgressById,
    updateModuleProgress,
    overallProgress,
    updateOverallProgress,
    recordStudySession,
    isLoading,
    error,
    refresh: loadProgress,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

/**
 * Hook to access the ProgressContext
 * 
 * @throws Error if used outside of ProgressProvider
 */
export function useProgress(): ProgressContextState {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}
