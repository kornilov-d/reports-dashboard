"use client";

import { useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import Modal, { ModalBody, ModalFooter, ModalHeader } from "@/components/ui/Modal";
import { ChevronLeft } from "@/components/icons";
import { WIDGETS, WIDGET_ORDER } from "@/lib/dashboard/catalog";
import { sizeSpan, type WidgetSize, type WidgetType } from "@/lib/dashboard/types";

const SIZE_LABEL: Record<WidgetSize, string> = {
  "1x1": "Small · 1×1",
  "1x2": "Tall · 1×2",
  "2x2": "Large · 2×2",
};

function Preview({ size }: { size: WidgetSize }) {
  const { w, h } = sizeSpan(size);
  return (
    <span className="grid grid-cols-2 gap-[3px]">
      {[0, 1, 2, 3].map((i) => {
        const col = i % 2;
        const row = Math.floor(i / 2);
        const on = col < w && row < h;
        return (
          <span
            key={i}
            className={[
              "h-3.5 w-3.5 rounded-[3px]",
              on ? "bg-current" : "bg-[var(--color-line)]",
            ].join(" ")}
          />
        );
      })}
    </span>
  );
}

export default function AddWidgetModal({
  open,
  onClose,
  onAdd,
}: {
  open: boolean;
  onClose: () => void;
  onAdd: (type: WidgetType, size: WidgetSize) => void;
}) {
  const [type, setType] = useState<WidgetType | null>(null);
  const [size, setSize] = useState<WidgetSize | null>(null);

  useEffect(() => {
    if (!open) {
      setType(null);
      setSize(null);
    }
  }, [open]);

  const meta = type ? WIDGETS[type] : null;

  return (
    <Modal open={open} onClose={onClose} width={620} ariaLabel="Add widget">
      <ModalHeader>
        <div className="flex items-center gap-2">
          {meta && (
            <button
              type="button"
              aria-label="Back to widget list"
              onClick={() => {
                setType(null);
                setSize(null);
              }}
              className="-ml-1.5 flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
            >
              <ChevronLeft size={18} />
            </button>
          )}
          <div>
            <h2 className="text-[18px] font-semibold tracking-tight">
              {meta ? meta.label : "Add widget"}
            </h2>
            <p className="mt-0.5 text-[13px] text-[var(--color-mute)]">
              {meta
                ? "Choose a size — you can change it later from the widget options."
                : "Pick what the widget should report on."}
            </p>
          </div>
        </div>
      </ModalHeader>

      <ModalBody>
        {!meta ? (
          <div className="grid grid-cols-2 gap-3 pb-2">
            {WIDGET_ORDER.map((key) => {
              const w = WIDGETS[key];
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => {
                    setType(key);
                    setSize(w.defaultSize);
                  }}
                  className="flex flex-col items-start rounded-xl border border-[var(--color-line)] p-4 text-left transition-colors hover:border-[var(--color-platinum-haze)] hover:bg-[var(--color-tint-purple)]"
                >
                  <span className="text-[14px] font-semibold tracking-tight">
                    {w.label}
                  </span>
                  <span className="mt-1 text-[12.5px] leading-snug text-[var(--color-mute)]">
                    {w.description}
                  </span>
                  <span className="mt-3 text-[11px] font-medium uppercase tracking-wide text-[var(--color-mute-2)]">
                    {w.source}
                  </span>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="flex gap-3 pb-2">
            {meta.allowedSizes.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSize(s)}
                className={[
                  "flex flex-1 flex-col items-center gap-2.5 rounded-xl border px-3 py-5 text-[12.5px] font-medium transition-colors",
                  size === s
                    ? "border-[var(--color-ink)] text-[var(--color-ink)]"
                    : "border-[var(--color-line)] text-[var(--color-mute)] hover:border-[var(--color-mute-2)] hover:text-[var(--color-ink)]",
                ].join(" ")}
              >
                <Preview size={s} />
                {SIZE_LABEL[s]}
              </button>
            ))}
          </div>
        )}
      </ModalBody>

      <ModalFooter>
        <div className="flex items-center justify-end gap-2">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button
            disabled={!type || !size}
            onClick={() => {
              if (type && size) onAdd(type, size);
            }}
          >
            Add widget
          </Button>
        </div>
      </ModalFooter>
    </Modal>
  );
}
