/**
 * Common Types for Laser Safety LMS Interactive Components
 * Course 2: FDA Compliance & Course 3: Bio-Hazards
 */

// ============================================
// FDA Course Types (Course 2)
// ============================================

export interface TimelineMilestone {
  year: string;
  title: string;
  shortDesc: string;
  fullDesc: string;
  significance: string;
  keyProvision?: string;
  keyElements?: string[];
  keyChanges?: string[];
}

export interface LaserClassInfo {
  class: string;
  level: string;
  color: string;
  description: string;
  accessibleEmission: string;
  hazardPotential: string;
  examples: string[];
  keyPoint: string;
}

export interface FDAFormOption {
  id: string;
  text: string;
  correct: boolean;
}

export interface FDARequirement {
  id: string;
  text: string;
  correctClasses: string[];
}

export interface HarmonizationItem {
  fdaClass: string;
  iecClass: string;
  differences: string;
}

export interface ReportType {
  type: string;
  when: string;
  deadline: string;
  cfr: string;
  form: string;
}

export interface JurisdictionNode {
  id: string;
  label: string;
  fullName: string;
  role: string;
  responsibility: string;
  parent?: string;
  contact?: {
    address?: string;
    phone?: string;
    email?: string;
  };
}

export interface VarianceFormField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'select' | 'date' | 'checkbox';
  required: boolean;
  options?: string[];
  placeholder?: string;
  helpText?: string;
}

// ============================================
// Bio-Hazards Course Types (Course 3)
// ============================================

export interface EyeStructure {
  id: string;
  name: string;
  icon: string;
  description: string;
  vulnerable: string;
  effects: string;
  tags: string[];
  path: string;
  labelX: number;
  labelY: number;
}

export interface WavelengthRegion {
  name: string;
  max: number;
  color: string;
  penetration: 'cornea' | 'lens' | 'retina' | 'vitreous';
}

export interface FitzpatrickSkinType {
  type: string;
  name: string;
  characteristics: string;
  risk: string;
  riskPosition: number; // 0-100 for risk meter
  hazards: string[];
  precautions: string;
  gradient: [string, string];
  textColor: string;
}

export interface MPETableEntry {
  wavelength: number;
  wavelengthRange: string;
  eyeMPE: number;
  skinMPE: number;
  unit: string;
  exposureDuration: string;
  correctionFactors?: string[];
}

export interface CorrectionFactor {
  id: string;
  name: string;
  symbol: string;
  description: string;
  appliesTo: string;
  formula: string;
  example: string;
  color: string;
}

export interface EyewearSpecification {
  id: string;
  wavelengthRange: string;
  odRating: string;
  application: string;
  laserTypes: string[];
}

export interface BurnClassification {
  degree: string;
  name: string;
  description: string;
  appearance: string;
  healing: string;
  laserContext: string;
  color: string;
}

// ============================================
// Common Component Types
// ============================================

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  component: React.ReactNode;
  isValid: () => boolean;
}

export interface QuizOption {
  id: string;
  text: string;
  correct: boolean;
  feedback?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

export interface ComponentBaseProps {
  className?: string;
  onComplete?: () => void;
  onProgress?: (progress: number) => void;
}

export interface AnimationConfig {
  duration?: number;
  ease?: number[];
  delay?: number;
}

export type LaserWavelength = number;
export type ExposureDuration = number;
export type PowerUnit = 'mW' | 'W' | 'mJ' | 'J' | 'μW';
