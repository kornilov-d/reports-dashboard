"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "@/components/icons";
import AvailabilityGrid from "@/components/ui/AvailabilityGrid";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { sampleAvailability, sampleCapacityRows } from "@/lib/availability";

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

function ToggleRow({
  label,
  value,
  onClick,
}: {
  label: string;
  value: boolean;
  onClick: () => void;
}) {
  return (
    <span
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-ink)]"
    >
      <Checkbox state={value ? "checked" : "unchecked"} />
      <span>{label}</span>
    </span>
  );
}

export default function EditPriceModal({
  open,
  onClose,
  ticket,
}: {
  open: boolean;
  onClose: () => void;
  ticket: { name: string };
}) {
  const [name, setName] = useState("");
  const [allShows, setAllShows] = useState(false);
  const [customCapacity, setCustomCapacity] = useState(true);
  const [days, setDays] = useState(sampleAvailability());
  const [capacityRows, setCapacityRows] = useState(sampleCapacityRows());

  useEffect(() => {
    if (!open) {
      setName("");
      setAllShows(false);
      setCustomCapacity(true);
      setDays(sampleAvailability());
      setCapacityRows(sampleCapacityRows());
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
    <Modal open={open} onClose={onClose} ariaLabel="Edit price" width={720}>
      <ModalHeader>
        <h2 className="text-[22px] font-bold tracking-tight">Edit price</h2>
        <p className="mt-1 text-[14px] text-[var(--color-mute)]">
          Set up different prices for the ticket
        </p>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6 py-2">
          <div>
            <p className="text-[14px] font-semibold">Ticket</p>
            <p className="mt-1 text-[14px] text-[var(--color-mute)]">{ticket.name}</p>
          </div>

          <div>
            <p className="text-[14px] font-semibold">Price name</p>
            <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">
              This name will be shown in ticket office
            </p>
            <input
              type="text"
              placeholder="Price name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-3 h-12 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 text-[14px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold">Price availability</p>
              <ToggleRow
                label="Available on all shows"
                value={allShows}
                onClick={() => setAllShows((v) => !v)}
              />
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

          <div>
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold">Capacity</p>
              <ToggleRow
                label="Custom capacity per show"
                value={customCapacity}
                onClick={() => setCustomCapacity((v) => !v)}
              />
            </div>

            {customCapacity && (
              <div className="mt-4 space-y-2.5">
                {capacityRows.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_220px] items-center gap-3"
                  >
                    <span className="text-[13px] text-[var(--color-ink)]">
                      {r.label}
                    </span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={r.value}
                      onChange={(e) =>
                        setCapacityRows((rs) =>
                          rs.map((x, j) =>
                            j === i ? { ...x, value: e.target.value } : x,
                          ),
                        )
                      }
                      className="h-10 w-full rounded-xl border border-[var(--color-line)] bg-white px-3.5 text-[14px] tabular-nums outline-none focus:border-[var(--color-ink)]"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center gap-3">
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
      </ModalFooter>
    </Modal>
  );
}
