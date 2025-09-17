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

  // This ensures we're on the client before doing anything.
  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      } else {
        setTheme(defaultTheme);
      }
    }
  }, [isMounted, storageKey, defaultTheme]);

  useEffect(() => {
    if (!isMounted) return;

    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem(storageKey, theme);
    
    try {
      const storedColorsJson = localStorage.getItem(colorsStorageKey);
      if (storedColorsJson) {
        const hexTheme = JSON.parse(storedColorsJson);
        if (hexTheme && hexTheme[theme]) {
            applyThemeColors(hexTheme[theme]);
        }
      } else {
          // If no custom colors, apply default HSL from the file
          const defaultColorsForMode = MOCK_DEFAULT_THEME[theme];
          Object.keys(defaultColorsForMode).forEach(key => {
              const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
              root.style.setProperty(cssVarName, (defaultColorsForMode as any)[key]);
          });
      }
    } catch (e) {
        console.error("Failed to parse or apply theme colors from localStorage", e);
    }
  }, [theme, isMounted, storageKey, colorsStorageKey]);

  // Add a listener to storage events to update theme in real-time across tabs
  useEffect(() => {
      if (!isMounted) return;
      
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === colorsStorageKey && event.newValue) {
             try {
                const newHexTheme = JSON.parse(event.newValue);
                if (newHexTheme && newHexTheme[theme]) {
                    applyThemeColors(newHexTheme[theme]);
                }
             } catch (e) {
                 console.error("Failed to parse stored theme on storage event", e);
             }
        }
        if (event.key === storageKey && event.newValue) {
          setTheme(event.newValue as Theme);
        }
      };
    
      window.addEventListener('storage', handleStorageChange);
      return () => {
          window.removeEventListener('storage', handleStorageChange);
      };
  }, [theme, isMounted, storageKey, colorsStorageKey]);


  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  }

  const value = {
    theme,
    setTheme,
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
