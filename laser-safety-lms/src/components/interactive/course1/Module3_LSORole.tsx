'use client';

import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { 
  Shield, 
  UserCheck, 
  AlertTriangle, 
  BookOpen, 
  ClipboardCheck, 
  FileText,
  Users,
  Award,
  Scale,
  CheckCircle2,
  XCircle,
  AlertOctagon,
  Calendar,
  ChevronDown,
  ChevronUp,
  Eye,
  GraduationCap,
  Briefcase,
  ScrollText,
  Info
} from 'lucide-react';

// ============================================================================
// SECTION 1: WHAT IS AN LSO? - Interactive Scenario Data
// ============================================================================

interface ScenarioQuestion {
  id: number;
  question: string;
  context: string;
  factors: string[];
  needsLSO: boolean;
  explanation: string;
}

const lsoScenarios: ScenarioQuestion[] = [
  {
    id: 1,
    question: "Small Village Hall DJ Setup",
    context: "A mobile DJ is setting up for a wedding reception in a small community centre with a 500mW laser purchased from a retail store.",
    factors: [
      "Low power laser (500mW - Class 3B)",
      "Temporary installation for single event",
      "Small venue with limited audience",
      "Beams projected on ceiling only"
    ],
    needsLSO: false,
    explanation: "For low-power Class 3B lasers in small venues with proper installation (beams terminated away from audience), a designated LSO may not be required if the operator has basic laser safety knowledge and follows safe practices. However, someone must still be responsible for safety."
  },
  {
    id: 2,
    question: "Outdoor Music Festival",
    context: "A festival organizer is planning an outdoor music festival with four 10W full-colour laser systems producing aerial effects over a large audience area.",
    factors: [
      "High power lasers (10W each - Class 4)",
      "Audience scanning effects planned",
      "Complex outdoor venue with aircraft considerations",
      "Multiple laser systems requiring coordination",
      "Civil Aviation Authority notification required"
    ],
    needsLSO: true,
    explanation: "Class 4 lasers with audience scanning effects absolutely require a qualified LSO. The complexity of outdoor displays, MPE calculations, CAA coordination, and public safety mandates an LSO with sufficient skills and executive authority."
  },
  {
    id: 3,
    question: "Permanent Nightclub Installation",
    context: "A nightclub owner wants to install a 2W RGB laser system projecting into the dance floor area as a permanent fixture.",
    factors: [
      "Class 4 laser power level",
      "Permanent installation with repeated use",
      "Audience exposure to beams",
      "Requires daily safety checks",
      "Local authority licensing requirements"
    ],
    needsLSO: true,
    explanation: "Any permanent Class 4 installation with potential audience exposure requires an LSO. The ongoing nature of the installation, need for regular checks, and regulatory compliance all necessitate a designated Laser Safety Officer."
  },
  {
    id: 4,
    question: "Corporate Awards Ceremony",
    context: "An indoor arena awards ceremony using 3 x 6W full-colour lasers for stage effects with performers present, but no audience scanning.",
    factors: [
      "Class 4 laser systems",
      "Performers on stage during laser display",
      "No audience scanning planned",
      "Single event with professional operator",
      "Stage choreography incorporated"
    ],
    needsLSO: true,
    explanation: "Even without audience scanning, Class 4 lasers with performers present require an LSO. Performer exposure must be evaluated, choreography must assure negligible ocular exposure risk, and MPE compliance must be verified."
  }
];

// ============================================================================
// SECTION 2: LSO AUTHORITY - Case Studies
// ============================================================================

interface CaseStudy {
  id: number;
  title: string;
  venue: string;
  scenario: string;
  hazard: string;
  lsoAction: string;
  outcome: string;
  lesson: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    title: "The Missing Performer Information",
    venue: "Indoor Arena Awards Ceremony",
    scenario: "Laser supplier was not informed that performers would be on stage during the laser display, and a DJ riser was added after planning.",
    hazard: "Performers at risk of unexpected beam exposure; modified stage layout changed beam paths.",
    lsoAction: "LSO conducted emergency pre-show risk assessment, verified MPE calculations for new performer positions, and established additional safety protocols.",
    outcome: "Show proceeded safely with modified programming and performer positioning.",
    lesson: "LSO must have authority to halt operations when new hazards are discovered and verify all information before beam exposure."
  },
  {
    id: 2,
    title: "The Truss Movement Incident",
    venue: "Village Community Centre",
    scenario: "During a wedding reception, a guest accidentally moved the truss supporting the laser projector.",
    hazard: "Laser beams shifted from ceiling projection into the occupied hall area.",
    lsoAction: "DJ (acting as LSO) immediately stopped the laser, realigned the system, and verified safe operation before continuing.",
    outcome: "Potential exposure prevented; system restored safely.",
    lesson: "Even in small venues, someone must have LSO authority to immediately halt operations when misalignment occurs."
  },
  {
    id: 3,
    title: "The Audience Scanning Decision",
    venue: "Nightclub Refurbishment",
    scenario: "Club owner initially requested audience scanning on the dance floor with a 2W laser.",
    hazard: "Direct audience exposure to Class 4 laser beams without proper assessment and controls.",
    lsoAction: "LSO evaluated requirements, explained the need for enhanced training, daily checks, and detailed risk assessment. Recommended terminating beams away from public instead.",
    outcome: "Design changed to overhead projection only; installation approved with appropriate controls.",
    lesson: "LSO has authority and obligation to reject or modify unsafe proposals, even when requested by the client."
  }
];

// ============================================================================
// SECTION 3: LSO RESPONSIBILITIES - Categorized Checklist
// ============================================================================

interface ResponsibilityCategory {
  id: string;
  name: string;
  icon: React.ReactNode;
  items: { id: string; text: string; frequency: 'daily' | 'weekly' | 'monthly' | 'as-needed' }[];
}

const responsibilityCategories: ResponsibilityCategory[] = [
  {
    id: 'training',
    name: 'Personnel Training & Competency',
    icon: <GraduationCap className="w-5 h-5" aria-hidden="true" />,
    items: [
      { id: 't1', text: 'Ensure operators complete laser safety training', frequency: 'as-needed' },
      { id: 't2', text: 'Verify operator competency for each installation', frequency: 'as-needed' },
      { id: 't3', text: 'Maintain training records and certificates', frequency: 'monthly' },
      { id: 't4', text: 'Brief all personnel on emergency procedures', frequency: 'daily' },
      { id: 't5', text: 'Document special safety arrangements (restricted areas)', frequency: 'as-needed' }
    ]
  },
  {
    id: 'hazard',
    name: 'Hazard Evaluation & Risk Assessment',
    icon: <AlertTriangle className="w-5 h-5" aria-hidden="true" />,
    items: [
      { id: 'h1', text: 'Evaluate MPE levels for all accessible beams', frequency: 'as-needed' },
      { id: 'h2', text: 'Assess reasonably foreseeable fault conditions', frequency: 'as-needed' },
      { id: 'h3', text: 'Identify reflection hazards from surfaces', frequency: 'as-needed' },
      { id: 'h4', text: 'Calculate NOHD and establish hazard zones', frequency: 'as-needed' },
      { id: 'h5', text: 'Review risk assessments for system modifications', frequency: 'as-needed' }
    ]
  },
  {
    id: 'controls',
    name: 'Control Measures & Safety Systems',
    icon: <Shield className="w-5 h-5" aria-hidden="true" />,
    items: [
      { id: 'c1', text: 'Verify scan failure safety systems operational', frequency: 'daily' },
      { id: 'c2', text: 'Test emergency stop (E-stop) systems', frequency: 'daily' },
      { id: 'c3', text: 'Check software blanking and masking', frequency: 'daily' },
      { id: 'c4', text: 'Inspect external optical components alignment', frequency: 'daily' },
      { id: 'c5', text: 'Verify laser hazard warning signage in place', frequency: 'daily' },
      { id: 'c6', text: 'Review key control/password security systems', frequency: 'weekly' }
    ]
  },
  {
    id: 'documentation',
    name: 'Documentation & Records',
    icon: <FileText className="w-5 h-5" aria-hidden="true" />,
    items: [
      { id: 'd1', text: 'Complete pre-show check documentation', frequency: 'daily' },
      { id: 'd2', text: 'Maintain log of alignment checks', frequency: 'daily' },
      { id: 'd3', text: 'Update hand-over documentation', frequency: 'as-needed' },
      { id: 'd4', text: 'Record any incidents or near-misses', frequency: 'as-needed' },
      { id: 'd5', text: 'Archive show records and sign-off documents', frequency: 'monthly' }
    ]
  },
  {
    id: 'operational',
    name: 'Operational Oversight',
    icon: <Eye className="w-5 h-5" aria-hidden="true" />,
    items: [
      { id: 'o1', text: 'Supervise laser system alignment/setup', frequency: 'daily' },
      { id: 'o2', text: 'Monitor show operation for unsafe conditions', frequency: 'daily' },
      { id: 'o3', text: 'Coordinate with venue management and authorities', frequency: 'as-needed' },
      { id: 'o4', text: 'Liaise with CAA for outdoor displays', frequency: 'as-needed' },
      { id: 'o5', text: 'Conduct post-show review and documentation', frequency: 'daily' }
    ]
  },
  {
    id: 'maintenance',
    name: 'Maintenance & Servicing',
    icon: <ClipboardCheck className="w-5 h-5" aria-hidden="true" />,
    items: [
      { id: 'm1', text: 'Schedule routine servicing procedures', frequency: 'monthly' },
      { id: 'm2', text: 'Verify protective eyewear availability and condition', frequency: 'weekly' },
      { id: 'm3', text: 'Inspect mounting hardware and barriers', frequency: 'weekly' },
      { id: 'm4', text: 'Review and update maintenance procedures', frequency: 'monthly' }
    ]
  }
];

// ============================================================================
// SECTION 4: LSO QUALIFICATIONS - Interactive Checker
// ============================================================================

interface QualificationArea {
  id: string;
  name: string;
  requirements: string[];
}

const qualificationAreas: QualificationArea[] = [
  {
    id: 'knowledge',
    name: 'Technical Knowledge Requirements',
    requirements: [
      'Detailed knowledge of laser type and model specifications',
      'Understanding of radiant power and beam divergence',
      'Knowledge of beam wavelengths and associated hazards',
      'Understanding of effect capabilities and accessible beam levels',
      'Familiarity with scanner models, speeds, and modes',
      'Thorough knowledge of operating and safety control systems'
    ]
  },
  {
    id: 'skills',
    name: 'Practical Skills Requirements',
    requirements: [
      'Ability to conduct MPE calculations and measurements',
      'Competency in laser system alignment procedures',
      'Skill in hazard evaluation for display complexity',
      'Capability to implement safety precautions',
      'Proficiency in emergency response procedures'
    ]
  },
  {
    id: 'experience',
    name: 'Experience Requirements',
    requirements: [
      'Experience with laser systems being used',
      'Practical experience in display installations',
      'Understanding of venue-specific considerations',
      'Knowledge of regulatory requirements and standards',
      'Experience with incident response and investigation'
    ]
  }
];

const certifications = [
  { 
    code: 'CLSO', 
    name: 'Certified Laser Safety Officer', 
    description: 'Professional certification demonstrating comprehensive laser safety knowledge',
    requirements: ['Relevant degree or experience', 'Pass certification exam', 'Continuing education']
  },
  { 
    code: 'CMLSO', 
    name: 'Certified Medical Laser Safety Officer', 
    description: 'Specialized certification for medical laser applications',
    requirements: ['Healthcare background', 'Medical laser experience', 'Specialized examination']
  }
];

// ============================================================================
// SECTION 5: LSA vs LSO - Comparison Data
// ============================================================================

const roleComparison = [
  {
    aspect: 'Primary Role',
    lso: 'Day-to-day management, operation and maintenance of laser installations',
    lsa: 'Advisory role for complex laser safety matters and policy development'
  },
  {
    aspect: 'Authority Level',
    lso: 'EXECUTIVE responsibility - can halt operations immediately',
    lsa: 'ADVISORY role - provides guidance and recommendations'
  },
  {
    aspect: 'Scope',
    lso: 'Specific laser installation or venue',
    lsa: 'Organization-wide laser safety program'
  },
  {
    aspect: 'When Required',
    lso: 'Every Class 3B/4 laser installation; permanent or complex temporary setups',
    lsa: 'Large organizations; complex multi-site operations; when specialized expertise needed'
  },
  {
    aspect: 'Key Responsibilities',
    lso: 'Pre-show checks, hazard evaluation, training verification, incident response',
    lsa: 'Policy development, program oversight, complex hazard analysis, regulatory liaison'
  },
  {
    aspect: 'Qualifications',
    lso: 'Sufficient skills, knowledge and experience for specific installation',
    lsa: 'Higher-level qualifications; often CLSO/CMLSO certified'
  }
];

// ============================================================================
// SECTION 6: DOCUMENTATION REQUIREMENTS
// ============================================================================

const documentationTypes = [
  {
    category: 'Hand-Over Documentation',
    items: [
      'Clear instructions on display controls and their effects',
      'Details of permissible display effects and safety implications',
      'Manual shutdown and monitoring requirements',
      'Automatic emergency shutdown system details',
      'Routine servicing and maintenance procedures',
      'Routine adjustment and alignment check procedures',
      'Operator competency and training requirements',
      'Supplier contact information'
    ]
  },
  {
    category: 'Training Records',
    items: [
      'Operator training completion certificates',
      'Safety briefing attendance records',
      'Competency assessment results',
      'Refresher training documentation',
      'Specialized training for specific installations'
    ]
  },
  {
    category: 'Operational Records',
    items: [
      'Daily/weekly alignment check logs',
      'Pre-show safety check documentation',
      'E-stop functionality test records',
      'Show sign-off documents',
      'Post-show review records'
    ]
  },
  {
    category: 'SOP Requirements',
    items: [
      'Standard Operating Procedures for laser use',
      'Emergency response procedures',
      'Incident reporting protocols',
      'Maintenance schedules and procedures',
      'Access control procedures for laser areas'
    ]
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Module3LSORole() {
  // State for Section 1: Scenario Quiz
  const [currentScenario, setCurrentScenario] = useState(0);
  const [scenarioAnswer, setScenarioAnswer] = useState<boolean | null>(null);
  const [showScenarioResult, setShowScenarioResult] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);

  // State for Section 2: Case Studies
  const [expandedCase, setExpandedCase] = useState<number | null>(null);

  // State for Section 3: Responsibility Tracker
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');

  // State for Section 4: Qualification Checker
  const [checkedQualifications, setCheckedQualifications] = useState<Set<string>>(new Set());

  // State for Section 6: Documentation
  const [documentationProgress, setDocumentationProgress] = useState<Record<string, Set<string>>>({});

  const mainContentRef = useRef<HTMLDivElement>(null);

  // Section 1: Scenario Handlers
  const handleScenarioAnswer = (answer: boolean) => {
    setScenarioAnswer(answer);
    setShowScenarioResult(true);
    if (!completedScenarios.includes(currentScenario)) {
      setCompletedScenarios([...completedScenarios, currentScenario]);
    }
  };

  const nextScenario = () => {
    setCurrentScenario((prev) => (prev + 1) % lsoScenarios.length);
    setScenarioAnswer(null);
    setShowScenarioResult(false);
  };

  // Section 3: Responsibility Handlers
  const toggleResponsibility = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const getProgressByFrequency = (freq: string) => {
    let total = 0;
    let checked = 0;
    responsibilityCategories.forEach(cat => {
      cat.items.forEach(item => {
        if (freq === 'all' || item.frequency === freq) {
          total++;
          if (checkedItems.has(item.id)) checked++;
        }
      });
    });
    return total > 0 ? (checked / total) * 100 : 0;
  };

  // Section 4: Qualification Handlers
  const toggleQualification = (req: string) => {
    const newChecked = new Set(checkedQualifications);
    if (newChecked.has(req)) {
      newChecked.delete(req);
    } else {
      newChecked.add(req);
    }
    setCheckedQualifications(newChecked);
  };

  // Section 6: Documentation Handlers
  const toggleDocItem = (category: string, item: string) => {
    setDocumentationProgress(prev => {
      const newProgress = { ...prev };
      if (!newProgress[category]) {
        newProgress[category] = new Set();
      }
      const categorySet = new Set(newProgress[category]);
      if (categorySet.has(item)) {
        categorySet.delete(item);
      } else {
        categorySet.add(item);
      }
      newProgress[category] = categorySet;
      return newProgress;
    });
  };

  const scenario = lsoScenarios[currentScenario];
  const totalResponsibilities = responsibilityCategories.reduce((sum, cat) => sum + cat.items.length, 0);
  const responsibilityProgress = (checkedItems.size / totalResponsibilities) * 100;

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setExpandedCase(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Module 3: Role of the Laser Safety Officer</h1>
        <p className="text-muted-foreground">Understanding LSO authority, responsibilities, and qualifications</p>
      </header>

      <main id="main-content" ref={mainContentRef} tabIndex={-1}>
        {/* ============================================================================
            SECTION 1: WHAT IS AN LSO?
            ============================================================================ */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-blue-500" aria-hidden="true" />
              <CardTitle>Section 1: What is an LSO?</CardTitle>
            </div>
            <CardDescription>
              Understanding when a Laser Safety Officer is required and their importance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Definition */}
            <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 p-4 rounded-lg" role="region" aria-label="LSO Definition">
              <h3 className="font-semibold text-blue-900 mb-2">Definition</h3>
              <p className="text-blue-800 dark:text-blue-200">
                A <strong>Laser Safety Officer (LSO)</strong> is a person responsible for evaluating and managing 
                laser risks, and implementing the laser safety precautions specified by the supplier or venue. 
                The LSO has <strong>executive responsibility</strong> (not merely advisory) for the day-to-day 
                management, operation and maintenance of laser installations.
              </p>
            </div>

            {/* When is an LSO Required */}
            <section aria-labelledby="when-lso-required">
              <h3 id="when-lso-required" className="font-semibold text-foreground mb-3">When is an LSO Required?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <ul className="space-y-2">
                  {[
                    'Class 3B or Class 4 laser installations',
                    'Permanent laser installations in venues',
                    'Complex temporary installations',
                    'Audience scanning applications'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" aria-hidden="true" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
                <ul className="space-y-2">
                  {[
                    'Outdoor laser displays',
                    'Multiple laser system coordination',
                    'Performers present during laser operation',
                    'Regulatory/licensing requirements'
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5" aria-hidden="true" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <Separator />

            {/* Interactive Scenario */}
            <section aria-labelledby="interactive-scenario">
              <h3 id="interactive-scenario" className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5" aria-hidden="true" />
                Interactive Scenario: "Do I Need an LSO?"
              </h3>
              
              <Card className="bg-muted/50">
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">Scenario {currentScenario + 1} of {lsoScenarios.length}</Badge>
                    <Badge variant="secondary">{completedScenarios.length} Completed</Badge>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg text-foreground">{scenario.question}</h4>
                    <p className="text-muted-foreground mt-1">{scenario.context}</p>
                  </div>

                  <div className="bg-card p-4 rounded-lg border">
                    <p className="font-medium text-sm text-foreground mb-2">Key Factors:</p>
                    <ul className="space-y-1">
                      {scenario.factors.map((factor, idx) => (
                        <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                          <span className="text-primary" aria-hidden="true">•</span> {factor}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {!showScenarioResult ? (
                    <div className="space-y-3">
                      <p className="font-medium text-foreground">Does this situation require a designated LSO?</p>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleScenarioAnswer(true)} 
                          className="flex-1"
                          aria-label="Yes, an LSO is required"
                        >
                          Yes, LSO Required
                        </Button>
                        <Button 
                          onClick={() => handleScenarioAnswer(false)} 
                          variant="outline" 
                          className="flex-1"
                          aria-label="No LSO needed"
                        >
                          No LSO Needed
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div 
                      className={`p-4 rounded-lg ${scenarioAnswer === scenario.needsLSO ? 'bg-green-100' : 'bg-red-100'}`}
                      role="alert"
                      aria-live="polite"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        {scenarioAnswer === scenario.needsLSO ? (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-green-600" aria-hidden="true" />
                            <span className="font-semibold text-green-800 dark:text-green-200">Correct!</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-5 h-5 text-red-600" aria-hidden="true" />
                            <span className="font-semibold text-red-800 dark:text-red-200">Incorrect</span>
                          </>
                        )}
                        <span className="text-foreground">
                          {scenario.needsLSO ? 'An LSO IS required' : 'An LSO is NOT necessarily required'}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{scenario.explanation}</p>
                      <Button onClick={nextScenario} className="mt-3" size="sm">
                        Next Scenario
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </section>
          </CardContent>
        </Card>

        {/* ============================================================================
            SECTION 2: LSO AUTHORITY
            ============================================================================ */}
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-red-500" aria-hidden="true" />
              <CardTitle>Section 2: LSO Authority</CardTitle>
            </div>
            <CardDescription>
              Understanding the LSO&apos;s power to halt operations and real-world case studies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Authority Description */}
            <div className="bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 p-4 rounded-lg" role="region" aria-label="Executive Authority">
              <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" aria-hidden="true" />
                Executive Authority
              </h3>
              <p className="text-red-800">
                The LSO has <strong>executive responsibility</strong> — not merely an advisory role — for the 
                day-to-day management, operation and maintenance of laser installations. This means the LSO 
                has the <strong>authority and obligation</strong> to:
              </p>
              <ul className="mt-3 space-y-1 text-red-800">
                <li>• Immediately halt laser operations when unsafe conditions are detected</li>
                <li>• Require modifications to laser programming or setup before operation</li>
                <li>• Reject or modify unsafe proposals, even when requested by clients</li>
                <li>• Establish mandatory safety protocols that must be followed</li>
                <li>• Require additional training or competency verification</li>
              </ul>
            </div>

            {/* Case Studies */}
            <section aria-labelledby="case-studies">
              <h3 id="case-studies" className="font-semibold text-foreground mb-4">Real-World Case Studies</h3>
              <div className="space-y-3">
                {caseStudies.map((study) => (
                  <Card key={study.id} className="overflow-hidden">
                    <button
                      onClick={() => setExpandedCase(expandedCase === study.id ? null : study.id)}
                      className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary"
                      aria-expanded={expandedCase === study.id}
                      aria-controls={`case-content-${study.id}`}
                      id={`case-header-${study.id}`}
                    >
                      <div className="flex items-center gap-3">
                        <BookOpen className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                        <div className="text-left">
                          <p className="font-semibold text-foreground">{study.title}</p>
                          <p className="text-sm text-muted-foreground">{study.venue}</p>
                        </div>
                      </div>
                      {expandedCase === study.id ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" aria-hidden="true" />
                      )}
                    </button>
                    
                    {expandedCase === study.id && (
                      <CardContent 
                        id={`case-content-${study.id}`}
                        className="pt-0 pb-4 px-4 border-t bg-muted/50"
                        role="region"
                        aria-labelledby={`case-header-${study.id}`}
                      >
                        <div className="grid gap-3 mt-4">
                          <div>
                            <span className="font-semibold text-sm text-foreground">Scenario: </span>
                            <span className="text-sm text-muted-foreground">{study.scenario}</span>
                          </div>
                          <div className="bg-red-100 p-3 rounded">
                            <span className="font-semibold text-sm text-red-800">Hazard Identified: </span>
                            <span className="text-sm text-red-700">{study.hazard}</span>
                          </div>
                          <div className="bg-blue-100 p-3 rounded">
                            <span className="font-semibold text-sm text-blue-800">LSO Action: </span>
                            <span className="text-sm text-blue-700">{study.lsoAction}</span>
                          </div>
                          <div>
                            <span className="font-semibold text-sm text-foreground">Outcome: </span>
                            <span className="text-sm text-muted-foreground">{study.outcome}</span>
                          </div>
                          <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-3 rounded">
                            <span className="font-semibold text-sm text-amber-800 dark:text-amber-200">Key Lesson: </span>
                            <span className="text-sm text-amber-700 dark:text-amber-300">{study.lesson}</span>
                          </div>
                        </div>
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            </section>

            {/* Decision Scenario */}
            <Card className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800">
              <CardContent className="p-4">
                <h4 className="font-semibold text-amber-900 dark:text-amber-200 mb-2 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                  Decision Point: What Would You Do?
                </h4>
                <p className="text-amber-800 dark:text-amber-200 text-sm mb-4">
                  During a laser show, you notice that a mirror ball has been added to the stage 
                  without your knowledge. The laser beams are now creating unpredictable reflections 
                  into areas where crew members are working. The show is scheduled to start in 5 minutes.
                </p>
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <Badge className="mt-0.5 bg-green-500">Correct</Badge>
                    <p className="text-sm text-amber-900 dark:text-amber-200">
                      <strong>Immediate Action:</strong> Halt the laser operation immediately, evacuate the 
                      affected areas, remove or shield the mirror ball, and verify safe beam paths before 
                      allowing the show to proceed. No show is worth risking eye injuries.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* ============================================================================
            SECTION 3: LSO RESPONSIBILITIES
            ============================================================================ */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-green-500" aria-hidden="true" />
              <CardTitle>Section 3: LSO Responsibilities</CardTitle>
            </div>
            <CardDescription>
              Comprehensive responsibility checklist with time-based scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Overview */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Overall Progress</span>
                <span className="text-sm text-muted-foreground">
                  {checkedItems.size} of {totalResponsibilities} completed
                </span>
              </div>
              <Progress 
                value={responsibilityProgress} 
                className="h-2" 
                aria-label="Responsibility checklist progress"
                aria-valuenow={Math.round(responsibilityProgress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
              
              <div className="grid grid-cols-4 gap-2 mt-4" role="tablist" aria-label="Filter by frequency">
                {['all', 'daily', 'weekly', 'monthly'].map((freq) => (
                  <button
                    key={freq}
                    onClick={() => setSelectedFrequency(freq)}
                    className={`p-2 rounded text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
                      selectedFrequency === freq
                        ? 'bg-green-500 text-white'
                        : 'bg-card text-muted-foreground hover:bg-muted'
                    }`}
                    role="tab"
                    aria-selected={selectedFrequency === freq}
                    aria-label={freq === 'all' ? 'All tasks' : `${freq} tasks`}
                  >
                    {freq === 'all' ? 'All Tasks' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                    <div className="text-xs opacity-75">
                      {Math.round(getProgressByFrequency(freq))}%
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Responsibility Categories */}
            <div className="space-y-4">
              {responsibilityCategories.map((category) => (
                <Card key={category.id} className="overflow-hidden">
                  <CardHeader className="py-3 bg-muted/50">
                    <div className="flex items-center gap-2">
                      {category.icon}
                      <CardTitle className="text-base">{category.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="divide-y">
                      {category.items
                        .filter(item => selectedFrequency === 'all' || item.frequency === selectedFrequency)
                        .map((item) => (
                          <label
                            key={item.id}
                            className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary"
                          >
                            <Checkbox
                              checked={checkedItems.has(item.id)}
                              onCheckedChange={() => toggleResponsibility(item.id)}
                              className="mt-0.5"
                              aria-label={item.text}
                            />
                            <div className="flex-1">
                              <span className={`text-sm ${checkedItems.has(item.id) ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                                {item.text}
                              </span>
                              <Badge variant="outline" className="ml-2 text-xs">
                                {item.frequency}
                              </Badge>
                            </div>
                          </label>
                        ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Daily/Weekly/Monthly Schedule Summary */}
            <Card className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="w-5 h-5" aria-hidden="true" />
                  LSO Task Schedule Summary
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Daily Tasks (Before Show)</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Verify scan failure safety systems</li>
                      <li>• Test E-stop functionality</li>
                      <li>• Check software blanking/masking</li>
                      <li>• Inspect optical component alignment</li>
                      <li>• Verify warning signage</li>
                      <li>• Complete pre-show documentation</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Weekly Tasks</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Review key control systems</li>
                      <li>• Verify protective eyewear condition</li>
                      <li>• Inspect mounting hardware</li>
                      <li>• Check barrier integrity</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-semibold text-blue-900 mb-2">Monthly Tasks</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Schedule routine servicing</li>
                      <li>• Update maintenance procedures</li>
                      <li>• Maintain training records</li>
                      <li>• Archive show documentation</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        {/* ============================================================================
            SECTION 4: LSO QUALIFICATIONS
            ============================================================================ */}
        <Card className="border-l-4 border-l-purple-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-purple-500" aria-hidden="true" />
              <CardTitle>Section 4: LSO Qualifications</CardTitle>
            </div>
            <CardDescription>
              Required training, experience, and certification options
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Qualification Statement */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-purple-800">
                An LSO must have <strong>sufficient skills, knowledge and experience</strong> in the 
                evaluation and management of laser risks, and must be capable of implementing the 
                laser safety precautions specified by the supplier or venue.
              </p>
            </div>

            {/* Interactive Qualification Checker */}
            <section aria-labelledby="qualification-checker">
              <h3 id="qualification-checker" className="font-semibold text-foreground mb-4">Interactive Qualification Checker</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Check the requirements you meet to assess your readiness for the LSO role:
              </p>
              
              <div className="space-y-4">
                {qualificationAreas.map((area) => (
                  <Card key={area.id}>
                    <CardHeader className="py-3">
                      <CardTitle className="text-base">{area.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        {area.requirements.map((req, idx) => (
                          <label key={idx} className="flex items-start gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-primary rounded p-1 -m-1">
                            <Checkbox
                              checked={checkedQualifications.has(req)}
                              onCheckedChange={() => toggleQualification(req)}
                              aria-label={req}
                            />
                            <span className={`text-sm ${checkedQualifications.has(req) ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                              {req}
                            </span>
                          </label>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Qualification Assessment */}
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-semibold">Qualification Progress</span>
                  <Badge aria-label={`${Math.round((checkedQualifications.size / 17) * 100)} percent complete`}>
                    {Math.round((checkedQualifications.size / 17) * 100)}%
                  </Badge>
                </div>
                <Progress 
                  value={(checkedQualifications.size / 17) * 100} 
                  className="h-2" 
                  aria-label="Qualification progress"
                  aria-valuenow={Math.round((checkedQualifications.size / 17) * 100)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
                <p className="text-sm text-muted-foreground mt-2">
                  {checkedQualifications.size < 10 
                    ? 'Continue building your qualifications. Consider additional training.'
                    : checkedQualifications.size < 15
                    ? 'Good progress! You are approaching LSO qualification level.'
                    : 'Excellent! You have comprehensive LSO qualifications.'}
                </p>
              </div>
            </section>

            {/* Certifications */}
            <section aria-labelledby="professional-certifications">
              <h3 id="professional-certifications" className="font-semibold text-foreground mb-4">Professional Certifications</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {certifications.map((cert) => (
                  <Card key={cert.code} className="border-2 border-purple-200">
                    <CardHeader>
                      <div className="flex items-center gap-2">
                        <Award className="w-5 h-5 text-purple-500" aria-hidden="true" />
                        <CardTitle className="text-lg">{cert.code}</CardTitle>
                      </div>
                      <CardDescription>{cert.name}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-foreground mb-3">{cert.description}</p>
                      <div className="text-sm">
                        <span className="font-semibold">Requirements:</span>
                        <ul className="mt-1 space-y-1 text-muted-foreground">
                          {cert.requirements.map((req, idx) => (
                            <li key={idx}>• {req}</li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
          </CardContent>
        </Card>

        {/* ============================================================================
            SECTION 5: LSA vs LSO
            ============================================================================ */}
        <Card className="border-l-4 border-l-amber-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-amber-500" aria-hidden="true" />
              <CardTitle>Section 5: LSA vs LSO</CardTitle>
            </div>
            <CardDescription>
              Understanding the difference between Laser Safety Adviser and Laser Safety Officer
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Comparison Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-sm" role="table" aria-label="LSO vs LSA comparison">
                <thead>
                  <tr className="bg-amber-100">
                    <th className="p-3 text-left font-semibold text-amber-900 dark:text-amber-200" scope="col">Aspect</th>
                    <th className="p-3 text-left font-semibold text-amber-900 dark:text-amber-200" scope="col">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" aria-hidden="true" />
                        LSO (Laser Safety Officer)
                      </div>
                    </th>
                    <th className="p-3 text-left font-semibold text-amber-900 dark:text-amber-200" scope="col">
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4" aria-hidden="true" />
                        LSA (Laser Safety Adviser)
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {roleComparison.map((row, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-muted/50' : 'bg-card'}>
                      <td className="p-3 font-medium text-foreground">{row.aspect}</td>
                      <td className="p-3 text-muted-foreground">{row.lso}</td>
                      <td className="p-3 text-muted-foreground">{row.lsa}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* When to Use Each */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800">
                <CardHeader>
                  <CardTitle className="text-base text-blue-900">When to Appoint an LSO</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-blue-800">
                    {[
                      'Every Class 3B or Class 4 laser installation',
                      'Permanent installations in venues',
                      'Complex temporary installations',
                      'When audience scanning is planned',
                      'For day-to-day operational safety'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-purple-50">
                <CardHeader>
                  <CardTitle className="text-base text-purple-900">When to Consult an LSA</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm text-purple-800">
                    {[
                      'Large organizations with multiple laser operations',
                      'Complex multi-site operations',
                      'Developing laser safety policies',
                      'Complex hazard analysis needed',
                      'When specialized expertise is required'
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 mt-0.5" aria-hidden="true" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Key Takeaway */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 p-4 rounded-lg">
              <p className="text-amber-800 dark:text-amber-200 text-sm">
                <strong>Key Point:</strong> The LSO and LSA roles are complementary. An LSO may consult 
                an LSA for complex matters, and an LSA may also serve as an LSO for specific installations. 
                The key distinction is that the <strong>LSO has executive authority</strong> for specific 
                installations, while the <strong>LSA provides advisory guidance</strong> on broader policy matters.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* ============================================================================
            SECTION 6: DOCUMENTATION REQUIREMENTS
            ============================================================================ */}
        <Card className="border-l-4 border-l-slate-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ScrollText className="w-6 h-6 text-muted-foreground" aria-hidden="true" />
              <CardTitle>Section 6: Documentation Requirements</CardTitle>
            </div>
            <CardDescription>
              Essential records, SOPs, and training documentation
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Documentation Categories */}
            <div className="grid md:grid-cols-2 gap-4">
              {documentationTypes.map((doc) => (
                <Card key={doc.category}>
                  <CardHeader className="py-3">
                    <CardTitle className="text-base">{doc.category}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {doc.items.map((item, idx) => (
                        <label key={idx} className="flex items-start gap-2 cursor-pointer focus-within:ring-2 focus-within:ring-primary rounded p-1 -m-1">
                          <Checkbox
                            checked={documentationProgress[doc.category]?.has(item) || false}
                            onCheckedChange={() => toggleDocItem(doc.category, item)}
                            aria-label={item}
                          />
                          <span className={`text-sm ${documentationProgress[doc.category]?.has(item) ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                            {item}
                          </span>
                        </label>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Sign-Off Requirements */}
            <Card className="bg-muted/50">
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <FileText className="w-5 h-5" aria-hidden="true" />
                  Sign-Off Requirements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground mb-4">
                  The successful completion of different stages should be recorded, especially where 
                  control passes from one person to another:
                </p>
                <div className="space-y-3">
                  {[
                    { num: 1, title: 'Installer Confirmation', desc: 'Confirm installation is safe to use and provide operating/maintenance procedures', color: 'blue' },
                    { num: 2, title: 'Organizer/Venue Acknowledgment', desc: 'Confirm understanding of procedures and safety requirements', color: 'green' },
                    { num: 3, title: 'Permission to Proceed', desc: 'Event manager and venue operators confirm they have necessary information', color: 'purple' },
                  ].map((item) => (
                    <div key={item.num} className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full bg-${item.color}-100 flex items-center justify-center flex-shrink-0`}>
                        <span className={`text-sm font-semibold text-${item.color}-600`}>{item.num}</span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{item.title}</p>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Documentation Best Practices */}
            <div className="bg-green-50 p-4 rounded-lg">
              <h4 className="font-semibold text-green-900 mb-2">Documentation Best Practices</h4>
              <ul className="space-y-1 text-sm text-green-800">
                <li>• All documents should be dated, timed, and signed by involved parties</li>
                <li>• Keep records of all checks carried out at each stage</li>
                <li>• For small events, email exchanges may suffice; larger events require formal documents</li>
                <li>• Written confirmation is not needed when installer and user are the same, but records are still valuable</li>
                <li>• In case of incidents, ensure full details are recorded immediately</li>
                <li>• Post-show reviews should document what went well and what could be improved</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Module Summary */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
        <CardHeader>
          <CardTitle className="text-center">Module Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600">Executive</div>
              <p className="text-sm text-muted-foreground">The LSO has executive authority to halt operations immediately when safety is compromised</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">Comprehensive</div>
              <p className="text-sm text-muted-foreground">LSO responsibilities span training, hazard evaluation, controls, documentation, and operations</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-green-600">Qualified</div>
              <p className="text-sm text-muted-foreground">LSOs must have sufficient skills, knowledge, and experience for their specific installations</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keyboard shortcuts help */}
      <div className="text-xs text-muted-foreground text-center">
        Keyboard shortcuts: Escape to collapse case studies
      </div>
    </div>
  );
}

