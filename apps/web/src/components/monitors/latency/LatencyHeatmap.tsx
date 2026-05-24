"use client";

import { useState } from "react";
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

  const { data, isLoading, error, refetch } = useLatencyData(monitorId, timeRange);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between px-1">
        <div>
          <h2 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <TrendingUp className="h-4.5 w-4.5 text-primary" />
            Latency Heatmap
          </h2>
          <p className="text-xs text-muted-foreground mt-1">
            Real-time latency performance across regions
          </p>
        </div>

        {data && (
          <div className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
            <span className="font-extrabold text-foreground">{data.regions.length}</span> regions
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
            <button onClick={() => refetch()} className="ml-2 underline hover:no-underline">
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
          <div className="rounded-xl border border-border bg-card overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.02)]">
            <HeatmapGrid data={data} metricType={metricType} onRegionClick={setSelectedRegion} />
          </div>

          {/* Legend */}
          <HeatmapLegend metricType={metricType} colorScale={data.colorScale} />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard
              label="Total Data Points"
              value={data.regions.reduce((sum, r) => sum + r.data.length, 0).toString()}
            />
            <StatCard label="Granularity" value={getGranularityLabel(data.granularity)} />
            <StatCard
              label="Active Incidents"
              value={data.regions.filter((r) => r.currentIncident).length.toString()}
              variant={data.regions.some((r) => r.currentIncident) ? "destructive" : "default"}
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
      className={`p-5 rounded-xl border transition-all hover:shadow-[0_8px_30px_rgba(0,0,0,0.02)] ${
        variant === "destructive"
          ? "bg-red-500/10 border-red-500/20 text-red-500"
          : "bg-card border-border"
      }`}
    >
      <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div
        className={`text-xl font-extrabold mt-2 tracking-tight ${variant === "destructive" ? "text-red-500" : "text-foreground"}`}
      >
        {value}
      </div>
    </div>
  );
}

/**
 * Get human-readable granularity label
 */
function getGranularityLabel(granularity: "ONE_MINUTE" | "FIVE_MINUTE" | "ONE_HOUR"): string {
  const labels = {
    ONE_MINUTE: "1 Minute",
    FIVE_MINUTE: "5 Minutes",
    ONE_HOUR: "1 Hour",
  };
  return labels[granularity] || granularity;
}
