'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Lightbulb } from 'lucide-react';

interface InlineKnowledgeCheckProps {
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
  onAnswer?: (isCorrect: boolean) => void;
}

export default function InlineKnowledgeCheck({
  question,
  options,
  correctAnswer,
  explanation,
  hint,
  onAnswer,
}: InlineKnowledgeCheckProps) {
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showHint, setShowHint] = useState(false);

  const handleSelect = (index: number) => {
    if (showResult) return;
    setSelectedAnswer(index);
  };

  const handleCheck = () => {
    if (selectedAnswer === null) return;
    setShowResult(true);
    onAnswer?.(selectedAnswer === correctAnswer);
  };

  const handleReset = () => {
    setSelectedAnswer(null);
    setShowResult(false);
    setShowHint(false);
  };

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <Card className="my-6 border-l-4 border-l-blue-500 bg-blue-500/10">
      <CardContent className="p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded">
            Quick Check
          </span>
        </div>

        <p className="font-medium text-foreground mb-4">{question}</p>

        <div className="space-y-2 mb-4">
          {options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleSelect(index)}
              disabled={showResult}
              className={`w-full text-left p-3 rounded-lg border transition-all ${
                selectedAnswer === index
                  ? showResult
                    ? isCorrect
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : 'bg-blue-100 border-blue-500'
                  : showResult && index === correctAnswer
                  ? 'bg-green-100 border-green-500'
                  : 'bg-card border-border hover:border-blue-500/50'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground">
                  {String.fromCharCode(65 + index)}.
                </span>
                <span className="flex-1">{option}</span>
                {showResult && index === correctAnswer && (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                )}
                {showResult && selectedAnswer === index && !isCorrect && (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
              </div>
            </button>
          ))}
        </div>

        {/* Hint Button */}
        {hint && !showResult && (
          <button
            onClick={() => setShowHint(!showHint)}
            className="flex items-center gap-1.5 text-sm text-amber-600 hover:text-amber-700 mb-3"
          >
            <Lightbulb className="w-4 h-4" />
            {showHint ? 'Hide Hint' : 'Need a Hint?'}
          </button>
        )}

        {showHint && hint && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4 text-sm text-amber-800">
            💡 {hint}
          </div>
        )}

        {/* Check Answer Button */}
        {!showResult ? (
          <Button
            onClick={handleCheck}
            disabled={selectedAnswer === null}
            className="w-full"
          >
            Check Answer
          </Button>
        ) : (
          <div className="space-y-3">
            <div
              className={`p-3 rounded-lg ${
                isCorrect
                  ? 'bg-green-100 border border-green-200'
                  : 'bg-red-50 border border-red-200'
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                {isCorrect ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">Correct!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span className="font-semibold text-red-800">Not quite</span>
                  </>
                )}
              </div>
              <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                {explanation}
              </p>
            </div>
            <Button onClick={handleReset} variant="outline" className="w-full">
              Try Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
