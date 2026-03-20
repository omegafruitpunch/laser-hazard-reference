import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles.module.css';

interface WavelengthData {
  id: string;
  name: string;
  range: string;
  color: string;
  hazardType: string;
  targetStructure: string;
  description: string;
}

const wavelengthData: WavelengthData[] = [
  {
    id: 'uvc',
    name: 'UVC',
    range: '100-280 nm',
    color: '#8B5CF6',
    hazardType: 'Photochemical',
    targetStructure: 'Cornea, skin',
    description: 'Absorbed by outer eye layers. Can cause "welder\'s flash" (photokeratitis).',
  },
  {
    id: 'uvb',
    name: 'UVB',
    range: '280-315 nm',
    color: '#A855F7',
    hazardType: 'Photochemical',
    targetStructure: 'Cornea, lens',
    description: 'Causes photokeratitis. Some cataract formation risk.',
  },
  {
    id: 'uva',
    name: 'UVA',
    range: '315-400 nm',
    color: '#C084FC',
    hazardType: 'Photochemical',
    targetStructure: 'Lens, retina (aphakic)',
    description: 'Passes through cornea. Can cause cataracts. Retinal hazard if lens removed.',
  },
  {
    id: 'visible',
    name: 'Visible',
    range: '400-700 nm',
    color: '#10B981',
    hazardType: 'Retinal burns',
    targetStructure: 'Retina',
    description: 'Pass through eye, focus on retina. Most dangerous due to focusing effect.',
  },
  {
    id: 'near-ir',
    name: 'Near-IR (Retinal Hazard)',
    range: '700-1400 nm',
    color: '#EF4444',
    hazardType: 'Retinal burns (SILENT)',
    targetStructure: 'Retina',
    description: 'Invisible but focuses on retina! "Silent killer" - no aversion reflex, painless damage.',
  },
  {
    id: 'mid-far-ir',
    name: 'Mid & Far-IR',
    range: '>1400 nm',
    color: '#F97316',
    hazardType: 'Thermal burns',
    targetStructure: 'Cornea only',
    description: 'Absorbed by cornea and aqueous humor. Cannot reach retina.',
  },
];

export const WavelengthExplorer: React.FC = () => {
  const [selectedWavelength, setSelectedWavelength] = useState<WavelengthData | null>(null);
  const [sliderValue, setSliderValue] = useState(532);

  const getWavelengthFromSlider = (value: number): WavelengthData => {
    if (value < 280) return wavelengthData[0];
    if (value < 315) return wavelengthData[1];
    if (value < 400) return wavelengthData[2];
    if (value < 700) return wavelengthData[3];
    if (value < 1400) return wavelengthData[4];
    return wavelengthData[5];
  };

  const currentWavelength = getWavelengthFromSlider(sliderValue);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    setSliderValue(value);
    setSelectedWavelength(getWavelengthFromSlider(value));
  };

  return (
    <div className={styles.wavelengthExplorer}>
      <h3 className={styles.componentTitle}>Wavelength Hazard Explorer</h3>
      <p className={styles.componentDescription}>
        Drag the slider to explore how different wavelengths interact with the eye.
      </p>

      {/* Spectrum Slider */}
      <div className={styles.sliderContainer}>
        <div className={styles.sliderLabels}>
          <span>UV</span>
          <span>Visible</span>
          <span>Near-IR</span>
          <span>Far-IR</span>
        </div>
        <input
          type="range"
          min="100"
          max="2000"
          value={sliderValue}
          onChange={handleSliderChange}
          className={styles.wavelengthSlider}
          style={{
            background: `linear-gradient(to right, 
              #8B5CF6 0%, 
              #C084FC 15%, 
              #10B981 35%, 
              #EF4444 65%, 
              #F97316 85%,
              #F97316 100%)`,
          }}
        />
        <div className={styles.sliderValue}>
          <span className={styles.wavelengthValue}>{sliderValue} nm</span>
          <span 
            className={styles.wavelengthBadge}
            style={{ backgroundColor: currentWavelength.color }}
          >
            {currentWavelength.name}
          </span>
        </div>
      </div>

      {/* Eye Diagram */}
      <div className={styles.eyeDiagramContainer}>
        <svg viewBox="0 0 400 200" className={styles.eyeSvg}>
          {/* Eye outline */}
          <ellipse cx="200" cy="100" rx="150" ry="80" fill="#F3F4F6" stroke="#374151" strokeWidth="2" />
          
          {/* Cornea */}
          <path d="M 60 100 Q 80 60 120 50" fill="none" stroke="#60A5FA" strokeWidth="3" />
          <text x="70" y="40" fontSize="12" fill="#1E40AF">Cornea</text>
          
          {/* Lens */}
          <ellipse cx="160" cy="100" rx="20" ry="35" fill="#DBEAFE" stroke="#3B82F6" strokeWidth="2" />
          <text x="145" y="145" fontSize="12" fill="#1E40AF">Lens</text>
          
          {/* Retina */}
          <path d="M 200 20 Q 340 100 200 180" fill="#FEE2E2" stroke="#EF4444" strokeWidth="2" strokeDasharray="5,5" />
          <text x="280" y="100" fontSize="12" fill="#991B1B">Retina</text>
          
          {/* Beam path */}
          <motion.line
            x1="20"
            y1="100"
            x2={currentWavelength.id === 'mid-far-ir' ? "120" : "340"}
            y2={currentWavelength.id === 'mid-far-ir' ? "100" : currentWavelength.id === 'visible' || currentWavelength.id === 'near-ir' ? "100" : "100"}
            stroke={currentWavelength.color}
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />
          
          {/* Focus point for retinal hazard */}
          {(currentWavelength.id === 'visible' || currentWavelength.id === 'near-ir') && (
            <motion.circle
              cx="340"
              cy="100"
              r="8"
              fill="#EF4444"
              initial={{ scale: 0 }}
              animate={{ scale: [1, 1.5, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          )}
          
          {/* Stop point for corneal hazard */}
          {currentWavelength.id === 'mid-far-ir' && (
            <motion.rect
              x="115"
              y="85"
              width="10"
              height="30"
              fill="#F97316"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            />
          )}
          
          {/* Warning icon for near-IR */}
          {currentWavelength.id === 'near-ir' && (
            <motion.g
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <text x="330" y="70" fontSize="24">⚠️</text>
              <text x="300" y="140" fontSize="10" fill="#991B1B">SILENT KILLER</text>
            </motion.g>
          )}
        </svg>
      </div>

      {/* Info Panel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentWavelength.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={styles.wavelengthInfoPanel}
          style={{ borderLeftColor: currentWavelength.color }}
        >
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Wavelength Range:</span>
            <span className={styles.infoValue}>{currentWavelength.range}</span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Hazard Type:</span>
            <span className={styles.infoValue} style={{ color: currentWavelength.color }}>
              {currentWavelength.hazardType}
            </span>
          </div>
          <div className={styles.infoRow}>
            <span className={styles.infoLabel}>Target Structure:</span>
            <span className={styles.infoValue}>{currentWavelength.targetStructure}</span>
          </div>
          <p className={styles.wavelengthDescription}>{currentWavelength.description}</p>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default WavelengthExplorer;
