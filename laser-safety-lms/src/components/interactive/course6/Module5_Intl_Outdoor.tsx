'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Globe, 
  Scale, 
  Plane,
  Info,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Building,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// ============================================================================
// DATA CONSTANTS
// ============================================================================

interface Standard {
  id: string;
  name: string;
  authority: string;
  scope: string;
  keyRequirements: string[];
  differences: string[];
}

interface CountryRequirement {
  country: string;
  authority: string;
  permitRequired: boolean;
  leadTime: string;
  keyDocuments: string[];
  specialNotes: string[];
}

const IEC_60825_3 = {
  title: "IEC 60825-3:2019",
  subtitle: "Safety of laser products - Part 3: Guidance for laser displays and shows",
  scope: [
    "Applicable to laser displays and shows including theatrical, educational, and entertainment applications",
    "Covers both indoor and outdoor laser operations",
    "Provides hazard analysis and risk assessment methodologies",
    "Defines safety measures for public and occupational exposure"
  ],
  keyRequirements: [
    "Maximum Permissible Exposure (MPE) calculations for all accessible locations",
    "Nominal Ocular Hazard Distance (NOHD) determination",
    "Nominal Ocular Hazard Area (NOHA) evaluation for scanned beams",
    "Safety officer designation and responsibilities",
    "Equipment safety features (scan-fail, interlocks, key control)",
    "Audience scanning evaluation per IEC 60825-3 Annex A"
  ],
  hazardClasses: [
    { class: "Class 1", description: "Safe under all conditions of normal use" },
    { class: "Class 1M", description: "Safe except when passed through magnifying optics" },
    { class: "Class 2", description: "Safe due to blink reflex (visible only, ≤1 mW)" },
    { class: "Class 2M", description: "As Class 2 but unsafe with magnifying optics" },
    { class: "Class 3R", description: "Low risk, normally safe with limited exposure" },
    { class: "Class 3B", description: "Direct beam viewing hazardous" },
    { class: "Class 4", description: "Eye and skin hazard, fire risk - all outdoor show lasers" }
  ]
};

const EASA_REQUIREMENTS = {
  title: "EASA (European Union Aviation Safety Agency)",
  regulations: [
    {
      name: "SERA.6001",
      description: "General prohibition against directing laser beams at aircraft",
      penalty: "Member state dependent, typically criminal prosecution"
    },
    {
      name: "Regulation (EU) 2015/1018",
      description: "Rules for non-military operations in European airspace",
      penalty: "Administrative and criminal penalties"
    }
  ],
  coordination: [
    "Coordination with national civil aviation authorities required",
    "NOTAM filing 7-30 days in advance (varies by state)",
    "Risk assessment documentation required",
    "Insurance requirements vary by country (typically €5-10M)"
  ],
  memberStates: [
    "Germany (LBA)", "France (DGAC)", "Netherlands (ILT)", 
    "Italy (ENAC)", "Spain (AESA)", "Poland (ULC)",
    "All 27 EU member states + EFTA states"
  ]
};

const UK_CAA_REQUIREMENTS = {
  title: "UK CAA (Civil Aviation Authority)",
  keyDocuments: [
    "CAP 736 - Operation of Directed Light, Fireworks, Toy Balloons and Sky Lanterns",
    "CAP 1902 - UK Flight Safety and Airspace Regulation",
    "ORS4 No.1258 - Laser Regulation Exemption"
  ],
  process: [
    "Submit Form SRG 1305 to UK CAA",
    "Provide laser safety calculations (NOHD, etc.)",
    "Minimum 28 days notice for single events",
    "Permanent installations require specific approval",
    "May require aeronautical study for complex operations"
  ],
  uniqueFeatures: [
    "CAA can grant exemptions to certain laser regulations",
    "Police consultation may be required",
    "Local authority entertainment license may be needed",
    "CAP 736 provides comprehensive guidance on coordination"
  ]
};

const COUNTRY_REQUIREMENTS: CountryRequirement[] = [
  {
    country: "Germany",
    authority: "LBA (Luftfahrt-Bundesamt)",
    permitRequired: true,
    leadTime: "4-6 weeks minimum",
    keyDocuments: ["Laser safety concept", "Risk assessment", "NOTAM request", "Insurance certificate"],
    specialNotes: ["Strict beam termination requirements", "May require local aviation office coordination"]
  },
  {
    country: "France",
    authority: "DGAC (Direction Générale de l'Aviation Civile)",
    permitRequired: true,
    leadTime: "2-4 weeks",
    keyDocuments: ["Dossier technique", "Safety study", "Operator certification"],
    specialNotes: ["Prefecture coordination often required", "Class 4 lasers strictly regulated"]
  },
  {
    country: "United Kingdom",
    authority: "CAA (Civil Aviation Authority)",
    permitRequired: true,
    leadTime: "28 days minimum",
    keyDocuments: ["Form SRG 1305", "Laser safety calculations", "Site plan", "Insurance"],
    specialNotes: ["CAP 736 provides detailed guidance", "Police consultation may be required"]
  },
  {
    country: "Canada",
    authority: "Transport Canada",
    permitRequired: true,
    leadTime: "30+ days",
    keyDocuments: ["Laser Notice submission", "Aviation safety assessment"],
    specialNotes: ["Coordination with NAV CANADA for NOTAM", "Similar to US FAA process"]
  },
  {
    country: "Australia",
    authority: "CASA (Civil Aviation Safety Authority)",
    permitRequired: true,
    leadTime: "21+ days",
    keyDocuments: ["Laser approval application", "Risk assessment", "Safety management plan"],
    specialNotes: ["Strict import controls on high-power lasers", "State-level restrictions vary"]
  },
  {
    country: "Japan",
    authority: "JCAB (Japan Civil Aviation Bureau)",
    permitRequired: true,
    leadTime: "4-6 weeks",
    keyDocuments: ["Application form", "Laser specifications", "Safety measures description"],
    specialNotes: ["Complex approval process", "Local agent often required"]
  }
];

const COMPARISON_DATA = {
  us: {
    authority: "FAA",
    form: "7140-1",
    leadTime: "30 days",
    zones: "LFZ, CFZ, SFZ, NFZ",
    thresholds: "50 nW/cm², 5 µW/cm², 100 µW/cm²",
    notable: "Most systematic zone-based approach"
  },
  eu: {
    authority: "EASA + National CAAs",
    form: "Varies by country",
    leadTime: "21-42 days",
    zones: "Member state dependent",
    thresholds: "Generally harmonized with ICAO",
    notable: "Regulatory harmonization in progress"
  },
  uk: {
    authority: "CAA",
    form: "SRG 1305",
    leadTime: "28 days",
    zones: "Similar to FAA zones",
    thresholds: "Similar to FAA (CAP 736)",
    notable: "Comprehensive CAP guidance documents"
  },
  icao: {
    authority: "ICAO (Guidance)",
    form: "N/A - Guidance only",
    leadTime: "N/A",
    zones: "Recommended zone definitions",
    thresholds: "Recommended exposure limits",
    notable: "Annex 14 - Aerodrome Design and Operations"
  }
};

// ============================================================================
// SECTION COMPONENTS
// ============================================================================

function IEC60825Overview() {
  const [selectedHazardClass, setSelectedHazardClass] = useState<number | null>(null);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Globe className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>{IEC_60825_3.title}</CardTitle>
              <CardDescription>{IEC_60825_3.subtitle}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Scope and Application</h4>
            <ul className="space-y-2">
              {IEC_60825_3.scope.map((item, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Key Requirements</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {IEC_60825_3.keyRequirements.map((req, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-3 bg-blue-50 rounded-lg text-sm text-blue-800"
                >
                  {req}
                </motion.div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-foreground mb-3">Laser Hazard Classes</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {IEC_60825_3.hazardClasses.map((hc, idx) => (
                <motion.button
                  key={hc.class}
                  onClick={() => setSelectedHazardClass(selectedHazardClass === idx ? null : idx)}
                  className={cn(
                    "p-3 rounded-lg border-2 text-left transition-all",
                    selectedHazardClass === idx
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  )}
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="font-bold text-sm">{hc.class}</div>
                  <div className="text-xs text-muted-foreground mt-1">{hc.description}</div>
                </motion.button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            IEC 60825-3 and FAA AC 70-1B Relationship
          </h4>
          <p className="text-sm text-yellow-700">
            While FAA AC 70-1B is the primary US regulatory document, it references IEC 60825-1 for MPE calculations 
            and classification. IEC 60825-3 specifically addresses laser shows and displays, providing guidance 
            that complements (but does not replace) national aviation requirements. For international operations, 
            compliance with both IEC standards and local aviation regulations is typically required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

function EASARequirements() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <Building className="w-6 h-6 text-blue-600" />
            <div>
              <CardTitle>{EASA_REQUIREMENTS.title}</CardTitle>
              <CardDescription>European Union Aviation Safety Agency Regulations</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Key Regulations</h4>
            <div className="space-y-3">
              {EASA_REQUIREMENTS.regulations.map((reg, idx) => (
                <div key={idx} className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-blue-600">{reg.name}</span>
                    <Badge variant="outline">{reg.penalty}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{reg.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-foreground mb-3">Coordination Requirements</h4>
              <ul className="space-y-2">
                {EASA_REQUIREMENTS.coordination.map((item, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <ChevronRight className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-foreground mb-3">Member State Authorities</h4>
              <div className="flex flex-wrap gap-2">
                {EASA_REQUIREMENTS.memberStates.map((state, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">
                    {state}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="w-5 h-5 text-purple-600" />
              UK CAA Requirements
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-semibold text-sm mb-2">Key Documents</h4>
              <ul className="space-y-1">
                {UK_CAA_REQUIREMENTS.keyDocuments.map((doc, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                    <FileText className="w-3 h-3 mt-1 text-muted-foreground" />
                    {doc}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-2">Application Process</h4>
              <ul className="space-y-1">
                {UK_CAA_REQUIREMENTS.process.map((step, idx) => (
                  <li key={idx} className="text-sm text-muted-foreground">• {step}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-green-600" />
              UK Unique Features
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {UK_CAA_REQUIREMENTS.uniqueFeatures.map((feature, idx) => (
                <li key={idx} className="text-sm text-muted-foreground flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function CountryRequirementsTable() {
  const [selectedCountry, setSelectedCountry] = useState<CountryRequirement>(COUNTRY_REQUIREMENTS[0]);

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Select Country</h3>
        {COUNTRY_REQUIREMENTS.map((country) => (
          <motion.button
            key={country.country}
            onClick={() => setSelectedCountry(country)}
            className={cn(
              "w-full p-4 rounded-lg border-2 text-left transition-all",
              selectedCountry.country === country.country
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300 bg-card"
            )}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between">
              <span className="font-medium">{country.country}</span>
              <Badge variant={country.permitRequired ? "destructive" : "default"}>
                {country.permitRequired ? "Permit Required" : "No Permit"}
              </Badge>
            </div>
            <p className="text-xs text-muted-foreground mt-1">{country.authority}</p>
          </motion.button>
        ))}
      </div>

      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{selectedCountry.country}</CardTitle>
              <CardDescription>{selectedCountry.authority}</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              Lead time: {selectedCountry.leadTime}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h4 className="font-semibold text-foreground mb-3">Required Documents</h4>
            <div className="flex flex-wrap gap-2">
              {selectedCountry.keyDocuments.map((doc, idx) => (
                <Badge key={idx} variant="secondary" className="text-sm py-1">
                  <FileText className="w-3 h-3 mr-1" />
                  {doc}
                </Badge>
              ))}
            </div>
          </div>

          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <h4 className="font-semibold text-yellow-800 mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              Special Considerations
            </h4>
            <ul className="space-y-1">
              {selectedCountry.specialNotes.map((note, idx) => (
                <li key={idx} className="text-sm text-yellow-700 flex items-start gap-2">
                  <span>•</span>{note}
                </li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function InternationalComparison() {
  const regions = [
    { id: 'us', label: 'United States (FAA)', icon: '🇺🇸' },
    { id: 'eu', label: 'European Union (EASA)', icon: '🇪🇺' },
    { id: 'uk', label: 'United Kingdom (CAA)', icon: '🇬🇧' },
    { id: 'icao', label: 'ICAO (Guidance)', icon: '✈️' }
  ];

  const [selectedRegion, setSelectedRegion] = useState<string>('us');
  const data = COMPARISON_DATA[selectedRegion as keyof typeof COMPARISON_DATA];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {regions.map((region) => (
          <button
            key={region.id}
            onClick={() => setSelectedRegion(region.id)}
            className={cn(
              "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2",
              selectedRegion === region.id
                ? "border-blue-500 bg-blue-50 text-blue-700"
                : "border-gray-200 hover:border-gray-300"
            )}
          >
            <span>{region.icon}</span>
            {region.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={selectedRegion}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Authority</span>
                    <span className="font-medium">{data.authority}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Application Form</span>
                    <span className="font-medium">{data.form}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Lead Time</span>
                    <span className="font-medium">{data.leadTime}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Flight Zones</span>
                    <span className="font-medium">{data.zones}</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                    <span className="text-sm text-muted-foreground">Exposure Thresholds</span>
                    <span className="font-medium text-xs">{data.thresholds}</span>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <span className="text-sm text-blue-600">Notable: {data.notable}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      <Card className="bg-green-50 border-green-200">
        <CardContent className="pt-4">
          <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
            <Info className="w-4 h-4" />
            International Operations Best Practice
          </h4>
          <p className="text-sm text-green-700">
            When planning international laser shows, always engage local aviation authorities early in the planning process. 
            Requirements vary significantly between countries, and some may have additional local (state/provincial) requirements 
            beyond national regulations. Professional liability insurance with international coverage is typically required.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// ============================================================================
// MAIN MODULE COMPONENT
// ============================================================================

export default function Module5_Intl_Outdoor() {
  const [activeTab, setActiveTab] = useState('iec');

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <motion.div 
        className="text-center py-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
          <Globe className="w-4 h-4" />
          Module 6.5
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-3">International Outdoor Standards</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          IEC 60825-3 international standards, EASA requirements, UK CAA regulations, 
          and country-by-country comparison for global laser operations.
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="iec" className="flex items-center gap-2">
            <Scale className="w-4 h-4" />
            IEC 60825-3
          </TabsTrigger>
          <TabsTrigger value="easa" className="flex items-center gap-2">
            <Building className="w-4 h-4" />
            EASA / CAA
          </TabsTrigger>
          <TabsTrigger value="countries" className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            By Country
          </TabsTrigger>
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <Plane className="w-4 h-4" />
            Compare
          </TabsTrigger>
        </TabsList>

        <TabsContent value="iec" className="mt-6">
          <IEC60825Overview />
        </TabsContent>

        <TabsContent value="easa" className="mt-6">
          <EASARequirements />
        </TabsContent>

        <TabsContent value="countries" className="mt-6">
          <CountryRequirementsTable />
        </TabsContent>

        <TabsContent value="compare" className="mt-6">
          <InternationalComparison />
        </TabsContent>
      </Tabs>

      {/* Reference */}
      <Card className="bg-muted border-gray-200">
        <CardContent className="pt-4">
          <div className="text-sm text-muted-foreground">
            <strong>Reference Documents:</strong> IEC 60825-3:2019, EASA SERA.6001, 
            UK CAA CAP 736, ICAO Annex 14, ANSI Z136.1-2022 (US MPE reference)
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
