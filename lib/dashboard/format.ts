import { CURRENCY } from "./catalog";

/** 12430 → "12.4K" (compact) or "12,430" (expanded). */
export function formatNumber(value: number, compact = false): string {
  if (!Number.isFinite(value)) return "—";
  if (compact) {
    const abs = Math.abs(value);
    if (abs >= 1_000_000) return `${trim(value / 1_000_000)}M`;
    if (abs >= 1_000) return `${trim(value / 1_000)}K`;
    return `${Math.round(value)}`;
  }
  return Math.round(value).toLocaleString("en-US");
}

function trim(n: number) {
  const rounded = Math.round(n * 10) / 10;
  return `${rounded}`;
}

export function formatCurrency(value: number, compact = false): string {
  return `${formatNumber(value, compact)} ${CURRENCY}`;
}

/** Signed percentage change, "—" when the baseline is zero. */
export function formatDelta(current: number, previous: number): {
  label: string;
  direction: "up" | "down" | "flat";
} {
  if (!previous) return { label: "—", direction: "flat" };
  const pct = ((current - previous) / previous) * 100;
  const rounded = Math.round(pct * 10) / 10;
  if (rounded === 0) return { label: "0%", direction: "flat" };
  return {
    label: `${rounded > 0 ? "+" : ""}${rounded}%`,
    direction: rounded > 0 ? "up" : "down",
  };
}

export function formatShare(value: number, total: number): string {
  if (!total) return "0%";
  return `${Math.round((value / total) * 100)}%`;
}
