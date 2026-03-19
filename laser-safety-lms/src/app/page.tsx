'use client';

import { courses } from '@/data/courses';
import { getOverallStats } from '@/lib/progress';
import StatsBar from '@/components/dashboard/StatsBar';
import ProgressCard from '@/components/dashboard/ProgressCard';
import Link from 'next/link';
import { ArrowRight, Zap } from 'lucide-react';

const totalModules = courses.reduce((sum, c) => sum + c.modules.length, 0);

export default function DashboardPage() {
  const stats = getOverallStats(totalModules, courses.length);

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-900 to-red-950/20 border border-gray-800 rounded-2xl p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(220,38,38,0.15),transparent_60%)]" />
        <div className="relative">
          <div className="flex items-center gap-2 text-red-400 text-sm font-medium mb-3">
            <Zap size={14} />
            <span>Laser Safety Training Platform</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3 leading-tight">
            Welcome to<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-400 to-orange-400">
              Laser Safety LMS
            </span>
          </h1>
          <p className="text-gray-400 max-w-xl mb-6">
            Master FDA compliance, ANSI standards, state regulations, and hands-on laser safety protocols
            across 8 comprehensive courses.
          </p>
          <div className="flex gap-3 flex-wrap">
            <Link
              href="/courses"
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm"
            >
              Browse All Courses
              <ArrowRight size={16} />
            </Link>
            {stats.coursesFinished > 0 && (
              <Link
                href="/certificate"
                className="flex items-center gap-2 bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-xl transition-colors text-sm border border-gray-700"
              >
                View Certificates
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <StatsBar
        completedModules={stats.completedModules}
        totalModules={stats.totalModules}
        coursesFinished={stats.coursesFinished}
        totalCourses={stats.totalCourses}
        overallPercent={stats.overallPercent}
      />

      {/* Progress section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-white font-semibold text-lg">Your Progress</h2>
          <Link href="/courses" className="text-sm text-red-400 hover:text-red-300 transition-colors">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {courses.slice(0, 4).map(course => (
            <ProgressCard key={course.id} course={course} />
          ))}
        </div>
      </div>

      {/* Course tiles */}
      <div>
        <h2 className="text-white font-semibold text-lg mb-4">All Courses</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3">
          {courses.map(course => (
            <Link key={course.id} href={`/courses/${course.id}`} className="group">
              <div className={`bg-gradient-to-br ${course.coverColor} p-3 rounded-xl relative overflow-hidden hover:scale-[1.03] transition-transform aspect-square flex flex-col justify-between`}>
                <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_50%,white,transparent_60%)]" />
                <span className="relative text-2xl">{course.icon}</span>
                <p className="relative text-white font-medium text-xs leading-tight line-clamp-2">{course.title}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
