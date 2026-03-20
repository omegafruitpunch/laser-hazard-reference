"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Progress, ProgressTrack, ProgressIndicator, ProgressLabel, ProgressValue } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, Circle, Play, Trophy } from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ModulePhase = "warmup" | "core" | "practice" | "challenge";

export interface ModuleSection {
  id: string;
  phase: ModulePhase;
  title: string;
  description: string;
  isCompleted: boolean;
  isActive: boolean;
}

export interface ModuleContainerProps {
  children: ReactNode;
  moduleId: string;
  moduleTitle: string;
  estimatedMinutes: number;
  className?: string;
}

interface ModuleContextType {
  currentPhase: ModulePhase;
  setCurrentPhase: (phase: ModulePhase) => void;
  completedPhases: ModulePhase[];
  markPhaseComplete: (phase: ModulePhase) => void;
  moduleProgress: number;
}

// ============================================================================
// Context
// ============================================================================

const ModuleContext = createContext<ModuleContextType | undefined>(undefined);

export function useModule() {
  const context = useContext(ModuleContext);
  if (!context) {
    throw new Error("useModule must be used within a ModuleContainer");
  }
  return context;
}

// ============================================================================
// Phase Configuration
// ============================================================================

const PHASE_CONFIG: Record<ModulePhase, { label: string; icon: React.ReactNode; color: string }> = {
  warmup: {
    label: "Warm-Up",
    icon: <Play className="w-4 h-4" />,
    color: "bg-blue-500",
  },
  core: {
    label: "Core Concepts",
    icon: <Circle className="w-4 h-4" />,
    color: "bg-purple-500",
  },
  practice: {
    label: "Guided Practice",
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "bg-amber-500",
  },
  challenge: {
    label: "Challenge",
    icon: <Trophy className="w-4 h-4" />,
    color: "bg-red-500",
  },
};

const PHASE_ORDER: ModulePhase[] = ["warmup", "core", "practice", "challenge"];

// ============================================================================
// Main Component
// ============================================================================

export function ModuleContainer({
  children,
  moduleId,
  moduleTitle,
  estimatedMinutes,
  className,
}: ModuleContainerProps) {
  const [currentPhase, setCurrentPhase] = useState<ModulePhase>("warmup");
  const [completedPhases, setCompletedPhases] = useState<ModulePhase[]>([]);

  const markPhaseComplete = (phase: ModulePhase) => {
    if (!completedPhases.includes(phase)) {
      setCompletedPhases((prev) => [...prev, phase]);
    }
    // Auto-advance to next phase
    const currentIndex = PHASE_ORDER.indexOf(phase);
    if (currentIndex < PHASE_ORDER.length - 1) {
      setCurrentPhase(PHASE_ORDER[currentIndex + 1]);
    }
  };

  const moduleProgress = (completedPhases.length / PHASE_ORDER.length) * 100;

  return (
    <ModuleContext.Provider
      value={{
        currentPhase,
        setCurrentPhase,
        completedPhases,
        markPhaseComplete,
        moduleProgress,
      }}
    >
      <div className={cn("space-y-6", className)}>
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div>
              <Badge variant="secondary" className="mb-2">
                Module {moduleId}
              </Badge>
              <h1 className="text-2xl font-bold text-foreground">{moduleTitle}</h1>
            </div>
            <div className="text-right text-sm text-muted-foreground">
              <div>Estimated time</div>
              <div className="font-medium text-foreground">{estimatedMinutes} min</div>
            </div>
          </div>

          {/* Progress Bar */}
          <Progress value={moduleProgress} className="w-full">
            <ProgressLabel>Module Progress</ProgressLabel>
            <ProgressValue>{(formattedValue) => formattedValue || `${Math.round(moduleProgress)}%`}</ProgressValue>
          </Progress>

          {/* Phase Navigation */}
          <PhaseNavigator
            currentPhase={currentPhase}
            completedPhases={completedPhases}
            onPhaseSelect={setCurrentPhase}
          />
        </div>

        {/* Content */}
        <div className="min-h-[400px]">{children}</div>
      </div>
    </ModuleContext.Provider>
  );
}

// ============================================================================
// Phase Navigator
// ============================================================================

interface PhaseNavigatorProps {
  currentPhase: ModulePhase;
  completedPhases: ModulePhase[];
  onPhaseSelect: (phase: ModulePhase) => void;
}

function PhaseNavigator({ currentPhase, completedPhases, onPhaseSelect }: PhaseNavigatorProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {PHASE_ORDER.map((phase, index) => {
        const config = PHASE_CONFIG[phase];
        const isCompleted = completedPhases.includes(phase);
        const isActive = currentPhase === phase;
        const isLocked = index > 0 && !completedPhases.includes(PHASE_ORDER[index - 1]) && !isActive;

        return (
          <button
            key={phase}
            onClick={() => !isLocked && onPhaseSelect(phase)}
            disabled={isLocked}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              "border border-border/50",
              isActive && "bg-primary text-primary-foreground border-primary",
              isCompleted && !isActive && "bg-secondary text-secondary-foreground",
              !isActive && !isCompleted && !isLocked && "bg-card hover:bg-muted",
              isLocked && "opacity-50 cursor-not-allowed bg-muted"
            )}
          >
            <span className={cn("w-2 h-2 rounded-full", config.color)} />
            {config.icon}
            <span>{config.label}</span>
            {isCompleted && <CheckCircle2 className="w-3 h-3 ml-1" />}
          </button>
        );
      })}
    </div>
  );
}

// ============================================================================
// Phase Wrapper Components
// ============================================================================

interface PhaseWrapperProps {
  children: ReactNode;
  phase: ModulePhase;
  title?: string;
  description?: string;
}

export function PhaseSection({ children, phase, title, description }: PhaseWrapperProps) {
  const { currentPhase, markPhaseComplete } = useModule();
  const config = PHASE_CONFIG[phase];

  if (currentPhase !== phase) {
    return null;
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {(title || description) && (
        <div className="border-l-4 border-l-primary pl-4">
          {title && <h2 className="text-xl font-semibold text-foreground">{title}</h2>}
          {description && <p className="text-muted-foreground mt-1">{description}</p>}
        </div>
      )}
      
      <div className="relative">
        <div className={cn("absolute left-0 top-0 bottom-0 w-1 rounded-full", config.color)} />
        <div className="pl-6">{children}</div>
      </div>

      {/* Complete Phase Button */}
      <div className="flex justify-end pt-4 border-t border-border/50">
        <button
          onClick={() => markPhaseComplete(phase)}
          className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          Complete {config.label} →
        </button>
      </div>
    </div>
  );
}

// Convenience exports for specific phases
export function WarmUpSection({ children, title, description }: Omit<PhaseWrapperProps, "phase">) {
  return (
    <PhaseSection phase="warmup" title={title || "Warm-Up"} description={description}>
      {children}
    </PhaseSection>
  );
}

export function CoreConceptSection({ children, title, description }: Omit<PhaseWrapperProps, "phase">) {
  return (
    <PhaseSection phase="core" title={title || "Core Concepts"} description={description}>
      {children}
    </PhaseSection>
  );
}

export function GuidedPracticeSection({ children, title, description }: Omit<PhaseWrapperProps, "phase">) {
  return (
    <PhaseSection phase="practice" title={title || "Guided Practice"} description={description}>
      {children}
    </PhaseSection>
  );
}

export function ChallengeSection({ children, title, description }: Omit<PhaseWrapperProps, "phase">) {
  return (
    <PhaseSection phase="challenge" title={title || "Challenge"} description={description}>
      {children}
    </PhaseSection>
  );
}

export default ModuleContainer;
