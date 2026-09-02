"use client";

import { useState } from "react";
import { ChevronDown, Gear } from "@/components/icons";
import Button from "@/components/ui/Button";
import {
  DTCM_PRICES,
  DTCM_SELECTED_SHOW,
  EXTERNAL_ENTITY_OPTIONS,
} from "@/components/inventory/integration/data";

type Tab = "default" | "exceptions";

function LabeledSelect({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex h-14 w-full items-center rounded-xl border border-[var(--color-line)] bg-white px-4 text-left hover:border-[var(--color-mute-2)]"
      >
        <div className="flex min-w-0 flex-col leading-tight">
          <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
            {label}
          </span>
          <span
            className={[
              "truncate text-[14px]",
              value ? "text-[var(--color-ink)]" : "text-[var(--color-mute-2)]",
            ].join(" ")}
          >
            {value || label}
          </span>
        </div>
        <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
      </button>
      {open && (
        <div className="absolute left-0 right-0 top-full z-20 mt-1 max-h-64 overflow-auto rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
          {EXTERNAL_ENTITY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt);
                setOpen(false);
              }}
              className={[
                "block w-full px-4 py-2.5 text-left text-[13px] tabular-nums hover:bg-[var(--color-line-2)]",
                opt === value ? "font-semibold" : "",
              ].join(" ")}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function PriceLabel({ name, price }: { name: string; price: string }) {
  return (
    <div>
      <p className="text-[14px]">
        <span className="font-medium text-[var(--color-platinum-haze)]">
          Ticket
        </span>{" "}
        {name}
      </p>
      <p className="mt-0.5 text-[14px] font-semibold tabular-nums">{price}</p>
    </div>
  );
}

export default function IntegrationDetail() {
  const [tab, setTab] = useState<Tab>("default");
  const [entities, setEntities] = useState(DTCM_PRICES.map((p) => p.entity));
  const [overrides, setOverrides] = useState(DTCM_PRICES.map((p) => p.override));
  const [showOpen, setShowOpen] = useState(false);

  return (
    <section>
      <div className="flex items-center justify-between">
        <h2 className="text-[22px] font-bold tracking-tight">Integrations</h2>
        <div className="inline-flex rounded-xl bg-[var(--color-line-2)] p-1">
          <button
            type="button"
            onClick={() => setTab("default")}
            className={[
              "rounded-lg px-4 py-1.5 text-[13px] font-semibold",
              tab === "default"
                ? "bg-white text-[var(--color-ink)] shadow-sm"
                : "text-[var(--color-mute)]",
            ].join(" ")}
          >
            Default
          </button>
          <button
            type="button"
            onClick={() => setTab("exceptions")}
            className={[
              "rounded-lg px-4 py-1.5 text-[13px] font-semibold",
              tab === "exceptions"
                ? "bg-white text-[var(--color-ink)] shadow-sm"
                : "text-[var(--color-mute)]",
            ].join(" ")}
          >
            Exceptions <span className="text-[var(--color-mute)]">4</span>
          </button>
        </div>
      </div>

      <div className="mt-6 flex items-start justify-between">
        <div>
          <p className="text-[16px] font-semibold">DTCM</p>
          <p className="mt-0.5 text-[13px] font-medium text-[var(--color-success)]">
            Synchronised
          </p>
        </div>
        <button
          type="button"
          aria-label="Integration settings"
          className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-line-2)] text-[var(--color-ink)] hover:bg-[#e3e3e7]"
        >
          <Gear size={16} />
        </button>
      </div>

      {tab === "exceptions" && (
        <div className="mt-6 flex items-center justify-between gap-4">
          <div className="relative w-[320px]">
            <button
              type="button"
              onClick={() => setShowOpen((v) => !v)}
              onBlur={() => setTimeout(() => setShowOpen(false), 120)}
              className="flex h-14 w-full items-center rounded-xl border border-[var(--color-line)] bg-white px-4 text-left hover:border-[var(--color-mute-2)]"
            >
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                  Selected show
                </span>
                <span className="text-[14px] tabular-nums">
                  {DTCM_SELECTED_SHOW}
                </span>
              </div>
              <ChevronDown size={16} className="ml-auto text-[var(--color-mute)]" />
            </button>
            {showOpen && (
              <div className="absolute left-0 right-0 top-full z-20 mt-1 rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
                {[
                  "19:30 Fri 11 Sep 2026",
                  "19:30 Sat 12 Sep 2026",
                  "19:30 Sun 13 Sep 2026",
                ].map((s) => (
                  <button
                    key={s}
                    type="button"
                    className="block w-full px-4 py-2.5 text-left text-[13px] tabular-nums hover:bg-[var(--color-line-2)]"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <Button
            className="!bg-[var(--color-danger)] !text-white hover:!bg-[#b82a2a]"
            size="lg"
            onClick={() => setOverrides(DTCM_PRICES.map(() => ""))}
          >
            Reset to default
          </Button>
        </div>
      )}

      <div className="mt-6 space-y-3">
        {DTCM_PRICES.map((p, i) => (
          <div
            key={i}
            className="grid grid-cols-[1fr_minmax(0,720px)] items-center gap-8"
          >
            <PriceLabel name={p.name} price={p.price} />
            {tab === "default" ? (
              <LabeledSelect
                label="External entity"
                value={entities[i]}
                onChange={(v) =>
                  setEntities((e) => e.map((x, j) => (j === i ? v : x)))
                }
              />
            ) : (
              <LabeledSelect
                label="Override"
                value={overrides[i]}
                onChange={(v) =>
                  setOverrides((o) => o.map((x, j) => (j === i ? v : x)))
                }
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
