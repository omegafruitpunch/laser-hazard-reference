// Type definitions for Module 1.1: Introduction to Laser Hazards

export interface ModulePhase {
  id: string;
  title: string;
  duration: number; // minutes
  type: 'warmup' | 'core' | 'practice' | 'challenge';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface LaserProperty {
  id: string;
  name: string;
  description: string;
  icon: string;
  comparison: {
    laser: string;
    conventional: string;
  };
}

export interface HazardInfo {
  id: string;
  type: 'eye' | 'skin' | 'fire';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  wavelengthRange?: string;
  mechanism: string;
}

export interface WavelengthRegion {
  id: string;
  name: string;
  range: string;
  color: string;
  hazardType: string;
  targetStructure: string;
  mpeNote?: string;
}
