"use client"

import { createContext, useContext, useEffect, useState } from "react"
import MOCK_DEFAULT_THEME from "@/lib/default-theme";
import { applyThemeColors } from "@/lib/theme-utils";

export type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
  colorsStorageKey?: string
}

type ThemeProviderState = {
  theme: Theme
  setTheme: (theme: Theme) => void
  toggleTheme: () => void;
}

const initialState: ThemeProviderState = {
  theme: "light",
  setTheme: () => null,
  toggleTheme: () => null,
}

const ThemeProviderContext = createContext<ThemeProviderState>(initialState)

export function ThemeClientProvider({
  children,
  defaultTheme = "light",
  storageKey = "app-theme-mode",
  colorsStorageKey = "app-colors-hex",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(defaultTheme);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const storedTheme = localStorage.getItem(storageKey) as Theme | null;
    setTheme(storedTheme || defaultTheme);

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(storedTheme || defaultTheme);
    localStorage.setItem(storageKey, storedTheme || defaultTheme);
    
    try {
      const storedColorsJson = localStorage.getItem(colorsStorageKey);
      const hexTheme = storedColorsJson ? JSON.parse(storedColorsJson) : null;
      const currentMode = storedTheme || defaultTheme;

      if (hexTheme && hexTheme[currentMode]) {
          applyThemeColors(hexTheme[currentMode]);
      } else {
          const defaultColorsForMode = MOCK_DEFAULT_THEME[currentMode];
          const root = document.documentElement;
          Object.keys(defaultColorsForMode).forEach(key => {
              const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
              root.style.setProperty(cssVarName, (defaultColorsForMode as any)[key]);
          });
      }
    } catch (e) {
        console.error("Failed to parse or apply theme colors from localStorage", e);
    }
  }, [isMounted, storageKey, colorsStorageKey, defaultTheme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem(storageKey, newTheme);
        window.document.documentElement.classList.remove('light', 'dark');
        window.document.documentElement.classList.add(newTheme);
        // Re-apply colors for the new theme
        try {
            const storedColorsJson = localStorage.getItem(colorsStorageKey);
            const hexTheme = storedColorsJson ? JSON.parse(storedColorsJson) : null;
            if (hexTheme && hexTheme[newTheme]) {
                applyThemeColors(hexTheme[newTheme]);
            } else {
                 const defaultColorsForMode = MOCK_DEFAULT_THEME[newTheme];
                 const root = document.documentElement;
                 Object.keys(defaultColorsForMode).forEach(key => {
                     const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
                     root.style.setProperty(cssVarName, (defaultColorsForMode as any)[key]);
                 });
            }
        } catch(e) {
            console.error("Failed to apply theme on toggle", e);
        }

        return newTheme;
    });
  }

  const value = {
    theme,
    setTheme: (newTheme: Theme) => {
        setTheme(newTheme);
        localStorage.setItem(storageKey, newTheme);
        window.document.documentElement.classList.remove('light', 'dark');
        window.document.documentElement.classList.add(newTheme);
    },
    toggleTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
