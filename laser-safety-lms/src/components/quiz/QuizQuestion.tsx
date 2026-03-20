'use client';

import { QuizQuestion as QuizQuestionType } from '@/types';
import { CheckCircle, XCircle } from 'lucide-react';

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionNumber: number;
  totalQuestions: number;
  selectedIndex: number | null;
  onSelect: (index: number) => void;
  showResult: boolean;
}

export default function QuizQuestion({
  question,
  questionNumber,
  totalQuestions,
  selectedIndex,
  onSelect,
  showResult,
}: QuizQuestionProps) {
  return (
    <div className="space-y-5">
      {/* Progress */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className="flex-1 bg-muted rounded-full h-1.5">
          <div
            className="bg-red-500 h-1.5 rounded-full transition-all"
            style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <h2 className="text-foreground text-lg font-medium leading-relaxed">{question.question}</h2>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          let style = 'border-border bg-card hover:border-muted-foreground text-muted-foreground hover:text-foreground cursor-pointer';
          if (showResult) {
            if (index === question.correctIndex) {
              style = 'border-green-500 bg-green-500/10 text-green-300 cursor-default';
            } else if (index === selectedIndex && index !== question.correctIndex) {
              style = 'border-red-500 bg-red-500/10 text-red-300 cursor-default';
            } else {
              style = 'border-border/50 bg-card/50 text-muted-foreground/60 cursor-default';
            }
          } else if (selectedIndex === index) {
            style = 'border-red-500 bg-red-500/10 text-foreground cursor-pointer';
          }

          return (
            <button
              key={index}
              onClick={() => !showResult && onSelect(index)}
              className={`w-full text-left p-4 rounded-xl border transition-all ${style}`}
            >
              <div className="flex items-center gap-3">
                <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                  showResult && index === question.correctIndex ? 'bg-green-500/30 text-green-400'
                  : showResult && index === selectedIndex && index !== question.correctIndex ? 'bg-red-500/30 text-red-400'
                  : 'bg-muted text-muted-foreground'
                }`}>
                  {showResult && index === question.correctIndex ? <CheckCircle size={14} /> :
                   showResult && index === selectedIndex ? <XCircle size={14} /> :
                   String.fromCharCode(65 + index)}
                </span>
                <span className="text-sm">{option}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Explanation */}
      {showResult && (
        <div className={`p-4 rounded-xl border ${
          selectedIndex === question.correctIndex
            ? 'bg-green-500/10 border-green-500/30 text-green-300'
            : 'bg-yellow-500/10 border-yellow-500/30 text-yellow-300'
        }`}>
          <p className="text-sm font-medium mb-1">
            {selectedIndex === question.correctIndex ? '✓ Correct!' : '✗ Incorrect'}
          </p>
          <p className="text-sm opacity-80">{question.explanation}</p>
        </div>
      )}
    </div>
  );
}
