"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Scale, 
  ArrowRightLeft,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Info,
  FileText,
  Download,
  Flag
} from "lucide-react";

interface ComparisonItem {
  category: string;
  ce: string;
  ukca: string;
  difference: "same" | "similar" | "different" | "critical";
  notes: string;
}

const comparisonData: ComparisonItem[] = [
  {
    category: "Legal Basis",
    ce: "EU Directive 2006/25/EC (repealed by 2019/1926)",
    ukca: "The Product Safety and Metrology etc. (Amendment etc.) (EU Exit) Regulations 2019",
    difference: "different",
    notes: "UKCA operates under UK law post-Brexit",
  },
  {
    category: "Applicable Standards",
    ce: "EN 60825-1 (harmonized under EU)",
    ukca: "BS EN 60825-1 (designated standard)",
    difference: "same",
    notes: "Technical content identical, different designation",
  },
  {
    category: "Marking Location",
    ce: "Product and/or packaging/documentation",
    ukca: "Product and/or packaging/documentation",
    difference: "same",
    notes: "Similar placement requirements",
  },
  {
    category: "Notified Body",
    ce: "EU Notified Body",
    ukca: "UK Approved Body",
    difference: "different",
    notes: "Separate conformity assessment bodies required",
  },
  {
    category: "Technical Documentation",
    ce: "Technical file held in EU",
    ukca: "Technical file held in UK",
    difference: "different",
    notes: "UKCA requires UK-based technical documentation",
  },
  {
    category: "Declaration of Conformity",
    ce: "EU Declaration of Conformity",
    ukca: "UK Declaration of Conformity",
    difference: "similar",
    notes: "Similar format, different legal references",
  },
  {
    category: "Classification System",
    ce: "Class 1, 1M, 1C, 2, 2M, 3R, 3B, 4",
    ukca: "Class 1, 1M, 1C, 2, 2M, 3R, 3B, 4",
    difference: "same",
    notes: "Identical classification structure",
  },
  {
    category: "Labeling Requirements",
    ce: "CE mark + Class label + Warning labels",
    ukca: "UKCA mark + Class label + Warning labels",
    difference: "similar",
    notes: "UKCA mark replaces CE mark, other labels same",
  },
  {
    category: "AEL Values",
    ce: "Per EN 60825-1 Annex A",
    ukca: "Per BS EN 60825-1 Annex A",
    difference: "same",
    notes: "Identical accessible emission limits",
  },
  {
    category: "Dual Marking",
    ce: "Not applicable",
    ukca: "CE + UKCA allowed for NI goods",
    difference: "different",
    notes: "Northern Ireland can use CE, UKCA, or both",
  },
  {
    category: "Market Access",
    ce: "All EU member states + EEA",
    ukca: "England, Scotland, Wales",
    difference: "critical",
    notes: "Separate marks required for EU and UK markets",
  },
  {
    category: "Enforcement",
    ce: "Market surveillance authorities per EU country",
    ukca: "Office for Product Safety and Standards (OPSS)",
    difference: "different",
    notes: "UK has centralized enforcement body",
  },
];

const transitionTimeline = [
  { date: "Jan 2021", event: "UKCA marking available", status: "completed" },
  { date: "Jan 2023", event: "Original UKCA deadline", status: "extended" },
  { date: "Dec 2024", event: "CE recognition extended", status: "completed" },
  { date: "Dec 2027", event: "CE marking recognition ends", status: "upcoming" },
  { date: "Jan 2028", event: "UKCA mandatory for new products", status: "upcoming" },
];

export function UKCAvsCEComparator() {
  const [viewMode, setViewMode] = useState<"side-by-side" | "differences">("side-by-side");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const getDifferenceBadge = (diff: ComparisonItem["difference"]) => {
    switch (diff) {
      case "same":
        return <Badge className="bg-green-100 text-green-800">Identical</Badge>;
      case "similar":
        return <Badge className="bg-blue-100 text-blue-800">Similar</Badge>;
      case "different":
        return <Badge className="bg-yellow-100 text-yellow-800">Different</Badge>;
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
    }
  };

  const getDifferenceIcon = (diff: ComparisonItem["difference"]) => {
    switch (diff) {
      case "same":
        return <CheckCircle2 className="h-4 w-4 text-green-500" />;
      case "similar":
        return <Info className="h-4 w-4 text-blue-500" />;
      case "different":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case "critical":
        return <XCircle className="h-4 w-4 text-red-500" />;
    }
  };

  const filteredData = viewMode === "differences"
    ? comparisonData.filter((item) => item.difference !== "same")
    : comparisonData;

  const exportComparison = () => {
    const lines = [
      "UKCA vs CE MARKING COMPARISON",
      "Post-Brexit Laser Equipment Marking Requirements",
      "",
      ...comparisonData.map((item) => [
        `${item.category}:`,
        `  CE: ${item.ce}`,
        `  UKCA: ${item.ukca}`,
        `  Difference: ${item.difference}`,
        `  Notes: ${item.notes}`,
        "",
      ].join("\n")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "ukca-ce-comparison.txt";
    a.click();
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5" />
              UKCA vs CE Comparator
            </CardTitle>
            <CardDescription>
              Post-Brexit marking requirements for laser equipment
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "side-by-side" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("side-by-side")}
            >
              <ArrowRightLeft className="h-4 w-4 mr-1" />
              Side-by-Side
            </Button>
            <Button
              variant={viewMode === "differences" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("differences")}
            >
              <AlertCircle className="h-4 w-4 mr-1" />
              Differences Only
            </Button>
            <Button variant="outline" size="sm" onClick={exportComparison}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Overview Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg bg-blue-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                CE
              </div>
              <h3 className="font-medium">CE Marking (EU)</h3>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Valid in all EU member states + EEA</li>
              <li>• Required for EU market access</li>
              <li>• Based on EU Directives</li>
              <li>• Notified Body assessment (if required)</li>
            </ul>
          </div>
          <div className="p-4 border rounded-lg bg-red-50">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">
                UKCA
              </div>
              <h3 className="font-medium">UKCA Marking (UK)</h3>
            </div>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• Valid in England, Scotland, Wales</li>
              <li>• Required for GB market access</li>
              <li>• Based on UK regulations</li>
              <li>• Approved Body assessment (if required)</li>
            </ul>
          </div>
        </div>

        {/* Transition Timeline */}
        <div className="p-4 bg-muted rounded-lg">
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <Flag className="h-4 w-4" />
            Transition Timeline
          </h4>
          <div className="flex flex-wrap gap-2">
            {transitionTimeline.map((item, index) => (
              <div
                key={index}
                className={`px-3 py-2 rounded-lg text-sm ${
                  item.status === "completed"
                    ? "bg-green-100 text-green-800"
                    : item.status === "extended"
                    ? "bg-yellow-100 text-yellow-800"
                    : "bg-blue-100 text-blue-800"
                }`}
              >
                <span className="font-medium">{item.date}</span>
                <span className="mx-1">-</span>
                <span>{item.event}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4">Category</th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold text-xs">
                      CE
                    </div>
                    EU Requirements
                  </div>
                </th>
                <th className="text-left py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center font-bold text-xs">
                      UKCA
                    </div>
                    UK Requirements
                  </div>
                </th>
                <th className="text-left py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr
                  key={item.category}
                  className={`border-b hover:bg-muted/30 cursor-pointer ${
                    selectedCategory === item.category ? "bg-muted" : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === item.category ? null : item.category)
                  }
                >
                  <td className="py-3 px-4 font-medium">{item.category}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.ce}</td>
                  <td className="py-3 px-4 text-muted-foreground">{item.ukca}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getDifferenceIcon(item.difference)}
                      {getDifferenceBadge(item.difference)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Selected Category Detail */}
        {selectedCategory && (
          <div className="p-4 border rounded-lg bg-muted/30">
            {(() => {
              const item = comparisonData.find((i) => i.category === selectedCategory);
              if (!item) return null;
              return (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{item.category}</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setSelectedCategory(null)}
                    >
                      Close
                    </Button>
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-xs text-blue-600 font-medium mb-1">EU (CE)</p>
                      <p className="text-sm">{item.ce}</p>
                    </div>
                    <div className="p-3 bg-red-50 rounded-lg">
                      <p className="text-xs text-red-600 font-medium mb-1">UK (UKCA)</p>
                      <p className="text-sm">{item.ukca}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 bg-yellow-50 rounded-lg">
                    <Info className="h-4 w-4 text-yellow-600 mt-0.5" />
                    <p className="text-sm text-yellow-800">{item.notes}</p>
                  </div>
                </div>
              );
            })()}
          </div>
        )}

        {/* Key Takeaways */}
        <div className="p-4 border rounded-lg">
          <h4 className="font-medium flex items-center gap-2 mb-3">
            <FileText className="h-4 w-4" />
            Key Takeaways for Laser Shows
          </h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>
                <strong>Dual marking may be required:</strong> If touring both EU and UK, equipment may need both CE and UKCA marks
              </span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5" />
              <span>
                <strong>Technical standards are aligned:</strong> EN 60825-1 and BS EN 60825-1 have identical technical content
              </span>
            </li>
            <li className="flex items-start gap-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 mt-0.5" />
              <span>
                <strong>Documentation location matters:</strong> UKCA requires UK-based technical documentation
              </span>
            </li>
            <li className="flex items-start gap-2">
              <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
              <span>
                <strong>Separate conformity assessment:</strong> EU Notified Bodies and UK Approved Bodies are distinct
              </span>
            </li>
            <li className="flex items-start gap-2">
              <Info className="h-4 w-4 text-blue-500 mt-0.5" />
              <span>
                <strong>Northern Ireland exception:</strong> Can use CE, UKCA, or both (dual marking allowed)
              </span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default UKCAvsCEComparator;
