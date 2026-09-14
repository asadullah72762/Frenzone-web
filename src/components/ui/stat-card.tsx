import type { ReactNode } from "react";
import { Card } from "./card";
import { StatCardSkeleton } from "./skeleton";

export interface StatCardProps {
  label: string;
  value: string | number;
  detail?: string;
  trend?: {
    value: string;
    positive: boolean;
  };
  icon?: ReactNode;
  isLoading?: boolean;
}

export function StatCard({
  label,
  value,
  detail,
  trend,
  icon,
  isLoading = false,
}: StatCardProps) {
  if (isLoading) {
    return <StatCardSkeleton />;
  }

  return (
    <Card className="transition-all duration-200 hover:border-brand/30 hover:shadow-card">
      <div className="flex items-center justify-between">
        <p className="text-text-secondary text-sm font-medium">{label}</p>
        {icon ? (
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-soft/70 text-brand">
            {icon}
          </div>
        ) : null}
      </div>

      <div className="mt-3 flex items-baseline justify-between">
        <p className="text-2xl font-bold tracking-tight text-text-primary">
          {value}
        </p>

        {trend && trend.value ? (() => {
          const cleanValue = trend.value.replace(/^[+-]/, "").trim();
          return (
            <span
              className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full ${
                trend.positive
                  ? "bg-success-soft text-success"
                  : "bg-danger-soft text-danger"
              }`}
            >
              {trend.positive ? "+" : "-"}{cleanValue}
            </span>
          );
        })() : null}
      </div>

      {detail ? (
        <p className="text-text-muted mt-2 text-xs font-normal">{detail}</p>
      ) : null}
    </Card>
  );
}
