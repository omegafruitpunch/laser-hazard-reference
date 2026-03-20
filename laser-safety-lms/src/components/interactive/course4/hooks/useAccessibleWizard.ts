"use client";

import { useState, useCallback, useRef, KeyboardEvent } from "react";
import { useAccessibilitySettings } from "@/hooks/useAccessibilitySettings";

export interface WizardStep {
  id: string;
  label: string;
  description?: string;
  isValid?: () => boolean;
}

export interface UseAccessibleWizardOptions {
  steps: WizardStep[];
  onComplete?: () => void;
  onStepChange?: (stepIndex: number) => void;
  allowSkip?: boolean;
}

export interface UseAccessibleWizardReturn {
  // State
  currentStep: number;
  totalSteps: number;
  currentStepData: WizardStep;
  isFirstStep: boolean;
  isLastStep: boolean;
  canProceed: boolean;
  
  // Navigation
  goToStep: (step: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  reset: () => void;
  
  // Progress
  progress: number;
  
  // Keyboard
  handleStepKeyDown: (event: KeyboardEvent<HTMLElement>) => void;
  stepContentRef: React.RefObject<HTMLDivElement | null>;
  
  // ARIA
  getStepListAriaAttributes: () => Record<string, string | number | boolean | undefined>;
  getStepAriaAttributes: (stepIndex: number) => Record<string, string | number | boolean | undefined>;
  getStepContentAriaAttributes: () => Record<string, string | number | boolean | undefined>;
  
  // Live region
  announceStepChange: (stepLabel: string) => void;
}

/**
 * Hook for accessible multi-step wizards with keyboard navigation
 * WCAG 2.2 AA compliant - supports screen readers and keyboard users
 */
export function useAccessibleWizard(
  options: UseAccessibleWizardOptions
): UseAccessibleWizardReturn {
  const { steps, onComplete, onStepChange, allowSkip = false } = options;
  const { announceToScreenReader } = useAccessibilitySettings();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([0]));
  const stepContentRef = useRef<HTMLDivElement>(null);
  const wizardId = useRef(`wizard-${Math.random().toString(36).substr(2, 9)}`);

  const totalSteps = steps.length;
  const currentStepData = steps[currentStep];
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;
  const canProceed = currentStepData?.isValid?.() ?? true;
  const progress = ((currentStep + 1) / totalSteps) * 100;

  // Announce step changes
  const announceStepChange = useCallback(
    (stepLabel: string) => {
      announceToScreenReader(
        `Step ${currentStep + 1} of ${totalSteps}: ${stepLabel}`,
        "polite"
      );
    },
    [currentStep, totalSteps, announceToScreenReader]
  );

  // Navigation handlers
  const goToStep = useCallback(
    (step: number) => {
      const clampedStep = Math.max(0, Math.min(step, totalSteps - 1));
      
      // Only allow visiting visited steps or next step unless allowSkip is true
      if (!allowSkip && !visitedSteps.has(clampedStep) && clampedStep > currentStep + 1) {
        return;
      }

      setCurrentStep(clampedStep);
      setVisitedSteps((prev) => new Set([...prev, clampedStep]));
      onStepChange?.(clampedStep);
      announceStepChange(steps[clampedStep].label);
      
      // Focus the step content for screen readers
      setTimeout(() => {
        stepContentRef.current?.focus();
      }, 100);
    },
    [totalSteps, allowSkip, visitedSteps, currentStep, steps, onStepChange, announceStepChange]
  );

  const goToNext = useCallback(() => {
    if (isLastStep) {
      onComplete?.();
    } else if (canProceed) {
      goToStep(currentStep + 1);
    }
  }, [isLastStep, canProceed, currentStep, onComplete, goToStep]);

  const goToPrevious = useCallback(() => {
    if (!isFirstStep) {
      goToStep(currentStep - 1);
    }
  }, [isFirstStep, currentStep, goToStep]);

  const reset = useCallback(() => {
    setCurrentStep(0);
    setVisitedSteps(new Set([0]));
    onStepChange?.(0);
    announceToScreenReader("Wizard reset to beginning", "polite");
  }, [onStepChange, announceToScreenReader]);

  // Keyboard navigation
  const handleStepKeyDown = useCallback(
    (event: KeyboardEvent<HTMLElement>) => {
      const { key, ctrlKey } = event;

      switch (key) {
        case "Tab":
          // Allow natural tab flow but announce if leaving wizard
          break;

        case "ArrowRight":
          if (ctrlKey) {
            event.preventDefault();
            goToNext();
          }
          break;

        case "ArrowLeft":
          if (ctrlKey) {
            event.preventDefault();
            goToPrevious();
          }
          break;

        case "Home":
          if (ctrlKey) {
            event.preventDefault();
            goToStep(0);
          }
          break;

        case "End":
          if (ctrlKey) {
            event.preventDefault();
            goToStep(totalSteps - 1);
          }
          break;
      }
    },
    [goToNext, goToPrevious, goToStep, totalSteps]
  );

  // ARIA attributes for step list
  const getStepListAriaAttributes = useCallback(() => {
    return {
      role: "tablist",
      "aria-label": "Wizard steps",
      "aria-orientation": "horizontal" as const,
    };
  }, []);

  // ARIA attributes for individual steps
  const getStepAriaAttributes = useCallback(
    (stepIndex: number) => {
      const step = steps[stepIndex];
      const isCurrent = stepIndex === currentStep;
      const isVisited = visitedSteps.has(stepIndex);
      const isDisabled = !allowSkip && !isVisited && stepIndex > currentStep + 1;

      return {
        id: `${wizardId.current}-step-${stepIndex}`,
        role: "tab",
        "aria-selected": isCurrent,
        "aria-disabled": isDisabled,
        "aria-controls": `${wizardId.current}-panel-${stepIndex}`,
        tabIndex: isCurrent ? 0 : -1,
        "aria-label": `${step.label}${step.description ? `, ${step.description}` : ""}${
          isVisited ? ", visited" : ""
        }${isCurrent ? ", current step" : ""}`,
      };
    },
    [steps, currentStep, visitedSteps, allowSkip]
  );

  // ARIA attributes for step content panel
  const getStepContentAriaAttributes = useCallback(() => {
    return {
      id: `${wizardId.current}-panel-${currentStep}`,
      role: "tabpanel",
      "aria-labelledby": `${wizardId.current}-step-${currentStep}`,
      tabIndex: -1,
    };
  }, [currentStep]);

  return {
    currentStep,
    totalSteps,
    currentStepData,
    isFirstStep,
    isLastStep,
    canProceed,
    goToStep,
    goToNext,
    goToPrevious,
    reset,
    progress,
    handleStepKeyDown,
    stepContentRef,
    getStepListAriaAttributes,
    getStepAriaAttributes,
    getStepContentAriaAttributes,
    announceStepChange,
  };
}

export default useAccessibleWizard;
