'use client';

import { useState } from 'react';
import { MatchingQuestion as MatchingQuestionType, MatchingPair } from '@/types/quiz';
import { CheckCircle, XCircle, ArrowRight, Lightbulb } from 'lucide-react';

interface MatchingQuestionProps {
  question: MatchingQuestionType;
  matches: Record<string, string>;
  onChange: (matches: Record<string, string>) => void;
  showResult: boolean;
  onUseHint?: (level: number) => void;
  hintsUsed?: number[];
}

export default function MatchingQuestion({
  question,
  matches,
  onChange,
  showResult,
  onUseHint,
  hintsUsed = [],
}: MatchingQuestionProps) {
  const [showHint, setShowHint] = useState<number | null>(null);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);

  const handleHintClick = (level: number) => {
    if (!hintsUsed.includes(level)) {
      onUseHint?.(level);
      setShowHint(level);
    }
  };

  const handleLeftSelect = (leftId: string) => {
    if (showResult) return;
    setSelectedLeft(selectedLeft === leftId ? null : leftId);
  };

  const handleRightSelect = (rightId: string) => {
    if (showResult || !selectedLeft) return;
    
    const newMatches = { ...matches };
    
    // Remove any existing match for this left item
    Object.keys(newMatches).forEach(key => {
      if (newMatches[key] === rightId) {
        delete newMatches[key];
      }
    });
    
    // Add new match
    newMatches[selectedLeft] = rightId;
    onChange(newMatches);
    setSelectedLeft(null);
  };

  const handleRemoveMatch = (leftId: string) => {
    if (showResult) return;
    const newMatches = { ...matches };
    delete newMatches[leftId];
    onChange(newMatches);
  };

  const getLeftStyle = (pair: MatchingPair) => {
    const isMatched = matches[pair.leftId];
    const isCorrect = matches[pair.leftId] === pair.rightId;
    const isSelected = selectedLeft === pair.leftId;

    if (!showResult) {
      if (isSelected) return 'border-red-500 bg-red-500/10 text-foreground';
      if (isMatched) return 'border-green-500/50 bg-green-500/5 text-green-500';
      return 'border-border bg-card hover:border-muted-foreground text-muted-foreground';
    }

    if (isCorrect) {
      return 'border-green-500 bg-green-500/10 text-green-300';
    }
    if (isMatched) {
      return 'border-red-500 bg-red-500/10 text-red-300';
    }
    return 'border-border/50 bg-card/50 text-muted-foreground/60';
  };

  const getRightStyle = (rightId: string) => {
    const isMatched = Object.values(matches).includes(rightId);
    const isCorrectMatch = question.pairs.some(p => p.rightId === rightId && matches[p.leftId] === rightId);

    if (!showResult) {
      if (isMatched) return 'border-green-500/50 bg-green-500/5 text-green-500 opacity-50';
      if (selectedLeft) return 'border-yellow-500/50 bg-yellow-500/10 text-yellow-500 hover:border-yellow-500 cursor-pointer';
      return 'border-border bg-card text-muted-foreground';
    }

    if (isCorrectMatch) {
      return 'border-green-500 bg-green-500/10 text-green-300';
    }
    if (isMatched) {
      return 'border-red-500 bg-red-500/10 text-red-300';
    }
    return 'border-border/50 bg-card/50 text-muted-foreground/60';
  };

  const correctCount = question.pairs.filter(p => matches[p.leftId] === p.rightId).length;
  const isComplete = Object.keys(matches).length === question.pairs.length;

  return (
    <div className="space-y-5">
      {/* Question Text */}
      <div>
        <h2 className="text-foreground text-lg font-medium leading-relaxed">{question.text}</h2>
        <p className="text-sm text-muted-foreground mt-1">
          Match items from the left column with items on the right
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

      {/* Matching Interface */}
      <div className="grid grid-cols-2 gap-4">
        {/* Left Column */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {question.leftLabel || 'Items'}
          </h3>
          {question.pairs.map((pair) => (
            <button
              key={pair.leftId}
              onClick={() => handleLeftSelect(pair.leftId)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg border transition-all ${getLeftStyle(pair)}`}
            >
              <div className="flex items-center justify-between">
                <span className="text-sm">{pair.left}</span>
                {matches[pair.leftId] && !showResult && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveMatch(pair.leftId);
                    }}
                    className="text-xs text-red-400 hover:text-red-300"
                  >
                    Remove
                  </button>
                )}
              </div>
              {matches[pair.leftId] && (
                <div className="mt-2 flex items-center gap-2 text-xs">
                  <ArrowRight size={12} />
                  <span className={showResult && matches[pair.leftId] !== pair.rightId ? 'text-red-400' : 'text-green-400'}>
                    {question.pairs.find(p => p.rightId === matches[pair.leftId])?.right}
                  </span>
                </div>
              )}
            </button>
          ))}
        </div>

        {/* Right Column */}
        <div className="space-y-2">
          <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            {question.rightLabel || 'Matches'}
          </h3>
          {question.pairs.map((pair) => (
            <button
              key={pair.rightId}
              onClick={() => handleRightSelect(pair.rightId)}
              disabled={showResult || (!selectedLeft && !Object.values(matches).includes(pair.rightId))}
              className={`w-full text-left p-3 rounded-lg border transition-all ${getRightStyle(pair.rightId)}`}
            >
              <span className="text-sm">{pair.right}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Progress */}
      {!showResult && (
        <div className="text-sm text-muted-foreground">
          Matched: {Object.keys(matches).length} / {question.pairs.length}
          {selectedLeft && ' - Select a match from the right column'}
        </div>
      )}

      {/* Result */}
      {showResult && (
        <div
          className={`p-4 rounded-xl border ${
            correctCount === question.pairs.length
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : correctCount > 0
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {correctCount === question.pairs.length
              ? '✓ Perfect!'
              : `${correctCount} of ${question.pairs.length} correct`}
          </p>
          <p className="text-sm opacity-80">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
