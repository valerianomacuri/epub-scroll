/**
 * Theme Provider Wrapper
 * Manages Tailwind CSS theme based on reader settings
 */

import React, { useState, useEffect } from 'react';
import { StorageService } from '../core/storage/StorageService';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'sepia'>(() => {
    const settings = StorageService.getSettings();
    return settings.theme;
  });

  useEffect(() => {
    const applyTheme = (theme: 'light' | 'dark' | 'sepia') => {
      // Remove all theme classes
      document.documentElement.classList.remove('light', 'dark', 'sepia');
      // Add the new theme class
      document.documentElement.classList.add(theme);
      setCurrentTheme(theme);
    };

    const handleStorageChange = () => {
      const settings = StorageService.getSettings();
      applyTheme(settings.theme);
    };

    // Apply initial theme
    applyTheme(currentTheme);

    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes (in case of same-window updates)
    const interval = setInterval(() => {
      const settings = StorageService.getSettings();
      if (settings.theme !== currentTheme) {
        applyTheme(settings.theme);
      }
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [currentTheme]);

  return <>{children}</>;
};
