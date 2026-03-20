/**
 * Module 2.1: FDA Regulatory Framework - Interaction Components
 * 
 * Interactive components with animations and states:
 * - Regulatory Timeline with sequential animations
 * - Form Selection Wizard with decision tree
 * - Reporting Flowchart with interactive nodes
 * - Compliance Scenarios with branching
 */

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, Calendar, ChevronRight, ChevronLeft, Info, 
  FileText, CheckCircle, AlertTriangle, RefreshCw,
  Building, Phone, Mail, MapPin, Shield, BookOpen,
  ArrowRight, X, Loader2, HelpCircle, ExternalLink
} from 'lucide-react';

// ============================================================================
// ANIMATION VARIANTS
// ============================================================================

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.9 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 }
};

const slideIn = {
  initial: { opacity: 0, x: 30 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -30 }
};

// ============================================================================
// TYPES
// ============================================================================

interface TimelineEvent {
  id: string;
  year: number;
  title: string;
  description: string;
  significance: string;
  details?: string[];
  cfrReference?: string;
}

interface DecisionNode {
  id: string;
  question: string;
  options: {
    label: string;
    nextNodeId?: string;
    result?: string;
    cfrReference?: string;
    action?: string;
  }[];
}

interface Form3147Field {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'textarea' | 'number';
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
  validation?: (value: string) => boolean;
}

// ============================================================================
// DATA: REGULATORY TIMELINE
// ============================================================================

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    id: '1960',
    year: 1960,
    title: 'First Laser Demonstrated',
    description: 'Theodore Maiman demonstrates the first working laser at Hughes Research Laboratories',
    significance: 'Beginning of the laser era - no regulatory framework yet exists',
    details: ['Ruby laser at 694nm', 'Millisecond pulses', 'Instantly recognized as revolutionary']
  },
  {
    id: '1968',
    year: 1968,
    title: 'Radiation Control Act',
    description: 'Congress passes Public Law 90-602, giving FDA authority over electronic product radiation',
    significance: 'Legal foundation for FDA laser oversight',
    cfrReference: 'P.L. 90-602',
    details: ['Authorizes performance standards', 'Establishes FDA jurisdiction', 'Covers all electronic radiation products']
  },
  {
    id: '1975',
    year: 1975,
    title: 'Original Laser Standard Published',
    description: '21 CFR 1040.10 and 1040.11 established with Classes I-IV',
    significance: 'First comprehensive laser product regulations',
    cfrReference: '21 CFR 1040.10, 1040.11',
    details: ['Four laser classes established', 'Performance requirements defined', 'Labeling requirements specified']
  },
  {
    id: '1976',
    year: 1976,
    title: 'Standard Effective Date',
    description: 'August 2, 1976 - All laser products manufactured on or after this date must comply',
    significance: 'Enforcement begins - no grandfathering',
    details: ['Compliance mandatory for new products', 'Reporting requirements active', 'CDRH begins enforcement']
  },
  {
    id: '1985',
    year: 1985,
    title: 'Laser Light Show Guidance',
    description: 'Appendix B added to Compliance Guide clarifying demonstration laser requirements',
    significance: 'Entertainment industry-specific guidance',
    details: ['Variance process introduced', 'Demonstration laser definition', 'Safety procedures specified']
  },
  {
    id: '1986',
    year: 1986,
    title: 'Class IV Manual Reset Requirement',
    description: 'August 20, 1986 - Class IV laser systems must include manual reset after power failure',
    significance: 'Enhanced safety for high-power lasers',
    cfrReference: '21 CFR 1040.10(f)(10)',
    details: ['Prevents unexpected restarts', 'Manual intervention required', 'Post-1986 products only']
  },
  {
    id: '1988',
    year: 1988,
    title: 'Laser Notice No. 41',
    description: 'Exemption for certain low-power inherently Class I laser products from reporting',
    significance: 'Reduced burden for low-risk products',
    details: ['Low-power exemptions', 'Inherently safe products', 'Reduced reporting requirements']
  },
  {
    id: '2001',
    year: 2001,
    title: 'Original Laser Notice No. 50',
    description: 'First guidance on conformance with IEC 60825-1 Amendment 2',
    significance: 'Beginning of FDA-IEC harmonization',
    details: ['IEC conformance pathway', 'Alternative compliance route', 'International harmonization begins']
  },
  {
    id: '2007',
    year: 2007,
    title: 'Revised Laser Notice No. 50',
    description: 'June 24, 2007 - Expanded acceptance of IEC 60825-1 Editions 1.2 and 2',
    significance: 'Major harmonization milestone',
    cfrReference: 'Laser Notice No. 50 (2007)',
    details: ['17 sections harmonized', 'IEC Editions 1.2 and 2 accepted', 'Reduced dual certification burden']
  },
  {
    id: '2014',
    year: 2014,
    title: 'Laser Notice No. 56',
    description: 'Guidance on conformance with IEC 60825-1 Ed. 3 and IEC 60601-2-22 Ed. 3.1',
    significance: 'Updated harmonization for modern standards',
    details: ['Latest IEC edition support', 'Medical laser harmonization', 'Continued alignment']
  },
  {
    id: '2023',
    year: 2023,
    title: 'Final Rule Amendments',
    description: 'January 20, 2023 - Amendments to records and reporting requirements',
    significance: 'Streamlined reporting for modern industry',
    cfrReference: '88 FR 241',
    details: ['Reduced reporting burden', 'Modernized requirements', 'Effective February 21, 2023']
  }
];

// ============================================================================
// DATA: FORM 3147 FIELDS
// ============================================================================

const FORM_3147_FIELDS: Form3147Field[] = [
  {
    id: 'applicant_name',
    label: 'Applicant Name',
    type: 'text',
    required: true,
    placeholder: 'Company or individual name',
    helpText: 'Legal entity applying for the variance'
  },
  {
    id: 'contact_person',
    label: 'Contact Person',
    type: 'text',
    required: true,
    placeholder: 'Primary contact for this application'
  },
  {
    id: 'email',
    label: 'Email Address',
    type: 'text',
    required: true,
    placeholder: 'contact@company.com',
    validation: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)
  },
  {
    id: 'phone',
    label: 'Phone Number',
    type: 'text',
    required: true,
    placeholder: '(555) 123-4567'
  },
  {
    id: 'variance_type',
    label: 'Type of Variance',
    type: 'select',
    required: true,
    options: [
      'Laser Light Show (Class IIIb/IV)',
      'Medical Laser Product',
      'Alternate Labeling',
      'Alternate Performance Requirement',
      'Reporting Exemption'
    ]
  },
  {
    id: 'product_description',
    label: 'Product Description',
    type: 'textarea',
    required: true,
    placeholder: 'Describe the laser product and its intended use...',
    helpText: 'Include laser class, power, wavelength, and intended application'
  },
  {
    id: 'justification',
    label: 'Justification for Variance',
    type: 'textarea',
    required: true,
    placeholder: 'Explain why this variance is necessary and how safety will be maintained...',
    helpText: 'FDA requires adequate justification for all variance requests'
  },
  {
    id: 'safety_measures',
    label: 'Alternative Safety Measures',
    type: 'textarea',
    required: true,
    placeholder: 'Describe the safety measures that will be implemented...'
  }
];

// ============================================================================
// COMPONENT: INTERACTIVE TIMELINE
// ============================================================================

interface TimelineProps {
  onEventSelect?: (event: TimelineEvent) => void;
}

export const RegulatoryTimeline: React.FC<TimelineProps> = ({ onEventSelect }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(true);

  useEffect(() => {
    // Trigger sequential animation on mount
    const timer = setTimeout(() => setIsAnimating(false), TIMELINE_EVENTS.length * 150 + 500);
    return () => clearTimeout(timer);
  }, []);

  const handleEventClick = useCallback((event: TimelineEvent) => {
    setSelectedEvent(event);
    onEventSelect?.(event);
  }, [onEventSelect]);

  const closeModal = useCallback(() => {
    setSelectedEvent(null);
  }, []);

  return (
    <div className="regulatory-timeline" style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Clock size={28} />
          FDA Laser Regulation Timeline
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '32px' }}>
          Click on any milestone to explore the historical development of FDA laser regulations
        </p>
      </motion.div>

      <div style={{ position: 'relative' }}>
        {/* Timeline line */}
        <div style={{
          position: 'absolute',
          left: '50%',
          top: 0,
          bottom: 0,
          width: '4px',
          background: 'linear-gradient(to bottom, #3b82f6, #8b5cf6, #ec4899)',
          transform: 'translateX(-50%)',
          borderRadius: '2px'
        }} />

        {/* Timeline events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {TIMELINE_EVENTS.map((event, index) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ 
                delay: index * 0.15,
                duration: 0.5,
                ease: [0.25, 0.1, 0.25, 1]
              }}
              style={{
                display: 'flex',
                justifyContent: index % 2 === 0 ? 'flex-start' : 'flex-end',
                position: 'relative',
                paddingLeft: index % 2 === 0 ? '0' : '50%',
                paddingRight: index % 2 === 0 ? '50%' : '0'
              }}
            >
              {/* Event card */}
              <motion.div
                whileHover={{ 
                  scale: 1.03,
                  boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleEventClick(event)}
                onMouseEnter={() => setHoveredEvent(event.id)}
                onMouseLeave={() => setHoveredEvent(null)}
                style={{
                  background: hoveredEvent === event.id ? '#eff6ff' : '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  width: '90%',
                  cursor: 'pointer',
                  border: `2px solid ${hoveredEvent === event.id ? '#3b82f6' : '#e5e7eb'}`,
                  boxShadow: hoveredEvent === event.id 
                    ? '0 10px 30px rgba(59, 130, 246, 0.2)' 
                    : '0 4px 12px rgba(0,0,0,0.08)',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
              >
                {/* Year badge */}
                <div style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '24px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  color: 'white',
                  padding: '6px 16px',
                  borderRadius: '20px',
                  fontWeight: 700,
                  fontSize: '14px',
                  boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
                }}>
                  {event.year}
                </div>

                <div style={{ marginTop: '16px' }}>
                  <h3 style={{ 
                    margin: '0 0 8px 0', 
                    fontSize: '18px',
                    color: hoveredEvent === event.id ? '#1d4ed8' : '#1f2937'
                  }}>
                    {event.title}
                  </h3>
                  <p style={{ 
                    margin: '0 0 12px 0', 
                    fontSize: '14px', 
                    color: '#6b7280',
                    lineHeight: 1.5
                  }}>
                    {event.description}
                  </p>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '13px',
                    color: '#059669',
                    fontWeight: 500
                  }}>
                    <Info size={14} />
                    <span>{event.significance}</span>
                  </div>
                </div>

                {/* Click indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: hoveredEvent === event.id ? 1 : 0 }}
                  style={{
                    position: 'absolute',
                    bottom: '16px',
                    right: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    color: '#3b82f6',
                    fontSize: '13px',
                    fontWeight: 500
                  }}
                >
                  <span>View details</span>
                  <ChevronRight size={16} />
                </motion.div>
              </motion.div>

              {/* Center dot */}
              <div style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                width: '20px',
                height: '20px',
                background: hoveredEvent === event.id ? '#3b82f6' : '#ffffff',
                border: `4px solid ${hoveredEvent === event.id ? '#1d4ed8' : '#3b82f6'}`,
                borderRadius: '50%',
                zIndex: 10,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.3s ease'
              }} />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Event Detail Modal */}
      <AnimatePresence>
        {selectedEvent && (
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
              background: 'rgba(0, 0, 0, 0.6)',
              backdropFilter: 'blur(4px)',
              zIndex: 1000,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '24px'
            }}
            onClick={closeModal}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              style={{
                background: '#ffffff',
                borderRadius: '20px',
                padding: '32px',
                maxWidth: '600px',
                width: '100%',
                maxHeight: '80vh',
                overflow: 'auto',
                boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '24px'
              }}>
                <div>
                  <div style={{
                    display: 'inline-block',
                    background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                    color: 'white',
                    padding: '6px 16px',
                    borderRadius: '20px',
                    fontWeight: 700,
                    fontSize: '14px',
                    marginBottom: '12px'
                  }}>
                    {selectedEvent.year}
                  </div>
                  <h2 style={{ margin: 0, fontSize: '24px', color: '#1f2937' }}>
                    {selectedEvent.title}
                  </h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={closeModal}
                  style={{
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '50%',
                    width: '40px',
                    height: '40px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <X size={20} />
                </motion.button>
              </div>

              {/* Content */}
              <div style={{ marginBottom: '24px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#6b7280', fontSize: '14px' }}>
                  Description
                </h4>
                <p style={{ margin: 0, fontSize: '16px', lineHeight: 1.6, color: '#374151' }}>
                  {selectedEvent.description}
                </p>
              </div>

              <div style={{
                background: '#ecfdf5',
                borderRadius: '12px',
                padding: '16px',
                marginBottom: '24px'
              }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#059669', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} />
                  Historical Significance
                </h4>
                <p style={{ margin: 0, fontSize: '15px', color: '#065f46' }}>
                  {selectedEvent.significance}
                </p>
              </div>

              {selectedEvent.details && (
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#6b7280', fontSize: '14px' }}>
                    Key Details
                  </h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {selectedEvent.details.map((detail, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        style={{ marginBottom: '8px', color: '#374151' }}
                      >
                        {detail}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              )}

              {selectedEvent.cfrReference && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 16px',
                  background: '#eff6ff',
                  borderRadius: '8px',
                  fontSize: '14px',
                  color: '#1d4ed8'
                }}>
                  <BookOpen size={16} />
                  <span>CFR Reference: <strong>{selectedEvent.cfrReference}</strong></span>
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
// COMPONENT: FORM 3147 SIMULATOR
// ============================================================================

export const Form3147Simulator: React.FC = () => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    // Clear error when user starts typing
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, boolean> = {};
    let isValid = true;

    FORM_3147_FIELDS.forEach(field => {
      const value = formData[field.id] || '';
      if (field.required && !value.trim()) {
        newErrors[field.id] = true;
        isValid = false;
      }
      if (field.validation && value && !field.validation(value)) {
        newErrors[field.id] = true;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    setShowConfirmation(true);
  };

  const confirmSubmit = async () => {
    setShowConfirmation(false);
    setIsSubmitting(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsSubmitting(false);
    setSubmitStatus('success');

    // Reset after showing success
    setTimeout(() => {
      setSubmitStatus('idle');
      setFormData({});
    }, 3000);
  };

  const getFieldStatus = (field: Form3147Field): 'default' | 'focused' | 'error' | 'valid' => {
    if (errors[field.id]) return 'error';
    if (focusedField === field.id) return 'focused';
    if (formData[field.id] && field.required) return 'valid';
    return 'default';
  };

  const getFieldStyles = (status: string) => {
    const styles: Record<string, React.CSSProperties> = {
      default: {
        border: '2px solid #e5e7eb',
        background: '#ffffff',
        boxShadow: 'none'
      },
      focused: {
        border: '2px solid #3b82f6',
        background: '#ffffff',
        boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.15)'
      },
      error: {
        border: '2px solid #ef4444',
        background: '#fef2f2',
        boxShadow: '0 0 0 4px rgba(239, 68, 68, 0.15)'
      },
      valid: {
        border: '2px solid #10b981',
        background: '#ffffff',
        boxShadow: 'none'
      }
    };
    return styles[status] || styles.default;
  };

  return (
    <div style={{ padding: '24px' }}>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <FileText size={28} />
          FDA Form 3147 Simulator
        </h2>
        <p style={{ color: '#6b7280', marginBottom: '24px' }}>
          Practice completing a variance application form. All fields marked with * are required.
        </p>
      </motion.div>

      {submitStatus === 'success' ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{
            background: '#ecfdf5',
            borderRadius: '16px',
            padding: '48px',
            textAlign: 'center'
          }}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring', damping: 15 }}
          >
            <CheckCircle size={64} color="#10b981" style={{ marginBottom: '16px' }} />
          </motion.div>
          <h3 style={{ margin: '0 0 8px 0', color: '#065f46' }}>Form Submitted Successfully!</h3>
          <p style={{ margin: 0, color: '#059669' }}>
            In a real scenario, this would be sent to CDRH for review.
          </p>
        </motion.div>
      ) : (
        <motion.div
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
        >
          {/* Progress bar */}
          <div style={{ marginBottom: '32px' }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              marginBottom: '8px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <span>Form Progress</span>
              <span>{
                Math.round(
                  (Object.values(formData).filter(v => v.trim()).length / FORM_3147_FIELDS.filter(f => f.required).length) * 100
                ) || 0
              }%</span>
            </div>
            <div style={{
              height: '8px',
              background: '#e5e7eb',
              borderRadius: '4px',
              overflow: 'hidden'
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ 
                  width: `${Math.min(
                    (Object.values(formData).filter(v => v.trim()).length / FORM_3147_FIELDS.filter(f => f.required).length) * 100,
                    100
                  )}%` 
                }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                style={{
                  height: '100%',
                  background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
                  borderRadius: '4px'
                }}
              />
            </div>
          </div>

          {/* Form fields */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {FORM_3147_FIELDS.map((field, index) => {
              const status = getFieldStatus(field);
              const fieldStyles = getFieldStyles(status);

              return (
                <motion.div
                  key={field.id}
                  variants={fadeInUp}
                  style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}
                >
                  <label style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: status === 'error' ? '#dc2626' : '#374151',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}>
                    {field.label}
                    {field.required && <span style={{ color: '#dc2626' }}>*</span>}
                  </label>
                  
                  {field.type === 'select' ? (
                    <select
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        cursor: 'pointer',
                        minHeight: '48px',
                        ...fieldStyles,
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <option value="">Select {field.label.toLowerCase()}...</option>
                      {field.options?.map(opt => (
                        <option key={opt} value={opt}>{opt}</option>
                      ))}
                    </select>
                  ) : field.type === 'textarea' ? (
                    <textarea
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      rows={4}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        resize: 'vertical',
                        minHeight: '100px',
                        ...fieldStyles,
                        transition: 'all 0.2s ease',
                        fontFamily: 'inherit'
                      }}
                    />
                  ) : (
                    <input
                      type={field.type === 'number' ? 'number' : 'text'}
                      value={formData[field.id] || ''}
                      onChange={(e) => handleFieldChange(field.id, e.target.value)}
                      onFocus={() => setFocusedField(field.id)}
                      onBlur={() => setFocusedField(null)}
                      placeholder={field.placeholder}
                      style={{
                        padding: '14px 16px',
                        borderRadius: '10px',
                        fontSize: '15px',
                        outline: 'none',
                        minHeight: '48px',
                        ...fieldStyles,
                        transition: 'all 0.2s ease'
                      }}
                    />
                  )}

                  {field.helpText && (
                    <span style={{ fontSize: '13px', color: '#6b7280', marginTop: '2px' }}>
                      <Info size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {field.helpText}
                    </span>
                  )}

                  {status === 'error' && (
                    <motion.span
                      initial={{ opacity: 0, y: -5 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{ fontSize: '13px', color: '#dc2626', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <AlertTriangle size={12} />
                      This field is required
                    </motion.span>
                  )}
                </motion.div>
              );
            })}
          </div>

          {/* Submit button */}
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 8px 25px rgba(59, 130, 246, 0.35)' }}
            whileTap={{ scale: 0.98 }}
            onClick={handleSubmit}
            disabled={isSubmitting}
            style={{
              marginTop: '32px',
              width: '100%',
              padding: '16px',
              background: isSubmitting ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: isSubmitting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              minHeight: '56px'
            }}
          >
            {isSubmitting ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <FileText size={20} />
                Submit Variance Application
              </>
            )}
          </motion.button>
        </motion.div>
      )}

      {/* Confirmation Dialog */}
      <AnimatePresence>
        {showConfirmation && (
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
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              style={{
                background: '#ffffff',
                borderRadius: '16px',
                padding: '24px',
                maxWidth: '400px',
                width: '100%'
              }}
            >
              <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: '#fef3c7',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  <HelpCircle size={32} color="#f59e0b" />
                </div>
                <h3 style={{ margin: '0 0 8px 0' }}>Confirm Submission</h3>
                <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>
                  Are you sure you want to submit this variance application? 
                  In a real scenario, this would be sent to FDA/CDRH for review.
                </p>
              </div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowConfirmation(false)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#f3f4f6',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    minHeight: '48px'
                  }}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={confirmSubmit}
                  style={{
                    flex: 1,
                    padding: '12px',
                    background: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 500,
                    minHeight: '48px'
                  }}
                >
                  Confirm Submit
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPONENT: CDRH ORGANIZATIONAL CHART
// ============================================================================

interface OrgNode {
  id: string;
  label: string;
  fullName: string;
  role: string;
  laserResponsibility: string;
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };
  children?: OrgNode[];
}

const CDRH_ORG_DATA: OrgNode = {
  id: 'hhs',
  label: 'HHS',
  fullName: 'Department of Health and Human Services',
  role: 'Cabinet-level department',
  laserResponsibility: 'Oversees FDA as part of federal health agencies',
  children: [
    {
      id: 'fda',
      label: 'FDA',
      fullName: 'Food and Drug Administration',
      role: 'Federal regulatory agency',
      laserResponsibility: 'Implements Radiation Control Act; issues regulations under 21 CFR',
      children: [
        {
          id: 'cdrh',
          label: 'CDRH',
          fullName: 'Center for Devices and Radiological Health',
          role: 'FDA Center',
          laserResponsibility: 'Direct oversight of laser products; issues Laser Notices; reviews reports',
          contact: {
            address: '10903 New Hampshire Avenue, Silver Spring, MD 20993',
            phone: '1-800-638-2041',
            email: 'dsmica@fda.hhs.gov'
          },
          children: [
            {
              id: 'oht8',
              label: 'OHT8',
              fullName: 'Office of Health Technology 8',
              role: 'Office within CDRH',
              laserResponsibility: 'Office of Radiological Health - technical expertise on laser products'
            },
            {
              id: 'dsma',
              label: 'DSMA',
              fullName: 'Division of Small Manufacturer\'s Assistance',
              role: 'Assistance division',
              laserResponsibility: 'Provides guidance documents and assistance to manufacturers',
              contact: {
                phone: '1-800-638-2041'
              }
            }
          ]
        }
      ]
    }
  ]
};

export const CDRHOrganizationalChart: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<OrgNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['hhs', 'fda', 'cdrh']));

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  const renderNode = (node: OrgNode, level: number = 0) => {
    const isExpanded = expandedNodes.has(node.id);
    const hasChildren = node.children && node.children.length > 0;
    const isSelected = selectedNode?.id === node.id;

    return (
      <div key={node.id} style={{ marginLeft: level > 0 ? '32px' : 0 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: level * 0.1 }}
          whileHover={{ scale: 1.02, x: 5 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            setSelectedNode(node);
            if (hasChildren) toggleNode(node.id);
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '16px 20px',
            background: isSelected ? '#eff6ff' : '#ffffff',
            border: `2px solid ${isSelected ? '#3b82f6' : '#e5e7eb'}`,
            borderRadius: '12px',
            cursor: 'pointer',
            marginBottom: '12px',
            boxShadow: isSelected ? '0 4px 12px rgba(59, 130, 246, 0.2)' : '0 2px 8px rgba(0,0,0,0.05)',
            transition: 'all 0.2s ease',
            minHeight: '64px'
          }}
        >
          <div style={{
            width: '44px',
            height: '44px',
            minWidth: '44px',
            borderRadius: '10px',
            background: isSelected ? 'linear-gradient(135deg, #3b82f6, #8b5cf6)' : '#f3f4f6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: isSelected ? '#ffffff' : '#6b7280',
            fontWeight: 700,
            fontSize: '14px'
          }}>
            {node.label}
          </div>

          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 600, fontSize: '15px', color: '#1f2937' }}>
              {node.fullName}
            </div>
            <div style={{ fontSize: '13px', color: '#6b7280' }}>
              {node.role}
            </div>
          </div>

          {hasChildren && (
            <motion.div
              animate={{ rotate: isExpanded ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight size={20} color="#9ca3af" style={{ transform: 'rotate(90deg)' }} />
            </motion.div>
          )}
        </motion.div>

        <AnimatePresence>
          {hasChildren && isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {node.children!.map(child => renderNode(child, level + 1))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  };

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <Building size={28} />
        FDA/CDRH Organizational Structure
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Click on any organization to understand its role in laser product regulation
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        <div>
          {renderNode(CDRH_ORG_DATA)}
        </div>

        <div>
          <AnimatePresence mode="wait">
            {selectedNode ? (
              <motion.div
                key={selectedNode.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                style={{
                  background: '#ffffff',
                  borderRadius: '16px',
                  padding: '24px',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                  border: '2px solid #e5e7eb'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 700,
                  fontSize: '20px',
                  marginBottom: '16px'
                }}>
                  {selectedNode.label}
                </div>

                <h3 style={{ margin: '0 0 8px 0' }}>{selectedNode.fullName}</h3>
                <p style={{ margin: '0 0 16px 0', color: '#6b7280' }}>{selectedNode.role}</p>

                <div style={{
                  background: '#ecfdf5',
                  borderRadius: '12px',
                  padding: '16px',
                  marginBottom: '16px'
                }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '14px', color: '#059669', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={16} />
                    Laser Product Responsibility
                  </h4>
                  <p style={{ margin: 0, fontSize: '14px', color: '#065f46' }}>
                    {selectedNode.laserResponsibility}
                  </p>
                </div>

                {selectedNode.contact && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {selectedNode.contact.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        <Phone size={16} color="#6b7280" />
                        <span>{selectedNode.contact.phone}</span>
                      </div>
                    )}
                    {selectedNode.contact.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px' }}>
                        <Mail size={16} color="#6b7280" />
                        <span>{selectedNode.contact.email}</span>
                      </div>
                    )}
                    {selectedNode.contact.address && (
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', fontSize: '14px' }}>
                        <MapPin size={16} color="#6b7280" style={{ marginTop: '2px' }} />
                        <span>{selectedNode.contact.address}</span>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                style={{
                  background: '#f9fafb',
                  borderRadius: '16px',
                  padding: '48px',
                  textAlign: 'center',
                  border: '2px dashed #e5e7eb'
                }}
              >
                <Building size={48} color="#d1d5db" style={{ marginBottom: '16px' }} />
                <p style={{ margin: 0, color: '#6b7280' }}>
                  Click on an organization to view details
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: REPORTING DECISION WIZARD
// ============================================================================

const REPORTING_DECISION_TREE: Record<string, DecisionNode> = {
  start: {
    id: 'start',
    question: 'What type of laser product action are you taking?',
    options: [
      { label: 'Introducing a new laser product', nextNodeId: 'new_product' },
      { label: 'Modifying an existing reported product', nextNodeId: 'modification' },
      { label: 'Reporting an incident or defect', nextNodeId: 'incident' },
      { label: 'Applying for a variance', nextNodeId: 'variance' },
      { label: 'Annual compliance reporting', nextNodeId: 'annual' }
    ]
  },
  new_product: {
    id: 'new_product',
    question: 'Is this a completely new product or part of an existing model family?',
    options: [
      { 
        label: 'Completely new product design', 
        result: 'Submit FORM FDA 3632 - Complete Product Report (21 CFR 1002.10)',
        cfrReference: '21 CFR 1002.10',
        action: 'Submit BEFORE introduction into commerce'
      },
      { 
        label: 'New model in existing model family', 
        result: 'Submit FORM FDA 3632 - Supplemental Report referencing original accession number (21 CFR 1002.11)',
        cfrReference: '21 CFR 1002.11'
      },
      { 
        label: 'Low-power Class I product (inherently safe)', 
        result: 'May be exempt from Product Report per Laser Notice No. 41 - verify eligibility',
        action: 'Document exemption eligibility'
      }
    ]
  },
  modification: {
    id: 'modification',
    question: 'Does the modification affect any of the following?',
    options: [
      { 
        label: 'Actual or potential radiation emission', 
        result: 'FORM FDA 3632 - Supplemental Report REQUIRED (21 CFR 1002.11)',
        cfrReference: '21 CFR 1002.11'
      },
      { 
        label: 'Degree of compliance with performance standards', 
        result: 'FORM FDA 3632 - Supplemental Report REQUIRED (21 CFR 1002.11)',
        cfrReference: '21 CFR 1002.11'
      },
      { 
        label: 'Probability of detecting noncompliance', 
        result: 'FORM FDA 3632 - Supplemental Report REQUIRED (21 CFR 1002.11)',
        cfrReference: '21 CFR 1002.11'
      },
      { 
        label: 'Only cosmetic changes (color, etc.)', 
        result: 'No supplemental report required - document in next Annual Report',
        cfrReference: '21 CFR 1002.13'
      }
    ]
  },
  incident: {
    id: 'incident',
    question: 'What type of incident occurred?',
    options: [
      { 
        label: 'Accidental radiation occurrence (injury or potential)', 
        result: 'Immediate notification to CDRH required (21 CFR 1002.20)',
        cfrReference: '21 CFR 1002.20',
        action: 'Contact CDRH immediately'
      },
      { 
        label: 'Product defect affecting radiation safety', 
        result: 'FORM FDA 3633 - Notification of defect (21 CFR 1003.10)',
        cfrReference: '21 CFR 1003.10'
      },
      { 
        label: 'Product fails to comply with standard', 
        result: 'Immediate notification to CDRH required (21 CFR 1003.10)',
        cfrReference: '21 CFR 1003.10'
      },
      { 
        label: 'Medical device adverse event', 
        result: 'FDA Form 3500A (MEDWATCH) - Medical device reporting',
        cfrReference: '21 CFR 803'
      }
    ]
  },
  variance: {
    id: 'variance',
    question: 'What type of variance are you seeking?',
    options: [
      { 
        label: 'Laser light show demonstration (Class IIIb/IV)', 
        result: 'FORM FDA 3147 - Application for Variance + Laser Light Show Report',
        cfrReference: '21 CFR 1010.4, 1040.11(c)'
      },
      { 
        label: 'Medical laser product variance', 
        result: '21 CFR 1010.4 - Variance application with supporting documentation',
        cfrReference: '21 CFR 1010.4'
      },
      { 
        label: 'Alternate labeling or performance requirement', 
        result: '21 CFR 1010.4 - Variance application with justification',
        cfrReference: '21 CFR 1010.4'
      },
      { 
        label: 'Exemption from reporting/recordkeeping', 
        result: '21 CFR 1002.50 - Application with justification for small production or inherently safe products',
        cfrReference: '21 CFR 1002.50'
      }
    ]
  },
  annual: {
    id: 'annual',
    question: 'Annual Report Information',
    options: [
      { 
        label: 'View Annual Report Requirements', 
        result: 'Annual Report Form - Due September 1 for year ending June 30 (21 CFR 1002.13)',
        cfrReference: '21 CFR 1002.13',
        action: 'Submit every year by September 1'
      }
    ]
  }
};

export const ReportingDecisionWizard: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>('start');
  const [history, setHistory] = useState<string[]>([]);
  const [result, setResult] = useState<{
    result: string;
    cfrReference?: string;
    action?: string;
  } | null>(null);

  const currentNode = REPORTING_DECISION_TREE[currentNodeId];

  const handleOptionClick = (option: DecisionNode['options'][0]) => {
    if (option.result) {
      setResult({
        result: option.result,
        cfrReference: option.cfrReference,
        action: option.action
      });
    } else if (option.nextNodeId) {
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
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <HelpCircle size={28} />
        FDA Form Selection Wizard
      </h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Answer the questions to determine which FDA form to use for your situation
      </p>

      <AnimatePresence mode="wait">
        {!result ? (
          <motion.div
            key={currentNodeId}
            variants={slideIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '32px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
            }}
          >
            {/* Progress indicator */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px',
                marginBottom: '12px'
              }}>
                {history.map((_, i) => (
                  <React.Fragment key={i}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#10b981',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <CheckCircle size={14} color="white" />
                    </div>
                    <div style={{ width: '20px', height: '2px', background: '#10b981' }} />
                  </React.Fragment>
                ))}
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#3b82f6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontWeight: 600,
                  fontSize: '14px'
                }}>
                  {history.length + 1}
                </div>
              </div>
              <span style={{ fontSize: '13px', color: '#6b7280' }}>
                Step {history.length + 1} of the decision process
              </span>
            </div>

            <h3 style={{ marginBottom: '20px', fontSize: '20px' }}>{currentNode.question}</h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {currentNode.options.map((option, index) => (
                <motion.button
                  key={index}
                  onClick={() => handleOptionClick(option)}
                  whileHover={{ 
                    scale: 1.02, 
                    backgroundColor: '#eff6ff',
                    borderColor: '#3b82f6'
                  }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    padding: '18px 24px',
                    textAlign: 'left',
                    background: '#f9fafb',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    minHeight: '56px'
                  }}
                >
                  <span>{option.label}</span>
                  <ChevronRight size={20} color="#9ca3af" />
                </motion.button>
              ))}
            </div>

            {history.length > 0 && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={handleBack}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                style={{
                  marginTop: '20px',
                  padding: '12px 20px',
                  background: 'transparent',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  minHeight: '44px'
                }}
              >
                <ChevronLeft size={18} />
                Back
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="result"
            variants={scaleIn}
            initial="initial"
            animate="animate"
            exit="exit"
            style={{
              background: '#ecfdf5',
              borderRadius: '16px',
              padding: '32px',
              border: '2px solid #10b981'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#10b981',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <CheckCircle size={24} color="white" />
              </div>
              <h3 style={{ margin: 0, color: '#065f46' }}>Recommendation</h3>
            </div>
            
            <p style={{ fontSize: '18px', color: '#065f46', marginBottom: '16px', fontWeight: 500 }}>
              {result.result}
            </p>

            {result.action && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{
                  padding: '16px',
                  background: '#ffffff',
                  borderRadius: '8px',
                  marginBottom: '16px',
                  borderLeft: '4px solid #f59e0b'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                  <AlertTriangle size={16} color="#f59e0b" />
                  <span style={{ fontWeight: 600, color: '#92400e' }}>Action Required</span>
                </div>
                <p style={{ margin: 0, color: '#78350f' }}>{result.action}</p>
              </motion.div>
            )}
            
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
                <BookOpen size={18} color="#6b7280" />
                <span style={{ fontSize: '14px', color: '#374151' }}>
                  CFR Reference: <strong>{result.cfrReference}</strong>
                </span>
              </div>
            )}

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleReset}
              style={{
                padding: '14px 24px',
                background: '#10b981',
                color: '#ffffff',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '15px',
                fontWeight: 600,
                minHeight: '48px'
              }}
            >
              <RefreshCw size={18} />
              Start Over
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// EXPORT ALL COMPONENTS
// ============================================================================

export default {
  RegulatoryTimeline,
  Form3147Simulator,
  CDRHOrganizationalChart,
  ReportingDecisionWizard
};
