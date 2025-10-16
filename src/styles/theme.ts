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
        default: isSepia ? '#fdfbf7' : isDark ? '#3d3b49' : '#ffffff',
        paper: isSepia ? '#fdfbf7' : isDark ? '#3d3b49' : '#ffffff',
      },
      text: {
        primary: isSepia ? '#3d3b49' : isDark ? '#ffffff' : '#3d3b49',
        secondary: isSepia ? '#3d3b49' : isDark ? '#ffffff' : '#3d3b49',
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
      MuiCssBaseline: {
        styleOverrides: (theme) => ({
          styleOverrides: {
            '*': {
              fontFamily:
                '"Roboto", "Helvetica", "Arial", sans-serif !important',
            },
          },
          'body, div, p, h1, h2, h3, h4, h5, h6, ul, ol, li, blockquote': {
            margin: 0, // Elimina márgenes por defecto
            padding: 0, // Elimina padding por defecto
            boxSizing: 'border-box', // Usa box-sizing más predecible
          },

          // 📌 Listas básicas
          'ul, ol': {
            marginLeft: '1.5em',
            listStylePosition: 'outside',
            paddingLeft: '0.5em', // separa un poco el texto de la viñeta
          },

          // 📌 Listas anidadas
          'ul ul, ul ol, ol ul, ol ol': {
            marginLeft: '1.5em', // más espacio para diferenciar niveles
            listStyleType: 'circle', // segundo nivel
          },

          // 📌 Tercer nivel de listas
          'ul ul ul, ol ol ol': {
            listStyleType: 'square', // viñeta cuadrada para tercer nivel
          },

          // 📄 Párrafos
          p: {
            textIndent: 0, // sin sangría
            marginBottom: '0.5em', // espacio mínimo entre párrafos
          },

          // 💬 Citas (blockquote)
          blockquote: {
            margin: '1em 40px',
            paddingLeft: '1em',
            borderLeft: '4px solid #ccc',
          },

          // 🖼️ Imágenes y videos
          'img, video': {
            maxWidth: '100%', // no se desbordan del contenedor
            height: 'auto', // mantienen proporción
            verticalAlign: 'middle', // elimina el espacio extra debajo
          },

          // 🅱️ Negrita
          'strong, b': {
            fontWeight: 'bold', // enfatiza en negrita
          },

          // ✍️ Cursiva
          'em, i': {
            fontStyle: 'italic', // enfatiza en cursiva
          },

          a: {
            color: `${theme.palette.text.primary} !important`,
            textDecoration: 'underline !important',
            cursor: 'pointer',
          },

          'a:not([href])': {
            textDecoration: 'none !important',
            cursor: 'default',
            pointerEvents: 'none',
          },

          h1: {
            color: `${theme.palette.text.primary} !important`,
          },
        }),
      },
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
      MuiToolbar: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }),
        },
      },
      MuiList: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundColor: theme.palette.background.default,
            color: theme.palette.text.primary,
          }),
        },
      },
    },
  };
};

export const createAppTheme = (mode: 'light' | 'dark' | 'sepia') => {
  return createTheme(getThemeOptions(mode));
};
