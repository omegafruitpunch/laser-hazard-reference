"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { 
  FileText, 
  ClipboardCheck, 
  Award,
  Shield,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Download,
  Printer,
  Calendar,
  User,
  Building,
  FileCheck,
  GraduationCap
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

interface ComplianceItem {
  id: string;
  category: string;
  requirement: string;
  standard: string;
  frequency: string;
  responsible: string;
  documentation: string;
}

interface DocumentationTemplate {
  id: string;
  name: string;
  description: string;
  requiredFields: string[];
  applicableTo: string[];
}

interface CertificationBody {
  name: string;
  accreditation: string;
  scope: string[];
  contact: string;
}

// ============================================================================
// Data Constants
// ============================================================================

const COMPLIANCE_MATRIX: ComplianceItem[] = [
  {
    id: "comp-1",
    category: "Product Certification",
    requirement: "FDA Product Report Submission",
    standard: "21 CFR 1002.10",
    frequency: "Initial + Annual for Class IIIb/IV",
    responsible: "Manufacturer",
    documentation: "FDA Form 3632, Product Report"
  },
  {
    id: "comp-2",
    category: "Product Certification",
    requirement: "Certification and Identification Labels",
    standard: "21 CFR 1040.10(g)",
    frequency: "Per product",
    responsible: "Manufacturer",
    documentation: "Label designs and placement records"
  },
  {
    id: "comp-3",
    category: "Demonstration Variance",
    requirement: "FDA Variance Application",
    standard: "21 CFR 1010.4",
    frequency: "Per show type",
    responsible: "Show Producer/Operator",
    documentation: "FDA Form 3147"
  },
  {
    id: "comp-4",
    category: "Demonstration Variance",
    requirement: "Advance FDA Notification",
    standard: "Laser Light Show Guidance",
    frequency: "30 days before show",
    responsible: "Operator",
    documentation: "Written notification with show details"
  },
  {
    id: "comp-5",
    category: "Workplace Safety",
    requirement: "Laser Safety Officer Designation",
    standard: "ANSI Z136.1 Section 3",
    frequency: "Ongoing",
    responsible: "Employer",
    documentation: "LSO appointment letter"
  },
  {
    id: "comp-6",
    category: "Workplace Safety",
    requirement: "Standard Operating Procedures",
    standard: "ANSI Z136.1 Section 5.2",
    frequency: "Annual review",
    responsible: "LSO",
    documentation: "Written SOPs with approval signatures"
  },
  {
    id: "comp-7",
    category: "Workplace Safety",
    requirement: "Personnel Training Records",
    standard: "ANSI Z136.1 Section 5.2.4",
    frequency: "Initial + Annual refresher",
    responsible: "LSO/Employer",
    documentation: "Training certificates, sign-in sheets"
  },
  {
    id: "comp-8",
    category: "Medical Surveillance",
    requirement: "Pre-Placement Eye Exams",
    standard: "ANSI Z136.1 Section 6.1",
    frequency: "Pre-employment for Class 3B/4",
    responsible: "Employer",
    documentation: "Medical examination reports"
  },
  {
    id: "comp-9",
    category: "Medical Surveillance",
    requirement: "Incident Investigation",
    standard: "ANSI Z136.1 Section 3.3",
    frequency: "As needed",
    responsible: "LSO",
    documentation: "Incident reports, corrective actions"
  },
  {
    id: "comp-10",
    category: "Entertainment Specific",
    requirement: "Audience Scanning Calculations",
    standard: "ANSI E1.46 Section 5",
    frequency: "Per configuration",
    responsible: "Entertainment LSO",
    documentation: "MPE calculations, measurement records"
  },
  {
    id: "comp-11",
    category: "Entertainment Specific",
    requirement: "FAA Notification (Outdoor)",
    standard: "14 CFR 91.11",
    frequency: "Per outdoor event",
    responsible: "Operator",
    documentation: "FAA Form 7140-1 or notification letter"
  },
  {
    id: "comp-12",
    category: "State/Local",
    requirement: "Laser Device Registration",
    standard: "Varies by state",
    frequency: "Annual",
    responsible: "Owner/Operator",
    documentation: "Registration certificates"
  }
];

const DOCUMENTATION_TEMPLATES: DocumentationTemplate[] = [
  {
    id: "temp-1",
    name: "Laser Safety Officer Appointment",
    description: "Official designation of LSO with authority and responsibilities",
    requiredFields: [
      "LSO name and qualifications",
      "Scope of authority",
      "Effective date",
      "Management signature"
    ],
    applicableTo: ["All laser facilities"]
  },
  {
    id: "temp-2",
    name: "Standard Operating Procedure (SOP)",
    description: "Detailed procedures for safe laser operation",
    requiredFields: [
      "Scope and applicability",
      "Responsibilities",
      "Step-by-step procedures",
      "Emergency procedures",
      "Required PPE",
      "Approval signatures"
    ],
    applicableTo: ["Class 3B and 4 lasers"]
  },
  {
    id: "temp-3",
    name: "Hazard Evaluation Report",
    description: "Documentation of laser hazard analysis",
    requiredFields: [
      "Laser specifications",
      "Classification determination",
      "NOHD calculations",
      "Controlled area designation",
      "Required controls"
    ],
    applicableTo: ["All laser installations"]
  },
  {
    id: "temp-4",
    name: "Training Record",
    description: "Documentation of personnel laser safety training",
    requiredFields: [
      "Employee name",
      "Training date",
      "Training content",
      "Instructor name",
      "Competency assessment",
      "Signatures"
    ],
    applicableTo: ["All laser personnel"]
  },
  {
    id: "temp-5",
    name: "Pre-Show Safety Checklist",
    description: "Entertainment laser pre-performance verification",
    requiredFields: [
      "Equipment inspection",
      "Alignment verification",
      "Safety system test",
      "E-stop function check",
      "Operator signature"
    ],
    applicableTo: ["Entertainment laser shows"]
  },
  {
    id: "temp-6",
    name: "Incident Report",
    description: "Documentation of laser-related incidents",
    requiredFields: [
      "Date, time, location",
      "Persons involved",
      "Incident description",
      "Immediate actions",
      "Root cause analysis",
      "Corrective actions"
    ],
    applicableTo: ["All facilities (when incident occurs)"]
  }
];

const CERTIFICATION_BODIES: CertificationBody[] = [
  {
    name: "Board of Laser Safety (BLS)",
    accreditation: "ANSI/ISO/IEC 17024",
    scope: ["CLSO - Certified Laser Safety Officer", "CMLSO - Certified Medical Laser Safety Officer"],
    contact: "www.lasersafety.org"
  },
  {
    name: "FDA CDRH",
    accreditation: "Federal Agency",
    scope: ["Product Report Acknowledgment", "Variance Approval"],
    contact: "www.fda.gov/radiation-emitting-products"
  },
  {
    name: "ANSI",
    accreditation: "Standards Developer",
    scope: ["Z136 Series Standards", "E1.46 Entertainment Standard"],
    contact: "www.ansi.org"
  }
];

// ============================================================================
// Main Component
// ============================================================================

export function Module4_Compliance_Docs() {
  const [activeTab, setActiveTab] = useState<"matrix" | "templates" | "certification">("matrix");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentationTemplate | null>(null);
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  const categories = Array.from(new Set(COMPLIANCE_MATRIX.map(item => item.category)));
  
  const filteredItems = selectedCategory
    ? COMPLIANCE_MATRIX.filter(item => item.category === selectedCategory)
    : COMPLIANCE_MATRIX;

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardCheck className="w-6 h-6 text-primary" />
            Module 8.4: Compliance Documentation
          </h2>
          <p className="text-muted-foreground mt-1">
            Standards Compliance Matrix and Documentation Requirements
          </p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          <FileText className="w-4 h-4 mr-1" />
          Documentation Focus
        </Badge>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 border-b border-border pb-1">
        {[
          { id: "matrix", label: "Compliance Matrix", icon: Shield },
          { id: "templates", label: "Document Templates", icon: FileText },
          { id: "certification", label: "Third-Party Certification", icon: Award }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-t-lg text-sm font-medium transition-colors",
              activeTab === tab.id 
                ? "bg-primary text-primary-foreground" 
                : "hover:bg-muted"
            )}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === "matrix" && (
        <div className="space-y-6">
          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                selectedCategory === null ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
              )}
            >
              All Categories
            </button>
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-colors",
                  selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-muted hover:bg-muted/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Compliance Table */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary" />
                  Standards Compliance Matrix
                </CardTitle>
                <div className="text-sm text-muted-foreground">
                  {checkedItems.size} of {filteredItems.length} checked
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold w-8"></th>
                      <th className="text-left py-3 px-4 font-semibold">Category</th>
                      <th className="text-left py-3 px-4 font-semibold">Requirement</th>
                      <th className="text-left py-3 px-4 font-semibold">Standard</th>
                      <th className="text-left py-3 px-4 font-semibold">Frequency</th>
                      <th className="text-left py-3 px-4 font-semibold">Responsible</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => (
                      <tr 
                        key={item.id} 
                        className={cn(
                          "border-b border-border/50 last:border-0 hover:bg-muted/50",
                          checkedItems.has(item.id) && "bg-green-500/5"
                        )}
                      >
                        <td className="py-3 px-4">
                          <Checkbox 
                            checked={checkedItems.has(item.id)}
                            onCheckedChange={() => toggleCheck(item.id)}
                          />
                        </td>
                        <td className="py-3 px-4">
                          <Badge variant="outline">{item.category}</Badge>
                        </td>
                        <td className="py-3 px-4 font-medium">{item.requirement}</td>
                        <td className="py-3 px-4">
                          <code className="bg-muted px-2 py-0.5 rounded text-xs">{item.standard}</code>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{item.frequency}</td>
                        <td className="py-3 px-4">
                          <Badge variant="secondary">{item.responsible}</Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* Progress Summary */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <CheckCircle2 className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Compliance Checklist Progress</div>
                    <div className="text-sm text-muted-foreground">
                      Track your organization's compliance documentation
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-primary">
                    {Math.round((checkedItems.size / filteredItems.length) * 100)}%
                  </div>
                  <div className="text-sm text-muted-foreground">Complete</div>
                </div>
              </div>
              <div className="mt-4 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${(checkedItems.size / filteredItems.length) * 100}%` }}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === "templates" && (
        <div className="space-y-6">
          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {DOCUMENTATION_TEMPLATES.map(template => (
              <Card 
                key={template.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedTemplate?.id === template.id && "ring-2 ring-primary"
                )}
                onClick={() => setSelectedTemplate(template)}
              >
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="w-5 h-5 text-primary" />
                    </div>
                    <div className="flex-grow">
                      <CardTitle className="text-base">{template.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{template.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1">
                    {template.applicableTo.map((app, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{app}</Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Template Detail */}
          {selectedTemplate && (
            <Card className="border-l-4 border-l-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <FileText className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle>{selectedTemplate.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-muted-foreground">{selectedTemplate.description}</p>
                
                <div>
                  <h4 className="font-semibold mb-2">Required Fields:</h4>
                  <ul className="space-y-2">
                    {selectedTemplate.requiredFields.map((field, i) => (
                      <li key={i} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                        <span>{field}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-semibold mb-2">Applicable To:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.applicableTo.map((app, i) => (
                      <Badge key={i} variant="secondary">{app}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-2">
                <Button variant="outline" className="flex-1">
                  <Printer className="w-4 h-4 mr-2" />
                  Print Template
                </Button>
                <Button variant="outline" className="flex-1">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </CardFooter>
            </Card>
          )}
        </div>
      )}

      {activeTab === "certification" && (
        <div className="space-y-6">
          {/* Certification Bodies */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {CERTIFICATION_BODIES.map((body, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="p-2 bg-primary/10 rounded-lg w-fit mb-2">
                    <Award className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">{body.name}</CardTitle>
                  <Badge variant="outline">{body.accreditation}</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="text-sm font-semibold mb-2">Certification Scope:</h4>
                    <ul className="space-y-1">
                      {body.scope.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                          <CheckCircle2 className="w-3 h-3 text-green-500 mt-1 shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-primary">
                    <ExternalLink className="w-4 h-4" />
                    <span>{body.contact}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CLSO/CMLSO Information */}
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-amber-500" />
                CLSO/CMLSO Certification
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">
                The Certified Laser Safety Officer (CLSO) and Certified Medical Laser Safety Officer 
                (CMLSO) certifications are professional credentials that demonstrate competency in 
                laser safety. These certifications are accredited by ANSI/ISO/IEC 17024.
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">CLSO Requirements</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Bachelor's degree or equivalent experience</li>
                    <li>• 3 years laser safety experience</li>
                    <li>• Pass comprehensive examination</li>
                    <li>• Continuing education (CECs)</li>
                    <li>• Recertification every 3 years</li>
                  </ul>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg">
                  <h4 className="font-semibold mb-2">CMLSO Requirements</h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Healthcare or technical background</li>
                    <li>• Medical laser experience</li>
                    <li>• Pass specialized examination</li>
                    <li>• Clinical competency</li>
                    <li>• Recertification every 3 years</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Record Keeping */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Record Keeping Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Personnel Records
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Training certificates (retain duration of employment + 3 years)</li>
                    <li>• Pre-placement eye exams (confidential medical)</li>
                    <li>• Incident exposure records (30 years)</li>
                    <li>• SOP acknowledgments</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Facility Records
                  </h4>
                  <ul className="text-sm space-y-1 text-muted-foreground">
                    <li>• Laser inventory and classification</li>
                    <li>• Hazard evaluation reports</li>
                    <li>• Inspection and maintenance logs</li>
                    <li>• Variance documentation (entertainment)</li>
                    <li>• FDA product reports (manufacturers)</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default Module4_Compliance_Docs;
