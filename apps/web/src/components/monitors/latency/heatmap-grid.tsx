"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useHeatmapScale, type MetricType } from "./hooks/use-heatmap-scale";
import type { LatencyHeatmapData } from "./hooks/use-latency-data";
import { cn } from "@/lib/utils";
import { AVAILABLE_REGIONS } from "@steadystack/shared";

interface HeatmapGridProps {
  data: LatencyHeatmapData;
  metricType: MetricType;
  onRegionClick?: (region: string) => void;
}

export function HeatmapGrid({ data, metricType, onRegionClick }: HeatmapGridProps) {
  const { getColorForPoint } = useHeatmapScale(metricType);

  // Get unique timestamps across all regions
  const timestamps = useMemo(() => {
    const allTimestamps = new Set<number>();
    data.regions.forEach((region) => {
      region.data.forEach((point) => {
        allTimestamps.add(point.timestamp);
      });
    });
    return Array.from(allTimestamps).sort((a, b) => a - b);
  }, [data.regions]);

  // Limit to last 24 data points for readability
  const displayTimestamps = timestamps.slice(-24);

  if (data.regions.length === 0 || displayTimestamps.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground text-sm">
        No latency data available for this time range. Data will appear after the next check cycle.
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto">
      <div className="min-w-max">
        {/* Header */}
        <div className="flex items-center border-b bg-muted/50">
          <div className="w-32 p-2 font-semibold text-sm sticky left-0 bg-muted/50 z-10">
            Region
          </div>
          <div className="flex-1 flex">
            {displayTimestamps.map((timestamp) => (
              <div
                key={timestamp}
                className="flex-1 min-w-[60px] p-2 text-xs text-center text-muted-foreground"
              >
                {format(new Date(timestamp * 1000), "HH:mm")}
              </div>
            ))}
          </div>
        </div>

        {/* Rows */}
        {data.regions.map((region) => {
          const dataMap = new Map(region.data.map((point) => [point.timestamp, point]));

          return (
            <div
              key={region.region}
              className="flex items-center border-b hover:bg-muted/30 transition-colors cursor-pointer group"
              onClick={() => onRegionClick?.(region.region)}
            >
              {/* Region name */}
              <button
                onClick={() => onRegionClick?.(region.region)}
                className="w-32 p-2 text-sm font-medium text-left sticky left-0 bg-background z-10 hover:underline"
              >
                {getRegionName(region.region)}
              </button>

              {/* Data cells */}
              <div className="flex-1 flex">
                {displayTimestamps.map((timestamp) => {
                  const point = dataMap.get(timestamp);

                  if (!point) {
                    return <div key={timestamp} className="flex-1 min-w-[60px] p-2 bg-muted/20" />;
                  }

                  const color = getColorForPoint(point);

                  let displayValue: string;
                  if (metricType === "absolute") {
                    displayValue = `${Math.round(point.absolute?.avg ?? 0)}ms`;
                  } else if (metricType === "relative") {
                    displayValue =
                      point.relative?.vsBaseline != null
                        ? `${Number(point.relative.vsBaseline).toFixed(2)}x`
                        : `${Math.round(point.absolute?.avg ?? 0)}ms`;
                  } else {
                    // Both
                    displayValue = `${Math.round(point.absolute?.avg ?? 0)}ms`;
                  }

                  return (
                    <div
                      key={timestamp}
                      className={cn(
                        "flex-1 min-w-[60px] p-2 text-xs text-center font-medium cursor-pointer transition-all hover:scale-105 hover:z-20 hover:shadow-lg",
                        point.hasIncident && "ring-2 ring-destructive animate-pulse",
                      )}
                      style={{
                        backgroundColor: color,
                        color: getContrastColor(color),
                      }}
                      title={getTooltipText(point, metricType)}
                      onClick={() => onRegionClick?.(region.region)}
                    >
                      {displayValue}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Pre-compute region names for O(1) lookup
const REGION_NAME_MAP = new Map([
  ...AVAILABLE_REGIONS.map((r) => [r.code, `${r.flag} ${r.name}`] as [string, string]),
  ["global", "🌐 Global Edge"],
]);

/**
 * Get human-readable region name with flag
 */
function getRegionName(code: string): string {
  return REGION_NAME_MAP.get(code) || code;
}

/**
 * Get tooltip text for a data point
 */
function getTooltipText(
  point: {
    absolute?: { avg?: number; p50?: number; p95?: number; p99?: number };
    relative?: { vsBaseline?: number } | null;
    successRate?: number;
  },
  metricType: MetricType,
): string {
  const avg = Math.round(point.absolute?.avg ?? 0);
  const p50 = Math.round(point.absolute?.p50 ?? 0);
  const p95 = Math.round(point.absolute?.p95 ?? 0);
  const p99 = Math.round(point.absolute?.p99 ?? 0);
  const successRate = Number((point.successRate ?? 1) * 100).toFixed(1);

  const lines = [
    `Avg: ${avg}ms`,
    `P50: ${p50}ms`,
    `P95: ${p95}ms`,
    `P99: ${p99}ms`,
    `Success: ${successRate}%`,
  ];

  if (metricType !== "absolute" && point.relative?.vsBaseline != null) {
    lines.push(`vs Baseline: ${Number(point.relative.vsBaseline).toFixed(2)}x`);
  }

  return lines.join("\n");
}

/**
 * Get contrasting text color for background
 */
function getContrastColor(backgroundColor: string): string {
  const match = backgroundColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return "#000000";

  const lightness = parseInt(match[3]);
  return lightness < 50 ? "#ffffff" : "#000000";
}
