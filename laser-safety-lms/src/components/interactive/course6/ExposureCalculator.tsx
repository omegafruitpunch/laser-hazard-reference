"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

interface ExposureZone {
  name: string;
  threshold: number; // in nW/cm²
  thresholdDisplay: string;
  color: string;
  bgColor: string;
  description: string;
  effect: string;
}

const exposureZones: ExposureZone[] = [
  {
    name: "Laser Free Zone",
    threshold: 50,
    thresholdDisplay: "50 nW/cm²",
    color: "text-red-600",
    bgColor: "bg-red-50",
    description: "No laser radiation should reach aircraft",
    effect: "Distraction threshold",
  },
  {
    name: "Critical Flight Zone",
    threshold: 5000,
    thresholdDisplay: "5 µW/cm²",
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    description: "Glare prevention limit",
    effect: "Glare effect",
  },
  {
    name: "Sensitive Flight Zone",
    threshold: 100000,
    thresholdDisplay: "100 µW/cm²",
    color: "text-yellow-600",
    bgColor: "bg-yellow-50",
    description: "Flashblindness prevention limit",
    effect: "Flashblindness",
  },
  {
    name: "Normal Flight Zone",
    threshold: 2600,
    thresholdDisplay: "MPE (2.6 mW/cm²)",
    color: "text-green-600",
    bgColor: "bg-green-50",
    description: "Standard eye safety MPE limit",
    effect: "Eye hazard",
  },
];

export const ExposureCalculator: React.FC = () => {
  const [distance, setDistance] = useState(5000); // feet
  const [laserPower, setLaserPower] = useState(10); // Watts
  const [beamDivergence, setBeamDivergence] = useState(1.0); // mrad
  const [wavelength, setWavelength] = useState(532); // nm
  const [exposure, setExposure] = useState(0); // nW/cm²
  const [selectedZone, setSelectedZone] = useState<ExposureZone>(exposureZones[0]);

  // Visual correction factors (simplified)
  const getVCF = (wl: number): number => {
    if (wl < 400 || wl > 700) return 0;
    // Simplified VCF calculation
    const peakWL = 555;
    const vcf = Math.exp(-Math.pow(wl - peakWL, 2) / (2 * 80 * 80));
    return Math.max(0.01, vcf);
  };

  useEffect(() => {
    calculateExposure();
  }, [distance, laserPower, beamDivergence, wavelength]);

  const calculateExposure = () => {
    // Calculate beam area at distance
    const beamRadiusAtDistance = (beamDivergence * distance * 0.3048) / 1000 / 2; // meters
    const beamArea = Math.PI * beamRadiusAtDistance * beamRadiusAtDistance; // m²
    
    // Calculate power density
    const powerDensity = (laserPower / beamArea) * 100; // W/m² = 100 * nW/cm² (rough conversion)
    const vcf = getVCF(wavelength);
    const adjustedExposure = powerDensity * vcf;
    
    setExposure(adjustedExposure);

    // Determine which zone this exposure falls into
    if (adjustedExposure >= exposureZones[2].threshold) {
      setSelectedZone(exposureZones[2]); // SFZ
    } else if (adjustedExposure >= exposureZones[1].threshold) {
      setSelectedZone(exposureZones[1]); // CFZ
    } else if (adjustedExposure >= exposureZones[0].threshold) {
      setSelectedZone(exposureZones[0]); // LFZ threshold crossed
    } else {
      setSelectedZone(exposureZones[3]); // Below LFZ threshold
    }
  };

  const getZoneForExposure = (exp: number): ExposureZone => {
    if (exp >= exposureZones[2].threshold) return exposureZones[2];
    if (exp >= exposureZones[1].threshold) return exposureZones[1];
    if (exp >= exposureZones[0].threshold) return exposureZones[0];
    return { ...exposureZones[3], name: "Safe Zone", description: "Below all thresholds" };
  };

  const currentZone = getZoneForExposure(exposure);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">50 nW/cm² Threshold Visualizer</h2>
        <p className="text-muted-foreground">Interactive visualization of FAA exposure thresholds</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Panel */}
        <Card>
          <CardHeader>
            <CardTitle>Laser Parameters</CardTitle>
            <CardDescription>Adjust to see exposure at different distances</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Distance */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Distance: {distance.toLocaleString()} ft
              </label>
              <input
                type="range"
                min="100"
                max="50000"
                step="100"
                value={distance}
                onChange={(e) => setDistance(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>100 ft</span>
                <span>50,000 ft</span>
              </div>
            </div>

            {/* Power */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Laser Power: {laserPower} W
              </label>
              <input
                type="range"
                min="0.1"
                max="100"
                step="0.1"
                value={laserPower}
                onChange={(e) => setLaserPower(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0.1 W</span>
                <span>100 W</span>
              </div>
            </div>

            {/* Divergence */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Beam Divergence: {beamDivergence} mrad
              </label>
              <input
                type="range"
                min="0.1"
                max="5"
                step="0.1"
                value={beamDivergence}
                onChange={(e) => setBeamDivergence(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0.1 mrad</span>
                <span>5 mrad</span>
              </div>
            </div>

            {/* Wavelength */}
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Wavelength: {wavelength} nm
              </label>
              <input
                type="range"
                min="400"
                max="700"
                step="1"
                value={wavelength}
                onChange={(e) => setWavelength(Number(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>400 nm (violet)</span>
                <span>700 nm (red)</span>
              </div>
              <div className="mt-2 p-2 bg-muted rounded text-sm">
                <span className="font-medium">Visual Correction Factor:</span>{" "}
                {getVCF(wavelength).toFixed(3)}
                {wavelength >= 520 && wavelength <= 570 && (
                  <span className="text-green-600 ml-2">(Peak visibility)</span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Visualization Panel */}
        <div className="space-y-4">
          {/* Exposure Meter */}
          <Card className={cn("border-2", currentZone.name === "Safe Zone" ? "border-green-200" : "border-red-200")}>
            <CardHeader>
              <CardTitle>Calculated Exposure</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className="text-5xl font-bold text-foreground">
                  {exposure >= 1000 
                    ? `${(exposure / 1000).toFixed(2)} µW/cm²`
                    : `${exposure.toFixed(1)} nW/cm²`
                  }
                </div>
                <div className={cn("mt-4 inline-block px-4 py-2 rounded-lg font-semibold", currentZone.bgColor, currentZone.color)}>
                  {currentZone.name}
                </div>
                <p className="text-sm text-muted-foreground mt-2">{currentZone.description}</p>
              </div>

              {/* Threshold Comparison */}
              <div className="mt-6 space-y-3">
                {exposureZones.map((zone) => {
                  const isExceeded = exposure >= zone.threshold;
                  const percentage = Math.min(100, (exposure / zone.threshold) * 100);
                  
                  return (
                    <div key={zone.name} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{zone.thresholdDisplay}</span>
                        <span className={isExceeded ? "text-red-600" : "text-green-600"}>
                          {isExceeded ? "EXCEEDED" : "Below"}
                        </span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={cn(
                            "h-full transition-all",
                            isExceeded ? "bg-red-500" : "bg-green-500"
                          )}
                          style={{ width: `${Math.min(100, percentage)}%` }}
                        />
                      </div>
                      <div className="text-xs text-muted-foreground">{zone.effect}</div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Zone Legend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Threshold Legend</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {exposureZones.map((zone) => (
                  <div key={zone.name} className="flex items-center gap-3 text-sm">
                    <div className={cn("w-4 h-4 rounded", zone.bgColor)} />
                    <span className="font-medium">{zone.thresholdDisplay}</span>
                    <span className="text-muted-foreground">- {zone.effect}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Educational Content */}
      <Card>
        <CardHeader>
          <CardTitle>Understanding the 50 nW/cm² Threshold</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-2">Why 50 nW/cm²?</h4>
              <p className="text-sm text-muted-foreground mb-4">
                This threshold represents the level at which laser light becomes visible to pilots 
                and can cause distraction. Below this level, the laser is generally not bright enough 
                to be noticed by aircrew during normal operations.
              </p>
              <h4 className="font-semibold text-foreground mb-2">Visual Interference Hierarchy</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>50 nW/cm²:</strong> Distraction - pilot notices light</li>
                <li>• <strong>5 µW/cm²:</strong> Glare - vision obscured while light on</li>
                <li>• <strong>100 µW/cm²:</strong> Flashblindness - afterimages persist</li>
                <li>• <strong>2.6 mW/cm²:</strong> MPE - potential eye injury</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-2">Regulatory Context</h4>
              <p className="text-sm text-muted-foreground mb-4">
                The FAA establishes these thresholds in AC 70-1B for evaluating laser operations 
                in navigable airspace. The Laser Free Zone (LFZ) uses the most restrictive threshold 
                because it protects the most critical flight phases.
              </p>
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-800">
                <strong>Remember:</strong> No laser radiation should enter the LFZ. 
                The 50 nW/cm² threshold is used to calculate the LFED (Laser-Free Exposure Distance).
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExposureCalculator;
