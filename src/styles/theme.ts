/**
 * Material UI Theme Configuration
 * Centralized design system tokens
 */

import { createTheme, ThemeOptions } from '@mui/material/styles';

const getThemeOptions = (mode: 'light' | 'dark' | 'sepia'): ThemeOptions => {
  const isDark = mode === 'dark';
  const isSepia = mode === 'sepia';

  return {
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        main: '#3f51b5',
        light: '#757de8',
        dark: '#002984',
      },
      secondary: {
        main: '#f50057',
        light: '#ff5983',
        dark: '#bb002f',
      },
      background: {
        default: isSepia ? '#f4f1ea' : isDark ? '#1a1a1a' : '#fafafa',
        paper: isSepia ? '#faf8f3' : isDark ? '#242424' : '#ffffff',
      },
      text: {
        primary: isSepia ? '#3a3226' : isDark ? '#e0e0e0' : '#212121',
        secondary: isSepia ? '#6b5d4f' : isDark ? '#b0b0b0' : '#666666',
      },
    },
    typography: {
      fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontSize: '2.5rem',
        fontWeight: 500,
      },
      h2: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      h3: {
        fontSize: '1.75rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
        lineHeight: 1.6,
      },
    },
    shape: {
      borderRadius: 4,
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
          },
        },
      },
    },
  };
};

export const createAppTheme = (mode: 'light' | 'dark' | 'sepia') => {
  return createTheme(getThemeOptions(mode));
};
