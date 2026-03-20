"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  FileText, 
  Network, 
  Users,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  ExternalLink,
  BookOpen,
  Globe,
  Settings,
  Workflow,
  Layers
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ESTAStandard {
  id: string;
  designation: string;
  title: string;
  description: string;
  status: "active" | "draft" | "superseded";
  category: string;
  keyPoints: string[];
}

interface TSPProcess {
  stage: string;
  description: string;
  duration: string;
  stakeholders: string[];
}

interface ACNProtocol {
  layer: string;
  name: string;
  function: string;
  protocols: string[];
}

// ============================================================================
// Data Constants
// ============================================================================

const ESTA_STANDARDS: ESTAStandard[] = [
  {
    id: "e1-17",
    designation: "ANSI E1.17",
    title: "ACN - Architecture for Control Networks",
    description: "Suite of protocols for control of entertainment equipment over networks",
    status: "active",
    category: "Control Protocols",
    keyPoints: [
      "Device Description Language (DDL)",
      "Root Layer Protocol (RLP)",
      "Device Management Protocol (DMP)",
      "Session Data Transport (SDT)"
    ]
  },
  {
    id: "e1-30",
    designation: "ANSI E1.30",
    title: "ACN over TCP",
    description: "Profile for ACN Root Layer Protocol operation on TCP/IP networks",
    status: "active",
    category: "Control Protocols",
    keyPoints: [
      "TCP stream management",
      "Frame preamble format",
      "Connection handling",
      "Network synchronization"
    ]
  },
  {
    id: "e1-46",
    designation: "ANSI E1.46",
    title: "Laser Safety for Entertainment",
    description: "Entertainment laser safety requirements and audience scanning criteria",
    status: "active",
    category: "Safety",
    keyPoints: [
      "Audience scanning safety",
      "Operator qualifications",
      "Installation requirements",
      "Measurement procedures"
    ]
  },
  {
    id: "e1-11",
    designation: "ANSI E1.11",
    title: "DMX512-A",
    description: "Asynchronous Serial Digital Data Transmission Standard for Controlling Lighting Equipment",
    status: "active",
    category: "Control Protocols",
    keyPoints: [
      "512 data slots per universe",
      "250 kbps data rate",
      "5-pin XLR connector standard",
      "RDM (Remote Device Management) extension"
    ]
  },
  {
    id: "e1-20",
    designation: "ANSI E1.20",
    title: "RDM - Remote Device Management",
    description: "Extension to DMX512 for bi-directional communication",
    status: "active",
    category: "Control Protocols",
    keyPoints: [
      "Device discovery and configuration",
      "Status monitoring",
      "Parameter setting",
      "Error reporting"
    ]
  },
  {
    id: "e1-43",
    designation: "ANSI E1.43",
    title: "Dante Device Protocol",
    description: "Audio networking standard for entertainment applications",
    status: "active",
    category: "Audio",
    keyPoints: [
      "Low-latency audio transport",
      "Network clock synchronization",
      "Channel routing",
      "Redundancy support"
    ]
  }
];

const TSP_PROCESS: TSPProcess[] = [
  {
    stage: "Initiation",
    description: "A member or group identifies a need and submits a project proposal",
    duration: "1-2 months",
    stakeholders: ["Proposer", "Technical Standards Council", "Interested Members"]
  },
  {
    stage: "Working Group Formation",
    description: "A working group is established with volunteers interested in the topic",
    duration: "2-3 months",
    stakeholders: ["Working Group Chair", "Volunteer Members", "ESTA Staff"]
  },
  {
    stage: "Draft Development",
    description: "Working group develops the technical content through regular meetings",
    duration: "6-18 months",
    stakeholders: ["Working Group Members", "Subject Matter Experts", "Draft Editor"]
  },
  {
    stage: "Public Review",
    description: "Draft is published for public comment and feedback",
    duration: "30-60 days",
    stakeholders: ["General Public", "Industry Stakeholders", "Regulatory Bodies"]
  },
  {
    stage: "Revision & Ballot",
    description: "Comments are addressed and final draft is balloted for approval",
    duration: "2-4 months",
    stakeholders: ["Working Group", "Technical Standards Council", "Board of Directors"]
  },
  {
    stage: "ANSI Publication",
    description: "Approved standard is submitted to ANSI for publication",
    duration: "2-3 months",
    stakeholders: ["ESTA Staff", "ANSI", "Publishing"]
  }
];

const ACN_LAYERS: ACNProtocol[] = [
  {
    layer: "Transport",
    name: "Session Data Transport (SDT)",
    function: "Reliable data delivery between devices",
    protocols: ["UDP Multicast", "UDP Unicast", "TCP"]
  },
  {
    layer: "Session",
    name: "Root Layer Protocol (RLP)",
    function: "Packet addressing and session management",
    protocols: ["CID-based addressing", "Component identifiers"]
  },
  {
    layer: "Device",
    name: "Device Management Protocol (DMP)",
    function: "Device property access and control",
    protocols: ["Property addressing", "Get/Set/Subscribe operations"]
  },
  {
    layer: "Description",
    name: "Device Description Language (DDL)",
    function: "Self-describing device capabilities",
    protocols: ["XML-based DDL files", "Dynamic discovery"]
  }
];

const BENEFITS = [
  {
    title: "Interoperability",
    description: "Equipment from different manufacturers works together seamlessly",
    icon: <Globe className="w-5 h-5" />
  },
  {
    title: "Innovation",
    description: "Open standards encourage new product development",
    icon: <Lightbulb className="w-5 h-5" />
  },
  {
    title: "Risk Reduction",
    description: "Industry consensus on safety and performance requirements",
    icon: <CheckCircle2 className="w-5 h-5" />
  },
  {
    title: "Cost Savings",
    description: "Reduced integration costs and training requirements",
    icon: <Settings className="w-5 h-5" />
  }
];

// ============================================================================
// Main Component
// ============================================================================

export function Module3_ESTA_Standards() {
  const [activeTab, setActiveTab] = useState<"overview" | "standards" | "process" | "acn">("overview");
  const [selectedStandard, setSelectedStandard] = useState<ESTAStandard | null>(null);
  const [selectedStage, setSelectedStage] = useState<TSPProcess | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500";
      case "draft": return "bg-amber-500";
      case "superseded": return "bg-slate-500";
      default: return "bg-blue-500";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Building2 className="w-6 h-6 text-primary" />
            Module 8.3: ESTA Standards
          </h2>
          <p className="text-muted-foreground mt-1">
            Entertainment Services and Technology Association Technical Standards Program
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <BookOpen className="w-4 h-4 mr-1" />
          Industry Standards
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-1">
        {[
          { id: "overview", label: "TSP Overview", icon: Building2 },
          { id: "standards", label: "Key Standards", icon: FileText },
          { id: "process", label: "Development Process", icon: Workflow },
          { id: "acn", label: "ACN Protocol", icon: Network }
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
          {/* About ESTA TSP */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-primary" />
                About ESTA Technical Standards Program
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The ESTA Technical Standards Program (TSP) was created to serve the ESTA membership 
                and the entertainment industry in technical standards related matters. The goal of 
                the Program is to take a leading role regarding technology within the entertainment 
                industry and to develop standards that promote interoperability, safety, and innovation.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Program Structure</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Technical Standards Council (TSC)</li>
                    <li>• Working Groups for specific topics</li>
                    <li>• ANSI-accredited process</li>
                    <li>• Industry collaboration</li>
                  </ul>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg">
                  <h4 className="font-semibold mb-2">Key Achievements</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• DMX512 universal adoption</li>
                    <li>• ACN protocol development</li>
                    <li>• Entertainment laser safety</li>
                    <li>• Rigging safety standards</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {BENEFITS.map((benefit, index) => (
              <Card key={index}>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-primary/10 rounded-lg text-primary">
                      {benefit.icon}
                    </div>
                    <h4 className="font-semibold">{benefit.title}</h4>
                  </div>
                  <p className="text-sm text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Contact */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <ExternalLink className="w-4 h-4" />
                Getting Involved
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                ESTA standards development is open to all interested parties. Participation in 
                working groups is voluntary and open to members and non-members alike. Contact 
                standards@esta.org for information on joining a working group or proposing a 
                new standard project.
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "standards" && (
        <div className="space-y-6">
          {/* Standards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ESTA_STANDARDS.map(standard => (
              <Card 
                key={standard.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedStandard?.id === standard.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedStandard(standard)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{standard.designation}</Badge>
                    <Badge className={getStatusColor(standard.status)}>
                      {standard.status}
                    </Badge>
                  </div>
                  <CardTitle className="text-base mt-2">{standard.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2">{standard.description}</p>
                  <div className="mt-3">
                    <Badge variant="outline" className="text-xs">{standard.category}</Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Selected Standard Detail */}
          {selectedStandard && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="secondary">{selectedStandard.designation}</Badge>
                      <Badge className={getStatusColor(selectedStandard.status)}>
                        {selectedStandard.status}
                      </Badge>
                    </div>
                    <CardTitle>{selectedStandard.title}</CardTitle>
                  </div>
                  <Badge variant="outline">{selectedStandard.category}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{selectedStandard.description}</p>
                <h4 className="font-semibold mb-3">Key Points:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedStandard.keyPoints.map((point, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm">
                      <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "process" && (
        <div className="space-y-6">
          {/* Process Overview */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Workflow className="w-5 h-5 text-primary" />
                Standards Development Lifecycle
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-0">
                {TSP_PROCESS.map((stage, index) => (
                  <div 
                    key={stage.stage}
                    className={cn(
                      "relative pl-8 pb-8 last:pb-0 cursor-pointer",
                      selectedStage?.stage === stage.stage && "opacity-100"
                    )}
                    onClick={() => setSelectedStage(stage)}
                  >
                    {/* Timeline Line */}
                    {index < TSP_PROCESS.length - 1 && (
                      <div className="absolute left-3 top-8 bottom-0 w-0.5 bg-border" />
                    )}
                    {/* Timeline Dot */}
                    <div className={cn(
                      "absolute left-0 top-1 w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs",
                      selectedStage?.stage === stage.stage
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-background"
                    )}>
                      {index + 1}
                    </div>
                    {/* Content */}
                    <div className={cn(
                      "p-4 rounded-lg transition-colors",
                      selectedStage?.stage === stage.stage ? "bg-muted" : "hover:bg-muted/50"
                    )}>
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="font-semibold">{stage.stage}</h4>
                        <Badge variant="outline">{stage.duration}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{stage.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Stage Detail */}
          {selectedStage && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedStage.stage}</CardTitle>
                  <Badge variant="outline">{selectedStage.duration}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedStage.description}</p>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Key Stakeholders
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedStage.stakeholders.map((stakeholder, i) => (
                      <Badge key={i} variant="secondary">{stakeholder}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {activeTab === "acn" && (
        <div className="space-y-6">
          {/* ACN Overview */}
          <Card className="border-l-4 border-l-primary">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-primary" />
                ACN (Architecture for Control Networks)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                ANSI E1.17 (ACN) is a suite of protocols for control of entertainment 
                equipment over networks. It provides a flexible, extensible architecture 
                for connecting lighting, audio, video, and other entertainment devices.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <div className="font-bold text-2xl text-primary">IP-based</div>
                  <div className="text-sm text-muted-foreground">Uses standard networking</div>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <div className="font-bold text-2xl text-primary">Self-Describing</div>
                  <div className="text-sm text-muted-foreground">Devices describe themselves</div>
                </div>
                <div className="p-4 bg-primary/5 rounded-lg text-center">
                  <div className="font-bold text-2xl text-primary">Scalable</div>
                  <div className="text-sm text-muted-foreground">Unlimited device count</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Protocol Stack */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-primary" />
                ACN Protocol Stack
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {ACN_LAYERS.map((layer, index) => (
                  <div 
                    key={layer.layer}
                    className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg"
                  >
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                      <span className="font-bold text-primary">{4 - index}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center justify-between">
                        <h4 className="font-semibold">{layer.name}</h4>
                        <Badge variant="outline">{layer.layer} Layer</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">{layer.function}</p>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {layer.protocols.map((protocol, i) => (
                          <Badge key={i} variant="secondary" className="text-xs">{protocol}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* E1.30 - TCP Transport */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <FileText className="w-4 h-4" />
                ANSI E1.30 - ACN over TCP
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                ANSI E1.30 specifies how the ACN Root Layer Protocol operates over TCP/IP 
                networks, providing reliable transport for control data in environments where 
                UDP multicast is not suitable.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h5 className="font-medium mb-1">Frame Preamble</h5>
                  <p className="text-muted-foreground">12-byte ACN packet identifier + 4-byte PDU block size</p>
                </div>
                <div className="p-3 bg-muted/50 rounded-lg">
                  <h5 className="font-medium mb-1">Connection Management</h5>
                  <p className="text-muted-foreground">Each TCP stream forms a unique connection identified by IP and port</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Module3_ESTA_Standards;
