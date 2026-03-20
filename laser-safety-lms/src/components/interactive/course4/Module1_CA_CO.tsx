"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  MapPin,
  FileText,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Flame,
  Stethoscope,
  Calendar,
  Phone,
  Download,
  Info,
  Shield,
  ExternalLink
} from "lucide-react";

// ============================================================================
// SECTION 1: CALIFORNIA DATA
// ============================================================================

interface CARequirement {
  category: string;
  requirement: string;
  details: string;
  priority: "critical" | "high" | "medium" | "low";
}

const californiaRequirements: CARequirement[] = [
  {
    category: "Local Fire Department",
    requirement: "Fire-Rescue Department Permit",
    details: "Special events permit required from local fire department (e.g., San Diego Fire-Rescue)",
    priority: "critical"
  },
  {
    category: "CDPH",
    requirement: "Written Notification",
    details: "Per FDA requirements. No notification required for laser shows per CDPH 7/1/2016",
    priority: "medium"
  },
  {
    category: "Advance Notice",
    requirement: "2 Weeks Minimum",
    details: "Submit permit application at least 2 weeks prior to event",
    priority: "critical"
  },
  {
    category: "Plans Required",
    requirement: "Site & Floor Plans",
    details: "Minimum 8.5\" x 11\", drawn to scale or dimensioned, showing exits and entrances",
    priority: "high"
  },
  {
    category: "Events Requiring Permit",
    requirement: "50+ Person Assembly",
    details: "Indoor assembly of 50+ people in non-assembly building, or outdoor fenced area",
    priority: "critical"
  },
  {
    category: "Inspection",
    requirement: "On-site Inspection",
    details: "May be required to verify conditions match permit specifications",
    priority: "high"
  }
];

const californiaEventTypes = [
  "Assembly of 50+ people (indoor non-assembly building)",
  "Outdoor assembly of 50+ people (fenced area)",
  "Amusement buildings",
  "Ballpark events with field occupancy",
  "Carnivals and fairs",
  "Casino nights",
  "Exhibits and trade shows",
  "Fire performers",
  "Fireworks, pyrotechnics or special effects",
  "Grad nights",
  "Haunted houses and Ghost walks",
  "Model rocket launch",
  "Open flame effects before proximate audience",
  "Sports Arena events with floor occupancy",
  "Stadium events with field occupancy",
  "Temporary membrane structures/tents >400 sq ft",
  "Vehicle displays within building or tent"
];

// ============================================================================
// SECTION 2: COLORADO DATA
// ============================================================================

interface COAgency {
  name: string;
  role: string;
  contact?: string;
  requirements: string[];
}

const coloradoAgencies: COAgency[] = [
  {
    name: "FDA / CDRH",
    role: "Federal Oversight",
    contact: "RadHealthCustomerService@fda.hhs.gov",
    requirements: [
      "Variance Application (Form 3147)",
      "Laser Light Show Product Reports (Form 3632)",
      "Annual Report (Form 3636) - Auto-renews variance",
      "Accident Occurrence Report (Form 3640) if needed"
    ]
  },
  {
    name: "FAA",
    role: "Airspace Safety",
    requirements: [
      "FAA Form 7140-1 for outdoor unterminated shows",
      "Submit to appropriate FAA Service Area",
      "Eastern: 9-ATO-ESA-OSG-Lasers-Searchlights@faa.gov",
      "Central: 9-ASW-Operations-Support-Lasers@faa.gov",
      "Western: 9-ATO-WSA-OSG-Lasers@faa.gov"
    ]
  },
  {
    name: "Colorado DPHE",
    role: "State Notification",
    contact: "Jennifer Opila, Radiation Program Manager - (303) 692-3403",
    requirements: [
      "Written notification as required by FDA",
      "No additional state-specific registration",
      "Advance notification recommended"
    ]
  }
];

// ============================================================================
// SECTION 3: COMPARISON DATA
// ============================================================================

interface ComparisonRow {
  feature: string;
  california: string;
  colorado: string;
  winner?: "ca" | "co" | "tie";
}

const comparisonData: ComparisonRow[] = [
  { feature: "Regulatory Approach", california: "Local Fire + CDPH", colorado: "Multi-agency (FDA/FAA/State)", winner: "tie" },
  { feature: "Primary Authority", california: "Local Fire Departments", colorado: "FDA CDRH (federal)", winner: "tie" },
  { feature: "State Registration", california: "No (per CDPH 2016)", colorado: "Notification only", winner: "tie" },
  { feature: "Advance Notice", california: "2 weeks (fire permit)", colorado: "As recommended", winner: "tie" },
  { feature: "Permit Required", california: "Yes (fire department)", colorado: "No state permit", winner: "co" },
  { feature: "Inspections", california: "At fire department discretion", colorado: "No routine inspections", winner: "co" },
  { feature: "Plans Required", california: "Yes - detailed site/floor plans", colorado: "SOP documentation only", winner: "co" },
  { feature: "Medical Devices", california: "CDPH Radiologic Health Branch", colorado: "Same as entertainment", winner: "tie" },
  { feature: "Complexity Level", california: "Moderate (local focus)", colorado: "High (federal coordination)", winner: "ca" }
];

// ============================================================================
// SECTION 4: WIZARD STATE
// ============================================================================

type WizardStep = "state" | "event" | "venue" | "requirements" | "summary";

interface WizardState {
  state: "ca" | "co" | null;
  eventType: string;
  venueType: "indoor" | "outdoor" | "mixed";
  audienceSize: "small" | "medium" | "large";
  hasLaserShow: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Module1_CA_CO() {
  const [activeTab, setActiveTab] = useState("overview");
  const [wizardStep, setWizardStep] = useState<WizardStep>("state");
  const [wizardData, setWizardData] = useState<WizardState>({
    state: null,
    eventType: "",
    venueType: "indoor",
    audienceSize: "small",
    hasLaserShow: true
  });

  // Wizard Navigation
  const wizardSteps: { id: WizardStep; label: string }[] = [
    { id: "state", label: "Select State" },
    { id: "event", label: "Event Type" },
    { id: "venue", label: "Venue Details" },
    { id: "requirements", label: "Requirements" },
    { id: "summary", label: "Summary" }
  ];

  const currentStepIndex = wizardSteps.findIndex(s => s.id === wizardStep);
  const wizardProgress = ((currentStepIndex + 1) / wizardSteps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < wizardSteps.length) {
      setWizardStep(wizardSteps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setWizardStep(wizardSteps[prevIndex].id);
    }
  };

  const resetWizard = () => {
    setWizardStep("state");
    setWizardData({
      state: null,
      eventType: "",
      venueType: "indoor",
      audienceSize: "small",
      hasLaserShow: true
    });
  };

  // Render Wizard Content
  const renderWizardContent = () => {
    switch (wizardStep) {
      case "state":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Which state will your event be in?</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={wizardData.state === "ca" ? "default" : "outline"}
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setWizardData({ ...wizardData, state: "ca" })}
              >
                <Flame className="h-6 w-6" />
                <span className="font-medium">California</span>
                <span className="text-xs opacity-70">Local Fire Dept + CDPH</span>
              </Button>
              <Button
                variant={wizardData.state === "co" ? "default" : "outline"}
                className="h-auto py-4 flex flex-col items-center gap-2"
                onClick={() => setWizardData({ ...wizardData, state: "co" })}
              >
                <Shield className="h-6 w-6" />
                <span className="font-medium">Colorado</span>
                <span className="text-xs opacity-70">FDA/FAA Multi-agency</span>
              </Button>
            </div>
          </div>
        );

      case "event":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">What type of event?</h3>
            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {californiaEventTypes.map((event) => (
                <Button
                  key={event}
                  variant={wizardData.eventType === event ? "default" : "outline"}
                  className="w-full justify-start h-auto py-2 text-left"
                  onClick={() => setWizardData({ ...wizardData, eventType: event })}
                >
                  {event}
                </Button>
              ))}
            </div>
          </div>
        );

      case "venue":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Venue Details</h3>
            
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Venue Type</label>
              <div className="grid grid-cols-3 gap-2">
                {["indoor", "outdoor", "mixed"].map((type) => (
                  <Button
                    key={type}
                    variant={wizardData.venueType === type ? "default" : "outline"}
                    onClick={() => setWizardData({ ...wizardData, venueType: type as any })}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Expected Audience Size</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={wizardData.audienceSize === "small" ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, audienceSize: "small" })}
                >
                  &lt; 50 people
                </Button>
                <Button
                  variant={wizardData.audienceSize === "medium" ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, audienceSize: "medium" })}
                >
                  50-200 people
                </Button>
                <Button
                  variant={wizardData.audienceSize === "large" ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, audienceSize: "large" })}
                >
                  200+ people
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Will you have a laser light show?</label>
              <div className="flex gap-2">
                <Button
                  variant={wizardData.hasLaserShow ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, hasLaserShow: true })}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  variant={!wizardData.hasLaserShow ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, hasLaserShow: false })}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        );

      case "requirements":
        const isCA = wizardData.state === "ca";
        const needsPermit = isCA && (wizardData.audienceSize !== "small" || wizardData.venueType === "outdoor");
        
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Your Requirements</h3>
            
            <div className="space-y-3">
              {isCA ? (
                <>
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Flame className="h-5 w-5 text-amber-600" />
                      <span className="font-medium text-amber-800">California Requirements</span>
                    </div>
                    {needsPermit && (
                      <div className="mt-2 text-sm text-amber-700">
                        <AlertTriangle className="h-4 w-4 inline mr-1" />
                        Fire Department Permit REQUIRED
                      </div>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Submit permit application 2 weeks before event</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Provide detailed site/floor plans</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Contact: San Diego Fire-Rescue (619) 533-4400</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Info className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">No CDPH notification required for laser shows</span>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-blue-600" />
                      <span className="font-medium text-blue-800">Colorado Requirements</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">FDA Variance (Form 3147) - REQUIRED</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">Product Report (Form 3632) - REQUIRED</span>
                    </div>
                    {wizardData.venueType !== "indoor" && (
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm">FAA Form 7140-1 (outdoor shows)</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span className="text-sm">State notification (as required by FDA)</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        );

      case "summary":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h3 className="font-medium text-lg">Requirements Summary</h3>
            </div>
            
            <div className="p-4 bg-muted rounded-lg space-y-2">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">State:</span>
                  <p className="font-medium">{wizardData.state === "ca" ? "California" : "Colorado"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Event:</span>
                  <p className="font-medium">{wizardData.eventType || "Not specified"}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Venue:</span>
                  <p className="font-medium">{wizardData.venueType}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Audience:</span>
                  <p className="font-medium">{wizardData.audienceSize}</p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-1" />
                Export Checklist
              </Button>
              <Button onClick={resetWizard} className="flex-1">
                Start Over
              </Button>
            </div>
          </div>
        );
    }
  };

  const canProceed = () => {
    switch (wizardStep) {
      case "state": return wizardData.state !== null;
      case "event": return wizardData.eventType !== "";
      case "venue": return true;
      case "requirements": return true;
      default: return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Module 4.1: California & Colorado</h1>
        <p className="text-muted-foreground">
          West Coast state regulations: California&apos;s local fire department system and Colorado&apos;s multi-agency approach
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="california">California</TabsTrigger>
          <TabsTrigger value="colorado">Colorado</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="wizard">Permit Wizard</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-500" />
                  <CardTitle>California</CardTitle>
                </div>
                <CardDescription>Local Fire Department + CDPH</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="secondary">Local Authority Model</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Fire-Rescue Department permits required</li>
                  <li>• 2 weeks advance notice</li>
                  <li>• Detailed site/floor plans needed</li>
                  <li>• No state laser show registration</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <CardTitle>Colorado</CardTitle>
                </div>
                <CardDescription>Multi-Agency Compliance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="secondary">Federal Coordination Model</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• FDA variance required</li>
                  <li>• FAA Form 7140 (outdoor)</li>
                  <li>• State notification only</li>
                  <li>• No routine inspections</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Differences at a Glance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">Local</p>
                  <p className="text-sm text-muted-foreground">CA: Fire Departments</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">Federal</p>
                  <p className="text-sm text-muted-foreground">CO: FDA/FAA Focus</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <p className="text-2xl font-bold text-green-600">No Permit</p>
                  <p className="text-sm text-muted-foreground">CO: Notification Only</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* CALIFORNIA TAB */}
        <TabsContent value="california" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-amber-500" />
                  <CardTitle>California Requirements</CardTitle>
                </div>
                <Badge>Local Fire Authority</Badge>
              </div>
              <CardDescription>
                California delegates laser show regulation to local fire departments. CDPH Radiologic Health Branch oversees medical devices.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {californiaRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className={`w-2 h-2 rounded-full mt-2 ${
                      req.priority === "critical" ? "bg-red-500" :
                      req.priority === "high" ? "bg-orange-500" :
                      req.priority === "medium" ? "bg-yellow-500" : "bg-blue-500"
                    }`} />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{req.category}</span>
                        <Badge variant={req.priority === "critical" ? "destructive" : "outline"} className="text-xs">
                          {req.priority}
                        </Badge>
                      </div>
                      <p className="text-sm font-medium">{req.requirement}</p>
                      <p className="text-sm text-muted-foreground">{req.details}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div className="space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Events Requiring Fire Permit
                </h4>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {californiaEventTypes.slice(0, 8).map((type, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      <span className="text-muted-foreground">{type}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  And 9 more event types. See full list in permit guidelines.
                </p>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">CDPH Update (July 1, 2016)</p>
                    <p className="text-sm text-amber-700">
                      Per Gonzalo L. Perez, Branch Chief: No notification required for laser shows to CDPH. 
                      Local fire department permits still apply.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COLORADO TAB */}
        <TabsContent value="colorado" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <CardTitle>Colorado Multi-Agency Compliance</CardTitle>
                </div>
                <Badge>Federal Coordination</Badge>
              </div>
              <CardDescription>
                Colorado requires coordination with multiple federal and state agencies. No separate state laser registration.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4">
                {coloradoAgencies.map((agency, idx) => (
                  <div key={idx} className="p-4 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-lg">{agency.name}</span>
                        <Badge variant="outline">{agency.role}</Badge>
                      </div>
                    </div>
                    
                    <div className="space-y-1">
                      {agency.requirements.map((req, ridx) => (
                        <div key={ridx} className="flex items-center gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                    
                    {agency.contact && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground pt-2 border-t">
                        <Phone className="h-4 w-4" />
                        <span>{agency.contact}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Required Forms Summary
                </h4>
                <ul className="mt-2 space-y-1 text-sm text-blue-700">
                  <li>• FDA Form 3147 - Variance Application</li>
                  <li>• FDA Form 3632 - Product Report</li>
                  <li>• FDA Form 3636 - Annual Report</li>
                  <li>• FAA Form 7140-1 - Outdoor Operations (if applicable)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* COMPARISON TAB */}
        <TabsContent value="comparison" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <ExternalLink className="h-5 w-5" />
                <CardTitle>Side-by-Side Comparison</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left font-medium">Feature</th>
                      <th className="px-4 py-3 text-left font-medium text-amber-700 bg-amber-50">California</th>
                      <th className="px-4 py-3 text-left font-medium text-blue-700 bg-blue-50">Colorado</th>
                      <th className="px-4 py-3 text-center font-medium">Advantage</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                        <td className="px-4 py-3 font-medium">{row.feature}</td>
                        <td className="px-4 py-3">{row.california}</td>
                        <td className="px-4 py-3">{row.colorado}</td>
                        <td className="px-4 py-3 text-center">
                          {row.winner && (
                            <Badge 
                              variant="outline" 
                              className={row.winner === "ca" ? "border-amber-500 text-amber-700" : 
                                        row.winner === "co" ? "border-blue-500 text-blue-700" : ""}
                            >
                              {row.winner === "ca" ? "CA" : row.winner === "co" ? "CO" : "Tie"}
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Choose California When:</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• You want local, predictable authority</li>
                    <li>• Single point of contact (fire dept)</li>
                    <li>• No federal variance complexity</li>
                    <li>• Clear permit pathway</li>
                  </ul>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Choose Colorado When:</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• You already have FDA variance</li>
                    <li>• No state permit required</li>
                    <li>• Minimal state oversight</li>
                    <li>• Federal compliance focus</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WIZARD TAB */}
        <TabsContent value="wizard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Permit Application Wizard
              </CardTitle>
              <CardDescription>
                Answer a few questions to determine your permit requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Step {currentStepIndex + 1} of {wizardSteps.length}</span>
                  <span>{wizardSteps[currentStepIndex].label}</span>
                </div>
                <Progress value={wizardProgress}>
                  <ProgressTrack>
                    <ProgressIndicator />
                  </ProgressTrack>
                </Progress>
                <div className="flex justify-between">
                  {wizardSteps.map((step, idx) => (
                    <div
                      key={step.id}
                      className={`flex flex-col items-center gap-1 ${
                        idx <= currentStepIndex ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                          idx <= currentStepIndex ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                      >
                        {idx < currentStepIndex ? <CheckCircle2 className="h-3 w-3" /> : idx + 1}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step Content */}
              <div className="min-h-[300px]">{renderWizardContent()}</div>

              {/* Navigation */}
              <div className="flex justify-between pt-4 border-t">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={wizardStep === "state"}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
                {wizardStep !== "summary" ? (
                  <Button onClick={handleNext} disabled={!canProceed()}>
                    Next
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={resetWizard}>
                    Start Over
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Module1_CA_CO;
