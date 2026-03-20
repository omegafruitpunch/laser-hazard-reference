'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  FileText, 
  Clock, 
  Radio, 
  AlertCircle, 
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Send,
  MapPin,
  Phone,
  Calendar,
  User,
  Building,
  Plane,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormSection {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'time' | 'number' | 'textarea' | 'radio';
  required: boolean;
  helpText?: string;
  options?: string[];
  placeholder?: string;
}

interface NOTAMCode {
  code: string;
  meaning: string;
  category: string;
  description: string;
}

// ============================================================================
// DATA CONSTANTS
// ============================================================================

const FORM_SECTIONS: FormSection[] = [
  {
    id: "section1",
    title: "Section 1: General Information",
    description: "Basic event and proponent details",
    fields: [
      {
        id: "faa_service_center",
        label: "FAA Service Center",
        type: "select",
        required: true,
        helpText: "Select the service center responsible for the operation area",
        options: ["Eastern Service Center", "Central Service Center", "Western Service Center", "Alaska Service Center"]
      },
      {
        id: "proponent_name",
        label: "Proponent Name",
        type: "text",
        required: true,
        helpText: "The party primarily responsible for laser safety"
      },
      {
        id: "event_name",
        label: "Event/Facility Name",
        type: "text",
        required: true,
        helpText: "Event name for temporary shows or facility name for permanent installations"
      },
      {
        id: "date_prepared",
        label: "Date Prepared",
        type: "date",
        required: true,
        helpText: "Date the form is being prepared (not the operation date)"
      }
    ]
  },
  {
    id: "section2",
    title: "Section 2: Date(s) and Time(s)",
    description: "Operation schedule with time zone",
    fields: [
      {
        id: "operation_dates",
        label: "Operation Date(s)",
        type: "textarea",
        required: true,
        helpText: "Example: May 20, 2024, 7:00 p.m. to 12:00 a.m. (midnight), Central Time"
      },
      {
        id: "testing_dates",
        label: "Testing/Alignment Date(s)",
        type: "textarea",
        required: false,
        helpText: "If applicable, when testing and alignment will occur"
      }
    ]
  },
  {
    id: "section3",
    title: "Section 3-4: Operation Details",
    description: "Description and on-site contact information",
    fields: [
      {
        id: "operation_description",
        label: "Brief Description of Laser Operation",
        type: "textarea",
        required: true,
        helpText: "Provide general overview. Detailed laser configurations go on page 2."
      },
      {
        id: "operator_name",
        label: "Laser Operator(s)",
        type: "text",
        required: true
      },
      {
        id: "primary_phone",
        label: "Primary On-Site Phone",
        type: "text",
        required: true,
        helpText: "Must be a U.S. phone number with direct link to laser operator"
      },
      {
        id: "secondary_phone",
        label: "Secondary On-Site Phone",
        type: "text",
        required: false
      }
    ]
  },
  {
    id: "section5",
    title: "Section 5: FDA/CDRH Information",
    description: "Variance details for demonstration lasers",
    fields: [
      {
        id: "variance_number",
        label: "FDA Variance Number",
        type: "text",
        required: false,
        helpText: "Required for laser light shows regulated by FDA/CDRH"
      },
      {
        id: "variance_expiration",
        label: "Variance Expiration Date",
        type: "date",
        required: false
      },
      {
        id: "accession_number",
        label: "FDA Accession Number",
        type: "text",
        required: false,
        helpText: "Seven alphanumeric digits provided by FDA/CDRH"
      }
    ]
  },
  {
    id: "section6",
    title: "Section 6: Control Measures",
    description: "Safety measures to protect airspace",
    fields: [
      {
        id: "control_measures",
        label: "Description of Control Measures",
        type: "textarea",
        required: true,
        helpText: "Describe observers, termination surfaces, radar/imaging equipment, or physical beam path limits"
      },
      {
        id: "electronic_protection",
        label: "Using Electronic Protection System?",
        type: "radio",
        required: true,
        options: ["Yes - Using SAE AS6029 compliant system", "No - Using safety observers", "No - Using beam termination"]
      }
    ]
  }
];

const TIMELINE_STEPS = [
  {
    day: -30,
    title: "Initial Filing Deadline",
    description: "Submit FAA Form 7140-1 to Service Center",
    critical: true,
    details: "Minimum 30 days before operation. Early submission recommended for complex operations."
  },
  {
    day: -21,
    title: "Aeronautical Study",
    description: "FAA reviews submission and coordinates with stakeholders",
    critical: false,
    details: "FAA service center personnel evaluate the proposal, verify data, and contact proponent if questions arise."
  },
  {
    day: -14,
    title: "Letter of Determination",
    description: "FAA issues LOD with determination",
    critical: true,
    details: "Letter states either 'no objection' or objections that must be resolved. DO NOT proceed until receiving LOD."
  },
  {
    day: -3,
    title: "NOTAM Filing Window",
    description: "Coordinate NOTAM issuance (24-72 hours prior)",
    critical: true,
    details: "NOTAM issued 24-72 hours before operation. Provides notification to pilots in the area."
  },
  {
    day: 0,
    title: "Operation Day",
    description: "Execute per approved Letter of Determination",
    critical: true,
    details: "Maintain ATC contact, position observers, monitor weather, and follow all LOD conditions."
  }
];

const NOTAM_CODES: NOTAMCode[] = [
  { code: "LASE", meaning: "Laser Activities", category: "Activity", description: "Indicates laser operations in the area" },
  { code: "LLZ", meaning: "Laser Light Show", category: "Activity", description: "Entertainment laser operations" },
  { code: "ALT", meaning: "Altitude", category: "Parameter", description: "Maximum affected altitude" },
  { code: "RADIUS", meaning: "Radius", category: "Parameter", description: "Distance from reference point" },
  { code: "COORD", meaning: "Coordinates", category: "Location", description: "Lat/long of laser source" },
  { code: "TIMES", meaning: "Times of Operation", category: "Schedule", description: "When laser is active" },
  { code: "CONT", meaning: "Contact", category: "Information", description: "Who to contact for information" },
  { code: "CANCEL", meaning: "Cancellation", category: "Status", description: "NOTAM has been cancelled" }
];

const DECODING_EXAMPLES = [
  {
    raw: "!DCA 05/103 DCA LASE LLZ 383649N0770231W (DCA210010) WITHIN 10NM RADIUS ALT 8000FT AGL DLY SR-SS MAY 5-8",
    decoded: [
      { part: "!DCA", meaning: "Issuing location: Washington DC ARTCC" },
      { part: "05/103", meaning: "NOTAM number 103 issued in May" },
      { part: "LASE LLZ", meaning: "Laser light show activity" },
      { part: "383649N0770231W", meaning: "Coordinates of laser source" },
      { part: "10NM RADIUS", meaning: "Affects area within 10 nautical miles" },
      { part: "ALT 8000FT", meaning: "Affects up to 8,000 feet above ground level" },
      { part: "DLY SR-SS", meaning: "Daily, sunrise to sunset" },
      { part: "MAY 5-8", meaning: "Effective dates May 5-8" }
    ]
  }
];

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function FormSimulator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [completed, setCompleted] = useState(false);
  const [showHelp, setShowHelp] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const currentSection = FORM_SECTIONS[currentStep];
  const progress = ((currentStep + 1) / FORM_SECTIONS.length) * 100;

  const handleFieldChange = (fieldId: string, value: string) => {
    setFormData(prev => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors(prev => ({ ...prev, [fieldId]: "" }));
    }
  };

  const validateStep = () => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    currentSection.fields.forEach(field => {
      if (field.required && !formData[field.id]) {
        newErrors[field.id] = "This field is required";
        isValid = false;
      }
    });

    setErrors(newErrors);
    return isValid;
  };

  const handleNext = () => {
    if (validateStep()) {
      if (currentStep < FORM_SECTIONS.length - 1) {
        setCurrentStep(prev => prev + 1);
      } else {
        setCompleted(true);
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const renderField = (field: FormField) => {
    const error = errors[field.id];
    const value = formData[field.id] || "";

    return (
      <div key={field.id} className="mb-4">
        <label className="block text-sm font-medium text-foreground mb-1">
          {field.label}
          {field.required && <span className="text-red-500 ml-1">*</span>}
        </label>

        {field.helpText && (
          <button
            onClick={() => setShowHelp(showHelp === field.id ? null : field.id)}
            className="text-xs text-blue-600 hover:text-blue-800 mb-1 flex items-center"
          >
            <Info className="w-3 h-3 mr-1" />
            {showHelp === field.id ? "Hide Help" : "Show Help"}
          </button>
        )}

        {showHelp === field.id && field.helpText && (
          <div className="bg-blue-50 p-2 rounded-lg mb-2 text-xs text-blue-800">
            {field.helpText}
          </div>
        )}

        {field.type === "select" && (
          <select
            className={cn(
              "w-full p-2 border rounded-lg text-sm",
              error ? "border-red-500" : "border-gray-300"
            )}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
          >
            <option value="">Select...</option>
            {field.options?.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        )}

        {field.type === "radio" && (
          <div className="space-y-2">
            {field.options?.map(opt => (
              <label key={opt} className="flex items-center p-2 border rounded-lg cursor-pointer hover:bg-muted text-sm">
                <input
                  type="radio"
                  name={field.id}
                  value={opt}
                  checked={value === opt}
                  onChange={(e) => handleFieldChange(field.id, e.target.value)}
                  className="mr-2"
                />
                <span>{opt}</span>
              </label>
            ))}
          </div>
        )}

        {field.type === "textarea" && (
          <textarea
            className={cn(
              "w-full p-2 border rounded-lg h-20 text-sm",
              error ? "border-red-500" : "border-gray-300"
            )}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
          />
        )}

        {field.type !== "select" && field.type !== "radio" && field.type !== "textarea" && (
          <input
            type={field.type}
            className={cn(
              "w-full p-2 border rounded-lg text-sm",
              error ? "border-red-500" : "border-gray-300"
            )}
            value={value}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
          />
        )}

        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
      </div>
    );
  };

  if (completed) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Form 7140-1 Completed!</h2>
          <p className="text-muted-foreground mb-6">
            You have successfully completed the simulated FAA Form 7140-1.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 text-left mb-6">
            <h3 className="font-semibold text-blue-900 mb-3">Next Steps in Real Process:</h3>
            <ol className="space-y-2 text-blue-800 text-sm">
              <li className="flex items-start gap-2">
                <span className="font-bold">1.</span>
                Attach diagrams depicting planned laser paths
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">2.</span>
                Include Laser Configuration Worksheet for each configuration
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">3.</span>
                Submit to appropriate FAA Service Center at least 30 days before operation
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">4.</span>
                Wait for Letter of Determination (LOD) from FAA
              </li>
              <li className="flex items-start gap-2">
                <span className="font-bold">5.</span>
                Do not proceed until receiving LOD with &quot;no objection&quot;
              </li>
            </ol>
          </div>

          <Button
            onClick={() => {
              setCurrentStep(0);
              setCompleted(false);
              setFormData({});
            }}
          >
            Start Over
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <div className="flex justify-between text-sm mb-2">
          <span className="font-medium">Step {currentStep + 1} of {FORM_SECTIONS.length}</span>
          <span className="text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} />
      </div>

      <Card className="border-2">
        <CardHeader className="bg-muted">
          <div className="flex items-center gap-3">
            <FileText className="w-5 h-5 text-blue-600" />
            <div>
              <CardTitle className="text-lg">{currentSection.title}</CardTitle>
              <CardDescription>{currentSection.description}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="bg-card p-4 rounded-lg border">
            {currentSection.fields.map(renderField)}
          </div>

          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 0}
              className="flex items-center gap-2"
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button
              onClick={handleNext}
              className="flex items-center gap-2"
            >
              {currentStep === FORM_SECTIONS.length - 1 ? (
                <>
                  <Send className="w-4 h-4" />
                  Complete Form
                </>
              ) : (
                <>
                  Next
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <AlertCircle className="w-4 h-4" />
            Key Reminders
          </h4>
          <ul className="text-sm text-yellow-800 space-y-1">
            <li>• All fields marked with * are required</li>
            <li>• File at least 30 days before the planned operation</li>
            <li>• Use decimal notation (0.7277) not scientific notation</li>
            <li>• Contact your local FAA Service Center if you need assistance</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

function FilingTimeline() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200" />
        
        {TIMELINE_STEPS.map((step, idx) => (
          <motion.div
            key={idx}
            className="relative pl-20 pb-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className={cn(
              "absolute left-6 w-5 h-5 rounded-full border-4 z-10",
              step.critical 
                ? "border-red-500 bg-card" 
                : "border-blue-500 bg-card"
            )} />
            
            <Card 
              className={cn(
                "cursor-pointer transition-all",
                expandedStep === idx ? "border-blue-500 shadow-md" : "hover:border-gray-300"
              )}
              onClick={() => setExpandedStep(expandedStep === idx ? null : idx)}
            >
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "px-3 py-1 rounded-full text-sm font-medium",
                      step.day < 0 ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"
                    )}>
                      {step.day < 0 ? `T${step.day}` : 'T-Day'}
                    </div>
                    <div>
                      <CardTitle className="text-base">{step.title}</CardTitle>
                      <CardDescription>{step.description}</CardDescription>
                    </div>
                  </div>
                  {step.critical && (
                    <Badge variant="destructive">Critical</Badge>
                  )}
                </div>
              </CardHeader>
              
              <AnimatePresence>
                {expandedStep === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <CardContent className="pt-0">
                      <div className="p-4 bg-muted rounded-lg text-sm text-foreground">
                        {step.details}
                      </div>
                    </CardContent>
                  </motion.div>
                )}
              </AnimatePresence>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

function NOTAMDecoder() {
  const [selectedExample, setSelectedExample] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const filteredCodes = selectedCategory === 'all' 
    ? NOTAM_CODES 
    : NOTAM_CODES.filter(c => c.category === selectedCategory);

  const categories = ['all', ...Array.from(new Set(NOTAM_CODES.map(c => c.category)))];

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-blue-600" />
              NOTAM Code Reference
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-4">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={cn(
                    "px-3 py-1 rounded-full text-xs font-medium transition-all",
                    selectedCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-muted text-muted-foreground hover:bg-gray-200"
                  )}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              ))}
            </div>

            <div className="space-y-2 max-h-[300px] overflow-y-auto">
              {filteredCodes.map((code, idx) => (
                <motion.div
                  key={code.code}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.03 }}
                  className="p-3 bg-muted rounded-lg"
                >
                  <div className="flex items-center gap-2">
                    <code className="font-bold text-blue-600">{code.code}</code>
                    <span className="text-sm">{code.meaning}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{code.description}</p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-2 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Example NOTAM Decoding
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 bg-gray-900 text-green-400 rounded-lg font-mono text-sm overflow-x-auto">
              {DECODING_EXAMPLES[selectedExample].raw}
            </div>

            <div className="space-y-2">
              {DECODING_EXAMPLES[selectedExample].decoded.map((part, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className="flex items-start gap-3 p-2 bg-blue-50 rounded-lg"
                >
                  <code className="font-bold text-blue-600 text-sm flex-shrink-0">
                    {part.part}
                  </code>
                  <span className="text-sm text-foreground">{part.meaning}</span>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Key Points
          </h4>
          <ul className="text-sm text-green-700 space-y-1">
            <li>• NOTAMs are issued 24-72 hours before laser operations</li>
            <li>• Pilots receive NOTAM information through briefings and FIS-B</li>
            <li>• D suffix indicates daily recurrence (e.g., DLY for daily)</li>
            <li>• Always verify NOTAM issuance before starting operations</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

export default function Module2_NOTAM() {
  const [activeTab, setActiveTab] = useState('form');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
          <Radio className="w-4 h-4" />
          Module 6.2
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">NOTAM Procedures</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Notice to Air Missions filing procedures, FAA Form 7140-1 walkthrough, 
          24-72 hour filing requirements, and NOTAM decoding for laser operations.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="form" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Form 7140-1
          </TabsTrigger>
          <TabsTrigger value="timeline" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Timeline
          </TabsTrigger>
          <TabsTrigger value="decoder" className="flex items-center gap-2">
            <Radio className="w-4 h-4" />
            NOTAM Decoder
          </TabsTrigger>
        </TabsList>

        <TabsContent value="form" className="mt-6">
          <FormSimulator />
        </TabsContent>

        <TabsContent value="timeline" className="mt-6">
          <FilingTimeline />
        </TabsContent>

        <TabsContent value="decoder" className="mt-6">
          <NOTAMDecoder />
        </TabsContent>
      </Tabs>

      {/* Reference Card */}
      <Card className="bg-muted border-gray-200">
        <CardContent className="pt-4">
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <span>Contact: <strong>FAA Service Center</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span>Deadline: <strong>30 days minimum</strong></span>
            </div>
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-muted-foreground" />
              <span>Form: <strong>7140-1 (Rev. 2022)</strong></span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
