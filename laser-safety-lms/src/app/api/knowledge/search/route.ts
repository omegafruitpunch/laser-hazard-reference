/**
 * Knowledge Search API Route
 * 
 * GET /api/knowledge/search?q=query - Search concepts in knowledge graph
 */

import { NextRequest, NextResponse } from 'next/server';
import { searchEntities, semanticSearch } from '@/lib/data/knowledgeGraphData';
import { ApiResponse, KnowledgeEntity } from '@/types';

interface SearchResults {
  entities: KnowledgeEntity[];
  semanticResults: Array<{
    term: string;
    entities: string[];
    courses: string[];
  }>;
}

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResponse<SearchResults>>> {
  try {
    const { searchParams } = new URL(request.url);
    
    const query = searchParams.get('q');
    const type = searchParams.get('type') || undefined;
    const limit = Math.min(parseInt(searchParams.get('limit') || '10', 10), 50);
    
    if (!query) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_REQUEST',
            message: 'Missing required query parameter: q',
          },
          meta: {
            timestamp: new Date().toISOString(),
            requestId: crypto.randomUUID(),
          },
        },
        { status: 400 }
      );
    }
    
    const [entities, semanticResults] = await Promise.all([
      searchEntities(query, type),
      semanticSearch(query, limit),
    ]);
    
    const response: ApiResponse<SearchResults> = {
      success: true,
      data: {
        entities: entities.slice(0, limit),
        semanticResults,
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: crypto.randomUUID(),
      },
    };
    
    return NextResponse.json(response);
  } catch (error) {
    console.error('Error in GET /api/knowledge/search:', error);
    
    const errorResponse: ApiResponse<SearchResults> = {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Failed to search knowledge graph',
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
