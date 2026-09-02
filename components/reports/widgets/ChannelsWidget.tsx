"use client";

import Donut from "@/components/reports/charts/Donut";
import RankedBars from "@/components/reports/charts/RankedBars";
import Stat from "./Stat";
import { ACCENTS } from "@/lib/dashboard/catalog";
import { tintRamp } from "@/lib/dashboard/color";
import { formatCurrency, formatNumber, formatShare } from "@/lib/dashboard/format";
import type { ChannelsData } from "@/lib/dashboard/data";
import type { DashboardWidget } from "@/lib/dashboard/types";

export default function ChannelsWidget({
  widget,
  data,
}: {
  widget: DashboardWidget;
  data: ChannelsData;
}) {
  const accent = ACCENTS[widget.appearance.accent ?? "suede"];
  const isMoney = (widget.content.channelMetric ?? "sales") === "sales";
  const format = (n: number) =>
    isMoney ? formatCurrency(n, true) : formatNumber(n, true);

  if (widget.size === "1x1") {
    const top = data.items[0];
    return (
      <Stat
        value={top ? top.label : "—"}
        caption={
          top
            ? `${format(top.value)} · ${formatShare(top.value, data.total)} of total`
            : undefined
        }
      />
    );
  }

  if ((widget.appearance.chartStyle ?? "donut") === "donut" && widget.size === "2x2") {
    const palette = tintRamp(accent.base, data.items.length);
    return (
      <div className="h-full min-h-0">
        <Donut
          slices={data.items.map((item, i) => ({
            id: item.id,
            label: item.label,
            value: item.value,
            color: palette[i],
          }))}
          centerLabel={isMoney ? "total sales" : "total attendance"}
          centerValue={format(data.total)}
          showValueLabels={widget.appearance.showValueLabels ?? true}
          formatValue={format}
        />
        {widget.appearance.showLegend && (
          <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1">
            {data.items.map((item, i) => (
              <span
                key={item.id}
                className="flex items-center gap-1.5 text-[11px] text-[var(--color-mute)]"
              >
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ background: palette[i] }}
                />
                {item.label}
              </span>
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <RankedBars
      items={data.items.map((i) => ({ id: i.id, label: i.label, value: i.value }))}
      color={accent.base}
      formatValue={format}
      showValueLabels={widget.appearance.showValueLabels ?? true}
      dense={widget.size !== "2x2"}
    />
  );
}
