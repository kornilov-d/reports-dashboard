import EmptyState from "@/components/inventory/EmptyState";
import SeasonTickets from "@/components/inventory/SeasonTickets";

export default async function SeasonTicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) {
    return (
      <EmptyState
        title="You don't have any season tickets yet"
        subtitle="Set up multi-show passes and recurring subscriptions"
        ctaLabel="Add season ticket"
      />
    );
  }
  return <SeasonTickets />;
}
