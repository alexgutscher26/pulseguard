"use client";

import React from "react";
import Link from "next/link";
import { Lock, Sparkles, ArrowRight } from "lucide-react";
import { isFeatureEnabled, getFeatureError, type FeatureFlag } from "@/lib/feature-flags";
import type { PlanTier } from "@/lib/billing";

interface FeatureGateProps {
  flag: FeatureFlag;
  plan?: PlanTier;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  showUpgradeCard?: boolean;
}

export function FeatureGate({
  flag,
  plan = "INITIATE",
  children,
  fallback,
  showUpgradeCard = true,
}: FeatureGateProps) {
  const allowed = isFeatureEnabled(plan, flag);

  if (allowed) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  if (!showUpgradeCard) {
    return null;
  }

  return (
    <div className="relative overflow-hidden rounded-xl border border-cyan-500/20 bg-slate-950/80 p-6 backdrop-blur-md transition-all hover:border-cyan-500/40">
      <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl" />
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h4 className="font-semibold text-slate-100">Pro Feature Locked</h4>
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-xs font-medium text-amber-400 border border-amber-500/20">
                <Sparkles className="h-3 w-3" /> Upgrade Required
              </span>
            </div>
            <p className="mt-1 text-sm text-slate-400">{getFeatureError(flag)}</p>
          </div>
        </div>
        <Link
          href={"/dashboard/settings?tab=billing" as any}
          className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 px-4 py-2 text-sm font-medium text-white shadow-lg shadow-cyan-500/20 transition-all hover:from-cyan-400 hover:to-blue-500 active:scale-[0.98]"
        >
          Upgrade Plan
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    </div>
  );
}
