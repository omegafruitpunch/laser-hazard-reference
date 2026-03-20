"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Info,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Filter,
  Globe,
  Download
} from "lucide-react";

interface CountryData {
  id: string;
  name: string;
  code: string;
  status: "A" | "B" | "C" | "D" | "E" | "F";
  x: number;
  y: number;
  details: {
    permits: string;
    notification: string;
    lso: string;
    leadTime: string;
    notes: string;
  };
}

const euCountries: CountryData[] = [
  {
    id: "germany",
    name: "Germany",
    code: "DE",
    status: "A",
    x: 52,
    y: 35,
    details: {
      permits: "Required",
      notification: "30 days",
      lso: "Required",
      leadTime: "4-6 weeks",
      notes: "Strict BGV B2 compliance",
    },
  },
  {
    id: "france",
    name: "France",
    code: "FR",
    status: "B",
    x: 45,
    y: 45,
    details: {
      permits: "Required",
      notification: "21 days",
      lso: "Required",
      leadTime: "3-4 weeks",
      notes: "INRS guidelines apply",
    },
  },
  {
    id: "netherlands",
    name: "Netherlands",
    code: "NL",
    status: "B",
    x: 48,
    y: 32,
    details: {
      permits: "Required",
      notification: "14 days",
      lso: "Required",
      leadTime: "2-3 weeks",
      notes: "Arbodienst consultation",
    },
  },
  {
    id: "belgium",
    name: "Belgium",
    code: "BE",
    status: "B",
    x: 47,
    y: 38,
    details: {
      permits: "Required",
      notification: "14 days",
      lso: "Required",
      leadTime: "2-3 weeks",
      notes: "Regional variations",
    },
  },
  {
    id: "italy",
    name: "Italy",
    code: "IT",
    status: "C",
    x: 55,
    y: 65,
    details: {
      permits: "Required",
      notification: "Varies by region",
      lso: "Recommended",
      leadTime: "3-5 weeks",
      notes: "Significant regional differences",
    },
  },
  {
    id: "spain",
    name: "Spain",
    code: "ES",
    status: "C",
    x: 35,
    y: 70,
    details: {
      permits: "Required",
      notification: "21 days",
      lso: "Recommended",
      leadTime: "3-4 weeks",
      notes: "Autonomous community rules",
    },
  },
  {
    id: "austria",
    name: "Austria",
    code: "AT",
    status: "B",
    x: 58,
    y: 45,
    details: {
      permits: "Required",
      notification: "14 days",
      lso: "Required",
      leadTime: "2-3 weeks",
      notes: "ASchG compliance",
    },
  },
  {
    id: "switzerland",
    name: "Switzerland",
    code: "CH",
    status: "B",
    x: 55,
    y: 50,
    details: {
      permits: "Notification",
      notification: "14 days",
      lso: "Required",
      leadTime: "2 weeks",
      notes: "Non-EU but harmonized",
    },
  },
  {
    id: "poland",
    name: "Poland",
    code: "PL",
    status: "D",
    x: 70,
    y: 35,
    details: {
      permits: "Varies",
      notification: "Contact local authority",
      lso: "Recommended",
      leadTime: "4-6 weeks",
      notes: "Evolving regulations",
    },
  },
  {
    id: "sweden",
    name: "Sweden",
    code: "SE",
    status: "B",
    x: 60,
    y: 15,
    details: {
      permits: "Required",
      notification: "14 days",
      lso: "Required",
      leadTime: "2-3 weeks",
      notes: "Work Environment Authority",
    },
  },
  {
    id: "norway",
    name: "Norway",
    code: "NO",
    status: "B",
    x: 55,
    y: 12,
    details: {
      permits: "Required",
      notification: "14 days",
      lso: "Required",
      leadTime: "2-3 weeks",
      notes: "Non-EU EEA member",
    },
  },
  {
    id: "denmark",
    name: "Denmark",
    code: "DK",
    status: "B",
    x: 52,
    y: 25,
    details: {
      permits: "Required",
      notification: "14 days",
      lso: "Required",
      leadTime: "2-3 weeks",
      notes: "Arbejdstilsynet guidelines",
    },
  },
  {
    id: "finland",
    name: "Finland",
    code: "FI",
    status: "B",
    x: 70,
    y: 12,
    details: {
      permits: "Required",
      notification: "14 days",
      lso: "Required",
      leadTime: "2-3 weeks",
      notes: "Regional State Admin Agency",
    },
  },
  {
    id: "portugal",
    name: "Portugal",
    code: "PT",
    status: "C",
    x: 25,
    y: 72,
    details: {
      permits: "Required",
      notification: "21 days",
      lso: "Recommended",
      leadTime: "3-4 weeks",
      notes: "ACT compliance",
    },
  },
  {
    id: "ireland",
    name: "Ireland",
    code: "IE",
    status: "B",
    x: 35,
    y: 35,
    details: {
      permits: "Required",
      notification: "14 days",
      lso: "Required",
      leadTime: "2-3 weeks",
      notes: "HSA guidelines",
    },
  },
  {
    id: "uk",
    name: "United Kingdom",
    code: "GB",
    status: "A",
    x: 40,
    y: 30,
    details: {
      permits: "Required",
      notification: "28 days",
      lso: "Required",
      leadTime: "4-6 weeks",
      notes: "Post-Brexit: UKCA marking required",
    },
  },
];

const statusDescriptions: Record<string, { label: string; description: string; color: string }> = {
  A: {
    label: "Status A - Full Regulatory",
    description: "Comprehensive permits, mandatory LSO, inspections",
    color: "bg-red-500",
  },
  B: {
    label: "Status B - Standard",
    description: "Permits required, LSO required, moderate lead time",
    color: "bg-orange-500",
  },
  C: {
    label: "Status C - Regional Variations",
    description: "Varying requirements by region/province",
    color: "bg-yellow-500",
  },
  D: {
    label: "Status D - Developing",
    description: "Evolving regulations, consult local authorities",
    color: "bg-blue-500",
  },
  E: {
    label: "Status E - Minimal",
    description: "Notification only, minimal oversight",
    color: "bg-green-500",
  },
  F: {
    label: "Status F - Restricted",
    description: "Significant restrictions or prohibitions",
    color: "bg-purple-500",
  },
};

export function EUCountryStatusMap() {
  const [selectedCountry, setSelectedCountry] = useState<CountryData | null>(null);
  const [statusFilter, setStatusFilter] = useState<string[]>([]);

  const toggleStatusFilter = (status: string) => {
    setStatusFilter((prev) =>
      prev.includes(status) ? prev.filter((s) => s !== status) : [...prev, status]
    );
  };

  const filteredCountries = statusFilter.length > 0
    ? euCountries.filter((c) => statusFilter.includes(c.status))
    : euCountries;

  const getStatusColor = (status: string) => {
    switch (status) {
      case "A": return "bg-red-500";
      case "B": return "bg-orange-500";
      case "C": return "bg-yellow-500";
      case "D": return "bg-blue-500";
      case "E": return "bg-green-500";
      case "F": return "bg-purple-500";
      default: return "bg-gray-500";
    }
  };

  const exportData = () => {
    const headers = ["Country", "Code", "Status", "Permits", "Notification", "LSO", "Lead Time"];
    const rows = euCountries.map((c) => [
      c.name,
      c.code,
      c.status,
      c.details.permits,
      c.details.notification,
      c.details.lso,
      c.details.leadTime,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "eu-country-status.csv";
    a.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              EU Country Status Map
            </CardTitle>
            <CardDescription>
              Interactive map with laser show regulatory Status A-F
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={exportData}>
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          <div className="flex items-center gap-2 mr-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>
          {Object.entries(statusDescriptions).map(([status, info]) => (
            <button
              key={status}
              onClick={() => toggleStatusFilter(status)}
              className={`flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors ${
                statusFilter.includes(status)
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted hover:bg-muted/80"
              }`}
            >
              <div className={`w-2 h-2 rounded-full ${info.color}`} />
              {status}
            </button>
          ))}
        </div>

        {/* Map Container */}
        <div className="relative bg-muted rounded-lg overflow-hidden" style={{ height: "400px" }}>
          {/* Simplified EU Map Background */}
          <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-30">
            {/* Rough EU outline */}
            <path
              d="M20,30 Q30,20 50,15 Q70,10 85,20 Q95,30 90,50 Q85,70 75,80 Q60,90 45,85 Q30,80 25,65 Q20,50 20,30"
              fill="none"
              stroke="currentColor"
              strokeWidth="0.5"
            />
          </svg>

          {/* Country Markers */}
          {filteredCountries.map((country) => (
            <button
              key={country.id}
              className={`absolute transform -translate-x-1/2 -translate-y-1/2 transition-all hover:scale-125 ${
                selectedCountry?.id === country.id ? "scale-125 z-10" : ""
              }`}
              style={{ left: `${country.x}%`, top: `${country.y}%` }}
              onClick={() => setSelectedCountry(country)}
              title={country.name}
            >
              <div
                className={`w-6 h-6 rounded-full ${getStatusColor(country.status)} border-2 border-white shadow-md flex items-center justify-center`}
              >
                <span className="text-[8px] font-bold text-white">{country.status}</span>
              </div>
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-1 text-[10px] font-medium whitespace-nowrap bg-card/90 px-1 rounded">
                {country.code}
              </div>
            </button>
          ))}

          {/* Legend Overlay */}
          <div className="absolute bottom-4 left-4 bg-card/95 rounded-lg p-3 shadow-lg max-w-[200px]">
            <h4 className="text-xs font-medium mb-2">Status Legend</h4>
            <div className="space-y-1">
              {Object.entries(statusDescriptions).map(([status, info]) => (
                <div key={status} className="flex items-center gap-2 text-xs">
                  <div className={`w-2 h-2 rounded-full ${info.color}`} />
                  <span>{status}: {info.label.split(" - ")[1]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Selected Country Details */}
        {selectedCountry ? (
          <div className="p-4 border rounded-lg">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full ${getStatusColor(selectedCountry.status)} flex items-center justify-center text-white font-bold`}>
                  {selectedCountry.code}
                </div>
                <div>
                  <h3 className="font-medium text-lg">{selectedCountry.name}</h3>
                  <Badge className={getStatusColor(selectedCountry.status)}>
                    Status {selectedCountry.status}
                  </Badge>
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setSelectedCountry(null)}>
                <XCircle className="h-4 w-4" />
              </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Permits</p>
                <p className="font-medium">{selectedCountry.details.permits}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Notification</p>
                <p className="font-medium">{selectedCountry.details.notification}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">LSO Required</p>
                <p className="font-medium">{selectedCountry.details.lso}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground">Lead Time</p>
                <p className="font-medium">{selectedCountry.details.leadTime}</p>
              </div>
            </div>

            <div className="mt-4 p-3 bg-yellow-50 rounded-lg flex items-start gap-2">
              <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
              <p className="text-sm text-yellow-800">{selectedCountry.details.notes}</p>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <MapPin className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>Click on a country marker to view detailed requirements</p>
          </div>
        )}

        {/* Status Reference Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Status</th>
                <th className="text-left py-2">Description</th>
                <th className="text-left py-2">Examples</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(statusDescriptions).map(([status, info]) => {
                const examples = euCountries.filter((c) => c.status === status).map((c) => c.name);
                return (
                  <tr key={status} className="border-b">
                    <td className="py-2">
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${info.color}`} />
                        <span className="font-medium">{status}</span>
                      </div>
                    </td>
                    <td className="py-2 text-muted-foreground">{info.description}</td>
                    <td className="py-2">
                      {examples.length > 0 ? examples.join(", ") : "N/A"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

export default EUCountryStatusMap;
