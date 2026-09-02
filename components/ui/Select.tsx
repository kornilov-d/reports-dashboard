"use client";

import { ChevronDown } from "@/components/icons";
import type { SelectHTMLAttributes } from "react";

export default function Select({
  className = "",
  children,
  ...rest
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className="relative inline-flex">
      <select
        {...rest}
        className={[
          "h-10 appearance-none rounded-lg border border-[var(--color-line)] bg-white pl-3 pr-9 text-[13px] text-[var(--color-ink)] outline-none transition-colors hover:bg-[var(--color-line-2)] focus:border-[var(--color-ink)]",
          className,
        ].join(" ")}
      >
        {children}
      </select>
      <ChevronDown
        size={14}
        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
      />
    </div>
  );
}
