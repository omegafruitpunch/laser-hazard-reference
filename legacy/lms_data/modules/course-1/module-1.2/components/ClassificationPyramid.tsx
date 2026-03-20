import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles.module.css';
import { laserClasses } from '../data';

export const ClassificationPyramid: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  const selectedData = laserClasses.find((c) => c.id === selectedClass);

  const pyramidLevels = [
    { classes: ['class4'], label: 'Highest Hazard', width: '25%' },
    { classes: ['class3b', 'class3r'], label: 'High Hazard', width: '50%' },
    { classes: ['class2', 'class2m', 'class1m'], label: 'Low Hazard', width: '75%' },
    { classes: ['class1'], label: 'No Hazard', width: '100%' },
  ];

  return (
    <div className={styles.pyramidContainer}>
      <h3 className={styles.componentTitle}>Laser Classification Pyramid</h3>
      <p className={styles.componentDescription}>
        Tap any class to explore its characteristics and requirements. Higher in the pyramid = higher hazard.
      </p>

      <div className={styles.pyramidWrapper}>
        {pyramidLevels.map((level, levelIndex) => (
          <div
            key={level.label}
            className={styles.pyramidLevel}
            style={{ width: level.width }}
          >
            {level.classes.map((classId) => {
              const laserClass = laserClasses.find((c) => c.id === classId)!;
              const isSelected = selectedClass === classId;
              const isHovered = hoveredClass === classId;

              return (
                <motion.button
                  key={classId}
                  className={`${styles.pyramidBlock} ${isSelected ? styles.selectedBlock : ''}`}
                  style={{ backgroundColor: laserClass.color }}
                  onClick={() => setSelectedClass(classId)}
                  onMouseEnter={() => setHoveredClass(classId)}
                  onMouseLeave={() => setHoveredClass(null)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <span className={styles.blockIcon}>{laserClass.icon}</span>
                  <span className={styles.blockName}>{laserClass.name}</span>
                  <span className={styles.blockSubtitle}>{laserClass.subtitle}</span>
                </motion.button>
              );
            })}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {selectedData && (
          <motion.div
            key={selectedData.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={styles.classDetails}
          >
            <div
              className={styles.classHeader}
              style={{ borderLeftColor: selectedData.color }}
            >
              <h4 style={{ color: selectedData.color }}>
                {selectedData.name}: {selectedData.subtitle}
              </h4>
              <span className={styles.aelBadge}>{selectedData.aelNote}</span>
            </div>

            <div className={styles.detailsGrid}>
              <div className={styles.detailSection}>
                <h5>Hazard Description</h5>
                <p>{selectedData.hazardDescription}</p>
              </div>

              <div className={styles.detailSection}>
                <h5>Key Characteristics</h5>
                <ul>
                  {selectedData.keyCharacteristics.map((char, i) => (
                    <li key={i}>{char}</li>
                  ))}
                </ul>
              </div>

              <div className={styles.detailSection}>
                <h5>Required Controls</h5>
                
                {selectedData.requirements.engineering.length > 0 && (
                  <div className={styles.controlCategory}>
                    <span className={styles.controlLabel}>Engineering:</span>
                    <ul>
                      {selectedData.requirements.engineering.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedData.requirements.administrative.length > 0 && (
                  <div className={styles.controlCategory}>
                    <span className={styles.controlLabel}>Administrative:</span>
                    <ul>
                      {selectedData.requirements.administrative.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}

                {selectedData.requirements.ppe.length > 0 && (
                  <div className={styles.controlCategory}>
                    <span className={styles.controlLabel}>PPE:</span>
                    <ul>
                      {selectedData.requirements.ppe.map((req, i) => (
                        <li key={i}>{req}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassificationPyramid;
