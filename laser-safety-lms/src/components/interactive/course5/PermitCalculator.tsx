"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Calculator, 
  Clock,
  DollarSign,
  FileText,
  AlertTriangle,
  CheckCircle2,
  Globe,
  Building2,
  Users,
  Download
} from "lucide-react";

interface CountryPermit {
  country: string;
  code: string;
  category: string;
  permits: string[];
  leadTime: string;
  costEstimate: string;
  documents: string[];
  lso: string;
  inspections: string;
  notes: string;
}

const permitData: CountryPermit[] = [
  {
    country: "United States",
    code: "US",
    category: "F",
    permits: ["State laser show permit", "Venue approval", "FAA (outdoor)"],
    leadTime: "4-8 weeks",
    costEstimate: "$500-$2,000",
    documents: ["Show plans", "MPE calculations", "LSO credentials", "Insurance"],
    lso: "Required",
    inspections: "At discretion",
    notes: "Varies significantly by state",
  },
  {
    country: "Germany",
    code: "DE",
    category: "F",
    permits: ["BGV B2 compliance", "Local authority approval"],
    leadTime: "4-6 weeks",
    costEstimate: "€500-€1,500",
    documents: ["Technical docs", "Risk assessment", "LSO certification (DGUV)"],
    lso: "Required",
    inspections: "Common",
    notes: "Strict compliance required",
  },
  {
    country: "United Kingdom",
    code: "GB",
    category: "F",
    permits: ["Local authority license", "HSE notification"],
    leadTime: "4-6 weeks",
    costEstimate: "£400-£1,200",
    documents: ["UKCA marking", "Risk assessment", "LSO certificate"],
    lso: "Required",
    inspections: "Possible",
    notes: "Post-Brexit: UKCA required",
  },
  {
    country: "Australia",
    code: "AU",
    category: "F",
    permits: ["State radiation license", "EPA approval"],
    leadTime: "6-10 weeks",
    costEstimate: "A$800-A$2,500",
    documents: ["AS/NZS 4173 compliance", "LSO license", "Equipment registration"],
    lso: "Required",
    inspections: "Required",
    notes: "State-specific requirements",
  },
  {
    country: "Canada",
    code: "CA",
    category: "B",
    permits: ["Health Canada notification"],
    leadTime: "2-4 weeks",
    costEstimate: "C$200-C$500",
    documents: ["Show description", "Safety procedures"],
    lso: "Recommended",
    inspections: "Uncommon",
    notes: "Notification system primarily",
  },
  {
    country: "Japan",
    code: "JP",
    category: "B",
    permits: ["Ministry of Health notification"],
    leadTime: "3-4 weeks",
    costEstimate: "¥50,000-¥150,000",
    documents: ["Equipment specs", "Show plan (Japanese)"],
    lso: "Recommended",
    inspections: "Possible",
    notes: "Translation required",
  },
  {
    country: "UAE",
    code: "AE",
    category: "G",
    permits: ["DTCM permit", "Civil aviation approval", "Police approval"],
    leadTime: "8-16 weeks",
    costEstimate: "$2,000-$5,000",
    documents: ["Equipment certs", "Local sponsor", "Detailed show plan"],
    lso: "Required",
    inspections: "Required",
    notes: "Local partnership necessary",
  },
  {
    country: "China",
    code: "CN",
    category: "G",
    permits: ["Ministry of Culture", "Local cultural bureau", "Safety bureau"],
    leadTime: "12-20 weeks",
    costEstimate: "$3,000-$8,000",
    documents: ["Chinese translations", "Import permits", "Show script"],
    lso: "Required",
    inspections: "Extensive",
    notes: "Most complex process",
  },
  {
    country: "Mexico",
    code: "MX",
    category: "A",
    permits: ["Minimal formal requirements"],
    leadTime: "1-2 weeks",
    costEstimate: "$100-$300",
    documents: ["Basic show info", "Equipment list"],
    lso: "Recommended",
    inspections: "Unlikely",
    notes: "Follow IEC 60825-3 guidelines",
  },
  {
    country: "Singapore",
    code: "SG",
    category: "G",
    permits: ["NEA license", "Police permit (outdoor)"],
    leadTime: "6-10 weeks",
    costEstimate: "S$1,000-S$3,000",
    documents: ["NEA application", "Risk assessment", "Local agent"],
    lso: "Required",
    inspections: "Required",
    notes: "Strict outdoor restrictions",
  },
];

type ShowSize = "small" | "medium" | "large";
type AudienceType = "indoor" | "outdoor" | "mixed";

export function PermitCalculator() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [showSize, setShowSize] = useState<ShowSize>("medium");
  const [audienceType, setAudienceType] = useState<AudienceType>("indoor");

  const selectedPermit = permitData.find((p) => p.country === selectedCountry);

  const calculateAdjustedLeadTime = (baseLeadTime: string): string => {
    // Parse the base lead time
    const weeks = parseInt(baseLeadTime);
    if (isNaN(weeks)) return baseLeadTime;

    let adjustment = 0;
    if (showSize === "large") adjustment += 2;
    if (audienceType === "outdoor") adjustment += 2;
    if (audienceType === "mixed") adjustment += 1;

    const adjustedWeeks = weeks + adjustment;
    return `${adjustedWeeks} weeks`;
  };

  const calculateAdjustedCost = (baseCost: string): string => {
    // Extract numeric range
    const numbers = baseCost.match(/[\d,]+/g);
    if (!numbers) return baseCost;

    const factor = showSize === "small" ? 0.7 : showSize === "large" ? 1.5 : 1;
    const adjusted = numbers.map((n) => {
      const val = parseInt(n.replace(/,/g, ""));
      return Math.round(val * factor).toLocaleString();
    });

    return baseCost.replace(/[\d,]+/g, () => adjusted.shift() || "");
  };

  const exportData = () => {
    const headers = ["Country", "Category", "Lead Time", "Cost", "LSO", "Inspections"];
    const rows = permitData.map((p) => [
      p.country,
      p.category,
      p.leadTime,
      p.costEstimate,
      p.lso,
      p.inspections,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "permit-calculator-data.csv";
    a.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5" />
              Permit Calculator
            </CardTitle>
            <CardDescription>
              Lead times and costs by country with show-specific adjustments
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-1" />
            Export All
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Country Selection */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Globe className="h-4 w-4" />
              Select Country
            </label>
            <select
              value={selectedCountry}
              onChange={(e) => setSelectedCountry(e.target.value)}
              className="w-full px-3 py-2 border rounded-md text-sm"
            >
              <option value="">Select a country</option>
              {permitData.map((p) => (
                <option key={p.code} value={p.country}>
                  {p.country} (Cat {p.category})
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Show Size
            </label>
            <div className="flex gap-2">
              {[
                { key: "small", label: "Small", desc: "< 500 people" },
                { key: "medium", label: "Medium", desc: "500-5,000" },
                { key: "large", label: "Large", desc: "> 5,000" },
              ].map((size) => (
                <Button
                  key={size.key}
                  variant={showSize === size.key ? "default" : "outline"}
                  size="sm"
                  className="flex-1"
                  onClick={() => setShowSize(size.key as ShowSize)}
                >
                  <div className="text-center">
                    <div className="text-xs font-medium">{size.label}</div>
                    <div className="text-[10px] opacity-70">{size.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>

        {/* Audience Type */}
        <div className="space-y-2">
          <label className="text-sm font-medium flex items-center gap-2">
            <Users className="h-4 w-4" />
            Venue Type
          </label>
          <div className="flex gap-2">
            {[
              { key: "indoor", label: "Indoor", icon: Building2 },
              { key: "outdoor", label: "Outdoor", icon: Globe },
              { key: "mixed", label: "Mixed", icon: Users },
            ].map((type) => (
              <Button
                key={type.key}
                variant={audienceType === type.key ? "default" : "outline"}
                size="sm"
                className="flex-1"
                onClick={() => setAudienceType(type.key as AudienceType)}
              >
                <type.icon className="h-4 w-4 mr-1" />
                {type.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Results */}
        {selectedPermit ? (
          <div className="space-y-4">
            <div className={`p-4 rounded-lg border ${
              selectedPermit.category === "A" ? "bg-green-50" :
              selectedPermit.category === "B" ? "bg-blue-50" :
              selectedPermit.category === "F" ? "bg-orange-50" :
              selectedPermit.category === "G" ? "bg-purple-50" :
              "bg-red-50"
            }`}>
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-white flex items-center justify-center font-bold text-lg shadow-sm">
                    {selectedPermit.code}
                  </div>
                  <div>
                    <h3 className="font-medium text-lg">{selectedPermit.country}</h3>
                    <Badge variant="outline">Category {selectedPermit.category}</Badge>
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Clock className="h-4 w-4" />
                    Lead Time
                  </div>
                  <p className="font-medium">{calculateAdjustedLeadTime(selectedPermit.leadTime)}</p>
                  <p className="text-xs text-muted-foreground">Base: {selectedPermit.leadTime}</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    Cost Estimate
                  </div>
                  <p className="font-medium">{calculateAdjustedCost(selectedPermit.costEstimate)}</p>
                  <p className="text-xs text-muted-foreground">Base: {selectedPermit.costEstimate}</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <Users className="h-4 w-4" />
                    LSO Required
                  </div>
                  <p className="font-medium">{selectedPermit.lso}</p>
                </div>
                <div className="p-3 bg-white rounded-lg">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                    <AlertTriangle className="h-4 w-4" />
                    Inspections
                  </div>
                  <p className="font-medium">{selectedPermit.inspections}</p>
                </div>
              </div>

              {/* Required Permits */}
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  Required Permits
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedPermit.permits.map((permit, idx) => (
                    <Badge key={idx} variant="secondary">{permit}</Badge>
                  ))}
                </div>
              </div>

              {/* Required Documents */}
              <div className="mt-4 p-3 bg-white rounded-lg">
                <h4 className="font-medium text-sm flex items-center gap-2 mb-2">
                  <FileText className="h-4 w-4" />
                  Required Documents
                </h4>
                <ul className="text-sm space-y-1">
                  {selectedPermit.documents.map((doc, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle2 className="h-3 w-3 text-green-500" />
                      {doc}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notes */}
              <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-sm flex items-center gap-2 mb-1">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  Important Notes
                </h4>
                <p className="text-sm text-yellow-800">{selectedPermit.notes}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <Calculator className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Select a country to view permit requirements</p>
          </div>
        )}

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-2 px-3">Country</th>
                <th className="text-left py-2 px-3">Cat</th>
                <th className="text-left py-2 px-3">Lead Time</th>
                <th className="text-left py-2 px-3">Cost Range</th>
                <th className="text-left py-2 px-3">LSO</th>
              </tr>
            </thead>
            <tbody>
              {permitData.map((permit) => (
                <tr
                  key={permit.code}
                  className={`border-b cursor-pointer hover:bg-muted/50 ${
                    selectedPermit?.country === permit.country ? "bg-muted" : ""
                  }`}
                  onClick={() => setSelectedCountry(permit.country)}
                >
                  <td className="py-2 px-3 font-medium">{permit.country}</td>
                  <td className="py-2 px-3">
                    <Badge variant="outline">{permit.category}</Badge>
                  </td>
                  <td className="py-2 px-3">{permit.leadTime}</td>
                  <td className="py-2 px-3">{permit.costEstimate}</td>
                  <td className="py-2 px-3">{permit.lso}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
          <h4 className="font-medium">Category Legend</h4>
          <div className="grid md:grid-cols-3 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-800">A</Badge>
              <span>Minimal Regulation</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-800">B</Badge>
              <span>Notification System</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-orange-100 text-orange-800">F</Badge>
              <span>Full Regulatory</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-800">G</Badge>
              <span>Government Controlled</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="bg-red-100 text-red-800">X</Badge>
              <span>Restricted/Prohibited</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-2">
            * Costs and lead times are estimates and may vary based on specific circumstances
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

export default PermitCalculator;
