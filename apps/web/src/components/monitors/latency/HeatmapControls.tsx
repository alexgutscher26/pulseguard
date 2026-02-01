"use client";

import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import type { MetricType } from "../hooks/useHeatmapScale";

export type TimeRange = "1h" | "6h" | "24h" | "7d" | "30d";

interface HeatmapControlsProps {
  timeRange: TimeRange;
  metricType: MetricType;
  onTimeRangeChange: (value: TimeRange) => void;
  onMetricTypeChange: (value: MetricType) => void;
}

const TIME_RANGE_LABELS: Record<TimeRange, string> = {
  "1h": "1 Hour",
  "6h": "6 Hours",
  "24h": "24 Hours",
  "7d": "7 Days",
  "30d": "30 Days",
};

const METRIC_TYPE_LABELS: Record<MetricType, string> = {
  absolute: "Absolute",
  relative: "Relative",
  both: "Both",
};

export function HeatmapControls({
  timeRange,
  metricType,
  onTimeRangeChange,
  onMetricTypeChange,
}: HeatmapControlsProps) {
  // Persist preferences to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("heatmap-time-range", timeRange);
      localStorage.setItem("heatmap-metric-type", metricType);
    } catch (error) {
      console.error("[HeatmapControls] Failed to save preferences:", error);
    }
  }, [timeRange, metricType]);

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-card rounded-lg border">
      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Time Range
        </label>
        <Tabs
          value={timeRange}
          onValueChange={(value) => onTimeRangeChange(value as TimeRange)}
        >
          <TabsList>
            {(Object.keys(TIME_RANGE_LABELS) as TimeRange[]).map((range) => (
              <TabsTrigger key={range} value={range}>
                {TIME_RANGE_LABELS[range]}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
      </div>

      <div className="flex flex-col gap-2">
        <label className="text-sm font-medium text-muted-foreground">
          Metric Type
        </label>
        <ToggleGroup
          type="single"
          value={metricType}
          onValueChange={(value) => {
            if (value) onMetricTypeChange(value as MetricType);
          }}
        >
          {(Object.keys(METRIC_TYPE_LABELS) as MetricType[]).map((type) => (
            <ToggleGroupItem key={type} value={type}>
              {METRIC_TYPE_LABELS[type]}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </div>
    </div>
  );
}
