"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Music, 
  Users, 
  Shield, 
  Building,
  TreePine,
  CheckCircle2,
  AlertTriangle,
  Eye,
  Scan,
  Ruler,
  FileCheck,
  GraduationCap,
  ChevronRight,
  Info
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface E146Section {
  id: string;
  sectionNumber: string;
  title: string;
  description: string;
  requirements: string[];
  isCritical?: boolean;
}

interface AudienceScanningCriteria {
  criterion: string;
  requirement: string;
  verification: string;
}

interface OperatorQualification {
  level: string;
  title: string;
  requirements: string[];
  responsibilities: string[];
}

// ============================================================================
// Data Constants
// ============================================================================

const E146_SECTIONS: E146Section[] = [
  {
    id: "sec-1",
    sectionNumber: "4",
    title: "General Requirements",
    description: "Fundamental safety requirements for all entertainment laser installations",
    requirements: [
      "Laser products shall comply with applicable federal regulations (21 CFR 1040)",
      "All laser installations shall have a designated Laser Safety Officer",
      "Pre-show safety documentation shall be completed",
      "Emergency stop systems shall be installed and tested",
      "Warning signage shall be posted at appropriate locations"
    ],
    isCritical: true
  },
  {
    id: "sec-2",
    sectionNumber: "5",
    title: "Audience Scanning Requirements",
    description: "Specific criteria for intentional laser exposure of audiences",
    requirements: [
      "MPE shall not be exceeded under normal or single-fault conditions",
      "Scan failure detection systems shall respond within milliseconds",
      "Beam measurements shall verify compliance before audience exposure",
      "Multiple safety systems shall provide redundancy",
      "Documentation of safety calculations shall be maintained"
    ],
    isCritical: true
  },
  {
    id: "sec-3",
    sectionNumber: "6",
    title: "Installation Requirements",
    description: "Physical installation and alignment procedures",
    requirements: [
      "Laser projectors shall be securely mounted to prevent movement",
      "Beam paths shall be masked to prevent unintended emissions",
      "Alignment shall be performed at reduced power when possible",
      "Access to laser areas shall be restricted during alignment",
      "Optical components shall be secured against misalignment"
    ]
  },
  {
    id: "sec-4",
    sectionNumber: "7",
    title: "Operation Requirements",
    description: "Procedures during laser show operation",
    requirements: [
      "Operators shall maintain continuous visual surveillance",
      "Emergency stop shall be accessible to operator at all times",
      "Personnel shall not enter beam paths during operation",
      "Show modifications shall be approved by LSO",
      "Pre-show checklists shall be completed and documented"
    ]
  }
];

const SCANNING_CRITERIA: AudienceScanningCriteria[] = [
  {
    criterion: "Maximum Permissible Exposure",
    requirement: "Exposures shall not exceed applicable MPE",
    verification: "Irradiance measurements at audience positions"
  },
  {
    criterion: "Scan Failure Response",
    requirement: "Detection and response within milliseconds",
    verification: "Test scanner failure under actual conditions"
  },
  {
    criterion: "Redundant Safety Systems",
    requirement: "Multiple independent safety mechanisms",
    verification: "Documented system redundancy analysis"
  },
  {
    criterion: "Power Monitoring",
    requirement: "Continuous monitoring of accessible emission",
    verification: "Calibrated power meter readings"
  },
  {
    criterion: "Wavelength Verification",
    requirement: "Only visible wavelengths in audience areas",
    verification: "Spectral analysis or manufacturer certification"
  }
];

const OPERATOR_QUALIFICATIONS: OperatorQualification[] = [
  {
    level: "entry",
    title: "Entry Level Operator",
    requirements: [
      "Basic laser safety training (4 hours minimum)",
      "Understanding of laser classification",
      "Familiarity with emergency procedures",
      "Supervised operation experience (20 hours)"
    ],
    responsibilities: [
      "Operate pre-programmed shows",
      "Monitor audience areas",
      "Execute emergency stop when needed",
      "Complete pre-show checklists"
    ]
  },
  {
    level: "professional",
    title: "Professional Operator",
    requirements: [
      "Advanced laser safety training (16 hours)",
      "MPE calculation competency",
      "Equipment maintenance training",
      "Minimum 2 years experience"
    ],
    responsibilities: [
      "Design and program laser effects",
      "Perform safety calculations",
      "Supervise entry-level operators",
      "Conduct risk assessments"
    ]
  },
  {
    level: "lso",
    title: "Laser Safety Officer (Entertainment)",
    requirements: [
      "CLSO or equivalent certification",
      "Entertainment laser specific training",
      "Comprehensive Z136.1 knowledge",
      "Risk assessment expertise"
    ],
    responsibilities: [
      "Overall safety authority for productions",
      "Approve audience scanning configurations",
      "Develop safety procedures",
      "Interface with regulatory authorities"
    ]
  }
];

const VENUE_REQUIREMENTS = {
  indoor: [
    "Ceiling height minimum 3m above audience",
    "Beam termination on non-reflective surfaces",
    "Emergency lighting independent of laser power",
    "HVAC systems compatible with laser operation",
    "Fire detection/suppression considerations"
  ],
  outdoor: [
    "FAA notification for outdoor shows",
    "Environmental protection for equipment",
    "Wind and weather monitoring",
    "Aircraft avoidance procedures",
    "Public access control beyond venue"
  ]
};

// ============================================================================
// Main Component
// ============================================================================

export function Module2_E1_46() {
  const [activeTab, setActiveTab] = useState<"overview" | "scanning" | "operators" | "venues">("overview");
  const [selectedSection, setSelectedSection] = useState<E146Section | null>(null);
  const [selectedQualification, setSelectedQualification] = useState<OperatorQualification | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Music className="w-6 h-6 text-primary" />
            Module 8.2: ANSI E1.46 Entertainment
          </h2>
          <p className="text-muted-foreground mt-1">
            Entertainment laser safety and audience scanning requirements
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-amber-500/10 text-amber-600 border-amber-500/30">
          <GraduationCap className="w-4 h-4 mr-1" />
          Entertainment Focus
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-1">
        {[
          { id: "overview", label: "Standard Overview", icon: FileCheck },
          { id: "scanning", label: "Audience Scanning", icon: Scan },
          { id: "operators", label: "Operator Qualifications", icon: Users },
          { id: "venues", label: "Venue Requirements", icon: Building }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors",
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          {/* Introduction */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-primary" />
                About ANSI E1.46
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                ANSI E1.46 (Entertainment Technology — Laser Systems Used for Entertainment) 
                provides safety requirements specifically for laser systems used in entertainment 
                applications. This standard works in conjunction with ANSI Z136.1 but addresses 
                the unique challenges of audience scanning and public performances.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <Eye className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Audience Safety</div>
                  <div className="text-sm text-muted-foreground">MPE compliance for public exposure</div>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <Scan className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Scanning Systems</div>
                  <div className="text-sm text-muted-foreground">Failure detection requirements</div>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <Shield className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <div className="font-semibold">Risk Management</div>
                  <div className="text-sm text-muted-foreground">Comprehensive safety protocols</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sections List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {E146_SECTIONS.map(section => (
              <Card 
                key={section.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  section.isCritical && "border-l-4 border-l-amber-500",
                  selectedSection?.id === section.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedSection(section)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">Section {section.sectionNumber}</Badge>
                    {section.isCritical && (
                      <Badge className="bg-amber-500 text-white">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Critical
                      </Badge>
                    )}
                  </div>
                  <CardTitle className="text-base mt-2">{section.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{section.description}</p>
                  <div className="text-xs text-muted-foreground">
                    {section.requirements.length} requirements
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Section Detail Modal */}
          {selectedSection && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <Badge variant="secondary">Section {selectedSection.sectionNumber}</Badge>
                    <CardTitle className="text-xl mt-1">{selectedSection.title}</CardTitle>
                  </div>
                  {selectedSection.isCritical && (
                    <Badge className="bg-amber-500 text-white">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Critical for Certification
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{selectedSection.description}</p>
                <h4 className="font-semibold mb-3">Key Requirements:</h4>
                <ul className="space-y-2">
                  {selectedSection.requirements.map((req, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "scanning" && (
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-red-700">High-Risk Activity</h4>
              <p className="text-sm text-red-600">
                Audience scanning is one of the most hazardous laser applications. 
                Strict compliance with all safety criteria is mandatory. Any incident 
                involving audience exposure can result in serious injury and regulatory action.
              </p>
            </div>
          </div>

          {/* Criteria Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Scan className="w-5 h-5 text-primary" />
                Audience Scanning Safety Criteria
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Criterion</th>
                      <th className="text-left py-3 px-4 font-semibold">Requirement</th>
                      <th className="text-left py-3 px-4 font-semibold">Verification Method</th>
                    </tr>
                  </thead>
                  <tbody>
                    {SCANNING_CRITERIA.map((criteria, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-3 px-4 font-medium">{criteria.criterion}</td>
                        <td className="py-3 px-4 text-muted-foreground">{criteria.requirement}</td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{criteria.verification}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Key Considerations */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-primary" />
                  Measurement Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Measure at all potential audience positions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Account for worst-case scanner failure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Use calibrated, appropriate detectors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Document all measurements</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Safety System Redundancy
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Multiple independent scan failure detectors</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Hardware and software blanking</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Power monitoring systems</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Emergency stop accessibility</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "operators" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {OPERATOR_QUALIFICATIONS.map(qual => (
              <Card 
                key={qual.level}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedQualification?.level === qual.level && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedQualification(qual)}
              >
                <CardHeader className="pb-2">
                  <Badge 
                    className={cn(
                      "w-fit",
                      qual.level === "entry" && "bg-blue-500",
                      qual.level === "professional" && "bg-indigo-500",
                      qual.level === "lso" && "bg-purple-500"
                    )}
                  >
                    {qual.level.charAt(0).toUpperCase() + qual.level.slice(1)} Level
                  </Badge>
                  <CardTitle className="text-base mt-2">{qual.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">
                    {qual.requirements.length} training requirements
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {selectedQualification && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <Badge 
                  className={cn(
                    "w-fit mb-2",
                    selectedQualification.level === "entry" && "bg-blue-500",
                    selectedQualification.level === "professional" && "bg-indigo-500",
                    selectedQualification.level === "lso" && "bg-purple-500"
                  )}
                >
                  {selectedQualification.level.charAt(0).toUpperCase() + selectedQualification.level.slice(1)} Level
                </Badge>
                <CardTitle>{selectedQualification.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Training Requirements
                    </h4>
                    <ul className="space-y-2">
                      {selectedQualification.requirements.map((req, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2">
                      <Shield className="w-4 h-4 text-primary" />
                      Responsibilities
                    </h4>
                    <ul className="space-y-2">
                      {selectedQualification.responsibilities.map((resp, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm">
                          <ChevronRight className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                          <span>{resp}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "venues" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Indoor Venues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building className="w-5 h-5 text-primary" />
                  Indoor Venue Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {VENUE_REQUIREMENTS.indoor.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Outdoor Venues */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TreePine className="w-5 h-5 text-primary" />
                  Outdoor Venue Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {VENUE_REQUIREMENTS.outdoor.map((req, i) => (
                    <li key={i} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                      <span className="text-sm">{req}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* FAA Notification */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-blue-500" />
                FAA Notification Requirements (Outdoor Shows)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                For outdoor laser shows, FAA notification is required. The following power thresholds apply:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-green-500/10 rounded-lg text-center">
                  <div className="font-bold text-green-700">≤ 0.5W</div>
                  <div className="text-sm text-muted-foreground">Notification only</div>
                  <div className="text-xs text-green-600 mt-1">Class IIIa and below</div>
                </div>
                <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                  <div className="font-bold text-amber-700">0.5W - 12W</div>
                  <div className="text-sm text-muted-foreground">Notification + ATC coordination</div>
                  <div className="text-xs text-amber-600 mt-1">Airspace restrictions possible</div>
                </div>
                <div className="p-4 bg-red-500/10 rounded-lg text-center">
                  <div className="font-bold text-red-700">{">"} 12W</div>
                  <div className="text-sm text-muted-foreground">Detailed review required</div>
                  <div className="text-xs text-red-600 mt-1">Likely airspace restrictions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Module2_E1_46;
