"use client";

import { useQuery } from "@tanstack/react-query";
import { getSlaReport } from "@/actions/sla-reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";
import { useState } from "react";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function SlaReportView({ monitorId }: { monitorId: string }) {
  const [range, setRange] = useState<"7d" | "30d">("7d");

  const { data, isLoading, error } = useQuery({
    queryKey: ["sla-report", monitorId, range],
    queryFn: () => getSlaReport(monitorId, range),
  });

  if (isLoading) {
    return <Skeleton className="h-[400px] w-full bg-zinc-900/50" />;
  }

  if (error) {
    return (
      <Card className="border-red-500/20 bg-red-500/10">
        <CardContent className="flex items-center justify-center p-6 text-red-500">
          Failed to load SLA Report
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const { aggregate, dailyBreakdown } = data;
  const isSlaMet = aggregate.uptimePct >= 99.9; // Threshold for visual cue

  // Calculate dynamic Y-axis domain
  const minUptime = Math.min(...dailyBreakdown.map((d) => d.uptimePct));
  const domainMin = Math.max(0, Math.floor(minUptime - 0.5));

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium text-foreground">SLA & Uptime Report</h3>
        <Select value={range} onValueChange={(v: "7d" | "30d") => setRange(v)}>
          <SelectTrigger className="w-[180px] bg-zinc-950/50 border-zinc-800">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent className="bg-zinc-950 border-zinc-800">
            <SelectItem value="7d">Last 7 Days</SelectItem>
            <SelectItem value="30d">Last 30 Days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Overall Uptime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className={cn(
                "text-2xl font-bold font-mono",
                isSlaMet ? "text-emerald-500" : "text-amber-500",
              )}
            >
              {aggregate.uptimePct.toFixed(3)}%
            </div>
            <p className="text-xs text-muted-foreground mt-1">Target: 99.90%</p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Downtime
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-mono">
              {aggregate.totalDowntimeMinutes}m
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              across {aggregate.totalDown} failures
            </p>
          </CardContent>
        </Card>

        <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground font-mono">
              {aggregate.totalChecks.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card
          className={cn(
            "border-dashed backdrop-blur-sm transition-colors duration-500",
            isSlaMet
              ? "bg-emerald-950/10 border-emerald-900/50"
              : "bg-red-950/10 border-red-900/50",
          )}
        >
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">SLA Status</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-2">
            {isSlaMet ? (
              <>
                <CheckCircle2 className="size-5 text-emerald-500" />
                <span className="text-lg font-bold text-emerald-500 font-mono">PASS</span>
              </>
            ) : (
              <>
                <AlertTriangle className="size-5 text-red-500" />
                <span className="text-lg font-bold text-red-500 font-mono">FAIL</span>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Daily Breakdown Chart */}
      <Card className="border-zinc-800 bg-zinc-950/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-base font-medium text-zinc-200">
            Daily Uptime Breakdown
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dailyBreakdown} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(val) => format(new Date(val as string | number), "MMM d")}
                  stroke="#52525b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  dy={10}
                />
                <YAxis
                  stroke="#52525b"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  domain={[domainMin, 100]}
                  tickFormatter={(val) => `${val}%`}
                  dx={-10}
                />
                <Tooltip
                  cursor={{ fill: "#27272a", opacity: 0.4 }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      const dateStr = format(new Date(label as string | number), "MMM d, yyyy");
                      return (
                        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-3 shadow-xl backdrop-blur-md">
                          <p className="mb-2 text-sm font-medium text-zinc-400">{dateStr}</p>
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <div
                                className={cn(
                                  "size-2 rounded-full",
                                  data.uptimePct >= 99.9 ? "bg-emerald-500" : "bg-red-500",
                                )}
                              />
                              <p className="text-sm font-bold text-zinc-100 font-mono">
                                {Number(data.uptimePct).toFixed(3)}%
                              </p>
                            </div>
                            <p className="text-xs text-zinc-400">
                              Downtime: {data.downDuration} min
                            </p>
                            <p className="text-xs text-zinc-500">
                              Checks: {data.checksTotal} (Down: {data.checksDown})
                            </p>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <ReferenceLine y={99.9} stroke="#10b981" strokeDasharray="3 3" opacity={0.5} />
                <Bar dataKey="uptimePct" radius={[4, 4, 0, 0]}>
                  {dailyBreakdown.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={entry.uptimePct >= 99.9 ? "#10b981" : "#ef4444"}
                      fillOpacity={0.8}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
