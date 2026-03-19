'use client';

import { Course } from '@/types';
import CourseCard from '@/components/course/CourseCard';

interface CourseGridProps {
  courses: Course[];
  filter?: string;
}

export default function CourseGrid({ courses, filter }: CourseGridProps) {
  const filtered = filter
    ? courses.filter(
        c =>
          c.title.toLowerCase().includes(filter.toLowerCase()) ||
          c.category.toLowerCase().includes(filter.toLowerCase()) ||
          c.description.toLowerCase().includes(filter.toLowerCase())
      )
    : courses;

  if (filtered.length === 0) {
    return (
      <div className="text-center py-16 text-gray-500">
        <p className="text-lg">No courses found matching &ldquo;{filter}&rdquo;</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {filtered.map(course => (
        <CourseCard key={course.id} course={course} />
      ))}
    </div>
  );
}
