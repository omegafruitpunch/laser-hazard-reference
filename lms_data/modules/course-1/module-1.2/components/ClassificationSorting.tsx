import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from '../styles.module.css';
import { sortingItems, laserClasses } from '../data';

interface Placement {
  itemId: string;
  classId: string;
}

export const ClassificationSorting: React.FC = () => {
  const [placements, setPlacements] = useState<Placement[]>([]);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  const handleDragStart = (itemId: string) => {
    setDraggedItem(itemId);
  };

  const handleDrop = (classId: string) => {
    if (!draggedItem) return;

    setPlacements((prev) => {
      const filtered = prev.filter((p) => p.itemId !== draggedItem);
      return [...filtered, { itemId: draggedItem, classId }];
    });
    setDraggedItem(null);
  };

  const handleCheck = () => {
    let correct = 0;
    placements.forEach((placement) => {
      const item = sortingItems.find((i) => i.id === placement.itemId);
      if (item && item.correctClass === laserClasses.find((c) => c.id === placement.classId)?.name) {
        correct++;
      }
    });
    setScore(correct);
    setShowResults(true);
  };

  const handleReset = () => {
    setPlacements([]);
    setShowResults(false);
    setScore(0);
  };

  const getItemPlacement = (itemId: string) => {
    return placements.find((p) => p.itemId === itemId);
  };

  const isCorrectPlacement = (itemId: string, classId: string) => {
    const item = sortingItems.find((i) => i.id === itemId);
    const className = laserClasses.find((c) => c.id === classId)?.name;
    return item?.correctClass === className;
  };

  return (
    <div className={styles.sortingContainer}>
      <h3 className={styles.componentTitle}>Classification Sorting Challenge</h3>
      <p className={styles.componentDescription}>
        Drag each laser product to its correct classification. Test your understanding of laser classes!
      </p>

      <div className={styles.sortingArea}>
        {/* Items to sort */}
        <div className={styles.itemsPanel}>
          <h4>Laser Products</h4>
          <div className={styles.itemsList}>
            {sortingItems.map((item) => {
              const placement = getItemPlacement(item.id);
              const isPlaced = !!placement;

              return (
                <motion.div
                  key={item.id}
                  className={`${styles.sortableItem} ${isPlaced ? styles.placedItem : ''}`}
                  draggable={!isPlaced}
                  onDragStart={() => handleDragStart(item.id)}
                  whileHover={!isPlaced ? { scale: 1.02 } : {}}
                  layout
                >
                  <span className={styles.itemName}>{item.name}</span>
                  <span className={styles.itemDesc}>{item.description}</span>
                  {isPlaced && showResults && (
                    <span className={styles.resultIcon}>
                      {isCorrectPlacement(item.id, placement.classId) ? '✓' : '✗'}
                    </span>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Drop zones */}
        <div className={classes.dropZonesPanel}>
          <h4>Classification Zones</h4>
          <div className={classes.dropZonesGrid}>
            {laserClasses.map((laserClass) => (
              <div
                key={laserClass.id}
                className={`${styles.dropZone} ${draggedItem ? styles.activeDropZone : ''}`}
                style={{ borderColor: laserClass.color }}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(laserClass.id)}
              >
                <div
                  className={styles.zoneHeader}
                  style={{ backgroundColor: laserClass.color + '20', color: laserClass.color }}
                >
                  <span>{laserClass.name}</span>
                </div>
                <div className={styles.zoneItems}>
                  {placements
                    .filter((p) => p.classId === laserClass.id)
                    .map((p) => {
                      const item = sortingItems.find((i) => i.id === p.itemId)!;
                      return (
                        <div
                          key={p.itemId}
                          className={`${styles.zoneItem} ${
                            showResults
                              ? isCorrectPlacement(p.itemId, p.classId)
                                ? styles.correctItem
                                : styles.incorrectItem
                              : ''
                          }`}
                        >
                          {item.name}
                        </div>
                      );
                    })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Action buttons */}
      <div className={styles.sortingActions}>
        {!showResults ? (
          <button
            className={styles.checkButton}
            onClick={handleCheck}
            disabled={placements.length < sortingItems.length}
          >
            Check Answers
          </button>
        ) : (
          <div className={styles.resultsPanel}>
            <span className={styles.scoreDisplay}>
              Score: {score} / {sortingItems.length}
            </span>
            <button className={styles.resetButton} onClick={handleReset}>
              Try Again
            </button>
          </div>
        )}
      </div>

      {/* Results feedback */}
      <AnimatePresence>
        {showResults && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={styles.sortingFeedback}
          >
            {score === sortingItems.length ? (
              <div className={styles.perfectScore}>
                🎉 Perfect! You've mastered laser classification!
              </div>
            ) : score >= sortingItems.length / 2 ? (
              <div className={styles.goodScore}>
                Good job! Review the ones you missed and try again.
              </div>
            ) : (
              <div className={styles.needsWork}>
                Keep practicing! Review the classification criteria and try again.
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ClassificationSorting;
