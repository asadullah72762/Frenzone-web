export function ProgressBar({
  value,
  label,
  showPercentage = true,
}: {
  value: number;
  label?: string;
  showPercentage?: boolean;
}) {
  const percentage = Math.max(0, Math.min(value, 100));

  return (
    <div>
      {label || showPercentage ? (
        <div className="mb-2 flex justify-between text-xs font-semibold">
          {label ? <span className="text-text-primary">{label}</span> : <span />}
          {showPercentage ? (
            <span className="text-brand font-bold">{percentage}%</span>
          ) : null}
        </div>
      ) : null}

      <div className="h-2 overflow-hidden rounded-full bg-surface-muted border border-border/50">
        <div
          className="h-full rounded-full bg-brand transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
