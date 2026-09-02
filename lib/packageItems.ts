export type PackageItemType = "ticket" | "voucher" | "upsell";

export type PackageOption = {
  id: string;
  type: PackageItemType;
  label: string;
  /** Per-unit price in AED. */
  unitPrice: number;
};

export const ITEM_TONES: Record<PackageItemType, { label: string; chip: string }> = {
  ticket: { label: "Ticket", chip: "text-[var(--color-platinum-haze)]" },
  voucher: { label: "Voucher", chip: "text-[#c47b00]" },
  upsell: { label: "Upsell", chip: "text-[#1f8a4c]" },
};

export const SAMPLE_OPTIONS: PackageOption[] = [
  // Tickets
  { id: "tk-gold-eb-1", type: "ticket", label: "Gold – Early bird", unitPrice: 900 },
  { id: "tk-gold-eb-2", type: "ticket", label: "Gold – Early bird", unitPrice: 900 },
  { id: "tk-gold-eb-3", type: "ticket", label: "Gold – Early bird", unitPrice: 900 },
  { id: "tk-vip-left", type: "ticket", label: "VIP → Vip Left", unitPrice: 1200 },
  { id: "tk-vip-right", type: "ticket", label: "VIP → Vip Right", unitPrice: 1200 },
  // Vouchers
  { id: "vc-parking", type: "voucher", label: "Parking", unitPrice: 50 },
  { id: "vc-meal", type: "voucher", label: "Meal voucher", unitPrice: 75 },
  { id: "vc-drink", type: "voucher", label: "Drink", unitPrice: 25 },
  { id: "vc-complimentary", type: "voucher", label: "Complimentary drinks", unitPrice: 25 },
  // Upsells
  { id: "up-meet-greet", type: "upsell", label: "Meet & Greet", unitPrice: 150 },
  { id: "up-tshirt-charcoal", type: "upsell", label: "T-shirt “Copacabana Charcoal”", unitPrice: 120 },
  { id: "up-tshirt-blue", type: "upsell", label: "T-shirt “Copacabana Blue”", unitPrice: 120 },
  { id: "up-tshirt-enface", type: "upsell", label: "T-shirt “En face”", unitPrice: 140 },
];

export const SHOW_OPTIONS = [
  "19:30 Fri 11 Sep 2026",
  "19:30 Sat 12 Sep 2026",
  "19:30 Sun 13 Sep 2026",
  "19:30 Mon 14 Sep 2026",
  "19:30 Tue 15 Sep 2026",
];
