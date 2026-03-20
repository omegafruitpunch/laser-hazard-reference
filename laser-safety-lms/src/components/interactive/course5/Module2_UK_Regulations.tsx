import React, { useState } from 'react';
import {
  Shield,
  FileText,
  Building,
  Scale,
  AlertTriangle,
  CheckCircle,
  XCircle,
  ChevronDown,
  ChevronUp,
  Info,
  GraduationCap,
  Users,
  ClipboardCheck,
  MapPin,
  ExternalLink
} from 'lucide-react';

// UKCA vs CE Comparison Data
const markingComparison = [
  {
    aspect: 'Marking',
    eu: 'CE Marking',
    uk: 'UKCA Marking',
    description: 'Conformity marking for products placed on the market'
  },
  {
    aspect: 'Geographic Validity',
    eu: 'European Union + EEA',
    uk: 'United Kingdom (England, Scotland, Wales)',
    description: 'Where each marking is legally recognized'
  },
  {
    aspect: 'Northern Ireland',
    eu: 'CE or UKNI',
    uk: 'CE or UKNI',
    description: 'Special arrangements under Protocol'
  },
  {
    aspect: 'Standards',
    eu: 'Harmonized EN standards',
    uk: 'Designated BS EN standards',
    description: 'Technical standards referenced for compliance'
  },
  {
    aspect: 'Technical File',
    eu: 'EU Declaration of Conformity',
    uk: 'UK Declaration of Conformity',
    description: 'Required documentation'
  },
  {
    aspect: 'Recognized Body',
    eu: 'Notified Body (NB)',
    uk: 'Approved Body (AB)',
    description: 'Third-party conformity assessment body'
  }
];

// HSE Guidance Topics
const hseGuidance = [
  {
    id: 'display-lasers',
    title: 'Safety of Display Lasers (2016)',
    icon: Shield,
    description: 'Comprehensive guidance for temporary and permanent laser displays',
    keyPoints: [
      'Replaced withdrawn HS(G)95 guidance',
      'Developed by industry with HSE consultation',
      'Covers planning, installation, operation, post-show',
      'Risk assessment methodology included',
      'Case studies for different venue types'
    ],
    applicability: 'All laser display installations in UK venues'
  },
  {
    id: 'optical-radiation',
    title: 'Control of Artificial Optical Radiation Regs 2010',
    icon: AlertTriangle,
    description: 'Legal requirements for worker exposure to optical radiation',
    keyPoints: [
      'Implements EU Directive 2006/25/EC',
      'Exposure Limit Values (ELVs) must not be exceeded',
      'Risk assessment required',
      'Worker information and training mandatory',
      'Health surveillance when appropriate'
    ],
    applicability: 'Employers with workers exposed to laser radiation'
  },
  {
    id: 'hsg95',
    title: 'HS(G)95 (Withdrawn)',
    icon: FileText,
    description: 'Historical reference - now superseded by 2016 Display Lasers guidance',
    keyPoints: [
      'Previous HSE guidance on display laser safety',
      'Some venues may still reference it',
      'Core principles remain valid',
      'Replaced by more current guidance'
    ],
    applicability: 'Reference only - use current 2016 guidance'
  }
];

// UK vs EU Comparison
const ukEuComparison = [
  {
    category: 'Regulatory Framework',
    uk: 'UKCA marking, UK designated standards',
    eu: 'CE marking, Harmonized EN standards',
    impact: 'Products need separate conformity assessment for each market'
  },
  {
    category: 'Laser Shows',
    uk: 'No permit required if following HSE guidance',
    eu: 'Varies by country - permits often required',
    impact: 'UK generally more permissive for professional laser shows'
  },
  {
    category: 'Standards',
    uk: 'BS EN 60825 series (UK designated)',
    eu: 'EN 60825 series (harmonized)',
    impact: 'Currently identical content, may diverge over time'
  },
  {
    category: 'Enforcement',
    uk: 'HSE and local authorities',
    eu: 'Member state competent authorities',
    impact: 'Different enforcement approaches across regions'
  }
];

// Pre/Post Brexit Changes
const brexitChanges = [
  {
    change: 'Product Marking',
    before: 'CE marking required',
    after: 'UKCA marking required for GB market',
    transition: 'CE marking accepted until 31 December 2024 for most products'
  },
  {
    change: 'Standards Reference',
    before: 'EN standards automatically harmonized',
    after: 'UK designates BS EN standards',
    transition: 'Currently aligned but UK can diverge'
  },
  {
    change: 'Northern Ireland',
    before: 'Same as rest of UK',
    after: 'Special Protocol arrangements - CE or UKNI',
    transition: 'Ongoing under Withdrawal Agreement'
  },
  {
    change: 'Notified Bodies',
    before: 'UK bodies could be EU Notified Bodies',
    after: 'Separate UK Approved Bodies system',
    transition: 'UK bodies lost EU recognition'
  }
];

// Scottish-specific guidance
const scottishGuidance = {
  title: 'Scotland-Specific Considerations',
  notes: [
    'Glasgow City Council particularly strict on laser shows',
    'Environmental Health Officers review all submissions',
    'May require statement of "no audience scanning" even with proper safety systems',
    'Diffuse reflection concerns may be raised',
    'Hydro arena and other large venues under Glasgow Council control'
  ],
  recommendations: [
    'Engage with local EHO early in planning',
    'Provide comprehensive risk assessments',
    'Include MPE calculations',
    'Offer site visits with measurement equipment',
    'Consider PASS/SafetyScan technology documentation'
  ]
};

const UKCACEComparator: React.FC = () => {
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Scale className="w-6 h-6 text-blue-600" />
        UKCA vs CE Marking Comparison
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left font-semibold">Aspect</th>
              <th className="p-3 text-left font-semibold text-blue-700">EU (CE)</th>
              <th className="p-3 text-left font-semibold text-red-700">UK (UKCA)</th>
              <th className="p-3 text-left font-semibold">Description</th>
            </tr>
          </thead>
          <tbody>
            {markingComparison.map((item, idx) => (
              <tr 
                key={idx} 
                className={`border-b hover:bg-gray-50 cursor-pointer ${
                  selectedAspect === item.aspect ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedAspect(selectedAspect === item.aspect ? null : item.aspect)}
              >
                <td className="p-3 font-medium">{item.aspect}</td>
                <td className="p-3">{item.eu}</td>
                <td className="p-3">{item.uk}</td>
                <td className="p-3 text-gray-600">{item.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-4 bg-amber-50 rounded-lg border border-amber-200">
        <h4 className="font-semibold text-amber-900 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Important: Dual Market Access
        </h4>
        <p className="text-sm text-amber-800 mt-2">
          To sell laser products in both UK and EU markets, manufacturers may need both UKCA and CE markings. 
          The conformity assessment process is similar but requires separate documentation for each market.
        </p>
      </div>
    </div>
  );
};

const HSEGuidanceCard: React.FC<{ guidance: typeof hseGuidance[0] }> = ({ guidance }) => {
  const [expanded, setExpanded] = useState(false);
  const Icon = guidance.icon;

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Icon className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{guidance.title}</h4>
              <p className="text-sm text-gray-600">{guidance.description}</p>
            </div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="pt-3">
            <p className="text-sm font-medium text-gray-700 mb-2">Key Points:</p>
            <ul className="space-y-1">
              {guidance.keyPoints.map((point, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {point}
                </li>
              ))}
            </ul>
            <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
              <span className="font-medium">Applicability:</span> {guidance.applicability}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const PermitCalculator: React.FC = () => {
  const [venueType, setVenueType] = useState('');
  const [location, setLocation] = useState('');
  const [laserPower, setLaserPower] = useState('');
  const [audienceExposure, setAudienceExposure] = useState(false);
  const [result, setResult] = useState<any>(null);

  const calculateRequirements = () => {
    let requirements = [];
    let notifications = [];
    let permit = false;

    // UK general approach
    if (location === 'scotland') {
      requirements.push('Contact local Environmental Health Officer early');
      requirements.push('Provide comprehensive risk assessment');
      requirements.push('May need to provide "no audience scanning" statement');
      notifications.push('Scottish local authorities often require advance notice');
    }

    if (audienceExposure) {
      requirements.push('MPE measurements required');
      requirements.push('Scan-fail protection (PASS/SafetyScan) recommended');
      requirements.push('Written safety assessment');
    }

    if (laserPower === 'high' || laserPower === 'very-high') {
      requirements.push('Laser Safety Officer (LSO) must be appointed');
      requirements.push('Detailed method statement required');
    }

    if (venueType === 'outdoor') {
      notifications.push('CAA notification required for outdoor shows');
      requirements.push('Aviation safety assessment');
    }

    // UK generally does not require permits for compliant professional shows
    const needsPermit = false;

    setResult({
      permit: needsPermit,
      requirements,
      notifications,
      note: 'UK does not require permits for laser shows if HSE guidance is followed. However, venues and local authorities may have their own requirements.'
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ClipboardCheck className="w-6 h-6 text-blue-600" />
        UK Show Requirements Calculator
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Venue Type</label>
            <select 
              className="w-full p-2 border rounded"
              value={venueType}
              onChange={(e) => setVenueType(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="indoor-fixed">Indoor - Fixed Installation</option>
              <option value="indoor-temporary">Indoor - Temporary/Event</option>
              <option value="outdoor">Outdoor</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <select 
              className="w-full p-2 border rounded"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">Select...</option>
              <option value="england">England</option>
              <option value="scotland">Scotland</option>
              <option value="wales">Wales</option>
              <option value="northern-ireland">Northern Ireland</option>
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
              <option value="low">Under 1W (Class 3B)</option>
              <option value="medium">1W - 10W (Class 4)</option>
              <option value="high">10W - 30W (Class 4)</option>
              <option value="very-high">Over 30W (Class 4)</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <input 
              type="checkbox"
              id="audienceExposure"
              checked={audienceExposure}
              onChange={(e) => setAudienceExposure(e.target.checked)}
              className="w-4 h-4"
            />
            <label htmlFor="audienceExposure" className="text-sm">Planned audience exposure</label>
          </div>

          <button
            onClick={calculateRequirements}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Calculate Requirements
          </button>
        </div>

        <div>
          {result ? (
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${result.permit ? 'bg-yellow-50 border-yellow-200' : 'bg-green-50 border-green-200'}`}>
                <h4 className={`font-bold ${result.permit ? 'text-yellow-900' : 'text-green-900'}`}>
                  {result.permit ? '⚠ Permit May Be Required' : '✓ No Permit Required'}
                </h4>
                <p className="text-sm mt-2">{result.note}</p>
              </div>

              {result.requirements.length > 0 && (
                <div>
                  <h5 className="font-semibold text-sm mb-2">Required:</h5>
                  <ul className="space-y-1">
                    {result.requirements.map((req: string, idx: number) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                        {req}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {result.notifications.length > 0 && (
                <div>
                  <h5 className="font-semibold text-sm mb-2">Notifications:</h5>
                  <ul className="space-y-1">
                    {result.notifications.map((note: string, idx: number) => (
                      <li key={idx} className="text-sm flex items-start gap-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                        {note}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Select options to see UK requirements</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Module2_UK_Regulations: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'ukca' | 'guidance' | 'calculator'>('overview');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-600 to-red-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Building className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Module 5.2: UK Post-Brexit Regulations</h1>
        </div>
        <p className="text-red-100">
          Understanding UKCA marking, HSE guidance for display lasers, post-Brexit regulatory changes, 
          and differences between UK and EU laser safety requirements.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: 'Overview & Changes', icon: Info },
          { id: 'ukca', label: 'UKCA vs CE', icon: Scale },
          { id: 'guidance', label: 'HSE Guidance', icon: Shield },
          { id: 'calculator', label: 'Requirements Calculator', icon: ClipboardCheck }
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
          <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <CheckCircle className="w-6 h-6 text-green-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-green-900">UK Laser Show Regulation</h3>
                <p className="text-green-800 text-sm mt-1">
                  The UK generally does not require permits for professional laser shows if HSE guidance 
                  is followed. No prior written permission is required if your paperwork meets appropriate 
                  standards and you have correct safety requirements in place.
                </p>
              </div>
            </div>
          </div>

          {/* Post-Brexit Changes */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Info className="w-6 h-6 text-red-600" />
              Post-Brexit Regulatory Changes
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-3 text-left font-semibold">Change</th>
                    <th className="p-3 text-left font-semibold">Before Brexit</th>
                    <th className="p-3 text-left font-semibold">After Brexit</th>
                    <th className="p-3 text-left font-semibold">Transition</th>
                  </tr>
                </thead>
                <tbody>
                  {brexitChanges.map((change, idx) => (
                    <tr key={idx} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{change.change}</td>
                      <td className="p-3 text-gray-600">{change.before}</td>
                      <td className="p-3 text-gray-600">{change.after}</td>
                      <td className="p-3 text-gray-600">{change.transition}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* UK vs EU Comparison */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Scale className="w-6 h-6 text-red-600" />
              UK vs EU Comparison
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              {ukEuComparison.map((item, idx) => (
                <div key={idx} className="border rounded-lg p-4">
                  <h4 className="font-semibold text-foreground">{item.category}</h4>
                  <div className="mt-2 space-y-2">
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded">EU</span>
                      <span className="text-sm text-gray-600">{item.eu}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded">UK</span>
                      <span className="text-sm text-gray-600">{item.uk}</span>
                    </div>
                  </div>
                  <p className="text-xs text-foreground0 mt-2">Impact: {item.impact}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Scotland Warning */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <MapPin className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900">Scotland-Specific Considerations</h3>
                <p className="text-amber-800 text-sm mt-1">
                  Glasgow City Council and other Scottish authorities are often stricter than England/Wales. 
                  They may require statements of "no audience scanning" even with proper safety systems 
                  like PASS. Early engagement with Environmental Health Officers is strongly recommended.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'ukca' && (
        <div className="space-y-6">
          <UKCACEComparator />
          
          {/* Northern Ireland Note */}
          <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-purple-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-purple-900">Northern Ireland Protocol</h3>
                <p className="text-purple-800 text-sm mt-1">
                  Under the Northern Ireland Protocol, goods placed on the Northern Ireland market 
                  can use either CE marking or UKNI marking. The UKNI marking is not valid for the 
                  EU market. Products with UKCA marking alone are not valid for Northern Ireland.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'guidance' && (
        <div className="space-y-6">
          {/* HSE Guidance Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            {hseGuidance.map(guidance => (
              <HSEGuidanceCard key={guidance.id} guidance={guidance} />
            ))}
          </div>

          {/* Key HSE Principles */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Key HSE Display Laser Principles
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Risk assessment mandatory for all installations
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  MPE must not be exceeded for audience or workers
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Laser Safety Officer (LSO) should be appointed
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Pre-show safety checks required
                </li>
              </ul>
              <ul className="space-y-2">
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Emergency stop systems must be tested
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Hand-over documentation essential
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  Competent operators required
                </li>
                <li className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  CAA notification for outdoor shows
                </li>
              </ul>
            </div>
          </div>

          {/* Scotland Card */}
          <div className="bg-card p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              {scottishGuidance.title}
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium text-sm mb-2">Important Notes:</p>
                <ul className="space-y-1">
                  {scottishGuidance.notes.map((note, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-500 mt-0.5 shrink-0" />
                      {note}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="font-medium text-sm mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {scottishGuidance.recommendations.map((rec, idx) => (
                    <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                      {rec}
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
          
          {/* Documentation Checklist */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              UK Documentation Checklist
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">Required Documents:</h4>
                <ul className="space-y-1">
                  {[
                    'Risk Assessment',
                    'Method Statement',
                    'MPE Calculations',
                    'Equipment Specifications',
                    'Operator Competency Records',
                    'Insurance Certificate',
                    'Emergency Procedures'
                  ].map((item, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Pre-Show Checks:</h4>
                <ul className="space-y-1">
                  {[
                    'Beam alignment verified',
                    'Emergency stops tested',
                    'Scan-fail systems functional',
                    'Safety zones marked',
                    'Warning signs displayed',
                    'Personnel briefed',
                    'CAA notified (outdoor)'
                  ].map((item, idx) => (
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
    </div>
  );
};

export default Module2_UK_Regulations;
