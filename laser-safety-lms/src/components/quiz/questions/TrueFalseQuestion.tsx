'use client';

import { useState } from 'react';
import { TrueFalseQuestion as TrueFalseQuestionType } from '@/types/quiz';
import { CheckCircle, XCircle, Lightbulb } from 'lucide-react';

interface TrueFalseQuestionProps {
  question: TrueFalseQuestionType;
  selectedAnswer: boolean | null;
  onSelect: (answer: boolean) => void;
  showResult: boolean;
  onUseHint?: (level: number) => void;
  hintsUsed?: number[];
}

export default function TrueFalseQuestion({
  question,
  selectedAnswer,
  onSelect,
  showResult,
  onUseHint,
  hintsUsed = [],
}: TrueFalseQuestionProps) {
  const [showHint, setShowHint] = useState<number | null>(null);

  const handleHintClick = (level: number) => {
    if (!hintsUsed.includes(level)) {
      onUseHint?.(level);
      setShowHint(level);
    }
  };

  const getOptionStyle = (value: boolean) => {
    const isSelected = selectedAnswer === value;
    const isCorrect = question.correctAnswer === value;

    if (!showResult) {
      return isSelected
        ? 'border-red-500 bg-red-500/10 text-foreground'
        : 'border-border bg-card hover:border-muted-foreground text-muted-foreground hover:text-foreground';
    }

    if (isCorrect) {
      return 'border-green-500 bg-green-500/10 text-green-300';
    }
    if (isSelected && !isCorrect) {
      return 'border-red-500 bg-red-500/10 text-red-300';
    }
    return 'border-border/50 bg-card/50 text-muted-foreground/60';
  };

  return (
    <div className="space-y-5">
      {/* Question Text */}
      <h2 className="text-foreground text-lg font-medium leading-relaxed">{question.text}</h2>

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

      {/* True/False Options */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={() => !showResult && onSelect(true)}
          disabled={showResult}
          className={`p-6 rounded-xl border transition-all ${getOptionStyle(true)}`}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                showResult && question.correctAnswer === true
                  ? 'bg-green-500/30 text-green-400'
                  : showResult && selectedAnswer === true && question.correctAnswer !== true
                  ? 'bg-red-500/30 text-red-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {showResult && question.correctAnswer === true ? (
                <CheckCircle size={20} />
              ) : showResult && selectedAnswer === true ? (
                <XCircle size={20} />
              ) : (
                'T'
              )}
            </span>
            <span className="font-medium">True</span>
          </div>
        </button>

        <button
          onClick={() => !showResult && onSelect(false)}
          disabled={showResult}
          className={`p-6 rounded-xl border transition-all ${getOptionStyle(false)}`}
        >
          <div className="flex flex-col items-center gap-2">
            <span
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                showResult && question.correctAnswer === false
                  ? 'bg-green-500/30 text-green-400'
                  : showResult && selectedAnswer === false && question.correctAnswer !== false
                  ? 'bg-red-500/30 text-red-400'
                  : 'bg-muted text-muted-foreground'
              }`}
            >
              {showResult && question.correctAnswer === false ? (
                <CheckCircle size={20} />
              ) : showResult && selectedAnswer === false ? (
                <XCircle size={20} />
              ) : (
                'F'
              )}
            </span>
            <span className="font-medium">False</span>
          </div>
        </button>
      </div>

      {/* Explanation */}
      {showResult && (
        <div
          className={`p-4 rounded-xl border ${
            selectedAnswer === question.correctAnswer
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {selectedAnswer === question.correctAnswer ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-sm opacity-80">
            The correct answer is <strong>{question.correctAnswer ? 'True' : 'False'}</strong>.
          </p>
          <p className="text-sm opacity-80 mt-2">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
