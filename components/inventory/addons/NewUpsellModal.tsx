"use client";

import { useEffect, useState } from "react";
import {
  Calendar as CalendarIcon,
  ChevronDown,
  Close,
  DragHandle,
  Plus,
} from "@/components/icons";
import AvailabilityGrid from "@/components/ui/AvailabilityGrid";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import Modal, {
  ModalBody,
  ModalFooter,
  ModalHeader,
} from "@/components/ui/Modal";
import { sampleAvailability, sampleCapacityRows } from "@/lib/availability";

type Attribute = {
  id: string;
  name: string;
  values: { id: string; text: string }[];
};

type Chip = { id: string; label: string };

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

function RemovableChip({
  label,
  onRemove,
}: {
  label: string;
  onRemove: () => void;
}) {
  return (
    <span className="inline-flex h-7 items-center gap-1.5 rounded-full bg-[var(--color-line-2)] pl-3 pr-1.5 text-[12.5px] font-medium text-[var(--color-ink)]">
      {label}
      <button
        type="button"
        aria-label="Remove"
        onClick={onRemove}
        className="flex h-5 w-5 items-center justify-center rounded-full text-[var(--color-mute)] hover:bg-white hover:text-[var(--color-ink)]"
      >
        <Close size={12} />
      </button>
    </span>
  );
}

function AttributeBlock({
  attr,
  onChange,
  onRemove,
}: {
  attr: Attribute;
  onChange: (next: Attribute) => void;
  onRemove: () => void;
}) {
  return (
    <div className="rounded-xl bg-[var(--color-line-2)] p-4">
      <div className="flex items-start gap-2">
        <div className="relative flex-1 rounded-xl border border-[var(--color-line)] bg-white focus-within:border-[var(--color-ink)]">
          <label className="absolute left-4 top-1.5 text-[11px] font-medium text-[var(--color-mute)]">
            Attribute
          </label>
          <input
            value={attr.name}
            onChange={(e) => onChange({ ...attr, name: e.target.value })}
            className="h-12 w-full rounded-xl bg-transparent px-4 pt-4 text-[14px] outline-none"
          />
        </div>
        <button
          type="button"
          aria-label="Remove attribute"
          onClick={onRemove}
          className="mt-2 flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-danger)] hover:bg-[#fce8e8]"
        >
          <Close size={16} />
        </button>
      </div>

      <p className="mt-3 text-[12.5px] font-medium text-[var(--color-mute)]">
        Values
      </p>
      <div className="mt-2 space-y-2">
        {attr.values.map((v, i) => (
          <div key={v.id} className="flex items-center gap-2">
            <DragHandle size={16} className="shrink-0 text-[var(--color-mute)]" />
            <input
              value={v.text}
              onChange={(e) =>
                onChange({
                  ...attr,
                  values: attr.values.map((x, j) =>
                    j === i ? { ...x, text: e.target.value } : x,
                  ),
                })
              }
              className="h-10 w-full rounded-xl border border-[var(--color-line)] bg-white px-3.5 text-[14px] outline-none focus:border-[var(--color-ink)]"
            />
            <button
              type="button"
              aria-label="Remove value"
              onClick={() =>
                onChange({
                  ...attr,
                  values: attr.values.filter((_, j) => j !== i),
                })
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-[var(--color-danger)] hover:bg-[#fce8e8]"
            >
              <Close size={16} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() =>
            onChange({
              ...attr,
              values: [
                ...attr.values,
                { id: Math.random().toString(36).slice(2, 7), text: "" },
              ],
            })
          }
          className="flex items-center gap-1.5 px-2 pt-1 text-[12.5px] font-medium text-[var(--color-ink)] hover:underline"
        >
          <Plus size={14} /> Add value
        </button>
      </div>
    </div>
  );
}

function CategoryPicker({
  selected,
  onRemove,
  onAdd,
}: {
  selected: Chip[];
  onRemove: (id: string) => void;
  onAdd: () => void;
}) {
  return (
    <div>
      <button
        type="button"
        onClick={onAdd}
        className="flex h-12 w-full items-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left text-[14px] hover:border-[var(--color-mute-2)]"
      >
        <span className="text-[var(--color-mute-2)]">
          Select tickets &amp; categories
        </span>
        <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
      </button>
      {selected.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {selected.map((c) => (
            <RemovableChip
              key={c.id}
              label={c.label}
              onRemove={() => onRemove(c.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

const DEFAULT_ATTR: Attribute = {
  id: "size",
  name: "Size",
  values: [
    { id: "l", text: "Large" },
    { id: "m", text: "Medium" },
    { id: "s", text: "Small" },
  ],
};

const DEFAULT_CHIPS: Chip[] = [
  { id: "c1", label: "Gold → Early Bird" },
  { id: "c2", label: "Gold → Regular" },
  { id: "c3", label: "Gold → Regular" },
  { id: "c4", label: "VIP → VIP Left → Regular" },
  { id: "c5", label: "VIP → VIP Right → Regular" },
];

export default function NewUpsellModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [attrs, setAttrs] = useState<Attribute[]>([DEFAULT_ATTR]);
  const [applyAllCats, setApplyAllCats] = useState(false);
  const [chips, setChips] = useState<Chip[]>(DEFAULT_CHIPS);
  const [allShows, setAllShows] = useState(false);
  const [days, setDays] = useState(sampleAvailability());
  const [quotaAll, setQuotaAll] = useState(true);
  const [quotaRows, setQuotaRows] = useState(sampleCapacityRows());

  useEffect(() => {
    if (!open) {
      setName("");
      setPrice("");
      setAttrs([DEFAULT_ATTR]);
      setApplyAllCats(false);
      setChips(DEFAULT_CHIPS);
      setAllShows(false);
      setDays(sampleAvailability());
      setQuotaAll(true);
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
    <Modal open={open} onClose={onClose} ariaLabel="New upsell" width={720}>
      <ModalHeader>
        <h2 className="text-[26px] font-bold tracking-tight">New upsell</h2>
      </ModalHeader>

      <ModalBody>
        <div className="space-y-6 py-2">
          <div>
            <p className="text-[14px] font-semibold">Upsell name</p>
            <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">
              This name will be shown in ticket office
            </p>
            <input
              type="text"
              placeholder="Upsell name"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[14px] font-semibold">Attributes</p>
                <p className="mt-1 text-[12.5px] text-[var(--color-mute)]">
                  Add attributes with values (e.g Size, Tier)
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                leading={<Plus size={14} />}
                onClick={() =>
                  setAttrs((a) => [
                    ...a,
                    {
                      id: Math.random().toString(36).slice(2, 7),
                      name: "",
                      values: [],
                    },
                  ])
                }
              >
                Add
              </Button>
            </div>
            <div className="mt-3 space-y-3">
              {attrs.map((attr, i) => (
                <AttributeBlock
                  key={attr.id}
                  attr={attr}
                  onChange={(next) =>
                    setAttrs((a) => a.map((x, j) => (j === i ? next : x)))
                  }
                  onRemove={() => setAttrs((a) => a.filter((_, j) => j !== i))}
                />
              ))}
            </div>
          </div>

          <div>
            <p className="text-[14px] font-semibold">
              Apply to specific categories
            </p>
            <div className="mt-3">
              <span
                role="button"
                tabIndex={0}
                onClick={() => setApplyAllCats((v) => !v)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setApplyAllCats((v) => !v);
                  }
                }}
                className="inline-flex cursor-pointer items-center gap-2 text-[13px]"
              >
                <Checkbox state={applyAllCats ? "checked" : "unchecked"} />
                <span>Apply to all categories</span>
              </span>
            </div>
            {!applyAllCats && (
              <div className="mt-3">
                <CategoryPicker
                  selected={chips}
                  onRemove={(id) => setChips((cs) => cs.filter((c) => c.id !== id))}
                  onAdd={() =>
                    setChips((cs) => [
                      ...cs,
                      {
                        id: Math.random().toString(36).slice(2, 7),
                        label: "New category",
                      },
                    ])
                  }
                />
              </div>
            )}
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
            {quotaAll ? (
              <input
                type="text"
                inputMode="numeric"
                placeholder="Quota"
                className="mt-3 h-12 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 text-[14px] tabular-nums outline-none focus:border-[var(--color-ink)]"
              />
            ) : (
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
