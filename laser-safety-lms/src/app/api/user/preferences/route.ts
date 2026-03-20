/**
 * User Preferences API Routes
 * 
 * GET /api/user/preferences - Get user preferences
 * POST /api/user/preferences - Update user preferences
 */

import { NextRequest, NextResponse } from 'next/server';
import { ApiResponse, UserPreferences } from '@/types';

const defaultPreferences: UserPreferences = {
  emailNotifications: true,
  darkMode: false,
  language: 'en',
  accessibilityMode: false,
  autoPlayVideos: false,
};

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<UserPreferences>>> {
  try {
    const response: ApiResponse<UserPreferences> = {
      success: true,
      data: defaultPreferences,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/user/preferences:', error);
    
    const errorResponse: ApiResponse<UserPreferences> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to fetch user preferences',
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
): Promise<NextResponse<ApiResponse<UserPreferences>>> {
  try {
    const body: Partial<UserPreferences> = await request.json();
    
    const updatedPreferences: UserPreferences = {
      ...defaultPreferences,
      ...body,
    };
    
    const response: ApiResponse<UserPreferences> = {
      success: true,
      data: updatedPreferences,
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in POST /api/user/preferences:', error);
    
    const errorResponse: ApiResponse<UserPreferences> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to update user preferences',
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
