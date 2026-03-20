"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ClipboardList, 
  Plus, 
  Trash2, 
  CheckSquare,
  Square,
  Download,
  Printer,
  Copy,
  ChevronRight
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ChecklistItemType = "checkbox" | "radio" | "text" | "signature";

export interface ChecklistItem {
  id: string;
  text: string;
  type: ChecklistItemType;
  required: boolean;
  options?: string[];
  helpText?: string;
}

export interface ChecklistSection {
  id: string;
  title: string;
  items: ChecklistItem[];
}

export interface ChecklistTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  sections: ChecklistSection[];
}

export interface GeneratedChecklist {
  id: string;
  templateId: string;
  name: string;
  createdAt: Date;
  sections: ChecklistSection[];
  completedItems: string[];
}

export interface ChecklistGeneratorProps {
  templates?: ChecklistTemplate[];
  onSave?: (checklist: GeneratedChecklist) => void;
  onExport?: (checklist: GeneratedChecklist) => void;
  className?: string;
}

// ============================================================================
// Default Templates
// ============================================================================

export const DEFAULT_CHECKLIST_TEMPLATES: ChecklistTemplate[] = [
  {
    id: "preshow",
    name: "Pre-Show Safety Checklist",
    description: "Complete before every laser show performance",
    category: "Operations",
    sections: [
      {
        id: "equipment",
        title: "Equipment Check",
        items: [
          { id: "e1", text: "All laser projectors securely mounted", type: "checkbox", required: true },
          { id: "e2", text: "External optics (mirrors, scanners) secured", type: "checkbox", required: true },
          { id: "e3", text: "Cables in good condition, no trip hazards", type: "checkbox", required: true },
          { id: "e4", text: "Emergency stop accessible and functional", type: "checkbox", required: true },
          { id: "e5", text: "Scan failure system tested", type: "checkbox", required: true },
        ],
      },
      {
        id: "safety",
        title: "Safety Systems",
        items: [
          { id: "s1", text: "Warning signs posted at access points", type: "checkbox", required: true },
          { id: "s2", text: "Controlled area boundaries marked", type: "checkbox", required: true },
          { id: "s3", text: "Minimum separation distances verified", type: "checkbox", required: true },
          { id: "s4", text: "Blanking/masking zones confirmed", type: "checkbox", required: true },
        ],
      },
      {
        id: "personnel",
        title: "Personnel",
        items: [
          { id: "p1", text: "Operator present and competent", type: "checkbox", required: true },
          { id: "p2", text: "LSO notification of show start", type: "checkbox", required: true },
          { id: "p3", text: "Emergency contacts confirmed", type: "checkbox", required: true },
        ],
      },
    ],
  },
  {
    id: "installation",
    name: "Installation Checklist",
    description: "For new or modified laser installations",
    category: "Installation",
    sections: [
      {
        id: "mechanical",
        title: "Mechanical Installation",
        items: [
          { id: "m1", text: "Mounting hardware rated for load", type: "checkbox", required: true },
          { id: "m2", text: "All fasteners properly torqued", type: "checkbox", required: true },
          { id: "m3", text: "Equipment level and aligned", type: "checkbox", required: true },
          { id: "m4", text: "Vibration isolation adequate", type: "checkbox", required: false },
        ],
      },
      {
        id: "electrical",
        title: "Electrical",
        items: [
          { id: "el1", text: "Power requirements verified", type: "checkbox", required: true },
          { id: "el2", text: "Grounding confirmed", type: "checkbox", required: true },
          { id: "el3", text: "Emergency power-off functional", type: "checkbox", required: true },
          { id: "el4", text: "Cables properly routed and secured", type: "checkbox", required: true },
        ],
      },
      {
        id: "commissioning",
        title: "Commissioning",
        items: [
          { id: "c1", text: "Output power verified", type: "checkbox", required: true },
          { id: "c2", text: "Beam alignment confirmed", type: "checkbox", required: true },
          { id: "c3", text: "Safety interlocks tested", type: "checkbox", required: true },
          { id: "c4", text: "Documentation complete", type: "checkbox", required: true },
          { id: "c5", text: "Hand-over to operator conducted", type: "checkbox", required: true },
        ],
      },
    ],
  },
  {
    id: "maintenance",
    name: "Maintenance Checklist",
    description: "Regular maintenance verification",
    category: "Maintenance",
    sections: [
      {
        id: "optical",
        title: "Optical System",
        items: [
          { id: "o1", text: "Mirrors clean and undamaged", type: "checkbox", required: true },
          { id: "o2", text: "Scanner alignment checked", type: "checkbox", required: true },
          { id: "o3", text: "Output power within spec", type: "checkbox", required: true },
          { id: "o4", text: "Beam quality acceptable", type: "checkbox", required: true },
        ],
      },
      {
        id: "safety-sys",
        title: "Safety Systems",
        items: [
          { id: "ss1", text: "Interlock function tested", type: "checkbox", required: true },
          { id: "ss2", text: "E-stop response verified", type: "checkbox", required: true },
          { id: "ss3", text: "Scan failure detection tested", type: "checkbox", required: true },
          { id: "ss4", text: "Warning indicators functional", type: "checkbox", required: true },
        ],
      },
      {
        id: "records",
        title: "Documentation",
        items: [
          { id: "r1", text: "Maintenance log updated", type: "checkbox", required: true },
          { id: "r2", text: "Issues documented", type: "checkbox", required: true },
          { id: "r3", text: "Next service date scheduled", type: "checkbox", required: true },
        ],
      },
    ],
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function ChecklistGenerator({
  templates = DEFAULT_CHECKLIST_TEMPLATES,
  onSave,
  onExport,
  className,
}: ChecklistGeneratorProps) {
  const [phase, setPhase] = useState<"select" | "customize" | "use">("select");
  const [selectedTemplate, setSelectedTemplate] = useState<ChecklistTemplate | null>(null);
  const [customSections, setCustomSections] = useState<ChecklistSection[]>([]);
  const [checklistName, setChecklistName] = useState("");
  const [completedItems, setCompletedItems] = useState<Set<string>>(new Set());

  const handleSelectTemplate = (template: ChecklistTemplate) => {
    setSelectedTemplate(template);
    setCustomSections(JSON.parse(JSON.stringify(template.sections)));
    setChecklistName(template.name);
    setPhase("customize");
  };

  const handleCreateEmpty = () => {
    setSelectedTemplate(null);
    setCustomSections([
      {
        id: "section-1",
        title: "Section 1",
        items: [],
      },
    ]);
    setChecklistName("New Checklist");
    setPhase("customize");
  };

  const handleAddSection = () => {
    const newSection: ChecklistSection = {
      id: `section-${customSections.length + 1}`,
      title: `Section ${customSections.length + 1}`,
      items: [],
    };
    setCustomSections([...customSections, newSection]);
  };

  const handleRemoveSection = (sectionId: string) => {
    setCustomSections(customSections.filter((s) => s.id !== sectionId));
  };

  const handleUpdateSectionTitle = (sectionId: string, title: string) => {
    setCustomSections(
      customSections.map((s) => (s.id === sectionId ? { ...s, title } : s))
    );
  };

  const handleAddItem = (sectionId: string) => {
    const newItem: ChecklistItem = {
      id: `${sectionId}-item-${Date.now()}`,
      text: "New item",
      type: "checkbox",
      required: false,
    };
    setCustomSections(
      customSections.map((s) =>
        s.id === sectionId ? { ...s, items: [...s.items, newItem] } : s
      )
    );
  };

  const handleRemoveItem = (sectionId: string, itemId: string) => {
    setCustomSections(
      customSections.map((s) =>
        s.id === sectionId
          ? { ...s, items: s.items.filter((i) => i.id !== itemId) }
          : s
      )
    );
  };

  const handleUpdateItem = (sectionId: string, itemId: string, updates: Partial<ChecklistItem>) => {
    setCustomSections(
      customSections.map((s) =>
        s.id === sectionId
          ? {
              ...s,
              items: s.items.map((i) => (i.id === itemId ? { ...i, ...updates } : i)),
            }
          : s
      )
    );
  };

  const handleGenerate = () => {
    setPhase("use");
    setCompletedItems(new Set());
  };

  const handleToggleItem = (itemId: string) => {
    setCompletedItems((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const handleSave = () => {
    const checklist: GeneratedChecklist = {
      id: `checklist-${Date.now()}`,
      templateId: selectedTemplate?.id || "custom",
      name: checklistName,
      createdAt: new Date(),
      sections: customSections,
      completedItems: Array.from(completedItems),
    };
    onSave?.(checklist);
  };

  const handleExport = () => {
    const checklist: GeneratedChecklist = {
      id: `checklist-${Date.now()}`,
      templateId: selectedTemplate?.id || "custom",
      name: checklistName,
      createdAt: new Date(),
      sections: customSections,
      completedItems: Array.from(completedItems),
    };
    onExport?.(checklist);
  };

  // Phase: Select Template
  if (phase === "select") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <ClipboardList className="w-6 h-6 text-primary" />
            Checklist Generator
          </h2>
          <p className="text-muted-foreground mt-2">
            Select a template or create your own custom checklist
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Create Empty Option */}
          <button
            onClick={handleCreateEmpty}
            className="p-6 rounded-xl border-2 border-dashed border-border/50 hover:border-primary/50 hover:bg-muted/30 transition-all text-center"
          >
            <Plus className="w-8 h-8 mx-auto mb-3 text-muted-foreground" />
            <h3 className="font-semibold">Create Empty</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Start from scratch
            </p>
          </button>

          {/* Template Options */}
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className="p-6 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-all text-left"
            >
              <Badge variant="outline" className="mb-2">
                {template.category}
              </Badge>
              <h3 className="font-semibold">{template.name}</h3>
              <p className="text-sm text-muted-foreground mt-1">
                {template.description}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {template.sections.length} sections
              </p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Phase: Customize
  if (phase === "customize") {
    return (
      <div className={cn("max-w-3xl mx-auto space-y-6", className)}>
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Customize Checklist</h2>
          <Button variant="outline" onClick={() => setPhase("select")}>
            ← Back
          </Button>
        </div>

        {/* Checklist Name */}
        <div>
          <label className="text-sm font-medium mb-2 block">Checklist Name</label>
          <input
            type="text"
            value={checklistName}
            onChange={(e) => setChecklistName(e.target.value)}
            className="w-full px-3 py-2 rounded-lg bg-muted border border-border"
          />
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {customSections.map((section) => (
            <Card key={section.id}>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <input
                    type="text"
                    value={section.title}
                    onChange={(e) => handleUpdateSectionTitle(section.id, e.target.value)}
                    className="flex-grow px-3 py-1.5 rounded bg-muted border border-border font-semibold"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSection(section.id)}
                  >
                    <Trash2 className="w-4 h-4 text-red-400" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                {section.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-2">
                    <input
                      type="text"
                      value={item.text}
                      onChange={(e) =>
                        handleUpdateItem(section.id, item.id, { text: e.target.value })
                      }
                      className="flex-grow px-3 py-2 rounded bg-muted border border-border text-sm"
                    />
                    <select
                      value={item.type}
                      onChange={(e) =>
                        handleUpdateItem(section.id, item.id, {
                          type: e.target.value as ChecklistItemType,
                        })
                      }
                      className="px-2 py-2 rounded bg-muted border border-border text-sm"
                    >
                      <option value="checkbox">Checkbox</option>
                      <option value="text">Text</option>
                      <option value="signature">Signature</option>
                    </select>
                    <label className="flex items-center gap-1 text-sm">
                      <input
                        type="checkbox"
                        checked={item.required}
                        onChange={(e) =>
                          handleUpdateItem(section.id, item.id, { required: e.target.checked })
                        }
                      />
                      Required
                    </label>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveItem(section.id, item.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                ))}

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleAddItem(section.id)}
                  className="w-full"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
          ))}

          <Button variant="outline" onClick={handleAddSection} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Add Section
          </Button>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={() => setPhase("select")}>
            Cancel
          </Button>
          <Button onClick={handleGenerate} disabled={!checklistName}>
            Generate Checklist
            <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  // Phase: Use Checklist
  const totalItems = customSections.reduce((acc, s) => acc + s.items.length, 0);
  const completedCount = completedItems.size;
  const progress = Math.round((completedCount / totalItems) * 100);

  return (
    <div className={cn("max-w-3xl mx-auto space-y-6", className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">{checklistName}</h2>
          <p className="text-sm text-muted-foreground">
            {completedCount} of {totalItems} items completed ({progress}%)
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setPhase("customize")}>
            Edit
          </Button>
          <Button variant="outline" size="sm" onClick={handleSave}>
            <Copy className="w-4 h-4 mr-2" />
            Save
          </Button>
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="h-2 bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-green-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Checklist */}
      <div className="space-y-6">
        {customSections.map((section) => (
          <Card key={section.id}>
            <CardHeader>
              <CardTitle className="text-lg">{section.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {section.items.map((item) => {
                const isCompleted = completedItems.has(item.id);
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "flex items-start gap-3 p-3 rounded-lg border transition-all cursor-pointer",
                      isCompleted
                        ? "bg-green-500/5 border-green-500/30"
                        : "bg-card border-border/50 hover:border-primary/50"
                    )}
                    onClick={() => handleToggleItem(item.id)}
                  >
                    <div className="mt-0.5">
                      {isCompleted ? (
                        <CheckSquare className="w-5 h-5 text-green-400" />
                      ) : (
                        <Square className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <span className={cn(isCompleted && "line-through opacity-70")}>
                        {item.text}
                      </span>
                      {item.required && (
                        <Badge variant="secondary" className="ml-2 text-xs">
                          Required
                        </Badge>
                      )}
                    </div>
                  </div>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Completion Message */}
      {progress === 100 && (
        <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl text-center">
          <CheckSquare className="w-12 h-12 text-green-400 mx-auto mb-3" />
          <h3 className="text-xl font-bold text-green-400">Checklist Complete!</h3>
          <p className="text-muted-foreground mt-1">
            All items have been verified and completed.
          </p>
        </div>
      )}
    </div>
  );
}

export default ChecklistGenerator;
