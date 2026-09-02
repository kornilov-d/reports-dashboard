"use client";

import { useEffect } from "react";
import { Close, Undo } from "@/components/icons";

/** Optimistic-save confirmation with a single-step undo (spec §6.3). */
export default function UndoToast({
  message,
  onUndo,
  onDismiss,
}: {
  message: string;
  onUndo: () => void;
  onDismiss: () => void;
}) {
  useEffect(() => {
    const timer = window.setTimeout(onDismiss, 6000);
    return () => window.clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-6 z-[80] flex justify-center px-6">
      <div className="pointer-events-auto flex items-center gap-3 rounded-xl bg-[var(--color-ink)] py-2.5 pl-4 pr-2.5 text-white shadow-[0_12px_32px_rgba(13,13,16,0.28)]">
        <span className="text-[13px]">{message}</span>
        <button
          type="button"
          onClick={onUndo}
          className="inline-flex h-7 items-center gap-1.5 rounded-md px-2 text-[13px] font-medium text-white/90 hover:bg-white/10 hover:text-white"
        >
          <Undo size={14} />
          Undo
        </button>
        <button
          type="button"
          aria-label="Dismiss"
          onClick={onDismiss}
          className="flex h-7 w-7 items-center justify-center rounded-md text-white/60 hover:bg-white/10 hover:text-white"
        >
          <Close size={14} />
        </button>
      </div>
    </div>
  );
}
