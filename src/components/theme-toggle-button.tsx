
"use client";

import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ThemeToggleButton() {
  // Inicializa com null para evitar flash de conteúdo incorreto até que o tema seja determinado
  const [theme, setTheme] = useState<'light' | 'dark' | null>(null);

  // Efeito para definir o tema inicial do localStorage ou usar 'dark' como padrão
  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    if (storedTheme) {
      setTheme(storedTheme);
    } else {
      setTheme('dark'); // Padrão para escuro se nada estiver armazenado (para corresponder ao comportamento anterior)
    }
  }, []);

  // Efeito para aplicar o tema ao documentElement e salvar no localStorage sempre que o estado do tema mudar
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else if (theme === 'light') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
    // Se o tema for nulo (estado inicial), não faz nada até que seja determinado
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => {
        if (prevTheme === 'light') return 'dark';
        if (prevTheme === 'dark') return 'light';
        return 'dark'; // Alternar do estado nulo para escuro por padrão
    });
  };

  // Renderiza um placeholder ou nada até que o tema seja determinado para evitar flash
  if (theme === null) {
    return <Button variant="ghost" size="icon" disabled aria-label="Carregando tema"><div className="h-5 w-5 animate-pulse rounded-full bg-muted" /></Button>;
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme} aria-label="Alternar tema">
      {theme === 'light' ? <Moon className="h-5 w-5 text-foreground" /> : <Sun className="h-5 w-5 text-foreground" />}
    </Button>
  );
}
