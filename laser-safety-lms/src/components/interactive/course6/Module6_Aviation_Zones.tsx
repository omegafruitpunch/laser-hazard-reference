'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Plane, 
  Target, 
  AlertTriangle,
  Eye,
  Shield,
  Info,
  Zap,
  MapPin,
  Activity,
  ChevronRight,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FlightZone {
  id: string;
  acronym: string;
  name: string;
  exposureLimit: string;
  exposureValue: number;
  exposureUnit: string;
  description: string;
  radius: string;
  altitude: string;
  color: string;
  bgColor: string;
  borderColor: string;
  icon: string;
  criticalPhases: string[];
  effects: string[];
}

interface VisualEffect {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  duration: string;
  severity: 'low' | 'medium' | 'high';
  zone: string;
  threshold: string;
  color: string;
  bgColor: string;
  icon: string;
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const FLIGHT_ZONES: FlightZone[] = [
  {
    id: "lfz",
    acronym: "LFZ",
    name: "Laser Free Zone",
    exposureLimit: "50 nW/cm²",
    exposureValue: 50,
    exposureUnit: "nW/cm²",
    description: "Airspace where laser radiation should be virtually eliminated to prevent any visual distraction to pilots. Any laser illumination in this zone is unacceptable.",
    radius: "< 2 NM",
    altitude: "< 2,000 ft AGL",
    color: "text-red-600",
    bgColor: "bg-red-500",
    borderColor: "border-red-500",
    icon: "🚫",
    criticalPhases: ["Final approach", "Takeoff initial climb", "Missed approach", "Low-level navigation"],
    effects: ["Any laser light immediately distracting", "No exposure threshold for distraction"]
  },
  {
    id: "cfz",
    acronym: "CFZ",
    name: "Critical Flight Zone",
    exposureLimit: "5 µW/cm²",
    exposureValue: 5,
    exposureUnit: "µW/cm²",
    description: "Airspace where exposure should not exceed levels that cause glare, which can impair pilot vision. Glare is like oncoming headlights - you cannot see past the light.",
    radius: "~10 NM",
    altitude: "up to 10,000 ft AGL",
    color: "text-orange-600",
    bgColor: "bg-orange-500",
    borderColor: "border-orange-500",
    icon: "⚠️",
    criticalPhases: ["Approach", "Departure", "Low-level navigation", "Emergency operations", "Traffic pattern"],
    effects: ["Glare - cannot see past the light", "Vision blocked while illuminated"]
  },
  {
    id: "sfz",
    acronym: "SZED",
    name: "Sensitive Zone",
    exposureLimit: "100 µW/cm²",
    exposureValue: 100,
    exposureUnit: "µW/cm²",
    description: "Airspace where exposure should not exceed levels that cause flashblindness or afterimages. Like a camera flash - vision is impaired even after the light is gone.",
    radius: "Variable",
    altitude: "Variable",
    color: "text-yellow-600",
    bgColor: "bg-yellow-500",
    borderColor: "border-yellow-500",
    icon: "👁️",
    criticalPhases: ["Training areas", "Helicopter routes", "Aerobatic areas", "Special use airspace"],
    effects: ["Flashblindness - afterimages persist", "Can last seconds to minutes"]
  },
  {
    id: "nfz",
    acronym: "NFZ",
    name: "Normal Zone",
    exposureLimit: "MPE Limits",
    exposureValue: 2.6,
    exposureUnit: "mW/cm²",
    description: "All other airspace where normal Maximum Permissible Exposure (MPE) limits apply for eye safety. Standard safety distances apply.",
    radius: "All remaining airspace",
    altitude: "Above 10,000 ft AGL",
    color: "text-green-600",
    bgColor: "bg-green-500",
    borderColor: "border-green-500",
    icon: "✓",
    criticalPhases: ["En route cruise", "High altitude operations"],
    effects: ["Eye safety hazard only (MPE)", "No visual interference at these levels"]
  }
];

const VISUAL_EFFECTS: VisualEffect[] = [
  {
    id: "distraction",
    name: "Distraction",
    description: "Mental interference from bright light - pilot attention is drawn away from instruments. Vision is not physically blocked but focus is disrupted.",
    characteristics: [
      "Light brighter than background",
      "Vision not physically blocked",
      "Mental focus disrupted",
      "Can be managed by pilot training"
    ],
    duration: "While light is visible",
    severity: "low",
    zone: "LFED (beyond LFZ)",
    threshold: "50 nW/cm²",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    icon: "👀"
  },
  {
    id: "glare",
    name: "Glare",
    description: "Inability to see past the laser light while it remains on - similar to oncoming headlights at night. Blocks a portion of the pilot's vision.",
    characteristics: [
      "Cannot see through the light",
      "Blocks portion of vision",
      "Effect ends when light removed",
      "Disorients pilot"
    ],
    duration: "While light is on",
    severity: "medium",
    zone: "CZED (within CFZ)",
    threshold: "5 µW/cm²",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    icon: "💡"
  },
  {
    id: "flashblindness",
    name: "Flashblindness",
    description: "Vision-impairing afterimages that persist after the light is gone - like a camera flash. Most serious visual interference hazard.",
    characteristics: [
      "Afterimages persist",
      "Can last seconds to minutes",
      "Most serious hazard",
      "Critical during landing/takeoff"
    ],
    duration: "Seconds to minutes",
    severity: "high",
    zone: "SZED (within SFZ)",
    threshold: "100 µW/cm²",
    color: "text-red-600",
    bgColor: "bg-red-50",
    icon: "⚡"
  }
];

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function ZoneVisualizer() {
  const [selectedZone, setSelectedZone] = useState<FlightZone>(FLIGHT_ZONES[0]);
  const [showLayers, setShowLayers] = useState({
    lfz: true,
    cfz: true,
    sfz: true,
    nfz: true
  });
  const [scale, setScale] = useState(1);

  // Zone dimensions for visualization (relative units)
  const zoneSizes = {
    lfz: 120 * scale,
    cfz: 280 * scale,
    sfz: 380 * scale,
    nfz: 500 * scale
  };

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Zone Selector */}
        <div className="space-y-3">
          <h3 className="font-semibold text-foreground">Select Zone</h3>
          {FLIGHT_ZONES.map((zone) => (
            <motion.button
              key={zone.id}
              onClick={() => setSelectedZone(zone)}
              className={cn(
                "w-full p-4 rounded-lg border-2 text-left transition-all",
                selectedZone.id === zone.id 
                  ? "border-blue-500 bg-blue-50" 
                  : "border-gray-200 hover:border-gray-300 bg-card"
              )}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
            >
              <div className="flex items-center">
                <span className="text-2xl mr-3">{zone.icon}</span>
                <div className="flex-1">
                  <div className="font-semibold text-foreground">{zone.acronym}</div>
                  <div className="text-sm text-muted-foreground">{zone.name}</div>
                </div>
              </div>
              <div className="mt-2 text-xs font-mono bg-muted inline-block px-2 py-1 rounded">
                ≤ {zone.exposureLimit}
              </div>
            </motion.button>
          ))}

          {/* Layer Toggles */}
          <div className="mt-6 p-4 bg-muted rounded-lg">
            <h4 className="font-semibold text-foreground mb-3 text-sm">Show Layers</h4>
            {FLIGHT_ZONES.map((zone) => (
              <label key={zone.id} className="flex items-center mb-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showLayers[zone.id as keyof typeof showLayers]}
                  onChange={(e) => setShowLayers(prev => ({ ...prev, [zone.id]: e.target.checked }))}
                  className="mr-2"
                />
                <span className={cn("w-3 h-3 rounded-full mr-2", zone.bgColor)} />
                <span className="text-sm text-muted-foreground">{zone.acronym}</span>
              </label>
            ))}
          </div>

          {/* Scale Control */}
          <div className="p-4 bg-muted rounded-lg">
            <label className="text-sm font-medium text-foreground mb-2 block">
              Visualization Scale
            </label>
            <Slider
              value={[scale]}
              onValueChange={([v]) => setScale(v)}
              min={0.5}
              max={1.5}
              step={0.1}
            />
          </div>
        </div>

        {/* Zone Visual */}
        <div className="lg:col-span-2 space-y-6">
          {/* Airspace Diagram */}
          <div 
            className="bg-gray-900 rounded-xl p-6 relative overflow-hidden flex items-center justify-center"
            style={{ minHeight: "500px" }}
          >
            {/* Airport center */}
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
              <div className="w-16 h-16 bg-card rounded-full flex items-center justify-center shadow-lg">
                <Plane className="w-8 h-8 text-foreground" />
              </div>
              <div className="text-center text-white text-xs mt-1 font-medium">Airport</div>
            </div>

            {/* Zone Circles */}
            <AnimatePresence>
              {showLayers.lfz && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-red-500 bg-red-500/20 flex items-center justify-center"
                  style={{ width: zoneSizes.lfz, height: zoneSizes.lfz }}
                >
                  <span className="text-white text-xs font-bold bg-red-600 px-2 py-1 rounded">LFZ</span>
                </motion.div>
              )}

              {showLayers.cfz && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-orange-500 bg-orange-500/10 flex items-start justify-center pt-4"
                  style={{ width: zoneSizes.cfz, height: zoneSizes.cfz }}
                >
                  <span className="text-white text-xs font-bold bg-orange-500 px-2 py-1 rounded">CFZ</span>
                </motion.div>
              )}

              {showLayers.sfz && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0 }}
                  className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-yellow-500 bg-yellow-500/10"
                  style={{ width: zoneSizes.sfz, height: zoneSizes.sfz }}
                >
                  <span className="absolute top-1/4 right-4 text-white text-xs font-bold bg-yellow-600 px-2 py-1 rounded">SZ</span>
                </motion.div>
              )}

              {showLayers.nfz && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-8 rounded-full border-4 border-green-500/30 flex items-end justify-end pb-8 pr-8"
                  style={{ width: zoneSizes.nfz, height: zoneSizes.nfz, left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }}
                >
                  <span className="text-green-400 text-xs font-bold bg-green-900/50 px-2 py-1 rounded">NFZ</span>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Altitude indicators */}
            <div className="absolute left-4 top-4 text-muted-foreground text-xs space-y-1">
              <div>↑ 10,000+ ft AGL</div>
              <div>↑ 2,000 ft AGL</div>
              <div>→ Surface</div>
            </div>

            {/* Scale */}
            <div className="absolute bottom-4 right-4 bg-black/50 text-white text-xs p-2 rounded">
              <div className="flex items-center">
                <div className="w-20 h-0.5 bg-card mr-2" />
                10 NM
              </div>
            </div>

            {/* Compass rose indicator */}
            <div className="absolute bottom-4 left-4 text-muted-foreground text-xs">
              <div className="font-mono">N ↑</div>
            </div>
          </div>

          {/* Selected Zone Details */}
          <Card className={cn("border-2 overflow-hidden", selectedZone.borderColor)}>
            <CardHeader className={cn("pb-4", selectedZone.id === 'lfz' ? 'bg-red-50' : selectedZone.id === 'cfz' ? 'bg-orange-50' : selectedZone.id === 'sfz' ? 'bg-yellow-50' : 'bg-green-50')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{selectedZone.icon}</span>
                  <div>
                    <CardTitle className={selectedZone.color}>{selectedZone.name}</CardTitle>
                    <p className="opacity-75 text-sm">{selectedZone.acronym}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold">{selectedZone.exposureLimit}</div>
                  <div className="text-sm opacity-75">Maximum Exposure</div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Zone Specifications</h4>
                  <table className="w-full text-sm">
                    <tbody className="divide-y">
                      <tr>
                        <td className="py-2 text-muted-foreground">Typical Radius:</td>
                        <td className="py-2 font-medium">{selectedZone.radius}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-muted-foreground">Altitude:</td>
                        <td className="py-2 font-medium">{selectedZone.altitude}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-muted-foreground">Exposure Limit:</td>
                        <td className="py-2 font-medium font-mono">{selectedZone.exposureLimit}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Critical Flight Phases</h4>
                  <ul className="space-y-2">
                    {selectedZone.criticalPhases.map((phase, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <span className={cn("w-2 h-2 rounded-full mr-2", selectedZone.bgColor)} />
                        {phase}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-4 p-3 bg-muted rounded-lg">
                <p className="text-sm text-muted-foreground">{selectedZone.description}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function VisualEffectsExplorer() {
  const [selectedEffect, setSelectedEffect] = useState<VisualEffect>(VISUAL_EFFECTS[1]);

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-3 gap-4">
        {VISUAL_EFFECTS.map((effect) => (
          <motion.button
            key={effect.id}
            onClick={() => setSelectedEffect(effect)}
            className={cn(
              "p-6 rounded-xl border-2 text-left transition-all",
              selectedEffect.id === effect.id
                ? "border-blue-500 bg-blue-50 shadow-lg"
                : "border-gray-200 hover:border-gray-300 bg-card"
            )}
            whileHover={{ y: -2 }}
          >
            <div className="text-4xl mb-3">{effect.icon}</div>
            <h3 className="font-bold text-lg mb-1">{effect.name}</h3>
            <Badge className={cn(
              effect.severity === 'high' ? 'bg-red-100 text-red-800' :
              effect.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
              'bg-yellow-100 text-yellow-800'
            )}>
              {effect.severity.toUpperCase()} SEVERITY
            </Badge>
          </motion.button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedEffect.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card className={cn("border-2 overflow-hidden", selectedEffect.id === 'glare' ? 'border-orange-200' : selectedEffect.id === 'flashblindness' ? 'border-red-200' : 'border-yellow-200')}>
            <CardHeader className={cn(
              selectedEffect.id === 'glare' ? 'bg-orange-50' : 
              selectedEffect.id === 'flashblindness' ? 'bg-red-50' : 
              'bg-yellow-50'
            )}>
              <div className="flex items-center gap-3">
                <span className="text-4xl">{selectedEffect.icon}</span>
                <div>
                  <CardTitle>{selectedEffect.name}</CardTitle>
                  <CardDescription>
                    Zone: {selectedEffect.zone} | Threshold: {selectedEffect.threshold}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Description</h4>
                  <p className="text-muted-foreground">{selectedEffect.description}</p>
                  
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Effect Duration:</span>
                      <Badge variant="outline">{selectedEffect.duration}</Badge>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground mb-3">Characteristics</h4>
                  <ul className="space-y-2">
                    {selectedEffect.characteristics.map((char, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <ChevronRight className="w-4 h-4 mt-0.5 text-blue-500" />
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Severity comparison */}
              <div className="p-4 bg-muted rounded-lg">
                <h4 className="font-semibold text-foreground mb-3">Visual Effect Comparison</h4>
                <div className="space-y-2">
                  {VISUAL_EFFECTS.map((effect, idx) => (
                    <div 
                      key={effect.id}
                      className={cn(
                        "flex items-center justify-between p-2 rounded",
                        effect.id === selectedEffect.id ? 'bg-card shadow-sm' : ''
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <span>{effect.icon}</span>
                        <span className={cn(
                          "text-sm",
                          effect.id === selectedEffect.id ? 'font-medium' : ''
                        )}>
                          {effect.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs">
                        <span className="text-muted-foreground">{effect.threshold}</span>
                        <Badge className={cn(
                          effect.severity === 'high' ? 'bg-red-100 text-red-800' :
                          effect.severity === 'medium' ? 'bg-orange-100 text-orange-800' :
                          'bg-yellow-100 text-yellow-800'
                        )}>
                          {effect.severity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function ZoneCalculator() {
  const [wavelength, setWavelength] = useState(532);
  const [power, setPower] = useState(10);
  const [divergence, setDivergence] = useState(1.5);
  const [results, setResults] = useState({
    lfed: 0,
    czed: 0,
    szed: 0,
    nohd: 0
  });

  useEffect(() => {
    // Simplified calculations
    const vcf = wavelength >= 400 && wavelength <= 700 
      ? Math.exp(-Math.pow(wavelength - 555, 2) / (2 * 80 * 80))
      : 0;
    
    const vcp = power * Math.max(0.0041, vcf);
    
    // SZED calculation
    const szed = wavelength >= 400 && wavelength <= 700
      ? Math.round((32.8 / divergence) * Math.sqrt(12732 * vcp))
      : 0;
    
    setResults({
      szed,
      czed: szed > 0 ? Math.round(szed * 4.47) : 0,
      lfed: szed > 0 ? Math.round(szed * 44.7) : 0,
      nohd: Math.round((32.8 / divergence) * Math.sqrt((1273.2 * power) / 2.6))
    });
  }, [wavelength, power, divergence]);

  const isVisible = wavelength >= 400 && wavelength <= 700;

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-600" />
              Laser Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Wavelength</label>
                <span className="text-sm font-mono">{wavelength} nm</span>
              </div>
              <Slider
                value={[wavelength]}
                onValueChange={([v]) => setWavelength(v)}
                min={400}
                max={1550}
                step={1}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>400 nm</span>
                <span>532 nm</span>
                <span>1064 nm</span>
                <span>1550 nm</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Power</label>
                <span className="text-sm font-mono">{power} W</span>
              </div>
              <Slider
                value={[power]}
                onValueChange={([v]) => setPower(v)}
                min={0.1}
                max={50}
                step={0.1}
              />
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Beam Divergence</label>
                <span className="text-sm font-mono">{divergence} mrad</span>
              </div>
              <Slider
                value={[divergence]}
                onValueChange={([v]) => setDivergence(v)}
                min={0.5}
                max={5}
                step={0.1}
              />
            </div>

            {!isVisible && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-700">
                  Non-visible laser: Visual interference zones (LFZ, CFZ, SFZ) not applicable
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5 text-blue-600" />
              Zone Distances
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* LFZ/LFED */}
              <div className="p-4 border-2 border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🚫</span>
                    <div>
                      <div className="font-bold text-green-800">LFZ / LFED</div>
                      <div className="text-xs text-green-600">50 nW/cm² threshold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      {isVisible ? results.lfed.toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">feet</div>
                  </div>
                </div>
              </div>

              {/* CFZ/CZED */}
              <div className="p-4 border-2 border-orange-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⚠️</span>
                    <div>
                      <div className="font-bold text-orange-800">CFZ / CZED</div>
                      <div className="text-xs text-orange-600">5 µW/cm² threshold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-orange-600">
                      {isVisible ? results.czed.toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">feet</div>
                  </div>
                </div>
              </div>

              {/* SFZ/SZED */}
              <div className="p-4 border-2 border-yellow-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">👁️</span>
                    <div>
                      <div className="font-bold text-yellow-800">SFZ / SZED</div>
                      <div className="text-xs text-yellow-600">100 µW/cm² threshold</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-yellow-600">
                      {isVisible ? results.szed.toLocaleString() : 'N/A'}
                    </div>
                    <div className="text-xs text-muted-foreground">feet</div>
                  </div>
                </div>
              </div>

              {/* NFZ/NOHD */}
              <div className="p-4 border-2 border-red-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">✓</span>
                    <div>
                      <div className="font-bold text-red-800">NFZ / NOHD</div>
                      <div className="text-xs text-red-600">2.6 mW/cm² MPE</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-red-600">
                      {results.nohd.toLocaleString()}
                    </div>
                    <div className="text-xs text-muted-foreground">feet</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-muted rounded-lg text-sm text-muted-foreground">
              <strong>Relationships:</strong> CZED = SZED × 4.47 | LFED = SZED × 44.7
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

export default function Module6_Aviation_Zones() {
  const [activeTab, setActiveTab] = useState('visualizer');

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
          Module 6.6
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Aviation Safety Zones</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Interactive visualization of Laser Free Zone (LFZ), Critical Flight Zone (CFZ), 
          Sensitive Zone (SZ), and Normal Zone (NZ) with zone-based calculations.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="visualizer" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            Zone Visualizer
          </TabsTrigger>
          <TabsTrigger value="effects" className="flex items-center gap-2">
            <Eye className="w-4 h-4" />
            Visual Effects
          </TabsTrigger>
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            Zone Calculator
          </TabsTrigger>
        </TabsList>

        <TabsContent value="visualizer" className="mt-6">
          <ZoneVisualizer />
        </TabsContent>

        <TabsContent value="effects" className="mt-6">
          <VisualEffectsExplorer />
        </TabsContent>

        <TabsContent value="calculator" className="mt-6">
          <ZoneCalculator />
        </TabsContent>
      </Tabs>

      {/* Reference */}
      <Card className="bg-muted border-gray-200">
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">
            <strong>Reference:</strong> FAA AC 70-1B, Appendix D - Flight Zone Classifications. 
            Distraction threshold: 50 nW/cm² (LFZ), Glare threshold: 5 µW/cm² (CFZ), 
            Flashblindness threshold: 100 µW/cm² (SZ), MPE: 2.6 mW/cm² (NFZ).
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
