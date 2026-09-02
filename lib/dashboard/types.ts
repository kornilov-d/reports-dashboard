/** Widget sizes are expressed in grid cells as `${cols}x${rows}`. */
export type WidgetSize = "1x1" | "1x2" | "2x2";

export type WidgetType =
  | "revenue"
  | "attendance"
  | "channels"
  | "resale"
  | "popularity";

export type ChartStyle = "line" | "area" | "bar" | "donut" | "list";

export type Accent = "purple" | "haze" | "suede" | "monday" | "ink";

/** What the widget shows. Keys are only meaningful for some widget types. */
export type ContentConfig = {
  /** Attendance / Resale: time bucketing. */
  breakdown?: "hourly" | "daily";
  /** Attendance: which series are plotted. */
  series?: { valued: boolean; complimentary: boolean };
  /** Channels: which channels are included (ids from CHANNELS). */
  channels?: string[];
  /** Channels: sales value vs. attendance count. */
  channelMetric?: "sales" | "attendance";
  /** Popularity: which counter is ranked. */
  popularityMetric?: "distributed" | "sold" | "scanned";
  /** Popularity: cap on how many ticket types are listed. */
  limit?: number;
  /** Revenue / Resale: show the delta vs. the previous period. */
  showDelta?: boolean;
};

/** How the widget looks. Keys are only meaningful for some widget types. */
export type AppearanceConfig = {
  chartStyle?: ChartStyle;
  accent?: Accent;
  showLegend?: boolean;
  showValueLabels?: boolean;
  /** Compact numbers (12.4K) vs. expanded (12,430). */
  compactNumbers?: boolean;
};

export type DashboardWidget = {
  id: string;
  type: WidgetType;
  size: WidgetSize;
  content: ContentConfig;
  appearance: AppearanceConfig;
};

export type PeriodPreset =
  | "today"
  | "last7"
  | "last30"
  | "thisMonth"
  | "custom";

export type Filters = {
  preset: PeriodPreset;
  /** Only used when `preset` is "custom"; ISO date + HH:MM. */
  customFrom: { date: string | null; time: string };
  customTo: { date: string | null; time: string };
  /** "all" aggregates every show under the account. */
  showId: string;
};

/** Cell span of a size token. */
export function sizeSpan(size: WidgetSize): { w: number; h: number } {
  const [w, h] = size.split("x").map(Number);
  return { w, h };
}
