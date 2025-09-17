import { ThemeClientProvider } from "@/components/theme-client-provider"

type ThemeProviderProps = {
  children: React.ReactNode
  storageKey?: string
  colorsStorageKey?: string
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <ThemeClientProvider {...props}>
      {children}
    </ThemeClientProvider>
  )
}

// A função `useTheme` agora será exportada de `theme-client-provider.tsx`
// pois é um hook do lado do cliente.
