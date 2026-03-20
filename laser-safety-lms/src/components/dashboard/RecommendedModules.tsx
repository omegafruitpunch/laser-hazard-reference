"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  ChevronRight,
  Clock,
  Target,
  TrendingUp,
  Zap,
  BookOpen,
  Award,
  ArrowRight,
  Lightbulb,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/types";
import { getCourseProgress, isModuleComplete } from "@/lib/progress";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface RecommendedModulesProps {
  courses: Course[];
  className?: string;
  limit?: number;
}

interface Recommendation {
  course: Course;
  module: Course["modules"][0];
  reason: string;
  reasonType: "continue" | "start" | "next" | "popular" | "skill-gap";
  priority: number;
}

export function RecommendedModules({ courses, className, limit = 4 }: RecommendedModulesProps) {
  const recommendations = useMemo<Recommendation[]>(() => {
    const recs: Recommendation[] = [];

    courses.forEach((course) => {
      const progress = getCourseProgress(course.id);
      const completedModules = progress.completedModules;
      const nextModuleIndex = completedModules.length;

      // If course is complete, skip
      if (nextModuleIndex >= course.modules.length) return;

      const nextModule = course.modules[nextModuleIndex];
      const percentComplete = (completedModules.length / course.modules.length) * 100;

      // Determine recommendation reason
      let reason: string;
      let reasonType: Recommendation["reasonType"];
      let priority: number;

      if (completedModules.length === 0) {
        reason = "Start your journey";
        reasonType = "start";
        priority = 2;
      } else if (percentComplete >= 75) {
        reason = "Almost there! Finish strong";
        reasonType = "continue";
        priority = 5;
      } else if (percentComplete >= 50) {
        reason = "Keep your momentum going";
        reasonType = "continue";
        priority = 4;
      } else {
        reason = "Continue where you left off";
        reasonType = "next";
        priority = 3;
      }

      recs.push({
        course,
        module: nextModule,
        reason,
        reasonType,
        priority,
      });
    });

    // Sort by priority (highest first)
    recs.sort((a, b) => b.priority - a.priority);

    // Add "popular" recommendations if we have slots
    if (recs.length < limit) {
      const startedCourseIds = new Set(recs.map((r) => r.course.id));
      const notStarted = courses.filter((c) => !startedCourseIds.has(c.id));

      notStarted.slice(0, limit - recs.length).forEach((course) => {
        recs.push({
          course,
          module: course.modules[0],
          reason: "Popular among learners",
          reasonType: "popular",
          priority: 1,
        });
      });
    }

    return recs.slice(0, limit);
  }, [courses, limit]);

  const reasonIcons = {
    continue: <TrendingUp className="w-3 h-3" />,
    start: <BookOpen className="w-3 h-3" />,
    next: <ArrowRight className="w-3 h-3" />,
    popular: <Sparkles className="w-3 h-3" />,
    "skill-gap": <Target className="w-3 h-3" />,
  };

  const reasonColors = {
    continue: "bg-green-500/10 text-green-500",
    start: "bg-blue-500/10 text-blue-500",
    next: "bg-amber-500/10 text-amber-500",
    popular: "bg-purple-500/10 text-purple-500",
    "skill-gap": "bg-red-500/10 text-red-500",
  };

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <CardTitle className="text-base">Recommended for You</CardTitle>
              <CardDescription>AI-powered learning suggestions</CardDescription>
            </div>
          </div>
          <Zap className="w-5 h-5 text-amber-500" />
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {recommendations.map(({ course, module, reason, reasonType }, index) => {
          const progress = getCourseProgress(course.id);
          const completedCount = progress.completedModules.length;
          const totalCount = course.modules.length;
          const percentComplete = Math.round((completedCount / totalCount) * 100);

          return (
            <motion.div
              key={module.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/courses/${course.id}/${module.id}`}
                className={cn(
                  "flex items-start gap-3 p-3 rounded-xl transition-all",
                  "bg-muted/50 hover:bg-muted border border-transparent hover:border-border"
                )}
              >
                {/* Course icon */}
                <div
                  className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0",
                    "bg-gradient-to-br",
                    course.coverColor
                  )}
                >
                  {course.icon}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium text-foreground truncate">
                      {module.title}
                    </h4>
                    <span
                      className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium rounded",
                        reasonColors[reasonType]
                      )}
                    >
                      {reasonIcons[reasonType]}
                      {reason}
                    </span>
                  </div>

                  <p className="text-xs text-muted-foreground mt-1">
                    {course.title}
                  </p>

                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {module.estimatedMinutes} min
                    </span>
                    {completedCount > 0 && (
                      <span className="text-xs text-muted-foreground">
                        {percentComplete}% complete
                      </span>
                    )}
                  </div>

                  {/* Mini progress bar */}
                  {completedCount > 0 && (
                    <div className="h-1 bg-muted-foreground/20 rounded-full overflow-hidden mt-2">
                      <div
                        className={cn(
                          "h-full rounded-full bg-gradient-to-r",
                          course.coverColor
                        )}
                        style={{ width: `${percentComplete}%` }}
                      />
                    </div>
                  )}
                </div>

                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-2" />
              </Link>
            </motion.div>
          );
        })}

        <Link href="/courses">
          <Button variant="ghost" className="w-full gap-2 mt-2">
            View All Courses
            <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

interface SkillGapAnalysisProps {
  courses: Course[];
  className?: string;
}

export function SkillGapAnalysis({ courses, className }: SkillGapAnalysisProps) {
  // Analyze completed topics vs available topics
  const analysis = useMemo(() => {
    const categories = new Map<string, { total: number; completed: number }>();

    courses.forEach((course) => {
      const progress = getCourseProgress(course.id);
      const existing = categories.get(course.category) || { total: 0, completed: 0 };
      existing.total += course.modules.length;
      existing.completed += progress.completedModules.length;
      categories.set(course.category, existing);
    });

    return Array.from(categories.entries())
      .map(([category, stats]) => ({
        category,
        ...stats,
        percent: Math.round((stats.completed / stats.total) * 100),
      }))
      .sort((a, b) => a.percent - b.percent);
  }, [courses]);

  return (
    <Card className={className}>
      <CardHeader>
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-500" />
          <CardTitle className="text-base">Skill Coverage</CardTitle>
        </div>
        <CardDescription>Your proficiency across topic areas</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {analysis.map(({ category, total, completed, percent }) => (
          <div key={category}>
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="text-foreground font-medium">{category}</span>
              <span className="text-muted-foreground">
                {completed}/{total} modules
              </span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${percent}%` }}
                className={cn(
                  "h-full rounded-full transition-all",
                  percent >= 80
                    ? "bg-green-500"
                    : percent >= 50
                    ? "bg-amber-500"
                    : "bg-red-500"
                )}
              />
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}

export default RecommendedModules;
