'use client';

import { useState, useEffect } from 'react';
import { QuizBank, AssessmentResult, AssessmentType, UserAnswer } from '@/types/quiz';
import { validateAnswer } from '@/lib/quiz/quizValidator';
import QuizEngine from './QuizEngine';
import AssessmentResults from './AssessmentResults';

interface AssessmentFlowProps {
  quizBank: QuizBank;
  onComplete?: (result: AssessmentResult) => void;
  onAbandon?: () => void;
  showIntro?: boolean;
  showResults?: boolean;
}

type FlowPhase = 'intro' | 'briefing' | 'quiz' | 'review' | 'results';

export default function AssessmentFlow({
  quizBank,
  onComplete,
  onAbandon,
  showIntro = true,
  showResults = true,
}: AssessmentFlowProps) {
  const [phase, setPhase] = useState<FlowPhase>(showIntro ? 'intro' : 'briefing');
  const [result, setResult] = useState<AssessmentResult | null>(null);
  const [agreedToRules, setAgreedToRules] = useState(false);

  const getAssessmentTypeName = (type: AssessmentType): string => {
    switch (type) {
      case 'module_quiz':
        return 'Module Quiz';
      case 'course_exam':
        return 'Course Exam';
      case 'certification_practice':
        return 'Certification Practice';
      case 'knowledge_check':
        return 'Knowledge Check';
      case 'spaced_repetition':
        return 'Review Session';
      default:
        return 'Assessment';
    }
  };

  const getAssessmentTypeDescription = (type: AssessmentType): string => {
    switch (type) {
      case 'module_quiz':
        return 'Test your understanding of the module content with focused questions.';
      case 'course_exam':
        return 'Comprehensive assessment covering all course materials.';
      case 'certification_practice':
        return 'Full-length practice exam simulating the certification test environment.';
      case 'knowledge_check':
        return 'Quick assessment to verify key concepts.';
      case 'spaced_repetition':
        return 'Review questions scheduled to optimize long-term retention.';
      default:
        return '';
    }
  };

  const handleStart = () => {
    if (phase === 'intro') {
      setPhase('briefing');
    } else if (phase === 'briefing' && agreedToRules) {
      setPhase('quiz');
    }
  };

  const handleQuizComplete = (quizResult: AssessmentResult) => {
    setResult(quizResult);
    setPhase('results');
    onComplete?.(quizResult);
  };

  const handleRetry = () => {
    setResult(null);
    setAgreedToRules(false);
    setPhase('intro');
  };

  // Intro Screen
  if (phase === 'intro') {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="bg-gradient-to-br from-card to-muted rounded-2xl p-8 border border-border">
          {/* Header */}
          <div className="text-center mb-8">
            <span className="inline-block px-3 py-1 bg-red-500/20 text-red-400 text-sm font-medium rounded-full mb-4">
              {getAssessmentTypeName(quizBank.assessmentType)}
            </span>
            <h1 className="text-3xl font-bold text-foreground mb-2">{quizBank.title}</h1>
            <p className="text-muted-foreground">{quizBank.description}</p>
          </div>

          {/* Assessment Details */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{quizBank.totalQuestions}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Questions</p>
            </div>
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{quizBank.passingScore}%</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Passing Score</p>
            </div>
            {quizBank.timeLimitMinutes && (
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-foreground">{quizBank.timeLimitMinutes}</p>
                <p className="text-xs text-muted-foreground uppercase tracking-wider">Minutes</p>
              </div>
            )}
            <div className="bg-muted/50 rounded-xl p-4 text-center">
              <p className="text-2xl font-bold text-foreground">{quizBank.retakePolicy.maxAttempts}</p>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Max Attempts</p>
            </div>
          </div>

          {/* Description */}
          <div className="bg-muted/30 rounded-xl p-6 mb-8">
            <h3 className="text-foreground font-semibold mb-2">About this Assessment</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {getAssessmentTypeDescription(quizBank.assessmentType)}
            </p>
            
            {quizBank.categories && Object.keys(quizBank.categories).length > 0 && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Coverage Areas:</h4>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(quizBank.categories).map(([key, data]) => (
                    <span
                      key={key}
                      className="px-2 py-1 bg-muted rounded text-xs text-muted-foreground"
                    >
                      {key.replace(/_/g, ' ')} ({data.weight}%)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStart}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
            >
              Continue to Briefing
            </button>
            {onAbandon && (
              <button
                onClick={onAbandon}
                className="py-3 px-6 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold rounded-xl transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Briefing Screen
  if (phase === 'briefing') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-card rounded-2xl p-8 border border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Pre-Assessment Briefing</h2>

          <div className="space-y-6 mb-8">
            {/* Rules Section */}
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-xs">1</span>
                Assessment Rules
              </h3>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>You must achieve {quizBank.passingScore}% to pass this assessment</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>You can flag questions to review later</span>
                </li>
                {quizBank.timeLimitMinutes && (
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>You have {quizBank.timeLimitMinutes} minutes to complete the assessment</span>
                  </li>
                )}
                <li className="flex items-start gap-3">
                  <span className="text-green-500 mt-0.5">✓</span>
                  <span>You can navigate between questions using the question navigator</span>
                </li>
                {quizBank.retakePolicy.allowed && (
                  <li className="flex items-start gap-3">
                    <span className="text-green-500 mt-0.5">✓</span>
                    <span>You have {quizBank.retakePolicy.maxAttempts} attempts available</span>
                  </li>
                )}
              </ul>
            </div>

            {/* Hints Section */}
            <div className="bg-muted/50 rounded-xl p-6">
              <h3 className="text-foreground font-semibold mb-4 flex items-center gap-2">
                <span className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center text-xs text-black">2</span>
                Hints System
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Hints are available for most questions. Using hints will reduce the points earned:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-muted rounded text-xs">Level 1</span>
                  <span>General guidance (-10-20% points)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-muted rounded text-xs">Level 2</span>
                  <span>More specific direction (-20-30% points)</span>
                </li>
                <li className="flex items-center gap-3">
                  <span className="px-2 py-0.5 bg-muted rounded text-xs">Level 3</span>
                  <span>Strong hint (-30-60% points)</span>
                </li>
              </ul>
            </div>

            {/* Agreement */}
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={agreedToRules}
                onChange={(e) => setAgreedToRules(e.target.checked)}
                className="mt-1 w-4 h-4 rounded border-border bg-muted text-red-600 focus:ring-red-500"
              />
              <span className="text-sm text-muted-foreground">
                I understand the assessment rules and am ready to begin. I will complete this assessment honestly without external assistance.
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={handleStart}
              disabled={!agreedToRules}
              className="flex-1 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-colors"
            >
              Start Assessment
            </button>
            <button
              onClick={() => setPhase('intro')}
              className="py-3 px-6 bg-muted hover:bg-muted/80 text-muted-foreground font-semibold rounded-xl transition-colors"
            >
              Back
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Phase
  if (phase === 'quiz') {
    return (
      <QuizEngine
        quizBank={quizBank}
        config={{
          allowNavigation: true,
          allowFlagging: true,
          showTimer: !!quizBank.timeLimitMinutes,
          showProgress: true,
          immediateFeedback: false,
          allowHints: true,
          randomizeQuestions: quizBank.randomizeQuestions,
          randomizeOptions: quizBank.randomizeOptions,
        }}
        onComplete={handleQuizComplete}
        onAbandon={onAbandon}
      />
    );
  }

  // Results Phase
  if (phase === 'results' && result && showResults) {
    return (
      <AssessmentResults
        result={result}
        quizBank={quizBank}
        onRetry={handleRetry}
        onAbandon={onAbandon}
      />
    );
  }

  return null;
}
