"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface EmergencyScenario {
  id: string;
  title: string;
  description: string;
  initialSituation: string;
  phases: ScenarioPhase[];
}

interface ScenarioPhase {
  id: string;
  title: string;
  description: string;
  situation: string;
  options: EmergencyOption[];
}

interface EmergencyOption {
  id: string;
  label: string;
  consequence: string;
  isCorrect: boolean;
  impact: "positive" | "negative" | "critical" | "neutral";
  nextPhaseId?: string;
}

const emergencyScenarios: EmergencyScenario[] = [
  {
    id: "stage-collapse",
    title: "Stage Structure Collapse",
    description: "Respond to a severe weather event causing partial stage collapse",
    initialSituation: "You are the Event Safety Coordinator for an outdoor music festival. Strong winds have caused part of the main stage roof structure to collapse during final setup. Two riggers are injured - one appears seriously hurt, another with minor injuries. Weather radar shows a severe storm approaching within 20 minutes. 50+ crew members are on site.",
    phases: [
      {
        id: "phase-1",
        title: "Initial Assessment & Command",
        description: "First 2 minutes - Establish command and assess",
        situation: "You arrive at the scene. The stage structure is partially collapsed with debris scattered. One worker is pinned under rigging, another is walking but dazed. Wind is increasing. What is your FIRST action?",
        options: [
          {
            id: "opt-1a",
            label: "Immediately attempt to free the pinned worker",
            consequence: "CRITICAL ERROR: Scene may not be secure. Additional collapse could injure more people including yourself. Always secure the scene first.",
            isCorrect: false,
            impact: "critical",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-1b",
            label: "Declare a major incident, establish command, and call for emergency services",
            consequence: "CORRECT: Establishing command and securing professional help is the priority. This enables coordinated response.",
            isCorrect: true,
            impact: "positive",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-1c",
            label: "Clear all personnel from the stage area and wait for instructions",
            consequence: "PARTIAL: Evacuation is important but delay in declaring incident and establishing command slows professional response.",
            isCorrect: false,
            impact: "neutral",
            nextPhaseId: "phase-2",
          },
        ],
      },
      {
        id: "phase-2",
        title: "Medical Response Coordination",
        description: "EMS is 10 minutes out. Weather deteriorating.",
        situation: "You have established command. EMS has been called (ETA 10 minutes). The pinned worker is conscious but in pain. The dazed worker is sitting down. Storm is now 15 minutes away. What is your next priority?",
        options: [
          {
            id: "opt-2a",
            label: "Wait for EMS to handle all medical issues",
            consequence: "INCORRECT: Time-critical injuries may worsen. First aid should begin while EMS is en route.",
            isCorrect: false,
            impact: "negative",
          },
          {
            id: "opt-2b",
            label: "Begin first aid on the pinned worker while designating others to prepare for storm",
            consequence: "CORRECT: Parallel action - provide immediate medical care while preparing for the approaching storm.",
            isCorrect: true,
            impact: "positive",
          },
          {
            id: "opt-2c",
            label: "Focus entirely on evacuating all personnel due to the storm",
            consequence: "INCORRECT: The injured worker cannot be moved safely without proper equipment. Medical needs are immediate priority.",
            isCorrect: false,
            impact: "negative",
          },
        ],
      },
    ],
  },
  {
    id: "crowd-crush",
    title: "Crowd Crush Emergency",
    description: "Respond to barrier failure causing crowd surge",
    initialSituation: "You are the Safety Coordinator for a major outdoor concert with 15,000 attendees. During the headliner performance, the front barrier fails, causing a crowd surge forward. Multiple people are reporting injuries. Radio channels are congested. Some crowd members are climbing equipment to escape.",
    phases: [
      {
        id: "phase-1",
        title: "Initial Response",
        description: "Chaos at front barrier, multiple casualties",
        situation: "Radio channels are congested with multiple people talking. You can see people injured at the barrier. The band is still playing. What is your FIRST action?",
        options: [
          {
            id: "opt-c1",
            label: "Immediately cut power to the stage and stop the show",
            consequence: "PARTIAL: Stopping the show may be necessary but establishing command and communication is first priority.",
            isCorrect: false,
            impact: "neutral",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-c2",
            label: "Establish unified command, clear radio channels, and declare mass casualty incident",
            consequence: "CORRECT: Command and communication structure must be established before effective action can be taken.",
            isCorrect: true,
            impact: "positive",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-c3",
            label: "Physically enter the crowd to help injured people",
            consequence: "CRITICAL ERROR: Individual action without coordination creates more risk. Command structure is essential.",
            isCorrect: false,
            impact: "critical",
            nextPhaseId: "phase-2",
          },
        ],
      },
      {
        id: "phase-2",
        title: "Triage and Treatment",
        description: "Establish medical response in chaotic environment",
        situation: "You have established command. Police and EMS are arriving. There are approximately 20+ injured people with varying severity. What is your priority for medical response?",
        options: [
          {
            id: "opt-t1",
            label: "Treat the most visibly injured people first",
            consequence: "INCORRECT: Triage requires treating based on severity and survivability, not visibility.",
            isCorrect: false,
            impact: "negative",
          },
          {
            id: "opt-t2",
            label: "Establish triage area, designate medical branch under Operations, and implement START triage",
            consequence: "CORRECT: Structured triage system ensures most lives are saved. Organized approach is essential.",
            isCorrect: true,
            impact: "positive",
          },
          {
            id: "opt-t3",
            label: "Transport the walking wounded first to clear the area",
            consequence: "INCORRECT: Minor injuries are lowest priority. Critical patients need immediate attention.",
            isCorrect: false,
            impact: "negative",
          },
        ],
      },
    ],
  },
];

export const EmergencyResponseSimulator: React.FC = () => {
  const [selectedScenario, setSelectedScenario] = useState<EmergencyScenario | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<EmergencyOption | null>(null);
  const [completed, setCompleted] = useState(false);
  const [history, setHistory] = useState<{ phase: string; option: string; correct: boolean }[]>([]);

  const startScenario = (scenario: EmergencyScenario) => {
    setSelectedScenario(scenario);
    setCurrentPhaseIndex(0);
    setSelectedOption(null);
    setCompleted(false);
    setHistory([]);
  };

  const selectOption = (option: EmergencyOption) => {
    if (!currentPhase) return;
    setSelectedOption(option);
    setHistory([...history, { phase: currentPhase.title, option: option.label, correct: option.isCorrect }]);
    if (!option.nextPhaseId) {
      setCompleted(true);
    }
  };

  const nextPhase = () => {
    if (selectedOption?.nextPhaseId) {
      const nextIndex = selectedScenario!.phases.findIndex((p) => p.id === selectedOption.nextPhaseId);
      if (nextIndex >= 0) {
        setCurrentPhaseIndex(nextIndex);
        setSelectedOption(null);
      }
    }
  };

  const reset = () => {
    setSelectedScenario(null);
    setCurrentPhaseIndex(0);
    setSelectedOption(null);
    setCompleted(false);
    setHistory([]);
  };

  const currentPhase = selectedScenario?.phases[currentPhaseIndex];
  const correctCount = history.filter((h) => h.correct).length;

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case "positive":
        return "bg-green-50 border-green-200 text-green-800";
      case "negative":
        return "bg-red-50 border-red-200 text-red-800";
      case "critical":
        return "bg-red-100 border-red-300 text-red-900";
      case "neutral":
        return "bg-yellow-50 border-yellow-200 text-yellow-800";
      default:
        return "bg-muted border-gray-200 text-foreground";
    }
  };

  if (!selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Emergency Response Simulator</h2>
          <p className="text-muted-foreground">Practice emergency response procedures with branching scenarios</p>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {emergencyScenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => startScenario(scenario)}
            >
              <CardHeader>
                <CardTitle>{scenario.title}</CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{scenario.phases.length} decision points</p>
                <Button className="w-full">Start Scenario</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="pt-6 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4">Scenario Complete</h2>
          <p className="text-muted-foreground mb-4">
            You answered {correctCount} of {history.length} decisions optimally.
          </p>

          <div className="text-left space-y-3 mt-6">
            <h3 className="font-semibold">Your Responses:</h3>
            {history.map((h, idx) => (
              <div
                key={idx}
                className={cn("p-3 rounded-lg border", h.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200")}
              >
                <div className="text-sm font-medium">{h.phase}</div>
                <div className="text-sm text-muted-foreground">{h.option}</div>
              </div>
            ))}
          </div>

          <Button onClick={reset} className="mt-6">
            Return to Scenarios
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-foreground">{selectedScenario.title}</h2>
          <p className="text-sm text-muted-foreground">
            Phase {currentPhaseIndex + 1} of {selectedScenario.phases.length}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={reset}>
          Exit Scenario
        </Button>
      </div>

      {/* Progress */}
      <div className="h-2 bg-gray-200 rounded-full">
        <div
          className="h-full bg-blue-600 rounded-full transition-all"
          style={{ width: `${((currentPhaseIndex + 1) / selectedScenario.phases.length) * 100}%` }}
        />
      </div>

      {/* Situation */}
      <Card>
        <CardHeader>
          <CardTitle>{currentPhase?.title}</CardTitle>
          <CardDescription>{currentPhase?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-900">{currentPhase?.situation}</p>
          </div>

          {!selectedOption ? (
            <div className="space-y-3">
              {currentPhase?.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => selectOption(option)}
                  className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              <div className={cn("p-4 rounded-lg border", getImpactColor(selectedOption.impact))}>
                <div className="font-semibold mb-2">{selectedOption.isCorrect ? "✓ Correct Response" : "Response Feedback"}</div>
                <p>{selectedOption.consequence}</p>
              </div>

              {selectedOption.nextPhaseId ? (
                <Button onClick={nextPhase} className="w-full">
                  Continue to Next Phase
                </Button>
              ) : (
                <Button onClick={() => setCompleted(true)} className="w-full">
                  Complete Scenario
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyResponseSimulator;
