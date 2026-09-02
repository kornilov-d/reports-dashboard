"use client";

import DateTimePicker from "@/components/ui/DateTimePicker";
import Select from "@/components/ui/Select";
import { Clock } from "@/components/icons";
import { SHOWS } from "@/lib/dashboard/catalog";
import { resolvePeriod } from "@/lib/dashboard/data";
import { isoDate } from "@/lib/date";
import type { Filters, PeriodPreset } from "@/lib/dashboard/types";

const PRESETS: Array<{ value: PeriodPreset; label: string }> = [
  { value: "today", label: "Today" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
  { value: "thisMonth", label: "This month" },
  { value: "custom", label: "Custom range" },
];

function toDate(value: string | null) {
  if (!value) return null;
  const [y, m, d] = value.split("-").map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}

/**
 * Top-level scope for every widget on the dashboard (spec §8). Widgets can
 * narrow further in their own content config but never widen past this.
 */
export default function FilterBar({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const custom = filters.preset === "custom";

  /** Switching to a custom range seeds the fields from the period in view. */
  function selectPreset(preset: PeriodPreset) {
    if (preset !== "custom" || filters.customFrom.date) {
      onChange({ ...filters, preset });
      return;
    }
    const period = resolvePeriod(filters);
    onChange({
      ...filters,
      preset,
      customFrom: { date: isoDate(period.from), time: "00:00" },
      customTo: { date: isoDate(period.to), time: "23:59" },
    });
  }

  return (
    <div className="rounded-xl border border-[var(--color-line)] bg-[var(--color-surface-2)] p-2">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-1 rounded-lg bg-white p-1 shadow-[0_0_0_1px_var(--color-line)]">
          {PRESETS.map((p) => (
            <button
              key={p.value}
              type="button"
              onClick={() => selectPreset(p.value)}
              className={[
                "h-8 rounded-md px-3 text-[13px] font-medium transition-colors",
                filters.preset === p.value
                  ? "bg-[var(--color-ink)] text-white"
                  : "text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]",
              ].join(" ")}
            >
              {p.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[13px] text-[var(--color-mute)]">Show</span>
          <Select
            aria-label="Show"
            value={filters.showId}
            onChange={(e) => onChange({ ...filters, showId: e.target.value })}
            className="min-w-[220px]"
          >
            {SHOWS.map((s) => (
              <option key={s.id} value={s.id}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {custom && (
        <div className="mt-2 grid gap-2 sm:grid-cols-2">
          <DateTimePicker
            placeholder="Start date & time"
            value={{
              date: toDate(filters.customFrom.date),
              time: filters.customFrom.time,
            }}
            onChange={(next) =>
              onChange({
                ...filters,
                customFrom: {
                  date: next.date ? isoDate(next.date) : null,
                  time: next.time,
                },
              })
            }
          />
          <DateTimePicker
            placeholder="End date & time"
            icon={<Clock size={18} />}
            value={{
              date: toDate(filters.customTo.date),
              time: filters.customTo.time,
            }}
            onChange={(next) =>
              onChange({
                ...filters,
                customTo: {
                  date: next.date ? isoDate(next.date) : null,
                  time: next.time,
                },
              })
            }
          />
        </div>
      )}
    </div>
  );
}
