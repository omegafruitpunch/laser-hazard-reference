'use client';

import { useState } from 'react';
import { Globe, AlertTriangle, CheckCircle, Info, MapPin, Shield } from 'lucide-react';

interface CountryCategory {
  code: string;
  name: string;
  description: string;
  permitRequired: boolean;
  notificationRequired: boolean;
  lsoRequired: boolean;
  complexity: 'Low' | 'Medium' | 'High' | 'Very High';
  color: string;
  countries: string[];
  requirements: string[];
}

const countryCategories: CountryCategory[] = [
  {
    code: 'A',
    name: 'Category A - Minimal Regulation',
    description: 'Countries with minimal or no specific laser display regulations',
    permitRequired: false,
    notificationRequired: false,
    lsoRequired: false,
    complexity: 'Low',
    color: 'bg-green-500',
    countries: ['Mexico', 'Most Caribbean nations', 'Some Middle Eastern countries', 'Parts of Southeast Asia'],
    requirements: [
      'No specific laser show permits required',
      'General electrical safety compliance',
      'Venue/ event permits may still apply',
      'Recommended: Follow IEC 60825-3 guidelines'
    ]
  },
  {
    code: 'B',
    name: 'Category B - Notification System',
    description: 'Countries requiring notification but not formal approval',
    permitRequired: false,
    notificationRequired: true,
    lsoRequired: false,
    complexity: 'Medium',
    color: 'bg-blue-500',
    countries: ['Canada (most provinces)', 'Japan', 'South Korea', 'Switzerland', 'Norway'],
    requirements: [
      'Advance notification to regulatory authority',
      'Show documentation submission',
      'May require local laser safety officer present',
      'Compliance with local standards required'
    ]
  },
  {
    code: 'F',
    name: 'Category F - Full Regulatory System',
    description: 'Countries with comprehensive laser display regulations',
    permitRequired: true,
    notificationRequired: true,
    lsoRequired: true,
    complexity: 'High',
    color: 'bg-amber-500',
    countries: ['USA', 'Germany', 'France', 'UK', 'Australia', 'Netherlands', 'Belgium'],
    requirements: [
      'Formal permit application required',
      'Demonstration of compliance with safety standards',
      'Qualified LSO must be present during show',
      'Equipment inspection may be required',
      'Insurance requirements typically specified'
    ]
  },
  {
    code: 'G',
    name: 'Category G - Government Controlled',
    description: 'Countries with state-controlled or restricted laser use',
    permitRequired: true,
    notificationRequired: true,
    lsoRequired: true,
    complexity: 'Very High',
    color: 'bg-red-500',
    countries: ['China', 'Russia', 'Singapore', 'UAE (certain emirates)', 'Qatar'],
    requirements: [
      'Extensive permit application process',
      'Government agency oversight',
      'Equipment import licenses may be required',
      'Local partnerships often necessary',
      'Security clearances sometimes needed',
      'Long lead times for approvals'
    ]
  },
  {
    code: 'X',
    name: 'Category X - Restricted/Prohibited',
    description: 'Countries with significant restrictions or prohibitions on laser shows',
    permitRequired: true,
    notificationRequired: true,
    lsoRequired: true,
    complexity: 'Very High',
    color: 'bg-purple-600',
    countries: ['Saudi Arabia (outdoor restrictions)', 'India (complex state system)', 'Certain African nations'],
    requirements: [
      'Laser shows may be restricted to specific venues',
      'Outdoor shows often prohibited or heavily restricted',
      'Religious or cultural considerations may apply',
      'Special waivers may be required',
      'International shows face additional scrutiny'
    ]
  }
];

const australiaStates = [
  {
    name: 'New South Wales',
    regulator: 'EPA Radiation Control',
    registration: 'Required for Class 3B/4',
    notes: 'Sydney entertainment hub - active enforcement'
  },
  {
    name: 'Victoria',
    regulator: 'Department of Health',
    registration: 'Required for Class 3B/4',
    notes: 'Melbourne venues require compliance documentation'
  },
  {
    name: 'Queensland',
    regulator: 'Radiation Health',
    registration: 'Required for Class 3B/4',
    notes: 'Gold Coast entertainment district focus'
  },
  {
    name: 'Western Australia',
    regulator: 'Radiological Council',
    registration: 'Required for Class 3B/4',
    notes: 'Perth major events coordination'
  },
  {
    name: 'South Australia',
    regulator: 'EPA Radiation Protection',
    registration: 'Required for Class 3B/4',
    notes: 'Adelaide Fringe Festival requirements'
  },
  {
    name: 'Tasmania',
    regulator: 'Department of Health',
    registration: 'Required for Class 3B/4',
    notes: 'Smaller venue network'
  },
  {
    name: 'ACT',
    regulator: 'WorkSafe ACT',
    registration: 'Required for Class 3B/4',
    notes: 'National institutions coordination'
  },
  {
    name: 'Northern Territory',
    regulator: 'Department of Health',
    registration: 'Required for Class 3B/4',
    notes: 'Outdoor show considerations for airspace'
  }
];

export default function CountryClassificationSystem() {
  const [selectedCategory, setSelectedCategory] = useState<CountryCategory | null>(null);
  const [showAustraliaDetail, setShowAustraliaDetail] = useState(false);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-700 to-teal-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Globe className="w-8 h-8" />
          <h2 className="text-2xl font-bold">ILDA Country Classification System</h2>
        </div>
        <p className="text-white/80">
          The International Laser Display Association (ILDA) has developed a classification system 
          to help operators understand regulatory requirements worldwide. Click on a category to learn more.
        </p>
      </div>

      {/* Category Selection Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {countryCategories.map((cat) => (
          <button
            key={cat.code}
            onClick={() => setSelectedCategory(cat)}
            className={`p-4 rounded-xl border-2 transition-all text-left ${
              selectedCategory?.code === cat.code
                ? 'border-white bg-gray-800'
                : 'border-gray-700 bg-gray-900 hover:border-gray-500'
            }`}
          >
            <div className={`w-12 h-12 rounded-full ${cat.color} flex items-center justify-center text-white font-bold text-xl mb-3`}>
              {cat.code}
            </div>
            <p className="text-white font-semibold text-sm">Category {cat.code}</p>
            <p className="text-gray-400 text-xs mt-1">{cat.complexity} Complexity</p>
          </button>
        ))}
      </div>

      {/* Selected Category Details */}
      {selectedCategory && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 animate-in fade-in duration-300">
          <div className="flex items-start gap-4 mb-4">
            <div className={`w-16 h-16 rounded-full ${selectedCategory.color} flex items-center justify-center text-white font-bold text-2xl flex-shrink-0`}>
              {selectedCategory.code}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{selectedCategory.name}</h3>
              <p className="text-gray-400 mt-1">{selectedCategory.description}</p>
            </div>
          </div>

          {/* Requirements Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className={`p-4 rounded-lg ${selectedCategory.permitRequired ? 'bg-red-900/30 border border-red-700' : 'bg-green-900/30 border border-green-700'}`}>
              <div className="flex items-center gap-2 mb-2">
                {selectedCategory.permitRequired ? <AlertTriangle className="w-5 h-5 text-red-400" /> : <CheckCircle className="w-5 h-5 text-green-400" />}
                <span className="font-semibold text-white">Permit Required</span>
              </div>
              <p className="text-sm text-gray-400">
                {selectedCategory.permitRequired ? 'Formal permit application needed' : 'No formal permit required'}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${selectedCategory.notificationRequired ? 'bg-amber-900/30 border border-amber-700' : 'bg-green-900/30 border border-green-700'}`}>
              <div className="flex items-center gap-2 mb-2">
                {selectedCategory.notificationRequired ? <Info className="w-5 h-5 text-amber-400" /> : <CheckCircle className="w-5 h-5 text-green-400" />}
                <span className="font-semibold text-white">Notification</span>
              </div>
              <p className="text-sm text-gray-400">
                {selectedCategory.notificationRequired ? 'Must notify authorities' : 'No notification required'}
              </p>
            </div>
            <div className={`p-4 rounded-lg ${selectedCategory.lsoRequired ? 'bg-blue-900/30 border border-blue-700' : 'bg-gray-800 border border-gray-600'}`}>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-blue-400" />
                <span className="font-semibold text-white">LSO Required</span>
              </div>
              <p className="text-sm text-gray-400">
                {selectedCategory.lsoRequired ? 'Qualified LSO must be present' : 'LSO recommended but not required'}
              </p>
            </div>
          </div>

          {/* Countries & Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                Example Countries
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedCategory.countries.map((country) => (
                  <span key={country} className="px-3 py-1 bg-gray-800 text-gray-300 rounded-full text-sm">
                    {country}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Info className="w-4 h-4" />
                Key Requirements
              </h4>
              <ul className="space-y-2">
                {selectedCategory.requirements.map((req, i) => (
                  <li key={i} className="flex gap-2 text-sm text-gray-400">
                    <span className="text-cyan-400">•</span>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* Australia/NZ Special Section */}
      <div className="bg-gradient-to-r from-yellow-900/30 to-amber-900/30 border border-yellow-700/50 rounded-xl p-6">
        <button
          onClick={() => setShowAustraliaDetail(!showAustraliaDetail)}
          className="w-full flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-yellow-500" />
            <div className="text-left">
              <h3 className="text-lg font-bold text-white">Australia & New Zealand Detail</h3>
              <p className="text-gray-400 text-sm">Both countries fall under Category F with state-level variations</p>
            </div>
          </div>
          <span className="text-yellow-500 text-xl">{showAustraliaDetail ? '▲' : '▼'}</span>
        </button>

        {showAustraliaDetail && (
          <div className="mt-6 space-y-6 animate-in fade-in">
            {/* Australia States Table */}
            <div>
              <h4 className="text-white font-semibold mb-4 flex items-center gap-2">
                <MapPin className="w-4 h-4 text-yellow-500" />
                Australian State/Territory Requirements
              </h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-2 px-3 text-gray-300">State/Territory</th>
                      <th className="text-left py-2 px-3 text-gray-300">Regulator</th>
                      <th className="text-left py-2 px-3 text-gray-300">Registration</th>
                      <th className="text-left py-2 px-3 text-gray-300">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {australiaStates.map((state) => (
                      <tr key={state.name} className="border-b border-gray-800">
                        <td className="py-3 px-3 text-white font-medium">{state.name}</td>
                        <td className="py-3 px-3 text-gray-400">{state.regulator}</td>
                        <td className="py-3 px-3">
                          <span className="px-2 py-1 bg-yellow-900/50 text-yellow-400 rounded text-xs">
                            {state.registration}
                          </span>
                        </td>
                        <td className="py-3 px-3 text-gray-400 text-xs">{state.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* New Zealand Info */}
            <div className="bg-gray-900/50 rounded-lg p-4">
              <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-4 h-4 text-green-500" />
                New Zealand Requirements
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-300 text-sm mb-2"><strong>Regulator:</strong> Environmental Protection Authority (EPA)</p>
                  <p className="text-gray-300 text-sm mb-2"><strong>Legislation:</strong> Radiation Safety Act 2016</p>
                  <p className="text-gray-300 text-sm"><strong>Standard:</strong> AS/NZS 4173 (adopted)</p>
                </div>
                <div className="space-y-2">
                  <p className="text-gray-400 text-sm">Key Requirements:</p>
                  <ul className="text-sm text-gray-300 space-y-1">
                    <li>• Laser operator license required</li>
                    <li>• Source registration mandatory</li>
                    <li>• Safety plans for public shows</li>
                    <li>• Regular compliance inspections</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
