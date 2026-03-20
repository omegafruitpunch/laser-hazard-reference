"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface DensityLevel {
  name: string;
  maxDensity: number; // sq ft per person
  color: string;
  bgColor: string;
  action: string;
}

const densityLevels: DensityLevel[] = [
  { name: "Comfortable", maxDensity: 10, color: "text-green-600", bgColor: "bg-green-500", action: "Normal monitoring" },
  { name: "Dense", maxDensity: 7, color: "text-yellow-600", bgColor: "bg-yellow-500", action: "Increase monitoring" },
  { name: "Critical", maxDensity: 5, color: "text-orange-600", bgColor: "bg-orange-500", action: "STOP ENTRY" },
  { name: "Crush", maxDensity: 3.5, color: "text-red-600", bgColor: "bg-red-500", action: "Emergency response" },
];

export const CrowdDensityCalculator: React.FC = () => {
  const [mode, setMode] = useState<"basic" | "advanced">("basic");
  const [areaLength, setAreaLength] = useState(100); // feet
  const [areaWidth, setAreaWidth] = useState(50); // feet
  const [occupantCount, setOccupantCount] = useState(500);

  // Advanced mode
  const [numZones, setNumZones] = useState(1);
  const [flowRate, setFlowRate] = useState(50); // people per minute entering

  const area = areaLength * areaWidth;
  const density = area / occupantCount;
  const currentLevel = densityLevels.find((l) => density <= l.maxDensity) || densityLevels[densityLevels.length - 1];
  const maxCapacity = Math.floor(area / 3.5); // crush level limit

  // Visualization dimensions
  const maxDimension = Math.max(areaLength, areaWidth);
  const scale = 300 / maxDimension;
  const visualWidth = areaWidth * scale;
  const visualHeight = areaLength * scale;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Crowd Density Calculator</h2>
        <p className="text-muted-foreground">Real-time density visualization and safety monitoring</p>
      </div>

      {/* Mode Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg inline-flex">
          {[
            { id: "basic", label: "Basic" },
            { id: "advanced", label: "Advanced" },
          ].map((m) => (
            <button
              key={m.id}
              onClick={() => setMode(m.id as any)}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-all",
                mode === m.id ? "bg-card text-blue-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Area Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Area Length */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Area Length: {areaLength} ft
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={areaLength}
                onChange={(e) => setAreaLength(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Area Width */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Area Width: {areaWidth} ft
              </label>
              <input
                type="range"
                min="10"
                max="500"
                step="5"
                value={areaWidth}
                onChange={(e) => setAreaWidth(Number(e.target.value))}
                className="w-full"
              />
            </div>

            {/* Total Area Display */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="text-sm text-muted-foreground">Total Area</div>
              <div className="text-2xl font-bold text-foreground">
                {area.toLocaleString()} sq ft
              </div>
            </div>

            {/* Occupant Count */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Current Occupant Count: {occupantCount}
              </label>
              <input
                type="range"
                min="0"
                max={maxCapacity * 1.5}
                step="10"
                value={occupantCount}
                onChange={(e) => setOccupantCount(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0</span>
                <span>Max Safe: {maxCapacity}</span>
              </div>
            </div>

            {mode === "advanced" && (
              <div className="pt-4 border-t">
                <h4 className="font-semibold text-foreground mb-4">Advanced Parameters</h4>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Entry Flow Rate: {flowRate} people/min
                    </label>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      step="5"
                      value={flowRate}
                      onChange={(e) => setFlowRate(Number(e.target.value))}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Panel */}
        <div className="space-y-4">
          {/* Current Density */}
          <Card className={cn("border-2", `border-${currentLevel.bgColor.replace("bg-", "").replace("500", "200")}`)}>
            <CardHeader className={cn(currentLevel.bgColor.replace("500", "50"))}>
              <CardTitle className={currentLevel.color}>Current Density Status</CardTitle>
              <CardDescription className={currentLevel.color}>
                {density.toFixed(1)} sq ft per person
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <div className={cn("text-5xl font-bold mb-2", currentLevel.color)}>{currentLevel.name}</div>
                <p className="text-muted-foreground">{currentLevel.action}</p>
              </div>

              {/* Capacity Info */}
              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Current Count</div>
                  <div className="text-2xl font-bold text-foreground">{occupantCount}</div>
                </div>
                <div className="p-3 bg-muted rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Max Safe Capacity</div>
                  <div className="text-2xl font-bold text-foreground">{maxCapacity}</div>
                </div>
              </div>

              {/* Utilization */}
              <div className="mt-4">
                <div className="flex justify-between text-sm mb-1">
                  <span>Capacity Utilization</span>
                  <span>{Math.round((occupantCount / maxCapacity) * 100)}%</span>
                </div>
                <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className={cn("h-full transition-all", currentLevel.bgColor)}
                    style={{ width: `${Math.min(100, (occupantCount / maxCapacity) * 100)}%` }}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visual Representation */}
          <Card>
            <CardHeader>
              <CardTitle>Visual Representation</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <div
                  className={cn("relative border-4 rounded-lg transition-colors", currentLevel.bgColor.replace("bg-", "border-"))}
                  style={{ width: visualWidth, height: visualHeight, maxWidth: "100%" }}
                >
                  {/* Grid of people */}
                  {Array.from({ length: Math.min(100, occupantCount) }).map((_, i) => {
                    const cols = Math.ceil(Math.sqrt(Math.min(100, occupantCount)));
                    const row = Math.floor(i / cols);
                    const col = i % cols;
                    const personSize = Math.max(4, Math.min(12, visualWidth / cols / 2));
                    
                    return (
                      <div
                        key={i}
                        className={cn("absolute rounded-full", currentLevel.bgColor)}
                        style={{
                          width: personSize,
                          height: personSize,
                          left: `${(col / cols) * 80 + 10}%`,
                          top: `${(row / Math.ceil(Math.min(100, occupantCount) / cols)) * 80 + 10}%`,
                          opacity: 0.7,
                        }}
                      />
                    );
                  })}
                  
                  {occupantCount > 100 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-card/90 px-3 py-1 rounded-lg text-sm font-medium">
                        +{occupantCount - 100} more
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <p className="text-center text-sm text-muted-foreground mt-4">
                Scale representation ({Math.round(visualWidth)}x{Math.round(visualHeight)}px)
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Density Levels Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Density Thresholds</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4">
            {densityLevels.map((level) => (
              <div key={level.name} className={cn("p-4 rounded-lg border-2", level.bgColor.replace("500", "100"), `border-${level.bgColor.replace("bg-", "").replace("500", "200")}`)}>
                <div className={cn("font-semibold", level.color)}>{level.name}</div>
                <div className="text-sm text-muted-foreground">≤ {level.maxDensity} sq ft/person</div>
                <div className="text-xs text-muted-foreground mt-1">{level.action}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CrowdDensityCalculator;
