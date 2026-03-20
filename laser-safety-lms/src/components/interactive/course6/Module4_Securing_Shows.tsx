'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Shield, 
  ClipboardCheck, 
  Target,
  AlertTriangle,
  CheckCircle2,
  Users,
  Radio,
  Siren,
  MapPin,
  Eye,
  X,
  Phone,
  FileText,
  Clock
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ChecklistItem {
  id: string;
  category: string;
  task: string;
  description: string;
  priority: 'critical' | 'high' | 'medium';
  timing: string;
  completed: boolean;
}

interface TimelinePhase {
  id: string;
  name: string;
  timing: string;
  icon: React.ReactNode;
  items: ChecklistItem[];
}

interface EmergencyProcedure {
  id: string;
  title: string;
  trigger: string;
  immediate: string[];
  followup: string[];
  contacts: string[];
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const TIMELINE_PHASES: TimelinePhase[] = [
  {
    id: "pre-show",
    name: "Pre-Show (T-60 to T-0)",
    timing: "60 minutes before show",
    icon: <ClipboardCheck className="w-5 h-5" />,
    items: [
      {
        id: "ps-1",
        category: "Communications",
        task: "Establish radio contact with ATC",
        description: "Confirm 24/7 phone line to controlling facility is active and tested",
        priority: "critical",
        timing: "T-60",
        completed: false
      },
      {
        id: "ps-2",
        category: "Documentation",
        task: "Verify Letter of Determination on-site",
        description: "Ensure paper or electronic copy of current LOD is accessible to all operators",
        priority: "critical",
        timing: "T-60",
        completed: false
      },
      {
        id: "ps-3",
        category: "Equipment",
        task: "Verify laser interlocks functional",
        description: "Test all safety interlocks, emergency stop systems, and scan-fail protection",
        priority: "critical",
        timing: "T-45",
        completed: false
      },
      {
        id: "ps-4",
        category: "Personnel",
        task: "Brief all operators on NOTAM conditions",
        description: "Review Letter of Determination conditions with all operators and safety observers",
        priority: "high",
        timing: "T-30",
        completed: false
      },
      {
        id: "ps-5",
        category: "Safety",
        task: "Position safety observers",
        description: "All observation posts manned with clear sightlines to protected airspace",
        priority: "critical",
        timing: "T-15",
        completed: false
      },
      {
        id: "ps-6",
        category: "Weather",
        task: "Check visibility conditions",
        description: "Verify cloud ceiling > 2,000 ft AGL and visibility > 3 statute miles",
        priority: "high",
        timing: "T-10",
        completed: false
      },
      {
        id: "ps-7",
        category: "Perimeter",
        task: "Verify beam termination surfaces",
        description: "Confirm all beam paths terminate on designated safe surfaces only",
        priority: "critical",
        timing: "T-10",
        completed: false
      }
    ]
  },
  {
    id: "show",
    name: "Show Time (T-0 to T+Duration)",
    timing: "During laser operation",
    icon: <Shield className="w-5 h-5" />,
    items: [
      {
        id: "sh-1",
        category: "Operations",
        task: "Maintain continuous ATC contact",
        description: "Keep phone line open with ATC during all operations; immediately report any issues",
        priority: "critical",
        timing: "Continuous",
        completed: false
      },
      {
        id: "sh-2",
        category: "Safety",
        task: "Monitor for aircraft activity",
        description: "Safety observers report all aircraft within CFZ (Critical Flight Zone)",
        priority: "critical",
        timing: "Continuous",
        completed: false
      },
      {
        id: "sh-3",
        category: "Safety",
        task: "Enforce beam termination",
        description: "Ensure beams terminate on designated surfaces only; never into open airspace",
        priority: "critical",
        timing: "Continuous",
        completed: false
      },
      {
        id: "sh-4",
        category: "Operations",
        task: "Log all operations",
        description: "Record start/end times, aircraft sightings, and any deviations from normal operations",
        priority: "high",
        timing: "Continuous",
        completed: false
      },
      {
        id: "sh-5",
        category: "Weather",
        task: "Monitor weather conditions",
        description: "Watch for visibility degradation; be prepared to cease operations if conditions worsen",
        priority: "high",
        timing: "Every 15 min",
        completed: false
      }
    ]
  },
  {
    id: "post-show",
    name: "Post-Show",
    timing: "After laser operations cease",
    icon: <FileText className="w-5 h-5" />,
    items: [
      {
        id: "po-1",
        category: "Communications",
        task: "Notify ATC operations complete",
        description: "Inform controlling facility that laser operations have ended and beams are secured",
        priority: "critical",
        timing: "Immediate",
        completed: false
      },
      {
        id: "po-2",
        category: "Documentation",
        task: "Complete operation log",
        description: "Document all events, aircraft sightings, weather changes, and anomalies",
        priority: "high",
        timing: "Within 1 hour",
        completed: false
      },
      {
        id: "po-3",
        category: "Equipment",
        task: "Secure laser systems",
        description: "Power down, engage safety interlocks, and physically secure all laser equipment",
        priority: "high",
        timing: "Immediate",
        completed: false
      },
      {
        id: "po-4",
        category: "Reporting",
        task: "Report any incidents to FAA",
        description: "If any aircraft illumination occurred, immediately report to FAA WOCC",
        priority: "critical",
        timing: "Immediate if incident",
        completed: false
      }
    ]
  }
];

const EMERGENCY_PROCEDURES: EmergencyProcedure[] = [
  {
    id: "aircraft-sighting",
    title: "Aircraft Sighting in Protected Zone",
    trigger: "Safety observer spots aircraft approaching or within NOHD/SZED/CZED",
    immediate: [
      "IMMEDIATELY terminate all laser beams directed toward aircraft",
      "Sound alarm/alert signal to all operators",
      "Call out aircraft position to all observers",
      "Prepare to cease all operations if necessary"
    ],
    followup: [
      "Document aircraft type, direction, altitude if known",
      "Record time of sighting and beam termination",
      "Notify ATC of the event",
      "Assess if incident reporting to FAA is required"
    ],
    contacts: ["ATC: [Pre-arranged number]", "FAA WOCC: (202) 267-5289", "Event Safety Director"]
  },
  {
    id: "laser-strike",
    title: "Confirmed Laser Aircraft Strike",
    trigger: "Laser beam illuminates aircraft cockpit",
    immediate: [
      "CEASE ALL LASER OPERATIONS IMMEDIATELY",
      "Activate emergency stop if available",
      "Notify ATC immediately of the incident",
      "Secure all laser equipment"
    ],
    followup: [
      "Document exact time and circumstances",
      "Gather witness statements from all observers",
      "Preserve all logs and recordings",
      "Contact FAA WOCC to file formal report",
      "Notify event organizers and legal counsel"
    ],
    contacts: ["FAA WOCC: (202) 267-5289", "laserreports@faa.gov", "Local Law Enforcement", "FBI Field Office"]
  },
  {
    id: "equipment-failure",
    title: "Equipment Malfunction / Scan Failure",
    trigger: "Laser system malfunction, scan-failure protection triggers, or unexpected beam behavior",
    immediate: [
      "Activate emergency stop",
      "Evacuate beam path areas",
      "Notify all personnel of the failure",
      "Post guards at perimeter if beams are uncontrolled"
    ],
    followup: [
      "Do NOT attempt repair during show conditions",
      "Secure area and prevent public access",
      "Document failure mode and system status",
      "Contact equipment manufacturer for technical support",
      "Assess if operations can safely resume"
    ],
    contacts: ["Equipment Tech Support", "Event Safety Director", "ATC (to advise of delay/stoppage)"]
  },
  {
    id: "weather-deterioration",
    title: "Weather Deterioration",
    trigger: "Visibility drops below minimums, ceiling below 2,000 ft, or winds > 35 knots",
    immediate: [
      "Monitor conditions continuously",
      "Prepare to cease operations",
      "If below minimums: CEASE OPERATIONS",
      "Secure equipment against weather"
    ],
    followup: [
      "Notify ATC of weather-related stoppage",
      "Document weather conditions at time of cessation",
      "Monitor for improvement before resuming",
      "Update NOTAM if extended delay"
    ],
    contacts: ["ATC", "National Weather Service", "Event Coordinator"]
  }
];

const BEAM_TERMINATION_STRATEGIES = [
  {
    id: "physical-barrier",
    title: "Physical Barriers",
    description: "Hard surfaces that block beam propagation",
    examples: ["Buildings", "Mountains/hills", "Towers", "Barricades"],
    advantages: ["Most reliable", "Independent of weather", "No power required"],
    considerations: ["Must be taller than beam elevation", "Must prevent beam over-shoot", "Consider specular reflections"]
  },
  {
    id: "beam-dump",
    title: "Beam Dumps",
    description: "Specialized absorption targets for laser beams",
    examples: ["Anodized aluminum plates", "Carbon-coated targets", "Water screens", "Diffusing screens"],
    advantages: ["Portable", "Can be positioned precisely", "Reduces back-scatter"],
    considerations: ["Must handle power density", "Thermal management", "Regular inspection for damage"]
  },
  {
    id: "observer-system",
    title: "Safety Observer System",
    description: "Trained personnel who monitor airspace and control beams",
    examples: ["Zone observers", "Kill switch operators", "Communication network"],
    advantages: ["Flexible", "Real-time response", "Can adapt to changing conditions"],
    considerations: ["Requires training (SAE ARP5535)", "Fatigue management", "Clear communication protocols"]
  },
  {
    id: "electronic",
    title: "Electronic Protection",
    description: "Automated detection and response systems",
    examples: ["Radar-based detection", "Camera-based tracking", "Auto-shutoff systems"],
    advantages: ["Fast response time", "24/7 operation", "Objective detection"],
    considerations: ["Must meet SAE AS6029", "False positive management", "Regular calibration required"]
  }
];

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function ShowChecklist() {
  const [phases, setPhases] = useState<TimelinePhase[]>(TIMELINE_PHASES);
  const [activePhase, setActivePhase] = useState<string>("pre-show");

  const toggleItem = (phaseId: string, itemId: string) => {
    setPhases(prev =>
      prev.map(phase =>
        phase.id === phaseId
          ? {
              ...phase,
              items: phase.items.map(item =>
                item.id === itemId ? { ...item, completed: !item.completed } : item
              )
            }
          : phase
      )
    );
  };

  const getCompletionStats = () => {
    const allItems = phases.flatMap(p => p.items);
    const completed = allItems.filter(i => i.completed).length;
    const critical = allItems.filter(i => i.priority === "critical" && !i.completed).length;
    return { total: allItems.length, completed, critical };
  };

  const stats = getCompletionStats();
  const progressPercent = (stats.completed / stats.total) * 100;

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "critical": return "text-red-600 bg-red-50 border-red-200";
      case "high": return "text-orange-600 bg-orange-50 border-orange-200";
      case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default: return "text-muted-foreground bg-muted border-gray-200";
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-blue-900">Checklist Progress</span>
          <span className="text-sm text-blue-700">{stats.completed} of {stats.total} complete</span>
        </div>
        <Progress value={progressPercent} className="h-2" />
        {stats.critical > 0 && (
          <p className="text-sm text-red-600 mt-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            {stats.critical} critical item(s) pending
          </p>
        )}
      </div>

      <div className="flex gap-2">
        {phases.map(phase => {
          const phaseCompleted = phase.items.filter(i => i.completed).length;
          const phaseTotal = phase.items.length;
          const isActive = activePhase === phase.id;

          return (
            <button
              key={phase.id}
              onClick={() => setActivePhase(phase.id)}
              className={cn(
                "flex-1 p-4 rounded-lg border-2 text-left transition-all",
                isActive
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-card"
              )}
            >
              <div className="flex items-center justify-between">
                <div className={cn("p-2 rounded-full", isActive ? "bg-blue-200" : "bg-muted")}>
                  {phase.icon}
                </div>
                {phaseCompleted === phaseTotal && (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                )}
              </div>
              <div className={cn("font-semibold mt-2", isActive ? "text-blue-700" : "text-foreground")}>
                {phase.name}
              </div>
              <p className="text-xs text-muted-foreground mt-1">{phase.timing}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {phaseCompleted}/{phaseTotal} complete
              </p>
            </button>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            {phases.find(p => p.id === activePhase)?.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {phases
              .find(p => p.id === activePhase)
              ?.items.map(item => (
                <motion.div
                  key={item.id}
                  onClick={() => toggleItem(activePhase, item.id)}
                  className={cn(
                    "p-4 rounded-lg border-2 cursor-pointer transition-all",
                    item.completed
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:border-gray-300 bg-card"
                  )}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={cn(
                        "w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                        item.completed
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300"
                      )}
                    >
                      {item.completed && (
                        <CheckCircle2 className="w-4 h-4 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-foreground">{item.task}</span>
                        <Badge className={getPriorityColor(item.priority)}>
                          {item.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{item.description}</p>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {item.timing}
                        </span>
                        <span className="flex items-center gap-1">
                          <FileText className="w-3 h-3" />
                          {item.category}
                        </span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function SiteAssessment() {
  const [assessmentComplete, setAssessmentComplete] = useState(false);
  const [checks, setChecks] = useState<Record<string, boolean>>({});

  const assessmentCategories = [
    {
      id: "location",
      title: "Geographic Location",
      icon: <MapPin className="w-5 h-5" />,
      items: [
        "Distance from airport(s) measured and documented",
        "Airspace classification identified (Class B/C/D/G)",
        "FAA service center contact information confirmed",
        "NOTAM D-area and center coordinates calculated",
        "Nearby helicopter routes and training areas identified"
      ]
    },
    {
      id: "terrain",
      title: "Terrain & Obstructions",
      icon: <Target className="w-5 h-5" />,
      items: [
        "Natural beam termination (hills/mountains) identified",
        "Man-made structures evaluated for termination",
        "Line of sight to protected airspace verified",
        "Tree obstructions assessed for seasonal changes",
        "Temporary structures (cranes, etc.) identified"
      ]
    },
    {
      id: "perimeter",
      title: "Perimeter Security",
      icon: <Shield className="w-5 h-5" />,
      items: [
        "Perimeter fence or barrier in place",
        "Access control points identified and staffed",
        "NOHD/SZED/CZED boundaries marked on ground",
        "Warning signage posted at access points",
        "Emergency egress routes identified and clear"
      ]
    },
    {
      id: "observers",
      title: "Observer Positions",
      icon: <Eye className="w-5 h-5" />,
      items: [
        "Primary observer position with clear CFZ visibility",
        "Secondary/backup observer positions established",
        "Kill switch accessible to all observers",
        "Communication system tested (radio/phone)",
        "Observer rotation schedule planned"
      ]
    },
    {
      id: "equipment",
      title: "Equipment Safety",
      icon: <Radio className="w-5 h-5" />,
      items: [
        "Laser interlocks functional and tested",
        "Emergency stop buttons positioned and tested",
        "Scan-fail protection enabled and verified",
        "Beam alignment verified before each show",
        "Backup power/systems available if needed"
      ]
    }
  ];

  const toggleCheck = (categoryId: string, itemIdx: number) => {
    const key = `${categoryId}-${itemIdx}`;
    setChecks(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const getCompletionPercent = () => {
    const totalItems = assessmentCategories.reduce((sum, cat) => sum + cat.items.length, 0);
    const checkedItems = Object.values(checks).filter(Boolean).length;
    return (checkedItems / totalItems) * 100;
  };

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-blue-900">Assessment Progress</span>
          <span className="text-sm text-blue-700">{Math.round(getCompletionPercent())}% Complete</span>
        </div>
        <Progress value={getCompletionPercent()} className="h-2" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {assessmentCategories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-3">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                  {category.icon}
                </div>
                <CardTitle className="text-base">{category.title}</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {category.items.map((item, idx) => {
                  const isChecked = checks[`${category.id}-${idx}`];
                  return (
                    <label
                      key={idx}
                      className={cn(
                        "flex items-start gap-3 p-2 rounded-lg cursor-pointer transition-all",
                        isChecked ? "bg-green-50" : "hover:bg-muted"
                      )}
                    >
                      <Checkbox
                        checked={isChecked}
                        onCheckedChange={() => toggleCheck(category.id, idx)}
                      />
                      <span className={cn(
                        "text-sm",
                        isChecked ? "text-muted-foreground line-through" : "text-foreground"
                      )}>
                        {item}
                      </span>
                    </label>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4" />
            Assessment Notes
          </h4>
          <ul className="text-sm text-yellow-700 space-y-1">
            <li>• Document any deficiencies found during assessment</li>
            <li>• All critical items must be addressed before operations</li>
            <li>• Re-assess if site conditions change</li>
            <li>• Include assessment documentation with Form 7140-1 submission</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function BeamTerminationStrategies() {
  const [selectedStrategy, setSelectedStrategy] = useState(BEAM_TERMINATION_STRATEGIES[0]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Termination Strategies</h3>
        {BEAM_TERMINATION_STRATEGIES.map((strategy) => (
          <motion.button
            key={strategy.id}
            onClick={() => setSelectedStrategy(strategy)}
            className={cn(
              "w-full p-4 rounded-lg border-2 text-left transition-all",
              selectedStrategy.id === strategy.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-card"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <div className="font-medium">{strategy.title}</div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{strategy.description}</p>
          </motion.button>
        ))}
      </div>

      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle>{selectedStrategy.title}</CardTitle>
          <CardDescription>{selectedStrategy.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Advantages
              </h4>
              <ul className="space-y-1">
                {selectedStrategy.advantages.map((adv, idx) => (
                  <li key={idx} className="text-sm text-green-700 flex items-start gap-2">
                    <span>•</span>{adv}
                  </li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Considerations
              </h4>
              <ul className="space-y-1">
                {selectedStrategy.considerations.map((con, idx) => (
                  <li key={idx} className="text-sm text-orange-700 flex items-start gap-2">
                    <span>•</span>{con}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Examples</h4>
            <div className="flex flex-wrap gap-2">
              {selectedStrategy.examples.map((example, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm py-1">
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmergencyProcedures() {
  const [selectedEmergency, setSelectedEmergency] = useState<EmergencyProcedure>(EMERGENCY_PROCEDURES[0]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Emergency Scenarios</h3>
        {EMERGENCY_PROCEDURES.map((emergency) => (
          <motion.button
            key={emergency.id}
            onClick={() => setSelectedEmergency(emergency)}
            className={cn(
              "w-full p-4 rounded-lg border-2 text-left transition-all",
              selectedEmergency.id === emergency.id
                ? "border-red-500 bg-red-50"
                : "border-gray-200 hover:border-gray-300 bg-card"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <div className="font-medium">{emergency.title}</div>
            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{emergency.trigger}</p>
          </motion.button>
        ))}
      </div>

      <Card className="lg:col-span-2 border-red-200">
        <CardHeader className="bg-red-50">
          <div className="flex items-center gap-3">
            <Siren className="w-6 h-6 text-red-600" />
            <div>
              <CardTitle className="text-red-900">{selectedEmergency.title}</CardTitle>
              <CardDescription className="text-red-700">
                Trigger: {selectedEmergency.trigger}
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <h4 className="font-semibold text-red-800 mb-3 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Immediate Actions
            </h4>
            <ul className="space-y-2">
              {selectedEmergency.immediate.map((action, idx) => (
                <li key={idx} className="text-sm text-red-700 flex items-start gap-2">
                  <span className="font-bold">{idx + 1}.</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <ClipboardCheck className="w-4 h-4" />
              Follow-up Actions
            </h4>
            <ul className="space-y-2">
              {selectedEmergency.followup.map((action, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-muted-foreground">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4" />
              Emergency Contacts
            </h4>
            <ul className="space-y-1">
              {selectedEmergency.contacts.map((contact, idx) => (
                <li key={idx} className="text-sm text-blue-700 font-mono">
                  {contact}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

export default function Module4_Securing_Shows() {
  const [activeTab, setActiveTab] = useState('checklist');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
          <Shield className="w-4 h-4" />
          Module 6.4
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Securing Outdoor Shows</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Site assessment checklists, beam termination strategies, perimeter security requirements, 
          and emergency procedures for outdoor laser operations.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="checklist" className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4" />
            Checklist
          </TabsTrigger>
          <TabsTrigger value="assessment" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Site Assessment
          </TabsTrigger>
          <TabsTrigger value="termination" className="flex items-center gap-2">
            <Target className="w-4 h-4" />
            Beam Termination
          </TabsTrigger>
          <TabsTrigger value="emergency" className="flex items-center gap-2">
            <Siren className="w-4 h-4" />
            Emergency
          </TabsTrigger>
        </TabsList>

        <TabsContent value="checklist" className="mt-6">
          <ShowChecklist />
        </TabsContent>

        <TabsContent value="assessment" className="mt-6">
          <SiteAssessment />
        </TabsContent>

        <TabsContent value="termination" className="mt-6">
          <BeamTerminationStrategies />
        </TabsContent>

        <TabsContent value="emergency" className="mt-6">
          <EmergencyProcedures />
        </TabsContent>
      </Tabs>

      {/* Reference */}
      <Card className="bg-muted border-gray-200">
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">
            <strong>Reference Standards:</strong> SAE ARP5535 (Safety Observers), 
            SAE AS6029 (Electronic Protection Systems), FAA AC 70-1B (Control Measures), 
            ANSI Z136.6 (Outdoor Laser Safety)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
