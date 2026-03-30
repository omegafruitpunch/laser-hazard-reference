/**
 * Module 2.6: Incident Reporting & State-Federal Jurisdiction
 * Course 2: FDA Compliance - Part 2
 * 
 * Interactive educational module covering incident reporting requirements and jurisdiction
 * Includes: Jurisdiction Mapper, Incident Reporting Scenarios, Timeline tools
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  Building, 
  Shield, 
  FileText, 
  Phone, 
  Clock, 
  CheckCircle, 
  XCircle,
  ChevronRight,
  ChevronLeft,
  Info,
  Map,
  Gavel,
  User,
  Stethoscope,
  HardHat,
  Eye,
  Activity,
  RefreshCw,
  ArrowRight
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface JurisdictionArea {
  id: string;
  name: string;
  agency: string;
  color: string;
  responsibilities: string[];
  examples: string[];
  contactInfo?: string;
}

interface IncidentType {
  id: string;
  name: string;
  description: string;
  reportingTo: string[];
  timeline: string;
  formRequired?: string;
}

interface ScenarioStep {
  id: string;
  context: string;
  question: string;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

// ============================================================================
// DATA: JURISDICTION AREAS
// ============================================================================

const JURISDICTION_AREAS: JurisdictionArea[] = [
  {
    id: 'fda_cdrh',
    name: 'FDA / CDRH',
    agency: 'Food and Drug Administration / Center for Devices and Radiological Health',
    color: '#2563eb',
    responsibilities: [
      'Product safety and compliance',
      'Performance standards enforcement',
      'Import/export control of radiation-emitting products',
      'Product Report and variance review',
      'Radiation defect notification (1003)',
      'Accident report evaluation'
    ],
    examples: [
      'Non-compliant laser products',
      'Import refusals',
      'Product recalls',
      'Variance approvals'
    ],
    contactInfo: '1-800-638-2041 | dsmica@fda.hhs.gov'
  },
  {
    id: 'osha',
    name: 'OSHA',
    agency: 'Occupational Safety and Health Administration',
    color: '#059669',
    responsibilities: [
      'Workplace safety standards',
      'Employer safety program requirements',
      'Workplace inspections and citations',
      'Employee protection in work environment',
      'Laser safety program requirements (ANSI Z136.1 reference)',
      'Personal protective equipment'
    ],
    examples: [
      'Workplace laser exposure incidents',
      'Lack of engineering controls',
      'Inadequate employee training',
      'Missing safety procedures'
    ],
    contactInfo: '1-800-321-OSHA (6742)'
  },
  {
    id: 'state_radiation',
    name: 'State Radiation Control',
    agency: 'State Radiological Health Programs',
    color: '#7c3aed',
    responsibilities: [
      'Registration of radiation-emitting devices',
      'State-level inspections',
      'Laser light show permits',
      'Medical facility oversight',
      'Complaint investigation',
      'License/permit issuance'
    ],
    examples: [
      'Laser light show permits',
      'Medical laser registrations',
      'State facility inspections',
      'Local compliance enforcement'
    ],
    contactInfo: 'Varies by state'
  },
  {
    id: 'state_health',
    name: 'State Health Departments',
    agency: 'State and Local Health Agencies',
    color: '#db2777',
    responsibilities: [
      'Public health protection',
      'Environmental health',
      'Epidemiological investigations',
      'Health hazard evaluations',
      'Community exposure concerns'
    ],
    examples: [
      'Public exposure incidents',
      'Environmental health complaints',
      'Disease tracking related to exposure'
    ],
    contactInfo: 'Varies by state/locality'
  },
  {
    id: 'joint',
    name: 'Joint Jurisdiction',
    agency: 'Multiple Agencies',
    color: '#ea580c',
    responsibilities: [
      'Complex incidents involving multiple aspects',
      'Workplace product defects',
      'State-federal coordination',
      'Comprehensive investigations'
    ],
    examples: [
      'Workplace injury from defective product',
      'Medical laser incident',
      'Multi-state laser show violation'
    ],
    contactInfo: 'Depends on primary concern'
  }
];

// ============================================================================
// DATA: INCIDENT TYPES
// ============================================================================

const INCIDENT_TYPES: IncidentType[] = [
  {
    id: 'radiation_defect',
    name: 'Radiation Defect Discovery',
    description: 'Discovery of a defect in an electronic product that relates to its radiation safety',
    reportingTo: ['FDA/CDRH'],
    timeline: 'Immediately upon discovery (21 CFR 1003.10)',
    formRequired: 'Written notification to CDRH'
  },
  {
    id: 'product_failure',
    name: 'Product Failure Affecting Safety',
    description: 'Product failure that could cause injury due to radiation emission',
    reportingTo: ['FDA/CDRH', 'Possibly OSHA if workplace'],
    timeline: 'Notification required before attempting repair (1003.10(b))',
    formRequired: 'Defect notification letter'
  },
  {
    id: 'accident_report',
    name: 'Accident Involving Radiation Injury',
    description: 'Accident involving laser radiation resulting in injury or potential injury',
    reportingTo: ['FDA/CDRH', 'State Radiation Control', 'OSHA (if workplace)'],
    timeline: 'As soon as possible after investigation (21 CFR 1002.20)',
    formRequired: 'Accident Report to CDRH'
  },
  {
    id: 'workplace_exposure',
    name: 'Occupational Laser Exposure',
    description: 'Employee exposure to laser radiation exceeding permissible limits',
    reportingTo: ['OSHA', 'State OSHA (if state plan)'],
    timeline: 'OSHA 300 log within 7 days; Serious incident immediate',
    formRequired: 'OSHA Form 300, 301'
  },
  {
    id: 'medical_laser_incident',
    name: 'Medical Laser Adverse Event',
    description: 'Patient injury during medical laser procedure',
    reportingTo: ['FDA MedWatch', 'State Medical Board', 'Joint Commission (if applicable)'],
    timeline: 'MedWatch Form 3500A as required by regulation',
    formRequired: 'FDA Form 3500A (MedWatch)'
  },
  {
    id: 'laser_show_incident',
    name: 'Laser Light Show Incident',
    description: 'Incident involving public exposure during laser show',
    reportingTo: ['FDA/CDRH', 'State Radiation Control', 'Local authorities'],
    timeline: 'Immediately to local authorities; report to FDA promptly',
    formRequired: 'Accident report; state notification'
  }
];

// ============================================================================
// COMPONENT: JURISDICTION MAPPER
// ============================================================================

const JurisdictionMapper: React.FC = () => {
  const [selectedJurisdiction, setSelectedJurisdiction] = useState<JurisdictionArea | null>(null);
  const [hoveredArea, setHoveredArea] = useState<string | null>(null);

  // Simplified diagram showing overlapping jurisdictions
  const jurisdictionDiagram = (
    <div style={{ 
      position: 'relative',
      width: '100%',
      maxWidth: '600px',
      height: '400px',
      margin: '0 auto',
      background: '#f9fafb',
      borderRadius: '16px',
      padding: '20px'
    }}>
      {/* FDA/CDRH - Top center */}
      <motion.div
        onClick={() => setSelectedJurisdiction(JURISDICTION_AREAS[0])}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedJurisdiction(JURISDICTION_AREAS[0]);
          }
        }}
        onMouseEnter={() => setHoveredArea('fda_cdrh')}
        onMouseLeave={() => setHoveredArea(null)}
        onFocus={() => setHoveredArea('fda_cdrh')}
        onBlur={() => setHoveredArea(null)}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
        style={{
          position: 'absolute',
          top: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '100px',
          background: hoveredArea === 'fda_cdrh' || selectedJurisdiction?.id === 'fda_cdrh' 
            ? '#3b82f6' : '#dbeafe',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: `3px solid ${hoveredArea === 'fda_cdrh' ? '#1d4ed8' : '#3b82f6'}`,
          outline: 'none'
        }}
        role="button"
        tabIndex={0}
        aria-pressed={selectedJurisdiction?.id === 'fda_cdrh'}
        aria-label="FDA CDRH - Product Safety. Click to view details."
      >
        <Building size={28} color={hoveredArea === 'fda_cdrh' || selectedJurisdiction?.id === 'fda_cdrh' ? '#fff' : '#2563eb'} aria-hidden="true" />
        <span style={{ 
          fontWeight: 600, 
          color: hoveredArea === 'fda_cdrh' || selectedJurisdiction?.id === 'fda_cdrh' ? '#fff' : '#1e40af',
          marginTop: '4px'
        }}>
          FDA / CDRH
        </span>
        <span style={{ fontSize: '11px', color: hoveredArea === 'fda_cdrh' || selectedJurisdiction?.id === 'fda_cdrh' ? '#dbeafe' : '#6b7280' }}>
          Product Safety
        </span>
      </motion.div>

      {/* OSHA - Left side */}
      <motion.div
        onClick={() => setSelectedJurisdiction(JURISDICTION_AREAS[1])}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedJurisdiction(JURISDICTION_AREAS[1]);
          }
        }}
        onMouseEnter={() => setHoveredArea('osha')}
        onMouseLeave={() => setHoveredArea(null)}
        onFocus={() => setHoveredArea('osha')}
        onBlur={() => setHoveredArea(null)}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
        style={{
          position: 'absolute',
          top: '140px',
          left: '20px',
          width: '180px',
          height: '120px',
          background: hoveredArea === 'osha' || selectedJurisdiction?.id === 'osha' 
            ? '#10b981' : '#d1fae5',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: `3px solid ${hoveredArea === 'osha' ? '#059669' : '#10b981'}`,
          outline: 'none'
        }}
        role="button"
        tabIndex={0}
        aria-pressed={selectedJurisdiction?.id === 'osha'}
        aria-label="OSHA - Workplace Safety. Click to view details."
      >
        <HardHat size={28} color={hoveredArea === 'osha' || selectedJurisdiction?.id === 'osha' ? '#fff' : '#059669'} aria-hidden="true" />
        <span style={{ 
          fontWeight: 600, 
          color: hoveredArea === 'osha' || selectedJurisdiction?.id === 'osha' ? '#fff' : '#065f46',
          marginTop: '4px'
        }}>
          OSHA
        </span>
        <span style={{ fontSize: '11px', color: hoveredArea === 'osha' || selectedJurisdiction?.id === 'osha' ? '#d1fae5' : '#6b7280' }}>
          Workplace Safety
        </span>
      </motion.div>

      {/* State Radiation - Right side */}
      <motion.div
        onClick={() => setSelectedJurisdiction(JURISDICTION_AREAS[2])}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedJurisdiction(JURISDICTION_AREAS[2]);
          }
        }}
        onMouseEnter={() => setHoveredArea('state_radiation')}
        onMouseLeave={() => setHoveredArea(null)}
        onFocus={() => setHoveredArea('state_radiation')}
        onBlur={() => setHoveredArea(null)}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
        style={{
          position: 'absolute',
          top: '140px',
          right: '20px',
          width: '180px',
          height: '120px',
          background: hoveredArea === 'state_radiation' || selectedJurisdiction?.id === 'state_radiation' 
            ? '#8b5cf6' : '#ede9fe',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: `3px solid ${hoveredArea === 'state_radiation' ? '#7c3aed' : '#8b5cf6'}`,
          outline: 'none'
        }}
        role="button"
        tabIndex={0}
        aria-pressed={selectedJurisdiction?.id === 'state_radiation'}
        aria-label="State Radiation Control - State Registration. Click to view details."
      >
        <Map size={28} color={hoveredArea === 'state_radiation' || selectedJurisdiction?.id === 'state_radiation' ? '#fff' : '#7c3aed'} aria-hidden="true" />
        <span style={{ 
          fontWeight: 600, 
          color: hoveredArea === 'state_radiation' || selectedJurisdiction?.id === 'state_radiation' ? '#fff' : '#5b21b6',
          marginTop: '4px'
        }}>
          State Radiation
        </span>
        <span style={{ fontSize: '11px', color: hoveredArea === 'state_radiation' || selectedJurisdiction?.id === 'state_radiation' ? '#ede9fe' : '#6b7280' }}>
          State Registration
        </span>
      </motion.div>

      {/* State Health - Bottom center */}
      <motion.div
        onClick={() => setSelectedJurisdiction(JURISDICTION_AREAS[3])}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedJurisdiction(JURISDICTION_AREAS[3]);
          }
        }}
        onMouseEnter={() => setHoveredArea('state_health')}
        onMouseLeave={() => setHoveredArea(null)}
        onFocus={() => setHoveredArea('state_health')}
        onBlur={() => setHoveredArea(null)}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          width: '200px',
          height: '100px',
          background: hoveredArea === 'state_health' || selectedJurisdiction?.id === 'state_health' 
            ? '#ec4899' : '#fce7f3',
          borderRadius: '12px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: `3px solid ${hoveredArea === 'state_health' ? '#db2777' : '#ec4899'}`,
          outline: 'none'
        }}
        role="button"
        tabIndex={0}
        aria-pressed={selectedJurisdiction?.id === 'state_health'}
        aria-label="State Health Departments - Public Health. Click to view details."
      >
        <Stethoscope size={28} color={hoveredArea === 'state_health' || selectedJurisdiction?.id === 'state_health' ? '#fff' : '#db2777'} aria-hidden="true" />
        <span style={{ 
          fontWeight: 600, 
          color: hoveredArea === 'state_health' || selectedJurisdiction?.id === 'state_health' ? '#fff' : '#9d174d',
          marginTop: '4px'
        }}>
          State Health
        </span>
        <span style={{ fontSize: '11px', color: hoveredArea === 'state_health' || selectedJurisdiction?.id === 'state_health' ? '#fce7f3' : '#6b7280' }}>
          Public Health
        </span>
      </motion.div>

      {/* Joint Jurisdiction - Center */}
      <motion.div
        onClick={() => setSelectedJurisdiction(JURISDICTION_AREAS[4])}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setSelectedJurisdiction(JURISDICTION_AREAS[4]);
          }
        }}
        onMouseEnter={() => setHoveredArea('joint')}
        onMouseLeave={() => setHoveredArea(null)}
        onFocus={() => setHoveredArea('joint')}
        onBlur={() => setHoveredArea(null)}
        whileHover={{ scale: 1.05 }}
        whileFocus={{ scale: 1.05 }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: '140px',
          height: '80px',
          background: hoveredArea === 'joint' || selectedJurisdiction?.id === 'joint' 
            ? '#f97316' : '#ffedd5',
          borderRadius: '50%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          border: `3px solid ${hoveredArea === 'joint' ? '#ea580c' : '#f97316'}`,
          outline: 'none'
        }}
        role="button"
        tabIndex={0}
        aria-pressed={selectedJurisdiction?.id === 'joint'}
        aria-label="Joint Jurisdiction - Multiple Agencies Overlap. Click to view details."
      >
        <span style={{ 
          fontWeight: 600, 
          fontSize: '12px',
          color: hoveredArea === 'joint' || selectedJurisdiction?.id === 'joint' ? '#fff' : '#c2410c'
        }}>
          Joint
        </span>
        <span style={{ 
          fontSize: '10px', 
          color: hoveredArea === 'joint' || selectedJurisdiction?.id === 'joint' ? '#ffedd5' : '#6b7280' 
        }}>
          Overlap
        </span>
      </motion.div>

      {/* Connection lines (simplified) */}
      <svg style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        <line x1="300" y1="120" x2="110" y2="180" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="300" y1="120" x2="490" y2="180" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="110" y1="260" x2="300" y2="340" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />
        <line x1="490" y1="260" x2="300" y2="340" stroke="#d1d5db" strokeWidth="2" strokeDasharray="5,5" />
      </svg>
    </div>
  );

  return (
    <div 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Jurisdiction Mapper"
    >
      <h2 style={{ marginBottom: '8px' }}>Jurisdiction Mapper</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="jurisdiction-desc">
        Click on an area to learn about each agency's responsibilities and when they have jurisdiction.
      </p>

      <div 
        role="application" 
        aria-label="Interactive jurisdiction diagram"
        aria-describedby="jurisdiction-desc"
      >
        {jurisdictionDiagram}
      </div>

      <AnimatePresence>
        {selectedJurisdiction && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              marginTop: '24px',
              padding: '24px',
              background: '#f9fafb',
              borderRadius: '12px',
              borderLeft: `4px solid ${selectedJurisdiction.color}`
            }}
            role="region"
            aria-label={`${selectedJurisdiction.name} details`}
            aria-live="polite"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0' }}>{selectedJurisdiction.name}</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  {selectedJurisdiction.agency}
                </p>
              </div>
              <button
                onClick={() => setSelectedJurisdiction(null)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '4px'
                }}
                aria-label="Close jurisdiction details"
              >
                <XCircle size={24} color="#6b7280" aria-hidden="true" />
              </button>
            </div>

            <div style={{ marginTop: '20px', display: 'grid', gap: '20px', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  Key Responsibilities
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                  {selectedJurisdiction.responsibilities.map((resp, index) => (
                    <li key={index} style={{ marginBottom: '6px' }}>{resp}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  Examples
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '14px' }}>
                  {selectedJurisdiction.examples.map((example, index) => (
                    <li key={index} style={{ marginBottom: '6px' }}>{example}</li>
                  ))}
                </ul>
              </div>
            </div>

            {selectedJurisdiction.contactInfo && (
              <div style={{ 
                marginTop: '20px',
                padding: '12px 16px',
                background: '#ffffff',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px'
              }}>
                <Phone size={16} color={selectedJurisdiction.color} aria-hidden="true" />
                <span><strong>Contact:</strong> {selectedJurisdiction.contactInfo}</span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <div style={{ 
        marginTop: '24px',
        padding: '16px',
        background: '#fef3c7',
        borderRadius: '8px'
      }}>
        <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Info size={18} />
          Key Principle
        </h4>
        <p style={{ margin: 0, fontSize: '14px' }}>
          <strong>Product vs. Workplace:</strong> FDA regulates the PRODUCT (manufacturing, compliance, imports). 
          OSHA regulates the WORKPLACE (how employers use and protect workers). State agencies may regulate both 
          through registration, permits, and local enforcement.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: INCIDENT REPORTING GUIDE
// ============================================================================

const IncidentReportingGuide: React.FC = () => {
  const [selectedIncident, setSelectedIncident] = useState<IncidentType | null>(null);

  return (
    <div 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Incident Reporting Guide"
    >
      <h2 style={{ marginBottom: '8px' }}>Incident Reporting Guide</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="incident-guide-desc">
        Determine reporting requirements based on the type of incident.
      </p>

      <div 
        style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
        role="list"
        aria-label="Incident types"
      >
        {INCIDENT_TYPES.map((incident) => (
          <motion.div
            key={incident.id}
            onClick={() => setSelectedIncident(incident)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedIncident(incident);
              }
            }}
            whileHover={{ scale: 1.01 }}
            role="button"
            tabIndex={0}
            aria-pressed={selectedIncident?.id === incident.id}
            aria-label={`${incident.name}. Report to: ${incident.reportingTo.join(', ')}`}
            style={{
              padding: '16px 20px',
              background: selectedIncident?.id === incident.id ? '#eff6ff' : '#ffffff',
              border: `2px solid ${selectedIncident?.id === incident.id ? '#3b82f6' : '#e5e7eb'}`,
              borderRadius: '10px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              outline: 'none'
            }}
          >
            <div style={{
              width: '40px',
              height: '40px',
              background: selectedIncident?.id === incident.id ? '#3b82f6' : '#fee2e2',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
              aria-hidden="true"
            >
              <AlertTriangle size={20} color={selectedIncident?.id === incident.id ? '#fff' : '#dc2626'} aria-hidden="true" />
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0', fontSize: '15px' }}>{incident.name}</h4>
              <p style={{ margin: 0, fontSize: '13px', color: '#6b7280' }}>
                Report to: {incident.reportingTo.join(', ')}
              </p>
            </div>
            <ChevronRight size={20} color="#9ca3af" aria-hidden="true" />
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedIncident && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{
              marginTop: '24px',
              padding: '24px',
              background: '#f9fafb',
              borderRadius: '12px',
              overflow: 'hidden'
            }}
          >
            <h3 style={{ margin: '0 0 12px 0' }}>{selectedIncident.name}</h3>
            <p style={{ marginBottom: '20px', color: '#374151' }}>
              {selectedIncident.description}
            </p>

            <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))' }}>
              <div style={{ 
                padding: '16px', 
                background: '#ffffff', 
                borderRadius: '8px',
                borderLeft: '4px solid '#dc2626'
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#dc2626' }}>
                  <Clock size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Timeline
                </h4>
                <p style={{ margin: 0, fontSize: '14px' }}>{selectedIncident.timeline}</p>
              </div>

              <div style={{ 
                padding: '16px', 
                background: '#ffffff', 
                borderRadius: '8px',
                borderLeft: '4px solid #059669'
              }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#059669' }}>
                  <Gavel size={16} style={{ display: 'inline', marginRight: '6px' }} />
                  Report To
                </h4>
                <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '14px' }}>
                  {selectedIncident.reportingTo.map((agency, index) => (
                    <li key={index}>{agency}</li>
                  ))}
                </ul>
              </div>

              {selectedIncident.formRequired && (
                <div style={{ 
                  padding: '16px', 
                  background: '#ffffff', 
                  borderRadius: '8px',
                  borderLeft: '4px solid #3b82f6'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#3b82f6' }}>
                    <FileText size={16} style={{ display: 'inline', marginRight: '6px' }} />
                    Form Required
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px' }}>{selectedIncident.formRequired}</p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPONENT: INCIDENT REPORTING SCENARIOS
// ============================================================================

const INCIDENT_SCENARIOS: ScenarioStep[] = [
  {
    id: 'scenario1',
    context: 'A manufacturing technician at your facility is adjusting a Class IV laser when an accidental exposure occurs to the eye. The technician reports seeing a bright flash and is experiencing after-images.',
    question: 'Which agencies must be notified of this incident?',
    options: [
      {
        id: 'a',
        text: 'OSHA only',
        isCorrect: false,
        feedback: 'Incorrect. While OSHA must be notified for workplace injuries, FDA/CDRH should also be notified of accidents involving radiation injury.'
      },
      {
        id: 'b',
        text: 'OSHA and FDA/CDRH',
        isCorrect: true,
        feedback: 'Correct! This workplace accident resulting in injury must be reported to OSHA (workplace safety) and FDA/CDRH (radiation accident).'
      },
      {
        id: 'c',
        text: 'State health department only',
        isCorrect: false,
        feedback: 'Incorrect. While the state may be involved, both OSHA and FDA have primary jurisdiction for this type of incident.'
      }
    ]
  },
  {
    id: 'scenario2',
    context: 'During quality testing, you discover that a batch of laser pointers is emitting 10mW instead of the rated 1mW, making them Class IIIb instead of Class IIIa.',
    question: 'What reporting is required?',
    options: [
      {
        id: 'a',
        text: 'Submit a radiation defect notification to FDA',
        isCorrect: true,
        feedback: 'Correct! Discovery of a defect relating to radiation safety requires immediate notification to CDRH per 21 CFR 1003.10.'
      },
      {
        id: 'b',
        text: 'Fix the issue and document internally - no external reporting needed',
        isCorrect: false,
        feedback: 'Incorrect. Defects affecting radiation safety must be reported to FDA before attempting repair or correction.'
      },
      {
        id: 'c',
        text: 'Include in the next Annual Report',
        isCorrect: false,
        feedback: 'Incorrect. Defect notifications require immediate reporting, not waiting for the Annual Report.'
      }
    ]
  },
  {
    id: 'scenario3',
    context: 'A laser light show operator scans the audience with a Class IIIb laser. Several audience members report eye discomfort.',
    question: 'Who has jurisdiction to investigate this incident?',
    options: [
      {
        id: 'a',
        text: 'FDA/CDRH only',
        isCorrect: false,
        feedback: 'Incorrect. While FDA has jurisdiction over the laser product and variance compliance, state radiation control and local authorities also have jurisdiction.'
      },
      {
        id: 'b',
        text: 'FDA/CDRH, State Radiation Control, and local authorities',
        isCorrect: true,
        feedback: 'Correct! Laser light show incidents involve multiple jurisdictions: FDA (product/variance), State (permits/registration), and local (public safety).'
      },
      {
        id: 'c',
        text: 'Local police only',
        isCorrect: false,
        feedback: 'Incorrect. While local authorities may respond initially, radiation safety agencies have primary regulatory jurisdiction.'
      }
    ]
  },
  {
    id: 'scenario4',
    context: 'A medical procedure using a surgical laser results in an unintended burn to the patient. The facility determines it was due to incorrect device settings.',
    question: 'What reporting is required for this medical laser adverse event?',
    options: [
      {
        id: 'a',
        text: 'FDA MedWatch only',
        isCorrect: false,
        feedback: 'Incomplete. While FDA MedWatch is required for device-related adverse events, there may be additional state medical board reporting requirements.'
      },
      {
        id: 'b',
        text: 'FDA MedWatch, State Medical Board, and Joint Commission if applicable',
        isCorrect: true,
        feedback: 'Correct! Medical laser adverse events typically require reporting to FDA MedWatch, the state medical board, and may require Joint Commission notification.'
      },
      {
        id: 'c',
        text: 'Internal incident report only',
        isCorrect: false,
        feedback: 'Incorrect. Device-related injuries must be reported to FDA through MedWatch, and state medical board requirements may also apply.'
      }
    ]
  }
];

const IncidentScenarios: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const scenario = INCIDENT_SCENARIOS[currentStep];
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
    if (currentStep < INCIDENT_SCENARIOS.length - 1) {
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
          background: score === INCIDENT_SCENARIOS.length ? '#ecfdf5' : '#fef3c7',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>
            {score === INCIDENT_SCENARIOS.length ? '🎉' : '📝'}
          </div>
          <h2 style={{ marginBottom: '8px' }}>
            Scenario Exercise Complete!
          </h2>
          <p style={{ fontSize: '18px', marginBottom: '24px' }}>
            You scored {score} out of {INCIDENT_SCENARIOS.length}
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
      <h2 style={{ marginBottom: '8px' }}>Incident Reporting Scenarios</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Test your knowledge of incident reporting requirements and jurisdiction.
      </p>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '12px',
          fontSize: '14px',
          color: '#6b7280'
        }}>
          <span>Scenario {currentStep + 1} of {INCIDENT_SCENARIOS.length}</span>
          <span>Score: {score}/{currentStep + (showFeedback ? 1 : 0)}</span>
        </div>
        <div style={{ 
          height: '8px', 
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${((currentStep + 1) / INCIDENT_SCENARIOS.length) * 100}%`,
            height: '100%',
            background: '#3b82f6',
            borderRadius: '4px'
          }} />
        </div>
      </div>

      <div style={{
        background: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{
          padding: '16px',
          background: '#fee2e2',
          borderRadius: '8px',
          marginBottom: '20px',
          borderLeft: '4px solid #dc2626'
        }}>
          <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Activity size={18} />
            Scenario
          </h4>
          <p style={{ margin: 0, color: '#7f1d1d' }}>{scenario.context}</p>
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
                cursor: showFeedback ? 'default' : 'pointer'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  background: showFeedback
                    ? option.isCorrect ? '#10b981' : selectedOption === option.id ? '#ef4444' : '#e5e7eb'
                    : '#e5e7eb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px'
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
                  <XCircle size={20} color="#ef4444" />
                )}
                <span style={{ fontWeight: 600 }}>
                  {selectedAnswer.isCorrect ? 'Correct!' : 'Incorrect'}
                </span>
              </div>
              <p style={{ margin: 0, fontSize: '14px' }}>
                {selectedAnswer.feedback}
              </p>
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
              gap: '8px'
            }}
          >
            {currentStep < INCIDENT_SCENARIOS.length - 1 ? 'Next Scenario' : 'See Results'}
            <ArrowRight size={18} />
          </button>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: REPORTING TIMELINE
// ============================================================================

const ReportingTimeline: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<string | null>(null);

  const timelineEvents = [
    {
      id: 'immediate',
      time: 'Immediate',
      title: 'Radiation Defect Discovery',
      description: 'Upon discovery of defect relating to radiation safety',
      cfr: '21 CFR 1003.10',
      to: 'FDA/CDRH',
      action: 'Written notification before attempting repair'
    },
    {
      id: 'accident',
      time: 'As Soon As Possible',
      title: 'Accident Report',
      description: 'After investigation of accident involving radiation injury',
      cfr: '21 CFR 1002.20',
      to: 'FDA/CDRH',
      action: 'Submit accident report with investigation findings'
    },
    {
      id: 'workplace',
      time: 'Within 24 hours',
      title: 'Serious Workplace Injury',
      description: 'Hospitalization, amputation, or eye loss',
      cfr: '29 CFR 1904.39',
      to: 'OSHA',
      action: 'Report serious incident to OSHA'
    },
    {
      id: 'osha_log',
      time: 'Within 7 days',
      title: 'OSHA Recordable',
      description: 'Work-related injury requiring medical treatment',
      cfr: '29 CFR 1904.29',
      to: 'OSHA',
      action: 'Record on OSHA Form 300'
    },
    {
      id: 'medwatch',
      time: 'Within 30 days',
      title: 'Medical Device Report (MDR)',
      description: 'Device malfunction or serious injury',
      cfr: '21 CFR 803',
      to: 'FDA MedWatch',
      action: 'Submit FDA Form 3500A'
    },
    {
      id: 'annual',
      time: 'September 1',
      title: 'Annual Report',
      description: 'Summary of records and new models',
      cfr: '21 CFR 1002.13',
      to: 'FDA/CDRH',
      action: 'Submit annual report for 12 months ending June 30'
    }
  ];

  return (
    <div 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Reporting Timeline"
    >
      <h2 style={{ marginBottom: '8px' }}>Reporting Timeline</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="timeline-desc">
        Key reporting deadlines and timelines for various incident types.
      </p>

      <div 
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        role="list"
        aria-label="FDA regulatory reporting timeline"
      >
        {timelineEvents.map((event, index) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            onClick={() => setSelectedEvent(selectedEvent === event.id ? null : event.id)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setSelectedEvent(selectedEvent === event.id ? null : event.id);
              }
            }}
            role="button"
            tabIndex={0}
            aria-expanded={selectedEvent === event.id}
            aria-label={`${event.title}: ${event.time}. Click to ${selectedEvent === event.id ? 'collapse' : 'expand'} details.`}
            style={{
              display: 'flex',
              gap: '16px',
              padding: '20px',
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              cursor: 'pointer',
              border: `2px solid ${selectedEvent === event.id ? '#3b82f6' : 'transparent'}`,
              outline: 'none'
            }}
          >
            <div style={{
              width: '80px',
              padding: '8px',
              background: event.time === 'Immediate' ? '#fee2e2' : 
                         event.time === 'September 1' ? '#dbeafe' : '#fef3c7',
              borderRadius: '8px',
              textAlign: 'center',
              flexShrink: 0
            }}
              aria-hidden="true"
            >
              <Clock size={16} style={{ margin: '0 auto 4px' }} color={
                event.time === 'Immediate' ? '#dc2626' : 
                event.time === 'September 1' ? '#2563eb' : '#f59e0b'
              } />
              <div style={{ 
                fontSize: '11px', 
                fontWeight: 600,
                color: event.time === 'Immediate' ? '#dc2626' : 
                       event.time === 'September 1' ? '#2563eb' : '#f59e0b'
              }}>
                {event.time}
              </div>
            </div>

            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0' }}>{event.title}</h4>
              <p style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#6b7280' }}>
                {event.description}
              </p>
              
              <AnimatePresence>
                {selectedEvent === event.id && (
                  <motion.div
                    id={`event-details-${event.id}`}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    style={{
                      marginTop: '12px',
                      padding: '12px',
                      background: '#f9fafb',
                      borderRadius: '8px'
                    }}
                    role="region"
                    aria-label={`${event.title} details`}
                  >
                    <div style={{ display: 'grid', gap: '8px', fontSize: '13px' }}>
                      <div><strong>Report To:</strong> {event.to}</div>
                      <div><strong>CFR Reference:</strong> {event.cfr}</div>
                      <div><strong>Action:</strong> {event.action}</div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <ChevronRight 
              size={20} 
              color="#9ca3af"
              style={{ 
                transform: selectedEvent === event.id ? 'rotate(90deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s',
                alignSelf: 'center'
              }}
              aria-hidden="true"
            />
          </motion.div>
        ))}
      </div>

      <div 
        style={{ 
          marginTop: '24px',
          padding: '16px',
          background: '#fee2e2',
          borderRadius: '8px',
          borderLeft: '4px solid #dc2626'
        }}
        role="alert"
        aria-label="Important reporting note"
      >
        <h4 style={{ margin: '0 0 8px 0', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <AlertTriangle size={18} aria-hidden="true" />
          Important Note
        </h4>
        <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
          When in doubt, report. Failure to report incidents or defects in a timely manner can result 
          in regulatory violations and penalties. When multiple agencies have jurisdiction, report to 
          all applicable agencies.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: KEY CONTACTS
// ============================================================================

const KeyContacts: React.FC = () => {
  const contacts = [
    {
      agency: 'FDA/CDRH - Electronic Products',
      phone: '1-800-638-2041',
      email: 'dsmica@fda.hhs.gov',
      address: 'Document Mail Center – WO66-G609\n10903 New Hampshire Avenue\nSilver Spring, MD 20993-0002'
    },
    {
      agency: 'OSHA',
      phone: '1-800-321-OSHA (6742)',
      website: 'www.osha.gov',
      note: 'For workplace safety concerns and reporting'
    },
    {
      agency: 'FDA MedWatch (Medical Device Reporting)',
      phone: '1-800-FDA-1088',
      website: 'www.fda.gov/medwatch',
      note: 'For medical laser adverse events'
    },
    {
      agency: 'Conference of Radiation Control Program Directors (CRCPD)',
      website: 'www.crcpd.org',
      note: 'Directory of state radiation control programs'
    }
  ];

  return (
    <div 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Key Contacts"
    >
      <h2 style={{ marginBottom: '8px' }}>Key Contacts</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="contacts-desc">
        Important contact information for reporting and inquiries.
      </p>

      <div 
        style={{ display: 'grid', gap: '16px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}
        role="list"
        aria-label="Agency contact information"
      >
        {contacts.map((contact, index) => (
          <article
            key={index}
            style={{
              padding: '20px',
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            aria-labelledby={`contact-title-${index}`}
          >
            <h4 id={`contact-title-${index}`} style={{ margin: '0 0 12px 0', color: '#1f2937' }}>{contact.agency}</h4>
            
            <address style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px', fontStyle: 'normal' }}>
              {contact.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={16} color="#6b7280" aria-hidden="true" />
                  <span aria-label={`Phone: ${contact.phone}`}>{contact.phone}</span>
                </div>
              )}
              {contact.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#6b7280' }} aria-hidden="true">✉</span>
                  <span aria-label={`Email: ${contact.email}`}>{contact.email}</span>
                </div>
              )}
              {contact.website && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ color: '#6b7280' }} aria-hidden="true">🌐</span>
                  <span aria-label={`Website: ${contact.website}`}>{contact.website}</span>
                </div>
              )}
              {contact.address && (
                <div style={{ marginTop: '8px', color: '#6b7280', whiteSpace: 'pre-line' }} aria-label={`Address: ${contact.address}`}>
                  {contact.address}
                </div>
              )}
              {contact.note && (
                <div 
                  style={{ marginTop: '8px', padding: '8px', background: '#f3f4f6', borderRadius: '6px', fontSize: '13px' }}
                  role="note"
                >
                  {contact.note}
                </div>
              )}
            </address>
          </article>
        ))}
      </div>
    </div>
  );
};

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

const Module26IncidentReporting: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'jurisdiction' | 'incidents' | 'scenarios' | 'timeline' | 'contacts'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'jurisdiction', label: 'Jurisdiction Mapper', icon: Map },
    { id: 'incidents', label: 'Incident Guide', icon: AlertTriangle },
    { id: 'scenarios', label: 'Scenarios', icon: Activity },
    { id: 'timeline', label: 'Timeline', icon: Clock },
    { id: 'contacts', label: 'Contacts', icon: Phone }
  ];

  return (
    <div className="module-2-6" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Module Header */}
      <div style={{ 
        padding: '32px 24px',
        background: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
        color: '#ffffff',
        borderRadius: '0 0 16px 16px'
      }}>
        <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
          Course 2: FDA Compliance • Module 2.6
        </div>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Incident Reporting & Jurisdiction</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
          Understanding State-Federal Jurisdiction and Reporting Requirements
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
              background: activeTab === tab.id ? '#fee2e2' : 'transparent',
              color: activeTab === tab.id ? '#dc2626' : '#6b7280',
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
              Understanding which agency has jurisdiction and what incidents must be reported is critical 
              for laser safety compliance. This module covers the intersection of FDA, OSHA, and state 
              radiation control jurisdictions, along with specific reporting requirements for various 
              types of incidents.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                padding: '24px',
                background: '#fee2e2',
                borderRadius: '12px'
              }}>
                <Building size={32} color="#dc2626" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>FDA/CDRH</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
                  Product safety, compliance, and radiation defect notification
                </p>
              </div>
              <div style={{
                padding: '24px',
                background: '#d1fae5',
                borderRadius: '12px'
              }}>
                <HardHat size={32} color="#059669" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>OSHA</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#065f46' }}>
                  Workplace safety and employee protection
                </p>
              </div>
              <div style={{
                padding: '24px',
                background: '#ede9fe',
                borderRadius: '12px'
              }}>
                <Map size={32} color="#7c3aed" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>State Control</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#5b21b6' }}>
                  Registration, permits, and local enforcement
                </p>
              </div>
            </div>

            <div style={{
              padding: '20px',
              background: '#f9fafb',
              borderRadius: '12px',
              border: '2px solid #e5e7eb'
            }}>
              <h3 style={{ margin: '0 0 16px 0' }}>Learning Objectives</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>Identify which agency has jurisdiction for different scenarios</li>
                <li style={{ marginBottom: '8px' }}>Understand radiation defect notification requirements</li>
                <li style={{ marginBottom: '8px' }}>Know when and how to report accidents and injuries</li>
                <li style={{ marginBottom: '8px' }}>Navigate multi-agency reporting situations</li>
                <li>Access key contact information for reporting</li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'jurisdiction' && <JurisdictionMapper />}
        {activeTab === 'incidents' && <IncidentReportingGuide />}
        {activeTab === 'scenarios' && <IncidentScenarios />}
        {activeTab === 'timeline' && <ReportingTimeline />}
        {activeTab === 'contacts' && <KeyContacts />}
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
          CFR References: 21 CFR 1002.20, 1003.10, 1003.11 | 29 CFR 1904, 1926
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
            background: '#dc2626',
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

export default Module26IncidentReporting;
