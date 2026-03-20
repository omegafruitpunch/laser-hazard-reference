'use client';

import { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

// MPE calculation constants based on ANSI Z136.1
const getBaseMPE = (wavelength: number): number => {
  if (wavelength < 400) return 0.0039; // UV
  if (wavelength < 700) return 0.00254; // Visible
  if (wavelength < 1050) return 0.00254 * Math.pow(10, (wavelength - 700) / 500); // Near-IR with CA correction
  if (wavelength <= 1400) return 0.005; // Extended Near-IR
  return 0.01; // Far-IR
};

const getWavelengthRegion = (nm: number): { name: string; color: string } => {
  if (nm < 400) return { name: 'UV', color: 'bg-purple-500' };
  if (nm < 700) return { name: 'Visible', color: 'bg-green-500' };
  if (nm <= 1400) return { name: 'Near-IR', color: 'bg-red-500' };
  return { name: 'Far-IR', color: 'bg-gray-500' };
};

export default function MPECalculator() {
  const [wavelength, setWavelength] = useState(550);
  const [durationLog, setDurationLog] = useState(-0.6); // log10(0.25) ≈ -0.6

  // Calculate actual duration from log value (range: 1ms to 100s)
  const duration = useMemo(() => Math.pow(10, durationLog), [durationLog]);
  
  // Calculate MPE with proper time scaling
  const mpe = useMemo(() => {
    const baseMPE = getBaseMPE(wavelength);
    // MPE scales with t^0.75 for thermal effects (0.25s to 10s range)
    const timeFactor = Math.pow(duration / 0.25, 0.75);
    return baseMPE * timeFactor;
  }, [wavelength, duration]);

  const region = getWavelengthRegion(wavelength);
  
  // Format duration for display
  const formatDuration = (seconds: number): string => {
    if (seconds < 0.001) return `${(seconds * 1000000).toFixed(0)} µs`;
    if (seconds < 1) return `${(seconds * 1000).toFixed(0)} ms`;
    if (seconds < 60) return `${seconds.toFixed(2)} s`;
    return `${(seconds / 60).toFixed(1)} min`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center justify-between">
          <span>MPE Calculator</span>
          <Badge variant="secondary" className={region.color}>
            {region.name}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Wavelength Slider */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Wavelength</Label>
            <span className="text-sm font-medium">{wavelength} nm</span>
          </div>
          <Slider
            value={[wavelength]}
            onValueChange={(v) => setWavelength(v[0])}
            min={200}
            max={2000}
            step={1}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>200 nm (UV)</span>
            <span>1064 nm (Nd:YAG)</span>
            <span>2000 nm</span>
          </div>
        </div>

        {/* Duration Slider - Logarithmic scale for better control */}
        <div className="space-y-2">
          <div className="flex justify-between">
            <Label>Exposure Duration</Label>
            <span className="text-sm font-medium">{formatDuration(duration)}</span>
          </div>
          <Slider
            value={[durationLog]}
            onValueChange={(v) => setDurationLog(v[0])}
            min={-3} // 1 ms
            max={2}  // 100 s
            step={0.01}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1 ms</span>
            <span>0.25 s (blink)</span>
            <span>10 s</span>
            <span>100 s</span>
          </div>
        </div>

        {/* Result Display with Animation */}
        <div 
          className="p-4 bg-muted rounded-lg text-center transition-all duration-300"
          key={`${wavelength}-${duration}`}
        >
          <div className="text-3xl font-bold text-green-500 animate-in fade-in zoom-in duration-500">
            {mpe < 0.001 ? `${(mpe * 1000).toFixed(3)} mW/cm²` : `${mpe.toFixed(4)} W/cm²`}
          </div>
          <div className="text-sm text-muted-foreground mt-1">Maximum Permissible Exposure</div>
          <div className="text-xs text-muted-foreground mt-2">
            Base MPE: {getBaseMPE(wavelength)} W/cm² @ 0.25s
          </div>
        </div>

        {/* Safety Note */}
        <div className="text-xs text-muted-foreground bg-yellow-500/10 p-2 rounded">
          <strong>Note:</strong> MPE scales with t<sup>0.75</sup> for thermal damage. 
          Shorter exposures allow higher peak irradiance.
        </div>
      </CardContent>
    </Card>
  );
}
