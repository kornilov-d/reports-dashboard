import EmptyState from "@/components/inventory/EmptyState";
import SetupChecklist from "@/components/inventory/SetupChecklist";
import TicketsTable from "@/components/inventory/TicketsTable";

export default async function TicketsPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) {
    return (
      <>
        <SetupChecklist />
        <div className="mt-8">
          <EmptyState
            title="You don't have any tickets yet"
            subtitle="Create tickets to start"
            ctaLabel="Add ticket"
          />
        </div>
      </>
    );
  }

  return (
    <>
      <SetupChecklist />
      <div className="mt-8">
        <TicketsTable />
      </div>
    </>
  );
}
