/**
 * Theme Provider Wrapper
 * Manages Material UI theme based on reader settings
 */

import React, { useState, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, CssBaseline } from '@mui/material';
import { createAppTheme } from '../styles/theme';
import { StorageService } from '../core/storage/StorageService';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    const settings = StorageService.getSettings();
    return createAppTheme(settings.theme);
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const settings = StorageService.getSettings();
      setTheme(createAppTheme(settings.theme));
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Poll for changes (in case of same-window updates)
    const interval = setInterval(() => {
      const settings = StorageService.getSettings();
      const newTheme = createAppTheme(settings.theme);
      setTheme(newTheme);
    }, 1000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, []);

  return (
    <MuiThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </MuiThemeProvider>
  );
};
