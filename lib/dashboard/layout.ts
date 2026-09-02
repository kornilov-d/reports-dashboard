import type { DashboardWidget, WidgetSize } from "./types";
import { sizeSpan } from "./types";

export const GRID_COLS = 4;
/** The base grid is 4×4; it grows in rows when widgets don't fit. */
export const GRID_MIN_ROWS = 4;

export type PlacedWidget = {
  widget: DashboardWidget;
  /** 0-indexed grid position. */
  col: number;
  row: number;
  /** Span in cells, already clamped to the current column count. */
  w: number;
  h: number;
};

export type PackedLayout = {
  placed: PlacedWidget[];
  rows: number;
  /** Free cells inside the packed bounds, in reading order. */
  holes: Array<{ row: number; col: number }>;
};

/** Widths never exceed the available columns, so a 2x2 becomes 1x2 at 1 column. */
export function clampSpan(size: WidgetSize, cols: number) {
  const { w, h } = sizeSpan(size);
  return { w: Math.min(w, cols), h };
}

/**
 * First-fit packer: walks the grid in reading order and drops each widget into
 * the first position where it fits, growing the grid by rows when needed. Order
 * of `widgets` is the authoritative order, so a drag-reorder is just a splice.
 */
export function packLayout(
  widgets: DashboardWidget[],
  cols: number = GRID_COLS,
  minRows: number = GRID_MIN_ROWS,
): PackedLayout {
  const grid: boolean[][] = [];
  const ensureRow = (r: number) => {
    while (grid.length <= r) grid.push(new Array(cols).fill(false));
  };

  const fits = (row: number, col: number, w: number, h: number) => {
    if (col + w > cols) return false;
    ensureRow(row + h - 1);
    for (let r = row; r < row + h; r++) {
      for (let c = col; c < col + w; c++) {
        if (grid[r][c]) return false;
      }
    }
    return true;
  };

  const occupy = (row: number, col: number, w: number, h: number) => {
    ensureRow(row + h - 1);
    for (let r = row; r < row + h; r++) {
      for (let c = col; c < col + w; c++) grid[r][c] = true;
    }
  };

  const placed: PlacedWidget[] = [];

  for (const widget of widgets) {
    const { w, h } = clampSpan(widget.size, cols);
    let row = 0;
    let done = false;
    while (!done) {
      ensureRow(row);
      for (let col = 0; col <= cols - w; col++) {
        if (fits(row, col, w, h)) {
          occupy(row, col, w, h);
          placed.push({ widget, col, row, w, h });
          done = true;
          break;
        }
      }
      if (!done) row += 1;
    }
  }

  const rows = Math.max(minRows, grid.length);
  ensureRow(rows - 1);

  const holes: Array<{ row: number; col: number }> = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (!grid[r][c]) holes.push({ row: r, col: c });
    }
  }

  return { placed, rows, holes };
}

/** Move the widget at `from` so it lands at index `to`, preserving the rest. */
export function reorder<T>(items: T[], from: number, to: number): T[] {
  if (from === to || from < 0 || from >= items.length) return items;
  const next = items.slice();
  const [moved] = next.splice(from, 1);
  next.splice(Math.max(0, Math.min(next.length, to)), 0, moved);
  return next;
}
