"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Bolt,
  ChevronDown,
  Gear,
  ImageIcon,
  Pencil,
  Plus,
  Trash,
} from "@/components/icons";
import Button from "@/components/ui/Button";

type Zone = {
  id: string;
  name: string;
  svgZone: string;
  capacity: string;
  seated?: boolean;
};

const ZONES: Zone[] = [
  { id: "111234567", name: "Dance floor", svgZone: "Dancefloor", capacity: "500" },
  { id: "111234567", name: "Golden Circle", svgZone: "Goldencircle", capacity: "500" },
  { id: "111234567", name: "VIP", svgZone: "VIP", capacity: "650", seated: true },
  { id: "111234567", name: "Lodge Left 1", svgZone: "LL_1", capacity: "650", seated: true },
  { id: "111234567", name: "Lodge Left 2", svgZone: "LL_2", capacity: "650", seated: true },
  { id: "111234567", name: "Lodge Left 3", svgZone: "LL_3", capacity: "650", seated: true },
  { id: "111234567", name: "Lodge Right 1", svgZone: "LR_1", capacity: "650", seated: true },
  { id: "111234567", name: "Lodge Right 2", svgZone: "LR_2", capacity: "650", seated: true },
  { id: "111234567", name: "Lodge Right 3", svgZone: "LR_3", capacity: "650", seated: true },
];

// Per-show overrides — 4 zones overridden by default (matches the "Exceptions 4" count).
const DEFAULT_OVERRIDES = ["", "", "600", "600", "600", "", "600", "", ""];

const SELECTED_SHOW = "19:30 Fri 11 Sep 2026";
const SHOW_OPTIONS = [
  "19:30 Fri 11 Sep 2026",
  "19:30 Sat 12 Sep 2026",
  "19:30 Sun 13 Sep 2026",
];

type Tab = "default" | "exceptions";

function HeaderCell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <th
      className={[
        "border-r border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)] last:border-r-0",
        className,
      ].join(" ")}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        <ArrowUpDown size={12} />
      </span>
    </th>
  );
}

function FileRow({ name, size }: { name: string; size: string }) {
  return (
    <div className="flex h-14 w-full items-center gap-3 rounded-xl border border-[var(--color-line)] bg-white px-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-tint-purple)] text-[var(--color-platinum-haze)]">
        <ImageIcon size={18} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-medium">{name}</div>
        <div className="text-[12px] text-[var(--color-mute)]">{size}</div>
      </div>
      <button
        type="button"
        aria-label="Remove"
        className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
      >
        <Trash size={16} />
      </button>
    </div>
  );
}

function SegmentedTabs({
  tab,
  onChange,
}: {
  tab: Tab;
  onChange: (t: Tab) => void;
}) {
  return (
    <div className="inline-flex rounded-xl bg-[var(--color-line-2)] p-1">
      <button
        type="button"
        onClick={() => onChange("default")}
        className={[
          "rounded-lg px-4 py-1.5 text-[13px] font-semibold",
          tab === "default"
            ? "bg-white text-[var(--color-ink)] shadow-sm"
            : "text-[var(--color-mute)]",
        ].join(" ")}
      >
        Default
      </button>
      <button
        type="button"
        onClick={() => onChange("exceptions")}
        className={[
          "rounded-lg px-4 py-1.5 text-[13px] font-semibold",
          tab === "exceptions"
            ? "bg-white text-[var(--color-ink)] shadow-sm"
            : "text-[var(--color-mute)]",
        ].join(" ")}
      >
        Exceptions <span className="text-[var(--color-mute)]">4</span>
      </button>
    </div>
  );
}

export default function SeatMap() {
  const [tab, setTab] = useState<Tab>("default");
  const [showTip, setShowTip] = useState(true);
  const [overrides, setOverrides] = useState<string[]>(DEFAULT_OVERRIDES);
  const [showOpen, setShowOpen] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-[20px] font-semibold tracking-tight">Seat map</h2>
        <SegmentedTabs tab={tab} onChange={setTab} />
      </div>

      {tab === "default" ? (
        <>
          {showTip && (
            <div className="mt-6 flex items-start justify-between gap-4 rounded-2xl bg-[var(--color-tint-purple)] px-5 py-4">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 text-[var(--color-platinum-haze)]">
                  <Bolt size={18} />
                </span>
                <div>
                  <p className="text-[14px] font-semibold text-[var(--color-platinum-deep)]">
                    Get everything in its right place
                  </p>
                  <p className="mt-1 text-[12.5px] text-[var(--color-platinum-deep)]/70">
                    Use our guide how to prepare your SVG file for our platform so all the sectors and seats will be recognized correctly.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setShowTip(false)}
                  className="text-[13px] font-medium text-[var(--color-platinum-deep)]"
                >
                  Hide tip
                </button>
                <Button
                  size="sm"
                  className="!bg-[var(--color-platinum-haze)] !text-white hover:!bg-[#6a04c5]"
                >
                  Get guide
                </Button>
              </div>
            </div>
          )}

          <div className="mt-6 grid grid-cols-[1fr_360px] items-start gap-x-12 gap-y-6">
            <div>
              <p className="text-[15px] font-semibold">Floor map</p>
              <p className="mt-1 text-[13px] text-[var(--color-mute)]">
                Uploaded image will be used only for illustrative purposes
              </p>
            </div>
            <FileRow name="venuemap_lg.png" size="1.3 MB" />

            <div>
              <p className="text-[15px] font-semibold">SVG Map File</p>
              <p className="mt-1 text-[13px] text-[var(--color-mute)]">
                All zones will be detected automatically. If this didn&apos;t happen, please check{" "}
                <a className="text-[var(--color-info)] underline" href="#">
                  our guide
                </a>{" "}
                to see if the map meets the requirements
              </p>
            </div>
            <div className="space-y-3">
              <FileRow name="venuemap_lg.svg" size="1.3 MB" />
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" className="flex-1">
                  Open constructor
                </Button>
                <Button variant="secondary" size="sm" className="flex-1">
                  Download Illustrator file
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[12px]">
                <span className="text-[var(--color-mute)]">Detected:</span>
                <DetectedChip>1989 seats</DetectedChip>
                <DetectedChip>10 Seated zones</DetectedChip>
                <DetectedChip>5 Non-seated zones</DetectedChip>
              </div>
            </div>
          </div>

          <div className="mt-10">
            <div className="flex items-center justify-between">
              <h2 className="text-[20px] font-semibold tracking-tight">
                Map zones
              </h2>
              <Button leading={<Plus size={16} />}>Add map zone</Button>
            </div>

            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Map zone</HeaderCell>
                    <HeaderCell>SVG Map zone</HeaderCell>
                    <HeaderCell>Capacity</HeaderCell>
                    <th className="w-12 border-l border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {ZONES.map((z, i) => (
                    <tr
                      key={i}
                      className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
                    >
                      <td className="px-4 py-3.5 text-[var(--color-mute)] tabular-nums">{z.id}</td>
                      <td className="px-4 py-3.5 font-medium">{z.name}</td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--color-line-2)] px-3 text-[12px] font-medium text-[var(--color-ink)]"
                        >
                          {z.svgZone}
                          <ChevronDown size={12} />
                        </button>
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="inline-flex items-center gap-2">
                          <span>{z.capacity}</span>
                          {z.seated && (
                            <span className="inline-flex h-6 items-center rounded-full bg-[var(--color-line-2)] px-2.5 text-[11px] font-medium text-[var(--color-mute)]">
                              Seated
                            </span>
                          )}
                          <button
                            type="button"
                            aria-label="Capacity settings"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
                          >
                            <Gear size={14} />
                          </button>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          aria-label="Edit zone"
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
                        >
                          <Pencil size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="relative w-[320px]">
              <button
                type="button"
                onClick={() => setShowOpen((v) => !v)}
                onBlur={() => setTimeout(() => setShowOpen(false), 120)}
                className="flex h-14 w-full items-center rounded-xl border border-[var(--color-line)] bg-white px-4 text-left hover:border-[var(--color-mute-2)]"
              >
                <div className="flex flex-col leading-tight">
                  <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                    Selected show
                  </span>
                  <span className="text-[14px] tabular-nums">{SELECTED_SHOW}</span>
                </div>
                <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
              </button>
              {showOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
                  {SHOW_OPTIONS.map((s) => (
                    <button
                      key={s}
                      type="button"
                      className="block w-full px-4 py-2.5 text-left text-[13px] tabular-nums hover:bg-[var(--color-line-2)]"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              className="!bg-[var(--color-danger)] !text-white hover:!bg-[#b82a2a]"
              size="lg"
              onClick={() => setOverrides(ZONES.map(() => ""))}
            >
              Reset to default
            </Button>
          </div>

          <div className="mt-8">
            <h2 className="text-[20px] font-semibold tracking-tight">Map zones</h2>
            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <HeaderCell>ID</HeaderCell>
                    <HeaderCell>Map zone</HeaderCell>
                    <HeaderCell>SVG Map zone</HeaderCell>
                    <HeaderCell>Capacity override</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {ZONES.map((z, i) => (
                    <tr
                      key={i}
                      className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
                    >
                      <td className="px-4 py-3.5 text-[var(--color-mute)] tabular-nums">{z.id}</td>
                      <td className="px-4 py-3.5 font-medium">{z.name}</td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex h-7 items-center rounded-full bg-[var(--color-line-2)] px-3 text-[12px] font-medium text-[var(--color-ink)]">
                          {z.svgZone}
                        </span>
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="relative max-w-[260px] rounded-xl border border-[var(--color-line)] bg-white focus-within:border-[var(--color-ink)]">
                          <label className="absolute left-3.5 top-1 text-[10px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                            Override
                          </label>
                          <input
                            inputMode="numeric"
                            placeholder={z.capacity}
                            value={overrides[i]}
                            onChange={(e) =>
                              setOverrides((o) =>
                                o.map((x, j) => (j === i ? e.target.value : x)),
                              )
                            }
                            className="h-11 w-full rounded-xl bg-transparent px-3.5 pt-3.5 text-[14px] tabular-nums outline-none placeholder:text-[var(--color-mute-2)]"
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </section>
  );
}

function DetectedChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 items-center rounded-full bg-[#e8f6ee] px-2.5 text-[12px] font-medium text-[var(--color-success)]">
      {children}
    </span>
  );
}
