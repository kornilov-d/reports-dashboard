"use client";

import PeriodPicker from "./PeriodPicker";
import Select from "@/components/ui/Select";
import { SHOWS } from "@/lib/dashboard/catalog";
import type { Filters } from "@/lib/dashboard/types";

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
  return (
    <div className="flex flex-wrap items-center gap-3">
      <PeriodPicker filters={filters} onChange={onChange} />

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
  );
}
