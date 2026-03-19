'use client';

import { UserProgress, CourseProgress } from '@/types';

const PROGRESS_KEY = 'laser-lms-progress';
const USER_NAME_KEY = 'laser-lms-username';

export function getProgress(): UserProgress {
  if (typeof window === 'undefined') return {};
  try {
    const raw = localStorage.getItem(PROGRESS_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: UserProgress): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
}

export function getCourseProgress(courseId: string): CourseProgress {
  const progress = getProgress();
  return progress[courseId] ?? { completedModules: [] };
}

export function isModuleComplete(courseId: string, moduleId: string): boolean {
  return getCourseProgress(courseId).completedModules.includes(moduleId);
}

export function markModuleComplete(courseId: string, moduleId: string): void {
  const progress = getProgress();
  const course = progress[courseId] ?? { completedModules: [] };
  if (!course.completedModules.includes(moduleId)) {
    course.completedModules = [...course.completedModules, moduleId];
  }
  progress[courseId] = course;
  saveProgress(progress);
}

export function saveQuizResult(courseId: string, score: number, passed: boolean): void {
  const progress = getProgress();
  const course = progress[courseId] ?? { completedModules: [] };
  course.quizScore = score;
  course.quizPassed = passed;
  if (passed) {
    course.completedAt = new Date().toISOString();
  }
  progress[courseId] = course;
  saveProgress(progress);
}

export function getOverallStats(totalModules: number, totalCourses: number) {
  const progress = getProgress();
  let completedModules = 0;
  let coursesFinished = 0;

  for (const courseProgress of Object.values(progress)) {
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
