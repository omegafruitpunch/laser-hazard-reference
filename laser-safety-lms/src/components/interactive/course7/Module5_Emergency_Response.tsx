"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmergencyScenario {
  id: string;
  type: string;
  icon: string;
  description: string;
  immediateActions: string[];
  escalation?: string[];
  severity: "critical" | "high" | "medium";
}

const emergencyScenarios: EmergencyScenario[] = [
  {
    id: "laser-eye",
    type: "Laser Eye Injury",
    icon: "👁️",
    description: "Suspected or confirmed laser exposure to eye",
    severity: "critical",
    immediateActions: [
      "STOP the laser exposure immediately",
      "Do NOT allow victim to rub or touch eye",
      "Cover affected eye with loose, clean dressing",
      "Keep victim calm and seated",
      "Call 911 / Emergency Medical Services",
      "Document: wavelength, power, exposure duration, beam path",
      "Shutdown laser system - preserve settings for investigation",
      "Notify Laser Safety Officer immediately",
    ],
    escalation: [
      "Transport to hospital with ophthalmology department",
      "Report to FDA within 30 days (accident/incident)",
      "Preserve all equipment for investigation",
      "Document scene with photographs",
    ],
  },
  {
    id: "laser-skin",
    type: "Laser Skin Burn",
    icon: "🔥",
    description: "Laser exposure causing skin burn",
    severity: "high",
    immediateActions: [
      "Remove from laser exposure source",
      "Cool the burn with clean, cool water for 10-20 minutes",
      "Do NOT apply ice, butter, or ointments",
      "Cover with sterile, non-stick dressing",
      "Assess severity - seek medical attention if:",
      "  - Burn larger than 3 inches",
      "  - On face, hands, feet, or genitals",
      "  - Deep, white, or charred appearance",
      "Document exposure details",
    ],
  },
  {
    id: "equipment-fire",
    type: "Equipment Fire",
    icon: "🔥",
    description: "Fire involving laser or electrical equipment",
    severity: "critical",
    immediateActions: [
      "Activate nearest fire alarm",
      "If small and contained: use appropriate extinguisher",
      "  - Electrical fire: CO2 or dry chemical (Class C)",
      "  - Class B liquids: dry chemical or foam",
      "  - Class A materials: water or dry chemical",
      "If fire is spreading: EVACUATE immediately",
      "Call 911 - report: location, type of fire, any injuries",
      "Do NOT use water on electrical fires",
      "Power down equipment if safe to do so",
    ],
    escalation: [
      "Activate full venue evacuation if needed",
      "Account for all personnel at assembly point",
      "Preserve scene for fire marshal investigation",
    ],
  },
  {
    id: "power-loss",
    type: "Power Failure",
    icon: "⚡",
    description: "Loss of electrical power during event",
    severity: "high",
    immediateActions: [
      "Activate emergency lighting",
      "Initiate backup power for critical systems",
      "All lasers: verify interlocks engaged (should auto-shutdown)",
      "Station staff with flashlights at key locations",
      "Communicate with crowd using backup PA",
      "Consider evacuation if lighting inadequate",
      "Investigate cause - check breakers, equipment",
    ],
  },
  {
    id: "structural",
    type: "Structural Failure",
    icon: "🏗️",
    description: "Stage, truss, or structure collapse or imminent failure",
    severity: "critical",
    immediateActions: [
      "CLEAR AREA IMMEDIATELY - evacuate all personnel",
      "Do NOT approach damaged structure",
      "Establish exclusion zone (minimum 2x structure height)",
      "Notify Incident Commander",
      "Call 911 if injuries or risk to public",
      "Call structural engineer for assessment",
      "Evacuate venue if failure threatens safety",
      "Document with photographs from safe distance",
    ],
  },
  {
    id: "medical",
    type: "Medical Emergency",
    icon: "🏥",
    description: "General medical emergency (non-laser)",
    severity: "high",
    immediateActions: [
      "Assess scene safety before approaching",
      "Assess victim - responsiveness, breathing, pulse",
      "Call for help / medical personnel",
      "Call 911 if:",
      "  - Unconscious or altered mental state",
      "  - Difficulty breathing",
      "  - Chest pain",
      "  - Severe bleeding",
      "  - Suspected spinal injury",
      "Provide first aid within your training",
      "Clear path for emergency responders",
    ],
  },
];

interface NIMSRole {
  role: string;
  title: string;
  description: string;
  responsibilities: string[];
}

const nimsRoles: NIMSRole[] = [
  {
    role: "command",
    title: "Incident Commander (IC)",
    description: "Overall incident management",
    responsibilities: [
      "Sets incident objectives and priorities",
      "Approves action plans",
      "Coordinates with agencies",
      "Has authority to stop event if necessary",
    ],
  },
  {
    role: "safety",
    title: "Safety Officer",
    description: "Incident safety oversight",
    responsibilities: [
      "Monitor safety conditions",
      "Stop unsafe operations",
      "Ensure responder safety",
      "Identify hazardous situations",
    ],
  },
  {
    role: "liaison",
    title: "Liaison Officer",
    description: "Agency coordination",
    responsibilities: [
      "Coordinate with assisting agencies",
      "Manage agency representatives",
      "Facilitate inter-agency communication",
    ],
  },
  {
    role: "operations",
    title: "Operations Section Chief",
    description: "Direct tactical operations",
    responsibilities: [
      "Crowd management",
      "Medical response",
      "Fire suppression",
      "Search and rescue",
    ],
  },
  {
    role: "planning",
    title: "Planning Section Chief",
    description: "Information and planning",
    responsibilities: [
      "Situation assessment",
      "Resource tracking",
      "Documentation",
      "Prepares Incident Action Plan",
    ],
  },
  {
    role: "logistics",
    title: "Logistics Section Chief",
    description: "Resource support",
    responsibilities: [
      "Personnel support",
      "Equipment provisioning",
      "Communications",
      "Medical support to responders",
    ],
  },
];

interface DocumentationField {
  id: string;
  label: string;
  value: string;
  required: boolean;
}

export const Module5_Emergency_Response: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"scenarios" | "nims" | "shutdown" | "docs">("scenarios");
  const [selectedScenario, setSelectedScenario] = useState<string>("laser-eye");
  const [shutdownStep, setShutdownStep] = useState(0);

  const [docFields, setDocFields] = useState<DocumentationField[]>([
    { id: "date", label: "Date/Time of Incident", value: "", required: true },
    { id: "location", label: "Location", value: "", required: true },
    { id: "reporter", label: "Reported By", value: "", required: true },
    { id: "victim", label: "Person(s) Affected", value: "", required: false },
    { id: "description", label: "Description of Incident", value: "", required: true },
    { id: "equipment", label: "Equipment Involved", value: "", required: false },
    { id: "witnesses", label: "Witnesses", value: "", required: false },
    { id: "actions", label: "Immediate Actions Taken", value: "", required: true },
    { id: "medical", label: "Medical Response/Outcome", value: "", required: false },
  ]);

  const updateDocField = (id: string, value: string) => {
    setDocFields((prev) => prev.map((f) => (f.id === id ? { ...f, value } : f)));
  };

  const shutdownSteps = [
    { title: "STOP Beam Emission", detail: "Immediately cease all laser emission using emergency stop or key switch" },
    { title: "Secure Area", detail: "Prevent access to hazard zone - post personnel or barriers" },
    { title: "Assess Injuries", detail: "Check for affected personnel - provide first aid if needed" },
    { title: "Call Emergency Services", detail: "911 for injuries, fire, or chemical exposure" },
    { title: "Notify Chain of Command", detail: "LSO → Safety Coordinator → Incident Commander" },
    { title: "Preserve Evidence", detail: "Do NOT alter equipment settings - document as-is" },
    { title: "Begin Documentation", detail: "Start incident log with timestamps and witness info" },
  ];

  const activeScenario = emergencyScenarios.find((s) => s.id === selectedScenario);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Emergency Response</h1>
        <p className="text-muted-foreground">Laser injury first aid, equipment shutdown, and incident documentation</p>
      </div>

      {/* Emergency Hotline Banner */}
      <Card className="border-2 border-red-500 bg-red-50">
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="text-4xl">🚨</span>
              <div>
                <div className="text-lg font-bold text-red-800">EMERGENCY CONTACTS</div>
                <div className="text-sm text-red-600">Program these numbers before event</div>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-3 bg-card rounded-lg border border-red-200">
                <div className="text-xs text-muted-foreground">Emergency</div>
                <div className="text-xl font-bold text-red-700">911</div>
              </div>
              <div className="p-3 bg-card rounded-lg border border-red-200">
                <div className="text-xs text-muted-foreground">LSO Hotline</div>
                <div className="text-lg font-bold text-red-700">________</div>
              </div>
              <div className="p-3 bg-card rounded-lg border border-red-200">
                <div className="text-xs text-muted-foreground">Venue Security</div>
                <div className="text-lg font-bold text-red-700">________</div>
              </div>
              <div className="p-3 bg-card rounded-lg border border-red-200">
                <div className="text-xs text-muted-foreground">Poison Control</div>
                <div className="text-lg font-bold text-red-700">1-800-222-1222</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: "scenarios", label: "Emergency Scenarios", icon: "🚨" },
          { id: "shutdown", label: "Equipment Shutdown", icon: "⏹️" },
          { id: "nims", label: "NIMS/ICS Roles", icon: "👔" },
          { id: "docs", label: "Incident Documentation", icon: "📋" },
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

      {/* Emergency Scenarios Tab */}
      {activeTab === "scenarios" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Scenario Selector */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle>Select Emergency Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {emergencyScenarios.map((scenario) => (
                  <button
                    key={scenario.id}
                    onClick={() => setSelectedScenario(scenario.id)}
                    className={cn(
                      "w-full p-3 rounded-lg border-2 text-left transition-all",
                      selectedScenario === scenario.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300",
                      scenario.severity === "critical" && selectedScenario !== scenario.id && "border-red-200 bg-red-50"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{scenario.icon}</span>
                      <div>
                        <div className="font-semibold text-sm">{scenario.type}</div>
                        <div className="text-xs text-muted-foreground">{scenario.description}</div>
                      </div>
                    </div>
                    {scenario.severity === "critical" && (
                      <span className="inline-block mt-1 text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded">
                        CRITICAL
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Scenario Details */}
          <Card className="lg:col-span-2">
            <CardHeader
              className={cn(
                activeScenario?.severity === "critical"
                  ? "bg-red-50"
                  : activeScenario?.severity === "high"
                  ? "bg-orange-50"
                  : "bg-yellow-50"
              )}
            >
              <CardTitle className="flex items-center gap-3">
                <span className="text-3xl">{activeScenario?.icon}</span>
                <div>
                  <div>{activeScenario?.type}</div>
                  <div className="text-sm font-normal text-muted-foreground">{activeScenario?.description}</div>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              {/* Immediate Actions */}
              <div>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <span className="text-red-500">🚨</span> Immediate Actions
                </h4>
                <div className="space-y-2">
                  {activeScenario?.immediateActions.map((action, idx) => (
                    <div
                      key={idx}
                      className={cn(
                        "p-3 rounded-lg border-l-4",
                        action.startsWith("  ")
                          ? "bg-muted border-gray-300 ml-6"
                          : "bg-red-50 border-red-400"
                      )}
                    >
                      <p className={cn("text-sm", action.startsWith("  ") ? "text-muted-foreground" : "text-foreground font-medium")}>
                        {action}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Escalation */}
              {activeScenario?.escalation && (
                <div>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <span className="text-orange-500">📈</span> Escalation Procedures
                  </h4>
                  <div className="space-y-2">
                    {activeScenario.escalation.map((step, idx) => (
                      <div key={idx} className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-400">
                        <p className="text-sm text-foreground">{step}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Equipment Shutdown Tab */}
      {activeTab === "shutdown" && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="bg-red-50">
              <CardTitle className="text-red-800">Emergency Laser System Shutdown Procedure</CardTitle>
              <CardDescription>Step-by-step emergency shutdown protocol</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {shutdownSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      "p-4 rounded-lg border-2 transition-all cursor-pointer",
                      shutdownStep === idx
                        ? "border-blue-500 bg-blue-50"
                        : shutdownStep > idx
                        ? "border-green-300 bg-green-50"
                        : "border-gray-200 hover:border-gray-300"
                    )}
                    onClick={() => setShutdownStep(idx)}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm shrink-0",
                          shutdownStep > idx
                            ? "bg-green-500 text-white"
                            : shutdownStep === idx
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-muted-foreground"
                        )}
                      >
                        {shutdownStep > idx ? "✓" : idx + 1}
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{step.title}</div>
                        <div className="text-sm text-muted-foreground mt-1">{step.detail}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex justify-center gap-4">
                <Button
                  variant="outline"
                  onClick={() => setShutdownStep(Math.max(0, shutdownStep - 1))}
                  disabled={shutdownStep === 0}
                >
                  Previous
                </Button>
                <Button
                  onClick={() => setShutdownStep(Math.min(shutdownSteps.length - 1, shutdownStep + 1))}
                  disabled={shutdownStep === shutdownSteps.length - 1}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Next Step
                </Button>
                <Button variant="outline" onClick={() => setShutdownStep(0)}>
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="border-2 border-amber-300">
              <CardHeader className="bg-amber-50">
                <CardTitle className="text-amber-800">Emergency Stop Locations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold">Main Laser Console</div>
                    <div className="text-sm text-muted-foreground">Red E-Stop button - immediate all-systems halt</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold">Stage Left/Right</div>
                    <div className="text-sm text-muted-foreground">Remote E-Stop pendants for stage personnel</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold">FOH Position</div>
                    <div className="text-sm text-muted-foreground">Front-of-house operator emergency stop</div>
                  </div>
                  <div className="p-3 bg-card rounded-lg border">
                    <div className="font-semibold">Security/LSO</div>
                    <div className="text-sm text-muted-foreground">Master safety cutoff - shuts all laser systems</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-300">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-800">🚨 NEVER...</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-red-700">
                  <li className="flex items-start gap-2">
                    <span>✕</span>
                    <span>Never override safety interlocks during emergency</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✕</span>
                    <span>Never restart laser without LSO approval after incident</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✕</span>
                    <span>Never touch damaged laser equipment - risk of electrical shock</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✕</span>
                    <span>Never delay calling 911 if injuries occurred</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✕</span>
                    <span>Never move equipment before documentation</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span>✕</span>
                    <span>Never assume someone else called for help</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* NIMS/ICS Tab */}
      {activeTab === "nims" && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>NIMS / Incident Command System Structure</CardTitle>
              <CardDescription>
                National Incident Management System roles for event emergency response
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {nimsRoles.map((role) => (
                  <div key={role.role} className="p-4 bg-muted rounded-lg border">
                    <div className="font-semibold text-foreground">{role.title}</div>
                    <div className="text-sm text-blue-600 mb-2">{role.description}</div>
                    <ul className="space-y-1">
                      {role.responsibilities.map((resp, idx) => (
                        <li key={idx} className="text-xs text-muted-foreground flex items-start gap-1">
                          <span>•</span>
                          {resp}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Emergency Response Team Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-2 px-3">Role</th>
                      <th className="text-left py-2 px-3">Name</th>
                      <th className="text-left py-2 px-3">Phone/Radio</th>
                      <th className="text-left py-2 px-3">Location</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { role: "Incident Commander", name: "_______________", contact: "_______________", location: "Command Post" },
                      { role: "Laser Safety Officer", name: "_______________", contact: "_______________", location: "Laser Control" },
                      { role: "Safety Officer", name: "_______________", contact: "_______________", location: "Mobile" },
                      { role: "Venue Security Lead", name: "_______________", contact: "_______________", location: "Security Office" },
                      { role: "Medical Lead", name: "_______________", contact: "_______________", location: "Medical Station" },
                      { role: "Fire Brigade", name: "_______________", contact: "_______________", location: "Fire Point" },
                    ].map((row, idx) => (
                      <tr key={idx} className="border-b hover:bg-muted">
                        <td className="py-2 px-3 font-medium">{row.role}</td>
                        <td className="py-2 px-3">{row.name}</td>
                        <td className="py-2 px-3">{row.contact}</td>
                        <td className="py-2 px-3">{row.location}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Documentation Tab */}
      {activeTab === "docs" && (
        <div className="grid lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Incident Report Form</CardTitle>
              <CardDescription>Document all incidents immediately while details are fresh</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {docFields.map((field) => (
                  <div key={field.id}>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      {field.label}
                      {field.required && <span className="text-red-500 ml-1">*</span>}
                    </label>
                    {field.id === "description" || field.id === "actions" ? (
                      <textarea
                        value={field.value}
                        onChange={(e) => updateDocField(field.id, e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={field.value}
                        onChange={(e) => updateDocField(field.id, e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    )}
                  </div>
                ))}
                <Button className="w-full bg-blue-600 hover:bg-blue-700">Generate Report</Button>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card className="border-2 border-amber-300">
              <CardHeader className="bg-amber-50">
                <CardTitle className="text-amber-800">Documentation Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">📷</span>
                    <span>Photograph incident scene and any equipment involved</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">📝</span>
                    <span>Record exact times of incident, discovery, and response</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">👥</span>
                    <span>Collect witness statements and contact information</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">🔧</span>
                    <span>Preserve equipment settings - do not power cycle</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">📋</span>
                    <span>Maintain chain of custody for evidence</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-600">📊</span>
                    <span>Record laser parameters: wavelength, power, pulse rate</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-red-300">
              <CardHeader className="bg-red-50">
                <CardTitle className="text-red-800">FDA Reporting Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground mb-3">
                  Laser accidents and injuries must be reported to FDA within specific timeframes:
                </p>
                <div className="space-y-2">
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="font-semibold text-red-800">Within 30 Days</div>
                    <div className="text-sm text-red-700">Accidents with injury or property damage</div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="font-semibold text-orange-800">Within 10 Days</div>
                    <div className="text-sm text-orange-700">Defects in laser products</div>
                  </div>
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="font-semibold text-yellow-800">Annual Reports</div>
                    <div className="text-sm text-yellow-700">Summary of all incidents (if applicable)</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Report Retention</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-foreground">
                  <li>• Incident reports: <strong>Minimum 7 years</strong></li>
                  <li>• Injury documentation: <strong>Duration of employment + 30 years</strong></li>
                  <li>• Equipment maintenance logs: <strong>Life of equipment + 7 years</strong></li>
                  <li>• Training records: <strong>Duration of employment + 5 years</strong></li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
};

export default Module5_Emergency_Response;
