'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Eye,
  FileText,
  Users,
  AlertTriangle,
  Lock,
  Monitor,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
  Settings,
  Wrench,
  ClipboardCheck,
  Zap,
  Building,
  HardHat,
  Info,
} from 'lucide-react';

// ============================================================================
// Section 1: The Hierarchy of Controls
// ============================================================================

interface HierarchyLevel {
  level: number;
  name: string;
  description: string;
  effectiveness: string;
  color: string;
  icon: React.ReactNode;
  examples: string[];
}

const hierarchyLevels: HierarchyLevel[] = [
  {
    level: 1,
    name: 'Elimination/Substitution',
    description: 'Remove the hazard entirely or substitute with a safer alternative',
    effectiveness: 'Most Effective',
    color: 'bg-emerald-500',
    icon: <Shield className="w-5 h-5" aria-hidden="true" />,
    examples: ['Use non-laser measurement tools', 'Fiber delivery instead of open beam', 'Lower power alternative'],
  },
  {
    level: 2,
    name: 'Engineering Controls',
    description: 'Isolate people from the hazard through physical means',
    effectiveness: 'Very Effective',
    color: 'bg-blue-500',
    icon: <Building className="w-5 h-5" aria-hidden="true" />,
    examples: ['Interlocked enclosures', 'Beam stops and barriers', 'Remote interlocks', 'Key control systems'],
  },
  {
    level: 3,
    name: 'Administrative Controls',
    description: 'Change the way people work through procedures and training',
    effectiveness: 'Moderately Effective',
    color: 'bg-amber-500',
    icon: <FileText className="w-5 h-5" aria-hidden="true" />,
    examples: ['SOPs and work procedures', 'Personnel training', 'Warning signs', 'Laser-controlled areas'],
  },
  {
    level: 4,
    name: 'Personal Protective Equipment',
    description: 'Protect the individual with specialized equipment',
    effectiveness: 'Least Effective (Last Resort)',
    color: 'bg-red-500',
    icon: <HardHat className="w-5 h-5" aria-hidden="true" />,
    examples: ['Laser safety eyewear', 'Protective clothing', 'Skin protection'],
  },
];

const incidentExamples = [
  {
    title: 'Research Lab Eye Injury',
    year: '2019',
    cause: 'Inadequate interlock bypassed for convenience',
    outcome: 'Permanent retinal damage to graduate student',
    prevention: 'Proper engineering controls + strict key control',
  },
  {
    title: 'Manufacturing Facility Flash',
    year: '2017',
    cause: 'Missing beam stop, reflective surface in path',
    outcome: 'Multiple workers experienced flash blindness',
    prevention: 'Beam containment verification + barrier installation',
  },
  {
    title: 'Medical Laser Skin Burn',
    year: '2021',
    cause: 'No SOP for high-power alignment procedure',
    outcome: "Second-degree burn to technician's hand",
    prevention: 'Written procedures + hands-on training',
  },
];

function HierarchyPyramid() {
  const [expandedLevel, setExpandedLevel] = useState<number | null>(null);

  const handleKeyDown = (e: React.KeyboardEvent, level: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setExpandedLevel(expandedLevel === level ? null : level);
    }
  };

  return (
    <div className="space-y-4" role="region" aria-label="Hierarchy of controls pyramid">
      <div className="text-sm text-muted-foreground mb-4">
        Click each level to learn more. The hierarchy prioritizes the most effective controls first.
      </div>
      <div className="space-y-2">
        {hierarchyLevels.map((level, index) => (
          <div
            key={level.level}
            className={`${level.color} text-white rounded-lg transition-all overflow-hidden focus-within:ring-2 focus-within:ring-white focus-within:ring-inset`}
            style={{
              marginLeft: `${index * 20}px`,
              marginRight: `${index * 20}px`,
            }}
          >
            <button
              className="w-full p-4 flex items-center justify-between focus:outline-none"
              onClick={() => setExpandedLevel(expandedLevel === level.level ? null : level.level)}
              onKeyDown={(e) => handleKeyDown(e, level.level)}
              aria-expanded={expandedLevel === level.level}
              aria-controls={`level-content-${level.level}`}
              aria-label={`${level.name}: ${level.effectiveness}`}
            >
              <div className="flex items-center gap-3">
                {level.icon}
                <div className="text-left">
                  <div className="font-semibold">{level.name}</div>
                  <div className="text-xs opacity-90">{level.effectiveness}</div>
                </div>
              </div>
              {expandedLevel === level.level ? (
                <ChevronUp className="w-5 h-5" aria-hidden="true" />
              ) : (
                <ChevronDown className="w-5 h-5" aria-hidden="true" />
              )}
            </button>
            {expandedLevel === level.level && (
              <div 
                id={`level-content-${level.level}`}
                className="px-4 pb-4 bg-black/20"
              >
                <p className="text-sm mb-3">{level.description}</p>
                <div className="text-xs">
                  <span className="font-semibold">Examples: </span>
                  {level.examples.join(', ')}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function IncidentExamples() {
  const [selectedIncident, setSelectedIncident] = useState(0);

  return (
    <div className="space-y-4" role="region" aria-label="Real incident examples">
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Select incident example">
        {incidentExamples.map((incident, index) => (
          <Button
            key={index}
            variant={selectedIncident === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedIncident(index)}
            role="tab"
            aria-selected={selectedIncident === index}
            aria-label={`${incident.year}: ${incident.title}`}
          >
            {incident.year}
          </Button>
        ))}
      </div>
      <Card className="border-l-4 border-l-red-500">
        <CardContent className="p-4 space-y-3">
          <div>
            <h4 className="font-semibold text-lg">{incidentExamples[selectedIncident].title}</h4>
            <p className="text-sm text-muted-foreground">{incidentExamples[selectedIncident].year}</p>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Cause:</strong> {incidentExamples[selectedIncident].cause}</span>
            </div>
            <div className="flex gap-2">
              <XCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Outcome:</strong> {incidentExamples[selectedIncident].outcome}</span>
            </div>
            <div className="flex gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Prevention:</strong> {incidentExamples[selectedIncident].prevention}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// Section 2: Engineering Controls
// ============================================================================

interface EngineeringControl {
  id: string;
  name: string;
  description: string;
  requirements: string[];
  visualType: 'enclosure' | 'beamstop' | 'interlock' | 'keycontrol';
}

const engineeringControls: EngineeringControl[] = [
  {
    id: 'interlocked-enclosure',
    name: 'Interlocked Enclosures',
    description: 'Protective housing that prevents laser emission when opened',
    requirements: [
      'Fail-safe design (open = laser off)',
      'Tamper-resistant construction',
      'Visible status indication',
      'Cannot be bypassed without tools',
    ],
    visualType: 'enclosure',
  },
  {
    id: 'non-interlocked',
    name: 'Non-Interlocked Enclosures',
    description: 'Fixed protective housing for Class 1 operation',
    requirements: [
      'Requires tools to open',
      'Warning labels required',
      'Maintenance-only access',
      'Appropriate for embedded lasers',
    ],
    visualType: 'enclosure',
  },
  {
    id: 'beam-stops',
    name: 'Beam Stops & Barriers',
    description: 'Absorb or block stray laser radiation',
    requirements: [
      'Rated for maximum expected power',
      'Fire-resistant materials',
      'Proper mounting and stability',
      'Regular inspection schedule',
    ],
    visualType: 'beamstop',
  },
  {
    id: 'remote-interlocks',
    name: 'Remote Interlock Connectors',
    description: 'External connections for door/window interlocks',
    requirements: [
      'Compatible with safety systems',
      'Clearly labeled connections',
      'Tested during commissioning',
      'Documented in SOPs',
    ],
    visualType: 'interlock',
  },
  {
    id: 'key-control',
    name: 'Key Control Systems',
    description: 'Physical key prevents unauthorized laser operation',
    requirements: [
      'Key removable only in OFF position',
      'Controlled key distribution',
      'Authorized personnel only',
      'Logged key usage',
    ],
    visualType: 'keycontrol',
  },
];

function EngineeringVisual({ type }: { type: EngineeringControl['visualType'] }) {
  switch (type) {
    case 'enclosure':
      return (
        <svg viewBox="0 0 200 150" className="w-full h-32" role="img" aria-label="Interlocked enclosure diagram">
          <title>Interlocked Enclosure</title>
          <desc>Diagram showing a protective housing with interlock indicator</desc>
          <rect x="40" y="30" width="120" height="90" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="75" r="20" fill="none" stroke="#FF0000" strokeWidth="2" />
          <text x="100" y="80" textAnchor="middle" className="stroke-destructive" fontSize="10">Laser</text>
          <rect x="150" y="40" width="8" height="8" className="stroke-green-500" />
          <text x="154" y="60" textAnchor="middle" fontSize="8" fill="currentColor">OK</text>
          <line x1="40" y1="30" x2="40" y2="120" stroke="currentColor" strokeWidth="2" strokeDasharray="4,2" />
        </svg>
      );
    case 'beamstop':
      return (
        <svg viewBox="0 0 200 150" className="w-full h-32" role="img" aria-label="Beam stop diagram">
          <title>Beam Stop</title>
          <desc>Diagram showing a laser beam being absorbed by a beam stop before reaching the target wall</desc>
          <line x1="20" y1="75" x2="140" y2="75" stroke="#FF0000" strokeWidth="3" />
          <rect x="140" y="50" width="20" height="50" fill="#333" stroke="currentColor" />
          <text x="150" y="115" textAnchor="middle" fontSize="8" fill="currentColor">Beam Stop</text>
          <rect x="170" y="30" width="5" height="90" fill="#666" />
          <line x1="165" y1="75" x2="165" y2="75" stroke="#00FF00" strokeWidth="4" />
        </svg>
      );
    case 'interlock':
      return (
        <svg viewBox="0 0 200 150" className="w-full h-32" role="img" aria-label="Remote interlock diagram">
          <title>Remote Interlock Connection</title>
          <desc>Diagram showing laser controller connected to door interlock</desc>
          <rect x="30" y="50" width="60" height="50" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="60" y="80" textAnchor="middle" fontSize="8" fill="currentColor">Laser</text>
          <line x1="90" y1="75" x2="130" y2="75" stroke="currentColor" strokeWidth="2" />
          <circle cx="110" cy="75" r="5" fill="none" stroke="currentColor" />
          <rect x="140" y="40" width="40" height="70" fill="none" stroke="currentColor" strokeWidth="2" />
          <text x="160" y="125" textAnchor="middle" fontSize="8" fill="currentColor">Door</text>
          <text x="110" y="60" textAnchor="middle" fontSize="8" fill="currentColor">Interlock</text>
        </svg>
      );
    case 'keycontrol':
      return (
        <svg viewBox="0 0 200 150" className="w-full h-32" role="img" aria-label="Key control diagram">
          <title>Key Control Switch</title>
          <desc>Diagram showing a key-operated safety switch in the off position</desc>
          <circle cx="100" cy="75" r="25" fill="none" stroke="currentColor" strokeWidth="2" />
          <rect x="95" y="55" width="10" height="40" fill="currentColor" />
          <rect x="90" y="35" width="20" height="15" fill="#FFD700" stroke="currentColor" />
          <text x="70" y="75" textAnchor="end" fontSize="8" fill="currentColor">OFF</text>
          <text x="135" y="75" textAnchor="start" fontSize="8" fill="currentColor">ON</text>
          <text x="100" y="115" textAnchor="middle" fontSize="8" fill="currentColor">Key Control</text>
        </svg>
      );
    default:
      return null;
  }
}

function EngineeringControlsSection() {
  const [selectedControl, setSelectedControl] = useState(engineeringControls[0]);

  return (
    <div className="space-y-4" role="region" aria-label="Engineering controls">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2" role="tablist" aria-label="Select engineering control">
        {engineeringControls.map((control) => (
          <Button
            key={control.id}
            variant={selectedControl.id === control.id ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedControl(control)}
            role="tab"
            aria-selected={selectedControl.id === control.id}
            className="text-xs"
          >
            {control.name.split(' ')[0]}
          </Button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-base">{selectedControl.name}</CardTitle>
          <CardDescription>{selectedControl.description}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-muted rounded-lg p-4">
            <EngineeringVisual type={selectedControl.visualType} />
          </div>
          <div>
            <h4 className="text-sm font-semibold mb-2">Key Requirements:</h4>
            <ul className="space-y-1">
              {selectedControl.requirements.map((req, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {req}
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
// Section 3: Administrative Controls
// ============================================================================

interface SOPItem {
  element: string;
  description: string;
  required: boolean;
}

const sopElements: SOPItem[] = [
  { element: 'Purpose & Scope', description: 'What the SOP covers and why it exists', required: true },
  { element: 'Responsibilities', description: 'Who is responsible for each action', required: true },
  { element: 'Hazard Identification', description: 'Known hazards and risk levels', required: true },
  { element: 'Control Measures', description: 'Engineering, administrative, and PPE requirements', required: true },
  { element: 'Step-by-Step Procedures', description: 'Detailed operational instructions', required: true },
  { element: 'Emergency Procedures', description: 'What to do in case of incident', required: true },
  { element: 'Maintenance Schedule', description: 'Required inspections and testing', required: false },
  { element: 'Training Requirements', description: 'Who needs training and how often', required: true },
  { element: 'References', description: 'Applicable standards and regulations', required: true },
  { element: 'Revision History', description: 'Document control and updates', required: true },
];

const warningSigns = [
  { type: 'Class 2', text: 'Laser Radiation - Do Not Stare Into Beam', color: 'bg-amber-500', pattern: 'stripes' },
  { type: 'Class 3R/3B', text: 'Laser Radiation - Avoid Direct Eye Exposure', color: 'bg-orange-500', pattern: 'dots' },
  { type: 'Class 4', text: 'Laser Radiation - Avoid Eye Or Skin Exposure', color: 'bg-red-600', pattern: 'diagonal' },
  { type: 'Entry', text: 'Authorized Personnel Only - Laser In Operation', color: 'bg-red-700', pattern: 'solid' },
];

function SOPBuilder() {
  const [checkedElements, setCheckedElements] = useState<Set<string>>(new Set());

  const toggleElement = (element: string) => {
    const newSet = new Set(checkedElements);
    if (newSet.has(element)) {
      newSet.delete(element);
    } else {
      newSet.add(element);
    }
    setCheckedElements(newSet);
  };

  const requiredElements = sopElements.filter((e) => e.required);
  const progress = (Array.from(checkedElements).filter((e) => requiredElements.find((r) => r.element === e)).length / requiredElements.length) * 100;

  return (
    <div className="space-y-4" role="region" aria-label="SOP builder">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>SOP Completeness</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          aria-label="SOP completeness progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="grid gap-2">
        {sopElements.map((item) => (
          <div
            key={item.element}
            className={`flex items-start gap-3 p-3 rounded-lg border ${checkedElements.has(item.element) ? 'bg-primary/5 border-primary' : 'bg-card'}`}
          >
            <Checkbox
              checked={checkedElements.has(item.element)}
              onCheckedChange={() => toggleElement(item.element)}
              aria-label={item.element}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">{item.element}</span>
                {item.required && (
                  <Badge variant="destructive" className="text-xs">Required</Badge>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function WarningSignsDemo() {
  const [selectedSign, setSelectedSign] = useState(0);

  return (
    <div className="space-y-4" role="region" aria-label="Warning signs demonstration">
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Select warning sign type">
        {warningSigns.map((sign, index) => (
          <Button
            key={index}
            variant={selectedSign === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedSign(index)}
            role="tab"
            aria-selected={selectedSign === index}
          >
            {sign.type}
          </Button>
        ))}
      </div>
      <div 
        className={`${warningSigns[selectedSign].color} text-white p-6 rounded-lg text-center`}
        role="img" 
        aria-label={`Warning sign: ${warningSigns[selectedSign].text}`}
      >
        <div className="flex justify-center mb-4">
          <svg viewBox="0 0 100 100" className="w-16 h-16" aria-hidden="true">
            <title>Laser Warning Symbol</title>
            <circle cx="50" cy="50" r="45" fill="none" stroke="white" strokeWidth="4" />
            <line x1="50" y1="20" x2="50" y2="60" stroke="white" strokeWidth="6" />
            <circle cx="50" cy="75" r="6" fill="white" />
          </svg>
        </div>
        <div className="font-bold text-lg mb-2">WARNING</div>
        <div className="text-sm">{warningSigns[selectedSign].text}</div>
      </div>
      <div className="text-sm text-muted-foreground">
        Signs must be placed at all entry points to laser-controlled areas and at the laser equipment itself.
      </div>
    </div>
  );
}

function TrainingRequirements() {
  const requirements = [
    { role: 'Laser Users', training: 'Comprehensive laser safety training', frequency: 'Annual', practical: true },
    { role: 'Maintenance Staff', training: 'Equipment-specific procedures', frequency: 'Annual', practical: true },
    { role: 'Supervisors', training: 'Management responsibilities', frequency: 'Every 2 years', practical: false },
    { role: 'Visitors', training: 'Area-specific briefing', frequency: 'Each visit', practical: false },
  ];

  return (
    <div className="space-y-3" role="region" aria-label="Training requirements">
      {requirements.map((req, index) => (
        <Card key={index} className="p-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="font-medium text-sm">{req.role}</div>
              <div className="text-xs text-muted-foreground">{req.training}</div>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="text-xs">{req.frequency}</Badge>
              {req.practical && (
                <div className="text-xs text-green-600 mt-1">+ Practical</div>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ============================================================================
// Section 4: PPE - Eye Protection
// ============================================================================

interface ODRating {
  od: number;
  attenuation: string;
  use: string;
}

const odRatings: ODRating[] = [
  { od: 1, attenuation: '10× (90%)', use: 'Low power alignment' },
  { od: 2, attenuation: '100× (99%)', use: 'Standard alignment' },
  { od: 3, attenuation: '1,000× (99.9%)', use: 'Medium power work' },
  { od: 4, attenuation: '10,000× (99.99%)', use: 'High power Class 4' },
  { od: 5, attenuation: '100,000× (99.999%)', use: 'Very high power' },
  { od: 6, attenuation: '1,000,000× (99.9999%)', use: 'Maximum protection' },
  { od: 7, attenuation: '10,000,000× (99.99999%)', use: 'Ultrahigh power' },
];

const ppeRequirements = [
  { class: 'Class 1', eyeProtection: 'Not required', skinProtection: 'Not required', notes: 'Enclosed, safe under normal use' },
  { class: 'Class 2', eyeProtection: 'Not normally required', skinProtection: 'Not required', notes: 'Aversion response protects' },
  { class: 'Class 3R', eyeProtection: 'May be required', skinProtection: 'Not required', notes: 'Assess specific exposure' },
  { class: 'Class 3B', eyeProtection: 'Required for direct viewing', skinProtection: 'Not required', notes: 'Specular reflection hazard' },
  { class: 'Class 4', eyeProtection: 'Always required', skinProtection: 'Required for high powers', notes: 'Diffuse reflection hazard' },
];

function ODSelector() {
  const [selectedOD, setSelectedOD] = useState(4);

  return (
    <div className="space-y-4" role="region" aria-label="Optical Density selector">
      <div className="text-sm text-muted-foreground">
        Optical Density (OD) indicates how much the filter attenuates the laser beam. Higher OD = more protection.
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-2" role="radiogroup" aria-label="Select OD rating">
        {odRatings.map((rating) => (
          <Button
            key={rating.od}
            variant={selectedOD === rating.od ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedOD(rating.od)}
            className="text-xs h-auto py-2"
            role="radio"
            aria-checked={selectedOD === rating.od}
            aria-label={`OD ${rating.od}: ${rating.use}`}
          >
            <div className="text-center">
              <div className="font-bold">OD {rating.od}</div>
            </div>
          </Button>
        ))}
      </div>
      <Card className="bg-primary/5 border-primary">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl font-bold">OD {selectedOD}</span>
            <Badge>Selected</Badge>
          </div>
          <div className="space-y-1 text-sm">
            <div><strong>Attenuation:</strong> {odRatings.find((r) => r.od === selectedOD)?.attenuation}</div>
            <div><strong>Typical Use:</strong> {odRatings.find((r) => r.od === selectedOD)?.use}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function PPEMatrix() {
  const [selectedClass, setSelectedClass] = useState(4);

  return (
    <div className="space-y-4" role="region" aria-label="PPE requirements by laser class">
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Select laser class">
        {ppeRequirements.map((req, index) => (
          <Button
            key={index}
            variant={selectedClass === index ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedClass(index)}
            role="tab"
            aria-selected={selectedClass === index}
          >
            {req.class}
          </Button>
        ))}
      </div>
      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2">
            <Eye className="w-5 h-5 text-primary" aria-hidden="true" />
            <div>
              <div className="text-sm font-medium">Eye Protection</div>
              <div className={`text-sm ${ppeRequirements[selectedClass].eyeProtection === 'Always required' ? 'text-red-500 font-semibold' : 'text-muted-foreground'}`}>
                {ppeRequirements[selectedClass].eyeProtection}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
            <div>
              <div className="text-sm font-medium">Skin Protection</div>
              <div className="text-sm text-muted-foreground">{ppeRequirements[selectedClass].skinProtection}</div>
            </div>
          </div>
          <div className="pt-2 border-t">
            <div className="text-xs text-muted-foreground">{ppeRequirements[selectedClass].notes}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EyewearInspection() {
  const [inspectionItems, setInspectionItems] = useState([
    { item: 'No cracks or scratches on lens', checked: false },
    { item: 'Frame integrity intact', checked: false },
    { item: 'Side shields present', checked: false },
    { item: 'Proper fit on face', checked: false },
    { item: 'Correct wavelength/OD rating', checked: false },
    { item: 'Within service date', checked: false },
  ]);

  const toggleItem = (index: number) => {
    const newItems = [...inspectionItems];
    newItems[index].checked = !newItems[index].checked;
    setInspectionItems(newItems);
  };

  const allChecked = inspectionItems.every((item) => item.checked);

  return (
    <div className="space-y-3" role="region" aria-label="Eyewear inspection checklist">
      <div className="text-sm text-muted-foreground">
        Inspect eyewear before each use:
      </div>
      {inspectionItems.map((item, index) => (
        <div
          key={index}
          className="flex items-center gap-3 p-2 rounded-lg border cursor-pointer hover:bg-muted/50"
          onClick={() => toggleItem(index)}
          role="checkbox"
          aria-checked={item.checked}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleItem(index);
            }
          }}
        >
          <Checkbox checked={item.checked} aria-hidden="true" />
          <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
            {item.item}
          </span>
        </div>
      ))}
      {allChecked && (
        <div 
          className="flex items-center gap-2 text-green-600 dark:text-green-400 text-sm font-medium p-2 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800"
          role="alert"
          aria-live="polite"
        >
          <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
          Eyewear approved for use
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Section 4b: Types of Laser Safety Goggles
// ============================================================================

interface GogglesType {
  id: string;
  name: string;
  style: string;
  description: string;
  useCase: string;
  keySpecs: string[];
  wavelengthRange: string;
  odRange: string;
  example: string;
  limitations: string;
  color: string;
}

const gogglesTypes: GogglesType[] = [
  {
    id: 'performer',
    name: 'Performer / Entertainment',
    style: 'Lightweight spectacle',
    description:
      'Designed for performers and audience members interacting with laser beams during live shows. Prioritizes visibility and comfort over maximum protection.',
    useCase: 'Laser light shows, concerts, live entertainment with RGB laser systems',
    keySpecs: [
      'OD 3+ for 180–532 nm (blue & green)',
      'OD 2–3 for 631–661 nm (red)',
      '~20% VLT — allows yellow-range light through for stage visibility',
      'Lightweight for extended wear',
    ],
    wavelengthRange: '180–661 nm (RGB)',
    odRange: 'OD 2–3',
    example: 'Pangolin Performer ($160) — blocks common RGB diode wavelengths used in full-diode show systems',
    limitations: 'Does NOT protect against yellow (577 nm), amber (590 nm), or orange (607 nm). Not suitable for RGBY/RGBO systems.',
    color: 'bg-purple-500',
  },
  {
    id: 'lab',
    name: 'Lab / Research',
    style: 'Wraparound with side shields',
    description:
      'Full-coverage goggles for laboratory environments. High OD ratings tuned to specific laser wavelengths used in research and scientific applications.',
    useCase: 'Research labs, university settings, scientific instrumentation, alignment work',
    keySpecs: [
      'OD 4–7 depending on wavelength',
      'Wavelength-specific filter glass or polycarbonate',
      'Side shields required',
      'Splash and chemical resistant options available',
    ],
    wavelengthRange: 'Wavelength-specific (UV to IR)',
    odRange: 'OD 4–7',
    example: 'Thorlabs LG1 series, Kentek laser goggles — matched to Nd:YAG, Argon, HeNe, or diode wavelengths',
    limitations: 'Must be precisely matched to laser wavelength. Significantly reduced VLT at high OD ratings.',
    color: 'bg-blue-500',
  },
  {
    id: 'medical',
    name: 'Medical / Clinical',
    style: 'Wraparound with foam gasket',
    description:
      'Certified eyewear for clinical laser procedures. Required for both the operator and the patient. Covers common surgical laser wavelengths.',
    useCase: 'Dermatology, ophthalmology, dental, and surgical laser procedures',
    keySpecs: [
      'Certified per ANSI Z136.1 and EN 207',
      'Common wavelengths: 532 nm (KTP), 1064 nm (Nd:YAG), 10,600 nm (CO₂)',
      'Foam seal for gas/splash protection',
      'Wide field of view for clinical use',
    ],
    wavelengthRange: '532 nm, 810 nm, 1064 nm, 10,600 nm',
    odRange: 'OD 4–6',
    example: 'Laservision FG series, Uvex medical laser goggles — procedure-room certified',
    limitations: 'Procedure-specific. Must be replaced per manufacturer schedule. CO₂ eyewear cannot be used for visible wavelengths.',
    color: 'bg-green-500',
  },
  {
    id: 'alignment',
    name: 'Alignment',
    style: 'Spectacle or low-density wraparound',
    description:
      'Low-OD eyewear that provides minimal protection while allowing the operator to see the beam for alignment purposes.',
    useCase: 'Beam alignment in Class 1–2 systems, optical setup, low-power diagnostics',
    keySpecs: [
      'OD 1–2 only',
      'High VLT to preserve beam visibility',
      'Not suitable for direct beam exposure',
      'Often filter-specific (e.g., green-only reduction)',
    ],
    wavelengthRange: 'Wavelength-dependent',
    odRange: 'OD 1–2',
    example: 'Laser alignment glasses with neutral density filters — used during optical bench setup',
    limitations: 'Provides minimal protection. Never use for Class 3B or Class 4 direct viewing. Engineering controls must be in place.',
    color: 'bg-amber-500',
  },
  {
    id: 'fitover',
    name: 'Fitover',
    style: 'Over-the-glasses goggle',
    description:
      'Designed to be worn over prescription eyeglasses. Provides full side and top coverage while accommodating standard frames underneath.',
    useCase: 'Personnel who require prescription eyewear in Class 3B/4 laser environments',
    keySpecs: [
      'Larger frame accommodates prescription glasses',
      'Side and top shield coverage',
      'Available in OD 3–6',
      'Secure strap or temple fit',
    ],
    wavelengthRange: 'Wavelength-specific',
    odRange: 'OD 3–6',
    example: 'Kentek fitover series, Laservision fitover goggles — standard in multi-user lab environments',
    limitations: 'Bulkier and heavier than standard eyewear. May reduce field of view. Prescription lenses beneath do not add protection.',
    color: 'bg-orange-500',
  },
  {
    id: 'broadband',
    name: 'Broadband / Multiline',
    style: 'Full-coverage goggle',
    description:
      'Provides protection across a wide wavelength range, suitable for environments where multiple laser wavelengths or unknown wavelengths may be present.',
    useCase: 'Multi-laser labs, service technicians, environments with mixed or unknown laser sources',
    keySpecs: [
      'Covers 400–700 nm or wider (UV to near-IR)',
      'OD 3–5 across range',
      'Low VLT (heavily tinted)',
      'Suitable when wavelength is uncertain',
    ],
    wavelengthRange: '400–1100 nm (broadband)',
    odRange: 'OD 3–5',
    example: 'Laser safety goggles with broadband absorptive glass — used by field service engineers',
    limitations: 'Very low VLT makes environment dark. Not a substitute for wavelength-specific goggles when wavelength is known.',
    color: 'bg-slate-500',
  },
];

function GogglesTypesGuide() {
  const [selected, setSelected] = useState<string>('performer');
  const active = gogglesTypes.find((g) => g.id === selected)!;

  return (
    <div className="space-y-4" role="region" aria-label="Types of laser safety goggles">
      <div className="text-sm text-muted-foreground">
        Laser safety eyewear comes in several distinct categories. Choosing the right type depends on your
        application, laser class, and wavelength.
      </div>

      {/* Type selector */}
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Goggle type selector">
        {gogglesTypes.map((g) => (
          <button
            key={g.id}
            onClick={() => setSelected(g.id)}
            role="tab"
            aria-selected={selected === g.id}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              selected === g.id
                ? 'bg-primary text-primary-foreground border-primary'
                : 'bg-background text-muted-foreground border-border hover:border-primary hover:text-primary'
            }`}
          >
            {g.name}
          </button>
        ))}
      </div>

      {/* Detail card */}
      <Card className="border-2">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div>
              <CardTitle className="text-base flex items-center gap-2">
                <span className={`inline-block w-3 h-3 rounded-full ${active.color}`} aria-hidden="true" />
                {active.name}
              </CardTitle>
              <CardDescription className="mt-1">{active.style}</CardDescription>
            </div>
            <div className="text-right shrink-0">
              <div className="text-xs text-muted-foreground">OD Range</div>
              <div className="text-sm font-bold">{active.odRange}</div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">{active.description}</p>

          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Use Case</div>
              <p className="text-sm">{active.useCase}</p>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Wavelength Range</div>
              <p className="text-sm font-mono">{active.wavelengthRange}</p>
            </div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Key Specifications</div>
            <ul className="space-y-1">
              {active.keySpecs.map((spec, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-3.5 h-3.5 text-green-500 mt-0.5 shrink-0" aria-hidden="true" />
                  {spec}
                </li>
              ))}
            </ul>
          </div>

          <div className="p-3 bg-muted/50 rounded-lg">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">Real-World Example</div>
            <p className="text-sm">{active.example}</p>
          </div>

          <div className="flex items-start gap-2 p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-lg">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div>
              <div className="text-xs font-semibold text-amber-700 dark:text-amber-300 mb-0.5">Limitations</div>
              <p className="text-sm text-amber-800 dark:text-amber-200">{active.limitations}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="text-xs text-muted-foreground border-t pt-3">
        All laser safety eyewear must be marked with the wavelength range and OD rating per ANSI Z136.1 / EN 207. Always verify markings before use.
      </div>
    </div>
  );
}

// ============================================================================
// Section 5: Control Implementation
// ============================================================================

const implementationSteps = [
  {
    step: 1,
    title: 'Hazard Assessment',
    description: 'Identify laser class, wavelength, power, and exposure scenarios',
    actions: ['Classify the laser system', 'Determine MPE and NOHD', 'Identify potential exposure points'],
    timeframe: 'Week 1',
  },
  {
    step: 2,
    title: 'Control Selection',
    description: 'Choose appropriate controls following the hierarchy',
    actions: ['Prioritize elimination/substitution', 'Design engineering controls', 'Develop administrative controls'],
    timeframe: 'Week 2-3',
  },
  {
    step: 3,
    title: 'Engineering Implementation',
    description: 'Install physical control systems',
    actions: ['Install enclosures and interlocks', 'Set up beam containment', 'Install warning systems'],
    timeframe: 'Week 4-6',
  },
  {
    step: 4,
    title: 'Documentation',
    description: 'Create SOPs and safety documentation',
    actions: ['Write SOPs', 'Create warning signs', 'Develop training materials'],
    timeframe: 'Week 5-7',
  },
  {
    step: 5,
    title: 'Training',
    description: 'Train all personnel on hazards and procedures',
    actions: ['Conduct initial training', 'Document completion', 'Assess competency'],
    timeframe: 'Week 7',
  },
  {
    step: 6,
    title: 'Verification',
    description: 'Test all controls before first use',
    actions: ['Test interlocks', 'Verify signage placement', 'Audit PPE availability'],
    timeframe: 'Week 8',
  },
];

const costBenefitData = [
  { control: 'Interlocked Enclosure', cost: 'High', effectiveness: 'Very High', maintenance: 'Low', payback: 'Immediate' },
  { control: 'Beam Stops', cost: 'Low', effectiveness: 'High', maintenance: 'Low', payback: 'Immediate' },
  { control: 'Remote Interlocks', cost: 'Medium', effectiveness: 'High', maintenance: 'Low', payback: '1 year' },
  { control: 'Training Program', cost: 'Medium', effectiveness: 'Medium', maintenance: 'Ongoing', payback: '6 months' },
  { control: 'Safety Eyewear', cost: 'Low', effectiveness: 'Medium', maintenance: 'Replacement', payback: 'Immediate' },
  { control: 'SOP Development', cost: 'Low', effectiveness: 'Medium', maintenance: 'Annual review', payback: '3 months' },
];

function ImplementationGuide() {
  const [currentStep, setCurrentStep] = useState(0);

  return (
    <div className="space-y-4" role="region" aria-label="Implementation guide">
      <div className="flex gap-1 overflow-x-auto pb-2" role="tablist" aria-label="Implementation steps">
        {implementationSteps.map((step, index) => (
          <button
            key={index}
            onClick={() => setCurrentStep(index)}
            className={`flex-shrink-0 w-8 h-8 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary ${
              currentStep === index
                ? 'bg-primary text-primary-foreground'
                : currentStep > index
                ? 'bg-green-500 text-white'
                : 'bg-muted text-muted-foreground'
            }`}
            role="tab"
            aria-selected={currentStep === index}
            aria-label={`Step ${step.step}: ${step.title}`}
          >
            {step.step}
          </button>
        ))}
      </div>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">{implementationSteps[currentStep].title}</CardTitle>
            <Badge variant="outline">{implementationSteps[currentStep].timeframe}</Badge>
          </div>
          <CardDescription>{implementationSteps[currentStep].description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="text-sm font-medium">Key Actions:</div>
            <ul className="space-y-1">
              {implementationSteps[currentStep].actions.map((action, index) => (
                <li key={index} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" aria-hidden="true" />
                  {action}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
          disabled={currentStep === 0}
          aria-label="Previous step"
        >
          Previous
        </Button>
        <Button
          size="sm"
          onClick={() => setCurrentStep(Math.min(implementationSteps.length - 1, currentStep + 1))}
          disabled={currentStep === implementationSteps.length - 1}
          aria-label="Next step"
        >
          Next Step
        </Button>
      </div>
    </div>
  );
}

function ImplementationChecklist() {
  const [items, setItems] = useState([
    { category: 'Engineering', item: 'Enclosures installed and functional', checked: false },
    { category: 'Engineering', item: 'Interlocks tested and documented', checked: false },
    { category: 'Engineering', item: 'Beam stops positioned correctly', checked: false },
    { category: 'Engineering', item: 'Remote interlock connectors installed', checked: false },
    { category: 'Engineering', item: 'Key control system implemented', checked: false },
    { category: 'Administrative', item: 'SOPs written and approved', checked: false },
    { category: 'Administrative', item: 'Warning signs posted', checked: false },
    { category: 'Administrative', item: 'Laser-controlled area established', checked: false },
    { category: 'Administrative', item: 'Training program developed', checked: false },
    { category: 'Administrative', item: 'Personnel authorization list created', checked: false },
    { category: 'PPE', item: 'Eyewear selected for all wavelengths', checked: false },
    { category: 'PPE', item: 'Eyewear available in multiple sizes', checked: false },
    { category: 'PPE', item: 'Spare eyewear purchased', checked: false },
    { category: 'PPE', item: 'Eyewear inspection procedure posted', checked: false },
  ]);

  const toggleItem = (index: number) => {
    const newItems = [...items];
    newItems[index].checked = !newItems[index].checked;
    setItems(newItems);
  };

  const progress = (items.filter((i) => i.checked).length / items.length) * 100;
  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="space-y-4" role="region" aria-label="Implementation checklist">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span>Implementation Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress 
          value={progress} 
          aria-label="Implementation progress"
          aria-valuenow={Math.round(progress)}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <div className="space-y-4 max-h-80 overflow-y-auto">
        {categories.map((category) => (
          <div key={category}>
            <h4 className="text-sm font-semibold mb-2 flex items-center gap-2">
              {category === 'Engineering' && <Settings className="w-4 h-4" aria-hidden="true" />}
              {category === 'Administrative' && <FileText className="w-4 h-4" aria-hidden="true" />}
              {category === 'PPE' && <HardHat className="w-4 h-4" aria-hidden="true" />}
              {category}
            </h4>
            <div className="space-y-1">
              {items
                .filter((i) => i.category === category)
                .map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 p-2 rounded hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleItem(items.indexOf(item))}
                    role="checkbox"
                    aria-checked={item.checked}
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        toggleItem(items.indexOf(item));
                      }
                    }}
                  >
                    <Checkbox checked={item.checked} aria-hidden="true" />
                    <span className={`text-sm ${item.checked ? 'line-through text-muted-foreground' : ''}`}>
                      {item.item}
                    </span>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
      {progress === 100 && (
        <div 
          className="flex items-center gap-2 text-green-600 text-sm font-medium p-3 bg-green-50 dark:bg-green-950/30 rounded-lg"
          role="alert"
          aria-live="polite"
        >
          <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
          All controls implemented! Ready for verification.
        </div>
      )}
    </div>
  );
}

function CostBenefitAnalysis() {
  const [sortBy, setSortBy] = useState<'cost' | 'effectiveness'>('effectiveness');

  const sortedData = [...costBenefitData].sort((a, b) => {
    const costOrder = { Low: 1, Medium: 2, High: 3 };
    const effectivenessOrder = { Medium: 1, High: 2, 'Very High': 3 };
    if (sortBy === 'cost') {
      return costOrder[a.cost as keyof typeof costOrder] - costOrder[b.cost as keyof typeof costOrder];
    }
    return effectivenessOrder[b.effectiveness as keyof typeof effectivenessOrder] - effectivenessOrder[a.effectiveness as keyof typeof effectivenessOrder];
  });

  return (
    <div className="space-y-4" role="region" aria-label="Cost-benefit analysis">
      <div className="flex gap-2">
        <Button
          variant={sortBy === 'effectiveness' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('effectiveness')}
          aria-pressed={sortBy === 'effectiveness'}
        >
          By Effectiveness
        </Button>
        <Button
          variant={sortBy === 'cost' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSortBy('cost')}
          aria-pressed={sortBy === 'cost'}
        >
          By Cost
        </Button>
      </div>
      <div className="space-y-2">
        {sortedData.map((item, index) => (
          <Card key={index} className="p-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-sm">{item.control}</span>
              <div className="flex gap-2">
                <Badge
                  variant={item.cost === 'Low' ? 'default' : item.cost === 'Medium' ? 'secondary' : 'destructive'}
                  className="text-xs"
                >
                  {item.cost} Cost
                </Badge>
                <Badge
                  variant={item.effectiveness === 'Very High' ? 'default' : 'outline'}
                  className="text-xs"
                >
                  {item.effectiveness}
                </Badge>
              </div>
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Maintenance: {item.maintenance} • Payback: {item.payback}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// Section 6: Maintenance & Verification
// ============================================================================

const testingSchedule = [
  { item: 'Interlock function test', frequency: 'Daily (before use)', responsible: 'User' },
  { item: 'Warning light operation', frequency: 'Daily (before use)', responsible: 'User' },
  { item: 'Eyewear inspection', frequency: 'Before each use', responsible: 'User' },
  { item: 'Key control audit', frequency: 'Weekly', responsible: 'Supervisor' },
  { item: 'Beam alignment check', frequency: 'Monthly', responsible: 'LSO' },
  { item: 'Interlock timing test', frequency: 'Quarterly', responsible: 'LSO' },
  { item: 'Emergency stop test', frequency: 'Quarterly', responsible: 'LSO' },
  { item: 'Enclosure integrity', frequency: 'Annually', responsible: 'LSO' },
  { item: 'Complete system audit', frequency: 'Annually', responsible: 'LSO' },
];

const documentationRequirements = [
  { document: 'Laser inventory', required: true, retention: 'Duration of use + 3 years' },
  { document: 'Hazard evaluation', required: true, retention: 'Duration of use + 3 years' },
  { document: 'SOPs', required: true, retention: 'Current version + 3 previous' },
  { document: 'Training records', required: true, retention: 'Duration of employment + 3 years' },
  { document: 'Incident reports', required: true, retention: 'Permanent' },
  { document: 'Inspection logs', required: true, retention: '3 years' },
  { document: 'Maintenance records', required: true, retention: 'Life of equipment + 3 years' },
  { document: 'Medical surveillance', required: 'If indicated', retention: 'Duration + 30 years' },
];

function MaintenanceSchedule() {
  const [filter, setFilter] = useState<'all' | 'user' | 'supervisor' | 'lso'>('all');

  const filteredSchedule = testingSchedule.filter(
    (item) => filter === 'all' || item.responsible.toLowerCase() === filter
  );

  return (
    <div className="space-y-4" role="region" aria-label="Maintenance schedule">
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Filter by responsible party">
        {['all', 'user', 'supervisor', 'lso'].map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f as typeof filter)}
            role="tab"
            aria-selected={filter === f}
          >
            {f === 'all' ? 'All' : f === 'lso' ? 'LSO' : f.charAt(0).toUpperCase() + f.slice(1)}
          </Button>
        ))}
      </div>
      <div className="space-y-2 max-h-80 overflow-y-auto">
        {filteredSchedule.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
            <div>
              <div className="font-medium text-sm">{item.item}</div>
              <div className="text-xs text-muted-foreground">{item.frequency}</div>
            </div>
            <Badge variant="outline" className="text-xs">
              {item.responsible}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}

function DocumentationTracker() {
  const [docs, setDocs] = useState(documentationRequirements.map((d) => ({ ...d, complete: false })));

  const toggleDoc = (index: number) => {
    const newDocs = [...docs];
    newDocs[index].complete = !newDocs[index].complete;
    setDocs(newDocs);
  };

  return (
    <div className="space-y-3 max-h-80 overflow-y-auto" role="region" aria-label="Documentation tracker">
      {docs.map((doc, index) => (
        <div
          key={index}
          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 ${
            doc.complete ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800' : 'bg-card'
          }`}
          onClick={() => toggleDoc(index)}
          role="checkbox"
          aria-checked={doc.complete}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggleDoc(index);
            }
          }}
        >
          <Checkbox checked={doc.complete} aria-hidden="true" />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{doc.document}</span>
              {doc.required === true && (
                <Badge variant="destructive" className="text-xs">Required</Badge>
              )}
              {doc.required === 'If indicated' && (
                <Badge variant="secondary" className="text-xs">Conditional</Badge>
              )}
            </div>
            <div className="text-xs text-muted-foreground">
              Retention: {doc.retention}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ============================================================================
// Main Component
// ============================================================================

type Section = 'hierarchy' | 'engineering' | 'administrative' | 'ppe' | 'implementation' | 'maintenance';

export default function Module5_Controls() {
  const [activeSection, setActiveSection] = useState<Section>('hierarchy');
  const mainContentRef = useRef<HTMLDivElement>(null);

  const sections: { id: Section; name: string; icon: React.ReactNode }[] = [
    { id: 'hierarchy', name: 'Hierarchy', icon: <Shield className="w-4 h-4" /> },
    { id: 'engineering', name: 'Engineering', icon: <Settings className="w-4 h-4" /> },
    { id: 'administrative', name: 'Administrative', icon: <FileText className="w-4 h-4" /> },
    { id: 'ppe', name: 'PPE', icon: <HardHat className="w-4 h-4" /> },
    { id: 'implementation', name: 'Implementation', icon: <ClipboardCheck className="w-4 h-4" /> },
    { id: 'maintenance', name: 'Maintenance', icon: <Wrench className="w-4 h-4" /> },
  ];

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = sections.findIndex(s => s.id === activeSection);
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setActiveSection(sections[currentIndex - 1].id);
      } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
        setActiveSection(sections[currentIndex + 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, sections]);

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      {/* Module Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Module 5: Laser Safety Controls</h1>
        <p className="text-muted-foreground">Hierarchy of controls, engineering, administrative, PPE, and implementation</p>
      </header>

      {/* Section Navigation */}
      <nav aria-label="Module sections">
        <div className="flex flex-wrap gap-2">
          {sections.map((section) => (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveSection(section.id)}
              className="gap-1.5"
              aria-current={activeSection === section.id ? 'page' : undefined}
            >
              {section.icon}
              {section.name}
            </Button>
          ))}
        </div>
      </nav>

      {/* Section Content */}
      <main id="main-content" ref={mainContentRef} tabIndex={-1}>
        <div className="space-y-4">
          {activeSection === 'hierarchy' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-primary" aria-hidden="true" />
                    The Hierarchy of Controls
                  </CardTitle>
                  <CardDescription>
                    Controls are arranged from most effective (elimination) to least effective (PPE).
                    Always prioritize higher-level controls when possible.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HierarchyPyramid />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    Why Hierarchy Matters: Real Incidents
                  </CardTitle>
                  <CardDescription>
                    Learn from actual laser safety incidents that could have been prevented with proper controls.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <IncidentExamples />
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'engineering' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-500" aria-hidden="true" />
                    Engineering Controls
                  </CardTitle>
                  <CardDescription>
                    Physical systems that isolate people from laser hazards without relying on user behavior.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <EngineeringControlsSection />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Engineering Control Principles</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-sm">Fail-Safe Design</div>
                      <div className="text-sm text-muted-foreground">
                        Systems should default to safe state during power loss or malfunction
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Monitor className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-sm">Active Monitoring</div>
                      <div className="text-sm text-muted-foreground">
                        Continuous status indication (visual and audible when appropriate)
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <div className="font-medium text-sm">Tamper Resistance</div>
                      <div className="text-sm text-muted-foreground">
                        Controls require tools or special knowledge to bypass
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {activeSection === 'administrative' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5 text-amber-500" aria-hidden="true" />
                    Standard Operating Procedures (SOPs)
                  </CardTitle>
                  <CardDescription>
                    Well-written SOPs are essential for safe laser operation. Use the checklist to ensure completeness.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <SOPBuilder />
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <Users className="w-4 h-4" aria-hidden="true" />
                      Training Requirements
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <TrainingRequirements />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4" aria-hidden="true" />
                      Warning Signs
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <WarningSignsDemo />
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeSection === 'ppe' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <HardHat className="w-5 h-5 text-red-500" aria-hidden="true" />
                    When is Eye Protection Required?
                  </CardTitle>
                  <CardDescription>
                    PPE is the last line of defense. Requirements vary by laser class and operation.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PPEMatrix />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-500" aria-hidden="true" />
                    Types of Laser Safety Goggles
                  </CardTitle>
                  <CardDescription>
                    Six categories of protective eyewear — each suited to a different laser environment.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GogglesTypesGuide />
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">OD Ratings Explained</CardTitle>
                    <CardDescription>Select appropriate protection level</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ODSelector />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Eyewear Inspection</CardTitle>
                    <CardDescription>Pre-use checklist</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <EyewearInspection />
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeSection === 'implementation' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <ClipboardCheck className="w-5 h-5 text-green-500" aria-hidden="true" />
                    Step-by-Step Implementation Guide
                  </CardTitle>
                  <CardDescription>
                    Follow this process to implement laser safety controls in your facility.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ImplementationGuide />
                </CardContent>
              </Card>
              <div className="grid md:grid-cols-2 gap-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Implementation Checklist</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ImplementationChecklist />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Cost-Benefit Analysis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CostBenefitAnalysis />
                  </CardContent>
                </Card>
              </div>
            </>
          )}

          {activeSection === 'maintenance' && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="w-5 h-5 text-purple-500" aria-hidden="true" />
                    Control System Testing Schedule
                  </CardTitle>
                  <CardDescription>
                    Regular testing ensures controls remain functional. Responsibilities are divided between users, supervisors, and the LSO.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MaintenanceSchedule />
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="w-5 h-5" aria-hidden="true" />
                    Documentation Requirements
                  </CardTitle>
                  <CardDescription>
                    Track required documentation for compliance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentationTracker />
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </main>

      {/* Keyboard shortcuts help */}
      <div className="text-xs text-muted-foreground text-center">
        Keyboard shortcuts: Arrow keys navigate sections
      </div>
    </div>
  );
}
