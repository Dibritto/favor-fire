import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { PT_Sans } from 'next/font/google';
import { ThemeProvider } from '@/components/theme-provider';

const ptSans = PT_Sans({
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-pt-sans',
});

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
      <body className={`${ptSans.variable} font-body antialiased`}>
        <ThemeProvider storageKey="app-theme-mode">
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
