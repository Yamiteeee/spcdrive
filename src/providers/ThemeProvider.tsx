'use client';
import React, { createContext, useContext, ReactNode } from 'react';

// Define your brand identity here
export const SPC_THEME = {
  colors: {
    primary: '#10b981',       // The main Emerald
    primaryDark: '#059669',
    primaryLight: '#ecfdf5',
    textMain: '#09090b',      // Zinc 950
    textMuted: '#71717a',     // Zinc 500
    background: '#fafafa',    // Zinc 50
    card: '#ffffff',          // White
    border: '#e4e4e7',        // Zinc 200
  },
  radius: {
    base: '1rem',
    large: '2.5rem',          // Your signature SPC curve
  }
} as const;

const ThemeContext = createContext(SPC_THEME);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  return (
    <ThemeContext.Provider value={SPC_THEME}>
      <div 
        style={{ 
          backgroundColor: SPC_THEME.colors.background,
          color: SPC_THEME.colors.textMain,
          minHeight: '100vh' 
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useSPCTheme = () => useContext(ThemeContext);