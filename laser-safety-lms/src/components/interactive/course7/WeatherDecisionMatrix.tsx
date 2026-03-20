"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface MatrixRow {
  id: string;
  condition: string;
  threshold: string;
  severity: string;
  color: string;
  bgColor: string;
}

interface MatrixColumn {
  id: string;
  productionArea: string;
  responsibilities: string[];
}

interface MatrixCell {
  action: string;
  timing: string;
  priority: number;
  evacuationRequired: boolean;
}

const matrixRows: MatrixRow[] = [
  { id: "critical", condition: "CRITICAL", threshold: "50+ MPH / Tornado", severity: "Evacuation", color: "text-red-600", bgColor: "bg-red-50" },
  { id: "severe", condition: "SEVERE", threshold: "40+ MPH", severity: "Show Delay", color: "text-orange-600", bgColor: "bg-orange-50" },
  { id: "lightning", condition: "LIGHTNING", threshold: "Within 8 miles", severity: "Immediate Shelter", color: "text-purple-600", bgColor: "bg-purple-50" },
  { id: "caution", condition: "CAUTION", threshold: "Nearing 30 MPH", severity: "Prepare", color: "text-yellow-600", bgColor: "bg-yellow-50" },
  { id: "monitor", condition: "MONITOR", threshold: "20+ MPH / 20 miles out", severity: "Watch", color: "text-blue-600", bgColor: "bg-blue-50" },
];

const matrixColumns: MatrixColumn[] = [
  { id: "stage", productionArea: "Stage", responsibilities: ["Structure integrity", "Personnel safety", "Equipment security"] },
  { id: "led", productionArea: "LED Screens", responsibilities: ["Screen positioning", "Message display", "Anchor security"] },
  { id: "audio", productionArea: "Audio", responsibilities: ["Truss position", "Speaker security", "Power management"] },
  { id: "lights", productionArea: "Lights", responsibilities: ["Fixture security", "Power off", "Personnel evacuation"] },
  { id: "audience", productionArea: "Festival/Show", responsibilities: ["Crowd communication", "Shelter direction", "Show status"] },
];

const matrixCells: MatrixCell[][] = [
  // Critical row
  [
    { action: "Open walls; Evacuate", timing: "Immediate", priority: 1, evacuationRequired: true },
    { action: "Land anchor; Message evac", timing: "Immediate", priority: 1, evacuationRequired: true },
    { action: "Power off; Evacuate", timing: "Immediate", priority: 1, evacuationRequired: true },
    { action: "Power off; Evacuate", timing: "Immediate", priority: 1, evacuationRequired: true },
    { action: "Show delay; Shelter advisory", timing: "Immediate", priority: 1, evacuationRequired: true },
  ],
  // Severe row
  [
    { action: "Land anchor; Message evac", timing: "5 min", priority: 1, evacuationRequired: true },
    { action: "Land; Message delays", timing: "10 min", priority: 2, evacuationRequired: true },
    { action: "Flatten truss; Evacuate", timing: "10 min", priority: 2, evacuationRequired: true },
    { action: "Secure; Power off; Evacuate", timing: "5 min", priority: 2, evacuationRequired: true },
    { action: "Show delay; Shelter advisory", timing: "10 min", priority: 1, evacuationRequired: true },
  ],
  // Lightning row
  [
    { action: "Take shelter", timing: "Immediate", priority: 1, evacuationRequired: true },
    { action: "Message: Take shelter", timing: "Immediate", priority: 2, evacuationRequired: true },
    { action: "Power off; Shelter", timing: "3 min", priority: 1, evacuationRequired: true },
    { action: "Secure; Power off; Evacuate", timing: "3 min", priority: 1, evacuationRequired: true },
    { action: "Show delay; Shelter advisory", timing: "5 min", priority: 1, evacuationRequired: true },
  ],
  // Caution row
  [
    { action: "Vent; Land anchor", timing: "15 min", priority: 2, evacuationRequired: false },
    { action: "Land PA delays", timing: "10 min", priority: 2, evacuationRequired: false },
    { action: "Flatten truss", timing: "15 min", priority: 2, evacuationRequired: false },
    { action: "Secure; Power off", timing: "10 min", priority: 2, evacuationRequired: false },
    { action: "Monitor; Prepare", timing: "Ongoing", priority: 3, evacuationRequired: false },
  ],
  // Monitor row
  [
    { action: "Vent stage; Monitor", timing: "Ongoing", priority: 3, evacuationRequired: false },
    { action: "Land", timing: "10 min", priority: 3, evacuationRequired: false },
    { action: "Monitor PA swing", timing: "Ongoing", priority: 3, evacuationRequired: false },
    { action: "Monitor rig swing", timing: "Ongoing", priority: 3, evacuationRequired: false },
    { action: "Monitor conditions", timing: "Ongoing", priority: 3, evacuationRequired: false },
  ],
];

export const WeatherDecisionMatrix: React.FC = () => {
  const [selectedCell, setSelectedCell] = useState<{ row: number; col: number } | null>(null);
  const [hoveredCell, setHoveredCell] = useState<{ row: number; col: number } | null>(null);

  const getCellContent = (row: number, col: number): MatrixCell => {
    return matrixCells[row]?.[col] || { action: "", timing: "", priority: 0, evacuationRequired: false };
  };

  const getPriorityColor = (priority: number) => {
    switch (priority) {
      case 1:
        return "text-red-600 bg-red-50";
      case 2:
        return "text-orange-600 bg-orange-50";
      case 3:
        return "text-blue-600 bg-blue-50";
      default:
        return "text-muted-foreground bg-muted";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Weather Decision Matrix</h2>
        <p className="text-muted-foreground">Production area × weather condition response grid</p>
      </div>

      {/* Matrix */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr>
                <th className="p-4 bg-muted border-b border-r min-w-[180px]">
                  <div className="text-sm font-semibold text-muted-foreground">Weather Condition</div>
                  <div className="text-xs text-muted-foreground">Threshold</div>
                </th>
                {matrixColumns.map((col) => (
                  <th key={col.id} className="p-4 bg-muted border-b min-w-[150px]">
                    <div className="text-sm font-semibold text-foreground">{col.productionArea}</div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrixRows.map((row, rowIndex) => (
                <tr key={row.id}>
                  <td className={cn("p-4 border-b border-r", row.bgColor)}>
                    <div className={cn("font-semibold", row.color)}>{row.condition}</div>
                    <div className="text-xs text-muted-foreground">{row.threshold}</div>
                    <div className="text-xs text-muted-foreground mt-1">{row.severity}</div>
                  </td>
                  {matrixColumns.map((col, colIndex) => {
                    const cell = getCellContent(rowIndex, colIndex);
                    const isSelected = selectedCell?.row === rowIndex && selectedCell?.col === colIndex;
                    const isHovered = hoveredCell?.row === rowIndex && hoveredCell?.col === colIndex;

                    return (
                      <td
                        key={col.id}
                        className={cn(
                          "p-3 border-b cursor-pointer transition-all",
                          isSelected ? "bg-blue-100" : isHovered ? "bg-muted" : ""
                        )}
                        onClick={() => setSelectedCell({ row: rowIndex, col: colIndex })}
                        onMouseEnter={() => setHoveredCell({ row: rowIndex, col: colIndex })}
                        onMouseLeave={() => setHoveredCell(null)}
                      >
                        <div className="text-sm font-medium text-foreground">{cell.action}</div>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={cn("text-xs px-2 py-0.5 rounded", getPriorityColor(cell.priority))}>
                            P{cell.priority}
                          </span>
                          <span className="text-xs text-muted-foreground">{cell.timing}</span>
                        </div>
                        {cell.evacuationRequired && (
                          <div className="mt-1 text-xs text-red-600 font-medium">⚠ Evacuation</div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Selected Cell Detail */}
      {selectedCell && (
        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle>
              {matrixRows[selectedCell.row].condition} × {matrixColumns[selectedCell.col].productionArea}
            </CardTitle>
            <CardDescription>
              {matrixRows[selectedCell.row].threshold} • Priority {getCellContent(selectedCell.row, selectedCell.col).priority}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Required Action</h4>
                <p className="text-lg text-foreground">{getCellContent(selectedCell.row, selectedCell.col).action}</p>
                <div className="mt-4 space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Timing:</span>
                    <span className="font-medium">{getCellContent(selectedCell.row, selectedCell.col).timing}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">Priority:</span>
                    <span className={cn("px-2 py-0.5 rounded text-sm", getPriorityColor(getCellContent(selectedCell.row, selectedCell.col).priority))}>
                      Priority {getCellContent(selectedCell.row, selectedCell.col).priority}
                    </span>
                  </div>
                  {getCellContent(selectedCell.row, selectedCell.col).evacuationRequired && (
                    <div className="text-red-600 font-medium">⚠ Evacuation Required</div>
                  )}
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-foreground mb-2">Area Responsibilities</h4>
                <ul className="space-y-1">
                  {matrixColumns[selectedCell.col].responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center">
                      <span className="mr-2">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Legend */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Priority Levels</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs bg-red-50 text-red-600">P1</span>
              <span className="text-sm text-muted-foreground">Immediate Action Required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs bg-orange-50 text-orange-600">P2</span>
              <span className="text-sm text-muted-foreground">Prompt Action Required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-1 rounded text-xs bg-blue-50 text-blue-600">P3</span>
              <span className="text-sm text-muted-foreground">Monitor and Prepare</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherDecisionMatrix;
