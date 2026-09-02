"use client";

import { useMemo, useState } from "react";
import { Plus } from "@/components/icons";
import { useSize } from "./charts/useSize";
import WidgetCard from "./WidgetCard";
import { GRID_COLS, packLayout, reorder } from "@/lib/dashboard/layout";
import type { DashboardWidget, Filters } from "@/lib/dashboard/types";

const ROW_HEIGHT = 168;
const GAP = 16;

/**
 * 4 columns when there is room, 2 on tablet widths, 1 on phones. Measured from
 * the grid container rather than the window so the sidebar is accounted for.
 */
function columnsFor(width: number) {
  if (!width) return GRID_COLS;
  if (width >= 1000) return 4;
  if (width >= 620) return 2;
  return 1;
}

export default function WidgetGrid({
  widgets,
  filters,
  editMode,
  simulateErrors,
  onChangeWidget,
  onRemoveWidget,
  onDuplicateWidget,
  onReorder,
  onDragBegin,
  onAdd,
}: {
  widgets: DashboardWidget[];
  filters: Filters;
  editMode: boolean;
  simulateErrors: boolean;
  onChangeWidget: (next: DashboardWidget) => void;
  onRemoveWidget: (id: string) => void;
  onDuplicateWidget: (id: string) => void;
  onReorder: (next: DashboardWidget[]) => void;
  onDragBegin: () => void;
  onAdd: () => void;
}) {
  const { ref, size } = useSize<HTMLDivElement>();
  const cols = columnsFor(size.width);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const { placed, rows, holes } = useMemo(
    () => packLayout(widgets, cols, cols === GRID_COLS ? 4 : 0),
    [widgets, cols],
  );

  const addSlot = holes[0];
  const showTrailingAdd = editMode && !addSlot;

  function moveTo(targetId: string) {
    if (!draggingId || draggingId === targetId) return;
    const from = widgets.findIndex((w) => w.id === draggingId);
    const to = widgets.findIndex((w) => w.id === targetId);
    if (from < 0 || to < 0) return;
    onReorder(reorder(widgets, from, to));
  }

  function moveToEnd() {
    if (!draggingId) return;
    const from = widgets.findIndex((w) => w.id === draggingId);
    if (from < 0 || from === widgets.length - 1) return;
    onReorder(reorder(widgets, from, widgets.length - 1));
  }

  return (
    <div
      ref={ref}
      className="grid"
      style={{
        gridTemplateColumns: `repeat(${cols}, minmax(0, 1fr))`,
        gridAutoRows: `${ROW_HEIGHT}px`,
        gap: GAP,
      }}
    >
      {placed.map(({ widget, col, row, w, h }) => (
        <div
          key={widget.id}
          style={{
            gridColumn: `${col + 1} / span ${w}`,
            gridRow: `${row + 1} / span ${h}`,
          }}
        >
          <WidgetCard
            widget={widget}
            filters={filters}
            editMode={editMode}
            simulateErrors={simulateErrors}
            dragging={draggingId === widget.id}
            onChange={onChangeWidget}
            onRemove={() => onRemoveWidget(widget.id)}
            onDuplicate={() => onDuplicateWidget(widget.id)}
            onDragStart={() => {
              onDragBegin();
              setDraggingId(widget.id);
            }}
            onDragEnd={() => setDraggingId(null)}
            onDragOverCard={() => moveTo(widget.id)}
          />
        </div>
      ))}

      {editMode &&
        holes.map((hole, i) => {
          const isAddSlot = i === 0;
          return (
            <div
              key={`hole-${hole.row}-${hole.col}`}
              style={{
                gridColumn: `${hole.col + 1} / span 1`,
                gridRow: `${hole.row + 1} / span 1`,
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={moveToEnd}
            >
              {isAddSlot ? (
                <button
                  type="button"
                  onClick={onAdd}
                  className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-line)] text-[var(--color-mute)] transition-colors hover:border-[var(--color-platinum-haze)] hover:bg-[var(--color-tint-purple)] hover:text-[var(--color-platinum-haze)]"
                >
                  <Plus size={18} />
                  <span className="text-[12.5px] font-medium">Add widget</span>
                </button>
              ) : (
                <div className="h-full w-full rounded-xl border border-dashed border-[var(--color-line-2)]" />
              )}
            </div>
          );
        })}

      {showTrailingAdd && (
        <div
          style={{ gridColumn: "span 1", gridRow: `${rows + 1} / span 1` }}
          onDragOver={(e) => e.preventDefault()}
          onDrop={moveToEnd}
        >
          <button
            type="button"
            onClick={onAdd}
            className="flex h-full w-full flex-col items-center justify-center gap-1.5 rounded-xl border border-dashed border-[var(--color-line)] text-[var(--color-mute)] transition-colors hover:border-[var(--color-platinum-haze)] hover:bg-[var(--color-tint-purple)] hover:text-[var(--color-platinum-haze)]"
          >
            <Plus size={18} />
            <span className="text-[12.5px] font-medium">Add widget</span>
          </button>
        </div>
      )}
    </div>
  );
}
