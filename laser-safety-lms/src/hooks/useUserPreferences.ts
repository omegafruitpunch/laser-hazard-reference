'use client';

import { useState, useEffect, useCallback } from 'react';
import { UserPreferences } from '@/types/lms';

const DEFAULT_PREFERENCES: UserPreferences = {
  theme: 'dark',
  fontSize: 'medium',
  reducedMotion: false,
  highContrast: false,
  colorBlindMode: 'none',
  autoPlayVideos: false,
  showCaptions: true,
  emailNotifications: true,
  reminderFrequency: 'weekly',
  studySessionLength: 25,
  breakInterval: 5,
};

const STORAGE_KEY = 'laser-lms-user-preferences';

interface UseUserPreferencesReturn {
  preferences: UserPreferences;
  isLoading: boolean;
  updatePreference: <K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  resetPreferences: () => void;
  isDefault: boolean;
}

/**
 * Hook for managing user preferences
 * 
 * @returns User preferences state and control functions
 * 
 * @example
 * ```tsx
 * function SettingsPage() {
 *   const { preferences, updatePreference } = useUserPreferences();
 *   
 *   return (
 *     <div>
 *       <ThemeToggle 
 *         value={preferences.theme}
 *         onChange={(theme) => updatePreference('theme', theme)}
 *       />
 *       <FontSizeSelector
 *         value={preferences.fontSize}
 *         onChange={(size) => updatePreference('fontSize', size)}
 *       />
 *     </div>
 *   );
 * }
 * ```
 */
export function useUserPreferences(): UseUserPreferencesReturn {
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [isLoading, setIsLoading] = useState(true);

  // Load preferences from localStorage on mount
  useEffect(() => {
    const loadPreferences = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored);
          setPreferences({ ...DEFAULT_PREFERENCES, ...parsed });
        }
      } catch (error) {
        console.error('Failed to load preferences:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadPreferences();
  }, []);

  // Save preferences to localStorage when they change
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(preferences));
      } catch (error) {
        console.error('Failed to save preferences:', error);
      }
    }
  }, [preferences, isLoading]);

  const updatePreference = useCallback(<K extends keyof UserPreferences>(
    key: K,
    value: UserPreferences[K]
  ) => {
    setPreferences(prev => ({
      ...prev,
      [key]: value,
    }));
  }, []);

  const updatePreferences = useCallback((updates: Partial<UserPreferences>) => {
    setPreferences(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const resetPreferences = useCallback(() => {
    setPreferences(DEFAULT_PREFERENCES);
  }, []);

  const isDefault = Object.entries(preferences).every(
    ([key, value]) => DEFAULT_PREFERENCES[key as keyof UserPreferences] === value
  );

  return {
    preferences,
    isLoading,
    updatePreference,
    updatePreferences,
    resetPreferences,
    isDefault,
  };
}
