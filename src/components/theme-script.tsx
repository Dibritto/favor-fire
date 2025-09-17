// @ts-nocheck
import MOCK_DEFAULT_THEME from "@/lib/default-theme";
import { hexToHslString } from "@/lib/theme-utils";

const script = () => {
  const MOCK_DEFAULT_THEME_STR = JSON.stringify(MOCK_DEFAULT_THEME);
  const hexToHslString_STR = hexToHslString.toString();
  
  // Esta função IIFE é injetada no <head> para ser executada antes de tudo.
  (function() {
    try {
      // 1. Determina o modo (light/dark)
      const themeMode = localStorage.getItem('app-theme-mode') || 'light';
      const docEl = document.documentElement;
      docEl.classList.add(themeMode);

      // 2. Tenta carregar cores personalizadas do localStorage
      let colors;
      const storedColorsJson = localStorage.getItem('app-colors-hex');
      if (storedColorsJson) {
        colors = JSON.parse(storedColorsJson)[themeMode];
      } else {
        // Fallback para cores padrão se não houver nada no localStorage
        const defaultHslColors = JSON.parse(MOCK_DEFAULT_THEME_STR)[themeMode];
        // Converte as cores padrão HSL para HEX para que a função apply as converta de volta
        // Isso pode ser otimizado, mas mantém a consistência da função apply.
        // A função hslStringToHex é necessária aqui.
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