export default function TabPlaceholder({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-[var(--color-line)] bg-[var(--color-surface-2)] px-8 py-16 text-center">
      <h2 className="text-[18px] font-semibold tracking-tight">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-[13.5px] text-[var(--color-mute)]">
        {description}
      </p>
    </div>
  );
}
