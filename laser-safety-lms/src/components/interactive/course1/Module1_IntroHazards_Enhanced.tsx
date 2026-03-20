'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { 
  Lightbulb, 
  Zap, 
  Target, 
  Waves, 
  Eye, 
  Shield, 
  AlertTriangle,
  Sun,
  Radio,
  Microscope,
  ArrowRight,
  Info,
  ChevronRight,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Section = 'properties' | 'spectrum' | 'interactions' | 'hazards';
type LightType = 'laser' | 'regular';
type ReflectionType = 'specular' | 'diffuse' | 'partial';
type EyeStructure = 'cornea' | 'lens' | 'retina' | 'vitreous';

interface WavelengthData {
  nm: number;
  name: string;
  color: string;
  laserTypes: string[];
  penetration: string;
  mpe: string;
  hazard: string;
}

interface SpectrumRegion {
  name: string;
  range: string;
  nmRange: [number, number];
  color: string;
  description: string;
  laserTypes: string[];
  hazard: string;
}

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

const cardHoverVariants = {
  rest: { scale: 1, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' },
  hover: { 
    scale: 1.02, 
    boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
    transition: { duration: 0.3, ease: 'easeOut' }
  }
};

const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const expandVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: 'auto', 
    opacity: 1,
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] }
  },
  exit: { 
    height: 0, 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const WAVELENGTH_DATA: WavelengthData[] = [
  { nm: 193, name: 'Deep UV', color: '#6B46C1', laserTypes: ['ArF Excimer'], penetration: 'Absorbed by cornea', mpe: '3 mJ/cm²', hazard: 'Corneal burn, photokeratitis' },
  { nm: 248, name: 'UV-C', color: '#7C3AED', laserTypes: ['KrF Excimer'], penetration: 'Absorbed by cornea', mpe: '3 mJ/cm²', hazard: 'Corneal burn, welders flash' },
  { nm: 308, name: 'UV-B', color: '#8B5CF6', laserTypes: ['XeCl Excimer'], penetration: 'Cornea, some lens', mpe: '3 mJ/cm²', hazard: 'Corneal burn, cataract risk' },
  { nm: 355, name: 'UV-A', color: '#A78BFA', laserTypes: ['Nd:YAG 3rd Harmonic'], penetration: 'Passes cornea, lens absorption', mpe: '1 mJ/cm²', hazard: 'Lens damage, cataract' },
  { nm: 405, name: 'Violet', color: '#8B5CF6', laserTypes: ['Diode lasers'], penetration: 'Reaches retina', mpe: '0.1 µW/cm²', hazard: 'Retinal damage (blue light hazard)' },
  { nm: 445, name: 'Blue', color: '#3B82F6', laserTypes: ['GaN Diode'], penetration: 'Retinal focus', mpe: '0.1 µW/cm²', hazard: 'Retinal burn, photochemical damage' },
  { nm: 488, name: 'Cyan', color: '#06B6D4', laserTypes: ['Argon Ion'], penetration: 'Peak retinal sensitivity', mpe: '0.1 µW/cm²', hazard: 'Retinal burn' },
  { nm: 532, name: 'Green', color: '#22C55E', laserTypes: ['Nd:YAG 2nd Harmonic', 'DPSS'], penetration: 'Retinal focus', mpe: '0.1 µW/cm²', hazard: 'Retinal burn - most visible' },
  { nm: 594, name: 'Yellow', color: '#EAB308', laserTypes: ['HeNe', 'Dye lasers'], penetration: 'Retinal focus', mpe: '0.1 µW/cm²', hazard: 'Retinal burn' },
  { nm: 632, name: 'Red', color: '#EF4444', laserTypes: ['HeNe', 'Diode'], penetration: 'Retinal focus', mpe: '0.1 µW/cm²', hazard: 'Retinal burn' },
  { nm: 694, name: 'Deep Red', color: '#DC2626', laserTypes: ['Ruby Laser'], penetration: 'Retinal focus', mpe: '0.1 µW/cm²', hazard: 'Retinal burn' },
  { nm: 755, name: 'Near-IR', color: '#991B1B', laserTypes: ['Alexandrite'], penetration: 'Invisible retinal hazard', mpe: '0.1 µW/cm²', hazard: 'Retinal damage (invisible!)' },
  { nm: 808, name: 'Near-IR', color: '#7F1D1D', laserTypes: ['Diode lasers'], penetration: 'Invisible retinal hazard', mpe: '0.1 µW/cm²', hazard: 'Retinal damage - most dangerous' },
  { nm: 1064, name: 'Near-IR', color: '#450A0A', laserTypes: ['Nd:YAG', 'Fiber lasers'], penetration: 'Retinal focus (water absorption begins)', mpe: '0.1 µW/cm²', hazard: 'Retinal damage - high power industrial' },
  { nm: 1320, name: 'Near-IR', color: '#292524', laserTypes: ['Nd:YAG'], penetration: 'Partial corneal absorption', mpe: '0.1 µW/cm²', hazard: 'Retinal/corneal hazard boundary' },
  { nm: 1550, name: 'SWIR', color: '#57534E', laserTypes: ['Eye-safe lasers', 'Fiber'], penetration: 'Primarily corneal', mpe: '10 mW/cm²', hazard: 'Corneal burn (retina safe)' },
  { nm: 2940, name: 'Mid-IR', color: '#78716C', laserTypes: ['Er:YAG'], penetration: 'Absorbed by water in cornea', mpe: '10 mW/cm²', hazard: 'Corneal burn, steam pop' },
  { nm: 10600, name: 'Far-IR', color: '#A8A29E', laserTypes: ['CO2 Laser'], penetration: 'Surface absorption only', mpe: '100 mW/cm²', hazard: 'Corneal burn, skin burn' },
];

const SPECTRUM_REGIONS: SpectrumRegion[] = [
  { name: 'Gamma/X-Rays', range: '< 10 nm', nmRange: [0, 10], color: '#1e1b4b', description: 'Ionizing radiation - not laser territory', laserTypes: ['X-ray Free Electron Lasers'], hazard: 'Ionization damage, cancer risk' },
  { name: 'Extreme UV', range: '10-100 nm', nmRange: [10, 100], color: '#312e81', description: 'Absorbed by all materials', laserTypes: ['EUV Lithography'], hazard: 'Severe tissue damage' },
  { name: 'Vacuum UV', range: '100-200 nm', nmRange: [100, 200], color: '#4338ca', description: 'Absorbed by air', laserTypes: ['Excimer'], hazard: 'Corneal damage' },
  { name: 'UV-C', range: '200-280 nm', nmRange: [200, 280], color: '#5b21b6', description: 'Germicidal range', laserTypes: ['Excimer'], hazard: 'Photokeratitis (welder\'s flash)' },
  { name: 'UV-B', range: '280-315 nm', nmRange: [280, 315], color: '#7c3aed', description: 'Partially absorbed by ozone', laserTypes: ['Excimer'], hazard: 'Corneal burn, skin cancer risk' },
  { name: 'UV-A', range: '315-400 nm', nmRange: [315, 400], color: '#8b5cf6', description: 'Near-ultraviolet', laserTypes: ['Nd:YAG 3rd harmonic', 'HeCd'], hazard: 'Lens cataracts, retinal damage' },
  { name: 'VISIBLE', range: '400-700 nm', nmRange: [400, 700], color: 'linear-gradient(90deg, #3b82f6, #22c55e, #eab308, #ef4444)', description: 'Human vision range', laserTypes: ['HeNe', 'Argon', 'DPSS', 'Diode'], hazard: 'Retinal burns - MOST DANGEROUS' },
  { name: 'Near-IR', range: '700-1400 nm', nmRange: [700, 1400], color: '#7f1d1d', description: 'Retinal hazard region (invisible!)', laserTypes: ['Nd:YAG', 'Diode', 'Fiber'], hazard: 'INVISIBLE retinal damage - EXTREME HAZARD' },
  { name: 'SWIR', range: '1.4-3.0 µm', nmRange: [1400, 3000], color: '#57534e', description: 'Corneal hazard region', laserTypes: ['Er:Glass', 'Ho:YAG'], hazard: 'Corneal burns, water absorption' },
  { name: 'Mid-IR', range: '3-50 µm', nmRange: [3000, 50000], color: '#78716c', description: 'Molecular fingerprint region', laserTypes: ['CO2', 'CO', 'Quantum Cascade'], hazard: 'Corneal and skin burns' },
  { name: 'Far-IR', range: '> 50 µm', nmRange: [50000, 1000000], color: '#a8a29e', description: 'Terahertz overlap', laserTypes: ['Free Electron Lasers', 'Molecular lasers'], hazard: 'Thermal skin burns' },
];

const EYE_ANATOMY = {
  cornea: {
    name: 'Cornea',
    description: 'Clear front surface of the eye',
    vulnerableTo: 'UV (200-315nm) and Far-IR (>1400nm)',
    effect: 'Photokeratitis (painful inflammation), corneal burns',
    healing: 'Heals in 24-48 hours for minor injuries',
    mpeNote: 'MPE: 3-10 mJ/cm² depending on wavelength'
  },
  lens: {
    name: 'Lens',
    description: 'Focuses light onto the retina',
    vulnerableTo: 'UV-A (315-400nm) and visible light',
    effect: 'Cataracts (clouding of lens), permanent damage',
    healing: 'Does not regenerate - surgical replacement needed',
    mpeNote: 'Cumulative UV exposure causes premature cataracts'
  },
  retina: {
    name: 'Retina',
    description: 'Light-sensitive tissue at back of eye',
    vulnerableTo: 'Visible and Near-IR (400-1400nm)',
    effect: 'Permanent blind spots, scotomas, vision loss',
    healing: 'NO regeneration - damage is FOREVER',
    mpeNote: 'MPE: 0.1-1 µW/cm² (extremely sensitive)'
  },
  vitreous: {
    name: 'Vitreous Humor',
    description: 'Clear gel filling the eye',
    vulnerableTo: 'High-power visible lasers',
    effect: 'Vitreous hemorrhage, floaters',
    healing: 'Limited - may require surgical intervention',
    mpeNote: 'Secondary damage from retinal injury'
  }
};

// ============================================================================
// SECTION 1: LASER PROPERTIES COMPONENT
// ============================================================================

function LaserPropertiesSection() {
  const [activeProperty, setActiveProperty] = useState<'coherence' | 'monochromaticity' | 'directionality'>('coherence');
  const [lightType, setLightType] = useState<LightType>('regular');

  const properties = {
    coherence: {
      title: 'Coherence',
      description: 'Waves are in-phase (synchronized)',
      icon: Waves,
      detail: 'Laser light waves are coherent - they maintain a constant phase relationship. This allows them to interfere constructively, producing intense, focused beams.'
    },
    monochromaticity: {
      title: 'Monochromaticity',
      description: 'Single wavelength/color',
      icon: Sun,
      detail: 'Laser light contains essentially one wavelength, giving it pure color. Regular light contains many wavelengths mixed together.'
    },
    directionality: {
      title: 'Directionality (Low Divergence)',
      description: 'Beam stays narrow over distance',
      icon: Target,
      detail: 'Laser beams diverge very little, maintaining high intensity over long distances. Regular light spreads out rapidly, reducing intensity with distance.'
    }
  };

  const currentProp = properties[activeProperty];
  const Icon = currentProp.icon;

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Property Selector */}
      <motion.div className="grid grid-cols-3 gap-2" variants={itemVariants}>
        {(Object.keys(properties) as Array<keyof typeof properties>).map((key) => {
          const PropIcon = properties[key].icon;
          const isActive = activeProperty === key;
          return (
            <motion.div
              key={key}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setActiveProperty(key)}
                className="h-auto py-3 flex flex-col items-center gap-2 w-full relative overflow-hidden"
              >
                <motion.div
                  initial={false}
                  animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <PropIcon className="w-5 h-5" />
                </motion.div>
                <span className="text-xs">{properties[key].title}</span>
                {isActive && (
                  <motion.div
                    layoutId="activeProperty"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Comparison Toggle */}
      <motion.div className="flex justify-center gap-2" variants={itemVariants}>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={lightType === 'regular' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLightType('regular')}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Lightbulb className="w-4 h-4" />
            Regular Light
          </Button>
        </motion.div>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Button
            variant={lightType === 'laser' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setLightType('laser')}
            className="flex items-center gap-2 transition-all duration-300"
          >
            <Zap className="w-4 h-4" />
            Laser Light
          </Button>
        </motion.div>
      </motion.div>

      {/* Visual Demonstration */}
      <motion.div variants={itemVariants}>
        <Card className="overflow-hidden">
          <CardHeader className="pb-2">
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              key={activeProperty}
              transition={{ duration: 0.3 }}
            >
              <Icon className="w-5 h-5 text-primary" />
              <CardTitle className="text-base">{currentProp.title}</CardTitle>
            </motion.div>
            <CardDescription>{currentProp.description}</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Animated Visualization */}
            <motion.div 
              className="h-48 bg-muted/30 rounded-lg relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                {activeProperty === 'coherence' && (
                  <motion.div
                    key="coherence"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <CoherenceVisualizer type={lightType} />
                  </motion.div>
                )}
                {activeProperty === 'monochromaticity' && (
                  <motion.div
                    key="monochromaticity"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MonochromaticityVisualizer type={lightType} />
                  </motion.div>
                )}
                {activeProperty === 'directionality' && (
                  <motion.div
                    key="directionality"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <DirectionalityVisualizer type={lightType} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
            
            <motion.div 
              className="mt-4 p-3 bg-muted/50 rounded-lg"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <p className="text-sm text-muted-foreground">{currentProp.detail}</p>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Key Differences Summary */}
      <motion.div className="grid grid-cols-2 gap-4" variants={itemVariants}>
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          transition={{ duration: 0.2 }}
        >
          <Card className={`transition-all duration-300 ${lightType === 'regular' ? 'ring-2 ring-primary shadow-lg' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Lightbulb className="w-4 h-4 text-amber-500" />
                <h4 className="font-bold text-sm">Regular Light</h4>
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>• Random phase waves</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>• Multiple wavelengths</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>• Spreads rapidly</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>• Lower intensity</motion.li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div
          whileHover={{ scale: 1.02, boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
          transition={{ duration: 0.2 }}
        >
          <Card className={`transition-all duration-300 ${lightType === 'laser' ? 'ring-2 ring-primary shadow-lg' : ''}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-4 h-4 text-red-500" />
                <h4 className="font-bold text-sm">Laser Light</h4>
              </div>
              <ul className="text-xs space-y-1 text-muted-foreground">
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>• In-phase (coherent)</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 }}>• Single wavelength</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>• Minimal divergence</motion.li>
                <motion.li initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}>• High intensity</motion.li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

// Visual Components for Properties with Animations
function CoherenceVisualizer({ type }: { type: LightType }) {
  return (
    <svg className="w-full h-full" viewBox="0 0 400 150">
      <defs>
        <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" className="text-muted-foreground" />
        </marker>
      </defs>
      
      {/* Source */}
      <circle cx="30" cy="75" r="15" fill={type === 'laser' ? '#ef4444' : '#eab308'} />
      <text x="30" y="110" textAnchor="middle" className="text-xs fill-muted-foreground">Source</text>
      
      {type === 'laser' ? (
        // Coherent waves - aligned
        <>
          {[40, 60, 80, 100].map((y, i) => (
            <motion.path
              key={i}
              d={`M 50 ${y} Q 100 ${y - 15} 150 ${y} Q 200 ${y + 15} 250 ${y} Q 300 ${y - 15} 350 ${y}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 1, delay: i * 0.1, ease: 'easeOut' }}
            />
          ))}
          <motion.text 
            x="200" 
            y="130" 
            textAnchor="middle" 
            className="text-xs fill-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >All waves in phase</motion.text>
        </>
      ) : (
        // Incoherent waves - random
        <>
          {[35, 55, 75, 95, 115].map((y, i) => (
            <motion.path
              key={i}
              d={`M 50 ${y} Q ${100 + Math.random() * 50} ${y - 20 + Math.random() * 40} 200 ${y + Math.random() * 40 - 20} Q ${250 + Math.random() * 50} ${y - 20 + Math.random() * 40} 350 ${y}`}
              fill="none"
              stroke="#eab308"
              strokeWidth="1.5"
              opacity="0.7"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 0.7 }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
            />
          ))}
          <motion.text 
            x="200" 
            y="130" 
            textAnchor="middle" 
            className="text-xs fill-amber-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >Random phases</motion.text>
        </>
      )}
    </svg>
  );
}

function MonochromaticityVisualizer({ type }: { type: LightType }) {
  const laserColors = ['#ef4444'];
  const regularColors = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#06b6d4'];
  
  return (
    <svg className="w-full h-full" viewBox="0 0 400 150">
      {/* Prism or dispersion element */}
      <polygon points="180,50 220,75 180,100" fill="#64748b" opacity="0.5" />
      
      {type === 'laser' ? (
        // Single color
        <>
          <motion.line 
            x1="20" y1="75" x2="180" y2="75" 
            stroke="#ef4444" 
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.line 
            x1="220" y1="75" x2="380" y2="75" 
            stroke="#ef4444" 
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          <motion.text 
            x="200" 
            y="130" 
            textAnchor="middle" 
            className="text-xs fill-primary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >Single wavelength: 632.8 nm</motion.text>
          <motion.circle 
            cx="300" cy="75" r="20" 
            fill="#ef4444" 
            opacity="0.3"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.8, type: 'spring' }}
          />
          <text x="300" y="80" textAnchor="middle" className="text-xs fill-red-400 font-bold">RED</text>
        </>
      ) : (
        // Multiple colors / white light dispersion
        <>
          <motion.line 
            x1="20" y1="75" x2="180" y2="75" 
            stroke="currentColor" className="stroke-foreground" 
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          {regularColors.map((color, i) => (
            <motion.line
              key={i}
              x1="220"
              y1="75"
              x2="380"
              y2={45 + i * 12}
              stroke={color}
              strokeWidth="3"
              initial={{ pathLength: 0, opacity: 0 }}
              animate={{ pathLength: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 + i * 0.1 }}
            />
          ))}
          <motion.text 
            x="200" 
            y="130" 
            textAnchor="middle" 
            className="text-xs fill-amber-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >All wavelengths present</motion.text>
        </>
      )}
    </svg>
  );
}

function DirectionalityVisualizer({ type }: { type: LightType }) {
  return (
    <svg className="w-full h-full" viewBox="0 0 400 150">
      {/* Source */}
      <circle cx="40" cy="75" r="12" fill={type === 'laser' ? '#ef4444' : '#eab308'} />
      
      {/* Target at distance */}
      <rect x="350" y="60" width="4" height="30" fill="#64748b" />
      
      {type === 'laser' ? (
        // Narrow beam
        <>
          <motion.path 
            d="M 52 70 L 350 67 L 350 83 L 52 80 Z" 
            fill="#ef4444" 
            opacity="0.3"
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 0.3, scaleX: 1 }}
            transition={{ duration: 0.5 }}
            style={{ transformOrigin: '52px 75px' }}
          />
          <motion.line 
            x1="52" y1="75" x2="350" y2="75" 
            stroke="#ef4444" 
            strokeWidth="3"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          <motion.text 
            x="200" y="30" 
            textAnchor="middle" 
            className="text-xs fill-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >Beam divergence: ~1 mrad</motion.text>
          <motion.text 
            x="200" y="130" 
            textAnchor="middle" 
            className="text-xs fill-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >Maintains intensity over distance</motion.text>
        </>
      ) : (
        // Wide spread
        <>
          <motion.path 
            d="M 52 75 L 350 20 L 350 130 Z" 
            fill="#eab308" 
            opacity="0.2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            transition={{ duration: 0.5 }}
          />
          {[45, 60, 75, 90, 105].map((y, i) => (
            <motion.line 
              key={i} 
              x1="52" y1="75" x2="350" y2={y} 
              stroke="#eab308" 
              strokeWidth="1" 
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            />
          ))}
          <motion.text 
            x="200" y="30" 
            textAnchor="middle" 
            className="text-xs fill-amber-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >Beam divergence: ~180°</motion.text>
          <motion.text 
            x="200" y="130" 
            textAnchor="middle" 
            className="text-xs fill-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >Intensity decreases with 1/r²</motion.text>
        </>
      )}
    </svg>
  );
}

// ============================================================================
// SECTION 2: ELECTROMAGNETIC SPECTRUM
// ============================================================================

function SpectrumSection() {
  const [selectedRegion, setSelectedRegion] = useState<SpectrumRegion | null>(null);
  const [hoveredWavelength, setHoveredWavelength] = useState<number | null>(null);

  const displayStart = 200;
  const displayEnd = 1400;

  const getPositionPercent = (nm: number) => {
    return ((nm - displayStart) / (displayEnd - displayStart)) * 100;
  };

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Interactive Spectrum Bar */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Radio className="w-4 h-4" />
              Electromagnetic Spectrum
            </CardTitle>
            <CardDescription>Click on regions to explore laser types and hazards</CardDescription>
          </CardHeader>
          <CardContent>
            {/* Spectrum Visualization */}
            <div className="relative h-32 mb-4">
              {/* Background gradient showing actual spectrum */}
              <motion.div 
                className="absolute inset-0 rounded-lg"
                style={{
                  background: `linear-gradient(to right, 
                    #6B46C1 0%, 
                    #8B5CF6 ${getPositionPercent(300)}%, 
                    #3B82F6 ${getPositionPercent(400)}%, 
                    #22C55E ${getPositionPercent(532)}%, 
                    #EAB308 ${getPositionPercent(594)}%, 
                    #EF4444 ${getPositionPercent(632)}%, 
                    #7F1D1D ${getPositionPercent(750)}%,
                    #292524 ${getPositionPercent(1000)}%,
                    #78716c ${getPositionPercent(1400)}%
                  )`
                }}
                initial={{ opacity: 0, scaleX: 0 }}
                animate={{ opacity: 1, scaleX: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
              />
              
              {/* Region overlays */}
              {SPECTRUM_REGIONS.filter(r => r.nmRange[1] <= displayEnd).map((region, i) => {
                const left = getPositionPercent(region.nmRange[0]);
                const right = getPositionPercent(region.nmRange[1]);
                const isSelected = selectedRegion?.name === region.name;
                
                return (
                  <motion.button
                    key={i}
                    className={`absolute top-0 bottom-0 border-r border-white/20 transition-all ${
                      isSelected ? 'bg-white/30 ring-2 ring-white' : 'hover:bg-white/20'
                    }`}
                    style={{ left: `${left}%`, width: `${right - left}%` }}
                    onClick={() => setSelectedRegion(region)}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ backgroundColor: 'rgba(255,255,255,0.2)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="sr-only">{region.name}</span>
                  </motion.button>
                );
              })}
              
              {/* Wavelength markers */}
              {[200, 400, 532, 700, 1000, 1400].map((nm, i) => (
                <motion.div
                  key={nm}
                  className="absolute bottom-0 transform -translate-x-1/2"
                  style={{ left: `${getPositionPercent(nm)}%` }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + i * 0.05 }}
                >
                  <div className="h-2 w-px bg-white/50" />
                  <span className="text-[10px] text-white/70">{nm < 1000 ? nm : `${nm/1000}k`}</span>
                </motion.div>
              ))}
              
              {/* Laser wavelength markers */}
              {[193, 248, 355, 405, 445, 488, 532, 594, 632, 808, 1064].map((nm, i) => (
                <motion.div
                  key={nm}
                  className="absolute top-1 transform -translate-x-1/2 cursor-pointer group"
                  style={{ left: `${getPositionPercent(nm)}%` }}
                  onMouseEnter={() => setHoveredWavelength(nm)}
                  onMouseLeave={() => setHoveredWavelength(null)}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + i * 0.03 }}
                  whileHover={{ scale: 1.5 }}
                >
                  <div className="w-2 h-2 bg-background rounded-full shadow-lg" />
                  <AnimatePresence>
                    {hoveredWavelength === nm && (
                      <motion.div 
                        className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 5 }}
                      >
                        {nm} nm
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>

            {/* Region Labels */}
            <motion.div className="flex flex-wrap gap-2" variants={staggerContainer} initial="hidden" animate="visible">
              {SPECTRUM_REGIONS.slice(3, 10).map((region, i) => (
                <motion.div key={i} variants={itemVariants}>
                  <Badge
                    variant={selectedRegion?.name === region.name ? 'default' : 'secondary'}
                    className="cursor-pointer transition-all hover:scale-105"
                    onClick={() => setSelectedRegion(region)}
                  >
                    {region.name}
                  </Badge>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Selected Region Details */}
      <AnimatePresence mode="wait">
        {selectedRegion && (
          <motion.div
            key={selectedRegion.name}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="border-primary/50">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{selectedRegion.name}</CardTitle>
                    <CardDescription>{selectedRegion.range}</CardDescription>
                  </div>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', delay: 0.2 }}
                  >
                    <Badge variant={selectedRegion.name === 'VISIBLE' ? 'default' : 'destructive'}>
                      {selectedRegion.name === 'VISIBLE' ? 'Visible' : 'Invisible'}
                    </Badge>
                  </motion.div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">{selectedRegion.description}</p>
                
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h4 className="text-sm font-semibold mb-2">Common Laser Types:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedRegion.laserTypes.map((type, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.15 + i * 0.05 }}
                      >
                        <Badge variant="outline">{type}</Badge>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-sm font-semibold text-destructive">Hazard Warning</h4>
                    <p className="text-sm text-muted-foreground">{selectedRegion.hazard}</p>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Laser Types by Wavelength Quick Reference */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Microscope className="w-4 h-4" />
              Common Laser Wavelengths
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.div 
              className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {WAVELENGTH_DATA.slice(0, 12).map((data, i) => (
                <motion.div 
                  key={i} 
                  className="p-2 rounded border hover:bg-muted/50 transition-all cursor-pointer"
                  onClick={() => {
                    const region = SPECTRUM_REGIONS.find(r => 
                      data.nm >= r.nmRange[0] && data.nm <= r.nmRange[1]
                    );
                    if (region) setSelectedRegion(region);
                  }}
                  variants={itemVariants}
                  whileHover={{ scale: 1.02, boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center gap-2">
                    <motion.div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: data.color }}
                      whileHover={{ scale: 1.3 }}
                    />
                    <span className="font-mono">{data.nm} nm</span>
                  </div>
                  <div className="text-muted-foreground truncate">{data.laserTypes[0]}</div>
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
// SECTION 3: BEAM INTERACTIONS
// ============================================================================

function BeamInteractionsSection() {
  const [reflectionType, setReflectionType] = useState<ReflectionType>('specular');
  const [beamAngle, setBeamAngle] = useState(45);
  const [showHazardZone, setShowHazardZone] = useState(true);

  const reflectionData = {
    specular: {
      title: 'Specular Reflection',
      description: 'Smooth surfaces (mirrors, glass, polished metal)',
      hazard: 'EXTREME - Reflected beam nearly as dangerous as direct',
      examples: ['Mirrors', 'Windows', 'Polished metal', 'Water surfaces', 'Glossy floors'],
      divergence: 'Very low - beam stays concentrated'
    },
    diffuse: {
      title: 'Diffuse Reflection',
      description: 'Rough surfaces (concrete, matte paint, skin)',
      hazard: 'MODERATE to HIGH - Depends on laser power',
      examples: ['Concrete walls', 'Matte surfaces', 'Smoke/fog', 'Clothing', 'Skin'],
      divergence: 'High - beam scatters in many directions'
    },
    partial: {
      title: 'Mixed Reflection',
      description: 'Surfaces with both smooth and rough areas',
      hazard: 'UNPREDICTABLE - Can have specular "hot spots"',
      examples: ['Dusty mirrors', 'Scratched metal', 'Textured glass'],
      divergence: 'Variable - depends on surface quality'
    }
  };

  const currentReflection = reflectionData[reflectionType];

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Reflection Type Selector */}
      <motion.div className="grid grid-cols-3 gap-2" variants={itemVariants}>
        {(Object.keys(reflectionData) as ReflectionType[]).map((type) => (
          <motion.div
            key={type}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              variant={reflectionType === type ? 'default' : 'outline'}
              onClick={() => setReflectionType(type)}
              className="h-auto py-3 text-xs w-full transition-all duration-300"
            >
              {type === 'specular' ? 'Mirror-like' : type === 'diffuse' ? 'Scattered' : 'Mixed'}
            </Button>
          </motion.div>
        ))}
      </motion.div>

      {/* Interactive Beam Visualization */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentReflection.title}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.3 }}
              >
                <CardTitle className="text-base">{currentReflection.title}</CardTitle>
                <CardDescription>{currentReflection.description}</CardDescription>
              </motion.div>
            </AnimatePresence>
          </CardHeader>
          <CardContent>
            {/* Beam Path SVG */}
            <motion.div 
              className="h-56 bg-muted/30 rounded-lg relative overflow-hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={reflectionType}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="w-full h-full"
                >
                  <ReflectionVisualizer 
                    type={reflectionType} 
                    angle={beamAngle}
                    showHazard={showHazardZone}
                  />
                </motion.div>
              </AnimatePresence>
            </motion.div>

            {/* Controls */}
            <motion.div className="mt-4 space-y-4" variants={itemVariants}>
              <div>
                <label className="text-xs text-muted-foreground mb-1 block">
                  Beam Angle: {beamAngle}°
                </label>
                <Slider
                  value={[beamAngle]}
                  onValueChange={(v) => setBeamAngle(v[0])}
                  min={10}
                  max={80}
                  step={5}
                  className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                />
              </div>
              <motion.label 
                className="flex items-center gap-2 cursor-pointer"
                whileTap={{ scale: 0.98 }}
              >
                <Checkbox
                  checked={showHazardZone}
                  onCheckedChange={(checked) => setShowHazardZone(checked as boolean)}
                />
                <span className="text-xs text-muted-foreground">
                  Show hazard zones
                </span>
              </motion.label>
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Reflection Details */}
      <motion.div variants={itemVariants}>
        <Card className={reflectionType === 'specular' ? 'border-destructive' : ''}>
          <CardContent className="p-4 space-y-3">
            <motion.div 
              className={`flex items-start gap-2 p-3 rounded-lg ${
                reflectionType === 'specular' ? 'bg-destructive/20' : 'bg-muted/50'
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <AlertTriangle className={`w-5 h-5 shrink-0 ${
                reflectionType === 'specular' ? 'text-destructive' : 'text-amber-500'
              }`} />
              <div>
                <h4 className="text-sm font-semibold">Hazard Level</h4>
                <p className="text-sm text-muted-foreground">{currentReflection.hazard}</p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h4 className="text-sm font-semibold mb-2">Common Examples:</h4>
              <div className="flex flex-wrap gap-2">
                {currentReflection.examples.map((ex, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + i * 0.05 }}
                  >
                    <Badge variant="outline" className="text-xs">{ex}</Badge>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              className="text-xs text-muted-foreground"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <strong>Beam divergence after reflection:</strong> {currentReflection.divergence}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Absorption & Transmission Card */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Absorption & Transmission
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <motion.div 
              className="grid grid-cols-2 gap-3"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              <motion.div 
                className="p-3 bg-muted/30 rounded-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }}
              >
                <h4 className="text-sm font-semibold mb-1">Absorption</h4>
                <p className="text-xs text-muted-foreground">
                  Energy converted to heat. Depends on material and wavelength.
                </p>
              </motion.div>
              <motion.div 
                className="p-3 bg-muted/30 rounded-lg"
                variants={itemVariants}
                whileHover={{ scale: 1.02, backgroundColor: 'rgba(0,0,0,0.05)' }}
              >
                <h4 className="text-sm font-semibold mb-1">Transmission</h4>
                <p className="text-xs text-muted-foreground">
                  Passes through material (glass, clear plastics, water).
                </p>
              </motion.div>
            </motion.div>
            <motion.div 
              className="text-xs text-muted-foreground p-2 bg-amber-50 rounded-lg"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <strong>Key safety point:</strong> Never rely on &quot;clear&quot; materials for protection. 
              Many transparent materials transmit laser light, especially in the near-IR range.
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function ReflectionVisualizer({ 
  type, 
  angle, 
  showHazard 
}: { 
  type: ReflectionType; 
  angle: number;
  showHazard: boolean;
}) {
  // Calculate beam positions
  const sourceX = 50;
  const sourceY = 250;
  const surfaceX = 200;
  const surfaceY = 200;
  const surfaceLength = 150;
  
  const incidentAngle = (angle * Math.PI) / 180;
  const incidentEndX = surfaceX - Math.cos(incidentAngle) * 120;
  const incidentEndY = surfaceY - Math.sin(incidentAngle) * 120;
  
  const reflectedStartX = surfaceX;
  const reflectedStartY = surfaceY;
  
  return (
    <svg className="w-full h-full" viewBox="0 0 400 250">
      {/* Surface */}
      {type === 'specular' ? (
        <rect 
          x={surfaceX - 10} 
          y={surfaceY} 
          width={surfaceLength + 20} 
          height="50" 
          fill="#94a3b8" 
          opacity="0.5"
        />
      ) : type === 'diffuse' ? (
        <>
          <rect 
            x={surfaceX - 10} 
            y={surfaceY} 
            width={surfaceLength + 20} 
            height="50" 
            fill="#78716c" 
            opacity="0.5"
          />
          {[...Array(10)].map((_, i) => (
            <line
              key={i}
              x1={surfaceX + i * 15}
              y1={surfaceY}
              x2={surfaceX + i * 15 + Math.random() * 10 - 5}
              y2={surfaceY + 50}
              stroke="#57534e"
              strokeWidth="1"
            />
          ))}
        </>
      ) : (
        <>
          <rect 
            x={surfaceX - 10} 
            y={surfaceY} 
            width={surfaceLength + 20} 
            height="50" 
            fill="#64748b" 
            opacity="0.5"
          />
          <circle cx={surfaceX + 50} cy={surfaceY + 25} r="8" fill="#94a3b8" opacity="0.7" />
        </>
      )}
      
      {/* Surface label */}
      <text x={surfaceX + surfaceLength/2} y={surfaceY + 70} textAnchor="middle" className="text-xs fill-muted-foreground">
        {type === 'specular' ? 'Mirror Surface' : type === 'diffuse' ? 'Rough Surface' : 'Mixed Surface'}
      </text>
      
      {/* Incident beam */}
      <motion.line
        x1={sourceX}
        y1={sourceY}
        x2={incidentEndX}
        y2={incidentEndY}
        stroke="#ef4444"
        strokeWidth="3"
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Source */}
      <circle cx={sourceX} cy={sourceY} r="8" fill="#ef4444" />
      <text x={sourceX} y={sourceY + 20} textAnchor="middle" className="text-xs fill-muted-foreground">Laser</text>
      
      {/* Normal line (dashed) */}
      <line
        x1={surfaceX}
        y1={surfaceY}
        x2={surfaceX}
        y2={surfaceY - 80}
        stroke="#64748b"
        strokeWidth="1"
        strokeDasharray="4 2"
      />
      <text x={surfaceX - 5} y={surfaceY - 85} textAnchor="end" className="text-[10px] fill-muted-foreground">Normal</text>
      
      {/* Angle arc */}
      <path
        d={`M ${surfaceX - 30} ${surfaceY} A 30 30 0 0 0 ${surfaceX - Math.cos(incidentAngle) * 30} ${surfaceY - Math.sin(incidentAngle) * 30}`}
        fill="none"
        stroke="#64748b"
        strokeWidth="1"
      />
      <text x={surfaceX - 40} y={surfaceY - 15} className="text-xs fill-muted-foreground">{angle}°</text>
      
      {type === 'specular' ? (
        // Specular reflection - single reflected beam
        <>
          <motion.line
            x1={reflectedStartX}
            y1={reflectedStartY}
            x2={reflectedStartX + Math.cos(incidentAngle) * 120}
            y2={reflectedStartY - Math.sin(incidentAngle) * 120}
            stroke="#ef4444"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          {showHazard && (
            <motion.circle
              cx={reflectedStartX + Math.cos(incidentAngle) * 60}
              cy={reflectedStartY - Math.sin(incidentAngle) * 60}
              r="25"
              fill="#ef4444"
              opacity="0.2"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            />
          )}
        </>
      ) : type === 'diffuse' ? (
        // Diffuse reflection - scattered beams
        <>
          {[-30, -15, 0, 15, 30].map((offset, i) => {
            const refAngle = incidentAngle + (offset * Math.PI) / 180;
            const length = 80 - Math.abs(offset);
            return (
              <motion.line
                key={i}
                x1={reflectedStartX}
                y1={reflectedStartY}
                x2={reflectedStartX + Math.cos(refAngle) * length}
                y2={reflectedStartY - Math.sin(refAngle) * length}
                stroke="#ef4444"
                strokeWidth={2 - Math.abs(offset) / 30}
                opacity={1 - Math.abs(offset) / 40}
                markerEnd="url(#arrowhead)"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
              />
            );
          })}
          {showHazard && (
            <motion.ellipse
              cx={reflectedStartX + 50}
              cy={reflectedStartY - 30}
              rx="60"
              ry="40"
              fill="#eab308"
              opacity="0.15"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.6, type: 'spring' }}
            />
          )}
        </>
      ) : (
        // Mixed - some specular, some diffuse
        <>
          <motion.line
            x1={reflectedStartX}
            y1={reflectedStartY}
            x2={reflectedStartX + Math.cos(incidentAngle) * 100}
            y2={reflectedStartY - Math.sin(incidentAngle) * 100}
            stroke="#ef4444"
            strokeWidth="3"
            opacity="0.8"
            markerEnd="url(#arrowhead)"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          />
          {[-20, 0, 20].map((offset, i) => (
            <motion.line
              key={i}
              x1={reflectedStartX}
              y1={reflectedStartY}
              x2={reflectedStartX + Math.cos(incidentAngle + offset * Math.PI / 180) * 60}
              y2={reflectedStartY - Math.sin(incidentAngle + offset * Math.PI / 180) * 60}
              stroke="#ef4444"
              strokeWidth="1.5"
              opacity="0.5"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.05 }}
            />
          ))}
        </>
      )}
      
      {/* Legend */}
      {showHazard && (
        <g transform="translate(280, 20)">
          <circle cx="10" cy="10" r="8" fill="#ef4444" opacity="0.3" />
          <text x="25" y="14" className="text-xs fill-muted-foreground">Hazard zone</text>
        </g>
      )}
    </svg>
  );
}

// ============================================================================
// SECTION 4: WAVELENGTH & OCULAR HAZARDS
// ============================================================================

function OcularHazardsSection() {
  const [wavelength, setWavelength] = useState(532);
  const [selectedStructure, setSelectedStructure] = useState<EyeStructure>('retina');
  const [showPenetration, setShowPenetration] = useState(true);

  const currentData = WAVELENGTH_DATA.find(d => d.nm >= wavelength) || WAVELENGTH_DATA[WAVELENGTH_DATA.length - 1];

  return (
    <motion.div 
      className="space-y-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Wavelength Slider */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center justify-between">
              <span>Wavelength Explorer</span>
              <motion.div
                key={currentData.color}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring' }}
              >
                <Badge style={{ backgroundColor: currentData.color }}>
                  {wavelength} nm
                </Badge>
              </motion.div>
            </CardTitle>
            <CardDescription>{currentData.name}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <Slider
                value={[wavelength]}
                onValueChange={(v) => setWavelength(v[0])}
                min={200}
                max={11000}
                step={1}
                className="w-full py-2 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              />
            </motion.div>
            
            {/* Wavelength scale with key points */}
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>200nm</span>
              <span>400nm</span>
              <span>700nm</span>
              <span>1400nm</span>
              <span>10µm</span>
            </div>
            
            <motion.div 
              className="h-2 rounded-full"
              style={{
                background: `linear-gradient(to right, 
                  #6B46C1 0%, #8B5CF6 18%, 
                  #3B82F6 27%, #22C55E 45%, #EF4444 63%, 
                  #7F1D1D 72%, #292524 90%, #78716c 100%
                )`
              }}
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.8 }}
            />

            {/* Quick select buttons */}
            <motion.div 
              className="flex flex-wrap gap-1"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[193, 355, 532, 632, 808, 1064, 10600].map((nm, i) => (
                <motion.div key={nm} variants={itemVariants}>
                  <Button
                    variant={wavelength === nm ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs px-2 py-1 h-auto"
                    onClick={() => setWavelength(nm)}
                  >
                    {nm >= 1000 ? `${nm/1000}µm` : `${nm}nm`}
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Eye Anatomy Interactive Diagram */}
      <motion.div variants={itemVariants}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Eye className="w-4 h-4" />
              Eye Anatomy & Penetration
            </CardTitle>
            <CardDescription>
              Click on eye structures to learn about wavelength-specific damage
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row gap-4">
              {/* Eye Diagram */}
              <motion.div 
                className="flex-1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <EyeAnatomyDiagram 
                  wavelength={wavelength}
                  selectedStructure={selectedStructure}
                  onSelectStructure={setSelectedStructure}
                  showPenetration={showPenetration}
                />
              </motion.div>
              
              {/* Structure Details */}
              <motion.div 
                className="flex-1 space-y-3"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div className="flex gap-2" variants={itemVariants}>
                  {(Object.keys(EYE_ANATOMY) as EyeStructure[]).map((structure) => (
                    <motion.div key={structure} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                      <Button
                        variant={selectedStructure === structure ? 'default' : 'outline'}
                        size="sm"
                        className="text-xs w-full"
                        onClick={() => setSelectedStructure(structure)}
                      >
                        {EYE_ANATOMY[structure].name}
                      </Button>
                    </motion.div>
                  ))}
                </motion.div>
                
                <motion.div 
                  className="p-3 bg-muted/30 rounded-lg"
                  variants={itemVariants}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={selectedStructure}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                    >
                      <h4 className="font-semibold text-sm mb-1">
                        {EYE_ANATOMY[selectedStructure].name}
                      </h4>
                      <p className="text-xs text-muted-foreground mb-2">
                        {EYE_ANATOMY[selectedStructure].description}
                      </p>
                      
                      <div className="space-y-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">Vulnerable to: </span>
                          <span>{EYE_ANATOMY[selectedStructure].vulnerableTo}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Effect: </span>
                          <span>{EYE_ANATOMY[selectedStructure].effect}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Healing: </span>
                          <span>{EYE_ANATOMY[selectedStructure].healing}</span>
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </motion.div>
                
                <motion.label 
                  className="flex items-center gap-2 cursor-pointer"
                  variants={itemVariants}
                  whileTap={{ scale: 0.98 }}
                >
                  <Checkbox
                    checked={showPenetration}
                    onCheckedChange={(checked) => setShowPenetration(checked as boolean)}
                  />
                  <span className="text-xs text-muted-foreground cursor-pointer">
                    Show penetration depth
                  </span>
                </motion.label>
              </motion.div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* MPE & Hazard Info */}
      <motion.div variants={itemVariants}>
        <motion.div
          animate={{
            boxShadow: wavelength >= 400 && wavelength <= 1400 
              ? '0 0 20px rgba(239, 68, 68, 0.3)' 
              : '0 1px 3px rgba(0,0,0,0.1)'
          }}
          transition={{ duration: 0.3 }}
        >
          <Card className={wavelength >= 400 && wavelength <= 1400 ? 'border-destructive' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Hazard Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <motion.div 
                className="grid grid-cols-2 gap-4"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  className="p-3 bg-muted/30 rounded-lg"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">MPE Value</h4>
                  <motion.p 
                    className="text-lg font-mono"
                    key={currentData.mpe}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {currentData.mpe}
                  </motion.p>
                  <p className="text-xs text-muted-foreground">Maximum Permissible Exposure</p>
                </motion.div>
                <motion.div 
                  className="p-3 bg-muted/30 rounded-lg"
                  variants={itemVariants}
                  whileHover={{ scale: 1.02 }}
                >
                  <h4 className="text-xs font-semibold text-muted-foreground mb-1">Primary Hazard</h4>
                  <p className="text-sm">{currentData.penetration}</p>
                </motion.div>
              </motion.div>
              
              <motion.div 
                className={`p-3 rounded-lg flex items-start gap-2 ${
                  wavelength >= 400 && wavelength <= 1400 
                    ? 'bg-destructive/20' 
                    : wavelength < 400 || (wavelength > 1400 && wavelength < 3000)
                    ? 'bg-amber-500/20'
                    : 'bg-muted/50'
                }`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <AlertTriangle className={`w-5 h-5 shrink-0 ${
                  wavelength >= 400 && wavelength <= 1400 ? 'text-destructive' : 'text-yellow-500'
                }`} />
                <div>
                  <h4 className="text-sm font-semibold">
                    {wavelength >= 400 && wavelength <= 1400 
                      ? 'RETINAL HAZARD REGION' 
                      : wavelength < 400 
                      ? 'CORNEAL HAZARD (UV)'
                      : 'CORNEAL HAZARD (IR)'}
                  </h4>
                  <p className="text-sm text-muted-foreground">{currentData.hazard}</p>
                  <AnimatePresence>
                    {wavelength >= 700 && wavelength <= 1400 && (
                      <motion.p 
                        className="text-xs text-destructive mt-1 font-semibold"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                      >
                        ⚠️ INVISIBLE - Most dangerous! No blink reflex protection!
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Common lasers at this wavelength */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h4 className="text-sm font-semibold mb-2">Common Laser Types:</h4>
                <motion.div 
                  className="flex flex-wrap gap-2"
                  variants={staggerContainer}
                  initial="hidden"
                  animate="visible"
                >
                  {currentData.laserTypes.map((type, i) => (
                    <motion.div
                      key={i}
                      variants={itemVariants}
                      whileHover={{ scale: 1.1 }}
                    >
                      <Badge variant="secondary">{type}</Badge>
                    </motion.div>
                  ))}
                </motion.div>
              </motion.div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

function EyeAnatomyDiagram({ 
  wavelength, 
  selectedStructure, 
  onSelectStructure,
  showPenetration
}: { 
  wavelength: number;
  selectedStructure: EyeStructure;
  onSelectStructure: (s: EyeStructure) => void;
  showPenetration: boolean;
}) {
  const affectsCornea = wavelength < 400 || wavelength > 1400;
  const affectsLens = wavelength >= 300 && wavelength < 400;
  const affectsRetina = wavelength >= 400 && wavelength <= 1400;
  
  const getStructureColor = (structure: EyeStructure) => {
    if (selectedStructure === structure) return '#3b82f6';
    switch (structure) {
      case 'cornea': return affectsCornea ? '#ef4444' : '#64748b';
      case 'lens': return affectsLens ? '#ef4444' : '#64748b';
      case 'retina': return affectsRetina ? '#ef4444' : '#64748b';
      default: return '#64748b';
    }
  };

  return (
    <svg className="w-full h-48" viewBox="0 0 200 120">
      {/* Sclera (white of eye) */}
      <ellipse cx="100" cy="60" rx="90" ry="50" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
      
      {/* Cornea */}
      <motion.path
        d="M 30 60 Q 30 20 80 35"
        fill="none"
        stroke={getStructureColor('cornea')}
        strokeWidth={selectedStructure === 'cornea' ? 4 : 2}
        className="cursor-pointer"
        onClick={() => onSelectStructure('cornea')}
        animate={{ 
          opacity: affectsCornea && showPenetration ? 1 : 0.7,
          strokeWidth: selectedStructure === 'cornea' ? 4 : 2
        }}
        whileHover={{ strokeWidth: 4 }}
      />
      
      {/* Iris */}
      <circle cx="85" cy="60" r="25" fill="#3b82f6" opacity="0.3" />
      
      {/* Pupil */}
      <circle cx="85" cy="60" r="12" fill="#1e293b" />
      
      {/* Lens */}
      <motion.ellipse 
        cx="110" cy="60" rx="8" ry="20" 
        fill={getStructureColor('lens')}
        className="cursor-pointer"
        onClick={() => onSelectStructure('lens')}
        animate={{
          opacity: affectsLens && showPenetration ? 0.8 : 0.4
        }}
        whileHover={{ opacity: 0.9 }}
      />
      
      {/* Vitreous humor */}
      <motion.ellipse 
        cx="140" cy="60" rx="35" ry="30" 
        fill="#e2e8f0" 
        className="cursor-pointer"
        onClick={() => onSelectStructure('vitreous')}
        animate={{
          stroke: selectedStructure === 'vitreous' ? '#3b82f6' : 'none',
          strokeWidth: selectedStructure === 'vitreous' ? 2 : 0
        }}
        whileHover={{ stroke: '#3b82f6', strokeWidth: 2 }}
      />
      
      {/* Retina */}
      <motion.path
        d="M 170 30 Q 185 60 170 90"
        fill="none"
        stroke={getStructureColor('retina')}
        strokeWidth={selectedStructure === 'retina' ? 4 : 3}
        className="cursor-pointer"
        onClick={() => onSelectStructure('retina')}
        animate={{
          opacity: affectsRetina && showPenetration ? 1 : 0.5
        }}
        whileHover={{ strokeWidth: 4 }}
      />
      
      {/* Optic nerve */}
      <path d="M 185 60 L 195 60" stroke="#94a3b8" strokeWidth="4" strokeLinecap="round" />
      
      {/* Incoming beam */}
      <motion.line 
        x1="10" y1="60" x2="73" y2="60" 
        stroke="#ef4444" 
        strokeWidth="3" 
        markerEnd="url(#arrowhead)"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
      />
      
      {/* Penetration visualization */}
      <AnimatePresence>
        {showPenetration && (
          <>
            {affectsCornea && (
              <motion.path 
                d="M 30 45 L 50 45 L 50 75 L 30 75" 
                fill="#ef4444" 
                opacity="0.2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.2 }}
                exit={{ opacity: 0 }}
              />
            )}
            {affectsLens && (
              <motion.ellipse 
                cx="110" cy="60" rx="10" ry="22" 
                fill="#ef4444" 
                opacity="0.2"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 0.2, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
              />
            )}
            {affectsRetina && (
              <>
                <motion.line 
                  x1="73" y1="60" x2="170" y2="60" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  opacity="0.5" 
                  strokeDasharray="4 2"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5 }}
                />
                <motion.circle 
                  cx="170" cy="60" r="8" 
                  fill="#ef4444" 
                  opacity="0.3"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.3, type: 'spring' }}
                />
              </>
            )}
          </>
        )}
      </AnimatePresence>
      
      {/* Labels */}
      <text x="35" y="30" className="text-[8px] fill-muted-foreground">Cornea</text>
      <text x="100" y="30" className="text-[8px] fill-muted-foreground">Lens</text>
      <text x="160" y="25" className="text-[8px] fill-muted-foreground">Retina</text>
      
      {/* Legend */}
      <g transform="translate(5, 100)">
        <rect x="0" y="0" width="8" height="8" fill="#ef4444" opacity="0.5" />
        <text x="12" y="7" className="text-[8px] fill-muted-foreground">Affected</text>
        <rect x="50" y="0" width="8" height="8" fill="#64748b" opacity="0.5" />
        <text x="62" y="7" className="text-[8px] fill-muted-foreground">Transparent</text>
      </g>
    </svg>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Module1_IntroHazards() {
  const [activeSection, setActiveSection] = useState<Section>('properties');
  const [completedSections, setCompletedSections] = useState<Set<Section>>(new Set());

  const sections: { id: Section; title: string; icon: React.ElementType; description: string }[] = [
    { 
      id: 'properties', 
      title: 'Laser Properties', 
      icon: Lightbulb,
      description: 'Coherence, Monochromaticity, Directionality'
    },
    { 
      id: 'spectrum', 
      title: 'EM Spectrum', 
      icon: Radio,
      description: 'Where lasers fit & laser types by wavelength'
    },
    { 
      id: 'interactions', 
      title: 'Beam Interactions', 
      icon: Sparkles,
      description: 'Reflection types, absorption & transmission'
    },
    { 
      id: 'hazards', 
      title: 'Ocular Hazards', 
      icon: Eye,
      description: 'Penetration depths, eye anatomy, MPE values'
    },
  ];

  const markComplete = (section: Section) => {
    setCompletedSections(prev => new Set([...prev, section]));
  };

  const progress = (completedSections.size / sections.length) * 100;

  return (
    <motion.div 
      className="space-y-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Module Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="bg-gradient-to-r from-red-950/50 to-orange-950/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <motion.div 
                className="p-2 bg-red-500/20 rounded-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: 'spring' }}
              >
                <Zap className="w-6 h-6 text-red-400" />
              </motion.div>
              <div>
                <h2 className="text-lg font-bold text-foreground">Module 1: Introduction to Laser Hazards</h2>
                <p className="text-sm text-muted-foreground">
                  Interactive exploration of laser fundamentals and biological hazards
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Section Navigation */}
      <motion.div 
        className="grid grid-cols-2 md:grid-cols-4 gap-2"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isComplete = completedSections.has(section.id);
          
          return (
            <motion.div
              key={section.id}
              variants={itemVariants}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setActiveSection(section.id)}
                className="h-auto py-3 flex flex-col items-center gap-2 text-left w-full relative overflow-hidden"
              >
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={isActive ? { scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 0.3 }}
                  >
                    <Icon className="w-4 h-4" />
                  </motion.div>
                  <AnimatePresence>
                    {isComplete && (
                      <motion.span 
                        className="text-green-500"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </div>
                <div>
                  <div className="text-xs font-semibold">{section.title}</div>
                  <div className="text-[10px] text-muted-foreground hidden sm:block">
                    {section.description}
                  </div>
                </div>
                {isActive && (
                  <motion.div
                    layoutId="activeSection"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary-foreground"
                    transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                  />
                )}
              </Button>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Progress Indicator */}
      <motion.div 
        className="flex items-center gap-2 text-xs text-muted-foreground"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <span>Progress:</span>
        <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <span>{completedSections.size}/{sections.length}</span>
      </motion.div>

      {/* Section Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeSection}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <motion.div 
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {(() => {
                    const Icon = sections.find(s => s.id === activeSection)?.icon || Lightbulb;
                    return <Icon className="w-5 h-5 text-primary" />;
                  })()}
                  <CardTitle>
                    {sections.find(s => s.id === activeSection)?.title}
                  </CardTitle>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => markComplete(activeSection)}
                    className="relative overflow-hidden"
                  >
                    <motion.span
                      initial={false}
                      animate={completedSections.has(activeSection) ? { y: 0 } : { y: 0 }}
                    >
                      {completedSections.has(activeSection) ? 'Completed ✓' : 'Mark Complete'}
                    </motion.span>
                  </Button>
                </motion.div>
              </div>
            </CardHeader>
            <CardContent>
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                >
                  {activeSection === 'properties' && <LaserPropertiesSection />}
                  {activeSection === 'spectrum' && <SpectrumSection />}
                  {activeSection === 'interactions' && <BeamInteractionsSection />}
                  {activeSection === 'hazards' && <OcularHazardsSection />}
                </motion.div>
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Key Takeaways */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <Card className="bg-muted/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Info className="w-4 h-4" />
              Key Safety Takeaways
            </CardTitle>
          </CardHeader>
          <CardContent>
            <motion.ul 
              className="space-y-2 text-sm"
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
            >
              {[
                'Laser light is coherent, monochromatic, and directional - making it far more hazardous than regular light',
                'Visible (400-700nm) and Near-IR (700-1400nm) lasers pose the greatest retinal hazard',
                'Specular reflections from mirrors and shiny surfaces are nearly as dangerous as direct beams',
                'Near-IR lasers (755-1400nm) are especially dangerous because they\'re invisible - no blink reflex protection!',
                'Retinal damage is permanent - the retina cannot regenerate damaged tissue'
              ].map((text, index) => (
                <motion.li 
                  key={index} 
                  className="flex items-start gap-2"
                  variants={itemVariants}
                >
                  <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span dangerouslySetInnerHTML={{ __html: text }} />
                </motion.li>
              ))}
            </motion.ul>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
