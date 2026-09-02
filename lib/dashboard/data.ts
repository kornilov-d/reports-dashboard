import { CHANNELS, SHOWS } from "./catalog";
import type { DashboardWidget, Filters } from "./types";

/* ------------------------------------------------------------------ *
 * Deterministic pseudo-random source                                   *
 * Same filters + same widget always produce the same numbers, so the   *
 * demo dashboard is stable across re-renders and reloads.              *
 * ------------------------------------------------------------------ */

function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: string): () => number {
  let a = hash(seed);
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Smooth-ish series: a random walk around a base level with a gentle arc, so
 * charts read like real sales curves instead of white noise.
 */
function walk(
  rand: () => number,
  count: number,
  base: number,
  volatility = 0.22,
): number[] {
  const out: number[] = [];
  let level = base * (0.75 + rand() * 0.5);
  for (let i = 0; i < count; i++) {
    const arc = 0.7 + 0.45 * Math.sin((i / Math.max(1, count - 1)) * Math.PI);
    level = Math.max(base * 0.25, level * (1 + (rand() - 0.48) * volatility));
    out.push(Math.round(level * arc));
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * Period resolution                                                    *
 * ------------------------------------------------------------------ */

export type Period = {
  from: Date;
  to: Date;
  /** Whole days covered, at least 1. */
  days: number;
  label: string;
};

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function addDays(d: Date, n: number) {
  const next = new Date(d);
  next.setDate(next.getDate() + n);
  return next;
}

function parseCustom(part: { date: string | null; time: string }, fallback: Date) {
  if (!part.date) return fallback;
  const [y, m, d] = part.date.split("-").map(Number);
  const [hh, mm] = (part.time || "00:00").split(":").map(Number);
  return new Date(y, (m || 1) - 1, d || 1, hh || 0, mm || 0);
}

export function resolvePeriod(filters: Filters, now = new Date()): Period {
  const today = startOfDay(now);
  switch (filters.preset) {
    case "today":
      return { from: today, to: now, days: 1, label: "Today" };
    case "thisWeek": {
      const from = addDays(today, -((now.getDay() + 6) % 7)); // week starts Monday
      return {
        from,
        to: now,
        days: ((now.getDay() + 6) % 7) + 1,
        label: "This week",
      };
    }
    case "last7":
      return {
        from: addDays(today, -6),
        to: now,
        days: 7,
        label: "Last 7 days",
      };
    case "last30":
      return {
        from: addDays(today, -29),
        to: now,
        days: 30,
        label: "Last 30 days",
      };
    case "thisMonth": {
      const from = new Date(now.getFullYear(), now.getMonth(), 1);
      return {
        from,
        to: now,
        days: Math.max(1, now.getDate()),
        label: "This month",
      };
    }
    case "custom": {
      const from = parseCustom(filters.customFrom, addDays(today, -6));
      const to = parseCustom(filters.customTo, now);
      const days = Math.max(
        1,
        Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / 86400000) + 1,
      );
      return { from, to, days, label: "Custom range" };
    }
  }
}

const MONTHS_SHORT = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

/**
 * Bucket labels for a period. `hourly` is only meaningful for short ranges, so
 * long ranges fall back to days even when the widget asks for hours.
 */
function bucketLabels(
  period: Period,
  breakdown: "hourly" | "daily" | undefined,
): string[] {
  const useHours = breakdown === "hourly" && period.days <= 2;
  if (useHours || period.days === 1) {
    const labels: string[] = [];
    for (let h = 10; h <= 23; h++) labels.push(`${`${h}`.padStart(2, "0")}:00`);
    return labels;
  }
  const labels: string[] = [];
  const step = period.days > 31 ? Math.ceil(period.days / 30) : 1;
  for (let i = 0; i < period.days; i += step) {
    const d = addDays(startOfDay(period.from), i);
    labels.push(`${d.getDate()} ${MONTHS_SHORT[d.getMonth()]}`);
  }
  return labels;
}

/* ------------------------------------------------------------------ *
 * Availability: a specific show only has data while it is on sale      *
 * ------------------------------------------------------------------ */

const ON_SALE_DAYS = 120;

function hasDataFor(filters: Filters, period: Period): boolean {
  const show = SHOWS.find((s) => s.id === filters.showId);
  if (!show || !show.date) return true; // "All shows" always has data
  const [y, m, d] = show.date.split("-").map(Number);
  const showDate = new Date(y, m - 1, d, 23, 59);
  const onSaleFrom = addDays(showDate, -ON_SALE_DAYS);
  return period.to >= onSaleFrom && period.from <= showDate;
}

/* ------------------------------------------------------------------ *
 * Widget payloads                                                      *
 * ------------------------------------------------------------------ */

export type RevenueData = {
  kind: "revenue";
  total: number;
  previous: number;
  points: Array<{ label: string; value: number }>;
};

export type AttendanceData = {
  kind: "attendance";
  points: Array<{ label: string; valued: number; complimentary: number }>;
  totals: { valued: number; complimentary: number };
};

export type ChannelsData = {
  kind: "channels";
  items: Array<{ id: string; label: string; value: number }>;
  total: number;
};

export type ResaleData = {
  kind: "resale";
  points: Array<{ label: string; value: number }>;
  total: number;
  previous: number;
};

export type PopularityData = {
  kind: "popularity";
  items: Array<{ label: string; value: number }>;
  total: number;
};

export type WidgetData =
  | RevenueData
  | AttendanceData
  | ChannelsData
  | ResaleData
  | PopularityData;

/** True when a payload carries no rows worth charting. */
export function isEmptyData(data: WidgetData): boolean {
  switch (data.kind) {
    case "revenue":
      return data.total === 0;
    case "attendance":
      return data.points.length === 0 || data.totals.valued + data.totals.complimentary === 0;
    case "channels":
      return data.items.length === 0 || data.total === 0;
    case "resale":
      return data.points.length === 0 || data.total === 0;
    case "popularity":
      return data.items.length === 0 || data.total === 0;
  }
}

/** Scale factor so "All shows" reads bigger than a single show. */
function scaleFor(filters: Filters) {
  return filters.showId === "all" ? 1 : 0.28;
}

function seedFor(widget: DashboardWidget, filters: Filters, period: Period) {
  return [
    widget.type,
    filters.showId,
    filters.preset,
    period.from.toDateString(),
    period.to.toDateString(),
  ].join("|");
}

function buildData(
  widget: DashboardWidget,
  filters: Filters,
  period: Period,
): WidgetData {
  const empty = !hasDataFor(filters, period);
  const rand = rng(seedFor(widget, filters, period));
  const scale = scaleFor(filters);
  const labels = bucketLabels(period, widget.content.breakdown);

  switch (widget.type) {
    case "revenue": {
      if (empty) return { kind: "revenue", total: 0, previous: 0, points: [] };
      const series = walk(rand, labels.length, 16000 * scale);
      const points = labels.map((label, i) => ({ label, value: series[i] }));
      const total = points.reduce((sum, p) => sum + p.value, 0);
      return {
        kind: "revenue",
        total,
        previous: Math.round(total * (0.72 + rand() * 0.5)),
        points,
      };
    }

    case "attendance": {
      if (empty) {
        return {
          kind: "attendance",
          points: [],
          totals: { valued: 0, complimentary: 0 },
        };
      }
      const valued = walk(rand, labels.length, 320 * scale);
      const comp = walk(rand, labels.length, 48 * scale, 0.3);
      const points = labels.map((label, i) => ({
        label,
        valued: valued[i],
        complimentary: comp[i],
      }));
      return {
        kind: "attendance",
        points,
        totals: {
          valued: points.reduce((s, p) => s + p.valued, 0),
          complimentary: points.reduce((s, p) => s + p.complimentary, 0),
        },
      };
    }

    case "channels": {
      const selected = widget.content.channels ?? CHANNELS.map((c) => c.id);
      if (empty) return { kind: "channels", items: [], total: 0 };
      const weights: Record<string, number> = {
        web: 0.44,
        "box-office": 0.17,
        resellers: 0.21,
        app: 0.12,
        resale: 0.06,
      };
      const base = widget.content.channelMetric === "attendance" ? 9200 : 486000;
      const items = CHANNELS.filter((c) => selected.includes(c.id)).map((c) => ({
        id: c.id,
        label: c.label,
        value: Math.round(base * (weights[c.id] ?? 0.1) * (0.82 + rand() * 0.36) * scale),
      }));
      items.sort((a, b) => b.value - a.value);
      return {
        kind: "channels",
        items,
        total: items.reduce((s, i) => s + i.value, 0),
      };
    }

    case "resale": {
      if (empty) return { kind: "resale", points: [], total: 0, previous: 0 };
      const series = walk(rand, labels.length, 1800 * scale, 0.32);
      const points = labels.map((label, i) => ({ label, value: series[i] }));
      const total = points.reduce((s, p) => s + p.value, 0);
      return {
        kind: "resale",
        points,
        total,
        previous: Math.round(total * (0.65 + rand() * 0.6)),
      };
    }

    case "popularity": {
      if (empty) return { kind: "popularity", items: [], total: 0 };
      const metric = widget.content.popularityMetric ?? "distributed";
      const factor = metric === "scanned" ? 0.78 : metric === "sold" ? 0.94 : 1;
      // Cheaper tiers sell in far greater volume than premium ones.
      const weights: Array<[string, number]> = [
        ["General Admission", 1],
        ["Silver", 0.62],
        ["Gold", 0.41],
        ["Early Bird", 0.3],
        ["Platinum", 0.19],
        ["VIP Access", 0.09],
      ];
      const items = weights.map(([label, weight]) => ({
        label,
        value: Math.round(3200 * weight * (0.75 + rand() * 0.5) * factor * scale),
      }));
      items.sort((a, b) => b.value - a.value);
      const limited = items.slice(0, widget.content.limit ?? 5);
      return {
        kind: "popularity",
        items: limited,
        total: limited.reduce((s, i) => s + i.value, 0),
      };
    }
  }
}

/* ------------------------------------------------------------------ *
 * Fetch simulation                                                     *
 * ------------------------------------------------------------------ */

export type FetchOptions = {
  /** Retry counter; a retry never fails, so the affordance always recovers. */
  attempt?: number;
  /** `?simulateErrors=1` fails every widget's first load; retries succeed. */
  simulateErrors?: boolean;
  now?: Date;
};

export function fetchWidgetData(
  widget: DashboardWidget,
  filters: Filters,
  options: FetchOptions = {},
): Promise<WidgetData> {
  const { attempt = 0, simulateErrors = false, now } = options;
  const period = resolvePeriod(filters, now);
  const seed = seedFor(widget, filters, period) + `|${widget.id}`;
  const jitter = rng(seed)();
  const delay = 260 + Math.round(jitter * 640);

  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (simulateErrors && attempt === 0) {
        reject(new Error("Report service did not respond"));
        return;
      }
      resolve(buildData(widget, filters, period));
    }, delay);
  });
}
