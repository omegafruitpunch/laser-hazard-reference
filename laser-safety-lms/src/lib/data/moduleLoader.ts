/**
 * Module Content Loader
 * 
 * Handles dynamic loading of module content, simulations, and calculators.
 * Supports lazy loading for performance optimization.
 */

import { Module, Phase, Component, SimulationState, CalculatorType } from '@/types/lms';
import { courses } from '@/data/courses';

// Cache for loaded modules
const moduleCache = new Map<string, Module>();
const simulationCache = new Map<string, SimulationData>();
const calculatorCache = new Map<string, CalculatorType>();

interface SimulationData {
  id: string;
  steps: SimulationStep[];
  initialVariables: Record<string, number>;
}

interface SimulationStep {
  id: string;
  title: string;
  description: string;
  scenario: string;
  variables: Array<{
    name: string;
    min: number;
    max: number;
    step: number;
    default: number;
    unit?: string;
  }>;
  options: Array<{
    id: string;
    label: string;
    description: string;
    correct: boolean;
    feedback: string;
    nextStepId?: string;
  }>;
}

const SIMULATION_STORAGE_KEY = 'laser-lms-simulation-states';

/**
 * Get a module by course and module ID
 */
export async function getModuleById(courseId: string, moduleId: string): Promise<Module | null> {
  const cacheKey = `${courseId}-${moduleId}`;
  
  // Check cache first
  if (moduleCache.has(cacheKey)) {
    return moduleCache.get(cacheKey)!;
  }

  // Find in courses data
  const course = courses.find(c => c.id === courseId);
  if (!course) return null;

  const module = course.modules.find(m => m.id === moduleId);
  if (!module) return null;

  // Enrich module with phases and components
  const enrichedModule: Module = {
    ...module,
    courseId,
    order: module.order || 0,
    phases: (module.phases || createDefaultPhases(module)) as Phase[],
    components: (module.components || []) as Component[],
    knowledgeNodes: module.knowledgeNodes || [],
    prerequisites: module.prerequisites || [],
  };

  // Cache the result
  moduleCache.set(cacheKey, enrichedModule);
  
  return enrichedModule;
}

/**
 * Get all modules for a course
 */
export async function getModulesByCourse(courseId: string): Promise<Module[]> {
  const course = courses.find(c => c.id === courseId);
  if (!course) return [];

  const modules = await Promise.all(
    course.modules.map(m => getModuleById(courseId, m.id))
  );

  return modules.filter((m): m is Module => m !== null);
}

/**
 * Get module content (phases and components)
 */
export async function getModuleContent(moduleId: string): Promise<{
  phases: Phase[];
  components: Component[];
}> {
  // This would typically fetch from an API or CMS
  // For now, return empty arrays that can be populated dynamically
  return {
    phases: [],
    components: [],
  };
}

/**
 * Get a calculator by type
 */
export async function getCalculator(type: string): Promise<CalculatorType> {
  // Check cache first
  if (calculatorCache.has(type)) {
    return calculatorCache.get(type)!;
  }

  // Define calculator configurations
  const calculators: Record<string, CalculatorType> = {
    'hazard-distance': {
      id: 'hazard-distance',
      name: 'NOHD Calculator',
      description: 'Calculate Nominal Ocular Hazard Distance for laser safety',
      category: 'hazard-distance',
      inputs: [
        { name: 'power', label: 'Laser Power', type: 'number', min: 0, step: 0.1, default: 1, unit: 'W', required: true },
        { name: 'divergence', label: 'Beam Divergence', type: 'number', min: 0, step: 0.1, default: 1.5, unit: 'mrad', required: true },
        { name: 'beamDiameter', label: 'Beam Diameter at Aperture', type: 'number', min: 0, step: 0.1, default: 3, unit: 'mm', required: true },
        { name: 'wavelength', label: 'Wavelength', type: 'number', min: 100, max: 10000, step: 1, default: 532, unit: 'nm', required: true },
      ],
      outputs: [
        { name: 'nohd', label: 'NOHD', unit: 'm', description: 'Nominal Ocular Hazard Distance', warningThreshold: 100, dangerThreshold: 1000 },
        { name: 'mpe', label: 'MPE', unit: 'W/m²', description: 'Maximum Permissible Exposure' },
      ],
      formula: 'nohd = (sqrt(power / (MPE * pi * (divergence/1000)^2 / 4)) - beamDiameter/2000) / 1000',
      notes: 'Calculate the safe viewing distance for laser operations',
    },
    'optical-density': {
      id: 'optical-density',
      name: 'Optical Density Calculator',
      description: 'Calculate required optical density for laser safety eyewear',
      category: 'optical-density',
      inputs: [
        { name: 'beamIrradiance', label: 'Beam Irradiance', type: 'number', min: 0, step: 0.1, default: 100, unit: 'W/m²', required: true },
        { name: 'mpe', label: 'MPE', type: 'number', min: 0, step: 0.001, default: 0.001, unit: 'W/m²', required: true },
      ],
      outputs: [
        { name: 'od', label: 'Required OD', description: 'Required Optical Density', warningThreshold: 3, dangerThreshold: 6 },
        { name: 'attenuation', label: 'Attenuation Factor', description: 'Required attenuation' },
      ],
      formula: 'od = log10(beamIrradiance / mpe); attenuation = 10^od',
      notes: 'Calculate the optical density required for protective eyewear',
    },
    'classification': {
      id: 'classification',
      name: 'Laser Class Calculator',
      description: 'Determine laser classification based on parameters',
      category: 'classification',
      inputs: [
        { name: 'power', label: 'Power', type: 'number', min: 0, step: 0.001, default: 0.005, unit: 'W', required: true },
        { name: 'wavelength', label: 'Wavelength', type: 'number', min: 100, max: 10000, step: 1, default: 532, unit: 'nm', required: true },
        { name: 'pulseDuration', label: 'Pulse Duration', type: 'number', min: 0, step: 1e-9, default: 0, unit: 's', required: false },
      ],
      outputs: [
        { name: 'laserClass', label: 'Laser Class', description: 'Determined laser class' },
        { name: 'ael', label: 'AEL', unit: 'W', description: 'Accessible Emission Limit' },
      ],
      formula: 'laserClass = power < 0.00039 ? "Class 1" : power < 0.001 ? "Class 2" : power < 0.005 ? "Class 3R" : "Class 3B/4"',
      notes: 'Simplified laser classification calculator',
    },
  };

  const calculator = calculators[type];
  if (!calculator) {
    throw new Error(`Calculator not found: ${type}`);
  }

  calculatorCache.set(type, calculator);
  return calculator;
}

/**
 * Execute calculator formula
 */
export function calculate(formula: string, inputs: Record<string, number | string | boolean>, outputName: string): number {
  try {
    // Create a safe evaluation context
    const context: Record<string, number | ((x: number) => number)> = {};
    
    // Convert inputs to numbers
    Object.entries(inputs).forEach(([key, value]) => {
      context[key] = typeof value === 'number' ? value : parseFloat(value as string) || 0;
    });

    // Add Math functions
    const mathFunctions = ['log10', 'log', 'ln', 'sqrt', 'pow', 'abs', 'min', 'max', 'pi'];
    mathFunctions.forEach(fn => {
      if (fn === 'pi') {
        context[fn] = Math.PI;
      } else if (fn === 'log10') {
        context[fn] = Math.log10;
      } else if (fn === 'ln') {
        context[fn] = Math.log;
      } else {
        context[fn] = ((Math as unknown) as Record<string, unknown>)[fn] as (x: number) => number;
      }
    });

    // Replace variable names with their values
    let expression = formula;
    
    // Handle multiple formulas (semicolon separated)
    const formulas = formula.split(';');
    let result = 0;

    for (const f of formulas) {
      const [varName, expr] = f.includes('=') ? f.split('=').map(s => s.trim()) : [outputName, f.trim()];
      
      if (!expr) continue;

      // Replace context variables
      let evalExpr = expr;
      Object.entries(context).forEach(([key, value]) => {
        const regex = new RegExp(`\\b${key}\\b`, 'g');
        evalExpr = evalExpr.replace(regex, String(value));
      });

      // Evaluate safely
      result = Function('"use strict"; return (' + evalExpr + ')')();
      
      // Store result for subsequent formulas
      context[varName] = result;
    }

    return typeof result === 'number' ? result : 0;
  } catch (error) {
    console.error('Calculation error:', error);
    return 0;
  }
}

/**
 * Get a simulation by ID
 */
export async function getSimulation(scenarioId: string): Promise<SimulationData> {
  // Check cache first
  if (simulationCache.has(scenarioId)) {
    return simulationCache.get(scenarioId)!;
  }

  // Define simulation scenarios
  const simulations: Record<string, SimulationData> = {
    'beam-hazard': {
      id: 'beam-hazard',
      steps: [
        {
          id: 'step-1',
          title: 'Initial Assessment',
          description: 'You are setting up a laser display in a venue.',
          scenario: 'A Class 4 laser with 5W output power needs to be positioned. What is the first step?',
          variables: [
            { name: 'power', min: 0.1, max: 10, step: 0.1, default: 5, unit: 'W' },
            { name: 'divergence', min: 0.1, max: 5, step: 0.1, default: 1.5, unit: 'mrad' },
          ],
          options: [
            { id: 'opt-1', label: 'Power on the laser', description: 'Start the laser to test', correct: false, feedback: 'Never power on without calculating hazard distances first!' },
            { id: 'opt-2', label: 'Calculate NOHD', description: 'Calculate Nominal Ocular Hazard Distance', correct: true, feedback: 'Correct! Always calculate hazard distances before setup.' },
            { id: 'opt-3', label: 'Invite audience', description: 'Let people watch the setup', correct: false, feedback: 'Never allow audience access during setup!' },
          ],
        },
        {
          id: 'step-2',
          title: 'Safety Zone Setup',
          description: 'Now you need to establish safety zones.',
          scenario: 'The calculated NOHD is 150 meters. What should you do?',
          variables: [],
          options: [
            { id: 'opt-1', label: 'Mark the NOHD zone', description: 'Establish a 150m controlled area', correct: true, feedback: 'Correct! Establish a controlled area extending beyond the NOHD.' },
            { id: 'opt-2', label: 'Reduce power', description: 'Lower the power output', correct: false, feedback: 'Reducing power might be an option, but you still need to establish safety zones.' },
            { id: 'opt-3', label: 'Add more beams', description: 'Increase visual coverage', correct: false, feedback: 'Adding more beams increases hazards!' },
          ],
        },
      ],
      initialVariables: { power: 5, divergence: 1.5 },
    },
    'audience-scanning': {
      id: 'audience-scanning',
      steps: [
        {
          id: 'step-1',
          title: 'Scanning Assessment',
          description: 'You need to evaluate audience scanning safety.',
          scenario: 'A client wants audience scanning effects. What is required?',
          variables: [
            { name: 'irradiance', min: 0.001, max: 10, step: 0.001, default: 0.01, unit: 'W/m²' },
          ],
          options: [
            { id: 'opt-1', label: 'FDA variance', description: 'File for FDA variance', correct: true, feedback: 'Correct! Audience scanning requires FDA variance.' },
            { id: 'opt-2', label: 'Higher power', description: 'Use more powerful lasers', correct: false, feedback: 'Higher power increases risk!' },
            { id: 'opt-3', label: 'No restrictions', description: 'Scanning is allowed freely', correct: false, feedback: 'Audience scanning has strict regulations!' },
          ],
        },
      ],
      initialVariables: { irradiance: 0.01 },
    },
  };

  const simulation = simulations[scenarioId];
  if (!simulation) {
    throw new Error(`Simulation not found: ${scenarioId}`);
  }

  simulationCache.set(scenarioId, simulation);
  return simulation;
}

/**
 * Save simulation state
 */
export async function saveSimulationState(state: SimulationState): Promise<void> {
  try {
    const stored = localStorage.getItem(SIMULATION_STORAGE_KEY);
    const states: SimulationState[] = stored ? JSON.parse(stored) : [];
    
    // Remove existing state for this simulation if present
    const filtered = states.filter(s => s.id !== state.id);
    filtered.push(state);
    
    localStorage.setItem(SIMULATION_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Failed to save simulation state:', error);
  }
}

/**
 * Load simulation state
 */
export async function loadSimulationState(scenarioId: string, userId: string): Promise<SimulationState | null> {
  try {
    const stored = localStorage.getItem(SIMULATION_STORAGE_KEY);
    if (!stored) return null;
    
    const states: SimulationState[] = JSON.parse(stored);
    return states.find(s => s.scenarioId === scenarioId && s.userId === userId) || null;
  } catch (error) {
    console.error('Failed to load simulation state:', error);
    return null;
  }
}

/**
 * Create default phases for a module
 */
function createDefaultPhases(module: { id: string; title: string; description: string; estimatedMinutes: number }): Phase[] {
  return [
    {
      id: `${module.id}-phase-1`,
      name: 'Learning',
      description: 'Study the module content',
      estimatedMinutes: module.estimatedMinutes,
      components: [
        {
          id: `${module.id}-content`,
          type: 'text',
          title: module.title,
          required: true,
          estimatedMinutes: module.estimatedMinutes,
          content: module.description,
        } as Component,
      ],
      completionCriteria: { type: 'time' },
    },
    {
      id: `${module.id}-phase-2`,
      name: 'Assessment',
      description: 'Complete the knowledge check',
      estimatedMinutes: 10,
      components: [
        {
          id: `${module.id}-quiz`,
          type: 'quiz',
          title: 'Knowledge Check',
          required: true,
          estimatedMinutes: 10,
          questionIds: [],
          passingScore: 70,
          allowRetake: true,
        } as Component,
      ],
      completionCriteria: { type: 'quiz-pass' },
    },
  ];
}

/**
 * Prefetch module content for faster loading
 */
export function prefetchModule(courseId: string, moduleId: string): void {
  // Use requestIdleCallback if available for non-critical prefetching
  const schedule = ((window as unknown) as Record<string, unknown>).requestIdleCallback as typeof window.requestIdleCallback || setTimeout;
  
  (schedule as typeof setTimeout)(() => {
    getModuleById(courseId, moduleId).catch(() => {
      // Silently fail prefetch
    });
  });
}

/**
 * Clear module cache
 */
export function clearModuleCache(): void {
  moduleCache.clear();
  simulationCache.clear();
  calculatorCache.clear();
}
