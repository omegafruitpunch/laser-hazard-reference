'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { KnowledgeNode, MasteryLevel, GapRecommendation } from '@/types/lms';
import type { Course } from '@/types';
import { getRecommendations } from '@/lib/data/knowledgeGraphClient';
import { courses } from '@/data/courses';

export type RecommendationType = 'next-course' | 'review' | 'gap-fill' | 'exploration' | 'trending';

export interface Recommendation extends GapRecommendation {
  nodes?: KnowledgeNode[];
}

interface UseRecommendationsOptions {
  maxRecommendations?: number;
  includeCompleted?: boolean;
}

interface UseRecommendationsReturn {
  recommendations: Recommendation[];
  isLoading: boolean;
  error: Error | null;
  highPriority: Recommendation[];
  mediumPriority: Recommendation[];
  lowPriority: Recommendation[];
  refresh: () => Promise<void>;
  dismissRecommendation: (id: string) => void;
}

/**
 * Hook for getting personalized learning recommendations
 * 
 * @param userId - The user ID to get recommendations for
 * @param options - Configuration options
 * @returns Personalized recommendations
 * 
 * @example
 * ```tsx
 * function RecommendationsPanel({ userId }: { userId: string }) {
 *   const { recommendations, highPriority, isLoading } = useRecommendations(userId);
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   
 *   return (
 *     <div>
 *       <h2>Recommended for You</h2>
 *       {highPriority.length > 0 && (
 *         <PrioritySection 
 *           title="High Priority"
 *           recommendations={highPriority}
 *         />
 *       )}
 *       <RecommendationList recommendations={recommendations} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useRecommendations(
  userId: string,
  options: UseRecommendationsOptions = {}
): UseRecommendationsReturn {
  const { maxRecommendations = 10, includeCompleted = false } = options;
  
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());

  const loadRecommendations = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getRecommendations(userId);
      setRecommendations(data.slice(0, maxRecommendations));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load recommendations'));
    } finally {
      setIsLoading(false);
    }
  }, [userId, maxRecommendations]);

  useEffect(() => {
    loadRecommendations();
  }, [loadRecommendations]);

  const filteredRecommendations = useMemo(() => {
    return recommendations.filter(r => !dismissedIds.has(r.id));
  }, [recommendations, dismissedIds]);

  const highPriority = useMemo(() => 
    filteredRecommendations.filter(r => r.priority === 'high'),
    [filteredRecommendations]
  );

  const mediumPriority = useMemo(() => 
    filteredRecommendations.filter(r => r.priority === 'medium'),
    [filteredRecommendations]
  );

  const lowPriority = useMemo(() => 
    filteredRecommendations.filter(r => r.priority === 'low'),
    [filteredRecommendations]
  );

  const dismissRecommendation = useCallback((id: string) => {
    setDismissedIds(prev => new Set([...prev, id]));
    // Persist dismissed recommendations to localStorage
    const dismissed = JSON.parse(localStorage.getItem('dismissed-recommendations') || '[]');
    dismissed.push({ id, dismissedAt: new Date().toISOString() });
    localStorage.setItem('dismissed-recommendations', JSON.stringify(dismissed));
  }, []);

  return {
    recommendations: filteredRecommendations,
    isLoading,
    error,
    highPriority,
    mediumPriority,
    lowPriority,
    refresh: loadRecommendations,
    dismissRecommendation,
  };
}
