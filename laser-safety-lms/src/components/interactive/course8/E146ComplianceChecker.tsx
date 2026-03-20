"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { 
  CheckCircle2, 
  Circle, 
  AlertTriangle, 
  AlertCircle,
  Download,
  RotateCcw,
  ChevronRight,
  ChevronLeft,
  Shield,
  FileCheck,
  Users,
  Zap
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ComplianceStatus = "pending" | "completed" | "na" | "critical";

export interface ComplianceItem {
  id: string;
  item: string;
  description: string;
  required: boolean;
  status: ComplianceStatus;
  critical?: boolean;
  category: string;
  guidance?: string;
  reference?: string;
}

export interface ComplianceCategory {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  items: ComplianceItem[];
}

export interface ComplianceReport {
  completedItems: number;
  pendingItems: number;
  criticalWarnings: number;
  compliancePercentage: number;
  passed: boolean;
  timestamp: Date;
  categoryBreakdown: Record<string, { completed: number; total: number }>;
}

export interface E146ComplianceCheckerProps {
  categories?: ComplianceCategory[];
  onComplete?: (report: ComplianceReport) => void;
  onExport?: (report: ComplianceReport) => void;
  className?: string;
}

// ============================================================================
// Default Data - ANSI E1.46 Compliance Categories
// ============================================================================

export const DEFAULT_COMPLIANCE_CATEGORIES: ComplianceCategory[] = [
  {
    id: "planning",
    name: "Show Planning and Design",
    description: "Pre-show documentation and risk assessment",
    icon: <FileCheck className="w-5 h-5" />,
    items: [
      {
        id: "p1",
        item: "Creative brief documented",
        description: "Client's vision and requirements documented in writing",
        required: true,
        status: "pending",
        category: "planning",
        guidance: "Document the creative intent, venue specifications, and audience configuration.",
      },
      {
        id: "p2",
        item: "Risk assessment completed",
        description: "Hazard identification and risk evaluation documented",
        required: true,
        status: "pending",
        critical: true,
        category: "planning",
        guidance: "Identify all beam hazards, non-beam hazards, and exposure scenarios.",
        reference: "E1.46 Section 5.2",
      },
      {
        id: "p3",
        item: "MPE calculations for audience areas",
        description: "Exposure levels calculated for all occupied areas",
        required: true,
        status: "pending",
        critical: true,
        category: "planning",
        guidance: "Calculate or measure MPE compliance for all points where audience may be present.",
        reference: "E1.46 Section 6.3",
      },
      {
        id: "p4",
        item: "Scan failure safety system specified",
        description: "System designed to terminate emission upon scanner fault",
        required: true,
        status: "pending",
        critical: true,
        category: "planning",
        guidance: "Specify scan failure detection with response time in few milliseconds.",
        reference: "E1.46 Section 7.4",
      },
    ],
  },
  {
    id: "installation",
    name: "Installation Requirements",
    description: "Physical installation and positioning requirements",
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        id: "i1",
        item: "Minimum separation distances verified",
        description: "3m vertical, 2.5m horizontal (supervised) or enhanced barriers (unsupervised)",
        required: true,
        status: "pending",
        critical: true,
        category: "installation",
        guidance: "Verify beam paths maintain minimum separation from accessible areas.",
        reference: "E1.46 Section 6.2",
      },
      {
        id: "i2",
        item: "Laser projector securely mounted",
        description: "Equipment secured against inadvertent displacement",
        required: true,
        status: "pending",
        category: "installation",
        guidance: "Use appropriate mounting hardware rated for the equipment weight.",
      },
      {
        id: "i3",
        item: "All external optics secured",
        description: "Mirrors, galvos, and effects heads properly secured",
        required: true,
        status: "pending",
        category: "installation",
        guidance: "All optical components outside the laser enclosure must be secured.",
      },
      {
        id: "i4",
        item: "Blanking/masking in place",
        description: "Physical or software blanking preventing unauthorized beam access",
        required: true,
        status: "pending",
        category: "installation",
        guidance: "Implement zones or masks to prevent beams from entering non-show areas.",
      },
    ],
  },
  {
    id: "safety_systems",
    name: "Safety Systems",
    description: "Active safety systems and emergency controls",
    icon: <Zap className="w-5 h-5" />,
    items: [
      {
        id: "s1",
        item: "Emergency stop installed and tested",
        description: "E-stop accessible and functional, prevents auto-restart",
        required: true,
        status: "pending",
        critical: true,
        category: "safety_systems",
        guidance: "E-stop must be within easy reach of operator and tested before each show.",
        reference: "E1.46 Section 7.3",
      },
      {
        id: "s2",
        item: "Scan failure detection tested",
        description: "Response time verified (few milliseconds)",
        required: true,
        status: "pending",
        critical: true,
        category: "safety_systems",
        guidance: "Test scan failure system with manufacturer-specified procedures.",
        reference: "E1.46 Section 7.4",
      },
      {
        id: "s3",
        item: "Key/password control implemented",
        description: "Prevention of unauthorized operation",
        required: true,
        status: "pending",
        category: "safety_systems",
        guidance: "Laser operation should require physical key or secure password.",
      },
      {
        id: "s4",
        item: "Warning signs posted",
        description: "Appropriate laser warning signs at access points",
        required: true,
        status: "pending",
        category: "safety_systems",
        guidance: "Post Class 3B/4 warning signs at all accessible points to beam paths.",
      },
    ],
  },
  {
    id: "personnel",
    name: "Personnel and Documentation",
    description: "Personnel requirements and hand-over documentation",
    icon: <Users className="w-5 h-5" />,
    items: [
      {
        id: "per1",
        item: "LSO designated",
        description: "Laser Safety Officer with executive responsibility assigned",
        required: true,
        status: "pending",
        critical: true,
        category: "personnel",
        guidance: "LSO must have authority to modify or terminate operations for safety.",
        reference: "E1.46 Section 4.2",
      },
      {
        id: "per2",
        item: "Operator competency verified",
        description: "Operator demonstrated knowledge of safety procedures",
        required: true,
        status: "pending",
        category: "personnel",
        guidance: "Verify operator training records and practical competency.",
      },
      {
        id: "per3",
        item: "Hand-over documentation complete",
        description: "Installation, operation, and safety documentation provided",
        required: true,
        status: "pending",
        category: "personnel",
        guidance: "Complete hand-over documentation including SOPs and emergency procedures.",
      },
      {
        id: "per4",
        item: "Emergency procedures reviewed",
        description: "All personnel briefed on emergency shutdown procedures",
        required: true,
        status: "pending",
        category: "personnel",
        guidance: "Conduct briefing on emergency procedures before first show.",
      },
    ],
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function E146ComplianceChecker({
  categories = DEFAULT_COMPLIANCE_CATEGORIES,
  onComplete,
  onExport,
  className,
}: E146ComplianceCheckerProps) {
  const [items, setItems] = useState<ComplianceItem[]>(
    categories.flatMap((c) => c.items)
  );
  const [activeCategory, setActiveCategory] = useState<string>(categories[0].id);
  const [showReport, setShowReport] = useState(false);

  const updateItemStatus = (itemId: string, status: ComplianceStatus) => {
    setItems((prev) =>
      prev.map((item) => (item.id === itemId ? { ...item, status } : item))
    );
  };

  const report = useMemo((): ComplianceReport => {
    const completed = items.filter((i) => i.status === "completed").length;
    const pending = items.filter((i) => i.status === "pending" && i.required).length;
    const criticalWarnings = items.filter(
      (i) => i.critical && i.status !== "completed"
    ).length;
    const compliancePercentage = Math.round((completed / items.length) * 100);

    const categoryBreakdown: Record<string, { completed: number; total: number }> = {};
    categories.forEach((cat) => {
      const catItems = items.filter((i) => i.category === cat.id);
      categoryBreakdown[cat.id] = {
        completed: catItems.filter((i) => i.status === "completed").length,
        total: catItems.length,
      };
    });

    return {
      completedItems: completed,
      pendingItems: pending,
      criticalWarnings,
      compliancePercentage,
      passed: criticalWarnings === 0 && pending === 0,
      timestamp: new Date(),
      categoryBreakdown,
    };
  }, [items, categories]);

  const activeCategoryData = categories.find((c) => c.id === activeCategory);
  const activeItems = items.filter((i) => i.category === activeCategory);

  const handleComplete = () => {
    setShowReport(true);
    onComplete?.(report);
  };

  const handleReset = () => {
    setItems(categories.flatMap((c) => c.items));
    setShowReport(false);
    setActiveCategory(categories[0].id);
  };

  if (showReport) {
    return (
      <ComplianceReportView
        report={report}
        categories={categories}
        onBack={() => setShowReport(false)}
        onReset={handleReset}
        onExport={() => onExport?.(report)}
      />
    );
  }

  return (
    <div className={cn("space-y-6", className)}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            E1.46 Compliance Checker
          </h2>
          <p className="text-sm text-muted-foreground">
            Verify your entertainment laser setup meets ANSI E1.46 requirements
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-2xl font-bold">{report.compliancePercentage}%</div>
            <div className="text-xs text-muted-foreground">Complete</div>
          </div>
          <div className="w-24">
            <Progress value={report.compliancePercentage}>
              <ProgressTrack>
                <ProgressIndicator />
              </ProgressTrack>
            </Progress>
          </div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2">
        {categories.map((category) => {
          const categoryItems = items.filter((i) => i.category === category.id);
          const completedCount = categoryItems.filter((i) => i.status === "completed").length;
          const isActive = activeCategory === category.id;

          return (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              )}
            >
              {category.icon}
              <span>{category.name}</span>
              <Badge
                variant={isActive ? "secondary" : "outline"}
                className="text-xs"
              >
                {completedCount}/{categoryItems.length}
              </Badge>
            </button>
          );
        })}
      </div>

      {/* Active Category Content */}
      {activeCategoryData && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                {activeCategoryData.icon}
              </div>
              <div>
                <CardTitle>{activeCategoryData.name}</CardTitle>
                <p className="text-sm text-muted-foreground">
                  {activeCategoryData.description}
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-3">
            {activeItems.map((item) => (
              <ComplianceItemRow
                key={item.id}
                item={item}
                onStatusChange={updateItemStatus}
              />
            ))}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={() => {
                const currentIndex = categories.findIndex((c) => c.id === activeCategory);
                if (currentIndex > 0) {
                  setActiveCategory(categories[currentIndex - 1].id);
                }
              }}
              disabled={activeCategory === categories[0].id}
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Previous
            </Button>

            {activeCategory === categories[categories.length - 1].id ? (
              <Button onClick={handleComplete}>
                Generate Report
                <FileCheck className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={() => {
                  const currentIndex = categories.findIndex((c) => c.id === activeCategory);
                  if (currentIndex < categories.length - 1) {
                    setActiveCategory(categories[currentIndex + 1].id);
                  }
                }}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </CardFooter>
        </Card>
      )}

      {/* Critical Warning */}
      {report.criticalWarnings > 0 && (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <div className="font-medium text-red-400">Critical Items Pending</div>
            <p className="text-sm text-muted-foreground">
              {report.criticalWarnings} critical safety requirement{report.criticalWarnings !== 1 ? "s" : ""} must be completed before operation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Compliance Item Row
// ============================================================================

interface ComplianceItemRowProps {
  item: ComplianceItem;
  onStatusChange: (itemId: string, status: ComplianceStatus) => void;
}

function ComplianceItemRow({ item, onStatusChange }: ComplianceItemRowProps) {
  const [showDetails, setShowDetails] = useState(false);

  const statusConfig = {
    pending: { icon: <Circle className="w-5 h-5" />, color: "text-muted-foreground" },
    completed: { icon: <CheckCircle2 className="w-5 h-5" />, color: "text-green-400" },
    na: { icon: <Circle className="w-5 h-5" />, color: "text-muted-foreground" },
    critical: { icon: <AlertCircle className="w-5 h-5" />, color: "text-red-400" },
  };

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      <div
        className={cn(
          "flex items-start gap-3 p-4 cursor-pointer transition-colors",
          item.status === "completed" && "bg-green-500/5",
          item.critical && item.status !== "completed" && "bg-red-500/5 border-red-500/30"
        )}
        onClick={() => setShowDetails(!showDetails)}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStatusChange(
              item.id,
              item.status === "completed" ? "pending" : "completed"
            );
          }}
          className={cn(
            "mt-0.5 transition-colors",
            statusConfig[item.status].color
          )}
        >
          {statusConfig[item.status].icon}
        </button>

        <div className="flex-grow">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={cn(
              "font-medium",
              item.status === "completed" && "line-through opacity-70"
            )}>
              {item.item}
            </span>
            {item.required && (
              <Badge variant="secondary" className="text-xs">Required</Badge>
            )}
            {item.critical && (
              <Badge variant="destructive" className="text-xs">Critical</Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
        </div>

        {showDetails ? (
          <ChevronRight className="w-5 h-5 rotate-90 transition-transform" />
        ) : (
          <ChevronRight className="w-5 h-5 transition-transform" />
        )}
      </div>

      {showDetails && (
        <div className="px-4 pb-4 pt-0 border-t border-border/30">
          <div className="pt-3 space-y-3">
            {item.guidance && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Guidance</div>
                <p className="text-sm">{item.guidance}</p>
              </div>
            )}
            {item.reference && (
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Reference</div>
                <p className="text-sm text-primary">{item.reference}</p>
              </div>
            )}
            
            {/* Status Toggle */}
            <div className="flex gap-2 pt-2">
              {(["pending", "completed", "na"] as ComplianceStatus[]).map((status) => (
                <button
                  key={status}
                  onClick={() => onStatusChange(item.id, status)}
                  className={cn(
                    "px-3 py-1.5 rounded text-sm font-medium transition-colors",
                    item.status === status
                      ? status === "completed"
                        ? "bg-green-500/20 text-green-400"
                        : status === "na"
                        ? "bg-muted text-muted-foreground"
                        : "bg-primary text-primary-foreground"
                      : "bg-muted hover:bg-muted/80"
                  )}
                >
                  {status === "na" ? "N/A" : status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Compliance Report View
// ============================================================================

interface ComplianceReportViewProps {
  report: ComplianceReport;
  categories: ComplianceCategory[];
  onBack: () => void;
  onReset: () => void;
  onExport?: () => void;
}

function ComplianceReportView({
  report,
  categories,
  onBack,
  onReset,
  onExport,
}: ComplianceReportViewProps) {
  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div
          className={cn(
            "mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-4",
            report.passed ? "bg-green-500/20" : "bg-amber-500/20"
          )}
        >
          {report.passed ? (
            <CheckCircle2 className="w-10 h-10 text-green-400" />
          ) : (
            <AlertTriangle className="w-10 h-10 text-amber-400" />
          )}
        </div>
        <CardTitle className="text-2xl">
          {report.passed ? "Compliance Verified" : "Action Required"}
        </CardTitle>
        <p className="text-muted-foreground">
          {report.passed
            ? "Your installation meets E1.46 requirements"
            : "Complete pending items before operation"}
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Summary Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-green-400">{report.completedItems}</div>
            <div className="text-xs text-muted-foreground">Completed</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className="text-2xl font-bold text-amber-400">{report.pendingItems}</div>
            <div className="text-xs text-muted-foreground">Pending</div>
          </div>
          <div className="text-center p-4 bg-muted rounded-lg">
            <div className={cn(
              "text-2xl font-bold",
              report.criticalWarnings > 0 ? "text-red-400" : "text-green-400"
            )}>
              {report.criticalWarnings}
            </div>
            <div className="text-xs text-muted-foreground">Critical</div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-2">
          <h4 className="font-semibold text-sm">Category Breakdown</h4>
          {categories.map((cat) => {
            const breakdown = report.categoryBreakdown[cat.id];
            const percentage = Math.round((breakdown.completed / breakdown.total) * 100);
            
            return (
              <div key={cat.id} className="flex items-center gap-3">
                <div className="w-32 text-sm truncate">{cat.name}</div>
                <div className="flex-grow">
                  <Progress value={percentage}>
                    <ProgressTrack>
                      <ProgressIndicator />
                    </ProgressTrack>
                  </Progress>
                </div>
                <div className="text-sm text-muted-foreground w-16 text-right">
                  {breakdown.completed}/{breakdown.total}
                </div>
              </div>
            );
          })}
        </div>

        {/* Timestamp */}
        <p className="text-center text-xs text-muted-foreground">
          Report generated: {report.timestamp.toLocaleString()}
        </p>
      </CardContent>

      <CardFooter className="flex gap-3 justify-center">
        <Button variant="outline" onClick={onBack}>
          Back to Checklist
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RotateCcw className="w-4 h-4 mr-2" />
          Start Over
        </Button>
        {onExport && (
          <Button onClick={onExport}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default E146ComplianceChecker;
