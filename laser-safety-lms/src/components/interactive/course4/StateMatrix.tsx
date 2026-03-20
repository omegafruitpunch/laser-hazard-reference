"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  Search, 
  Download, 
  Filter,
  ArrowUpDown,
  MapPin,
  CheckCircle2,
  XCircle,
  Building2
} from "lucide-react";

interface StateData {
  id: string;
  name: string;
  abbreviation: string;
  region: string;
  tier: "comprehensive" | "notification" | "minimal";
  permitRequired: boolean;
  trainingRequired: boolean;
  inspections: boolean;
  advanceNotice: string;
  maxPenalty?: string;
  contact: string;
  phone: string;
}

const allStates: StateData[] = [
  {
    id: "illinois",
    name: "Illinois",
    abbreviation: "IL",
    region: "Midwest",
    tier: "comprehensive",
    permitRequired: true,
    trainingRequired: true,
    inspections: true,
    advanceNotice: "10 working days",
    maxPenalty: "Case by case",
    contact: "Illinois Emergency Management Agency",
    phone: "(217) 785-9975",
  },
  {
    id: "massachusetts",
    name: "Massachusetts",
    abbreviation: "MA",
    region: "Northeast",
    tier: "comprehensive",
    permitRequired: true,
    trainingRequired: true,
    inspections: true,
    advanceNotice: "15 days (vendors)",
    maxPenalty: "$500/violation",
    contact: "MA Department of Public Health",
    phone: "(617) 242-3035",
  },
  {
    id: "nevada",
    name: "Nevada",
    abbreviation: "NV",
    region: "West",
    tier: "notification",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "Advance notification",
    contact: "Radiation Control Program",
    phone: "(775) 687-7550",
  },
  {
    id: "new-york",
    name: "New York",
    abbreviation: "NY",
    region: "Northeast",
    tier: "comprehensive",
    permitRequired: true,
    trainingRequired: true,
    inspections: true,
    advanceNotice: "As specified",
    maxPenalty: "Case by case",
    contact: "NY Department of Labor",
    phone: "(518) 457-1202",
  },
  {
    id: "texas",
    name: "Texas",
    abbreviation: "TX",
    region: "South",
    tier: "comprehensive",
    permitRequired: true,
    trainingRequired: false,
    inspections: true,
    advanceNotice: "As specified",
    maxPenalty: "Case by case",
    contact: "Texas Dept of State Health Services",
    phone: "(512) 834-6688",
  },
  {
    id: "washington",
    name: "Washington",
    abbreviation: "WA",
    region: "West",
    tier: "notification",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "Light show specific",
    contact: "WA Department of Labor & Industries",
    phone: "(360) 236-3210",
  },
];

type SortField = "name" | "region" | "tier" | "advanceNotice";
type SortDirection = "asc" | "desc";

export function StateMatrix() {
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [sortField, setSortField] = useState<SortField>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedStates, setSelectedStates] = useState<string[]>([]);

  const regions = useMemo(() => [...new Set(allStates.map((s) => s.region))], []);

  const filteredStates = useMemo(() => {
    let filtered = allStates.filter((state) => {
      const matchesSearch =
        searchTerm === "" ||
        state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = tierFilter === "all" || state.tier === tierFilter;
      const matchesRegion = regionFilter === "all" || state.region === regionFilter;
      return matchesSearch && matchesTier && matchesRegion;
    });

    filtered.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      const comparison = String(aVal).localeCompare(String(bVal));
      return sortDirection === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, tierFilter, regionFilter, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const toggleStateSelection = (stateId: string) => {
    setSelectedStates((prev) =>
      prev.includes(stateId)
        ? prev.filter((id) => id !== stateId)
        : [...prev, stateId]
    );
  };

  const exportToCSV = () => {
    const headers = [
      "State",
      "Region",
      "Tier",
      "Permit Required",
      "Training Required",
      "Inspections",
      "Advance Notice",
      "Contact",
      "Phone",
    ];
    const rows = filteredStates.map((s) => [
      s.name,
      s.region,
      s.tier,
      s.permitRequired ? "Yes" : "No",
      s.trainingRequired ? "Yes" : "No",
      s.inspections ? "Yes" : "No",
      s.advanceNotice,
      s.contact,
      s.phone,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "state-regulatory-matrix.csv";
    a.click();
  };

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "comprehensive":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Comprehensive</Badge>;
      case "notification":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Notification Only</Badge>;
      case "minimal":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Minimal</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  const selectedStatesData = allStates.filter((s) => selectedStates.includes(s.id));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              State Regulatory Matrix
            </CardTitle>
            <CardDescription>
              Sortable and filterable grid of state laser safety regulations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-1" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search states..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <select
              value={tierFilter}
              onChange={(e) => setTierFilter(e.target.value)}
              className="h-9 px-3 rounded-md border text-sm bg-background"
            >
              <option value="all">All Tiers</option>
              <option value="comprehensive">Comprehensive</option>
              <option value="notification">Notification Only</option>
              <option value="minimal">Minimal</option>
            </select>
            <select
              value={regionFilter}
              onChange={(e) => setRegionFilter(e.target.value)}
              className="h-9 px-3 rounded-md border text-sm bg-background"
            >
              <option value="all">All Regions</option>
              {regions.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-10">
                  <input
                    type="checkbox"
                    checked={selectedStates.length === filteredStates.length && filteredStates.length > 0}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedStates(filteredStates.map((s) => s.id));
                      } else {
                        setSelectedStates([]);
                      }
                    }}
                    className="rounded"
                  />
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("name")}
                  >
                    State
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("region")}
                  >
                    Region
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>
                  <button
                    className="flex items-center gap-1 hover:text-foreground"
                    onClick={() => handleSort("tier")}
                  >
                    Tier
                    <ArrowUpDown className="h-3 w-3" />
                  </button>
                </TableHead>
                <TableHead>Permit</TableHead>
                <TableHead>Training</TableHead>
                <TableHead>Inspections</TableHead>
                <TableHead>Notice</TableHead>
                <TableHead>Contact</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStates.map((state) => (
                <TableRow
                  key={state.id}
                  className={selectedStates.includes(state.id) ? "bg-muted/50" : ""}
                >
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={selectedStates.includes(state.id)}
                      onChange={() => toggleStateSelection(state.id)}
                      className="rounded"
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">{state.name}</span>
                      <span className="text-xs text-muted-foreground">({state.abbreviation})</span>
                    </div>
                  </TableCell>
                  <TableCell>{state.region}</TableCell>
                  <TableCell>{getTierBadge(state.tier)}</TableCell>
                  <TableCell>
                    {state.permitRequired ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {state.trainingRequired ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell>
                    {state.inspections ? (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    ) : (
                      <XCircle className="h-4 w-4 text-red-500" />
                    )}
                  </TableCell>
                  <TableCell className="text-sm">{state.advanceNotice}</TableCell>
                  <TableCell>
                    <div className="text-sm">
                      <p>{state.contact}</p>
                      <p className="text-muted-foreground">{state.phone}</p>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Selected States Summary */}
        {selectedStates.length > 0 && (
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-3">Selected States Summary ({selectedStates.length})</h4>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Permits Required</p>
                <p className="font-medium">
                  {selectedStatesData.filter((s) => s.permitRequired).length} of {selectedStates.length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Training Required</p>
                <p className="font-medium">
                  {selectedStatesData.filter((s) => s.trainingRequired).length} of {selectedStates.length}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Inspections</p>
                <p className="font-medium">
                  {selectedStatesData.filter((s) => s.inspections).length} of {selectedStates.length}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}


export default StateMatrix;
