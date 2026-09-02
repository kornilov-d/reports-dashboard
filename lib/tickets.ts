export type TicketRow = {
  id: string;
  name: string;
  /** Display value in the price cell. */
  price: string;
  /** Display value in the capacity cell. */
  capacity?: string;
  /** Shows column: "All" or array of date-time chips, optional overflow count. */
  shows?: { all?: boolean; chips?: string[]; more?: number };
  /** Indent + lighter weight for tier rows under a parent. */
  isChild?: boolean;
  /** Render with an expandable arrow + child count. */
  isParent?: boolean;
  childCount?: number;
};

export const TICKETS: TicketRow[] = [
  {
    id: "general",
    name: "General Admission",
    price: "345 AED",
    capacity: "500",
    shows: { all: true },
  },
  { id: "vip", name: "VIP", price: "3 prices", isParent: true, childCount: 3 },
  {
    id: "vip-early",
    name: "Early Bird",
    price: "650 AED",
    capacity: "500",
    shows: { chips: ["Fri 11 Sep 2026, 19:30"] },
    isChild: true,
  },
  {
    id: "vip-general",
    name: "General Sale",
    price: "750 AED",
    capacity: "500",
    shows: { chips: ["Fri 11 Sep 2026, 19:30"] },
    isChild: true,
  },
  {
    id: "vip-door",
    name: "Door",
    price: "1000 AED",
    capacity: "Custom per show",
    shows: { chips: ["Fri 11 Sep 2026, 19:30"], more: 3 },
    isChild: true,
  },
  {
    id: "silver",
    name: "Silver",
    price: "4 prices",
    capacity: "Custom per price",
    shows: {
      chips: ["Fri 11 Sep 2026, 19:30", "Sun 13 Sep 2026, 19:30"],
      more: 4,
    },
    isParent: true,
    childCount: 4,
  },
  {
    id: "gold",
    name: "Gold",
    price: "345 AED",
    capacity: "Custom per show",
    shows: { chips: ["Fri 11 Sep 2026, 19:30"] },
  },
  {
    id: "platinum",
    name: "Platinum",
    price: "345 AED",
    capacity: "500",
    shows: { chips: ["Fri 11 Sep 2026, 19:30"] },
  },
];
