'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { 
  Lightbulb, 
  Zap, 
  Target, 
  Waves, 
  Eye, 
  Shield, 
  ChevronDown, 
  ChevronRight,
  AlertTriangle,
  Sun,
  Radio,
  Microscope,
  ArrowRight,
  RefreshCw,
  Info,
  SkipForward
} from 'lucide-react';

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
  const [isAnimating, setIsAnimating] = useState(false);

  const properties = {
    coherence: {
      title: 'Coherence',
      description: 'Waves are in-phase (synchronized)',
      laserVisual: 'waves in perfect alignment, all peaks and troughs aligned',
      regularVisual: 'random waves with peaks and troughs at different positions',
      icon: Waves,
      detail: 'Laser light waves are coherent - they maintain a constant phase relationship. This allows them to interfere constructively, producing intense, focused beams.'
    },
    monochromaticity: {
      title: 'Monochromaticity',
      description: 'Single wavelength/color',
      laserVisual: 'single pure color',
      regularVisual: 'mix of all colors (white)',
      icon: Sun,
      detail: 'Laser light contains essentially one wavelength, giving it pure color. Regular light contains many wavelengths mixed together.'
    },
    directionality: {
      title: 'Directionality (Low Divergence)',
      description: 'Beam stays narrow over distance',
      laserVisual: 'parallel lines with minimal spread',
      regularVisual: 'rapidly spreading cone of light',
      icon: Target,
      detail: 'Laser beams diverge very little, maintaining high intensity over long distances. Regular light spreads out rapidly, reducing intensity with distance.'
    }
  };

  const currentProp = properties[activeProperty];
  const Icon = currentProp.icon;

  // Keyboard navigation for properties
  const handlePropertyKeyDown = (e: React.KeyboardEvent, property: keyof typeof properties) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveProperty(property);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="laser-properties-heading">
      {/* Skip to main content link for screen readers */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      
      {/* Property Selector */}
      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Laser properties">
        {(Object.keys(properties) as Array<keyof typeof properties>).map((key) => {
          const PropIcon = properties[key].icon;
          const isActive = activeProperty === key;
          return (
            <Button
              key={key}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setActiveProperty(key)}
              onKeyDown={(e) => handlePropertyKeyDown(e, key)}
              className="h-auto py-3 flex flex-col items-center gap-2"
              role="tab"
              aria-selected={isActive}
              aria-label={`${properties[key].title}: ${properties[key].description}`}
              aria-controls={`property-panel-${key}`}
              id={`property-tab-${key}`}
            >
              <PropIcon className="w-5 h-5" aria-hidden="true" />
              <span className="text-xs">{properties[key].title}</span>
            </Button>
          );
        })}
      </div>

      {/* Comparison Toggle */}
      <div className="flex justify-center gap-2" role="radiogroup" aria-label="Light type comparison">
        <Button
          variant={lightType === 'regular' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLightType('regular')}
          className="flex items-center gap-2"
          aria-pressed={lightType === 'regular'}
          aria-label="Show regular light demonstration"
        >
          <Lightbulb className="w-4 h-4" aria-hidden="true" />
          Regular Light
        </Button>
        <Button
          variant={lightType === 'laser' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setLightType('laser')}
          className="flex items-center gap-2"
          aria-pressed={lightType === 'laser'}
          aria-label="Show laser light demonstration"
        >
          <Zap className="w-4 h-4" aria-hidden="true" />
          Laser Light
        </Button>
      </div>

      {/* Visual Demonstration */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" aria-hidden="true" />
            <CardTitle className="text-base" id="laser-properties-heading">{currentProp.title}</CardTitle>
          </div>
          <CardDescription>{currentProp.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Animated Visualization */}
          <div 
            className="h-48 bg-muted/30 rounded-lg relative overflow-hidden"
            role="img" 
            aria-label={`${currentProp.title} visualization showing ${lightType === 'laser' ? currentProp.laserVisual : currentProp.regularVisual}`}
          >
            {activeProperty === 'coherence' && (
              <CoherenceVisualizer type={lightType} />
            )}
            {activeProperty === 'monochromaticity' && (
              <MonochromaticityVisualizer type={lightType} />
            )}
            {activeProperty === 'directionality' && (
              <DirectionalityVisualizer type={lightType} />
            )}
          </div>
          
          <div className="mt-4 p-3 bg-muted/50 rounded-lg">
            <p className="text-sm text-muted-foreground">{currentProp.detail}</p>
          </div>
        </CardContent>
      </Card>

      {/* Key Differences Summary */}
      <div className="grid grid-cols-2 gap-4">
        <Card 
          className={lightType === 'regular' ? 'ring-2 ring-primary' : ''}
          role="region" 
          aria-label="Regular light characteristics"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-amber-500" aria-hidden="true" />
              <h4 className="font-bold text-sm">Regular Light</h4>
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• Random phase waves</li>
              <li>• Multiple wavelengths</li>
              <li>• Spreads rapidly</li>
              <li>• Lower intensity</li>
            </ul>
          </CardContent>
        </Card>
        <Card 
          className={lightType === 'laser' ? 'ring-2 ring-primary' : ''}
          role="region" 
          aria-label="Laser light characteristics"
        >
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="w-4 h-4 text-red-500" aria-hidden="true" />
              <h4 className="font-bold text-sm">Laser Light</h4>
            </div>
            <ul className="text-xs space-y-1 text-muted-foreground">
              <li>• In-phase (coherent)</li>
              <li>• Single wavelength</li>
              <li>• Minimal divergence</li>
              <li>• High intensity</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Visual Components for Properties
function CoherenceVisualizer({ type }: { type: LightType }) {
  return (
    <svg className="w-full h-full" viewBox="0 0 400 150" role="img" aria-label={`Coherence diagram showing ${type === 'laser' ? 'coherent laser waves in phase' : 'incoherent regular light waves with random phases'}`}>
      <title id="coherence-title">{type === 'laser' ? 'Coherent Laser Waves' : 'Incoherent Regular Light Waves'}</title>
      <desc id="coherence-desc">
        {type === 'laser' 
          ? 'Diagram showing laser light waves all aligned in perfect phase, peaks and troughs synchronized' 
          : 'Diagram showing regular light waves with random phases, peaks and troughs at different positions'}
      </desc>
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
            <path
              key={i}
              d={`M 50 ${y} Q 100 ${y - 15} 150 ${y} Q 200 ${y + 15} 250 ${y} Q 300 ${y - 15} 350 ${y}`}
              fill="none"
              stroke="#ef4444"
              strokeWidth="2"
              className="animate-pulse"
              style={{ animationDelay: `${i * 0.1}s` }}
            />
          ))}
          <text x="200" y="130" textAnchor="middle" className="text-xs fill-primary">All waves in phase</text>
        </>
      ) : (
        // Incoherent waves - random
        <>
          {[35, 55, 75, 95, 115].map((y, i) => (
            <path
              key={i}
              d={`M 50 ${y} Q ${100 + i * 10} ${y - 20 + i * 5} 200 ${y + i * 8 - 20} Q ${250 + i * 15} ${y - 20 + i * 3} 350 ${y}`}
              fill="none"
              stroke="#eab308"
              strokeWidth="1.5"
              opacity="0.7"
            />
          ))}
          <text x="200" y="130" textAnchor="middle" className="text-xs fill-amber-500">Random phases</text>
        </>
      )}
    </svg>
  );
}

function MonochromaticityVisualizer({ type }: { type: LightType }) {
  const laserColors = ['#ef4444'];
  const regularColors = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#06b6d4'];
  
  return (
    <svg className="w-full h-full" viewBox="0 0 400 150" role="img" aria-label={`Monochromaticity diagram showing ${type === 'laser' ? 'single wavelength laser light' : 'multiple wavelength white light'}`}>
      <title id="mono-title">{type === 'laser' ? 'Single Wavelength Laser Light' : 'Multiple Wavelength White Light'}</title>
      <desc id="mono-desc">
        {type === 'laser' 
          ? 'Diagram showing a single pure color wavelength passing through a prism' 
          : 'Diagram showing white light splitting into multiple colors when passing through a prism'}
      </desc>
      {/* Prism or dispersion element */}
      <polygon points="180,50 220,75 180,100" fill="#64748b" opacity="0.5" />
      
      {type === 'laser' ? (
        // Single color
        <>
          <line x1="20" y1="75" x2="180" y2="75" stroke="#ef4444" strokeWidth="4" />
          <line x1="220" y1="75" x2="380" y2="75" stroke="#ef4444" strokeWidth="4" />
          <text x="200" y="130" textAnchor="middle" className="text-xs fill-red-400">Single wavelength: 632.8 nm</text>
          <circle cx="300" cy="75" r="20" fill="#ef4444" opacity="0.3" />
          <text x="300" y="80" textAnchor="middle" className="text-xs fill-red-400 font-bold">RED</text>
        </>
      ) : (
        // Multiple colors / white light dispersion
        <>
          <line x1="20" y1="75" x2="180" y2="75" stroke="currentColor" className="stroke-foreground" strokeWidth="4" />
          {regularColors.map((color, i) => (
            <line
              key={i}
              x1="220"
              y1="75"
              x2="380"
              y2={45 + i * 12}
              stroke={color}
              strokeWidth="3"
            />
          ))}
          <text x="200" y="130" textAnchor="middle" className="text-xs fill-yellow-400">All wavelengths present</text>
        </>
      )}
    </svg>
  );
}

function DirectionalityVisualizer({ type }: { type: LightType }) {
  return (
    <svg className="w-full h-full" viewBox="0 0 400 150" role="img" aria-label={`Directionality diagram showing ${type === 'laser' ? 'narrow laser beam with low divergence' : 'wide regular light beam with high divergence'}`}>
      <title id="dir-title">{type === 'laser' ? 'Low Divergence Laser Beam' : 'High Divergence Regular Light'}</title>
      <desc id="dir-desc">
        {type === 'laser' 
          ? 'Diagram showing a laser beam staying narrow over distance with minimal spread' 
          : 'Diagram showing regular light spreading out rapidly over distance'}
      </desc>
      {/* Source */}
      <circle cx="40" cy="75" r="12" fill={type === 'laser' ? '#ef4444' : '#eab308'} />
      
      {/* Target at distance */}
      <rect x="350" y="60" width="4" height="30" fill="#64748b" />
      
      {type === 'laser' ? (
        // Narrow beam
        <>
          <path d="M 52 70 L 350 67 L 350 83 L 52 80 Z" fill="#ef4444" opacity="0.3" />
          <line x1="52" y1="75" x2="350" y2="75" stroke="#ef4444" strokeWidth="3" />
          <text x="200" y="30" textAnchor="middle" className="text-xs fill-red-400">Beam divergence: ~1 mrad</text>
          <text x="200" y="130" textAnchor="middle" className="text-xs fill-muted-foreground">Maintains intensity over distance</text>
        </>
      ) : (
        // Wide spread
        <>
          <path d="M 52 75 L 350 20 L 350 130 Z" fill="#eab308" opacity="0.2" />
          {[45, 60, 75, 90, 105].map((y, i) => (
            <line key={i} x1="52" y1="75" x2="350" y2={y} stroke="#eab308" strokeWidth="1" opacity="0.5" />
          ))}
          <text x="200" y="30" textAnchor="middle" className="text-xs fill-yellow-400">Beam divergence: ~180°</text>
          <text x="200" y="130" textAnchor="middle" className="text-xs fill-muted-foreground">Intensity decreases with 1/r²</text>
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

  const visibleRange = { start: 400, end: 700 };
  const spectrumWidth = 800; // nm range from 200 to 1000 for display
  const displayStart = 200;
  const displayEnd = 1400;

  const getPositionPercent = (nm: number) => {
    return ((nm - displayStart) / (displayEnd - displayStart)) * 100;
  };

  // Keyboard navigation for regions
  const handleRegionKeyDown = (e: React.KeyboardEvent, region: SpectrumRegion) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedRegion(region);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-label="Electromagnetic spectrum explorer">
      {/* Interactive Spectrum Bar */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Radio className="w-4 h-4" aria-hidden="true" />
            Electromagnetic Spectrum
          </CardTitle>
          <CardDescription>Click on regions to explore laser types and hazards</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Spectrum Visualization */}
          <div className="relative h-32 mb-4" role="img" aria-label="Color-coded electromagnetic spectrum from UV to Far-IR">
            {/* Background gradient showing actual spectrum */}
            <div 
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
            />
            
            {/* Region overlays */}
            {SPECTRUM_REGIONS.filter(r => r.nmRange[1] <= displayEnd).map((region, i) => {
              const left = getPositionPercent(region.nmRange[0]);
              const right = getPositionPercent(region.nmRange[1]);
              const isSelected = selectedRegion?.name === region.name;
              
              return (
                <button
                  key={i}
                  className={`absolute top-0 bottom-0 border-r border-white/20 transition-all hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white focus:ring-inset ${
                    isSelected ? 'bg-white/30 ring-2 ring-white' : ''
                  }`}
                  style={{ left: `${left}%`, width: `${right - left}%` }}
                  onClick={() => setSelectedRegion(region)}
                  onKeyDown={(e) => handleRegionKeyDown(e, region)}
                  aria-label={`${region.name}: ${region.range}. ${region.description}. Hazard: ${region.hazard}`}
                  aria-pressed={isSelected}
                >
                  <span className="sr-only">{region.name}</span>
                </button>
              );
            })}
            
            {/* Wavelength markers */}
            {[200, 400, 532, 700, 1000, 1400].map(nm => (
              <div
                key={nm}
                className="absolute bottom-0 transform -translate-x-1/2"
                style={{ left: `${getPositionPercent(nm)}%` }}
              >
                <div className="h-2 w-px bg-white/50" />
                <span className="text-[10px] text-white/70">{nm < 1000 ? nm : `${nm/1000}k`}</span>
              </div>
            ))}
            
            {/* Laser wavelength markers */}
            {[193, 248, 355, 405, 445, 488, 532, 594, 632, 808, 1064].map(nm => (
              <button
                key={nm}
                className="absolute top-1 transform -translate-x-1/2 cursor-pointer group focus:outline-none focus:ring-2 focus:ring-white rounded-full"
                style={{ left: `${getPositionPercent(nm)}%` }}
                onMouseEnter={() => setHoveredWavelength(nm)}
                onMouseLeave={() => setHoveredWavelength(null)}
                aria-label={`${nm} nanometers`}
              >
                <div className="w-2 h-2 bg-background rounded-full shadow-lg" />
                {hoveredWavelength === nm && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-10">
                    {nm} nm
                  </div>
                )}
              </button>
            ))}
          </div>

          {/* Region Labels */}
          <div className="flex flex-wrap gap-2" role="list" aria-label="Spectrum regions">
            {SPECTRUM_REGIONS.slice(3, 10).map((region, i) => (
              <Badge
                key={i}
                variant={selectedRegion?.name === region.name ? 'default' : 'secondary'}
                className="cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary"
                onClick={() => setSelectedRegion(region)}
                onKeyDown={(e) => handleRegionKeyDown(e, region)}
                tabIndex={0}
                role="listitem"
                aria-label={`Select ${region.name}`}
              >
                {region.name}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Selected Region Details */}
      {selectedRegion && (
        <Card className="border-primary/50" role="region" aria-label={`${selectedRegion.name} details`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">{selectedRegion.name}</CardTitle>
                <CardDescription>{selectedRegion.range}</CardDescription>
              </div>
              <Badge variant={selectedRegion.name === 'VISIBLE' ? 'default' : 'destructive'}>
                {selectedRegion.name === 'VISIBLE' ? 'Visible' : 'Invisible'}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{selectedRegion.description}</p>
            
            <div>
              <h4 className="text-sm font-semibold mb-2">Common Laser Types:</h4>
              <div className="flex flex-wrap gap-2">
                {selectedRegion.laserTypes.map((type, i) => (
                  <Badge key={i} variant="outline">{type}</Badge>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-destructive/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" aria-hidden="true" />
              <div>
                <h4 className="text-sm font-semibold text-destructive">Hazard Warning</h4>
                <p className="text-sm text-muted-foreground">{selectedRegion.hazard}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Laser Types by Wavelength Quick Reference */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Microscope className="w-4 h-4" aria-hidden="true" />
            Common Laser Wavelengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
            {WAVELENGTH_DATA.slice(0, 12).map((data, i) => (
              <button
                key={i}
                className="p-2 rounded border hover:bg-muted/50 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary text-left"
                onClick={() => {
                  const region = SPECTRUM_REGIONS.find(r => 
                    data.nm >= r.nmRange[0] && data.nm <= r.nmRange[1]
                  );
                  if (region) setSelectedRegion(region);
                }}
                aria-label={`${data.nm} nanometers: ${data.laserTypes[0]}`}
              >
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: data.color }}
                    aria-hidden="true"
                  />
                  <span className="font-mono">{data.nm} nm</span>
                </div>
                <div className="text-muted-foreground truncate">{data.laserTypes[0]}</div>
              </button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
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

  // Keyboard navigation
  const handleTypeKeyDown = (e: React.KeyboardEvent, type: ReflectionType) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setReflectionType(type);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="beam-interactions-heading">
      <h2 id="beam-interactions-heading" className="sr-only">Beam Interactions Section</h2>
      
      {/* Reflection Type Selector */}
      <div className="grid grid-cols-3 gap-2" role="tablist" aria-label="Reflection type selector">
        {(Object.keys(reflectionData) as ReflectionType[]).map((type) => (
          <Button
            key={type}
            variant={reflectionType === type ? 'default' : 'outline'}
            onClick={() => setReflectionType(type)}
            onKeyDown={(e) => handleTypeKeyDown(e, type)}
            className="h-auto py-3 text-xs"
            role="tab"
            aria-selected={reflectionType === type}
            aria-label={`${type === 'specular' ? 'Mirror-like specular' : type === 'diffuse' ? 'Scattered diffuse' : 'Mixed'} reflection`}
          >
            {type === 'specular' ? 'Mirror-like' : type === 'diffuse' ? 'Scattered' : 'Mixed'}
          </Button>
        ))}
      </div>

      {/* Interactive Beam Visualization */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">{currentReflection.title}</CardTitle>
          <CardDescription>{currentReflection.description}</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Beam Path SVG */}
          <div 
            className="h-56 bg-muted/30 rounded-lg relative overflow-hidden"
            role="img" 
            aria-label={`Visualization of ${currentReflection.title.toLowerCase()} showing beam path and hazard zones`}
          >
            <ReflectionVisualizer 
              type={reflectionType} 
              angle={beamAngle}
              showHazard={showHazardZone}
            />
          </div>

          {/* Controls */}
          <div className="mt-4 space-y-4">
            <div>
              <label 
                htmlFor="beam-angle" 
                className="text-xs text-muted-foreground mb-1 block"
              >
                Beam Angle: {beamAngle}°
              </label>
              <Slider
                id="beam-angle"
                value={[beamAngle]}
                onValueChange={(v) => setBeamAngle(v[0])}
                min={10}
                max={80}
                step={5}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Beam angle selector"
                aria-valuemin={10}
                aria-valuemax={80}
                aria-valuenow={beamAngle}
                aria-valuetext={`${beamAngle} degrees`}
              />
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="hazard"
                checked={showHazardZone}
                onChange={(e) => setShowHazardZone(e.target.checked)}
                className="rounded"
                aria-label="Show hazard zones"
              />
              <label htmlFor="hazard" className="text-xs text-muted-foreground">
                Show hazard zones
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reflection Details */}
      <Card className={reflectionType === 'specular' ? 'border-destructive' : ''} role="region" aria-label="Reflection hazard details">
        <CardContent className="p-4 space-y-3">
          <div className={`flex items-start gap-2 p-3 rounded-lg ${
            reflectionType === 'specular' ? 'bg-destructive/20' : 'bg-muted/50'
          }`}>
            <AlertTriangle className={`w-5 h-5 shrink-0 ${
              reflectionType === 'specular' ? 'text-destructive' : 'text-amber-500'
            }`} aria-hidden="true" />
            <div>
              <h4 className="text-sm font-semibold">Hazard Level</h4>
              <p className="text-sm text-muted-foreground">{currentReflection.hazard}</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold mb-2">Common Examples:</h4>
            <div className="flex flex-wrap gap-2">
              {currentReflection.examples.map((ex, i) => (
                <Badge key={i} variant="outline" className="text-xs">{ex}</Badge>
              ))}
            </div>
          </div>

          <div className="text-xs text-muted-foreground">
            <strong>Beam divergence after reflection:</strong> {currentReflection.divergence}
          </div>
        </CardContent>
      </Card>

      {/* Absorption & Transmission Card */}
      <Card role="region" aria-label="Absorption and transmission information">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Shield className="w-4 h-4" aria-hidden="true" />
            Absorption & Transmission
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">Absorption</h4>
              <p className="text-xs text-muted-foreground">
                Energy converted to heat. Depends on material and wavelength.
              </p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="text-sm font-semibold mb-1">Transmission</h4>
              <p className="text-xs text-muted-foreground">
                Passes through material (glass, clear plastics, water).
              </p>
            </div>
          </div>
          <div className="text-xs text-muted-foreground">
            <strong>Key safety point:</strong> Never rely on "clear" materials for protection. 
            Many transparent materials transmit laser light, especially in the near-IR range.
          </div>
        </CardContent>
      </Card>
    </div>
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
  
  // Incident beam end point
  const incidentAngle = (angle * Math.PI) / 180;
  const incidentEndX = surfaceX - Math.cos(incidentAngle) * 120;
  const incidentEndY = surfaceY - Math.sin(incidentAngle) * 120;
  
  // Reflected beams
  const reflectedStartX = surfaceX;
  const reflectedStartY = surfaceY;
  
  return (
    <svg 
      className="w-full h-full" 
      viewBox="0 0 400 250" 
      role="img" 
      aria-label={`${type} reflection diagram showing incident and reflected laser beams at ${angle} degrees`}
    >
      <title id={`reflection-title-${type}`}>{`${type.charAt(0).toUpperCase() + type.slice(1)} Reflection Diagram`}</title>
      <desc id={`reflection-desc-${type}`}>
        {type === 'specular' 
          ? 'Diagram showing a laser beam reflecting off a smooth mirror-like surface with minimal divergence' 
          : type === 'diffuse' 
          ? 'Diagram showing a laser beam scattering in multiple directions off a rough surface'
          : 'Diagram showing mixed reflection with some specular and some diffuse components'}
      </desc>
      
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
          {/* Rough surface texture */}
          {[...Array(10)].map((_, i) => (
            <line
              key={i}
              x1={surfaceX + i * 15}
              y1={surfaceY}
              x2={surfaceX + i * 15 + (i % 3 - 1) * 5}
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
      <line
        x1={sourceX}
        y1={sourceY}
        x2={incidentEndX}
        y2={incidentEndY}
        stroke="#ef4444"
        strokeWidth="3"
        markerEnd="url(#arrowhead)"
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
          <line
            x1={reflectedStartX}
            y1={reflectedStartY}
            x2={reflectedStartX + Math.cos(incidentAngle) * 120}
            y2={reflectedStartY - Math.sin(incidentAngle) * 120}
            stroke="#ef4444"
            strokeWidth="3"
            markerEnd="url(#arrowhead)"
          />
          {showHazard && (
            <circle
              cx={reflectedStartX + Math.cos(incidentAngle) * 60}
              cy={reflectedStartY - Math.sin(incidentAngle) * 60}
              r="25"
              fill="#ef4444"
              opacity="0.2"
              aria-label="High hazard zone"
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
              <line
                key={i}
                x1={reflectedStartX}
                y1={reflectedStartY}
                x2={reflectedStartX + Math.cos(refAngle) * length}
                y2={reflectedStartY - Math.sin(refAngle) * length}
                stroke="#ef4444"
                strokeWidth={2 - Math.abs(offset) / 30}
                opacity={1 - Math.abs(offset) / 40}
                markerEnd="url(#arrowhead)"
              />
            );
          })}
          {showHazard && (
            <ellipse
              cx={reflectedStartX + 50}
              cy={reflectedStartY - 30}
              rx="60"
              ry="40"
              fill="#eab308"
              opacity="0.15"
              aria-label="Moderate hazard zone"
            />
          )}
        </>
      ) : (
        // Mixed - some specular, some diffuse
        <>
          <line
            x1={reflectedStartX}
            y1={reflectedStartY}
            x2={reflectedStartX + Math.cos(incidentAngle) * 100}
            y2={reflectedStartY - Math.sin(incidentAngle) * 100}
            stroke="#ef4444"
            strokeWidth="3"
            opacity="0.8"
            markerEnd="url(#arrowhead)"
          />
          {[-20, 0, 20].map((offset, i) => (
            <line
              key={i}
              x1={reflectedStartX}
              y1={reflectedStartY}
              x2={reflectedStartX + Math.cos(incidentAngle + offset * Math.PI / 180) * 60}
              y2={reflectedStartY - Math.sin(incidentAngle + offset * Math.PI / 180) * 60}
              stroke="#ef4444"
              strokeWidth="1.5"
              opacity="0.5"
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
  
  const getPenetrationDepth = (nm: number, structure: EyeStructure) => {
    if (structure === 'cornea') {
      if (nm < 300) return 100;
      if (nm < 400) return 80;
      if (nm > 1400) return 95;
      return 10;
    }
    if (structure === 'lens') {
      if (nm >= 300 && nm < 400) return 60;
      if (nm >= 400 && nm <= 1400) return 20;
      return 5;
    }
    if (structure === 'retina') {
      if (nm >= 400 && nm <= 1400) return 90;
      return 5;
    }
    return nm >= 400 && nm <= 1400 ? 70 : 10;
  };

  // Keyboard navigation
  const handleWavelengthKeyDown = (e: React.KeyboardEvent, nm: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setWavelength(nm);
    }
  };

  const handleStructureKeyDown = (e: React.KeyboardEvent, structure: EyeStructure) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedStructure(structure);
    }
  };

  return (
    <div className="space-y-6" role="region" aria-labelledby="ocular-hazards-heading">
      <h2 id="ocular-hazards-heading" className="sr-only">Ocular Hazards Section</h2>
      
      {/* Wavelength Slider */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Wavelength Explorer</span>
            <Badge style={{ backgroundColor: currentData.color }}>
              {wavelength} nm
            </Badge>
          </CardTitle>
          <CardDescription>{currentData.name}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={[wavelength]}
            onValueChange={(v) => setWavelength(v[0])}
            min={200}
            max={11000}
            step={1}
            className="w-full py-2 [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
            aria-label="Wavelength selector"
            aria-valuemin={200}
            aria-valuemax={11000}
            aria-valuenow={wavelength}
            aria-valuetext={`${wavelength} nanometers, ${currentData.name}`}
          />
          
          {/* Wavelength scale with key points */}
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>200nm</span>
            <span>400nm</span>
            <span>700nm</span>
            <span>1400nm</span>
            <span>10µm</span>
          </div>
          
          <div className="h-2 rounded-full" style={{
            background: `linear-gradient(to right, 
              #6B46C1 0%, #8B5CF6 18%, 
              #3B82F6 27%, #22C55E 45%, #EF4444 63%, 
              #7F1D1D 72%, #292524 90%, #78716c 100%
            )`
          }} aria-hidden="true" />

          {/* Quick select buttons */}
          <div className="flex flex-wrap gap-1" role="group" aria-label="Common laser wavelengths">
            {[193, 355, 532, 632, 808, 1064, 10600].map(nm => (
              <Button
                key={nm}
                variant={wavelength === nm ? 'default' : 'outline'}
                size="sm"
                className="text-xs px-2 py-1 h-auto"
                onClick={() => setWavelength(nm)}
                onKeyDown={(e) => handleWavelengthKeyDown(e, nm)}
                aria-label={`Select ${nm >= 1000 ? `${nm/1000} micrometers` : `${nm} nanometers`}`}
                aria-pressed={wavelength === nm}
              >
                {nm >= 1000 ? `${nm/1000}µm` : `${nm}nm`}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Eye Anatomy Interactive Diagram */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4" aria-hidden="true" />
            Eye Anatomy & Penetration
          </CardTitle>
          <CardDescription>
            Click on eye structures to learn about wavelength-specific damage
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            {/* Eye Diagram */}
            <div className="flex-1">
              <EyeAnatomyDiagram 
                wavelength={wavelength}
                selectedStructure={selectedStructure}
                onSelectStructure={setSelectedStructure}
                showPenetration={showPenetration}
              />
            </div>
            
            {/* Structure Details */}
            <div className="flex-1 space-y-3">
              <div className="flex gap-2" role="tablist" aria-label="Eye structure selector">
                {(Object.keys(EYE_ANATOMY) as EyeStructure[]).map((structure) => (
                  <Button
                    key={structure}
                    variant={selectedStructure === structure ? 'default' : 'outline'}
                    size="sm"
                    className="text-xs flex-1"
                    onClick={() => setSelectedStructure(structure)}
                    onKeyDown={(e) => handleStructureKeyDown(e, structure)}
                    role="tab"
                    aria-selected={selectedStructure === structure}
                    aria-label={EYE_ANATOMY[structure].name}
                  >
                    {EYE_ANATOMY[structure].name}
                  </Button>
                ))}
              </div>
              
              <div className="p-3 bg-muted/30 rounded-lg">
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
              </div>
              
              <div className="flex items-center gap-2">
                <Checkbox
                  id="penetration"
                  checked={showPenetration}
                  onCheckedChange={(checked) => setShowPenetration(checked as boolean)}
                  aria-label="Show laser penetration depth in eye diagram"
                />
                <Label htmlFor="penetration" className="text-xs text-muted-foreground cursor-pointer">
                  Show penetration depth
                </Label>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* MPE & Hazard Info */}
      <Card 
        className={wavelength >= 400 && wavelength <= 1400 ? 'border-destructive' : ''}
        role="region" 
        aria-label="Hazard information"
      >
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Hazard Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">MPE Value</h4>
              <p className="text-lg font-mono">{currentData.mpe}</p>
              <p className="text-xs text-muted-foreground">Maximum Permissible Exposure</p>
            </div>
            <div className="p-3 bg-muted/30 rounded-lg">
              <h4 className="text-xs font-semibold text-muted-foreground mb-1">Primary Hazard</h4>
              <p className="text-sm">{currentData.penetration}</p>
            </div>
          </div>
          
          <div 
            className={`p-3 rounded-lg flex items-start gap-2 ${
              wavelength >= 400 && wavelength <= 1400 
                ? 'bg-destructive/20' 
                : wavelength < 400 || (wavelength > 1400 && wavelength < 3000)
                ? 'bg-amber-500/20'
                : 'bg-muted/50'
            }`}
            role="alert"
            aria-live="polite"
          >
            <AlertTriangle className={`w-5 h-5 shrink-0 ${
              wavelength >= 400 && wavelength <= 1400 ? 'text-destructive' : 'text-yellow-500'
            }`} aria-hidden="true" />
            <div>
              <h4 className="text-sm font-semibold">
                {wavelength >= 400 && wavelength <= 1400 
                  ? 'RETINAL HAZARD REGION' 
                  : wavelength < 400 
                  ? 'CORNEAL HAZARD (UV)'
                  : 'CORNEAL HAZARD (IR)'}
              </h4>
              <p className="text-sm text-muted-foreground">{currentData.hazard}</p>
              {wavelength >= 700 && wavelength <= 1400 && (
                <p className="text-xs text-destructive mt-1 font-semibold">
                  ⚠️ INVISIBLE - Most dangerous! No blink reflex protection!
                </p>
              )}
            </div>
          </div>

          {/* Common lasers at this wavelength */}
          <div>
            <h4 className="text-sm font-semibold mb-2">Common Laser Types:</h4>
            <div className="flex flex-wrap gap-2">
              {currentData.laserTypes.map((type, i) => (
                <Badge key={i} variant="secondary">{type}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
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
  // Determine which structures are affected by current wavelength
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

  const handleStructureClick = (structure: EyeStructure) => {
    onSelectStructure(structure);
  };

  const handleKeyDown = (e: React.KeyboardEvent, structure: EyeStructure) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleStructureClick(structure);
    }
  };

  return (
    <svg 
      className="w-full h-48" 
      viewBox="0 0 200 120" 
      role="img" 
      aria-label="Interactive eye anatomy diagram showing laser penetration at different wavelengths"
    >
      <title id="eye-title">Eye Anatomy Cross-Section</title>
      <desc id="eye-desc">
        Cross-section diagram of the human eye showing cornea, lens, vitreous humor, and retina. 
        Colored regions indicate which parts are affected by the currently selected wavelength.
      </desc>
      
      {/* Sclera (white of eye) */}
      <ellipse cx="100" cy="60" rx="90" ry="50" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
      
      {/* Cornea */}
      <path
        d="M 30 60 Q 30 20 80 35"
        fill="none"
        stroke={getStructureColor('cornea')}
        strokeWidth={selectedStructure === 'cornea' ? 4 : 2}
        className="cursor-pointer transition-all"
        onClick={() => handleStructureClick('cornea')}
        onKeyDown={(e) => handleKeyDown(e, 'cornea')}
        tabIndex={0}
        role="button"
        aria-label="Cornea - Click to learn more"
        opacity={affectsCornea && showPenetration ? 1 : 0.7}
      />
      
      {/* Iris */}
      <circle cx="85" cy="60" r="25" fill="#3b82f6" opacity="0.3" />
      
      {/* Pupil */}
      <circle cx="85" cy="60" r="12" fill="#1e293b" />
      
      {/* Lens */}
      <ellipse 
        cx="110" cy="60" rx="8" ry="20" 
        fill={getStructureColor('lens')}
        opacity={affectsLens && showPenetration ? 0.8 : 0.4}
        className="cursor-pointer transition-all"
        onClick={() => handleStructureClick('lens')}
        onKeyDown={(e) => handleKeyDown(e, 'lens')}
        tabIndex={0}
        role="button"
        aria-label="Lens - Click to learn more"
        stroke={selectedStructure === 'lens' ? '#3b82f6' : 'none'}
        strokeWidth="2"
      />
      
      {/* Vitreous humor */}
      <ellipse 
        cx="140" cy="60" rx="35" ry="30" 
        fill="#e2e8f0" 
        opacity="0.3"
        className="cursor-pointer"
        onClick={() => handleStructureClick('vitreous')}
        onKeyDown={(e) => handleKeyDown(e, 'vitreous')}
        tabIndex={0}
        role="button"
        aria-label="Vitreous humor - Click to learn more"
        stroke={selectedStructure === 'vitreous' ? '#3b82f6' : 'none'}
        strokeWidth="2"
      />
      
      {/* Retina */}
      <path
        d="M 170 30 Q 185 60 170 90"
        fill="none"
        stroke={getStructureColor('retina')}
        strokeWidth={selectedStructure === 'retina' ? 4 : 3}
        className="cursor-pointer transition-all"
        onClick={() => handleStructureClick('retina')}
        onKeyDown={(e) => handleKeyDown(e, 'retina')}
        tabIndex={0}
        role="button"
        aria-label="Retina - Click to learn more"
        opacity={affectsRetina && showPenetration ? 1 : 0.5}
      />
      
      {/* Optic nerve */}
      <path
        d="M 185 60 L 195 60"
        stroke="#94a3b8"
        strokeWidth="4"
        strokeLinecap="round"
      />
      
      {/* Incoming beam */}
      <line x1="10" y1="60" x2="73" y2="60" stroke="#ef4444" strokeWidth="3" markerEnd="url(#arrowhead)" />
      
      {/* Penetration visualization */}
      {showPenetration && (
        <>
          {affectsCornea && (
            <path d="M 30 45 L 50 45 L 50 75 L 30 75" fill="#ef4444" opacity="0.2" aria-label="Corneal hazard area" />
          )}
          {affectsLens && (
            <ellipse cx="110" cy="60" rx="10" ry="22" fill="#ef4444" opacity="0.2" aria-label="Lens hazard area" />
          )}
          {affectsRetina && (
            <>
              <line x1="73" y1="60" x2="170" y2="60" stroke="#ef4444" strokeWidth="2" opacity="0.5" strokeDasharray="4 2" />
              <circle cx="170" cy="60" r="8" fill="#ef4444" opacity="0.3" aria-label="Retinal hazard area" />
            </>
          )}
        </>
      )}
      
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
  const mainContentRef = useRef<HTMLDivElement>(null);

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
      icon: RefreshCw,
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

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl/Cmd + Enter to mark complete
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
        e.preventDefault();
        markComplete(activeSection);
      }
      // Escape to reset section (if needed)
      if (e.key === 'Escape') {
        // Could add reset functionality here
      }
      // Arrow keys for section navigation
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        const currentIndex = sections.findIndex(s => s.id === activeSection);
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
          setActiveSection(sections[currentIndex - 1].id);
        } else if (e.key === 'ArrowRight' && currentIndex < sections.length - 1) {
          setActiveSection(sections[currentIndex + 1].id);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection, sections]);

  const handleSectionKeyDown = (e: React.KeyboardEvent, sectionId: Section) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setActiveSection(sectionId);
      // Focus main content after navigation
      setTimeout(() => {
        mainContentRef.current?.focus();
      }, 100);
    }
  };

  return (
    <div className="space-y-4">
      {/* Skip to main content link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      {/* Module Header */}
      <Card className="bg-gradient-to-r from-red-950/50 to-orange-950/50">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <Zap className="w-6 h-6 text-red-400" aria-hidden="true" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-foreground">Module 1: Introduction to Laser Hazards</h2>
              <p className="text-sm text-muted-foreground">
                Interactive exploration of laser fundamentals and biological hazards
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Navigation */}
      <nav aria-label="Module sections">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isComplete = completedSections.has(section.id);
            
            return (
              <Button
                key={section.id}
                variant={isActive ? 'default' : 'outline'}
                onClick={() => setActiveSection(section.id)}
                onKeyDown={(e) => handleSectionKeyDown(e, section.id)}
                className="h-auto py-3 flex flex-col items-center gap-2 text-left"
                role="tab"
                aria-selected={isActive}
                aria-label={`${section.title}${isComplete ? ', completed' : ''}. ${section.description}`}
                id={`section-tab-${section.id}`}
              >
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4" aria-hidden="true" />
                  {isComplete && <span className="text-green-500" aria-hidden="true">✓</span>}
                </div>
                <div>
                  <div className="text-xs font-semibold">{section.title}</div>
                  <div className="text-[10px] text-muted-foreground hidden sm:block">
                    {section.description}
                  </div>
                </div>
              </Button>
            );
          })}
        </div>
      </nav>

      {/* Progress Indicator */}
      <div className="flex items-center gap-2 text-xs text-muted-foreground">
        <span>Progress:</span>
        <div 
          className="flex-1 h-2 bg-muted rounded-full overflow-hidden" 
          role="progressbar" 
          aria-valuenow={completedSections.size} 
          aria-valuemin={0} 
          aria-valuemax={sections.length}
          aria-label="Module completion progress"
        >
          <div 
            className="h-full bg-primary transition-all"
            style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
          />
        </div>
        <span>{completedSections.size}/{sections.length}</span>
      </div>

      {/* Section Content */}
      <main 
        id="main-content" 
        ref={mainContentRef}
        tabIndex={-1}
        aria-labelledby="section-heading"
      >
        <Card>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {(() => {
                  const Icon = sections.find(s => s.id === activeSection)?.icon || Lightbulb;
                  return <Icon className="w-5 h-5 text-primary" aria-hidden="true" />;
                })()}
                <CardTitle id="section-heading">
                  {sections.find(s => s.id === activeSection)?.title}
                </CardTitle>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => markComplete(activeSection)}
                aria-label={`Mark ${sections.find(s => s.id === activeSection)?.title} as complete`}
              >
                Mark Complete
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {activeSection === 'properties' && <LaserPropertiesSection />}
            {activeSection === 'spectrum' && <SpectrumSection />}
            {activeSection === 'interactions' && <BeamInteractionsSection />}
            {activeSection === 'hazards' && <OcularHazardsSection />}
          </CardContent>
        </Card>
      </main>

      {/* Key Takeaways */}
      <Card className="bg-muted/30" role="region" aria-labelledby="takeaways-heading">
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2" id="takeaways-heading">
            <Info className="w-4 h-4" aria-hidden="true" />
            Key Safety Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span>Laser light is <strong>coherent, monochromatic, and directional</strong> - making it far more hazardous than regular light</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Visible (400-700nm) and Near-IR (700-1400nm)</strong> lasers pose the greatest retinal hazard</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Specular reflections</strong> from mirrors and shiny surfaces are nearly as dangerous as direct beams</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span><strong>Near-IR lasers (755-1400nm)</strong> are especially dangerous because they&apos;re invisible - no blink reflex protection!</span>
            </li>
            <li className="flex items-start gap-2">
              <ArrowRight className="w-4 h-4 text-primary shrink-0 mt-0.5" aria-hidden="true" />
              <span>Retinal damage is <strong>permanent</strong> - the retina cannot regenerate damaged tissue</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Keyboard shortcuts help */}
      <div className="text-xs text-muted-foreground text-center">
        Keyboard shortcuts: Arrow keys navigate sections • Ctrl+Enter marks complete
      </div>
    </div>
  );
}
