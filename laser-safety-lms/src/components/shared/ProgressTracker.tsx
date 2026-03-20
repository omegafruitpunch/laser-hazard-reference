"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Target, 
  TrendingUp, 
  Award,
  BookOpen,
  Zap
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface ModuleProgress {
  moduleId: string;
  moduleName: string;
  completed: boolean;
  score?: number;
  timeSpentMinutes: number;
  lastAccessed?: Date;
}

export interface CourseProgress {
  courseId: string;
  courseName: string;
  totalModules: number;
  completedModules: number;
  modules: ModuleProgress[];
  overallScore?: number;
  estimatedTimeRemaining: number;
  streakDays: number;
}

export interface ProgressTrackerProps {
  progress: CourseProgress;
  variant?: "compact" | "detailed" | "minimal";
  showStreak?: boolean;
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function ProgressTracker({
  progress,
  variant = "detailed",
  showStreak = true,
  className,
}: ProgressTrackerProps) {
  const completionPercentage = (progress.completedModules / progress.totalModules) * 100;

  if (variant === "minimal") {
    return (
      <MinimalTracker
        completionPercentage={completionPercentage}
        completedModules={progress.completedModules}
        totalModules={progress.totalModules}
        className={className}
      />
    );
  }

  if (variant === "compact") {
    return (
      <CompactTracker
        completionPercentage={completionPercentage}
        completedModules={progress.completedModules}
        totalModules={progress.totalModules}
        estimatedTimeRemaining={progress.estimatedTimeRemaining}
        streakDays={showStreak ? progress.streakDays : undefined}
        className={className}
      />
    );
  }

  return (
    <DetailedTracker
      progress={progress}
      completionPercentage={completionPercentage}
      showStreak={showStreak}
      className={className}
    />
  );
}

// ============================================================================
// Minimal Variant
// ============================================================================

interface MinimalTrackerProps {
  completionPercentage: number;
  completedModules: number;
  totalModules: number;
  className?: string;
}

function MinimalTracker({
  completionPercentage,
  completedModules,
  totalModules,
  className,
}: MinimalTrackerProps) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative w-12 h-12">
        <svg className="w-12 h-12 transform -rotate-90">
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            className="text-muted"
          />
          <circle
            cx="24"
            cy="24"
            r="20"
            fill="none"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray={`${completionPercentage * 1.26} 126`}
            className="text-primary transition-all duration-500"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
          {Math.round(completionPercentage)}%
        </span>
      </div>
      <div className="text-sm">
        <div className="font-medium">{completedModules}/{totalModules}</div>
        <div className="text-muted-foreground text-xs">modules</div>
      </div>
    </div>
  );
}

// ============================================================================
// Compact Variant
// ============================================================================

interface CompactTrackerProps extends MinimalTrackerProps {
  estimatedTimeRemaining: number;
  streakDays?: number;
}

function CompactTracker({
  completionPercentage,
  completedModules,
  totalModules,
  estimatedTimeRemaining,
  streakDays,
  className,
}: CompactTrackerProps) {
  return (
    <div className={cn("bg-card rounded-xl p-4 border border-border/50", className)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          <span className="font-semibold">Course Progress</span>
        </div>
        {streakDays !== undefined && streakDays > 0 && (
          <Badge variant="secondary" className="flex items-center gap-1">
            <Zap className="w-3 h-3 text-amber-400" />
            {streakDays} day streak
          </Badge>
        )}
      </div>

      <Progress value={completionPercentage} className="mb-3">
        <ProgressTrack>
          <ProgressIndicator />
        </ProgressTrack>
      </Progress>

      <div className="flex justify-between text-sm text-muted-foreground">
        <span>{completedModules} of {totalModules} completed</span>
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          ~{estimatedTimeRemaining} min remaining
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// Detailed Variant
// ============================================================================

interface DetailedTrackerProps {
  progress: CourseProgress;
  completionPercentage: number;
  showStreak: boolean;
  className?: string;
}

function DetailedTracker({
  progress,
  completionPercentage,
  showStreak,
  className,
}: DetailedTrackerProps) {
  const averageScore = progress.overallScore || 
    (progress.modules
      .filter((m) => m.score !== undefined)
      .reduce((acc, m) => acc + (m.score || 0), 0) / 
      progress.modules.filter((m) => m.score !== undefined).length) || 0;

  const totalTimeSpent = progress.modules.reduce((acc, m) => acc + m.timeSpentMinutes, 0);

  return (
    <div className={cn("space-y-6", className)}>
      {/* Overview Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          icon={<BookOpen className="w-5 h-5" />}
          label="Modules"
          value={`${progress.completedModules}/${progress.totalModules}`}
          subtext={`${Math.round(completionPercentage)}% complete`}
          color="blue"
        />
        <StatCard
          icon={<Award className="w-5 h-5" />}
          label="Average Score"
          value={averageScore > 0 ? `${Math.round(averageScore)}%` : "—"}
          subtext={averageScore >= 80 ? "Excellent!" : averageScore >= 60 ? "Good progress" : "Keep practicing"}
          color="purple"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Time Spent"
          value={`${Math.floor(totalTimeSpent / 60)}h ${totalTimeSpent % 60}m`}
          subtext={`~${progress.estimatedTimeRemaining} min remaining`}
          color="amber"
        />
        {showStreak && (
          <StatCard
            icon={<Zap className="w-5 h-5" />}
            label="Study Streak"
            value={`${progress.streakDays} days`}
            subtext={progress.streakDays > 0 ? "Keep it up!" : "Start today"}
            color="green"
          />
        )}
      </div>

      {/* Overall Progress */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <div className="flex items-center justify-between mb-4">
          <ProgressLabel className="text-lg font-semibold">Overall Progress</ProgressLabel>
          <ProgressValue className="text-lg font-bold">{(formattedValue) => formattedValue || `${Math.round(completionPercentage)}%`}</ProgressValue>
        </div>
        <Progress value={completionPercentage} className="h-3">
          <ProgressTrack className="h-3">
            <ProgressIndicator className="h-3" />
          </ProgressTrack>
        </Progress>
      </div>

      {/* Module Breakdown */}
      <div className="bg-card rounded-xl p-6 border border-border/50">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-primary" />
          Module Breakdown
        </h3>
        <div className="space-y-3">
          {progress.modules.map((module, index) => (
            <ModuleRow key={module.moduleId} module={module} index={index} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// Sub-components
// ============================================================================

interface StatCardProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  subtext: string;
  color: "blue" | "purple" | "amber" | "green" | "red";
}

function StatCard({ icon, label, value, subtext, color }: StatCardProps) {
  const colorClasses = {
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    amber: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
  };

  return (
    <div className={cn("rounded-xl p-4 border", colorClasses[color])}>
      <div className="flex items-center gap-2 mb-2 opacity-80">
        {icon}
        <span className="text-sm font-medium">{label}</span>
      </div>
      <div className="text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs opacity-70">{subtext}</div>
    </div>
  );
}

interface ModuleRowProps {
  module: ModuleProgress;
  index: number;
}

function ModuleRow({ module, index }: ModuleRowProps) {
  return (
    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center text-sm font-medium">
        {index + 1}
      </div>
      
      <div className="flex-grow">
        <div className="font-medium">{module.moduleName}</div>
        {module.lastAccessed && (
          <div className="text-xs text-muted-foreground">
            Last accessed {module.lastAccessed.toLocaleDateString()}
          </div>
        )}
      </div>

      <div className="flex items-center gap-3">
        {module.completed ? (
          <>
            <Badge variant="default" className="flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Complete
            </Badge>
            {module.score !== undefined && (
              <span className={cn(
                "text-sm font-bold",
                module.score >= 80 ? "text-green-400" :
                module.score >= 60 ? "text-amber-400" : "text-red-400"
              )}>
                {module.score}%
              </span>
            )}
          </>
        ) : (
          <Badge variant="outline" className="flex items-center gap-1">
            <Circle className="w-3 h-3" />
            Pending
          </Badge>
        )}
      </div>
    </div>
  );
}

export default ProgressTracker;
