
"use client";

import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from './theme-provider';

export function ThemeToggleButton() {
  const { mode, toggleTheme } = useTheme();

  // Render a placeholder or nothing until the theme mode is determined to prevent flash
  if (mode === null) {
    return <Button variant="ghost" size="icon" disabled aria-label="Carregando tema"><div className="h-5 w-5 animate-pulse rounded-full bg-muted" /></Button>;
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
      {mode === 'light' ? <Moon className="h-5 w-5 text-foreground" /> : <Sun className="h-5 w-5 text-foreground" />}
    </Button>
  );
}
