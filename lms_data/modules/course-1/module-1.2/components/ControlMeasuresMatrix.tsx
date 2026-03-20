import React, { useState } from 'react';
import { motion } from 'framer-motion';
import styles from '../styles.module.css';
import { controlMeasures, laserClasses } from '../data';

export const ControlMeasuresMatrix: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>('class4');

  const selectedClassData = laserClasses.find((c) => c.id === selectedClass);

  const getMeasureStatus = (measure: typeof controlMeasures[0]) => {
    if (measure.applicableClasses.includes(selectedClassData?.name || '')) {
      return 'required';
    }
    if (measure.applicableClasses.includes('All')) {
      return 'always';
    }
    return 'not-required';
  };

  const categoryIcons = {
    engineering: '🔧',
    administrative: '📋',
    ppe: '🥽',
  };

  const categoryLabels = {
    engineering: 'Engineering Controls',
    administrative: 'Administrative Controls',
    ppe: 'Personal Protective Equipment',
  };

  const groupedMeasures = controlMeasures.reduce((acc, measure) => {
    if (!acc[measure.category]) {
      acc[measure.category] = [];
    }
    acc[measure.category].push(measure);
    return acc;
  }, {} as Record<string, typeof controlMeasures>);

  return (
    <div className={styles.matrixContainer}>
      <h3 className={styles.componentTitle}>Control Measures by Class</h3>
      <p className={styles.componentDescription}>
        Select a laser class to see which control measures are required. Requirements increase with hazard class.
      </p>

      {/* Class selector */}
      <div className={styles.classSelector}>
        {laserClasses.map((laserClass) => (
          <button
            key={laserClass.id}
            className={`${styles.classSelectButton} ${selectedClass === laserClass.id ? styles.selectedClass : ''}`}
            style={{ 
              borderColor: laserClass.color,
              backgroundColor: selectedClass === laserClass.id ? laserClass.color + '20' : 'white'
            }}
            onClick={() => setSelectedClass(laserClass.id)}
          >
            <span style={{ color: laserClass.color }}>{laserClass.name}</span>
          </button>
        ))}
      </div>

      {/* Matrix display */}
      <div className={styles.measuresMatrix}>
        {Object.entries(groupedMeasures).map(([category, measures]) => (
          <div key={category} className={styles.measureCategory}>
            <div className={styles.categoryHeader}>
              <span className={styles.categoryIcon}>{categoryIcons[category as keyof typeof categoryIcons]}</span>
              <span className={styles.categoryName}>{categoryLabels[category as keyof typeof categoryLabels]}</span>
            </div>
            
            <div className={styles.measuresList}>
              {measures.map((measure) => {
                const status = getMeasureStatus(measure);
                
                return (
                  <motion.div
                    key={measure.id}
                    className={`${styles.measureItem} ${styles[status]}`}
                    initial={false}
                    animate={{
                      backgroundColor: status === 'required' ? '#D1FAE5' : status === 'always' ? '#DBEAFE' : '#F3F4F6',
                      opacity: status === 'not-required' ? 0.5 : 1,
                    }}
                    layout
                  >
                    <div className={styles.measureHeader}>
                      <span className={styles.measureIcon}>{measure.icon}</span>
                      <span className={styles.measureName}>{measure.name}</span>
                      <span className={styles.statusBadge}>
                        {status === 'required' && '✓ Required'}
                        {status === 'always' && '✓ Always'}
                        {status === 'not-required' && '— Not required'}
                      </span>
                    </div>
                    {status !== 'not-required' && (
                      <p className={styles.measureDescription}>{measure.description}</p>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div 
        className={styles.matrixSummary}
        style={{ borderLeftColor: selectedClassData?.color }}
      >
        <h4 style={{ color: selectedClassData?.color }}>
          {selectedClassData?.name} Requirements
        </h4>
        <p>{selectedClassData?.hazardDescription}</p>
        <div className={styles.requirementCount}>
          <span>
            Required controls: {controlMeasures.filter(m => getMeasureStatus(m) === 'required').length} of {controlMeasures.length}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ControlMeasuresMatrix;
