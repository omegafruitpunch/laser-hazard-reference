"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Circle,
  Clock,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  FileText,
  Lightbulb,
  HelpCircle,
  PanelLeftClose,
  PanelLeft,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Course, Module } from "@/types";
import { getCourseProgress, isModuleComplete } from "@/lib/progress";
import { Button } from "@/components/ui/button";

interface ModuleSidebarProps {
  course: Course;
  currentModuleId: string;
  className?: string;
  onCollapse?: (collapsed: boolean) => void;
}

type Phase = "learn" | "practice" | "assess" | "review";

interface PhaseIndicatorProps {
  phase: Phase;
  isActive: boolean;
  isComplete: boolean;
  label: string;
}

function PhaseIndicator({ phase, isActive, isComplete, label }: PhaseIndicatorProps) {
  const icons = {
    learn: BookOpen,
    practice: Lightbulb,
    assess: HelpCircle,
    review: FileText,
  };
  const Icon = icons[phase];

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors",
        isActive && "bg-primary/10",
        isComplete && !isActive && "text-green-500"
      )}
    >
      <div
        className={cn(
          "w-8 h-8 rounded-full flex items-center justify-center",
          isActive
            ? "bg-primary text-primary-foreground"
            : isComplete
            ? "bg-green-500/20 text-green-500"
            : "bg-muted text-muted-foreground"
        )}
      >
        {isComplete ? <CheckCircle2 className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
      </div>
      <span
        className={cn(
          "text-[10px] font-medium",
          isActive ? "text-primary" : "text-muted-foreground"
        )}
      >
        {label}
      </span>
    </div>
  );
}

interface ModuleItemProps {
  courseId: string;
  module: Module;
  index: number;
  isActive: boolean;
  isLocked: boolean;
  onSelect?: () => void;
}

function ModuleItem({
  courseId,
  module,
  index,
  isActive,
  isLocked,
  onSelect,
}: ModuleItemProps) {
  const isComplete = isModuleComplete(courseId, module.id);

  return (
    <li>
      <Link
        href={isLocked ? "#" : `/courses/${courseId}/${module.id}`}
        onClick={(e) => {
          if (isLocked) {
            e.preventDefault();
            return;
          }
          onSelect?.();
        }}
        className={cn(
          "flex items-start gap-3 px-3 py-2.5 text-sm rounded-lg transition-colors",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          isActive && "bg-primary/10 text-primary",
          !isActive && !isLocked && "hover:bg-muted/80 text-muted-foreground",
          isLocked && "opacity-50 cursor-not-allowed"
        )}
        aria-current={isActive ? "page" : undefined}
        aria-disabled={isLocked}
      >
        {/* Status indicator */}
        <div className="flex-shrink-0 mt-0.5">
          {isLocked ? (
            <Lock className="w-4 h-4 text-muted-foreground" aria-hidden="true" />
          ) : isComplete ? (
            <CheckCircle2
              className="w-4 h-4 text-green-500"
              aria-hidden="true"
            />
          ) : (
            <span
              className={cn(
                "w-4 h-4 rounded-full border-2 flex items-center justify-center text-[9px] font-medium",
                isActive
                  ? "border-primary text-primary"
                  : "border-muted-foreground/40 text-muted-foreground"
              )}
              aria-hidden="true"
            >
              {index + 1}
            </span>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={cn(
              "font-medium truncate",
              isActive ? "text-primary" : "text-foreground"
            )}
          >
            {module.title}
          </p>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className="text-xs text-muted-foreground flex items-center gap-1"
              aria-label={`${module.estimatedMinutes} minutes`}
            >
              <Clock className="w-3 h-3" />
              {module.estimatedMinutes}m
            </span>
            {isComplete && (
              <span className="text-xs text-green-500">Complete</span>
            )}
          </div>
        </div>
      </Link>
    </li>
  );
}

export function ModuleSidebar({
  course,
  currentModuleId,
  className,
  onCollapse,
}: ModuleSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const courseProgress = getCourseProgress(course.id);

  // Calculate current module index
  const currentModuleIndex = course.modules.findIndex(
    (m) => m.id === currentModuleId
  );

  // Determine if each module is locked (sequential unlocking)
  const isModuleLocked = (index: number) => {
    if (index === 0) return false;
    const prevModule = course.modules[index - 1];
    return !isModuleComplete(course.id, prevModule.id);
  };

  // Calculate phase based on progress
  const getCurrentPhase = (): Phase => {
    if (currentModuleIndex < 0) return "learn";
    const progress = (currentModuleIndex + 1) / course.modules.length;
    if (progress >= 0.9) return "review";
    if (progress >= 0.7) return "assess";
    if (progress >= 0.4) return "practice";
    return "learn";
  };

  const currentPhase = getCurrentPhase();

  const handleToggleCollapse = () => {
    const newState = !collapsed;
    setCollapsed(newState);
    onCollapse?.(newState);
  };

  // Close mobile menu on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Collapsed state rendering
  if (collapsed) {
    return (
      <>
        {/* Mobile toggle */}
        <Button
          variant="outline"
          size="icon"
          className="fixed left-4 top-20 z-40 lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open module navigation"
        >
          <PanelLeft className="w-4 h-4" />
        </Button>

        {/* Mobile overlay */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                onClick={() => setMobileOpen(false)}
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                className="fixed left-0 top-0 bottom-0 w-80 bg-card z-50 lg:hidden overflow-y-auto"
              >
                <ExpandedContent
                  course={course}
                  currentModuleId={currentModuleId}
                  currentPhase={currentPhase}
                  currentModuleIndex={currentModuleIndex}
                  isModuleLocked={isModuleLocked}
                  onCollapse={() => setMobileOpen(false)}
                />
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Desktop collapsed sidebar */}
        <aside
          className={cn(
            "hidden lg:flex flex-col w-14 bg-card border-r border-border",
            className
          )}
          aria-label="Module navigation collapsed"
        >
          <div className="flex-1 py-4 flex flex-col items-center gap-2">
            {course.modules.map((module, index) => {
              const isComplete = isModuleComplete(course.id, module.id);
              const isActive = module.id === currentModuleId;
              const isLocked = isModuleLocked(index);

              return (
                <Link
                  key={module.id}
                  href={isLocked ? "#" : `/courses/${course.id}/${module.id}`}
                  className={cn(
                    "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                    isActive && "bg-primary text-primary-foreground",
                    isComplete && !isActive && "bg-green-500/20 text-green-500",
                    !isActive && !isComplete && !isLocked && "bg-muted text-muted-foreground hover:bg-muted/80",
                    isLocked && "opacity-50 cursor-not-allowed"
                  )}
                  title={`${index + 1}. ${module.title}${isLocked ? " (Locked)" : ""}`}
                  aria-label={`${index + 1}. ${module.title}${isLocked ? " (Locked)" : ""}`}
                  aria-current={isActive ? "page" : undefined}
                  aria-disabled={isLocked}
                >
                  {isComplete ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-xs font-medium">{index + 1}</span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Expand button */}
          <div className="p-2 border-t border-border">
            <Button
              variant="ghost"
              size="icon"
              className="w-full"
              onClick={handleToggleCollapse}
              aria-label="Expand sidebar"
            >
              <PanelLeft className="w-4 h-4" />
            </Button>
          </div>
        </aside>
      </>
    );
  }

  // Expanded sidebar
  return (
    <>
      {/* Mobile toggle */}
      <Button
        variant="outline"
        size="icon"
        className="fixed left-4 top-20 z-40 lg:hidden"
        onClick={() => setMobileOpen(true)}
        aria-label="Open module navigation"
      >
        <PanelLeft className="w-4 h-4" />
      </Button>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              className="fixed left-0 top-0 bottom-0 w-80 bg-card z-50 lg:hidden overflow-y-auto"
            >
              <ExpandedContent
                course={course}
                currentModuleId={currentModuleId}
                currentPhase={currentPhase}
                currentModuleIndex={currentModuleIndex}
                isModuleLocked={isModuleLocked}
                onCollapse={() => setMobileOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop expanded sidebar */}
      <aside
        className={cn(
          "hidden lg:block w-72 bg-card border-r border-border overflow-hidden",
          className
        )}
        aria-label="Module navigation"
      >
        <ExpandedContent
          course={course}
          currentModuleId={currentModuleId}
          currentPhase={currentPhase}
          currentModuleIndex={currentModuleIndex}
          isModuleLocked={isModuleLocked}
          onCollapse={handleToggleCollapse}
          onModuleSelect={() => {}}
        />
      </aside>
    </>
  );
}

interface ExpandedContentProps {
  course: Course;
  currentModuleId: string;
  currentPhase: Phase;
  currentModuleIndex: number;
  isModuleLocked: (index: number) => boolean;
  onCollapse: () => void;
  onModuleSelect?: () => void;
}

function ExpandedContent({
  course,
  currentModuleId,
  currentPhase,
  currentModuleIndex,
  isModuleLocked,
  onCollapse,
  onModuleSelect,
}: ExpandedContentProps) {
  const courseProgress = getCourseProgress(course.id);
  const completedCount = courseProgress.completedModules.length;
  const progressPercent = Math.round((completedCount / course.modules.length) * 100);

  // Navigation links
  const prevModule = currentModuleIndex > 0 ? course.modules[currentModuleIndex - 1] : null;
  const nextModule =
    currentModuleIndex < course.modules.length - 1
      ? course.modules[currentModuleIndex + 1]
      : null;

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border bg-muted/30">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <Link
              href={`/courses/${course.id}`}
              className="text-xs text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1"
            >
              <ChevronLeft className="w-3 h-3" />
              {course.title}
            </Link>
            <h2 className="font-semibold text-foreground mt-1 truncate">
              Module {currentModuleIndex + 1} of {course.modules.length}
            </h2>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="flex-shrink-0"
            onClick={onCollapse}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="w-4 h-4" />
          </Button>
        </div>

        {/* Progress */}
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
            <span>Course Progress</span>
            <span>{progressPercent}%</span>
          </div>
          <div
            className="h-2 bg-muted rounded-full overflow-hidden"
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
          <p className="text-xs text-muted-foreground mt-1">
            {completedCount} of {course.modules.length} modules completed
          </p>
        </div>
      </div>

      {/* Phase indicators */}
      <div className="px-4 py-3 border-b border-border">
        <div className="grid grid-cols-4 gap-1">
          <PhaseIndicator
            phase="learn"
            label="Learn"
            isActive={currentPhase === "learn"}
            isComplete={currentPhase !== "learn"}
          />
          <PhaseIndicator
            phase="practice"
            label="Practice"
            isActive={currentPhase === "practice"}
            isComplete={currentPhase === "assess" || currentPhase === "review"}
          />
          <PhaseIndicator
            phase="assess"
            label="Assess"
            isActive={currentPhase === "assess"}
            isComplete={currentPhase === "review"}
          />
          <PhaseIndicator
            phase="review"
            label="Review"
            isActive={currentPhase === "review"}
            isComplete={progressPercent === 100}
          />
        </div>
      </div>

      {/* Module list */}
      <div className="flex-1 overflow-y-auto py-2">
        <ul className="space-y-0.5 px-2" role="list">
          {course.modules.map((module, index) => (
            <ModuleItem
              key={module.id}
              courseId={course.id}
              module={module}
              index={index}
              isActive={module.id === currentModuleId}
              isLocked={isModuleLocked(index)}
              onSelect={onModuleSelect}
            />
          ))}
        </ul>
      </div>

      {/* Footer navigation */}
      <div className="p-4 border-t border-border bg-muted/30">
        <div className="flex gap-2">
          {prevModule ? (
            <Link
              href={`/courses/${course.id}/${prevModule.id}`}
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Prev
              </Button>
            </Link>
          ) : (
            <Button variant="outline" size="sm" className="flex-1" disabled>
              <ChevronLeft className="w-4 h-4 mr-1" />
              Prev
            </Button>
          )}

          {nextModule ? (
            <Link
              href={`/courses/${course.id}/${nextModule.id}`}
              className="flex-1"
            >
              <Button variant="outline" size="sm" className="w-full">
                Next
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          ) : (
            <Link href={`/quiz/${course.id}`} className="flex-1">
              <Button variant="default" size="sm" className="w-full">
                Quiz
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default ModuleSidebar;
