import EmptyState from "@/components/inventory/EmptyState";
import Scanning from "@/components/inventory/Scanning";

export default async function ScanningPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) {
    return (
      <EmptyState
        title="You don't have any scanners yet"
        subtitle="Manage scanner access, devices and entry checkpoints"
        ctaLabel="Add scanner"
      />
    );
  }
  return <Scanning />;
}
