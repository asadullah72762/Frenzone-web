import { Inbox, LucideIcon } from "lucide-react";

export function EmptyState({
  title,
  description,
  icon: Icon = Inbox,
}: {
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border p-8 text-center bg-surface-muted/30">
      <Icon className="text-text-muted mx-auto mb-3 h-10 w-10" aria-hidden="true" />
      <h3 className="font-semibold text-text-primary text-base">{title}</h3>
      <p className="text-text-secondary mt-1 text-xs max-w-sm mx-auto leading-relaxed">{description}</p>
    </div>
  );
}
