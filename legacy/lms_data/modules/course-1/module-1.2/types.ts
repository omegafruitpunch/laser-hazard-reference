// Type definitions for Module 1.2: Laser Classification System

export interface LaserClass {
  id: string;
  name: string;
  classNumber: number;
  subtitle: string;
  maxPowerCW: string;
  hazardDescription: string;
  keyCharacteristics: string[];
  requirements: {
    engineering: string[];
    administrative: string[];
    ppe: string[];
  };
  aelNote?: string;
  color: string;
  icon: string;
}

export interface ClassificationScenario {
  id: string;
  laserName: string;
  wavelength: string;
  power: string;
  divergence?: string;
  pulseInfo?: string;
  intendedUse: string;
  correctClass: string;
  hints: string[];
  explanation: string;
}

export interface ControlMeasure {
  id: string;
  name: string;
  description: string;
  applicableClasses: string[];
  category: 'engineering' | 'administrative' | 'ppe';
  icon: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface SortingItem {
  id: string;
  name: string;
  description: string;
  correctClass: string;
}
