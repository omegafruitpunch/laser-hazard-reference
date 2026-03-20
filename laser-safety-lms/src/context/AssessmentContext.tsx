'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Quiz, QuizAttempt, QuizQuestion, QuizSettings, AnswerRecord } from '@/types/lms';
import { getQuizByModuleId, saveQuizAttempt } from '@/lib/data/quizBankLoader';

type AssessmentPhase = 'intro' | 'quiz' | 'review' | 'results';

interface AssessmentContextState {
  // Quiz state
  quiz: Quiz | null;
  phase: AssessmentPhase;
  
  // Navigation
  currentQuestionIndex: number;
  totalQuestions: number;
  currentQuestion: QuizQuestion | null;
  
  // Answers
  answers: (number | null)[];
  answerRecords: AnswerRecord[];
  selectedAnswer: number | null;
  
  // Results
  score: number;
  passed: boolean;
  timeSpent: number;
  attempt: QuizAttempt | null;
  
  // Loading
  isLoading: boolean;
  error: Error | null;
  
  // Actions
  startQuiz: () => void;
  selectAnswer: (answerIndex: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  goToQuestion: (index: number) => void;
  submitQuiz: () => Promise<void>;
  resetQuiz: () => void;
  exitQuiz: () => void;
  
  // Review mode
  showCorrectAnswers: boolean;
  toggleShowCorrectAnswers: () => void;
  
  // Flagging
  flaggedQuestions: number[];
  toggleFlagQuestion: (index: number) => void;
}

const AssessmentContext = createContext<AssessmentContextState | undefined>(undefined);

interface AssessmentProviderProps {
  children: ReactNode;
  moduleId: string;
  settings?: Partial<QuizSettings>;
}

/**
 * Assessment Context Provider
 * 
 * Manages quiz/assessment state including navigation between questions,
 * answer tracking, and result calculation.
 * 
 * @example
 * ```tsx
 * function QuizPage({ moduleId }: { moduleId: string }) {
 *   return (
 *     <AssessmentProvider moduleId={moduleId}>
 *       <QuizContainer />
 *     </AssessmentProvider>
 *   );
 * }
 * 
 * function QuizContainer() {
 *   const { 
 *     phase, 
 *     currentQuestion, 
 *     selectAnswer, 
 *     submitQuiz 
 *   } = useAssessment();
 *   
 *   if (phase === 'intro') return <QuizIntro onStart={startQuiz} />;
 *   if (phase === 'results') return <QuizResults />;
 *   
 *   return (
 *     <div>
 *       <QuestionCard question={currentQuestion} />
 *       <AnswerOptions onSelect={selectAnswer} />
 *       <SubmitButton onClick={submitQuiz} />
 *     </div>
 *   );
 * }
 * ```
 */
export function AssessmentProvider({ 
  children, 
  moduleId, 
  settings: customSettings 
}: AssessmentProviderProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [phase, setPhase] = useState<AssessmentPhase>('intro');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>([]);
  const [answerRecords, setAnswerRecords] = useState<AnswerRecord[]>([]);
  const [score, setScore] = useState(0);
  const [passed, setPassed] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);
  const [flaggedQuestions, setFlaggedQuestions] = useState<number[]>([]);
  const [startTime, setStartTime] = useState<number>(0);

  // Load quiz data
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getQuizByModuleId(moduleId);
        
        // Apply custom settings if provided
        if (customSettings && data) {
          data.settings = { ...data.settings, ...customSettings };
        }
        
        setQuiz(data);
        setAnswers(new Array(data?.questions.length || 0).fill(null));
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load quiz'));
      } finally {
        setIsLoading(false);
      }
    };

    loadQuiz();
  }, [moduleId, customSettings]);

  // Timer
  useEffect(() => {
    if (phase !== 'quiz' || startTime === 0) return;

    const interval = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, startTime]);

  const currentQuestion = quiz?.questions[currentQuestionIndex] || null;
  const totalQuestions = quiz?.questions.length || 0;
  const selectedAnswer = answers[currentQuestionIndex];

  const startQuiz = useCallback(() => {
    setPhase('quiz');
    setStartTime(Date.now());
    setCurrentQuestionIndex(0);
    setAnswers(new Array(totalQuestions).fill(null));
    setAnswerRecords([]);
    setScore(0);
    setTimeSpent(0);
    setFlaggedQuestions([]);
  }, [totalQuestions]);

  const selectAnswer = useCallback((answerIndex: number) => {
    if (phase !== 'quiz') return;

    setAnswers(prev => {
      const newAnswers = [...prev];
      newAnswers[currentQuestionIndex] = answerIndex;
      return newAnswers;
    });

    // Record answer
    if (currentQuestion) {
      const isCorrect = answerIndex === currentQuestion.correctIndex;
      const record: AnswerRecord = {
        questionId: currentQuestion.id,
        answer: answerIndex,
        correct: isCorrect,
        timeSpent: 0, // Could track per-question time
      };

      setAnswerRecords(prev => {
        const filtered = prev.filter(r => r.questionId !== currentQuestion.id);
        return [...filtered, record];
      });
    }
  }, [phase, currentQuestionIndex, currentQuestion]);

  const goToNext = useCallback(() => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }, [currentQuestionIndex, totalQuestions]);

  const goToPrevious = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < totalQuestions) {
      setCurrentQuestionIndex(index);
    }
  }, [totalQuestions]);

  const submitQuiz = useCallback(async () => {
    if (!quiz) return;

    const correctCount = answers.reduce((acc: number, answer, i) => {
      return answer === quiz.questions[i].correctIndex ? acc + 1 : acc;
    }, 0);

    const calculatedScore = Math.round((correctCount / totalQuestions) * 100);
    const hasPassed = calculatedScore >= (quiz.settings.passingScore || 70);

    setScore(calculatedScore);
    setPassed(hasPassed);
    setPhase('results');

    // Create attempt record
    const newAttempt: QuizAttempt = {
      id: `attempt-${Date.now()}`,
      quizId: quiz.id,
      userId: 'anonymous',
      startedAt: new Date(startTime).toISOString(),
      completedAt: new Date().toISOString(),
      answers: answerRecords,
      score: calculatedScore,
      passed: hasPassed,
      timeSpent,
    };

    setAttempt(newAttempt);

    try {
      await saveQuizAttempt(newAttempt);
    } catch (err) {
      console.error('Failed to save quiz attempt:', err);
    }
  }, [quiz, answers, totalQuestions, answerRecords, timeSpent, startTime]);

  const resetQuiz = useCallback(() => {
    setPhase('intro');
    setCurrentQuestionIndex(0);
    setAnswers(new Array(totalQuestions).fill(null));
    setAnswerRecords([]);
    setScore(0);
    setPassed(false);
    setTimeSpent(0);
    setAttempt(null);
    setShowCorrectAnswers(false);
    setFlaggedQuestions([]);
    setStartTime(0);
  }, [totalQuestions]);

  const exitQuiz = useCallback(() => {
    resetQuiz();
  }, [resetQuiz]);

  const toggleShowCorrectAnswers = useCallback(() => {
    setShowCorrectAnswers(prev => !prev);
  }, []);

  const toggleFlagQuestion = useCallback((index: number) => {
    setFlaggedQuestions(prev => {
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  }, []);

  const value: AssessmentContextState = {
    quiz,
    phase,
    currentQuestionIndex,
    totalQuestions,
    currentQuestion,
    answers,
    answerRecords,
    selectedAnswer,
    score,
    passed,
    timeSpent,
    attempt,
    isLoading,
    error,
    startQuiz,
    selectAnswer,
    goToNext,
    goToPrevious,
    goToQuestion,
    submitQuiz,
    resetQuiz,
    exitQuiz,
    showCorrectAnswers,
    toggleShowCorrectAnswers,
    flaggedQuestions,
    toggleFlagQuestion,
  };

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
}

/**
 * Hook to access the AssessmentContext
 * 
 * @throws Error if used outside of AssessmentProvider
 */
export function useAssessment(): AssessmentContextState {
  const context = useContext(AssessmentContext);
  if (context === undefined) {
    throw new Error('useAssessment must be used within an AssessmentProvider');
  }
  return context;
}
