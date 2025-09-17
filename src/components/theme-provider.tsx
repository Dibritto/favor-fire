
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import MOCK_DEFAULT_THEME from "@/lib/default-theme";

export type Theme = "dark" | "light"

// Helper function to convert hex to HSL string "h s% l%"
const hexToHslString = (hex: string): string => {
    if (!hex || typeof hex !== 'string') return "0 0% 0%";
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0 0% 0%";
    let r = parseInt(result[1], 16) / 255, g = parseInt(result[2], 16) / 255, b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
};

// Function to apply theme colors to the root element
export const applyThemeColors = (colors: Record<string, string>) => {
    const root = document.documentElement;
    Object.keys(colors).forEach((key) => {
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        const hslString = hexToHslString(colors[key]);
        root.style.setProperty(cssVarName, hslString);
    });
};

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

export function ThemeProvider({
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
    if (isMounted) {
      const storedTheme = localStorage.getItem(storageKey) as Theme | null;
      if (storedTheme) {
        setTheme(storedTheme);
      }
    }
  }, [isMounted, storageKey]);


  useEffect(() => {
    if (!isMounted) return;

    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
    localStorage.setItem(storageKey, theme);
    
    const storedColorsJson = localStorage.getItem(colorsStorageKey);
    const hexTheme = storedColorsJson ? JSON.parse(storedColorsJson) : null;
    
    if (hexTheme && hexTheme[theme]) {
        applyThemeColors(hexTheme[theme]);
    } else {
        const defaultColorsForMode = MOCK_DEFAULT_THEME[theme];
         Object.keys(defaultColorsForMode).forEach(key => {
            const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
            root.style.setProperty(cssVarName, (defaultColorsForMode as any)[key]);
        });
    }

  }, [theme, isMounted, storageKey, colorsStorageKey]);

  // Add a listener to storage events to update theme in real-time across tabs
  useEffect(() => {
      if (!isMounted) return;
      const handleStorageChange = (event: StorageEvent) => {
        if (event.key === colorsStorageKey && event.newValue) {
             const newHexTheme = JSON.parse(event.newValue);
             if (newHexTheme && newHexTheme[theme]) {
                applyThemeColors(newHexTheme[theme]);
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
