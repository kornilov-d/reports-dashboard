"use client";

import Chart from "@/components/reports/charts/Chart";
import { ACCENTS } from "@/lib/dashboard/catalog";
import { formatNumber } from "@/lib/dashboard/format";
import type { AttendanceData } from "@/lib/dashboard/data";
import type { DashboardWidget } from "@/lib/dashboard/types";

export default function AttendanceWidget({
  widget,
  data,
}: {
  widget: DashboardWidget;
  data: AttendanceData;
}) {
  const accent = ACCENTS[widget.appearance.accent ?? "haze"];
  const dense = widget.size !== "2x2";
  const toggles = widget.content.series ?? { valued: true, complimentary: true };

  const series = [
    toggles.valued && { key: "valued", label: "Valued", color: accent.base },
    toggles.complimentary && {
      key: "complimentary",
      label: "Complimentary",
      color: accent.soft,
    },
  ].filter(Boolean) as Array<{ key: string; label: string; color: string }>;

  const points = data.points.map((p) => ({
    label: p.label,
    values: { valued: p.valued, complimentary: p.complimentary },
  }));

  return (
    <div className="flex h-full min-h-0 flex-col">
      {!dense && (
        <div className="flex items-baseline gap-4">
          <span className="text-[20px] font-semibold leading-none tabular-nums">
            {formatNumber(data.totals.valued + data.totals.complimentary)}
          </span>
          <span className="text-[12px] text-[var(--color-mute)]">
            attendees · {formatNumber(data.totals.complimentary)} complimentary
          </span>
        </div>
      )}
      <div className="mt-2 min-h-0 flex-1">
        <Chart
          points={points}
          series={series}
          style={(widget.appearance.chartStyle as "line" | "area" | "bar") ?? "area"}
          showLegend={widget.appearance.showLegend && !dense}
          showValueLabels={widget.appearance.showValueLabels}
          dense={dense}
          formatValue={(n) => formatNumber(n, true)}
        />
      </div>
    </div>
  );
}
