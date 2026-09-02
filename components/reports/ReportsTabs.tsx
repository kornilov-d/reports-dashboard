"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

type Tab = { href: string; label: string };

const tabs: Tab[] = [
  { href: "/reports", label: "Dashboard" },
  { href: "/reports/sales", label: "Sales" },
  { href: "/reports/traffic", label: "Traffic" },
  { href: "/reports/channels", label: "Channels" },
  { href: "/reports/occupancy", label: "Occupancy" },
  { href: "/reports/revenue", label: "Revenue" },
  { href: "/reports/attendance", label: "Attendance" },
];

export default function ReportsTabs() {
  const pathname = usePathname();

  return (
    <nav className="-mb-px flex items-center gap-8 overflow-x-auto no-scrollbar">
      {tabs.map((t) => {
        const active =
          t.href === "/reports"
            ? pathname === "/reports"
            : pathname === t.href || pathname.startsWith(t.href + "/");
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
            {active && (
              <span className="absolute inset-x-0 -bottom-px h-[2px] rounded-full bg-[var(--color-ink)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
