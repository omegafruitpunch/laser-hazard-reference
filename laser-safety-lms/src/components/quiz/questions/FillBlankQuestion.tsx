'use client';

import { useState } from 'react';
import { FillBlankQuestion as FillBlankQuestionType } from '@/types/quiz';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface FillBlankQuestionProps {
  question: FillBlankQuestionType;
  answers: Record<string, string>;
  onChange: (answers: Record<string, string>) => void;
  showResult: boolean;
  onUseHint?: (level: number) => void;
  hintsUsed?: number[];
}

export default function FillBlankQuestion({
  question,
  answers,
  onChange,
  showResult,
  onUseHint,
  hintsUsed = [],
}: FillBlankQuestionProps) {
  const [showHint, setShowHint] = useState<number | null>(null);

  const handleHintClick = (level: number) => {
    if (!hintsUsed.includes(level)) {
      onUseHint?.(level);
      setShowHint(level);
    }
  };

  const handleChange = (blankId: string, value: string) => {
    if (showResult) return;
    onChange({ ...answers, [blankId]: value });
  };

  const getBlankStyle = (blankId: string) => {
    const value = answers[blankId] || '';
    const blank = question.blanks.find(b => b.id === blankId);
    if (!blank || !showResult) {
      return 'border-border bg-muted text-foreground focus:border-red-500 focus:ring-1 focus:ring-red-500';
    }

    const isCorrect = blank.caseSensitive
      ? value === blank.correctAnswer || (blank.acceptableAnswers?.includes(value) ?? false)
      : value.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim() ||
        (blank.acceptableAnswers?.some(a => a.toLowerCase().trim() === value.toLowerCase().trim()) ?? false);

    // Check numeric tolerance
    let isNumericallyCorrect = isCorrect;
    if (!isCorrect && blank.tolerance !== undefined) {
      const userNum = parseFloat(value);
      const correctNum = parseFloat(blank.correctAnswer);
      if (!isNaN(userNum) && !isNaN(correctNum)) {
        const diff = Math.abs(userNum - correctNum);
        const toleranceValue = Math.abs(correctNum) * (blank.tolerance / 100);
        isNumericallyCorrect = diff <= toleranceValue;
      }
    }

    return isCorrect || isNumericallyCorrect
      ? 'border-green-500 bg-green-500/10 text-green-300'
      : 'border-red-500 bg-red-500/10 text-red-300';
  };

  const correctCount = question.blanks.filter(blank => {
    const value = answers[blank.id] || '';
    
    const isCorrect = blank.caseSensitive
      ? value === blank.correctAnswer || (blank.acceptableAnswers?.includes(value) ?? false)
      : value.toLowerCase().trim() === blank.correctAnswer.toLowerCase().trim();
    
    if (isCorrect) return true;
    
    // Check numeric tolerance
    if (blank.tolerance !== undefined) {
      const userNum = parseFloat(value);
      const correctNum = parseFloat(blank.correctAnswer);
      if (!isNaN(userNum) && !isNaN(correctNum)) {
        const diff = Math.abs(userNum - correctNum);
        const toleranceValue = Math.abs(correctNum) * (blank.tolerance / 100);
        return diff <= toleranceValue;
      }
    }
    
    return false;
  }).length;

  // Parse text with blanks
  const renderTextWithBlanks = () => {
    const parts = question.textWithBlanks.split(/(\[blank\])/);
    let blankIndex = 0;

    return (
      <div className="text-foreground text-lg font-medium leading-relaxed">
        {parts.map((part, index) => {
          if (part === '[blank]') {
            const blank = question.blanks[blankIndex++];
            return (
              <input
                key={blank.id}
                type="text"
                value={answers[blank.id] || ''}
                onChange={(e) => handleChange(blank.id, e.target.value)}
                disabled={showResult}
                placeholder="?"
                className={`mx-1 px-3 py-1 rounded border-2 text-center min-w-[100px] outline-none transition-colors ${getBlankStyle(
                  blank.id
                )}`}
              />
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="space-y-5">
      {/* Question Text with Blanks */}
      <div className="p-4 bg-muted/30 rounded-lg">
        {renderTextWithBlanks()}
      </div>

      {/* Hints */}
      {onUseHint && question.hints.length > 0 && !showResult && (
        <div className="bg-muted/50 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb size={16} className="text-yellow-500" />
            <span className="text-sm text-muted-foreground">Need a hint?</span>
          </div>
          <div className="flex gap-2">
            {question.hints.map((hint) => (
              <button
                key={hint.level}
                onClick={() => handleHintClick(hint.level)}
                disabled={hintsUsed.includes(hint.level)}
                className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
                  hintsUsed.includes(hint.level)
                    ? showHint === hint.level
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-muted text-muted-foreground cursor-not-allowed'
                    : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                }`}
              >
                {hintsUsed.includes(hint.level) ? 'Used' : `Level ${hint.level}`}
              </button>
            ))}
          </div>
          {showHint !== null && (
            <div className="mt-2 p-2 bg-yellow-500/10 border border-yellow-500/30 rounded text-sm text-yellow-300">
              {question.hints.find(h => h.level === showHint)?.text}
            </div>
          )}
        </div>
      )}

      {/* Answer Summary */}
      {showResult && (
        <div
          className={`p-4 rounded-xl border ${
            correctCount === question.blanks.length
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : correctCount > 0
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {correctCount === question.blanks.length
              ? '✓ Perfect!'
              : `${correctCount} of ${question.blanks.length} correct`}
          </p>
          <p className="text-sm opacity-80">{question.explanation}</p>
          
          {/* Show correct answers */}
          <div className="mt-3 pt-3 border-t border-border/50">
            <p className="text-xs text-muted-foreground mb-2">Correct answers:</p>
            <div className="space-y-1">
              {question.blanks.map((blank, index) => (
                <div key={blank.id} className="text-sm flex items-center gap-2">
                  <span className="text-muted-foreground">Blank {index + 1}:</span>
                  <span className="text-green-400 font-medium">{blank.correctAnswer}</span>
                  {blank.acceptableAnswers && blank.acceptableAnswers.length > 0 && (
                    <span className="text-muted-foreground text-xs">
                      (also: {blank.acceptableAnswers.join(', ')})
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
