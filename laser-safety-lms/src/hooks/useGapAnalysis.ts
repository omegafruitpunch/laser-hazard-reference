'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { GapAnalysis, KnowledgeGap, GapRecommendation, MasteryLevel } from '@/types/lms';
import { performGapAnalysis } from '@/lib/data/knowledgeGraphClient';

interface GapSummary {
  totalGaps: number;
  highPriorityGaps: number;
  mediumPriorityGaps: number;
  lowPriorityGaps: number;
  estimatedTimeToClose: number;
  readinessScore: number; // 0-100
}

interface UseGapAnalysisReturn {
  analysis: GapAnalysis | null;
  summary: GapSummary | null;
  isLoading: boolean;
  error: Error | null;
  gapsByPriority: {
    high: KnowledgeGap[];
    medium: KnowledgeGap[];
    low: KnowledgeGap[];
  };
  topRecommendations: GapRecommendation[];
  refresh: () => Promise<void>;
}

/**
 * Hook for analyzing knowledge gaps against certification requirements
 * 
 * @param targetCertification - The certification to analyze gaps for
 * @returns Gap analysis results and recommendations
 * 
 * @example
 * ```tsx
 * function GapAnalysisView({ targetCertification }: { targetCertification: string }) {
 *   const { 
 *     analysis, 
 *     summary, 
 *     gapsByPriority, 
 *     topRecommendations,
 *     isLoading 
 *   } = useGapAnalysis(targetCertification);
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   
 *   return (
 *     <div>
 *       <ReadinessScore score={summary?.readinessScore} />
 *       <GapList gaps={gapsByPriority.high} title="High Priority Gaps" />
 *       <RecommendationList recommendations={topRecommendations} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useGapAnalysis(targetCertification: string): UseGapAnalysisReturn {
  const [analysis, setAnalysis] = useState<GapAnalysis | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadAnalysis = useCallback(async () => {
    if (!targetCertification) {
      setAnalysis(null);
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const data = await performGapAnalysis(targetCertification);
      setAnalysis(data);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to perform gap analysis'));
    } finally {
      setIsLoading(false);
    }
  }, [targetCertification]);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  const summary = useMemo((): GapSummary | null => {
    if (!analysis) return null;

    const gaps = analysis.gaps;
    const highPriorityGaps = gaps.filter(g => g.priority === 'high').length;
    const mediumPriorityGaps = gaps.filter(g => g.priority === 'medium').length;
    const lowPriorityGaps = gaps.filter(g => g.priority === 'low').length;

    // Calculate estimated time to close all gaps
    const estimatedTimeToClose = analysis.recommendations.reduce(
      (acc, rec) => acc + rec.estimatedTime,
      0
    );

    // Calculate readiness score based on mastery levels
    const masteryScores: Record<MasteryLevel, number> = {
      'unknown': 0,
      'exposure': 25,
      'familiar': 50,
      'proficient': 75,
      'expert': 100,
    };

    const totalKnowledge = analysis.currentKnowledge.length;
    const currentScore = totalKnowledge > 0
      ? analysis.currentKnowledge.reduce((acc, k) => acc + (masteryScores[k.masteryLevel] || 0), 0) / totalKnowledge
      : 0;

    const requiredKnowledgeCount = analysis.requiredKnowledge.length;
    const readinessScore = requiredKnowledgeCount > 0
      ? Math.round((currentScore / 100) * 100)
      : 0;

    return {
      totalGaps: gaps.length,
      highPriorityGaps,
      mediumPriorityGaps,
      lowPriorityGaps,
      estimatedTimeToClose,
      readinessScore,
    };
  }, [analysis]);

  const gapsByPriority = useMemo(() => {
    if (!analysis) return { high: [], medium: [], low: [] };

    return {
      high: analysis.gaps.filter(g => g.priority === 'high'),
      medium: analysis.gaps.filter(g => g.priority === 'medium'),
      low: analysis.gaps.filter(g => g.priority === 'low'),
    };
  }, [analysis]);

  const topRecommendations = useMemo(() => {
    if (!analysis) return [];

    // Sort by priority and return top recommendations
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return [...analysis.recommendations]
      .sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
      .slice(0, 5);
  }, [analysis]);

  return {
    analysis,
    summary,
    isLoading,
    error,
    gapsByPriority,
    topRecommendations,
    refresh: loadAnalysis,
  };
}
