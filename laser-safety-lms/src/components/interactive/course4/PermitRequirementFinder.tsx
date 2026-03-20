"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { 
  MapPin, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2,
  FileText,
  AlertTriangle,
  Building2,
  Users,
  Lightbulb
} from "lucide-react";

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

const steps: { id: Step; label: string; icon: React.ReactNode }[] = [
  { id: "state", label: "Select State", icon: <MapPin className="h-4 w-4" /> },
  { id: "operation", label: "Operation Type", icon: <Building2 className="h-4 w-4" /> },
  { id: "equipment", label: "Equipment", icon: <Lightbulb className="h-4 w-4" /> },
  { id: "venue", label: "Venue", icon: <Users className="h-4 w-4" /> },
  { id: "result", label: "Results", icon: <FileText className="h-4 w-4" /> },
];

export function PermitRequirementFinder() {
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
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = stepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(steps[prevIndex].id);
    }
  };

  const reset = () => {
    setCurrentStep("state");
    setSelectedState("");
    setOperationType(null);
    setEquipmentClass(null);
    setVenueType(null);
  };

  const getResult = (): PermitResult | null => {
    if (!selectedState) return null;
    return stateData[selectedState] || null;
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case "state":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Which state will you be operating in?</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { key: "illinois", label: "Illinois" },
                { key: "massachusetts", label: "Massachusetts" },
                { key: "nevada", label: "Nevada" },
                { key: "new-york", label: "New York" },
                { key: "texas", label: "Texas" },
                { key: "washington", label: "Washington" },
              ].map((state) => (
                <Button
                  key={state.key}
                  variant={selectedState === state.key ? "default" : "outline"}
                  className="justify-start h-auto py-3"
                  onClick={() => setSelectedState(state.key)}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  {state.label}
                </Button>
              ))}
            </div>
          </div>
        );

      case "operation":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">What type of operation?</h3>
            <div className="space-y-2">
              {[
                { key: "single", label: "Single Event/Show", desc: "One-time laser show or event" },
                { key: "tour", label: "Tour/Multiple Dates", desc: "Traveling show across multiple venues" },
                { key: "temporary", label: "Temporary Installation", desc: "Short-term installation (days/weeks)" },
                { key: "permanent", label: "Permanent Installation", desc: "Fixed location installation" },
              ].map((op) => (
                <Button
                  key={op.key}
                  variant={operationType === op.key ? "default" : "outline"}
                  className="w-full justify-start h-auto py-3 flex-col items-start"
                  onClick={() => setOperationType(op.key as OperationType)}
                >
                  <span className="font-medium">{op.label}</span>
                  <span className="text-xs opacity-70">{op.desc}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case "equipment":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">What class of laser equipment?</h3>
            <div className="space-y-2">
              {[
                { key: "class1", label: "Class 1", desc: "Safe under normal use" },
                { key: "class2", label: "Class 2", desc: "Visible lasers, blink reflex protection" },
                { key: "class3r", label: "Class 3R", desc: "Low risk, normally safe" },
                { key: "class3b", label: "Class 3B", desc: "Direct viewing hazard" },
                { key: "class4", label: "Class 4", desc: "High power, fire and diffuse reflection hazard", warning: true },
              ].map((cls) => (
                <Button
                  key={cls.key}
                  variant={equipmentClass === cls.key ? "default" : "outline"}
                  className={`w-full justify-start h-auto py-3 flex-col items-start ${cls.warning ? "border-destructive/50" : ""}`}
                  onClick={() => setEquipmentClass(cls.key as EquipmentClass)}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{cls.label}</span>
                    {cls.warning && <AlertTriangle className="h-4 w-4 text-destructive" />}
                  </div>
                  <span className="text-xs opacity-70">{cls.desc}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case "venue":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">What type of venue?</h3>
            <div className="space-y-2">
              {[
                { key: "indoor", label: "Indoor Venue", desc: "Theater, arena, club, or enclosed space" },
                { key: "outdoor", label: "Outdoor Venue", desc: "Open air festival, outdoor stage" },
                { key: "mixed", label: "Mixed/Variable", desc: "Combination or changing venues" },
              ].map((venue) => (
                <Button
                  key={venue.key}
                  variant={venueType === venue.key ? "default" : "outline"}
                  className="w-full justify-start h-auto py-3 flex-col items-start"
                  onClick={() => setVenueType(venue.key as VenueType)}
                >
                  <span className="font-medium">{venue.label}</span>
                  <span className="text-xs opacity-70">{venue.desc}</span>
                </Button>
              ))}
            </div>
          </div>
        );

      case "result":
        const result = getResult();
        if (!result) return null;
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-green-500" />
              <h3 className="font-medium text-lg">Requirements Analysis Complete</h3>
            </div>

            <div className="grid gap-4">
              <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                <Badge variant={result.permitRequired ? "destructive" : "secondary"}>
                  {result.permitRequired ? "Permit Required" : "No Permit Required"}
                </Badge>
                <Badge variant={result.notificationRequired ? "default" : "outline"}>
                  {result.notificationRequired ? "Notification Required" : "No Notification"}
                </Badge>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Timeline
                </h4>
                <p className="text-sm text-muted-foreground">{result.timeline}</p>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium">Required Documents</h4>
                <ul className="space-y-1">
                  {result.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Special Requirements
                </h4>
                <ul className="space-y-1">
                  {result.specialRequirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-amber-500 mt-1">•</span>
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Regulatory Contacts
                </h4>
                {result.contacts.map((contact, idx) => (
                  <div key={idx} className="text-sm">
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-muted-foreground">{contact.phone}</p>
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
          <FileText className="h-5 w-5" />
          Permit Requirement Finder
        </CardTitle>
        <CardDescription>
          Answer a few questions to determine your permit requirements
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Step {stepIndex + 1} of {steps.length}</span>
            <span>{steps[stepIndex].label}</span>
          </div>
          <Progress value={progress}>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
          <div className="flex justify-between">
            {steps.map((step, idx) => (
              <div
                key={step.id}
                className={`flex flex-col items-center gap-1 ${
                  idx <= stepIndex ? "text-primary" : "text-muted-foreground"
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                    idx <= stepIndex ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {idx < stepIndex ? <CheckCircle2 className="h-3 w-3" /> : step.icon}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="min-h-[250px]">{renderStepContent()}</div>

        {/* Navigation */}
        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={currentStep === "state" ? reset : handleBack}
            disabled={currentStep === "result"}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            {currentStep === "state" ? "Reset" : "Back"}
          </Button>
          {currentStep !== "result" ? (
            <Button onClick={handleNext} disabled={!canProceed()}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={reset}>
              Start Over
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PermitRequirementFinder;
