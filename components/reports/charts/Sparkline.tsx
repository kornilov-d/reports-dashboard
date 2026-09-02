"use client";

import { useSize } from "./useSize";

/** Minimal filled trend line for KPI cards. */
export default function Sparkline({
  values,
  color,
}: {
  values: number[];
  color: string;
}) {
  const { ref, size } = useSize<HTMLDivElement>();
  const { width, height } = size;
  const max = Math.max(1, ...values);
  const min = Math.min(...values, 0);
  const span = Math.max(1, max - min);

  const pts = values.map((v, i) => ({
    x: values.length <= 1 ? width / 2 : (i / (values.length - 1)) * width,
    y: height - ((v - min) / span) * (height - 4) - 2,
  }));
  const d = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p.x},${p.y}`).join(" ");

  return (
    <div ref={ref} className="h-full w-full">
      {width > 0 && height > 0 && values.length > 0 && (
        <svg width={width} height={height} aria-hidden="true">
          <defs>
            <linearGradient id="spark" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.22} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <path d={`${d} L${width},${height} L0,${height} Z`} fill="url(#spark)" />
          <path d={d} fill="none" stroke={color} strokeWidth={1.8} strokeLinejoin="round" />
        </svg>
      )}
    </div>
  );
}
