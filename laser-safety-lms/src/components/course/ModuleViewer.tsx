'use client';

import { useState } from 'react';
import { Module, Course } from '@/types';
import { markModuleComplete, isModuleComplete } from '@/lib/progress';
import PDFViewer from '@/components/pdf/PDFViewer';
import Link from 'next/link';
import { CheckCircle, ChevronLeft, ChevronRight, Lightbulb, BookOpen } from 'lucide-react';

interface ModuleViewerProps {
  course: Course;
  module: Module;
  prevModuleId?: string;
  nextModuleId?: string;
}

export default function ModuleViewer({ course, module, prevModuleId, nextModuleId }: ModuleViewerProps) {
  const [completed, setCompleted] = useState(() => isModuleComplete(course.id, module.id));
  const [showTakeaways, setShowTakeaways] = useState(false);

  const handleMarkComplete = () => {
    markModuleComplete(course.id, module.id);
    setCompleted(true);
  };

  const allModulesComplete = course.modules.every(m => isModuleComplete(course.id, m.id));

  return (
    <div className="flex flex-col gap-4">
      {/* Breadcrumb + nav */}
      <div className="flex items-center justify-between">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/courses" className="hover:text-white transition-colors">Courses</Link>
          <span>/</span>
          <Link href={`/courses/${course.id}`} className="hover:text-white transition-colors truncate max-w-[200px]">
            {course.title}
          </Link>
          <span>/</span>
          <span className="text-gray-300 truncate max-w-[200px]">{module.title}</span>
        </nav>
      </div>

      {/* Module header */}
      <div className={`bg-gradient-to-r ${course.coverColor} rounded-xl p-5 relative overflow-hidden`}>
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_20%_50%,white,transparent_70%)]" />
        <div className="relative flex items-start justify-between gap-4">
          <div>
            <p className="text-white/70 text-xs uppercase tracking-wider mb-1">{course.title}</p>
            <h1 className="text-white font-bold text-xl">{module.title}</h1>
            <p className="text-white/80 text-sm mt-1">{module.description}</p>
          </div>
          {completed && (
            <div className="flex-shrink-0 flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5">
              <CheckCircle size={14} className="text-white" />
              <span className="text-white text-xs font-medium">Complete</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* PDF viewer — main column */}
        <div className="lg:col-span-2" style={{ minHeight: '650px' }}>
          <PDFViewer pdfPath={module.pdfPath} title={module.title} />
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Key Takeaways */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4">
            <button
              onClick={() => setShowTakeaways(!showTakeaways)}
              className="w-full flex items-center justify-between text-left"
            >
              <div className="flex items-center gap-2">
                <Lightbulb size={16} className="text-yellow-400" />
                <span className="text-white font-medium text-sm">Key Takeaways</span>
              </div>
              <span className="text-gray-600 text-xs">{showTakeaways ? '▲' : '▼'}</span>
            </button>
            {showTakeaways && (
              <ul className="mt-3 space-y-2">
                {module.keyTakeaways.map((point, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-400">
                    <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Module info */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 text-sm text-gray-400">
              <BookOpen size={14} className="text-gray-600" />
              <span>Estimated: {module.estimatedMinutes} minutes</span>
            </div>
          </div>

          {/* Complete button */}
          {!completed ? (
            <button
              onClick={handleMarkComplete}
              className={`w-full py-3 rounded-xl font-semibold text-sm transition-all bg-gradient-to-r ${course.coverColor} text-white hover:opacity-90 active:scale-95`}
            >
              Mark as Complete ✓
            </button>
          ) : (
            <div className="w-full py-3 rounded-xl font-semibold text-sm text-center bg-green-500/20 border border-green-500/30 text-green-400">
              ✓ Module Completed
            </div>
          )}

          {/* If all modules done, show quiz CTA */}
          {allModulesComplete && (
            <Link
              href={`/quiz/${course.id}`}
              className="block w-full py-3 rounded-xl font-semibold text-sm text-center bg-red-600 hover:bg-red-700 text-white transition-colors"
            >
              Take the Quiz →
            </Link>
          )}
        </div>
      </div>

      {/* Module navigation */}
      <div className="flex items-center justify-between pt-2">
        {prevModuleId ? (
          <Link
            href={`/courses/${course.id}/${prevModuleId}`}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors bg-gray-900 border border-gray-800 hover:border-gray-600 px-4 py-2 rounded-lg"
          >
            <ChevronLeft size={16} />
            Previous Module
          </Link>
        ) : (
          <div />
        )}

        {nextModuleId ? (
          <Link
            href={`/courses/${course.id}/${nextModuleId}`}
            className="flex items-center gap-2 text-sm text-white bg-gray-900 border border-gray-800 hover:border-gray-600 hover:text-red-400 px-4 py-2 rounded-lg transition-colors"
          >
            Next Module
            <ChevronRight size={16} />
          </Link>
        ) : (
          <Link
            href={`/courses/${course.id}`}
            className="flex items-center gap-2 text-sm text-white bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
          >
            Back to Course
            <ChevronRight size={16} />
          </Link>
        )}
      </div>
    </div>
  );
}
