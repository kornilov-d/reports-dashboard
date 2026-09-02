"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string; dot?: boolean };

const tabs: Tab[] = [
  { href: "/inventory/calendar", label: "Calendar" },
  { href: "/inventory/tickets", label: "Tickets" },
  { href: "/inventory/seat-map", label: "Seat Map" },
  { href: "/inventory/add-ons", label: "Add-ons", dot: true },
  { href: "/inventory/season-tickets", label: "Season Tickets", dot: true },
  { href: "/inventory/packages", label: "Packages", dot: true },
  { href: "/inventory/integration", label: "Integration" },
  { href: "/inventory/permissions", label: "Permissions" },
  { href: "/inventory/page-manager", label: "Page Manager" },
  { href: "/inventory/settings", label: "Settings" },
  { href: "/inventory/scanning", label: "Scanning" },
];

export default function InventoryTabs() {
  const pathname = usePathname();

  return (
    <nav className="-mb-px flex items-center gap-8 overflow-x-auto no-scrollbar">
      {tabs.map((t) => {
        const active = pathname === t.href || pathname.startsWith(t.href + "/");
        return (
          <Link
            key={t.href}
            href={t.href}
            className={[
              "relative whitespace-nowrap pb-3 text-[14px] transition-colors",
              active
                ? "font-semibold text-[var(--color-ink)]"
                : "font-medium text-[var(--color-mute)] hover:text-[var(--color-ink)]",
            ].join(" ")}
          >
            {t.label}
            {t.dot && (
              <span className="ml-1.5 inline-block h-1.5 w-1.5 rounded-full bg-[#f08800] align-middle" />
            )}
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--color-ink)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
