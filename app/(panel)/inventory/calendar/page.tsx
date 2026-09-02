import CalendarMonth from "@/components/inventory/CalendarMonth";
import EmptyState from "@/components/inventory/EmptyState";
import SetupChecklist from "@/components/inventory/SetupChecklist";
import ShowsTable from "@/components/inventory/ShowsTable";

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) return <EmptyState />;

  return (
    <>
      <SetupChecklist />
      <CalendarMonth />
      <ShowsTable />
    </>
  );
}
