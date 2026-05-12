'use client';
import React, { createContext, useContext, ReactNode } from 'react';

export const SPC_THEME = {
  colors: {
    primary: '#10b981',       
    primaryDark: '#059669',
    primaryLight: '#ecfdf5',
    danger: '#ef4444',        // <--- New Red for Sign Out / Delete actions
    textMain: '#09090b',      
    textMuted: '#71717a',     
    background: '#f4f4f5',    
    card: '#ffffff',          
    border: '#e4e4e7',        
  },
  radius: {
    base: '1rem',
    large: '2.5rem',          
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
          minHeight: '100vh',
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useSPCTheme = () => useContext(ThemeContext);