'use client';

import { Module } from '@/types';
import { isModuleComplete } from '@/lib/progress';
import Link from 'next/link';
import { CheckCircle, Circle, Clock, ChevronRight } from 'lucide-react';

interface ModuleListProps {
  courseId: string;
  modules: Module[];
}

export default function ModuleList({ courseId, modules }: ModuleListProps) {
  return (
    <div className="space-y-2">
      {modules.map((module, index) => {
        const complete = isModuleComplete(courseId, module.id);
        return (
          <Link
            key={module.id}
            href={`/courses/${courseId}/${module.id}`}
            className="group block"
          >
            <div className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
              complete
                ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                : 'bg-gray-900 border-gray-800 hover:border-gray-600'
            }`}>
              {/* Index / check */}
              <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                complete ? 'bg-green-500/20 text-green-400' : 'bg-gray-800 text-gray-500'
              }`}>
                {complete ? <CheckCircle size={16} /> : index + 1}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h4 className={`font-medium text-sm mb-0.5 group-hover:text-red-400 transition-colors ${
                  complete ? 'text-green-300' : 'text-white'
                }`}>
                  {module.title}
                </h4>
                <p className="text-gray-500 text-xs line-clamp-1">{module.description}</p>
              </div>

              {/* Time + arrow */}
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="flex items-center gap-1 text-xs text-gray-600">
                  <Clock size={11} />
                  {module.estimatedMinutes}m
                </span>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-red-400 transition-colors" />
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
