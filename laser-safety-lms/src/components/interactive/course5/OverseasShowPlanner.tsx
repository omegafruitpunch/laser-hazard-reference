"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator, ProgressValue } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Plane, 
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  FileText,
  Package,
  Users,
  Shield,
  RotateCcw,
  Download
} from "lucide-react";

interface PlanningStage {
  id: number;
  title: string;
  timeline: string;
  description: string;
  tasks: {
    id: string;
    text: string;
    completed: boolean;
    critical: boolean;
  }[];
}

const planningStages: PlanningStage[] = [
  {
    id: 1,
    title: "Initial Research & Assessment",
    timeline: "8-12 weeks before",
    description: "Identify requirements and make initial contacts",
    tasks: [
      { id: "s1-1", text: "Identify ILDA country category (A, B, F, G, X)", completed: false, critical: true },
      { id: "s1-2", text: "Research local laser safety regulations", completed: false, critical: true },
      { id: "s1-3", text: "Contact regulatory authorities", completed: false, critical: true },
      { id: "s1-4", text: "Assess import procedures (ATA Carnet needed?)", completed: false, critical: true },
      { id: "s1-5", text: "Evaluate power compatibility", completed: false, critical: false },
      { id: "s1-6", text: "Research venue requirements", completed: false, critical: false },
    ],
  },
  {
    id: 2,
    title: "Permit Applications",
    timeline: "6-8 weeks before",
    description: "Submit all required permit applications",
    tasks: [
      { id: "s2-1", text: "Submit laser show permit application", completed: false, critical: true },
      { id: "s2-2", text: "Obtain venue approvals", completed: false, critical: true },
      { id: "s2-3", text: "Apply for import authorizations", completed: false, critical: true },
      { id: "s2-4", text: "Secure work permits/visas for crew", completed: false, critical: true },
      { id: "s2-5", text: "Arrange local insurance", completed: false, critical: false },
      { id: "s2-6", text: "Confirm local LSO requirements", completed: false, critical: false },
    ],
  },
  {
    id: 3,
    title: "Documentation Package",
    timeline: "4-6 weeks before",
    description: "Prepare and organize all required documents",
    tasks: [
      { id: "s3-1", text: "Translate key documents to local language", completed: false, critical: true },
      { id: "s3-2", text: "Gather equipment certifications", completed: false, critical: true },
      { id: "s3-3", text: "Prepare detailed show description", completed: false, critical: true },
      { id: "s3-4", text: "Complete MPE compliance documentation", completed: false, critical: true },
      { id: "s3-5", text: "Prepare emergency procedures", completed: false, critical: false },
      { id: "s3-6", text: "Organize crew qualifications", completed: false, critical: false },
    ],
  },
  {
    id: 4,
    title: "Equipment & Logistics",
    timeline: "3-4 weeks before",
    description: "Finalize equipment movement and logistics",
    tasks: [
      { id: "s4-1", text: "Finalize ATA Carnet arrangements", completed: false, critical: true },
      { id: "s4-2", text: "Coordinate shipping/freight", completed: false, critical: true },
      { id: "s4-3", text: "Verify power compatibility (adapters/transformers)", completed: false, critical: true },
      { id: "s4-4", text: "Confirm venue access schedule", completed: false, critical: true },
      { id: "s4-5", text: "Arrange local transportation", completed: false, critical: false },
      { id: "s4-6", text: "Prepare backup equipment plan", completed: false, critical: false },
    ],
  },
  {
    id: 5,
    title: "Final Preparations",
    timeline: "1-2 weeks before",
    description: "Last-minute confirmations and briefings",
    tasks: [
      { id: "s5-1", text: "Confirm all permits approved", completed: false, critical: true },
      { id: "s5-2", text: "Conduct crew safety briefing", completed: false, critical: true },
      { id: "s5-3", text: "Review backup plans", completed: false, critical: false },
      { id: "s5-4", text: "Final documentation review", completed: false, critical: false },
      { id: "s5-5", text: "Confirm local contacts", completed: false, critical: false },
      { id: "s5-6", text: "Prepare for customs clearance", completed: false, critical: false },
    ],
  },
];

const commonIssues = [
  {
    issue: "Documentation translation delays",
    solution: "Start translations at week 10, use certified translators",
  },
  {
    issue: "Permit processing slower than expected",
    solution: "Apply early, maintain contact with authorities, have backup dates",
  },
  {
    issue: "Equipment held in customs",
    solution: "Ensure ATA Carnet is properly filled, have local agent available",
  },
  {
    issue: "Local LSO requirements",
    solution: "Research early, consider hiring local LSO if required",
  },
  {
    issue: "Power incompatibility",
    solution: "Verify voltage/frequency, arrange converters if needed",
  },
];

export function OverseasShowPlanner() {
  const [activeStage, setActiveStage] = useState<number>(0);
  const [stages, setStages] = useState<PlanningStage[]>(planningStages);
  const [showSummary, setShowSummary] = useState(false);

  const toggleTask = (stageId: number, taskId: string) => {
    setStages((prev) =>
      prev.map((stage) =>
        stage.id === stageId
          ? {
              ...stage,
              tasks: stage.tasks.map((task) =>
                task.id === taskId ? { ...task, completed: !task.completed } : task
              ),
            }
          : stage
      )
    );
  };

  const calculateProgress = () => {
    const totalTasks = stages.reduce((sum, stage) => sum + stage.tasks.length, 0);
    const completedTasks = stages.reduce(
      (sum, stage) => sum + stage.tasks.filter((t) => t.completed).length,
      0
    );
    return totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  };

  const calculateStageProgress = (stage: PlanningStage) => {
    const completed = stage.tasks.filter((t) => t.completed).length;
    return (completed / stage.tasks.length) * 100;
  };

  const reset = () => {
    setStages(planningStages.map((s) => ({
      ...s,
      tasks: s.tasks.map((t) => ({ ...t, completed: false })),
    })));
    setActiveStage(0);
    setShowSummary(false);
  };

  const exportPlan = () => {
    const lines = [
      "OVERSEAS SHOW PLANNER",
      `Generated: ${new Date().toLocaleDateString()}`,
      `Overall Progress: ${Math.round(calculateProgress())}%`,
      "",
      ...stages.map((stage) => [
        `${stage.id}. ${stage.title} (${stage.timeline})`,
        `Progress: ${Math.round(calculateStageProgress(stage))}%`,
        ...stage.tasks.map((t) => `  [${t.completed ? "X" : " "}] ${t.text}${t.critical ? " (CRITICAL)" : ""}`),
        "",
      ].join("\n")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "overseas-show-plan.txt";
    a.click();
  };

  const overallProgress = calculateProgress();
  const currentStage = stages[activeStage];

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Plane className="h-5 w-5" />
              Overseas Show Planner
            </CardTitle>
            <CardDescription>
              &quot;I&apos;m Taking My Show Overseas&quot; - 5-stage planning tool
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportPlan}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              Reset
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overall Progress */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Overall Progress</span>
            <span className="text-sm text-muted-foreground">{Math.round(overallProgress)}%</span>
          </div>
          <Progress value={overallProgress}>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
            <ProgressValue />
          </Progress>
        </div>

        {/* Stage Navigation */}
        <div className="flex flex-wrap gap-2">
          {stages.map((stage, index) => {
            const progress = calculateStageProgress(stage);
            const isActive = activeStage === index;
            return (
              <button
                key={stage.id}
                onClick={() => {
                  setActiveStage(index);
                  setShowSummary(false);
                }}
                className={`flex-1 min-w-[120px] p-3 rounded-lg border text-left transition-all ${
                  isActive
                    ? "ring-2 ring-primary border-primary bg-primary/5"
                    : "hover:bg-muted"
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Stage {stage.id}</span>
                  {progress === 100 && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                </div>
                <p className={`font-medium text-sm ${isActive ? "text-primary" : ""}`}>
                  {stage.title}
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stage.timeline}</p>
                <div className="mt-2 h-1 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </button>
            );
          })}
          <button
            onClick={() => setShowSummary(true)}
            className={`flex-1 min-w-[120px] p-3 rounded-lg border text-left transition-all ${
              showSummary
                ? "ring-2 ring-primary border-primary bg-primary/5"
                : "hover:bg-muted"
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs text-muted-foreground">View</span>
            </div>
            <p className={`font-medium text-sm ${showSummary ? "text-primary" : ""}`}>
              Summary & Tips
            </p>
            <p className="text-xs text-muted-foreground mt-1">Quick Reference</p>
          </button>
        </div>

        {/* Stage Content */}
        {!showSummary ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-medium">{currentStage.title}</h3>
                <p className="text-sm text-muted-foreground">{currentStage.description}</p>
              </div>
              <Badge variant="outline">{currentStage.timeline}</Badge>
            </div>

            <div className="space-y-2">
              {currentStage.tasks.map((task) => (
                <div
                  key={task.id}
                  className={`flex items-start gap-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    task.completed ? "bg-muted/50" : "hover:bg-muted/30"
                  }`}
                  onClick={() => toggleTask(currentStage.id, task.id)}
                >
                  <div className="mt-0.5">
                    {task.completed ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : (
                      <div className="w-5 h-5 rounded border-2 border-muted-foreground/30" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className={`text-sm ${task.completed ? "line-through text-muted-foreground" : ""}`}>
                      {task.text}
                    </p>
                    {task.critical && (
                      <Badge variant="destructive" className="mt-1 text-xs">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Critical
                      </Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={() => setActiveStage(Math.max(0, activeStage - 1))}
                disabled={activeStage === 0}
              >
                <ChevronLeft className="h-4 w-4 mr-1" />
                Previous
              </Button>
              <Button
                onClick={() => setActiveStage(Math.min(stages.length - 1, activeStage + 1))}
                disabled={activeStage === stages.length - 1}
              >
                Next
                <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Summary */}
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <ClipboardList className="h-5 w-5 text-primary" />
                  <h4 className="font-medium">Tasks</h4>
                </div>
                <p className="text-2xl font-bold">
                  {stages.reduce((sum, s) => sum + s.tasks.filter((t) => t.completed).length, 0)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / {stages.reduce((sum, s) => sum + s.tasks.length, 0)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">Completed</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="h-5 w-5 text-destructive" />
                  <h4 className="font-medium">Critical</h4>
                </div>
                <p className="text-2xl font-bold">
                  {stages.reduce((sum, s) => sum + s.tasks.filter((t) => t.critical && t.completed).length, 0)}
                  <span className="text-sm font-normal text-muted-foreground">
                    {" "}
                    / {stages.reduce((sum, s) => sum + s.tasks.filter((t) => t.critical).length, 0)}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">Critical tasks done</p>
              </div>
              <div className="p-4 border rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                  <h4 className="font-medium">Timeline</h4>
                </div>
                <p className="text-2xl font-bold">12</p>
                <p className="text-xs text-muted-foreground">Weeks minimum</p>
              </div>
            </div>

            {/* Common Issues */}
            <div className="border rounded-lg overflow-hidden">
              <div className="p-4 bg-muted/50">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Common Issues & Solutions
                </h4>
              </div>
              <div className="divide-y">
                {commonIssues.map((item, index) => (
                  <div key={index} className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-sm">{item.issue}</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="text-green-600 font-medium">Solution:</span> {item.solution}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-3">
                  <FileText className="h-4 w-4" />
                  Key Documents
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• Equipment certifications</li>
                  <li>• Show description/plans</li>
                  <li>• MPE calculations</li>
                  <li>• Crew qualifications</li>
                  <li>• Insurance certificates</li>
                </ul>
              </div>
              <div className="p-4 border rounded-lg">
                <h4 className="font-medium flex items-center gap-2 mb-3">
                  <Package className="h-4 w-4" />
                  Equipment Considerations
                </h4>
                <ul className="space-y-1 text-sm">
                  <li>• ATA Carnet for temporary import</li>
                  <li>• Power voltage compatibility</li>
                  <li>• Spare parts availability</li>
                  <li>• Backup equipment plan</li>
                  <li>• Shipping insurance</li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default OverseasShowPlanner;
