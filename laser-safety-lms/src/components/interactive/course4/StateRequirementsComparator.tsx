"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRightLeft, 
  Filter, 
  Download, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Search
} from "lucide-react";

interface StateRequirement {
  category: string;
  illinois: string;
  massachusetts: string;
  nevada: string;
  newYork: string;
  texas: string;
  washington: string;
}

const stateRequirements: StateRequirement[] = [
  {
    category: "Regulatory Tier",
    illinois: "Comprehensive",
    massachusetts: "Comprehensive",
    nevada: "Notification Only",
    newYork: "Comprehensive",
    texas: "Comprehensive",
    washington: "Notification Only",
  },
  {
    category: "Routine Inspections",
    illinois: "Yes",
    massachusetts: "At discretion",
    nevada: "No",
    newYork: "Yes",
    texas: "Yes",
    washington: "No",
  },
  {
    category: "Mandatory Training",
    illinois: "LSO 9 areas",
    massachusetts: "ANSI-based",
    nevada: "None",
    newYork: "Class A/B Certificate",
    texas: "None",
    washington: "None",
  },
  {
    category: "Advance Notice",
    illinois: "10 working days",
    massachusetts: "15 days (vendors)",
    nevada: "Advance notification",
    newYork: "As specified",
    texas: "As specified",
    washington: "Light show specific",
  },
  {
    category: "Height Requirement",
    illinois: "6 meters (unattended)",
    massachusetts: "20 feet",
    nevada: "Not specified",
    newYork: "Case by case",
    texas: "Case by case",
    washington: "Not specified",
  },
  {
    category: "Registration Required",
    illinois: "Installation & annual",
    massachusetts: "Yes",
    nevada: "No",
    newYork: "Yes",
    texas: "Yes",
    washington: "No",
  },
  {
    category: "Maximum Penalty",
    illinois: "Case by case",
    massachusetts: "$500/violation",
    nevada: "Case by case",
    newYork: "Case by case",
    texas: "Case by case",
    washington: "Case by case",
  },
  {
    category: "Incident Reporting",
    illinois: "Timelines specified",
    massachusetts: "Required",
    nevada: "Not specified",
    newYork: "Required",
    texas: "Required",
    washington: "Not specified",
  },
];

const stateColors: Record<string, string> = {
  illinois: "bg-blue-100 text-blue-800 border-blue-200",
  massachusetts: "bg-green-100 text-green-800 border-green-200",
  nevada: "bg-yellow-100 text-yellow-800 border-yellow-200",
  newYork: "bg-purple-100 text-purple-800 border-purple-200",
  texas: "bg-orange-100 text-orange-800 border-orange-200",
  washington: "bg-teal-100 text-teal-800 border-teal-200",
};

type FilterType = "all" | "comprehensive" | "notification" | "training";

export function StateRequirementsComparator() {
  const [selectedStates, setSelectedStates] = useState<string[]>([
    "illinois",
    "massachusetts",
    "nevada",
    "newYork",
    "texas",
    "washington",
  ]);
  const [filter, setFilter] = useState<FilterType>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const toggleState = (state: string) => {
    setSelectedStates((prev) =>
      prev.includes(state)
        ? prev.filter((s) => s !== state)
        : [...prev, state]
    );
  };

  const getStatusIcon = (value: string) => {
    if (value.toLowerCase().includes("yes") || value.toLowerCase().includes("required")) {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />;
    }
    if (value.toLowerCase().includes("no") || value.toLowerCase().includes("none")) {
      return <XCircle className="h-4 w-4 text-red-500" />;
    }
    return <AlertCircle className="h-4 w-4 text-amber-500" />;
  };

  const filteredRequirements = stateRequirements.filter((req) => {
    if (searchTerm && !req.category.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filter === "comprehensive") {
      return ["illinois", "massachusetts", "newYork", "texas"].some(
        (s) => selectedStates.includes(s) && req[s as keyof StateRequirement]?.includes("Comprehensive")
      );
    }
    if (filter === "notification") {
      return ["nevada", "washington"].some(
        (s) => selectedStates.includes(s) && req[s as keyof StateRequirement]?.includes("Notification")
      );
    }
    return true;
  });

  const exportToCSV = () => {
    const headers = ["Category", ...selectedStates.map((s) => s.charAt(0).toUpperCase() + s.slice(1))];
    const rows = filteredRequirements.map((req) => [
      req.category,
      ...selectedStates.map((s) => req[s as keyof StateRequirement]),
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "state-requirements-comparison.csv";
    a.click();
  };

  const printTable = () => {
    window.print();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ArrowRightLeft className="h-5 w-5" />
              State Requirements Comparator
            </CardTitle>
            <CardDescription>
              Side-by-side comparison of laser safety regulations across states
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-1" />
              CSV
            </Button>
            <Button variant="outline" size="sm" onClick={printTable}>
              <Download className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* State Selection */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: "illinois", label: "Illinois" },
            { key: "massachusetts", label: "Massachusetts" },
            { key: "nevada", label: "Nevada" },
            { key: "newYork", label: "New York" },
            { key: "texas", label: "Texas" },
            { key: "washington", label: "Washington" },
          ].map((state) => (
            <Button
              key={state.key}
              variant={selectedStates.includes(state.key) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleState(state.key)}
            >
              {state.label}
            </Button>
          ))}
        </div>

        {/* Filters and Search */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filter:</span>
          </div>
          {[
            { key: "all", label: "All" },
            { key: "comprehensive", label: "Comprehensive States" },
            { key: "notification", label: "Notification Only" },
          ].map((f) => (
            <Badge
              key={f.key}
              variant={filter === f.key ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => setFilter(f.key as FilterType)}
            >
              {f.label}
            </Badge>
          ))}
          <div className="flex-1" />
          <div className="relative">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search categories..."
              className="pl-8 pr-3 py-1 text-sm border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto border rounded-lg">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-4 py-3 text-left font-medium sticky left-0 bg-muted/50 z-10">
                  Requirement Category
                </th>
                {selectedStates.map((state) => (
                  <th
                    key={state}
                    className={`px-4 py-3 text-left font-medium whitespace-nowrap ${stateColors[state]}`}
                  >
                    {state === "newYork" ? "New York" : state.charAt(0).toUpperCase() + state.slice(1)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filteredRequirements.map((req, idx) => (
                <tr key={req.category} className={idx % 2 === 0 ? "bg-white" : "bg-muted/20"}>
                  <td className="px-4 py-3 font-medium sticky left-0 bg-inherit z-10 border-r">
                    {req.category}
                  </td>
                  {selectedStates.map((state) => (
                    <td key={state} className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(req[state as keyof StateRequirement])}
                        <span>{req[state as keyof StateRequirement]}</span>
                      </div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <CheckCircle2 className="h-3 w-3 text-green-500" />
            <span>Required/Yes</span>
          </div>
          <div className="flex items-center gap-1">
            <XCircle className="h-3 w-3 text-red-500" />
            <span>Not Required/No</span>
          </div>
          <div className="flex items-center gap-1">
            <AlertCircle className="h-3 w-3 text-amber-500" />
            <span>Variable/Case by case</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default StateRequirementsComparator;
