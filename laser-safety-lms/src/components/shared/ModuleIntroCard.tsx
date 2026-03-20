'use client';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Clock, BookOpen, Target, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

interface ModuleIntroCardProps {
  title: string;
  description: string;
  estimatedMinutes: number;
  learningObjectives: string[];
  prerequisites?: string[];
  tips?: string[];
  courseColor?: string;
}

export default function ModuleIntroCard({
  title,
  description,
  estimatedMinutes,
  learningObjectives,
  prerequisites = [],
  tips = [],
  courseColor = 'from-red-600 to-orange-500',
}: ModuleIntroCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className={`bg-gradient-to-r ${courseColor} text-white overflow-hidden`}>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-white text-xl font-bold">{title}</CardTitle>
            <CardDescription className="text-white/80 mt-1">{description}</CardDescription>
          </div>
          <div className="flex items-center gap-1.5 bg-white/20 backdrop-blur-sm rounded-full px-3 py-1.5 flex-shrink-0">
            <Clock size={14} className="text-white" />
            <span className="text-white text-sm font-medium">{estimatedMinutes} min</span>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Quick Stats */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1.5">
            <BookOpen size={14} className="text-white/70" />
            <span className="text-white/90">{learningObjectives.length} objectives</span>
          </div>
          {prerequisites.length > 0 && (
            <div className="flex items-center gap-1.5">
              <Target size={14} className="text-white/70" />
              <span className="text-white/90">{prerequisites.length} prerequisite(s)</span>
            </div>
          )}
        </div>

        {/* Expandable Details */}
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="w-full flex items-center justify-between py-2 px-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors"
        >
          <span className="text-sm font-medium">How to Complete This Module</span>
          {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {showDetails && (
          <div className="space-y-4 text-sm">
            {/* Learning Objectives */}
            <div className="bg-white/10 rounded-lg p-3">
              <div className="flex items-center gap-2 mb-2">
                <Target size={14} className="text-white" />
                <span className="font-semibold">Learning Objectives</span>
              </div>
              <ul className="space-y-1 text-white/90">
                {learningObjectives.map((objective, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="text-white/60 mt-0.5">•</span>
                    <span>{objective}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Prerequisites */}
            {prerequisites.length > 0 && (
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen size={14} className="text-white" />
                  <span className="font-semibold">Prerequisites</span>
                </div>
                <ul className="space-y-1 text-white/90">
                  {prerequisites.map((prereq, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-white/60 mt-0.5">•</span>
                      <span>{prereq}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tips */}
            {tips.length > 0 && (
              <div className="bg-white/10 rounded-lg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <Lightbulb size={14} className="text-yellow-300" />
                  <span className="font-semibold">Tips for Success</span>
                </div>
                <ul className="space-y-1 text-white/90">
                  {tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-yellow-300 mt-0.5">💡</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Step-by-Step Guide */}
            <div className="bg-white/10 rounded-lg p-3">
              <span className="font-semibold">Recommended Approach:</span>
              <ol className="mt-2 space-y-1.5 text-white/90">
                <li className="flex items-start gap-2">
                  <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">1</span>
                  <span>Read through each section carefully</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">2</span>
                  <span>Complete the interactive exercises</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">3</span>
                  <span>Try the practice problems</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">4</span>
                  <span>Mark sections complete as you finish</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="bg-white/20 rounded-full w-5 h-5 flex items-center justify-center text-xs flex-shrink-0">5</span>
                  <span>Take the module quiz when ready</span>
                </li>
              </ol>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
