"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

// Define the structure of a single theme mode (light or dark)
type ThemeMode = {
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
  light: ThemeMode;
  dark: ThemeMode;
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


// Define the context shape
interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
}

// Create the context
const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Define the provider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);

  useEffect(() => {
    // This effect runs only on the client
    try {
      const storedTheme = localStorage.getItem('app-theme');
      if (storedTheme) {
        const parsedTheme = JSON.parse(storedTheme);
        // Basic validation to ensure the parsed theme has the expected structure
        if (parsedTheme.light && parsedTheme.dark) {
          // Merge with default theme to ensure all keys are present
          const mergedTheme = {
            light: { ...DEFAULT_THEME.light, ...parsedTheme.light },
            dark: { ...DEFAULT_THEME.dark, ...parsedTheme.dark },
          };
          setThemeState(mergedTheme);
        }
      }
    } catch (error) {
      console.error("Failed to parse theme from localStorage", error);
    }
  }, []);

  const applyTheme = useCallback((themeToApply: Theme) => {
    const root = document.documentElement;
    
    // Apply light theme variables
    Object.keys(themeToApply.light).forEach(key => {
      const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
      root.style.setProperty(cssVar, themeToApply.light[key as keyof ThemeMode]);
    });

    // Apply dark theme variables within the .dark selector
    const darkStyles = Object.keys(themeToApply.dark).map(key => {
        const cssVar = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        return `${cssVar}: ${themeToApply.dark[key as keyof ThemeMode]};`;
    }).join('\n');
    
    let styleSheet = document.getElementById('dynamic-dark-theme-styles');
    if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'dynamic-dark-theme-styles';
        document.head.appendChild(styleSheet);
    }
    styleSheet.innerHTML = `.dark { ${darkStyles} }`;

  }, []);

  useEffect(() => {
    applyTheme(theme);
  }, [theme, applyTheme]);

  const setTheme = (newTheme: Theme) => {
    try {
      const mergedTheme = {
        light: { ...theme.light, ...newTheme.light },
        dark: { ...theme.dark, ...newTheme.dark },
      };
      localStorage.setItem('app-theme', JSON.stringify(mergedTheme));
      setThemeState(mergedTheme);
    } catch (error) {
      console.error("Failed to save theme to localStorage", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
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
