"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface AssessmentItem {
  id: string;
  text: string;
  status: "compliant" | "minor" | "major" | "critical" | null;
}

interface AssessmentCategory {
  id: string;
  name: string;
  color: string;
  bgColor: string;
  items: AssessmentItem[];
}

const assessmentCategories: AssessmentCategory[] = [
  {
    id: "egress",
    name: "Means of Egress",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    items: [
      { id: "e1", text: "Minimum 2 exits remote from each other", status: null },
      { id: "e2", text: "Exit doors swing in direction of egress", status: null },
      { id: "e3", text: "Exit signs illuminated and visible", status: null },
      { id: "e4", text: "Exit pathways clear of obstructions", status: null },
      { id: "e5", text: "Panic hardware functional on exit doors", status: null },
      { id: "e6", text: "Adequate exit capacity for occupant load", status: null },
    ],
  },
  {
    id: "fire",
    name: "Fire Protection",
    color: "text-red-700",
    bgColor: "bg-red-50",
    items: [
      { id: "f1", text: "Fire extinguishers accessible and inspected", status: null },
      { id: "f2", text: "Sprinkler system operational (if required)", status: null },
      { id: "f3", text: "Smoke detectors/alarms functional", status: null },
      { id: "f4", text: "Fire department access routes clear", status: null },
      { id: "f5", text: "Flame-resistant decorations/materials", status: null },
    ],
  },
  {
    id: "electrical",
    name: "Electrical Safety",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    items: [
      { id: "el1", text: "Electrical panels accessible and labeled", status: null },
      { id: "el2", text: "Cables protected from pedestrian traffic", status: null },
      { id: "el3", text: "GFCI protection where required", status: null },
      { id: "el4", text: "No exposed wiring or damaged cables", status: null },
    ],
  },
  {
    id: "structural",
    name: "Structural Elements",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    items: [
      { id: "st1", text: "Load limits established for elevated areas", status: null },
      { id: "st2", text: "Barricades/guardrails at elevated edges", status: null },
      { id: "st3", text: "Stage/truss structures properly engineered", status: null },
      { id: "st4", text: "No visible structural damage to venue", status: null },
    ],
  },
  {
    id: "crowd",
    name: "Crowd Infrastructure",
    color: "text-green-700",
    bgColor: "bg-green-50",
    items: [
      { id: "c1", text: "Barriers secure and appropriately placed", status: null },
      { id: "c2", text: "Viewing areas can accommodate expected crowd", status: null },
      { id: "c3", text: "Assembly areas identified outside venue", status: null },
    ],
  },
];

const statusOptions = [
  { value: "compliant", label: "Compliant", color: "text-green-600 bg-green-50 border-green-200", points: 10 },
  { value: "minor", label: "Minor Issue", color: "text-yellow-600 bg-yellow-50 border-yellow-200", points: 5 },
  { value: "major", label: "Major Issue", color: "text-orange-600 bg-orange-50 border-orange-200", points: 2 },
  { value: "critical", label: "Critical", color: "text-red-600 bg-red-50 border-red-200", points: 0 },
];

export const VenueAssessmentTool: React.FC = () => {
  const [categories, setCategories] = useState<AssessmentCategory[]>(assessmentCategories);
  const [activeCategory, setActiveCategory] = useState<string>("egress");

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

  const getCriticalIssues = () => {
    const critical: { category: string; item: string }[] = [];
    categories.forEach((cat) => {
      cat.items.forEach((item) => {
        if (item.status === "critical") {
          critical.push({ category: cat.name, item: item.text });
        }
      });
    });
    return critical;
  };

  const score = calculateScore();
  const criticalIssues = getCriticalIssues();
  const activeCategoryData = categories.find((c) => c.id === activeCategory);

  const getScoreColor = (percent: number) => {
    if (percent >= 90) return "text-green-600";
    if (percent >= 70) return "text-yellow-600";
    if (percent >= 50) return "text-orange-600";
    return "text-red-600";
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Venue Assessment Tool</h2>
        <p className="text-muted-foreground">Comprehensive safety evaluation form</p>
      </div>

      {/* Score Card */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-sm text-muted-foreground">Assessment Score</div>
              <div className={cn("text-4xl font-bold", getScoreColor(score.percent))}>
                {score.score}/{score.max}
              </div>
              <div className={cn("text-lg", getScoreColor(score.percent))}>{Math.round(score.percent)}%</div>
            </div>
            <div className="text-right">
              {criticalIssues.length > 0 && (
                <div className="text-red-600 font-semibold">{criticalIssues.length} Critical Issue(s)</div>
              )}
              {score.percent >= 90 && <div className="text-green-600 font-semibold">✓ Venue Approved</div>}
              {score.percent < 50 && <div className="text-red-600 font-semibold">✕ Venue Not Suitable</div>}
            </div>
          </div>
          <Progress value={score.percent} className="h-3" />
        </CardContent>
      </Card>

      {/* Category Navigation */}
      <div className="grid grid-cols-5 gap-2">
        {categories.map((cat) => {
          const assessed = cat.items.filter((i) => i.status).length;
          const critical = cat.items.filter((i) => i.status === "critical").length;
          const isActive = activeCategory === cat.id;

          return (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all",
                isActive ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300 bg-card",
                critical > 0 && "border-red-300 bg-red-50"
              )}
            >
              <div className={cn("font-semibold text-sm", cat.color)}>{cat.name}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {assessed}/{cat.items.length} assessed
              </div>
              {critical > 0 && <div className="text-xs text-red-600 mt-1">{critical} critical</div>}
            </button>
          );
        })}
      </div>

      {/* Assessment Items */}
      <Card>
        <CardHeader className={cn(activeCategoryData?.bgColor)}>
          <CardTitle className={activeCategoryData?.color}>{activeCategoryData?.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-4">
            {activeCategoryData?.items.map((item) => (
              <div key={item.id} className="p-4 border rounded-lg">
                <p className="font-medium text-foreground mb-3">{item.text}</p>
                <div className="flex gap-2">
                  {statusOptions.map((status) => (
                    <button
                      key={status.value}
                      onClick={() => setItemStatus(activeCategory, item.id, status.value as AssessmentItem["status"])}
                      className={cn(
                        "px-3 py-2 rounded-lg border text-sm font-medium transition-all",
                        item.status === status.value ? status.color : "border-gray-200 hover:border-gray-300"
                      )}
                    >
                      {status.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Report */}
      {score.percent > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Assessment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {criticalIssues.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-800 mb-2">Critical Issues (Must Fix)</h4>
                  <ul className="space-y-2">
                    {criticalIssues.map((issue, idx) => (
                      <li key={idx} className="text-sm text-red-700">
                        <strong>{issue.category}:</strong> {issue.item}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-800 mb-2">Recommendations</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    {score.percent >= 90 && <li>✓ Venue meets safety requirements</li>}
                    {score.percent >= 70 && score.percent < 90 && <li>• Address minor issues before event</li>}
                    {score.percent >= 50 && score.percent < 70 && <li>• Major issues must be resolved</li>}
                    {score.percent < 50 && <li>✕ Significant work required - consider alternate venue</li>}
                  </ul>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-800 mb-2">Documentation</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Photograph all issues identified</li>
                    <li>• Share report with venue management</li>
                    <li>• Retain for insurance records</li>
                    <li>• Update safety plan based on findings</li>
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VenueAssessmentTool;
