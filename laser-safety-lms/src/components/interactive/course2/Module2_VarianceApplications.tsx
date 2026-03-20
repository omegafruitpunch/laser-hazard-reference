'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  FileQuestion,
  FileText,
  ClipboardCheck,
  Clock,
  CheckCircle,
  AlertCircle,
  AlertTriangle,
  Calendar,
  Building,
  Shield,
  ChevronRight,
  ChevronDown,
  RotateCcw,
  ArrowRight,
  ArrowLeft,
  Info,
  Landmark,
  FileCheck,
  Gavel,
  X
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
  red:    { border: 'border-l-red-700', bg: 'bg-gradient-to-r from-red-50/50 to-transparent', icon: 'bg-red-700' },
  purple: { border: 'border-l-purple-700', bg: 'bg-gradient-to-r from-purple-50/50 to-transparent', icon: 'bg-purple-700' },
  cyan:   { border: 'border-l-cyan-700', bg: 'bg-gradient-to-r from-cyan-50/50 to-transparent', icon: 'bg-cyan-700' },
};

// ============================================================================
// HELPER COMPONENTS
// ============================================================================

function SectionHeader({ title, subtitle, icon: Icon, color = 'blue' }: { 
  title: string; 
  subtitle: string; 
  icon: React.ElementType;
  color?: 'blue' | 'indigo' | 'amber' | 'green' | 'red' | 'purple' | 'cyan';
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
// SECTION 1: When Do You Need a Variance?
// ============================================================================

const varianceNeedChecklist = [
  { id: 'public-display', text: 'Will the laser be used for public display or entertainment?', required: true },
  { id: 'outdoor-beams', text: 'Will laser beams project into outdoor space (sky beams)?', required: true },
  { id: 'audience-scanning', text: 'Will lasers scan into or above the audience?', required: true },
  { id: 'power-exceeds', text: 'Does the laser exceed Class 3R power levels (>5mW)?', required: true },
  { id: 'non-certified', text: 'Are you using non-certified or custom-built laser equipment?', required: false },
  { id: 'temporary-install', text: 'Is this a temporary installation for an event?', required: false },
  { id: 'mobile-unit', text: 'Is this a mobile or touring laser unit?', required: false },
];

const productTypesRequiringVariance = [
  { type: 'Entertainment Laser Projectors', class: 'Class 3B or 4', examples: ['Concert lighting', 'Nightclub effects', 'Festival installations'] },
  { type: 'Laser Show Systems', class: 'Class 3B or 4', examples: ['Planetarium shows', 'Theme park attractions', 'Corporate events'] },
  { type: 'Sky Tracking Beams', class: 'Class 3B or 4', examples: ['Grand openings', 'Movie premieres', 'Advertising displays'] },
  { type: 'Audience Scanning Lasers', class: 'Class 3B or 4', examples: ['Interactive shows', 'Dance floor effects', 'Immersive experiences'] },
  { type: 'Outdoor Laser Displays', class: 'Class 3B or 4', examples: ['City light festivals', 'Building projections', 'Bridge lighting'] },
];

const decisionTreeSteps = [
  { id: 1, question: 'Are you using lasers for commercial purposes?', yes: 2, no: 'No variance needed - recreational use' },
  { id: 2, question: 'Is this for public display or entertainment?', yes: 3, no: 'No variance needed - industrial/medical use has different requirements' },
  { id: 3, question: 'Is the laser Class 3B or Class 4?', yes: 4, no: 'Class 1, 2, or 3R may be exempt - check local regulations' },
  { id: 4, question: 'Will the laser be used indoors only with controlled access?', yes: 5, no: 6 },
  { id: 5, question: 'Indoor variance required - Form 3147', result: true },
  { id: 6, question: 'Will beams project outdoors or scan audiences?', yes: 7, no: 5 },
  { id: 7, question: 'Full variance required - Form 3147 with additional documentation', result: true },
];

function VarianceNeedChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  
  const completedCount = Object.values(checked).filter(Boolean).length;
  const requiredCount = varianceNeedChecklist.filter(item => item.required).length;
  const requiredCompleted = varianceNeedChecklist.filter(item => item.required && checked[item.id]).length;
  
  const likelyNeedsVariance = requiredCompleted >= 2;
  
  return (
    <Card className="border-l-4 border-l-[#1a4480] shadow-md">
      <SectionHeader 
        title="Do You Need a Variance?" 
        subtitle="Interactive Checklist - Check all that apply"
        icon={FileQuestion}
        color="blue"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-3">
          {varianceNeedChecklist.map((item) => (
            <div key={item.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-slate-200 bg-card">
              <Checkbox
                id={item.id}
                checked={checked[item.id] || false}
                onCheckedChange={(v) => setChecked(prev => ({ ...prev, [item.id]: !!v }))}
                className="mt-1"
              />
              <div className="grid gap-2">
                <Label htmlFor={item.id} className="text-sm font-semibold cursor-pointer text-slate-700 leading-relaxed">
                  {item.text}
                </Label>
                {item.required && (
                  <Badge variant="outline" className="w-fit text-xs bg-red-50 text-red-700 border-red-300 font-bold">
                    <AlertCircle className="w-3 h-3 mr-1" />
                    High Impact Factor
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="bg-slate-200" />
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-semibold">
            <span className="text-slate-600">Completed: <strong className="text-slate-900">{completedCount}/{varianceNeedChecklist.length}</strong></span>
            <span className={requiredCompleted === requiredCount ? 'text-green-600' : 'text-amber-600'}>
              Required: {requiredCompleted}/{requiredCount}
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-[#1a4480] transition-all duration-300"
              style={{ width: `${(completedCount / varianceNeedChecklist.length) * 100}%` }}
            />
          </div>
        </div>
        
        {completedCount > 0 && (
          <div className={`p-6 rounded-xl text-sm border-2 shadow-sm ${
            likelyNeedsVariance 
              ? 'bg-amber-50 border-amber-300' 
              : 'bg-green-50 border-green-300'
          }`}>
            <div className={`font-bold mb-3 flex items-center gap-3 text-lg ${
              likelyNeedsVariance ? 'text-amber-700' : 'text-green-700'
            }`}>
              {likelyNeedsVariance ? (
                <><AlertTriangle className="w-6 h-6" /> Variance Likely Required</>
              ) : (
                <><CheckCircle className="w-6 h-6" /> Variance May Not Be Required</>
              )}
            </div>
            <p className="text-slate-600 leading-relaxed">
              {likelyNeedsVariance 
                ? 'Based on your selections, you will likely need to submit FDA Form 3147 for a variance. Consult with the FDA CDRH for confirmation.'
                : 'Based on your selections, you may not need a variance. However, always verify with local regulations and FDA guidelines.'}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProductTypesRequiringVariance() {
  const [selectedType, setSelectedType] = useState<string | null>(null);
  
  return (
    <Card className="border-l-4 border-l-indigo-700 shadow-md">
      <SectionHeader 
        title="Product Types Requiring Variance" 
        subtitle="Select a product type to see details"
        icon={Building}
        color="indigo"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="grid grid-cols-1 gap-3">
          {productTypesRequiringVariance.map((product) => (
            <Button
              key={product.type}
              variant={selectedType === product.type ? 'default' : 'outline'}
              onClick={() => setSelectedType(selectedType === product.type ? null : product.type)}
              className={`justify-start h-auto py-4 px-5 text-left border-2 ${
                selectedType === product.type ? 'bg-indigo-700 hover:bg-indigo-800 shadow-md' : 'border-slate-300 hover:bg-indigo-50 hover:border-indigo-300'
              }`}
            >
              <div className="text-left">
                <div className="font-bold text-base">{product.type}</div>
                <div className="text-xs opacity-90 font-medium">{product.class}</div>
              </div>
            </Button>
          ))}
        </div>
        
        {selectedType && (
          <div className="p-6 bg-indigo-50 rounded-xl border-2 border-indigo-300 animate-in fade-in shadow-md">
            <div className="font-bold mb-4 text-indigo-900 flex items-center gap-2 text-lg">
              <Building className="w-5 h-5" />
              Common Applications:
            </div>
            <div className="flex flex-wrap gap-2">
              {productTypesRequiringVariance
                .find(p => p.type === selectedType)?.examples.map((example) => (
                <Badge key={example} className="bg-card border-2 border-indigo-300 text-indigo-700 px-3 py-1.5 font-medium">
                  {example}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function VarianceDecisionTree() {
  const [currentStep, setCurrentStep] = useState(1);
  const [result, setResult] = useState<string | null>(null);
  const [history, setHistory] = useState<number[]>([]);
  
  const step = decisionTreeSteps.find(s => s.id === currentStep);
  
  const handleAnswer = (yes: boolean) => {
    if (!step) return;
    const next = yes ? step.yes : step.no;
    if (typeof next === 'string') {
      setResult(next);
    } else if (typeof next === 'number') {
      setHistory(prev => [...prev, currentStep]);
      setCurrentStep(next);
    }
  };
  
  const goBack = () => {
    if (history.length > 0) {
      const prevStep = history[history.length - 1];
      setHistory(prev => prev.slice(0, -1));
      setCurrentStep(prevStep);
      setResult(null);
    }
  };
  
  const reset = () => {
    setCurrentStep(1);
    setResult(null);
    setHistory([]);
  };
  
  return (
    <Card className="border-l-4 border-l-amber-600 shadow-md">
      <SectionHeader 
        title="Variance Decision Tree" 
        subtitle="Answer questions to determine your requirements"
        icon={ChevronRight}
        color="amber"
      />
      <CardContent className="space-y-5 pt-6">
        {result ? (
          <div className="text-center p-8 bg-gradient-to-br from-slate-50 to-slate-100 rounded-xl border-2 border-slate-300 shadow-md">
            <div className="w-20 h-20 mx-auto mb-5 rounded-full bg-[#1a4480] text-white flex items-center justify-center shadow-lg">
              <Gavel className="w-10 h-10" />
            </div>
            <div className="text-xl font-bold text-slate-900 mb-3">Result</div>
            <div className="text-lg text-slate-700 mb-8 font-medium leading-relaxed">{result}</div>
            <div className="flex gap-3 justify-center">
              {history.length > 0 && (
                <Button variant="outline" onClick={goBack} className="border-2 border-slate-300 px-6">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Go Back
                </Button>
              )}
              <Button onClick={reset} className="bg-[#1a4480] hover:bg-[#0f2d5e] px-6 shadow-md">
                <RotateCcw className="w-4 h-4 mr-2" />
                Start Over
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Progress indicator */}
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                <div 
                  className="h-full bg-amber-500 transition-all duration-300"
                  style={{ width: `${(history.length / 6) * 100}%` }}
                />
              </div>
              <span className="text-sm text-slate-500 font-semibold">Step {history.length + 1}</span>
            </div>

            <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 text-center shadow-md">
              <div className="text-lg font-bold text-slate-800 leading-relaxed">{step?.question}</div>
            </div>
            <div className="flex gap-4 justify-center">
              <Button onClick={() => handleAnswer(true)} className="bg-green-600 hover:bg-green-700 px-10 py-6 text-lg font-bold shadow-md">
                Yes
              </Button>
              <Button variant="outline" onClick={() => handleAnswer(false)} className="border-2 border-slate-300 px-10 py-6 text-lg font-bold">
                No
              </Button>
            </div>
            {history.length > 0 && (
              <div className="flex justify-center">
                <Button variant="ghost" size="sm" onClick={goBack} className="text-slate-500">
                  <ArrowLeft className="w-4 h-4 mr-1" />
                  Back
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 2: Form 3147 Walkthrough
// ============================================================================

const form3147Fields = [
  {
    section: 'Section A: Applicant Information',
    icon: Building,
    fields: [
      { name: 'Company/Individual Name', description: 'Legal name of the variance applicant', tip: 'Must match business registration' },
      { name: 'Mailing Address', description: 'Complete physical address', tip: 'P.O. boxes not accepted' },
      { name: 'Contact Person', description: 'Primary contact for FDA correspondence', tip: 'Should be available during business hours' },
      { name: 'Phone & Email', description: 'Direct contact information', tip: 'Include area code and country code if applicable' },
    ]
  },
  {
    section: 'Section B: Product Information',
    icon: FileText,
    fields: [
      { name: 'Laser Product Description', description: 'Make, model, and specifications', tip: 'Include wavelength, power output, and pulse characteristics' },
      { name: 'Number of Units', description: 'How many identical units will be used', tip: 'Each unique configuration needs separate documentation' },
      { name: 'Intended Use', description: 'Detailed description of how the laser will be used', tip: 'Be specific about venues and applications' },
    ]
  },
  {
    section: 'Section C: Variance Specifications',
    icon: Shield,
    fields: [
      { name: 'Regulations to be Waived', description: 'Specific 21 CFR sections requested for variance', tip: 'Common: 1040.11(c) for Class IIIb/IV demonstration' },
      { name: 'Duration Requested', description: 'Start date and expiration date', tip: 'Initial variances typically 1-2 years' },
      { name: 'Geographic Scope', description: 'Where the variance applies', tip: 'Specific venues, nationwide, or touring' },
    ]
  },
];

function Form3147Walkthrough() {
  const [currentSection, setCurrentSection] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  
  const CurrentIcon = form3147Fields[currentSection].icon;
  
  return (
    <Card className="border-l-4 border-l-[#1a4480] shadow-md">
      <SectionHeader 
        title="FDA Form 3147 - Field-by-Field Guide" 
        subtitle="Navigate through each section"
        icon={FileText}
        color="blue"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="flex gap-1 overflow-x-auto pb-2">
          {form3147Fields.map((section, idx) => {
            const SectionIcon = section.icon;
            return (
              <Button
                key={section.section}
                variant={currentSection === idx ? 'default' : 'outline'}
                size="sm"
                onClick={() => setCurrentSection(idx)}
                className={`whitespace-nowrap flex items-center gap-2 border-2 ${
                  currentSection === idx ? 'bg-[#1a4480] hover:bg-[#0f2d5e]' : 'border-slate-300'
                }`}
              >
                <SectionIcon className="w-4 h-4" />
                Section {['A', 'B', 'C'][idx]}
              </Button>
            );
          })}
        </div>
        
        <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="font-bold mb-5 flex items-center gap-3 text-slate-900 text-lg">
            <CurrentIcon className="w-6 h-6 text-[#1a4480]" />
            {form3147Fields[currentSection].section}
          </div>
          <div className="space-y-5">
            {form3147Fields[currentSection].fields.map((field) => (
              <div key={field.name} className="space-y-2">
                <Label className="text-sm font-bold text-slate-700">{field.name}</Label>
                <p className="text-xs text-slate-500">{field.description}</p>
                <div className="flex gap-3">
                  <Input
                    placeholder={`Enter ${field.name.toLowerCase()}...`}
                    value={formData[field.name] || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, [field.name]: e.target.value }))}
                    className="flex-1 bg-card border-2 border-slate-300 focus:border-[#1a4480] focus:ring-[#1a4480]"
                  />
                </div>
                <div className="flex items-start gap-2 bg-amber-50 p-3 rounded-lg border border-amber-200">
                  <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-600" />
                  <p className="text-xs text-amber-700 font-medium">{field.tip}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function Form3147Simulator() {
  const [step, setStep] = useState(0);
  const [completed, setCompleted] = useState<Record<number, boolean>>({});
  
  const simulatorSteps = [
    { title: 'Download Form 3147', description: 'Obtain the latest version from FDA.gov', action: 'Downloaded', icon: FileText },
    { title: 'Complete Section A', description: 'Fill in applicant information', action: 'Completed', icon: Building },
    { title: 'Complete Section B', description: 'Document product specifications', action: 'Completed', icon: FileText },
    { title: 'Complete Section C', description: 'Specify variance requirements', action: 'Completed', icon: Shield },
    { title: 'Attach Safety Report', description: 'Include detailed safety documentation', action: 'Attached', icon: ClipboardCheck },
    { title: 'Review & Sign', description: 'Authorized signature required', action: 'Signed', icon: FileCheck },
    { title: 'Submit to FDA', description: 'Mail or electronic submission', action: 'Submitted', icon: Landmark },
  ];

  const completedCount = Object.values(completed).filter(Boolean).length;
  
  return (
    <Card className="border-l-4 border-l-green-700 shadow-md">
      <SectionHeader 
        title="Form 3147 Completion Simulator" 
        subtitle="Step through the completion process"
        icon={CheckCircle}
        color="green"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="relative">
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-slate-200" />
          <div className="space-y-4">
            {simulatorSteps.map((s, idx) => {
              const StepIcon = s.icon;
              return (
                <div key={idx} className="relative flex items-start gap-4">
                  <div 
                    className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold shadow-md ${
                      completed[idx] 
                        ? 'bg-green-600 text-white' 
                        : idx === step 
                          ? 'bg-[#1a4480] text-white ring-4 ring-blue-200' 
                          : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                    }`}
                  >
                    {completed[idx] ? <CheckCircle className="w-6 h-6" /> : <StepIcon className="w-5 h-5" />}
                  </div>
                  <div className={`flex-1 p-5 rounded-xl border-2 transition-all ${
                    idx === step ? 'border-[#1a4480] bg-blue-50/50 shadow-md' : 'border-slate-200 bg-card'
                  } ${completed[idx] ? 'opacity-60' : ''}`}>
                    <div className="flex items-center gap-3">
                      <div className="font-bold text-slate-900">{s.title}</div>
                      {completed[idx] && <Badge className="bg-green-100 text-green-700 border-green-300 font-bold">Done</Badge>}
                    </div>
                    <div className="text-sm text-slate-500 mt-1">{s.description}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        <div className="flex gap-3">
          <Button 
            onClick={() => {
              setCompleted(prev => ({ ...prev, [step]: true }));
              if (step < simulatorSteps.length - 1) setStep(step + 1);
            }}
            disabled={step >= simulatorSteps.length - 1 && completed[step]}
            className="bg-[#1a4480] hover:bg-[#0f2d5e] shadow-md"
          >
            {step >= simulatorSteps.length - 1 && completed[step] ? 'Complete!' : `Mark ${simulatorSteps[step]?.action}`}
          </Button>
          <Button variant="outline" onClick={() => { setStep(0); setCompleted({}); }} className="border-2 border-slate-300">
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-600">Progress</span>
            <span className="text-[#1a4480]">{completedCount}/{simulatorSteps.length}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-green-600 transition-all duration-300"
              style={{ width: `${(completedCount / simulatorSteps.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 3: Required Documentation
// ============================================================================

const safetyReportElements = [
  { id: 'hazard-analysis', title: 'Hazard Analysis', description: 'Comprehensive evaluation of potential laser hazards', required: true },
  { id: 'mpe-calculations', title: 'MPE Calculations', description: 'Maximum Permissible Exposure calculations for all scenarios', required: true },
  { id: 'nominal-occular', title: 'NOHD Determination', description: 'Nominal Ocular Hazard Distance calculations', required: true },
  { id: 'control-measures', title: 'Control Measures', description: 'Engineering and administrative controls implemented', required: true },
  { id: 'scanning-analysis', title: 'Scanning Analysis', description: 'For audience scanning: detailed scanning patterns and safety margins', required: false },
  { id: 'emergency-procedures', title: 'Emergency Procedures', description: 'Procedures for equipment malfunction or emergency situations', required: true },
  { id: 'operator-training', title: 'Operator Training Documentation', description: 'Evidence of qualified laser operators', required: true },
  { id: 'equipment-specs', title: 'Equipment Specifications', description: 'Detailed technical specifications of all laser equipment', required: true },
];

const showDescriptionRequirements = [
  'Venue name and complete address',
  'Show dates and times (including setup/breakdown)',
  'Audience capacity and seating configuration',
  'Laser beam paths and projection areas',
  'Height of beam projection above audience',
  'Minimum distances to beam access points',
  'Controlled access zones and barriers',
  'Coordination with aviation authorities (for outdoor beams)',
];

const supportingDocuments = [
  { name: 'Product Report (Form 3632)', purpose: 'FDA product certification', applicable: 'All laser products' },
  { name: 'Accession Number', purpose: 'FDA tracking number for product report', applicable: 'All laser products' },
  { name: 'Proof of Insurance', purpose: 'Liability coverage for laser operations', applicable: 'Commercial operations' },
  { name: 'Venue Approval Letter', purpose: 'Permission from venue owner/manager', applicable: 'All shows' },
  { name: 'Aviation Notification', purpose: 'FAA notification for outdoor beams', applicable: 'Sky beams, outdoor shows' },
  { name: 'Operator Certifications', purpose: 'Proof of LSO or operator qualifications', applicable: 'Class 3B/4 operations' },
  { name: 'Site Plan/Diagram', purpose: 'Visual layout of laser installation', applicable: 'Complex installations' },
];

function SafetyReportElements() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const completed = Object.values(checked).filter(Boolean).length;
  const requiredCompleted = safetyReportElements.filter(e => e.required && checked[e.id]).length;
  const requiredTotal = safetyReportElements.filter(e => e.required).length;
  
  return (
    <Card className="border-l-4 border-l-red-700 shadow-md">
      <SectionHeader 
        title="Safety Report Elements" 
        subtitle="Required and recommended components"
        icon={Shield}
        color="red"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-3">
          {safetyReportElements.map((element) => (
            <div key={element.id} className="flex items-start gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-slate-200 bg-card">
              <Checkbox
                id={element.id}
                checked={checked[element.id] || false}
                onCheckedChange={(v) => setChecked(prev => ({ ...prev, [element.id]: !!v }))}
                className="mt-1"
              />
              <div className="flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <Label htmlFor={element.id} className="text-sm font-bold cursor-pointer text-slate-700">
                    {element.title}
                  </Label>
                  {element.required && (
                    <Badge className="text-xs bg-red-100 text-red-700 border-red-300 font-bold">
                      <AlertCircle className="w-3 h-3 mr-1" />
                      Required
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-2">{element.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <Separator className="bg-slate-200" />
        
        <div className="space-y-3">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-600">Progress: <strong className="text-slate-900">{completed}/{safetyReportElements.length}</strong></span>
            <span className={requiredCompleted === requiredTotal ? 'text-green-600' : 'text-amber-600'}>
              Required: {requiredCompleted}/{requiredTotal}
            </span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className={`h-full transition-all duration-300 ${
                requiredCompleted === requiredTotal ? 'bg-green-600' : 'bg-amber-500'
              }`}
              style={{ width: `${(completed / safetyReportElements.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function ShowDescriptionRequirements() {
  const [items, setItems] = useState<Record<number, boolean>>({});
  const completed = Object.values(items).filter(Boolean).length;
  
  return (
    <Card className="border-l-4 border-l-purple-700 shadow-md">
      <SectionHeader 
        title="Show Description Requirements" 
        subtitle="Information needed for the application"
        icon={Building}
        color="purple"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-3">
          {showDescriptionRequirements.map((req, idx) => (
            <div key={idx} className="flex items-center gap-4 p-4 rounded-xl hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-slate-200 bg-card">
              <Checkbox
                id={`show-req-${idx}`}
                checked={items[idx] || false}
                onCheckedChange={(v) => setItems(prev => ({ ...prev, [idx]: !!v }))}
                className="mt-0.5"
              />
              <Label htmlFor={`show-req-${idx}`} className="text-sm cursor-pointer text-slate-700 font-medium">{req}</Label>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-600">Completed</span>
            <span className="text-purple-700">{completed}/{showDescriptionRequirements.length}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-purple-600 transition-all duration-300"
              style={{ width: `${(completed / showDescriptionRequirements.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SupportingDocumentsChecklist() {
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const completed = Object.values(checked).filter(Boolean).length;
  
  return (
    <Card className="border-l-4 border-l-cyan-700 shadow-md">
      <SectionHeader 
        title="Supporting Documents Checklist" 
        subtitle="Click items to view details"
        icon={FileCheck}
        color="cyan"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-3">
          {supportingDocuments.map((doc) => (
            <div 
              key={doc.name}
              className={`p-5 rounded-xl border-2 cursor-pointer transition-all ${
                selectedDoc === doc.name ? 'border-cyan-600 bg-cyan-50 shadow-md' : 'border-slate-200 hover:border-cyan-300 bg-card'
              }`}
              onClick={() => setSelectedDoc(selectedDoc === doc.name ? null : doc.name)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Checkbox
                    checked={checked[doc.name] || false}
                    onCheckedChange={(v) => {
                      setChecked(prev => ({ ...prev, [doc.name]: !!v }));
                    }}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-0.5"
                  />
                  <span className="font-bold text-slate-700">{doc.name}</span>
                </div>
                <Badge className="text-xs bg-slate-100 border-slate-300 font-medium">
                  {doc.applicable}
                </Badge>
              </div>
              
              {selectedDoc === doc.name && (
                <div className="mt-4 pt-4 border-t-2 border-cyan-200 text-sm text-slate-600">
                  <span className="font-bold text-slate-700">Purpose: </span>
                  {doc.purpose}
                </div>
              )}
            </div>
          ))}
        </div>
        
        <div className="text-sm text-slate-500 flex items-center justify-between p-5 bg-slate-50 rounded-xl border-2 border-slate-200 font-bold">
          <span>Completed</span>
          <span className="text-cyan-700">{completed}/{supportingDocuments.length}</span>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 4: Timeline & Process
// ============================================================================

const applicationSteps = [
  { step: 1, title: 'Pre-Application', description: 'Determine need, gather preliminary info', duration: '1-2 weeks', icon: FileQuestion },
  { step: 2, title: 'Documentation', description: 'Complete Form 3147, prepare safety report', duration: '2-4 weeks', icon: FileText },
  { step: 3, title: 'Submission', description: 'Submit application to FDA CDRH', duration: '1 day', icon: Landmark },
  { step: 4, title: 'Initial Review', description: 'FDA reviews completeness', duration: '2-3 weeks', icon: ClipboardCheck },
  { step: 5, title: 'Technical Review', description: 'Detailed safety evaluation', duration: '4-8 weeks', icon: Shield },
  { step: 6, title: 'Information Request', description: 'FDA may request additional info', duration: 'Variable', icon: Info },
  { step: 7, title: 'Approval/Denial', description: 'Final decision issued', duration: '1-2 weeks', icon: CheckCircle },
];

function ApplicationToApprovalFlow() {
  const [activeStep, setActiveStep] = useState(0);
  const StepIcon = applicationSteps[activeStep].icon;
  
  return (
    <Card className="border-l-4 border-l-indigo-700 shadow-md">
      <SectionHeader 
        title="Application to Approval Flow" 
        subtitle="Click through the process steps"
        icon={ArrowRight}
        color="indigo"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="relative">
          <div className="flex justify-between mb-5 px-1">
            {applicationSteps.map((s, idx) => (
              <button
                key={s.step}
                onClick={() => setActiveStep(idx)}
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all shadow-md ${
                  idx <= activeStep ? 'bg-indigo-700 text-white' : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                }`}
              >
                {s.step}
              </button>
            ))}
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-gradient-to-r from-indigo-500 to-indigo-700 transition-all duration-300"
              style={{ width: `${((activeStep + 1) / applicationSteps.length) * 100}%` }}
            />
          </div>
        </div>
        
        <div className="p-6 bg-slate-50 rounded-xl border-2 border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <Badge className="bg-indigo-100 text-indigo-800 border-indigo-300 flex items-center gap-2 px-3 py-1.5 font-bold">
              <StepIcon className="w-4 h-4" />
              Step {applicationSteps[activeStep].step}
            </Badge>
            <span className="text-sm font-bold text-indigo-700 bg-indigo-50 px-4 py-1.5 rounded-full border border-indigo-200">
              {applicationSteps[activeStep].duration}
            </span>
          </div>
          <div className="font-bold text-xl text-slate-900 mb-2">{applicationSteps[activeStep].title}</div>
          <p className="text-sm text-slate-600 leading-relaxed">{applicationSteps[activeStep].description}</p>
        </div>
        
        <div className="flex gap-3 justify-center">
          <Button 
            variant="outline" 
            onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
            disabled={activeStep === 0}
            className="border-2 border-slate-300 px-6"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Previous
          </Button>
          <Button 
            onClick={() => setActiveStep(Math.min(applicationSteps.length - 1, activeStep + 1))}
            disabled={activeStep === applicationSteps.length - 1}
            className="bg-indigo-700 hover:bg-indigo-800 px-6 shadow-md"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function TimelineCalculator() {
  const [startDate, setStartDate] = useState('');
  const [complexity, setComplexity] = useState<'simple' | 'standard' | 'complex'>('standard');
  const [outdoor, setOutdoor] = useState(false);
  const [audienceScanning, setAudienceScanning] = useState(false);
  
  const calculateTimeline = () => {
    let weeks = 0;
    switch (complexity) {
      case 'simple': weeks = 8; break;
      case 'standard': weeks = 12; break;
      case 'complex': weeks = 20; break;
    }
    if (outdoor) weeks += 4;
    if (audienceScanning) weeks += 2;
    return weeks;
  };
  
  const estimatedWeeks = calculateTimeline();
  const estimatedDate = startDate 
    ? new Date(new Date(startDate).getTime() + estimatedWeeks * 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    : null;
  
  return (
    <Card className="border-l-4 border-l-amber-600 shadow-md">
      <SectionHeader 
        title="Timeline Calculator" 
        subtitle="Estimate your application timeline"
        icon={Clock}
        color="amber"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-5">
          <div>
            <Label className="text-sm font-bold text-slate-700 mb-2 block">Application Submission Date</Label>
            <Input 
              type="date" 
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="bg-card border-2 border-slate-300 focus:border-amber-600 focus:ring-amber-600"
            />
          </div>
          
          <div>
            <Label className="text-sm font-bold text-slate-700 mb-2 block">Application Complexity</Label>
            <div className="flex gap-2 mt-1">
              {(['simple', 'standard', 'complex'] as const).map((c) => (
                <Button
                  key={c}
                  variant={complexity === c ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setComplexity(c)}
                  className={`flex-1 capitalize border-2 ${complexity === c ? 'bg-amber-600 hover:bg-amber-700' : 'border-slate-300'}`}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="space-y-3 p-5 bg-slate-50 rounded-xl border-2 border-slate-200">
            <div className="flex items-center gap-3">
              <Checkbox 
                id="outdoor-beams" 
                checked={outdoor}
                onCheckedChange={(v) => setOutdoor(!!v)}
              />
              <Label htmlFor="outdoor-beams" className="text-sm cursor-pointer text-slate-700 font-medium">Outdoor beams / Sky tracking (+4 weeks)</Label>
            </div>
            <div className="flex items-center gap-3">
              <Checkbox 
                id="audience-scan" 
                checked={audienceScanning}
                onCheckedChange={(v) => setAudienceScanning(!!v)}
              />
              <Label htmlFor="audience-scan" className="text-sm cursor-pointer text-slate-700 font-medium">Audience scanning (+2 weeks)</Label>
            </div>
          </div>
        </div>
        
        <Separator className="bg-slate-200" />
        
        <div className="p-8 bg-gradient-to-br from-amber-50 to-orange-50 rounded-xl border-2 border-amber-300 text-center shadow-md">
          <div className="text-sm text-amber-800 mb-3 font-bold uppercase tracking-wide">Estimated Processing Time</div>
          <div className="text-5xl font-bold text-amber-700 mb-3">{estimatedWeeks} weeks</div>
          {estimatedDate && (
            <div className="text-sm text-slate-700 font-medium">Estimated approval: <strong className="text-slate-900 text-lg">{estimatedDate}</strong></div>
          )}
          <div className="text-xs text-slate-500 mt-4 italic">
            *Actual times may vary based on FDA workload and application completeness
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function StatusTracking() {
  const [status, setStatus] = useState('received');
  
  const statuses = [
    { id: 'received', label: 'Received', description: 'Application logged in FDA system', color: 'bg-slate-500' },
    { id: 'under-review', label: 'Under Review', description: 'Initial completeness check', color: 'bg-[#1a4480]' },
    { id: 'technical', label: 'Technical Review', description: 'Detailed safety analysis', color: 'bg-indigo-600' },
    { id: 'info-requested', label: 'Info Requested', description: 'Additional documentation needed', color: 'bg-amber-600' },
    { id: 'pending', label: 'Pending Decision', description: 'Awaiting final approval', color: 'bg-purple-600' },
    { id: 'approved', label: 'Approved', description: 'Variance granted', color: 'bg-green-600' },
  ];
  
  const currentIndex = statuses.findIndex(s => s.id === status);
  
  return (
    <Card className="border-l-4 border-l-green-700 shadow-md">
      <SectionHeader 
        title="Application Status Tracking" 
        subtitle="Simulate tracking your application status"
        icon={CheckCircle}
        color="green"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="space-y-3">
          {statuses.map((s, idx) => (
            <div 
              key={s.id}
              className={`flex items-center gap-4 p-4 rounded-xl transition-all border-2 ${
                idx <= currentIndex ? 'bg-green-50 border-green-300 shadow-sm' : 'bg-slate-50 border-transparent'
              }`}
            >
              <div className={`w-5 h-5 rounded-full shadow-md ${
                idx < currentIndex ? 'bg-green-600' :
                idx === currentIndex ? `${s.color} animate-pulse ring-4 ring-green-200` : 'bg-slate-300'
              }`} />
              <div className="flex-1">
                <div className={`text-sm font-bold ${
                  idx <= currentIndex ? 'text-slate-900' : 'text-slate-500'
                }`}>{s.label}</div>
                <div className="text-xs text-slate-500">{s.description}</div>
              </div>
              {idx === currentIndex && (
                <Badge className="bg-green-100 text-green-800 border-green-300 font-bold">Current</Badge>
              )}
            </div>
          ))}
        </div>
        
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setStatus(statuses[Math.max(0, currentIndex - 1)].id)}
            disabled={currentIndex === 0}
            className="border-2 border-slate-300"
          >
            <ArrowLeft className="w-4 h-4 mr-1" />
            Previous
          </Button>
          <Button 
            size="sm"
            onClick={() => setStatus(statuses[Math.min(statuses.length - 1, currentIndex + 1)].id)}
            disabled={currentIndex === statuses.length - 1}
            className="bg-green-700 hover:bg-green-800 shadow-md"
          >
            Next
            <ArrowRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// SECTION 5: Conditions & Compliance
// ============================================================================

const commonVarianceConditions = [
  { category: 'Operational', icon: Shield, conditions: [
    'Laser operations limited to approved venues only',
    'Maximum power output not to exceed specified limits',
    'Beam termination at approved backstops only',
    'No audience scanning above specified irradiance levels',
  ]},
  { category: 'Personnel', icon: Building, conditions: [
    'Licensed Laser Safety Officer (LSO) on-site during all operations',
    'All operators trained and certified',
    'Minimum crew size requirements',
    'Medical surveillance for operators (if specified)',
  ]},
  { category: 'Safety Equipment', icon: ClipboardCheck, conditions: [
    'Appropriate laser protective eyewear available',
    'Emergency stop systems installed and functional',
    'Warning signs posted at all access points',
    'Interlocks on all access panels',
  ]},
  { category: 'Documentation', icon: FileText, conditions: [
    'Safety checklist completed before each show',
    'Incident reporting to FDA within 24 hours',
    'Annual safety report submission',
    'Records maintained for specified period',
  ]},
];

const complianceMonitoringItems = [
  { id: 'pre-show-check', title: 'Pre-Show Safety Check', frequency: 'Every show', type: 'operational' },
  { id: 'power-verification', title: 'Power Output Verification', frequency: 'Daily/Weekly', type: 'technical' },
  { id: 'equipment-inspection', title: 'Equipment Inspection', frequency: 'Monthly', type: 'technical' },
  { id: 'training-records', title: 'Training Records Update', frequency: 'Ongoing', type: 'administrative' },
  { id: 'incident-review', title: 'Incident Review', frequency: 'As needed', type: 'administrative' },
  { id: 'annual-report', title: 'Annual Report to FDA', frequency: 'Annually', type: 'regulatory' },
  { id: 'variance-review', title: 'Variance Condition Review', frequency: 'Quarterly', type: 'regulatory' },
];

function CommonVarianceConditions() {
  const [activeCategory, setActiveCategory] = useState('Operational');
  
  const category = commonVarianceConditions.find(c => c.category === activeCategory);
  const CategoryIcon = category?.icon || Shield;
  
  return (
    <Card className="border-l-4 border-l-red-700 shadow-md">
      <SectionHeader 
        title="Common Variance Conditions" 
        subtitle="Typical conditions attached to variance approvals"
        icon={Gavel}
        color="red"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="flex gap-1 flex-wrap">
          {commonVarianceConditions.map((c) => {
            const CatIcon = c.icon;
            return (
              <Button
                key={c.category}
                variant={activeCategory === c.category ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveCategory(c.category)}
                className={`flex items-center gap-2 border-2 ${activeCategory === c.category ? 'bg-red-700 hover:bg-red-800' : 'border-slate-300'}`}
              >
                <CatIcon className="w-4 h-4" />
                {c.category}
              </Button>
            );
          })}
        </div>
        
        <div className="p-6 bg-red-50 rounded-xl border-2 border-red-300 shadow-md">
          <div className="font-bold mb-5 flex items-center gap-3 text-red-900 text-lg">
            <CategoryIcon className="w-6 h-6" />
            {category?.category} Conditions
          </div>
          <ul className="space-y-3">
            {category?.conditions.map((condition, idx) => (
              <li key={idx} className="flex items-start gap-3 text-sm text-red-800 bg-card/80 p-4 rounded-lg border border-red-200 shadow-sm font-medium">
                <CheckCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
                <span>{condition}</span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

function ComplianceMonitoring() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});
  const [filter, setFilter] = useState<'all' | 'operational' | 'technical' | 'administrative' | 'regulatory'>('all');
  
  const filteredItems = filter === 'all' 
    ? complianceMonitoringItems 
    : complianceMonitoringItems.filter(item => item.type === filter);
  
  const completedCount = filteredItems.filter(item => checked[item.id]).length;
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'operational': return 'bg-blue-100 text-blue-700 border-blue-300';
      case 'technical': return 'bg-purple-100 text-purple-700 border-purple-300';
      case 'administrative': return 'bg-amber-100 text-amber-700 border-amber-300';
      case 'regulatory': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-slate-100 text-slate-700';
    }
  };
  
  return (
    <Card className="border-l-4 border-l-[#1a4480] shadow-md">
      <SectionHeader 
        title="Compliance Monitoring" 
        subtitle="Ongoing requirements checklist"
        icon={ClipboardCheck}
        color="blue"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="flex gap-1 flex-wrap">
          {(['all', 'operational', 'technical', 'administrative', 'regulatory'] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter(f)}
              className={`capitalize border-2 ${filter === f ? 'bg-[#1a4480] hover:bg-[#0f2d5e]' : 'border-slate-300'}`}
            >
              {f}
            </Button>
          ))}
        </div>
        
        <div className="space-y-3">
          {filteredItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 rounded-xl hover:bg-slate-50 transition-colors border-2 border-transparent hover:border-slate-200 bg-card">
              <div className="flex items-center gap-4">
                <Checkbox
                  checked={checked[item.id] || false}
                  onCheckedChange={(v) => setChecked(prev => ({ ...prev, [item.id]: !!v }))}
                  className="mt-0.5"
                />
                <Label className="text-sm cursor-pointer font-bold text-slate-700">{item.title}</Label>
              </div>
              <Badge className={`text-xs ${getTypeColor(item.type)} capitalize font-bold`}>
                {item.frequency}
              </Badge>
            </div>
          ))}
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm font-bold">
            <span className="text-slate-600">Progress</span>
            <span className="text-[#1a4480]">{completedCount}/{filteredItems.length}</span>
          </div>
          <div className="h-3 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
            <div 
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(completedCount / filteredItems.length) * 100}%` }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function RenewalProcess() {
  const [renewalStage, setRenewalStage] = useState(0);
  
  const stages = [
    { title: 'Start Early', description: 'Begin renewal process 90 days before expiration', timeframe: '90 days out', color: 'bg-blue-500' },
    { title: 'Review Conditions', description: 'Evaluate compliance with existing conditions', timeframe: '75 days out', color: 'bg-blue-600' },
    { title: 'Update Documentation', description: 'Revise safety report with any changes', timeframe: '60 days out', color: 'bg-indigo-600' },
    { title: 'Submit Renewal', description: 'File Form 3147 with "RENEWAL" marked', timeframe: '45 days out', color: 'bg-indigo-700' },
    { title: 'Continue Operations', description: 'Current variance remains valid if renewal pending', timeframe: 'Pending', color: 'bg-green-600' },
  ];
  
  return (
    <Card className="border-l-4 border-l-green-700 shadow-md">
      <SectionHeader 
        title="Variance Renewal Process" 
        subtitle="Step through the renewal timeline"
        icon={Calendar}
        color="green"
      />
      <CardContent className="space-y-5 pt-6">
        <div className="relative pl-10">
          <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-slate-200" />
          {stages.map((stage, idx) => (
            <div key={idx} className="relative mb-5 last:mb-0">
              <button
                onClick={() => setRenewalStage(idx)}
                className={`absolute -left-6 w-8 h-8 rounded-full border-2 transition-all shadow-md ${
                  idx <= renewalStage 
                    ? `${stage.color} border-white` 
                    : 'bg-card border-slate-300'
                }`}
              />
              <div className={`p-5 rounded-xl border-2 transition-all ${
                idx === renewalStage ? 'border-green-600 bg-green-50 shadow-md' : 'border-slate-200 bg-card'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-bold text-slate-900">{stage.title}</span>
                  <Badge className="text-xs bg-card border-slate-300 font-bold">
                    {stage.timeframe}
                  </Badge>
                </div>
                <p className="text-sm text-slate-500">{stage.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        <div className="p-6 bg-amber-50 rounded-xl border-2 border-amber-300 shadow-md">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-6 h-6 text-amber-600" />
            <div className="text-base font-bold text-amber-800">Important Notice</div>
          </div>
          <p className="text-sm text-amber-700 leading-relaxed font-medium">
            If renewal is not submitted before expiration, operations must cease until new variance is approved.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function Module2_VarianceApplications() {
  const [activeSection, setActiveSection] = useState(0);
  
  const sections = [
    { id: 'need', title: '1. When Do You Need a Variance?', icon: FileQuestion },
    { id: 'form', title: '2. Form 3147 Walkthrough', icon: FileText },
    { id: 'docs', title: '3. Required Documentation', icon: ClipboardCheck },
    { id: 'timeline', title: '4. Timeline & Process', icon: Clock },
    { id: 'compliance', title: '5. Conditions & Compliance', icon: Shield },
  ];
  
  return (
    <div className="space-y-6 max-w-6xl mx-auto p-4">
      {/* Header */}
      <div className="text-center space-y-4 py-8 bg-gradient-to-b from-slate-50 to-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1a4480] to-[#0f2d5e] text-white shadow-xl mb-2">
          <Landmark className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-bold text-slate-900">Course 2, Module 2: Variance Applications</h1>
        <p className="text-slate-600 text-lg max-w-2xl mx-auto">Understanding when and how to apply for FDA laser variances</p>
      </div>

      {/* Section Navigation */}
      <div className="flex flex-wrap gap-2 justify-center">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return (
            <Button
              key={section.id}
              variant={activeSection === idx ? 'default' : 'outline'}
              size="sm"
              onClick={() => setActiveSection(idx)}
              className={`flex items-center gap-2 px-4 py-2 ${activeSection === idx ? 'bg-[#1a4480] hover:bg-[#0f2d5e] shadow-md' : 'border-slate-300'}`}
            >
              <Icon className="w-4 h-4" />
              <span className="hidden sm:inline">{section.title.split('.')[0]}</span>
              <span className="sm:hidden">{idx + 1}</span>
            </Button>
          );
        })}
      </div>
      
      <div className="space-y-6">
        {activeSection === 0 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <VarianceNeedChecklist />
              <ProductTypesRequiringVariance />
            </div>
            <VarianceDecisionTree />
          </div>
        )}
        
        {activeSection === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Form3147Walkthrough />
              <Form3147Simulator />
            </div>
          </div>
        )}
        
        {activeSection === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <SafetyReportElements />
              <ShowDescriptionRequirements />
            </div>
            <SupportingDocumentsChecklist />
          </div>
        )}
        
        {activeSection === 3 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ApplicationToApprovalFlow />
              <TimelineCalculator />
            </div>
            <StatusTracking />
          </div>
        )}
        
        {activeSection === 4 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <CommonVarianceConditions />
              <ComplianceMonitoring />
            </div>
            <RenewalProcess />
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between pt-6 border-t-2 border-slate-200">
        <Button
          variant="outline"
          onClick={() => setActiveSection(Math.max(0, activeSection - 1))}
          disabled={activeSection === 0}
          className="border-2 border-slate-300 px-8 font-semibold"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Previous
        </Button>
        <Button
          onClick={() => setActiveSection(Math.min(sections.length - 1, activeSection + 1))}
          disabled={activeSection === sections.length - 1}
          className="bg-[#1a4480] hover:bg-[#0f2d5e] px-8 font-semibold shadow-md"
        >
          Next
          <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}
