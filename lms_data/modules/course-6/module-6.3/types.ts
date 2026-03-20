/**
 * TypeScript type definitions for Course 6 Module 3 components
 */

export type CalculationMode = 'cw' | 'pulsed' | 'rep_pulsed';

export interface WavelengthRange {
  min: number;
  max: number;
  name: string;
  mpeCW: number; // mW/cm²
  hasVCF: boolean;
  caFormula?: string;
}

export interface CalculationInputs {
  mode: CalculationMode;
  wavelength: number;
  power: number; // Watts
  pulseEnergy: number; // Joules
  pulseDuration: number; // Seconds
  prf: number; // Hz
  beamDivergence: number; // mrad
  beamDiameter: number; // cm
  minElevation: number; // degrees
  maxElevation: number; // degrees
}

export interface CalculationResults {
  nohd: {
    slant: number;
    horizontal: number;
    vertical: number;
  };
  szed: {
    slant: number;
    horizontal: number;
    vertical: number;
  };
  czed: {
    slant: number;
    horizontal: number;
    vertical: number;
  };
  lfed: {
    slant: number;
    horizontal: number;
    vertical: number;
  };
}

export interface IntermediateValues {
  mpeValue: number;
  caFactor: number;
  vcfValue: number;
  pcPower: number; // Pre-corrected power
  vcPower: number; // Visually corrected power
}

export interface MPELookupTable {
  wavelengthRange: string;
  exposureDuration: string;
  mpeValue: number;
  unit: string;
}

export interface VCFTableEntry {
  wavelength: number;
  vcf: number;
}

export interface MultiWavelengthCalculation {
  wavelengths: Array<{
    wavelength: number;
    power: number;
    divergence: number;
    mpe: number;
    nohd: number;
  }>;
  combinedNOHD: number;
  retinalHazardNOHD: number;
  cornealHazardNOHD: number;
}

export interface CalculationStep {
  equation: string;
  description: string;
  substitution: string;
  result: string;
}

export interface WorkedExample {
  id: string;
  title: string;
  description: string;
  inputs: CalculationInputs;
  expectedResults: CalculationResults;
  steps: CalculationStep[];
}
