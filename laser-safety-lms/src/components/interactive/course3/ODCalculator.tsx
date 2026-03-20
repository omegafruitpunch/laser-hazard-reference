'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Calculator, AlertTriangle, Shield, Info } from 'lucide-react';

// Common MPE values by wavelength
const MPE_PRESETS = [
  { wavelength: 193, mpe: 0.0039, name: 'ArF (UV-C)' },
  { wavelength: 308, mpe: 0.0039, name: 'XeCl (UV-B)' },
  { wavelength: 355, mpe: 0.0039, name: 'Nd:YAG 3rd (UV-A)' },
  { wavelength: 405, mpe: 0.00254, name: 'Violet Diode' },
  { wavelength: 532, mpe: 0.00254, name: 'DPSS Green' },
  { wavelength: 633, mpe: 0.00254, name: 'HeNe Red' },
  { wavelength: 808, mpe: 0.0018, name: 'Diode IR' },
  { wavelength: 1064, mpe: 0.005, name: 'Nd:YAG' },
  { wavelength: 1550, mpe: 0.01, name: 'Eye-safe' },
  { wavelength: 10600, mpe: 0.1, name: 'CO₂' },
];

const getProtectionLevel = (od: number) => {
  if (od < 1 || isNaN(od)) return { 
    level: 'Insufficient', 
    color: 'text-red-500', 
    bg: 'bg-red-50',
    border: 'border-red-200',
    desc: 'Protection inadequate - increase OD'
  };
  if (od < 3) return { 
    level: 'Basic', 
    color: 'text-yellow-600', 
    bg: 'bg-yellow-50',
    border: 'border-yellow-200',
    desc: 'Minimal protection - consider higher OD'
  };
  if (od < 5) return { 
    level: 'Standard', 
    color: 'text-green-600', 
    bg: 'bg-green-50',
    border: 'border-green-200',
    desc: 'Adequate for most applications'
  };
  if (od < 7) return { 
    level: 'High', 
    color: 'text-blue-600', 
    bg: 'bg-blue-50',
    border: 'border-blue-200',
    desc: 'Strong protection margin'
  };
  return { 
    level: 'Maximum', 
    color: 'text-purple-600', 
    bg: 'bg-purple-50',
    border: 'border-purple-200',
    desc: 'Maximum protection for high-power lasers'
  };
};

export default function ODCalculator() {
  const [beamIrradiance, setBeamIrradiance] = useState(10);
  const [mpe, setMpe] = useState(0.00254);
  const [logIrradiance, setLogIrradiance] = useState(1); // log10(10) = 1

  // Calculate OD
  const od = useMemo(() => {
    if (beamIrradiance <= 0 || mpe <= 0) return 0;
    return Math.log10(beamIrradiance / mpe);
  }, [beamIrradiance, mpe]);

  const protection = getProtectionLevel(od);
  const roundedOD = Math.ceil(od);
  const transmission = Math.pow(10, -od) * 100;

  // Handle irradiance slider change
  const handleSliderChange = (values: number[]) => {
    const logValue = values[0];
    setLogIrradiance(logValue);
    setBeamIrradiance(Math.pow(10, logValue));
  };

  // Handle irradiance input change
  const handleInputChange = (value: string) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      setBeamIrradiance(numValue);
      setLogIrradiance(Math.log10(numValue));
    }
  };

  // Set MPE from preset
  const setMpePreset = (presetMpe: number) => {
    setMpe(presetMpe);
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base flex items-center gap-2">
          <Calculator className="w-4 h-4" />
          Optical Density (OD) Calculator
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* MPE Quick Select */}
        <div>
          <Label className="text-xs text-muted-foreground mb-2 block">
            Quick Select MPE by Wavelength
          </Label>
          <div className="flex flex-wrap gap-1">
            {MPE_PRESETS.map((preset) => (
              <button
                key={preset.wavelength}
                onClick={() => setMpePreset(preset.mpe)}
                className={`px-2 py-1 text-xs rounded border transition-all ${
                  Math.abs(mpe - preset.mpe) < 0.0001
                    ? 'bg-primary text-primary-foreground border-primary'
                    : 'bg-muted hover:bg-muted/80 border-transparent'
                }`}
              >
                {preset.wavelength} nm
              </button>
            ))}
          </div>
        </div>

        {/* Input Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Beam Irradiance */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm">Beam Irradiance (W/cm²)</Label>
              <span className="text-xs text-muted-foreground">
                {beamIrradiance < 0.01 ? beamIrradiance.toExponential(2) : beamIrradiance.toFixed(3)}
              </span>
            </div>
            <Input
              type="number"
              value={beamIrradiance}
              onChange={(e) => handleInputChange(e.target.value)}
              min="0.001"
              step="0.001"
            />
            <Slider
              value={[logIrradiance]}
              onValueChange={handleSliderChange}
              min={-3}
              max={4}
              step={0.1}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>1 mW/cm²</span>
              <span>1 W/cm²</span>
              <span>10 kW/cm²</span>
            </div>
          </div>

          {/* MPE */}
          <div className="space-y-2">
            <Label className="text-sm">MPE (W/cm²)</Label>
            <Input
              type="number"
              value={mpe}
              onChange={(e) => setMpe(parseFloat(e.target.value) || 0)}
              step="0.0001"
              min="0.0001"
            />
            <div className="p-2 bg-muted rounded text-xs text-muted-foreground">
              Standard MPE for eye exposure (0.25s)
            </div>
          </div>
        </div>

        {/* Result Display */}
        <div className={`p-4 rounded-lg border-2 ${protection.bg} ${protection.border} transition-all duration-300`}>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${protection.color} animate-in zoom-in duration-300`}>
                {isFinite(od) ? od.toFixed(2) : '∞'}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Calculated OD</div>
            </div>
            <div className="text-center border-l">
              <div className={`text-4xl font-bold ${protection.color}`}>
                OD {roundedOD}
              </div>
              <div className="text-sm text-muted-foreground mt-1">Recommended (round up)</div>
            </div>
          </div>

          {/* Protection Level Badge */}
          <div className="mt-3 pt-3 border-t border-current/20 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Shield className={`w-5 h-5 ${protection.color}`} />
              <Badge variant={od >= 3 ? 'default' : 'destructive'}>
                {protection.level} Protection
              </Badge>
            </div>
            <span className="text-xs text-muted-foreground">{protection.desc}</span>
          </div>

          {/* Transmission Info */}
          <div className="mt-2 text-center">
            <span className="text-xs text-muted-foreground">
              Transmission: {transmission < 0.01 ? transmission.toExponential(2) : transmission.toFixed(4)}%
            </span>
          </div>
        </div>

        {/* Formula & Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          <div className="p-2 bg-muted rounded flex items-center gap-2">
            <Info className="w-4 h-4 text-muted-foreground" />
            <span className="text-xs text-muted-foreground">
              Formula: OD = log₁₀(H₀/MPE)
            </span>
          </div>
          <div className="p-2 bg-muted rounded flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">
              Always round UP to next whole OD
            </span>
          </div>
        </div>

        {/* Reference Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-muted">
              <tr>
                <th className="px-2 py-1 text-left">OD</th>
                <th className="px-2 py-1 text-left">Transmission</th>
                <th className="px-2 py-1 text-left">Attenuation</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {[1, 2, 3, 4, 5, 6, 7].map((odVal) => (
                <tr 
                  key={odVal} 
                  className={odVal === roundedOD ? 'bg-primary/10 font-medium' : ''}
                >
                  <td className="px-2 py-1">OD {odVal}</td>
                  <td className="px-2 py-1">{Math.pow(10, -odVal).toExponential(1)}</td>
                  <td className="px-2 py-1">{Math.pow(10, odVal).toLocaleString()}×</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
