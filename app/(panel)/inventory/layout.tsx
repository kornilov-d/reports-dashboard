import InventoryTabs from "@/components/inventory/InventoryTabs";

export default function InventoryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-10 pt-8 pb-16">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight">
            Inventory
          </h1>
          <p className="mt-1 text-[13px] text-[var(--color-mute)]">
            Multiple shows mode
          </p>
        </div>

        <div className="flex h-10 items-center gap-2 rounded-full bg-[var(--color-line-2)] px-4 text-[13px] font-medium">
          <span>Shows</span>
          <span className="text-[var(--color-mute)]">6</span>
        </div>
      </div>

      <div className="mt-6 border-b border-[var(--color-line)]">
        <InventoryTabs />
      </div>

      <div className="pt-8">{children}</div>
    </div>
  );
}
