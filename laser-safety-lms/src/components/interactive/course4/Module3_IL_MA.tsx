"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  CheckCircle2,
  AlertTriangle,
  Users,
  FileText,
  Phone,
  GraduationCap,
  Scale,
  Shield,
  Clock,
  Info,
  Download,
  ChevronDown,
  ChevronUp
} from "lucide-react";

// ============================================================================
// SECTION 1: ILLINOIS DATA
// ============================================================================

interface ILRequirement {
  category: string;
  title: string;
  details: string;
  citation: string;
}

const illinoisRequirements: ILRequirement[] = [
  {
    category: "Registration",
    title: "Installation Registration",
    details: "Register before placing installation in operation. One-time requirement.",
    citation: "32 Ill. Adm. Code 315.60(a)"
  },
  {
    category: "Registration",
    title: "Annual System Registration",
    details: "Register laser systems annually with manufacturer, model, serial, power, wavelength, class.",
    citation: "32 Ill. Adm. Code 315.60(b)"
  },
  {
    category: "Notification",
    title: "10 Working Days Notice",
    details: "Written notice required before bringing Class 3b or 4 laser into Illinois for temporary use.",
    citation: "32 Ill. Adm. Code 315.80(a)(2)"
  },
  {
    category: "LSO",
    title: "Laser Safety Officer Required",
    details: "Must designate LSO with specific qualifications in 9 areas.",
    citation: "32 Ill. Adm. Code 315.90"
  },
  {
    category: "Inspection",
    title: "Pre-operational Inspection",
    details: "May be required within 24 hours prior to use for out-of-state lasers.",
    citation: "32 Ill. Adm. Code 315.80(b)"
  },
  {
    category: "Records",
    title: "5-Year Record Retention",
    details: "Keep authorized operators list, eyewear inspections, calibration results, incident reports.",
    citation: "32 Ill. Adm. Code 315.170"
  }
];

const illinoisLSOQualifications = [
  { id: 1, area: "Fundamentals of laser operation", required: true },
  { id: 2, area: "Familiarity with equipment type utilized", required: true },
  { id: 3, area: "Biological effects on eye and skin", required: true },
  { id: 4, area: "Laser and laser system classification", required: true },
  { id: 5, area: "Control measures", required: true },
  { id: 6, area: "Nonradiation hazards", required: true },
  { id: 7, area: "Medical surveillance practices (if applicable)", required: false },
  { id: 8, area: "Laser terminology", required: true },
  { id: 9, area: "Maximum Permissible Exposure (MPE) levels", required: true }
];

const illinoisEntertainmentRequirements = [
  "Notify Department at least 10 working days in advance",
  "Include: registrant, LSO, and show manager contact info",
  "Provide: location, time, date of show",
  "Submit: FDA variance documentation (21 CFR 1040.11)",
  "Provide: FAA notification copy for outdoor performances",
  "List: manufacturer, class, wavelength, output power",
  "Submit: sketches showing laser locations, beam paths, reflective surfaces"
];

// ============================================================================
// SECTION 2: MASSACHUSETTS DATA
// ============================================================================

interface MARequirement {
  category: string;
  title: string;
  details: string;
  citation: string;
  penalty?: string;
}

const massachusettsRequirements: MARequirement[] = [
  {
    category: "Registration",
    title: "Certificate of Registration",
    details: "Must obtain valid certificate before operating laser facility. Post conspicuously.",
    citation: "105 CMR 121.015-121.016"
  },
  {
    category: "Notification",
    title: "10 Working Days Notice (Out-of-State)",
    details: "Written notice before bringing Class 3B or 4 laser into Commonwealth.",
    citation: "105 CMR 121.022"
  },
  {
    category: "Entertainment",
    title: "10 Days Before Performance",
    details: "Provide show details, sketches, FDA variance, FAA notification within 10 days of first performance.",
    citation: "105 CMR 121.023"
  },
  {
    category: "LSO",
    title: "Laser Safety Officer Designation",
    details: "Must designate LSO. Facility owner/operator ensures ANSI Z136.1 compliance.",
    citation: "105 CMR 121.005, 121.014"
  },
  {
    category: "Standards",
    title: "ANSI Z136.1, Z136.2, Z136.3",
    details: "Must comply with most recent published versions of ANSI standards.",
    citation: "105 CMR 121.005-121.007"
  },
  {
    category: "Inspection",
    title: "Routine Inspections",
    details: "Registrant shall afford opportunity to inspect at all reasonable times.",
    citation: "105 CMR 121.024"
  }
];

const massachusettsPenalties = [
  { violation: "Civil Penalty (per violation)", amount: "Up to $500", note: "Whether or not willful" },
  { violation: "Certificate Suspension", amount: "Immediate", note: "If public health/safety threatened" },
  { violation: "Certificate Revocation", amount: "Permanent", note: "After hearing process" },
  { violation: "Cease and Desist Order", amount: "Immediate", note: "Emergency situations" }
];

const massachusettsWaiverFactors = [
  "Compliance would cause undue hardship",
  "Facility is in substantial compliance with spirit of requirement",
  "Compliance does not jeopardize health or safety",
  "Written documentation supporting request required"
];

// ============================================================================
// SECTION 3: LSO COMPARISON
// ============================================================================

interface LSOComparison {
  aspect: string;
  illinois: string;
  massachusetts: string;
}

const lsoComparisonData: LSOComparison[] = [
  { aspect: "Qualification Areas", illinois: "9 specific areas defined", massachusetts: "ANSI Z136.1 based" },
  { aspect: "Designation", illinois: "Required on registration form", massachusetts: "Required in application" },
  { aspect: "Authority", illinois: "Authority to establish safety program", massachusetts: "Authority to implement ANSI standards" },
  { aspect: "Training", illinois: "Initial and annual in-service", massachusetts: "Per ANSI requirements" },
  { aspect: "Duties", illinois: "5 specific duties listed", massachusetts: "General ANSI compliance" },
  { aspect: "Eyewear Inspection", illinois: "Every 6 months", massachusetts: "Per ANSI Z136.1" }
];

// ============================================================================
// SECTION 4: PENALTY COMPARISON
// ============================================================================

const penaltyComparisonData = [
  { aspect: "Maximum Civil Penalty", illinois: "Not specified in Part 315", massachusetts: "$500 per violation" },
  { aspect: "Willful vs. Unintentional", illinois: "Case by case", massachusetts: "Applies whether willful or not" },
  { aspect: "Suspension", illinois: "Implied", massachusetts: "Immediate if health/safety threatened" },
  { aspect: "Hearing Process", illinois: "Not specified", massachusetts: "801 CMR 1.01 et seq." },
  { aspect: "Factors Considered", illinois: "Not specified", massachusetts: "10 specific factors listed" },
  { aspect: "Waiver Available", illinois: "Not specified", massachusetts: "Yes - undue hardship provision" }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Module3_IL_MA() {
  const [activeTab, setActiveTab] = useState("overview");
  const [expandedLSO, setExpandedLSO] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<"illinois" | "massachusetts">("illinois");

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Module 4.3: Illinois & Massachusetts</h1>
        <p className="text-muted-foreground">
          Midwest and Northeast comprehensive programs: IEMA requirements vs Massachusetts DPH regulations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="illinois">Illinois</TabsTrigger>
          <TabsTrigger value="massachusetts">Massachusetts</TabsTrigger>
          <TabsTrigger value="lso">LSO Comparison</TabsTrigger>
          <TabsTrigger value="penalties">Penalties</TabsTrigger>
          <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
        </TabsList>

        {/* OVERVIEW TAB */}
        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <CardTitle>Illinois</CardTitle>
                </div>
                <CardDescription>IEMA - 32 Ill. Adm. Code 315</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="secondary">Comprehensive State Regulation</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Installation + annual registration</li>
                  <li>• 10 working days advance notice</li>
                  <li>• 9-area LSO qualification</li>
                  <li>• 5-year record retention</li>
                  <li>• Pre-operational inspections</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <CardTitle>Massachusetts</CardTitle>
                </div>
                <CardDescription>DPH - 105 CMR 121.000</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <Badge variant="secondary">ANSI-Based Program</Badge>
                <ul className="text-sm space-y-1 text-muted-foreground">
                  <li>• Certificate of Registration</li>
                  <li>• 10-15 days advance notice</li>
                  <li>• ANSI Z136.1/2/3 compliance</li>
                  <li>• $500/violation penalty</li>
                  <li>• Waiver provisions</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Key Similarities & Differences</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Similarities</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Both require LSO designation</li>
                    <li>• 10 working days notice for out-of-state</li>
                    <li>• Class 3B and 4 registration</li>
                    <li>• ANSI Z136.1 incorporated</li>
                    <li>• Entertainment show notifications</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg">
                  <h4 className="font-medium text-amber-800 mb-2">Differences</h4>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• IL: Specific 9-area LSO qualifications</li>
                    <li>• MA: General ANSI-based LSO requirements</li>
                    <li>• MA: Defined civil penalties ($500)</li>
                    <li>• IL: 5-year record retention specified</li>
                    <li>• MA: Waiver provisions available</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ILLINOIS TAB */}
        <TabsContent value="illinois" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-blue-500" />
                  <CardTitle>Illinois IEMA Requirements</CardTitle>
                </div>
                <Badge>32 Ill. Adm. Code 315</Badge>
              </div>
              <CardDescription>
                Illinois Emergency Management Agency - Standards for Protection Against Laser Radiation
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {illinoisRequirements.map((req, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge>{req.category}</Badge>
                        <span className="font-medium">{req.title}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{req.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{req.citation}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  LSO 9 Qualification Areas
                </h4>
                <div className="space-y-2">
                  {illinoisLSOQualifications.map((qual) => (
                    <div key={qual.id} className="flex items-center gap-2">
                      <CheckCircle2 className={`h-4 w-4 ${qual.required ? "text-green-500" : "text-amber-500"}`} />
                      <span className="text-sm">{qual.area}</span>
                      {!qual.required && <Badge variant="outline" className="text-xs">If applicable</Badge>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">Contact Information</p>
                    <p className="text-sm text-blue-700">
                      Illinois Emergency Management Agency<br />
                      Division of Nuclear Safety<br />
                      1035 Outer Park Drive<br />
                      Springfield, IL 62704<br />
                      Phone: (217) 785-9975<br />
                      Email: don.agnew@illinois.gov
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* MASSACHUSETTS TAB */}
        <TabsContent value="massachusetts" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-500" />
                  <CardTitle>Massachusetts DPH Requirements</CardTitle>
                </div>
                <Badge>105 CMR 121.000</Badge>
              </div>
              <CardDescription>
                Massachusetts Department of Public Health - Regulations for the Control of Lasers
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                {massachusettsRequirements.map((req, idx) => (
                  <div key={idx} className="p-3 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{req.category}</Badge>
                        <span className="font-medium">{req.title}</span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{req.details}</p>
                    <p className="text-xs text-muted-foreground mt-1">{req.citation}</p>
                  </div>
                ))}
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3 flex items-center gap-2">
                  <Scale className="h-4 w-4" />
                  Civil Penalties
                </h4>
                <div className="space-y-2">
                  {massachusettsPenalties.map((penalty, idx) => (
                    <div key={idx} className="flex items-center justify-between p-2 bg-red-50 rounded-lg">
                      <div>
                        <span className="font-medium text-red-800">{penalty.violation}</span>
                        <p className="text-xs text-red-600">{penalty.note}</p>
                      </div>
                      <Badge variant="destructive">{penalty.amount}</Badge>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Waiver Provisions
                </h4>
                <p className="text-sm text-purple-700 mb-2">
                  Commissioner may waive requirements upon finding:
                </p>
                <ul className="text-sm text-purple-700 space-y-1">
                  {massachusettsWaiverFactors.map((factor, idx) => (
                    <li key={idx}>• {factor}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Phone className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">Contact Information</p>
                    <p className="text-sm text-muted-foreground">
                      Radiation Control Program<br />
                      State Laboratory<br />
                      305 South Street<br />
                      Jamaica Plain, MA 02130<br />
                      Phone: (617) 242-3035
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* LSO COMPARISON TAB */}
        <TabsContent value="lso" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5" />
                <CardTitle>LSO Qualification Comparison</CardTitle>
              </div>
              <CardDescription>
                Side-by-side comparison of Laser Safety Officer requirements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left font-medium">Aspect</th>
                      <th className="px-4 py-3 text-left font-medium text-blue-700 bg-blue-50">Illinois</th>
                      <th className="px-4 py-3 text-left font-medium text-purple-700 bg-purple-50">Massachusetts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {lsoComparisonData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                        <td className="px-4 py-3 font-medium">{row.aspect}</td>
                        <td className="px-4 py-3">{row.illinois}</td>
                        <td className="px-4 py-3">{row.massachusetts}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Illinois LSO Duties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ol className="text-sm space-y-2 list-decimal list-inside">
                      <li>Establish laser radiation safety program</li>
                      <li>Provide hazard instructions to exposed individuals</li>
                      <li>Permit operation only by trained individuals</li>
                      <li>Ensure control measures are in effect</li>
                      <li>Periodically audit control measures</li>
                    </ol>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Massachusetts LSO Duties</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      Per ANSI Z136.1, the LSO shall have authority and responsibility for:
                    </p>
                    <ul className="text-sm space-y-1 mt-2">
                      <li>• Evaluating laser hazards</li>
                      <li>• Classifying lasers</li>
                      <li>• Specifying control measures</li>
                      <li>• Approving procedures</li>
                      <li>• Ensuring compliance with 105 CMR 121</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PENALTIES TAB */}
        <TabsContent value="penalties" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Scale className="h-5 w-5" />
                <CardTitle>Penalty Structure Comparison</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-4 py-3 text-left font-medium">Aspect</th>
                      <th className="px-4 py-3 text-left font-medium text-blue-700 bg-blue-50">Illinois</th>
                      <th className="px-4 py-3 text-left font-medium text-purple-700 bg-purple-50">Massachusetts</th>
                    </tr>
                  </thead>
                  <tbody>
                    {penaltyComparisonData.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                        <td className="px-4 py-3 font-medium">{row.aspect}</td>
                        <td className="px-4 py-3">{row.illinois}</td>
                        <td className="px-4 py-3">
                          {row.massachusetts.includes("$") ? (
                            <Badge variant="destructive">{row.massachusetts}</Badge>
                          ) : (
                            row.massachusetts
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <h4 className="font-medium text-red-800 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Massachusetts Penalty Factors
                </h4>
                <p className="text-sm text-red-700 mt-2">
                  In determining civil penalty amounts, Massachusetts considers:
                </p>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-red-700">
                  <div>• Willfulness of violation</div>
                  <div>• Danger to public health</div>
                  <div>• Costs of damage/injury</div>
                  <div>• Enforcement costs</div>
                  <div>• Reasonable compliance efforts</div>
                  <div>• Prior compliance history</div>
                  <div>• Deterrence likelihood</div>
                  <div>• Financial condition</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ENTERTAINMENT TAB */}
        <TabsContent value="entertainment" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                <CardTitle>Entertainment Laser Requirements</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 mb-4">
                <Button
                  variant={selectedState === "illinois" ? "default" : "outline"}
                  onClick={() => setSelectedState("illinois")}
                  className="flex-1"
                >
                  Illinois
                </Button>
                <Button
                  variant={selectedState === "massachusetts" ? "default" : "outline"}
                  onClick={() => setSelectedState("massachusetts")}
                  className="flex-1"
                >
                  Massachusetts
                </Button>
              </div>

              {selectedState === "illinois" ? (
                <div className="space-y-4">
                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="font-medium text-blue-800 mb-2">Section 315.140 - Entertainment Laser Light Show</h4>
                    <p className="text-sm text-blue-700">
                      Notify Department in writing or facsimile at least 10 working days in advance.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required Information:</h4>
                    <ul className="space-y-2">
                      {illinoisEntertainmentRequirements.map((req, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Height Requirements</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Unattended: 6 meters above audience OR 2.5m lateral separation</li>
                      <li>• With operator: 3 meters above audience (for Class 2+ areas)</li>
                    </ul>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                    <h4 className="font-medium text-purple-800 mb-2">105 CMR 121.008 & 121.023</h4>
                    <p className="text-sm text-purple-700">
                      Provide information within 10 days of first scheduled performance in Massachusetts.
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Required Information:</h4>
                    <div className="grid gap-2">
                      {[
                        "Name, address, phone of laser owner",
                        "Name, address, phone of LSO",
                        "Name, address, phone of operator(s)",
                        "Name, address, phone of facility(s)",
                        "Name, address, phone of performance supervisor",
                        "Date(s) and times of performances",
                        "Length of time laser will be in operation",
                        "Class of laser and manufacturer name",
                        "Sketches describing design/layout of show",
                        "FDA variance and accession number",
                        "Copy of FAA notification (if applicable)"
                      ].map((req, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                          <span>{req}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                    <h4 className="font-medium text-amber-800 mb-2">Physical Requirements (121.008)</h4>
                    <ul className="text-sm text-amber-700 space-y-1">
                      <li>• Audience area: Cannot exceed Class 1 limits</li>
                      <li>• Performers viewing: Cannot exceed Class 1 limits</li>
                      <li>• Performers not viewing: Cannot exceed Class 2 limits</li>
                      <li>• Unattended (Class 2+): 20 feet above OR 8 feet side/below</li>
                      <li>• Continuous control (Class 2+): 10 feet above OR 8 feet side/below</li>
                    </ul>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Module3_IL_MA;
