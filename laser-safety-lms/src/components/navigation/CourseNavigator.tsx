"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  ChevronRight,
  ChevronDown,
  CheckCircle2,
  Circle,
  Clock,
  BarChart3,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course, Module } from "@/types";
import { getCourseProgress, isModuleComplete } from "@/lib/progress";
import { Button } from "@/components/ui/button";

interface CourseNavigatorProps {
  courses: Course[];
  className?: string;
}

interface CourseItemProps {
  course: Course;
  isExpanded: boolean;
  onToggle: () => void;
}

function CourseItem({ course, isExpanded, onToggle }: CourseItemProps) {
  const pathname = usePathname();
  const courseProgress = getCourseProgress(course.id);
  const completedModules = courseProgress.completedModules.length;
  const totalModules = course.modules.length;
  const progressPercent = Math.round((completedModules / totalModules) * 100);
  const isCourseActive = pathname?.startsWith(`/courses/${course.id}`);

  return (
    <div className="border-b border-border/50 last:border-b-0">
      <button
        onClick={onToggle}
        className={cn(
          "w-full flex items-center gap-3 px-4 py-3 text-left transition-colors",
          "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isCourseActive && "bg-muted"
        )}
        aria-expanded={isExpanded}
        aria-controls={`course-modules-${course.id}`}
      >
        <div
          className={cn(
            "flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-lg",
            "bg-gradient-to-br",
            course.coverColor
          )}
        >
          {course.icon}
        </div>

        <div className="flex-1 min-w-0">
          <h3
            className={cn(
              "text-sm font-medium truncate",
              isCourseActive ? "text-primary" : "text-foreground"
            )}
          >
            {course.title}
          </h3>
          <p className="text-xs text-muted-foreground truncate">
            {completedModules}/{totalModules} modules
          </p>
        </div>

        <div className="flex items-center gap-2">
          {progressPercent === 100 && (
            <CheckCircle2 className="w-4 h-4 text-green-500" aria-hidden="true" />
          )}
          <ChevronDown
            className={cn(
              "w-4 h-4 text-muted-foreground transition-transform",
              isExpanded && "rotate-180"
            )}
            aria-hidden="true"
          />
        </div>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            id={`course-modules-${course.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="bg-muted/30">
              {/* Progress bar */}
              <div className="px-4 py-2 border-b border-border/30">
                <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                  <span>Progress</span>
                  <span>{progressPercent}%</span>
                </div>
                <div
                  className="h-1.5 bg-muted rounded-full overflow-hidden"
                  role="progressbar"
                  aria-valuenow={progressPercent}
                  aria-valuemin={0}
                  aria-valuemax={100}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercent}%` }}
                    className={cn(
                      "h-full rounded-full transition-all",
                      progressPercent === 100
                        ? "bg-green-500"
                        : "bg-gradient-to-r",
                      progressPercent < 100 && course.coverColor
                    )}
                  />
                </div>
              </div>

              {/* Module list */}
              <ul className="py-1" role="list">
                {course.modules.map((module, index) => (
                  <ModuleItem
                    key={module.id}
                    courseId={course.id}
                    module={module}
                    index={index}
                    isActive={pathname === `/courses/${course.id}/${module.id}`}
                  />
                ))}
              </ul>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ModuleItemProps {
  courseId: string;
  module: Module;
  index: number;
  isActive: boolean;
}

function ModuleItem({ courseId, module, index, isActive }: ModuleItemProps) {
  const complete = isModuleComplete(courseId, module.id);

  return (
    <li>
      <Link
        href={`/courses/${courseId}/${module.id}`}
        className={cn(
          "flex items-center gap-3 px-4 py-2.5 text-sm transition-colors",
          "hover:bg-muted/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-inset",
          isActive && "bg-primary/10 text-primary font-medium",
          !isActive && "text-muted-foreground"
        )}
        aria-current={isActive ? "page" : undefined}
      >
        <div className="flex-shrink-0">
          {complete ? (
            <CheckCircle2
              className="w-4 h-4 text-green-500"
              aria-hidden="true"
            />
          ) : (
            <span
              className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center text-[10px] font-medium",
                isActive
                  ? "border-primary text-primary"
                  : "border-muted-foreground/50 text-muted-foreground"
              )}
              aria-hidden="true"
            >
              {index + 1}
            </span>
          )}
        </div>
        <span className="flex-1 truncate">{module.title}</span>
        <span
          className="text-xs text-muted-foreground flex items-center gap-1"
          aria-label={`${module.estimatedMinutes} minutes`}
        >
          <Clock className="w-3 h-3" />
          {module.estimatedMinutes}
        </span>
      </Link>
    </li>
  );
}

export function CourseNavigator({ courses, className }: CourseNavigatorProps) {
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "in-progress" | "completed">("all");
  const pathname = usePathname();

  // Auto-expand the course of the current module
  useMemo(() => {
    const match = pathname?.match(/\/courses\/([^\/]+)/);
    if (match) {
      setExpandedCourse(match[1]);
    }
  }, [pathname]);

  const filteredCourses = useMemo(() => {
    switch (filter) {
      case "completed":
        return courses.filter((c) => {
          const p = getCourseProgress(c.id);
          return p.completedModules.length === c.modules.length;
        });
      case "in-progress":
        return courses.filter((c) => {
          const p = getCourseProgress(c.id);
          return p.completedModules.length > 0 && p.completedModules.length < c.modules.length;
        });
      default:
        return courses;
    }
  }, [courses, filter]);

  return (
    <div className={cn("bg-card rounded-xl border border-border overflow-hidden", className)}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-border bg-muted/50">
        <div className="flex items-center gap-2 mb-3">
          <BookOpen className="w-5 h-5 text-primary" aria-hidden="true" />
          <h2 className="font-semibold text-foreground">Course Navigator</h2>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-1 p-1 bg-muted rounded-lg" role="tablist">
          {(["all", "in-progress", "completed"] as const).map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={cn(
                "flex-1 px-2 py-1 text-xs font-medium rounded-md transition-colors",
                filter === f
                  ? "bg-card text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
              role="tab"
              aria-selected={filter === f}
            >
              {f === "in-progress" ? "In Progress" : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Course list */}
      <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
        {filteredCourses.length === 0 ? (
          <div className="px-4 py-8 text-center">
            <GraduationCap className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              No courses {filter !== "all" && filter.replace("-", " ")}
            </p>
            {filter !== "all" && (
              <Button
                variant="link"
                size="sm"
                onClick={() => setFilter("all")}
                className="mt-2"
              >
                Show all courses
              </Button>
            )}
          </div>
        ) : (
          filteredCourses.map((course) => (
            <CourseItem
              key={course.id}
              course={course}
              isExpanded={expandedCourse === course.id}
              onToggle={() =>
                setExpandedCourse(expandedCourse === course.id ? null : course.id)
              }
            />
          ))
        )}
      </div>

      {/* Stats footer */}
      <div className="px-4 py-3 border-t border-border bg-muted/50">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <BarChart3 className="w-3 h-3" />
              <span>Courses</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {courses.filter((c) => {
                const p = getCourseProgress(c.id);
                return p.completedModules.length === c.modules.length;
              }).length}
              <span className="text-muted-foreground text-sm font-normal">
                /{courses.length}
              </span>
            </p>
          </div>
          <div>
            <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
              <Clock className="w-3 h-3" />
              <span>Hours</span>
            </div>
            <p className="text-lg font-semibold text-foreground">
              {Math.round(
                courses.reduce((acc, c) => acc + c.totalMinutes, 0) / 60
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CourseNavigator;
