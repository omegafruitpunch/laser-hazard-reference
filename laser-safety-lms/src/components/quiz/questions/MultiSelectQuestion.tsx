'use client';

import { useState } from 'react';
import { MultiSelectQuestion as MultiSelectQuestionType } from '@/types/quiz';
import { CheckCircle, XCircle, CheckSquare, Square, Lightbulb } from 'lucide-react';

interface MultiSelectQuestionProps {
  question: MultiSelectQuestionType;
  selectedIndices: number[];
  onSelect: (indices: number[]) => void;
  showResult: boolean;
  onUseHint?: (level: number) => void;
  hintsUsed?: number[];
}

export default function MultiSelectQuestion({
  question,
  selectedIndices,
  onSelect,
  showResult,
  onUseHint,
  hintsUsed = [],
}: MultiSelectQuestionProps) {
  const [showHint, setShowHint] = useState<number | null>(null);

  const toggleOption = (index: number) => {
    if (showResult) return;
    
    const newSelection = selectedIndices.includes(index)
      ? selectedIndices.filter(i => i !== index)
      : [...selectedIndices, index];
    
    onSelect(newSelection);
  };

  const handleHintClick = (level: number) => {
    if (!hintsUsed.includes(level)) {
      onUseHint?.(level);
      setShowHint(level);
    }
  };

  const getOptionStyle = (index: number) => {
    const isSelected = selectedIndices.includes(index);
    const isCorrect = question.correctIndices.includes(index);

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

  const getCorrectCount = () => {
    return selectedIndices.filter(i => question.correctIndices.includes(i)).length;
  };

  const getIncorrectCount = () => {
    return selectedIndices.filter(i => !question.correctIndices.includes(i)).length;
  };

  return (
    <div className="space-y-5">
      {/* Question Text */}
      <div>
        <h2 className="text-foreground text-lg font-medium leading-relaxed">{question.text}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Select all that apply ({question.correctIndices.length} correct answers)
        </p>
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

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedIndices.includes(index);
          const isCorrect = question.correctIndices.includes(index);

          return (
            <button
              key={index}
              onClick={() => toggleOption(index)}
              disabled={showResult}
              className={`w-full text-left p-4 rounded-xl border transition-all ${getOptionStyle(index)}`}
            >
              <div className="flex items-center gap-3">
                <span className="flex-shrink-0">
                  {showResult ? (
                    isCorrect ? (
                      <CheckCircle size={20} className="text-green-400" />
                    ) : isSelected ? (
                      <XCircle size={20} className="text-red-400" />
                    ) : (
                      <Square size={20} className="text-muted-foreground/60" />
                    )
                  ) : isSelected ? (
                    <CheckSquare size={20} className="text-red-400" />
                  ) : (
                    <Square size={20} className="text-muted-foreground" />
                  )}
                </span>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Summary */}
      {showResult && (
        <div
          className={`p-4 rounded-xl border ${
            getCorrectCount() === question.correctIndices.length && getIncorrectCount() === 0
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : getCorrectCount() > 0
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {getCorrectCount() === question.correctIndices.length && getIncorrectCount() === 0
              ? '✓ Perfect!'
              : getCorrectCount() > 0
              ? `△ Partially Correct (${getCorrectCount()}/${question.correctIndices.length})`
              : '✗ Incorrect'}
          </p>
          <p className="text-sm opacity-80">
            You selected {getCorrectCount()} correct and {getIncorrectCount()} incorrect.
          </p>
          <p className="text-sm opacity-80 mt-2">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
