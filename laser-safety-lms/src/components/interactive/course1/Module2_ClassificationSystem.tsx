'use client';

import { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, XCircle, Info } from 'lucide-react';

// ============================================================================
// DATA DEFINITIONS
// ============================================================================

interface LaserClass {
  id: string;
  name: string;
  description: string;
  powerLimit: string;
  wavelengthRange: string;
  eyeHazard: 'None' | 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Severe';
  skinHazard: 'None' | 'Minimal' | 'Low' | 'Moderate' | 'High' | 'Severe';
  aversionResponse: boolean;
  controls: string[];
  color: string;
  bgColor: string;
  borderColor: string;
  examples: string[];
  icon: string;
}

const LASER_CLASSES: LaserClass[] = [
  {
    id: 'class1',
    name: 'Class 1',
    description: 'Safe under all conditions of normal use. Eye protection is inherent in the design.',
    powerLimit: '< 0.39 µW',
    wavelengthRange: 'All',
    eyeHazard: 'None',
    skinHazard: 'None',
    aversionResponse: false,
    controls: ['Protective housing', 'Safety interlocks'],
    color: 'text-emerald-700',
    bgColor: 'bg-emerald-50',
    borderColor: 'border-emerald-200',
    examples: ['CD/DVD players', 'Laser printers', 'Barcode scanners', 'Surveying equipment'],
    icon: '✓',
  },
  {
    id: 'class1m',
    name: 'Class 1M',
    description: 'Safe for viewing directly, hazardous if viewed with optical instruments.',
    powerLimit: '< Class 3R AEL',
    wavelengthRange: 'All',
    eyeHazard: 'Minimal',
    skinHazard: 'None',
    aversionResponse: false,
    controls: ['Warning labels', 'No optical instruments'],
    color: 'text-teal-700',
    bgColor: 'bg-teal-50',
    borderColor: 'border-teal-200',
    examples: ['Fiber optic communication', 'Some surveying lasers', 'Optical instruments'],
    icon: '🔍',
  },
  {
    id: 'class2',
    name: 'Class 2',
    description: 'Visible lasers (400-700nm). Eye protection normally afforded by aversion response.',
    powerLimit: '< 1 mW',
    wavelengthRange: '400-700 nm',
    eyeHazard: 'Minimal',
    skinHazard: 'None',
    aversionResponse: true,
    controls: ['Warning labels', 'Do not stare into beam'],
    color: 'text-amber-700',
    bgColor: 'bg-amber-50',
    borderColor: 'border-amber-200',
    examples: ['Laser pointers', 'Presentation pointers', 'Alignment lasers', 'Some barcode scanners'],
    icon: '👁',
  },
  {
    id: 'class2m',
    name: 'Class 2M',
    description: 'Visible lasers safe by aversion response, hazardous if magnified.',
    powerLimit: '< 1 mW (with optics risk)',
    wavelengthRange: '400-700 nm',
    eyeHazard: 'Low',
    skinHazard: 'Minimal',
    aversionResponse: true,
    controls: ['Warning labels', 'No magnifying optics'],
    color: 'text-orange-700',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    examples: ['Expanded beam optical systems', 'Some alignment lasers with optics'],
    icon: '🔍',
  },
  {
    id: 'class3r',
    name: 'Class 3R',
    description: 'Low risk, normally safe if handled carefully. Slightly exceeds Class 2 AEL.',
    powerLimit: '< 5 mW (visible)',
    wavelengthRange: 'All',
    eyeHazard: 'Low',
    skinHazard: 'Minimal',
    aversionResponse: true,
    controls: ['Warning labels', 'Avoid eye exposure', 'Key control optional'],
    color: 'text-orange-800',
    bgColor: 'bg-orange-100',
    borderColor: 'border-orange-300',
    examples: ['Higher power pointers', 'Alignment lasers', 'Some measurement devices'],
    icon: '⚠',
  },
  {
    id: 'class3b',
    name: 'Class 3B',
    description: 'Direct viewing hazard. Diffuse reflection normally safe.',
    powerLimit: '< 500 mW',
    wavelengthRange: 'All',
    eyeHazard: 'Moderate',
    skinHazard: 'Low',
    aversionResponse: false,
    controls: ['Key control', 'Remote interlock', 'Warning signs', 'Protective eyewear'],
    color: 'text-red-700',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    examples: ['Research lasers', 'Medical lasers', 'Industrial alignment', 'Spectroscopy lasers'],
    icon: '⚡',
  },
  {
    id: 'class4',
    name: 'Class 4',
    description: 'High power. Eye and skin hazard. Diffuse reflection hazard. Fire hazard.',
    powerLimit: '> 500 mW',
    wavelengthRange: 'All',
    eyeHazard: 'Severe',
    skinHazard: 'High',
    aversionResponse: false,
    controls: ['All Class 3B controls', 'Controlled area', 'SOP required', 'Training mandatory'],
    color: 'text-red-800',
    bgColor: 'bg-red-100',
    borderColor: 'border-red-300',
    examples: ['Surgical lasers', 'Industrial cutting/welding', 'Research lasers', 'Military systems'],
    icon: '☠',
  },
];

const HAZARD_COLORS: Record<string, string> = {
  'None': 'bg-muted text-muted-foreground border border-border',
  'Minimal': 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200 border border-blue-300 dark:border-blue-800',
  'Low': 'bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-200 border border-yellow-300 dark:border-yellow-800',
  'Moderate': 'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200 border border-orange-300 dark:border-orange-800',
  'High': 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200 border border-red-300 dark:border-red-800',
  'Severe': 'bg-destructive text-destructive-foreground border border-destructive',
};

const HAZARD_PATTERNS: Record<string, string> = {
  'None': '',
  'Minimal': '▪',
  'Low': '▪▪',
  'Moderate': '▪▪▪',
  'High': '▪▪▪▪',
  'Severe': '▪▪▪▪▪',
};

// Real-world devices for sorting game
const DEVICES_FOR_SORTING = [
  { id: 1, name: 'DVD Player', class: 'class1', icon: '💿' },
  { id: 2, name: 'Laser Pointer', class: 'class2', icon: '🔦' },
  { id: 3, name: 'Research Laser', class: 'class3b', icon: '🔬' },
  { id: 4, name: 'Industrial Cutter', class: 'class4', icon: '⚡' },
  { id: 5, name: 'Barcode Scanner', class: 'class1', icon: '📊' },
  { id: 6, name: 'Fiber Optic Source', class: 'class1m', icon: '🔌' },
  { id: 7, name: 'Medical Therapy Laser', class: 'class3b', icon: '🏥' },
  { id: 8, name: 'High-Power Pointer', class: 'class3r', icon: '🔆' },
];

// Control measures data
const CONTROL_MEASURES = [
  { id: 'enclosure', name: 'Protective Housing', category: 'Engineering', classes: ['class1', 'class1m', 'class2', 'class2m', 'class3r', 'class3b', 'class4'] },
  { id: 'interlock', name: 'Safety Interlocks', category: 'Engineering', classes: ['class1', 'class1m', 'class3b', 'class4'] },
  { id: 'key_control', name: 'Key Control', category: 'Engineering', classes: ['class3b', 'class4'] },
  { id: 'remote_interlock', name: 'Remote Interlock', category: 'Engineering', classes: ['class3b', 'class4'] },
  { id: 'emergency_stop', name: 'Emergency Stop', category: 'Engineering', classes: ['class3b', 'class4'] },
  { id: 'beam_attenuator', name: 'Beam Attenuator', category: 'Engineering', classes: ['class3b', 'class4'] },
  { id: 'warning_signs', name: 'Warning Signs/Lights', category: 'Administrative', classes: ['class2', 'class2m', 'class3r', 'class3b', 'class4'] },
  { id: 'sop', name: 'Standard Operating Procedures', category: 'Administrative', classes: ['class3b', 'class4'] },
  { id: 'training', name: 'Safety Training', category: 'Administrative', classes: ['class2m', 'class3r', 'class3b', 'class4'] },
  { id: 'lsd', name: 'Laser Safety Officer Designation', category: 'Administrative', classes: ['class3b', 'class4'] },
  { id: 'eye_protection', name: 'Protective Eyewear', category: 'PPE', classes: ['class3b', 'class4'] },
  { id: 'protective_clothing', name: 'Protective Clothing', category: 'PPE', classes: ['class4'] },
];

// ============================================================================
// SECTION 1: CLASSIFICATION OVERVIEW
// ============================================================================

function ClassificationOverview() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [compareMode, setCompareMode] = useState(false);
  const [compareSelection, setCompareSelection] = useState<string[]>([]);

  const toggleCompare = (classId: string) => {
    if (compareSelection.includes(classId)) {
      setCompareSelection(compareSelection.filter(id => id !== classId));
    } else if (compareSelection.length < 3) {
      setCompareSelection([...compareSelection, classId]);
    }
  };

  const selectedClassData = LASER_CLASSES.find(c => c.id === selectedClass);

  // Keyboard navigation
  const handleClassKeyDown = (e: React.KeyboardEvent, classId: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      if (compareMode) {
        toggleCompare(classId);
      } else {
        setSelectedClass(selectedClass === classId ? null : classId);
      }
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Laser classification overview">
      {/* Skip link */}
      <a 
        href="#classification-main" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to classification details
      </a>

      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Laser Classification System</h3>
        <Button
          variant={compareMode ? 'default' : 'outline'}
          size="sm"
          onClick={() => {
            setCompareMode(!compareMode);
            setCompareSelection([]);
            setSelectedClass(null);
          }}
          aria-pressed={compareMode}
          aria-label={compareMode ? 'Exit comparison mode' : 'Enter comparison mode'}
        >
          {compareMode ? 'Exit Compare' : 'Compare Mode'}
        </Button>
      </div>

      {compareMode ? (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Select up to 3 classes to compare</p>
          <div className="grid grid-cols-7 gap-2" role="group" aria-label="Select classes to compare">
            {LASER_CLASSES.map((c) => (
              <button
                key={c.id}
                onClick={() => toggleCompare(c.id)}
                onKeyDown={(e) => handleClassKeyDown(e, c.id)}
                className={`p-3 rounded-lg border-2 text-center transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  compareSelection.includes(c.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                aria-pressed={compareSelection.includes(c.id)}
                aria-label={`${c.name}${compareSelection.includes(c.id) ? ', selected' : ''}`}
              >
                <div className="font-bold text-sm">{c.name}</div>
              </button>
            ))}
          </div>
          
          {compareSelection.length > 0 && (
            <Card>
              <CardContent className="p-4">
                <div 
                  className={`grid gap-4 ${compareSelection.length === 1 ? 'grid-cols-1' : compareSelection.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
                  role="region" 
                  aria-label="Class comparison"
                >
                  {compareSelection.map(classId => {
                    const c = LASER_CLASSES.find(l => l.id === classId)!;
                    return (
                      <div 
                        key={c.id} 
                        className={`p-4 rounded-lg ${c.bgColor} border ${c.borderColor}`}
                        role="article"
                        aria-label={`${c.name} details`}
                      >
                        <h4 className="font-bold text-lg mb-2">{c.name}</h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="font-medium">Power:</span> {c.powerLimit}</div>
                          <div><span className="font-medium">Wavelength:</span> {c.wavelengthRange}</div>
                          <div>
                            <span className="font-medium">Eye Hazard:</span>{' '}
                            <Badge className={HAZARD_COLORS[c.eyeHazard]}>
                              {HAZARD_PATTERNS[c.eyeHazard]} {c.eyeHazard}
                            </Badge>
                          </div>
                          <div>
                            <span className="font-medium">Skin Hazard:</span>{' '}
                            <Badge className={HAZARD_COLORS[c.skinHazard]}>
                              {HAZARD_PATTERNS[c.skinHazard]} {c.skinHazard}
                            </Badge>
                          </div>
                          <div><span className="font-medium">Aversion:</span> {c.aversionResponse ? '✓ Yes' : '✗ No'}</div>
                          <div className="pt-2 border-t">
                            <div className="font-medium mb-1">Examples:</div>
                            <ul className="list-disc list-inside text-xs">
                              {c.examples.slice(0, 2).map((ex, i) => <li key={i}>{ex}</li>)}
                            </ul>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ) : (
        <div className="grid gap-3" id="classification-main">
          {LASER_CLASSES.map((c) => (
            <Card
              key={c.id}
              className={`cursor-pointer transition-all focus-within:ring-2 focus-within:ring-primary ${selectedClass === c.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setSelectedClass(selectedClass === c.id ? null : c.id)}
              role="button"
              tabIndex={0}
              aria-expanded={selectedClass === c.id}
              aria-label={`${c.name}: ${c.description} Press Enter to ${selectedClass === c.id ? 'collapse' : 'expand'} details`}
              onKeyDown={(e) => handleClassKeyDown(e, c.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4">
                    <div 
                      className={`w-12 h-12 rounded-lg ${c.bgColor} ${c.color} flex items-center justify-center font-bold text-lg`}
                      aria-hidden="true"
                    >
                      {c.icon}
                    </div>
                    <div>
                      <h4 className="font-bold">{c.name}</h4>
                      <p className="text-sm text-muted-foreground">{c.description}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Badge className={HAZARD_COLORS[c.eyeHazard]}>
                      Eye: {c.eyeHazard}
                    </Badge>
                    {c.aversionResponse && <Badge variant="outline">Blink Reflex</Badge>}
                  </div>
                </div>
                
                {selectedClass === c.id && (
                  <div className="mt-4 pt-4 border-t space-y-3">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <div className="text-muted-foreground">Power Limit</div>
                        <div className="font-medium">{c.powerLimit}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Wavelength</div>
                        <div className="font-medium">{c.wavelengthRange}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Skin Hazard</div>
                        <Badge className={HAZARD_COLORS[c.skinHazard]}>
                          {HAZARD_PATTERNS[c.skinHazard]} {c.skinHazard}
                        </Badge>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Aversion Response</div>
                        <div className="font-medium">{c.aversionResponse ? 'Protected by blink reflex (0.25s)' : 'Not applicable'}</div>
                      </div>
                    </div>
                    <div>
                      <div className="text-muted-foreground text-sm mb-1">Common Examples:</div>
                      <div className="flex flex-wrap gap-2">
                        {c.examples.map((ex, i) => (
                          <Badge key={i} variant="secondary">{ex}</Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// SECTION 2: AEL CALCULATOR
// ============================================================================

function AELCalculator() {
  const [wavelength, setWavelength] = useState(632);
  const [power, setPower] = useState(1);
  const [exposureTime, setExposureTime] = useState(0.25);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const calculateAEL = useMemo(() => {
    // Simplified AEL calculation for educational purposes
    let baseAEL = 0.39e-6;
    
    if (wavelength >= 400 && wavelength <= 700) {
      baseAEL = baseAEL * (wavelength / 550);
    } else if (wavelength > 700 && wavelength <= 1400) {
      baseAEL = baseAEL * 10;
    }
    
    const timeFactor = Math.sqrt(exposureTime / 0.25);
    const aelValue = baseAEL * timeFactor;
    
    let determinedClass = 'Class 1';
    if (power > 500) determinedClass = 'Class 4';
    else if (power > 0.5) determinedClass = 'Class 3B';
    else if (power > 5 && wavelength >= 400 && wavelength <= 700) determinedClass = 'Class 3R';
    else if (power > 1 && wavelength >= 400 && wavelength <= 700) determinedClass = 'Class 2';
    else if (power > 1) determinedClass = 'Class 3R';
    
    return {
      aelValue,
      determinedClass,
      mpe: aelValue * 1000,
    };
  }, [wavelength, power, exposureTime]);

  const classData = LASER_CLASSES.find(c => c.name === calculateAEL.determinedClass);

  // Error validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    if (wavelength < 180 || wavelength > 10000) {
      newErrors.wavelength = 'Wavelength must be between 180nm and 10000nm';
    }
    if (power < 0) {
      newErrors.power = 'Power cannot be negative';
    }
    setErrors(newErrors);
  }, [wavelength, power]);

  return (
    <div className="space-y-6" role="region" aria-label="Accessible Emission Limit calculator">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Laser Parameters</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="wavelength-input" className="text-sm font-medium">Wavelength</label>
                <span className="text-sm text-muted-foreground">{wavelength} nm</span>
              </div>
              <Slider
                id="wavelength-input"
                value={[wavelength]}
                onValueChange={([v]) => setWavelength(v)}
                min={200}
                max={1500}
                step={10}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Wavelength selector"
                aria-valuemin={200}
                aria-valuemax={1500}
                aria-valuenow={wavelength}
                aria-valuetext={`${wavelength} nanometers`}
                aria-invalid={!!errors.wavelength}
                aria-describedby={errors.wavelength ? 'wavelength-error' : undefined}
              />
              {errors.wavelength && (
                <p id="wavelength-error" className="text-sm text-destructive" role="alert">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  {errors.wavelength}
                </p>
              )}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>UV (200nm)</span>
                <span>Visible</span>
                <span>IR (1500nm)</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="power-input" className="text-sm font-medium">Power</label>
                <span className="text-sm text-muted-foreground">{power} mW</span>
              </div>
              <Slider
                id="power-input"
                value={[power]}
                onValueChange={([v]) => setPower(v)}
                min={0.01}
                max={1000}
                step={0.1}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Power selector"
                aria-valuemin={0.01}
                aria-valuemax={1000}
                aria-valuenow={power}
                aria-valuetext={`${power} milliwatts`}
                aria-invalid={!!errors.power}
                aria-describedby={errors.power ? 'power-error' : undefined}
              />
              {errors.power && (
                <p id="power-error" className="text-sm text-destructive" role="alert">
                  <AlertCircle className="w-4 h-4 inline mr-1" />
                  {errors.power}
                </p>
              )}
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.01 mW</span>
                <span>1000 mW</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label htmlFor="exposure-input" className="text-sm font-medium">Exposure Duration</label>
                <span className="text-sm text-muted-foreground">{exposureTime}s</span>
              </div>
              <Slider
                id="exposure-input"
                value={[exposureTime * 100]}
                onValueChange={([v]) => setExposureTime(v / 100)}
                min={1}
                max={1000}
                step={1}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Exposure duration selector"
                aria-valuemin={0.01}
                aria-valuemax={10}
                aria-valuenow={exposureTime}
                aria-valuetext={`${exposureTime} seconds`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.01s</span>
                <span>10s</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Calculated Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div 
              className={`p-4 rounded-lg ${classData?.bgColor} ${classData?.borderColor} border`}
              role="region" 
              aria-label="Classification result"
              aria-live="polite"
            >
              <div className="text-sm text-muted-foreground mb-1">Determined Class</div>
              <div className={`text-2xl font-bold ${classData?.color}`}>{calculateAEL.determinedClass}</div>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">AEL (Accessible Emission Limit)</span>
                <span className="font-mono">{(calculateAEL.aelValue * 1000).toFixed(3)} mW</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">MPE (Maximum Permissible Exposure)</span>
                <span className="font-mono">{calculateAEL.mpe.toFixed(4)} mW/cm²</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Classification Basis</span>
                <span>Power & Wavelength</span>
              </div>
            </div>

            <div className="bg-muted p-3 rounded-lg text-xs space-y-1">
              <div className="font-medium">Formula Used:</div>
              <code className="block p-2 bg-background rounded font-mono">AEL = Base × √(T/T₀) × Cλ</code>
              <div className="text-muted-foreground mt-1">
                Where Base = 0.39 µW, T₀ = 0.25s, Cλ = wavelength correction
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">AEL Reference Table</CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="grid grid-cols-7 gap-2 text-center text-sm"
            role="table" 
            aria-label="AEL reference table by laser class"
          >
            <div role="row" className="contents">
              {LASER_CLASSES.map((c) => (
                <div 
                  key={c.id} 
                  className={`p-3 rounded-lg ${c.bgColor} ${c.borderColor} border`}
                  role="cell"
                >
                  <div className="font-bold text-xs mb-1">{c.name}</div>
                  <div className="text-xs">{c.powerLimit}</div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 3: REAL-WORLD EXAMPLES (SORTING GAME)
// ============================================================================

function RealWorldExamples() {
  const [gameMode, setGameMode] = useState<'sorting' | 'wizard'>('sorting');
  
  // Sorting game state
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [announceResult, setAnnounceResult] = useState('');

  // Wizard state
  const [wizardStep, setWizardStep] = useState(0);
  const [wizardAnswers, setWizardAnswers] = useState<Record<number, string>>({});
  const [wizardResult, setWizardResult] = useState<string | null>(null);

  const checkAnswers = () => {
    let correct = 0;
    DEVICES_FOR_SORTING.forEach(device => {
      if (assignments[device.id] === device.class) correct++;
    });
    setScore(correct);
    setShowResults(true);
    setAnnounceResult(`You scored ${correct} out of ${DEVICES_FOR_SORTING.length} correct`);
  };

  const wizardQuestions = [
    { question: 'What is the wavelength?', options: ['Visible (400-700nm)', 'Invisible (<400nm or >700nm)'] },
    { question: 'What is the power output?', options: ['< 1 mW', '1-5 mW', '5-500 mW', '> 500 mW'] },
    { question: 'Is it viewed with optical aids?', options: ['Yes', 'No'] },
  ];

  const processWizard = () => {
    const wavelength = wizardAnswers[0];
    const power = wizardAnswers[1];
    const optics = wizardAnswers[2];
    
    let result = 'Class 1';
    if (power === '> 500 mW') result = 'Class 4';
    else if (power === '5-500 mW') result = 'Class 3B';
    else if (power === '1-5 mW' && wavelength === 'Visible (400-700nm)') result = 'Class 3R';
    else if (power === '1-5 mW') result = 'Class 3R';
    else if (power === '< 1 mW' && wavelength === 'Visible (400-700nm)') result = 'Class 2';
    else if (optics === 'Yes') result = 'Class 1M';
    
    setWizardResult(result);
  };

  // Keyboard handler for game mode toggle
  const handleModeKeyDown = (e: React.KeyboardEvent, mode: 'sorting' | 'wizard') => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setGameMode(mode);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Real-world classification examples">
      {/* Live region for results */}
      <div className="sr-only" role="status" aria-live="polite" aria-atomic="true">
        {announceResult}
      </div>

      <div className="flex gap-2" role="tablist" aria-label="Practice mode selector">
        <Button
          variant={gameMode === 'sorting' ? 'default' : 'outline'}
          onClick={() => setGameMode('sorting')}
          onKeyDown={(e) => handleModeKeyDown(e, 'sorting')}
          role="tab"
          aria-selected={gameMode === 'sorting'}
          aria-label="Sorting game mode"
        >
          Sorting Game
        </Button>
        <Button
          variant={gameMode === 'wizard' ? 'default' : 'outline'}
          onClick={() => setGameMode('wizard')}
          onKeyDown={(e) => handleModeKeyDown(e, 'wizard')}
          role="tab"
          aria-selected={gameMode === 'wizard'}
          aria-label="Classification wizard mode"
        >
          Classification Wizard
        </Button>
      </div>

      {gameMode === 'sorting' ? (
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Match Devices to Laser Classes</CardTitle>
              <CardDescription>Click the correct class for each device</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {DEVICES_FOR_SORTING.map((device) => (
                <div
                  key={device.id}
                  className={`flex items-center justify-between p-3 rounded-lg border ${
                    showResults
                      ? assignments[device.id] === device.class
                        ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800'
                        : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
                      : 'bg-card border-border'
                  }`}
                  role="group"
                  aria-label={`${device.name} classification`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl" aria-hidden="true">{device.icon}</span>
                    <span className="font-medium">{device.name}</span>
                  </div>
                  <div className="flex gap-1" role="radiogroup" aria-label={`Select class for ${device.name}`}>
                    {['class1', 'class1m', 'class2', 'class2m', 'class3r', 'class3b', 'class4'].map((c) => (
                      <Button
                        key={c}
                        size="sm"
                        variant={assignments[device.id] === c ? 'default' : 'outline'}
                        onClick={() => {
                          if (!showResults) {
                            setAssignments({ ...assignments, [device.id]: c });
                          }
                        }}
                        className="text-xs px-2"
                        disabled={showResults}
                        role="radio"
                        aria-checked={assignments[device.id] === c}
                        aria-label={`Class ${c.replace('class', '').replace('m', 'M').replace('r', 'R').replace('b', 'B')}`}
                      >
                        {c.replace('class', '').replace('m', 'M').replace('r', 'R').replace('b', 'B')}
                      </Button>
                    ))}
                  </div>
                  {showResults && (
                    <Badge 
                      className={assignments[device.id] === device.class ? 'bg-green-600' : 'bg-red-600'}
                      aria-label={assignments[device.id] === device.class ? 'Correct' : 'Incorrect'}
                    >
                      {assignments[device.id] === device.class ? '✓' : '✗'}
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
            <CardFooter className="gap-2">
              {!showResults ? (
                <Button
                  onClick={checkAnswers}
                  disabled={Object.keys(assignments).length < DEVICES_FOR_SORTING.length}
                  aria-label="Check your answers"
                >
                  Check Answers
                </Button>
              ) : (
                <>
                  <Badge variant="secondary" aria-label={`Score: ${score} out of ${DEVICES_FOR_SORTING.length}`}>
                    Score: {score}/{DEVICES_FOR_SORTING.length}
                  </Badge>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowResults(false);
                      setAssignments({});
                      setScore(0);
                      setAnnounceResult('');
                    }}
                    aria-label="Try sorting game again"
                  >
                    Try Again
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Classification Decision Tree</CardTitle>
            <CardDescription>Answer questions to classify a laser device</CardDescription>
          </CardHeader>
          <CardContent>
            {!wizardResult ? (
              <div className="space-y-4">
                <div 
                  className="flex items-center gap-2 mb-4" 
                  role="progressbar" 
                  aria-valuenow={wizardStep + 1} 
                  aria-valuemin={1} 
                  aria-valuemax={wizardQuestions.length}
                  aria-label="Wizard progress"
                >
                  {wizardQuestions.map((_, i) => (
                    <div
                      key={i}
                      className={`h-2 w-8 rounded-full ${i <= wizardStep ? 'bg-primary' : 'bg-muted'}`}
                      aria-hidden="true"
                    />
                  ))}
                </div>
                
                <div className="text-lg font-medium">
                  {wizardQuestions[wizardStep]?.question}
                </div>
                
                <div className="grid gap-2" role="group" aria-label="Answer options">
                  {wizardQuestions[wizardStep]?.options.map((option) => (
                    <Button
                      key={option}
                      variant="outline"
                      onClick={() => {
                        const newAnswers = { ...wizardAnswers, [wizardStep]: option };
                        setWizardAnswers(newAnswers);
                        if (wizardStep < wizardQuestions.length - 1) {
                          setWizardStep(wizardStep + 1);
                        } else {
                          processWizard();
                        }
                      }}
                      aria-label={option}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center space-y-4" role="region" aria-label="Classification result">
                <div className="text-4xl mb-2" aria-hidden="true">🎯</div>
                <div className="text-lg">Your device is classified as:</div>
                <div 
                  className={`text-3xl font-bold ${LASER_CLASSES.find(c => c.name === wizardResult)?.color}`}
                  aria-live="polite"
                >
                  {wizardResult}
                </div>
                <Button
                  onClick={() => {
                    setWizardStep(0);
                    setWizardAnswers({});
                    setWizardResult(null);
                  }}
                  aria-label="Classify another device"
                >
                  Classify Another Device
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// SECTION 4: CONTROL MEASURES
// ============================================================================

function ControlMeasures() {
  const [selectedClass, setSelectedClass] = useState<string>('class1');
  const [checkedControls, setCheckedControls] = useState<Record<string, boolean>>({});

  const classData = LASER_CLASSES.find(c => c.id === selectedClass);
  
  const relevantControls = CONTROL_MEASURES.filter(
    control => control.classes.includes(selectedClass)
  );

  const categories = ['Engineering', 'Administrative', 'PPE'];
  const hierarchyColors = ['bg-emerald-100 border-emerald-300', 'bg-amber-100 border-amber-300', 'bg-red-100 border-red-300'];
  const categoryIcons = ['🔧', '📋', '🥽'];

  const progress = relevantControls.length > 0 
    ? (Object.values(checkedControls).filter(Boolean).length / relevantControls.length) * 100 
    : 100;

  return (
    <div className="space-y-6" role="region" aria-label="Control measures by laser class">
      <div className="grid md:grid-cols-3 gap-4">
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Select Laser Class</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {LASER_CLASSES.map((c) => (
              <button
                key={c.id}
                onClick={() => {
                  setSelectedClass(c.id);
                  setCheckedControls({});
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                  selectedClass === c.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                aria-pressed={selectedClass === c.id}
                aria-label={`${c.name}: ${c.powerLimit}`}
              >
                <div className="flex items-center gap-2">
                  <span aria-hidden="true">{c.icon}</span>
                  <div>
                    <div className="font-medium">{c.name}</div>
                    <div className="text-xs text-muted-foreground">{c.powerLimit}</div>
                  </div>
                </div>
              </button>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Required Control Measures for {classData?.name}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Progress indicator */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Implementation Progress</span>
                <span className="font-medium">{Math.round(progress)}%</span>
              </div>
              <Progress 
                value={progress} 
                className="h-2" 
                aria-label="Control implementation progress"
                aria-valuenow={Math.round(progress)}
                aria-valuemin={0}
                aria-valuemax={100}
              />
            </div>

            {categories.map((category, catIndex) => {
              const controls = relevantControls.filter(c => c.category === category);
              if (controls.length === 0) return null;
              
              return (
                <div 
                  key={category} 
                  className={`p-4 rounded-lg border ${hierarchyColors[catIndex]}`}
                  role="group"
                  aria-label={`${category} controls`}
                >
                  <div className="font-semibold mb-3 flex items-center gap-2">
                    <span aria-hidden="true">{categoryIcons[catIndex]}</span>
                    <span>{category} Controls</span>
                    <Badge variant="outline">{catIndex + 1}</Badge>
                  </div>
                  <div className="space-y-2">
                    {controls.map((control) => (
                      <label
                        key={control.id}
                        className="flex items-center gap-3 p-2 rounded bg-white/50 cursor-pointer hover:bg-white/80 transition-colors"
                      >
                        <Checkbox
                          checked={checkedControls[control.id] || false}
                          onCheckedChange={(checked) =>
                            setCheckedControls({ ...checkedControls, [control.id]: checked })
                          }
                          aria-label={control.name}
                        />
                        <span className={`text-sm ${checkedControls[control.id] ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                          {control.name}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              );
            })}

            {relevantControls.length === 0 && (
              <div className="text-center py-8 text-muted-foreground">
                Minimal controls required for {classData?.name}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Control Hierarchy Visualization</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3" role="list" aria-label="Control hierarchy">
            {[
              { level: 1, name: 'Elimination/Substitution', desc: 'Remove hazard or use safer alternative', classes: 'Class 1', icon: '🛡️' },
              { level: 2, name: 'Engineering Controls', desc: 'Enclosures, interlocks, barriers', classes: 'Class 1M-4', icon: '🔧' },
              { level: 3, name: 'Administrative Controls', desc: 'Procedures, training, signage', classes: 'Class 2-4', icon: '📋' },
              { level: 4, name: 'Personal Protective Equipment', desc: 'Eye protection, protective clothing', classes: 'Class 3B-4', icon: '🥽' },
            ].map((item) => (
              <div
                key={item.level}
                className={`p-3 rounded-lg border-l-4 ${
                  item.level === 1 ? 'border-l-emerald-500 bg-emerald-50' :
                  item.level === 2 ? 'border-l-blue-500 bg-blue-50' :
                  item.level === 3 ? 'border-l-amber-500 bg-amber-50' :
                  'border-l-red-500 bg-red-50'
                }`}
                role="listitem"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span aria-hidden="true">{item.icon}</span>
                      <span className="font-medium">{item.name}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">{item.desc}</div>
                  </div>
                  <Badge variant="outline">Applies: {item.classes}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 5: LABELING REQUIREMENTS
// ============================================================================

function LabelingRequirements() {
  const [labelSystem, setLabelSystem] = useState<'fda' | 'iec'>('fda');
  const [selectedClass, setSelectedClass] = useState<string>('class2');
  const [builderOptions, setBuilderOptions] = useState({
    hasAperture: true,
    hasText: true,
    color: true,
    hasWavelength: true,
    wavelength: '650',
    maxOutput: '1',
  });

  const classData = LASER_CLASSES.find(c => c.id === selectedClass);

  const labelColors: Record<string, { bg: string; text: string; warning: string }> = {
    class1: { bg: 'bg-emerald-100', text: 'text-emerald-900', warning: 'text-emerald-700' },
    class1m: { bg: 'bg-teal-100', text: 'text-teal-900', warning: 'text-teal-700' },
    class2: { bg: 'bg-amber-100', text: 'text-amber-900', warning: 'text-amber-700' },
    class2m: { bg: 'bg-orange-100', text: 'text-orange-900', warning: 'text-orange-700' },
    class3r: { bg: 'bg-orange-100', text: 'text-orange-900', warning: 'text-orange-700' },
    class3b: { bg: 'bg-red-100', text: 'text-red-900', warning: 'text-red-700' },
    class4: { bg: 'bg-red-200', text: 'text-red-900', warning: 'text-red-800' },
  };

  const colors = labelColors[selectedClass];

  return (
    <div className="space-y-6" role="region" aria-label="Laser labeling requirements">
      <div className="flex gap-2" role="tablist" aria-label="Label standard selector">
        <Button
          variant={labelSystem === 'fda' ? 'default' : 'outline'}
          onClick={() => setLabelSystem('fda')}
          role="tab"
          aria-selected={labelSystem === 'fda'}
          aria-label="FDA 21 CFR 1040.10 labeling standard"
        >
          FDA (21 CFR 1040.10)
        </Button>
        <Button
          variant={labelSystem === 'iec' ? 'default' : 'outline'}
          onClick={() => setLabelSystem('iec')}
          role="tab"
          aria-selected={labelSystem === 'iec'}
          aria-label="IEC 60825-1 labeling standard"
        >
          IEC 60825-1
        </Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Label Requirements</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Laser Class</label>
              <div className="grid grid-cols-4 gap-2" role="radiogroup" aria-label="Select laser class for label">
                {LASER_CLASSES.map((c) => (
                  <button
                    key={c.id}
                    onClick={() => setSelectedClass(c.id)}
                    className={`p-2 text-xs rounded border focus:outline-none focus:ring-2 focus:ring-primary ${
                      selectedClass === c.id
                        ? 'border-primary bg-primary/10'
                        : 'border-border'
                    }`}
                    role="radio"
                    aria-checked={selectedClass === c.id}
                    aria-label={c.name}
                  >
                    {c.name}
                  </button>
                ))}
              </div>
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="font-medium text-sm">Required Elements:</div>
              {labelSystem === 'fda' ? (
                <ul className="space-y-2 text-sm" aria-label="FDA label requirements">
                  <li className="flex items-center gap-2">
                    <Checkbox checked disabled aria-label="Class designation required" />
                    Class designation
                  </li>
                  <li className="flex items-center gap-2">
                    <Checkbox checked={selectedClass !== 'class1'} disabled aria-label="Warning logotype" />
                    Warning logotype (for Class 2+)
                  </li>
                  <li className="flex items-center gap-2">
                    <Checkbox checked aria-label="Aperture declaration required" />
                    Aperture declaration
                  </li>
                  {['class3b', 'class4'].includes(selectedClass) && (
                    <li className="flex items-center gap-2">
                      <Checkbox checked disabled aria-label="Max output power required" />
                      Max output power
                    </li>
                  )}
                  <li className="flex items-center gap-2">
                    <Checkbox checked={builderOptions.hasWavelength} disabled aria-label="Wavelength" />
                    Wavelength (if Class 2+)
                  </li>
                </ul>
              ) : (
                <ul className="space-y-2 text-sm" aria-label="IEC label requirements">
                  <li className="flex items-center gap-2">
                    <Checkbox checked aria-label="Laser radiation symbol required" />
                    Laser radiation symbol
                  </li>
                  <li className="flex items-center gap-2">
                    <Checkbox checked aria-label="Class designation required" />
                    Class designation (1, 1M, 2, 2M, 3R, 3B, 4)
                  </li>
                  <li className="flex items-center gap-2">
                    <Checkbox checked={selectedClass !== 'class1'} disabled aria-label="Warning statement" />
                    Warning statement
                  </li>
                  <li className="flex items-center gap-2">
                    <Checkbox checked={['class3b', 'class4'].includes(selectedClass)} disabled aria-label="Max output and pulse duration" />
                    Max output & pulse duration
                  </li>
                </ul>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Interactive Label Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Customization Options</label>
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm">
                  <Checkbox
                    checked={builderOptions.hasWavelength}
                    onCheckedChange={(checked) =>
                      setBuilderOptions({ ...builderOptions, hasWavelength: checked as boolean })
                    }
                    aria-label="Show wavelength on label"
                  />
                  Show Wavelength
                </label>
                {builderOptions.hasWavelength && (
                  <div className="ml-6">
                    <input
                      type="text"
                      value={builderOptions.wavelength}
                      onChange={(e) => setBuilderOptions({ ...builderOptions, wavelength: e.target.value })}
                      className="w-20 px-2 py-1 text-sm border rounded"
                      placeholder="nm"
                      aria-label="Wavelength value in nanometers"
                    />
                    <span className="ml-2 text-sm text-muted-foreground">nm</span>
                  </div>
                )}
                
                {['class3b', 'class4'].includes(selectedClass) && (
                  <>
                    <label className="flex items-center gap-2 text-sm">
                      <Checkbox
                        checked={builderOptions.hasText}
                        onCheckedChange={(checked) =>
                          setBuilderOptions({ ...builderOptions, hasText: checked as boolean })
                        }
                        aria-label="Show warning text on label"
                      />
                      Show Warning Text
                    </label>
                    <div className="ml-6 flex items-center gap-2">
                      <input
                        type="text"
                        value={builderOptions.maxOutput}
                        onChange={(e) => setBuilderOptions({ ...builderOptions, maxOutput: e.target.value })}
                        className="w-20 px-2 py-1 text-sm border rounded"
                        placeholder="mW"
                        aria-label="Maximum output power in milliwatts"
                      />
                      <span className="text-sm text-muted-foreground">mW max</span>
                    </div>
                  </>
                )}
              </div>
            </div>

            <Separator />

            {/* Label Preview */}
            <div 
              className={`p-6 rounded-lg border-2 border-dashed ${colors.bg} border-current`}
              role="img" 
              aria-label={`Preview of ${labelSystem.toUpperCase()} label for ${classData?.name}`}
            >
              <div className={`${colors.text} text-center space-y-2`}>
                {labelSystem === 'fda' ? (
                  <>
                    {selectedClass !== 'class1' && (
                      <div className={`text-xs font-bold tracking-wider ${colors.warning}`}>
                        ⚠ CAUTION
                      </div>
                    )}
                    <div className="text-2xl font-black tracking-tight">
                      LASER {classData?.name.toUpperCase()}
                    </div>
                    {builderOptions.hasAperture && (
                      <div className="text-xs">APERTURE</div>
                    )}
                    {selectedClass !== 'class1' && builderOptions.hasText && (
                      <div className="text-xs max-w-[200px] mx-auto">
                        {selectedClass === 'class2' && 'DO NOT STARE INTO BEAM'}
                        {['class3r', 'class3b'].includes(selectedClass) && 'AVOID DIRECT EYE EXPOSURE'}
                        {selectedClass === 'class4' && 'AVOID EYE OR SKIN EXPOSURE TO DIRECT OR SCATTERED RADIATION'}
                      </div>
                    )}
                    <div className="text-xs pt-2">
                      {builderOptions.hasWavelength && `λ: ${builderOptions.wavelength}nm`}
                      {['class3b', 'class4'].includes(selectedClass) && ` • Max: ${builderOptions.maxOutput}mW`}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="text-3xl mb-2" aria-hidden="true">☢</div>
                    <div className="text-lg font-bold">
                      LASER RADIATION
                    </div>
                    <div className="text-2xl font-black">
                      {classData?.name.replace('Class ', '')}
                    </div>
                    {selectedClass !== 'class1' && (
                      <div className="text-xs max-w-[200px] mx-auto mt-2">
                        {selectedClass === 'class2' && 'Do not stare into beam'}
                        {['class3r', 'class3b'].includes(selectedClass) && 'Avoid exposure to beam'}
                        {selectedClass === 'class4' && 'Avoid eye or skin exposure to direct or scattered radiation'}
                      </div>
                    )}
                    <div className="text-xs pt-2">
                      {builderOptions.hasWavelength && `${builderOptions.wavelength}nm`}
                    </div>
                  </>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type SectionId = 'overview' | 'ael' | 'examples' | 'controls' | 'labels';

const SECTIONS: { id: SectionId; title: string; description: string; icon: string }[] = [
  { id: 'overview', title: 'Classification Overview', description: 'All 7 laser classes with interactive comparison', icon: '📊' },
  { id: 'ael', title: 'AEL Calculator', description: 'Accessible Emission Limits and calculations', icon: '🧮' },
  { id: 'examples', title: 'Real-World Examples', description: 'Sorting games and classification wizard', icon: '🎮' },
  { id: 'controls', title: 'Control Measures', description: 'Safety controls required by class', icon: '🛡️' },
  { id: 'labels', title: 'Labeling Requirements', description: 'FDA and IEC labeling standards', icon: '🏷️' },
];

export default function Module2_ClassificationSystem() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [completedSections, setCompletedSections] = useState<Set<SectionId>>(new Set());
  const mainContentRef = useRef<HTMLDivElement>(null);

  const markComplete = (section: SectionId) => {
    setCompletedSections(new Set(Array.from(completedSections).concat(section)));
  };

  const progress = (completedSections.size / SECTIONS.length) * 100;

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return <ClassificationOverview />;
      case 'ael':
        return <AELCalculator />;
      case 'examples':
        return <RealWorldExamples />;
      case 'controls':
        return <ControlMeasures />;
      case 'labels':
        return <LabelingRequirements />;
      default:
        return null;
    }
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        markComplete(activeSection);
      }
      const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setActiveSection(SECTIONS[currentIndex - 1].id);
      } else if (e.key === 'ArrowRight' && currentIndex < SECTIONS.length - 1) {
        setActiveSection(SECTIONS[currentIndex + 1].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  const handleSectionKeyDown = (e: React.KeyboardEvent, sectionId: SectionId) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveSection(sectionId);
      setTimeout(() => {
        mainContentRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      {/* Skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      {/* Module Header */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Module 2: Laser Classification System</h1>
        <p className="text-muted-foreground">
          Understanding laser classes, AEL calculations, and safety requirements
        </p>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Module Progress</span>
              <span className="font-medium">{Math.round(progress)}%</span>
            </div>
            <Progress 
              value={progress} 
              className="h-2" 
              aria-label="Module completion progress"
              aria-valuenow={Math.round(progress)}
              aria-valuemin={0}
              aria-valuemax={100}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-muted-foreground">
            <span>{completedSections.size} of {SECTIONS.length} sections completed</span>
            <span>{Math.round(progress)}%</span>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <nav aria-label="Module sections">
        <div className="flex flex-wrap gap-2">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              onKeyDown={(e) => handleSectionKeyDown(e, section.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary ${
                activeSection === section.id
                  ? 'border-primary bg-primary text-primary-foreground'
                  : completedSections.has(section.id)
                  ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200'
                  : 'border-border hover:border-primary/50'
              }`}
              role="tab"
              aria-selected={activeSection === section.id}
              aria-label={`${section.title}${completedSections.has(section.id) ? ', completed' : ''}`}
            >
              <span aria-hidden="true">{completedSections.has(section.id) ? '✓' : section.icon}</span>
              <span className="font-medium">{section.title}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Active Section Description */}
      <div className="text-sm text-muted-foreground">
        {SECTIONS.find(s => s.id === activeSection)?.description}
      </div>

      {/* Section Content */}
      <main 
        id="main-content" 
        ref={mainContentRef}
        tabIndex={-1}
        className="min-h-[400px]"
      >
        {renderSection()}
      </main>

      {/* Section Actions */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
            if (currentIndex > 0) {
              setActiveSection(SECTIONS[currentIndex - 1].id);
            }
          }}
          disabled={activeSection === 'overview'}
          aria-label="Previous section"
        >
          ← Previous
        </Button>
        
        <Button
          onClick={() => {
            markComplete(activeSection);
            const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
            if (currentIndex < SECTIONS.length - 1) {
              setActiveSection(SECTIONS[currentIndex + 1].id);
            }
          }}
          aria-label={completedSections.has(activeSection) ? 'Next section' : 'Mark complete and continue'}
        >
          {completedSections.has(activeSection) ? 'Next →' : 'Mark Complete & Continue →'}
        </Button>
      </div>

      {/* Keyboard shortcuts help */}
      <div className="text-xs text-muted-foreground text-center">
        Keyboard shortcuts: Arrow keys navigate sections • Ctrl+Enter marks complete
      </div>
    </div>
  );
}
