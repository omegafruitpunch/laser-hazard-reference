'use client';

import { use } from 'react';
import { notFound } from 'next/navigation';
import { getCourseById } from '@/data/courses';
import ModuleViewer from '@/components/course/ModuleViewer';

export default function ModulePage({
  params,
}: {
  params: Promise<{ courseId: string; moduleId: string }>;
}) {
  const { courseId, moduleId } = use(params);
  const course = getCourseById(courseId);
  if (!course) notFound();

  const moduleIndex = course.modules.findIndex(m => m.id === moduleId);
  if (moduleIndex === -1) notFound();

  const module = course.modules[moduleIndex];
  const prevModule = course.modules[moduleIndex - 1];
  const nextModule = course.modules[moduleIndex + 1];

  return (
    <ModuleViewer
      course={course}
      module={module}
      prevModuleId={prevModule?.id}
      nextModuleId={nextModule?.id}
    />
  );
}
