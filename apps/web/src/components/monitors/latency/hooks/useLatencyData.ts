"use client";

import { useState, useEffect, useCallback } from "react";

export interface LatencyDataPoint {
  timestamp: number;
  absolute: {
    avg: number;
    p50: number;
    p95: number;
    p99: number;
    min: number;
    max: number;
  };
  relative: {
    vsBaseline: number;
  } | null;
  hasIncident: boolean;
  sampleCount: number;
  successRate: number;
}

export interface RegionData {
  region: string;
  data: LatencyDataPoint[];
  baseline: number | null;
  currentIncident: {
    id: string;
    status: string;
    startedAt: string;
  } | null;
}

export interface LatencyHeatmapData {
  monitorId: string;
  timeRange: string;
  granularity: "ONE_MINUTE" | "FIVE_MINUTE" | "ONE_HOUR";
  regions: RegionData[];
  colorScale: {
    absolute: { min: number; max: number };
    relative: { min: number; max: number };
  };
}

interface UseLatencyDataReturn {
  data: LatencyHeatmapData | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

/**
 * Hook to fetch latency heatmap data with real-time SSE updates
 */
export function useLatencyData(
  monitorId: string,
  timeRange: string = "24h"
): UseLatencyDataReturn {
  const [data, setData] = useState<LatencyHeatmapData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchInitialData = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const res = await fetch(
        `/api/monitors/${monitorId}/latency-heatmap?timeRange=${timeRange}`
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch heatmap data: ${res.statusText}`);
      }

      const json = await res.json();
      setData(json);
    } catch (err) {
      console.error("[useLatencyData] Fetch error:", err);
      setError(err as Error);
    } finally {
      setIsLoading(false);
    }
  }, [monitorId, timeRange]);

  useEffect(() => {
    let eventSource: EventSource | null = null;
    let reconnectTimeout: NodeJS.Timeout | null = null;
    let isSubscribed = true;

    function setupSSE() {
      if (!isSubscribed) return;

      try {
        eventSource = new EventSource(
          `/api/monitors/${monitorId}/latency-stream`
        );

        eventSource.onopen = () => {
          console.log("[SSE] Connection established");
        };

        eventSource.onmessage = (event) => {
          if (!isSubscribed) return;

          try {
            const update = JSON.parse(event.data);

            if (update.type === "connected") {
              console.log("[SSE] Connected to monitor:", update.monitorId);
            } else if (update.type === "heartbeat") {
              // Keep-alive, no action needed
            } else if (update.type === "latency_update") {
              setData((prev) => {
                if (!prev) return prev;
                return mergeLatencyUpdate(prev, update);
              });
            }
          } catch (parseError) {
            console.error("[SSE] Failed to parse message:", parseError);
          }
        };

        eventSource.onerror = (err) => {
          console.error("[SSE] Connection error:", err);
          eventSource?.close();

          // Attempt reconnection after 5 seconds
          if (isSubscribed) {
            reconnectTimeout = setTimeout(() => {
              console.log("[SSE] Attempting to reconnect...");
              setupSSE();
            }, 5000);
          }
        };
      } catch (err) {
        console.error("[SSE] Setup error:", err);
      }
    }

    // Fetch initial data, then setup SSE
    fetchInitialData().then(() => {
      setupSSE();
    });

    // Cleanup
    return () => {
      isSubscribed = false;
      if (eventSource) {
        eventSource.close();
      }
      if (reconnectTimeout) {
        clearTimeout(reconnectTimeout);
      }
    };
  }, [monitorId, timeRange, fetchInitialData]);

  return { data, isLoading, error, refetch: fetchInitialData };
}

/**
 * Merge real-time latency update into existing data
 */
function mergeLatencyUpdate(
  prev: LatencyHeatmapData,
  update: {
    monitorId: string;
    region: string;
    timestamp: number;
    latency: {
      avg: number;
      p50: number;
      p95: number;
      p99: number;
    };
    sampleCount: number;
    successRate: number;
  }
): LatencyHeatmapData {
  const regionIndex = prev.regions.findIndex((r) => r.region === update.region);

  // If region not found, ignore update (shouldn't happen)
  if (regionIndex === -1) {
    console.warn(`[SSE] Unknown region: ${update.region}`);
    return prev;
  }

  const updatedRegions = [...prev.regions];
  const region = updatedRegions[regionIndex];

  // Create new data point
  const newPoint: LatencyDataPoint = {
    timestamp: update.timestamp,
    absolute: {
      avg: update.latency.avg,
      p50: update.latency.p50,
      p95: update.latency.p95,
      p99: update.latency.p99,
      min: update.latency.avg, // Approximate
      max: update.latency.avg, // Approximate
    },
    relative: region.baseline
      ? {
          vsBaseline: update.latency.avg / region.baseline,
        }
      : null,
    hasIncident: !!region.currentIncident,
    sampleCount: update.sampleCount,
    successRate: update.successRate,
  };

  // Add new point and keep last 100 points
  updatedRegions[regionIndex] = {
    ...region,
    data: [...region.data, newPoint].slice(-100),
  };

  return {
    ...prev,
    regions: updatedRegions,
  };
}
