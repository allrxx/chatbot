import React, { createContext, useContext, useState, ReactNode, useMemo, useEffect } from 'react';
import { ThemeProvider as MuiThemeProvider, createTheme, PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';

// Define the shape of the theme context
interface ThemeContextType {
  mode: PaletteMode;
  toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Theme provider component
export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('dark'); // Default to dark for "modern" feel

  const toggleTheme = () => {
    setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Update body class for non-MUI css
  useEffect(() => {
    document.body.className = mode;
  }, [mode]);

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
              // Light mode
              primary: {
                main: '#007bff',
              },
              background: {
                default: '#f8fafc',
                paper: '#ffffff',
              },
              text: {
                primary: '#334155', // Slate 700
                secondary: '#64748b', // Slate 500
              },
            }
            : {
              // Dark mode
              primary: {
                main: '#3b82f6', // Blue 500
              },
              background: {
                default: '#0f172a', // Slate 900
                paper: '#1e293b', // Slate 800
              },
              text: {
                primary: '#f1f5f9', // Slate 100
                secondary: '#94a3b8', // Slate 400
              },
            }),
        },
        typography: {
          fontFamily: "'Outfit', 'Inter', sans-serif",
          button: {
            textTransform: 'none',
            fontWeight: 500,
          },
        },
        shape: {
          borderRadius: 8,
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                borderRadius: '8px',
                boxShadow: 'none',
                '&:hover': {
                  boxShadow: 'none',
                },
              },
            },
          },
          MuiPaper: {
            styleOverrides: {
              root: {
                backgroundImage: 'none', // Remove default MUI dark mode gradient overlay
              },
            },
          },
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useAppTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a AppThemeProvider');
  }
  return context;
};