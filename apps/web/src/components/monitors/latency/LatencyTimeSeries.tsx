"use client";

import { useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { format } from "date-fns";
import type { LatencyDataPoint } from "./hooks/useLatencyData";

interface LatencyTimeSeriesProps {
  data: LatencyDataPoint[];
  showPercentiles?: boolean;
}

export function LatencyTimeSeries({
  data,
  showPercentiles = true,
}: LatencyTimeSeriesProps) {
  const chartData = useMemo(() => {
    return data.map((point) => ({
      timestamp: point.timestamp * 1000, // Convert to ms
      avg: Math.round(point.absolute.avg),
      p50: Math.round(point.absolute.p50),
      p95: Math.round(point.absolute.p95),
      p99: Math.round(point.absolute.p99),
      successRate: point.successRate,
    }));
  }, [data]);

  if (chartData.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-muted-foreground">
        No data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />

        <XAxis
          dataKey="timestamp"
          type="number"
          domain={["auto", "auto"]}
          tickFormatter={(timestamp) => format(new Date(timestamp), "HH:mm")}
          className="text-xs"
        />

        <YAxis
          label={{ value: "Latency (ms)", angle: -90, position: "insideLeft" }}
          className="text-xs"
        />

        <Tooltip content={<CustomTooltip />} />

        <Legend />

        <Line
          type="monotone"
          dataKey="avg"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          name="Average"
          dot={false}
        />

        {showPercentiles && (
          <>
            <Line
              type="monotone"
              dataKey="p50"
              stroke="hsl(120, 70%, 50%)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              name="P50"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="p95"
              stroke="hsl(30, 70%, 50%)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              name="P95"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="p99"
              stroke="hsl(0, 70%, 50%)"
              strokeWidth={1.5}
              strokeDasharray="5 5"
              name="P99"
              dot={false}
            />
          </>
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

/**
 * Renders a custom tooltip component displaying performance metrics.
 *
 * The CustomTooltip function checks if the tooltip should be active and if there is valid payload data.
 * If conditions are met, it extracts the relevant data and formats it for display, including average response times and success rates.
 * The tooltip is styled with a background, borders, and spacing for a visually appealing presentation.
 *
 * @param {Object} props - The properties for the tooltip.
 * @param {boolean} props.active - Indicates if the tooltip is active.
 * @param {Array} props.payload - The data payload containing performance metrics.
 */
function CustomTooltip({ active, payload }: any) {
  if (!active || !payload || payload.length === 0) return null;

  const data = payload[0].payload;

  return (
    <div className="bg-popover/80 backdrop-blur-md border border-primary/20 rounded-lg shadow-xl p-3 text-sm">
      <div className="font-semibold mb-2 border-b border-primary/10 pb-2">
        {format(new Date(data.timestamp), "MMM d, HH:mm")}
      </div>
      <div className="space-y-1">
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-xs uppercase tracking-wider">
            Average:
          </span>
          <span className="font-medium font-mono">{data.avg}ms</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-xs uppercase tracking-wider">
            P50:
          </span>
          <span className="font-medium font-mono">{data.p50}ms</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-xs uppercase tracking-wider">
            P95:
          </span>
          <span className="font-medium font-mono">{data.p95}ms</span>
        </div>
        <div className="flex items-center justify-between gap-4">
          <span className="text-muted-foreground text-xs uppercase tracking-wider">
            P99:
          </span>
          <span className="font-medium font-mono">{data.p99}ms</span>
        </div>
        <div className="flex items-center justify-between gap-4 pt-2 mt-1 border-t border-primary/10">
          <span className="text-muted-foreground text-xs uppercase tracking-wider">
            Success:
          </span>
          <span className="font-medium font-mono text-green-500">
            {(data.successRate * 100).toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
