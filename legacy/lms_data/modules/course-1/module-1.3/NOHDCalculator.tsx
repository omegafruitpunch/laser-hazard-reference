/**
 * NOHD Calculator Component
 * Module 1.3: Beam Hazard Calculations
 * 
 * Interactive step-by-step calculator for Nominal Ocular Hazard Distance
 * Implements Brilliant.org patterns: progressive disclosure, visual proof, hint system
 */

import React, { useState, useEffect, useMemo } from 'react';
import './NOHDCalculator.css';

interface CalculationStep {
  id: number;
  title: string;
  description: string;
  isComplete: boolean;
}

interface WavelengthOption {
  value: number;
  label: string;
  region: 'uv' | 'visible' | 'near_ir' | 'far_ir';
  color: string;
}

const WAVELENGTH_OPTIONS: WavelengthOption[] = [
  { value: 355, label: '355 nm (UV)', region: 'uv', color: '#8B00FF' },
  { value: 405, label: '405 nm (Violet)', region: 'visible', color: '#6600FF' },
  { value: 445, label: '445 nm (Blue)', region: 'visible', color: '#0066FF' },
  { value: 532, label: '532 nm (Green)', region: 'visible', color: '#00FF00' },
  { value: 633, label: '633 nm (Red)', region: 'visible', color: '#FF0000' },
  { value: 650, label: '650 nm (Red)', region: 'visible', color: '#FF0000' },
  { value: 808, label: '808 nm (Near-IR)', region: 'near_ir', color: '#FF4400' },
  { value: 1064, label: '1064 nm (Near-IR)', region: 'near_ir', color: '#FF2200' },
  { value: 1550, label: '1550 nm (Far-IR)', region: 'far_ir', color: '#AA0000' },
];

const NOHDCalculator: React.FC = () => {
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Input values
  const [wavelength, setWavelength] = useState<number>(532);
  const [power, setPower] = useState<number>(5);
  const [powerUnit, setPowerUnit] = useState<'mW' | 'W'>('W');
  const [divergence, setDivergence] = useState<number>(1.5);
  const [exposureTime, setExposureTime] = useState<number>(0.25);

  // Hint system
  const [showHint, setShowHint] = useState<number | null>(null);
  const [hintLevel, setHintLevel] = useState(0);

  // Calculated values
  const calculatedValues = useMemo(() => {
    const powerInWatts = powerUnit === 'mW' ? power / 1000 : power;
    const mpe = calculateMPE(wavelength, exposureTime);
    const nohd = calculateNOHD(powerInWatts, divergence, mpe);
    const beamDiameterAtNOHD = divergence * nohd; // mm

    return {
      mpe,
      nohd,
      beamDiameterAtNOHD,
      safetyCategory: getSafetyCategory(nohd),
    };
  }, [wavelength, power, powerUnit, divergence, exposureTime]);

  // Calculate MPE based on wavelength and exposure time
  function calculateMPE(wl: number, t: number): number {
    // Simplified MPE calculations for common wavelengths
    // Values in mW/cm²
    if (wl >= 400 && wl <= 700) {
      // Visible range
      if (t >= 0.000018 && t <= 10) {
        return 1.8 * Math.pow(t, 0.75);
      } else if (t > 10 && t <= 30000) {
        return 10; // 10 W/m² = 1 mW/cm² for long exposures
      }
    } else if (wl > 700 && wl <= 1400) {
      // Near-IR
      if (t >= 0.000018 && t <= 10) {
        return 1.8 * Math.pow(t, 0.75);
      }
    }
    // Default fallback
    return 1.0;
  }

  // Calculate NOHD
  function calculateNOHD(P: number, theta: number, mpe: number): number {
    // P in Watts, theta in mrad, mpe in mW/cm²
    // Formula: NOHD = (1/θ) × √(1.27 × P / MPE)
    // Convert mpe from mW/cm² to W/m² for consistent units
    const mpe_W_m2 = mpe * 10; // 1 mW/cm² = 10 W/m²
    const theta_rad = theta / 1000; // Convert mrad to rad
    
    const sqrtTerm = Math.sqrt((1.27 * P) / mpe_W_m2);
    const nohd = (1 / theta_rad) * sqrtTerm;
    
    return nohd;
  }

  function getSafetyCategory(nohd: number): { label: string; color: string } {
    if (nohd < 1) return { label: 'Minimal Hazard Zone', color: '#4CAF50' };
    if (nohd < 10) return { label: 'Moderate Hazard Zone', color: '#FF9800' };
    if (nohd < 100) return { label: 'Significant Hazard Zone', color: '#FF5722' };
    return { label: 'Extensive Hazard Zone', color: '#F44336' };
  }

  const steps: CalculationStep[] = [
    { id: 1, title: 'Wavelength', description: 'Select laser wavelength', isComplete: completedSteps.includes(1) },
    { id: 2, title: 'Power', description: 'Enter output power', isComplete: completedSteps.includes(2) },
    { id: 3, title: 'Divergence', description: 'Set beam divergence', isComplete: completedSteps.includes(3) },
    { id: 4, title: 'Exposure Time', description: 'Choose exposure duration', isComplete: completedSteps.includes(4) },
    { id: 5, title: 'Results', description: 'View calculated NOHD', isComplete: completedSteps.includes(5) },
  ];

  const hints = [
    "Check the formula for your wavelength region",
    "MPE depends on both wavelength and exposure time",
    "Convert all units consistently before calculating",
  ];

  return (
    <div className="nohd-calculator">
      <div className="calculator-header">
        <h2>NOHD Calculator</h2>
        <p className="subtitle">Nominal Ocular Hazard Distance Calculator</p>
      </div>

      {/* Progress Steps */}
      <div className="step-indicator">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={`step ${currentStep === step.id ? 'active' : ''} ${step.isComplete ? 'complete' : ''}`}
            onClick={() => setCurrentStep(step.id)}
          >
            <div className="step-number">{step.isComplete ? '✓' : step.id}</div>
            <div className="step-label">{step.title}</div>
          </div>
        ))}
      </div>

      <div className="calculator-body">
        {/* Left Panel: Inputs */}
        <div className="input-panel">
          {/* Step 1: Wavelength */}
          {currentStep === 1 && (
            <div className="step-content">
              <h3>Step 1: Select Wavelength</h3>
              <p className="step-description">
                Choose your laser wavelength to determine the correct MPE formula.
              </p>
              
              <div className="wavelength-selector">
                <label>Laser Wavelength</label>
                <select
                  value={wavelength}
                  onChange={(e) => {
                    setWavelength(Number(e.target.value));
                    setCompletedSteps([...completedSteps, 1]);
                  }}
                >
                  {WAVELENGTH_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                
                <div className="spectrum-bar">
                  <div 
                    className="wavelength-marker"
                    style={{ 
                      left: `${((wavelength - 300) / 1300) * 100}%`,
                      backgroundColor: WAVELENGTH_OPTIONS.find(w => w.value === wavelength)?.color || '#666'
                    }}
                  />
                </div>
                <div className="spectrum-labels">
                  <span>UV</span>
                  <span>Visible</span>
                  <span>IR</span>
                </div>
              </div>

              <div className="info-box">
                <strong>Selected:</strong> {wavelength} nm
                <br />
                <strong>Region:</strong> {WAVELENGTH_OPTIONS.find(w => w.value === wavelength)?.region === 'visible' ? 'Visible (400-700nm)' : 'Non-visible'}
              </div>

              <button 
                className="btn-next"
                onClick={() => setCurrentStep(2)}
              >
                Continue to Power →
              </button>
            </div>
          )}

          {/* Step 2: Power */}
          {currentStep === 2 && (
            <div className="step-content">
              <h3>Step 2: Enter Laser Power</h3>
              <p className="step-description">
                Enter the output power of your laser.
              </p>

              <div className="power-input">
                <div className="input-group">
                  <label>Power Value</label>
                  <input
                    type="number"
                    value={power}
                    onChange={(e) => {
                      setPower(Number(e.target.value));
                      setCompletedSteps([...new Set([...completedSteps, 2])]);
                    }}
                    min="0.001"
                    step="0.1"
                  />
                </div>
                <div className="unit-selector">
                  <label>Unit</label>
                  <select
                    value={powerUnit}
                    onChange={(e) => setPowerUnit(e.target.value as 'mW' | 'W')}
                  >
                    <option value="mW">mW</option>
                    <option value="W">W</option>
                  </select>
                </div>
              </div>

              <div className="preset-buttons">
                <span>Quick select:</span>
                {[1, 5, 10, 50, 100].map((p) => (
                  <button
                    key={p}
                    className="preset-btn"
                    onClick={() => {
                      setPower(p);
                      setPowerUnit('W');
                      setCompletedSteps([...new Set([...completedSteps, 2])]);
                    }}
                  >
                    {p}W
                  </button>
                ))}
              </div>

              <div className="navigation-buttons">
                <button className="btn-prev" onClick={() => setCurrentStep(1)}>← Back</button>
                <button className="btn-next" onClick={() => setCurrentStep(3)}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 3: Divergence */}
          {currentStep === 3 && (
            <div className="step-content">
              <h3>Step 3: Beam Divergence</h3>
              <p className="step-description">
                Enter the full-angle beam divergence in milliradians (mrad).
              </p>

              <div className="divergence-input">
                <label>Divergence (mrad)</label>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.1"
                  value={divergence}
                  onChange={(e) => {
                    setDivergence(Number(e.target.value));
                    setCompletedSteps([...new Set([...completedSteps, 3])]);
                  }}
                />
                <div className="range-value">{divergence} mrad</div>
              </div>

              <div className="preset-buttons">
                <span>Typical values:</span>
                {[0.5, 1.0, 1.5, 3.0, 5.0].map((d) => (
                  <button
                    key={d}
                    className={`preset-btn ${divergence === d ? 'active' : ''}`}
                    onClick={() => {
                      setDivergence(d);
                      setCompletedSteps([...new Set([...completedSteps, 3])]);
                    }}
                  >
                    {d} mrad
                  </button>
                ))}
              </div>

              <div className="info-box">
                <strong>Tip:</strong> Lower divergence = longer NOHD. 
                A tightly focused beam travels farther before becoming safe.
              </div>

              <div className="navigation-buttons">
                <button className="btn-prev" onClick={() => setCurrentStep(2)}>← Back</button>
                <button className="btn-next" onClick={() => setCurrentStep(4)}>Continue →</button>
              </div>
            </div>
          )}

          {/* Step 4: Exposure Time */}
          {currentStep === 4 && (
            <div className="step-content">
              <h3>Step 4: Exposure Time</h3>
              <p className="step-description">
                Select the maximum expected exposure duration.
              </p>

              <div className="exposure-selector">
                {[
                  { value: 0.000001, label: '1 μs (accidental)' },
                  { value: 0.25, label: '0.25 s (blink reflex)' },
                  { value: 10, label: '10 s (intentional)' },
                  { value: 300, label: '5 min (extended)' },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    className={`exposure-btn ${exposureTime === opt.value ? 'active' : ''}`}
                    onClick={() => {
                      setExposureTime(opt.value);
                      setCompletedSteps([...new Set([...completedSteps, 4])]);
                    }}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              <div className="info-box warning">
                <strong>Safety Note:</strong> For audience scanning, use 10s minimum.
                For trained personnel during setup, 0.25s (blink reflex) may be used.
              </div>

              <div className="navigation-buttons">
                <button className="btn-prev" onClick={() => setCurrentStep(3)}>← Back</button>
                <button 
                  className="btn-next btn-primary"
                  onClick={() => setCurrentStep(5)}
                >
                  Calculate NOHD →
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Results */}
          {currentStep === 5 && (
            <div className="step-content results">
              <h3>Step 5: Calculation Results</h3>
              
              <div className="formula-display">
                <h4>Formula Used:</h4>
                <div className="formula">
                  NOHD = (1/θ) × √(1.27 × P / MPE)
                </div>
                <div className="formula-values">
                  NOHD = (1/{divergence}×10⁻³) × √(1.27 × {powerUnit === 'mW' ? power/1000 : power} / {calculatedValues.mpe.toFixed(2)}×10)
                </div>
              </div>

              <div className="result-cards">
                <div className="result-card primary">
                  <div className="result-label">NOHD (Nominal Ocular Hazard Distance)</div>
                  <div className="result-value" style={{ color: calculatedValues.safetyCategory.color }}>
                    {calculatedValues.nohd.toFixed(1)} m
                  </div>
                  <div className="result-alt">
                    {(calculatedValues.nohd * 3.28084).toFixed(1)} ft
                  </div>
                </div>

                <div className="result-card">
                  <div className="result-label">MPE (Maximum Permissible Exposure)</div>
                  <div className="result-value">
                    {calculatedValues.mpe.toFixed(2)} mW/cm²
                  </div>
                </div>

                <div className="result-card">
                  <div className="result-label">Beam Diameter at NOHD</div>
                  <div className="result-value">
                    {calculatedValues.beamDiameterAtNOHD.toFixed(1)} mm
                  </div>
                </div>
              </div>

              <div 
                className="safety-category"
                style={{ borderLeftColor: calculatedValues.safetyCategory.color }}
              >
                <strong>Safety Classification:</strong>
                <span style={{ color: calculatedValues.safetyCategory.color }}>
                  {' '}{calculatedValues.safetyCategory.label}
                </span>
              </div>

              <div className="navigation-buttons">
                <button className="btn-prev" onClick={() => setCurrentStep(4)}>← Back</button>
                <button className="btn-primary" onClick={() => setCurrentStep(1)}>
                  New Calculation
                </button>
              </div>
            </div>
          )}

          {/* Hint System */}
          <div className="hint-section">
            <button 
              className="hint-toggle"
              onClick={() => setShowHint(showHint ? null : currentStep)}
            >
              {showHint ? 'Hide Hints' : '💡 Need a Hint?'}
            </button>
            
            {showHint === currentStep && (
              <div className="hint-content">
                {hints.map((hint, index) => (
                  <div key={index} className="hint-item">
                    <span className="hint-level">{'⭐'.repeat(index + 1)}</span>
                    <span className="hint-text">{hint}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Visualization */}
        <div className="visualization-panel">
          <h3>Beam Visualization</h3>
          
          <div className="beam-diagram">
            <svg viewBox="0 0 400 300" className="beam-svg">
              {/* Grid lines */}
              {[0, 50, 100, 150, 200, 250, 300, 350, 400].map((x) => (
                <line key={`grid-${x}`} x1={x} y1="0" x2={x} y2="300" stroke="#eee" strokeWidth="0.5" />
              ))}

              {/* Distance markers */}
              {[0, 1, 2, 3].map((d) => (
                <text key={`dist-${d}`} x={100 * d + 10} y="290" fill="#999" fontSize="10">
                  {Math.round(calculatedValues.nohd * d / 3)}m
                </text>
              ))}

              {/* Beam outline */}
              <polygon
                points="10,150 400,50 400,250"
                fill={calculatedValues.safetyCategory.color}
                fillOpacity="0.1"
                stroke={calculatedValues.safetyCategory.color}
                strokeWidth="2"
              />

              {/* NOHD line */}
              <line
                x1={10 + (calculatedValues.nohd / Math.max(calculatedValues.nohd, 100)) * 350}
                y1="0"
                x2={10 + (calculatedValues.nohd / Math.max(calculatedValues.nohd, 100)) * 350}
                y2="300"
                stroke="#333"
                strokeWidth="2"
                strokeDasharray="5,5"
              />
              <text
                x={10 + (calculatedValues.nohd / Math.max(calculatedValues.nohd, 100)) * 350 - 30}
                y="20"
                fill="#333"
                fontSize="12"
                fontWeight="bold"
              >
                NOHD
              </text>

              {/* Laser source */}
              <circle cx="10" cy="150" r="8" fill={WAVELENGTH_OPTIONS.find(w => w.value === wavelength)?.color || '#666'} />
              <text x="10" y="180" fill="#666" fontSize="10" textAnchor="middle">Laser</text>

              {/* Safety zones */}
              <text x="50" y="20" fill="#F44336" fontSize="11" fontWeight="bold">HAZARD ZONE</text>
              <text x="250" y="20" fill="#4CAF50" fontSize="11" fontWeight="bold">SAFE ZONE</text>
            </svg>
          </div>

          <div className="visualization-legend">
            <div className="legend-item">
              <span className="legend-color" style={{ background: WAVELENGTH_OPTIONS.find(w => w.value === wavelength)?.color }} />
              <span>Laser Source ({wavelength}nm)</span>
            </div>
            <div className="legend-item">
              <span className="legend-color" style={{ background: calculatedValues.safetyCategory.color, opacity: 0.3 }} />
              <span>Beam Profile</span>
            </div>
            <div className="legend-item">
              <span className="legend-line dashed" />
              <span>NOHD Boundary</span>
            </div>
          </div>

          <div className="safety-notes">
            <h4>Safety Requirements Inside NOHD:</h4>
            <ul>
              <li>✓ Laser safety eyewear required</li>
              <li>✓ Controlled access only</li>
              <li>✓ Warning signs posted</li>
              <li>✓ Interlocks on entryways</li>
              <li>✓ LSO supervision required</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NOHDCalculator;
