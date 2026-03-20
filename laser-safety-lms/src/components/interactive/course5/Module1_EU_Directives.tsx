"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Globe, 
  Scale,
  Building2,
  Users,
  FileText,
  CheckCircle2,
  AlertTriangle,
  Info,
  MapPin,
  Flag,
  Landmark,
  BookOpen,
  ChevronRight,
  Download,
  Shield
} from "lucide-react";

// EU Flag colors
const EU_BLUE = "#003399";
const EU_GOLD = "#FFCC00";

interface EUCountry {
  code: string;
  name: string;
  flag: string;
  implementation: string;
  notes: string;
}

const euCountries: EUCountry[] = [
  { code: "DE", name: "Germany", flag: "🇩🇪", implementation: "Full", notes: "BGV B2, strict enforcement" },
  { code: "FR", name: "France", flag: "🇫🇷", implementation: "Full", notes: "INRS guidelines, strong LSO requirements" },
  { code: "IT", name: "Italy", flag: "🇮🇹", implementation: "Regional", notes: "Significant regional variations" },
  { code: "ES", name: "Spain", flag: "🇪🇸", implementation: "Regional", notes: "Autonomous community rules apply" },
  { code: "NL", name: "Netherlands", flag: "🇳🇱", implementation: "Full", notes: "Arbodienst consultation required" },
  { code: "BE", name: "Belgium", flag: "🇧🇪", implementation: "Full", notes: "Regional variations (Flanders/Wallonia)" },
  { code: "AT", name: "Austria", flag: "🇦🇹", implementation: "Full", notes: "ASchG compliance mandatory" },
  { code: "PL", name: "Poland", flag: "🇵🇱", implementation: "Developing", notes: "Evolving regulations" },
  { code: "SE", name: "Sweden", flag: "🇸🇪", implementation: "Full", notes: "Work Environment Authority" },
  { code: "DK", name: "Denmark", flag: "🇩🇰", implementation: "Full", notes: "Arbejdstilsynet guidelines" },
  { code: "FI", name: "Finland", flag: "🇫🇮", implementation: "Full", notes: "Regional State Admin Agency" },
  { code: "PT", name: "Portugal", flag: "🇵🇹", implementation: "Regional", notes: "ACT compliance" },
  { code: "IE", name: "Ireland", flag: "🇮🇪", implementation: "Full", notes: "HSA guidelines" },
  { code: "CZ", name: "Czech Republic", flag: "🇨🇿", implementation: "Full", notes: "SÚJB oversight" },
  { code: "HU", name: "Hungary", flag: "🇭🇺", implementation: "Full", notes: "AHFS regulations" },
];

const keyDirectives = [
  {
    number: "2006/25/EC",
    title: "Optical Radiation Directive",
    description: "Minimum health and safety requirements regarding exposure of workers to artificial optical radiation",
    scope: "Worker protection across all EU member states",
    status: "Active",
    languages: ["BG", "ES", "CS", "DA", "DE", "ET", "EL", "EN", "FR", "GA", "IT", "LV", "LT", "HU", "MT", "NL", "PL", "PT", "RO", "SK", "SL", "FI", "SV"],
  },
  {
    number: "2014/35/EU",
    title: "Low Voltage Directive",
    description: "Electrical equipment designed for use within certain voltage limits",
    scope: "Electrical safety of laser equipment",
    status: "Active",
    languages: ["BG", "ES", "CS", "DA", "DE", "ET", "EL", "EN", "FR", "GA", "IT", "LV", "LT", "HU", "MT", "NL", "PL", "PT", "RO", "SK", "SL", "FI", "SV"],
  },
  {
    number: "2014/30/EU",
    title: "EMC Directive",
    description: "Electromagnetic compatibility requirements",
    scope: "EMC for electronic laser systems",
    status: "Active",
    languages: ["BG", "ES", "CS", "DA", "DE", "ET", "EL", "EN", "FR", "GA", "IT", "LV", "LT", "HU", "MT", "NL", "PL", "PT", "RO", "SK", "SL", "FI", "SV"],
  },
  {
    number: "2019/1926",
    title: "Amending Directive 2006/25/EC",
    description: "Updated exposure limit values based on latest ICNIRP recommendations",
    scope: "Revised MPE values for worker protection",
    status: "Active (2021+)",
    languages: ["BG", "ES", "CS", "DA", "DE", "ET", "EL", "EN", "FR", "GA", "IT", "LV", "LT", "HU", "MT", "NL", "PL", "PT", "RO", "SK", "SL", "FI", "SV"],
  },
];

const harmonizedStandards = [
  { standard: "EN 60825-1", title: "Laser product safety - Part 1", status: "Harmonized", mandate: "CE Marking" },
  { standard: "EN 60825-3", title: "Laser displays and shows", status: "Harmonized", mandate: "Entertainment" },
  { standard: "EN 60825-4", title: "Laser guards", status: "Harmonized", mandate: "Machinery" },
  { standard: "EN 50689", title: "Consumer laser products", status: "Harmonized", mandate: "Consumer" },
];

export function Module1_EU_Directives() {
  const [selectedDirective, setSelectedDirective] = useState<number | null>(0);
  const [activeTab, setActiveTab] = useState<"directives" | "standards" | "countries">("directives");

  return (
    <Card className="w-full border-t-4" style={{ borderTopColor: EU_BLUE }}>
      {/* EU Header Banner */}
      <div className="bg-gradient-to-r from-[#003399] to-[#0047AB] text-white p-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-card/20 flex items-center justify-center">
            <span className="text-2xl">🇪🇺</span>
          </div>
          <div>
            <h2 className="text-lg font-bold">European Union Regulatory Framework</h2>
            <p className="text-sm text-white/80">Laser Safety Directives & Harmonized Standards</p>
          </div>
          <div className="ml-auto hidden md:flex items-center gap-2 text-xs bg-card/10 px-3 py-1 rounded-full">
            <Globe className="h-3 w-3" />
            <span>27 Member States</span>
          </div>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-xl">
              <Landmark className="h-6 w-6" style={{ color: EU_BLUE }} />
              EU Laser Safety Directives
            </CardTitle>
            <CardDescription className="mt-1">
              Understanding the European regulatory landscape for laser products and worker protection
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant={activeTab === "directives" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("directives")}
              className={activeTab === "directives" ? "bg-[#003399] hover:bg-[#002266]" : ""}
            >
              <Scale className="h-4 w-4 mr-1" />
              Directives
            </Button>
            <Button
              variant={activeTab === "standards" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("standards")}
              className={activeTab === "standards" ? "bg-[#003399] hover:bg-[#002266]" : ""}
            >
              <BookOpen className="h-4 w-4 mr-1" />
              Standards
            </Button>
            <Button
              variant={activeTab === "countries" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveTab("countries")}
              className={activeTab === "countries" ? "bg-[#003399] hover:bg-[#002266]" : ""}
            >
              <MapPin className="h-4 w-4 mr-1" />
              Countries
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Directive 2006/25/EC Hero Section */}
        {activeTab === "directives" && (
          <>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="w-16 h-16 rounded-xl bg-[#003399] text-white flex items-center justify-center shrink-0">
                  <Shield className="h-8 w-8" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-[#003399]">Primary Directive</Badge>
                    <span className="text-sm text-muted-foreground">2006/25/EC</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    Minimum health and safety requirements regarding the exposure of workers to risks 
                    arising from physical agents (artificial optical radiation)
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    This directive applies to all EU member states and establishes exposure limit values 
                    (ELVs) for laser radiation based on ICNIRP guidelines. It requires employers to assess 
                    and manage risks from laser exposure in the workplace.
                  </p>
                  <div className="grid md:grid-cols-3 gap-3">
                    <div className="bg-card/70 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Users className="h-4 w-4 text-blue-600" />
                        Who it covers
                      </div>
                      <p className="text-xs text-muted-foreground">All workers in EU member states exposed to artificial optical radiation</p>
                    </div>
                    <div className="bg-card/70 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        Employer duties
                      </div>
                      <p className="text-xs text-muted-foreground">Risk assessment, exposure evaluation, protective measures</p>
                    </div>
                    <div className="bg-card/70 p-3 rounded-lg">
                      <div className="flex items-center gap-2 text-sm font-medium mb-1">
                        <AlertTriangle className="h-4 w-4 text-blue-600" />
                        ELVs
                      </div>
                      <p className="text-xs text-muted-foreground">Maximum permissible exposure levels for eye and skin</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Directives List */}
            <div className="space-y-3">
              <h4 className="font-medium flex items-center gap-2">
                <Scale className="h-4 w-4" />
                Key EU Directives for Laser Safety
              </h4>
              <div className="grid gap-3">
                {keyDirectives.map((directive, index) => (
                  <div
                    key={directive.number}
                    className={`border rounded-lg overflow-hidden transition-all ${
                      selectedDirective === index ? "ring-2 ring-[#003399]" : ""
                    }`}
                  >
                    <button
                      className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors text-left"
                      onClick={() => setSelectedDirective(selectedDirective === index ? null : index)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{directive.number}</span>
                            <Badge variant="outline" className="text-xs">
                              {directive.languages.length} languages
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{directive.title}</p>
                        </div>
                      </div>
                      <ChevronRight className={`h-5 w-5 text-muted-foreground transition-transform ${
                        selectedDirective === index ? "rotate-90" : ""
                      }`} />
                    </button>
                    {selectedDirective === index && (
                      <div className="px-4 pb-4 border-t bg-muted/20">
                        <div className="pt-4 space-y-3">
                          <p className="text-sm">{directive.description}</p>
                          <div className="grid md:grid-cols-2 gap-3">
                            <div className="bg-card p-3 rounded-lg">
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">Scope</span>
                              <p className="text-sm font-medium mt-1">{directive.scope}</p>
                            </div>
                            <div className="bg-card p-3 rounded-lg">
                              <span className="text-xs text-muted-foreground uppercase tracking-wide">Status</span>
                              <p className="text-sm font-medium mt-1">{directive.status}</p>
                            </div>
                          </div>
                          <div>
                            <span className="text-xs text-muted-foreground uppercase tracking-wide">Available in</span>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {directive.languages.map((lang) => (
                                <Badge key={lang} variant="secondary" className="text-xs">{lang}</Badge>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* CE Marking Section */}
            <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl p-6 border">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[#003399] text-white flex items-center justify-center font-bold text-lg">
                  CE
                </div>
                <div>
                  <h4 className="font-semibold">CE Marking Requirements</h4>
                  <p className="text-sm text-muted-foreground">Conformité Européenne - European Conformity</p>
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h5 className="text-sm font-medium">To affix CE marking, laser products must:</h5>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Comply with applicable EU directives</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Meet essential health and safety requirements</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Follow harmonized standards (EN)</span>
                    </li>
                    <li className="flex items-start gap-2 text-sm">
                      <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                      <span>Have technical documentation available</span>
                    </li>
                  </ul>
                </div>
                <div className="bg-card p-4 rounded-lg">
                  <h5 className="text-sm font-medium mb-3">Market Access</h5>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">✓</div>
                      <span className="text-sm">All 27 EU Member States</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">✓</div>
                      <span className="text-sm">EEA Countries (Iceland, Liechtenstein, Norway)</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">✓</div>
                      <span className="text-sm">Turkey (mutual recognition)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Harmonized Standards Tab */}
        {activeTab === "standards" && (
          <div className="space-y-4">
            <div className="bg-blue-50 rounded-lg p-4">
              <h4 className="font-medium flex items-center gap-2 mb-2">
                <BookOpen className="h-4 w-4" />
                Harmonized European Standards (EN)
              </h4>
              <p className="text-sm text-muted-foreground">
                Harmonized standards provide presumption of conformity with EU directives. 
                Using harmonized standards is voluntary but recommended.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-[#003399]">
                    <th className="text-left py-3 px-4 font-semibold">Standard</th>
                    <th className="text-left py-3 px-4 font-semibold">Title</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Mandate</th>
                  </tr>
                </thead>
                <tbody>
                  {harmonizedStandards.map((std) => (
                    <tr key={std.standard} className="border-b hover:bg-muted/30">
                      <td className="py-3 px-4 font-medium text-[#003399]">{std.standard}</td>
                      <td className="py-3 px-4">{std.title}</td>
                      <td className="py-3 px-4">
                        <Badge className="bg-green-100 text-green-800">{std.status}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="outline">{std.mandate}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-3">EN 60825-1 vs IEC 60825-1</h5>
                <Separator className="mb-3" />
                <div className="space-y-2 text-sm">
                  <p><strong>Technical content:</strong> Identical</p>
                  <p><strong>Foreword:</strong> Includes EU-specific information</p>
                  <p><strong>Annex ZA:</strong> References to EU directives</p>
                  <p><strong>Legal status:</strong> Provides presumption of conformity in EU</p>
                </div>
              </div>
              <div className="p-4 border rounded-lg">
                <h5 className="font-medium mb-3">Standard Development Process</h5>
                <Separator className="mb-3" />
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">1</span>
                    <span>IEC develops international standard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">2</span>
                    <span>CENELEC adopts as European standard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">3</span>
                    <span>EU Commission harmonizes the standard</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-xs">4</span>
                    <span>National standards bodies implement</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Countries Tab */}
        {activeTab === "countries" && (
          <div className="space-y-4">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-100">
              <div className="flex items-center gap-2 mb-2">
                <Globe className="h-5 w-5 text-blue-600" />
                <h4 className="font-medium">EU Member State Implementation</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                While EU directives establish minimum requirements, each member state implements them 
                through national legislation. Some countries have additional national requirements.
              </p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
              {euCountries.map((country) => (
                <div key={country.code} className="border rounded-lg p-3 hover:shadow-md transition-shadow bg-card">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{country.flag}</span>
                    <div>
                      <p className="font-medium text-sm">{country.name}</p>
                      <Badge 
                        className={
                          country.implementation === "Full" ? "bg-green-100 text-green-800 text-xs" :
                          country.implementation === "Regional" ? "bg-yellow-100 text-yellow-800 text-xs" :
                          "bg-orange-100 text-orange-800 text-xs"
                        }
                      >
                        {country.implementation}
                      </Badge>
                    </div>
                  </div>
                  <p className="text-xs text-muted-foreground">{country.notes}</p>
                </div>
              ))}
            </div>
            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <h5 className="font-medium text-sm">Important Note</h5>
                  <p className="text-sm text-muted-foreground mt-1">
                    This list is not exhaustive. Always verify current requirements with local authorities 
                    before operating laser shows in any EU member state. Regulations can change and some 
                    countries may have additional requirements not listed here.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Key Takeaways */}
        <div className="bg-gradient-to-r from-slate-50 to-gray-50 rounded-xl p-6 border">
          <h4 className="font-semibold flex items-center gap-2 mb-4">
            <Info className="h-5 w-5 text-blue-600" />
            Key Takeaways for Laser Show Professionals
          </h4>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#003399] text-white flex items-center justify-center text-xs shrink-0">1</div>
                <div>
                  <p className="font-medium text-sm">Worker Protection Directive 2006/25/EC</p>
                  <p className="text-xs text-muted-foreground">Applies to all workers in EU member states exposed to laser radiation</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#003399] text-white flex items-center justify-center text-xs shrink-0">2</div>
                <div>
                  <p className="font-medium text-sm">CE Marking Requirements</p>
                  <p className="text-xs text-muted-foreground">Equipment sold in EU must comply with applicable directives</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#003399] text-white flex items-center justify-center text-xs shrink-0">3</div>
                <div>
                  <p className="font-medium text-sm">Harmonized Standards</p>
                  <p className="text-xs text-muted-foreground">EN 60825 series provides presumption of conformity</p>
                </div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#003399] text-white flex items-center justify-center text-xs shrink-0">4</div>
                <div>
                  <p className="font-medium text-sm">National Variations</p>
                  <p className="text-xs text-muted-foreground">Member states may have additional requirements</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#003399] text-white flex items-center justify-center text-xs shrink-0">5</div>
                <div>
                  <p className="font-medium text-sm">Multilingual Requirements</p>
                  <p className="text-xs text-muted-foreground">Documentation may need translation to local languages</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 rounded-full bg-[#003399] text-white flex items-center justify-center text-xs shrink-0">6</div>
                <div>
                  <p className="font-medium text-sm">Updated MPE Values (2019/1926)</p>
                  <p className="text-xs text-muted-foreground">Revised exposure limits based on latest ICNIRP data</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default Module1_EU_Directives;
