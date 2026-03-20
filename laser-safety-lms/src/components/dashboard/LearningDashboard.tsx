"use client";

import { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  BookOpen,
  Trophy,
  Clock,
  Zap,
  TrendingUp,
  Target,
  Calendar,
  ArrowRight,
  Sparkles,
  Flame,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course } from "@/types";
import { getCourseProgress, getOverallStats } from "@/lib/progress";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

interface LearningDashboardProps {
  courses: Course[];
  className?: string;
}

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: React.ReactNode;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "amber" | "purple" | "red";
}

function StatCard({
  title,
  value,
  description,
  icon,
  trend,
  trendValue,
  color = "blue",
}: StatCardProps) {
  const colorClasses = {
    blue: "from-blue-500/10 to-cyan-500/10 text-blue-500",
    green: "from-green-500/10 to-emerald-500/10 text-green-500",
    amber: "from-amber-500/10 to-orange-500/10 text-amber-500",
    purple: "from-purple-500/10 to-pink-500/10 text-purple-500",
    red: "from-red-500/10 to-rose-500/10 text-red-500",
  };

  return (
    <Card className="relative overflow-hidden">
      <div
        className={cn(
          "absolute top-0 right-0 w-24 h-24 bg-gradient-to-br opacity-50 rounded-bl-full",
          colorClasses[color]
        )}
      />
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-3xl font-bold text-foreground mt-1">{value}</p>
            {description && (
              <p className="text-xs text-muted-foreground mt-1">{description}</p>
            )}
            {trend && trendValue && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp
                  className={cn(
                    "w-3 h-3",
                    trend === "up" && "text-green-500",
                    trend === "down" && "text-red-500",
                    trend === "neutral" && "text-muted-foreground"
                  )}
                />
                <span
                  className={cn(
                    "text-xs",
                    trend === "up" && "text-green-500",
                    trend === "down" && "text-red-500",
                    trend === "neutral" && "text-muted-foreground"
                  )}
                >
                  {trendValue}
                </span>
              </div>
            )}
          </div>
          <div
            className={cn(
              "p-3 rounded-xl bg-gradient-to-br",
              colorClasses[color]
            )}
          >
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface ContinueLearningCardProps {
  course: Course;
  progress: ReturnType<typeof getCourseProgress>;
}

function ContinueLearningCard({ course, progress }: ContinueLearningCardProps) {
  const completedCount = progress.completedModules.length;
  const totalModules = course.modules.length;
  const percentComplete = Math.round((completedCount / totalModules) * 100);

  // Find next incomplete module
  const nextModuleIndex = completedCount;
  const nextModule = course.modules[nextModuleIndex];

  if (!nextModule) return null;

  return (
    <Card className="group hover:shadow-lg transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div
            className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center text-2xl flex-shrink-0",
              "bg-gradient-to-br",
              course.coverColor
            )}
          >
            {course.icon}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs text-muted-foreground uppercase tracking-wider">
              Continue Learning
            </p>
            <h3 className="font-semibold text-foreground mt-0.5 truncate">
              {course.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Next: {nextModule.title}
            </p>

            {/* Progress bar */}
            <div className="mt-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-muted-foreground">
                  {completedCount}/{totalModules} modules
                </span>
                <span className="font-medium text-foreground">{percentComplete}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentComplete}%` }}
                  className={cn(
                    "h-full rounded-full bg-gradient-to-r",
                    course.coverColor
                  )}
                />
              </div>
            </div>
          </div>
        </div>

        <Link
          href={`/courses/${course.id}/${nextModule.id}`}
          className="mt-4 block"
        >
          <Button className="w-full group/btn">
            Continue
            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
}

export function LearningDashboard({ courses, className }: LearningDashboardProps) {
  const totalModules = useMemo(
    () => courses.reduce((acc, c) => acc + c.modules.length, 0),
    [courses]
  );

  const stats = useMemo(
    () => getOverallStats(totalModules, courses.length),
    [totalModules, courses.length]
  );

  // Calculate study time (mock data based on completed modules)
  const studyTimeMinutes = stats.completedModules * 15; // 15 min per module avg
  const studyHours = Math.floor(studyTimeMinutes / 60);
  const studyMinutes = studyTimeMinutes % 60;

  // Find in-progress courses
  const inProgressCourses = useMemo(() => {
    return courses
      .map((course) => ({
        course,
        progress: getCourseProgress(course.id),
      }))
      .filter(
        ({ progress, course }) =>
          progress.completedModules.length > 0 &&
          progress.completedModules.length < course.modules.length
      )
      .sort(
        (a, b) =>
          b.progress.completedModules.length / b.course.modules.length -
          a.progress.completedModules.length / a.course.modules.length
      )
      .slice(0, 2);
  }, [courses]);

  // Find completed courses
  const completedCourses = useMemo(() => {
    return courses.filter((course) => {
      const progress = getCourseProgress(course.id);
      return progress.completedModules.length === course.modules.length;
    });
  }, [courses]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Welcome section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-foreground">
            Welcome back! 👋
          </h1>
          <p className="text-muted-foreground mt-1">
            You&apos;ve completed {stats.completedModules} modules. Keep up the great
            work!
          </p>
        </div>
        <Link href="/courses">
          <Button className="gap-2">
            <BookOpen className="w-4 h-4" />
            Browse Courses
          </Button>
        </Link>
      </motion.div>

      {/* Stats grid */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <StatCard
            title="Courses Completed"
            value={stats.coursesFinished}
            description={`of ${stats.totalCourses} available`}
            icon={<Trophy className="w-5 h-5" />}
            color="amber"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Modules Finished"
            value={stats.completedModules}
            description={`of ${stats.totalModules} total`}
            icon={<BookOpen className="w-5 h-5" />}
            color="blue"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Study Time"
            value={studyHours > 0 ? `${studyHours}h ${studyMinutes}m` : `${studyMinutes}m`}
            description="Total learning time"
            icon={<Clock className="w-5 h-5" />}
            color="purple"
          />
        </motion.div>

        <motion.div variants={itemVariants}>
          <StatCard
            title="Day Streak"
            value="5"
            description="Keep it going!"
            icon={<Flame className="w-5 h-5" />}
            color="red"
            trend="up"
            trendValue="+2 from last week"
          />
        </motion.div>
      </motion.div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Continue learning section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2 space-y-4"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">
              Continue Learning
            </h2>
            <Link
              href="/courses"
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              View all
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {inProgressCourses.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {inProgressCourses.map(({ course, progress }) => (
                <ContinueLearningCard
                  key={course.id}
                  course={course}
                  progress={progress}
                />
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
              <h3 className="font-medium text-foreground">Start Your Journey</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Browse our courses and start learning about laser safety today.
              </p>
              <Link href="/courses" className="mt-4 inline-block">
                <Button>Browse Courses</Button>
              </Link>
            </Card>
          )}

          {/* Recent achievements placeholder */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                Recent Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                {completedCourses.length > 0 ? (
                  completedCourses.slice(0, 3).map((course) => (
                    <div
                      key={course.id}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg bg-muted"
                    >
                      <span className="text-lg">{course.icon}</span>
                      <span className="text-sm font-medium">{course.title}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">
                    Complete courses to earn certificates and badges!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Sidebar content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-6"
        >
          {/* Daily goal card */}
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-amber-500" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Daily Goal</h3>
                  <p className="text-xs text-muted-foreground">30 minutes / day</p>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">15/30 min</span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full w-1/2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                </div>
              </div>

              <p className="text-xs text-muted-foreground mt-3">
                Study 15 more minutes to reach your goal!
              </p>
            </CardContent>
          </Card>

          {/* Upcoming deadlines */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Learning Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-blue-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">FDA Compliance Quiz</p>
                  <p className="text-xs text-muted-foreground">Due in 3 days</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Laser Fundamentals</p>
                  <p className="text-xs text-muted-foreground">Completed today</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick tip */}
          <div className="p-4 rounded-xl bg-gradient-to-br from-blue-500/10 to-purple-500/10 border border-blue-500/20">
            <div className="flex items-start gap-2">
              <Zap className="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-foreground">Pro Tip</p>
                <p className="text-xs text-muted-foreground mt-1">
                  Take notes while studying to improve retention by 40%.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default LearningDashboard;
