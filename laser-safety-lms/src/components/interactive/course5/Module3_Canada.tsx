import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Scale,
  AlertTriangle,
  CheckCircle,
  Building,
  Plane,
  ChevronDown,
  ChevronUp,
  Info,
  MapPin,
  ClipboardCheck,
  Gavel,
  Plane as PlaneIcon,
  Upload,
  Search
} from 'lucide-react';

// REDA Key Sections
const redaSections = [
  {
    section: 'Section 4',
    title: 'Sale, Lease, Importation',
    content: 'No person shall sell, lease or import a radiation emitting device that:',
    prohibitions: [
      'Does not comply with prescribed standards',
      'Creates risk of injury, impairment or death from radiation',
      'Does not perform according to claimed characteristics',
      'Emits unnecessary radiation'
    ],
    penalties: 'Fine up to $5,000 (summary) or $10,000 (indictment)'
  },
  {
    section: 'Section 5',
    title: 'Deception & Labeling',
    content: 'Prohibits false, misleading or deceptive labeling, packaging or advertising:',
    prohibitions: [
      'False representations about design or construction',
      'Misleading performance claims',
      'Erroneous impressions about safety',
      'Non-compliance with labeling regulations'
    ],
    penalties: 'Regulatory offense with fines'
  },
  {
    section: 'Section 6',
    title: 'Notification Requirements',
    content: 'Manufacturers and importers must notify Minister when aware of:',
    prohibitions: [
      'Non-compliance with standards',
      'Risk of injury from radiation',
      'Device not performing as claimed'
    ],
    penalties: 'Failure to notify is an offense'
  },
  {
    section: 'Sections 7-11',
    title: 'Inspection & Enforcement',
    content: 'Powers of inspectors and analysts:',
    prohibitions: [
      'Entry to premises at reasonable times',
      'Examination and removal of devices',
      'Examination of documents and records',
      'Seizure of non-compliant devices'
    ],
    penalties: 'Obstruction is an offense'
  }
];

// Provincial variations
const provincialRegulations = [
  {
    province: 'Ontario',
    status: 'Additional restrictions in major cities',
    notes: 'Toronto has specific laser pointer restrictions post-2018',
    outdoorPermit: 'Required - Transport Canada'
  },
  {
    province: 'Quebec',
    status: 'Additional restrictions in major cities',
    notes: 'Montreal has specific laser pointer restrictions post-2018',
    outdoorPermit: 'Required - Transport Canada'
  },
  {
    province: 'British Columbia',
    status: 'Additional restrictions in major cities',
    notes: 'Vancouver has specific laser pointer restrictions post-2018',
    outdoorPermit: 'Required - Transport Canada'
  },
  {
    province: 'Other Provinces',
    status: 'Federal regulations apply',
    notes: 'No additional provincial laser show regulations',
    outdoorPermit: 'Required - Transport Canada'
  }
];

// Import procedures
const importProcedures = {
  steps: [
    {
      step: 1,
      title: 'Compliance Verification',
      description: 'Ensure laser product complies with REDA and applicable standards',
      documents: ['Technical specifications', 'Test reports', 'Compliance certificate']
    },
    {
      step: 2,
      title: 'Documentation Preparation',
      description: 'Prepare required import documentation',
      documents: ['Commercial invoice', 'Packing list', 'Certificate of origin', 'Compliance declaration']
    },
    {
      step: 3,
      title: 'CBSA Declaration',
      description: 'Declare goods to Canada Border Services Agency',
      documents: ['Canada Customs Coding Form (B3)', 'Import permit if required']
    },
    {
      step: 4,
      title: 'Health Canada Review',
      description: 'Device may be subject to Health Canada inspection',
      documents: ['Device labeling', 'User manual', 'Safety documentation']
    },
    {
      step: 5,
      title: 'Release or Detention',
      description: 'Device released if compliant, or detained for further inspection',
      documents: ['Release documentation', 'Inspector clearance']
    }
  ],
  inspectorPowers: [
    'Enter premises without warrant (business)',
    'Examine any radiation emitting device',
    'Remove devices for further examination',
    'Open and examine packages',
    'Examine books, records, documents',
    'Seize non-compliant devices'
  ]
};

// Indoor vs Outdoor requirements
const venueRequirements = {
  indoor: {
    title: 'Indoor Laser Shows',
    permitRequired: false,
    authority: 'None Required',
    requirements: [
      'No human eye exposure beyond MPE of 2.5 mW/cm²',
      'Follow general laser safety principles',
      'REDA compliance for equipment',
      'Appropriate safety procedures'
    ],
    notes: 'Indoor shows do not require authorization from Transport Canada'
  },
  outdoor: {
    title: 'Outdoor Laser Shows',
    permitRequired: true,
    authority: 'Transport Canada',
    requirements: [
      'Submit "Notice of Proposal to Conduct Outdoor Laser Operation(s)"',
      'Receive authorization before show',
      'Form similar to US FAA AC 70-1',
      'Submit to appropriate Civil Aviation Regional Office'
    ],
    notes: 'All outdoor shows require authorization, even if terminated'
  }
};

const REDASectionCard: React.FC<{ section: typeof redaSections[0] }> = ({ section }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="inline-block px-2 py-1 bg-red-100 text-red-800 text-xs font-semibold rounded mb-1">
              {section.section}
            </span>
            <h4 className="font-semibold text-foreground">{section.title}</h4>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
        <p className="text-sm text-gray-600 mt-1">{section.content}</p>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="pt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Prohibitions:</p>
            <ul className="space-y-1">
              {section.prohibitions.map((item, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <XCircle className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
            <div className="mt-3 p-2 bg-red-50 rounded text-sm text-red-800">
              <span className="font-medium">Penalties:</span> {section.penalties}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const IndoorOutdoorDecision: React.FC = () => {
  const [selected, setSelected] = useState<'indoor' | 'outdoor' | null>(null);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <MapPin className="w-6 h-6 text-red-600" />
        Indoor vs Outdoor Requirements
      </h3>
      
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setSelected('indoor')}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            selected === 'indoor' 
              ? 'border-green-500 bg-green-50' 
              : 'border-gray-200 hover:border-green-300'
          }`}
        >
          <Building className="w-8 h-8 mx-auto mb-2 text-green-600" />
          <h4 className="font-semibold">Indoor Shows</h4>
          <p className="text-sm text-gray-600 mt-1">No permit required</p>
        </button>
        
        <button
          onClick={() => setSelected('outdoor')}
          className={`flex-1 p-4 rounded-lg border-2 transition-all ${
            selected === 'outdoor' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-blue-300'
          }`}
        >
          <PlaneIcon className="w-8 h-8 mx-auto mb-2 text-blue-600" />
          <h4 className="font-semibold">Outdoor Shows</h4>
          <p className="text-sm text-gray-600 mt-1">Transport Canada permit required</p>
        </button>
      </div>

      {selected && (
        <div className={`p-4 rounded-lg ${selected === 'indoor' ? 'bg-green-50' : 'bg-blue-50'}`}>
          <h4 className="font-bold text-lg mb-2">
            {venueRequirements[selected].title}
          </h4>
          
          <div className="flex items-center gap-2 mb-3">
            {venueRequirements[selected].permitRequired ? (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-800">Permit Required from {venueRequirements[selected].authority}</span>
              </>
            ) : (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-800">No Permit Required</span>
              </>
            )}
          </div>

          <p className="text-sm font-medium mb-2">Requirements:</p>
          <ul className="space-y-1 mb-3">
            {venueRequirements[selected].requirements.map((req, idx) => (
              <li key={idx} className="text-sm flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                {req}
              </li>
            ))}
          </ul>

          <div className={`p-2 rounded text-sm ${selected === 'indoor' ? 'bg-green-100' : 'bg-blue-100'}`}>
            <Info className="w-4 h-4 inline mr-1" />
            {venueRequirements[selected].notes}
          </div>
        </div>
      )}
    </div>
  );
};

const ImportFlowchart: React.FC = () => {
  const [activeStep, setActiveStep] = useState<number | null>(null);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Upload className="w-6 h-6 text-red-600" />
        Import Procedures Flowchart
      </h3>
      
      <div className="space-y-4">
        {importProcedures.steps.map((step) => (
          <div 
            key={step.step}
            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${
              activeStep === step.step ? 'border-red-500 ring-1 ring-red-500' : ''
            }`}
            onClick={() => setActiveStep(activeStep === step.step ? null : step.step)}
          >
            <div className="flex items-center gap-4 p-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center font-bold text-red-700">
                {step.step}
              </div>
              <div className="flex-1">
                <h4 className="font-semibold">{step.title}</h4>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {activeStep === step.step ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
            </div>
            
            {activeStep === step.step && (
              <div className="px-4 pb-4 bg-gray-50">
                <p className="text-sm font-medium mb-2">Required Documents:</p>
                <div className="flex flex-wrap gap-2">
                  {step.documents.map((doc, idx) => (
                    <span key={idx} className="px-2 py-1 bg-card rounded text-sm border">
                      {doc}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Inspector Powers */}
      <div className="mt-6 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h4 className="font-semibold text-amber-900 flex items-center gap-2">
          <Gavel className="w-5 h-5" />
          Inspector Powers Under REDA
        </h4>
        <ul className="mt-2 space-y-1">
          {importProcedures.inspectorPowers.map((power, idx) => (
            <li key={idx} className="text-sm text-amber-800 flex items-start gap-2">
              <Search className="w-4 h-4 mt-0.5 shrink-0" />
              {power}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

const PermitCalculator: React.FC = () => {
  const [city, setCity] = useState('');
  const [showType, setShowType] = useState('');
  const [laserPower, setLaserPower] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculatePermit = () => {
    let requirements = [];
    let warnings = [];
    let permit = false;

    // Major city restrictions (post-2018)
    if (['montreal', 'toronto', 'vancouver'].includes(city)) {
      warnings.push('This city has additional laser pointer restrictions since June 2018');
      warnings.push('Consult local authorities for current requirements');
    }

    // Outdoor always requires permit
    if (showType === 'outdoor') {
      permit = true;
      requirements.push('Transport Canada "Notice of Proposal" required');
      requirements.push('Submit to Civil Aviation Regional Office');
      requirements.push('Receive authorization before show');
      requirements.push('All outdoor shows require authorization, even if terminated');
    }

    // Indoor requirements
    if (showType === 'indoor') {
      requirements.push('No eye exposure beyond 2.5 mW/cm² MPE');
      requirements.push('REDA compliance for equipment');
    }

    // High power requirements
    if (laserPower === 'high' || laserPower === 'very-high') {
      requirements.push('Enhanced safety documentation');
      requirements.push('Professional LSO recommended');
    }

    setResult({
      permit,
      requirements,
      warnings,
      transportCanada: showType === 'outdoor'
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ClipboardCheck className="w-6 h-6 text-red-600" />
        Canada Permit Calculator
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">City/Region</label>
            <select 
              className="w-full p-2 border rounded"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="montreal">Montreal (QC)</option>
              <option value="toronto">Toronto (ON)</option>
              <option value="vancouver">Vancouver (BC)</option>
              <option value="other-qc">Other Quebec</option>
              <option value="other-on">Other Ontario</option>
              <option value="other-bc">Other British Columbia</option>
              <option value="other">Other Province</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Show Type</label>
            <select 
              className="w-full p-2 border rounded"
              value={showType}
              onChange={(e) => setShowType(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="indoor">Indoor</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Total Laser Power</label>
            <select 
              className="w-full p-2 border rounded"
              value={laserPower}
              onChange={(e) => setLaserPower(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="low">Under 1W</option>
              <option value="medium">1W - 10W</option>
              <option value="high">10W - 30W</option>
              <option value="very-high">Over 30W</option>
            </select>
          </div>

          <button
            onClick={calculatePermit}
            className="w-full py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            Calculate Requirements
          </button>
        </div>

        <div>
          {result ? (
            <div className="space-y-4">
              {result.permit ? (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-bold text-amber-900 flex items-center gap-2">
                    <PlaneIcon className="w-5 h-5" />
                    Transport Canada Authorization Required
                  </h4>
                </div>
              ) : (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-900">✓ No Transport Canada Permit Required</h4>
                  <p className="text-sm text-green-800 mt-1">
                    Indoor shows do not require authorization
                  </p>
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="p-3 bg-red-50 rounded border border-red-200">
                  <p className="font-medium text-red-900 text-sm">⚠ Warnings:</p>
                  <ul className="mt-1 space-y-1">
                    {result.warnings.map((w: string, idx: number) => (
                      <li key={idx} className="text-sm text-red-800">{w}</li>
                    ))}
                  </ul>
                </div>
              )}

              <div>
                <p className="font-medium text-sm mb-2">Requirements:</p>
                <ul className="space-y-1">
                  {result.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="text-sm flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Select options to see requirements</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Module3_Canada: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'reda' | 'provinces' | 'import' | 'calculator'>('overview');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Scale className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Module 5.3: Canada Regulations</h1>
        </div>
        <p className="text-red-100">
          Understanding Canada's Radiation Emitting Devices Act (REDA), Health Canada requirements, 
          provincial variations, and import procedures for laser equipment.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'reda', label: 'REDA', icon: Gavel },
          { id: 'provinces', label: 'Provincial', icon: MapPin },
          { id: 'import', label: 'Import Procedures', icon: Upload },
          { id: 'calculator', label: 'Permit Calculator', icon: ClipboardCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-red-600 border-b-2 border-red-600' 
                : 'text-gray-600 hover:text-red-500'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Message */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">Canadian Laser Regulation Overview</h3>
                <p className="text-blue-800 text-sm mt-1">
                  Canada regulates laser products under the Radiation Emitting Devices Act (REDA). 
                  Indoor shows do not require authorization, but there can be no human eye exposure 
                  beyond the Maximum Permissible Exposure level of 2.5 mW/cm². All outdoor shows 
                  require Transport Canada authorization.
                </p>
              </div>
            </div>
          </div>

          {/* Indoor/Outdoor Decision */}
          <IndoorOutdoorDecision />

          {/* Major City Warning */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900">2018 Laser Pointer Law Changes</h3>
                <p className="text-amber-800 text-sm mt-1">
                  Following amendments to the <em>Aeronautics Act</em> in June 2018, laser shows 
                  may not be legal in Montreal, Toronto, and Vancouver. Always check current 
                  local regulations before performing in these cities.
                </p>
              </div>
            </div>
          </div>

          {/* REDA Summary */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-red-600" />
              Radiation Emitting Devices Act (REDA) Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Purpose</h4>
                <p className="text-sm text-gray-600">
                  To regulate the sale, lease, and importation of radiation emitting devices 
                  to protect individuals from genetic or personal injury, impairment of health, 
                  or death from radiation.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Enforcement</h4>
                <p className="text-sm text-gray-600">
                  Health Canada administers and enforces REDA through designated inspectors 
                  who have powers of entry, examination, seizure, and detention of non-compliant devices.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'reda' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Gavel className="w-6 h-6 text-red-600" />
              REDA Key Sections
            </h2>
            <p className="text-gray-600 mb-4">
              Click each section to expand details about prohibitions and penalties.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {redaSections.map((section) => (
                <REDASectionCard key={section.section} section={section} />
              ))}
            </div>
          </div>

          {/* Penalties Summary */}
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <h3 className="text-lg font-bold text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Offences and Penalties Summary
            </h3>
            <div className="mt-4 grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-red-800">Sections 4-6 (Major Offences)</h4>
                <ul className="mt-2 space-y-1 text-red-700">
                  <li>• Summary conviction: Up to $5,000 fine</li>
                  <li>• Indictment: Up to $10,000 fine</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-red-800">Other Provisions</h4>
                <ul className="mt-2 space-y-1 text-red-700">
                  <li>• Summary: Up to $1,000 and/or 6 months imprisonment</li>
                  <li>• Indictment: Up to $3,000 and/or 1 year imprisonment</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'provinces' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-red-600" />
              Provincial Variations
            </h2>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-3 text-left font-semibold">Province</th>
                    <th className="p-3 text-left font-semibold">Status</th>
                    <th className="p-3 text-left font-semibold">Notes</th>
                    <th className="p-3 text-left font-semibold">Outdoor Permit</th>
                  </tr>
                </thead>
                <tbody>
                  {provincialRegulations.map((prov, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{prov.province}</td>
                      <td className="p-3">{prov.status}</td>
                      <td className="p-3 text-gray-600">{prov.notes}</td>
                      <td className="p-3">
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                          {prov.outdoorPermit}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Transport Canada Notice */}
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h3 className="text-lg font-bold text-blue-900 flex items-center gap-2">
              <PlaneIcon className="w-5 h-5" />
              Transport Canada Requirements
            </h3>
            <p className="text-sm text-blue-800 mt-2">
              For outdoor laser shows, you must submit a "Notice of Proposal to Conduct Outdoor 
              Laser Operation(s)" to Transport Canada. This form is similar to the US FAA's 
              Advisory Circular 70-1. Submit to the appropriate Civil Aviation Regional Office 
              and receive authorization before the show.
            </p>
            <div className="mt-3 flex gap-2">
              <span className="px-2 py-1 bg-card rounded text-xs border">All outdoor shows require authorization</span>
              <span className="px-2 py-1 bg-card rounded text-xs border">Even terminated shows</span>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'import' && (
        <div className="space-y-6">
          <ImportFlowchart />
          
          {/* Documentation Checklist */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-red-600" />
              Import Documentation Checklist
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Commercial Documents:</h4>
                <ul className="space-y-1">
                  {['Commercial invoice', 'Packing list', 'Bill of lading', 'Certificate of origin'].map((item, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Compliance Documents:</h4>
                <ul className="space-y-1">
                  {['Technical specifications', 'Test reports', 'Compliance certificate', 'User manual'].map((item, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <PermitCalculator />
          
          {/* Contact Information */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Building className="w-5 h-5 text-red-600" />
              Key Canadian Authorities
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 border rounded">
                <h4 className="font-semibold">Health Canada</h4>
                <p className="text-sm text-gray-600">Administers REDA and product safety</p>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-semibold">Transport Canada</h4>
                <p className="text-sm text-gray-600">Outdoor laser show authorizations</p>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-semibold">Canada Border Services Agency (CBSA)</h4>
                <p className="text-sm text-gray-600">Customs and import processing</p>
              </div>
              <div className="p-3 border rounded">
                <h4 className="font-semibold">Provincial Authorities</h4>
                <p className="text-sm text-gray-600">Additional local requirements</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Missing import
const XCircle = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

export default Module3_Canada;
