/**
 * Quiz API Route
 * 
 * GET /api/quiz/[moduleId] - Get quiz questions for a module
 */

import { NextRequest, NextResponse } from 'next/server';
import { getQuizByModuleId } from '@/lib/data/quizData';
import { ApiResponse, QuizBank } from '@/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ moduleId: string }> }
): Promise<NextResponse<ApiResponse<QuizBank>>> {
  try {
    const { moduleId } = await params;
    
    const quizBank = await getQuizByModuleId(moduleId);
    
    if (!quizBank) {
      const errorResponse: ApiResponse<QuizBank> = {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: `No quiz found for module '${moduleId}'`,
        },
        meta: {
          timestamp: new Date().toISOString(),
          requestId: crypto.randomUUID(),
        },
      };
      
      return NextResponse.json(errorResponse, { status: 404 });
    }
    
    const response: ApiResponse<QuizBank> = {
      success: true,
      data: quizBank,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/quiz/[moduleId]:', error);
    
    const errorResponse: ApiResponse<QuizBank> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch quiz questions',
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
