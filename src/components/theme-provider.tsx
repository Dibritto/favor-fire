import { ThemeClientProvider } from "@/components/theme-client-provider"

type ThemeProviderProps = {
  children: React.ReactNode
  storageKey?: string
  colorsStorageKey?: string
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  // O ThemeClientProvider agora tem "use client" e lida com toda a lógica do navegador.
  return (
    <ThemeClientProvider {...props}>
      {children}
    </ThemeClientProvider>
  )
}
