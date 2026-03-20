/**
 * ElectricalInspectionTool Component
 * 
 * Interactive inspection tool for electrical safety assessment
 * of laser equipment and installations.
 */

import React, { useState, useMemo } from 'react';
import { InspectionChecklist, InspectionResult, InspectionReport } from '../types';
import { inspectionChecklist, equipmentCategories } from '../data';

interface ElectricalInspectionToolProps {
  onComplete?: (report: InspectionReport) => void;
  allowExport?: boolean;
}

export const ElectricalInspectionTool: React.FC<ElectricalInspectionToolProps> = ({
  onComplete,
  allowExport = true
}) => {
  const [equipmentId, setEquipmentId] = useState('');
  const [equipmentType, setEquipmentType] = useState('');
  const [location, setLocation] = useState('');
  const [inspectorName, setInspectorName] = useState('');
  const [inspectorCert, setInspectorCert] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [results, setResults] = useState<Record<string, InspectionResult>>({});
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [newRecommendation, setNewRecommendation] = useState('');
  const [isComplete, setIsComplete] = useState(false);

  const categories = useMemo(() => {
    const cats = new Set(inspectionChecklist.map(item => item.category));
    return Array.from(cats);
  }, []);

  const filteredItems = useMemo(() => {
    if (activeCategory === 'all') return inspectionChecklist;
    return inspectionChecklist.filter(item => item.category === activeCategory);
  }, [activeCategory]);

  const updateResult = (checklistId: string, updates: Partial<InspectionResult>) => {
    setResults(prev => ({
      ...prev,
      [checklistId]: {
        ...prev[checklistId],
        checklistId,
        ...updates,
        inspectedAt: new Date()
      } as InspectionResult
    }));
  };

  const addRecommendation = () => {
    if (newRecommendation.trim()) {
      setRecommendations(prev => [...prev, newRecommendation.trim()]);
      setNewRecommendation('');
    }
  };

  const removeRecommendation = (index: number) => {
    setRecommendations(prev => prev.filter((_, i) => i !== index));
  };

  const completionPercentage = useMemo(() => {
    const total = filteredItems.length;
    const completed = filteredItems.filter(item => results[item.id]?.passed !== undefined).length;
    return Math.round((completed / total) * 100);
  }, [filteredItems, results]);

  const overallStatus = useMemo((): 'pass' | 'conditional' | 'fail' => {
    const findings = Object.values(results);
    if (findings.length === 0) return 'fail';
    
    const criticalFails = findings.some((r, idx) => {
      const item = inspectionChecklist.find(i => i.id === r.checklistId);
      return !r.passed && item?.hazardLevel === 'critical';
    });
    
    if (criticalFails) return 'fail';
    
    const anyFails = findings.some(r => !r.passed);
    return anyFails ? 'conditional' : 'pass';
  }, [results]);

  const generateReport = () => {
    const report: InspectionReport = {
      id: `RPT-${Date.now()}`,
      equipmentId,
      equipmentType,
      location,
      inspectionDate: new Date(),
      nextInspectionDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      overallStatus,
      findings: Object.values(results),
      recommendations,
      inspectorName,
      inspectorCertification: inspectorCert
    };

    setIsComplete(true);
    onComplete?.(report);
    return report;
  };

  const exportReport = () => {
    const report = generateReport();
    
    const content = [
      `ELECTRICAL SAFETY INSPECTION REPORT`,
      `=====================================`,
      ``,
      `Report ID: ${report.id}`,
      `Equipment ID: ${equipmentId}`,
      `Equipment Type: ${equipmentType}`,
      `Location: ${location}`,
      ``,
      `Inspection Date: ${report.inspectionDate.toLocaleString()}`,
      `Next Inspection: ${report.nextInspectionDate.toLocaleString()}`,
      `Inspector: ${inspectorName}`,
      `Certification: ${inspectorCert}`,
      ``,
      `OVERALL STATUS: ${overallStatus.toUpperCase()}`,
      ``,
      `FINDINGS:`,
      `---------`,
      ...filteredItems.map(item => {
        const result = results[item.id];
        return [
          `[${result?.passed === true ? 'PASS' : result?.passed === false ? 'FAIL' : 'PENDING'}] ${item.item}`,
          `    Category: ${item.category}`,
          `    Hazard Level: ${item.hazardLevel.toUpperCase()}`,
          `    Method: ${item.inspectionMethod}`,
          result?.notes ? `    Notes: ${result.notes}` : '',
          ''
        ].join('\n');
      }),
      ``,
      `RECOMMENDATIONS:`,
      `----------------`,
      ...(recommendations.length > 0 
        ? recommendations.map((r, i) => `${i + 1}. ${r}`)
        : ['None']),
      ``
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `electrical-inspection-${equipmentId || 'report'}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getHazardClass = (level: string) => {
    switch (level) {
      case 'critical': return 'hazard-critical';
      case 'high': return 'hazard-high';
      case 'medium': return 'hazard-medium';
      case 'low': return 'hazard-low';
      default: return '';
    }
  };

  const canComplete = equipmentId && equipmentType && inspectorName && completionPercentage === 100;

  return (
    <div className="electrical-inspection-tool">
      <div className="inspection-header-form">
        <h3>Inspection Information</h3>
        <div className="form-grid">
          <div className="form-field">
            <label>Equipment ID:*</label>
            <input
              type="text"
              value={equipmentId}
              onChange={(e) => setEquipmentId(e.target.value)}
              placeholder="e.g., LASER-001"
            />
          </div>
          <div className="form-field">
            <label>Equipment Type:*</label>
            <select
              value={equipmentType}
              onChange={(e) => setEquipmentType(e.target.value)}
            >
              <option value="">-- Select Type --</option>
              {equipmentCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div className="form-field">
            <label>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Venue/Room location"
            />
          </div>
          <div className="form-field">
            <label>Inspector Name:*</label>
            <input
              type="text"
              value={inspectorName}
              onChange={(e) => setInspectorName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="form-field">
            <label>Certification:</label>
            <input
              type="text"
              value={inspectorCert}
              onChange={(e) => setInspectorCert(e.target.value)}
              placeholder="e.g., Licensed Electrician"
            />
          </div>
        </div>
      </div>

      <div className="category-filter">
        <label>Filter by Category:</label>
        <select
          value={activeCategory}
          onChange={(e) => setActiveCategory(e.target.value)}
        >
          <option value="all">All Categories</option>
          {categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
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

      <div className="inspection-items">
        {filteredItems.map(item => {
          const result = results[item.id];
          return (
            <div 
              key={item.id} 
              className={`inspection-item ${getHazardClass(item.hazardLevel)} ${result?.passed === true ? 'passed' : result?.passed === false ? 'failed' : ''}`}
            >
              <div className="item-header">
                <span className={`hazard-badge ${getHazardClass(item.hazardLevel)}`}>
                  {item.hazardLevel.toUpperCase()}
                </span>
                <span className="category-label">{item.category}</span>
              </div>
              
              <p className="item-description">{item.item}</p>
              
              <div className="item-details">
                <div className="detail-row">
                  <span className="detail-label">Inspection Method:</span>
                  <span className="detail-value">{item.inspectionMethod}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Pass Criteria:</span>
                  <span className="detail-value">{item.passCriteria}</span>
                </div>
                <div className="detail-row">
                  <span className="detail-label">Frequency:</span>
                  <span className="detail-value">{item.frequency}</span>
                </div>
              </div>

              <div className="compliance-selection">
                <label>Result:</label>
                <div className="compliance-buttons">
                  <button
                    className={`result-btn ${result?.passed === true ? 'selected' : ''}`}
                    onClick={() => updateResult(item.id, { passed: true, inspectedBy: inspectorName })}
                  >
                    Pass
                  </button>
                  <button
                    className={`result-btn ${result?.passed === false ? 'selected' : ''}`}
                    onClick={() => updateResult(item.id, { passed: false, inspectedBy: inspectorName })}
                  >
                    Fail
                  </button>
                </div>
              </div>

              <div className="inspection-notes">
                <input
                  type="text"
                  placeholder="Inspection notes..."
                  value={result?.notes || ''}
                  onChange={(e) => updateResult(item.id, { notes: e.target.value })}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="recommendations-section">
        <h3>Recommendations</h3>
        <div className="add-recommendation">
          <input
            type="text"
            value={newRecommendation}
            onChange={(e) => setNewRecommendation(e.target.value)}
            placeholder="Add a recommendation..."
          />
          <button onClick={addRecommendation}>Add</button>
        </div>
        <ul className="recommendations-list">
          {recommendations.map((rec, idx) => (
            <li key={idx}>
              {rec}
              <button 
                className="btn-remove"
                onClick={() => removeRecommendation(idx)}
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="action-buttons">
        <button 
          className="btn-complete"
          onClick={generateReport}
          disabled={!canComplete}
        >
          Complete Inspection
        </button>
        {allowExport && (
          <button 
            className="btn-export"
            onClick={exportReport}
            disabled={!canComplete}
          >
            Export Report
          </button>
        )}
      </div>

      {isComplete && (
        <div className={`inspection-summary status-${overallStatus}`}>
          <h3>Inspection Complete</h3>
          <p>Overall Status: <strong>{overallStatus.toUpperCase()}</strong></p>
          {overallStatus === 'fail' && (
            <p className="warning">
              CRITICAL finding(s) identified. Equipment must not be operated until repairs are completed.
            </p>
          )}
          {overallStatus === 'conditional' && (
            <p className="caution">
              Non-critical deficiencies identified. Address recommendations before next inspection.
            </p>
          )}
        </div>
      )}
    </div>
  );
};
