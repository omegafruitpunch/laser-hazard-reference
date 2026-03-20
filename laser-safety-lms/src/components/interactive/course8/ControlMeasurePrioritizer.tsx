"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle2, 
  XCircle, 
  ArrowUp, 
  ArrowDown,
  RotateCcw,
  Trophy,
  AlertCircle,
  Shield,
  Cog,
  ClipboardList,
  HardHat
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ControlLevel = 1 | 2 | 3 | 4;

export interface ControlMeasure {
  id: string;
  name: string;
  description: string;
  level: ControlLevel;
  category: "elimination" | "engineering" | "administrative" | "ppe";
}

export interface Scenario {
  id: string;
  title: string;
  description: string;
  laserClass: string;
  environment: string;
  availableControls: ControlMeasure[];
  correctOrder: string[];
  explanation: string;
}

export interface ControlMeasurePrioritizerProps {
  scenarios?: Scenario[];
  onComplete?: (score: number, total: number) => void;
  className?: string;
}

// ============================================================================
// Control Level Configuration
// ============================================================================

const LEVEL_CONFIG: Record<ControlLevel, {
  name: string;
  description: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: React.ReactNode;
  examples: string[];
}> = {
  1: {
    name: "Elimination / Substitution",
    description: "Remove the hazard entirely or substitute with a safer alternative",
    color: "text-green-400",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/30",
    icon: <Shield className="w-5 h-5" />,
    examples: [
      "Use lower power laser",
      "Change beam path away from occupied areas",
      "Use non-laser alternative"
    ],
  },
  2: {
    name: "Engineering Controls",
    description: "Isolate people from the hazard through physical means",
    color: "text-emerald-400",
    bgColor: "bg-emerald-500/10",
    borderColor: "border-emerald-500/30",
    icon: <Cog className="w-5 h-5" />,
    examples: [
      "Safety interlocks",
      "Enclosures",
      "Scan failure detection",
      "Beam stops/shutters",
      "Remote interlock"
    ],
  },
  3: {
    name: "Administrative Controls",
    description: "Change the way people work through procedures and training",
    color: "text-amber-400",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/30",
    icon: <ClipboardList className="w-5 h-5" />,
    examples: [
      "Standard Operating Procedures (SOPs)",
      "Training programs",
      "Warning signs and labels",
      "Scheduling/limiting access",
      "Maintenance procedures"
    ],
  },
  4: {
    name: "Personal Protective Equipment",
    description: "Protect the individual with specialized equipment - Last Resort",
    color: "text-orange-400",
    bgColor: "bg-orange-500/10",
    borderColor: "border-orange-500/30",
    icon: <HardHat className="w-5 h-5" />,
    examples: [
      "Safety eyewear (with appropriate OD)",
      "Protective clothing",
      "Skin protection"
    ],
  },
};

// ============================================================================
// Default Scenarios
// ============================================================================

export const DEFAULT_SCENARIOS: Scenario[] = [
  {
    id: "class4-research",
    title: "Class 4 Research Laser",
    description: "A university lab uses a Class 4 laser for spectroscopy research. Graduate students operate the equipment during scheduled lab sessions.",
    laserClass: "Class 4",
    environment: "University Research Lab",
    availableControls: [
      { id: "c1", name: "Install interlocked enclosure", description: "Fully enclose the beam path with interlocked panels", level: 2, category: "engineering" },
      { id: "c2", name: "Provide safety eyewear", description: "Supply appropriate OD-rated eyewear for all users", level: 4, category: "ppe" },
      { id: "c3", name: "Create SOP for operation", description: "Document standard operating procedures", level: 3, category: "administrative" },
      { id: "c4", name: "Implement beam shutter", description: "Install physical beam shutter at laser output", level: 2, category: "engineering" },
      { id: "c5", name: "Training for all users", description: "Require laser safety training before operation", level: 3, category: "administrative" },
    ],
    correctOrder: ["c1", "c4", "c3", "c5", "c2"],
    explanation: "For a Class 4 research laser, engineering controls (enclosure and shutter) must be implemented first. Administrative controls (SOPs and training) follow. PPE is the last line of defense.",
  },
  {
    id: "entertainment-show",
    title: "Entertainment Laser Show",
    description: "A music venue wants to add laser effects that may scan into the audience area during performances.",
    laserClass: "Class 4",
    environment: "Music Venue",
    availableControls: [
      { id: "c1", name: "Position beams above 3m height", description: "Keep all beams above audience head height", level: 1, category: "elimination" },
      { id: "c2", name: "Scan failure detection system", description: "Install system to stop emission if scanners fail", level: 2, category: "engineering" },
      { id: "c3", name: "Operator training", description: "Train operators on safety procedures", level: 3, category: "administrative" },
      { id: "c4", name: "Emergency stop at console", description: "Install E-stop accessible to operator", level: 2, category: "engineering" },
      { id: "c5", name: "Audience safety briefings", description: "Inform audience of laser use", level: 3, category: "administrative" },
    ],
    correctOrder: ["c1", "c2", "c4", "c3", "c5"],
    explanation: "Elimination (keeping beams above audience) is the most effective. Engineering controls (scan failure and E-stop) are critical safety systems. Administrative controls support but don't replace physical protections.",
  },
  {
    id: "medical-suite",
    title: "Medical Laser Suite",
    description: "A hospital is installing surgical lasers in operating rooms for various procedures.",
    laserClass: "Class 4",
    environment: "Hospital OR",
    availableControls: [
      { id: "c1", name: "Door interlocks", description: "Interlock OR doors to prevent entry during operation", level: 2, category: "engineering" },
      { id: "c2", name: "Warning lights", description: "Install illuminated warning signs outside OR", level: 3, category: "administrative" },
      { id: "c3", name: "Staff protective eyewear", description: "Provide OD-rated eyewear for OR staff", level: 4, category: "ppe" },
      { id: "c4", name: "Window coverings", description: "Install laser-safe window coverings", level: 2, category: "engineering" },
      { id: "c5", name: "Use lowest effective power", description: "Set laser to minimum power for procedure", level: 1, category: "elimination" },
    ],
    correctOrder: ["c5", "c1", "c4", "c2", "c3"],
    explanation: "Using the lowest effective power (elimination) is the priority. Engineering controls (interlocks and window coverings) protect staff and visitors. Administrative (warning lights) and PPE are supplementary.",
  },
  {
    id: "manufacturing-line",
    title: "Manufacturing Production Line",
    description: "A factory is adding laser welding stations to an automated production line with occasional human access for maintenance.",
    laserClass: "Class 4",
    environment: "Industrial Manufacturing",
    availableControls: [
      { id: "c1", name: "Fully enclosed workstation", description: "Light-tight enclosure with interlocked access", level: 2, category: "engineering" },
      { id: "c2", name: "Maintenance lockout procedure", description: "LOTO procedure for maintenance access", level: 3, category: "administrative" },
      { id: "c3", name: "Use Class 1 enclosure rating", description: "Design enclosure to achieve Class 1 emission", level: 1, category: "elimination" },
      { id: "c4", name: "Maintenance safety eyewear", description: "Provide PPE for maintenance personnel", level: 4, category: "ppe" },
      { id: "c5", name: "Warning signs and labels", description: "Post laser warning labels on equipment", level: 3, category: "administrative" },
    ],
    correctOrder: ["c3", "c1", "c2", "c5", "c4"],
    explanation: "Achieving Class 1 through enclosure design is the gold standard (elimination). The enclosure is the primary engineering control. Administrative controls and PPE apply primarily to maintenance activities.",
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function ControlMeasurePrioritizer({
  scenarios = DEFAULT_SCENARIOS,
  onComplete,
  className,
}: ControlMeasurePrioritizerProps) {
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [userOrder, setUserOrder] = useState<string[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [scenarioResults, setScenarioResults] = useState<{ scenarioId: string; score: number }[]>([]);

  const currentScenario = scenarios[currentScenarioIndex];
  const remainingControls = currentScenario.availableControls.filter(
    (c) => !userOrder.includes(c.id)
  );

  const handleAddControl = (controlId: string) => {
    setUserOrder((prev) => [...prev, controlId]);
  };

  const handleRemoveControl = (index: number) => {
    setUserOrder((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMoveUp = (index: number) => {
    if (index === 0) return;
    setUserOrder((prev) => {
      const newOrder = [...prev];
      [newOrder[index - 1], newOrder[index]] = [newOrder[index], newOrder[index - 1]];
      return newOrder;
    });
  };

  const handleMoveDown = (index: number) => {
    if (index === userOrder.length - 1) return;
    setUserOrder((prev) => {
      const newOrder = [...prev];
      [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
      return newOrder;
    });
  };

  const calculateScore = () => {
    let score = 0;
    const correctOrder = currentScenario.correctOrder;
    
    userOrder.forEach((controlId, index) => {
      const correctIndex = correctOrder.indexOf(controlId);
      if (correctIndex === index) {
        score += 20; // Perfect position
      } else if (Math.abs(correctIndex - index) === 1) {
        score += 10; // Adjacent position
      }
    });
    
    return Math.min(score, 100);
  };

  const handleSubmit = () => {
    const score = calculateScore();
    setScenarioResults((prev) => [...prev, { scenarioId: currentScenario.id, score }]);
    setShowResults(true);
  };

  const handleNextScenario = () => {
    if (currentScenarioIndex < scenarios.length - 1) {
      setCurrentScenarioIndex((prev) => prev + 1);
      setUserOrder([]);
      setShowResults(false);
    } else {
      // All scenarios complete
      const totalScore = scenarioResults.reduce((acc, r) => acc + r.score, 0) + calculateScore();
      const averageScore = Math.round(totalScore / (scenarioResults.length + 1));
      onComplete?.(averageScore, 100);
    }
  };

  const handleReset = () => {
    setUserOrder([]);
    setShowResults(false);
  };

  const isComplete = userOrder.length === currentScenario.availableControls.length;

  return (
    <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Shield className="w-6 h-6 text-primary" />
          Control Measure Prioritizer
        </h2>
        <p className="text-muted-foreground mt-2">
          Arrange controls in order of priority following the hierarchy of controls
        </p>
        
        {/* Progress */}
        <div className="flex justify-center gap-2 mt-4">
          {scenarios.map((_, i) => (
            <div
              key={i}
              className={cn(
                "w-8 h-2 rounded-full transition-colors",
                i < currentScenarioIndex ? "bg-green-500" :
                i === currentScenarioIndex ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground mt-2">
          Scenario {currentScenarioIndex + 1} of {scenarios.length}
        </p>
      </div>

      {/* Hierarchy Legend */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {(Object.keys(LEVEL_CONFIG) as unknown as ControlLevel[]).map((level) => (
          <div
            key={level}
            className={cn(
              "p-3 rounded-lg border text-center",
              LEVEL_CONFIG[level].bgColor,
              LEVEL_CONFIG[level].borderColor
            )}
          >
            <div className={cn("flex justify-center mb-1", LEVEL_CONFIG[level].color)}>
              {LEVEL_CONFIG[level].icon}
            </div>
            <div className={cn("text-xs font-medium", LEVEL_CONFIG[level].color)}>
              {level}. {LEVEL_CONFIG[level].name.split(" / ")[0]}
            </div>
          </div>
        ))}
      </div>

      {/* Scenario Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle>{currentScenario.title}</CardTitle>
              <p className="text-muted-foreground mt-2">{currentScenario.description}</p>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline">{currentScenario.laserClass}</Badge>
              <Badge variant="secondary">{currentScenario.environment}</Badge>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          {!showResults ? (
            <>
              {/* Available Controls */}
              <div>
                <h4 className="font-medium mb-3">Available Controls (click to add):</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {remainingControls.map((control) => (
                    <button
                      key={control.id}
                      onClick={() => handleAddControl(control.id)}
                      className={cn(
                        "p-3 rounded-lg border text-left transition-all hover:scale-[1.02]",
                        LEVEL_CONFIG[control.level].bgColor,
                        LEVEL_CONFIG[control.level].borderColor
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span className={LEVEL_CONFIG[control.level].color}>
                          {LEVEL_CONFIG[control.level].icon}
                        </span>
                        <span className="font-medium">{control.name}</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {control.description}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* User's Priority Order */}
              <div>
                <h4 className="font-medium mb-3">
                  Your Priority Order ({userOrder.length}/{currentScenario.availableControls.length}):
                </h4>
                {userOrder.length === 0 ? (
                  <div className="p-8 text-center text-muted-foreground border border-dashed border-border rounded-lg">
                    Click controls above to arrange them by priority
                  </div>
                ) : (
                  <div className="space-y-2">
                    {userOrder.map((controlId, index) => {
                      const control = currentScenario.availableControls.find((c) => c.id === controlId)!;
                      return (
                        <div
                          key={`${controlId}-${index}`}
                          className={cn(
                            "flex items-center gap-3 p-3 rounded-lg border",
                            LEVEL_CONFIG[control.level].bgColor,
                            LEVEL_CONFIG[control.level].borderColor
                          )}
                        >
                          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center font-bold text-sm">
                            {index + 1}
                          </div>
                          <div className="flex-grow">
                            <div className="font-medium">{control.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {LEVEL_CONFIG[control.level].name}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <button
                              onClick={() => handleMoveUp(index)}
                              disabled={index === 0}
                              className="p-1 rounded hover:bg-background disabled:opacity-30"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleMoveDown(index)}
                              disabled={index === userOrder.length - 1}
                              className="p-1 rounded hover:bg-background disabled:opacity-30"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleRemoveControl(index)}
                              className="p-1 rounded hover:bg-background text-red-400"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          ) : (
            <ResultsView
              scenario={currentScenario}
              userOrder={userOrder}
              score={calculateScore()}
            />
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          {!showResults ? (
            <>
              <Button variant="outline" onClick={handleReset} disabled={userOrder.length === 0}>
                <RotateCcw className="w-4 h-4 mr-2" />
                Reset
              </Button>
              <Button onClick={handleSubmit} disabled={!isComplete}>
                Submit Order
                <CheckCircle2 className="w-4 h-4 ml-2" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={handleReset}>
                Try Again
              </Button>
              <Button onClick={handleNextScenario}>
                {currentScenarioIndex < scenarios.length - 1 ? "Next Scenario" : "Finish"}
                <Trophy className="w-4 h-4 ml-2" />
              </Button>
            </>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}

// ============================================================================
// Results View
// ============================================================================

interface ResultsViewProps {
  scenario: Scenario;
  userOrder: string[];
  score: number;
}

function ResultsView({ scenario, userOrder, score }: ResultsViewProps) {
  const getFeedback = () => {
    if (score >= 90) return { label: "Excellent!", color: "text-green-400" };
    if (score >= 70) return { label: "Good", color: "text-emerald-400" };
    if (score >= 50) return { label: "Keep Practicing", color: "text-amber-400" };
    return { label: "Review Hierarchy", color: "text-red-400" };
  };

  const feedback = getFeedback();

  return (
    <div className="space-y-6">
      {/* Score Display */}
      <div className="text-center">
        <div className={cn("text-5xl font-bold", feedback.color)}>{score}%</div>
        <div className={cn("text-lg font-medium mt-2", feedback.color)}>{feedback.label}</div>
      </div>

      {/* Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Your Order */}
        <div>
          <h4 className="font-medium mb-3">Your Order:</h4>
          <div className="space-y-2">
            {userOrder.map((controlId, index) => {
              const control = scenario.availableControls.find((c) => c.id === controlId)!;
              const correctIndex = scenario.correctOrder.indexOf(controlId);
              const isCorrect = correctIndex === index;
              const isClose = Math.abs(correctIndex - index) === 1;

              return (
                <div
                  key={`user-${index}`}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded border",
                    isCorrect
                      ? "bg-green-500/10 border-green-500/30"
                      : isClose
                      ? "bg-amber-500/10 border-amber-500/30"
                      : "bg-red-500/10 border-red-500/30"
                  )}
                >
                  <span className="text-sm font-medium w-6">{index + 1}.</span>
                  <span className="flex-grow text-sm">{control.name}</span>
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Correct Order */}
        <div>
          <h4 className="font-medium mb-3">Correct Order:</h4>
          <div className="space-y-2">
            {scenario.correctOrder.map((controlId, index) => {
              const control = scenario.availableControls.find((c) => c.id === controlId)!;
              return (
                <div
                  key={`correct-${index}`}
                  className={cn(
                    "flex items-center gap-2 p-2 rounded border",
                    LEVEL_CONFIG[control.level].bgColor,
                    LEVEL_CONFIG[control.level].borderColor
                  )}
                >
                  <span className="text-sm font-medium w-6">{index + 1}.</span>
                  <span className="flex-grow text-sm">{control.name}</span>
                  <Badge variant="outline" className="text-xs">
                    Level {control.level}
                  </Badge>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Explanation */}
      <div className="p-4 bg-muted rounded-lg">
        <h4 className="font-medium mb-2">Explanation</h4>
        <p className="text-sm text-muted-foreground">{scenario.explanation}</p>
      </div>
    </div>
  );
}

export default ControlMeasurePrioritizer;
