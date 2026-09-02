"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Pencil,
  Plus,
  Search as SearchIcon,
} from "@/components/icons";
import Button from "@/components/ui/Button";
import NewPackageModal from "@/components/inventory/packages/NewPackageModal";

type Tag = { label: string; tone: "purple" | "orange" | "peach" };

type Row = {
  name: string;
  contents: Tag[];
  more?: number;
  type: "Flexible" | "Shows-related";
  shows: "all" | { chip: string; more?: number };
  price: string;
};

const ROWS: Row[] = [
  {
    name: "Ultimate Experience",
    contents: [
      { label: "Ticket: 2 x Gold – Early bird", tone: "purple" },
      { label: "Add-on: Meet & Greet", tone: "orange" },
      { label: "Add-on: 2 Merch Items", tone: "orange" },
      { label: "Voucher: Parking", tone: "peach" },
    ],
    type: "Flexible",
    shows: "all",
    price: "1500 AED",
  },
  {
    name: "Gold Package",
    contents: [
      { label: "Ticket: 2 x Gold – Early bird", tone: "purple" },
      { label: "Add-on: Meet & Greet", tone: "orange" },
      { label: "Add-on: 2 Merch Items", tone: "orange" },
      { label: "Voucher: Parking", tone: "peach" },
      { label: "Voucher: Parking", tone: "peach" },
    ],
    more: 3,
    type: "Shows-related",
    shows: { chip: "Fri 11 Sep 2026, 19:30", more: 2 },
    price: "1500 AED",
  },
  {
    name: "“All The Fun” Set",
    contents: [
      { label: "Ticket: 2 x Gold – Early bird", tone: "purple" },
      { label: "Add-on: Meet & Greet", tone: "orange" },
      { label: "Voucher: Parking", tone: "peach" },
    ],
    type: "Shows-related",
    shows: { chip: "Fri 11 Sep 2026, 19:30", more: 3 },
    price: "1500 AED",
  },
  {
    name: "Adventure Seeker",
    contents: [
      { label: "Ticket: 2 x Gold – Early bird", tone: "purple" },
      { label: "Add-on: Meet & Greet", tone: "orange" },
    ],
    type: "Flexible",
    shows: { chip: "Fri 11 Sep 2026, 19:30", more: 1 },
    price: "1500 AED",
  },
  {
    name: "Family Fun Pack",
    contents: [
      { label: "Ticket: 2 x Gold – Early bird", tone: "purple" },
      { label: "Add-on: Meet & Greet", tone: "orange" },
      { label: "Add-on: 2 Merch Items", tone: "orange" },
      { label: "Voucher: Parking", tone: "peach" },
      { label: "Voucher: Parking", tone: "peach" },
    ],
    more: 3,
    type: "Flexible",
    shows: { chip: "Fri 11 Sep 2026, 19:30" },
    price: "1500 AED",
  },
  {
    name: "Weekend Getaway",
    contents: [
      { label: "Ticket: 2 x Gold – Early bird", tone: "purple" },
      { label: "Add-on: Meet & Greet", tone: "orange" },
      { label: "Voucher: Parking", tone: "peach" },
    ],
    type: "Flexible",
    shows: "all",
    price: "1500 AED",
  },
];

const TONES: Record<Tag["tone"], string> = {
  purple: "bg-[var(--color-tint-purple)] text-[var(--color-platinum-deep)]",
  orange: "bg-[#fff1d9] text-[#8a5a00]",
  peach: "bg-[#ffe6d6] text-[#9a4500]",
};

function HeaderCell({ children }: { children: React.ReactNode }) {
  return (
    <th className="border-r border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)] last:border-r-0">
      <span className="inline-flex items-center gap-1.5">
        {children}
        <ArrowUpDown size={12} />
      </span>
    </th>
  );
}

function FilterBtn({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left hover:border-[var(--color-mute-2)]"
    >
      <div className="flex min-w-0 flex-col leading-tight">
        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
          {label}
        </span>
        <span className="truncate text-[14px]">{value}</span>
      </div>
      <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
    </button>
  );
}

export default function Packages() {
  const [open, setOpen] = useState(false);
  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-[22px] font-bold tracking-tight">
          Packages
          <span className="text-[14px] font-medium text-[var(--color-mute)]">
            {ROWS.length}
          </span>
        </h2>
        <Button leading={<Plus size={16} />} onClick={() => setOpen(true)}>
          New package
        </Button>
      </div>

      <NewPackageModal open={open} onClose={() => setOpen(false)} />

      <div className="mt-5 grid grid-cols-[1fr_280px_280px] items-center gap-3">
        <div className="relative">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
          />
          <input
            type="text"
            placeholder="Search by name"
            className="h-12 w-[280px] rounded-xl border border-[var(--color-line)] bg-white pl-9 pr-3 text-[13px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
          />
        </div>
        <FilterBtn label="" value="Filter by date" />
        <FilterBtn label="Visibility" value="All" />
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Contents</HeaderCell>
              <HeaderCell>Type</HeaderCell>
              <HeaderCell>Shows</HeaderCell>
              <HeaderCell>Price</HeaderCell>
              <th className="w-12 border-l border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r, i) => (
              <tr
                key={i}
                className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
              >
                <td className="px-4 py-3.5 font-medium align-top">{r.name}</td>
                <td className="px-4 py-3.5 align-top">
                  <div className="flex flex-wrap items-center gap-1.5">
                    {r.contents.map((t, j) => (
                      <span
                        key={j}
                        className={[
                          "inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium",
                          TONES[t.tone],
                        ].join(" ")}
                      >
                        {t.label}
                      </span>
                    ))}
                    {r.more && (
                      <span className="inline-flex h-6 items-center rounded-full bg-[var(--color-line-2)] px-2.5 text-[12px] font-medium text-[var(--color-mute)]">
                        +{r.more}
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3.5 align-top">{r.type}</td>
                <td className="px-4 py-3.5 align-top">
                  {r.shows === "all" ? (
                    <span>All</span>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="inline-flex h-7 items-center rounded-full bg-[var(--color-line-2)] px-3 text-[12px] font-medium text-[var(--color-ink)]">
                        {r.shows.chip}
                      </span>
                      {r.shows.more && (
                        <span className="inline-flex h-7 items-center rounded-full bg-[var(--color-line-2)] px-2.5 text-[12px] font-medium text-[var(--color-mute)]">
                          +{r.shows.more}
                        </span>
                      )}
                    </div>
                  )}
                </td>
                <td className="px-4 py-3.5 tabular-nums align-top">{r.price}</td>
                <td className="px-4 py-3.5 align-top">
                  <button
                    type="button"
                    aria-label="Edit package"
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
    </section>
  );
}
