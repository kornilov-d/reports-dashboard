import { isoDate } from "@/lib/date";

export type ShowSlot = {
  start: string;
  end: string;
};

export type DayCell = {
  date: number;
  /** false for days outside the visible month. */
  inMonth: boolean;
  shows: ShowSlot[];
};

export type Show = {
  id: string;
  name: string;
  /** ISO date "YYYY-MM-DD" — the day this show appears on the grid. */
  date: string;
  start: string;
  end: string;
};

const WEEKDAY: ShowSlot[] = [
  { start: "10:00", end: "12:00" },
  { start: "13:00", end: "15:00" },
];

const FRIDAY: ShowSlot[] = [
  { start: "10:00", end: "12:00" },
  { start: "13:00", end: "15:00" },
  { start: "19:30", end: "22:00" },
];

const WEEKEND: ShowSlot[] = [
  { start: "10:00", end: "12:00" },
  { start: "13:00", end: "15:00" },
  { start: "19:30", end: "22:00" },
];

/** Seeded shows for "March 2026" — appears as initial state on the calendar. */
export function buildMarch2026(): DayCell[] {
  // March 1, 2026 = Sunday. Calendar grid starts Monday.
  const cells: DayCell[] = [];
  for (let d = 23; d <= 28; d++) cells.push({ date: d, inMonth: false, shows: [] });

  for (let d = 1; d <= 31; d++) {
    const cellIndex = cells.length;
    const weekday = cellIndex % 7;
    let shows: ShowSlot[];
    if (weekday === 4) shows = FRIDAY;
    else if (weekday === 5 || weekday === 6) shows = WEEKEND;
    else shows = WEEKDAY;
    cells.push({ date: d, inMonth: true, shows });
  }

  let next = 1;
  while (cells.length % 7 !== 0 || cells.length < 35) {
    cells.push({ date: next++, inMonth: false, shows: [] });
  }
  return cells;
}

export function dayCellsForMonth(
  year: number,
  month: number,
  userShows: Show[],
  baseline?: DayCell[],
): DayCell[] {
  const base = baseline ?? emptyMonthGrid(year, month);
  if (userShows.length === 0) return base;

  return base.map((cell) => {
    if (!cell.inMonth) return cell;
    const iso = isoDate(new Date(year, month, cell.date));
    const extras = userShows
      .filter((s) => s.date === iso)
      .map((s) => ({ start: s.start, end: s.end }));
    if (extras.length === 0) return cell;
    return { ...cell, shows: [...cell.shows, ...extras] };
  });
}

function emptyMonthGrid(year: number, month: number): DayCell[] {
  const cells: DayCell[] = [];
  const firstDow = new Date(year, month, 1).getDay();
  const lead = (firstDow + 6) % 7;
  const prevDays = new Date(year, month, 0).getDate();
  for (let i = 0; i < lead; i++) {
    cells.push({ date: prevDays - lead + 1 + i, inMonth: false, shows: [] });
  }
  const count = new Date(year, month + 1, 0).getDate();
  for (let d = 1; d <= count; d++) cells.push({ date: d, inMonth: true, shows: [] });
  let next = 1;
  while (cells.length % 7 !== 0 || cells.length < 35) {
    cells.push({ date: next++, inMonth: false, shows: [] });
  }
  return cells;
}

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
