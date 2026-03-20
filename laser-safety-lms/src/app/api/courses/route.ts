/**
 * Course API Routes
 * 
 * GET /api/courses - List all courses
 * Query params:
 *   - category: Filter by category
 *   - difficulty: Filter by difficulty level
 *   - search: Search in title and description
 *   - page: Page number (default: 1)
 *   - pageSize: Items per page (default: 10)
 */

import { NextRequest, NextResponse } from 'next/server';
import { getAllCourses, getCoursesByCategory, getCoursesByDifficulty, searchCourses } from '@/lib/data/courseData';
import { ApiResponse, SearchResult, Course } from '@/types';

export async function GET(request: NextRequest): Promise<NextResponse<ApiResponse<SearchResult<Course>>>> {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const category = searchParams.get('category');
    const difficultyRaw = searchParams.get('difficulty');
    const difficulty = difficultyRaw 
      ? (difficultyRaw.charAt(0).toUpperCase() + difficultyRaw.slice(1).toLowerCase()) as 'Beginner' | 'Intermediate' | 'Advanced'
      : null;
    const search = searchParams.get('search');
    const page = parseInt(searchParams.get('page') || '1', 10);
    const pageSize = Math.min(parseInt(searchParams.get('pageSize') || '10', 10), 50);
    
    // Get courses based on filters
    let courses: Course[];
    
    if (search) {
      courses = await searchCourses(search);
    } else if (category) {
      courses = await getCoursesByCategory(category);
    } else if (difficulty) {
      courses = await getCoursesByDifficulty(difficulty);
    } else {
      courses = await getAllCourses();
    }
    
    // Calculate pagination
    const total = courses.length;
    const totalPages = Math.ceil(total / pageSize);
    const startIndex = (page - 1) * pageSize;
    const paginatedCourses = courses.slice(startIndex, startIndex + pageSize);
    
    const response: ApiResponse<SearchResult<Course>> = {
      success: true,
      data: {
        items: paginatedCourses,
        total,
        page,
        pageSize,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
        pagination: {
          page,
          pageSize,
          total,
          totalPages,
        },
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/courses:', error);
    
    const errorResponse: ApiResponse<SearchResult<Course>> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch courses',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(errorResponse, { status: 500 });
  }
}
