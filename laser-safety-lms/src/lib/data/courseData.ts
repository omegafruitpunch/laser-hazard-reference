/**
 * Course Data Loader
 * 
 * Provides utilities for loading and querying course data from JSON files.
 * Supports both static generation and runtime data access.
 */

import { promises as fs } from 'fs';
import path from 'path';
import { Course } from '@/types';

// Path to course data files
const COURSES_DIR = path.join(process.cwd(), 'src/data/courses');

/**
 * Get all course IDs from the courses directory
 */
export async function getAllCourseIds(): Promise<string[]> {
  try {
    const files = await fs.readdir(COURSES_DIR);
    return files
      .filter(file => file.endsWith('.json'))
      .map(file => file.replace('.json', ''));
  } catch (error) {
    console.error('Error reading courses directory:', error);
    return [];
  }
}

/**
 * Load a single course by ID
 */
export async function getCourseById(id: string): Promise<Course | null> {
  try {
    const filePath = path.join(COURSES_DIR, `${id}.json`);
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content) as Course;
  } catch (error) {
    console.error(`Error loading course ${id}:`, error);
    return null;
  }
}

/**
 * Load all courses
 */
export async function getAllCourses(): Promise<Course[]> {
  const courseIds = await getAllCourseIds();
  const courses = await Promise.all(
    courseIds.map(id => getCourseById(id))
  );
  return courses.filter((course): course is Course => course !== null);
}

/**
 * Get courses by category
 */
export async function getCoursesByCategory(category: string): Promise<Course[]> {
  const allCourses = await getAllCourses();
  return allCourses.filter(course => 
    course.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Get courses by difficulty level
 */
export async function getCoursesByDifficulty(
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
): Promise<Course[]> {
  const allCourses = await getAllCourses();
  return allCourses.filter(course => course.difficulty === difficulty);
}

/**
 * Get courses by prerequisite
 */
export async function getCoursesByPrerequisite(prereqId: string): Promise<Course[]> {
  const allCourses = await getAllCourses();
  return allCourses.filter(course => 
    course.prerequisites.includes(prereqId)
  );
}

/**
 * Search courses by title or description
 */
export async function searchCourses(query: string): Promise<Course[]> {
  const allCourses = await getAllCourses();
  const lowerQuery = query.toLowerCase();
  return allCourses.filter(course =>
    course.title.toLowerCase().includes(lowerQuery) ||
    course.description.toLowerCase().includes(lowerQuery) ||
    course.learningObjectives?.some(obj => 
      obj.toLowerCase().includes(lowerQuery)
    )
  );
}

/**
 * Get course statistics
 */
export async function getCourseStats() {
  const courses = await getAllCourses();
  return {
    total: courses.length,
    byDifficulty: {
      beginner: courses.filter(c => c.difficulty === 'Beginner').length,
      intermediate: courses.filter(c => c.difficulty === 'Intermediate').length,
      advanced: courses.filter(c => c.difficulty === 'Advanced').length,
    },
    byCategory: courses.reduce((acc, course) => {
      acc[course.category] = (acc[course.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    totalDuration: courses.reduce((sum, c) => sum + c.totalMinutes, 0),
  };
}

// Re-export types
export type { Course };
