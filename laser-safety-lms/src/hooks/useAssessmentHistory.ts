'use client';

import { useState, useEffect, useCallback } from 'react';
import { QuizAttempt, Quiz } from '@/types/lms';
import { getAssessmentHistory, getQuizStats } from '@/lib/data/quizBankLoader';

interface AssessmentStats {
  totalAttempts: number;
  averageScore: number;
  passRate: number;
  bestScore: number;
  totalTimeSpent: number;
  recentTrend: 'improving' | 'declining' | 'stable';
}

interface UseAssessmentHistoryReturn {
  attempts: QuizAttempt[];
  stats: AssessmentStats | null;
  isLoading: boolean;
  error: Error | null;
  refresh: () => Promise<void>;
  getAttemptsByModule: (moduleId: string) => QuizAttempt[];
  getRecentAttempts: (limit?: number) => QuizAttempt[];
}

/**
 * Hook for retrieving and analyzing assessment history
 * 
 * @returns Assessment history and statistics
 * 
 * @example
 * ```tsx
 * function AssessmentDashboard() {
 *   const { attempts, stats, isLoading } = useAssessmentHistory();
 *   
 *   if (isLoading) return <LoadingSpinner />;
 *   
 *   return (
 *     <div>
 *       <StatsCard 
 *         averageScore={stats?.averageScore}
 *         passRate={stats?.passRate}
 *         totalAttempts={stats?.totalAttempts}
 *       />
 *       <AttemptHistoryList attempts={attempts} />
 *     </div>
 *   );
 * }
 * ```
 */
export function useAssessmentHistory(): UseAssessmentHistoryReturn {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([]);
  const [stats, setStats] = useState<AssessmentStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadHistory = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const [historyData, statsData] = await Promise.all([
        getAssessmentHistory(),
        getQuizStats(),
      ]);
      
      setAttempts(historyData);
      setStats(statsData);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load assessment history'));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadHistory();
  }, [loadHistory]);

  const getAttemptsByModule = useCallback((moduleId: string) => {
    return attempts.filter(attempt => attempt.quizId.startsWith(moduleId));
  }, [attempts]);

  const getRecentAttempts = useCallback((limit = 5) => {
    return [...attempts]
      .sort((a, b) => new Date(b.completedAt || b.startedAt).getTime() - new Date(a.completedAt || a.startedAt).getTime())
      .slice(0, limit);
  }, [attempts]);

  return {
    attempts,
    stats,
    isLoading,
    error,
    refresh: loadHistory,
    getAttemptsByModule,
    getRecentAttempts,
  };
}
