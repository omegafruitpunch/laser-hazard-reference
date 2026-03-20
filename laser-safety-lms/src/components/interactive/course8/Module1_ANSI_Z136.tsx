"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  Search, 
  FileText, 
  ChevronRight, 
  ChevronDown,
  Bookmark,
  ExternalLink,
  Calculator,
  Stethoscope,
  FlaskConical,
  Building2,
  ArrowRight,
  GraduationCap,
  Layers,
  CheckCircle2
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface Z136Standard {
  id: string;
  designation: string;
  title: string;
  scope: string;
  keyTopics: string[];
  audience: string;
  icon: React.ReactNode;
  color: string;
}

interface Z136Section {
  id: string;
  sectionNumber: string;
  title: string;
  description: string;
  keyPoints: string[];
  isExpanded?: boolean;
}

interface ReferenceCard {
  title: string;
  content: string;
  formula?: string;
  reference: string;
}

// ============================================================================
// Data Constants
// ============================================================================

const Z136_STANDARDS: Z136Standard[] = [
  {
    id: "z136-1",
    designation: "ANSI Z136.1",
    title: "Safe Use of Lasers",
    scope: "The foundational standard providing general guidance for laser safety across all applications",
    keyTopics: ["Laser Classification", "MPE Tables", "NOHD Calculations", "Control Measures", "LSO Responsibilities"],
    audience: "All laser users and safety professionals",
    icon: <BookOpen className="w-6 h-6" />,
    color: "bg-blue-600"
  },
  {
    id: "z136-2",
    designation: "ANSI Z136.2",
    title: "Optical Fiber Communications",
    scope: "Safety requirements for laser systems used in optical fiber communications",
    keyTopics: ["Fiber Safety", "Service Groups", "Installation Requirements", "Testing Procedures"],
    audience: "Telecommunications and data center technicians",
    icon: <Layers className="w-6 h-6" />,
    color: "bg-indigo-600"
  },
  {
    id: "z136-3",
    designation: "ANSI Z136.3",
    title: "Health Care Facilities",
    scope: "Laser safety in medical and surgical environments",
    keyTopics: ["Medical Laser Classification", "Surgical Safety", "Endoscopic Procedures", "Patient Protection"],
    audience: "Healthcare professionals and medical LSOs",
    icon: <Stethoscope className="w-6 h-6" />,
    color: "bg-emerald-600"
  },
  {
    id: "z136-8",
    designation: "ANSI Z136.8",
    title: "Research, Development, and Testing",
    scope: "Safety guidelines for R&D environments where lasers are used in research",
    keyTopics: ["Laboratory Safety", "Experimental Setups", "Beam Enclosures", "Research Protocols"],
    audience: "Research scientists and laboratory LSOs",
    icon: <FlaskConical className="w-6 h-6" />,
    color: "bg-purple-600"
  },
  {
    id: "z136-9",
    designation: "ANSI Z136.9",
    title: "Defense Research",
    scope: "Laser safety for military and defense applications",
    keyTopics: ["Military Laser Systems", "Range Safety", "Eye Protection", "Classification Differences"],
    audience: "Defense contractors and military personnel",
    icon: <Building2 className="w-6 h-6" />,
    color: "bg-slate-600"
  }
];

const Z136_SECTIONS: Z136Section[] = [
  {
    id: "sec-1",
    sectionNumber: "1-2",
    title: "Scope, Purpose, and Definitions",
    description: "Establishes the foundation for laser safety programs including key terminology",
    keyPoints: [
      "Defines laser safety program purpose and scope",
      "Maximum Permissible Exposure (MPE) definitions",
      "Accessible Emission Limit (AEL) concepts",
      "Nominal Ocular Hazard Distance (NOHD)",
      "Nominal Hazard Zone (NHZ) definitions"
    ]
  },
  {
    id: "sec-3",
    sectionNumber: "3",
    title: "Laser Safety Officer Responsibilities",
    description: "Authority, duties, and competency requirements for LSOs",
    keyPoints: [
      "Executive authority, not merely advisory",
      "Authority to suspend laser operations",
      "Competency and certification requirements",
      "Hazard evaluation responsibilities",
      "Training program development"
    ],
    isExpanded: true
  },
  {
    id: "sec-4",
    sectionNumber: "4",
    title: "Hazard Evaluation",
    description: "Classification, bioeffects, and exposure calculations",
    keyPoints: [
      "Laser classification system (Class 1-4)",
      "Bioeffects by wavelength region",
      "MPE Tables 5a and 5b",
      "NOHD and NHZ calculations",
      "Controlled area determination"
    ],
    isExpanded: true
  },
  {
    id: "sec-5",
    sectionNumber: "5",
    title: "Control Measures",
    description: "Engineering, administrative, and PPE controls",
    keyPoints: [
      "Engineering controls (interlocks, housings)",
      "Administrative controls (SOPs, training)",
      "PPE requirements and selection",
      "Warning signs and labels",
      "Alignment procedures"
    ]
  },
  {
    id: "sec-6",
    sectionNumber: "6",
    title: "Medical Surveillance",
    description: "Pre-placement exams and post-exposure evaluation",
    keyPoints: [
      "Pre-placement eye examination",
      "Required for Class 3B and 4 users",
      "Post-exposure evaluation procedures",
      "Medical referral criteria",
      "Documentation requirements"
    ]
  },
  {
    id: "sec-7",
    sectionNumber: "7",
    title: "Non-Beam Hazards",
    description: "Electrical, chemical, and associated hazards",
    keyPoints: [
      "Electrical safety requirements",
      "Chemical and dye laser hazards",
      "Laser-generated airborne contaminants",
      "Collateral radiation concerns",
      "Fire safety considerations"
    ]
  }
];

const REFERENCE_CARDS: ReferenceCard[] = [
  {
    title: "NOHD Formula",
    content: "Nominal Ocular Hazard Distance for beam spreading",
    formula: "NOHD = (1/θ) × √(1.27 × P / MPE)",
    reference: "ANSI Z136.1 Section 4.4"
  },
  {
    title: "MPE - Visible CW",
    content: "Maximum Permissible Exposure for visible continuous wave lasers",
    formula: "MPE = 1.8 × t^0.75 mW/cm²",
    reference: "ANSI Z136.1 Table 5a"
  },
  {
    title: "Optical Density",
    content: "Required OD for protective eyewear",
    formula: "OD = log₁₀(H₀/MPE)",
    reference: "ANSI Z136.1 Section 5.3"
  },
  {
    title: "AEL Class 3B",
    content: "Accessible Emission Limit for Class 3B",
    formula: "0.5 W for CW visible lasers",
    reference: "ANSI Z136.1 Table 1"
  }
];

// ============================================================================
// Main Component
// ============================================================================

export function Module1_ANSI_Z136() {
  const [activeTab, setActiveTab] = useState<"overview" | "navigator" | "reference">("overview");
  const [selectedStandard, setSelectedStandard] = useState<Z136Standard | null>(null);
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(Z136_SECTIONS.filter(s => s.isExpanded).map(s => s.id))
  );
  const [bookmarkedCards, setBookmarkedCards] = useState<Set<string>>(new Set());

  const toggleSection = (sectionId: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  const toggleBookmark = (cardId: string) => {
    setBookmarkedCards(prev => {
      const next = new Set(prev);
      if (next.has(cardId)) next.delete(cardId);
      else next.add(cardId);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            Module 8.1: ANSI Z136 Series
          </h2>
          <p className="text-muted-foreground mt-1">
            Comprehensive guide to the ANSI Z136 laser safety standards family
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <GraduationCap className="w-4 h-4 mr-1" />
          Certification Focus
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-1">
        {[
          { id: "overview", label: "Standards Overview", icon: Layers },
          { id: "navigator", label: "Z136.1 Navigator", icon: Search },
          { id: "reference", label: "Quick Reference", icon: FileText }
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
          {/* Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Z136_STANDARDS.map(standard => (
              <Card 
                key={standard.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedStandard?.id === standard.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedStandard(standard)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start gap-3">
                    <div className={cn("p-2 rounded-lg text-white", standard.color)}>
                      {standard.icon}
                    </div>
                    <div className="flex-grow">
                      <Badge variant="secondary" className="mb-1">{standard.designation}</Badge>
                      <CardTitle className="text-base">{standard.title}</CardTitle>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-muted-foreground mb-3">{standard.scope}</p>
                  <div className="flex flex-wrap gap-1">
                    {standard.keyTopics.slice(0, 3).map(topic => (
                      <Badge key={topic} variant="outline" className="text-xs">
                        {topic}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Standard Detail */}
          {selectedStandard && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className={cn("p-2 rounded-lg text-white", selectedStandard.color)}>
                    {selectedStandard.icon}
                  </div>
                  <div>
                    <Badge variant="secondary">{selectedStandard.designation}</Badge>
                    <CardTitle className="text-xl mt-1">{selectedStandard.title}</CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedStandard.scope}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-primary" />
                      Key Topics
                    </h4>
                    <ul className="space-y-1">
                      {selectedStandard.keyTopics.map(topic => (
                        <li key={topic} className="text-sm text-muted-foreground flex items-center gap-2">
                          <span className="w-1 h-1 rounded-full bg-primary" />
                          {topic}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="p-4 bg-muted/50 rounded-lg">
                    <h4 className="font-semibold mb-2 flex items-center gap-2">
                      <GraduationCap className="w-4 h-4 text-primary" />
                      Target Audience
                    </h4>
                    <p className="text-sm text-muted-foreground">{selectedStandard.audience}</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" onClick={() => setSelectedStandard(null)}>
                  Close Details
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}

      {activeTab === "navigator" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sections List */}
          <div className="space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Search className="w-5 h-5 text-primary" />
              Z136.1 Section Navigator
            </h3>
            {Z136_SECTIONS.map(section => (
              <div 
                key={section.id}
                className="border border-border/50 rounded-lg overflow-hidden"
              >
                <button
                  onClick={() => toggleSection(section.id)}
                  className="w-full flex items-center gap-3 p-4 hover:bg-muted/50 transition-colors text-left"
                >
                  {expandedSections.has(section.id) ? (
                    <ChevronDown className="w-4 h-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  )}
                  <Badge variant="outline">{section.sectionNumber}</Badge>
                  <div className="flex-grow">
                    <span className="font-medium">{section.title}</span>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </button>
                
                {expandedSections.has(section.id) && (
                  <div className="px-4 pb-4 pl-16">
                    <ul className="space-y-2">
                      {section.keyPoints.map((point, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary mt-1">•</span>
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Key Concepts */}
          <div className="space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              Key Z136.1 Concepts
            </h3>
            
            <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
              <h4 className="font-semibold text-primary mb-2">Laser Classification System</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <Badge className="bg-green-500">Class 1</Badge>
                  <span>Safe under normal use</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-yellow-500">Class 2</Badge>
                  <span>Blink reflex protection</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-orange-500">Class 3R</Badge>
                  <span>Low risk, normally safe</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-500">Class 3B</Badge>
                  <span>Direct viewing hazard</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className="bg-red-700">Class 4</Badge>
                  <span>Fire and diffuse hazard</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
              <h4 className="font-semibold text-amber-700 mb-2">Critical LSO Responsibilities</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Executive authority (not just advisory)</li>
                <li>• Authority to suspend operations</li>
                <li>• Hazard evaluation and classification</li>
                <li>• Training program development</li>
                <li>• Incident investigation</li>
              </ul>
            </div>

            <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
              <h4 className="font-semibold text-blue-700 mb-2">Control Measure Hierarchy</h4>
              <ol className="text-sm space-y-1 text-muted-foreground">
                <li>1. Engineering Controls (primary)</li>
                <li>2. Administrative Controls (secondary)</li>
                <li>3. Personal Protective Equipment (last resort)</li>
              </ol>
            </div>
          </div>
        </div>
      )}

      {activeTab === "reference" && (
        <div className="space-y-6">
          {/* Formula Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {REFERENCE_CARDS.map((card, index) => (
              <Card key={index} className="relative">
                <button
                  onClick={() => toggleBookmark(`ref-${index}`)}
                  className={cn(
                    "absolute top-4 right-4 p-1.5 rounded transition-colors",
                    bookmarkedCards.has(`ref-${index}`) 
                      ? "text-amber-400" 
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <Bookmark className={cn("w-4 h-4", bookmarkedCards.has(`ref-${index}`) && "fill-current")} />
                </button>
                <CardHeader>
                  <div className="flex items-center gap-2">
                    <Calculator className="w-5 h-5 text-primary" />
                    <CardTitle className="text-base">{card.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-3">{card.content}</p>
                  {card.formula && (
                    <code className="block bg-muted px-3 py-2 rounded text-sm font-mono">
                      {card.formula}
                    </code>
                  )}
                  <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                    <ExternalLink className="w-3 h-3" />
                    {card.reference}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Important Notes */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-amber-500" />
                Certification Exam Notes
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                The following topics from ANSI Z136.1 are frequently tested on CLSO and CMLSO examinations:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  "LSO authority and responsibilities (Section 3)",
                  "Laser classification criteria (Section 4.1)",
                  "MPE table interpretation (Tables 5a/5b)",
                  "NOHD calculation methodology (Section 4.4)",
                  "Control measure requirements (Section 5)",
                  "Medical surveillance requirements (Section 6)"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Module1_ANSI_Z136;
