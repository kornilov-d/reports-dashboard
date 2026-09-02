import ReportsTabs from "@/components/reports/ReportsTabs";

export default function ReportsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 pt-8 pb-16 sm:px-6 lg:px-10">
      <div className="flex items-start justify-between gap-6">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight tracking-tight">
            Reports
          </h1>
          <p className="mt-1 text-[13px] text-[var(--color-mute)]">
            Performance across every show
          </p>
        </div>

        <div className="flex h-10 items-center gap-2 rounded-full bg-[var(--color-line-2)] px-4 text-[13px] font-medium">
          <span>Shows</span>
          <span className="text-[var(--color-mute)]">4</span>
        </div>
      </div>

      <div className="mt-6 border-b border-[var(--color-line)]">
        <ReportsTabs />
      </div>

      <div className="pt-8">{children}</div>
    </div>
  );
}
