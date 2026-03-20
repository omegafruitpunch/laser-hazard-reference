"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  ClipboardList, 
  CheckCircle2,
  Download,
  Printer,
  RotateCcw,
  MapPin,
  Lightbulb,
  Users,
  Calendar,
  Building2,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from "lucide-react";

interface ChecklistItem {
  id: string;
  category: string;
  text: string;
  required: boolean;
  states: string[];
  completed: boolean;
}

type OperationType = "single" | "tour" | "installation" | "outdoor";
type LaserClass = "class3b" | "class4";
type AudienceType = "no-scanning" | "scanning" | "outdoor-beams";

const availableStates = [
  { id: "illinois", name: "Illinois", short: "IL" },
  { id: "massachusetts", name: "Massachusetts", short: "MA" },
  { id: "nevada", name: "Nevada", short: "NV" },
  { id: "new-york", name: "New York", short: "NY" },
  { id: "texas", name: "Texas", short: "TX" },
  { id: "washington", name: "Washington", short: "WA" },
];

const baseChecklist: Omit<ChecklistItem, "completed">[] = [
  // Regulatory Documentation
  { id: "reg-1", category: "Regulatory", text: "Laser system registration (if required)", required: true, states: ["illinois", "massachusetts", "new-york", "texas"] },
  { id: "reg-2", category: "Regulatory", text: "Advance notification submitted", required: true, states: ["illinois", "massachusetts", "nevada", "new-york", "texas", "washington"] },
  { id: "reg-3", category: "Regulatory", text: "LSO qualification documentation", required: true, states: ["illinois", "massachusetts"] },
  { id: "reg-4", category: "Regulatory", text: "Class A/B Certificate (NY only)", required: true, states: ["new-york"] },
  { id: "reg-5", category: "Regulatory", text: "Vendor notification (MA vendors)", required: true, states: ["massachusetts"] },
  
  // Equipment Documentation
  { id: "equip-1", category: "Equipment", text: "Laser equipment specifications", required: true, states: ["illinois", "massachusetts", "new-york", "texas"] },
  { id: "equip-2", category: "Equipment", text: "Classification certificates", required: true, states: ["illinois", "massachusetts", "new-york", "texas"] },
  { id: "equip-3", category: "Equipment", text: "Maintenance records current", required: false, states: ["illinois", "massachusetts", "new-york", "texas"] },
  { id: "equip-4", category: "Equipment", text: "Beam diagnostic equipment available", required: false, states: [] },
  
  // Safety Documentation
  { id: "safety-1", category: "Safety", text: "MPE calculations completed", required: true, states: [] },
  { id: "safety-2", category: "Safety", text: "NOHD calculations and signage", required: true, states: [] },
  { id: "safety-3", category: "Safety", text: "Safety zone established", required: true, states: [] },
  { id: "safety-4", category: "Safety", text: "Emergency shutdown procedures", required: true, states: [] },
  { id: "safety-5", category: "Safety", text: "Protective eyewear available", required: true, states: [] },
  { id: "safety-6", category: "Safety", text: "Audience scanning safety assessment", required: true, states: [] },
  
  // Personnel
  { id: "personnel-1", category: "Personnel", text: "LSO designated and present", required: true, states: ["illinois", "massachusetts", "new-york", "texas"] },
  { id: "personnel-2", category: "Personnel", text: "Operator training documented", required: true, states: ["new-york"] },
  { id: "personnel-3", category: "Personnel", text: "Crew safety briefing completed", required: true, states: [] },
  
  // Venue
  { id: "venue-1", category: "Venue", text: "Venue approval obtained", required: true, states: [] },
  { id: "venue-2", category: "Venue", text: "Height requirements verified (6m/20ft)", required: true, states: ["illinois", "massachusetts"] },
  { id: "venue-3", category: "Venue", text: "Emergency exits accessible", required: true, states: [] },
  { id: "venue-4", category: "Venue", text: "Power compatibility confirmed", required: true, states: [] },
  
  // Outdoor/Scanning Specific
  { id: "outdoor-1", category: "Special", text: "FAA notification (outdoor beams)", required: true, states: [] },
  { id: "outdoor-2", category: "Special", text: "Weather contingency plan", required: true, states: [] },
  { id: "outdoor-3", category: "Special", text: "Airspace clearance (if applicable)", required: true, states: [] },
  { id: "scanning-1", category: "Special", text: "Audience scanning variance (if applicable)", required: true, states: [] },
];

export function ChecklistGenerator() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [operationType, setOperationType] = useState<OperationType>("single");
  const [laserClass, setLaserClass] = useState<LaserClass>("class4");
  const [audienceType, setAudienceType] = useState<AudienceType>("no-scanning");
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Regulatory"]));

  const toggleState = (stateId: string) => {
    setSelectedStates((prev) =>
      prev.includes(stateId)
        ? prev.filter((s) => s !== stateId)
        : [...prev, stateId]
    );
  };

  const toggleItem = (itemId: string) => {
    const newCompleted = new Set(completedItems);
    if (newCompleted.has(itemId)) {
      newCompleted.delete(itemId);
    } else {
      newCompleted.add(itemId);
    }
    setCompletedItems(newCompleted);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const generatedChecklist = useMemo(() => {
    let items = baseChecklist.filter((item) => {
      // Include if no specific states or matches selected states
      if (item.states.length > 0 && !item.states.some((s) => selectedStates.includes(s))) {
        return false;
      }
      return true;
    });

    // Add operation-specific items
    if (operationType === "tour") {
      items.push(
        { id: "tour-1", category: "Tour", text: "Multi-state routing optimized", required: true, states: [] },
        { id: "tour-2", category: "Tour", text: "Equipment transport documentation", required: true, states: [] },
        { id: "tour-3", category: "Tour", text: "Interstate compliance coordination", required: true, states: [] }
      );
    }

    if (operationType === "outdoor") {
      items.push(
        { id: "out-1", category: "Outdoor", text: "FAA Form 7140-1 filed (if applicable)", required: true, states: [] },
        { id: "out-2", category: "Outdoor", text: "Local permits for outdoor operation", required: true, states: [] },
        { id: "out-3", category: "Outdoor", text: "Wind/weather monitoring plan", required: true, states: [] }
      );
    }

    if (audienceType === "scanning") {
      items.push(
        { id: "scan-1", category: "Scanning", text: "Scanning variance approved", required: true, states: [] },
        { id: "scan-2", category: "Scanning", text: "MPE levels verified for scanning", required: true, states: [] },
        { id: "scan-3", category: "Scanning", text: "Scanning safety officer assigned", required: true, states: [] }
      );
    }

    // Mark completed status
    return items.map((item) => ({
      ...item,
      completed: completedItems.has(item.id),
    }));
  }, [selectedStates, operationType, laserClass, audienceType, completedItems]);

  const groupedItems = useMemo(() => {
    const groups: Record<string, typeof generatedChecklist> = {};
    generatedChecklist.forEach((item) => {
      if (!groups[item.category]) {
        groups[item.category] = [];
      }
      groups[item.category].push(item);
    });
    return groups;
  }, [generatedChecklist]);

  const completedCount = generatedChecklist.filter((i) => i.completed).length;
  const totalCount = generatedChecklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const exportChecklist = () => {
    const lines = [
      `CUSTOMIZED COMPLIANCE CHECKLIST`,
      `Generated: ${new Date().toLocaleDateString()}`,
      ``,
      `States: ${selectedStates.map((s) => availableStates.find((a) => a.id === s)?.name).join(", ") || "None selected"}`,
      `Operation: ${operationType}`,
      `Laser Class: ${laserClass}`,
      `Audience: ${audienceType}`,
      ``,
      `PROGRESS: ${completedCount}/${totalCount} (${Math.round(progress)}%)`,
      ``,
    ];

    Object.entries(groupedItems).forEach(([category, items]) => {
      lines.push(`${category.toUpperCase()}`);
      lines.push("-".repeat(category.length));
      items.forEach((item) => {
        const status = item.completed ? "[X]" : "[ ]";
        const required = item.required ? "(Required)" : "(Optional)";
        lines.push(`${status} ${item.text} ${required}`);
      });
      lines.push("");
    });

    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-checklist-${new Date().toISOString().split("T")[0]}.txt`;
    a.click();
  };

  const printChecklist = () => {
    window.print();
  };

  const reset = () => {
    setSelectedStates([]);
    setOperationType("single");
    setLaserClass("class4");
    setAudienceType("no-scanning");
    setCompletedItems(new Set());
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="h-5 w-5" />
              Checklist Generator
            </CardTitle>
            <CardDescription>
              Customized compliance checklists by operation type and state
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportChecklist}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={printChecklist}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Configuration */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* State Selection */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Operating States
            </label>
            <div className="flex flex-wrap gap-2">
              {availableStates.map((state) => (
                <Button
                  key={state.id}
                  variant={selectedStates.includes(state.id) ? "default" : "outline"}
                  size="sm"
                  onClick={() => toggleState(state.id)}
                >
                  {state.short}
                </Button>
              ))}
            </div>
          </div>

          {/* Operation Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Operation Type
            </label>
            <select
              value={operationType}
              onChange={(e) => setOperationType(e.target.value as OperationType)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="single">Single Event</option>
              <option value="tour">Multi-State Tour</option>
              <option value="installation">Permanent Installation</option>
              <option value="outdoor">Outdoor Event</option>
            </select>
          </div>

          {/* Laser Class */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Lightbulb className="h-4 w-4" />
              Laser Classification
            </label>
            <select
              value={laserClass}
              onChange={(e) => setLaserClass(e.target.value as LaserClass)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="class3b">Class 3B</option>
              <option value="class4">Class 4</option>
            </select>
          </div>

          {/* Audience Type */}
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Users className="h-4 w-4" />
              Audience Exposure
            </label>
            <select
              value={audienceType}
              onChange={(e) => setAudienceType(e.target.value as AudienceType)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="no-scanning">No Audience Scanning</option>
              <option value="scanning">Audience Scanning</option>
              <option value="outdoor-beams">Outdoor Beam Projection</option>
            </select>
          </div>
        </div>

        {/* Progress */}
        <div className="p-4 bg-muted rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Checklist Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedCount} of {totalCount} completed
            </span>
          </div>
          <div className="h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Checklist */}
        <div className="space-y-2">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <span className="font-medium">{category}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {items.filter((i) => i.completed).length}/{items.length}
                  </Badge>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>
              {expandedCategories.has(category) && (
                <div className="divide-y">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors ${
                        item.completed ? "bg-muted/20" : ""
                      }`}
                      onClick={() => toggleItem(item.id)}
                    >
                      <div className="mt-0.5">
                        {item.completed ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${item.completed ? "line-through text-muted-foreground" : ""}`}>
                          {item.text}
                        </p>
                        <div className="flex gap-2 mt-1">
                          {item.required ? (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Optional</Badge>
                          )}
                          {item.states.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                              {item.states.map((s) => availableStates.find((a) => a.id === s)?.short).join(", ")}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {generatedChecklist.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select states to generate your customized checklist</p>
          </div>
        )}

        {/* Reset */}
        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Checklist
        </Button>
      </CardContent>
    </Card>
  );
}

export default ChecklistGenerator;
