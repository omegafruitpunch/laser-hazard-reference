"use client";

import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Brain, 
  Target, 
  BarChart3, 
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  BookOpen,
  Lightbulb,
  RotateCcw
} from "lucide-react";

// ============================================================================
// Types & Interfaces
// ============================================================================

export type ConfidenceLevel = "none" | "low" | "medium" | "high";

export interface KnowledgeTopic {
  id: string;
  name: string;
  category: string;
  description: string;
  importance: "critical" | "important" | "supplementary";
  resources: string[];
}

export interface KnowledgeAssessment {
  topicId: string;
  confidence: ConfidenceLevel;
}

export interface GapAnalysisResult {
  strongAreas: { topic: KnowledgeTopic; confidence: ConfidenceLevel }[];
  weakAreas: { topic: KnowledgeTopic; confidence: ConfidenceLevel }[];
  gaps: { topic: KnowledgeTopic; priority: number }[];
  recommendations: string[];
  overallScore: number;
}

export interface KnowledgeGapAnalyzerProps {
  topics?: KnowledgeTopic[];
  onComplete?: (result: GapAnalysisResult) => void;
  onGeneratePlan?: (result: GapAnalysisResult) => void;
  className?: string;
}

// ============================================================================
// Default Topics - CLSO/CMLSO Knowledge Areas
// ============================================================================

export const DEFAULT_KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  // Fundamentals
  { id: "laser-physics", name: "Laser Physics & Principles", category: "Fundamentals", description: "Basic principles of laser operation, coherence, monochromaticity", importance: "critical", resources: ["Course 1 Module 1", "ANSI Z136.1 Section 4.1"] },
  { id: "beam-properties", name: "Beam Properties & Propagation", category: "Fundamentals", description: "Divergence, irradiance, beam profiles, Gaussian beams", importance: "critical", resources: ["Course 1 Module 2", "Beam Propagation Calculations"] },
  { id: "classification", name: "Laser Classification System", category: "Fundamentals", description: "Class 1, 1M, 2, 2M, 3R, 3B, 4 criteria and requirements", importance: "critical", resources: ["Course 1 Module 3", "ANSI Z136.1 Section 4.1"] },
  
  // Bioeffects
  { id: "ocular-effects", name: "Ocular Bioeffects", category: "Bioeffects", description: "Retinal, corneal, and cataractogenic effects by wavelength", importance: "critical", resources: ["Course 3 Module 1", "ANSI Z136.1 Section 4.2"] },
  { id: "skin-effects", name: "Skin Bioeffects", category: "Bioeffects", description: "Thermal and photochemical skin effects", importance: "important", resources: ["Course 3 Module 2", "ANSI Z136.1 Section 4.2"] },
  { id: "mpe", name: "Maximum Permissible Exposure", category: "Bioeffects", description: "MPE tables, calculations, and application", importance: "critical", resources: ["Course 1 Module 4", "ANSI Z136.1 Tables 5a/5b"] },
  
  // Hazard Analysis
  { id: "hazard-classification", name: "Hazard Classification", category: "Hazard Analysis", description: "Laser class determination and hazard evaluation", importance: "critical", resources: ["Course 1 Module 3", "ANSI Z136.1 Section 4.1"] },
  { id: "nohd", name: "NOHD & NHZ Calculations", category: "Hazard Analysis", description: "Nominal Ocular Hazard Distance and Nominal Hazard Zone", importance: "critical", resources: ["Course 1 Module 5", "ANSI Z136.1 Section 4.4"] },
  { id: "exposure-analysis", name: "Exposure Analysis", category: "Hazard Analysis", description: "Determining exposure durations and viewing conditions", importance: "critical", resources: ["Course 3 Module 3", "ANSI Z136.1 Section 4.3"] },
  
  // Control Measures
  { id: "engineering-controls", name: "Engineering Controls", category: "Control Measures", description: "Interlocks, enclosures, beam stops, remote interlocks", importance: "critical", resources: ["Course 1 Module 6", "ANSI Z136.1 Section 5.1"] },
  { id: "admin-controls", name: "Administrative Controls", category: "Control Measures", description: "SOPs, training, warning signs, access control", importance: "critical", resources: ["Course 1 Module 6", "ANSI Z136.1 Section 5.2"] },
  { id: "ppe", name: "Personal Protective Equipment", category: "Control Measures", description: "Protective eyewear selection, optical density, specifications", importance: "critical", resources: ["Course 3 Module 4", "ANSI Z136.1 Section 5.3"] },
  
  // Standards & Regulations
  { id: "ansi-z136", name: "ANSI Z136 Series", category: "Standards", description: "Structure and navigation of Z136 standards", importance: "critical", resources: ["Course 8 Module 1", "ANSI Z136.1"] },
  { id: "fda-regulations", name: "FDA Regulations (21 CFR 1040)", category: "Standards", description: "FDA laser product requirements and reporting", importance: "important", resources: ["Course 2 Module 1", "21 CFR 1040"] },
  { id: "e146", name: "ANSI E1.46 Entertainment", category: "Standards", description: "Entertainment laser safety requirements", importance: "important", resources: ["Course 8 Module 2", "ANSI E1.46"] },
  { id: "state-regs", name: "State Regulations", category: "Standards", description: "State-specific laser regulations and registration", importance: "important", resources: ["Course 4", "State Regulatory Guide"] },
  
  // LSO Responsibilities
  { id: "lso-authority", name: "LSO Authority & Duties", category: "LSO Role", description: "Executive responsibility, authority, enforcement", importance: "critical", resources: ["Course 1 Module 2", "ANSI Z136.1 Section 3"] },
  { id: "safety-program", name: "Laser Safety Program", category: "LSO Role", description: "Program development, implementation, and maintenance", importance: "critical", resources: ["Course 1 Module 6", "ANSI Z136.1 Section 3"] },
  { id: "incident-investigation", name: "Incident Investigation", category: "LSO Role", description: "Accident investigation and reporting procedures", importance: "important", resources: ["Course 7 Module 4", "ANSI Z136.1 Section 3.3"] },
  
  // Medical
  { id: "medical-surveillance", name: "Medical Surveillance", category: "Medical", description: "Pre-placement exams and post-exposure evaluation", importance: "important", resources: ["Course 1 Module 6", "ANSI Z136.1 Section 6"] },
  { id: "medical-lasers", name: "Medical Laser Safety", category: "Medical", description: "Healthcare-specific requirements and controls", importance: "supplementary", resources: ["Course 8 Module 1", "ANSI Z136.3"] },
  
  // Non-Beam Hazards
  { id: "electrical", name: "Electrical Safety", category: "Non-Beam Hazards", description: "High voltage, capacitors, electrical codes", importance: "important", resources: ["Course 1 Module 6", "ANSI Z136.1 Section 7"] },
  { id: "chemical", name: "Chemical Hazards", category: "Non-Beam Hazards", description: "Dyes, solvents, airborne contaminants", importance: "supplementary", resources: ["Course 1 Module 6", "ANSI Z136.1 Section 7"] },
];

// ============================================================================
// Main Component
// ============================================================================

export function KnowledgeGapAnalyzer({
  topics = DEFAULT_KNOWLEDGE_TOPICS,
  onComplete,
  onGeneratePlan,
  className,
}: KnowledgeGapAnalyzerProps) {
  const [phase, setPhase] = useState<"intro" | "assessment" | "results">("intro");
  const [assessments, setAssessments] = useState<Record<string, ConfidenceLevel>>({});
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

  const categories = Array.from(new Set(topics.map((t) => t.category)));
  const currentCategory = categories[currentCategoryIndex];
  const categoryTopics = topics.filter((t) => t.category === currentCategory);

  const handleSetConfidence = (topicId: string, confidence: ConfidenceLevel) => {
    setAssessments((prev) => ({ ...prev, [topicId]: confidence }));
  };

  const handleNext = () => {
    if (currentCategoryIndex < categories.length - 1) {
      setCurrentCategoryIndex((prev) => prev + 1);
    } else {
      setPhase("results");
    }
  };

  const handlePrevious = () => {
    if (currentCategoryIndex > 0) {
      setCurrentCategoryIndex((prev) => prev - 1);
    }
  };

  const calculateResults = (): GapAnalysisResult => {
    const strongAreas: GapAnalysisResult["strongAreas"] = [];
    const weakAreas: GapAnalysisResult["weakAreas"] = [];
    const gaps: GapAnalysisResult["gaps"] = [];

    topics.forEach((topic) => {
      const confidence = assessments[topic.id] || "none";
      
      if (confidence === "high") {
        strongAreas.push({ topic, confidence });
      } else if (confidence === "none" || confidence === "low") {
        weakAreas.push({ topic, confidence });
        // Calculate priority: critical topics get higher priority
        const importanceScore = topic.importance === "critical" ? 3 : topic.importance === "important" ? 2 : 1;
        const confidenceScore = confidence === "none" ? 3 : 2;
        gaps.push({ topic, priority: importanceScore * confidenceScore });
      }
    });

    // Sort gaps by priority (descending)
    gaps.sort((a, b) => b.priority - a.priority);

    // Calculate overall score
    const totalScore = Object.values(assessments).reduce((acc, conf) => {
      const scores = { none: 0, low: 25, medium: 60, high: 100 };
      return acc + scores[conf];
    }, 0);
    const overallScore = Math.round(totalScore / topics.length);

    // Generate recommendations
    const recommendations: string[] = [];
    const criticalGaps = gaps.filter((g) => g.topic.importance === "critical").slice(0, 3);
    if (criticalGaps.length > 0) {
      recommendations.push(`Focus on critical knowledge areas: ${criticalGaps.map((g) => g.topic.name).join(", ")}`);
    }
    if (gaps.length > topics.length * 0.3) {
      recommendations.push("Significant knowledge gaps detected - comprehensive review recommended");
    }
    if (strongAreas.length < topics.length * 0.2) {
      recommendations.push("Build confidence in foundational topics before advancing");
    }

    return {
      strongAreas,
      weakAreas,
      gaps,
      recommendations,
      overallScore,
    };
  };

  const handleReset = () => {
    setPhase("intro");
    setAssessments({});
    setCurrentCategoryIndex(0);
  };

  // Phase: Intro
  if (phase === "intro") {
    return (
      <Card className={cn("max-w-2xl mx-auto", className)}>
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <Brain className="w-8 h-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Knowledge Gap Analyzer</CardTitle>
          <p className="text-muted-foreground">
            Assess your confidence across all CLSO/CMLSO knowledge areas
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-muted rounded-lg text-center">
              <Target className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">{topics.length}</div>
              <div className="text-xs text-muted-foreground">Knowledge Topics</div>
            </div>
            <div className="p-4 bg-muted rounded-lg text-center">
              <BarChart3 className="w-6 h-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">{categories.length}</div>
              <div className="text-xs text-muted-foreground">Categories</div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-medium">How it works:</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              <li>• Rate your confidence for each knowledge area</li>
              <li>• Identify your strengths and weaknesses</li>
              <li>• Get personalized study recommendations</li>
              <li>• Generate a custom study plan</li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex justify-center">
          <Button onClick={() => setPhase("assessment")} size="lg">
            Start Assessment
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Phase: Assessment
  if (phase === "assessment") {
    const progress = ((currentCategoryIndex + 1) / categories.length) * 100;
    const allAssessed = categoryTopics.every((t) => assessments[t.id]);

    return (
      <div className={cn("max-w-3xl mx-auto space-y-6", className)}>
        {/* Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span>Category {currentCategoryIndex + 1} of {categories.length}</span>
            <span className="text-muted-foreground">{currentCategory}</span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Category Topics */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              {currentCategory}
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-4">
            {categoryTopics.map((topic) => (
              <div key={topic.id} className="p-4 bg-muted/50 rounded-lg">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{topic.name}</span>
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-xs",
                          topic.importance === "critical" && "border-red-400 text-red-400",
                          topic.importance === "important" && "border-amber-400 text-amber-400"
                        )}
                      >
                        {topic.importance}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {topic.description}
                    </p>
                  </div>
                </div>

                {/* Confidence Selection */}
                <div className="flex flex-wrap gap-2 mt-3">
                  {([
                    { value: "none", label: "No Knowledge", color: "bg-red-500/20 text-red-400 border-red-500/30" },
                    { value: "low", label: "Some Understanding", color: "bg-amber-500/20 text-amber-400 border-amber-500/30" },
                    { value: "medium", label: "Comfortable", color: "bg-blue-500/20 text-blue-400 border-blue-500/30" },
                    { value: "high", label: "Expert", color: "bg-green-500/20 text-green-400 border-green-500/30" },
                  ] as const).map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleSetConfidence(topic.id, option.value)}
                      className={cn(
                        "px-3 py-1.5 rounded-lg text-sm font-medium border transition-all",
                        assessments[topic.id] === option.value
                          ? option.color
                          : "bg-card border-border/50 hover:border-primary/50"
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentCategoryIndex === 0}
            >
              Previous
            </Button>
            <Button onClick={handleNext} disabled={!allAssessed}>
              {currentCategoryIndex === categories.length - 1 ? "View Results" : "Next Category"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Phase: Results
  if (phase === "results") {
    const result = calculateResults();

    return (
      <div className={cn("max-w-4xl mx-auto space-y-6", className)}>
        {/* Summary Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Knowledge Gap Analysis</CardTitle>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Overall Score */}
            <div className="text-center">
              <div
                className={cn(
                  "text-6xl font-bold",
                  result.overallScore >= 70 ? "text-green-400" :
                  result.overallScore >= 50 ? "text-amber-400" : "text-red-400"
                )}
              >
                {result.overallScore}%
              </div>
              <p className="text-muted-foreground mt-2">Overall Knowledge Score</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-green-500/10 rounded-lg text-center">
                <CheckCircle2 className="w-6 h-6 mx-auto mb-2 text-green-400" />
                <div className="font-bold text-lg">{result.strongAreas.length}</div>
                <div className="text-xs text-muted-foreground">Strong Areas</div>
              </div>
              <div className="p-4 bg-amber-500/10 rounded-lg text-center">
                <AlertCircle className="w-6 h-6 mx-auto mb-2 text-amber-400" />
                <div className="font-bold text-lg">{result.weakAreas.length}</div>
                <div className="text-xs text-muted-foreground">Areas for Improvement</div>
              </div>
              <div className="p-4 bg-red-500/10 rounded-lg text-center">
                <Target className="w-6 h-6 mx-auto mb-2 text-red-400" />
                <div className="font-bold text-lg">{result.gaps.length}</div>
                <div className="text-xs text-muted-foreground">Knowledge Gaps</div>
              </div>
            </div>

            {/* Top Gaps */}
            {result.gaps.length > 0 && (
              <div>
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Target className="w-5 h-5 text-red-400" />
                  Priority Knowledge Gaps
                </h4>
                <div className="space-y-3">
                  {result.gaps.slice(0, 5).map((gap) => (
                    <div
                      key={gap.topic.id}
                      className="flex items-center justify-between p-3 bg-red-500/5 border border-red-500/20 rounded-lg"
                    >
                      <div>
                        <div className="font-medium">{gap.topic.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {gap.topic.category} • {gap.topic.importance}
                        </div>
                      </div>
                      <Badge variant="destructive">
                        Priority {gap.priority}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            {result.recommendations.length > 0 && (
              <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center gap-2">
                  <Lightbulb className="w-5 h-5 text-primary" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {result.recommendations.map((rec, i) => (
                    <li key={i} className="text-sm flex items-start gap-2">
                      <span className="text-primary">•</span>
                      {rec}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </CardContent>

          <CardFooter className="flex justify-center gap-3">
            <Button variant="outline" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-2" />
              Retake Assessment
            </Button>
            <Button onClick={() => onGeneratePlan?.(result)}>
              Generate Study Plan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return null;
}

export default KnowledgeGapAnalyzer;
