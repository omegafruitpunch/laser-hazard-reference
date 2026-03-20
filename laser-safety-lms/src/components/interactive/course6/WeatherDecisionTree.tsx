"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DecisionNode {
  id: string;
  question: string;
  description?: string;
  options: {
    label: string;
    nextNodeId?: string;
    outcome?: string;
    outcomeType?: "go" | "no-go" | "caution" | "conditional";
    action?: string;
  }[];
}

const decisionTree: DecisionNode[] = [
  {
    id: "start",
    question: "What are the current weather conditions?",
    description: "Evaluate conditions at the laser operation site",
    options: [
      { label: "Clear/VFR conditions", nextNodeId: "visibility" },
      { label: "Marginal conditions", nextNodeId: "marginal" },
      { label: "IMC/Poor conditions", outcome: "NO-GO", outcomeType: "no-go", action: "Laser operations prohibited in IMC conditions. Wait for weather to improve." },
    ],
  },
  {
    id: "visibility",
    question: "Is visibility at least 3 statute miles?",
    description: "FAA minimum for VFR operations",
    options: [
      { label: "Yes, ≥ 3 SM visibility", nextNodeId: "ceiling" },
      { label: "No, < 3 SM visibility", outcome: "NO-GO", outcomeType: "no-go", action: "Visibility below minimum. Operations cannot proceed." },
    ],
  },
  {
    id: "ceiling",
    question: "Is the cloud ceiling at least 2,000 ft AGL?",
    description: "Minimum cloud ceiling for outdoor laser operations",
    options: [
      { label: "Yes, ≥ 2,000 ft ceiling", nextNodeId: "wind" },
      { label: "No, < 2,000 ft ceiling", outcome: "CAUTION", outcomeType: "caution", action: "Low ceiling may require additional ATC coordination. Assess carefully." },
    ],
  },
  {
    id: "marginal",
    question: "What is limiting visibility?",
    description: "Identify the cause of reduced visibility",
    options: [
      { label: "Haze/light fog", nextNodeId: "haze-assessment" },
      { label: "Rain", nextNodeId: "rain-assessment" },
      { label: "Fog/heavy precipitation", outcome: "NO-GO", outcomeType: "no-go", action: "Operations prohibited. Laser beams can scatter in precipitation creating hazards." },
    ],
  },
  {
    id: "haze-assessment",
    question: "Can aircraft be clearly seen at > 2 miles?",
    description: "Observer visibility test",
    options: [
      { label: "Yes, clear aircraft visibility", outcome: "CONDITIONAL GO", outcomeType: "conditional", action: "Operations may proceed with enhanced observer vigilance." },
      { label: "No, poor aircraft visibility", outcome: "NO-GO", outcomeType: "no-go", action: "Cannot maintain required aircraft detection. Operations delayed." },
    ],
  },
  {
    id: "rain-assessment",
    question: "Is precipitation light (< 0.1 in/hr) and intermittent?",
    description: "Assess precipitation intensity",
    options: [
      { label: "Yes, light/intermittent", outcome: "CONDITIONAL GO", outcomeType: "conditional", action: "Operations may proceed. Be alert for intensification." },
      { label: "No, steady or moderate+", outcome: "NO-GO", outcomeType: "no-go", action: "Precipitation too heavy. Laser scatter risk unacceptable." },
    ],
  },
  {
    id: "wind",
    question: "What are the surface winds?",
    description: "Wind conditions at laser site",
    options: [
      { label: "< 25 knots sustained", outcome: "GO", outcomeType: "go", action: "All conditions favorable. Operations may proceed per Letter of Determination." },
      { label: "25-35 knots", outcome: "CAUTION", outcomeType: "caution", action: "High winds may affect equipment stability. Secure all systems and monitor closely." },
      { label: "> 35 knots", outcome: "NO-GO", outcomeType: "no-go", action: "Winds exceed safe operating limits. Secure equipment and delay operations." },
    ],
  },
];

export const WeatherDecisionTree: React.FC = () => {
  const [currentNodeId, setCurrentNodeId] = useState<string>("start");
  const [history, setHistory] = useState<{ nodeId: string; answer: string }[]>([]);

  const currentNode = decisionTree.find((n) => n.id === currentNodeId);

  const handleOption = (option: DecisionNode["options"][0]) => {
    if (option.nextNodeId) {
      setHistory([...history, { nodeId: currentNodeId, answer: option.label }]);
      setCurrentNodeId(option.nextNodeId);
    }
  };

  const handleReset = () => {
    setCurrentNodeId("start");
    setHistory([]);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const prev = history[history.length - 1];
      setHistory(history.slice(0, -1));
      setCurrentNodeId(prev.nodeId);
    }
  };

  const getOutcomeColor = (type?: string) => {
    switch (type) {
      case "go":
        return "bg-green-50 border-green-200 text-green-800";
      case "no-go":
        return "bg-red-50 border-red-200 text-red-800";
      case "caution":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      case "conditional":
        return "bg-blue-50 border-blue-200 text-blue-800";
      default:
        return "bg-muted border-gray-200 text-foreground";
    }
  };

  const getOutcomeIcon = (type?: string) => {
    switch (type) {
      case "go":
        return "✓";
      case "no-go":
        return "✕";
      case "caution":
        return "⚠";
      case "conditional":
        return "⚡";
      default:
        return "?";
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-foreground mb-2">Weather Decision Tree</h2>
        <p className="text-muted-foreground">Go/No-Go decision framework for outdoor laser operations</p>
      </div>

      {/* Progress Path */}
      {history.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground overflow-x-auto pb-2">
          <span>Start</span>
          {history.map((h, idx) => (
            <React.Fragment key={idx}>
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              <span className="whitespace-nowrap">{h.answer}</span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Decision Card */}
      <Card className={cn("border-2", currentNode?.options[0]?.outcome ? getOutcomeColor(currentNode.options[0].outcomeType) : "border-gray-200")}>
        <CardHeader>
          <CardTitle>{currentNode?.question}</CardTitle>
          {currentNode?.description && (
            <CardDescription>{currentNode.description}</CardDescription>
          )}
        </CardHeader>
        <CardContent>
          {/* If this is an outcome node */}
          {currentNode?.options[0]?.outcome ? (
            <div className="text-center py-6">
              <div
                className={cn(
                  "w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold",
                  getOutcomeColor(currentNode.options[0].outcomeType)
                )}
              >
                {getOutcomeIcon(currentNode.options[0].outcomeType)}
              </div>
              <h3 className="text-3xl font-bold mb-4">{currentNode.options[0].outcome}</h3>
              <p className="text-lg mb-6">{currentNode.options[0].action}</p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={handleBack}>
                  Go Back
                </Button>
                <Button onClick={handleReset}>Start Over</Button>
              </div>
            </div>
          ) : (
            /* Decision options */
            <div className="space-y-3">
              {currentNode?.options.map((option, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOption(option)}
                  className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{option.label}</span>
                    <svg className="w-5 h-5 text-muted-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </button>
              ))}
              {history.length > 0 && (
                <Button variant="ghost" onClick={handleBack} className="w-full mt-4">
                  ← Go Back
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reference Info */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Weather Limits Reference</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="p-3 bg-green-50 rounded-lg">
              <div className="font-medium text-green-800">Minimum for GO</div>
              <ul className="text-green-700 mt-1 space-y-1">
                <li>• Visibility ≥ 3 miles</li>
                <li>• Ceiling ≥ 2,000 ft</li>
                <li>• Winds &lt; 25 kts</li>
              </ul>
            </div>
            <div className="p-3 bg-red-50 rounded-lg">
              <div className="font-medium text-red-800">Automatic NO-GO</div>
              <ul className="text-red-700 mt-1 space-y-1">
                <li>• Visibility &lt; 3 miles</li>
                <li>• IMC conditions</li>
                <li>• Winds &gt; 35 kts</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WeatherDecisionTree;
