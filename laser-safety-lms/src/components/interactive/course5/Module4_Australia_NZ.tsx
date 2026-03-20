import React, { useState } from 'react';
import {
  MapPin,
  FileText,
  Shield,
  CheckCircle,
  AlertTriangle,
  Info,
  Globe,
  Building,
  GraduationCap,
  ClipboardCheck,
  ChevronDown,
  ChevronUp,
  Flag,
  Scale,
  BookOpen
} from 'lucide-react';

// Australian State Regulations
const stateRegulations = {
  westernAustralia: {
    name: 'Western Australia',
    code: 'WA',
    status: 'regulated',
    regulatedClasses: ['Class 3B', 'Class 4'],
    purposeScope: 'All purposes - regardless of use',
    licensing: 'Required for regulated classes',
    authority: 'Radiological Council of Western Australia',
    keyPoints: [
      'Only state regulating all purposes (not just medical/cosmetic)',
      'Class 4 lasers commonly used for skin pigmentation and hair removal',
      'Beauty therapists can use less powerful lasers legally',
      'Licensing system for possession and use'
    ],
    color: 'bg-red-100 text-red-800'
  },
  queensland: {
    name: 'Queensland',
    code: 'QLD',
    status: 'regulated',
    regulatedClasses: ['Class 3B', 'Class 4', 'IPLs'],
    purposeScope: 'Medical, cosmetic, therapeutic',
    licensing: 'License required under Radiation Safety Act',
    authority: 'Queensland Health',
    keyPoints: [
      'Governed by Radiation Safety Act 1999 and Regulations 1999',
      'Businesses must submit laser details to Queensland Health',
      'Radiation Safety and Protection Plan required',
      'Specific guidelines for diagnostic, therapeutic, and cosmetic practices'
    ],
    color: 'bg-amber-100 text-amber-800'
  },
  tasmania: {
    name: 'Tasmania',
    code: 'TAS',
    status: 'regulated',
    regulatedClasses: ['Class 3B', 'Class 4', 'IPLs'],
    purposeScope: 'Medical (cosmetic pending)',
    licensing: 'License required for medical use',
    authority: 'Tasmanian Government',
    keyPoints: [
      'Radiation Protection Act 2005 and 2006',
      'License required for Class 3B/4 lasers and IPLs for medical use',
      'Cosmetic procedures may soon require same licensing',
      'Currently implementing expanded regulations'
    ],
    color: 'bg-green-100 text-green-800'
  },
  otherStates: {
    name: 'Other States (NSW, VIC, SA, NT, ACT)',
    code: 'OTHER',
    status: 'unregulated-specific',
    regulatedClasses: ['Varies'],
    purposeScope: 'Limited or no specific regulation',
    licensing: 'Not specifically required for laser shows',
    authority: 'WorkSafe / SafeWork',
    keyPoints: [
      'No specific laser regulations for entertainment/shows',
      'General workplace safety laws apply',
      'AS/NZS standards provide guidance',
      'May require notification for high-power devices'
    ],
    color: 'bg-blue-100 text-blue-800'
  }
};

// Federal guidance
const federalGuidance = {
  arpansa: {
    name: 'ARPANSA',
    fullName: 'Australian Radiation Protection and Nuclear Safety Agency',
    role: 'Federal guidance on non-ionizing radiation including lasers',
    website: 'www.arpansa.gov.au',
    resources: [
      'Laser safety fact sheets',
      'Radiation protection guidelines',
      'Non-ionizing radiation information',
      'Public health advice'
    ]
  },
  safework: {
    name: 'Safe Work Australia',
    role: 'National policy body for workplace health and safety',
    resources: [
      'Laser Classification and Potential Hazards document',
      'Model Work Health and Safety Act',
      'Codes of Practice',
      'National guidance material'
    ]
  }
};

// Standards
const australianStandards = {
  asnzs4173: {
    number: 'AS/NZS 4173:2004',
    title: 'Safe use of lasers in health care',
    status: 'Recognized standard - NOT legally binding',
    scope: 'Healthcare laser applications',
    trainingRequirement: 'All personnel using lasers should have training appropriate to their tasks',
    note: 'Provides guidance but is not law or regulation'
  },
  asnzs2211: {
    number: 'AS/NZS 2211',
    title: 'Laser safety series',
    parts: [
      'Part 1: Equipment classification, requirements and user\'s guide',
      'Part 4: Laser displays and exhibitions',
      'Part 9: Medical laser installations'
    ],
    relevance: 'Laser show productions should reference Part 4'
  }
};

// New Zealand
const newZealandInfo = {
  authority: 'Environmental Protection Authority (EPA)',
    regulations: 'HSNO Act (Hazardous Substances and New Organisms)',
    status: 'No specific laser entertainment regulations identified',
    applicability: 'Laser pointers have restrictions; laser shows generally unregulated at federal level',
    guidance: 'Follow AS/NZS standards and general health and safety principles'
};

const StateCard: React.FC<{ stateKey: string; data: typeof stateRegulations[keyof typeof stateRegulations] }> = ({ stateKey, data }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg ${data.color.split(' ')[0]}`}>
              <MapPin className={`w-6 h-6 ${data.color.split(' ')[1]}`} />
            </div>
            <div>
              <h4 className="font-semibold text-foreground">{data.name}</h4>
              <span className={`inline-block px-2 py-0.5 rounded text-xs mt-1 ${data.color}`}>
                {data.status === 'regulated' ? 'Regulated' : 'Limited Regulation'}
              </span>
            </div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
        
        <div className="mt-2 text-sm text-gray-600">
          <p><span className="font-medium">Regulated Classes:</span> {data.regulatedClasses.join(', ')}</p>
          <p><span className="font-medium">Authority:</span> {data.authority}</p>
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="pt-3 space-y-2">
            <p className="text-sm"><span className="font-medium">Purpose Scope:</span> {data.purposeScope}</p>
            <p className="text-sm"><span className="font-medium">Licensing:</span> {data.licensing}</p>
            
            <div>
              <p className="font-medium text-sm mb-1">Key Points:</p>
              <ul className="space-y-1">
                {data.keyPoints.map((point, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const StandardCard: React.FC<{ standard: typeof australianStandards[keyof typeof australianStandards]; id: string }> = ({ standard, id }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-foreground">{standard.number}</h4>
            <p className="text-sm text-gray-600">{standard.title}</p>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="pt-3 space-y-2 text-sm">
            {'status' in standard && (
              <p><span className="font-medium">Status:</span> {standard.status}</p>
            )}
            {'scope' in standard && (
              <p><span className="font-medium">Scope:</span> {standard.scope}</p>
            )}
            {'trainingRequirement' in standard && (
              <p><span className="font-medium">Training:</span> {standard.trainingRequirement}</p>
            )}
            {'parts' in standard && (
              <div>
                <p className="font-medium">Parts:</p>
                <ul className="ml-4 space-y-1">
                  {standard.parts.map((part, idx) => (
                    <li key={idx} className="text-gray-600">• {part}</li>
                  ))}
                </ul>
              </div>
            )}
            {'note' in standard && (
              <p className="text-amber-700 bg-amber-50 p-2 rounded">{standard.note}</p>
            )}
            {'relevance' in standard && (
              <p className="text-blue-700 bg-blue-50 p-2 rounded">{standard.relevance}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const ComplianceCalculator: React.FC = () => {
  const [selectedState, setSelectedState] = useState('');
  const [laserClass, setLaserClass] = useState('');
  const [purpose, setPurpose] = useState('');
  const [result, setResult] = useState<any>(null);

  const calculateRequirements = () => {
    let requirements = [];
    let warnings = [];
    let permit = false;

    // State-specific logic
    if (selectedState === 'wa') {
      if (['3b', '4'].includes(laserClass)) {
        permit = true;
        requirements.push('Radiological Council license required');
        requirements.push('Apply to Radiological Council of WA');
      }
    } else if (selectedState === 'qld') {
      if (['3b', '4'].includes(laserClass) && ['medical', 'cosmetic', 'therapeutic'].includes(purpose)) {
        permit = true;
        requirements.push('Queensland Health license required');
        requirements.push('Radiation Safety and Protection Plan required');
        requirements.push('Submit laser details to Queensland Health');
      }
    } else if (selectedState === 'tas') {
      if (['3b', '4'].includes(laserClass) && purpose === 'medical') {
        permit = true;
        requirements.push('Tasmanian license required for medical use');
      }
      if (purpose === 'cosmetic') {
        warnings.push('Cosmetic licensing may be implemented soon');
      }
    }

    // General requirements
    if (laserClass === '4' || laserClass === '3b') {
      requirements.push('Follow AS/NZS safety standards');
      requirements.push('Appropriate training for operators');
      requirements.push('Risk assessment recommended');
    }

    if (!permit && requirements.length === 0) {
      requirements.push('No specific state license required');
      requirements.push('Follow general workplace safety laws');
      requirements.push('Adhere to AS/NZS standards as best practice');
    }

    setResult({ permit, requirements, warnings });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <ClipboardCheck className="w-6 h-6 text-yellow-600" />
        Australia Compliance Calculator
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">State/Territory</label>
            <select 
              className="w-full p-2 border rounded"
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
            >
              <option value="">Select state...</option>
              <option value="wa">Western Australia</option>
              <option value="qld">Queensland</option>
              <option value="tas">Tasmania</option>
              <option value="nsw">New South Wales</option>
              <option value="vic">Victoria</option>
              <option value="sa">South Australia</option>
              <option value="nt">Northern Territory</option>
              <option value="act">Australian Capital Territory</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Laser Class</label>
            <select 
              className="w-full p-2 border rounded"
              value={laserClass}
              onChange={(e) => setLaserClass(e.target.value)}
            >
              <option value="">Select class...</option>
              <option value="1">Class 1 / 1M</option>
              <option value="2">Class 2 / 2M</option>
              <option value="3r">Class 3R</option>
              <option value="3b">Class 3B</option>
              <option value="4">Class 4</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Purpose of Use</label>
            <select 
              className="w-full p-2 border rounded"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
            >
              <option value="">Select purpose...</option>
              <option value="entertainment">Entertainment/Shows</option>
              <option value="medical">Medical</option>
              <option value="cosmetic">Cosmetic</option>
              <option value="industrial">Industrial</option>
              <option value="research">Research</option>
            </select>
          </div>

          <button
            onClick={calculateRequirements}
            className="w-full py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors"
          >
            Calculate Requirements
          </button>
        </div>

        <div>
          {result ? (
            <div className="space-y-4">
              {result.permit ? (
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <h4 className="font-bold text-amber-900">⚠ License Required</h4>
                  <p className="text-sm text-amber-800 mt-1">
                    You need a license from the state authority for this laser class and purpose.
                  </p>
                </div>
              ) : (
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <h4 className="font-bold text-green-900">✓ No Specific License Required</h4>
                  <p className="text-sm text-green-800 mt-1">
                    No state-specific laser license required for this combination.
                  </p>
                </div>
              )}

              {result.warnings.length > 0 && (
                <div className="p-3 bg-yellow-50 rounded border border-yellow-200">
                  <p className="font-medium text-yellow-900 text-sm">Note:</p>
                  <ul className="mt-1 space-y-1">
                    {result.warnings.map((w: string, idx: number) => (
                      <li key={idx} className="text-sm text-yellow-800">{w}</li>
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

export const Module4_Australia_NZ: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'states' | 'standards' | 'nz' | 'calculator'>('overview');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-yellow-600 to-yellow-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Module 5.4: Australia & New Zealand Regulations</h1>
        </div>
        <p className="text-yellow-100">
          Understanding AS/NZS 2211 and 4173 standards, ARPANSA federal guidance, 
          state-specific regulations in Australia, and NZ EPA requirements.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'states', label: 'State Regulations', icon: MapPin },
          { id: 'standards', label: 'AS/NZS Standards', icon: BookOpen },
          { id: 'nz', label: 'New Zealand', icon: Flag },
          { id: 'calculator', label: 'Compliance Calculator', icon: ClipboardCheck }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-yellow-600 border-b-2 border-yellow-600' 
                : 'text-gray-600 hover:text-yellow-500'
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
                <h3 className="font-semibold text-blue-900">Australian Regulatory Framework</h3>
                <p className="text-blue-800 text-sm mt-1">
                  Australia has a decentralized regulatory approach. Only Western Australia, Queensland, 
                  and Tasmania have specific laser regulations. Other states rely on general workplace 
                  safety laws. ARPANSA provides federal guidance, and AS/NZS standards offer best practice 
                  guidance (though not legally binding).
                </p>
              </div>
            </div>
          </div>

          {/* Map Overview */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-yellow-600" />
              Australian Regulatory Map
            </h2>
            
            <div className="relative bg-blue-50 rounded-lg overflow-hidden" style={{ height: '400px' }}>
              <svg viewBox="0 0 800 600" className="w-full h-full">
                {/* Simplified Australia map */}
                <defs>
                  <pattern id="ausGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#ausGrid)" />
                
                {/* Western Australia - Regulated */}
                <path 
                  d="M100,100 L300,100 L320,300 L250,450 L100,400 Z" 
                  fill="#fee2e2" 
                  stroke="#dc2626" 
                  strokeWidth="2"
                />
                <text x="180" y="250" className="text-xs font-bold" fill="#991b1b">WA</text>
                <text x="160" y="270" className="text-xs" fill="#991b1b">Regulated</text>
                
                {/* Northern Territory */}
                <path 
                  d="M300,100 L450,100 L420,250 L320,300 Z" 
                  fill="#dbeafe" 
                  stroke="#2563eb" 
                  strokeWidth="2"
                />
                <text x="360" y="180" className="text-xs font-bold" fill="#1e40af">NT</text>
                
                {/* South Australia */}
                <path 
                  d="M320,300 L420,250 L450,400 L350,450 L250,450 Z" 
                  fill="#dbeafe" 
                  stroke="#2563eb" 
                  strokeWidth="2"
                />
                <text x="350" y="350" className="text-xs font-bold" fill="#1e40af">SA</text>
                
                {/* Queensland - Regulated */}
                <path 
                  d="M450,100 L650,100 L600,300 L480,280 L420,250 Z" 
                  fill="#fef3c7" 
                  stroke="#d97706" 
                  strokeWidth="2"
                />
                <text x="530" y="180" className="text-xs font-bold" fill="#92400e">QLD</text>
                <text x="510" y="200" className="text-xs" fill="#92400e">Regulated</text>
                
                {/* New South Wales */}
                <path 
                  d="M480,280 L600,300 L580,400 L500,420 L450,400 L420,250 Z" 
                  fill="#dbeafe" 
                  stroke="#2563eb" 
                  strokeWidth="2"
                />
                <text x="510" y="340" className="text-xs font-bold" fill="#1e40af">NSW</text>
                
                {/* Victoria */}
                <path 
                  d="M450,400 L500,420 L520,480 L480,500 L430,450 Z" 
                  fill="#dbeafe" 
                  stroke="#2563eb" 
                  strokeWidth="2"
                />
                <text x="460" y="450" className="text-xs font-bold" fill="#1e40af">VIC</text>
                
                {/* Tasmania - Regulated */}
                <path 
                  d="M500,520 L560,510 L570,550 L510,560 Z" 
                  fill="#dcfce7" 
                  stroke="#16a34a" 
                  strokeWidth="2"
                />
                <text x="525" y="540" className="text-xs font-bold" fill="#166534">TAS</text>
                <text x="515" y="555" className="text-xs" fill="#166534">Regulated</text>
                
                {/* ACT */}
                <circle cx="530" cy="410" r="8" fill="#dbeafe" stroke="#2563eb" strokeWidth="2" />
                <text x="545" y="415" className="text-xs font-bold" fill="#1e40ab">ACT</text>
              </svg>
              
              {/* Legend */}
              <div className="absolute bottom-4 right-4 bg-card p-3 rounded shadow text-sm">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-red-200 border border-red-600 rounded"></div>
                  <span>Regulated (WA, QLD)</span>
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-4 h-4 bg-green-200 border border-green-600 rounded"></div>
                  <span>Regulated (TAS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 bg-blue-200 border border-blue-600 rounded"></div>
                  <span>Limited/No Specific Regs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Federal Guidance */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-yellow-600" />
                {federalGuidance.arpansa.name}
              </h3>
              <p className="text-sm text-gray-600 mb-2">{federalGuidance.arpansa.fullName}</p>
              <p className="text-sm text-gray-600 mb-3">{federalGuidance.arpansa.role}</p>
              <p className="text-sm font-medium">Resources:</p>
              <ul className="mt-1 space-y-1">
                {federalGuidance.arpansa.resources.map((r, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-card p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                <Building className="w-5 h-5 text-yellow-600" />
                {federalGuidance.safework.name}
              </h3>
              <p className="text-sm text-gray-600 mb-3">{federalGuidance.safework.role}</p>
              <p className="text-sm font-medium">Resources:</p>
              <ul className="mt-1 space-y-1">
                {federalGuidance.safework.resources.map((r, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'states' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-yellow-600" />
              State-Specific Regulations
            </h2>
            <p className="text-gray-600 mb-4">
              Click each state card to expand details about their laser regulations. 
              Only Western Australia, Queensland, and Tasmania have specific laser regulations.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {Object.entries(stateRegulations).map(([key, data]) => (
                <StateCard key={key} stateKey={key} data={data} />
              ))}
            </div>
          </div>

          {/* Regulatory Summary Table */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Regulatory Summary by State</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-3 text-left font-semibold">State</th>
                    <th className="p-3 text-left font-semibold">Regulated Classes</th>
                    <th className="p-3 text-left font-semibold">License Required</th>
                    <th className="p-3 text-left font-semibold">Authority</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(stateRegulations).map(([key, data]) => (
                    <tr key={key} className="border-b hover:bg-gray-50">
                      <td className="p-3 font-medium">{data.name}</td>
                      <td className="p-3">{data.regulatedClasses.join(', ')}</td>
                      <td className="p-3">
                        {data.status === 'regulated' ? (
                          <span className="px-2 py-1 bg-red-100 text-red-800 rounded text-xs">Yes</span>
                        ) : (
                          <span className="px-2 py-1 bg-muted text-foreground rounded text-xs">No</span>
                        )}
                      </td>
                      <td className="p-3">{data.authority}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'standards' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-yellow-600" />
              Australian/New Zealand Standards
            </h2>
            <div className="space-y-4">
              {Object.entries(australianStandards).map(([key, standard]) => (
                <StandardCard key={key} id={key} standard={standard} />
              ))}
            </div>
          </div>

          {/* Important Note */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900">Standard vs. Law Distinction</h3>
                <p className="text-amber-800 text-sm mt-1">
                  AS/NZS 4173:2004 is a recognized standard but is NOT law or regulation. 
                  It provides guidance that personnel should have appropriate training, 
                  but compliance is voluntary unless specifically referenced by legislation 
                  (as in some state regulations).
                </p>
              </div>
            </div>
          </div>

          {/* Training Requirements */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-yellow-600" />
              Training Requirements
            </h3>
            <p className="text-gray-600 mb-4">
              While not always legally mandated, the following training is recommended 
              for laser operators in Australia:
            </p>
            <ul className="space-y-2">
              {[
                'Laser safety fundamentals',
                'MPE and exposure calculations',
                'Laser classification understanding',
                'State-specific regulatory requirements',
                'Emergency procedures',
                'Practical hazard assessment'
              ].map((item, idx) => (
                <li key={idx} className="flex items-start gap-2 text-sm">
                  <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'nz' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <Flag className="w-6 h-6 text-yellow-600" />
              New Zealand Regulations
            </h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3">Regulatory Authority</h3>
                <div className="p-4 bg-gray-50 rounded">
                  <p className="font-medium">{newZealandInfo.authority}</p>
                  <p className="text-sm text-gray-600 mt-1">{newZealandInfo.regulations}</p>
                </div>
                
                <h3 className="font-semibold text-lg mb-3 mt-6">Status</h3>
                <p className="text-gray-600">{newZealandInfo.status}</p>
                <p className="text-gray-600 mt-2">{newZealandInfo.applicability}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-lg mb-3">Guidance</h3>
                <div className="p-4 bg-blue-50 rounded border border-blue-200">
                  <p className="text-blue-800">{newZealandInfo.guidance}</p>
                </div>
                
                <h3 className="font-semibold text-lg mb-3 mt-6">Key Points</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Laser pointers have import and sale restrictions
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Laser shows generally not specifically regulated
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Follow AS/NZS standards as best practice
                  </li>
                  <li className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    General health and safety laws apply
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Australia NZ Comparison */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-yellow-600" />
              Australia vs New Zealand Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-3 text-left font-semibold">Aspect</th>
                    <th className="p-3 text-left font-semibold">Australia</th>
                    <th className="p-3 text-left font-semibold">New Zealand</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Federal Authority</td>
                    <td className="p-3">ARPANSA</td>
                    <td className="p-3">EPA</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">State/Regional Laws</td>
                    <td className="p-3">Yes (WA, QLD, TAS)</td>
                    <td className="p-3">No specific laser entertainment laws</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Standards</td>
                    <td className="p-3">AS/NZS 4173, 2211</td>
                    <td className="p-3">AS/NZS 4173, 2211</td>
                  </tr>
                  <tr className="border-b">
                    <td className="p-3 font-medium">Laser Pointer Restrictions</td>
                    <td className="p-3">Varies by state</td>
                    <td className="p-3">Yes - import/sale restrictions</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-medium">Show Permits</td>
                    <td className="p-3">Generally not required (except regulated states)</td>
                    <td className="p-3">Generally not required</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'calculator' && (
        <div className="space-y-6">
          <ComplianceCalculator />
          
          {/* Documentation Checklist */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-yellow-600" />
              Documentation Checklist
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium text-sm mb-2">For Regulated States:</h4>
                <ul className="space-y-1">
                  {['State license/permit', 'Radiation Safety Plan (QLD)', 'Equipment specifications', 'Operator qualifications'].map((item, idx) => (
                    <li key={idx} className="text-sm flex items-center gap-2">
                      <input type="checkbox" className="w-4 h-4" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-2">Best Practice (All States):</h4>
                <ul className="space-y-1">
                  {['Risk assessment', 'MPE calculations', 'Safety procedures', 'Emergency protocols'].map((item, idx) => (
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

export default Module4_Australia_NZ;
