import AddOns from "@/components/inventory/AddOns";
import EmptyState from "@/components/inventory/EmptyState";

export default async function AddOnsPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) {
    return (
      <EmptyState
        title="You don't have any add-ons yet"
        subtitle="Bundle merchandise, food vouchers and extras with your tickets"
        ctaLabel="Add add-on"
      />
    );
  }
  return <AddOns />;
}
