/**
 * Learning Path Detail API Route
 * 
 * GET /api/knowledge/paths/[pathId] - Get learning path details
 */

import { NextRequest, NextResponse } from 'next/server';
import { getLearningPathById, getPathSkills } from '@/lib/data/knowledgeGraphData';
import { ApiResponse, LearningPath } from '@/types';

interface LearningPathDetail extends LearningPath {
  skills: string[];
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ pathId: string }> }
): Promise<NextResponse<ApiResponse<LearningPathDetail>>> {
  try {
    const { pathId } = await params;
    
    const [path, skills] = await Promise.all([
      getLearningPathById(pathId),
      getPathSkills(pathId),
    ]);
    
    if (!path) {
      const errorResponse: ApiResponse<LearningPathDetail> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `Learning path with ID '${pathId}' not found`,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    const pathDetail: LearningPathDetail = {
      ...path,
      skills,
    };
    
    const response: ApiResponse<LearningPathDetail> = {
      success: true,
      data: pathDetail,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/knowledge/paths/[pathId]:', error);
    
    const errorResponse: ApiResponse<LearningPathDetail> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch learning path',
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
