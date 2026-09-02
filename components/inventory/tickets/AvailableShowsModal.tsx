"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "@/components/icons";
import AvailabilityGrid from "@/components/ui/AvailabilityGrid";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Modal from "@/components/ui/Modal";
import { sampleAvailability } from "@/lib/availability";

function DateField({ label, value }: { label: string; value: string }) {
  return (
    <button
      type="button"
      className="flex h-12 w-full items-center gap-2.5 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left hover:border-[var(--color-mute-2)]"
    >
      <CalendarIcon size={18} className="text-[var(--color-mute)]" />
      <div className="flex flex-col leading-tight">
        <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
          {label}
        </span>
        <span className="text-[14px] tabular-nums">{value}</span>
      </div>
      <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
    </button>
  );
}

export default function AvailableShowsModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [allShows, setAllShows] = useState(false);
  const [days, setDays] = useState(sampleAvailability());

  useEffect(() => {
    if (!open) {
      setAllShows(false);
      setDays(sampleAvailability());
    }
  }, [open]);

  function toggleSlot(di: number, ti: number) {
    setDays((prev) =>
      prev.map((d, i) => {
        if (i !== di) return d;
        const next = new Set(d.selected);
        if (next.has(ti)) next.delete(ti);
        else next.add(ti);
        return { ...d, selected: next };
      }),
    );
  }

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Available shows" width={680}>
      <div className="px-8 pt-8">
        <h2 className="text-[24px] font-bold tracking-tight">Available shows</h2>
        <p className="mt-1 text-[14px] text-[var(--color-mute)]">
          Combine tickets, add-ons and vouchers
        </p>
      </div>

      <div className="px-8 py-5">
        <div className="flex items-center justify-between">
          <p className="text-[14px] font-semibold">Ticket availability</p>
          <span
            role="button"
            tabIndex={0}
            onClick={() => setAllShows((v) => !v)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setAllShows((v) => !v);
              }
            }}
            className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-ink)]"
          >
            <Checkbox state={allShows ? "checked" : "unchecked"} />
            <span>Available on all shows</span>
          </span>
        </div>

        {!allShows && (
          <>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <DateField label="Start date" value="10.04.2026" />
              <DateField label="End date" value="14.04.2026" />
            </div>
            <div className="mt-4">
              <AvailabilityGrid days={days} onToggle={toggleSlot} />
            </div>
          </>
        )}
      </div>

      <div className="flex items-center gap-3 px-8 pb-8 pt-2">
        <Button
          variant="secondary"
          size="lg"
          onClick={onClose}
          className="flex-1 rounded-xl"
        >
          Cancel
        </Button>
        <Button size="lg" className="flex-1 rounded-xl" onClick={onClose}>
          Save
        </Button>
      </div>
    </Modal>
  );
}
