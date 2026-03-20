/**
 * ChecklistGenerator Component
 * 
 * Interactive tool for generating operation-specific compliance checklists
 * based on operation type and regulatory requirements.
 */

import React, { useState, useMemo } from 'react';
import { ChecklistItem, OperationType } from '../types';
import { checklistItems, operationTypes } from '../data';

interface ChecklistGeneratorProps {
  onGenerate?: (checklist: GeneratedChecklist) => void;
  allowExport?: boolean;
}

export interface GeneratedChecklist {
  operationType: OperationType;
  items: ChecklistItem[];
  completed: boolean[];
  notes: string[];
  generatedAt: Date;
}

export const ChecklistGenerator: React.FC<ChecklistGeneratorProps> = ({
  onGenerate,
  allowExport = true
}) => {
  const [selectedOperation, setSelectedOperation] = useState<string>('');
  const [completed, setCompleted] = useState<boolean[]>([]);
  const [notes, setNotes] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const selectedOp = useMemo(() => 
    operationTypes.find(op => op.id === selectedOperation),
    [selectedOperation]
  );

  const filteredItems = useMemo(() => {
    if (!selectedOp) return [];
    
    return checklistItems.filter(item => 
      selectedOp.applicableChecklists.includes(item.category) &&
      (activeCategory === 'all' || item.category === activeCategory)
    );
  }, [selectedOp, activeCategory]);

  const categories = useMemo(() => {
    if (!selectedOp) return [];
    const cats = new Set(selectedOp.applicableChecklists);
    return Array.from(cats);
  }, [selectedOp]);

  const handleOperationChange = (opId: string) => {
    setSelectedOperation(opId);
    const op = operationTypes.find(o => o.id === opId);
    if (op) {
      const items = checklistItems.filter(item => 
        op.applicableChecklists.includes(item.category)
      );
      setCompleted(new Array(items.length).fill(false));
      setNotes(new Array(items.length).fill(''));
    }
  };

  const toggleItem = (index: number) => {
    setCompleted(prev => {
      const next = [...prev];
      next[index] = !next[index];
      return next;
    });
  };

  const updateNote = (index: number, note: string) => {
    setNotes(prev => {
      const next = [...prev];
      next[index] = note;
      return next;
    });
  };

  const completionPercentage = useMemo(() => {
    if (completed.length === 0) return 0;
    return Math.round((completed.filter(c => c).length / completed.length) * 100);
  }, [completed]);

  const generateChecklist = () => {
    if (!selectedOp) return;
    
    const checklist: GeneratedChecklist = {
      operationType: selectedOp,
      items: filteredItems,
      completed,
      notes,
      generatedAt: new Date()
    };
    
    onGenerate?.(checklist);
  };

  const exportChecklist = () => {
    if (!selectedOp) return;
    
    const content = [
      `COMPLIANCE CHECKLIST - ${selectedOp.name}`,
      `Generated: ${new Date().toLocaleString()}`,
      '',
      `Completion: ${completionPercentage}%`,
      '',
      'CHECKLIST ITEMS:',
      '================',
      ...filteredItems.map((item, idx) => [
        `[${completed[idx] ? 'X' : ' '}] ${item.description}`,
        `    Regulation: ${item.regulation}`,
        `    Verification: ${item.verificationMethod}`,
        `    Frequency: ${item.frequency}`,
        notes[idx] ? `    Notes: ${notes[idx]}` : ''
      ].join('\n'))
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `checklist-${selectedOp.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getCategoryLabel = (cat: string) => {
    const labels: Record<string, string> = {
      'pre-show': 'Pre-Show',
      'safety-systems': 'Safety Systems',
      'documentation': 'Documentation',
      'emergency': 'Emergency Preparedness',
      'aviation': 'Aviation (Outdoor)',
      'maintenance': 'Maintenance',
      'travel': 'Travel/Touring'
    };
    return labels[cat] || cat;
  };

  return (
    <div className="checklist-generator">
      <div className="operation-selector">
        <label htmlFor="operation-type">Select Operation Type:</label>
        <select
          id="operation-type"
          value={selectedOperation}
          onChange={(e) => handleOperationChange(e.target.value)}
        >
          <option value="">-- Select Operation Type --</option>
          {operationTypes.map(op => (
            <option key={op.id} value={op.id}>{op.name}</option>
          ))}
        </select>
        
        {selectedOp && (
          <div className="operation-details">
            <p className="description">{selectedOp.description}</p>
            <div className="specific-requirements">
              <h4>Specific Requirements:</h4>
              <ul>
                {selectedOp.specificRequirements.map((req, idx) => (
                  <li key={idx}>{req}</li>
                ))}
              </ul>
            </div>
            <div className="notification-requirements">
              <h4>Notification Requirements:</h4>
              {selectedOp.notificationRequirements.map((notif, idx) => (
                <div key={idx} className="notification-item">
                  <strong>{notif.authority}</strong>: {notif.timing}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {selectedOp && (
        <>
          <div className="category-filter">
            <label>Filter by Category:</label>
            <select
              value={activeCategory}
              onChange={(e) => setActiveCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>{getCategoryLabel(cat)}</option>
              ))}
            </select>
          </div>

          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${completionPercentage}%` }}
            />
            <span className="progress-text">{completionPercentage}% Complete</span>
          </div>

          <div className="checklist-items">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id} 
                className={`checklist-item ${item.required ? 'required' : ''} ${completed[index] ? 'completed' : ''}`}
              >
                <div className="item-header">
                  <input
                    type="checkbox"
                    checked={completed[index] || false}
                    onChange={() => toggleItem(index)}
                    id={`chk-${item.id}`}
                  />
                  <label htmlFor={`chk-${item.id}`} className="item-description">
                    {item.description}
                    {item.required && <span className="required-badge">Required</span>}
                  </label>
                </div>
                <div className="item-details">
                  <div className="detail-row">
                    <span className="detail-label">Regulation:</span>
                    <span className="detail-value">{item.regulation}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Verification:</span>
                    <span className="detail-value">{item.verificationMethod}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label">Frequency:</span>
                    <span className="detail-value">{item.frequency}</span>
                  </div>
                </div>
                <div className="item-notes">
                  <input
                    type="text"
                    placeholder="Add notes..."
                    value={notes[index] || ''}
                    onChange={(e) => updateNote(index, e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="action-buttons">
            <button 
              className="btn-generate"
              onClick={generateChecklist}
              disabled={completionPercentage < 100}
            >
              Generate Checklist Report
            </button>
            {allowExport && (
              <button 
                className="btn-export"
                onClick={exportChecklist}
              >
                Export to File
              </button>
            )}
          </div>

          {completionPercentage < 100 && (
            <div className="warning-message">
              All required items must be completed before generating final report.
            </div>
          )}
        </>
      )}
    </div>
  );
};
