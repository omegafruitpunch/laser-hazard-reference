'use client';

import { useState } from 'react';
import Link from 'next/link';
import { AssessmentResult, QuizBank, CompetencyArea } from '@/types/quiz';
import { 
  Trophy, 
  RotateCcw, 
  Award, 
  ChevronRight, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Clock,
  Target,
  BookOpen,
  TrendingUp,
  Brain,
  ChevronDown,
  ChevronUp,
  FileText
} from 'lucide-react';

interface AssessmentResultsProps {
  result: AssessmentResult;
  quizBank: QuizBank;
  onRetry?: () => void;
  onAbandon?: () => void;
}

const COMPETENCY_NAMES: Record<CompetencyArea, string> = {
  fundamentals: 'Laser Fundamentals',
  bioeffects: 'Biological Effects',
  hazard_evaluation: 'Hazard Evaluation',
  hazard_controls: 'Hazard Controls',
  program_administration: 'Program Administration',
  medical_surveillance: 'Medical Surveillance',
  non_beam_hazards: 'Non-Beam Hazards',
  standards_regulations: 'Standards & Regulations',
  hazard_calculations: 'Hazard Calculations',
};

export default function AssessmentResults({
  result,
  quizBank,
  onRetry,
  onAbandon,
}: AssessmentResultsProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>('summary');
  const [showReview, setShowReview] = useState(false);

  const percent = result.score;
  const isPassed = result.passed;

  const getGrade = (score: number): { letter: string; color: string; message: string } => {
    if (score >= 90) return { letter: 'A', color: 'text-green-400', message: 'Excellent!' };
    if (score >= 80) return { letter: 'B', color: 'text-blue-400', message: 'Great job!' };
    if (score >= 70) return { letter: 'C', color: 'text-yellow-400', message: 'Good work!' };
    if (score >= 60) return { letter: 'D', color: 'text-orange-400', message: 'Keep practicing!' };
    return { letter: 'F', color: 'text-red-400', message: 'Needs improvement' };
  };

  const grade = getGrade(percent);

  const correctCount = result.questionResults.filter(q => q.isCorrect).length;
  const incorrectCount = result.questionResults.length - correctCount;

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  if (showReview) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-foreground">Question Review</h2>
          <button
            onClick={() => setShowReview(false)}
            className="px-4 py-2 bg-muted hover:bg-muted/80 text-foreground rounded-lg transition-colors"
          >
            Back to Results
          </button>
        </div>

        <div className="space-y-4">
          {result.questionResults.map((qr, index) => {
            const question = quizBank.questions.find(q => q.id === qr.questionId);
            if (!question) return null;

            return (
              <div
                key={qr.questionId}
                className={`p-6 rounded-xl border ${
                  qr.isCorrect
                    ? 'bg-green-500/5 border-green-500/20'
                    : 'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    qr.isCorrect ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                  }`}>
                    {qr.isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground mb-1">Question {index + 1}</p>
                    <p className="text-foreground mb-4">{question.text}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Your answer:</span>
                        <span className={qr.isCorrect ? 'text-green-400' : 'text-red-400'}>
                          {formatAnswer(qr.userAnswer, question.type)}
                        </span>
                      </div>
                      {!qr.isCorrect && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Correct answer:</span>
                          <span className="text-green-400">
                            {formatAnswer(qr.correctAnswer, question.type)}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                      <p className="text-sm text-muted-foreground">{qr.explanation}</p>
                    </div>

                    {qr.hintsUsed > 0 && (
                      <p className="mt-2 text-xs text-yellow-500">
                        Hints used: {qr.hintsUsed}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Card */}
      <div className={`rounded-2xl p-8 border ${
        isPassed 
          ? 'bg-gradient-to-br from-green-900/50 to-gray-900 border-green-500/30' 
          : 'bg-gradient-to-br from-red-900/50 to-gray-900 border-red-500/30'
      }`}>
        <div className="flex flex-col md:flex-row items-center gap-8">
          {/* Score Circle */}
          <div className={`w-32 h-32 rounded-full border-4 flex flex-col items-center justify-center ${
            isPassed ? 'border-green-500/60 bg-green-500/10' : 'border-red-500/60 bg-red-500/10'
          }`}>
            <span className={`text-4xl font-bold ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
              {percent}%
            </span>
            <span className={`text-lg font-semibold ${grade.color}`}>{grade.letter}</span>
          </div>

          {/* Result Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
              {isPassed ? (
                <Trophy size={28} className="text-green-400" />
              ) : (
                <AlertTriangle size={28} className="text-red-400" />
              )}
              <h2 className={`text-3xl font-bold ${isPassed ? 'text-green-400' : 'text-red-400'}`}>
                {isPassed ? 'Congratulations!' : 'Keep Practicing'}
              </h2>
            </div>
            <p className="text-muted-foreground mb-4">
              {isPassed 
                ? `You passed the ${quizBank.title} with ${grade.message}`
                : `You scored ${percent}%. You need ${quizBank.passingScore}% to pass.`}
            </p>
            
            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-sm">
                <CheckCircle size={16} className="text-green-400" />
                <span className="text-foreground">{correctCount} Correct</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <XCircle size={16} className="text-red-400" />
                <span className="text-foreground">{incorrectCount} Incorrect</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Clock size={16} className="text-blue-400" />
                <span className="text-foreground">{result.timeSpentMinutes.toFixed(1)} min</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Sections */}
      <div className="space-y-4">
        {/* Score Breakdown */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => toggleSection('breakdown')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Target size={20} className="text-red-400" />
              <span className="font-semibold text-foreground">Score Breakdown</span>
            </div>
            {expandedSection === 'breakdown' ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
          </button>
          
          {expandedSection === 'breakdown' && (
            <div className="px-6 pb-6 border-t border-border">
              {/* Category Breakdown */}
              {Object.entries(result.categoryBreakdown).length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">By Category</h4>
                  <div className="space-y-3">
                    {Object.entries(result.categoryBreakdown).map(([category, data]) => (
                      <div key={category}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-foreground capitalize">{category.replace(/_/g, ' ')}</span>
                          <span className="text-muted-foreground">{data.correct}/{data.total} ({data.percentage}%)</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              data.percentage >= 70 ? 'bg-green-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${data.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Competency Analysis */}
              {Object.keys(result.competencyAnalysis).length > 0 && (
                <div className="mt-6">
                  <h4 className="text-sm font-medium text-muted-foreground mb-3">By Competency Area</h4>
                  <div className="space-y-3">
                    {Object.entries(result.competencyAnalysis)
                      .filter(([, data]) => data && data.total > 0)
                      .map(([area, data]) => (
                        <div key={area}>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-foreground">{COMPETENCY_NAMES[area as CompetencyArea] || area}</span>
                            <span className="text-muted-foreground">{data?.correct}/{data?.total} ({data?.percentage}%)</span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                (data?.percentage || 0) >= 70 ? 'bg-green-500' : 'bg-red-500'
                              }`}
                              style={{ width: `${data?.percentage || 0}%` }}
                            />
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Strengths & Weaknesses */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => toggleSection('analysis')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Brain size={20} className="text-purple-400" />
              <span className="font-semibold text-foreground">Strengths & Weaknesses</span>
            </div>
            {expandedSection === 'analysis' ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
          </button>
          
          {expandedSection === 'analysis' && (
            <div className="px-6 pb-6 border-t border-border">
              <div className="grid md:grid-cols-2 gap-6 mt-4">
                {/* Strong Areas */}
                <div>
                  <h4 className="text-sm font-medium text-green-400 mb-3 flex items-center gap-2">
                    <TrendingUp size={16} />
                    Strong Areas
                  </h4>
                  {result.strongAreas.length > 0 ? (
                    <ul className="space-y-2">
                      {result.strongAreas.map(area => (
                        <li key={area} className="text-sm text-foreground flex items-center gap-2">
                          <CheckCircle size={14} className="text-green-400" />
                          {COMPETENCY_NAMES[area as CompetencyArea] || area}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No strong areas identified yet. Keep practicing!</p>
                  )}
                </div>

                {/* Weak Areas */}
                <div>
                  <h4 className="text-sm font-medium text-red-400 mb-3 flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Areas for Improvement
                  </h4>
                  {result.weakAreas.length > 0 ? (
                    <ul className="space-y-2">
                      {result.weakAreas.map(area => (
                        <li key={area} className="text-sm text-foreground flex items-center gap-2">
                          <BookOpen size={14} className="text-red-400" />
                          {COMPETENCY_NAMES[area as CompetencyArea] || area}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-muted-foreground">No weak areas. Excellent work!</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Recommendations */}
        <div className="bg-card rounded-xl border border-border overflow-hidden">
          <button
            onClick={() => toggleSection('recommendations')}
            className="w-full px-6 py-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-blue-400" />
              <span className="font-semibold text-foreground">Recommendations</span>
            </div>
            {expandedSection === 'recommendations' ? <ChevronUp size={20} className="text-muted-foreground" /> : <ChevronDown size={20} className="text-muted-foreground" />}
          </button>
          
          {expandedSection === 'recommendations' && (
            <div className="px-6 pb-6 border-t border-border mt-4">
              <ul className="space-y-3">
                {result.recommendations.map((rec, index) => (
                  <li key={index} className="text-sm text-foreground flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-muted rounded-full flex items-center justify-center text-xs text-muted-foreground">
                      {index + 1}
                    </span>
                    {rec}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col sm:flex-row gap-3">
        {result.certificateEligible && (
          <Link
            href={`/certificate?quizBankId=${quizBank.id}`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-500 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            <Award size={18} />
            Download Certificate
          </Link>
        )}

        <button
          onClick={() => setShowReview(true)}
          className="flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground py-3 px-6 rounded-xl transition-colors"
        >
          <FileText size={16} />
          Review Answers
        </button>

        {onRetry && (
          <button
            onClick={onRetry}
            className="flex items-center justify-center gap-2 bg-muted hover:bg-muted/80 text-foreground py-3 px-6 rounded-xl transition-colors"
          >
            <RotateCcw size={16} />
            {isPassed ? 'Retake Quiz' : 'Try Again'}
          </button>
        )}

        <Link
          href="/courses"
          className="flex items-center justify-center gap-2 text-muted-foreground hover:text-foreground text-sm py-3 px-6 transition-colors"
        >
          Back to Courses
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}

// Helper function to format answers for display
function formatAnswer(answer: unknown, questionType: string): string {
  if (answer === null || answer === undefined) return 'Not answered';
  
  switch (questionType) {
    case 'true_false':
      return answer === true ? 'True' : 'False';
    case 'multiple_choice':
      return typeof answer === 'number' ? `Option ${String.fromCharCode(65 + answer)}` : String(answer);
    case 'multi_select':
      if (Array.isArray(answer)) {
        return answer.map(a => `Option ${String.fromCharCode(65 + (a as number))}`).join(', ');
      }
      return String(answer);
    case 'calculation':
      return typeof answer === 'number' ? answer.toFixed(4) : String(answer);
    default:
      return String(answer);
  }
}
