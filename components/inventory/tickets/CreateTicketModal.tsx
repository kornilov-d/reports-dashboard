"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal from "@/components/ui/Modal";

function FloatingField({
  label,
  value,
  onChange,
  help,
  type = "text",
  inputMode,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  help?: string;
  type?: string;
  inputMode?: "numeric";
}) {
  return (
    <div>
      <div className="relative rounded-xl border border-[var(--color-line)] bg-white focus-within:border-[var(--color-ink)]">
        <label className="absolute left-4 top-2 text-[11px] font-medium text-[var(--color-mute)]">
          {label}
        </label>
        <input
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-14 w-full rounded-xl bg-transparent px-4 pt-5 text-[14px] outline-none"
        />
      </div>
      {help && (
        <p className="mt-1.5 text-[12.5px] text-[var(--color-mute)]">{help}</p>
      )}
    </div>
  );
}

function ImageDropzone() {
  return (
    <div className="flex h-[88px] items-center justify-center rounded-xl border border-dashed border-[var(--color-line)] bg-white">
      <div className="flex items-center gap-3 text-[13.5px] text-[var(--color-mute)]">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="6" width="18" height="14" rx="2" />
          <circle cx="12" cy="13" r="3" />
          <path d="M8 6l1.5-2h5L16 6" />
        </svg>
        <div>
          <p className="text-[13.5px] font-semibold text-[var(--color-ink)]">
            Drag here or click to upload the image
          </p>
          <p className="mt-0.5 text-[12.5px] text-[var(--color-mute)]">
            Allowed file types: jpg, jpeg, gif, png
          </p>
        </div>
      </div>
    </div>
  );
}

export default function CreateTicketModal({
  open,
  onClose,
  mode = "create",
  initial,
}: {
  open: boolean;
  onClose: () => void;
  mode?: "create" | "edit";
  initial?: { name?: string; price?: string; capacity?: string };
}) {
  const [name, setName] = useState(initial?.name ?? "");
  const [price, setPrice] = useState(initial?.price ?? "");
  const [capacity, setCapacity] = useState(initial?.capacity ?? "");
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (open) {
      setName(initial?.name ?? "");
      setPrice(initial?.price ?? "");
      setCapacity(initial?.capacity ?? "");
      setDescription("");
    }
  }, [open, initial]);

  return (
    <Modal open={open} onClose={onClose} ariaLabel="Create ticket" width={680}>
      <div className="px-8 pt-8">
        <h2 className="text-[26px] font-bold tracking-tight">
          {mode === "edit" ? "Edit ticket" : "Create ticket"}
        </h2>
      </div>

      <div className="px-8 py-5 space-y-4">
        <p className="text-[15px] font-semibold">Ticket type</p>

        <FloatingField label="Name" value={name} onChange={setName} />
        <FloatingField
          label="Price"
          value={price}
          onChange={setPrice}
          help="Price cannot be changed after saving the ticket"
        />
        <FloatingField
          label="Capacity"
          value={capacity}
          onChange={setCapacity}
          inputMode="numeric"
        />

        <div>
          <div className="relative rounded-xl border border-[var(--color-line)] bg-white focus-within:border-[var(--color-ink)]">
            <label className="absolute left-4 top-2 text-[11px] font-medium text-[var(--color-mute)]">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-xl bg-transparent px-4 pb-3 pt-6 text-[14px] outline-none"
            />
          </div>
          <p className="mt-1.5 text-[12.5px] text-[var(--color-mute)]">Hint</p>
        </div>

        <div>
          <div className="flex items-baseline justify-between">
            <p className="text-[15px] font-semibold">Images</p>
            <span className="text-[12.5px] text-[var(--color-mute)]">Optional</span>
          </div>
          <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">
            Add images to show what you are offering with this ticket, i.e., view from seats, venue ambiance, or food and beverage offers.
          </p>
          <div className="mt-3">
            <ImageDropzone />
          </div>
          <p className="mt-2 text-[12px] text-[var(--color-mute)]">
            Min size 755 × 495 px. Max size 3000 × 3000. Allowed file types: jpg, jpeg, gif, png
          </p>
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
