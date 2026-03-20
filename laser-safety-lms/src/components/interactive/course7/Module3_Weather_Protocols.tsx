"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface WeatherThreshold {
  condition: string;
  threshold: string;
  alertMethod: string;
  action: string;
  productionArea: string;
  severity: "monitor" | "caution" | "severe" | "critical";
}

const weatherThresholds: WeatherThreshold[] = [
  {
    condition: "Surface Winds",
    threshold: "50+ MPH or Tornado",
    alertMethod: "2 long air horn blasts + radio",
    action: "IMMEDIATE retreat to shelter - evacuate all equipment",
    productionArea: "All areas",
    severity: "critical",
  },
  {
    condition: "High Winds",
    threshold: "40+ MPH",
    alertMethod: "1 long air horn blast + radio",
    action: "Show delay - audience to shelter, flatten truss, secure lights",
    productionArea: "Stage, Audio, Lights, LED screens",
    severity: "severe",
  },
  {
    condition: "Lightning",
    threshold: "Within 8 miles",
    alertMethod: "Radio alert from production",
    action: "Show delay - power off, take shelter immediately",
    productionArea: "All outdoor areas",
    severity: "severe",
  },
  {
    condition: "Winds Nearing",
    threshold: "30 MPH approaching",
    alertMethod: "Radio alert from production",
    action: "Land anchors, flatten roof, secure gear, prepare for delay",
    productionArea: "Stage, LED screens, Audio, Lights",
    severity: "caution",
  },
  {
    condition: "Storm Tracking",
    threshold: "Lightning within 20 miles",
    alertMethod: "Radio alert from production",
    action: "Monitor proximity, prepare to secure equipment",
    productionArea: "All production areas",
    severity: "monitor",
  },
  {
    condition: "Progressive Winds",
    threshold: "20+ MPH",
    alertMethod: "Radio alert from production",
    action: "Vent stage, land screens, monitor PA/light sway",
    productionArea: "Stage, LED, Audio, Lights, Spots",
    severity: "monitor",
  },
  {
    condition: "Rain Event",
    threshold: "Within 20 miles",
    alertMethod: "Radio alert from production",
    action: "Secure and cover gear, prepare for wet conditions",
    productionArea: "FOH, Video, Back Line",
    severity: "monitor",
  },
];

interface ProductionAreaAction {
  area: string;
  critical: string;
  severe: string;
  caution: string;
  monitor: string;
}

const productionActions: ProductionAreaAction[] = [
  {
    area: "Stage",
    critical: "Open all walls, evacuate to fixed structures",
    severe: "Land anchor, message system evacuation",
    caution: "Increase stage venting, land anchor",
    monitor: "Vent stage, monitor conditions",
  },
  {
    area: "LED Screens",
    critical: "Land anchor, message system evacuation",
    severe: "Land anchor, message system evacuation",
    caution: "Land PA and delays",
    monitor: "Land screens, monitor proximity",
  },
  {
    area: "Audio",
    critical: "Power off, evacuate to fixed structures",
    severe: "Flatten all truss to roof, power off, evacuate",
    caution: "Flatten all truss to roof",
    monitor: "Monitor PA swing, secure gear",
  },
  {
    area: "Lights",
    critical: "Power off, evacuate to fixed structures",
    severe: "Secure lights, power off, evacuate",
    caution: "Secure lights, power off",
    monitor: "Monitor rig swing, secure gear",
  },
  {
    area: "Spotlights/FOH",
    critical: "Power off, evacuate to fixed structures",
    severe: "Power off, evacuate",
    caution: "Secure and cover gear",
    monitor: "Monitor sway, secure gear",
  },
  {
    area: "Video/Back Line",
    critical: "Power off, evacuate to fixed structures",
    severe: "Power off, evacuate",
    caution: "Secure and cover gear",
    monitor: "Prepare to secure, cover gear",
  },
];

interface ChecklistItem {
  id: string;
  task: string;
  completed: boolean;
  category: string;
}

const weatherChecklist: ChecklistItem[] = [
  { id: "wc-001", task: "Weather monitoring system operational (real-time data)", completed: false, category: "Monitoring" },
  { id: "wc-002", task: "Lightning detection system active within 8-mile range", completed: false, category: "Monitoring" },
  { id: "wc-003", task: "Wind speed monitoring equipment in place", completed: false, category: "Monitoring" },
  { id: "wc-004", task: "WBGT (heat stress) monitoring if hot conditions", completed: false, category: "Monitoring" },
  { id: "wc-005", task: "Air horns accessible and tested (2 long = evac, 1 long = delay)", completed: false, category: "Alert Systems" },
  { id: "wc-006", task: "Radio communication tested on all channels", completed: false, category: "Alert Systems" },
  { id: "wc-007", task: "Designated shelters identified and marked", completed: false, category: "Shelter" },
  { id: "wc-008", task: "Shelter capacity adequate for all personnel + attendees", completed: false, category: "Shelter" },
  { id: "wc-009", task: "Multiple shelter access routes clear and marked", completed: false, category: "Shelter" },
  { id: "wc-010", task: "All production areas briefed on weather protocols", completed: false, category: "Personnel" },
  { id: "wc-011", task: "Evacuation routes to shelters confirmed clear", completed: false, category: "Egress" },
  { id: "wc-012", task: "Emergency contact numbers posted and distributed", completed: false, category: "Communication" },
];

const severityConfig = {
  monitor: { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", badge: "bg-blue-100 text-blue-800" },
  caution: { color: "text-yellow-600", bgColor: "bg-yellow-50", borderColor: "border-yellow-200", badge: "bg-yellow-100 text-yellow-800" },
  severe: { color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200", badge: "bg-amber-100 text-amber-800" },
  critical: { color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", badge: "bg-red-100 text-red-800" },
};

export const Module3_Weather_Protocols: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"triggers" | "actions" | "checklist">("triggers");
  const [checklist, setChecklist] = useState(weatherChecklist);
  const [selectedArea, setSelectedArea] = useState<string>("Stage");

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = checklist.filter((i) => i.completed).length;
  const progress = Math.round((completedCount / checklist.length) * 100);

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Weather Protocols</h1>
        <p className="text-muted-foreground">Lightning protocols, wind thresholds, and decision trigger charts</p>
      </div>

      {/* Alert Methods Reference */}
      <Card className="border-2 border-amber-300">
        <CardHeader className="bg-amber-50">
          <CardTitle className="text-amber-800">⚡ Weather Alert Methods</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="p-4 bg-red-50 rounded-lg border border-red-200 text-center">
              <div className="text-2xl mb-2">🚨</div>
              <div className="font-semibold text-red-800">2 Long Air Horn Blasts</div>
              <div className="text-sm text-red-600">+ Radio Communication</div>
              <div className="text-xs text-red-500 mt-1">Immediate Evacuation</div>
            </div>
            <div className="p-4 bg-amber-50 rounded-lg border border-amber-200 text-center">
              <div className="text-2xl mb-2">⚠️</div>
              <div className="font-semibold text-amber-800">1 Long Air Horn Blast</div>
              <div className="text-sm text-amber-600">+ Radio Communication</div>
              <div className="text-xs text-amber-500 mt-1">Show Delay</div>
            </div>
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-center">
              <div className="text-2xl mb-2">📻</div>
              <div className="font-semibold text-blue-800">Radio Alert</div>
              <div className="text-sm text-blue-600">From Production</div>
              <div className="text-xs text-blue-500 mt-1">Monitor/Prepare</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg border border-green-200 text-center">
              <div className="text-2xl mb-2">✓</div>
              <div className="font-semibold text-green-800">Radio Alert</div>
              <div className="text-sm text-green-600">"All Clear"</div>
              <div className="text-xs text-green-500 mt-1">Resume Activities</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tab Navigation */}
      <div className="flex flex-wrap justify-center gap-2">
        {[
          { id: "triggers", label: "Decision Triggers", icon: "🌩️" },
          { id: "actions", label: "Production Actions", icon: "🎛️" },
          { id: "checklist", label: "Weather Checklist", icon: "✓" },
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

      {/* Decision Triggers Tab */}
      {activeTab === "triggers" && (
        <div className="space-y-4">
          {/* Critical Warning */}
          <Card className="border-2 border-red-400">
            <CardHeader className="bg-red-100">
              <CardTitle className="text-red-800 flex items-center gap-2">
                <span>🚨</span>
                CRITICAL: 50+ MPH Winds or Tornado Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-red-800 mb-2">Immediate Actions:</h4>
                  <ul className="space-y-1 text-red-700">
                    <li>• 2 long air horn blasts + radio communication</li>
                    <li>• IMMEDIATE retreat to designated shelters</li>
                    <li>• Open all stage walls and evacuate</li>
                    <li>• Land anchor LED screens, message evacuation</li>
                    <li>• Power off ALL equipment</li>
                    <li>• Evacuate to fixed structures</li>
                  </ul>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Applies To:</h4>
                  <p className="text-red-700">All production areas including:</p>
                  <ul className="mt-2 space-y-1 text-sm text-red-600">
                    <li>• Stage Operations</li>
                    <li>• Audio/Video</li>
                    <li>• Lighting/Spots</li>
                    <li>• FOH/Back Line</li>
                    <li>• LED Screens</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Threshold Table */}
          <Card>
            <CardHeader>
              <CardTitle>Weather Decision Trigger Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-3 px-2">Condition</th>
                      <th className="text-left py-3 px-2">Threshold</th>
                      <th className="text-left py-3 px-2">Alert</th>
                      <th className="text-left py-3 px-2">Action</th>
                      <th className="text-center py-3 px-2">Level</th>
                    </tr>
                  </thead>
                  <tbody>
                    {weatherThresholds.map((threshold, idx) => (
                      <tr
                        key={idx}
                        className={cn(
                          "border-b hover:bg-muted",
                          threshold.severity === "critical" && "bg-red-50"
                        )}
                      >
                        <td className="py-3 px-2 font-medium">{threshold.condition}</td>
                        <td className="py-3 px-2">{threshold.threshold}</td>
                        <td className="py-3 px-2">{threshold.alertMethod}</td>
                        <td className="py-3 px-2 max-w-xs">{threshold.action}</td>
                        <td className="py-3 px-2 text-center">
                          <span
                            className={cn(
                              "px-2 py-1 rounded-full text-xs font-semibold",
                              severityConfig[threshold.severity].badge
                            )}
                          >
                            {threshold.severity.toUpperCase()}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Lightning Protocol */}
          <Card className="border-2 border-blue-300">
            <CardHeader className="bg-blue-50">
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <span>⚡</span>
                Lightning Protocol: 8-Mile Rule
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="font-semibold text-yellow-800 mb-2">8 Miles</div>
                  <p className="text-sm text-yellow-700">
                    Lightning within 8 miles triggers SHOW DELAY. All outdoor activities must stop.
                    Move to shelter immediately.
                  </p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-semibold text-blue-800 mb-2">20 Miles</div>
                  <p className="text-sm text-blue-700">
                    Storm/lightning tracking toward site within 20 miles: Monitor proximity. Prepare
                    to secure equipment and take shelter.
                  </p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-semibold text-green-800 mb-2">All Clear</div>
                  <p className="text-sm text-green-700">
                    30 minutes after last observed lightning OR confirmed storm movement away from
                    site.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Production Actions Tab */}
      {activeTab === "actions" && (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Production Area Response Matrix</CardTitle>
              <CardDescription>Select a production area to view specific weather actions</CardDescription>
            </CardHeader>
            <CardContent>
              {/* Area Selector */}
              <div className="flex flex-wrap gap-2 mb-6">
                {productionActions.map((area) => (
                  <button
                    key={area.area}
                    onClick={() => setSelectedArea(area.area)}
                    className={cn(
                      "px-4 py-2 rounded-lg font-medium transition-all",
                      selectedArea === area.area
                        ? "bg-blue-600 text-white"
                        : "bg-muted text-foreground hover:bg-gray-200"
                    )}
                  >
                    {area.area}
                  </button>
                ))}
              </div>

              {/* Selected Area Actions */}
              {productionActions
                .filter((a) => a.area === selectedArea)
                .map((area) => (
                  <div key={area.area} className="space-y-4">
                    <div className="p-4 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">🚨</span>
                        <h3 className="font-bold text-red-800">CRITICAL (50+ MPH / Tornado)</h3>
                      </div>
                      <p className="text-red-700">{area.critical}</p>
                    </div>

                    <div className="p-4 bg-amber-50 rounded-lg border-2 border-amber-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⚠️</span>
                        <h3 className="font-bold text-amber-800">SEVERE (40+ MPH / Lightning 8mi)</h3>
                      </div>
                      <p className="text-amber-700">{area.severe}</p>
                    </div>

                    <div className="p-4 bg-yellow-50 rounded-lg border-2 border-yellow-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">⚡</span>
                        <h3 className="font-bold text-yellow-800">CAUTION (Winds nearing 30 MPH)</h3>
                      </div>
                      <p className="text-yellow-700">{area.caution}</p>
                    </div>

                    <div className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">👁️</span>
                        <h3 className="font-bold text-blue-800">MONITOR (20+ MPH / Storm 20mi)</h3>
                      </div>
                      <p className="text-blue-700">{area.monitor}</p>
                    </div>
                  </div>
                ))}
            </CardContent>
          </Card>

          {/* Wind Speed Reference */}
          <Card>
            <CardHeader>
              <CardTitle>Wind Speed Decision Chart</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative pt-8 pb-4">
                {/* Wind speed scale */}
                <div className="h-8 bg-gradient-to-r from-blue-400 via-yellow-400 via-orange-400 to-red-600 rounded-lg relative">
                  {/* Markers */}
                  <div className="absolute left-[20%] -top-6 transform -translate-x-1/2">
                    <div className="text-xs font-semibold">20 MPH</div>
                    <div className="w-0.5 h-10 bg-gray-400 mx-auto"></div>
                  </div>
                  <div className="absolute left-[40%] -top-6 transform -translate-x-1/2">
                    <div className="text-xs font-semibold">30 MPH</div>
                    <div className="w-0.5 h-10 bg-gray-400 mx-auto"></div>
                  </div>
                  <div className="absolute left-[60%] -top-6 transform -translate-x-1/2">
                    <div className="text-xs font-semibold">40 MPH</div>
                    <div className="w-0.5 h-10 bg-gray-400 mx-auto"></div>
                  </div>
                  <div className="absolute left-[80%] -top-6 transform -translate-x-1/2">
                    <div className="text-xs font-semibold">50 MPH</div>
                    <div className="w-0.5 h-10 bg-gray-400 mx-auto"></div>
                  </div>
                </div>
                
                {/* Labels */}
                <div className="flex justify-between mt-2 text-sm">
                  <div className="text-blue-600 font-medium">Monitor</div>
                  <div className="text-yellow-600 font-medium">Caution</div>
                  <div className="text-amber-600 font-medium">Delay</div>
                  <div className="text-red-600 font-medium">CRITICAL</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Weather Checklist Tab */}
      {activeTab === "checklist" && (
        <Card>
          <CardHeader className="bg-muted">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Weather Monitoring Checklist</CardTitle>
                <CardDescription>Pre-event weather preparedness verification</CardDescription>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-foreground">{progress}%</div>
                <div className="text-sm text-muted-foreground">Complete</div>
              </div>
            </div>
            <div className="mt-2">
              <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    progress === 100 ? "bg-green-500" : progress >= 75 ? "bg-blue-500" : "bg-amber-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-2">
              {["Monitoring", "Alert Systems", "Shelter", "Personnel", "Egress", "Communication"].map(
                (category) => (
                  <div key={category}>
                    <h4 className="font-semibold text-foreground mb-2 mt-4">{category}</h4>
                    {checklist
                      .filter((item) => item.category === category)
                      .map((item) => (
                        <div
                          key={item.id}
                          className={cn(
                            "p-3 rounded-lg border flex items-start gap-3 transition-all",
                            item.completed
                              ? "bg-green-50 border-green-200"
                              : "bg-card border-gray-200 hover:border-gray-300"
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
                          <span
                            className={cn(
                              item.completed ? "text-muted-foreground line-through" : "text-foreground"
                            )}
                          >
                            {item.task}
                          </span>
                        </div>
                      ))}
                  </div>
                )
              )}
            </div>

            {progress === 100 && (
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg text-center">
                <div className="text-green-800 font-semibold text-lg">✓ Weather Preparedness Complete</div>
                <p className="text-green-600 text-sm mt-1">
                  All weather monitoring systems verified and personnel briefed.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Module3_Weather_Protocols;
