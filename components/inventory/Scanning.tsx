"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Gear,
  Plus,
  Trash,
} from "@/components/icons";
import Button from "@/components/ui/Button";

type Mode = "Common" | "Disposable" | "Disabled";
type Strictness = "Strict" | "Unlimited" | "2 scans" | "3 scans" | "1 scan";

type PriceRow = {
  id: string;
  gate: string;
  price: string;
  strictness: Strictness;
};

const INITIAL_GATES = [
  "South Gate 1",
  "South Gate 2",
  "North Gate 1",
  "North Gate 2",
  "North Gate 3",
];

const COMMON_ROWS: PriceRow[] = [
  { id: "1", gate: "South Gate 2", price: "VIP → VIP Left → Early Bird", strictness: "2 scans" },
  { id: "2", gate: "South Gate 2", price: "VIP → VIP Left → Early Bird", strictness: "2 scans" },
  { id: "3", gate: "South Gate 2", price: "VIP → VIP Left → Early Bird", strictness: "Strict" },
  { id: "4", gate: "South Gate 2", price: "VIP → VIP Left → Early Bird", strictness: "Unlimited" },
  { id: "5", gate: "South Gate 2", price: "VIP → VIP Left → Early Bird", strictness: "2 scans" },
  { id: "6", gate: "South Gate 2", price: "VIP → VIP Left → Early Bird", strictness: "2 scans" },
];

const DISPOSABLE_ROWS: PriceRow[] = COMMON_ROWS.map((r) => ({
  ...r,
  strictness: "1 scan",
}));

function ModeSelect({
  mode,
  onChange,
}: {
  mode: Mode;
  onChange: (m: Mode) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex h-12 w-[280px] items-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left hover:border-[var(--color-mute-2)]"
      >
        <div className="flex flex-col leading-tight">
          <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
            Mode
          </span>
          <span className="text-[14px]">{mode}</span>
        </div>
        <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-[280px] overflow-hidden rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
          {(["Common", "Disposable", "Disabled"] as Mode[]).map((m) => (
            <button
              key={m}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(m);
                setOpen(false);
              }}
              className={[
                "block w-full px-4 py-2.5 text-left text-[13px] hover:bg-[var(--color-line-2)]",
                m === mode ? "font-semibold" : "",
              ].join(" ")}
            >
              {m}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function StrictnessPill({ value }: { value: Strictness }) {
  return (
    <span className="inline-flex h-7 items-center rounded-full bg-[var(--color-line-2)] px-3 text-[12.5px] font-medium text-[var(--color-ink)]">
      {value}
    </span>
  );
}

export default function Scanning() {
  const [mode, setMode] = useState<Mode>("Common");
  const [gates, setGates] = useState(INITIAL_GATES);
  const [selectedGate, setSelectedGate] = useState("South Gate 2");
  const [newGate, setNewGate] = useState("21");

  const disposable = mode === "Disposable";
  const rows = disposable ? DISPOSABLE_ROWS : COMMON_ROWS;

  function addGate() {
    const label = newGate.trim();
    if (!label) return;
    setGates((g) => [...g, label]);
    setNewGate("");
  }

  return (
    <section>
      <div className="flex items-start justify-between">
        <h2 className="text-[22px] font-bold tracking-tight">Scanning</h2>
        <ModeSelect mode={mode} onChange={setMode} />
      </div>

      {mode === "Disabled" ? (
        <div className="mt-8 rounded-2xl border border-dashed border-[var(--color-line)] bg-[var(--color-surface-2)] px-8 py-20 text-center">
          <h3 className="text-[18px] font-semibold tracking-tight">
            Scanning is disabled
          </h3>
          <p className="mx-auto mt-2 max-w-md text-[13.5px] text-[var(--color-mute)]">
            Tickets won&apos;t be validated at entry while scanning is off. Switch
            the mode to Common or Disposable to configure gates and connected
            prices.
          </p>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-[320px_1fr] gap-10">
          {/* Gates */}
          <div>
            <h3 className="text-[16px] font-semibold">Gates</h3>
            <div className="mt-4 flex gap-2">
              <input
                type="text"
                value={newGate}
                onChange={(e) => setNewGate(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") addGate();
                }}
                className="h-11 flex-1 rounded-xl border border-[var(--color-line)] bg-white px-3.5 text-[14px] outline-none focus:border-[var(--color-ink)]"
              />
              <Button
                variant="secondary"
                leading={<Plus size={16} />}
                onClick={addGate}
              >
                Add
              </Button>
            </div>

            <ul className="mt-4 space-y-1">
              {gates.map((g) => {
                const active = g === selectedGate;
                return (
                  <li key={g}>
                    <button
                      type="button"
                      onClick={() => setSelectedGate(g)}
                      className={[
                        "group flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-left text-[14px]",
                        active
                          ? "bg-[var(--color-line-2)] font-medium"
                          : "hover:bg-[var(--color-line-2)]",
                      ].join(" ")}
                    >
                      <span>{g}</span>
                      {active && (
                        <span
                          role="button"
                          aria-label="Delete gate"
                          onClick={(e) => {
                            e.stopPropagation();
                            setGates((gs) => gs.filter((x) => x !== g));
                          }}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-danger)] hover:bg-[#fce8e8]"
                        >
                          <Trash size={15} />
                        </span>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Connected prices */}
          <div>
            <h3 className="text-[16px] font-semibold">Connected prices</h3>

            <button
              type="button"
              className="mt-4 flex h-12 w-full items-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left text-[14px] hover:border-[var(--color-mute-2)]"
            >
              <span className="text-[var(--color-mute-2)]">Select prices</span>
              <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
            </button>

            <div className="mt-4 overflow-hidden rounded-xl border border-[var(--color-line)]">
              <table className="w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border-r border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                      <span className="inline-flex items-center gap-1.5">
                        Gate <ArrowUpDown size={12} />
                      </span>
                    </th>
                    <th className="border-r border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                      Price
                    </th>
                    <th className="border-r border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                      Strictness
                    </th>
                    <th className="w-28 bg-[var(--color-surface-2)] px-4 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
                    >
                      <td className="px-4 py-3.5">{r.gate}</td>
                      <td className="px-4 py-3.5">{r.price}</td>
                      <td className="px-4 py-3.5">
                        <StrictnessPill value={r.strictness} />
                      </td>
                      <td className="px-4 py-3.5">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            aria-label="Expand"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
                          >
                            <ChevronDown size={16} />
                          </button>
                          <button
                            type="button"
                            aria-label="Remove"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-danger)] hover:bg-[#fce8e8]"
                          >
                            <Trash size={15} />
                          </button>
                          <button
                            type="button"
                            aria-label="Settings"
                            className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
                          >
                            <Gear size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
