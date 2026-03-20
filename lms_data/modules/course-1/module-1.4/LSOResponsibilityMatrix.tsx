/**
 * LSO Responsibility Matrix Component
 * Module 1.4: The Laser Safety Officer Role
 * 
 * Interactive checklist showing LSO responsibilities by category
 */

import React, { useState } from 'react';
import './LSOResponsibilityMatrix.css';

interface Responsibility {
  id: string;
  text: string;
  frequency: 'daily' | 'weekly' | 'monthly' | 'annual' | 'as-needed';
  critical: boolean;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  responsibilities: Responsibility[];
}

const CATEGORIES: Category[] = [
  {
    id: 'hazard-eval',
    name: 'Hazard Evaluation',
    icon: '🔍',
    description: 'Assessing and classifying laser hazards',
    responsibilities: [
      { id: 'he1', text: 'Classify lasers and laser systems', frequency: 'as-needed', critical: true },
      { id: 'he2', text: 'Calculate NOHD and determine NHZ', frequency: 'as-needed', critical: true },
      { id: 'he3', text: 'Evaluate MPE for all exposure conditions', frequency: 'as-needed', critical: true },
      { id: 'he4', text: 'Assess potential for eye and skin exposure', frequency: 'as-needed', critical: false },
      { id: 'he5', text: 'Evaluate non-beam hazards (electrical, chemical, fire)', frequency: 'annual', critical: true },
      { id: 'he6', text: 'Review changes to laser installations', frequency: 'as-needed', critical: true },
    ]
  },
  {
    id: 'controls',
    name: 'Control Measures',
    icon: '🛡️',
    description: 'Implementing and maintaining safety controls',
    responsibilities: [
      { id: 'cm1', text: 'Approve and implement engineering controls', frequency: 'as-needed', critical: true },
      { id: 'cm2', text: 'Specify required PPE (eyewear, clothing)', frequency: 'annual', critical: true },
      { id: 'cm3', text: 'Establish administrative controls and SOPs', frequency: 'annual', critical: true },
      { id: 'cm4', text: 'Verify interlocks and safety systems function', frequency: 'monthly', critical: true },
      { id: 'cm5', text: 'Review and approve modifications to systems', frequency: 'as-needed', critical: true },
      { id: 'cm6', text: 'Ensure signage and labeling compliance', frequency: 'monthly', critical: false },
    ]
  },
  {
    id: 'training',
    name: 'Training & Authorization',
    icon: '📚',
    description: 'Personnel training and competency verification',
    responsibilities: [
      { id: 'tr1', text: 'Provide laser safety training to personnel', frequency: 'as-needed', critical: true },
      { id: 'tr2', text: 'Maintain training records', frequency: 'annual', critical: true },
      { id: 'tr3', text: 'Authorize personnel to work with lasers', frequency: 'as-needed', critical: true },
      { id: 'tr4', text: 'Ensure competency verification', frequency: 'annual', critical: true },
      { id: 'tr5', text: 'Coordinate refresher training', frequency: 'annual', critical: false },
      { id: 'tr6', text: 'Brief visitors and contractors', frequency: 'as-needed', critical: false },
    ]
  },
  {
    id: 'incident',
    name: 'Incident Response',
    icon: '🚨',
    description: 'Responding to and investigating incidents',
    responsibilities: [
      { id: 'ir1', text: 'Investigate laser incidents and accidents', frequency: 'as-needed', critical: true },
      { id: 'ir2', text: 'Implement corrective actions', frequency: 'as-needed', critical: true },
      { id: 'ir3', text: 'Report incidents to regulatory authorities', frequency: 'as-needed', critical: true },
      { id: 'ir4', text: 'Conduct post-incident safety reviews', frequency: 'as-needed', critical: false },
      { id: 'ir5', text: 'Maintain incident documentation', frequency: 'as-needed', critical: true },
      { id: 'ir6', text: 'Coordinate medical evaluations for exposures', frequency: 'as-needed', critical: true },
    ]
  },
  {
    id: 'admin',
    name: 'Program Administration',
    icon: '📋',
    description: 'Managing the laser safety program',
    responsibilities: [
      { id: 'pa1', text: 'Develop and maintain laser safety manual', frequency: 'annual', critical: true },
      { id: 'pa2', text: 'Conduct periodic safety audits', frequency: 'annual', critical: true },
      { id: 'pa3', text: 'Ensure regulatory compliance (FDA, OSHA, state)', frequency: 'annual', critical: true },
      { id: 'pa4', text: 'Maintain equipment inventory and documentation', frequency: 'annual', critical: false },
      { id: 'pa5', text: 'Coordinate with medical surveillance providers', frequency: 'annual', critical: false },
      { id: 'pa6', text: 'Manage laser safety budget', frequency: 'annual', critical: false },
    ]
  }
];

const FREQUENCY_COLORS: Record<string, string> = {
  'daily': '#F44336',
  'weekly': '#FF9800',
  'monthly': '#2196F3',
  'annual': '#4CAF50',
  'as-needed': '#9C27B0'
};

const LSOResponsibilityMatrix: React.FC = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>('hazard-eval');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [showFrequency, setShowFrequency] = useState(true);

  const toggleCategory = (categoryId: string) => {
    setExpandedCategory(expandedCategory === categoryId ? null : categoryId);
  };

  const toggleItem = (itemId: string) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const checkAllInCategory = (category: Category) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      category.responsibilities.forEach(r => newSet.add(r.id));
      return newSet;
    });
  };

  const uncheckAllInCategory = (category: Category) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      category.responsibilities.forEach(r => newSet.delete(r.id));
      return newSet;
    });
  };

  const resetAll = () => {
    setCheckedItems(new Set());
  };

  const totalItems = CATEGORIES.reduce((acc, cat) => acc + cat.responsibilities.length, 0);
  const progress = (checkedItems.size / totalItems) * 100;

  return (
    <div className="lso-matrix">
      <div className="matrix-header">
        <h2>LSO Responsibility Matrix</h2>
        <p className="subtitle">
          Interactive checklist of Laser Safety Officer duties by category
        </p>
      </div>

      {/* Progress Bar */}
      <div className="progress-section">
        <div className="progress-bar-container">
          <div 
            className="progress-bar"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="progress-stats">
          <span>{checkedItems.size} of {totalItems} responsibilities reviewed</span>
          <button className="btn-reset" onClick={resetAll}>Reset</button>
        </div>
      </div>

      {/* View Options */}
      <div className="view-options">
        <label className="toggle-switch">
          <input 
            type="checkbox" 
            checked={showFrequency}
            onChange={(e) => setShowFrequency(e.target.checked)}
          />
          <span className="toggle-label">Show frequency indicators</span>
        </label>
      </div>

      {/* Categories */}
      <div className="categories-container">
        {CATEGORIES.map(category => {
          const isExpanded = expandedCategory === category.id;
          const categoryChecked = category.responsibilities.filter(r => checkedItems.has(r.id));
          const allChecked = categoryChecked.length === category.responsibilities.length;

          return (
            <div 
              key={category.id}
              className={`category-card ${isExpanded ? 'expanded' : ''}`}
            >
              <div 
                className="category-header"
                onClick={() => toggleCategory(category.id)}
              >
                <div className="category-icon">{category.icon}</div>
                <div className="category-info">
                  <h3>{category.name}</h3>
                  <p>{category.description}</p>
                  <div className="category-progress">
                    {categoryChecked.length}/{category.responsibilities.length} reviewed
                  </div>
                </div>
                <div className="category-actions">
                  {isExpanded ? (
                    <>
                      <button 
                        className="btn-check-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          checkAllInCategory(category);
                        }}
                      >
                        Check All
                      </button>
                      <button 
                        className="btn-uncheck-all"
                        onClick={(e) => {
                          e.stopPropagation();
                          uncheckAllInCategory(category);
                        }}
                      >
                        Clear
                      </button>
                    </>
                  ) : (
                    <span className="expand-hint">Click to expand</span>
                  )}
                  <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>
                    ▼
                  </span>
                </div>
              </div>

              {isExpanded && (
                <div className="responsibilities-list">
                  {category.responsibilities.map(responsibility => (
                    <div 
                      key={responsibility.id}
                      className={`responsibility-item ${checkedItems.has(responsibility.id) ? 'checked' : ''} ${responsibility.critical ? 'critical' : ''}`}
                      onClick={() => toggleItem(responsibility.id)}
                    >
                      <div className="checkbox">
                        {checkedItems.has(responsibility.id) && '✓'}
                      </div>
                      <span className="responsibility-text">{responsibility.text}</span>
                      {showFrequency && (
                        <span 
                          className="frequency-badge"
                          style={{ backgroundColor: FREQUENCY_COLORS[responsibility.frequency] }}
                        >
                          {responsibility.frequency}
                        </span>
                      )}
                      {responsibility.critical && (
                        <span className="critical-badge" title="Critical responsibility">
                          ⚠️
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Section */}
      <div className="matrix-summary">
        <h3>LSO Role Summary</h3>
        <div className="summary-grid">
          <div className="summary-card">
            <div className="summary-icon">⚖️</div>
            <h4>Authority</h4>
            <p>The LSO has EXECUTIVE authority to stop laser operations, not merely advisory input.</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">📊</div>
            <h4>Accountability</h4>
            <p>The LSO is accountable for the overall laser safety program effectiveness.</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">🎓</div>
            <h4>Competency</h4>
            <p>Must demonstrate knowledge in laser physics, bioeffects, controls, and regulations.</p>
          </div>
          <div className="summary-card">
            <div className="summary-icon">⚡</div>
            <h4>Immediate Action</h4>
            <p>Can immediately halt any laser operation deemed unsafe without needing further approval.</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="matrix-legend">
        <h4>Frequency Legend:</h4>
        <div className="legend-items">
          {Object.entries(FREQUENCY_COLORS).map(([freq, color]) => (
            <div key={freq} className="legend-item">
              <span className="legend-color" style={{ backgroundColor: color }} />
              <span className="legend-text">{freq}</span>
            </div>
          ))}
        </div>
        <div className="legend-note">
          <span className="critical-indicator">⚠️</span>
          <span>Critical responsibilities that must be performed without exception</span>
        </div>
      </div>
    </div>
  );
};

export default LSOResponsibilityMatrix;
