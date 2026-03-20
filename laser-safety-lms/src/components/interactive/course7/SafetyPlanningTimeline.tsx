"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  text: string;
  priority: "critical" | "high" | "medium";
  category: string;
  completed: boolean;
}

interface TimelinePhase {
  id: string;
  name: string;
  timeline: string;
  description: string;
  items: ChecklistItem[];
}

const timelinePhases: TimelinePhase[] = [
  {
    id: "concept",
    name: "Concept Phase",
    timeline: "6-12 months before event",
    description: "Initial planning and feasibility assessment",
    items: [
      { id: "c1", text: "Define event scope and objectives", priority: "critical", category: "Planning", completed: false },
      { id: "c2", text: "Identify key stakeholders", priority: "critical", category: "Planning", completed: false },
      { id: "c3", text: "Conduct initial risk assessment", priority: "high", category: "Safety", completed: false },
      { id: "c4", text: "Establish budget for safety measures", priority: "high", category: "Finance", completed: false },
      { id: "c5", text: "Research venue options", priority: "medium", category: "Venue", completed: false },
    ],
  },
  {
    id: "pre-production",
    name: "Pre-Production",
    timeline: "3-6 months before event",
    description: "Detailed planning and vendor selection",
    items: [
      { id: "p1", text: "Select and book venue", priority: "critical", category: "Venue", completed: false },
      { id: "p2", text: "Conduct venue safety assessment", priority: "critical", category: "Safety", completed: false },
      { id: "p3", text: "Hire certified safety coordinator", priority: "critical", category: "Personnel", completed: false },
      { id: "p4", text: "Obtain necessary permits", priority: "critical", category: "Legal", completed: false },
      { id: "p5", text: "Contract security services", priority: "high", category: "Security", completed: false },
      { id: "p6", text: "Arrange medical/EMS coverage", priority: "high", category: "Medical", completed: false },
      { id: "p7", text: "Secure insurance coverage", priority: "high", category: "Finance", completed: false },
      { id: "p8", text: "Develop emergency action plan", priority: "critical", category: "Safety", completed: false },
    ],
  },
  {
    id: "load-in",
    name: "Load-In Phase",
    timeline: "1-7 days before event",
    description: "Setup and pre-event inspections",
    items: [
      { id: "l1", text: "Conduct pre-load safety briefing", priority: "critical", category: "Safety", completed: false },
      { id: "l2", text: "Inspect all staging and structures", priority: "critical", category: "Structures", completed: false },
      { id: "l3", text: "Test all emergency systems", priority: "critical", category: "Safety", completed: false },
      { id: "l4", text: "Verify emergency egress paths", priority: "critical", category: "Safety", completed: false },
      { id: "l5", text: "Position emergency equipment", priority: "high", category: "Medical", completed: false },
      { id: "l6", text: "Establish command post location", priority: "high", category: "Operations", completed: false },
      { id: "l7", text: "Test communication systems", priority: "high", category: "Communications", completed: false },
    ],
  },
  {
    id: "show",
    name: "Show Day",
    timeline: "Day of event",
    description: "Event operations and monitoring",
    items: [
      { id: "s1", text: "Conduct safety walkthrough", priority: "critical", category: "Safety", completed: false },
      { id: "s2", text: "Brief all staff on emergency procedures", priority: "critical", category: "Safety", completed: false },
      { id: "s3", text: "Activate incident command structure", priority: "critical", category: "Operations", completed: false },
      { id: "s4", text: "Monitor weather conditions", priority: "high", category: "Weather", completed: false },
      { id: "s5", text: "Maintain security perimeter", priority: "high", category: "Security", completed: false },
      { id: "s6", text: "Have EMS on standby", priority: "critical", category: "Medical", completed: false },
    ],
  },
  {
    id: "load-out",
    name: "Load-Out Phase",
    timeline: "After event",
    description: "Safe breakdown and post-event review",
    items: [
      { id: "o1", text: "Secure all hazardous materials", priority: "critical", category: "Safety", completed: false },
      { id: "o2", text: "Document any incidents", priority: "high", category: "Documentation", completed: false },
      { id: "o3", text: "Conduct post-event safety debrief", priority: "medium", category: "Safety", completed: false },
      { id: "o4", text: "Review and update safety plans", priority: "medium", category: "Planning", completed: false },
    ],
  },
];

export const SafetyPlanningTimeline: React.FC = () => {
  const [phases, setPhases] = useState<TimelinePhase[]>(timelinePhases);
  const [activePhase, setActivePhase] = useState<string>("concept");

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
    const criticalPending = allItems.filter((i) => i.priority === "critical" && !i.completed).length;
    return { total: allItems.length, completed, criticalPending };
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

  const activePhaseData = phases.find((p) => p.id === activePhase);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Safety Planning Timeline</h2>
        <p className="text-muted-foreground">5-phase planning checklist for event safety</p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Overall Completion</span>
            <span className="text-sm text-muted-foreground">
              {stats.completed} of {stats.total} items
            </span>
          </div>
          <Progress value={progressPercent} className="h-2" />
          {stats.criticalPending > 0 && (
            <p className="text-sm text-red-600 mt-2">⚠️ {stats.criticalPending} critical items pending</p>
          )}
        </CardContent>
      </Card>

      {/* Phase Navigation */}
      <div className="grid grid-cols-5 gap-2">
        {phases.map((phase) => {
          const completed = phase.items.filter((i) => i.completed).length;
          const total = phase.items.length;
          const isActive = activePhase === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all",
                isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-card"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn("font-semibold text-sm", isActive ? "text-blue-700" : "text-foreground")}>
                  {phase.name}
                </span>
                {completed === total && <span className="text-green-500 text-xs">✓</span>}
              </div>
              <p className="text-xs text-muted-foreground">{phase.timeline}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                {completed}/{total} complete
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase */}
      <Card>
        <CardHeader>
          <CardTitle>{activePhaseData?.name}</CardTitle>
          <CardDescription>{activePhaseData?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {activePhaseData?.items.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleItem(activePhase, item.id)}
                className={cn(
                  "p-4 rounded-lg border-2 cursor-pointer transition-all",
                  item.completed ? "border-green-200 bg-green-50" : "border-gray-200 hover:border-gray-300 bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      item.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                    )}
                  >
                    {item.completed && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn("font-medium", item.completed ? "text-muted-foreground line-through" : "text-foreground")}>
                        {item.text}
                      </span>
                      <span className={cn("text-xs px-2 py-0.5 rounded-full border", getPriorityColor(item.priority))}>
                        {item.priority}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">{item.category}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyPlanningTimeline;
