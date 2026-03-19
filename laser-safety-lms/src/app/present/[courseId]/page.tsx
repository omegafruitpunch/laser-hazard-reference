'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/data/courses';
import PresentationSlide from '@/components/presentation/PresentationSlide';

export default function PresentationPage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = use(params);
  const course = getCourseById(courseId);
  if (!course) notFound();

  const [slideIndex, setSlideIndex] = useState(0);
  const totalSlides = course.modules.length;
  const currentModule = course.modules[slideIndex];

  const handlePrev = () => setSlideIndex(i => Math.max(0, i - 1));
  const handleNext = () => setSlideIndex(i => Math.min(totalSlides - 1, i + 1));

  return (
    <PresentationSlide
      course={course}
      module={currentModule}
      slideIndex={slideIndex}
      totalSlides={totalSlides}
      onPrev={handlePrev}
      onNext={handleNext}
    />
  );
}
