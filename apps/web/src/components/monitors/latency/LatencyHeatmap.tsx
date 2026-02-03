"use client";

import { useState, useEffect } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, TrendingUp } from "lucide-react";
import { HeatmapControls, type TimeRange } from "./HeatmapControls";
import { HeatmapGrid } from "./HeatmapGrid";
import { HeatmapLegend } from "./HeatmapLegend";
import { RegionalDetailModal } from "./RegionalDetailModal";
import { useLatencyData } from "./hooks/useLatencyData";
import type { MetricType } from "./hooks/useHeatmapScale";

interface LatencyHeatmapProps {
  monitorId: string;
  defaultTimeRange?: TimeRange;
  defaultMetricType?: MetricType;
}

export function LatencyHeatmap({
  monitorId,
  defaultTimeRange = "24h",
  defaultMetricType = "both",
}: LatencyHeatmapProps) {
  // Load preferences from localStorage
  const [timeRange, setTimeRange] = useState<TimeRange>(() => {
    if (typeof window === "undefined") return defaultTimeRange;
    const saved = localStorage.getItem("heatmap-time-range");
    return (saved as TimeRange) || defaultTimeRange;
  });

  const [metricType, setMetricType] = useState<MetricType>(() => {
    if (typeof window === "undefined") return defaultMetricType;
    const saved = localStorage.getItem("heatmap-metric-type");
    return (saved as MetricType) || defaultMetricType;
  });

  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

  const { data, isLoading, error, refetch } = useLatencyData(
    monitorId,
    timeRange,
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6" />
            Latency Heatmap
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time latency performance across regions
          </p>
        </div>

        {data && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">{data.regions.length}</span> regions
            monitored
          </div>
        )}
      </div>

      {/* Controls */}
      <HeatmapControls
        timeRange={timeRange}
        metricType={metricType}
        onTimeRangeChange={setTimeRange}
        onMetricTypeChange={setMetricType}
      />

      {/* Error State */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load latency data: {error.message}
            <button
              onClick={() => refetch()}
              className="ml-2 underline hover:no-underline"
            >
              Retry
            </button>
          </AlertDescription>
        </Alert>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="space-y-4">
          <Skeleton className="h-12 w-full" />
          <Skeleton className="h-64 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {/* Heatmap Grid */}
      {data && !isLoading && (
        <>
          <div className="rounded-lg border bg-card overflow-hidden">
            <HeatmapGrid
              data={data}
              metricType={metricType}
              onRegionClick={setSelectedRegion}
            />
          </div>

          {/* Legend */}
          <HeatmapLegend metricType={metricType} colorScale={data.colorScale} />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Data Points"
              value={data.regions
                .reduce((sum, r) => sum + r.data.length, 0)
                .toString()}
            />
            <StatCard
              label="Granularity"
              value={getGranularityLabel(data.granularity)}
            />
            <StatCard
              label="Active Incidents"
              value={data.regions
                .filter((r) => r.currentIncident)
                .length.toString()}
              variant={
                data.regions.some((r) => r.currentIncident)
                  ? "destructive"
                  : "default"
              }
            />
          </div>
        </>
      )}

      {/* Regional Detail Modal */}
      {selectedRegion && data && (
        <RegionalDetailModal
          monitorId={monitorId}
          region={selectedRegion}
          onClose={() => setSelectedRegion(null)}
          regionData={data.regions.find((r) => r.region === selectedRegion)}
        />
      )}
    </div>
  );
}

/**
 * Stat Card Component
 */
function StatCard({
  label,
  value,
  variant = "default",
}: {
  label: string;
  value: string;
  variant?: "default" | "destructive";
}) {
  return (
    <div
      className={`p-4 rounded-lg border ${
        variant === "destructive"
          ? "bg-destructive/10 border-destructive"
          : "bg-card"
      }`}
    >
      <div className="text-sm text-muted-foreground">{label}</div>
      <div
        className={`text-2xl font-bold mt-1 ${
          variant === "destructive" ? "text-destructive" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Get human-readable granularity label
 */
function getGranularityLabel(
  granularity: "ONE_MINUTE" | "FIVE_MINUTE" | "ONE_HOUR",
): string {
  const labels = {
    ONE_MINUTE: "1 Minute",
    FIVE_MINUTE: "5 Minutes",
    ONE_HOUR: "1 Hour",
  };
  return labels[granularity] || granularity;
}
