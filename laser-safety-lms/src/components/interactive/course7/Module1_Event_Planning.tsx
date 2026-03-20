"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  priority: "CRITICAL" | "HIGH" | "MEDIUM";
  completed: boolean;
  notes?: string;
}

interface PlanningPhase {
  id: string;
  title: string;
  description: string;
  items: ChecklistItem[];
}

const planningPhases: PlanningPhase[] = [
  {
    id: "pre_event",
    title: "Pre-Event Planning",
    description: "Critical items to address before scheduling any live entertainment event",
    items: [
      { id: "pep-001", category: "Authority Coordination", task: "Confirm event date and time with community public service agencies", priority: "CRITICAL", completed: false, notes: "Agencies must verify resource availability before event promotion" },
      { id: "pep-002", category: "Authority Coordination", task: "Identify lead agency and primary contact", priority: "HIGH", completed: false, notes: "Prevents confusion in leadership on large events" },
      { id: "pep-003", category: "Legal", task: "Obtain legal and insurance advice", priority: "CRITICAL", completed: false, notes: "Understand liability for injuries, acts/omissions, emergency response costs" },
      { id: "pep-004", category: "Permits", task: "Apply for public entertainment permit", priority: "CRITICAL", completed: false, notes: "Permanent venues may have existing permits with conditions" },
      { id: "pep-005", category: "Planning", task: "Conduct initial risk assessment", priority: "HIGH", completed: false, notes: "Identify physical and health hazards before work begins" },
      { id: "pep-006", category: "Planning", task: "Create health and safety policy statement", priority: "HIGH", completed: false, notes: "Include organizational diagrams, maps, procedures, roles, contacts" },
      { id: "pep-007", category: "Personnel", task: "Appoint Safety Coordinator", priority: "HIGH", completed: false, notes: "Monitor site safety, select contractors, liaison with authorities" },
      { id: "pep-008", category: "Planning", task: "Complete life safety evaluation", priority: "HIGH", completed: false, notes: "Assess events, access/egress, structural integrity, fire safety, emergency systems" },
    ],
  },
  {
    id: "pre_production",
    title: "Pre-Production Phase",
    description: "Operations and production preparation before event begins",
    items: [
      { id: "pp-001", category: "Design", task: "Finalize design development and engineering", priority: "CRITICAL", completed: false },
      { id: "pp-002", category: "Vendors", task: "Complete vendor selection process", priority: "CRITICAL", completed: false },
      { id: "pp-003", category: "Safety", task: "Complete health and safety planning", priority: "CRITICAL", completed: false },
      { id: "pp-004", category: "Logistics", task: "Plan logistics and load-out strategy", priority: "HIGH", completed: false },
      { id: "pp-005", category: "Crowd Management", task: "Develop crowd management plan", priority: "CRITICAL", completed: false, notes: "Staffing numbers, methods of working, chains of command" },
      { id: "pp-006", category: "Signage", task: "Plan signage and wayfinding", priority: "HIGH", completed: false },
      { id: "pp-007", category: "Waste", task: "Develop waste management plan", priority: "MEDIUM", completed: false },
      { id: "pp-008", category: "Fire Safety", task: "Develop fire safety strategy", priority: "CRITICAL", completed: false },
      { id: "pp-009", category: "Medical", task: "Plan first aid and medical response", priority: "CRITICAL", completed: false },
      { id: "pp-010", category: "Emergency", task: "Develop major incident plan", priority: "CRITICAL", completed: false },
      { id: "pp-011", category: "Documentation", task: "Prepare event safety management plan", priority: "CRITICAL", completed: false, notes: "Policy statement, risk assessment, site plan, crowd/transport plans, EAP" },
    ],
  },
  {
    id: "load_in",
    title: "Production Phase - Load-In",
    description: "Operational period when event elements are delivered and installed",
    items: [
      { id: "li-001", category: "Safety", task: "Post site safety rules at venue entrances", priority: "CRITICAL", completed: false },
      { id: "li-002", category: "Safety", task: "Communicate safety rules to all contractors upon arrival", priority: "CRITICAL", completed: false },
      { id: "li-003", category: "First Aid", task: "Ensure first aid facilities available from work start", priority: "CRITICAL", completed: false },
      { id: "li-004", category: "Structures", task: "Verify structural calculations and drawings approved", priority: "CRITICAL", completed: false },
      { id: "li-005", category: "Fire Safety", task: "Install fire extinguishers in all required locations", priority: "CRITICAL", completed: false, notes: "Within 30ft of cooking equipment, max 50ft travel distance" },
      { id: "li-006", category: "Egress", task: "Mark all fire aisles and egress routes", priority: "CRITICAL", completed: false },
      { id: "li-007", category: "Electrical", task: "Verify all electrical connections inspected", priority: "CRITICAL", completed: false },
      { id: "li-008", category: "Communication", task: "Test all communication systems", priority: "HIGH", completed: false },
      { id: "li-009", category: "PPE", task: "Verify appropriate PPE available for all workers", priority: "HIGH", completed: false },
    ],
  },
  {
    id: "show",
    title: "Production Phase - Show/Event",
    description: "Operational period during public access and performance",
    items: [
      { id: "show-001", category: "Crowd", task: "Monitor crowd density and flow", priority: "CRITICAL", completed: false, notes: "Continuous monitoring required" },
      { id: "show-002", category: "Communication", task: "Maintain communication with all safety personnel", priority: "CRITICAL", completed: false, notes: "Continuous" },
      { id: "show-003", category: "Fire Safety", task: "Conduct fire watch patrols", priority: "HIGH", completed: false, notes: "Continuous surveillance for fire hazards" },
      { id: "show-004", category: "Medical", task: "Ensure medical personnel and equipment on standby", priority: "CRITICAL", completed: false },
      { id: "show-005", category: "Emergency", task: "Confirm emergency routes clear and accessible", priority: "CRITICAL", completed: false, notes: "Checked every 30 minutes" },
      { id: "show-006", category: "Weather", task: "Monitor weather conditions", priority: "HIGH", completed: false, notes: "Use weather decision trigger chart" },
      { id: "show-007", category: "Exit", task: "Ensure all exit signs illuminated and visible", priority: "CRITICAL", completed: false },
    ],
  },
  {
    id: "load_out",
    title: "Load-Out Phase",
    description: "Post-event equipment removal and site restoration",
    items: [
      { id: "lo-001", category: "Safety", task: "Maintain site safety procedures during load-out", priority: "CRITICAL", completed: false },
      { id: "lo-002", category: "Lighting", task: "Ensure adequate lighting for all work areas", priority: "CRITICAL", completed: false },
      { id: "lo-003", category: "Fatigue", task: "Monitor worker fatigue levels", priority: "HIGH", completed: false },
      { id: "lo-004", category: "Hydration", task: "Provide water and hydration stations", priority: "HIGH", completed: false },
      { id: "lo-005", category: "Communication", task: "Maintain clear communication about removal sequences", priority: "HIGH", completed: false },
      { id: "lo-006", category: "Weather", task: "Monitor for temperature drops (if applicable)", priority: "MEDIUM", completed: false },
      { id: "lo-007", category: "Documentation", task: "Document any incidents or near-misses in log book", priority: "HIGH", completed: false },
    ],
  },
  {
    id: "post_production",
    title: "Post-Production Phase",
    description: "After event completion - review and documentation",
    items: [
      { id: "post-001", category: "Review", task: "Conduct post-event safety audit", priority: "HIGH", completed: false, notes: "Include law enforcement, fire, health, first aid, contractors" },
      { id: "post-002", category: "Review", task: "Review effectiveness of safety management systems", priority: "HIGH", completed: false, notes: "Before memories fade" },
      { id: "post-003", category: "Documentation", task: "Store all documents and log books in secure environment", priority: "CRITICAL", completed: false, notes: "Minimum 3-7 years retention" },
      { id: "post-004", category: "Learning", task: "Study documents for lessons learned", priority: "MEDIUM", completed: false, notes: "Use as starting point for future similar events" },
    ],
  },
];

const priorityConfig = {
  CRITICAL: { color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", badge: "bg-red-100 text-red-800" },
  HIGH: { color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200", badge: "bg-amber-100 text-amber-800" },
  MEDIUM: { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", badge: "bg-blue-100 text-blue-800" },
};

export const Module1_Event_Planning: React.FC = () => {
  const [phases, setPhases] = useState<PlanningPhase[]>(planningPhases);
  const [activePhase, setActivePhase] = useState<string>("pre_event");
  const [showBuilder, setShowBuilder] = useState(false);

  const toggleItem = (phaseId: string, itemId: string) => {
    setPhases((prev) =>
      prev.map((phase) =>
        phase.id === phaseId
          ? {
              ...phase,
              items: phase.items.map((item) =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              ),
            }
          : phase
      )
    );
  };

  const calculateProgress = (phaseId: string) => {
    const phase = phases.find((p) => p.id === phaseId);
    if (!phase) return 0;
    const completed = phase.items.filter((i) => i.completed).length;
    return Math.round((completed / phase.items.length) * 100);
  };

  const calculateOverallProgress = () => {
    const totalItems = phases.reduce((acc, p) => acc + p.items.length, 0);
    const completedItems = phases.reduce(
      (acc, p) => acc + p.items.filter((i) => i.completed).length,
      0
    );
    return Math.round((completedItems / totalItems) * 100);
  };

  const getCriticalOutstanding = () => {
    let count = 0;
    phases.forEach((phase) => {
      phase.items.forEach((item) => {
        if (item.priority === "CRITICAL" && !item.completed) count++;
      });
    });
    return count;
  };

  const activePhaseData = phases.find((p) => p.id === activePhase);
  const overallProgress = calculateOverallProgress();
  const criticalOutstanding = getCriticalOutstanding();

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-4">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-foreground mb-2">Event Safety Planning</h1>
        <p className="text-muted-foreground">Comprehensive planning framework for live entertainment events</p>
      </div>

      {/* Progress Dashboard */}
      <Card className={cn("border-l-4", criticalOutstanding > 0 ? "border-l-red-500" : "border-l-green-500")}>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Overall Planning Progress</div>
              <div className="text-3xl font-bold text-foreground">{overallProgress}%</div>
            </div>
            <div className="flex-1 max-w-md">
              <Progress value={overallProgress} className="h-3" />
            </div>
            <div className="text-right">
              {criticalOutstanding > 0 ? (
                <div className="flex items-center gap-2 text-red-600 font-semibold">
                  <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-red-100 text-red-800 text-sm">
                    {criticalOutstanding}
                  </span>
                  Critical Items Outstanding
                </div>
              ) : (
                <div className="text-green-600 font-semibold">✓ All Critical Items Complete</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Phase Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {phases.map((phase) => {
          const progress = calculateProgress(phase.id);
          const isActive = activePhase === phase.id;
          const hasCritical = phase.items.some((i) => i.priority === "CRITICAL" && !i.completed);

          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={cn(
                "p-3 rounded-lg border-2 text-left transition-all",
                isActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-card",
                hasCritical && !isActive && "border-red-200 bg-red-50"
              )}
            >
              <div className="font-semibold text-sm text-foreground">{phase.title}</div>
              <div className="text-xs text-muted-foreground mt-1">{progress}% Complete</div>
              <div className="mt-2 h-1 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    "h-full transition-all",
                    progress === 100 ? "bg-green-500" : hasCritical ? "bg-red-500" : "bg-blue-500"
                  )}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </button>
          );
        })}
      </div>

      {/* Active Phase Checklist */}
      <Card>
        <CardHeader className="bg-muted">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div>
              <CardTitle>{activePhaseData?.title}</CardTitle>
              <CardDescription>{activePhaseData?.description}</CardDescription>
            </div>
            <Button
              variant="outline"
              onClick={() => setShowBuilder(!showBuilder)}
              className="shrink-0"
            >
              {showBuilder ? "Hide" : "Show"} Safety Plan Builder
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {activePhaseData?.items.map((item) => (
              <div
                key={item.id}
                className={cn(
                  "p-4 rounded-lg border-2 transition-all",
                  item.completed
                    ? "bg-green-50 border-green-200 opacity-75"
                    : "bg-card border-gray-200 hover:border-gray-300"
                )}
              >
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => toggleItem(activePhase, item.id)}
                    className={cn(
                      "mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
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
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span
                        className={cn(
                          "text-xs font-semibold px-2 py-0.5 rounded",
                          priorityConfig[item.priority].badge
                        )}
                      >
                        {item.priority}
                      </span>
                      <span className="text-xs text-muted-foreground">{item.category}</span>
                    </div>
                    <p
                      className={cn(
                        "font-medium",
                        item.completed ? "text-muted-foreground line-through" : "text-foreground"
                      )}
                    >
                      {item.task}
                    </p>
                    {item.notes && (
                      <p className="text-sm text-muted-foreground mt-1">{item.notes}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Safety Plan Builder */}
      {showBuilder && (
        <Card className="border-2 border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>Event Safety Plan Builder</CardTitle>
            <CardDescription>Generate a comprehensive safety plan document</CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Event Name</label>
                  <input
                    type="text"
                    placeholder="Enter event name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Venue</label>
                  <input
                    type="text"
                    placeholder="Enter venue name"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Expected Attendance</label>
                  <input
                    type="number"
                    placeholder="Number of attendees"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Safety Coordinator</label>
                  <input
                    type="text"
                    placeholder="Name and contact"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Emergency Contact</label>
                  <input
                    type="text"
                    placeholder="Primary emergency contact"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">Lead Agency</label>
                  <input
                    type="text"
                    placeholder="Police/Fire/EMS lead"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
            <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <h4 className="font-semibold text-amber-800 mb-2">Safety Plan Components</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm">
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Event safety policy statement</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Event risk assessment</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Site safety plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Crowd management plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Transportation management plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Emergency action plan (EAP)</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>First aid plan</span>
                </div>
                <div className="flex items-center gap-2">
                  <input type="checkbox" className="rounded" />
                  <span>Fire safety strategy</span>
                </div>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">Generate Safety Plan</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Risk Assessment Matrix Reference */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Assessment Matrix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-2">Probability →</th>
                  <th className="text-center py-2 px-2 bg-green-50">Rare (1)</th>
                  <th className="text-center py-2 px-2 bg-green-50">Unlikely (2)</th>
                  <th className="text-center py-2 px-2 bg-yellow-50">Possible (3)</th>
                  <th className="text-center py-2 px-2 bg-orange-50">Likely (4)</th>
                  <th className="text-center py-2 px-2 bg-red-50">Almost Certain (5)</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium bg-red-50">Catastrophic (5)</td>
                  <td className="text-center py-2 px-2 bg-yellow-100">5</td>
                  <td className="text-center py-2 px-2 bg-orange-100">10</td>
                  <td className="text-center py-2 px-2 bg-orange-100">15</td>
                  <td className="text-center py-2 px-2 bg-red-100">20</td>
                  <td className="text-center py-2 px-2 bg-red-200 font-bold">25</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium bg-orange-50">Major (4)</td>
                  <td className="text-center py-2 px-2 bg-green-100">4</td>
                  <td className="text-center py-2 px-2 bg-yellow-100">8</td>
                  <td className="text-center py-2 px-2 bg-orange-100">12</td>
                  <td className="text-center py-2 px-2 bg-red-100">16</td>
                  <td className="text-center py-2 px-2 bg-red-200">20</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium bg-yellow-50">Moderate (3)</td>
                  <td className="text-center py-2 px-2 bg-green-100">3</td>
                  <td className="text-center py-2 px-2 bg-yellow-100">6</td>
                  <td className="text-center py-2 px-2 bg-yellow-100">9</td>
                  <td className="text-center py-2 px-2 bg-orange-100">12</td>
                  <td className="text-center py-2 px-2 bg-red-100">15</td>
                </tr>
                <tr className="border-b">
                  <td className="py-2 px-2 font-medium bg-blue-50">Minor (2)</td>
                  <td className="text-center py-2 px-2 bg-green-100">2</td>
                  <td className="text-center py-2 px-2 bg-green-100">4</td>
                  <td className="text-center py-2 px-2 bg-yellow-100">6</td>
                  <td className="text-center py-2 px-2 bg-yellow-100">8</td>
                  <td className="text-center py-2 px-2 bg-orange-100">10</td>
                </tr>
                <tr>
                  <td className="py-2 px-2 font-medium bg-muted">Negligible (1)</td>
                  <td className="text-center py-2 px-2 bg-green-100">1</td>
                  <td className="text-center py-2 px-2 bg-green-100">2</td>
                  <td className="text-center py-2 px-2 bg-green-100">3</td>
                  <td className="text-center py-2 px-2 bg-green-100">4</td>
                  <td className="text-center py-2 px-2 bg-yellow-100">5</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 grid grid-cols-4 gap-2 text-xs">
            <div className="p-2 bg-green-100 rounded text-center">1-4: Low Risk<br/>Routine procedures</div>
            <div className="p-2 bg-yellow-100 rounded text-center">5-9: Medium Risk<br/>Management monitoring</div>
            <div className="p-2 bg-orange-100 rounded text-center">10-16: High Risk<br/>Senior management attention</div>
            <div className="p-2 bg-red-100 rounded text-center">17-25: Extreme Risk<br/>Immediate action required</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Module1_Event_Planning;
