/**
 * TypeScript type definitions for Course 6 Module 2 components
 */

export interface FlightZone {
  id: string;
  name: string;
  acronym: string;
  exposureLimit: string;
  exposureValue: number;
  exposureUnit: string;
  description: string;
  radius: string;
  altitude: string;
  color: string;
  icon: string;
  criticalPhases: string[];
}

export interface VisualEffect {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  duration: string;
  severity: 'low' | 'medium' | 'high';
  color: string;
  icon: string;
}

export interface ZoneCalculationParams {
  laserPower: number; // mW
  beamDivergence: number; // mrad
  wavelength: number; // nm
  visualCorrectionFactor: number;
}

export interface ZoneCalculationResults {
  lfedDistance: number; // feet
  czedDistance: number; // feet
  szedDistance: number; // feet
}

export interface AirspaceLayerConfig {
  lfz: boolean;
  cfz: boolean;
  sfz: boolean;
  nfz: boolean;
}
