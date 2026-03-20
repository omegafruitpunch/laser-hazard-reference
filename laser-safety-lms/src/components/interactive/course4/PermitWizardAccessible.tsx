"use client";

import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  FileText,
  AlertTriangle,
  Building2,
  Users,
  Lightbulb,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";
import { cn } from "@/lib/utils";

type Step = "state" | "operation" | "equipment" | "venue" | "result";
type OperationType = "single" | "tour" | "temporary" | "permanent";
type EquipmentClass = "class1" | "class2" | "class3r" | "class3b" | "class4";
type VenueType = "indoor" | "outdoor" | "mixed";

interface PermitResult {
  permitRequired: boolean;
  notificationRequired: boolean;
  timeline: string;
  documents: string[];
  specialRequirements: string[];
  contacts: { name: string; phone: string }[];
}

const stateData: Record<string, PermitResult> = {
  illinois: {
    permitRequired: true,
    notificationRequired: true,
    timeline: "10 working days advance notice required",
    documents: [
      "Laser system registration",
      "LSO qualification documentation",
      "Show description/plans",
      "Safety procedures",
    ],
    specialRequirements: [
      "6 meter height requirement for unattended lasers",
      "Annual registration renewal",
      "Incident reporting within specified timelines",
    ],
    contacts: [
      { name: "Illinois Emergency Management Agency", phone: "(217) 785-9975" },
    ],
  },
  massachusetts: {
    permitRequired: true,
    notificationRequired: true,
    timeline: "15 days advance notice for vendors",
    documents: [
      "ANSI Z136 compliance documentation",
      "Waiver request (if applicable)",
      "Show documentation",
    ],
    specialRequirements: [
      "Maximum $500 civil penalty per violation",
      "Waiver provisions for undue hardship",
      "Routine inspections at agency discretion",
    ],
    contacts: [
      { name: "MA Department of Public Health", phone: "(617) 242-3035" },
    ],
  },
  nevada: {
    permitRequired: false,
    notificationRequired: true,
    timeline: "Advance notification recommended",
    documents: [
      "Basic show information",
      "Contact details",
    ],
    specialRequirements: [
      "No routine inspections",
      "No mandatory training",
      "Minimal oversight",
    ],
    contacts: [
      { name: "Karen Beckley, Radiation Control Program", phone: "(775) 687-7550" },
    ],
  },
  "new-york": {
    permitRequired: true,
    notificationRequired: true,
    timeline: "As specified in regulations",
    documents: [
      "Class A or Class B Certificate",
      "Training documentation from approved provider",
      "Show plans and safety procedures",
    ],
    specialRequirements: [
      "Only state with mandatory training requirement",
      "Class A: Low intensity lasers only",
      "Class B: Low and high intensity lasers",
      "Routine inspections conducted",
    ],
    contacts: [
      { name: "NY Department of Labor", phone: "(518) 457-1202" },
    ],
  },
  texas: {
    permitRequired: true,
    notificationRequired: true,
    timeline: "As specified in regulations",
    documents: [
      "Equipment registration",
      "Show documentation",
      "Safety procedures",
    ],
    specialRequirements: [
      "Special provisions for laser hair removal devices",
      "IPL regulations apply",
      "ILDA industry engagement history",
    ],
    contacts: [
      { name: "Shannon Dove-Edson, Program Manager", phone: "(512) 834-6688" },
    ],
  },
  washington: {
    permitRequired: false,
    notificationRequired: true,
    timeline: "Light show specific notification",
    documents: [
      "Light show notification form",
      "Basic show information",
    ],
    specialRequirements: [
      "Light show specific notification requirements",
      "No routine inspections",
      "WAC 296-62-09005 compliance",
    ],
    contacts: [
      { name: "David B. Jansen, Director", phone: "(360) 236-3210" },
    ],
  },
};

const steps: { id: Step; label: string; description: string; icon: React.ReactNode }[] = [
  { 
    id: "state", 
    label: "Select State", 
    description: "Choose the state where you will operate",
    icon: <MapPin className="h-4 w-4" aria-hidden="true" /> 
  },
  { 
    id: "operation", 
    label: "Operation Type", 
    description: "What type of laser operation are you planning",
    icon: <Building2 className="h-4 w-4" aria-hidden="true" /> 
  },
  { 
    id: "equipment", 
    label: "Equipment", 
    description: "What class of laser equipment will you use",
    icon: <Lightbulb className="h-4 w-4" aria-hidden="true" /> 
  },
  { 
    id: "venue", 
    label: "Venue", 
    description: "What type of venue will you operate in",
    icon: <Users className="h-4 w-4" aria-hidden="true" /> 
  },
  { 
    id: "result", 
    label: "Results", 
    description: "Your permit requirements analysis",
    icon: <FileText className="h-4 w-4" aria-hidden="true" /> 
  },
];

export function PermitWizardAccessible() {
  const { announceToScreenReader } = useAccessibilitySettings();
  const [currentStep, setCurrentStep] = useState<Step>("state");
  const [selectedState, setSelectedState] = useState<string>("");
  const [operationType, setOperationType] = useState<OperationType | null>(null);
  const [equipmentClass, setEquipmentClass] = useState<EquipmentClass | null>(null);
  const [venueType, setVenueType] = useState<VenueType | null>(null);

  const stepIndex = steps.findIndex((s) => s.id === currentStep);
  const progress = ((stepIndex + 1) / steps.length) * 100;

  const canProceed = () => {
    switch (currentStep) {
      case "state":
        return selectedState !== "";
      case "operation":
        return operationType !== null;
      case "equipment":
        return equipmentClass !== null;
      case "venue":
        return venueType !== null;
      default:
        return true;
    }
  };

  const handleNext = () => {
    const nextIndex = stepIndex + 1;
    if (nextIndex < steps.length) {
      const nextStep = steps[nextIndex];
      setCurrentStep(nextStep.id);
      announceToScreenReader(`Moving to step ${nextIndex + 1}: ${nextStep.label}`, "polite");
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      const prevStep = steps[prevIndex];
      setCurrentStep(prevStep.id);
      announceToScreenReader(`Returning to step ${prevIndex + 1}: ${prevStep.label}`, "polite");
    }
  };

  const reset = () => {
    setCurrentStep("state");
    setSelectedState("");
    setOperationType(null);
    setEquipmentClass(null);
    setVenueType(null);
    announceToScreenReader("Wizard reset. Starting over from step 1.", "polite");
  };

  const getResult = (): PermitResult | null => {
    if (!selectedState) return null;
    return stateData[selectedState] || null;
  };

  // Handle keyboard navigation between steps
  const handleStepKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && canProceed()) {
      event.preventDefault();
      handleNext();
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "state":
        return (
          <div 
            role="radiogroup" 
            aria-label="Select a state"
            className="space-y-4"
          >
            <h3 id="state-heading" className="font-medium">Which state will you be operating in?</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { key: "illinois", label: "Illinois", description: "Comprehensive regulations" },
                { key: "massachusetts", label: "Massachusetts", description: "15-day vendor notice" },
                { key: "nevada", label: "Nevada", description: "Minimal requirements" },
                { key: "new-york", label: "New York", description: "Mandatory certification" },
                { key: "texas", label: "Texas", description: "Equipment registration" },
                { key: "washington", label: "Washington", description: "Light show notification" },
              ].map((state) => (
                <button
                  key={state.key}
                  role="radio"
                  aria-checked={selectedState === state.key}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border text-left transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    selectedState === state.key 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={() => {
                    setSelectedState(state.key);
                    announceToScreenReader(`${state.label} selected. ${state.description}`, "polite");
                  }}
                >
                  <MapPin className={cn(
                    "h-5 w-5 mt-0.5 shrink-0",
                    selectedState === state.key ? "text-primary" : "text-muted-foreground"
                  )} aria-hidden="true" />
                  <div>
                    <span className="font-medium block">{state.label}</span>
                    <span className="text-sm text-muted-foreground">{state.description}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        );

      case "operation":
        return (
          <div 
            role="radiogroup" 
            aria-label="Select operation type"
            className="space-y-4"
          >
            <h3 id="operation-heading" className="font-medium">What type of operation?</h3>
            <div className="space-y-2">
              {[
                { key: "single", label: "Single Event/Show", desc: "One-time laser show or event" },
                { key: "tour", label: "Tour/Multiple Dates", desc: "Traveling show across multiple venues" },
                { key: "temporary", label: "Temporary Installation", desc: "Short-term installation (days/weeks)" },
                { key: "permanent", label: "Permanent Installation", desc: "Fixed location installation" },
              ].map((op) => (
                <button
                  key={op.key}
                  role="radio"
                  aria-checked={operationType === op.key}
                  className={cn(
                    "w-full flex flex-col items-start gap-1 p-4 rounded-lg border text-left transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    operationType === op.key 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={() => {
                    setOperationType(op.key as OperationType);
                    announceToScreenReader(`${op.label} selected`, "polite");
                  }}
                >
                  <span className="font-medium">{op.label}</span>
                  <span className="text-sm text-muted-foreground">{op.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "equipment":
        return (
          <div 
            role="radiogroup" 
            aria-label="Select laser equipment class"
            className="space-y-4"
          >
            <h3 id="equipment-heading" className="font-medium">What class of laser equipment?</h3>
            <div className="space-y-2">
              {[
                { key: "class1", label: "Class 1", desc: "Safe under normal use" },
                { key: "class2", label: "Class 2", desc: "Visible lasers, blink reflex protection" },
                { key: "class3r", label: "Class 3R", desc: "Low risk, normally safe" },
                { key: "class3b", label: "Class 3B", desc: "Direct viewing hazard" },
                { key: "class4", label: "Class 4", desc: "High power, fire and diffuse reflection hazard", warning: true },
              ].map((cls) => (
                <button
                  key={cls.key}
                  role="radio"
                  aria-checked={equipmentClass === cls.key}
                  className={cn(
                    "w-full flex flex-col items-start gap-1 p-4 rounded-lg border text-left transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    equipmentClass === cls.key 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50",
                    cls.warning && "border-destructive/50"
                  )}
                  onClick={() => {
                    setEquipmentClass(cls.key as EquipmentClass);
                    announceToScreenReader(`${cls.label} selected. ${cls.desc}`, "polite");
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{cls.label}</span>
                    {cls.warning && (
                      <AlertTriangle className="h-4 w-4 text-destructive" aria-hidden="true" />
                    )}
                    {cls.warning && <span className="sr-only">Warning: High power laser</span>}
                  </div>
                  <span className="text-sm text-muted-foreground">{cls.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "venue":
        return (
          <div 
            role="radiogroup" 
            aria-label="Select venue type"
            className="space-y-4"
          >
            <h3 id="venue-heading" className="font-medium">What type of venue?</h3>
            <div className="space-y-2">
              {[
                { key: "indoor", label: "Indoor Venue", desc: "Theater, arena, club, or enclosed space" },
                { key: "outdoor", label: "Outdoor Venue", desc: "Open air festival, outdoor stage" },
                { key: "mixed", label: "Mixed/Variable", desc: "Combination or changing venues" },
              ].map((venue) => (
                <button
                  key={venue.key}
                  role="radio"
                  aria-checked={venueType === venue.key}
                  className={cn(
                    "w-full flex flex-col items-start gap-1 p-4 rounded-lg border text-left transition-all",
                    "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                    venueType === venue.key 
                      ? "border-primary bg-primary/5" 
                      : "border-border hover:border-primary/50 hover:bg-muted/50"
                  )}
                  onClick={() => {
                    setVenueType(venue.key as VenueType);
                    announceToScreenReader(`${venue.label} selected`, "polite");
                  }}
                >
                  <span className="font-medium">{venue.label}</span>
                  <span className="text-sm text-muted-foreground">{venue.desc}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case "result":
        const result = getResult();
        if (!result) return null;
        return (
          <div 
            role="region" 
            aria-label="Permit requirements analysis results"
            className="space-y-4"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" aria-hidden="true" />
              <h3 className="font-medium text-lg">Requirements Analysis Complete</h3>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Badge 
                  variant={result.permitRequired ? "destructive" : "secondary"}
                  role="status"
                  aria-label={`Permit required: ${result.permitRequired ? "Yes" : "No"}`}
                >
                  {result.permitRequired ? "Permit Required" : "No Permit Required"}
                </Badge>
                <Badge 
                  variant={result.notificationRequired ? "default" : "outline"}
                  role="status"
                  aria-label={`Notification required: ${result.notificationRequired ? "Yes" : "No"}`}
                >
                  {result.notificationRequired ? "Notification Required" : "No Notification"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" aria-hidden="true" />
                  Timeline
                </h4>
                <p className="text-sm text-muted-foreground">{result.timeline}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Required Documents</h4>
                <ul className="space-y-1" role="list">
                  {result.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3 w-3 text-green-500" aria-hidden="true" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" aria-hidden="true" />
                  Special Requirements
                </h4>
                <ul className="space-y-1" role="list">
                  {result.specialRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-500 mt-1" aria-hidden="true">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" aria-hidden="true" />
                  Regulatory Contacts
                </h4>
                {result.contacts.map((contact, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-muted-foreground">
                      <a 
                        href={`tel:${contact.phone.replace(/\D/g, "")}`}
                        className="hover:underline focus:outline-none focus:ring-2 focus:ring-ring rounded"
                      >
                        {contact.phone}
                      </a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" aria-hidden="true" />
          Permit Requirement Finder
        </CardTitle>
        <CardDescription>
          Answer a few questions to determine your permit requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress Stepper */}
        <nav aria-label="Wizard progress">
          <div className="space-y-2">
            {/* Progress Bar */}
            <div 
              className="h-2 bg-muted rounded-full overflow-hidden"
              role="progressbar"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label={`Step ${stepIndex + 1} of ${steps.length}`}
            >
              <div 
                className="h-full bg-primary transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
            
            {/* Step Indicators */}
            <ol className="flex justify-between" role="list">
              {steps.map((step, idx) => {
                const isCurrent = idx === stepIndex;
                const isCompleted = idx < stepIndex;
                const isUpcoming = idx > stepIndex;
                
                return (
                  <li 
                    key={step.id}
                    className="flex flex-col items-center"
                  >
                    <div
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-colors",
                        isCurrent && "bg-primary text-primary-foreground ring-2 ring-ring ring-offset-2",
                        isCompleted && "bg-green-500 text-white",
                        isUpcoming && "bg-muted text-muted-foreground"
                      )}
                      aria-current={isCurrent ? "step" : undefined}
                      aria-label={
                        isCompleted 
                          ? `${step.label}, completed` 
                          : isCurrent 
                            ? `${step.label}, current step` 
                            : `${step.label}, not started`
                      }
                    >
                      {isCompleted ? (
                        <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
                      ) : (
                        step.icon
                      )}
                    </div>
                    <span 
                      className={cn(
                        "text-xs mt-1 hidden sm:block",
                        isCurrent ? "text-foreground font-medium" : "text-muted-foreground"
                      )}
                    >
                      {step.label}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </nav>

        {/* Screen reader only progress announcement */}
        <div className="sr-only" role="status" aria-live="polite">
          Step {stepIndex + 1} of {steps.length}: {steps[stepIndex]?.label}
        </div>

        {/* Step Content */}
        <div 
          className="min-h-[250px]"
          role="main"
          aria-label={`Step ${stepIndex + 1} content`}
          onKeyDown={handleStepKeyDown}
        >
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === "state" ? reset : handleBack}
            disabled={currentStep === "result"}
            aria-label={currentStep === "state" ? "Reset wizard" : "Go back to previous step"}
          >
            {currentStep === "state" ? (
              <>
                <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" />
                Reset
              </>
            ) : (
              <>
                <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
                Back
              </>
            )}
          </Button>
          {currentStep !== "result" ? (
            <Button 
              onClick={handleNext} 
              disabled={!canProceed()}
              aria-label={canProceed() ? "Go to next step" : "Please complete current step before continuing"}
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
            </Button>
          ) : (
            <Button onClick={reset}>
              <RotateCcw className="h-4 w-4 mr-1" aria-hidden="true" />
              Start Over
            </Button>
          )}
        </div>

        {/* Help text */}
        <p className="text-xs text-muted-foreground text-center">
          Use Tab to navigate options. Press Enter to select and continue.
        </p>
      </CardContent>
    </Card>
  );
}

export default PermitWizardAccessible;
