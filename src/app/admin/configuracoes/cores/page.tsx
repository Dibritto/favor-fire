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
import { DEFAULT_THEME, type Theme, useTheme } from "@/components/theme-provider";

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

function convertHslThemeToHex(theme: Theme): ColorConfigFormValues {
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


export default function ThemeColorsPage() {
  const { theme, setTheme } = useTheme();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<ColorConfigFormValues>({
    resolver: zodResolver(colorConfigSchema),
    defaultValues: convertHslThemeToHex(theme),
  });
  
  useEffect(() => {
    form.reset(convertHslThemeToHex(theme));
  }, [theme, form]);
  
  function onSubmit(data: ColorConfigFormValues) {
    setIsSubmitting(true);
    
    const newTheme: Theme = { light: {}, dark: {} } as Theme;

    for (const mode of ['light', 'dark'] as const) {
        for (const key in data[mode]) {
            const hexColor = data[mode][key as keyof typeof data.light];
            const [h, s, l] = hexToHsl(hexColor);
            (newTheme[mode] as any)[key] = `${h} ${s}% ${l}%`;
        }
    }

    setTheme(newTheme);

    toast({
      title: "Tema Atualizado!",
      description: "As cores da aplicação foram salvas com sucesso.",
    });

    setIsSubmitting(false);
  }

  const resetToDefault = () => {
    setTheme(DEFAULT_THEME);
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
