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

  // Este provider agora é muito mais simples.
  // A lógica de aplicação do tema está no ThemeScript.
  // A lógica de alternância está no ThemeToggleButton.
  // Este provider apenas permite que componentes filhos saibam o tema atual, se precisarem.
  
  React.useEffect(() => {
    const storedTheme = localStorage.getItem("app-theme-mode") as Theme | null
    if (storedTheme) {
      setTheme(storedTheme)
    }
  }, [])
  

  const toggleTheme = () => {
    setTheme(prevTheme => {
        const newTheme = prevTheme === 'light' ? 'dark' : 'light';
        localStorage.setItem("app-theme-mode", newTheme);
        // O script e um reload farão o resto.
        window.location.reload(); 
        return newTheme;
    });
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
  const context = React.useContext(ThemeProviderContext)

  if (context === undefined)
    throw new Error("useTheme must be used within a ThemeProvider")

  return context
}