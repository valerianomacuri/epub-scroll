/**
 * Theme Provider Wrapper
 * Simple wrapper - no theme management needed (light mode only)
 */

import React from 'react';

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  return <>{children}</>;
};
