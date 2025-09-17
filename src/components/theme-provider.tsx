
"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

// Define the structure of a single theme mode (light or dark)
type ThemeModeVars = {
  background: string;
  foreground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  border: string;
  input: string;
  ring: string;
  sidebarBackground: string;
  sidebarForeground: string;
  sidebarPrimary: string;
  sidebarPrimaryForeground: string;
  sidebarAccent: string;
  sidebarAccentForeground: string;
  sidebarBorder: string;
  sidebarRing: string;
};

// Define the overall theme structure
export interface Theme {
  light: ThemeModeVars;
  dark: ThemeModeVars;
}

// Define the default theme as a fallback
export const DEFAULT_THEME: Theme = {
  light: {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    cardForeground: "222.2 84% 4.9%",
    popover: "0 0% 100%",
    popoverForeground: "222.2 84% 4.9%",
    primary: "219 16% 50%",
    primaryForeground: "210 40% 98%",
    secondary: "210 8% 59%",
    secondaryForeground: "222.2 47.4% 11.2%",
    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",
    accent: "326 9% 55%",
    accentForeground: "210 40% 98%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "210 40% 98%",
    border: "0 0% 83.1%",
    input: "0 0% 83.1%",
    ring: "219 16% 50%",
    sidebarBackground: "210 40% 98%",
    sidebarForeground: "222.2 84% 4.9%",
    sidebarPrimary: "219 16% 50%",
    sidebarPrimaryForeground: "210 40% 98%",
    sidebarAccent: "210 40% 94.1%",
    sidebarAccentForeground: "222.2 84% 4.9%",
    sidebarBorder: "210 40% 90.1%",
    sidebarRing: "219 16% 50%",
  },
  dark: {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    card: "222.2 84% 4.9%",
    cardForeground: "210 40% 98%",
    popover: "222.2 84% 4.9%",
    popoverForeground: "210 40% 98%",
    primary: "219 16% 60%",
    primaryForeground: "222.2 47.4% 11.2%",
    secondary: "217.2 32.6% 17.5%",
    secondaryForeground: "210 40% 98%",
    muted: "217.2 32.6% 17.5%",
    mutedForeground: "215 20.2% 65.1%",
    accent: "326 9% 65%",
    accentForeground: "210 40% 98%",
    destructive: "0 62.8% 50.6%",
    destructiveForeground: "210 40% 98%",
    border: "217.2 32.6% 17.5%",
    input: "217.2 32.6% 17.5%",
    ring: "219 16% 60%",
    sidebarBackground: "222.2 84% 5.9%",
    sidebarForeground: "210 40% 98%",
    sidebarPrimary: "210 40% 98%",
    sidebarPrimaryForeground: "222.2 47.4% 11.2%",
    sidebarAccent: "217.2 32.6% 17.5%",
    sidebarAccentForeground: "210 40% 98%",
    sidebarBorder: "217.2 32.6% 17.5%",
    sidebarRing: "212.7 26.8% 83.9%",
  },
};

type ThemeMode = 'light' | 'dark';

// Define the context shape
interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: ThemeMode | null;
  toggleTheme: () => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Helper to convert kebab-case to camelCase
function toCamelCase(str: string): string {
    return str.replace(/-([a-z])/g, g => g[1].toUpperCase());
}

// Helper to apply HSL values to a style sheet
const applyThemeToStyleSheet = (theme: ThemeModeVars, sheet: CSSStyleSheet, prefix: string) => {
    const rule = `${prefix} { ${Object.entries(theme).map(([key, value]) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}: ${value};`).join(' ')} }`;

    // Clear existing rules and add the new one
    while (sheet.cssRules.length) {
        sheet.deleteRule(0);
    }
    sheet.insertRule(rule, 0);
};

// Define the provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [customTheme, setCustomTheme] = useState<Theme>(DEFAULT_THEME);
  const [mode, setMode] = useState<ThemeMode | null>(null);

  // Effect to load custom colors and mode from localStorage
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('app-theme');
      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme);
        if (parsedTheme.light && parsedTheme.dark) {
          setCustomTheme(parsedTheme);
        }
      }
    } catch (error) {
      console.error("Failed to parse theme from localStorage", error);
    }

    try {
      const storedMode = localStorage.getItem('theme-mode') as ThemeMode | null;
      setMode(storedMode || 'dark');
    } catch (error) {
      setMode('dark');
    }
  }, []);

  // Effect to apply theme colors and mode class
  useEffect(() => {
    if (!mode) return;

    const root = document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(mode);

    // Get or create style sheets for dynamic themes
    let lightSheet = (document.getElementById('light-theme-sheet') as HTMLStyleElement)?.sheet;
    if (!lightSheet) {
        const styleEl = document.createElement('style');
        styleEl.id = 'light-theme-sheet';
        document.head.appendChild(styleEl);
        lightSheet = styleEl.sheet;
    }

    let darkSheet = (document.getElementById('dark-theme-sheet') as HTMLStyleElement)?.sheet;
    if (!darkSheet) {
        const styleEl = document.createElement('style');
        styleEl.id = 'dark-theme-sheet';
        document.head.appendChild(styleEl);
        darkSheet = styleEl.sheet;
    }

    if (lightSheet) {
        applyThemeToStyleSheet(customTheme.light, lightSheet, ':root');
    }
    if (darkSheet) {
        applyThemeToStyleSheet(customTheme.dark, darkSheet, '.dark');
    }
    
  }, [customTheme, mode]);


  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('app-theme', JSON.stringify(newTheme));
      setCustomTheme(newTheme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  };

  const toggleTheme = () => {
    setMode(prevMode => {
      const newMode = prevMode === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme-mode', newMode);
      return newMode;
    });
  }

  const value = {
    theme: customTheme,
    setTheme,
    mode,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

// Custom hook to use the theme context
export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

    