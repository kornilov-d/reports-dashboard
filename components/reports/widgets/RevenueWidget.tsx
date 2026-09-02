"use client";

import Sparkline from "@/components/reports/charts/Sparkline";
import Stat from "./Stat";
import { ACCENTS } from "@/lib/dashboard/catalog";
import { formatCurrency, formatDelta } from "@/lib/dashboard/format";
import type { RevenueData } from "@/lib/dashboard/data";
import type { DashboardWidget } from "@/lib/dashboard/types";

export default function RevenueWidget({
  widget,
  data,
}: {
  widget: DashboardWidget;
  data: RevenueData;
}) {
  const accent = ACCENTS[widget.appearance.accent ?? "purple"];
  const compact = widget.appearance.compactNumbers ?? false;
  const delta = formatDelta(data.total, data.previous);
  const tall = widget.size === "1x2";

  return (
    <Stat
      value={formatCurrency(data.total, compact)}
      caption={
        widget.content.showDelta ? "vs. previous period" : undefined
      }
      delta={widget.content.showDelta ? delta : undefined}
    >
      {tall && (
        <Sparkline values={data.points.map((p) => p.value)} color={accent.base} />
      )}
    </Stat>
  );
}
