"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ICSRole {
  id: string;
  title: string;
  shortTitle: string;
  section: string;
  description: string;
  responsibilities: string[];
  authorityLevel: string;
  reportsTo: string;
  keyDecisions: string[];
  icon: string;
  color: string;
  bgColor: string;
}

const icsSections = [
  { id: "command", name: "Command", color: "text-red-600", bgColor: "bg-red-50", description: "Overall incident management and strategy" },
  { id: "operations", name: "Operations", color: "text-green-600", bgColor: "bg-green-50", description: "Tactical operations execution" },
  { id: "planning", name: "Planning", color: "text-blue-600", bgColor: "bg-blue-50", description: "Information management and incident action planning" },
  { id: "logistics", name: "Logistics", color: "text-orange-600", bgColor: "bg-orange-50", description: "Resources, facilities, and services" },
  { id: "finance", name: "Finance/Admin", color: "text-purple-600", bgColor: "bg-purple-50", description: "Cost tracking and administrative support" },
];

const icsRoles: ICSRole[] = [
  {
    id: "incident-commander",
    title: "Incident Commander",
    shortTitle: "IC",
    section: "command",
    description: "Overall responsibility for incident management, strategy, and resource allocation.",
    responsibilities: [
      "Assess situation and establish incident objectives",
      "Approve Incident Action Plan",
      "Establish Command Post location",
      "Coordinate with agency officials",
      "Authorize resource requests",
      "Declare major incident and request mutual aid",
    ],
    authorityLevel: "Full Authority",
    reportsTo: "Agency Executive / Elected Official",
    keyDecisions: ["Evacuation vs. Shelter-in-Place", "Resource Priority Allocation", "Unified Command Structure", "Public Information Release"],
    icon: "👑",
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
  {
    id: "safety-officer",
    title: "Safety Officer",
    shortTitle: "SO",
    section: "command",
    description: "Monitors safety conditions and has authority to stop unsafe operations immediately.",
    responsibilities: [
      "Identify and mitigate hazardous situations",
      "Exercise emergency authority to stop unsafe acts",
      "Review Incident Action Plan for safety implications",
      "Conduct safety briefings",
      "Investigate accidents within incident",
      "Coordinate with agency safety programs",
    ],
    authorityLevel: "Emergency Stop Authority",
    reportsTo: "Incident Commander",
    keyDecisions: ["Suspension of Operations", "PPE Requirements", "Safety Zone Establishment"],
    icon: "🛡️",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
  {
    id: "public-info-officer",
    title: "Public Information Officer",
    shortTitle: "PIO",
    section: "command",
    description: "Serves as conduit for information to media and public.",
    responsibilities: [
      "Develop accurate, accessible information",
      "Conduct media briefings",
      "Monitor and correct misinformation",
      "Coordinate with Joint Information Center",
      "Manage social media communications",
      "Prepare public safety announcements",
    ],
    authorityLevel: "Limited",
    reportsTo: "Incident Commander",
    keyDecisions: ["Message Timing", "Media Access", "Information Release Approval"],
    icon: "📢",
    color: "text-red-400",
    bgColor: "bg-red-50",
  },
  {
    id: "operations-chief",
    title: "Operations Section Chief",
    shortTitle: "OSC",
    section: "operations",
    description: "Directs all tactical operations to carry out the Incident Action Plan.",
    responsibilities: [
      "Manage tactical operations",
      "Direct resources toward incident objectives",
      "Coordinate operations across branches/divisions",
      "Request additional resources as needed",
      "Ensure operational safety",
      "Brief Incident Commander on operations status",
    ],
    authorityLevel: "Significant",
    reportsTo: "Incident Commander",
    keyDecisions: ["Tactical Resource Deployment", "Operational Priorities", "Staging Area Location"],
    icon: "⚙️",
    color: "text-green-600",
    bgColor: "bg-green-50",
  },
  {
    id: "planning-chief",
    title: "Planning Section Chief",
    shortTitle: "PSC",
    section: "planning",
    description: "Collects, evaluates, and disseminates information and prepares the Incident Action Plan.",
    responsibilities: [
      "Collect and manage incident information",
      "Track resource status",
      "Prepare Incident Action Plan",
      "Conduct planning meetings",
      "Maintain documentation",
      "Develop incident forecasts",
    ],
    authorityLevel: "Limited",
    reportsTo: "Incident Commander",
    keyDecisions: ["Information Collection Priority", "Planning Meeting Schedule", "Demobilization Planning"],
    icon: "📋",
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "logistics-chief",
    title: "Logistics Section Chief",
    shortTitle: "LSC",
    section: "logistics",
    description: "Provides resources and services to support incident operations.",
    responsibilities: [
      "Order and track resources",
      "Set up and manage facilities",
      "Provide communication support",
      "Coordinate transportation",
      "Manage supplies and equipment",
      "Arrange food and medical services",
    ],
    authorityLevel: "Significant",
    reportsTo: "Incident Commander",
    keyDecisions: ["Resource Ordering Priority", "Facility Location", "Transportation Routes"],
    icon: "🚚",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
  },
  {
    id: "finance-chief",
    title: "Finance/Admin Section Chief",
    shortTitle: "FSC",
    section: "finance",
    description: "Monitors costs and provides accounting and procurement services.",
    responsibilities: [
      "Track all incident costs",
      "Process procurement requests",
      "Manage contracts",
      "Document compensation claims",
      "Ensure proper time recording",
      "Prepare cost recovery documentation",
    ],
    authorityLevel: "Limited",
    reportsTo: "Incident Commander",
    keyDecisions: ["Cost Documentation Requirements", "Contract Authorization", "Resource Rental Agreements"],
    icon: "💰",
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
];

export const NIMSICSRoleExplorer: React.FC = () => {
  const [selectedRole, setSelectedRole] = useState<ICSRole>(icsRoles[0]);
  const [viewMode, setViewMode] = useState<"chart" | "detail">("chart");

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">NIMS/ICS Role Explorer</h2>
        <p className="text-muted-foreground">Interactive organizational chart for Incident Command System</p>
      </div>

      {/* View Toggle */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg inline-flex">
          {[
            { id: "chart", label: "Org Chart" },
            { id: "detail", label: "Role Details" },
          ].map((v) => (
            <button
              key={v.id}
              onClick={() => setViewMode(v.id as any)}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-all",
                viewMode === v.id ? "bg-card text-blue-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {v.label}
            </button>
          ))}
        </div>
      </div>

      {viewMode === "chart" ? (
        /* Organization Chart View */
        <div className="space-y-6">
          {/* Command Section */}
          <div>
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-3">Command Section</h3>
            <div className="grid grid-cols-4 gap-4">
              {icsRoles
                .filter((r) => r.section === "command")
                .map((role) => (
                  <button
                    key={role.id}
                    onClick={() => {
                      setSelectedRole(role);
                      setViewMode("detail");
                    }}
                    className={cn(
                      "p-4 rounded-lg border-2 text-center transition-all hover:shadow-md",
                      role.bgColor,
                      `border-${role.color.replace("text-", "").replace("600", "200")}`
                    )}
                  >
                    <div className="text-3xl mb-2">{role.icon}</div>
                    <div className={cn("font-semibold text-sm", role.color)}>{role.shortTitle}</div>
                    <div className="text-xs text-muted-foreground mt-1">{role.title}</div>
                  </button>
                ))}
            </div>
          </div>

          {/* Other Sections */}
          <div className="grid grid-cols-4 gap-4">
            {icsSections
              .filter((s) => s.id !== "command")
              .map((section) => (
                <div key={section.id}>
                  <h3 className={cn("text-sm font-semibold uppercase tracking-wide mb-3", section.color)}>{section.name} Section</h3>
                  {icsRoles
                    .filter((r) => r.section === section.id)
                    .map((role) => (
                      <button
                        key={role.id}
                        onClick={() => {
                          setSelectedRole(role);
                          setViewMode("detail");
                        }}
                        className={cn(
                          "w-full p-4 rounded-lg border-2 text-center transition-all hover:shadow-md",
                          role.bgColor,
                          `border-${role.color.replace("text-", "").replace("600", "200")}`
                        )}
                      >
                        <div className="text-3xl mb-2">{role.icon}</div>
                        <div className={cn("font-semibold text-sm", role.color)}>{role.shortTitle}</div>
                        <div className="text-xs text-muted-foreground mt-1">{role.title}</div>
                      </button>
                    ))}
                </div>
              ))}
          </div>
        </div>
      ) : (
        /* Role Detail View */
        <Card className={cn("border-2", selectedRole.bgColor.replace("50", "200"))}>
          <CardHeader className={selectedRole.bgColor}>
            <div className="flex items-center gap-4">
              <span className="text-5xl">{selectedRole.icon}</span>
              <div>
                <CardTitle className={selectedRole.color}>{selectedRole.title}</CardTitle>
                <CardDescription className={selectedRole.color}>
                  {icsSections.find((s) => s.id === selectedRole.section)?.name} Section
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-foreground mb-2">Description</h4>
                <p className="text-muted-foreground mb-4">{selectedRole.description}</p>

                <h4 className="font-semibold text-foreground mb-2">Authority Level</h4>
                <p className={cn("font-medium", selectedRole.color)}>{selectedRole.authorityLevel}</p>
                <p className="text-sm text-muted-foreground">Reports to: {selectedRole.reportsTo}</p>

                <h4 className="font-semibold text-foreground mb-2 mt-4">Key Decisions</h4>
                <ul className="space-y-1">
                  {selectedRole.keyDecisions.map((decision, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-center">
                      <span className="mr-2">•</span>
                      {decision}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-semibold text-foreground mb-2">Responsibilities</h4>
                <ul className="space-y-2">
                  {selectedRole.responsibilities.map((resp, idx) => (
                    <li key={idx} className="text-sm text-muted-foreground flex items-start">
                      <span className="mr-2 mt-1">•</span>
                      {resp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button
              onClick={() => setViewMode("chart")}
              className="mt-6 text-blue-600 hover:text-blue-800 font-medium"
            >
              ← Back to Organization Chart
            </button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NIMSICSRoleExplorer;
