"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Building2, 
  FileText, 
  Calendar, 
  Calculator,
  ClipboardList,
  Bus,
  Accessibility,
  Keyboard,
} from "lucide-react";
import { StateMatrixAccessible } from "./StateMatrixAccessible";
import { PermitWizardAccessible } from "./PermitWizardAccessible";
import { TimelineCalculatorAccessible } from "./TimelineCalculatorAccessible";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";
import { cn } from "@/lib/utils";

// Tour Planner (simplified accessible version)
function TourPlannerAccessible() {
  const { announceToScreenReader } = useAccessibilitySettings();
  const [tourStops, setTourStops] = useState<Array<{state: string; city: string; date: string}>>([]);
  const [currentStop, setCurrentStop] = useState({ state: "", city: "", date: "" });

  const states = [
    { id: "illinois", name: "Illinois", requirements: ["10-day notice", "Registration"] },
    { id: "massachusetts", name: "Massachusetts", requirements: ["15-day notice"] },
    { id: "nevada", name: "Nevada", requirements: ["Notification"] },
    { id: "new-york", name: "New York", requirements: ["Certificate"] },
    { id: "texas", name: "Texas", requirements: ["Registration"] },
    { id: "washington", name: "Washington", requirements: ["Notification"] },
  ];

  const addStop = () => {
    if (currentStop.state && currentStop.city && currentStop.date) {
      const newStops = [...tourStops, currentStop];
      setTourStops(newStops);
      setCurrentStop({ state: "", city: "", date: "" });
      announceToScreenReader(`Added stop in ${currentStop.city}, ${currentStop.state}. Total stops: ${newStops.length}`, "polite");
    }
  };

  const removeStop = (index: number) => {
    const stop = tourStops[index];
    const newStops = tourStops.filter((_, i) => i !== index);
    setTourStops(newStops);
    announceToScreenReader(`Removed stop in ${stop.city}. Total stops: ${newStops.length}`, "polite");
  };

  // Generate compliance checklist based on stops
  const generateChecklist = () => {
    const checklist: string[] = [];
    const stateSet = new Set(tourStops.map(s => s.state));
    
    stateSet.forEach(stateId => {
      const state = states.find(s => s.id === stateId);
      if (state) {
        state.requirements.forEach(req => {
          checklist.push(`${state.name}: ${req}`);
        });
      }
    });
    
    return checklist;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bus className="h-5 w-5" aria-hidden="true" />
          Multi-State Tour Planner
        </CardTitle>
        <CardDescription>
          Plan your tour and track compliance requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Add Stop Form */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <select
            value={currentStop.state}
            onChange={(e) => setCurrentStop({ ...currentStop, state: e.target.value })}
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="Select state"
          >
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="text"
            value={currentStop.city}
            onChange={(e) => setCurrentStop({ ...currentStop, city: e.target.value })}
            placeholder="City"
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="City name"
          />
          <input
            type="date"
            value={currentStop.date}
            onChange={(e) => setCurrentStop({ ...currentStop, date: e.target.value })}
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="Event date"
          />
          <Button onClick={addStop} disabled={!currentStop.state || !currentStop.city || !currentStop.date}>
            Add Stop
          </Button>
        </div>

        {/* Tour Stops List */}
        <div className="space-y-2" role="list" aria-label="Tour stops">
          {tourStops.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">No stops added yet. Add stops to generate a compliance checklist.</p>
          ) : (
            tourStops.map((stop, index) => {
              const state = states.find(s => s.id === stop.state);
              return (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 bg-muted rounded-lg"
                  role="listitem"
                >
                  <div>
                    <span className="font-medium">{stop.city}, {state?.name}</span>
                    <span className="text-sm text-muted-foreground ml-2">{stop.date}</span>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => removeStop(index)} aria-label={`Remove stop in ${stop.city}`}>
                    Remove
                  </Button>
                </div>
              );
            })
          )}
        </div>

        {/* Compliance Checklist */}
        {tourStops.length > 0 && (
          <div className="border rounded-lg p-4" role="region" aria-label="Compliance checklist">
            <h4 className="font-medium mb-2 flex items-center gap-2">
              <ClipboardList className="h-4 w-4" aria-hidden="true" />
              Generated Compliance Checklist
            </h4>
            <ul className="space-y-1" role="list">
              {generateChecklist().map((item, index) => (
                <li key={index} className="text-sm flex items-center gap-2">
                  <input type="checkbox" className="rounded" aria-label={`Mark ${item} as complete`} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// Notification Calculator (simplified accessible version)
function NotificationCalculatorAccessible() {
  const { announceToScreenReader } = useAccessibilitySettings();
  const [eventDate, setEventDate] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [deadline, setDeadline] = useState<Date | null>(null);

  const states = [
    { id: "illinois", name: "Illinois", noticeDays: 10, type: "business" },
    { id: "massachusetts", name: "Massachusetts", noticeDays: 15, type: "calendar" },
    { id: "nevada", name: "Nevada", noticeDays: 14, type: "calendar" },
    { id: "new-york", name: "New York", noticeDays: 30, type: "calendar" },
    { id: "texas", name: "Texas", noticeDays: 21, type: "calendar" },
    { id: "washington", name: "Washington", noticeDays: 14, type: "calendar" },
  ];

  const calculateDeadline = () => {
    if (!eventDate || !selectedState) return;
    
    const state = states.find(s => s.id === selectedState);
    if (!state) return;

    const event = new Date(eventDate);
    const deadline = new Date(event);
    
    if (state.type === "calendar") {
      deadline.setDate(deadline.getDate() - state.noticeDays);
    } else {
      // Business days calculation (simplified)
      let daysCounted = 0;
      while (daysCounted < state.noticeDays) {
        deadline.setDate(deadline.getDate() - 1);
        const day = deadline.getDay();
        if (day !== 0 && day !== 6) daysCounted++;
      }
    }
    
    setDeadline(deadline);
    announceToScreenReader(
      `Notification deadline for ${state.name}: ${deadline.toLocaleDateString()}. ${state.noticeDays} ${state.type} days notice required.`,
      "polite"
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" aria-hidden="true" />
          Notification Deadline Calculator
        </CardTitle>
        <CardDescription>
          Calculate notification deadlines for your events
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="Select state"
          >
            <option value="">Select State</option>
            {states.map(s => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input
            type="date"
            value={eventDate}
            onChange={(e) => setEventDate(e.target.value)}
            className="px-3 py-2 border rounded-md text-sm"
            aria-label="Event date"
          />
          <Button onClick={calculateDeadline} disabled={!eventDate || !selectedState}>
            Calculate
          </Button>
        </div>

        {deadline && (
          <div 
            className="p-4 bg-primary/5 border border-primary/20 rounded-lg"
            role="status"
            aria-live="polite"
          >
            <p className="font-medium">Notification Deadline</p>
            <p className="text-2xl font-bold">{deadline.toLocaleDateString()}</p>
            <p className="text-sm text-muted-foreground">
              {states.find(s => s.id === selectedState)?.noticeDays} days notice required
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export function Module4_InteractiveModules() {
  const { settings, updateSetting } = useAccessibilitySettings();
  const [activeTab, setActiveTab] = useState("matrix");

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold">Course 4: US State & Local Regulations</h1>
          <p className="text-muted-foreground">
            Interactive tools for navigating state laser regulations
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="flex items-center gap-1">
            <Accessibility className="h-3 w-3" />
            WCAG 2.2 AA
          </Badge>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => updateSetting("highContrast", !settings.highContrast)}
            aria-pressed={settings.highContrast}
          >
            {settings.highContrast ? "Normal Contrast" : "High Contrast"}
          </Button>
        </div>
      </div>

      {/* Keyboard Navigation Help */}
      <div className="p-4 bg-muted rounded-lg text-sm" role="region" aria-label="Keyboard navigation help">
        <h2 className="font-medium flex items-center gap-2 mb-2">
          <Keyboard className="h-4 w-4" aria-hidden="true" />
          Keyboard Navigation Tips
        </h2>
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-2 text-muted-foreground">
          <li>• Use Tab to navigate between interactive elements</li>
          <li>• Use Arrow keys to navigate within components</li>
          <li>• Press Space or Enter to activate buttons</li>
          <li>• Press Escape to close or exit components</li>
        </ul>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 w-full" aria-label="Module sections">
          <TabsTrigger value="matrix" className="flex items-center gap-2">
            <Building2 className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">State Matrix</span>
            <span className="sm:hidden">Matrix</span>
          </TabsTrigger>
          <TabsTrigger value="wizard" className="flex items-center gap-2">
            <FileText className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Permit Wizard</span>
            <span className="sm:hidden">Permit</span>
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Calendar className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Timeline</span>
            <span className="sm:hidden">Time</span>
          </TabsTrigger>
          <TabsTrigger value="tour" className="flex items-center gap-2">
            <Bus className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Tour Planner</span>
            <span className="sm:hidden">Tour</span>
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Calculator</span>
            <span className="sm:hidden">Calc</span>
          </TabsTrigger>
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <ClipboardList className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">Checklist</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="matrix" className="mt-4">
          <StateMatrixAccessible />
        </TabsContent>

        <TabsContent value="wizard" className="mt-4">
          <div className="flex justify-center">
            <PermitWizardAccessible />
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="mt-4">
          <TimelineCalculatorAccessible />
        </TabsContent>

        <TabsContent value="tour" className="mt-4">
          <TourPlannerAccessible />
        </TabsContent>

        <TabsContent value="calculator" className="mt-4">
          <NotificationCalculatorAccessible />
        </TabsContent>

        <TabsContent value="checklist" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compliance Checklist Generator</CardTitle>
              <CardDescription>
                Use the Permit Wizard or Tour Planner to generate customized checklists for your specific needs.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Select a state and operation type in the Permit Wizard, or add tour stops in the Tour Planner to generate a compliance checklist.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Footer */}
      <footer className="border-t pt-4 mt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>All interactive components are WCAG 2.2 AA compliant</p>
          <div className="flex gap-4">
            <a href="#" className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded px-1">
              Accessibility Statement
            </a>
            <a href="#" className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded px-1">
              Keyboard Shortcuts
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Module4_InteractiveModules;
