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

interface ThemeContextProps {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  mode: ThemeMode | null;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

// Helper to convert key from camelCase to --kebab-case
const toCssVarName = (key: string) => `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;

// Function to apply a theme object to the root element
const applyThemeToDom = (theme: Theme) => {
  const root = document.documentElement;
  
  Object.entries(theme.light).forEach(([key, value]) => {
      root.style.setProperty(toCssVarName(key), value);
  });

  // Create a style element for dark mode styles
  let darkStyle = document.getElementById('dark-theme-vars');
  if (!darkStyle) {
    darkStyle = document.createElement('style');
    darkStyle.id = 'dark-theme-vars';
    document.head.appendChild(darkStyle);
  }

  const darkCss = Object.entries(theme.dark)
      .map(([key, value]) => `${toCssVarName(key)}: ${value};`)
      .join('\n');
  darkStyle.innerHTML = `.dark { ${darkCss} }`;
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [customTheme, setCustomTheme] = useState<Theme>(DEFAULT_THEME);
  const [mode, setMode] = useState<ThemeMode | null>(null);

  // Apply mode class to HTML element
  const applyMode = useCallback((themeMode: ThemeMode) => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(themeMode);
    setMode(themeMode);
  }, []);

  // Effect to load theme and mode from localStorage on initial client-side render
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem('app-theme');
      const initialTheme = storedTheme ? JSON.parse(storedTheme) : DEFAULT_THEME;
      setCustomTheme(initialTheme);
      applyThemeToDom(initialTheme);

      const storedMode = localStorage.getItem('theme-mode') as ThemeMode;
      const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      applyMode(storedMode || (systemPrefersDark ? 'dark' : 'light'));
    } catch (error) {
      console.error("Failed to load settings from localStorage", error);
      applyMode('light'); // Fallback to light mode
    }
  }, [applyMode]);

  // Effect to listen for storage changes from other tabs
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'app-theme' && event.newValue) {
        try {
          const newTheme = JSON.parse(event.newValue);
          setCustomTheme(newTheme);
          applyThemeToDom(newTheme);
        } catch (error) { console.error("Failed to parse theme from storage event", error); }
      }
      if (event.key === 'theme-mode' && event.newValue) {
        applyMode(event.newValue as ThemeMode);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [applyMode]);
  
  // Function to update the theme
  const setTheme = (newTheme: Theme) => {
    try {
      localStorage.setItem('app-theme', JSON.stringify(newTheme));
      setCustomTheme(newTheme);
      applyThemeToDom(newTheme);
    } catch (error) { console.error("Failed to save theme to localStorage", error); }
  };

  // Function to toggle between light and dark mode
  const toggleTheme = () => {
    setMode(prevMode => {
        const newMode = prevMode === 'light' ? 'dark' : 'light';
        localStorage.setItem('theme-mode', newMode);
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(newMode);
        return newMode;
    });
  }

  const value = { theme: customTheme, setTheme, mode, toggleTheme, };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextProps => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
