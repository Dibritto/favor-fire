"use client"

import * as React from "react"

export type Theme = "dark" | "light"

type ThemeProviderProps = {
  children: React.ReactNode
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

const ThemeProviderContext = React.createContext<ThemeProviderState>(initialState)

export function ThemeProvider({
  children,
  ...props
}: ThemeProviderProps) {
  const [theme, setTheme] = React.useState<Theme>("light")

  React.useEffect(() => {
    const storedTheme = localStorage.getItem("app-theme-mode") as Theme | null
    const initialTheme = storedTheme || 'light';
    setTheme(initialTheme);
  }, [])
  
  const handleSetTheme = (newTheme: Theme) => {
      localStorage.setItem("app-theme-mode", newTheme);
      document.documentElement.classList.remove('light', 'dark');
      document.documentElement.classList.add(newTheme);
      setTheme(newTheme);
  }

  const toggleTheme = () => {
    handleSetTheme(theme === 'light' ? 'dark' : 'light');
  }

  const value = {
    theme,
    setTheme: handleSetTheme,
    toggleTheme,
  }

  return (
    <ThemeProviderContext.Provider {...props} value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export const useTheme = () => {
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}
