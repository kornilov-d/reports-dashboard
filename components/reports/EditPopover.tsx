"use client";

import { useEffect, useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { Copy, Trash } from "@/components/icons";
import Checkbox from "@/components/ui/Checkbox";
import Toggle from "@/components/ui/Toggle";
import { ACCENTS, CHANNELS, WIDGETS } from "@/lib/dashboard/catalog";
import { sizeSpan, type Accent, type DashboardWidget, type WidgetSize } from "@/lib/dashboard/types";

const WIDTH = 300;
const GAP = 8;

const SIZE_LABEL: Record<WidgetSize, string> = {
  "1x1": "Small",
  "1x2": "Tall",
  "2x2": "Large",
};

/** Miniature 4×4 grid with the size's footprint filled in. */
function SizeGlyph({ size }: { size: WidgetSize }) {
  const { w, h } = sizeSpan(size);
  return (
    <span className="grid grid-cols-2 gap-[2px]">
      {[0, 1, 2, 3].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const on = col < w && row < h;
        return (
          <span
            key={i}
            className={[
              "h-2.5 w-2.5 rounded-[2px]",
              on ? "bg-current" : "bg-[var(--color-line)]",
            ].join(" ")}
          />
        );
      })}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-[var(--color-line-2)] px-4 py-3 first:border-t-0">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-[var(--color-mute-2)]">
        {title}
      </p>
      <div className="flex flex-col gap-2.5">{children}</div>
    </div>
  );
}

function Segmented<T extends string>({
  value,
  options,
  onChange,
}: {
  value: T;
  options: Array<{ value: T; label: string }>;
  onChange: (next: T) => void;
}) {
  return (
    <div className="flex rounded-lg bg-[var(--color-line-2)] p-0.5">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          onClick={() => onChange(o.value)}
          className={[
            "flex-1 rounded-[6px] px-2 py-1.5 text-[12px] font-medium transition-colors",
            value === o.value
              ? "bg-white text-[var(--color-ink)] shadow-sm"
              : "text-[var(--color-mute)] hover:text-[var(--color-ink)]",
          ].join(" ")}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[12.5px] text-[var(--color-ink)]">{label}</span>
      {children}
    </div>
  );
}

export default function EditPopover({
  widget,
  anchor,
  onClose,
  onChange,
  onRemove,
  onDuplicate,
}: {
  widget: DashboardWidget;
  anchor: RefObject<HTMLElement | null>;
  onClose: () => void;
  onChange: (next: DashboardWidget) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}) {
  const meta = WIDGETS[widget.type];
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ left: number; top: number } | null>(null);

  useLayoutEffect(() => {
    function place() {
      const el = anchor.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const height = ref.current?.offsetHeight ?? 380;
      let left = rect.right - WIDTH;
      left = Math.max(8, Math.min(left, window.innerWidth - WIDTH - 8));
      // Prefer below the trigger, flip above when it fits there instead, and
      // fall back to a viewport-clamped position rather than covering the page
      // header when neither side has room.
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
  }, [anchor, widget.size]);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      const target = e.target as Node;
      if (ref.current?.contains(target)) return;
      if (anchor.current?.contains(target)) return;
      onClose();
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [anchor, onClose]);

  const patchContent = (patch: Partial<DashboardWidget["content"]>) =>
    onChange({ ...widget, content: { ...widget.content, ...patch } });
  const patchAppearance = (patch: Partial<DashboardWidget["appearance"]>) =>
    onChange({ ...widget, appearance: { ...widget.appearance, ...patch } });

  const series = widget.content.series ?? { valued: true, complimentary: true };
  const selectedChannels = widget.content.channels ?? CHANNELS.map((c) => c.id);

  const body = (
    <div
      ref={ref}
      role="dialog"
      aria-label={`Edit ${meta.label}`}
      className="fixed z-[70] overflow-hidden rounded-xl border border-[var(--color-line)] bg-white shadow-[0_12px_40px_rgba(13,13,16,0.16)]"
      style={{
        width: WIDTH,
        left: pos?.left ?? -9999,
        top: pos?.top ?? -9999,
        visibility: pos ? "visible" : "hidden",
      }}
    >
      <div className="px-4 pb-2 pt-3.5">
        <p className="text-[13px] font-semibold tracking-tight">{meta.label}</p>
        <p className="mt-0.5 text-[11.5px] text-[var(--color-mute)]">
          {meta.source}
        </p>
      </div>

      <Section title="Size">
        <div className="flex gap-2">
          {(["1x1", "1x2", "2x2"] as WidgetSize[]).map((size) => {
            const allowed = meta.allowedSizes.includes(size);
            const active = widget.size === size;
            return (
              <button
                key={size}
                type="button"
                disabled={!allowed}
                title={
                  allowed
                    ? `${SIZE_LABEL[size]} (${size})`
                    : `${SIZE_LABEL[size]} is not available for ${meta.label}`
                }
                onClick={() => onChange({ ...widget, size })}
                className={[
                  "flex flex-1 flex-col items-center gap-1.5 rounded-lg border px-2 py-2.5 text-[11px] font-medium transition-colors",
                  !allowed
                    ? "cursor-not-allowed border-[var(--color-line-2)] text-[var(--color-line)] opacity-60"
                    : active
                      ? "border-[var(--color-ink)] text-[var(--color-ink)]"
                      : "border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-mute-2)] hover:text-[var(--color-ink)]",
                ].join(" ")}
              >
                <SizeGlyph size={size} />
                <span>{SIZE_LABEL[size]}</span>
              </button>
            );
          })}
        </div>
      </Section>

      {meta.contentControls.length > 0 && (
        <Section title="Content">
          {meta.contentControls.includes("breakdown") && (
            <Segmented
              value={widget.content.breakdown ?? "daily"}
              onChange={(v) => patchContent({ breakdown: v })}
              options={[
                { value: "hourly", label: "By hours" },
                { value: "daily", label: "By day" },
              ]}
            />
          )}

          {meta.contentControls.includes("channelMetric") && (
            <Segmented
              value={widget.content.channelMetric ?? "sales"}
              onChange={(v) => patchContent({ channelMetric: v })}
              options={[
                { value: "sales", label: "Sales" },
                { value: "attendance", label: "Attendance" },
              ]}
            />
          )}

          {meta.contentControls.includes("popularityMetric") && (
            <Segmented
              value={widget.content.popularityMetric ?? "distributed"}
              onChange={(v) => patchContent({ popularityMetric: v })}
              options={[
                { value: "distributed", label: "Distributed" },
                { value: "sold", label: "Sold" },
                { value: "scanned", label: "Scanned" },
              ]}
            />
          )}

          {meta.contentControls.includes("series") && (
            <div className="flex flex-col gap-2">
              <Row label="Valued">
                <Checkbox
                  ariaLabel="Show valued series"
                  state={series.valued ? "checked" : "unchecked"}
                  onClick={() =>
                    patchContent({
                      series: { ...series, valued: !series.valued },
                    })
                  }
                />
              </Row>
              <Row label="Complimentary">
                <Checkbox
                  ariaLabel="Show complimentary series"
                  state={series.complimentary ? "checked" : "unchecked"}
                  onClick={() =>
                    patchContent({
                      series: {
                        ...series,
                        complimentary: !series.complimentary,
                      },
                    })
                  }
                />
              </Row>
            </div>
          )}

          {meta.contentControls.includes("channels") && (
            <div className="flex flex-col gap-2">
              {CHANNELS.map((c) => {
                const on = selectedChannels.includes(c.id);
                return (
                  <Row key={c.id} label={c.label}>
                    <Checkbox
                      ariaLabel={`Include ${c.label}`}
                      state={on ? "checked" : "unchecked"}
                      onClick={() =>
                        patchContent({
                          channels: on
                            ? selectedChannels.filter((id) => id !== c.id)
                            : [...selectedChannels, c.id],
                        })
                      }
                    />
                  </Row>
                );
              })}
            </div>
          )}

          {meta.contentControls.includes("limit") && (
            <Row label="Ticket types shown">
              <Segmented
                value={`${widget.content.limit ?? 5}`}
                onChange={(v) => patchContent({ limit: Number(v) })}
                options={[
                  { value: "3", label: "3" },
                  { value: "5", label: "5" },
                  { value: "6", label: "6" },
                ]}
              />
            </Row>
          )}

          {meta.contentControls.includes("showDelta") && (
            <Row label="Compare to previous period">
              <Toggle
                size="sm"
                ariaLabel="Compare to previous period"
                on={widget.content.showDelta ?? false}
                onChange={(v) => patchContent({ showDelta: v })}
              />
            </Row>
          )}
        </Section>
      )}

      {meta.appearanceControls.length > 0 && (
        <Section title="Appearance">
          {meta.appearanceControls.includes("chartStyle") &&
            meta.chartStyles.length > 1 && (
              <Segmented
                value={widget.appearance.chartStyle ?? meta.chartStyles[0]}
                onChange={(v) => patchAppearance({ chartStyle: v })}
                options={meta.chartStyles.map((s) => ({
                  value: s,
                  label: s === "list" ? "List" : s[0].toUpperCase() + s.slice(1),
                }))}
              />
            )}

          {meta.appearanceControls.includes("accent") && (
            <Row label="Accent">
              <span className="flex gap-1.5">
                {(Object.keys(ACCENTS) as Accent[]).map((key) => {
                  const active = (widget.appearance.accent ?? "purple") === key;
                  return (
                    <button
                      key={key}
                      type="button"
                      aria-label={ACCENTS[key].label}
                      title={ACCENTS[key].label}
                      onClick={() => patchAppearance({ accent: key })}
                      className={[
                        "h-5 w-5 rounded-full border-2 transition-transform",
                        active
                          ? "border-[var(--color-ink)] scale-110"
                          : "border-transparent hover:scale-105",
                      ].join(" ")}
                      style={{ background: ACCENTS[key].base }}
                    />
                  );
                })}
              </span>
            </Row>
          )}

          {meta.appearanceControls.includes("legend") && (
            <Row label="Legend">
              <Toggle
                size="sm"
                ariaLabel="Show legend"
                on={widget.appearance.showLegend ?? false}
                onChange={(v) => patchAppearance({ showLegend: v })}
              />
            </Row>
          )}

          {meta.appearanceControls.includes("valueLabels") && (
            <Row label="Value labels">
              <Toggle
                size="sm"
                ariaLabel="Show value labels"
                on={widget.appearance.showValueLabels ?? false}
                onChange={(v) => patchAppearance({ showValueLabels: v })}
              />
            </Row>
          )}

          {meta.appearanceControls.includes("compactNumbers") && (
            <Row label="Compact numbers">
              <Toggle
                size="sm"
                ariaLabel="Compact numbers"
                on={widget.appearance.compactNumbers ?? false}
                onChange={(v) => patchAppearance({ compactNumbers: v })}
              />
            </Row>
          )}
        </Section>
      )}

      <div className="flex items-center gap-1 border-t border-[var(--color-line)] bg-[var(--color-surface-2)] px-3 py-2.5">
        <button
          type="button"
          onClick={onRemove}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[12.5px] font-medium text-[var(--color-danger)] hover:bg-[#FCE8E8]"
        >
          <Trash size={14} />
          Remove
        </button>
        <button
          type="button"
          onClick={onDuplicate}
          className="inline-flex h-8 items-center gap-1.5 rounded-md px-2 text-[12.5px] font-medium text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
        >
          <Copy size={14} />
          Duplicate
        </button>
        <button
          type="button"
          onClick={onClose}
          className="ml-auto inline-flex h-8 items-center rounded-md bg-[var(--color-ink)] px-3.5 text-[12.5px] font-medium text-white hover:bg-[var(--color-ink-2)]"
        >
          Done
        </button>
      </div>
    </div>
  );

  if (typeof document === "undefined") return null;
  return createPortal(body, document.body);
}
