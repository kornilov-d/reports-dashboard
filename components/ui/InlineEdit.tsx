"use client";

import { useEffect, useRef, useState } from "react";

export default function InlineEdit({
  value,
  onCommit,
  onEditingChange,
  className = "",
  ariaLabel,
  align = "left",
}: {
  value: string;
  onCommit: (next: string) => void;
  onEditingChange?: (editing: boolean) => void;
  className?: string;
  ariaLabel?: string;
  align?: "left" | "right";
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);
  const cbRef = useRef(onEditingChange);
  cbRef.current = onEditingChange;
  const prevEditing = useRef(editing);

  useEffect(() => {
    if (!editing) setDraft(value);
  }, [editing, value]);

  useEffect(() => {
    if (editing) inputRef.current?.select();
  }, [editing]);

  // Only notify on an actual transition so unrelated re-renders don't fire it.
  useEffect(() => {
    if (prevEditing.current !== editing) {
      prevEditing.current = editing;
      cbRef.current?.(editing);
    }
  }, [editing]);

  function commit() {
    setEditing(false);
    const next = draft.trim();
    if (next && next !== value) onCommit(next);
  }
  function cancel() {
    setDraft(value);
    setEditing(false);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          else if (e.key === "Escape") cancel();
        }}
        aria-label={ariaLabel}
        className={[
          "h-7 w-full rounded-md border border-[var(--color-ink)] bg-white px-2 text-[13px] outline-none",
          align === "right" ? "text-right" : "",
          className,
        ].join(" ")}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      aria-label={ariaLabel}
      className={[
        "-mx-1 flex w-full min-w-0 items-center rounded-md px-1 py-0.5 text-left transition-colors hover:bg-[var(--color-line-2)]",
        align === "right" ? "justify-end" : "",
        className,
      ].join(" ")}
    >
      <span className="min-w-0">{value}</span>
    </button>
  );
}
