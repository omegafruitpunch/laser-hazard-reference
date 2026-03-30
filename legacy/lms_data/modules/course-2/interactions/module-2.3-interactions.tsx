/**
 * Module 2.3: Laser Notices & Harmonization - Interaction Components
 * 
 * Interactive components with animations and states:
 * - Harmonization comparison table with filters
 * - Certification statement builder
 * - Compliance checklist with progress saving
 * - Tab navigation for harmonized vs FDA-unique requirements
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, CheckCircle, AlertTriangle, RefreshCw, 
  Globe, Shield, BookOpen, Filter, Copy, Check,
  ChevronRight, ChevronDown, Info, X, Save,
  Layers, ExternalLink, Search, ChevronLeft
} from 'lucide-react';

// ============================================================================
// DATA: HARMONIZATION MATRIX
// ============================================================================

interface HarmonizationSection {
  id: string;
  fdaSection: string;
  fdaTitle: string;
  iecEquivalent: string;
  status: 'harmonized' | 'fda-unique' | 'iec-unique';
  notes: string;
  details?: string[];
}

const HARMONIZATION_DATA: HarmonizationSection[] = [
  // Harmonized sections
  {
    id: 'sec-b',
    fdaSection: '1040.10(b)',
    fdaTitle: 'Definitions',
    iecEquivalent: 'IEC 60825-1 Clause 3',
    status: 'harmonized',
    notes: 'Most definitions accepted; some FDA-specific terms retained',
    details: ['Class terminology aligned', 'Measurement definitions harmonized', 'Safety terms standardized']
  },
  {
    id: 'sec-c1',
    fdaSection: '1040.10(c)(1)',
    fdaTitle: 'Classification',
    iecEquivalent: 'IEC 60825-1 Clause 4',
    status: 'harmonized',
    notes: 'IEC classification system accepted; FDA retains Class IIa',
    details: ['IEC Classes 1, 2, 3B, 4 accepted', 'Class IIa remains FDA-specific', 'AEL tables harmonized']
  },
  {
    id: 'sec-d',
    fdaSection: '1040.10(d)',
    fdaTitle: 'Accessible Emission Limits',
    iecEquivalent: 'IEC 60825-1 Tables 1-6',
    status: 'harmonized',
    notes: 'IEC AELs accepted for all classes',
    details: ['All wavelength regions covered', 'Time-dependent limits accepted', 'Measurement conditions aligned']
  },
  {
    id: 'sec-e',
    fdaSection: '1040.10(e)',
    fdaTitle: 'Tests for Compliance',
    iecEquivalent: 'IEC 60825-1 Clause 8',
    status: 'harmonized',
    notes: 'IEC test methods accepted',
    details: ['Measurement procedures aligned', 'Aperture specifications match', 'Solid angle requirements equivalent']
  },
  {
    id: 'sec-f1',
    fdaSection: '1040.10(f)(1)',
    fdaTitle: 'Protective Housing',
    iecEquivalent: 'IEC 60825-1 4.2',
    status: 'harmonized',
    notes: 'IEC protective housing requirements accepted'
  },
  {
    id: 'sec-f2',
    fdaSection: '1040.10(f)(2)',
    fdaTitle: 'Safety Interlocks',
    iecEquivalent: 'IEC 60825-1 4.3',
    status: 'harmonized',
    notes: 'IEC interlock requirements accepted'
  },
  {
    id: 'sec-f3',
    fdaSection: '1040.10(f)(3)',
    fdaTitle: 'Remote Interlock Connector',
    iecEquivalent: 'IEC 60825-1 4.4',
    status: 'harmonized',
    notes: 'IEC requirements accepted'
  },
  {
    id: 'sec-f4',
    fdaSection: '1040.10(f)(4)',
    fdaTitle: 'Key Control',
    iecEquivalent: 'IEC 60825-1 4.5',
    status: 'harmonized',
    notes: 'IEC key control requirements accepted'
  },
  {
    id: 'sec-f5',
    fdaSection: '1040.10(f)(5)',
    fdaTitle: 'Emission Indicator',
    iecEquivalent: 'IEC 60825-1 4.6',
    status: 'harmonized',
    notes: 'IEC indicator requirements accepted'
  },
  {
    id: 'sec-f6',
    fdaSection: '1040.10(f)(6)',
    fdaTitle: 'Beam Attenuator',
    iecEquivalent: 'IEC 60825-1 4.7',
    status: 'harmonized',
    notes: 'IEC attenuator requirements accepted'
  },
  {
    id: 'sec-g',
    fdaSection: '1040.10(g)',
    fdaTitle: 'Labeling Requirements',
    iecEquivalent: 'IEC 60825-1 Clause 5',
    status: 'harmonized',
    notes: 'IEC labeling accepted with modified FDA certification statement'
  },
  {
    id: 'sec-h1',
    fdaSection: '1040.10(h)(1)',
    fdaTitle: 'User Information',
    iecEquivalent: 'IEC 60825-1 5.5',
    status: 'harmonized',
    notes: 'IEC user information requirements accepted'
  },
  {
    id: 'sec-med',
    fdaSection: '1040.11(a)',
    fdaTitle: 'Medical Laser Products',
    iecEquivalent: 'IEC 60601-2-22',
    status: 'harmonized',
    notes: 'Medical laser standard harmonized with IEC 60601-2-22'
  },
  // FDA-unique sections
  {
    id: 'sec-cert',
    fdaSection: '1010.2',
    fdaTitle: 'Certification',
    iecEquivalent: 'No IEC equivalent',
    status: 'fda-unique',
    notes: 'FDA administrative requirement - special certification statement required'
  },
  {
    id: 'sec-id',
    fdaSection: '1010.3',
    fdaTitle: 'Identification',
    iecEquivalent: 'No IEC equivalent',
    status: 'fda-unique',
    notes: 'FDA traceability requirement - manufacturer and date marking'
  },
  {
    id: 'sec-var',
    fdaSection: '1010.4',
    fdaTitle: 'Variances',
    iecEquivalent: 'No IEC equivalent',
    status: 'fda-unique',
    notes: 'FDA administrative procedure - must use FDA variance process'
  },
  {
    id: 'sec-manual',
    fdaSection: '1040.10(f)(10)',
    fdaTitle: 'Manual Reset Mechanism',
    iecEquivalent: 'No IEC equivalent',
    status: 'fda-unique',
    notes: 'FDA-specific requirement for Class IV (post-1986)'
  },
  {
    id: 'sec-purch',
    fdaSection: '1040.10(h)(2)',
    fdaTitle: 'Purchasing/Servicing Info',
    iecEquivalent: 'No IEC equivalent',
    status: 'fda-unique',
    notes: 'Beyond IEC scope - catalog and service manual requirements'
  },
  {
    id: 'sec-survey',
    fdaSection: '1040.11(b)',
    fdaTitle: 'Surveying/Leveling Lasers',
    iecEquivalent: 'No IEC equivalent',
    status: 'fda-unique',
    notes: 'Specific FDA requirements for surveying applications'
  },
  {
    id: 'sec-demo',
    fdaSection: '1040.11(c)',
    fdaTitle: 'Demonstration Products',
    iecEquivalent: 'No IEC equivalent',
    status: 'fda-unique',
    notes: 'Variance required above Class IIIa - unaffected by harmonization'
  }
];

// ============================================================================
// DATA: CHECKLIST ITEMS
// ============================================================================

interface ChecklistItem {
  id: string;
  text: string;
  category: 'fda-unique' | 'harmonized' | 'reporting';
  cfrReference?: string;
}

const COMPLIANCE_CHECKLIST: ChecklistItem[] = [
  {
    id: 'cert-label',
    text: 'Certification label with modified statement per Laser Notice No. 50',
    category: 'fda-unique',
    cfrReference: '1010.2'
  },
  {
    id: 'id-label',
    text: 'Identification label (manufacturer, date, place of manufacture)',
    category: 'fda-unique',
    cfrReference: '1010.3'
  },
  {
    id: 'manual-reset',
    text: 'Manual reset mechanism for Class IV (post-1986 products)',
    category: 'fda-unique',
    cfrReference: '1040.10(f)(10)'
  },
  {
    id: 'purchasing-info',
    text: 'Purchasing and servicing information in documentation',
    category: 'fda-unique',
    cfrReference: '1040.10(h)(2)'
  },
  {
    id: 'iec-classification',
    text: 'Classification per IEC 60825-1 Clause 4',
    category: 'harmonized',
    cfrReference: '1040.10(c)(1)'
  },
  {
    id: 'iec-ael',
    text: 'AELs per IEC 60825-1 Tables',
    category: 'harmonized',
    cfrReference: '1040.10(d)'
  },
  {
    id: 'iec-housing',
    text: 'Protective housing per IEC 60825-1 4.2',
    category: 'harmonized',
    cfrReference: '1040.10(f)(1)'
  },
  {
    id: 'iec-interlocks',
    text: 'Safety interlocks per IEC 60825-1 4.3',
    category: 'harmonized',
    cfrReference: '1040.10(f)(2)'
  },
  {
    id: 'iec-labeling',
    text: 'Labeling per IEC 60825-1 Clause 5',
    category: 'harmonized',
    cfrReference: '1040.10(g)'
  },
  {
    id: 'product-report',
    text: 'Product Report submitted to CDRH (FORM FDA 3632)',
    category: 'reporting',
    cfrReference: '1002.10'
  },
  {
    id: 'iec-edition',
    text: 'Product conforms to IEC 60825-1 Edition 1.2 or 2',
    category: 'harmonized'
  }
];

// ============================================================================
// COMPONENT: HARMONIZATION TABLE
// ============================================================================

type FilterType = 'all' | 'harmonized' | 'fda-unique';

export const HarmonizationTable: React.FC = () => {
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSection, setSelectedSection] = useState<HarmonizationSection | null>(null);
  const [hoveredRow, setHoveredRow] = useState<string | null>(null);

  const filteredData = useCallback(() => {
    return HARMONIZATION_DATA.filter(section => {
      const matchesFilter = filter === 'all' || section.status === filter;
      const matchesSearch = 
        section.fdaSection.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.fdaTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.iecEquivalent.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [filter, searchQuery]);

  const getStatusBadge = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      harmonized: { background: '#ecfdf5', color: '#065f46' },
      'fda-unique': { background: '#fef2f2', color: '#991b1b' },
      'iec-unique': { background: '#eff6ff', color: '#1e40af' }
    };
    const labels: Record<string, string> = {
      harmonized: 'Harmonized',
      'fda-unique': 'FDA-Unique',
      'iec-unique': 'IEC-Unique'
    };
    return (
      <span style={{
        padding: '4px 12px',
        borderRadius: '12px',
        fontSize: '12px',
        fontWeight: 600,
        textTransform: 'uppercase',
        ...styles[status]
      }}>
        {labels[status]}
      </span>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Globe size={28} />
          FDA-IEC Harmonization Matrix
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Explore which FDA requirements are harmonized with IEC 60825-1 and which remain FDA-unique
        </p>
      </motion.div>

      {/* Filters */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap',
        alignItems: 'center'
      }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          {(['all', 'harmonized', 'fda-unique'] as FilterType[]).map((filterType) => (
            <motion.button
              key={filterType}
              onClick={() => setFilter(filterType)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '10px 20px',
                background: filter === filterType ? '#3b82f6' : '#f3f4f6',
                color: filter === filterType ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                fontSize: '14px',
                minHeight: '44px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                transition: 'all 0.2s ease'
              }}
            >
              {filterType === 'all' && <Layers size={16} />}
              {filterType === 'harmonized' && <CheckCircle size={16} />}
              {filterType === 'fda-unique' && <Shield size={16} />}
              {filterType.charAt(0).toUpperCase() + filterType.slice(1).replace('-', ' ')}
            </motion.button>
          ))}
        </div>

        <div style={{ position: 'relative', flex: 1, minWidth: '250px' }}>
          <Search size={18} style={{ 
            position: 'absolute', 
            left: '14px', 
            top: '50%', 
            transform: 'translateY(-50%)',
            color: '#9ca3af'
          }} />
          <input
            type="text"
            placeholder="Search sections..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px 12px 44px',
              borderRadius: '10px',
              border: '2px solid #e5e7eb',
              fontSize: '15px',
              outline: 'none',
              minHeight: '48px'
            }}
          />
        </div>
      </div>

      {/* Table */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '16px', 
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr style={{ background: '#f9fafb' }}>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', color: '#6b7280' }}>
                FDA Section
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', color: '#6b7280' }}>
                Title
              </th>
              <th style={{ padding: '16px', textAlign: 'left', fontSize: '13px', color: '#6b7280' }}>
                IEC Equivalent
              </th>
              <th style={{ padding: '16px', textAlign: 'center', fontSize: '13px', color: '#6b7280' }}>
                Status
              </th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {filteredData().map((section, index) => (
                <motion.tr
                  key={section.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.03 }}
                  onClick={() => setSelectedSection(section)}
                  onMouseEnter={() => setHoveredRow(section.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  style={{
                    borderBottom: '1px solid #e5e7eb',
                    cursor: 'pointer',
                    background: hoveredRow === section.id ? '#f9fafb' : 'white',
                    transition: 'background 0.2s ease'
                  }}
                >
                  <td style={{ padding: '16px', fontWeight: 600, color: '#1f2937' }}>
                    {section.fdaSection}
                  </td>
                  <td style={{ padding: '16px', color: '#374151' }}>
                    {section.fdaTitle}
                  </td>
                  <td style={{ padding: '16px', color: '#6b7280' }}>
                    {section.iecEquivalent}
                  </td>
                  <td style={{ padding: '16px', textAlign: 'center' }}>
                    {getStatusBadge(section.status)}
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>

        {filteredData().length === 0 && (
          <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af' }}>
            <Search size={48} style={{ marginBottom: '16px', opacity: 0.5 }} />
            <p>No sections match your search criteria</p>
          </div>
        )}
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedSection && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(0, 0, 0, 0.5)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={() => setSelectedSection(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '500px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' }}>
                <div>
                  <div style={{ marginBottom: '8px' }}>
                    {getStatusBadge(selectedSection.status)}
                  </div>
                  <h3 style={{ margin: 0 }}>{selectedSection.fdaSection}</h3>
                  <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>{selectedSection.fdaTitle}</p>
                </div>
                <button
                  onClick={() => setSelectedSection(null)}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '50%',
                    width: '36px',
                    height: '36px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={18} />
                </button>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  IEC Equivalent
                </h4>
                <p style={{ margin: 0, padding: '12px', background: '#f9fafb', borderRadius: '8px' }}>
                  {selectedSection.iecEquivalent}
                </p>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px' }}>
                  Notes
                </h4>
                <p style={{ margin: 0, lineHeight: 1.6 }}>{selectedSection.notes}</p>
              </div>

              {selectedSection.details && (
                <div>
                  <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                    Key Points
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {selectedSection.details.map((detail, i) => (
                      <li key={i} style={{ marginBottom: '8px', color: '#374151' }}>
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPONENT: CERTIFICATION STATEMENT BUILDER
// ============================================================================

interface CertificationOption {
  id: string;
  label: string;
  description: string;
  statement: string;
  whenToUse: string;
}

const CERTIFICATION_OPTIONS: CertificationOption[] = [
  {
    id: 'full-fda',
    label: 'Full FDA Compliance',
    description: 'Product meets all FDA requirements without relying on harmonization',
    statement: 'Complies with 21 CFR 1040.10 and 1040.11',
    whenToUse: 'When following FDA requirements exclusively'
  },
  {
    id: 'iec-1',
    label: 'IEC Harmonized (Standard Wording)',
    description: 'Product conforms to IEC standards where harmonized',
    statement: 'Complies with FDA performance standards for laser products except for deviations pursuant to Laser Notice No. 50, dated June 24, 2007',
    whenToUse: 'Most common for IEC-conforming products'
  },
  {
    id: 'iec-2',
    label: 'IEC Harmonized (Alternative Wording)',
    description: 'Alternative wording for IEC-conforming products',
    statement: 'Complies with 21 CFR 1040.10 and 1040.11 except for deviations pursuant to Laser Notice No. 50, dated June 24, 2007',
    whenToUse: 'Acceptable alternative wording'
  }
];

export const CertificationBuilder: React.FC = () => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const selectedCert = CERTIFICATION_OPTIONS.find(opt => opt.id === selectedOption);

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={28} />
          Certification Statement Builder
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Select your compliance pathway to generate the correct certification statement for your product label
        </p>
      </motion.div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '32px' }}>
        {CERTIFICATION_OPTIONS.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => setSelectedOption(option.id)}
            style={{
              padding: '24px',
              background: selectedOption === option.id ? '#eff6ff' : '#ffffff',
              border: `2px solid ${selectedOption === option.id ? '#3b82f6' : '#e5e7eb'}`,
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
              <div style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                border: `2px solid ${selectedOption === option.id ? '#3b82f6' : '#d1d5db'}`,
                background: selectedOption === option.id ? '#3b82f6' : 'transparent',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                marginTop: '2px'
              }}>
                {selectedOption === option.id && <CheckCircle size={14} color="white" />}
              </div>
              <div style={{ flex: 1 }}>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '17px' }}>{option.label}</h3>
                <p style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
                  {option.description}
                </p>
                <span style={{
                  display: 'inline-block',
                  padding: '4px 10px',
                  background: '#f3f4f6',
                  borderRadius: '4px',
                  fontSize: '12px',
                  color: '#6b7280'
                }}>
                  {option.whenToUse}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Generated statement */}
      <AnimatePresence>
        {selectedCert && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: '#ecfdf5',
              borderRadius: '16px',
              padding: '24px',
              border: '2px solid #10b981'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
              <h4 style={{ margin: 0, color: '#065f46', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle size={20} />
                Generated Certification Statement
              </h4>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleCopy(selectedCert.statement)}
                style={{
                  padding: '8px 16px',
                  background: copied ? '#10b981' : '#ffffff',
                  color: copied ? '#ffffff' : '#065f46',
                  border: '1px solid #10b981',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  minHeight: '36px'
                }}
              >
                {copied ? <Check size={14} /> : <Copy size={14} />}
                {copied ? 'Copied!' : 'Copy'}
              </motion.button>
            </div>

            <div style={{
              padding: '20px',
              background: '#ffffff',
              borderRadius: '12px',
              fontFamily: 'monospace',
              fontSize: '15px',
              lineHeight: 1.6,
              color: '#1f2937',
              border: '1px dashed #10b981'
            }}>
              {selectedCert.statement}
            </div>

            <p style={{ margin: '16px 0 0 0', fontSize: '13px', color: '#059669' }}>
              <Info size={14} style={{ display: 'inline', marginRight: '6px' }} />
              This statement must appear on your product label as part of the certification requirement.
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPONENT: COMPLIANCE CHECKLIST
// ============================================================================

export const ComplianceChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(() => {
    // Load from localStorage if available
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('ln50-checklist');
      return saved ? new Set(JSON.parse(saved)) : new Set();
    }
    return new Set();
  });
  const [showSaveToast, setShowSaveToast] = useState(false);

  // Save to localStorage whenever checkedItems changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ln50-checklist', JSON.stringify([...checkedItems]));
    }
  }, [checkedItems]);

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

  const handleSave = () => {
    setShowSaveToast(true);
    setTimeout(() => setShowSaveToast(false), 3000);
  };

  const clearAll = () => {
    setCheckedItems(new Set());
  };

  const progress = Math.round((checkedItems.size / COMPLIANCE_CHECKLIST.length) * 100);

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'fda-unique': '#dc2626',
      'harmonized': '#059669',
      'reporting': '#3b82f6'
    };
    return colors[category] || '#6b7280';
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      'fda-unique': 'FDA-Unique',
      'harmonized': 'Harmonized',
      'reporting': 'Reporting'
    };
    return labels[category] || category;
  };

  // Group items by category
  const groupedItems = COMPLIANCE_CHECKLIST.reduce((acc, item) => {
    if (!acc[item.category]) acc[item.category] = [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, ChecklistItem[]>);

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <CheckCircle size={28} />
          Laser Notice No. 50 Compliance Checklist
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Track your compliance status. Your progress is automatically saved.
        </p>
      </motion.div>

      {/* Progress bar */}
      <div style={{ 
        background: '#ffffff', 
        borderRadius: '16px', 
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          <span style={{ fontWeight: 600 }}>Compliance Progress</span>
          <span style={{ color: '#6b7280' }}>{checkedItems.size} of {COMPLIANCE_CHECKLIST.length} items</span>
        </div>
        <div style={{ 
          height: '12px', 
          background: '#e5e7eb', 
          borderRadius: '6px',
          overflow: 'hidden'
        }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: progress === 100 
                ? 'linear-gradient(90deg, #10b981, #22c55e)' 
                : 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
              borderRadius: '6px'
            }}
          />
        </div>
        <div style={{ marginTop: '12px', textAlign: 'center', fontSize: '24px', fontWeight: 700, color: progress === 100 ? '#10b981' : '#3b82f6' }}>
          {progress}%
        </div>
      </div>

      {/* Checklist by category */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {Object.entries(groupedItems).map(([category, items], catIndex) => (
          <motion.div
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: catIndex * 0.1 }}
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px',
              marginBottom: '16px'
            }}>
              <div style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                background: getCategoryColor(category)
              }} />
              <h3 style={{ margin: 0, fontSize: '16px' }}>
                {getCategoryLabel(category)} Requirements
              </h3>
              <span style={{
                marginLeft: 'auto',
                padding: '4px 12px',
                background: getCategoryColor(category) + '15',
                color: getCategoryColor(category),
                borderRadius: '12px',
                fontSize: '13px',
                fontWeight: 500
              }}>
                {items.filter(i => checkedItems.has(i.id)).length}/{items.length}
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: catIndex * 0.1 + index * 0.05 }}
                  onClick={() => toggleItem(item.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '14px',
                    background: checkedItems.has(item.id) ? '#f0fdf4' : '#f9fafb',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    border: `2px solid ${checkedItems.has(item.id) ? '#86efac' : 'transparent'}`,
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    border: `2px solid ${checkedItems.has(item.id) ? '#22c55e' : '#d1d5db'}`,
                    background: checkedItems.has(item.id) ? '#22c55e' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    {checkedItems.has(item.id) && <Check size={14} color="white" />}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ 
                      margin: '0 0 4px 0', 
                      textDecoration: checkedItems.has(item.id) ? 'line-through' : 'none',
                      color: checkedItems.has(item.id) ? '#6b7280' : '#1f2937'
                    }}>
                      {item.text}
                    </p>
                    {item.cfrReference && (
                      <span style={{ fontSize: '12px', color: '#6b7280' }}>
                        {item.cfrReference}
                      </span>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ 
        display: 'flex', 
        gap: '12px', 
        marginTop: '24px',
        justifyContent: 'center'
      }}>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          style={{
            padding: '14px 24px',
            background: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            minHeight: '48px'
          }}
        >
          <Save size={18} />
          Save Progress
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={clearAll}
          style={{
            padding: '14px 24px',
            background: '#f3f4f6',
            color: '#374151',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 600,
            minHeight: '48px'
          }}
        >
          Clear All
        </motion.button>
      </div>

      {/* Save toast */}
      <AnimatePresence>
        {showSaveToast && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            style={{
              position: 'fixed',
              bottom: '24px',
              left: '50%',
              transform: 'translateX(-50%)',
              padding: '16px 24px',
              background: '#10b981',
              color: 'white',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
              zIndex: 1000
            }}
          >
            <CheckCircle size={20} />
            Progress saved successfully!
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPONENT: TAB NAVIGATION
// ============================================================================

type TabId = 'overview' | 'harmonized' | 'fda-unique' | 'certification';

interface Tab {
  id: TabId;
  label: string;
  icon: React.ElementType;
}

const TABS: Tab[] = [
  { id: 'overview', label: 'Overview', icon: BookOpen },
  { id: 'harmonized', label: 'Harmonized Sections', icon: CheckCircle },
  { id: 'fda-unique', label: 'FDA-Unique', icon: Shield },
  { id: 'certification', label: 'Certification', icon: FileText }
];

export const HarmonizationTabs: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>('overview');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            style={{ padding: '24px' }}
          >
            <h3 style={{ marginBottom: '16px' }}>Understanding FDA-IEC Harmonization</h3>
            <p style={{ lineHeight: 1.7, marginBottom: '16px' }}>
              Laser Notice No. 50 provides a pathway for manufacturers to certify laser products 
              that conform to IEC 60825-1 standards for U.S. commerce. This harmonization reduces 
              the burden of dual certification while maintaining safety requirements.
            </p>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '24px'
            }}>
              {[
                { label: 'Harmonized Sections', value: '17', color: '#10b981' },
                { label: 'FDA-Unique Requirements', value: '10', color: '#f59e0b' },
                { label: 'Total Sections', value: '27', color: '#3b82f6' }
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.1 }}
                  style={{
                    padding: '20px',
                    background: stat.color + '10',
                    borderRadius: '12px',
                    textAlign: 'center'
                  }}
                >
                  <div style={{ fontSize: '32px', fontWeight: 700, color: stat.color }}>
                    {stat.value}
                  </div>
                  <div style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );
      case 'harmonized':
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Harmonized Sections</h3>
            <p style={{ color: '#6b7280', marginBottom: '16px' }}>
              These 17 sections are harmonized between FDA and IEC 60825-1:
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {HARMONIZATION_DATA
                .filter(s => s.status === 'harmonized')
                .map((section, i) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      padding: '12px 16px',
                      background: '#f9fafb',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <CheckCircle size={16} color="#10b981" />
                    <span style={{ fontWeight: 500 }}>{section.fdaSection}</span>
                    <span style={{ color: '#6b7280' }}>- {section.fdaTitle}</span>
                  </motion.div>
                ))}
            </div>
          </div>
        );
      case 'fda-unique':
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>FDA-Unique Requirements</h3>
            <div style={{
              padding: '16px',
              background: '#fef3c7',
              borderRadius: '8px',
              marginBottom: '16px',
              borderLeft: '4px solid #f59e0b'
            }}>
              <AlertTriangle size={20} color="#f59e0b" style={{ marginBottom: '8px' }} />
              <p style={{ margin: 0, color: '#92400e' }}>
                These requirements must be met regardless of IEC conformance
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {HARMONIZATION_DATA
                .filter(s => s.status === 'fda-unique')
                .map((section, i) => (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.03 }}
                    style={{
                      padding: '12px 16px',
                      background: '#fef2f2',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px'
                    }}
                  >
                    <AlertTriangle size={16} color="#dc2626" />
                    <span style={{ fontWeight: 500 }}>{section.fdaSection}</span>
                    <span style={{ color: '#6b7280' }}>- {section.fdaTitle}</span>
                  </motion.div>
                ))}
            </div>
          </div>
        );
      case 'certification':
        return (
          <div style={{ padding: '24px' }}>
            <h3 style={{ marginBottom: '16px' }}>Certification Requirements</h3>
            <div style={{
              padding: '16px',
              background: '#eff6ff',
              borderRadius: '8px',
              borderLeft: '4px solid #3b82f6',
              marginBottom: '24px'
            }}>
              <p style={{ margin: 0, color: '#1e40af' }}>
                <Info size={16} style={{ display: 'inline', marginRight: '6px' }} />
                All products must include the appropriate certification statement on the label, 
                regardless of harmonization pathway.
              </p>
            </div>
            <CertificationBuilder />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Layers size={28} />
          Laser Notice No. 50 Guide
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Navigate the FDA-IEC harmonization requirements
        </p>
      </motion.div>

      {/* Tab navigation */}
      <div style={{
        display: 'flex',
        gap: '4px',
        marginBottom: '24px',
        background: '#f3f4f6',
        padding: '4px',
        borderRadius: '12px',
        overflowX: 'auto'
      }}>
        {TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <motion.button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                flex: 1,
                padding: '12px 16px',
                background: activeTab === tab.id ? '#ffffff' : 'transparent',
                color: activeTab === tab.id ? '#1f2937' : '#6b7280',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 600 : 500,
                fontSize: '14px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                minHeight: '48px',
                boxShadow: activeTab === tab.id ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                transition: 'all 0.2s ease',
                whiteSpace: 'nowrap'
              }}
            >
              <Icon size={18} />
              <span style={{ display: 'inline' }}>{tab.label}</span>
            </motion.button>
          );
        })}
      </div>

      {/* Tab content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
        style={{
          background: '#ffffff',
          borderRadius: '16px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          minHeight: '400px'
        }}
      >
        {renderTabContent()}
      </motion.div>
    </div>
  );
};

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default {
  HarmonizationTable,
  CertificationBuilder,
  ComplianceChecklist,
  HarmonizationTabs
};
