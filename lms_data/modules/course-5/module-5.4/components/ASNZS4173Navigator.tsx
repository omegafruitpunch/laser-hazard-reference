'use client';

import { useState } from 'react';
import { BookOpen, ChevronRight, Info, AlertTriangle, CheckCircle, FileText, Shield } from 'lucide-react';

interface StandardSection {
  id: string;
  title: string;
  description: string;
  keyPoints: string[];
  requirements: string[];
  appliesTo: string[];
}

const standardSections: StandardSection[] = [
  {
    id: 'scope',
    title: '1. Scope and Application',
    description: 'Defines the scope of AS/NZS 4173 and its application to laser safety in Australia and New Zealand.',
    keyPoints: [
      'Applies to all laser products and laser systems used in Australia and New Zealand',
      'Covers both occupational and public exposure scenarios',
      'Adopts IEC 60825-1 with Australasian-specific modifications',
      'Complements state/territory radiation protection legislation'
    ],
    requirements: [
      'Compliance with AS/NZS 4173 is mandatory under state/territory laws',
      'Must be used in conjunction with applicable workplace health and safety regulations',
      'Referenced in EPA and radiation control requirements across jurisdictions'
    ],
    appliesTo: ['All laser users', 'Employers', 'LSOs', 'Equipment suppliers']
  },
  {
    id: 'classification',
    title: '2. Laser Classification System',
    description: 'Classification of lasers based on accessible emission limits and hazard potential.',
    keyPoints: [
      'Class 1: Safe under all conditions of normal use',
      'Class 1M: Safe except when viewed with magnifying optics',
      'Class 2: Low-power visible, blink reflex provides protection',
      'Class 2M: As Class 2, but unsafe with magnifying optics',
      'Class 3R: Low risk, normally safe with aversion response',
      'Class 3B: Direct beam viewing hazard, diffuse reflection safe',
      'Class 4: High power, eye and skin hazard, fire hazard'
    ],
    requirements: [
      'All lasers must be classified by manufacturer or competent person',
      'Class 3B and Class 4 lasers require registration in all Australian states',
      'Classification labeling must be clearly visible and permanent',
      'Re-classification may be required for modified systems'
    ],
    appliesTo: ['Manufacturers', 'Importers', 'Users of Class 3B/4 lasers']
  },
  {
    id: 'mpe',
    title: '3. Maximum Permissible Exposure (MPE)',
    description: 'Exposure limits for eye and skin across all laser wavelengths and exposure durations.',
    keyPoints: [
      'MPE values specified for eye and skin exposure',
      'Values depend on wavelength, exposure duration, and pulse characteristics',
      'Tables provided for continuous wave and pulsed lasers',
      'Special considerations for extended sources and repetitive pulses'
    ],
    requirements: [
      'Exposure must not exceed MPE for accessible beams',
      'Calculations must account for worst-case scenarios',
      'Documentation of MPE compliance required for regulated lasers',
      'Regular review of exposure assessments'
    ],
    appliesTo: ['LSOs', 'Laser operators', 'Safety assessors']
  },
  {
    id: 'noehd',
    title: '4. Nominal Ocular Hazard Distance (NOHD)',
    description: 'Calculations for determining hazard distances for eye exposure.',
    keyPoints: [
      'NOHD is distance where beam irradiance falls below MPE',
      'Calculated based on beam parameters and MPE values',
      'Extended NOHD (ENOHD) for outdoor/uncontrolled environments',
      'Nominal Skin Hazard Distance (NSHD) also defined'
    ],
    requirements: [
      'NOHD must be calculated for all Class 3B and Class 4 laser operations',
      'Hazard zone must be controlled and marked',
      'Outdoor operations require ENOHD calculations',
      'Documentation must include calculation assumptions'
    ],
    appliesTo: ['LSOs', 'Show designers', 'Outdoor operators']
  },
  {
    id: 'engineering',
    title: '5. Engineering Controls',
    description: 'Physical safety measures built into laser systems and installations.',
    keyPoints: [
      'Protective housings and interlocks',
      'Remote interlock connectors',
      'Key control for Class 4 lasers',
      'Beam attenuators and shutters',
      'Warning devices (audible/visual)',
      'Beam paths and enclosures'
    ],
    requirements: [
      'Class 4 lasers must have key-controlled operation',
      'Interlocks must prevent access when laser is operating',
      'Warning signs required at all access points',
      'Beam enclosures preferred for indoor installations'
    ],
    appliesTo: ['System designers', 'Installers', 'Facility managers']
  },
  {
    id: 'administrative',
    title: '6. Administrative Controls',
    description: 'Procedural measures for safe laser operation and management.',
    keyPoints: [
      'Laser Safety Officer (LSO) designation',
      'Standard Operating Procedures (SOPs)',
      'Training and competency requirements',
      'Controlled area establishment',
      'Authorization and supervision protocols'
    ],
    requirements: [
      'LSO required for Class 3B and Class 4 operations',
      'Written SOPs mandatory for all laser operations',
      'Personnel training records must be maintained',
      'Access control to laser controlled areas'
    ],
    appliesTo: ['Employers', 'LSOs', 'Training coordinators']
  },
  {
    id: 'ppe',
    title: '7. Personal Protective Equipment',
    description: 'Eye and skin protection requirements for laser operations.',
    keyPoints: [
      'Laser protective eyewear selection criteria',
      'Optical Density (OD) requirements',
      'Wavelength-specific protection',
      'Comfort and visibility considerations',
      'Skin protection for high-power lasers'
    ],
    requirements: [
      'Eyewear must be rated for specific laser wavelength(s)',
      'OD must be sufficient to reduce exposure below MPE',
      'Regular inspection of protective equipment',
      'Replacement after any suspected damage'
    ],
    appliesTo: ['All laser personnel', 'LSOs', 'Procurement staff']
  },
  {
    id: 'medical',
    title: '8. Medical Examinations',
    description: 'Requirements for pre-employment and incident-related medical surveillance.',
    keyPoints: [
      'Pre-employment eye examinations for laser workers',
      'Incident investigation procedures',
      'Medical examination following suspected overexposure',
      'Record keeping requirements'
    ],
    requirements: [
      'Baseline eye exam recommended for Class 3B/4 operators',
      'Immediate medical attention for suspected eye exposure',
      'Documentation of all medical surveillance',
      'Retention of medical records per regulations'
    ],
    appliesTo: ['Employers', 'Occupational health personnel', 'LSOs']
  }
];

const entertainmentSpecific = [
  {
    topic: 'Audience Scanning',
    content: 'AS/NZS 4173 references IEC 60825-3 for audience scanning. Beam irradiance in audience areas must remain below MPE levels. Show designers must calculate and document compliance.',
    requirements: ['MPE compliance verification', 'Beam characterization', 'Calculation documentation']
  },
  {
    topic: 'Outdoor Shows',
    content: 'Extended NOHD calculations required. Coordination with aviation authorities for airspace clearance. Environmental factors (humidity, dust) affect hazard distances.',
    requirements: ['ENOHD calculation', 'NOTAM filing', 'Perimeter security', 'Weather monitoring']
  },
  {
    topic: 'Temporary Installations',
    content: 'Touring shows must comply with each state/territory requirements. Temporary venue assessments required. Equipment must meet Australian electrical safety standards.',
    requirements: ['State-by-state compliance', 'Venue assessment', 'Electrical safety certification']
  },
  {
    topic: 'Operator Licensing (NZ)',
    content: 'New Zealand requires specific laser operator licenses under the Radiation Safety Act 2016. Australian operators working in NZ must obtain appropriate licenses.',
    requirements: ['EPA license application', 'Safety plan submission', 'Competency demonstration']
  }
];

export default function ASNZS4173Navigator() {
  const [activeSection, setActiveSection] = useState<StandardSection>(standardSections[0]);
  const [showEntertainment, setShowEntertainment] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-800 to-emerald-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h2 className="text-2xl font-bold">AS/NZS 4173 Interactive Navigator</h2>
        </div>
        <p className="text-white/80">
          Explore the Australian/New Zealand Standard for laser safety. Select a section to view details, 
          requirements, and applicability.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Section Navigation */}
        <div className="lg:col-span-1 space-y-2">
          <h3 className="text-gray-300 font-semibold mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Standard Sections
          </h3>
          {standardSections.map((section) => (
            <button
              key={section.id}
              onClick={() => { setActiveSection(section); setShowEntertainment(false); }}
              className={`w-full text-left p-3 rounded-lg transition-all ${
                activeSection.id === section.id && !showEntertainment
                  ? 'bg-emerald-900/50 border border-emerald-600'
                  : 'bg-gray-900 border border-gray-800 hover:border-gray-600'
              }`}
            >
              <p className={`text-sm font-medium ${activeSection.id === section.id && !showEntertainment ? 'text-emerald-400' : 'text-gray-300'}`}>
                {section.title}
              </p>
            </button>
          ))}

          {/* Entertainment Specific Button */}
          <button
            onClick={() => setShowEntertainment(true)}
            className={`w-full text-left p-3 rounded-lg transition-all mt-4 ${
              showEntertainment
                ? 'bg-amber-900/50 border border-amber-600'
                : 'bg-gray-900 border border-gray-800 hover:border-gray-600'
            }`}
          >
            <p className={`text-sm font-medium ${showEntertainment ? 'text-amber-400' : 'text-gray-300'}`}>
              🎭 Entertainment-Specific Requirements
            </p>
          </button>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-2">
          {!showEntertainment ? (
            <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 animate-in fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center text-white font-bold">
                  {activeSection.id.charAt(0).toUpperCase()}
                </div>
                <h3 className="text-xl font-bold text-white">{activeSection.title}</h3>
              </div>

              <p className="text-gray-300 mb-6">{activeSection.description}</p>

              {/* Key Points */}
              <div className="mb-6">
                <h4 className="text-emerald-400 font-semibold mb-3 flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Key Points
                </h4>
                <ul className="space-y-2">
                  {activeSection.keyPoints.map((point, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                      <span className="text-emerald-500 flex-shrink-0">•</span>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Requirements */}
              <div className="mb-6 bg-gray-800/50 rounded-lg p-4">
                <h4 className="text-amber-400 font-semibold mb-3 flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" />
                  Requirements
                </h4>
                <ul className="space-y-2">
                  {activeSection.requirements.map((req, i) => (
                    <li key={i} className="flex gap-3 text-sm text-gray-300">
                      <CheckCircle className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Applies To */}
              <div>
                <h4 className="text-blue-400 font-semibold mb-3 flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  Applies To
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeSection.appliesTo.map((entity) => (
                    <span key={entity} className="px-3 py-1 bg-blue-900/30 text-blue-300 rounded-full text-sm">
                      {entity}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-amber-900/20 to-orange-900/20 border border-amber-700/50 rounded-xl p-6 animate-in fade-in">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-amber-600 flex items-center justify-center text-white">
                  🎭
                </div>
                <h3 className="text-xl font-bold text-white">Entertainment-Specific Requirements</h3>
              </div>

              <p className="text-gray-300 mb-6">
                Additional considerations for laser shows and entertainment applications under AS/NZS 4173.
              </p>

              <div className="space-y-4">
                {entertainmentSpecific.map((item) => (
                  <div key={item.topic} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                    <h4 className="text-amber-400 font-semibold mb-2 flex items-center gap-2">
                      <ChevronRight className="w-4 h-4" />
                      {item.topic}
                    </h4>
                    <p className="text-gray-300 text-sm mb-3">{item.content}</p>
                    <div className="flex flex-wrap gap-2">
                      {item.requirements.map((req) => (
                        <span key={req} className="px-2 py-1 bg-amber-900/30 text-amber-300 rounded text-xs">
                          {req}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
