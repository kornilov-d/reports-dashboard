# Reports Dashboard

A configurable home dashboard for event organisers, forked from `organiser-panel`
and built to the spec in `home-dashboard-spec.md`. The dashboard lives at
[`/reports`](http://localhost:3000/reports) and is the app's landing page.

```bash
npm run dev
```

## What's here

- **Bento grid** — 4 columns × N rows, first-fit auto-packing, three widget
  sizes (`1x1`, `1x2`, `2x2`). Resizing or removing a widget re-packs the grid;
  the grid grows a row rather than refusing a resize.
- **Widgets** — Total Revenue, Attendance Report, Channels, Resale Income and
  Popularity (ticket types), each with its own content and appearance config.
- **Inline editing** — hover a widget → ⋯ → an anchored popover with Size,
  Content, Appearance sections and Remove / Duplicate / Done actions. Available
  in view mode too, so casual tweaks don't need edit mode.
- **Edit dashboard mode** — drag handles, dashed empty-cell placeholders, an
  "+ Add widget" tile in the next open slot, and "Reset to default".
- **Top-level filters** — period presets plus a custom start/end range, and an
  "All shows"/single-show selector. Both re-fetch every widget in place.
- **Per-widget states** — skeleton while loading, "No data for this period",
  and an inline retry that never blocks neighbouring widgets.
- **Auto-save with undo** — every structural change persists immediately and
  raises an undo toast.

## Layout

```
app/(panel)/reports/         Reports route: dashboard + placeholder report tabs
components/reports/          Dashboard shell, grid, cards, edit popover, filters
components/reports/widgets/  One renderer per widget type
components/reports/charts/   Hand-rolled SVG chart primitives (no chart library)
lib/dashboard/               Types, widget catalog, packing engine, mock data
```

Widget behaviour is data-driven from `lib/dashboard/catalog.ts`: each type
declares its default and allowed sizes, chart styles, and which content and
appearance controls the edit popover renders. Adding a size (`2x1`, say) means
extending the `WidgetSize` union and listing it in `allowedSizes` — the packer,
the size picker and the glyphs all derive their behaviour from the token.

## Data

Reports data is mocked in `lib/dashboard/data.ts` with a seeded PRNG, so the
same filters always produce the same numbers. Each widget maps to the report
source named in its catalog entry (Revenue, Attendance, Channels), and a
specific show only returns data while the selected period overlaps its 120-day
on-sale window — that's what drives the empty state.

Loads are simulated with a per-widget delay. Append `?simulateErrors=1` to the
dashboard URL to make every widget fail its first load; each Retry then
succeeds, which is how the error affordance is exercised.

Dashboard layouts persist to `localStorage` under `reports.dashboard.v1`
(per-browser, matching the "per-user vs. per-account" open question in the
spec).

## Known gaps vs. the spec

- Open questions in §10 are unresolved by design: layouts are per-user,
  currency is AED-only, there's no comparison mode beyond the delta sub-label,
  and rows grow unbounded.
- Widget-level export is not implemented (explicitly out of scope in §3).
