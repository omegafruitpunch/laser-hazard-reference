"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  ArrowRightLeft,
  CheckCircle2,
  AlertTriangle,
  Info,
  Clock,
  Filter,
  Download,
  ChevronDown,
  ChevronRight,
  Globe
} from "lucide-react";

interface ChangeItem {
  category: string;
  edition2: string;
  edition3: string;
  impact: "low" | "medium" | "high" | "critical";
  description: string;
}

interface ISOStandard {
  number: string;
  title: string;
  scope: string;
  relationship: string;
}

const comparisonData: ChangeItem[] = [
  {
    category: "Classification System",
    edition2: "Classes 1, 2, 3A, 3B, 4",
    edition3: "Classes 1, 1M, 2, 2M, 3R, 3B, 4 (added 1M, 2M, 3R)",
    impact: "critical",
    description: "Major restructuring with addition of M and R classes. Class 3A eliminated, replaced by 3R.",
  },
  {
    category: "AEL Tables",
    edition2: "Based on 1993 ICNIRP MPE limits",
    edition3: "Updated based on 2000/2013 ICNIRP revisions",
    impact: "high",
    description: "Accessible Emission Limits updated to reflect current biological data",
  },
  {
    category: "Measurement Conditions",
    edition2: "7mm aperture for all wavelengths",
    edition3: "50mm aperture for 400-1400nm (retinal hazard)",
    impact: "high",
    description: "Larger aperture for retinal hazard assessment changes classification of some products",
  },
  {
    category: "Extended Sources",
    edition2: "C6 = 1.5 for all sources",
    edition3: "C6 varies with source angular subtense",
    impact: "medium",
    description: "More sophisticated treatment of extended sources affects class determination",
  },
  {
    category: "Time Base",
    edition2: "100 seconds for Class 2",
    edition3: "0.25 seconds for Class 2 (blink reflex)",
    impact: "critical",
    description: "Major change in Class 2 definition significantly affects AEL values",
  },
  {
    category: "MPE Values",
    edition2: "Specific values for various wavelengths",
    edition3: "Revised values based on updated biological data",
    impact: "high",
    description: "Some wavelength regions have significantly different exposure limits",
  },
  {
    category: "Biological Basis",
    edition2: "References ICNIRP 1993",
    edition3: "References ICNIRP 2000/2013, ACGIH",
    impact: "medium",
    description: "Updated scientific foundation for safety limits",
  },
  {
    category: "Fiber Optics",
    edition2: "Limited guidance on fiber systems",
    edition3: "Expanded section on fiber optic systems",
    impact: "medium",
    description: "Better guidance for telecommunications and medical fiber applications",
  },
  {
    category: "LEDs",
    edition2: "LEDs addressed briefly",
    edition3: "Comprehensive LED treatment",
    impact: "high",
    description: "LEDs now explicitly covered with specific classification rules",
  },
  {
    category: "Information Requirements",
    edition2: "Basic labeling requirements",
    edition3: "Enhanced labeling and documentation",
    impact: "medium",
    description: "More detailed requirements for manufacturer information",
  },
  {
    category: "Image Projectors",
    edition2: "Limited guidance",
    edition3: "Specific requirements for projectors",
    impact: "high",
    description: "Important for laser display/entertainment industry",
  },
  {
    category: "Multi-wavelength",
    edition2: "Simple additive approach",
    edition3: "Weighted additive approach",
    impact: "medium",
    description: "More sophisticated treatment of multi-wavelength sources",
  },
];

const timelineData = [
  { year: "1984", edition: "First Edition", significance: "Initial publication of IEC 60825-1" },
  { year: "1993", edition: "Amendment 1", significance: "First revision" },
  { year: "2001", edition: "Edition 2", significance: "Major revision with updated MPE values" },
  { year: "2007", edition: "Edition 2.1", significance: "Added 1M and 2M classes, LED expansion" },
  { year: "2014", edition: "Edition 3", significance: "Major revision, current standard" },
  { year: "2022", edition: "Amendment", significance: "Latest clarifications and updates" },
];

const isoStandards: ISOStandard[] = [
  { number: "ISO 11553-1", title: "Laser processing machines - Safety", scope: "Industrial laser systems", relationship: "Complements IEC 60825-1 for industrial applications" },
  { number: "ISO 11553-2", title: "Laser processing machines - Noise", scope: "Acoustic safety", relationship: "Addresses specific industrial hazard" },
  { number: "ISO 17526", title: "Ophthalmic instruments - Fundamental requirements", scope: "Medical laser devices", relationship: "Medical device specific requirements" },
  { number: "ISO 21254", title: "Lasers and laser-related equipment - Test methods", scope: "Measurement standards", relationship: "Supports IEC 60825-1 testing" },
  { number: "ISO/TR 23115", title: "Near-field effects of laser beams", scope: "Technical guidance", relationship: "Provides additional technical information" },
  { number: "ISO 11146", title: "Lasers and laser-related equipment - Beam widths", scope: "Beam characterization", relationship: "Measurement methodology standard" },
];

const harmonizationStatus = [
  { region: "European Union", standard: "EN 60825-1", status: "harmonized", notes: "Edition 3 harmonized under RED and MD directives" },
  { region: "United States", standard: "21 CFR 1040.10", status: "different", notes: "FDA regulations - similar but distinct requirements" },
  { region: "United Kingdom", standard: "BS EN 60825-1", status: "harmonized", notes: "Post-Brexit: designated standard for UKCA" },
  { region: "Canada", standard: "IEC 60825-1 adopted", status: "harmonized", notes: "Health Canada recognizes IEC standard" },
  { region: "Australia/NZ", standard: "AS/NZS 60825.1", status: "harmonized", notes: "Adopted with local modifications" },
  { region: "Japan", standard: "JIS C 6802", status: "similar", notes: "Based on IEC with national deviations" },
];

export function IECEditionComparator() {
  const [viewMode, setViewMode] = useState<"comparison" | "timeline" | "iso">("comparison");
  const [impactFilter, setImpactFilter] = useState<string>("all");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredData = impactFilter === "all"
    ? comparisonData
    : comparisonData.filter((item) => item.impact === impactFilter);

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "high":
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case "medium":
        return <Badge className="bg-yellow-100 text-yellow-800">Medium</Badge>;
      default:
        return <Badge className="bg-blue-100 text-blue-800">Low</Badge>;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "critical":
        return "border-l-red-500";
      case "high":
        return "border-l-orange-500";
      case "medium":
        return "border-l-yellow-500";
      default:
        return "border-l-blue-500";
    }
  };

  const exportComparison = () => {
    const lines = [
      "IEC 60825-1 EDITION COMPARISON",
      "Edition 2 (2001) vs Edition 3 (2014)",
      "",
      ...comparisonData.map((item) => [
        `${item.category} (${item.impact.toUpperCase()})`,
        `Edition 2: ${item.edition2}`,
        `Edition 3: ${item.edition3}`,
        `Description: ${item.description}`,
        "",
      ].join("\n")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "iec-edition-comparison.txt";
    a.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              IEC Edition Comparator
            </CardTitle>
            <CardDescription>
              Edition 2 vs 3 comparison with harmonization status
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "comparison" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("comparison")}
            >
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              Comparison
            </Button>
            <Button
              variant={viewMode === "timeline" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("timeline")}
            >
              <Clock className="h-4 w-4 mr-1" />
              Timeline
            </Button>
            <Button
              variant={viewMode === "iso" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("iso")}
            >
              <Globe className="h-4 w-4 mr-1" />
              ISO & Harmonization
            </Button>
            <Button variant="outline" size="sm" onClick={exportComparison}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {viewMode === "comparison" && (
          <>
            {/* Impact Filter */}
            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground flex items-center">
                <Filter className="h-4 w-4 mr-1" />
                Filter by impact:
              </span>
              {["all", "critical", "high", "medium", "low"].map((impact) => (
                <Button
                  key={impact}
                  variant={impactFilter === impact ? "default" : "outline"}
                  size="sm"
                  onClick={() => setImpactFilter(impact)}
                >
                  {impact.charAt(0).toUpperCase() + impact.slice(1)}
                </Button>
              ))}
            </div>

            {/* Comparison List */}
            <div className="space-y-3">
              {filteredData.map((item, index) => (
                <div
                  key={item.category}
                  className={`border rounded-lg overflow-hidden border-l-4 ${getImpactColor(item.impact)}`}
                >
                  <button
                    className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors"
                    onClick={() => toggleCategory(item.category)}
                  >
                    <div className="flex items-center gap-3">
                      {expandedCategories.has(item.category) ? (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      )}
                      <span className="font-medium">{item.category}</span>
                      {getImpactBadge(item.impact)}
                    </div>
                  </button>
                  {expandedCategories.has(item.category) && (
                    <div className="p-4 pt-0 border-t">
                      <div className="grid md:grid-cols-2 gap-4 mt-4">
                        <div className="p-3 bg-blue-50 rounded-lg">
                          <p className="text-xs text-blue-600 font-medium mb-1">Edition 2 (2001)</p>
                          <p className="text-sm">{item.edition2}</p>
                        </div>
                        <div className="p-3 bg-green-50 rounded-lg">
                          <p className="text-xs text-green-600 font-medium mb-1">Edition 3 (2014)</p>
                          <p className="text-sm">{item.edition3}</p>
                        </div>
                      </div>
                      <div className="mt-3 p-3 bg-muted rounded-lg">
                        <p className="text-sm">
                          <Info className="h-4 w-4 inline mr-1" />
                          {item.description}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Key Takeaways */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium flex items-center gap-2 mb-3">
                <AlertTriangle className="h-4 w-4" />
                Critical Changes for Entertainment Industry
              </h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span><strong>Class 2 time base change:</strong> 0.25s blink reflex basis affects all Class 2 laser products</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span><strong>Image projector requirements:</strong> New specific requirements for laser display applications</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span><strong>Measurement conditions:</strong> 50mm aperture changes classification of some laser systems</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
                  <span><strong>Class 3R introduction:</strong> Replaces Class 3A with different safety approach</span>
                </li>
              </ul>
            </div>
          </>
        )}

        {viewMode === "timeline" && (
          <div className="space-y-6">
            <div className="relative">
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted" />
              <div className="space-y-6">
                {timelineData.map((item, index) => (
                  <div key={index} className="relative flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold z-10 ${
                      item.year === "2014" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}>
                      {item.year.slice(2)}
                    </div>
                    <div className="flex-1 p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{item.edition}</span>
                        <Badge variant="outline">{item.year}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.significance}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">Transition Guidance</h4>
              <ul className="text-sm space-y-1 text-muted-foreground">
                <li>• Products certified to Edition 2 remain valid but should transition to Edition 3</li>
                <li>• New products must comply with the current Edition (3)</li>
                <li>• National deviations may affect applicability in some markets</li>
                <li>• Always check current national implementation status</li>
              </ul>
            </div>
          </div>
        )}

        {viewMode === "iso" && (
          <div className="space-y-6">
            {/* ISO Standards */}
            <div>
              <h4 className="font-medium mb-3">Related ISO Standards</h4>
              <div className="grid md:grid-cols-2 gap-3">
                {isoStandards.map((std) => (
                  <div key={std.number} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{std.number}</Badge>
                    </div>
                    <p className="font-medium text-sm">{std.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{std.scope}</p>
                    <Separator className="my-2" />
                    <p className="text-xs text-muted-foreground">{std.relationship}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Harmonization Status */}
            <div>
              <h4 className="font-medium mb-3">Global Harmonization Status</h4>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b bg-muted/50">
                      <th className="text-left py-2 px-3">Region</th>
                      <th className="text-left py-2 px-3">Standard</th>
                      <th className="text-left py-2 px-3">Status</th>
                      <th className="text-left py-2 px-3">Notes</th>
                    </tr>
                  </thead>
                  <tbody>
                    {harmonizationStatus.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-3 font-medium">{item.region}</td>
                        <td className="py-2 px-3">{item.standard}</td>
                        <td className="py-2 px-3">
                          <Badge className={
                            item.status === "harmonized" ? "bg-green-100 text-green-800" :
                            item.status === "different" ? "bg-orange-100 text-orange-800" :
                            "bg-blue-100 text-blue-800"
                          }>
                            {item.status}
                          </Badge>
                        </td>
                        <td className="py-2 px-3 text-muted-foreground">{item.notes}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Key Points */}
            <div className="p-4 border rounded-lg bg-muted/30">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <Globe className="h-4 w-4" />
                International Trade Considerations
              </h4>
              <ul className="text-sm space-y-1">
                <li>• IEC 60825-1 Edition 3 is the current international baseline</li>
                <li>• EN 60825-1 (EU) and BS EN 60825-1 (UK) are technically identical</li>
                <li>• US FDA 21 CFR 1040.10 maintains separate requirements</li>
                <li>• Always verify national implementation for target markets</li>
                <li>• Consider mutual recognition agreements for testing</li>
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default IECEditionComparator;
