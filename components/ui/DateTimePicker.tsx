"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "@/components/icons";
import {
  MONTH_NAMES,
  WEEKDAY_LABELS,
  formatLongDate,
  monthGrid,
} from "@/lib/date";

export type DateTimeValue = {
  date: Date | null;
  time: string;
};

/** Strip non-digits, cap to HHMM, auto-insert `:` after two digits. */
function formatTimeInput(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}:${digits.slice(2)}`;
}

const POPOVER_WIDTH = 360;
const POPOVER_HEIGHT = 400;
const GAP = 8;

export default function DateTimePicker(props: {
  value: DateTimeValue;
  onChange: (next: DateTimeValue) => void;
  placeholder: string;
  /** "datetime" → calendar + time. "time" → time only, no popover (renders an input). */
  mode?: "datetime" | "time";
  icon?: React.ReactNode;
  initialMonth?: { year: number; month: number };
}) {
  if (props.mode === "time") return <TimeOnly {...props} />;
  return <FullPicker {...props} />;
}

function FullPicker({
  value,
  onChange,
  placeholder,
  icon,
  initialMonth,
}: {
  value: DateTimeValue;
  onChange: (next: DateTimeValue) => void;
  placeholder: string;
  icon?: React.ReactNode;
  initialMonth?: { year: number; month: number };
}) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const popoverRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  const [viewYear, setViewYear] = useState(
    initialMonth?.year ?? value.date?.getFullYear() ?? new Date().getFullYear(),
  );
  const [viewMonth, setViewMonth] = useState(
    initialMonth?.month ?? value.date?.getMonth() ?? new Date().getMonth(),
  );

  useEffect(() => {
    setMounted(true);
  }, []);

  function computePosition() {
    const el = triggerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const placeAbove = spaceBelow < POPOVER_HEIGHT && spaceAbove > spaceBelow;

    // Right-align popover with the trigger.
    let left = rect.right - POPOVER_WIDTH;
    if (left < 8) left = 8;
    if (left + POPOVER_WIDTH > window.innerWidth - 8) {
      left = window.innerWidth - POPOVER_WIDTH - 8;
    }

    const top = placeAbove
      ? rect.top - POPOVER_HEIGHT - GAP
      : rect.bottom + GAP;
    setPos({ left, top });
  }

  useEffect(() => {
    if (!open) return;
    computePosition();
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t)) return;
      if (popoverRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onResize = () => computePosition();
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    window.addEventListener("scroll", onResize, true);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("scroll", onResize, true);
    };
  }, [open]);

  const cells = useMemo(() => monthGrid(viewYear, viewMonth), [viewYear, viewMonth]);

  function prev() {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  }
  function next() {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  }

  const display =
    value.date && value.time
      ? `${formatLongDate(value.date)} · ${value.time}`
      : value.date
        ? formatLongDate(value.date)
        : "";

  const selected = value.date
    ? {
        y: value.date.getFullYear(),
        m: value.date.getMonth(),
        d: value.date.getDate(),
      }
    : null;

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left text-[14px] outline-none hover:border-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
      >
        <span className="text-[var(--color-mute)]">
          {icon ?? <CalendarIcon size={18} />}
        </span>
        <span
          className={
            display ? "truncate text-[var(--color-ink)]" : "text-[var(--color-mute-2)]"
          }
        >
          {display || placeholder}
        </span>
        <ChevronDown
          size={16}
          className="ml-auto text-[var(--color-mute)]"
        />
      </button>

      {open && mounted && pos &&
        createPortal(
          <div
            ref={popoverRef}
            className="fixed z-[60] rounded-2xl border border-[var(--color-line)] bg-white p-4 shadow-xl"
            style={{ left: pos.left, top: pos.top, width: POPOVER_WIDTH }}
          >
            <div className="flex items-center justify-between px-2">
              <button
                type="button"
                aria-label="Previous month"
                onClick={prev}
                className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
              >
                <ChevronLeft size={18} />
              </button>
              <div className="text-[14px] font-semibold">
                {MONTH_NAMES[viewMonth]} {viewYear}
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

            <div className="mt-3 grid grid-cols-7 px-1">
              {WEEKDAY_LABELS.map((d) => (
                <div
                  key={d}
                  className="py-1.5 text-center text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]"
                >
                  {d}
                </div>
              ))}
            </div>

            <div className="grid grid-cols-7 px-1">
              {cells.map((c, i) => {
                const isWeekend = c.weekday >= 5;
                const isSelected =
                  selected &&
                  c.inMonth &&
                  selected.y === viewYear &&
                  selected.m === viewMonth &&
                  selected.d === c.date;
                return (
                  <button
                    key={i}
                    type="button"
                    disabled={!c.inMonth}
                    onClick={() => {
                      onChange({
                        ...value,
                        date: new Date(viewYear, viewMonth, c.date),
                      });
                    }}
                    className={[
                      "flex h-9 w-full items-center justify-center rounded-full text-[13px] tabular-nums transition-colors",
                      !c.inMonth
                        ? "text-transparent"
                        : isSelected
                          ? "bg-[var(--color-ink)] text-white"
                          : isWeekend
                            ? "text-[var(--color-danger)] hover:bg-[var(--color-line-2)]"
                            : "text-[var(--color-ink)] hover:bg-[var(--color-line-2)]",
                    ].join(" ")}
                  >
                    {c.date}
                  </button>
                );
              })}
            </div>

            <div className="mt-3 rounded-xl border border-[var(--color-line)] px-3 py-2">
              <label className="block text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                Time
              </label>
              <input
                type="text"
                inputMode="numeric"
                maxLength={5}
                placeholder="HH:MM"
                value={value.time}
                onChange={(e) =>
                  onChange({ ...value, time: formatTimeInput(e.target.value) })
                }
                className="mt-0.5 w-full bg-transparent text-[15px] tabular-nums outline-none placeholder:text-[var(--color-mute-2)]"
              />
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

function TimeOnly({
  value,
  onChange,
  placeholder,
  icon,
}: {
  value: DateTimeValue;
  onChange: (next: DateTimeValue) => void;
  placeholder: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-[var(--color-line)] bg-white px-4 text-[14px] focus-within:border-[var(--color-ink)] hover:border-[var(--color-mute-2)]">
      <span className="text-[var(--color-mute)]">{icon}</span>
      <input
        type="text"
        inputMode="numeric"
        maxLength={5}
        placeholder={placeholder}
        value={value.time}
        onChange={(e) =>
          onChange({ ...value, time: formatTimeInput(e.target.value) })
        }
        className="w-full bg-transparent tabular-nums outline-none placeholder:text-[var(--color-mute-2)]"
      />
    </div>
  );
}
