'use client';

import { Course } from '@/types';
import { getCourseProgress } from '@/lib/progress';
import Link from 'next/link';
import { Clock, BookOpen, CheckCircle, ChevronRight } from 'lucide-react';

const difficultyColors = {
  Beginner: 'bg-green-500/20 text-green-400 border-green-500/30',
  Intermediate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  Advanced: 'bg-red-500/20 text-red-400 border-red-500/30',
};

interface CourseCardProps {
  course: Course;
}

export default function CourseCard({ course }: CourseCardProps) {
  const progress = getCourseProgress(course.id);
  const completed = progress.completedModules.length;
  const total = course.modules.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const passed = progress.quizPassed;

  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-600 transition-all hover:shadow-xl hover:shadow-black/40 hover:-translate-y-0.5">
        {/* Card header gradient */}
        <div className={`bg-gradient-to-br ${course.coverColor} p-6 relative overflow-hidden`}>
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
          <div className="relative flex items-start justify-between">
            <span className="text-4xl">{course.icon}</span>
            {passed && (
              <div className="bg-white/20 backdrop-blur-sm rounded-full px-2 py-1 flex items-center gap-1">
                <CheckCircle size={12} className="text-white" />
                <span className="text-white text-xs font-medium">Passed</span>
              </div>
            )}
          </div>
          <div className="relative mt-3">
            <span className="text-white/70 text-xs uppercase tracking-wider">{course.category}</span>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="text-white font-semibold text-base leading-snug group-hover:text-red-400 transition-colors">
              {course.title}
            </h3>
          </div>

          <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
            {course.description}
          </p>

          {/* Meta */}
          <div className="flex items-center gap-3 mb-4 text-xs text-gray-500">
            <span className="flex items-center gap-1">
              <BookOpen size={12} />
              {total} modules
            </span>
            <span className="flex items-center gap-1">
              <Clock size={12} />
              {course.totalMinutes} min
            </span>
            <span className={`border rounded-full px-2 py-0.5 text-xs ${difficultyColors[course.difficulty]}`}>
              {course.difficulty}
            </span>
          </div>

          {/* Progress */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-600">
              <span>{completed}/{total} modules complete</span>
              <span>{percent}%</span>
            </div>
            <div className="w-full bg-gray-800 rounded-full h-1.5">
              <div
                className={`h-1.5 rounded-full bg-gradient-to-r ${course.coverColor} transition-all`}
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>

          {/* CTA */}
          <div className="mt-4 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {percent === 0 ? 'Not started' : percent === 100 ? 'Review course' : 'In progress'}
            </span>
            <span className="flex items-center gap-1 text-red-500 text-xs font-medium group-hover:gap-2 transition-all">
              {percent === 0 ? 'Start' : 'Continue'}
              <ChevronRight size={14} />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
