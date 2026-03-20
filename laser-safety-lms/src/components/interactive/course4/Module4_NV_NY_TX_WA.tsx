"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Building2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Users,
  FileText,
  Phone,
  GraduationCap,
  MapPin,
  Star,
  Clock,
  Info,
  Search,
  Filter,
  ExternalLink
} from "lucide-react";

// ============================================================================
// SECTION 1: STATE DATA
// ============================================================================

interface StateData {
  id: string;
  name: string;
  abbreviation: string;
  region: string;
  tier: "comprehensive" | "notification" | "minimal";
  authority: string;
  contact: {
    name: string;
    title: string;
    phone: string;
    email?: string;
    address: string;
  };
  requirements: string[];
  inspections: boolean;
  trainingRequired: boolean;
  advanceNotice: string;
  specialFeatures: string[];
}

const statesData: StateData[] = [
  {
    id: "nevada",
    name: "Nevada",
    abbreviation: "NV",
    region: "West",
    tier: "notification",
    authority: "Radiation Control Program, Division of Public and Behavioral Health",
    contact: {
      name: "Karen Beckley",
      title: "Manager, Radiation Control Program",
      phone: "(775) 687-7550",
      email: "radiationcontrolprogram@health.nv.gov",
      address: "675 Fairview Drive, Suite 218, Carson City, NV 89701"
    },
    requirements: [
      "Advance notification recommended",
      "No state-specific registration",
      "Follow FDA requirements for variances"
    ],
    inspections: false,
    trainingRequired: false,
    advanceNotice: "Advance notification",
    specialFeatures: [
      "Entertainment capital focus (Las Vegas)",
      "Minimal regulatory burden",
      "No routine inspections",
      "Local fire department permits may apply"
    ]
  },
  {
    id: "new-york",
    name: "New York",
    abbreviation: "NY",
    region: "Northeast",
    tier: "comprehensive",
    authority: "NYS Department of Labor, Radiological Health Unit",
    contact: {
      name: "Kirk Fisher",
      title: "Radiophysicist",
      phone: "(518) 457-1202",
      address: "State Campus Building 12 Room 169, Albany, NY 12240"
    },
    requirements: [
      "Class A or Class B Certificate required",
      "Mandatory training from approved provider",
      "Industrial Code Rule 50 compliance",
      "Routine inspections conducted"
    ],
    inspections: true,
    trainingRequired: true,
    advanceNotice: "As specified",
    specialFeatures: [
      "Only state with mandatory training",
      "Class A: Low intensity only",
      "Class B: Low and high intensity",
      "Approved training providers list maintained"
    ]
  },
  {
    id: "texas",
    name: "Texas",
    abbreviation: "TX",
    region: "South",
    tier: "comprehensive",
    authority: "Department of State Health Services, Radiation Safety Licensing Branch",
    contact: {
      name: "Shannon Dove-Edson",
      title: "Program Manager, Laser Registration Program",
      phone: "(512) 834-6688",
      email: "shannon.dove-edson@dshs.state.tx.us",
      address: "1100 W. 49th Street, Mail Code 2835, Austin, TX 78756"
    },
    requirements: [
      "Equipment registration required",
      "25 TAC 289.301 compliance",
      "Special provisions for laser hair removal",
      "IPL devices regulated"
    ],
    inspections: true,
    trainingRequired: false,
    advanceNotice: "As specified",
    specialFeatures: [
      "Multi-agency coordination",
      "Laser hair removal specific rules (25 TAC 289.302)",
      "ILDA industry engagement history",
      "In-state registration agent may be required"
    ]
  },
  {
    id: "washington",
    name: "Washington",
    abbreviation: "WA",
    region: "West",
    tier: "notification",
    authority: "Department of Health, X-Ray Control/Radiation Protection",
    contact: {
      name: "David B. Jansen",
      title: "Director",
      phone: "(360) 236-3210",
      email: "radioiationinfo@doh.wa.gov",
      address: "P.O. Box 47827, Olympia, WA 98504"
    },
    requirements: [
      "Light show advance written notification",
      "WAC 296-62-09005 compliance",
      "No state laser registration"
    ],
    inspections: false,
    trainingRequired: false,
    advanceNotice: "Light show specific",
    specialFeatures: [
      "Light show specific notification",
      "No routine inspections",
      "Department of Labor & Industries coordination",
      "Streamlined entertainment focus"
    ]
  }
];

// ============================================================================
// SECTION 2: COMPARISON MATRIX
// ============================================================================

interface ComparisonFeature {
  feature: string;
  nevada: string;
  "new-york": string;
  texas: string;
  washington: string;
}

const comparisonMatrix: ComparisonFeature[] = [
  {
    feature: "Regulatory Tier",
    nevada: "Notification Only",
    "new-york": "Comprehensive",
    texas: "Comprehensive",
    washington: "Notification Only"
  },
  {
    feature: "Registration Required",
    nevada: "No",
    "new-york": "Yes (Certificate)",
    texas: "Yes (Equipment)",
    washington: "No"
  },
  {
    feature: "Training Required",
    nevada: "No",
    "new-york": "Yes (Mandatory)",
    texas: "No",
    washington: "No"
  },
  {
    feature: "Routine Inspections",
    nevada: "No",
    "new-york": "Yes",
    texas: "Yes",
    washington: "No"
  },
  {
    feature: "Certificate Types",
    nevada: "N/A",
    "new-york": "Class A & B",
    texas: "Registration Certificate",
    washington: "N/A"
  },
  {
    feature: "Special Focus",
    nevada: "Entertainment (Vegas)",
    "new-york": "Training Providers",
    texas: "Medical/Cosmetic",
    washington: "Light Shows"
  },
  {
    feature: "Advance Notice",
    nevada: "Recommended",
    "new-york": "As specified",
    texas: "As specified",
    washington: "Show specific"
  },
  {
    feature: "Multi-Agency",
    nevada: "No",
    "new-york": "No",
    texas: "Yes",
    washington: "Yes (L&I)"
  }
];

// ============================================================================
// SECTION 3: NY TRAINING PROVIDERS
// ============================================================================

interface NYTrainingProvider {
  name: string;
  organization: string;
  location: string;
  phone: string;
  certificateType: "A" | "B" | "Both";
}

const nyTrainingProviders: NYTrainingProvider[] = [
  {
    name: "Joseph A. Zappone / Peter Nardolillo",
    organization: "Tri-Cities Laborers' Training Program",
    location: "666 Wemple Road, Glenmont, NY 12077",
    phone: "(518) 426-0290",
    certificateType: "A"
  },
  {
    name: "John Anselmo",
    organization: "Institute of Design & Construction",
    location: "141 Willoughby Street, Brooklyn, NY 11201",
    phone: "(718) 855-3661",
    certificateType: "A"
  },
  {
    name: "Martin Daly",
    organization: "NY District Council of Carpenters Labor Technical College",
    location: "395 Hudson Street, New York, NY 10014",
    phone: "(212) 727-2224",
    certificateType: "A"
  },
  {
    name: "Norman Ballard",
    organization: "Rarefied Media Inc.",
    location: "337 West 76th Street, New York, NY 10023",
    phone: "(212) 874-1431",
    certificateType: "B"
  },
  {
    name: "Theodore Marotta",
    organization: "Hudson Valley Community College",
    location: "80 Vandenburgh Ave, Hudson Hall, Troy, NY 12180",
    phone: "(518) 283-1100",
    certificateType: "B"
  },
  {
    name: "F.J. Bradley",
    organization: "Health Physics Consultant",
    location: "605 East 82nd Street, #2H, New York, NY 10028",
    phone: "(212) 628-6580",
    certificateType: "B"
  },
  {
    name: "Roberta McHatton",
    organization: "Laser Safety Services",
    location: "Remote/Various",
    phone: "425-753-5644",
    certificateType: "B"
  },
  {
    name: "LIA Laser Institute",
    organization: "Laser Institute of America",
    location: "Various Locations",
    phone: "(407) 380-1553",
    certificateType: "Both"
  }
];

// ============================================================================
// SECTION 4: TEXAS ILDA COMMENTS SUMMARY
// ============================================================================

const ildaRecommendations = [
  {
    topic: "Registration of CW Lasers",
    ildaPosition: "Not needed - no demonstrated injuries",
    currentStatus: "Registration required"
  },
  {
    topic: "Pulsed Lasers",
    ildaPosition: "Should require registration",
    currentStatus: "Same as CW lasers"
  },
  {
    topic: "High-Power Lasers",
    ildaPosition: "Register if >50W per beam",
    currentStatus: "All Class 3B/4 require registration"
  },
  {
    topic: "In-State Registration Agent",
    ildaPosition: "Should be dropped",
    currentStatus: "Currently required"
  },
  {
    topic: "Advance Notification",
    ildaPosition: "Should no longer be required",
    currentStatus: "Currently required"
  },
  {
    topic: "LSO Definition",
    ildaPosition: "Remove 'authorized on certificate' language",
    currentStatus: "Certificate authorization required"
  }
];

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Module4_NV_NY_TX_WA() {
  const [activeTab, setActiveTab] = useState("matrix");
  const [selectedState, setSelectedState] = useState<string>("nevada");
  const [filterTier, setFilterTier] = useState<string>("all");

  const filteredStates = useMemo(() => {
    if (filterTier === "all") return statesData;
    return statesData.filter(s => s.tier === filterTier);
  }, [filterTier]);

  const stateDetail = useMemo(() => {
    return statesData.find(s => s.id === selectedState);
  }, [selectedState]);

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Module 4.4: Nevada, New York, Texas, Washington</h1>
        <p className="text-muted-foreground">
          Four-state comparison: Entertainment-focused Nevada, training-mandatory NY, multi-agency Texas, and notification-only Washington
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-6 w-full">
          <TabsTrigger value="matrix">4-State Matrix</TabsTrigger>
          <TabsTrigger value="nevada">Nevada</TabsTrigger>
          <TabsTrigger value="new-york">New York</TabsTrigger>
          <TabsTrigger value="texas">Texas</TabsTrigger>
          <TabsTrigger value="washington">Washington</TabsTrigger>
        </TabsList>

        {/* MATRIX TAB */}
        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  <CardTitle>4-State Comparison Matrix</CardTitle>
                </div>
                <div className="flex gap-2">
                  <Badge 
                    variant={filterTier === "all" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterTier("all")}
                  >
                    All
                  </Badge>
                  <Badge 
                    variant={filterTier === "comprehensive" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterTier("comprehensive")}
                  >
                    Comprehensive
                  </Badge>
                  <Badge 
                    variant={filterTier === "notification" ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => setFilterTier("notification")}
                  >
                    Notification Only
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="px-3 py-3 text-left font-medium sticky left-0 bg-muted z-10">Feature</th>
                      {filteredStates.map(state => (
                        <th 
                          key={state.id}
                          className={`px-3 py-3 text-left font-medium ${
                            state.tier === "comprehensive" ? "bg-blue-50 text-blue-800" : "bg-green-50 text-green-800"
                          }`}
                        >
                          {state.abbreviation}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {comparisonMatrix.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                        <td className="px-3 py-3 font-medium sticky left-0 bg-inherit border-r">{row.feature}</td>
                        {filteredStates.map(state => (
                          <td key={state.id} className="px-3 py-3">
                            {(row as any)[state.id]}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Comprehensive States (NY, TX)</h4>
                  <ul className="text-sm text-blue-700 space-y-1">
                    <li>• Full registration required</li>
                    <li>• Routine inspections</li>
                    <li>• Detailed compliance requirements</li>
                    <li>• State authority oversight</li>
                  </ul>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800 mb-2">Notification States (NV, WA)</h4>
                  <ul className="text-sm text-green-700 space-y-1">
                    <li>• Advance notification only</li>
                    <li>• No routine inspections</li>
                    <li>• Minimal state oversight</li>
                    <li>• Federal compliance focus</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* State Selector for Detail View */}
          <Card>
            <CardHeader>
              <CardTitle>State Detail View</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-2 mb-4">
                {statesData.map(state => (
                  <Button
                    key={state.id}
                    variant={selectedState === state.id ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedState(state.id)}
                  >
                    {state.abbreviation}
                  </Button>
                ))}
              </div>

              {stateDetail && (
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-lg">{stateDetail.name}</h3>
                      <Badge variant={stateDetail.tier === "comprehensive" ? "default" : "secondary"}>
                        {stateDetail.tier}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{stateDetail.authority}</p>
                    
                    <div className="mt-4 space-y-2">
                      <h4 className="font-medium">Requirements:</h4>
                      <ul className="text-sm space-y-1">
                        {stateDetail.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="p-4 bg-muted rounded-lg">
                    <h4 className="font-medium mb-2">Contact Information</h4>
                    <div className="text-sm space-y-1">
                      <p className="font-medium">{stateDetail.contact.name}</p>
                      <p className="text-muted-foreground">{stateDetail.contact.title}</p>
                      <p className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        {stateDetail.contact.phone}
                      </p>
                      {stateDetail.contact.email && (
                        <p className="text-muted-foreground">{stateDetail.contact.email}</p>
                      )}
                      <p className="text-xs text-muted-foreground mt-2">{stateDetail.contact.address}</p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* NEVADA TAB */}
        <TabsContent value="nevada" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-amber-500" />
                <CardTitle>Nevada - Entertainment Capital Focus</CardTitle>
              </div>
              <CardDescription>
                Minimal state oversight with focus on Las Vegas entertainment industry
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <XCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">No Registration</p>
                  <p className="text-xs text-muted-foreground">State level</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <XCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">No Inspections</p>
                  <p className="text-xs text-muted-foreground">Routine</p>
                </div>
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <XCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">No Training Req.</p>
                  <p className="text-xs text-muted-foreground">State mandated</p>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <h4 className="font-medium text-amber-800 flex items-center gap-2">
                  <Info className="h-4 w-4" />
                  Entertainment Industry Note
                </h4>
                <p className="text-sm text-amber-700 mt-2">
                  Nevada&apos;s minimal regulations reflect the massive entertainment industry in Las Vegas. 
                  Local fire departments (e.g., Clark County Fire) may have additional requirements for 
                  venues on the Strip.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Special Features:</h4>
                <ul className="space-y-2">
                  {statesData.find(s => s.id === "nevada")?.specialFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 text-amber-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* NEW YORK TAB */}
        <TabsContent value="new-york" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-5 w-5 text-blue-500" />
                <CardTitle>New York - Training Requirements</CardTitle>
              </div>
              <CardDescription>
                Only state with mandatory training certification requirement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2">Class A Certificate</h4>
                  <p className="text-sm text-blue-700">Low intensity lasers only</p>
                  <Badge variant="secondary" className="mt-2">Less Restrictive</Badge>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2">Class B Certificate</h4>
                  <p className="text-sm text-purple-700">Low and high intensity lasers</p>
                  <Badge className="mt-2">More Comprehensive</Badge>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">Approved Training Providers</h4>
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-3 py-2 text-left">Provider</th>
                        <th className="px-3 py-2 text-left">Location</th>
                        <th className="px-3 py-2 text-left">Certificate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {nyTrainingProviders.map((provider, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-muted/30"}>
                          <td className="px-3 py-2">
                            <p className="font-medium">{provider.name}</p>
                            <p className="text-xs text-muted-foreground">{provider.organization}</p>
                          </td>
                          <td className="px-3 py-2 text-xs">{provider.location}</td>
                          <td className="px-3 py-2">
                            <Badge variant={provider.certificateType === "B" ? "default" : "secondary"}>
                              {provider.certificateType}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Important Note</p>
                    <p className="text-sm text-amber-700">
                      New York City has additional requirements: FDNY permit for theatrical fog/haze 
                      and Certificate of Fitness (COF) required.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* TEXAS TAB */}
        <TabsContent value="texas" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Building2 className="h-5 w-5 text-orange-500" />
                <CardTitle>Texas - Multi-Agency Approach</CardTitle>
              </div>
              <CardDescription>
                Comprehensive state registration with special provisions for medical/cosmetic use
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-orange-50 rounded-lg">
                  <h4 className="font-medium text-orange-800 mb-2">25 TAC 289.301</h4>
                  <p className="text-sm text-orange-700">
                    Registration and Radiation Safety Requirements for Lasers and Intense-Pulsed Light Devices
                  </p>
                </div>
                <div className="p-4 bg-red-50 rounded-lg">
                  <h4 className="font-medium text-red-800 mb-2">25 TAC 289.302</h4>
                  <p className="text-sm text-red-700">
                    Special provisions for Laser Hair Removal Devices
                  </p>
                </div>
              </div>

              <Separator />

              <div>
                <h4 className="font-medium mb-3">ILDA Industry Comments (2023)</h4>
                <div className="space-y-2">
                  {ildaRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-3 border rounded-lg">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm">{rec.topic}</span>
                        <Badge variant="outline">ILDA Input</Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 mt-2 text-xs">
                        <div>
                          <span className="text-muted-foreground">ILDA Position:</span>
                          <p className="text-green-700">{rec.ildaPosition}</p>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Current Status:</span>
                          <p className="text-amber-700">{rec.currentStatus}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">Texas-Specific Requirements</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• In-state registration agent may be required for out-of-state operators</li>
                  <li>• Special Business Information Form requirements</li>
                  <li>• LSO must be "specifically authorized on certificate of laser registration"</li>
                  <li>• Pulsed lasers and high-power lasers have specific considerations</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* WASHINGTON TAB */}
        <TabsContent value="washington" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-teal-500" />
                <CardTitle>Washington - Notification System</CardTitle>
              </div>
              <CardDescription>
                Light show specific notification with Department of Labor & Industries coordination
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="p-4 bg-green-50 rounded-lg text-center">
                  <XCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                  <p className="font-medium">No Registration</p>
                  <p className="text-xs text-muted-foreground">State laser registry</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg text-center">
                  <Clock className="h-8 w-8 text-amber-600 mx-auto mb-2" />
                  <p className="font-medium">Notification</p>
                  <p className="text-xs text-muted-foreground">Light show specific</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg text-center">
                  <Building2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                  <p className="font-medium">L&I Coordination</p>
                  <p className="text-xs text-muted-foreground">WAC 296-62-09005</p>
                </div>
              </div>

              <div className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
                <h4 className="font-medium text-teal-800 mb-2">WAC 296-62-09005</h4>
                <p className="text-sm text-teal-700">
                  Washington Administrative Code covering laser safety in the workplace. 
                  Light shows require advance written notification to the Department of Health, 
                  Radiation Protection Program.
                </p>
              </div>

              <div>
                <h4 className="font-medium mb-2">Key Features:</h4>
                <ul className="space-y-2">
                  {statesData.find(s => s.id === "washington")?.specialFeatures.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-teal-500 mt-0.5" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-start gap-2">
                  <Info className="h-5 w-5 mt-0.5" />
                  <div>
                    <p className="font-medium">Multi-Agency Note</p>
                    <p className="text-sm text-muted-foreground">
                      Washington coordinates between the Department of Health (Radiation Protection) 
                      and Department of Labor & Industries for workplace safety compliance.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Module4_NV_NY_TX_WA;
