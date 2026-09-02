"use client";

export type RankedItem = { id: string; label: string; value: number };

/** Horizontal ranked bars — used by Popularity and the Channels bar style. */
export default function RankedBars({
  items,
  color,
  formatValue,
  showValueLabels = true,
  dense = false,
}: {
  items: RankedItem[];
  color: string;
  formatValue: (n: number) => string;
  showValueLabels?: boolean;
  dense?: boolean;
}) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <ul className="flex h-full flex-col justify-between gap-1 overflow-hidden">
      {items.map((item, index) => (
        <li key={item.id} className="min-h-0 flex-1">
          <div className="flex items-baseline justify-between gap-2">
            <span
              className={[
                "truncate text-[var(--color-ink)]",
                dense ? "text-[11px]" : "text-[12px]",
              ].join(" ")}
              title={item.label}
            >
              {!dense && (
                <span className="mr-1.5 text-[var(--color-mute-2)] tabular-nums">
                  {index + 1}
                </span>
              )}
              {item.label}
            </span>
            {showValueLabels && (
              <span className="shrink-0 text-[11px] font-medium tabular-nums text-[var(--color-mute)]">
                {formatValue(item.value)}
              </span>
            )}
          </div>
          <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-[var(--color-line-2)]">
            <div
              className="h-full rounded-full transition-[width] duration-500"
              style={{
                width: `${Math.max(3, (item.value / max) * 100)}%`,
                background: color,
              }}
            />
          </div>
        </li>
      ))}
    </ul>
  );
}
