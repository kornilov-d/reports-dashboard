export const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

/** Days in `month` (0-indexed) of `year`. */
export function daysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

/** Weekday index where Monday=0 ... Sunday=6 for the 1st of the given month. */
export function firstWeekdayMon0(year: number, month: number) {
  const dow = new Date(year, month, 1).getDay(); // Sun=0..Sat=6
  return (dow + 6) % 7;
}

export type DayCell = { date: number; inMonth: boolean; weekday: number };

/** Build a 6×7 grid for the given month, padded with prev/next month days. */
export function monthGrid(year: number, month: number): DayCell[] {
  const cells: DayCell[] = [];
  const lead = firstWeekdayMon0(year, month);
  const prevDays = daysInMonth(year, month - 1);
  for (let i = 0; i < lead; i++) {
    cells.push({
      date: prevDays - lead + 1 + i,
      inMonth: false,
      weekday: i,
    });
  }
  const count = daysInMonth(year, month);
  for (let d = 1; d <= count; d++) {
    cells.push({
      date: d,
      inMonth: true,
      weekday: cells.length % 7,
    });
  }
  let next = 1;
  while (cells.length % 7 !== 0 || cells.length < 35) {
    cells.push({
      date: next++,
      inMonth: false,
      weekday: cells.length % 7,
    });
  }
  return cells;
}

/** Format Date → "YYYY-MM-DD" (local). */
export function isoDate(d: Date) {
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
}

/** Format Date → "Mon, 11 Mar 2026". */
export function formatLongDate(d: Date) {
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.getDay()];
  const month = MONTH_NAMES[d.getMonth()].slice(0, 3);
  return `${weekday}, ${d.getDate()} ${month} ${d.getFullYear()}`;
}
