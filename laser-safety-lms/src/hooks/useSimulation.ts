'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { SimulationState, SimulationDecision, SimulationVariable } from '@/types/lms';
import { getSimulation, saveSimulationState } from '@/lib/data/moduleLoader';

interface SimulationStep {
  id: string;
  title: string;
  description: string;
  scenario: string;
  variables: SimulationVariable[];
  options: SimulationOption[];
  feedback?: string;
}

interface SimulationOption {
  id: string;
  label: string;
  description: string;
  correct: boolean;
  feedback: string;
  nextStepId?: string;
}

interface UseSimulationReturn {
  state: SimulationState | null;
  currentStep: SimulationStep | null;
  steps: SimulationStep[];
  isLoading: boolean;
  error: Error | null;
  progress: number;
  score: number;
  isComplete: boolean;
  updateVariable: (name: string, value: number) => void;
  makeDecision: (optionId: string) => void;
  goToStep: (stepId: string) => void;
  restart: () => void;
  saveProgress: () => Promise<void>;
}

/**
 * Hook for managing interactive simulation state
 * 
 * @param scenarioId - The ID of the simulation scenario
 * @returns Simulation state and control functions
 * 
 * @example
 * ```tsx
 * function LaserSafetySimulation({ scenarioId }: { scenarioId: string }) {
 *   const { 
 *     currentStep, 
 *     state, 
 *     updateVariable, 
 *     makeDecision,
 *     progress,
 *     isComplete 
 *   } = useSimulation(scenarioId);
 *   
 *   if (isComplete) return <SimulationResults score={score} />;
 *   
 *   return (
 *     <div>
 *       <ProgressBar value={progress} />
 *       <ScenarioCard step={currentStep} />
 *       <VariableControls 
 *         variables={currentStep?.variables}
 *         values={state?.variables}
 *         onChange={updateVariable}
 *       />
 *       <DecisionOptions 
 *         options={currentStep?.options}
 *         onSelect={makeDecision}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useSimulation(scenarioId: string): UseSimulationReturn {
  const [state, setState] = useState<SimulationState | null>(null);
  const [steps, setSteps] = useState<SimulationStep[]>([]);
  const [currentStep, setCurrentStep] = useState<SimulationStep | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    const loadSimulation = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const simulationData = await getSimulation(scenarioId);
        setSteps(simulationData.steps);
        
        // Initialize state
        const initialState: SimulationState = {
          id: `sim-${Date.now()}`,
          scenarioId,
          userId: 'anonymous',
          currentStep: 0,
          variables: simulationData.initialVariables || {},
          completedSteps: [],
          decisions: [],
          startedAt: new Date().toISOString(),
          lastActiveAt: new Date().toISOString(),
        };
        
        setState(initialState);
        setCurrentStep(simulationData.steps[0] || null);
        startTimeRef.current = Date.now();
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load simulation'));
      } finally {
        setIsLoading(false);
      }
    };

    loadSimulation();
  }, [scenarioId]);

  const progress = state && steps.length > 0
    ? Math.round((state.completedSteps.length / steps.length) * 100)
    : 0;

  const updateVariable = useCallback((name: string, value: number) => {
    setState(prev => {
      if (!prev) return null;
      return {
        ...prev,
        variables: {
          ...prev.variables,
          [name]: value,
        },
        lastActiveAt: new Date().toISOString(),
      };
    });
  }, []);

  const makeDecision = useCallback((optionId: string) => {
    if (!currentStep || !state) return;

    const selectedOption = currentStep.options.find(opt => opt.id === optionId);
    if (!selectedOption) return;

    const decision: SimulationDecision = {
      stepId: currentStep.id,
      decision: optionId,
      timestamp: new Date().toISOString(),
      correct: selectedOption.correct,
      feedback: selectedOption.feedback,
    };

    // Update score
    if (selectedOption.correct) {
      setScore(prev => prev + 100 / steps.length);
    }

    const updatedState: SimulationState = {
      ...state,
      completedSteps: [...state.completedSteps, currentStep.id],
      decisions: [...state.decisions, decision],
      lastActiveAt: new Date().toISOString(),
    };

    // Determine next step
    if (selectedOption.nextStepId) {
      const nextStepIndex = steps.findIndex(s => s.id === selectedOption.nextStepId);
      updatedState.currentStep = nextStepIndex >= 0 ? nextStepIndex : state.currentStep;
      const nextStep = steps[nextStepIndex];
      setCurrentStep(nextStep || null);
    } else if (state.completedSteps.length + 1 >= steps.length) {
      // Simulation complete
      updatedState.completedAt = new Date().toISOString();
      updatedState.score = Math.round(score + (selectedOption.correct ? 100 / steps.length : 0));
      setIsComplete(true);
    } else {
      // Move to next sequential step
      const currentIndex = steps.findIndex(s => s.id === currentStep.id);
      const nextStep = steps[currentIndex + 1];
      if (nextStep) {
        updatedState.currentStep = currentIndex + 1;
        setCurrentStep(nextStep);
      }
    }

    setState(updatedState);
  }, [currentStep, state, steps, score]);

  const goToStep = useCallback((stepId: string) => {
    const stepIndex = steps.findIndex(s => s.id === stepId);
    const step = steps[stepIndex];
    if (step && state) {
      setCurrentStep(step);
      setState({
        ...state,
        currentStep: stepIndex,
        lastActiveAt: new Date().toISOString(),
      });
    }
  }, [steps, state]);

  const restart = useCallback(() => {
    if (!steps.length) return;
    
    const initialState: SimulationState = {
      id: `sim-${Date.now()}`,
      scenarioId,
      userId: 'anonymous',
      currentStep: 0,
      variables: {},
      completedSteps: [],
      decisions: [],
      startedAt: new Date().toISOString(),
      lastActiveAt: new Date().toISOString(),
    };
    
    setState(initialState);
    setCurrentStep(steps[0] || null);
    setScore(0);
    setIsComplete(false);
    startTimeRef.current = Date.now();
  }, [scenarioId, steps]);

  const saveProgress = useCallback(async () => {
    if (state) {
      await saveSimulationState(state);
    }
  }, [state]);

  return {
    state,
    currentStep,
    steps,
    isLoading,
    error,
    progress,
    score,
    isComplete,
    updateVariable,
    makeDecision,
    goToStep,
    restart,
    saveProgress,
  };
}
