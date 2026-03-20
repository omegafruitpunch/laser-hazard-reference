/**
 * User Progress API Routes
 * 
 * GET /api/user/progress - Get user's learning progress
 * POST /api/user/progress - Update user progress
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, UserProgress } from '@/types';

const mockUserProgress: UserProgress = {
  userId: 'user-1',
  courses: {},
  modules: {},
  totalTimeSpent: 0,
  streakDays: 0,
  lastActivityAt: new Date().toISOString(),
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<UserProgress>>> {
  try {
    const response: ApiResponse<UserProgress> = {
      success: true,
      data: mockUserProgress,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/user/progress:', error);
    
    const errorResponse: ApiResponse<UserProgress> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user progress',
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
  request: NextRequest
): Promise<NextResponse<ApiResponse<UserProgress>>> {
  try {
    const body = await request.json();
    
    const response: ApiResponse<UserProgress> = {
      success: true,
      data: {
        ...mockUserProgress,
        ...body,
        lastActivityAt: new Date().toISOString(),
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/user/progress:', error);
    
    const errorResponse: ApiResponse<UserProgress> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update user progress',
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
