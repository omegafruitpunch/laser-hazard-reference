/**
 * Module 2.5: Variance Applications
 * Course 2: FDA Compliance - Part 2
 * 
 * Interactive educational module covering FDA variance application procedures
 * Includes: Variance Application Simulator, Form 3147 walkthrough, decision tools
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, 
  ClipboardCheck, 
  AlertCircle, 
  CheckCircle, 
  ChevronRight, 
  ChevronLeft,
  Info,
  Upload,
  RefreshCw,
  ArrowRight,
  Scale,
  Shield,
  X,
  Clock,
  Building,
  User,
  Mail,
  Phone
} from 'lucide-react';

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

interface VarianceType {
  id: string;
  name: string;
  cfrReference: string;
  applicableTo: string[];
  description: string;
  commonExamples: string[];
  requirements: string[];
}

interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'checkbox' | 'date' | 'number';
  required: boolean;
  placeholder?: string;
  options?: string[];
  helpText?: string;
  cfrReference?: string;
}

interface SimulatorStep {
  id: string;
  title: string;
  description: string;
  content: React.ReactNode;
}

// ============================================================================
// DATA: VARIANCE TYPES
// ============================================================================

const VARIANCE_TYPES: VarianceType[] = [
  {
    id: 'alternate_labeling',
    name: 'Alternate Labeling Variance',
    cfrReference: '21 CFR 1010.4, 1010.2, 1010.3',
    applicableTo: ['All laser classes where standard labeling is inappropriate'],
    description: 'Request for approval of alternative labeling when standard requirements are inappropriate for the product.',
    commonExamples: [
      'Medical devices with size constraints',
      'Products with integrated displays',
      'Miniature laser products',
      'Products with alternative safety information presentation'
    ],
    requirements: [
      'Justification for alternate labeling',
      'Description of proposed alternative',
      'Demonstration of equivalent safety information',
      'Sample labels or labeling'
    ]
  },
  {
    id: 'demonstration_laser',
    name: 'Demonstration Laser Product Variance',
    cfrReference: '21 CFR 1010.4, 1040.11(c)',
    applicableTo: ['Demonstration laser products exceeding Class IIIa'],
    description: 'Required for demonstration laser products (laser light shows, displays, devices) that exceed Class IIIa limits.',
    commonExamples: [
      'Laser light shows',
      'Entertainment laser displays',
      'Art installations with lasers',
      'Trade show demonstrations'
    ],
    requirements: [
      'Form FDA 3147 submission',
      'Laser Light Show Report (if Class IIIb or IV)',
      'Safety procedures documentation',
      'Operator training certification',
      'Audience protection measures'
    ]
  },
  {
    id: 'surveying_alignment',
    name: 'Surveying/Leveling/Alignment Variance',
    cfrReference: '21 CFR 1010.4, 1040.11(b)',
    applicableTo: ['Surveying, leveling, alignment products exceeding Class IIIa'],
    description: 'Variance required for surveying, leveling, or alignment laser products exceeding Class IIIa.',
    commonExamples: [
      'Construction laser levels',
      'Surveying equipment',
      'Agricultural alignment lasers',
      'Industrial positioning systems'
    ],
    requirements: [
      'Product classification documentation',
      'Safety assessment',
      'Justification for higher classification',
      'Alternative safety measures'
    ]
  },
  {
    id: 'alternate_performance',
    name: 'Alternate Performance Requirement',
    cfrReference: '21 CFR 1010.4, 1040.10(f)',
    applicableTo: ['Products where standard performance requirements are inappropriate'],
    description: 'Request for alternative performance requirements when standard requirements cannot be met.',
    commonExamples: [
      'Specialized medical applications',
      'Research equipment',
      'Custom industrial systems',
      'Products with novel safety approaches'
    ],
    requirements: [
      'Technical justification',
      'Safety equivalency demonstration',
      'Test data supporting alternative',
      'Risk assessment'
    ]
  }
];

// ============================================================================
// DATA: FORM 3147 SIMULATOR
// ============================================================================

const FORM_3147_SECTIONS: FormSection[] = [
  {
    id: 'section1',
    title: 'Section 1: Applicant Information',
    description: 'Basic information about the variance applicant',
    fields: [
      {
        id: 'manufacturer_name',
        label: 'Manufacturer Name',
        type: 'text',
        required: true,
        placeholder: 'Company name',
        cfrReference: '21 CFR 1010.4(a)(1)'
      },
      {
        id: 'address',
        label: 'Business Address',
        type: 'textarea',
        required: true,
        placeholder: 'Street, City, State, ZIP'
      },
      {
        id: 'contact_person',
        label: 'Contact Person',
        type: 'text',
        required: true,
        placeholder: 'Full name'
      },
      {
        id: 'phone',
        label: 'Telephone Number',
        type: 'text',
        required: true,
        placeholder: '(555) 123-4567'
      },
      {
        id: 'email',
        label: 'Email Address',
        type: 'text',
        required: true,
        placeholder: 'contact@company.com'
      }
    ]
  },
  {
    id: 'section2',
    title: 'Section 2: Product Information',
    description: 'Details about the laser product requiring variance',
    fields: [
      {
        id: 'product_name',
        label: 'Product/Model Name',
        type: 'text',
        required: true,
        placeholder: 'Model XYZ-123'
      },
      {
        id: 'laser_class',
        label: 'Laser Classification',
        type: 'select',
        required: true,
        options: ['Class I', 'Class II', 'Class IIIa', 'Class IIIb', 'Class IV'],
        cfrReference: '21 CFR 1040.10(c)'
      },
      {
        id: 'wavelength',
        label: 'Wavelength(s) (nm)',
        type: 'text',
        required: true,
        placeholder: 'e.g., 532 or 800-900'
      },
      {
        id: 'power',
        label: 'Maximum Power/Energy Output',
        type: 'text',
        required: true,
        placeholder: 'e.g., 5W CW or 100mJ pulsed'
      },
      {
        id: 'variance_type',
        label: 'Type of Variance Requested',
        type: 'select',
        required: true,
        options: [
          'Demonstration Laser (1040.11(c))',
          'Surveying/Leveling/Alignment (1040.11(b))',
          'Alternate Labeling (1010.2/1010.3)',
          'Alternate Performance (1040.10)'
        ]
      }
    ]
  },
  {
    id: 'section3',
    title: 'Section 3: Justification',
    description: 'Technical justification for the variance request',
    fields: [
      {
        id: 'regulatory_provision',
        label: 'Regulatory Provision from Which Variance is Requested',
        type: 'textarea',
        required: true,
        placeholder: 'e.g., 21 CFR 1040.11(c) - accessible emission limits for demonstration lasers',
        helpText: 'Specify the exact CFR section and requirement',
        cfrReference: '21 CFR 1010.4(a)(2)'
      },
      {
        id: 'justification',
        label: 'Detailed Justification',
        type: 'textarea',
        required: true,
        placeholder: 'Explain why compliance is not feasible and how the variance will not result in a hazardous product...',
        helpText: 'Include technical data, test results, and safety analysis',
        cfrReference: '21 CFR 1010.4(a)(3)'
      },
      {
        id: 'alternative_measures',
        label: 'Alternative Safety Measures',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the alternative measures that will provide equivalent safety...',
        helpText: 'Explain how your alternative approach maintains safety',
        cfrReference: '21 CFR 1010.4(a)(4)'
      },
      {
        id: 'duration',
        label: 'Proposed Duration of Variance',
        type: 'select',
        required: true,
        options: ['Permanent', 'Temporary (specify period)', 'Until product redesign']
      }
    ]
  },
  {
    id: 'section4',
    title: 'Section 4: Additional Requirements (Demonstration Lasers)',
    description: 'Specific requirements for demonstration laser variance requests',
    fields: [
      {
        id: 'show_description',
        label: 'Description of Laser Light Show or Display',
        type: 'textarea',
        required: false,
        placeholder: 'Provide detailed description of the intended use...',
        helpText: 'Required for demonstration laser variance requests'
      },
      {
        id: 'safety_procedures',
        label: 'Safety Procedures and Controls',
        type: 'textarea',
        required: false,
        placeholder: 'Describe all safety procedures, operator training, and protective measures...',
        helpText: 'Include audience scanning calculations if applicable'
      },
      {
        id: 'operator_qualifications',
        label: 'Operator Qualifications and Training',
        type: 'textarea',
        required: false,
        placeholder: 'Describe operator training and certification requirements...'
      },
      {
        id: 'mpe_calculations',
        label: 'MPE and Exposure Calculations',
        type: 'textarea',
        required: false,
        placeholder: 'Provide calculations showing compliance with MPE limits for accessible beams...',
        helpText: 'Critical for demonstration lasers with accessible beams'
      }
    ]
  },
  {
    id: 'section5',
    title: 'Section 5: Supporting Documentation',
    description: 'Required attachments and supporting materials',
    fields: [
      {
        id: 'product_report',
        label: 'Product Report Submitted or Attached',
        type: 'checkbox',
        required: true,
        helpText: 'Product Report must be submitted concurrently'
      },
      {
        id: 'test_data',
        label: 'Test Data and Technical Reports',
        type: 'checkbox',
        required: false,
        helpText: 'Include all supporting test data'
      },
      {
        id: 'labeling_samples',
        label: 'Sample Labeling/Instructions',
        type: 'checkbox',
        required: true
      },
      {
        id: 'other_docs',
        label: 'Other Supporting Documentation',
        type: 'textarea',
        required: false,
        placeholder: 'List any additional documentation being submitted...'
      }
    ]
  }
];

// ============================================================================
// COMPONENT: VARIANCE TYPE SELECTOR
// ============================================================================

const VarianceTypeSelector: React.FC = () => {
  const [selectedVariance, setSelectedVariance] = useState<string | null>(null);

  const variance = VARIANCE_TYPES.find(v => v.id === selectedVariance);

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px' }}>Types of Variances</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Select a variance type to learn about its requirements and applicability.
      </p>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '16px',
        marginBottom: '24px'
      }}>
        {VARIANCE_TYPES.map((type) => (
          <motion.div
            key={type.id}
            onClick={() => setSelectedVariance(type.id)}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '20px',
              background: selectedVariance === type.id ? '#eff6ff' : '#ffffff',
              border: `2px solid ${selectedVariance === type.id ? '#3b82f6' : '#e5e7eb'}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
          >
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: selectedVariance === type.id ? '#3b82f6' : '#f3f4f6',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '12px'
            }}>
              <Scale size={24} color={selectedVariance === type.id ? '#ffffff' : '#6b7280'} />
            </div>
            <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>{type.name}</h3>
            <span style={{ fontSize: '13px', color: '#6b7280' }}>{type.cfrReference}</span>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {variance && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            style={{
              background: '#f9fafb',
              borderRadius: '12px',
              padding: '24px'
            }}
          >
            <h3 style={{ marginBottom: '12px' }}>{variance.name}</h3>
            <p style={{ marginBottom: '20px', color: '#374151' }}>{variance.description}</p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
              <div>
                <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  Applicable To
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {variance.applicableTo.map((item, index) => (
                    <li key={index} style={{ marginBottom: '4px', fontSize: '14px' }}>{item}</li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                  Common Examples
                </h4>
                <ul style={{ margin: 0, paddingLeft: '20px' }}>
                  {variance.commonExamples.map((item, index) => (
                    <li key={index} style={{ marginBottom: '4px', fontSize: '14px' }}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div style={{ marginTop: '24px' }}>
              <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '12px' }}>
                Requirements
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {variance.requirements.map((req, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '12px 16px',
                      background: '#ffffff',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                  >
                    <CheckCircle size={18} color="#10b981" />
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ============================================================================
// COMPONENT: FORM 3147 SIMULATOR
// ============================================================================

const Form3147Simulator: React.FC = () => {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showSummary, setShowSummary] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData({ ...formData, [fieldId]: value });
    // Clear error when field is modified
    if (errors[fieldId]) {
      setErrors({ ...errors, [fieldId]: '' });
    }
  };

  const validateSection = (): boolean => {
    const section = FORM_3147_SECTIONS[currentSection];
    const newErrors: Record<string, string> = {};
    let isValid = true;

    section.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = `${field.label} is required`;
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateSection()) {
      if (currentSection < FORM_3147_SECTIONS.length - 1) {
        setCurrentSection(currentSection + 1);
      } else {
        setShowSummary(true);
      }
    }
  };

  const handleNext = () => {
    if (currentSection < FORM_3147_SECTIONS.length - 1) {
      setCurrentSection(currentSection + 1);
    } else {
      setShowSummary(true);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleReset = () => {
    setCurrentSection(0);
    setFormData({});
    setShowSummary(false);
  };

  const section = FORM_3147_SECTIONS[currentSection];
  const progress = ((currentSection + 1) / FORM_3147_SECTIONS.length) * 100;

  if (showSummary) {
    return (
      <div style={{ padding: '24px' }}>
        <div style={{
          background: '#ecfdf5',
          borderRadius: '12px',
          padding: '32px',
          textAlign: 'center'
        }}>
          <CheckCircle size={48} color="#10b981" style={{ marginBottom: '16px' }} />
          <h2 style={{ marginBottom: '8px' }}>Form Review Complete</h2>
          <p style={{ color: '#6b7280', marginBottom: '24px' }}>
            You have completed the Form 3147 walkthrough. In a real submission, 
            you would now submit this form to CDRH along with supporting documentation.
          </p>

          <div style={{ 
            background: '#ffffff',
            borderRadius: '8px',
            padding: '20px',
            textAlign: 'left',
            marginBottom: '24px'
          }}>
            <h3 style={{ marginBottom: '16px' }}>Submission Summary</h3>
            <div style={{ display: 'grid', gap: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Manufacturer:</span>
                <span style={{ fontWeight: 500 }}>{formData.manufacturer_name || 'Not provided'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Product:</span>
                <span style={{ fontWeight: 500 }}>{formData.product_name || 'Not provided'}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#6b7280' }}>Variance Type:</span>
                <span style={{ fontWeight: 500 }}>{formData.variance_type || 'Not provided'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleReset}
            style={{
              padding: '12px 24px',
              background: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            <RefreshCw size={18} />
            Start Over
          </button>
        </div>

        <div style={{ 
          marginTop: '24px',
          padding: '16px',
          background: '#eff6ff',
          borderRadius: '8px'
        }}>
          <h4 style={{ margin: '0 0 8px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Info size={18} />
            Where to Submit
          </h4>
          <p style={{ margin: 0, fontSize: '14px' }}>
            Center for Devices and Radiological Health<br />
            Document Mail Center - WO66-G609<br />
            Attn: Variance Applications<br />
            10903 New Hampshire Avenue<br />
            Silver Spring, MD 20993-0002
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Form FDA 3147 Simulator"
    >
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ marginBottom: '8px' }}>Form FDA 3147 Simulator</h2>
        <p style={{ color: '#6b7280' }} id="form3147-desc">
          Application for Variance from 21 CFR 1040.11(c) for Laser Light Shows
        </p>
      </div>

      {/* Progress Bar */}
      <div 
        style={{ marginBottom: '24px' }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Form completion: ${Math.round(progress)} percent`}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '14px'
        }}>
          <span>Step {currentSection + 1} of {FORM_3147_SECTIONS.length}</span>
          <span>{Math.round(progress)}% Complete</span>
        </div>
        <div style={{ 
          height: '8px', 
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: '#3b82f6',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      {/* Section Header */}
      <fieldset style={{ 
        border: 'none',
        margin: 0,
        padding: 0
      }}>
        <legend style={{ 
          background: '#eff6ff',
          padding: '16px 20px',
          borderRadius: '8px 8px 0 0',
          borderBottom: '2px solid #3b82f6',
          width: '100%',
          boxSizing: 'border-box',
          display: 'block'
        }}>
          <h3 style={{ margin: '0 0 4px 0' }}>{section.title}</h3>
          <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
            {section.description}
          </p>
        </legend>

        {/* Form Fields */}
        <div style={{ 
          background: '#ffffff',
          padding: '24px',
          borderRadius: '0 0 8px 8px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {section.fields.map((field) => (
              <div key={field.id}>
                <label 
                  htmlFor={field.id}
                  style={{ 
                    display: 'block', 
                    marginBottom: '6px',
                    fontWeight: 500,
                    fontSize: '14px'
                  }}
                >
                  {field.label}
                  {field.required && <span style={{ color: '#dc2626' }} aria-label="required"> *</span>}
                </label>

                {field.type === 'text' && (
                  <input
                    id={field.id}
                    type="text"
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    aria-required={field.required}
                    aria-invalid={!!errors[field.id]}
                    aria-describedby={errors[field.id] ? `error-${field.id}` : field.helpText ? `help-${field.id}` : undefined}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `2px solid ${errors[field.id] ? '#dc2626' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  />
                )}

                {field.type === 'textarea' && (
                  <textarea
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    placeholder={field.placeholder}
                    rows={4}
                    aria-required={field.required}
                    aria-invalid={!!errors[field.id]}
                    aria-describedby={errors[field.id] ? `error-${field.id}` : field.helpText ? `help-${field.id}` : undefined}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `2px solid ${errors[field.id] ? '#dc2626' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      resize: 'vertical'
                    }}
                  />
                )}

                {field.type === 'select' && (
                  <select
                    id={field.id}
                    value={formData[field.id] || ''}
                    onChange={(e) => handleFieldChange(field.id, e.target.value)}
                    aria-required={field.required}
                    aria-invalid={!!errors[field.id]}
                    aria-describedby={errors[field.id] ? `error-${field.id}` : field.helpText ? `help-${field.id}` : undefined}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      border: `2px solid ${errors[field.id] ? '#dc2626' : '#e5e7eb'}`,
                      borderRadius: '6px',
                      fontSize: '14px',
                      background: '#ffffff'
                    }}
                  >
                    <option value="">Select...</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                )}

                {field.type === 'checkbox' && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                    <input
                      id={field.id}
                      type="checkbox"
                      checked={formData[field.id] || false}
                      onChange={(e) => handleFieldChange(field.id, e.target.checked)}
                      style={{ width: '18px', height: '18px' }}
                      aria-required={field.required}
                      aria-invalid={!!errors[field.id]}
                    />
                    <span>Yes, this documentation is included</span>
                  </label>
                )}

                {errors[field.id] && (
                  <p 
                    id={`error-${field.id}`}
                    style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#dc2626' }}
                    role="alert"
                  >
                    {errors[field.id]}
                  </p>
                )}

                {field.helpText && !errors[field.id] && (
                  <p 
                    id={`help-${field.id}`}
                    style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#6b7280' }}
                  >
                    <Info size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
                    {field.helpText}
                  </p>
                )}

                {field.cfrReference && (
                  <p style={{ margin: '4px 0 0 0', fontSize: '12px', color: '#3b82f6' }}>
                    CFR: {field.cfrReference}
                  </p>
                )}
              </div>
            ))}
          </div>

          {/* Navigation */}
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginTop: '32px',
            paddingTop: '20px',
            borderTop: '1px solid #e5e7eb'
          }}>
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              style={{
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
                opacity: currentSection === 0 ? 0.5 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              aria-label="Go to previous section"
            >
              <ChevronLeft size={18} aria-hidden="true" />
              Previous
            </button>

            <button
              onClick={handleNext}
              style={{
                padding: '10px 24px',
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontWeight: 500
              }}
              aria-label={currentSection === FORM_3147_SECTIONS.length - 1 ? 'Review form' : 'Go to next section'}
            >
              {currentSection === FORM_3147_SECTIONS.length - 1 ? 'Review' : 'Next'}
              <ChevronRight size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      </fieldset>

      {/* Tips Box */}
      <div 
        style={{ 
          marginTop: '20px',
          padding: '16px',
          background: '#fef3c7',
          borderRadius: '8px',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '12px'
        }}
        role="complementary"
        aria-label="Filing tips"
      >
        <AlertCircle size={20} color="#f59e0b" style={{ flexShrink: 0 }} aria-hidden="true" />
        <div>
          <h4 style={{ margin: '0 0 4px 0', fontSize: '14px' }}>Filing Tips</h4>
          <ul style={{ margin: 0, paddingLeft: '16px', fontSize: '13px', color: '#92400e' }}>
            <li>Submit variance application BEFORE introducing product into commerce</li>
            <li>Include comprehensive technical justification with test data</li>
            <li>Demonstrate that alternative measures provide equivalent safety</li>
            <li>Allow 90-120 days for FDA review and response</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: VARIANCE DECISION FLOWCHART
// ============================================================================

const VarianceDecisionFlow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      question: 'Does your product comply with ALL applicable requirements in 21 CFR 1040.10 and 1040.11?',
      yesNext: 'end_compliant',
      noNext: 1
    },
    {
      question: 'Is the non-compliance related to labeling requirements (1010.2 or 1010.3)?',
      yesNext: 'alternate_labeling',
      noNext: 2
    },
    {
      question: 'Is this a demonstration laser product (laser light show/display)?',
      yesNext: 'demonstration_laser',
      noNext: 3
    },
    {
      question: 'Is this a surveying, leveling, or alignment laser product?',
      yesNext: 'surveying_alignment',
      noNext: 4
    },
    {
      question: 'Are there technical reasons why performance requirements cannot be met?',
      yesNext: 'alternate_performance',
      noNext: 'end_must_comply'
    }
  ];

  const outcomes: Record<string, { title: string; description: string; action: string; color: string }> = {
    end_compliant: {
      title: 'No Variance Needed',
      description: 'Your product complies with all requirements. Submit standard Product Report.',
      action: 'Proceed with Product Report submission (21 CFR 1002.10)',
      color: '#10b981'
    },
    alternate_labeling: {
      title: 'Alternate Labeling Variance',
      description: 'Apply for variance from 1010.2 or 1010.3 for alternate labeling.',
      action: 'Submit variance application with justification and sample labeling',
      color: '#f59e0b'
    },
    demonstration_laser: {
      title: 'Demonstration Laser Variance',
      description: 'Required for demonstration lasers exceeding Class IIIa.',
      action: 'Submit Form FDA 3147 + Laser Light Show Report if Class IIIb/IV',
      color: '#f59e0b'
    },
    surveying_alignment: {
      title: 'Surveying/Alignment Variance',
      description: 'Required for surveying/alignment products exceeding Class IIIa.',
      action: 'Submit variance application per 21 CFR 1040.11(b) and 1010.4',
      color: '#f59e0b'
    },
    alternate_performance: {
      title: 'Alternate Performance Variance',
      description: 'Request for alternative performance requirements.',
      action: 'Submit variance with technical justification and safety equivalency demonstration',
      color: '#f59e0b'
    },
    end_must_comply: {
      title: 'Must Achieve Compliance',
      description: 'Without valid justification, product must comply with all requirements.',
      action: 'Redesign product to meet requirements or provide additional justification',
      color: '#ef4444'
    }
  };

  const handleAnswer = (answer: 'yes' | 'no') => {
    const step = steps[currentStep];
    const next = answer === 'yes' ? step.yesNext : step.noNext;
    
    if (typeof next === 'string') {
      setCurrentStep(-1); // End state with outcome
      // Store outcome
    } else {
      setCurrentStep(next);
    }
  };

  const currentStepData = steps[currentStep];
  const outcomeKey = currentStep === -1 ? 
    (() => {
      // Determine outcome from history - simplified for this demo
      return 'end_compliant';
    })() : null;
  const outcome = outcomeKey ? outcomes[outcomeKey] : null;

  return (
    <div style={{ padding: '24px' }}>
      <h2 style={{ marginBottom: '8px' }}>Variance Decision Flow</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }}>
        Answer the questions to determine if a variance is required for your product.
      </p>

      <div style={{ 
        maxWidth: '600px',
        margin: '0 auto'
      }}>
        {currentStep >= 0 ? (
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center'
            }}
          >
            <div style={{ 
              width: '60px', 
              height: '60px', 
              background: '#eff6ff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <span style={{ fontSize: '24px', fontWeight: 700, color: '#3b82f6' }}>
                {currentStep + 1}
              </span>
            </div>

            <h3 style={{ marginBottom: '24px', fontSize: '18px' }}>
              {currentStepData.question}
            </h3>

            <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
              <button
                onClick={() => handleAnswer('yes')}
                style={{
                  padding: '14px 32px',
                  background: '#10b981',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                Yes
              </button>
              <button
                onClick={() => handleAnswer('no')}
                style={{
                  padding: '14px 32px',
                  background: '#ef4444',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '16px',
                  fontWeight: 500
                }}
              >
                No
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '32px',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              textAlign: 'center',
              border: `3px solid ${outcome?.color || '#3b82f6'}`
            }}
          >
            <div style={{ 
              width: '80px', 
              height: '80px', 
              background: outcome?.color || '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              {outcome?.color === '#10b981' ? (
                <CheckCircle size={40} color="#ffffff" />
              ) : outcome?.color === '#ef4444' ? (
                <X size={40} color="#ffffff" />
              ) : (
                <Scale size={40} color="#ffffff" />
              )}
            </div>

            <h3 style={{ marginBottom: '12px' }}>{outcome?.title}</h3>
            <p style={{ color: '#6b7280', marginBottom: '20px' }}>
              {outcome?.description}
            </p>

            <div style={{ 
              padding: '16px',
              background: '#f9fafb',
              borderRadius: '8px',
              marginBottom: '20px',
              textAlign: 'left'
            }}>
              <strong>Required Action:</strong>
              <p style={{ margin: '8px 0 0 0' }}>{outcome?.action}</p>
            </div>

            <button
              onClick={() => setCurrentStep(0)}
              style={{
                padding: '12px 24px',
                background: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Start Over
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

// ============================================================================
// COMPONENT: VARIANCE REQUIREMENTS CHECKLIST
// ============================================================================

const VarianceRequirementsChecklist: React.FC = () => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const requirements = [
    {
      category: 'Application Form',
      items: [
        { id: 'app1', text: 'Completed Form FDA 3147', cfr: '21 CFR 1010.4' },
        { id: 'app2', text: 'Applicant contact information', cfr: '21 CFR 1010.4(a)(1)' },
        { id: 'app3', text: 'Specific regulatory provision identified', cfr: '21 CFR 1010.4(a)(2)' }
      ]
    },
    {
      category: 'Technical Justification',
      items: [
        { id: 'tech1', text: 'Detailed justification for variance', cfr: '21 CFR 1010.4(a)(3)' },
        { id: 'tech2', text: 'Explanation of why compliance is not feasible', cfr: '21 CFR 1010.4(a)(3)' },
        { id: 'tech3', text: 'Technical data supporting request', cfr: '21 CFR 1010.4(a)(3)' },
        { id: 'tech4', text: 'Test results and measurements', cfr: '21 CFR 1010.4(a)(3)' }
      ]
    },
    {
      category: 'Alternative Safety Measures',
      items: [
        { id: 'alt1', text: 'Description of alternative measures', cfr: '21 CFR 1010.4(a)(4)' },
        { id: 'alt2', text: 'Demonstration of equivalent safety', cfr: '21 CFR 1010.4(a)(4)' },
        { id: 'alt3', text: 'Risk assessment documentation', cfr: '21 CFR 1010.4(a)(4)' }
      ]
    },
    {
      category: 'Product Information',
      items: [
        { id: 'prod1', text: 'Product Report submitted or attached', cfr: '21 CFR 1002.10' },
        { id: 'prod2', text: 'Product specifications and classification', cfr: '21 CFR 1040.10' },
        { id: 'prod3', text: 'Sample labeling and instructions', cfr: '21 CFR 1040.10(g), (h)' }
      ]
    },
    {
      category: 'Demonstration Laser Specific (if applicable)',
      items: [
        { id: 'demo1', text: 'Laser Light Show Report', cfr: 'Laser Notice No. 50' },
        { id: 'demo2', text: 'Safety procedures documentation', cfr: '21 CFR 1040.11(c)' },
        { id: 'demo3', text: 'Operator training requirements', cfr: '21 CFR 1040.11(c)' },
        { id: 'demo4', text: 'MPE calculations for accessible beams', cfr: '21 CFR 1040.11(c)' }
      ]
    }
  ];

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const totalItems = requirements.reduce((acc, cat) => acc + cat.items.length, 0);
  const progress = (checkedItems.size / totalItems) * 100;

  return (
    <div 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Variance Application Checklist"
    >
      <h2 style={{ marginBottom: '8px' }}>Variance Application Checklist</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="checklist-desc">
        Use this checklist to ensure your variance application is complete.
      </p>

      <div 
        style={{ marginBottom: '24px' }}
        role="progressbar"
        aria-valuenow={Math.round(progress)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Checklist completion: ${Math.round(progress)} percent`}
      >
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          marginBottom: '8px',
          fontSize: '14px'
        }}>
          <span>Completion Progress</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div style={{ 
          height: '8px', 
          background: '#e5e7eb',
          borderRadius: '4px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: `${progress}%`,
            height: '100%',
            background: progress === 100 ? '#10b981' : '#3b82f6',
            borderRadius: '4px',
            transition: 'width 0.3s ease'
          }} />
        </div>
      </div>

      <form style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
        {requirements.map((category) => (
          <fieldset 
            key={category.category}
            style={{
              background: '#ffffff',
              borderRadius: '12px',
              padding: '20px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: 'none',
              margin: 0
            }}
          >
            <legend style={{ 
              margin: '0 0 16px 0', 
              fontSize: '16px', 
              color: '#374151',
              fontWeight: 600,
              padding: 0
            }}>
              {category.category}
            </legend>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {category.items.map((item) => (
                <label
                  key={item.id}
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    padding: '12px',
                    background: checkedItems.has(item.id) ? '#ecfdf5' : '#f9fafb',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={checkedItems.has(item.id)}
                    onChange={() => toggleItem(item.id)}
                    style={{ width: '18px', height: '18px', marginTop: '2px' }}
                    aria-checked={checkedItems.has(item.id)}
                  />
                  <div style={{ flex: 1 }}>
                    <span style={{ 
                      fontSize: '14px',
                      textDecoration: checkedItems.has(item.id) ? 'line-through' : 'none'
                    }}>
                      {item.text}
                    </span>
                    <span style={{ 
                      display: 'block',
                      fontSize: '12px', 
                      color: '#6b7280',
                      marginTop: '4px'
                    }}>
                      {item.cfr}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </fieldset>
        ))}
      </form>
    </div>
  );
};

// ============================================================================
// COMPONENT: TIMELINE AND PROCESS
// ============================================================================

const VarianceProcessTimeline: React.FC = () => {
  const steps = [
    {
      title: 'Prepare Application',
      duration: 'Variable',
      description: 'Gather all required documentation including technical justification, test data, and Product Report.',
      tips: ['Allow sufficient time for comprehensive documentation', 'Include all supporting test data']
    },
    {
      title: 'Submit to CDRH',
      duration: 'Day 0',
      description: 'Submit completed variance application to the Document Mail Center.',
      tips: ['Submit BEFORE introducing product into commerce', 'Keep copies of all submissions']
    },
    {
      title: 'Acknowledgment',
      duration: '1-2 weeks',
      description: 'CDRH sends acknowledgment letter with accession number.',
      tips: ['Reference this number in all future correspondence']
    },
    {
      title: 'Technical Review',
      duration: '60-90 days',
      description: 'CDRH staff review the application for completeness and technical adequacy.',
      tips: ['Be prepared to provide additional information if requested']
    },
    {
      title: 'FDA Response',
      duration: '90-120 days total',
      description: 'CDRH issues approval, conditional approval, or denial.',
      tips: ['Approval must be obtained BEFORE introducing product into commerce']
    }
  ];

  return (
    <div 
      style={{ padding: '24px' }}
      role="region"
      aria-label="Variance Application Process Timeline"
    >
      <h2 style={{ marginBottom: '8px' }}>Variance Application Process</h2>
      <p style={{ color: '#6b7280', marginBottom: '24px' }} id="timeline-desc">
        Timeline and steps for obtaining a variance from FDA requirements.
      </p>

      <div 
        style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
        role="list"
        aria-label="FDA variance application timeline"
      >
        {steps.map((step, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            role="listitem"
            style={{
              display: 'flex',
              gap: '16px',
              padding: '20px',
              background: '#ffffff',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}
            tabIndex={0}
            aria-label={`Step ${index + 1}: ${step.title}, ${step.duration}`}
          >
            <div style={{
              width: '48px',
              height: '48px',
              background: '#3b82f6',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontWeight: 700,
              flexShrink: 0
            }}
              aria-hidden="true"
            >
              {index + 1}
            </div>

            <div style={{ flex: 1 }}>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px'
              }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{step.title}</h3>
                <span style={{ 
                  padding: '4px 12px',
                  background: '#eff6ff',
                  color: '#1d4ed8',
                  borderRadius: '12px',
                  fontSize: '12px',
                  fontWeight: 500
                }}>
                  <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
                  {step.duration}
                </span>
              </div>

              <p style={{ margin: '0 0 12px 0', fontSize: '14px', color: '#374151' }}>
                {step.description}
              </p>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {step.tips.map((tip, tipIndex) => (
                  <span
                    key={tipIndex}
                    style={{
                      padding: '6px 12px',
                      background: '#fef3c7',
                      color: '#92400e',
                      borderRadius: '6px',
                      fontSize: '12px'
                    }}
                  >
                    <Info size={12} style={{ display: 'inline', marginRight: '4px' }} aria-hidden="true" />
                    {tip}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div 
        style={{ 
          marginTop: '24px',
          padding: '20px',
          background: '#fee2e2',
          borderRadius: '12px',
          borderLeft: '4px solid #dc2626'
        }}
        role="alert"
        aria-label="Critical timing requirement"
      >
        <h4 style={{ margin: '0 0 8px 0', color: '#991b1b' }}>
          <AlertCircle size={18} style={{ display: 'inline', marginRight: '8px' }} aria-hidden="true" />
          Critical Timing Requirement
        </h4>
        <p style={{ margin: 0, fontSize: '14px', color: '#7f1d1d' }}>
          Variance applications must be submitted and <strong>approved</strong> BEFORE introducing 
          the product into commerce. Products introduced without approved variances may be 
          subject to detention, refusal of admission, or other regulatory action.
        </p>
      </div>
    </div>
  );
};

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

const Module25VarianceApplications: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'types' | 'simulator' | 'flow' | 'checklist' | 'process'>('overview');

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Info },
    { id: 'types', label: 'Variance Types', icon: Scale },
    { id: 'simulator', label: 'Form 3147 Simulator', icon: FileText },
    { id: 'flow', label: 'Decision Flow', icon: ClipboardCheck },
    { id: 'checklist', label: 'Checklist', icon: CheckCircle },
    { id: 'process', label: 'Process Timeline', icon: Clock }
  ];

  return (
    <div className="module-2-5" style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Module Header */}
      <div style={{ 
        padding: '32px 24px',
        background: 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)',
        color: '#ffffff',
        borderRadius: '0 0 16px 16px'
      }}>
        <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '8px' }}>
          Course 2: FDA Compliance • Module 2.5
        </div>
        <h1 style={{ margin: 0, fontSize: '28px' }}>Variance Applications</h1>
        <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>
          Applying for Alternative Compliance and Form 3147
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
              background: activeTab === tab.id ? '#f3e8ff' : 'transparent',
              color: activeTab === tab.id ? '#7c3aed' : '#6b7280',
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
            <h2 style={{ marginBottom: '16px' }}>About Variance Applications</h2>
            <p style={{ lineHeight: 1.6, marginBottom: '24px' }}>
              Under 21 CFR 1010.4, manufacturers may apply for variances from the requirements 
              of 21 CFR 1040.10 and 1040.11 when compliance is not feasible or when alternative 
              approaches provide equivalent safety. This module guides you through the variance 
              application process using Form FDA 3147.
            </p>

            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <div style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <Scale size={32} color="#7c3aed" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>When to Apply</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  When standard requirements are inappropriate for your product or cannot be met.
                </p>
              </div>
              <div style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <FileText size={32} color="#7c3aed" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Form FDA 3147</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  Official application form for demonstration laser and other variance types.
                </p>
              </div>
              <div style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <Clock size={32} color="#7c3aed" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Timeline</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  Allow 90-120 days for FDA review and response.
                </p>
              </div>
              <div style={{
                padding: '20px',
                background: '#f9fafb',
                borderRadius: '12px'
              }}>
                <Shield size={32} color="#7c3aed" style={{ marginBottom: '12px' }} />
                <h3 style={{ margin: '0 0 8px 0', fontSize: '16px' }}>Safety Equivalent</h3>
                <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
                  Must demonstrate that alternatives provide equivalent or greater safety.
                </p>
              </div>
            </div>

            <div style={{ 
              padding: '20px',
              background: '#f3e8ff',
              borderRadius: '12px'
            }}>
              <h3 style={{ margin: '0 0 12px 0' }}>Common Variance Types</h3>
              <ul style={{ margin: 0, paddingLeft: '20px' }}>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Demonstration Laser Variance:</strong> For laser light shows exceeding Class IIIa
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Surveying/Alignment Variance:</strong> For surveying products exceeding Class IIIa
                </li>
                <li style={{ marginBottom: '8px' }}>
                  <strong>Alternate Labeling:</strong> When standard labeling is inappropriate
                </li>
                <li>
                  <strong>Alternate Performance:</strong> Alternative approaches to performance requirements
                </li>
              </ul>
            </div>
          </div>
        )}

        {activeTab === 'types' && <VarianceTypeSelector />}
        {activeTab === 'simulator' && <Form3147Simulator />}
        {activeTab === 'flow' && <VarianceDecisionFlow />}
        {activeTab === 'checklist' && <VarianceRequirementsChecklist />}
        {activeTab === 'process' && <VarianceProcessTimeline />}
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
          CFR References: 21 CFR 1010.4, 1040.11(b), 1040.11(c)
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
            background: '#7c3aed',
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

export default Module25VarianceApplications;
