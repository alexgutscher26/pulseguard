"use client";

import { useMemo } from "react";
import { format } from "date-fns";
import { useHeatmapScale, type MetricType } from "./hooks/useHeatmapScale";
import type { LatencyHeatmapData } from "./hooks/useLatencyData";
import { cn } from "@/lib/utils";

interface HeatmapGridProps {
  data: LatencyHeatmapData;
  metricType: MetricType;
  onRegionClick?: (region: string) => void;
}

/**
 * Renders a heatmap grid based on the provided data and metric type.
 *
 * The HeatmapGrid component processes the input data to extract unique timestamps,
 * limiting the display to the last 24 points for better readability. It utilizes
 * the useHeatmapScale hook to determine colors for each data point based on the
 * selected metric type. The component also handles region clicks to trigger
 * corresponding actions.
 *
 * @param {HeatmapGridProps} props - The properties for the HeatmapGrid component.
 * @param {Array} props.data - The data containing regions and their respective points.
 * @param {string} props.metricType - The type of metric to display (absolute or relative).
 * @param {function} [props.onRegionClick] - Optional callback for handling region clicks.
 */
export function HeatmapGrid({
  data,
  metricType,
  onRegionClick,
}: HeatmapGridProps) {
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
          const dataMap = new Map(
            region.data.map((point) => [point.timestamp, point]),
          );

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
                    return (
                      <div
                        key={timestamp}
                        className="flex-1 min-w-[60px] p-2 bg-muted/20"
                      />
                    );
                  }

                  const color = getColorForPoint(point);
                  const value =
                    metricType === "absolute"
                      ? point.absolute.avg
                      : (point.relative?.vsBaseline ?? point.absolute.avg);

                  return (
                    <div
                      key={timestamp}
                      className={cn(
                        "flex-1 min-w-[60px] p-2 text-xs text-center font-medium cursor-pointer transition-all hover:scale-105 hover:z-20 hover:shadow-lg",
                        point.hasIncident &&
                          "ring-2 ring-destructive animate-pulse",
                      )}
                      style={{
                        backgroundColor: color,
                        color: getContrastColor(color),
                      }}
                      title={getTooltipText(point, metricType)}
                      onClick={() => onRegionClick?.(region.region)}
                    >
                      {metricType === "absolute"
                        ? `${Math.round(value)}ms`
                        : `${value.toFixed(2)}x`}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {data.regions.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">
          No latency data available for this time range.
        </div>
      )}
    </div>
  );
}

/**
 * Get human-readable region name
 */
function getRegionName(region: string): string {
  const regionNames: Record<string, string> = {
    "us-east": "🇺🇸 US East",
    "us-west": "🇺🇸 US West",
    "eu-west": "🇪🇺 EU West",
    "eu-central": "🇪🇺 EU Central",
    "ap-south": "🇮🇳 Asia Pacific",
    "ap-southeast": "🇸🇬 Southeast Asia",
  };

  return regionNames[region] || region;
}

/**
 * Get tooltip text for a data point
 */
function getTooltipText(
  point: {
    absolute: { avg: number; p50: number; p95: number; p99: number };
    relative: { vsBaseline: number } | null;
    successRate: number;
  },
  metricType: MetricType,
): string {
  const lines = [
    `Avg: ${Math.round(point.absolute.avg)}ms`,
    `P50: ${Math.round(point.absolute.p50)}ms`,
    `P95: ${Math.round(point.absolute.p95)}ms`,
    `P99: ${Math.round(point.absolute.p99)}ms`,
    `Success: ${(point.successRate * 100).toFixed(1)}%`,
  ];

  if (metricType !== "absolute" && point.relative) {
    lines.push(`vs Baseline: ${point.relative.vsBaseline.toFixed(2)}x`);
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
