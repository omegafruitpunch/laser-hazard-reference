/**
 * Quiz Results API Route
 * 
 * GET /api/quiz/results/[attemptId] - Get quiz results by attempt ID
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, QuizResult } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ attemptId: string }> }
): Promise<NextResponse<ApiResponse<QuizResult>>> {
  try {
    const { attemptId } = await params;
    
    const errorResponse: ApiResponse<QuizResult> = {
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Quiz attempt with ID '${attemptId}' not found`,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(errorResponse, { status: 404 });
  } catch (error) {
    console.error('Error in GET /api/quiz/results/[attemptId]:', error);
    
    const errorResponse: ApiResponse<QuizResult> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch quiz results',
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
