// @ts-nocheck

const script = () => {
  // Esta função IIFE é injetada no <head> para ser executada antes de tudo.
  // As dependências são embutidas diretamente para torná-lo autônomo.
  (function() {
    try {
      const MOCK_DEFAULT_THEME_STR = `{
        "light": {
          "background": "0 0% 100%", "foreground": "222.2 84% 4.9%", "card": "0 0% 100%",
          "cardForeground": "222.2 84% 4.9%", "popover": "0 0% 100%", "popoverForeground": "222.2 84% 4.9%",
          "primary": "219 16% 50%", "primaryForeground": "210 40% 98%", "secondary": "210 8% 59%",
          "secondaryForeground": "222.2 47.4% 11.2%", "muted": "210 40% 96.1%", "mutedForeground": "215.4 16.3% 46.9%",
          "accent": "326 9% 55%", "accentForeground": "210 40% 98%", "destructive": "0 84.2% 60.2%",
          "destructiveForeground": "210 40% 98%", "border": "0 0% 83.1%", "input": "0 0% 83.1%", "ring": "219 16% 50%",
          "sidebarBackground": "210 40% 98%", "sidebarForeground": "222.2 84% 4.9%", "sidebarPrimary": "219 16% 50%",
          "sidebarPrimaryForeground": "210 40% 98%", "sidebarAccent": "210 40% 94.1%", "sidebarAccentForeground": "222.2 84% 4.9%",
          "sidebarBorder": "210 40% 90.1%", "sidebarRing": "219 16% 50%"
        },
        "dark": {
          "background": "222.2 84% 4.9%", "foreground": "210 40% 98%", "card": "222.2 84% 4.9%", "cardForeground": "210 40% 98%",
          "popover": "222.2 84% 4.9%", "popoverForeground": "210 40% 98%", "primary": "219 16% 60%", "primaryForeground": "222.2 47.4% 11.2%",
          "secondary": "217.2 32.6% 17.5%", "secondaryForeground": "210 40% 98%", "muted": "217.2 32.6% 17.5%", "mutedForeground": "215 20.2% 65.1%",
          "accent": "326 9% 65%", "accentForeground": "210 40% 98%", "destructive": "0 62.8% 50.6%", "destructiveForeground": "210 40% 98%",
          "border": "217.2 32.6% 17.5%", "input": "217.2 32.6% 17.5%", "ring": "219 16% 60%", "sidebarBackground": "222.2 84% 5.9%",
          "sidebarForeground": "210 40% 98%", "sidebarPrimary": "210 40% 98%", "sidebarPrimaryForeground": "222.2 47.4% 11.2%",
          "sidebarAccent": "217.2 32.6% 17.5%", "sidebarAccentForeground": "210 40% 98%", "sidebarBorder": "217.2 32.6% 17.5%",
          "sidebarRing": "212.7 26.8% 83.9%"
        }
      }`;
      
      const hexToHslStringFn = (hex) => {
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
      
      // 1. Determina o modo (light/dark)
      const themeMode = localStorage.getItem('app-theme-mode') || 'light';
      const docEl = document.documentElement;
      docEl.classList.add(themeMode);

      // 2. Tenta carregar cores personalizadas do localStorage
      let colors;
      const storedColorsJson = localStorage.getItem('app-colors-hex');
      const defaultTheme = JSON.parse(MOCK_DEFAULT_THEME_STR);

      if (storedColorsJson) {
        colors = JSON.parse(storedColorsJson)[themeMode];
      } else {
        // Fallback: Converte as cores HSL padrão para HEX e usa
        const defaultHslColors = defaultTheme[themeMode];
        const hslToHex = (h, s, l) => {
          s /= 100; l /= 100;
          const k = (n) => (n + h / 30) % 12;
          const a = s * Math.min(l, 1 - l);
          const f = (n) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
          return `#${[0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('')}`;
        };
        const hslStringToHex = (hsl) => {
            if (!hsl) return '#000000';
            const parts = hsl.split(" ");
            if (parts.length !== 3) return '#000000';
            const [h, s, l] = parts.map(val => parseFloat(val.replace('%', '')));
            if (isNaN(h) || isNaN(s) || isNaN(l)) return '#000000';
            return hslToHex(h, s, l);
        };
        colors = {};
        for (const key in defaultHslColors) {
            colors[key] = hslStringToHex(defaultHslColors[key]);
        }
      }

      // 3. Aplica as cores como variáveis CSS
      if (colors) {
        const style = [];
        for (const key in colors) {
          const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
          const hslString = hexToHslStringFn(colors[key]);
          style.push(`${cssVarName}: ${hslString};`);
        }
        docEl.style.cssText = style.join('');
      }
    } catch (e) {
      console.error('Falha ao aplicar o tema a partir do script.', e);
    }
  })();
};

export function ThemeScript() {
  const functionString = `(${script.toString()})();`;
  
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: functionString,
      }}
    />
  );
}
