'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
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
  Sparkles,
  Target
} from 'lucide-react';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  }
};

const cardVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.3 }
  }
};

const expandVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 }
  }
};

// ============================================================================
// DATA
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

const caseStudies = [
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

const responsibilityCategories = [
  {
    id: 'training',
    name: 'Personnel Training & Competency',
    icon: <GraduationCap className="w-5 h-5" />,
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
    icon: <AlertTriangle className="w-5 h-5" />,
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
    icon: <Shield className="w-5 h-5" />,
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
    icon: <FileText className="w-5 h-5" />,
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
    icon: <Eye className="w-5 h-5" />,
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
    icon: <ClipboardCheck className="w-5 h-5" />,
    items: [
      { id: 'm1', text: 'Schedule routine servicing procedures', frequency: 'monthly' },
      { id: 'm2', text: 'Verify protective eyewear availability and condition', frequency: 'weekly' },
      { id: 'm3', text: 'Inspect mounting hardware and barriers', frequency: 'weekly' },
      { id: 'm4', text: 'Review and update maintenance procedures', frequency: 'monthly' }
    ]
  }
];

const qualificationAreas = [
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
  const [currentScenario, setCurrentScenario] = useState(0);
  const [scenarioAnswer, setScenarioAnswer] = useState<boolean | null>(null);
  const [showScenarioResult, setShowScenarioResult] = useState(false);
  const [completedScenarios, setCompletedScenarios] = useState<number[]>([]);
  const [expandedCase, setExpandedCase] = useState<number | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [selectedFrequency, setSelectedFrequency] = useState<string>('all');
  const [checkedQualifications, setCheckedQualifications] = useState<Set<string>>(new Set());
  const [documentationProgress, setDocumentationProgress] = useState<Record<string, Set<string>>>({});

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

  const toggleQualification = (req: string) => {
    const newChecked = new Set(checkedQualifications);
    if (newChecked.has(req)) {
      newChecked.delete(req);
    } else {
      newChecked.add(req);
    }
    setCheckedQualifications(newChecked);
  };

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

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header */}
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-foreground flex items-center justify-center gap-3">
          <UserCheck className="w-8 h-8 text-blue-500" />
          Module 3: Role of the Laser Safety Officer
        </h1>
        <p className="text-muted-foreground">Understanding LSO authority, responsibilities, and qualifications</p>
      </motion.div>

      {/* Section 1: What is an LSO? */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <UserCheck className="w-6 h-6 text-blue-500" />
              <CardTitle>Section 1: What is an LSO?</CardTitle>
            </div>
            <CardDescription>
              Understanding when a Laser Safety Officer is required and their importance
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div 
              className="bg-blue-50 p-4 rounded-lg"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="font-semibold text-blue-900 mb-2">Definition</h3>
              <p className="text-blue-800">
                A <strong>Laser Safety Officer (LSO)</strong> is a person responsible for evaluating and managing 
                laser risks, and implementing the laser safety precautions specified by the supplier or venue. 
                The LSO has <strong>executive responsibility</strong> (not merely advisory) for the day-to-day 
                management, operation and maintenance of laser installations.
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <h3 className="font-semibold text-foreground mb-3">When is an LSO Required?</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  'Class 3B or Class 4 laser installations',
                  'Permanent laser installations in venues',
                  'Complex temporary installations',
                  'Audience scanning applications',
                  'Outdoor laser displays',
                  'Multiple laser system coordination',
                  'Performers present during laser operation',
                  'Regulatory/licensing requirements'
                ].map((item, index) => (
                  <motion.div 
                    key={index}
                    className="flex items-start gap-2"
                    variants={itemVariants}
                    whileHover={{ x: 5 }}
                  >
                    <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 shrink-0" />
                    <span className="text-sm text-muted-foreground">{item}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <Separator />

            {/* Interactive Scenario */}
            <motion.div variants={itemVariants}>
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <Scale className="w-5 h-5" />
                Interactive Scenario: &quot;Do I Need an LSO?&quot;
              </h3>
              
              <Card className="bg-muted/50">
                <CardContent className="p-6 space-y-4">
                  <motion.div 
                    className="flex items-center justify-between"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Badge variant="outline">Scenario {currentScenario + 1} of {lsoScenarios.length}</Badge>
                    <Badge variant="secondary">{completedScenarios.length} Completed</Badge>
                  </motion.div>

                  <motion.div
                    key={scenario.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h4 className="font-semibold text-lg text-foreground">{scenario.question}</h4>
                    <p className="text-muted-foreground mt-1">{scenario.context}</p>
                  </motion.div>

                  <motion.div 
                    className="bg-card p-4 rounded-lg border"
                    variants={staggerContainer}
                    initial="hidden"
                    animate="visible"
                  >
                    <p className="font-medium text-sm text-foreground mb-2">Key Factors:</p>
                    <ul className="space-y-1">
                      {scenario.factors.map((factor, idx) => (
                        <motion.li 
                          key={idx} 
                          className="text-sm text-muted-foreground flex items-start gap-2"
                          variants={itemVariants}
                        >
                          <span className="text-primary">•</span> {factor}
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>

                  <AnimatePresence mode="wait">
                    {!showScenarioResult ? (
                      <motion.div 
                        className="space-y-3"
                        key="question"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <p className="font-medium text-foreground">Does this situation require a designated LSO?</p>
                        <div className="flex gap-3">
                          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button onClick={() => handleScenarioAnswer(true)} className="w-full">
                              Yes, LSO Required
                            </Button>
                          </motion.div>
                          <motion.div className="flex-1" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                            <Button onClick={() => handleScenarioAnswer(false)} variant="outline" className="w-full">
                              No LSO Needed
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="result"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0 }}
                        className={`p-4 rounded-lg ${scenarioAnswer === scenario.needsLSO ? 'bg-green-100' : 'bg-red-100'}`}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          {scenarioAnswer === scenario.needsLSO ? (
                            <>
                              <CheckCircle2 className="w-5 h-5 text-green-600" />
                              <span className="font-semibold text-green-800 dark:text-green-200">Correct!</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-5 h-5 text-red-600" />
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
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section 2: LSO Authority */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="border-l-4 border-l-red-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-6 h-6 text-red-500" />
              <CardTitle>Section 2: LSO Authority</CardTitle>
            </div>
            <CardDescription>
              Understanding the LSO&apos;s power to halt operations and real-world case studies
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div 
              className="bg-red-50 p-4 rounded-lg border border-red-200"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <h3 className="font-semibold text-red-900 mb-2 flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Executive Authority
              </h3>
              <p className="text-red-800">
                The LSO has <strong>executive responsibility</strong> — not merely an advisory role — for the 
                day-to-day management, operation and maintenance of laser installations.
              </p>
            </motion.div>

            <motion.div variants={staggerContainer} initial="hidden" animate="visible">
              <h3 className="font-semibold text-foreground mb-4">Real-World Case Studies</h3>
              <div className="space-y-3">
                {caseStudies.map((study) => (
                  <motion.div key={study.id} variants={itemVariants}>
                    <Card className="overflow-hidden">
                      <motion.button
                        onClick={() => setExpandedCase(expandedCase === study.id ? null : study.id)}
                        className="w-full p-4 flex items-center justify-between hover:bg-muted/50 transition-colors"
                        whileHover={{ backgroundColor: 'rgba(0,0,0,0.03)' }}
                      >
                        <div className="flex items-center gap-3">
                          <BookOpen className="w-5 h-5 text-muted-foreground" />
                          <div className="text-left">
                            <p className="font-semibold text-foreground">{study.title}</p>
                            <p className="text-sm text-muted-foreground">{study.venue}</p>
                          </div>
                        </div>
                        <motion.div
                          animate={{ rotate: expandedCase === study.id ? 180 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronDown className="w-5 h-5 text-muted-foreground" />
                        </motion.div>
                      </motion.button>
                      
                      <AnimatePresence>
                        {expandedCase === study.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <CardContent className="pt-0 pb-4 px-4 border-t bg-muted/50">
                              <motion.div 
                                className="grid gap-3 mt-4"
                                variants={staggerContainer}
                                initial="hidden"
                                animate="visible"
                              >
                                <motion.div variants={itemVariants}>
                                  <span className="font-semibold text-sm text-foreground">Scenario: </span>
                                  <span className="text-sm text-muted-foreground">{study.scenario}</span>
                                </motion.div>
                                <motion.div 
                                  className="bg-red-100 p-3 rounded"
                                  variants={itemVariants}
                                >
                                  <span className="font-semibold text-sm text-red-800">Hazard Identified: </span>
                                  <span className="text-sm text-red-700">{study.hazard}</span>
                                </motion.div>
                                <motion.div 
                                  className="bg-blue-100 p-3 rounded"
                                  variants={itemVariants}
                                >
                                  <span className="font-semibold text-sm text-blue-800">LSO Action: </span>
                                  <span className="text-sm text-blue-700">{study.lsoAction}</span>
                                </motion.div>
                                <motion.div variants={itemVariants}>
                                  <span className="font-semibold text-sm text-foreground">Outcome: </span>
                                  <span className="text-sm text-muted-foreground">{study.outcome}</span>
                                </motion.div>
                                <motion.div 
                                  className="bg-amber-50 p-3 rounded border border-amber-200"
                                  variants={itemVariants}
                                >
                                  <span className="font-semibold text-sm text-amber-800">Key Lesson: </span>
                                  <span className="text-sm text-amber-700">{study.lesson}</span>
                                </motion.div>
                              </motion.div>
                            </CardContent>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section 3: LSO Responsibilities */}
      <motion.div variants={cardVariants} initial="hidden" animate="visible">
        <Card className="border-l-4 border-l-green-500">
          <CardHeader>
            <div className="flex items-center gap-2">
              <ClipboardCheck className="w-6 h-6 text-green-500" />
              <CardTitle>Section 3: LSO Responsibilities</CardTitle>
            </div>
            <CardDescription>
              Comprehensive responsibility checklist with time-based scheduling
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Progress Overview */}
            <motion.div 
              className="bg-muted/50 p-4 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-foreground">Overall Progress</span>
                <motion.span 
                  className="text-sm text-muted-foreground"
                  key={checkedItems.size}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                >
                  {checkedItems.size} of {totalResponsibilities} completed
                </motion.span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(checkedItems.size / totalResponsibilities) * 100}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              
              <div className="grid grid-cols-4 gap-2 mt-4">
                {['all', 'daily', 'weekly', 'monthly'].map((freq) => (
                  <motion.button
                    key={freq}
                    onClick={() => setSelectedFrequency(freq)}
                    className={`p-2 rounded text-xs font-medium transition-colors ${
                      selectedFrequency === freq
                        ? 'bg-green-500 text-white'
                        : 'bg-card text-muted-foreground hover:bg-muted'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {freq === 'all' ? 'All Tasks' : freq.charAt(0).toUpperCase() + freq.slice(1)}
                    <div className="text-xs opacity-75">
                      {Math.round(getProgressByFrequency(freq))}%
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Responsibility Categories */}
            <motion.div 
              className="space-y-4"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {responsibilityCategories.map((category, catIndex) => (
                <motion.div key={category.id} variants={itemVariants}>
                  <Card className="overflow-hidden">
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
                          .map((item, index) => (
                            <motion.label
                              key={item.id}
                              className="flex items-start gap-3 p-3 hover:bg-muted/50 cursor-pointer"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: index * 0.05 }}
                              whileHover={{ x: 3 }}
                            >
                              <Checkbox
                                checked={checkedItems.has(item.id)}
                                onCheckedChange={() => toggleResponsibility(item.id)}
                                className="mt-0.5"
                              />
                              <div className="flex-1">
                                <motion.span 
                                  className={`text-sm ${checkedItems.has(item.id) ? 'line-through text-muted-foreground' : 'text-foreground'}`}
                                  animate={checkedItems.has(item.id) ? { opacity: 0.6 } : { opacity: 1 }}
                                >
                                  {item.text}
                                </motion.span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {item.frequency}
                                </Badge>
                              </div>
                            </motion.label>
                          ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Module Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="text-center">Module Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="grid md:grid-cols-3 gap-4 text-center"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold text-blue-600">Executive</div>
                <p className="text-sm text-muted-foreground">The LSO has executive authority to halt operations immediately when safety is compromised</p>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold text-purple-600">Comprehensive</div>
                <p className="text-sm text-muted-foreground">LSO responsibilities span training, hazard evaluation, controls, documentation, and operations</p>
              </motion.div>
              <motion.div variants={itemVariants} whileHover={{ scale: 1.05 }}>
                <div className="text-3xl font-bold text-green-600">Qualified</div>
                <p className="text-sm text-muted-foreground">LSOs must have sufficient skills, knowledge, and experience for their specific installations</p>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
