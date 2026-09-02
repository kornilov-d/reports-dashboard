"use client";

import { useEffect, useState } from "react";
import { ChevronDown, PlusSmall, Trash } from "@/components/icons";
import AvailabilityGrid from "@/components/ui/AvailabilityGrid";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";
import SelectOptionsField from "@/components/inventory/packages/SelectOptionsField";
import { sampleAvailability } from "@/lib/availability";
import {
  ITEM_TONES,
  SHOW_OPTIONS,
  type PackageItemType,
  type PackageOption,
} from "@/lib/packageItems";

type Mode = "open" | "fixed";

type ContentLine = {
  /** Unique within the package draft. */
  lineId: string;
  /** ID of the chosen catalog option. */
  optionId: string;
  type: PackageItemType;
  label: string;
  unitPrice: number;
  qty: number;
  /** Only for ticket lines in "fixed" mode. */
  show?: string;
};

function ModeCard({
  active,
  onClick,
  title,
  subtitle,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "flex flex-col items-start gap-1 rounded-xl border bg-white p-4 text-left",
        active
          ? "border-[var(--color-ink)]"
          : "border-[var(--color-line)] hover:border-[var(--color-mute-2)]",
      ].join(" ")}
    >
      <div className="flex w-full items-start justify-between gap-3">
        <p className="text-[15px] font-semibold">{title}</p>
        <span
          className={[
            "mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
            active ? "border-[var(--color-ink)]" : "border-[var(--color-line)]",
          ].join(" ")}
        >
          {active && (
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-ink)]" />
          )}
        </span>
      </div>
      <p className="text-[12.5px] text-[var(--color-mute)]">{subtitle}</p>
    </button>
  );
}

function Stepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <div className="flex h-10 items-center overflow-hidden rounded-xl bg-[var(--color-line-2)]">
      <button
        type="button"
        aria-label="Decrease"
        onClick={() => onChange(Math.max(1, value - 1))}
        className="flex h-10 w-10 items-center justify-center text-[var(--color-ink)] hover:bg-[#e3e3e7]"
      >
        <Minus />
      </button>
      <span className="min-w-[40px] text-center text-[14px] font-semibold tabular-nums">
        {value}
      </span>
      <button
        type="button"
        aria-label="Increase"
        onClick={() => onChange(value + 1)}
        className="flex h-10 w-10 items-center justify-center text-[var(--color-ink)] hover:bg-[#e3e3e7]"
      >
        <PlusSmall size={14} />
      </button>
    </div>
  );
}

function Minus() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path
        d="M3 7h8"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ShowPicker({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-12 w-full items-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left hover:border-[var(--color-mute-2)]"
      >
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
            Show
          </span>
          <span className="text-[14px] tabular-nums">{value}</span>
        </div>
        <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-30 mt-1 overflow-hidden rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
          {SHOW_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                onChange(s);
                setOpen(false);
              }}
              className="block w-full px-4 py-2 text-left text-[13.5px] hover:bg-[var(--color-line-2)]"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentRow({
  line,
  showShowPicker,
  onChangeQty,
  onChangeShow,
  onRemove,
}: {
  line: ContentLine;
  showShowPicker: boolean;
  onChangeQty: (n: number) => void;
  onChangeShow: (s: string) => void;
  onRemove: () => void;
}) {
  const total = line.unitPrice * line.qty;
  const tone = ITEM_TONES[line.type];
  return (
    <div className="space-y-2">
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <p className="text-[14px] leading-snug">
            <span className={["font-semibold", tone.chip].join(" ")}>
              {tone.label}
            </span>{" "}
            <span className="text-[var(--color-ink)]">{line.label}</span>
          </p>
          <p className="mt-0.5 text-[13px] font-semibold tabular-nums text-[var(--color-ink)]">
            {line.qty}×{line.unitPrice} AED
            <span className="text-[var(--color-mute)]"> = {total} AED</span>
          </p>
        </div>
        <Stepper value={line.qty} onChange={onChangeQty} />
        <button
          type="button"
          aria-label="Remove"
          onClick={onRemove}
          className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-line-2)] text-[var(--color-ink)] hover:bg-[#e3e3e7]"
        >
          <Trash size={16} />
        </button>
      </div>
      {showShowPicker && (
        <ShowPicker value={line.show ?? SHOW_OPTIONS[1]} onChange={onChangeShow} />
      )}
    </div>
  );
}

export default function NewPackageModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [mode, setMode] = useState<Mode>("open");
  const [contents, setContents] = useState<ContentLine[]>([]);
  const [days, setDays] = useState(sampleAvailability());
  const [allShows, setAllShows] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setMode("open");
      setContents([
        seed("tk-gold-eb-1", "ticket", "Gold – Early bird", 900, 2),
        seed("up-meet-greet", "upsell", "Meet & Greet", 150, 2),
        seed("vc-complimentary", "voucher", "Complimentary drinks", 25, 4),
        seed("vc-parking", "voucher", "Parking", 50, 1),
      ]);
      setDays(sampleAvailability());
      setAllShows(false);
    }
  }, [open]);

  function seed(
    optionId: string,
    type: PackageItemType,
    label: string,
    unitPrice: number,
    qty: number,
  ): ContentLine {
    return {
      lineId: `${optionId}-${Math.random().toString(36).slice(2, 7)}`,
      optionId,
      type,
      label,
      unitPrice,
      qty,
      show: SHOW_OPTIONS[1],
    };
  }

  function addOption(opt: PackageOption) {
    setContents((cs) => [
      ...cs,
      {
        lineId: `${opt.id}-${Math.random().toString(36).slice(2, 7)}`,
        optionId: opt.id,
        type: opt.type,
        label: opt.label,
        unitPrice: opt.unitPrice,
        qty: 1,
        show: SHOW_OPTIONS[1],
      },
    ]);
  }

  function updateLine(lineId: string, patch: Partial<ContentLine>) {
    setContents((cs) => cs.map((c) => (c.lineId === lineId ? { ...c, ...patch } : c)));
  }
  function removeLine(lineId: string) {
    setContents((cs) => cs.filter((c) => c.lineId !== lineId));
  }

  const total = contents.reduce((sum, c) => sum + c.unitPrice * c.qty, 0);
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
    <Modal open={open} onClose={onClose} ariaLabel="New package" width={720}>
      <ModalHeader>
        <h2 className="text-[26px] font-bold tracking-tight">New package</h2>
        <p className="mt-1 text-[14px] text-[var(--color-mute)]">
          Combine tickets, add-ons and vouchers
        </p>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6 py-2">
          <div>
            <p className="text-[14px] font-semibold">Package name</p>
            <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">
              This name will be shown in ticket office
            </p>
            <input
              type="text"
              placeholder="Package name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-3 h-12 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 text-[14px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <ModeCard
              active={mode === "open"}
              onClick={() => setMode("open")}
              title="Open selection"
              subtitle="Customer picks one show from the range you set"
            />
            <ModeCard
              active={mode === "fixed"}
              onClick={() => setMode("fixed")}
              title="Fixed selection"
              subtitle="You pick the exact show(s) upfront for the package"
            />
          </div>

          <div>
            <p className="text-[14px] font-semibold">Package contents</p>
            <div className="mt-3">
              <SelectOptionsField onAdd={addOption} />
            </div>

            <div className="mt-5 space-y-4">
              {contents.map((c) => (
                <ContentRow
                  key={c.lineId}
                  line={c}
                  showShowPicker={mode === "fixed" && c.type === "ticket"}
                  onChangeQty={(n) => updateLine(c.lineId, { qty: n })}
                  onChangeShow={(s) => updateLine(c.lineId, { show: s })}
                  onRemove={() => removeLine(c.lineId)}
                />
              ))}
              {contents.length === 0 && (
                <p className="text-[13px] text-[var(--color-mute)]">
                  No items selected yet.
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-[var(--color-line)] pt-5">
            <p className="text-[14px] text-[var(--color-mute)]">Total price</p>
            <p className="mt-1 text-[20px] font-bold tabular-nums">{total} AED</p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <p className="text-[14px] font-semibold">Package availability</p>
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
