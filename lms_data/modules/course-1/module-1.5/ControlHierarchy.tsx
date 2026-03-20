/**
 * Control Hierarchy Interactive Component
 * Module 1.5: Engineering & Administrative Controls
 * 
 * Drag-and-drop exercise for learning the hierarchy of controls
 * Implements Brilliant.org patterns: visual feedback, progressive hints, immediate validation
 */

import React, { useState, useCallback } from 'react';
import './ControlHierarchy.css';

interface ControlItem {
  id: string;
  text: string;
  correctLevel: number;
  currentLevel: number | null;
}

interface Level {
  id: number;
  name: string;
  description: string;
  color: string;
  icon: string;
}

const LEVELS: Level[] = [
  {
    id: 1,
    name: "Elimination/Substitution",
    description: "Remove the hazard entirely or use a safer alternative",
    color: "#4CAF50",
    icon: "✓"
  },
  {
    id: 2,
    name: "Engineering Controls",
    description: "Isolate the hazard through physical means",
    color: "#8BC34A",
    icon: "⚙️"
  },
  {
    id: 3,
    name: "Administrative Controls",
    description: "Change how people work through procedures and training",
    color: "#FFC107",
    icon: "📋"
  },
  {
    id: 4,
    name: "PPE",
    description: "Personal Protective Equipment - last resort",
    color: "#FF5722",
    icon: "🥽"
  }
];

const INITIAL_ITEMS: ControlItem[] = [
  { id: '1', text: 'Install door interlocks', correctLevel: 2, currentLevel: null },
  { id: '2', text: 'Require safety eyewear', correctLevel: 4, currentLevel: null },
  { id: '3', text: 'Post warning signs', correctLevel: 3, currentLevel: null },
  { id: '4', text: 'Use enclosed Class 1 system', correctLevel: 1, currentLevel: null },
  { id: '5', text: 'Write Standard Operating Procedures', correctLevel: 3, currentLevel: null },
  { id: '6', text: 'Install beam blocks', correctLevel: 2, currentLevel: null },
  { id: '7', text: 'Provide safety training', correctLevel: 3, currentLevel: null },
  { id: '8', text: 'Substitute lower power laser', correctLevel: 1, currentLevel: null },
  { id: '9', text: 'Install scan-fail detectors', correctLevel: 2, currentLevel: null },
  { id: '10', text: 'Require laser safety officer approval', correctLevel: 3, currentLevel: null },
];

const ControlHierarchy: React.FC = () => {
  const [items, setItems] = useState<ControlItem[]>(INITIAL_ITEMS);
  const [draggedItem, setDraggedItem] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [hintLevel, setHintLevel] = useState(0);
  const [attempts, setAttempts] = useState(0);

  const handleDragStart = (e: React.DragEvent, itemId: string) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, levelId: number) => {
    e.preventDefault();
    if (!draggedItem) return;

    setItems(prev => prev.map(item => 
      item.id === draggedItem ? { ...item, currentLevel: levelId } : item
    ));
    setDraggedItem(null);
  };

  const handleItemClick = (itemId: string, levelId: number) => {
    setItems(prev => prev.map(item => 
      item.id === itemId ? { ...item, currentLevel: levelId } : item
    ));
  };

  const checkAnswers = useCallback(() => {
    const correct = items.filter(item => item.currentLevel === item.correctLevel).length;
    setScore(correct);
    setShowResults(true);
    setAttempts(prev => prev + 1);
  }, [items]);

  const resetExercise = () => {
    setItems(INITIAL_ITEMS.map(item => ({ ...item, currentLevel: null })));
    setShowResults(false);
    setScore(0);
    setHintLevel(0);
  };

  const getItemStatus = (item: ControlItem): 'correct' | 'incorrect' | 'unplaced' => {
    if (item.currentLevel === null) return 'unplaced';
    if (!showResults) return 'unplaced';
    return item.currentLevel === item.correctLevel ? 'correct' : 'incorrect';
  };

  const unplacedItems = items.filter(item => item.currentLevel === null);
  const allItemsPlaced = unplacedItems.length === 0;

  const hints = [
    "Think about reliability: Which controls are most reliable?",
    "Engineering controls physically prevent exposure, while administrative controls rely on behavior.",
    "PPE is always the last resort because it can fail or be forgotten."
  ];

  return (
    <div className="control-hierarchy">
      <div className="hierarchy-header">
        <h2>Hierarchy of Controls</h2>
        <p className="subtitle">
          Drag each control measure to its correct position in the hierarchy
        </p>
      </div>

      <div className="hierarchy-body">
        {/* Pyramid Visualization */}
        <div className="pyramid-container">
          {LEVELS.map((level, index) => (
            <div
              key={level.id}
              className={`pyramid-level level-${level.id}`}
              style={{ 
                backgroundColor: level.color,
                width: `${100 - (index * 15)}%`,
                marginLeft: `${index * 7.5}%`,
                marginRight: `${index * 7.5}%`
              }}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, level.id)}
            >
              <div className="level-header">
                <span className="level-icon">{level.icon}</span>
                <div className="level-info">
                  <h4>{level.name}</h4>
                  <p>{level.description}</p>
                </div>
              </div>

              <div className="level-items">
                {items
                  .filter(item => item.currentLevel === level.id)
                  .map(item => {
                    const status = getItemStatus(item);
                    return (
                      <div
                        key={item.id}
                        className={`control-item ${status}`}
                        draggable={!showResults}
                        onDragStart={(e) => handleDragStart(e, item.id)}
                        onClick={() => {
                          if (!showResults) {
                            // Cycle through levels on click
                            const nextLevel = item.currentLevel ? (item.currentLevel % 4) + 1 : 1;
                            handleItemClick(item.id, nextLevel);
                          }
                        }}
                      >
                        <span className="item-text">{item.text}</span>
                        {showResults && (
                          <span className="item-status">
                            {status === 'correct' ? '✓' : '✗'}
                          </span>
                        )}
                      </div>
                    );
                  })}
              </div>

              {showResults && items.filter(item => item.currentLevel === level.id).length === 0 && (
                <div className="empty-level-hint">
                  No controls placed here
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Items Pool */}
        <div className="items-pool">
          <h4>Control Measures</h4>
          <p className="pool-instruction">
            Drag items to the pyramid or click to place
          </p>
          
          {unplacedItems.length > 0 ? (
            <div className="unplaced-items">
              {unplacedItems.map(item => (
                <div
                  key={item.id}
                  className="control-item unplaced"
                  draggable
                  onDragStart={(e) => handleDragStart(e, item.id)}
                  onClick={() => handleItemClick(item.id, 1)}
                >
                  <span className="drag-handle">⋮⋮</span>
                  {item.text}
                </div>
              ))}
            </div>
          ) : (
            <div className="all-placed-message">
              ✓ All items placed!
            </div>
          )}
        </div>
      </div>

      {/* Results Section */}
      {showResults && (
        <div className="results-panel">
          <div className={`score-display ${score === items.length ? 'perfect' : score >= items.length * 0.7 ? 'good' : 'needs-work'}`}>
            <div className="score-number">{score}/{items.length}</div>
            <div className="score-label">
              {score === items.length ? 'Perfect!' : score >= items.length * 0.7 ? 'Good job!' : 'Keep practicing'}
            </div>
          </div>

          {score < items.length && (
            <div className="corrections">
              <h4>Corrections:</h4>
              {items.filter(item => item.currentLevel !== item.correctLevel).map(item => (
                <div key={item.id} className="correction-item">
                  <span className="item-name">{item.text}</span>
                  <span className="arrow">→</span>
                  <span className="correct-level" style={{ color: LEVELS[item.correctLevel - 1].color }}>
                    {LEVELS[item.correctLevel - 1].name}
                  </span>
                </div>
              ))}
            </div>
          )}

          <div className="key-insight">
            <strong>Key Insight:</strong> Engineering controls are preferred over administrative controls 
            because they don't depend on human behavior. PPE is always the last resort.
          </div>
        </div>
      )}

      {/* Hint System */}
      {!showResults && (
        <div className="hint-section">
          <button 
            className="hint-btn"
            onClick={() => setHintLevel(prev => Math.min(prev + 1, hints.length))}
            disabled={hintLevel >= hints.length}
          >
            {hintLevel >= hints.length ? 'No more hints' : `💡 Hint (${hintLevel}/${hints.length})`}
          </button>
          
          {hintLevel > 0 && (
            <div className="hints-display">
              {hints.slice(0, hintLevel).map((hint, index) => (
                <div key={index} className="hint-item">
                  <span className="hint-star">{'⭐'.repeat(index + 1)}</span>
                  <span className="hint-text">{hint}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="action-buttons">
        {!showResults ? (
          <button 
            className={`btn-check ${!allItemsPlaced ? 'disabled' : ''}`}
            onClick={checkAnswers}
            disabled={!allItemsPlaced}
          >
            {allItemsPlaced ? 'Check Answers' : `Place all items (${items.length - unplacedItems.length}/${items.length})`}
          </button>
        ) : (
          <button className="btn-reset" onClick={resetExercise}>
            Try Again
          </button>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="progress-indicator">
        <div 
          className="progress-bar"
          style={{ width: `${((items.length - unplacedItems.length) / items.length) * 100}%` }}
        />
        <span className="progress-text">
          {items.length - unplacedItems.length} of {items.length} placed
        </span>
      </div>
    </div>
  );
};

export default ControlHierarchy;
