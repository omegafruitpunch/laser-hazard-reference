'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Separator } from '@/components/ui/separator';
import { 
  FileText, 
  Scale, 
  ClipboardCheck, 
  Building2, 
  CheckCircle,
  ArrowRight,
  Info,
  History,
  Globe,
  FileSignature,
  AlertCircle,
  CheckSquare,
  Factory,
  Ship,
  Users
} from 'lucide-react';

// ============================================================================
// DESIGN SYSTEM CONSTANTS - FDA GOVERNMENT AESTHETIC
// ============================================================================

const FDA_COLORS = {
  primary: '#1a4480',
  primaryLight: '#d9e8f6',
  primaryDark: '#0f2d5e',
  accent: '#c9a227',
  success: '#15803d',
  warning: '#d97706',
  danger: '#b91c1c',
  slate: '#475569',
  border: '#cbd5e1',
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

type Section = 'overview' | 'harmonization' | 'certification' | 'impact' | 'compliance';

type StakeholderType = 'manufacturer' | 'importer' | 'user';

interface ChecklistItem {
  id: string;
  text: string;
  category: 'documentation' | 'testing' | 'labeling' | 'reporting';
  required: boolean;
}

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function SectionHeader({ title, subtitle, icon: Icon, color = 'blue' }: { 
  title: string; 
  subtitle?: string; 
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
          {subtitle && <div className="text-sm font-normal text-slate-600">{subtitle}</div>}
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
        <div className={`flex items-center gap-2 mb-3 font-bold ${v.text}`}>
          <Icon className={`w-5 h-5 ${v.icon}`} />
          {title}
        </div>
      )}
      <div className={`text-sm ${v.text} leading-relaxed`}>{children}</div>
    </div>
  );
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const HARMONIZATION_DATA = [
  {
    section: 'Scope & Definitions',
    fda: '21 CFR 1040.10(a)-(b)',
    iec: 'IEC 60825-1 Clause 4-5',
    status: 'harmonized',
    notes: 'Basic definitions aligned',
  },
  {
    section: 'Class I Requirements',
    fda: '21 CFR 1040.10(c)(1)',
    iec: 'IEC 60825-1 Class 1',
    status: 'harmonized',
    notes: 'Emission limits aligned',
  },
  {
    section: 'Class II/2 Requirements',
    fda: '21 CFR 1040.10(c)(2)',
    iec: 'IEC 60825-1 Class 2',
    status: 'harmonized',
    notes: 'Visible laser requirements',
  },
  {
    section: 'Class IIIa/3R',
    fda: '21 CFR 1040.10(c)(3)',
    iec: 'IEC 60825-1 Class 3R',
    status: 'partial',
    notes: 'Power limits slightly different',
  },
  {
    section: 'Class IIIb/3B',
    fda: '21 CFR 1040.10(c)(4)',
    iec: 'IEC 60825-1 Class 3B',
    status: 'harmonized',
    notes: 'Direct viewing hazard',
  },
  {
    section: 'Class IV/4',
    fda: '21 CFR 1040.10(c)(5)',
    iec: 'IEC 60825-1 Class 4',
    status: 'harmonized',
    notes: 'High power requirements',
  },
  {
    section: 'AEL Calculations',
    fda: '21 CFR 1040.10(d)',
    iec: 'IEC 60825-1 Clause 8',
    status: 'partial',
    notes: 'Measurement conditions differ',
  },
  {
    section: 'Labeling',
    fda: '21 CFR 1040.10(g)',
    iec: 'IEC 60825-1 Clause 6',
    status: 'partial',
    notes: 'FDA requires additional wording',
  },
  {
    section: 'User Information',
    fda: '21 CFR 1040.10(h)',
    iec: 'IEC 60825-1 Clause 6',
    status: 'different',
    notes: 'FDA has unique requirements',
  },
  {
    section: 'Measurement Conditions',
    fda: '21 CFR 1040.10(e)',
    iec: 'IEC 60825-1 Clause 9',
    status: 'partial',
    notes: 'Aperture sizes harmonized',
  },
];

const DIFFERENCES_DATA = [
  {
    aspect: 'Class Designation',
    fda: 'Class I, II, IIIa, IIIb, IV',
    iec: 'Class 1, 1M, 2, 2M, 3R, 3B, 4',
    impact: 'IEC has more granular classes',
  },
  {
    aspect: 'Modified Classes',
    fda: 'Not recognized',
    iec: 'Class 1M, 2M, 3R',
    impact: 'FDA requires separate evaluation',
  },
  {
    aspect: 'Certification Statement',
    fda: 'LN50 Modified Statement',
    iec: 'Standard manufacturer declaration',
    impact: 'Required for FDA compliance',
  },
  {
    aspect: 'Reporting',
    fda: 'Accession numbers required',
    iec: 'Self-certification',
    impact: 'FDA requires pre-market notification',
  },
  {
    aspect: 'Variance Process',
    fda: 'Required for non-compliance',
    iec: 'Not applicable',
    impact: 'FDA has unique variance system',
  },
];

const COMPLIANCE_CHECKLIST: ChecklistItem[] = [
  { id: 'c1', text: 'Product tested to IEC 60825-1 Edition 3 (or later)', category: 'testing', required: true },
  { id: 'c2', text: 'Test reports available for FDA review', category: 'documentation', required: true },
  { id: 'c3', text: 'Laser Notice 50 modified certification prepared', category: 'documentation', required: true },
  { id: 'c4', text: 'Product labels comply with FDA requirements', category: 'labeling', required: true },
  { id: 'c5', text: 'User manual contains FDA-required warnings', category: 'documentation', required: true },
  { id: 'c6', text: 'FDA Form 2877 prepared (if importing)', category: 'reporting', required: true },
  { id: 'c7', text: 'Accession number obtained (if required)', category: 'reporting', required: false },
  { id: 'c8', text: 'Quality system documentation available', category: 'documentation', required: true },
  { id: 'c9', text: 'Risk assessment per ISO 12100', category: 'documentation', required: false },
  { id: 'c10', text: 'Class 3B/4: SOPs for service personnel', category: 'documentation', required: true },
];

const STAKEHOLDER_IMPACTS = {
  manufacturer: {
    title: 'For Manufacturers',
    icon: Factory,
    points: [
      'Can use single test protocol for both markets',
      'Must prepare LN50 modified certification statement',
      'Maintain technical documentation per FDA requirements',
      'Report to FDA via eSubmitter system',
      'Ensure labels include FDA-required wording',
    ],
  },
  importer: {
    title: 'For Importers',
    icon: Ship,
    points: [
      'Verify manufacturer has LN50 certification',
      'File FDA Form 2877 for each shipment',
      'Ensure products have proper accession numbers',
      'Maintain import records for FDA inspection',
      'Report adverse events to FDA',
    ],
  },
  user: {
    title: 'For End Users',
    icon: Users,
    points: [
      'Products meet harmonized safety standards',
      'Consistent classification across regions',
      'Simplified purchasing decisions',
      'Training requirements remain consistent',
      'Same protection protocols apply',
    ],
  },
};

// ============================================================================
// SECTION 1: OVERVIEW OF LASER NOTICE 50
// ============================================================================

function OverviewSection() {
  const [activeCard, setActiveCard] = useState<'purpose' | 'history' | 'provisions'>('purpose');

  const cardButtonClass = (card: typeof activeCard) => 
    `p-5 rounded-xl border-2 text-left transition-all ${
      activeCard === card 
        ? 'border-[#1a4480] bg-[#d9e8f6] shadow-md' 
        : 'border-slate-200 hover:border-[#1a4480]/50 bg-card'
    }`;

  return (
    <div className="space-y-6">
      {/* Quick Navigation Cards */}
      <div className="grid grid-cols-3 gap-4">
        <button onClick={() => setActiveCard('purpose')} className={cardButtonClass('purpose')}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a4480] text-white flex items-center justify-center">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">Purpose</span>
          </div>
          <p className="text-xs text-slate-600">Scope and objectives</p>
        </button>
        
        <button onClick={() => setActiveCard('history')} className={cardButtonClass('history')}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a4480] text-white flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">History</span>
          </div>
          <p className="text-xs text-slate-600">Harmonization timeline</p>
        </button>
        
        <button onClick={() => setActiveCard('provisions')} className={cardButtonClass('provisions')}>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-8 h-8 rounded-lg bg-[#1a4480] text-white flex items-center justify-center">
              <Scale className="w-4 h-4" />
            </div>
            <span className="font-bold text-slate-900">Key Provisions</span>
          </div>
          <p className="text-xs text-slate-600">Main requirements</p>
        </button>
      </div>

      {/* Detailed Content */}
      {activeCard === 'purpose' && (
        <Card className="border-2 border-slate-200 shadow-md">
          <SectionHeader title="Purpose and Scope" icon={FileText} color="blue" />
          <CardContent className="space-y-6 pt-6">
            <p className="text-slate-700 leading-relaxed">
              <strong className="text-[#1a4480]">Laser Notice 50 (LN50)</strong> is an FDA guidance document that describes the 
              conditions under which laser products complying with IEC 60825-1 can also be considered 
              compliant with 21 CFR 1040.10 and 1040.11.
            </p>
            
            <div className="grid md:grid-cols-2 gap-5">
              <InfoBox variant="info" title="Primary Goals">
                <ul className="space-y-2">
                  <li>• Reduce regulatory burden</li>
                  <li>• Enable single testing protocol</li>
                  <li>• Facilitate international trade</li>
                  <li>• Maintain safety standards</li>
                </ul>
              </InfoBox>
              <InfoBox variant="success" title="Applicability">
                <ul className="space-y-2">
                  <li>• All laser product manufacturers</li>
                  <li>• US importers of laser products</li>
                  <li>• Products certified to IEC 60825-1</li>
                  <li>• Both consumer and industrial</li>
                </ul>
              </InfoBox>
            </div>

            <InfoBox variant="warning" title="Important Note" icon={AlertCircle}>
              LN50 does not eliminate FDA requirements. It provides an alternative compliance pathway for products already tested to IEC standards.
            </InfoBox>
          </CardContent>
        </Card>
      )}

      {activeCard === 'history' && (
        <Card className="border-2 border-slate-200 shadow-md">
          <SectionHeader title="History of Harmonization" icon={History} color="indigo" />
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-0 relative pl-4">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200"></div>
              {[
                { year: '1976', event: 'Original FDA laser regulations (21 CFR 1040) published', milestone: true },
                { year: '1984', event: 'First IEC 60825-1 standard released', milestone: true },
                { year: '1985', event: 'Laser Notice 1 - Initial guidance', milestone: false },
                { year: '2001', event: 'IEC 60825-1 Edition 1.2 - Major revision', milestone: true },
                { year: '2007', event: 'IEC 60825-1 Edition 2 - Significant changes', milestone: true },
                { year: '2014', event: 'IEC 60825-1 Edition 3 - Current basis for LN50', milestone: true },
                { year: '2019', event: 'Laser Notice 56 - Expanded harmonization', milestone: false },
                { year: '2023', event: 'Current LN50 guidance in effect', milestone: true },
              ].map((item, i) => (
                <div key={i} className="flex gap-4 relative pb-6">
                  <div className={`w-24 shrink-0 text-sm font-bold ${item.milestone ? 'text-[#1a4480]' : 'text-slate-500'}`}>
                    {item.year}
                  </div>
                  <div className="flex-1 pb-4 border-l-2 border-slate-200 pl-4 relative">
                    <div className={`absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full ${item.milestone ? 'bg-[#1a4480]' : 'bg-slate-400'} ring-4 ring-white`} />
                    <p className="text-slate-700 font-medium">{item.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeCard === 'provisions' && (
        <Card className="border-2 border-slate-200 shadow-md">
          <SectionHeader title="Key Provisions of LN50" icon={Scale} color="blue" />
          <CardContent className="space-y-6 pt-6">
            <div className="grid gap-4">
              {[
                {
                  title: 'IEC 60825-1 Compliance',
                  desc: 'Product must be tested and certified to IEC 60825-1 Edition 3 (or later recognized edition)',
                  icon: Globe,
                },
                {
                  title: 'Modified Certification',
                  desc: 'Manufacturer must use the specific LN50 modified certification statement',
                  icon: FileSignature,
                },
                {
                  title: 'Additional Requirements',
                  desc: 'FDA-specific labeling and user information requirements must still be met',
                  icon: AlertCircle,
                },
                {
                  title: 'Documentation',
                  desc: 'Technical documentation must be maintained and available for FDA inspection',
                  icon: FileText,
                },
              ].map((item, i) => {
                const Icon = item.icon;
                return (
                  <div key={i} className="flex gap-4 p-5 bg-slate-50 rounded-xl border-2 border-slate-200 hover:border-[#1a4480]/30 transition-colors">
                    <div className="p-3 bg-[#d9e8f6] rounded-xl h-fit shadow-sm">
                      <Icon className="w-5 h-5 text-[#1a4480]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ============================================================================
// SECTION 2: IEC-FDA HARMONIZATION
// ============================================================================

function HarmonizationSection() {
  const [viewMode, setViewMode] = useState<'table' | 'comparison'>('table');
  const [filterStatus, setFilterStatus] = useState<'all' | 'harmonized' | 'partial' | 'different'>('all');

  const filteredData = filterStatus === 'all' 
    ? HARMONIZATION_DATA 
    : HARMONIZATION_DATA.filter(d => d.status === filterStatus);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'harmonized':
        return <Badge className="bg-green-100 text-green-800 border-green-300 font-bold">Harmonized</Badge>;
      case 'partial':
        return <Badge className="bg-amber-100 text-amber-800 border-amber-300 font-bold">Partial</Badge>;
      case 'different':
        return <Badge className="bg-red-100 text-red-800 border-red-300 font-bold">Different</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex gap-2">
        <Button
          variant={viewMode === 'table' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
          className={viewMode === 'table' ? 'bg-[#1a4480] hover:bg-[#0f2d5e]' : 'border-slate-300'}
        >
          Harmonization Matrix
        </Button>
        <Button
          variant={viewMode === 'comparison' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setViewMode('comparison')}
          className={viewMode === 'comparison' ? 'bg-[#1a4480] hover:bg-[#0f2d5e]' : 'border-slate-300'}
        >
          Key Differences
        </Button>
      </div>

      {viewMode === 'table' ? (
        <>
          {/* Filter */}
          <div className="flex gap-2 flex-wrap items-center">
            <span className="text-sm text-slate-600 font-medium">Filter:</span>
            {(['all', 'harmonized', 'partial', 'different'] as const).map((status) => (
              <Button
                key={status}
                variant={filterStatus === status ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFilterStatus(status)}
                className={`text-xs ${filterStatus === status ? 'bg-[#1a4480] hover:bg-[#0f2d5e]' : 'border-slate-300'}`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </Button>
            ))}
          </div>

          {/* Harmonization Table */}
          <Card className="border-2 border-slate-200 shadow-md overflow-hidden">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-slate-300 bg-gradient-to-r from-slate-100 to-slate-50">
                      <th className="text-left py-4 px-5 font-bold text-slate-800">Section</th>
                      <th className="text-left py-4 px-5 font-bold text-[#1a4480]">FDA (21 CFR)</th>
                      <th className="text-left py-4 px-5 font-bold text-indigo-700">IEC 60825-1</th>
                      <th className="text-left py-4 px-5 font-bold text-slate-800">Status</th>
                      <th className="text-left py-4 px-5 font-bold text-slate-800">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredData.map((row, i) => (
                      <tr 
                        key={i} 
                        className={`border-b last:border-0 hover:bg-slate-50 transition-colors ${i % 2 === 1 ? 'bg-slate-50/50' : 'bg-card'}`}
                      >
                        <td className="py-4 px-5 font-bold text-slate-700 border-r border-slate-100">{row.section}</td>
                        <td className="py-4 px-5 text-[#1a4480] font-medium border-r border-slate-100">{row.fda}</td>
                        <td className="py-4 px-5 text-indigo-700 font-medium border-r border-slate-100">{row.iec}</td>
                        <td className="py-4 px-5 border-r border-slate-100">{getStatusBadge(row.status)}</td>
                        <td className="py-4 px-5 text-xs text-slate-500">{row.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Legend */}
          <div className="flex gap-6 text-xs font-medium bg-slate-50 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-green-100 border-2 border-green-300" />
              <span className="text-slate-700">Harmonized: Requirements match</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-amber-100 border-2 border-amber-300" />
              <span className="text-slate-700">Partial: Some differences remain</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded bg-red-100 border-2 border-red-300" />
              <span className="text-slate-700">Different: FDA has unique requirements</span>
            </div>
          </div>
        </>
      ) : (
        <>
          {/* Key Differences */}
          <Card className="border-2 border-slate-200 shadow-md">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
              <CardTitle className="text-base font-bold text-slate-900">What&apos;s Still Different?</CardTitle>
              <CardDescription>
                Important differences between FDA and IEC requirements
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-5">
                {DIFFERENCES_DATA.map((diff, i) => (
                  <div key={i} className="p-6 border-2 border-slate-200 rounded-xl hover:border-slate-300 transition-colors">
                    <h4 className="font-bold text-slate-900 text-lg mb-4">{diff.aspect}</h4>
                    <div className="grid md:grid-cols-2 gap-5 mb-4">
                      <div className="p-5 bg-[#d9e8f6] rounded-xl border-2 border-[#1a4480]/30">
                        <div className="text-xs font-bold text-[#1a4480] mb-2 uppercase tracking-wide">FDA</div>
                        <div className="text-sm font-medium text-slate-800">{diff.fda}</div>
                      </div>
                      <div className="p-5 bg-indigo-50 rounded-xl border-2 border-indigo-300">
                        <div className="text-xs font-bold text-indigo-700 mb-2 uppercase tracking-wide">IEC</div>
                        <div className="text-sm font-medium text-slate-800">{diff.iec}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm bg-amber-50 p-3 rounded-lg border border-amber-200">
                      <Info className="w-4 h-4 text-amber-600" />
                      <span className="text-amber-800 font-medium">Impact: {diff.impact}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}

// ============================================================================
// SECTION 3: MODIFIED CERTIFICATION
// ============================================================================

function CertificationSection() {
  const [productType, setProductType] = useState<'standard' | 'component' | 'medical'>('standard');
  const [manufacturer, setManufacturer] = useState('');
  const [modelNumber, setModelNumber] = useState('');
  const [iecEdition, setIecEdition] = useState('IEC 60825-1:2014');
  const [classLevel, setClassLevel] = useState('Class 1');

  const certificationTemplates = {
    standard: `CERTIFICATION

The manufacturer of the laser product described below has certified that the product conforms to the applicable requirements of the Radiation Control for Health and Safety Act of 1968, and the Federal Laser Product Performance Standard (21 CFR 1040.10 and 1040.11), except for those requirements pursuant to Laser Notice 50, dated [DATE], which have been substituted with corresponding requirements in [IEC_EDITION] (per Laser Notice 50).

Manufacturer: [MANUFACTURER]
Model Number: [MODEL]
Laser Class: [CLASS]

This certification is made under the provisions of Laser Notice 50, which permits manufacturers to comply with certain FDA requirements by meeting corresponding IEC requirements.`,
    component: `CERTIFICATION - LASER COMPONENT

The manufacturer of the laser component described below has certified that the component conforms to the applicable requirements of the Radiation Control for Health and Safety Act of 1968, and the Federal Laser Product Performance Standard (21 CFR 1040.10 and 1040.11), except for those requirements pursuant to Laser Notice 50, dated [DATE], which have been substituted with corresponding requirements in [IEC_EDITION] (per Laser Notice 50).

This product is a COMPONENT for incorporation into complete laser products and is not intended for standalone use.

Manufacturer: [MANUFACTURER]
Model Number: [MODEL]
Laser Class (as component): [CLASS]`,
    medical: `CERTIFICATION - MEDICAL LASER PRODUCT

The manufacturer of the medical laser product described below has certified that the product conforms to the applicable requirements of the Radiation Control for Health and Safety Act of 1968, the Federal Laser Product Performance Standard (21 CFR 1040.10 and 1040.11), and applicable medical device regulations, except for those requirements pursuant to Laser Notice 50, dated [DATE], which have been substituted with corresponding requirements in [IEC_EDITION] (per Laser Notice 50).

Note: This product requires additional FDA clearance under medical device regulations (21 CFR 800-series).

Manufacturer: [MANUFACTURER]
Model Number: [MODEL]
Laser Class: [CLASS]`,
  };

  const generateCertification = () => {
    return certificationTemplates[productType]
      .replace('[DATE]', new Date().toLocaleDateString())
      .replace('[MANUFACTURER]', manufacturer || '[MANUFACTURER NAME]')
      .replace('[MODEL]', modelNumber || '[MODEL NUMBER]')
      .replace('[IEC_EDITION]', iecEdition)
      .replace('[CLASS]', classLevel);
  };

  const productTypeButtonClass = (type: typeof productType) =>
    `p-5 rounded-xl border-2 text-left transition-all ${
      productType === type 
        ? 'border-[#1a4480] bg-[#d9e8f6] shadow-md' 
        : 'border-slate-200 hover:border-[#1a4480]/50 bg-card'
    }`;

  return (
    <div className="space-y-6">
      {/* Product Type Selection */}
      <div className="grid grid-cols-3 gap-4">
        {(['standard', 'component', 'medical'] as const).map((type) => (
          <button
            key={type}
            onClick={() => setProductType(type)}
            className={productTypeButtonClass(type)}
          >
            <div className="font-bold text-slate-900 text-base capitalize mb-1">{type}</div>
            <div className="text-xs text-slate-600">
              {type === 'standard' && 'Complete laser product'}
              {type === 'component' && 'For OEM integration'}
              {type === 'medical' && 'Medical device laser'}
            </div>
          </button>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Input Form */}
        <Card className="border-2 border-slate-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <CardTitle className="text-base font-bold text-slate-900">Statement Builder</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 pt-6">
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">Manufacturer Name</label>
              <input
                type="text"
                value={manufacturer}
                onChange={(e) => setManufacturer(e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] outline-none transition-colors"
                placeholder="Enter manufacturer name"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">Model Number</label>
              <input
                type="text"
                value={modelNumber}
                onChange={(e) => setModelNumber(e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] outline-none transition-colors"
                placeholder="Enter model number"
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">IEC Edition</label>
              <select
                value={iecEdition}
                onChange={(e) => setIecEdition(e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] outline-none transition-colors bg-card"
              >
                <option>IEC 60825-1:2014</option>
                <option>IEC 60825-1:2014+AMD1:2017</option>
                <option>IEC 60825-1:2014+AMD2:2021</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700 mb-2 block">Laser Class</label>
              <select
                value={classLevel}
                onChange={(e) => setClassLevel(e.target.value)}
                className="w-full px-4 py-3 text-sm border-2 border-slate-300 rounded-xl focus:border-[#1a4480] focus:ring-1 focus:ring-[#1a4480] outline-none transition-colors bg-card"
              >
                <option>Class 1</option>
                <option>Class 1M</option>
                <option>Class 2</option>
                <option>Class 2M</option>
                <option>Class 3R</option>
                <option>Class 3B</option>
                <option>Class 4</option>
              </select>
            </div>
          </CardContent>
        </Card>

        {/* Generated Certification */}
        <Card className="border-2 border-slate-200 shadow-md">
          <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
            <CardTitle className="text-base font-bold text-slate-900">Generated Certification</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="p-5 bg-slate-50 rounded-xl font-mono text-xs whitespace-pre-wrap h-80 overflow-y-auto border-2 border-slate-200 text-slate-700 leading-relaxed">
              {generateCertification()}
            </div>
            <Button 
              variant="outline" 
              className="mt-5 w-full border-2 border-[#1a4480] text-[#1a4480] hover:bg-[#d9e8f6] font-bold py-5"
              onClick={() => navigator.clipboard.writeText(generateCertification())}
            >
              Copy to Clipboard
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* When to Use */}
      <div className="grid md:grid-cols-2 gap-5">
        <InfoBox variant="success" title="✓ Use Modified Certification When:">
          <ul className="space-y-2">
            <li>• Product tested to IEC 60825-1 Ed. 3</li>
            <li>• Product meets all IEC requirements</li>
            <li>• Product will be marketed in US</li>
            <li>• Single certification for multiple markets desired</li>
            <li>• No FDA variance is needed</li>
          </ul>
        </InfoBox>
        <InfoBox variant="danger" title="✗ Do NOT Use When:">
          <ul className="space-y-2">
            <li>• Product does not fully comply with IEC standard</li>
            <li>• Product has deviations requiring FDA variance</li>
            <li>• Product is a medical device (additional requirements)</li>
            <li>• Product is a demonstration laser (21 CFR 1040.11)</li>
            <li>• Product was tested only to older IEC editions</li>
          </ul>
        </InfoBox>
      </div>
    </div>
  );
}

// ============================================================================
// SECTION 4: PRACTICAL IMPACT
// ============================================================================

function ImpactSection() {
  const [activeStakeholder, setActiveStakeholder] = useState<StakeholderType>('manufacturer');
  const stakeholder = STAKEHOLDER_IMPACTS[activeStakeholder];
  const Icon = stakeholder.icon;

  const stakeholderButtonClass = (type: StakeholderType) =>
    `p-5 rounded-xl border-2 text-left transition-all ${
      activeStakeholder === type 
        ? 'border-[#1a4480] bg-[#d9e8f6] shadow-md' 
        : 'border-slate-200 hover:border-[#1a4480]/50 bg-card'
    }`;

  return (
    <div className="space-y-6">
      {/* Stakeholder Selection */}
      <div className="grid grid-cols-3 gap-4">
        {(['manufacturer', 'importer', 'user'] as const).map((type) => {
          const StakeIcon = STAKEHOLDER_IMPACTS[type].icon;
          return (
            <button
              key={type}
              onClick={() => setActiveStakeholder(type)}
              className={stakeholderButtonClass(type)}
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-[#1a4480] text-white flex items-center justify-center">
                  <StakeIcon className="w-4 h-4" />
                </div>
                <span className="font-bold text-slate-900 capitalize">{type}</span>
              </div>
              <p className="text-xs text-slate-600">{STAKEHOLDER_IMPACTS[type].title}</p>
            </button>
          );
        })}
      </div>

      {/* Impact Details */}
      <Card className="border-2 border-slate-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-[#d9e8f6]/50 to-transparent border-b border-slate-200">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[#1a4480] rounded-xl shadow-md">
              <Icon className="w-6 h-6 text-white" />
            </div>
            <CardTitle className="text-lg font-bold text-slate-900">{stakeholder.title}</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {stakeholder.points.map((point, i) => (
              <div key={i} className="flex items-start gap-4 p-5 bg-slate-50 rounded-xl border-2 border-slate-200">
                <CheckCircle className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">{point}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Benefits Summary */}
      <Card className="bg-gradient-to-r from-green-50 to-[#d9e8f6] border-2 border-green-300 shadow-md">
        <CardHeader className="border-b border-green-200/50">
          <CardTitle className="text-lg font-bold text-slate-900">Benefits of Harmonization</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Factory className="w-5 h-5 text-[#1a4480]" />
                For Industry
              </h4>
              <ul className="text-sm space-y-2 text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Reduced testing costs
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Faster time to market
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Simplified compliance management
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Consistent product design
                </li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 flex items-center gap-2">
                <Scale className="w-5 h-5 text-[#1a4480]" />
                For Regulators
              </h4>
              <ul className="text-sm space-y-2 text-slate-700">
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Consistent safety baseline
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Reduced regulatory burden
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  International cooperation
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-green-600">•</span>
                  Focus on higher-risk products
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// SECTION 5: COMPLIANCE GUIDE
// ============================================================================

function ComplianceSection() {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [filterCategory, setFilterCategory] = useState<'all' | 'documentation' | 'testing' | 'labeling' | 'reporting'>('all');

  const toggleItem = (id: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(id)) {
      newChecked.delete(id);
    } else {
      newChecked.add(id);
    }
    setCheckedItems(newChecked);
  };

  const filteredChecklist = filterCategory === 'all' 
    ? COMPLIANCE_CHECKLIST 
    : COMPLIANCE_CHECKLIST.filter(item => item.category === filterCategory);

  const progress = (checkedItems.size / COMPLIANCE_CHECKLIST.length) * 100;

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'documentation': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'testing': return 'bg-green-100 text-green-800 border-green-300';
      case 'labeling': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'reporting': return 'bg-amber-100 text-amber-800 border-amber-300';
      default: return 'bg-muted text-foreground';
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card className="border-2 border-slate-200 shadow-md">
        <CardContent className="p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-slate-700">Compliance Progress</span>
            <span className="text-sm font-bold text-[#1a4480]">{checkedItems.size}/{COMPLIANCE_CHECKLIST.length}</span>
          </div>
          <div className="h-4 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-[#1a4480] to-blue-500 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </CardContent>
      </Card>

      {/* Filter */}
      <div className="flex gap-2 flex-wrap items-center">
        <span className="text-sm text-slate-600 font-medium">Category:</span>
        {(['all', 'documentation', 'testing', 'labeling', 'reporting'] as const).map((cat) => (
          <Button
            key={cat}
            variant={filterCategory === cat ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilterCategory(cat)}
            className={`text-xs ${filterCategory === cat ? 'bg-[#1a4480] hover:bg-[#0f2d5e]' : 'border-slate-300'}`}
          >
            {cat.charAt(0).toUpperCase() + cat.slice(1)}
          </Button>
        ))}
      </div>

      {/* Checklist */}
      <Card className="border-2 border-slate-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <CardTitle className="text-lg font-bold text-slate-900">LN50 Compliance Checklist</CardTitle>
          <CardDescription>
            Required items for Laser Notice 50 compliance
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {filteredChecklist.map((item) => (
              <label
                key={item.id}
                className={`flex items-start gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all ${
                  checkedItems.has(item.id) 
                    ? 'bg-green-50 border-green-300 shadow-sm' 
                    : 'bg-card border-slate-200 hover:border-[#1a4480]/50'
                }`}
              >
                <Checkbox
                  checked={checkedItems.has(item.id)}
                  onCheckedChange={() => toggleItem(item.id)}
                  className="mt-0.5"
                />
                <div className="flex-1">
                  <span className={`text-sm font-medium ${checkedItems.has(item.id) ? 'line-through text-slate-400' : 'text-slate-700'}`}>
                    {item.text}
                  </span>
                  <div className="flex gap-2 mt-2">
                    <Badge className={`text-xs ${getCategoryColor(item.category)} font-bold`}>
                      {item.category}
                    </Badge>
                    {item.required && (
                      <Badge variant="outline" className="text-xs border-red-300 text-red-700 font-bold">Required</Badge>
                    )}
                  </div>
                </div>
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Requirements */}
      <Card className="border-2 border-slate-200 shadow-md">
        <CardHeader className="bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <CardTitle className="text-lg font-bold text-slate-900">Required Documentation</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-2 gap-5">
            <div className="p-6 border-2 border-slate-200 rounded-xl bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5 text-[#1a4480]" />
                Technical File Contents
              </h4>
              <ul className="text-sm space-y-3 text-slate-700">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  Product description and specifications
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  IEC 60825-1 test reports
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  Risk assessment documentation
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  Quality system procedures
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  LN50 modified certification statement
                </li>
              </ul>
            </div>
            <div className="p-6 border-2 border-slate-200 rounded-xl bg-slate-50">
              <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                <ClipboardCheck className="w-5 h-5 text-[#1a4480]" />
                FDA Submission (if required)
              </h4>
              <ul className="text-sm space-y-3 text-slate-700">
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  FDA Form 2877 (if importing)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  Product report (for new products)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  Supplemental reports (for modifications)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  Annual reports (if required)
                </li>
                <li className="flex items-center gap-3">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#1a4480]" />
                  Variance applications (if applicable)
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Reference */}
      <Card className="bg-slate-50 border-2 border-slate-200 shadow-md">
        <CardHeader className="border-b border-slate-200">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Info className="w-5 h-5 text-[#1a4480]" />
            Quick Reference: When to Report
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="p-5 bg-card rounded-xl border-2 border-green-300 shadow-sm">
              <div className="font-bold text-green-700 mb-3 flex items-center gap-2">
                <CheckCircle className="w-4 h-4" />
                No Report Required
              </div>
              <ul className="text-slate-600 space-y-2">
                <li>• Class 1 products</li>
                <li>• Test standard lasers</li>
                <li>• Replacement parts</li>
                <li>• Service components</li>
              </ul>
            </div>
            <div className="p-5 bg-card rounded-xl border-2 border-amber-300 shadow-sm">
              <div className="font-bold text-amber-700 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Initial Report Only
              </div>
              <ul className="text-slate-600 space-y-2">
                <li>• Class 2 products</li>
                <li>• Class 3R products</li>
                <li>• New product introduction</li>
                <li>• Major design changes</li>
              </ul>
            </div>
            <div className="p-5 bg-card rounded-xl border-2 border-red-300 shadow-sm">
              <div className="font-bold text-red-700 mb-3 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Full Reporting
              </div>
              <ul className="text-slate-600 space-y-2">
                <li>• Class 3B products</li>
                <li>• Class 4 products</li>
                <li>• Demonstration lasers</li>
                <li>• Medical laser products</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Module3_LaserNotice50() {
  const [activeSection, setActiveSection] = useState<Section>('overview');
  const [completedSections, setCompletedSections] = useState<Set<Section>>(new Set());
  
  // Load saved progress on mount
  useEffect(() => {
    const saved = localStorage.getItem('course2-module3-progress');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setActiveSection(parsed.activeSection || 'overview');
        setCompletedSections(new Set(parsed.completedSections || []));
      } catch (e) {
        // Invalid saved data, ignore
      }
    }
  }, []);
  
  // Save progress when it changes
  useEffect(() => {
    localStorage.setItem('course2-module3-progress', JSON.stringify({ 
      activeSection, 
      completedSections: Array.from(completedSections) 
    }));
  }, [activeSection, completedSections]);

  const sections: { id: Section; title: string; icon: React.ElementType; description: string }[] = [
    { 
      id: 'overview', 
      title: 'What is LN50?', 
      icon: FileText,
      description: 'Purpose, history, and key provisions'
    },
    { 
      id: 'harmonization', 
      title: 'IEC-FDA Harmonization', 
      icon: Scale,
      description: 'Comparison table and differences'
    },
    { 
      id: 'certification', 
      title: 'Modified Certification', 
      icon: FileSignature,
      description: 'Statement builder and requirements'
    },
    { 
      id: 'impact', 
      title: 'Practical Impact', 
      icon: Building2,
      description: 'For manufacturers, importers, users'
    },
    { 
      id: 'compliance', 
      title: 'Compliance Guide', 
      icon: ClipboardCheck,
      description: 'Checklist and documentation'
    },
  ];

  const markComplete = (section: Section) => {
    setCompletedSections(prev => new Set([...prev, section]));
  };

  const sectionButtonClass = (id: Section) =>
    `h-auto py-4 flex flex-col items-center gap-2 text-left transition-all ${
      activeSection === id
        ? 'bg-[#1a4480] text-white shadow-md'
        : 'border-2 border-slate-200 hover:border-[#1a4480]/50 bg-card'
    }`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Module Header */}
      <div className="text-center space-y-4 py-8 bg-gradient-to-b from-[#d9e8f6]/30 to-white rounded-2xl border-2 border-[#1a4480]/20 shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a4480] to-[#0f2d5e] text-white shadow-xl mb-2">
          <Scale className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Course 2, Module 3: Laser Notice 50</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">
          Understanding FDA-IEC harmonization for laser product compliance
        </p>
      </div>

      {/* Section Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {sections.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          const isComplete = completedSections.has(section.id);
          
          return (
            <Button
              key={section.id}
              variant={isActive ? 'default' : 'outline'}
              onClick={() => setActiveSection(section.id)}
              className={sectionButtonClass(section.id)}
            >
              <div className="flex items-center gap-2">
                <Icon className="w-5 h-5" />
                {isComplete && <CheckCircle className="w-4 h-4 text-green-400" />}
              </div>
              <div className="text-center">
                <div className="text-xs font-bold">{section.title}</div>
                <div className="text-[10px] opacity-80 hidden sm:block">
                  {section.description}
                </div>
              </div>
            </Button>
          );
        })}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center gap-3 text-sm bg-slate-50 p-4 rounded-xl border border-slate-200">
        <span className="font-bold text-slate-700">Progress:</span>
        <div className="flex-1 h-3 bg-card rounded-full overflow-hidden border border-slate-200">
          <div 
            className="h-full bg-gradient-to-r from-[#1a4480] to-blue-500 transition-all"
            style={{ width: `${(completedSections.size / sections.length) * 100}%` }}
          />
        </div>
        <span className="font-bold text-[#1a4480]">{completedSections.size}/{sections.length}</span>
      </div>

      {/* Section Content */}
      <Card className="border-2 border-slate-200 shadow-md">
        <CardHeader className="pb-2 bg-gradient-to-r from-slate-50 to-white border-b border-slate-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {(() => {
                const Icon = sections.find(s => s.id === activeSection)?.icon || FileText;
                return <div className="p-2 bg-[#1a4480] rounded-lg"><Icon className="w-5 h-5 text-white" /></div>;
              })()}
              <CardTitle className="text-xl font-bold text-slate-900">
                {sections.find(s => s.id === activeSection)?.title}
              </CardTitle>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markComplete(activeSection)}
              className="border-2 border-green-600 text-green-700 hover:bg-green-50 font-bold"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Mark Complete
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          {activeSection === 'overview' && <OverviewSection />}
          {activeSection === 'harmonization' && <HarmonizationSection />}
          {activeSection === 'certification' && <CertificationSection />}
          {activeSection === 'impact' && <ImpactSection />}
          {activeSection === 'compliance' && <ComplianceSection />}
        </CardContent>
      </Card>

      {/* Key Takeaways */}
      <Card className="bg-gradient-to-r from-[#d9e8f6]/30 to-green-50/30 border-2 border-[#1a4480]/20 shadow-md">
        <CardHeader className="pb-2 border-b border-[#1a4480]/10">
          <CardTitle className="text-lg font-bold text-slate-900 flex items-center gap-3">
            <div className="p-2 bg-[#1a4480] rounded-lg">
              <Info className="w-5 h-5 text-white" />
            </div>
            Key Takeaways
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3 p-4 bg-card rounded-xl border border-slate-200 shadow-sm">
              <ArrowRight className="w-5 h-5 text-[#1a4480] shrink-0 mt-0.5" />
              <span className="text-slate-700"><strong className="text-[#1a4480]">Laser Notice 50</strong> allows manufacturers to use IEC 60825-1 testing as the basis for FDA compliance</span>
            </li>
            <li className="flex items-start gap-3 p-4 bg-card rounded-xl border border-slate-200 shadow-sm">
              <ArrowRight className="w-5 h-5 text-[#1a4480] shrink-0 mt-0.5" />
              <span className="text-slate-700">A <strong className="text-[#1a4480]">modified certification statement</strong> is required that references both FDA regulations and the IEC standard</span>
            </li>
            <li className="flex items-start gap-3 p-4 bg-card rounded-xl border border-slate-200 shadow-sm">
              <ArrowRight className="w-5 h-5 text-[#1a4480] shrink-0 mt-0.5" />
              <span className="text-slate-700"><strong className="text-[#1a4480]">Not all requirements are harmonized</strong> - FDA still has unique labeling and reporting requirements</span>
            </li>
            <li className="flex items-start gap-3 p-4 bg-card rounded-xl border border-slate-200 shadow-sm">
              <ArrowRight className="w-5 h-5 text-[#1a4480] shrink-0 mt-0.5" />
              <span className="text-slate-700">The <strong className="text-[#1a4480]">modified classes</strong> (1M, 2M, 3R) are recognized under LN50 but may require additional evaluation</span>
            </li>
            <li className="flex items-start gap-3 p-4 bg-card rounded-xl border border-slate-200 shadow-sm">
              <ArrowRight className="w-5 h-5 text-[#1a4480] shrink-0 mt-0.5" />
              <span className="text-slate-700"><strong className="text-[#1a4480]">Proper documentation</strong> and technical files must be maintained for FDA inspection</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
