'use client';

import { UserProgress, CourseProgress } from '@/types';

const PROGRESS_KEY = 'laser-lms-progress';
const USER_NAME_KEY = 'laser-lms-username';

function createDefaultUserProgress(): UserProgress {
  return {
    userId: '',
    courses: {},
    modules: {},
    totalTimeSpent: 0,
    streakDays: 0,
    lastActivityAt: new Date().toISOString(),
  };
}

function createDefaultCourseProgress(courseId: string): CourseProgress {
  return {
    courseId,
    status: 'available',
    progress: 0,
    completedModules: [],
    quizAttempts: 0,
  };
}

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return createDefaultUserProgress();
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    if (!raw) return createDefaultUserProgress();
    const parsed = JSON.parse(raw);
    // Ensure all required fields exist (handle corrupted/partial data)
    return {
      ...createDefaultUserProgress(),
      ...parsed,
      courses: parsed.courses || {},
      modules: parsed.modules || {},
    };
  } catch {
    return createDefaultUserProgress();
  }
}

function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getCourseProgress(courseId: string): CourseProgress {
  const progress = getProgress();
  return progress.courses[courseId] ?? createDefaultCourseProgress(courseId);
}

export function isModuleComplete(courseId: string, moduleId: string): boolean {
  return getCourseProgress(courseId).completedModules.includes(moduleId);
}

export function markModuleComplete(courseId: string, moduleId: string): void {
  const progress = getProgress();
  const course = progress.courses[courseId] ?? createDefaultCourseProgress(courseId);
  if (!course.completedModules.includes(moduleId)) {
    course.completedModules = [...course.completedModules, moduleId];
  }
  progress.courses[courseId] = course;
  progress.lastActivityAt = new Date().toISOString();
  saveProgress(progress);
}

export function saveQuizResult(courseId: string, score: number, passed: boolean): void {
  const progress = getProgress();
  const course = progress.courses[courseId] ?? createDefaultCourseProgress(courseId);
  course.quizScore = score;
  course.quizPassed = passed;
  if (passed) {
    course.completedAt = new Date().toISOString();
  }
  progress.courses[courseId] = course;
  progress.lastActivityAt = new Date().toISOString();
  saveProgress(progress);
}

export function getOverallStats(totalModules: number, totalCourses: number) {
  const progress = getProgress();
  let completedModules = 0;
  let coursesFinished = 0;

  for (const courseProgress of Object.values(progress.courses || {})) {
    completedModules += courseProgress.completedModules.length;
    if (courseProgress.quizPassed) coursesFinished++;
  }

  return {
    completedModules,
    coursesFinished,
    totalModules,
    totalCourses,
    overallPercent: totalModules > 0 ? Math.round((completedModules / totalModules) * 100) : 0,
  };
}

export function getUserName(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem(USER_NAME_KEY) ?? '';
}

export function setUserName(name: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_NAME_KEY, name);
}

export function resetAllProgress(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(PROGRESS_KEY);
}
