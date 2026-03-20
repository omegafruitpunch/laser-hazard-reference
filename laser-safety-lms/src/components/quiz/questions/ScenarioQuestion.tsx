'use client';

import { useState } from 'react';
import { ScenarioQuestion as ScenarioQuestionType } from '@/types/quiz';
import { CheckCircle, XCircle, AlertTriangle, Lightbulb } from 'lucide-react';

interface ScenarioQuestionProps {
  question: ScenarioQuestionType;
  selectedBranch: string | null;
  onSelect: (branchId: string) => void;
  showResult: boolean;
  onUseHint?: (level: number) => void;
  hintsUsed?: number[];
}

export default function ScenarioQuestion({
  question,
  selectedBranch,
  onSelect,
  showResult,
  onUseHint,
  hintsUsed = [],
}: ScenarioQuestionProps) {
  const [showHint, setShowHint] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleHintClick = (level: number) => {
    if (!hintsUsed.includes(level)) {
      onUseHint?.(level);
      setShowHint(level);
    }
  };

  const handleBranchSelect = (branchId: string) => {
    if (showResult) return;
    onSelect(branchId);
    setShowFeedback(true);
  };

  const getBranchStyle = (branchId: string) => {
    const branch = question.branches.find(b => b.id === branchId);
    if (!branch) return '';

    if (!showResult) {
      return selectedBranch === branchId
        ? 'border-red-500 bg-red-500/10 text-foreground'
        : 'border-border bg-card hover:border-muted-foreground text-muted-foreground hover:text-foreground';
    }

    if (branch.isCorrect) {
      return 'border-green-500 bg-green-500/10 text-green-300';
    }
    if (selectedBranch === branchId && !branch.isCorrect) {
      return 'border-red-500 bg-red-500/10 text-red-300';
    }
    return 'border-border/50 bg-card/50 text-muted-foreground/60';
  };

  const selectedBranchData = selectedBranch
    ? question.branches.find(b => b.id === selectedBranch)
    : null;

  return (
    <div className="space-y-5">
      {/* Scenario Context */}
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
        <div className="flex items-start gap-3">
          <AlertTriangle size={20} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="text-amber-400 font-medium mb-1">Scenario</h3>
            <p className="text-foreground/80 text-sm leading-relaxed">{question.context}</p>
          </div>
        </div>
      </div>

      {/* Question */}
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

      {/* Branch Options */}
      <div className="space-y-3">
        {question.branches.map((branch) => (
          <button
            key={branch.id}
            onClick={() => handleBranchSelect(branch.id)}
            disabled={showResult}
            className={`w-full text-left p-4 rounded-xl border transition-all ${getBranchStyle(branch.id)}`}
          >
            <div className="flex items-start gap-3">
              <span className="flex-shrink-0 mt-0.5">
                {showResult ? (
                  branch.isCorrect ? (
                    <CheckCircle size={18} className="text-green-400" />
                  ) : selectedBranch === branch.id ? (
                    <XCircle size={18} className="text-red-400" />
                  ) : (
                    <div className="w-[18px] h-[18px] rounded-full border-2 border-muted-foreground/60" />
                  )
                ) : selectedBranch === branch.id ? (
                  <CheckCircle size={18} className="text-red-400" />
                ) : (
                  <div className="w-[18px] h-[18px] rounded-full border-2 border-muted-foreground/60" />
                )}
              </span>
              <span className="text-sm leading-relaxed">{branch.text}</span>
            </div>
          </button>
        ))}
      </div>

      {/* Branch Feedback */}
      {showFeedback && selectedBranchData && (
        <div
          className={`p-4 rounded-xl border ${
            selectedBranchData.isCorrect
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
          }`}
        >
          <p className="text-sm font-medium mb-1">
            {selectedBranchData.isCorrect ? '✓ Good Choice!' : 'Consider this...'}
          </p>
          <p className="text-sm opacity-80">{selectedBranchData.feedback}</p>
        </div>
      )}

      {/* Overall Explanation */}
      {showResult && (
        <div className="p-4 rounded-xl border bg-muted/50 border-border">
          <p className="text-sm text-foreground/80">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
