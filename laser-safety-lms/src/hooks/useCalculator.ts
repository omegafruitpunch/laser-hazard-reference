'use client';

import { useState, useCallback, useMemo } from 'react';
import { CalculatorType, CalculatorInput, CalculatorOutput } from '@/types/lms';
import { getCalculator, calculate } from '@/lib/data/moduleLoader';

interface CalculatorValue {
  input: CalculatorInput;
  value: number | string | boolean;
}

interface CalculatorResult {
  output: CalculatorOutput;
  value: number;
  warning?: 'none' | 'warning' | 'danger';
}

interface UseCalculatorReturn {
  calculator: CalculatorType | null;
  inputs: Record<string, number | string | boolean>;
  results: CalculatorResult[];
  isLoading: boolean;
  error: Error | null;
  setInputValue: (name: string, value: number | string | boolean) => void;
  reset: () => void;
  recalculate: () => void;
  isValid: boolean;
  missingRequired: string[];
}

/**
 * Hook for managing laser safety calculator state and computations
 * 
 * @param type - The type of calculator to use
 * @returns Calculator state, results, and control functions
 * 
 * @example
 * ```tsx
 * function NOHDCalculator() {
 *   const { calculator, inputs, results, setInputValue, isValid } = useCalculator('hazard-distance');
 *   
 *   return (
 *     <div>
 *       <h2>{calculator?.name}</h2>
 *       <CalculatorInputs 
 *         inputs={calculator?.inputs}
 *         values={inputs}
 *         onChange={setInputValue}
 *       />
 *       {isValid && <CalculatorResults results={results} />}
 *     </div>
 *   );
 * }
 * ```
 */
export function useCalculator(type: string): UseCalculatorReturn {
  const [calculator, setCalculator] = useState<CalculatorType | null>(null);
  const [inputs, setInputs] = useState<Record<string, number | string | boolean>>({});
  const [results, setResults] = useState<CalculatorResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  // Load calculator on mount
  useState(() => {
    const loadCalculator = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getCalculator(type);
        setCalculator(data);
        
        // Initialize inputs with defaults
        const initialInputs: Record<string, number | string | boolean> = {};
        data.inputs.forEach(input => {
          initialInputs[input.name] = input.default ?? 
            (input.type === 'number' ? 0 : input.type === 'boolean' ? false : '');
        });
        setInputs(initialInputs);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load calculator'));
      } finally {
        setIsLoading(false);
      }
    };

    loadCalculator();
  });

  const missingRequired = useMemo(() => {
    if (!calculator) return [];
    
    return calculator.inputs
      .filter(input => input.required && (inputs[input.name] === undefined || inputs[input.name] === ''))
      .map(input => input.name);
  }, [calculator, inputs]);

  const isValid = missingRequired.length === 0;

  const computeResults = useCallback(() => {
    if (!calculator || !isValid) return;

    const computedResults: CalculatorResult[] = calculator.outputs.map(output => {
      // Perform calculation based on formula
      const value = calculate(calculator.formula, inputs, output.name);
      
      // Determine warning level
      let warning: 'none' | 'warning' | 'danger' = 'none';
      if (output.dangerThreshold !== undefined && value >= output.dangerThreshold) {
        warning = 'danger';
      } else if (output.warningThreshold !== undefined && value >= output.warningThreshold) {
        warning = 'warning';
      }

      return { output, value, warning };
    });

    setResults(computedResults);
  }, [calculator, inputs, isValid]);

  const setInputValue = useCallback((name: string, value: number | string | boolean) => {
    setInputs(prev => ({
      ...prev,
      [name]: value,
    }));
  }, []);

  const reset = useCallback(() => {
    if (!calculator) return;
    
    const initialInputs: Record<string, number | string | boolean> = {};
    calculator.inputs.forEach(input => {
      initialInputs[input.name] = input.default ?? 
        (input.type === 'number' ? 0 : input.type === 'boolean' ? false : '');
    });
    setInputs(initialInputs);
    setResults([]);
  }, [calculator]);

  const recalculate = useCallback(() => {
    computeResults();
  }, [computeResults]);

  return {
    calculator,
    inputs,
    results,
    isLoading,
    error,
    setInputValue,
    reset,
    recalculate,
    isValid,
    missingRequired,
  };
}
