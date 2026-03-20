'use client';

import { useState, useEffect, useCallback } from 'react';
import { AccessibilitySettings, KeyboardShortcut } from '@/types/lms';

const DEFAULT_ACCESSIBILITY_SETTINGS: AccessibilitySettings = {
  fontSize: 'medium',
  highContrast: false,
  reducedMotion: false,
  colorBlindMode: 'none',
  screenReaderOptimized: false,
  keyboardNavigation: false,
  focusIndicator: 'default',
  readingGuide: false,
  textSpacing: 'normal',
  lineHeight: 'normal',
};

const DEFAULT_KEYBOARD_SHORTCUTS: KeyboardShortcut[] = [
  { key: 'ArrowRight', modifiers: [], action: 'next', description: 'Go to next item', scope: 'global' },
  { key: 'ArrowLeft', modifiers: [], action: 'previous', description: 'Go to previous item', scope: 'global' },
  { key: 'Escape', modifiers: [], action: 'close', description: 'Close modal or exit', scope: 'global' },
  { key: 'f', modifiers: [], action: 'fullscreen', description: 'Toggle fullscreen', scope: 'course' },
  { key: ' ', modifiers: [], action: 'play-pause', description: 'Play or pause video', scope: 'course' },
  { key: 'm', modifiers: [], action: 'mute', description: 'Toggle mute', scope: 'course' },
  { key: 'n', modifiers: [], action: 'next-module', description: 'Go to next module', scope: 'course' },
  { key: 'p', modifiers: [], action: 'previous-module', description: 'Go to previous module', scope: 'course' },
  { key: 's', modifiers: [], action: 'save', description: 'Save progress', scope: 'global' },
  { key: 'h', modifiers: [], action: 'help', description: 'Show keyboard shortcuts', scope: 'global' },
];

const STORAGE_KEY = 'laser-lms-accessibility-settings';

interface UseAccessibilitySettingsReturn {
  settings: AccessibilitySettings;
  shortcuts: KeyboardShortcut[];
  isLoading: boolean;
  updateSetting: <K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => void;
  updateSettings: (updates: Partial<AccessibilitySettings>) => void;
  resetSettings: () => void;
  getFontSizeClass: () => string;
  getLineHeightClass: () => string;
  getLetterSpacingClass: () => string;
  announceToScreenReader: (message: string, priority?: 'polite' | 'assertive') => void;
}

/**
 * Hook for managing accessibility settings and screen reader support
 * 
 * @returns Accessibility settings and helper functions
 * 
 * @example
 * ```tsx
 * function AccessibleComponent() {
 *   const { 
 *     settings, 
 *     updateSetting, 
 *     announceToScreenReader,
 *     getFontSizeClass 
 *   } = useAccessibilitySettings();
 *   
 *   const handleAction = () => {
 *     // Perform action
 *     announceToScreenReader('Action completed successfully');
 *   };
 *   
 *   return (
 *     <div className={getFontSizeClass()}>
 *       <HighContrastToggle 
 *         enabled={settings.highContrast}
 *         onChange={(v) => updateSetting('highContrast', v)}
 *       />
 *       <button onClick={handleAction}>Perform Action</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function useAccessibilitySettings(): UseAccessibilitySettingsReturn {
  const [settings, setSettings] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY_SETTINGS);
  const [shortcuts] = useState<KeyboardShortcut[]>(DEFAULT_KEYBOARD_SHORTCUTS);
  const [isLoading, setIsLoading] = useState(true);
  const [announcement, setAnnouncement] = useState('');

  // Load settings from localStorage on mount
  useEffect(() => {
    const loadSettings = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setSettings({ ...DEFAULT_ACCESSIBILITY_SETTINGS, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load accessibility settings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSettings();
  }, []);

  // Save settings to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
      } catch (error) {
        console.error('Failed to save accessibility settings:', error);
      }
    }
  }, [settings, isLoading]);

  // Apply CSS classes based on settings
  useEffect(() => {
    const root = document.documentElement;
    
    // Apply font size
    root.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'x-large': '20px',
    }[settings.fontSize];

    // Apply high contrast
    if (settings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Apply reduced motion
    if (settings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Apply color blind mode
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia');
    if (settings.colorBlindMode !== 'none') {
      root.classList.add(settings.colorBlindMode);
    }
  }, [settings]);

  const updateSetting = useCallback(<K extends keyof AccessibilitySettings>(
    key: K,
    value: AccessibilitySettings[K]
  ) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updateSettings = useCallback((updates: Partial<AccessibilitySettings>) => {
    setSettings(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetSettings = useCallback(() => {
    setSettings(DEFAULT_ACCESSIBILITY_SETTINGS);
  }, []);

  const getFontSizeClass = useCallback(() => {
    const classes: Record<string, string> = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
      'x-large': 'text-xl',
    };
    return classes[settings.fontSize] || 'text-base';
  }, [settings.fontSize]);

  const getLineHeightClass = useCallback(() => {
    const classes: Record<string, string> = {
      normal: 'leading-normal',
      relaxed: 'leading-relaxed',
      loose: 'leading-loose',
    };
    return classes[settings.lineHeight] || 'leading-normal';
  }, [settings.lineHeight]);

  const getLetterSpacingClass = useCallback(() => {
    const classes: Record<string, string> = {
      normal: 'tracking-normal',
      wide: 'tracking-wide',
      wider: 'tracking-wider',
    };
    return classes[settings.textSpacing] || 'tracking-normal';
  }, [settings.textSpacing]);

  const announceToScreenReader = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    setAnnouncement('');
    // Small delay to ensure the announcement is read
    setTimeout(() => {
      setAnnouncement(message);
    }, 100);
  }, []);

  return {
    settings,
    shortcuts,
    isLoading,
    updateSetting,
    updateSettings,
    resetSettings,
    getFontSizeClass,
    getLineHeightClass,
    getLetterSpacingClass,
    announceToScreenReader,
  };
}
