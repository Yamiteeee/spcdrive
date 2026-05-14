'use client';
import React, { createContext, useContext, ReactNode } from 'react';

// Define the structure once so TypeScript doesn't get confused by specific hex values
export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    buttonText: string;
    secondary: string;
    secondaryHover: string;
    danger: string;
    textMain: string;
    textMuted: string;
    background: string;
    card: string;
    border: string;
  };
  radius: {
    base: string;
    large: string;
  };
}

export const DASHBOARD_THEME: Theme = {
  colors: {
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#ecfdf5',
    buttonText: '#ffffff',
    secondary: '#f8fafc',
    secondaryHover: '#f1f5f9',
    danger: '#ef4444',
    textMain: '#09090b',
    textMuted: '#71717a',
    background: '#ebedef',
    card: '#ffffff',
    border: '#dcdfe4',
  },
  radius: { base: '1rem', large: '2.5rem' }
};

export const AUTH_THEME: Theme = {
  colors: {
    primary: '#10b981',
    primaryDark: '#059669',
    primaryLight: '#ecfdf5',
    buttonText: '#ffffff',
    secondary: '#f8fafc',
    secondaryHover: '#f1f5f9',
    danger: '#ef4444',
    textMain: '#ffffff',  // Global text is now white
    textMuted: '#94a3b8',
    background: '#0f172a',
    card: '#ffffff',      // Input background
    border: '#1e293b',
  },
  radius: { base: '1rem', large: '2.5rem' }
};

export const PAGE_THEME: Theme = {
  ...DASHBOARD_THEME,
  colors: { ...DASHBOARD_THEME.colors, background: '#ffffff' }
};

// Use the Theme interface here to avoid the "Not Assignable" error
const ThemeContext = createContext<Theme>(DASHBOARD_THEME);

export const ThemeProvider = ({ 
  children, 
  mode = 'dashboard' 
}: { 
  children: ReactNode, 
  mode?: 'dashboard' | 'auth' | 'page' 
}) => {
  const theme = mode === 'auth' ? AUTH_THEME : mode === 'page' ? PAGE_THEME : DASHBOARD_THEME;

  return (
    <ThemeContext.Provider value={theme}>
      <div 
        className="theme-wrapper transition-colors duration-500"
        style={{ 
          ['--spc-primary' as string]: theme.colors.primary,
          ['--spc-primary-dark' as string]: theme.colors.primaryDark,
          ['--spc-button-text' as string]: theme.colors.buttonText,
          ['--spc-danger' as string]: theme.colors.danger,
          ['--spc-text-main' as string]: theme.colors.textMain,
          ['--spc-text-muted' as string]: theme.colors.textMuted,
          ['--spc-background' as string]: theme.colors.background,
          ['--spc-card' as string]: theme.colors.card,
          ['--spc-border' as string]: theme.colors.border,
          ['--spc-radius-base' as string]: theme.radius.base,
          ['--spc-radius-large' as string]: theme.radius.large,

          backgroundColor: theme.colors.background,
          color: theme.colors.textMain,
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column'
        } as React.CSSProperties}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useSPCTheme = () => useContext(ThemeContext);