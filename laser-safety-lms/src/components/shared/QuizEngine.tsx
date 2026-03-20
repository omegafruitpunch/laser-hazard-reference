"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { HintSystem } from "./HintSystem";
import { CompletionBadge } from "./CompletionBadge";
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  Clock,
  AlertCircle,
  HelpCircle,
  Sparkles,
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type QuestionType = "single" | "multiple" | "truefalse" | "matching" | "ordering";

export interface QuizHint {
  level: 1 | 2 | 3;
  content: string;
}

export interface QuizOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation?: string;
}

export interface QuizQuestion {
  id: string;
  type: QuestionType;
  question: string;
  options: QuizOption[];
  explanation: string;
  hints?: QuizHint[];
  points?: number;
  timeLimit?: number;
  imageUrl?: string;
  category?: string;
  difficulty?: "easy" | "medium" | "hard";
}

export interface QuizConfig {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore?: number;
  maxAttempts?: number;
  shuffleQuestions?: boolean;
  showHints?: boolean;
  timeLimitMinutes?: number;
  allowRetry?: boolean;
  categoryWeights?: Record<string, number>;
}

export interface QuizEngineProps {
  config: QuizConfig;
  onComplete?: (result: QuizResult) => void;
  onExit?: () => void;
  className?: string;
}

export interface QuizResult {
  score: number;
  totalPoints: number;
  percentage: number;
  passed: boolean;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentSeconds: number;
  answers: Record<string, string[]>;
  categoryBreakdown: Record<string, { correct: number; total: number }>;
  hintsUsed: number;
  completedAt: Date;
}

// ============================================================================
// Main Component
// ============================================================================

export function QuizEngine({ config, onComplete, onExit, className }: QuizEngineProps) {
  const [phase, setPhase] = useState<"intro" | "quiz" | "review" | "results">("intro");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string[]>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime] = useState(Date.now());
  const [hintsUsed, setHintsUsed] = useState(0);
  const [attemptCount, setAttemptCount] = useState(1);

  const currentQuestion = config.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === config.questions.length - 1;

  const handleSelectAnswer = useCallback((optionId: string) => {
    if (showFeedback) return;

    setSelectedAnswers((prev) => {
      const current = prev[currentQuestion.id] || [];
      
      if (currentQuestion.type === "single" || currentQuestion.type === "truefalse") {
        return { ...prev, [currentQuestion.id]: [optionId] };
      }
      
      // Multiple choice toggle
      if (current.includes(optionId)) {
        return { ...prev, [currentQuestion.id]: current.filter((id) => id !== optionId) };
      }
      return { ...prev, [currentQuestion.id]: [...current, optionId] };
    });
  }, [currentQuestion, showFeedback]);

  const handleSubmitAnswer = useCallback(() => {
    setShowFeedback(true);
  }, []);

  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      setPhase("results");
      calculateAndSubmitResults();
    } else {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
    }
  }, [isLastQuestion]);

  const calculateAndSubmitResults = useCallback(() => {
    const timeSpentSeconds = Math.floor((Date.now() - startTime) / 1000);
    let totalPoints = 0;
    let earnedPoints = 0;
    let correctCount = 0;
    const categoryBreakdown: Record<string, { correct: number; total: number }> = {};

    config.questions.forEach((q) => {
      const points = q.points || 1;
      totalPoints += points;
      
      const selected = selectedAnswers[q.id] || [];
      const correct = q.options.filter((o) => o.isCorrect).map((o) => o.id);
      
      const isCorrect = 
        selected.length === correct.length && 
        selected.every((id) => correct.includes(id));

      if (isCorrect) {
        earnedPoints += points;
        correctCount++;
      }

      // Category tracking
      if (q.category) {
        if (!categoryBreakdown[q.category]) {
          categoryBreakdown[q.category] = { correct: 0, total: 0 };
        }
        categoryBreakdown[q.category].total++;
        if (isCorrect) {
          categoryBreakdown[q.category].correct++;
        }
      }
    });

    const percentage = Math.round((earnedPoints / totalPoints) * 100);
    const passingScore = config.passingScore || 70;
    const passed = percentage >= passingScore;

    const result: QuizResult = {
      score: earnedPoints,
      totalPoints,
      percentage,
      passed,
      correctAnswers: correctCount,
      totalQuestions: config.questions.length,
      timeSpentSeconds,
      answers: selectedAnswers,
      categoryBreakdown,
      hintsUsed,
      completedAt: new Date(),
    };

    onComplete?.(result);
  }, [config.questions, config.passingScore, selectedAnswers, startTime, hintsUsed, onComplete]);

  const handleRetry = useCallback(() => {
    setPhase("quiz");
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setHintsUsed(0);
    setAttemptCount((prev) => prev + 1);
  }, []);

  const handleHintRevealed = useCallback(() => {
    setHintsUsed((prev) => prev + 1);
  }, []);

  // Render phases
  if (phase === "intro") {
    return (
      <QuizIntro
        config={config}
        onStart={() => setPhase("quiz")}
        onExit={onExit}
        className={className}
      />
    );
  }

  if (phase === "results") {
    return (
      <QuizResults
        config={config}
        answers={selectedAnswers}
        hintsUsed={hintsUsed}
        attemptCount={attemptCount}
        onRetry={config.allowRetry !== false ? handleRetry : undefined}
        onExit={onExit}
        className={className}
      />
    );
  }

  // Quiz Phase
  return (
    <div className={cn("max-w-3xl mx-auto space-y-6", className)}>
      {/* Progress Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Badge variant="outline">
            Question {currentQuestionIndex + 1} of {config.questions.length}
          </Badge>
          {currentQuestion.category && (
            <Badge variant="secondary">{currentQuestion.category}</Badge>
          )}
        </div>
        <Progress value={((currentQuestionIndex + 1) / config.questions.length) * 100} className="w-32">
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
      </div>

      {/* Question Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-lg leading-relaxed">
              {currentQuestion.question}
            </CardTitle>
            {currentQuestion.difficulty && (
              <DifficultyBadge difficulty={currentQuestion.difficulty} />
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Options */}
          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <OptionButton
                key={option.id}
                option={option}
                isSelected={selectedAnswers[currentQuestion.id]?.includes(option.id)}
                showFeedback={showFeedback}
                onClick={() => handleSelectAnswer(option.id)}
              />
            ))}
          </div>

          {/* Feedback */}
          {showFeedback && (
            <FeedbackSection
              question={currentQuestion}
              selectedAnswers={selectedAnswers[currentQuestion.id] || []}
            />
          )}

          {/* Hints */}
          {!showFeedback && config.showHints && currentQuestion.hints && (
            <HintSystem
              hints={currentQuestion.hints}
              onHintRevealed={handleHintRevealed}
              allowSkipToSolution={false}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="ghost" onClick={onExit}>
            Exit Quiz
          </Button>
          
          {!showFeedback ? (
            <Button
              onClick={handleSubmitAnswer}
              disabled={!selectedAnswers[currentQuestion.id]?.length}
            >
              Submit Answer
            </Button>
          ) : (
            <Button onClick={handleNext}>
              {isLastQuestion ? "See Results" : "Next Question"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

function QuizIntro({
  config,
  onStart,
  onExit,
  className,
}: {
  config: QuizConfig;
  onStart: () => void;
  onExit?: () => void;
  className?: string;
}) {
  return (
    <Card className={cn("max-w-2xl mx-auto", className)}>
      <CardHeader className="text-center">
        <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
          <Trophy className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl">{config.title}</CardTitle>
        {config.description && (
          <p className="text-muted-foreground">{config.description}</p>
        )}
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-3 gap-4">
          <InfoItem icon={<HelpCircle className="w-5 h-5" />} label="Questions" value={config.questions.length} />
          <InfoItem 
            icon={<Clock className="w-5 h-5" />} 
            label="Time Limit" 
            value={config.timeLimitMinutes ? `${config.timeLimitMinutes} min` : "Unlimited"} 
          />
          <InfoItem 
            icon={<Trophy className="w-5 h-5" />} 
            label="Passing Score" 
            value={`${config.passingScore || 70}%`} 
          />
        </div>

        {config.maxAttempts && (
          <div className="flex items-center gap-2 p-4 bg-amber-500/10 rounded-lg text-amber-400">
            <AlertCircle className="w-5 h-5" />
            <span className="text-sm">Limited to {config.maxAttempts} attempts</span>
          </div>
        )}
      </CardContent>

      <CardFooter className="flex gap-3 justify-center">
        {onExit && (
          <Button variant="outline" onClick={onExit}>
            Back
          </Button>
        )}
        <Button onClick={onStart} size="lg">
          Start Quiz
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardFooter>
    </Card>
  );
}

function QuizResults({
  config,
  answers,
  hintsUsed,
  attemptCount,
  onRetry,
  onExit,
  className,
}: {
  config: QuizConfig;
  answers: Record<string, string[]>;
  hintsUsed: number;
  attemptCount: number;
  onRetry?: () => void;
  onExit?: () => void;
  className?: string;
}) {
  // Calculate results
  let totalPoints = 0;
  let earnedPoints = 0;
  let correctCount = 0;

  config.questions.forEach((q) => {
    const points = q.points || 1;
    totalPoints += points;
    
    const selected = answers[q.id] || [];
    const correct = q.options.filter((o) => o.isCorrect).map((o) => o.id);
    
    const isCorrect = 
      selected.length === correct.length && 
      selected.every((id) => correct.includes(id));

    if (isCorrect) {
      earnedPoints += points;
      correctCount++;
    }
  });

  const percentage = Math.round((earnedPoints / totalPoints) * 100);
  const passingScore = config.passingScore || 70;
  const passed = percentage >= passingScore;

  return (
    <Card className={cn("max-w-2xl mx-auto", className)}>
      <CardHeader className="text-center">
        <div className={cn(
          "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
          passed ? "bg-green-500/20" : "bg-red-500/20"
        )}>
          {passed ? (
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          ) : (
            <XCircle className="w-10 h-10 text-red-400" />
          )}
        </div>
        <CardTitle className="text-2xl">
          {passed ? "Congratulations!" : "Keep Practicing"}
        </CardTitle>
        <p className="text-muted-foreground">
          {passed 
            ? "You passed the quiz!" 
            : `You need ${passingScore}% to pass. Try again!`}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Score Display */}
        <div className="text-center">
          <div className={cn(
            "text-5xl font-bold",
            passed ? "text-green-400" : "text-red-400"
          )}>
            {percentage}%
          </div>
          <p className="text-muted-foreground mt-2">
            {correctCount} correct out of {config.questions.length} questions
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-4">
          <InfoItem icon={<CheckCircle2 className="w-5 h-5" />} label="Correct" value={correctCount} />
          <InfoItem icon={<XCircle className="w-5 h-5" />} label="Incorrect" value={config.questions.length - correctCount} />
          <InfoItem icon={<Sparkles className="w-5 h-5" />} label="Hints Used" value={hintsUsed} />
        </div>

        {/* Attempt Info */}
        <p className="text-center text-sm text-muted-foreground">
          Attempt {attemptCount} {config.maxAttempts ? `of ${config.maxAttempts}` : ""}
        </p>
      </CardContent>

      <CardFooter className="flex gap-3 justify-center">
        {onExit && (
          <Button variant="outline" onClick={onExit}>
            Exit
          </Button>
        )}
        {onRetry && (!config.maxAttempts || attemptCount < config.maxAttempts) && (
          <Button onClick={onRetry} variant={passed ? "outline" : "default"}>
            <RotateCcw className="w-4 h-4 mr-2" />
            {passed ? "Retake Quiz" : "Try Again"}
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

function OptionButton({
  option,
  isSelected,
  showFeedback,
  onClick,
}: {
  option: QuizOption;
  isSelected: boolean;
  showFeedback: boolean;
  onClick: () => void;
}) {
  let statusClass = "";
  
  if (showFeedback) {
    if (option.isCorrect) {
      statusClass = "border-green-500 bg-green-500/10";
    } else if (isSelected && !option.isCorrect) {
      statusClass = "border-red-500 bg-red-500/10";
    } else {
      statusClass = "opacity-50";
    }
  } else if (isSelected) {
    statusClass = "border-primary bg-primary/10";
  }

  return (
    <button
      onClick={onClick}
      disabled={showFeedback}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all",
        "hover:border-primary/50 hover:bg-muted/50",
        statusClass,
        showFeedback && "cursor-default"
      )}
    >
      <div className="flex items-center gap-3">
        <div className={cn(
          "w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0",
          isSelected ? "border-primary bg-primary" : "border-muted-foreground",
          showFeedback && option.isCorrect && "border-green-500 bg-green-500",
          showFeedback && isSelected && !option.isCorrect && "border-red-500 bg-red-500"
        )}>
          {isSelected && <CheckCircle2 className="w-3 h-3 text-white" />}
        </div>
        <span className="flex-grow">{option.text}</span>
        {showFeedback && option.isCorrect && (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        )}
        {showFeedback && isSelected && !option.isCorrect && (
          <XCircle className="w-5 h-5 text-red-400" />
        )}
      </div>
    </button>
  );
}

function FeedbackSection({
  question,
  selectedAnswers,
}: {
  question: QuizQuestion;
  selectedAnswers: string[];
}) {
  const correctOptions = question.options.filter((o) => o.isCorrect);
  const isCorrect = 
    selectedAnswers.length === correctOptions.length &&
    selectedAnswers.every((id) => correctOptions.some((o) => o.id === id));

  return (
    <div className={cn(
      "p-4 rounded-lg border",
      isCorrect ? "bg-green-500/10 border-green-500/30" : "bg-amber-500/10 border-amber-500/30"
    )}>
      <div className="flex items-center gap-2 mb-2">
        {isCorrect ? (
          <CheckCircle2 className="w-5 h-5 text-green-400" />
        ) : (
          <AlertCircle className="w-5 h-5 text-amber-400" />
        )}
        <span className={cn("font-medium", isCorrect ? "text-green-400" : "text-amber-400")}>
          {isCorrect ? "Correct!" : "Not quite right"}
        </span>
      </div>
      <p className="text-sm text-muted-foreground">{question.explanation}</p>
    </div>
  );
}

function InfoItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="text-center p-3 rounded-lg bg-muted/50">
      <div className="flex justify-center text-muted-foreground mb-1">{icon}</div>
      <div className="text-lg font-bold">{value}</div>
      <div className="text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function DifficultyBadge({ difficulty }: { difficulty: QuizQuestion["difficulty"] }) {
  const colors = {
    easy: "bg-green-500/10 text-green-400",
    medium: "bg-amber-500/10 text-amber-400",
    hard: "bg-red-500/10 text-red-400",
  };

  return (
    <Badge className={colors[difficulty || "medium"]}>
      {difficulty?.charAt(0).toUpperCase()}{difficulty?.slice(1)}
    </Badge>
  );
}

export default QuizEngine;
