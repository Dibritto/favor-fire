
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Palette, Save } from "lucide-react";
import MOCK_DEFAULT_THEME from "@/lib/default-theme";
import { isEqual } from "lodash";
import { applyThemeColors, useTheme } from "@/components/theme-provider";


// Helper Functions
const hexToHslString = (hex: string): string => {
    if (!hex || typeof hex !== 'string') return "0 0% 0%";
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return "0 0% 0%";
    let r = parseInt(result[1], 16) / 255, g = parseInt(result[2], 16) / 255, b = parseInt(result[3], 16) / 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;
    if (max !== min) {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    h = Math.round(h * 360);
    s = Math.round(s * 100);
    l = Math.round(l * 100);
    return `${h} ${s}% ${l}%`;
};

const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return `#${[0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('')}`;
};

const hslStringToHex = (hsl: string): string => {
    if (!hsl) return '#000000';
    const parts = hsl.split(" ");
    if (parts.length !== 3) return '#000000';
    const [h, s, l] = parts.map(val => parseFloat(val.replace('%', '')));
    if (isNaN(h) || isNaN(s) || isNaN(l)) return '#000000';
    return hslToHex(h, s, l);
};

const convertHslThemeToHex = (theme: typeof MOCK_DEFAULT_THEME): ColorConfigFormValues => {
    const result: any = { light: {}, dark: {} };
    for (const mode of ['light', 'dark'] as const) {
        for (const key in theme[mode]) {
            const hslString = theme[mode][key as keyof typeof theme.light];
            if (typeof hslString === 'string') {
                result[mode][key] = hslStringToHex(hslString);
            }
        }
    }
    return result;
};


// Zod Schemas
const colorSchema = z.object({
    background: z.string(), foreground: z.string(), card: z.string(), cardForeground: z.string(),
    popover: z.string(), popoverForeground: z.string(), primary: z.string(), primaryForeground: z.string(),
    secondary: z.string(), secondaryForeground: z.string(), muted: z.string(), mutedForeground: z.string(),
    accent: z.string(), accentForeground: z.string(), destructive: z.string(), destructiveForeground: z.string(),
    border: z.string(), input: z.string(), ring: z.string(), sidebarBackground: z.string(),
    sidebarForeground: z.string(), sidebarPrimary: z.string(), sidebarPrimaryForeground: z.string(),
    sidebarAccent: z.string(), sidebarAccentForeground: z.string(), sidebarBorder: z.string(),
    sidebarRing: z.string(),
});
const colorConfigSchema = z.object({ light: colorSchema, dark: colorSchema });
type ColorConfigFormValues = z.infer<typeof colorConfigSchema>;

// Friendly Names
const friendlyColorNames: Record<string, string> = {
    background: "Fundo da Página", foreground: "Texto Principal", card: "Fundo do Card",
    cardForeground: "Texto do Card", popover: "Fundo do Popover/Dropdown", popoverForeground: "Texto do Popover/Dropdown",
    primary: "Primária (Botões principais)", primaryForeground: "Texto sobre Cor Primária",
    secondary: "Secundária (Botões secund.)", secondaryForeground: "Texto sobre Cor Secundária",
    muted: "Fundo Discreto (Badges)", mutedForeground: "Texto Discreto", accent: "Destaque (Hover)",
    accentForeground: "Texto sobre Cor de Destaque", destructive: "Destrutiva (Erros, Excluir)",
    destructiveForeground: "Texto sobre Cor Destrutiva", border: "Bordas Gerais", input: "Borda de Inputs",
    ring: "Anel de Foco (Focus)", sidebarBackground: "Fundo da Sidebar", sidebarForeground: "Texto da Sidebar",
    sidebarPrimary: "Primária da Sidebar", sidebarPrimaryForeground: "Texto sobre Primária da Sidebar",
    sidebarAccent: "Destaque da Sidebar (Hover)", sidebarAccentForeground: "Texto sobre Destaque da Sidebar",
    sidebarBorder: "Borda da Sidebar", sidebarRing: "Anel de Foco da Sidebar",
};

const DEFAULT_HEX_THEME = convertHslThemeToHex(MOCK_DEFAULT_THEME);
const COLORS_STORAGE_KEY = "app-colors-hex";

export default function ThemeColorsPage() {
  const { toast } = useToast();
  const { theme: currentMode } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  
  const [savedTheme, setSavedTheme] = useState<ColorConfigFormValues>(DEFAULT_HEX_THEME);

  const form = useForm<ColorConfigFormValues>({
    resolver: zodResolver(colorConfigSchema),
    defaultValues: savedTheme,
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      try {
        const storedThemeJson = localStorage.getItem(COLORS_STORAGE_KEY);
        const themeToLoad = storedThemeJson ? JSON.parse(storedThemeJson) : DEFAULT_HEX_THEME;
        setSavedTheme(themeToLoad);
        form.reset(themeToLoad);
      } catch (e) {
        console.error("Failed to load theme from localStorage", e);
        setSavedTheme(DEFAULT_HEX_THEME);
        form.reset(DEFAULT_HEX_THEME);
      }
    }
  }, [isMounted, form]);

  useEffect(() => {
    if (!isMounted) return;
    const subscription = form.watch((value) => {
      setHasChanges(!isEqual(value, savedTheme));
    });
    return () => subscription.unsubscribe();
  }, [form, savedTheme, isMounted]);

  const onSubmit = async (data: ColorConfigFormValues) => {
    setIsSubmitting(true);
    try {
      localStorage.setItem(COLORS_STORAGE_KEY, JSON.stringify(data));
      setSavedTheme(data);
      setHasChanges(false); 
      
      applyThemeColors(data[currentMode]);

      toast({
        title: "Tema Atualizado!",
        description: "As cores foram salvas com sucesso e aplicadas.",
      });
    } catch (error) {
      toast({
        title: "Erro ao Salvar",
        description: "Não foi possível salvar as cores do tema.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetToDefault = () => {
    localStorage.removeItem(COLORS_STORAGE_KEY);
    setSavedTheme(DEFAULT_HEX_THEME);
    form.reset(DEFAULT_HEX_THEME);
    setHasChanges(false);

    applyThemeColors(DEFAULT_HEX_THEME[currentMode]);

    toast({
      title: "Tema Restaurado",
      description: "As cores padrão foram restauradas.",
    });
  };

  const renderColorFields = (mode: 'light' | 'dark') => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(friendlyColorNames).map((key) => (
          <FormField
            key={`${mode}.${key}`}
            control={form.control}
            name={`${mode}.${key}` as any}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="capitalize flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full border" style={{ backgroundColor: field.value }}></div>
                  {friendlyColorNames[key] || key}
                </FormLabel>
                <FormControl>
                  <div className="flex items-center gap-2">
                    <Input type="color" {...field} className="p-1 h-10 w-14" />
                    <Input {...field} className="flex-1" />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        ))}
      </div>
    );
  };

  if (!isMounted) {
    return (
        <div className="flex justify-center items-center h-96">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="ml-4 text-muted-foreground">Carregando configurações de tema...</p>
        </div>
    );
  }

  return (
    <main>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h1 className="text-2xl font-headline font-bold flex items-center gap-2">
                <Palette className="h-6 w-6" />
                Cores do Tema
              </h1>
              <p className="text-muted-foreground mt-1">
                Personalize a aparência do aplicativo. As alterações serão aplicadas globalmente.
              </p>
            </div>
            <div className="flex gap-2">
              <Button type="button" variant="outline" onClick={resetToDefault} disabled={isSubmitting}>Restaurar Padrão</Button>
              <Button type="submit" disabled={isSubmitting || !hasChanges}>
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Salvar Cores
              </Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Tema Claro</CardTitle>
              <CardDescription>Cores para o modo de visualização claro.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderColorFields('light')}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tema Escuro</CardTitle>
              <CardDescription>Cores para o modo de visualização escuro.</CardDescription>
            </CardHeader>
            <CardContent>
              {renderColorFields('dark')}
            </CardContent>
          </Card>
        </form>
      </Form>
    </main>
  );
}
