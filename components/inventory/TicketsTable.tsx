"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Gear,
  Pencil,
  Plus,
  PlusSmall,
  Trash,
} from "@/components/icons";
import Button from "@/components/ui/Button";
import InlineEdit from "@/components/ui/InlineEdit";
import AvailableShowsModal from "@/components/inventory/tickets/AvailableShowsModal";
import CreateTicketModal from "@/components/inventory/tickets/CreateTicketModal";
import EditPriceModal from "@/components/inventory/tickets/EditPriceModal";
import SetCapacityModal from "@/components/inventory/tickets/SetCapacityModal";
import { TICKETS, type TicketRow } from "@/lib/tickets";

function HeaderCell({
  children,
  sortable = true,
  className = "",
}: {
  children: React.ReactNode;
  sortable?: boolean;
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
        {sortable && <ArrowUpDown size={12} />}
      </span>
    </th>
  );
}

function DateChip({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-[var(--color-line-2)] px-3 text-[12px] font-medium text-[var(--color-ink)]">
      {children}
    </span>
  );
}

function MoreChip({ count }: { count: number }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-[var(--color-line-2)] px-2.5 text-[12px] font-medium text-[var(--color-mute)]">
      +{count}
    </span>
  );
}

type ModalState =
  | { kind: "none" }
  | { kind: "addPrice"; row: TicketRow }
  | { kind: "shows"; row: TicketRow }
  | { kind: "capacity"; row: TicketRow }
  | { kind: "createTicket" }
  | { kind: "editTicket"; row: TicketRow };

export default function TicketsTable() {
  const [rows, setRows] = useState<TicketRow[]>(TICKETS);
  const [collapsed, setCollapsed] = useState<Record<string, boolean>>({});
  const [modal, setModal] = useState<ModalState>({ kind: "none" });

  const visible = rows.filter((r) => {
    if (!r.isChild) return true;
    return !collapsed["vip"];
  });

  function update(id: string, patch: Partial<TicketRow>) {
    setRows((rs) => rs.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  function close() {
    setModal({ kind: "none" });
  }

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-3 text-[20px] font-semibold tracking-tight">
          Tickets
          <span className="text-[14px] font-medium text-[var(--color-mute)]">
            {rows.filter((r) => !r.isChild).length + 4}
          </span>
        </h2>
        <Button
          leading={<Plus size={16} />}
          size="md"
          onClick={() => setModal({ kind: "createTicket" })}
        >
          Add ticket
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <HeaderCell>Name</HeaderCell>
              <HeaderCell>Price</HeaderCell>
              <HeaderCell>Capacity</HeaderCell>
              <HeaderCell>Shows</HeaderCell>
              <th className="w-24 border-l border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            {visible.map((r) => (
              <Row
                key={r.id}
                r={r}
                expanded={r.isParent ? !collapsed[r.id] : undefined}
                onToggle={
                  r.isParent
                    ? () => setCollapsed((c) => ({ ...c, [r.id]: !c[r.id] }))
                    : undefined
                }
                onEditName={(v) => update(r.id, { name: v })}
                onEditPrice={(v) => update(r.id, { price: v })}
                onEditCapacity={(v) => update(r.id, { capacity: v })}
                onAddPrice={() => setModal({ kind: "addPrice", row: r })}
                onOpenShows={() => setModal({ kind: "shows", row: r })}
                onOpenCapacity={() => setModal({ kind: "capacity", row: r })}
                onEditTicket={() => setModal({ kind: "editTicket", row: r })}
              />
            ))}
          </tbody>
        </table>
      </div>

      <EditPriceModal
        open={modal.kind === "addPrice"}
        onClose={close}
        ticket={{ name: modal.kind === "addPrice" ? modal.row.name : "" }}
      />
      <AvailableShowsModal
        open={modal.kind === "shows"}
        onClose={close}
      />
      <SetCapacityModal
        open={modal.kind === "capacity"}
        onClose={close}
        ticket={{ name: modal.kind === "capacity" ? modal.row.name : "" }}
        priceName={
          modal.kind === "capacity" && modal.row.isChild ? modal.row.name : undefined
        }
      />
      <CreateTicketModal
        open={modal.kind === "createTicket"}
        onClose={close}
        mode="create"
      />
      <CreateTicketModal
        open={modal.kind === "editTicket"}
        onClose={close}
        mode="edit"
        initial={
          modal.kind === "editTicket"
            ? {
                name: modal.row.name,
                price: modal.row.price,
                capacity: modal.row.capacity,
              }
            : undefined
        }
      />
    </section>
  );
}

function Row({
  r,
  expanded,
  onToggle,
  onEditName,
  onEditPrice,
  onEditCapacity,
  onAddPrice,
  onOpenShows,
  onOpenCapacity,
  onEditTicket,
}: {
  r: TicketRow;
  expanded?: boolean;
  onToggle?: () => void;
  onEditName: (v: string) => void;
  onEditPrice: (v: string) => void;
  onEditCapacity: (v: string) => void;
  onAddPrice: () => void;
  onOpenShows: () => void;
  onOpenCapacity: () => void;
  onEditTicket: () => void;
}) {
  const childTone = r.isChild ? "text-[var(--color-mute)]" : "text-[var(--color-ink)]";
  return (
    <tr className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0">
      <td className={["px-4 py-3.5", r.isChild ? "pl-10" : ""].join(" ")}>
        <div className="flex w-full items-center gap-2">
          {r.isParent && (
            <button
              type="button"
              aria-label="Toggle"
              onClick={onToggle}
              className="shrink-0 text-[var(--color-mute)]"
            >
              {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </button>
          )}
          <div
            className={[
              "min-w-0 flex-1",
              r.isChild
                ? "font-medium text-[var(--color-mute)]"
                : "font-semibold",
            ].join(" ")}
          >
            <InlineEdit
              value={r.name}
              onCommit={onEditName}
              ariaLabel="Edit name"
            />
          </div>
          {r.isParent && (
            <span className="shrink-0 text-[var(--color-mute)]">
              {r.childCount}
            </span>
          )}
        </div>
      </td>

      <td className="px-4 py-3.5">
        <div className="flex w-full items-center gap-2">
          <div
            className={[
              "min-w-0 flex-1",
              r.isParent ? "text-[var(--color-mute)]" : childTone,
            ].join(" ")}
          >
            {r.isParent ? (
              <span>{r.price}</span>
            ) : (
              <InlineEdit
                value={r.price}
                onCommit={onEditPrice}
                ariaLabel="Edit price value"
              />
            )}
          </div>
          {!r.isChild && (
            <button
              type="button"
              aria-label="Add price"
              onClick={onAddPrice}
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[var(--color-line)] text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
            >
              <PlusSmall size={12} />
            </button>
          )}
        </div>
      </td>

      <td className="px-4 py-3.5">
        {r.capacity && (
          <div className="flex w-full items-center gap-2">
            <div className={["min-w-0 flex-1", childTone].join(" ")}>
              <InlineEdit
                value={r.capacity}
                onCommit={onEditCapacity}
                ariaLabel="Edit capacity"
              />
            </div>
            <button
              type="button"
              aria-label="Capacity settings"
              onClick={onOpenCapacity}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
            >
              <Gear size={14} />
            </button>
          </div>
        )}
      </td>

      <td className="px-4 py-3.5">
        {r.shows && (
          <div className="flex flex-wrap items-center gap-2">
            {r.shows.all ? (
              <span className="text-[13px]">All</span>
            ) : (
              <>
                {r.shows.chips?.map((c, i) => (
                  <DateChip key={i}>{c}</DateChip>
                ))}
                {r.shows.more && <MoreChip count={r.shows.more} />}
              </>
            )}
            {!r.isParent && (
              <button
                type="button"
                aria-label="Shows settings"
                onClick={onOpenShows}
                className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
              >
                <Gear size={14} />
              </button>
            )}
          </div>
        )}
      </td>

      <td className="px-4 py-3.5">
        <div className="inline-flex items-center gap-1">
          <button
            type="button"
            aria-label="Edit ticket"
            onClick={onEditTicket}
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
          >
            <Pencil size={15} />
          </button>
          <button
            type="button"
            aria-label="Delete"
            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-danger)] hover:bg-[#fce8e8]"
          >
            <Trash size={15} />
          </button>
        </div>
      </td>
    </tr>
  );
}
