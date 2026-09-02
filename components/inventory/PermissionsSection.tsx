"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Gear,
  Search as SearchIcon,
} from "@/components/icons";
import Checkbox from "@/components/ui/Checkbox";

type CheckState = "checked" | "indeterminate" | "unchecked";

type ZoneRow = {
  zone: string;
  /** secondary lines under the parent zone (shown indented, muted). */
  children?: string[];
  website: CheckState;
  mobile: CheckState;
  admin: CheckState;
  users: string;
  partners: string;
  capacitySplit: CheckState;
  applyAll: CheckState;
  /** true if the row group has expandable children (rendered as a chevron). */
  expandable?: boolean;
};

const ticketRows: ZoneRow[] = [
  { zone: "Dance floor", website: "checked", mobile: "unchecked", admin: "checked", users: "All", partners: "None", capacitySplit: "unchecked", applyAll: "checked" },
  { zone: "Golden Circle", website: "checked", mobile: "checked", admin: "checked", users: "3 users", partners: "None", capacitySplit: "unchecked", applyAll: "checked" },
  {
    zone: "VIP",
    children: ["19:30 Fri 11 Sep 2026", "19:30 Fri 11 Sep 2026", "19:30 Fri 11 Sep 2026"],
    website: "indeterminate",
    mobile: "checked",
    admin: "indeterminate",
    users: "All",
    partners: "None",
    capacitySplit: "unchecked",
    applyAll: "unchecked",
    expandable: true,
  },
  { zone: "Lodge Left 1", website: "checked", mobile: "unchecked", admin: "checked", users: "All", partners: "None", capacitySplit: "checked", applyAll: "checked" },
  { zone: "Lodge Left 2", website: "checked", mobile: "unchecked", admin: "checked", users: "All", partners: "None", capacitySplit: "unchecked", applyAll: "checked" },
  { zone: "Lodge Left 3", website: "checked", mobile: "unchecked", admin: "checked", users: "All", partners: "None", capacitySplit: "unchecked", applyAll: "checked" },
  { zone: "Lodge Right 1", website: "checked", mobile: "unchecked", admin: "checked", users: "All", partners: "None", capacitySplit: "unchecked", applyAll: "checked" },
  { zone: "Lodge Right 2", website: "checked", mobile: "unchecked", admin: "checked", users: "All", partners: "None", capacitySplit: "unchecked", applyAll: "checked" },
  { zone: "Lodge Right 3", website: "checked", mobile: "unchecked", admin: "checked", users: "All", partners: "None", capacitySplit: "unchecked", applyAll: "checked" },
];

function HeaderCell({
  children,
  sortable = false,
  className = "",
}: {
  children: React.ReactNode;
  sortable?: boolean;
  className?: string;
}) {
  return (
    <th
      className={[
        "border-r border-[var(--color-line)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)] last:border-r-0",
        className,
      ].join(" ")}
    >
      <span className="inline-flex items-center gap-1.5">
        {children}
        {sortable && <ArrowUpDown size={12} />}
      </span>
    </th>
  );
}

function GearButton() {
  return (
    <button
      type="button"
      aria-label="Configure"
      className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
    >
      <Gear size={14} />
    </button>
  );
}

function Group({
  title,
  defaultOpen = false,
  count,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  count?: number;
  children?: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-t border-[var(--color-line)] py-6 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-3 text-left"
      >
        {open ? (
          <ChevronUp size={18} className="text-[var(--color-mute)]" />
        ) : (
          <ChevronDown size={18} className="text-[var(--color-mute)]" />
        )}
        <span className="text-[16px] font-semibold">{title}</span>
        {typeof count === "number" && (
          <span className="text-[13px] font-medium text-[var(--color-mute)]">
            {count}
          </span>
        )}
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}

function TicketsGroupContent() {
  const [open, setOpen] = useState<Record<number, boolean>>({});

  return (
    <>
      <div className="mb-3 flex items-center justify-end">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name"
            className="h-10 w-[260px] rounded-lg border border-[var(--color-line)] bg-white pl-3 pr-9 text-[13px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
          />
          <SearchIcon
            size={16}
            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
          />
        </div>
      </div>

      <div className="overflow-hidden rounded-xl border border-[var(--color-line)]">
        <table className="w-full border-collapse">
          <thead className="bg-[var(--color-surface-2)]">
            <tr>
              <HeaderCell sortable>Map zone</HeaderCell>
              <HeaderCell>Website</HeaderCell>
              <HeaderCell>Mobile App</HeaderCell>
              <HeaderCell>Admin</HeaderCell>
              <HeaderCell>Users</HeaderCell>
              <HeaderCell>Partners</HeaderCell>
              <HeaderCell>Capacity split?</HeaderCell>
              <HeaderCell sortable>Apply to all shows?</HeaderCell>
              <th className="w-10 px-2 py-3" />
            </tr>
          </thead>
          <tbody>
            {ticketRows.map((r, i) => {
              const isOpen = !!open[i];
              return (
                <RowFragment
                  key={i}
                  row={r}
                  open={isOpen}
                  onToggle={() => setOpen((o) => ({ ...o, [i]: !o[i] }))}
                />
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}

function RowFragment({
  row,
  open,
  onToggle,
}: {
  row: ZoneRow;
  open: boolean;
  onToggle: () => void;
}) {
  return (
    <>
      <tr className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0">
        <td className="px-4 py-3 font-medium">{row.zone}</td>
        <td className="px-4 py-3"><Checkbox state={row.website} /></td>
        <td className="px-4 py-3"><Checkbox state={row.mobile} /></td>
        <td className="px-4 py-3"><Checkbox state={row.admin} /></td>
        <td className="px-4 py-3">
          <div className="inline-flex items-center gap-2">
            <span>{row.users}</span>
            <GearButton />
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="inline-flex items-center gap-2">
            <span className="text-[var(--color-mute)]">{row.partners}</span>
            <GearButton />
          </div>
        </td>
        <td className="px-4 py-3">
          <div className="inline-flex items-center gap-2">
            <Checkbox state={row.capacitySplit} />
            {row.capacitySplit === "checked" && <GearButton />}
          </div>
        </td>
        <td className="px-4 py-3"><Checkbox state={row.applyAll} /></td>
        <td className="px-2 py-3">
          {row.expandable && (
            <button
              type="button"
              aria-label="Toggle"
              onClick={onToggle}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
            >
              {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
        </td>
      </tr>
      {row.expandable && open && row.children?.map((label, j) => (
        <tr key={`c-${j}`} className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0">
          <td className="pl-12 pr-4 py-3 text-[var(--color-mute)]">{label}</td>
          <td className="px-4 py-3"><Checkbox state={j === 2 ? "checked" : "unchecked"} /></td>
          <td className="px-4 py-3"><Checkbox state="checked" /></td>
          <td className="px-4 py-3"><Checkbox state={j === 0 ? "checked" : j === 1 ? "unchecked" : "unchecked"} /></td>
          <td className="px-4 py-3">
            <div className="inline-flex items-center gap-2">
              <span>All</span>
              <GearButton />
            </div>
          </td>
          <td className="px-4 py-3">
            <div className="inline-flex items-center gap-2">
              <span className="text-[var(--color-mute)]">None</span>
              <GearButton />
            </div>
          </td>
          <td className="px-4 py-3"><Checkbox state="unchecked" /></td>
          <td className="px-4 py-3"><Checkbox state="unchecked" /></td>
          <td />
        </tr>
      ))}
    </>
  );
}

export default function PermissionsSection() {
  return (
    <div>
      <h2 className="text-[20px] font-semibold tracking-tight">Permissions</h2>
      <div className="mt-6">
        <Group title="Tickets" defaultOpen count={ticketRows.length}>
          <TicketsGroupContent />
        </Group>
        <Group title="Packages" count={12} />
        <Group title="Add-ons" count={12} />
      </div>
    </div>
  );
}
