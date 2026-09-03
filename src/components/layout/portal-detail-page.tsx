import { EmptyState } from "@/components/feedback/empty-state";
export function PortalDetailPage({
  title,
  description,
  emptyTitle,
  emptyDescription,
}: {
  title: string;
  description: string;
  emptyTitle: string;
  emptyDescription: string;
}) {
  return (
    <>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-text-secondary mt-2">{description}</p>
      <div className="mt-6">
        <EmptyState title={emptyTitle} description={emptyDescription} />
      </div>
    </>
  );
}
