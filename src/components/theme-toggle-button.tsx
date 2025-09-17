"use client";

import * as React from "react";
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';

export function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  // We need to ensure the component is mounted on the client to avoid hydration mismatches
  // since the theme is read from localStorage.
  const [isMounted, setIsMounted] = React.useState(false);
  React.useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    // Render a placeholder or null on the server and initial client render
    return <Button variant="ghost" size="icon" disabled aria-label="Carregando tema"><div className="h-5 w-5 animate-pulse rounded-full bg-muted" /></Button>;
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
      {theme === 'light' ? <Moon className="h-5 w-5 text-foreground" /> : <Sun className="h-5 w-5 text-foreground" />}
    </Button>
  );
}
