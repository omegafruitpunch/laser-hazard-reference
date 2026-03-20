'use client';

import { useState } from 'react';
import { Calculator, Globe, Clock, AlertTriangle, CheckCircle, FileText, DollarSign, Users } from 'lucide-react';

interface CountryPermit {
  country: string;
  category: string;
  permits: PermitRequirement[];
  notes: string;
}

interface PermitRequirement {
  name: string;
  required: boolean;
  leadTime: string;
  cost: string;
  documents: string[];
}

const countryPermits: CountryPermit[] = [
  {
    country: 'United States',
    category: 'F',
    permits: [
      { name: 'FDA Variance', required: true, leadTime: '60-90 days', cost: '$1,500-3,000', documents: ['Show description', 'Safety plan', 'LSO qualifications', 'Equipment specs'] },
      { name: 'State Laser Permit', required: true, leadTime: '30-60 days', cost: '$200-1,000', documents: ['FDA variance', 'Venue approval', 'Insurance cert'] }
    ],
    notes: 'Requirements vary significantly by state. Nevada and California have the most stringent requirements.'
  },
  {
    country: 'Germany',
    category: 'F',
    permits: [
      { name: 'Lasershow Genehmigung', required: true, leadTime: '4-8 weeks', cost: '€500-2,000', documents: ['Technical documentation', 'Safety concept', 'MPE calculations'] },
      { name: 'TÜV Inspection (if required)', required: false, leadTime: '2-4 weeks', cost: '€1,000-3,000', documents: ['Equipment inspection', 'Electrical safety'] }
    ],
    notes: 'Each Bundesland (state) may have additional requirements. Berlin and Bavaria are particularly strict.'
  },
  {
    country: 'United Kingdom',
    category: 'F',
    permits: [
      { name: 'Local Authority Notification', required: true, leadTime: '14-28 days', cost: '£200-500', documents: ['Risk assessment', 'Safety plan', 'LSO certificate'] }
    ],
    notes: 'Requirements vary by local authority. London venues often require additional fire safety consultation.'
  },
  {
    country: 'Australia',
    category: 'F',
    permits: [
      { name: 'State Radiation License', required: true, leadTime: '4-6 weeks', cost: 'AUD $500-1,500', documents: ['Equipment registration', 'LSO qualifications', 'Safety procedures'] },
      { name: 'WorkSafe Notification', required: true, leadTime: '14 days', cost: 'No fee', documents: ['Workplace safety plan'] }
    ],
    notes: 'Each state/territory has separate requirements. NSW and Victoria have the most complex processes.'
  },
  {
    country: 'Canada',
    category: 'B',
    permits: [
      { name: 'Health Canada Notification', required: true, leadTime: '2-4 weeks', cost: 'CAD $300-800', documents: ['Equipment details', 'Show description'] }
    ],
    notes: 'Provincial requirements vary. Ontario and Quebec may have additional workplace safety requirements.'
  },
  {
    country: 'Japan',
    category: 'B',
    permits: [
      { name: 'Laser Equipment Import Permit', required: true, leadTime: '3-4 weeks', cost: '¥50,000-100,000', documents: ['Equipment specifications', 'Safety documentation'] },
      { name: 'Fire Department Notification', required: true, leadTime: '1-2 weeks', cost: 'No fee', documents: ['Venue layout', 'Safety plan'] }
    ],
    notes: 'Documentation should include Japanese translations. Local partner highly recommended.'
  },
  {
    country: 'United Arab Emirates',
    category: 'G',
    permits: [
      { name: 'TRA Equipment Approval', required: true, leadTime: '6-10 weeks', cost: 'AED 5,000-15,000', documents: ['Technical specs', 'Test reports', 'Company registration'] },
      { name: 'Civil Defense Approval', required: true, leadTime: '2-4 weeks', cost: 'AED 2,000-5,000', documents: ['Safety plan', 'Venue approval'] },
      { name: 'Event Permit', required: true, leadTime: '2-4 weeks', cost: 'AED 3,000-10,000', documents: ['Event details', 'Insurance', 'LSO qualifications'] }
    ],
    notes: 'Requirements vary by emirate. Dubai has the most streamlined process; other emirates may be more complex.'
  },
  {
    country: 'China',
    category: 'G',
    permits: [
      { name: 'Import License', required: true, leadTime: '8-12 weeks', cost: '$2,000-5,000', documents: ['Contract', 'Invoice', 'Packing list', 'Technical specs'] },
      { name: 'Ministry of Culture Approval', required: true, leadTime: '4-8 weeks', cost: '¥10,000-30,000', documents: ['Performance content', 'Crew passports', 'Company license'] },
      { name: 'Local Public Security', required: true, leadTime: '2-4 weeks', cost: '¥5,000-15,000', documents: ['Safety assessment', 'Venue approval'] }
    ],
    notes: 'Process is complex and requires local partnership. Start permits minimum 3 months in advance.'
  },
  {
    country: 'Mexico',
    category: 'A',
    permits: [
      { name: 'Event Permit (Ayuntamiento)', required: false, leadTime: '2-4 weeks', cost: 'MXN $5,000-15,000', documents: ['Venue contract', 'Event details'] }
    ],
    notes: 'Generally minimal laser-specific regulation. Focus on venue and local event permits.'
  },
  {
    country: 'Singapore',
    category: 'G',
    permits: [
      { name: 'NEA Radiation License', required: true, leadTime: '4-6 weeks', cost: 'SGD $500-1,500', documents: ['Equipment details', 'LSO qualifications', 'Safety plan'] },
      { name: 'Police Event Permit', required: true, leadTime: '2-4 weeks', cost: 'SGD $100-500', documents: ['Event proposal', 'Crowd management plan'] }
    ],
    notes: 'Singapore has strict enforcement. All documentation must be complete and accurate.'
  }
];

const categoryInfo: Record<string, { name: string; color: string; description: string; typicalTimeline: string }> = {
  'A': { name: 'Minimal Regulation', color: 'bg-green-500', description: 'Few specific laser regulations', typicalTimeline: '2-4 weeks' },
  'B': { name: 'Notification System', color: 'bg-blue-500', description: 'Notification required, simpler approval', typicalTimeline: '4-6 weeks' },
  'F': { name: 'Full Regulatory', color: 'bg-amber-500', description: 'Comprehensive permit system', typicalTimeline: '6-10 weeks' },
  'G': { name: 'Government Controlled', color: 'bg-red-500', description: 'State-controlled, complex process', typicalTimeline: '10-16 weeks' },
  'X': { name: 'Restricted/Prohibited', color: 'bg-purple-600', description: 'Significant restrictions', typicalTimeline: '16+ weeks' }
};

export default function PermitCalculator() {
  const [selectedCountry, setSelectedCountry] = useState<CountryPermit | null>(null);
  const [showCategory, setShowCategory] = useState<string>('F');
  const [showPlanner, setShowPlanner] = useState(false);
  const [showSize, setShowSize] = useState<'small' | 'medium' | 'large'>('medium');

  const filteredCountries = countryPermits.filter(c => c.category === showCategory);

  const getTotalCost = (country: CountryPermit) => {
    // Extract numeric values and sum (simplified)
    return 'See details below';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-rose-700 to-pink-600 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <Calculator className="w-8 h-8" />
          <h2 className="text-2xl font-bold">Permit Requirement Calculator</h2>
        </div>
        <p className="text-white/80">
          Calculate permit requirements, timelines, and costs for international laser shows.
          Select a destination country category to explore requirements.
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h3 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
          <Globe className="w-4 h-4" />
          Filter by Category
        </h3>
        <div className="flex flex-wrap gap-3">
          {Object.entries(categoryInfo).map(([cat, info]) => (
            <button
              key={cat}
              onClick={() => { setShowCategory(cat); setSelectedCountry(null); }}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl border-2 transition-all ${
                showCategory === cat
                  ? 'border-pink-500 bg-pink-900/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <div className={`w-8 h-8 rounded-full ${info.color} flex items-center justify-center text-white font-bold`}>
                {cat}
              </div>
              <div className="text-left">
                <p className="text-white font-medium text-sm">{info.name}</p>
                <p className="text-gray-400 text-xs">{info.typicalTimeline}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Show Size Selector */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h3 className="text-gray-300 font-semibold mb-4 flex items-center gap-2">
          <Users className="w-4 h-4" />
          Show Size
        </h3>
        <div className="flex gap-3">
          {[
            { id: 'small', label: 'Small', desc: '< 500 people' },
            { id: 'medium', label: 'Medium', desc: '500-5,000 people' },
            { id: 'large', label: 'Large', desc: '> 5,000 people' }
          ].map((size) => (
            <button
              key={size.id}
              onClick={() => setShowSize(size.id as any)}
              className={`flex-1 p-3 rounded-lg border transition-all ${
                showSize === size.id
                  ? 'border-pink-500 bg-pink-900/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <p className="text-white font-medium">{size.label}</p>
              <p className="text-gray-400 text-xs">{size.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Country Selection */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <h3 className="text-gray-300 font-semibold mb-4">
          Select Country ({filteredCountries.length} available)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {filteredCountries.map((country) => (
            <button
              key={country.country}
              onClick={() => setSelectedCountry(country)}
              className={`p-4 rounded-lg border text-left transition-all ${
                selectedCountry?.country === country.country
                  ? 'border-pink-500 bg-pink-900/20'
                  : 'border-gray-700 bg-gray-800 hover:border-gray-500'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-white font-medium">{country.country}</span>
                <div className={`w-6 h-6 rounded-full ${categoryInfo[country.category].color} flex items-center justify-center text-white text-xs font-bold`}>
                  {country.category}
                </div>
              </div>
              <p className="text-gray-400 text-sm mt-1">{country.permits.length} permit(s) required</p>
            </button>
          ))}
        </div>
      </div>

      {/* Selected Country Details */}
      {selectedCountry && (
        <div className="bg-gradient-to-br from-pink-900/20 to-rose-900/20 border border-pink-700/50 rounded-xl p-6 animate-in fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <Globe className="w-5 h-5 text-pink-400" />
              {selectedCountry.country}
            </h3>
            <span className={`px-3 py-1 rounded-full text-sm text-white ${categoryInfo[selectedCountry.category].color}`}>
              Category {selectedCountry.category}
            </span>
          </div>

          <p className="text-gray-300 mb-6">{selectedCountry.notes}</p>

          {/* Permits Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left py-2 px-3 text-gray-300">Permit</th>
                  <th className="text-left py-2 px-3 text-gray-300">Required</th>
                  <th className="text-left py-2 px-3 text-gray-300">Lead Time</th>
                  <th className="text-left py-2 px-3 text-gray-300">Est. Cost</th>
                  <th className="text-left py-2 px-3 text-gray-300">Key Documents</th>
                </tr>
              </thead>
              <tbody>
                {selectedCountry.permits.map((permit, idx) => (
                  <tr key={idx} className="border-b border-gray-800">
                    <td className="py-3 px-3 text-white font-medium">{permit.name}</td>
                    <td className="py-3 px-3">
                      {permit.required ? (
                        <span className="flex items-center gap-1 text-red-400">
                          <AlertTriangle className="w-4 h-4" />
                          Required
                        </span>
                      ) : (
                        <span className="text-gray-400">Optional</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      <span className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {permit.leadTime}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-gray-300">
                      <span className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        {permit.cost}
                      </span>
                    </td>
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1">
                        {permit.documents.map((doc, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-800 text-gray-400 rounded text-xs">
                            {doc}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Action Items */}
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg">
            <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-400" />
              Recommended Actions
            </h4>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-pink-400">1.</span>
                Contact local regulatory authority for current requirements
              </li>
              <li className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-pink-400">2.</span>
                Begin permit applications at least {categoryInfo[showCategory].typicalTimeline} before show
              </li>
              <li className="flex items-start gap-2 text-gray-300 text-sm">
                <span className="text-pink-400">3.</span>
                Engage local consultant familiar with {selectedCountry.country} regulations
              </li>
              {showSize === 'large' && (
                <li className="flex items-start gap-2 text-gray-300 text-sm">
                  <span className="text-pink-400">4.</span>
                  Large shows may require additional security and crowd safety permits
                </li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Timeline Planner */}
      <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
        <button
          onClick={() => setShowPlanner(!showPlanner)}
          className="w-full flex items-center justify-between"
        >
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5" />
            General Timeline Guidelines
          </h3>
          <span className="text-gray-400">{showPlanner ? '▲' : '▼'}</span>
        </button>

        {showPlanner && (
          <div className="mt-6 space-y-4">
            {Object.entries(categoryInfo).map(([cat, info]) => (
              <div key={cat} className="bg-gray-800 rounded-lg p-4">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-8 h-8 rounded-full ${info.color} flex items-center justify-center text-white font-bold`}>
                    {cat}
                  </div>
                  <div>
                    <p className="text-white font-semibold">Category {cat}: {info.name}</p>
                    <p className="text-gray-400 text-sm">{info.description}</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Minimum Lead Time:</span>
                    <p className="text-white font-medium">{info.typicalTimeline}</p>
                  </div>
                  <div>
                    <span className="text-gray-500">Recommended Start:</span>
                    <p className="text-white font-medium">
                      {cat === 'A' ? '4-6 weeks before' :
                       cat === 'B' ? '8-10 weeks before' :
                       cat === 'F' ? '12-16 weeks before' :
                       cat === 'G' ? '16-24 weeks before' : '24+ weeks before'}
                    </p>
                  </div>
                  <div>
                    <span className="text-gray-500">Local Consultant:</span>
                    <p className="text-white font-medium">
                      {cat === 'A' || cat === 'B' ? 'Recommended' : 'Strongly Recommended'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
