'use client';

import { BookOpen, CheckCircle, Trophy, TrendingUp } from 'lucide-react';

interface StatsBarProps {
  completedModules: number;
  totalModules: number;
  coursesFinished: number;
  totalCourses: number;
  overallPercent: number;
}

export default function StatsBar({
  completedModules,
  totalModules,
  coursesFinished,
  totalCourses,
  overallPercent,
}: StatsBarProps) {
  const stats = [
    {
      icon: TrendingUp,
      label: 'Overall Progress',
      value: `${overallPercent}%`,
      color: 'text-blue-400',
      bg: 'bg-blue-400/10',
    },
    {
      icon: BookOpen,
      label: 'Modules Completed',
      value: `${completedModules}/${totalModules}`,
      color: 'text-purple-400',
      bg: 'bg-purple-400/10',
    },
    {
      icon: CheckCircle,
      label: 'Courses Passed',
      value: `${coursesFinished}/${totalCourses}`,
      color: 'text-green-400',
      bg: 'bg-green-400/10',
    },
    {
      icon: Trophy,
      label: 'Certificates Earned',
      value: coursesFinished.toString(),
      color: 'text-yellow-400',
      bg: 'bg-yellow-400/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ icon: Icon, label, value, color, bg }) => (
        <div key={label} className="bg-gray-900 border border-gray-800 rounded-xl p-4">
          <div className={`inline-flex p-2 rounded-lg ${bg} mb-3`}>
            <Icon size={18} className={color} />
          </div>
          <div className="text-2xl font-bold text-white mb-1">{value}</div>
          <div className="text-xs text-gray-500">{label}</div>
        </div>
      ))}
    </div>
  );
}
