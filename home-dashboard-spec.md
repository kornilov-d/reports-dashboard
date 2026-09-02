# Feature Spec: Home Dashboard for Event Reports

## 1. Summary
A configurable home dashboard that gives organisers an at-a-glance view of event
performance. The dashboard is built from a grid of resizable, swappable widgets
(revenue, attendance, channels, resale, ticket-type popularity, etc.), starts
from a pre-made template for demo purposes, and supports inline editing directly
on the grid (hover → options button → edit popup).

## 2. Goals
- Give organisers a single landing page summarising the health of an event (or
  all events) without digging into individual report tabs (Sales, Traffic,
  Channels, Occupancy, Revenue, Attendance, etc.).
- Let users personalise the view: add, remove, resize, reorder, and reconfigure
  widgets without leaving the page ("inline editing").
- Ship with a sensible default layout so the feature is useful on day one
  (no empty-state / cold-start problem).
- Reuse existing report data sources (see `Reports` tabs in the current app)
  rather than introducing new backend concepts.

## 3. Non-Goals
- Building a fully generic BI/dashboard-builder (arbitrary widget count, free
  drag-anywhere canvas, custom formulas). We constrain to a fixed grid and a
  fixed widget size vocabulary to keep v1 scope tight.
- Cross-event comparison dashboards (this spec is single "event" / "all shows"
  scoped, see filters below).
- Sharing/exporting the dashboard itself (widget-level export may reuse the
  existing `Export` action from Reports, but is out of scope to design here).

## 4. Layout System

### 4.1 Grid
- Base grid: **4 columns × 4 rows** (16 cells) at initial/default viewport.
- Grid is responsive: on narrower breakpoints, columns collapse (e.g. 4 → 2 →
  1) and widgets reflow, preserving relative order and size ratio.
- Empty cells render as a subtle dashed placeholder in edit mode, and are
  simply omitted in view mode.

### 4.2 Widget sizes
Only three sizes are supported in v1, expressed in grid cells (columns ×
rows):

| Size | Cells | Typical use |
|------|-------|-------------|
| `1x1` | 1 col × 1 row | Single KPI number (e.g. Total Revenue) |
| `1x2` | 1 col × 2 rows | Tall single-metric card, or a compact list |
| `2x2` | 2 col × 2 rows | Charts / graphs / trend lines, tables |

Widgets cannot span 3+ columns/rows in v1. A `2x1` (wide, short) is
intentionally excluded from v1 to limit the config surface, but the widget
size model should be built so it's a trivial addition later.

### 4.3 Placement rules
- Widgets occupy contiguous cells; the layout engine auto-packs remaining
  widgets when one is resized or removed (similar to a masonry/bento packer).
- Manual reordering via drag handle (visible in edit mode) is supported;
  auto-pack still applies after a drop.
- If a resize would overflow the 4×4 bound, the grid grows by one row rather
  than blocking the action (grid is 4 columns wide, N rows tall).

## 5. Widget Catalog (v1)

Each widget has: a **type**, a **size** (constrained per type, see below), a
**content config** (what data/metric/breakdown it shows), and an **appearance
config** (chart style, color, label visibility, etc.).

| Widget | Default size | Allowed sizes | Chart type | Notes |
|---|---|---|---|---|
| **Total Revenue** | `1x1` | `1x1`, `1x2` | Single stat | Value shown in **AED**, currency fixed for now; optional delta vs. previous period as sub-label. |
| **Attendance Report** | `2x2` | `1x2`, `2x2` | Line/area graph | Mirrors the existing "Attendance" chart (Valued vs. Complimentary over time); tooltip per hour/day depending on breakdown. |
| **Channels** | `2x2` | `1x1`, `1x2`, `2x2` | Bar or donut | Distribution of sales/attendance by channel (e.g. web, box office, resellers); `1x1` collapses to a single "top channel" stat. |
| **Resale Income** | `2x2` | `1x2`, `2x2` | Line/bar graph | Revenue generated via resale/secondary market over time, same currency/period rules as Total Revenue. |
| **Popularity (Ticket Types)** | `1x2` or `2x2` | `1x1`, `1x2`, `2x2` | Horizontal bar / ranked list | Number of tickets distributed per ticket type (General Admission, Gold, Platinum, VIP Access, etc.), ranked descending. |

Widget type is fixed once placed, but its size and its content/appearance
config are editable (see §6). Adding a **new** widget from the "+" tray lets
the user pick type first, then size and config.

### 5.1 Data sources
Each widget maps to an existing report endpoint/breakdown so no new
aggregation logic is required for v1:
- Total Revenue → `Revenue` report, summed for the selected period/show.
- Attendance Report → `Attendance` report ("By hours"/"By day" breakdown,
  Valued/Complimentary series), same as the attached reference screenshot.
- Channels → `Channels` report.
- Resale Income → subset of `Revenue`/`Channels` filtered to resale channel(s).
- Popularity → `Attendance`/`Ticket editor` sold/scanned counts grouped by
  ticket type.

## 6. Inline Editing UX

### 6.1 Discoverability
- In **view mode**, widgets render clean, with no chrome.
- On **hover**, a small **options (⋯) button** fades in at the top-right
  corner of the widget.
- Clicking the options button opens an **edit popover/modal** anchored to the
  widget.

### 6.2 Edit popover contents
Sections shown only where applicable to the widget type:

1. **Size** — visual picker showing the 3 allowed sizes (grayed out if not
   valid for this widget type); selecting one live-resizes the widget and
   triggers grid re-pack.
2. **Content** — what the widget displays:
   - Metric/report source (locked to widget type, but sub-options like
     breakdown: hourly/daily, channel filter, ticket-type filter apply here).
   - For graphs: which series to show (e.g. toggle Valued/Complimentary,
     toggle specific channels).
3. **Appearance** — where applicable:
   - Chart style (line vs. bar vs. donut, if multiple are supported for that
     widget).
   - Color / accent.
   - Show/hide legend, show/hide value labels, compact vs. expanded numbers.
4. Footer actions: **Remove widget**, **Duplicate**, **Done**.

### 6.3 Grid-level edit actions
- An **"Edit dashboard"** toggle (top of page) puts the whole grid into edit
  mode: shows drag handles, empty-cell placeholders, and a **"+ Add widget"**
  tile at the next open slot.
- **"Reset to default"** restores the pre-made demo layout (§7).
- Changes save automatically (optimistic) with an undo toast, matching the
  interaction pattern used for inline edits.

## 7. Default / Demo Dashboard
For first-run and demo purposes, ship a pre-made layout so the page is never
empty:

```
Row 1:  [ Total Revenue 1x1 ] [ Attendance Report ......... 2x2 ] [ Popularity 1x2 ]
Row 2:  [ Channels      1x1 ] [        (cont.)            ] [   (cont.)   ]
Row 3:  [ Resale Income ......... 2x2 ] [ (empty / + add) ] [ (empty / + add) ]
Row 4:  [        (cont.)          ] [                  ] [                  ]
```
(Exact packing resolved by the auto-pack algorithm in §4.3; the above is the
intended visual grouping — a top row of KPIs/quick charts, a lower row for
deeper trend charts.)

This default layout is fully editable — it's a starting point, not a locked
template.

## 8. Top-Level Filters
A filter bar above the grid applies to **every widget** on the dashboard
(individual widgets can still narrow further via their own content config,
e.g. a specific channel, but they always respect the top-level scope):

1. **Time period** — presets (Today, Last 7 days, Last 30 days, This month,
   Custom range) plus explicit start/end date-time, consistent with existing
   report date pickers.
2. **Show** — a select supporting two modes:
   - **All shows** — aggregates data across every show/event under the
     account.
   - **Specific show** — a single show/event (e.g. "19:00 / Wed / 14 March
     2025"), matching the show selector already used in Reports.

Changing either filter re-fetches data for all widgets in place (skeleton/
loading state per widget, not a full-page reload).

## 9. States
- **Loading**: per-widget skeleton (shimmer) so fast-loading widgets aren't
  blocked by slow ones.
- **Empty data**: widget shows a muted "No data for this period" message
  instead of a blank chart.
- **Error**: widget shows an inline retry affordance; failure of one widget
  must not block others.
- **Edit mode vs. view mode**: only one user-facing toggle; all hover/options
  affordances are inert outside edit mode except the per-widget hover options
  button, which is always available (so casual tweaks don't require entering
  a special mode) — grid-level actions (drag, add, reset) require "Edit
  dashboard" mode.

## 10. Open Questions
- Should dashboards be **per-user** or **per-account** (shared)? Affects
  whether "Reset to default" resets everyone's view.
- Multi-currency: Total Revenue is AED-only in v1 — do we need a currency
  switcher, or is the account single-currency?
- Should widgets support a **comparison mode** (this period vs. previous
  period) at launch, or is that a v2 addition on top of the delta sub-label
  mentioned in §5?
- Row limit: grid currently grows unbounded vertically when widgets are
  added — do we want a max row count with pagination/scroll instead?
