/**
 * Safety Distance Calculator - FAA AC 70-1B Methodology
 * 
 * FAA Official Aesthetic with aviation styling
 * Enhanced with weather/aviation icons and emergency-oriented design
 */

import React, { useState, useEffect } from 'react';
import { FAAColors, FAAIcons, ZoneConfig } from '../../styles/FAAAviationStyles';

interface CalculationMode {
  id: 'cw' | 'pulsed' | 'rep_pulsed';
  label: string;
  description: string;
  icon: string;
}

const calculationModes: CalculationMode[] = [
  { id: 'cw', label: 'Continuous Wave (CW)', description: 'Non-pulsed output > 0.25 seconds', icon: '〰️' },
  { id: 'pulsed', label: 'Single Pulse', description: 'Single pulse < 0.25 seconds', icon: '⚡' },
  { id: 'rep_pulsed', label: 'Repetitively Pulsed', description: 'PRF ≥ 1 Hz', icon: '🔁' }
];

interface WavelengthRange {
  min: number;
  max: number;
  name: string;
  mpeCW: number;
  hasVCF: boolean;
  caFormula?: string;
  color: string;
}

const wavelengthRanges: WavelengthRange[] = [
  { min: 400, max: 700, name: 'Visible (VCF Applied)', mpeCW: 2.6, hasVCF: true, color: '#22c55e' },
  { min: 700, max: 1050, name: 'Near-IR (CA Factor)', mpeCW: 2.6, hasVCF: false, caFormula: '10^(0.002 × (λ - 700))', color: '#ef4444' },
  { min: 1050, max: 1150, name: 'NIR Extended', mpeCW: 12.75, hasVCF: false, color: '#f97316' },
  { min: 1150, max: 1320, name: 'NIR CC Factor', mpeCW: 12.75, hasVCF: false, caFormula: 'See CC formulas', color: '#f59e0b' },
  { min: 1320, max: 1400, name: 'NIR Retinal Limit', mpeCW: 0, hasVCF: false, color: '#dc2626' },
  { min: 1400, max: 1500, name: 'Corneal IR', mpeCW: 2384, hasVCF: false, color: '#8b5cf6' },
  { min: 1500, max: 1800, name: 'Mid-IR', mpeCW: 4000, hasVCF: false, color: '#6366f1' },
  { min: 1800, max: 10000, name: 'Far-IR', mpeCW: 1584, hasVCF: false, color: '#3b82f6' }
];

// Visual Correction Factor table
const vcfTable: Record<number, number> = {
  400: 0.0004, 410: 0.0012, 420: 0.0040, 430: 0.0116, 440: 0.0230,
  450: 0.0380, 460: 0.0599, 470: 0.0909, 480: 0.1391, 490: 0.2079,
  500: 0.3226, 510: 0.5025, 520: 0.7092, 530: 0.8621, 540: 0.9524,
  550: 0.9901, 555: 1.0000, 560: 0.9901, 570: 0.9524, 580: 0.8696,
  590: 0.7576, 600: 0.6329, 610: 0.5025, 620: 0.3817, 630: 0.2653,
  640: 0.1751, 650: 0.1070, 660: 0.0610, 670: 0.0321, 680: 0.0170,
  690: 0.0082, 700: 0.0041
};

const getVCF = (wavelength: number): number => {
  if (wavelength < 400 || wavelength > 700) return 0;
  if (vcfTable[wavelength]) return vcfTable[wavelength];
  const wavelengths = Object.keys(vcfTable).map(Number).sort((a, b) => a - b);
  const lower = wavelengths.filter(w => w < wavelength).pop() || 400;
  const upper = wavelengths.filter(w => w > wavelength)[0] || 700;
  const lowerVCF = vcfTable[lower];
  const upperVCF = vcfTable[upper];
  const ratio = (wavelength - lower) / (upper - lower);
  return lowerVCF + (upperVCF - lowerVCF) * ratio;
};

const calculateCA = (wavelength: number): number => {
  if (wavelength < 700 || wavelength > 1050) return 1;
  return Math.pow(10, 0.002 * (wavelength - 700));
};

export const SafetyDistanceCalculator: React.FC = () => {
  const [mode, setMode] = useState<'cw' | 'pulsed' | 'rep_pulsed'>('cw');
  const [wavelength, setWavelength] = useState(532);
  const [power, setPower] = useState(40);
  const [pulseEnergy, setPulseEnergy] = useState(0.1);
  const [pulseDuration, setPulseDuration] = useState(0.00000001);
  const [prf, setPrf] = useState(1000);
  const [beamDivergence, setBeamDivergence] = useState(1.5);
  const [beamDiameter, setBeamDiameter] = useState(0.5);
  const [minElevation, setMinElevation] = useState(15);
  const [maxElevation, setMaxElevation] = useState(45);

  const [mpeValue, setMpeValue] = useState(2.6);
  const [caFactor, setCaFactor] = useState(1);
  const [vcfValue, setVcfValue] = useState(0.8621);
  const [pcPower, setPcPower] = useState(40);
  const [vcPower, setVcPower] = useState(34.48);
  
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
    lfedVertical: 0
  });

  const [showSteps, setShowSteps] = useState(true);
  const [activeTab, setActiveTab] = useState<'input' | 'results' | 'formulas'>('input');

  useEffect(() => {
    calculateAll();
  }, [mode, wavelength, power, pulseEnergy, prf, beamDivergence, beamDiameter, minElevation, maxElevation]);

  const calculateAll = () => {
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

    const vcf = getVCF(wavelength);
    setVcfValue(vcf);

    let pcp = power;
    if (mode === 'pulsed') {
      pcp = pulseEnergy * 4;
    } else if (mode === 'rep_pulsed') {
      pcp = pulseEnergy * prf;
    }
    setPcPower(pcp);

    const vcp = pcp * vcf;
    setVcPower(vcp);

    let nohdSlant: number;
    if (mode === 'pulsed') {
      nohdSlant = (32.8 / beamDivergence) * Math.sqrt((1.2732 * pulseEnergy) / (mpe / 1000));
    } else {
      nohdSlant = (32.8 / beamDivergence) * Math.sqrt((1273.2 * power) / mpe);
    }
    nohdSlant = Math.round(nohdSlant);

    const szedSlant = wavelength >= 400 && wavelength <= 700
      ? Math.round((32.8 / beamDivergence) * Math.sqrt(12732 * vcp))
      : 0;

    const czedSlant = szedSlant > 0 ? Math.round(szedSlant * 4.47) : 0;
    const lfedSlant = szedSlant > 0 ? Math.round(szedSlant * 44.7) : 0;

    const nohdHorizontal = Math.round(nohdSlant * Math.cos(minElevation * Math.PI / 180));
    const nohdVertical = Math.round(nohdSlant * Math.sin(maxElevation * Math.PI / 180));
    const szedHorizontal = Math.round(szedSlant * Math.cos(minElevation * Math.PI / 180));
    const szedVertical = Math.round(szedSlant * Math.sin(maxElevation * Math.PI / 180));
    const czedHorizontal = Math.round(czedSlant * Math.cos(minElevation * Math.PI / 180));
    const czedVertical = Math.round(czedSlant * Math.sin(maxElevation * Math.PI / 180));
    const lfedHorizontal = Math.round(lfedSlant * Math.cos(minElevation * Math.PI / 180));
    const lfedVertical = Math.round(lfedSlant * Math.sin(maxElevation * Math.PI / 180));

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
      lfedVertical
    });
  };

  const currentWavelengthRange = wavelengthRanges.find(r => wavelength >= r.min && wavelength <= r.max);

  return (
    <div className="max-w-7xl mx-auto">
      {/* FAA Header */}
      <div className="bg-[#002868] text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center">
            <span className="text-4xl mr-4">📐</span>
            <div>
              <h2 className="text-2xl font-bold">Safety Distance Calculator</h2>
              <p className="text-blue-100">NOHD, SZED, CZED, and LFED per FAA AC 70-1B</p>
            </div>
          </div>
          <div className="hidden md:flex gap-2">
            <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">AC 70-1B</span>
            <span className="px-3 py-1 bg-white/20 rounded-lg text-sm">SAE ARP5293A</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg p-6">
        {/* Tabs - FAA Style */}
        <div className="flex justify-center mb-8">
          <div className="bg-gray-100 p-2 rounded-xl inline-flex">
            {[
              { id: 'input', label: 'Input Parameters', icon: '⚙️' },
              { id: 'results', label: 'Results', icon: '📊' },
              { id: 'formulas', label: 'Formulas', icon: '📝' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-3 rounded-lg font-bold transition-all flex items-center ${
                  activeTab === tab.id
                    ? 'bg-[#002868] text-white shadow-md'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Input Tab */}
        {activeTab === 'input' && (
          <div className="grid lg:grid-cols-2 gap-6">
            {/* Laser Parameters */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-[#002868] mb-6 flex items-center">
                <span className="mr-2">⚡</span> Laser Parameters
              </h3>

              {/* Mode Selection */}
              <div className="mb-6">
                <label className="block text-sm font-bold text-gray-700 mb-3">Mode of Operation</label>
                <div className="space-y-2">
                  {calculationModes.map((m) => (
                    <label key={m.id} className={`flex items-center p-4 border-2 rounded-xl cursor-pointer 
                      transition-all ${mode === m.id ? 'border-[#002868] bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}>
                      <input
                        type="radio"
                        name="mode"
                        value={m.id}
                        checked={mode === m.id}
                        onChange={(e) => setMode(e.target.value as any)}
                        className="mr-4 w-5 h-5 text-[#002868]"
                      />
                      <span className="text-2xl mr-3">{m.icon}</span>
                      <div>
                        <div className="font-bold text-gray-800">{m.label}</div>
                        <div className="text-xs text-gray-500">{m.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Wavelength */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Wavelength: <span className="text-[#002868] text-xl">{wavelength}</span> nm
                </label>
                <input
                  type="range"
                  min="400"
                  max="10000"
                  step="1"
                  value={wavelength}
                  onChange={(e) => setWavelength(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                  <span>400 nm</span>
                  <span>10,000 nm</span>
                </div>
                <div className="mt-3 p-3 bg-white rounded-lg border-2 border-blue-200">
                  <span className="font-bold text-gray-700">Region:</span>
                  <span className="ml-2 font-medium" style={{ color: currentWavelengthRange?.color }}>
                    {currentWavelengthRange?.name || 'Unknown'}
                  </span>
                  {wavelength >= 400 && wavelength <= 700 && (
                    <span className="ml-3 text-[#002868] font-mono">VCF: {vcfValue.toFixed(4)}</span>
                  )}
                  {wavelength >= 700 && wavelength <= 1050 && (
                    <span className="ml-3 text-orange-600 font-mono">CA: {caFactor.toFixed(3)}</span>
                  )}
                </div>
              </div>

              {/* Power / Energy */}
              {(mode === 'cw' || mode === 'rep_pulsed') && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    {mode === 'cw' ? 'Power' : 'Average Power'}: <span className="text-[#002868] text-xl">{power}</span> W
                  </label>
                  <input
                    type="range"
                    min="0.001"
                    max="1000"
                    step="0.1"
                    value={power}
                    onChange={(e) => setPower(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {mode !== 'cw' && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Pulse Energy: <span className="text-[#002868] text-xl">{pulseEnergy}</span> J
                  </label>
                  <input
                    type="range"
                    min="0.000001"
                    max="10"
                    step="0.0001"
                    value={pulseEnergy}
                    onChange={(e) => setPulseEnergy(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}

              {mode === 'rep_pulsed' && (
                <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                  <label className="block text-sm font-bold text-gray-700 mb-2">
                    Pulse Repetition Frequency: <span className="text-[#002868] text-xl">{prf}</span> Hz
                  </label>
                  <input
                    type="range"
                    min="1"
                    max="100000"
                    step="100"
                    value={prf}
                    onChange={(e) => setPrf(Number(e.target.value))}
                    className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              )}
            </div>

            {/* Beam & Geometry */}
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-[#002868] mb-6 flex items-center">
                <span className="mr-2">📐</span> Beam Characteristics
              </h3>

              {/* Beam Divergence */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Beam Divergence: <span className="text-[#002868] text-xl">{beamDivergence}</span> mrad
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={beamDivergence}
                  onChange={(e) => setBeamDivergence(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>0.1 mrad (tight)</span>
                  <span>10 mrad (wide)</span>
                </div>
              </div>

              {/* Beam Diameter */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Beam Diameter (1/e): <span className="text-[#002868] text-xl">{beamDiameter}</span> cm
                </label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={beamDiameter}
                  onChange={(e) => setBeamDiameter(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
                <div className="text-xs text-gray-500 mt-2">
                  Note: For beams &lt; 1 cm, simplified formulas apply
                </div>
              </div>

              <h3 className="text-xl font-bold text-[#002868] mb-6 flex items-center">
                <span className="mr-2">🎯</span> Beam Direction
              </h3>

              {/* Elevation Angles */}
              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Minimum Elevation: <span className="text-[#002868] text-xl">{minElevation}</span>°
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={minElevation}
                  onChange={(e) => setMinElevation(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              <div className="mb-6 p-4 bg-gray-50 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-2">
                  Maximum Elevation: <span className="text-[#002868] text-xl">{maxElevation}</span>°
                </label>
                <input
                  type="range"
                  min="0"
                  max="90"
                  value={maxElevation}
                  onChange={(e) => setMaxElevation(Number(e.target.value))}
                  className="w-full h-2 bg-gray-300 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Visual Angle Indicator */}
              <div className="mt-4 p-5 bg-[#002868] rounded-xl text-white">
                <div className="text-center">
                  <div className="relative h-32 w-full">
                    <div className="absolute bottom-0 left-1/2 w-1 bg-white/50 origin-bottom"
                      style={{ height: '80px', transform: `translateX(-50%) rotate(-${minElevation}deg)` }} />
                    <div className="absolute bottom-0 left-1/2 w-2 bg-white origin-bottom"
                      style={{ height: '80px', transform: `translateX(-50%) rotate(-${maxElevation}deg)` }} />
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 text-xs bg-white/20 px-2 py-1 rounded">
                      Laser Source
                    </div>
                  </div>
                  <div className="text-sm mt-2 font-mono">
                    Beam sweep: {minElevation}° to {maxElevation}°
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === 'results' && (
          <div className="space-y-6">
            {/* Calculated Parameters */}
            <div className="bg-blue-50 rounded-xl p-6 border-2 border-blue-200">
              <h3 className="text-xl font-bold text-[#002868] mb-4 flex items-center">
                <span className="mr-2">⚙️</span> Calculated Parameters
              </h3>
              <div className="grid md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
                  <div className="text-sm text-gray-600">MPE Value</div>
                  <div className="text-3xl font-bold text-[#002868] font-mono">{mpeValue.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">mW/cm²</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
                  <div className="text-sm text-gray-600">Pre-corrected Power</div>
                  <div className="text-3xl font-bold text-[#002868] font-mono">{pcPower.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">W</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
                  <div className="text-sm text-gray-600">VCF</div>
                  <div className="text-3xl font-bold text-[#002868] font-mono">{vcfValue.toFixed(4)}</div>
                  <div className="text-xs text-gray-500">Visual Correction</div>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-sm border-2 border-gray-100">
                  <div className="text-sm text-gray-600">Visually Corrected</div>
                  <div className="text-3xl font-bold text-[#002868] font-mono">{vcPower.toFixed(2)}</div>
                  <div className="text-xs text-gray-500">W</div>
                </div>
              </div>
            </div>

            {/* Distance Results */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* NOHD Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-red-500">
                <div className="bg-red-600 text-white p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-2xl font-bold">NOHD</h4>
                      <p className="text-sm opacity-90">Nominal Ocular Hazard Distance</p>
                      <p className="text-xs mt-1 font-mono">Threshold: MPE ({mpeValue.toFixed(2)} mW/cm²)</p>
                    </div>
                    <span className="text-4xl">👁️</span>
                  </div>
                </div>
                <div className="p-5">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-red-600 font-mono">{results.nohdSlant.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Slant Range (ft)</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800 font-mono">{results.nohdHorizontal.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Horizontal (ft)</div>
                    </div>
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-2xl font-bold text-gray-800 font-mono">{results.nohdVertical.toLocaleString()}</div>
                      <div className="text-xs text-gray-500">Vertical (ft)</div>
                    </div>
                  </div>
                  <div className="mt-4 text-sm text-gray-700 bg-red-50 p-3 rounded-lg border border-red-200">
                    <strong className="text-red-700">⚠️ Eye hazard zone</strong> - protective measures required within this distance
                  </div>
                </div>
              </div>

              {/* SZED Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-yellow-500">
                <div className="bg-yellow-500 text-white p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-2xl font-bold">SZED</h4>
                      <p className="text-sm opacity-90">Sensitive Zone Exposure Distance</p>
                      <p className="text-xs mt-1 font-mono">Threshold: 100 µW/cm²</p>
                    </div>
                    <span className="text-4xl">⚡</span>
                  </div>
                </div>
                <div className="p-5">
                  {wavelength >= 400 && wavelength <= 700 ? (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600 font-mono">{results.szedSlant.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Slant Range (ft)</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800 font-mono">{results.szedHorizontal.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Horizontal (ft)</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800 font-mono">{results.szedVertical.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Vertical (ft)</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                      N/A - Visual effects calculation only for visible lasers (400-700 nm)
                    </div>
                  )}
                  <div className="mt-4 text-sm text-gray-700 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
                    <strong className="text-yellow-700">⚡ Flashblindness zone</strong> - temporary afterimages possible
                  </div>
                </div>
              </div>

              {/* CZED Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-orange-500">
                <div className="bg-orange-500 text-white p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-2xl font-bold">CZED</h4>
                      <p className="text-sm opacity-90">Critical Zone Exposure Distance</p>
                      <p className="text-xs mt-1 font-mono">Threshold: 5 µW/cm²</p>
                    </div>
                    <span className="text-4xl">💡</span>
                  </div>
                </div>
                <div className="p-5">
                  {wavelength >= 400 && wavelength <= 700 ? (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-orange-600 font-mono">{results.czedSlant.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Slant Range (ft)</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800 font-mono">{results.czedHorizontal.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Horizontal (ft)</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800 font-mono">{results.czedVertical.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Vertical (ft)</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                      N/A - Visual effects calculation only for visible lasers
                    </div>
                  )}
                  <div className="mt-4 text-sm text-gray-700 bg-orange-50 p-3 rounded-lg border border-orange-200">
                    <strong className="text-orange-700">💡 Glare zone</strong> - vision obscured while light is on
                  </div>
                </div>
              </div>

              {/* LFED Card */}
              <div className="bg-white rounded-xl shadow-lg overflow-hidden border-2 border-green-500">
                <div className="bg-green-600 text-white p-5">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-2xl font-bold">LFED</h4>
                      <p className="text-sm opacity-90">Laser-Free Exposure Distance</p>
                      <p className="text-xs mt-1 font-mono">Threshold: 50 nW/cm²</p>
                    </div>
                    <span className="text-4xl">👀</span>
                  </div>
                </div>
                <div className="p-5">
                  {wavelength >= 400 && wavelength <= 700 ? (
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-green-600 font-mono">{results.lfedSlant.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Slant Range (ft)</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800 font-mono">{results.lfedHorizontal.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Horizontal (ft)</div>
                      </div>
                      <div className="p-3 bg-gray-50 rounded-lg">
                        <div className="text-2xl font-bold text-gray-800 font-mono">{results.lfedVertical.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Vertical (ft)</div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-lg">
                      N/A - Visual effects calculation only for visible lasers
                    </div>
                  )}
                  <div className="mt-4 text-sm text-gray-700 bg-green-50 p-3 rounded-lg border border-green-200">
                    <strong className="text-green-700">👀 Distraction zone</strong> - mental interference possible
                  </div>
                </div>
              </div>
            </div>

            {/* Zone Relationship Visualization */}
            {wavelength >= 400 && wavelength <= 700 && (
              <div className="bg-[#0f172a] rounded-xl p-6 text-white">
                <h4 className="text-xl font-bold mb-4 flex items-center">
                  <span className="mr-2">🎯</span> Zone Relationship Visualization
                </h4>
                <div className="relative h-32 bg-gray-800 rounded-lg overflow-hidden mb-4">
                  {/* Concentric zones */}
                  <div className="absolute top-1/2 left-8 transform -translate-y-1/2 h-20 bg-red-600 rounded-full 
                    flex items-center justify-center border-4 border-red-400"
                    style={{ width: `${Math.max(30, (results.nohdSlant / results.lfedSlant) * 250)}px` }}>
                    <span className="text-xs font-bold">NOHD</span>
                  </div>
                  <div className="absolute top-1/2 left-8 transform -translate-y-1/2 h-14 bg-yellow-500 rounded-full 
                    flex items-center justify-center border-4 border-yellow-400"
                    style={{ width: `${Math.max(20, (results.szedSlant / results.lfedSlant) * 250)}px` }}>
                    <span className="text-xs font-bold text-black">SZED</span>
                  </div>
                  <div className="absolute top-1/2 left-8 transform -translate-y-1/2 h-10 bg-orange-500 rounded-full 
                    flex items-center justify-center border-4 border-orange-400"
                    style={{ width: `${Math.max(15, (results.czedSlant / results.lfedSlant) * 250)}px` }}>
                    <span className="text-xs font-bold">CZED</span>
                  </div>
                  <div className="absolute top-1/2 left-8 transform -translate-y-1/2 h-6 bg-green-500 rounded-full 
                    flex items-center justify-center border-4 border-green-400"
                    style={{ width: '250px' }}>
                    <span className="text-xs font-bold">LFED</span>
                  </div>
                  <div className="absolute right-4 top-2 text-xs text-gray-400">
                    ← Laser Source
                  </div>
                </div>
                <div className="text-sm text-gray-400 font-mono">
                  <p>Zone sizes shown relative to LFED. All distances from laser source.</p>
                  <p className="mt-1">CZED = SZED × 4.47 | LFED = SZED × 44.7</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Formulas Tab */}
        {activeTab === 'formulas' && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-gray-200">
              <h3 className="text-xl font-bold text-[#002868] mb-6 flex items-center">
                <span className="mr-2">📝</span> FAA AC 70-1B Equations
              </h3>
              
              <div className="space-y-6">
                {/* NOHD Equations */}
                <div className="p-5 bg-red-50 rounded-xl border-2 border-red-200">
                  <h4 className="font-bold text-red-800 mb-4 flex items-center text-lg">
                    <span className="mr-2">👁️</span> NOHD - Nominal Ocular Hazard Distance
                  </h4>
                  
                  <div className="mb-4 p-4 bg-white rounded-lg border border-red-200">
                    <div className="font-mono text-sm">
                      <strong className="text-red-700">Equation 70-1.1 (Single Pulse):</strong><br/>
                      <span className="text-lg">NOHD<sub>SR</sub> = (32.8 / φ) × √(1.2732 × Q / MPE)</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Use for single pulse lasers with pulse width &lt; 0.25 seconds</p>
                  </div>

                  <div className="p-4 bg-white rounded-lg border border-red-200">
                    <div className="font-mono text-sm">
                      <strong className="text-red-700">Equation 70-1.2 (CW/High PRF):</strong><br/>
                      <span className="text-lg">NOHD<sub>SR</sub> = (32.8 / φ) × √(1273.2 × P / MPE)</span>
                    </div>
                    <p className="text-xs text-gray-600 mt-2">Use for CW or repetitively pulsed lasers with PRF &gt; 13 kHz</p>
                  </div>
                </div>

                {/* Visual Effect Equations */}
                <div className="p-5 bg-yellow-50 rounded-xl border-2 border-yellow-200">
                  <h4 className="font-bold text-yellow-800 mb-4 flex items-center text-lg">
                    <span className="mr-2">⚡</span> Visual Interference Distances (Visible Only)
                  </h4>
                  
                  <div className="grid md:grid-cols-3 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-yellow-200">
                      <div className="font-mono text-sm mb-2">
                        <strong className="text-yellow-700">SZED (Eq 70-1.3)</strong>
                      </div>
                      <div className="text-sm font-mono">SZED<sub>SR</sub> = (32.8 / φ) × √(12732 × W<sub>VCP</sub>)</div>
                      <div className="text-xs text-gray-600 mt-2">Threshold: 100 µW/cm²</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-yellow-200">
                      <div className="font-mono text-sm mb-2">
                        <strong className="text-yellow-700">CZED (Eq 70-1.4)</strong>
                      </div>
                      <div className="text-sm font-mono">CZED<sub>SR</sub> = SZED<sub>SR</sub> × 4.47</div>
                      <div className="text-xs text-gray-600 mt-2">Threshold: 5 µW/cm²</div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-yellow-200">
                      <div className="font-mono text-sm mb-2">
                        <strong className="text-yellow-700">LFED (Eq 70-1.5)</strong>
                      </div>
                      <div className="text-sm font-mono">LFED<sub>SR</sub> = SZED<sub>SR</sub> × 44.7</div>
                      <div className="text-xs text-gray-600 mt-2">Threshold: 50 nW/cm²</div>
                    </div>
                  </div>
                </div>

                {/* Horizontal/Vertical */}
                <div className="p-5 bg-green-50 rounded-xl border-2 border-green-200">
                  <h4 className="font-bold text-green-800 mb-4 flex items-center text-lg">
                    <span className="mr-2">📐</span> Horizontal and Vertical Distances
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="font-mono text-sm">
                        <strong className="text-green-700">Horizontal:</strong><br/>
                        <span className="text-lg">D<sub>H</sub> = D<sub>SR</sub> × cos(θ<sub>min</sub>)</span>
                      </div>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-green-200">
                      <div className="font-mono text-sm">
                        <strong className="text-green-700">Vertical:</strong><br/>
                        <span className="text-lg">D<sub>V</sub> = D<sub>SR</sub> × sin(θ<sub>max</sub>)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Correction Factors */}
                <div className="p-5 bg-blue-50 rounded-xl border-2 border-blue-200">
                  <h4 className="font-bold text-blue-800 mb-4 flex items-center text-lg">
                    <span className="mr-2">🔧</span> Correction Factors
                  </h4>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-4 bg-white rounded-lg border border-blue-200">
                      <div className="font-mono text-sm">
                        <strong className="text-blue-700">CA Factor (700-1050 nm):</strong><br/>
                        <span className="text-lg">C<sub>A</sub> = 10^(0.002 × (λ - 700))</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Increases MPE for reduced absorption in NIR</p>
                    </div>
                    <div className="p-4 bg-white rounded-lg border border-blue-200">
                      <div className="font-mono text-sm">
                        <strong className="text-blue-700">VCF (400-700 nm):</strong><br/>
                        <span>From CIE photopic curve</span>
                      </div>
                      <p className="text-xs text-gray-600 mt-2">Accounts for perceived brightness by human eye</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SafetyDistanceCalculator;
