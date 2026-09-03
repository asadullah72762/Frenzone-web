"use client";

import { useMemo } from "react";

export interface BarChartItem {
  label: string;
  value: number;
  subLabel?: string;
  tooltipText?: string;
}

interface BarChartProps {
  data: BarChartItem[];
  maxValue?: number;
  height?: number; // Height in pixels e.g. 220
  formatValue?: (val: number) => string;
}

export function BarChart({
  data,
  maxValue: explicitMax,
  height = 240,
  formatValue = (v) => v.toLocaleString(),
}: BarChartProps) {
  const computedMax = useMemo(() => {
    if (explicitMax) return explicitMax;
    const max = Math.max(...data.map((d) => d.value), 10);
    return Math.ceil(max * 1.15); // Add 15% headroom for top gridline
  }, [data, explicitMax]);

  return (
    <div className="w-full space-y-4">
      {/* Responsive Scrollable Container */}
      <div className="overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-border">
        <div className="min-w-[520px] sm:min-w-full relative pt-8">
          {/* Y-Axis Background Gridlines */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 pt-8">
            <div className="border-b border-dashed border-border/60 w-full flex justify-between items-center text-[10px] text-text-muted font-semibold">
              <span>{formatValue(computedMax)}</span>
            </div>
            <div className="border-b border-dashed border-border/40 w-full flex justify-between items-center text-[10px] text-text-muted font-semibold">
              <span>{formatValue(Math.round(computedMax / 2))}</span>
            </div>
            <div className="border-b border-border w-full flex justify-between items-center text-[10px] text-text-muted font-semibold">
              <span>0</span>
            </div>
          </div>

          {/* Bar Column Flex Row */}
          <div
            style={{ height: `${height}px` }}
            className="relative z-10 flex items-end justify-between space-x-2 sm:space-x-4 px-2"
          >
            {data.map((item, idx) => {
              const pct = Math.max(8, Math.min(100, Math.round((item.value / computedMax) * 100)));

              return (
                <div
                  key={idx}
                  className="flex-1 h-full flex flex-col justify-end items-center group relative max-w-[3.5rem]"
                >
                  {/* Hover Tooltip Popup */}
                  <div className="opacity-0 group-hover:opacity-100 transition-all duration-200 pointer-events-none absolute -top-8 bg-text-primary text-text-inverse text-[10px] font-extrabold rounded-md py-1 px-2.5 shadow-md whitespace-nowrap z-30 transform -translate-y-1 group-hover:translate-y-0">
                    {item.tooltipText || `${item.label}: ${formatValue(item.value)}`}
                  </div>

                  {/* Slender Track & Bar Fill */}
                  <div className="w-full max-w-[2.25rem] sm:max-w-[2.5rem] h-full flex items-end justify-center bg-surface-muted/50 rounded-t-xl p-1 border border-border/30 group-hover:border-brand/40 transition-colors">
                    <div
                      style={{ height: `${pct}%` }}
                      className="w-full rounded-t-lg bg-brand group-hover:bg-brand-hover transition-all duration-300 shadow-sm"
                    />
                  </div>

                  {/* X-Axis Date/Name Label */}
                  <div className="mt-2 text-center">
                    <span className="text-[11px] font-bold text-text-muted group-hover:text-brand transition-colors block leading-none">
                      {item.label}
                    </span>
                    {item.subLabel ? (
                      <span className="text-[9px] text-text-muted block mt-0.5">{item.subLabel}</span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
