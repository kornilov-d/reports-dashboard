import { Dots, PlIcon, Search } from "@/components/icons";

export default function TopBar({ eventTitle }: { eventTitle: string }) {
  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-[var(--color-line)] bg-white px-6">
      <div className="flex items-center gap-3">
        <PlIcon size={28} />
        <span className="text-[15px] font-medium tracking-tight">
          {eventTitle}
        </span>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="flex h-10 items-center gap-2 rounded-lg px-3 text-[14px] text-[var(--color-mute)] hover:bg-[var(--color-line-2)] hover:text-[var(--color-ink)]"
        >
          <Search size={18} />
          <span>Search</span>
        </button>

        <div
          aria-label="Account"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--color-ink)] text-[12px] font-semibold text-white"
        >
          OQ
        </div>

        <button
          type="button"
          aria-label="More"
          className="flex h-10 w-10 items-center justify-center rounded-lg text-[var(--color-ink)] hover:bg-[var(--color-line-2)]"
        >
          <Dots size={20} />
        </button>
      </div>
    </header>
  );
}
