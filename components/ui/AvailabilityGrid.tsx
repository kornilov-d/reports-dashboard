"use client";

export type DaySlots = {
  /** Display label like "Fri 10 Apr 2026". */
  label: string;
  times: string[];
  /** Indexes (into `times`) of currently selected slots. */
  selected: Set<number>;
};

export default function AvailabilityGrid({
  days,
  onToggle,
}: {
  days: DaySlots[];
  onToggle: (dayIndex: number, timeIndex: number) => void;
}) {
  return (
    <div className="space-y-3">
      {days.map((d, di) => (
        <div
          key={di}
          className="grid grid-cols-[120px_1fr] items-start gap-3"
        >
          <div className="pt-1.5 text-[13px] text-[var(--color-mute)]">
            {d.label}
          </div>
          <div className="flex flex-wrap gap-2">
            {d.times.map((t, ti) => {
              const on = d.selected.has(ti);
              return (
                <button
                  key={ti}
                  type="button"
                  onClick={() => onToggle(di, ti)}
                  className={[
                    "inline-flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium tabular-nums transition-colors",
                    on
                      ? "bg-[var(--color-ink)] text-white"
                      : "bg-[var(--color-line-2)] text-[var(--color-ink)] hover:bg-[#e3e3e7]",
                  ].join(" ")}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
