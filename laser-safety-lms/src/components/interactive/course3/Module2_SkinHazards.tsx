'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Thermometer, 
  Sun, 
  Shield, 
  AlertTriangle, 
  Activity,
  Droplets,
  Eye,
  Timer,
  Flame,
  HardHat,
  Info,
  ChevronRight,
  Microscope,
  Radiation,
  Heart,
  Beaker,
  Dna
} from 'lucide-react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

type Section = 'structure' | 'thermal' | 'photochemical' | 'mpe' | 'protection';
type SkinLayer = 'epidermis' | 'dermis' | 'subcutaneous';
type SkinType = 'I' | 'II' | 'III' | 'IV' | 'V' | 'VI';
type BurnDegree = 'first' | 'second' | 'third';

interface SkinTypeData {
  type: SkinType;
  name: string;
  description: string;
  melanin: string;
  uvSensitivity: number;
  laserRisk: string;
  typicalFeatures: string[];
  color: string;
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const SKIN_TYPES: SkinTypeData[] = [
  { type: 'I', name: 'Type I - Very Fair', description: 'Always burns, never tans', melanin: 'Minimal', uvSensitivity: 100, laserRisk: 'Highest risk', typicalFeatures: ['Pale white skin', 'Freckles', 'Red/blonde hair'], color: '#FEF3C7' },
  { type: 'II', name: 'Type II - Fair', description: 'Usually burns, tans minimally', melanin: 'Low', uvSensitivity: 85, laserRisk: 'Very High', typicalFeatures: ['Fair skin', 'Blonde/light brown hair'], color: '#FDE68A' },
  { type: 'III', name: 'Type III - Medium', description: 'Sometimes burns, tans gradually', melanin: 'Moderate', uvSensitivity: 65, laserRisk: 'Moderate', typicalFeatures: ['Cream white to olive', 'Dark blonde to brown hair'], color: '#FCD34D' },
  { type: 'IV', name: 'Type IV - Olive', description: 'Rarely burns, tans easily', melanin: 'Significant', uvSensitivity: 40, laserRisk: 'Moderate', typicalFeatures: ['Olive/light brown skin', 'Dark brown hair'], color: '#D97706' },
  { type: 'V', name: 'Type V - Brown', description: 'Very rarely burns, tans darkly', melanin: 'High', uvSensitivity: 20, laserRisk: 'Lower', typicalFeatures: ['Brown skin', 'Dark brown to black hair'], color: '#B45309' },
  { type: 'VI', name: 'Type VI - Dark Brown', description: 'Never burns, deeply pigmented', melanin: 'Very High', uvSensitivity: 10, laserRisk: 'Lowest', typicalFeatures: ['Dark brown to black skin', 'Black hair'], color: '#78350F' },
];

const BURN_THRESHOLDS = [
  { temp: 44, time: 360, degree: 'first', description: 'Pain threshold' },
  { temp: 47, time: 45, degree: 'first', description: 'Erythema threshold' },
  { temp: 50, time: 60, degree: 'second', description: 'Epidermal necrosis' },
  { temp: 55, time: 10, degree: 'second', description: 'Dermal damage' },
  { temp: 60, time: 5, degree: 'third', description: 'Full-threshold coagulation' },
  { temp: 70, time: 1, degree: 'third', description: 'Rapid protein denaturation' },
];

const SKIN_MPE_DATA = [
  { wavelength: '180-400 nm', region: 'UV', skinMpe: '3.0 mJ/cm²', eyeMpe: '3.0 mJ/cm²', ratio: '1:1', notes: 'Photochemical damage' },
  { wavelength: '400-700 nm', region: 'Visible', skinMpe: '0.2 W/cm²', eyeMpe: '1.0 µW/cm²', ratio: '200,000:1', notes: 'Retinal hazard region' },
  { wavelength: '700-1400 nm', region: 'Near-IR', skinMpe: '0.2 W/cm²', eyeMpe: '1.0 µW/cm²', ratio: '200,000:1', notes: 'Retinal hazard region' },
  { wavelength: '1400-3000 nm', region: 'SWIR', skinMpe: '1.0 W/cm²', eyeMpe: '10 mW/cm²', ratio: '100:1', notes: 'Corneal absorption begins' },
  { wavelength: '> 3000 nm', region: 'MIR/FIR', skinMpe: '0.1 W/cm²', eyeMpe: '100 mW/cm²', ratio: '1:1', notes: 'Surface water absorption' },
];

const UV_EFFECTS = [
  { wavelength: '100-280 nm', name: 'UV-C', dnaDamage: 'Severe', cancerRisk: 'Moderate', effects: ['DNA thymine dimers', 'Microbial inactivation', 'Erythema'] },
  { wavelength: '280-315 nm', name: 'UV-B', dnaDamage: 'High', cancerRisk: 'High', effects: ['Direct DNA damage', 'Sunburn', 'Skin cancer risk'] },
  { wavelength: '315-400 nm', name: 'UV-A', dnaDamage: 'Moderate', cancerRisk: 'Moderate-High', effects: ['ROS formation', 'Photoaging', 'Melanoma risk'] },
];

const PROTECTION_STRATEGIES = [
  { category: 'Engineering', icon: HardHat, items: ['Beam enclosures', 'Interlocks', 'Remote viewing'] },
  { category: 'Administrative', icon: Shield, items: ['SOPs', 'Warning signs', 'Training'] },
  { category: 'PPE', icon: Eye, items: ['Long sleeves', 'UV-blocking gloves', 'Face shields'] },
];

// ============================================================================
// SECTION 1: SKIN STRUCTURE - DERMATOLOGY STYLE
// ============================================================================

function SkinStructureSection() {
  const [selectedLayer, setSelectedLayer] = useState<SkinLayer>('epidermis');
  const [selectedSkinType, setSelectedSkinType] = useState<number>(2);

  const layerData = {
    epidermis: {
      name: 'Epidermis',
      thickness: '0.05-1.5 mm',
      description: 'Stratified squamous epithelium with keratinocytes and melanocytes',
      laserInteraction: 'Primary UV absorption; melanin absorbs 400-1400nm',
      hazards: ['UV burns', 'Pigment changes', 'Photosensitivity'],
      penetration: { uv: 100, visible: 30, nir: 20, fir: 100 }
    },
    dermis: {
      name: 'Dermis',
      thickness: '1-4 mm',
      description: 'Connective tissue with collagen, elastin, blood vessels, and nerves',
      laserInteraction: 'Deep penetration of visible/NIR; thermal diffusion',
      hazards: ['Thermal burns', 'Vascular damage', 'Collagen denaturation'],
      penetration: { uv: 0, visible: 70, nir: 80, fir: 0 }
    },
    subcutaneous: {
      name: 'Subcutaneous Tissue',
      thickness: '5-30 mm',
      description: 'Adipose and connective tissue providing insulation and cushioning',
      laserInteraction: 'Only reached by deeply penetrating wavelengths',
      hazards: ['Deep thermal injury', 'Fat necrosis', 'Delayed healing'],
      penetration: { uv: 0, visible: 0, nir: 0, fir: 0 }
    }
  };

  const currentLayer = layerData[selectedLayer];
  const skinType = SKIN_TYPES[selectedSkinType];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Dermatology-Style Skin Cross-Section */}
        <Card>
          <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-900">
            <CardTitle className="text-base flex items-center gap-2">
              <Microscope className="w-4 h-4 text-blue-600" />
              Skin Cross-Section
            </CardTitle>
            <CardDescription>Click layers to explore laser interaction</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="bg-gradient-to-b from-slate-50 to-amber-50/30 dark:from-slate-900 dark:to-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-4">
              <svg viewBox="0 0 300 220" className="w-full h-56">
                <defs>
                  <pattern id="epidermisPattern" patternUnits="userSpaceOnUse" width="8" height="8">
                    <path d="M0,4 Q2,0 4,4 T8,4" fill="none" stroke="#FDE68A" strokeWidth="0.5" opacity="0.5"/>
                  </pattern>
                  <pattern id="dermisPattern" patternUnits="userSpaceOnUse" width="12" height="12">
                    <circle cx="3" cy="3" r="1" fill="#FECACA" opacity="0.4"/>
                    <circle cx="9" cy="9" r="1" fill="#FECACA" opacity="0.4"/>
                  </pattern>
                </defs>
                
                {/* Subcutaneous - bottom */}
                <rect 
                  x="20" y="140" width="260" height="70" 
                  fill={selectedLayer === 'subcutaneous' ? '#FDBA74' : '#FED7AA'} 
                  stroke="#EA580C" strokeWidth="2"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedLayer('subcutaneous')}
                  rx="4"
                />
                {/* Adipose texture */}
                {[40, 80, 120, 160, 200, 240].map((x, i) => (
                  <ellipse key={i} cx={x} cy={160 + (i % 3) * 15} rx="12" ry="8" fill="#FDBA74" opacity="0.4" />
                ))}
                <text x="30" y="175" className="text-xs fill-orange-900 font-semibold">Subcutaneous</text>
                <text x="30" y="188" className="text-[9px] fill-orange-700">Adipose & Connective Tissue</text>
                
                {/* Dermis - middle */}
                <rect 
                  x="20" y="70" width="260" height="70" 
                  fill={selectedLayer === 'dermis' ? '#FCA5A5' : 'url(#dermisPattern) #FECACA'} 
                  stroke="#DC2626" strokeWidth="2"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedLayer('dermis')}
                  rx="4"
                />
                {/* Blood vessels */}
                <path d="M 60 100 Q 90 90 120 100 Q 150 110 180 100" fill="none" stroke="#DC2626" strokeWidth="3" opacity="0.5" />
                <path d="M 200 110 Q 230 100 260 110" fill="none" stroke="#DC2626" strokeWidth="2" opacity="0.4" />
                {/* Nerve endings */}
                <line x1="100" y1="80" x2="100" y2="95" stroke="#7C3AED" strokeWidth="1.5" opacity="0.5" />
                <line x1="220" y1="85" x2="220" y2="100" stroke="#7C3AED" strokeWidth="1.5" opacity="0.5" />
                <text x="30" y="105" className="text-xs fill-red-900 font-semibold">Dermis</text>
                <text x="30" y="118" className="text-[9px] fill-red-700">Collagen, Vessels, Nerves</text>
                
                {/* Epidermis - top with undulating border */}
                <path 
                  d="M 20 70 Q 60 65 100 68 Q 140 72 180 70 Q 220 68 260 70 L 280 70 L 280 40 Q 150 30 20 40 Z"
                  fill={selectedLayer === 'epidermis' ? '#FDE047' : 'url(#epidermisPattern) #FEF08A'} 
                  stroke="#CA8A04" strokeWidth="2"
                  className="cursor-pointer transition-colors"
                  onClick={() => setSelectedLayer('epidermis')}
                />
                {/* Stratum corneum layer */}
                <path d="M 20 40 Q 150 30 280 40 L 280 35 Q 150 25 20 35 Z" fill="#FEF9C3" opacity="0.8" />
                {/* Melanin granules */}
                {[50, 100, 150, 200, 250].map((x, i) => (
                  <circle key={i} cx={x} cy={50 + Math.random() * 10} r="2.5" fill="#854D0E" opacity="0.6" />
                ))}
                {/* Hair follicle */}
                <ellipse cx="80" cy="55" rx="6" ry="20" fill="#FED7AA" stroke="#EA580C" strokeWidth="1" opacity="0.6" />
                <line x1="80" y1="35" x2="80" y2="15" stroke="#57534E" strokeWidth="2" />
                <text x="30" y="58" className="text-xs fill-yellow-900 font-semibold">Epidermis</text>
                <text x="30" y="70" className="text-[9px] fill-yellow-700">Stratified Squamous Epithelium</text>
                
                {/* Depth markers */}
                <text x="5" y="45" className="text-[8px] fill-slate-500">0mm</text>
                <text x="5" y="105" className="text-[8px] fill-slate-500">1mm</text>
                <text x="5" y="175" className="text-[8px] fill-slate-500">5mm</text>
                
                {/* Laser beam indicator */}
                <line x1="280" y1="15" x2="150" y2="45" stroke="#DC2626" strokeWidth="2" strokeDasharray="4 2" />
                <text x="285" y="15" className="text-xs fill-red-600 font-bold">λ</text>
              </svg>
            </div>

            <div className="flex gap-2 mt-4">
              {(Object.keys(layerData) as SkinLayer[]).map((layer) => (
                <Button
                  key={layer}
                  variant={selectedLayer === layer ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedLayer(layer)}
                  className="flex-1 text-xs"
                >
                  {layerData[layer].name}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Layer Details Card */}
        <Card className="border-l-4" style={{ borderLeftColor: selectedLayer === 'epidermis' ? '#EAB308' : selectedLayer === 'dermis' ? '#EF4444' : '#F97316' }}>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">{currentLayer.name}</CardTitle>
            <CardDescription className="font-mono text-xs">Thickness: {currentLayer.thickness}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-foreground">{currentLayer.description}</p>
            
            <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
              <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-1 flex items-center gap-1">
                <Radiation className="w-3 h-3" />
                Laser Interaction
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-400">{currentLayer.laserInteraction}</p>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Hazards:</h4>
              <ul className="space-y-1">
                {currentLayer.hazards.map((hazard, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-center gap-2">
                    <AlertTriangle className="w-3 h-3 text-amber-500" />
                    {hazard}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Fitzpatrick Scale Card */}
      <Card>
        <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-900">
          <CardTitle className="text-base flex items-center gap-2">
            <Sun className="w-4 h-4 text-amber-500" />
            Fitzpatrick Skin Type Classification
          </CardTitle>
          <CardDescription>Melanin content affects laser absorption and thermal injury risk</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex gap-1 flex-wrap">
            {SKIN_TYPES.map((type, i) => (
              <Button
                key={type.type}
                variant={selectedSkinType === i ? 'default' : 'outline'}
                onClick={() => setSelectedSkinType(i)}
                className="flex-1 min-w-[70px] text-xs"
                size="sm"
                style={{ backgroundColor: selectedSkinType === i ? type.color : undefined }}
              >
                <span className="w-3 h-3 rounded-full mr-1 border border-black/20" style={{ backgroundColor: type.color }} />
                Type {type.type}
              </Button>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg border">
              <h4 className="font-medium mb-2 text-slate-900 dark:text-slate-100">{skinType.name}</h4>
              <p className="text-sm text-muted-foreground mb-3">{skinType.description}</p>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Melanin:</span>
                  <Badge variant="outline" className="text-xs">{skinType.melanin}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">UV Sensitivity:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-20 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-green-500 to-red-500" style={{ width: `${skinType.uvSensitivity}%` }} />
                    </div>
                    <span className="text-xs font-mono">{skinType.uvSensitivity}%</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg border">
              <h4 className="font-medium mb-2">Laser Risk Assessment</h4>
              <div className={`text-sm font-semibold ${skinType.uvSensitivity > 70 ? 'text-red-600' : skinType.uvSensitivity > 40 ? 'text-amber-600' : 'text-green-600'}`}>
                {skinType.laserRisk}
              </div>
              
              <div className="mt-3">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-1">Features:</h5>
                <div className="flex flex-wrap gap-1">
                  {skinType.typicalFeatures.map((feature, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{feature}</Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
            <h4 className="text-sm font-semibold text-blue-800 dark:text-blue-400 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Clinical Note: Melanin Absorption
            </h4>
            <p className="text-sm text-foreground">
              Melanin absorbs strongly across 400-1400 nm. Darker skin types have higher surface absorption, 
              paradoxically making them <strong>more susceptible</strong> to epidermal thermal damage from visible/NIR lasers, 
              while providing UV protection.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 2: THERMAL INJURY - CLINICAL BURN ASSESSMENT
// ============================================================================

function ThermalInjurySection() {
  const [temperature, setTemperature] = useState(55);
  const [exposureTime, setExposureTime] = useState(10);
  const [selectedBurnDegree, setSelectedBurnDegree] = useState<BurnDegree>('second');

  const calculateBurnSeverity = (temp: number, time: number) => {
    const damage = time * Math.exp((temp - 44) / 5);
    if (damage < 10) return { degree: 'first', severity: damage / 10, description: 'Erythema, minimal damage' };
    if (damage < 100) return { degree: 'first', severity: damage / 100, description: 'First degree - epidermal injury' };
    if (damage < 1000) return { degree: 'second', severity: damage / 1000, description: 'Second degree - dermal involvement' };
    return { degree: 'third', severity: Math.min(damage / 10000, 1), description: 'Third degree - full thickness' };
  };

  const burnResult = calculateBurnSeverity(temperature, exposureTime);

  const burnDescriptions = {
    first: {
      name: 'First Degree (Erythema)',
      appearance: 'Erythematous, dry, painful',
      healing: '3-7 days, no scarring',
      depth: 'Epidermis only',
      laserCause: 'Brief exposure, low power'
    },
    second: {
      name: 'Second Degree (Partial Thickness)',
      appearance: 'Bullae formation, moist, severe pain',
      healing: '2-3 weeks, possible scarring',
      depth: 'Epidermis + Dermis',
      laserCause: 'Moderate exposure, steam formation'
    },
    third: {
      name: 'Third Degree (Full Thickness)',
      appearance: 'White/charred, leathery, painless',
      healing: 'Requires surgical intervention',
      depth: 'Full thickness + appendages',
      laserCause: 'High power, prolonged exposure'
    }
  };

  const currentBurn = burnDescriptions[selectedBurnDegree];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Burn Calculator */}
        <Card>
          <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-900">
            <CardTitle className="text-base flex items-center gap-2">
              <Thermometer className="w-4 h-4 text-red-600" />
              Thermal Injury Calculator
            </CardTitle>
            <CardDescription>Henriques burn integral approximation</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Tissue Temperature: <span className="font-mono font-bold">{temperature}°C</span></Label>
                  <Badge variant={temperature > 60 ? 'destructive' : temperature > 50 ? 'default' : 'secondary'}>
                    {temperature > 60 ? 'CRITICAL' : temperature > 50 ? 'WARNING' : 'SAFE'}
                  </Badge>
                </div>
                <Slider value={[temperature]} onValueChange={(v) => setTemperature(v[0])} min={37} max={100} step={1} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>37°C</span><span>44°C</span><span>55°C</span><span>70°C</span><span>100°C</span>
                </div>
                <div className="flex justify-between text-[9px] text-slate-400 mt-0.5">
                  <span>Body</span><span>Pain</span><span>Blisters</span><span>Coag</span><span>Char</span>
                </div>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <Label className="text-sm">Exposure Time: <span className="font-mono font-bold">{exposureTime < 1 ? `${(exposureTime * 1000).toFixed(0)} ms` : `${exposureTime.toFixed(1)} s`}</span></Label>
                </div>
                <Slider value={[Math.log10(exposureTime * 1000)]} onValueChange={(v) => setExposureTime(Math.pow(10, v[0]) / 1000)} min={0} max={4} step={0.1} />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>1 ms</span><span>10 ms</span><span>100 ms</span><span>1 s</span><span>10 s</span>
                </div>
              </div>
            </div>

            <div className={`p-4 rounded-lg border-2 ${
              burnResult.degree === 'third' ? 'bg-red-50 border-red-300' :
              burnResult.degree === 'second' ? 'bg-orange-50 border-orange-300' :
              'bg-green-50 border-green-300'
            }`}>
              <div className="flex items-center gap-2 mb-2">
                <Flame className={`w-5 h-5 ${
                  burnResult.degree === 'third' ? 'text-red-600' :
                  burnResult.degree === 'second' ? 'text-orange-600' : 'text-green-600'
                }`} />
                <h4 className="font-semibold text-sm">Predicted Injury</h4>
              </div>
              <div className="text-lg font-bold capitalize">{burnResult.degree} Degree Thermal Injury</div>
              <p className="text-sm text-muted-foreground mt-1">{burnResult.description}</p>
              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Damage Index</span>
                  <span className="font-mono">{(burnResult.severity * 100).toFixed(0)}%</span>
                </div>
                <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div className={`h-full transition-all ${
                    burnResult.degree === 'third' ? 'bg-red-600' :
                    burnResult.degree === 'second' ? 'bg-orange-500' : 'bg-green-500'
                  }`} style={{ width: `${burnResult.severity * 100}%` }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Burn Classification */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Burn Classification</CardTitle>
            <CardDescription>Select to view clinical characteristics</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {(Object.keys(burnDescriptions) as BurnDegree[]).map((degree) => (
                <Button
                  key={degree}
                  variant={selectedBurnDegree === degree ? 'default' : 'outline'}
                  onClick={() => setSelectedBurnDegree(degree)}
                  className="flex-1 text-xs"
                  size="sm"
                >
                  {degree === 'first' ? '1°' : degree === 'second' ? '2°' : '3°'} Degree
                </Button>
              ))}
            </div>

            <div className="p-4 bg-muted rounded-lg border">
              <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">{currentBurn.name}</h4>
              
              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20 shrink-0">Appearance:</span>
                  <span className="text-foreground">{currentBurn.appearance}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20 shrink-0">Healing:</span>
                  <span className="text-foreground">{currentBurn.healing}</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-muted-foreground w-20 shrink-0">Depth:</span>
                  <span className="text-foreground">{currentBurn.depth}</span>
                </div>
              </div>
            </div>

            {/* Visual representation */}
            <div className="h-32 bg-muted rounded-lg border relative overflow-hidden">
              <svg viewBox="0 0 200 100" className="w-full h-full">
                <rect x="20" y="20" width="160" height="25" fill="#FEF08A" stroke="#EAB308" />
                <rect x="20" y="45" width="160" height="35" fill="#FECACA" stroke="#EF4444" />
                
                {selectedBurnDegree === 'first' && (
                  <g>
                    <rect x="20" y="20" width="160" height="25" fill="#EF4444" opacity="0.3" />
                    <text x="100" y="35" textAnchor="middle" className="text-xs fill-red-700 font-bold">EPIDERMIS</text>
                  </g>
                )}
                {selectedBurnDegree === 'second' && (
                  <g>
                    <rect x="20" y="20" width="160" height="40" fill="#EF4444" opacity="0.4" />
                    <circle cx="60" cy="50" r="6" fill="#FEF3C7" stroke="#F59E0B" />
                    <circle cx="140" cy="48" r="8" fill="#FEF3C7" stroke="#F59E0B" />
                    <text x="100" y="85" textAnchor="middle" className="text-xs fill-red-700 font-bold">BLISTER FORMATION</text>
                  </g>
                )}
                {selectedBurnDegree === 'third' && (
                  <g>
                    <rect x="20" y="20" width="160" height="60" fill="#1F2937" opacity="0.5" />
                    <text x="100" y="55" textAnchor="middle" className="text-xs fill-white font-bold">FULL THICKNESS</text>
                  </g>
                )}
              </svg>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Temperature-Time Threshold Table */}
      <Card>
        <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-900">
          <CardTitle className="text-base flex items-center gap-2">
            <Timer className="w-4 h-4 text-blue-600" />
            Temperature-Time Thresholds for Skin Damage
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">Temperature</th>
                  <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">Time to Injury</th>
                  <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">Classification</th>
                  <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">Clinical Finding</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {BURN_THRESHOLDS.map((threshold, i) => (
                  <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="py-3 px-3">
                      <Badge variant={threshold.temp > 60 ? 'destructive' : 'outline'} className="font-mono">{threshold.temp}°C</Badge>
                    </td>
                    <td className="py-3 px-3 font-mono text-muted-foreground">
                      {threshold.time < 1 ? `${(threshold.time * 60).toFixed(0)} sec` : `${threshold.time} min`}
                    </td>
                    <td className="py-3 px-3 capitalize">
                      <span className={`inline-flex items-center gap-1.5 ${
                        threshold.degree === 'third' ? 'text-red-600 font-semibold' :
                        threshold.degree === 'second' ? 'text-orange-600' : 'text-amber-600'
                      }`}>
                        <span className={`w-2 h-2 rounded-full ${
                          threshold.degree === 'third' ? 'bg-red-500' :
                          threshold.degree === 'second' ? 'bg-orange-500' : 'bg-amber-500'
                        }`} />
                        {threshold.degree} Degree
                      </span>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-sm">{threshold.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 3: PHOTOCHEMICAL EFFECTS
// ============================================================================

function PhotochemicalSection() {
  const [selectedUV, setSelectedUV] = useState(0);
  const [dnaDamageLevel, setDnaDamageLevel] = useState(50);

  const uvData = UV_EFFECTS[selectedUV];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-900">
            <CardTitle className="text-base flex items-center gap-2">
              <Radiation className="w-4 h-4 text-purple-600" />
              UV Photochemical Damage Mechanisms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              {UV_EFFECTS.map((uv, i) => (
                <Button
                  key={uv.name}
                  variant={selectedUV === i ? 'default' : 'outline'}
                  onClick={() => setSelectedUV(i)}
                  className="flex-1 text-xs"
                  size="sm"
                >
                  {uv.name}
                </Button>
              ))}
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-950/30 rounded-lg border border-purple-200">
              <h4 className="font-semibold text-purple-900 dark:text-purple-400 mb-3">{uvData.name} ({uvData.wavelength})</h4>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">DNA Damage:</span>
                  <Badge variant={uvData.dnaDamage === 'Severe' ? 'destructive' : uvData.dnaDamage === 'High' ? 'default' : 'secondary'}>
                    {uvData.dnaDamage}
                  </Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Cancer Risk:</span>
                  <Badge variant={uvData.cancerRisk.includes('High') ? 'destructive' : 'default'}>
                    {uvData.cancerRisk}
                  </Badge>
                </div>
              </div>

              <div className="mt-4">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Biological Effects:</h5>
                <ul className="space-y-1">
                  {uvData.effects.map((effect, i) => (
                    <li key={i} className="text-sm text-foreground flex items-center gap-2">
                      <Dna className="w-3 h-3 text-purple-500" />
                      {effect}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500" />
              UV-Induced Carcinogenesis
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200">
              <h4 className="text-sm font-semibold text-red-700 mb-3">Skin Cancer Types</h4>
              <div className="space-y-2">
                {[
                  { code: 'SCC', name: 'Squamous Cell Carcinoma', desc: 'Keratinocyte malignancy from UV-B' },
                  { code: 'BCC', name: 'Basal Cell Carcinoma', desc: 'Most common, UV-induced DNA damage' },
                  { code: 'MM', name: 'Malignant Melanoma', desc: 'Most serious, linked to UV-A' },
                ].map((cancer) => (
                  <div key={cancer.code} className="flex items-start gap-2">
                    <Badge variant="destructive" className="shrink-0 text-xs">{cancer.code}</Badge>
                    <div>
                      <span className="text-sm font-medium text-foreground">{cancer.name}</span>
                      <p className="text-xs text-muted-foreground">{cancer.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200">
                <h5 className="text-xs font-semibold text-amber-700 uppercase mb-2">Acute Effects</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Erythema (sunburn)</li>
                  <li>• Photokeratitis</li>
                  <li>• Immediate DNA damage</li>
                  <li>• Immune suppression</li>
                </ul>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200">
                <h5 className="text-xs font-semibold text-muted-foreground uppercase mb-2">Chronic Effects</h5>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Photoaging</li>
                  <li>• Wrinkling</li>
                  <li>• Pigment changes</li>
                  <li>• Cancer development</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* DNA Damage Accumulation */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Cumulative DNA Damage Concept</CardTitle>
          <CardDescription>Sub-threshold exposures accumulate over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <Label>Simulated UV Dose (years of exposure)</Label>
                <span className="text-sm font-mono font-medium">{dnaDamageLevel}%</span>
              </div>
              <Slider value={[dnaDamageLevel]} onValueChange={(v) => setDnaDamageLevel(v[0])} min={0} max={100} step={1} />
            </div>

            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Normal', range: '0-25%', icon: '🧬', color: 'bg-green-100 border-green-400' },
                { label: 'Early Changes', range: '25-50%', icon: '⚠️', color: 'bg-yellow-100 border-yellow-400' },
                { label: 'Actinic Keratosis', range: '50-75%', icon: '🔬', color: 'bg-orange-100 border-orange-400' },
                { label: 'Cancer Risk', range: '75-100%', icon: '🏥', color: 'bg-red-100 border-red-400' },
              ].map((stage, i) => {
                const isActive = dnaDamageLevel >= i * 25 && dnaDamageLevel < (i + 1) * 25 || (i === 3 && dnaDamageLevel >= 75);
                return (
                  <div key={i} className={`p-3 rounded-lg text-center border-2 transition-all ${isActive ? stage.color : 'bg-muted border opacity-50'}`}>
                    <div className="text-2xl mb-1">{stage.icon}</div>
                    <div className="text-xs font-semibold">{stage.label}</div>
                    <div className="text-[10px] text-muted-foreground">{stage.range}</div>
                  </div>
                );
              })}
            </div>

            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
              <strong>Note:</strong> DNA repair mechanisms exist but can be overwhelmed by repeated exposure. 
              Latency period for UV-induced skin cancer: 10-30 years.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 4: MPE FOR SKIN - SCIENTIFIC TABLE
// ============================================================================

function MpeSection() {
  const [selectedWavelength, setSelectedWavelength] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-2 bg-slate-50 dark:bg-slate-900">
          <CardTitle className="text-base flex items-center gap-2">
            <Activity className="w-4 h-4 text-blue-600" />
            Skin MPE Values by Wavelength Region
          </CardTitle>
          <CardDescription>ANSI Z136.1 Maximum Permissible Exposure limits for skin</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">Wavelength</th>
                  <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">Region</th>
                  <th className="text-right py-3 px-3 text-xs uppercase tracking-wider">Skin MPE</th>
                  <th className="text-right py-3 px-3 text-xs uppercase tracking-wider">Eye MPE</th>
                  <th className="text-center py-3 px-3 text-xs uppercase tracking-wider">Ratio</th>
                  <th className="text-left py-3 px-3 text-xs uppercase tracking-wider">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {SKIN_MPE_DATA.map((mpe, i) => (
                  <tr 
                    key={i} 
                    className={`cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${selectedWavelength === i ? 'bg-blue-50 dark:bg-blue-950/20' : ''}`}
                    onClick={() => setSelectedWavelength(i)}
                  >
                    <td className="py-3 px-3 font-mono text-foreground">{mpe.wavelength}</td>
                    <td className="py-3 px-3"><Badge variant="outline" className="text-xs">{mpe.region}</Badge></td>
                    <td className="py-3 px-3 text-right font-mono text-emerald-600 font-medium">{mpe.skinMpe}</td>
                    <td className="py-3 px-3 text-right font-mono text-red-600 font-medium">{mpe.eyeMpe}</td>
                    <td className="py-3 px-3 text-center">
                      <Badge variant={mpe.ratio.includes('200,000') ? 'destructive' : 'default'} className="text-xs font-mono">
                        {mpe.ratio}
                      </Badge>
                    </td>
                    <td className="py-3 px-3 text-muted-foreground text-xs">{mpe.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {selectedWavelength !== null && (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950/30 rounded-lg border border-blue-200">
              <h4 className="font-semibold text-blue-900 dark:text-blue-400 text-sm mb-2">
                Analysis: {SKIN_MPE_DATA[selectedWavelength].region} Region
              </h4>
              <p className="text-sm text-foreground">
                Skin MPE is {SKIN_MPE_DATA[selectedWavelength].ratio} relative to eye MPE in this region.
                {SKIN_MPE_DATA[selectedWavelength].ratio.includes('200,000') 
                  ? ' The eye is vastly more vulnerable due to retinal focusing.' 
                  : ' Similar protection levels apply for both skin and eyes.'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Eye vs Skin Comparison */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="w-4 h-4 text-blue-600" />
            Clinical Comparison: Eye vs. Skin MPE
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-700 mb-3">Retinal Hazard (400-1400 nm)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Eye MPE:</span><span className="font-mono text-red-600">1 µW/cm²</span></div>
                <div className="flex justify-between"><span>Skin MPE:</span><span className="font-mono text-emerald-600">200 mW/cm²</span></div>
              </div>
              <div className="mt-3 pt-2 border-t text-sm font-medium">Ratio: 200,000:1</div>
              <p className="text-xs text-muted-foreground mt-2">Eyes extremely vulnerable due to focusing</p>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-700 mb-3">UV Region (180-400 nm)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Eye MPE:</span><span className="font-mono text-orange-600">3 mJ/cm²</span></div>
                <div className="flex justify-between"><span>Skin MPE:</span><span className="font-mono text-emerald-600">3-30 mJ/cm²</span></div>
              </div>
              <div className="mt-3 pt-2 border-t text-sm font-medium">Ratio: ~1:1 to 10:1</div>
              <p className="text-xs text-muted-foreground mt-2">Similar limits - both surface-absorbed</p>
            </div>

            <div className="p-4 bg-muted rounded-lg border">
              <h4 className="font-semibold text-foreground mb-3">Far-IR Region (&gt;1400 nm)</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between"><span>Eye MPE:</span><span className="font-mono text-amber-600">10-100 mW/cm²</span></div>
                <div className="flex justify-between"><span>Skin MPE:</span><span className="font-mono text-emerald-600">100 mW/cm²</span></div>
              </div>
              <div className="mt-3 pt-2 border-t text-sm font-medium">Ratio: ~1:1 to 10:1</div>
              <p className="text-xs text-muted-foreground mt-2">Both superficial - surface heating</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 5: PROTECTION
// ============================================================================

function ProtectionSection() {
  const [selectedStrategy, setSelectedStrategy] = useState(0);
  const [firstAidStep, setFirstAidStep] = useState(0);

  const firstAidSteps = [
    { title: 'Immediate Action', description: 'Remove from exposure. Do NOT apply ice directly.' },
    { title: 'Cool the Burn', description: 'Cool with cool (not cold) water for 10-20 minutes.' },
    { title: 'Cover', description: 'Cover with sterile, non-adhesive dressing.' },
    { title: 'Medical Evaluation', description: 'Seek medical care for anything beyond minor erythema.' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-600" />
              Hierarchy of Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2 flex-wrap">
              {PROTECTION_STRATEGIES.map((strategy, i) => {
                const Icon = strategy.icon;
                return (
                  <Button
                    key={i}
                    variant={selectedStrategy === i ? 'default' : 'outline'}
                    onClick={() => setSelectedStrategy(i)}
                    className="flex-1 min-w-[100px]"
                    size="sm"
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {strategy.category}
                  </Button>
                );
              })}
            </div>

            <div className="p-4 bg-muted rounded-lg border">
              <h4 className="font-semibold mb-3">{PROTECTION_STRATEGIES[selectedStrategy].category} Controls</h4>
              <div className="grid sm:grid-cols-2 gap-2">
                {PROTECTION_STRATEGIES[selectedStrategy].items.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 p-2 bg-card rounded border">
                    <Shield className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Heart className="w-4 h-4 text-red-500" />
              First Aid Protocol
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-1">
              {firstAidSteps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setFirstAidStep(i)}
                  className={`flex-1 h-2 rounded-full transition-colors ${i <= firstAidStep ? 'bg-emerald-500' : 'bg-slate-200'}`}
                />
              ))}
            </div>

            <div className="p-4 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  {firstAidStep + 1}
                </div>
                <h4 className="font-semibold text-red-700">{firstAidSteps[firstAidStep].title}</h4>
              </div>
              <p className="text-sm text-muted-foreground">{firstAidSteps[firstAidStep].description}</p>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => setFirstAidStep(Math.max(0, firstAidStep - 1))} disabled={firstAidStep === 0} className="flex-1">Previous</Button>
              <Button size="sm" onClick={() => setFirstAidStep(Math.min(firstAidSteps.length - 1, firstAidStep + 1))} disabled={firstAidStep === firstAidSteps.length - 1} className="flex-1">Next</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default function Module2_SkinHazards() {
  const [activeSection, setActiveSection] = useState<Section>('structure');

  const sections: { id: Section; label: string; component: React.ComponentType; icon: React.ElementType }[] = [
    { id: 'structure', label: 'Skin Structure', component: SkinStructureSection, icon: Microscope },
    { id: 'thermal', label: 'Thermal Injury', component: ThermalInjurySection, icon: Flame },
    { id: 'photochemical', label: 'UV Effects', component: PhotochemicalSection, icon: Radiation },
    { id: 'mpe', label: 'MPE Values', component: MpeSection, icon: Activity },
    { id: 'protection', label: 'Protection', component: ProtectionSection, icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Medical Header */}
      <div className="p-6 bg-gradient-to-r from-amber-50 via-orange-50 to-red-50 dark:from-amber-950/20 dark:via-orange-950/20 dark:to-red-950/20 rounded-xl border">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-600 to-orange-600 flex items-center justify-center shadow-lg">
            <Droplets className="w-9 h-9 text-white" />
          </div>
          <div>
            <Badge variant="secondary" className="mb-2 bg-amber-100 text-amber-800">Course 3 • Module 2</Badge>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Skin Hazards & Thermal Effects</h1>
            <p className="text-muted-foreground mt-1">Dermatological assessment of laser-tissue interactions</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              variant={activeSection === section.id ? 'default' : 'outline'}
              onClick={() => setActiveSection(section.id)}
              className="flex items-center gap-2"
              size="sm"
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{section.label}</span>
            </Button>
          );
        })}
      </div>

      {/* Content */}
      <div className="animate-in fade-in duration-300">
        {(() => {
          const SectionComponent = sections.find(s => s.id === activeSection)?.component;
          return SectionComponent ? <SectionComponent /> : null;
        })()}
      </div>
    </div>
  );
}
