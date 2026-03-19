'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/data/courses';
import { getCourseProgress } from '@/lib/progress';
import ModuleList from '@/components/course/ModuleList';
import Link from 'next/link';
import { Clock, BookOpen, BarChart3, Presentation, PlayCircle, Award } from 'lucide-react';

const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-400',
  Intermediate: 'bg-yellow-500/20 text-yellow-400',
  Advanced: 'bg-red-500/20 text-red-400',
};

export default function CourseOverviewPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const course = getCourseById(courseId);
  if (!course) notFound();

  const progress = getCourseProgress(courseId);
  const completed = progress.completedModules.length;
  const total = course.modules.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const allComplete = completed === total;

  const firstIncomplete = course.modules.find(m => !progress.completedModules.includes(m.id));
  const nextModule = firstIncomplete ?? course.modules[0];

  return (
    <div className="space-y-6">
      {/* Hero */}
      <div className={`bg-gradient-to-br ${course.coverColor} rounded-2xl p-8 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent_60%)]" />
        <div className="relative">
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <span className="text-5xl mb-4 block">{course.icon}</span>
              <p className="text-white/70 text-sm uppercase tracking-wider mb-2">{course.category}</p>
              <h1 className="text-white text-3xl font-bold mb-3">{course.title}</h1>
              <p className="text-white/80 max-w-2xl">{course.description}</p>
            </div>

            <div className="flex flex-col gap-2 flex-shrink-0">
              <Link
                href={`/present/${courseId}`}
                className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-xl transition-colors"
              >
                <Presentation size={15} />
                Present Mode
              </Link>
              {progress.quizPassed && (
                <Link
                  href={`/certificate?courseId=${courseId}`}
                  className="flex items-center gap-2 bg-yellow-500/30 hover:bg-yellow-500/40 backdrop-blur-sm text-white text-sm px-4 py-2 rounded-xl transition-colors"
                >
                  <Award size={15} />
                  Get Certificate
                </Link>
              )}
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4 mt-6 flex-wrap">
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <BookOpen size={14} />
              {total} modules
            </div>
            <div className="flex items-center gap-1.5 text-white/80 text-sm">
              <Clock size={14} />
              {course.totalMinutes} min
            </div>
            <div className={`flex items-center gap-1.5 text-sm px-2 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}>
              <BarChart3 size={12} />
              {course.difficulty}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Module list */}
        <div className="lg:col-span-2">
          <h2 className="text-white font-semibold text-lg mb-4">Modules</h2>
          <ModuleList courseId={courseId} modules={course.modules} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Progress */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-3">Course Progress</h3>
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-gray-400">{completed}/{total} modules</span>
              <span className="text-white font-bold">{percent}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-2 mb-4">
              <div
                className={`h-2 rounded-full bg-gradient-to-r ${course.coverColor} transition-all`}
                style={{ width: `${percent}%` }}
              />
            </div>

            {/* Quiz status */}
            {progress.quizPassed !== undefined && (
              <div className={`text-xs px-3 py-2 rounded-lg mb-3 ${
                progress.quizPassed
                  ? 'bg-green-500/20 text-green-400'
                  : 'bg-red-500/20 text-red-400'
              }`}>
                Quiz: {progress.quizPassed ? `Passed (${progress.quizScore}/${total <= 10 ? 8 : 10} correct)` : 'Not passed yet'}
              </div>
            )}

            {/* CTA */}
            <Link
              href={`/courses/${courseId}/${nextModule.id}`}
              className={`flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm transition-colors text-white bg-gradient-to-r ${course.coverColor} hover:opacity-90`}
            >
              <PlayCircle size={16} />
              {percent === 0 ? 'Start Course' : allComplete ? 'Review Course' : 'Continue Learning'}
            </Link>

            {allComplete && (
              <Link
                href={`/quiz/${courseId}`}
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm mt-2 bg-red-600 hover:bg-red-700 text-white transition-colors"
              >
                Take the Quiz →
              </Link>
            )}
          </div>

          {/* What you'll learn */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <h3 className="text-white font-medium mb-3">What You&apos;ll Learn</h3>
            <ul className="space-y-2">
              {course.modules.slice(0, 5).map(m => (
                <li key={m.id} className="flex gap-2 text-sm text-gray-400">
                  <span className="text-red-500 flex-shrink-0">•</span>
                  {m.title}
                </li>
              ))}
              {course.modules.length > 5 && (
                <li className="text-xs text-gray-600">+{course.modules.length - 5} more modules</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
