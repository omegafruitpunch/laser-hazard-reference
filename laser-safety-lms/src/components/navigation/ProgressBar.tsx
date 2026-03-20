"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { CheckCircle2, Circle, Trophy, Clock, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "success" | "warning" | "error" | "gradient";
  showLabel?: boolean;
  labelPosition?: "inside" | "outside" | "tooltip";
  animated?: boolean;
  striped?: boolean;
  className?: string;
  ariaLabel?: string;
}

interface CircularProgressProps {
  value: number;
  max?: number;
  size?: number;
  strokeWidth?: number;
  variant?: "default" | "success" | "warning" | "error" | "gradient";
  showLabel?: boolean;
  className?: string;
  ariaLabel?: string;
}

interface StepProgressProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

const variantStyles = {
  default: "bg-primary",
  success: "bg-green-500",
  warning: "bg-amber-500",
  error: "bg-red-500",
  gradient: "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500",
};

const sizeStyles = {
  sm: "h-1.5",
  md: "h-2.5",
  lg: "h-4",
  xl: "h-6",
};

export function ProgressBar({
  value,
  max = 100,
  size = "md",
  variant = "default",
  showLabel = true,
  labelPosition = "outside",
  animated = true,
  striped = false,
  className,
  ariaLabel = "Progress",
}: ProgressBarProps) {
  const percentage = useMemo(() => {
    return Math.min(Math.max((value / max) * 100, 0), 100);
  }, [value, max]);

  const isComplete = percentage === 100;

  return (
    <div
      className={cn("w-full", className)}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${Math.round(percentage)}%`}
    >
      {/* Label outside */}
      {showLabel && labelPosition === "outside" && (
        <div className="flex items-center justify-between mb-1.5">
          <span className="text-sm font-medium text-foreground">
            {ariaLabel}
          </span>
          <div className="flex items-center gap-1.5">
            {isComplete && (
              <Trophy className="w-3.5 h-3.5 text-amber-500" aria-hidden="true" />
            )}
            <span className="text-sm font-medium tabular-nums text-muted-foreground">
              {Math.round(percentage)}%
            </span>
          </div>
        </div>
      )}

      {/* Track */}
      <div
        className={cn(
          "relative w-full overflow-hidden rounded-full bg-muted",
          sizeStyles[size]
        )}
      >
        {/* Fill */}
        <motion.div
          initial={animated ? { width: 0 } : false}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? { duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
              : undefined
          }
          className={cn(
            "h-full rounded-full transition-all",
            variantStyles[variant],
            striped && "progress-striped",
            animated && !striped && "transition-all duration-300"
          )}
        >
          {/* Striped pattern */}
          {striped && (
            <div
              className="absolute inset-0 opacity-30"
              style={{
                backgroundImage:
                  "linear-gradient(45deg, rgba(255,255,255,.15) 25%, transparent 25%, transparent 50%, rgba(255,255,255,.15) 50%, rgba(255,255,255,.15) 75%, transparent 75%, transparent)",
                backgroundSize: "1rem 1rem",
              }}
            />
          )}

          {/* Label inside */}
          {showLabel && labelPosition === "inside" && size !== "sm" && (
            <span className="absolute inset-0 flex items-center justify-center text-xs font-medium text-primary-foreground">
              {Math.round(percentage)}%
            </span>
          )}
        </motion.div>

        {/* Tooltip label */}
        {showLabel && labelPosition === "tooltip" && (
          <motion.div
            initial={animated ? { opacity: 0, y: 10 } : false}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-full mt-1.5 transform -translate-x-1/2"
            style={{ left: `${percentage}%` }}
          >
            <div className="relative">
              <div className="px-2 py-1 bg-popover text-popover-foreground text-xs font-medium rounded shadow-lg border border-border">
                {Math.round(percentage)}%
              </div>
              <div className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-popover border-t border-l border-border rotate-45" />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

export function CircularProgress({
  value,
  max = 100,
  size = 64,
  strokeWidth = 4,
  variant = "default",
  showLabel = true,
  className,
  ariaLabel = "Progress",
}: CircularProgressProps) {
  const percentage = useMemo(() => {
    return Math.min(Math.max((value / max) * 100, 0), 100);
  }, [value, max]);

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;
  const isComplete = percentage === 100;

  const colorClasses = {
    default: "text-primary",
    success: "text-green-500",
    warning: "text-amber-500",
    error: "text-red-500",
    gradient: "text-blue-500",
  };

  return (
    <div
      className={cn("relative inline-flex items-center justify-center", className)}
      role="progressbar"
      aria-label={ariaLabel}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={max}
      aria-valuetext={`${Math.round(percentage)}%`}
    >
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
        aria-hidden="true"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-muted"
        />
        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }}
          className={cn(colorClasses[variant])}
        />
      </svg>

      {/* Label */}
      {showLabel && (
        <div className="absolute inset-0 flex items-center justify-center">
          {isComplete ? (
            <CheckCircle2 className="w-6 h-6 text-green-500" />
          ) : (
            <span className="text-sm font-medium tabular-nums">{Math.round(percentage)}%</span>
          )}
        </div>
      )}
    </div>
  );
}

export function StepProgress({ steps, currentStep, className }: StepProgressProps) {
  return (
    <nav aria-label="Progress" className={cn("w-full", className)}>
      <ol className="flex items-center w-full" role="list">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isUpcoming = index > currentStep;

          return (
            <li
              key={step}
              className={cn(
                "flex items-center",
                index !== steps.length - 1 && "flex-1"
              )}
            >
              {/* Step indicator */}
              <div className="relative flex flex-col items-center">
                <motion.div
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                    backgroundColor: isCompleted
                      ? "rgb(34, 197, 94)"
                      : isCurrent
                      ? "hsl(var(--primary))"
                      : "hsl(var(--muted))",
                  }}
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center transition-colors",
                    isCompleted && "bg-green-500",
                    isCurrent && "bg-primary ring-4 ring-primary/20",
                    isUpcoming && "bg-muted"
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  ) : (
                    <span
                      className={cn(
                        "text-sm font-medium",
                        isCurrent ? "text-primary-foreground" : "text-muted-foreground"
                      )}
                    >
                      {index + 1}
                    </span>
                  )}
                </motion.div>

                {/* Step label */}
                <span
                  className={cn(
                    "absolute top-10 text-xs font-medium whitespace-nowrap",
                    isCurrent ? "text-foreground" : "text-muted-foreground"
                  )}
                >
                  {step}
                </span>
              </div>

              {/* Connector line */}
              {index !== steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 bg-muted overflow-hidden">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: isCompleted ? "100%" : "0%" }}
                    transition={{ duration: 0.3, delay: 0.1 }}
                    className="h-full bg-green-500"
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>

      {/* Spacer for labels */}
      <div className="h-8" />
    </nav>
  );
}

interface CourseProgressSummaryProps {
  completedModules: number;
  totalModules: number;
  estimatedMinutesRemaining: number;
  className?: string;
}

export function CourseProgressSummary({
  completedModules,
  totalModules,
  estimatedMinutesRemaining,
  className,
}: CourseProgressSummaryProps) {
  const percentage = Math.round((completedModules / totalModules) * 100);
  const isComplete = percentage === 100;

  return (
    <div className={cn("bg-card rounded-xl border border-border p-4", className)}>
      <div className="flex items-center gap-4">
        {/* Circular progress */}
        <CircularProgress
          value={completedModules}
          max={totalModules}
          size={72}
          strokeWidth={5}
          variant={isComplete ? "success" : "default"}
          showLabel={!isComplete}
          ariaLabel="Course completion"
        />

        {/* Stats */}
        <div className="flex-1 space-y-2">
          <div>
            <p className="text-sm font-medium text-foreground">
              {isComplete ? "Course Completed!" : "Continue Learning"}
            </p>
            <p className="text-xs text-muted-foreground">
              {completedModules} of {totalModules} modules done
            </p>
          </div>

          {!isComplete && estimatedMinutesRemaining > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              <span>{estimatedMinutesRemaining} min remaining</span>
            </div>
          )}

          {isComplete && (
            <div className="flex items-center gap-1.5 text-xs text-green-500">
              <Trophy className="w-3.5 h-3.5" />
              <span>Certificate earned!</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface StreakProgressProps {
  currentStreak: number;
  longestStreak: number;
  weeklyActivity: boolean[];
  className?: string;
}

export function StreakProgress({
  currentStreak,
  longestStreak,
  weeklyActivity,
  className,
}: StreakProgressProps) {
  const days = ["M", "T", "W", "T", "F", "S", "S"];

  return (
    <div className={cn("bg-card rounded-xl border border-border p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-500" />
          <div>
            <p className="text-lg font-bold text-foreground">{currentStreak}</p>
            <p className="text-xs text-muted-foreground">Day streak</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Best</p>
          <p className="text-sm font-medium text-foreground">{longestStreak} days</p>
        </div>
      </div>

      {/* Weekly activity */}
      <div className="flex justify-between" role="list" aria-label="Weekly activity">
        {days.map((day, index) => (
          <div key={index} className="flex flex-col items-center gap-1">
            <motion.div
              initial={weeklyActivity[index] ? { scale: 0 } : { scale: 1 }}
              animate={{ scale: 1 }}
              className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-colors",
                weeklyActivity[index]
                  ? "bg-green-500 text-white"
                  : "bg-muted text-muted-foreground"
              )}
              aria-label={`${day}: ${weeklyActivity[index] ? "Active" : "Inactive"}`}
            >
              {weeklyActivity[index] ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Circle className="w-4 h-4" />
              )}
            </motion.div>
            <span className="text-[10px] text-muted-foreground">{day}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressBar;
