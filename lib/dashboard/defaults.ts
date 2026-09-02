import { createWidget } from "./catalog";
import type { DashboardWidget, Filters } from "./types";

/**
 * Pre-made demo layout (spec §7). With the first-fit packer this resolves to:
 *
 *   Row 1:  [ Revenue 1x1 ][ Attendance 2x2 ][ Popularity 1x2 ]
 *   Row 2:  [ Channels 1x1 ][   (cont.)     ][    (cont.)     ]
 *   Row 3:  [ Resale Income 2x2 ][  empty   ][     empty      ]
 */
export function defaultWidgets(): DashboardWidget[] {
  return [
    createWidget("revenue", "1x1"),
    createWidget("attendance", "2x2"),
    createWidget("popularity", "1x2"),
    createWidget("channels", "1x1"),
    createWidget("resale", "2x2"),
  ];
}

export const DEFAULT_FILTERS: Filters = {
  preset: "last30",
  customFrom: { date: null, time: "00:00" },
  customTo: { date: null, time: "23:59" },
  showId: "all",
};

const STORAGE_KEY = "reports.dashboard.v1";

export type PersistedState = {
  widgets: DashboardWidget[];
  filters: Filters;
};

/** Layouts are per-browser for now; see the open question in the spec (§10). */
export function loadState(): PersistedState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PersistedState;
    if (!Array.isArray(parsed.widgets) || !parsed.filters) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function saveState(state: PersistedState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    /* storage disabled — the dashboard still works, it just won't persist */
  }
}

export function clearState() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* no-op */
  }
}
