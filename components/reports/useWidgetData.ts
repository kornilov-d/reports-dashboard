"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { fetchWidgetData, isEmptyData, type WidgetData } from "@/lib/dashboard/data";
import type { DashboardWidget, Filters } from "@/lib/dashboard/types";

export type WidgetState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "empty" }
  | { status: "ready"; data: WidgetData };

/**
 * Per-widget fetch so a slow or failing widget never blocks its neighbours.
 * Re-runs whenever the top-level filters or the widget's content config change;
 * appearance-only edits re-render without a round trip.
 */
export function useWidgetData(
  widget: DashboardWidget,
  filters: Filters,
  simulateErrors = false,
): WidgetState & { retry: () => void } {
  const [state, setState] = useState<WidgetState>({ status: "loading" });
  const [attempt, setAttempt] = useState(0);
  const latest = useRef(0);

  const contentKey = JSON.stringify(widget.content);
  const filtersKey = JSON.stringify(filters);

  useEffect(() => {
    const run = ++latest.current;
    setState({ status: "loading" });
    fetchWidgetData(widget, filters, { attempt, simulateErrors })
      .then((data) => {
        if (latest.current !== run) return;
        setState(isEmptyData(data) ? { status: "empty" } : { status: "ready", data });
      })
      .catch((error: Error) => {
        if (latest.current !== run) return;
        setState({ status: "error", message: error.message });
      });
    // `widget` is intentionally not a dependency: only its identity, type and
    // content config change what the report returns.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widget.id, widget.type, contentKey, filtersKey, attempt, simulateErrors]);

  const retry = useCallback(() => setAttempt((a) => a + 1), []);

  return { ...state, retry };
}
