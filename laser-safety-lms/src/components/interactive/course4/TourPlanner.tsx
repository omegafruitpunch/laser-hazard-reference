"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Bus, 
  MapPin, 
  Calendar,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  FileText,
  Clock,
  Plus,
  X
} from "lucide-react";

interface TourStop {
  id: string;
  state: string;
  city: string;
  date: string;
  venue: string;
}

interface ComplianceAction {
  priority: "critical" | "high" | "medium" | "low";
  action: string;
  deadline: string;
  state?: string;
  completed: boolean;
}

const availableStates = [
  { id: "illinois", name: "Illinois", requirements: ["10-day notice", "Registration", "LSO docs"] },
  { id: "massachusetts", name: "Massachusetts", requirements: ["15-day vendor notice", "ANSI compliance"] },
  { id: "nevada", name: "Nevada", requirements: ["Advance notification"] },
  { id: "new-york", name: "New York", requirements: ["Class A/B Certificate", "Training"] },
  { id: "texas", name: "Texas", requirements: ["Equipment registration", "Show documentation"] },
  { id: "washington", name: "Washington", requirements: ["Light show notification"] },
];

type Step = "setup" | "stops" | "review" | "checklist";

export function TourPlanner() {
  const [currentStep, setCurrentStep] = useState<Step>("setup");
  const [tourName, setTourName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [stops, setStops] = useState<TourStop[]>([]);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const stepIndex = ["setup", "stops", "review", "checklist"].indexOf(currentStep);
  const progress = ((stepIndex + 1) / 4) * 100;

  const addStop = () => {
    const newStop: TourStop = {
      id: Date.now().toString(),
      state: "",
      city: "",
      date: "",
      venue: "",
    };
    setStops([...stops, newStop]);
  };

  const updateStop = (id: string, field: keyof TourStop, value: string) => {
    setStops(stops.map((s) => (s.id === id ? { ...s, [field]: value } : s)));
  };

  const removeStop = (id: string) => {
    setStops(stops.filter((s) => s.id !== id));
  };

  const generateComplianceActions = (): ComplianceAction[] => {
    const actions: ComplianceAction[] = [];
    const stateSet = new Set(stops.map((s) => s.state));

    // Sort stops by date
    const sortedStops = [...stops].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    sortedStops.forEach((stop, index) => {
      const stopDate = new Date(stop.date);
      const state = availableStates.find((s) => s.id === stop.state);
      
      if (!state) return;

      // Add state-specific requirements
      state.requirements.forEach((req) => {
        let deadline = stopDate;
        let priority: ComplianceAction["priority"] = "medium";

        if (req.includes("10-day")) {
          deadline = new Date(stopDate.getTime() - 14 * 24 * 60 * 60 * 1000);
          priority = "critical";
        } else if (req.includes("15-day")) {
          deadline = new Date(stopDate.getTime() - 21 * 24 * 60 * 60 * 1000);
          priority = "critical";
        } else if (req.includes("Certificate")) {
          deadline = new Date(stopDate.getTime() - 56 * 24 * 60 * 60 * 1000);
          priority = "critical";
        }

        actions.push({
          priority,
          action: `${req} for ${stop.city}, ${state.name}`,
          deadline: deadline.toISOString().split("T")[0],
          state: state.name,
          completed: false,
        });
      });
    });

    // Add general actions
    if (stateSet.has("new-york")) {
      const firstNYStop = sortedStops.find((s) => s.state === "new-york");
      if (firstNYStop) {
        const deadline = new Date(new Date(firstNYStop.date).getTime() - 56 * 24 * 60 * 60 * 1000);
        actions.unshift({
          priority: "critical",
          action: "Apply for NY Class A or B Certificate (8 weeks minimum)",
          deadline: deadline.toISOString().split("T")[0],
          state: "New York",
          completed: false,
        });
      }
    }

    // Sort by deadline and priority
    return actions.sort((a, b) => {
      const dateDiff = new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
      if (dateDiff !== 0) return dateDiff;
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return priorityOrder[a.priority] - priorityOrder[b.priority];
    });
  };

  const complianceActions = generateComplianceActions();

  const toggleAction = (actionStr: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(actionStr)) {
      newCompleted.delete(actionStr);
    } else {
      newCompleted.add(actionStr);
    }
    setCompletedActions(newCompleted);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-200";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-blue-100 text-blue-800 border-blue-200";
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case "setup":
        return tourName && startDate;
      case "stops":
        return stops.length > 0 && stops.every((s) => s.state && s.city && s.date);
      default:
        return true;
    }
  };

  const handleNext = () => {
    const steps: Step[] = ["setup", "stops", "review", "checklist"];
    const nextIndex = steps.indexOf(currentStep) + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex]);
    }
  };

  const handleBack = () => {
    const steps: Step[] = ["setup", "stops", "review", "checklist"];
    const prevIndex = steps.indexOf(currentStep) - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex]);
    }
  };

  const reset = () => {
    setCurrentStep("setup");
    setTourName("");
    setStartDate("");
    setStops([]);
    setCompletedActions(new Set());
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "setup":
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium">Tour Name</label>
              <input
                type="text"
                value={tourName}
                onChange={(e) => setTourName(e.target.value)}
                placeholder="e.g., Summer 2026 Tour"
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tour Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-3 py-2 border rounded-md text-sm"
              />
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Bus className="h-4 w-4" />
                Tour Planning Tips
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start planning at least 8 weeks before first show</li>
                <li>• New York requires certificates - apply first!</li>
                <li>• Illinois and Massachusetts need 10-15 day notice</li>
                <li>• Nevada and Washington have minimal requirements</li>
              </ul>
            </div>
          </div>
        );

      case "stops":
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">Tour Stops ({stops.length})</h3>
              <Button onClick={addStop} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Add Stop
              </Button>
            </div>
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {stops.map((stop, index) => (
                <div key={stop.id} className="p-4 border rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Stop #{index + 1}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeStop(stop.id)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs text-muted-foreground">State</label>
                      <select
                        value={stop.state}
                        onChange={(e) => updateStop(stop.id, "state", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      >
                        <option value="">Select state</option>
                        {availableStates.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">City</label>
                      <input
                        type="text"
                        value={stop.city}
                        onChange={(e) => updateStop(stop.id, "city", e.target.value)}
                        placeholder="City name"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Date</label>
                      <input
                        type="date"
                        value={stop.date}
                        onChange={(e) => updateStop(stop.id, "date", e.target.value)}
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground">Venue</label>
                      <input
                        type="text"
                        value={stop.venue}
                        onChange={(e) => updateStop(stop.id, "venue", e.target.value)}
                        placeholder="Venue name"
                        className="w-full px-2 py-1 border rounded text-sm"
                      />
                    </div>
                  </div>
                </div>
              ))}
              {stops.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No stops added yet. Click "Add Stop" to begin.</p>
                </div>
              )}
            </div>
          </div>
        );

      case "review":
        const sortedStops = [...stops].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Tour Overview: {tourName}</h3>
            <div className="p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Start Date:</span>
                  <span className="ml-1 font-medium">{startDate}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div>
                  <span className="text-muted-foreground">Total Stops:</span>
                  <span className="ml-1 font-medium">{stops.length}</span>
                </div>
                <Separator orientation="vertical" className="h-4" />
                <div>
                  <span className="text-muted-foreground">States:</span>
                  <span className="ml-1 font-medium">
                    {[...new Set(stops.map((s) => s.state))].length}
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h4 className="text-sm font-medium">Tour Route</h4>
              <div className="space-y-2">
                {sortedStops.map((stop, index) => {
                  const state = availableStates.find((s) => s.id === stop.state);
                  return (
                    <div key={stop.id} className="flex items-center gap-3 p-3 border rounded-lg">
                      <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">
                          {stop.city}, {state?.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {stop.venue} • {stop.date}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {state?.requirements.length} requirements
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case "checklist":
        const criticalCount = complianceActions.filter((a) => a.priority === "critical").length;
        const completedCount = complianceActions.filter((a) => completedActions.has(a.action)).length;
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">Compliance Checklist</h3>
                <p className="text-sm text-muted-foreground">
                  {completedCount} of {complianceActions.length} completed
                </p>
              </div>
              {criticalCount > 0 && (
                <Badge variant="destructive">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {criticalCount} Critical
                </Badge>
              )}
            </div>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {complianceActions.map((action, index) => (
                <div
                  key={index}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    completedActions.has(action.action) ? "bg-muted/50 opacity-60" : "hover:bg-muted/30"
                  }`}
                  onClick={() => toggleAction(action.action)}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {completedActions.has(action.action) ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge className={`text-xs ${getPriorityColor(action.priority)}`}>
                          {action.priority}
                        </Badge>
                        {action.state && (
                          <Badge variant="outline" className="text-xs">
                            {action.state}
                          </Badge>
                        )}
                      </div>
                      <p className={`mt-1 text-sm ${completedActions.has(action.action) ? "line-through" : ""}`}>
                        {action.action}
                      </p>
                      <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Deadline: {action.deadline}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4" />
                Export Options
              </h4>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <FileText className="h-4 w-4 mr-1" />
                  Print Checklist
                </Button>
                <Button variant="outline" size="sm">
                  <Calendar className="h-4 w-4 mr-1" />
                  Export to Calendar
                </Button>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-3xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bus className="h-5 w-5" />
          Tour Planner
        </CardTitle>
        <CardDescription>
          &quot;I&apos;m touring - what do I need?&quot; Multi-state compliance wizard
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <Progress value={progress}>
          <ProgressTrack>
            <ProgressIndicator />
          </ProgressTrack>
        </Progress>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Setup</span>
          <span>Stops</span>
          <span>Review</span>
          <span>Checklist</span>
        </div>

        {/* Content */}
        <div className="min-h-[300px]">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={currentStep === "setup" ? reset : handleBack}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            {currentStep === "setup" ? "Reset" : "Back"}
          </Button>
          {currentStep !== "checklist" ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" />
              New Tour
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default TourPlanner;
