'use client';

import { Card, CardContent } from '@/components/ui/card';
import { ArrowRight, BookOpen, RotateCcw } from 'lucide-react';
import Link from 'next/link';

interface Prerequisite {
  concept: string;
  moduleId: string;
  moduleTitle: string;
}

interface ConceptBridgeProps {
  title?: string;
  message: string;
  prerequisites?: Prerequisite[];
  fromModule?: {
    id: string;
    title: string;
  };
  toModule?: {
    id: string;
    title: string;
  };
  courseId: string;
}

export default function ConceptBridge({
  title = "Concept Connection",
  message,
  prerequisites = [],
  fromModule,
  toModule,
  courseId,
}: ConceptBridgeProps) {
  return (
    <Card className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-blue-500/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-blue-600" />
          </div>
          
          <div className="flex-1">
            <h4 className="font-semibold text-blue-700 dark:text-blue-300 mb-1">{title}</h4>
            <p className="text-sm text-blue-600 dark:text-blue-200 mb-3">{message}</p>

            {/* Prerequisites List */}
            {prerequisites.length > 0 && (
              <div className="mb-3">
                <p className="text-xs font-medium text-blue-600 dark:text-blue-200 mb-2">
                  Key concepts you should know:
                </p>
                <ul className="space-y-1">
                  {prerequisites.map((prereq, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <span className="text-blue-400">•</span>
                      <span className="text-foreground">{prereq.concept}</span>
                      <Link
                        href={`/courses/${courseId}/${prereq.moduleId}`}
                        className="text-xs text-blue-600 dark:text-blue-300 hover:underline flex items-center gap-1"
                      >
                        <BookOpen className="w-3 h-3" />
                        Review
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Module Navigation */}
            <div className="flex items-center gap-3 flex-wrap">
              {fromModule && (
                <Link
                  href={`/courses/${courseId}/${fromModule.id}`}
                  className="text-xs text-blue-600 dark:text-blue-300 hover:text-blue-800 dark:hover:text-blue-100 flex items-center gap-1 px-2 py-1 bg-blue-500/20 rounded"
                >
                  <RotateCcw className="w-3 h-3" />
                  Back to {fromModule.title}
                </Link>
              )}
              {toModule && (
                <Link
                  href={`/courses/${courseId}/${toModule.id}`}
                  className="text-xs text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1 px-2 py-1 rounded"
                >
                  Next: {toModule.title}
                  <ArrowRight className="w-3 h-3" />
                </Link>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Simplified version for use at the beginning of modules
export function ModulePrerequisites({
  concepts,
  courseId,
  previousModuleId,
  previousModuleTitle,
}: {
  concepts: string[];
  courseId: string;
  previousModuleId?: string;
  previousModuleTitle?: string;
}) {
  return (
    <Card className="bg-amber-500/10 border-amber-500/20">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-amber-500/20 rounded-lg flex-shrink-0">
            <BookOpen className="w-5 h-5 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-amber-700 dark:text-amber-300 mb-1">Before You Begin</h4>
            <p className="text-sm text-amber-600 dark:text-amber-200 mb-2">
              This module builds on concepts from previous modules:
            </p>
            <ul className="space-y-1 text-sm text-amber-600 dark:text-amber-200">
              {concepts.map((concept, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{concept}</span>
                </li>
              ))}
            </ul>
            {previousModuleId && previousModuleTitle && (
              <Link
                href={`/courses/${courseId}/${previousModuleId}`}
                className="inline-flex items-center gap-1 mt-3 text-sm text-amber-600 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-100 font-medium"
              >
                <RotateCcw className="w-4 h-4" />
                Review {previousModuleTitle}
              </Link>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
