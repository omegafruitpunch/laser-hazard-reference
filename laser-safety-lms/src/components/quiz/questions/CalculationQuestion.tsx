'use client';

import { useState } from 'react';
import { CalculationQuestion as CalculationQuestionType } from '@/types/quiz';
import { CheckCircle, XCircle, Calculator, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';

interface CalculationQuestionProps {
  question: CalculationQuestionType;
  answer: number | null;
  onChange: (value: number | null) => void;
  showResult: boolean;
  onUseHint?: (level: number) => void;
  hintsUsed?: number[];
}

export default function CalculationQuestion({
  question,
  answer,
  onChange,
  showResult,
  onUseHint,
  hintsUsed = [],
}: CalculationQuestionProps) {
  const [showHint, setShowHint] = useState<number | null>(null);
  const [showSteps, setShowSteps] = useState(false);
  const [inputValue, setInputValue] = useState(answer !== null ? String(answer) : '');

  const handleHintClick = (level: number) => {
    if (!hintsUsed.includes(level)) {
      onUseHint?.(level);
      setShowHint(level);
    }
  };

  const handleInputChange = (value: string) => {
    setInputValue(value);
    const numValue = parseFloat(value);
    onChange(isNaN(numValue) ? null : numValue);
  };

  const getResultStyle = () => {
    if (!showResult || answer === null) return '';

    const diff = Math.abs(answer - question.correctAnswer);
    const toleranceValue = Math.abs(question.correctAnswer) * (question.tolerance / 100);

    if (diff <= toleranceValue) {
      return 'border-green-500 bg-green-500/10 text-green-300';
    }
    if (diff <= toleranceValue * 2) {
      return 'border-yellow-500 bg-yellow-500/10 text-yellow-300';
    }
    return 'border-red-500 bg-red-500/10 text-red-300';
  };

  const getResultMessage = () => {
    if (!showResult || answer === null) return null;

    const diff = Math.abs(answer - question.correctAnswer);
    const toleranceValue = Math.abs(question.correctAnswer) * (question.tolerance / 100);

    if (diff <= toleranceValue) {
      return { type: 'success', message: '✓ Correct!' };
    }
    if (diff <= toleranceValue * 2) {
      return { type: 'partial', message: '△ Close! Partial credit awarded.' };
    }
    return { type: 'error', message: '✗ Incorrect' };
  };

  const result = getResultMessage();

  return (
    <div className="space-y-5">
      {/* Question Text */}
      <h2 className="text-foreground text-lg font-medium leading-relaxed">{question.text}</h2>

      {/* Variables */}
      {question.variables.length > 0 && (
        <div className="bg-muted/50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-muted-foreground mb-3">Given Information:</h3>
          <div className="grid grid-cols-2 gap-3">
            {question.variables.map((variable) => (
              <div key={variable.name} className="flex items-center justify-between bg-card rounded px-3 py-2">
                <span className="text-sm text-muted-foreground">{variable.name}</span>
                <span className="text-sm font-mono text-foreground">
                  {variable.displayValue} {variable.unit}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Formula (if shown) */}
      {question.showFormula && question.formula && (
        <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-1">
            <Calculator size={14} className="text-blue-400" />
            <span className="text-xs text-blue-400 uppercase tracking-wider">Formula</span>
          </div>
          <code className="text-sm text-blue-300 font-mono">{question.formula}</code>
        </div>
      )}

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

      {/* Answer Input */}
      <div className="space-y-2">
        <label className="text-sm text-muted-foreground">Your Answer:</label>
        <div className="flex items-center gap-3">
          <input
            type="number"
            step="any"
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            disabled={showResult}
            placeholder="Enter your answer"
            className={`flex-1 px-4 py-3 bg-card border rounded-xl outline-none transition-colors ${
              showResult
                ? getResultStyle()
                : 'border-border text-foreground focus:border-red-500 focus:ring-1 focus:ring-red-500'
            }`}
          />
          <span className="text-muted-foreground font-medium">{question.unit}</span>
        </div>
        <p className="text-xs text-muted-foreground">Tolerance: ±{question.tolerance}%</p>
      </div>

      {/* Result */}
      {showResult && result && (
        <div
          className={`p-4 rounded-xl border ${
            result.type === 'success'
              ? 'bg-green-500/10 border-green-500/30 text-green-300'
              : result.type === 'partial'
              ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          <p className="text-sm font-medium mb-1">{result.message}</p>
          <p className="text-sm opacity-80">
            Your answer: <strong>{answer !== null ? answer.toFixed(4) : 'N/A'}</strong> {question.unit}
          </p>
          <p className="text-sm opacity-80">
            Correct answer: <strong>{question.correctAnswer.toFixed(4)}</strong> {question.unit}
          </p>
          <p className="text-sm opacity-80 mt-2">{question.explanation}</p>
        </div>
      )}

      {/* Calculation Steps */}
      {showResult && question.steps.length > 0 && (
        <div className="mt-4">
          <button
            onClick={() => setShowSteps(!showSteps)}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            {showSteps ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            {showSteps ? 'Hide' : 'Show'} Calculation Steps
          </button>

          {showSteps && (
            <div className="mt-3 space-y-3 bg-muted/30 rounded-lg p-4">
              {question.steps.map((step, index) => (
                <div key={index} className="space-y-1">
                  <p className="text-sm text-muted-foreground">Step {index + 1}: {step.description}</p>
                  <code className="block text-sm text-blue-300 font-mono bg-card rounded px-3 py-2">
                    {step.formula}
                  </code>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
