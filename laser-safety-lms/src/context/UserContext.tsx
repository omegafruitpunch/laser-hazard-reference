'use client';

import React, { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User, UserPreferences, UserCertification, AccessibilitySettings } from '@/types/lms';

interface UserContextState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: Error | null;
  
  // Auth functions
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
  
  // Preferences
  preferences: UserPreferences;
  updatePreference: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => void;
  updatePreferences: (updates: Partial<UserPreferences>) => void;
  
  // Accessibility
  accessibility: AccessibilitySettings;
  updateAccessibility: (updates: Partial<AccessibilitySettings>) => void;
  
  // Certifications
  addCertification: (cert: UserCertification) => void;
  removeCertification: (certId: string) => void;
}

const UserContext = createContext<UserContextState | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

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

const DEFAULT_ACCESSIBILITY: AccessibilitySettings = {
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

/**
 * User Context Provider
 * 
 * Manages user authentication, profile, preferences, and accessibility settings.
 * 
 * @example
 * ```tsx
 * function App() {
 *   return (
 *     <UserProvider>
 *       <YourApp />
 *     </UserProvider>
 *   );
 * }
 * 
 * function UserProfile() {
 *   const { user, logout, updateProfile } = useUser();
 *   
 *   return (
 *     <div>
 *       <h1>Welcome, {user?.name}</h1>
 *       <button onClick={logout}>Logout</button>
 *     </div>
 *   );
 * }
 * ```
 */
export function UserProvider({ children }: UserProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [preferences, setPreferences] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [accessibility, setAccessibility] = useState<AccessibilitySettings>(DEFAULT_ACCESSIBILITY);

  // Load user data from localStorage on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUser = localStorage.getItem('laser-lms-user');
        const storedPrefs = localStorage.getItem('laser-lms-preferences');
        const storedAccessibility = localStorage.getItem('laser-lms-accessibility');

        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        if (storedPrefs) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(storedPrefs) });
        }
        if (storedAccessibility) {
          setAccessibility({ ...DEFAULT_ACCESSIBILITY, ...JSON.parse(storedAccessibility) });
        }
      } catch (error) {
        console.error('Failed to load user data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Persist preferences to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('laser-lms-preferences', JSON.stringify(preferences));
    }
  }, [preferences, isLoading]);

  // Persist accessibility settings to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem('laser-lms-accessibility', JSON.stringify(accessibility));
    }
  }, [accessibility, isLoading]);

  // Apply accessibility settings to document
  useEffect(() => {
    const root = document.documentElement;
    
    // Font size
    root.style.fontSize = {
      small: '14px',
      medium: '16px',
      large: '18px',
      'x-large': '20px',
    }[accessibility.fontSize];

    // High contrast
    if (accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Reduced motion
    if (accessibility.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }

    // Color blind mode
    root.classList.remove('protanopia', 'deuteranopia', 'tritanopia', 'achromatopsia');
    if (accessibility.colorBlindMode !== 'none') {
      root.classList.add(accessibility.colorBlindMode);
    }
  }, [accessibility]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Mock login - replace with actual authentication
      const mockUser: User = {
        id: 'user-1',
        email,
        name: email.split('@')[0],
        role: 'learner',
        createdAt: new Date().toISOString(),
        lastActive: new Date().toISOString(),
        certifications: [],
        preferences: DEFAULT_PREFERENCES,
      };

      setUser(mockUser);
      localStorage.setItem('laser-lms-user', JSON.stringify(mockUser));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Login failed'));
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    localStorage.removeItem('laser-lms-user');
  }, []);

  const updateProfile = useCallback((updates: Partial<User>) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = { ...prev, ...updates, lastActive: new Date().toISOString() };
      localStorage.setItem('laser-lms-user', JSON.stringify(updated));
      return updated;
    });
  }, []);

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

  const updateAccessibility = useCallback((updates: Partial<AccessibilitySettings>) => {
    setAccessibility(prev => ({
      ...prev,
      ...updates,
    }));
  }, []);

  const addCertification = useCallback((cert: UserCertification) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        certifications: [...prev.certifications, cert],
      };
      localStorage.setItem('laser-lms-user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeCertification = useCallback((certId: string) => {
    setUser(prev => {
      if (!prev) return null;
      const updated = {
        ...prev,
        certifications: prev.certifications.filter(c => c.id !== certId),
      };
      localStorage.setItem('laser-lms-user', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const value: UserContextState = {
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout,
    updateProfile,
    preferences,
    updatePreference,
    updatePreferences,
    accessibility,
    updateAccessibility,
    addCertification,
    removeCertification,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

/**
 * Hook to access the UserContext
 * 
 * @throws Error if used outside of UserProvider
 */
export function useUser(): UserContextState {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}
