/**
 * SOPTemplateBuilder Component
 * 
 * Interactive tool for building Standard Operating Procedures
 * based on templates and operation-specific customizations.
 */

import React, { useState, useMemo } from 'react';
import { SOPTemplate, SOPSection, SOPStep } from '../types';
import { sopTemplates } from '../data';

interface SOPTemplateBuilderProps {
  onBuild?: (sop: BuiltSOP) => void;
  allowExport?: boolean;
}

export interface BuiltSOP {
  template: SOPTemplate;
  customizations: SectionCustomization[];
  companyName: string;
  effectiveDate: string;
  reviewDate: string;
  approvedBy: string;
  sopId: string;
}

export interface SectionCustomization {
  sectionId: string;
  included: boolean;
  customNotes: string;
  customSteps: CustomStep[];
}

export interface CustomStep {
  originalStepId?: string;
  order: number;
  action: string;
  details: string;
  isNew: boolean;
}

export const SOPTemplateBuilder: React.FC<SOPTemplateBuilderProps> = ({
  onBuild,
  allowExport = true
}) => {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [companyName, setCompanyName] = useState('');
  const [effectiveDate, setEffectiveDate] = useState('');
  const [reviewDate, setReviewDate] = useState('');
  const [approvedBy, setApprovedBy] = useState('');
  const [sopId, setSopId] = useState('');
  const [sectionCustomizations, setSectionCustomizations] = useState<SectionCustomization[]>([]);
  const [activeSection, setActiveSection] = useState<string>('');

  const template = useMemo(() => 
    sopTemplates.find(t => t.id === selectedTemplate),
    [selectedTemplate]
  );

  const handleTemplateChange = (templateId: string) => {
    setSelectedTemplate(templateId);
    const t = sopTemplates.find(temp => temp.id === templateId);
    if (t) {
      setSectionCustomizations(
        t.sections.map(section => ({
          sectionId: section.id,
          included: true,
          customNotes: '',
          customSteps: section.steps.map(step => ({
            originalStepId: step.id,
            order: step.order,
            action: step.action,
            details: step.details,
            isNew: false
          }))
        }))
      );
    }
  };

  const toggleSection = (sectionId: string) => {
    setSectionCustomizations(prev =>
      prev.map(sc =>
        sc.sectionId === sectionId
          ? { ...sc, included: !sc.included }
          : sc
      )
    );
  };

  const updateSectionNotes = (sectionId: string, notes: string) => {
    setSectionCustomizations(prev =>
      prev.map(sc =>
        sc.sectionId === sectionId
          ? { ...sc, customNotes: notes }
          : sc
      )
    );
  };

  const updateStep = (sectionId: string, stepIndex: number, updates: Partial<CustomStep>) => {
    setSectionCustomizations(prev =>
      prev.map(sc => {
        if (sc.sectionId !== sectionId) return sc;
        const newSteps = [...sc.customSteps];
        newSteps[stepIndex] = { ...newSteps[stepIndex], ...updates };
        return { ...sc, customSteps: newSteps };
      })
    );
  };

  const addStep = (sectionId: string) => {
    setSectionCustomizations(prev =>
      prev.map(sc => {
        if (sc.sectionId !== sectionId) return sc;
        return {
          ...sc,
          customSteps: [
            ...sc.customSteps,
            {
              order: sc.customSteps.length + 1,
              action: '',
              details: '',
              isNew: true
            }
          ]
        };
      })
    );
  };

  const removeStep = (sectionId: string, stepIndex: number) => {
    setSectionCustomizations(prev =>
      prev.map(sc => {
        if (sc.sectionId !== sectionId) return sc;
        const newSteps = sc.customSteps.filter((_, idx) => idx !== stepIndex);
        // Reorder remaining steps
        return {
          ...sc,
          customSteps: newSteps.map((step, idx) => ({ ...step, order: idx + 1 }))
        };
      })
    );
  };

  const buildSOP = () => {
    if (!template || !companyName || !effectiveDate) return;

    const sop: BuiltSOP = {
      template,
      customizations: sectionCustomizations,
      companyName,
      effectiveDate,
      reviewDate,
      approvedBy,
      sopId: sopId || `${template.id}-${Date.now()}`
    };

    onBuild?.(sop);
  };

  const exportSOP = () => {
    if (!template) return;

    const content = [
      `STANDARD OPERATING PROCEDURE`,
      ``,
      `SOP ID: ${sopId || 'TBD'}`,
      `Title: ${template.name}`,
      `Company: ${companyName}`,
      ``,
      `Effective Date: ${effectiveDate}`,
      `Review Date: ${reviewDate || 'Annual'}`,
      `Approved By: ${approvedBy}`,
      ``,
      `Description:`,
      template.description,
      ``,
      `Review Frequency: ${template.reviewFrequency}`,
      `Approval Required: ${template.approvalRequired ? 'Yes' : 'No'}`,
      ``,
      `================================================`,
      ``,
      ...sectionCustomizations
        .filter(sc => sc.included)
        .flatMap(sc => {
          const section = template.sections.find(s => s.id === sc.sectionId);
          if (!section) return [];
          
          return [
            `SECTION: ${section.title}`,
            `Responsible Party: ${section.references[0] || 'TBD'}`,
            ``,
            section.description,
            sc.customNotes ? `\nAdditional Notes: ${sc.customNotes}` : '',
            ``,
            `PROCEDURE STEPS:`,
            ...sc.customSteps.map((step, idx) => 
              `${idx + 1}. ${step.action}\n   ${step.details}`
            ),
            ``,
            `------------------------------------------------`,
            ``
          ];
        })
    ].join('\n');

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `SOP-${sopId || template.id}-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const canBuild = template && companyName && effectiveDate;

  return (
    <div className="sop-template-builder">
      <div className="template-selector">
        <label htmlFor="sop-template">Select SOP Template:</label>
        <select
          id="sop-template"
          value={selectedTemplate}
          onChange={(e) => handleTemplateChange(e.target.value)}
        >
          <option value="">-- Select Template --</option>
          {sopTemplates.map(t => (
            <option key={t.id} value={t.id}>{t.name}</option>
          ))}
        </select>

        {template && (
          <div className="template-info">
            <p className="description">{template.description}</p>
            <div className="template-meta">
              <span>Category: {template.category}</span>
              <span>Review: {template.reviewFrequency}</span>
              <span>Approval: {template.approvalRequired ? 'Required' : 'Not Required'}</span>
            </div>
            <div className="applicable-operations">
              <strong>Applicable for:</strong>
              <ul>
                {template.applicableOperations.map(op => (
                  <li key={op}>{op.replace(/-/g, ' ')}</li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>

      {template && (
        <>
          <div className="sop-header-form">
            <h3>SOP Header Information</h3>
            <div className="form-grid">
              <div className="form-field">
                <label>SOP ID:</label>
                <input
                  type="text"
                  value={sopId}
                  onChange={(e) => setSopId(e.target.value)}
                  placeholder="e.g., SOP-LS-001"
                />
              </div>
              <div className="form-field">
                <label>Company/Organization:*</label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="Your company name"
                  required
                />
              </div>
              <div className="form-field">
                <label>Effective Date:*</label>
                <input
                  type="date"
                  value={effectiveDate}
                  onChange={(e) => setEffectiveDate(e.target.value)}
                  required
                />
              </div>
              <div className="form-field">
                <label>Review Date:</label>
                <input
                  type="date"
                  value={reviewDate}
                  onChange={(e) => setReviewDate(e.target.value)}
                />
              </div>
              <div className="form-field">
                <label>Approved By:</label>
                <input
                  type="text"
                  value={approvedBy}
                  onChange={(e) => setApprovedBy(e.target.value)}
                  placeholder="Name and title"
                />
              </div>
            </div>
          </div>

          <div className="sections-customizer">
            <h3>Customize Sections</h3>
            
            <div className="section-list">
              {template.sections.map((section) => {
                const customization = sectionCustomizations.find(
                  sc => sc.sectionId === section.id
                );
                if (!customization) return null;

                return (
                  <div 
                    key={section.id} 
                    className={`section-card ${customization.included ? 'included' : 'excluded'}`}
                  >
                    <div className="section-header">
                      <input
                        type="checkbox"
                        checked={customization.included}
                        onChange={() => toggleSection(section.id)}
                        id={`sec-${section.id}`}
                      />
                      <label htmlFor={`sec-${section.id}`}>
                        <strong>{section.title}</strong>
                        <span className="responsible-party">
                          Responsible: {section.responsibleParty}
                        </span>
                      </label>
                      <button 
                        className="btn-expand"
                        onClick={() => setActiveSection(
                          activeSection === section.id ? '' : section.id
                        )}
                      >
                        {activeSection === section.id ? 'Collapse' : 'Expand'}
                      </button>
                    </div>

                    {customization.included && activeSection === section.id && (
                      <div className="section-details">
                        <p className="section-description">{section.description}</p>
                        
                        <div className="custom-notes">
                          <label>Additional Notes:</label>
                          <textarea
                            value={customization.customNotes}
                            onChange={(e) => updateSectionNotes(section.id, e.target.value)}
                            placeholder="Add any site-specific notes or requirements..."
                            rows={3}
                          />
                        </div>

                        <div className="steps-editor">
                          <h4>Procedure Steps</h4>
                          {customization.customSteps.map((step, idx) => (
                            <div key={idx} className="step-editor">
                              <div className="step-number">{idx + 1}</div>
                              <div className="step-fields">
                                <input
                                  type="text"
                                  value={step.action}
                                  onChange={(e) => updateStep(section.id, idx, { action: e.target.value })}
                                  placeholder="Action description"
                                  className="step-action"
                                />
                                <textarea
                                  value={step.details}
                                  onChange={(e) => updateStep(section.id, idx, { details: e.target.value })}
                                  placeholder="Detailed procedure"
                                  rows={2}
                                />
                              </div>
                              <button
                                className="btn-remove-step"
                                onClick={() => removeStep(section.id, idx)}
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                          <button 
                            className="btn-add-step"
                            onClick={() => addStep(section.id)}
                          >
                            + Add Step
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className="btn-build"
              onClick={buildSOP}
              disabled={!canBuild}
            >
              Build SOP
            </button>
            {allowExport && (
              <button 
                className="btn-export"
                onClick={exportSOP}
                disabled={!canBuild}
              >
                Export SOP
              </button>
            )}
          </div>

          {!canBuild && (
            <div className="warning-message">
              Please complete all required fields (*) before building the SOP.
            </div>
          )}
        </>
      )}
    </div>
  );
};
