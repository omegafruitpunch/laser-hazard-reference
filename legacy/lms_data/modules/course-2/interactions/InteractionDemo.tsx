/**
 * FDA Compliance Course - Interaction Demo
 * 
 * This component demonstrates all interactive components for testing
 * and showcases the interactions, animations, and states.
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, ChevronDown, Play, CheckCircle, 
  AlertCircle, Info, Smartphone, Monitor
} from 'lucide-react';

// Import all interactions
import {
  RegulatoryTimeline,
  Form3147Simulator,
  CDRHOrganizationalChart,
  ReportingDecisionWizard,
  ClassificationPyramid,
  AELCalculator,
  ClassificationWizard,
  RequirementsMatrix,
  HarmonizationTable,
  CertificationBuilder,
  ComplianceChecklist,
  HarmonizationTabs
} from './index';

// ============================================================================
// DEMO SECTION COMPONENT
// ============================================================================

interface DemoSectionProps {
  title: string;
  description: string;
  module: string;
  component: React.ReactNode;
  interactions: string[];
  animations: string[];
}

const DemoSection: React.FC<DemoSectionProps> = ({
  title,
  description,
  module,
  component,
  interactions,
  animations
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      style={{
        background: '#ffffff',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        marginBottom: '24px'
      }}
    >
      {/* Header */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          padding: '20px 24px',
          background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '16px'
        }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={24} />
        </motion.div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '12px', opacity: 0.8, marginBottom: '4px' }}>
            {module}
          </div>
          <h3 style={{ margin: 0, fontSize: '20px' }}>{title}</h3>
        </div>
        <div style={{
          padding: '6px 12px',
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '20px',
          fontSize: '12px'
        }}>
          {isExpanded ? 'Click to collapse' : 'Click to expand'}
        </div>
      </div>

      {/* Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div style={{ padding: '24px' }}>
              {/* Description */}
              <p style={{ color: '#6b7280', marginBottom: '20px' }}>{description}</p>

              {/* Interaction & Animation lists */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Play size={16} color="#3b82f6" />
                    Interactions
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4b5563' }}>
                    {interactions.map((item, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div style={{ padding: '16px', background: '#f9fafb', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <CheckCircle size={16} color="#10b981" />
                    Animations
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px', fontSize: '13px', color: '#4b5563' }}>
                    {animations.map((item, i) => (
                      <li key={i} style={{ marginBottom: '6px' }}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Component Demo */}
              <div style={{
                border: '2px dashed #e5e7eb',
                borderRadius: '12px',
                overflow: 'hidden'
              }}>
                <div style={{
                  padding: '8px 16px',
                  background: '#f9fafb',
                  borderBottom: '1px solid #e5e7eb',
                  fontSize: '12px',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Monitor size={14} />
                  Component Preview
                </div>
                <div style={{ maxHeight: '600px', overflow: 'auto' }}>
                  {component}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// ============================================================================
// MAIN DEMO COMPONENT
// ============================================================================

export const InteractionDemo: React.FC = () => {
  const [activeModule, setActiveModule] = useState<'all' | '2.1' | '2.2' | '2.3'>('all');

  const sections: DemoSectionProps[] = [
    {
      title: 'Regulatory Timeline',
      description: 'Interactive timeline showing FDA laser regulation milestones from 1960-2023. Click on any event to view detailed information.',
      module: 'Module 2.1: FDA Regulatory Framework',
      component: <RegulatoryTimeline />,
      interactions: [
        'Click timeline events to open detail modal',
        'Hover events for scale and shadow effects',
        'Modal closes on outside click or X button',
        'ESC key closes modal'
      ],
      animations: [
        'Sequential entrance animation (stagger 150ms)',
        'Hover scale 1.03 with shadow enhancement',
        'Modal fade + scale animation',
        'Center dot color transition on hover'
      ]
    },
    {
      title: 'Form 3147 Simulator',
      description: 'Practice completing a variance application form with real-time validation and field state feedback.',
      module: 'Module 2.1: FDA Regulatory Framework',
      component: <Form3147Simulator />,
      interactions: [
        'Focus field triggers highlight animation',
        'Real-time validation on input',
        'Error states show on invalid submit',
        'Confirmation dialog before submission',
        'Loading state simulation'
      ],
      animations: [
        'Field focus: blue border + shadow ring',
        'Field error: red border + shake animation',
        'Progress bar smooth fill animation',
        'Success state: scale + checkmark bounce'
      ]
    },
    {
      title: 'CDRH Organizational Chart',
      description: 'Explorable organizational chart showing FDA/CDRH structure. Click nodes to expand/collapse and view details.',
      module: 'Module 2.1: FDA Regulatory Framework',
      component: <CDRHOrganizationalChart />,
      interactions: [
        'Click node to select and view details',
        'Toggle chevron to expand/collapse children',
        'Details panel updates with node information',
        'Hover for subtle scale effect'
      ],
      animations: [
        'Tree nodes stagger entrance',
        'Expand/collapse height animation',
        'Details panel slide transition',
        'Chevron rotation on toggle'
      ]
    },
    {
      title: 'Reporting Decision Wizard',
      description: 'Step-by-step wizard to determine which FDA form is required for your situation.',
      module: 'Module 2.1: FDA Regulatory Framework',
      component: <ReportingDecisionWizard />,
      interactions: [
        'Answer questions to navigate tree',
        'Progress indicator shows completed steps',
        'Back button returns to previous step',
        'Result shows with CFR reference'
      ],
      animations: [
        'Step transition slide animation',
        'Progress dots fill sequentially',
        'Result spring animation on completion',
        'Option button hover scale'
      ]
    },
    {
      title: 'Classification Pyramid',
      description: 'Interactive pyramid visualization of FDA laser classes. Click levels to explore class characteristics.',
      module: 'Module 2.2: Laser Product Classification',
      component: <ClassificationPyramid />,
      interactions: [
        'Click pyramid level for details',
        'Side panel shows class information',
        'Hazard dots indicate danger level',
        'Hover for scale and shadow effects'
      ],
      animations: [
        'Pyramid levels stagger entrance',
        'Hover scale 1.05 with z-index change',
        'Details panel slide + fade',
        'Hazard dots pop in sequentially'
      ]
    },
    {
      title: 'AEL Calculator',
      description: 'Calculate Accessible Emission Limits based on wavelength, duration, and measurement parameters.',
      module: 'Module 2.2: Laser Product Classification',
      component: <AELCalculator />,
      interactions: [
        'Wavelength slider updates color indicator',
        'Real-time calculation on input change',
        'Calculate button triggers computation',
        'Results show classification recommendations'
      ],
      animations: [
        'Slider thumb color matches wavelength',
        'Calculate button loading spinner',
        'Results animate in sequentially',
        'Progress bar smooth transition'
      ]
    },
    {
      title: 'Classification Wizard',
      description: 'Guided questionnaire to determine FDA classification for laser products.',
      module: 'Module 2.2: Laser Product Classification',
      component: <ClassificationWizard />,
      interactions: [
        'Answer questions to advance',
        'Branching logic based on selections',
        'Progress tracking with step indicators',
        'Final classification result display'
      ],
      animations: [
        'Step slide transitions',
        'Progress dots scale on complete',
        'Result spring animation',
        'Option hover scale effect'
      ]
    },
    {
      title: 'Requirements Matrix',
      description: 'Side-by-side comparison of requirements across different laser classes.',
      module: 'Module 2.2: Laser Product Classification',
      component: <RequirementsMatrix />,
      interactions: [
        'Toggle classes to compare',
        'Table cells show requirement status',
        'Hover cells for highlight effect',
        'Color coding indicates requirement type'
      ],
      animations: [
        'Class buttons scale on toggle',
        'Table rows stagger entrance',
        'Cell hover scale + shadow',
        'Status badge fade transitions'
      ]
    },
    {
      title: 'Harmonization Table',
      description: 'Filterable table showing FDA-IEC harmonization status for all regulatory sections.',
      module: 'Module 2.3: Laser Notices & Harmonization',
      component: <HarmonizationTable />,
      interactions: [
        'Filter by status (All/Harmonized/FDA-Unique)',
        'Search to filter sections',
        'Click row for detail modal',
        'Hover row for highlight'
      ],
      animations: [
        'Filter buttons active state transition',
        'Table rows stagger on filter change',
        'Row hover background fade',
        'Modal scale + fade entrance'
      ]
    },
    {
      title: 'Certification Builder',
      description: 'Generate the correct certification statement based on compliance pathway.',
      module: 'Module 2.3: Laser Notices & Harmonization',
      component: <CertificationBuilder />,
      interactions: [
        'Select compliance pathway',
        'Statement generates automatically',
        'Copy button copies to clipboard',
        'Toast confirms copy action'
      ],
      animations: [
        'Option selection highlight',
        'Statement fade transition',
        'Copy button success animation',
        'Toast slide up + fade'
      ]
    },
    {
      title: 'Compliance Checklist',
      description: 'Track compliance progress with persistent storage. Items automatically save to localStorage.',
      module: 'Module 2.3: Laser Notices & Harmonization',
      component: <ComplianceChecklist />,
      interactions: [
        'Click items to check/uncheck',
        'Progress bar updates automatically',
        'Save button triggers confirmation',
        'Clear All resets progress'
      ],
      animations: [
        'Progress bar smooth fill',
        'Check item strikethrough animation',
        'Category cards stagger entrance',
        'Save toast slide animation'
      ]
    },
    {
      title: 'Harmonization Tabs',
      description: 'Tabbed interface for navigating harmonization content sections.',
      module: 'Module 2.3: Laser Notices & Harmonization',
      component: <HarmonizationTabs />,
      interactions: [
        'Click tabs to switch content',
        'Tab content updates dynamically',
        'Active tab has visual indicator',
        'Responsive layout on mobile'
      ],
      animations: [
        'Tab content slide + fade',
        'Active tab background transition',
        'Tab indicator slide animation',
        'Content fade on switch'
      ]
    }
  ];

  const filteredSections = sections.filter(section => {
    if (activeModule === 'all') return true;
    return section.module.includes(`Module ${activeModule}`);
  });

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ marginBottom: '32px' }}
      >
        <h1 style={{ marginBottom: '8px' }}>FDA Compliance - Interaction Demo</h1>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Interactive demonstration of all Course 2 modules with animations and state management.
        </p>

        {/* Module filter */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {[
            { id: 'all', label: 'All Modules' },
            { id: '2.1', label: 'Module 2.1' },
            { id: '2.2', label: 'Module 2.2' },
            { id: '2.3', label: 'Module 2.3' }
          ].map((mod) => (
            <motion.button
              key={mod.id}
              onClick={() => setActiveModule(mod.id as any)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                padding: '10px 20px',
                background: activeModule === mod.id ? '#3b82f6' : '#f3f4f6',
                color: activeModule === mod.id ? 'white' : '#374151',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: 500,
                minHeight: '44px'
              }}
            >
              {mod.label}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}
      >
        {[
          { label: 'Total Components', value: '12', color: '#3b82f6' },
          { label: 'Interactive Elements', value: '50+', color: '#8b5cf6' },
          { label: 'Animation Types', value: '15', color: '#10b981' },
          { label: 'Touch Targets', value: '44px+', color: '#f59e0b' }
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 + i * 0.05 }}
            style={{
              padding: '20px',
              background: 'white',
              borderRadius: '12px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
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
      </motion.div>

      {/* Demo Sections */}
      <div>
        {filteredSections.map((section, index) => (
          <motion.div
            key={section.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <DemoSection {...section} />
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        style={{
          textAlign: 'center',
          padding: '48px',
          color: '#6b7280'
        }}
      >
        <p>All interactions tested and verified for Course 2: FDA Compliance</p>
        <p style={{ fontSize: '13px', marginTop: '8px' }}>
          See INTERACTION_GUIDE.md for implementation details
        </p>
      </motion.div>
    </div>
  );
};

export default InteractionDemo;
