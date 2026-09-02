"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  Pencil,
  Plus,
  Search as SearchIcon,
} from "@/components/icons";
import Button from "@/components/ui/Button";
import NewUpsellModal from "@/components/inventory/addons/NewUpsellModal";
import NewVoucherModal from "@/components/inventory/addons/NewVoucherModal";

type UpsellRow = {
  name: string;
  quota: string;
  shows: { chips: string[]; more?: number } | "all";
  appliesTo: string;
  attributes?: string;
  price: string;
};

type VoucherRow = {
  internal: string;
  office: string;
  quota: string;
  shows: { chips: string[]; more?: number } | "all";
  price: string;
};

const UPSELLS: UpsellRow[] = [
  { name: "Family Fun Pack", quota: "100", shows: "all", appliesTo: "All", price: "1500 AED" },
  { name: "T-shirt “Copacabana Charcoal”", quota: "100", shows: { chips: ["Fri 11 Sep 2026, 19:30"], more: 2 }, appliesTo: "15 categories", attributes: "Size", price: "1500 AED" },
  { name: "T-shirt “Copacabana Blue”", quota: "100", shows: { chips: ["Fri 11 Sep 2026, 19:30"], more: 3 }, appliesTo: "14 categories", attributes: "Size", price: "1500 AED" },
  { name: "T-shirt “En face”", quota: "100", shows: { chips: ["Fri 11 Sep 2026, 19:30"], more: 1 }, appliesTo: "15 categories", attributes: "Size", price: "1500 AED" },
  { name: "Family Fun Pack", quota: "Custom", shows: "all", appliesTo: "All", price: "1500 AED" },
  { name: "Weekend Getaway", quota: "100", shows: { chips: ["Fri 11 Sep 2026, 19:30"], more: 2 }, appliesTo: "12 categories", price: "1500 AED" },
];

const VOUCHERS: VoucherRow[] = [
  { internal: "parking", office: "Reserved parking spot", quota: "100", shows: "all", price: "1500 AED" },
  { internal: "parking2", office: "Reserved parking spot for 2", quota: "100", shows: { chips: ["Fri 11 Sep 2026, 19:30"], more: 2 }, price: "1500 AED" },
  { internal: "meal", office: "Dinner buffet", quota: "100", shows: { chips: ["Fri 11 Sep 2026, 19:30"], more: 3 }, price: "1500 AED" },
  { internal: "drink", office: "1 drink + Refill", quota: "Custom", shows: { chips: ["Fri 11 Sep 2026, 19:30"], more: 1 }, price: "1500 AED" },
];

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

function Chip({
  children,
  tone = "default",
}: {
  children: React.ReactNode;
  tone?: "default" | "muted";
}) {
  return (
    <span
      className={[
        "inline-flex h-6 items-center rounded-full px-2.5 text-[12px] font-medium",
        tone === "muted"
          ? "bg-[var(--color-line-2)] text-[var(--color-mute)]"
          : "bg-[var(--color-line-2)] text-[var(--color-ink)]",
      ].join(" ")}
    >
      {children}
    </span>
  );
}

function ShowsCell({ shows }: { shows: UpsellRow["shows"] | VoucherRow["shows"] }) {
  if (shows === "all") return <span>All</span>;
  return (
    <div className="flex flex-wrap items-center gap-2">
      {shows.chips.map((c, j) => (
        <Chip key={j}>{c}</Chip>
      ))}
      {shows.more && <Chip tone="muted">+{shows.more}</Chip>}
    </div>
  );
}

export default function AddOns() {
  const [tab, setTab] = useState<"upsells" | "vouchers">("upsells");
  const [openUpsell, setOpenUpsell] = useState(false);
  const [openVoucher, setOpenVoucher] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between gap-4">
        <div className="inline-flex rounded-xl bg-[var(--color-line-2)] p-1">
          <button
            type="button"
            onClick={() => setTab("upsells")}
            className={[
              "rounded-lg px-4 py-1.5 text-[13px] font-semibold",
              tab === "upsells"
                ? "bg-white text-[var(--color-ink)] shadow-sm"
                : "text-[var(--color-mute)]",
            ].join(" ")}
          >
            Upsells
          </button>
          <button
            type="button"
            onClick={() => setTab("vouchers")}
            className={[
              "rounded-lg px-4 py-1.5 text-[13px] font-semibold",
              tab === "vouchers"
                ? "bg-white text-[var(--color-ink)] shadow-sm"
                : "text-[var(--color-mute)]",
            ].join(" ")}
          >
            Vouchers
          </button>
        </div>
        <Button
          leading={<Plus size={16} />}
          onClick={() => (tab === "upsells" ? setOpenUpsell(true) : setOpenVoucher(true))}
        >
          {tab === "upsells" ? "New upsell" : "New voucher"}
        </Button>
      </div>

      <NewUpsellModal open={openUpsell} onClose={() => setOpenUpsell(false)} />
      <NewVoucherModal open={openVoucher} onClose={() => setOpenVoucher(false)} />

      <div className="mt-5 relative">
        <SearchIcon
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
        />
        <input
          type="text"
          placeholder="Search by name"
          className="h-10 w-[260px] rounded-lg border border-[var(--color-line)] bg-white pl-9 pr-3 text-[13px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
        />
      </div>

      {tab === "upsells" ? (
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <HeaderCell>Name</HeaderCell>
                <HeaderCell>Quota</HeaderCell>
                <HeaderCell>Shows</HeaderCell>
                <HeaderCell>Applies to</HeaderCell>
                <HeaderCell>Attributes</HeaderCell>
                <HeaderCell>Price</HeaderCell>
                <th className="w-12 border-l border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {UPSELLS.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
                >
                  <td className="px-4 py-3.5 font-medium">{r.name}</td>
                  <td className="px-4 py-3.5">{r.quota}</td>
                  <td className="px-4 py-3.5">
                    <ShowsCell shows={r.shows} />
                  </td>
                  <td className="px-4 py-3.5">{r.appliesTo}</td>
                  <td className="px-4 py-3.5">
                    {r.attributes ? (
                      <Chip>{r.attributes}</Chip>
                    ) : (
                      <span className="text-[var(--color-mute)]">None</span>
                    )}
                  </td>
                  <td className="px-4 py-3.5 tabular-nums">{r.price}</td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      aria-label="Edit upsell"
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
      ) : (
        <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <HeaderCell>Internal name</HeaderCell>
                <HeaderCell>Ticket office name</HeaderCell>
                <HeaderCell>Quota</HeaderCell>
                <HeaderCell>Shows</HeaderCell>
                <HeaderCell>Price</HeaderCell>
                <th className="w-12 border-l border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {VOUCHERS.map((r, i) => (
                <tr
                  key={i}
                  className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
                >
                  <td className="px-4 py-3.5 font-medium">{r.internal}</td>
                  <td className="px-4 py-3.5">{r.office}</td>
                  <td className="px-4 py-3.5">{r.quota}</td>
                  <td className="px-4 py-3.5">
                    <ShowsCell shows={r.shows} />
                  </td>
                  <td className="px-4 py-3.5 tabular-nums">{r.price}</td>
                  <td className="px-4 py-3.5">
                    <button
                      type="button"
                      aria-label="Edit voucher"
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
      )}
    </section>
  );
}
