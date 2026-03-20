"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress, ProgressTrack, ProgressIndicator } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Bus,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Clock,
  Download,
  Filter,
  Search,
  FileText,
  Phone,
  Globe,
  Route,
  Plus,
  X,
  Info,
  XCircle
} from "lucide-react";

// ============================================================================
// SECTION 1: 50-STATE MATRIX DATA
// ============================================================================

interface StateRegulation {
  id: string;
  name: string;
  abbreviation: string;
  region: string;
  tier: "comprehensive" | "notification" | "minimal" | "federal";
  permitRequired: boolean;
  trainingRequired: boolean;
  inspections: boolean;
  advanceNotice: string;
  advanceNoticeDays: number;
  maxPenalty?: string;
  contact: string;
  phone: string;
  notes?: string;
}

const allStatesData: StateRegulation[] = [
  // Comprehensive States
  { id: "arizona", name: "Arizona", abbreviation: "AZ", region: "West", tier: "comprehensive", permitRequired: true, trainingRequired: false, inspections: false, advanceNotice: "Written notification", advanceNoticeDays: 14, maxPenalty: "$408 annual fee", contact: "Arizona Radiation Regulation Agency", phone: "(602) 469-2059", notes: "Article 14, Rules for Control of NIR" },
  { id: "florida", name: "Florida", abbreviation: "FL", region: "South", tier: "comprehensive", permitRequired: true, trainingRequired: false, inspections: false, advanceNotice: "20 days (out-of-state)", advanceNoticeDays: 20, maxPenalty: "Case by case", contact: "Dept. of Health, Bureau of Radiation Control", phone: "(850) 245-4266", notes: "Chapter 64E-4, no fee" },
  { id: "illinois", name: "Illinois", abbreviation: "IL", region: "Midwest", tier: "comprehensive", permitRequired: true, trainingRequired: true, inspections: true, advanceNotice: "10 working days", advanceNoticeDays: 10, maxPenalty: "Case by case", contact: "Illinois Emergency Management Agency", phone: "(217) 785-9975", notes: "32 Ill. Adm. Code 315, $50 annual fee" },
  { id: "louisiana", name: "Louisiana", abbreviation: "LA", region: "South", tier: "comprehensive", permitRequired: true, trainingRequired: false, inspections: true, advanceNotice: "Prior written notification", advanceNoticeDays: 14, contact: "Radiological Services, DEQ", phone: "(225) 219-3953", notes: "Routine inspections conducted" },
  { id: "massachusetts", name: "Massachusetts", abbreviation: "MA", region: "Northeast", tier: "comprehensive", permitRequired: true, trainingRequired: true, inspections: true, advanceNotice: "15 days (vendors)", advanceNoticeDays: 15, maxPenalty: "$500/violation", contact: "MA Department of Public Health", phone: "(617) 242-3035", notes: "105 CMR 121.000" },
  { id: "new-york", name: "New York", abbreviation: "NY", region: "Northeast", tier: "comprehensive", permitRequired: true, trainingRequired: true, inspections: true, advanceNotice: "As specified", advanceNoticeDays: 30, maxPenalty: "Case by case", contact: "NY Department of Labor", phone: "(518) 457-1202", notes: "12 NYCRR Part 50, Class A/B Certificate" },
  { id: "texas", name: "Texas", abbreviation: "TX", region: "South", tier: "comprehensive", permitRequired: true, trainingRequired: false, inspections: true, advanceNotice: "As specified", advanceNoticeDays: 21, maxPenalty: "Case by case", contact: "Texas Dept of State Health Services", phone: "(512) 834-6688", notes: "25 TAC 289.301/302" },
  { id: "wisconsin", name: "Wisconsin", abbreviation: "WI", region: "Midwest", tier: "comprehensive", permitRequired: true, trainingRequired: false, inspections: true, advanceNotice: "Courtesy notification", advanceNoticeDays: 7, contact: "Radiation Protection Section", phone: "608-267-4797", notes: "Courtesy written notification" },
  
  // Notification States
  { id: "alaska", name: "Alaska", abbreviation: "AK", region: "West", tier: "notification", permitRequired: false, trainingRequired: false, inspections: true, advanceNotice: "As required", advanceNoticeDays: 14, contact: "Radiological Health Program", phone: "(907) 334-2107", notes: "Title 7 AAC 18" },
  { id: "delaware", name: "Delaware", abbreviation: "DE", region: "Northeast", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "48 hours", advanceNoticeDays: 2, contact: "Office of Radiation Control", phone: "(302) 744-4546", notes: "48 hour advance written notification" },
  { id: "district-of-columbia", name: "District of Columbia", abbreviation: "DC", region: "Northeast", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "15 days", advanceNoticeDays: 15, contact: "Radiation Protection Division", phone: "(202) 442-5955", notes: "15 days advance written notification" },
  { id: "hawaii", name: "Hawaii", abbreviation: "HI", region: "West", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance written", advanceNoticeDays: 14, contact: "Indoor and Radiological Health Branch", phone: "(808) 586-4700", notes: "Advance written notification" },
  { id: "idaho", name: "Idaho", abbreviation: "ID", region: "West", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance notification", advanceNoticeDays: 14, contact: "Radiation Control Program", phone: "(208) 334-0549", notes: "Advance notification" },
  { id: "kentucky", name: "Kentucky", abbreviation: "KY", region: "South", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance notification", advanceNoticeDays: 14, contact: "Radiation Health Branch", phone: "(502) 564-3700", notes: "Advance notification" },
  { id: "maine", name: "Maine", abbreviation: "ME", region: "Northeast", tier: "notification", permitRequired: false, trainingRequired: false, inspections: true, advanceNotice: "10 days", advanceNoticeDays: 10, contact: "Radiation Control Program", phone: "(207) 287-5677", notes: "10 day advance notification" },
  { id: "montana", name: "Montana", abbreviation: "MT", region: "West", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance written", advanceNoticeDays: 14, contact: "Department of Public Health", phone: "(406) 444-1441", notes: "Regulation #92-003" },
  { id: "nevada", name: "Nevada", abbreviation: "NV", region: "West", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance notification", advanceNoticeDays: 14, contact: "Radiation Control Program", phone: "(775) 687-7550", notes: "Entertainment focus (Vegas)" },
  { id: "oklahoma", name: "Oklahoma", abbreviation: "OK", region: "South", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "3 days", advanceNoticeDays: 3, contact: "Department of Environmental Quality", phone: "(405) 702-5155", notes: "Three day advance notification" },
  { id: "south-dakota", name: "South Dakota", abbreviation: "SD", region: "Midwest", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "3 days", advanceNoticeDays: 3, contact: "Department of Health", phone: "(605) 773-3361", notes: "Three day advance notification" },
  { id: "utah", name: "Utah", abbreviation: "UT", region: "West", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance notification", advanceNoticeDays: 14, contact: "Division of Waste Management and Radiation Control", phone: "(801) 536-4261", notes: "Advance notification" },
  { id: "vermont", name: "Vermont", abbreviation: "VT", region: "Northeast", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance notification", advanceNoticeDays: 14, contact: "Department of Health", phone: "(802) 863-7238", notes: "Advance notification" },
  { id: "virginia", name: "Virginia", abbreviation: "VA", region: "South", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance notification", advanceNoticeDays: 14, contact: "Radiological Health", phone: "(804) 864-8150", notes: "Advance notification" },
  { id: "washington", name: "Washington", abbreviation: "WA", region: "West", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Light show specific", advanceNoticeDays: 14, contact: "WA Department of Labor & Industries", phone: "(360) 236-3210", notes: "WAC 296-62-09005" },
  { id: "west-virginia", name: "West Virginia", abbreviation: "WV", region: "South", tier: "notification", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Advance written", advanceNoticeDays: 14, contact: "Office of Environmental Health Services", phone: "(304) 356-4278", notes: "Advance written notification" },
  
  // Federal/Minimal States
  { id: "alabama", name: "Alabama", abbreviation: "AL", region: "South", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Office of Radiation Control", phone: "(334) 206-5300", notes: "Per FDA requirements only" },
  { id: "arkansas", name: "Arkansas", abbreviation: "AR", region: "South", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Radiation Control Section", phone: "(501) 661-2301", notes: "As required by FDA" },
  { id: "california", name: "California", abbreviation: "CA", region: "West", tier: "minimal", permitRequired: true, trainingRequired: false, inspections: true, advanceNotice: "2 weeks (local)", advanceNoticeDays: 14, contact: "Local Fire Department + CDPH", phone: "Varies by locality", notes: "Local fire permits required" },
  { id: "colorado", name: "Colorado", abbreviation: "CO", region: "West", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Hazardous Materials & Waste Management Division", phone: "(303) 692-3403", notes: "Written notification as required by FDA" },
  { id: "connecticut", name: "Connecticut", abbreviation: "CT", region: "Northeast", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Department of Energy and Environmental Protection", phone: "(860) 424-3029", notes: "Written notification as required by FDA" },
  { id: "georgia", name: "Georgia", abbreviation: "GA", region: "South", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "N/A", advanceNoticeDays: 0, contact: "Office of Regulatory Service", phone: "800-436-7442", notes: "Defers to federal regulations" },
  { id: "indiana", name: "Indiana", abbreviation: "IN", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Medical Radiology Services Program", phone: "(317) 233-7563", notes: "None known - follow FDA" },
  { id: "iowa", name: "Iowa", abbreviation: "IA", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Bureau of Radiological Health", phone: "(515) 281-3478", notes: "Written notification as required by FDA" },
  { id: "kansas", name: "Kansas", abbreviation: "KS", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Department of Health and Environment", phone: "(785) 296-4359", notes: "Written notification as required by FDA" },
  { id: "maryland", name: "Maryland", abbreviation: "MD", region: "Northeast", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Radiation Control Advisory Board", phone: "(800) 633-6101", notes: "None known" },
  { id: "michigan", name: "Michigan", abbreviation: "MI", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Michigan Occupational Safety and Health Administration", phone: "(517) 284-7820", notes: "None" },
  { id: "minnesota", name: "Minnesota", abbreviation: "MN", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Department of Health - Radiation Control", phone: "(651) 201-4522", notes: "Written notification as required by FDA" },
  { id: "mississippi", name: "Mississippi", abbreviation: "MS", region: "South", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Division of Radiation Health", phone: "(601) 987-6893", notes: "Written notification as required by FDA" },
  { id: "missouri", name: "Missouri", abbreviation: "MO", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Radiation Control Program", phone: "(573) 751-6083", notes: "None known" },
  { id: "nebraska", name: "Nebraska", abbreviation: "NE", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Health & Human Services", phone: "(402) 471-8566", notes: "Written notification as required by FDA" },
  { id: "new-hampshire", name: "New Hampshire", abbreviation: "NH", region: "Northeast", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Radiation Machine Program", phone: "(603) 271-4585", notes: "Written notification as required by FDA" },
  { id: "new-jersey", name: "New Jersey", abbreviation: "NJ", region: "Northeast", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Department of Environmental Protection", phone: "(609) 984-5521", notes: "Written notification as required by FDA" },
  { id: "new-mexico", name: "New Mexico", abbreviation: "NM", region: "West", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Environmental Department", phone: "(505) 476-6000", notes: "Federal regulations apply" },
  { id: "north-carolina", name: "North Carolina", abbreviation: "NC", region: "South", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Department of Labor", phone: "(919) 807-2890", notes: "Written notification as required by FDA" },
  { id: "north-dakota", name: "North Dakota", abbreviation: "ND", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Division of Air Quality", phone: "(701) 328-5188", notes: "Written notification as required by FDA" },
  { id: "ohio", name: "Ohio", abbreviation: "OH", region: "Midwest", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Bureau of Radiological Protection", phone: "(614) 644-2727", notes: "None known (Cleveland has local permit)" },
  { id: "oregon", name: "Oregon", abbreviation: "OR", region: "West", tier: "minimal", permitRequired: true, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Radiation Protection Services", phone: "(971) 673-0505", notes: "Portland Fire requires permit" },
  { id: "pennsylvania", name: "Pennsylvania", abbreviation: "PA", region: "Northeast", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Division of Radiation Control", phone: "(717) 787-3720", notes: "None known" },
  { id: "rhode-island", name: "Rhode Island", abbreviation: "RI", region: "Northeast", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Department of Health", phone: "(401) 222-5960", notes: "None known" },
  { id: "south-carolina", name: "South Carolina", abbreviation: "SC", region: "South", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Division of Radiological Health", phone: "(803) 737-7415", notes: "Written notification as required by FDA" },
  { id: "tennessee", name: "Tennessee", abbreviation: "TN", region: "South", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Division of Radiological Health", phone: "(615) 532-0877", notes: "Standards for Protection Against Radiation" },
  { id: "wyoming", name: "Wyoming", abbreviation: "WY", region: "West", tier: "federal", permitRequired: false, trainingRequired: false, inspections: false, advanceNotice: "Per FDA", advanceNoticeDays: 0, contact: "Wyoming Board of Radiologic Technologists", phone: "(307) 777-5403", notes: "Radiologic Technologist regulations" }
];

// ============================================================================
// SECTION 2: TOUR PLANNER
// ============================================================================

interface TourStop {
  id: string;
  stateId: string;
  city: string;
  date: string;
  venue: string;
}

interface ComplianceAction {
  priority: "critical" | "high" | "medium" | "low";
  action: string;
  deadline: string;
  state: string;
  completed: boolean;
}

// ============================================================================
// SECTION 3: DECISION WIZARD
// ============================================================================

type WizardStep = "residency" | "tour-type" | "states" | "timeline" | "results";

interface WizardState {
  isUSBased: boolean | null;
  isTour: boolean | null;
  hasNY: boolean;
  hasTX: boolean;
  hasFL: boolean;
  timelineMonths: number;
  needsOutdoor: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export function Module5_Interstate() {
  const [activeTab, setActiveTab] = useState("matrix");
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  
  // Tour Planner State
  const [tourStops, setTourStops] = useState<TourStop[]>([]);
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());
  
  // Wizard State
  const [wizardStep, setWizardStep] = useState<WizardStep>("residency");
  const [wizardData, setWizardData] = useState<WizardState>({
    isUSBased: null,
    isTour: null,
    hasNY: false,
    hasTX: false,
    hasFL: false,
    timelineMonths: 3,
    needsOutdoor: false
  });

  // Filter states
  const filteredStates = useMemo(() => {
    return allStatesData.filter(state => {
      const matchesSearch = state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           state.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = tierFilter === "all" || state.tier === tierFilter;
      const matchesRegion = regionFilter === "all" || state.region === regionFilter;
      return matchesSearch && matchesTier && matchesRegion;
    });
  }, [searchTerm, tierFilter, regionFilter]);

  // Toggle state selection
  const toggleStateSelection = (stateId: string) => {
    setSelectedStates(prev => 
      prev.includes(stateId) 
        ? prev.filter(id => id !== stateId)
        : [...prev, stateId]
    );
  };

  // Tour Planner Functions
  const addTourStop = () => {
    const newStop: TourStop = {
      id: Date.now().toString(),
      stateId: "",
      city: "",
      date: "",
      venue: ""
    };
    setTourStops([...tourStops, newStop]);
  };

  const updateTourStop = (id: string, field: keyof TourStop, value: string) => {
    setTourStops(stops => stops.map(s => s.id === id ? { ...s, [field]: value } : s));
  };

  const removeTourStop = (id: string) => {
    setTourStops(stops => stops.filter(s => s.id !== id));
  };

  const generateComplianceActions = (): ComplianceAction[] => {
    const actions: ComplianceAction[] = [];
    
    tourStops.forEach(stop => {
      const stateData = allStatesData.find(s => s.id === stop.stateId);
      if (!stateData || !stop.date) return;
      
      const eventDate = new Date(stop.date);
      
      // Add state-specific requirements
      if (stateData.permitRequired) {
        const deadline = new Date(eventDate);
        deadline.setDate(deadline.getDate() - stateData.advanceNoticeDays);
        
        actions.push({
          priority: stateData.advanceNoticeDays > 14 ? "high" : "critical",
          action: `Apply for ${stateData.name} laser permit/registration`,
          deadline: deadline.toISOString().split("T")[0],
          state: stateData.name,
          completed: false
        });
      }
      
      if (stateData.trainingRequired) {
        const deadline = new Date(eventDate);
        deadline.setDate(deadline.getDate() - 56); // 8 weeks for training
        
        actions.push({
          priority: "critical",
          action: `Complete ${stateData.name} required training`,
          deadline: deadline.toISOString().split("T")[0],
          state: stateData.name,
          completed: false
        });
      }
      
      if (stateData.advanceNoticeDays > 0 && !stateData.permitRequired) {
        const deadline = new Date(eventDate);
        deadline.setDate(deadline.getDate() - stateData.advanceNoticeDays);
        
        actions.push({
          priority: "medium",
          action: `Submit ${stateData.name} advance notification`,
          deadline: deadline.toISOString().split("T")[0],
          state: stateData.name,
          completed: false
        });
      }
    });
    
    return actions.sort((a, b) => new Date(a.deadline).getTime() - new Date(b.deadline).getTime());
  };

  const complianceActions = generateComplianceActions();

  const toggleAction = (actionStr: string) => {
    const newCompleted = new Set(completedActions);
    if (newCompleted.has(actionStr)) {
      newCompleted.delete(actionStr);
    } else {
      newCompleted.add(actionStr);
    }
    setCompletedActions(newCompleted);
  };

  // Wizard Functions
  const wizardSteps: { id: WizardStep; label: string }[] = [
    { id: "residency", label: "Location" },
    { id: "tour-type", label: "Tour Type" },
    { id: "states", label: "States" },
    { id: "timeline", label: "Timeline" },
    { id: "results", label: "Results" }
  ];

  const currentStepIndex = wizardSteps.findIndex(s => s.id === wizardStep);
  const wizardProgress = ((currentStepIndex + 1) / wizardSteps.length) * 100;

  const handleWizardNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < wizardSteps.length) {
      setWizardStep(wizardSteps[nextIndex].id);
    }
  };

  const handleWizardBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setWizardStep(wizardSteps[prevIndex].id);
    }
  };

  const resetWizard = () => {
    setWizardStep("residency");
    setWizardData({
      isUSBased: null,
      isTour: null,
      hasNY: false,
      hasTX: false,
      hasFL: false,
      timelineMonths: 3,
      needsOutdoor: false
    });
  };

  const renderWizardContent = () => {
    switch (wizardStep) {
      case "residency":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Are you a U.S.-based operator?</h3>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={wizardData.isUSBased === true ? "default" : "outline"}
                className="h-auto py-6"
                onClick={() => setWizardData({ ...wizardData, isUSBased: true })}
              >
                <div className="text-center">
                  <Globe className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">U.S. Based</p>
                  <p className="text-xs opacity-70">Operating from within the US</p>
                </div>
              </Button>
              <Button
                variant={wizardData.isUSBased === false ? "default" : "outline"}
                className="h-auto py-6"
                onClick={() => setWizardData({ ...wizardData, isUSBased: false })}
              >
                <div className="text-center">
                  <MapPin className="h-6 w-6 mx-auto mb-2" />
                  <p className="font-medium">International</p>
                  <p className="text-xs opacity-70">Touring from outside the US</p>
                </div>
              </Button>
            </div>
          </div>
        );

      case "tour-type":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">What type of operation?</h3>
            <div className="space-y-2">
              <Button
                variant={wizardData.isTour === true ? "default" : "outline"}
                className="w-full justify-start h-auto py-4"
                onClick={() => setWizardData({ ...wizardData, isTour: true })}
              >
                <Bus className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Multi-State Tour</p>
                  <p className="text-xs opacity-70">Multiple dates across different states</p>
                </div>
              </Button>
              <Button
                variant={wizardData.isTour === false ? "default" : "outline"}
                className="w-full justify-start h-auto py-4"
                onClick={() => setWizardData({ ...wizardData, isTour: false })}
              >
                <MapPin className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <p className="font-medium">Single State Event</p>
                  <p className="text-xs opacity-70">One-time event in a single state</p>
                </div>
              </Button>
            </div>
          </div>
        );

      case "states":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">Which states are you visiting?</h3>
            <p className="text-sm text-muted-foreground">Select states with special requirements:</p>
            
            <div className="space-y-2">
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={wizardData.hasNY}
                  onChange={(e) => setWizardData({ ...wizardData, hasNY: e.target.checked })}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <span className="font-medium">New York</span>
                  <Badge className="ml-2">Training Required</Badge>
                </div>
                <span className="text-xs text-muted-foreground">8+ weeks needed</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={wizardData.hasTX}
                  onChange={(e) => setWizardData({ ...wizardData, hasTX: e.target.checked })}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <span className="font-medium">Texas</span>
                  <Badge className="ml-2">Registration Required</Badge>
                </div>
                <span className="text-xs text-muted-foreground">Agent may be required</span>
              </div>
              
              <div className="flex items-center gap-2 p-3 border rounded-lg">
                <input
                  type="checkbox"
                  checked={wizardData.hasFL}
                  onChange={(e) => setWizardData({ ...wizardData, hasFL: e.target.checked })}
                  className="w-4 h-4"
                />
                <div className="flex-1">
                  <span className="font-medium">Florida</span>
                  <Badge className="ml-2">20-Day Notice</Badge>
                </div>
                <span className="text-xs text-muted-foreground">Out-of-state requirement</span>
              </div>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-2">
                <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-800">Note</p>
                  <p className="text-sm text-amber-700">
                    Most other states either follow federal guidelines only or require minimal notification. 
                    Check the 50-State Matrix for complete details.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );

      case "timeline":
        return (
          <div className="space-y-4">
            <h3 className="font-medium">When is your tour/event?</h3>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Timeline</label>
              <div className="grid grid-cols-3 gap-2">
                <Button
                  variant={wizardData.timelineMonths === 1 ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, timelineMonths: 1 })}
                >
                  &lt; 1 month
                </Button>
                <Button
                  variant={wizardData.timelineMonths === 3 ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, timelineMonths: 3 })}
                >
                  1-3 months
                </Button>
                <Button
                  variant={wizardData.timelineMonths === 6 ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, timelineMonths: 6 })}
                >
                  3+ months
                </Button>
              </div>
            </div>

            <div className="space-y-2 pt-4 border-t">
              <label className="text-sm font-medium">Will you have outdoor shows?</label>
              <div className="flex gap-2">
                <Button
                  variant={wizardData.needsOutdoor ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, needsOutdoor: true })}
                  className="flex-1"
                >
                  Yes
                </Button>
                <Button
                  variant={!wizardData.needsOutdoor ? "default" : "outline"}
                  onClick={() => setWizardData({ ...wizardData, needsOutdoor: false })}
                  className="flex-1"
                >
                  No
                </Button>
              </div>
            </div>

            {wizardData.timelineMonths < 2 && wizardData.hasNY && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                  <span className="font-medium text-red-800">Timeline Warning</span>
                </div>
                <p className="text-sm text-red-700 mt-1">
                  New York requires 8+ weeks for training and certification. 
                  You may not have sufficient time.
                </p>
              </div>
            )}
          </div>
        );

      case "results":
        return (
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-6 w-6 text-green-500" />
              <h3 className="font-medium text-lg">Your Compliance Roadmap</h3>
            </div>

            <div className="space-y-3">
              {/* Federal Requirements */}
              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">FDA Variance</span>
                  <Badge>Required</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Form 3147 - Required for all laser shows</p>
              </div>

              {wizardData.needsOutdoor && (
                <div className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">FAA Notification</span>
                    <Badge>Required</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">Form 7140-1 for outdoor unterminated shows</p>
                </div>
              )}

              {wizardData.hasNY && (
                <div className="p-3 border rounded-lg bg-blue-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">New York Training</span>
                    <Badge>Critical</Badge>
                  </div>
                  <p className="text-sm text-blue-700">Class A or B Certificate required - 8+ weeks</p>
                </div>
              )}

              {wizardData.hasTX && (
                <div className="p-3 border rounded-lg bg-orange-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Texas Registration</span>
                    <Badge>Required</Badge>
                  </div>
                  <p className="text-sm text-orange-700">Equipment registration + possible in-state agent</p>
                </div>
              )}

              {wizardData.hasFL && (
                <div className="p-3 border rounded-lg bg-green-50">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">Florida Notice</span>
                    <Badge>Required</Badge>
                  </div>
                  <p className="text-sm text-green-700">20 days advance notice (out-of-state)</p>
                </div>
              )}

              <div className="p-3 border rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Other States</span>
                  <Badge variant="outline">Notification</Badge>
                </div>
                <p className="text-sm text-muted-foreground">Most states: advance notification only</p>
              </div>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" className="flex-1">
                <Download className="h-4 w-4 mr-1" />
                Export Checklist
              </Button>
              <Button onClick={resetWizard} className="flex-1">
                Start Over
              </Button>
            </div>
          </div>
        );
    }
  };

  const canWizardProceed = () => {
    switch (wizardStep) {
      case "residency": return wizardData.isUSBased !== null;
      case "tour-type": return wizardData.isTour !== null;
      case "states": return true;
      case "timeline": return true;
      default: return true;
    }
  };

  return (
    <div className="space-y-6">
      {/* Module Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Module 4.5: Interstate Operations</h1>
        <p className="text-muted-foreground">
          Complete 50-state regulatory matrix and tools for multi-state touring operations
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid grid-cols-5 w-full">
          <TabsTrigger value="matrix">50-State Matrix</TabsTrigger>
          <TabsTrigger value="wizard">Tour Wizard</TabsTrigger>
          <TabsTrigger value="planner">Tour Planner</TabsTrigger>
          <TabsTrigger value="deadlines">Deadlines</TabsTrigger>
          <TabsTrigger value="checklist">Checklist</TabsTrigger>
        </TabsList>

        {/* MATRIX TAB */}
        <TabsContent value="matrix" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  <CardTitle>50-State Regulatory Matrix</CardTitle>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Search states..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-8 pr-3 py-1 text-sm border rounded-md"
                    />
                  </div>
                  <select
                    value={tierFilter}
                    onChange={(e) => setTierFilter(e.target.value)}
                    className="px-3 py-1 text-sm border rounded-md"
                  >
                    <option value="all">All Tiers</option>
                    <option value="comprehensive">Comprehensive</option>
                    <option value="notification">Notification</option>
                    <option value="federal">Federal Only</option>
                  </select>
                  <select
                    value={regionFilter}
                    onChange={(e) => setRegionFilter(e.target.value)}
                    className="px-3 py-1 text-sm border rounded-md"
                  >
                    <option value="all">All Regions</option>
                    <option value="Northeast">Northeast</option>
                    <option value="South">South</option>
                    <option value="Midwest">Midwest</option>
                    <option value="West">West</option>
                  </select>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg overflow-hidden">
                <div className="max-h-[500px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead className="sticky top-0 bg-muted z-10">
                      <tr>
                        <th className="px-3 py-2 text-left font-medium">State</th>
                        <th className="px-3 py-2 text-left font-medium">Tier</th>
                        <th className="px-3 py-2 text-center font-medium">Permit</th>
                        <th className="px-3 py-2 text-center font-medium">Training</th>
                        <th className="px-3 py-2 text-center font-medium">Inspect</th>
                        <th className="px-3 py-2 text-left font-medium">Notice</th>
                        <th className="px-3 py-2 text-left font-medium">Contact</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStates.map((state) => (
                        <tr key={state.id} className="border-t hover:bg-muted/50">
                          <td className="px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                checked={selectedStates.includes(state.id)}
                                onChange={() => toggleStateSelection(state.id)}
                                className="w-4 h-4"
                              />
                              <div>
                                <p className="font-medium">{state.name}</p>
                                <p className="text-xs text-muted-foreground">{state.abbreviation}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-3 py-2">
                            <Badge 
                              variant={state.tier === "comprehensive" ? "default" : 
                                      state.tier === "notification" ? "secondary" : "outline"}
                              className="text-xs"
                            >
                              {state.tier}
                            </Badge>
                          </td>
                          <td className="px-3 py-2 text-center">
                            {state.permitRequired ? 
                              <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : 
                              <XCircle className="h-4 w-4 text-red-300 mx-auto" />
                            }
                          </td>
                          <td className="px-3 py-2 text-center">
                            {state.trainingRequired ? 
                              <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : 
                              <XCircle className="h-4 w-4 text-red-300 mx-auto" />
                            }
                          </td>
                          <td className="px-3 py-2 text-center">
                            {state.inspections ? 
                              <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" /> : 
                              <XCircle className="h-4 w-4 text-red-300 mx-auto" />
                            }
                          </td>
                          <td className="px-3 py-2 text-xs">{state.advanceNotice}</td>
                          <td className="px-3 py-2 text-xs">
                            <p>{state.phone}</p>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {selectedStates.length > 0 && (
                <div className="mt-4 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{selectedStates.length} states selected</span>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Selected
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* WIZARD TAB */}
        <TabsContent value="wizard" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Route className="h-5 w-5" />
                &quot;I&apos;m Touring&quot; Decision Wizard
              </CardTitle>
              <CardDescription>
                Answer a few questions to get your personalized compliance roadmap
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <Progress value={wizardProgress}>
                <ProgressTrack>
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>

              <div className="min-h-[300px]">{renderWizardContent()}</div>

              <div className="flex justify-between pt-4 border-t">
                <Button variant="outline" onClick={handleWizardBack} disabled={wizardStep === "residency"}>
                  <ChevronLeft className="h-4 w-4 mr-1" /> Back
                </Button>
                {wizardStep !== "results" ? (
                  <Button onClick={handleWizardNext} disabled={!canWizardProceed()}>
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                ) : (
                  <Button onClick={resetWizard}>Start Over</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* PLANNER TAB */}
        <TabsContent value="planner" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bus className="h-5 w-5" />
                Multi-State Tour Planner
              </CardTitle>
              <CardDescription>
                Plan your tour stops and get a customized compliance checklist
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium">Tour Stops ({tourStops.length})</h3>
                <Button onClick={addTourStop} size="sm" variant="outline">
                  <Plus className="h-4 w-4 mr-1" />
                  Add Stop
                </Button>
              </div>

              <div className="space-y-3 max-h-[300px] overflow-y-auto">
                {tourStops.map((stop, index) => (
                  <div key={stop.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Stop #{index + 1}</span>
                      <Button variant="ghost" size="sm" onClick={() => removeTourStop(stop.id)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <select
                        value={stop.stateId}
                        onChange={(e) => updateTourStop(stop.id, "stateId", e.target.value)}
                        className="px-2 py-1 text-sm border rounded"
                      >
                        <option value="">Select state</option>
                        {allStatesData.map(s => (
                          <option key={s.id} value={s.id}>{s.name}</option>
                        ))}
                      </select>
                      <input
                        type="date"
                        value={stop.date}
                        onChange={(e) => updateTourStop(stop.id, "date", e.target.value)}
                        className="px-2 py-1 text-sm border rounded"
                      />
                      <input
                        type="text"
                        value={stop.city}
                        onChange={(e) => updateTourStop(stop.id, "city", e.target.value)}
                        placeholder="City"
                        className="px-2 py-1 text-sm border rounded"
                      />
                      <input
                        type="text"
                        value={stop.venue}
                        onChange={(e) => updateTourStop(stop.id, "venue", e.target.value)}
                        placeholder="Venue"
                        className="px-2 py-1 text-sm border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>

              {tourStops.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No stops added yet. Click &quot;Add Stop&quot; to begin.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* DEADLINES TAB */}
        <TabsContent value="deadlines" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Notification Deadline Calculator
              </CardTitle>
            </CardHeader>
            <CardContent>
              {complianceActions.length > 0 ? (
                <div className="space-y-3">
                  {complianceActions.map((action, idx) => (
                    <div 
                      key={idx} 
                      className={`p-3 border rounded-lg cursor-pointer ${
                        completedActions.has(action.action) ? "opacity-50 bg-muted" : ""
                      }`}
                      onClick={() => toggleAction(action.action)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {completedActions.has(action.action) ? (
                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30" />
                          )}
                          <div>
                            <p className={`font-medium ${completedActions.has(action.action) ? "line-through" : ""}`}>
                              {action.action}
                            </p>
                            <p className="text-sm text-muted-foreground">{action.state}</p>
                          </div>
                        </div>
                        <Badge variant={action.priority === "critical" ? "destructive" : "default"}>
                          {action.priority}
                        </Badge>
                      </div>
                      <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Deadline: {action.deadline}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Add tour stops in the Tour Planner to see deadlines</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* CHECKLIST TAB */}
        <TabsContent value="checklist" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Multi-State Compliance Checklist
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Federal Requirements (All States)
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "FDA Variance Application (Form 3147)",
                      "Laser Product Reports (Form 3632)",
                      "Annual Report filing (Form 3636)",
                      "Accident/Occurrence procedures (Form 3640)",
                      "FAA Form 7140-1 (if outdoor shows)"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    Comprehensive States (Apply First!)
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "New York: Class A/B Certificate (8+ weeks)",
                      "Texas: Equipment registration + agent",
                      "Florida: 20-day advance notice",
                      "Illinois: 10-day advance notice + IEMA registration",
                      "Massachusetts: 15-day vendor notification",
                      "Arizona: Written notification + annual fee",
                      "Louisiana: Prior notification + inspections",
                      "Wisconsin: Courtesy notification"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Separator />

                <div>
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-500" />
                    Notification States
                  </h4>
                  <ul className="space-y-2">
                    {[
                      "Maine, Oklahoma, South Dakota: 3-10 days notice",
                      "Delaware: 48 hours notice",
                      "DC: 15 days notice",
                      "All others: Advance notification recommended"
                    ].map((item, idx) => (
                      <li key={idx} className="flex items-center gap-2 text-sm">
                        <Info className="h-4 w-4 text-blue-500" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    PDF Checklist
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Download className="h-4 w-4 mr-1" />
                    CSV Export
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export default Module5_Interstate;
