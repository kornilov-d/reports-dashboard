"use client";

import { useState } from "react";
import {
  ArrowUpDown,
  ChevronDown,
  Search as SearchIcon,
  Trash,
} from "@/components/icons";
import Button from "@/components/ui/Button";

type SeasonEvent = { id: string; name: string; types: number };

type Mapping = { id: string; type: string; event: string };

const EVENTS: SeasonEvent[] = [
  { id: "alain", name: "Al Ain FC 2026/27 Season", types: 9 },
  { id: "alwasl", name: "Al Wasl FC 2026/27 Season", types: 11 },
  { id: "alshabab", name: "Al Shabab FC 2026/27 Season", types: 9 },
];

const SEASON_TYPES = [
  "Section VIP Left",
  "Section VIP Right",
  "Section Gold",
  "Section Silver",
  "Section General Admission",
];

const EVENT_OPTIONS = [
  "VIP → VIP Left → Early Bird",
  "VIP → VIP Left → Regular",
  "VIP → VIP Right → Early Bird",
  "Gold → Early Bird",
  "Silver → Early Bird",
];

let counter = 0;
const rid = () => `m-${Date.now().toString(36)}-${counter++}`;

function seedRows(n: number): Mapping[] {
  return Array.from({ length: n }, () => ({
    id: rid(),
    type: "Section VIP Left",
    event: "VIP → VIP Left → Early Bird",
  }));
}

const INITIAL_ROWS: Record<string, Mapping[]> = {
  alain: seedRows(3),
  alwasl: seedRows(6),
  alshabab: seedRows(2),
};

function ThisEventSelect({
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
        onBlur={() => setTimeout(() => setOpen(false), 120)}
        className="flex w-full items-center gap-2 text-left text-[13px]"
      >
        <span className="flex-1">{value}</span>
        <ChevronDown size={16} className="text-[var(--color-mute)]" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-1 w-[300px] overflow-hidden rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
          {EVENT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                onChange(opt);
                setOpen(false);
              }}
              className={[
                "block w-full px-4 py-2.5 text-left text-[13px] hover:bg-[var(--color-line-2)]",
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

export default function SeasonTickets() {
  const [query, setQuery] = useState("");
  const [selectedId, setSelectedId] = useState("alwasl");
  const [rowsByEvent, setRowsByEvent] =
    useState<Record<string, Mapping[]>>(INITIAL_ROWS);
  const [typeOpen, setTypeOpen] = useState(false);

  const selected = EVENTS.find((e) => e.id === selectedId)!;
  const rows = rowsByEvent[selectedId] ?? [];

  const filteredEvents = EVENTS.filter((e) =>
    e.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function addType(type: string) {
    setRowsByEvent((m) => ({
      ...m,
      [selectedId]: [
        ...(m[selectedId] ?? []),
        { id: rid(), type, event: EVENT_OPTIONS[0] },
      ],
    }));
  }

  function addAll() {
    setRowsByEvent((m) => ({
      ...m,
      [selectedId]: [
        ...(m[selectedId] ?? []),
        ...SEASON_TYPES.map((type) => ({
          id: rid(),
          type,
          event: EVENT_OPTIONS[0],
        })),
      ],
    }));
  }

  function removeRow(id: string) {
    setRowsByEvent((m) => ({
      ...m,
      [selectedId]: (m[selectedId] ?? []).filter((r) => r.id !== id),
    }));
  }

  function setRowEvent(id: string, event: string) {
    setRowsByEvent((m) => ({
      ...m,
      [selectedId]: (m[selectedId] ?? []).map((r) =>
        r.id === id ? { ...r, event } : r,
      ),
    }));
  }

  return (
    <section>
      <h2 className="flex items-center gap-3 text-[22px] font-bold tracking-tight">
        Season Tickets
        <span className="text-[14px] font-medium text-[var(--color-mute)]">
          12
        </span>
      </h2>

      <div className="mt-6 grid grid-cols-[320px_1fr] gap-10">
        {/* Season Event list */}
        <div>
          <h3 className="text-[16px] font-semibold">Season Event</h3>
          <div className="relative mt-4">
            <input
              type="text"
              placeholder="Search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--color-line)] bg-white pl-3.5 pr-9 text-[14px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
            />
            <SearchIcon
              size={16}
              className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[var(--color-mute)]"
            />
          </div>

          <ul className="mt-3 space-y-1">
            {filteredEvents.map((e) => {
              const active = e.id === selectedId;
              return (
                <li key={e.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(e.id)}
                    className={[
                      "w-full rounded-xl px-4 py-3 text-left",
                      active
                        ? "bg-[var(--color-line-2)]"
                        : "hover:bg-[var(--color-line-2)]",
                    ].join(" ")}
                  >
                    <p className="text-[14px] font-medium">{e.name}</p>
                    <p className="mt-0.5 text-[12.5px] text-[var(--color-mute)]">
                      {e.types} types
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Mappings */}
        <div>
          <h3 className="text-[16px] font-semibold">
            Mappings for {selected.name}
          </h3>

          <div className="mt-4 flex items-center gap-3">
            <div className="relative flex-1">
              <button
                type="button"
                onClick={() => setTypeOpen((v) => !v)}
                onBlur={() => setTimeout(() => setTypeOpen(false), 120)}
                className="flex h-12 w-full items-center gap-2 rounded-xl border border-[var(--color-line)] bg-white px-4 text-left text-[14px] hover:border-[var(--color-mute-2)]"
              >
                <span className="text-[var(--color-mute-2)]">
                  Select season ticket types
                </span>
                <ChevronDown
                  size={16}
                  className="ml-auto text-[var(--color-mute)]"
                />
              </button>
              {typeOpen && (
                <div className="absolute left-0 right-0 top-full z-20 mt-1 overflow-hidden rounded-xl border border-[var(--color-line)] bg-white py-1 shadow-lg">
                  {SEASON_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        addType(t);
                        setTypeOpen(false);
                      }}
                      className="block w-full px-4 py-2.5 text-left text-[13px] hover:bg-[var(--color-line-2)]"
                    >
                      {t}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button variant="secondary" size="md" onClick={addAll}>
              Add all
            </Button>
          </div>

          <div className="mt-4 overflow-visible rounded-xl border border-[var(--color-line)]">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-r border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                    <span className="inline-flex items-center gap-1.5">
                      Season ticket type <ArrowUpDown size={12} />
                    </span>
                  </th>
                  <th className="border-r border-[var(--color-line)] bg-[var(--color-surface-2)] px-4 py-3 text-left text-[12px] font-medium uppercase tracking-wide text-[var(--color-mute)]">
                    This event
                  </th>
                  <th className="w-12 bg-[var(--color-surface-2)] px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {rows.length === 0 ? (
                  <tr className="border-t border-[var(--color-line)]">
                    <td
                      colSpan={3}
                      className="px-4 py-10 text-center text-[13px] text-[var(--color-mute)]"
                    >
                      No mappings yet. Add season ticket types above.
                    </td>
                  </tr>
                ) : (
                  rows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-t border-[var(--color-line)] text-[13px] [&>td]:border-r [&>td]:border-[var(--color-line)] [&>td:last-child]:border-r-0"
                    >
                      <td className="px-4 py-3.5">{r.type}</td>
                      <td className="px-4 py-3.5">
                        <ThisEventSelect
                          value={r.event}
                          onChange={(v) => setRowEvent(r.id, v)}
                        />
                      </td>
                      <td className="px-4 py-3.5">
                        <button
                          type="button"
                          aria-label="Remove mapping"
                          onClick={() => removeRow(r.id)}
                          className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-danger)] hover:bg-[#fce8e8]"
                        >
                          <Trash size={15} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
