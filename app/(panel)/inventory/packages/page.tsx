import EmptyState from "@/components/inventory/EmptyState";
import Packages from "@/components/inventory/Packages";

export default async function PackagesPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) {
    return (
      <EmptyState
        title="You don't have any packages yet"
        subtitle="Group tickets and add-ons into curated bundles"
        ctaLabel="Add package"
      />
    );
  }
  return <Packages />;
}
