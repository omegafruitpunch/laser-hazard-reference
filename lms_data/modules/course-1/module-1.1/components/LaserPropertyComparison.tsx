import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles.module.css';

interface PropertyData {
  id: string;
  name: string;
  icon: string;
  description: string;
  laserVisual: React.ReactNode;
  conventionalVisual: React.ReactNode;
  laserText: string;
  conventionalText: string;
  keyPoint: string;
}

const properties: PropertyData[] = [
  {
    id: 'coherence',
    name: 'Coherence',
    icon: '〰️',
    description: 'Laser light waves travel in phase, synchronized with each other.',
    laserText: 'Waves are synchronized - all peaks and troughs aligned',
    conventionalText: 'Waves are random and out of phase',
    keyPoint: 'Coherence allows interference and creates the characteristic laser effects.',
    laserVisual: (
      <svg viewBox="0 0 200 100" className={styles.propertySvg}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.path
            key={i}
            d={`M 0 ${50 + i * 8} Q 50 ${30 + i * 8} 100 ${50 + i * 8} Q 150 ${70 + i * 8} 200 ${50 + i * 8}`}
            fill="none"
            stroke="#10B981"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
        <text x="100" y="20" textAnchor="middle" fontSize="12" fill="#10B981">In Phase</text>
      </svg>
    ),
    conventionalVisual: (
      <svg viewBox="0 0 200 100" className={styles.propertySvg}>
        {[0, 1, 2, 3, 4].map((i) => (
          <motion.path
            key={i}
            d={`M 0 ${50 + i * 8 + (Math.random() - 0.5) * 20} Q ${50 + (Math.random() - 0.5) * 30} ${30 + i * 8} 100 ${50 + (Math.random() - 0.5) * 20} Q 150 ${70 + i * 8} 200 ${50 + i * 8}`}
            fill="none"
            stroke="#6B7280"
            strokeWidth="2"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
          />
        ))}
        <text x="100" y="20" textAnchor="middle" fontSize="12" fill="#6B7280">Random Phase</text>
      </svg>
    ),
  },
  {
    id: 'monochromaticity',
    name: 'Monochromaticity',
    icon: '🎨',
    description: 'Laser light has a single, pure wavelength (color).',
    laserText: 'Single wavelength - pure color',
    conventionalText: 'Mix of all wavelengths - broad spectrum',
    keyPoint: 'Pure color enables precise applications and holography.',
    laserVisual: (
      <svg viewBox="0 0 200 100" className={styles.propertySvg}>
        <defs>
          <linearGradient id="laserGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#10B981" />
          </linearGradient>
        </defs>
        <motion.rect
          x="20"
          y="40"
          width="160"
          height="20"
          fill="url(#laserGradient)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
        <text x="100" y="80" textAnchor="middle" fontSize="12" fill="#10B981">Single Wavelength (532 nm)</text>
      </svg>
    ),
    conventionalVisual: (
      <svg viewBox="0 0 200 100" className={styles.propertySvg}>
        <defs>
          <linearGradient id="spectrumGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#8B5CF6" />
            <stop offset="25%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#10B981" />
            <stop offset="75%" stopColor="#F59E0B" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
        </defs>
        <motion.rect
          x="20"
          y="40"
          width="160"
          height="20"
          fill="url(#spectrumGradient)"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.5 }}
          style={{ transformOrigin: 'left' }}
        />
        <text x="100" y="80" textAnchor="middle" fontSize="12" fill="#6B7280">Full Spectrum (White Light)</text>
      </svg>
    ),
  },
  {
    id: 'divergence',
    name: 'Low Divergence',
    icon: '➡️',
    description: 'Laser beams stay narrow over long distances.',
    laserText: 'Beam stays narrow - minimal spreading',
    conventionalText: 'Beam spreads rapidly with distance',
    keyPoint: 'Low divergence maintains intensity over distance.',
    laserVisual: (
      <svg viewBox="0 0 200 100" className={styles.propertySvg}>
        <motion.path
          d="M 20 45 L 180 48 L 180 52 L 20 55 Z"
          fill="#10B981"
          fillOpacity="0.3"
          stroke="#10B981"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
        <text x="100" y="80" textAnchor="middle" fontSize="12" fill="#10B981">Divergence: 1 mrad</text>
        <text x="100" y="95" textAnchor="middle" fontSize="10" fill="#10B981">~100 mm at 100 m</text>
      </svg>
    ),
    conventionalVisual: (
      <svg viewBox="0 0 200 100" className={styles.propertySvg}>
        <motion.path
          d="M 20 50 L 180 10 L 180 90 Z"
          fill="#6B7280"
          fillOpacity="0.3"
          stroke="#6B7280"
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.8 }}
        />
        <text x="100" y="25" textAnchor="middle" fontSize="12" fill="#6B7280">High Divergence</text>
        <text x="100" y="40" textAnchor="middle" fontSize="10" fill="#6B7280">Spreads in all directions</text>
      </svg>
    ),
  },
];

export const LaserPropertyComparison: React.FC = () => {
  const [activeProperty, setActiveProperty] = useState<PropertyData>(properties[0]);

  return (
    <div className={styles.propertyComparison}>
      <h3 className={styles.componentTitle}>Laser vs. Conventional Light</h3>
      <p className={styles.componentDescription}>
        Tap each property to see how laser light differs from light from a bulb or flashlight.
      </p>

      {/* Property Tabs */}
      <div className={styles.propertyTabs}>
        {properties.map((prop) => (
          <button
            key={prop.id}
            className={`${styles.propertyTab} ${activeProperty.id === prop.id ? styles.activeTab : ''}`}
            onClick={() => setActiveProperty(prop)}
          >
            <span className={styles.tabIcon}>{prop.icon}</span>
            <span className={styles.tabName}>{prop.name}</span>
          </button>
        ))}
      </div>

      {/* Comparison Display */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeProperty.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={styles.comparisonContainer}
        >
          <div className={styles.comparisonRow}>
            {/* Laser Side */}
            <div className={styles.laserSide}>
              <div className={styles.sideHeader}>
                <span className={styles.laserBadge}>LASER</span>
              </div>
              <div className={styles.visualContainer}>
                {activeProperty.laserVisual}
              </div>
              <p className={styles.sideDescription}>{activeProperty.laserText}</p>
            </div>

            {/* VS Divider */}
            <div className={styles.vsDivider}>VS</div>

            {/* Conventional Side */}
            <div className={styles.conventionalSide}>
              <div className={styles.sideHeader}>
                <span className={styles.conventionalBadge}>BULB</span>
              </div>
              <div className={styles.visualContainer}>
                {activeProperty.conventionalVisual}
              </div>
              <p className={styles.sideDescription}>{activeProperty.conventionalText}</p>
            </div>
          </div>

          {/* Key Point */}
          <motion.div
            className={styles.keyPoint}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <span className={styles.keyPointIcon}>💡</span>
            <span className={styles.keyPointText}>{activeProperty.keyPoint}</span>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default LaserPropertyComparison;
