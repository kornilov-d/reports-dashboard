"use client";

import { useState } from "react";
import { ArrowUpDown, Pencil, Search as SearchIcon } from "@/components/icons";
import Button from "@/components/ui/Button";
import Pill from "@/components/ui/Pill";
import Select from "@/components/ui/Select";

type Visibility = "Enabled" | "Disabled" | "Hidden";
type Row = {
  name: string;
  show: string;
  start: string;
  doors: string;
  end: string;
  visibility: Visibility;
};

const rows: Row[] = [
  { name: "Weekday show", show: "19:30 Fri 11 Sep 2026", start: "19:30 Fri 11 Sep 2026", doors: "19:30 Fri 11 Sep 2026", end: "19:30 Fri 11 Sep 2026", visibility: "Enabled" },
  { name: "Weekday show", show: "19:30 Sat 12 Sep 2026", start: "19:30 Sat 12 Sep 2026", doors: "19:30 Sat 12 Sep 2026", end: "19:30 Sat 12 Sep 2026", visibility: "Disabled" },
  { name: "Weekday show", show: "19:30 Sun 13 Sep 2026", start: "19:30 Sun 13 Sep 2026", doors: "19:30 Sun 13 Sep 2026", end: "19:30 Sun 13 Sep 2026", visibility: "Enabled" },
  { name: "Extended show 2.5 hrs", show: "19:30 Mon 14 Sep 2026", start: "19:30 Mon 14 Sep 2026", doors: "19:30 Mon 14 Sep 2026", end: "19:30 Mon 14 Sep 2026", visibility: "Hidden" },
  { name: "Extended show 2.5 hrs", show: "19:30 Tue 15 Sep 2026", start: "19:30 Tue 15 Sep 2026", doors: "19:30 Tue 15 Sep 2026", end: "19:30 Tue 15 Sep 2026", visibility: "Enabled" },
  { name: "Standard run", show: "19:30 Wed 16 Sep 2026", start: "19:30 Wed 16 Sep 2026", doors: "19:30 Wed 16 Sep 2026", end: "19:30 Wed 16 Sep 2026", visibility: "Enabled" },
];

const toneByVisibility: Record<Visibility, "success" | "danger" | "muted"> = {
  Enabled: "success",
  Disabled: "danger",
  Hidden: "muted",
};

function HeaderCell({
  children,
  sortable = true,
}: {
  children: React.ReactNode;
  sortable?: boolean;
}) {
  return (
    <th className="border-r border-[var(--color-line)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)] last:border-r-0">
      <span className="inline-flex items-center gap-1.5">
        {children}
        {sortable && <ArrowUpDown size={12} />}
      </span>
    </th>
  );
}

export default function ShowsTable() {
  const [query, setQuery] = useState("");

  return (
    <section className="mt-8">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <SearchIcon
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name"
            className="h-10 w-[260px] rounded-lg border border-[var(--color-line)] bg-white pl-9 pr-3 text-[13px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
          />
        </div>

        <Select defaultValue="all">
          <option value="all">Filter by tag</option>
          <option value="vip">VIP</option>
          <option value="standard">Standard</option>
        </Select>

        <Select defaultValue="all" className="w-[150px]">
          <option value="all">Activity — All</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </Select>

        <Button variant="primary" size="md" className="ml-auto">
          Apply
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
        <table className="w-full border-collapse">
          <thead className="bg-[var(--color-surface-2)]">
            <tr>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Show</HeaderCell>
              <HeaderCell>Start time</HeaderCell>
              <HeaderCell>Doors open</HeaderCell>
              <HeaderCell>End time</HeaderCell>
              <HeaderCell sortable={false}>Visibility</HeaderCell>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr
                key={i}
                className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
              >
                <td className="px-4 py-3.5 font-medium">{r.name}</td>
                <td className="px-4 py-3.5 text-[var(--color-mute)] tabular-nums">{r.show}</td>
                <td className="px-4 py-3.5 text-[var(--color-mute)] tabular-nums">{r.start}</td>
                <td className="px-4 py-3.5 text-[var(--color-mute)] tabular-nums">{r.doors}</td>
                <td className="px-4 py-3.5 text-[var(--color-mute)] tabular-nums">{r.end}</td>
                <td className="px-4 py-3.5">
                  <Pill tone={toneByVisibility[r.visibility]}>{r.visibility}</Pill>
                </td>
                <td className="px-4 py-3.5">
                  <button
                    type="button"
                    aria-label="Edit show"
                    className="flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
                  >
                    <Pencil size={16} />
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
