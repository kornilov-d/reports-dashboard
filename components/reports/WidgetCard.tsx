"use client";

import { useRef, useState } from "react";
import { Dots, DragHandle, Refresh } from "@/components/icons";
import EditPopover from "./EditPopover";
import { useWidgetData } from "./useWidgetData";
import AttendanceWidget from "./widgets/AttendanceWidget";
import ChannelsWidget from "./widgets/ChannelsWidget";
import PopularityWidget from "./widgets/PopularityWidget";
import ResaleWidget from "./widgets/ResaleWidget";
import RevenueWidget from "./widgets/RevenueWidget";
import { WIDGETS } from "@/lib/dashboard/catalog";
import type { WidgetData } from "@/lib/dashboard/data";
import type { DashboardWidget, Filters } from "@/lib/dashboard/types";

function Body({
  widget,
  data,
}: {
  widget: DashboardWidget;
  data: WidgetData;
}) {
  switch (data.kind) {
    case "revenue":
      return <RevenueWidget widget={widget} data={data} />;
    case "attendance":
      return <AttendanceWidget widget={widget} data={data} />;
    case "channels":
      return <ChannelsWidget widget={widget} data={data} />;
    case "resale":
      return <ResaleWidget widget={widget} data={data} />;
    case "popularity":
      return <PopularityWidget widget={widget} data={data} />;
  }
}

function Skeleton({ tall }: { tall: boolean }) {
  return (
    <div className="flex h-full animate-pulse flex-col gap-2">
      <div className="h-6 w-2/5 rounded-md bg-[var(--color-line-2)]" />
      {tall ? (
        <div className="mt-1 flex-1 rounded-lg bg-[var(--color-line-2)]" />
      ) : (
        <div className="h-3 w-3/5 rounded-md bg-[var(--color-line-2)]" />
      )}
    </div>
  );
}

export default function WidgetCard({
  widget,
  filters,
  editMode,
  simulateErrors,
  dragging,
  onChange,
  onRemove,
  onDuplicate,
  onDragStart,
  onDragEnd,
  onDragOverCard,
}: {
  widget: DashboardWidget;
  filters: Filters;
  editMode: boolean;
  simulateErrors: boolean;
  dragging: boolean;
  onChange: (next: DashboardWidget) => void;
  onRemove: () => void;
  onDuplicate: () => void;
  onDragStart: () => void;
  onDragEnd: () => void;
  onDragOverCard: () => void;
}) {
  const meta = WIDGETS[widget.type];
  const state = useWidgetData(widget, filters, simulateErrors);
  const [open, setOpen] = useState(false);
  const anchorRef = useRef<HTMLButtonElement>(null);
  const tall = widget.size !== "1x1";

  return (
    <div
      draggable={editMode}
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", widget.id);
        onDragStart();
      }}
      onDragEnd={onDragEnd}
      onDragOver={(e) => {
        if (!editMode) return;
        e.preventDefault();
        onDragOverCard();
      }}
      className={[
        "group relative flex h-full min-h-0 flex-col rounded-xl border bg-white p-4 transition-shadow",
        dragging
          ? "border-dashed border-[var(--color-platinum-haze)] opacity-50"
          : "border-[var(--color-line)] hover:shadow-[0_1px_2px_rgba(13,13,16,0.06),0_8px_24px_rgba(13,13,16,0.06)]",
        editMode ? "cursor-grab active:cursor-grabbing" : "",
      ].join(" ")}
    >
      <div className="flex items-start gap-2">
        {editMode && (
          <span
            aria-hidden="true"
            className="-ml-1 mt-[1px] text-[var(--color-mute-2)]"
          >
            <DragHandle size={16} />
          </span>
        )}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[13px] font-semibold tracking-tight">
            {meta.label}
          </h3>
        </div>

        <button
          ref={anchorRef}
          type="button"
          aria-label={`Options for ${meta.label}`}
          onClick={() => setOpen((v) => !v)}
          className={[
            "-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-[var(--color-mute)] transition-opacity hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)] focus-visible:opacity-100",
            open || editMode
              ? "opacity-100"
              : "opacity-0 group-hover:opacity-100",
          ].join(" ")}
        >
          <Dots size={16} />
        </button>
      </div>

      <div className="mt-2.5 min-h-0 flex-1">
        {state.status === "loading" && <Skeleton tall={tall} />}

        {state.status === "error" && (
          <div className="flex h-full flex-col items-start justify-center gap-2">
            <p className="text-[12px] text-[var(--color-mute)]">
              {state.message}
            </p>
            <button
              type="button"
              onClick={state.retry}
              className="inline-flex h-7 items-center gap-1.5 rounded-md border border-[var(--color-line)] px-2.5 text-[12px] font-medium hover:bg-[var(--color-line-2)]"
            >
              <Refresh size={13} />
              Retry
            </button>
          </div>
        )}

        {state.status === "empty" && (
          <div className="flex h-full items-center justify-center">
            <p className="text-center text-[12px] text-[var(--color-mute-2)]">
              No data for this period
            </p>
          </div>
        )}

        {state.status === "ready" && <Body widget={widget} data={state.data} />}
      </div>

      {open && (
        <EditPopover
          widget={widget}
          anchor={anchorRef}
          onClose={() => setOpen(false)}
          onChange={onChange}
          onRemove={() => {
            setOpen(false);
            onRemove();
          }}
          onDuplicate={() => {
            setOpen(false);
            onDuplicate();
          }}
        />
      )}
    </div>
  );
}
