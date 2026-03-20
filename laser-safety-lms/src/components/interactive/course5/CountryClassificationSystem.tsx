"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Globe, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Building2,
  FileText,
  Users,
  ChevronRight,
  Info,
  Filter,
  MapPin
} from "lucide-react";

interface CategoryInfo {
  code: string;
  name: string;
  description: string;
  permits: string;
  notification: string;
  lso: string;
  leadTime: string;
  color: string;
  bgColor: string;
  countries: { name: string; notes?: string }[];
}

const ilidaCategories: CategoryInfo[] = [
  {
    code: "A",
    name: "Minimal Regulation",
    description: "Countries with minimal to no laser show regulation",
    permits: "Not required",
    notification: "Not required",
    lso: "Recommended but not mandatory",
    leadTime: "Minimal (1-2 weeks)",
    color: "text-green-700",
    bgColor: "bg-green-50",
    countries: [
      { name: "Mexico", notes: "Follow IEC 60825-3 guidelines" },
      { name: "Caribbean Islands", notes: "Varies by island" },
      { name: "Thailand", notes: "Minimal oversight" },
      { name: "Malaysia", notes: "Notification recommended" },
      { name: "Philippines", notes: "Local venue requirements may apply" },
      { name: "Indonesia", notes: "Bali has specific requirements" },
      { name: "UAE (indoor)", notes: "Outdoor has restrictions" },
      { name: "Qatar", notes: "Special events may require permits" },
    ],
  },
  {
    code: "B",
    name: "Notification System",
    description: "Countries requiring advance notification but not formal permits",
    permits: "Notification only",
    notification: "Required (7-30 days)",
    lso: "Recommended",
    leadTime: "2-4 weeks",
    color: "text-blue-700",
    bgColor: "bg-blue-50",
    countries: [
      { name: "Canada", notes: "Health Canada notification" },
      { name: "Japan", notes: "Ministry of Health notification" },
      { name: "South Korea", notes: "KCDC notification required" },
      { name: "Switzerland", notes: "Non-EU but harmonized" },
      { name: "Hong Kong", notes: "Environmental Protection Dept" },
      { name: "Singapore (indoor)", notes: "NEA notification" },
      { name: "Taiwan", notes: "EPA notification" },
      { name: "New Zealand", notes: "See detailed requirements below" },
    ],
  },
  {
    code: "F",
    name: "Full Regulatory",
    description: "Countries with comprehensive laser show regulations",
    permits: "Required",
    notification: "Required (14-30 days)",
    lso: "Required",
    leadTime: "4-8 weeks",
    color: "text-orange-700",
    bgColor: "bg-orange-50",
    countries: [
      { name: "United States", notes: "State-specific requirements" },
      { name: "Germany", notes: "BGV B2 compliance" },
      { name: "United Kingdom", notes: "UKCA marking required" },
      { name: "Australia", notes: "See state details below" },
      { name: "Netherlands", notes: "Arbodienst consultation" },
      { name: "France", notes: "INRS guidelines" },
      { name: "Austria", notes: "ASchG compliance" },
      { name: "Sweden", notes: "Work Environment Authority" },
    ],
  },
  {
    code: "G",
    name: "Government Controlled",
    description: "Countries with extensive government oversight",
    permits: "Extensive process",
    notification: "Multiple agencies",
    lso: "Required + local partnerships",
    leadTime: "8-16 weeks",
    color: "text-purple-700",
    bgColor: "bg-purple-50",
    countries: [
      { name: "China", notes: "Ministry of Culture + local authorities" },
      { name: "Russia", notes: "Rosatom + local permits" },
      { name: "Singapore (outdoor)", notes: "Multiple agency approval" },
      { name: "UAE (outdoor)", notes: "DTCM + civil aviation" },
      { name: "Saudi Arabia", notes: "GACA approval required" },
      { name: "Brazil", notes: "CNEN + state approvals" },
      { name: "Argentina", notes: "ARN + local permits" },
      { name: "South Africa", notes: "Department of Health" },
    ],
  },
  {
    code: "X",
    name: "Restricted/Prohibited",
    description: "Countries with significant restrictions or prohibitions",
    permits: "Special waivers only",
    notification: "Case-by-case",
    lso: "Required if permitted",
    leadTime: "12+ weeks (if possible)",
    color: "text-red-700",
    bgColor: "bg-red-50",
    countries: [
      { name: "Saudi Arabia (outdoor)", notes: "Generally prohibited" },
      { name: "India", notes: "BARC approval required" },
      { name: "Egypt", notes: "Military approval often required" },
      { name: "Turkey (outdoor)", notes: "Restricted near airports" },
      { name: "Israel", notes: "Ministry of Defense approval" },
      { name: "Vietnam", notes: "Recently tightened regulations" },
    ],
  },
];

// Australian state details
const auStates = [
  { state: "New South Wales", regulator: "EPA Radiation Control", requirements: "Use license + registration" },
  { state: "Victoria", regulator: "DHHS Radiation Safety", requirements: "Management license + use license" },
  { state: "Queensland", regulator: "Queensland Health", requirements: "Possession + use licenses" },
  { state: "Western Australia", regulator: "Radiological Council", requirements: "Registration + authorization" },
  { state: "South Australia", regulator: "EPA Radiation Protection", requirements: "License + registration" },
  { state: "Tasmania", regulator: "EPA Tasmania", requirements: "License to possess" },
  { state: "ACT", regulator: "HPS Radiation Safety", requirements: "License + registration" },
  { state: "Northern Territory", regulator: "Department of Health", requirements: "License + registration" },
];

// New Zealand requirements
const nzRequirements = [
  { item: "Radiation Safety Officer", requirement: "Required for operation" },
  { item: "Licenses", requirement: "Source license + user license" },
  { item: "Notification", requirement: "Notify EPA before first use" },
  { item: "Training", requirement: "Laser safety officer training" },
  { item: "Compliance", requirement: "AS/NZS 4173 standard" },
];

export function CountryClassificationSystem() {
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(ilidaCategories[2]);
  const [filter, setFilter] = useState<string>("all");

  const filteredCategories = filter === "all" 
    ? ilidaCategories 
    : ilidaCategories.filter((c) => c.code === filter);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Globe className="h-5 w-5" />
          Country Classification System
        </CardTitle>
        <CardDescription>
          ILDA country categories (A, B, F, G, X) for international show planning
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All Categories
          </Button>
          {ilidaCategories.map((cat) => (
            <Button
              key={cat.code}
              variant={filter === cat.code ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(cat.code)}
            >
              Category {cat.code}
            </Button>
          ))}
        </div>

        {/* Category Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCategories.map((category) => (
            <button
              key={category.code}
              onClick={() => setSelectedCategory(category)}
              className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                selectedCategory?.code === category.code
                  ? "ring-2 ring-primary border-primary"
                  : ""
              } ${category.bgColor}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg ${category.color} bg-white`}
                >
                  {category.code}
                </div>
                <Badge variant="outline">{category.countries.length} countries</Badge>
              </div>
              <h3 className={`font-medium ${category.color}`}>{category.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                {category.description}
              </p>
              <div className="flex items-center gap-1 mt-3 text-xs text-muted-foreground">
                <span>Click for details</span>
                <ChevronRight className="h-3 w-3" />
              </div>
            </button>
          ))}
        </div>

        {/* Selected Category Details */}
        {selectedCategory && (
          <div className={`p-6 rounded-lg border ${selectedCategory.bgColor}`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center font-bold text-2xl ${selectedCategory.color} bg-white`}
                >
                  {selectedCategory.code}
                </div>
                <div>
                  <h3 className={`text-xl font-medium ${selectedCategory.color}`}>
                    Category {selectedCategory.code}: {selectedCategory.name}
                  </h3>
                  <p className="text-muted-foreground">{selectedCategory.description}</p>
                </div>
              </div>
            </div>

            {/* Requirements Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <FileText className="h-4 w-4" />
                  Permits
                </div>
                <p className="font-medium">{selectedCategory.permits}</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <AlertTriangle className="h-4 w-4" />
                  Notification
                </div>
                <p className="font-medium">{selectedCategory.notification}</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Users className="h-4 w-4" />
                  LSO Required
                </div>
                <p className="font-medium">{selectedCategory.lso}</p>
              </div>
              <div className="p-3 bg-white rounded-lg">
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                  <Building2 className="h-4 w-4" />
                  Lead Time
                </div>
                <p className="font-medium">{selectedCategory.leadTime}</p>
              </div>
            </div>

            {/* Countries List */}
            <div className="bg-white rounded-lg p-4">
              <h4 className="font-medium mb-3 flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Countries in Category {selectedCategory.code}
              </h4>
              <div className="grid md:grid-cols-2 gap-2">
                {selectedCategory.countries.map((country) => (
                  <div
                    key={country.name}
                    className="flex items-center justify-between p-2 rounded hover:bg-muted"
                  >
                    <span>{country.name}</span>
                    {country.notes && (
                      <span className="text-xs text-muted-foreground">{country.notes}</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Australia Details */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted/50">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              Australia State/Territory Detail
            </h4>
            <p className="text-sm text-muted-foreground">
              Category F - Full Regulatory with state-specific requirements
            </p>
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {auStates.map((state) => (
                <div key={state.state} className="p-3 border rounded-lg">
                  <p className="font-medium text-sm">{state.state}</p>
                  <p className="text-xs text-muted-foreground">{state.regulator}</p>
                  <p className="text-xs mt-1">{state.requirements}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* New Zealand Details */}
        <div className="border rounded-lg overflow-hidden">
          <div className="p-4 bg-muted/50">
            <h4 className="font-medium flex items-center gap-2">
              <Info className="h-4 w-4" />
              New Zealand Specific Requirements
            </h4>
            <p className="text-sm text-muted-foreground">
              Category B - Notification System
            </p>
          </div>
          <div className="p-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {nzRequirements.map((req) => (
                <div key={req.item} className="flex items-center gap-3 p-3 border rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0" />
                  <div>
                    <p className="font-medium text-sm">{req.item}</p>
                    <p className="text-xs text-muted-foreground">{req.requirement}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default CountryClassificationSystem;
