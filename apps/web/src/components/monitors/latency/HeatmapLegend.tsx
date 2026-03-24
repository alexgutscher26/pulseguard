"use client";

import { COLOR_SCALES, type MetricType } from "./hooks/useHeatmapScale";

interface HeatmapLegendProps {
  metricType: MetricType;
  colorScale?: {
    absolute: { min: number; max: number };
    relative: { min: number; max: number };
  };
}

export function HeatmapLegend({ metricType, colorScale }: HeatmapLegendProps) {
  const scales =
    metricType === "both"
      ? [
          { type: "absolute" as const, title: "Absolute Latency" },
          { type: "relative" as const, title: "Relative Performance" },
        ]
      : [{ type: metricType as "absolute" | "relative", title: "" }];

  return (
    <div className="flex flex-col gap-4 p-4 bg-card rounded-lg border">
      <h3 className="text-sm font-semibold">Legend</h3>

      <div className="flex flex-col lg:flex-row gap-6">
        {scales.map(({ type, title }) => (
          <div key={type} className="flex-1">
            {title && <h4 className="text-xs font-medium text-muted-foreground mb-2">{title}</h4>}

            <div className="flex flex-wrap gap-3">
              {COLOR_SCALES[type].ranges.map((range, i) => (
                <div key={i} className="flex items-center gap-2">
                  <div
                    className="w-8 h-8 rounded border border-border shadow-sm"
                    style={{ backgroundColor: range.color }}
                    aria-label={range.label}
                  />
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {range.label}
                  </span>
                </div>
              ))}
            </div>

            {colorScale && (
              <div className="mt-2 text-xs text-muted-foreground">
                Range: {colorScale[type].min.toFixed(0)} - {colorScale[type].max.toFixed(0)}
                {type === "absolute" ? "ms" : "x"}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 pt-2 border-t">
        <div className="w-8 h-8 rounded border-2 border-destructive animate-pulse" />
        <span className="text-xs text-muted-foreground">Active Incident (pulsing red border)</span>
      </div>
    </div>
  );
}
