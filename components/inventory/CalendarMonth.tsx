"use client";

import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight, Plus } from "@/components/icons";
import Button from "@/components/ui/Button";
import {
  buildMarch2026,
  dayCellsForMonth,
  WEEKDAY_LABELS,
  type Show,
} from "@/lib/calendar";
import AddShowModal from "@/components/inventory/AddShowModal";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export default function CalendarMonth() {
  const [month, setMonth] = useState(2); // March
  const [year, setYear] = useState(2026);
  const [addOpen, setAddOpen] = useState(false);
  const [userShows, setUserShows] = useState<Show[]>([]);

  const cells = useMemo(() => {
    const baseline =
      year === 2026 && month === 2 ? buildMarch2026() : undefined;
    return dayCellsForMonth(year, month, userShows, baseline);
  }, [year, month, userShows]);

  function prev() {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  }
  function next() {
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  }

  return (
    <section className="mt-8">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-[18px] font-semibold tracking-tight">
          Calendar
          <span className="text-[14px] font-medium text-[var(--color-mute)]">
            {4 + userShows.length}
          </span>
        </h2>
        <Button
          leading={<Plus size={16} />}
          size="md"
          onClick={() => setAddOpen(true)}
        >
          Add show
        </Button>
      </div>

      <AddShowModal
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSave={(show) => setUserShows((xs) => [...xs, show])}
        initialMonth={{ year, month }}
      />

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            type="button"
            aria-label="Previous month"
            onClick={prev}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
          >
            <ChevronLeft size={18} />
          </button>
          <div className="text-[15px] font-semibold">
            {MONTHS[month]} {year}
          </div>
          <button
            type="button"
            aria-label="Next month"
            onClick={next}
            className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="grid grid-cols-7 border-y border-[var(--color-line)] bg-[var(--color-surface-2)]">
          {WEEKDAY_LABELS.map((d) => (
            <div
              key={d}
              className="px-3 py-2 text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)]"
            >
              {d}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((cell, i) => (
            <div
              key={i}
              className={[
                "min-h-[120px] border-b border-r border-[var(--color-line)] px-2.5 py-2",
                i % 7 === 6 && "border-r-0",
                i >= cells.length - 7 && "border-b-0",
                !cell.inMonth && "bg-[var(--color-surface-2)]",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <div
                className={[
                  "text-[13px] font-medium",
                  !cell.inMonth
                    ? "text-[var(--color-mute-2)]"
                    : "text-[var(--color-ink)]",
                ].join(" ")}
              >
                {cell.date}
              </div>
              {cell.shows.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {cell.shows.map((s, j) => (
                    <li key={j}>
                      <span className="inline-flex items-center rounded-full bg-[var(--color-line-2)] px-2 py-0.5 text-[11.5px] font-medium tabular-nums text-[var(--color-ink)]">
                        {s.start} – {s.end}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
