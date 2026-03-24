"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, TrendingUp, Clock, CheckCircle } from "lucide-react";
import { LatencyTimeSeries } from "./LatencyTimeSeries";
import type { RegionData } from "./hooks/useLatencyData";

interface RegionalDetailModalProps {
  monitorId: string;
  region: string | null;
  onClose: () => void;
  regionData?: RegionData;
}

export function RegionalDetailModal({
  monitorId,
  region,
  onClose,
  regionData,
}: RegionalDetailModalProps) {
  const [detailedData, setDetailedData] = useState<RegionData | null>(regionData || null);
  const [isLoading, setIsLoading] = useState(!regionData);

  useEffect(() => {
    if (!region || regionData) return;

    // Fetch detailed 24-hour data for this region
    async function fetchRegionalDetail() {
      try {
        setIsLoading(true);
        const res = await fetch(
          `/api/monitors/${monitorId}/latency-heatmap?timeRange=24h&region=${region}`,
        );
        if (!res.ok) throw new Error("Failed to fetch regional data");
        const data = (await res.json()) as any;
        const regionInfo = data.regions.find((r: RegionData) => r.region === region);
        setDetailedData(regionInfo || null);
      } catch (error) {
        console.error("[RegionalDetailModal] Error:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchRegionalDetail();
  }, [monitorId, region, regionData]);

  if (!region) return null;

  const currentData = detailedData?.data[detailedData.data.length - 1];
  const hasIncident = detailedData?.currentIncident;

  return (
    <Dialog open={!!region} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto border-primary/20 bg-background/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <span className="text-2xl">{getRegionFlag(region)}</span>
            <div className="flex-1">
              <div className="text-xl font-bold">{getRegionName(region)}</div>
              <div className="text-sm text-muted-foreground font-normal">
                Regional Performance Details
              </div>
            </div>
            {hasIncident && (
              <Badge
                variant="outline"
                className="gap-1 border-destructive/50 text-destructive animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]"
              >
                <AlertCircle className="h-3 w-3" />
                Active Incident
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        {isLoading && (
          <div className="space-y-4">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        )}

        {!isLoading && detailedData && (
          <div className="space-y-6">
            {/* Current Metrics Grid */}
            <div>
              <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Current Metrics
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                <MetricCard
                  label="Average"
                  value={`${Math.round(currentData?.absolute.avg || 0)}ms`}
                  icon={<Clock className="h-4 w-4" />}
                />
                <MetricCard
                  label="P50 (Median)"
                  value={`${Math.round(currentData?.absolute.p50 || 0)}ms`}
                />
                <MetricCard label="P95" value={`${Math.round(currentData?.absolute.p95 || 0)}ms`} />
                <MetricCard label="P99" value={`${Math.round(currentData?.absolute.p99 || 0)}ms`} />
                <MetricCard label="Min" value={`${Math.round(currentData?.absolute.min || 0)}ms`} />
                <MetricCard label="Max" value={`${Math.round(currentData?.absolute.max || 0)}ms`} />
              </div>
            </div>

            {/* Success Rate & Baseline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="p-4 rounded-lg border border-primary/10 bg-card/50 backdrop-blur-sm">
                <div className="flex items-center gap-2 mb-2 uppercase tracking-wider text-xs text-muted-foreground">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="font-medium">Success Rate</span>
                </div>
                <div className="text-2xl font-bold font-mono tracking-tight">
                  {((currentData?.successRate || 0) * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-muted-foreground mt-1 font-mono">
                  {currentData?.sampleCount || 0} samples
                </div>
              </div>

              {detailedData.baseline && (
                <div className="p-4 rounded-lg border border-primary/10 bg-card/50 backdrop-blur-sm">
                  <div className="text-xs font-medium mb-2 uppercase tracking-wider text-muted-foreground">
                    30-Day Baseline
                  </div>
                  <div className="text-2xl font-bold font-mono tracking-tight">
                    {Math.round(detailedData.baseline)}ms
                  </div>
                  {currentData?.relative && (
                    <div className="text-xs text-muted-foreground mt-1 font-mono">
                      Current: {currentData.relative.vsBaseline.toFixed(2)}x baseline
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 24-Hour Trend Chart */}
            <div>
              <h3 className="text-sm font-semibold mb-3">24-Hour Trend</h3>
              <LatencyTimeSeries data={detailedData.data} />
            </div>

            {/* Incident Information */}
            {hasIncident && (
              <div className="p-4 rounded-lg border border-destructive/50 bg-destructive/5 relative overflow-hidden">
                {/* Scanline effect for alert */}
                <div className="absolute inset-0 bg-[linear-gradient(transparent_50%,rgba(0,0,0,0.1)_50%)] bg-size-[100%_4px] pointer-events-none opacity-20" />

                <h3 className="text-sm font-semibold mb-2 flex items-center gap-2 text-destructive">
                  <AlertCircle className="h-4 w-4" />
                  Active Incident
                </h3>
                <div className="space-y-1 text-sm relative z-10">
                  <div>
                    <span className="text-muted-foreground">Status:</span>{" "}
                    <Badge variant="outline" className="border-destructive/30 text-destructive">
                      {detailedData.currentIncident?.status}
                    </Badge>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Started:</span>{" "}
                    {new Date(detailedData.currentIncident?.startedAt || "").toLocaleString()}
                  </div>
                  <div>
                    <span className="text-muted-foreground">Duration:</span>{" "}
                    {getDuration(detailedData.currentIncident?.startedAt || "")}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

/**
 * Metric Card Component
 */
function MetricCard({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="p-3 rounded-lg border border-primary/10 bg-card/50 backdrop-blur-sm hover:border-primary/30 transition-colors">
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1 uppercase tracking-wider">
        {icon}
        {label}
      </div>
      <div className="text-lg font-bold font-mono tracking-tight">{value}</div>
    </div>
  );
}

/**
 * Get region flag emoji
 */
function getRegionFlag(region: string): string {
  const flags: Record<string, string> = {
    "us-east": "🇺🇸",
    "us-west": "🇺🇸",
    "eu-west": "🇪🇺",
    "eu-central": "🇪🇺",
    "ap-south": "🇮🇳",
    "ap-southeast": "🇸🇬",
  };
  return flags[region] || "🌍";
}

/**
 * Get human-readable region name
 */
function getRegionName(region: string): string {
  const names: Record<string, string> = {
    "us-east": "US East",
    "us-west": "US West",
    "eu-west": "EU West",
    "eu-central": "EU Central",
    "ap-south": "Asia Pacific (India)",
    "ap-southeast": "Southeast Asia (Singapore)",
  };
  return names[region] || region;
}

/**
 * Calculate duration from start time
 */
function getDuration(startedAt: string): string {
  const start = new Date(startedAt);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 60) return `${diffMins} minutes`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hours`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} days`;
}
