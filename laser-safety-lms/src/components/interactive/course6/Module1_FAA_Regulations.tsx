'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Plane, 
  Scale, 
  FileText, 
  AlertTriangle, 
  CheckCircle, 
  BookOpen,
  Shield,
  Radio,
  MapPin,
  Gavel,
  Info,
  ChevronRight,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface RegulationItem {
  id: string;
  title: string;
  citation: string;
  description: string;
  keyPoints: string[];
  category: 'faa' | 'federal' | 'criminal' | 'state';
  severity: 'informational' | 'important' | 'critical';
}

interface JurisdictionLevel {
  level: string;
  authority: string;
  scope: string;
  examples: string[];
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const REGULATIONS: RegulationItem[] = [
  {
    id: '14cfr107',
    title: '14 CFR Part 107 - Small UAS',
    citation: '14 CFR § 107.29',
    description: 'Regulations for small unmanned aircraft systems including laser operations from sUAS platforms.',
    keyPoints: [
      'Prohibits operation of sUAS with external lights unless they comply with FAA regulations',
      'Requires anti-collision lighting for twilight operations',
      'Laser devices must not create a hazard to other aircraft',
      'Operator must maintain visual line of sight',
      'Maximum altitude 400 feet AGL (or 400 feet above structure)'
    ],
    category: 'faa',
    severity: 'critical'
  },
  {
    id: '14cfr91',
    title: '14 CFR Part 91 - General Operating Rules',
    citation: '14 CFR § 91.11',
    description: 'General operating and flight rules applicable to all aircraft operations including laser safety considerations.',
    keyPoints: [
      'Prohibits interference with flight crew members',
      'Laser illumination can constitute interference',
      'FAA may seek civil penalties up to $11,000 per violation',
      'Applies to all aircraft operations in US airspace',
      'Includes provisions for emergency authority'
    ],
    category: 'faa',
    severity: 'critical'
  },
  {
    id: 'ac70-1',
    title: 'AC 70-1B - Outdoor Laser Operations',
    citation: 'FAA AC 70-1B (02/14/2022)',
    description: 'Comprehensive guidance for planning outdoor laser operations affecting National Airspace System.',
    keyPoints: [
      'Defines Flight Zones: LFZ, CFZ, SFZ, NFZ',
      'Requires FAA Form 7140-1 for outdoor laser operations',
      'File notice at least 30 days before operation',
      'Provides calculation methods for NOHD, SZED, CZED, LFED',
      'Mandates visual interference hazard assessments'
    ],
    category: 'faa',
    severity: 'critical'
  },
  {
    id: 'ac70-2',
    title: 'AC 70-2A - Laser Illumination Reporting',
    citation: 'FAA AC 70-2A (02/08/2013)',
    description: 'Guidance for reporting unauthorized laser illumination of aircraft and ATC procedures.',
    keyPoints: [
      'Laser incidents treated as in-flight emergencies by ATC',
      'ATC broadcasts every 5 minutes for 20 minutes after report',
      'ATIS broadcasts for 1 hour following reported event',
      'Aircrews must complete Laser Beam Exposure Questionnaire',
      'Domestic Events Network (DEN) coordinates with law enforcement'
    ],
    category: 'faa',
    severity: 'important'
  },
  {
    id: 'usc39a',
    title: '18 U.S.C. § 39A - Aiming Laser at Aircraft',
    citation: '18 U.S.C. § 39A',
    description: 'Federal criminal statute prohibiting aiming laser pointers at aircraft.',
    keyPoints: [
      'Makes it illegal to aim laser pointer at aircraft or its flight path',
      'Violations: Up to 5 years imprisonment',
      'Fines up to $250,000',
      'FBI, FAA, and local prosecutors actively enforce',
      'Applies to all lasers aimed at aircraft in US airspace'
    ],
    category: 'criminal',
    severity: 'critical'
  },
  {
    id: 'usc44701',
    title: '49 U.S.C. § 44701 - General Requirements',
    citation: '49 U.S.C. § 44701(a)(5)',
    description: 'FAA authority to protect flight of aircraft in air commerce.',
    keyPoints: [
      'Grants FAA authority to regulate airspace safety',
      'Includes protection against laser hazards',
      'Basis for FAA regulatory oversight of outdoor laser operations',
      'Supports FAA enforcement actions',
      'Covers all navigable airspace'
    ],
    category: 'federal',
    severity: 'important'
  },
  {
    id: 'usc40103',
    title: '49 U.S.C. § 40103 - Sovereignty and Use of Airspace',
    citation: '49 U.S.C. § 40103',
    description: 'Primary FAA authority for regulating safe and efficient use of navigable airspace.',
    keyPoints: [
      'FAA has exclusive sovereignty over US airspace',
      'Authority to regulate safe and efficient use of airspace',
      'Public right of transit through navigable airspace',
      'Basis for FAA coordination requirements',
      'Applies to both civilian and military operations'
    ],
    category: 'federal',
    severity: 'informational'
  },
  {
    id: '21cfr1040',
    title: '21 CFR Part 1040 - FDA Laser Performance Standards',
    citation: '21 CFR § 1040.10 & 1040.11',
    description: 'FDA regulations for laser product performance and safety standards.',
    keyPoints: [
      'Performance standards for light-emitting products',
      'Requires variance for outdoor laser light shows',
      'Manufacturers must certify compliance',
      'Mandatory safety features based on hazard class',
      'FDA coordinates with FAA on outdoor operations'
    ],
    category: 'federal',
    severity: 'important'
  }
];

const JURISDICTION_LEVELS: JurisdictionLevel[] = [
  {
    level: 'Federal (FAA)',
    authority: 'Department of Transportation',
    scope: 'Navigable airspace, aircraft safety, NOTAM issuance',
    examples: ['Airspace restrictions', 'NOTAM procedures', 'Pilot certification', 'Aircraft operations']
  },
  {
    level: 'Federal (Criminal)',
    authority: 'DOJ/FBI',
    scope: 'Criminal prosecution for laser interference',
    examples: ['18 U.S.C. § 39A violations', 'Interference with flight crew', 'Federal investigations']
  },
  {
    level: 'Federal (FDA)',
    authority: 'HHS/FDA CDRH',
    scope: 'Laser product manufacturing and marketing',
    examples: ['Product safety standards', 'Variance approvals', 'Import compliance']
  },
  {
    level: 'State',
    authority: 'State Legislatures',
    scope: 'Criminal statutes, licensing requirements',
    examples: ['State laser pointer laws', 'Professional licensing', 'Local enforcement']
  },
  {
    level: 'Local',
    authority: 'Cities/Counties',
    scope: 'Permitting, zoning, local ordinances',
    examples: ['Event permits', 'Noise ordinances', 'Fire safety inspections']
  }
];

const COMPLIANCE_REQUIREMENTS = [
  {
    id: 'notification',
    title: 'FAA Notification',
    description: 'Submit FAA Form 7140-1 at least 30 days before operation',
    category: 'pre-operation',
    required: true,
    deadline: '30 days prior'
  },
  {
    id: 'variance',
    title: 'FDA Variance (if applicable)',
    description: 'Obtain FDA variance for demonstration laser products',
    category: 'pre-operation',
    required: true,
    deadline: 'Before operation'
  },
  {
    id: 'lod',
    title: 'Letter of Determination',
    description: 'Receive FAA LOD with "no objection" determination',
    category: 'pre-operation',
    required: true,
    deadline: 'Before operation begins'
  },
  {
    id: 'notam',
    title: 'NOTAM Filing',
    description: 'Coordinate with FAA for Notice to Air Missions',
    category: 'pre-operation',
    required: true,
    deadline: '24-72 hours prior'
  },
  {
    id: 'atc-coord',
    title: 'ATC Coordination',
    description: 'Establish direct communications with controlling facility',
    category: 'during-operation',
    required: true,
    deadline: 'T-60 minutes'
  },
  {
    id: 'observers',
    title: 'Safety Observers',
    description: 'Position trained observers per SAE ARP5535',
    category: 'during-operation',
    required: true,
    deadline: 'Continuous'
  },
  {
    id: 'logging',
    title: 'Operation Logging',
    description: 'Maintain detailed logs of all laser operations',
    category: 'post-operation',
    required: true,
    deadline: 'Within 1 hour'
  },
  {
    id: 'reporting',
    title: 'Incident Reporting',
    description: 'Report any laser illumination incidents to FAA',
    category: 'post-operation',
    required: true,
    deadline: 'Immediate'
  }
];

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function RegulationExplorer() {
  const [selectedReg, setSelectedReg] = useState<RegulationItem>(REGULATIONS[0]);
  const [filter, setFilter] = useState<string>('all');

  const filteredRegs = filter === 'all' 
    ? REGULATIONS 
    : REGULATIONS.filter(r => r.category === filter);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'faa': return 'bg-blue-100 text-blue-800';
      case 'federal': return 'bg-purple-100 text-purple-800';
      case 'criminal': return 'bg-red-100 text-red-800';
      case 'state': return 'bg-green-100 text-green-800';
      default: return 'bg-muted text-foreground';
    }
  };

  const getSeverityIcon = (sev: string) => {
    switch (sev) {
      case 'critical': return <AlertTriangle className="w-4 h-4 text-red-500" />;
      case 'important': return <Info className="w-4 h-4 text-orange-500" />;
      default: return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Regulation List */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'all', label: 'All' },
            { id: 'faa', label: 'FAA' },
            { id: 'federal', label: 'Federal' },
            { id: 'criminal', label: 'Criminal' }
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                filter === f.id 
                  ? "bg-blue-600 text-white" 
                  : "bg-muted text-muted-foreground hover:bg-gray-200"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2">
          {filteredRegs.map((reg) => (
            <motion.button
              key={reg.id}
              onClick={() => setSelectedReg(reg)}
              className={cn(
                "w-full p-4 rounded-lg border-2 text-left transition-all",
                selectedReg.id === reg.id 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300 bg-card"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    {getSeverityIcon(reg.severity)}
                    <span className="font-semibold text-sm">{reg.citation}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{reg.title}</p>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 ml-2" />
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Regulation Details */}
      <Card className="lg:col-span-2 border-2">
        <CardHeader className={cn(
          "pb-4",
          selectedReg.category === 'criminal' ? 'bg-red-50' :
          selectedReg.category === 'faa' ? 'bg-blue-50' : 'bg-purple-50'
        )}>
          <div className="flex items-center gap-3">
            {selectedReg.category === 'criminal' ? <Gavel className="w-6 h-6 text-red-600" /> :
             selectedReg.category === 'faa' ? <Plane className="w-6 h-6 text-blue-600" /> :
             <Scale className="w-6 h-6 text-purple-600" />}
            <div className="flex-1">
              <CardTitle className="text-lg">{selectedReg.title}</CardTitle>
              <CardDescription className="font-mono">{selectedReg.citation}</CardDescription>
            </div>
            <Badge className={getCategoryColor(selectedReg.category)}>
              {selectedReg.category.toUpperCase()}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pt-6 space-y-6">
          <p className="text-foreground">{selectedReg.description}</p>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-500" />
              Key Requirements
            </h4>
            <ul className="space-y-2">
              {selectedReg.keyPoints.map((point, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="flex items-start gap-3 p-3 bg-muted rounded-lg"
                >
                  <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-medium flex-shrink-0">
                    {idx + 1}
                  </span>
                  <span className="text-sm text-foreground">{point}</span>
                </motion.li>
              ))}
            </ul>
          </div>

          {selectedReg.category === 'criminal' && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h4 className="font-semibold text-red-800 mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Criminal Penalty
              </h4>
              <p className="text-sm text-red-700">
                Violation of this statute carries federal criminal penalties. FBI and FAA actively investigate and prosecute laser incidents.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function JurisdictionMapper() {
  const [selectedLevel, setSelectedLevel] = useState<JurisdictionLevel>(JURISDICTION_LEVELS[0]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-5 gap-3">
        {JURISDICTION_LEVELS.map((level, idx) => (
          <motion.button
            key={level.level}
            onClick={() => setSelectedLevel(level)}
            className={cn(
              "p-4 rounded-lg border-2 text-center transition-all",
              selectedLevel.level === level.level
                ? "border-blue-500 bg-blue-50 shadow-md"
                : "border-gray-200 hover:border-gray-300 bg-card"
            )}
            whileHover={{ y: -2 }}
          >
            <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-muted flex items-center justify-center text-lg font-bold">
              {idx + 1}
            </div>
            <div className="font-medium text-sm">{level.level}</div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedLevel.level}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className="border-2">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Scale className="w-6 h-6 text-blue-600" />
                <div>
                  <CardTitle>{selectedLevel.level}</CardTitle>
                  <CardDescription>{selectedLevel.authority}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-900 mb-2">Scope of Authority</h4>
                  <p className="text-sm text-blue-700">{selectedLevel.scope}</p>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-semibold text-gray-900 mb-2">Examples</h4>
                  <ul className="text-sm text-foreground space-y-1">
                    {selectedLevel.examples.map((ex, idx) => (
                      <li key={idx}>• {ex}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Federal Preemption Note
          </h4>
          <p className="text-sm text-yellow-700">
            While states and localities may enact their own laser regulations, the FAA maintains exclusive authority 
            over navigable airspace. Local regulations cannot conflict with or reduce FAA safety requirements. 
            Operators must comply with ALL applicable regulations from federal, state, and local authorities.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function ComplianceChecklist() {
  const [completed, setCompleted] = useState<Set<string>>(new Set());

  const toggleItem = (id: string) => {
    const newCompleted = new Set(completed);
    if (newCompleted.has(id)) {
      newCompleted.delete(id);
    } else {
      newCompleted.add(id);
    }
    setCompleted(newCompleted);
  };

  const getCategoryItems = (category: string) => 
    COMPLIANCE_REQUIREMENTS.filter(r => r.category === category);

  const progress = (completed.size / COMPLIANCE_REQUIREMENTS.length) * 100;

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-blue-900">Compliance Progress</span>
          <span className="text-sm text-blue-700">{completed.size} of {COMPLIANCE_REQUIREMENTS.length} complete</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { id: 'pre-operation', label: 'Pre-Operation', icon: FileText, color: 'blue' },
          { id: 'during-operation', label: 'During Operation', icon: Radio, color: 'orange' },
          { id: 'post-operation', label: 'Post-Operation', icon: Shield, color: 'green' }
        ].map(phase => {
          const items = getCategoryItems(phase.id);
          const Icon = phase.icon;
          return (
            <Card key={phase.id} className={cn("border-2", `border-${phase.color}-200`)}>
              <CardHeader className={cn(`bg-${phase.color}-50`)}>
                <div className="flex items-center gap-2">
                  <Icon className={cn(`w-5 h-5 text-${phase.color}-600`)} />
                  <CardTitle className="text-base">{phase.label}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {items.map(item => {
                  const isCompleted = completed.has(item.id);
                  return (
                    <motion.div
                      key={item.id}
                      onClick={() => toggleItem(item.id)}
                      className={cn(
                        "p-3 rounded-lg border-2 cursor-pointer transition-all",
                        isCompleted 
                          ? "border-green-200 bg-green-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 mt-0.5",
                          isCompleted ? "bg-green-500 border-green-500" : "border-gray-300"
                        )}>
                          {isCompleted && <CheckCircle className="w-3 h-3 text-white" />}
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-sm">{item.title}</div>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                          <Badge variant="outline" className="mt-2 text-xs">
                            {item.deadline}
                          </Badge>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

export default function Module1_FAA_Regulations() {
  const [activeTab, setActiveTab] = useState('regulations');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
          <Plane className="w-4 h-4" />
          Module 6.1
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">FAA Regulations</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Comprehensive overview of federal aviation regulations governing outdoor laser operations, 
          including 14 CFR Part 107, AC 70-1 guidance, federal vs local jurisdiction, and compliance requirements.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="regulations" className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Regulations
          </TabsTrigger>
          <TabsTrigger value="jurisdiction" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Jurisdiction
          </TabsTrigger>
          <TabsTrigger value="compliance" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Compliance
          </TabsTrigger>
        </TabsList>

        <TabsContent value="regulations" className="mt-6">
          <RegulationExplorer />
        </TabsContent>

        <TabsContent value="jurisdiction" className="mt-6">
          <JurisdictionMapper />
        </TabsContent>

        <TabsContent value="compliance" className="mt-6">
          <ComplianceChecklist />
        </TabsContent>
      </Tabs>

      {/* Footer Reference */}
      <Card className="bg-muted border-gray-200">
        <CardContent className="pt-4">
          <div className="flex items-start gap-4">
            <ExternalLink className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
            <div className="text-sm text-muted-foreground">
              <strong>Reference Documents:</strong>{' '}
              14 CFR Part 107, 14 CFR Part 91, FAA AC 70-1B, FAA AC 70-2A, 18 U.S.C. § 39A, 49 U.S.C. § 40103, 49 U.S.C. § 44701
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
