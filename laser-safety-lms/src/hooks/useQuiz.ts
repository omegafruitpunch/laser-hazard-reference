'use client';

import { useState, useCallback, useEffect } from 'react';
import { Quiz, QuizAttempt, AnswerRecord, QuizQuestion } from '@/types/lms';
import { getQuizByModuleId, saveQuizAttempt } from '@/lib/data/quizBankLoader';

interface UseQuizOptions {
  autoAdvance?: boolean;
  showImmediateFeedback?: boolean;
}

interface UseQuizReturn {
  quiz: Quiz | null;
  currentQuestion: QuizQuestion | null;
  currentIndex: number;
  totalQuestions: number;
  answers: (number | null)[];
  isComplete: boolean;
  isLoading: boolean;
  error: Error | null;
  score: number;
  passed: boolean;
  showResult: boolean;
  timeSpent: number;
  selectAnswer: (optionIndex: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
  canGoNext: boolean;
  canGoPrevious: boolean;
}

/**
 * Hook for managing quiz state and interactions
 * 
 * @param moduleId - The ID of the module containing the quiz
 * @param options - Configuration options for quiz behavior
 * @returns Quiz state and control functions
 * 
 * @example
 * ```tsx
 * function QuizContainer({ moduleId }: { moduleId: string }) {
 *   const {
 *     currentQuestion,
 *     currentIndex,
 *     totalQuestions,
 *     selectAnswer,
 *     goToNext,
 *     answers,
 *     showResult,
 *     isComplete
 *   } = useQuiz(moduleId);
 *   
 *   if (isComplete) return <QuizResults score={score} passed={passed} />;
 *   
 *   return (
 *     <div>
 *       <QuestionCard 
 *         question={currentQuestion}
 *         selectedAnswer={answers[currentIndex]}
 *         onSelect={selectAnswer}
 *         showResult={showResult}
 *       />
 *       <button onClick={goToNext} disabled={answers[currentIndex] === null}>
 *         Next
 *       </button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useQuiz(moduleId: string, options: UseQuizOptions = {}): UseQuizReturn {
  const { autoAdvance = false, showImmediateFeedback = true } = options;
  
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());

  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getQuizByModuleId(moduleId);
        setQuiz(data);
        setAnswers(new Array(data?.questions.length || 0).fill(null));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load quiz'));
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [moduleId]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime]);

  const currentQuestion = quiz?.questions[currentIndex] || null;
  const totalQuestions = quiz?.questions.length || 0;

  const selectAnswer = useCallback((optionIndex: number) => {
    if (showResult) return;
    
    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentIndex] = optionIndex;
      return newAnswers;
    });
    
    if (showImmediateFeedback) {
      setShowResult(true);
    }
  }, [currentIndex, showResult, showImmediateFeedback]);

  const goToNext = useCallback(() => {
    if (currentIndex < totalQuestions - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
    }
  }, [currentIndex, totalQuestions]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowResult(false);
    }
  }, [currentIndex]);

  const submitQuiz = useCallback(async () => {
    if (!quiz) return;

    const correctAnswers = answers.reduce((acc: number, answer, i) => {
      return answer === quiz.questions[i].correctIndex ? acc + 1 : acc;
    }, 0);

    const calculatedScore = Math.round((correctAnswers / totalQuestions) * 100);
    const hasPassed = calculatedScore >= (quiz.settings.passingScore || 70);

    setScore(calculatedScore);
    setPassed(hasPassed);
    setIsComplete(true);

    // Save attempt
    const attempt: Partial<QuizAttempt> = {
      quizId: quiz.id,
      answers: answers.map((answer, i) => ({
        questionId: quiz.questions[i].id,
        answer: answer ?? -1,
        correct: answer === quiz.questions[i].correctIndex,
        timeSpent: 0,
      })),
      score: calculatedScore,
      passed: hasPassed,
      timeSpent,
    };

    try {
      await saveQuizAttempt(attempt as QuizAttempt);
    } catch (err) {
      console.error('Failed to save quiz attempt:', err);
    }
  }, [quiz, answers, totalQuestions, timeSpent]);

  const resetQuiz = useCallback(() => {
    setCurrentIndex(0);
    setAnswers(new Array(totalQuestions).fill(null));
    setShowResult(false);
    setIsComplete(false);
    setScore(0);
    setPassed(false);
    setTimeSpent(0);
  }, [totalQuestions]);

  return {
    quiz,
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    isComplete,
    isLoading,
    error,
    score,
    passed,
    showResult,
    timeSpent,
    selectAnswer,
    goToNext,
    goToPrevious,
    submitQuiz,
    resetQuiz,
    canGoNext: currentIndex < totalQuestions - 1,
    canGoPrevious: currentIndex > 0,
  };
}
