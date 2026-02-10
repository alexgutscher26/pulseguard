"use client";

import { useMemo } from "react";
import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import { format } from "date-fns";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useUserPreferences } from "@/hooks/use-user-preferences";

type LatencyDataPoint = {
  timestamp: string;
  avgLatency: number;
  minLatency: number;
  maxLatency: number;
  p95Latency: number;
};

interface ResponseTimeChartProps {
  data: LatencyDataPoint[];
  isLoading?: boolean;
  className?: string;
}

export function ResponseTimeChart({ data, isLoading, className }: ResponseTimeChartProps) {
  // Get user preferences for timezone
  const { data: preferences } = useUserPreferences();
  const timeZone = preferences?.timezone || "UTC";

  // Determine chart color based on overall health (latest or average)
  const chartColor = useMemo(() => {
    if (!data.length) return "#10b981"; // Emerald-500

    // Calculate simple average of the dataset for color determination
    const totalLatency = data.reduce((sum, item) => sum + item.avgLatency, 0);
    const avg = totalLatency / data.length;

    if (avg > 1000) return "#ef4444"; // Red-500
    if (avg > 500) return "#f59e0b"; // Amber-500
    return "#10b981"; // Emerald-500
  }, [data]);

  const formatTime = (timeStr: string | number | undefined) => {
    if (!timeStr) return "";
    try {
      return new Date(timeStr).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone,
      });
    } catch (e) {
      return format(new Date(timeStr), "HH:mm");
    }
  };

  const formatTooltipTime = (timeStr: string | number | undefined) => {
    if (!timeStr) return "";
    try {
      return new Date(timeStr).toLocaleString("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
        timeZone,
      });
    } catch {
      return format(new Date(timeStr), "MMM d, HH:mm");
    }
  };

  if (isLoading) {
    return (
      <Card
        className={cn(
          "flex min-h-[350px] items-center justify-center border-border/50 bg-background/50",
          className,
        )}
      >
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </Card>
    );
  }

  if (!data?.length) {
    return (
      <Card
        className={cn(
          "flex min-h-[350px] items-center justify-center border-border/50 bg-background/50",
          className,
        )}
      >
        <p className="text-muted-foreground">No traffic data available for this period.</p>
      </Card>
    );
  }

  return (
    <Card
      className={cn("overflow-hidden border-zinc-800 bg-zinc-950/50 backdrop-blur-sm", className)}
    >
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg font-medium text-zinc-100">
          Response Time
          <span className="text-xs font-normal text-zinc-500">(24h)</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pl-0">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="latencyGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.5} />
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0.1} />
                </linearGradient>
                <filter id="neon-glow" height="200%">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="4" result="blur" />
                  <feOffset in="blur" dx="0" dy="0" result="offsetBlur" />
                  <feFlood floodColor={chartColor} floodOpacity="0.6" result="glowColor" />
                  <feComposite in="glowColor" in2="offsetBlur" operator="in" result="glow" />
                  <feMerge>
                    <feMergeNode in="glow" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>
              <CartesianGrid
                vertical={false}
                strokeDasharray="3 3"
                stroke="#3f3f46"
                opacity={0.4}
              />
              <XAxis
                dataKey="timestamp"
                tickFormatter={formatTime}
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                minTickGap={50}
                dy={10}
              />
              <YAxis
                stroke="#a1a1aa"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `${value}ms`}
                dx={-10}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-zinc-900 p-3 shadow-xl backdrop-blur-sm ring-1 ring-zinc-800">
                        <p className="mb-2 text-sm font-medium text-zinc-400">
                          {formatTooltipTime(label)}
                        </p>
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-2 w-2 rounded-full"
                              style={{ backgroundColor: chartColor }}
                            />
                            <span className="text-sm font-bold text-zinc-100">
                              {Number(payload[0].value).toFixed(0)} ms
                            </span>
                            <span className="text-xs text-zinc-500">(avg)</span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
                cursor={{ stroke: chartColor, opacity: 0.2 }}
              />
              <Area
                type="monotone"
                dataKey="avgLatency"
                stroke={chartColor}
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#latencyGradient)"
                style={{ filter: "url(#neon-glow)" }}
                isAnimationActive={true}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
