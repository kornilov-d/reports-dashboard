"use client";

import type { ReactNode } from "react";

/** Big-number block shared by the KPI-shaped widget sizes. */
export default function Stat({
  value,
  caption,
  delta,
  children,
}: {
  value: string;
  caption?: string;
  delta?: { label: string; direction: "up" | "down" | "flat" };
  /** Optional trend area rendered under the number. */
  children?: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="text-[26px] font-semibold leading-none tracking-tight tabular-nums">
          {value}
        </span>
        {delta && delta.label !== "—" && (
          <span
            className={[
              "text-[12px] font-medium tabular-nums",
              delta.direction === "up"
                ? "text-[var(--color-success)]"
                : delta.direction === "down"
                  ? "text-[var(--color-danger)]"
                  : "text-[var(--color-mute)]",
            ].join(" ")}
          >
            {delta.direction === "up" ? "▲" : delta.direction === "down" ? "▼" : ""}{" "}
            {delta.label}
          </span>
        )}
      </div>
      {caption && (
        <p className="mt-1.5 text-[12px] text-[var(--color-mute)]">{caption}</p>
      )}
      {children && <div className="mt-3 min-h-0 flex-1">{children}</div>}
    </div>
  );
}
