'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/data/courses';
import { getQuizByCourseId } from '@/data/quizzes';
import QuizEngine from '@/components/quiz/QuizEngine';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import type { QuizBank, Question } from '@/types/quiz';

export default function QuizPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const course = getCourseById(courseId);
  if (!course) notFound();

  const questions = getQuizByCourseId(courseId);
  if (questions.length === 0) notFound();

  const quizBank: QuizBank = {
    id: `${courseId}-quiz`,
    courseId,
    title: `${course.title} Quiz`,
    description: `Test your knowledge of ${course.title}`,
    assessmentType: 'course_exam',
    totalQuestions: questions.length,
    passingScore: 70,
    timeLimitMinutes: questions.length * 2,
    categories: {},
    questions: questions.map((q, i): Question => {
      const baseQuestion = {
        id: q.id || `q-${i}`,
        text: q.question,
        explanation: q.explanation,
        points: 1,
        difficulty: 'intermediate' as const,
        competencyArea: 'fundamentals' as const,
        tags: [courseId],
        hints: [],
      };
      
    if (q.type === 'true_false') {
        return {
          ...baseQuestion,
          type: 'true_false' as const,
          correctAnswer: q.correctIndex === 0,
        } as Question;
      }
      
      if (q.type === 'multiple_select') {
        return {
          ...baseQuestion,
          type: 'multi_select' as const,
          options: q.options,
          correctIndices: q.correctIndices || [q.correctIndex],
          requireAllCorrect: true,
        } as Question;
      }
      
      return {
        ...baseQuestion,
        type: 'multiple_choice' as const,
        options: q.options,
        correctIndex: q.correctIndex,
      } as Question;
    }),
    retakePolicy: {
      allowed: true,
      maxAttempts: 3,
      cooldownHours: 24,
    },
    randomizeQuestions: true,
    randomizeOptions: true,
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <Link
          href={`/courses/${courseId}`}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-white transition-colors mb-4"
        >
          <ChevronLeft size={14} />
          Back to {course.title}
        </Link>

        <div className={`bg-gradient-to-r ${course.coverColor} rounded-xl p-5 relative overflow-hidden mb-2`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent_60%)]" />
          <div className="relative">
            <span className="text-3xl">{course.icon}</span>
            <h1 className="text-white font-bold text-xl mt-2">{course.title}</h1>
            <p className="text-white/70 text-sm">{questions.length} questions · 70% to pass</p>
          </div>
        </div>
      </div>

      {/* Quiz */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <QuizEngine
          quizBank={quizBank}
        />
      </div>
    </div>
  );
}
