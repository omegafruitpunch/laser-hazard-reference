/**
 * Knowledge Recommendations API Route
 * 
 * GET /api/knowledge/recommendations - Get learning recommendations
 */

import { NextRequest, NextResponse } from 'next/server';
import { getRecommendedPaths } from '@/lib/data/knowledgeGraphData';
import { ApiResponse } from '@/types';

interface Recommendation {
  type: 'course' | 'learning_path';
  id: string;
  title: string;
  description: string;
  relevance: number;
  progress?: number;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Recommendation[]>>> {
  try {
    const { searchParams } = new URL(request.url);
    
    const completedCoursesParam = searchParams.get('completedCourses');
    const completedCourses = completedCoursesParam 
      ? completedCoursesParam.split(',') 
      : [];
    const limit = Math.min(parseInt(searchParams.get('limit') || '5', 10), 20);
    
    const pathRecommendations = await getRecommendedPaths(completedCourses);
    
    const recommendations: Recommendation[] = await Promise.all(
      pathRecommendations
        .slice(0, limit)
        .map(async ({ path, progress }) => ({
          type: 'learning_path' as const,
          id: path.id,
          title: path.title,
          description: path.description,
          relevance: progress,
          progress,
        }))
    );
    
    const response: ApiResponse<Recommendation[]> = {
      success: true,
      data: recommendations,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/knowledge/recommendations:', error);
    
    const errorResponse: ApiResponse<Recommendation[]> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to get recommendations',
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
