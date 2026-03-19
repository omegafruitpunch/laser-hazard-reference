'use client';

import Link from 'next/link';
import { Trophy, RotateCcw, Award, ChevronRight } from 'lucide-react';

interface QuizResultsProps {
  courseId: string;
  courseTitle: string;
  score: number;
  total: number;
  passed: boolean;
  onRetry: () => void;
}

export default function QuizResults({
  courseId,
  courseTitle,
  score,
  total,
  passed,
  onRetry,
}: QuizResultsProps) {
  const percent = Math.round((score / total) * 100);

  return (
    <div className="max-w-lg mx-auto text-center space-y-6">
      {/* Icon */}
      <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center ${
        passed ? 'bg-green-500/20 border-2 border-green-500/40' : 'bg-red-500/20 border-2 border-red-500/40'
      }`}>
        {passed
          ? <Trophy size={40} className="text-green-400" />
          : <RotateCcw size={40} className="text-red-400" />
        }
      </div>

      {/* Result text */}
      <div>
        <h2 className={`text-3xl font-bold mb-2 ${passed ? 'text-green-400' : 'text-red-400'}`}>
          {passed ? 'Congratulations!' : 'Keep Practicing'}
        </h2>
        <p className="text-gray-400 text-sm">
          {passed
            ? `You passed the ${courseTitle} quiz!`
            : `You need 70% to pass the ${courseTitle} quiz.`}
        </p>
      </div>

      {/* Score ring */}
      <div className={`inline-flex flex-col items-center justify-center w-32 h-32 rounded-full border-4 ${
        passed ? 'border-green-500/60 bg-green-500/10' : 'border-red-500/60 bg-red-500/10'
      }`}>
        <span className={`text-4xl font-bold ${passed ? 'text-green-400' : 'text-red-400'}`}>
          {percent}%
        </span>
        <span className="text-gray-500 text-xs mt-1">{score}/{total} correct</span>
      </div>

      {/* Actions */}
      <div className="flex flex-col gap-3">
        {passed && (
          <Link
            href={`/certificate?courseId=${courseId}`}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-yellow-600 to-amber-500 hover:opacity-90 text-white font-semibold py-3 px-6 rounded-xl transition-all"
          >
            <Award size={18} />
            Download Certificate
          </Link>
        )}

        <button
          onClick={onRetry}
          className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 text-white py-3 px-6 rounded-xl transition-colors"
        >
          <RotateCcw size={16} />
          {passed ? 'Retake Quiz' : 'Try Again'}
        </button>

        <Link
          href={`/courses/${courseId}`}
          className="flex items-center justify-center gap-2 text-gray-400 hover:text-white text-sm py-2 transition-colors"
        >
          Back to Course
          <ChevronRight size={14} />
        </Link>
      </div>
    </div>
  );
}
