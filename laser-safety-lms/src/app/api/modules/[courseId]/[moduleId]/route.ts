/**
 * Module Content API Route
 * 
 * GET /api/modules/[courseId]/[moduleId] - Get module content
 * POST /api/modules/[courseId]/[moduleId]/progress - Update module progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { getModuleById, getNextModule, getPreviousModule } from '@/lib/data/moduleData';
import { ApiResponse, Module } from '@/types';

interface ModuleDetail extends Omit<Module, 'nextModule'> {
  nextModule?: { id: string; title: string } | null;
  previousModule?: { id: string; title: string } | null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
): Promise<NextResponse<ApiResponse<ModuleDetail>>> {
  try {
    const { courseId, moduleId } = await params;
    
    const [module, nextModule, previousModule] = await Promise.all([
      getModuleById(moduleId),
      getNextModule(courseId, moduleId),
      getPreviousModule(courseId, moduleId),
    ]);
    
    if (!module) {
      const errorResponse: ApiResponse<ModuleDetail> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Module with ID '${moduleId}' not found`,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    if (module.courseId !== courseId) {
      const errorResponse: ApiResponse<ModuleDetail> = {
        success: false,
        error: {
          code: 'COURSE_MISMATCH',
          message: `Module '${moduleId}' does not belong to course '${courseId}'`,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
      
      return NextResponse.json(errorResponse, { status: 400 });
    }
    
    const moduleDetail: ModuleDetail = {
      ...module,
      nextModule: nextModule ? { id: nextModule.id, title: nextModule.title } : null,
      previousModule: previousModule ? { id: previousModule.id, title: previousModule.title } : null,
    };
    
    const response: ApiResponse<ModuleDetail> = {
      success: true,
      data: moduleDetail,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/modules/[courseId]/[moduleId]:', error);
    
    const errorResponse: ApiResponse<ModuleDetail> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch module content',
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

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ courseId: string; moduleId: string }> }
): Promise<NextResponse<ApiResponse<{ progress: number; completed: boolean }>>> {
  try {
    const { courseId, moduleId } = await params;
    const body = await request.json();
    const { phaseId, completed, timeSpent } = body;
    
    if (!phaseId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required field: phaseId',
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 400 }
      );
    }
    
    const response: ApiResponse<{ progress: number; completed: boolean }> = {
      success: true,
      data: {
        progress: completed ? 100 : 50,
        completed: completed || false,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/modules/[courseId]/[moduleId]:', error);
    
    const errorResponse: ApiResponse<{ progress: number; completed: boolean }> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update module progress',
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
