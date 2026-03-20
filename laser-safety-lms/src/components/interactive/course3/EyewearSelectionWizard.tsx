'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Calculator, Sparkles, AlertTriangle, CheckCircle } from 'lucide-react';

// Common laser presets
const LASER_PRESETS = [
  { name: 'Argon', nm: 488, type: 'Visible (Blue)', color: '#3B82F6' },
  { name: 'DPSS Green', nm: 532, type: 'Visible (Green)', color: '#22C55E' },
  { name: 'HeNe Red', nm: 633, type: 'Visible (Red)', color: '#EF4444' },
  { name: 'Diode', nm: 808, type: 'Near-IR', color: '#7C2D12' },
  { name: 'Nd:YAG', nm: 1064, type: 'Near-IR', color: '#451A03' },
  { name: 'CO₂', nm: 10600, type: 'Far-IR', color: '#57534E' },
];

// MPE values by wavelength region (W/cm²)
const getMPE = (wavelength: number): number => {
  if (wavelength < 400) return 0.0039; // UV
  if (wavelength < 700) return 0.00254; // Visible
  if (wavelength < 1050) return 0.00254 * Math.pow(10, (wavelength - 700) / 500); // Near-IR with CA
  if (wavelength <= 1400) return 0.005; // Extended Near-IR
  return 0.01; // Far-IR
};

export default function EyewearSelectionWizard() {
  const [wavelength, setWavelength] = useState(532);
  const [power, setPower] = useState(1);
  const [beamDiameter, setBeamDiameter] = useState(1); // mm
  const [showResult, setShowResult] = useState(false);

  // Reset results when inputs change
  const handleWavelengthChange = (newValue: number) => {
    setWavelength(newValue);
    setShowResult(false);
  };

  const handlePowerChange = (newValue: number) => {
    setPower(newValue);
    setShowResult(false);
  };

  const handleBeamDiameterChange = (newValue: number) => {
    setBeamDiameter(newValue);
    setShowResult(false);
  };

  // Calculate OD with proper irradiance calculation
  const calculation = useMemo(() => {
    const mpe = getMPE(wavelength);
    const beamArea = Math.PI * Math.pow(beamDiameter / 20, 2); // cm² (diameter in mm, convert to cm)
    const irradiance = power / beamArea; // W/cm²
    const od = Math.log10(irradiance / mpe);
    const recommendedOD = Math.ceil(od);
    
    // Determine filter type recommendation
    let filterType = '';
    let filterColor = '';
    if (wavelength < 400) {
      filterType = 'UV-absorbing (amber/orange tint)';
      filterColor = 'bg-orange-400';
    } else if (wavelength < 500) {
      filterType = 'Blue-blocking (yellow/orange tint)';
      filterColor = 'bg-yellow-400';
    } else if (wavelength < 600) {
      filterType = 'Green-blocking (magenta/red tint)';
      filterColor = 'bg-red-400';
    } else if (wavelength < 700) {
      filterType = 'Red-blocking (blue/green tint)';
      filterColor = 'bg-blue-400';
    } else if (wavelength <= 1400) {
      filterType = 'Near-IR blocking (may appear clear)';
      filterColor = 'bg-gray-400';
    } else {
      filterType = 'Far-IR blocking (CO₂ laser specific)';
      filterColor = 'bg-slate-400';
    }
    
    return {
      mpe,
      beamArea,
      irradiance,
      od,
      recommendedOD,
      filterType,
      filterColor,
      attenuation: Math.pow(10, recommendedOD),
    };
  }, [wavelength, power, beamDiameter]);

  const selectedPreset = LASER_PRESETS.find(p => Math.abs(p.nm - wavelength) < 50);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-primary" />
          Eyewear Selection Wizard
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick Preset Buttons */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">Quick Select Laser Type</Label>
          <div className="flex flex-wrap gap-1">
            {LASER_PRESETS.map((preset) => (
              <Button
                key={preset.nm}
                variant={Math.abs(wavelength - preset.nm) < 50 ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleWavelengthChange(preset.nm)}
                className="text-xs transition-all"
              >
                <span 
                  className="w-2 h-2 rounded-full mr-1" 
                  style={{ backgroundColor: preset.color }}
                />
                {preset.name}
              </Button>
            ))}
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-3 gap-3">
          <div>
            <Label className="text-xs">Wavelength (nm)</Label>
            <Input
              type="number"
              value={wavelength}
              onChange={(e) => handleWavelengthChange(parseInt(e.target.value) || 0)}
              min={180}
              max={11000}
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Power (W)</Label>
            <Input
              type="number"
              value={power}
              onChange={(e) => handlePowerChange(parseFloat(e.target.value) || 0)}
              step="0.1"
              min="0.001"
              className="mt-1"
            />
          </div>
          <div>
            <Label className="text-xs">Beam Ø (mm)</Label>
            <Input
              type="number"
              value={beamDiameter}
              onChange={(e) => handleBeamDiameterChange(parseFloat(e.target.value) || 0.1)}
              step="0.1"
              min="0.1"
              className="mt-1"
            />
          </div>
        </div>

        {/* Calculate Button */}
        <Button 
          onClick={() => setShowResult(true)} 
          className="w-full transition-all"
          disabled={showResult}
        >
          <Calculator className="w-4 h-4 mr-2" />
          {showResult ? 'Calculation Complete' : 'Calculate Required OD'}
        </Button>

        {/* Results Panel */}
        {showResult && (
          <div 
            className="space-y-3 animate-in fade-in slide-in-from-bottom-2 duration-500"
            key={`${wavelength}-${power}-${beamDiameter}`}
          >
            {/* Main OD Result */}
            <div className="p-4 bg-primary/10 rounded-lg border-2 border-primary/30 text-center">
              <div className="text-4xl font-bold text-primary mb-1">
                OD {calculation.recommendedOD}+
              </div>
              <div className="text-sm text-muted-foreground">
                Required Optical Density at {wavelength} nm
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                Exact: OD {calculation.od.toFixed(2)} → Round up to OD {calculation.recommendedOD}
              </div>
            </div>

            {/* Filter Recommendation */}
            <div className="p-3 bg-muted rounded-lg">
              <div className="flex items-center gap-2">
                <span className={`w-4 h-4 rounded-full ${calculation.filterColor}`} />
                <span className="font-medium">Recommended Filter:</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">{calculation.filterType}</p>
            </div>

            {/* Calculation Details */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">MPE:</span>
                <div className="font-medium">{calculation.mpe.toExponential(2)} W/cm²</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">Beam Irradiance:</span>
                <div className="font-medium">{calculation.irradiance.toFixed(2)} W/cm²</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">Beam Area:</span>
                <div className="font-medium">{calculation.beamArea.toFixed(3)} cm²</div>
              </div>
              <div className="p-2 bg-muted/50 rounded">
                <span className="text-muted-foreground">Attenuation:</span>
                <div className="font-medium">{calculation.attenuation.toExponential(0)}×</div>
              </div>
            </div>

            {/* Safety Note */}
            <div className="p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-yellow-500 shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground">
                Always verify with your Laser Safety Officer. Consider purchasing eyewear 
                with 1-2 OD levels higher than calculated for additional safety margin.
              </p>
            </div>

            {/* Reset indicator */}
            <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <CheckCircle className="w-3 h-3 text-green-500" />
              Change any value above to recalculate
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
