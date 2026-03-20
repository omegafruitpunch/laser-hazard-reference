/**
 * Module Data Loader
 * 
 * Provides utilities for loading and querying module content from JSON files.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Module } from '@/types';

const MODULES_DIR = path.join(process.cwd(), 'src/data/modules');

/**
 * Get all module IDs
 */
export async function getAllModuleIds(): Promise<string[]> {
  try {
    const files = await fs.readdir(MODULES_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading modules directory:', error);
    return [];
  }
}

/**
 * Load a single module by ID
 */
export async function getModuleById(id: string): Promise<Module | null> {
  try {
    const filePath = path.join(MODULES_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Module;
  } catch (error) {
    console.error(`Error loading module ${id}:`, error);
    return null;
  }
}

/**
 * Get all modules for a specific course
 */
export async function getModulesByCourseId(courseId: string): Promise<Module[]> {
  const moduleIds = await getAllModuleIds();
  const modules = await Promise.all(
    moduleIds.map(id => getModuleById(id))
  );
  return modules
    .filter((module): module is Module => module !== null)
    .filter(module => module.courseId === courseId)
    .sort((a, b) => (a.order || 0) - (b.order || 0));
}

/**
 * Load multiple modules by their IDs
 */
export async function getModulesByIds(ids: string[]): Promise<Module[]> {
  const modules = await Promise.all(
    ids.map(id => getModuleById(id))
  );
  return modules.filter((module): module is Module => module !== null);
}

/**
 * Get the next module in sequence
 */
export async function getNextModule(
  courseId: string, 
  currentModuleId: string
): Promise<Module | null> {
  const modules = await getModulesByCourseId(courseId);
  const currentIndex = modules.findIndex(m => m.id === currentModuleId);
  
  if (currentIndex === -1 || currentIndex === modules.length - 1) {
    return null;
  }
  
  return modules[currentIndex + 1];
}

/**
 * Get the previous module in sequence
 */
export async function getPreviousModule(
  courseId: string, 
  currentModuleId: string
): Promise<Module | null> {
  const modules = await getModulesByCourseId(courseId);
  const currentIndex = modules.findIndex(m => m.id === currentModuleId);
  
  if (currentIndex <= 0) {
    return null;
  }
  
  return modules[currentIndex - 1];
}

/**
 * Get module progress statistics
 */
export async function getModuleStats(courseId: string) {
  const modules = await getModulesByCourseId(courseId);
  
  return {
    total: modules.length,
    totalDuration: modules.reduce((sum, m) => sum + (m.duration || 0), 0),
    byDifficulty: modules.reduce((acc, module) => {
      if (module.difficulty) {
        acc[module.difficulty] = (acc[module.difficulty] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>),
    phases: modules.reduce((acc, module) => {
      module.phases?.forEach(phase => {
        if (phase.type) {
          acc[phase.type] = (acc[phase.type] || 0) + 1;
        }
      });
      return acc;
    }, {} as Record<string, number>),
  };
}

/**
 * Search modules by content
 */
export async function searchModules(query: string): Promise<Module[]> {
  const moduleIds = await getAllModuleIds();
  const modules = await Promise.all(
    moduleIds.map(id => getModuleById(id))
  );
  
  const lowerQuery = query.toLowerCase();
  return modules
    .filter((module): module is Module => module !== null)
    .filter(module =>
      module.title.toLowerCase().includes(lowerQuery) ||
      module.description.toLowerCase().includes(lowerQuery) ||
      module.phases?.some(phase =>
        phase.content?.toLowerCase().includes(lowerQuery) ||
        phase.title?.toLowerCase().includes(lowerQuery)
      ) || false
    );
}

/**
 * Validate module prerequisites are met
 */
export async function validatePrerequisites(
  moduleId: string, 
  completedModules: string[]
): Promise<{ valid: boolean; missing: string[] }> {
  const module = await getModuleById(moduleId);
  
  if (!module) {
    return { valid: false, missing: [] };
  }
  
  const missing = (module.prerequisites || []).filter(
    prereq => !completedModules.includes(prereq)
  );
  
  return {
    valid: missing.length === 0,
    missing,
  };
}

// Re-export types
export type { Module };
