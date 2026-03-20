"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface Violation {
  id: string;
  type: string;
  description: string;
  severity: "critical" | "high" | "medium";
  codeRef: string;
  found: boolean;
}

interface InspectionArea {
  id: string;
  name: string;
  description: string;
  violations: Violation[];
}

const inspectionAreas: InspectionArea[] = [
  {
    id: "main-hall",
    name: "Main Hall",
    description: "Primary audience area and stage front",
    violations: [
      { id: "v1", type: "Egress Obstruction", description: "Storage boxes blocking exit pathway", severity: "critical", codeRef: "NFPA 101", found: false },
      { id: "v2", type: "Exit Sign", description: "Exit sign not illuminated", severity: "high", codeRef: "Life Safety Code", found: false },
      { id: "v3", type: "Fire Extinguisher", description: "Extinguisher access blocked by decorations", severity: "high", codeRef: "NFPA 10", found: false },
    ],
  },
  {
    id: "backstage",
    name: "Backstage",
    description: "Performer and crew area behind stage",
    violations: [
      { id: "v4", type: "Storage", description: "Flammable materials stored near electrical panels", severity: "high", codeRef: "NFPA 1", found: false },
      { id: "v5", type: "Electrical", description: "Extension cord running through doorway", severity: "medium", codeRef: "NEC", found: false },
      { id: "v6", type: "Door Hardware", description: "Exit door hardware not functioning properly", severity: "critical", codeRef: "Panic Hardware Req", found: false },
    ],
  },
  {
    id: "lobby",
    name: "Lobby",
    description: "Entry and concession area",
    violations: [
      { id: "v7", type: "Egress Width", description: "Temporary displays reducing corridor width", severity: "medium", codeRef: "NFPA 101", found: false },
      { id: "v8", type: "Fire Extinguisher", description: "Extinguisher overdue for inspection", severity: "medium", codeRef: "NFPA 10", found: false },
    ],
  },
];

export const FireSafetyInspector: React.FC = () => {
  const [areas, setAreas] = useState<InspectionArea[]>(inspectionAreas);
  const [activeArea, setActiveArea] = useState<string>("main-hall");
  const [showResults, setShowResults] = useState(false);

  const toggleViolation = (areaId: string, violationId: string) => {
    setAreas((prev) =>
      prev.map((area) =>
        area.id === areaId
          ? {
              ...area,
              violations: area.violations.map((v) => (v.id === violationId ? { ...v, found: !v.found } : v)),
            }
          : area
      )
    );
  };

  const getScore = () => {
    let total = 0;
    let found = 0;
    areas.forEach((area) => {
      area.violations.forEach((v) => {
        total++;
        if (v.found) found++;
      });
    });
    return { total, found, percent: total > 0 ? (found / total) * 100 : 0 };
  };

  const score = getScore();
  const activeAreaData = areas.find((a) => a.id === activeArea);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
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

  if (showResults) {
    const missedViolations = areas.flatMap((area) => area.violations.filter((v) => !v.found));
    const foundCritical = areas.flatMap((area) => area.violations.filter((v) => v.found && v.severity === "critical"));

    return (
      <div className="max-w-3xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Inspection Complete</h2>
            <div className="text-5xl font-bold text-blue-600 mb-2">{Math.round(score.percent)}%</div>
            <p className="text-muted-foreground mb-6">
              You found {score.found} of {score.total} violations
            </p>

            {missedViolations.length > 0 && (
              <div className="text-left">
                <h3 className="font-semibold text-foreground mb-3">Missed Violations:</h3>
                <div className="space-y-2">
                  {missedViolations.map((v) => (
                    <div key={v.id} className="p-3 bg-muted rounded-lg text-left">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{v.type}</span>
                        <span className={cn("text-xs px-2 py-0.5 rounded", getSeverityColor(v.severity))}>
                          {v.severity}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">{v.description}</p>
                      <p className="text-xs text-muted-foreground">Code: {v.codeRef}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Button onClick={() => setShowResults(false)} className="mt-6">
              Continue Inspection
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Fire Safety Inspector</h2>
        <p className="text-muted-foreground">Virtual inspection simulation - identify all violations</p>
      </div>

      {/* Score */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-muted-foreground">Violations Found</span>
            <span className="text-sm text-muted-foreground">
              {score.found} of {score.total}
            </span>
          </div>
          <Progress value={score.percent} className="h-2" />
        </CardContent>
      </Card>

      {/* Area Navigation */}
      <div className="flex gap-2">
        {areas.map((area) => {
          const found = area.violations.filter((v) => v.found).length;
          const total = area.violations.length;
          const isActive = activeArea === area.id;

          return (
            <button
              key={area.id}
              onClick={() => setActiveArea(area.id)}
              className={cn(
                "flex-1 p-4 rounded-lg border-2 text-left transition-all",
                isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-card"
              )}
            >
              <div className="font-semibold text-foreground">{area.name}</div>
              <p className="text-xs text-muted-foreground mt-1">{area.description}</p>
              <div className="mt-2 text-xs">
                {found === total ? (
                  <span className="text-green-600">✓ Complete</span>
                ) : (
                  <span className="text-muted-foreground">{found}/{total} found</span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Inspection Area */}
      <Card>
        <CardHeader>
          <CardTitle>{activeAreaData?.name}</CardTitle>
          <CardDescription>{activeAreaData?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-8 text-center mb-6">
            <div className="text-6xl mb-4">🔍</div>
            <p className="text-muted-foreground">
              Review the {activeAreaData?.name.toLowerCase()} area and identify potential fire safety violations.
              Click on violations you discover below.
            </p>
          </div>

          <h4 className="font-semibold text-foreground mb-3">Select violations found in this area:</h4>
          <div className="space-y-3">
            {activeAreaData?.violations.map((violation) => (
              <button
                key={violation.id}
                onClick={() => toggleViolation(activeArea, violation.id)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  violation.found
                    ? "border-green-500 bg-green-50"
                    : "border-gray-200 hover:border-gray-300 bg-card"
                )}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={cn(
                      "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                      violation.found ? "bg-green-500 border-green-500" : "border-gray-300"
                    )}
                  >
                    {violation.found && (
                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-foreground">{violation.type}</span>
                      <span className={cn("text-xs px-2 py-0.5 rounded", getSeverityColor(violation.severity))}>
                        {violation.severity}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{violation.description}</p>
                    <p className="text-xs text-muted-foreground mt-1">Code: {violation.codeRef}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Complete Button */}
      <div className="flex justify-center">
        <Button size="lg" onClick={() => setShowResults(true)}>
          Complete Inspection
        </Button>
      </div>
    </div>
  );
};

export default FireSafetyInspector;
