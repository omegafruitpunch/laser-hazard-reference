'use client';

import { useState, useMemo, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calculator, AlertCircle, Info } from 'lucide-react';

interface NOHDCalculatorProps {
  className?: string;
  onCalculate?: (result: NOHDResult) => void;
  showVisualization?: boolean;
}

export interface NOHDResult {
  nohd: number;
  mpe: number;
  beamArea: number;
  safetyFactor: number;
  wavelength: number;
  power: number;
  divergence: number;
}

export default function NOHDCalculator({ 
  className,
  onCalculate,
  showVisualization = true 
}: NOHDCalculatorProps) {
  const [wavelength, setWavelength] = useState(532);
  const [power, setPower] = useState(1);
  const [divergence, setDivergence] = useState(1);
  const [exposureTime, setExposureTime] = useState(0.25);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Calculate MPE based on wavelength and exposure time
  const calculateMPE = useCallback((wl: number, duration: number): number => {
    if (wl >= 400 && wl <= 700) {
      if (duration <= 0.25) return 0.00254;
      if (duration <= 10) return 0.0018 * Math.pow(duration, 0.75) / 10;
      return 0.001;
    }
    if (wl > 700 && wl <= 1050) {
      const ca = Math.pow(10, 0.002 * (wl - 700));
      return 0.00254 * ca;
    }
    if (wl > 1050 && wl <= 1400) return 0.01275;
    if (wl > 1400 && wl <= 1500) return 2.384;
    if (wl > 1500 && wl <= 1800) return 4.0;
    if (wl > 1800 && wl <= 10000) return 1.584;
    return 0.00254;
  }, []);

  const mpe = useMemo(() => calculateMPE(wavelength, exposureTime), [wavelength, exposureTime, calculateMPE]);

  const nohd = useMemo(() => {
    const p = Math.max(0, power);
    const d = Math.max(0.01, divergence);
    const m = Math.max(0.0001, mpe);
    const divergenceRad = d * 0.001;
    return Math.sqrt((4 * p) / (Math.PI * m)) / divergenceRad;
  }, [power, divergence, mpe]);

  const beamArea = useMemo(() => {
    const spotRadius = nohd * (divergence * 0.001) / 2;
    return Math.PI * spotRadius * spotRadius;
  }, [nohd, divergence]);

  const safetyFactor = useMemo(() => {
    return power / (mpe * beamArea * 10000); // Convert cm² to m²
  }, [power, mpe, beamArea]);

  // Validation
  const validateInputs = useCallback(() => {
    const newErrors: Record<string, string> = {};
    if (wavelength < 180 || wavelength > 10000) {
      newErrors.wavelength = 'Wavelength must be between 180nm and 10000nm';
    }
    if (power < 0) {
      newErrors.power = 'Power cannot be negative';
    }
    if (divergence < 0.01) {
      newErrors.divergence = 'Divergence must be at least 0.01 mrad';
    }
    if (exposureTime < 0.001 || exposureTime > 100) {
      newErrors.exposureTime = 'Exposure time must be between 0.001s and 100s';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [wavelength, power, divergence, exposureTime]);

  const handleCalculate = () => {
    if (validateInputs()) {
      const result: NOHDResult = {
        nohd,
        mpe,
        beamArea,
        safetyFactor,
        wavelength,
        power,
        divergence
      };
      onCalculate?.(result);
    }
  };

  // Keyboard handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      handleCalculate();
    }
  };

  return (
    <div 
      className={`space-y-4 ${className}`}
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="NOHD Calculator"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" aria-hidden="true" />
            NOHD Calculator
          </CardTitle>
          <CardDescription>
            Calculate the Nominal Ocular Hazard Distance for your laser system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wavelength Input */}
          <div>
            <Label htmlFor="nohd-wavelength">
              Wavelength (nm)
              <span className="text-muted-foreground ml-2 text-sm">{wavelength} nm</span>
            </Label>
            <Input
              id="nohd-wavelength"
              type="number"
              value={wavelength}
              onChange={(e) => setWavelength(parseFloat(e.target.value) || 0)}
              min={180}
              max={10000}
              step={1}
              className="mt-1"
              aria-label="Wavelength in nanometers"
              aria-invalid={!!errors.wavelength}
              aria-describedby={errors.wavelength ? 'wavelength-error' : undefined}
            />
            {errors.wavelength && (
              <p id="wavelength-error" className="text-sm text-destructive mt-1" role="alert">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {errors.wavelength}
              </p>
            )}
          </div>

          {/* Power Input */}
          <div>
            <Label htmlFor="nohd-power">
              Output Power (W)
              <span className="text-muted-foreground ml-2 text-sm">{power} W</span>
            </Label>
            <Input
              id="nohd-power"
              type="number"
              value={power}
              onChange={(e) => setPower(Math.max(0, parseFloat(e.target.value) || 0))}
              min={0}
              step={0.001}
              className="mt-1"
              aria-label="Output power in watts"
              aria-invalid={!!errors.power}
              aria-describedby={errors.power ? 'power-error' : undefined}
            />
            {errors.power && (
              <p id="power-error" className="text-sm text-destructive mt-1" role="alert">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {errors.power}
              </p>
            )}
          </div>

          {/* Divergence Input */}
          <div>
            <Label htmlFor="nohd-divergence">
              Beam Divergence (mrad)
              <span className="text-muted-foreground ml-2 text-sm">{divergence} mrad</span>
            </Label>
            <Input
              id="nohd-divergence"
              type="number"
              value={divergence}
              onChange={(e) => setDivergence(Math.max(0.01, parseFloat(e.target.value) || 0.01))}
              min={0.01}
              step={0.1}
              className="mt-1"
              aria-label="Beam divergence in milliradians"
              aria-invalid={!!errors.divergence}
              aria-describedby={errors.divergence ? 'divergence-error' : undefined}
            />
            {errors.divergence && (
              <p id="divergence-error" className="text-sm text-destructive mt-1" role="alert">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {errors.divergence}
              </p>
            )}
          </div>

          {/* Exposure Time Input */}
          <div>
            <Label htmlFor="nohd-exposure">
              Exposure Time (s)
              <span className="text-muted-foreground ml-2 text-sm">{exposureTime} s</span>
            </Label>
            <Input
              id="nohd-exposure"
              type="number"
              value={exposureTime}
              onChange={(e) => setExposureTime(parseFloat(e.target.value) || 0.25)}
              min={0.001}
              max={100}
              step={0.01}
              className="mt-1"
              aria-label="Exposure time in seconds"
              aria-invalid={!!errors.exposureTime}
              aria-describedby={errors.exposureTime ? 'exposure-error' : 'exposure-help'}
            />
            <p id="exposure-help" className="text-xs text-muted-foreground mt-1">
              Default: 0.25s (blink reflex time)
            </p>
            {errors.exposureTime && (
              <p id="exposure-error" className="text-sm text-destructive mt-1" role="alert">
                <AlertCircle className="w-4 h-4 inline mr-1" />
                {errors.exposureTime}
              </p>
            )}
          </div>

          {/* Calculate Button */}
          <Button 
            onClick={handleCalculate}
            className="w-full"
            aria-label="Calculate NOHD. Shortcut: Ctrl+Enter"
          >
            Calculate NOHD
          </Button>

          {/* Results */}
          <div 
            className="p-4 bg-muted rounded-lg space-y-2"
            role="region"
            aria-label="Calculation results"
          >
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">NOHD:</span>
              <Badge 
                variant="destructive" 
                className="text-lg"
                aria-live="polite"
                aria-label={`NOHD is ${nohd >= 1000 ? `${(nohd / 1000).toFixed(2)} kilometers` : `${nohd.toFixed(1)} meters`}`}
              >
                {nohd >= 1000 ? `${(nohd / 1000).toFixed(2)} km` : `${nohd.toFixed(1)} m`}
              </Badge>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">MPE:</span>
              <span className="font-mono" aria-live="polite">{mpe.toExponential(3)} W/cm²</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Beam Area at NOHD:</span>
              <span className="font-mono" aria-live="polite">{beamArea.toFixed(4)} m²</span>
            </div>
          </div>

          {/* Help Text */}
          <div className="text-xs text-muted-foreground flex items-start gap-2">
            <Info className="w-4 h-4 flex-shrink-0 mt-0.5" aria-hidden="true" />
            <span>
              Formula: NOHD = √(4 * Φ / (π * MPE)) / φ
              <br />
              Where Φ = power (W), MPE = safety limit (W/cm²), φ = divergence (rad)
              <br />
              <kbd className="bg-muted px-1 rounded">Ctrl+Enter</kbd> to calculate
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Visualization */}
      {showVisualization && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Safety Zone Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative h-32 bg-muted rounded-lg overflow-hidden">
              {/* Scaled visualization */}
              <svg 
                viewBox="0 0 400 100" 
                className="w-full h-full"
                role="img"
                aria-label={`Visualization of NOHD at ${nohd >= 1000 ? `${(nohd / 1000).toFixed(2)} kilometers` : `${nohd.toFixed(1)} meters`}`}
              >
                <title>NOHD Safety Zone</title>
                <desc>
                  Diagram showing laser source on the left, with hazard zone (red) extending to NOHD,
                  followed by safe zone (green) beyond NOHD.
                </desc>
                
                {/* Source */}
                <circle cx="30" cy="50" r="15" fill="#DC2626" />
                <text x="30" y="80" textAnchor="middle" className="text-xs fill-muted-foreground">Source</text>
                
                {/* Hazard zone */}
                <path 
                  d="M 45 50 L 200 35 L 200 65 Z" 
                  fill="rgba(239, 68, 68, 0.3)" 
                  stroke="#DC2626"
                  strokeWidth="2"
                />
                <text x="120" y="30" textAnchor="middle" className="text-xs fill-red-600">Hazard Zone</text>
                
                {/* NOHD marker */}
                <line x1="200" y1="20" x2="200" y2="80" stroke="#16A34A" strokeWidth="3" strokeDasharray="5,5" />
                <text x="200" y="15" textAnchor="middle" className="text-xs fill-green-600 font-bold">NOHD</text>
                
                {/* Safe zone */}
                <path 
                  d="M 200 35 L 380 25 L 380 75 L 200 65 Z" 
                  fill="rgba(34, 197, 94, 0.2)" 
                  stroke="#22C55E"
                  strokeWidth="2"
                  strokeDasharray="5,5"
                />
                <text x="290" y="50" textAnchor="middle" className="text-xs fill-green-600">Safe Zone</text>
              </svg>
            </div>
            <p className="text-xs text-muted-foreground text-center mt-2">
              Hazard zone extends to NOHD ({nohd >= 1000 ? `${(nohd / 1000).toFixed(2)} km` : `${nohd.toFixed(1)} m`})
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
