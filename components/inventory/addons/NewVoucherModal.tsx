"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, ChevronDown } from "@/components/icons";
import AvailabilityGrid from "@/components/ui/AvailabilityGrid";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";
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

export default function NewVoucherModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [internalName, setInternalName] = useState("");
  const [officeName, setOfficeName] = useState("");
  const [price, setPrice] = useState("");
  const [allShows, setAllShows] = useState(false);
  const [days, setDays] = useState(sampleAvailability());
  const [quotaAll, setQuotaAll] = useState(false);
  const [quotaRows, setQuotaRows] = useState(sampleCapacityRows());

  useEffect(() => {
    if (!open) {
      setInternalName("");
      setOfficeName("");
      setPrice("");
      setAllShows(false);
      setDays(sampleAvailability());
      setQuotaAll(false);
      setQuotaRows(sampleCapacityRows());
    }
  }, [open]);

  const selectedCount = days.reduce((n, d) => n + d.selected.size, 0);

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
  function selectAll() {
    setDays((prev) =>
      prev.map((d) => ({ ...d, selected: new Set(d.times.map((_, i) => i)) })),
    );
  }

  return (
    <Modal open={open} onClose={onClose} ariaLabel="New voucher" width={720}>
      <ModalHeader>
        <h2 className="text-[26px] font-bold tracking-tight">New voucher</h2>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6 py-2">
          <div>
            <p className="text-[14px] font-semibold">Internal voucher name</p>
            <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">
              This name will be shown to organizer team
            </p>
            <input
              type="text"
              placeholder="Internal name"
              value={internalName}
              onChange={(e) => setInternalName(e.target.value)}
              className="mt-3 h-12 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 text-[14px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
            />
          </div>

          <div>
            <p className="text-[14px] font-semibold">Ticket office name</p>
            <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">
              This name will be shown to customer
            </p>
            <input
              type="text"
              placeholder="Internal name"
              value={officeName}
              onChange={(e) => setOfficeName(e.target.value)}
              className="mt-3 h-12 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 text-[14px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
            />
          </div>

          <div>
            <p className="text-[14px] font-semibold">Price (AED)</p>
            <input
              type="text"
              inputMode="numeric"
              placeholder="Price (AED)"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-3 h-12 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 text-[14px] tabular-nums outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
            />
          </div>

          <div>
            <p className="text-[14px] font-semibold">Upsell Availability</p>
            <div className="mt-3">
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
                className="inline-flex cursor-pointer items-center gap-2 text-[13px]"
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
                <div className="mt-3 flex items-center justify-between text-[13px]">
                  <span className="text-[var(--color-mute)]">
                    {selectedCount} selected
                  </span>
                  <button
                    type="button"
                    onClick={selectAll}
                    className="font-medium text-[var(--color-ink)] hover:underline"
                  >
                    Select all
                  </button>
                </div>
                <div className="mt-3">
                  <AvailabilityGrid days={days} onToggle={toggleSlot} />
                </div>
              </>
            )}
          </div>

          <div>
            <p className="text-[14px] font-semibold">Quota</p>
            <div className="mt-3">
              <span
                role="button"
                tabIndex={0}
                onClick={() => setQuotaAll((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setQuotaAll((v) => !v);
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-2 text-[13px]"
              >
                <Checkbox state={quotaAll ? "checked" : "unchecked"} />
                <span>Apply to all shows</span>
              </span>
            </div>
            {!quotaAll && (
              <div className="mt-3 space-y-2.5">
                {quotaRows.map((r, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1fr_220px] items-center gap-3"
                  >
                    <span className="text-[13px]">{r.label}</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={r.value}
                      onChange={(e) =>
                        setQuotaRows((rs) =>
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
