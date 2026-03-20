/**
 * Course Detail API Route
 * 
 * GET /api/courses/[id] - Get course details by ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { getCourseById } from '@/lib/data/courseData';
import { getModulesByCourseId } from '@/lib/data/moduleData';
import { ApiResponse, Course, Module } from '@/types';

interface CourseDetail extends Omit<Course, 'modules'> {
  modules: Module[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse<ApiResponse<CourseDetail>>> {
  try {
    const { id } = await params;
    
    const [course, modules] = await Promise.all([
      getCourseById(id),
      getModulesByCourseId(id),
    ]);
    
    if (!course) {
      const errorResponse: ApiResponse<CourseDetail> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Course with ID '${id}' not found`,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    const courseDetail: CourseDetail = {
      ...course,
      modules,
    };
    
    const response: ApiResponse<CourseDetail> = {
      success: true,
      data: courseDetail,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error(`Error in GET /api/courses/[id]:`, error);
    
    const errorResponse: ApiResponse<CourseDetail> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch course details',
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
