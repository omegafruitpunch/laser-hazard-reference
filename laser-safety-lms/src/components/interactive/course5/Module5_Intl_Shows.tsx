import React, { useState } from 'react';
import {
  Plane,
  FileText,
  Globe,
  CheckCircle,
  AlertTriangle,
  Clock,
  MapPin,
  ClipboardList,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Info,
  Shield,
  Calendar,
  DollarSign,
  Users,
  Upload,
  Download,
  Printer
} from 'lucide-react';

// ILDA Country Categories
const ildaCategories = {
  A: {
    name: 'Category A',
    label: 'Permit Required',
    color: 'bg-blue-100 text-blue-800 border-blue-300',
    description: 'Audience scanning requires a permit or explicit permission in advance',
    details: 'Permission may be required by government and/or venue operator',
    countries: ['Austria', 'Finland', 'Germany', 'Scotland', 'Sweden', 'Switzerland', 'United Kingdom', 'United States'],
    leadTime: '2-8 weeks',
    typicalRequirements: [
      'Formal permit application',
      'Risk assessment submission',
      'MPE calculations',
      'Equipment specifications',
      'Operator qualifications'
    ]
  },
  B: {
    name: 'Category B',
    label: 'Permit Required (Rarely Granted)',
    color: 'bg-purple-100 text-purple-800 border-purple-300',
    description: 'Permit required but permission almost never given',
    details: 'Similar to old US situation - permits technically required but practically unavailable',
    countries: ['None currently listed'],
    leadTime: 'N/A - Generally not available',
    typicalRequirements: ['Not applicable - permits rarely granted']
  },
  C: {
    name: 'Category C',
    label: 'Permit Required (Weak Enforcement)',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-300',
    description: 'Permit required by law but often not followed or enforced',
    details: 'Legal requirement exists but compliance varies',
    countries: ['Japan', 'Luxembourg'],
    leadTime: '1-4 weeks (if pursuing formal compliance)',
    typicalRequirements: [
      'Permit application (recommended)',
      'Basic safety documentation',
      'Local partner may assist'
    ]
  },
  D: {
    name: 'Category D',
    label: 'Allowed Without Permit',
    color: 'bg-green-100 text-green-800 border-green-300',
    description: 'Audience scanning allowed without specific permit',
    details: 'No specific laws or regulations, general safety principles apply',
    countries: ['Belgium', 'Canada', 'Czech Republic', 'France (outdoors)', 'Greece', 'Indonesia', 'Ireland', 'Italy', 'Mexico', 'Netherlands', 'Portugal', 'South Korea', 'Spain', 'Thailand', 'Turkey'],
    leadTime: '1-2 weeks (venue notification)',
    typicalRequirements: [
      'Venue notification (recommended)',
      'Insurance certificate',
      'Basic safety documentation',
      'Risk assessment (best practice)'
    ]
  },
  E: {
    name: 'Category E',
    label: 'Prohibited',
    color: 'bg-red-100 text-red-800 border-red-300',
    description: 'Audience scanning not allowed under almost all circumstances',
    details: 'Strict prohibition - do not plan audience scanning',
    countries: ['France (indoors)'],
    leadTime: 'N/A - Not permitted',
    typicalRequirements: ['Audience scanning not permitted - consider alternatives']
  },
  F: {
    name: 'Category F',
    label: 'Unclear',
    color: 'bg-muted text-foreground border-gray-300',
    description: 'Situation unclear',
    details: 'Usually no permission required but authorities may deny case-by-case',
    countries: ['China', 'Egypt', 'India', 'Iran', 'Nigeria', 'Poland', 'Qatar', 'Russia', 'Saudi Arabia', 'UAE'],
    leadTime: '4-8 weeks (to clarify status)',
    typicalRequirements: [
      'Contact local authorities early',
      'Obtain written confirmation if possible',
      'Local legal consultation recommended',
      'Comprehensive documentation'
    ]
  },
  G: {
    name: 'Category G',
    label: 'State/Provincial Variation',
    color: 'bg-orange-100 text-orange-800 border-orange-300',
    description: 'Each state/canton/province may have own laws',
    details: 'May be in lieu of or in addition to federal laws',
    countries: ['None currently listed (see US, Canada, Australia)'],
    leadTime: 'Varies by region',
    typicalRequirements: ['Check both federal and local regulations']
  },
  X: {
    name: 'Category X',
    label: 'Unknown Status',
    color: 'bg-slate-100 text-slate-800 border-slate-300',
    description: 'Status unknown',
    details: 'Insufficient information available',
    countries: ['Algeria', 'Argentina', 'Australia', 'Brazil', 'Chile', 'Denmark', 'Hong Kong', 'Indonesia', 'Malaysia', 'Mexico', 'New Zealand', 'Pakistan', 'Peru', 'Philippines', 'Singapore', 'South Africa', 'South Korea', 'Taiwan', 'Thailand', 'Turkey', 'Vietnam'],
    leadTime: '6-12 weeks (research required)',
    typicalRequirements: [
      'Extensive research required',
      'Contact ILDA for updates',
      'Consult local experts',
      'Consider legal consultation'
    ]
  }
};

// Permit lead times by region
const leadTimeData = [
  { region: 'Western Europe (A)', minWeeks: 2, maxWeeks: 8, typical: '4-6 weeks', notes: 'Germany, Austria strictest; UK most permissive' },
  { region: 'Scandinavia (A)', minWeeks: 4, maxWeeks: 8, typical: '6-8 weeks', notes: 'Finland and Sweden require detailed documentation' },
  { region: 'North America (A/D)', minWeeks: 4, maxWeeks: 12, typical: '6-8 weeks', notes: 'US FDA variance; Canada outdoor requires Transport Canada' },
  { region: 'Asia-Pacific (C/F/X)', minWeeks: 2, maxWeeks: 12, typical: '4-8 weeks', notes: 'Highly variable - research essential' },
  { region: 'Middle East (F)', minWeeks: 4, maxWeeks: 12, typical: '6-10 weeks', notes: 'Local sponsorship often required' },
  { region: 'Eastern Europe (D/F)', minWeeks: 2, maxWeeks: 6, typical: '3-4 weeks', notes: 'Generally more permissive than Western Europe' }
];

// Documentation checklist
const documentationChecklist = {
  essential: [
    { item: 'Valid passport (6+ months validity)', category: 'travel', leadTime: 'Ensure validity' },
    { item: 'Work visa or permit', category: 'legal', leadTime: '4-12 weeks' },
    { item: 'Laser show permit (if required)', category: 'permit', leadTime: '2-12 weeks' },
    { item: 'Equipment inventory list', category: 'customs', leadTime: '1 week' },
    { item: 'Carnet or customs documentation', category: 'customs', leadTime: '2-4 weeks' },
    { item: 'Certificate of insurance', category: 'legal', leadTime: '1-2 weeks' },
    { item: 'Laser Safety Officer credentials', category: 'professional', leadTime: 'Ensure current' }
  ],
  technical: [
    { item: 'Equipment specifications', category: 'technical', leadTime: '1 week' },
    { item: 'MPE calculations', category: 'safety', leadTime: '1-2 weeks' },
    { item: 'Risk assessment', category: 'safety', leadTime: '1-2 weeks' },
    { item: 'Show plot/zone diagrams', category: 'technical', leadTime: '1 week' },
    { item: 'Emergency procedures', category: 'safety', leadTime: '1 week' },
    { item: 'Operator training records', category: 'professional', leadTime: 'Ensure current' }
  ],
  recommended: [
    { item: 'ILDA membership card', category: 'professional', leadTime: 'Ensure current' },
    { item: 'Reference letters from venues', category: 'professional', leadTime: 'Ongoing' },
    { item: 'Equipment photos', category: 'customs', leadTime: '1 week' },
    { item: 'Power of attorney (local agent)', category: 'legal', leadTime: '2-4 weeks' },
    { item: 'Medical/travel insurance', category: 'travel', leadTime: '1 week' },
    { item: 'Local contact information', category: 'logistics', leadTime: '1 week' }
  ]
};

const CategoryCard: React.FC<{ category: typeof ildaCategories[keyof typeof ildaCategories]; code: string }> = ({ category, code }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-card rounded-lg shadow-md overflow-hidden">
      <div 
        className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-3">
            <span className={`px-3 py-1 rounded-full text-sm font-bold ${category.color}`}>
              {code}
            </span>
            <div>
              <h4 className="font-semibold text-foreground">{category.name}</h4>
              <p className="text-sm text-gray-600">{category.label}</p>
            </div>
          </div>
          {expanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
        </div>
        <p className="text-sm text-gray-600 mt-2">{category.description}</p>
      </div>
      
      {expanded && (
        <div className="px-4 pb-4 border-t bg-gray-50">
          <div className="pt-3 space-y-3">
            <p className="text-sm text-gray-600">{category.details}</p>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Countries ({category.countries.length}):</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {category.countries.map((country, idx) => (
                  <span key={idx} className="px-2 py-0.5 bg-card rounded text-xs border">
                    {country}
                  </span>
                ))}
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4 text-foreground0" />
              <span className="font-medium">Typical Lead Time:</span>
              <span>{category.leadTime}</span>
            </div>
            
            <div>
              <p className="text-sm font-medium text-gray-700">Typical Requirements:</p>
              <ul className="mt-1 space-y-1">
                {category.typicalRequirements.map((req, idx) => (
                  <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 shrink-0" />
                    {req}
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

const LeadTimeVisualizer: React.FC = () => {
  const maxWeeks = Math.max(...leadTimeData.map(d => d.maxWeeks));

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Clock className="w-6 h-6 text-blue-600" />
        Permit Lead Times by Region
      </h3>
      
      <div className="space-y-4">
        {leadTimeData.map((region, idx) => (
          <div key={idx} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{region.region}</span>
              <span className="text-gray-600">{region.typical}</span>
            </div>
            <div className="relative h-6 bg-muted rounded-full overflow-hidden">
              {/* Min-Max range */}
              <div 
                className="absolute h-full bg-blue-200 rounded-full"
                style={{
                  left: `${(region.minWeeks / maxWeeks) * 100}%`,
                  width: `${((region.maxWeeks - region.minWeeks) / maxWeeks) * 100}%`
                }}
              />
              {/* Typical marker */}
              <div 
                className="absolute top-0 bottom-0 w-1 bg-blue-600"
                style={{
                  left: `${((region.minWeeks + region.maxWeeks) / 2 / maxWeeks) * 100}%`
                }}
              />
            </div>
            <p className="text-xs text-foreground0">{region.notes}</p>
          </div>
        ))}
      </div>
      
      <div className="mt-4 flex items-center gap-4 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-4 h-4 bg-blue-200 rounded"></div>
          <span>Typical range</span>
        </div>
        <div className="flex items-center gap-1">
          <div className="w-1 h-4 bg-blue-600"></div>
          <span>Median</span>
        </div>
      </div>
    </div>
  );
};

const DocumentationChecklistComponent: React.FC = () => {
  const [checked, setChecked] = useState<Set<string>>(new Set());

  const toggleItem = (item: string) => {
    const newChecked = new Set(checked);
    if (newChecked.has(item)) {
      newChecked.delete(item);
    } else {
      newChecked.add(item);
    }
    setChecked(newChecked);
  };

  const categories = [
    { key: 'essential', label: 'Essential Documents', color: 'bg-red-50 border-red-200' },
    { key: 'technical', label: 'Technical Documentation', color: 'bg-blue-50 border-blue-200' },
    { key: 'recommended', label: 'Recommended Documents', color: 'bg-green-50 border-green-200' }
  ];

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold flex items-center gap-2">
          <ClipboardList className="w-6 h-6 text-blue-600" />
          Documentation Checklist
        </h3>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 px-3 py-1 text-sm bg-muted rounded hover:bg-muted"
        >
          <Printer className="w-4 h-4" />
          Print
        </button>
      </div>
      
      <div className="space-y-6">
        {categories.map(cat => (
          <div key={cat.key} className={`p-4 rounded-lg border ${cat.color}`}>
            <h4 className="font-semibold mb-3">{cat.label}</h4>
            <div className="space-y-2">
              {documentationChecklist[cat.key as keyof typeof documentationChecklist].map((item, idx) => (
                <label 
                  key={idx} 
                  className="flex items-center gap-3 p-2 bg-card rounded cursor-pointer hover:bg-gray-50"
                >
                  <input 
                    type="checkbox"
                    checked={checked.has(`${cat.key}-${idx}`)}
                    onChange={() => toggleItem(`${cat.key}-${idx}`)}
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <span className={`text-sm ${checked.has(`${cat.key}-${idx}`) ? 'line-through text-gray-400' : ''}`}>
                      {item.item}
                    </span>
                    <span className="text-xs text-foreground0 ml-2">({item.leadTime})</span>
                  </div>
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
        <Info className="w-4 h-4 inline mr-1" />
        Checked: {checked.size} / {Object.values(documentationChecklist).flat().length} items
      </div>
    </div>
  );
};

const ShowPlanner: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [showDate, setShowDate] = useState('');
  const [equipmentValue, setEquipmentValue] = useState('');
  const [plan, setPlan] = useState<any>(null);

  const generatePlan = () => {
    // Determine category
    let category = '';
    for (const [key, data] of Object.entries(ildaCategories)) {
      if (data.countries.some(c => c.toLowerCase().includes(destination.toLowerCase()))) {
        category = key;
        break;
      }
    }

    const catData = ildaCategories[category as keyof typeof ildaCategories];
    
    // Calculate timeline
    const timeline = [];
    const today = new Date();
    const showDateObj = showDate ? new Date(showDate) : new Date(today.getTime() + 90 * 24 * 60 * 60 * 1000);
    
    // Work backwards from show date
    const showTime = showDateObj.getTime();
    
    timeline.push({ 
      date: new Date(showTime), 
      event: 'SHOW DATE', 
      type: 'milestone',
      icon: Calendar 
    });
    
    timeline.push({ 
      date: new Date(showTime - 7 * 24 * 60 * 60 * 1000), 
      event: 'Arrive on site for setup', 
      type: 'setup',
      icon: MapPin 
    });
    
    if (catData && catData.name !== 'Category D') {
      const permitWeeks = catData.name === 'Category A' ? 6 : 4;
      timeline.push({ 
        date: new Date(showTime - (7 + permitWeeks * 7) * 24 * 60 * 60 * 1000), 
        event: `Apply for ${catData.name} permit`, 
        type: 'permit',
        icon: FileText 
      });
    }
    
    timeline.push({ 
      date: new Date(showTime - 21 * 24 * 60 * 60 * 1000), 
      event: 'Obtain carnet/ATA documentation', 
      type: 'customs',
      icon: Briefcase 
    });
    
    timeline.push({ 
      date: new Date(showTime - 28 * 24 * 60 * 60 * 1000), 
      event: 'Confirm insurance coverage', 
      type: 'legal',
      icon: Shield 
    });
    
    timeline.push({ 
      date: new Date(showTime - 56 * 24 * 60 * 60 * 1000), 
      event: 'Begin visa application process', 
      type: 'travel',
      icon: Globe 
    });

    // Sort by date
    timeline.sort((a, b) => a.date.getTime() - b.date.getTime());

    setPlan({
      category,
      categoryData: catData,
      timeline,
      recommendations: catData ? catData.typicalRequirements : ['Research local regulations']
    });
  };

  return (
    <div className="bg-card p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
        <Plane className="w-6 h-6 text-blue-600" />
        "Taking My Show Overseas" Planner
      </h3>
      
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Destination Country</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              placeholder="e.g., Germany"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Show Date</label>
            <input 
              type="date"
              className="w-full p-2 border rounded"
              value={showDate}
              onChange={(e) => setShowDate(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Equipment Value</label>
            <select 
              className="w-full p-2 border rounded"
              value={equipmentValue}
              onChange={(e) => setEquipmentValue(e.target.value)}
            >
              <option value="">Select range...</option>
              <option value="low">Under $10,000</option>
              <option value="medium">$10,000 - $50,000</option>
              <option value="high">$50,000 - $100,000</option>
              <option value="very-high">Over $100,000</option>
            </select>
          </div>

          <button
            onClick={generatePlan}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
          >
            Generate Timeline
          </button>
        </div>

        <div>
          {plan ? (
            <div className="space-y-4">
              {plan.categoryData && (
                <div className={`p-3 rounded-lg border ${plan.categoryData.color}`}>
                  <p className="font-semibold">{plan.categoryData.name}: {plan.categoryData.label}</p>
                  <p className="text-sm">{plan.categoryData.leadTime}</p>
                </div>
              )}

              <div>
                <p className="font-semibold text-sm mb-2">Timeline:</p>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {plan.timeline.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-start gap-2 text-sm">
                      <item.icon className="w-4 h-4 mt-0.5 shrink-0 text-foreground0" />
                      <div>
                        <p className="font-medium">{item.event}</p>
                        <p className="text-xs text-foreground0">
                          {item.date.toLocaleDateString('en-US', { 
                            weekday: 'short', 
                            year: 'numeric', 
                            month: 'short', 
                            day: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-gray-400">
              <p>Enter details to generate your show timeline</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Module5_Intl_Shows: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'categories' | 'timeline' | 'checklist' | 'planner'>('overview');

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white p-6 rounded-lg shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <Plane className="w-8 h-8" />
          <h1 className="text-2xl font-bold">Module 5.5: International Laser Shows</h1>
        </div>
        <p className="text-blue-100">
          ILDA country categories (A, B, F, G, X), documentation requirements, 
          permit lead times by country, and the "Taking my show overseas" planner.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b">
        {[
          { id: 'overview', label: 'Overview', icon: Info },
          { id: 'categories', label: 'ILDA Categories', icon: Globe },
          { id: 'timeline', label: 'Lead Times', icon: Clock },
          { id: 'checklist', label: 'Documentation', icon: ClipboardList },
          { id: 'planner', label: 'Show Planner', icon: Calendar }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 font-medium transition-colors ${
              activeTab === tab.id 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-600 hover:text-blue-500'
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
          {/* ILDA Disclaimer */}
          <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-amber-900">ILDA Disclaimer</h3>
                <p className="text-amber-800 text-sm mt-1">
                  The information presented is NOT official. ILDA is not liable for the accuracy 
                  of this information, most of which was compiled in mid-2014. Anyone doing audience 
                  scanning is responsible for following all local laws and regulations. Always verify 
                  current requirements with local authorities before booking international shows.
                </p>
              </div>
            </div>
          </div>

          {/* ILDA Member Requirements */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900">ILDA Member Safety Affirmation</h3>
                <p className="text-blue-800 text-sm mt-1">
                  ILDA Members are required to affirm the safety of their laser shows, regardless 
                  of any laws or regulations. Specifically:
                </p>
                <ul className="text-blue-800 text-sm mt-2 space-y-1">
                  <li>1. Pulsed lasers should never be used for audience scanning</li>
                  <li>2. If they do not understand audience-scanning standards or lack equipment/procedures 
                      to ensure safety, they will not perform audience scanning</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Category Overview */}
          <div className="grid md:grid-cols-4 gap-4">
            {Object.entries(ildaCategories).slice(0, 4).map(([key, data]) => (
              <div key={key} className={`p-4 rounded-lg border ${data.color}`}>
                <span className="text-2xl font-bold">{key}</span>
                <p className="font-medium mt-1">{data.label}</p>
                <p className="text-xs mt-1 opacity-90">{data.countries.length} countries</p>
              </div>
            ))}
          </div>

          {/* Key Statistics */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Key Statistics</h3>
            <div className="grid md:grid-cols-4 gap-4 text-center">
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-3xl font-bold text-blue-600">
                  {Object.values(ildaCategories).reduce((acc, cat) => acc + cat.countries.length, 0)}
                </p>
                <p className="text-sm text-gray-600">Countries Listed</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-3xl font-bold text-green-600">
                  {ildaCategories.D.countries.length}
                </p>
                <p className="text-sm text-gray-600">Permit-Free (Cat D)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-3xl font-bold text-blue-600">
                  {ildaCategories.A.countries.length}
                </p>
                <p className="text-sm text-gray-600">Permit Required (Cat A)</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <p className="text-3xl font-bold text-gray-600">
                  {ildaCategories.X.countries.length}
                </p>
                <p className="text-sm text-gray-600">Unknown Status (Cat X)</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'categories' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-4">
            {Object.entries(ildaCategories).map(([key, data]) => (
              <CategoryCard key={key} code={key} category={data} />
            ))}
          </div>
        </div>
      )}

      {activeTab === 'timeline' && (
        <div className="space-y-6">
          <LeadTimeVisualizer />
          
          {/* Country-specific lead times table */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4">Country-Specific Lead Times</h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="p-3 text-left font-semibold">Country</th>
                    <th className="p-3 text-left font-semibold">Category</th>
                    <th className="p-3 text-left font-semibold">Lead Time</th>
                    <th className="p-3 text-left font-semibold">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Germany</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">A</span></td>
                    <td className="p-3">6-8 weeks</td>
                    <td className="p-3">TÜV standards expected</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Switzerland</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">A</span></td>
                    <td className="p-3">14 days</td>
                    <td className="p-3">Online portal, competence certificate required</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">United Kingdom</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">A</span></td>
                    <td className="p-3">1-2 weeks (venue)</td>
                    <td className="p-3">No government permit, venue may require notice</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Canada</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs">D</span></td>
                    <td className="p-3">4-8 weeks (outdoor)</td>
                    <td className="p-3">Transport Canada for outdoor shows</td>
                  </tr>
                  <tr className="border-b hover:bg-gray-50">
                    <td className="p-3">Finland</td>
                    <td className="p-3"><span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">A</span></td>
                    <td className="p-3">6-8 weeks</td>
                    <td className="p-3">STUK inspection required</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'checklist' && (
        <div className="space-y-6">
          <DocumentationChecklistComponent />
          
          {/* Tips */}
          <div className="bg-amber-50 p-6 rounded-lg border border-amber-200">
            <h3 className="font-semibold text-amber-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Documentation Tips
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-amber-800">
              <li>• Translate key documents to local language for customs</li>
              <li>• Carry both physical and digital copies of all documents</li>
              <li>• Email copies to yourself and a colleague as backup</li>
              <li>• Verify ATA Carnet coverage for your destination countries</li>
              <li>• Check visa requirements well in advance (some take months)</li>
            </ul>
          </div>
        </div>
      )}

      {activeTab === 'planner' && (
        <div className="space-y-6">
          <ShowPlanner />
          
          {/* Budget considerations */}
          <div className="bg-card p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Budget Considerations
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Fixed Costs</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between"><span>ATA Carnet</span><span className="font-medium">$500-2,000</span></li>
                  <li className="flex justify-between"><span>Visa fees</span><span className="font-medium">$50-500</span></li>
                  <li className="flex justify-between"><span>Permit fees</span><span className="font-medium">$0-1,000</span></li>
                  <li className="flex justify-between"><span>Insurance rider</span><span className="font-medium">$200-1,000</span></li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Variable Costs</h4>
                <ul className="space-y-1 text-sm">
                  <li className="flex justify-between"><span>Air freight</span><span className="font-medium">$500-5,000</span></li>
                  <li className="flex justify-between"><span>Local agent</span><span className="font-medium">$500-2,000</span></li>
                  <li className="flex justify-between"><span>Legal consultation</span><span className="font-medium">$500-3,000</span></li>
                  <li className="flex justify-between"><span>Extra lead time accommodation</span><span className="font-medium">Varies</span></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Module5_Intl_Shows;
