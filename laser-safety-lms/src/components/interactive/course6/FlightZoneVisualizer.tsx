"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FlightZone {
  id: string;
  name: string;
  acronym: string;
  exposureLimit: string;
  exposureValue: number;
  exposureUnit: string;
  description: string;
  radius: string;
  altitude: string;
  color: string;
  bgColor: string;
  icon: string;
  criticalPhases: string[];
}

interface VisualEffect {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  duration: string;
  severity: "low" | "medium" | "high";
  color: string;
  bgColor: string;
  icon: string;
}

const flightZones: FlightZone[] = [
  {
    id: "lfz",
    name: "Laser Free Zone",
    acronym: "LFZ",
    exposureLimit: "50 nW/cm²",
    exposureValue: 50,
    exposureUnit: "nW/cm²",
    description: "Airspace where laser radiation should be virtually eliminated to prevent any visual distraction to pilots.",
    radius: "< 2 NM",
    altitude: "< 2,000 ft AGL",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: "🚫",
    criticalPhases: ["Final approach", "Takeoff initial climb", "Missed approach"],
  },
  {
    id: "cfz",
    name: "Critical Flight Zone",
    acronym: "CFZ",
    exposureLimit: "5 µW/cm²",
    exposureValue: 5,
    exposureUnit: "µW/cm²",
    description: "Airspace where exposure should not exceed levels that cause glare, which can impair pilot vision.",
    radius: "10 NM",
    altitude: "up to 10,000 ft AGL",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: "⚠️",
    criticalPhases: ["Approach", "Departure", "Low-level navigation", "Emergency operations"],
  },
  {
    id: "sfz",
    name: "Sensitive Flight Zone",
    acronym: "SFZ",
    exposureLimit: "100 µW/cm²",
    exposureValue: 100,
    exposureUnit: "µW/cm²",
    description: "Airspace where exposure should not exceed levels that cause flashblindness or afterimages.",
    radius: "Variable",
    altitude: "Variable",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: "👁️",
    criticalPhases: ["Training areas", "Helicopter routes", "Aerobatic areas"],
  },
  {
    id: "nfz",
    name: "Normal Flight Zone",
    acronym: "NFZ",
    exposureLimit: "MPE Limits",
    exposureValue: 2.6,
    exposureUnit: "mW/cm²",
    description: "All other airspace where normal MPE limits apply for eye safety.",
    radius: "All remaining airspace",
    altitude: "Above 10,000 ft AGL",
    color: "text-green-600",
    bgColor: "bg-green-50",
    icon: "✓",
    criticalPhases: ["En route cruise", "High altitude operations"],
  },
];

const visualEffects: VisualEffect[] = [
  {
    id: "distraction",
    name: "Distraction",
    description: "Mental interference from bright light - pilot attention is drawn away from instruments.",
    characteristics: ["Light brighter than background", "Vision not physically blocked", "Mental focus disrupted", "Can be managed by pilot"],
    duration: "While light is visible",
    severity: "low",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: "👀",
  },
  {
    id: "glare",
    name: "Glare",
    description: "Inability to see past the laser light while it remains on - like oncoming headlights.",
    characteristics: ["Cannot see through the light", "Blocks portion of vision", "Effect ends when light removed", "Disorients pilot"],
    duration: "While light is on",
    severity: "medium",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: "💡",
  },
  {
    id: "flashblindness",
    name: "Flashblindness",
    description: "Vision-impairing afterimages that persist after the light is gone - like camera flash.",
    characteristics: ["Afterimages persist", "Can last seconds to minutes", "Most serious hazard", "Critical during landing/takeoff"],
    duration: "Seconds to minutes",
    severity: "high",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: "⚡",
  },
];

export const FlightZoneVisualizer: React.FC = () => {
  const [selectedZone, setSelectedZone] = useState<FlightZone>(flightZones[0]);
  const [activeTab, setActiveTab] = useState<"zones" | "effects">("zones");
  const [showLayers, setShowLayers] = useState({
    lfz: true,
    cfz: true,
    sfz: true,
    nfz: true,
  });

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Flight Zone Visualizer</h2>
        <p className="text-muted-foreground">Interactive exploration of FAA flight zones and exposure limits</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg inline-flex">
          {[
            { id: "zones", label: "Flight Zones", icon: "🎯" },
            { id: "effects", label: "Visual Effects", icon: "👁️" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-all flex items-center",
                activeTab === tab.id ? "bg-card text-blue-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Zones Tab */}
      {activeTab === "zones" && (
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Zone Selector */}
          <div className="space-y-3">
            <h3 className="font-semibold text-foreground mb-3">Select Zone</h3>
            {flightZones.map((zone) => (
              <button
                key={zone.id}
                onClick={() => setSelectedZone(zone)}
                className={cn(
                  "w-full p-4 rounded-lg border-2 text-left transition-all",
                  selectedZone.id === zone.id ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{zone.icon}</span>
                  <div>
                    <div className="font-semibold text-foreground">{zone.acronym}</div>
                    <div className="text-sm text-muted-foreground">{zone.name}</div>
                  </div>
                </div>
                <div className="mt-2 text-xs font-mono bg-muted inline-block px-2 py-1 rounded">≤ {zone.exposureLimit}</div>
              </button>
            ))}

            {/* Layer Toggles */}
            <div className="mt-6 p-4 bg-muted rounded-lg">
              <h4 className="font-semibold text-foreground mb-3 text-sm">Show Layers</h4>
              {flightZones.map((zone) => (
                <label key={zone.id} className="flex items-center mb-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={showLayers[zone.id as keyof typeof showLayers]}
                    onChange={(e) => setShowLayers((prev) => ({ ...prev, [zone.id]: e.target.checked }))}
                    className="mr-2"
                  />
                  <span className={cn("w-3 h-3 rounded-full mr-2", zone.bgColor.replace("bg-", "bg-").replace("50", "500"))} />
                  <span className="text-sm text-muted-foreground">{zone.acronym}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Zone Visual */}
          <div className="lg:col-span-2 space-y-6">
            {/* Airspace Diagram */}
            <div className="bg-gray-900 rounded-xl p-6 relative overflow-hidden" style={{ minHeight: "400px" }}>
              {/* Airport center */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-2xl">✈️</span>
                </div>
                <div className="text-center text-white text-xs mt-1">Airport</div>
              </div>

              {/* Zone Circles */}
              {showLayers.lfz && (
                <div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-red-500 bg-red-500/20 flex items-center justify-center"
                  style={{ width: "120px", height: "120px" }}
                >
                  <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">LFZ</span>
                </div>
              )}

              {showLayers.cfz && (
                <div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-orange-500 bg-orange-500/10"
                  style={{ width: "240px", height: "240px" }}
                >
                  <span className="absolute top-4 left-1/2 transform -translate-x-1/2 text-white text-xs font-bold bg-orange-500 px-2 py-1 rounded">CFZ</span>
                </div>
              )}

              {showLayers.sfz && (
                <div
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-500 bg-yellow-500/10"
                  style={{ width: "320px", height: "320px" }}
                >
                  <span className="absolute top-1/4 right-4 text-white text-xs font-bold bg-yellow-600 px-2 py-1 rounded">SFZ</span>
                </div>
              )}

              {showLayers.nfz && (
                <div className="absolute inset-4 rounded-full border-4 border-green-500/30">
                  <span className="absolute bottom-8 right-8 text-green-400 text-xs font-bold bg-green-900/50 px-2 py-1 rounded">NFZ</span>
                </div>
              )}

              {/* Altitude indicators */}
              <div className="absolute left-4 top-4 text-muted-foreground text-xs">
                <div>↑ 10,000+ ft AGL</div>
                <div className="mt-1">↑ 2,000 ft AGL</div>
              </div>

              {/* Scale */}
              <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs p-2 rounded">
                <div className="flex items-center">
                  <div className="w-20 h-0.5 bg-card mr-2" />
                  10 NM
                </div>
              </div>
            </div>

            {/* Selected Zone Details */}
            <Card className="border-2 overflow-hidden">
              <CardHeader className={cn(selectedZone.bgColor, selectedZone.color)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{selectedZone.icon}</span>
                    <div>
                      <CardTitle className={selectedZone.color}>{selectedZone.name}</CardTitle>
                      <p className="opacity-75">{selectedZone.acronym}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold">{selectedZone.exposureLimit}</div>
                    <div className="text-sm opacity-75">Maximum Exposure</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Zone Specifications</h4>
                    <table className="w-full text-sm">
                      <tbody className="divide-y">
                        <tr>
                          <td className="py-2 text-muted-foreground">Typical Radius:</td>
                          <td className="py-2 font-medium">{selectedZone.radius}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground">Altitude:</td>
                          <td className="py-2 font-medium">{selectedZone.altitude}</td>
                        </tr>
                        <tr>
                          <td className="py-2 text-muted-foreground">Exposure Limit:</td>
                          <td className="py-2 font-medium">{selectedZone.exposureLimit}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                  <div>
                    <h4 className="font-semibold text-foreground mb-3">Critical Flight Phases</h4>
                    <ul className="space-y-2">
                      {selectedZone.criticalPhases.map((phase, idx) => (
                        <li key={idx} className="flex items-center text-sm text-muted-foreground">
                          <span className={cn("w-2 h-2 rounded-full mr-2", selectedZone.color.replace("text-", "bg-"))} />
                          {phase}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <p className="mt-4 text-sm text-muted-foreground">{selectedZone.description}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* Effects Tab */}
      {activeTab === "effects" && (
        <div className="grid md:grid-cols-3 gap-6">
          {visualEffects.map((effect) => (
            <Card key={effect.id} className={cn("border-2 overflow-hidden", effect.bgColor.replace("bg-", "border-").replace("50", "200"))}>
              <CardHeader className={cn(effect.bgColor, effect.color)}>
                <div className="text-4xl mb-2">{effect.icon}</div>
                <CardTitle className={effect.color}>{effect.name}</CardTitle>
                <span
                  className={cn(
                    "inline-block mt-2 px-2 py-1 rounded text-xs font-bold",
                    effect.severity === "high"
                      ? "bg-red-800 text-white"
                      : effect.severity === "medium"
                      ? "bg-orange-700 text-white"
                      : "bg-yellow-700 text-white"
                  )}
                >
                  {effect.severity.toUpperCase()} SEVERITY
                </span>
              </CardHeader>
              <CardContent className="pt-4">
                <p className="text-sm text-muted-foreground mb-4">{effect.description}</p>

                <h4 className="font-semibold text-foreground text-sm mb-2">Characteristics:</h4>
                <ul className="space-y-1 mb-4">
                  {effect.characteristics.map((char, idx) => (
                    <li key={idx} className="text-xs text-muted-foreground flex items-start">
                      <span className="mr-2">•</span>
                      {char}
                    </li>
                  ))}
                </ul>

                <div className="text-xs text-muted-foreground">
                  <strong>Duration:</strong> {effect.duration}
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Comparison Table */}
          <Card className="md:col-span-3">
            <CardHeader>
              <CardTitle>Visual Effect Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-muted">
                    <tr>
                      <th className="p-3 text-left">Effect</th>
                      <th className="p-3 text-left">Zone Triggered</th>
                      <th className="p-3 text-left">Threshold</th>
                      <th className="p-3 text-left">Recovery</th>
                      <th className="p-3 text-left">Primary Risk</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y">
                    <tr>
                      <td className="p-3 font-medium">Distraction</td>
                      <td className="p-3">LFED (beyond LFZ)</td>
                      <td className="p-3 font-mono">50 nW/cm²</td>
                      <td className="p-3">Immediate when light removed</td>
                      <td className="p-3">Loss of situational awareness</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Glare</td>
                      <td className="p-3">CZED (within CFZ)</td>
                      <td className="p-3 font-mono">5 µW/cm²</td>
                      <td className="p-3">When light removed</td>
                      <td className="p-3">Obscured vision</td>
                    </tr>
                    <tr>
                      <td className="p-3 font-medium">Flashblindness</td>
                      <td className="p-3">SZED (within SFZ)</td>
                      <td className="p-3 font-mono">100 µW/cm²</td>
                      <td className="p-3">Seconds to minutes</td>
                      <td className="p-3">Afterimages, temporary vision loss</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default FlightZoneVisualizer;
