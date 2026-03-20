'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  Question,
  QuestionType,
  AssessmentConfig,
  DEFAULT_ASSESSMENT_CONFIG,
  UserAnswer,
  AssessmentResult,
} from '@/types/quiz';
import { validateAnswer, ValidationResult, isAnswerComplete } from '@/lib/quiz/quizValidator';
import { recordAttempt, getRecommendations, getWeakAreas, getStrongAreas } from '@/lib/quiz/quizAnalytics';
import { processReview, PerformanceRating } from '@/lib/quiz/spacedRepetition';
import { QuizBank } from '@/types/quiz';

// Question components
import {
  MultipleChoiceQuestion,
  MultiSelectQuestion,
  TrueFalseQuestion,
  MatchingQuestion,
  FillBlankQuestion,
  ScenarioQuestion,
  CalculationQuestion,
} from './questions';

interface QuizEngineProps {
  quizBank: QuizBank;
  config?: Partial<AssessmentConfig>;
  onComplete?: (result: AssessmentResult) => void;
  onAbandon?: () => void;
  reviewMode?: boolean;
}

type QuizPhase = 'intro' | 'quiz' | 'review' | 'results';

export default function QuizEngine({
  quizBank,
  config = {},
  onComplete,
  onAbandon,
  reviewMode = false,
}: QuizEngineProps) {
  // Merge config with defaults
  const assessmentConfig: AssessmentConfig = {
    ...DEFAULT_ASSESSMENT_CONFIG,
    ...config,
    reviewMode: reviewMode || config.reviewMode || false,
  };

  // State
  const [phase, setPhase] = useState<QuizPhase>(assessmentConfig.reviewMode ? 'quiz' : 'intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Map<string, unknown>>(new Map());
  const [userAnswers, setUserAnswers] = useState<Map<string, UserAnswer>>(new Map());
  const [flaggedQuestions, setFlaggedQuestions] = useState<Set<string>>(new Set());
  const [showResult, setShowResult] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(
    quizBank.timeLimitMinutes ? quizBank.timeLimitMinutes * 60 : null
  );
  const [questionOrder, setQuestionOrder] = useState<string[]>([]);
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  // Initialize question order
  useEffect(() => {
    let order = quizBank.questions.map(q => q.id);
    if (assessmentConfig.randomizeQuestions) {
      order = shuffleArray(order);
    }
    setQuestionOrder(order);
  }, [quizBank, assessmentConfig.randomizeQuestions]);

  // Get ordered questions
  const orderedQuestions = questionOrder
    .map(id => quizBank.questions.find(q => q.id === id))
    .filter((q): q is Question => q !== undefined);

  const currentQuestion = orderedQuestions[currentIndex];

  // Timer effect
  useEffect(() => {
    if (phase !== 'quiz' || !assessmentConfig.showTimer || timeRemaining === null) return;

    const interval = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev === null || prev <= 0) {
          clearInterval(interval);
          handleTimeUp();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [phase, assessmentConfig.showTimer, timeRemaining]);

  // Track start time when entering quiz phase
  useEffect(() => {
    if (phase === 'quiz' && !startTime) {
      setStartTime(new Date());
    }
  }, [phase, startTime]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleTimeUp = () => {
    // Auto-submit when time is up
    handleSubmit();
  };

  const handleStart = () => {
    setPhase('quiz');
    setStartTime(new Date());
  };

  const handleAnswer = useCallback((value: unknown) => {
    if (!currentQuestion || showResult) return;

    const existingAnswer = userAnswers.get(currentQuestion.id);
    const newUserAnswer: UserAnswer = {
      questionId: currentQuestion.id,
      answer: value as number | number[] | boolean | { [key: string]: string } | string | null,
      timeSpentSeconds: existingAnswer?.timeSpentSeconds || 0,
      hintsUsed: existingAnswer?.hintsUsed || [],
      attempts: (existingAnswer?.attempts || 0) + 1,
      isCorrect: false,
      pointsEarned: 0,
    };

    setAnswers(prev => new Map(prev).set(currentQuestion.id, value));
    setUserAnswers(prev => new Map(prev).set(currentQuestion.id, newUserAnswer));

    if (assessmentConfig.immediateFeedback) {
      const validation = validateAnswer(currentQuestion, value);
      setValidationResult(validation);
      
      // Update user answer with validation results
      const validatedUserAnswer: UserAnswer = {
        ...newUserAnswer,
        isCorrect: validation.isCorrect,
        pointsEarned: validation.pointsEarned,
      };
      setUserAnswers(prev => new Map(prev).set(currentQuestion.id, validatedUserAnswer));
      
      setShowResult(true);
    }
  }, [currentQuestion, showResult, userAnswers, assessmentConfig.immediateFeedback]);

  const handleHint = useCallback((level: number) => {
    if (!currentQuestion) return;

    const existingAnswer = userAnswers.get(currentQuestion.id);
    const hintsUsed = existingAnswer?.hintsUsed || [];
    
    if (!hintsUsed.includes(level)) {
      const newUserAnswer: UserAnswer = {
        questionId: currentQuestion.id,
        answer: existingAnswer?.answer || null,
        timeSpentSeconds: existingAnswer?.timeSpentSeconds || 0,
        hintsUsed: [...hintsUsed, level],
        attempts: existingAnswer?.attempts || 0,
        isCorrect: existingAnswer?.isCorrect || false,
        pointsEarned: existingAnswer?.pointsEarned || 0,
      };
      setUserAnswers(prev => new Map(prev).set(currentQuestion.id, newUserAnswer));
    }
  }, [currentQuestion, userAnswers]);

  const handleNext = () => {
    if (currentIndex < orderedQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowResult(false);
      setValidationResult(null);
    } else {
      handleSubmit();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0 && assessmentConfig.allowNavigation) {
      setCurrentIndex(prev => prev - 1);
      setShowResult(false);
      setValidationResult(null);
    }
  };

  const handleFlag = () => {
    if (!currentQuestion || !assessmentConfig.allowFlagging) return;

    setFlaggedQuestions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(currentQuestion.id)) {
        newSet.delete(currentQuestion.id);
      } else {
        newSet.add(currentQuestion.id);
      }
      return newSet;
    });
  };

  const handleJumpToQuestion = (index: number) => {
    if (assessmentConfig.allowNavigation) {
      setCurrentIndex(index);
      setShowResult(false);
      setValidationResult(null);
    }
  };

  const handleSubmit = () => {
    const endTime = new Date();
    const timeSpentMinutes = startTime
      ? (endTime.getTime() - startTime.getTime()) / 1000 / 60
      : 0;

    // Validate all answers
    const questionResults = orderedQuestions.map(question => {
      const answer = answers.get(question.id);
      const userAnswer = userAnswers.get(question.id);
      const validation = validateAnswer(question, answer);

      return {
        questionId: question.id,
        isCorrect: validation.isCorrect,
        correctAnswer: validation.correctAnswer,
        userAnswer: answer,
        explanation: validation.explanation,
        timeSpentSeconds: userAnswer?.timeSpentSeconds || 0,
        hintsUsed: userAnswer?.hintsUsed?.length || 0,
      };
    });

    // Calculate category breakdown
    const categoryBreakdown: { [key: string]: { total: number; correct: number; percentage: number } } = {};
    
    Object.entries(quizBank.categories).forEach(([category, data]) => {
      const categoryQuestions = data.questions
        .map(id => orderedQuestions.find(q => q.id === id))
        .filter((q): q is Question => q !== undefined);

      const total = categoryQuestions.length;
      const correct = categoryQuestions.filter(q => {
        const result = questionResults.find(r => r.questionId === q.id);
        return result?.isCorrect;
      }).length;

      categoryBreakdown[category] = {
        total,
        correct,
        percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
      };
    });

    // Calculate competency analysis
    const competencyAnalysis: AssessmentResult['competencyAnalysis'] = {};
    orderedQuestions.forEach(question => {
      const result = questionResults.find(r => r.questionId === question.id);
      const area = question.competencyArea;
      
      if (!competencyAnalysis[area]) {
        competencyAnalysis[area] = { total: 0, correct: 0, percentage: 0 };
      }
      
      competencyAnalysis[area]!.total++;
      if (result?.isCorrect) {
        competencyAnalysis[area]!.correct++;
      }
    });

    // Calculate percentages for competency areas
    Object.keys(competencyAnalysis).forEach(key => {
      const area = competencyAnalysis[key as keyof typeof competencyAnalysis];
      if (area) {
        area.percentage = Math.round((area.correct / area.total) * 100);
      }
    });

    // Calculate scores
    const totalPoints = orderedQuestions.reduce((sum, q) => sum + q.points, 0);
    const pointsEarned = questionResults.reduce((sum, r) => {
      const question = orderedQuestions.find(q => q.id === r.questionId);
      return sum + (r.isCorrect ? (question?.points || 0) : 0);
    }, 0);
    const score = Math.round((pointsEarned / totalPoints) * 100);
    const passed = score >= quizBank.passingScore;

    // Get weak and strong areas
    const weakAreas = getWeakAreas(quizBank.id, orderedQuestions);
    const strongAreas = getStrongAreas(quizBank.id, orderedQuestions);

    // Generate recommendations
    const recommendations = getRecommendations(quizBank.id, orderedQuestions);

    const result: AssessmentResult = {
      sessionId: `session-${Date.now()}`,
      quizBankId: quizBank.id,
      score,
      totalPoints,
      pointsEarned,
      passed,
      timeSpentMinutes: Math.round(timeSpentMinutes * 10) / 10,
      questionResults,
      categoryBreakdown,
      competencyAnalysis,
      recommendations,
      weakAreas,
      strongAreas,
      certificateEligible: passed,
      generatedAt: endTime.toISOString(),
    };

    // Record in analytics
    recordAttempt(quizBank.id, result);

    // Update spaced repetition for spaced repetition quizzes
    if (quizBank.assessmentType === 'spaced_repetition') {
      questionResults.forEach(qr => {
        const rating: PerformanceRating = qr.isCorrect ? 'good' : 'again';
        processReview(qr.questionId, quizBank.id, rating);
      });
    }

    setPhase('results');
    onComplete?.(result);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Render question based on type
  const renderQuestion = () => {
    if (!currentQuestion) return null;

    const userAnswer = userAnswers.get(currentQuestion.id);
    const hintsUsed = userAnswer?.hintsUsed || [];

    const commonProps = {
      showResult,
      onUseHint: assessmentConfig.allowHints ? handleHint : undefined,
      hintsUsed,
    };

    switch (currentQuestion.type) {
      case 'multiple_choice':
        return (
          <MultipleChoiceQuestion
            question={currentQuestion}
            selectedIndex={(answers.get(currentQuestion.id) as number) ?? null}
            onSelect={handleAnswer}
            {...commonProps}
          />
        );

      case 'multi_select':
        return (
          <MultiSelectQuestion
            question={currentQuestion}
            selectedIndices={(answers.get(currentQuestion.id) as number[]) || []}
            onSelect={handleAnswer}
            {...commonProps}
          />
        );

      case 'true_false':
        return (
          <TrueFalseQuestion
            question={currentQuestion}
            selectedAnswer={(answers.get(currentQuestion.id) as boolean) ?? null}
            onSelect={handleAnswer}
            {...commonProps}
          />
        );

      case 'matching':
        return (
          <MatchingQuestion
            question={currentQuestion}
            matches={(answers.get(currentQuestion.id) as Record<string, string>) || {}}
            onChange={handleAnswer}
            {...commonProps}
          />
        );

      case 'fill_blank':
        return (
          <FillBlankQuestion
            question={currentQuestion}
            answers={(answers.get(currentQuestion.id) as Record<string, string>) || {}}
            onChange={handleAnswer}
            {...commonProps}
          />
        );

      case 'scenario':
        return (
          <ScenarioQuestion
            question={currentQuestion}
            selectedBranch={(answers.get(currentQuestion.id) as string) ?? null}
            onSelect={handleAnswer}
            {...commonProps}
          />
        );

      case 'calculation':
        return (
          <CalculationQuestion
            question={currentQuestion}
            answer={(answers.get(currentQuestion.id) as number) ?? null}
            onChange={handleAnswer}
            {...commonProps}
          />
        );

      default:
        return <div>Unknown question type</div>;
    }
  };

  // Intro Phase
  if (phase === 'intro') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-muted to-card rounded-2xl p-8 border border-border">
          <h1 className="text-2xl font-bold text-foreground mb-4">{quizBank.title}</h1>
          <p className="text-muted-foreground mb-6">{quizBank.description}</p>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Questions</p>
              <p className="text-2xl font-bold text-foreground">{quizBank.totalQuestions}</p>
            </div>
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Passing Score</p>
              <p className="text-2xl font-bold text-foreground">{quizBank.passingScore}%</p>
            </div>
            {quizBank.timeLimitMinutes && (
              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm text-muted-foreground">Time Limit</p>
                <p className="text-2xl font-bold text-foreground">{quizBank.timeLimitMinutes} min</p>
              </div>
            )}
            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">Attempts Allowed</p>
              <p className="text-2xl font-bold text-foreground">{quizBank.retakePolicy.maxAttempts}</p>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handleStart}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
            >
              Start Assessment
            </button>
            {onAbandon && (
              <button
                onClick={onAbandon}
                className="w-full py-3 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Results Phase
  if (phase === 'results') {
    // Calculate result summary
    const answeredCount = orderedQuestions.filter(q => isAnswerComplete(answers.get(q.id))).length;
    const score = 0; // Will be calculated properly

    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-gradient-to-br from-muted to-card rounded-2xl p-8 border border-border text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Assessment Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You answered {answeredCount} of {orderedQuestions.length} questions.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
          >
            View Detailed Results
          </button>
        </div>
      </div>
    );
  }

  // Quiz Phase
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          {assessmentConfig.showProgress && (
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted-foreground">
                Question {currentIndex + 1} of {orderedQuestions.length}
              </span>
              <div className="w-32 bg-muted rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${((currentIndex + 1) / orderedQuestions.length) * 100}%` }}
                />
              </div>
            </div>
          )}
          {assessmentConfig.allowFlagging && (
            <button
              onClick={handleFlag}
              className={`text-sm px-3 py-1 rounded-full transition-colors ${
                currentQuestion && flaggedQuestions.has(currentQuestion.id)
                  ? 'bg-yellow-500/20 text-yellow-400'
                  : 'bg-muted text-muted-foreground hover:text-foreground'
              }`}
            >
              {currentQuestion && flaggedQuestions.has(currentQuestion.id) ? '⚑ Flagged' : '⚐ Flag'}
            </button>
          )}
        </div>
        {assessmentConfig.showTimer && timeRemaining !== null && (
          <div className={`text-sm font-mono ${timeRemaining < 60 ? 'text-red-400' : 'text-muted-foreground'}`}>
            ⏱ {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {/* Question Card */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        {renderQuestion()}
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevious}
          disabled={currentIndex === 0 || !assessmentConfig.allowNavigation}
          className="px-4 py-2 bg-muted hover:bg-muted/80 disabled:opacity-50 disabled:cursor-not-allowed text-foreground rounded-lg transition-colors"
        >
          ← Previous
        </button>

        {assessmentConfig.allowNavigation && (
          <div className="flex gap-1">
            {orderedQuestions.map((_, index) => {
              const question = orderedQuestions[index];
              const isAnswered = isAnswerComplete(answers.get(question.id));
              const isFlagged = flaggedQuestions.has(question.id);
              const isCurrent = index === currentIndex;

              return (
                <button
                  key={index}
                  onClick={() => handleJumpToQuestion(index)}
                  className={`w-8 h-8 rounded text-xs font-medium transition-colors ${
                    isCurrent
                      ? 'bg-red-500 text-white'
                      : isFlagged
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : isAnswered
                      ? 'bg-green-500/20 text-green-400'
                      : 'bg-muted text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
        )}

        <button
          onClick={handleNext}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          {currentIndex === orderedQuestions.length - 1 ? 'Finish' : 'Next →'}
        </button>
      </div>
    </div>
  );
}

// Re-export types
export type { QuizEngineProps };
