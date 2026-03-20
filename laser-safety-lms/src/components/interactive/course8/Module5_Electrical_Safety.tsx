"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Zap, 
  AlertTriangle, 
  CheckCircle2,
  Plug,
  Cable,
  Shield,
  BookOpen,
  ExternalLink,
  Construction,
  Building,
  Flame,
  Info,
  Minus
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ElectricalStandard {
  designation: string;
  title: string;
  scope: string;
  keyRequirements: string[];
  applicability: string;
}

interface GroundingRequirement {
  component: string;
  requirement: string;
  standard: string;
  verification: string;
}

interface TemporaryPowerRule {
  category: string;
  requirements: string[];
  hazards: string[];
}

// ============================================================================
// Data Constants
// ============================================================================

const ELECTRICAL_STANDARDS: ElectricalStandard[] = [
  {
    designation: "IEC 60950-1 / UL 60950-1",
    title: "Safety of Information Technology Equipment",
    scope: "General safety requirements for electrical equipment including laser products",
    keyRequirements: [
      "Hazard-based safety engineering",
      "Energy hazard classifications",
      "Fire enclosures and energy sources",
      "Electrical isolation requirements",
      "Safety interlock systems"
    ],
    applicability: "IT equipment, laser power supplies, control systems"
  },
  {
    designation: "IEC 62368-1 / UL 62368-1",
    title: "Audio/Video, IT and Communication Equipment Safety",
    scope: "Hazard-based safety engineering replacing 60950-1 and 60065",
    keyRequirements: [
      "Hazard-based engineering (HBE) approach",
      "Three classes of energy sources (ES1-3)",
      "Safeguard effectiveness ratings",
      "Fire enclosures and burn hazards",
      "Safe distances and accessibility"
    ],
    applicability: "Modern AV equipment, multimedia systems"
  },
  {
    designation: "NFPA 70 (NEC)",
    title: "National Electrical Code",
    scope: "Electrical wiring and equipment installation requirements",
    keyRequirements: [
      "Article 640: Audio Signal Processing Equipment",
      "Article 530: Motion Picture and TV Studios",
      "Article 520: Theaters and Similar Locations",
      "Grounding and bonding requirements",
      "Overcurrent protection"
    ],
    applicability: "Installation, wiring, venue electrical systems"
  },
  {
    designation: "NFPA 79",
    title: "Electrical Standard for Industrial Machinery",
    scope: "Electrical equipment and systems of industrial machines",
    keyRequirements: [
      "Supply circuit disconnecting means",
      "Protection against electric shock",
      "Equipment grounding conductor",
      "Control circuits and devices",
      "Marking and documentation"
    ],
    applicability: "Industrial laser systems, manufacturing equipment"
  }
];

const GROUNDING_REQUIREMENTS: GroundingRequirement[] = [
  {
    component: "Equipment Enclosure",
    requirement: "All exposed metal parts must be grounded",
    standard: "NEC Article 250",
    verification: "Continuity test to ground"
  },
  {
    component: "Power Supply Chassis",
    requirement: "Grounding conductor minimum 18 AWG",
    standard: "UL 60950-1 / IEC 60950-1",
    verification: "Ground bond test (< 0.1Ω)"
  },
  {
    component: "Control Panels",
    requirement: "Separate grounding bus for all devices",
    standard: "NFPA 79",
    verification: "Visual inspection and resistance test"
  },
  {
    component: "Temporary Power Distribution",
    requirement: "GFCI protection for portable equipment",
    standard: "NEC Article 590",
    verification: "GFCI function test"
  },
  {
    component: "Stage Power",
    requirement: "Insulated grounding conductor (green)",
    standard: "NEC Article 520",
    verification: "Polarity and continuity verification"
  }
];

const TEMPORARY_POWER_RULES: TemporaryPowerRule[] = [
  {
    category: "Cable Protection",
    requirements: [
      "Cables must be protected from physical damage",
      "Use of cable ramps in traffic areas",
      "Adequate strain relief at connections",
      "Proper cable ratings for load and environment"
    ],
    hazards: [
      "Trip hazards from unsecured cables",
      "Damage from vehicle traffic",
      "Water ingress at connections",
      "Overheating from overload"
    ]
  },
  {
    category: "GFCI Protection",
    requirements: [
      "Class A GFCI (trip at 4-6mA) for personnel protection",
      "Test before each use",
      "Use on all 120V temporary circuits",
      "Weather-resistant for outdoor use"
    ],
    hazards: [
      "Electric shock from ground faults",
      "Nuisance tripping from moisture",
      "Equipment damage from improper grounding",
      "Series arc faults from damaged cords"
    ]
  },
  {
    category: "Generator Power",
    requirements: [
      "Proper grounding electrode system",
      "Neutral-to-ground bond at source only",
      "Adequate capacity for connected load",
      "Proper ventilation for exhaust"
    ],
    hazards: [
      "Carbon monoxide poisoning",
      "Fire from fuel storage",
      "Backfeed hazards to utility",
      "Voltage instability affecting laser systems"
    ]
  }
];

const CAPACITOR_HAZARDS = [
  {
    hazard: "Stored Energy",
    description: "Capacitors in laser power supplies can store lethal energy for extended periods",
    mitigation: "Discharge before service, use bleeder resistors, warning labels"
  },
  {
    hazard: "Explosion",
    description: "Overvoltage or reverse polarity can cause catastrophic failure",
    mitigation: "Proper voltage rating, polarity protection, containment"
  },
  {
    hazard: "High Voltage DC",
    description: "Flashlamp and pump laser power supplies often exceed 1kV DC",
    mitigation: "Interlocked enclosures, discharge verification, PPE"
  }
];

// ============================================================================
// Main Component
// ============================================================================

export function Module5_Electrical_Safety() {
  const [activeTab, setActiveTab] = useState<"standards" | "grounding" | "temporary" | "hazards">("standards");
  const [selectedStandard, setSelectedStandard] = useState<ElectricalStandard | null>(null);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Zap className="w-6 h-6 text-primary" />
            Module 8.5: Electrical Safety
          </h2>
          <p className="text-muted-foreground mt-1">
            IEC 60950, UL 60950, NFPA 70 (NEC) and grounding requirements
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1 bg-amber-500/10 text-amber-600 border-amber-500/30">
          <AlertTriangle className="w-4 h-4 mr-1" />
          High Voltage Safety
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-1">
        {[
          { id: "standards", label: "Safety Standards", icon: BookOpen },
          { id: "grounding", label: "Grounding Requirements", icon: Minus },
          { id: "temporary", label: "Temporary Power", icon: Construction },
          { id: "hazards", label: "Laser-Specific Hazards", icon: Flame }
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
      {activeTab === "standards" && (
        <div className="space-y-6">
          {/* Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ELECTRICAL_STANDARDS.map((standard, index) => (
              <Card 
                key={index}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedStandard?.designation === standard.designation && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedStandard(standard)}
              >
                <CardHeader className="pb-2">
                  <Badge variant="secondary" className="w-fit mb-2">{standard.designation}</Badge>
                  <CardTitle className="text-base">{standard.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{standard.scope}</p>
                  <div className="mt-3 text-xs text-muted-foreground">
                    Applies to: {standard.applicability}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Standard Detail */}
          {selectedStandard && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <Badge variant="secondary" className="w-fit mb-2">{selectedStandard.designation}</Badge>
                <CardTitle>{selectedStandard.title}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedStandard.scope}</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Key Requirements:</h4>
                  <ul className="space-y-2">
                    {selectedStandard.keyRequirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-1 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Applicability
                  </h4>
                  <p className="text-sm text-muted-foreground">{selectedStandard.applicability}</p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Transition Note */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Info className="w-5 h-5 text-amber-500" />
                Important: IEC 62368-1 Transition
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                IEC 62368-1 is replacing IEC 60950-1 and IEC 60065 as the standard for AV and IT equipment. 
                This hazard-based standard takes a different approach than prescriptive requirements, 
                focusing on identifying and safeguarding against potential hazards. Manufacturers should 
                ensure their products comply with the applicable version for their target markets.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "grounding" && (
        <div className="space-y-6">
          {/* Grounding Importance */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Minus className="w-5 h-5 text-primary" />
                Why Grounding is Critical
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Proper grounding is essential for laser safety. It provides a safe path for fault currents, 
                prevents electric shock, protects against lightning and power surges, and ensures proper 
                operation of overcurrent protection devices. All exposed metal parts of laser equipment 
                must be properly grounded.
              </p>
            </CardContent>
          </Card>

          {/* Grounding Requirements Table */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Grounding Requirements by Component
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold">Component</th>
                      <th className="text-left py-3 px-4 font-semibold">Requirement</th>
                      <th className="text-left py-3 px-4 font-semibold">Standard</th>
                      <th className="text-left py-3 px-4 font-semibold">Verification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {GROUNDING_REQUIREMENTS.map((req, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-3 px-4 font-medium">{req.component}</td>
                        <td className="py-3 px-4 text-muted-foreground">{req.requirement}</td>
                        <td className="py-3 px-4">
                          <code className="bg-muted px-2 py-0.5 rounded text-xs">{req.standard}</code>
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{req.verification}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Testing Procedures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Cable className="w-4 h-4" />
                  Ground Continuity Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Resistance should be less than 0.1Ω</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Test from enclosure to grounding electrode</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Use low-resistance ohmmeter (4-wire method)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Verify connections are tight and corrosion-free</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Plug className="w-4 h-4" />
                  GFCI Testing
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Test monthly using built-in test button</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Verify trip time is within 25ms (Class A)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Use GFCI tester for comprehensive check</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    <span>Replace if test fails or unit is damaged</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {activeTab === "temporary" && (
        <div className="space-y-6">
          {/* Warning Banner */}
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-6 h-6 text-red-500 shrink-0" />
            <div>
              <h4 className="font-semibold text-red-700">Temporary Power Hazards</h4>
              <p className="text-sm text-red-600">
                Temporary power installations for laser shows have unique hazards including weather 
                exposure, physical damage, and improper setup. All temporary power must comply with 
                NEC Article 590 and OSHA requirements.
              </p>
            </div>
          </div>

          {/* Temporary Power Rules */}
          <div className="space-y-4">
            {TEMPORARY_POWER_RULES.map((rule, index) => (
              <Card key={index}>
                <CardHeader>
                  <CardTitle className="text-base">{rule.category}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-green-700">
                        <CheckCircle2 className="w-4 h-4" />
                        Requirements
                      </h4>
                      <ul className="space-y-1">
                        {rule.requirements.map((req, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-green-500 mt-1">•</span>
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2 flex items-center gap-2 text-red-700">
                        <AlertTriangle className="w-4 h-4" />
                        Hazards
                      </h4>
                      <ul className="space-y-1">
                        {rule.hazards.map((hazard, i) => (
                          <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                            <span className="text-red-500 mt-1">•</span>
                            {hazard}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* NEC Article 590 Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                NEC Article 590 - Temporary Power Highlights
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>590.3:</strong> Time constraints - Temporary power shall not exceed 90 days for holiday decorative lighting or 60 days for construction</span>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>590.4:</strong> General requirements - Equipment must be suitable for use and protected from damage</span>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>590.6:</strong> GFCI protection required for all 125V, single-phase, 15-20A receptacles</span>
                </li>
                <li className="flex items-start gap-2">
                  <ExternalLink className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                  <span><strong>590.7:</strong> Guarding - Live parts must be guarded against accidental contact</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "hazards" && (
        <div className="space-y-6">
          {/* Capacitor Warning */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Flame className="w-5 h-5" />
                Capacitor Hazards in Laser Power Supplies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Laser power supplies, especially those for flashlamp-pumped solid-state lasers, 
                contain capacitors that store lethal amounts of electrical energy. These capacitors 
                can maintain dangerous voltages for minutes to hours after power is disconnected.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {CAPACITOR_HAZARDS.map((cap, i) => (
                  <div key={i} className="p-4 bg-red-500/5 rounded-lg border border-red-500/20">
                    <h4 className="font-semibold text-red-700 mb-1">{cap.hazard}</h4>
                    <p className="text-sm text-muted-foreground mb-2">{cap.description}</p>
                    <p className="text-xs text-green-600">
                      <strong>Mitigation:</strong> {cap.mitigation}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Laser-Specific Electrical Requirements */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Laser Equipment Electrical Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold mb-3">Power Supply Safety</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Interlocked enclosures for voltages {'>'}42.4V peak</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Discharge resistors on all capacitors {'>'}0.5µF</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Warning labels for high voltage and stored energy</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Service disconnect within sight of equipment</span>
                    </li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-3">Installation Requirements</h4>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Dedicated circuits for high-power lasers</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Adequate ventilation for cooling</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Proper wire sizing for load and distance</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Isolated grounding for sensitive electronics</span>
                    </li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Interlock Systems */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Electrical Interlock Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Per ANSI Z136.1 and FDA requirements, Class 3B and Class 4 laser systems must have 
                proper electrical interlocks to prevent exposure to hazardous radiation during service 
                or when protective housings are opened.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h5 className="font-semibold mb-1">Protective Housing Interlocks</h5>
                  <p className="text-muted-foreground">Prevent operation when housing opened</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h5 className="font-semibold mb-1">Service Access Panels</h5>
                  <p className="text-muted-foreground">Manual reset required after opening</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h5 className="font-semibold mb-1">Remote Interlock Connector</h5>
                  <p className="text-muted-foreground">Allows connection to door switches</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Module5_Electrical_Safety;
