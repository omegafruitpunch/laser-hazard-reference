'use client';

import { useState } from 'react';
import { MultipleChoiceQuestion as MultipleChoiceQuestionType, Hint } from '@/types/quiz';
import { CheckCircle, XCircle, HelpCircle, Lightbulb } from 'lucide-react';

interface MultipleChoiceQuestionProps {
  question: MultipleChoiceQuestionType;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  showResult: boolean;
  onUseHint?: (level: number) => void;
  hintsUsed?: number[];
}

export default function MultipleChoiceQuestion({
  question,
  selectedIndex,
  onSelect,
  showResult,
  onUseHint,
  hintsUsed = [],
}: MultipleChoiceQuestionProps) {
  const [showHint, setShowHint] = useState<number | null>(null);

  const handleHintClick = (level: number) => {
    if (!hintsUsed.includes(level)) {
      onUseHint?.(level);
      setShowHint(level);
    }
  };

  const getOptionStyle = (index: number) => {
    if (!showResult) {
      return selectedIndex === index
        ? 'border-red-500 bg-red-500/10 text-foreground'
        : 'border-border bg-card hover:border-muted-foreground text-muted-foreground hover:text-foreground';
    }

    if (index === question.correctIndex) {
      return 'border-green-500 bg-green-500/10 text-green-300';
    }
    if (index === selectedIndex && index !== question.correctIndex) {
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
              <div className="flex items-start gap-2">
                <HelpCircle size={16} className="mt-0.5 flex-shrink-0" />
                <span>{question.hints.find(h => h.level === showHint)?.text}</span>
              </div>
              <p className="text-xs text-yellow-500/70 mt-1">
                -{Math.round((question.hints.find(h => h.level === showHint)?.penalty || 0) * 100)}% points
              </p>
            </div>
          )}
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => (
          <button
            key={index}
            onClick={() => !showResult && onSelect(index)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-xl border transition-all ${getOptionStyle(index)}`}
          >
            <div className="flex items-center gap-3">
              <span
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  showResult && index === question.correctIndex
                    ? 'bg-green-500/30 text-green-400'
                    : showResult && index === selectedIndex && index !== question.correctIndex
                    ? 'bg-red-500/30 text-red-400'
                    : 'bg-muted text-muted-foreground'
                }`}
              >
                {showResult && index === question.correctIndex ? (
                  <CheckCircle size={14} />
                ) : showResult && index === selectedIndex ? (
                  <XCircle size={14} />
                ) : (
                  String.fromCharCode(65 + index)
                )}
              </span>
              <span className="text-sm">{option}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Explanation */}
      {showResult && (
        <div
          className={`p-4 rounded-xl border ${
            selectedIndex === question.correctIndex
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {selectedIndex === question.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-sm opacity-80">{question.explanation}</p>
          {question.references && question.references.length > 0 && (
            <div className="mt-2 text-xs text-muted-foreground">
              References: {question.references.map(r => `${r.standard}${r.section ? ` ${r.section}` : ''}`).join(', ')}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
