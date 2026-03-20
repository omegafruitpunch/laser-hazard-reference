"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Lock,
  Play,
  FileText,
  Lightbulb,
  HelpCircle,
  Award,
  ChevronRight,
  Clock,
  Target,
  Route,
  Sparkles,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course, Module } from "@/types";
import { getCourseProgress, isModuleComplete } from "@/lib/progress";
import { Button } from "@/components/ui/button";

interface LearningPathViewerProps {
  course: Course;
  className?: string;
  orientation?: "horizontal" | "vertical";
  showPhases?: boolean;
}

type PathNode = {
  id: string;
  type: "module" | "phase" | "milestone" | "assessment";
  title: string;
  description?: string;
  completed: boolean;
  locked: boolean;
  active: boolean;
  href: string;
  estimatedMinutes?: number;
  icon?: React.ReactNode;
};

interface PathNodeProps {
  node: PathNode;
  index: number;
  total: number;
  orientation: "horizontal" | "vertical";
}

const phaseConfig = {
  learn: {
    icon: <FileText className="w-4 h-4" />,
    color: "blue",
    label: "Learn",
  },
  practice: {
    icon: <Lightbulb className="w-4 h-4" />,
    color: "amber",
    label: "Practice",
  },
  assess: {
    icon: <HelpCircle className="w-4 h-4" />,
    color: "purple",
    label: "Assess",
  },
  review: {
    icon: <Target className="w-4 h-4" />,
    color: "green",
    label: "Review",
  },
};

function PathNodeComponent({ node, index, total, orientation }: PathNodeProps) {
  const isLast = index === total - 1;

  const colorClasses = {
    blue: {
      bg: "bg-blue-500/10",
      border: "border-blue-500/30",
      text: "text-blue-500",
      ring: "ring-blue-500/30",
      gradient: "from-blue-500 to-cyan-500",
    },
    amber: {
      bg: "bg-amber-500/10",
      border: "border-amber-500/30",
      text: "text-amber-500",
      ring: "ring-amber-500/30",
      gradient: "from-amber-500 to-orange-500",
    },
    purple: {
      bg: "bg-purple-500/10",
      border: "border-purple-500/30",
      text: "text-purple-500",
      ring: "ring-purple-500/30",
      gradient: "from-purple-500 to-pink-500",
    },
    green: {
      bg: "bg-green-500/10",
      border: "border-green-500/30",
      text: "text-green-500",
      ring: "ring-green-500/30",
      gradient: "from-green-500 to-emerald-500",
    },
  };

  const getStatusIcon = () => {
    if (node.locked) return <Lock className="w-4 h-4" />;
    if (node.completed) return <CheckCircle2 className="w-4 h-4" />;
    if (node.active) return <Play className="w-4 h-4" />;
    return <Circle className="w-4 h-4" />;
  };

  const getNodeColor = () => {
    if (node.type === "milestone") return "amber";
    if (node.type === "assessment") return "purple";
    return "blue";
  };

  const color = colorClasses[getNodeColor()];

  return (
    <div
      className={cn(
        "relative flex",
        orientation === "horizontal"
          ? "flex-col items-center"
          : "flex-row items-start gap-4"
      )}
    >
      {/* Node */}
      <Link
        href={node.locked ? "#" : node.href}
        onClick={(e) => node.locked && e.preventDefault()}
        className={cn(
          "relative z-10 flex items-center justify-center rounded-xl border-2 transition-all",
          "w-12 h-12 sm:w-14 sm:h-14",
          node.completed && !node.locked
            ? cn("bg-green-500/10 border-green-500 text-green-500", color.ring)
            : node.active
            ? cn(color.bg, color.border, color.text, "ring-4", color.ring)
            : node.locked
            ? "bg-muted border-muted-foreground/20 text-muted-foreground"
            : cn(color.bg, color.border, color.text),
          !node.locked && "hover:scale-110 hover:shadow-lg",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        )}
        aria-label={`${node.title}${node.locked ? " (Locked)" : ""}${node.completed ? " (Completed)" : ""}`}
        aria-disabled={node.locked}
      >
        {getStatusIcon()}

        {/* Pulse animation for active node */}
        {node.active && !node.locked && (
          <motion.span
            className={cn(
              "absolute inset-0 rounded-xl border-2",
              color.border
            )}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Link>

      {/* Content */}
      <div
        className={cn(
          orientation === "horizontal"
            ? "mt-3 text-center"
            : "flex-1 pt-1"
        )}
      >
        <p
          className={cn(
            "text-sm font-medium",
            node.active ? "text-foreground" : "text-muted-foreground",
            node.locked && "opacity-50"
          )}
        >
          {node.title}
        </p>
        {node.description && (
          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
            {node.description}
          </p>
        )}
        {node.estimatedMinutes && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
            <Clock className="w-3 h-3" />
            {node.estimatedMinutes} min
          </p>
        )}
      </div>

      {/* Connector line */}
      {!isLast && (
        <>
          {orientation === "horizontal" ? (
            // Horizontal connector
            <div
              className={cn(
                "absolute top-6 sm:top-7 left-1/2 w-full h-0.5",
                "-translate-y-1/2"
              )}
              style={{ width: "calc(100% - 3rem)" }}
            >
              <div className="absolute inset-0 bg-muted" />
              {node.completed && (
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  className="absolute inset-y-0 left-0 bg-green-500"
                />
              )}
            </div>
          ) : (
            // Vertical connector
            <div
              className={cn(
                "absolute left-6 sm:left-7 top-14 w-0.5",
                "-translate-x-1/2"
              )}
              style={{ height: "calc(100% - 3.5rem)" }}
            >
              <div className="absolute inset-0 bg-muted" />
              {node.completed && (
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: "100%" }}
                  className="absolute inset-x-0 top-0 bg-green-500"
                />
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}

export function LearningPathViewer({
  course,
  className,
  orientation = "vertical",
  showPhases = true,
}: LearningPathViewerProps) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);
  const progress = getCourseProgress(course.id);

  const pathNodes = useMemo(() => {
    const nodes: PathNode[] = [];

    // Group modules into phases
    const modulesPerPhase = Math.ceil(course.modules.length / 4);
    const phases: (keyof typeof phaseConfig)[] = ["learn", "practice", "assess", "review"];

    course.modules.forEach((module, index) => {
      const phaseIndex = Math.min(Math.floor(index / modulesPerPhase), 3);
      const phase = phases[phaseIndex];
      const isComplete = isModuleComplete(course.id, module.id);
      const isActive = index === progress.completedModules.length;
      const isLocked = index > progress.completedModules.length;

      // Add phase header if starting new phase
      if (index % modulesPerPhase === 0 && showPhases) {
        nodes.push({
          id: `phase-${phase}`,
          type: "phase",
          title: phaseConfig[phase].label,
          completed: index < progress.completedModules.length,
          locked: index > progress.completedModules.length,
          active: phaseIndex === Math.floor(progress.completedModules.length / modulesPerPhase),
          href: "#",
          icon: phaseConfig[phase].icon,
        });
      }

      nodes.push({
        id: module.id,
        type: index === course.modules.length - 1 ? "milestone" : "module",
        title: module.title,
        description: module.description,
        completed: isComplete,
        locked: isLocked,
        active: isActive,
        href: `/courses/${course.id}/${module.id}`,
        estimatedMinutes: module.estimatedMinutes,
      });
    });

    // Add final assessment
    const allModulesComplete = progress.completedModules.length === course.modules.length;
    nodes.push({
      id: "final-assessment",
      type: "assessment",
      title: "Final Assessment",
      description: "Complete the course quiz",
      completed: !!progress.quizPassed,
      locked: !allModulesComplete,
      active: allModulesComplete && !progress.quizPassed,
      href: `/quiz/${course.id}`,
      estimatedMinutes: 15,
    });

    return nodes;
  }, [course, progress, showPhases]);

  const stats = useMemo(() => {
    const completed = pathNodes.filter((n) => n.type === "module" && n.completed).length;
    const total = course.modules.length;
    const percent = Math.round((completed / total) * 100);

    return { completed, total, percent };
  }, [pathNodes, course.modules.length]);

  return (
    <div className={cn("bg-card rounded-xl border border-border p-4 sm:p-6", className)}>
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center text-xl",
              "bg-gradient-to-br",
              course.coverColor
            )}
          >
            {course.icon}
          </div>
          <div>
            <h2 className="font-semibold text-foreground">Learning Path</h2>
            <p className="text-sm text-muted-foreground">
              {stats.completed} of {stats.total} modules completed
            </p>
          </div>
        </div>

        {/* Progress circle */}
        <div className="relative w-14 h-14">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              className="text-muted"
            />
            <motion.circle
              cx="28"
              cy="28"
              r="24"
              fill="none"
              stroke="currentColor"
              strokeWidth="4"
              strokeLinecap="round"
              strokeDasharray={24 * 2 * Math.PI}
              initial={{ strokeDashoffset: 24 * 2 * Math.PI }}
              animate={{
                strokeDashoffset: 24 * 2 * Math.PI * (1 - stats.percent / 100),
              }}
              className={cn(
                "text-green-500",
                stats.percent < 100 && "text-primary"
              )}
            />
          </svg>
          <span className="absolute inset-0 flex items-center justify-center text-sm font-medium">
            {stats.percent}%
          </span>
        </div>
      </div>

      {/* Path */}
      <div
        className={cn(
          orientation === "horizontal"
            ? "flex items-start gap-4 overflow-x-auto pb-4 pt-2"
            : "space-y-6"
        )}
      >
        {pathNodes.map((node, index) => (
          <PathNodeComponent
            key={node.id}
            node={node}
            index={index}
            total={pathNodes.length}
            orientation={orientation}
          />
        ))}
      </div>

      {/* Legend */}
      <div className="mt-6 pt-4 border-t border-border">
        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500 flex items-center justify-center">
              <CheckCircle2 className="w-2 h-2 text-green-500" />
            </div>
            <span>Completed</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-primary/20 border border-primary flex items-center justify-center">
              <Play className="w-2 h-2 text-primary" />
            </div>
            <span>Current</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-full bg-muted border border-muted-foreground/30 flex items-center justify-center">
              <Lock className="w-2 h-2 text-muted-foreground" />
            </div>
            <span>Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface RecommendedPathProps {
  courses: Course[];
  className?: string;
}

export function RecommendedPath({ courses, className }: RecommendedPathProps) {
  // Get next recommended modules based on progress
  const recommendations = useMemo(() => {
    const recs: { course: Course; module: Module; reason: string }[] = [];

    courses.forEach((course) => {
      const progress = getCourseProgress(course.id);
      const nextModuleIndex = progress.completedModules.length;

      if (nextModuleIndex < course.modules.length) {
        recs.push({
          course,
          module: course.modules[nextModuleIndex],
          reason:
            nextModuleIndex === 0
              ? "Start this course"
              : "Continue where you left off",
        });
      }
    });

    return recs.slice(0, 3);
  }, [courses]);

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <div className={cn("bg-card rounded-xl border border-border p-4", className)}>
      <div className="flex items-center gap-2 mb-4">
        <Sparkles className="w-5 h-5 text-amber-500" />
        <h3 className="font-semibold text-foreground">Recommended Next Steps</h3>
      </div>

      <div className="space-y-3">
        {recommendations.map(({ course, module, reason }) => (
          <Link
            key={module.id}
            href={`/courses/${course.id}/${module.id}`}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg transition-colors",
              "hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            <div
              className={cn(
                "w-10 h-10 rounded-lg flex items-center justify-center text-lg",
                "bg-gradient-to-br",
                course.coverColor
              )}
            >
              {course.icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {module.title}
              </p>
              <p className="text-xs text-muted-foreground">
                {course.title} • {reason}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default LearningPathViewer;
