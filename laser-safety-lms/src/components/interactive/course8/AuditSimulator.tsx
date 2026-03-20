"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  FileSearch,
  Building,
  Users,
  ClipboardCheck,
  ArrowRight,
  RotateCcw,
  Download
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type AuditItemStatus = "compliant" | "noncompliant" | "na" | "pending";
export type AuditCategory = "documentation" | "procedures" | "equipment" | "personnel" | "records";

export interface AuditItem {
  id: string;
  question: string;
  category: AuditCategory;
  reference: string;
  guidance: string;
  status: AuditItemStatus;
  findings?: string;
  severity?: "minor" | "major" | "critical";
}

export interface AuditScenario {
  id: string;
  name: string;
  description: string;
  facilityType: string;
  items: AuditItem[];
}

export interface AuditReport {
  scenarioId: string;
  completedAt: Date;
  totalItems: number;
  compliantItems: number;
  nonCompliantItems: number;
  findings: { item: AuditItem; severity: string }[];
  complianceRate: number;
  passed: boolean;
}

export interface AuditSimulatorProps {
  scenarios?: AuditScenario[];
  onComplete?: (report: AuditReport) => void;
  onExport?: (report: AuditReport) => void;
  className?: string;
}

// ============================================================================
// Default Scenarios
// ============================================================================

export const DEFAULT_AUDIT_SCENARIOS: AuditScenario[] = [
  {
    id: "entertainment-venue",
    name: "Entertainment Venue Audit",
    description: "Comprehensive audit of a laser entertainment installation",
    facilityType: "Music Venue / Nightclub",
    items: [
      {
        id: "a1",
        question: "Is a Laser Safety Officer (LSO) designated with written authority?",
        category: "personnel",
        reference: "ANSI E1.46 Section 4.2",
        guidance: "The LSO must have executive responsibility, not just advisory role.",
        status: "pending",
        severity: "critical",
      },
      {
        id: "a2",
        question: "Are MPE calculations documented for all audience exposure scenarios?",
        category: "documentation",
        reference: "ANSI E1.46 Section 6.3",
        guidance: "Documentation must show all occupied areas are within MPE limits.",
        status: "pending",
        severity: "critical",
      },
      {
        id: "a3",
        question: "Is scan failure detection installed and tested?",
        category: "equipment",
        reference: "ANSI E1.46 Section 7.4",
        guidance: "Response time must be in the few milliseconds range.",
        status: "pending",
        severity: "critical",
      },
      {
        id: "a4",
        question: "Are minimum separation distances maintained?",
        category: "equipment",
        reference: "ANSI E1.46 Section 6.2",
        guidance: "3m vertical or 2.5m horizontal for supervised installations.",
        status: "pending",
        severity: "major",
      },
      {
        id: "a5",
        question: "Is emergency stop equipment installed and accessible?",
        category: "equipment",
        reference: "ANSI E1.46 Section 7.3",
        guidance: "E-stop must be within easy reach of operator and tested regularly.",
        status: "pending",
        severity: "critical",
      },
      {
        id: "a6",
        question: "Are standard operating procedures documented?",
        category: "procedures",
        reference: "ANSI E1.46 Section 5.4",
        guidance: "SOPs must cover normal operation, emergencies, and maintenance.",
        status: "pending",
        severity: "major",
      },
      {
        id: "a7",
        question: "Are operators trained and competency verified?",
        category: "personnel",
        reference: "ANSI E1.46 Section 4.3",
        guidance: "Training records must be current and accessible.",
        status: "pending",
        severity: "major",
      },
      {
        id: "a8",
        question: "Are warning signs posted at appropriate locations?",
        category: "equipment",
        reference: "ANSI Z136.1 Section 5.3.3",
        guidance: "Class 3B and 4 laser warning signs required at entry points.",
        status: "pending",
        severity: "minor",
      },
      {
        id: "a9",
        question: "Is hand-over documentation complete?",
        category: "documentation",
        reference: "ANSI E1.46 Section 8.2",
        guidance: "Installation, operation, and safety documentation must be provided.",
        status: "pending",
        severity: "major",
      },
      {
        id: "a10",
        question: "Are maintenance records current?",
        category: "records",
        reference: "ANSI Z136.1 Section 5.4",
        guidance: "Maintenance logs should document all service and inspections.",
        status: "pending",
        severity: "minor",
      },
    ],
  },
  {
    id: "research-lab",
    name: "Research Laboratory Audit",
    description: "Audit of university or research facility laser lab",
    facilityType: "University Research Lab",
    items: [
      {
        id: "r1",
        question: "Is the laser lab properly interlocked?",
        category: "equipment",
        reference: "ANSI Z136.8 Section 5.2",
        guidance: "Entry doors should be interlocked for Class 4 lasers.",
        status: "pending",
        severity: "critical",
      },
      {
        id: "r2",
        question: "Are SOPs posted and accessible to all users?",
        category: "procedures",
        reference: "ANSI Z136.8 Section 6.1",
        guidance: "SOPs must be available at point of use.",
        status: "pending",
        severity: "major",
      },
      {
        id: "r3",
        question: "Is required PPE available and properly maintained?",
        category: "equipment",
        reference: "ANSI Z136.1 Section 5.3",
        guidance: "Eyewear must be appropriate for wavelengths in use.",
        status: "pending",
        severity: "critical",
      },
      {
        id: "r4",
        question: "Are training records maintained for all laser users?",
        category: "records",
        reference: "ANSI Z136.1 Section 5.4",
        guidance: "Training must be documented and refreshed periodically.",
        status: "pending",
        severity: "major",
      },
      {
        id: "r5",
        question: "Is the LSO notified of all Class 3B and 4 acquisitions?",
        category: "procedures",
        reference: "ANSI Z136.1 Section 3.2",
        guidance: "LSO must be involved in acquisition decisions.",
        status: "pending",
        severity: "major",
      },
    ],
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function AuditSimulator({
  scenarios = DEFAULT_AUDIT_SCENARIOS,
  onComplete,
  onExport,
  className,
}: AuditSimulatorProps) {
  const [phase, setPhase] = useState<"select" | "audit" | "report">("select");
  const [selectedScenario, setSelectedScenario] = useState<AuditScenario | null>(null);
  const [auditItems, setAuditItems] = useState<AuditItem[]>([]);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [findings, setFindings] = useState<Record<string, string>>({});

  const handleSelectScenario = (scenario: AuditScenario) => {
    setSelectedScenario(scenario);
    setAuditItems(scenario.items.map((item) => ({ ...item, status: "pending" })));
    setCurrentItemIndex(0);
    setFindings({});
    setPhase("audit");
  };

  const handleUpdateStatus = (itemId: string, status: AuditItemStatus) => {
    setAuditItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );
  };

  const handleUpdateFindings = (itemId: string, finding: string) => {
    setFindings((prev) => ({ ...prev, [itemId]: finding }));
  };

  const handleNext = () => {
    if (currentItemIndex < auditItems.length - 1) {
      setCurrentItemIndex((prev) => prev + 1);
    } else {
      generateReport();
    }
  };

  const handlePrevious = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex((prev) => prev - 1);
    }
  };

  const generateReport = () => {
    setPhase("report");
    
    const compliantItems = auditItems.filter((i) => i.status === "compliant").length;
    const nonCompliantItems = auditItems.filter((i) => i.status === "noncompliant").length;
    const complianceRate = Math.round((compliantItems / auditItems.length) * 100);
    
    const report: AuditReport = {
      scenarioId: selectedScenario!.id,
      completedAt: new Date(),
      totalItems: auditItems.length,
      compliantItems,
      nonCompliantItems,
      findings: auditItems
        .filter((i) => i.status === "noncompliant")
        .map((i) => ({ item: i, severity: i.severity || "minor" })),
      complianceRate,
      passed: complianceRate >= 80 && !auditItems.some((i) => i.status === "noncompliant" && i.severity === "critical"),
    };
    
    onComplete?.(report);
  };

  const handleReset = () => {
    setPhase("select");
    setSelectedScenario(null);
    setAuditItems([]);
    setCurrentItemIndex(0);
    setFindings({});
  };

  // Phase: Select Scenario
  if (phase === "select") {
    return (
      <div className={cn("space-y-6", className)}>
        <div className="text-center">
          <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
            <FileSearch className="w-6 h-6 text-primary" />
            Virtual Compliance Audit
          </h2>
          <p className="text-muted-foreground mt-2">
            Practice conducting laser safety compliance audits
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => handleSelectScenario(scenario)}
              className="p-6 rounded-xl border border-border/50 bg-card hover:bg-muted/50 transition-all text-left"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary">
                  <Building className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{scenario.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {scenario.description}
                  </p>
                  <Badge variant="outline" className="mt-3">
                    {scenario.facilityType}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    {scenario.items.length} audit items
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Phase: Conduct Audit
  if (phase === "audit" && selectedScenario) {
    const currentItem = auditItems[currentItemIndex];
    const progress = ((currentItemIndex + 1) / auditItems.length) * 100;

    return (
      <div className={cn("max-w-3xl mx-auto", className)}>
        {/* Progress */}
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Audit Progress</span>
            <span>{currentItemIndex + 1} of {auditItems.length}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline">{currentItem.category}</Badge>
              {currentItem.severity && (
                <Badge
                  className={cn(
                    currentItem.severity === "critical" && "bg-red-500",
                    currentItem.severity === "major" && "bg-amber-500",
                    currentItem.severity === "minor" && "bg-blue-500"
                  )}
                >
                  {currentItem.severity}
                </Badge>
              )}
            </div>
            <CardTitle className="text-xl mt-4">{currentItem.question}</CardTitle>
            <p className="text-sm text-muted-foreground">{currentItem.reference}</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Guidance */}
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-2 text-sm font-medium mb-1">
                <ClipboardCheck className="w-4 h-4" />
                Audit Guidance
              </div>
              <p className="text-sm text-muted-foreground">{currentItem.guidance}</p>
            </div>

            {/* Status Selection */}
            <div>
              <label className="text-sm font-medium mb-3 block">Finding:</label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { value: "compliant", label: "Compliant", icon: CheckCircle2, color: "text-green-400" },
                  { value: "noncompliant", label: "Non-Compliant", icon: XCircle, color: "text-red-400" },
                  { value: "na", label: "N/A", icon: AlertTriangle, color: "text-muted-foreground" },
                ] as const).map((option) => (
                  <button
                    key={option.value}
                    onClick={() => handleUpdateStatus(currentItem.id, option.value)}
                    className={cn(
                      "flex flex-col items-center gap-2 p-4 rounded-lg border transition-all",
                      currentItem.status === option.value
                        ? "bg-primary/10 border-primary"
                        : "bg-card border-border/50 hover:border-primary/50"
                    )}
                  >
                    <option.icon className={cn("w-6 h-6", option.color)} />
                    <span className="font-medium">{option.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Findings Notes */}
            {currentItem.status === "noncompliant" && (
              <div>
                <label className="text-sm font-medium mb-2 block">Findings Details:</label>
                <textarea
                  value={findings[currentItem.id] || ""}
                  onChange={(e) => handleUpdateFindings(currentItem.id, e.target.value)}
                  placeholder="Describe the non-compliance and required corrective action..."
                  className="w-full px-3 py-2 rounded-lg bg-muted border border-border min-h-[100px]"
                />
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentItemIndex === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext}>
              {currentItemIndex === auditItems.length - 1 ? "Generate Report" : "Next"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Phase: Report
  if (phase === "report" && selectedScenario) {
    const compliantCount = auditItems.filter((i) => i.status === "compliant").length;
    const nonCompliantCount = auditItems.filter((i) => i.status === "noncompliant").length;
    const naCount = auditItems.filter((i) => i.status === "na").length;
    const complianceRate = Math.round((compliantCount / auditItems.length) * 100);
    const passed = complianceRate >= 80;

    return (
      <div className={cn("max-w-3xl mx-auto space-y-6", className)}>
        {/* Summary Card */}
        <Card>
          <CardHeader className="text-center">
            <div
              className={cn(
                "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
                passed ? "bg-green-500/20" : "bg-red-500/20"
              )}
            >
              {passed ? (
                <CheckCircle2 className="w-10 h-10 text-green-400" />
              ) : (
                <XCircle className="w-10 h-10 text-red-400" />
              )}
            </div>
            <CardTitle className="text-2xl">
              {passed ? "Audit Passed" : "Issues Found"}
            </CardTitle>
            <p className="text-muted-foreground">
              {selectedScenario.name} - {selectedScenario.facilityType}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Stats */}
            <div className="grid grid-cols-4 gap-4">
              <StatBox label="Compliant" value={compliantCount} color="green" />
              <StatBox label="Non-Compliant" value={nonCompliantCount} color="red" />
              <StatBox label="N/A" value={naCount} color="gray" />
              <StatBox label="Rate" value={`${complianceRate}%`} color={passed ? "green" : "red"} />
            </div>

            {/* Findings List */}
            {nonCompliantCount > 0 && (
              <div>
                <h3 className="font-semibold mb-3">Non-Compliance Findings</h3>
                <div className="space-y-3">
                  {auditItems
                    .filter((i) => i.status === "noncompliant")
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                      >
                        <div className="flex items-start gap-3">
                          <XCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="font-medium">{item.question}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              Reference: {item.reference}
                            </p>
                            {findings[item.id] && (
                              <p className="text-sm mt-2 text-red-300">
                                Finding: {findings[item.id]}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              New Audit
            </Button>
            <Button variant="outline" onClick={() => onExport?.({
              scenarioId: selectedScenario.id,
              completedAt: new Date(),
              totalItems: auditItems.length,
              compliantItems: compliantCount,
              nonCompliantItems: nonCompliantCount,
              findings: [],
              complianceRate,
              passed,
            })}>
              <Download className="w-4 h-4 mr-2" />
              Export Report
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return null;
}

// ============================================================================
// Helper Components
// ============================================================================

function StatBox({ label, value, color }: { label: string; value: React.ReactNode; color: "green" | "red" | "gray" }) {
  const colors = {
    green: "bg-green-500/10 text-green-400",
    red: "bg-red-500/10 text-red-400",
    gray: "bg-muted text-muted-foreground",
  };

  return (
    <div className={cn("p-4 rounded-lg text-center", colors[color])}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-xs">{label}</div>
    </div>
  );
}

export default AuditSimulator;
