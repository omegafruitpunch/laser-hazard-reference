'use client';

import { useState } from 'react';
import { QuizQuestion as QuizQuestionType } from '@/types';
import { saveQuizResult } from '@/lib/progress';
import QuizQuestion from './QuizQuestion';
import QuizResults from './QuizResults';

interface QuizEngineProps {
  courseId: string;
  courseTitle: string;
  questions: QuizQuestionType[];
}

type Phase = 'quiz' | 'results';

export default function QuizEngine({ courseId, courseTitle, questions }: QuizEngineProps) {
  const [phase, setPhase] = useState<Phase>('quiz');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null));
  const [showResult, setShowResult] = useState(false);

  const current = questions[currentIndex];
  const selected = answers[currentIndex];

  const handleSelect = (optionIndex: number) => {
    if (showResult) return;
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
    setShowResult(true);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowResult(false);
    } else {
      // Calculate score and finish
      const score = answers.reduce<number>((acc, answer, i) => {
        return answer === questions[i].correctIndex ? acc + 1 : acc;
      }, 0);
      const passed = score / questions.length >= 0.7;
      saveQuizResult(courseId, score, passed);
      setPhase('results');
    }
  };

  const handleRetry = () => {
    setPhase('quiz');
    setCurrentIndex(0);
    setAnswers(Array(questions.length).fill(null));
    setShowResult(false);
  };

  if (phase === 'results') {
    const score = answers.reduce<number>((acc, answer, i) => {
      return answer === questions[i].correctIndex ? acc + 1 : acc;
    }, 0);
    const passed = score / questions.length >= 0.7;
    return (
      <QuizResults
        courseId={courseId}
        courseTitle={courseTitle}
        score={score}
        total={questions.length}
        passed={passed}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div className="space-y-6">
      <QuizQuestion
        question={current}
        questionNumber={currentIndex + 1}
        totalQuestions={questions.length}
        selectedIndex={selected}
        onSelect={handleSelect}
        showResult={showResult}
      />

      {showResult && (
        <button
          onClick={handleNext}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-colors"
        >
          {currentIndex < questions.length - 1 ? 'Next Question →' : 'See Results →'}
        </button>
      )}
    </div>
  );
}
