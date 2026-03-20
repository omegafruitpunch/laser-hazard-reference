"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VenueElement {
  id: string;
  type: "stage" | "seating" | "standing" | "exit" | "barrier" | "firstaid" | "extinguisher";
  x: number;
  y: number;
  label: string;
}

interface ElementTemplate {
  type: VenueElement["type"];
  label: string;
  icon: string;
  color: string;
}

const elementTemplates: ElementTemplate[] = [
  { type: "stage", label: "Stage", icon: "🎭", color: "bg-purple-500" },
  { type: "seating", label: "Seating", icon: "🪑", color: "bg-blue-500" },
  { type: "standing", label: "Standing Area", icon: "👥", color: "bg-green-500" },
  { type: "exit", label: "Exit Door", icon: "🚪", color: "bg-red-500" },
  { type: "barrier", label: "Barrier", icon: "🚧", color: "bg-yellow-500" },
  { type: "firstaid", label: "First Aid", icon: "➕", color: "bg-card border-2 border-green-500" },
  { type: "extinguisher", label: "Fire Extinguisher", icon: "🧯", color: "bg-red-600" },
];

export const EmergencyEgressPlanner: React.FC = () => {
  const [elements, setElements] = useState<VenueElement[]>([]);
  const [selectedElement, setSelectedElement] = useState<ElementTemplate | null>(null);
  const [occupantLoad, setOccupantLoad] = useState(500);

  const addElement = (type: VenueElement["type"], x: number, y: number) => {
    const template = elementTemplates.find((t) => t.type === type);
    if (!template) return;

    const newElement: VenueElement = {
      id: `el-${Date.now()}`,
      type,
      x,
      y,
      label: template.label,
    };
    setElements([...elements, newElement]);
  };

  const removeElement = (id: string) => {
    setElements(elements.filter((e) => e.id !== id));
  };

  const clearAll = () => {
    setElements([]);
  };

  const getExitStats = () => {
    const exits = elements.filter((e) => e.type === "exit");
    // Rough estimate: each 36" exit door = 200 people capacity
    const exitCapacity = exits.length * 200;
    return {
      count: exits.length,
      capacity: exitCapacity,
      sufficient: exitCapacity >= occupantLoad,
    };
  };

  const exitStats = getExitStats();

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Emergency Egress Planner</h2>
        <p className="text-muted-foreground">Design venue layout with egress analysis</p>
      </div>

      {/* Occupant Load */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <label className="block text-sm font-medium text-foreground mb-1">
                Expected Occupant Load: {occupantLoad} people
              </label>
              <input
                type="range"
                min="50"
                max="5000"
                step="50"
                value={occupantLoad}
                onChange={(e) => setOccupantLoad(Number(e.target.value))}
                className="w-full"
              />
            </div>
            <div className="text-right">
              <div className="text-sm text-muted-foreground">Exit Capacity</div>
              <div className={cn("text-2xl font-bold", exitStats.sufficient ? "text-green-600" : "text-red-600")}>
                {exitStats.capacity}
              </div>
              <div className="text-xs text-muted-foreground">{exitStats.count} exits configured</div>
            </div>
          </div>
          {!exitStats.sufficient && (
            <p className="text-sm text-red-600 mt-2">
              ⚠️ Insufficient exit capacity. Add {Math.ceil((occupantLoad - exitStats.capacity) / 200)} more exit(s).
            </p>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Element Palette */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-sm">Element Palette</CardTitle>
            <CardDescription>Click to select, then click on canvas</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {elementTemplates.map((template) => (
                <button
                  key={template.type}
                  onClick={() => setSelectedElement(selectedElement?.type === template.type ? null : template)}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 text-left flex items-center gap-3 transition-all",
                    selectedElement?.type === template.type
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className={cn("w-8 h-8 rounded flex items-center justify-center text-lg", template.color)}>
                    {template.icon}
                  </span>
                  <span className="text-sm font-medium">{template.label}</span>
                </button>
              ))}
            </div>

            <Button variant="outline" className="w-full mt-4" onClick={clearAll}>
              Clear All
            </Button>
          </CardContent>
        </Card>

        {/* Design Canvas */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Venue Layout Designer</CardTitle>
            <CardDescription>
              {selectedElement
                ? `Click on the grid to place ${selectedElement.label}`
                : "Select an element from the palette to start designing"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div
              className="relative bg-muted rounded-lg overflow-hidden cursor-crosshair"
              style={{ height: "400px" }}
              onClick={(e) => {
                if (!selectedElement) return;
                const rect = e.currentTarget.getBoundingClientRect();
                const x = ((e.clientX - rect.left) / rect.width) * 100;
                const y = ((e.clientY - rect.top) / rect.height) * 100;
                addElement(selectedElement.type, x, y);
              }}
            >
              {/* Grid */}
              <div className="absolute inset-0 opacity-20">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`h-${i}`} className="absolute w-full h-px bg-gray-400" style={{ top: `${i * 10}%` }} />
                ))}
                {Array.from({ length: 10 }).map((_, i) => (
                  <div key={`v-${i}`} className="absolute h-full w-px bg-gray-400" style={{ left: `${i * 10}%` }} />
                ))}
              </div>

              {/* Elements */}
              {elements.map((element) => {
                const template = elementTemplates.find((t) => t.type === element.type);
                return (
                  <div
                    key={element.id}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                    style={{ left: `${element.x}%`, top: `${element.y}%` }}
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(element.id);
                    }}
                  >
                    <div
                      className={cn(
                        "w-10 h-10 rounded-lg flex items-center justify-center text-lg shadow-md transition-transform group-hover:scale-110",
                        template?.color
                      )}
                      title={`${element.label} (click to remove)`}
                    >
                      {template?.icon}
                    </div>
                    <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-xs bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none">
                      {element.label} • Click to remove
                    </div>
                  </div>
                );
              })}

              {elements.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-4xl mb-2">📐</div>
                    <p>Select an element and click here to place it</p>
                  </div>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              {elementTemplates.map((t) => (
                <div key={t.type} className="flex items-center gap-2">
                  <span className={cn("w-5 h-5 rounded flex items-center justify-center text-xs", t.color)}>
                    {t.icon}
                  </span>
                  <span className="text-muted-foreground">{t.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Validation Rules */}
      <Card>
        <CardHeader>
          <CardTitle>Egress Requirements Checklist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            <div className={cn("p-4 rounded-lg border", exitStats.count >= 2 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{exitStats.count >= 2 ? "✓" : "✕"}</span>
                <span className="font-medium">Minimum 2 exits</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Current: {exitStats.count} exit(s)</p>
            </div>

            <div className={cn("p-4 rounded-lg border", exitStats.sufficient ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}>
              <div className="flex items-center gap-2">
                <span className="text-xl">{exitStats.sufficient ? "✓" : "✕"}</span>
                <span className="font-medium">Adequate exit capacity</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Capacity: {exitStats.capacity} / Required: {occupantLoad}
              </p>
            </div>

            <div
              className={cn(
                "p-4 rounded-lg border",
                elements.some((e) => e.type === "firstaid") ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{elements.some((e) => e.type === "firstaid") ? "✓" : "⚠"}</span>
                <span className="font-medium">First aid station</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {elements.some((e) => e.type === "firstaid") ? "Positioned on layout" : "Not yet placed"}
              </p>
            </div>

            <div
              className={cn(
                "p-4 rounded-lg border",
                elements.some((e) => e.type === "extinguisher") ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
              )}
            >
              <div className="flex items-center gap-2">
                <span className="text-xl">{elements.some((e) => e.type === "extinguisher") ? "✓" : "⚠"}</span>
                <span className="font-medium">Fire extinguishers</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Count: {elements.filter((e) => e.type === "extinguisher").length}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyEgressPlanner;
