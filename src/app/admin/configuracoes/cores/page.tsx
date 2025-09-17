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
import { useTheme } from "@/components/theme-provider";

// This is not the real theme provider, just a helper for this page.
const MOCK_DEFAULT_THEME = {
  light: {
    background: "0 0% 100%",
    foreground: "222.2 84% 4.9%",
    card: "0 0% 100%",
    cardForeground: "222.2 84% 4.9%",
    popover: "0 0% 100%",
    popoverForeground: "222.2 84% 4.9%",
    primary: "219 16% 50%",
    primaryForeground: "210 40% 98%",
    secondary: "210 8% 59%",
    secondaryForeground: "222.2 47.4% 11.2%",
    muted: "210 40% 96.1%",
    mutedForeground: "215.4 16.3% 46.9%",
    accent: "326 9% 55%",
    accentForeground: "210 40% 98%",
    destructive: "0 84.2% 60.2%",
    destructiveForeground: "210 40% 98%",
    border: "0 0% 83.1%",
    input: "0 0% 83.1%",
    ring: "219 16% 50%",
    sidebarBackground: "210 40% 98%",
    sidebarForeground: "222.2 84% 4.9%",
    sidebarPrimary: "219 16% 50%",
    sidebarPrimaryForeground: "210 40% 98%",
    sidebarAccent: "210 40% 94.1%",
    sidebarAccentForeground: "222.2 84% 4.9%",
    sidebarBorder: "210 40% 90.1%",
    sidebarRing: "219 16% 50%",
  },
  dark: {
    background: "222.2 84% 4.9%",
    foreground: "210 40% 98%",
    card: "222.2 84% 4.9%",
    cardForeground: "210 40% 98%",
    popover: "222.2 84% 4.9%",
    popoverForeground: "210 40% 98%",
    primary: "219 16% 60%",
    primaryForeground: "222.2 47.4% 11.2%",
    secondary: "217.2 32.6% 17.5%",
    secondaryForeground: "210 40% 98%",
    muted: "217.2 32.6% 17.5%",
    mutedForeground: "215 20.2% 65.1%",
    accent: "326 9% 65%",
    accentForeground: "210 40% 98%",
    destructive: "0 62.8% 50.6%",
    destructiveForeground: "210 40% 98%",
    border: "217.2 32.6% 17.5%",
    input: "217.2 32.6% 17.5%",
    ring: "219 16% 60%",
    sidebarBackground: "222.2 84% 5.9%",
    sidebarForeground: "210 40% 98%",
    sidebarPrimary: "210 40% 98%",
    sidebarPrimaryForeground: "222.2 47.4% 11.2%",
    sidebarAccent: "217.2 32.6% 17.5%",
    sidebarAccentForeground: "210 40% 98%",
    sidebarBorder: "217.2 32.6% 17.5%",
    sidebarRing: "212.7 26.8% 83.9%",
  },
};


const hexToHsl = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) return [0, 0, 0];

    let r = parseInt(result[1], 16) / 255;
    let g = parseInt(result[2], 16) / 255;
    let b = parseInt(result[3], 16) / 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
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
    
    return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100;
    l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) =>
      l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return `#${[0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('')}`;
};


const colorSchema = z.object({
    background: z.string(),
    foreground: z.string(),
    card: z.string(),
    cardForeground: z.string(),
    popover: z.string(),
    popoverForeground: z.string(),
    primary: z.string(),
    primaryForeground: z.string(),
    secondary: z.string(),
    secondaryForeground: z.string(),
    muted: z.string(),
    mutedForeground: z.string(),
    accent: z.string(),
    accentForeground: z.string(),
    destructive: z.string(),
    destructiveForeground: z.string(),
    border: z.string(),
    input: z.string(),
    ring: z.string(),
    sidebarBackground: z.string(),
    sidebarForeground: z.string(),
    sidebarPrimary: z.string(),
    sidebarPrimaryForeground: z.string(),
    sidebarAccent: z.string(),
    sidebarAccentForeground: z.string(),
    sidebarBorder: z.string(),
    sidebarRing: z.string(),
});

const colorConfigSchema = z.object({
  light: colorSchema,
  dark: colorSchema
});

type ColorConfigFormValues = z.infer<typeof colorConfigSchema>;

function convertHslThemeToHex(theme: typeof MOCK_DEFAULT_THEME): ColorConfigFormValues {
    const result: any = { light: {}, dark: {} };
    for (const mode of ['light', 'dark'] as const) {
        for (const key in theme[mode]) {
            const hslString = theme[mode][key as keyof typeof theme.light];
            if (typeof hslString === 'string') {
                const [h, s, l] = hslString.split(" ").map(v => parseFloat(v.replace('%', '')));
                result[mode][key] = hslToHex(h, s, l);
            }
        }
    }
    return result;
}

const friendlyColorNames: Record<string, string> = {
    background: "Fundo da Página",
    foreground: "Texto Principal",
    card: "Fundo do Card",
    cardForeground: "Texto do Card",
    popover: "Fundo do Popover/Dropdown",
    popoverForeground: "Texto do Popover/Dropdown",
    primary: "Primária (Botões principais)",
    primaryForeground: "Texto sobre Cor Primária",
    secondary: "Secundária (Botões secund.)",
    secondaryForeground: "Texto sobre Cor Secundária",
    muted: "Fundo Discreto (Badges)",
    mutedForeground: "Texto Discreto",
    accent: "Destaque (Hover)",
    accentForeground: "Texto sobre Cor de Destaque",
    destructive: "Destrutiva (Erros, Excluir)",
    destructiveForeground: "Texto sobre Cor Destrutiva",
    border: "Bordas Gerais",
    input: "Borda de Inputs",
    ring: "Anel de Foco (Focus)",
    sidebarBackground: "Fundo da Sidebar",
    sidebarForeground: "Texto da Sidebar",
    sidebarPrimary: "Primária da Sidebar",
    sidebarPrimaryForeground: "Texto sobre Primária da Sidebar",
    sidebarAccent: "Destaque da Sidebar (Hover)",
    sidebarAccentForeground: "Texto sobre Destaque da Sidebar",
    sidebarBorder: "Borda da Sidebar",
    sidebarRing: "Anel de Foco da Sidebar",
};


function updateStyleTag(theme: ColorConfigFormValues) {
    const styleId = 'dynamic-theme-styles';
    let styleTag = document.getElementById(styleId);
    if (!styleTag) {
        styleTag = document.createElement('style');
        styleTag.id = styleId;
        document.head.appendChild(styleTag);
    }
    
    const lightVars = Object.entries(theme.light).map(([key, value]) => {
        const [h, s, l] = hexToHsl(value);
        return `--${key}: ${h} ${s}% ${l}%;`;
    }).join('\n');
    
    const darkVars = Object.entries(theme.dark).map(([key, value]) => {
         const [h, s, l] = hexToHsl(value);
        return `--${key}: ${h} ${s}% ${l}%;`;
    }).join('\n');

    styleTag.innerHTML = `
:root {
${lightVars}
}
.dark {
${darkVars}
}
    `;
}

function getInitialTheme(): typeof MOCK_DEFAULT_THEME {
    if (typeof window === 'undefined') return MOCK_DEFAULT_THEME;
    try {
        const storedTheme = localStorage.getItem('app-colors');
        return storedTheme ? JSON.parse(storedTheme) : MOCK_DEFAULT_THEME;
    } catch {
        return MOCK_DEFAULT_THEME;
    }
}


export default function ThemeColorsPage() {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTheme, setActiveTheme] = useState(getInitialTheme);

  
  const form = useForm<ColorConfigFormValues>({
    resolver: zodResolver(colorConfigSchema),
    defaultValues: convertHslThemeToHex(activeTheme),
  });
  
  useEffect(() => {
    form.reset(convertHslThemeToHex(activeTheme));
  }, [activeTheme, form]);

  useEffect(() => {
      const hexValues = form.watch();
      updateStyleTag(hexValues);
  }, [form.watch()]);
  
  function onSubmit(data: ColorConfigFormValues) {
    setIsSubmitting(true);
    
    const newTheme = { light: {} as any, dark: {} as any };

    for (const mode of ['light', 'dark'] as const) {
        for (const key in data[mode]) {
            const hexColor = data[mode][key as keyof typeof data.light];
            const [h, s, l] = hexToHsl(hexColor);
            (newTheme[mode] as any)[key] = `${h} ${s}% ${l}%`;
        }
    }
    
    localStorage.setItem('app-colors', JSON.stringify(newTheme));
    setActiveTheme(newTheme);

    toast({
      title: "Tema Atualizado!",
      description: "As cores da aplicação foram salvas com sucesso.",
    });

    setIsSubmitting(false);
  }

  const resetToDefault = () => {
    localStorage.removeItem('app-colors');
    setActiveTheme(MOCK_DEFAULT_THEME);
     toast({
      title: "Tema Restaurado",
      description: "As cores padrão foram restauradas.",
    });
  }

  const renderColorFields = (mode: 'light' | 'dark') => {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.keys(form.getValues(mode)).map((key) => (
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
                            Personalize a aparência do aplicativo. As alterações serão aplicadas em tempo real.
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <Button type="button" variant="outline" onClick={resetToDefault}>Restaurar Padrão</Button>
                        <Button type="submit" disabled={isSubmitting}>
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
