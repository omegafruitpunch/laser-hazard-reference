"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  BookOpen,
  Clock,
  ChevronRight,
  Filter,
  Search,
  Grid3X3,
  List,
  GraduationCap,
  CheckCircle2,
  Target,
  ArrowUpDown,
  Star,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { courses } from "@/data/courses";
import { getCourseProgress } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ProgressBar } from "@/components/navigation/ProgressBar";

// Filter and sort types
type CategoryFilter = "all" | "Fundamentals" | "Regulatory" | "Safety Science" | "Operations" | "Standards";
type DifficultyFilter = "all" | "Beginner" | "Intermediate" | "Advanced";
type SortOption = "progress" | "name" | "difficulty" | "duration" | "rating";
type ViewMode = "grid" | "list";

const categories: { value: CategoryFilter; label: string }[] = [
  { value: "all", label: "All Categories" },
  { value: "Fundamentals", label: "Fundamentals" },
  { value: "Regulatory", label: "Regulatory" },
  { value: "Safety Science", label: "Safety Science" },
  { value: "Operations", label: "Operations" },
  { value: "Standards", label: "Standards" },
];

const difficulties: { value: DifficultyFilter; label: string }[] = [
  { value: "all", label: "All Levels" },
  { value: "Beginner", label: "Beginner" },
  { value: "Intermediate", label: "Intermediate" },
  { value: "Advanced", label: "Advanced" },
];

const sortOptions: { value: SortOption; label: string }[] = [
  { value: "progress", label: "Progress" },
  { value: "name", label: "Name" },
  { value: "difficulty", label: "Difficulty" },
  { value: "duration", label: "Duration" },
];

const difficultyColors = {
  Beginner: {
    bg: "bg-green-500/10",
    text: "text-green-500",
    border: "border-green-500/20",
  },
  Intermediate: {
    bg: "bg-amber-500/10",
    text: "text-amber-500",
    border: "border-amber-500/20",
  },
  Advanced: {
    bg: "bg-red-500/10",
    text: "text-red-500",
    border: "border-red-500/20",
  },
};

export default function CoursesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>("all");
  const [sortBy, setSortBy] = useState<SortOption>("progress");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Filter and sort courses
  const filteredCourses = useMemo(() => {
    let result = courses.map((course) => {
      const progress = getCourseProgress(course.id);
      const completedModules = progress.completedModules.length;
      const percentComplete = Math.round(
        (completedModules / course.modules.length) * 100
      );
      return { course, progress, percentComplete };
    });

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        ({ course }) =>
          course.title.toLowerCase().includes(query) ||
          course.description.toLowerCase().includes(query) ||
          course.category.toLowerCase().includes(query)
      );
    }

    // Apply category filter
    if (categoryFilter !== "all") {
      result = result.filter(({ course }) => course.category === categoryFilter);
    }

    // Apply difficulty filter
    if (difficultyFilter !== "all") {
      result = result.filter(({ course }) => course.difficulty === difficultyFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "progress":
          // Sort by completion status, then by progress
          const aComplete = a.progress.completedModules.length === a.course.modules.length;
          const bComplete = b.progress.completedModules.length === b.course.modules.length;
          if (aComplete !== bComplete) return bComplete ? 1 : -1;
          return b.percentComplete - a.percentComplete;
        case "name":
          return a.course.title.localeCompare(b.course.title);
        case "difficulty":
          const diffOrder = { Beginner: 1, Intermediate: 2, Advanced: 3 };
          return diffOrder[a.course.difficulty] - diffOrder[b.course.difficulty];
        case "duration":
          return a.course.totalMinutes - b.course.totalMinutes;
        default:
          return 0;
      }
    });

    return result;
  }, [searchQuery, categoryFilter, difficultyFilter, sortBy]);

  // Calculate stats
  const stats = useMemo(() => {
    const total = courses.length;
    const completed = courses.filter(
      (c) => getCourseProgress(c.id).completedModules.length === c.modules.length
    ).length;
    const inProgress = courses.filter((c) => {
      const p = getCourseProgress(c.id);
      return p.completedModules.length > 0 && p.completedModules.length < c.modules.length;
    }).length;

    return { total, completed, inProgress };
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">All Courses</h1>
            <p className="text-muted-foreground mt-1">
              Master laser safety with our comprehensive curriculum
            </p>
          </div>

          {/* Stats pills */}
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm">
              <BookOpen className="w-4 h-4" />
              <span>{stats.total} Courses</span>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 text-green-500 text-sm">
              <CheckCircle2 className="w-4 h-4" />
              <span>{stats.completed} Completed</span>
            </div>
          </div>
        </div>

        {/* Search and filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search courses..."
              className="w-full pl-10 pr-4 py-2.5 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-ring text-sm"
            />
          </div>

          {/* Filter toggle (mobile) */}
          <Button
            variant="outline"
            className="sm:hidden gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="w-4 h-4" />
            Filters
          </Button>

          {/* Desktop filters */}
          <div className="hidden sm:flex items-center gap-2">
            {/* Category filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
              className="px-3 py-2.5 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-ring text-sm"
            >
              {categories.map((c) => (
                <option key={c.value} value={c.value}>
                  {c.label}
                </option>
              ))}
            </select>

            {/* Difficulty filter */}
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
              className="px-3 py-2.5 bg-muted rounded-xl border-0 focus:ring-2 focus:ring-ring text-sm"
            >
              {difficulties.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            {/* Sort */}
            <div className="flex items-center gap-1 px-3 py-2.5 bg-muted rounded-xl">
              <ArrowUpDown className="w-4 h-4 text-muted-foreground" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="bg-transparent border-0 text-sm focus:ring-0"
              >
                {sortOptions.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>

            {/* View mode toggle */}
            <div className="flex p-1 bg-muted rounded-xl">
              <button
                onClick={() => setViewMode("grid")}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === "grid" ? "bg-card shadow-sm" : "text-muted-foreground"
                )}
                aria-label="Grid view"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={cn(
                  "p-1.5 rounded-lg transition-colors",
                  viewMode === "list" ? "bg-card shadow-sm" : "text-muted-foreground"
                )}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile filters */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="sm:hidden overflow-hidden"
            >
              <div className="space-y-3 pt-2">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value as CategoryFilter)}
                  className="w-full px-3 py-2.5 bg-muted rounded-xl border-0 text-sm"
                >
                  {categories.map((c) => (
                    <option key={c.value} value={c.value}>
                      {c.label}
                    </option>
                  ))}
                </select>
                <select
                  value={difficultyFilter}
                  onChange={(e) => setDifficultyFilter(e.target.value as DifficultyFilter)}
                  className="w-full px-3 py-2.5 bg-muted rounded-xl border-0 text-sm"
                >
                  {difficulties.map((d) => (
                    <option key={d.value} value={d.value}>
                      {d.label}
                    </option>
                  ))}
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Showing {filteredCourses.length} of {courses.length} courses
        </p>
        {(categoryFilter !== "all" || difficultyFilter !== "all" || searchQuery) && (
          <button
            onClick={() => {
              setCategoryFilter("all");
              setDifficultyFilter("all");
              setSearchQuery("");
            }}
            className="text-sm text-primary hover:underline"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Course grid/list */}
      <div
        className={cn(
          viewMode === "grid"
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
            : "space-y-3"
        )}
      >
        <AnimatePresence mode="popLayout">
          {filteredCourses.map(({ course, progress, percentComplete }) => {
            const completedModules = progress.completedModules.length;
            const totalModules = course.modules.length;
            const isComplete = completedModules === totalModules;
            const hasStarted = completedModules > 0;

            return (
              <motion.div
                key={course.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.2 }}
              >
                <Link href={`/courses/${course.id}`}>
                  <Card
                    className={cn(
                      "group overflow-hidden transition-all hover:shadow-lg",
                      viewMode === "list" && "flex flex-row items-center"
                    )}
                  >
                    {/* Cover image */}
                    <div
                      className={cn(
                        "relative overflow-hidden",
                        viewMode === "grid" ? "h-40" : "w-32 h-28 flex-shrink-0"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute inset-0 bg-gradient-to-br",
                          course.coverColor
                        )}
                      />
                      <div className="absolute inset-0 flex items-center justify-center text-5xl">
                        {course.icon}
                      </div>

                      {/* Completion badge */}
                      {isComplete && (
                        <div className="absolute top-2 right-2 w-8 h-8 rounded-full bg-green-500 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}

                      {/* Difficulty badge */}
                      <div
                        className={cn(
                          "absolute bottom-2 left-2 px-2 py-1 rounded-full text-xs font-medium",
                          difficultyColors[course.difficulty].bg,
                          difficultyColors[course.difficulty].text
                        )}
                      >
                        {course.difficulty}
                      </div>
                    </div>

                    {/* Content */}
                    <CardContent
                      className={cn(
                        "p-4",
                        viewMode === "list" && "flex-1"
                      )}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                            {course.title}
                          </h3>
                          <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                            {course.description}
                          </p>
                        </div>
                        <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0 group-hover:translate-x-1 transition-transform" />
                      </div>

                      {/* Meta info */}
                      <div className="flex items-center gap-3 mt-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {course.totalMinutes} min
                        </span>
                        <span className="flex items-center gap-1">
                          <BookOpen className="w-3.5 h-3.5" />
                          {totalModules} modules
                        </span>
                        <span className="flex items-center gap-1">
                          <Star className="w-3.5 h-3.5" />
                          {course.category}
                        </span>
                      </div>

                      {/* Progress bar */}
                      {hasStarted && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between text-xs mb-1">
                            <span className="text-muted-foreground">
                              {completedModules}/{totalModules} modules
                            </span>
                            <span
                              className={cn(
                                "font-medium",
                                isComplete ? "text-green-500" : "text-foreground"
                              )}
                            >
                              {percentComplete}%
                            </span>
                          </div>
                          <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                isComplete
                                  ? "bg-green-500"
                                  : "bg-gradient-to-r",
                                !isComplete && course.coverColor
                              )}
                              style={{ width: `${percentComplete}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {!hasStarted && (
                        <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                          <Target className="w-3.5 h-3.5" />
                          <span>Not started</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredCourses.length === 0 && (
        <div className="text-center py-16">
          <BookOpen className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground">No courses found</h3>
          <p className="text-muted-foreground mt-1">
            Try adjusting your filters or search query
          </p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => {
              setCategoryFilter("all");
              setDifficultyFilter("all");
              setSearchQuery("");
            }}
          >
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
}
