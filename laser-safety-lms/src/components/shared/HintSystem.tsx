"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Lightbulb, ChevronRight, Eye, EyeOff, Sparkles } from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type HintLevel = 1 | 2 | 3;

export interface Hint {
  level: HintLevel;
  content: string;
  triggerWord?: string;
}

export interface HintSystemProps {
  hints: Hint[];
  maxRevealedLevel?: number;
  onHintRevealed?: (level: HintLevel) => void;
  onSolutionRevealed?: () => void;
  className?: string;
  allowSkipToSolution?: boolean;
  solutionContent?: React.ReactNode;
}

export interface ProgressiveHintProps {
  context: string;
  hint1: string;
  hint2: string;
  hint3: string;
  className?: string;
}

// ============================================================================
// Main Component
// ============================================================================

export function HintSystem({
  hints,
  maxRevealedLevel = 3,
  onHintRevealed,
  onSolutionRevealed,
  className,
  allowSkipToSolution = true,
  solutionContent,
}: HintSystemProps) {
  const [revealedLevels, setRevealedLevels] = useState<Set<HintLevel>>(new Set());
  const [showSolution, setShowSolution] = useState(false);

  const revealHint = useCallback((level: HintLevel) => {
    if (level > maxRevealedLevel) return;
    
    setRevealedLevels((prev) => {
      const next = new Set(prev);
      next.add(level);
      return next;
    });
    
    onHintRevealed?.(level);
  }, [maxRevealedLevel, onHintRevealed]);

  const revealSolution = useCallback(() => {
    setShowSolution(true);
    onSolutionRevealed?.();
  }, [onSolutionRevealed]);

  const nextHintLevel = (Math.max(...Array.from(revealedLevels), 0) + 1) as HintLevel;
  const canRevealMore = nextHintLevel <= maxRevealedLevel && nextHintLevel <= hints.length;

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-amber-400" />
          <h3 className="font-semibold">Need a Hint?</h3>
        </div>
        <div className="flex gap-1">
          {[1, 2, 3].map((level) => (
            <div
              key={level}
              className={cn(
                "w-6 h-1.5 rounded-full transition-colors",
                revealedLevels.has(level as HintLevel)
                  ? "bg-amber-400"
                  : "bg-muted"
              )}
            />
          ))}
        </div>
      </div>

      {/* Revealed Hints */}
      <div className="space-y-3">
        {hints
          .filter((h) => revealedLevels.has(h.level))
          .sort((a, b) => a.level - b.level)
          .map((hint) => (
            <HintCard key={hint.level} hint={hint} />
          ))}
      </div>

      {/* Controls */}
      {!showSolution && (
        <div className="flex flex-wrap gap-2">
          {canRevealMore && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => revealHint(nextHintLevel)}
              className="flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              Reveal Hint {nextHintLevel}
            </Button>
          )}
          
          {allowSkipToSolution && (
            <Button
              variant="ghost"
              size="sm"
              onClick={revealSolution}
              className="text-muted-foreground hover:text-foreground"
            >
              <Eye className="w-4 h-4 mr-1" />
              Show Solution
            </Button>
          )}
        </div>
      )}

      {/* Solution */}
      {showSolution && solutionContent && (
        <div className="rounded-lg border border-primary/30 bg-primary/5 p-4 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-2 mb-2 text-primary">
            <Eye className="w-4 h-4" />
            <span className="font-medium">Solution</span>
          </div>
          <div className="text-foreground">{solutionContent}</div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Hint Card
// ============================================================================

interface HintCardProps {
  hint: Hint;
}

function HintCard({ hint }: HintCardProps) {
  const levelLabels: Record<HintLevel, string> = {
    1: "Nudge",
    2: "Guidance",
    3: "Detailed Help",
  };

  const levelColors: Record<HintLevel, string> = {
    1: "bg-green-500/10 border-green-500/20 text-green-400",
    2: "bg-amber-500/10 border-amber-500/20 text-amber-400",
    3: "bg-orange-500/10 border-orange-500/20 text-orange-400",
  };

  return (
    <div
      className={cn(
        "rounded-lg border p-4 animate-in fade-in slide-in-from-left-2",
        levelColors[hint.level]
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="outline" className="text-xs">
          {levelLabels[hint.level]}
        </Badge>
        {hint.triggerWord && (
          <span className="text-xs opacity-70">Trigger: &quot;{hint.triggerWord}&quot;</span>
        )}
      </div>
      <p className="text-foreground">{hint.content}</p>
    </div>
  );
}

// ============================================================================
// Progressive Hint (Simplified API)
// ============================================================================

export function ProgressiveHint({
  context,
  hint1,
  hint2,
  hint3,
  className,
}: ProgressiveHintProps) {
  const hints: Hint[] = [
    { level: 1, content: hint1 },
    { level: 2, content: hint2 },
    { level: 3, content: hint3 },
  ];

  return (
    <div className={cn("space-y-4", className)}>
      <p className="text-muted-foreground">{context}</p>
      <HintSystem hints={hints} />
    </div>
  );
}

// ============================================================================
// Contextual Hint Trigger
// ============================================================================

export interface ContextualHintProps {
  children: React.ReactNode;
  hints: Hint[];
  trigger?: "hover" | "click" | "always-visible";
  position?: "top" | "bottom" | "left" | "right";
}

export function ContextualHint({
  children,
  hints,
  trigger = "click",
  position = "bottom",
}: ContextualHintProps) {
  const [isOpen, setIsOpen] = useState(trigger === "always-visible");

  const positionClasses = {
    top: "bottom-full mb-2",
    bottom: "top-full mt-2",
    left: "right-full mr-2",
    right: "left-full ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onClick={() => trigger === "click" && setIsOpen(!isOpen)}
        onMouseEnter={() => trigger === "hover" && setIsOpen(true)}
        onMouseLeave={() => trigger === "hover" && setIsOpen(false)}
        className={trigger === "click" ? "cursor-pointer" : ""}
      >
        {children}
      </div>
      
      {isOpen && (
        <div
          className={cn(
            "absolute z-50 w-80",
            positionClasses[position]
          )}
        >
          <div className="bg-card border border-border/50 rounded-xl shadow-lg p-4">
            <HintSystem hints={hints} allowSkipToSolution={false} />
          </div>
        </div>
      )}
    </div>
  );
}

export default HintSystem;
