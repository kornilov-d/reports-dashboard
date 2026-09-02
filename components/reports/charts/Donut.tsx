"use client";

import { useState } from "react";
import { useSize } from "./useSize";

export type Slice = { id: string; label: string; value: number; color: string };

function arc(cx: number, cy: number, r: number, from: number, to: number) {
  const start = { x: cx + r * Math.cos(from), y: cy + r * Math.sin(from) };
  const end = { x: cx + r * Math.cos(to), y: cy + r * Math.sin(to) };
  const large = to - from > Math.PI ? 1 : 0;
  return `M${start.x},${start.y} A${r},${r} 0 ${large} 1 ${end.x},${end.y}`;
}

/** Donut built from stroked arcs so slice thickness stays constant. */
export default function Donut({
  slices,
  centerLabel,
  centerValue,
  showValueLabels = true,
  formatValue,
}: {
  slices: Slice[];
  centerLabel: string;
  centerValue: string;
  showValueLabels?: boolean;
  formatValue: (n: number) => string;
}) {
  const { ref, size } = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<string | null>(null);

  const total = slices.reduce((s, x) => s + x.value, 0) || 1;
  const box = Math.max(0, Math.min(size.width, size.height));
  const cx = box / 2;
  const cy = box / 2;
  const thickness = Math.max(10, box * 0.14);
  const r = Math.max(0, box / 2 - thickness / 2 - 2);

  let angle = -Math.PI / 2;

  return (
    <div ref={ref} className="relative flex h-full w-full items-center justify-center">
      {box > 0 && (
        <svg width={box} height={box} onMouseLeave={() => setHover(null)}>
          {slices.map((s) => {
            const span = (s.value / total) * Math.PI * 2;
            const from = angle;
            const to = angle + Math.max(span - 0.02, 0.004);
            angle += span;
            return (
              <path
                key={s.id}
                d={arc(cx, cy, r, from, to)}
                fill="none"
                stroke={s.color}
                strokeWidth={thickness}
                strokeLinecap="butt"
                opacity={hover === null || hover === s.id ? 1 : 0.35}
                onMouseEnter={() => setHover(s.id)}
              />
            );
          })}
          <text
            x={cx}
            y={cy - 2}
            textAnchor="middle"
            fontSize={Math.max(12, box * 0.11)}
            fontWeight={600}
            fill="var(--color-ink)"
          >
            {hover
              ? formatValue(slices.find((s) => s.id === hover)?.value ?? 0)
              : centerValue}
          </text>
          <text
            x={cx}
            y={cy + Math.max(12, box * 0.09)}
            textAnchor="middle"
            fontSize={Math.max(9, box * 0.055)}
            fill="var(--color-mute)"
          >
            {hover ? slices.find((s) => s.id === hover)?.label : centerLabel}
          </text>
        </svg>
      )}

      {showValueLabels && (
        <div className="pointer-events-none absolute inset-y-0 right-0 flex flex-col justify-center gap-1">
          {slices.map((s) => (
            <span
              key={s.id}
              className="flex items-center gap-1.5 text-[11px] text-[var(--color-mute)]"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {Math.round((s.value / total) * 100)}%
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
