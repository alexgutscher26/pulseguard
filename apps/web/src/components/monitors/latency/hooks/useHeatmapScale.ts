"use client";

import { useMemo } from "react";

export type MetricType = "absolute" | "relative" | "both";

export interface ColorRange {
  max: number;
  color: string;
  label: string;
}

export const COLOR_SCALES = {
  absolute: {
    ranges: [
      { max: 100, color: "hsl(120, 70%, 50%)", label: "< 100ms (Excellent)" },
      { max: 300, color: "hsl(60, 70%, 50%)", label: "100-300ms (Good)" },
      { max: 500, color: "hsl(30, 70%, 50%)", label: "300-500ms (Slow)" },
      {
        max: Infinity,
        color: "hsl(0, 70%, 50%)",
        label: "> 500ms (Critical)",
      },
    ],
  },
  relative: {
    ranges: [
      {
        max: 0.8,
        color: "hsl(120, 70%, 50%)",
        label: "< 0.8x baseline (Fast)",
      },
      {
        max: 1.2,
        color: "hsl(60, 70%, 50%)",
        label: "0.8-1.2x baseline (Normal)",
      },
      {
        max: 1.5,
        color: "hsl(30, 70%, 50%)",
        label: "1.2-1.5x baseline (Slow)",
      },
      {
        max: Infinity,
        color: "hsl(0, 70%, 50%)",
        label: "> 1.5x baseline (Critical)",
      },
    ],
  },
} as const;

/**
 * Hook to get color for a latency value based on metric type
 */
export function useHeatmapScale(metricType: MetricType) {
  const getColor = useMemo(() => {
    return (value: number, type: "absolute" | "relative" = "absolute"): string => {
      const scale = COLOR_SCALES[type];
      const range = scale.ranges.find((r) => value <= r.max);
      return range?.color || COLOR_SCALES[type].ranges[0].color;
    };
  }, []);

  const getColorForPoint = useMemo(() => {
    return (point: {
      absolute: { avg: number };
      relative: { vsBaseline: number } | null;
    }): string => {
      if (metricType === "absolute") {
        return getColor(point.absolute.avg, "absolute");
      } else if (metricType === "relative" && point.relative) {
        return getColor(point.relative.vsBaseline, "relative");
      }
      // Default to absolute if relative not available
      return getColor(point.absolute.avg, "absolute");
    };
  }, [metricType, getColor]);

  return { getColor, getColorForPoint };
}

/**
 * Get interpolated color between green and red based on normalized value (0-1)
 */
export function getInterpolatedColor(
  value: number,
  min: number,
  max: number
): string {
  // Normalize value to 0-1
  const normalized = Math.max(0, Math.min(1, (value - min) / (max - min)));

  // Interpolate hue from 120 (green) to 0 (red)
  const hue = 120 * (1 - normalized);

  return `hsl(${hue}, 70%, 50%)`;
}

/**
 * Get text color (black or white) based on background color for accessibility
 */
export function getContrastColor(backgroundColor: string): string {
  // Parse HSL color
  const match = backgroundColor.match(/hsl\((\d+),\s*(\d+)%,\s*(\d+)%\)/);
  if (!match) return "#000000";

  const lightness = parseInt(match[3]);

  // Use white text for dark backgrounds, black for light backgrounds
  return lightness < 50 ? "#ffffff" : "#000000";
}
