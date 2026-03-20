/**
 * TypeScript type definitions for Course 6 Module 1 components
 */

export interface FormStep {
  id: string;
  title: string;
  description: string;
  fields: FormField[];
}

export interface FormField {
  id: string;
  label: string;
  type: 'text' | 'select' | 'date' | 'time' | 'number' | 'textarea' | 'radio';
  required: boolean;
  helpText?: string;
  options?: string[];
  validation?: (value: any) => ValidationResult;
}

export interface ValidationResult {
  valid: boolean;
  message: string;
}

export interface LaserConfiguration {
  id: string;
  laserType: string;
  laserClass: string;
  power: number; // Watts
  pulseEnergy?: number; // Joules
  pulseDuration?: number; // Seconds
  prf?: number; // Hz
  beamDiameter: number; // cm at 1/e points
  beamDivergence: number; // mrad
  wavelengths: number[]; // nm
  mpeValue: number; // mW/cm² or J/cm²
}

export interface GeographicLocation {
  siteElevation: number; // feet MSL
  laserHeight: number; // feet AGL
  totalElevation: number; // feet MSL
  latitude: string;
  longitude: string;
  coordinateSource: 'GPS' | 'Map' | 'Other';
}

export interface BeamDirection {
  minElevation: number; // degrees
  maxElevation: number; // degrees
  azimuthStart: number; // degrees
  azimuthEnd: number; // degrees
  northType: 'True' | 'Magnetic';
  magneticDeclination?: number; // degrees
}

export interface VisualCorrectionFactor {
  wavelength: number;
  vcf: number;
}

export interface CalculationResults {
  nohd: {
    slantRange: number; // feet
    horizontal: number; // feet
    vertical: number; // feet
  };
  szed?: {
    slantRange: number; // feet
    horizontal: number; // feet
    vertical: number; // feet
  };
  czed?: {
    slantRange: number; // feet
    horizontal: number; // feet
    vertical: number; // feet
  };
  lfed?: {
    slantRange: number; // feet
    horizontal: number; // feet
    vertical: number; // feet
  };
}

export interface Form7140Submission {
  generalInfo: {
    serviceCenter: string;
    proponentName: string;
    eventName: string;
    datePrepared: string;
  };
  schedule: {
    testingDates?: string;
    operationDates: string;
  };
  description: string;
  operatorInfo: {
    names: string[];
    primaryPhone: string;
    secondaryPhone?: string;
  };
  fdaInfo?: {
    varianceNumber?: string;
    varianceExpiration?: string;
    accessionNumber?: string;
  };
  controlMeasures: string;
  configurations: LaserConfiguration[];
  location: GeographicLocation;
  beamDirection: BeamDirection;
  calculations: CalculationResults;
}
