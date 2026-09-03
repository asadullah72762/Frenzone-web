import { CSSProperties, ReactNode } from "react";

export function Skeleton({
  className = "",
  style,
}: {
  className?: string;
  style?: CSSProperties;
}) {
  return (
    <div
      style={style}
      className={`animate-pulse rounded-md bg-surface-muted/80 ${className}`}
      aria-hidden="true"
    />
  );
}


export function StatCardSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28" />
        <Skeleton className="h-9 w-9 rounded-lg" />
      </div>
      <Skeleton className="mt-4 h-8 w-20" />
      <Skeleton className="mt-2 h-3 w-36" />
    </div>
  );
}

export function CardSkeleton({ children }: { children?: ReactNode }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <Skeleton className="h-5 w-40" />
      <Skeleton className="mt-2 h-4 w-64" />
      <div className="mt-6 space-y-3">{children || <Skeleton className="h-24 w-full rounded-lg" />}</div>
    </div>
  );
}

export function TableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="rounded-xl border border-border bg-surface overflow-hidden shadow-sm">
      <div className="border-b border-border bg-surface-muted p-4 flex items-center justify-between">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-8 w-48 rounded-md" />
      </div>
      <div className="p-4 space-y-4">
        {Array.from({ length: rows }).map((_, i) => (
          <div key={i} className="flex items-center justify-between space-x-4">
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-4 w-1/4" />
            <Skeleton className="h-6 w-16 rounded-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function ChartSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <Skeleton className="h-5 w-36" />
          <Skeleton className="mt-1 h-3 w-56" />
        </div>
        <Skeleton className="h-8 w-24 rounded-md" />
      </div>
      <div className="h-64 w-full flex items-end justify-between space-x-2 pt-6">
        {[40, 65, 30, 85, 55, 90, 70, 45, 80, 60, 95, 75].map((height, i) => (
          <Skeleton
            key={i}
            className="w-full rounded-t-md"
            style={{ height: `${height}%` }}
          />
        ))}
      </div>
    </div>
  );
}

export function FormSkeleton() {
  return (
    <div className="rounded-xl border border-border bg-surface p-6 shadow-sm space-y-6">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-72" />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full rounded-md" />
        </div>
      </div>
      <div className="space-y-2">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-24 w-full rounded-md" />
      </div>
      <Skeleton className="h-11 w-32 rounded-lg" />
    </div>
  );
}
