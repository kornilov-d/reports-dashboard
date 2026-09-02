"use client";

import { useEffect } from "react";
import { Close } from "@/components/icons";

export default function Modal({
  open,
  onClose,
  children,
  width = 720,
  ariaLabel,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  width?: number;
  ariaLabel?: string;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-8"
      role="dialog"
      aria-modal="true"
      aria-label={ariaLabel}
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        className="relative flex max-h-[calc(100vh-64px)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
        style={{ maxWidth: width }}
      >
        <button
          type="button"
          aria-label="Close"
          onClick={onClose}
          className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
        >
          <Close size={18} />
        </button>
        {children}
      </div>
    </div>
  );
}

/** Sticky non-scrolling header. Use alongside ModalBody + ModalFooter for tall modals. */
export function ModalHeader({ children }: { children: React.ReactNode }) {
  return <div className="shrink-0 px-8 pt-8 pb-4">{children}</div>;
}

/** Scrollable body. Combined with ModalHeader/ModalFooter the modal stays within the viewport. */
export function ModalBody({ children }: { children: React.ReactNode }) {
  return <div className="flex-1 overflow-y-auto px-8 py-2">{children}</div>;
}

/** Sticky non-scrolling footer. */
export function ModalFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="shrink-0 border-t border-[var(--color-line)] bg-white px-8 py-5">
      {children}
    </div>
  );
}
