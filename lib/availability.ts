import type { DaySlots } from "@/components/ui/AvailabilityGrid";

/** Seeded sample shows used by the price/shows/capacity popups. */
export function sampleAvailability(): DaySlots[] {
  return [
    {
      label: "Fri 10 Apr 2026",
      times: ["12:00", "14:00", "16:00", "18:00"],
      selected: new Set([1, 3]),
    },
    {
      label: "Fri 11 Apr 2026",
      times: ["12:00", "14:00", "16:00", "18:00", "20:00", "21:00"],
      selected: new Set([0, 2]),
    },
    {
      label: "Fri 13 Apr 2026",
      times: ["14:00", "16:00", "18:00"],
      selected: new Set([1, 2]),
    },
    {
      label: "Fri 14 Apr 2026",
      times: ["12:00", "14:00", "16:00", "18:00"],
      selected: new Set([1, 2, 3]),
    },
  ];
}

export function sampleCapacityRows(): { label: string; value: string }[] {
  return [
    { label: "14:00 Fri 10 Apr 2026", value: "100" },
    { label: "18:00 Fri 10 Apr 2026", value: "75" },
    { label: "14:00 Fri 13 Apr 2026", value: "100" },
    { label: "18:00 Fri 13 Apr 2026", value: "80" },
    { label: "14:00 Sat 14 Apr 2026", value: "95" },
    { label: "18:00 Sat 14 Apr 2026", value: "85" },
    { label: "14:00 Sun 15 Apr 2026", value: "90" },
    { label: "18:00 Sun 15 Apr 2026", value: "70" },
  ];
}
