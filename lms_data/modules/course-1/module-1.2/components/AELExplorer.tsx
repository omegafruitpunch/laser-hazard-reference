import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles.module.css';
import { laserClasses, aelReference } from '../data';

interface AELCalculatorState {
  wavelength: number;
  power: number;
  isPulsed: boolean;
  pulseEnergy: number;
}

export const AELExplorer: React.FC = () => {
  const [wavelength, setWavelength] = useState(532);
  const [power, setPower] = useState(1);
  const [view, setView] = useState<'chart' | 'calculator'>('chart');

  // Simplified classification logic for demonstration
  const getClassification = (λ: number, P: number): string => {
    const isVisible = λ >= 400 && λ <= 700;
    
    // Very simplified - real classification requires many more factors
    if (P < 0.00039) return 'Class 1';
    if (isVisible) {
      if (P < 1) return 'Class 2';
      if (P < 5) return 'Class 3R';
      if (P < 500) return 'Class 3B';
      return 'Class 4';
    } else {
      // IR/UV have different limits - simplified
      if (P < 1) return 'Class 1 / Class 1M';
      if (P < 500) return 'Class 3B';
      return 'Class 4';
    }
  };

  const currentClass = getClassification(wavelength, power);
  const classData = laserClasses.find((c) => currentClass.includes(c.name));

  const wavelengthColor = () => {
    if (wavelength < 400) return '#8B5CF6'; // UV
    if (wavelength < 500) return '#3B82F6'; // Blue
    if (wavelength < 570) return '#10B981'; // Green
    if (wavelength < 590) return '#F59E0B'; // Yellow
    if (wavelength < 620) return '#F97316'; // Orange
    if (wavelength < 700) return '#EF4444'; // Red
    return '#DC2626'; // IR
  };

  return (
    <div className={styles.aelContainer}>
      <h3 className={styles.componentTitle}>Accessible Emission Limits (AEL)</h3>
      <p className={styles.componentDescription}>
        Explore the power limits that define each laser class. Note: This is simplified for learning;
        actual classification requires considering exposure duration, beam size, and other factors.
      </p>

      {/* View toggle */}
      <div className={styles.viewToggle}>
        <button
          className={`${styles.toggleButton} ${view === 'chart' ? styles.activeToggle : ''}`}
          onClick={() => setView('chart')}
        >
          Reference Chart
        </button>
        <button
          className={`${styles.toggleButton} ${view === 'calculator' ? styles.activeToggle : ''}`}
          onClick={() => setView('calculator')}
        >
          Class Calculator
        </button>
      </div>

      <AnimatePresence mode="wait">
        {view === 'chart' ? (
          <motion.div
            key="chart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.aelChart}
          >
            <h4>Visible Light CW Laser AEL Reference</h4>
            
            <div className={styles.aelTable}>
              <div className={styles.aelHeader}>
                <span>Class</span>
                <span>Power Limit (CW)</span>
                <span>Description</span>
              </div>
              
              {[
                { cls: 'Class 1', limit: '< 0.39 μW', desc: 'Inherently safe', color: '#10B981' },
                { cls: 'Class 2', limit: '< 1 mW', desc: 'Blink reflex protection', color: '#F59E0B' },
                { cls: 'Class 3R', limit: '< 5 mW', desc: 'Reduced risk', color: '#F97316' },
                { cls: 'Class 3B', limit: '< 500 mW', desc: 'Direct beam hazard', color: '#EF4444' },
                { cls: 'Class 4', limit: '> 500 mW', desc: 'Maximum hazard', color: '#DC2626' },
              ].map((row) => (
                <div key={row.cls} className={styles.aelRow}>
                  <span style={{ color: row.color, fontWeight: 600 }}>{row.cls}</span>
                  <span>{row.limit}</span>
                  <span>{row.desc}</span>
                </div>
              ))}
            </div>

            <div className={styles.aelNotes}>
              <h5>Important Notes:</h5>
              <ul>
                {aelReference.notes.map((note, i) => (
                  <li key={i}>{note}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="calculator"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={styles.classCalculator}
          >
            <h4>Simple Classification Calculator</h4>
            <p className={styles.calculatorNote}>
              (Simplified for learning - consult standards for actual classification)
            </p>

            <div className={styles.calculatorInputs}>
              <div className={styles.inputGroup}>
                <label>Wavelength (nm)</label>
                <div className={styles.sliderWithValue}>
                  <input
                    type="range"
                    min="200"
                    max="1500"
                    value={wavelength}
                    onChange={(e) => setWavelength(Number(e.target.value))}
                    className={styles.wavelengthSlider}
                    style={{
                      background: `linear-gradient(to right, #8B5CF6 0%, #3B82F6 20%, #10B981 40%, #F59E0B 50%, #F97316 55%, #EF4444 60%, #DC2626 80%)`,
                    }}
                  />
                  <span 
                    className={styles.wavelengthDisplay}
                    style={{ color: wavelengthColor() }}
                  >
                    {wavelength} nm
                  </span>
                </div>
                <div className={styles.wavelengthLabels}>
                  <span>UV</span>
                  <span>Visible</span>
                  <span>IR</span>
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Power (mW)</label>
                <div className={styles.powerInput}>
                  <input
                    type="number"
                    min="0.0001"
                    max="10000"
                    step="0.1"
                    value={power}
                    onChange={(e) => setPower(Number(e.target.value))}
                    className={styles.powerNumberInput}
                  />
                  <span className={styles.powerUnit}>mW</span>
                </div>
                <input
                  type="range"
                  min="0.0001"
                  max="1000"
                  step="0.1"
                  value={Math.min(power, 1000)}
                  onChange={(e) => setPower(Number(e.target.value))}
                  className={styles.powerSlider}
                />
              </div>
            </div>

            <motion.div
              key={currentClass}
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={styles.calculatorResult}
            >
              <span className={styles.resultLabel}>Classification:</span>
              <span 
                className={styles.resultClass}
                style={{ color: classData?.color || '#374151' }}
              >
                {currentClass}
              </span>
              <p className={styles.resultDescription}>
                {classData?.hazardDescription || 'Adjust parameters to see classification'}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AELExplorer;
