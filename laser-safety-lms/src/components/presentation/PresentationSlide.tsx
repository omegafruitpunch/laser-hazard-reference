'use client';

import { Module, Course } from '@/types';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

interface PresentationSlideProps {
  course: Course;
  module: Module;
  slideIndex: number;
  totalSlides: number;
  onPrev: () => void;
  onNext: () => void;
}

export default function PresentationSlide({
  course,
  module,
  slideIndex,
  totalSlides,
  onPrev,
  onNext,
}: PresentationSlideProps) {
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') onNext();
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') onPrev();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [onNext, onPrev]);

  return (
    <div className="fixed inset-0 bg-black flex flex-col select-none">
      {/* Exit button */}
      <div className="absolute top-4 right-4 z-10">
        <Link
          href={`/courses/${course.id}`}
          className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white text-sm px-3 py-2 rounded-lg backdrop-blur-sm transition-colors"
        >
          <X size={14} />
          Exit
        </Link>
      </div>

      {/* Slide counter */}
      <div className="absolute top-4 left-4 z-10 text-white/40 text-sm">
        {slideIndex + 1} / {totalSlides}
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-8 py-16">
        <div className="max-w-4xl w-full">
          {/* Course label */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-3xl">{course.icon}</span>
            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${course.coverColor} text-sm font-semibold tracking-widest uppercase`}>
              {course.title}
            </span>
          </div>

          {/* Module title */}
          <h1 className="text-white text-4xl lg:text-5xl font-bold leading-tight mb-8">
            {module.title}
          </h1>

          {/* Description */}
          <p className="text-gray-400 text-xl leading-relaxed mb-10">
            {module.description}
          </p>

          {/* Key takeaways as bullets */}
          <div className="space-y-4">
            {module.keyTakeaways.map((point, i) => (
              <div
                key={i}
                className={`flex items-start gap-4 p-4 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm`}
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <span className={`text-transparent bg-clip-text bg-gradient-to-r ${course.coverColor} text-xl font-bold flex-shrink-0`}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <p className="text-gray-200 text-base leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between px-8 py-6">
        <button
          onClick={onPrev}
          disabled={slideIndex === 0}
          className="flex items-center gap-2 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-sm px-4 py-2 rounded-lg hover:bg-white/10"
        >
          <ChevronLeft size={20} />
          Previous
        </button>

        {/* Dot indicators */}
        <div className="flex gap-2">
          {Array.from({ length: totalSlides }).map((_, i) => (
            <div
              key={i}
              className={`rounded-full transition-all ${
                i === slideIndex ? 'w-6 h-2 bg-white' : 'w-2 h-2 bg-white/30'
              }`}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          disabled={slideIndex === totalSlides - 1}
          className="flex items-center gap-2 text-white/60 hover:text-white disabled:opacity-20 disabled:cursor-not-allowed transition-colors text-sm px-4 py-2 rounded-lg hover:bg-white/10"
        >
          Next
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
