import { Card } from "@/components/ui/card";
type Props = { title: string; description: string; metrics: string[] };
export function DashboardOverview({ title, description, metrics }: Props) {
  return (
    <>
      <h1 className="text-3xl font-bold">{title}</h1>
      <p className="text-text-secondary mt-2">{description}</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map((metric) => (
          <Card key={metric}>
            <p className="text-text-secondary text-sm">{metric}</p>
            <p className="mt-2 text-xl font-semibold">—</p>
            <p className="text-text-muted mt-1 text-xs">Available when connected</p>
          </Card>
        ))}
      </div>
      <Card className="mt-6">
        <h2 className="font-semibold">Recent activity</h2>
        <p className="text-text-secondary mt-2 text-sm">
          There is no activity to show yet.
        </p>
      </Card>
    </>
  );
}
