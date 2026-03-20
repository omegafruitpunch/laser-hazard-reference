'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { Module, Phase, Component, ComponentType, ModuleProgress } from '@/types/lms';
import { getModuleById } from '@/lib/data/moduleLoader';
import { getModuleProgress, saveModuleProgress } from '@/lib/data/progressStorage';

interface ModuleContextState {
  // Current module state
  module: Module | null;
  currentPhase: Phase | null;
  currentComponent: Component | null;
  progress: ModuleProgress | null;
  
  // Navigation
  currentPhaseIndex: number;
  currentComponentIndex: number;
  totalPhases: number;
  totalComponents: number;
  
  // Navigation functions
  goToPhase: (index: number) => void;
  goToComponent: (index: number) => void;
  goToNext: () => void;
  goToPrevious: () => void;
  
  // Progress tracking
  markPhaseComplete: () => void;
  markComponentComplete: () => void;
  markModuleComplete: () => void;
  updateTimeSpent: (minutes: number) => void;
  
  // Component filtering
  getComponentsByType: (type: ComponentType) => Component[];
  
  // Loading state
  isLoading: boolean;
  error: Error | null;
  
  // Refresh
  refresh: () => Promise<void>;
}

const ModuleContext = createContext<ModuleContextState | undefined>(undefined);

interface ModuleProviderProps {
  children: ReactNode;
  courseId: string;
  moduleId: string;
}

/**
 * Module Context Provider
 * 
 * Manages the state of the currently active module including
 * navigation between phases and components, and progress tracking.
 * 
 * @example
 * ```tsx
 * function ModulePage({ courseId, moduleId }: { courseId: string; moduleId: string }) {
 *   return (
 *     <ModuleProvider courseId={courseId} moduleId={moduleId}>
 *       <ModuleViewer />
 *     </ModuleProvider>
 *   );
 * }
 * 
 * function ModuleViewer() {
 *   const { 
 *     module, 
 *     currentPhase, 
 *     currentComponent,
 *     goToNext,
 *     goToPrevious 
 *   } = useModule();
 *   
 *   return (
 *     <div>
 *       <PhaseNavigation />
 *       <ComponentRenderer component={currentComponent} />
 *       <NavigationButtons onNext={goToNext} onPrevious={goToPrevious} />
 *     </div>
 *   );
 * }
 * ```
 */
export function ModuleProvider({ children, courseId, moduleId }: ModuleProviderProps) {
  const [module, setModule] = useState<Module | null>(null);
  const [progress, setProgress] = useState<ModuleProgress | null>(null);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [currentComponentIndex, setCurrentComponentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const loadModule = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [moduleData, progressData] = await Promise.all([
        getModuleById(courseId, moduleId),
        getModuleProgress(courseId, moduleId),
      ]);

      setModule(moduleData);
      setProgress(progressData);

      // Restore saved position if available
      if (progressData?.phasesCompleted.length) {
        const completedCount = progressData.phasesCompleted.length;
        if (completedCount < (moduleData?.phases.length || 0)) {
          setCurrentPhaseIndex(completedCount);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load module'));
    } finally {
      setIsLoading(false);
    }
  }, [courseId, moduleId]);

  useEffect(() => {
    loadModule();
  }, [loadModule]);

  const currentPhase = module?.phases[currentPhaseIndex] || null;
  const currentComponent = currentPhase?.components[currentComponentIndex] || null;
  const totalPhases = module?.phases.length || 0;
  const totalComponents = currentPhase?.components.length || 0;

  const goToPhase = useCallback((index: number) => {
    if (module && index >= 0 && index < module.phases.length) {
      setCurrentPhaseIndex(index);
      setCurrentComponentIndex(0);
    }
  }, [module]);

  const goToComponent = useCallback((index: number) => {
    if (currentPhase && index >= 0 && index < currentPhase.components.length) {
      setCurrentComponentIndex(index);
    }
  }, [currentPhase]);

  const goToNext = useCallback(() => {
    if (currentComponentIndex < totalComponents - 1) {
      setCurrentComponentIndex(prev => prev + 1);
    } else if (currentPhaseIndex < totalPhases - 1) {
      setCurrentPhaseIndex(prev => prev + 1);
      setCurrentComponentIndex(0);
    }
  }, [currentComponentIndex, totalComponents, currentPhaseIndex, totalPhases]);

  const goToPrevious = useCallback(() => {
    if (currentComponentIndex > 0) {
      setCurrentComponentIndex(prev => prev - 1);
    } else if (currentPhaseIndex > 0) {
      const prevPhase = module?.phases[currentPhaseIndex - 1];
      setCurrentPhaseIndex(prev => prev - 1);
      setCurrentComponentIndex(prevPhase?.components.length ? prevPhase.components.length - 1 : 0);
    }
  }, [currentComponentIndex, currentPhaseIndex, module]);

  const markPhaseComplete = useCallback(async () => {
    if (!currentPhase) return;

    const updatedProgress: ModuleProgress = {
      ...progress,
      moduleId,
      status: 'in-progress',
      phasesCompleted: [...(progress?.phasesCompleted || []).filter(id => id !== currentPhase.id), currentPhase.id],
      componentsCompleted: progress?.componentsCompleted || [],
      timeSpent: progress?.timeSpent || 0,
    };

    await saveModuleProgress(courseId, updatedProgress);
    setProgress(updatedProgress);
  }, [courseId, moduleId, currentPhase, progress]);

  const markComponentComplete = useCallback(async () => {
    if (!currentComponent) return;

    const updatedProgress: ModuleProgress = {
      ...progress,
      moduleId,
      status: 'in-progress',
      phasesCompleted: progress?.phasesCompleted || [],
      componentsCompleted: [...(progress?.componentsCompleted || []).filter(id => id !== currentComponent.id), currentComponent.id],
      timeSpent: progress?.timeSpent || 0,
    };

    await saveModuleProgress(courseId, updatedProgress);
    setProgress(updatedProgress);
  }, [courseId, moduleId, currentComponent, progress]);

  const markModuleComplete = useCallback(async () => {
    const updatedProgress: ModuleProgress = {
      ...progress,
      moduleId,
      status: 'completed',
      phasesCompleted: module?.phases.map(p => p.id) || [],
      componentsCompleted: module?.phases.flatMap(p => p.components.map(c => c.id)) || [],
      completedAt: new Date().toISOString(),
      timeSpent: progress?.timeSpent || 0,
    };

    await saveModuleProgress(courseId, updatedProgress);
    setProgress(updatedProgress);
  }, [courseId, moduleId, module, progress]);

  const updateTimeSpent = useCallback(async (minutes: number) => {
    const updatedProgress: ModuleProgress = {
      ...progress,
      moduleId,
      status: progress?.status || 'in-progress',
      phasesCompleted: progress?.phasesCompleted || [],
      componentsCompleted: progress?.componentsCompleted || [],
      timeSpent: (progress?.timeSpent || 0) + minutes,
    };

    await saveModuleProgress(courseId, updatedProgress);
    setProgress(updatedProgress);
  }, [courseId, moduleId, progress]);

  const getComponentsByType = useCallback((type: ComponentType): Component[] => {
    if (!module) return [];
    return module.phases.flatMap(phase => 
      phase.components.filter(component => component.type === type)
    );
  }, [module]);

  const value: ModuleContextState = {
    module,
    currentPhase,
    currentComponent,
    progress,
    currentPhaseIndex,
    currentComponentIndex,
    totalPhases,
    totalComponents,
    goToPhase,
    goToComponent,
    goToNext,
    goToPrevious,
    markPhaseComplete,
    markComponentComplete,
    markModuleComplete,
    updateTimeSpent,
    getComponentsByType,
    isLoading,
    error,
    refresh: loadModule,
  };

  return (
    <ModuleContext.Provider value={value}>
      {children}
    </ModuleContext.Provider>
  );
}

/**
 * Hook to access the ModuleContext
 * 
 * @throws Error if used outside of ModuleProvider
 */
export function useModule(): ModuleContextState {
  const context = useContext(ModuleContext);
  if (context === undefined) {
    throw new Error('useModule must be used within a ModuleProvider');
  }
  return context;
}
