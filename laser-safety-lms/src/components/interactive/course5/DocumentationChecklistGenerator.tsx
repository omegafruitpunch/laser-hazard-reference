"use client";

import React, { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle2,
  Download,
  Printer,
  RotateCcw,
  Globe,
  AlertTriangle,
  Languages,
  ChevronDown,
  ChevronRight,
  Filter
} from "lucide-react";

interface DocumentItem {
  id: string;
  category: string;
  name: string;
  required: boolean;
  translation: boolean;
  description: string;
  applicable: string[]; // country categories
}

const documentDatabase: DocumentItem[] = [
  // Regulatory Documentation
  { id: "reg-1", category: "Regulatory", name: "Laser Show Permit", required: true, translation: true, description: "Official permit from host country authority", applicable: ["F", "G"] },
  { id: "reg-2", category: "Regulatory", name: "Venue Approval Letter", required: true, translation: false, description: "Written approval from venue management", applicable: ["A", "B", "F", "G", "X"] },
  { id: "reg-3", category: "Regulatory", name: "Import Authorization", required: true, translation: true, description: "Permission to import laser equipment", applicable: ["F", "G"] },
  { id: "reg-4", category: "Regulatory", name: "Work Permits (Crew)", required: true, translation: true, description: "Valid work permits for all crew members", applicable: ["B", "F", "G", "X"] },
  { id: "reg-5", category: "Regulatory", name: "Notification Receipt", required: false, translation: false, description: "Proof of advance notification (Category B)", applicable: ["B"] },
  { id: "reg-6", category: "Regulatory", name: "Insurance Certificate", required: true, translation: true, description: "Public liability and equipment insurance", applicable: ["A", "B", "F", "G", "X"] },
  { id: "reg-7", category: "Regulatory", name: "ATA Carnet", required: false, translation: false, description: "Temporary import document", applicable: ["A", "B", "F", "G"] },

  // Equipment Documentation
  { id: "equip-1", category: "Equipment", name: "Equipment Specifications", required: true, translation: true, description: "Detailed specs for all laser equipment", applicable: ["A", "B", "F", "G", "X"] },
  { id: "equip-2", category: "Equipment", name: "Classification Certificates", required: true, translation: true, description: "Laser class certification per IEC 60825-1", applicable: ["A", "B", "F", "G", "X"] },
  { id: "equip-3", category: "Equipment", name: "CE/UKCA Marking Docs", required: true, translation: false, description: "Conformity assessment documentation", applicable: ["B", "F", "G"] },
  { id: "equip-4", category: "Equipment", name: "Maintenance Records", required: false, translation: false, description: "Service history and calibration records", applicable: ["F", "G"] },
  { id: "equip-5", category: "Equipment", name: "Power Specifications", required: true, translation: false, description: "Voltage, frequency, power requirements", applicable: ["A", "B", "F", "G", "X"] },
  { id: "equip-6", category: "Equipment", name: "Serial Number List", required: true, translation: false, description: "Complete equipment inventory with serials", applicable: ["A", "B", "F", "G", "X"] },

  // Safety Documentation
  { id: "safety-1", category: "Safety", name: "MPE Calculations", required: true, translation: true, description: "Maximum Permissible Exposure calculations", applicable: ["B", "F", "G", "X"] },
  { id: "safety-2", category: "Safety", name: "NOHD Analysis", required: true, translation: true, description: "Nominal Ocular Hazard Distance analysis", applicable: ["B", "F", "G", "X"] },
  { id: "safety-3", category: "Safety", name: "Safety Zone Plans", required: true, translation: true, description: "Diagrams of controlled/safety zones", applicable: ["B", "F", "G", "X"] },
  { id: "safety-4", category: "Safety", name: "Emergency Procedures", required: true, translation: true, description: "Emergency shutdown and evacuation plans", applicable: ["A", "B", "F", "G", "X"] },
  { id: "safety-5", category: "Safety", name: "Risk Assessment", required: true, translation: true, description: "Comprehensive risk assessment document", applicable: ["F", "G", "X"] },
  { id: "safety-6", category: "Safety", name: "Scanning Variance (if applicable)", required: false, translation: true, description: "Audience scanning approval documentation", applicable: ["F", "G"] },

  // Personnel Documentation
  { id: "personnel-1", category: "Personnel", name: "LSO Qualifications", required: true, translation: true, description: "Laser Safety Officer credentials", applicable: ["B", "F", "G", "X"] },
  { id: "personnel-2", category: "Personnel", name: "Operator Certifications", required: true, translation: true, description: "Training certificates for operators", applicable: ["F", "G", "X"] },
  { id: "personnel-3", category: "Personnel", name: "Crew List with Passports", required: true, translation: false, description: "Complete crew manifest with passport copies", applicable: ["A", "B", "F", "G", "X"] },
  { id: "personnel-4", category: "Personnel", name: "Medical Certificates", required: false, translation: true, description: "Eye examination records if required", applicable: ["G", "X"] },
  { id: "personnel-5", category: "Personnel", name: "Visa Documentation", required: true, translation: false, description: "Valid visas for all crew members", applicable: ["A", "B", "F", "G", "X"] },

  // Show Documentation
  { id: "show-1", category: "Show", name: "Show Description", required: true, translation: true, description: "Detailed description of laser show content", applicable: ["A", "B", "F", "G", "X"] },
  { id: "show-2", category: "Show", name: "Venue Layout Plans", required: true, translation: false, description: "Technical drawings of venue setup", applicable: ["A", "B", "F", "G", "X"] },
  { id: "show-3", category: "Show", name: "Timeline/Schedule", required: true, translation: true, description: "Load-in, show, load-out schedule", applicable: ["A", "B", "F", "G", "X"] },
  { id: "show-4", category: "Show", name: "Power Distribution Plan", required: true, translation: false, description: "Electrical requirements and distribution", applicable: ["A", "B", "F", "G", "X"] },
  { id: "show-5", category: "Show", name: "Weather Contingency (outdoor)", required: false, translation: true, description: "Plans for adverse weather conditions", applicable: ["A", "B", "F", "G"] },
];

const countryCategories = [
  { code: "A", name: "Minimal Regulation", description: "Mexico, Caribbean, parts of Asia" },
  { code: "B", name: "Notification System", description: "Canada, Japan, South Korea, Switzerland" },
  { code: "F", name: "Full Regulatory", description: "USA, Germany, UK, Australia, Netherlands" },
  { code: "G", name: "Government Controlled", description: "China, Russia, Singapore, UAE" },
  { code: "X", name: "Restricted/Prohibited", description: "Saudi Arabia (outdoor), India" },
];

export function DocumentationChecklistGenerator() {
  const [selectedCategory, setSelectedCategory] = useState<string>("F");
  const [completedDocs, setCompletedDocs] = useState<Set<string>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(["Regulatory"]));
  const [filterRequired, setFilterRequired] = useState<boolean>(false);

  const toggleDoc = (docId: string) => {
    const newCompleted = new Set(completedDocs);
    if (newCompleted.has(docId)) {
      newCompleted.delete(docId);
    } else {
      newCompleted.add(docId);
    }
    setCompletedDocs(newCompleted);
  };

  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(category)) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  const filteredDocs = useMemo(() => {
    let docs = documentDatabase.filter((doc) => 
      doc.applicable.includes(selectedCategory)
    );
    if (filterRequired) {
      docs = docs.filter((doc) => doc.required);
    }
    return docs;
  }, [selectedCategory, filterRequired]);

  const groupedDocs = useMemo(() => {
    const groups: Record<string, DocumentItem[]> = {};
    filteredDocs.forEach((doc) => {
      if (!groups[doc.category]) {
        groups[doc.category] = [];
      }
      groups[doc.category].push(doc);
    });
    return groups;
  }, [filteredDocs]);

  const completedCount = filteredDocs.filter((d) => completedDocs.has(d.id)).length;
  const totalCount = filteredDocs.length;
  const requiredCount = filteredDocs.filter((d) => d.required).length;
  const requiredCompleted = filteredDocs.filter((d) => d.required && completedDocs.has(d.id)).length;

  const exportChecklist = () => {
    const countryInfo = countryCategories.find((c) => c.code === selectedCategory);
    const lines = [
      `DOCUMENTATION CHECKLIST - Category ${selectedCategory}`,
      countryInfo?.name || "",
      `Generated: ${new Date().toLocaleDateString()}`,
      ``,
      `PROGRESS: ${completedCount}/${totalCount} documents (${Math.round((completedCount/totalCount)*100)}%)`,
      `Required: ${requiredCompleted}/${requiredCount}`,
      ``,
      ...Object.entries(groupedDocs).map(([category, docs]) => [
        `${category.toUpperCase()}`,
        "-".repeat(category.length),
        ...docs.map((doc) => [
          `[${completedDocs.has(doc.id) ? "X" : " "}] ${doc.name}`,
          `    ${doc.required ? "(Required)" : "(Optional)"}`,
          `    ${doc.description}`,
          doc.translation ? "    [Translation Required]" : "",
          "",
        ].join("\n")),
        "",
      ].join("\n")),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `documentation-checklist-cat${selectedCategory}.txt`;
    a.click();
  };

  const printChecklist = () => {
    window.print();
  };

  const reset = () => {
    setCompletedDocs(new Set());
  };

  const currentCategory = countryCategories.find((c) => c.code === selectedCategory);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Documentation Checklist Generator
            </CardTitle>
            <CardDescription>
              By country category with translation requirements
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={exportChecklist}>
              <Download className="h-4 w-4 mr-1" />
              Export
            </Button>
            <Button variant="outline" size="sm" onClick={printChecklist}>
              <Printer className="h-4 w-4 mr-1" />
              Print
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium flex items-center gap-2">
            <Globe className="h-4 w-4" />
            Select Country Category
          </label>
          <div className="flex flex-wrap gap-2">
            {countryCategories.map((cat) => (
              <Button
                key={cat.code}
                variant={selectedCategory === cat.code ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory(cat.code)}
              >
                Category {cat.code}
              </Button>
            ))}
          </div>
          {currentCategory && (
            <p className="text-sm text-muted-foreground">
              {currentCategory.name}: {currentCategory.description}
            </p>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <Button
            variant={filterRequired ? "default" : "outline"}
            size="sm"
            onClick={() => setFilterRequired(!filterRequired)}
          >
            <Filter className="h-4 w-4 mr-1" />
            {filterRequired ? "Showing Required Only" : "Show All Documents"}
          </Button>
        </div>

        {/* Progress */}
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Overall Progress</p>
            <p className="text-2xl font-bold">
              {completedCount}/{totalCount}
            </p>
            <div className="mt-2 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%` }}
              />
            </div>
          </div>
          <div className="p-4 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground">Required Documents</p>
            <p className="text-2xl font-bold">
              {requiredCompleted}/{requiredCount}
            </p>
            <div className="mt-2 h-2 bg-muted-foreground/20 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all ${
                  requiredCompleted === requiredCount ? "bg-green-500" : "bg-amber-500"
                }`}
                style={{ width: `${requiredCount > 0 ? (requiredCompleted / requiredCount) * 100 : 0}%` }}
              />
            </div>
          </div>
        </div>

        {/* Document List */}
        <div className="space-y-2">
          {Object.entries(groupedDocs).map(([category, docs]) => (
            <div key={category} className="border rounded-lg overflow-hidden">
              <button
                className="w-full flex items-center justify-between p-3 bg-muted/50 hover:bg-muted transition-colors"
                onClick={() => toggleCategory(category)}
              >
                <span className="font-medium">{category}</span>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {docs.filter((d) => completedDocs.has(d.id)).length}/{docs.length}
                  </Badge>
                  {expandedCategories.has(category) ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </div>
              </button>
              {expandedCategories.has(category) && (
                <div className="divide-y">
                  {docs.map((doc) => (
                    <div
                      key={doc.id}
                      className={`flex items-start gap-3 p-3 cursor-pointer hover:bg-muted/30 transition-colors ${
                        completedDocs.has(doc.id) ? "bg-muted/20" : ""
                      }`}
                      onClick={() => toggleDoc(doc.id)}
                    >
                      <div className="mt-0.5">
                        {completedDocs.has(doc.id) ? (
                          <CheckCircle2 className="h-5 w-5 text-green-500" />
                        ) : (
                          <div className="w-5 h-5 rounded border-2 border-muted-foreground/30" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className={`text-sm ${completedDocs.has(doc.id) ? "line-through text-muted-foreground" : ""}`}>
                            {doc.name}
                          </p>
                          {doc.required ? (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          ) : (
                            <Badge variant="outline" className="text-xs">Optional</Badge>
                          )}
                          {doc.translation && (
                            <Badge className="text-xs bg-purple-100 text-purple-800">
                              <Languages className="h-3 w-3 mr-1" />
                              Translation
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">{doc.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {filteredDocs.length === 0 && (
          <div className="text-center py-8 text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p>No documents match the current filter</p>
          </div>
        )}

        {/* Legend */}
        <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
          <h4 className="font-medium flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Document Requirements Legend
          </h4>
          <div className="grid md:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-2">
              <Badge variant="destructive" className="text-xs">Required</Badge>
              <span>Mandatory for this category</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">Optional</Badge>
              <span>Recommended but not mandatory</span>
            </div>
            <div className="flex items-center gap-2">
              <Badge className="text-xs bg-purple-100 text-purple-800">
                <Languages className="h-3 w-3 mr-1" />
                Translation
              </Badge>
              <span>Should be translated to local language</span>
            </div>
          </div>
        </div>

        {/* Reset */}
        <Button variant="outline" onClick={reset} className="w-full">
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset Checklist
        </Button>
      </CardContent>
    </Card>
  );
}

export default DocumentationChecklistGenerator;
