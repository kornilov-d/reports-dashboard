"use client";

import RankedBars from "@/components/reports/charts/RankedBars";
import Stat from "./Stat";
import { ACCENTS } from "@/lib/dashboard/catalog";
import { formatNumber, formatShare } from "@/lib/dashboard/format";
import type { PopularityData } from "@/lib/dashboard/data";
import type { DashboardWidget } from "@/lib/dashboard/types";

const METRIC_LABEL: Record<string, string> = {
  distributed: "distributed",
  sold: "sold",
  scanned: "scanned",
};

export default function PopularityWidget({
  widget,
  data,
}: {
  widget: DashboardWidget;
  data: PopularityData;
}) {
  const accent = ACCENTS[widget.appearance.accent ?? "purple"];
  const metric = METRIC_LABEL[widget.content.popularityMetric ?? "distributed"];

  if (widget.size === "1x1") {
    const top = data.items[0];
    return (
      <Stat
        value={top ? top.label : "—"}
        caption={
          top
            ? `${formatNumber(top.value)} ${metric} · ${formatShare(top.value, data.total)}`
            : undefined
        }
      />
    );
  }

  if ((widget.appearance.chartStyle ?? "bar") === "list") {
    return (
      <ul className="flex h-full flex-col divide-y divide-[var(--color-line-2)] overflow-hidden">
        {data.items.map((item, i) => (
          <li
            key={item.label}
            className="flex min-h-0 flex-1 items-center gap-2 text-[12px]"
          >
            <span className="w-4 shrink-0 tabular-nums text-[var(--color-mute-2)]">
              {i + 1}
            </span>
            <span className="truncate text-[var(--color-ink)]">{item.label}</span>
            <span className="ml-auto shrink-0 font-medium tabular-nums">
              {formatNumber(item.value)}
            </span>
          </li>
        ))}
      </ul>
    );
  }

  return (
    <RankedBars
      items={data.items.map((i) => ({ id: i.label, label: i.label, value: i.value }))}
      color={accent.base}
      formatValue={(n) => formatNumber(n)}
      showValueLabels={widget.appearance.showValueLabels ?? true}
      dense={widget.size === "1x2"}
    />
  );
}
