"use client";

import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Eye,
  Shield,
  Calculator,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Info,
  Search,
  Ruler,
  ClipboardCheck,
  RefreshCw,
  ChevronRight,
  ChevronLeft,
  Award,
  Beaker,
  Filter,
  Glasses,
  FileCheck,
  Wrench,
  Crosshair
} from "lucide-react";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface LaserParams {
  wavelength: number;
  power: number;
  beamDiameter: number;
}

interface InspectionItem {
  id: string;
  label: string;
  description: string;
}

// ============================================================================
// SECTION 1: OD CALCULATOR - TECHNICAL SPECIFICATION STYLE
// ============================================================================

function ODCalculatorEnhanced() {
  const [beamIrradiance, setBeamIrradiance] = useState(10);
  const [mpe, setMpe] = useState(0.00254);
  const [selectedWavelength, setSelectedWavelength] = useState(532);

  const od = useMemo(() => Math.log10(beamIrradiance / mpe), [beamIrradiance, mpe]);

  const getProtectionLevel = (odValue: number) => {
    if (odValue < 1) return { level: "Inadequate", color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" };
    if (odValue < 3) return { level: "Minimal", color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200" };
    if (odValue < 5) return { level: "Standard", color: "text-emerald-600", bgColor: "bg-emerald-50", borderColor: "border-emerald-200" };
    if (odValue < 7) return { level: "High", color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" };
    return { level: "Maximum", color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" };
  };

  const protection = getProtectionLevel(od);

  const commonWavelengths = [
    { nm: 355, type: "UV", mpe: 0.0039, color: "#8B5CF6" },
    { nm: 405, type: "Violet", mpe: 0.00254, color: "#6D28D9" },
    { nm: 445, type: "Blue", mpe: 0.00254, color: "#3B82F6" },
    { nm: 532, type: "Green", mpe: 0.00254, color: "#059669" },
    { nm: 635, type: "Red", mpe: 0.00254, color: "#DC2626" },
    { nm: 808, type: "IR", mpe: 0.0018, color: "#7F1D1D" },
    { nm: 1064, type: "IR", mpe: 0.005, color: "#450A0A" },
    { nm: 1550, type: "IR", mpe: 0.01, color: "#57534E" },
  ];

  return (
    <div className="space-y-6">
      {/* Optical Density Definition - Technical Card */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-base">
            <Beaker className="w-5 h-5 text-blue-600" />
            Optical Density (OD) Specification
          </CardTitle>
          <CardDescription>
            Logarithmic measure of light attenuation through protective filters
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-4">
          <div className="bg-muted p-4 rounded-lg">
            <div className="flex items-center justify-center py-4">
              <div className="text-2xl font-mono bg-card px-6 py-3 rounded-lg border shadow-sm">
                <span className="text-muted-foreground">OD = log</span>
                <sub className="text-slate-400">10</sub>
                <span className="text-muted-foreground">(</span>
                <span className="text-blue-600 font-bold">H₀</span>
                <span className="text-muted-foreground"> / </span>
                <span className="text-emerald-600 font-bold">MPE</span>
                <span className="text-muted-foreground">)</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-sm text-center">
              <div>
                <div className="font-mono text-blue-600 font-bold">H₀</div>
                <div className="text-muted-foreground text-xs">Incident Irradiance</div>
                <div className="text-slate-400 text-[10px]">W/cm²</div>
              </div>
              <div>
                <div className="font-mono text-emerald-600 font-bold">MPE</div>
                <div className="text-muted-foreground text-xs">Max Permissible Exposure</div>
                <div className="text-slate-400 text-[10px]">W/cm² or J/cm²</div>
              </div>
              <div>
                <div className="font-mono text-purple-600 font-bold">OD</div>
                <div className="text-muted-foreground text-xs">Optical Density</div>
                <div className="text-slate-400 text-[10px]">Dimensionless</div>
              </div>
            </div>
          </div>

          {/* Transmission Table - Technical Spec */}
          <div className="overflow-hidden rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="border-b border-slate-200 dark:border-slate-700">
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">OD Rating</th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">Transmission</th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">Attenuation</th>
                  <th className="px-4 py-2 text-left text-xs uppercase tracking-wider">Level</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {[
                  { od: 1, trans: "10%", factor: "10×", level: "Minimal", color: "text-amber-600" },
                  { od: 2, trans: "1%", factor: "100×", level: "Basic", color: "text-yellow-600" },
                  { od: 3, trans: "0.1%", factor: "1,000×", level: "Standard", color: "text-emerald-600" },
                  { od: 4, trans: "0.01%", factor: "10⁴×", level: "High", color: "text-blue-600" },
                  { od: 5, trans: "10⁻⁵", factor: "10⁵×", level: "Very High", color: "text-indigo-600" },
                  { od: 6, trans: "10⁻⁶", factor: "10⁶×", level: "Maximum", color: "text-purple-600" },
                ].map((row) => (
                  <tr key={row.od} className={row.od === Math.round(od) ? "bg-blue-50/50 dark:bg-blue-950/20" : ""}>
                    <td className="px-4 py-2 font-mono font-bold">OD {row.od}</td>
                    <td className="px-4 py-2 font-mono text-xs">{row.trans}</td>
                    <td className="px-4 py-2 font-mono text-xs">{row.factor}</td>
                    <td className="px-4 py-2">
                      <span className={`text-xs font-medium ${row.color}`}>{row.level}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Interactive Calculator - Technical Panel */}
      <Card className="border-slate-200 dark:border-slate-700">
        <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="flex items-center gap-2 text-base">
            <Calculator className="w-5 h-5 text-blue-600" />
            OD Calculator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 pt-4">
          {/* Wavelength Quick Select */}
          <div>
            <Label className="text-xs uppercase tracking-wider text-muted-foreground mb-2 block">Quick Select Wavelength</Label>
            <div className="flex flex-wrap gap-2">
              {commonWavelengths.map((wl) => (
                <Button
                  key={wl.nm}
                  variant={selectedWavelength === wl.nm ? "default" : "outline"}
                  size="sm"
                  onClick={() => {
                    setSelectedWavelength(wl.nm);
                    setMpe(wl.mpe);
                  }}
                  className="text-xs"
                  style={{ 
                    backgroundColor: selectedWavelength === wl.nm ? wl.color : undefined,
                    borderColor: wl.color
                  }}
                >
                  <span className="w-2 h-2 rounded-full mr-1.5" style={{ backgroundColor: selectedWavelength === wl.nm ? 'white' : wl.color }} />
                  {wl.nm} nm
                </Button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>Beam Irradiance (H₀)</span>
                <span className="font-mono text-blue-600">{beamIrradiance.toFixed(3)} W/cm²</span>
              </Label>
              <Input
                type="number"
                value={beamIrradiance}
                onChange={(e) => setBeamIrradiance(parseFloat(e.target.value) || 0)}
                step="0.1"
                className="font-mono"
              />
              <Slider
                value={[beamIrradiance]}
                onValueChange={(v) => setBeamIrradiance(v[0])}
                min={0.001}
                max={100}
                step={0.001}
                className="mt-2"
              />
            </div>
            <div className="space-y-2">
              <Label className="flex justify-between">
                <span>MPE (λ = {selectedWavelength} nm)</span>
                <span className="font-mono text-emerald-600">{mpe.toExponential(2)} W/cm²</span>
              </Label>
              <Input
                type="number"
                value={mpe}
                onChange={(e) => setMpe(parseFloat(e.target.value) || 0)}
                step="0.0001"
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">ANSI Z136.1 standard MPE value</p>
            </div>
          </div>

          {/* Result Display - Technical Readout */}
          <div className={`p-6 rounded-lg border-2 ${protection.bgColor} ${protection.borderColor}`}>
            <div className="text-center">
              <div className="text-6xl font-mono font-bold text-slate-900 dark:text-slate-100 mb-2">
                OD {od.toFixed(2)}
              </div>
              <div className="text-sm text-muted-foreground mb-4">Required Optical Density</div>
              <div className="flex justify-center gap-3">
                <Badge variant="outline" className={`${protection.color} text-sm px-3 py-1`}>
                  {protection.level} Protection
                </Badge>
                <Badge variant="outline" className="font-mono text-xs">
                  T = {Math.pow(10, -od).toExponential(2)}
                </Badge>
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground bg-amber-50 dark:bg-amber-950/30 p-3 rounded-lg border border-amber-200">
            <AlertTriangle className="w-4 h-4 text-amber-500 inline mr-1" />
            <strong>Engineering Note:</strong> Always round UP to next available OD rating. 
            If calculation yields OD 3.2, select eyewear rated OD 4 or higher.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 2: WAVELENGTH COVERAGE - TECHNICAL SPEC
// ============================================================================

function WavelengthCoverageChecker() {
  const [wavelengths, setWavelengths] = useState<number[]>([532, 1064]);
  const [newWavelength, setNewWavelength] = useState(532);

  const wavelengthData: Record<number, { type: string; color: string; eyeRisk: string }> = {
    355: { type: "UV-A", color: "#8B5CF6", eyeRisk: "Photochemical cataract, corneal damage" },
    405: { type: "Violet", color: "#6D28D9", eyeRisk: "Photochemical retinal damage" },
    445: { type: "Blue", color: "#3B82F6", eyeRisk: "Photochemical retinal damage" },
    532: { type: "Green", color: "#059669", eyeRisk: "Retinal burns, flash blindness" },
    635: { type: "Red", color: "#DC2626", eyeRisk: "Retinal burns" },
    808: { type: "IR-A", color: "#7F1D1D", eyeRisk: "Retinal burns (invisible)" },
    980: { type: "IR-A", color: "#7F1D1D", eyeRisk: "Retinal burns, cataracts" },
    1064: { type: "IR-A", color: "#450A0A", eyeRisk: "Retinal burns, vitreous hemorrhage" },
    1550: { type: "IR-B", color: "#57534E", eyeRisk: "Corneal burns, lens damage" },
    10600: { type: "IR-C", color: "#78716C", eyeRisk: "Corneal burns only" },
  };

  const addWavelength = () => {
    if (!wavelengths.includes(newWavelength)) {
      setWavelengths([...wavelengths, newWavelength].sort((a, b) => a - b));
    }
  };

  const removeWavelength = (wl: number) => {
    setWavelengths(wavelengths.filter((w) => w !== wl));
  };

  const getCoverageRecommendations = () => {
    const hasUV = wavelengths.some((w) => w < 400);
    const hasVisible = wavelengths.some((w) => w >= 400 && w <= 700);
    const hasNearIR = wavelengths.some((w) => w > 700 && w <= 1400);
    const hasFarIR = wavelengths.some((w) => w > 1400);

    const ranges: string[] = [];
    if (hasUV) ranges.push("UV (180-400 nm)");
    if (hasVisible) ranges.push("Visible (400-700 nm)");
    if (hasNearIR) ranges.push("Near-IR (700-1400 nm)");
    if (hasFarIR) ranges.push("Far-IR (>1400 nm)");

    return { ranges, hasUV, hasVisible, hasNearIR, hasFarIR };
  };

  const coverage = getCoverageRecommendations();

  return (
    <div className="space-y-6">
      {/* Filter Specifications */}
      <Card>
        <CardHeader className="bg-muted border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <Filter className="w-5 h-5 text-blue-600" />
            Filter Type Specifications
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-muted p-4 rounded-lg border">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Glasses className="w-4 h-4 text-blue-600" />
                Broadband Filters
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Wide wavelength coverage</li>
                <li>• Multi-laser line compatible</li>
                <li>• Often lower VLT</li>
                <li>• Example: 190-540 nm & 800-1700 nm</li>
              </ul>
            </div>
            <div className="bg-muted p-4 rounded-lg border">
              <h4 className="font-semibold text-sm mb-2 flex items-center gap-2">
                <Crosshair className="w-4 h-4 text-purple-600" />
                Narrowband Filters
              </h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Specific wavelength optimized</li>
                <li>• Higher VLT for visibility</li>
                <li>• Higher OD at target λ</li>
                <li>• Example: 532 nm ±10 nm</li>
              </ul>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-red-700 text-sm">Critical Safety Warning</h4>
                <p className="text-sm text-muted-foreground mt-1">
                  When working with multiple wavelengths, ensure eyewear covers ALL wavelengths present. 
                  Using incorrect eyewear can be more dangerous than no eyewear due to pupil dilation.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Multi-Wavelength Coverage Tool */}
      <Card>
        <CardHeader className="bg-muted border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <Search className="w-5 h-5 text-blue-600" />
            Multi-Wavelength Coverage Analyzer
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-6">
          {/* Add Wavelength */}
          <div className="flex gap-2">
            <div className="flex-1">
              <Label className="text-xs uppercase text-muted-foreground">Wavelength (nm)</Label>
              <Input
                type="number"
                value={newWavelength}
                onChange={(e) => setNewWavelength(parseInt(e.target.value) || 0)}
                className="font-mono"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addWavelength}>
                <ChevronRight className="w-4 h-4 mr-1" />
                Add
              </Button>
            </div>
          </div>

          {/* Selected Wavelengths */}
          <div>
            <Label className="text-xs uppercase text-muted-foreground mb-2 block">Active Laser Lines</Label>
            <div className="flex flex-wrap gap-2">
              {wavelengths.map((wl) => (
                <Badge
                  key={wl}
                  variant="secondary"
                  className="flex items-center gap-2 px-3 py-1.5 text-sm"
                >
                  <span className={`w-2.5 h-2.5 rounded-full`} style={{ backgroundColor: wavelengthData[wl]?.color || "#94A3B8" }} />
                  <span className="font-mono">{wl} nm</span>
                  <button onClick={() => removeWavelength(wl)} className="ml-1 hover:text-red-500">
                    <XCircle className="w-4 h-4" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          {/* Coverage Analysis */}
          <div className="bg-muted p-4 rounded-lg border">
            <h4 className="font-semibold text-sm mb-3">Required Coverage Ranges</h4>
            <div className="space-y-2">
              {coverage.ranges.map((range) => (
                <div key={range} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-emerald-500" />
                  <span className="font-mono">{range}</span>
                </div>
              ))}
            </div>

            {wavelengths.length > 1 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/30 rounded border border-blue-200">
                <p className="text-sm text-blue-800 dark:text-blue-400">
                  <strong>Recommendation:</strong> {coverage.hasVisible && coverage.hasNearIR 
                    ? "Dual-band filter or multiple eyewear pairs required" 
                    : "Broadband protection eyewear suitable"}
                </p>
              </div>
            )}
          </div>

          {/* Technical Specs Table */}
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left text-xs uppercase">λ (nm)</th>
                  <th className="px-4 py-2 text-left text-xs uppercase">Region</th>
                  <th className="px-4 py-2 text-left text-xs uppercase">Primary Risk</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {wavelengths.map((wl) => {
                  const data = wavelengthData[wl] || { type: "Unknown", color: "#94A3B8", eyeRisk: "Consult LSO" };
                  return (
                    <tr key={wl}>
                      <td className="px-4 py-2 flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full" style={{ backgroundColor: data.color }} />
                        <span className="font-mono font-bold">{wl}</span>
                      </td>
                      <td className="px-4 py-2"><Badge variant="outline" className="text-xs">{data.type}</Badge></td>
                      <td className="px-4 py-2 text-muted-foreground text-xs">{data.eyeRisk}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 3: SELECTION WIZARD
// ============================================================================

function EyewearSelectionWizardEnhanced() {
  const [step, setStep] = useState(1);
  const [params, setParams] = useState<LaserParams>({
    wavelength: 532,
    power: 1,
    beamDiameter: 1,
  });
  const [showResults, setShowResults] = useState(false);

  const totalSteps = 3;

  const calculateRecommendation = () => {
    const irradiance = params.power / (Math.PI * Math.pow(params.beamDiameter / 2, 2));
    const mpe = params.wavelength < 700 ? 0.00254 : 0.005;
    const minOD = Math.ceil(Math.log10(irradiance / mpe));

    const wavelengthData: Record<string, { range: string; filter: string; vlt: string }> = {
      uv: { range: "UV (180-400 nm)", filter: "UV-absorbing glass/polycarbonate", vlt: "Amber/Orange" },
      blue: { range: "Blue/Violet (400-500 nm)", filter: "Narrowband blue-blocking", vlt: "Yellow/Orange" },
      green: { range: "Green/Yellow (500-600 nm)", filter: "Nd:YAG or frequency-doubled", vlt: "Magenta/Red" },
      red: { range: "Red (600-700 nm)", filter: "HeNe or diode-specific", vlt: "Blue/Green" },
      nir: { range: "Near-IR (700-1400 nm)", filter: "Nd:YAG or broadband IR", vlt: "Clear/Light tint" },
      fir: { range: "Far-IR (>1400 nm)", filter: "CO₂ laser protection", vlt: "Clear with coating" },
    };

    let region = 'uv';
    if (params.wavelength >= 400 && params.wavelength < 500) region = 'blue';
    else if (params.wavelength >= 500 && params.wavelength < 600) region = 'green';
    else if (params.wavelength >= 600 && params.wavelength < 700) region = 'red';
    else if (params.wavelength >= 700 && params.wavelength < 1400) region = 'nir';
    else if (params.wavelength >= 1400) region = 'fir';

    const data = wavelengthData[region];

    return {
      minOD: Math.max(1, minOD),
      wavelengthRange: data.range,
      filterType: data.filter,
      visibilityRating: data.vlt,
      standards: ["ANSI Z136.1", "EN 207", "CE EN 60825"],
    };
  };

  const recommendation = showResults ? calculateRecommendation() : null;

  return (
    <Card>
      <CardHeader className="bg-muted border-b">
        <CardTitle className="flex items-center gap-2 text-base">
          <Ruler className="w-5 h-5 text-blue-600" />
          Eyewear Selection Wizard
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        {/* Progress Steps */}
        <div className="flex items-center justify-between mb-6">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                s <= step ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-500"
              }`}>
                {s < step ? <CheckCircle className="w-5 h-5" /> : s}
              </div>
              {s < totalSteps && <div className={`w-16 md:w-24 h-1 mx-2 ${s < step ? "bg-blue-600" : "bg-slate-200"}`} />}
            </div>
          ))}
        </div>

        {/* Step 1 */}
        {step === 1 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 1: Laser Parameters</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Wavelength (nm)</Label>
                <Input
                  type="number"
                  value={params.wavelength}
                  onChange={(e) => setParams({ ...params, wavelength: parseInt(e.target.value) || 0 })}
                  className="font-mono"
                />
                <p className="text-xs text-muted-foreground mt-1">Common: 355, 405, 532, 635, 808, 1064, 10600</p>
              </div>
              <div>
                <Label>Power (W)</Label>
                <Input
                  type="number"
                  value={params.power}
                  onChange={(e) => setParams({ ...params, power: parseFloat(e.target.value) || 0 })}
                  step="0.1"
                  className="font-mono"
                />
              </div>
              <div>
                <Label>Beam Diameter (mm)</Label>
                <Input
                  type="number"
                  value={params.beamDiameter}
                  onChange={(e) => setParams({ ...params, beamDiameter: parseFloat(e.target.value) || 0 })}
                  step="0.1"
                  className="font-mono"
                />
              </div>
              <div>
                <Label>Operation Mode</Label>
                <div className="flex gap-2 mt-2">
                  <Badge>CW</Badge>
                  <Badge variant="outline">Pulsed</Badge>
                  <Badge variant="outline">Q-Switched</Badge>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 2 */}
        {step === 2 && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Step 2: Application Context</h3>
            <div className="space-y-3">
              {[
                { id: "alignment", label: "Alignment procedure", desc: "High VLT for beam visibility" },
                { id: "medical", label: "Medical procedure", desc: "Comfort for extended wear" },
                { id: "industrial", label: "Industrial/Manufacturing", desc: "Impact resistance priority" },
                { id: "research", label: "Research/Lab", desc: "Multiple wavelength flexibility" },
              ].map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 bg-muted rounded-lg border">
                  <Checkbox id={item.id} />
                  <div>
                    <Label htmlFor={item.id} className="font-medium cursor-pointer">{item.label}</Label>
                    <p className="text-xs text-muted-foreground">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 - Results */}
        {step === 3 && !showResults && (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Ready to Calculate</h3>
            <p className="text-slate-500 mb-6">
              Calculate required OD for {params.wavelength} nm @ {params.power}W
            </p>
            <Button size="lg" onClick={() => setShowResults(true)}>
              <Calculator className="w-4 h-4 mr-2" />
              Calculate Requirements
            </Button>
          </div>
        )}

        {showResults && recommendation && (
          <div className="space-y-4">
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-6 rounded-lg border-2 border-emerald-300 text-center">
              <div className="text-7xl font-mono font-bold text-emerald-600 mb-2">
                OD {recommendation.minOD}+
              </div>
              <p className="text-muted-foreground">Minimum Required Optical Density</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted p-4 rounded-lg border">
                <h4 className="font-semibold text-sm mb-1">Wavelength Coverage</h4>
                <p className="text-sm text-muted-foreground">{recommendation.wavelengthRange}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg border">
                <h4 className="font-semibold text-sm mb-1">Filter Technology</h4>
                <p className="text-sm text-muted-foreground">{recommendation.filterType}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg border">
                <h4 className="font-semibold text-sm mb-1">Visible Light Transmission</h4>
                <p className="text-sm text-muted-foreground">{recommendation.visibilityRating}</p>
              </div>
              <div className="bg-muted p-4 rounded-lg border">
                <h4 className="font-semibold text-sm mb-1">Standards Compliance</h4>
                <div className="flex flex-wrap gap-1 mt-1">
                  {recommendation.standards.map((std) => (
                    <Badge key={std} variant="outline" className="text-xs">{std}</Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="bg-amber-50 dark:bg-amber-950/30 p-4 rounded-lg border border-amber-200">
              <p className="text-sm text-amber-800">
                <strong>Important:</strong> Verify with your Laser Safety Officer. Consider purchasing 
                eyewear with 1-2 OD levels higher than calculated for safety margin.
              </p>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => { if (step > 1) { setStep(step - 1); if (step === 3) setShowResults(false); } }} disabled={step === 1}>
            <ChevronLeft className="w-4 h-4 mr-2" /> Previous
          </Button>
          <Button onClick={() => { if (step < totalSteps) setStep(step + 1); }} disabled={step === totalSteps && showResults}>
            {step === totalSteps ? "Complete" : "Next"}
            {step < totalSteps && <ChevronRight className="w-4 h-4 ml-2" />}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 4: STANDARDS & MARKING
// ============================================================================

function StandardsAndMarking() {
  const [selectedStandard, setSelectedStandard] = useState<"ansi" | "en">("ansi");

  const ansiRequirements = [
    { req: "Wavelength or wavelength range", required: true },
    { req: "Optical Density (OD) at specified wavelength", required: true },
    { req: "Manufacturer identification", required: true },
    { req: "Visible Light Transmission (VLT)", required: false },
    { req: "Damage threshold / Power rating", required: false },
  ];

  const enScaleLabels = [
    { scale: "D", desc: "Continuous wave (CW) lasers", unit: "Power (W)" },
    { scale: "I", desc: "Pulsed lasers (>1 µs)", unit: "Energy (J)" },
    { scale: "R", desc: "Q-switched (1 ns - 1 µs)", unit: "Energy (J)" },
    { scale: "M", desc: "Mode-locked (< 1 ns)", unit: "Energy (J)" },
  ];

  const enProtectionLevels = [
    { level: "1", minOD: 1, maxPower: 0.1 },
    { level: "2", minOD: 2, maxPower: 1 },
    { level: "3", minOD: 3, maxPower: 10 },
    { level: "4", minOD: 4, maxPower: 100 },
    { level: "5", minOD: 5, maxPower: 1000 },
    { level: "6", minOD: 6, maxPower: 10000 },
  ];

  return (
    <div className="space-y-6">
      <div className="flex gap-2">
        <Button variant={selectedStandard === "ansi" ? "default" : "outline"} onClick={() => setSelectedStandard("ansi")}>
          ANSI Z136.1 (US)
        </Button>
        <Button variant={selectedStandard === "en" ? "default" : "outline"} onClick={() => setSelectedStandard("en")}>
          EN 207 (Europe)
        </Button>
      </div>

      {selectedStandard === "ansi" && (
        <Card>
          <CardHeader className="bg-muted border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileCheck className="w-5 h-5 text-blue-600" />
              ANSI Z136.1 Marking Requirements
            </CardTitle>
            <CardDescription>American National Standard for Safe Use of Lasers</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-2 text-left text-xs uppercase">Required Information</th>
                    <th className="px-4 py-2 text-left text-xs uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {ansiRequirements.map((item) => (
                    <tr key={item.req}>
                      <td className="px-4 py-2">{item.req}</td>
                      <td className="px-4 py-2">
                        <Badge variant={item.required ? "default" : "secondary"} className="text-xs">
                          {item.required ? "Required" : "Recommended"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Example Label */}
            <div className="bg-muted p-6 rounded-lg">
              <h4 className="font-semibold text-sm mb-4">Example ANSI Label</h4>
              <div className="bg-card p-4 rounded border-2 max-w-sm mx-auto">
                <div className="text-center border-b-2 border-slate-800 pb-2 mb-2">
                  <div className="font-bold text-lg">LASER PROTECTIVE EYEWEAR</div>
                  <div className="text-xs font-mono">Complies with ANSI Z136.1-2014</div>
                </div>
                <div className="space-y-1 text-sm font-mono">
                  <div><span className="text-muted-foreground">Mfr:</span> LaserSafe Inc.</div>
                  <div><span className="text-muted-foreground">Model:</span> LSG-532-1064</div>
                  <div><span className="text-muted-foreground">OD@532nm:</span> 7+</div>
                  <div><span className="text-muted-foreground">OD@1064nm:</span> 5+</div>
                  <div><span className="text-muted-foreground">VLT:</span> 25%</div>
                  <div className="text-xs mt-2 pt-2 border-t">
                    <div>Max CW: 10W @ 532nm</div>
                    <div>Max Energy: 5J @ 1064nm</div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedStandard === "en" && (
        <Card>
          <CardHeader className="bg-muted border-b">
            <CardTitle className="flex items-center gap-2 text-base">
              <Award className="w-5 h-5 text-blue-600" />
              EN 207 Marking System
            </CardTitle>
            <CardDescription>European Standard for Personal Eye Protection</CardDescription>
          </CardHeader>
          <CardContent className="pt-4 space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-2">Marking Format</h4>
              <div className="text-center py-4">
                <code className="text-xl bg-card px-4 py-2 rounded border font-mono">
                  532 L5 1064 L4
                </code>
              </div>
              <p className="text-sm text-slate-600 text-center">Wavelength + Protection Level + Scale Letter</p>
            </div>

            {/* Scale Letters */}
            <div className="grid grid-cols-2 gap-3">
              {enScaleLabels.map((scale) => (
                <div key={scale.scale} className="bg-slate-50 dark:bg-slate-800 p-3 rounded-lg border border-slate-200">
                  <div className="flex items-center gap-2">
                    <Badge variant="default">{scale.scale}</Badge>
                    <span className="font-medium text-sm">{scale.desc}</span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">Unit: {scale.unit}</div>
                </div>
              ))}
            </div>

            {/* Protection Levels */}
            <div className="overflow-hidden rounded-lg border border-slate-200">
              <table className="w-full text-sm">
                <thead className="bg-slate-50">
                  <tr className="border-b border-slate-200">
                    <th className="px-4 py-2 text-left text-xs uppercase">Level</th>
                    <th className="px-4 py-2 text-left text-xs uppercase">Min OD</th>
                    <th className="px-4 py-2 text-left text-xs uppercase">Max Power/Energy</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {enProtectionLevels.map((level) => (
                    <tr key={level.level}>
                      <td className="px-4 py-2"><Badge variant="outline">L{level.level}</Badge></td>
                      <td className="px-4 py-2 font-mono">{level.minOD}</td>
                      <td className="px-4 py-2 font-mono">{level.maxPower.toExponential(0)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* How to Read Labels */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Info className="w-5 h-5 text-blue-600" />
            Label Verification Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200">
              <h4 className="font-semibold text-red-700 text-sm mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Warning Signs - Do NOT Use
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Missing wavelength specification</li>
                <li>• No OD rating visible</li>
                <li>• Illegible or faded markings</li>
                <li>• No manufacturer identification</li>
                <li>• Cracked or damaged frames/lenses</li>
              </ul>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-950/30 p-4 rounded-lg border border-emerald-200">
              <h4 className="font-semibold text-emerald-700 text-sm mb-2 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                Verification Checklist
              </h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>✓ Wavelength matches your laser</li>
                <li>✓ OD rating exceeds requirements</li>
                <li>✓ Label clearly legible</li>
                <li>✓ Within damage threshold limits</li>
                <li>✓ Certification marks present</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 5: INSPECTION & MAINTENANCE
// ============================================================================

function InspectionAndMaintenance() {
  const [inspectionItems, setInspectionItems] = useState<Record<string, boolean>>({});
  const [lastInspection, setLastInspection] = useState<Date | null>(null);

  const inspectionChecklist: InspectionItem[] = [
    { id: "lenses", label: "Lens Condition", description: "No scratches, cracks, or pitting" },
    { id: "coating", label: "Coating Integrity", description: "No peeling, bubbling, or delamination" },
    { id: "frames", label: "Frame Integrity", description: "No cracks or structural damage" },
    { id: "temples", label: "Temple Arms", description: "Proper tension and alignment" },
    { id: "label", label: "Label Legibility", description: "Markings readable and intact" },
    { id: "cleanliness", label: "Cleanliness", description: "Free of dust and fingerprints" },
  ];

  const toggleItem = (id: string) => {
    setInspectionItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = inspectionChecklist.every((item) => inspectionItems[item.id]);

  const completeInspection = () => {
    setLastInspection(new Date());
  };

  const cleaningSteps = [
    { step: 1, title: "Rinse", desc: "Lukewarm water to remove dust particles" },
    { step: 2, title: "Wash", desc: "Mild soap, gently clean with fingertips" },
    { step: 3, title: "Rinse", desc: "Thoroughly remove all soap residue" },
    { step: 4, title: "Dry", desc: "Pat with clean microfiber cloth - no rubbing" },
    { step: 5, title: "Inspect", desc: "Check for spots or damage" },
  ];

  const replacementCriteria = [
    { criteria: "Deep scratches on lenses", severity: "Critical", action: "Replace immediately" },
    { criteria: "Coating damage or peeling", severity: "Critical", action: "Replace immediately" },
    { criteria: "Frame cracks or breaks", severity: "Critical", action: "Replace immediately" },
    { criteria: "Illegible markings", severity: "High", action: "Replace or re-mark" },
    { criteria: "Loose hinges", severity: "Medium", action: "Repair or replace" },
    { criteria: "Minor surface scratches", severity: "Low", action: "Monitor closely" },
    { criteria: "Age > 3 years", severity: "Low", action: "Consider replacement" },
  ];

  return (
    <div className="space-y-6">
      {/* Pre-Use Inspection */}
      <Card>
        <CardHeader className="bg-muted border-b">
          <CardTitle className="flex items-center gap-2 text-base">
            <ClipboardCheck className="w-5 h-5 text-blue-600" />
            Pre-Use Inspection Checklist
          </CardTitle>
          <CardDescription>Complete before each use of laser protective eyewear</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-2">
            {inspectionChecklist.map((item) => (
              <div
                key={item.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  inspectionItems[item.id]
                    ? "bg-emerald-50 border-emerald-200 dark:bg-emerald-950/30 dark:border-emerald-800"
                    : "bg-muted border-transparent"
                }`}
              >
                <Checkbox
                  id={item.id}
                  checked={inspectionItems[item.id] || false}
                  onCheckedChange={() => toggleItem(item.id)}
                />
                <div className="flex-1">
                  <Label htmlFor={item.id} className="font-medium cursor-pointer">{item.label}</Label>
                  <p className="text-xs text-slate-500">{item.description}</p>
                </div>
                {inspectionItems[item.id] && <CheckCircle className="w-5 h-5 text-emerald-500" />}
              </div>
            ))}
          </div>

          <Button className="w-full" disabled={!allChecked} onClick={completeInspection}>
            <CheckCircle className="w-4 h-4 mr-2" />
            Complete Inspection
          </Button>

          {lastInspection && (
            <div className="text-center text-sm text-muted-foreground">
              Last inspection: {lastInspection.toLocaleString()}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Cleaning Procedures */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="w-5 h-5 text-blue-600" />
            Cleaning Procedure
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {cleaningSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-4 p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-sm flex-shrink-0">
                  {step.step}
                </div>
                <div>
                  <h4 className="font-semibold text-sm">{step.title}</h4>
                  <p className="text-sm text-slate-600">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-4 bg-red-50 dark:bg-red-950/30 p-4 rounded-lg border border-red-200">
            <h4 className="font-semibold text-red-700 text-sm mb-2 flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Do NOT Use
            </h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Paper towels or tissues (scratch lenses)</li>
              <li>• Ammonia-based cleaners (damage coatings)</li>
              <li>• Acetone or harsh solvents</li>
              <li>• Hot water (delamination risk)</li>
              <li>• Compressed air (embed particles)</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Replacement Criteria */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <RefreshCw className="w-5 h-5 text-blue-600" />
            Replacement Criteria
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-900">
                <tr className="border-b border-slate-200">
                  <th className="px-4 py-2 text-left text-xs uppercase">Condition</th>
                  <th className="px-4 py-2 text-left text-xs uppercase">Severity</th>
                  <th className="px-4 py-2 text-left text-xs uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {replacementCriteria.map((item) => (
                  <tr key={item.criteria}>
                    <td className="px-4 py-2">{item.criteria}</td>
                    <td className="px-4 py-2">
                      <Badge
                        variant={item.severity === "Critical" ? "destructive" : item.severity === "High" ? "default" : "secondary"}
                        className="text-xs"
                      >
                        {item.severity}
                      </Badge>
                    </td>
                    <td className="px-4 py-2 text-muted-foreground text-xs">{item.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 bg-blue-50 dark:bg-blue-950/30 p-4 rounded-lg border border-blue-200">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm">Storage Recommendations</h4>
                <ul className="text-sm text-muted-foreground space-y-1 mt-1">
                  <li>• Store in protective case when not in use</li>
                  <li>• Avoid direct sunlight and heat sources</li>
                  <li>• Keep away from chemicals and solvents</li>
                  <li>• Maintain temperature 10-35°C</li>
                  <li>• Inspect quarterly even if unused</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN EXPORT
// ============================================================================

export default function Module5_EyewearSelection() {
  const [activeSection, setActiveSection] = useState<number>(0);

  const sections = [
    { id: 'od', title: 'OD Calculator', component: ODCalculatorEnhanced, icon: Calculator },
    { id: 'coverage', title: 'Wavelength Coverage', component: WavelengthCoverageChecker, icon: Search },
    { id: 'wizard', title: 'Selection Wizard', component: EyewearSelectionWizardEnhanced, icon: Ruler },
    { id: 'standards', title: 'Standards & Marking', component: StandardsAndMarking, icon: Award },
    { id: 'inspection', title: 'Inspection', component: InspectionAndMaintenance, icon: ClipboardCheck },
  ];

  const CurrentSectionComponent = sections[activeSection].component;

  return (
    <div className="space-y-6">
      {/* Technical Header */}
      <div className="p-6 bg-gradient-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-900 dark:via-blue-950/20 dark:to-indigo-950/20 rounded-xl border border-slate-200 dark:border-slate-700">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-600 to-blue-600 flex items-center justify-center shadow-lg">
            <Glasses className="w-9 h-9 text-white" />
          </div>
          <div>
            <Badge variant="secondary" className="mb-2 bg-muted text-foreground">Course 3 • Module 5</Badge>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Protective Eyewear Selection</h1>
            <p className="text-muted-foreground mt-1">Technical specifications and selection criteria</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex flex-wrap gap-2">
        {sections.map((section, index) => {
          const Icon = section.icon;
          const isActive = activeSection === index;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(index)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border-2 ${
                isActive ? 'bg-card shadow-md border-blue-500 text-blue-600' : 'bg-muted border-transparent text-muted-foreground'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{section.title}</span>
            </button>
          );
        })}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        <CurrentSectionComponent />
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between items-center pt-6 border-t border-slate-200 dark:border-slate-800">
        <Button variant="outline" onClick={() => setActiveSection(Math.max(0, activeSection - 1))} disabled={activeSection === 0}>
          <ChevronLeft className="w-4 h-4 mr-2" /> Previous
        </Button>
        <div className="flex items-center gap-1">
          {sections.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === activeSection ? 'w-6 bg-blue-600' : 'bg-slate-300'}`} />
          ))}
        </div>
        <Button onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))} disabled={activeSection === sections.length - 1}>
          Next <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
