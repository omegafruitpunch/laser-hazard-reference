'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Layers, AlertTriangle, Eye } from 'lucide-react';

interface WavelengthData {
  region: string;
  color: string;
  bgColor: string;
  penetration: { depth: string; layer: string };
  hazardLevel: 'low' | 'moderate' | 'high' | 'extreme';
  description: string;
  lasers: string[];
}

const WAVELENGTH_DATA: Record<number, WavelengthData> = {
  193: { region: 'UV-C', color: '#8B5CF6', bgColor: 'bg-purple-100', penetration: { depth: '< 0.1 mm', layer: 'Cornea only' }, hazardLevel: 'high', description: 'Absorbed by corneal epithelium. Excimer lasers.', lasers: ['ArF Excimer'] },
  248: { region: 'UV-C', color: '#8B5CF6', bgColor: 'bg-purple-100', penetration: { depth: '< 0.1 mm', layer: 'Cornea only' }, hazardLevel: 'high', description: 'Strong corneal absorption. Photokeratitis risk.', lasers: ['KrF Excimer'] },
  308: { region: 'UV-B', color: '#A78BFA', bgColor: 'bg-purple-50', penetration: { depth: '0.1 mm', layer: 'Cornea + conjunctiva' }, hazardLevel: 'high', description: 'UV-B range. High photokeratitis risk.', lasers: ['XeCl Excimer'] },
  355: { region: 'UV-A', color: '#C4B5FD', bgColor: 'bg-violet-50', penetration: { depth: '0.3 mm', layer: 'Cornea, some lens' }, hazardLevel: 'moderate', description: 'UV-A cataract risk.', lasers: ['Nd:YAG 3rd Harmonic'] },
  405: { region: 'Violet', color: '#7C3AED', bgColor: 'bg-purple-50', penetration: { depth: 'Full depth', layer: 'Retina' }, hazardLevel: 'extreme', description: 'Blue light hazard. Photochemical retinal damage.', lasers: ['Violet Diode'] },
  445: { region: 'Blue', color: '#3B82F6', bgColor: 'bg-blue-50', penetration: { depth: 'Full depth', layer: 'Retina' }, hazardLevel: 'extreme', description: 'Peak blue light hazard zone.', lasers: ['Blue Diode'] },
  532: { region: 'Green', color: '#22C55E', bgColor: 'bg-green-50', penetration: { depth: 'Full depth', layer: 'Retina' }, hazardLevel: 'extreme', description: 'Highest visibility. Maximum retinal hazard.', lasers: ['DPSS Green', 'Nd:YAG 2nd'] },
  633: { region: 'Red', color: '#EF4444', bgColor: 'bg-red-50', penetration: { depth: 'Full depth', layer: 'Retina' }, hazardLevel: 'extreme', description: 'Peak photopic vision sensitivity.', lasers: ['HeNe'] },
  694: { region: 'Red', color: '#DC2626', bgColor: 'bg-red-50', penetration: { depth: 'Full depth', layer: 'Retina' }, hazardLevel: 'extreme', description: 'Deep red. High retinal absorption.', lasers: ['Ruby'] },
  808: { region: 'Near-IR', color: '#7F1D1D', bgColor: 'bg-red-950/20', penetration: { depth: 'Full depth', layer: 'Retina' }, hazardLevel: 'extreme', description: 'INVISIBLE - silent hazard! No blink reflex.', lasers: ['Diode'] },
  980: { region: 'Near-IR', color: '#7F1D1D', bgColor: 'bg-red-950/20', penetration: { depth: 'Full depth', layer: 'Retina' }, hazardLevel: 'extreme', description: 'INVISIBLE - retinal burns, cataracts.', lasers: ['Diode'] },
  1064: { region: 'Near-IR', color: '#450A0A', bgColor: 'bg-red-950/30', penetration: { depth: 'Full depth', layer: 'Retina' }, hazardLevel: 'extreme', description: 'Industrial standard. High power, invisible.', lasers: ['Nd:YAG'] },
  1320: { region: 'Near-IR', color: '#292524', bgColor: 'bg-stone-100', penetration: { depth: 'Partial', layer: 'Retina + Cornea' }, hazardLevel: 'high', description: 'Boundary zone. Mixed absorption.', lasers: ['Nd:YAG'] },
  1550: { region: 'SWIR', color: '#57534E', bgColor: 'bg-gray-100', penetration: { depth: 'Corneal only', layer: 'Cornea' }, hazardLevel: 'moderate', description: 'Retina-safe. Corneal absorption only.', lasers: ['Eye-safe'] },
  2940: { region: 'Mid-IR', color: '#78716C', bgColor: 'bg-stone-50', penetration: { depth: '< 0.1 mm', layer: 'Cornea only' }, hazardLevel: 'high', description: 'Water absorption peak. Surface ablation.', lasers: ['Er:YAG'] },
  10600: { region: 'Far-IR', color: '#A8A29E', bgColor: 'bg-gray-50', penetration: { depth: '< 0.05 mm', layer: 'Cornea surface' }, hazardLevel: 'moderate', description: 'CO₂ laser. Complete surface absorption.', lasers: ['CO₂'] },
};

const COMMON_WAVELENGTHS = [193, 308, 355, 405, 532, 633, 808, 1064, 1550, 2940, 10600];

const getHazardBadge = (level: WavelengthData['hazardLevel']) => {
  switch (level) {
    case 'extreme': return { text: 'EXTREME', variant: 'destructive' as const, icon: true };
    case 'high': return { text: 'HIGH', variant: 'default' as const, icon: true };
    case 'moderate': return { text: 'MODERATE', variant: 'secondary' as const, icon: false };
    case 'low': return { text: 'LOW', variant: 'outline' as const, icon: false };
  }
};

export default function WavelengthPenetrationSlider() {
  const [wavelength, setWavelength] = useState(532);

  // Find nearest predefined data point
  const currentData = useMemo(() => {
    const nearest = COMMON_WAVELENGTHS.reduce((prev, curr) => 
      Math.abs(curr - wavelength) < Math.abs(prev - wavelength) ? curr : prev
    );
    return WAVELENGTH_DATA[nearest] || WAVELENGTH_DATA[532];
  }, [wavelength]);

  const hazardBadge = getHazardBadge(currentData.hazardLevel);

  // Format wavelength display
  const formatWavelength = (nm: number): string => {
    if (nm >= 1000) return `${(nm / 1000).toFixed(3)} µm`;
    return `${nm} nm`;
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Layers className="w-4 h-4" />
          Wavelength Penetration Depth
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Wavelength Slider */}
        <div className="space-y-2">
          <Slider
            value={[wavelength]}
            onValueChange={(v) => setWavelength(v[0])}
            min={180}
            max={11000}
            step={1}
            className="w-full"
          />
          
          {/* Spectrum Bar */}
          <div className="relative h-6 rounded-lg overflow-hidden">
            <div 
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, 
                  #8B5CF6 0%, #8B5CF6 5%,      /* UV-C */
                  #A78BFA 5%, #A78BFA 10%,      /* UV-B */
                  #C4B5FD 10%, #C4B5FD 15%,     /* UV-A */
                  #3B82F6 15%, #3B82F6 22%,     /* Violet */
                  #22C55E 22%, #22C55E 35%,     /* Green */
                  #EAB308 35%, #EAB308 45%,     /* Yellow */
                  #EF4444 45%, #EF4444 50%,     /* Red */
                  #7F1D1D 50%, #7F1D1D 60%,     /* Near-IR */
                  #450A0A 60%, #450A0A 70%,     /* Extended NIR */
                  #57534E 70%, #57534E 80%,     /* SWIR */
                  #78716C 80%, #78716C 90%,     /* Mid-IR */
                  #A8A29E 90%, #A8A29E 100%     /* Far-IR */
                )`
              }}
            />
            {/* Position indicator */}
            <div 
              className="absolute top-0 bottom-0 w-1 bg-white shadow-lg border-x border-black/30 transition-all duration-150"
              style={{ 
                left: `${Math.min(100, Math.max(0, (Math.log10(wavelength) - 2.25) / (4.05 - 2.25) * 100))}%` 
              }}
            />
          </div>
          
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>UV</span>
            <span>Visible</span>
            <span>Near-IR</span>
            <span>Far-IR</span>
          </div>
        </div>

        {/* Current Value Display */}
        <div className="text-center animate-in fade-in duration-200" key={wavelength}>
          <div className="text-2xl font-bold" style={{ color: currentData.color }}>
            {formatWavelength(wavelength)}
          </div>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Badge style={{ backgroundColor: currentData.color }}>
              {currentData.region}
            </Badge>
            {hazardBadge.icon && <AlertTriangle className="w-4 h-4 text-destructive" />}
            <Badge variant={hazardBadge.variant}>{hazardBadge.text} HAZARD</Badge>
          </div>
        </div>

        {/* Penetration Info Panel */}
        <div 
          className={`p-4 rounded-lg border-2 transition-all duration-300 ${currentData.bgColor}`}
          style={{ borderColor: currentData.color }}
        >
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-xs text-muted-foreground mb-1">Penetration Depth</div>
              <div className="font-semibold text-lg">{currentData.penetration.depth}</div>
            </div>
            <div>
              <div className="text-xs text-muted-foreground mb-1">Primary Target</div>
              <div className={`font-semibold flex items-center gap-1 ${
                currentData.penetration.layer.includes('Retina') ? 'text-red-600' : 'text-blue-600'
              }`}>
                {currentData.penetration.layer.includes('Retina') && <Eye className="w-4 h-4" />}
                {currentData.penetration.layer}
              </div>
            </div>
          </div>
          
          <div className="mt-3 pt-3 border-t border-current/20">
            <p className="text-sm text-muted-foreground">{currentData.description}</p>
          </div>
          
          <div className="mt-2 flex flex-wrap gap-1">
            {currentData.lasers.map((laser) => (
              <Badge key={laser} variant="outline" className="text-xs">
                {laser}
              </Badge>
            ))}
          </div>
        </div>

        {/* Quick Select Buttons */}
        <div className="flex flex-wrap gap-1">
          {COMMON_WAVELENGTHS.map((wl) => (
            <button
              key={wl}
              onClick={() => setWavelength(wl)}
              className={`px-2 py-1 text-xs rounded transition-all ${
                Math.abs(wavelength - wl) < 50
                  ? 'bg-primary text-primary-foreground font-medium'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {wl >= 1000 ? `${(wl/1000).toFixed(1)}µm` : `${wl}nm`}
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
