"use client";

import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calculator,
  Eye,
  Target,
  BookOpen,
  Sun,
  Wind,
  Shield,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Lightbulb,
  Info,
  ArrowRight,
  Layers,
  Maximize2,
  MapPin,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  HelpCircle,
  FlaskConical,
  Ruler,
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface MPEEntry {
  wavelength: string;
  range: [number, number];
  exposureDuration: string;
  mpeValue: string;
  unit: string;
  notes?: string;
}

interface ExampleProblem {
  id: string;
  title: string;
  description: string;
  laserClass: string;
  wavelength: number;
  power: number;
  divergence: number;
  exposureDuration: number;
  correctNOHD: number;
  steps: string[];
  hints: string[];
}

interface SafetyZone {
  name: string;
  abbreviation: string;
  description: string;
  threshold: string;
  color: string;
  bgColor: string;
  multiplier?: number;
}

interface AtmosphericCondition {
  name: string;
  description: string;
  attenuationFactor: number;
  visibility: string;
}

// ============================================================================
// Constants & Data
// ============================================================================

const MPE_TABLES: Record<string, MPEEntry[]> = {
  "visible-cw": [
    { wavelength: "400-700 nm", range: [400, 700], exposureDuration: "0.25 s", mpeValue: "2.54", unit: "mW/cm²", notes: "Photopic vision, 555 nm peak sensitivity" },
    { wavelength: "400-700 nm", range: [400, 700], exposureDuration: "0.25-10 s", mpeValue: "1.8 * t^0.75", unit: "mJ/cm²", notes: "Time-dependent MPE" },
    { wavelength: "400-700 nm", range: [400, 700], exposureDuration: "> 10 s", mpeValue: "1.0", unit: "mW/cm²", notes: "Long-term exposure limit" },
  ],
  "near-ir-cw": [
    { wavelength: "700-1050 nm", range: [700, 1050], exposureDuration: "0.25 s", mpeValue: "2.54 * CA", unit: "mW/cm²", notes: "CA = 10^[(λ-700)/500]" },
    { wavelength: "700-1050 nm", range: [700, 1050], exposureDuration: "> 10 s", mpeValue: "1.0 * CA", unit: "mW/cm²", notes: "Extended exposure" },
    { wavelength: "1050-1400 nm", range: [1050, 1400], exposureDuration: "0.25 s", mpeValue: "12.75", unit: "mW/cm²", notes: "Retinal thermal limit" },
  ],
  "mid-far-ir": [
    { wavelength: "1400-1500 nm", range: [1400, 1500], exposureDuration: "0.25 s", mpeValue: "2384", unit: "mW/cm²", notes: "Corneal absorption" },
    { wavelength: "1500-1800 nm", range: [1500, 1800], exposureDuration: "0.25 s", mpeValue: "4000", unit: "mW/cm²", notes: "Water absorption peak" },
    { wavelength: "1800-2600 nm", range: [1800, 2600], exposureDuration: "0.25 s", mpeValue: "1584", unit: "mW/cm²", notes: "Corneal limit" },
    { wavelength: "2600-10000 nm", range: [2600, 10000], exposureDuration: "0.25 s", mpeValue: "1584", unit: "mW/cm²", notes: "Far IR safety" },
  ],
  "uv": [
    { wavelength: "180-302 nm", range: [180, 302], exposureDuration: "8 h", mpeValue: "3.0", unit: "mJ/cm²", notes: "Photochemical limit" },
    { wavelength: "302-315 nm", range: [302, 315], exposureDuration: "8 h", mpeValue: "40", unit: "J/m²", notes: "UV-B range" },
    { wavelength: "315-400 nm", range: [315, 400], exposureDuration: "0.25 s", mpeValue: "10", unit: "J/cm²", notes: "UV-A photochemical" },
    { wavelength: "315-400 nm", range: [315, 400], exposureDuration: "10-10000 s", mpeValue: "1.0", unit: "W/m²", notes: "Extended exposure" },
  ],
};

const SAFETY_ZONES: SafetyZone[] = [
  {
    name: "Nominal Hazard Zone",
    abbreviation: "NHZ",
    description: "Area where laser radiation exceeds MPE - access control required",
    threshold: "MPE Level",
    color: "text-red-500",
    bgColor: "bg-red-500",
  },
  {
    name: "Sensitive Zone Exposure Distance",
    abbreviation: "SZED",
    description: "Distance where flashblindness can occur (visible lasers only)",
    threshold: "100 µW/cm²",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500",
    multiplier: 1,
  },
  {
    name: "Critical Zone Exposure Distance",
    abbreviation: "CZED",
    description: "Distance where glare affects critical task performance",
    threshold: "5 µW/cm²",
    color: "text-orange-500",
    bgColor: "bg-orange-500",
    multiplier: 4.47,
  },
  {
    name: "Laser-Free Exposure Distance",
    abbreviation: "LFED",
    description: "Distance where no visual interference occurs",
    threshold: "50 nW/cm²",
    color: "text-green-500",
    bgColor: "bg-green-500",
    multiplier: 44.7,
  },
];

const ATMOSPHERIC_CONDITIONS: AtmosphericCondition[] = [
  { name: "Clear", description: "Excellent visibility", attenuationFactor: 1.0, visibility: "> 20 km" },
  { name: "Light Haze", description: "Slight reduction", attenuationFactor: 0.9, visibility: "10-20 km" },
  { name: "Moderate Haze", description: "Visible reduction", attenuationFactor: 0.75, visibility: "5-10 km" },
  { name: "Heavy Haze", description: "Significant reduction", attenuationFactor: 0.5, visibility: "2-5 km" },
  { name: "Light Fog", description: "Poor visibility", attenuationFactor: 0.25, visibility: "0.5-2 km" },
  { name: "Dense Fog", description: "Very poor visibility", attenuationFactor: 0.1, visibility: "< 0.5 km" },
];

const EXAMPLE_PROBLEMS: ExampleProblem[] = [
  {
    id: "1",
    title: "Classroom Laser Pointer",
    description: "A Class 2 laser pointer is used in a classroom setting.",
    laserClass: "Class 2",
    wavelength: 650,
    power: 0.001,
    divergence: 1.5,
    exposureDuration: 0.25,
    correctNOHD: 0.5,
    steps: [
      "Identify MPE for visible laser (650 nm) at 0.25 s exposure: 2.54 mW/cm²",
      "Convert units: 2.54 mW/cm² = 0.00254 W/cm²",
      "Apply NOHD formula: NOHD = √(4 * Φ / (π * MPE)) / φ",
      "Calculate: √(4 * 0.001 / (π * 0.00254)) / 0.0015",
      "Result: NOHD ≈ 0.5 meters",
    ],
    hints: [
      "Remember: Class 2 lasers have very short NOHD due to low power",
      "Convert mW to W by dividing by 1000",
      "Convert mrad to rad by dividing by 1000",
    ],
  },
  {
    id: "2",
    title: "Research Laboratory Laser",
    description: "A HeNe laser used for optical alignment in a research lab.",
    laserClass: "Class 3B",
    wavelength: 632.8,
    power: 0.05,
    divergence: 1.0,
    exposureDuration: 0.25,
    correctNOHD: 79.4,
    steps: [
      "MPE for HeNe wavelength (632.8 nm): 2.54 mW/cm² = 0.00254 W/cm²",
      "Beam divergence in radians: 1.0 mrad = 0.001 rad",
      "Calculate beam area factor: 4 * 0.05 = 0.2",
      "Calculate denominator: π * 0.00254 * (0.001)²",
      "NOHD = √(0.2 / 0.00000000796) ≈ 79.4 meters",
    ],
    hints: [
      "HeNe lasers operate at 632.8 nm (red)",
      "Class 3B lasers require careful control measures",
      "Square root calculations can be verified: √6300 ≈ 79.4",
    ],
  },
  {
    id: "3",
    title: "Industrial Cutting Laser",
    description: "High-power fiber laser for metal cutting operations.",
    laserClass: "Class 4",
    wavelength: 1070,
    power: 2000,
    divergence: 5.0,
    exposureDuration: 0.25,
    correctNOHD: 3550,
    steps: [
      "For 1070 nm (near-IR), calculate CA: CA = 10^[(1070-700)/500] = 5.25",
      "MPE = 2.54 * 5.25 = 13.34 mW/cm² = 0.01334 W/cm²",
      "Convert divergence: 5.0 mrad = 0.005 rad",
      "Calculate: √(4 * 2000 / (π * 0.01334)) / 0.005",
      "NOHD = √(190800 / 0.0419) / 0.005 ≈ 3.55 km",
    ],
    hints: [
      "Near-IR wavelengths require CA correction factor",
      "High power lasers have very long NOHD distances",
      "Result is in kilometers due to high power",
    ],
  },
];

// ============================================================================
// Helper Functions
// ============================================================================

const calculateCA = (wavelength: number): number => {
  if (wavelength < 700 || wavelength > 1050) return 1;
  return Math.pow(10, 0.002 * (wavelength - 700));
};

const calculateMPE = (wavelength: number, duration: number = 0.25): number => {
  if (wavelength >= 400 && wavelength <= 700) {
    if (duration <= 0.25) return 0.00254;
    if (duration <= 10) return 0.0018 * Math.pow(duration, 0.75) / 10;
    return 0.001;
  }
  if (wavelength > 700 && wavelength <= 1050) {
    const ca = calculateCA(wavelength);
    return 0.00254 * ca;
  }
  if (wavelength > 1050 && wavelength <= 1150) return 0.01275;
  if (wavelength > 1150 && wavelength <= 1200) return 0.01275;
  if (wavelength > 1200 && wavelength <= 1400) return 0.01275;
  if (wavelength > 1400 && wavelength <= 1500) return 2.384;
  if (wavelength > 1500 && wavelength <= 1800) return 4.0;
  if (wavelength > 1800 && wavelength <= 2600) return 1.584;
  if (wavelength > 2600 && wavelength <= 10000) return 1.584;
  if (wavelength >= 315 && wavelength < 400) return 10000;
  if (wavelength >= 302 && wavelength < 315) return 40;
  return 0.00254;
};

const calculateNOHD = (power: number, divergence: number, mpe: number): number => {
  const divergenceRad = divergence * 0.001;
  const mpeWcm2 = mpe;
  return Math.sqrt((4 * power) / (Math.PI * mpeWcm2)) / divergenceRad;
};

const calculateENOHD = (nohd: number, atmosphericFactor: number): number => {
  return nohd / Math.sqrt(atmosphericFactor);
};

// ============================================================================
// Section Components
// ============================================================================

// Section 1: Understanding NOHD
const UnderstandingNOHDSection: React.FC = () => {
  const [power, setPower] = useState(1);
  const [divergence, setDivergence] = useState(1);
  const [wavelength, setWavelength] = useState(532);

  const mpe = useMemo(() => calculateMPE(wavelength), [wavelength]);
  const nohd = useMemo(() => calculateNOHD(power, divergence, mpe), [power, divergence, mpe]);

  return (
    <div className="space-y-6" role="region" aria-label="Understanding NOHD section">
      {/* Skip link */}
      <a 
        href="#nohd-calculator" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to NOHD calculator
      </a>

      {/* Explanation */}
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-500" aria-hidden="true" />
          What is NOHD?
        </h3>
        <p className="text-muted-foreground">
          The <strong>Nominal Ocular Hazard Distance (NOHD)</strong> is the distance from the laser source 
          along the axis of the unobstructed beam to the human eye where the beam irradiance or radiant 
          exposure does not exceed the Maximum Permissible Exposure (MPE).
        </p>
        <p className="text-muted-foreground">
          Beyond the NOHD, the laser beam has diverged enough that it is safe for the unaided eye. 
          Within the NOHD, protective measures are required.
        </p>
      </div>

      {/* Visual Diagram */}
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" aria-hidden="true" />
            Beam Divergence Visualization
          </CardTitle>
          <CardDescription>How the beam spreads and where the hazard zone ends</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-8">
            <svg viewBox="0 0 600 200" className="w-full h-48" role="img" aria-label="Diagram showing laser beam divergence from source through hazard zone to safe zone at NOHD">
              <title id="nohd-viz-title">NOHD Visualization Diagram</title>
              <desc id="nohd-viz-desc">
                Diagram showing laser source emitting a beam that gradually diverges. 
                The area before NOHD is marked as hazard zone (red), and the area after NOHD is safe zone (green).
              </desc>
              <defs>
                <linearGradient id="beamGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="rgba(239, 68, 68, 0.6)" />
                  <stop offset="100%" stopColor="rgba(239, 68, 68, 0.1)" />
                </linearGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>

              {/* Source */}
              <circle cx="40" cy="100" r="20" fill="#DC2626" filter="url(#glow)" />
              <text x="40" y="140" textAnchor="middle" className="text-xs fill-gray-600 font-medium">Laser Source</text>

              {/* Hazard zone (red) */}
              <path 
                d="M 60 100 L 350 45 L 350 155 Z" 
                fill="url(#beamGradient)" 
                stroke="#DC2626" 
                strokeWidth="2"
              />

              {/* Safe zone (green tint) */}
              <path 
                d="M 350 45 L 550 20 L 550 180 L 350 155 Z" 
                fill="rgba(34, 197, 94, 0.1)" 
                stroke="#22C55E" 
                strokeWidth="2" 
                strokeDasharray="5,5"
              />

              {/* NOHD marker */}
              <line x1="350" y1="30" x2="350" y2="170" stroke="#16A34A" strokeWidth="3" strokeDasharray="8,4" />
              <text x="350" y="20" textAnchor="middle" className="text-sm fill-green-600 font-bold">NOHD</text>
              <text x="350" y="185" textAnchor="middle" className="text-xs fill-green-600">Safe beyond this point</text>

              {/* Labels */}
              <text x="200" y="75" textAnchor="middle" className="text-sm fill-red-600 font-medium">Hazard Zone</text>
              <text x="450" y="100" textAnchor="middle" className="text-sm fill-green-600 font-medium">Safe Zone</text>

              {/* Divergence angle arc */}
              <path d="M 60 100 Q 100 70 140 65" fill="none" stroke="#6B7280" strokeWidth="1" strokeDasharray="3,2" />
              <text x="110" y="55" textAnchor="middle" className="text-xs fill-gray-500">Divergence (φ)</text>
            </svg>
          </div>

          <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
            <div className="p-3 bg-red-50 dark:bg-red-950/30 rounded-lg border border-red-200 dark:border-red-800">
              <div className="font-medium text-destructive">Inside NOHD</div>
              <div className="text-destructive/80">Eye hazard exists. Protective eyewear or controls required.</div>
            </div>
            <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800">
              <div className="font-medium text-amber-600">At NOHD</div>
              <div className="text-amber-500">MPE level reached. Threshold of safe exposure.</div>
            </div>
            <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-800">
              <div className="font-medium text-green-600">Beyond NOHD</div>
              <div className="text-green-500">Safe for unaided eye. Beam has diverged sufficiently.</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Calculator */}
      <Card id="nohd-calculator">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5" aria-hidden="true" />
            Interactive NOHD Calculator
          </CardTitle>
          <CardDescription>Adjust parameters to see how they affect NOHD</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Wavelength */}
          <div>
            <div className="flex justify-between mb-2">
              <Label htmlFor="wavelength-slider">Wavelength: {wavelength} nm</Label>
              <Badge variant="outline">
                {wavelength >= 400 && wavelength <= 700 ? "Visible" : 
                 wavelength > 700 && wavelength <= 1400 ? "Near-IR" : 
                 wavelength > 1400 ? "Mid/Far-IR" : "UV"}
              </Badge>
            </div>
            <Slider
              id="wavelength-slider"
              value={[wavelength]}
              onValueChange={(v) => setWavelength(v[0])}
              min={400}
              max={10000}
              step={10}
              className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Wavelength selector"
              aria-valuemin={400}
              aria-valuemax={10000}
              aria-valuenow={wavelength}
              aria-valuetext={`${wavelength} nanometers`}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>400 nm</span>
              <span>10,000 nm</span>
            </div>
          </div>

          {/* Power */}
          <div>
            <Label htmlFor="power-slider" className="mb-2 block">Output Power: {power} W</Label>
            <Slider
              id="power-slider"
              value={[power]}
              onValueChange={(v) => setPower(v[0])}
              min={0.001}
              max={100}
              step={0.001}
              className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Power selector"
              aria-valuemin={0.001}
              aria-valuemax={100}
              aria-valuenow={power}
              aria-valuetext={`${power} watts`}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>1 mW</span>
              <span>100 W</span>
            </div>
          </div>

          {/* Divergence */}
          <div>
            <Label htmlFor="divergence-slider" className="mb-2 block">Beam Divergence: {divergence} mrad</Label>
            <Slider
              id="divergence-slider"
              value={[divergence]}
              onValueChange={(v) => setDivergence(v[0])}
              min={0.1}
              max={10}
              step={0.1}
              className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Beam divergence selector"
              aria-valuemin={0.1}
              aria-valuemax={10}
              aria-valuenow={divergence}
              aria-valuetext={`${divergence} milliradians`}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>0.1 mrad (tight)</span>
              <span>10 mrad (wide)</span>
            </div>
          </div>

          {/* Results */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-primary/10 rounded-lg text-center">
              <div className="text-sm text-primary mb-1">MPE Value</div>
              <div className="text-xl font-bold text-primary" aria-live="polite">{mpe.toFixed(4)} W/cm²</div>
            </div>
            <div className="p-4 bg-destructive/10 rounded-lg text-center">
              <div className="text-sm text-destructive mb-1">NOHD</div>
              <div className="text-3xl font-bold text-destructive" aria-live="polite">
                {nohd >= 1000 ? `${(nohd / 1000).toFixed(2)} km` : `${nohd.toFixed(1)} m`}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Section 2: The NOHD Formula
const FormulaSection: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [power, setPower] = useState(1);
  const [divergence, setDivergence] = useState(1);
  const [mpe, setMpe] = useState(0.00254);

  const divergenceRad = divergence * 0.001;
  const nohd = Math.sqrt((4 * power) / (Math.PI * mpe)) / divergenceRad;

  const steps = [
    {
      title: "The Formula",
      content: "NOHD = √(4 * Φ / (π * MPE)) / φ",
      description: "Where:\n• Φ = Beam power (watts)\n• MPE = Maximum Permissible Exposure (W/cm²)\n• φ = Beam divergence (radians)",
    },
    {
      title: "Step 1: Calculate Numerator",
      content: `4 * ${power} W = ${(4 * power).toFixed(3)} W`,
      description: "Multiply beam power by 4 to account for the circular beam cross-section",
    },
    {
      title: "Step 2: Calculate Denominator",
      content: `π * ${mpe.toFixed(5)} * (${divergence}*10⁻³)²`,
      description: `= ${Math.PI.toFixed(4)} * ${mpe.toFixed(5)} * ${(divergenceRad * divergenceRad).toExponential(3)}\n= ${(Math.PI * mpe * divergenceRad * divergenceRad).toExponential(3)} W`,
    },
    {
      title: "Step 3: Divide",
      content: `${(4 * power).toFixed(3)} / ${(Math.PI * mpe * divergenceRad * divergenceRad).toExponential(3)}`,
      description: `= ${((4 * power) / (Math.PI * mpe * divergenceRad * divergenceRad)).toExponential(3)}`,
    },
    {
      title: "Step 4: Square Root",
      content: `√${((4 * power) / (Math.PI * mpe * divergenceRad * divergenceRad)).toExponential(3)}`,
      description: `= ${nohd.toFixed(2)} meters`,
    },
  ];

  return (
    <div className="space-y-6" role="region" aria-label="NOHD formula section">
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold">The NOHD Formula</h3>
        <p className="text-muted-foreground">
          The NOHD calculation is based on the inverse square law and beam divergence. 
          As the beam travels, it spreads out, reducing its irradiance until it falls below the MPE.
        </p>
      </div>

      {/* Formula Builder */}
      <Card>
        <CardHeader>
          <CardTitle>Interactive Formula Builder</CardTitle>
          <CardDescription>Build the calculation step by step</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Variable Controls */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div>
              <Label htmlFor="power-input" className="text-sm">Power (Φ)</Label>
              <Input
                id="power-input"
                type="number"
                value={power}
                onChange={(e) => setPower(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="mt-1"
                aria-label="Beam power in watts"
              />
              <span className="text-xs text-muted-foreground">Watts</span>
            </div>
            <div>
              <Label htmlFor="divergence-input" className="text-sm">Divergence (φ)</Label>
              <Input
                id="divergence-input"
                type="number"
                value={divergence}
                onChange={(e) => setDivergence(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="mt-1"
                aria-label="Beam divergence in milliradians"
              />
              <span className="text-xs text-muted-foreground">milliradians</span>
            </div>
            <div>
              <Label htmlFor="mpe-input" className="text-sm">MPE</Label>
              <Input
                id="mpe-input"
                type="number"
                value={mpe}
                onChange={(e) => setMpe(parseFloat(e.target.value) || 0)}
                step="0.00001"
                className="mt-1"
                aria-label="Maximum Permissible Exposure in watts per square centimeter"
              />
              <span className="text-xs text-muted-foreground">W/cm²</span>
            </div>
          </div>

          {/* Step Navigator */}
          <div className="flex gap-2 mb-4 flex-wrap" role="tablist" aria-label="Formula steps">
            {steps.map((step, idx) => (
              <button
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
                  activeStep === idx
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-muted-foreground/20"
                )}
                role="tab"
                aria-selected={activeStep === idx}
                aria-label={`Step ${idx + 1}: ${step.title}`}
                aria-controls={`step-panel-${idx}`}
              >
                Step {idx + 1}
              </button>
            ))}
          </div>

          {/* Current Step Display */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeStep}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              id={`step-panel-${activeStep}`}
              role="tabpanel"
              aria-labelledby={`step-tab-${activeStep}`}
              className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-200"
            >
              <h4 className="text-lg font-semibold text-primary mb-3">{steps[activeStep].title}</h4>
              <div className="text-2xl font-mono text-foreground mb-4 bg-background/50 p-4 rounded-lg">
                {steps[activeStep].content}
              </div>
              <div className="text-muted-foreground whitespace-pre-line">{steps[activeStep].description}</div>
            </motion.div>
          </AnimatePresence>

          {/* Final Result */}
          <div className="mt-6 p-4 bg-destructive/10 rounded-lg border-2 border-destructive/30 text-center">
            <div className="text-sm text-destructive mb-1">Final NOHD</div>
            <div className="text-4xl font-bold text-destructive" aria-live="polite">
              {nohd >= 1000 ? `${(nohd / 1000).toFixed(2)} km` : `${nohd.toFixed(2)} m`}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Variable Explanations */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Sun className="w-4 h-4 text-yellow-500" aria-hidden="true" />
              Φ (Phi) - Power
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The total optical power output of the laser in watts. Higher power means longer NOHD. 
            For pulsed lasers, use average power for CW calculations.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Maximize2 className="w-4 h-4 text-blue-500" aria-hidden="true" />
              φ (phi) - Divergence
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            The angular spread of the laser beam in milliradians. Lower divergence (tighter beam) 
            means longer NOHD. Typical values: 0.5-5 mrad.
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Shield className="w-4 h-4 text-green-500" aria-hidden="true" />
              MPE - Safety Limit
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Maximum Permissible Exposure depends on wavelength and exposure time. 
            Visible lasers (400-700 nm) typically use 2.54 mW/cm² for 0.25 s exposure.
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Section 3: MPE Tables
const MPETablesSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState("visible-cw");
  const [searchWavelength, setSearchWavelength] = useState(532);
  const [searchDuration, setSearchDuration] = useState(0.25);

  const categories = [
    { id: "visible-cw", label: "Visible (CW)", icon: <Eye className="w-4 h-4" aria-hidden="true" /> },
    { id: "near-ir-cw", label: "Near-IR (CW)", icon: <Target className="w-4 h-4" aria-hidden="true" /> },
    { id: "mid-far-ir", label: "Mid/Far-IR", icon: <Sun className="w-4 h-4" aria-hidden="true" /> },
    { id: "uv", label: "Ultraviolet", icon: <AlertTriangle className="w-4 h-4" aria-hidden="true" /> },
  ];

  const lookupMPE = useCallback(() => {
    const mpe = calculateMPE(searchWavelength, searchDuration);
    return { value: mpe, unit: "W/cm²" };
  }, [searchWavelength, searchDuration]);

  const lookupResult = lookupMPE();

  return (
    <div className="space-y-6" role="region" aria-label="MPE tables section">
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold">Maximum Permissible Exposure (MPE) Tables</h3>
        <p className="text-muted-foreground">
          MPE values represent the level of laser radiation to which a person may be exposed 
          without hazardous effects. Values depend on wavelength, exposure duration, and whether 
          the exposure is to the eye or skin.
        </p>
      </div>

      {/* MPE Lookup Tool */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="w-5 h-5 text-primary" aria-hidden="true" />
            MPE Lookup Calculator
          </CardTitle>
          <CardDescription>Find the MPE for your specific parameters</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mpe-wavelength">Wavelength: {searchWavelength} nm</Label>
              <Slider
                id="mpe-wavelength"
                value={[searchWavelength]}
                onValueChange={(v) => setSearchWavelength(v[0])}
                min={180}
                max={10000}
                step={1}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Wavelength selector"
                aria-valuemin={180}
                aria-valuemax={10000}
                aria-valuenow={searchWavelength}
                aria-valuetext={`${searchWavelength} nanometers`}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>UV (180 nm)</span>
                <span>Far-IR (10,000 nm)</span>
              </div>
            </div>
            <div>
              <Label htmlFor="mpe-duration">Exposure Duration: {searchDuration} s</Label>
              <Slider
                id="mpe-duration"
                value={[searchDuration * 100]}
                onValueChange={(v) => setSearchDuration(v[0] / 100)}
                min={1}
                max={10000}
                step={1}
                className="w-full [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
                aria-label="Exposure duration selector"
                aria-valuemin={0.01}
                aria-valuemax={100}
                aria-valuenow={searchDuration}
                aria-valuetext={`${searchDuration} seconds`}
              />
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>0.01 s</span>
                <span>100 s</span>
              </div>
            </div>
          </div>

          <div className="p-4 bg-card rounded-lg text-center border" aria-live="polite">
            <div className="text-sm text-muted-foreground mb-1">Calculated MPE</div>
            <div className="text-3xl font-bold text-primary">
              {lookupResult.value.toExponential(3)} {lookupResult.unit}
            </div>
            <div className="text-xs text-muted-foreground mt-2">
              {searchWavelength >= 400 && searchWavelength <= 700 && "Visible range - retinal hazard"}
              {searchWavelength > 700 && searchWavelength <= 1400 && "Near-IR range - retinal hazard"}
              {searchWavelength > 1400 && "Mid/Far-IR - corneal hazard only"}
              {searchWavelength < 400 && "UV range - photochemical hazard"}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="MPE category selector">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary",
              selectedCategory === cat.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted-foreground/20"
            )}
            role="tab"
            aria-selected={selectedCategory === cat.id}
            aria-label={cat.label}
          >
            {cat.icon}
            {cat.label}
          </button>
        ))}
      </div>

      {/* MPE Table */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full" role="table" aria-label={`MPE table for ${categories.find(c => c.id === selectedCategory)?.label}`}>
              <thead className="bg-muted/50">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground" scope="col">Wavelength Range</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground" scope="col">Exposure Duration</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground" scope="col">MPE Value</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground" scope="col">Unit</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-foreground" scope="col">Notes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {MPE_TABLES[selectedCategory]?.map((entry, idx) => (
                  <tr key={idx} className="hover:bg-muted/50">
                    <td className="px-4 py-3 text-sm font-medium text-foreground">{entry.wavelength}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{entry.exposureDuration}</td>
                    <td className="px-4 py-3 text-sm text-primary font-mono">{entry.mpeValue}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{entry.unit}</td>
                    <td className="px-4 py-3 text-sm text-muted-foreground">{entry.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      <div className="p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200">
        <strong>Note:</strong> These are simplified values for educational purposes. 
        Always consult the latest ANSI Z136.1 standard for official MPE values in safety calculations.
      </div>
    </div>
  );
};

// Section 4: Practical Examples
const PracticalExamplesSection: React.FC = () => {
  const [selectedExample, setSelectedExample] = useState<ExampleProblem>(EXAMPLE_PROBLEMS[0]);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [showHints, setShowHints] = useState(false);

  const checkAnswer = () => {
    const userNum = parseFloat(userAnswer);
    const tolerance = selectedExample.correctNOHD * 0.1;
    const isCorrect = Math.abs(userNum - selectedExample.correctNOHD) <= tolerance;
    setShowResult(true);
    return isCorrect;
  };

  const resetExample = () => {
    setCurrentStep(0);
    setUserAnswer("");
    setShowResult(false);
    setShowHints(false);
  };

  return (
    <div className="space-y-6" role="region" aria-label="Practical calculation examples">
      <div className="prose max-w-none">
        <h3 className="text-xl font-semibold">Practical Examples</h3>
        <p className="text-muted-foreground">
          Work through real-world scenarios to practice NOHD calculations. 
          Each example includes step-by-step solutions and practice problems.
        </p>
      </div>

      {/* Example Selector */}
      <div className="flex gap-2 flex-wrap" role="tablist" aria-label="Select example problem">
        {EXAMPLE_PROBLEMS.map((example) => (
          <button
            key={example.id}
            onClick={() => {
              setSelectedExample(example);
              resetExample();
            }}
            className={cn(
              "px-4 py-2 rounded-lg font-medium transition-colors text-left focus:outline-none focus:ring-2 focus:ring-primary",
              selectedExample.id === example.id
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground hover:bg-muted-foreground/20"
            )}
            role="tab"
            aria-selected={selectedExample.id === example.id}
            aria-label={`${example.title}, ${example.laserClass}`}
          >
            <div className="text-sm">{example.title}</div>
            <div className="text-xs opacity-80">{example.laserClass}</div>
          </button>
        ))}
      </div>

      {/* Problem Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <FlaskConical className="w-5 h-5" aria-hidden="true" />
                {selectedExample.title}
              </CardTitle>
              <CardDescription className="mt-2">{selectedExample.description}</CardDescription>
            </div>
            <Badge variant="outline" className="text-base px-3 py-1">
              {selectedExample.laserClass}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Given Parameters */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-3 bg-primary/10 rounded-lg text-center">
              <div className="text-xs text-primary">Wavelength</div>
              <div className="font-bold text-primary">{selectedExample.wavelength} nm</div>
            </div>
            <div className="p-3 bg-green-500/10 rounded-lg text-center">
              <div className="text-xs text-green-600">Power</div>
              <div className="font-bold text-green-600">{selectedExample.power} W</div>
            </div>
            <div className="p-3 bg-purple-500/10 rounded-lg text-center">
              <div className="text-xs text-purple-600">Divergence</div>
              <div className="font-bold text-purple-600">{selectedExample.divergence} mrad</div>
            </div>
            <div className="p-3 bg-orange-500/10 rounded-lg text-center">
              <div className="text-xs text-orange-600">Exposure</div>
              <div className="font-bold text-orange-600">{selectedExample.exposureDuration} s</div>
            </div>
          </div>

          {/* Step-by-Step Solution */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-semibold">Step-by-Step Solution</h4>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
                  disabled={currentStep === 0}
                  aria-label="Previous step"
                >
                  Previous
                </Button>
                <Button
                  size="sm"
                  onClick={() => setCurrentStep(Math.min(selectedExample.steps.length - 1, currentStep + 1))}
                  disabled={currentStep === selectedExample.steps.length - 1}
                  aria-label="Next step"
                >
                  Next
                </Button>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200"
              >
                <div className="flex items-center gap-2 mb-2">
                  <Badge>Step {currentStep + 1} of {selectedExample.steps.length}</Badge>
                </div>
                <p className="text-foreground">{selectedExample.steps[currentStep]}</p>
              </motion.div>
            </AnimatePresence>

            {/* Step Progress */}
            <div className="flex gap-1 mt-3" role="progressbar" aria-valuenow={currentStep + 1} aria-valuemin={1} aria-valuemax={selectedExample.steps.length}>
              {selectedExample.steps.map((_, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "h-2 flex-1 rounded-full transition-colors",
                    idx <= currentStep ? "bg-primary" : "bg-muted-foreground/30"
                  )}
                  aria-hidden="true"
                />
              ))}
            </div>
          </div>

          {/* Practice Problem */}
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3">Test Your Knowledge</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Calculate the NOHD for this {selectedExample.laserClass} laser. 
              Enter your answer in meters (±10% tolerance allowed).
            </p>
            <div className="flex gap-3 items-end">
              <div className="flex-1">
                <Label htmlFor="nohd-answer">Your Answer (meters)</Label>
                <Input
                  id="nohd-answer"
                  type="number"
                  value={userAnswer}
                  onChange={(e) => {
                    setUserAnswer(e.target.value);
                    setShowResult(false);
                  }}
                  placeholder="Enter NOHD value"
                  className="mt-1"
                  aria-label="Enter your calculated NOHD value in meters"
                />
              </div>
              <Button onClick={checkAnswer} className="mb-0.5" aria-label="Check your answer">
                Check Answer
              </Button>
              <Button variant="outline" onClick={() => setShowHints(!showHints)} className="mb-0.5" aria-label={showHints ? "Hide hints" : "Show hints"}>
                {showHints ? "Hide Hints" : "Show Hints"}
              </Button>
            </div>

            {showResult && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  "mt-3 p-3 rounded-lg",
                  Math.abs(parseFloat(userAnswer) - selectedExample.correctNOHD) <= selectedExample.correctNOHD * 0.1
                    ? "bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800 text-green-900 dark:text-green-200"
                    : "bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800 text-red-900 dark:text-red-200"
                )}
                role="alert"
                aria-live="polite"
              >
                <div className="flex items-center gap-2">
                  {Math.abs(parseFloat(userAnswer) - selectedExample.correctNOHD) <= selectedExample.correctNOHD * 0.1 ? (
                    <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <AlertTriangle className="w-5 h-5" aria-hidden="true" />
                  )}
                  <span>
                    {Math.abs(parseFloat(userAnswer) - selectedExample.correctNOHD) <= selectedExample.correctNOHD * 0.1
                      ? "Correct! Well done."
                      : `Incorrect. The correct answer is ${selectedExample.correctNOHD} meters.`}
                  </span>
                </div>
              </motion.div>
            )}

            {showHints && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800"
              >
                <h5 className="font-medium text-amber-900 dark:text-amber-200 mb-2">Hints:</h5>
                <ul className="list-disc list-inside text-sm text-amber-800 dark:text-amber-300 space-y-1">
                  {selectedExample.hints.map((hint, idx) => (
                    <li key={idx}>{hint}</li>
                  ))}
                </ul>
              </motion.div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// ============================================================================
// Main Component
// ============================================================================

const SECTIONS = [
  { id: "understanding", label: "Understanding NOHD", icon: <Eye className="w-4 h-4" /> },
  { id: "formula", label: "The NOHD Formula", icon: <Calculator className="w-4 h-4" /> },
  { id: "mpe", label: "MPE Tables", icon: <BookOpen className="w-4 h-4" /> },
  { id: "examples", label: "Practical Examples", icon: <Lightbulb className="w-4 h-4" /> },
];

export default function Module4Calculations() {
  const [activeSection, setActiveSection] = useState("understanding");
  const mainContentRef = useRef<HTMLDivElement>(null);

  const renderSection = () => {
    switch (activeSection) {
      case "understanding":
        return <UnderstandingNOHDSection />;
      case "formula":
        return <FormulaSection />;
      case "mpe":
        return <MPETablesSection />;
      case "examples":
        return <PracticalExamplesSection />;
      default:
        return <UnderstandingNOHDSection />;
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const currentIndex = SECTIONS.findIndex(s => s.id === activeSection);
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        setActiveSection(SECTIONS[currentIndex - 1].id);
      } else if (e.key === 'ArrowRight' && currentIndex < SECTIONS.length - 1) {
        setActiveSection(SECTIONS[currentIndex + 1].id);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeSection]);

  return (
    <div className="max-w-5xl mx-auto space-y-6 p-4">
      {/* Skip link */}
      <a 
        href="#main-content" 
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-primary focus:text-primary-foreground focus:rounded"
      >
        Skip to main content
      </a>

      {/* Header */}
      <header className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-foreground">Module 4: Beam Hazard Calculations</h1>
        <p className="text-muted-foreground">
          Comprehensive calculation module for laser safety. Learn to calculate NOHD, 
          MPE values, and understand hazard zones.
        </p>
      </header>

      {/* Navigation */}
      <nav className="bg-muted p-1.5 rounded-xl" aria-label="Module sections">
        <div className="flex flex-wrap gap-1">
          {SECTIONS.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all focus:outline-none focus:ring-2 focus:ring-primary",
                activeSection === section.id
                  ? "bg-card text-primary shadow-sm border"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
              aria-current={activeSection === section.id ? 'page' : undefined}
              aria-label={section.label}
            >
              {section.icon}
              <span className="hidden sm:inline">{section.label}</span>
            </button>
          ))}
        </div>
      </nav>

      {/* Section Title */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          {SECTIONS.find((s) => s.id === activeSection)?.icon}
        </div>
        <h2 className="text-xl font-semibold">
          {SECTIONS.find((s) => s.id === activeSection)?.label}
        </h2>
      </div>

      {/* Content */}
      <main id="main-content" ref={mainContentRef} tabIndex={-1}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderSection()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Keyboard shortcuts help */}
      <div className="text-xs text-muted-foreground text-center">
        Keyboard shortcuts: Arrow keys navigate sections
      </div>
    </div>
  );
}
