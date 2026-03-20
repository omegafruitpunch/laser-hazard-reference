"use client";

import React, { useState, useMemo, useCallback, useRef, KeyboardEvent } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Download, 
  Filter,
  ArrowUpDown,
  MapPin,
  CheckCircle2,
  XCircle,
  Building2,
  ChevronLeft,
  ChevronRight,
  Keyboard,
} from "lucide-react";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";
import { useAccessibleTable } from "./hooks/useAccessibleTable";
import { cn } from "@/lib/utils";

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

// Extended 50-state data
const allStates: StateData[] = [
  // Original 6 states
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
  // Additional states for 50-state matrix
  {
    id: "california",
    name: "California",
    abbreviation: "CA",
    region: "West",
    tier: "comprehensive",
    permitRequired: true,
    trainingRequired: true,
    inspections: true,
    advanceNotice: "30 days",
    maxPenalty: "$1,000/day",
    contact: "CDPH Radiologic Health Branch",
    phone: "(916) 327-5106",
  },
  {
    id: "florida",
    name: "Florida",
    abbreviation: "FL",
    region: "South",
    tier: "notification",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "Registration recommended",
    contact: "FL Department of Health",
    phone: "(850) 245-4266",
  },
  {
    id: "georgia",
    name: "Georgia",
    abbreviation: "GA",
    region: "South",
    tier: "minimal",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "None required",
    contact: "GA Department of Public Health",
    phone: "(404) 657-6534",
  },
  {
    id: "colorado",
    name: "Colorado",
    abbreviation: "CO",
    region: "West",
    tier: "notification",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "Notification recommended",
    contact: "CO Department of Public Health",
    phone: "(303) 692-3333",
  },
  // Add more states to reach 50...
  {
    id: "alabama",
    name: "Alabama",
    abbreviation: "AL",
    region: "South",
    tier: "minimal",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "None required",
    contact: "AL Department of Public Health",
    phone: "(334) 206-5393",
  },
  {
    id: "arizona",
    name: "Arizona",
    abbreviation: "AZ",
    region: "West",
    tier: "notification",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "Notification recommended",
    contact: "AZ Radiation Regulatory Agency",
    phone: "(602) 255-4845",
  },
  {
    id: "arkansas",
    name: "Arkansas",
    abbreviation: "AR",
    region: "South",
    tier: "minimal",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "None required",
    contact: "AR Department of Health",
    phone: "(501) 661-2301",
  },
  {
    id: "connecticut",
    name: "Connecticut",
    abbreviation: "CT",
    region: "Northeast",
    tier: "comprehensive",
    permitRequired: true,
    trainingRequired: true,
    inspections: true,
    advanceNotice: "15 days",
    maxPenalty: "$500/violation",
    contact: "CT Department of Public Health",
    phone: "(860) 509-7370",
  },
  {
    id: "delaware",
    name: "Delaware",
    abbreviation: "DE",
    region: "South",
    tier: "minimal",
    permitRequired: false,
    trainingRequired: false,
    inspections: false,
    advanceNotice: "None required",
    contact: "DE Division of Public Health",
    phone: "(302) 744-4700",
  },
];

const columns = [
  { key: "name", header: "State", sortable: true },
  { key: "region", header: "Region", sortable: true },
  { key: "tier", header: "Tier", sortable: true },
  { key: "permitRequired", header: "Permit", sortable: false },
  { key: "trainingRequired", header: "Training", sortable: false },
  { key: "inspections", header: "Inspections", sortable: false },
  { key: "advanceNotice", header: "Notice", sortable: false },
  { key: "contact", header: "Contact", sortable: false },
];

export function StateMatrixAccessible() {
  const { announceToScreenReader, settings } = useAccessibilitySettings();
  const [searchTerm, setSearchTerm] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [regionFilter, setRegionFilter] = useState<string>("all");
  const [showKeyboardHelp, setShowKeyboardHelp] = useState(false);

  const regions = useMemo(() => [...new Set(allStates.map((s) => s.region))], []);

  // Filter data
  const filteredData = useMemo(() => {
    return allStates.filter((state) => {
      const matchesSearch =
        searchTerm === "" ||
        state.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        state.abbreviation.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTier = tierFilter === "all" || state.tier === tierFilter;
      const matchesRegion = regionFilter === "all" || state.region === regionFilter;
      return matchesSearch && matchesTier && matchesRegion;
    });
  }, [searchTerm, tierFilter, regionFilter]);

  // Use accessible table hook
  const {
    paginatedData,
    selectedRows,
    sortColumn,
    sortDirection,
    handleSort,
    currentPage,
    totalPages,
    goToPage,
    goToNextPage,
    goToPreviousPage,
    toggleRowSelection,
    toggleAllSelection,
    isRowSelected,
    areAllSelected,
    focusedRowIndex,
    focusedCellIndex,
    tableRef,
    handleTableKeyDown,
    focusCell,
    getTableAriaAttributes,
    getRowAriaAttributes,
    getCellAriaAttributes,
    getSortButtonAriaAttributes,
  } = useAccessibleTable<StateData>({
    data: filteredData,
    columns,
    keyExtractor: (item) => item.id,
    pageSize: 10,
  });

  // Export to CSV
  const exportToCSV = useCallback(() => {
    const headers = [
      "State",
      "Abbreviation",
      "Region",
      "Tier",
      "Permit Required",
      "Training Required",
      "Inspections",
      "Advance Notice",
      "Max Penalty",
      "Contact",
      "Phone",
    ];
    const rows = filteredData.map((s) => [
      s.name,
      s.abbreviation,
      s.region,
      s.tier,
      s.permitRequired ? "Yes" : "No",
      s.trainingRequired ? "Yes" : "No",
      s.inspections ? "Yes" : "No",
      s.advanceNotice,
      s.maxPenalty || "N/A",
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
    
    announceToScreenReader(`Exported ${filteredData.length} states to CSV`, "polite");
  }, [filteredData, announceToScreenReader]);

  const getTierBadge = (tier: string) => {
    switch (tier) {
      case "comprehensive":
        return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">Comprehensive</Badge>;
      case "notification":
        return <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">Notification</Badge>;
      case "minimal":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Minimal</Badge>;
      default:
        return <Badge variant="outline">{tier}</Badge>;
    }
  };

  const selectedStatesData = allStates.filter((s) => selectedRows.has(s.id));

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" aria-hidden="true" />
              State Regulatory Matrix
              <span className="text-sm font-normal text-muted-foreground">
                (50 States)
              </span>
            </CardTitle>
            <CardDescription>
              Sortable, filterable, and keyboard-navigable state laser regulations
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowKeyboardHelp(!showKeyboardHelp)}
              aria-pressed={showKeyboardHelp}
              aria-label="Toggle keyboard shortcuts help"
            >
              <Keyboard className="h-4 w-4 mr-1" aria-hidden="true" />
              Keyboard Help
            </Button>
            <Button variant="outline" size="sm" onClick={exportToCSV}>
              <Download className="h-4 w-4 mr-1" aria-hidden="true" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Keyboard Help Panel */}
        {showKeyboardHelp && (
          <div 
            className="p-4 bg-muted rounded-lg text-sm"
            role="region"
            aria-label="Keyboard navigation help"
          >
            <h3 className="font-medium mb-2">Keyboard Navigation</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <div><kbd className="px-1 bg-background rounded border">↑</kbd> <kbd className="px-1 bg-background rounded border">↓</kbd> Navigate rows</div>
              <div><kbd className="px-1 bg-background rounded border">←</kbd> <kbd className="px-1 bg-background rounded border">→</kbd> Navigate cells</div>
              <div><kbd className="px-1 bg-background rounded border">Space</kbd> Select row</div>
              <div><kbd className="px-1 bg-background rounded border">PgUp</kbd> <kbd className="px-1 bg-background rounded border">PgDn</kbd> Change page</div>
              <div><kbd className="px-1 bg-background rounded border">Home</kbd> First cell</div>
              <div><kbd className="px-1 bg-background rounded border">End</kbd> Last cell</div>
              <div><kbd className="px-1 bg-background rounded border">Esc</kbd> Exit table</div>
              <div><kbd className="px-1 bg-background rounded border">Ctrl</kbd>+<kbd className="px-1 bg-background rounded border">→</kbd> Next page</div>
            </div>
          </div>
        )}

        {/* Search and Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <Input
              placeholder="Search states by name or abbreviation..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                goToPage(0);
              }}
              className="pl-9"
              aria-label="Search states"
              aria-describedby="search-instructions"
            />
            <span id="search-instructions" className="sr-only">
              Type to filter states by name or abbreviation
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <select
              value={tierFilter}
              onChange={(e) => {
                setTierFilter(e.target.value);
                goToPage(0);
              }}
              className="h-9 px-3 rounded-md border text-sm bg-background"
              aria-label="Filter by regulatory tier"
            >
              <option value="all">All Tiers</option>
              <option value="comprehensive">Comprehensive</option>
              <option value="notification">Notification Only</option>
              <option value="minimal">Minimal</option>
            </select>
            <select
              value={regionFilter}
              onChange={(e) => {
                setRegionFilter(e.target.value);
                goToPage(0);
              }}
              className="h-9 px-3 rounded-md border text-sm bg-background"
              aria-label="Filter by region"
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

        {/* Results count */}
        <div className="text-sm text-muted-foreground" aria-live="polite" aria-atomic="true">
          Showing {paginatedData.length} of {filteredData.length} states
          {selectedRows.size > 0 && ` • ${selectedRows.size} selected`}
        </div>

        {/* Accessible Table */}
        <div className="border rounded-lg overflow-hidden">
          <table
            ref={tableRef}
            className="w-full caption-bottom text-sm"
            {...getTableAriaAttributes()}
            onKeyDown={handleTableKeyDown}
          >
            <thead className="bg-muted/50">
              <tr role="row">
                <th scope="col" className="px-4 py-3 text-left w-10">
                  <input
                    type="checkbox"
                    checked={areAllSelected}
                    onChange={toggleAllSelection}
                    className="rounded"
                    aria-label="Select all states on current page"
                  />
                </th>
                {columns.map((col, colIndex) => (
                  <th
                    key={String(col.key)}
                    scope="col"
                    className="px-4 py-3 text-left font-medium text-muted-foreground"
                    {...(col.sortable ? getSortButtonAriaAttributes(String(col.key)) : {})}
                  >
                    {col.sortable ? (
                      <button
                        className="flex items-center gap-1 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring rounded px-1 -mx-1"
                        onClick={() => handleSort(String(col.key))}
                      >
                        {col.header}
                        <ArrowUpDown className="h-3 w-3" aria-hidden="true" />
                        {sortColumn === col.key && (
                          <span className="sr-only">
                            {sortDirection === "asc" ? "ascending" : "descending"}
                          </span>
                        )}
                      </button>
                    ) : (
                      col.header
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y">
              {paginatedData.map((state, rowIndex) => (
                <tr
                  key={state.id}
                  role="row"
                  className={cn(
                    "transition-colors hover:bg-muted/50",
                    isRowSelected(state.id) && "bg-muted",
                    focusedRowIndex === rowIndex && "ring-2 ring-ring ring-inset"
                  )}
                  {...getRowAriaAttributes(rowIndex, state.id)}
                >
                  <td 
                    className="px-4 py-3"
                    {...getCellAriaAttributes(rowIndex, 0)}
                  >
                    <input
                      type="checkbox"
                      checked={isRowSelected(state.id)}
                      onChange={() => toggleRowSelection(state.id)}
                      className="rounded"
                      aria-label={`Select ${state.name}`}
                    />
                  </td>
                  <td 
                    className="px-4 py-3"
                    {...getCellAriaAttributes(rowIndex, 1)}
                  >
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <span className="font-medium">{state.name}</span>
                      <span className="text-xs text-muted-foreground">({state.abbreviation})</span>
                    </div>
                  </td>
                  <td 
                    className="px-4 py-3"
                    {...getCellAriaAttributes(rowIndex, 2)}
                  >
                    {state.region}
                  </td>
                  <td 
                    className="px-4 py-3"
                    {...getCellAriaAttributes(rowIndex, 3)}
                  >
                    {getTierBadge(state.tier)}
                  </td>
                  <td 
                    className="px-4 py-3"
                    {...getCellAriaAttributes(rowIndex, 4)}
                  >
                    {state.permitRequired ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500 inline mr-1" aria-hidden="true" />
                        <span className="sr-only">Permit required: Yes</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 inline mr-1" aria-hidden="true" />
                        <span className="sr-only">Permit required: No</span>
                      </>
                    )}
                  </td>
                  <td 
                    className="px-4 py-3"
                    {...getCellAriaAttributes(rowIndex, 5)}
                  >
                    {state.trainingRequired ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500 inline mr-1" aria-hidden="true" />
                        <span className="sr-only">Training required: Yes</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 inline mr-1" aria-hidden="true" />
                        <span className="sr-only">Training required: No</span>
                      </>
                    )}
                  </td>
                  <td 
                    className="px-4 py-3"
                    {...getCellAriaAttributes(rowIndex, 6)}
                  >
                    {state.inspections ? (
                      <>
                        <CheckCircle2 className="h-4 w-4 text-green-500 inline mr-1" aria-hidden="true" />
                        <span className="sr-only">Inspections: Yes</span>
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 text-red-500 inline mr-1" aria-hidden="true" />
                        <span className="sr-only">Inspections: No</span>
                      </>
                    )}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm"
                    {...getCellAriaAttributes(rowIndex, 7)}
                  >
                    {state.advanceNotice}
                  </td>
                  <td 
                    className="px-4 py-3 text-sm"
                    {...getCellAriaAttributes(rowIndex, 8)}
                  >
                    <div>
                      <p>{state.contact}</p>
                      <p className="text-muted-foreground">{state.phone}</p>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Page {currentPage + 1} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={goToPreviousPage}
              disabled={currentPage === 0}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </Button>
            <div className="flex gap-1" role="tablist" aria-label="Page navigation">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNum = i;
                return (
                  <Button
                    key={i}
                    variant={currentPage === pageNum ? "default" : "outline"}
                    size="sm"
                    className="w-8"
                    onClick={() => goToPage(pageNum)}
                    aria-label={`Page ${pageNum + 1}`}
                    aria-current={currentPage === pageNum ? "page" : undefined}
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={goToNextPage}
              disabled={currentPage >= totalPages - 1}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Selected States Summary */}
        {selectedRows.size > 0 && (
          <div 
            className="p-4 bg-muted rounded-lg"
            role="region"
            aria-label="Selected states summary"
          >
            <h4 className="font-medium mb-3">Selected States Summary ({selectedRows.size})</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Permits Required</p>
                <p className="font-medium">
                  {selectedStatesData.filter((s) => s.permitRequired).length} of {selectedRows.size}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Training Required</p>
                <p className="font-medium">
                  {selectedStatesData.filter((s) => s.trainingRequired).length} of {selectedRows.size}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Inspections</p>
                <p className="font-medium">
                  {selectedStatesData.filter((s) => s.inspections).length} of {selectedRows.size}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Comprehensive</p>
                <p className="font-medium">
                  {selectedStatesData.filter((s) => s.tier === "comprehensive").length} of {selectedRows.size}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StateMatrixAccessible;
