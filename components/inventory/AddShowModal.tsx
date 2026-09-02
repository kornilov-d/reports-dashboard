"use client";

import { useEffect, useState } from "react";
import { Calendar as CalendarIcon, Clock } from "@/components/icons";
import Button from "@/components/ui/Button";
import Checkbox from "@/components/ui/Checkbox";
import DateTimePicker, {
  type DateTimeValue,
} from "@/components/ui/DateTimePicker";
import Modal from "@/components/ui/Modal";
import type { Show } from "@/lib/calendar";
import { isoDate } from "@/lib/date";

function Field({
  label,
  help,
  children,
}: {
  label: string;
  help?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-1 items-start gap-4 py-3 md:grid-cols-[1fr_320px]">
      <div className="pt-3">
        <p className="text-[14px] font-semibold tracking-tight">{label}</p>
        {help && (
          <div className="mt-1 text-[12.5px] leading-snug text-[var(--color-mute)]">
            {help}
          </div>
        )}
      </div>
      <div>{children}</div>
    </div>
  );
}

const emptyDT: DateTimeValue = { date: null, time: "" };

export default function AddShowModal({
  open,
  onClose,
  onSave,
  initialMonth,
}: {
  open: boolean;
  onClose: () => void;
  onSave: (show: Show) => void;
  initialMonth?: { year: number; month: number };
}) {
  const [name, setName] = useState("");
  const [doors, setDoors] = useState<DateTimeValue>(emptyDT);
  const [startTime, setStartTime] = useState<DateTimeValue>(emptyDT);
  const [end, setEnd] = useState<DateTimeValue>(emptyDT);
  const [useDuration, setUseDuration] = useState(false);

  useEffect(() => {
    if (!open) {
      setName("");
      setDoors(emptyDT);
      setStartTime(emptyDT);
      setEnd(emptyDT);
      setUseDuration(false);
    }
  }, [open]);

  const canSave = !!doors.date && !!startTime.time && !!end.time;

  function handleSave() {
    if (!canSave || !doors.date) return;
    onSave({
      id: crypto.randomUUID(),
      name: name.trim() || "Show",
      date: isoDate(doors.date),
      start: startTime.time,
      end: end.time,
    });
    onClose();
  }

  return (
    <Modal open={open} onClose={onClose} ariaLabel="New show" width={720}>
      <div className="px-8 pt-8">
        <h2 className="text-[22px] font-bold tracking-tight">New show</h2>
        <p className="mt-1 text-[14px] text-[var(--color-mute)]">
          Set up shows to start working with the inventory
        </p>
      </div>

      <div className="px-8 py-4 divide-y divide-[var(--color-line)]">
        <Field
          label="Internal show name"
          help={"This field is optional and won't be shown to customer."}
        >
          <input
            type="text"
            placeholder="Show name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12 w-full rounded-xl border border-[var(--color-line)] bg-white px-4 text-[14px] outline-none placeholder:text-[var(--color-mute-2)] focus:border-[var(--color-ink)]"
          />
        </Field>

        <Field
          label="What's the opening time of the venue?"
          help="This time and date will be shown on tickets"
        >
          <DateTimePicker
            value={doors}
            onChange={setDoors}
            placeholder="Doors open time & date"
            icon={<CalendarIcon size={18} />}
            initialMonth={initialMonth}
          />
        </Field>

        <Field
          label="What's the start time of the show?"
          help="This time and date will be shown on tickets"
        >
          <DateTimePicker
            mode="time"
            value={startTime}
            onChange={setStartTime}
            placeholder="Start time"
            icon={<Clock size={18} />}
          />
        </Field>

        <Field
          label="What's the closing time of the show?"
          help={
            <span
              role="button"
              tabIndex={0}
              onClick={() => setUseDuration((v) => !v)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setUseDuration((v) => !v);
                }
              }}
              className="inline-flex cursor-pointer items-center gap-2 text-[13px] text-[var(--color-ink)]"
            >
              <Checkbox state={useDuration ? "checked" : "unchecked"} />
              <span>Use duration instead</span>
            </span>
          }
        >
          {useDuration ? (
            <DateTimePicker
              mode="time"
              value={end}
              onChange={setEnd}
              placeholder="Duration (HH:MM)"
              icon={<Clock size={18} />}
            />
          ) : (
            <DateTimePicker
              value={end}
              onChange={setEnd}
              placeholder="End time & date"
              icon={<CalendarIcon size={18} />}
              initialMonth={initialMonth}
            />
          )}
        </Field>
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
        <Button
          size="lg"
          className="flex-1 rounded-xl"
          disabled={!canSave}
          onClick={handleSave}
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
