"use client";

import React, { useState, useMemo } from "react";
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
  Calendar,
  Phone,
  Download,
  Info,
  Search,
  Clock,
  Shield,
  ExternalLink,
  UserCheck,
  Users
} from "lucide-react";

// ============================================================================
// SECTION 1: FLORIDA DATA
// ============================================================================

interface FLRequirement {
  category: string;
  requirement: string;
  details: string;
  icon: React.ReactNode;
}

const floridaRequirements: FLRequirement[] = [
  {
    category: "Registration",
    requirement: "Mandatory State Registration",
    details: "All laser devices (except exempted) must be registered with Florida Dept. of Health",
    icon: <FileText className="h-5 w-5" />
  },
  {
    category: "Timing",
    requirement: "30 Days After Acquisition",
    details: "Registration must be submitted within 30 days after acquiring laser device",
    icon: <Clock className="h-5 w-5" />
  },
  {
    category: "Out-of-State",
    requirement: "20 Days Advance Notice",
    details: "Written notice minimum 20 days prior to bringing laser into Florida",
    icon: <MapPin className="h-5 w-5" />
  },
  {
    category: "LSO",
    requirement: "Laser Safety Officer Required",
    details: "LSO must be designated and listed on registration form",
    icon: <UserCheck className="h-5 w-5" />
  },
  {
    category: "Fees",
    requirement: "No Registration Fee",
    details: "One-time registration with no fee required",
    icon: <CheckCircle2 className="h-5 w-5" />
  },
  {
    category: "Frequency",
    requirement: "One-Time Registration",
    details: "Registration is one-time; notify department of changes/disposals",
    icon: <Calendar className="h-5 w-5" />
  }
];

const floridaLaserClasses = [
  { class: "Class I", power: "< 0.005W", registration: "Exempt", examples: "CD players, laser printers" },
  { class: "Class II", power: "< 1 mW", registration: "Exempt", examples: "Barcode scanners, pointers" },
  { class: "Class IIIa", power: "1-5 mW", registration: "Exempt", examples: "Laser pointers" },
  { class: "Class IIIb", power: "5-500 mW", registration: "REQUIRED", examples: "Small laser light shows, surveying" },
  { class: "Class IV", power: "> 500 mW", registration: "REQUIRED", examples: "Medical surgery, entertainment shows" }
];

// ============================================================================
// SECTION 2: GEORGIA DATA
// ============================================================================

interface GARequirement {
  title: string;
  description: string;
  type: "federal" | "faa" | "record";
}

const georgiaRequirements: GARequirement[] = [
  {
    title: "FDA Variance",
    description: "License to perform laser light shows - submit to FDA Division of Docket Management",
    type: "federal"
  },
  {
    title: "Product Reports",
    description: "Certify laser shows/projectors compliance - email to RadHealthCustomerService@fda.hhs.gov",
    type: "federal"
  },
  {
    title: "Annual Report",
    description: "Report all laser activity July 1 to June 30 - auto-renews basic variance",
    type: "federal"
  },
  {
    title: "Accident Report",
    description: "Report accidents/incidents to FDA via same email",
    type: "federal"
  },
  {
    title: "FAA Form 7140-1",
    description: "Required for outdoor unterminated laser shows - submit to FAA Service Area",
    type: "faa"
  },
  {
    title: "Standard Operating Procedures",
    description: "Description of how laser shows are performed safely",
    type: "record"
  },
  {
    title: "Quality Control Safety Checklist",
    description: "Completed at time of laser activity",
    type: "record"
  },
  {
    title: "Health and Safety Report",
    description: "Risk assessment with show info, diagrams, proof of training, insurance",
    type: "record"
  }
];

const georgiaFAAServiceAreas = [
  { region: "Eastern", email: "9-ATO-ESA-OSG-Lasers-Searchlights@faa.gov", states: "ME, NH, VT, MA, RI, CT, NY, NJ, PA, DE, MD, DC, VA, WV, NC, SC, GA, FL, PR, VI" },
  { region: "Central", email: "9-ASW-Operations-Support-Lasers@faa.gov", states: "OH, KY, TN, AL, MS, IN, IL, MI, WI, MN, IA, MO, AR, LA, TX, OK, KS, NE, SD, ND" },
  { region: "Western", email: "9-ATO-WSA-OSG-Lasers@faa.gov", states: "WA, OR, CA, NV, AZ, NM, ID, MT, WY, UT, CO, AK, HI" }
];

// ============================================================================
// SECTION 3: COMPARISON DATA
// ============================================================================

interface ComparisonRow {
  feature: string;
  florida: string;
  georgia: string;
  note?: string;
}

const comparisonData: ComparisonRow[] = [
  { feature: "State Registration", florida: "Required (IIIb & IV)", georgia: "None", note: "FL requires state-level registration" },
  { feature: "Registration Fee", florida: "No fee", georgia: "N/A", note: "FL is free" },
  { feature: "Advance Notice (Out-of-State)", florida: "20 days", georgia: "Not specified", note: "FL has specific timeline" },
  { feature: "LSO Required", florida: "Yes - listed on form", georgia: "Implied by federal", note: "FL explicitly requires" },
  { feature: "Inspections", florida: "At state discretion", georgia: "None specified", note: "FL may inspect" },
  { feature: "FDA Variance", florida: "Implied", georgia: "Required", note: "GA relies on federal" },
  { feature: "Approach", florida: "Comprehensive State", georgia: "Federal Deference", note: "Different philosophies" },
  { feature: "Record Keeping", florida: "Per registration changes", georgia: "SOPs, checklists, risk assessment", note: "GA emphasizes documentation" }
];

// ============================================================================
// SECTION 4: PERMIT FINDER WIZARD
// ============================================================================

type FinderStep = "location" | "equipment" | "timeline" | "results";

interface FinderState {
  isResident: boolean | null;
  laserClass: "3b" | "4" | null;
  hasFDAVariance: boolean;
  needsOutdoor: boolean;
  timelineWeeks: number;
}

// ============================================================================
// TIMELINE CALCULATOR DATA
// ============================================================================

interface TimelineEvent {
  days: number;
  event: string;
  description: string;
  critical: boolean;
}

const floridaTimeline: TimelineEvent[] = [
  { days: -20, event: "Out-of-State Notice Due", description: "Submit written notice to Bureau of Radiation Control", critical: true },
  { days: -7, event: "Registration Form Preparation", description: "Gather equipment specs, LSO documentation", critical: false },
  { days: 0, event: "Event/Operation Date", description: "Laser show/operation proceeds", critical: false },
  { days: 30, event: "Registration Deadline (if new)", description: "Must register within 30 days of acquisition", critical: true }
];

const georgiaTimeline: TimelineEvent[] = [
  { days: -60, event: "FDA Variance Application", description: "Submit Form 3147 to FDA (if no variance)", critical: true },
  { days: -30, event: "Product Report Submission", description: "Submit Form 3632 for equipment", critical: true },
  { days: -14, event: "FAA Notification (if outdoor)", description: "Submit Form 7140-1 to FAA Service Area", critical: true },
  { days: 0, event: "Event/Operation Date", description: "Ensure all documentation onsite", critical: false },
  { days: 365, event: "Annual Report Due", description: "Submit Form 3636 to maintain variance", critical: true }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Module2_FL_GA() {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Permit Finder State
  const [finderStep, setFinderStep] = useState<FinderStep>("location");
  const [finderData, setFinderData] = useState<FinderState>({
    isResident: null,
    laserClass: null,
    hasFDAVariance: false,
    needsOutdoor: false,
    timelineWeeks: 4
  });

  // Timeline Calculator State
  const [selectedState, setSelectedState] = useState<"florida" | "georgia">("florida");
  const [eventDate, setEventDate] = useState("");

  // Permit Finder Navigation
  const finderSteps: { id: FinderStep; label: string }[] = [
    { id: "location", label: "Location" },
    { id: "equipment", label: "Equipment" },
    { id: "timeline", label: "Timeline" },
    { id: "results", label: "Results" }
  ];

  const currentStepIndex = finderSteps.findIndex(s => s.id === finderStep);
  const finderProgress = ((currentStepIndex + 1) / finderSteps.length) * 100;

  const handleNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < finderSteps.length) {
      setFinderStep(finderSteps[nextIndex].id);
    }
  };

  const handleBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setFinderStep(finderSteps[prevIndex].id);
    }
  };

  const resetFinder = () => {
    setFinderStep("location");
    setFinderData({
      isResident: null,
      laserClass: null,
      hasFDAVariance: false,
      needsOutdoor: false,
      timelineWeeks: 4
    });
  };

  // Timeline Calculator
  const calculatedDates = useMemo(() => {
    if (!eventDate) return [];
    const baseDate = new Date(eventDate);
    const timeline = selectedState === "florida" ? floridaTimeline : georgiaTimeline;
    
    return timeline.map(event => {
      const date = new Date(baseDate);
      date.setDate(date.getDate() + event.days);
      return {
        ...event,
        date: date.toISOString().split("T")[0],
        daysUntil: Math.ceil((date.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
      };
    });
  }, [eventDate, selectedState]);

  // Render Finder Content
  const renderFinderContent = () => {
    switch (finderStep) {
      case "location":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Are you a Florida resident/company?</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={finderData.isResident === true ? "default" : "outline"}
                className="h-auto py-6"
                onClick={() => setFinderData({ ...finderData, isResident: true })}
              >
                <div className="text-center">
                  <p className="font-medium">Yes, Florida Resident</p>
                  <p className="text-xs opacity-70">Register within 30 days of acquisition</p>
                </div>
              </Button>
              <Button
                variant={finderData.isResident === false ? "default" : "outline"}
                className="h-auto py-6"
                onClick={() => setFinderData({ ...finderData, isResident: false })}
              >
                <div className="text-center">
                  <p className="font-medium">Out-of-State</p>
                  <p className="text-xs opacity-70">20 days advance notice required</p>
                </div>
              </Button>
            </div>
            
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Info className="h-4 w-4" />
                Georgia Note
              </h4>
              <p className="text-sm text-muted-foreground">
                Georgia defers to federal regulations. No state-specific registration required.
                Proceed with federal (FDA/FAA) requirements.
              </p>
            </div>
          </div>
        );

      case "equipment":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">What class of laser equipment?</h3>
            <div className="space-y-2">
              {floridaLaserClasses.map((laser) => (
                <Button
                  key={laser.class}
                  variant={finderData.laserClass === (laser.class.includes("IIIb") ? "3b" : laser.class.includes("IV") ? "4" : null) ? "default" : "outline"}
                  className="w-full justify-start h-auto py-3"
                  onClick={() => {
                    const classVal = laser.class.includes("IIIb") ? "3b" : laser.class.includes("IV") ? "4" : null;
                    if (classVal) setFinderData({ ...finderData, laserClass: classVal });
                  }}
                  disabled={!laser.class.includes("III") && !laser.class.includes("IV")}
                >
                  <div className="flex-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{laser.class}</span>
                      <Badge variant={laser.registration === "REQUIRED" ? "destructive" : "secondary"}>
                        {laser.registration}
                      </Badge>
                    </div>
                    <p className="text-xs opacity-70">{laser.power} — {laser.examples}</p>
                  </div>
                </Button>
              ))}
            </div>

            <div className="space-y-2 pt-4 border-t">
              <label className="text-sm font-medium">Do you have an FDA variance?</label>
              <div className="flex gap-2">
                <Button
                  variant={finderData.hasFDAVariance ? "default" : "outline"}
                  onClick={() => setFinderData({ ...finderData, hasFDAVariance: true })}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  variant={!finderData.hasFDAVariance ? "default" : "outline"}
                  onClick={() => setFinderData({ ...finderData, hasFDAVariance: false })}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Will this be an outdoor show?</label>
              <div className="flex gap-2">
                <Button
                  variant={finderData.needsOutdoor ? "default" : "outline"}
                  onClick={() => setFinderData({ ...finderData, needsOutdoor: true })}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  variant={!finderData.needsOutdoor ? "default" : "outline"}
                  onClick={() => setFinderData({ ...finderData, needsOutdoor: false })}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">How soon is your event?</h3>
            <div className="grid grid-cols-3 gap-2">
              <Button
                variant={finderData.timelineWeeks === 2 ? "default" : "outline"}
                onClick={() => setFinderData({ ...finderData, timelineWeeks: 2 })}
              >
                &lt; 2 weeks
              </Button>
              <Button
                variant={finderData.timelineWeeks === 4 ? "default" : "outline"}
                onClick={() => setFinderData({ ...finderData, timelineWeeks: 4 })}
              >
                2-4 weeks
              </Button>
              <Button
                variant={finderData.timelineWeeks === 8 ? "default" : "outline"}
                onClick={() => setFinderData({ ...finderData, timelineWeeks: 8 })}
              >
                4+ weeks
              </Button>
            </div>

            {finderData.timelineWeeks === 2 && finderData.isResident === false && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Timeline Warning</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  Florida requires 20 days advance notice for out-of-state operators. 
                  You may need to reschedule or contact the Bureau of Radiation Control immediately.
                </p>
              </div>
            )}

            {!finderData.hasFDAVariance && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5 text-amber-600" />
                  <span className="font-medium text-amber-800">FDA Variance Required</span>
                </div>
                <p className="text-sm text-amber-700 mt-1">
                  You will need to apply for an FDA variance (Form 3147). This process typically takes 60+ days.
                </p>
              </div>
            )}
          </div>
        );

      case "results":
        const isCompliant = finderData.isResident !== null && finderData.laserClass && 
          (finderData.isResident || finderData.timelineWeeks >= 3);
        
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className={`h-6 w-6 ${isCompliant ? "text-green-500" : "text-amber-500"}`} />
              <h3 className="font-medium text-lg">Permit Requirements Results</h3>
            </div>

            <div className="space-y-3">
              {finderData.isResident !== null && (
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Florida Registration</span>
                    <Badge variant={finderData.laserClass ? "default" : "destructive"}>
                      {finderData.laserClass ? "Required" : "Select Laser Class"}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {finderData.isResident 
                      ? "Register within 30 days of acquisition" 
                      : "20 days advance notice required"}
                  </p>
                </div>
              )}

              {!finderData.hasFDAVariance && (
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">FDA Variance</span>
                    <Badge variant="destructive">Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Apply using Form 3147 - allow 60+ days
                  </p>
                </div>
              )}

              {finderData.needsOutdoor && (
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">FAA Notification</span>
                    <Badge>Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Submit Form 7140-1 to appropriate FAA Service Area
                  </p>
                </div>
              )}

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">LSO Designation</span>
                  <Badge>Required</Badge>
                </div>
                <p className="text-sm text-muted-foreground">
                  Must be listed on registration form
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-1" />
                Export Checklist
              </Button>
              <Button onClick={resetFinder} className="flex-1">
                Start Over
              </Button>
            </div>
          </div>
        );
    }
  };

  const canProceed = () => {
    switch (finderStep) {
      case "location": return finderData.isResident !== null;
      case "equipment": return finderData.laserClass !== null;
      case "timeline": return true;
      default: return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Module 4.2: Florida & Georgia</h1>
        <p className="text-muted-foreground">
          Southeast state regulations: Florida&apos;s comprehensive registration system vs Georgia&apos;s federal deference approach
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="florida">Florida</TabsTrigger>
          <TabsTrigger value="georgia">Georgia</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="tools">Tools</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <CardTitle>Florida</CardTitle>
                </div>
                <CardDescription>Bureau of Radiation Control</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="secondary">Comprehensive State Registration</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Mandatory state registration (IIIb & IV)</li>
                  <li>• 20 days advance notice (out-of-state)</li>
                  <li>• No registration fee</li>
                  <li>• LSO must be designated</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <CardTitle>Georgia</CardTitle>
                </div>
                <CardDescription>Federal Deference Model</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="secondary">No State-Specific Registration</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Defers to FDA/FAA regulations</li>
                  <li>• FDA variance required</li>
                  <li>• FAA Form 7140 for outdoor</li>
                  <li>• Comprehensive record keeping</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Regulatory Differences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-2xl font-bold text-blue-600">20 Days</p>
                  <p className="text-sm text-muted-foreground">FL Advance Notice</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-2xl font-bold text-green-600">$0</p>
                  <p className="text-sm text-muted-foreground">FL Registration Fee</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <p className="text-2xl font-bold text-amber-600">FDA</p>
                  <p className="text-sm text-muted-foreground">GA Primary Authority</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <p className="text-2xl font-bold text-purple-600">IIIb+</p>
                  <p className="text-sm text-muted-foreground">FL Registration Trigger</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* FLORIDA TAB */}
        <TabsContent value="florida" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <CardTitle>Florida Registration System</CardTitle>
                </div>
                <Badge>Chapter 64E-4</Badge>
              </div>
              <CardDescription>
                Florida requires registration of Class IIIb and IV laser devices with the Bureau of Radiation Control
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {floridaRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                    <div className="text-blue-500">{req.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{req.requirement}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{req.details}</p>
                      <Badge variant="outline" className="mt-1">{req.category}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Laser Class Registration Requirements</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-2 text-left">Class</th>
                        <th className="px-4 py-2 text-left">Power</th>
                        <th className="px-4 py-2 text-left">Registration</th>
                        <th className="px-4 py-2 text-left">Examples</th>
                      </tr>
                    </thead>
                    <tbody>
                      {floridaLaserClasses.map((laser, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                          <td className="px-4 py-2 font-medium">{laser.class}</td>
                          <td className="px-4 py-2">{laser.power}</td>
                          <td className="px-4 py-2">
                            <Badge variant={laser.registration === "REQUIRED" ? "destructive" : "secondary"}>
                              {laser.registration}
                            </Badge>
                          </td>
                          <td className="px-4 py-2 text-muted-foreground">{laser.examples}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Contact Information</p>
                    <p className="text-sm text-blue-700">
                      Bureau of Radiation Control<br />
                      4052 Bald Cypress Way, Bin #C21<br />
                      Tallahassee, FL 32399-1741<br />
                      Phone: (850) 245-4266<br />
                      Email: James.Futch@Flhealth.gov
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* GEORGIA TAB */}
        <TabsContent value="georgia" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <CardTitle>Georgia Federal Deference</CardTitle>
                </div>
                <Badge>No State Registration</Badge>
              </div>
              <CardDescription>
                Georgia defers to federal regulations. No separate state-specific laser registration required.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {georgiaRequirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-3 p-3 border rounded-lg">
                    <Badge variant={req.type === "federal" ? "default" : req.type === "faa" ? "secondary" : "outline"}>
                      {req.type.toUpperCase()}
                    </Badge>
                    <div className="flex-1">
                      <p className="font-medium">{req.title}</p>
                      <p className="text-sm text-muted-foreground">{req.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">FAA Service Area Contacts</h4>
                <div className="space-y-2">
                  {georgiaFAAServiceAreas.map((area, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{area.region} Service Area</span>
                        <Badge variant="outline">{area.region}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{area.email}</p>
                      <p className="text-xs text-muted-foreground">States: {area.states}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-green-800">Key Point</p>
                    <p className="text-sm text-green-700">
                      Georgia follows federal guidelines with no additional state-specific requirements. 
                      Focus on FDA variance compliance and FAA notifications for outdoor shows.
                    </p>
                  </div>
                </div>
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
                <CardTitle>Florida vs Georgia Comparison</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left font-medium">Feature</th>
                      <th className="px-4 py-3 text-left font-medium text-blue-700 bg-blue-50">Florida</th>
                      <th className="px-4 py-3 text-left font-medium text-green-700 bg-green-50">Georgia</th>
                      <th className="px-4 py-3 text-left font-medium">Note</th>
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                        <td className="px-4 py-3 font-medium">{row.feature}</td>
                        <td className="px-4 py-3">{row.florida}</td>
                        <td className="px-4 py-3">{row.georgia}</td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Florida Approach</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Comprehensive state oversight</li>
                    <li>• Clear registration pathway</li>
                    <li>• No fees</li>
                    <li>• Specific timelines</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Georgia Approach</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Minimal state bureaucracy</li>
                    <li>• Federal compliance focus</li>
                    <li>• No state registration</li>
                    <li>• Documentation emphasis</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TOOLS TAB */}
        <TabsContent value="tools" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            {/* Permit Finder */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="h-5 w-5" />
                  Permit Finder Wizard
                </CardTitle>
                <CardDescription>Find your permit requirements</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Progress value={finderProgress}>
                  <ProgressTrack>
                    <ProgressIndicator />
                  </ProgressTrack>
                </Progress>
                
                <div className="min-h-[250px]">{renderFinderContent()}</div>

                <div className="flex justify-between pt-4 border-t">
                  <Button variant="outline" onClick={handleBack} disabled={finderStep === "location"}>
                    <ChevronLeft className="h-4 w-4 mr-1" /> Back
                  </Button>
                  {finderStep !== "results" ? (
                    <Button onClick={handleNext} disabled={!canProceed()}>
                      Next <ChevronRight className="h-4 w-4 ml-1" />
                    </Button>
                  ) : (
                    <Button onClick={resetFinder}>Start Over</Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Timeline Calculator */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Timeline Calculator
                </CardTitle>
                <CardDescription>Calculate key deadlines</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Button
                    variant={selectedState === "florida" ? "default" : "outline"}
                    onClick={() => setSelectedState("florida")}
                    className="flex-1"
                  >
                    Florida
                  </Button>
                  <Button
                    variant={selectedState === "georgia" ? "default" : "outline"}
                    onClick={() => setSelectedState("georgia")}
                    className="flex-1"
                  >
                    Georgia
                  </Button>
                </div>

                <div className="space-y-2">
                  <label className="text-sm text-muted-foreground">Event Date</label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded-md text-sm"
                  />
                </div>

                {calculatedDates.length > 0 ? (
                  <div className="space-y-2 max-h-[200px] overflow-y-auto">
                    {calculatedDates.map((event, idx) => (
                      <div key={idx} className={`p-2 rounded-lg text-sm ${
                        event.critical ? "bg-red-50 border border-red-200" : "bg-muted"
                      }`}>
                        <div className="flex items-center justify-between">
                          <span className="font-medium">{event.event}</span>
                          {event.critical && <Badge variant="destructive">Critical</Badge>}
                        </div>
                        <p className="text-xs text-muted-foreground">{event.date}</p>
                        <p className="text-xs">{event.description}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    <Calendar className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    Select an event date to see deadlines
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Module2_FL_GA;
