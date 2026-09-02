import EmptyState from "@/components/inventory/EmptyState";
import Settings from "@/components/inventory/Settings";

export default async function SettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) {
    return (
      <EmptyState
        title="You haven't configured settings yet"
        subtitle="Configure currency, languages, refund policy and metadata"
        ctaLabel="Add settings"
      />
    );
  }
  return <Settings />;
}
