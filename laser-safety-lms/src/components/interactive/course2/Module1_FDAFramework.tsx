'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import {
  Shield,
  Clock,
  Scale,
  BookOpen,
  Building,
  CheckCircle,
  AlertCircle,
  Info,
  FileText,
  History,
  Landmark,
  ChevronDown,
  ChevronRight,
  Globe
} from 'lucide-react';

// ============================================================================
// DESIGN SYSTEM CONSTANTS - FDA GOVERNMENT AESTHETIC
// ============================================================================

const FDA_COLORS = {
  primary: '#1a4480',      // Official government blue
  primaryLight: '#d9e8f6', // Light blue background
  primaryDark: '#0f2d5e',  // Dark blue for emphasis
  accent: '#c9a227',       // Government gold/amber
  success: '#15803d',      // Official green
  warning: '#d97706',      // Warning amber
  danger: '#b91c1c',       // Critical red
  slate: '#475569',        // Text slate
  border: '#cbd5e1',       // Border color
};

const SECTION_STYLES = {
  blue:   { border: 'border-l-[#1a4480]', bg: 'bg-gradient-to-r from-[#d9e8f6]/50 to-transparent', icon: 'bg-[#1a4480]' },
  indigo: { border: 'border-l-indigo-700', bg: 'bg-gradient-to-r from-indigo-50/50 to-transparent', icon: 'bg-indigo-700' },
  amber:  { border: 'border-l-amber-600', bg: 'bg-gradient-to-r from-amber-50/50 to-transparent', icon: 'bg-amber-600' },
  green:  { border: 'border-l-green-700', bg: 'bg-gradient-to-r from-green-50/50 to-transparent', icon: 'bg-green-700' },
};

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface TimelineEvent {
  year: string;
  title: string;
  description: string;
  details: string[];
  category: 'regulatory' | 'technical' | 'guidance';
}

interface JurisdictionItem {
  id: string;
  category: 'FDA' | 'OSHA' | 'State' | 'Local' | 'ANSI';
  description: string;
  scope: string;
  regulations: string[];
}

interface FDAClass {
  class: string;
  name: string;
  power: string;
  hazard: string;
  requirements: string[];
  color: string;
  textColor: string;
  borderColor: string;
  bgColor: string;
}

interface ComparisonItem {
  aspect: string;
  before2023: string;
  after2023: string;
  impact: 'high' | 'medium' | 'low';
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    year: '1960',
    title: 'First Laser Demonstrated',
    description: 'Theodore Maiman demonstrates the first working laser at Hughes Research Laboratories.',
    details: [
      'Ruby laser producing 694.3 nm red light',
      'Marked the beginning of laser technology',
      'No regulatory framework existed at this time'
    ],
    category: 'technical'
  },
  {
    year: '1968',
    title: 'Radiation Control for Health and Safety Act',
    description: 'Congress passes legislation giving FDA authority to regulate radiation-emitting electronic products.',
    details: [
      'Signed into law by President Johnson',
      'Established FDA\'s regulatory authority',
      'Precursor to modern laser regulations'
    ],
    category: 'regulatory'
  },
  {
    year: '1976',
    title: '21 CFR 1040 Enacted',
    description: 'FDA establishes the federal performance standard for laser products.',
    details: [
      'Effective August 2, 1976',
      'Established Classes I-IV classification system',
      'Defined safety interlock and labeling requirements',
      'Required product reporting to CDRH'
    ],
    category: 'regulatory'
  },
  {
    year: '1985',
    title: 'Laser Notice 37',
    description: 'Guidance issued for industrial workstations large enough for person entry.',
    details: [
      'October 21, 1985 issuance',
      'Addressed special industrial applications',
      'Provided flexible compliance options'
    ],
    category: 'guidance'
  },
  {
    year: '1986',
    title: 'Manual Reset Requirement Added',
    description: 'Class IV laser systems required to have manual restart after power failure.',
    details: [
      'Applies to products manufactured after August 20, 1986',
      'Prevents unexpected restart after power interruption',
      'Required for safety in high-power applications'
    ],
    category: 'technical'
  },
  {
    year: '1995',
    title: 'Product Reporting Guide Updated',
    description: 'FDA 3632 guide for preparing product reports released.',
    details: [
      'Standardized report format',
      'Clarified supplemental reporting requirements',
      'Still in use with 2023 updates'
    ],
    category: 'guidance'
  },
  {
    year: '2001',
    title: 'Laser Notice 50 (Original)',
    description: 'Initial guidance on conformance with IEC 60825-1 Amendment 2.',
    details: [
      'First major harmonization effort with IEC',
      'Allowed alternative compliance pathway',
      'Reduced regulatory burden for global manufacturers'
    ],
    category: 'guidance'
  },
  {
    year: '2007',
    title: 'Laser Notice 50 (Revised)',
    description: 'Updated guidance harmonizing with IEC 60825-1 Editions 1.2 and 2.',
    details: [
      'June 24, 2007 issuance',
      'Expanded IEC conformance recognition',
      'Modified certification labeling requirements'
    ],
    category: 'guidance'
  },
  {
    year: '2014',
    title: 'Laser Notice 56',
    description: 'Guidance on conformance with IEC 60825-1 Ed. 3 and IEC 60601-2-22 Ed. 3.1.',
    details: [
      'Further harmonization with international standards',
      'Addressed medical laser products',
      'Updated reporting exemptions'
    ],
    category: 'guidance'
  },
  {
    year: '2023',
    title: 'FDA Final Rule - Major Harmonization',
    description: 'Comprehensive amendments to radiological health regulations.',
    details: [
      'Effective February 21, 2023',
      'Harmonized with IEC 60825-1 Ed. 3',
      'Modified reporting requirements',
      'Updated classification criteria',
      'Laser Notices 41-56 incorporated or superseded'
    ],
    category: 'regulatory'
  }
];

const JURISDICTION_ITEMS: JurisdictionItem[] = [
  {
    id: 'fda-1',
    category: 'FDA',
    description: 'Laser Product Manufacturers',
    scope: 'Products entering U.S. commerce',
    regulations: ['21 CFR 1040.10', '21 CFR 1040.11', '21 CFR 1002.10 (Product Reports)']
  },
  {
    id: 'fda-2',
    category: 'FDA',
    description: 'Demonstration Laser Products',
    scope: 'Laser light shows and displays',
    regulations: ['21 CFR 1040.11(c)', 'Variance Applications (FDA 3147)']
  },
  {
    id: 'fda-3',
    category: 'FDA',
    description: 'Medical Laser Products',
    scope: 'Devices for human treatment',
    regulations: ['21 CFR 1040.11(a)', '21 CFR 1040.10(i) - Modifications']
  },
  {
    id: 'osha-1',
    category: 'OSHA',
    description: 'Workplace Laser Safety',
    scope: 'Employee protection',
    regulations: ['29 CFR 1910 (General Duty Clause)', 'ANSI Z136.1 incorporation']
  },
  {
    id: 'state-1',
    category: 'State',
    description: 'Registration & Licensing',
    scope: 'Laser device registration',
    regulations: ['Varies by state (e.g., California, Texas, New York)']
  },
  {
    id: 'state-2',
    category: 'State',
    description: 'Medical Use',
    scope: 'Clinical applications',
    regulations: ['State medical boards', 'Department of Health regulations']
  },
  {
    id: 'ansi-1',
    category: 'ANSI',
    description: 'Safety Standards',
    scope: 'User safety guidelines',
    regulations: ['ANSI Z136.1 (General)', 'ANSI Z136.8 (Entertainment)']
  }
];

const FDA_CLASSES: FDAClass[] = [
  {
    class: 'I',
    name: 'Class I',
    power: '≤ 0.4 μW (inherently safe)',
    hazard: 'No hazard under normal use',
    requirements: ['Protective housing', 'Certification label', 'Identification label'],
    color: 'bg-green-500',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    bgColor: 'bg-green-50'
  },
  {
    class: 'IIa',
    name: 'Class IIa',
    power: '> Class I, ≤ 1 mW (accidental viewing)',
    hazard: 'Low hazard for accidental viewing',
    requirements: ['Class I requirements +', 'Warning label (no logotype)'],
    color: 'bg-emerald-500',
    textColor: 'text-emerald-700',
    borderColor: 'border-emerald-200',
    bgColor: 'bg-emerald-50'
  },
  {
    class: 'II',
    name: 'Class II',
    power: 'Visible: > 0.25 sec exposure, ≤ 1 mW',
    hazard: 'Hazard for direct long-term ocular exposure',
    requirements: ['CAUTION logotype', 'Aperture label', 'Emission indicator'],
    color: 'bg-yellow-500',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    bgColor: 'bg-yellow-50'
  },
  {
    class: 'IIIa',
    name: 'Class IIIa',
    power: 'Visible: ≤ 5 mW total power',
    hazard: 'Ocular hazard from intrabeam viewing',
    requirements: ['CAUTION or DANGER logotype*', 'Remote interlock connector for > 2.5 mW/cm²'],
    color: 'bg-orange-500',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    bgColor: 'bg-orange-50'
  },
  {
    class: 'IIIb',
    name: 'Class IIIb',
    power: '5-500 mW (visible); UV/IR equivalents',
    hazard: 'Ocular and skin hazards',
    requirements: ['DANGER logotype', 'Key control', 'Remote interlock', 'Beam attenuator', 'Annual reporting'],
    color: 'bg-red-500',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    bgColor: 'bg-red-50'
  },
  {
    class: 'IV',
    name: 'Class IV',
    power: '> Class IIIb limits',
    hazard: 'Hazard from scattered/diffuse reflection',
    requirements: ['DANGER logotype', 'All IIIb requirements +', 'Manual reset', 'Protective eyewear recommended'],
    color: 'bg-red-700',
    textColor: 'text-red-800',
    borderColor: 'border-red-300',
    bgColor: 'bg-red-50'
  }
];

const COMPARISON_ITEMS: ComparisonItem[] = [
  {
    aspect: 'Classification System',
    before2023: 'Classes I, IIa, II, IIIa, IIIb, IV',
    after2023: 'Classes I, II, IIIa, IIIb, IV (IIa integrated)',
    impact: 'high'
  },
  {
    aspect: 'Measurement Aperture',
    before2023: '7mm fixed aperture',
    after2023: 'Conditional aperture based on source',
    impact: 'medium'
  },
  {
    aspect: 'IEC Harmonization',
    before2023: 'Laser Notice 50/56 guidance-based',
    after2023: 'Direct regulatory harmonization with IEC 60825-1 Ed. 3',
    impact: 'high'
  },
  {
    aspect: 'Reporting Requirements',
    before2023: 'Annual reports for IIIb/IV',
    after2023: 'Modified reporting thresholds',
    impact: 'medium'
  },
  {
    aspect: 'Certification Label',
    before2023: 'Complies with 21 CFR 1040.10',
    after2023: 'Modified statements for IEC conformance',
    impact: 'medium'
  },
  {
    aspect: 'Laser Notices',
    before2023: 'Multiple notices (37, 41, 42, 50, 56)',
    after2023: 'Incorporated into regulations',
    impact: 'high'
  }
];

const IEC_VS_FDA = [
  { aspect: 'Class Names', fda: 'Class I, II, IIIa, IIIb, IV', iec: 'Class 1, 1M, 2, 2M, 3R, 3B, 4' },
  { aspect: 'Aperture', fda: '7mm for all measurements', iec: '7mm or 50mm depending on class' },
  { aspect: 'Measurement Distance', fda: '10 cm from source', iec: '100 mm or variable' },
  { aspect: 'Class IIa', fda: 'Separate class exists', iec: 'Not a distinct class' },
  { aspect: 'Class IIIa Limit', fda: '5 mW visible', iec: 'Class 3R: 5× Class 2 limit' },
  { aspect: 'Remote Interlock', fda: 'Required for IIIb/IV', iec: 'Required for Class 3B/4' },
  { aspect: 'Key Control', fda: 'Required for IIIb/IV', iec: 'Required for Class 3B/4' },
  { aspect: 'Scanning Safeguard', fda: 'Required if specified', iec: 'Similar requirements' },
  { aspect: 'Collateral Radiation', fda: 'Table VI limits', iec: 'Different approach' },
  { aspect: 'Certification', fda: 'Mandatory FDA statement', iec: 'CE marking in EU' }
];

const CDRH_ORGANIZATION = {
  name: 'Center for Devices and Radiological Health (CDRH)',
  division: 'Office of Health Technology 8 (OHT8)',
  branch: 'Office of Radiological Health',
  contact: {
    phone: '1-800-638-2041',
    email: 'dsmica@fda.hhs.gov',
    address: '10903 New Hampshire Avenue, Silver Spring, MD 20993'
  },
  responsibilities: [
    'Product report review and acknowledgment',
    'Accession number assignment',
    'Testing program evaluation',
    'Radiation defect determination',
    'Import compliance monitoring',
    'Variance application review'
  ]
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function SectionHeader({ title, subtitle, icon: Icon, color = 'blue' }: { 
  title: string; 
  subtitle: string; 
  icon: React.ElementType;
  color?: 'blue' | 'indigo' | 'amber' | 'green';
}) {
  const styles = SECTION_STYLES[color];
  return (
    <CardHeader className={`${styles.bg} border-b border-slate-200/60`}>
      <CardTitle className="text-xl flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg ${styles.icon} text-white flex items-center justify-center shadow-md`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <div className="text-lg font-bold text-slate-900">{title}</div>
          <div className="text-sm font-normal text-slate-600">{subtitle}</div>
        </div>
      </CardTitle>
    </CardHeader>
  );
}

function InfoBox({ 
  children, 
  variant = 'info',
  title,
  icon: Icon = Info
}: { 
  children: React.ReactNode; 
  variant?: 'info' | 'success' | 'warning' | 'danger';
  title?: string;
  icon?: React.ElementType;
}) {
  const variants = {
    info:    { bg: 'bg-[#d9e8f6]', border: 'border-[#1a4480]', text: 'text-[#1a4480]', icon: 'text-[#1a4480]' },
    success: { bg: 'bg-green-50', border: 'border-green-600', text: 'text-green-800', icon: 'text-green-600' },
    warning: { bg: 'bg-amber-50', border: 'border-amber-600', text: 'text-amber-800', icon: 'text-amber-600' },
    danger:  { bg: 'bg-red-50', border: 'border-red-600', text: 'text-red-800', icon: 'text-red-600' },
  };
  const v = variants[variant];
  
  return (
    <div className={`p-5 ${v.bg} rounded-xl border-l-4 ${v.border} shadow-sm`}>
      {title && (
        <div className={`flex items-center gap-2 mb-3 font-semibold ${v.text}`}>
          <Icon className={`w-5 h-5 ${v.icon}`} />
          {title}
        </div>
      )}
      <div className={`text-sm ${v.text} leading-relaxed`}>{children}</div>
    </div>
  );
}

function ComparisonTable({ data, showFull }: { data: typeof IEC_VS_FDA; showFull: boolean }) {
  const displayData = showFull ? data : data.slice(0, 4);
  
  return (
    <div className="overflow-x-auto rounded-xl border border-slate-300 shadow-sm">
      <table className="w-full text-sm">
        <thead>
          <tr className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-300">
            <th className="text-left py-4 px-5 font-bold text-slate-800 w-1/4">Aspect</th>
            <th className="text-left py-4 px-5 font-bold text-[#1a4480]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1a4480]" />
                FDA (21 CFR 1040)
              </div>
            </th>
            <th className="text-left py-4 px-5 font-bold text-indigo-700">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                IEC (60825-1)
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {displayData.map((row, i) => (
            <tr 
              key={row.aspect} 
              className={`border-b last:border-0 transition-colors hover:bg-slate-50 ${i % 2 === 1 ? 'bg-slate-50/50' : 'bg-card'}`}
            >
              <td className="py-4 px-5 font-semibold text-slate-700 border-r border-slate-100">{row.aspect}</td>
              <td className="py-4 px-5 text-[#1a4480] font-medium border-r border-slate-100">{row.fda}</td>
              <td className="py-4 px-5 text-indigo-700">{row.iec}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ============================================================================
// SECTION 1: FDA JURISDICTION & AUTHORITY
// ============================================================================

function JurisdictionSection() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState<Record<string, boolean>>({});

  const categories = ['FDA', 'OSHA', 'State', 'ANSI'] as const;

  const toggleDetails = (id: string) => {
    setShowDetails(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredItems = selectedCategory
    ? JURISDICTION_ITEMS.filter(item => item.category === selectedCategory)
    : JURISDICTION_ITEMS;

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'FDA': return <Shield className="w-3.5 h-3.5" />;
      case 'OSHA': return <Building className="w-3.5 h-3.5" />;
      case 'State': return <Landmark className="w-3.5 h-3.5" />;
      case 'ANSI': return <BookOpen className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  const getCategoryBadgeStyle = (category: string) => {
    switch (category) {
      case 'FDA': return 'bg-[#d9e8f6] text-[#1a4480] border-[#1a4480]/30 font-semibold';
      case 'OSHA': return 'bg-slate-100 text-slate-800 border-slate-300 font-semibold';
      case 'State': return 'bg-indigo-50 text-indigo-800 border-indigo-300 font-semibold';
      case 'ANSI': return 'bg-cyan-50 text-cyan-800 border-cyan-300 font-semibold';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <Card className="border-l-4 border-l-[#1a4480] shadow-md">
      <SectionHeader 
        title="FDA Jurisdiction & Authority" 
        subtitle="Understanding who regulates what in laser safety"
        icon={Landmark}
        color="blue"
      />
      <CardContent className="space-y-8 pt-6">
        {/* Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <InfoBox variant="info" title="What FDA Regulates">
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Laser product <strong>manufacturers</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Products entering <strong>U.S. commerce</strong></span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span><strong>Imported</strong> laser products</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span><strong>Modified</strong> certified products</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" />
                <span>Demonstration (light show) products</span>
              </li>
            </ul>
          </InfoBox>
          <InfoBox variant="warning" title="What FDA Does NOT Regulate" icon={AlertCircle}>
            <ul className="space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span><strong>End users</strong> of laser products</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Workplace <strong>safety practices</strong> (OSHA)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span><strong>Repair/replacement</strong> components</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Products for <strong>export only</strong> (21 CFR 1010.20)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-amber-600 mt-0.5">•</span>
                <span>Component parts for <strong>further manufacturing</strong></span>
              </li>
            </ul>
          </InfoBox>
        </div>

        {/* 21 CFR 1040 Overview */}
        <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-300 shadow-sm">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-md">
              <FileText className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-amber-900 text-lg">21 CFR 1040 Overview</h4>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
            <div className="p-4 bg-card/80 rounded-lg border border-amber-200 shadow-sm">
              <p className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                1040.10 - Laser Products
              </p>
              <ul className="text-amber-700 space-y-2 ml-4">
                <li>• Definitions (Section b)</li>
                <li>• Classification (Section c)</li>
                <li>• Accessible emission limits (Section d)</li>
                <li>• Performance requirements (Section f)</li>
                <li>• Labeling requirements (Section g)</li>
              </ul>
            </div>
            <div className="p-4 bg-card/80 rounded-lg border border-amber-200 shadow-sm">
              <p className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                1040.11 - Specific Products
              </p>
              <ul className="text-amber-700 space-y-2 ml-4">
                <li>• Medical laser products (a)</li>
                <li>• Surveying/leveling products (b)</li>
                <li>• Demonstration products (c)</li>
                <li>• Special application requirements</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Interactive Jurisdiction Map */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <Scale className="w-6 h-6 text-[#1a4480]" />
            <h4 className="font-bold text-lg text-slate-900">Interactive Jurisdiction Map</h4>
          </div>
          <p className="text-sm text-slate-600">Click a category to filter regulatory responsibilities:</p>
          
          <div className="flex flex-wrap gap-2">
            <Button
              variant={selectedCategory === null ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(null)}
              className={selectedCategory === null ? 'bg-[#1a4480] hover:bg-[#0f2d5e]' : 'border-slate-300'}
            >
              All Categories
            </Button>
            {categories.map(cat => (
              <Button
                key={cat}
                variant={selectedCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedCategory(cat)}
                className={selectedCategory === cat ? 'bg-[#1a4480] hover:bg-[#0f2d5e]' : 'border-slate-300'}
              >
                {cat}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 gap-3">
            {filteredItems.map(item => (
              <div
                key={item.id}
                className="border border-slate-200 rounded-xl p-5 cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all hover:shadow-md bg-card"
                onClick={() => toggleDetails(item.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Badge 
                      variant="outline"
                      className={`${getCategoryBadgeStyle(item.category)} flex items-center gap-1.5 px-3 py-1.5`}
                    >
                      {getCategoryIcon(item.category)}
                      {item.category}
                    </Badge>
                    <span className="font-semibold text-slate-900">{item.description}</span>
                  </div>
                  <span className="text-slate-400">
                    {showDetails[item.id] ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                  </span>
                </div>
                {showDetails[item.id] && (
                  <div className="mt-4 pl-[5.5rem] space-y-4 text-sm border-t border-slate-100 pt-4">
                    <p><span className="font-semibold text-slate-700">Scope:</span> <span className="text-slate-600">{item.scope}</span></p>
                    <div>
                      <span className="font-semibold text-slate-700">Applicable Regulations:</span>
                      <ul className="mt-2 space-y-1.5 text-slate-600">
                        {item.regulations.map((reg, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                            <code className="bg-slate-100 px-2 py-0.5 rounded text-xs">{reg}</code>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 2: HISTORICAL TIMELINE
// ============================================================================

function TimelineSection() {
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [filterCategory, setFilterCategory] = useState<'all' | 'regulatory' | 'technical' | 'guidance'>('all');

  const filteredEvents = filterCategory === 'all'
    ? TIMELINE_EVENTS
    : TIMELINE_EVENTS.filter(e => e.category === filterCategory);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'regulatory': return 'bg-red-600';
      case 'technical': return 'bg-[#1a4480]';
      case 'guidance': return 'bg-green-600';
      default: return 'bg-slate-500';
    }
  };

  const getCategoryBg = (cat: string) => {
    switch (cat) {
      case 'regulatory': return 'bg-red-50 border-red-200';
      case 'technical': return 'bg-[#d9e8f6] border-[#1a4480]/20';
      case 'guidance': return 'bg-green-50 border-green-200';
      default: return 'bg-slate-50 border-slate-200';
    }
  };

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'regulatory': return <Scale className="w-3.5 h-3.5" />;
      case 'technical': return <Clock className="w-3.5 h-3.5" />;
      case 'guidance': return <BookOpen className="w-3.5 h-3.5" />;
      default: return null;
    }
  };

  return (
    <Card className="border-l-4 border-l-indigo-700 shadow-md">
      <SectionHeader 
        title="Historical Timeline" 
        subtitle="Key regulatory milestones from 1960 to present"
        icon={History}
        color="indigo"
      />
      <CardContent className="space-y-6 pt-6">
        {/* Legend & Filter */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
          <div className="flex flex-wrap gap-5 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-red-600 shadow-sm"></span>
              <span className="font-semibold text-slate-700">Regulatory</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-[#1a4480] shadow-sm"></span>
              <span className="font-semibold text-slate-700">Technical</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-4 h-4 rounded-full bg-green-600 shadow-sm"></span>
              <span className="font-semibold text-slate-700">Guidance</span>
            </div>
          </div>
          <div className="flex gap-2">
            {(['all', 'regulatory', 'technical', 'guidance'] as const).map(cat => (
              <Button
                key={cat}
                variant={filterCategory === cat ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterCategory(cat)}
                className={filterCategory === cat ? 'bg-indigo-700 hover:bg-indigo-800' : 'border-slate-300'}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </Button>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="relative space-y-0">
          <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-slate-300 via-slate-200 to-slate-300"></div>
          
          {filteredEvents.map((event, index) => (
            <div key={event.year} className="relative pl-16 pb-8">
              {/* Dot with number */}
              <div className={`absolute left-2 top-1 w-9 h-9 rounded-full ${getCategoryColor(event.category)} border-4 border-white shadow-lg ring-2 ring-slate-100 flex items-center justify-center`}>
                <span className="text-white text-xs font-bold">{index + 1}</span>
              </div>
              
              {/* Content */}
              <div
                className={`border-2 rounded-xl p-5 cursor-pointer transition-all hover:shadow-lg ${getCategoryBg(event.category)} ${expandedEvent === event.year ? 'shadow-md' : ''}`}
                onClick={() => setExpandedEvent(expandedEvent === event.year ? null : event.year)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-wrap">
                    <Badge className="font-mono text-sm px-3 py-1.5 bg-card shadow-sm border-0 font-bold">
                      {event.year}
                    </Badge>
                    <span className="font-bold text-lg text-slate-900">{event.title}</span>
                    <Badge variant="secondary" className="text-xs flex items-center gap-1.5 px-2.5 py-1">
                      {getCategoryIcon(event.category)}
                      {event.category}
                    </Badge>
                  </div>
                  <span className="text-slate-400 text-xl font-bold">
                    {expandedEvent === event.year ? '−' : '+'}
                  </span>
                </div>
                <p className="text-sm text-slate-600 mt-3 leading-relaxed">{event.description}</p>
                
                {expandedEvent === event.year && (
                  <div className="mt-5 pt-4 border-t border-slate-200/60 space-y-4">
                    <p className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                      <Info className="w-4 h-4 text-[#1a4480]" />
                      Key Details:
                    </p>
                    <ul className="text-sm space-y-2 text-slate-600 ml-2">
                      {event.details.map((detail, i) => (
                        <li key={i} className="flex items-start gap-3">
                          <span className="text-[#1a4480] mt-1">•</span>
                          <span>{detail}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 3: THE 2023 FINAL RULE
// ============================================================================

function FinalRuleSection() {
  const [showComparison, setShowComparison] = useState(false);
  const [selectedAspect, setSelectedAspect] = useState<string | null>(null);

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'high':
        return <Badge className="w-24 justify-center bg-red-100 text-red-800 border-red-300 hover:bg-red-100 font-bold">HIGH IMPACT</Badge>;
      case 'medium':
        return <Badge className="w-24 justify-center bg-amber-100 text-amber-800 border-amber-300 hover:bg-amber-100 font-bold">MEDIUM</Badge>;
      case 'low':
        return <Badge className="w-24 justify-center bg-green-100 text-green-800 border-green-300 hover:bg-green-100 font-bold">LOW</Badge>;
      default:
        return <Badge className="w-24 justify-center">{impact.toUpperCase()}</Badge>;
    }
  };

  return (
    <Card className="border-l-4 border-l-amber-600 shadow-md">
      <SectionHeader 
        title="The 2023 Final Rule" 
        subtitle="Major harmonization changes effective February 21, 2023"
        icon={Scale}
        color="amber"
      />
      <CardContent className="space-y-8 pt-6">
        {/* Overview */}
        <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-300 shadow-sm">
          <h4 className="font-bold text-amber-900 mb-4 flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-lg bg-amber-600 text-white flex items-center justify-center shadow-md">
              <AlertCircle className="w-5 h-5" />
            </div>
            What Changed?
          </h4>
          <p className="text-sm text-amber-800 mb-5 leading-relaxed">
            The FDA amended records and reports regulations for radiation-emitting electronic products 
            to harmonize with international standards (IEC 60825-1 Ed. 3 and IEC 60601-2-22 Ed. 3.1).
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-card/90 p-4 rounded-lg border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-900">Effective Date</span>
              </div>
              <p className="text-amber-700 font-bold text-lg">February 21, 2023</p>
            </div>
            <div className="bg-card/90 p-4 rounded-lg border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-900">Federal Register</span>
              </div>
              <p className="text-amber-700 font-bold">88 FR 3638 (Jan 20, 2023)</p>
            </div>
            <div className="bg-card/90 p-4 rounded-lg border border-amber-200 shadow-sm">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-amber-600" />
                <span className="font-bold text-amber-900">CFR Reference</span>
              </div>
              <p className="text-amber-700 font-bold">21 CFR 1002.1 et seq.</p>
            </div>
          </div>
        </div>

        {/* Major Changes */}
        <div className="space-y-5">
          <h4 className="font-bold text-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5" />
            </div>
            Major Changes
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { title: 'IEC Harmonization', desc: 'Direct incorporation of IEC 60825-1 Ed. 3 requirements into federal regulations', icon: Globe },
              { title: 'Classification Updates', desc: 'Streamlined class structure with modified measurement conditions', icon: Scale },
              { title: 'Reporting Modifications', desc: 'Updated product report requirements and exemptions', icon: FileText },
              { title: 'Laser Notices', desc: 'Many historical Laser Notices now incorporated into regulations', icon: BookOpen }
            ].map((change, i) => (
              <div key={i} className="flex items-start gap-4 p-5 border-2 rounded-xl hover:bg-slate-50 transition-colors shadow-sm bg-card border-slate-200">
                <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 text-white flex items-center justify-center shrink-0 shadow-md font-bold text-lg">
                  {i + 1}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-base">{change.title}</p>
                  <p className="text-sm text-slate-600 leading-relaxed mt-1">{change.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Interactive Comparison */}
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h4 className="font-bold text-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              Before/After Comparison
            </h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowComparison(!showComparison)}
              className="border-slate-300"
            >
              {showComparison ? 'Hide' : 'Show'} All Details
            </Button>
          </div>

          <div className="space-y-4">
            {COMPARISON_ITEMS.map((item) => (
              <div
                key={item.aspect}
                className="border-2 border-slate-200 rounded-xl overflow-hidden transition-all hover:shadow-md bg-card"
              >
                <div 
                  className="p-5 flex items-center justify-between hover:bg-slate-50 cursor-pointer"
                  onClick={() => setSelectedAspect(selectedAspect === item.aspect ? null : item.aspect)}
                >
                  <div className="flex items-center gap-5">
                    {getImpactBadge(item.impact)}
                    <span className="font-bold text-slate-900 text-base">{item.aspect}</span>
                  </div>
                  <span className="text-slate-400 text-xl font-bold">
                    {selectedAspect === item.aspect ? '−' : '+'}
                  </span>
                </div>
                
                {(selectedAspect === item.aspect || showComparison) && (
                  <div className="px-5 pb-5 grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                    <div className="p-5 bg-red-50 rounded-lg border-2 border-red-200">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="w-3 h-3 rounded-full bg-red-500" />
                        <span className="font-bold text-red-800 text-base">Before 2023</span>
                      </div>
                      <p className="text-red-700 leading-relaxed">{item.before2023}</p>
                    </div>
                    <div className="p-5 bg-green-50 rounded-lg border-2 border-green-200">
                      <div className="flex items-center gap-2 mb-3">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        <span className="font-bold text-green-800 text-base">After 2023</span>
                      </div>
                      <p className="text-green-700 leading-relaxed">{item.after2023}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Compliance Deadlines */}
        <div className="p-6 bg-gradient-to-br from-[#d9e8f6] to-blue-100 rounded-xl border-2 border-[#1a4480]/30 shadow-sm">
          <h4 className="font-bold text-[#1a4480] mb-5 flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-lg bg-[#1a4480] text-white flex items-center justify-center shadow-md">
              <Clock className="w-5 h-5" />
            </div>
            Compliance Deadlines
          </h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-4 p-4 bg-card/90 rounded-lg border border-[#1a4480]/20 shadow-sm">
              <Badge className="bg-[#1a4480] text-white border-0 shrink-0">EFFECTIVE</Badge>
              <span className="text-slate-700"><strong className="text-[#1a4480]">February 21, 2023:</strong> All new products must comply with amended regulations</span>
            </div>
            <div className="flex items-start gap-4 p-4 bg-card/90 rounded-lg border border-[#1a4480]/20 shadow-sm">
              <Badge className="bg-blue-600 text-white border-0 shrink-0">REPORTING</Badge>
              <span className="text-slate-700"><strong className="text-blue-700">Ongoing:</strong> Product reports must reflect current requirements</span>
            </div>
            <div className="flex items-start gap-4 p-4 bg-card/90 rounded-lg border border-[#1a4480]/20 shadow-sm">
              <Badge className="bg-indigo-600 text-white border-0 shrink-0">LABELS</Badge>
              <span className="text-slate-700"><strong className="text-indigo-700">Updated:</strong> Certification statements may need modification for IEC conformance</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 4: PRODUCT CLASSIFICATION
// ============================================================================

function ClassificationSection() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [showComparisonTable, setShowComparisonTable] = useState(false);
  const [classificationInputs, setClassificationInputs] = useState({
    wavelength: '',
    power: '',
    pulsed: false
  });

  const activeClass = FDA_CLASSES.find(c => c.class === selectedClass);

  const getSuggestedClass = () => {
    const power = parseFloat(classificationInputs.power);
    if (isNaN(power)) return null;
    if (power <= 0.0004) return 'I';
    if (power <= 0.001) return 'IIa';
    if (power <= 0.005) return 'IIIa';
    if (power <= 0.5) return 'IIIb';
    return 'IV';
  };

  const suggestedClass = getSuggestedClass();

  return (
    <Card className="border-l-4 border-l-green-700 shadow-md">
      <SectionHeader 
        title="Product Classification" 
        subtitle="FDA Classes I-IV and comparison with IEC classes"
        icon={Shield}
        color="green"
      />
      <CardContent className="space-y-8 pt-6">
        {/* FDA Classes Overview */}
        <div className="space-y-5">
          <h4 className="font-bold text-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shadow-sm">
              <Shield className="w-5 h-5" />
            </div>
            FDA Laser Classes
          </h4>
          <p className="text-sm text-slate-600">Click a class to see detailed requirements:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {FDA_CLASSES.map((cls) => (
              <button
                key={cls.class}
                onClick={() => setSelectedClass(cls.class === selectedClass ? null : cls.class)}
                className={`p-4 rounded-xl border-2 transition-all text-left shadow-sm ${
                  selectedClass === cls.class
                    ? `${cls.borderColor} bg-card ring-2 ring-offset-2 ${cls.color.replace('bg-', 'ring-')}`
                    : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <div className={`w-6 h-6 rounded-full ${cls.color} mb-3 shadow-md`}></div>
                <p className="font-bold text-sm text-slate-900">{cls.name}</p>
              </button>
            ))}
          </div>

          {activeClass && (
            <div className={`p-6 rounded-xl border-2 ${activeClass.borderColor} shadow-lg ${activeClass.bgColor}`}>
              <div className="flex items-center gap-4 mb-5">
                <div className={`w-10 h-10 rounded-full ${activeClass.color} shadow-md`}></div>
                <h5 className="font-bold text-2xl text-slate-900">{activeClass.name}</h5>
                <Badge className={`${activeClass.textColor} ${activeClass.bgColor} border ${activeClass.borderColor} font-bold px-3 py-1`}>
                  {activeClass.class === 'I' ? 'Inherently Safe' : activeClass.class === 'IV' ? 'Highest Hazard' : 'Standard Control'}
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="p-4 bg-card/80 rounded-lg shadow-sm border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Power Limit</span>
                  <p className="text-slate-600 font-medium">{activeClass.power}</p>
                </div>
                <div className="p-4 bg-card/80 rounded-lg shadow-sm border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-1">Hazard Level</span>
                  <p className="text-slate-600 font-medium">{activeClass.hazard}</p>
                </div>
                <div className="md:col-span-2 p-4 bg-card/80 rounded-lg shadow-sm border border-slate-200">
                  <span className="font-bold text-slate-700 block mb-3">Requirements:</span>
                  <ul className="space-y-2">
                    {activeClass.requirements.map((req, i) => (
                      <li key={i} className="flex items-center gap-2 text-slate-600">
                        <CheckCircle className="w-4 h-4 text-green-600 shrink-0" />
                        <span className="font-medium">{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        <Separator className="bg-slate-200" />

        {/* IEC vs FDA Comparison */}
        <div className="space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h4 className="font-bold text-lg flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shadow-sm">
                <Scale className="w-5 h-5" />
              </div>
              FDA vs IEC Classification Comparison
            </h4>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowComparisonTable(!showComparisonTable)}
              className="border-slate-300"
            >
              {showComparisonTable ? 'Show Less' : 'Show Full Table'}
            </Button>
          </div>

          <ComparisonTable data={IEC_VS_FDA} showFull={showComparisonTable} />
        </div>

        <Separator className="bg-slate-200" />

        {/* Interactive Classification Tool */}
        <div className="space-y-5">
          <h4 className="font-bold text-lg flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            Interactive Classification Tool
          </h4>
          <p className="text-sm text-slate-600">
            Enter product parameters for a simplified classification estimate (consult full standards for official determination):
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 p-6 bg-slate-50 rounded-xl border-2 border-slate-200 shadow-sm">
            <div className="space-y-2">
              <Label htmlFor="wavelength" className="font-bold text-slate-700">Wavelength (nm)</Label>
              <Input
                id="wavelength"
                placeholder="e.g., 532"
                value={classificationInputs.wavelength}
                onChange={(e) => setClassificationInputs(prev => ({ ...prev, wavelength: e.target.value }))}
                className="bg-card border-slate-300 focus:border-[#1a4480] focus:ring-[#1a4480]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="power" className="font-bold text-slate-700">Power (Watts)</Label>
              <Input
                id="power"
                placeholder="e.g., 0.005"
                value={classificationInputs.power}
                onChange={(e) => setClassificationInputs(prev => ({ ...prev, power: e.target.value }))}
                className="bg-card border-slate-300 focus:border-[#1a4480] focus:ring-[#1a4480]"
              />
            </div>
            <div className="space-y-2">
              <Label className="font-bold text-slate-700 block mb-2">Pulsed?</Label>
              <div className="flex items-center space-x-2 p-3 bg-card rounded-lg border border-slate-300">
                <Checkbox
                  id="pulsed"
                  checked={classificationInputs.pulsed}
                  onCheckedChange={(checked) => 
                    setClassificationInputs(prev => ({ ...prev, pulsed: checked as boolean }))
                  }
                />
                <Label htmlFor="pulsed" className="text-sm font-medium cursor-pointer text-slate-700">
                  Pulsed emission
                </Label>
              </div>
            </div>
          </div>

          {suggestedClass && (
            <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl border-2 border-green-300 shadow-md">
              <p className="text-sm text-green-700 mb-3 font-bold">Suggested Classification:</p>
              <div className="flex items-center gap-4">
                <Badge className="text-2xl px-8 py-4 bg-green-700 text-white border-0 shadow-lg font-bold">
                  Class {suggestedClass}
                </Badge>
                <span className="text-sm text-slate-600">
                  {FDA_CLASSES.find(c => c.class === suggestedClass)?.hazard}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-4 italic flex items-center gap-2">
                <Info className="w-4 h-4" />
                Note: This is a simplified estimate. Official classification requires full testing per 21 CFR 1040.10(e).
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 5: CDRH ORGANIZATION
// ============================================================================

function CDRHSection() {
  const [activeTab, setActiveTab] = useState<'contact' | 'enforcement' | 'reporting'>('contact');

  return (
    <Card className="border-l-4 border-l-indigo-700 shadow-md">
      <SectionHeader 
        title="CDRH Organization" 
        subtitle="Who to contact and how regulations are enforced"
        icon={Building}
        color="indigo"
      />
      <CardContent className="space-y-8 pt-6">
        {/* Organization Structure */}
        <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50 rounded-xl border-2 border-indigo-300 shadow-sm">
          <h4 className="font-bold text-indigo-900 mb-5 flex items-center gap-3 text-lg">
            <div className="w-10 h-10 rounded-lg bg-indigo-700 text-white flex items-center justify-center shadow-md">
              <Landmark className="w-5 h-5" />
            </div>
            CDRH Organizational Structure
          </h4>
          <div className="space-y-4 text-sm">
            <div className="flex items-center gap-4 p-5 bg-card rounded-xl border-2 border-indigo-200 shadow-md">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#1a4480] to-[#0f2d5e] text-white flex items-center justify-center text-lg font-bold shadow-lg">1</div>
              <div>
                <p className="font-bold text-slate-900 text-base">Center for Devices and Radiological Health</p>
                <p className="text-slate-500 text-sm">CDRH - Overall authority for radiation-emitting products</p>
              </div>
            </div>
            <div className="ml-6 pl-8 border-l-4 border-indigo-200">
              <div className="flex items-center gap-4 p-5 bg-card rounded-xl border-2 border-indigo-200 shadow-md">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-indigo-700 text-white flex items-center justify-center text-lg font-bold shadow-lg">2</div>
                <div>
                  <p className="font-bold text-slate-900 text-base">Office of Health Technology 8 (OHT8)</p>
                  <p className="text-slate-500 text-sm">Office of Radiological Health</p>
                </div>
              </div>
            </div>
            <div className="ml-12 pl-8 border-l-4 border-indigo-200">
              <div className="flex items-center gap-4 p-5 bg-card rounded-xl border-2 border-indigo-200 shadow-md">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 text-white flex items-center justify-center text-lg font-bold shadow-lg">3</div>
                <div>
                  <p className="font-bold text-slate-900 text-base">Division of Mammography Quality & Radiation Programs</p>
                  <p className="text-slate-500 text-sm">Electronic Products Branch</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2">
          {(['contact', 'enforcement', 'reporting'] as const).map(tab => (
            <Button
              key={tab}
              variant={activeTab === tab ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveTab(tab)}
              className={activeTab === tab ? 'bg-indigo-700 hover:bg-indigo-800' : 'border-slate-300'}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="border-2 border-slate-200 rounded-xl p-6 bg-card shadow-sm">
          {activeTab === 'contact' && (
            <div className="space-y-5">
              <h5 className="font-bold text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
                  <Building className="w-5 h-5" />
                </div>
                Contact Information
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-sm">
                <div className="space-y-4">
                  <div className="p-5 bg-slate-50 rounded-lg border-2 border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-700 block mb-2">Phone (DSMICA)</span>
                    <p className="text-indigo-700 font-bold text-xl">1-800-638-2041</p>
                  </div>
                  <div className="p-5 bg-slate-50 rounded-lg border-2 border-slate-200 shadow-sm">
                    <span className="font-bold text-slate-700 block mb-2">Email</span>
                    <p className="text-indigo-600 font-medium">dsmica@fda.hhs.gov</p>
                  </div>
                </div>
                <div className="p-5 bg-slate-50 rounded-lg border-2 border-slate-200 shadow-sm">
                  <span className="font-bold text-slate-700 block mb-3">Mailing Address</span>
                  <p className="text-slate-600 leading-relaxed font-medium">
                    Center for Devices and Radiological Health<br />
                    Document Mail Center – WO66-G609<br />
                    Attn: Electronic Product Reports<br />
                    10903 New Hampshire Avenue<br />
                    Silver Spring, MD 20993-0002
                  </p>
                </div>
              </div>
              <div className="p-5 bg-amber-50 rounded-lg border-2 border-amber-300 shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <Info className="w-5 h-5 text-amber-600" />
                  <span className="font-bold text-amber-800">Official Website</span>
                </div>
                <p className="text-amber-700 font-medium">www.fda.gov/cdrh/radhealth/</p>
              </div>
            </div>
          )}

          {activeTab === 'enforcement' && (
            <div className="space-y-5">
              <h5 className="font-bold text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-red-100 text-red-700 flex items-center justify-center shadow-sm">
                  <Shield className="w-5 h-5" />
                </div>
                Enforcement Actions
              </h5>
              <div className="space-y-3 text-sm">
                {[
                  { action: 'Testing Program Disapproval', desc: 'If quality control is inadequate', severity: 'medium' },
                  { action: 'Radiation Defect Determination', desc: 'Product fails to comply with standards', severity: 'high' },
                  { action: 'Product Recall', desc: 'Required for defective products', severity: 'high' },
                  { action: 'Import Detention', desc: 'Non-compliant imports may be detained', severity: 'high' },
                  { action: 'Injunction/Criminal Prosecution', desc: 'For serious violations', severity: 'critical' }
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-lg border-2 border-slate-200 hover:border-slate-300 transition-colors shadow-sm">
                    <Badge 
                      className={`mt-0.5 shrink-0 font-bold ${
                        item.severity === 'critical' ? 'bg-red-100 text-red-800 border-red-300' :
                        item.severity === 'high' ? 'bg-orange-100 text-orange-800 border-orange-300' :
                        'bg-yellow-100 text-yellow-800 border-yellow-300'
                      }`}
                    >
                      {i + 1}
                    </Badge>
                    <div>
                      <p className="font-bold text-slate-900">{item.action}</p>
                      <p className="text-slate-500">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'reporting' && (
            <div className="space-y-5">
              <h5 className="font-bold text-lg flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shadow-sm">
                  <FileText className="w-5 h-5" />
                </div>
                Reporting Structure
              </h5>
              <div className="space-y-4 text-sm">
                <div className="p-5 bg-blue-50 rounded-lg border-2 border-blue-300 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <FileText className="w-5 h-5 text-blue-600" />
                    <p className="font-bold text-blue-900">Product Report (21 CFR 1002.10)</p>
                  </div>
                  <p className="text-blue-700">Required before introduction into commerce. Assigned an accession number for tracking.</p>
                </div>
                <div className="p-5 bg-green-50 rounded-lg border-2 border-green-300 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <p className="font-bold text-green-900">Supplemental Report (21 CFR 1002.11)</p>
                  </div>
                  <p className="text-green-700">For new models or modifications affecting emission or compliance.</p>
                </div>
                <div className="p-5 bg-amber-50 rounded-lg border-2 border-amber-300 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <Clock className="w-5 h-5 text-amber-600" />
                    <p className="font-bold text-amber-900">Annual Report (21 CFR 1002.13)</p>
                  </div>
                  <p className="text-amber-700">Due September 1 for Class IIIb and IV products.</p>
                </div>
                <div className="p-5 bg-red-50 rounded-lg border-2 border-red-300 shadow-sm">
                  <div className="flex items-center gap-3 mb-2">
                    <AlertCircle className="w-5 h-5 text-red-600" />
                    <p className="font-bold text-red-900">Accidental Radiation Occurrence (21 CFR 1002.20)</p>
                  </div>
                  <p className="text-red-700">Immediate reporting required for radiation incidents.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Key Responsibilities */}
        <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200 shadow-sm">
          <h4 className="font-bold text-slate-900 mb-5 flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center shadow-sm">
              <CheckCircle className="w-5 h-5" />
            </div>
            Key Responsibilities
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CDRH_ORGANIZATION.responsibilities.map((resp, i) => (
              <div key={i} className="flex items-start gap-3 text-sm p-4 bg-card rounded-lg border-2 border-slate-200 shadow-sm">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{resp}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Module1_FDAFramework() {
  const [activeSection, setActiveSection] = useState<number>(0);
  const [progress, setProgress] = useState<number>(0);

  const sections = [
    { id: 'jurisdiction', title: 'FDA Jurisdiction', component: JurisdictionSection, icon: Landmark },
    { id: 'timeline', title: 'Historical Timeline', component: TimelineSection, icon: History },
    { id: 'final-rule', title: '2023 Final Rule', component: FinalRuleSection, icon: Scale },
    { id: 'classification', title: 'Product Classification', component: ClassificationSection, icon: Shield },
    { id: 'cdrh', title: 'CDRH Organization', component: CDRHSection, icon: Building }
  ];

  const updateProgress = (sectionIndex: number) => {
    setActiveSection(sectionIndex);
    const newProgress = ((sectionIndex + 1) / sections.length) * 100;
    setProgress(newProgress);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto p-4">
      {/* Header */}
      <div className="text-center space-y-4 py-8 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a4480] to-[#0f2d5e] text-white shadow-xl mb-2">
          <Landmark className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Course 2, Module 1: FDA Regulatory Framework</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">Understanding FDA&apos;s role in laser product regulation and compliance requirements</p>
      </div>

      {/* Progress Bar */}
      <div className="space-y-3 p-5 bg-slate-50 rounded-xl border-2 border-slate-200 shadow-sm">
        <div className="flex justify-between text-sm font-bold">
          <span className="text-slate-700">Learning Progress</span>
          <span className="text-[#1a4480]">{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-3 bg-slate-200" />
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sections.map((section, index) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              variant={activeSection === index ? 'default' : 'outline'}
              size="sm"
              onClick={() => updateProgress(index)}
              className={`flex items-center gap-2 px-4 py-2 ${activeSection === index ? 'bg-[#1a4480] hover:bg-[#0f2d5e] shadow-md' : 'border-slate-300'}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{index + 1}. {section.title}</span>
              <span className="sm:hidden">{index + 1}</span>
            </Button>
          );
        })}
      </div>

      {/* Active Section */}
      <div className="animate-in fade-in duration-300">
        {activeSection === 0 && <JurisdictionSection />}
        {activeSection === 1 && <TimelineSection />}
        {activeSection === 2 && <FinalRuleSection />}
        {activeSection === 3 && <ClassificationSection />}
        {activeSection === 4 && <CDRHSection />}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6">
        <Button
          variant="outline"
          onClick={() => updateProgress(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          className="border-2 border-slate-300 px-8 font-semibold"
        >
          ← Previous
        </Button>
        <Button
          onClick={() => updateProgress(Math.min(sections.length - 1, activeSection + 1))}
          disabled={activeSection === sections.length - 1}
          className="bg-[#1a4480] hover:bg-[#0f2d5e] px-8 font-semibold shadow-md"
        >
          Next →
        </Button>
      </div>

      {/* View All Toggle */}
      <div className="text-center pt-4 border-t-2 border-slate-200">
        <Button
          variant="ghost"
          onClick={() => {
            if (activeSection === -1) {
              updateProgress(0);
            } else {
              setActiveSection(-1);
              setProgress(100);
            }
          }}
          className="text-slate-600 font-semibold"
        >
          {activeSection === -1 ? 'Show One Section at a Time' : 'View All Sections'}
        </Button>
      </div>

      {/* All Sections View */}
      {activeSection === -1 && (
        <div className="space-y-6 animate-in slide-in-from-bottom duration-500">
          <JurisdictionSection />
          <TimelineSection />
          <FinalRuleSection />
          <ClassificationSection />
          <CDRHSection />
        </div>
      )}
    </div>
  );
}
