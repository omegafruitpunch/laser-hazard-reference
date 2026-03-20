import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles.module.css';

type SurfaceType = 'mirror' | 'diffuse' | 'rough';

interface SurfaceInfo {
  id: SurfaceType;
  name: string;
  description: string;
  hazardLevel: 'critical' | 'high' | 'medium' | 'low';
  reflectionPattern: string;
}

const surfaces: SurfaceInfo[] = [
  {
    id: 'mirror',
    name: 'Mirror/Specular',
    description: 'Smooth, shiny surfaces like mirrors, glass, polished metal, or water.',
    hazardLevel: 'critical',
    reflectionPattern: 'maintains beam collimation',
  },
  {
    id: 'diffuse',
    name: 'Diffusing Surface',
    description: 'Mirror ball or intentionally diffusing material that breaks the beam into many rays.',
    hazardLevel: 'medium',
    reflectionPattern: 'scatters into many lower-power rays',
  },
  {
    id: 'rough',
    name: 'Rough Surface',
    description: 'Concrete, matte paint, or irregular surfaces that scatter light.',
    hazardLevel: 'high',
    reflectionPattern: 'scatters but high-power beams remain hazardous',
  },
];

const hazardLabels = {
  critical: { text: 'CRITICAL', color: '#DC2626', bg: '#FEE2E2' },
  high: { text: 'HIGH', color: '#EA580C', bg: '#FFEDD5' },
  medium: { text: 'MEDIUM', color: '#D97706', bg: '#FEF3C7' },
  low: { text: 'LOW', color: '#059669', bg: '#D1FAE5' },
};

export const ReflectionHazardDemo: React.FC = () => {
  const [selectedSurface, setSelectedSurface] = useState<SurfaceType>('mirror');
  const surface = surfaces.find((s) => s.id === selectedSurface)!;
  const hazard = hazardLabels[surface.hazardLevel];

  return (
    <div className={styles.reflectionDemo}>
      <h3 className={styles.componentTitle}>Reflection Hazard Demonstration</h3>
      <p className={styles.componentDescription}>
        Select a surface type to see how laser reflections behave and assess the hazard level.
      </p>

      {/* Surface Selection */}
      <div className={styles.surfaceSelector}>
        {surfaces.map((s) => (
          <button
            key={s.id}
            className={`${styles.surfaceButton} ${selectedSurface === s.id ? styles.activeSurface : ''}`}
            onClick={() => setSelectedSurface(s.id)}
          >
            {s.name}
          </button>
        ))}
      </div>

      {/* Visual Demonstration */}
      <div className={styles.reflectionVisual}>
        <svg viewBox="0 0 400 250" className={styles.reflectionSvg}>
          {/* Laser source */}
          <rect x="10" y="115" width="30" height="20" fill="#374151" rx="2" />
          <text x="25" y="155" textAnchor="middle" fontSize="10" fill="#6B7280">Laser</text>

          {/* Incident beam */}
          <motion.line
            x1="40"
            y1="125"
            x2="150"
            y2={selectedSurface === 'mirror' ? '50' : selectedSurface === 'diffuse' ? '125' : '125'}
            stroke="#EF4444"
            strokeWidth="4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.5 }}
          />

          {/* Surface */}
          <AnimatePresence mode="wait">
            {selectedSurface === 'mirror' && (
              <motion.g
                key="mirror"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Mirror surface */}
                <line x1="150" y1="20" x2="150" y2="80" stroke="#60A5FA" strokeWidth="4" />
                <line x1="150" y1="20" x2="160" y2="25" stroke="#60A5FA" strokeWidth="2" />
                <line x1="150" y1="35" x2="160" y2="40" stroke="#60A5FA" strokeWidth="2" />
                <line x1="150" y1="50" x2="160" y2="55" stroke="#60A5FA" strokeWidth="2" />
                <line x1="150" y1="65" x2="160" y2="70" stroke="#60A5FA" strokeWidth="2" />
                <text x="155" y="15" textAnchor="middle" fontSize="10" fill="#3B82F6">Mirror</text>

                {/* Reflected beam - specular */}
                <motion.line
                  x1="150"
                  y1="50"
                  x2="380"
                  y2="50"
                  stroke="#EF4444"
                  strokeWidth="4"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                />

                {/* Warning */}
                <motion.text
                  x="280"
                  y="40"
                  textAnchor="middle"
                  fontSize="12"
                  fill="#DC2626"
                  fontWeight="bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  ⚠️ Nearly full power!
                </motion.text>
              </motion.g>
            )}

            {selectedSurface === 'diffuse' && (
              <motion.g
                key="diffuse"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Mirror ball */}
                <circle cx="200" cy="125" r="40" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="2" />
                {/* Facets */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
                  <line
                    key={angle}
                    x1="200"
                    y1="125"
                    x2={200 + 35 * Math.cos((angle * Math.PI) / 180)}
                    y2={125 + 35 * Math.sin((angle * Math.PI) / 180)}
                    stroke="#9CA3AF"
                    strokeWidth="1"
                  />
                ))}
                <text x="200" y="185" textAnchor="middle" fontSize="10" fill="#6B7280">Mirror Ball</text>

                {/* Scattered rays */}
                {[30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330, 360].map((angle, i) => (
                  <motion.line
                    key={angle}
                    x1="200"
                    y1="125"
                    x2={200 + 80 * Math.cos((angle * Math.PI) / 180)}
                    y2={125 + 80 * Math.sin((angle * Math.PI) / 180)}
                    stroke="#F59E0B"
                    strokeWidth="2"
                    strokeOpacity="0.6"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.3, delay: 0.3 + i * 0.05 }}
                  />
                ))}

                {/* Info */}
                <motion.text
                  x="300"
                  y="125"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#D97706"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  Power divided among rays
                </motion.text>
              </motion.g>
            )}

            {selectedSurface === 'rough' && (
              <motion.g
                key="rough"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Rough wall */}
                <path
                  d="M 150 80 L 155 85 L 150 90 L 158 95 L 150 100 L 156 105 L 150 110 L 154 115 L 150 120 L 157 125 L 150 130 L 155 135 L 150 140 L 158 145 L 150 150 L 156 155 L 150 160 L 154 165 L 150 170"
                  fill="#D1D5DB"
                  stroke="#9CA3AF"
                  strokeWidth="2"
                />
                <text x="165" y="175" textAnchor="middle" fontSize="10" fill="#6B7280">Rough Wall</text>

                {/* Scattered beam */}
                {[60, 80, 100, 120, 140, 160].map((angle, i) => (
                  <motion.line
                    key={angle}
                    x1="150"
                    y1="125"
                    x2={150 + 100 * Math.cos(((angle - 30) * Math.PI) / 180)}
                    y2={125 + 100 * Math.sin(((angle - 30) * Math.PI) / 180)}
                    stroke="#EF4444"
                    strokeWidth="3"
                    strokeOpacity="0.5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 + i * 0.08 }}
                  />
                ))}

                {/* Warning */}
                <motion.text
                  x="280"
                  y="100"
                  textAnchor="middle"
                  fontSize="11"
                  fill="#EA580C"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                >
                  High-power: still hazardous!
                </motion.text>
              </motion.g>
            )}
          </AnimatePresence>
        </svg>
      </div>

      {/* Hazard Assessment */}
      <AnimatePresence mode="wait">
        <motion.div
          key={selectedSurface}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          className={styles.hazardAssessment}
        >
          <div className={styles.hazardHeader}>
            <span
              className={styles.hazardBadge}
              style={{ backgroundColor: hazard.bg, color: hazard.color }}
            >
              {hazard.text} HAZARD
            </span>
          </div>
          <p className={styles.surfaceDescription}>{surface.description}</p>
          <div className={styles.reflectionInfo}>
            <span className={styles.reflectionLabel}>Reflection:</span>
            <span className={styles.reflectionValue}>{surface.reflectionPattern}</span>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default ReflectionHazardDemo;
