export type StatusType =
  | "PENDING_REVIEW"
  | "MORE_INFORMATION_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "COMPLETED"
  | "PARTIAL"
  | "MISSED"
  | "EXCUSED"
  | "ACTIVE"
  | "INACTIVE"
  | "PENDING_CONSENT"
  | "PENDING"
  | "PAID"
  | "PROCESSING"
  | "FAILED"
  | "TRANSFERRED";

const statusConfig: Record<
  StatusType,
  { label: string; style: string }
> = {
  APPROVED: { label: "Approved", style: "bg-success-soft text-success border-success/20" },
  COMPLETED: { label: "Completed", style: "bg-success-soft text-success border-success/20" },
  ACTIVE: { label: "Active", style: "bg-success-soft text-success border-success/20" },
  PAID: { label: "Paid", style: "bg-success-soft text-success border-success/20" },

  PENDING_REVIEW: { label: "Pending review", style: "bg-warning-soft text-warning border-warning/20" },
  MORE_INFORMATION_REQUIRED: { label: "Action required", style: "bg-warning-soft text-warning border-warning/20" },
  PARTIAL: { label: "Partial", style: "bg-warning-soft text-warning border-warning/20" },
  PENDING_CONSENT: { label: "Pending consent", style: "bg-warning-soft text-warning border-warning/20" },
  PENDING: { label: "Pending", style: "bg-warning-soft text-warning border-warning/20" },
  PROCESSING: { label: "Processing", style: "bg-info-soft text-info border-info/20" },

  REJECTED: { label: "Rejected", style: "bg-danger-soft text-danger border-danger/20" },
  SUSPENDED: { label: "Suspended", style: "bg-danger-soft text-danger border-danger/20" },
  MISSED: { label: "Missed", style: "bg-danger-soft text-danger border-danger/20" },
  FAILED: { label: "Failed", style: "bg-danger-soft text-danger border-danger/20" },
  INACTIVE: { label: "Inactive", style: "bg-surface-muted text-text-muted border-border" },

  EXCUSED: { label: "Excused", style: "bg-info-soft text-info border-info/20" },
  TRANSFERRED: { label: "Transferred", style: "bg-brand-soft text-brand border-brand/20" },
};

export function StatusBadge({
  status,
  customLabel,
}: {
  status: string;
  customLabel?: string;
}) {
  const config = statusConfig[status as StatusType] || {
    label: customLabel || status.replace(/_/g, " "),
    style: "bg-surface-muted text-text-secondary border-border",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold tracking-wide transition-colors ${config.style}`}
    >
      <span className="mr-1.5 h-1.5 w-1.5 rounded-full fill-current bg-current opacity-75" />
      {customLabel || config.label}
    </span>
  );
}
