export type ShowCode = { time: string; code: string };

export const DTCM_SHOWS: ShowCode[] = [
  { time: "19:30 26 Jun 2026", code: "DTCM26JUN1930XYZ" },
  { time: "19:30 27 Jun 2026", code: "DTCM26JUN1930XYZ" },
  { time: "19:30 28 Jun 2026", code: "DTCM28JUN1930ABC" },
  { time: "20:00 29 Jun 2026", code: "SGALA29JUN2000DEF" },
  { time: "18:00 30 Jun 2026", code: "MAT30JUN1800GHI" },
  { time: "19:45 1 Jul 2026", code: "EVEN01JUL1945JKL" },
  { time: "21:00 2 Jul 2026", code: "LATE02JUL2100MNO" },
  { time: "17:30 3 Jul 2026", code: "PREV03JUL1730PQR" },
  { time: "20:15 4 Jul 2026", code: "EXCL04JUL2015STU" },
];

export type PriceMapping = {
  name: string;
  price: string;
  entity: string;
  override: string;
};

export const DTCM_PRICES: PriceMapping[] = [
  { name: "Gold – Early bird", price: "900 AED", entity: "t | gold | early bird", override: "" },
  { name: "Gold – General sale", price: "900 AED", entity: "t | gold | general sale", override: "" },
  { name: "Platinum – Early bird", price: "1200 AED", entity: "t | platinum | early bird", override: "t | platinum | early bird" },
  { name: "Platinum – General sale", price: "1300 AED", entity: "t | platinum | general sale", override: "t | platinum | general sale" },
  { name: "Silver – Early bird", price: "600 AED", entity: "t | silver | early bird", override: "" },
];

export const EXTERNAL_ENTITY_OPTIONS = [
  "t | gold | early bird",
  "t | gold | general sale",
  "t | platinum | early bird",
  "t | platinum | general sale",
  "t | silver | early bird",
  "t | silver | general sale",
];

export const DTCM_SELECTED_SHOW = "19:30 Fri 11 Sep 2026";
