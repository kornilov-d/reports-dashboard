"use client";

import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "@/components/icons";
import { resolvePeriod } from "@/lib/dashboard/data";
import { MONTH_NAMES, WEEKDAY_LABELS, isoDate, monthGrid } from "@/lib/date";
import type { Filters, PeriodPreset } from "@/lib/dashboard/types";

const PRESETS: Array<{ value: PeriodPreset; label: string }> = [
  { value: "today", label: "Today" },
  { value: "thisWeek", label: "This week" },
  { value: "thisMonth", label: "This month" },
  { value: "last7", label: "Last 7 days" },
  { value: "last30", label: "Last 30 days" },
];

const RAIL_WIDTH = 172;
const MONTH_WIDTH = 296;
const GAP = 8;

type Draft = { preset: PeriodPreset; from: Date | null; to: Date | null };

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

function sameDay(a: Date | null, b: Date | null) {
  return (
    !!a && !!b && startOfDay(a).getTime() === startOfDay(b).getTime()
  );
}

function shortDate(d: Date, withYear: boolean) {
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  return `${d.getDate()} ${month}${withYear ? ` ${d.getFullYear()}` : ""}`;
}

/** "16 – 22 Mar 2026" within a month, "4 Aug – 2 Sep 2026" across months. */
export function formatRange(from: Date, to: Date) {
  const sameYear = from.getFullYear() === to.getFullYear();
  if (sameYear && from.getMonth() === to.getMonth()) {
    return `${from.getDate()} – ${shortDate(to, true)}`;
  }
  return `${shortDate(from, !sameYear)} – ${shortDate(to, true)}`;
}

function toDraft(filters: Filters): Draft {
  const period = resolvePeriod(filters);
  return {
    preset: filters.preset,
    from: startOfDay(period.from),
    to: startOfDay(period.to),
  };
}

/**
 * Single date field that opens the range picker: preset rail, one or two month
 * grids depending on the room available, and Cancel / Apply. Nothing is
 * committed until Apply, so a mis-click never refetches the dashboard.
 */
export default function PeriodPicker({
  filters,
  onChange,
}: {
  filters: Filters;
  onChange: (next: Filters) => void;
}) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  const [draft, setDraft] = useState<Draft>(() => toDraft(filters));
  const [hovered, setHovered] = useState<Date | null>(null);
  const [view, setView] = useState(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  });
  const [months, setMonths] = useState(2);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useEffect(() => setMounted(true), []);

  const width = RAIL_WIDTH + months * MONTH_WIDTH + 24;

  useLayoutEffect(() => {
    if (!open) return;
    function place() {
      const el = triggerRef.current;
      if (!el) return;
      const fits = window.innerWidth >= RAIL_WIDTH + 2 * MONTH_WIDTH + 64;
      const cols = fits ? 2 : 1;
      const boxWidth = RAIL_WIDTH + cols * MONTH_WIDTH + 24;
      setMonths(cols);

      const rect = el.getBoundingClientRect();
      const height = popoverRef.current?.offsetHeight ?? 420;
      let left = rect.left;
      left = Math.max(8, Math.min(left, window.innerWidth - boxWidth - 8));
      const spaceBelow = window.innerHeight - rect.bottom - GAP - 8;
      const spaceAbove = rect.top - GAP - 8;
      let top: number;
      if (height <= spaceBelow) top = rect.bottom + GAP;
      else if (height <= spaceAbove) top = rect.top - height - GAP;
      else top = Math.max(8, window.innerHeight - height - 8);
      setPos({ left, top });
    }
    place();
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
    };
  }, [open, months]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (popoverRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  function openPicker() {
    const next = toDraft(filters);
    setDraft(next);
    setHovered(null);
    const anchor = next.from ?? new Date();
    setView({ year: anchor.getFullYear(), month: anchor.getMonth() });
    setOpen(true);
  }

  function pickPreset(preset: PeriodPreset) {
    const next = toDraft({ ...filters, preset });
    setDraft({ ...next, preset });
    setHovered(null);
    const anchor = next.from ?? new Date();
    setView({ year: anchor.getFullYear(), month: anchor.getMonth() });
  }

  function pickDay(day: Date) {
    setDraft((current) => {
      if (!current.from || current.to) {
        return { preset: "custom", from: day, to: null };
      }
      return day < current.from
        ? { preset: "custom", from: day, to: current.from }
        : { preset: "custom", from: current.from, to: day };
    });
  }

  function apply() {
    if (draft.preset !== "custom") {
      onChange({ ...filters, preset: draft.preset });
      setOpen(false);
      return;
    }
    const from = draft.from;
    const to = draft.to ?? draft.from;
    if (!from || !to) return;
    onChange({
      ...filters,
      preset: "custom",
      customFrom: { date: isoDate(from), time: "00:00" },
      customTo: { date: isoDate(to), time: "23:59" },
    });
    setOpen(false);
  }

  function shiftMonths(delta: number) {
    setView((v) => {
      const d = new Date(v.year, v.month + delta, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  }

  const presetLabel =
    PRESETS.find((p) => p.value === filters.preset)?.label ?? "Custom range";
  const period = useMemo(() => resolvePeriod(filters), [filters]);

  // The range is only rendered after mount: the server and the browser can sit
  // in different time zones, and "now" must not differ across hydration.
  const rangeLabel = mounted ? formatRange(period.from, period.to) : null;

  const applyDisabled = draft.preset === "custom" && !draft.from;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => (open ? setOpen(false) : openPicker())}
        aria-haspopup="dialog"
        aria-expanded={open}
        className={[
          "flex h-10 items-center gap-2 rounded-lg border bg-white px-3 text-[13px] transition-colors",
          open
            ? "border-[var(--color-ink)]"
            : "border-[var(--color-line)] hover:bg-[var(--color-line-2)]",
        ].join(" ")}
      >
        <CalendarIcon size={16} className="text-[var(--color-mute)]" />
        <span className="font-medium text-[var(--color-ink)]">{presetLabel}</span>
        {rangeLabel && (
          <span className="text-[var(--color-mute)]">{rangeLabel}</span>
        )}
        <ChevronDown size={14} className="text-[var(--color-mute)]" />
      </button>

      {open &&
        mounted &&
        createPortal(
          <div
            ref={popoverRef}
            role="dialog"
            aria-label="Select period"
            className="fixed z-[70] overflow-hidden rounded-2xl border border-[var(--color-line)] bg-white shadow-[0_16px_48px_rgba(13,13,16,0.18)]"
            style={{
              width,
              left: pos?.left ?? -9999,
              top: pos?.top ?? -9999,
              visibility: pos ? "visible" : "hidden",
            }}
          >
            <div className="flex">
              <div className="flex w-[172px] shrink-0 flex-col gap-2 p-4">
                {PRESETS.map((p) => (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => pickPreset(p.value)}
                    className={[
                      "h-9 rounded-full px-4 text-left text-[13.5px] font-medium transition-colors",
                      draft.preset === p.value
                        ? "bg-[var(--color-ink)] text-white"
                        : "bg-[var(--color-line-2)] text-[var(--color-ink)] hover:bg-[var(--color-line)]",
                    ].join(" ")}
                  >
                    {p.label}
                  </button>
                ))}
              </div>

              <div className="flex flex-1 gap-2 border-l border-[var(--color-line)] p-4">
                {Array.from({ length: months }, (_, i) => (
                  <Month
                    key={i}
                    year={view.year}
                    month={view.month + i}
                    from={draft.from}
                    to={draft.to}
                    hovered={hovered}
                    showPrev={i === 0}
                    showNext={i === months - 1}
                    onPrev={() => shiftMonths(-1)}
                    onNext={() => shiftMonths(1)}
                    onPick={pickDay}
                    onHover={setHovered}
                  />
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-[var(--color-line)] px-4 py-3">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="h-10 rounded-lg bg-[var(--color-line-2)] px-5 text-[13.5px] font-medium text-[var(--color-ink)] hover:bg-[var(--color-line)]"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={applyDisabled}
                onClick={apply}
                className="h-10 rounded-lg bg-[var(--color-ink)] px-5 text-[13.5px] font-medium text-white hover:bg-[var(--color-ink-2)] disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function Month({
  year,
  month,
  from,
  to,
  hovered,
  showPrev,
  showNext,
  onPrev,
  onNext,
  onPick,
  onHover,
}: {
  year: number;
  month: number;
  from: Date | null;
  to: Date | null;
  hovered: Date | null;
  showPrev: boolean;
  showNext: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPick: (day: Date) => void;
  onHover: (day: Date | null) => void;
}) {
  const anchor = new Date(year, month, 1);
  const y = anchor.getFullYear();
  const m = anchor.getMonth();
  const cells = useMemo(() => monthGrid(y, m), [y, m]);

  // While only the start is picked, hovering previews the rest of the range.
  const end = to ?? (from && hovered && hovered > from ? hovered : to);

  return (
    <div className="w-[280px] shrink-0">
      <div className="flex items-center justify-between px-1 pb-2">
        <button
          type="button"
          aria-label="Previous month"
          onClick={onPrev}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-ink)] hover:bg-[var(--color-line-2)]",
            showPrev ? "" : "invisible",
          ].join(" ")}
        >
          <ChevronLeft size={18} />
        </button>
        <div className="text-[15px] font-semibold tracking-tight">
          {MONTH_NAMES[m]} {y}
        </div>
        <button
          type="button"
          aria-label="Next month"
          onClick={onNext}
          className={[
            "flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-ink)] hover:bg-[var(--color-line-2)]",
            showNext ? "" : "invisible",
          ].join(" ")}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="grid grid-cols-7">
        {WEEKDAY_LABELS.map((d) => (
          <div
            key={d}
            className="py-1.5 text-center text-[12px] font-medium text-[var(--color-mute)]"
          >
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7" onMouseLeave={() => onHover(null)}>
        {cells.map((cell, i) => {
          if (!cell.inMonth) return <div key={i} className="h-10" />;
          const day = new Date(y, m, cell.date);
          const isStart = sameDay(day, from);
          const isEnd = sameDay(day, end);
          const isWeekend = cell.weekday >= 5;
          const within = (d: Date) =>
            !!from && !!end && d >= startOfDay(from) && d <= startOfDay(end);
          const banded = within(day) && !sameDay(from, end);
          // Round wherever the band stops: range ends, row ends, month edges.
          const bandStart =
            cell.weekday === 0 || !within(new Date(y, m, cell.date - 1));
          const bandEnd =
            cell.weekday === 6 || !within(new Date(y, m, cell.date + 1));

          return (
            <div key={i} className="relative flex h-10 items-center justify-center">
              {banded && (
                <span
                  aria-hidden="true"
                  className={[
                    "absolute inset-y-1 left-0 right-0 bg-[var(--color-line-2)]",
                    bandStart ? "rounded-l-lg" : "",
                    bandEnd ? "rounded-r-lg" : "",
                  ].join(" ")}
                />
              )}
              <button
                type="button"
                onClick={() => onPick(day)}
                onMouseEnter={() => onHover(day)}
                className={[
                  "relative flex h-9 w-9 items-center justify-center rounded-lg text-[14px] tabular-nums transition-colors",
                  isStart || isEnd
                    ? "bg-[var(--color-ink)] font-semibold text-white"
                    : isWeekend
                      ? "text-[var(--color-danger)] hover:bg-[var(--color-line)]"
                      : "text-[var(--color-ink)] hover:bg-[var(--color-line)]",
                ].join(" ")}
              >
                {cell.date}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
