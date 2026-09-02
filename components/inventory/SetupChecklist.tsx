"use client";

import { useState } from "react";
import { Bolt, Close } from "@/components/icons";

const items = [
  {
    title: "Set up the zones",
    desc: "Customise prices, capacities and availability for the shows",
  },
  {
    title: "Set up the tickets",
    desc: "Customise prices, capacities and availability for the shows",
  },
  {
    title: "Create the packages",
    desc: "Customise prices, capacities and availability for the shows",
  },
  {
    title: "Set up the ticket office",
    desc: "Control the appearance of tickets in Page Manager",
  },
];

export default function SetupChecklist() {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  return (
    <section className="mt-2">
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-medium text-[var(--color-mute)]">
          Getting started
        </p>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="text-[13px] font-medium text-[var(--color-mute)] hover:text-[var(--color-ink)]"
        >
          Hide
        </button>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {items.map((it) => (
          <button
            key={it.title}
            type="button"
            className="group relative overflow-hidden rounded-xl bg-[var(--color-tint-purple)] p-4 text-left transition hover:bg-[var(--color-tint-purple-2)]"
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 inline-flex h-5 w-5 items-center justify-center text-[var(--color-platinum-haze)]">
                <Bolt size={18} />
              </span>
              <div className="min-w-0">
                <p className="text-[14px] font-semibold text-[var(--color-platinum-deep)]">
                  {it.title}
                </p>
                <p className="mt-1 text-[12.5px] leading-snug text-[var(--color-platinum-deep)]/70">
                  {it.desc}
                </p>
              </div>
            </div>
            <Close
              size={14}
              className="absolute right-3 top-3 text-[var(--color-platinum-deep)]/60 opacity-0 transition group-hover:opacity-100"
            />
          </button>
        ))}
      </div>
    </section>
  );
}
