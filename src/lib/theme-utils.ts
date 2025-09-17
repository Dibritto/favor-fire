"use client";

// Helper function to convert hex to HSL string "h s% l%"
export const hexToHslString = (hex: string): string => {
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

export const hslToHex = (h: number, s: number, l: number): string => {
    s /= 100; l /= 100;
    const k = (n: number) => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));
    return `#${[0, 8, 4].map(n => Math.round(f(n) * 255).toString(16).padStart(2, '0')).join('')}`;
};

export const hslStringToHex = (hsl: string): string => {
    if (!hsl) return '#000000';
    const parts = hsl.split(" ");
    if (parts.length !== 3) return '#000000';
    const [h, s, l] = parts.map(val => parseFloat(val.replace('%', '')));
    if (isNaN(h) || isNaN(s) || isNaN(l)) return '#000000';
    return hslToHex(h, s, l);
};


// Function to apply theme colors to the root element
export const applyThemeColors = (colors: Record<string, string>) => {
    const root = document.documentElement;
    Object.keys(colors).forEach((key) => {
        const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
        const hslString = hexToHslString(colors[key]);
        root.style.setProperty(cssVarName, hslString);
    });
};
