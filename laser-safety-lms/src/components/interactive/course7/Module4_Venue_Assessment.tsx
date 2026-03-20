"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AssessmentItem {
  id: string;
  text: string;
  standard?: string;
  status: "compliant" | "minor" | "major" | "critical" | "na" | null;
  notes?: string;
}

interface AssessmentCategory {
  id: string;
  name: string;
  description: string;
  color: string;
  bgColor: string;
  items: AssessmentItem[];
}

const assessmentCategories: AssessmentCategory[] = [
  {
    id: "egress",
    name: "Means of Egress",
    description: "Exit routes and emergency evacuation paths",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    items: [
      { id: "eg-001", text: "Minimum 2 exits remote from each other", standard: "NFPA 101", status: null },
      { id: "eg-002", text: "Exit width minimum 36 inches (0.914m)", standard: "NFPA 101", status: null },
      { id: "eg-003", text: "Exit doors swing in direction of egress", standard: "NFPA 101", status: null },
      { id: "eg-004", text: "Exit signs illuminated and visible", standard: "NFPA 101", status: null, notes: "Minimum 6-inch lettering; 8-inch if viewed from >100 ft" },
      { id: "eg-005", text: "Exit pathways clear of obstructions", standard: "NFPA 101", status: null },
      { id: "eg-006", text: "Panic hardware functional on exit doors", standard: "NFPA 101", status: null },
      { id: "eg-007", text: "Emergency lighting functional in all exit paths", standard: "NFPA 101", status: null },
      { id: "eg-008", text: "Exit discharge leads to public way (min 10ft width/height)", standard: "NFPA 101", status: null },
      { id: "eg-009", text: "Stairway width minimum 36 inches with 80-inch headroom", standard: "NFPA 101", status: null },
      { id: "eg-010", text: "Wide stairways (>6ft) divided into 3ft sections with handrails", standard: "NFPA 101", status: null },
    ],
  },
  {
    id: "fire",
    name: "Fire Safety",
    description: "Fire detection, suppression, and safety systems",
    color: "text-red-700",
    bgColor: "bg-red-50",
    items: [
      { id: "fs-001", text: "Fire extinguishers accessible and inspected", standard: "NFPA 10", status: null, notes: "ABC type for general areas; max 50ft travel distance" },
      { id: "fs-002", text: "Sprinkler system operational (if required)", standard: "NFPA 13", status: null },
      { id: "fs-003", text: "Smoke detectors/alarms functional", standard: "NFPA 72", status: null },
      { id: "fs-004", text: "Fire department access routes clear", standard: "IFC", status: null },
      { id: "fs-005", text: "Fire extinguishers within 30ft of cooking equipment", standard: "NFPA 1", status: null },
      { id: "fs-006", text: "Tents/membrane structures have NFPA 701 flame certification", standard: "NFPA 701", status: null },
      { id: "fs-007", text: "Guy lines minimum 8ft height over egress paths", standard: "NFPA 1", status: null },
      { id: "fs-008", text: "Fire watch provisions identified for hot work", standard: "NFPA 1", status: null },
    ],
  },
  {
    id: "electrical",
    name: "Electrical Safety",
    description: "Electrical systems and temporary power",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    items: [
      { id: "el-001", text: "Electrical panels accessible and clearly labeled", standard: "NEC", status: null },
      { id: "el-002", text: "Cables protected from pedestrian traffic", standard: "NEC", status: null },
      { id: "el-003", text: "GFCI protection where required", standard: "NEC 210.8", status: null },
      { id: "el-004", text: "No exposed wiring or damaged cables", standard: "NEC", status: null },
      { id: "el-005", text: "Adequate power capacity for event requirements", standard: "NEC", status: null },
      { id: "el-006", text: "Emergency power systems tested and functional", standard: "NFPA 110", status: null },
      { id: "el-007", text: "Distribution panels properly grounded", standard: "NEC", status: null },
    ],
  },
  {
    id: "structural",
    name: "Structural Elements",
    description: "Building and temporary structure integrity",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    items: [
      { id: "st-001", text: "Load limits established for elevated areas", standard: "IBC", status: null },
      { id: "st-002", text: "Barricades/guardrails at elevated edges", standard: "IBC", status: null, notes: "Required where height exceeds threshold" },
      { id: "st-003", text: "Stage/truss structures properly engineered", standard: "ANSI E1.21", status: null, notes: "Engineering drawings and calculations required" },
      { id: "st-004", text: "No visible structural damage to venue", standard: "IBC", status: null },
      { id: "st-005", text: "Temporary structure wind load ratings documented", standard: "ASCE 7", status: null },
      { id: "st-006", text: "Seating structures properly anchored", standard: "IBC", status: null },
      { id: "st-007", text: "Non-slip surfaces on stage platforms", standard: "OSHA", status: null },
    ],
  },
  {
    id: "laser",
    name: "Laser Safety",
    description: "Laser display equipment and hazard zones",
    color: "text-pink-700",
    bgColor: "bg-pink-50",
    items: [
      { id: "ls-001", text: "Reflective surfaces documented and identified", standard: "ANSI Z136", status: null, notes: "Mirrors, glass, water features, metallic decorations" },
      { id: "ls-002", text: "NOHD calculations completed for all beams", standard: "ANSI Z136.10", status: null },
      { id: "ls-003", text: "Beam paths clear of audience and reflective surfaces", standard: "FDA 21 CFR 1040", status: null },
      { id: "ls-004", text: "Scan fail protection functional on all projectors", standard: "IEC 60825-1", status: null },
      { id: "ls-005", text: "Appropriate protective eyewear available", standard: "ANSI Z136", status: null },
      { id: "ls-006", text: "Laser safety officer designated for event", standard: "ANSI Z136", status: null },
      { id: "ls-007", text: "Emergency shutdown procedures posted", standard: "ANSI Z136", status: null },
    ],
  },
  {
    id: "hvac",
    name: "HVAC & Environment",
    description: "Ventilation, temperature, and air quality",
    color: "text-cyan-700",
    bgColor: "bg-cyan-50",
    items: [
      { id: "hv-001", text: "HVAC systems operational and adequate for occupancy", standard: "ASHRAE", status: null },
      { id: "hv-002", text: "Smoke evacuation system functional", standard: "NFPA 92", status: null },
      { id: "hv-003", text: "Temperature control adequate for event duration", standard: "ASHRAE 55", status: null },
      { id: "hv-004", text: "Emergency ventilation for pyrotechnic effects", standard: "NFPA 160", status: null },
      { id: "hv-005", text: "Haze/fog effects compatible with HVAC detection", standard: "NFPA 72", status: null },
    ],
  },
  {
    id: "crowd",
    name: "Crowd Infrastructure",
    description: "Barriers, viewing areas, and crowd management",
    color: "text-green-700",
    bgColor: "bg-green-50",
    items: [
      { id: "cr-001", text: "Barriers secure and appropriately placed", standard: "ANSI ES1.9", status: null },
      { id: "cr-002", text: "Barrier engineered for expected crowd pressure", standard: "ANSI ES1.9", status: null },
      { id: "cr-003", text: "Viewing areas can accommodate expected crowd", standard: "NFPA 101", status: null },
      { id: "cr-004", text: "Assembly areas identified outside venue", standard: "NFPA 101", status: null },
      { id: "cr-005", text: "Accessible viewing areas for people with disabilities", standard: "ADA", status: null },
    ],
  },
  {
    id: "communications",
    name: "Communications",
    description: "Emergency communication systems",
    color: "text-indigo-700",
    bgColor: "bg-indigo-50",
    items: [
      { id: "com-001", text: "Public Address (PA) system coverage adequate", standard: "NFPA 72", status: null },
      { id: "com-002", text: "PA system has emergency announcement capability", standard: "NFPA 72", status: null },
      { id: "com-003", text: "Backup power for PA system", standard: "NFPA 72", status: null },
      { id: "com-004", text: "Radio communication channels sufficient for all teams", standard: "Best Practice", status: null },
      { id: "com-005", text: "Incident Command Post location established", standard: "NIMS", status: null },
    ],
  },
];

const statusOptions = [
  { value: "compliant", label: "✓ Compliant", color: "text-green-600 bg-green-50 border-green-200", points: 10 },
  { value: "minor", label: "○ Minor", color: "text-yellow-600 bg-yellow-50 border-yellow-200", points: 7 },
  { value: "major", label: "△ Major", color: "text-orange-600 bg-orange-50 border-orange-200", points: 3 },
  { value: "critical", label: "✕ Critical", color: "text-red-600 bg-red-50 border-red-200", points: 0 },
  { value: "na", label: "N/A", color: "text-muted-foreground bg-muted border-gray-200", points: 10 },
];

export const Module4_Venue_Assessment: React.FC = () => {
  const [categories, setCategories] = useState<AssessmentCategory[]>(assessmentCategories);
  const [activeCategory, setActiveCategory] = useState<string>("egress");
  const [showReport, setShowReport] = useState(false);

  const setItemStatus = (categoryId: string, itemId: string, status: AssessmentItem["status"]) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) => (item.id === itemId ? { ...item, status } : item)),
            }
          : cat
      )
    );
  };

  const calculateScore = () => {
    let total = 0;
    let maxPossible = 0;
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        maxPossible += 10;
        if (item.status) {
          const points = statusOptions.find((s) => s.value === item.status)?.points || 0;
          total += points;
        }
      });
    });
    return { score: total, max: maxPossible, percent: maxPossible > 0 ? (total / maxPossible) * 100 : 0 };
  };

  const getIssuesBySeverity = (severity: "critical" | "major" | "minor") => {
    const issues: { category: string; item: AssessmentItem }[] = [];
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.status === severity) {
          issues.push({ category: cat.name, item });
        }
      });
    });
    return issues;
  };

  const getCompliantCount = () => {
    let count = 0;
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.status === "compliant" || item.status === "na") count++;
      });
    });
    return count;
  };

  const getAssessedCount = () => {
    let count = 0;
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.status) count++;
      });
    });
    return count;
  };

  const score = calculateScore();
  const criticalIssues = getIssuesBySeverity("critical");
  const majorIssues = getIssuesBySeverity("major");
  const minorIssues = getIssuesBySeverity("minor");
  const activeCategoryData = categories.find((c) => c.id === activeCategory);
  const totalItems = categories.reduce((acc, c) => acc + c.items.length, 0);

  const getScoreColor = (percent: number) => {
    if (percent >= 90) return "text-green-600";
    if (percent >= 70) return "text-yellow-600";
    if (percent >= 50) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBg = (percent: number) => {
    if (percent >= 90) return "bg-green-100";
    if (percent >= 70) return "bg-yellow-100";
    if (percent >= 50) return "bg-orange-100";
    return "bg-red-100";
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Venue Assessment</h1>
        <p className="text-muted-foreground">Systematic evaluation for event safety compliance</p>
      </div>

      {/* Score Dashboard */}
      <Card className={cn("border-l-4", criticalIssues.length > 0 ? "border-l-red-500" : score.percent >= 90 ? "border-l-green-500" : "border-l-amber-500")}>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-4 gap-4 items-center">
            <div>
              <div className="text-sm text-muted-foreground">Assessment Score</div>
              <div className={cn("text-4xl font-bold", getScoreColor(score.percent))}>
                {Math.round(score.percent)}%
              </div>
            </div>
            <div className="md:col-span-2">
              <Progress value={score.percent} className="h-3" />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>{getAssessedCount()}/{totalItems} items assessed</span>
                <span>{getCompliantCount()} compliant</span>
              </div>
            </div>
            <div className="text-right space-y-1">
              {criticalIssues.length > 0 && (
                <div className="text-red-600 font-semibold">{criticalIssues.length} Critical</div>
              )}
              {majorIssues.length > 0 && (
                <div className="text-orange-600 font-semibold">{majorIssues.length} Major</div>
              )}
              {criticalIssues.length === 0 && majorIssues.length === 0 && score.percent >= 90 && (
                <div className="text-green-600 font-semibold">✓ Venue Approved</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
        {categories.map((cat) => {
          const assessed = cat.items.filter((i) => i.status).length;
          const critical = cat.items.filter((i) => i.status === "critical").length;
          const major = cat.items.filter((i) => i.status === "major").length;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all",
                isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-card",
                critical > 0 && "border-red-300 bg-red-50",
                !isActive && major > 0 && critical === 0 && "border-orange-200 bg-orange-50"
              )}
            >
              <div className={cn("font-semibold text-sm", cat.color)}>{cat.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {assessed}/{cat.items.length} assessed
              </div>
              {critical > 0 && <div className="text-xs text-red-600 font-semibold mt-1">{critical} critical</div>}
              {!isActive && major > 0 && critical === 0 && (
                <div className="text-xs text-orange-600 mt-1">{major} major</div>
              )}
            </button>
          );
        })}
      </div>

      {/* Assessment Items */}
      <Card>
        <CardHeader className={cn(activeCategoryData?.bgColor)}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={activeCategoryData?.color}>{activeCategoryData?.name}</CardTitle>
              <CardDescription>{activeCategoryData?.description}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setShowReport(!showReport)}>
              {showReport ? "Hide" : "Show"} Report
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {activeCategoryData?.items.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg hover:border-gray-300 transition-all">
                <div className="flex flex-col md:flex-row md:items-start gap-3">
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{item.text}</p>
                    {item.standard && (
                      <span className="inline-block mt-1 text-xs bg-muted text-muted-foreground px-2 py-0.5 rounded">
                        {item.standard}
                      </span>
                    )}
                    {item.notes && <p className="text-sm text-muted-foreground mt-2">{item.notes}</p>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {statusOptions.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => setItemStatus(activeCategory, item.id, status.value as any)}
                        className={cn(
                          "px-3 py-2 rounded-lg border text-sm font-medium transition-all whitespace-nowrap",
                          item.status === status.value ? status.color : "border-gray-200 hover:border-gray-300"
                        )}
                      >
                        {status.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report Panel */}
      {showReport && (
        <Card className="border-2 border-gray-300">
          <CardHeader className="bg-muted">
            <CardTitle>Venue Assessment Report</CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className={cn("p-4 rounded-lg text-center", getScoreBg(score.percent))}>
                <div className="text-sm text-muted-foreground">Overall Score</div>
                <div className={cn("text-3xl font-bold", getScoreColor(score.percent))}>
                  {Math.round(score.percent)}%
                </div>
              </div>
              <div className="p-4 bg-green-50 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Compliant</div>
                <div className="text-3xl font-bold text-green-700">{getCompliantCount()}</div>
              </div>
              <div className="p-4 bg-red-50 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Critical Issues</div>
                <div className="text-3xl font-bold text-red-700">{criticalIssues.length}</div>
              </div>
              <div className="p-4 bg-orange-50 rounded-lg text-center">
                <div className="text-sm text-muted-foreground">Major Issues</div>
                <div className="text-3xl font-bold text-orange-700">{majorIssues.length}</div>
              </div>
            </div>

            {/* Issues Lists */}
            <div className="space-y-4">
              {criticalIssues.length > 0 && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <span>🚨</span> Critical Issues (Must Fix Before Event)
                  </h4>
                  <ul className="space-y-2">
                    {criticalIssues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                        <span className="font-semibold shrink-0">{issue.category}:</span>
                        <span>{issue.item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {majorIssues.length > 0 && (
                <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                  <h4 className="font-semibold text-orange-800 mb-3 flex items-center gap-2">
                    <span>⚠️</span> Major Issues (Must Address)
                  </h4>
                  <ul className="space-y-2">
                    {majorIssues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                        <span className="font-semibold shrink-0">{issue.category}:</span>
                        <span>{issue.item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {minorIssues.length > 0 && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <h4 className="font-semibold text-yellow-800 mb-3">Minor Issues</h4>
                  <ul className="space-y-2">
                    {minorIssues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                        <span className="font-semibold shrink-0">{issue.category}:</span>
                        <span>{issue.item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Recommendations */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-semibold text-blue-800 mb-2">Recommendations</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                {score.percent >= 90 && <li>✓ Venue meets safety requirements for event</li>}
                {score.percent >= 70 && score.percent < 90 && <li>• Address identified issues before event load-in</li>}
                {score.percent >= 50 && score.percent < 70 && <li>• Significant issues must be resolved before approval</li>}
                {score.percent < 50 && <li>✗ Venue not suitable in current condition - consider alternate venue</li>}
                {criticalIssues.length > 0 && <li>• Schedule re-inspection after critical issues resolved</li>}
              </ul>
            </div>

            {/* Documentation */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 bg-muted border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Documentation Actions</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Photograph all issues identified</li>
                  <li>• Share report with venue management</li>
                  <li>• Retain for insurance records</li>
                  <li>• Update safety plan based on findings</li>
                </ul>
              </div>
              <div className="p-4 bg-muted border border-gray-200 rounded-lg">
                <h4 className="font-semibold text-foreground mb-2">Follow-up Required</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Venue contact: _________________</li>
                  <li>• Inspection date: _________________</li>
                  <li>• Re-inspection date: _________________</li>
                  <li>• Approved by: _________________</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Module4_Venue_Assessment;
