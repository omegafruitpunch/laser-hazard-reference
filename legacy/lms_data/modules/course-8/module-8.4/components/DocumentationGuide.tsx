/**
 * DocumentationGuide Component
 * 
 * Educational guide explaining documentation requirements
 * and best practices for compliance.
 */

import React, { useState } from 'react';
import { documentationPackages } from '../data';

export const DocumentationGuide: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [selectedPackage, setSelectedPackage] = useState<string>('');

  const renderOverview = () => (
    <div className="guide-section">
      <h3>Documentation Overview</h3>
      <p>
        Proper documentation is essential for regulatory compliance and operational safety 
        in laser entertainment. This guide covers the key documents required for various 
        types of laser operations.
      </p>
      
      <div className="key-principles">
        <h4>Key Documentation Principles</h4>
        <ul>
          <li>
            <strong>Documentation must be current and accessible</strong> - All required 
            documents should be available on-site during operations.
          </li>
          <li>
            <strong>Records must be accurate and complete</strong> - Incomplete or falsified 
            records can result in regulatory violations.
          </li>
          <li>
            <strong>Retention periods must be observed</strong> - Different documents have 
            different retention requirements.
          </li>
          <li>
            <strong>Documentation demonstrates due diligence</strong> - Complete records show 
            commitment to safety and compliance.
          </li>
        </ul>
      </div>

      <div className="regulatory-basis">
        <h4>Regulatory Basis</h4>
        <table className="regulatory-table">
          <thead>
            <tr>
              <th>Regulation</th>
              <th>Documentation Requirement</th>
              <th>Penalty for Non-Compliance</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>21 CFR 1002.30</td>
              <td>Notification records</td>
              <td>Warning letter to injunction</td>
            </tr>
            <tr>
              <td>21 CFR 1040.11</td>
              <td>Variance documentation, test records</td>
              <td>Up to $300,000 civil penalty</td>
            </tr>
            <tr>
              <td>ANSI Z136.1</td>
              <td>Risk assessment, SOPs, training records</td>
              <td>Industry standard enforcement</td>
            </tr>
            <tr>
              <td>ANSI E1.46</td>
              <td>Hand-over documentation, emergency procedures</td>
              <td>Professional liability</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderRequiredDocs = () => (
    <div className="guide-section">
      <h3>Required Documents by Operation Type</h3>
      
      <div className="package-selector">
        <label>Select Operation Type:</label>
        <select
          value={selectedPackage}
          onChange={(e) => setSelectedPackage(e.target.value)}
        >
          <option value="">-- Select to view requirements --</option>
          {documentationPackages.map(pkg => (
            <option key={pkg.id} value={pkg.id}>{pkg.name}</option>
          ))}
        </select>
      </div>

      {selectedPackage && documentationPackages
        .filter(pkg => pkg.id === selectedPackage)
        .map(pkg => (
          <div key={pkg.id} className="package-details">
            <h4>{pkg.name}</h4>
            <p>{pkg.description}</p>
            
            <table className="documents-table">
              <thead>
                <tr>
                  <th>Document</th>
                  <th>Required</th>
                  <th>Retention Period</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {pkg.documents.map(doc => (
                  <tr key={doc.id} className={doc.required ? 'required' : 'optional'}>
                    <td>{doc.name}</td>
                    <td>{doc.required ? 'Yes' : 'No'}</td>
                    <td>{doc.retentionPeriod}</td>
                    <td>{doc.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}

      {!selectedPackage && (
        <div className="quick-reference">
          <h4>Quick Reference - Universal Requirements</h4>
          <p>All laser operations should maintain:</p>
          <ul>
            <li>Risk assessment documentation</li>
            <li>Standard Operating Procedures (SOPs)</li>
            <li>Training records for all personnel</li>
            <li>Emergency response procedures</li>
            <li>Equipment maintenance logs</li>
            <li>Incident reports (if applicable)</li>
          </ul>
        </div>
      )}
    </div>
  );

  const renderBestPractices = () => (
    <div className="guide-section">
      <h3>Documentation Best Practices</h3>
      
      <div className="practice-category">
        <h4>Creating Effective SOPs</h4>
        <ul>
          <li>Use clear, action-oriented language</li>
          <li>Include step-by-step procedures</li>
          <li>Specify responsible parties</li>
          <li>Reference applicable regulations</li>
          <li>Include hazard warnings and PPE requirements</li>
          <li>Regular review and update schedule</li>
          <li>Version control for document tracking</li>
        </ul>
      </div>

      <div className="practice-category">
        <h4>Record Keeping Tips</h4>
        <ul>
          <li>Use standardized forms where possible</li>
          <li>Ensure legibility (print if handwriting is unclear)</li>
          <li>Date and sign all entries</li>
          <li>Make corrections properly (line through, initial, date)</li>
          <li>Never use white-out or obliterate errors</li>
          <li>Store in secure, accessible location</li>
          <li>Consider electronic systems with audit trails</li>
        </ul>
      </div>

      <div className="practice-category">
        <h4>Preparing for Inspections</h4>
        <ul>
          <li>Organize documents in logical sequence</li>
          <li>Prepare document index or table of contents</li>
          <li>Have key personnel available</li>
          <li>Be prepared to demonstrate safety systems</li>
          <li>Know where to find specific information quickly</li>
          <li>Have recent test records readily available</li>
        </ul>
      </div>

      <div className="common-deficiencies">
        <h4>Common Documentation Deficiencies</h4>
        <table className="deficiency-table">
          <thead>
            <tr>
              <th>Deficiency</th>
              <th>Severity</th>
              <th>Prevention</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Missing or expired variance documentation</td>
              <td className="critical">Critical</td>
              <td>Track expiration dates, calendar reminders</td>
            </tr>
            <tr>
              <td>Incomplete training records</td>
              <td className="major">Major</td>
              <td>Standardized training checklists</td>
            </tr>
            <tr>
              <td>Missing pre-show checklists</td>
              <td className="major">Major</td>
              <td>Make part of daily routine, cannot start without</td>
            </tr>
            <tr>
              <td>Outdated SOPs</td>
              <td className="minor">Minor</td>
              <td>Annual review requirement, version control</td>
            </tr>
            <tr>
              <td>Illegible records</td>
              <td className="minor">Minor</td>
              <td>Training on proper record keeping, consider electronic</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );

  return (
    <div className="documentation-guide">
      <div className="guide-tabs">
        <button 
          className={activeTab === 'overview' ? 'active' : ''}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button 
          className={activeTab === 'required' ? 'active' : ''}
          onClick={() => setActiveTab('required')}
        >
          Required Documents
        </button>
        <button 
          className={activeTab === 'best-practices' ? 'active' : ''}
          onClick={() => setActiveTab('best-practices')}
        >
          Best Practices
        </button>
      </div>

      <div className="guide-content">
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'required' && renderRequiredDocs()}
        {activeTab === 'best-practices' && renderBestPractices()}
      </div>
    </div>
  );
};
