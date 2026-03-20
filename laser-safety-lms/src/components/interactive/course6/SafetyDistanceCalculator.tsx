"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CalculationMode {
  id: "cw" | "pulsed" | "rep_pulsed";
  label: string;
  description: string;
}

const calculationModes: CalculationMode[] = [
  { id: "cw", label: "Continuous Wave (CW)", description: "Non-pulsed output > 0.25 seconds" },
  { id: "pulsed", label: "Single Pulse", description: "Single pulse < 0.25 seconds" },
  { id: "rep_pulsed", label: "Repetitively Pulsed", description: "PRF ≥ 1 Hz" },
];

// Visual correction factors (simplified)
const getVCF = (wavelength: number): number => {
  if (wavelength < 400 || wavelength > 700) return 0;
  const peakWL = 555;
  const vcf = Math.exp(-Math.pow(wavelength - peakWL, 2) / (2 * 80 * 80));
  return Math.max(0.01, vcf);
};

// Calculate CA correction factor
const calculateCA = (wavelength: number): number => {
  if (wavelength < 700 || wavelength > 1050) return 1;
  return Math.pow(10, 0.002 * (wavelength - 700));
};

export const SafetyDistanceCalculator: React.FC = () => {
  const [mode, setMode] = useState<"cw" | "pulsed" | "rep_pulsed">("cw");
  const [wavelength, setWavelength] = useState(532);
  const [power, setPower] = useState(10);
  const [beamDivergence, setBeamDivergence] = useState(1.5);
  const [minElevation, setMinElevation] = useState(15);
  const [maxElevation, setMaxElevation] = useState(45);
  const [activeTab, setActiveTab] = useState<"input" | "results">("input");

  // Calculated values
  const [mpeValue, setMpeValue] = useState(2.6);
  const [caFactor, setCaFactor] = useState(1);
  const [vcfValue, setVcfValue] = useState(0.8621);
  const [results, setResults] = useState({
    nohdSlant: 0,
    nohdHorizontal: 0,
    nohdVertical: 0,
    szedSlant: 0,
    szedHorizontal: 0,
    szedVertical: 0,
    czedSlant: 0,
    czedHorizontal: 0,
    czedVertical: 0,
    lfedSlant: 0,
    lfedHorizontal: 0,
    lfedVertical: 0,
  });

  useEffect(() => {
    calculateAll();
  }, [mode, wavelength, power, beamDivergence, minElevation, maxElevation]);

  const calculateAll = () => {
    // Determine MPE
    let mpe = 2.6;
    let ca = 1;

    if (wavelength >= 700 && wavelength <= 1050) {
      ca = calculateCA(wavelength);
      mpe = 2.6 * ca;
    } else if (wavelength > 1050 && wavelength <= 1150) {
      mpe = 12.75;
    } else if (wavelength > 1400 && wavelength <= 1500) {
      mpe = 2384;
    } else if (wavelength > 1500 && wavelength <= 1800) {
      mpe = 4000;
    } else if (wavelength > 1800) {
      mpe = 1584;
    }

    setMpeValue(mpe);
    setCaFactor(ca);
    setVcfValue(getVCF(wavelength));

    // Calculate NOHD Slant Range (Equation 70-1.2 for CW)
    const nohdSlant = Math.round((32.8 / beamDivergence) * Math.sqrt((1273.2 * power) / mpe));

    // Calculate SZED Slant Range (Equation 70-1.3)
    const vcp = power * getVCF(wavelength);
    const szedSlant =
      wavelength >= 400 && wavelength <= 700
        ? Math.round((32.8 / beamDivergence) * Math.sqrt(12732 * vcp))
        : 0;

    // CZED = SZED × 4.47 (Equation 70-1.4)
    const czedSlant = szedSlant > 0 ? Math.round(szedSlant * 4.47) : 0;

    // LFED = SZED × 44.7 (Equation 70-1.5)
    const lfedSlant = szedSlant > 0 ? Math.round(szedSlant * 44.7) : 0;

    // Calculate horizontal and vertical distances
    const nohdHorizontal = Math.round(nohdSlant * Math.cos((minElevation * Math.PI) / 180));
    const nohdVertical = Math.round(nohdSlant * Math.sin((maxElevation * Math.PI) / 180));

    const szedHorizontal = Math.round(szedSlant * Math.cos((minElevation * Math.PI) / 180));
    const szedVertical = Math.round(szedSlant * Math.sin((maxElevation * Math.PI) / 180));

    const czedHorizontal = Math.round(czedSlant * Math.cos((minElevation * Math.PI) / 180));
    const czedVertical = Math.round(czedSlant * Math.sin((maxElevation * Math.PI) / 180));

    const lfedHorizontal = Math.round(lfedSlant * Math.cos((minElevation * Math.PI) / 180));
    const lfedVertical = Math.round(lfedSlant * Math.sin((maxElevation * Math.PI) / 180));

    setResults({
      nohdSlant,
      nohdHorizontal,
      nohdVertical,
      szedSlant,
      szedHorizontal,
      szedVertical,
      czedSlant,
      czedHorizontal,
      czedVertical,
      lfedSlant,
      lfedHorizontal,
      lfedVertical,
    });
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Safety Distance Calculator</h2>
        <p className="text-muted-foreground">Calculate NOHD, SZED, CZED, and LFED per FAA AC 70-1B</p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center">
        <div className="bg-muted p-1 rounded-lg inline-flex">
          {[
            { id: "input", label: "Input Parameters", icon: "⚙️" },
            { id: "results", label: "Results", icon: "📊" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "px-4 py-2 rounded-md font-medium transition-all flex items-center",
                activeTab === tab.id ? "bg-card text-blue-600 shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Input Tab */}
      {activeTab === "input" && (
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Laser Parameters */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>⚡</span> Laser Parameters
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Mode Selection */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">Mode of Operation</label>
                <div className="space-y-2">
                  {calculationModes.map((m) => (
                    <label key={m.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-muted">
                      <input
                        type="radio"
                        name="mode"
                        value={m.id}
                        checked={mode === m.id}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium text-sm">{m.label}</div>
                        <div className="text-xs text-muted-foreground">{m.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Wavelength */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Wavelength: {wavelength} nm</label>
                <input
                  type="range"
                  min="400"
                  max="10000"
                  step="1"
                  value={wavelength}
                  onChange={(e) => setWavelength(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>400 nm</span>
                  <span>10,000 nm</span>
                </div>
                <div className="mt-2 p-2 bg-blue-50 rounded text-sm">
                  <span className="font-medium">VCF:</span> {vcfValue.toFixed(4)}
                  {wavelength >= 700 && wavelength <= 1050 && (
                    <span className="ml-2">| CA: {caFactor.toFixed(3)}</span>
                  )}
                </div>
              </div>

              {/* Power */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Power: {power} W</label>
                <input
                  type="range"
                  min="0.1"
                  max="100"
                  step="0.1"
                  value={power}
                  onChange={(e) => setPower(Number(e.target.value))}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1 W</span>
                  <span>100 W</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Beam & Geometry */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <span>📐</span> Beam Characteristics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Beam Divergence */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">
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
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>0.1 mrad (tight)</span>
                  <span>5 mrad (wide)</span>
                </div>
              </div>

              <CardTitle className="flex items-center gap-2 mt-6">
                <span>🎯</span> Beam Direction
              </CardTitle>

              {/* Elevation Angles */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Minimum Elevation: {minElevation}°</label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={minElevation}
                  onChange={(e) => setMinElevation(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Maximum Elevation: {maxElevation}°</label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={maxElevation}
                  onChange={(e) => setMaxElevation(Number(e.target.value))}
                  className="w-full"
                />
              </div>

              {/* Visual Angle Indicator */}
              <div className="mt-4 p-4 bg-muted rounded-lg">
                <div className="text-center">
                  <div className="relative h-32 w-full">
                    <div
                      className="absolute bottom-0 left-1/2 w-1 bg-blue-600 origin-bottom transition-transform"
                      style={{
                        height: "100px",
                        transform: `translateX(-50%) rotate(-${minElevation}deg)`,
                      }}
                    />
                    <div
                      className="absolute bottom-0 left-1/2 w-1 bg-red-600 origin-bottom transition-transform"
                      style={{
                        height: "100px",
                        transform: `translateX(-50%) rotate(-${maxElevation}deg)`,
                      }}
                    />
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs text-muted-foreground">Laser Source</div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-2">
                    Beam sweep: {minElevation}° to {maxElevation}°
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Results Tab */}
      {activeTab === "results" && (
        <div className="space-y-6">
          {/* MPE Display */}
          <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
            <h3 className="text-lg font-bold text-blue-800 mb-4">Calculated Parameters</h3>
            <div className="grid md:grid-cols-4 gap-4">
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground">MPE Value</div>
                <div className="text-2xl font-bold text-blue-600">{mpeValue.toFixed(2)}</div>
                <div className="text-xs text-muted-foreground">mW/cm²</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Visual Correction Factor</div>
                <div className="text-2xl font-bold text-blue-600">{vcfValue.toFixed(4)}</div>
                <div className="text-xs text-muted-foreground">VCF</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground">CA Factor</div>
                <div className="text-2xl font-bold text-blue-600">{caFactor.toFixed(3)}</div>
                <div className="text-xs text-muted-foreground">Near-IR correction</div>
              </div>
              <div className="bg-card rounded-lg p-4">
                <div className="text-sm text-muted-foreground">Laser Power</div>
                <div className="text-2xl font-bold text-blue-600">{power}</div>
                <div className="text-xs text-muted-foreground">Watts</div>
              </div>
            </div>
          </div>

          {/* Distance Results */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* NOHD Card */}
            <Card className="overflow-hidden border-2 border-red-200">
              <CardHeader className="bg-red-600 text-white">
                <CardTitle>NOHD</CardTitle>
                <CardDescription className="text-red-100">Nominal Ocular Hazard Distance</CardDescription>
                <p className="text-xs mt-1">Threshold: MPE ({mpeValue.toFixed(2)} mW/cm²)</p>
              </CardHeader>
              <CardContent className="pt-4">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-foreground">{results.nohdSlant.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Slant Range (ft)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{results.nohdHorizontal.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Horizontal (ft)</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-foreground">{results.nohdVertical.toLocaleString()}</div>
                    <div className="text-xs text-muted-foreground">Vertical (ft)</div>
                  </div>
                </div>
                <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">Eye hazard zone - protective measures required within this distance</div>
              </CardContent>
            </Card>

            {/* SZED Card */}
            <Card className="overflow-hidden border-2 border-yellow-200">
              <CardHeader className="bg-yellow-600 text-white">
                <CardTitle>SZED</CardTitle>
                <CardDescription className="text-yellow-100">Sensitive Zone Exposure Distance</CardDescription>
                <p className="text-xs mt-1">Threshold: 100 µW/cm²</p>
              </CardHeader>
              <CardContent className="pt-4">
                {wavelength >= 400 && wavelength <= 700 ? (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.szedSlant.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Slant Range (ft)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.szedHorizontal.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Horizontal (ft)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.szedVertical.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Vertical (ft)</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">N/A - Visual effects calculation only for visible lasers (400-700 nm)</div>
                )}
                <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">Flashblindness zone - temporary afterimages possible</div>
              </CardContent>
            </Card>

            {/* CZED Card */}
            <Card className="overflow-hidden border-2 border-orange-200">
              <CardHeader className="bg-orange-600 text-white">
                <CardTitle>CZED</CardTitle>
                <CardDescription className="text-orange-100">Critical Zone Exposure Distance</CardDescription>
                <p className="text-xs mt-1">Threshold: 5 µW/cm²</p>
              </CardHeader>
              <CardContent className="pt-4">
                {wavelength >= 400 && wavelength <= 700 ? (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.czedSlant.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Slant Range (ft)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.czedHorizontal.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Horizontal (ft)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.czedVertical.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Vertical (ft)</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">N/A - Visual effects calculation only for visible lasers</div>
                )}
                <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">Glare zone - vision obscured while light is on</div>
              </CardContent>
            </Card>

            {/* LFED Card */}
            <Card className="overflow-hidden border-2 border-green-200">
              <CardHeader className="bg-green-600 text-white">
                <CardTitle>LFED</CardTitle>
                <CardDescription className="text-green-100">Laser-Free Exposure Distance</CardDescription>
                <p className="text-xs mt-1">Threshold: 50 nW/cm²</p>
              </CardHeader>
              <CardContent className="pt-4">
                {wavelength >= 400 && wavelength <= 700 ? (
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.lfedSlant.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Slant Range (ft)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.lfedHorizontal.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Horizontal (ft)</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-foreground">{results.lfedVertical.toLocaleString()}</div>
                      <div className="text-xs text-muted-foreground">Vertical (ft)</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">N/A - Visual effects calculation only for visible lasers</div>
                )}
                <div className="mt-4 text-xs text-muted-foreground bg-muted p-2 rounded">Distraction zone - mental interference possible</div>
              </CardContent>
            </Card>
          </div>

          {/* Zone Relationship */}
          <Card className="bg-gray-900 text-white">
            <CardHeader>
              <CardTitle className="text-white">Zone Relationship</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Fixed relationships: CZED = SZED × 4.47 | LFED = SZED × 44.7
              </p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-red-500 rounded" />
                  <span>NOHD: Eye hazard zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-yellow-500 rounded" />
                  <span>SZED: Flashblindness zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-orange-500 rounded" />
                  <span>CZED: Glare zone</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-green-500 rounded" />
                  <span>LFED: Distraction zone</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default SafetyDistanceCalculator;
