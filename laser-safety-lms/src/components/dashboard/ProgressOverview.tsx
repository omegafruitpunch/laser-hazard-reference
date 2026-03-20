"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Target,
  TrendingUp,
  Clock,
  ChevronRight,
  Filter,
  ArrowUpRight,
  CheckCircle2,
  Circle,
  Lock,
  Play,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/types";
import { getCourseProgress, getOverallStats } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { ProgressBar, CircularProgress } from "@/components/navigation/ProgressBar";

interface ProgressOverviewProps {
  courses: Course[];
  className?: string;
}

type FilterType = "all" | "in-progress" | "completed" | "not-started";

type SortBy = "progress" | "name" | "difficulty" | "recent";

export function ProgressOverview({ courses, className }: ProgressOverviewProps) {
  const [filter, setFilter] = useState<FilterType>("all");
  const [sortBy, setSortBy] = useState<SortBy>("progress");

  const totalModules = useMemo(
    () => courses.reduce((acc, c) => acc + c.modules.length, 0),
    [courses]
  );

  const stats = useMemo(
    () => getOverallStats(totalModules, courses.length),
    [totalModules, courses.length]
  );

  // Calculate course progress data
  const courseProgressData = useMemo(() => {
    return courses.map((course) => {
      const progress = getCourseProgress(course.id);
      const completedModules = progress.completedModules.length;
      const totalModules = course.modules.length;
      const percentComplete = Math.round((completedModules / totalModules) * 100);
      const hasStarted = completedModules > 0;
      const isComplete = completedModules === totalModules;

      // Calculate estimated time remaining
      const remainingModules = course.modules.slice(completedModules);
      const estimatedMinutesRemaining = remainingModules.reduce(
        (acc, m) => acc + m.estimatedMinutes,
        0
      );

      return {
        course,
        progress,
        completedModules,
        totalModules,
        percentComplete,
        hasStarted,
        isComplete,
        estimatedMinutesRemaining,
        lastAccessed: progress.completedAt ? new Date(progress.completedAt) : null,
      };
    });
  }, [courses]);

  // Filter and sort courses
  const filteredAndSortedCourses = useMemo(() => {
    let filtered = courseProgressData;

    // Apply filter
    switch (filter) {
      case "in-progress":
        filtered = courseProgressData.filter((c) => c.hasStarted && !c.isComplete);
        break;
      case "completed":
        filtered = courseProgressData.filter((c) => c.isComplete);
        break;
      case "not-started":
        filtered = courseProgressData.filter((c) => !c.hasStarted);
        break;
    }

    // Apply sort
    return [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "progress":
          return b.percentComplete - a.percentComplete;
        case "name":
          return a.course.title.localeCompare(b.course.title);
        case "difficulty":
          const difficultyOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
          return difficultyOrder[a.course.difficulty] - difficultyOrder[b.course.difficulty];
        case "recent":
          if (!a.lastAccessed && !b.lastAccessed) return 0;
          if (!a.lastAccessed) return 1;
          if (!b.lastAccessed) return -1;
          return b.lastAccessed.getTime() - a.lastAccessed.getTime();
        default:
          return 0;
      }
    });
  }, [courseProgressData, filter, sortBy]);

  // Calculate statistics
  const statistics = useMemo(() => {
    const completed = courseProgressData.filter((c) => c.isComplete).length;
    const inProgress = courseProgressData.filter(
      (c) => c.hasStarted && !c.isComplete
    ).length;
    const notStarted = courseProgressData.filter((c) => !c.hasStarted).length;

    const totalTimeSpent = courseProgressData.reduce(
      (acc, c) => acc + c.completedModules * 15, // 15 min avg per module
      0
    );

    return { completed, inProgress, notStarted, totalTimeSpent };
  }, [courseProgressData]);

  const difficultyColors = {
    Beginner: "bg-green-500/10 text-green-500 border-green-500/20",
    Intermediate: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    Advanced: "bg-red-500/10 text-red-500 border-red-500/20",
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Progress Overview</h1>
          <p className="text-muted-foreground mt-1">
            Track your learning journey across all courses
          </p>
        </div>
        <Link href="/courses">
          <Button variant="outline" className="gap-2">
            <Play className="w-4 h-4" />
            Continue Learning
          </Button>
        </Link>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {statistics.completed}
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {statistics.inProgress}
                </p>
                <p className="text-xs text-muted-foreground">In Progress</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {Math.round(statistics.totalTimeSpent / 60)}h
                </p>
                <p className="text-xs text-muted-foreground">Time Spent</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">
                  {stats.overallPercent}%
                </p>
                <p className="text-xs text-muted-foreground">Overall</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Overall progress */}
      <Card>
        <CardHeader>
          <CardTitle>Overall Progress</CardTitle>
          <CardDescription>
            {stats.completedModules} of {stats.totalModules} modules completed across all courses
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ProgressBar
            value={stats.completedModules}
            max={stats.totalModules}
            size="lg"
            showLabel
            animated
          />
        </CardContent>
      </Card>

      {/* Course list with filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle>Course Progress</CardTitle>
              <CardDescription>
                {filteredAndSortedCourses.length} courses
              </CardDescription>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-2">
              {/* Filter tabs */}
              <div className="flex p-1 bg-muted rounded-lg">
                {(["all", "in-progress", "completed", "not-started"] as FilterType[]).map(
                  (f) => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      className={cn(
                        "px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize",
                        filter === f
                          ? "bg-card text-foreground shadow-sm"
                          : "text-muted-foreground hover:text-foreground"
                      )}
                    >
                      {f.replace("-", " ")}
                    </button>
                  )
                )}
              </div>

              {/* Sort dropdown */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortBy)}
                className="px-3 py-1.5 text-xs bg-muted rounded-lg border-0 focus:ring-2 focus:ring-ring"
              >
                <option value="progress">Sort by Progress</option>
                <option value="name">Sort by Name</option>
                <option value="difficulty">Sort by Difficulty</option>
                <option value="recent">Sort by Recent</option>
              </select>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {filteredAndSortedCourses.map(({ course, percentComplete, completedModules, totalModules, isComplete, hasStarted, estimatedMinutesRemaining }) => (
            <Link
              key={course.id}
              href={`/courses/${course.id}`}
              className={cn(
                "flex items-center gap-4 p-4 rounded-xl border transition-all",
                "hover:border-primary/50 hover:shadow-sm",
                "border-border bg-card"
              )}
            >
              {/* Course icon */}
              <div
                className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0",
                  "bg-gradient-to-br",
                  course.coverColor
                )}
              >
                {course.icon}
              </div>

              {/* Course info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-semibold text-foreground truncate">
                    {course.title}
                  </h3>
                  <span
                    className={cn(
                      "px-2 py-0.5 text-[10px] font-medium rounded-full border",
                      difficultyColors[course.difficulty]
                    )}
                  >
                    {course.difficulty}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground truncate">
                  {course.category} • {course.totalMinutes} min total
                </p>

                {/* Progress bar */}
                <div className="mt-2">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-muted-foreground">
                      {completedModules}/{totalModules} modules
                    </span>
                    <span className="font-medium text-foreground">
                      {percentComplete}%
                    </span>
                  </div>
                  <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${percentComplete}%` }}
                      className={cn(
                        "h-full rounded-full transition-all",
                        isComplete
                          ? "bg-green-500"
                          : "bg-gradient-to-r",
                        !isComplete && course.coverColor
                      )}
                    />
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="flex-shrink-0 text-right">
                {isComplete ? (
                  <div className="flex flex-col items-end">
                    <CheckCircle2 className="w-6 h-6 text-green-500" />
                    <span className="text-xs text-green-500 mt-1">Complete</span>
                  </div>
                ) : hasStarted ? (
                  <div className="flex flex-col items-end">
                    <CircularProgress
                      value={percentComplete}
                      max={100}
                      size={40}
                      strokeWidth={4}
                      showLabel
                    />
                    <span className="text-xs text-muted-foreground mt-1">
                      {estimatedMinutesRemaining}m left
                    </span>
                  </div>
                ) : (
                  <div className="flex flex-col items-end">
                    <Lock className="w-6 h-6 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground mt-1">
                      Start
                    </span>
                  </div>
                )}
              </div>

              <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            </Link>
          ))}

          {filteredAndSortedCourses.length === 0 && (
            <div className="text-center py-12">
              <Filter className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <p className="text-muted-foreground">No courses match this filter</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export default ProgressOverview;
