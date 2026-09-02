"use client";

import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  Search as SearchIcon,
} from "@/components/icons";
import {
  ITEM_TONES,
  SAMPLE_OPTIONS,
  type PackageOption,
  type PackageItemType,
} from "@/lib/packageItems";

const ORDER: PackageItemType[] = ["ticket", "voucher", "upsell"];
const GROUP_LABEL: Record<PackageItemType, string> = {
  ticket: "TICKETS",
  voucher: "VOUCHERS",
  upsell: "UPSELLS",
};

export default function SelectOptionsField({
  onAdd,
}: {
  onAdd: (opt: PackageOption) => void;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false);
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

  const q = query.trim().toLowerCase();
  const filtered = SAMPLE_OPTIONS.filter((o) =>
    q ? o.label.toLowerCase().includes(q) : true,
  );

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left text-[14px] hover:border-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
      >
        <span className="text-[var(--color-mute-2)]">Select options</span>
        <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
      </button>

      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-2 overflow-hidden rounded-xl border border-[var(--color-line)] bg-white shadow-xl">
          <div className="border-b border-[var(--color-line)] p-2">
            <div className="relative">
              <input
                type="text"
                autoFocus
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search"
                className="h-10 w-full rounded-lg border border-[var(--color-line)] bg-white pl-3 pr-9 text-[13px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
              />
              <SearchIcon
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
              />
            </div>
          </div>
          <div className="max-h-[320px] overflow-y-auto py-1">
            {ORDER.map((type) => {
              const items = filtered.filter((o) => o.type === type);
              if (items.length === 0) return null;
              return (
                <div key={type} className="py-1">
                  <div
                    className={[
                      "px-4 pb-1 pt-2 text-[11px] font-semibold uppercase tracking-wide",
                      ITEM_TONES[type].chip,
                    ].join(" ")}
                  >
                    {GROUP_LABEL[type]}
                  </div>
                  {items.map((it) => (
                    <button
                      key={it.id}
                      type="button"
                      onClick={() => {
                        onAdd(it);
                        // keep open so user can add multiple
                      }}
                      className="block w-full px-4 py-2 text-left text-[14px] hover:bg-[var(--color-line-2)]"
                    >
                      {it.label}
                    </button>
                  ))}
                </div>
              );
            })}
            {filtered.length === 0 && (
              <p className="px-4 py-6 text-center text-[13px] text-[var(--color-mute)]">
                No results
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
