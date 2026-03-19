'use client';

import { Course } from '@/types';
import { getCourseProgress } from '@/lib/progress';
import Link from 'next/link';
import { CheckCircle, Circle, PlayCircle } from 'lucide-react';

interface ProgressCardProps {
  course: Course;
}

export default function ProgressCard({ course }: ProgressCardProps) {
  const progress = getCourseProgress(course.id);
  const completed = progress.completedModules.length;
  const total = course.modules.length;
  const percent = total > 0 ? Math.round((completed / total) * 100) : 0;
  const passed = progress.quizPassed;

  return (
    <Link href={`/courses/${course.id}`} className="block group">
      <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 hover:border-gray-600 transition-all hover:shadow-lg hover:shadow-black/30">
        <div className="flex items-start gap-3">
          <span className="text-2xl">{course.icon}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-white font-medium text-sm truncate group-hover:text-red-400 transition-colors">
                {course.title}
              </h3>
              {passed && <CheckCircle size={14} className="text-green-500 flex-shrink-0" />}
            </div>

            {/* Progress bar */}
            <div className="w-full bg-gray-800 rounded-full h-1.5 mb-2">
              <div
                className={`h-1.5 rounded-full transition-all bg-gradient-to-r ${course.coverColor}`}
                style={{ width: `${percent}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-xs text-gray-500">
              <span>{completed}/{total} modules</span>
              <span>{percent}%</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
