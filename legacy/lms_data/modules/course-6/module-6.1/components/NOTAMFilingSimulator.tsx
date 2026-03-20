/**
 * NOTAM Filing Simulator - FAA Form 7140-1 Walkthrough
 * 
 * FAA Official Aesthetic - Blue/White styling with aviation warning colors
 * Enhanced with weather/aviation icons and emergency-oriented design
 */

import React, { useState } from 'react';
import { FormStep, ValidationResult } from '../types';
import { FAAColors, FAAIcons, ZoneConfig } from '../../styles/FAAAviationStyles';

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'time' | 'number' | 'textarea' | 'radio';
  required: boolean;
  helpText?: string;
  options?: string[];
  validation?: (value: any) => ValidationResult;
  section?: string;
}

// FAA Service Centers with aviation styling
const serviceCenters = [
  { name: 'Eastern Service Center', icon: '🏛️', region: 'Atlanta, GA' },
  { name: 'Central Service Center', icon: '🏛️', region: 'Fort Worth, TX' },
  { name: 'Western Service Center', icon: '🏛️', region: 'Renton, WA' },
  { name: 'Alaska Service Center', icon: '🏔️', region: 'Anchorage, AK' },
];

const formSections: FormStep[] = [
  {
    id: 'section1',
    title: 'Section 1: General Information',
    description: 'Basic event and proponent details',
    icon: '📋',
    fields: [
      {
        id: 'faa_service_center',
        label: 'FAA Service Center',
        type: 'select',
        required: true,
        helpText: 'Select the service center responsible for the operation area',
        options: serviceCenters.map(sc => sc.name)
      },
      {
        id: 'proponent_name',
        label: 'Proponent Name',
        type: 'text',
        required: true,
        helpText: 'The party primarily responsible for laser safety'
      },
      {
        id: 'event_name',
        label: 'Event/Facility Name',
        type: 'text',
        required: true,
        helpText: 'Event name for temporary shows or facility name for permanent installations'
      },
      {
        id: 'date_prepared',
        label: 'Date Prepared',
        type: 'date',
        required: true,
        helpText: 'Date the form is being prepared (not the operation date)'
      }
    ]
  },
  {
    id: 'section2',
    title: 'Section 2: Date(s) and Time(s)',
    description: 'Operation schedule with time zone',
    icon: '📅',
    fields: [
      {
        id: 'operation_dates',
        label: 'Operation Date(s)',
        type: 'textarea',
        required: true,
        helpText: 'Example: May 20, 2024, 7:00 p.m. to 12:00 a.m. (midnight), Central Time'
      },
      {
        id: 'testing_dates',
        label: 'Testing/Alignment Date(s)',
        type: 'textarea',
        required: false,
        helpText: 'If applicable, when testing and alignment will occur'
      }
    ]
  },
  {
    id: 'section3',
    title: 'Section 3-4: Operation Details',
    description: 'Description and on-site contact information',
    icon: '📝',
    fields: [
      {
        id: 'operation_description',
        label: 'Brief Description of Laser Operation',
        type: 'textarea',
        required: true,
        helpText: 'Provide general overview. Detailed laser configurations go on page 2.'
      },
      {
        id: 'operator_name',
        label: 'Laser Operator(s)',
        type: 'text',
        required: true
      },
      {
        id: 'primary_phone',
        label: 'Primary On-Site Phone',
        type: 'text',
        required: true,
        helpText: 'Must be a U.S. phone number with direct link to laser operator'
      },
      {
        id: 'secondary_phone',
        label: 'Secondary On-Site Phone',
        type: 'text',
        required: false
      }
    ]
  },
  {
    id: 'section5',
    title: 'Section 5: FDA/CDRH Information',
    description: 'Variance details for demonstration lasers',
    icon: '🏛️',
    fields: [
      {
        id: 'variance_number',
        label: 'FDA Variance Number',
        type: 'text',
        required: false,
        helpText: 'Required for laser light shows regulated by FDA/CDRH'
      },
      {
        id: 'variance_expiration',
        label: 'Variance Expiration Date',
        type: 'date',
        required: false
      },
      {
        id: 'accession_number',
        label: 'FDA Accession Number',
        type: 'text',
        required: false,
        helpText: 'Seven alphanumeric digits provided by FDA/CDRH'
      }
    ]
  },
  {
    id: 'section6',
    title: 'Section 6: Control Measures',
    description: 'Safety measures to protect airspace',
    icon: '🛡️',
    fields: [
      {
        id: 'control_measures',
        label: 'Description of Control Measures',
        type: 'textarea',
        required: true,
        helpText: 'Describe observers, termination surfaces, radar/imaging equipment, or physical beam path limits'
      },
      {
        id: 'electronic_protection',
        label: 'Using Electronic Protection System?',
        type: 'radio',
        required: true,
        options: ['Yes - Using SAE AS6029 compliant system', 'No - Using safety observers', 'No - Using beam termination']
      }
    ]
  },
  {
    id: 'section10',
    title: 'Section 10-11: Configuration & Location',
    description: 'Geographic location details',
    icon: '🗺️',
    fields: [
      {
        id: 'config_number',
        label: 'Configuration Number',
        type: 'text',
        required: true,
        helpText: 'Example: "1 of 3" for first of three configurations'
      },
      {
        id: 'site_elevation',
        label: 'Site Elevation (feet MSL)',
        type: 'number',
        required: true,
        helpText: 'Ground elevation in feet mean sea level'
      },
      {
        id: 'laser_height',
        label: 'Laser Height Above Site (feet AGL)',
        type: 'number',
        required: true,
        helpText: 'Total height including any structure or building'
      },
      {
        id: 'latitude',
        label: 'Latitude (degrees, minutes, seconds)',
        type: 'text',
        required: true,
        helpText: 'Convert from decimal degrees if necessary'
      },
      {
        id: 'longitude',
        label: 'Longitude (degrees, minutes, seconds)',
        type: 'text',
        required: true
      }
    ]
  },
  {
    id: 'section12',
    title: 'Section 12: Beam Characteristics',
    description: 'Laser specifications and calculations',
    icon: '🔴',
    fields: [
      {
        id: 'laser_type',
        label: 'Laser Type',
        type: 'select',
        required: true,
        options: ['CO2', 'Copper-vapor', 'Diode', 'Nd:YAG', 'Fiber', 'Other']
      },
      {
        id: 'laser_class',
        label: 'Laser Hazard Class',
        type: 'select',
        required: true,
        options: ['Class 2', 'Class 2M', 'Class 3R', 'Class 3B', 'Class 4']
      },
      {
        id: 'power_watts',
        label: 'Power (Watts)',
        type: 'number',
        required: true,
        helpText: 'Maximum power for CW, average power for repetitively pulsed'
      },
      {
        id: 'beam_diameter',
        label: 'Beam Diameter at 1/e points (cm)',
        type: 'number',
        required: true,
        helpText: 'Use centimeters, not millimeters'
      },
      {
        id: 'beam_divergence',
        label: 'Beam Divergence 1/e full angle (mrad)',
        type: 'number',
        required: true,
        helpText: 'If measured at 1/e², multiply by 0.707 to convert'
      },
      {
        id: 'wavelength',
        label: 'Wavelength(s) (nm)',
        type: 'text',
        required: true,
        helpText: 'For multiple wavelengths, list all separated by commas'
      },
      {
        id: 'mpe_value',
        label: 'MPE Value (mW/cm²)',
        type: 'number',
        required: true,
        helpText: 'Use 2.6 for visible (400-700nm), reference tables for other wavelengths'
      }
    ]
  },
  {
    id: 'section13',
    title: 'Section 13: Beam Direction',
    description: 'Elevation angles and azimuth',
    icon: '🎯',
    fields: [
      {
        id: 'min_elevation',
        label: 'Minimum Elevation Angle (degrees)',
        type: 'number',
        required: true,
        helpText: '0 = horizontal, range typically 0-90'
      },
      {
        id: 'max_elevation',
        label: 'Maximum Elevation Angle (degrees)',
        type: 'number',
        required: true,
        helpText: '90 = vertical (straight up)'
      },
      {
        id: 'azimuth',
        label: 'Azimuth (degrees)',
        type: 'text',
        required: true,
        helpText: 'Fixed: "45°" | Moving: "20° to 50°" | All around: "0° to 360°"'
      },
      {
        id: 'north_type',
        label: 'Type of North',
        type: 'radio',
        required: true,
        options: ['True north', 'Magnetic north']
      }
    ]
  }
];

export const NOTAMFilingSimulator: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [savedForms, setSavedForms] = useState<string[]>([]);

  const currentSection = formSections[currentStep];

  const handleFieldChange = (fieldId: string, value: any) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (validationErrors[fieldId]) {
      setValidationErrors(prev => ({ ...prev, [fieldId]: '' }));
    }
  };

  const validateCurrentStep = (): boolean => {
    const errors: Record<string, string> = {};
    let isValid = true;

    currentSection.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        errors[field.id] = 'This field is required';
        isValid = false;
      }
      if (field.validation && formData[field.id]) {
        const result = field.validation(formData[field.id]);
        if (!result.valid) {
          errors[field.id] = result.message;
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      if (currentStep < formSections.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const saveProgress = () => {
    const formName = formData.event_name || `Form_${new Date().toISOString().slice(0, 10)}`;
    setSavedForms(prev => [...prev, formName]);
    alert(`Progress saved: ${formName}`);
  };

  const getStepStatus = (stepIndex: number) => {
    if (stepIndex < currentStep) return 'completed';
    if (stepIndex === currentStep) return 'current';
    return 'pending';
  };

  const renderField = (field: FormField) => {
    const error = validationErrors[field.id];
    const value = formData[field.id] || '';

    const baseClass = "w-full p-3 border-2 rounded-lg transition-all duration-200";
    const errorClass = error 
      ? "border-red-500 bg-red-50 focus:border-red-500 focus:ring-2 focus:ring-red-200" 
      : "border-gray-300 focus:border-[#002868] focus:ring-2 focus:ring-blue-200";

    return (
      <div key={field.id} className="mb-5">
        <label className="block text-sm font-bold text-[#002868] mb-2 flex items-center">
          {field.label}
          {field.required && (
            <span className="text-red-600 ml-1" title="Required field">*</span>
          )}
        </label>
        
        {field.helpText && (
          <button
            onClick={() => setShowHelp(showHelp === field.id ? null : field.id)}
            className="text-xs text-[#002868] hover:text-blue-700 mb-2 flex items-center font-medium"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {showHelp === field.id ? 'Hide Help' : 'Show Help'}
          </button>
        )}

        {showHelp === field.id && field.helpText && (
          <div className="bg-blue-50 border-l-4 border-[#002868] p-3 rounded-r-lg mb-3 text-sm text-blue-800">
            {field.helpText}
          </div>
        )}

        {field.type === 'select' && (
          <select
            className={`${baseClass} ${errorClass}`}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            <option value="">Select {field.label}...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {field.type === 'radio' && (
          <div className="space-y-2">
            {field.options?.map(opt => (
              <label key={opt} className="flex items-center p-3 border-2 border-gray-200 rounded-lg cursor-pointer 
                hover:bg-blue-50 hover:border-blue-300 transition-all">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="mr-3 w-4 h-4 text-[#002868]"
                />
                <span className="text-sm font-medium">{opt}</span>
              </label>
            ))}
          </div>
        )}

        {field.type === 'textarea' && (
          <textarea
            className={`${baseClass} ${errorClass} h-28 resize-y`}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.helpText}
          />
        )}

        {(field.type === 'text' || field.type === 'date' || field.type === 'number') && (
          <input
            type={field.type}
            className={`${baseClass} ${errorClass}`}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.helpText}
          />
        )}

        {error && (
          <p className="text-red-600 text-sm mt-2 flex items-center font-medium">
            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" 
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" />
            </svg>
            {error}
          </p>
        )}
      </div>
    );
  };

  if (completed) {
    return (
      <div className="max-w-4xl mx-auto">
        {/* FAA Header */}
        <div className="bg-[#002868] text-white p-6 rounded-t-xl">
          <div className="flex items-center">
            <span className="text-4xl mr-4">✈️</span>
            <div>
              <h2 className="text-2xl font-bold">FAA Form 7140-1 Completed</h2>
              <p className="text-blue-100">Notice of Proposed Outdoor Laser Operation</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-xl shadow-lg p-8">
          <div className="text-center py-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 
              border-4 border-green-500">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">Submission Ready</h3>
            <p className="text-gray-600 max-w-xl mx-auto mb-8">
              You have successfully completed the simulated FAA Form 7140-1. In a real submission, 
              you would now submit this to the appropriate FAA Service Center along with required attachments.
            </p>
          </div>
          
          {/* Next Steps - FAA Blue Style */}
          <div className="bg-blue-50 rounded-xl p-6 border-2 border-[#002868] mb-8">
            <h3 className="font-bold text-[#002868] mb-4 flex items-center text-lg">
              <span className="text-2xl mr-3">📋</span>
              Next Steps in FAA Process
            </h3>
            <ol className="space-y-3">
              {[
                { step: 1, text: 'Attach diagrams depicting planned laser paths', icon: '🗺️' },
                { step: 2, text: 'Include Laser Configuration Worksheet (page 2) for each configuration', icon: '📝' },
                { step: 3, text: 'Submit to appropriate FAA Service Center at least 30 days before operation', icon: '📅' },
                { step: 4, text: 'Wait for Letter of Determination (LOD) from FAA', icon: '⏰' },
                { step: 5, text: 'Do not proceed with laser operation until receiving LOD with "no objection"', icon: '⛔', warning: true },
              ].map((item) => (
                <li key={item.step} className={`flex items-start p-3 rounded-lg ${
                  item.warning ? 'bg-red-50 border border-red-200' : 'bg-white'
                }`}>
                  <span className="flex-shrink-0 w-8 h-8 rounded-full bg-[#002868] text-white 
                    flex items-center justify-center font-bold mr-3">
                    {item.step}
                  </span>
                  <span className="text-xl mr-3">{item.icon}</span>
                  <span className={`${item.warning ? 'text-red-800 font-semibold' : 'text-gray-700'}`}>
                    {item.text}
                  </span>
                </li>
              ))}
            </ol>
          </div>

          {/* Form Summary */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h4 className="font-bold text-gray-800 mb-4">Form Summary</h4>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-500">Event:</span>
                <span className="ml-2 font-medium">{formData.event_name || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Service Center:</span>
                <span className="ml-2 font-medium">{formData.faa_service_center || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Laser Type:</span>
                <span className="ml-2 font-medium">{formData.laser_type || 'N/A'}</span>
              </div>
              <div>
                <span className="text-gray-500">Power:</span>
                <span className="ml-2 font-medium">{formData.power_watts ? `${formData.power_watts}W` : 'N/A'}</span>
              </div>
            </div>
          </div>

          <div className="flex justify-center gap-4">
            <button
              onClick={() => {
                setCurrentStep(0);
                setCompleted(false);
                setFormData({});
              }}
              className="bg-[#002868] hover:bg-[#003d8c] text-white px-8 py-3 rounded-lg font-semibold 
                transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Start New Form
            </button>
            <button
              onClick={() => alert('Print functionality would generate PDF')}
              className="bg-white border-2 border-[#002868] text-[#002868] hover:bg-blue-50 
                px-8 py-3 rounded-lg font-semibold transition-colors flex items-center"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Summary
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      {/* FAA Header */}
      <div className="bg-[#002868] text-white p-6 rounded-t-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-4xl mr-4">✈️</span>
            <div>
              <h2 className="text-2xl font-bold">FAA Form 7140-1 Simulator</h2>
              <p className="text-blue-100">Notice of Proposed Outdoor Laser Operation</p>
            </div>
          </div>
          <div className="hidden md:block text-right">
            <div className="text-sm text-blue-200">Training Mode</div>
            <div className="text-xs text-blue-300">Not for actual FAA submission</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-b-xl shadow-lg p-6">
        {/* Progress Timeline */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-[#002868]">
              Section {currentStep + 1} of {formSections.length}
            </span>
            <span className="text-sm text-gray-500">
              {Math.round(((currentStep + 1) / formSections.length) * 100)}% Complete
            </span>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-4">
            <div
              className="bg-[#002868] h-3 rounded-full transition-all duration-500"
              style={{ width: `${((currentStep + 1) / formSections.length) * 100}%` }}
            />
          </div>

          {/* Step Indicators */}
          <div className="flex justify-between overflow-x-auto pb-2">
            {formSections.map((section, idx) => {
              const status = getStepStatus(idx);
              return (
                <button
                  key={section.id}
                  onClick={() => idx <= currentStep && setCurrentStep(idx)}
                  disabled={idx > currentStep}
                  className={`flex flex-col items-center min-w-[60px] transition-all ${
                    idx > currentStep ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg mb-1
                    border-2 transition-all ${
                    status === 'completed' ? 'bg-green-500 border-green-500 text-white' :
                    status === 'current' ? 'bg-[#002868] border-[#002868] text-white' :
                    'bg-white border-gray-300 text-gray-400'
                  }`}>
                    {status === 'completed' ? '✓' : section.icon}
                  </div>
                  <span className={`text-xs text-center max-w-[80px] leading-tight ${
                    status === 'current' ? 'text-[#002868] font-bold' : 'text-gray-500'
                  }`}>
                    {section.title.split(':')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Current Section */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <span className="text-3xl mr-3">{currentSection.icon}</span>
            <div>
              <h3 className="text-xl font-bold text-[#002868]">{currentSection.title}</h3>
              <p className="text-gray-600 text-sm">{currentSection.description}</p>
            </div>
          </div>
          
          <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
            {currentSection.fields.map(renderField)}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <div className="flex gap-3">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className={`px-6 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                currentStep === 0
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Previous
            </button>
            
            <button
              onClick={saveProgress}
              className="px-6 py-3 rounded-lg font-semibold transition-colors flex items-center
                bg-white border-2 border-gray-300 text-gray-600 hover:bg-gray-50"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} 
                  d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
              Save
            </button>
          </div>
          
          <button
            onClick={handleNext}
            className="bg-[#002868] hover:bg-[#003d8c] text-white px-8 py-3 rounded-lg font-semibold 
              transition-colors flex items-center shadow-md"
          >
            {currentStep === formSections.length - 1 ? 'Complete Form' : 'Next Section'}
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>

        {/* FAA Key Reminders - Amber Warning Style */}
        <div className="mt-8 p-5 bg-amber-50 rounded-xl border-2 border-amber-400">
          <h4 className="font-bold text-amber-800 mb-3 flex items-center text-lg">
            <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" 
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" 
                clipRule="evenodd" />
            </svg>
            FAA Filing Requirements
          </h4>
          <ul className="grid md:grid-cols-2 gap-3 text-sm text-amber-800">
            {[
              { icon: '⛔', text: 'All fields marked with * are required' },
              { icon: '📅', text: 'File at least 30 days before operation' },
              { icon: '📝', text: 'Use decimal notation, not scientific' },
              { icon: '📞', text: 'Include 24/7 contact phone number' },
              { icon: '⏰', text: 'Wait for LOD before operating' },
              { icon: '🗺️', text: 'Attach laser path diagrams' },
            ].map((item, idx) => (
              <li key={idx} className="flex items-center bg-white p-2 rounded-lg">
                <span className="mr-2">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Zone Reference */}
        <div className="mt-6 grid grid-cols-4 gap-2">
          {Object.entries(ZoneConfig).map(([key, zone]) => (
            <div key={key} className={`p-3 rounded-lg border-2 text-center ${zone.bgLight} ${zone.borderColor}`}>
              <div className={`text-xs font-bold ${zone.textColor}`}>{zone.acronym}</div>
              <div className="text-xs text-gray-600">{zone.threshold}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NOTAMFilingSimulator;
