'use client';

import { useState } from 'react';
import { GitCompare, History, AlertCircle, CheckCircle, BookOpen, Globe, ArrowRight } from 'lucide-react';

interface EditionChange {
  category: string;
  edition2: string;
  edition3: string;
  impact: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
}

const editionChanges: EditionChange[] = [
  {
    category: 'Classification',
    edition2: 'Class 1, 2, 3A, 3B, 4',
    edition3: 'Class 1, 1M, 2, 2M, 3R, 3B, 4',
    impact: 'High',
    description: 'Introduction of Class 1M, 2M, and 3R replaces Class 3A. More granular classification based on extended source viewing conditions.'
  },
  {
    category: 'AEL Tables',
    edition2: 'Separate tables for each class',
    edition3: 'Consolidated AEL tables with conditions',
    impact: 'High',
    description: 'Accessible Emission Limits reorganized. Single table structure with conditions simplifies but changes some limit values.'
  },
  {
    category: 'Measurement Conditions',
    edition2: 'Fixed measurement distances',
    edition3: 'Variable measurement conditions',
    impact: 'Medium',
    description: 'Measurement conditions now depend on intended use. Criterion for beam measurement changed from 70mm to 50mm aperture in some cases.'
  },
  {
    category: 'Extended Sources',
    edition2: 'Limited guidance',
    edition3: 'Comprehensive extended source criteria',
    impact: 'High',
    description: 'New requirements for evaluating extended sources. Angular subtense (α) becomes key parameter for classification.'
  },
  {
    category: 'Time Bases',
    edition2: '0.25s, 10s, 100s, 30000s',
    edition3: '0.25s, 100s, 30000s (revised)',
    impact: 'Medium',
    description: 'Removal of 10-second time base for certain wavelengths. Changes affect classification of some CW visible lasers.'
  },
  {
    category: 'MPE Values',
    edition2: '1984 and 1993 values',
    edition3: 'Updated MPE values',
    impact: 'Critical',
    description: 'Some MPE values changed based on new research. Retinal thermal limits modified for certain exposure durations.'
  },
  {
    category: 'Biological Basis',
    edition2: 'Based on ICNIRP 1984, 1993',
    edition3: 'Updated biological data',
    impact: 'Medium',
    description: 'Incorporates more recent ocular damage threshold data. Changes to retinal thermal damage models.'
  },
  {
    category: 'Fiber Optics',
    edition2: 'Basic requirements',
    edition3: 'Enhanced fiber optic guidance',
    impact: 'Medium',
    description: 'More detailed requirements for fiber delivery systems. Connector requirements clarified.'
  },
  {
    category: 'LED Sources',
    edition2: 'Not explicitly covered',
    edition3: 'Explicit LED provisions',
    impact: 'High',
    description: 'High-power LEDs now explicitly addressed. Some LED products may require classification as lasers.'
  },
  {
    category: 'Information Requirements',
    edition2: 'Standard hazard labels',
    edition3: 'Enhanced labeling requirements',
    impact: 'Medium',
    description: 'Additional warning information required. IEC 60417 symbol specifications updated.'
  }
];

const isoStandards = [
  {
    number: 'ISO 11553-1',
    title: 'Laser Processing Machines - Safety',
    description: 'Safety requirements for laser processing machines including cutting, welding, and drilling systems.',
    relationship: 'Complements IEC 60825-1 for industrial applications'
  },
  {
    number: 'ISO 11553-2',
    title: 'Laser Processing Machines - Noise',
    description: 'Noise testing methods and noise reduction for laser processing machines.',
    relationship: 'Addresses non-radiation hazards'
  },
  {
    number: 'ISO 11553-3',
    title: 'Laser Processing Machines - Emissions',
    description: 'Airborne pollutant emissions from laser processing machines.',
    relationship: 'Environmental and health protection'
  },
  {
    number: 'ISO 17526',
    title: 'Ophthalmic Instruments - Laser Coherence',
    description: 'Measurement of coherence length of laser radiation from ophthalmic instruments.',
    relationship: 'Medical device specific standard'
  },
  {
    number: 'ISO 21254',
    title: 'Lasers and Laser-Related Equipment - Test Methods',
    description: 'Test methods for laser beam parameters including power, energy, and temporal characteristics.',
    relationship: 'Measurement standards supporting IEC 60825-1'
  },
  {
    number: 'ISO/TR 23115',
    title: 'Occurrence of Near-Field Effects',
    description: 'Technical report on near-field effects in laser safety classification.',
    relationship: 'Guidance document for complex classification scenarios'
  }
];

const harmonizationStatus = [
  {
    region: 'European Union',
    standard: 'EN 60825-1',
    status: 'Fully Harmonized',
    notes: 'EN 60825-1:2014+A11:2021 adopted IEC 60825-1 Ed. 3'
  },
  {
    region: 'United States',
    standard: '21 CFR 1040.10',
    status: 'Partially Harmonized',
    notes: 'FDA maintains separate requirements but references IEC for some aspects'
  },
  {
    region: 'United Kingdom',
    standard: 'BS EN 60825-1',
    status: 'Fully Harmonized',
    notes: 'UKCA marking references BS EN standards which adopt IEC'
  },
  {
    region: 'Australia/NZ',
    standard: 'AS/NZS 4173',
    status: 'Largely Harmonized',
    notes: 'Adopts IEC 60825-1 with Australasian-specific modifications'
  },
  {
    region: 'Japan',
    standard: 'JIS C 6802',
    status: 'Largely Harmonized',
    notes: 'JIS standards closely follow IEC with some national deviations'
  },
  {
    region: 'China',
    standard: 'GB 7247.1',
    status: 'Partially Harmonized',
    notes: 'GB standards based on IEC but with significant Chinese modifications'
  },
  {
    region: 'Canada',
    standard: 'CAN/CSA E60825-1',
    status: 'Fully Harmonized',
    notes: 'CSA adopts IEC standards directly'
  },
  {
    region: 'South Korea',
    standard: 'KC Mark (K 60825)',
    status: 'Largely Harmonized',
    notes: 'Korean standards align closely with IEC'
  }
];

export default function IECEditionComparator() {
  const [selectedEdition, setSelectedEdition] = useState<'comparison' | 'timeline' | 'iso'>('comparison');
  const [selectedChange, setSelectedChange] = useState<EditionChange | null>(null);
  const [filterImpact, setFilterImpact] = useState<string>('All');

  const impactColors: Record<string, string> = {
    'Low': 'bg-blue-500',
    'Medium': 'bg-yellow-500',
    'High': 'bg-orange-500',
    'Critical': 'bg-red-500'
  };

  const filteredChanges = filterImpact === 'All' 
    ? editionChanges 
    : editionChanges.filter(c => c.impact === filterImpact);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-800 to-blue-700 rounded-xl p-6 text-white">
        <div className="flex items-center gap-3 mb-2">
          <GitCompare className="w-8 h-8" />
          <h2 className="text-2xl font-bold">IEC 60825-1 Edition Comparator</h2>
        </div>
        <p className="text-white/80">
          Compare editions, explore changes, and understand the international standards landscape 
          for laser product safety.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2">
        {[
          { id: 'comparison', label: 'Edition Comparison', icon: GitCompare },
          { id: 'timeline', label: 'Evolution Timeline', icon: History },
          { id: 'iso', label: 'ISO Standards', icon: Globe }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedEdition(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              selectedEdition === tab.id
                ? 'bg-blue-600 text-white'
                : 'bg-gray-900 text-gray-400 hover:text-white'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Comparison View */}
      {selectedEdition === 'comparison' && (
        <div className="space-y-4">
          {/* Filter */}
          <div className="flex items-center gap-3">
            <span className="text-gray-400 text-sm">Filter by impact:</span>
            <select
              value={filterImpact}
              onChange={(e) => setFilterImpact(e.target.value)}
              className="bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-sm"
            >
              <option value="All">All Changes</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          {/* Edition Header */}
          <div className="grid grid-cols-3 gap-4 bg-gray-800 rounded-lg p-4">
            <div className="text-center">
              <p className="text-gray-400 text-sm">Edition 2 (2001)</p>
              <p className="text-white font-semibold">Previous Standard</p>
            </div>
            <div className="text-center flex items-center justify-center">
              <ArrowRight className="w-6 h-6 text-blue-500" />
            </div>
            <div className="text-center">
              <p className="text-blue-400 text-sm">Edition 3 (2014)</p>
              <p className="text-white font-semibold">Current Standard</p>
            </div>
          </div>

          {/* Changes List */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChanges.map((change, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedChange(change)}
                className={`text-left p-4 rounded-xl border transition-all ${
                  selectedChange === change
                    ? 'border-blue-500 bg-blue-900/20'
                    : 'border-gray-700 bg-gray-900 hover:border-gray-500'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="text-white font-semibold">{change.category}</h4>
                  <span className={`px-2 py-1 rounded text-xs text-white ${impactColors[change.impact]}`}>
                    {change.impact}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="text-gray-500 line-through">{change.edition2.substring(0, 40)}...</div>
                  <div className="text-blue-400">{change.edition3.substring(0, 40)}...</div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Change Detail */}
          {selectedChange && (
            <div className="bg-gradient-to-r from-blue-900/30 to-indigo-900/30 border border-blue-700/50 rounded-xl p-6 animate-in fade-in">
              <h3 className="text-xl font-bold text-white mb-4">{selectedChange.category}</h3>
              <p className="text-gray-300 mb-4">{selectedChange.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-900 rounded-lg p-4">
                  <p className="text-gray-500 text-sm mb-2">Edition 2 (2001)</p>
                  <p className="text-gray-300">{selectedChange.edition2}</p>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 border border-blue-700">
                  <p className="text-blue-400 text-sm mb-2">Edition 3 (2014)</p>
                  <p className="text-white">{selectedChange.edition3}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Timeline View */}
      {selectedEdition === 'timeline' && (
        <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">IEC 60825-1 Evolution Timeline</h3>
          <div className="space-y-6 relative">
            {/* Timeline line */}
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-700" />
            
            {[
              { year: '1984', version: 'First Edition', desc: 'Original publication of IEC 60825-1', status: 'Obsolete' },
              { year: '1993', version: 'Edition 1 Amendment', desc: 'First revision based on new research', status: 'Obsolete' },
              { year: '2001', version: 'Second Edition', desc: 'Major restructuring, incorporated IEC 825', status: 'Superseded' },
              { year: '2007', version: 'Edition 2 Amendment 1', desc: 'Technical corrections and clarifications', status: 'Superseded' },
              { year: '2014', version: 'Third Edition', desc: 'Current standard - major classification changes', status: 'Current' },
              { year: '2022', version: 'Edition 3 Amendment', desc: 'Latest amendments to Edition 3', status: 'Current' }
            ].map((item, idx) => (
              <div key={idx} className="flex gap-4 relative">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold z-10 ${
                  item.status === 'Current' ? 'bg-green-500 text-white' : 'bg-gray-700 text-gray-400'
                }`}>
                  {idx + 1}
                </div>
                <div className="flex-1 pb-4">
                  <div className="flex items-center gap-3 mb-1">
                    <span className="text-gray-400 text-sm">{item.year}</span>
                    <span className="text-white font-semibold">{item.version}</span>
                    <span className={`px-2 py-0.5 rounded text-xs ${
                      item.status === 'Current' ? 'bg-green-900/50 text-green-400' : 'bg-gray-800 text-gray-500'
                    }`}>
                      {item.status}
                    </span>
                  </div>
                  <p className="text-gray-400 text-sm">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ISO Standards View */}
      {selectedEdition === 'iso' && (
        <div className="space-y-6">
          {/* Harmonization Map */}
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5" />
              Global Harmonization Status
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-700">
                    <th className="text-left py-2 px-3 text-gray-300">Region</th>
                    <th className="text-left py-2 px-3 text-gray-300">Standard</th>
                    <th className="text-left py-2 px-3 text-gray-300">Status</th>
                    <th className="text-left py-2 px-3 text-gray-300">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {harmonizationStatus.map((region) => (
                    <tr key={region.region} className="border-b border-gray-800">
                      <td className="py-3 px-3 text-white font-medium">{region.region}</td>
                      <td className="py-3 px-3 text-blue-400">{region.standard}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-1 rounded text-xs ${
                          region.status === 'Fully Harmonized' ? 'bg-green-900/50 text-green-400' :
                          region.status === 'Largely Harmonized' ? 'bg-yellow-900/50 text-yellow-400' :
                          'bg-orange-900/50 text-orange-400'
                        }`}>
                          {region.status}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-gray-400 text-xs">{region.notes}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ISO Standards */}
          <div className="bg-gradient-to-r from-indigo-900/20 to-purple-900/20 border border-indigo-700/50 rounded-xl p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Related ISO Standards
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isoStandards.map((iso) => (
                <div key={iso.number} className="bg-gray-900/50 rounded-lg p-4 border border-gray-700">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-indigo-400 font-mono font-bold">{iso.number}</span>
                  </div>
                  <h4 className="text-white font-semibold text-sm mb-2">{iso.title}</h4>
                  <p className="text-gray-400 text-xs mb-3">{iso.description}</p>
                  <p className="text-indigo-400 text-xs flex items-center gap-1">
                    <ArrowRight className="w-3 h-3" />
                    {iso.relationship}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
