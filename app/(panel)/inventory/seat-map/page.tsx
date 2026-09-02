import EmptyState from "@/components/inventory/EmptyState";
import SeatMap from "@/components/inventory/SeatMap";

export default async function SeatMapPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) {
    return (
      <EmptyState
        title="You don't have a seat map yet"
        subtitle="Design your venue layout, zones and seat allocation"
        ctaLabel="Add seat map"
      />
    );
  }
  return <SeatMap />;
}
