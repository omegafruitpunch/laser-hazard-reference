/**
 * Module 2.2: Laser Product Classification (FDA) - Interaction Components
 * 
 * Interactive components with animations and states:
 * - Classification Pyramid with animated levels
 * - AEL Calculator with real-time computation
 * - Classification Wizard with decision tree
 * - Requirements Matrix with comparison toggles
 * - Drag-and-drop exercise for requirements matching
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Layers, Zap, Calculator, CheckCircle, AlertTriangle, 
  ChevronRight, ChevronDown, Info, RefreshCw, Target,
  Shield, Eye, Settings, Bell, Lock, Unlock, 
  Thermometer, Sun, X, ArrowRight, Award
} from 'lucide-react';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.9 }
};

const pyramidLevel = {
  initial: { opacity: 0, y: 50, scale: 0.8 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -30, scale: 0.9 }
};

// ============================================================================
// DATA: FDA LASER CLASSES
// ============================================================================

interface LaserClass {
  id: string;
  name: string;
  displayName: string;
  color: string;
  gradient: string;
  powerLimit: string;
  description: string;
  hazardLevel: number;
  examples: string[];
  requirements: {
    protectiveHousing: boolean;
    safetyInterlock: 'required' | 'conditional' | 'none';
    failSafeInterlock: boolean;
    remoteInterlock: boolean;
    keyControl: boolean;
    emissionIndicator: boolean;
    emissionDelay: boolean;
    beamAttenuator: boolean;
    manualReset: boolean;
    warningLogotype: 'none' | 'caution' | 'danger';
    apertureLabel: boolean;
  };
  warningText: string;
}

const FDA_LASER_CLASSES: LaserClass[] = [
  {
    id: 'class_I',
    name: 'Class I',
    displayName: 'Class I',
    color: '#22c55e',
    gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
    powerLimit: 'Cannot exceed Class I AEL',
    description: 'Inherently safe or fully enclosed - negligible hazard during operation',
    hazardLevel: 1,
    examples: ['CD/DVD players', 'Laser printers', 'Fully enclosed industrial systems'],
    requirements: {
      protectiveHousing: true,
      safetyInterlock: 'conditional',
      failSafeInterlock: false,
      remoteInterlock: false,
      keyControl: false,
      emissionIndicator: false,
      emissionDelay: false,
      beamAttenuator: false,
      manualReset: false,
      warningLogotype: 'none',
      apertureLabel: false
    },
    warningText: 'No warning required'
  },
  {
    id: 'class_IIa',
    name: 'Class IIa',
    displayName: 'Class IIa',
    color: '#84cc16',
    gradient: 'linear-gradient(135deg, #84cc16, #65a30d)',
    powerLimit: 'Visible only, time limits apply',
    description: 'Visible lasers not intended for prolonged viewing - low hazard',
    hazardLevel: 2,
    examples: ['Some alignment lasers', 'Specific industrial applications'],
    requirements: {
      protectiveHousing: true,
      safetyInterlock: 'conditional',
      failSafeInterlock: false,
      remoteInterlock: false,
      keyControl: false,
      emissionIndicator: false,
      emissionDelay: false,
      beamAttenuator: false,
      manualReset: false,
      warningLogotype: 'none',
      apertureLabel: false
    },
    warningText: 'Statement only - not full logotype'
  },
  {
    id: 'class_II',
    name: 'Class II',
    displayName: 'Class II',
    color: '#eab308',
    gradient: 'linear-gradient(135deg, #eab308, #ca8a04)',
    powerLimit: '< 1 mW continuous visible',
    description: 'Visible lasers relying on blink reflex protection',
    hazardLevel: 3,
    examples: ['Laser pointers (<1mW)', 'Barcode scanners', 'Alignment lasers'],
    requirements: {
      protectiveHousing: true,
      safetyInterlock: 'conditional',
      failSafeInterlock: false,
      remoteInterlock: false,
      keyControl: false,
      emissionIndicator: true,
      emissionDelay: false,
      beamAttenuator: true,
      manualReset: false,
      warningLogotype: 'caution',
      apertureLabel: true
    },
    warningText: 'CAUTION - LASER RADIATION - DO NOT STARE INTO BEAM'
  },
  {
    id: 'class_IIIa',
    name: 'Class IIIa',
    displayName: 'Class IIIa',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #ea580c)',
    powerLimit: '1-5 mW visible',
    description: 'Hazardous with intentional viewing - immediate eye hazard',
    hazardLevel: 4,
    examples: ['Higher power laser pointers', 'Some HeNe lasers', 'Laser levels'],
    requirements: {
      protectiveHousing: true,
      safetyInterlock: 'conditional',
      failSafeInterlock: false,
      remoteInterlock: false,
      keyControl: false,
      emissionIndicator: true,
      emissionDelay: false,
      beamAttenuator: true,
      manualReset: false,
      warningLogotype: 'caution',
      apertureLabel: true
    },
    warningText: 'CAUTION or DANGER based on irradiance'
  },
  {
    id: 'class_IIIb',
    name: 'Class IIIb',
    displayName: 'Class IIIb',
    color: '#f97316',
    gradient: 'linear-gradient(135deg, #f97316, #dc2626)',
    powerLimit: '5-500 mW visible',
    description: 'Direct viewing hazard - immediate and serious eye injury possible',
    hazardLevel: 5,
    examples: ['Industrial lasers', 'Research lasers', 'Medical therapy lasers'],
    requirements: {
      protectiveHousing: true,
      safetyInterlock: 'required',
      failSafeInterlock: true,
      remoteInterlock: true,
      keyControl: true,
      emissionIndicator: true,
      emissionDelay: true,
      beamAttenuator: true,
      manualReset: false,
      warningLogotype: 'danger',
      apertureLabel: true
    },
    warningText: 'DANGER - LASER RADIATION - AVOID DIRECT EYE EXPOSURE'
  },
  {
    id: 'class_IV',
    name: 'Class IV',
    displayName: 'Class IV',
    color: '#dc2626',
    gradient: 'linear-gradient(135deg, #dc2626, #b91c1c)',
    powerLimit: '> 500 mW visible',
    description: 'Highest hazard - diffuse reflection can injure, fire hazard',
    hazardLevel: 6,
    examples: ['Surgical lasers', 'Industrial cutting/welding', 'High-power research lasers'],
    requirements: {
      protectiveHousing: true,
      safetyInterlock: 'required',
      failSafeInterlock: true,
      remoteInterlock: true,
      keyControl: true,
      emissionIndicator: true,
      emissionDelay: true,
      beamAttenuator: true,
      manualReset: true,
      warningLogotype: 'danger',
      apertureLabel: true
    },
    warningText: 'DANGER - LASER RADIATION - AVOID EYE OR SKIN EXPOSURE'
  }
];

// ============================================================================
// COMPONENT: CLASSIFICATION PYRAMID
// ============================================================================

export const ClassificationPyramid: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<LaserClass | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Layers size={28} />
          FDA Laser Class Pyramid
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Click on any level to explore the characteristics and requirements of each FDA laser class
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '32px' }}>
        {/* Pyramid visualization */}
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center',
          gap: '8px',
          padding: '24px'
        }}>
          {[...FDA_LASER_CLASSES].reverse().map((laserClass, index) => {
            const isHovered = hoveredClass === laserClass.id;
            const isSelected = selectedClass?.id === laserClass.id;
            const width = 100 - (index * 12);

            return (
              <motion.div
                key={laserClass.id}
                variants={pyramidLevel}
                initial="initial"
                animate="animate"
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05, zIndex: 10 }}
                onClick={() => setSelectedClass(laserClass)}
                onMouseEnter={() => setHoveredClass(laserClass.id)}
                onMouseLeave={() => setHoveredClass(null)}
                style={{
                  width: `${width}%`,
                  minHeight: '64px',
                  background: isSelected || isHovered ? laserClass.gradient : laserClass.color,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  boxShadow: isSelected 
                    ? `0 0 0 4px white, 0 0 0 8px ${laserClass.color}, 0 20px 40px rgba(0,0,0,0.2)`
                    : isHovered
                      ? `0 10px 30px ${laserClass.color}40`
                      : `0 4px 12px ${laserClass.color}30`,
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                <span style={{
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '18px',
                  textShadow: '0 2px 4px rgba(0,0,0,0.2)'
                }}>
                  {laserClass.displayName}
                </span>

                {/* Hazard indicator dots */}
                <div style={{
                  position: 'absolute',
                  right: '16px',
                  display: 'flex',
                  gap: '4px'
                }}>
                  {Array.from({ length: laserClass.hazardLevel }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1 + i * 0.05 }}
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: 'white',
                        opacity: 0.8
                      }}
                    />
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Details panel */}
        <div>
          <AnimatePresence mode="wait">
            {selectedClass ? (
              <motion.div
                key={selectedClass.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: `0 4px 20px ${selectedClass.color}20`,
                  border: `2px solid ${selectedClass.color}40`
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  marginBottom: '16px'
                }}>
                  <div style={{
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    background: selectedClass.gradient,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: 700,
                    fontSize: '14px'
                  }}>
                    {selectedClass.displayName}
                  </div>
                  <div>
                    <h3 style={{ margin: 0 }}>{selectedClass.name}</h3>
                    <p style={{ margin: '4px 0 0 0', fontSize: '13px', color: '#6b7280' }}>
                      {selectedClass.powerLimit}
                    </p>
                  </div>
                </div>

                <p style={{ color: '#374151', marginBottom: '16px', lineHeight: 1.6 }}>
                  {selectedClass.description}
                </p>

                {/* Examples */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{ fontSize: '13px', color: '#6b7280', marginBottom: '8px' }}>
                    Common Examples
                  </h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {selectedClass.examples.map((example, i) => (
                      <span
                        key={i}
                        style={{
                          padding: '6px 12px',
                          background: '#f3f4f6',
                          borderRadius: '16px',
                          fontSize: '13px',
                          color: '#374151'
                        }}
                      >
                        {example}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Warning text */}
                {selectedClass.warningLogotype !== 'none' && (
                  <div style={{
                    padding: '12px 16px',
                    background: selectedClass.warningLogotype === 'danger' ? '#fef2f2' : '#fefce8',
                    borderRadius: '8px',
                    borderLeft: `4px solid ${selectedClass.warningLogotype === 'danger' ? '#dc2626' : '#eab308'}`,
                    marginBottom: '16px'
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '4px',
                      fontWeight: 600,
                      color: selectedClass.warningLogotype === 'danger' ? '#991b1b' : '#854d0e',
                      textTransform: 'uppercase',
                      fontSize: '12px',
                      letterSpacing: '0.05em'
                    }}>
                      <AlertTriangle size={14} />
                      {selectedClass.warningLogotype} Label Required
                    </div>
                    <p style={{ margin: 0, fontSize: '13px', color: '#374151' }}>
                      {selectedClass.warningText}
                    </p>
                  </div>
                )}

                {/* Requirements summary */}
                <div>
                  <h4 style={{ fontSize: '13px', color: '#6b7280', marginBottom: '12px' }}>
                    Key Requirements
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {Object.entries(selectedClass.requirements)
                      .filter(([_, value]) => value !== false && value !== 'none')
                      .map(([key, value]) => (
                        <div
                          key={key}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '8px 12px',
                            background: '#f9fafb',
                            borderRadius: '8px',
                            fontSize: '13px'
                          }}
                        >
                          <CheckCircle size={14} color={selectedClass.color} />
                          <span style={{ textTransform: 'capitalize' }}>
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                          {value === true && (
                            <span style={{ marginLeft: 'auto', color: '#10b981', fontWeight: 500 }}>
                              Required
                            </span>
                          )}
                        </div>
                      ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#f9fafb',
                  borderRadius: '16px',
                  padding: '48px',
                  textAlign: 'center',
                  border: '2px dashed #e5e7eb'
                }}
              >
                <Layers size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
                <p style={{ margin: 0, color: '#6b7280' }}>
                  Click on a class level to view details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: AEL CALCULATOR
// ============================================================================

interface AELInputs {
  wavelength: number;
  duration: number;
  beamDiameter: number;
}

export const AELCalculator: React.FC = () => {
  const [inputs, setInputs] = useState<AELInputs>({
    wavelength: 632.8,
    duration: 0.25,
    beamDiameter: 7
  });
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [showResults, setShowResults] = useState(false);

  // Calculate Class I AEL based on wavelength and duration
  const calculateAEL = useMemo(() => {
    const { wavelength, duration, beamDiameter } = inputs;
    
    // Simplified AEL calculation for educational purposes
    // Real AEL calculations are more complex and depend on wavelength region
    
    let mpe = 0; // Maximum Permissible Exposure in mW/cm²
    
    if (wavelength >= 400 && wavelength <= 700) {
      // Visible region
      if (duration <= 0.25) {
        mpe = 1.8 * Math.pow(duration, 0.75);
      } else {
        mpe = 1.0; // 1 mW/cm² for long exposures
      }
    } else if (wavelength >= 700 && wavelength <= 1400) {
      // IR-A (retinal hazard)
      mpe = 1.8 * Math.pow(duration, 0.75) * 1.5; // C-A factor
    } else if (wavelength > 1400) {
      // Far IR (corneal hazard)
      mpe = 100; // Much higher limits
    } else {
      // UV
      mpe = 1.0;
    }
    
    const apertureArea = Math.PI * Math.pow(beamDiameter / 2, 2) / 100; // in cm²
    const classIAEL = mpe * apertureArea;
    const classIIAEL = 1.0; // 1 mW for visible
    const classIIIaAEL = 5.0; // 5 mW for visible
    
    return {
      mpe: mpe.toFixed(3),
      apertureArea: apertureArea.toFixed(3),
      classI: classIAEL.toFixed(3),
      classII: classIIAEL.toFixed(1),
      classIIIa: classIIIaAEL.toFixed(1),
      wavelengthRegion: wavelength >= 400 && wavelength <= 700 ? 'Visible' :
                       wavelength >= 700 && wavelength <= 1400 ? 'IR-A (Retinal)' :
                       wavelength > 1400 ? 'Far IR (Corneal)' : 'UV'
    };
  }, [inputs]);

  const handleCalculate = async () => {
    setIsCalculating(true);
    // Simulate calculation delay
    await new Promise(resolve => setTimeout(resolve, 800));
    setIsCalculating(false);
    setShowResults(true);
  };

  const getWavelengthColor = (nm: number): string => {
    if (nm < 400) return '#8b5cf6';
    if (nm < 450) return '#6366f1';
    if (nm < 495) return '#06b6d4';
    if (nm < 570) return '#22c55e';
    if (nm < 590) return '#eab308';
    if (nm < 620) return '#f97316';
    if (nm <= 700) return '#ef4444';
    return '#78716c';
  };

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Calculator size={28} />
          Accessible Emission Limit (AEL) Calculator
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Calculate AELs based on wavelength, exposure duration, and measurement parameters
        </p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Input panel */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Input Parameters</h3>

          {/* Wavelength input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              fontSize: '14px'
            }}>
              Wavelength (nm)
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="range"
                min="180"
                max="10000"
                value={inputs.wavelength}
                onChange={(e) => setInputs(prev => ({ ...prev, wavelength: Number(e.target.value) }))}
                style={{
                  width: '100%',
                  marginBottom: '12px',
                  accentColor: getWavelengthColor(inputs.wavelength)
                }}
              />
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <input
                  type="number"
                  value={inputs.wavelength}
                  onChange={(e) => setInputs(prev => ({ ...prev, wavelength: Number(e.target.value) }))}
                  onFocus={() => setFocusedField('wavelength')}
                  onBlur={() => setFocusedField(null)}
                  style={{
                    flex: 1,
                    padding: '12px 16px',
                    borderRadius: '10px',
                    border: focusedField === 'wavelength' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                    fontSize: '15px',
                    outline: 'none',
                    boxShadow: focusedField === 'wavelength' ? '0 0 0 4px rgba(59, 130, 246, 0.15)' : 'none',
                    transition: 'all 0.2s ease'
                  }}
                />
                <div style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '8px',
                  background: getWavelengthColor(inputs.wavelength),
                  boxShadow: '0 4px 12px rgba(0,0,0,0.15)'
                }} />
              </div>
            </div>
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
              {calculateAEL.wavelengthRegion} region
            </p>
          </div>

          {/* Duration input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              fontSize: '14px'
            }}>
              Exposure Duration (seconds)
            </label>
            <select
              value={inputs.duration}
              onChange={(e) => setInputs(prev => ({ ...prev, duration: Number(e.target.value) }))}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '10px',
                border: '2px solid #e5e7eb',
                fontSize: '15px',
                outline: 'none',
                cursor: 'pointer',
                minHeight: '48px'
              }}
            >
              <option value={0.000000001}>Single pulse (1 ns)</option>
              <option value={0.00000002}>Q-switched pulse (20 ns)</option>
              <option value={0.000001}>Microsecond pulse (1 μs)</option>
              <option value={0.001}>Millisecond pulse (1 ms)</option>
              <option value={0.25}>Blink reflex time (0.25 s)</option>
              <option value={10}>Short term exposure (10 s)</option>
              <option value={100}>Long term exposure (100 s)</option>
              <option value={30000}>Extended exposure (8 hours)</option>
            </select>
          </div>

          {/* Beam diameter */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ 
              display: 'block', 
              marginBottom: '8px', 
              fontWeight: 600,
              fontSize: '14px'
            }}>
              Beam Diameter at Aperture (mm)
            </label>
            <input
              type="number"
              value={inputs.beamDiameter}
              onChange={(e) => setInputs(prev => ({ ...prev, beamDiameter: Number(e.target.value) }))}
              onFocus={() => setFocusedField('diameter')}
              onBlur={() => setFocusedField(null)}
              style={{
                width: '100%',
                padding: '14px 16px',
                borderRadius: '10px',
                border: focusedField === 'diameter' ? '2px solid #3b82f6' : '2px solid #e5e7eb',
                fontSize: '15px',
                outline: 'none',
                boxShadow: focusedField === 'diameter' ? '0 0 0 4px rgba(59, 130, 246, 0.15)' : 'none',
                transition: 'all 0.2s ease',
                minHeight: '48px'
              }}
            />
            <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '8px' }}>
              FDA standard aperture is 7mm (simulating dilated pupil)
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(59, 130, 246, 0.35)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCalculate}
            disabled={isCalculating}
            style={{
              width: '100%',
              padding: '16px',
              background: isCalculating ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isCalculating ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '56px'
            }}
          >
            {isCalculating ? (
              <>
                <RefreshCw size={20} className="animate-spin" />
                Calculating...
              </>
            ) : (
              <>
                <Calculator size={20} />
                Calculate AEL
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Results panel */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          style={{
            background: '#f9fafb',
            borderRadius: '16px',
            padding: '24px'
          }}
        >
          <h3 style={{ marginBottom: '20px' }}>Calculation Results</h3>

          <AnimatePresence>
            {showResults ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                {/* Intermediate calculations */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    Intermediate Values
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#ffffff',
                      borderRadius: '8px'
                    }}>
                      <span>MPE</span>
                      <span style={{ fontWeight: 600 }}>{calculateAEL.mpe} mW/cm²</span>
                    </div>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      padding: '12px 16px',
                      background: '#ffffff',
                      borderRadius: '8px'
                    }}>
                      <span>Aperture Area</span>
                      <span style={{ fontWeight: 600 }}>{calculateAEL.apertureArea} cm²</span>
                    </div>
                  </div>
                </div>

                {/* AEL Results */}
                <div>
                  <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    Accessible Emission Limits
                  </h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                      { name: 'Class I', value: calculateAEL.classI, color: '#22c55e' },
                      { name: 'Class II', value: calculateAEL.classII, color: '#eab308' },
                      { name: 'Class IIIa', value: calculateAEL.classIIIa, color: '#f97316' }
                    ].map((result, index) => (
                      <motion.div
                        key={result.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        style={{
                          padding: '16px',
                          background: '#ffffff',
                          borderRadius: '12px',
                          borderLeft: `4px solid ${result.color}`,
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <span style={{ fontWeight: 600 }}>{result.name} AEL</span>
                        <span style={{ 
                          fontSize: '20px', 
                          fontWeight: 700,
                          color: result.color
                        }}>
                          {result.value} mW
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div style={{
                  marginTop: '24px',
                  padding: '16px',
                  background: '#eff6ff',
                  borderRadius: '12px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>
                    <Info size={14} style={{ display: 'inline', marginRight: '6px' }} />
                    These calculations are for educational purposes. Real AEL calculations 
                    require careful consideration of all measurement parameters per 21 CFR 1040.10(e).
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  textAlign: 'center',
                  padding: '48px 24px',
                  color: '#9ca3af'
                }}
              >
                <Calculator size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
                <p>Enter parameters and click Calculate to see AEL results</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: CLASSIFICATION WIZARD
// ============================================================================

interface ClassificationStep {
  id: string;
  title: string;
  question: string;
  options: {
    label: string;
    value: string;
    nextStep?: string;
    classification?: string;
  }[];
}

const CLASSIFICATION_STEPS: Record<string, ClassificationStep> = {
  start: {
    id: 'start',
    title: 'Wavelength',
    question: 'What is the wavelength of your laser?',
    options: [
      { label: 'UV (180-400 nm)', value: 'uv', nextStep: 'uv_duration' },
      { label: 'Visible (400-710 nm)', value: 'visible', nextStep: 'visible_duration' },
      { label: 'IR-A (710-1400 nm)', value: 'ira', nextStep: 'ira_duration' },
      { label: 'IR-B/C (1400+ nm)', value: 'irbc', nextStep: 'irbc_duration' }
    ]
  },
  visible_duration: {
    id: 'visible_duration',
    title: 'Exposure Duration',
    question: 'What is the exposure duration?',
    options: [
      { label: '≤ 0.25 seconds (blink reflex)', value: 'short', nextStep: 'visible_power_short' },
      { label: '> 0.25 seconds', value: 'long', nextStep: 'visible_power_long' }
    ]
  },
  visible_power_long: {
    id: 'visible_power_long',
    title: 'Power Level',
    question: 'What is the power level?',
    options: [
      { label: '≤ 1 mW', value: 'class2', classification: 'Class II' },
      { label: '1-5 mW', value: 'class3a', classification: 'Class IIIa' },
      { label: '5-500 mW', value: 'class3b', classification: 'Class IIIb' },
      { label: '> 500 mW', value: 'class4', classification: 'Class IV' }
    ]
  },
  visible_power_short: {
    id: 'visible_power_short',
    title: 'Power Level',
    question: 'What is the power level?',
    options: [
      { label: 'Check against Class I AEL tables', value: 'class1', classification: 'Class I or higher based on AEL' }
    ]
  },
  ira_duration: {
    id: 'ira_duration',
    title: 'Exposure Duration',
    question: 'What is the exposure duration?',
    options: [
      { label: 'Check against IR-A AEL tables', value: 'check', classification: 'Depends on specific AEL calculations' }
    ]
  },
  uv_duration: {
    id: 'uv_duration',
    title: 'Exposure Duration',
    question: 'What is the exposure duration?',
    options: [
      { label: 'Check against UV AEL tables', value: 'check', classification: 'Depends on specific AEL calculations' }
    ]
  },
  irbc_duration: {
    id: 'irbc_duration',
    title: 'Exposure Duration',
    question: 'What is the exposure duration?',
    options: [
      { label: 'Check against IR-B/C AEL tables', value: 'check', classification: 'Depends on specific AEL calculations' }
    ]
  }
};

export const ClassificationWizard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<string | null>(null);

  const step = CLASSIFICATION_STEPS[currentStep];

  const handleOptionSelect = (option: ClassificationStep['options'][0]) => {
    if (option.classification) {
      setResult(option.classification);
    } else if (option.nextStep) {
      setHistory([...history, currentStep]);
      setCurrentStep(option.nextStep);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const previousStep = newHistory.pop()!;
      setHistory(newHistory);
      setCurrentStep(previousStep);
      setResult(null);
    }
  };

  const handleReset = () => {
    setCurrentStep('start');
    setHistory([]);
    setResult(null);
  };

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Target size={28} />
          Classification Wizard
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Answer a few questions to determine the FDA classification for your laser product
        </p>
      </motion.div>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            {/* Progress */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '12px'
              }}>
                {history.map((_, i) => (
                  <React.Fragment key={i}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircle size={14} color="white" />
                    </div>
                    <div style={{ width: '20px', height: '2px', background: '#10b981' }} />
                  </React.Fragment>
                ))}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600
                }}>
                  {history.length + 1}
                </div>
              </div>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                Step {history.length + 1} of classification process
              </span>
            </div>

            <h3 style={{ marginBottom: '8px' }}>{step.title}</h3>
            <p style={{ fontSize: '18px', color: '#374151', marginBottom: '24px' }}>
              {step.question}
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {step.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionSelect(option)}
                  whileHover={{ scale: 1.02, backgroundColor: '#eff6ff', borderColor: '#3b82f6' }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '18px 24px',
                    textAlign: 'left',
                    background: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '56px'
                  }}
                >
                  <span>{option.label}</span>
                  <ChevronRight size={20} color="#9ca3af" />
                </motion.button>
              ))}
            </div>

            {history.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: '20px',
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minHeight: '44px'
                }}
              >
                <ChevronRight size={18} style={{ transform: 'rotate(180deg)' }} />
                Back
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            style={{
              background: '#ecfdf5',
              borderRadius: '16px',
              padding: '32px',
              border: '2px solid #10b981',
              textAlign: 'center'
            }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 15 }}
              style={{
                width: '80px',
                height: '80px',
                background: '#10b981',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px'
              }}
            >
              <Award size={40} color="white" />
            </motion.div>

            <h3 style={{ margin: '0 0 8px 0', color: '#065f46' }}>
              Classification Result
            </h3>
            <p style={{ 
              fontSize: '28px', 
              fontWeight: 700, 
              color: '#10b981',
              marginBottom: '24px'
            }}>
              {result}
            </p>

            <p style={{ color: '#059669', marginBottom: '24px' }}>
              This is a preliminary assessment. Always verify with complete AEL calculations 
              and consult 21 CFR 1040.10 for definitive classification.
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              style={{
                padding: '14px 24px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '15px',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                minHeight: '48px'
              }}
            >
              <RefreshCw size={18} />
              Start Over
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPONENT: REQUIREMENTS MATRIX
// ============================================================================

export const RequirementsMatrix: React.FC = () => {
  const [selectedClasses, setSelectedClasses] = useState<string[]>(['class_II', 'class_IIIb']);
  const [hoveredCell, setHoveredCell] = useState<string | null>(null);

  const requirements = [
    { id: 'protectiveHousing', name: 'Protective Housing', icon: Shield },
    { id: 'safetyInterlock', name: 'Safety Interlock', icon: Lock },
    { id: 'failSafeInterlock', name: 'Fail-Safe Interlock', icon: Shield },
    { id: 'remoteInterlock', name: 'Remote Interlock', icon: Settings },
    { id: 'keyControl', name: 'Key Control', icon: Lock },
    { id: 'emissionIndicator', name: 'Emission Indicator', icon: Bell },
    { id: 'beamAttenuator', name: 'Beam Attenuator', icon: Sun },
    { id: 'manualReset', name: 'Manual Reset', icon: RefreshCw },
    { id: 'warningLogotype', name: 'Warning Logotype', icon: AlertTriangle },
    { id: 'apertureLabel', name: 'Aperture Label', icon: Info }
  ];

  const toggleClass = (classId: string) => {
    setSelectedClasses(prev => 
      prev.includes(classId) 
        ? prev.filter(c => c !== classId)
        : [...prev, classId]
    );
  };

  const getRequirementValue = (laserClass: LaserClass, reqId: string): string => {
    const value = laserClass.requirements[reqId as keyof typeof laserClass.requirements];
    if (value === true) return '✓ Required';
    if (value === false) return '—';
    if (value === 'caution' || value === 'danger') return value.charAt(0).toUpperCase() + value.slice(1);
    if (value === 'conditional') return 'Conditional';
    if (value === 'required') return '✓ Required';
    return value as string;
  };

  const getCellStyle = (value: string): React.CSSProperties => {
    if (value.includes('Required') || value === '✓ Required') {
      return { background: '#ecfdf5', color: '#065f46', fontWeight: 600 };
    }
    if (value === 'Danger') {
      return { background: '#fef2f2', color: '#991b1b', fontWeight: 600 };
    }
    if (value === 'Caution') {
      return { background: '#fefce8', color: '#854d0e', fontWeight: 600 };
    }
    if (value === 'Conditional') {
      return { background: '#eff6ff', color: '#1e40af' };
    }
    return { background: '#f9fafb', color: '#9ca3af' };
  };

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Layers size={28} />
          Requirements Comparison Matrix
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Select laser classes to compare their requirements side-by-side
        </p>
      </motion.div>

      {/* Class selector */}
      <div style={{ marginBottom: '24px' }}>
        <h4 style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
          Select classes to compare:
        </h4>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {FDA_LASER_CLASSES.map(laserClass => (
            <motion.button
              key={laserClass.id}
              onClick={() => toggleClass(laserClass.id)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              style={{
                padding: '10px 16px',
                background: selectedClasses.includes(laserClass.id) ? laserClass.color : '#f3f4f6',
                color: selectedClasses.includes(laserClass.id) ? 'white' : '#374151',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
                minHeight: '44px',
                transition: 'all 0.2s ease'
              }}
            >
              {laserClass.displayName}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Comparison table */}
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ 
                padding: '16px', 
                textAlign: 'left', 
                borderBottom: '2px solid #e5e7eb',
                fontSize: '14px',
                color: '#6b7280'
              }}>
                Requirement
              </th>
              {selectedClasses.map(classId => {
                const laserClass = FDA_LASER_CLASSES.find(c => c.id === classId)!;
                return (
                  <th
                    key={classId}
                    style={{
                      padding: '16px',
                      textAlign: 'center',
                      borderBottom: `2px solid ${laserClass.color}`,
                      background: laserClass.color + '10'
                    }}
                  >
                    <div style={{
                      display: 'inline-block',
                      padding: '8px 16px',
                      background: laserClass.gradient,
                      color: 'white',
                      borderRadius: '8px',
                      fontWeight: 600
                    }}>
                      {laserClass.displayName}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {requirements.map((req, index) => (
              <motion.tr
                key={req.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                style={{ borderBottom: '1px solid #e5e7eb' }}
              >
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <req.icon size={18} color="#6b7280" />
                    <span style={{ fontWeight: 500 }}>{req.name}</span>
                  </div>
                </td>
                {selectedClasses.map(classId => {
                  const laserClass = FDA_LASER_CLASSES.find(c => c.id === classId)!;
                  const value = getRequirementValue(laserClass, req.id);
                  const cellStyle = getCellStyle(value);
                  const cellId = `${classId}-${req.id}`;

                  return (
                    <td
                      key={cellId}
                      style={{ padding: '12px' }}
                      onMouseEnter={() => setHoveredCell(cellId)}
                      onMouseLeave={() => setHoveredCell(null)}
                    >
                      <motion.div
                        animate={{
                          scale: hoveredCell === cellId ? 1.05 : 1,
                          boxShadow: hoveredCell === cellId ? '0 4px 12px rgba(0,0,0,0.1)' : 'none'
                        }}
                        transition={{ duration: 0.2 }}
                        style={{
                          padding: '12px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          ...cellStyle,
                          minHeight: '44px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {value}
                      </motion.div>
                    </td>
                  );
                })}
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default {
  ClassificationPyramid,
  AELCalculator,
  ClassificationWizard,
  RequirementsMatrix
};
