"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import AddWidgetModal from "./AddWidgetModal";
import FilterBar from "./FilterBar";
import UndoToast from "./UndoToast";
import WidgetGrid from "./WidgetGrid";
import { Check, Grid, Refresh } from "@/components/icons";
import { createWidget, newWidgetId } from "@/lib/dashboard/catalog";
import {
  DEFAULT_FILTERS,
  defaultWidgets,
  loadState,
  saveState,
} from "@/lib/dashboard/defaults";
import type {
  DashboardWidget,
  Filters,
  WidgetSize,
  WidgetType,
} from "@/lib/dashboard/types";

type Toast = { message: string; snapshot: DashboardWidget[] };

export default function DashboardClient() {
  const [widgets, setWidgets] = useState<DashboardWidget[]>(defaultWidgets);
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [editMode, setEditMode] = useState(false);
  const [adding, setAdding] = useState(false);
  const [toast, setToast] = useState<Toast | null>(null);
  const [hydrated, setHydrated] = useState(false);
  const [simulateErrors, setSimulateErrors] = useState(false);
  const dragSnapshot = useRef<DashboardWidget[] | null>(null);

  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setWidgets(saved.widgets);
      setFilters(saved.filters);
    }
    setSimulateErrors(
      new URLSearchParams(window.location.search).get("simulateErrors") === "1",
    );
    setHydrated(true);
  }, []);

  // Optimistic auto-save; the undo toast is the escape hatch.
  useEffect(() => {
    if (!hydrated) return;
    saveState({ widgets, filters });
  }, [widgets, filters, hydrated]);

  const changeWidget = useCallback(
    (next: DashboardWidget) => {
      setWidgets((current) => {
        const previous = current.find((w) => w.id === next.id);
        if (previous) {
          setToast({
            message:
              previous.size !== next.size ? "Widget resized" : "Widget updated",
            snapshot: current,
          });
        }
        return current.map((w) => (w.id === next.id ? next : w));
      });
    },
    [],
  );

  const removeWidget = useCallback((id: string) => {
    setWidgets((current) => {
      setToast({ message: "Widget removed", snapshot: current });
      return current.filter((w) => w.id !== id);
    });
  }, []);

  const duplicateWidget = useCallback((id: string) => {
    setWidgets((current) => {
      const index = current.findIndex((w) => w.id === id);
      if (index < 0) return current;
      setToast({ message: "Widget duplicated", snapshot: current });
      const copy = { ...structuredClone(current[index]), id: newWidgetId(current[index].type) };
      const next = current.slice();
      next.splice(index + 1, 0, copy);
      return next;
    });
  }, []);

  const addWidget = useCallback((type: WidgetType, size: WidgetSize) => {
    setWidgets((current) => {
      setToast({ message: "Widget added", snapshot: current });
      return [...current, createWidget(type, size)];
    });
    setAdding(false);
  }, []);

  const handleReorder = useCallback((next: DashboardWidget[]) => {
    setWidgets(next);
    if (dragSnapshot.current) {
      setToast({ message: "Layout updated", snapshot: dragSnapshot.current });
    }
  }, []);

  const resetToDefault = useCallback(() => {
    setWidgets((current) => {
      setToast({ message: "Dashboard reset to the default layout", snapshot: current });
      return defaultWidgets();
    });
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-[15px] font-semibold leading-tight tracking-tight">
            Home dashboard
          </h2>
          <p className="mt-1 text-[13px] text-[var(--color-mute)]">
            {editMode
              ? "Drag widgets to reorder, or use ⋯ on a widget to edit it."
              : "An at-a-glance view of how your events are performing."}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {editMode && (
            <button
              type="button"
              onClick={resetToDefault}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-[var(--color-line)] bg-white px-3.5 text-[13.5px] font-medium text-[var(--color-mute)] transition-colors hover:text-[var(--color-ink)]"
            >
              <Refresh size={16} />
              Reset to default
            </button>
          )}
          <button
            type="button"
            aria-pressed={editMode}
            onClick={() => setEditMode((v) => !v)}
            className={[
              "inline-flex h-10 items-center gap-2 rounded-lg px-3.5 text-[13.5px] font-medium transition-colors",
              editMode
                ? "bg-[var(--color-ink)] text-white hover:bg-[var(--color-ink-2)]"
                : "border border-[var(--color-line)] bg-white text-[var(--color-ink)] hover:bg-[var(--color-line-2)]",
            ].join(" ")}
          >
            {editMode ? <Check size={16} /> : <Grid size={16} />}
            {editMode ? "Done editing" : "Edit dashboard"}
          </button>
        </div>
      </div>

      <FilterBar filters={filters} onChange={setFilters} />

      <WidgetGrid
        widgets={widgets}
        filters={filters}
        editMode={editMode}
        simulateErrors={simulateErrors}
        onChangeWidget={changeWidget}
        onRemoveWidget={removeWidget}
        onDuplicateWidget={duplicateWidget}
        onReorder={handleReorder}
        onDragBegin={() => {
          dragSnapshot.current = widgets;
        }}
        onAdd={() => setAdding(true)}
      />

      <AddWidgetModal
        open={adding}
        onClose={() => setAdding(false)}
        onAdd={addWidget}
      />

      {toast && (
        <UndoToast
          message={toast.message}
          onUndo={() => {
            setWidgets(toast.snapshot);
            setToast(null);
          }}
          onDismiss={() => setToast(null)}
        />
      )}
    </div>
  );
}
