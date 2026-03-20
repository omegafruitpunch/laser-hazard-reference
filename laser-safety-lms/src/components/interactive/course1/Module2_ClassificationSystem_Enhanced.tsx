'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Shield,
  Zap,
  Target,
  Award
} from 'lucide-react';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
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
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
    transition: { duration: 0.2 }
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

const slideInVariants = {
  hidden: { opacity: 0, x: -30 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  exit: { opacity: 0, x: 30, transition: { duration: 0.2 } }
};

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
  },
];

const HAZARD_COLORS: Record<string, string> = {
  'None': 'bg-muted text-muted-foreground',
  'Minimal': 'bg-blue-100 dark:bg-blue-950 text-blue-900 dark:text-blue-200',
  'Low': 'bg-yellow-100 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-200',
  'Moderate': 'bg-orange-100 dark:bg-orange-950 text-orange-900 dark:text-orange-200',
  'High': 'bg-red-100 dark:bg-red-950 text-red-900 dark:text-red-200',
  'Severe': 'bg-destructive text-destructive-foreground',
};

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

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex items-center justify-between" variants={itemVariants}>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Laser Classification System
        </h3>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={compareMode ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setCompareMode(!compareMode);
              setCompareSelection([]);
              setSelectedClass(null);
            }}
          >
            {compareMode ? 'Exit Compare' : 'Compare Mode'}
          </Button>
        </motion.div>
      </motion.div>

      {compareMode ? (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-sm text-muted-foreground">Select up to 3 classes to compare</p>
          <motion.div 
            className="grid grid-cols-7 gap-2"
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
          >
            {LASER_CLASSES.map((c) => (
              <motion.button
                key={c.id}
                onClick={() => toggleCompare(c.id)}
                className={`p-3 rounded-lg border-2 text-center transition-all ${
                  compareSelection.includes(c.id)
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                variants={itemVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={!compareSelection.includes(c.id) && compareSelection.length >= 3}
              >
                <div className="font-bold text-sm">{c.name}</div>
              </motion.button>
            ))}
          </motion.div>
          
          <AnimatePresence>
            {compareSelection.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <motion.div 
                      className={`grid gap-4 ${compareSelection.length === 1 ? 'grid-cols-1' : compareSelection.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}
                      variants={staggerContainer}
                      initial="hidden"
                      animate="visible"
                    >
                      {compareSelection.map((classId, index) => {
                        const c = LASER_CLASSES.find(l => l.id === classId)!;
                        return (
                          <motion.div 
                            key={c.id} 
                            className={`p-4 rounded-lg ${c.bgColor} border ${c.borderColor}`}
                            variants={itemVariants}
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 }}
                          >
                            <h4 className="font-bold text-lg mb-2">{c.name}</h4>
                            <div className="space-y-2 text-sm">
                              <div><span className="font-medium">Power:</span> {c.powerLimit}</div>
                              <div><span className="font-medium">Wavelength:</span> {c.wavelengthRange}</div>
                              <div><span className="font-medium">Eye Hazard:</span> <Badge className={HAZARD_COLORS[c.eyeHazard]}>{c.eyeHazard}</Badge></div>
                              <div><span className="font-medium">Skin Hazard:</span> <Badge className={HAZARD_COLORS[c.skinHazard]}>{c.skinHazard}</Badge></div>
                              <div><span className="font-medium">Aversion:</span> {c.aversionResponse ? '✓ Yes' : '✗ No'}</div>
                              <div className="pt-2 border-t">
                                <div className="font-medium mb-1">Examples:</div>
                                <ul className="list-disc list-inside text-xs">
                                  {c.examples.slice(0, 2).map((ex, i) => <li key={i}>{ex}</li>)}
                                </ul>
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div className="grid gap-3" variants={staggerContainer} initial="hidden" animate="visible">
          {LASER_CLASSES.map((c, index) => (
            <motion.div
              key={c.id}
              variants={itemVariants}
              whileHover={{ scale: 1.01, x: 5 }}
            >
              <Card
                className={`cursor-pointer transition-all ${selectedClass === c.id ? 'ring-2 ring-primary shadow-lg' : ''}`}
                onClick={() => setSelectedClass(selectedClass === c.id ? null : c.id)}
              >
                <CardContent className="p-4">
                  <motion.div 
                    className="flex items-start justify-between"
                    layout
                  >
                    <div className="flex items-center gap-4">
                      <motion.div 
                        className={`w-12 h-12 rounded-lg ${c.bgColor} ${c.color} flex items-center justify-center font-bold text-lg`}
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ type: 'spring' }}
                      >
                        {c.name.replace('Class ', '')}
                      </motion.div>
                      <div>
                        <h4 className="font-bold">{c.name}</h4>
                        <p className="text-sm text-muted-foreground">{c.description}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={HAZARD_COLORS[c.eyeHazard]}>Eye: {c.eyeHazard}</Badge>
                      {c.aversionResponse && <Badge variant="outline">Blink Reflex</Badge>}
                    </div>
                  </motion.div>
                  
                  <AnimatePresence>
                    {selectedClass === c.id && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <motion.div 
                          className="mt-4 pt-4 border-t space-y-3"
                          initial={{ y: -20 }}
                          animate={{ y: 0 }}
                          transition={{ delay: 0.1 }}
                        >
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <div className="text-muted-foreground">Power Limit</div>
                              <div className="font-medium">{c.powerLimit}</div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <div className="text-muted-foreground">Wavelength</div>
                              <div className="font-medium">{c.wavelengthRange}</div>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <div className="text-muted-foreground">Skin Hazard</div>
                              <Badge className={HAZARD_COLORS[c.skinHazard]}>{c.skinHazard}</Badge>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }}>
                              <div className="text-muted-foreground">Aversion Response</div>
                              <div className="font-medium">{c.aversionResponse ? 'Protected by blink reflex (0.25s)' : 'Not applicable'}</div>
                            </motion.div>
                          </div>
                          <div>
                            <div className="text-muted-foreground text-sm mb-1">Common Examples:</div>
                            <div className="flex flex-wrap gap-2">
                              {c.examples.map((ex, i) => (
                                <motion.div
                                  key={i}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.1 + i * 0.05 }}
                                >
                                  <Badge variant="secondary">{ex}</Badge>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}

// ============================================================================
// SECTION 2: AEL CALCULATOR
// ============================================================================

function AELCalculator() {
  const [wavelength, setWavelength] = useState(632);
  const [power, setPower] = useState(1);
  const [exposureTime, setExposureTime] = useState(0.25);

  const calculateAEL = useMemo(() => {
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

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="grid md:grid-cols-2 gap-6" variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Laser Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
              <div className="flex justify-between">
                <label className="text-sm font-medium">Wavelength</label>
                <motion.span 
                  className="text-sm text-muted-foreground"
                  key={wavelength}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {wavelength} nm
                </motion.span>
              </div>
              <Slider
                value={[wavelength]}
                onValueChange={([v]) => setWavelength(v)}
                min={200}
                max={1500}
                step={10}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>UV (200nm)</span>
                <span>Visible</span>
                <span>IR (1500nm)</span>
              </div>
            </motion.div>

            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
              <div className="flex justify-between">
                <label className="text-sm font-medium">Power</label>
                <motion.span 
                  className="text-sm text-muted-foreground"
                  key={power}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {power} mW
                </motion.span>
              </div>
              <Slider
                value={[power]}
                onValueChange={([v]) => setPower(v)}
                min={0.01}
                max={1000}
                step={0.1}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.01 mW</span>
                <span>1000 mW</span>
              </div>
            </motion.div>

            <motion.div className="space-y-2" whileHover={{ scale: 1.01 }}>
              <div className="flex justify-between">
                <label className="text-sm font-medium">Exposure Duration</label>
                <motion.span 
                  className="text-sm text-muted-foreground"
                  key={exposureTime}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {exposureTime}s
                </motion.span>
              </div>
              <Slider
                value={[exposureTime * 100]}
                onValueChange={([v]) => setExposureTime(v / 100)}
                min={1}
                max={1000}
                step={1}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>0.01s</span>
                <span>10s</span>
              </div>
            </motion.div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Award className="w-4 h-4" />
              Calculated Results
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div 
              className={`p-4 rounded-lg ${classData?.bgColor} ${classData?.borderColor} border`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring' }}
              key={calculateAEL.determinedClass}
            >
              <div className="text-sm text-muted-foreground mb-1">Determined Class</div>
              <motion.div 
                className={`text-2xl font-bold ${classData?.color}`}
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.1 }}
              >
                {calculateAEL.determinedClass}
              </motion.div>
            </motion.div>

            <motion.div 
              className="space-y-2 text-sm"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="flex justify-between py-2 border-b"
                variants={itemVariants}
              >
                <span className="text-muted-foreground">AEL (Accessible Emission Limit)</span>
                <motion.span 
                  className="font-mono"
                  key={calculateAEL.aelValue}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {(calculateAEL.aelValue * 1000).toFixed(3)} mW
                </motion.span>
              </motion.div>
              <motion.div 
                className="flex justify-between py-2 border-b"
                variants={itemVariants}
              >
                <span className="text-muted-foreground">MPE (Maximum Permissible Exposure)</span>
                <motion.span 
                  className="font-mono"
                  key={calculateAEL.mpe}
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  {calculateAEL.mpe.toFixed(4)} mW/cm²
                </motion.span>
              </motion.div>
              <motion.div 
                className="flex justify-between py-2"
                variants={itemVariants}
              >
                <span className="text-muted-foreground">Classification Basis</span>
                <span>Power & Wavelength</span>
              </motion.div>
            </motion.div>

            <motion.div 
              className="bg-muted p-3 rounded-lg text-xs space-y-1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="font-medium">Formula Used:</div>
              <div>AEL = Base × √(T/T₀) × Cλ</div>
              <div className="text-muted-foreground mt-1">
                Where Base = 0.39 µW, T₀ = 0.25s, Cλ = wavelength correction
              </div>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">AEL Reference Table</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="grid grid-cols-7 gap-2 text-center text-sm"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {LASER_CLASSES.map((c, index) => (
                <motion.div 
                  key={c.id} 
                  className={`p-3 rounded-lg ${c.bgColor} ${c.borderColor} border`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="font-bold text-xs mb-1">{c.name}</div>
                  <div className="text-xs">{c.powerLimit}</div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// SECTION 3: REAL-WORLD EXAMPLES (SORTING GAME)
// ============================================================================

function RealWorldExamples() {
  const [gameMode, setGameMode] = useState<'sorting' | 'wizard'>('sorting');
  
  const [assignments, setAssignments] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

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

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="flex gap-2" variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={gameMode === 'sorting' ? 'default' : 'outline'}
            onClick={() => setGameMode('sorting')}
          >
            Sorting Game
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={gameMode === 'wizard' ? 'default' : 'outline'}
            onClick={() => setGameMode('wizard')}
          >
            Classification Wizard
          </Button>
        </motion.div>
      </motion.div>

      <AnimatePresence mode="wait">
        {gameMode === 'sorting' ? (
          <motion.div 
            key="sorting"
            className="space-y-4"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Match Devices to Laser Classes</CardTitle>
                <CardDescription>Click the correct class for each device</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <motion.div 
                  className="space-y-3"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {DEVICES_FOR_SORTING.map((device, index) => (
                    <motion.div
                      key={device.id}
                      variants={itemVariants}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        showResults
                          ? assignments[device.id] === device.class
                            ? 'bg-green-50 dark:bg-green-950/30 border-green-300 dark:border-green-800'
                            : 'bg-red-50 dark:bg-red-950/30 border-red-300 dark:border-red-800'
                          : 'bg-card border-border'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <motion.span 
                          className="text-2xl"
                          whileHover={{ scale: 1.2, rotate: 10 }}
                        >
                          {device.icon}
                        </motion.span>
                        <span className="font-medium">{device.name}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {['class1', 'class1m', 'class2', 'class2m', 'class3r', 'class3b', 'class4'].map((c) => (
                          <motion.div key={c} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                            <Button
                              size="sm"
                              variant={assignments[device.id] === c ? 'default' : 'outline'}
                              onClick={() => {
                                if (!showResults) {
                                  setAssignments({ ...assignments, [device.id]: c });
                                }
                              }}
                              className="text-xs px-2"
                              disabled={showResults}
                            >
                              {c.replace('class', '').replace('m', 'M').replace('r', 'R').replace('b', 'B')}
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                      <AnimatePresence>
                        {showResults && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Badge className={assignments[device.id] === device.class ? 'bg-green-600' : 'bg-red-600'}>
                              {assignments[device.id] === device.class ? '✓' : '✗'}
                            </Badge>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              </CardContent>
              <CardFooter className="gap-2">
                <AnimatePresence mode="wait">
                  {!showResults ? (
                    <motion.div
                      key="check"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <Button
                        onClick={checkAnswers}
                        disabled={Object.keys(assignments).length < DEVICES_FOR_SORTING.length}
                      >
                        Check Answers
                      </Button>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="results"
                      className="flex gap-2 items-center"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring' }}
                      >
                        <Badge 
                          variant="secondary"
                          className={score === DEVICES_FOR_SORTING.length ? 'bg-green-500 text-white' : ''}
                        >
                          Score: {score}/{DEVICES_FOR_SORTING.length}
                        </Badge>
                      </motion.div>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowResults(false);
                          setAssignments({});
                          setScore(0);
                        }}
                      >
                        Try Again
                      </Button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardFooter>
            </Card>
          </motion.div>
        ) : (
          <motion.div
            key="wizard"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Classification Decision Tree</CardTitle>
                <CardDescription>Answer questions to classify a laser device</CardDescription>
              </CardHeader>
              <CardContent>
                <AnimatePresence mode="wait">
                  {!wizardResult ? (
                    <motion.div 
                      className="space-y-4"
                      key="wizard-steps"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <div className="flex items-center gap-2 mb-4">
                        {wizardQuestions.map((_, i) => (
                          <motion.div
                            key={i}
                            className={`h-2 w-8 rounded-full ${i <= wizardStep ? 'bg-primary' : 'bg-muted'}`}
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: i * 0.1 }}
                          />
                        ))}
                      </div>
                      
                      <motion.div 
                        className="text-lg font-medium"
                        key={`question-${wizardStep}`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                      >
                        {wizardQuestions[wizardStep]?.question}
                      </motion.div>
                      
                      <motion.div 
                        className="grid gap-2"
                        variants={staggerContainer}
                        initial="hidden"
                        animate="visible"
                      >
                        {wizardQuestions[wizardStep]?.options.map((option, index) => (
                          <motion.div key={option} variants={itemVariants}>
                            <Button
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
                              className="w-full justify-start"
                            >
                              <ChevronRight className="w-4 h-4 mr-2" />
                              {option}
                            </Button>
                          </motion.div>
                        ))}
                      </motion.div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      className="text-center space-y-4"
                      key="wizard-result"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ type: 'spring' }}
                    >
                      <motion.div 
                        className="text-4xl mb-2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', delay: 0.1 }}
                      >
                        🎯
                      </motion.div>
                      <div className="text-lg">Your device is classified as:</div>
                      <motion.div 
                        className={`text-3xl font-bold ${LASER_CLASSES.find(c => c.name === wizardResult)?.color}`}
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        {wizardResult}
                      </motion.div>
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3 }}
                      >
                        <Button
                          onClick={() => {
                            setWizardStep(0);
                            setWizardAnswers({});
                            setWizardResult(null);
                          }}
                        >
                          Classify Another Device
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
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

  const progress = (Object.values(checkedControls).filter(Boolean).length / Math.max(relevantControls.length, 1)) * 100;

  return (
    <motion.div 
      className="space-y-6"
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
    >
      <motion.div className="grid md:grid-cols-3 gap-4" variants={itemVariants}>
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Select Laser Class
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {LASER_CLASSES.map((c, index) => (
              <motion.button
                key={c.id}
                onClick={() => {
                  setSelectedClass(c.id);
                  setCheckedControls({});
                }}
                className={`w-full text-left p-3 rounded-lg border transition-all ${
                  selectedClass === c.id
                    ? 'border-primary bg-primary/10'
                    : 'border-border hover:border-primary/50'
                }`}
                whileHover={{ scale: 1.02, x: 3 }}
                whileTap={{ scale: 0.98 }}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <div className="font-medium">{c.name}</div>
                <div className="text-xs text-muted-foreground">{c.powerLimit}</div>
              </motion.button>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">
              Required Control Measures for {classData?.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <AnimatePresence mode="wait">
              {categories.map((category, catIndex) => {
                const controls = relevantControls.filter(c => c.category === category);
                if (controls.length === 0) return null;
                
                return (
                  <motion.div 
                    key={category}
                    className={`p-4 rounded-lg border ${hierarchyColors[catIndex]}`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: catIndex * 0.1 }}
                  >
                    <div className="font-semibold mb-3 flex items-center justify-between">
                      <span>{category} Controls</span>
                      <Badge variant="outline">{catIndex + 1}</Badge>
                    </div>
                    <div className="space-y-2">
                      {controls.map((control, index) => (
                        <motion.label
                          key={control.id}
                          className="flex items-center gap-3 p-2 rounded bg-white/50 cursor-pointer hover:bg-white/80 transition-colors"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ x: 3 }}
                        >
                          <Checkbox
                            checked={checkedControls[control.id] || false}
                            onCheckedChange={(checked) =>
                              setCheckedControls({ ...checkedControls, [control.id]: checked })
                            }
                          />
                          <span className="text-sm">{control.name}</span>
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {relevantControls.length === 0 && (
              <motion.div 
                className="text-center py-8 text-muted-foreground"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                Minimal controls required for {classData?.name}
              </motion.div>
            )}
          </CardContent>
          <CardFooter>
            <div className="w-full">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Implementation Progress</span>
                  <motion.span 
                    className="font-medium"
                    key={progress}
                    initial={{ scale: 1.5 }}
                    animate={{ scale: 1 }}
                  >
                    {Math.round(progress)}%
                  </motion.span>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-primary"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>
          </CardFooter>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Control Hierarchy Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="space-y-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                { level: 1, name: 'Elimination/Substitution', desc: 'Remove hazard or use safer alternative', classes: 'Class 1' },
                { level: 2, name: 'Engineering Controls', desc: 'Enclosures, interlocks, barriers', classes: 'Class 1M-4' },
                { level: 3, name: 'Administrative Controls', desc: 'Procedures, training, signage', classes: 'Class 2-4' },
                { level: 4, name: 'Personal Protective Equipment', desc: 'Eye protection, protective clothing', classes: 'Class 3B-4' },
              ].map((item, index) => (
                <motion.div
                  key={item.level}
                  className={`p-3 rounded-lg border-l-4 ${
                    item.level === 1 ? 'border-l-emerald-500 bg-emerald-50' :
                    item.level === 2 ? 'border-l-blue-500 bg-blue-50' :
                    item.level === 3 ? 'border-l-amber-500 bg-amber-50' :
                    'border-l-red-500 bg-red-50'
                  }`}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, x: 5 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{item.name}</div>
                      <div className="text-sm text-muted-foreground">{item.desc}</div>
                    </div>
                    <Badge variant="outline">Applies: {item.classes}</Badge>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

type SectionId = 'overview' | 'ael' | 'examples' | 'controls';

const SECTIONS: { id: SectionId; title: string; description: string; icon: React.ReactNode }[] = [
  { id: 'overview', title: 'Classification Overview', description: 'All 7 laser classes with interactive comparison', icon: <Target className="w-4 h-4" /> },
  { id: 'ael', title: 'AEL Calculator', description: 'Accessible Emission Limits and calculations', icon: <Zap className="w-4 h-4" /> },
  { id: 'examples', title: 'Real-World Examples', description: 'Sorting games and classification wizard', icon: <Sparkles className="w-4 h-4" /> },
  { id: 'controls', title: 'Control Measures', description: 'Safety controls required by class', icon: <Shield className="w-4 h-4" /> },
];

export default function Module2_ClassificationSystem() {
  const [activeSection, setActiveSection] = useState<SectionId>('overview');
  const [completedSections, setCompletedSections] = useState<Set<SectionId>>(new Set());

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
      default:
        return null;
    }
  };

  return (
    <motion.div 
      className="space-y-6 max-w-5xl mx-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Module Header */}
      <motion.div 
        className="text-center space-y-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold text-foreground">Module 2: Laser Classification System</h1>
        <p className="text-muted-foreground">
          Understanding laser classes, AEL calculations, and safety requirements
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
      >
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Module Progress</span>
                <motion.span 
                  className="font-medium"
                  key={progress}
                  initial={{ scale: 1.5 }}
                  animate={{ scale: 1 }}
                >
                  {Math.round(progress)}%
                </motion.span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: 'easeOut' }}
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{completedSections.size} of {SECTIONS.length} sections completed</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Navigation */}
      <motion.div 
        className="flex flex-wrap gap-2"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {SECTIONS.map((section, index) => (
          <motion.button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border transition-all ${
              activeSection === section.id
                ? 'border-primary bg-primary text-primary-foreground'
                : completedSections.has(section.id)
                ? 'border-green-500 bg-green-50 dark:bg-green-950/30 text-green-800 dark:text-green-200'
                : 'border-border hover:border-primary/50'
            }`}
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {completedSections.has(section.id) && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <CheckCircle2 className="w-4 h-4" />
              </motion.span>
            )}
            {section.icon}
            <span className="font-medium">{section.title}</span>
          </motion.button>
        ))}
      </motion.div>

      {/* Active Section Description */}
      <motion.div 
        className="text-sm text-muted-foreground"
        key={activeSection}
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
      >
        {SECTIONS.find(s => s.id === activeSection)?.description}
      </motion.div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={activeSection}
          className="min-h-[400px]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderSection()}
        </motion.div>
      </AnimatePresence>

      {/* Section Actions */}
      <motion.div 
        className="flex justify-between"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <Button
          variant="outline"
          onClick={() => {
            const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
            if (currentIndex > 0) {
              setActiveSection(SECTIONS[currentIndex - 1].id);
            }
          }}
          disabled={activeSection === 'overview'}
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
        >
          {completedSections.has(activeSection) ? 'Next →' : 'Mark Complete & Continue →'}
        </Button>
      </motion.div>
    </motion.div>
  );
}
