/**
 * User Achievements API Route
 * 
 * GET /api/user/achievements - Get user's badges and achievements
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, Achievement } from '@/types';

const mockAchievements: Achievement[] = [
  {
    id: 'first-course',
    type: 'milestone',
    title: 'First Steps',
    description: 'Completed your first course',
    icon: '🎯',
    earnedAt: '2024-01-15T10:30:00Z',
  },
  {
    id: 'perfect-quiz',
    type: 'quiz_perfect',
    title: 'Perfect Score',
    description: 'Achieved 100% on a quiz',
    icon: '🏆',
    earnedAt: '2024-01-20T14:45:00Z',
    courseId: 'course-1',
  },
];

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<Achievement[]>>> {
  try {
    const response: ApiResponse<Achievement[]> = {
      success: true,
      data: mockAchievements,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/user/achievements:', error);
    
    const errorResponse: ApiResponse<Achievement[]> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user achievements',
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
