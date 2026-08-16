"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Sparkles,
  MousePointer,
  Users,
  TrendingUp,
  Copy,
  Check,
  ExternalLink,
  Eye,
  Repeat,
  Share2,
} from "lucide-react";
import { getStatusPageLoopMetrics } from "@/actions/referrals";
import { toast } from "@/components/ui/sonner";

interface StatusPageLoopCardProps {
  pageId: string;
  pageSlug: string;
  onNavigateToShowcase?: () => void;
}

export function StatusPageLoopCard({
  pageId,
  pageSlug,
  onNavigateToShowcase,
}: StatusPageLoopCardProps) {
  const [copied, setCopied] = useState(false);

  const { data: metrics, isLoading } = useQuery({
    queryKey: ["status-page-loop-metrics", pageId, pageSlug],
    queryFn: () => getStatusPageLoopMetrics(pageId, pageSlug),
  });

  const handleCopyLink = () => {
    if (!metrics?.referralUrl) return;
    navigator.clipboard.writeText(metrics.referralUrl);
    setCopied(true);
    toast.success("Tracked referral link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  const referralUrl = metrics?.referralUrl || "";

  return (
    <div className="rounded-sm border border-primary/20 bg-primary/5 p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded bg-primary/10 border border-primary/30 text-primary">
              <Repeat className="size-4 animate-spin-slow" />
            </div>
            <h3 className="text-sm font-bold font-mono uppercase tracking-wider text-foreground flex items-center gap-2">
              The Status Page Loop
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                Active Channel
              </span>
            </h3>
          </div>
          <p className="text-xs text-muted-foreground font-mono leading-relaxed">
            Every public visitor sees the{" "}
            <strong className="text-foreground">"Powered by PulseGuard"</strong> badge. Badge
            discovery compounds as traffic increases — all clicks and referred accounts are
            attributed directly to you.
          </p>
        </div>

        {onNavigateToShowcase && (
          <button
            type="button"
            onClick={onNavigateToShowcase}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-sm border border-primary/30 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-mono font-bold uppercase tracking-wider transition-colors shrink-0"
          >
            <Sparkles className="size-3.5" />
            Embed Badges
          </button>
        )}
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-black/50 border border-white/10 rounded-sm p-3.5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-mono uppercase tracking-wider">Impressions</span>
            <Eye className="size-3.5 text-sky-400" />
          </div>
          <p className="text-xl font-bold font-mono text-foreground">
            {isLoading ? "..." : (metrics?.statusPageViews ?? 0).toLocaleString()}
          </p>
          <p className="text-[9px] text-muted-foreground font-mono">Status page views</p>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-sm p-3.5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-mono uppercase tracking-wider">Badge Clicks</span>
            <MousePointer className="size-3.5 text-cyan-400" />
          </div>
          <p className="text-xl font-bold font-mono text-cyan-400">
            {isLoading ? "..." : (metrics?.referralClicks ?? 0).toLocaleString()}
          </p>
          <p className="text-[9px] text-muted-foreground font-mono">Tracked badge hits</p>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-sm p-3.5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-mono uppercase tracking-wider">Loop Signups</span>
            <Users className="size-3.5 text-emerald-400" />
          </div>
          <p className="text-xl font-bold font-mono text-emerald-400">
            {isLoading ? "..." : (metrics?.totalSignups ?? 0).toLocaleString()}
          </p>
          <p className="text-[9px] text-muted-foreground font-mono">Converted accounts</p>
        </div>

        <div className="bg-black/50 border border-white/10 rounded-sm p-3.5 space-y-1">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-[10px] font-mono uppercase tracking-wider">Conversion Rate</span>
            <TrendingUp className="size-3.5 text-amber-400" />
          </div>
          <p className="text-xl font-bold font-mono text-amber-400">
            {isLoading ? "..." : `${metrics?.conversionRate ?? 0}%`}
          </p>
          <p className="text-[9px] text-muted-foreground font-mono">Signups / views</p>
        </div>
      </div>

      {/* Tracked Link Section */}
      <div className="bg-black/40 border border-white/10 rounded-sm p-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-[10px] font-bold font-mono uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
            <Share2 className="size-3 text-primary" />
            Tracked Referral Endpoint (Auto-linked in footer badge)
          </label>
          {metrics?.referralCode && (
            <span className="text-[10px] font-mono text-primary font-bold">
              Code: {metrics.referralCode}
            </span>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2">
          <input
            type="text"
            readOnly
            value={referralUrl || "Loading tracked referral link..."}
            className="w-full bg-black/60 border border-white/10 rounded-sm px-3 py-2 text-xs font-mono text-slate-300 focus:outline-none select-all"
          />

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <button
              type="button"
              onClick={handleCopyLink}
              disabled={!referralUrl}
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2 bg-primary text-black font-mono font-bold text-xs uppercase tracking-wider rounded-sm hover:bg-primary/90 transition-all cursor-pointer disabled:opacity-50"
            >
              {copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
              {copied ? "Copied" : "Copy"}
            </button>

            {referralUrl && (
              <a
                href={referralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 border border-white/10 bg-white/5 hover:bg-white/10 rounded-sm text-muted-foreground hover:text-foreground transition-all"
                title="Test referral link"
              >
                <ExternalLink className="size-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
