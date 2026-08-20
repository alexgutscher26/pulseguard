"use client";

import { cn } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";

interface UptimePercentageCardProps {
  current: number;
  previous: number;
  trend: "up" | "down" | "stable";
  difference: number;
  period: number; // days
  className?: string;
}

export function UptimePercentageCard({
  current,
  previous,
  trend,
  difference,
  period,
  className,
}: UptimePercentageCardProps) {
  const getUptimeColor = (uptime: number) => {
    if (uptime >= 99.9) return "text-green-500";
    if (uptime >= 99) return "text-yellow-500";
    return "text-red-500";
  };

  const getUptimeBgColor = (uptime: number) => {
    if (uptime >= 99.9) return "from-green-500/10 to-green-500/5";
    if (uptime >= 99) return "from-yellow-500/10 to-yellow-500/5";
    return "from-red-500/10 to-red-500/5";
  };

  const getTrendIcon = () => {
    switch (trend) {
      case "up":
        return <TrendingUp className="size-5 text-green-500" />;
      case "down":
        return <TrendingDown className="size-5 text-red-500" />;
      default:
        return <Minus className="size-5 text-muted-foreground" />;
    }
  };

  const safeCurrent = typeof current === "number" && !isNaN(current) ? current : 100;
  const safePrevious = typeof previous === "number" && !isNaN(previous) ? previous : 100;
  const safeDifference = typeof difference === "number" && !isNaN(difference) ? difference : 0;

  const getTrendText = () => {
    if (trend === "stable") return "No change";
    const prefix = safeDifference >= 0 ? "+" : "";
    return `${prefix}${safeDifference.toFixed(2)}%`;
  };

  const getTrendColor = () => {
    if (trend === "up") return "text-green-500";
    if (trend === "down") return "text-red-500";
    return "text-muted-foreground";
  };

  // Calculate visual fill percentage (scaled to show difference between 95-100%)
  const visualPercentage = Math.min(100, Math.max(0, (safeCurrent - 95) * 20));

  return (
    <div
      className={cn(
        "relative rounded-sm border border-primary/20 bg-card/40 p-6 backdrop-blur-sm overflow-hidden group",
        className,
      )}
    >
      {/* Background gradient based on status */}
      <div
        className={cn(
          "absolute inset-0 bg-linear-to-br opacity-50 transition-opacity group-hover:opacity-70",
          getUptimeBgColor(safeCurrent),
        )}
      />

      {/* Content */}
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Activity className="size-4 text-primary" />
            <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground font-bold">
              Uptime ({period}d)
            </span>
          </div>
          {getTrendIcon()}
        </div>

        {/* Main percentage */}
        <div className="mb-4">
          <div
            className={cn(
              "text-5xl font-bold font-mono tracking-tight",
              getUptimeColor(safeCurrent),
            )}
          >
            {safeCurrent.toFixed(2)}
            <span className="text-2xl">%</span>
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-2 bg-muted/30 rounded-full overflow-hidden mb-4">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-500",
              safeCurrent >= 99.9
                ? "bg-green-500"
                : safeCurrent >= 99
                  ? "bg-yellow-500"
                  : "bg-red-500",
            )}
            style={{ width: `${visualPercentage}%` }}
          />
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1">
              vs Previous Period
            </div>
            <div className={cn("text-sm font-bold font-mono", getTrendColor())}>
              {getTrendText()}
            </div>
          </div>
          <div className="text-right">
            <div className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60 mb-1">
              Previous
            </div>
            <div className="text-sm font-mono text-muted-foreground">
              {safePrevious.toFixed(2)}%
            </div>
          </div>
        </div>

        {/* SLA indicator */}
        <div className="mt-4 pt-4 border-t border-primary/10">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/60">
              SLA Target: 99.9%
            </span>
            <span
              className={cn(
                "text-[10px] font-mono uppercase tracking-widest font-bold",
                safeCurrent >= 99.9 ? "text-green-500" : "text-red-500",
              )}
            >
              {safeCurrent >= 99.9 ? "✓ Met" : "✗ Below"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
