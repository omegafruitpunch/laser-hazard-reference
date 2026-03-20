'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { LearningPath, PathCourse, Milestone, CourseProgress } from '@/types/lms';
import { getLearningPath, getPathProgress } from '@/lib/data/knowledgeGraphClient';
import { getCourseProgress } from '@/lib/data/progressStorage';

interface PathProgress {
  completedCourses: number;
  totalCourses: number;
  completionPercentage: number;
  nextCourse: PathCourse | null;
  completedMilestones: Milestone[];
  upcomingMilestones: Milestone[];
}

interface UseLearningPathReturn {
  path: LearningPath | null;
  progress: PathProgress | null;
  isLoading: boolean;
  error: Error | null;
  getCourseProgress: (courseId: string) => Promise<CourseProgress | null>;
  isCourseUnlocked: (courseId: string) => boolean;
  getRecommendedNextStep: () => PathCourse | null;
  refresh: () => Promise<void>;
}

/**
 * Hook for managing learning path progress and navigation
 * 
 * @param pathId - The ID of the learning path to track
 * @returns Learning path state and helper functions
 * 
 * @example
 * ```tsx
 * function LearningPathView({ pathId }: { pathId: string }) {
 *   const { path, progress, isCourseUnlocked, getRecommendedNextStep } = useLearningPath(pathId);
 *   const nextCourse = getRecommendedNextStep();
 *   
 *   return (
 *     <div>
 *       <PathHeader 
 *         title={path?.name}
 *         progress={progress?.completionPercentage}
 *       />
 *       <CourseList 
 *         courses={path?.courses}
 *         isUnlocked={isCourseUnlocked}
 *       />
 *       {nextCourse && <NextCourseCard course={nextCourse} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useLearningPath(pathId: string): UseLearningPathReturn {
  const [path, setPath] = useState<LearningPath | null>(null);
  const [courseProgressMap, setCourseProgressMap] = useState<Record<string, CourseProgress>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadPath = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const pathData = await getLearningPath(pathId);
      setPath(pathData);
      
      // Load progress for all courses in path
      const progressMap: Record<string, CourseProgress> = {};
      for (const course of pathData?.courses || []) {
        const progress = await getCourseProgress(course.courseId);
        if (progress) {
          progressMap[course.courseId] = progress;
        }
      }
      setCourseProgressMap(progressMap);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load learning path'));
    } finally {
      setIsLoading(false);
    }
  }, [pathId]);

  useEffect(() => {
    loadPath();
  }, [loadPath]);

  const progress = useMemo((): PathProgress | null => {
    if (!path) return null;

    const sortedCourses = [...path.courses].sort((a, b) => a.order - b.order);
    const completedCourses = sortedCourses.filter(
      c => courseProgressMap[c.courseId]?.status === 'completed'
    );
    
    const nextCourse = sortedCourses.find(c => {
      const progress = courseProgressMap[c.courseId];
      return !progress || progress.status !== 'completed';
    }) || null;

    const completedMilestones = path.milestones.filter(milestone => {
      if (milestone.criteria.type === 'courses-complete') {
        return completedCourses.length >= milestone.criteria.threshold;
      }
      if (milestone.criteria.type === 'quiz-average') {
        const scores = Object.values(courseProgressMap)
          .map(p => p.quizScore)
          .filter((s): s is number => s !== undefined);
        const avgScore = scores.length > 0 
          ? scores.reduce((a, b) => a + b, 0) / scores.length 
          : 0;
        return avgScore >= milestone.criteria.threshold;
      }
      return false;
    });

    return {
      completedCourses: completedCourses.length,
      totalCourses: sortedCourses.length,
      completionPercentage: Math.round((completedCourses.length / sortedCourses.length) * 100),
      nextCourse,
      completedMilestones,
      upcomingMilestones: path.milestones.filter(m => !completedMilestones.includes(m)),
    };
  }, [path, courseProgressMap]);

  const isCourseUnlocked = useCallback((courseId: string): boolean => {
    if (!path) return false;
    
    const pathCourse = path.courses.find(c => c.courseId === courseId);
    if (!pathCourse) return false;
    
    // Check if course is required
    if (!pathCourse.required) return true;
    
    // Check unlock criteria
    if (!pathCourse.unlockCriteria) return true;
    
    const { type, threshold, courseId: prereqCourseId } = pathCourse.unlockCriteria;
    
    switch (type) {
      case 'course-complete':
        if (!prereqCourseId) return true;
        return courseProgressMap[prereqCourseId]?.status === 'completed';
      case 'quiz-score':
        if (!prereqCourseId) return true;
        const quizScore = courseProgressMap[prereqCourseId]?.quizScore || 0;
        return quizScore >= (threshold || 0);
      case 'time-delay':
        // Simplified: check if enough days have passed since starting path
        return true;
      case 'manual':
        return false;
      default:
        return true;
    }
  }, [path, courseProgressMap]);

  const getRecommendedNextStep = useCallback((): PathCourse | null => {
    if (!path) return null;
    
    const sortedCourses = [...path.courses].sort((a, b) => a.order - b.order);
    
    for (const course of sortedCourses) {
      const progress = courseProgressMap[course.courseId];
      if (!progress || progress.status !== 'completed') {
        if (isCourseUnlocked(course.courseId)) {
          return course;
        }
        break;
      }
    }
    
    return null;
  }, [path, courseProgressMap, isCourseUnlocked]);

  const getCourseProgressById = useCallback(async (courseId: string): Promise<CourseProgress | null> => {
    return courseProgressMap[courseId] || null;
  }, [courseProgressMap]);

  return {
    path,
    progress,
    isLoading,
    error,
    getCourseProgress: getCourseProgressById,
    isCourseUnlocked,
    getRecommendedNextStep,
    refresh: loadPath,
  };
}
