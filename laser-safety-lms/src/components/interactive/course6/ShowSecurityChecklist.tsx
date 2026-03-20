"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  description: string;
  priority: "critical" | "high" | "medium";
  timing: string;
  completed: boolean;
}

interface TimelinePhase {
  id: string;
  name: string;
  timing: string;
  items: ChecklistItem[];
}

const timelinePhases: TimelinePhase[] = [
  {
    id: "pre-show",
    name: "Pre-Show (T-60 to T-0)",
    timing: "60 minutes before show",
    items: [
      {
        id: "ps-1",
        category: "Communications",
        task: "Establish radio contact with ATC",
        description: "Confirm 24/7 phone line to controlling facility is active",
        priority: "critical",
        timing: "T-60",
        completed: false,
      },
      {
        id: "ps-2",
        category: "Equipment",
        task: "Verify laser interlocks functional",
        description: "Test all safety interlocks and emergency stop systems",
        priority: "critical",
        timing: "T-45",
        completed: false,
      },
      {
        id: "ps-3",
        category: "Personnel",
        task: "Brief all operators on NOTAM",
        description: "Review Letter of Determination conditions with all operators",
        priority: "high",
        timing: "T-30",
        completed: false,
      },
      {
        id: "ps-4",
        category: "Safety",
        task: "Position safety observers",
        description: "All observation posts manned with clear sightlines",
        priority: "critical",
        timing: "T-15",
        completed: false,
      },
      {
        id: "ps-5",
        category: "Weather",
        task: "Check visibility conditions",
        description: "Verify cloud ceiling > 2,000 ft and visibility > 3 miles",
        priority: "high",
        timing: "T-10",
        completed: false,
      },
    ],
  },
  {
    id: "show",
    name: "Show Time (T-0 to T+Duration)",
    timing: "During laser operation",
    items: [
      {
        id: "sh-1",
        category: "Operations",
        task: "Maintain continuous ATC contact",
        description: "Keep phone line open with ATC during all operations",
        priority: "critical",
        timing: "Continuous",
        completed: false,
      },
      {
        id: "sh-2",
        category: "Safety",
        task: "Monitor for aircraft activity",
        description: "Safety observers report all aircraft within CFZ",
        priority: "critical",
        timing: "Continuous",
        completed: false,
      },
      {
        id: "sh-3",
        category: "Safety",
        task: "Enforce beam termination",
        description: "Ensure beams terminate on designated surfaces only",
        priority: "critical",
        timing: "Continuous",
        completed: false,
      },
      {
        id: "sh-4",
        category: "Operations",
        task: "Log all operations",
        description: "Record start/end times and any deviations",
        priority: "high",
        timing: "Continuous",
        completed: false,
      },
    ],
  },
  {
    id: "post-show",
    name: "Post-Show",
    timing: "After laser operations cease",
    items: [
      {
        id: "po-1",
        category: "Communications",
        task: "Notify ATC operations complete",
        description: "Inform controlling facility that laser operations have ended",
        priority: "critical",
        timing: "Immediate",
        completed: false,
      },
      {
        id: "po-2",
        category: "Documentation",
        task: "Complete operation log",
        description: "Document all events, aircraft sightings, and anomalies",
        priority: "high",
        timing: "Within 1 hour",
        completed: false,
      },
      {
        id: "po-3",
        category: "Equipment",
        task: "Secure laser systems",
        description: "Power down and secure all laser equipment",
        priority: "high",
        timing: "Immediate",
        completed: false,
      },
    ],
  },
];

export const ShowSecurityChecklist: React.FC = () => {
  const [phases, setPhases] = useState<TimelinePhase[]>(timelinePhases);
  const [activePhase, setActivePhase] = useState<string>("pre-show");
  const [showCompleted, setShowCompleted] = useState(false);

  const toggleItem = (phaseId: string, itemId: string) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              items: phase.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : phase
      )
    );
  };

  const getCompletionStats = () => {
    const allItems = phases.flatMap((p) => p.items);
    const completed = allItems.filter((i) => i.completed).length;
    const critical = allItems.filter((i) => i.priority === "critical" && !i.completed).length;
    return { total: allItems.length, completed, critical };
  };

  const stats = getCompletionStats();
  const progressPercent = (stats.completed / stats.total) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "text-red-600 bg-red-50 border-red-200";
      case "high":
        return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-muted-foreground bg-muted border-gray-200";
    }
  };

  if (showCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-10 h-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Checklist Complete!</h2>
          <p className="text-muted-foreground mb-6">
            You have completed all required safety checks for outdoor laser operations.
          </p>
          {stats.critical > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-700 font-medium">
                ⚠️ Warning: {stats.critical} critical item(s) remain unchecked
              </p>
            </div>
          )}
          <Button
            onClick={() => {
              setShowCompleted(false);
              setPhases(timelinePhases);
            }}
          >
            Reset Checklist
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Show Security Checklist</h2>
        <p className="text-muted-foreground">Timeline-based safety checklist for outdoor laser operations</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Overall Progress</span>
            <span className="text-sm text-muted-foreground">
              {stats.completed} of {stats.total} complete
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          {stats.critical > 0 && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ {stats.critical} critical item(s) pending
            </p>
          )}
        </CardContent>
      </Card>

      {/* Phase Tabs */}
      <div className="flex gap-2">
        {phases.map((phase) => {
          const phaseCompleted = phase.items.filter((i) => i.completed).length;
          const phaseTotal = phase.items.length;
          const isActive = activePhase === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={cn(
                "flex-1 p-4 rounded-lg border-2 text-left transition-all",
                isActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <span className={cn("font-semibold", isActive ? "text-blue-700" : "text-foreground")}>
                  {phase.name}
                </span>
                {phaseCompleted === phaseTotal && (
                  <svg className="w-5 h-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{phase.timing}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {phaseCompleted}/{phaseTotal} complete
              </p>
            </button>
          );
        })}
      </div>

      {/* Checklist Items */}
      <Card>
        <CardHeader>
          <CardTitle>
            {phases.find((p) => p.id === activePhase)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {phases
              .find((p) => p.id === activePhase)
              ?.items.map((item) => (
                <div
                  key={item.id}
                  onClick={() => toggleItem(activePhase, item.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    item.completed
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 bg-card"
                  )}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                        item.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      )}
                    >
                      {item.completed && (
                        <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{item.task}</span>
                        <span
                          className={cn(
                            "text-xs px-2 py-0.5 rounded-full border",
                            getPriorityColor(item.priority)
                          )}
                        >
                          {item.priority.toUpperCase()}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>🕐 {item.timing}</span>
                        <span>📂 {item.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="flex justify-center">
        <Button size="lg" onClick={() => setShowCompleted(true)}>
          Complete Checklist Review
        </Button>
      </div>
    </div>
  );
};

export default ShowSecurityChecklist;
