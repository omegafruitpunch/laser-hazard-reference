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
    id: "aircraft-illumination",
    title: "Aircraft Laser Illumination",
    description: "Respond to a report of laser illumination of an aircraft",
    initialSituation: "You are the Laser Safety Officer at an outdoor laser show. ATC calls to report that a commercial aircraft has reported being illuminated by your laser system while on approach to the nearby airport.",
    phases: [
      {
        id: "phase-1",
        title: "Initial Response",
        description: "First 30 seconds - Critical actions",
        situation: "ATC reports aircraft illumination. The aircraft is 5 miles out on final approach. What is your FIRST action?",
        options: [
          {
            id: "opt-1",
            label: "Immediately terminate all laser operations",
            consequence: "CORRECT: Immediate termination is required when aircraft report illumination. This is the safest and most appropriate first response.",
            isCorrect: true,
            impact: "positive",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-2",
            label: "Continue operations and ask ATC for more details",
            consequence: "CRITICAL ERROR: Never continue operations when an aircraft reports illumination. Safety requires immediate termination.",
            isCorrect: false,
            impact: "critical",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-3",
            label: "Check if the aircraft is within your NOTAM area",
            consequence: "INCORRECT: Checking boundaries wastes critical time. Terminate first, investigate later.",
            isCorrect: false,
            impact: "negative",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-4",
            label: "Redirect lasers away from the aircraft's reported position",
            consequence: "PARTIAL: While better than continuing, this still risks further illumination. Full termination is required.",
            isCorrect: false,
            impact: "neutral",
            nextPhaseId: "phase-2",
          },
        ],
      },
      {
        id: "phase-2",
        title: "Notification & Documentation",
        description: "After termination - Required actions",
        situation: "You have terminated laser operations. The aircraft has landed safely. What must you do NEXT?",
        options: [
          {
            id: "opt-1",
            label: "Document the incident and notify FAA within 24 hours",
            consequence: "CORRECT: AC 70-1B requires reporting within 24 hours. Documentation is critical for the investigation.",
            isCorrect: true,
            impact: "positive",
          },
          {
            id: "opt-2",
            label: "Resume operations after 15 minutes",
            consequence: "INCORRECT: Operations cannot resume until the situation is fully assessed and FAA coordination occurs.",
            isCorrect: false,
            impact: "negative",
          },
          {
            id: "opt-3",
            label: "Wait to see if FAA contacts you",
            consequence: "INCORRECT: You have an affirmative duty to report. Waiting for FAA contact is a violation.",
            isCorrect: false,
            impact: "negative",
          },
          {
            id: "opt-4",
            label: "Check if the pilot was actually injured",
            consequence: "PARTIAL: While pilot welfare matters, your reporting obligation exists regardless of injury status.",
            isCorrect: false,
            impact: "neutral",
          },
        ],
      },
    ],
  },
  {
    id: "equipment-malfunction",
    title: "Equipment Malfunction",
    description: "Respond to a laser equipment malfunction during show",
    initialSituation: "During a scheduled laser show, one of your laser projectors begins to malfunction. The galvo scanners are erratic and the beam is not following the programmed pattern. The beam is now scanning into uncontrolled airspace.",
    phases: [
      {
        id: "phase-1",
        title: "Malfunction Response",
        description: "Equipment malfunction in progress",
        situation: "A laser projector is malfunctioning with erratic beam movement into uncontrolled airspace. What do you do?",
        options: [
          {
            id: "opt-1",
            label: "Hit emergency stop and power off the malfunctioning unit",
            consequence: "CORRECT: Immediate emergency stop is required. This isolates the hazard quickly.",
            isCorrect: true,
            impact: "positive",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-2",
            label: "Try to regain control via software",
            consequence: "CRITICAL ERROR: Software recovery attempts waste time when hardware malfunction is occurring.",
            isCorrect: false,
            impact: "critical",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-3",
            label: "Continue the show with other projectors",
            consequence: "CRITICAL ERROR: Continuing while one unit is malfunctioning is unacceptable. Stop all operations.",
            isCorrect: false,
            impact: "critical",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-4",
            label: "Physically block the beam path",
            consequence: "DANGEROUS: Never attempt to block a Class 4 laser beam directly. Use emergency stop systems only.",
            isCorrect: false,
            impact: "critical",
            nextPhaseId: "phase-2",
          },
        ],
      },
      {
        id: "phase-2",
        title: "Post-Malfunction Actions",
        description: "After securing the equipment",
        situation: "You have emergency-stopped the malfunctioning laser. The show is halted. What is your next priority?",
        options: [
          {
            id: "opt-1",
            label: "Notify ATC of the malfunction and actions taken",
            consequence: "CORRECT: ATC must be informed of any situation affecting airspace safety, even if quickly resolved.",
            isCorrect: true,
            impact: "positive",
          },
          {
            id: "opt-2",
            label: "Attempt to repair the unit and restart the show",
            consequence: "INCORRECT: Do not restart without understanding the root cause and ensuring all systems are safe.",
            isCorrect: false,
            impact: "negative",
          },
          {
            id: "opt-3",
            label: "Continue without the malfunctioning unit",
            consequence: "PARTIAL: Only continue if you can verify the malfunction didn't affect other systems and ATC agrees.",
            isCorrect: false,
            impact: "neutral",
          },
          {
            id: "opt-4",
            label: "Document the incident for maintenance records",
            consequence: "PARTIAL: Documentation is important but notifying ATC takes priority for safety.",
            isCorrect: false,
            impact: "neutral",
          },
        ],
      },
    ],
  },
  {
    id: "weather-deterioration",
    title: "Weather Deterioration",
    description: "Respond to deteriorating weather during operations",
    initialSituation: "You are 30 minutes into a scheduled 2-hour laser show. Weather conditions are deteriorating faster than forecasted. Visibility has dropped to 2 miles and cloud ceiling is now at 1,500 feet.",
    phases: [
      {
        id: "phase-1",
        title: "Weather Assessment",
        description: "Conditions below minima",
        situation: "Visibility is 2 miles and ceiling 1,500 ft, both below your NOTAM minimums. What action do you take?",
        options: [
          {
            id: "opt-1",
            label: "Immediately terminate operations due to weather",
            consequence: "CORRECT: When conditions fall below NOTAM minimums, operations must stop immediately.",
            isCorrect: true,
            impact: "positive",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-2",
            label: "Continue and monitor for further deterioration",
            consequence: "CRITICAL ERROR: Never continue when below minimums. Weather can worsen unpredictably.",
            isCorrect: false,
            impact: "critical",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-3",
            label: "Reduce laser power by 50% and continue",
            consequence: "INCORRECT: Reduced power doesn't address the reduced visibility affecting aircraft detection.",
            isCorrect: false,
            impact: "negative",
            nextPhaseId: "phase-2",
          },
          {
            id: "opt-4",
            label: "Check with ATC if they can still see the beams",
            consequence: "PARTIAL: ATC input is valuable but you are responsible for compliance with your NOTAM.",
            isCorrect: false,
            impact: "neutral",
            nextPhaseId: "phase-2",
          },
        ],
      },
      {
        id: "phase-2",
        title: "Coordination",
        description: "After termination decision",
        situation: "You have terminated due to weather. What is your next action?",
        options: [
          {
            id: "opt-1",
            label: "Notify ATC and advise when operations may resume",
            consequence: "CORRECT: ATC coordination is essential. They need to know the status of your operations.",
            isCorrect: true,
            impact: "positive",
          },
          {
            id: "opt-2",
            label: "Wait for the weather to improve without notification",
            consequence: "INCORRECT: ATC must be informed of termination and any planned resumption.",
            isCorrect: false,
            impact: "negative",
          },
          {
            id: "opt-3",
            label: "Document the weather data and terminate the show",
            consequence: "PARTIAL: Documentation is good, but ATC notification takes priority.",
            isCorrect: false,
            impact: "neutral",
          },
          {
            id: "opt-4",
            label: "Restart after 30 minutes if conditions look better",
            consequence: "INCORRECT: Restart requires confirming conditions meet minima AND coordinating with ATC.",
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
    setHistory([
      ...history,
      {
        phase: currentPhase.title,
        option: option.label,
        correct: option.isCorrect,
      },
    ]);

    if (!option.nextPhaseId) {
      setCompleted(true);
    }
  };

  const nextPhase = () => {
    if (selectedOption?.nextPhaseId && selectedScenario) {
      const nextIndex = selectedScenario.phases.findIndex((p) => p.id === selectedOption.nextPhaseId);
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
        return "text-green-600 bg-green-50 border-green-200";
      case "negative":
        return "text-red-600 bg-red-50 border-red-200";
      case "critical":
        return "text-red-700 bg-red-100 border-red-300";
      case "neutral":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      default:
        return "text-muted-foreground bg-muted border-gray-200";
    }
  };

  if (!selectedScenario) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">Emergency Response Simulator</h2>
          <p className="text-muted-foreground">Practice emergency response scenarios for outdoor laser operations</p>
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          {emergencyScenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="cursor-pointer hover:border-blue-500 transition-colors"
              onClick={() => startScenario(scenario)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{scenario.title}</CardTitle>
                <CardDescription>{scenario.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{scenario.phases.length} decision points</p>
                <Button className="w-full mt-4">Start Scenario</Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (completed) {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Card>
          <CardContent className="pt-6 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4">Scenario Complete</h2>
            <p className="text-muted-foreground mb-4">
              You answered {correctCount} of {history.length} decisions optimally.
            </p>
            
            <div className="text-left space-y-4 mt-6">
              <h3 className="font-semibold">Your Responses:</h3>
              {history.map((h, idx) => (
                <div
                  key={idx}
                  className={cn(
                    "p-3 rounded-lg border",
                    h.correct ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"
                  )}
                >
                  <div className="text-sm font-medium">{h.phase}</div>
                  <div className="text-sm">{h.option}</div>
                </div>
              ))}
            </div>

            <Button onClick={reset} className="mt-6">
              Return to Scenarios
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Scenario Header */}
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

      {/* Situation Card */}
      <Card>
        <CardHeader>
          <CardTitle>{currentPhase?.title}</CardTitle>
          <CardDescription>{currentPhase?.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="bg-blue-50 p-4 rounded-lg mb-6">
            <p className="text-blue-900">{currentPhase?.situation}</p>
          </div>

          {/* Options */}
          {!selectedOption && currentPhase ? (
            <div className="space-y-3">
              {currentPhase.options.map((option) => (
                <button
                  key={option.id}
                  onClick={() => selectOption(option)}
                  className="w-full p-4 text-left rounded-lg border-2 border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all"
                >
                  {option.label}
                </button>
              ))}
            </div>
          ) : selectedOption ? (
            <div className="space-y-4">
              <div
                className={cn(
                  "p-4 rounded-lg border",
                  getImpactColor(selectedOption.impact)
                )}
              >
                <div className="font-semibold mb-2">
                  {selectedOption.isCorrect ? "✓ Correct Response" : "Response Feedback"}
                </div>
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
          ) : null}
        </CardContent>
      </Card>
    </div>
  );
};

export default EmergencyResponseSimulator;
