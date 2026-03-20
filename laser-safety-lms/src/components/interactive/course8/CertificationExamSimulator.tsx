"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GraduationCap, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Trophy,
  BookOpen,
  Timer
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ExamType = "CLSO" | "CMLSO";
export type QuestionDifficulty = "easy" | "medium" | "hard";

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  category: string;
  difficulty: QuestionDifficulty;
  reference: string;
}

export interface ExamConfig {
  type: ExamType;
  name: string;
  description: string;
  durationMinutes: number;
  questionCount: number;
  passingScore: number;
  categories: string[];
}

export interface ExamResult {
  examType: ExamType;
  score: number;
  correctAnswers: number;
  totalQuestions: number;
  timeSpentMinutes: number;
  passed: boolean;
  categoryBreakdown: Record<string, { correct: number; total: number; percentage: number }>;
  answers: { questionId: string; selected: number; correct: boolean }[];
  completedAt: Date;
}

export interface CertificationExamSimulatorProps {
  examConfigs?: ExamConfig[];
  questionBank?: ExamQuestion[];
  onComplete?: (result: ExamResult) => void;
  className?: string;
}

// ============================================================================
// Default Data
// ============================================================================

export const DEFAULT_EXAM_CONFIGS: ExamConfig[] = [
  {
    type: "CLSO",
    name: "CLSO Practice Exam",
    description: "Certified Laser Safety Officer - Full Practice Examination",
    durationMinutes: 120,
    questionCount: 100,
    passingScore: 70,
    categories: [
      "Fundamentals",
      "Bioeffects",
      "MPE & Hazard Analysis",
      "Control Measures",
      "Standards & Regulations",
      "Medical Surveillance",
      "Non-Beam Hazards",
      "LSO Responsibilities",
    ],
  },
  {
    type: "CMLSO",
    name: "CMLSO Practice Exam",
    description: "Certified Medical Laser Safety Officer - Full Practice Examination",
    durationMinutes: 90,
    questionCount: 75,
    passingScore: 70,
    categories: [
      "Laser Physics",
      "Tissue Interactions",
      "Medical Laser Safety",
      "Control Measures",
      "Standards & Regulations",
      "Medical Surveillance",
      "LSO Responsibilities",
    ],
  },
];

export const DEFAULT_QUESTION_BANK: ExamQuestion[] = [
  {
    id: "q1",
    question: "What is the primary responsibility of a Laser Safety Officer (LSO)?",
    options: [
      "To advise management on laser safety matters",
      "To have executive authority and responsibility for the laser safety program",
      "To conduct laser safety training only",
      "To perform maintenance on laser equipment",
    ],
    correctIndex: 1,
    explanation: "The LSO must have executive authority and responsibility for the laser safety program, not merely an advisory role. This is specified in ANSI Z136.1 Section 3.",
    category: "LSO Responsibilities",
    difficulty: "easy",
    reference: "ANSI Z136.1 Section 3.1",
  },
  {
    id: "q2",
    question: "For a continuous wave visible laser (400-700 nm), what is the Maximum Permissible Exposure (MPE) for eye exposure?",
    options: [
      "1.8 × t^0.75 mW/cm²",
      "3.0 × t^0.5 mW/cm²",
      "1.0 mW/cm² regardless of exposure time",
      "5.0 mW/cm² for exposures under 10 seconds",
    ],
    correctIndex: 0,
    explanation: "For CW visible lasers, the MPE is calculated as 1.8 × t^0.75 mW/cm², where t is the exposure time in seconds. This formula is found in ANSI Z136.1 Table 5a.",
    category: "MPE & Hazard Analysis",
    difficulty: "medium",
    reference: "ANSI Z136.1 Table 5a",
  },
  {
    id: "q3",
    question: "Which laser class is considered safe under all conditions of normal use?",
    options: [
      "Class 2",
      "Class 3R",
      "Class 1",
      "Class 3B",
    ],
    correctIndex: 2,
    explanation: "Class 1 lasers are considered safe under all conditions of normal use. They may contain higher class lasers but are fully enclosed such that no hazardous radiation is accessible.",
    category: "Fundamentals",
    difficulty: "easy",
    reference: "ANSI Z136.1 Section 4.1",
  },
  {
    id: "q4",
    question: "What is the minimum optical density (OD) requirement for protective eyewear?",
    options: [
      "OD 1 for all wavelengths",
      "Sufficient to reduce exposure below MPE",
      "OD 7 for all Class 4 lasers",
      "No specific requirement if engineering controls are in place",
    ],
    correctIndex: 1,
    explanation: "Protective eyewear must have sufficient optical density to reduce the exposure at the eye to levels below the appropriate MPE. The specific OD depends on the laser parameters.",
    category: "Control Measures",
    difficulty: "medium",
    reference: "ANSI Z136.1 Section 5.3",
  },
  {
    id: "q5",
    question: "Under ANSI E1.46, what is the required response time for scan failure detection systems?",
    options: [
      "Within 100 milliseconds",
      "Within 1 second",
      "Within a few milliseconds",
      "Within 10 seconds",
    ],
    correctIndex: 2,
    explanation: "ANSI E1.46 requires scan failure detection systems to respond within a few milliseconds to prevent hazardous exposure in case of scanner malfunction.",
    category: "Standards & Regulations",
    difficulty: "medium",
    reference: "ANSI E1.46 Section 7.4",
  },
  {
    id: "q6",
    question: "What wavelength range presents the greatest retinal hazard?",
    options: [
      "180-400 nm (UV)",
      "400-700 nm (Visible)",
      "700-1400 nm (Near IR)",
      "1400 nm - 1 mm (Far IR)",
    ],
    correctIndex: 1,
    explanation: "The visible spectrum (400-700 nm) presents the greatest retinal hazard because light in this range is focused by the eye's lens onto the retina, concentrating the energy.",
    category: "Bioeffects",
    difficulty: "easy",
    reference: "ANSI Z136.1 Section 4.2",
  },
  {
    id: "q7",
    question: "When is pre-placement medical surveillance required?",
    options: [
      "For all personnel in the facility",
      "Only for Class 4 laser users",
      "For personnel assigned to Class 3B or Class 4 laser work",
      "Only when exposure incidents occur",
    ],
    correctIndex: 2,
    explanation: "Pre-placement medical examinations are required for personnel assigned to Class 3B or Class 4 laser work to establish a baseline for potential future exposure assessment.",
    category: "Medical Surveillance",
    difficulty: "medium",
    reference: "ANSI Z136.1 Section 6.1",
  },
  {
    id: "q8",
    question: "What is the Nominal Ocular Hazard Distance (NOHD)?",
    options: [
      "The distance at which the laser is no longer hazardous",
      "The distance from the laser at which the beam irradiance equals the MPE",
      "The minimum distance for safe operation",
      "The maximum range of the laser beam",
    ],
    correctIndex: 1,
    explanation: "The NOHD is the distance from the laser at which the beam irradiance or radiant exposure equals the appropriate MPE. Beyond this distance, the beam is considered eye-safe.",
    category: "MPE & Hazard Analysis",
    difficulty: "medium",
    reference: "ANSI Z136.1 Section 4.4",
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function CertificationExamSimulator({
  examConfigs = DEFAULT_EXAM_CONFIGS,
  questionBank = DEFAULT_QUESTION_BANK,
  onComplete,
  className,
}: CertificationExamSimulatorProps) {
  const [phase, setPhase] = useState<"select" | "setup" | "exam" | "review" | "results">("select");
  const [selectedConfig, setSelectedConfig] = useState<ExamConfig | null>(null);
  const [examQuestions, setExamQuestions] = useState<ExamQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({});
  const [showFeedback, setShowFeedback] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  // Filter questions by exam type
  const filterQuestions = (config: ExamConfig) => {
    // In a real implementation, this would filter based on exam type
    // For now, we'll use all available questions
    return questionBank.slice(0, Math.min(config.questionCount, questionBank.length));
  };

  const handleSelectExam = (config: ExamConfig) => {
    setSelectedConfig(config);
    setPhase("setup");
  };

  const handleStartExam = () => {
    if (!selectedConfig) return;
    
    const questions = filterQuestions(selectedConfig);
    setExamQuestions(questions);
    setCurrentQuestionIndex(0);
    setSelectedAnswers({});
    setShowFeedback(false);
    setStartTime(new Date());
    setTimeRemaining(selectedConfig.durationMinutes * 60);
    setPhase("exam");
  };

  const handleSelectAnswer = (optionIndex: number) => {
    const currentQuestion = examQuestions[currentQuestionIndex];
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestion.id]: optionIndex }));
    setShowFeedback(true);
  };

  const handleNext = () => {
    if (currentQuestionIndex < examQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setShowFeedback(false);
    } else {
      setPhase("results");
    }
  };

  const calculateResults = (): ExamResult => {
    if (!selectedConfig || !startTime) return null as unknown as ExamResult;

    const endTime = new Date();
    const timeSpentMinutes = (endTime.getTime() - startTime.getTime()) / 60000;

    let correctCount = 0;
    const categoryBreakdown: ExamResult["categoryBreakdown"] = {};
    const answers: ExamResult["answers"] = [];

    examQuestions.forEach((q) => {
      const selected = selectedAnswers[q.id];
      const isCorrect = selected === q.correctIndex;
      
      if (isCorrect) correctCount++;

      // Category tracking
      if (!categoryBreakdown[q.category]) {
        categoryBreakdown[q.category] = { correct: 0, total: 0, percentage: 0 };
      }
      categoryBreakdown[q.category].total++;
      if (isCorrect) categoryBreakdown[q.category].correct++;

      answers.push({
        questionId: q.id,
        selected: selected ?? -1,
        correct: isCorrect,
      });
    });

    // Calculate percentages
    Object.keys(categoryBreakdown).forEach((cat) => {
      const data = categoryBreakdown[cat];
      data.percentage = Math.round((data.correct / data.total) * 100);
    });

    const score = Math.round((correctCount / examQuestions.length) * 100);

    return {
      examType: selectedConfig.type,
      score,
      correctAnswers: correctCount,
      totalQuestions: examQuestions.length,
      timeSpentMinutes,
      passed: score >= selectedConfig.passingScore,
      categoryBreakdown,
      answers,
      completedAt: endTime,
    };
  };

  const handleReset = () => {
    setPhase("select");
    setSelectedConfig(null);
    setExamQuestions([]);
    setSelectedAnswers({});
    setStartTime(null);
  };

  // Phase: Select Exam
  if (phase === "select") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <GraduationCap className="w-6 h-6 text-primary" />
            Certification Exam Simulator
          </h2>
          <p className="text-muted-foreground mt-2">
            Practice for your CLSO or CMLSO certification exam
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {examConfigs.map((config) => (
            <button
              key={config.type}
              onClick={() => handleSelectExam(config)}
              className="p-6 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <BookOpen className="w-6 h-6" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg">{config.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {config.description}
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Badge variant="outline">
                      <Clock className="w-3 h-3 mr-1" />
                      {config.durationMinutes} min
                    </Badge>
                    <Badge variant="outline">
                      {config.questionCount} questions
                    </Badge>
                    <Badge variant="outline">
                      {config.passingScore}% to pass
                    </Badge>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Phase: Setup
  if (phase === "setup" && selectedConfig) {
    return (
      <Card className={cn("max-w-2xl mx-auto", className)}>
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">{selectedConfig.name}</CardTitle>
          <p className="text-muted-foreground">{selectedConfig.description}</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Clock className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <div className="font-bold">{selectedConfig.durationMinutes} min</div>
              <div className="text-xs text-muted-foreground">Time Limit</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <AlertCircle className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <div className="font-bold">{selectedConfig.questionCount}</div>
              <div className="text-xs text-muted-foreground">Questions</div>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Trophy className="w-5 h-5 mx-auto mb-1 text-muted-foreground" />
              <div className="font-bold">{selectedConfig.passingScore}%</div>
              <div className="text-xs text-muted-foreground">Passing Score</div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-2">Exam Categories:</h4>
            <div className="flex flex-wrap gap-2">
              {selectedConfig.categories.map((cat) => (
                <Badge key={cat} variant="secondary">
                  {cat}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <AlertCircle className="w-5 h-5" />
              Important Notes
            </div>
            <ul className="text-sm text-muted-foreground mt-2 space-y-1">
              <li>• You cannot pause the exam once started</li>
              <li>• Review all questions before time expires</li>
              <li>• Passing score is {selectedConfig.passingScore}%</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-3">
          <Button variant="outline" onClick={() => setPhase("select")}>
            Back
          </Button>
          <Button onClick={handleStartExam}>
            Start Exam
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Phase: Exam
  if (phase === "exam" && examQuestions.length > 0) {
    const currentQuestion = examQuestions[currentQuestionIndex];
    const selectedAnswer = selectedAnswers[currentQuestion.id];
    const isAnswered = selectedAnswer !== undefined;

    return (
      <div className={cn("max-w-3xl mx-auto space-y-6", className)}>
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Badge variant="outline">
              Question {currentQuestionIndex + 1} of {examQuestions.length}
            </Badge>
            <Badge variant="secondary">{currentQuestion.category}</Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Timer className="w-4 h-4" />
            <span>{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, "0")}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${((currentQuestionIndex + 1) / examQuestions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge
                className={cn(
                  currentQuestion.difficulty === "easy" && "bg-green-500/20 text-green-400",
                  currentQuestion.difficulty === "medium" && "bg-amber-500/20 text-amber-400",
                  currentQuestion.difficulty === "hard" && "bg-red-500/20 text-red-400"
                )}
              >
                {currentQuestion.difficulty}
              </Badge>
            </div>
            <CardTitle className="text-lg leading-relaxed mt-3">
              {currentQuestion.question}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-3">
            {currentQuestion.options.map((option, index) => {
              const isSelected = selectedAnswer === index;
              const isCorrect = index === currentQuestion.correctIndex;
              const showResult = showFeedback && isAnswered;

              return (
                <button
                  key={index}
                  onClick={() => !showFeedback && handleSelectAnswer(index)}
                  disabled={showFeedback}
                  className={cn(
                    "w-full text-left p-4 rounded-lg border transition-all",
                    showResult && isCorrect && "bg-green-500/10 border-green-500/50",
                    showResult && isSelected && !isCorrect && "bg-red-500/10 border-red-500/50",
                    !showResult && isSelected && "bg-primary/10 border-primary",
                    !showResult && !isSelected && "bg-card border-border/50 hover:border-primary/50"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{String.fromCharCode(65 + index)}.</span>
                    <span>{option}</span>
                    {showResult && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-green-400 ml-auto" />
                    )}
                    {showResult && isSelected && !isCorrect && (
                      <XCircle className="w-5 h-5 text-red-400 ml-auto" />
                    )}
                  </div>
                </button>
              );
            })}

            {/* Feedback */}
            {showFeedback && (
              <div className={cn(
                "p-4 rounded-lg border mt-4",
                selectedAnswer === currentQuestion.correctIndex
                  ? "bg-green-500/10 border-green-500/30"
                  : "bg-red-500/10 border-red-500/30"
              )}>
                <div className="flex items-center gap-2 font-medium">
                  {selectedAnswer === currentQuestion.correctIndex ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-green-400" />
                      <span className="text-green-400">Correct!</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span className="text-red-400">Incorrect</span>
                    </>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  {currentQuestion.explanation}
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  Reference: {currentQuestion.reference}
                </p>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-end">
            {showFeedback && (
              <Button onClick={handleNext}>
                {currentQuestionIndex === examQuestions.length - 1 ? "See Results" : "Next Question"}
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Phase: Results
  if (phase === "results") {
    const result = calculateResults();

    return (
      <Card className={cn("max-w-3xl mx-auto", className)}>
        <CardHeader className="text-center">
          <div
            className={cn(
              "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
              result.passed ? "bg-green-500/20" : "bg-red-500/20"
            )}
          >
            {result.passed ? (
              <Trophy className="w-10 h-10 text-green-400" />
            ) : (
              <AlertCircle className="w-10 h-10 text-red-400" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {result.passed ? "Congratulations!" : "Keep Studying"}
          </CardTitle>
          <p className="text-muted-foreground">
            {result.passed
              ? `You passed the ${result.examType} practice exam!`
              : `You need ${selectedConfig?.passingScore}% to pass`}
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Score */}
          <div className="text-center">
            <div
              className={cn(
                "text-5xl font-bold",
                result.passed ? "text-green-400" : "text-red-400"
              )}
            >
              {result.score}%
            </div>
            <p className="text-muted-foreground mt-2">
              {result.correctAnswers} correct out of {result.totalQuestions}
            </p>
          </div>

          {/* Category Breakdown */}
          <div>
            <h4 className="font-semibold mb-3">Performance by Category</h4>
            <div className="space-y-2">
              {Object.entries(result.categoryBreakdown).map(([category, data]) => (
                <div key={category} className="flex items-center gap-3">
                  <div className="w-40 text-sm truncate">{category}</div>
                  <div className="flex-grow h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full",
                        data.percentage >= 70 ? "bg-green-500" : "bg-red-500"
                      )}
                      style={{ width: `${data.percentage}%` }}
                    />
                  </div>
                  <div className="w-16 text-right text-sm">
                    {data.correct}/{data.total}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Time */}
          <div className="text-center text-sm text-muted-foreground">
            Time spent: {Math.round(result.timeSpentMinutes)} minutes
          </div>
        </CardContent>

        <CardFooter className="flex justify-center gap-3">
          <Button variant="outline" onClick={handleReset}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Try Again
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return null;
}

export default CertificationExamSimulator;
