"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Modal from "@/components/ui/Modal";
import { sampleCapacityRows } from "@/lib/availability";

export default function SetCapacityModal({
  open,
  onClose,
  ticket,
  priceName,
}: {
  open: boolean;
  onClose: () => void;
  ticket: { name: string };
  priceName?: string;
}) {
  const [custom, setCustom] = useState(true);
  const [rows, setRows] = useState(sampleCapacityRows());

  useEffect(() => {
    if (!open) {
      setCustom(true);
      setRows(sampleCapacityRows());
    }
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Set capacity" width={720}>
      <div className="px-8 pt-8">
        <h2 className="text-[24px] font-bold tracking-tight">Set capacity</h2>
        <p className="mt-1 text-[14px] text-[var(--color-mute)]">
          Set up different capacities for each show
        </p>
      </div>

      <div className="px-8 py-4 space-y-5">
        <div>
          <p className="text-[14px] font-semibold">Ticket</p>
          <p className="mt-1 text-[14px] text-[var(--color-mute)]">{ticket.name}</p>
        </div>

        {priceName && (
          <div>
            <p className="text-[14px] font-semibold">Price name</p>
            <p className="mt-1 text-[14px] text-[var(--color-mute)]">{priceName}</p>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <p className="text-[14px] font-semibold">Capacity</p>
            <span
              role="button"
              tabIndex={0}
              onClick={() => setCustom((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setCustom((v) => !v);
                }
              }}
              className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-ink)]"
            >
              <Checkbox state={custom ? "checked" : "unchecked"} />
              <span>Custom capacity per show</span>
            </span>
          </div>

          {custom && (
            <div className="mt-4 space-y-2.5">
              {rows.map((r, i) => (
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
                      setRows((rs) =>
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
