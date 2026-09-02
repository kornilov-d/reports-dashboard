"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Search as SearchIcon,
} from "@/components/icons";
import Checkbox from "@/components/ui/Checkbox";
import Toggle from "@/components/ui/Toggle";

const ALL_CHIPS = [
  "Age Limit",
  "Gap Protection",
  "Auto Close/Open",
  "Entrance/Door",
  "Price Visibility",
  "For Children",
  "Value",
  "Max Tickets per Order",
  "Max Tickets per Email",
  "Max Tickets per Phone",
  "Delayed Delivery",
  "Terms & Conditions",
  "Palette Color",
];

const DEFAULT_SELECTED = new Set([
  "Age Limit",
  "Price Visibility",
  "For Children",
  "Max Tickets per Email",
  "Terms & Conditions",
]);

type ToggleRow = {
  id: string;
  label: string;
  on: boolean;
  trailing?: "input" | "hidden-visible" | "edit-content";
  value?: string;
};

function Chip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "inline-flex h-8 items-center rounded-full px-3.5 text-[12.5px] font-medium transition-colors",
        active
          ? "bg-[var(--color-ink)] text-white"
          : "bg-[var(--color-line-2)] text-[var(--color-mute)] hover:bg-[#e3e3e7]",
      ].join(" ")}
    >
      {label}
    </button>
  );
}

function GlobalRow({
  row,
  onChange,
}: {
  row: ToggleRow;
  onChange: (next: Partial<ToggleRow>) => void;
}) {
  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[var(--color-line)] bg-[var(--color-surface-2)] px-5 py-4">
      <Toggle on={row.on} onChange={(on) => onChange({ on })} />
      <span className="flex-1 text-[14px] font-semibold">{row.label}</span>
      {row.trailing === "input" && row.on && (
        <input
          type="text"
          value={row.value ?? ""}
          onChange={(e) => onChange({ value: e.target.value })}
          className="h-10 w-[120px] rounded-xl border border-[var(--color-line)] bg-white px-3 text-right text-[14px] tabular-nums outline-none focus:border-[var(--color-ink)]"
        />
      )}
      {row.trailing === "hidden-visible" && (
        <div className="flex items-center gap-4 text-[13px]">
          <label className="inline-flex items-center gap-2">
            <span
              className={[
                "h-4 w-4 rounded-full border-[5px]",
                "border-transparent bg-[var(--color-line)]",
              ].join(" ")}
            />
            Hidden
          </label>
          <label className="inline-flex items-center gap-2">
            <span className="flex h-4 w-4 items-center justify-center rounded-full border-2 border-[var(--color-ink)]">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />
            </span>
            Visible
          </label>
        </div>
      )}
      {row.trailing === "edit-content" && (
        <button
          type="button"
          className="text-[13px] font-medium text-[var(--color-ink)]"
        >
          Edit content
        </button>
      )}
    </div>
  );
}

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

const TICKETS = [
  "Dance floor",
  "Golden Circle",
  "VIP",
  "Lodge Left 1",
  "Lodge Left 2",
  "Lodge Left 3",
  "Lodge Right 1",
  "Lodge Right 2",
  "Lodge Right 3",
];

export default function Settings() {
  const [chips, setChips] = useState(DEFAULT_SELECTED);
  const [rows, setRows] = useState<ToggleRow[]>([
    { id: "age", label: "Age Limit", on: true, trailing: "input", value: "21" },
    { id: "vis", label: "Price Visibility", on: false, trailing: "hidden-visible" },
    { id: "children", label: "For children", on: false },
    { id: "maxEmail", label: "Max Tickets per Email", on: true, trailing: "input", value: "3" },
    { id: "terms", label: "Terms & Conditions", on: false, trailing: "edit-content" },
  ]);
  const [perItemOpen, setPerItemOpen] = useState(true);
  const [ticketsOpen, setTicketsOpen] = useState(true);
  const [packagesOpen, setPackagesOpen] = useState(false);

  function toggleChip(c: string) {
    setChips((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  }

  return (
    <section>
      <h2 className="text-[22px] font-bold tracking-tight">Event settings</h2>
      <p className="mt-1 text-[13.5px] text-[var(--color-mute)]">
        Select settings above, then enable/disable them per category, price, or package below.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {ALL_CHIPS.map((c) => (
          <Chip key={c} label={c} active={chips.has(c)} onClick={() => toggleChip(c)} />
        ))}
      </div>

      <div className="mt-10">
        <button
          type="button"
          onClick={() => setPerItemOpen((v) => !v)}
          className="flex items-center gap-3 text-left"
        >
          {perItemOpen ? (
            <ChevronUp size={18} className="text-[var(--color-mute)]" />
          ) : (
            <ChevronDown size={18} className="text-[var(--color-mute)]" />
          )}
          <h3 className="text-[20px] font-semibold tracking-tight">Global settings</h3>
        </button>

        {perItemOpen && (
          <div className="mt-4 space-y-3">
            {rows.map((r) => (
              <GlobalRow
                key={r.id}
                row={r}
                onChange={(patch) =>
                  setRows((rs) => rs.map((x) => (x.id === r.id ? { ...x, ...patch } : x)))
                }
              />
            ))}
          </div>
        )}
      </div>

      <div className="mt-10">
        <h3 className="text-[20px] font-semibold tracking-tight">Per item settings</h3>

        <div className="mt-4">
          <button
            type="button"
            onClick={() => setTicketsOpen((v) => !v)}
            className="flex w-full items-center justify-between"
          >
            <span className="flex items-center gap-3">
              {ticketsOpen ? (
                <ChevronUp size={16} className="text-[var(--color-mute)]" />
              ) : (
                <ChevronDown size={16} className="text-[var(--color-mute)]" />
              )}
              <span className="text-[15px] font-semibold">Tickets</span>
            </span>
            <div className="relative">
              <input
                type="text"
                placeholder="Search by name"
                className="h-10 w-[260px] rounded-lg border border-[var(--color-line)] bg-white pl-3 pr-9 text-[13px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
                onClick={(e) => e.stopPropagation()}
              />
              <SearchIcon
                size={16}
                className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
              />
            </div>
          </button>

          {ticketsOpen && (
            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <HeaderCell>Ticket</HeaderCell>
                    <HeaderCell>Age limit</HeaderCell>
                    <HeaderCell>Price Visibility</HeaderCell>
                    <HeaderCell>Max Tickets per Email</HeaderCell>
                  </tr>
                </thead>
                <tbody>
                  {TICKETS.map((t, i) => (
                    <tr
                      key={i}
                      className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
                    >
                      <td className="px-4 py-3 font-medium">{t}</td>
                      <td className="px-4 py-3">
                        <Checkbox state={i === 2 ? "unchecked" : "checked"} />
                      </td>
                      <td className="px-4 py-3">
                        <Checkbox state={i === 1 || i === 2 ? "checked" : "unchecked"} />
                      </td>
                      <td className="px-4 py-3">
                        <Checkbox state={i === 1 || i === 2 ? "checked" : "unchecked"} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="mt-6 border-t border-[var(--color-line)] pt-4">
          <button
            type="button"
            onClick={() => setPackagesOpen((v) => !v)}
            className="flex items-center gap-3 text-left"
          >
            {packagesOpen ? (
              <ChevronUp size={16} className="text-[var(--color-mute)]" />
            ) : (
              <ChevronDown size={16} className="text-[var(--color-mute)]" />
            )}
            <span className="text-[15px] font-semibold">Packages</span>
            <span className="text-[13px] text-[var(--color-mute)]">12</span>
          </button>
        </div>
      </div>
    </section>
  );
}
