import type {
  Accent,
  AppearanceConfig,
  ChartStyle,
  ContentConfig,
  DashboardWidget,
  WidgetSize,
  WidgetType,
} from "./types";

export const CHANNELS = [
  { id: "web", label: "Website" },
  { id: "box-office", label: "Box office" },
  { id: "resellers", label: "Resellers" },
  { id: "app", label: "Mobile app" },
  { id: "resale", label: "Resale" },
];

export const TICKET_TYPES = [
  "General Admission",
  "Gold",
  "Platinum",
  "VIP Access",
  "Silver",
  "Early Bird",
];

/** `date` is the show's local start; used to decide whether a period has data. */
export const SHOWS = [
  { id: "all", label: "All shows", date: null as string | null },
  { id: "s-2025-03-14", label: "19:00 / Wed / 14 March 2025", date: "2025-03-14" },
  { id: "s-2025-03-15", label: "19:00 / Thu / 15 March 2025", date: "2025-03-15" },
  { id: "s-2025-03-16", label: "15:00 / Fri / 16 March 2025", date: "2025-03-16" },
  { id: "s-2026-09-11", label: "19:30 / Fri / 11 September 2026", date: "2026-09-11" },
];

export const CURRENCY = "AED";

export type WidgetMeta = {
  type: WidgetType;
  label: string;
  /** One-liner used in the add-widget tray. */
  description: string;
  defaultSize: WidgetSize;
  allowedSizes: WidgetSize[];
  /** Chart styles offered in the appearance section; empty → no style picker. */
  chartStyles: ChartStyle[];
  /** Which content controls the edit popover renders for this type. */
  contentControls: Array<
    | "breakdown"
    | "series"
    | "channels"
    | "channelMetric"
    | "popularityMetric"
    | "limit"
    | "showDelta"
  >;
  /** Which appearance controls the edit popover renders. */
  appearanceControls: Array<
    "chartStyle" | "accent" | "legend" | "valueLabels" | "compactNumbers"
  >;
  defaultContent: ContentConfig;
  defaultAppearance: AppearanceConfig;
  /** Report tab the widget reads from, shown as a source hint. */
  source: string;
};

export const WIDGETS: Record<WidgetType, WidgetMeta> = {
  revenue: {
    type: "revenue",
    label: "Total Revenue",
    description: `Gross revenue for the selected period, in ${CURRENCY}.`,
    defaultSize: "1x1",
    allowedSizes: ["1x1", "1x2"],
    chartStyles: [],
    contentControls: ["showDelta"],
    appearanceControls: ["accent", "compactNumbers"],
    defaultContent: { showDelta: true },
    defaultAppearance: {
      accent: "purple",
      compactNumbers: false,
      chartStyle: "area",
    },
    source: "Revenue report",
  },
  attendance: {
    type: "attendance",
    label: "Attendance Report",
    description: "Valued vs. complimentary attendance over time.",
    defaultSize: "2x2",
    allowedSizes: ["1x2", "2x2"],
    chartStyles: ["line", "area", "bar"],
    contentControls: ["breakdown", "series"],
    appearanceControls: ["chartStyle", "accent", "legend", "valueLabels"],
    defaultContent: {
      breakdown: "daily",
      series: { valued: true, complimentary: true },
    },
    defaultAppearance: {
      chartStyle: "area",
      accent: "haze",
      showLegend: true,
      showValueLabels: false,
    },
    source: "Attendance report",
  },
  channels: {
    type: "channels",
    label: "Channels",
    description: "Distribution of sales or attendance by sales channel.",
    defaultSize: "2x2",
    allowedSizes: ["1x1", "1x2", "2x2"],
    chartStyles: ["bar", "donut"],
    contentControls: ["channelMetric", "channels"],
    appearanceControls: ["chartStyle", "accent", "legend", "valueLabels"],
    defaultContent: {
      channelMetric: "sales",
      channels: CHANNELS.map((c) => c.id),
    },
    defaultAppearance: {
      chartStyle: "donut",
      accent: "suede",
      showLegend: true,
      showValueLabels: true,
    },
    source: "Channels report",
  },
  resale: {
    type: "resale",
    label: "Resale Income",
    description: "Revenue generated on the secondary market over time.",
    defaultSize: "2x2",
    allowedSizes: ["1x2", "2x2"],
    chartStyles: ["line", "area", "bar"],
    contentControls: ["breakdown", "showDelta"],
    appearanceControls: ["chartStyle", "accent", "valueLabels", "compactNumbers"],
    defaultContent: { breakdown: "daily", showDelta: true },
    defaultAppearance: {
      chartStyle: "bar",
      accent: "monday",
      showValueLabels: false,
      compactNumbers: true,
    },
    source: "Revenue report · resale channels",
  },
  popularity: {
    type: "popularity",
    label: "Popularity",
    description: "Tickets distributed per ticket type, ranked.",
    defaultSize: "1x2",
    allowedSizes: ["1x1", "1x2", "2x2"],
    chartStyles: ["bar", "list"],
    contentControls: ["popularityMetric", "limit"],
    appearanceControls: ["chartStyle", "accent", "valueLabels"],
    defaultContent: { popularityMetric: "distributed", limit: 5 },
    defaultAppearance: {
      chartStyle: "bar",
      accent: "purple",
      showValueLabels: true,
    },
    source: "Attendance · by ticket type",
  },
};

export const WIDGET_ORDER: WidgetType[] = [
  "revenue",
  "attendance",
  "channels",
  "resale",
  "popularity",
];

/** Hex values for the accent tokens, needed for SVG gradients and series fills. */
export const ACCENTS: Record<Accent, { base: string; soft: string; label: string }> = {
  purple: { base: "#7e05e8", soft: "#c9a3f5", label: "Purple" },
  haze: { base: "#3c0071", soft: "#9a7ac2", label: "Deep" },
  suede: { base: "#00a5d3", soft: "#79e2ff", label: "Blue" },
  monday: { base: "#1f8a4c", soft: "#8fd3ac", label: "Green" },
  ink: { base: "#0d0d10", soft: "#9c9ca4", label: "Ink" },
};

let seq = 0;
/** Stable-enough id for a client-side layout; collisions don't matter here. */
export function newWidgetId(type: WidgetType) {
  seq += 1;
  return `${type}-${Date.now().toString(36)}-${seq}`;
}

export function createWidget(
  type: WidgetType,
  size?: WidgetSize,
): DashboardWidget {
  const meta = WIDGETS[type];
  return {
    id: newWidgetId(type),
    type,
    size: size ?? meta.defaultSize,
    content: structuredClone(meta.defaultContent),
    appearance: structuredClone(meta.defaultAppearance),
  };
}
