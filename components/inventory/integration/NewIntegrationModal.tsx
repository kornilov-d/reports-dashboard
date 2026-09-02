"use client";

import { useEffect, useState } from "react";
import { Help, Search } from "@/components/icons";
import Button from "@/components/ui/Button";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";
import { DTCM_SHOWS } from "@/components/inventory/integration/data";

export default function NewIntegrationModal({
  open,
  onClose,
  onSave,
}: {
  open: boolean;
  onClose: () => void;
  onSave: () => void;
}) {
  const [codes, setCodes] = useState<string[]>(() =>
    DTCM_SHOWS.map((s) => s.code),
  );

  useEffect(() => {
    if (!open) setCodes(DTCM_SHOWS.map((s) => s.code));
  }, [open]);

  return (
    <Modal open={open} onClose={onClose} ariaLabel="New integration" width={680}>
      <ModalHeader>
        <h2 className="text-[26px] font-bold tracking-tight">New integration</h2>
        <div className="mt-4 flex h-12 items-center gap-2 rounded-xl bg-[var(--color-line-2)] px-4">
          <div className="flex flex-col leading-tight">
            <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
              Platform
            </span>
            <span className="text-[14px] text-[var(--color-mute)]">DTCM</span>
          </div>
          <Search size={18} className="ml-auto text-[var(--color-mute)]" />
        </div>
      </ModalHeader>

      <ModalBody>
        <p className="pb-2 text-[15px] font-semibold">Shows</p>
        <div className="space-y-3">
          {DTCM_SHOWS.map((s, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_300px] items-center gap-4"
            >
              <span className="text-[14px] tabular-nums">{s.time}</span>
              <div className="relative rounded-xl border border-[var(--color-line)] bg-white focus-within:border-[var(--color-ink)]">
                <label className="absolute left-4 top-1.5 text-[11px] font-medium text-[var(--color-mute)]">
                  Performance code
                </label>
                <input
                  value={codes[i]}
                  onChange={(e) =>
                    setCodes((c) =>
                      c.map((x, j) => (j === i ? e.target.value : x)),
                    )
                  }
                  className="h-12 w-full rounded-xl bg-transparent px-4 pr-10 pt-4 text-[14px] tabular-nums outline-none"
                />
                <Help
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
                />
              </div>
            </div>
          ))}
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
          <Button size="lg" className="flex-1 rounded-xl" onClick={onSave}>
            Save
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
