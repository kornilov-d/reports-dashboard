"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronRight,
  IconBadge,
  IconBarcode,
  IconBox,
  IconCard,
  IconChart,
  IconChat,
  IconInfo,
  IconList,
  IconMail,
  IconPeople,
  IconPlay,
  IconStar,
  IconTag,
  IconTicket,
  IconTicket2,
} from "@/components/icons";
import type { ComponentType, SVGProps } from "react";

type Item = {
  href: string;
  label: string;
  Icon: ComponentType<SVGProps<SVGSVGElement> & { size?: number }>;
};

const topItems: Item[] = [
  { href: "/inventory", label: "Inventory", Icon: IconList },
  { href: "/products", label: "Products", Icon: IconBox },
  { href: "/reports", label: "Reports", Icon: IconChart },
  { href: "/scanning", label: "Scanning", Icon: IconBarcode },
  { href: "/messaging", label: "Messaging", Icon: IconMail },
  { href: "/tickets", label: "Tickets", Icon: IconTicket },
  { href: "/payments", label: "Payments", Icon: IconCard },
  { href: "/inbox", label: "Inbox", Icon: IconChat },
  { href: "/promos", label: "Promos", Icon: IconBadge },
  { href: "/coupons", label: "Coupons", Icon: IconTag },
  { href: "/info", label: "Info", Icon: IconInfo },
  { href: "/loyalty", label: "Loyalty", Icon: IconStar },
  { href: "/team", label: "Team", Icon: IconPeople },
];

const bottomItems: Item[] = [
  { href: "/sale-console", label: "Sale console", Icon: IconTicket2 },
  { href: "/shows", label: "Shows", Icon: IconPlay },
];

function NavLink({ href, label, Icon, active }: Item & { active: boolean }) {
  return (
    <Link
      href={href}
      title={label}
      aria-label={label}
      className={[
        "group flex h-10 w-10 items-center justify-center rounded-lg",
        active
          ? "bg-[var(--color-line-2)] text-[var(--color-ink)]"
          : "text-[var(--color-mute)] hover:text-[var(--color-ink)] hover:bg-[var(--color-line-2)]",
      ].join(" ")}
    >
      <Icon size={20} />
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside className="sticky top-0 z-30 flex h-screen w-[72px] shrink-0 flex-col border-r border-[var(--color-line)] bg-white">
      <div className="flex h-16 items-center justify-center border-b border-[var(--color-line)]">
        <button
          type="button"
          aria-label="Expand sidebar"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-[var(--color-line)] text-[var(--color-mute)] hover:text-[var(--color-ink)]"
        >
          <ChevronRight size={16} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col items-center gap-1 px-3 pt-3">
        {topItems.map((it) => (
          <NavLink
            key={it.href}
            {...it}
            active={pathname.startsWith(it.href)}
          />
        ))}
      </nav>

      <div className="flex flex-col items-center gap-1 px-3 pb-4">
        {bottomItems.map((it) => (
          <NavLink
            key={it.href}
            {...it}
            active={pathname.startsWith(it.href)}
          />
        ))}
      </div>
    </aside>
  );
}
