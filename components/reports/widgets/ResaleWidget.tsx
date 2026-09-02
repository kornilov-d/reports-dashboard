"use client";

import Chart from "@/components/reports/charts/Chart";
import { ACCENTS } from "@/lib/dashboard/catalog";
import { formatCurrency, formatDelta, formatNumber } from "@/lib/dashboard/format";
import type { ResaleData } from "@/lib/dashboard/data";
import type { DashboardWidget } from "@/lib/dashboard/types";

export default function ResaleWidget({
  widget,
  data,
}: {
  widget: DashboardWidget;
  data: ResaleData;
}) {
  const accent = ACCENTS[widget.appearance.accent ?? "monday"];
  const dense = widget.size !== "2x2";
  const compact = widget.appearance.compactNumbers ?? true;
  const delta = formatDelta(data.total, data.previous);

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-baseline gap-x-2">
        <span className="text-[20px] font-semibold leading-none tabular-nums">
          {formatCurrency(data.total, compact)}
        </span>
        {widget.content.showDelta && delta.label !== "—" && (
          <span
            className={[
              "text-[12px] font-medium tabular-nums",
              delta.direction === "up"
                ? "text-[var(--color-success)]"
                : "text-[var(--color-danger)]",
            ].join(" ")}
          >
            {delta.direction === "up" ? "▲" : "▼"} {delta.label}
          </span>
        )}
      </div>
      <div className="mt-2 min-h-0 flex-1">
        <Chart
          points={data.points.map((p) => ({
            label: p.label,
            values: { resale: p.value },
          }))}
          series={[
            { key: "resale", label: "Resale income", color: accent.base },
          ]}
          style={(widget.appearance.chartStyle as "line" | "area" | "bar") ?? "bar"}
          showValueLabels={widget.appearance.showValueLabels}
          dense={dense}
          formatValue={(n) => formatCurrency(n, true)}
          formatAxisValue={(n) => formatNumber(n, true)}
        />
      </div>
    </div>
  );
}
