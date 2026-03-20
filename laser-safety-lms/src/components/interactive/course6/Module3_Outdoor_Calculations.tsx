'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Calculator, 
  Cloud, 
  Wind, 
  Droplets,
  Sun,
  Eye,
  AlertTriangle,
  Info,
  TrendingUp,
  TrendingDown,
  Activity
} from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// CALCULATION UTILITIES
// ============================================================================

// Calculate CA correction factor for Near-IR
const calculateCA = (wavelength: number): number => {
  if (wavelength < 700 || wavelength > 1050) return 1;
  return Math.pow(10, 0.002 * (wavelength - 700));
};

// Get Visual Correction Factor
const getVCF = (wavelength: number): number => {
  if (wavelength < 400 || wavelength > 700) return 0;
  // Simplified VCF calculation based on photopic curve
  const peakWL = 555;
  const vcf = Math.exp(-Math.pow(wavelength - peakWL, 2) / (2 * 80 * 80));
  return Math.max(0.0041, Math.min(1.0, vcf));
};

// Get MPE based on wavelength
const getMPE = (wavelength: number): number => {
  if (wavelength >= 400 && wavelength <= 700) return 2.6;
  if (wavelength > 700 && wavelength <= 1050) {
    return 2.6 * calculateCA(wavelength);
  }
  if (wavelength > 1050 && wavelength <= 1150) return 12.75;
  if (wavelength > 1400 && wavelength <= 1500) return 2384;
  if (wavelength > 1500 && wavelength <= 1800) return 4000;
  if (wavelength > 1800) return 1584;
  return 2.6;
};

// ============================================================================
// WEATHER EFFECTS DATA
// ============================================================================

interface WeatherCondition {
  id: string;
  name: string;
  icon: string;
  visibility: number; // statute miles
  attenuationFactor: number;
  beamSpreadFactor: number;
  description: string;
  restrictions: string[];
}

const WEATHER_CONDITIONS: WeatherCondition[] = [
  {
    id: 'clear',
    name: 'Clear (VFR)',
    icon: '☀️',
    visibility: 10,
    attenuationFactor: 1.0,
    beamSpreadFactor: 1.0,
    description: 'Optimal conditions for laser operations',
    restrictions: ['Standard safety distances apply']
  },
  {
    id: 'haze',
    name: 'Light Haze',
    icon: '🌫️',
    visibility: 5,
    attenuationFactor: 0.85,
    beamSpreadFactor: 1.15,
    description: 'Some atmospheric scatter, slight beam diffusion',
    restrictions: ['Monitor visibility hourly', 'Enhanced observer vigilance']
  },
  {
    id: 'mist',
    name: 'Mist/Light Fog',
    icon: '💨',
    visibility: 3,
    attenuationFactor: 0.65,
    beamSpreadFactor: 1.35,
    description: 'Moderate beam scatter and diffusion',
    restrictions: ['Visibility minimum for operations', 'Frequent visibility checks required']
  },
  {
    id: 'fog',
    name: 'Fog',
    icon: '🌁',
    visibility: 1,
    attenuationFactor: 0.35,
    beamSpreadFactor: 1.8,
    description: 'Significant beam scatter, operations challenging',
    restrictions: ['Operations generally prohibited', 'Check with FAA if exception needed']
  },
  {
    id: 'rain',
    name: 'Light Rain',
    icon: '🌧️',
    visibility: 4,
    attenuationFactor: 0.75,
    beamSpreadFactor: 1.25,
    description: 'Beam scatter from rain droplets',
    restrictions: ['Enhanced beam divergence', 'Watch for intensification']
  },
  {
    id: 'heavy-rain',
    name: 'Heavy Rain',
    icon: '⛈️',
    visibility: 1.5,
    attenuationFactor: 0.45,
    beamSpreadFactor: 1.6,
    description: 'Severe beam scatter, unsafe conditions',
    restrictions: ['Operations prohibited', 'Secure equipment']
  }
];

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function ExtendedNOHDCalculator() {
  const [wavelength, setWavelength] = useState(532);
  const [power, setPower] = useState(10);
  const [divergence, setDivergence] = useState(1.5);
  const [minElevation, setMinElevation] = useState(15);
  const [maxElevation, setMaxElevation] = useState(45);
  const [selectedWeather, setSelectedWeather] = useState<WeatherCondition>(WEATHER_CONDITIONS[0]);

  // Calculate base values
  const mpe = getMPE(wavelength);
  const vcf = getVCF(wavelength);
  const ca = calculateCA(wavelength);
  
  // Apply weather factors to calculations
  const effectivePower = power * selectedWeather.attenuationFactor;
  const effectiveDivergence = divergence * selectedWeather.beamSpreadFactor;

  // NOHD Slant Range (Equation 70-1.2)
  const nohdSlant = Math.round((32.8 / effectiveDivergence) * Math.sqrt((1273.2 * effectivePower) / mpe));
  
  // SZED Slant Range (Equation 70-1.3)
  const vcp = effectivePower * vcf;
  const szedSlant = wavelength >= 400 && wavelength <= 700
    ? Math.round((32.8 / effectiveDivergence) * Math.sqrt(12732 * vcp))
    : 0;
  
  // CZED = SZED × 4.47
  const czedSlant = szedSlant > 0 ? Math.round(szedSlant * 4.47) : 0;
  
  // LFED = SZED × 44.7
  const lfedSlant = szedSlant > 0 ? Math.round(szedSlant * 44.7) : 0;

  // Horizontal and vertical distances
  const nohdHorizontal = Math.round(nohdSlant * Math.cos((minElevation * Math.PI) / 180));
  const nohdVertical = Math.round(nohdSlant * Math.sin((maxElevation * Math.PI) / 180));
  
  const szedHorizontal = Math.round(szedSlant * Math.cos((minElevation * Math.PI) / 180));
  const szedVertical = Math.round(szedSlant * Math.sin((maxElevation * Math.PI) / 180));
  
  const czedHorizontal = Math.round(czedSlant * Math.cos((minElevation * Math.PI) / 180));
  const czedVertical = Math.round(czedSlant * Math.sin((maxElevation * Math.PI) / 180));
  
  const lfedHorizontal = Math.round(lfedSlant * Math.cos((minElevation * Math.PI) / 180));
  const lfedVertical = Math.round(lfedSlant * Math.sin((maxElevation * Math.PI) / 180));

  const isVisible = wavelength >= 400 && wavelength <= 700;

  return (
    <div className="space-y-6">
      {/* Input Panel */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="w-5 h-5 text-blue-600" />
              Laser Parameters
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Wavelength */}
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
                <span>400 nm (violet)</span>
                <span>532 nm (green)</span>
                <span>1064 nm (IR)</span>
                <span>1550 nm (eye-safe)</span>
              </div>
              <div className="mt-2 flex gap-2">
                <Badge variant={isVisible ? "default" : "secondary"}>
                  {isVisible ? "Visible" : "Non-Visible"}
                </Badge>
                <Badge variant="outline">VCF: {vcf.toFixed(4)}</Badge>
                {wavelength > 700 && wavelength <= 1050 && (
                  <Badge variant="outline">CA: {ca.toFixed(3)}</Badge>
                )}
              </div>
            </div>

            {/* Power */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Power</label>
                <span className="text-sm font-mono">{power} W</span>
              </div>
              <Slider
                value={[power]}
                onValueChange={([v]) => setPower(v)}
                min={0.1}
                max={100}
                step={0.1}
              />
            </div>

            {/* Divergence */}
            <div>
              <div className="flex justify-between mb-2">
                <label className="text-sm font-medium">Beam Divergence</label>
                <span className="text-sm font-mono">{divergence} mrad</span>
              </div>
              <Slider
                value={[divergence]}
                onValueChange={([v]) => setDivergence(v)}
                min={0.1}
                max={5}
                step={0.1}
              />
            </div>

            {/* Elevation Angles */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Min Elevation</label>
                  <span className="text-sm font-mono">{minElevation}°</span>
                </div>
                <Slider
                  value={[minElevation]}
                  onValueChange={([v]) => setMinElevation(v)}
                  min={0}
                  max={90}
                  step={1}
                />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-medium">Max Elevation</label>
                  <span className="text-sm font-mono">{maxElevation}°</span>
                </div>
                <Slider
                  value={[maxElevation]}
                  onValueChange={([v]) => setMaxElevation(v)}
                  min={0}
                  max={90}
                  step={1}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cloud className="w-5 h-5 text-blue-600" />
              Weather Conditions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {WEATHER_CONDITIONS.map((weather) => (
                <motion.button
                  key={weather.id}
                  onClick={() => setSelectedWeather(weather)}
                  className={cn(
                    "w-full p-3 rounded-lg border-2 text-left transition-all",
                    selectedWeather.id === weather.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{weather.icon}</span>
                      <div>
                        <div className="font-medium text-sm">{weather.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Visibility: {weather.visibility} miles
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-xs">
                      <div className="text-blue-600">
                        Atten: {(weather.attenuationFactor * 100).toFixed(0)}%
                      </div>
                      <div className="text-orange-600">
                        Spread: {(weather.beamSpreadFactor * 100).toFixed(0)}%
                      </div>
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Results Panel */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* NOHD */}
        <Card className="border-2 border-red-200">
          <CardHeader className="bg-red-50 py-3">
            <CardTitle className="text-base text-red-900">NOHD</CardTitle>
            <CardDescription className="text-red-700 text-xs">
              Eye Hazard Threshold
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{nohdSlant.toLocaleString()}</div>
                <div className="text-xs text-muted-foreground">Slant Range (ft)</div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t">
                <div>
                  <div className="text-lg font-semibold">{nohdHorizontal.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Horizontal</div>
                </div>
                <div>
                  <div className="text-lg font-semibold">{nohdVertical.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Vertical</div>
                </div>
              </div>
              <div className="text-xs text-center text-red-600 bg-red-50 p-1 rounded">
                MPE: {mpe.toFixed(2)} mW/cm²
              </div>
            </div>
          </CardContent>
        </Card>

        {/* SZED */}
        <Card className="border-2 border-yellow-200">
          <CardHeader className="bg-yellow-50 py-3">
            <CardTitle className="text-base text-yellow-900">SZED</CardTitle>
            <CardDescription className="text-yellow-700 text-xs">
              Flashblindness Zone
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isVisible ? (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">{szedSlant.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Slant Range (ft)</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t">
                  <div>
                    <div className="text-lg font-semibold">{szedHorizontal.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Horizontal</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{szedVertical.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Vertical</div>
                  </div>
                </div>
                <div className="text-xs text-center text-yellow-600 bg-yellow-50 p-1 rounded">
                  Threshold: 100 µW/cm²
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">N/A - Non-visible laser</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* CZED */}
        <Card className="border-2 border-orange-200">
          <CardHeader className="bg-orange-50 py-3">
            <CardTitle className="text-base text-orange-900">CZED</CardTitle>
            <CardDescription className="text-orange-700 text-xs">
              Glare Zone
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isVisible ? (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">{czedSlant.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Slant Range (ft)</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t">
                  <div>
                    <div className="text-lg font-semibold">{czedHorizontal.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Horizontal</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{czedVertical.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Vertical</div>
                  </div>
                </div>
                <div className="text-xs text-center text-orange-600 bg-orange-50 p-1 rounded">
                  Threshold: 5 µW/cm²
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">N/A - Non-visible laser</p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* LFED */}
        <Card className="border-2 border-green-200">
          <CardHeader className="bg-green-50 py-3">
            <CardTitle className="text-base text-green-900">LFED</CardTitle>
            <CardDescription className="text-green-700 text-xs">
              Distraction Zone
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            {isVisible ? (
              <div className="space-y-2">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{lfedSlant.toLocaleString()}</div>
                  <div className="text-xs text-muted-foreground">Slant Range (ft)</div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center pt-2 border-t">
                  <div>
                    <div className="text-lg font-semibold">{lfedHorizontal.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Horizontal</div>
                  </div>
                  <div>
                    <div className="text-lg font-semibold">{lfedVertical.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Vertical</div>
                  </div>
                </div>
                <div className="text-xs text-center text-green-600 bg-green-50 p-1 rounded">
                  Threshold: 50 nW/cm²
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Eye className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">N/A - Non-visible laser</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Zone Relationship Info */}
      <Card className="bg-gray-900 text-white">
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-3">Zone Relationships</h4>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span>NOHD: Eye hazard zone (MPE threshold)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-yellow-500 rounded" />
                  <span>SZED: Flashblindness zone (100 µW/cm²)</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                  <span>CZED: Glare zone (5 µW/cm²) = SZED × 4.47</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span>LFED: Distraction zone (50 nW/cm²) = SZED × 44.7</span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-semibold mb-3">Current Weather Impact</h4>
              <p className="text-sm text-muted-foreground mb-3">{selectedWeather.description}</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Visibility:</span>
                  <span>{selectedWeather.visibility} miles</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Power Attenuation:</span>
                  <span>{(selectedWeather.attenuationFactor * 100).toFixed(0)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Beam Spread:</span>
                  <span>{(selectedWeather.beamSpreadFactor * 100).toFixed(0)}%</span>
                </div>
              </div>
              {selectedWeather.restrictions.length > 0 && (
                <div className="mt-3 p-2 bg-yellow-900/50 rounded text-xs text-yellow-200">
                  <strong>Restrictions:</strong>
                  <ul className="mt-1 space-y-1">
                    {selectedWeather.restrictions.map((r, i) => (
                      <li key={i}>• {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function WeatherConsiderations() {
  const [selectedCondition, setSelectedCondition] = useState<WeatherCondition>(WEATHER_CONDITIONS[0]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Weather Conditions</h3>
        {WEATHER_CONDITIONS.map((condition) => (
          <motion.button
            key={condition.id}
            onClick={() => setSelectedCondition(condition)}
            className={cn(
              "w-full p-4 rounded-lg border-2 text-left transition-all",
              selectedCondition.id === condition.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-card"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{condition.icon}</span>
              <div>
                <div className="font-medium">{condition.name}</div>
                <div className="text-xs text-muted-foreground">
                  Vis: {condition.visibility} mi
                </div>
              </div>
            </div>
          </motion.button>
        ))}
      </div>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center gap-3">
            <span className="text-3xl">{selectedCondition.icon}</span>
            <div>
              <CardTitle>{selectedCondition.name}</CardTitle>
              <CardDescription>{selectedCondition.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">{selectedCondition.visibility}</div>
              <div className="text-xs text-muted-foreground">Miles Visibility</div>
            </div>
            <div className="p-4 bg-green-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {(selectedCondition.attenuationFactor * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Power Transmission</div>
            </div>
            <div className="p-4 bg-orange-50 rounded-lg text-center">
              <div className="text-2xl font-bold text-orange-600">
                {((selectedCondition.beamSpreadFactor - 1) * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">Extra Beam Spread</div>
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Operational Considerations
            </h4>
            <ul className="space-y-2">
              {selectedCondition.restrictions.map((restriction, idx) => (
                <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                  <span className="mt-1">•</span>
                  {restriction}
                </li>
              ))}
            </ul>
          </div>

          <div className="text-sm text-muted-foreground">
            <h4 className="font-semibold mb-2">Atmospheric Effects:</h4>
            <p>
              Under {selectedCondition.name.toLowerCase()} conditions, laser beams experience 
              {(selectedCondition.beamSpreadFactor - 1) > 0 ? ' increased ' : ' normal '} 
              divergence due to atmospheric scattering. The effective power reaching the target 
              is reduced to {(selectedCondition.attenuationFactor * 100).toFixed(0)}% of the source power 
              due to atmospheric attenuation.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function AtmosphericEffects() {
  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingDown className="w-5 h-5 text-blue-600" />
              Atmospheric Attenuation
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Laser power decreases as it travels through the atmosphere due to absorption 
              and scattering by air molecules, water vapor, and particulates.
            </p>
            
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm">Rayleigh Scattering</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Dominates in clear air. Scattering intensity ∝ 1/λ⁴. 
                  Blue light scatters more than red.
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm">Mie Scattering</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Caused by particles comparable to wavelength (dust, pollen). 
                  Affects all wavelengths more equally.
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm">Absorption Bands</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Water vapor and CO₂ have specific absorption bands. 
                  Some wavelengths (e.g., 1550 nm) are &quot;eye-safe&quot; due to corneal absorption.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-orange-600" />
              Beam Spread Effects
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Atmospheric turbulence and scattering cause beam divergence to increase, 
              reducing irradiance at the target but potentially affecting a larger area.
            </p>
            
            <div className="space-y-3">
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm">Thermal Blooming</div>
                <p className="text-xs text-muted-foreground mt-1">
                  High-power lasers heat the air, changing its refractive index 
                  and causing additional beam spread.
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm">Turbulence (Scintillation)</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Atmospheric turbulence causes beam wandering and intensity fluctuations. 
                  Can cause momentary focusing but generally averages out.
                </p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <div className="font-medium text-sm">Precipitation Scatter</div>
                <p className="text-xs text-muted-foreground mt-1">
                  Rain, snow, and fog scatter laser light, significantly increasing 
                  beam divergence and reducing range.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            Conservative Calculation Approach
          </h4>
          <p className="text-sm text-blue-700">
            FAA AC 70-1B recommends using conservative (clear-air) calculations for safety 
            assessments. While atmospheric attenuation and scintillation exist, they roughly 
            cancel each other out and cannot be relied upon for safety. Always use worst-case 
            clear-air assumptions for hazard distance calculations.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

export default function Module3_Outdoor_Calculations() {
  const [activeTab, setActiveTab] = useState('calculator');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
          <Calculator className="w-4 h-4" />
          Module 6.3
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">Outdoor Hazard Calculations</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Extended NOHD calculations, atmospheric effects on laser propagation, 
          weather considerations, and interactive safety zone calculator with real-time adjustments.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="calculator" className="flex items-center gap-2">
            <Calculator className="w-4 h-4" />
            Safety Calculator
          </TabsTrigger>
          <TabsTrigger value="weather" className="flex items-center gap-2">
            <Cloud className="w-4 h-4" />
            Weather
          </TabsTrigger>
          <TabsTrigger value="atmospheric" className="flex items-center gap-2">
            <Wind className="w-4 h-4" />
            Atmospheric
          </TabsTrigger>
        </TabsList>

        <TabsContent value="calculator" className="mt-6">
          <ExtendedNOHDCalculator />
        </TabsContent>

        <TabsContent value="weather" className="mt-6">
          <WeatherConsiderations />
        </TabsContent>

        <TabsContent value="atmospheric" className="mt-6">
          <AtmosphericEffects />
        </TabsContent>
      </Tabs>

      {/* Reference */}
      <Card className="bg-muted border-gray-200">
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">
            <strong>Reference:</strong> FAA AC 70-1B Appendix A & B. Equations 70-1.1 through 70-1.13. 
            ANSI Z136.1-2022 for MPE calculations. Visual Correction Factors from CIE photopic curve.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
