"use client";

import React, { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  ChevronDown, 
  Search, 
  BookOpen,
  Calculator,
  Shield,
  UserCheck,
  Activity,
  FileText,
  Stethoscope,
  X,
  ExternalLink,
  Bookmark
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface Z136Section {
  id: string;
  sectionNumber: string;
  title: string;
  icon?: React.ReactNode;
  description: string;
  subsections?: Z136Subsection[];
  quickRef?: QuickReferenceCard[];
  isExpanded?: boolean;
  isBookmarked?: boolean;
}

export interface Z136Subsection {
  id: string;
  subsectionNumber: string;
  title: string;
  content: string;
  keyTerms?: string[];
  isImportant?: boolean;
}

export interface QuickReferenceCard {
  id?: string;
  title: string;
  content: string;
  formula?: string;
}

export interface Z136NavigatorProps {
  sections?: Z136Section[];
  onBookmark?: (sectionId: string) => void;
  onSectionSelect?: (section: Z136Section) => void;
  className?: string;
}

// ============================================================================
// Default Data - Z136.1 Structure
// ============================================================================

export const DEFAULT_Z136_SECTIONS: Z136Section[] = [
  {
    id: "sec1",
    sectionNumber: "1-2",
    title: "Scope, Purpose, and Definitions",
    icon: <BookOpen className="w-5 h-5" />,
    description: "Establishes the foundation for laser safety programs",
    subsections: [
      {
        id: "1.1",
        subsectionNumber: "1.1",
        title: "Purpose and Application",
        content: "This standard provides reasonable and adequate guidance for the safe use of lasers and laser systems. It applies to all laser applications except when specific regulations take precedence.",
        keyTerms: ["Laser Safety", "MPE", "AEL"],
        isImportant: true,
      },
      {
        id: "1.2",
        subsectionNumber: "1.2",
        title: "Key Definitions",
        content: "Critical terms including Maximum Permissible Exposure (MPE), Accessible Emission Limit (AEL), Nominal Ocular Hazard Distance (NOHD), and Nominal Hazard Zone (NHZ).",
        keyTerms: ["MPE", "NOHD", "Accessible Emission", "AEL", "NHZ"],
        isImportant: true,
      },
    ],
    quickRef: [
      {
        title: "MPE Definition",
        content: "The level of laser radiation to which a person may be exposed without hazardous effect or adverse biological changes in the eye or skin.",
      },
    ],
  },
  {
    id: "sec3",
    sectionNumber: "3",
    title: "Laser Safety Officer Responsibilities",
    icon: <UserCheck className="w-5 h-5" />,
    description: "Authority, duties, and competency requirements for LSOs",
    isExpanded: true,
    subsections: [
      {
        id: "3.1",
        subsectionNumber: "3.1",
        title: "Authority and Duties",
        content: "The LSO has executive responsibility for laser safety, not merely advisory. The LSO has the authority to enforce the laser safety program, monitor compliance, and suspend operations if necessary.",
        keyTerms: ["Executive Responsibility", "Authority", "Enforcement"],
        isImportant: true,
      },
      {
        id: "3.2",
        subsectionNumber: "3.2",
        title: "Competency Requirements",
        content: "LSOs must demonstrate knowledge of laser principles, bioeffects, hazard evaluation, control measures, and applicable standards. Certification (CLSO/CMLSO) is recommended.",
        keyTerms: ["CLSO", "CMLSO", "Competency"],
      },
      {
        id: "3.3",
        subsectionNumber: "3.3",
        title: "Specific Responsibilities",
        content: "Hazard evaluation, classification assistance, control measure specification, training program development, incident investigation, and program audits.",
        keyTerms: ["Hazard Evaluation", "Training", "Incident Investigation"],
        isImportant: true,
      },
    ],
  },
  {
    id: "sec4",
    sectionNumber: "4",
    title: "Hazard Evaluation",
    icon: <Activity className="w-5 h-5" />,
    description: "Classification, bioeffects, and exposure calculations",
    isExpanded: true,
    subsections: [
      {
        id: "4.1",
        subsectionNumber: "4.1",
        title: "Laser Classification",
        content: "Classification system (Class 1, 1M, 2, 2M, 3R, 3B, 4) based on accessible emission limits and hazard potential.",
        keyTerms: ["Class 1", "Class 3B", "Class 4", "AEL"],
        isImportant: true,
      },
      {
        id: "4.2",
        subsectionNumber: "4.2",
        title: "Bioeffects",
        content: "Ocular effects (retinal, corneal, cataractogenic) and skin effects (thermal, photochemical) by wavelength region.",
        keyTerms: ["Retinal Hazard", "Corneal Damage", "Photochemical"],
      },
      {
        id: "4.3",
        subsectionNumber: "4.3",
        title: "MPE Tables",
        content: "Tables 5a and 5b provide MPE values for ocular and skin exposure across all wavelength regions and exposure durations.",
        keyTerms: ["Table 5a", "Table 5b", "MPE Values"],
        isImportant: true,
      },
      {
        id: "4.4",
        subsectionNumber: "4.4",
        title: "Hazard Analysis",
        content: "NOHD, NHZ, and controlled area calculations based on laser parameters and exposure conditions.",
        keyTerms: ["NOHD", "NHZ", "Controlled Area"],
        isImportant: true,
      },
    ],
    quickRef: [
      {
        title: "NOHD Formula",
        content: "Nominal Ocular Hazard Distance",
        formula: "NOHD = (1/θ) × √(1.27 × P / MPE)",
      },
      {
        id: "mpe-ref",
        title: "MPE Quick Reference",
        content: "Visible (400-700nm) continuous wave",
        formula: "1.8 × t^0.75 mW/cm²",
      },
    ],
  },
  {
    id: "sec5",
    sectionNumber: "5",
    title: "Control Measures",
    icon: <Shield className="w-5 h-5" />,
    description: "Engineering, administrative, and PPE controls",
    subsections: [
      {
        id: "5.1",
        subsectionNumber: "5.1",
        title: "Engineering Controls",
        content: "Protective housings, interlocks, remote interlock connectors, key controls, beam attenuators, emission indicators.",
        keyTerms: ["Protective Housing", "Interlocks", "Beam Attenuator"],
        isImportant: true,
      },
      {
        id: "5.2",
        subsectionNumber: "5.2",
        title: "Administrative Controls",
        content: "Standard Operating Procedures (SOPs), alignment procedures, training requirements, authorized personnel, warning signs.",
        keyTerms: ["SOP", "Alignment Procedures", "Training"],
      },
      {
        id: "5.3",
        subsectionNumber: "5.3",
        title: "PPE Requirements",
        content: "Protective eyewear selection based on optical density requirements, wavelength coverage, and comfort factors.",
        keyTerms: ["Optical Density", "OD", "Eyewear"],
        isImportant: true,
      },
    ],
  },
  {
    id: "sec6",
    sectionNumber: "6",
    title: "Medical Surveillance",
    icon: <Stethoscope className="w-5 h-5" />,
    description: "Pre-placement exams and post-exposure evaluation",
    subsections: [
      {
        id: "6.1",
        subsectionNumber: "6.1",
        title: "Pre-Placement Exams",
        content: "Baseline eye examination requirements for personnel working with Class 3B and Class 4 lasers.",
        keyTerms: ["Baseline Exam", "Retinal Assessment"],
      },
      {
        id: "6.2",
        subsectionNumber: "6.2",
        title: "Post-Exposure Evaluation",
        content: "Follow-up procedures for suspected or actual laser exposure incidents.",
        keyTerms: ["Exposure Incident", "Medical Follow-up"],
      },
    ],
  },
  {
    id: "sec7",
    sectionNumber: "7",
    title: "Non-Beam Hazards",
    icon: <FileText className="w-5 h-5" />,
    description: "Electrical, chemical, and other associated hazards",
    subsections: [
      {
        id: "7.1",
        subsectionNumber: "7.1",
        title: "Electrical Safety",
        content: "Capacitor hazards, high voltage precautions, and electrical code compliance.",
      },
      {
        id: "7.2",
        subsectionNumber: "7.2",
        title: "Chemical Hazards",
        content: "Dye lasers, laser-generated airborne contaminants, and hazardous materials.",
      },
      {
        id: "7.3",
        subsectionNumber: "7.3",
        title: "Collateral Radiation",
        content: "UV, plasma, and other non-laser radiation associated with laser operation.",
      },
    ],
  },
];

// ============================================================================
// Main Component
// ============================================================================

export function Z136Navigator({
  sections = DEFAULT_Z136_SECTIONS,
  onBookmark,
  onSectionSelect,
  className,
}: Z136NavigatorProps) {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    () => new Set(sections.filter((s) => s.isExpanded).map((s) => s.id))
  );
  const [bookmarkedSections, setBookmarkedSections] = useState<Set<string>>(new Set());
  const [selectedSubsection, setSelectedSubsection] = useState<Z136Subsection | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"content" | "bookmarks">("content");

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  };

  const toggleBookmark = (sectionId: string) => {
    setBookmarkedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
    onBookmark?.(sectionId);
  };

  const filteredSections = useMemo(() => {
    if (!searchQuery) return sections;
    
    return sections.filter((section) => {
      const matchesSection = 
        section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesSubsection = section.subsections?.some(
        (sub) =>
          sub.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sub.keyTerms?.some((term) => term.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      
      return matchesSection || matchesSubsection;
    });
  }, [sections, searchQuery]);

  const bookmarkedSectionsList = sections.filter((s) => bookmarkedSections.has(s.id));

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-2 gap-6", className)}>
      {/* Navigation Panel */}
      <Card className="h-fit">
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" />
            ANSI Z136.1 Navigator
          </CardTitle>

          {/* Tabs */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => setActiveTab("content")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                activeTab === "content" ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              Sections
            </button>
            <button
              onClick={() => setActiveTab("bookmarks")}
              className={cn(
                "px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                activeTab === "bookmarks" ? "bg-primary text-primary-foreground" : "bg-muted"
              )}
            >
              Bookmarks
              {bookmarkedSections.size > 0 && (
                <Badge variant="secondary" className="text-xs">
                  {bookmarkedSections.size}
                </Badge>
              )}
            </button>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search sections, terms..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-muted border border-border text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent className="space-y-2">
          {activeTab === "content" ? (
            filteredSections.map((section) => (
              <SectionItem
                key={section.id}
                section={section}
                isExpanded={expandedSections.has(section.id)}
                isBookmarked={bookmarkedSections.has(section.id)}
                onToggle={() => toggleSection(section.id)}
                onBookmark={() => toggleBookmark(section.id)}
                onSubsectionSelect={setSelectedSubsection}
                searchQuery={searchQuery}
              />
            ))
          ) : bookmarkedSectionsList.length > 0 ? (
            bookmarkedSectionsList.map((section) => (
              <SectionItem
                key={section.id}
                section={section}
                isExpanded={expandedSections.has(section.id)}
                isBookmarked={true}
                onToggle={() => toggleSection(section.id)}
                onBookmark={() => toggleBookmark(section.id)}
                onSubsectionSelect={setSelectedSubsection}
                searchQuery={searchQuery}
              />
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No bookmarks yet. Click the bookmark icon on any section to save it.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Panel */}
      <DetailPanel subsection={selectedSubsection} />
    </div>
  );
}

// ============================================================================
// Section Item Component
// ============================================================================

interface SectionItemProps {
  section: Z136Section;
  isExpanded: boolean;
  isBookmarked: boolean;
  onToggle: () => void;
  onBookmark: () => void;
  onSubsectionSelect: (subsection: Z136Subsection) => void;
  searchQuery: string;
}

function SectionItem({
  section,
  isExpanded,
  isBookmarked,
  onToggle,
  onBookmark,
  onSubsectionSelect,
  searchQuery,
}: SectionItemProps) {
  const hasSubsections = section.subsections && section.subsections.length > 0;
  const hasQuickRef = section.quickRef && section.quickRef.length > 0;

  return (
    <div className="border border-border/50 rounded-lg overflow-hidden">
      {/* Section Header */}
      <div
        className={cn(
          "flex items-center gap-3 p-3 cursor-pointer transition-colors",
          "hover:bg-muted/50",
          isExpanded && "bg-muted/30"
        )}
        onClick={onToggle}
      >
        {hasSubsections && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
            className="p-1 rounded hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        )}

        <div className="text-primary font-medium">{section.icon}</div>

        <div className="flex-grow min-w-0">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs flex-shrink-0">
              {section.sectionNumber}
            </Badge>
            <span className="font-medium truncate">{section.title}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{section.description}</p>
        </div>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onBookmark();
          }}
          className={cn(
            "p-1.5 rounded transition-colors",
            isBookmarked ? "text-amber-400" : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Bookmark className={cn("w-4 h-4", isBookmarked && "fill-current")} />
        </button>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="border-t border-border/50">
          {/* Subsections */}
          {section.subsections?.map((subsection) => (
            <button
              key={subsection.id}
              onClick={() => onSubsectionSelect(subsection)}
              className={cn(
                "w-full text-left px-4 py-2 hover:bg-muted/50 transition-colors",
                "border-b border-border/30 last:border-b-0"
              )}
            >
              <div className="flex items-start gap-2">
                <span className="text-xs text-muted-foreground mt-0.5">{subsection.subsectionNumber}</span>
                <div className="flex-grow">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{subsection.title}</span>
                    {subsection.isImportant && (
                      <Badge variant="secondary" className="text-xs">Important</Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">
                    {highlightSearch(subsection.content, searchQuery)}
                  </p>
                  {subsection.keyTerms && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {subsection.keyTerms.slice(0, 3).map((term) => (
                        <span key={term} className="text-xs text-primary">
                          {term}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}

          {/* Quick Reference */}
          {hasQuickRef && (
            <div className="px-4 py-3 bg-muted/30">
              <div className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
                <Calculator className="w-3 h-3" />
                Quick Reference
              </div>
              <div className="space-y-2">
                {section.quickRef?.map((ref, i) => (
                  <div key={i} className="bg-card p-2 rounded border border-border/50 text-sm">
                    <div className="font-medium">{ref.title}</div>
                    {ref.formula ? (
                      <code className="text-xs bg-muted px-1.5 py-0.5 rounded mt-1 block">
                        {ref.formula}
                      </code>
                    ) : (
                      <p className="text-xs text-muted-foreground mt-0.5">{ref.content}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Detail Panel Component
// ============================================================================

function DetailPanel({ subsection }: { subsection: Z136Subsection | null }) {
  if (!subsection) {
    return (
      <Card className="h-fit">
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Select a section from the navigator to view detailed content
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Browse through ANSI Z136.1 sections using the panel on the left
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <Badge variant="outline" className="mb-2">
              Section {subsection.subsectionNumber}
            </Badge>
            <CardTitle className="text-xl">{subsection.title}</CardTitle>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Main Content */}
        <div className="prose prose-invert max-w-none">
          <p className="text-foreground leading-relaxed">{subsection.content}</p>
        </div>

        {/* Key Terms */}
        {subsection.keyTerms && subsection.keyTerms.length > 0 && (
          <div>
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Key Terms
            </h4>
            <div className="flex flex-wrap gap-2">
              {subsection.keyTerms.map((term) => (
                <Badge key={term} variant="secondary">
                  {term}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Important Badge */}
        {subsection.isImportant && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-lg">
            <div className="flex items-center gap-2 text-amber-400 font-medium">
              <Bookmark className="w-4 h-4" />
              Important for Certification
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              This topic is frequently tested on CLSO and CMLSO examinations.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Helper Functions
// ============================================================================

function highlightSearch(text: string, query: string): React.ReactNode {
  if (!query) return text;
  
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-primary/30 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

export default Z136Navigator;
