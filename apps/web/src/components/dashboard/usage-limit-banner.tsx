"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { AlertTriangle, ArrowRight, X } from "lucide-react";
import type { UsageSummary } from "@/lib/billing";

interface UsageLimitBannerProps {
  summary?: UsageSummary;
}

export function UsageLimitBanner({ summary }: UsageLimitBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const isDismissed = sessionStorage.getItem(
      "pulseguard_dismissed_usage_alert",
    );
    if (isDismissed === "true") {
      setDismissed(true);
    }
  }, []);

  if (
    dismissed ||
    !summary ||
    !summary.isApproachingLimit ||
    summary.warnings.length === 0
  ) {
    return null;
  }

  const handleDismiss = () => {
    setDismissed(true);
    sessionStorage.setItem("pulseguard_dismissed_usage_alert", "true");
  };

  return (
    <div className="relative overflow-hidden rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 backdrop-blur-md transition-all">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-start gap-3 flex-1">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10 text-amber-400 border border-amber-500/30">
            <AlertTriangle className="h-5 w-5 animate-pulse" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h4 className="text-sm font-semibold text-amber-200">
                Approaching Plan Quota Capacity
              </h4>
              <span className="font-mono text-[10px] text-amber-400/80 uppercase tracking-wider">
                {summary.plan} PLAN
              </span>
            </div>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs text-zinc-300">
              {summary.warnings.map((w) => (
                <div
                  key={w.resource}
                  className="flex items-center gap-2 min-w-[180px]"
                >
                  <span className="font-mono text-zinc-400">{w.label}:</span>
                  <span className="font-mono font-bold text-amber-300">
                    {w.used}/{w.limit} ({w.percentage}%)
                  </span>
                  <div className="w-16 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${w.percentage >= 90 ? "bg-red-500" : "bg-amber-400"}`}
                      style={{ width: `${Math.min(w.percentage, 100)}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 self-end md:self-center shrink-0">
          <Link
            href={"/dashboard/settings?tab=billing" as any}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/20 border border-amber-500/40 px-3 py-1.5 text-xs font-semibold text-amber-200 hover:bg-amber-500/30 transition-all"
          >
            Upgrade Plan
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <button
            onClick={handleDismiss}
            className="rounded-lg p-1.5 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            title="Dismiss warning"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
