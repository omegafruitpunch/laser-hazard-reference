"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DensityLevel {
  name: string;
  sqftPerPerson: number;
  sqmPerPerson: number;
  color: string;
  bgColor: string;
  borderColor: string;
  action: string;
  description: string;
}

const densityLevels: DensityLevel[] = [
  {
    name: "Comfortable",
    sqftPerPerson: 10,
    sqmPerPerson: 0.93,
    color: "text-green-700",
    bgColor: "bg-green-500",
    borderColor: "border-green-200",
    action: "Normal monitoring",
    description: "Free movement, low risk",
  },
  {
    name: "Dense",
    sqftPerPerson: 7,
    sqmPerPerson: 0.65,
    color: "text-yellow-700",
    bgColor: "bg-yellow-500",
    borderColor: "border-yellow-200",
    action: "Increase monitoring",
    description: "Restricted movement, increased monitoring needed",
  },
  {
    name: "Critical",
    sqftPerPerson: 5,
    sqmPerPerson: 0.46,
    color: "text-orange-700",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-200",
    action: "STOP ENTRY - Immediate action required",
    description: "Dangerous density level",
  },
  {
    name: "CRUSH THRESHOLD",
    sqftPerPerson: 3.5,
    sqmPerPerson: 0.33,
    color: "text-red-700",
    bgColor: "bg-red-600",
    borderColor: "border-red-300",
    action: "EMERGENCY RESPONSE - Stop entry immediately",
    description: "Crush condition imminent - risk of injury or death",
  },
];

interface StaffingRatio {
  venueType: string;
  ratio: string;
  notes?: string;
}

const staffingRatios: StaffingRatio[] = [
  { venueType: "Seated venues", ratio: "1 steward per 250-500 seats", notes: "Lower density, controlled seating" },
  { venueType: "General admission standing", ratio: "1 steward per 100-150 patrons", notes: "Higher density, more movement" },
  { venueType: "High-risk events", ratio: "1 steward per 50-75 patrons", notes: "Festivals, concerts with high energy" },
];

interface WarningSign {
  sign: string;
  indicators: string[];
  response: string[];
  severity: "high" | "critical";
}

const warningSigns: WarningSign[] = [
  {
    sign: "Crowd Surge",
    indicators: ["Waves of movement through crowd", "People losing balance", "Compression at barriers"],
    response: ["Stop event or performance if necessary", "Open additional egress routes", "PA announcement to stop pushing", "Deploy additional crowd managers"],
    severity: "critical",
  },
  {
    sign: "Crowd Collapse",
    indicators: ["People falling to ground", "Cries for help", "Visible distress in crowd"],
    response: ["Immediately stop event", "Initiate emergency extraction", "Call for medical assistance", "Clear space around affected area"],
    severity: "critical",
  },
  {
    sign: "Barrier Failure",
    indicators: ["Visible barrier movement", "Barriers leaning or bending", "Gaps appearing in barrier line"],
    response: ["Evacuate area behind barriers", "Reinforce or replace barriers", "Consider event stoppage", "Redirect crowd flow away from area"],
    severity: "high",
  },
  {
    sign: "Panic Indicators",
    indicators: ["Sudden changes in crowd noise", "Rapid movement in multiple directions", "People climbing over barriers", "Abandoned personal belongings"],
    response: ["Calm PA announcements", "Open all available exits", "Clear sight lines for crowd", "Avoid actions that may escalate panic"],
    severity: "high",
  },
];

export const Module2_Crowd_Safety: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"calculator" | "staffing" | "evacuation" | "warnings">("calculator");
  const [unit, setUnit] = useState<"imperial" | "metric">("imperial");
  
  // Calculator state
  const [areaLength, setAreaLength] = useState(100);
  const [areaWidth, setAreaWidth] = useState(50);
  const [occupantCount, setOccupantCount] = useState(500);
  const [showMetric, setShowMetric] = useState(false);

  // Calculate density
  const area = areaLength * areaWidth;
  const density = area / occupantCount;
  const currentLevel = densityLevels.find((l) => density >= l.sqftPerPerson) || densityLevels[densityLevels.length - 1];
  const maxSafeCapacity = Math.floor(area / 5); // Critical level
  const crushCapacity = Math.floor(area / 3.5); // Crush threshold

  // Calculate evacuation time
  const [exitWidth, setExitWidth] = useState(36); // inches
  const [numExits, setNumExits] = useState(4);
  const flowRatePerExit = Math.floor(exitWidth / 12) * 20; // approx 20 people per foot of width per minute
  const totalFlowRate = flowRatePerExit * numExits;
  const evacuationTime = Math.ceil(occupantCount / totalFlowRate);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Crowd Safety & Dynamics</h1>
        <p className="text-muted-foreground">Density calculations, flow management, and evacuation planning</p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: "calculator", label: "Density Calculator", icon: "📊" },
          { id: "staffing", label: "Staffing Guide", icon: "👥" },
          { id: "evacuation", label: "Evacuation Planner", icon: "🚪" },
          { id: "warnings", label: "Warning Signs", icon: "⚠️" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-muted text-foreground hover:bg-gray-200"
            )}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Density Calculator Tab */}
      {activeTab === "calculator" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Panel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Area Parameters</span>
                <div className="flex bg-muted rounded-lg p-1">
                  <button
                    onClick={() => setUnit("imperial")}
                    className={cn(
                      "px-3 py-1 rounded text-sm",
                      unit === "imperial" ? "bg-card shadow" : ""
                    )}
                  >
                    ft
                  </button>
                  <button
                    onClick={() => setUnit("metric")}
                    className={cn(
                      "px-3 py-1 rounded text-sm",
                      unit === "metric" ? "bg-card shadow" : ""
                    )}
                  >
                    m
                  </button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Area Length: {areaLength} {unit === "imperial" ? "ft" : "m"}
                </label>
                <input
                  type="range"
                  min="10"
                  max={unit === "imperial" ? "500" : "150"}
                  step="5"
                  value={areaLength}
                  onChange={(e) => setAreaLength(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Area Width: {areaWidth} {unit === "imperial" ? "ft" : "m"}
                </label>
                <input
                  type="range"
                  min="10"
                  max={unit === "imperial" ? "500" : "150"}
                  step="5"
                  value={areaWidth}
                  onChange={(e) => setAreaWidth(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground">Total Area</div>
                <div className="text-2xl font-bold text-foreground">
                  {area.toLocaleString()} {unit === "imperial" ? "sq ft" : "m²"}
                  {unit === "imperial" && (
                    <span className="text-sm font-normal text-muted-foreground ml-2">
                      ({(area * 0.0929).toFixed(1)} m²)
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Current Occupant Count: {occupantCount}
                </label>
                <input
                  type="range"
                  min="0"
                  max={crushCapacity * 1.5}
                  step="10"
                  value={occupantCount}
                  onChange={(e) => setOccupantCount(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>0</span>
                  <span>Safe: {maxSafeCapacity}</span>
                  <span className="text-red-600">Max: {crushCapacity}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results Panel */}
          <div className="space-y-4">
            {/* Current Status */}
            <Card className={cn("border-2", currentLevel.borderColor)}>
              <CardHeader className={cn(currentLevel.bgColor.replace("500", "50").replace("600", "50"))}>
                <CardTitle className={currentLevel.color}>Current Density Status</CardTitle>
                <CardDescription className={currentLevel.color}>
                  {density.toFixed(1)} {unit === "imperial" ? "sq ft" : "m²"} per person
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className={cn("text-4xl font-bold mb-2", currentLevel.color)}>
                    {currentLevel.name}
                  </div>
                  <p className="text-muted-foreground">{currentLevel.action}</p>
                  <p className="text-sm text-muted-foreground mt-1">{currentLevel.description}</p>
                </div>

                {/* Capacity Bars */}
                <div className="mt-6 space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Current Count</span>
                      <span className="font-semibold">{occupantCount}</span>
                    </div>
                    <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full transition-all", currentLevel.bgColor)}
                        style={{ width: `${Math.min(100, (occupantCount / crushCapacity) * 100)}%` }}
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 bg-green-50 rounded-lg text-center">
                      <div className="text-muted-foreground">Safe Capacity</div>
                      <div className="text-xl font-bold text-green-700">{maxSafeCapacity}</div>
                      <div className="text-xs text-muted-foreground">(≥5 sq ft/person)</div>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg text-center">
                      <div className="text-muted-foreground">Crush Threshold</div>
                      <div className="text-xl font-bold text-red-700">{crushCapacity}</div>
                      <div className="text-xs text-muted-foreground">(3.5 sq ft/person)</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Density Levels Reference */}
            <Card>
              <CardHeader>
                <CardTitle>Density Thresholds Reference</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {densityLevels.map((level) => (
                    <div
                      key={level.name}
                      className={cn(
                        "p-3 rounded-lg border-2 flex items-center justify-between",
                        density >= level.sqftPerPerson && density < (densityLevels.find(l => l.sqftPerPerson < level.sqftPerPerson)?.sqftPerPerson || Infinity)
                          ? level.borderColor
                          : "border-gray-100 opacity-60"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-4 h-4 rounded-full", level.bgColor)} />
                        <div>
                          <div className={cn("font-semibold", level.color)}>{level.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {level.sqftPerPerson} sq ft/person ({level.sqmPerPerson} m²/person)
                          </div>
                        </div>
                      </div>
                      <div className="text-right text-sm text-muted-foreground hidden sm:block">
                        {level.action}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Staffing Guide Tab */}
      {activeTab === "staffing" && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Staffing Ratios</CardTitle>
              <CardDescription>Recommended steward-to-patron ratios by venue type</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {staffingRatios.map((ratio) => (
                  <div key={ratio.venueType} className="p-4 bg-muted rounded-lg">
                    <div className="font-semibold text-foreground">{ratio.venueType}</div>
                    <div className="text-2xl font-bold text-blue-600 my-1">{ratio.ratio}</div>
                    <div className="text-sm text-muted-foreground">{ratio.notes}</div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Staffing Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Expected Attendance
                  </label>
                  <input
                    type="number"
                    defaultValue={5000}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                    id="attendance-input"
                    onChange={(e) => {
                      const attendance = Number(e.target.value);
                      document.getElementById("seated-result")!.textContent = Math.ceil(attendance / 375).toString();
                      document.getElementById("ga-result")!.textContent = Math.ceil(attendance / 125).toString();
                      document.getElementById("high-risk-result")!.textContent = Math.ceil(attendance / 62).toString();
                    }}
                  />
                </div>

                <div className="space-y-3">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="text-sm text-green-800 font-medium">Seated Venue</div>
                    <div className="text-3xl font-bold text-green-700" id="seated-result">
                      {Math.ceil(5000 / 375)}
                    </div>
                    <div className="text-sm text-green-600">stewards recommended</div>
                  </div>

                  <div className="p-4 bg-yellow-50 rounded-lg">
                    <div className="text-sm text-yellow-800 font-medium">General Admission</div>
                    <div className="text-3xl font-bold text-yellow-700" id="ga-result">
                      {Math.ceil(5000 / 125)}
                    </div>
                    <div className="text-sm text-yellow-600">stewards recommended</div>
                  </div>

                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-sm text-red-800 font-medium">High-Risk Event</div>
                    <div className="text-3xl font-bold text-red-700" id="high-risk-result">
                      {Math.ceil(5000 / 62)}
                    </div>
                    <div className="text-sm text-red-600">stewards recommended</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Crowd Manager Roles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">Event Stewards</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Monitor crowd conditions</li>
                    <li>• Provide information to patrons</li>
                    <li>• Report incidents and hazards</li>
                    <li>• Assist with emergency evacuations</li>
                  </ul>
                  <div className="mt-2 text-xs text-blue-600">Placement: Distributed throughout venue</div>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-semibold text-purple-800 mb-2">Supervisory Stewards</h4>
                  <ul className="text-sm text-purple-700 space-y-1">
                    <li>• Oversee assigned areas</li>
                    <li>• Coordinate response to incidents</li>
                    <li>• Communicate with command center</li>
                    <li>• Manage steward rotations</li>
                  </ul>
                  <div className="mt-2 text-xs text-purple-600">Placement: Strategic positions with oversight</div>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-2">Crowd Managers</h4>
                  <ul className="text-sm text-orange-700 space-y-1">
                    <li>• Overall crowd condition assessment</li>
                    <li>• Decision authority for flow adjustments</li>
                    <li>• Liaison with security and emergency services</li>
                    <li>• Implementation of crowd control measures</li>
                  </ul>
                  <div className="mt-2 text-xs text-orange-600">Placement: Command center and key locations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Evacuation Planner Tab */}
      {activeTab === "evacuation" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Egress Calculator</CardTitle>
              <CardDescription>Estimate evacuation time based on exit capacity</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Total Occupants: {occupantCount}
                </label>
                <input
                  type="range"
                  min="100"
                  max="10000"
                  step="100"
                  value={occupantCount}
                  onChange={(e) => setOccupantCount(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Exit Width: {exitWidth} inches
                </label>
                <input
                  type="range"
                  min="36"
                  max="120"
                  step="6"
                  value={exitWidth}
                  onChange={(e) => setExitWidth(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">Minimum 36 inches per code</div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
                  Number of Exits: {numExits}
                </label>
                <input
                  type="range"
                  min="2"
                  max="20"
                  step="1"
                  value={numExits}
                  onChange={(e) => setNumExits(Number(e.target.value))}
                  className="w-full"
                />
                <div className="text-xs text-muted-foreground mt-1">Minimum 2 exits remote from each other</div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Evacuation Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-6 bg-muted rounded-lg">
                <div className="text-sm text-muted-foreground mb-2">Estimated Evacuation Time</div>
                <div className={cn(
                  "text-5xl font-bold",
                  evacuationTime <= 4 ? "text-green-600" : evacuationTime <= 8 ? "text-yellow-600" : "text-red-600"
                )}>
                  {evacuationTime} minutes
                </div>
                <div className="text-sm text-muted-foreground mt-2">
                  {evacuationTime <= 4 ? "✓ Meets typical safety standards" : 
                   evacuationTime <= 8 ? "⚠ Review egress capacity" : 
                   "✗ Add exits or reduce occupant load"}
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Flow Rate per Exit</div>
                  <div className="text-2xl font-bold text-blue-700">~{flowRatePerExit}/min</div>
                </div>
                <div className="p-3 bg-blue-50 rounded-lg text-center">
                  <div className="text-sm text-muted-foreground">Total Flow Rate</div>
                  <div className="text-2xl font-bold text-blue-700">~{totalFlowRate}/min</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Evacuation Principles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-2">1. Orderly Exit</h4>
                  <p className="text-sm text-green-700">Rapid but controlled evacuation prevents additional injuries. Avoid panic-inducing announcements.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <h4 className="font-semibold text-blue-800 mb-2">2. Multiple Routes</h4>
                  <p className="text-sm text-blue-700">Distribute evacuees across all available exits. Never funnel everyone to a single exit point.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-2">3. Accessibility</h4>
                  <p className="text-sm text-purple-700">Ensure people with disabilities can evacuate safely. Designate evacuation assistance teams.</p>
                </div>
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <h4 className="font-semibold text-orange-800 mb-2">4. Assembly Points</h4>
                  <p className="text-sm text-orange-700">Designate safe areas away from venue for accountability. Take roll call at assembly points.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Warning Signs Tab */}
      {activeTab === "warnings" && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {warningSigns.map((warning) => (
              <Card
                key={warning.sign}
                className={cn(
                  "border-2",
                  warning.severity === "critical" ? "border-red-200" : "border-amber-200"
                )}
              >
                <CardHeader
                  className={cn(
                    warning.severity === "critical" ? "bg-red-50" : "bg-amber-50"
                  )}
                >
                  <CardTitle
                    className={cn(
                      "flex items-center gap-2",
                      warning.severity === "critical" ? "text-red-800" : "text-amber-800"
                    )}
                  >
                    <span>{warning.severity === "critical" ? "🚨" : "⚠️"}</span>
                    {warning.sign}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="mb-4">
                    <h4 className="font-semibold text-foreground mb-2">Warning Indicators:</h4>
                    <ul className="space-y-1">
                      {warning.indicators.map((indicator, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-red-500">•</span>
                          {indicator}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div
                    className={cn(
                      "p-3 rounded-lg",
                      warning.severity === "critical" ? "bg-red-50" : "bg-amber-50"
                    )}
                  >
                    <h4
                      className={cn(
                        "font-semibold mb-2",
                        warning.severity === "critical" ? "text-red-800" : "text-amber-800"
                      )}
                    >
                      Immediate Response:
                    </h4>
                    <ol className="space-y-1">
                      {warning.response.map((step, idx) => (
                        <li
                          key={idx}
                          className={cn(
                            "text-sm flex items-start gap-2",
                            warning.severity === "critical" ? "text-red-700" : "text-amber-700"
                          )}
                        >
                          <span className="font-semibold">{idx + 1}.</span>
                          {step}
                        </li>
                      ))}
                    </ol>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="border-2 border-red-300">
            <CardHeader className="bg-red-100">
              <CardTitle className="text-red-800 text-center text-xl">
                🚨 CRITICAL THRESHOLD: 4 Persons/m² (2.3 sq ft/person) 🚨
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-lg text-red-700 font-semibold mb-4">
                  At 4 persons per square meter (approximately 2.3 sq ft per person), 
                  crowd density becomes CRITICAL and poses immediate danger of crush injuries.
                </p>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-red-800 font-semibold">STOP ENTRY</div>
                    <p className="text-sm text-red-600 mt-1">Immediately prevent additional people from entering the area</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-red-800 font-semibold">OPEN EGRESS</div>
                    <p className="text-sm text-red-600 mt-1">Open all available exits and redirect crowd flow</p>
                  </div>
                  <div className="p-4 bg-red-50 rounded-lg">
                    <div className="text-red-800 font-semibold">CALL FOR HELP</div>
                    <p className="text-sm text-red-600 mt-1">Deploy all available crowd managers and contact emergency services</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Module2_Crowd_Safety;
