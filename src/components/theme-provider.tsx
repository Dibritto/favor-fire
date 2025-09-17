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
          setThemeState(parsedTheme);
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
      root.style.setProperty(`--${key}`, themeToApply.light[key as keyof ThemeMode]);
    });

    // Apply dark theme variables within the .dark selector
    const darkStyles = Object.keys(themeToApply.dark).map(key => {
        return `--${key}: ${themeToApply.dark[key as keyof ThemeMode]};`;
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
      localStorage.setItem('app-theme', JSON.stringify(newTheme));
      setThemeState(newTheme);
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
