import React, { useState } from 'react';
import {
  BookOpen,
  Scale,
  Globe,
  CheckCircle,
  AlertTriangle,
  Info,
  FileText,
  ChevronDown,
  ChevronUp,
  Layers,
  Activity,
  ArrowRight,
  GitCompare,
  Table,
  BarChart3
} from 'lucide-react';

// IEC 60825-1 Editions comparison
const editionComparison = [
  {
    aspect: 'Publication Year',
    edition1: '1984',
    edition2: '1993/2001/2007',
    edition3: '2014'
  },
  {
    aspect: 'Scope',
    edition1: 'Basic laser safety',
    edition2: 'Expanded scope',
    edition3: '180 nm to 1 mm, comprehensive'
  },
  {
    aspect: 'LED Treatment',
    edition1: 'Included as lasers',
    edition2: 'Included as lasers',
    edition3: 'Removed from scope (use IEC 62471)'
  },
  {
    aspect: 'Extended Sources',
    edition1: 'Limited guidance',
    edition2: 'Basic evaluation methods',
    edition3: 'Comprehensive extended source analysis'
  },
  {
    aspect: 'AEL Tables',
    edition1: 'Basic tables',
    edition2: 'Expanded tables',
    edition3: 'Comprehensive tables with corrections'
  },
  {
    aspect: 'Measurement Conditions',
    edition1: 'Simple conditions',
    edition2: 'More detailed',
    edition3: 'Three measurement conditions defined'
  },
  {
    aspect: 'Interpretation Sheets',
    edition1: 'None',
    edition2: 'Few',
    edition3: 'ISH1 (2017), ISH2 (2017)'
  }
];

// Edition 2 vs Edition 3 key differences
const editionDifferences = {
  structural: [
    {
      change: 'LED Scope',
      edition2: 'LEDs included in scope',
      edition3: 'LEDs removed - use IEC 62471',
      impact: 'LED products now evaluated under lamp safety standards'
    },
    {
      change: 'Measurement Conditions',
      edition2: 'Various conditions',
      edition3: 'Three standardized conditions (1, 2, 3)',
      impact: 'More consistent classification across manufacturers'
    },
    {
      change: 'Extended Sources',
      edition2: 'Limited guidance',
      edition3: 'Detailed subclause 4.3 d) with examples',
      impact: 'Better guidance for arrays, VCSELs, diffused beams'
    },
    {
      change: 'Pulse Analysis',
      edition2: 'Basic pulse grouping',
      edition3: 'Comprehensive pulse group analysis',
      impact: 'More accurate classification of complex pulse patterns'
    }
  ],
  technical: [
    {
      change: 'C6 Correction Factor',
      edition2: 'Applied for all extended sources',
      edition3: 'Step function at 5 mrad and αmax',
      impact: 'May result in different classification for some sources'
    },
    {
      change: 'TOTP Method',
      edition2: 'Included',
      edition3: 'Clarified applicability',
      impact: 'Better defined when method can be used'
    },
    {
      change: 'Radiance Criterion',
      edition2: 'Not included',
      edition3: 'Subclause 4.4 for conventional lamp replacement',
      impact: 'New pathway for evaluation of lamp-like sources'
    },
    {
      change: 'Angular Subtense',
      edition2: 'Less detailed',
      edition3: 'Detailed αmax calculation methodology',
      impact: 'More consistent source size evaluation'
    }
  ]
};

// ISO standards related to lasers
const isoStandards = [
  {
    number: 'ISO 11146',
    title: 'Lasers and laser-related equipment — Test methods for laser beam widths',
    scope: 'Beam characterization'
  },
  {
    number: 'ISO 11554',
    title: 'Optics and photonics — Lasers and laser-related equipment — Test methods for laser beam power, energy and temporal characteristics',
    scope: 'Power and energy measurement'
  },
  {
    number: 'ISO 13694',
    title: 'Optics and lasers — Lasers and laser-related equipment — Test methods for laser beam power (energy) density distribution',
    scope: 'Beam profile analysis'
  },
  {
    number: 'ISO 17526',
    title: 'Optics and optical instruments — Lasers — Laser beam shape classification',
    scope: 'Beam shape classification'
  },
  {
    number: 'ISO 21254',
    title: 'Lasers and laser-related equipment — Test methods for laser-induced damage threshold',
    scope: 'Optical damage testing'
  },
  {
    number: 'ISO 15004-2',
    title: 'Ophthalmic instruments — Fundamental requirements and test methods — Part 2: Light hazard protection',
    scope: 'Ophthalmic laser safety'
  }
];

// Harmonization status by region
const harmonizationStatus = [
  {
    region: 'European Union',
    standard: 'EN 60825-1',
    edition: '3.0 (2014)',
    status: 'Adopted',
    notes: 'Harmonized standard under RED and MD'
  },
  {
    region: 'United States',
    standard: '21 CFR 1040.10',
    edition: 'Various',
    status: 'Partial harmonization',
    notes: 'FDA has separate laser product regulations'
  },
  {
    region: 'Canada',
    standard: 'REDA + IEC 60825',
    edition: '3.0 referenced',
    status: 'Referenced',
    notes: 'REDA complemented by IEC standards'
  },
  {
    region: 'Australia/New Zealand',
    standard: 'AS/NZS 2211.1',
    edition: 'Based on IEC',
    status: 'Adopted with modifications',
    notes: 'Dual-numbered AS/NZS 2211.1:2020'
  },
  {
    region: 'Japan',
    standard: 'JIS C 6802',
    edition: 'Based on IEC',
    status: 'Adopted with modifications',
    notes: 'Japanese Industrial Standard'
  },
  {
    region: 'China',
    standard: 'GB 7247.1',
    edition: 'Based on IEC',
    status: 'Adopted with modifications',
    notes: 'Guobiao standard'
  }
];

// Classification comparison table
const classificationTable = {
  classes: ['Class 1', 'Class 1M', 'Class 2', 'Class 2M', 'Class 3R', 'Class 3B', 'Class 4'],
  edition2: {
    'Class 1': 'Safe under foreseeable conditions',
    'Class 1M': 'Safe without optical aids',
    'Class 2': 'Visible, protection by blink reflex',
    'Class 2M': 'As Class 2, unsafe with optics',
    'Class 3R': 'Low risk, normally safe',
    'Class 3B': 'Direct viewing hazardous',
    'Class 4': 'High power, fire hazard'
  },
  edition3: {
    'Class 1': 'Same - clarified measurement',
    'Class 1M': 'Same - improved guidance',
    'Class 2': 'Same - clarified applicability',
    'Class 2M': 'Same - improved guidance',
    'Class 3R': 'Same - AELs updated',
    'Class 3B': 'Same - AELs updated',
    'Class 4': 'Same - clarified requirements'
  }
};

const EditionComparisonTable: React.FC = () => {
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);

  return (
    <div className="bg-card p-6 rounded-lg shadow-md overflow-x-auto">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Table className="w-6 h-6 text-blue-600" />
        IEC 60825-1 Edition Comparison
      </h3>
      
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-muted">
            <th className="p-3 text-left font-semibold">Aspect</th>
            <th className="p-3 text-left font-semibold">Edition 1 (1984)</th>
            <th className="p-3 text-left font-semibold">Edition 2 (1993-2007)</th>
            <th className="p-3 text-left font-semibold">Edition 3 (2014)</th>
          </tr>
        </thead>
        <tbody>
          {editionComparison.map((row, idx) => (
            <tr 
              key={idx} 
              className={`border-b hover:bg-gray-50 cursor-pointer ${
                selectedAspect === row.aspect ? 'bg-blue-50' : ''
              }`}
              onClick={() => setSelectedAspect(selectedAspect === row.aspect ? null : row.aspect)}
            >
              <td className="p-3 font-medium">{row.aspect}</td>
              <td className="p-3 text-gray-600">{row.edition1}</td>
              <td className="p-3 text-gray-600">{row.edition2}</td>
              <td className="p-3 text-gray-600 font-medium text-blue-900">{row.edition3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const DifferenceCard: React.FC<{ 
  item: typeof editionDifferences.structural[0];
  type: 'structural' | 'technical' 
}> = ({ item, type }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div>
            <h4 className="font-semibold text-foreground">{item.change}</h4>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="pt-3 space-y-3">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-3 bg-card rounded border">
                <p className="text-xs font-semibold text-foreground0 mb-1">Edition 2</p>
                <p className="text-sm">{item.edition2}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded border border-blue-200">
                <p className="text-xs font-semibold text-blue-600 mb-1">Edition 3</p>
                <p className="text-sm">{item.edition3}</p>
              </div>
            </div>
            <div className="p-2 bg-amber-50 rounded text-sm">
              <span className="font-medium">Impact:</span> {item.impact}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HarmonizationMap: React.FC = () => {
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Adopted': return 'bg-green-100 text-green-800';
      case 'Partial harmonization': return 'bg-yellow-100 text-yellow-800';
      case 'Referenced': return 'bg-blue-100 text-blue-800';
      case 'Adopted with modifications': return 'bg-purple-100 text-purple-800';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Globe className="w-6 h-6 text-blue-600" />
        Global Harmonization Status
      </h3>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted">
              <th className="p-3 text-left font-semibold">Region</th>
              <th className="p-3 text-left font-semibold">Standard</th>
              <th className="p-3 text-left font-semibold">Edition</th>
              <th className="p-3 text-left font-semibold">Status</th>
              <th className="p-3 text-left font-semibold">Notes</th>
            </tr>
          </thead>
          <tbody>
            {harmonizationStatus.map((region, idx) => (
              <tr 
                key={idx} 
                className={`border-b hover:bg-gray-50 ${
                  selectedRegion === region.region ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedRegion(selectedRegion === region.region ? null : region.region)}
              >
                <td className="p-3 font-medium">{region.region}</td>
                <td className="p-3">{region.standard}</td>
                <td className="p-3">{region.edition}</td>
                <td className="p-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(region.status)}`}>
                    {region.status}
                  </span>
                </td>
                <td className="p-3 text-gray-600">{region.notes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ClassificationPyramid: React.FC = () => {
  const classes = [
    { name: 'Class 1', color: 'bg-green-500', width: '100%', desc: 'Safe' },
    { name: 'Class 1M', color: 'bg-green-400', width: '90%', desc: 'Safe (no optics)' },
    { name: 'Class 2', color: 'bg-blue-400', width: '80%', desc: 'Blink reflex' },
    { name: 'Class 2M', color: 'bg-blue-300', width: '70%', desc: 'Blink reflex (no optics)' },
    { name: 'Class 3R', color: 'bg-yellow-400', width: '60%', desc: 'Low risk' },
    { name: 'Class 3B', color: 'bg-orange-400', width: '50%', desc: 'Hazardous direct' },
    { name: 'Class 4', color: 'bg-red-500', width: '40%', desc: 'High power' },
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Layers className="w-6 h-6 text-blue-600" />
        Laser Class Hierarchy (Edition 3)
      </h3>
      
      <div className="flex flex-col items-center space-y-2">
        {classes.map((cls, idx) => (
          <div 
            key={idx}
            className={`${cls.color} text-white p-3 rounded flex items-center justify-between transition-all hover:opacity-90 cursor-pointer`}
            style={{ width: cls.width }}
          >
            <span className="font-bold">{cls.name}</span>
            <span className="text-sm opacity-90">{cls.desc}</span>
          </div>
        ))}
      </div>
      
      <div className="mt-4 text-center text-sm text-gray-600">
        ← Less Restrictive &nbsp;&nbsp;&nbsp; More Restrictive →
      </div>
    </div>
  );
};

const AELCalculator: React.FC = () => {
  const [laserClass, setLaserClass] = useState('2');
  const [wavelength, setWavelength] = useState('532');
  const [result, setResult] = useState<any>(null);

  const calculateAEL = () => {
    // Simplified AEL calculation for educational purposes
    const wl = parseFloat(wavelength);
    let ael = 0;
    let unit = '';

    switch (laserClass) {
      case '1':
        ael = 0.39e-3;
        unit = 'mW (for 0.25s exposure)';
        break;
      case '2':
        if (wl >= 400 && wl <= 700) {
          ael = 1;
          unit = 'mW (continuous)';
        } else {
          ael = 0.39e-3;
          unit = 'mW (limited by Class 1 AEL)';
        }
        break;
      case '3R':
        if (wl >= 400 && wl <= 700) {
          ael = 5;
          unit = 'mW (continuous)';
        } else {
          ael = 5 * 0.39e-3;
          unit = 'mW (5× Class 1 AEL)';
        }
        break;
      case '3B':
        ael = 500;
        unit = 'mW (continuous)';
        break;
      default:
        ael = NaN;
        unit = 'Not applicable';
    }

    setResult({ ael, unit, edition: 'IEC 60825-1:2014 (Edition 3)' });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Activity className="w-6 h-6 text-blue-600" />
        AEL Calculator (Educational)
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Laser Class</label>
            <select 
              className="w-full p-2 border rounded"
              value={laserClass}
              onChange={(e) => setLaserClass(e.target.value)}
            >
              <option value="1">Class 1</option>
              <option value="2">Class 2</option>
              <option value="3R">Class 3R</option>
              <option value="3B">Class 3B</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Wavelength (nm)</label>
            <input 
              type="number"
              className="w-full p-2 border rounded"
              value={wavelength}
              onChange={(e) => setWavelength(e.target.value)}
              min="180"
              max="1000000"
            />
          </div>

          <button
            onClick={calculateAEL}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Calculate AEL
          </button>
        </div>

        <div>
          {result ? (
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-600 mb-1">{result.edition}</p>
              <p className="text-3xl font-bold text-blue-900">
                {isNaN(result.ael) ? 'N/A' : result.ael < 0.01 ? result.ael.toExponential(2) : result.ael}
              </p>
              <p className="text-blue-700">{result.unit}</p>
              <p className="text-xs text-blue-600 mt-2">
                Note: This is a simplified calculator for educational purposes. 
                Actual AEL calculations require consideration of pulse characteristics, 
                extended sources, and other factors per IEC 60825-1:2014.
              </p>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Select parameters to calculate AEL</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Module6_IEC_ISO: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'editions' | 'comparison' | 'iso' | 'harmonization'>('overview');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Module 5.6: IEC-ISO Harmonization</h1>
        </div>
        <p className="text-indigo-100">
          IEC 60825-1 editions comparison, ISO standards, global harmonization status, 
          and key differences between Edition 2 and Edition 3.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'editions', label: 'Edition Comparison', icon: GitCompare },
          { id: 'comparison', label: 'Ed 2 vs Ed 3', icon: ArrowRight },
          { id: 'iso', label: 'ISO Standards', icon: BookOpen },
          { id: 'harmonization', label: 'Global Status', icon: Globe }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-indigo-600 border-b-2 border-indigo-600' 
                : 'text-gray-600 hover:text-indigo-500'
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
          {/* IEC 60825-1 Overview */}
          <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <Info className="w-6 h-6 text-indigo-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-indigo-900">IEC 60825-1: Safety of Laser Products</h3>
                <p className="text-indigo-800 text-sm mt-1">
                  IEC 60825-1 is the international standard for laser product safety, covering 
                  classification, marking, and requirements. Edition 3.0 (2014) represents the 
                  current state of the art, with Interpretation Sheets ISH1 and ISH2 (2017) providing 
                  additional clarifications.
                </p>
              </div>
            </div>
          </div>

          {/* Classification Pyramid */}
          <ClassificationPyramid />

          {/* Key Facts */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-lg shadow-md text-center">
              <p className="text-3xl font-bold text-indigo-600">180 nm</p>
              <p className="text-sm text-gray-600">Lower wavelength limit</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-md text-center">
              <p className="text-3xl font-bold text-indigo-600">1 mm</p>
              <p className="text-sm text-gray-600">Upper wavelength limit</p>
            </div>
            <div className="bg-card p-4 rounded-lg shadow-md text-center">
              <p className="text-3xl font-bold text-indigo-600">7</p>
              <p className="text-sm text-gray-600">Laser classes defined</p>
            </div>
          </div>

          {/* IEC Structure */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              IEC 60825 Series Structure
            </h3>
            <div className="space-y-2">
              <div className="p-3 bg-indigo-50 rounded border-l-4 border-indigo-500">
                <p className="font-medium">Part 1: Equipment classification and requirements</p>
                <p className="text-sm text-gray-600">Core standard for product classification</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-400">
                <p className="font-medium">Part 2: Safety of optical fibre communication systems</p>
                <p className="text-sm text-gray-600">OFCS safety requirements</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-400">
                <p className="font-medium">Part 3: Laser displays and exhibitions</p>
                <p className="text-sm text-gray-600">Show production safety</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-400">
                <p className="font-medium">Part 4: Laser guards</p>
                <p className="text-sm text-gray-600">Protective housing requirements</p>
              </div>
              <div className="p-3 bg-gray-50 rounded border-l-4 border-gray-400">
                <p className="font-medium">Part 5: Laser barriers</p>
                <p className="text-sm text-gray-600">Barrier specification</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'editions' && (
        <div className="space-y-6">
          <EditionComparisonTable />
          
          {/* Edition Timeline */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">IEC 60825-1 Edition Timeline</h3>
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300"></div>
              <div className="space-y-6">
                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-400 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">1</div>
                  <div>
                    <p className="font-semibold">Edition 1 (1984)</p>
                    <p className="text-sm text-gray-600">Initial publication - basic laser safety framework</p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">2</div>
                  <div>
                    <p className="font-semibold">Edition 2 (1993, 2001, 2007)</p>
                    <p className="text-sm text-gray-600">Major revision - expanded scope, improved measurement conditions</p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">3</div>
                  <div>
                    <p className="font-semibold">Edition 3 (2014)</p>
                    <p className="text-sm text-gray-600">Current edition - comprehensive extended source analysis, removed LEDs</p>
                  </div>
                </div>
                <div className="relative flex items-start gap-4">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold z-10">I</div>
                  <div>
                    <p className="font-semibold">ISH1 & ISH2 (2017)</p>
                    <p className="text-sm text-gray-600">Interpretation Sheets - clarifications on classification rules</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'comparison' && (
        <div className="space-y-6">
          {/* Structural Changes */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Layers className="w-5 h-5 text-indigo-600" />
              Structural Changes
            </h3>
            <div className="space-y-3">
              {editionDifferences.structural.map((item, idx) => (
                <DifferenceCard key={idx} item={item} type="structural" />
              ))}
            </div>
          </div>

          {/* Technical Changes */}
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5 text-indigo-600" />
              Technical Changes
            </h3>
            <div className="space-y-3">
              {editionDifferences.technical.map((item, idx) => (
                <DifferenceCard key={idx} item={item} type="technical" />
              ))}
            </div>
          </div>

          {/* Impact Summary */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900">Edition 2 to Edition 3 Impact</h3>
                <p className="text-amber-800 text-sm mt-1">
                  Products classified under Edition 2 may receive different classifications under Edition 3, 
                  particularly for extended sources and complex temporal emission patterns. Manufacturers 
                  should review classifications when transitioning to Edition 3.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'iso' && (
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-indigo-600" />
              Related ISO Standards
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {isoStandards.map((std, idx) => (
                <div key={idx} className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <p className="font-semibold text-indigo-900">{std.number}</p>
                  <p className="text-sm text-gray-700 mt-1">{std.title}</p>
                  <span className="inline-block mt-2 px-2 py-0.5 bg-indigo-100 text-indigo-800 text-xs rounded">
                    {std.scope}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* IEC-ISO Relationship */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Scale className="w-5 h-5 text-indigo-600" />
              IEC and ISO Relationship
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold mb-2">IEC (International Electrotechnical Commission)</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Focus: Electrical/electronic standards
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    TC 76: Optical radiation safety and laser equipment
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    IEC 60825 series: Laser product safety
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">ISO (International Organization for Standardization)</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Focus: General technical standards
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    ISO 11146 series: Beam characterization
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    Complements IEC safety standards
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* AEL Calculator */}
          <AELCalculator />
        </div>
      )}

      {activeTab === 'harmonization' && (
        <div className="space-y-6">
          <HarmonizationMap />
          
          {/* Regional Notes */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Globe className="w-5 h-5 text-indigo-600" />
              Regional Harmonization Notes
            </h3>
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 rounded">
                <h4 className="font-semibold text-blue-900">European Union</h4>
                <p className="text-sm text-blue-800">
                  EN 60825-1 is a harmonized standard under the Radio Equipment Directive (RED) 
                  and Machinery Directive (MD). CE marking requires compliance with applicable 
                  essential requirements.
                </p>
              </div>
              <div className="p-3 bg-yellow-50 rounded">
                <h4 className="font-semibold text-yellow-900">United States</h4>
                <p className="text-sm text-yellow-800">
                  The FDA maintains separate regulations (21 CFR 1040.10) that are not fully 
                  harmonized with IEC 60825-1. Products must comply with FDA requirements for 
                  US market access.
                </p>
              </div>
              <div className="p-3 bg-green-50 rounded">
                <h4 className="font-semibold text-green-900">Asia-Pacific</h4>
                <p className="text-sm text-green-800">
                  Most Asia-Pacific countries have adopted IEC 60825-1 with varying degrees of 
                  modification. Japan (JIS C 6802), China (GB 7247.1), and Australia/New Zealand 
                  (AS/NZS 2211.1) all maintain national standards based on IEC.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Module6_IEC_ISO;
