"use client";

import React, { useState, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  ChevronRight, 
  ChevronDown, 
  BookOpen, 
  ArrowRight,
  Info,
  ExternalLink,
  Search,
  X
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export interface StandardNode {
  id: string;
  code: string;
  name: string;
  title: string;
  description: string;
  color: string;
  level: number;
  scope?: string[];
  keyRequirements?: string[];
  relationshipToZ1361?: string;
  certificationRelevance?: string[];
  children?: StandardNode[];
  relatedStandards?: string[];
}

export interface StandardsHierarchyVisualizerProps {
  data: StandardNode;
  onStandardSelect?: (standard: StandardNode) => void;
  className?: string;
}

export interface DetailPanelProps {
  standard: StandardNode | null;
  onClose: () => void;
}

// ============================================================================
// Default Data - ANSI Z136 Series
// ============================================================================

export const DEFAULT_Z136_HIERARCHY: StandardNode = {
  id: "z136.1",
  code: "Z136.1",
  name: "ANSI Z136.1",
  title: "Safe Use of Lasers",
  description: "Foundation standard - applies to all laser applications",
  color: "#e94560",
  level: 0,
  scope: [
    "Establishes maximum permissible exposure (MPE) levels",
    "Defines laser hazard classification system",
    "Specifies control measures for all laser classes",
    "Defines Laser Safety Officer responsibilities"
  ],
  keyRequirements: [
    "Hazard evaluation and classification",
    "Control measure implementation",
    "Medical surveillance programs",
    "Training requirements",
    "Standard operating procedures"
  ],
  certificationRelevance: ["CLSO Core Knowledge", "CMLSO Foundation"],
  children: [
    {
      id: "z136.3",
      code: "Z136.3",
      name: "ANSI Z136.3",
      title: "Safe Use of Lasers in Health Care",
      description: "Hospitals, clinics, medical procedures",
      color: "#4CAF50",
      level: 1,
      scope: [
        "Medical laser applications",
        "Surgical procedures",
        "Therapeutic applications",
        "Diagnostic laser use"
      ],
      keyRequirements: [
        "Medical laser safety programs",
        "Surgical team protection",
        "Patient safety protocols",
        "Equipment maintenance requirements"
      ],
      relationshipToZ1361: "Supplements Z136.1 with healthcare-specific requirements",
      certificationRelevance: ["CLSO Medical Specialty", "CMLSO Medical"],
    },
    {
      id: "z136.8",
      code: "Z136.8",
      name: "ANSI Z136.8",
      title: "Safe Use of Lasers in Research, Development, or Testing",
      description: "University labs, research facilities, R&D environments",
      color: "#2196F3",
      level: 1,
      scope: [
        "Research laboratory environments",
        "Development and testing facilities",
        "Educational institutions",
        "Prototype laser systems"
      ],
      keyRequirements: [
        "Alignment procedures",
        "Beam control in lab settings",
        "Non-beam hazard management",
        "Temporary laser installations"
      ],
      relationshipToZ1361: "Addresses unique hazards of research environments",
      certificationRelevance: ["CLSO Research Specialty"],
    },
    {
      id: "z136.10",
      code: "Z136.10",
      name: "ANSI Z136.10",
      title: "Safe Use of Lasers in Entertainment",
      description: "Shows, displays, audience exposure",
      color: "#9C27B0",
      level: 1,
      scope: [
        "Laser light shows",
        "Entertainment venues",
        "Audience scanning applications",
        "Mobile laser displays"
      ],
      keyRequirements: [
        "Audience exposure calculations",
        "Scan failure safety systems",
        "Venue safety assessment",
        "Operator competency requirements"
      ],
      relationshipToZ1361: "Works with E1.46 for entertainment-specific controls",
      certificationRelevance: ["CLSO Entertainment Specialty"],
      relatedStandards: ["ANSI E1.46"],
    },
    {
      id: "z136.6",
      code: "Z136.6",
      name: "ANSI Z136.6",
      title: "Safe Use of Lasers Outdoors",
      description: "Open air operations, aviation coordination",
      color: "#00BCD4",
      level: 1,
      scope: [
        "Outdoor laser operations",
        "Aviation safety coordination",
        "Atmospheric effects",
        "Outdoor event safety"
      ],
      keyRequirements: [
        "FAA coordination procedures",
        "Beam termination requirements",
        "Airspace analysis",
        "Weather considerations"
      ],
      relationshipToZ1361: "Extends indoor requirements to outdoor environments",
      certificationRelevance: ["CLSO Outdoor Specialty"],
    },
    {
      id: "z136.9",
      code: "Z136.9",
      name: "ANSI Z136.9",
      title: "Safe Use of Lasers in Manufacturing",
      description: "Industrial laser applications, manufacturing environments",
      color: "#FF9800",
      level: 1,
      scope: [
        "Material processing",
        "Cutting and welding",
        "Marking and engraving",
        "Quality control applications"
      ],
      keyRequirements: [
        "Enclosure requirements",
        "Production environment controls",
        "Maintenance safety",
        "Robotic laser systems"
      ],
      relationshipToZ1361: "Industrial-specific implementations of general requirements",
      certificationRelevance: ["CLSO Industrial Specialty"],
    },
  ],
};

// ============================================================================
// Main Component
// ============================================================================

export function StandardsHierarchyVisualizer({
  data = DEFAULT_Z136_HIERARCHY,
  onStandardSelect,
  className,
}: StandardsHierarchyVisualizerProps) {
  const [selectedStandard, setSelectedStandard] = useState<StandardNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set([data.id]));
  const [searchQuery, setSearchQuery] = useState("");

  const toggleNode = useCallback((nodeId: string) => {
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  }, []);

  const handleSelect = useCallback((node: StandardNode) => {
    setSelectedStandard(node);
    onStandardSelect?.(node);
  }, [onStandardSelect]);

  const expandAll = useCallback(() => {
    const allIds = new Set<string>();
    const collectIds = (node: StandardNode) => {
      allIds.add(node.id);
      node.children?.forEach(collectIds);
    };
    collectIds(data);
    setExpandedNodes(allIds);
  }, [data]);

  const collapseAll = useCallback(() => {
    setExpandedNodes(new Set([data.id]));
  }, [data]);

  // Filter nodes based on search
  const filterNodes = (node: StandardNode): StandardNode | null => {
    const matchesSearch = 
      searchQuery === "" ||
      node.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      node.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (matchesSearch) return node;

    if (node.children) {
      const filteredChildren = node.children
        .map(filterNodes)
        .filter((n): n is StandardNode => n !== null);
      
      if (filteredChildren.length > 0) {
        return { ...node, children: filteredChildren };
      }
    }

    return null;
  };

  const filteredData = searchQuery ? filterNodes(data) : data;

  return (
    <div className={cn("grid grid-cols-1 lg:grid-cols-3 gap-6", className)}>
      {/* Tree View */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div>
              <CardTitle className="text-lg flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                ANSI Z136 Series Hierarchy
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Click any standard to view details
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={expandAll}>
                Expand All
              </Button>
              <Button variant="outline" size="sm" onClick={collapseAll}>
                Collapse All
              </Button>
            </div>
          </div>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search standards..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-muted border border-border text-sm"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
        </CardHeader>

        <CardContent>
          {filteredData ? (
            <div className="space-y-2">
              <TreeNode
                node={filteredData}
                expandedNodes={expandedNodes}
                selectedId={selectedStandard?.id}
                onToggle={toggleNode}
                onSelect={handleSelect}
                level={0}
              />
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No standards found matching &quot;{searchQuery}&quot;
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detail Panel */}
      <DetailPanel standard={selectedStandard} onClose={() => setSelectedStandard(null)} />
    </div>
  );
}

// ============================================================================
// Tree Node Component
// ============================================================================

interface TreeNodeProps {
  node: StandardNode;
  expandedNodes: Set<string>;
  selectedId?: string;
  onToggle: (id: string) => void;
  onSelect: (node: StandardNode) => void;
  level: number;
}

function TreeNode({ node, expandedNodes, selectedId, onToggle, onSelect, level }: TreeNodeProps) {
  const isExpanded = expandedNodes.has(node.id);
  const isSelected = selectedId === node.id;
  const hasChildren = node.children && node.children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-all",
          "hover:bg-muted/50",
          isSelected && "bg-primary/10 border border-primary/30",
          level === 0 && "bg-muted/30"
        )}
        style={{ marginLeft: level * 24 }}
        onClick={() => onSelect(node)}
      >
        {hasChildren ? (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggle(node.id);
            }}
            className="p-1 rounded hover:bg-muted"
          >
            {isExpanded ? (
              <ChevronDown className="w-4 h-4" />
            ) : (
              <ChevronRight className="w-4 h-4" />
            )}
          </button>
        ) : (
          <div className="w-6" />
        )}

        <div
          className="w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: node.color }}
        />

        <div className="flex-grow">
          <div className="font-medium flex items-center gap-2">
            {node.name}
            {level === 0 && (
              <Badge variant="secondary" className="text-xs">Foundation</Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground">{node.title}</div>
        </div>

        <ArrowRight className={cn(
          "w-4 h-4 transition-opacity",
          isSelected ? "opacity-100 text-primary" : "opacity-0"
        )} />
      </div>

      {hasChildren && isExpanded && (
        <div className="mt-1">
          {node.children!.map((child) => (
            <TreeNode
              key={child.id}
              node={child}
              expandedNodes={expandedNodes}
              selectedId={selectedId}
              onToggle={onToggle}
              onSelect={onSelect}
              level={level + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// Detail Panel Component
// ============================================================================

function DetailPanel({ standard, onClose }: DetailPanelProps) {
  if (!standard) {
    return (
      <Card className="h-fit">
        <CardContent className="flex flex-col items-center justify-center py-12 text-center">
          <Info className="w-12 h-12 text-muted-foreground mb-4" />
          <p className="text-muted-foreground">
            Select a standard from the hierarchy to view detailed information
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div
                className="w-4 h-4 rounded-full"
                style={{ backgroundColor: standard.color }}
              />
              <Badge variant="outline">{standard.code}</Badge>
            </div>
            <CardTitle className="text-xl">{standard.title}</CardTitle>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded hover:bg-muted"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <p className="text-sm text-muted-foreground">{standard.description}</p>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Scope Section */}
        {standard.scope && (
          <div>
            <h4 className="font-semibold mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4" />
              Scope
            </h4>
            <ul className="space-y-1">
              {standard.scope.map((item, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Key Requirements */}
        {standard.keyRequirements && (
          <div>
            <h4 className="font-semibold mb-2">Key Requirements</h4>
            <ul className="space-y-1">
              {standard.keyRequirements.map((req, i) => (
                <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary">•</span>
                  {req}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Relationship to Z136.1 */}
        {standard.relationshipToZ1361 && (
          <div className="p-3 bg-muted rounded-lg">
            <h4 className="font-semibold mb-1 text-sm">Relationship to Z136.1</h4>
            <p className="text-sm text-muted-foreground">{standard.relationshipToZ1361}</p>
          </div>
        )}

        {/* Certification Relevance */}
        {standard.certificationRelevance && (
          <div>
            <h4 className="font-semibold mb-2">Certification Relevance</h4>
            <div className="flex flex-wrap gap-2">
              {standard.certificationRelevance.map((cert) => (
                <Badge key={cert} variant="secondary" className="text-xs">
                  {cert}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Related Standards */}
        {standard.relatedStandards && (
          <div>
            <h4 className="font-semibold mb-2">Related Standards</h4>
            <div className="flex flex-wrap gap-2">
              {standard.relatedStandards.map((std) => (
                <Badge key={std} variant="outline" className="text-xs">
                  {std}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default StandardsHierarchyVisualizer;
