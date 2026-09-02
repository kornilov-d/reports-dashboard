import EmptyState from "@/components/inventory/EmptyState";
import PageManager from "@/components/inventory/PageManager";

export default async function PageManagerPage({
  searchParams,
}: {
  searchParams: Promise<{ empty?: string }>;
}) {
  const { empty } = await searchParams;
  if (empty) {
    return (
      <EmptyState
        title="You don't have any pages yet"
        subtitle="Customise how your ticket pages look on web and mobile"
        ctaLabel="Add page"
      />
    );
  }
  return <PageManager />;
}
