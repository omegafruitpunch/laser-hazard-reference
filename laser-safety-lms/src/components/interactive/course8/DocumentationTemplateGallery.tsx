"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  FileText, 
  ClipboardList, 
  Calculator, 
  Shield,
  Download,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Save,
  Printer
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type FieldType = "text" | "textarea" | "select" | "checkbox" | "date" | "number";

export interface TemplateField {
  id: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[];
  unit?: string;
  helpText?: string;
}

export interface TemplateSection {
  title: string;
  fields: TemplateField[];
}

export interface DocumentTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: "assessment" | "procedures" | "records" | "handover";
  sections: TemplateSection[];
}

export interface DocumentationTemplateGalleryProps {
  templates?: DocumentTemplate[];
  onSave?: (templateId: string, data: Record<string, unknown>) => void;
  onExport?: (templateId: string, data: Record<string, unknown>) => void;
  className?: string;
}

// ============================================================================
// Default Templates
// ============================================================================

export const DEFAULT_TEMPLATES: DocumentTemplate[] = [
  {
    id: "risk-assessment",
    name: "Risk Assessment",
    description: "Comprehensive hazard identification and risk evaluation",
    icon: <Shield className="w-6 h-6" />,
    category: "assessment",
    sections: [
      {
        title: "1. Installation Details",
        fields: [
          { id: "location", label: "Installation Location", type: "text", required: true },
          { id: "date", label: "Assessment Date", type: "date", required: true },
          { id: "lso", label: "LSO Name", type: "text", required: true },
          { id: "assessor", label: "Assessor Name", type: "text", required: true },
        ],
      },
      {
        title: "2. Equipment Information",
        fields: [
          { id: "manufacturer", label: "Laser Manufacturer", type: "text", required: true },
          { id: "model", label: "Model", type: "text", required: true },
          { id: "serial", label: "Serial Number", type: "text", required: true },
          { id: "wavelength", label: "Wavelength(s)", type: "text", required: true, placeholder: "e.g., 532 nm", unit: "nm" },
          { id: "power", label: "Power Output", type: "number", required: true, placeholder: "e.g., 5", unit: "W" },
          { 
            id: "laserClass", 
            label: "Laser Class", 
            type: "select", 
            required: true,
            options: ["Class 1", "Class 2", "Class 3R", "Class 3B", "Class 4"] 
          },
        ],
      },
      {
        title: "3. Hazard Identification",
        fields: [
          { 
            id: "beamHazards", 
            label: "Beam Hazards", 
            type: "checkbox",
            options: ["Direct exposure", "Specular reflection", "Diffuse reflection", "Eye injury risk", "Skin burn risk"] 
          },
          { 
            id: "nonBeamHazards", 
            label: "Non-Beam Hazards", 
            type: "checkbox",
            options: ["Electrical", "Chemical", "Fire", "Ergonomic", "Noise"] 
          },
          { id: "exposureScenarios", label: "Exposure Scenarios", type: "textarea", placeholder: "Describe potential exposure situations during normal operation, maintenance, and emergencies" },
        ],
      },
      {
        title: "4. Risk Evaluation",
        fields: [
          { 
            id: "probability", 
            label: "Probability of Exposure", 
            type: "select", 
            options: ["Negligible", "Low", "Medium", "High"],
            helpText: "Likelihood of exposure occurring"
          },
          { 
            id: "severity", 
            label: "Severity of Harm", 
            type: "select", 
            options: ["Negligible", "Minor", "Serious", "Severe"],
            helpText: "Consequence if exposure occurs"
          },
          { 
            id: "riskLevel", 
            label: "Overall Risk Level", 
            type: "select", 
            options: ["Low", "Medium", "High", "Unacceptable"],
            helpText: "Based on probability × severity matrix"
          },
        ],
      },
      {
        title: "5. Control Measures",
        fields: [
          { id: "engControls", label: "Engineering Controls", type: "textarea", placeholder: "List physical controls (interlocks, enclosures, beam stops, etc.)" },
          { id: "adminControls", label: "Administrative Controls", type: "textarea", placeholder: "List procedures, training, signage, access restrictions" },
          { id: "ppe", label: "PPE Requirements", type: "textarea", placeholder: "List required personal protective equipment with specifications" },
        ],
      },
    ],
  },
  {
    id: "handover-doc",
    name: "Hand-Over Documentation",
    description: "Required documentation for transferring responsibility",
    icon: <ClipboardList className="w-6 h-6" />,
    category: "handover",
    sections: [
      {
        title: "Equipment Details",
        fields: [
          { id: "manufacturer", label: "Manufacturer", type: "text", required: true },
          { id: "model", label: "Model", type: "text", required: true },
          { id: "serial", label: "Serial Number", type: "text", required: true },
          { id: "power", label: "Power Output", type: "text", required: true },
          { id: "classification", label: "Classification", type: "text", required: true },
        ],
      },
      {
        title: "Safety Systems",
        fields: [
          { id: "interlocks", label: "Interlocks Present", type: "checkbox" },
          { id: "estops", label: "Emergency Stops", type: "textarea", placeholder: "Location and function of each E-stop" },
          { id: "scanFail", label: "Scan Failure Detection", type: "checkbox" },
          { id: "blanking", label: "Blanking/Masking", type: "textarea", placeholder: "Description of blanking zones and methods" },
        ],
      },
      {
        title: "Operating Procedures",
        fields: [
          { id: "startup", label: "Startup Procedure", type: "textarea" },
          { id: "normal", label: "Normal Operation", type: "textarea" },
          { id: "emergency", label: "Emergency Shutdown", type: "textarea" },
          { id: "maintenance", label: "Maintenance Requirements", type: "textarea" },
        ],
      },
      {
        title: "Sign-offs",
        fields: [
          { id: "installer", label: "Installer Signature", type: "text" },
          { id: "installerDate", label: "Date", type: "date" },
          { id: "lso", label: "LSO Signature", type: "text" },
          { id: "lsoDate", label: "Date", type: "date" },
          { id: "operator", label: "Operator Signature", type: "text" },
          { id: "operatorDate", label: "Date", type: "date" },
        ],
      },
    ],
  },
  {
    id: "mpe-record",
    name: "MPE Calculation Record",
    description: "Document MPE calculations for compliance verification",
    icon: <Calculator className="w-6 h-6" />,
    category: "records",
    sections: [
      {
        title: "Laser Parameters",
        fields: [
          { id: "wavelength", label: "Wavelength", type: "number", unit: "nm" },
          { id: "power", label: "Power", type: "number", unit: "mW or W" },
          { id: "divergence", label: "Beam Divergence", type: "number", unit: "mrad" },
          { id: "beamDiameter", label: "Beam Diameter at Aperture", type: "number", unit: "mm" },
        ],
      },
      {
        title: "Exposure Parameters",
        fields: [
          { 
            id: "duration", 
            label: "Exposure Duration", 
            type: "select", 
            options: ["0.25s (blink)", "1s", "10s", ">100s"] 
          },
          { 
            id: "viewing", 
            label: "Viewing Condition", 
            type: "select", 
            options: ["Direct", "Specular reflection", "Diffuse reflection"] 
          },
          { 
            id: "population", 
            label: "Affected Population", 
            type: "select", 
            options: ["General public", "Trained operators", "Performers"] 
          },
        ],
      },
      {
        title: "MPE Calculation",
        fields: [
          { id: "formula", label: "Formula Used", type: "text" },
          { id: "mpeResult", label: "Calculated MPE", type: "number", unit: "mW/cm²" },
          { id: "measurement", label: "Measured Irradiance", type: "number", unit: "mW/cm²" },
          { id: "margin", label: "Safety Margin", type: "number", placeholder: "e.g., 2.0 for 2x safety factor" },
          { id: "compliant", label: "MPE Compliant", type: "select", options: ["Yes", "No", "With restrictions"] },
        ],
      },
      {
        title: "Verification",
        fields: [
          { 
            id: "method", 
            label: "Measurement Method", 
            type: "select", 
            options: ["Calculation", "Direct measurement", "Both"] 
          },
          { id: "equipment", label: "Equipment Used", type: "text" },
          { id: "calibration", label: "Calibration Date", type: "date" },
          { id: "technician", label: "Technician", type: "text" },
          { id: "date", label: "Date", type: "date" },
        ],
      },
    ],
  },
  {
    id: "sop-template",
    name: "SOP Template",
    description: "Standard Operating Procedure for laser operations",
    icon: <FileText className="w-6 h-6" />,
    category: "procedures",
    sections: [
      {
        title: "1. Purpose and Scope",
        fields: [
          { id: "purpose", label: "Purpose", type: "textarea", placeholder: "Describe the purpose of this procedure" },
          { id: "scope", label: "Scope", type: "textarea", placeholder: "Define what operations this SOP covers" },
          { id: "responsibility", label: "Personnel Responsibilities", type: "textarea" },
        ],
      },
      {
        title: "2. Equipment and Materials",
        fields: [
          { id: "equipment", label: "Equipment Required", type: "textarea" },
          { id: "ppe", label: "Required PPE", type: "textarea" },
          { id: "materials", label: "Materials/Supplies", type: "textarea" },
        ],
      },
      {
        title: "3. Safety Precautions",
        fields: [
          { id: "hazards", label: "Identified Hazards", type: "textarea" },
          { id: "precautions", label: "Safety Precautions", type: "textarea" },
          { id: "emergency", label: "Emergency Procedures", type: "textarea" },
        ],
      },
      {
        title: "4. Procedure Steps",
        fields: [
          { id: "preparation", label: "Pre-Operation Checks", type: "textarea" },
          { id: "startup", label: "Startup Procedure", type: "textarea" },
          { id: "operation", label: "Normal Operation", type: "textarea" },
          { id: "shutdown", label: "Shutdown Procedure", type: "textarea" },
          { id: "postOp", label: "Post-Operation", type: "textarea" },
        ],
      },
      {
        title: "5. Approval",
        fields: [
          { id: "author", label: "Author", type: "text" },
          { id: "date", label: "Date", type: "date" },
          { id: "reviewer", label: "Reviewer", type: "text" },
          { id: "approvalDate", label: "Approval Date", type: "date" },
          { id: "reviewDate", label: "Next Review Date", type: "date" },
        ],
      },
    ],
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function DocumentationTemplateGallery({
  templates = DEFAULT_TEMPLATES,
  onSave,
  onExport,
  className,
}: DocumentationTemplateGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [currentSection, setCurrentSection] = useState(0);
  const [completedSections, setCompletedSections] = useState<Set<number>>(new Set());
  const [showGallery, setShowGallery] = useState(true);

  const handleSelectTemplate = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setCurrentSection(0);
    setCompletedSections(new Set());
    setShowGallery(false);
  };

  const handleFieldChange = (fieldId: string, value: unknown) => {
    setFormData((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleSectionComplete = () => {
    setCompletedSections((prev) => new Set(prev).add(currentSection));
    if (selectedTemplate && currentSection < selectedTemplate.sections.length - 1) {
      setCurrentSection((prev) => prev + 1);
    }
  };

  const handleSave = () => {
    if (selectedTemplate) {
      onSave?.(selectedTemplate.id, formData);
    }
  };

  const handleExport = () => {
    if (selectedTemplate) {
      onExport?.(selectedTemplate.id, formData);
    }
  };

  const handleBack = () => {
    setShowGallery(true);
    setSelectedTemplate(null);
  };

  if (showGallery) {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            Documentation Template Gallery
          </h2>
          <p className="text-muted-foreground mt-2">
            Select a template to create safety documentation
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {templates.map((template) => (
            <button
              key={template.id}
              onClick={() => handleSelectTemplate(template)}
              className="text-left p-6 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-all hover:scale-[1.02] group"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {template.icon}
                </div>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-lg">{template.name}</h3>
                    <Badge variant="outline" className="text-xs">
                      {template.category}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    {template.description}
                  </p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {template.sections.length} sections • {template.sections.reduce((acc, s) => acc + s.fields.length, 0)} fields
                  </p>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  if (!selectedTemplate) return null;

  const currentSectionData = selectedTemplate.sections[currentSection];
  const progress = ((completedSections.size) / selectedTemplate.sections.length) * 100;

  return (
    <div className={cn("max-w-3xl mx-auto", className)}>
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="outline" size="sm" onClick={handleBack}>
          ← Back to Gallery
        </Button>
        <div className="flex-grow">
          <div className="flex items-center gap-2">
            {selectedTemplate.icon}
            <h2 className="text-xl font-bold">{selectedTemplate.name}</h2>
          </div>
        </div>
        <div className="text-sm text-muted-foreground">
          Section {currentSection + 1} of {selectedTemplate.sections.length}
        </div>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <div className="h-2 bg-muted rounded-full overflow-hidden">
          <div
            className="h-full bg-primary transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 mb-6">
        {selectedTemplate.sections.map((section, index) => (
          <button
            key={index}
            onClick={() => setCurrentSection(index)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
              currentSection === index
                ? "bg-primary text-primary-foreground"
                : completedSections.has(index)
                ? "bg-green-500/20 text-green-400"
                : "bg-muted"
            )}
          >
            {completedSections.has(index) && <CheckCircle2 className="w-3 h-3 inline mr-1" />}
            {index + 1}
          </button>
        ))}
      </div>

      {/* Form Section */}
      <Card>
        <CardHeader>
          <CardTitle>{currentSectionData.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentSectionData.fields.map((field) => (
            <FormField
              key={field.id}
              field={field}
              value={formData[field.id]}
              onChange={(value) => handleFieldChange(field.id, value)}
            />
          ))}
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentSection((prev) => Math.max(0, prev - 1))}
            disabled={currentSection === 0}
          >
            <ChevronLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            {currentSection < selectedTemplate.sections.length - 1 ? (
              <Button onClick={handleSectionComplete}>
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleExport}>
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

// ============================================================================
// Form Field Component
// ============================================================================

interface FormFieldProps {
  field: TemplateField;
  value: unknown;
  onChange: (value: unknown) => void;
}

function FormField({ field, value, onChange }: FormFieldProps) {
  const baseInputClass = "w-full px-3 py-2 rounded-lg bg-muted border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary/50";

  return (
    <div className="space-y-2">
      <label className="flex items-center gap-2 text-sm font-medium">
        {field.label}
        {field.required && <span className="text-red-400">*</span>}
      </label>
      
      {field.type === "textarea" ? (
        <textarea
          className={cn(baseInputClass, "min-h-[100px] resize-y")}
          placeholder={field.placeholder}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "select" ? (
        <select
          className={baseInputClass}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
        >
          <option value="">Select...</option>
          {field.options?.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      ) : field.type === "checkbox" ? (
        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={(value as boolean) || false}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 rounded border-border"
          />
          <span className="text-sm text-muted-foreground">Yes</span>
        </div>
      ) : field.type === "date" ? (
        <input
          type="date"
          className={baseInputClass}
          value={(value as string) || ""}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : field.type === "number" ? (
        <div className="relative">
          <input
            type="number"
            className={baseInputClass}
            placeholder={field.placeholder}
            value={(value as number) || ""}
            onChange={(e) => onChange(e.target.valueAsNumber)}
          />
          {field.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {field.unit}
            </span>
          )}
        </div>
      ) : (
        <div className="relative">
          <input
            type="text"
            className={baseInputClass}
            placeholder={field.placeholder}
            value={(value as string) || ""}
            onChange={(e) => onChange(e.target.value)}
          />
          {field.unit && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
              {field.unit}
            </span>
          )}
        </div>
      )}
      
      {field.helpText && (
        <p className="text-xs text-muted-foreground">{field.helpText}</p>
      )}
    </div>
  );
}

export default DocumentationTemplateGallery;
