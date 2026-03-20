/**
 * Module 2.4: Reporting Requirements (Product, Annual, Supplemental)
 * Course 2: FDA Compliance - Part 2
 * 
 * Interactive educational module covering FDA laser product reporting requirements
 * Includes: Report Type Selector, Timeline Calculator, and Compliance Scenarios
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  Calendar, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  ChevronRight, 
  ChevronDown,
  Info,
  Upload,
  RefreshCw,
  ArrowRight,
  BookOpen,
  Shield
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface ReportType {
  id: string;
  name: string;
  cfrReference: string;
  description: string;
  whenToFile: string;
  deadline: string;
  requiredFor: string[];
  keyElements: string[];
  formNumber?: string;
}

interface TimelineEvent {
  id: string;
  date: string;
  label: string;
  description: string;
  type: 'milestone' | 'deadline' | 'action';
}

interface ScenarioStep {
  id: string;
  context: string;
  question: string;
  options: ScenarioOption[];
}

interface ScenarioOption {
  id: string;
  text: string;
  isCorrect: boolean;
  feedback: string;
  cfrReference?: string;
}

interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  cfrReference: string;
}

// ============================================================================
// DATA: REPORT TYPES
// ============================================================================

const REPORT_TYPES: ReportType[] = [
  {
    id: 'product_report',
    name: 'Product Report',
    cfrReference: '21 CFR 1002.10',
    description: 'Initial report describing the product, compliance details, and quality control program',
    whenToFile: 'Before introducing products into commerce (including imports)',
    deadline: 'Prior to introduction into commerce',
    requiredFor: ['All laser products', 'New models', 'Modified products'],
    keyElements: [
      'Manufacturer and report identification',
      'Product and model identification',
      'Compliance with labeling requirements',
      'Compliance with informational requirements',
      'Product description',
      'Radiation levels and classification',
      'Performance requirements compliance',
      'Quality control procedures',
      'Life and endurance testing',
      'Instrumentation and calibration'
    ],
    formNumber: 'FDA 3632'
  },
  {
    id: 'supplemental_report',
    name: 'Supplemental Report',
    cfrReference: '21 CFR 1002.11',
    description: 'Supplementary information to previously submitted Product Reports',
    whenToFile: 'For new models in existing families or modifications affecting compliance',
    deadline: 'Before introducing modified product into commerce',
    requiredFor: [
      'New models in reported model families',
      'Modifications affecting emission',
      'Changes decreasing compliance',
      'Changes affecting detection probability'
    ],
    keyElements: [
      'Reference to original accession number',
      'Detailed response to affected sections',
      'Unchanged items referenced to original report',
      'Description of modifications',
      'Updated compliance information'
    ]
  },
  {
    id: 'annual_report',
    name: 'Annual Report',
    cfrReference: '21 CFR 1002.13',
    description: 'Summary of required records and identification of new models',
    whenToFile: 'Every year for the 12-month period ending June 30',
    deadline: 'September 1 each year',
    requiredFor: ['All manufacturers of laser products'],
    keyElements: [
      'Summary of required records',
      'Identification of new models (if no Supplemental Report needed)',
      'Quarterly updates (optional)',
      'Compliance certifications'
    ]
  }
];

// ============================================================================
// DATA: DECISION TREE
// ============================================================================

interface DecisionNode {
  id: string;
  question: string;
  options: {
    label: string;
    nextNodeId: string | null;
    result?: string;
    cfrReference?: string;
  }[];
}

const DECISION_TREE: Record<string, DecisionNode> = {
  start: {
    id: 'start',
    question: 'What type of reporting situation are you dealing with?',
    options: [
      { label: 'New laser product introduction', nextNodeId: 'new_product' },
      { label: 'Modification to existing product', nextNodeId: 'modification' },
      { label: 'Annual compliance reporting', nextNodeId: 'annual' },
      { label: 'New model in existing family', nextNodeId: 'new_model' }
    ]
  },
  new_product: {
    id: 'new_product',
    question: 'Is this a completely new product or an import?',
    options: [
      { 
        label: 'New product manufactured domestically', 
        nextNodeId: null,
        result: 'Submit PRODUCT REPORT (21 CFR 1002.10) before introduction to commerce',
        cfrReference: '21 CFR 1002.10'
      },
      { 
        label: 'Product being imported into U.S.', 
        nextNodeId: null,
        result: 'Submit PRODUCT REPORT (21 CFR 1002.10) before importation. Designate importing agent per 21 CFR 1005.25.',
        cfrReference: '21 CFR 1002.10, 1005.25'
      }
    ]
  },
  modification: {
    id: 'modification',
    question: 'Does the modification affect any of the following?',
    options: [
      { label: 'Actual or potential emission levels', nextNodeId: 'supplemental_required' },
      { label: 'Degree of compliance with performance standards', nextNodeId: 'supplemental_required' },
      { label: 'Probability of detecting noncompliance', nextNodeId: 'supplemental_required' },
      { label: 'None of the above (cosmetic changes only)', nextNodeId: 'no_supplemental' }
    ]
  },
  supplemental_required: {
    id: 'supplemental_required',
    question: 'Do you have the original accession number?',
    options: [
      { 
        label: 'Yes', 
        nextNodeId: null,
        result: 'Submit SUPPLEMENTAL REPORT (21 CFR 1002.11) referencing the original accession number before introducing modified product',
        cfrReference: '21 CFR 1002.11'
      },
      { 
        label: 'No / Not sure', 
        nextNodeId: null,
        result: 'Contact CDRH to locate original accession number. Then submit SUPPLEMENTAL REPORT (21 CFR 1002.11).',
        cfrReference: '21 CFR 1002.11'
      }
    ]
  },
  no_supplemental: {
    id: 'no_supplemental',
    question: 'Are there any radiation safety implications?',
    options: [
      { 
        label: 'Yes', 
        nextNodeId: null,
        result: 'Caution: If there are safety implications, a Supplemental Report may still be required. Contact CDRH for guidance.',
        cfrReference: '21 CFR 1002.11'
      },
      { 
        label: 'No, purely cosmetic', 
        nextNodeId: null,
        result: 'No Supplemental Report required. Document the change in your next Annual Report (21 CFR 1002.13).',
        cfrReference: '21 CFR 1002.13'
      }
    ]
  },
  annual: {
    id: 'annual',
    question: 'What is the reporting period?',
    options: [
      { 
        label: 'July 1 - June 30 period', 
        nextNodeId: null,
        result: 'Submit ANNUAL REPORT by September 1 (21 CFR 1002.13)',
        cfrReference: '21 CFR 1002.13'
      },
      { 
        label: 'Need to report new models without emission changes', 
        nextNodeId: null,
        result: 'Include in ANNUAL REPORT or quarterly update instead of Supplemental Report',
        cfrReference: '21 CFR 1002.13'
      }
    ]
  },
  new_model: {
    id: 'new_model',
    question: 'Does the new model involve changes to radiation emission or performance requirements?',
    options: [
      { 
        label: 'Yes - emission or performance changes', 
        nextNodeId: null,
        result: 'Submit SUPPLEMENTAL REPORT (21 CFR 1002.11) before introduction',
        cfrReference: '21 CFR 1002.11'
      },
      { 
        label: 'No - no radiation-related changes', 
        nextNodeId: null,
        result: 'Identify in ANNUAL REPORT or quarterly update (21 CFR 1002.13) - no Supplemental Report needed',
        cfrReference: '21 CFR 1002.13'
      }
    ]
  }
};

// ============================================================================
// COMPONENT: REPORT TYPE CARD
// ============================================================================

const ReportTypeCard: React.FC<{ report: ReportType; isSelected: boolean; onClick: () => void }> = ({ 
  report, 
  isSelected, 
  onClick 
}) => {
  return (
    <motion.div
      className={`report-type-card ${isSelected ? 'selected' : ''}`}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      }}
      role="button"
      tabIndex={0}
      aria-pressed={isSelected}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{
        border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
        borderRadius: '12px',
        padding: '20px',
        cursor: 'pointer',
        background: isSelected ? '#eff6ff' : '#ffffff',
        transition: 'all 0.2s ease'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
        <div style={{ 
          padding: '10px', 
          background: isSelected ? '#3b82f6' : '#f3f4f6',
          borderRadius: '8px'
        }}>
          <FileText size={24} color={isSelected ? '#ffffff' : '#6b7280'} aria-hidden="true" />
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>{report.name}</h3>
          <span style={{ fontSize: '14px', color: '#6b7280' }}>{report.cfrReference}</span>
        </div>
      </div>
      
      <p style={{ fontSize: '14px', color: '#374151', marginBottom: '12px' }}>
        {report.description}
      </p>
      
      <div style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        fontSize: '13px',
        color: '#dc2626',
        fontWeight: 500
      }}>
        <Clock size={16} aria-hidden="true" />
        <span>Due: {report.deadline}</span>
      </div>
      
      {report.formNumber && (
        <div style={{ 
          marginTop: '12px',
          padding: '8px 12px',
          background: '#f3f4f6',
          borderRadius: '6px',
          fontSize: '13px',
          fontWeight: 500
        }}>
          Form: {report.formNumber}
        </div>
      )}
    </motion.div>
  );
};

// ============================================================================
// COMPONENT: REPORT TYPE SELECTOR (Decision Tree)
// ============================================================================

const ReportTypeSelector: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<{ result: string; cfrReference?: string } | null>(null);

  const currentNode = DECISION_TREE[currentNodeId];

  const handleOptionClick = (option: DecisionNode['options'][0]) => {
    if (option.nextNodeId === null) {
      setResult({ result: option.result!, cfrReference: option.cfrReference });
    } else {
      setHistory([...history, currentNodeId]);
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const previousNode = newHistory.pop()!;
      setHistory(newHistory);
      setCurrentNodeId(previousNode);
      setResult(null);
    }
  };

  const handleReset = () => {
    setCurrentNodeId('start');
    setHistory([]);
    setResult(null);
  };

  return (
    <div 
      className="report-type-selector" 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Report Type Decision Tree"
    >
      <h2 style={{ marginBottom: '8px' }}>Report Type Decision Tree</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="decision-tree-desc">
        Answer the questions to determine which report type is required for your situation.
      </p>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key={currentNodeId}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            role="form"
            aria-describedby="decision-tree-desc"
          >
            <div style={{ marginBottom: '20px' }}>
              <span 
                style={{ 
                  fontSize: '12px', 
                  textTransform: 'uppercase',
                  color: '#6b7280',
                  fontWeight: 600,
                  letterSpacing: '0.05em'
                }}
                aria-label={`Step ${history.length + 1} of ${Object.keys(DECISION_TREE).length}`}
              >
                Step {history.length + 1}
              </span>
              <h3 
                style={{ marginTop: '8px', fontSize: '20px' }}
                id="decision-question"
              >
                {currentNode.question}
              </h3>
            </div>

            <div 
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
              role="radiogroup"
              aria-labelledby="decision-question"
            >
              {currentNode.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  whileHover={{ scale: 1.01, backgroundColor: '#eff6ff' }}
                  whileTap={{ scale: 0.99 }}
                  style={{
                    padding: '16px 20px',
                    textAlign: 'left',
                    background: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                  role="radio"
                  aria-checked="false"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      handleOptionClick(option);
                    }
                  }}
                >
                  <span>{option.label}</span>
                  <ChevronRight size={20} color="#9ca3af" aria-hidden="true" />
                </motion.button>
              ))}
            </div>

            {history.length > 0 && (
              <button
                onClick={handleBack}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
                aria-label="Go back to previous question"
              >
                ← Back
              </button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#ecfdf5',
              borderRadius: '12px',
              padding: '24px',
              border: '2px solid #10b981'
            }}
            role="region"
            aria-label="Decision Result"
            aria-live="polite"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <CheckCircle size={32} color="#10b981" aria-hidden="true" />
              <h3 style={{ margin: 0, color: '#065f46' }}>Recommendation</h3>
            </div>
            
            <p style={{ fontSize: '18px', color: '#065f46', marginBottom: '16px', fontWeight: 500 }}>
              {result.result}
            </p>
            
            {result.cfrReference && (
              <div style={{ 
                padding: '12px 16px',
                background: '#ffffff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '20px'
              }}>
                <BookOpen size={18} color="#6b7280" aria-hidden="true" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  CFR Reference: <strong>{result.cfrReference}</strong>
                </span>
              </div>
            )}

            <button
              onClick={handleReset}
              style={{
                padding: '12px 24px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: 500
              }}
              aria-label="Start decision tree over"
            >
              <RefreshCw size={18} aria-hidden="true" />
              Start Over
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPONENT: TIMELINE CALCULATOR
// ============================================================================

const TimelineCalculator: React.FC = () => {
  const [productDate, setProductDate] = useState<string>('');
  const [modificationDate, setModificationDate] = useState<string>('');
  const [calculationType, setCalculationType] = useState<'new' | 'modified' | 'annual'>('new');

  const calculateDeadlines = () => {
    const events: TimelineEvent[] = [];
    
    if (calculationType === 'new' && productDate) {
      const introDate = new Date(productDate);
      const productReportDeadline = new Date(introDate);
      
      events.push({
        id: '1',
        date: introDate.toISOString().split('T')[0],
        label: 'Product Report Deadline',
        description: 'Product Report must be submitted BEFORE this date',
        type: 'deadline'
      });
      
      // Annual report calculation
      const currentYear = introDate.getFullYear();
      let annualReportYear = currentYear;
      
      // If introduced after June 30, first annual report is next year
      if (introDate.getMonth() > 5 || (introDate.getMonth() === 5 && introDate.getDate() > 30)) {
        annualReportYear++;
      }
      
      events.push({
        id: '2',
        date: `${annualReportYear}-09-01`,
        label: 'First Annual Report Due',
        description: 'For period ending June 30 of the same year',
        type: 'deadline'
      });
    }
    
    if (calculationType === 'modified' && modificationDate) {
      const modDate = new Date(modificationDate);
      
      events.push({
        id: '1',
        date: modDate.toISOString().split('T')[0],
        label: 'Supplemental Report Deadline',
        description: 'Supplemental Report must be submitted BEFORE modified product introduction',
        type: 'deadline'
      });
    }
    
    if (calculationType === 'annual') {
      const currentYear = new Date().getFullYear();
      
      events.push({
        id: '1',
        date: `${currentYear}-06-30`,
        label: 'Reporting Period Ends',
        description: 'End of 12-month reporting period',
        type: 'milestone'
      });
      
      events.push({
        id: '2',
        date: `${currentYear}-09-01`,
        label: 'Annual Report Due',
        description: 'Annual Report must be submitted by this date',
        type: 'deadline'
      });
    }
    
    return events;
  };

  const events = calculateDeadlines();

  return (
    <div 
      className="timeline-calculator" 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Reporting Deadline Calculator"
    >
      <h2 style={{ marginBottom: '8px' }}>Reporting Deadline Calculator</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="timeline-calculator-desc">
        Calculate important reporting deadlines based on your product timeline.
      </p>

      <div 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '12px',
          marginBottom: '24px'
        }}
        role="tablist"
        aria-label="Calculation type selection"
      >
        <button
          onClick={() => setCalculationType('new')}
          role="tab"
          aria-selected={calculationType === 'new'}
          aria-controls="timeline-panel"
          style={{
            padding: '16px',
            background: calculationType === 'new' ? '#3b82f6' : '#f3f4f6',
            color: calculationType === 'new' ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            outline: calculationType === 'new' ? '2px solid #1d4ed8' : 'none',
            outlineOffset: '2px'
          }}
        >
          New Product
        </button>
        <button
          onClick={() => setCalculationType('modified')}
          role="tab"
          aria-selected={calculationType === 'modified'}
          aria-controls="timeline-panel"
          style={{
            padding: '16px',
            background: calculationType === 'modified' ? '#3b82f6' : '#f3f4f6',
            color: calculationType === 'modified' ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            outline: calculationType === 'modified' ? '2px solid #1d4ed8' : 'none',
            outlineOffset: '2px'
          }}
        >
          Modified Product
        </button>
        <button
          onClick={() => setCalculationType('annual')}
          role="tab"
          aria-selected={calculationType === 'annual'}
          aria-controls="timeline-panel"
          style={{
            padding: '16px',
            background: calculationType === 'annual' ? '#3b82f6' : '#f3f4f6',
            color: calculationType === 'annual' ? '#ffffff' : '#374151',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontWeight: 500,
            outline: calculationType === 'annual' ? '2px solid #1d4ed8' : 'none',
            outlineOffset: '2px'
          }}
        >
          Annual Report
        </button>
      </div>

      {(calculationType === 'new' || calculationType === 'modified') && (
        <div style={{ marginBottom: '24px' }}>
          <label 
            htmlFor="date-input"
            style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}
          >
            {calculationType === 'new' ? 'Planned Introduction Date' : 'Modification Date'}
          </label>
          <input
            id="date-input"
            type="date"
            value={calculationType === 'new' ? productDate : modificationDate}
            onChange={(e) => calculationType === 'new' 
              ? setProductDate(e.target.value) 
              : setModificationDate(e.target.value)}
            style={{
              padding: '12px 16px',
              border: '2px solid #e5e7eb',
              borderRadius: '8px',
              fontSize: '16px',
              width: '100%'
            }}
            aria-describedby="timeline-calculator-desc"
          />
        </div>
      )}

      {events.length > 0 && (
        <motion.div
          id="timeline-panel"
          role="tabpanel"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ 
            background: '#f9fafb',
            borderRadius: '12px',
            padding: '24px'
          }}
        >
          <h3 style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Calendar size={20} aria-hidden="true" />
            Important Deadlines
          </h3>
          
          <div 
            style={{ position: 'relative' }}
            role="list"
            aria-label="FDA regulatory timeline"
          >
            {events.map((event, index) => (
              <div 
                key={event.id}
                role="listitem"
                style={{
                  display: 'flex',
                  gap: '16px',
                  marginBottom: index < events.length - 1 ? '24px' : 0,
                  position: 'relative'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: event.type === 'deadline' ? '#fee2e2' : '#dbeafe',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
                  aria-hidden="true"
                >
                  {event.type === 'deadline' ? 
                    <AlertTriangle size={20} color="#dc2626" aria-hidden="true" /> : 
                    <CheckCircle size={20} color="#2563eb" aria-hidden="true" />
                  }
                </div>
                
                <div style={{ flex: 1 }}>
                  <time 
                    dateTime={event.date}
                    style={{ 
                      fontSize: '12px',
                      color: '#6b7280',
                      textTransform: 'uppercase',
                      fontWeight: 600,
                      letterSpacing: '0.05em'
                    }}
                  >
                    {event.date}
                  </time>
                  <h4 style={{ margin: '4px 0', fontSize: '16px' }}>{event.label}</h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                    {event.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <div 
        style={{ 
          marginTop: '24px',
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
        role="note"
        aria-label="Important compliance reminder"
      >
        <Info size={20} color="#f59e0b" style={{ flexShrink: 0, marginTop: '2px' }} aria-hidden="true" />
        <div>
          <p style={{ margin: 0, fontSize: '14px', color: '#92400e' }}>
            <strong>Important:</strong> Product Reports and Supplemental Reports must be submitted 
            <strong> BEFORE</strong> introduction into commerce. Late submissions may result in regulatory violations.
          </p>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: COMPLIANCE SCENARIO EXERCISE
// ============================================================================

const COMPLIANCE_SCENARIOS: ScenarioStep[] = [
  {
    id: 'scenario1',
    context: 'Your company has developed a new Class IIIb laser system for industrial cutting applications. The product is scheduled to be introduced to the market on March 15, 2025.',
    question: 'What reporting action(s) must be completed before the product introduction date?',
    options: [
      {
        id: 'a',
        text: 'No reporting needed - Class IIIb products are exempt',
        isCorrect: false,
        feedback: 'Incorrect. Class IIIb laser products require a Product Report before introduction to commerce.',
        cfrReference: '21 CFR 1002.10'
      },
      {
        id: 'b',
        text: 'Submit Product Report (21 CFR 1002.10) before March 15, 2025',
        isCorrect: true,
        feedback: 'Correct! All laser products, including Class IIIb, require a Product Report before introduction into commerce.',
        cfrReference: '21 CFR 1002.10'
      },
      {
        id: 'c',
        text: 'Submit Annual Report only',
        isCorrect: false,
        feedback: 'Incorrect. The Annual Report is for existing products. A Product Report is required before initial introduction.',
        cfrReference: '21 CFR 1002.10, 1002.13'
      }
    ]
  },
  {
    id: 'scenario2',
    context: 'Six months after product introduction, you discover that a manufacturing change has resulted in a slight increase in accessible emission levels.',
    question: 'What reporting is required for this modification?',
    options: [
      {
        id: 'a',
        text: 'No action needed - the change is minor',
        isCorrect: false,
        feedback: 'Incorrect. Changes affecting actual emission levels require a Supplemental Report.',
        cfrReference: '21 CFR 1002.11'
      },
      {
        id: 'b',
        text: 'Submit a Supplemental Report before the modified products are introduced',
        isCorrect: true,
        feedback: 'Correct! Changes affecting actual or potential emission require a Supplemental Report.',
        cfrReference: '21 CFR 1002.11'
      },
      {
        id: 'c',
        text: 'Include in the next Annual Report',
        isCorrect: false,
        feedback: 'Incorrect. Changes affecting emission cannot wait for the Annual Report.',
        cfrReference: '21 CFR 1002.11'
      }
    ]
  },
  {
    id: 'scenario3',
    context: 'Your company wants to add a new model to an existing product family. The new model has the same laser classification and emission characteristics as the reported model.',
    question: 'How should this new model be reported?',
    options: [
      {
        id: 'a',
        text: 'Submit a new Product Report',
        isCorrect: false,
        feedback: 'A full Product Report is not necessary when there are no emission changes.',
        cfrReference: '21 CFR 1002.13'
      },
      {
        id: 'b',
        text: 'Identify in Annual Report or quarterly update only',
        isCorrect: true,
        feedback: 'Correct! If the new model does not involve changes in radiation emission, identify it in the Annual Report.',
        cfrReference: '21 CFR 1002.13'
      },
      {
        id: 'c',
        text: 'Submit a Supplemental Report',
        isCorrect: false,
        feedback: 'A Supplemental Report is only needed if there are emission or compliance changes.',
        cfrReference: '21 CFR 1002.11, 1002.13'
      }
    ]
  }
];

const ComplianceScenario: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = COMPLIANCE_SCENARIOS[currentStep];
  const selectedAnswer = scenario.options.find(o => o.id === selectedOption);

  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowFeedback(true);
    
    const option = scenario.options.find(o => o.id === optionId);
    if (option?.isCorrect) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentStep < COMPLIANCE_SCENARIOS.length - 1) {
      setCurrentStep(currentStep + 1);
      setSelectedOption(null);
      setShowFeedback(false);
    } else {
      setCompleted(true);
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setSelectedOption(null);
    setShowFeedback(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{
          background: score === COMPLIANCE_SCENARIOS.length ? '#ecfdf5' : '#fef3c7',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {score === COMPLIANCE_SCENARIOS.length ? '🎉' : '📝'}
          </div>
          <h2 style={{ marginBottom: '8px' }}>
            Scenario Exercise Complete!
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '24px' }}>
            You scored {score} out of {COMPLIANCE_SCENARIOS.length}
          </p>
          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px' }}>Compliance Scenario Exercise</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Apply your knowledge to real-world reporting situations.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '12px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span>Scenario {currentStep + 1} of {COMPLIANCE_SCENARIOS.length}</span>
          <span>Score: {score}/{currentStep + (showFeedback ? 1 : 0)}</span>
        </div>
        <div style={{ 
          height: '8px', 
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentStep + 1) / COMPLIANCE_SCENARIOS.length) * 100}%`,
            height: '100%',
            background: '#3b82f6',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{
          padding: '16px',
          background: '#eff6ff',
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #3b82f6'
        }}>
          <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={18} />
            Scenario
          </h4>
          <p style={{ margin: 0, color: '#374151' }}>{scenario.context}</p>
        </div>

        <h3 style={{ marginBottom: '16px' }}>{scenario.question}</h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {scenario.options.map((option) => (
            <button
              key={option.id}
              onClick={() => !showFeedback && handleOptionSelect(option.id)}
              disabled={showFeedback}
              style={{
                padding: '16px 20px',
                textAlign: 'left',
                background: showFeedback
                  ? option.isCorrect
                    ? '#ecfdf5'
                    : selectedOption === option.id
                      ? '#fee2e2'
                      : '#f9fafb'
                  : selectedOption === option.id
                    ? '#eff6ff'
                    : '#f9fafb',
                border: `2px solid ${
                  showFeedback
                    ? option.isCorrect
                      ? '#10b981'
                      : selectedOption === option.id
                        ? '#ef4444'
                        : '#e5e7eb'
                    : selectedOption === option.id
                      ? '#3b82f6'
                      : '#e5e7eb'
                }`,
                borderRadius: '8px',
                cursor: showFeedback ? 'default' : 'pointer',
                opacity: showFeedback && selectedOption !== option.id && !option.isCorrect ? 0.6 : 1
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  border: '2px solid currentColor',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 600,
                  flexShrink: 0
                }}>
                  {option.id.toUpperCase()}
                </span>
                <span>{option.text}</span>
              </div>
            </button>
          ))}
        </div>

        <AnimatePresence>
          {showFeedback && selectedAnswer && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              style={{
                marginTop: '20px',
                padding: '16px',
                background: selectedAnswer.isCorrect ? '#ecfdf5' : '#fee2e2',
                borderRadius: '8px',
                borderLeft: `4px solid ${selectedAnswer.isCorrect ? '#10b981' : '#ef4444'}`
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                {selectedAnswer.isCorrect ? (
                  <CheckCircle size={20} color="#10b981" />
                ) : (
                  <AlertTriangle size={20} color="#ef4444" />
                )}
                <span style={{ fontWeight: 600 }}>
                  {selectedAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px' }}>
                {selectedAnswer.feedback}
              </p>
              {selectedAnswer.cfrReference && (
                <span style={{ fontSize: '13px', color: '#6b7280' }}>
                  Reference: <strong>{selectedAnswer.cfrReference}</strong>
                </span>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {showFeedback && (
          <button
            onClick={handleNext}
            style={{
              marginTop: '20px',
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '15px',
              fontWeight: 500
            }}
          >
            {currentStep < COMPLIANCE_SCENARIOS.length - 1 ? 'Next Scenario' : 'See Results'}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: REPORT ELEMENTS CHECKLIST
// ============================================================================

const ReportElementsChecklist: React.FC = () => {
  const [expandedReport, setExpandedReport] = useState<string | null>('product_report');
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const toggleItem = (itemId: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(itemId)) {
      newChecked.delete(itemId);
    } else {
      newChecked.add(itemId);
    }
    setCheckedItems(newChecked);
  };

  return (
    <div 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Report Elements Checklist"
    >
      <h2 style={{ marginBottom: '8px' }}>Report Elements Checklist</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="checklist-desc">
        Review the required elements for each report type. Click to expand and check off items.
      </p>

      <div 
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        role="list"
        aria-label="Report types checklist"
      >
        {REPORT_TYPES.map((report) => (
          <div 
            key={report.id}
            role="listitem"
            style={{
              border: '2px solid #e5e7eb',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <button
              onClick={() => setExpandedReport(expandedReport === report.id ? null : report.id)}
              aria-expanded={expandedReport === report.id}
              aria-controls={`report-section-${report.id}`}
              style={{
                width: '100%',
                padding: '16px 20px',
                background: '#f9fafb',
                border: 'none',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                cursor: 'pointer',
                textAlign: 'left'
              }}
            >
              <div>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{report.name}</h3>
                <span style={{ fontSize: '13px', color: '#6b7280' }}>{report.cfrReference}</span>
              </div>
              <ChevronDown 
                size={20} 
                color="#6b7280"
                style={{ 
                  transform: expandedReport === report.id ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
                aria-hidden="true"
              />
            </button>

            <AnimatePresence>
              {expandedReport === report.id && (
                <motion.div
                  id={`report-section-${report.id}`}
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  style={{ background: '#ffffff' }}
                  role="region"
                  aria-label={`${report.name} requirements`}
                >
                  <div style={{ padding: '20px' }}>
                    <p style={{ marginTop: 0, color: '#374151' }}>{report.description}</p>
                    
                    <h4 style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}>
                      Required For:
                    </h4>
                    <ul style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                      {report.requiredFor.map((item, index) => (
                        <li key={index} style={{ marginBottom: '4px', color: '#374151' }}>{item}</li>
                      ))}
                    </ul>

                    <h4 
                      style={{ marginBottom: '12px', fontSize: '14px', color: '#6b7280' }}
                      id={`key-elements-${report.id}`}
                    >
                      Key Elements:
                    </h4>
                    <div 
                      style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
                      role="group"
                      aria-labelledby={`key-elements-${report.id}`}
                    >
                      {report.keyElements.map((element, index) => {
                        const itemId = `${report.id}-${index}`;
                        return (
                          <label
                            key={index}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px',
                              padding: '10px 12px',
                              background: checkedItems.has(itemId) ? '#ecfdf5' : '#f9fafb',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '14px'
                            }}
                          >
                            <input
                              type="checkbox"
                              checked={checkedItems.has(itemId)}
                              onChange={() => toggleItem(itemId)}
                              style={{ width: '18px', height: '18px' }}
                              aria-checked={checkedItems.has(itemId)}
                            />
                            <span style={{ 
                              textDecoration: checkedItems.has(itemId) ? 'line-through' : 'none',
                              color: checkedItems.has(itemId) ? '#059669' : '#374151'
                            }}>
                              {element}
                            </span>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

const Module24ReportingRequirements: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'selector' | 'timeline' | 'scenarios' | 'checklist'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'selector', label: 'Report Selector', icon: FileText },
    { id: 'timeline', label: 'Timeline Calculator', icon: Calendar },
    { id: 'scenarios', label: 'Scenarios', icon: Shield },
    { id: 'checklist', label: 'Checklist', icon: CheckCircle }
  ];

  return (
    <div className="module-2-4" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Module Header */}
      <div style={{ 
        padding: '32px 24px',
        background: 'linear-gradient(135deg, #1e40af 0%, #3b82f6 100%)',
        color: '#ffffff',
        borderRadius: '0 0 16px 16px'
      }}>
        <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
          Course 2: FDA Compliance • Module 2.4
        </div>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Reporting Requirements</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
          Product Reports, Annual Reports, and Supplemental Reports
        </p>
      </div>

      {/* Navigation Tabs */}
      <div style={{ 
        display: 'flex',
        gap: '8px',
        padding: '16px 24px',
        borderBottom: '2px solid #e5e7eb',
        overflowX: 'auto'
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{
              padding: '12px 20px',
              background: activeTab === tab.id ? '#eff6ff' : 'transparent',
              color: activeTab === tab.id ? '#1d4ed8' : '#6b7280',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontWeight: activeTab === tab.id ? 600 : 400,
              whiteSpace: 'nowrap'
            }}
          >
            <tab.icon size={18} />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content Area */}
      <div style={{ minHeight: '500px' }}>
        {activeTab === 'overview' && (
          <div style={{ padding: '24px' }}>
            <h2 style={{ marginBottom: '16px' }}>Module Overview</h2>
            <p style={{ lineHeight: 1.6, marginBottom: '24px' }}>
              This module covers the FDA reporting requirements for laser products under 21 CFR Part 1002. 
              Understanding when and how to submit Product Reports, Supplemental Reports, and Annual Reports 
              is essential for compliance with federal regulations.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '16px'
            }}>
              {REPORT_TYPES.map((report) => (
                <ReportTypeCard
                  key={report.id}
                  report={report}
                  isSelected={false}
                  onClick={() => setActiveTab('selector')}
                />
              ))}
            </div>

            <div style={{ 
              marginTop: '32px',
              padding: '20px',
              background: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '16px'
            }}>
              <AlertTriangle size={24} color="#f59e0b" style={{ flexShrink: 0 }} />
              <div>
                <h4 style={{ margin: '0 0 8px 0' }}>Critical Compliance Note</h4>
                <p style={{ margin: 0, fontSize: '14px' }}>
                  CDRH does NOT approve Product Reports or the products being reported. It is the 
                  manufacturer's responsibility to certify compliance. Late reporting or failure to 
                  report can result in regulatory action including product detention and import refusal.
                </p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'selector' && <ReportTypeSelector />}
        {activeTab === 'timeline' && <TimelineCalculator />}
        {activeTab === 'scenarios' && <ComplianceScenario />}
        {activeTab === 'checklist' && <ReportElementsChecklist />}
      </div>

      {/* Module Footer */}
      <div style={{ 
        padding: '24px',
        borderTop: '2px solid #e5e7eb',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div style={{ fontSize: '14px', color: '#6b7280' }}>
          CFR References: 21 CFR 1002.10, 1002.11, 1002.13
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button style={{
            padding: '10px 20px',
            background: '#f3f4f6',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Previous Module
          </button>
          <button style={{
            padding: '10px 20px',
            background: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            Next Module
          </button>
        </div>
      </div>
    </div>
  );
};

export default Module24ReportingRequirements;
