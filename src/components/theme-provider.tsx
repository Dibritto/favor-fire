
"use client"

import { createContext, useContext, useEffect, useState } from "react"
import MOCK_DEFAULT_THEME from "@/lib/default-theme"

export type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
  defaultTheme?: Theme
  storageKey?: string
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

function applyCustomColors() {
  if (typeof window === 'undefined') return;
  
  try {
    const storedColors = localStorage.getItem('app-colors');
    let styleTag = document.getElementById('dynamic-theme-styles');

    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = 'dynamic-theme-styles';
        document.head.appendChild(styleTag);
    }
    
    const theme = storedColors ? JSON.parse(storedColors) : MOCK_DEFAULT_THEME;

    const toKebabCase = (str: string) => str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();

    const lightVars = Object.entries(theme.light).map(([key, value]) => `--${toKebabCase(key)}: ${value};`).join('\n');
    const darkVars = Object.entries(theme.dark).map(([key, value]) => `--${toKebabCase(key)}: ${value};`).join('\n');

    styleTag.innerHTML = `
:root {
${lightVars}
}
.dark {
${darkVars}
}
    `;

  } catch(e) {
    console.error("Failed to apply custom colors", e)
  }
}


export function ThemeProvider({
  children,
  defaultTheme = "light",
  storageKey = "app-theme-mode",
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window === 'undefined') {
      return defaultTheme;
    }
    return (localStorage.getItem(storageKey) as Theme) || defaultTheme;
  });

  useEffect(() => {
    applyCustomColors();
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'app-colors') {
        applyCustomColors();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove("light", "dark")
    root.classList.add(theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem(storageKey, newTheme);
        return newTheme;
    });
  }

  const value = {
    theme,
    setTheme: (theme: Theme) => {
      localStorage.setItem(storageKey, theme)
      setTheme(theme)
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

    