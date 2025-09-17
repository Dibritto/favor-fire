import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'Kindred Connect',
  description: 'Uma plataforma para colaboração comunitária e ajuda mútua.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <body>
        <ThemeProvider
          storageKey="app-theme-mode"
          colorsStorageKey="app-colors-hex"
        >
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
