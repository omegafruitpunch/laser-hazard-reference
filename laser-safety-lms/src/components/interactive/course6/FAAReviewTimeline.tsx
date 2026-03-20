"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TimelineStage {
  id: string;
  title: string;
  duration: string;
  description: string;
  details: string[];
  responsible: string;
  outputs: string[];
  icon: string;
}

interface DeterminationOutcome {
  type: "no_objection" | "objection" | "conditional";
  title: string;
  description: string;
  conditions?: string[];
  icon: string;
  color: string;
  bgColor: string;
}

const timelineStages: TimelineStage[] = [
  {
    id: "submission",
    title: "Form 7140-1 Submission",
    duration: "Day 0",
    description: "Proponent submits completed Form 7140-1 to appropriate FAA Service Center",
    details: [
      "Submit at least 30 days before planned operation",
      "Include Laser Configuration Worksheet for each configuration",
      "Attach diagrams showing planned laser paths",
      "List all control measures in detail",
      "Provide calculation documentation if using alternative methods",
    ],
    responsible: "Laser Proponent/Operator",
    outputs: ["Completed Form 7140-1", "Supporting documentation", "Laser Configuration Worksheets"],
    icon: "📝",
  },
  {
    id: "intake",
    title: "Initial Intake & Review",
    duration: "Days 1-3",
    description: "FAA Service Center reviews submission for completeness and clarity",
    details: [
      "Verify all required fields completed",
      "Check calculations for obvious errors",
      "Identify missing information or attachments",
      "Assign tracking number to submission",
      "Enter into FAA tracking system",
    ],
    responsible: "FAA Service Center Staff",
    outputs: ["Intake confirmation", "Information requests (if needed)"],
    icon: "📋",
  },
  {
    id: "verification",
    title: "Data Verification",
    duration: "Days 3-7",
    description: "FAA contacts proponent if questions or clarifications are needed",
    details: [
      "FAA may contact proponent for additional information",
      "Verify laser specifications and hazard calculations",
      "Confirm control measures are adequate",
      "Review beam direction and airspace coverage",
      "Validate geographic coordinates and elevations",
    ],
    responsible: "FAA Technical Staff",
    outputs: ["Clarification requests", "Technical review notes"],
    icon: "🔍",
  },
  {
    id: "aeronautical",
    title: "Aeronautical Study",
    duration: "Days 7-20",
    description: "Comprehensive evaluation of potential aviation safety impacts",
    details: [
      "Analyze proposed operation against airspace structure",
      "Identify affected airports and flight paths",
      "Evaluate proximity to approach/departure corridors",
      "Assess impact on air traffic operations",
      "Review for conflicts with other airspace users",
      "Coordinate with Air Traffic facilities as needed",
    ],
    responsible: "FAA Service Center Specialists",
    outputs: ["Aeronautical study report", "Risk assessment", "Coordination memos"],
    icon: "✈️",
  },
  {
    id: "coordination",
    title: "Stakeholder Coordination",
    duration: "Days 15-25",
    description: "FAA coordinates with potentially affected aviation parties",
    details: [
      "Notify affected Air Traffic Control facilities",
      "Coordinate with airport operators if applicable",
      "Consult with flight standards if needed",
      "Engage Department of Defense for military airspace",
      "Notify other federal agencies as required",
    ],
    responsible: "FAA Service Center / ATO",
    outputs: ["Coordination responses", "Stakeholder comments", "Agreement documentation"],
    icon: "🤝",
  },
  {
    id: "determination",
    title: "Letter of Determination",
    duration: "Days 20-30",
    description: "FAA issues final determination on the proposed operation",
    details: [
      "Compile all review findings and stakeholder input",
      "Draft Letter of Determination (LOD)",
      "Obtain management approval",
      "Issue LOD to proponent",
      "Document determination in FAA records",
    ],
    responsible: "FAA Service Center Manager",
    outputs: ["Letter of Determination (LOD)", "Conditions or restrictions (if any)"],
    icon: "📜",
  },
];

const determinationOutcomes: DeterminationOutcome[] = [
  {
    type: "no_objection",
    title: "No Objection",
    description: "FAA has no objection to the proposed laser operation as submitted.",
    conditions: [
      "Operation must proceed as described in Form 7140-1",
      "All control measures must be implemented as specified",
      "Any changes require FAA notification",
      "Operator must maintain 24/7 contact capability during operation",
    ],
    icon: "✅",
    color: "text-green-700",
    bgColor: "bg-green-50",
  },
  {
    type: "conditional",
    title: "Conditional Approval",
    description: "FAA has no objection provided specific conditions are met.",
    conditions: [
      "Additional control measures may be required",
      "Restricted operating hours or dates",
      "Modified beam directions or elevation angles",
      "Additional coordination with ATC required",
      "Enhanced observer requirements",
      "Weather-related restrictions",
    ],
    icon: "⚠️",
    color: "text-yellow-700",
    bgColor: "bg-yellow-50",
  },
  {
    type: "objection",
    title: "Objection",
    description: "FAA objects to the proposed laser operation due to unacceptable aviation safety risks.",
    conditions: [
      "Operation poses unacceptable risk to aviation safety",
      "Inadequate control measures for the proposed airspace",
      "Conflicts with critical flight operations",
      "Proponent may revise and resubmit with modifications",
      "Consider alternative locations or reduced power levels",
    ],
    icon: "❌",
    color: "text-red-700",
    bgColor: "bg-red-50",
  },
];

export const FAAReviewTimeline: React.FC = () => {
  const [activeStage, setActiveStage] = useState<string>("submission");
  const [showOutcomes, setShowOutcomes] = useState(false);
  const [selectedOutcome, setSelectedOutcome] = useState<DeterminationOutcome | null>(null);

  const activeStageData = timelineStages.find((s) => s.id === activeStage);
  const activeIndex = timelineStages.findIndex((s) => s.id === activeStage);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">FAA Review Process Timeline</h2>
        <p className="text-muted-foreground">Understanding the journey from Form 7140-1 submission to Letter of Determination</p>
      </div>

      {/* Timeline Visual */}
      <div className="relative py-8">
        {/* Timeline Bar */}
        <div className="absolute top-12 left-0 right-0 h-1 bg-gray-200 rounded" />
        <div
          className="absolute top-12 left-0 h-1 bg-blue-600 rounded transition-all duration-500"
          style={{ width: `${((activeIndex + 1) / timelineStages.length) * 100}%` }}
        />

        {/* Timeline Points */}
        <div className="relative flex justify-between">
          {timelineStages.map((stage, index) => (
            <button
              key={stage.id}
              onClick={() => setActiveStage(stage.id)}
              className={cn(
                "flex flex-col items-center focus:outline-none transition-all",
                activeStage === stage.id ? "scale-110" : "hover:scale-105"
              )}
            >
              <div
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-xl border-4 transition-all",
                  index <= activeIndex
                    ? "bg-blue-600 border-blue-600 text-white"
                    : "bg-card border-gray-300 text-muted-foreground"
                )}
              >
                {index < activeIndex ? "✓" : stage.icon}
              </div>
              <span
                className={cn(
                  "mt-2 text-xs font-medium text-center max-w-24",
                  activeStage === stage.id ? "text-blue-600" : "text-muted-foreground"
                )}
              >
                {stage.title.split(" ").slice(0, 2).join(" ")}
              </span>
              <span className="text-xs text-muted-foreground">{stage.duration}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Active Stage Details */}
      {activeStageData && (
        <Card className="border-2 border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-blue-700 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-4xl">{activeStageData.icon}</span>
                <div>
                  <CardTitle className="text-white">{activeStageData.title}</CardTitle>
                  <CardDescription className="text-blue-100">{activeStageData.duration}</CardDescription>
                </div>
              </div>
              <span className="bg-card/20 px-3 py-1 rounded-full text-sm">{activeStageData.responsible}</span>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-3">Description</h4>
                <p className="text-muted-foreground mb-4">{activeStageData.description}</p>

                <h4 className="font-semibold text-foreground mb-3">Key Activities</h4>
                <ul className="space-y-2">
                  {activeStageData.details.map((detail, idx) => (
                    <li key={idx} className="flex items-start text-sm text-muted-foreground">
                      <span className="w-2 h-2 bg-blue-400 rounded-full mt-1.5 mr-3 flex-shrink-0" />
                      {detail}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-3">Outputs</h4>
                <ul className="space-y-2 mb-6">
                  {activeStageData.outputs.map((output, idx) => (
                    <li key={idx} className="flex items-center text-sm text-muted-foreground bg-muted p-2 rounded">
                      <span className="text-green-500 mr-2">→</span>
                      {output}
                    </li>
                  ))}
                </ul>

                {/* Tips for this stage */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <h5 className="font-semibold text-yellow-800 text-sm mb-2">Pro Tip</h5>
                  {activeStageData.id === "submission" && (
                    <p className="text-xs text-yellow-700">Submit at least 30 days in advance. Earlier is better for complex operations.</p>
                  )}
                  {activeStageData.id === "intake" && (
                    <p className="text-xs text-yellow-700">Ensure all fields are filled - incomplete forms cause delays.</p>
                  )}
                  {activeStageData.id === "verification" && (
                    <p className="text-xs text-yellow-700">Respond promptly to FAA requests to keep your timeline on track.</p>
                  )}
                  {activeStageData.id === "aeronautical" && (
                    <p className="text-xs text-yellow-700">This is the critical evaluation phase - be patient while FAA ensures safety.</p>
                  )}
                  {activeStageData.id === "coordination" && (
                    <p className="text-xs text-yellow-700">Multiple agencies may need to review - this takes time but ensures safety.</p>
                  )}
                  {activeStageData.id === "determination" && (
                    <p className="text-xs text-yellow-700">Do NOT operate until you receive the LOD with "no objection".</p>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Determination Outcomes Section */}
      <Card>
        <CardHeader
          className="cursor-pointer hover:bg-muted"
          onClick={() => setShowOutcomes(!showOutcomes)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-3xl">📜</span>
              <div>
                <CardTitle>Possible Determination Outcomes</CardTitle>
                <CardDescription>Click to explore the three types of Letters of Determination</CardDescription>
              </div>
            </div>
            <svg
              className={cn("w-6 h-6 text-muted-foreground transition-transform", showOutcomes && "rotate-180")}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </CardHeader>

        {showOutcomes && (
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              {determinationOutcomes.map((outcome) => (
                <button
                  key={outcome.type}
                  onClick={() => setSelectedOutcome(outcome)}
                  className={cn(
                    "p-4 rounded-lg border-2 text-left transition-all",
                    selectedOutcome?.type === outcome.type
                      ? `border-current ${outcome.bgColor}`
                      : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <span className="text-3xl mb-2 block">{outcome.icon}</span>
                  <h4 className={cn("font-semibold", outcome.color)}>{outcome.title}</h4>
                </button>
              ))}
            </div>

            {selectedOutcome && (
              <div className={cn("rounded-lg p-6 border", selectedOutcome.bgColor)}>
                <h4 className={cn("text-xl font-bold mb-3 flex items-center", selectedOutcome.color)}>
                  <span className="text-2xl mr-2">{selectedOutcome.icon}</span>
                  {selectedOutcome.title}
                </h4>
                <p className={cn("mb-4", selectedOutcome.color)}>{selectedOutcome.description}</p>

                <h5 className={cn("font-semibold mb-2", selectedOutcome.color)}>Key Points:</h5>
                <ul className="space-y-2">
                  {selectedOutcome.conditions?.map((condition, idx) => (
                    <li key={idx} className={cn("flex items-start text-sm", selectedOutcome.color)}>
                      <span className="mr-2">•</span>
                      {condition}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default FAAReviewTimeline;
