/**
 * ComprehensiveReview Component
 * 
 * Final review component that synthesizes all course material
 * into quick-reference summaries and checklists.
 */

import React, { useState } from 'react';
import { knowledgeDomains } from '../data';

export const ComprehensiveReview: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'quick-ref' | 'checklists' | 'formulas' | 'resources'>('quick-ref');

  const renderQuickRef = () => (
    <div className="quick-reference">
      <h3>Quick Reference Guide</h3>
      
      <div className="ref-section">
        <h4>Laser Classification Summary</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Power Range</th>
              <th>Hazard Level</th>
              <th>Key Requirements</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Class 1</td>
              <td>&lt; 0.39 µW</td>
              <td>None (enclosed)</td>
              <td>Minimal labeling</td>
            </tr>
            <tr>
              <td>Class 2</td>
              <td>&lt; 1 mW visible</td>
              <td>Low (blink reflex)</td>
              <td>CAUTION label</td>
            </tr>
            <tr>
              <td>Class 3R</td>
              <td>1-5 mW visible</td>
              <td>Low-Moderate</td>
              <td>CAUTION label</td>
            </tr>
            <tr>
              <td>Class 3B</td>
              <td>5-500 mW</td>
              <td>Moderate-High</td>
              <td>DANGER, key control, interlocks</td>
            </tr>
            <tr>
              <td>Class 4</td>
              <td>&gt; 500 mW</td>
              <td>High-Critical</td>
              <td>DANGER, all safety features, LSO required</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ref-section">
        <h4>Hazard Region Summary</h4>
        <table className="ref-table">
          <thead>
            <tr>
              <th>Wavelength</th>
              <th>Region</th>
              <th>Primary Effect</th>
              <th>Structure Affected</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>180-400 nm</td>
              <td>UV</td>
              <td>Photochemical</td>
              <td>Cornea, lens</td>
            </tr>
            <tr>
              <td>400-700 nm</td>
              <td>Visible</td>
              <td>Thermal/Photochemical</td>
              <td>Retina</td>
            </tr>
            <tr>
              <td>700-1400 nm</td>
              <td>Near-IR</td>
              <td>Thermal</td>
              <td>Retina</td>
            </tr>
            <tr>
              <td>1400 nm - 1 mm</td>
              <td>Mid-to-Far IR</td>
              <td>Thermal</td>
              <td>Cornea</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="ref-section">
        <h4>Critical Safety Distances</h4>
        <ul className="key-list">
          <li><strong>NOHD:</strong> Distance where irradiance falls below MPE</li>
          <li><strong>NHZ:</strong> Nominal Hazard Zone - area where MPE is exceeded</li>
          <li><strong>Indoor Separation (supervised):</strong> 3m vertical, 2.5m horizontal</li>
          <li><strong>Indoor Separation (unattended):</strong> 6m vertical, 2.5m horizontal</li>
        </ul>
      </div>

      <div className="ref-section">
        <h4>LSO Key Responsibilities</h4>
        <ul className="key-list">
          <li>Executive authority (not just advisory)</li>
          <li>Hazard evaluation and classification</li>
          <li>Approve SOPs and safety procedures</li>
          <li>Investigate incidents and near-misses</li>
          <li>Ensure training and medical surveillance</li>
          <li>Audit and inspect laser operations</li>
          <li>Act as liaison with regulatory agencies</li>
        </ul>
      </div>
    </div>
  );

  const renderChecklists = () => (
    <div className="checklists">
      <h3>Pre-Operations Checklists</h3>

      <div className="checklist-card">
        <h4>Daily Pre-Show Safety Checklist</h4>
        <ul className="checklist">
          <li>☐ FDA variance verified (if required)</li>
          <li>☐ Required notifications sent</li>
          <li>☐ LSO present with executive authority</li>
          <li>☐ Operators briefed on emergency procedures</li>
          <li>☐ Scan failure detection tested</li>
          <li>☐ E-stop functionality verified</li>
          <li>☐ Key control operational</li>
          <li>☐ Separation distances measured</li>
          <li>☐ All labels present and legible</li>
          <li>☐ Power cords and connections inspected</li>
          <li>☐ Protective equipment available</li>
          <li>☐ First aid kit accessible</li>
          <li>☐ Emergency contacts posted</li>
        </ul>
      </div>

      <div className="checklist-card">
        <h4>LSO Program Audit Checklist</h4>
        <ul className="checklist">
          <li>☐ LSO designation current and documented</li>
          <li>☐ Training records complete and current</li>
          <li>☐ SOPs reviewed within last year</li>
          <li>☐ Hazard assessments current</li>
          <li>☐ Incident reports filed and reviewed</li>
          <li>☐ Medical surveillance current (if required)</li>
          <li>☐ Protective equipment inventory current</li>
          <li>☐ Equipment maintenance logs current</li>
          <li>☐ Regulatory compliance documentation complete</li>
        </ul>
      </div>

      <div className="checklist-card">
        <h4>Documentation Review Checklist</h4>
        <ul className="checklist">
          <li>☐ Risk assessments on file</li>
          <li>☐ MPE calculations documented</li>
          <li>☐ Standard Operating Procedures current</li>
          <li>☐ Training documentation complete</li>
          <li>☐ Emergency procedures posted</li>
          <li>☐ Equipment certification records</li>
          <li>☐ Variance documentation (if applicable)</li>
          <li>☐ Inspection and test records</li>
        </ul>
      </div>
    </div>
  );

  const renderFormulas = () => (
    <div className="formulas">
      <h3>Key Formulas and Calculations</h3>

      <div className="formula-card">
        <h4>Optical Density (OD)</h4>
        <div className="formula">OD = log₁₀(H₀ / MPE)</div>
        <p className="formula-desc">
          Where H₀ is the anticipated exposure and MPE is the maximum permissible exposure
        </p>
        <div className="formula-example">
          <strong>Example:</strong> For 10 W/cm² exposure with MPE of 1 mW/cm²:<br />
          OD = log₁₀(10,000 / 1) = log₁₀(10,000) = 4
        </div>
      </div>

      <div className="formula-card">
        <h4>Nominal Ocular Hazard Distance (NOHD)</h4>
        <div className="formula">NOHD = (1/φ) × √(4 × Φ / (π × MPE))</div>
        <p className="formula-desc">
          Where φ is beam divergence (rad), Φ is power (W), MPE is in W/m²
        </p>
        <p className="formula-note">
          Note: Use ANSI Z136.1 tables for specific MPE values based on wavelength and exposure time
        </p>
      </div>

      <div className="formula-card">
        <h4>Irradiance (E) at Distance</h4>
        <div className="formula">E = Φ / (π × (r × φ/2)²)</div>
        <p className="formula-desc">
          Approximate irradiance at distance r for a diverging beam
        </p>
      </div>

      <div className="formula-card">
        <h4>Attenuation Through Eyewear</h4>
        <div className="formula">T = 10^(-OD)</div>
        <p className="formula-desc">
          Where T is transmittance and OD is optical density
        </p>
        <div className="formula-example">
          <strong>Example:</strong> For OD 4 eyewear:<br />
          T = 10^(-4) = 0.0001 (0.01% transmission)
        </div>
      </div>

      <div className="formula-card">
        <h4>Blink Reflex Time</h4>
        <div className="key-value">0.25 seconds (250 ms)</div>
        <p className="formula-desc">
          Maximum exposure time used for MPE calculations for CW visible lasers with Class 2 and some Class 3R
        </p>
      </div>
    </div>
  );

  const renderResources = () => (
    <div className="resources">
      <h3>Additional Study Resources</h3>

      <div className="resource-section">
        <h4>Key Standards Documents</h4>
        <ul>
          <li>
            <strong>ANSI Z136.1</strong> - Safe Use of Lasers (Foundation standard)
          </li>
          <li>
            <strong>ANSI Z136.10</strong> - Safe Use of Lasers in Entertainment
          </li>
          <li>
            <strong>21 CFR 1040.10/11</strong> - FDA Laser Product Performance Standard
          </li>
          <li>
            <strong>IEC 60825-1</strong> - International laser safety standard
          </li>
          <li>
            <strong>NFPA 70E</strong> - Electrical safety in the workplace
          </li>
        </ul>
      </div>

      <div className="resource-section">
        <h4>Certification Information</h4>
        <ul>
          <li>
            <strong>CLSO</strong> - Certified Laser Safety Officer (Board of Laser Safety)
          </li>
          <li>
            <strong>CMLSO</strong> - Certified Medical Laser Safety Officer
          </li>
          <li>
            Exam format: Multiple choice, scenario-based
          </li>
          <li>
            Study recommendation: 100+ hours for comprehensive preparation
          </li>
        </ul>
      </div>

      <div className="resource-section">
        <h4>Professional Organizations</h4>
        <ul>
          <li>Laser Institute of America (LIA) - www.laserinstitute.org</li>
          <li>Board of Laser Safety (BLS) - Certified credentialing</li>
          <li>ESTA - Entertainment Services and Technology Association</li>
          <li>IES - Illuminating Engineering Society</li>
        </ul>
      </div>

      <div className="resource-section">
        <h4>Study Tips for Certification</h4>
        <ol>
          <li>Focus on understanding, not memorization</li>
          <li>Practice calculations regularly</li>
          <li>Review ANSI Z136.1 tables thoroughly</li>
          <li>Take multiple practice exams under timed conditions</li>
          <li>Study weak areas identified in gap analysis</li>
          <li>Join study groups or online forums</li>
          <li>Review incorrect answers to understand reasoning</li>
        </ol>
      </div>
    </div>
  );

  return (
    <div className="comprehensive-review">
      <div className="review-tabs">
        <button 
          className={activeTab === 'quick-ref' ? 'active' : ''}
          onClick={() => setActiveTab('quick-ref')}
        >
          Quick Reference
        </button>
        <button 
          className={activeTab === 'checklists' ? 'active' : ''}
          onClick={() => setActiveTab('checklists')}
        >
          Checklists
        </button>
        <button 
          className={activeTab === 'formulas' ? 'active' : ''}
          onClick={() => setActiveTab('formulas')}
        >
          Formulas
        </button>
        <button 
          className={activeTab === 'resources' ? 'active' : ''}
          onClick={() => setActiveTab('resources')}
        >
          Resources
        </button>
      </div>

      <div className="review-content">
        {activeTab === 'quick-ref' && renderQuickRef()}
        {activeTab === 'checklists' && renderChecklists()}
        {activeTab === 'formulas' && renderFormulas()}
        {activeTab === 'resources' && renderResources()}
      </div>
    </div>
  );
};
