/**
 * FAA Aviation Styling Constants
 * Official FAA aesthetic for Course 6: Outdoor & Airspace
 */

// FAA Official Colors
export const FAAColors = {
  // Primary - FAA Blue
  primary: '#002868',
  primaryLight: '#003d8c',
  primaryDark: '#001a45',
  
  // Secondary - Aviation Silver/White
  secondary: '#ffffff',
  secondaryDark: '#f0f0f0',
  
  // Accent - Aviation Gold
  accent: '#b8860b',
  accentLight: '#d4a520',
  
  // Warning Colors (Aviation Standard)
  danger: '#dc2626',      // Red - Emergency/Critical
  warning: '#f59e0b',     // Amber - Caution
  caution: '#eab308',     // Yellow - Advisory
  success: '#16a34a',     // Green - Safe/Clear
  info: '#0284c7',        // Sky Blue - Information
  
  // Flight Zone Colors (Standard Aviation)
  lfz: '#dc2626',         // Laser Free Zone - Red
  cfz: '#f97316',         // Critical Flight Zone - Orange
  sfz: '#eab308',         // Sensitive Flight Zone - Yellow
  nfz: '#16a34a',         // Normal Flight Zone - Green
  
  // Grayscale
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
} as const;

// Weather Status Colors
export const WeatherColors = {
  clear: '#10b981',       // Green - Go
  marginal: '#f59e0b',    // Amber - Caution
  adverse: '#dc2626',     // Red - No Go
  unknown: '#6b7280',     // Gray
} as const;

// Typography
export const FAAFonts = {
  heading: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  body: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  mono: '"SF Mono", Monaco, "Cascadia Code", "Roboto Mono", Consolas, monospace',
} as const;

// Spacing Scale
export const FAASpacing = {
  xs: '0.25rem',   // 4px
  sm: '0.5rem',    // 8px
  md: '1rem',      // 16px
  lg: '1.5rem',    // 24px
  xl: '2rem',      // 32px
  '2xl': '3rem',   // 48px
  '3xl': '4rem',   // 64px
} as const;

// Border Radius
export const FAARadius = {
  sm: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  full: '9999px',
} as const;

// Shadows
export const FAAShadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  faa: '0 4px 6px -1px rgba(0, 40, 104, 0.1), 0 2px 4px -1px rgba(0, 40, 104, 0.06)',
} as const;

// Aviation Icons (Unicode/SVG-ready)
export const FAAIcons = {
  // Aircraft
  airplane: '✈️',
  helicopter: '🚁',
  drone: '🛸',
  
  // Weather
  sun: '☀️',
  cloud: '☁️',
  rain: '🌧️',
  lightning: '⚡',
  wind: '💨',
  snow: '❄️',
  fog: '🌫️',
  
  // Safety/Status
  check: '✓',
  cross: '✕',
  warning: '⚠️',
  danger: '⛔',
  info: 'ℹ️',
  emergency: '🚨',
  
  // Navigation
  compass: '🧭',
  map: '🗺️',
  location: '📍',
  radar: '📡',
  
  // Operations
  radio: '📻',
  phone: '📞',
  document: '📄',
  clipboard: '📋',
  calendar: '📅',
  clock: '⏰',
  
  // Laser Specific
  laser: '🔴',
  beam: '🔦',
  eye: '👁️',
  shield: '🛡️',
} as const;

// Animation Durations
export const FAAAnimations = {
  fast: '150ms',
  normal: '300ms',
  slow: '500ms',
} as const;

// Zone Configuration
export const ZoneConfig = {
  lfz: {
    name: 'Laser Free Zone',
    acronym: 'LFZ',
    color: '#dc2626',
    bgColor: 'bg-red-600',
    bgLight: 'bg-red-50',
    textColor: 'text-red-800',
    borderColor: 'border-red-600',
    threshold: '50 nW/cm²',
    description: 'No laser radiation should reach aircraft',
  },
  cfz: {
    name: 'Critical Flight Zone',
    acronym: 'CFZ',
    color: '#f97316',
    bgColor: 'bg-orange-500',
    bgLight: 'bg-orange-50',
    textColor: 'text-orange-800',
    borderColor: 'border-orange-500',
    threshold: '5 µW/cm²',
    description: 'Glare prevention limit',
  },
  sfz: {
    name: 'Sensitive Flight Zone',
    acronym: 'SFZ',
    color: '#eab308',
    bgColor: 'bg-yellow-500',
    bgLight: 'bg-yellow-50',
    textColor: 'text-yellow-800',
    borderColor: 'border-yellow-500',
    threshold: '100 µW/cm²',
    description: 'Flashblindness prevention limit',
  },
  nfz: {
    name: 'Normal Flight Zone',
    acronym: 'NFZ',
    color: '#16a34a',
    bgColor: 'bg-green-600',
    bgLight: 'bg-green-50',
    textColor: 'text-green-800',
    borderColor: 'border-green-600',
    threshold: 'MPE limits',
    description: 'Standard eye safety limits',
  },
} as const;

// Weather Thresholds
export const WeatherThresholds = {
  wind: {
    safe: 15,      // mph
    caution: 25,   // mph
    danger: 35,    // mph
  },
  visibility: {
    safe: 5,       // miles
    caution: 3,    // miles
    danger: 1,     // miles
  },
} as const;

export default {
  colors: FAAColors,
  weatherColors: WeatherColors,
  fonts: FAAFonts,
  spacing: FAASpacing,
  radius: FAARadius,
  shadows: FAAShadows,
  icons: FAAIcons,
  animations: FAAAnimations,
  zoneConfig: ZoneConfig,
  weatherThresholds: WeatherThresholds,
};
