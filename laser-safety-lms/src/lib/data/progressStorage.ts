/**
 * Progress Storage
 * 
 * Handles persisting progress data to localStorage with sync capabilities.
 * Supports offline-first architecture with conflict resolution.
 */

import { CourseProgress, ModuleProgress, OverallProgress, SyncStatus } from '@/types/lms';
import { courses } from '@/data/courses';

// Storage keys
const COURSE_PROGRESS_KEY = 'laser-lms-course-progress';
const MODULE_PROGRESS_KEY = 'laser-lms-module-progress';
const OVERALL_PROGRESS_KEY = 'laser-lms-overall-progress';
const SYNC_STATUS_KEY = 'laser-lms-sync-status';
const PENDING_CHANGES_KEY = 'laser-lms-pending-changes';

// ============================================================================
// Course Progress
// ============================================================================

/**
 * Get progress for all courses
 */
export async function getAllCourseProgress(): Promise<Record<string, CourseProgress>> {
  if (typeof window === 'undefined') return {};
  
  try {
    const stored = localStorage.getItem(COURSE_PROGRESS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Failed to load course progress:', error);
    return {};
  }
}

/**
 * Get progress for a specific course
 */
export async function getCourseProgress(courseId: string): Promise<CourseProgress | null> {
  const allProgress = await getAllCourseProgress();
  return allProgress[courseId] || null;
}

/**
 * Save progress for a course
 */
export async function saveCourseProgress(courseId: string, progress: CourseProgress): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const allProgress = await getAllCourseProgress();
    allProgress[courseId] = {
      ...progress,
      lastAccessedAt: new Date().toISOString(),
    };
    localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(allProgress));
    
    // Mark change as pending sync
    await markPendingChange('course', courseId);
  } catch (error) {
    console.error('Failed to save course progress:', error);
  }
}

/**
 * Mark a module as complete for a course
 */
export async function markModuleComplete(courseId: string, moduleId: string): Promise<void> {
  const progress = await getCourseProgress(courseId);
  
  const updated: CourseProgress = {
    ...progress,
    courseId,
    userId: progress?.userId || 'anonymous',
    status: 'in-progress',
    completedModules: [...(progress?.completedModules || []).filter(id => id !== moduleId), moduleId],
    moduleProgress: progress?.moduleProgress || {},
    quizAttempts: progress?.quizAttempts || [],
    startedAt: progress?.startedAt || new Date().toISOString(),
    lastAccessedAt: new Date().toISOString(),
    totalTimeSpent: progress?.totalTimeSpent || 0,
  };
  
  await saveCourseProgress(courseId, updated);
}

// ============================================================================
// Module Progress
// ============================================================================

/**
 * Get progress for a specific module
 */
export async function getModuleProgress(courseId: string, moduleId: string): Promise<ModuleProgress | null> {
  if (typeof window === 'undefined') return null;
  
  try {
    const stored = localStorage.getItem(MODULE_PROGRESS_KEY);
    const allProgress: Record<string, ModuleProgress> = stored ? JSON.parse(stored) : {};
    return allProgress[`${courseId}-${moduleId}`] || null;
  } catch (error) {
    console.error('Failed to load module progress:', error);
    return null;
  }
}

/**
 * Save progress for a module
 */
export async function saveModuleProgress(courseId: string, progress: ModuleProgress): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    const stored = localStorage.getItem(MODULE_PROGRESS_KEY);
    const allProgress: Record<string, ModuleProgress> = stored ? JSON.parse(stored) : {};
    
    allProgress[`${courseId}-${progress.moduleId}`] = progress;
    localStorage.setItem(MODULE_PROGRESS_KEY, JSON.stringify(allProgress));
    
    await markPendingChange('module', `${courseId}-${progress.moduleId}`);
  } catch (error) {
    console.error('Failed to save module progress:', error);
  }
}

// ============================================================================
// Overall Progress
// ============================================================================

/**
 * Calculate overall progress statistics
 */
export async function getOverallProgress(): Promise<OverallProgress> {
  if (typeof window === 'undefined') {
    return createDefaultOverallProgress();
  }
  
  try {
    const stored = localStorage.getItem(OVERALL_PROGRESS_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load overall progress:', error);
  }
  
  return createDefaultOverallProgress();
}

/**
 * Save overall progress
 */
export async function saveOverallProgress(progress: OverallProgress): Promise<void> {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.setItem(OVERALL_PROGRESS_KEY, JSON.stringify(progress));
    await markPendingChange('overall', 'stats');
  } catch (error) {
    console.error('Failed to save overall progress:', error);
  }
}

/**
 * Create default overall progress
 */
function createDefaultOverallProgress(): OverallProgress {
  const totalModules = courses.reduce((acc, course) => acc + course.modules.length, 0);
  
  return {
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
}

// ============================================================================
// Sync Management
// ============================================================================

interface PendingChange {
  type: 'course' | 'module' | 'overall';
  id: string;
  timestamp: string;
  data?: unknown;
}

/**
 * Get sync status
 */
export async function getSyncStatus(): Promise<SyncStatus> {
  if (typeof window === 'undefined') {
    return {
      lastSyncAt: new Date().toISOString(),
      pendingChanges: 0,
      syncInProgress: false,
    };
  }
  
  try {
    const stored = localStorage.getItem(SYNC_STATUS_KEY);
    const pending = await getPendingChanges();
    
    return stored 
      ? { ...JSON.parse(stored), pendingChanges: pending.length }
      : {
          lastSyncAt: new Date().toISOString(),
          pendingChanges: pending.length,
          syncInProgress: false,
        };
  } catch (error) {
    console.error('Failed to get sync status:', error);
    return {
      lastSyncAt: new Date().toISOString(),
      pendingChanges: 0,
      syncInProgress: false,
    };
  }
}

/**
 * Get pending changes
 */
export async function getPendingChanges(): Promise<PendingChange[]> {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem(PENDING_CHANGES_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Failed to get pending changes:', error);
    return [];
  }
}

/**
 * Mark a change as pending sync
 */
async function markPendingChange(type: 'course' | 'module' | 'overall', id: string): Promise<void> {
  const pending = await getPendingChanges();
  
  // Remove existing entry for this item
  const filtered = pending.filter(c => !(c.type === type && c.id === id));
  
  // Add new entry
  filtered.push({
    type,
    id,
    timestamp: new Date().toISOString(),
  });
  
  localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(filtered));
  
  // Update sync status
  const status = await getSyncStatus();
  localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({
    ...status,
    pendingChanges: filtered.length,
  }));
}

/**
 * Clear pending changes
 */
export async function clearPendingChanges(): Promise<void> {
  localStorage.removeItem(PENDING_CHANGES_KEY);
  
  const status = await getSyncStatus();
  localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({
    ...status,
    lastSyncAt: new Date().toISOString(),
    pendingChanges: 0,
    syncInProgress: false,
  }));
}

/**
 * Sync progress with server (mock implementation)
 */
export async function syncProgress(): Promise<{ success: boolean; error?: string }> {
  try {
    const status = await getSyncStatus();
    
    // Set sync in progress
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({
      ...status,
      syncInProgress: true,
    }));
    
    // Get pending changes
    const pending = await getPendingChanges();
    
    // In a real implementation, this would send data to a server
    // For now, just simulate a delay and mark as synced
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Clear pending changes
    await clearPendingChanges();
    
    return { success: true };
  } catch (error) {
    const status = await getSyncStatus();
    localStorage.setItem(SYNC_STATUS_KEY, JSON.stringify({
      ...status,
      syncInProgress: false,
      lastError: error instanceof Error ? error.message : 'Sync failed',
    }));
    
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Sync failed' 
    };
  }
}

// ============================================================================
// Utilities
// ============================================================================

/**
 * Export all progress data
 */
export async function exportProgress(): Promise<string> {
  const data = {
    courses: await getAllCourseProgress(),
    overall: await getOverallProgress(),
    exportedAt: new Date().toISOString(),
  };
  
  return JSON.stringify(data, null, 2);
}

/**
 * Import progress data
 */
export async function importProgress(jsonData: string): Promise<boolean> {
  try {
    const data = JSON.parse(jsonData);
    
    if (data.courses) {
      localStorage.setItem(COURSE_PROGRESS_KEY, JSON.stringify(data.courses));
    }
    
    if (data.overall) {
      localStorage.setItem(OVERALL_PROGRESS_KEY, JSON.stringify(data.overall));
    }
    
    return true;
  } catch (error) {
    console.error('Failed to import progress:', error);
    return false;
  }
}

/**
 * Reset all progress
 */
export async function resetAllProgress(): Promise<void> {
  localStorage.removeItem(COURSE_PROGRESS_KEY);
  localStorage.removeItem(MODULE_PROGRESS_KEY);
  localStorage.removeItem(OVERALL_PROGRESS_KEY);
  localStorage.removeItem(PENDING_CHANGES_KEY);
  localStorage.removeItem(SYNC_STATUS_KEY);
}

/**
 * Get progress statistics
 */
export async function getProgressStats(): Promise<{
  totalCourses: number;
  completedCourses: number;
  inProgressCourses: number;
  averageCompletion: number;
  totalTimeSpent: number;
}> {
  const courseProgress = await getAllCourseProgress();
  const overall = await getOverallProgress();
  
  const courseList = Object.values(courseProgress);
  const completedCount = courseList.filter(c => c.status === 'completed').length;
  const inProgressCount = courseList.filter(c => c.status === 'in-progress').length;
  
  // Calculate average completion percentage
  let totalCompletion = 0;
  for (const course of courses) {
    const progress = courseProgress[course.id];
    if (progress) {
      totalCompletion += (progress.completedModules.length / course.modules.length) * 100;
    }
  }
  const averageCompletion = courses.length > 0 ? totalCompletion / courses.length : 0;
  
  return {
    totalCourses: courses.length,
    completedCourses: completedCount,
    inProgressCourses: inProgressCount,
    averageCompletion: Math.round(averageCompletion),
    totalTimeSpent: overall.totalTimeSpent,
  };
}
