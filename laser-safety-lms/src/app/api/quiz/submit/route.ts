/**
 * Quiz Submission API Route
 * 
 * POST /api/quiz/submit - Submit quiz answers
 */

import { NextRequest, NextResponse } from 'next/server';
import { getQuizBankById, calculateScore, validateQuizAnswers } from '@/lib/data/quizData';
import { ApiResponse, QuizResult } from '@/types';

interface QuizSubmissionRequest {
  quizId: string;
  answers: Record<string, number>;
  timeSpent?: number;
}

export async function POST(
  request: NextRequest
): Promise<NextResponse<ApiResponse<QuizResult>>> {
  try {
    const body: QuizSubmissionRequest = await request.json();
    const { quizId, answers, timeSpent } = body;
    
    if (!quizId || !answers) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required fields: quizId and answers',
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 400 }
      );
    }
    
    const quizBank = await getQuizBankById(quizId);
    
    if (!quizBank) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'NOT_FOUND',
            message: `Quiz with ID '${quizId}' not found`,
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 404 }
      );
    }
    
    const validation = validateQuizAnswers(quizBank, answers);
    if (!validation.valid) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ANSWERS',
            message: 'Invalid answer format',
            details: validation.errors,
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 400 }
      );
    }
    
    const result = calculateScore(quizBank.questions, answers);
    
    const resultWithMeta: QuizResult = {
      ...result,
      timeSpent,
      completedAt: new Date().toISOString(),
    };
    
    const response: ApiResponse<QuizResult> = {
      success: true,
      data: resultWithMeta,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/quiz/submit:', error);
    
    const errorResponse: ApiResponse<QuizResult> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to submit quiz',
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
