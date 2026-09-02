"use client";

import { useMemo, useState } from "react";
import { useSize } from "./useSize";

export type ChartSeries = {
  key: string;
  label: string;
  color: string;
};

export type ChartPoint = { label: string; values: Record<string, number> };

/** Nice round upper bound so gridlines land on readable numbers. */
function niceMax(value: number) {
  if (value <= 0) return 1;
  const exp = Math.floor(Math.log10(value));
  const base = Math.pow(10, exp);
  const steps = [1, 1.5, 2, 2.5, 3, 4, 5, 7.5, 10];
  for (const s of steps) {
    if (value <= base * s) return base * s;
  }
  return base * 10;
}

/** Sums adjacent buckets so narrow bar charts don't turn into a picket fence. */
function aggregate(points: ChartPoint[], target: number): ChartPoint[] {
  const group = Math.ceil(points.length / target);
  if (group <= 1) return points;
  const out: ChartPoint[] = [];
  for (let i = 0; i < points.length; i += group) {
    const slice = points.slice(i, i + group);
    const values: Record<string, number> = {};
    for (const p of slice) {
      for (const [key, value] of Object.entries(p.values)) {
        values[key] = (values[key] ?? 0) + value;
      }
    }
    out.push({ label: slice[0].label, values });
  }
  return out;
}

function linePath(pts: Array<{ x: number; y: number }>) {
  return pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");
}

/**
 * Line / area / bar chart over a shared category axis. Handles one or two
 * series, hover tooltips and optional value labels; axes collapse away when
 * the widget is too small to fit them.
 */
export default function Chart({
  points: allPoints,
  series,
  style,
  showLegend = false,
  showValueLabels = false,
  formatValue,
  formatAxisValue,
  dense = false,
}: {
  points: ChartPoint[];
  series: ChartSeries[];
  style: "line" | "area" | "bar";
  showLegend?: boolean;
  showValueLabels?: boolean;
  /** Tooltip formatting; carries units. */
  formatValue: (n: number) => string;
  /** Axis formatting; defaults to `formatValue`, override to drop the unit. */
  formatAxisValue?: (n: number) => string;
  /** Small widget: drop the y-axis and thin out x labels. */
  dense?: boolean;
}) {
  const { ref, size } = useSize<HTMLDivElement>();
  const [hover, setHover] = useState<number | null>(null);

  const points = useMemo(
    () => (style === "bar" && dense ? aggregate(allPoints, 12) : allPoints),
    [allPoints, style, dense],
  );

  const width = size.width;
  const height = size.height;

  const pad = useMemo(
    () => ({
      top: dense ? 8 : 14,
      right: dense ? 4 : 8,
      bottom: dense ? 16 : 22,
      left: dense ? 4 : 46,
    }),
    [dense],
  );

  const max = useMemo(() => {
    let m = 0;
    for (const p of points) {
      for (const s of series) m = Math.max(m, p.values[s.key] ?? 0);
    }
    return niceMax(m);
  }, [points, series]);

  const plotW = Math.max(0, width - pad.left - pad.right);
  const plotH = Math.max(0, height - pad.top - pad.bottom);
  const legendH = showLegend ? 22 : 0;
  const innerH = Math.max(0, plotH - legendH);

  const x = (i: number) =>
    pad.left +
    (points.length <= 1 ? plotW / 2 : (i / (points.length - 1)) * plotW);
  const y = (v: number) => pad.top + innerH - (v / max) * innerH;

  const bandW = points.length ? plotW / points.length : plotW;

  const xLabelEvery = Math.max(1, Math.ceil(points.length / (dense ? 3 : 6)));

  if (!width || !height) {
    return <div ref={ref} className="h-full w-full" />;
  }

  const gridlines = dense ? [] : [0, 0.5, 1];

  return (
    <div ref={ref} className="relative h-full w-full">
      <svg
        width={width}
        height={height}
        role="img"
        onMouseLeave={() => setHover(null)}
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const px = e.clientX - rect.left - pad.left;
          const idx =
            style === "bar"
              ? Math.floor(px / Math.max(1, bandW))
              : Math.round((px / Math.max(1, plotW)) * (points.length - 1));
          setHover(Math.max(0, Math.min(points.length - 1, idx)));
        }}
      >
        {gridlines.map((g) => {
          const gy = pad.top + innerH - g * innerH;
          return (
            <g key={g}>
              <line
                x1={pad.left}
                x2={width - pad.right}
                y1={gy}
                y2={gy}
                stroke="var(--color-line)"
                strokeWidth={1}
              />
              <text
                x={pad.left - 8}
                y={gy + 3}
                textAnchor="end"
                fontSize={10}
                fill="var(--color-mute-2)"
              >
                {(formatAxisValue ?? formatValue)(max * g)}
              </text>
            </g>
          );
        })}

        {style === "bar"
          ? points.map((p, i) => {
              const groupW = bandW * 0.62;
              const each = groupW / series.length;
              const left = pad.left + i * bandW + (bandW - groupW) / 2;
              return (
                <g key={p.label}>
                  {series.map((s, si) => {
                    const v = p.values[s.key] ?? 0;
                    const h = Math.max(v > 0 ? 2 : 0, (v / max) * innerH);
                    return (
                      <rect
                        key={s.key}
                        x={left + si * each}
                        y={pad.top + innerH - h}
                        width={Math.max(2, each - 2)}
                        height={h}
                        rx={Math.min(3, each / 3)}
                        fill={s.color}
                        opacity={hover === null || hover === i ? 1 : 0.45}
                      />
                    );
                  })}
                </g>
              );
            })
          : series.map((s) => {
              const pts = points.map((p, i) => ({
                x: x(i),
                y: y(p.values[s.key] ?? 0),
              }));
              const d = linePath(pts);
              return (
                <g key={s.key}>
                  {style === "area" && pts.length > 1 && (
                    <>
                      <defs>
                        <linearGradient id={`fill-${s.key}`} x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={s.color} stopOpacity={0.28} />
                          <stop offset="100%" stopColor={s.color} stopOpacity={0.02} />
                        </linearGradient>
                      </defs>
                      <path
                        d={`${d} L${pts[pts.length - 1].x},${pad.top + innerH} L${pts[0].x},${pad.top + innerH} Z`}
                        fill={`url(#fill-${s.key})`}
                      />
                    </>
                  )}
                  <path
                    d={d}
                    fill="none"
                    stroke={s.color}
                    strokeWidth={2}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  {(showValueLabels || hover !== null) &&
                    pts.map((p, i) =>
                      hover === i || (showValueLabels && i % xLabelEvery === 0) ? (
                        <circle
                          key={i}
                          cx={p.x}
                          cy={p.y}
                          r={hover === i ? 4 : 2.5}
                          fill="white"
                          stroke={s.color}
                          strokeWidth={2}
                        />
                      ) : null,
                    )}
                </g>
              );
            })}

        {hover !== null && style !== "bar" && points.length > 0 && (
          <line
            x1={x(hover)}
            x2={x(hover)}
            y1={pad.top}
            y2={pad.top + innerH}
            stroke="var(--color-mute-2)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        )}

        {points.map((p, i) =>
          i % xLabelEvery === 0 ? (
            <text
              key={p.label + i}
              x={style === "bar" ? pad.left + i * bandW + bandW / 2 : x(i)}
              y={pad.top + innerH + 14}
              textAnchor="middle"
              fontSize={10}
              fill="var(--color-mute-2)"
            >
              {p.label}
            </text>
          ) : null,
        )}
      </svg>

      {hover !== null && points[hover] && (
        <div
          className="pointer-events-none absolute z-10 min-w-[112px] rounded-lg border border-[var(--color-line)] bg-white px-2.5 py-2 text-[11px] shadow-lg"
          style={{
            left: Math.min(
              Math.max(0, (style === "bar" ? pad.left + hover * bandW + bandW / 2 : x(hover)) - 60),
              Math.max(0, width - 124),
            ),
            top: 4,
          }}
        >
          <div className="font-medium text-[var(--color-ink)]">
            {points[hover].label}
          </div>
          {series.map((s) => (
            <div key={s.key} className="mt-1 flex items-center gap-1.5">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ background: s.color }}
              />
              <span className="text-[var(--color-mute)]">{s.label}</span>
              <span className="ml-auto font-medium tabular-nums">
                {formatValue(points[hover].values[s.key] ?? 0)}
              </span>
            </div>
          ))}
        </div>
      )}

      {showLegend && (
        <div className="absolute inset-x-0 bottom-0 flex items-center justify-center gap-4">
          {series.map((s) => (
            <span
              key={s.key}
              className="flex items-center gap-1.5 text-[11px] text-[var(--color-mute)]"
            >
              <span
                className="h-2 w-2 rounded-full"
                style={{ background: s.color }}
              />
              {s.label}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
