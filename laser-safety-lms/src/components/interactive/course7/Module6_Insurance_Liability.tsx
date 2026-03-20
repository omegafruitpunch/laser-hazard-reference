"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface InsuranceType {
  type: string;
  minimum: string;
  description: string;
  critical: boolean;
  covers: string[];
  exclusions: string[];
}

const insuranceTypes: InsuranceType[] = [
  {
    type: "General Liability",
    minimum: "$1,000,000 per occurrence",
    description: "Primary coverage for bodily injury and property damage",
    critical: true,
    covers: [
      "Bodily injury to third parties",
      "Property damage to venue/equipment",
      "Legal defense costs",
      "Settlements and judgments",
    ],
    exclusions: [
      "Intentional acts",
      "Professional errors (need E&O)",
      "Employee injuries (need Workers Comp)",
      "Owned vehicle damage",
    ],
  },
  {
    type: "Errors & Omissions (E&O)",
    minimum: "$1,000,000 per claim",
    description: "Professional liability for design and operational errors",
    critical: true,
    covers: [
      "Professional negligence claims",
      "Design errors in laser shows",
      "Safety planning oversights",
      "Failure to meet industry standards",
    ],
    exclusions: [
      "Intentional wrongdoing",
      "Criminal acts",
      "Bodily injury (covered by GL)",
      "Property damage (covered by GL)",
    ],
  },
  {
    type: "Workers' Compensation",
    minimum: "Statutory limits",
    description: "Required for employees - covers work-related injuries",
    critical: true,
    covers: [
      "Employee medical expenses",
      "Lost wages during recovery",
      "Disability benefits",
      "Death benefits to dependents",
    ],
    exclusions: [
      "Intentional self-injury",
      "Injuries while intoxicated",
      "Injuries outside scope of employment",
      "Independent contractors (must carry own)",
    ],
  },
  {
    type: "Commercial Auto",
    minimum: "$1,000,000 combined single limit",
    description: "For company-owned and rented vehicles",
    critical: false,
    covers: [
      "Third-party bodily injury",
      "Third-party property damage",
      "Physical damage to owned vehicles",
      "Hired and non-owned auto liability",
    ],
    exclusions: [
      "Personal use of company vehicles",
      "Unlicensed drivers",
      "Racing or speed contests",
      "Intentional damage",
    ],
  },
  {
    type: "Inland Marine / Equipment",
    minimum: "Replacement value of equipment",
    description: "Coverage for laser and production equipment",
    critical: false,
    covers: [
      "Equipment theft",
      "Transit damage",
      "On-site damage",
      "Rented equipment coverage",
    ],
    exclusions: [
      "Normal wear and tear",
      "Mysterious disappearance",
      "Equipment breakdown (need separate coverage)",
      "Unattended equipment in vehicles",
    ],
  },
  {
    type: "Excess/Umbrella",
    minimum: "$2,000,000 - $5,000,000",
    description: "Additional limits above primary policies",
    critical: false,
    covers: [
      "Excess over primary GL limits",
      "Excess over auto limits",
      "Excess over employers liability",
      "Coverage for defense costs",
    ],
    exclusions: [
      "Professional liability (need separate E&O)",
      "Directors and officers liability",
      "Employment practices liability",
      "Pollution liability",
    ],
  },
  {
    type: "Event Cancellation",
    minimum: "Based on event budget",
    description: "Protects financial investment in event",
    critical: false,
    covers: [
      "Severe weather cancellation",
      "Artist/performers no-show",
      "Venue unavailability",
      "Civil authority shutdown",
    ],
    exclusions: [
      "Fear of cancellation (without physical damage)",
      "Poor ticket sales",
      "Change of mind",
      "Known risks at time of purchase",
    ],
  },
];

interface ChecklistItem {
  id: string;
  category: string;
  item: string;
  completed: boolean;
  critical: boolean;
}

const contractChecklist: ChecklistItem[] = [
  { id: "cc-001", category: "Insurance Verification", item: "Certificate of Insurance received from all vendors", completed: false, critical: true },
  { id: "cc-002", category: "Insurance Verification", item: "Additional Insured endorsement confirmed", completed: false, critical: true },
  { id: "cc-003", category: "Insurance Verification", item: "Policy dates cover entire event period", completed: false, critical: true },
  { id: "cc-004", category: "Insurance Verification", item: "Coverage limits meet contract requirements", completed: false, critical: true },
  { id: "cc-005", category: "Contract Terms", item: "Indemnification clause reviewed by attorney", completed: false, critical: true },
  { id: "cc-006", category: "Contract Terms", item: "Hold harmless provisions understood", completed: false, critical: true },
  { id: "cc-007", category: "Contract Terms", item: "Waiver of subrogation confirmed if required", completed: false, critical: false },
  { id: "cc-008", category: "Contract Terms", item: "Force majeure provisions reviewed", completed: false, critical: false },
  { id: "cc-009", category: "Risk Transfer", item: "Subcontractor insurance requirements documented", completed: false, critical: true },
  { id: "cc-010", category: "Risk Transfer", item: "Equipment rental agreements reviewed", completed: false, critical: false },
  { id: "cc-011", category: "Risk Transfer", item: "Venue rental agreement signed and understood", completed: false, critical: true },
  { id: "cc-012", category: "Documentation", item: "All contracts stored securely with backups", completed: false, critical: true },
];

interface DueDiligenceItem {
  id: string;
  task: string;
  completed: boolean;
  documentation: string;
}

export const Module6_Insurance_Liability: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"coverage" | "contracts" | "diligence">("coverage");
  const [selectedInsurance, setSelectedInsurance] = useState<string>("General Liability");
  const [checklist, setChecklist] = useState(contractChecklist);
  const [dueDiligence, setDueDiligence] = useState<DueDiligenceItem[]>([
    { id: "dd-001", task: "Vendor insurance certificates obtained", completed: false, documentation: "COI PDF" },
    { id: "dd-002", task: "Safety plan documented and approved", completed: false, documentation: "Safety Plan PDF" },
    { id: "dd-003", task: "Venue inspection completed", completed: false, documentation: "Inspection Report" },
    { id: "dd-004", task: "Risk assessment completed", completed: false, documentation: "Risk Assessment" },
    { id: "dd-005", task: "Staff training documented", completed: false, documentation: "Training Records" },
    { id: "dd-006", task: "Emergency procedures posted", completed: false, documentation: "EAP Document" },
    { id: "dd-007", task: "Equipment certifications current", completed: false, documentation: "Certification Files" },
    { id: "dd-008", task: "Incident log established", completed: false, documentation: "Log Book" },
  ]);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const toggleDueDiligence = (id: string) => {
    setDueDiligence((prev) => prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item)));
  };

  const checklistProgress = Math.round(
    (checklist.filter((i) => i.completed).length / checklist.length) * 100
  );
  const diligenceProgress = Math.round(
    (dueDiligence.filter((i) => i.completed).length / dueDiligence.length) * 100
  );

  const selectedInsuranceData = insuranceTypes.find((i) => i.type === selectedInsurance);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Insurance & Liability</h1>
        <p className="text-muted-foreground">Insurance requirements, contract review, and due diligence documentation</p>
      </div>

      {/* Key Requirements Banner */}
      <Card className="border-2 border-blue-300 bg-blue-50">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-700">$1M</div>
              <div className="text-sm text-blue-600">Minimum General Liability</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700">E&O</div>
              <div className="text-sm text-blue-600">Errors & Omissions Required</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-700">3-7 Years</div>
              <div className="text-sm text-blue-600">Document Retention</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: "coverage", label: "Insurance Coverage", icon: "🛡️" },
          { id: "contracts", label: "Contract Review", icon: "📄" },
          { id: "diligence", label: "Due Diligence", icon: "✓" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2",
              activeTab === tab.id
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-muted text-foreground hover:bg-gray-200"
            )}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Insurance Coverage Tab */}
      {activeTab === "coverage" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Insurance Type Selector */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Coverage Types</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {insuranceTypes.map((ins) => (
                  <button
                    key={ins.type}
                    onClick={() => setSelectedInsurance(ins.type)}
                    className={cn(
                      "w-full p-3 rounded-lg border-2 text-left transition-all",
                      selectedInsurance === ins.type
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300",
                      ins.critical && selectedInsurance !== ins.type && "border-red-200"
                    )}
                  >
                    <div className="font-semibold text-sm">{ins.type}</div>
                    <div className="text-xs text-muted-foreground">{ins.minimum}</div>
                    {ins.critical && (
                      <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        REQUIRED
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Insurance Details */}
          <Card className="lg:col-span-2">
            <CardHeader className={cn(selectedInsuranceData?.critical ? "bg-red-50" : "bg-blue-50")}>
              <CardTitle className="flex items-center justify-between">
                <span>{selectedInsuranceData?.type}</span>
                {selectedInsuranceData?.critical && (
                  <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full">REQUIRED COVERAGE</span>
                )}
              </CardTitle>
              <CardDescription>{selectedInsuranceData?.description}</CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm text-muted-foreground">Minimum Coverage</div>
                <div className="text-2xl font-bold text-blue-700">{selectedInsuranceData?.minimum}</div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
                    <span>✓</span> Covers
                  </h4>
                  <ul className="space-y-2">
                    {selectedInsuranceData?.covers.map((item, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-green-500">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
                    <span>✕</span> Exclusions
                  </h4>
                  <ul className="space-y-2">
                    {selectedInsuranceData?.exclusions.map((item, idx) => (
                      <li key={idx} className="text-sm text-foreground flex items-start gap-2">
                        <span className="text-red-400">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Contract Review Tab */}
      {activeTab === "contracts" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Contract Review Checklist</CardTitle>
                  <CardDescription>Verify insurance and liability provisions before signing</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{checklistProgress}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={checklistProgress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {["Insurance Verification", "Contract Terms", "Risk Transfer", "Documentation"].map((category) => (
                  <div key={category}>
                    <h4 className="font-semibold text-foreground mb-2">{category}</h4>
                    <div className="space-y-2">
                      {checklist
                        .filter((item) => item.category === category)
                        .map((item) => (
                          <div
                            key={item.id}
                            className={cn(
                              "p-3 rounded-lg border flex items-start gap-3 transition-all",
                              item.completed
                                ? "bg-green-50 border-green-200"
                                : item.critical
                                ? "bg-red-50 border-red-200"
                                : "bg-card border-gray-200"
                            )}
                          >
                            <button
                              onClick={() => toggleChecklistItem(item.id)}
                              className={cn(
                                "mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-all shrink-0",
                                item.completed
                                  ? "bg-green-500 border-green-500 text-white"
                                  : "border-gray-300 hover:border-blue-500"
                              )}
                            >
                              {item.completed && (
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                  <path
                                    fillRule="evenodd"
                                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                              )}
                            </button>
                            <div className="flex-1">
                              <span
                                className={cn(
                                  item.completed ? "text-muted-foreground line-through" : "text-foreground"
                                )}
                              >
                                {item.item}
                              </span>
                              {item.critical && (
                                <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                                  CRITICAL
                                </span>
                              )}
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-amber-300">
              <CardHeader className="bg-amber-50">
                <CardTitle className="text-amber-800">Key Contract Terms to Review</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">1.</span>
                    <div>
                      <span className="font-semibold">Indemnification:</span> Who is responsible for claims arising from the event?
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">2.</span>
                    <div>
                      <span className="font-semibold">Hold Harmless:</span> Protection from claims by other parties
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">3.</span>
                    <div>
                      <span className="font-semibold">Additional Insured:</span> Must venue/client be named on your policy?
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">4.</span>
                    <div>
                      <span className="font-semibold">Waiver of Subrogation:</span> Prevents insurer from recovering from other party
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold">5.</span>
                    <div>
                      <span className="font-semibold">Primary & Non-Contributory:</span> Your policy pays first
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-300">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-800">⚠️ Red Flags</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-red-700">
                  <li className="flex items-start gap-2">
                    <span>🚩</span>
                    <span>Unlimited indemnification clauses</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🚩</span>
                    <span>Responsibility for venue's negligence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🚩</span>
                    <span>No insurance requirement for other vendors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🚩</span>
                    <span>Verbal agreements not in writing</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🚩</span>
                    <span>Insurance requirements exceed your coverage</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>🚩</span>
                    <span>No force majeure provisions</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Due Diligence Tab */}
      {activeTab === "diligence" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-muted">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Due Diligence Documentation</CardTitle>
                  <CardDescription>Evidence of reasonable care to defend against liability claims</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-foreground">{diligenceProgress}%</div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <div className="mt-2">
                <Progress value={diligenceProgress} className="h-2" />
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-3">
                {dueDiligence.map((item) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-4 rounded-lg border flex items-center gap-4 transition-all",
                      item.completed ? "bg-green-50 border-green-200" : "bg-card border-gray-200"
                    )}
                  >
                    <button
                      onClick={() => toggleDueDiligence(item.id)}
                      className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center transition-all shrink-0",
                        item.completed
                          ? "bg-green-500 border-green-500 text-white"
                          : "border-gray-300 hover:border-blue-500"
                      )}
                    >
                      {item.completed && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </button>
                    <div className="flex-1">
                      <div className={cn(item.completed ? "text-muted-foreground line-through" : "text-foreground")}>
                        {item.task}
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground bg-muted px-3 py-1 rounded">
                      {item.documentation}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Documentation Retention Schedule</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2">Document Type</th>
                      <th className="text-right py-2">Retention</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b">
                      <td className="py-2">Insurance policies</td>
                      <td className="text-right py-2 font-semibold">Life + 7 years</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Contracts and agreements</td>
                      <td className="text-right py-2 font-semibold">7 years post-completion</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Incident reports</td>
                      <td className="text-right py-2 font-semibold">10 years minimum</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Training records</td>
                      <td className="text-right py-2 font-semibold">Employment + 5 years</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2">Inspection reports</td>
                      <td className="text-right py-2 font-semibold">7 years</td>
                    </tr>
                    <tr>
                      <td className="py-2">Safety plans and risk assessments</td>
                      <td className="text-right py-2 font-semibold">7 years</td>
                    </tr>
                  </tbody>
                </table>
              </CardContent>
            </Card>

            <Card className="border-2 border-green-300">
              <CardHeader className="bg-green-50">
                <CardTitle className="text-green-800">Defending Against Claims</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground mb-4">
                  To successfully defend against negligence claims, you must demonstrate:
                </p>
                <ol className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-700">1.</span>
                    <span><strong>Duty of care</strong> was established through contracts and planning</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-700">2.</span>
                    <span><strong>Standard of care</strong> met through compliance with industry standards (ANSI, NFPA)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-700">3.</span>
                    <span><strong>Breach did not occur</strong> - you followed established procedures</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="font-bold text-green-700">4.</span>
                    <span><strong>Documentation</strong> proves reasonable care was exercised</span>
                  </li>
                </ol>
                <div className="mt-4 p-3 bg-amber-50 rounded-lg border border-amber-200">
                  <p className="text-sm text-amber-800">
                    <strong>Note:</strong> Consult with legal counsel before the event season begins to review contracts and coverage adequacy.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Module6_Insurance_Liability;
