'use client';

import { useState, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';

interface WavelengthExplorerProps {
  initialWavelength?: number;
  showEyeDiagram?: boolean;
  compact?: boolean;
}

export default function WavelengthExplorer({ 
  initialWavelength = 550,
  showEyeDiagram = true,
  compact = false 
}: WavelengthExplorerProps) {
  const [wavelength, setWavelength] = useState(initialWavelength);

  const getColor = (nm: number): string => {
    if (nm < 400) return '#8B00FF';
    if (nm < 450) return '#4B0082';
    if (nm < 495) return '#0000FF';
    if (nm < 570) return '#00FF00';
    if (nm < 590) return '#FFFF00';
    if (nm < 620) return '#FF7F00';
    if (nm < 750) return '#FF0000';
    return '#8B0000';
  };

  const getHazardInfo = (nm: number): { type: string; description: string; severity: 'low' | 'medium' | 'high' | 'critical' } => {
    if (nm < 400) return { 
      type: 'UV - Corneal Hazard', 
      description: 'Ultraviolet light absorbed by the cornea. Can cause photokeratitis (welder\'s flash).',
      severity: 'high'
    };
    if (nm < 700) return { 
      type: 'Visible - Retinal Hazard', 
      description: 'Visible light focused on the retina. Can cause permanent vision damage.',
      severity: 'critical'
    };
    if (nm < 1400) return { 
      type: 'Near-IR - INVISIBLE Retinal Hazard', 
      description: 'Invisible near-infrared. Most dangerous as there is no blink reflex protection!',
      severity: 'critical'
    };
    return { 
      type: 'Far-IR - Corneal Hazard', 
      description: 'Far-infrared absorbed by the cornea and water in tissue. Causes thermal burns.',
      severity: 'high'
    };
  };

  const getSeverityColor = (severity: string): string => {
    switch (severity) {
      case 'low': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'high': return 'bg-orange-500';
      case 'critical': return 'bg-red-600';
      default: return 'bg-gray-500';
    }
  };

  const hazardInfo = getHazardInfo(wavelength);
  const currentColor = getColor(wavelength);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') {
      setWavelength(prev => Math.max(200, prev - 10));
    } else if (e.key === 'ArrowRight') {
      setWavelength(prev => Math.min(2000, prev + 10));
    } else if (e.key === 'Home') {
      setWavelength(200);
    } else if (e.key === 'End') {
      setWavelength(2000);
    }
  }, []);

  return (
    <div 
      className="space-y-4"
      onKeyDown={handleKeyDown}
      role="region"
      aria-label="Wavelength Explorer interactive demonstration"
    >
      <Card>
        <CardHeader className={compact ? 'pb-2' : ''}>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className={compact ? 'text-base' : 'text-lg'}>Wavelength Explorer</CardTitle>
              {!compact && (
                <CardDescription>Explore how wavelength affects laser hazards</CardDescription>
              )}
            </div>
            <Badge 
              style={{ backgroundColor: currentColor }}
              className="text-white"
              aria-label={`Current wavelength: ${wavelength} nanometers`}
            >
              {wavelength} nm
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Wavelength Slider */}
          <div>
            <label 
              htmlFor="wavelength-slider"
              className="sr-only"
            >
              Wavelength selector
            </label>
            <Slider
              id="wavelength-slider"
              value={[wavelength]}
              onValueChange={(v) => setWavelength(v[0])}
              min={200}
              max={2000}
              step={10}
              className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Wavelength selector"
              aria-valuemin={200}
              aria-valuemax={2000}
              aria-valuenow={wavelength}
              aria-valuetext={`${wavelength} nanometers`}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>200nm (UV)</span>
              <span>Visible</span>
              <span>2000nm (IR)</span>
            </div>
          </div>

          {/* Color Display */}
          <div 
            className="h-12 rounded-lg transition-colors duration-300 border"
            style={{ backgroundColor: currentColor }}
            role="img"
            aria-label={`Color at ${wavelength}nm: ${currentColor}`}
          />

          {/* Hazard Information */}
          <div 
            className={`p-3 rounded-lg text-white ${getSeverityColor(hazardInfo.severity)}`}
            role="alert"
            aria-live="polite"
          >
            <div className="font-semibold">{hazardInfo.type}</div>
            {!compact && (
              <p className="text-sm opacity-90 mt-1">{hazardInfo.description}</p>
            )}
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap gap-2" role="group" aria-label="Common laser wavelength presets">
            {[405, 532, 632, 808, 1064].map((nm) => (
              <button
                key={nm}
                onClick={() => setWavelength(nm)}
                className="px-2 py-1 text-xs rounded border hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
                aria-label={`Set wavelength to ${nm} nanometers`}
              >
                {nm}nm
              </button>
            ))}
          </div>

          {/* Keyboard Help */}
          {!compact && (
            <div className="text-xs text-muted-foreground text-center">
              Keyboard: ← → to adjust • Home/End for min/max
            </div>
          )}
        </CardContent>
      </Card>

      {/* Eye Diagram (if enabled) */}
      {showEyeDiagram && !compact && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Eye Penetration</CardTitle>
          </CardHeader>
          <CardContent>
            <svg 
              viewBox="0 0 300 150" 
              className="w-full h-32"
              role="img"
              aria-label="Diagram showing laser penetration into eye structures"
            >
              <title>Eye Penetration Diagram</title>
              <desc>
                Cross-section of human eye showing cornea, lens, and retina.
                Colored regions indicate which parts are affected by the selected wavelength.
              </desc>
              
              {/* Eye outline */}
              <ellipse cx="150" cy="75" rx="130" ry="70" fill="#f8fafc" stroke="#94a3b8" strokeWidth="2" />
              
              {/* Cornea */}
              <path 
                d="M 40 75 Q 40 35 90 50"
                fill="none" 
                stroke={wavelength < 400 || wavelength > 1400 ? '#ef4444' : '#64748b'} 
                strokeWidth={wavelength < 400 || wavelength > 1400 ? 4 : 2}
                opacity={wavelength < 400 || wavelength > 1400 ? 1 : 0.5}
              />
              
              {/* Lens */}
              <ellipse 
                cx="120" cy="75" rx="15" ry="35" 
                fill={wavelength >= 300 && wavelength < 400 ? '#ef4444' : '#cbd5e1'}
                opacity={wavelength >= 300 && wavelength < 400 ? 0.8 : 0.4}
              />
              
              {/* Retina */}
              <path 
                d="M 260 40 Q 280 75 260 110"
                fill="none" 
                stroke={wavelength >= 400 && wavelength <= 1400 ? '#ef4444' : '#64748b'} 
                strokeWidth={wavelength >= 400 && wavelength <= 1400 ? 4 : 2}
                opacity={wavelength >= 400 && wavelength <= 1400 ? 1 : 0.5}
              />
              
              {/* Beam path */}
              {wavelength >= 400 && wavelength <= 1400 && (
                <line 
                  x1="30" y1="75" x2="260" y2="75" 
                  stroke="#ef4444" 
                  strokeWidth="2" 
                  strokeDasharray="5,5"
                  opacity="0.5"
                />
              )}
              
              {/* Labels */}
              <text x="60" y="30" className="text-[10px] fill-muted-foreground">Cornea</text>
              <text x="115" y="30" className="text-[10px] fill-muted-foreground">Lens</text>
              <text x="250" y="30" className="text-[10px] fill-muted-foreground">Retina</text>
            </svg>
            
            <div className="text-xs text-muted-foreground text-center mt-2">
              {wavelength >= 400 && wavelength <= 1400 
                ? '⚠️ Retinal hazard - beam reaches the back of the eye'
                : wavelength < 400 || wavelength > 1400
                ? '⚠️ Corneal hazard - absorbed by front of the eye'
                : 'Select a wavelength to see penetration'}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
