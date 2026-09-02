/** #rrggbb → {h, s, l} with s/l in percent. */
function hexToHsl(hex: string) {
  const clean = hex.replace("#", "");
  const r = parseInt(clean.slice(0, 2), 16) / 255;
  const g = parseInt(clean.slice(2, 4), 16) / 255;
  const b = parseInt(clean.slice(4, 6), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const l = (max + min) / 2;
  let h = 0;
  let s = 0;
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return { h, s: s * 100, l: l * 100 };
}

/**
 * `count` tints of a single accent, from the accent itself to a pale version,
 * so multi-series charts stay on-brand without a second palette.
 */
export function tintRamp(hex: string, count: number): string[] {
  const { h, s, l } = hexToHsl(hex);
  if (count <= 1) return [hex];
  const topL = Math.min(86, l + 42);
  return Array.from({ length: count }, (_, i) => {
    const t = i / (count - 1);
    const lightness = l + (topL - l) * t;
    const saturation = Math.max(28, s - t * 22);
    return `hsl(${Math.round(h)} ${Math.round(saturation)}% ${Math.round(lightness)}%)`;
  });
}
